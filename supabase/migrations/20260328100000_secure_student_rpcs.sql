-- v10.2: Add authorization checks to student-scoped RPCs
-- Prevent students from reading other students' data

-- Fix: get_student_kp_progress — allow self or teacher only
CREATE OR REPLACE FUNCTION get_student_kp_progress(p_user_id UUID)
RETURNS SETOF play_kp_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow the student themselves OR any teacher
  IF auth.uid() != p_user_id
    AND NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid())
  THEN
    RAISE EXCEPTION 'Not authorized: must be the student or a teacher';
  END IF;

  RETURN QUERY
    SELECT * FROM play_kp_progress
    WHERE user_id = p_user_id
    ORDER BY kp_id;
END;
$$;

-- Fix: archive_assignment — return boolean so UI knows if it actually worked
CREATE OR REPLACE FUNCTION archive_assignment(p_assignment_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE gl_assignments
  SET archived_at = now()
  WHERE id = p_assignment_id AND created_by = auth.uid();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END;
$$;
