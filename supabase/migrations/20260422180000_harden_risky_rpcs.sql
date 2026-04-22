-- Harden 4 production RPCs with missing / broken authorization.
-- Original production bodies preserved, auth checks + search_path added.

-- ═══════════════════════════════════════════════════════════════════
-- V1: delete_class_cascade — ORIGINAL HAD ZERO AUTH CHECK
-- Any authenticated user could pass any p_class_id and wipe the class
-- + its assignments + assignment_results + class-student links.
-- Fix: caller must be the class owner (kw_classes.teacher_id) OR have
-- a teacher_classes junction entry for it.
-- ═══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.delete_class_cascade(p_class_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_count INT;
  v_owned BOOLEAN;
BEGIN
  IF v_uid IS NULL THEN
    RETURN json_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  -- Defensive table-existence checks so this works in both kw_* (ExamHub) and play-only environments
  IF to_regclass('public.kw_classes') IS NULL THEN
    RETURN json_build_object('ok', false, 'error', 'no_kw_classes');
  END IF;

  -- Ownership: direct (kw_classes.teacher_id) OR via teacher_classes junction
  SELECT EXISTS (
    SELECT 1 FROM kw_classes WHERE id = p_class_id AND teacher_id = v_uid
  ) OR EXISTS (
    SELECT 1 FROM teacher_classes
    WHERE class_id = p_class_id AND teacher_id = v_uid
  )
  INTO v_owned;

  IF NOT v_owned THEN
    RETURN json_build_object('ok', false, 'error', 'not_class_owner');
  END IF;

  -- Original cascade body (preserved verbatim aside from the guard above)
  DELETE FROM assignment_results
  WHERE assignment_id IN (SELECT id FROM kw_assignments WHERE class_id = p_class_id);

  DELETE FROM kw_assignments WHERE class_id = p_class_id;

  UPDATE invite_codes SET is_active = false WHERE class_id = p_class_id;

  UPDATE leaderboard SET class_id = NULL
  WHERE class_id = p_class_id;

  DELETE FROM kw_class_students WHERE class_id = p_class_id;

  DELETE FROM kw_classes WHERE id = p_class_id;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN json_build_object('ok', true, 'deleted', v_count > 0);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('ok', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_class_cascade(uuid) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- V2: get_class_battle_stats — ORIGINAL LEAKED ANY CLASS'S STATS
-- LANGUAGE sql → no inline auth check possible. Convert to plpgsql.
-- Fix: require caller is a teacher (shared `teachers` table check,
-- same pattern as get_student_kp_progress / get_students_by_*).
-- ═══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_class_battle_stats(
  p_grade integer,
  p_class text DEFAULT NULL,
  p_since timestamptz DEFAULT (now() - interval '7 days')
)
RETURNS TABLE(
  user_id uuid,
  display_name text,
  battles bigint,
  wins bigint,
  total_score bigint,
  avg_duration bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  RETURN QUERY
    SELECT b.user_id,
           u.display_name,
           COUNT(*) AS battles,
           COUNT(*) FILTER (WHERE b.success) AS wins,
           COALESCE(SUM(b.score), 0) AS total_score,
           COALESCE(AVG(b.duration_secs), 0)::BIGINT AS avg_duration
    FROM gl_battle_results b
    JOIN gl_user_progress u ON u.user_id = b.user_id
    WHERE u.grade = p_grade
      AND (p_class IS NULL OR u.class_tags @> ARRAY[p_class])
      AND b.created_at >= p_since
    GROUP BY b.user_id, u.display_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_class_battle_stats(integer, text, timestamptz) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- V3: get_class_kp_progress — same issue, same fix
-- ═══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_class_kp_progress(
  p_grade integer,
  p_class text DEFAULT NULL
)
RETURNS TABLE(
  user_id uuid,
  display_name text,
  kp_id text,
  wins integer,
  attempts integer,
  mastered_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  RETURN QUERY
    SELECT p.user_id,
           u.display_name,
           p.kp_id,
           p.wins,
           p.attempts,
           p.mastered_at
    FROM play_kp_progress p
    JOIN gl_user_progress u ON u.user_id = p.user_id
    WHERE u.grade = p_grade
      AND (p_class IS NULL OR u.class_tags @> ARRAY[p_class]);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_class_kp_progress(integer, text) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- V4: join_live_anonymous — ORIGINAL ACCEPTED ARBITRARILY SHORT PINs
-- Empty string or a single char would match ~1/16 of all active live
-- rooms; attacker could brute-force into any teacher's session.
-- Fix: require PIN length ≥ 4 (UUID prefix still unique enough for
-- legitimate flow, but no longer trivially guessable).
-- ═══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.join_live_anonymous(p_pin text, p_nickname text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pin TEXT := COALESCE(TRIM(p_pin), '');
  v_room gl_rooms;
  v_anon_id TEXT;
BEGIN
  IF length(v_pin) < 4 THEN
    RETURN jsonb_build_object('error', 'pin_too_short');
  END IF;

  SELECT * INTO v_room FROM gl_rooms
    WHERE id::text ILIKE v_pin || '%'
      AND type = 'live'
      AND status != 'finished'
    ORDER BY created_at DESC LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'invalid_pin');
  END IF;

  v_anon_id := 'anon_' || substr(gen_random_uuid()::text, 1, 8);

  UPDATE gl_rooms
  SET players = players || jsonb_build_object(
    v_anon_id, jsonb_build_object(
      'name', COALESCE(NULLIF(TRIM(p_nickname), ''), 'Player'),
      'score', 0, 'isReady', true,
      'charId', '', 'isAnonymous', true
    )
  )
  WHERE id = v_room.id;

  RETURN jsonb_build_object('ok', true, 'room_id', v_room.id, 'anon_id', v_anon_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_live_anonymous(text, text) TO anon, authenticated;
