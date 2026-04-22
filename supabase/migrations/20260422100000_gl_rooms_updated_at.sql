-- gl_rooms stability: add updated_at for TTL-based cleanup + indexes for host/time queries.
-- Pure additive: no behavior change, no RLS change. Safe to deploy independently.

-- 1. updated_at column + auto-update trigger
ALTER TABLE gl_rooms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Backfill any existing rows (first run) so cleanup queries have a sensible baseline
UPDATE gl_rooms SET updated_at = COALESCE(updated_at, created_at, now())
 WHERE updated_at IS NULL;

CREATE OR REPLACE FUNCTION gl_rooms_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_gl_rooms_touch ON gl_rooms;
CREATE TRIGGER trg_gl_rooms_touch
BEFORE UPDATE ON gl_rooms
FOR EACH ROW EXECUTE FUNCTION gl_rooms_touch_updated_at();

-- 2. Indexes for cleanup + host queries
-- Finding stale 'waiting' rooms during cleanup: filter by status + updated_at
CREATE INDEX IF NOT EXISTS idx_gl_rooms_status_updated
  ON gl_rooms(status, updated_at);

-- Finding rooms by host (to prevent duplicate creation, or list my rooms)
CREATE INDEX IF NOT EXISTS idx_gl_rooms_host
  ON gl_rooms(host_id) WHERE host_id IS NOT NULL;
