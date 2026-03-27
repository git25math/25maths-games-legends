-- P2: Track ExamHub guided lesson completions in Supabase
-- Enables teacher dashboard to see which students completed guided lessons
-- Synced from ExamHub's guided-lesson.js after each lesson completion

CREATE TABLE IF NOT EXISTS gl_lesson_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  kp_id TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_correct INT DEFAULT 0,
  practice_total INT DEFAULT 0,
  challenge_correct INT DEFAULT 0,
  challenge_total INT DEFAULT 0,
  reveals INT DEFAULT 0,
  duration_ms INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_gl_lesson_runs_user ON gl_lesson_runs (user_id);
CREATE INDEX IF NOT EXISTS idx_gl_lesson_runs_kp ON gl_lesson_runs (kp_id);

ALTER TABLE gl_lesson_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own lesson runs"
  ON gl_lesson_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own lesson runs"
  ON gl_lesson_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RPC for teacher dashboard: get lesson runs for a class
CREATE OR REPLACE FUNCTION get_class_lesson_runs(p_grade INT, p_class TEXT DEFAULT NULL)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  lesson_id TEXT,
  kp_id TEXT,
  completed_at TIMESTAMPTZ,
  practice_correct INT,
  practice_total INT,
  challenge_correct INT,
  challenge_total INT,
  duration_ms INT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lr.user_id, up.display_name, lr.lesson_id, lr.kp_id, lr.completed_at,
         lr.practice_correct, lr.practice_total, lr.challenge_correct, lr.challenge_total, lr.duration_ms
  FROM gl_lesson_runs lr
  JOIN gl_user_progress up ON lr.user_id = up.user_id
  WHERE up.grade = p_grade
  AND (p_class IS NULL OR up.class_tags @> ARRAY[p_class])
  ORDER BY lr.completed_at DESC;
$$;
