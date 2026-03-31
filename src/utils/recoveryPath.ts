/**
 * Recovery Path — builds a step-by-step healing journey from a corrupted
 * tech tree node all the way back to its deepest weak prerequisite.
 *
 * Flow: corrupted node → recursive trace → ordered steps (deepest first)
 *       → student practices each step → errors clear → node heals
 */

import type { Mission } from '../types';
import type { ErrorType } from './diagnoseError';
import type { MistakeRecord } from './errorMemory';
import { getDominantPattern } from './errorMemory';

// ── Types ──

export type RecoveryStep = {
  topicId: string;
  reason: { zh: string; en: string };
  errorType: ErrorType;
  missionId: number;     // most-errored mission in this topic
  completed: boolean;
};

export type RecoverySession = {
  originTopicId: string;
  originErrorType: ErrorType;
  steps: RecoveryStep[];       // ordered deepest-root-first → origin-last
  currentStepIdx: number;
  startedAt: number;
};

// ── Constants ──

const MAX_STEPS = 8;

// ── Core functions ──

/**
 * Build a recovery path from a corrupted topic back to its deepest weak root.
 *
 * Algorithm:
 *   1. Deep-trace remediation graph (DFS, only weak nodes)
 *   2. Reverse order → deepest root first
 *   3. Deduplicate by topicId
 *   4. Pick the most-errored mission per topic
 *   5. Append origin topic as the final step
 *   6. Cap at MAX_STEPS
 *
 * Returns null if no weak prerequisites exist (origin-only repair).
 */
export async function buildRecoveryPath(
  originTopicId: string,
  originErrorType: ErrorType,
  mistakes: Record<string, MistakeRecord>,
  missions: Mission[],
): Promise<RecoverySession | null> {
  const [{ getDeepRemediationPath }, { buildMissionTopicMap }] = await Promise.all([
    import('./errorRemediation'),
    import('./techTree'),
  ]);
  const missionTopicMap = buildMissionTopicMap(missions);

  // 1. Deep trace (returns immediate → deepest order)
  const rawPath = getDeepRemediationPath(
    originTopicId,
    originErrorType,
    mistakes,
    missionTopicMap,
    3,  // weakThreshold: catch at-risk nodes (3+) not just corrupted (5+)
    8,  // maxDepth
  );

  // 2. Reverse → deepest first
  const reversed = [...rawPath].reverse();

  // 3. Deduplicate by topicId (keep first occurrence = deepest)
  const seen = new Set<string>();
  const deduped = reversed.filter(entry => {
    if (seen.has(entry.topicId)) return false;
    seen.add(entry.topicId);
    return true;
  });

  // 4. Build steps with most-errored mission per topic
  const steps: RecoveryStep[] = [];
  for (const entry of deduped) {
    if (steps.length >= MAX_STEPS - 1) break; // leave room for origin
    const missionId = pickMostErroredMission(entry.topicId, missionTopicMap, mistakes);
    if (missionId === null) continue; // no missions for this topic
    const topicMissions = missionTopicMap.get(entry.topicId) ?? [];
    const dominantError = getTopicDominant(topicMissions, mistakes) ?? 'method';
    steps.push({
      topicId: entry.topicId,
      reason: entry.reason,
      errorType: dominantError,
      missionId,
      completed: false,
    });
  }

  // 5. Append origin topic as final step
  const originMissionId = pickMostErroredMission(originTopicId, missionTopicMap, mistakes);
  if (originMissionId !== null) {
    steps.push({
      topicId: originTopicId,
      reason: { zh: '修复原始知识点', en: 'Repair the original skill' },
      errorType: originErrorType,
      missionId: originMissionId,
      completed: false,
    });
  }

  // No steps or only origin → no path needed
  if (steps.length <= 1) return null;

  return {
    originTopicId,
    originErrorType,
    steps,
    currentStepIdx: 0,
    startedAt: Date.now(),
  };
}

/** Mark current step as completed and advance to the next one. */
export function advanceRecoveryStep(session: RecoverySession): RecoverySession {
  const newSteps = session.steps.map((s, i) =>
    i === session.currentStepIdx ? { ...s, completed: true } : s
  );
  return {
    ...session,
    steps: newSteps,
    currentStepIdx: Math.min(session.currentStepIdx + 1, session.steps.length),
  };
}

/** Check if all steps in the recovery session are completed. */
export function isRecoveryComplete(session: RecoverySession): boolean {
  return session.steps.every(s => s.completed);
}

/** Get the current active step (or null if all complete). */
export function getCurrentStep(session: RecoverySession): RecoveryStep | null {
  if (session.currentStepIdx >= session.steps.length) return null;
  return session.steps[session.currentStepIdx];
}

/** Read a saved recovery session from completed_missions._recovery.
 *  Validates structure to prevent crashes from corrupted data. */
export function getRecoverySession(
  completedMissions: Record<string, unknown>,
): RecoverySession | null {
  const raw = (completedMissions as any)?._recovery;
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.originTopicId || typeof raw.originTopicId !== 'string') return null;
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) return null;
  if (typeof raw.currentStepIdx !== 'number' || raw.currentStepIdx < 0) return null;
  if (!Number.isFinite(raw.startedAt)) return null;

  // Validate each step has required fields
  const validErrorTypes = ['sign', 'rounding', 'magnitude', 'method', 'unknown'];
  for (const step of raw.steps) {
    if (!step || typeof step.topicId !== 'string') return null;
    if (typeof step.missionId !== 'number') return null;
    if (!validErrorTypes.includes(step.errorType)) return null;
  }

  return raw as RecoverySession;
}

// ── Helpers ──

/** Pick the mission with the highest error count in a topic.
 *  Tie-break: prefer most recently errored (latest lastWrong). */
function pickMostErroredMission(
  topicId: string,
  missionTopicMap: Map<string, number[]>,
  mistakes: Record<string, MistakeRecord>,
): number | null {
  const missionIds = missionTopicMap.get(topicId) ?? [];
  if (missionIds.length === 0) return null;

  let bestId = missionIds[0];
  let bestCount = 0;
  let bestDate = '';

  for (const mid of missionIds) {
    const rec = mistakes[String(mid)];
    if (!rec) continue;
    if (rec.count > bestCount || (rec.count === bestCount && rec.lastWrong > bestDate)) {
      bestCount = rec.count;
      bestDate = rec.lastWrong;
      bestId = mid;
    }
  }

  return bestId;
}

/** Get dominant error pattern for a topic's missions. */
function getTopicDominant(
  missionIds: number[],
  mistakes: Record<string, MistakeRecord>,
): ErrorType | null {
  let maxCount = 0;
  let dominant: ErrorType | null = null;
  for (const mid of missionIds) {
    const rec = mistakes[String(mid)];
    if (rec && rec.count > maxCount) {
      maxCount = rec.count;
      dominant = getDominantPattern(rec);
    }
  }
  return dominant;
}
