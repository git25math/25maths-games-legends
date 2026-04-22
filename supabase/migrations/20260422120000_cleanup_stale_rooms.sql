-- Orphan room cleanup.
-- Addresses the scenario where a host creates a room then never calls leave_room
-- (browser crash, tab killed, network drop mid-click). Without this, gl_rooms
-- accumulates 'waiting' orphans indefinitely, which:
--   * inflates joinRoom's "top 50 waiting" scan and causes short-code mismatches
--   * wastes storage + index space
--   * makes debugging noisy
--
-- Two functions:
--   * cleanup_my_stale_rooms()  — authenticated, per-user (called opportunistically from client)
--   * cleanup_all_stale_rooms() — service_role only (intended for pg_cron schedule)

-- ─── Per-user cleanup (safe for clients to call on mount) ───
CREATE OR REPLACE FUNCTION public.cleanup_my_stale_rooms()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_deleted INT := 0;
BEGIN
  IF v_uid IS NULL THEN RETURN 0; END IF;

  -- 'waiting' older than 30 min hosted by this user: hard delete
  DELETE FROM gl_rooms
  WHERE host_id = v_uid
    AND status = 'waiting'
    AND updated_at < now() - interval '30 minutes';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  -- 'playing' older than 2 hours hosted by this user: mark finished so polling clients exit cleanly
  UPDATE gl_rooms
  SET status = 'finished'
  WHERE host_id = v_uid
    AND status = 'playing'
    AND updated_at < now() - interval '2 hours';

  RETURN v_deleted;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_my_stale_rooms() TO authenticated;

-- ─── Global cleanup (cron-only) ───
-- Invoke via pg_cron: SELECT cleanup_all_stale_rooms() on an hourly schedule.
CREATE OR REPLACE FUNCTION public.cleanup_all_stale_rooms()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_waiting INT := 0;
  v_deleted_finished INT := 0;
  v_updated_playing INT := 0;
BEGIN
  -- 'waiting' > 30 min: hard delete
  DELETE FROM gl_rooms
  WHERE status = 'waiting'
    AND updated_at < now() - interval '30 minutes';
  GET DIAGNOSTICS v_deleted_waiting = ROW_COUNT;

  -- 'playing' > 2 hours: mark finished (preserve any stats/responses before potential delete)
  UPDATE gl_rooms
  SET status = 'finished'
  WHERE status = 'playing'
    AND updated_at < now() - interval '2 hours';
  GET DIAGNOSTICS v_updated_playing = ROW_COUNT;

  -- 'finished' > 7 days: hard delete (cascade removes gl_live_responses)
  DELETE FROM gl_rooms
  WHERE status = 'finished'
    AND updated_at < now() - interval '7 days';
  GET DIAGNOSTICS v_deleted_finished = ROW_COUNT;

  RETURN jsonb_build_object(
    'deleted_waiting', v_deleted_waiting,
    'updated_playing', v_updated_playing,
    'deleted_finished', v_deleted_finished
  );
END;
$$;

-- Block authenticated / anon from calling global cleanup
REVOKE ALL ON FUNCTION public.cleanup_all_stale_rooms() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_all_stale_rooms() FROM authenticated;
-- service_role retains EXECUTE by virtue of being the owner/postgres superuser in Supabase.
