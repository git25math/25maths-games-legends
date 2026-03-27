-- ═══════════════════════════════════════════════════════════════
-- 25Maths Resilience Engine v1.0 — MVP Database Schema
-- ═══════════════════════════════════════════════════════════════
-- Supports: Error Pattern → Node Health → Recovery → Restoration
-- Minimal viable tables for the "Expand Brackets" pilot

-- ── Helper: updated_at trigger ──
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ═══ Table 1: Error Pattern Registry ═══
CREATE TABLE IF NOT EXISTS public.error_pattern_remedy_map (
  error_pattern_id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  ui_label_en TEXT NOT NULL,
  ui_label_zh TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  icon_code TEXT NOT NULL DEFAULT '!',
  severity_weight NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  recovery_pack_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_severity CHECK (severity_weight > 0 AND severity_weight <= 5)
);

CREATE TRIGGER trg_error_pattern_updated BEFORE UPDATE ON public.error_pattern_remedy_map
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══ Table 2: Recovery Packs ═══
CREATE TABLE IF NOT EXISTS public.recovery_packs (
  recovery_pack_id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  target_node_id TEXT,
  target_error_pattern_id TEXT,
  description_en TEXT,
  description_zh TEXT,
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  question_count INT NOT NULL DEFAULT 5,
  success_threshold NUMERIC(5,2) NOT NULL DEFAULT 0.80,
  estimated_minutes INT NOT NULL DEFAULT 5,
  difficulty_level INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_question_count CHECK (question_count > 0),
  CONSTRAINT chk_threshold CHECK (success_threshold >= 0 AND success_threshold <= 1)
);

CREATE TRIGGER trg_recovery_packs_updated BEFORE UPDATE ON public.recovery_packs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══ Table 3: User Attempt Log (raw flow) ═══
CREATE TABLE IF NOT EXISTS public.user_attempt_log (
  attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  raw_answer TEXT,
  primary_error_pattern_id TEXT,
  source_mode TEXT NOT NULL DEFAULT 'practice',
  recovery_pack_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_source_mode CHECK (source_mode IN ('practice', 'recovery', 'boss', 'diagnostic'))
);

CREATE INDEX IF NOT EXISTS idx_attempt_user_node ON public.user_attempt_log (user_id, node_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempt_pattern ON public.user_attempt_log (primary_error_pattern_id);

-- ═══ Table 4: User Skill Health (aggregated state) ═══
CREATE TABLE IF NOT EXISTS public.user_skill_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  mastery_state TEXT NOT NULL DEFAULT 'learning',
  health_score INT NOT NULL DEFAULT 100,
  corruption_level TEXT NOT NULL DEFAULT 'none',
  dominant_error_pattern_id TEXT,
  consecutive_same_pattern_count INT NOT NULL DEFAULT 0,
  recent_error_count INT NOT NULL DEFAULT 0,
  total_attempt_count INT NOT NULL DEFAULT 0,
  total_correct_count INT NOT NULL DEFAULT 0,
  recommended_recovery_pack_id TEXT,
  last_error_at TIMESTAMPTZ,
  last_recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_skill UNIQUE (user_id, node_id),
  CONSTRAINT chk_mastery CHECK (mastery_state IN ('locked', 'learning', 'stable', 'mastered', 'flawless')),
  CONSTRAINT chk_corruption CHECK (corruption_level IN ('none', 'warning', 'blocked', 'critical')),
  CONSTRAINT chk_health CHECK (health_score >= 0 AND health_score <= 100)
);

CREATE INDEX IF NOT EXISTS idx_skill_health_user ON public.user_skill_health (user_id);
CREATE TRIGGER trg_skill_health_updated BEFORE UPDATE ON public.user_skill_health
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══ RLS ═══
ALTER TABLE public.error_pattern_remedy_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempt_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_health ENABLE ROW LEVEL SECURITY;

-- Config tables: authenticated read
CREATE POLICY "read_error_patterns" ON public.error_pattern_remedy_map FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_recovery_packs" ON public.recovery_packs FOR SELECT TO authenticated USING (true);

-- User tables: own data only
CREATE POLICY "read_own_attempts" ON public.user_attempt_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_attempts" ON public.user_attempt_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "read_own_health" ON public.user_skill_health FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_health" ON public.user_skill_health FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_health" ON public.user_skill_health FOR UPDATE USING (auth.uid() = user_id);

-- ═══ Seed: Expand Brackets pilot data ═══
INSERT INTO public.error_pattern_remedy_map (error_pattern_id, domain, ui_label_en, ui_label_zh, icon_code, severity_weight, recovery_pack_id) VALUES
  ('sign_distribution_error', 'algebra', 'Sign Distribution Error', '符号分配失误', '±', 1.40, 'RP-ALG-001'),
  ('term_omission_error', 'algebra', 'Term Omission', '漏项失误', '∅', 1.20, 'RP-ALG-002'),
  ('coefficient_distribution_error', 'algebra', 'Coefficient Distribution Error', '系数分配错误', '×', 1.10, 'RP-ALG-004'),
  ('generic_expansion_error', 'algebra', 'Expansion Error', '展开错误', '!', 0.90, 'RP-ALG-000')
ON CONFLICT (error_pattern_id) DO NOTHING;

INSERT INTO public.recovery_packs (recovery_pack_id, title_en, title_zh, target_node_id, target_error_pattern_id, question_count, success_threshold, estimated_minutes) VALUES
  ('RP-ALG-001', 'Negative Bracket Master', '负号分配修复', 'expand_brackets', 'sign_distribution_error', 5, 0.80, 4),
  ('RP-ALG-002', 'Precision Expanding', '逐项展开修复', 'expand_brackets', 'term_omission_error', 5, 0.80, 4),
  ('RP-ALG-004', 'Multiplier Control', '系数乘法修复', 'expand_brackets', 'coefficient_distribution_error', 5, 0.80, 4),
  ('RP-ALG-000', 'Expansion Reset Pack', '展开基础重建', 'expand_brackets', 'generic_expansion_error', 5, 0.80, 5)
ON CONFLICT (recovery_pack_id) DO NOTHING;

-- ═══ Helper RPC: ensure health row exists ═══
CREATE OR REPLACE FUNCTION public.ensure_user_skill_health(p_user_id UUID, p_node_id TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.user_skill_health (user_id, node_id) VALUES (p_user_id, p_node_id)
  ON CONFLICT (user_id, node_id) DO NOTHING;
END;
$$;
