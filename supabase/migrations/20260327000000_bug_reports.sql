-- v8.10: Bug Report System
-- Players can report problems with questions (wrong question, wrong answer check, display issue, other).

CREATE TABLE IF NOT EXISTS gl_bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id INT NOT NULL,
  mission_type TEXT NOT NULL,
  grade INT,
  lang TEXT NOT NULL DEFAULT 'zh',
  category TEXT NOT NULL CHECK (category IN ('question', 'answer', 'display', 'other')),
  description TEXT,
  user_id UUID REFERENCES auth.users(id),    -- NULL for guests
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gl_bug_reports_mission ON gl_bug_reports (mission_id);
CREATE INDEX IF NOT EXISTS idx_gl_bug_reports_created ON gl_bug_reports (created_at DESC);

ALTER TABLE gl_bug_reports ENABLE ROW LEVEL SECURITY;

-- Anyone (including guests) can insert a bug report
CREATE POLICY "Anyone can insert bug reports"
  ON gl_bug_reports FOR INSERT
  WITH CHECK (true);

-- Only the reporter can read their own reports; admins see all via SECURITY DEFINER RPCs
CREATE POLICY "Users read own bug reports"
  ON gl_bug_reports FOR SELECT
  USING (user_id = auth.uid());
