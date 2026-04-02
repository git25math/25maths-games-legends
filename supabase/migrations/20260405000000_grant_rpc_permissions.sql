-- Fix 403 errors: GRANT EXECUTE on Play RPCs to authenticated/anon roles
-- These functions were created by postgres but not granted to the app roles

-- Dashboard RPCs
GRANT EXECUTE ON FUNCTION get_class_kp_progress(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_class_assignments(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_class_battle_stats(integer, text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION create_assignment(integer, text, integer[], text, text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION create_assignment(integer, text, integer[], text, text, timestamptz, uuid[]) TO authenticated;

-- Leaderboard RPCs
GRANT EXECUTE ON FUNCTION get_class_leaderboard(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_grade_leaderboard(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_school_leaderboard(integer) TO authenticated;

-- Class management RPCs
GRANT EXECUTE ON FUNCTION assign_class(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_class_progress(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_class_lesson_runs(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_class_tag(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_student_tag(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_class_cascade(uuid) TO authenticated;

-- Live Classroom anonymous RPCs (need anon role)
GRANT EXECUTE ON FUNCTION join_live_anonymous(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION submit_live_response_anon(uuid, text, integer, integer, jsonb, boolean, text, integer, text) TO anon, authenticated;
