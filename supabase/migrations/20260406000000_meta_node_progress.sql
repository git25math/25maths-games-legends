-- Phase 1.7: meta_node_progress — unified cross-product progress table
-- Tracks per-user, per-kn_id progress from multiple sources (play, practice, examhub).
-- Play writes after each battle; other products write via their own integrations.

CREATE TABLE IF NOT EXISTS meta_node_progress (
  user_id    UUID NOT NULL REFERENCES auth.users(id),
  kn_id      TEXT NOT NULL,
  source     TEXT NOT NULL DEFAULT 'play',  -- 'play' | 'practice' | 'examhub'
  attempts   INT NOT NULL DEFAULT 0,
  wins       INT NOT NULL DEFAULT 0,
  last_score INT NOT NULL DEFAULT 0,
  best_score INT NOT NULL DEFAULT 0,
  mastery_score  NUMERIC(5,2) DEFAULT 0,  -- 0-100 composite mastery %
  flm_state  TEXT DEFAULT 'new',           -- 'new' | 'learning' | 'familiar' | 'mastered'
  last_practiced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, kn_id, source)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_meta_node_user ON meta_node_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_meta_node_kn   ON meta_node_progress(kn_id);

-- RLS: users can read/write own rows
ALTER TABLE meta_node_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY meta_node_select ON meta_node_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY meta_node_insert ON meta_node_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY meta_node_update ON meta_node_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- upsert_meta_node_progress: atomic upsert called after battle completion
CREATE OR REPLACE FUNCTION upsert_meta_node_progress(
  p_user_id UUID,
  p_kn_id   TEXT,
  p_source  TEXT,
  p_score   INT,
  p_correct BOOLEAN
) RETURNS VOID AS $$
DECLARE
  v_wins     INT;
  v_attempts INT;
  v_mastery  NUMERIC(5,2);
  v_flm      TEXT;
BEGIN
  INSERT INTO meta_node_progress (user_id, kn_id, source, attempts, wins, last_score, best_score)
  VALUES (
    p_user_id,
    p_kn_id,
    p_source,
    1,
    CASE WHEN p_correct THEN 1 ELSE 0 END,
    p_score,
    p_score
  )
  ON CONFLICT (user_id, kn_id, source) DO UPDATE SET
    attempts  = meta_node_progress.attempts + 1,
    wins      = meta_node_progress.wins + CASE WHEN p_correct THEN 1 ELSE 0 END,
    last_score = p_score,
    best_score = GREATEST(meta_node_progress.best_score, p_score),
    last_practiced_at = now(),
    updated_at = now();

  -- Compute FLM state from win rate
  SELECT wins, attempts INTO v_wins, v_attempts
  FROM meta_node_progress
  WHERE user_id = p_user_id AND kn_id = p_kn_id AND source = p_source;

  IF v_attempts = 0 THEN
    v_flm := 'new';
    v_mastery := 0;
  ELSE
    v_mastery := ROUND((v_wins::NUMERIC / v_attempts) * 100, 2);
    IF v_wins >= 4 AND v_mastery >= 80 THEN
      v_flm := 'mastered';
    ELSIF v_wins >= 2 AND v_mastery >= 60 THEN
      v_flm := 'familiar';
    ELSIF v_attempts >= 1 THEN
      v_flm := 'learning';
    ELSE
      v_flm := 'new';
    END IF;
  END IF;

  UPDATE meta_node_progress
  SET mastery_score = v_mastery,
      flm_state    = v_flm
  WHERE user_id = p_user_id AND kn_id = p_kn_id AND source = p_source;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Teacher read access: get unified progress for a list of students
CREATE OR REPLACE FUNCTION get_student_meta_progress(p_user_id UUID)
RETURNS SETOF meta_node_progress
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF auth.uid() != p_user_id
    AND NOT EXISTS (SELECT 1 FROM teachers WHERE user_id = auth.uid())
  THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
    SELECT * FROM meta_node_progress
    WHERE user_id = p_user_id
    ORDER BY kn_id, source;
END;
$$;
