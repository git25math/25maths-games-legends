-- v9.7: Student-scoped KP progress RPC
-- Replaces the workaround of calling get_class_kp_progress(grade, null)
-- and filtering client-side. Fetches only the target student's rows.

CREATE OR REPLACE FUNCTION get_student_kp_progress(p_user_id UUID)
RETURNS SETOF play_kp_progress
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM play_kp_progress
  WHERE user_id = p_user_id
  ORDER BY kp_id;
$$;
