-- Weekly leaderboard RPC: aggregates battle scores since Monday, joins user profiles
-- SECURITY DEFINER to bypass RLS on gl_battle_results and gl_user_progress

CREATE OR REPLACE FUNCTION get_weekly_leaderboard(p_grade INT, p_since TIMESTAMPTZ, p_limit INT DEFAULT 20)
RETURNS TABLE(user_id UUID, display_name TEXT, total_score INT, selected_char_id TEXT, weekly_xp BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.user_id,
    u.display_name,
    u.total_score,
    u.selected_char_id,
    COALESCE(SUM(b.score), 0) AS weekly_xp
  FROM gl_user_progress u
  JOIN gl_battle_results b ON b.user_id = u.user_id
  WHERE u.grade = p_grade
    AND b.success = true
    AND b.created_at >= p_since
  GROUP BY u.user_id, u.display_name, u.total_score, u.selected_char_id
  HAVING SUM(b.score) > 0
  ORDER BY weekly_xp DESC
  LIMIT p_limit;
$$;
