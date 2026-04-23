-- gl_battle_results has separate indexes on user_id and created_at but no
-- composite. The three queries below all do "filter by user_id, sort or
-- filter by created_at":
--
--   LearningTimeline (src/components/LearningTimeline.tsx:89):
--     SELECT ... WHERE user_id = ? ORDER BY created_at DESC LIMIT 200
--
--   get_class_battle_stats (20260422180000):
--     SELECT ... WHERE u.grade = ? AND b.created_at >= p_since
--     (JOIN on user_id, then filter by time)
--
--   get_weekly_leaderboard (20260402000000):
--     SUM(b.score) GROUPed by user_id with b.created_at >= p_since
--
-- Without the composite index, Postgres either:
--   a) picks idx_gl_battle_user, scans all battles for that user (could be
--      thousands for a heavy user), then filters by created_at → bad for
--      users with long histories
--   b) picks idx_gl_battle_created, scans last-7-days window globally
--      (could be tens of thousands of rows), then filters by user_id →
--      bad for grade-wide queries
--
-- Composite (user_id, created_at DESC) lets it pinpoint "user X's rows in
-- the last N days" directly, and serves the LearningTimeline
-- order-and-limit without a sort step.

CREATE INDEX IF NOT EXISTS idx_gl_battle_user_created
  ON public.gl_battle_results (user_id, created_at DESC);
