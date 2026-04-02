-- PK Room RPCs: start_game (new) + leave_room (rewrite)
-- Fixes: host-only start validation, host leaving closes room

-- 1. start_game: server-side validation for starting a PK match
CREATE OR REPLACE FUNCTION start_game(p_room_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room gl_rooms;
  v_player_count INT;
  v_ready_count INT;
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'room_not_found'); END IF;
  IF v_room.host_id != auth.uid() THEN RETURN jsonb_build_object('error', 'not_host'); END IF;
  IF v_room.status != 'waiting' THEN RETURN jsonb_build_object('error', 'not_waiting'); END IF;

  SELECT count(*), count(*) FILTER (WHERE (value->>'isReady')::boolean = true)
  INTO v_player_count, v_ready_count
  FROM jsonb_each(v_room.players);

  IF v_player_count < 2 THEN RETURN jsonb_build_object('error', 'need_2_players'); END IF;
  IF v_ready_count < v_player_count THEN RETURN jsonb_build_object('error', 'not_all_ready'); END IF;

  UPDATE gl_rooms SET status = 'playing' WHERE id = p_room_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- 2. leave_room: rewrite to handle host leaving (closes room)
-- Must drop first: return type changed from void to jsonb
DROP FUNCTION IF EXISTS leave_room(uuid);
CREATE OR REPLACE FUNCTION leave_room(p_room_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room gl_rooms;
  v_uid UUID := auth.uid();
BEGIN
  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', true); END IF;

  -- Host leaving: finish the room so other players see it end
  IF v_room.host_id = v_uid THEN
    UPDATE gl_rooms SET status = 'finished' WHERE id = p_room_id;
    RETURN jsonb_build_object('ok', true, 'action', 'room_closed');
  END IF;

  -- Non-host leaving: remove from players JSONB
  UPDATE gl_rooms
  SET players = players - v_uid::text
  WHERE id = p_room_id;
  RETURN jsonb_build_object('ok', true, 'action', 'player_removed');
END;
$$;
