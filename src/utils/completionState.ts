import type { DifficultyMode, MissionCompletion } from '../types';

export type PracticeCompletionKey = DifficultyMode;
export type PracticeCompletionLike = Partial<MissionCompletion> | null | undefined;

export const PRACTICE_COMPLETION_KEYS: readonly PracticeCompletionKey[] = ['green', 'amber', 'red'];

export function normalizeMissionCompletion(completion: PracticeCompletionLike): MissionCompletion {
  return {
    green: Boolean(completion?.green),
    amber: Boolean(completion?.amber),
    red: Boolean(completion?.red),
  };
}

export function hasAnyPracticeCompletion(completion: PracticeCompletionLike): boolean {
  return PRACTICE_COMPLETION_KEYS.some(key => completion?.[key] === true);
}

export function isPracticePerfect(completion: PracticeCompletionLike): boolean {
  return PRACTICE_COMPLETION_KEYS.every(key => completion?.[key] === true);
}

export function markPracticeCompleted(completion: PracticeCompletionLike): MissionCompletion {
  return {
    ...normalizeMissionCompletion(completion),
    green: true,
    amber: true,
    red: true,
  };
}

export function markBattleDifficultyCompleted(
  completion: PracticeCompletionLike,
  difficulty: DifficultyMode,
): MissionCompletion {
  return {
    ...normalizeMissionCompletion(completion),
    [difficulty]: true,
  };
}
