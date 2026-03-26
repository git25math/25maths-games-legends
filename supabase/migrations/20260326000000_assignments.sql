-- v8.3: Teacher Assignment System (Phase D)
-- Teachers can assign specific missions to a class with deadlines.
-- Students see assignments on MapScreen; teachers track completion on Dashboard.

-- ═══ Table ═══

CREATE TABLE IF NOT EXISTS gl_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INT NOT NULL,
  class_tag TEXT NOT NULL,            -- target class (e.g., "7A")
  mission_ids INT[] NOT NULL,         -- assigned mission IDs
  title TEXT NOT NULL,                -- teacher-defined title (e.g., "本周代数练习")
  description TEXT,                   -- optional note to students
  deadline TIMESTAMPTZ,               -- optional due date
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  archived_at TIMESTAMPTZ             -- soft delete: archived assignments hidden from students
);

CREATE INDEX IF NOT EXISTS idx_gl_assignments_class ON gl_assignments (grade, class_tag);
CREATE INDEX IF NOT EXISTS idx_gl_assignments_active ON gl_assignments (archived_at) WHERE archived_at IS NULL;

ALTER TABLE gl_assignments ENABLE ROW LEVEL SECURITY;

-- Teachers can read all assignments (via SECURITY DEFINER RPCs).
-- Students can read active assignments for their grade+class.
CREATE POLICY "Students read own class assignments"
  ON gl_assignments FOR SELECT
  USING (
    archived_at IS NULL
    AND EXISTS (
      SELECT 1 FROM gl_user_progress
      WHERE user_id = auth.uid()
        AND grade = gl_assignments.grade
        AND gl_assignments.class_tag = ANY(class_tags)
    )
  );

-- Only teachers can insert/update (enforced via SECURITY DEFINER RPCs)
-- No direct INSERT/UPDATE policy for students.

-- ═══ RPC: Create Assignment ═══

CREATE OR REPLACE FUNCTION create_assignment(
  p_grade INT,
  p_class_tag TEXT,
  p_mission_ids INT[],
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_deadline TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Verify caller is a teacher
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized: caller is not a teacher';
  END IF;

  INSERT INTO gl_assignments (grade, class_tag, mission_ids, title, description, deadline, created_by)
  VALUES (p_grade, p_class_tag, p_mission_ids, p_title, p_description, p_deadline, auth.uid())
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ═══ RPC: Get Assignments for Class (teacher view, includes archived) ═══

CREATE OR REPLACE FUNCTION get_class_assignments(
  p_grade INT,
  p_class_tag TEXT
) RETURNS TABLE (
  id UUID,
  grade INT,
  class_tag TEXT,
  mission_ids INT[],
  title TEXT,
  description TEXT,
  deadline TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, grade, class_tag, mission_ids, title, description, deadline, created_by, created_at, archived_at
  FROM gl_assignments
  WHERE grade = p_grade
    AND class_tag = p_class_tag
  ORDER BY created_at DESC;
$$;

-- ═══ RPC: Get Active Assignments for Student ═══

CREATE OR REPLACE FUNCTION get_my_assignments()
RETURNS TABLE (
  id UUID,
  grade INT,
  class_tag TEXT,
  mission_ids INT[],
  title TEXT,
  description TEXT,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.grade, a.class_tag, a.mission_ids, a.title, a.description, a.deadline, a.created_at
  FROM gl_assignments a
  JOIN gl_user_progress u ON u.user_id = auth.uid()
    AND u.grade = a.grade
    AND a.class_tag = ANY(u.class_tags)
  WHERE a.archived_at IS NULL
  ORDER BY a.deadline ASC NULLS LAST, a.created_at DESC;
$$;

-- ═══ RPC: Archive Assignment (soft delete) ═══

CREATE OR REPLACE FUNCTION archive_assignment(p_assignment_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE gl_assignments
  SET archived_at = now()
  WHERE id = p_assignment_id AND created_by = auth.uid();
END;
$$;
