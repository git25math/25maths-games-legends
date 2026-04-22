-- Codify four well-designed SECURITY DEFINER RPCs that were living only in production.
-- Bodies are byte-for-byte what pg_get_functiondef returned from production 2026-04-22.
-- These are production-tested and don't need hardening; we only need them in
-- version control so fresh environments provision correctly and the definitions
-- survive accidental drops.

-- ─── add_score: single channel for XP increments (bounds enforced server-side) ───
CREATE OR REPLACE FUNCTION public.add_score(p_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_amount = 0 THEN RETURN; END IF;
  IF p_amount > 10000 THEN
    RAISE EXCEPTION 'Score increment too large: %', p_amount;
  END IF;
  IF p_amount < -1000000 THEN
    RAISE EXCEPTION 'Score decrement too large: %', p_amount;
  END IF;
  UPDATE gl_user_progress
  SET total_score = GREATEST(0, total_score + p_amount),
      updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_score(integer) TO authenticated;

-- ─── record_battle_result: 30s dedup + auth check + service_role bypass ───
CREATE OR REPLACE FUNCTION public.record_battle_result(
  p_user_id uuid,
  p_mission_id integer,
  p_score integer,
  p_success boolean,
  p_duration_secs integer DEFAULT 0,
  p_hp_remaining integer DEFAULT 0,
  p_topic text DEFAULT NULL,
  p_kp_id text DEFAULT NULL,
  p_difficulty text DEFAULT 'green'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_is_service boolean := auth.role() = 'service_role';
  v_target_user_id uuid := CASE WHEN auth.role() = 'service_role' THEN p_user_id ELSE auth.uid() END;
  v_last_record timestamptz;
BEGIN
  IF NOT v_is_service AND (v_uid IS NULL OR p_user_id IS DISTINCT FROM v_uid) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT MAX(created_at)
  INTO v_last_record
  FROM public.gl_battle_results
  WHERE user_id = v_target_user_id
    AND mission_id = p_mission_id
    AND score = p_score
    AND created_at > now() - interval '30 seconds';

  IF v_last_record IS NOT NULL THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.gl_battle_results (
    user_id, mission_id, kp_id, difficulty_mode, success, score,
    duration_secs, hp_remaining, created_at
  )
  VALUES (
    v_target_user_id, p_mission_id, p_kp_id, COALESCE(p_difficulty, 'green'),
    p_success, p_score, COALESCE(p_duration_secs, 0), COALESCE(p_hp_remaining, 0), now()
  );

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_battle_result(uuid, integer, integer, boolean, integer, integer, text, text, text) TO authenticated;

-- ─── update_user_progress_safe: protected-fields whitelist + SP invariants ───
CREATE OR REPLACE FUNCTION public.update_user_progress_safe(p_updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_current public.gl_user_progress%ROWTYPE;
  v_new_cm jsonb;
  v_old_sp integer;
  v_new_sp integer;
  v_old_spent integer;
  v_new_spent integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_updates ?| ARRAY[
    'user_id', 'grade', 'class_name', 'class_tags',
    'total_score', 'current_level', 'stages_completed',
    'created_at', 'updated_at'
  ] THEN
    RAISE EXCEPTION 'Protected progress fields cannot be modified from the client';
  END IF;

  INSERT INTO public.gl_user_progress (user_id)
  VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_current
  FROM public.gl_user_progress
  WHERE user_id = v_uid
  FOR UPDATE;

  v_new_cm := p_updates->'completed_missions';
  IF v_new_cm IS NOT NULL THEN
    v_old_sp := COALESCE((v_current.completed_missions->>'_total_skill_points')::integer, 0);
    v_new_sp := COALESCE((v_new_cm->>'_total_skill_points')::integer, 0);
    IF v_new_sp > v_old_sp + 5 THEN
      RAISE EXCEPTION 'SP increase too large: % -> %', v_old_sp, v_new_sp;
    END IF;
    IF v_new_sp < v_old_sp THEN
      RAISE EXCEPTION 'SP cannot decrease';
    END IF;

    v_old_spent := COALESCE((v_current.completed_missions->>'_spent_skill_points')::integer, 0);
    v_new_spent := COALESCE((v_new_cm->>'_spent_skill_points')::integer, 0);
    IF v_new_spent < v_old_spent THEN
      RAISE EXCEPTION 'Spent SP cannot decrease';
    END IF;
    IF v_new_spent > v_new_sp THEN
      RAISE EXCEPTION 'Cannot spend more SP than total';
    END IF;
  END IF;

  UPDATE public.gl_user_progress
  SET completed_missions = COALESCE(v_new_cm, v_current.completed_missions),
      stats = COALESCE(p_updates->'stats', v_current.stats),
      display_name = COALESCE(p_updates->>'display_name', v_current.display_name),
      selected_char_id = COALESCE(p_updates->>'selected_char_id', v_current.selected_char_id),
      updated_at = now()
  WHERE user_id = v_uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_progress_safe(jsonb) TO authenticated;

-- ─── get_my_classes: teacher's own classes (defensive — checks table existence) ───
CREATE OR REPLACE FUNCTION public.get_my_classes()
RETURNS TABLE(id uuid, name text, grade text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF to_regclass('public.kw_classes') IS NULL THEN
    RETURN;
  END IF;

  IF to_regclass('public.teacher_classes') IS NOT NULL THEN
    RETURN QUERY
    SELECT c.id, c.name, c.grade
    FROM public.kw_classes c
    INNER JOIN public.teacher_classes tc ON tc.class_id = c.id
    WHERE tc.teacher_id = auth.uid()
    ORDER BY c.grade, c.name;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT c.id, c.name, c.grade
  FROM public.kw_classes c
  WHERE c.teacher_id = auth.uid()
  ORDER BY c.grade, c.name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_classes() TO authenticated;

-- ─── get_student_battles: self-only (or service_role) ───
CREATE OR REPLACE FUNCTION public.get_student_battles(p_user_id uuid)
RETURNS SETOF gl_battle_results
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_is_service boolean := auth.role() = 'service_role';
BEGIN
  IF NOT v_is_service AND (v_uid IS NULL OR p_user_id IS DISTINCT FROM v_uid) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
    SELECT *
    FROM public.gl_battle_results
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 100;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_student_battles(uuid) TO authenticated;
