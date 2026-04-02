-- Live Classroom: teacher-led real-time class quiz system
-- Extends gl_rooms with 'live' type + new gl_live_responses table + 5 RPCs

-- ═══════════════════════════════════════════════════════
-- 1. Extend gl_rooms for live sessions
-- ═══════════════════════════════════════════════════════

-- Allow 'live' room type
ALTER TABLE gl_rooms DROP CONSTRAINT IF EXISTS gl_rooms_type_check;
ALTER TABLE gl_rooms ADD CONSTRAINT gl_rooms_type_check CHECK (type IN ('team', 'pk', 'live'));

-- Live session metadata (null for team/pk rooms)
ALTER TABLE gl_rooms ADD COLUMN IF NOT EXISTS live_meta JSONB DEFAULT NULL;
-- live_meta schema:
-- {
--   class_tag: string,
--   grade: number,
--   question_index: number,          -- current question number (0-based)
--   current_question: {              -- null when waiting for teacher to push
--     mission_id: number,
--     kp_id: string,
--     pushed_at: bigint (epoch ms)
--   } | null,
--   timer_secs: number | null        -- countdown per question (null = unlimited)
-- }

-- ═══════════════════════════════════════════════════════
-- 2. Per-question response tracking
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS gl_live_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES gl_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id INT NOT NULL,
  question_index INT NOT NULL DEFAULT 0,
  kp_id TEXT,
  user_answer JSONB NOT NULL DEFAULT '{}',
  is_correct BOOLEAN NOT NULL DEFAULT false,
  error_type TEXT,                    -- 'vocab'|'concept'|'method'|'reading'|'calc'
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_resp_room ON gl_live_responses(room_id);
CREATE INDEX IF NOT EXISTS idx_live_resp_user ON gl_live_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_live_resp_kp ON gl_live_responses(kp_id);
-- Composite for per-question dedup
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_resp_unique
  ON gl_live_responses(room_id, user_id, question_index);

ALTER TABLE gl_live_responses ENABLE ROW LEVEL SECURITY;

-- Students insert own responses
CREATE POLICY live_resp_insert ON gl_live_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Students read own responses
CREATE POLICY live_resp_select_own ON gl_live_responses
  FOR SELECT USING (auth.uid() = user_id);

-- Room host reads all responses for their room
CREATE POLICY live_resp_select_host ON gl_live_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM gl_rooms WHERE gl_rooms.id = room_id AND gl_rooms.host_id = auth.uid())
  );

-- Enable realtime for live responses
ALTER PUBLICATION supabase_realtime ADD TABLE gl_live_responses;

-- ═══════════════════════════════════════════════════════
-- 3. RPCs
-- ═══════════════════════════════════════════════════════

-- 3a. Teacher creates a live room + notifies class students
CREATE OR REPLACE FUNCTION create_live_room(p_class_tag TEXT, p_grade INT)
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
  -- Get teacher display name
  SELECT display_name INTO v_display_name FROM gl_user_progress WHERE user_id = v_uid;

  -- Create room
  INSERT INTO gl_rooms (type, mission_id, status, players, host_id, live_meta)
  VALUES (
    'live',
    0,  -- no mission yet, teacher will push first question
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

  -- Notify all students in this class
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

-- 3b. Student joins a live room (validates class membership)
CREATE OR REPLACE FUNCTION join_live_room(p_room_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_room gl_rooms;
  v_student gl_user_progress;
  v_class_tag TEXT;
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'room_not_found'); END IF;
  IF v_room.type != 'live' THEN RETURN jsonb_build_object('error', 'not_live_room'); END IF;
  IF v_room.status = 'finished' THEN RETURN jsonb_build_object('error', 'session_ended'); END IF;

  -- Check class membership
  v_class_tag := v_room.live_meta->>'class_tag';
  SELECT * INTO v_student FROM gl_user_progress WHERE user_id = v_uid;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'no_profile'); END IF;
  IF NOT (v_student.class_tags @> ARRAY[v_class_tag]) THEN
    RETURN jsonb_build_object('error', 'not_in_class');
  END IF;

  -- Add to players
  UPDATE gl_rooms
  SET players = players || jsonb_build_object(
    v_uid::text, jsonb_build_object(
      'name', COALESCE(v_student.display_name, 'Student'),
      'score', 0, 'isReady', true,
      'charId', COALESCE(v_student.selected_char_id, '')
    )
  )
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- 3c. Teacher pushes a question to the class
CREATE OR REPLACE FUNCTION push_live_question(
  p_room_id UUID,
  p_mission_id INT,
  p_kp_id TEXT,
  p_timer_secs INT DEFAULT NULL
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
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'room_not_found'); END IF;
  IF v_room.host_id != auth.uid() THEN RETURN jsonb_build_object('error', 'not_host'); END IF;
  IF v_room.status = 'finished' THEN RETURN jsonb_build_object('error', 'session_ended'); END IF;

  v_meta := v_room.live_meta;
  v_q_index := COALESCE((v_meta->>'question_index')::int, 0);

  -- Update live_meta with new question
  v_meta := v_meta || jsonb_build_object(
    'question_index', v_q_index + 1,
    'current_question', jsonb_build_object(
      'mission_id', p_mission_id,
      'kp_id', p_kp_id,
      'pushed_at', (extract(epoch from now()) * 1000)::bigint
    ),
    'timer_secs', p_timer_secs
  );

  -- Reset all players' finishedAt for new question (keep scores cumulative)
  DECLARE
    v_players JSONB := v_room.players;
    v_key TEXT;
    v_player JSONB;
  BEGIN
    FOR v_key, v_player IN SELECT * FROM jsonb_each(v_players) LOOP
      v_players := jsonb_set(v_players, ARRAY[v_key], v_player - 'finishedAt');
    END LOOP;

    UPDATE gl_rooms
    SET live_meta = v_meta,
        mission_id = p_mission_id,
        status = 'playing',
        players = v_players
    WHERE id = p_room_id;
  END;

  RETURN jsonb_build_object('ok', true, 'question_index', v_q_index + 1);
END;
$$;

-- 3d. Student submits answer for current question
CREATE OR REPLACE FUNCTION submit_live_response(
  p_room_id UUID,
  p_mission_id INT,
  p_question_index INT,
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
  v_score_delta INT;
BEGIN
  -- Insert response (unique index prevents duplicates per question)
  INSERT INTO gl_live_responses (room_id, user_id, mission_id, question_index, kp_id, user_answer, is_correct, error_type, duration_ms)
  VALUES (p_room_id, v_uid, p_mission_id, p_question_index, p_kp_id, p_answer, p_is_correct, p_error_type, p_duration_ms)
  ON CONFLICT (room_id, user_id, question_index) DO NOTHING;

  -- Update player score + finishedAt in room
  v_score_delta := CASE WHEN p_is_correct THEN 100 ELSE 0 END;

  UPDATE gl_rooms
  SET players = jsonb_set(
    jsonb_set(players, ARRAY[v_uid::text, 'score'],
      to_jsonb(COALESCE((players->v_uid::text->>'score')::int, 0) + v_score_delta)),
    ARRAY[v_uid::text, 'finishedAt'],
    to_jsonb((extract(epoch from now()) * 1000)::bigint)
  )
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'score_delta', v_score_delta);
END;
$$;

-- 3e. Teacher ends the session
CREATE OR REPLACE FUNCTION end_live_session(p_room_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE gl_rooms
  SET status = 'finished',
      live_meta = live_meta || jsonb_build_object('current_question', null)
  WHERE id = p_room_id AND host_id = auth.uid();

  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'not_found_or_not_host'); END IF;
  RETURN jsonb_build_object('ok', true);
END;
$$;
