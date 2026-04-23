-- PK score submission: three holes closed.
--
-- 1. submit_pk_score had NO status check. Attacker could call it on a room
--    in 'waiting' state, pre-stamping finishedAt. When the match later went
--    to 'playing', their score was already frozen at whatever they submitted
--    (up to the 50000 cap). Opponent's legit submit would trip the "all
--    finished" branch and close the room — attacker wins 49999 vs. opponent's
--    real score. Classic pre-submission attack.
--
-- 2. submit_pk_score allowed RE-SUBMISSION. Any player whose finishedAt was
--    set could call again and overwrite score. Enables "probe low, strike
--    high" from two tabs.
--
-- 3. start_game did not reset prior-round players.finishedAt / players.score.
--    Stale finishedAt from a previous round (or from a pre-submission attack)
--    carried over. Combined with #1, a single malicious call before start_game
--    turned into a free win.
--
-- Fixes:
--   - submit_pk_score checks status='playing' and rejects pre-submitted players
--   - start_game wipes finishedAt + score on every player before flipping status
--   - Body otherwise byte-for-byte the hardened version in 20260423000000

-- ─── Reset players + set game_meta atomically in start_game ───
CREATE OR REPLACE FUNCTION public.start_game(
  p_room_id UUID,
  p_generated_data JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room gl_rooms;
  v_player_count INT;
  v_ready_count INT;
  v_meta JSONB;
  v_reset_players JSONB;
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

  v_meta := COALESCE(v_room.game_meta, '{}'::jsonb) || jsonb_build_object(
    'generated_data', p_generated_data,
    'round', COALESCE((v_room.game_meta->>'round')::int, 0) + 1,
    'round_started_at', (extract(epoch from now()) * 1000)::bigint
  );

  -- Wipe score + finishedAt from every player so pre-round probes / prior-round
  -- results don't carry into the new round.
  SELECT jsonb_object_agg(
    key,
    (value - 'finishedAt') || jsonb_build_object('score', 0)
  )
  INTO v_reset_players
  FROM jsonb_each(v_room.players);

  UPDATE gl_rooms
  SET status = 'playing',
      game_meta = v_meta,
      players = v_reset_players
  WHERE id = p_room_id;

  RETURN jsonb_build_object('ok', true, 'round', v_meta->'round');
END;
$$;

GRANT EXECUTE ON FUNCTION public.start_game(UUID, JSONB) TO authenticated;

-- ─── Tighten submit_pk_score ───
CREATE OR REPLACE FUNCTION public.submit_pk_score(p_room_id uuid, p_score integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid TEXT := auth.uid()::TEXT;
  v_room gl_rooms;
  v_players JSONB;
  v_player JSONB;
  v_all_finished BOOLEAN := TRUE;
  v_entry JSONB;
BEGIN
  IF p_score < 0 OR p_score > 50000 THEN
    RAISE EXCEPTION 'PK score out of bounds: %', p_score;
  END IF;

  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  -- Match must actually be in progress. Blocks pre-submission attack where a
  -- malicious host submits a score while status='waiting'.
  IF v_room.status != 'playing' THEN
    RAISE EXCEPTION 'Match not in progress (status=%)', v_room.status;
  END IF;

  v_players := v_room.players;
  v_player := v_players->v_uid;
  IF v_player IS NULL THEN RAISE EXCEPTION 'Not in this room'; END IF;

  -- Prevent re-submission / score overwrite from another tab.
  IF COALESCE((v_player->>'finishedAt')::BIGINT, 0) > 0 THEN
    RAISE EXCEPTION 'Already submitted this round';
  END IF;

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

GRANT EXECUTE ON FUNCTION public.submit_pk_score(uuid, integer) TO authenticated;
