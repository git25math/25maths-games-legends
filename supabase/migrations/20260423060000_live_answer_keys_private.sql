-- Live Classroom answer keys: move expected_answer out of live_meta (public,
-- realtime-broadcast to every client in the room) into a separate table with
-- host-only SELECT RLS.
--
-- Problem in 20260423050000: expected_answer was stashed under
-- live_meta.current_question.expected_answer. gl_rooms SELECT is
-- `auth.role() = 'authenticated'` (20260317000000), so a student subscribed
-- to realtime would receive the answer in the same payload as the question —
-- and could then submit p_answer = expected_answer to pass the new server-
-- side grading trivially. Net effect: worse than client-trust, since it
-- looked secure.
--
-- Fix: gl_live_answer_keys table, host-only read, SECURITY DEFINER RPCs
-- bypass RLS to write (teacher) and read (submit_live_response).
-- push_live_question no longer writes expected_answer into live_meta.

-- ─── Private answer keys table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gl_live_answer_keys (
  room_id UUID NOT NULL REFERENCES gl_rooms(id) ON DELETE CASCADE,
  question_index INT NOT NULL,
  expected_answer JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (room_id, question_index)
);

ALTER TABLE public.gl_live_answer_keys ENABLE ROW LEVEL SECURITY;

-- Only the host (teacher) can read answer keys. Students never see them,
-- even if they subscribe to the table via realtime.
DROP POLICY IF EXISTS gl_live_answer_keys_select ON public.gl_live_answer_keys;
CREATE POLICY gl_live_answer_keys_select ON public.gl_live_answer_keys
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM gl_rooms
      WHERE gl_rooms.id = gl_live_answer_keys.room_id
        AND gl_rooms.host_id = auth.uid()
    )
  );

-- No direct INSERT/UPDATE/DELETE policies → only SECURITY DEFINER RPCs below
-- can write, and they enforce host_id checks themselves.

-- ─── push_live_question: write expected_answer into the private table ───────
DROP FUNCTION IF EXISTS public.push_live_question(UUID, INT, TEXT, INT, JSONB, JSONB);
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
  v_new_q_index INT;
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
  v_new_q_index := v_q_index + 1;

  -- live_meta only carries the PUBLIC fields. expected_answer deliberately
  -- absent so realtime subscribers don't see it.
  v_meta := v_meta || jsonb_build_object(
    'question_index', v_new_q_index,
    'current_question', jsonb_build_object(
      'mission_id', p_mission_id,
      'kp_id', p_kp_id,
      'pushed_at', (extract(epoch from now()) * 1000)::bigint,
      'generated_data', COALESCE(p_generated_data, '{}'::jsonb)
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

  -- Answer key goes to the private table. NULL when teacher can't pre-grade
  -- (free-response, proof, etc.); submit_live_response degrades to client-
  -- reported is_correct in that case.
  IF p_expected_answer IS NOT NULL AND p_expected_answer != 'null'::jsonb THEN
    INSERT INTO gl_live_answer_keys (room_id, question_index, expected_answer)
    VALUES (p_room_id, v_new_q_index - 1, p_expected_answer)
    ON CONFLICT (room_id, question_index) DO UPDATE
      SET expected_answer = EXCLUDED.expected_answer;
  END IF;

  RETURN jsonb_build_object('ok', true, 'question_index', v_new_q_index);
END;
$$;

GRANT EXECUTE ON FUNCTION public.push_live_question(UUID, INT, TEXT, INT, JSONB, JSONB) TO authenticated;

-- ─── submit_live_response: look up expected via the private table ────────────
CREATE OR REPLACE FUNCTION public.submit_live_response(
  p_room_id UUID,
  p_mission_id INT,
  p_question_index INT,   -- ignored; see comment below
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
  IF v_room.players->v_uid::text IS NULL THEN
    RAISE EXCEPTION 'Not in this room';
  END IF;

  v_cq := v_room.live_meta->'current_question';
  IF v_cq IS NULL OR v_cq = 'null'::jsonb THEN
    RAISE EXCEPTION 'No active question';
  END IF;

  -- Server-authoritative question index. Client p_question_index ignored.
  v_server_q_index := COALESCE((v_room.live_meta->>'question_index')::int, 0) - 1;

  -- Answer key (if teacher pushed one). SECURITY DEFINER runs as table owner;
  -- RLS on gl_live_answer_keys is bypassed automatically.
  SELECT expected_answer INTO v_expected
  FROM gl_live_answer_keys
  WHERE room_id = p_room_id AND question_index = v_server_q_index;

  IF v_expected IS NOT NULL THEN
    v_is_correct := (p_answer = v_expected);
  ELSE
    -- No key → free-response/proof question. Degrade to client claim.
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
