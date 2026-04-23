-- Anonymous Live Classroom path (PIN-based join, no auth) bypassed all the
-- hardening done in 20260423050000 / 20260423060000 for the auth path:
--   * submit_live_response_anon trusts client p_is_correct → anon student
--     claims 100% accuracy, pollutes teacher dashboard
--   * trusts client p_question_index → can replay old or skip ahead
--   * accepts submissions regardless of room.status → post-session pollution
--   * doesn't read gl_live_answer_keys for server-side grading
--
-- join_live_anonymous separately:
--   * unbounded p_nickname → 10 MB string in players JSONB → realtime DoS
--   * 8-hex-char anon_id is visible in broadcast players JSONB → another anon
--     in the same room can read it and impersonate (submit_live_response_anon
--     has no caller-binding, only 'p_anon_id is in players' check)
--   * unbounded player count → bot can flood a room with thousands of anons
--
-- Fixes:
--   * nickname: cap 64
--   * anon_id: full UUID (32 hex) instead of 8-char prefix (still visible in
--     broadcast, but un-guessable; impersonation requires actually scraping
--     the broadcast — a meaningful bar without a full token protocol)
--   * room player count cap (200, generous for any classroom)
--   * submit_live_response_anon: server-derive question_index, require
--     status='playing', read gl_live_answer_keys for grading,
--     reject when current_question is null

-- ─── join_live_anonymous: nickname cap + UUID id + player count cap ─────────
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
  v_player_count INT;
BEGIN
  IF length(v_pin) < 4 THEN
    RETURN jsonb_build_object('error', 'pin_too_short');
  END IF;
  IF p_nickname IS NOT NULL AND char_length(p_nickname) > 64 THEN
    RETURN jsonb_build_object('error', 'nickname_too_long');
  END IF;

  SELECT * INTO v_room FROM gl_rooms
    WHERE id::text ILIKE v_pin || '%'
      AND type = 'live'
      AND status != 'finished'
    ORDER BY created_at DESC LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'invalid_pin');
  END IF;

  -- Anti-flood: cap room participants. 200 covers the largest realistic class
  -- (typical class is 30-40 students). Bots adding 5000 anons → realtime
  -- broadcast tax on the teacher's connection collapses the session.
  SELECT count(*) INTO v_player_count FROM jsonb_each(v_room.players);
  IF v_player_count >= 200 THEN
    RETURN jsonb_build_object('error', 'room_full');
  END IF;

  -- Full UUID instead of 8-char prefix. The id still shows up in the players
  -- broadcast (so a determined attacker scraping realtime can still grab it),
  -- but random guessing is no longer a viable attack mode.
  v_anon_id := 'anon_' || replace(gen_random_uuid()::text, '-', '');

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

-- ─── submit_live_response_anon: parity with auth-path hardening ─────────────
CREATE OR REPLACE FUNCTION public.submit_live_response_anon(
  p_room_id uuid,
  p_anon_id text,
  p_mission_id integer,
  p_question_index integer,   -- ignored; kept for arg-compat
  p_answer jsonb,
  p_is_correct boolean,
  p_error_type text DEFAULT NULL,
  p_duration_ms integer DEFAULT NULL,
  p_kp_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room gl_rooms;
  v_cq JSONB;
  v_server_q_index INT;
  v_expected JSONB;
  v_is_correct BOOLEAN;
  v_score_delta INT;
  v_inserted INT;
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'room_not_found'); END IF;
  IF v_room.type != 'live' THEN RETURN jsonb_build_object('error', 'not_live'); END IF;
  IF v_room.status != 'playing' THEN
    RETURN jsonb_build_object('error', 'not_playing');
  END IF;

  -- Anon must already exist in players (seeded by join_live_anonymous).
  IF NOT (v_room.players ? p_anon_id) THEN
    RETURN jsonb_build_object('error', 'not_in_room');
  END IF;

  v_cq := v_room.live_meta->'current_question';
  IF v_cq IS NULL OR v_cq = 'null'::jsonb THEN
    RETURN jsonb_build_object('error', 'no_active_question');
  END IF;

  -- Server-authoritative question index (matches auth-path behavior).
  v_server_q_index := COALESCE((v_room.live_meta->>'question_index')::int, 0) - 1;

  -- Server-side grading via private answer key table.
  SELECT expected_answer INTO v_expected
  FROM gl_live_answer_keys
  WHERE room_id = p_room_id AND question_index = v_server_q_index;

  IF v_expected IS NOT NULL THEN
    v_is_correct := (p_answer = v_expected);
  ELSE
    v_is_correct := COALESCE(p_is_correct, false);
  END IF;

  INSERT INTO gl_live_responses (
    room_id, user_id, anon_id, mission_id, question_index, kp_id,
    user_answer, is_correct, error_type, duration_ms
  )
  VALUES (
    p_room_id, NULL, p_anon_id, p_mission_id, v_server_q_index, p_kp_id,
    p_answer, v_is_correct, p_error_type, p_duration_ms
  )
  ON CONFLICT (room_id, anon_id, question_index) WHERE anon_id IS NOT NULL DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted = 0 THEN
    RETURN jsonb_build_object('ok', true, 'duplicate', true);
  END IF;

  v_score_delta := CASE WHEN v_is_correct THEN 100 ELSE 0 END;
  UPDATE gl_rooms
  SET players = jsonb_set(
    jsonb_set(players, ARRAY[p_anon_id, 'score'],
      to_jsonb(COALESCE((players->p_anon_id->>'score')::int, 0) + v_score_delta)),
    ARRAY[p_anon_id, 'finishedAt'],
    to_jsonb((extract(epoch from now()) * 1000)::bigint)
  )
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'score_delta', v_score_delta, 'is_correct', v_is_correct);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_live_response_anon(uuid, text, integer, integer, jsonb, boolean, text, integer, text) TO anon, authenticated;
