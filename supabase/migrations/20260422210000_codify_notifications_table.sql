-- Codify the shared `notifications` table (verified byte-for-byte against production 2026-04-22).
--
-- Used by create_live_room (teacher fan-out) and the client useNotifications hook.
-- Confirmed from pg_columns / pg_indexes / pg_constraint / pg_policies:
--
--   Columns:
--     id         UUID NOT NULL DEFAULT gen_random_uuid()   PK
--     user_id    UUID NOT NULL                             FK -> auth.users(id)
--     type       TEXT NOT NULL DEFAULT 'info'
--     title      TEXT NOT NULL
--     body       TEXT NULL DEFAULT ''
--     link_type  TEXT NULL DEFAULT ''
--     link_id    TEXT NULL DEFAULT ''
--     is_read    BOOLEAN NULL DEFAULT false
--     created_at TIMESTAMPTZ NULL DEFAULT now()
--
--   Indexes:
--     notifications_pkey(id)
--     idx_notifications_user_id(user_id, is_read, created_at DESC)
--
--   Constraints: PK on id, FK user_id -> auth.users(id) (no cascade specified)
--
--   RLS policies:
--     student_insert  — any authenticated user can insert for themselves
--     teacher_insert  — teachers can insert for others (EXISTS teachers check)
--     user_read_own   — user_id = auth.uid()
--     user_update_own — user_id = auth.uid()

CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id),
  type       TEXT NOT NULL DEFAULT 'info',
  title      TEXT NOT NULL,
  body       TEXT DEFAULT '',
  link_type  TEXT DEFAULT '',
  link_id    TEXT DEFAULT '',
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications (user_id, is_read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS student_insert  ON public.notifications;
DROP POLICY IF EXISTS teacher_insert  ON public.notifications;
DROP POLICY IF EXISTS user_read_own   ON public.notifications;
DROP POLICY IF EXISTS user_update_own ON public.notifications;

CREATE POLICY student_insert ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY teacher_insert ON public.notifications
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.teachers WHERE teachers.user_id = auth.uid()));

CREATE POLICY user_read_own ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY user_update_own ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid());
