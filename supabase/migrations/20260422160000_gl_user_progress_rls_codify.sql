-- Codify gl_user_progress RLS state (production vs migrations drift from v10.6.0).
--
-- Production reality (verified 2026-04-22 via pg_policies):
--   * Only one policy: gl_user_progress_select_own FOR SELECT USING (user_id = auth.uid())
--   * NO INSERT policy  → default deny, clients cannot directly insert
--   * NO UPDATE policy  → default deny, clients cannot directly update
--   * NO DELETE policy  → default deny
--
-- All mutations must go through SECURITY DEFINER RPCs:
--   * update_user_progress_safe  — whitelist-enforced profile updates
--   * add_score                   — server-capped score increments
--   * record_battle_result        — battle logging
--   * upsert_play_kp              — KP progress (hardened in 20260422140000)
--
-- New user profile rows are expected to be created by a backend mechanism
-- (likely a trigger on auth.users) rather than client INSERT — production
-- DDL for that trigger still needs codification.
--
-- This migration is idempotent: it drops the original v10.3 policies if they
-- still exist in a fresh environment, then re-creates the current SELECT-only
-- policy with the production name.

DROP POLICY IF EXISTS gl_user_progress_select    ON public.gl_user_progress;
DROP POLICY IF EXISTS gl_user_progress_insert    ON public.gl_user_progress;
DROP POLICY IF EXISTS gl_user_progress_update    ON public.gl_user_progress;
DROP POLICY IF EXISTS gl_user_progress_select_own ON public.gl_user_progress;

CREATE POLICY gl_user_progress_select_own ON public.gl_user_progress
  FOR SELECT
  USING (user_id = auth.uid());
