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

export type SeasonRewardType = 'title' | 'xp_boost' | 'skill_point' | 'border';

export type SeasonReward = {
  level: number;
  xpRequired: number;
  reward: {
    type: SeasonRewardType;
    value: string | number;
    name: BilingualText;
  };
};

/** Border color CSS classes unlocked by season level */
export const SEASON_BORDERS: { level: number; color: string; name: BilingualText }[] = [
  { level: 3, color: 'border-emerald-400', name: { zh: '翠玉边框', en: 'Jade Border' } },
  { level: 7, color: 'border-sky-400', name: { zh: '寒冰边框', en: 'Ice Border' } },
  { level: 12, color: 'border-purple-400', name: { zh: '紫霞边框', en: 'Mystic Border' } },
  { level: 18, color: 'border-rose-400', name: { zh: '烈焰边框', en: 'Flame Border' } },
  { level: 25, color: 'border-amber-400', name: { zh: '黄金边框', en: 'Gold Border' } },
  { level: 30, color: 'border-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.5)]', name: { zh: '帝王金框', en: 'Imperial Gold' } },
];

/** Get the highest unlocked border for a given season level */
export function getSeasonBorder(seasonLevel: number): { color: string; name: BilingualText } | null {
  for (let i = SEASON_BORDERS.length - 1; i >= 0; i--) {
    if (seasonLevel >= SEASON_BORDERS[i].level) return SEASON_BORDERS[i];
  }
  return null;
}

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

/** Hand-crafted 30-level reward track with meaningful variety. */
const REWARD_DEFINITIONS: { type: SeasonRewardType; value: string | number; name: BilingualText }[] = [
  /* Lv1  */ { type: 'title', value: '新兵', name: { zh: '新兵', en: 'Recruit' } },
  /* Lv2  */ { type: 'xp_boost', value: 200, name: { zh: '+200 功勋', en: '+200 XP' } },
  /* Lv3  */ { type: 'border', value: 'emerald', name: { zh: '翠玉边框', en: 'Jade Border' } },
  /* Lv4  */ { type: 'title', value: '列兵', name: { zh: '列兵', en: 'Private' } },
  /* Lv5  */ { type: 'xp_boost', value: 500, name: { zh: '+500 功勋', en: '+500 XP' } },
  /* Lv6  */ { type: 'title', value: '伍长', name: { zh: '伍长', en: 'Corporal' } },
  /* Lv7  */ { type: 'border', value: 'sky', name: { zh: '寒冰边框', en: 'Ice Border' } },
  /* Lv8  */ { type: 'xp_boost', value: 500, name: { zh: '+500 功勋', en: '+500 XP' } },
  /* Lv9  */ { type: 'title', value: '什长', name: { zh: '什长', en: 'Sergeant' } },
  /* Lv10 */ { type: 'skill_point', value: 1, name: { zh: '+1 修炼点', en: '+1 Skill Point' } },
  /* Lv11 */ { type: 'title', value: '百夫长', name: { zh: '百夫长', en: 'Centurion' } },
  /* Lv12 */ { type: 'border', value: 'purple', name: { zh: '紫霞边框', en: 'Mystic Border' } },
  /* Lv13 */ { type: 'xp_boost', value: 800, name: { zh: '+800 功勋', en: '+800 XP' } },
  /* Lv14 */ { type: 'title', value: '校尉', name: { zh: '校尉', en: 'Captain' } },
  /* Lv15 */ { type: 'xp_boost', value: 1000, name: { zh: '+1000 功勋', en: '+1000 XP' } },
  /* Lv16 */ { type: 'title', value: '偏将', name: { zh: '偏将', en: 'Lieutenant' } },
  /* Lv17 */ { type: 'xp_boost', value: 800, name: { zh: '+800 功勋', en: '+800 XP' } },
  /* Lv18 */ { type: 'border', value: 'rose', name: { zh: '烈焰边框', en: 'Flame Border' } },
  /* Lv19 */ { type: 'title', value: '裨将', name: { zh: '裨将', en: 'Commander' } },
  /* Lv20 */ { type: 'skill_point', value: 1, name: { zh: '+1 修炼点', en: '+1 Skill Point' } },
  /* Lv21 */ { type: 'xp_boost', value: 1000, name: { zh: '+1000 功勋', en: '+1000 XP' } },
  /* Lv22 */ { type: 'title', value: '中郎将', name: { zh: '中郎将', en: 'General' } },
  /* Lv23 */ { type: 'xp_boost', value: 1200, name: { zh: '+1200 功勋', en: '+1200 XP' } },
  /* Lv24 */ { type: 'title', value: '前将军', name: { zh: '前将军', en: 'Vanguard General' } },
  /* Lv25 */ { type: 'border', value: 'amber', name: { zh: '黄金边框', en: 'Gold Border' } },
  /* Lv26 */ { type: 'xp_boost', value: 1500, name: { zh: '+1500 功勋', en: '+1500 XP' } },
  /* Lv27 */ { type: 'title', value: '车骑将军', name: { zh: '车骑将军', en: 'Chariot General' } },
  /* Lv28 */ { type: 'skill_point', value: 2, name: { zh: '+2 修炼点', en: '+2 Skill Points' } },
  /* Lv29 */ { type: 'title', value: '上将军', name: { zh: '上将军', en: 'Grand General' } },
  /* Lv30 */ { type: 'border', value: 'imperial', name: { zh: '帝王金框', en: 'Imperial Gold' } },
];

export const SEASON_1_REWARDS: SeasonReward[] = REWARD_DEFINITIONS.map((r, i) => ({
  level: i + 1,
  xpRequired: (i + 1) * XP_PER_LEVEL,
  reward: r,
}));

/** Get the highest earned title for a given season level */
export function getSeasonTitle(seasonLevel: number): BilingualText | null {
  let lastTitle: BilingualText | null = null;
  for (const r of SEASON_1_REWARDS) {
    if (r.level > seasonLevel) break;
    if (r.reward.type === 'title') lastTitle = r.reward.name;
  }
  return lastTitle;
}

export function getSeasonLevel(seasonXP: number): { level: number; progress: number; xpInLevel: number; xpForLevel: number } {
  const level = Math.min(30, Math.floor(seasonXP / XP_PER_LEVEL));
  const xpInLevel = seasonXP - level * XP_PER_LEVEL;
  const xpForLevel = XP_PER_LEVEL;
  return { level, progress: Math.min(1, xpInLevel / xpForLevel), xpInLevel, xpForLevel };
}
