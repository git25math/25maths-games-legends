/**
 * recordAttempt — M0 Phase 3 · 统一 attempt 写入 + 衍生层更新入口
 *
 * 两步:
 *   1. 写 user_attempt_log (决策 E · 前端写 attempt)
 *   2. 调 RPC log_attempt_and_derive (Supabase 端 FLM/XP/streak/daily/achievement)
 *
 * derive 结果通过 window 'm0:derivation' CustomEvent 派发,
 * 由 DerivationToasts 组件接收 · 不阻塞主流程。
 *
 * logAttempt.ts 保留 2 周作为 fallback(未在生产路径调用) · 观察期满删除。
 */

import { supabase } from '../supabase';
import { getKnIdForKp } from '../data/curriculum/kp-registry';

export interface AttemptEvent {
  questionId: string;
  nodeId: string; // kpId (如 "kp-1.12-01") 或 topicId
  isCorrect: boolean;
  rawAnswer?: string;
  errorPatternId?: string;
  sourceMode: 'practice' | 'recovery' | 'boss' | 'diagnostic';
  durationMs?: number;
}

export interface DerivationResult {
  success: boolean;
  xp: { awarded: number; total: number; level: number; level_up: boolean; source: string };
  streak: { current: number; best: number; action: string; freeze_available: boolean; total_active_days: number };
  flm: {
    node_id: string;
    kn_id: string | null;
    before_state: string;
    after_state: string;
    health_score: number;
    health_delta: number;
    total_attempt_count: number;
    total_correct_count: number;
  };
  daily: { questions_answered: number; correct_answers: number };
  achievements_unlocked: string[];
}

/** kpId "kp-1.12-01" → topicId "1.12" (与 user_skill_health 既有写入对齐) */
function extractTopicId(nodeId: string): string {
  const m = nodeId.match(/^kp-(\d+\.\d+)/);
  return m ? m[1] : nodeId;
}

export function recordAttempt(event: AttemptEvent): void {
  supabase.auth.getUser().then(({ data }) => {
    if (!data?.user?.id) return; // guest mode
    const userId = data.user.id;
    const knId = getKnIdForKp(event.nodeId) ?? null;
    const topicId = extractTopicId(event.nodeId);

    // Step 1 · user_attempt_log (fire-and-forget)
    supabase.from('user_attempt_log').insert({
      user_id: userId,
      question_id: event.questionId,
      node_id: event.nodeId,
      kn_id: knId,
      is_correct: event.isCorrect,
      raw_answer: event.rawAnswer?.slice(0, 200),
      primary_error_pattern_id: event.errorPatternId || null,
      source_mode: event.sourceMode,
      recovery_pack_id: null,
    }).then(() => {}, () => {});

    // Step 2 · derivation
    supabase.rpc('log_attempt_and_derive', {
      p_question_id: event.questionId,
      p_node_id: topicId,
      p_is_correct: event.isCorrect,
      p_source_product: 'play',
      p_source_mode: event.sourceMode,
      p_kn_id: knId,
      p_raw_answer: event.rawAnswer?.slice(0, 200) ?? null,
      p_error_pattern_id: event.errorPatternId ?? null,
      p_duration_ms: event.durationMs ?? null,
      p_extra_context: null,
    }).then(({ data: result, error }) => {
      if (error) {
        console.warn('[recordAttempt] derive failed:', error.message);
        return;
      }
      if (result && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent<DerivationResult>('m0:derivation', { detail: result as DerivationResult }),
        );
      }
    }, () => {});
  }).catch(() => {});
}
