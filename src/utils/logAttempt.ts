/**
 * logAttempt — Fire-and-forget analytics logger for student attempts.
 * Writes to `user_attempt_log` table (Supabase).
 * Silent on error — analytics should never block the student experience.
 */
import { supabase } from '../supabase';
import { getKnIdForKp } from '../data/curriculum/kp-registry';

export interface AttemptEvent {
  questionId: string;   // mission id + question fingerprint
  nodeId: string;       // kpId or topic
  isCorrect: boolean;
  rawAnswer?: string;   // student's raw input (first field)
  errorPatternId?: string;
  sourceMode: 'practice' | 'recovery' | 'boss' | 'diagnostic';
  durationMs?: number;  // time from question shown to submit
}

export function logAttempt(event: AttemptEvent): void {
  // Fire-and-forget — don't await, don't block UI
  supabase.auth.getUser().then(({ data }) => {
    if (!data?.user?.id) return; // guest mode — skip logging
    // Resolve canonical kn_id from nodeId (kpId format)
    const knId = getKnIdForKp(event.nodeId) ?? null;
    // SECURITY DEFINER RPC (20260423180000) — server enforces user_id =
    // auth.uid() and validates enums + length caps. Direct INSERT policy
    // was dropped to prevent client spoofing of error_pattern_id, etc.
    supabase.rpc('log_user_attempt', {
      p_question_id: event.questionId,
      p_node_id: event.nodeId,
      p_kn_id: knId,
      p_is_correct: event.isCorrect,
      p_raw_answer: event.rawAnswer ?? null,
      p_primary_error_pattern_id: event.errorPatternId || null,
      p_source_mode: event.sourceMode,
      p_recovery_pack_id: null,
    }).then(() => {/* silent */}, () => {/* silent */});
  }).catch(() => {/* silent */});
}
