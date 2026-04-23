-- Tighten gl_bug_reports INSERT policy.
-- Original: WITH CHECK (true) — any caller can insert a row with any user_id,
-- which means a malicious user can spoof reports as someone else (noise for
-- admin triage; also blocks the "who reported?" answer from being trustworthy).
--
-- Fix: authenticated callers must either use their own auth.uid() as user_id
-- OR leave it NULL (anonymous / guest reports still supported).

DROP POLICY IF EXISTS "Anyone can insert bug reports" ON public.gl_bug_reports;
CREATE POLICY "Anyone can insert bug reports" ON public.gl_bug_reports
  FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
