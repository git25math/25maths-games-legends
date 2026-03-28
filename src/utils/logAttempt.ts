/**
 * logAttempt — Fire-and-forget analytics logger for student attempts.
 * Writes to `user_attempt_log` table (Supabase).
 * Silent on error — analytics should never block the student experience.
 */
import { supabase } from '../supabase';

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
    supabase.from('user_attempt_log').insert({
      user_id: data.user.id,
      question_id: event.questionId,
      node_id: event.nodeId,
      is_correct: event.isCorrect,
      raw_answer: event.rawAnswer?.slice(0, 200),
      primary_error_pattern_id: event.errorPatternId || null,
      source_mode: event.sourceMode,
      recovery_pack_id: null,
    }).then(() => {/* silent */}, () => {/* silent */});
  }).catch(() => {/* silent */});
}
