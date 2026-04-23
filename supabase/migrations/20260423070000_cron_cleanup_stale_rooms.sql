-- Schedule cleanup_all_stale_rooms hourly via pg_cron.
--
-- The function existed since 20260422120000 but was never invoked — migration
-- comment said "invoke via pg_cron" but no schedule was set up. Meanwhile
-- cleanup_my_stale_rooms was also never called from the client until now
-- (companion change in useMultiplayer.ts). Net effect: gl_rooms accumulates
-- orphan 'waiting' / 'playing' / 'finished' rows indefinitely, inflating the
-- joinRoom "top 50 waiting" scan and chewing storage.
--
-- pg_cron is available on Supabase (managed). Schedule hourly — low overhead,
-- catches orphans within 60 min in the worst case. If pg_cron isn't enabled
-- in the target environment, the CREATE EXTENSION line is a safe no-op on a
-- self-managed Postgres that already has it; on Supabase project restore the
-- extension may need to be enabled via the Dashboard first.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove any prior schedule with the same name before re-adding, so repeat
-- applies don't stack duplicate jobs.
DO $$
DECLARE v_jobid BIGINT;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'cleanup_stale_rooms_hourly';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

SELECT cron.schedule(
  'cleanup_stale_rooms_hourly',
  '0 * * * *',
  $cmd$SELECT public.cleanup_all_stale_rooms();$cmd$
);
