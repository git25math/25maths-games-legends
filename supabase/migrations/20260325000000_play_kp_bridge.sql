-- v7.3: Play KP Progress Bridge
-- Shared table for cross-app KP mastery tracking.
-- Play writes after battles/practice; ExamHub reads (future) to boost FLM state.

CREATE TABLE IF NOT EXISTS play_kp_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kp_id TEXT NOT NULL,
  wins INT DEFAULT 0,
  attempts INT DEFAULT 0,
  last_score INT DEFAULT 0,
  best_score INT DEFAULT 0,
  last_played_at TIMESTAMPTZ DEFAULT now(),
  mastered_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, kp_id)
);

ALTER TABLE play_kp_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own play_kp_progress"
  ON play_kp_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users write own play_kp_progress"
  ON play_kp_progress FOR ALL
  USING (auth.uid() = user_id);

-- Atomic upsert RPC: called by Play after battle/practice completion
CREATE OR REPLACE FUNCTION upsert_play_kp(
  p_user_id UUID,
  p_kp_id TEXT,
  p_success BOOLEAN,
  p_score INT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO play_kp_progress (user_id, kp_id, wins, attempts, last_score, best_score)
  VALUES (
    p_user_id,
    p_kp_id,
    CASE WHEN p_success THEN 1 ELSE 0 END,
    1,
    p_score,
    p_score
  )
  ON CONFLICT (user_id, kp_id) DO UPDATE SET
    wins = play_kp_progress.wins + CASE WHEN p_success THEN 1 ELSE 0 END,
    attempts = play_kp_progress.attempts + 1,
    last_score = p_score,
    best_score = GREATEST(play_kp_progress.best_score, p_score),
    last_played_at = now(),
    mastered_at = CASE
      WHEN p_success
        AND play_kp_progress.wins + 1 >= 2
        AND play_kp_progress.mastered_at IS NULL
      THEN now()
      ELSE play_kp_progress.mastered_at
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
