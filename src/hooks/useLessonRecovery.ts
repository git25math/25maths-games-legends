/**
 * useLessonRecovery — Detect ExamHub guided lesson completions
 *
 * Checks gl_lesson_runs for recent completions matching the student's
 * blocked/critical topics. When found, offers a free retry.
 *
 * Flow:
 *   Student fails in Play → jumps to ExamHub guided lesson
 *   → completes lesson → gl_lesson_runs written
 *   → Play detects on next load → "You just completed training! Free retry?"
 */
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getSkillHealthMap, type SkillHealthState } from '../utils/skillHealth';
import type { CompletedMissions } from '../types';

export type LessonRecoveryOffer = {
  lessonId: string;
  kpId: string | null;
  topicId: string;
  completedAt: string;
};

/**
 * Check if student has completed an ExamHub lesson for any blocked topic in the last 24h.
 * Returns the most recent matching lesson run, or null.
 */
export function useLessonRecovery(
  userId: string | null,
  completedMissions: CompletedMissions | null,
): { offer: LessonRecoveryOffer | null; dismiss: () => void } {
  const [offer, setOffer] = useState<LessonRecoveryOffer | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!userId || !completedMissions || dismissed) return;

    // Find topics with blocked/critical health
    const healthMap = getSkillHealthMap(completedMissions as Record<string, unknown>);
    const blockedTopics: string[] = [];
    for (const [topicId, health] of Object.entries(healthMap)) {
      const h = health as SkillHealthState;
      if (h.corruptionLevel === 'blocked' || h.corruptionLevel === 'critical') {
        blockedTopics.push(topicId);
      }
    }
    if (blockedTopics.length === 0) return;

    // Check for recent lesson completions (last 24h)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    supabase
      .from('gl_lesson_runs')
      .select('lesson_id, kp_id, completed_at')
      .eq('user_id', userId)
      .gte('completed_at', cutoff)
      .order('completed_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (!data || data.length === 0) return;

        // Match: does any lesson's kp_id map to a blocked topic?
        for (const run of data as any[]) {
          if (!run.kp_id) continue;
          const match = run.kp_id.match(/^kp-(\d+\.\d+)/);
          if (match && blockedTopics.includes(match[1])) {
            // Check if we already showed this offer (localStorage dedup)
            const key = `gl_recovery_shown_${run.lesson_id}_${run.completed_at}`;
            if (localStorage.getItem(key)) continue;
            localStorage.setItem(key, '1');

            setOffer({
              lessonId: run.lesson_id,
              kpId: run.kp_id,
              topicId: match[1],
              completedAt: run.completed_at,
            });
            return;
          }
        }
      })
      .catch(() => { /* lesson recovery check non-blocking */ });
  }, [userId, completedMissions, dismissed]);

  return {
    offer: dismissed ? null : offer,
    dismiss: () => setDismissed(true),
  };
}
