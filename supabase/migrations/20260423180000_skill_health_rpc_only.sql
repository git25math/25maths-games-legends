-- user_skill_health and user_attempt_log have own-row INSERT/UPDATE policies
-- and the client writes to them directly (App.tsx:865, logAttempt.ts:25).
-- Direct writes let any logged-in student fake their own:
--   * health_score = 100, mastery_state = 'flawless', corruption_level = 'none'
--     → Teacher's KP weakness panel shows them as mastered, repair-mode
--       routing skips them. Wastes teacher attention.
--   * primary_error_pattern_id = 'fake-pattern-id', is_correct = true
--     → Pollutes error-pattern analytics that drive intervention design.
--
-- Constraints on the table cap value ranges (health_score 0..100, mastery_state
-- enum) so the worst case is bounded — but "always healthy" is still a lie
-- worth blocking.
--
-- Add SECURITY DEFINER RPCs that:
--   * Auto-fill user_id from auth.uid() (no cross-user write)
--   * Cap string lengths
--   * Validate the enums the constraint already checks
-- then drop the direct write policies and route the client through them.

-- ─── log_user_attempt: replaces direct user_attempt_log insert ──────────────
CREATE OR REPLACE FUNCTION public.log_user_attempt(
  p_question_id TEXT,
  p_node_id TEXT,
  p_kn_id TEXT DEFAULT NULL,
  p_is_correct BOOLEAN DEFAULT FALSE,
  p_raw_answer TEXT DEFAULT NULL,
  p_primary_error_pattern_id TEXT DEFAULT NULL,
  p_source_mode TEXT DEFAULT 'practice',
  p_recovery_pack_id TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;

  IF p_question_id IS NULL OR char_length(p_question_id) = 0 OR char_length(p_question_id) > 200 THEN
    RAISE EXCEPTION 'invalid_question_id';
  END IF;
  IF p_node_id IS NULL OR char_length(p_node_id) = 0 OR char_length(p_node_id) > 128 THEN
    RAISE EXCEPTION 'invalid_node_id';
  END IF;
  IF p_kn_id IS NOT NULL AND char_length(p_kn_id) > 128 THEN
    RAISE EXCEPTION 'invalid_kn_id';
  END IF;
  IF p_source_mode NOT IN ('practice', 'recovery', 'boss', 'diagnostic') THEN
    RAISE EXCEPTION 'invalid_source_mode: %', p_source_mode;
  END IF;
  IF p_primary_error_pattern_id IS NOT NULL AND char_length(p_primary_error_pattern_id) > 128 THEN
    RAISE EXCEPTION 'invalid_error_pattern_id';
  END IF;
  IF p_recovery_pack_id IS NOT NULL AND char_length(p_recovery_pack_id) > 128 THEN
    RAISE EXCEPTION 'invalid_recovery_pack_id';
  END IF;

  INSERT INTO public.user_attempt_log (
    user_id, question_id, node_id, kn_id, is_correct, raw_answer,
    primary_error_pattern_id, source_mode, recovery_pack_id
  ) VALUES (
    v_uid, p_question_id, p_node_id, p_kn_id, p_is_correct,
    -- Mirror client-side 200-char truncation; defense in depth.
    CASE WHEN p_raw_answer IS NULL THEN NULL ELSE substring(p_raw_answer, 1, 200) END,
    p_primary_error_pattern_id, p_source_mode, p_recovery_pack_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_user_attempt(TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ─── upsert_user_skill_health: replaces direct user_skill_health upsert ─────
CREATE OR REPLACE FUNCTION public.upsert_user_skill_health(
  p_node_id TEXT,
  p_kn_id TEXT DEFAULT NULL,
  p_health_score INT DEFAULT 100,
  p_corruption_level TEXT DEFAULT 'none',
  p_dominant_error_pattern_id TEXT DEFAULT NULL,
  p_consecutive_same_pattern_count INT DEFAULT 0,
  p_total_attempt_count INT DEFAULT 0,
  p_mastery_state TEXT DEFAULT 'learning',
  p_recent_error_count INT DEFAULT NULL,
  p_recommended_recovery_pack_id TEXT DEFAULT NULL,
  p_set_last_error_at BOOLEAN DEFAULT FALSE
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;

  IF p_node_id IS NULL OR char_length(p_node_id) = 0 OR char_length(p_node_id) > 128 THEN
    RAISE EXCEPTION 'invalid_node_id';
  END IF;
  IF p_health_score < 0 OR p_health_score > 100 THEN
    RAISE EXCEPTION 'health_score_out_of_bounds: %', p_health_score;
  END IF;
  IF p_corruption_level NOT IN ('none', 'warning', 'blocked', 'critical') THEN
    RAISE EXCEPTION 'invalid_corruption_level: %', p_corruption_level;
  END IF;
  IF p_mastery_state NOT IN ('locked', 'learning', 'stable', 'mastered', 'flawless') THEN
    RAISE EXCEPTION 'invalid_mastery_state: %', p_mastery_state;
  END IF;
  IF p_consecutive_same_pattern_count < 0 OR p_consecutive_same_pattern_count > 10000 THEN
    RAISE EXCEPTION 'invalid_consecutive_count';
  END IF;
  IF p_total_attempt_count < 0 OR p_total_attempt_count > 1000000 THEN
    RAISE EXCEPTION 'invalid_attempt_count';
  END IF;
  IF p_recent_error_count IS NOT NULL AND
     (p_recent_error_count < 0 OR p_recent_error_count > 1000000) THEN
    RAISE EXCEPTION 'invalid_recent_error_count';
  END IF;
  IF p_recommended_recovery_pack_id IS NOT NULL AND
     char_length(p_recommended_recovery_pack_id) > 128 THEN
    RAISE EXCEPTION 'invalid_recovery_pack_id';
  END IF;

  INSERT INTO public.user_skill_health (
    user_id, node_id, kn_id, mastery_state, health_score, corruption_level,
    dominant_error_pattern_id, consecutive_same_pattern_count,
    recent_error_count, total_attempt_count,
    recommended_recovery_pack_id,
    last_attempt_at, last_error_at, updated_at
  ) VALUES (
    v_uid, p_node_id, p_kn_id, p_mastery_state, p_health_score, p_corruption_level,
    p_dominant_error_pattern_id, p_consecutive_same_pattern_count,
    COALESCE(p_recent_error_count, 0), p_total_attempt_count,
    p_recommended_recovery_pack_id,
    now(),
    CASE WHEN p_set_last_error_at THEN now() ELSE NULL END,
    now()
  )
  ON CONFLICT (user_id, node_id) DO UPDATE SET
    kn_id = COALESCE(EXCLUDED.kn_id, user_skill_health.kn_id),
    mastery_state = EXCLUDED.mastery_state,
    health_score = EXCLUDED.health_score,
    corruption_level = EXCLUDED.corruption_level,
    dominant_error_pattern_id = EXCLUDED.dominant_error_pattern_id,
    consecutive_same_pattern_count = EXCLUDED.consecutive_same_pattern_count,
    recent_error_count = COALESCE(p_recent_error_count, user_skill_health.recent_error_count),
    total_attempt_count = EXCLUDED.total_attempt_count,
    recommended_recovery_pack_id = COALESCE(p_recommended_recovery_pack_id, user_skill_health.recommended_recovery_pack_id),
    last_attempt_at = now(),
    last_error_at = CASE WHEN p_set_last_error_at THEN now() ELSE user_skill_health.last_error_at END,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_user_skill_health(TEXT, TEXT, INT, TEXT, TEXT, INT, INT, TEXT, INT, TEXT, BOOLEAN) TO authenticated;

-- ─── Drop direct write policies ─────────────────────────────────────────────
DROP POLICY IF EXISTS "insert_own_attempts" ON public.user_attempt_log;
-- (no UPDATE / DELETE policy → already locked)

DROP POLICY IF EXISTS "insert_own_health" ON public.user_skill_health;
DROP POLICY IF EXISTS "update_own_health" ON public.user_skill_health;
