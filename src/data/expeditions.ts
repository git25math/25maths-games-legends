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
  // Expedition 2: 桃园远征 (Y7-Y8 easier variant)
  {
    id: 'exp_peachgarden',
    name: { zh: '桃园远征', en: 'Peach Garden Expedition' },
    description: { zh: '和刘关张三兄弟一起出发！入门级远征，军粮充足，适合新手。', en: 'Set out with the three sworn brothers! A beginner expedition with generous rations.' },
    gradeMin: 7, gradeMax: 8,
    startingRations: 7,
    nodes: [
      { id: 1, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 1, xpMultiplier: 1, name: { zh: '桃园出发', en: 'Peach Garden Start' } },
      { id: 2, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 0, xpMultiplier: 1, name: { zh: '乡间小路', en: 'Country Road' } },
      { id: 3, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0, name: { zh: '客栈歇脚', en: 'Inn Rest Stop' } },
      { id: 4, type: 'battle', difficulty: 'amber', questionCount: 1, rationReward: 0, xpMultiplier: 1.5, name: { zh: '山贼拦路', en: 'Bandit Roadblock' } },
      { id: 5, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 1, xpMultiplier: 2, name: { zh: '城门守卫', en: 'Gate Guards' } },
      { id: 6, type: 'boss', difficulty: 'red', questionCount: 2, rationReward: 0, xpMultiplier: 4, name: { zh: '黄巾首领', en: 'Yellow Turban Chief' } },
    ],
  },

  // Expedition 3: 北伐远征 (Y10-Y12 hard variant)
  {
    id: 'exp_northern',
    name: { zh: '北伐远征', en: 'Northern Campaign' },
    description: { zh: '诸葛亮六出祁山！高难度远征，军粮紧张，题目更难，奖励丰厚。', en: 'Zhuge Liang\'s six campaigns north! Hard expedition with tighter rations but greater rewards.' },
    gradeMin: 10, gradeMax: 12,
    startingRations: 4,
    nodes: [
      { id: 1, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 2, name: { zh: '祁山前哨', en: 'Qishan Outpost' } },
      { id: 2, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 1, xpMultiplier: 2, name: { zh: '街亭要塞', en: 'Jieting Fortress' } },
      { id: 3, type: 'battle', difficulty: 'red', questionCount: 2, rationReward: 0, xpMultiplier: 3, name: { zh: '木牛流马', en: 'Wooden Oxen' } },
      { id: 4, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0, name: { zh: '五丈原补给', en: 'Wuzhang Plains Supply' } },
      { id: 5, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 3.5, name: { zh: '空城退敌', en: 'Empty Fort Bluff' } },
      { id: 6, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 1, xpMultiplier: 4, name: { zh: '火烧上方谷', en: 'Shangfang Valley Fire' } },
      { id: 7, type: 'boss', difficulty: 'red', questionCount: 4, rationReward: 0, xpMultiplier: 6, name: { zh: '司马懿决战', en: 'Sima Yi Showdown' } },
    ],
  },
];

/** Get all expeditions available for a grade */
export function getExpeditionsForGrade(grade: number): Expedition[] {
  return EXPEDITIONS.filter(e => grade >= e.gradeMin && grade <= e.gradeMax);
}

/** Get the best single expedition for a grade (prefer grade-specific) */
export function getExpeditionForGrade(grade: number): Expedition | undefined {
  const all = getExpeditionsForGrade(grade);
  // Prefer narrower range (more targeted)
  return all.sort((a, b) => (a.gradeMax - a.gradeMin) - (b.gradeMax - b.gradeMin))[0];
}
