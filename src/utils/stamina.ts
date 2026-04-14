// Daily Boss Trial Stamina — 3 attempts per day, resets at midnight
// Practice (GREEN/AMBER/RED) is always free; only Battle costs stamina

import { STAMINA } from './gameBalance';
import { getTodayKey } from './dateKey';

export { getTodayKey };

const MAX_DAILY = STAMINA.MAX_DAILY;

export type DailyStamina = {
  date: string;   // YYYYMMDD
  used: number;   // 0..3+
  bonus: number;  // extra attempts earned (e.g. from Master Crystal)
};

/** Read stamina from completed_missions JSONB, auto-reset if day changed */
export function getStamina(completedMissions: Record<string, unknown>): DailyStamina {
  const raw = (completedMissions as any)?._stamina as DailyStamina | undefined;
  const today = getTodayKey();
  if (!raw || raw.date !== today) {
    return { date: today, used: 0, bonus: 0 };
  }
  return raw;
}

/** How many attempts remain today */
export function getRemainingAttempts(stamina: DailyStamina): number {
  return Math.max(0, MAX_DAILY + stamina.bonus - stamina.used);
}

/** Consume 1 attempt. Returns updated stamina (caller must persist to JSONB). */
export function consumeAttempt(stamina: DailyStamina): DailyStamina {
  return { ...stamina, used: stamina.used + 1 };
}

/** Grant bonus attempt (e.g. from Master Crystal). Returns updated stamina. */
export function grantBonusAttempt(stamina: DailyStamina): DailyStamina {
  return { ...stamina, bonus: stamina.bonus + 1 };
}

/** Seconds until midnight (for countdown display) */
export function getSecondsUntilReset(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

/** Format seconds as HH:MM:SS */
export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const MAX_STAMINA = MAX_DAILY;
