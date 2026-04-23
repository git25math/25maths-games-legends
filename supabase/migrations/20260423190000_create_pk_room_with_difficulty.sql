-- Extend create_pk_room to accept host-chosen difficulty, stored in
-- game_meta.difficulty at room creation time. Previously difficulty only
-- landed in game_meta.generated_data.difficulty when start_game fired,
-- which meant the guest couldn't see the host's choice in the lobby —
-- they were committed to 'red' or 'green' without knowing until the
-- battle started.
--
-- With this, LobbyScreen can render a difficulty pill from
-- activeRoom.gameMeta.difficulty as soon as the guest joins.

CREATE OR REPLACE FUNCTION public.create_pk_room(
  p_type TEXT,
  p_mission_id INT,
  p_player_name TEXT,
  p_char_id TEXT,
  p_difficulty TEXT DEFAULT 'green'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_existing_id UUID;
  v_room_id UUID;
  v_name TEXT;
  v_char TEXT;
  v_difficulty TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('error', 'not_authenticated');
  END IF;
  IF p_type NOT IN ('pk', 'team') THEN
    RETURN jsonb_build_object('error', 'invalid_type');
  END IF;
  IF p_mission_id IS NULL OR p_mission_id <= 0 THEN
    RETURN jsonb_build_object('error', 'invalid_mission');
  END IF;
  IF p_player_name IS NOT NULL AND char_length(p_player_name) > 64 THEN
    RETURN jsonb_build_object('error', 'player_name_too_long');
  END IF;
  IF p_char_id IS NOT NULL AND char_length(p_char_id) > 32 THEN
    RETURN jsonb_build_object('error', 'char_id_too_long');
  END IF;
  v_difficulty := COALESCE(p_difficulty, 'green');
  IF v_difficulty NOT IN ('green', 'amber', 'red') THEN
    RETURN jsonb_build_object('error', 'invalid_difficulty');
  END IF;

  v_name := COALESCE(NULLIF(trim(p_player_name), ''), 'Player');
  v_char := COALESCE(p_char_id, '');

  -- Idempotency: same host + same type + same mission in waiting state → return that room.
  -- Note: we DON'T update difficulty on a reused room; host must leave + rebuild to change.
  SELECT id INTO v_existing_id
  FROM gl_rooms
  WHERE host_id = v_uid
    AND status = 'waiting'
    AND type = p_type
    AND mission_id = p_mission_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'room_id', v_existing_id, 'reused', true);
  END IF;

  UPDATE gl_rooms
  SET status = 'finished'
  WHERE host_id = v_uid
    AND status = 'waiting';

  INSERT INTO gl_rooms (type, mission_id, status, players, host_id, game_meta)
  VALUES (
    p_type,
    p_mission_id,
    'waiting',
    jsonb_build_object(v_uid::text, jsonb_build_object(
      'name', v_name,
      'score', 0,
      'isReady', false,
      'charId', v_char
    )),
    v_uid,
    jsonb_build_object('difficulty', v_difficulty)
  )
  RETURNING id INTO v_room_id;

  RETURN jsonb_build_object('ok', true, 'room_id', v_room_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_pk_room(TEXT, INT, TEXT, TEXT, TEXT) TO authenticated;
-- Keep the old 4-arg signature around for any stale client bundles in flight
-- (Supabase routes by arg shape). New signature above is the canonical one.
