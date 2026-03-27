import { afterEach, describe, expect, it, vi } from 'vitest';
import { MISSIONS } from '../data/missions';
import type { Mission } from '../types';
import { checkAnswer } from '../utils/checkCorrectness';
import { generateMission } from '../utils/generators';

function getTemplate(generatorType: string): Mission {
  const template = MISSIONS.find(m => m.data?.generatorType === generatorType);
  if (!template) throw new Error(`Missing mission template for ${generatorType}`);
  return template;
}

function withRandomSequence<T>(values: number[], fn: () => T): T {
  const queue = [...values];
  const spy = vi.spyOn(Math, 'random').mockImplementation(() => queue.shift() ?? 0);
  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('generator tiering', () => {
  it('uses the requested tier for geometry generators', () => {
    const template = getTemplate('ANGLES_POINT_RANDOM');
    const easy = withRandomSequence([0, 0], () => generateMission(template, 1));
    const hard = withRandomSequence([0, 0, 0], () => generateMission(template, 3));

    expect(easy.data?.angles).toHaveLength(2);
    expect(checkAnswer(easy, {}).expected.x).toBe('300');

    expect(hard.data?.angles).toHaveLength(3);
    expect(checkAnswer(hard, {}).expected.x).toBe('270');
  });

  it('uses the requested tier for number/statistics-style pool selection', () => {
    const template = getTemplate('VENN_RANDOM');
    const easy = withRandomSequence([0, 0.99, 0.99, 0.99, 0.99, 0], () => generateMission(template, 1));
    const hard = withRandomSequence([0, 0.99, 0.99, 0.99, 0.99, 0], () => generateMission(template, 3));

    expect(easy.data?.total).toBe(40);
    expect(hard.data?.total).toBe(200);
  });

  it('preserves the requested tier across safeRetry recursion', () => {
    const template = getTemplate('FACTORISE_RANDOM');
    const generated = withRandomSequence(
      [
        0, 0, 0.3, 0.25, // attempt 1: narrator, factor=3, p=3, q=3 -> gcd=3, retry
        0, 0.95, 0, 0,   // attempt 2: narrator, factor=7, p=2, q=1 -> gcd=1
      ],
      () => generateMission(template, 3),
    );

    expect(generated.data?.answer).toBe(7);
    expect(generated.data?.a).toBe(14);
    expect(generated.data?.b).toBe(7);
  });
});
