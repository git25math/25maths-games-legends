-- Harden upsert_play_kp + upsert_meta_node_progress:
--   1. p_user_id is no longer trusted — callers cannot tamper with another user's progress
--   2. SET search_path = public plugs the SECURITY DEFINER search_path injection gap
--   3. Signature preserved for backward compatibility; p_user_id must match auth.uid() or be null
--   4. Function body is byte-for-byte the original aside from the guard at the top and swapping p_user_id -> v_uid

-- ─── upsert_play_kp ───
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
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_user_id IS NOT NULL AND p_user_id <> v_uid THEN
    RAISE EXCEPTION 'user_id_mismatch';
  END IF;

  INSERT INTO play_kp_progress (user_id, kp_id, kn_id, wins, attempts, last_score, best_score)
  VALUES (
    v_uid,
    p_kp_id,
    p_kn_id,
    CASE WHEN p_success THEN 1 ELSE 0 END,
    1,
    p_score,
    p_score
  )
  ON CONFLICT (user_id, kp_id) DO UPDATE SET
    kn_id = COALESCE(EXCLUDED.kn_id, play_kp_progress.kn_id),
    wins = play_kp_progress.wins + CASE WHEN p_success THEN 1 ELSE 0 END,
    attempts = play_kp_progress.attempts + 1,
    last_score = p_score,
    best_score = GREATEST(play_kp_progress.best_score, p_score),
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

-- ─── upsert_meta_node_progress (preserves original body verbatim, swaps p_user_id -> v_uid) ───
CREATE OR REPLACE FUNCTION public.upsert_meta_node_progress(
  p_user_id UUID,
  p_kn_id   TEXT,
  p_source  TEXT,
  p_score   INT,
  p_correct BOOLEAN
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid      UUID := auth.uid();
  v_wins     INT;
  v_attempts INT;
  v_mastery  NUMERIC(5,2);
  v_flm      TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_user_id IS NOT NULL AND p_user_id <> v_uid THEN
    RAISE EXCEPTION 'user_id_mismatch';
  END IF;

  INSERT INTO meta_node_progress (user_id, kn_id, source, attempts, wins, last_score, best_score)
  VALUES (
    v_uid,
    p_kn_id,
    p_source,
    1,
    CASE WHEN p_correct THEN 1 ELSE 0 END,
    p_score,
    p_score
  )
  ON CONFLICT (user_id, kn_id, source) DO UPDATE SET
    attempts  = meta_node_progress.attempts + 1,
    wins      = meta_node_progress.wins + CASE WHEN p_correct THEN 1 ELSE 0 END,
    last_score = p_score,
    best_score = GREATEST(meta_node_progress.best_score, p_score),
    last_practiced_at = now(),
    updated_at = now();

  -- Compute FLM state from win rate (unchanged from original)
  SELECT wins, attempts INTO v_wins, v_attempts
  FROM meta_node_progress
  WHERE user_id = v_uid AND kn_id = p_kn_id AND source = p_source;

  IF v_attempts = 0 THEN
    v_flm := 'new';
    v_mastery := 0;
  ELSE
    v_mastery := ROUND((v_wins::NUMERIC / v_attempts) * 100, 2);
    IF v_wins >= 4 AND v_mastery >= 80 THEN
      v_flm := 'mastered';
    ELSIF v_wins >= 2 AND v_mastery >= 60 THEN
      v_flm := 'familiar';
    ELSIF v_attempts >= 1 THEN
      v_flm := 'learning';
    ELSE
      v_flm := 'new';
    END IF;
  END IF;

  UPDATE meta_node_progress
  SET mastery_score = v_mastery,
      flm_state    = v_flm
  WHERE user_id = v_uid AND kn_id = p_kn_id AND source = p_source;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_meta_node_progress(UUID, TEXT, TEXT, INT, BOOLEAN) TO authenticated;
