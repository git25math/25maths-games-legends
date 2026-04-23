-- record_battle_result had auth / dedup but no value bounds. A student
-- calling it directly with p_score=99999999 seeded gl_battle_results with
-- gigantic scores, which fed straight into the weekly leaderboard
-- (get_weekly_leaderboard aggregates SUM(b.score)). Even with the 30-second
-- dedup window it was trivial to vary p_score by 1 each call and top the
-- leaderboard.
--
-- total_score is NOT affected — that's gated by add_score which already caps
-- at 10000/call. But weekly_xp (leaderboard display) is derived from
-- gl_battle_results.score directly.
--
-- Pair of lightweight caps here. Full anti-cheat would require server-side
-- answer grading, which is a separate project:
--   * p_score clamped to 250_000 (covers max-legit classic PK: queue_len=5 ×
--     per-q cap 40000 + per-battle bonus buffer)
--   * p_duration_secs forced to [3, 7200] — <3s for any multi-question battle
--     is implausible, >2h is clearly a leftover/glitch
--   * p_difficulty restricted to the known enum (tests already pass 'green'
--     / 'amber' / 'red'; anything else is garbage)
--
-- Body otherwise identical to 20260422170000's codified version.

CREATE OR REPLACE FUNCTION public.record_battle_result(
  p_user_id uuid,
  p_mission_id integer,
  p_score integer,
  p_success boolean,
  p_duration_secs integer DEFAULT 0,
  p_hp_remaining integer DEFAULT 0,
  p_topic text DEFAULT NULL,
  p_kp_id text DEFAULT NULL,
  p_difficulty text DEFAULT 'green'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_is_service boolean := auth.role() = 'service_role';
  v_target_user_id uuid := CASE WHEN auth.role() = 'service_role' THEN p_user_id ELSE auth.uid() END;
  v_last_record timestamptz;
  v_score integer;
  v_duration integer;
  v_difficulty text;
BEGIN
  IF NOT v_is_service AND (v_uid IS NULL OR p_user_id IS DISTINCT FROM v_uid) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Sanity bounds. Reject clearly-garbage values outright so logs show the
  -- attack plainly; legit clients are nowhere near these limits.
  IF p_score IS NULL OR p_score < 0 OR p_score > 250000 THEN
    RAISE EXCEPTION 'Battle score out of bounds: %', p_score;
  END IF;
  v_score := p_score;

  v_duration := COALESCE(p_duration_secs, 0);
  IF v_duration < 0 OR v_duration > 7200 THEN
    RAISE EXCEPTION 'Battle duration out of bounds: %', v_duration;
  END IF;
  -- Sub-3s completions are impossible for any realistic 5-Q battle. Clamp
  -- rather than reject — a single laggy question could legitimately read back
  -- 2s, and hard-failing would lose the row entirely.
  IF v_duration < 3 AND p_success THEN
    v_duration := 3;
  END IF;

  v_difficulty := COALESCE(p_difficulty, 'green');
  IF v_difficulty NOT IN ('green', 'amber', 'red') THEN
    RAISE EXCEPTION 'Unknown difficulty: %', v_difficulty;
  END IF;

  SELECT MAX(created_at)
  INTO v_last_record
  FROM public.gl_battle_results
  WHERE user_id = v_target_user_id
    AND mission_id = p_mission_id
    AND score = v_score
    AND created_at > now() - interval '30 seconds';

  IF v_last_record IS NOT NULL THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.gl_battle_results (
    user_id, mission_id, kp_id, difficulty_mode, success, score,
    duration_secs, hp_remaining, created_at
  )
  VALUES (
    v_target_user_id, p_mission_id, p_kp_id, v_difficulty,
    p_success, v_score, v_duration, COALESCE(p_hp_remaining, 0), now()
  );

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_battle_result(uuid, integer, integer, boolean, integer, integer, text, text, text) TO authenticated;
