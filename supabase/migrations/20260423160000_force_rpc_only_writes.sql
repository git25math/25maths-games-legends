-- gl_battle_results and play_kp_progress had open INSERT/UPDATE policies
-- (own-row), which let any authenticated user bypass the bounded-write RPCs:
--
--   gl_battle_results:
--     direct INSERT bypasses record_battle_result's score cap [0, 250000],
--     duration min, difficulty enum check, and 30s dedup window. A student
--     could supabase.from('gl_battle_results').insert({ user_id: me,
--     mission_id: 1, score: 999_999_999, success: true, duration_secs: 0,
--     difficulty_mode: 'red' }) and instantly top get_weekly_leaderboard.
--
--   play_kp_progress:
--     "Users write own play_kp_progress" FOR ALL was the broadest policy in
--     the codebase — INSERT, UPDATE, DELETE all open. Direct UPDATE could
--     set best_score = 999_999 and mastered_at = now() for any KP, polluting
--     teacher heatmaps and student personal stats.
--
-- Client SELECT paths verified (LearningTimeline, MapScreen, dashboard
-- panels) — no direct write callers exist; all writes route through the
-- hardened SECURITY DEFINER RPCs (record_battle_result, upsert_play_kp).
-- Dropping these policies forces every write through the bounded RPCs.
--
-- Pattern matches gl_user_progress: only SELECT remains, all writes go via
-- update_user_progress_safe / add_score (codified in 20260422160000).
--
-- Note: user_skill_health and user_attempt_log have similar open policies
-- but are still written directly by the client (App.tsx:865, logAttempt.ts).
-- They feed analytical heatmaps only, not XP / leaderboard, so left alone
-- for now — would need to migrate the client to RPCs first.

-- ─── gl_battle_results: SELECT-only for clients, writes via record_battle_result ───
DROP POLICY IF EXISTS gl_battle_results_insert ON public.gl_battle_results;
-- (no UPDATE / DELETE policy existed → already locked)

-- ─── play_kp_progress: SELECT-only for clients, writes via upsert_play_kp ───
DROP POLICY IF EXISTS "Users write own play_kp_progress" ON public.play_kp_progress;
