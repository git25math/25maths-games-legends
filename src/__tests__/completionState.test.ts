import { describe, expect, it } from 'vitest';
import {
  hasAnyPracticeCompletion,
  isPracticePerfect,
  markBattleDifficultyCompleted,
  markPracticeCompleted,
  normalizeMissionCompletion,
} from '../utils/completionState';

describe('completionState', () => {
  it('treats practice completion as green/amber/red only', () => {
    expect(hasAnyPracticeCompletion(undefined)).toBe(false);
    expect(hasAnyPracticeCompletion({ green: true })).toBe(true);
    expect(isPracticePerfect({ green: true, amber: true, red: true })).toBe(true);
    expect(isPracticePerfect({ green: true, amber: true, red: false })).toBe(false);
  });

  it('normalizes and updates completion records without dropping existing difficulties', () => {
    expect(normalizeMissionCompletion(undefined)).toEqual({ green: false, amber: false, red: false });
    expect(markBattleDifficultyCompleted({ green: true }, 'red')).toEqual({ green: true, amber: false, red: true });
    expect(markPracticeCompleted({ green: true })).toEqual({ green: true, amber: true, red: true });
  });
});
