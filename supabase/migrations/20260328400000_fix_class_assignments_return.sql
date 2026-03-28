-- Fix: DROP + recreate get_class_assignments with target_user_ids in return type
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
