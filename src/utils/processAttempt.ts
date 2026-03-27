/**
 * processAttempt() — Resilience Engine Main Entry
 *
 * Converts a single answer into:
 *   - Node health change
 *   - Error pattern memory
 *   - Corruption level update
 *   - Recovery recommendation
 *   - Downstream risk flags
 *
 * This runs client-side and writes to completed_missions JSONB.
 * No separate Supabase table needed for MVP — piggybacks on existing storage.
 */

import type { ErrorType } from './diagnoseError';
import { ERROR_PATTERNS, detectErrorPattern, type ErrorPattern } from './errorPatterns';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export type CorruptionLevel = 'none' | 'warning' | 'blocked' | 'critical';

export type SkillHealthState = {
  healthScore: number;              // 0-100
  corruptionLevel: CorruptionLevel;
  dominantPatternId: string | null;
  consecutiveSamePattern: number;
  recentErrorCount: number;         // errors in recent window
  totalAttempts: number;
  blockingPatterns: string[];       // up to 3 distinct patterns
  lastErrorAt: string | null;       // ISO timestamp
  recoveredAt: string | null;       // last recovery completion
};

export type AttemptResult = {
  isCorrect: boolean;
  healthScore: number;
  corruptionLevel: CorruptionLevel;
  dominantPatternId: string | null;
  patternLabel: { en: string; zh: string } | null;
  patternIcon: string | null;
  shouldTriggerRepair: boolean;
  repairReason: { en: string; zh: string } | null;
  recoveryPackId: string | null;
  recoveryHint: { en: string; zh: string } | null;
  damage: number;
  healthDelta: number;              // negative = damage, positive = healing
};

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const BASE_DAMAGE = 20;
const CORRECT_HEAL = 8;
const RECOVERY_FULL_HEAL = 100;
const MAX_BLOCKING_PATTERNS = 3;

// Corruption thresholds
const HEALTH_WARNING = 75;
const HEALTH_BLOCKED = 50;
const HEALTH_CRITICAL = 25;
const CONSECUTIVE_BLOCK_THRESHOLD = 3;

// ═══════════════════════════════════════════════════════════════
// Default state
// ═══════════════════════════════════════════════════════════════

export function createDefaultHealth(): SkillHealthState {
  return {
    healthScore: 100,
    corruptionLevel: 'none',
    dominantPatternId: null,
    consecutiveSamePattern: 0,
    recentErrorCount: 0,
    totalAttempts: 0,
    blockingPatterns: [],
    lastErrorAt: null,
    recoveredAt: null,
  };
}

// ═══════════════════════════════════════════════════════════════
// Main Engine
// ═══════════════════════════════════════════════════════════════

/**
 * Process a single attempt and return updated health + UI feedback.
 * Pure function — caller is responsible for persisting the returned state.
 */
export function processAttempt(
  state: SkillHealthState,
  isCorrect: boolean,
  patternId?: string,
  topicId?: string,
): { newState: SkillHealthState; result: AttemptResult } {
  let s = { ...state };
  s.totalAttempts += 1;

  if (isCorrect) {
    return processCorrect(s);
  } else {
    return processIncorrect(s, patternId, topicId);
  }
}

/**
 * Process a Recovery Pack completion — full node restoration.
 */
export function processRecoveryComplete(state: SkillHealthState): SkillHealthState {
  return {
    ...state,
    healthScore: RECOVERY_FULL_HEAL,
    corruptionLevel: 'none',
    dominantPatternId: null,
    consecutiveSamePattern: 0,
    recentErrorCount: 0,
    blockingPatterns: [],
    recoveredAt: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════
// Internal: Correct Answer
// ═══════════════════════════════════════════════════════════════

function processCorrect(s: SkillHealthState): { newState: SkillHealthState; result: AttemptResult } {
  // Break consecutive error chain
  s.consecutiveSamePattern = 0;

  // Heal — but don't immediately clear corruption
  const prevHealth = s.healthScore;
  s.healthScore = Math.min(100, s.healthScore + CORRECT_HEAL);

  // Gradual corruption recovery (correct answers slowly bring it down)
  if (s.corruptionLevel === 'critical' && s.healthScore >= HEALTH_CRITICAL) {
    s.corruptionLevel = 'blocked';
  } else if (s.corruptionLevel === 'blocked' && s.healthScore >= HEALTH_BLOCKED) {
    s.corruptionLevel = 'warning';
  } else if (s.corruptionLevel === 'warning' && s.healthScore >= HEALTH_WARNING) {
    s.corruptionLevel = 'none';
  }

  return {
    newState: s,
    result: {
      isCorrect: true,
      healthScore: s.healthScore,
      corruptionLevel: s.corruptionLevel,
      dominantPatternId: s.dominantPatternId,
      patternLabel: null,
      patternIcon: null,
      shouldTriggerRepair: false,
      repairReason: null,
      recoveryPackId: null,
      recoveryHint: null,
      damage: 0,
      healthDelta: s.healthScore - prevHealth,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Internal: Incorrect Answer
// ═══════════════════════════════════════════════════════════════

function processIncorrect(
  s: SkillHealthState,
  rawPatternId?: string,
  topicId?: string,
): { newState: SkillHealthState; result: AttemptResult } {
  s.recentErrorCount += 1;
  s.lastErrorAt = new Date().toISOString();

  // Resolve pattern
  const patternId = rawPatternId || (topicId ? getFallbackPattern(topicId) : 'generic_number');
  const pattern = ERROR_PATTERNS[patternId] ?? null;

  // Calculate damage
  const severity = pattern?.severityWeight ?? 1.0;
  const damage = Math.round(BASE_DAMAGE * severity);
  const prevHealth = s.healthScore;
  s.healthScore = Math.max(0, s.healthScore - damage);

  // Update dominant pattern + consecutive counter
  if (s.dominantPatternId === patternId) {
    s.consecutiveSamePattern += 1;
  } else {
    s.dominantPatternId = patternId;
    s.consecutiveSamePattern = 1;
  }

  // Update blocking patterns (keep last 3 distinct)
  if (!s.blockingPatterns.includes(patternId)) {
    s.blockingPatterns = [...s.blockingPatterns, patternId].slice(-MAX_BLOCKING_PATTERNS);
  }

  // Determine corruption level (dual-trigger: health threshold + consecutive pattern)
  if (s.healthScore < HEALTH_CRITICAL || isRapidRelapse(s)) {
    s.corruptionLevel = 'critical';
  } else if (s.consecutiveSamePattern >= CONSECUTIVE_BLOCK_THRESHOLD || s.healthScore < HEALTH_BLOCKED) {
    s.corruptionLevel = 'blocked';
  } else if (s.healthScore < HEALTH_WARNING || s.recentErrorCount >= 2) {
    s.corruptionLevel = 'warning';
  }
  // Don't downgrade corruption on error — only correct/recovery can heal

  // Should trigger repair?
  const shouldRepair =
    s.corruptionLevel === 'blocked' ||
    s.corruptionLevel === 'critical' ||
    s.consecutiveSamePattern >= CONSECUTIVE_BLOCK_THRESHOLD;

  return {
    newState: s,
    result: {
      isCorrect: false,
      healthScore: s.healthScore,
      corruptionLevel: s.corruptionLevel,
      dominantPatternId: patternId,
      patternLabel: pattern?.label ?? { en: 'Error detected', zh: '检测到错误' },
      patternIcon: pattern?.icon ?? '?',
      shouldTriggerRepair: shouldRepair,
      repairReason: shouldRepair ? (pattern?.label ?? { en: 'Skill instability', zh: '技能不稳定' }) : null,
      recoveryPackId: shouldRepair ? (pattern?.recoveryPackId ?? null) : null,
      recoveryHint: pattern?.recoveryHint ?? null,
      damage,
      healthDelta: s.healthScore - prevHealth,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

/** Check if student relapsed quickly after recovery */
function isRapidRelapse(s: SkillHealthState): boolean {
  if (!s.recoveredAt) return false;
  const hoursSinceRecovery = (Date.now() - new Date(s.recoveredAt).getTime()) / 3600000;
  return hoursSinceRecovery < 24 && s.consecutiveSamePattern >= 2;
}

/** Get fallback pattern for a topic's chapter */
function getFallbackPattern(topicId: string): string {
  const ch = topicId.split('.')[0];
  if (ch === '2') return 'generic_algebra';
  if (ch === '4' || ch === '5') return 'generic_geometry';
  return 'generic_number';
}

// ═══════════════════════════════════════════════════════════════
// Storage helpers — read/write from completed_missions JSONB
// ═══════════════════════════════════════════════════════════════

const SKILL_HEALTH_KEY = '_skillHealth';

/** Read all skill health states from completed_missions */
export function getSkillHealthMap(cm: Record<string, unknown>): Record<string, SkillHealthState> {
  return ((cm as any)?.[SKILL_HEALTH_KEY] ?? {}) as Record<string, SkillHealthState>;
}

/** Get health state for a specific topic */
export function getSkillHealth(cm: Record<string, unknown>, topicId: string): SkillHealthState {
  const map = getSkillHealthMap(cm);
  return map[topicId] ?? createDefaultHealth();
}

/** Write updated health state back into completed_missions (returns new cm) */
export function setSkillHealth(
  cm: Record<string, unknown>,
  topicId: string,
  state: SkillHealthState,
): Record<string, unknown> {
  const map = getSkillHealthMap(cm);
  return { ...cm, [SKILL_HEALTH_KEY]: { ...map, [topicId]: state } };
}
