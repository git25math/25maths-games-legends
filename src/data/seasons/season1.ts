import type { BilingualText } from '../../types';

export type TaskFrequency = 'daily' | 'weekly' | 'milestone';

export type SeasonTask = {
  id: string;
  name: BilingualText;
  description: BilingualText;
  frequency: TaskFrequency;
  target: number;
  seasonXP: number;
};

export type SeasonReward = {
  level: number;
  xpRequired: number;
  reward: {
    type: 'title' | 'xp_boost' | 'skill_point';
    value: string | number;
    name: BilingualText;
  };
};

/** Season 1: 春季·桃园篇 */
export const SEASON_1_ID = 'S1_2026_spring';

export const SEASON_1_TASKS: SeasonTask[] = [
  // Daily tasks (reset every day)
  {
    id: 'daily_battles_3',
    name: { zh: '日行三战', en: 'Three Daily Battles' },
    description: { zh: '完成 3 场闯关', en: 'Complete 3 battles' },
    frequency: 'daily', target: 3, seasonXP: 50,
  },
  {
    id: 'daily_practice_1',
    name: { zh: '温故知新', en: 'Review & Learn' },
    description: { zh: '完成 1 次练习', en: 'Complete 1 practice session' },
    frequency: 'daily', target: 1, seasonXP: 30,
  },
  {
    id: 'daily_streak_3',
    name: { zh: '三连胜', en: 'Triple Win' },
    description: { zh: '闯关中达成 3 连击', en: 'Achieve a 3-streak in battle' },
    frequency: 'daily', target: 3, seasonXP: 40,
  },

  // Weekly tasks (reset every Monday)
  {
    id: 'weekly_red_3',
    name: { zh: '赤色征途', en: 'Red Path' },
    description: { zh: '完成 3 个 Red 难度关卡', en: 'Complete 3 Red difficulty missions' },
    frequency: 'weekly', target: 3, seasonXP: 150,
  },
  {
    id: 'weekly_repair_1',
    name: { zh: '铸剑师', en: 'Bladesmith' },
    description: { zh: '修复 1 件装备', en: 'Repair 1 piece of equipment' },
    frequency: 'weekly', target: 1, seasonXP: 100,
  },
  {
    id: 'weekly_new_5',
    name: { zh: '开疆拓土', en: 'New Frontiers' },
    description: { zh: '首次通过 5 个新关卡', en: 'First-clear 5 new missions' },
    frequency: 'weekly', target: 5, seasonXP: 200,
  },

  // Milestone tasks (never reset)
  {
    id: 'milestone_level_10',
    name: { zh: '初露锋芒', en: 'Rising Star' },
    description: { zh: '达到等级 10', en: 'Reach level 10' },
    frequency: 'milestone', target: 10, seasonXP: 300,
  },
  {
    id: 'milestone_missions_50',
    name: { zh: '百战之将', en: 'Battle Veteran' },
    description: { zh: '累计通过 50 个关卡', en: 'Complete 50 missions total' },
    frequency: 'milestone', target: 50, seasonXP: 500,
  },
  {
    id: 'milestone_skill_3',
    name: { zh: '修炼有成', en: 'Mastery Achieved' },
    description: { zh: '解锁 3 个武将技能', en: 'Unlock 3 hero skills' },
    frequency: 'milestone', target: 3, seasonXP: 400,
  },
  {
    id: 'milestone_repair_5',
    name: { zh: '装备大师', en: 'Equipment Master' },
    description: { zh: '累计修复 5 次装备', en: 'Repair equipment 5 times total' },
    frequency: 'milestone', target: 5, seasonXP: 350,
  },
];

/** 30-level reward track. XP per level = 100 (total 3000 to max). */
const XP_PER_LEVEL = 100;

export const SEASON_1_REWARDS: SeasonReward[] = Array.from({ length: 30 }, (_, i) => {
  const level = i + 1;
  const xpRequired = level * XP_PER_LEVEL;

  // Distribute rewards across 30 levels
  let reward: SeasonReward['reward'];
  if (level % 10 === 0) {
    // Every 10 levels: skill point
    reward = { type: 'skill_point', value: 1, name: { zh: `+1 修炼点`, en: `+1 Skill Point` } };
  } else if (level % 5 === 0) {
    // Every 5 levels: XP boost
    reward = { type: 'xp_boost', value: 500, name: { zh: `+500 功勋`, en: `+500 XP` } };
  } else {
    // Other levels: titles
    const titles: BilingualText[] = [
      { zh: '新兵', en: 'Recruit' },
      { zh: '列兵', en: 'Private' },
      { zh: '伍长', en: 'Corporal' },
      { zh: '什长', en: 'Sergeant' },
      { zh: '百夫长', en: 'Centurion' },
      { zh: '校尉', en: 'Captain' },
      { zh: '偏将', en: 'Lieutenant' },
      { zh: '裨将', en: 'Commander' },
      { zh: '中郎将', en: 'General' },
      { zh: '上将军', en: 'Grand General' },
    ];
    const titleIdx = Math.min(Math.floor((level - 1) / 3), titles.length - 1);
    reward = { type: 'title', value: titles[titleIdx].zh, name: titles[titleIdx] };
  }

  return { level, xpRequired, reward };
});

export function getSeasonLevel(seasonXP: number): { level: number; progress: number; xpInLevel: number; xpForLevel: number } {
  const level = Math.min(30, Math.floor(seasonXP / XP_PER_LEVEL));
  const xpInLevel = seasonXP - level * XP_PER_LEVEL;
  const xpForLevel = XP_PER_LEVEL;
  return { level, progress: Math.min(1, xpInLevel / xpForLevel), xpInLevel, xpForLevel };
}
