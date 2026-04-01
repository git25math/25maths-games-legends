-- Leaderboard RPC functions (SECURITY DEFINER to bypass RLS for cross-user reads)

-- Grade leaderboard: top N students in a given grade
CREATE OR REPLACE FUNCTION get_grade_leaderboard(p_grade INT, p_limit INT DEFAULT 20)
RETURNS TABLE(user_id UUID, display_name TEXT, total_score INT, selected_char_id TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, display_name, total_score, selected_char_id
  FROM gl_user_progress
  WHERE grade = p_grade
  ORDER BY total_score DESC
  LIMIT p_limit;
$$;

-- Class leaderboard: top N students with a given class tag
CREATE OR REPLACE FUNCTION get_class_leaderboard(p_class_tag TEXT, p_limit INT DEFAULT 50)
RETURNS TABLE(user_id UUID, display_name TEXT, total_score INT, selected_char_id TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, display_name, total_score, selected_char_id
  FROM gl_user_progress
  WHERE class_tags @> ARRAY[p_class_tag]
  ORDER BY total_score DESC
  LIMIT p_limit;
$$;

-- School leaderboard: top N students across all grades
CREATE OR REPLACE FUNCTION get_school_leaderboard(p_limit INT DEFAULT 50)
RETURNS TABLE(user_id UUID, display_name TEXT, total_score INT, selected_char_id TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, display_name, total_score, selected_char_id
  FROM gl_user_progress
  ORDER BY total_score DESC
  LIMIT p_limit;
$$;
