-- Index for weekly leaderboard time-range query performance
CREATE INDEX IF NOT EXISTS idx_gl_battle_created ON gl_battle_results(created_at);

-- Partial index for the weekly leaderboard join pattern:
-- WHERE success = true AND created_at >= p_since
CREATE INDEX IF NOT EXISTS idx_gl_battle_success_created ON gl_battle_results(success, created_at)
  WHERE success = true;

-- Index for school leaderboard (ORDER BY total_score DESC LIMIT N)
CREATE INDEX IF NOT EXISTS idx_gl_progress_score ON gl_user_progress(total_score DESC);
