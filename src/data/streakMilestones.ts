import type { BilingualText } from '../types';

export type StreakMilestone = {
  id: string;
  days: number;
  xp: number;
  sp: number;
  title: BilingualText;
};

export const STREAK_MILESTONES: StreakMilestone[] = [
  { id: 'streak_14', days: 14, xp: 200, sp: 0, title: { zh: '铁壁将军', en: 'Iron Will' } },
  { id: 'streak_21', days: 21, xp: 300, sp: 1, title: { zh: '三周之约', en: 'Three-Week Warrior' } },
  { id: 'streak_30', days: 30, xp: 500, sp: 1, title: { zh: '不败之师', en: 'Unbreakable' } },
  { id: 'streak_60', days: 60, xp: 1000, sp: 2, title: { zh: '百战百胜', en: 'Invincible' } },
  { id: 'streak_100', days: 100, xp: 2000, sp: 3, title: { zh: '天命所归', en: 'Chosen One' } },
];

/** Find the next unclaimed milestone for the given streak */
export function getNextMilestone(streak: number, claimed: string[]): StreakMilestone | null {
  return STREAK_MILESTONES.find(m => streak < m.days && !claimed.includes(m.id)) ?? null;
}

/** Find a newly earned milestone (streak just reached or passed) */
export function getNewlyEarnedMilestone(streak: number, claimed: string[]): StreakMilestone | null {
  return STREAK_MILESTONES.find(m => streak >= m.days && !claimed.includes(m.id)) ?? null;
}
