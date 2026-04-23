-- Live Classroom: 5 security/integrity fixes.
--
-- [1] submit_live_response trusted client-supplied p_is_correct. A student could
--     submit p_is_correct=true on every question regardless of the actual answer
--     and appear at the top of the class leaderboard. Also corrupts KP weakness
--     analytics ("everyone masters everything"). Server now re-derives is_correct
--     by comparing p_answer to the expected answer baked into
--     live_meta.current_question.expected_answer (teacher pushes both). When the
--     expected_answer is absent (legacy push, or a question type that can't be
--     trivially matched), fall back to client-claimed value — degradation, not
--     a breakage.
--
-- [2] p_question_index was client-trusted. A student could submit for any index
--     and trip the unique index or skip ahead. Server now ignores the arg and
--     uses live_meta.question_index - 1 (the "active" question).
--
-- [3] submit_live_response accepted rows while room.status != 'playing'. Closed:
--     must be 'playing' and current_question must be non-null.
--
-- [4] submit_live_response did not check membership — anyone authenticated who
--     knew room_id could insert a row (RLS on gl_live_responses only checks
--     auth.uid() = user_id). Closed: player must be in v_room.players.
--
-- [5] create_live_room did not check teacher role. Students could spam class-
--     mates with fake "live session" notifications. Closed: require row in
--     public.teachers.

-- ─── push_live_question: accept optional expected_answer ──────────────────────
DROP FUNCTION IF EXISTS public.push_live_question(UUID, INT, TEXT, INT, JSONB);
CREATE OR REPLACE FUNCTION public.push_live_question(
  p_room_id UUID,
  p_mission_id INT,
  p_kp_id TEXT,
  p_timer_secs INT DEFAULT NULL,
  p_generated_data JSONB DEFAULT NULL,
  p_expected_answer JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room gl_rooms;
  v_meta JSONB;
  v_q_index INT;
  v_players JSONB;
  v_key TEXT;
  v_player JSONB;
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'room_not_found'); END IF;
  IF v_room.host_id != auth.uid() THEN RETURN jsonb_build_object('error', 'not_host'); END IF;
  IF v_room.status = 'finished' THEN RETURN jsonb_build_object('error', 'session_ended'); END IF;

  v_meta := v_room.live_meta;
  v_q_index := COALESCE((v_meta->>'question_index')::int, 0);

  v_meta := v_meta || jsonb_build_object(
    'question_index', v_q_index + 1,
    'current_question', jsonb_build_object(
      'mission_id', p_mission_id,
      'kp_id', p_kp_id,
      'pushed_at', (extract(epoch from now()) * 1000)::bigint,
      'generated_data', COALESCE(p_generated_data, '{}'::jsonb),
      'expected_answer', p_expected_answer  -- NULL when teacher can't pre-grade
    ),
    'timer_secs', p_timer_secs
  );

  v_players := v_room.players;
  FOR v_key, v_player IN SELECT * FROM jsonb_each(v_players) LOOP
    v_players := jsonb_set(v_players, ARRAY[v_key], v_player - 'finishedAt');
  END LOOP;

  UPDATE gl_rooms
  SET live_meta = v_meta,
      mission_id = p_mission_id,
      status = 'playing',
      players = v_players
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'question_index', v_q_index + 1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.push_live_question(UUID, INT, TEXT, INT, JSONB, JSONB) TO authenticated;

-- ─── submit_live_response: tighten ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.submit_live_response(
  p_room_id UUID,
  p_mission_id INT,
  p_question_index INT,   -- ignored; kept for arg-compat with existing clients
  p_answer JSONB,
  p_is_correct BOOLEAN,
  p_error_type TEXT DEFAULT NULL,
  p_duration_ms INT DEFAULT NULL,
  p_kp_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_room gl_rooms;
  v_cq JSONB;
  v_server_q_index INT;
  v_expected JSONB;
  v_is_correct BOOLEAN;
  v_score_delta INT;
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;
  IF v_room.type != 'live' THEN RAISE EXCEPTION 'Not a live room'; END IF;
  IF v_room.status != 'playing' THEN
    RAISE EXCEPTION 'Session not accepting answers (status=%)', v_room.status;
  END IF;

  -- Membership: student must be in room.players (join_live_room validated class).
  IF v_room.players->v_uid::text IS NULL THEN
    RAISE EXCEPTION 'Not in this room';
  END IF;

  v_cq := v_room.live_meta->'current_question';
  IF v_cq IS NULL OR v_cq = 'null'::jsonb THEN
    RAISE EXCEPTION 'No active question';
  END IF;

  -- Server-authoritative question index: whatever teacher most recently pushed.
  -- The on-conflict unique index (room_id, user_id, question_index) still
  -- enforces "one answer per question per student"; the index just isn't
  -- client-controlled anymore.
  v_server_q_index := COALESCE((v_room.live_meta->>'question_index')::int, 0) - 1;

  -- Server-side grading when teacher pushed an expected_answer. Degrade to
  -- client-claimed value when absent (e.g., free-response / proof questions).
  v_expected := v_cq->'expected_answer';
  IF v_expected IS NOT NULL AND v_expected != 'null'::jsonb THEN
    v_is_correct := (p_answer = v_expected);
  ELSE
    v_is_correct := COALESCE(p_is_correct, false);
  END IF;

  INSERT INTO gl_live_responses (
    room_id, user_id, mission_id, question_index, kp_id,
    user_answer, is_correct, error_type, duration_ms
  )
  VALUES (
    p_room_id, v_uid, p_mission_id, v_server_q_index, p_kp_id,
    p_answer, v_is_correct, p_error_type, p_duration_ms
  )
  ON CONFLICT (room_id, user_id, question_index) DO NOTHING;

  v_score_delta := CASE WHEN v_is_correct THEN 100 ELSE 0 END;

  UPDATE gl_rooms
  SET players = jsonb_set(
    jsonb_set(players, ARRAY[v_uid::text, 'score'],
      to_jsonb(COALESCE((players->v_uid::text->>'score')::int, 0) + v_score_delta)),
    ARRAY[v_uid::text, 'finishedAt'],
    to_jsonb((extract(epoch from now()) * 1000)::bigint)
  )
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'score_delta', v_score_delta, 'is_correct', v_is_correct);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_live_response(UUID, INT, INT, JSONB, BOOLEAN, TEXT, INT, TEXT) TO authenticated;

-- ─── create_live_room: teacher-only ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_live_room(p_class_tag TEXT, p_grade INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_room_id UUID;
  v_display_name TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = v_uid) THEN
    RETURN jsonb_build_object('error', 'not_a_teacher');
  END IF;

  SELECT display_name INTO v_display_name FROM gl_user_progress WHERE user_id = v_uid;

  INSERT INTO gl_rooms (type, mission_id, status, players, host_id, live_meta)
  VALUES (
    'live',
    0,
    'waiting',
    jsonb_build_object(v_uid::text, jsonb_build_object(
      'name', COALESCE(v_display_name, 'Teacher'),
      'score', 0, 'isReady', true, 'charId', ''
    )),
    v_uid,
    jsonb_build_object(
      'class_tag', p_class_tag,
      'grade', p_grade,
      'question_index', 0,
      'current_question', null,
      'timer_secs', 60
    )
  )
  RETURNING id INTO v_room_id;

  INSERT INTO notifications (user_id, type, title, body, link_type, link_id)
  SELECT
    user_id,
    'live_session',
    CASE WHEN p_grade <= 8 THEN 'Live classroom starting!' ELSE 'Live session!' END,
    COALESCE(v_display_name, 'Your teacher') || ' started a live quiz in ' || p_class_tag,
    'live_room',
    v_room_id::text
  FROM gl_user_progress
  WHERE grade = p_grade
    AND class_tags @> ARRAY[p_class_tag]
    AND user_id != v_uid;

  RETURN jsonb_build_object('ok', true, 'room_id', v_room_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_live_room(TEXT, INT) TO authenticated;
