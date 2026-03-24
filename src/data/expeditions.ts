import type { BilingualText, DifficultyMode } from '../types';

export type ExpeditionNodeType = 'battle' | 'rest' | 'boss';

export type ExpeditionNode = {
  id: number;
  type: ExpeditionNodeType;
  difficulty: DifficultyMode;
  questionCount: number;
  rationReward: number;
  xpMultiplier: number;
  name: BilingualText;
};

export type Expedition = {
  id: string;
  name: BilingualText;
  description: BilingualText;
  nodes: ExpeditionNode[];
  startingRations: number;
  gradeMin: number;
  gradeMax: number;
};

/** v7.3 MVP: Single expedition — "赤壁远征" */
export const EXPEDITIONS: Expedition[] = [
  {
    id: 'exp_redcliffs',
    name: { zh: '赤壁远征', en: 'Red Cliffs Expedition' },
    description: { zh: '带上军粮，一路杀向曹营！答错会消耗军粮，军粮耗尽则远征失败。', en: 'Bring rations and fight through to Cao Cao\'s camp! Wrong answers cost rations. Run out and the expedition fails.' },
    gradeMin: 7, gradeMax: 12,
    startingRations: 5,
    nodes: [
      { id: 1, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 0, xpMultiplier: 1, name: { zh: '前哨战', en: 'Outpost' } },
      { id: 2, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 1, xpMultiplier: 1, name: { zh: '渡口遭遇', en: 'River Crossing' } },
      { id: 3, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 1.5, name: { zh: '伏兵夹击', en: 'Ambush' } },
      { id: 4, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0, name: { zh: '补给站', en: 'Supply Point' } },
      { id: 5, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 2, name: { zh: '水寨突破', en: 'Harbor Breach' } },
      { id: 6, type: 'battle', difficulty: 'red', questionCount: 2, rationReward: 1, xpMultiplier: 2.5, name: { zh: '火船冲锋', en: 'Fire Ship Charge' } },
      { id: 7, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 3, name: { zh: '连环阵', en: 'Chain Formation' } },
      { id: 8, type: 'boss', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 5, name: { zh: '曹营决战', en: 'Final Battle' } },
    ],
  },
];

export function getExpeditionForGrade(grade: number): Expedition | undefined {
  return EXPEDITIONS.find(e => grade >= e.gradeMin && grade <= e.gradeMax);
}
