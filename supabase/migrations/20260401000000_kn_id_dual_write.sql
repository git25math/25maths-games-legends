-- Phase 3C: kn_id dual-write columns
-- Adds canonical knowledge network ID (kn_*) to 3 tables for cross-product tracking.
-- Pure additive — no existing columns or constraints modified.

-- 1. play_kp_progress: add kn_id for canonical reference
ALTER TABLE play_kp_progress ADD COLUMN IF NOT EXISTS kn_id TEXT;
CREATE INDEX IF NOT EXISTS idx_play_kp_kn_id ON play_kp_progress(kn_id);

-- 2. user_attempt_log: add kn_id for canonical analytics
ALTER TABLE user_attempt_log ADD COLUMN IF NOT EXISTS kn_id TEXT;
CREATE INDEX IF NOT EXISTS idx_attempt_kn_id ON user_attempt_log(kn_id);

-- 3. user_skill_health: add kn_id for cross-product health lookup
ALTER TABLE user_skill_health ADD COLUMN IF NOT EXISTS kn_id TEXT;

-- 4. Update upsert_play_kp to accept optional kn_id parameter
CREATE OR REPLACE FUNCTION upsert_play_kp(
  p_user_id UUID,
  p_kp_id TEXT,
  p_success BOOLEAN,
  p_score INT,
  p_kn_id TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO play_kp_progress (user_id, kp_id, kn_id, wins, attempts, last_score, best_score)
  VALUES (
    p_user_id,
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
