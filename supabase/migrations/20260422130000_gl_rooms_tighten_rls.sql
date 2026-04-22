-- Tighten gl_rooms RLS: direct INSERT / UPDATE now require host_id = auth.uid().
-- RPCs (create_pk_room, create_live_room, join_room, toggle_ready, submit_pk_score,
-- start_game, leave_room, push_live_question, submit_live_response, end_live_session)
-- are all SECURITY DEFINER and bypass RLS, so their flows are unaffected.
--
-- Blocks:
--   * Direct INSERT with spoofed host_id (impersonation)
--   * Direct UPDATE by non-hosts (score tampering, status hijack, kicking players)
--   * Transferring ownership by UPDATEing host_id to another user
--
-- SELECT stays open to all authenticated (needed for realtime + joinRoom short-code search).
-- DELETE has no policy → default-deny (only SECURITY DEFINER RPCs like cleanup_* can delete).

-- ─── INSERT: caller must be the host of the row they're inserting ───
DROP POLICY IF EXISTS gl_rooms_insert ON gl_rooms;
CREATE POLICY gl_rooms_insert ON gl_rooms
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND host_id = auth.uid());

-- ─── UPDATE: only the host can directly update their own row, and can't transfer host_id away ───
DROP POLICY IF EXISTS gl_rooms_update ON gl_rooms;
CREATE POLICY gl_rooms_update ON gl_rooms
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());
