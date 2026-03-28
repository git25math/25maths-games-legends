-- v10.5: Targeted Assignments — push to specific weak students, not whole class
-- When target_user_ids is NULL → all students in class see it (backward compatible)
-- When target_user_ids is set → only those students see it

-- 1. Add target column
ALTER TABLE gl_assignments ADD COLUMN IF NOT EXISTS target_user_ids UUID[] DEFAULT NULL;

-- 2. Update create_assignment to accept target list
CREATE OR REPLACE FUNCTION create_assignment(
  p_grade INT,
  p_class_tag TEXT,
  p_mission_ids INT[],
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_deadline TIMESTAMPTZ DEFAULT NULL,
  p_target_user_ids UUID[] DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized: caller is not a teacher';
  END IF;

  INSERT INTO gl_assignments (grade, class_tag, mission_ids, title, description, deadline, created_by, target_user_ids)
  VALUES (p_grade, p_class_tag, p_mission_ids, p_title, p_description, p_deadline, auth.uid(), p_target_user_ids)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- 3. Update get_my_assignments to filter by target_user_ids
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
    AND (
      a.target_user_ids IS NULL                    -- NULL = whole class
      OR auth.uid() = ANY(a.target_user_ids)       -- or student is in target list
    )
  ORDER BY a.deadline ASC NULLS LAST, a.created_at DESC;
$$;

-- 4. Update RLS policy to respect targeting
DROP POLICY IF EXISTS "Students read own class assignments" ON gl_assignments;
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
    AND (
      target_user_ids IS NULL
      OR auth.uid() = ANY(target_user_ids)
    )
  );

-- 5. Update get_class_assignments to include target info (teacher view)
-- Must DROP first because return type changed (added target_user_ids column)
DROP FUNCTION IF EXISTS get_class_assignments(INT, TEXT);
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
  archived_at TIMESTAMPTZ,
  target_user_ids UUID[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, grade, class_tag, mission_ids, title, description, deadline, created_by, created_at, archived_at, target_user_ids
  FROM gl_assignments
  WHERE grade = p_grade
    AND class_tag = p_class_tag
  ORDER BY created_at DESC;
$$;
