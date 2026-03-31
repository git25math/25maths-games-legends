export type CorruptionLevel = 'none' | 'warning' | 'blocked' | 'critical';

export type SkillHealthState = {
  healthScore: number;
  corruptionLevel: CorruptionLevel;
  dominantPatternId: string | null;
  consecutiveSamePattern: number;
  recentErrorCount: number;
  totalAttempts: number;
  blockingPatterns: string[];
  lastErrorAt: string | null;
  recoveredAt: string | null;
};

const RECOVERY_FULL_HEAL = 100;
const SKILL_HEALTH_KEY = '_skillHealth';

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

export function getSkillHealthMap(cm: Record<string, unknown>): Record<string, SkillHealthState> {
  return ((cm as any)?.[SKILL_HEALTH_KEY] ?? {}) as Record<string, SkillHealthState>;
}

export function getSkillHealth(cm: Record<string, unknown>, topicId: string): SkillHealthState {
  const map = getSkillHealthMap(cm);
  return map[topicId] ?? createDefaultHealth();
}

export function setSkillHealth(
  cm: Record<string, unknown>,
  topicId: string,
  state: SkillHealthState,
): Record<string, unknown> {
  const map = getSkillHealthMap(cm);
  return { ...cm, [SKILL_HEALTH_KEY]: { ...map, [topicId]: state } };
}
