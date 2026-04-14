import { describe, expect, it } from 'vitest';
import { checkAnswer } from '../utils/checkCorrectness';
import type { Mission } from '../types';

function makeMission(overrides: Partial<Mission> & { type: Mission['type']; data: any }): Mission {
  return {
    id: 999,
    grade: 7,
    title: { zh: 't', en: 't' },
    topic: 'Algebra',
    type: overrides.type,
    data: overrides.data,
    reward: 100,
    difficulty: 'Easy',
    ...overrides,
  } as unknown as Mission;
}

describe('checkAnswer — ESTIMATION', () => {
  it('accepts float input when data.answer is defined (parse path)', () => {
    const m = makeMission({ type: 'ESTIMATION', data: { answer: 3.5 } });
    expect(checkAnswer(m, { ans: '3.5' }).correct).toBe(true);
    expect(checkAnswer(m, { ans: '3' }).correct).toBe(false);
  });

  it('accepts float-capable parse on sqrt-fallback path (regression)', () => {
    // Previously used parseInt here, rejecting floats. Now uses parse().
    const m = makeMission({ type: 'ESTIMATION', data: { value: 100 } });
    // Math.round(Math.sqrt(100)) === 10
    expect(checkAnswer(m, { ans: '10' }).correct).toBe(true);
    expect(checkAnswer(m, { ans: '10.0' }).correct).toBe(true);
    expect(checkAnswer(m, { ans: '9' }).correct).toBe(false);
  });

  it('returns safe fallback when ESTIMATION data has neither answer nor value', () => {
    const m = makeMission({ type: 'ESTIMATION', data: {} });
    const result = checkAnswer(m, { ans: '5' });
    expect(result.correct).toBe(false);
    expect(result.expected).toEqual({});
  });

  it('empty / whitespace input is incorrect (not NaN-pass)', () => {
    const m = makeMission({ type: 'ESTIMATION', data: { answer: 5 } });
    expect(checkAnswer(m, { ans: '' }).correct).toBe(false);
    expect(checkAnswer(m, { ans: '   ' }).correct).toBe(false);
  });
});

describe('checkAnswer — multiple-choice path', () => {
  it('uses _mc flag to route to MC branch', () => {
    const m = makeMission({
      type: 'FRACTION',
      data: {
        choices: [{ value: 'a' }, { value: 'b' }],
        correctChoice: 'b',
      },
    });
    expect(checkAnswer(m, { ans: 'b', _mc: '1' }).correct).toBe(true);
    expect(checkAnswer(m, { ans: 'a', _mc: '1' }).correct).toBe(false);
  });

  it('handles numeric correctChoice via String() coercion', () => {
    const m = makeMission({
      type: 'FRACTION',
      data: {
        choices: [{ value: 1 }, { value: 2 }],
        correctChoice: 2,
      },
    });
    expect(checkAnswer(m, { ans: '2', _mc: '1' }).correct).toBe(true);
    expect(checkAnswer(m, { ans: '1', _mc: '1' }).correct).toBe(false);
  });

  it('ignores MC path when _mc flag missing (falls through to type check)', () => {
    const m = makeMission({
      type: 'FRACTION',
      data: {
        choices: [{ value: 'a' }],
        correctChoice: 'a',
        // No other fraction fields — falls through all and returns default
      },
    });
    // Without _mc flag, MC path skipped; FRACTION path requires fields not here.
    // The test is that _mc: '1' is REQUIRED to match, proving the guard works.
    expect(checkAnswer(m, { ans: 'a' }).correct).toBe(false);
  });
});
