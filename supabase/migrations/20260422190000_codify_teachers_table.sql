-- Codify the shared `teachers` table.
-- Production has this table (verified 2026-04-22 via pg_columns + pg_constraint),
-- used across Play (this repo), Practice, and ExamHub for teacher authorization.
-- Without it in migrations, fresh environments cannot provision and every
-- teacher-scoped RPC — IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid())
-- — throws "relation does not exist".
--
-- Production shape:
--   id UUID PK                (default gen_random_uuid())
--   user_id UUID NOT NULL     UNIQUE, FK to auth.users(id) ON DELETE CASCADE
--   school_id UUID NOT NULL   FK to schools(id) ON DELETE CASCADE — NOT codified here
--                             because `schools` lives in the shared ExamHub schema,
--                             which is not part of this repo's migrations. When
--                             syncing a fresh environment, the shared schema
--                             migration must run first, then a follow-up migration
--                             can attach this FK.
--   display_name TEXT NOT NULL DEFAULT ''
--   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
--   onboarded_at TIMESTAMPTZ NULL
--
-- RLS: teachers_select_own — teachers can read only their own row.
-- No INSERT/UPDATE/DELETE policies → default deny; teacher provisioning goes
-- through service_role (admin panel) or future SECURITY DEFINER RPC.

CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  onboarded_at TIMESTAMPTZ
);

-- Idempotent backfill for the school FK — attach only if schools table exists
-- (i.e., shared schema has already been applied). Skipped silently otherwise.
DO $$
BEGIN
  IF to_regclass('public.schools') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint
       WHERE conname = 'teachers_school_id_fkey'
         AND conrelid = 'public.teachers'::regclass
     )
  THEN
    ALTER TABLE public.teachers
      ADD CONSTRAINT teachers_school_id_fkey
      FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;
  END IF;
END$$;

-- Indexes on FK lookups
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON public.teachers(school_id);
-- user_id already has an implicit unique index from the UNIQUE constraint above

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS teachers_select_own ON public.teachers;
CREATE POLICY teachers_select_own ON public.teachers
  FOR SELECT
  USING (user_id = auth.uid());
