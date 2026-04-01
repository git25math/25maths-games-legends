-- Teacher dashboard read RPCs (SECURITY DEFINER to bypass RLS)
-- These allow teachers to view student data across users

-- Get students by class tag (for specific class filter)
CREATE OR REPLACE FUNCTION get_students_by_class(p_class_tag TEXT)
RETURNS SETOF gl_user_progress
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM gl_user_progress
  WHERE class_tags @> ARRAY[p_class_tag]
  ORDER BY display_name;
$$;

-- Get students by grade (for grade-level view without class filter)
CREATE OR REPLACE FUNCTION get_students_by_grade(p_grade INT)
RETURNS SETOF gl_user_progress
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM gl_user_progress
  WHERE grade = p_grade
  ORDER BY display_name;
$$;

-- Get students by overlapping class tags (for "all classes in this grade" view)
CREATE OR REPLACE FUNCTION get_students_by_tags(p_tags TEXT[])
RETURNS SETOF gl_user_progress
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM gl_user_progress
  WHERE class_tags && p_tags
  ORDER BY display_name;
$$;
