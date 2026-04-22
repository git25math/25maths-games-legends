-- Codify PK room RPCs that were living only in production
-- These three functions are called from src/hooks/useMultiplayer.ts but had no migration SQL.
-- Exported via pg_get_functiondef from production on 2026-04-22 and committed here so fresh
-- environments provision correctly and the definitions survive accidental drops.

-- 1. join_room: add current auth.uid() to gl_rooms.players JSONB (only while status='waiting')
CREATE OR REPLACE FUNCTION public.join_room(p_room_id uuid, p_player_name text, p_char_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- 2. toggle_ready: flip isReady for caller inside gl_rooms.players JSONB
CREATE OR REPLACE FUNCTION public.toggle_ready(p_room_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- 3. submit_pk_score: record caller's score+finishedAt; auto-transition room to 'finished' when all players done
CREATE OR REPLACE FUNCTION public.submit_pk_score(p_room_id uuid, p_score integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- Grants so the app roles can call these RPCs (parity with 20260405000000_grant_rpc_permissions.sql)
GRANT EXECUTE ON FUNCTION public.join_room(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_ready(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_pk_score(uuid, integer) TO authenticated;
