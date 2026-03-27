import { describe, expect, it } from 'vitest';
import type { Mission } from '../types';
import { createQuestionFingerprint } from '../utils/questionFingerprint';

const baseMission: Mission = {
  id: 1211,
  grade: 12,
  unitId: 1,
  order: 1,
  unitTitle: { zh: '微积分', en: 'Calculus' },
  topic: 'Calculus',
  type: 'DERIVATIVE',
  title: { zh: '导数', en: 'Derivative' },
  story: { zh: '诸葛亮观察坡度。', en: 'Zhuge Liang studies the slope.' },
  description: { zh: '求切线斜率', en: 'Find the tangent slope.' },
  data: { generatorType: 'DERIVATIVE_RANDOM', func: 'x^2', x: 3, answer: 6 },
  difficulty: 'Hard',
  reward: 100,
  tutorialSteps: [],
  secret: {
    concept: { zh: '导数', en: 'Derivative' },
    formula: 'dy/dx',
    tips: [],
  },
};

describe('createQuestionFingerprint', () => {
  it('changes when the underlying question data changes even if the answer stays the same', () => {
    const sameAnswerDifferentPrompt: Mission = {
      ...baseMission,
      data: { generatorType: 'DERIVATIVE_RANDOM', func: '2x', x: 3, answer: 6 },
    };

    expect(createQuestionFingerprint(baseMission)).not.toBe(createQuestionFingerprint(sameAnswerDifferentPrompt));
  });

  it('is stable when object keys are inserted in a different order', () => {
    const reordered: Mission = {
      ...baseMission,
      data: { answer: 6, x: 3, func: 'x^2', generatorType: 'DERIVATIVE_RANDOM' },
    };

    expect(createQuestionFingerprint(baseMission)).toBe(createQuestionFingerprint(reordered));
  });
});
