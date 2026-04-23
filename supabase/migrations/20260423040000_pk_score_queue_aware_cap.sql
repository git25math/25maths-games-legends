-- PK score cap: 50000 was simultaneously too tight and too loose.
--
-- TOO TIGHT — legit top scores get rejected:
--   per-q = reward × streakMult × diffMult × doubleMult × dailyMult × hotTopicMult × (1 + heroBonus)
--   peak multipliers: 2 (streak≥5) × 2 (red) × 2 (double card Q3+) × 3 (daily) × 1.5 (hot topic) × 1.3 (hero)
--   sum factor across classic 5Q with streak ramp + double kicking in at Q3+:
--     Σ(streak_i × double_i) = 1·1 + 1·1 + 1.5·1 + 1.5·2 + 2·2 = 10.5
--   → max_total = reward × 2 × 3 × 1.5 × 1.3 × 10.5 ≈ reward × 123
--   33 missions carry reward ≥ 600 (14×600, 2×620, 2×650, 5×700, 5×800, 2×850, 1×900, 1×950, 1×1000)
--   so reward=600 legitimately hits ~73800, crashes past the 50k cap.
--   Legit top-scoring students would RAISE, client does optimistic finishedAt but
--   server has no record → opponent never sees them finish → room hangs forever.
--
-- TOO LOOSE — attacker submits 49999 at will, still within cap.
--
-- FIX: derive cap from queue_length (written by start_game into game_meta.generated_data.queue).
--   per-Q generous ceiling: 40000 (covers reward=1000 × 123 / 5 ≈ 24600 + buffer)
--   total cap = queue_len × 40000
--   legacy/static missions (no queue): fall back to 100000 absolute
--
-- Keeps the status='playing' + dedup guards from 20260423030000. Only the cap
-- calculation changes.

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
  v_queue_len INT;
  v_max_score INT;
BEGIN
  IF p_score < 0 THEN
    RAISE EXCEPTION 'PK score must be non-negative: %', p_score;
  END IF;

  SELECT * INTO v_room FROM gl_rooms WHERE id = p_room_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  IF v_room.status != 'playing' THEN
    RAISE EXCEPTION 'Match not in progress (status=%)', v_room.status;
  END IF;

  -- Queue-aware upper bound. jsonb_array_length returns NULL for missing/non-array.
  v_queue_len := jsonb_array_length(v_room.game_meta->'generated_data'->'queue');
  v_max_score := CASE
    WHEN v_queue_len IS NOT NULL AND v_queue_len > 0 THEN v_queue_len * 40000
    ELSE 100000  -- fallback for legacy rooms w/o game_meta
  END;

  IF p_score > v_max_score THEN
    RAISE EXCEPTION 'PK score % exceeds cap % (queue_len=%)',
      p_score, v_max_score, COALESCE(v_queue_len, -1);
  END IF;

  v_players := v_room.players;
  v_player := v_players->v_uid;
  IF v_player IS NULL THEN RAISE EXCEPTION 'Not in this room'; END IF;

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
