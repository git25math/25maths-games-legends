import type { HeroSkill, CharacterProgression, SkillEffectType } from '../types';

/** All 18 hero skills (6 characters × 3 tiers) */
export const HERO_SKILLS: HeroSkill[] = [
  // --- Cao Cao (wisdom 95) ---
  {
    id: 'caocao_tuntian', charId: 'caocao', tier: 1, cost: 1,
    name: { zh: '屯田', en: 'Field Strategy' },
    description: { zh: '闯关时第一题显示公式提示', en: 'Show formula hint on Q1 in battle' },
    effect: 'extra_hint', effectValue: 1, statRequirement: 'wisdom',
  },
  {
    id: 'caocao_weiwu', charId: 'caocao', tier: 2, cost: 2,
    name: { zh: '魏武', en: 'Wei Might' },
    description: { zh: '闯关中答错一次不扣血', en: '1 free miss in battle (no HP loss)' },
    effect: 'error_forgive', effectValue: 1, statRequirement: 'power',
  },
  {
    id: 'caocao_qice', charId: 'caocao', tier: 3, cost: 3,
    name: { zh: '奇策', en: 'Grand Stratagem' },
    description: { zh: '闯关通关得分 +15%', en: '+15% score bonus on battle completion' },
    effect: 'time_extend', effectValue: 15, statRequirement: 'wisdom',
  },

  // --- Liu Bei (wisdom 90) ---
  {
    id: 'liubei_rende', charId: 'liubei', tier: 1, cost: 1,
    name: { zh: '仁德', en: 'Benevolence' },
    description: { zh: '闯关时第一题显示解题提示', en: 'Show solving hint on Q1 in battle' },
    effect: 'extra_hint', effectValue: 1, statRequirement: 'wisdom',
  },
  {
    id: 'liubei_taoyuan', charId: 'liubei', tier: 2, cost: 2,
    name: { zh: '桃园', en: 'Peach Garden' },
    description: { zh: '闯关中答错一次不扣血', en: '1 free miss in battle (no HP loss)' },
    effect: 'error_forgive', effectValue: 1, statRequirement: 'power',
  },
  {
    id: 'liubei_hanzhong', charId: 'liubei', tier: 3, cost: 3,
    name: { zh: '汉中', en: 'Hanzhong' },
    description: { zh: '闯关通关得分 +15%', en: '+15% score bonus on battle completion' },
    effect: 'time_extend', effectValue: 15, statRequirement: 'wisdom',
  },

  // --- Sun Quan (speed 75) ---
  {
    id: 'sunquan_zhiheng', charId: 'sunquan', tier: 1, cost: 1,
    name: { zh: '制衡', en: 'Balance' },
    description: { zh: '闯关中答错一次不扣血', en: '1 free miss in battle (no HP loss)' },
    effect: 'error_forgive', effectValue: 1, statRequirement: 'speed',
  },
  {
    id: 'sunquan_jiangdong', charId: 'sunquan', tier: 2, cost: 2,
    name: { zh: '江东', en: 'Jiangdong' },
    description: { zh: '闯关通关得分 +15%', en: '+15% score bonus on battle completion' },
    effect: 'time_extend', effectValue: 15, statRequirement: 'speed',
  },
  {
    id: 'sunquan_tianming', charId: 'sunquan', tier: 3, cost: 3,
    name: { zh: '天命', en: 'Mandate' },
    description: { zh: '闯关时前两题显示公式提示', en: 'Show formula hint on Q1-Q2 in battle' },
    effect: 'extra_hint', effectValue: 2, statRequirement: 'wisdom',
  },

  // --- Guan Yu (power 100) ---
  {
    id: 'guanyu_wusheng', charId: 'guanyu', tier: 1, cost: 1,
    name: { zh: '武圣', en: 'War Saint' },
    description: { zh: '闯关中答错一次不扣血', en: '1 free miss in battle (no HP loss)' },
    effect: 'error_forgive', effectValue: 1, statRequirement: 'power',
  },
  {
    id: 'guanyu_qinglong', charId: 'guanyu', tier: 2, cost: 2,
    name: { zh: '青龙', en: 'Green Dragon' },
    description: { zh: '闯关通关得分 +15%', en: '+15% score bonus on battle completion' },
    effect: 'time_extend', effectValue: 15, statRequirement: 'speed',
  },
  {
    id: 'guanyu_yijue', charId: 'guanyu', tier: 3, cost: 3,
    name: { zh: '义绝', en: 'Unmatched Honor' },
    description: { zh: '闯关时第一题显示公式提示', en: 'Show formula hint on Q1 in battle' },
    effect: 'extra_hint', effectValue: 1, statRequirement: 'wisdom',
  },

  // --- Zhuge Liang (wisdom 100) ---
  {
    id: 'zhugeliang_guanxing', charId: 'zhugeliang', tier: 1, cost: 1,
    name: { zh: '观星', en: 'Stargazing' },
    description: { zh: '闯关时前两题显示公式提示', en: 'Show formula hint on Q1-Q2 in battle' },
    effect: 'extra_hint', effectValue: 2, statRequirement: 'wisdom',
  },
  {
    id: 'zhugeliang_bazhen', charId: 'zhugeliang', tier: 2, cost: 2,
    name: { zh: '八阵', en: 'Eight Formations' },
    description: { zh: '闯关通关得分 +15%', en: '+15% score bonus on battle completion' },
    effect: 'time_extend', effectValue: 15, statRequirement: 'wisdom',
  },
  {
    id: 'zhugeliang_kongcheng', charId: 'zhugeliang', tier: 3, cost: 3,
    name: { zh: '空城', en: 'Empty Fort' },
    description: { zh: '闯关中答错两次不扣血', en: '2 free misses in battle (no HP loss)' },
    effect: 'error_forgive', effectValue: 2, statRequirement: 'wisdom',
  },

  // --- Diao Chan (speed 100) ---
  {
    id: 'diaochan_lijian', charId: 'diaochan', tier: 1, cost: 1,
    name: { zh: '离间', en: 'Divide' },
    description: { zh: '闯关时第一题显示公式提示', en: 'Show formula hint on Q1 in battle' },
    effect: 'extra_hint', effectValue: 1, statRequirement: 'speed',
  },
  {
    id: 'diaochan_biyue', charId: 'diaochan', tier: 2, cost: 2,
    name: { zh: '闭月', en: 'Eclipse' },
    description: { zh: '闯关通关得分 +20%', en: '+20% score bonus on battle completion' },
    effect: 'time_extend', effectValue: 20, statRequirement: 'speed',
  },
  {
    id: 'diaochan_lianhuan', charId: 'diaochan', tier: 3, cost: 3,
    name: { zh: '连环', en: 'Chain' },
    description: { zh: '闯关中答错一次不扣血', en: '1 free miss in battle (no HP loss)' },
    effect: 'error_forgive', effectValue: 1, statRequirement: 'power',
  },
];

/** Get all skills for a character */
export function getCharSkills(charId: string): HeroSkill[] {
  return HERO_SKILLS.filter(s => s.charId === charId).sort((a, b) => a.tier - b.tier);
}

/** Get skill by ID */
export function getSkillById(skillId: string): HeroSkill | undefined {
  return HERO_SKILLS.find(s => s.id === skillId);
}

/** Get the active skill effect for a character's current progression */
export function getActiveSkillEffect(
  progression: CharacterProgression | undefined
): { effect: SkillEffectType; value: number } | null {
  if (!progression?.active_skill) return null;
  const skill = getSkillById(progression.active_skill);
  if (!skill) return null;
  return { effect: skill.effect, value: skill.effectValue };
}

/** Default progression for a new character */
export function defaultProgression(charId: string): CharacterProgression {
  return { char_id: charId, skill_points: 0, unlocked_skills: [], active_skill: null };
}
