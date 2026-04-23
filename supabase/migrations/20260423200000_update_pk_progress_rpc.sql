-- Let PK/team players broadcast their current question index so the opponent
-- badge in BattleHeader can show "Q 3/5" instead of a static "Solving…".
-- Without this, the only real-time signal the opponent has is "finished" vs
-- "not finished" — which for a 5-question match means 4 out of 5 questions
-- you get no feedback on your opponent's pace.
--
-- Writes to gl_rooms.players[auth.uid()].currentQIdx. One JSONB field update;
-- triggers realtime broadcast to both players. Bounded to keep the write
-- cheap and the field sane.

CREATE OR REPLACE FUNCTION public.update_pk_progress(
  p_room_id UUID,
  p_q_idx INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid TEXT := auth.uid()::TEXT;
  v_players JSONB;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_q_idx IS NULL OR p_q_idx < 0 OR p_q_idx > 200 THEN
    -- Upper bound matches the anti-flood room cap context: speed mode maxes
    -- at 50 questions, marathon 20, classic 5. 200 is generous headroom
    -- without letting a bogus Infinity through.
    RAISE EXCEPTION 'q_idx_out_of_bounds: %', p_q_idx;
  END IF;

  SELECT players INTO v_players FROM gl_rooms WHERE id = p_room_id;
  IF v_players IS NULL THEN RAISE EXCEPTION 'room_not_found'; END IF;
  IF v_players->v_uid IS NULL THEN RAISE EXCEPTION 'not_in_room'; END IF;

  UPDATE gl_rooms
  SET players = jsonb_set(
    players,
    ARRAY[v_uid, 'currentQIdx'],
    to_jsonb(p_q_idx)
  )
  WHERE id = p_room_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_pk_progress(UUID, INT) TO authenticated;
