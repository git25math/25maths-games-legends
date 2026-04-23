-- notifications.student_insert let ANY authenticated user INSERT a row with
-- ANY user_id, not just their own:
--   WITH CHECK (auth.uid() IS NOT NULL)
--
-- This made cross-user phishing trivial: a student could craft a row with
-- user_id = another_student_uuid, title = 'URGENT: contact admin', body =
-- 'http://evil.example/login'. The victim's client, which filters SELECT to
-- user_id = auth.uid(), would surface it as a "normal" notification.
--
-- No client-side INSERT flow currently exists — all legitimate writes come
-- from SECURITY DEFINER RPCs (create_live_room fan-out, assignment
-- notifications). Codify that by tightening the INSERT policy to self-only.
-- teacher_insert stays intact for teacher-driven fan-out.

DROP POLICY IF EXISTS student_insert ON public.notifications;

-- Allow authenticated users to write notifications to *their own* row only.
-- Kept (vs. dropping entirely) because a future "self-reminder" feature would
-- use this path; teacher_insert continues to handle cross-user fan-out.
CREATE POLICY student_insert ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
