import type { BilingualText } from '../../types';
import type { SeasonTask, SeasonReward, SeasonRewardType } from './season1';

/** Season 2: 夏季·西征蜀道 */
export const SEASON_2_ID = 'S2_2026_summer';

export const SEASON_2_TASKS: SeasonTask[] = [
  // Daily tasks (reset every day)
  {
    id: 's2_daily_battles_3',
    name: { zh: '蜀道日练', en: 'Daily Shu Road' },
    description: { zh: '完成 3 场闯关', en: 'Complete 3 battles' },
    frequency: 'daily', target: 3, seasonXP: 60,
  },
  {
    id: 's2_daily_practice_2',
    name: { zh: '双倍温习', en: 'Double Review' },
    description: { zh: '完成 2 次练习', en: 'Complete 2 practice sessions' },
    frequency: 'daily', target: 2, seasonXP: 40,
  },
  {
    id: 's2_daily_streak_5',
    name: { zh: '五连胜', en: 'Pentakill' },
    description: { zh: '闯关中达成 5 连击', en: 'Achieve a 5-streak in battle' },
    frequency: 'daily', target: 5, seasonXP: 60,
  },

  // Weekly tasks (reset every Monday)
  {
    id: 's2_weekly_expedition_1',
    name: { zh: '远征出发', en: 'Expedition Launch' },
    description: { zh: '完成 1 次远征（任意难度）', en: 'Complete 1 expedition (any difficulty)' },
    frequency: 'weekly', target: 1, seasonXP: 250,
  },
  {
    id: 's2_weekly_red_5',
    name: { zh: '赤焰征途', en: 'Flame Path' },
    description: { zh: '完成 5 个 Red 难度关卡', en: 'Complete 5 Red difficulty missions' },
    frequency: 'weekly', target: 5, seasonXP: 200,
  },
  {
    id: 's2_weekly_new_8',
    name: { zh: '西征八方', en: 'Western Campaign' },
    description: { zh: '首次通过 8 个新关卡', en: 'First-clear 8 new missions' },
    frequency: 'weekly', target: 8, seasonXP: 250,
  },
  {
    id: 's2_weekly_shop_1',
    name: { zh: '军需采购', en: 'Supply Run' },
    description: { zh: '在商店购买 1 件道具', en: 'Buy 1 item from the shop' },
    frequency: 'weekly', target: 1, seasonXP: 100,
  },

  // Milestone tasks (never reset)
  {
    id: 's2_milestone_level_20',
    name: { zh: '身经百战', en: 'Veteran' },
    description: { zh: '达到等级 20', en: 'Reach level 20' },
    frequency: 'milestone', target: 20, seasonXP: 500,
  },
  {
    id: 's2_milestone_missions_100',
    name: { zh: '百战百胜', en: 'Centurion' },
    description: { zh: '累计通过 100 个关卡', en: 'Complete 100 missions total' },
    frequency: 'milestone', target: 100, seasonXP: 800,
  },
  {
    id: 's2_milestone_expedition_all',
    name: { zh: '四方远征', en: 'Four Expeditions' },
    description: { zh: '通关全部 4 条远征路线', en: 'Complete all 4 expedition routes' },
    frequency: 'milestone', target: 4, seasonXP: 1000,
  },
  {
    id: 's2_milestone_repair_10',
    name: { zh: '铸匠大师', en: 'Master Smith' },
    description: { zh: '累计修复 10 次装备', en: 'Repair equipment 10 times total' },
    frequency: 'milestone', target: 10, seasonXP: 500,
  },
  {
    id: 's2_milestone_rations_100',
    name: { zh: '粮草大吏', en: 'Quartermaster' },
    description: { zh: '累计获得 100 军粮', en: 'Earn 100 rations total' },
    frequency: 'milestone', target: 100, seasonXP: 400,
  },
];

/** 30-level reward track — Season 2 theme: 蜀道将帅 */
const XP_PER_LEVEL = 120; // slightly harder than S1's 100

const REWARD_DEFINITIONS: { type: SeasonRewardType; value: string | number; name: BilingualText }[] = [
  /* Lv1  */ { type: 'title', value: '蜀道新卒', name: { zh: '蜀道新卒', en: 'Shu Road Recruit' } },
  /* Lv2  */ { type: 'xp_boost', value: 300, name: { zh: '+300 功勋', en: '+300 Merit' } },
  /* Lv3  */ { type: 'border', value: 'teal', name: { zh: '蜀地翠框', en: 'Shu Jade Border' } },
  /* Lv4  */ { type: 'title', value: '栈道卫兵', name: { zh: '栈道卫兵', en: 'Plank Road Guard' } },
  /* Lv5  */ { type: 'xp_boost', value: 500, name: { zh: '+500 功勋', en: '+500 Merit' } },
  /* Lv6  */ { type: 'title', value: '山路巡官', name: { zh: '山路巡官', en: 'Mountain Patrol' } },
  /* Lv7  */ { type: 'border', value: 'lime', name: { zh: '竹林绿框', en: 'Bamboo Border' } },
  /* Lv8  */ { type: 'xp_boost', value: 600, name: { zh: '+600 功勋', en: '+600 Merit' } },
  /* Lv9  */ { type: 'title', value: '关隘守将', name: { zh: '关隘守将', en: 'Pass Commander' } },
  /* Lv10 */ { type: 'skill_point', value: 1, name: { zh: '+1 修炼点', en: '+1 Skill Point' } },
  /* Lv11 */ { type: 'title', value: '先锋营长', name: { zh: '先锋营长', en: 'Vanguard Captain' } },
  /* Lv12 */ { type: 'border', value: 'cyan', name: { zh: '剑阁蓝框', en: 'Sword Gate Blue' } },
  /* Lv13 */ { type: 'xp_boost', value: 800, name: { zh: '+800 功勋', en: '+800 Merit' } },
  /* Lv14 */ { type: 'title', value: '蜀道将尉', name: { zh: '蜀道将尉', en: 'Shu Lieutenant' } },
  /* Lv15 */ { type: 'xp_boost', value: 1000, name: { zh: '+1000 功勋', en: '+1000 Merit' } },
  /* Lv16 */ { type: 'title', value: '汉中太守', name: { zh: '汉中太守', en: 'Hanzhong Governor' } },
  /* Lv17 */ { type: 'xp_boost', value: 1000, name: { zh: '+1000 功勋', en: '+1000 Merit' } },
  /* Lv18 */ { type: 'border', value: 'orange', name: { zh: '蜀锦橙框', en: 'Shu Brocade Border' } },
  /* Lv19 */ { type: 'title', value: '益州刺史', name: { zh: '益州刺史', en: 'Yizhou Inspector' } },
  /* Lv20 */ { type: 'skill_point', value: 1, name: { zh: '+1 修炼点', en: '+1 Skill Point' } },
  /* Lv21 */ { type: 'xp_boost', value: 1200, name: { zh: '+1200 功勋', en: '+1200 Merit' } },
  /* Lv22 */ { type: 'title', value: '蜀汉中郎', name: { zh: '蜀汉中郎', en: 'Shu General' } },
  /* Lv23 */ { type: 'xp_boost', value: 1500, name: { zh: '+1500 功勋', en: '+1500 Merit' } },
  /* Lv24 */ { type: 'title', value: '骠骑将军', name: { zh: '骠骑将军', en: 'Cavalry General' } },
  /* Lv25 */ { type: 'border', value: 'red', name: { zh: '赤壁烈焰框', en: 'Red Cliffs Flame' } },
  /* Lv26 */ { type: 'xp_boost', value: 2000, name: { zh: '+2000 功勋', en: '+2000 Merit' } },
  /* Lv27 */ { type: 'title', value: '丞相军师', name: { zh: '丞相军师', en: 'Chancellor Strategist' } },
  /* Lv28 */ { type: 'skill_point', value: 2, name: { zh: '+2 修炼点', en: '+2 Skill Points' } },
  /* Lv29 */ { type: 'title', value: '蜀汉之主', name: { zh: '蜀汉之主', en: 'Lord of Shu Han' } },
  /* Lv30 */ { type: 'border', value: 'shu_gold', name: { zh: '蜀汉金龙框', en: 'Shu Han Golden Dragon' } },
];

export const SEASON_2_REWARDS: SeasonReward[] = REWARD_DEFINITIONS.map((r, i) => ({
  level: i + 1,
  xpRequired: (i + 1) * XP_PER_LEVEL,
  reward: r,
}));
