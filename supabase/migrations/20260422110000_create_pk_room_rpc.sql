-- create_pk_room RPC: server-side validated room creation for PK/team modes.
-- Parity with create_live_room. Replaces the direct INSERT from useMultiplayer.ts
-- (which bypasses all validation via the permissive gl_rooms_insert RLS policy).
--
-- Guarantees:
--   * host_id always = auth.uid() (cannot be spoofed)
--   * status always starts 'waiting'
--   * type constrained to 'pk' or 'team'
--   * mission_id validated > 0
--   * players JSONB has a known shape (single entry for caller)
--   * Idempotent: same (user, type, mission_id) with status=waiting returns existing room
--   * Auto-finishes orphan waiting rooms from same host for different missions

CREATE OR REPLACE FUNCTION public.create_pk_room(
  p_type TEXT,
  p_mission_id INT,
  p_player_name TEXT,
  p_char_id TEXT
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

  v_name := COALESCE(NULLIF(trim(p_player_name), ''), 'Player');
  v_char := COALESCE(p_char_id, '');

  -- Idempotency: same host + same type + same mission in waiting state → return that room
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

  -- Release older waiting rooms from this host (they were abandoned by creating a new one)
  UPDATE gl_rooms
  SET status = 'finished'
  WHERE host_id = v_uid
    AND status = 'waiting';

  INSERT INTO gl_rooms (type, mission_id, status, players, host_id)
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
    v_uid
  )
  RETURNING id INTO v_room_id;

  RETURN jsonb_build_object('ok', true, 'room_id', v_room_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_pk_room(TEXT, INT, TEXT, TEXT) TO authenticated;
