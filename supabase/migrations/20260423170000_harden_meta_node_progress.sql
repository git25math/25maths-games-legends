-- upsert_meta_node_progress (20260406000000) is SECURITY DEFINER but has
-- ZERO authorization checks AND no SET search_path. Combined with the open
-- meta_node_insert / meta_node_update policies, this is the same shape as
-- the class_tag RPC vulnerabilities fixed in 20260423090000:
--
--   * Accepts p_user_id verbatim and writes that user's row regardless of
--     auth.uid() — student can call upsert_meta_node_progress(victim_uuid,
--     'kn-foo', 'play', 250000, true) and overwrite victim's mastery.
--   * No search_path → SECURITY DEFINER injection surface.
--   * No score bounds → best_score = 999_999_999 sticks.
--   * No source enum → 'play' / 'practice' / 'examhub' is documented but
--     not enforced; junk source values pollute analytics joins.
--   * No kn_id format check → garbage kn_ids accumulate forever.
--
-- meta_node_progress also had broad direct write policies (insert + update
-- own), letting a student bypass the RPC entirely via .from('meta_node_progress')
-- .upsert(). All client paths verified to go through the RPC; dropping the
-- policies forces RPC-only writes (matches the play_kp_progress pattern in
-- 20260423160000).

-- ─── Hardened upsert_meta_node_progress ─────────────────────────────────────
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
  v_uid UUID := auth.uid();
  v_is_service BOOLEAN := auth.role() = 'service_role';
  v_target UUID;
  v_wins INT;
  v_attempts INT;
  v_mastery NUMERIC(5,2);
  v_flm TEXT;
BEGIN
  IF v_uid IS NULL AND NOT v_is_service THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Cross-user write: only service_role (cross-product sync) may target
  -- another user. Authenticated callers may only write their own row.
  v_target := COALESCE(p_user_id, v_uid);
  IF NOT v_is_service AND v_target IS DISTINCT FROM v_uid THEN
    RAISE EXCEPTION 'user_id_mismatch';
  END IF;

  IF p_score IS NULL OR p_score < 0 OR p_score > 250000 THEN
    RAISE EXCEPTION 'score_out_of_bounds: %', p_score;
  END IF;

  IF p_source IS NULL OR p_source NOT IN ('play', 'practice', 'examhub') THEN
    RAISE EXCEPTION 'invalid_source: %', p_source;
  END IF;

  -- kn_id is product-defined (multiple naming schemes across products),
  -- so cap length + non-empty rather than format-match. 128 chars is well
  -- above any real kn id observed.
  IF p_kn_id IS NULL OR char_length(p_kn_id) = 0 OR char_length(p_kn_id) > 128 THEN
    RAISE EXCEPTION 'invalid_kn_id';
  END IF;

  INSERT INTO meta_node_progress (user_id, kn_id, source, attempts, wins, last_score, best_score)
  VALUES (
    v_target,
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

  SELECT wins, attempts INTO v_wins, v_attempts
  FROM meta_node_progress
  WHERE user_id = v_target AND kn_id = p_kn_id AND source = p_source;

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
      flm_state = v_flm
  WHERE user_id = v_target AND kn_id = p_kn_id AND source = p_source;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_meta_node_progress(UUID, TEXT, TEXT, INT, BOOLEAN) TO authenticated;

-- ─── Force RPC-only writes ──────────────────────────────────────────────────
DROP POLICY IF EXISTS meta_node_insert ON public.meta_node_progress;
DROP POLICY IF EXISTS meta_node_update ON public.meta_node_progress;
-- Keep meta_node_select (auth.uid() = user_id) for client reads.
