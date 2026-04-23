-- Second-pass RPC hardening (first pass was 20260422150000 + 20260422180000).
--
-- This sweep caught 8 more RPCs with missing or inadequate authorization,
-- plus 4 with missing SET search_path = public. All are SECURITY DEFINER so
-- they bypass RLS; without guards inside, any authenticated student can call
-- them and either tamper with other users' state or dump PII.

-- ═══════════════════════════════════════════════════════════════════
-- A. NO-AUTH ADMIN RPCs — full privilege escalation
-- ═══════════════════════════════════════════════════════════════════

-- assign_class: mass-tag an entire grade. Without auth, any student
-- can inject a bogus class_tag into every classmate's record.
CREATE OR REPLACE FUNCTION public.assign_class(p_grade INT, p_class TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  UPDATE gl_user_progress
  SET class_tags = array_append(class_tags, p_class),
      class_name = COALESCE(class_name, p_class),
      updated_at = now()
  WHERE grade = p_grade AND NOT (class_tags @> ARRAY[p_class]);
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- assign_student_class: tag ANY user. Without auth, student can
-- stuff any classmate into any class (e.g. "all Y7 now in EA_ELITE").
CREATE OR REPLACE FUNCTION public.assign_student_class(p_user_id UUID, p_class TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  UPDATE gl_user_progress
  SET class_tags = CASE
        WHEN class_tags @> ARRAY[p_class] THEN class_tags
        ELSE array_append(class_tags, p_class)
      END,
      class_name = COALESCE(class_name, p_class),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- remove_student_tag: detag ANY user. Without auth, student can
-- kick any classmate out of any class.
CREATE OR REPLACE FUNCTION public.remove_student_tag(p_user_id UUID, p_tag TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  UPDATE gl_user_progress
  SET class_tags = array_remove(class_tags, p_tag),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- remove_class_tag: mass-detag an entire grade. Without auth, student
-- can nuke every classmate out of any class in one call.
CREATE OR REPLACE FUNCTION public.remove_class_tag(p_grade INT, p_tag TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  UPDATE gl_user_progress
  SET class_tags = array_remove(class_tags, p_tag),
      updated_at = now()
  WHERE grade = p_grade AND class_tags @> ARRAY[p_tag];
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

GRANT EXECUTE ON FUNCTION public.assign_class(INT, TEXT)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_student_class(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_student_tag(UUID, TEXT)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_class_tag(INT, TEXT)      TO authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- B. NO-AUTH PII LEAKS — add teacher check
-- ═══════════════════════════════════════════════════════════════════

-- get_class_progress: returns SETOF gl_user_progress (full PII) for any
-- (grade, class). Same category as get_students_by_* we hardened earlier.
CREATE OR REPLACE FUNCTION public.get_class_progress(p_grade INT, p_class TEXT DEFAULT NULL)
RETURNS SETOF gl_user_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;
  RETURN QUERY
    SELECT * FROM gl_user_progress
    WHERE grade = p_grade
      AND (p_class IS NULL OR class_tags @> ARRAY[p_class])
    ORDER BY display_name;
END;
$$;

-- get_class_lesson_runs: returns student names + lesson activity for any
-- (grade, class). PII leak.
CREATE OR REPLACE FUNCTION public.get_class_lesson_runs(p_grade INT, p_class TEXT DEFAULT NULL)
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  lesson_id TEXT,
  kp_id TEXT,
  completed_at TIMESTAMPTZ,
  practice_correct INT,
  practice_total INT,
  challenge_correct INT,
  challenge_total INT,
  duration_ms INT
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
    SELECT lr.user_id, up.display_name, lr.lesson_id, lr.kp_id, lr.completed_at,
           lr.practice_correct, lr.practice_total, lr.challenge_correct,
           lr.challenge_total, lr.duration_ms
    FROM gl_lesson_runs lr
    JOIN gl_user_progress up ON lr.user_id = up.user_id
    WHERE up.grade = p_grade
      AND (p_class IS NULL OR up.class_tags @> ARRAY[p_class])
    ORDER BY lr.completed_at DESC;
END;
$$;

-- get_class_assignments: returns full assignment list including target_user_ids
-- (student list revealing who is "weak" enough to be targeted). Teachers only.
DROP FUNCTION IF EXISTS public.get_class_assignments(INT, TEXT);
CREATE OR REPLACE FUNCTION public.get_class_assignments(
  p_grade INT,
  p_class_tag TEXT
)
RETURNS TABLE(
  id UUID,
  grade INT,
  class_tag TEXT,
  mission_ids INT[],
  title TEXT,
  description TEXT,
  deadline TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  target_user_ids UUID[]
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
    SELECT a.id, a.grade, a.class_tag, a.mission_ids, a.title, a.description,
           a.deadline, a.created_by, a.created_at, a.archived_at, a.target_user_ids
    FROM gl_assignments a
    WHERE a.grade = p_grade
      AND a.class_tag = p_class_tag
    ORDER BY a.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_class_progress(INT, TEXT)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_class_lesson_runs(INT, TEXT)    TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_class_assignments(INT, TEXT)    TO authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- C. MISSING SET search_path — defense in depth
-- ═══════════════════════════════════════════════════════════════════
-- These functions already have correct auth logic but lack
-- SET search_path = public, leaving a SECURITY DEFINER injection surface
-- where a malicious schema in the caller's search_path could shadow
-- built-ins (e.g. define their own jsonb_build_object).
--
-- join_room / toggle_ready / submit_pk_score bodies were byte-for-byte
-- codified from production in 20260422000000; production was missing the
-- guard too. We re-CREATE them here with the same body + search_path.

CREATE OR REPLACE FUNCTION public.join_room(p_room_id uuid, p_player_name text, p_char_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_record RECORD;
  new_players JSONB;
BEGIN
  SELECT * INTO room_record FROM gl_rooms WHERE id = p_room_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'room_not_found');
  END IF;
  IF room_record.status != 'waiting' THEN
    RETURN jsonb_build_object('error', 'room_not_waiting');
  END IF;

  new_players := room_record.players || jsonb_build_object(
    auth.uid()::text, jsonb_build_object(
      'name', p_player_name,
      'score', 0,
      'isReady', false,
      'charId', p_char_id
    )
  );

  UPDATE gl_rooms SET players = new_players WHERE id = p_room_id;

  RETURN jsonb_build_object('success', true, 'players', new_players);
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_ready(p_room_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_record RECORD;
  player_data JSONB;
  is_ready BOOLEAN;
BEGIN
  SELECT * INTO room_record FROM gl_rooms WHERE id = p_room_id;
  IF NOT FOUND THEN RETURN; END IF;

  player_data := room_record.players -> auth.uid()::text;
  IF player_data IS NULL THEN RETURN; END IF;

  is_ready := COALESCE((player_data ->> 'isReady')::boolean, false);

  UPDATE gl_rooms
  SET players = jsonb_set(players, ARRAY[auth.uid()::text, 'isReady'],
                          to_jsonb(NOT is_ready))
  WHERE id = p_room_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_pk_score(p_room_id uuid, p_score integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid TEXT := auth.uid()::TEXT;
  v_players JSONB;
  v_player JSONB;
  v_all_finished BOOLEAN := TRUE;
  v_entry JSONB;
BEGIN
  IF p_score < 0 OR p_score > 50000 THEN
    RAISE EXCEPTION 'PK score out of bounds: %', p_score;
  END IF;

  SELECT players INTO v_players FROM gl_rooms WHERE id = p_room_id;
  IF v_players IS NULL THEN RAISE EXCEPTION 'Room not found'; END IF;

  v_player := v_players->v_uid;
  IF v_player IS NULL THEN RAISE EXCEPTION 'Not in this room'; END IF;

  v_player := v_player || jsonb_build_object(
    'score', p_score,
    'finishedAt', (extract(epoch from now()) * 1000)::BIGINT
  );
  v_players := jsonb_set(v_players, ARRAY[v_uid], v_player);

  FOR v_entry IN SELECT value FROM jsonb_each(v_players) LOOP
    IF NOT (v_entry ? 'finishedAt') OR
       COALESCE((v_entry->>'finishedAt')::BIGINT, 0) = 0 THEN
      v_all_finished := FALSE;
      EXIT;
    END IF;
  END LOOP;

  UPDATE gl_rooms
  SET players = v_players,
      status = CASE WHEN v_all_finished THEN 'finished' ELSE status END
  WHERE id = p_room_id;
END;
$$;

-- get_student_meta_progress already has auth check, only needs search_path
CREATE OR REPLACE FUNCTION public.get_student_meta_progress(p_user_id UUID)
RETURNS SETOF meta_node_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() != p_user_id
    AND NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid())
  THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
    SELECT * FROM meta_node_progress
    WHERE user_id = p_user_id
    ORDER BY kn_id, source;
END;
$$;
