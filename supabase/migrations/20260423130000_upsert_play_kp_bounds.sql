-- upsert_play_kp had auth + user_id match but zero bounds on p_score or
-- p_kp_id. A student could:
--   * Inflate best_score — GREATEST(best_score, p_score=999999) sticks;
--     leaks into downstream per-student analytics.
--   * Pass p_kp_id='arbitrary junk' — rows accumulate under garbage KP IDs,
--     polluting get_class_kp_progress heatmaps.
--   * Spam success=true — wins += 1 each call; mastered_at auto-set once
--     wins >= 2. Student can "master" every KP with two RPC calls.
--
-- Server-side grading would be the real fix. This patch is a cheap sanity
-- layer: bound p_score and reject kp_id that doesn't match the established
-- format (kp-X.YY-ZZ). Existing legit data stays valid.
--
-- Body otherwise preserved from 20260422140000's hardened version.

CREATE OR REPLACE FUNCTION public.upsert_play_kp(
  p_user_id UUID,
  p_kp_id TEXT,
  p_success BOOLEAN,
  p_score INT,
  p_kn_id TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_score INT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_user_id IS NOT NULL AND p_user_id <> v_uid THEN
    RAISE EXCEPTION 'user_id_mismatch';
  END IF;

  -- Score bound: aligned with record_battle_result (250k). Anything larger
  -- is indisputably synthetic; smaller than 0 is nonsense.
  IF p_score IS NULL OR p_score < 0 OR p_score > 250000 THEN
    RAISE EXCEPTION 'KP score out of bounds: %', p_score;
  END IF;
  v_score := p_score;

  -- KP ID format gate: production uses "kp-X.YY-ZZ" (e.g., kp-1.14-01).
  -- Rejects freeform junk while keeping all current IDs valid.
  IF p_kp_id IS NULL OR p_kp_id !~ '^kp-[0-9]+\.[0-9]+-[0-9]+$' THEN
    RAISE EXCEPTION 'Malformed KP id: %', p_kp_id;
  END IF;

  INSERT INTO play_kp_progress (user_id, kp_id, kn_id, wins, attempts, last_score, best_score)
  VALUES (
    v_uid,
    p_kp_id,
    p_kn_id,
    CASE WHEN p_success THEN 1 ELSE 0 END,
    1,
    v_score,
    v_score
  )
  ON CONFLICT (user_id, kp_id) DO UPDATE SET
    kn_id = COALESCE(EXCLUDED.kn_id, play_kp_progress.kn_id),
    wins = play_kp_progress.wins + CASE WHEN p_success THEN 1 ELSE 0 END,
    attempts = play_kp_progress.attempts + 1,
    last_score = v_score,
    best_score = GREATEST(play_kp_progress.best_score, v_score),
    last_played_at = now(),
    mastered_at = CASE
      WHEN p_success
        AND play_kp_progress.wins + 1 >= 2
        AND play_kp_progress.mastered_at IS NULL
      THEN now()
      ELSE play_kp_progress.mastered_at
    END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_play_kp(UUID, TEXT, BOOLEAN, INT, TEXT) TO authenticated;
