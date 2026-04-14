// Daily Challenge — deterministic daily mission selection via date hash
// Same mission for all players on the same day, 3x reward multiplier

import type { Mission, CompletedMissions } from '../types';
import { getTodayKey } from './dateKey';

export { getTodayKey };

export const DAILY_MULTIPLIER = 3;

/**
 * Find a coprime of n near n*0.618 (golden ratio) for good distribution.
 */
function findCoprime(n: number): number {
  const gcd = (a: number, b: number): number => { while (b) { [a, b] = [b, a % b]; } return a; };
  let candidate = Math.max(1, Math.floor(n * 0.618));
  // Search upward for a coprime
  while (candidate < n && gcd(candidate, n) !== 1) candidate++;
  return candidate < n ? candidate : 1;
}

/**
 * Deterministic daily index selection.
 * Uses day-of-year + year as seed, then applies a coprime step
 * to permute through the pool without repeats until full cycle.
 * Guarantees no repeat within poolSize days.
 */
function dailyIndex(dateStr: string, poolSize: number): number {
  if (poolSize <= 1) return 0;
  const y = parseInt(dateStr.slice(0, 4));
  const m = parseInt(dateStr.slice(4, 6)) - 1;
  const d = parseInt(dateStr.slice(6, 8));
  const dayOfYear = Math.floor((Date.UTC(y, m, d) - Date.UTC(y, 0, 0)) / 86400000);
  const yearOffset = ((y * 7) + 13) % poolSize;
  const step = findCoprime(poolSize);
  return (dayOfYear * step + yearOffset) % poolSize;
}

/** Select today's daily mission from the pool */
export function getDailyMission(missions: Mission[], grade: number | null): Mission | null {
  // Filter to missions matching grade, with generators (so they produce varied questions)
  const pool = missions.filter(m =>
    m.grade === grade && m.data?.generatorType
  );
  if (pool.length === 0) return null;

  const idx = dailyIndex(getTodayKey(), pool.length);
  return pool[idx];
}

/** Check if today's daily challenge has been completed */
export function isDailyCompleted(completedMissions: CompletedMissions): boolean {
  const key = `daily_${getTodayKey()}`;
  return !!(completedMissions as Record<string, unknown>)[key];
}

/**
 * Validate that the given mission is actually today's daily for the grade,
 * and that the daily has not already been completed.
 * Used to guard against stale isDailyBattle flags (e.g., cross-midnight submit).
 */
export function isValidDailySubmission(
  mission: Mission,
  allMissions: Mission[],
  grade: number | null,
  completedMissions: CompletedMissions,
): boolean {
  if (isDailyCompleted(completedMissions)) return false;
  const today = getDailyMission(allMissions, grade);
  return !!today && today.id === mission.id;
}

/**
 * Prune daily completion keys older than `retainDays` days from completed_missions.
 * Returns { cleaned, removed } where removed is the count of pruned keys.
 * Keeps the JSONB payload bounded (was accumulating ~365 keys/year).
 */
export function pruneOldDailyKeys(
  completedMissions: CompletedMissions,
  retainDays = 7,
): { cleaned: CompletedMissions; removed: number } {
  const cutoff = Date.now() - retainDays * 86400000;
  const cm = completedMissions as Record<string, unknown>;
  const cleaned: Record<string, unknown> = {};
  let removed = 0;
  for (const [k, v] of Object.entries(cm)) {
    if (k.startsWith('daily_') && /^daily_\d{8}$/.test(k)) {
      const y = parseInt(k.slice(6, 10));
      const m = parseInt(k.slice(10, 12)) - 1;
      const d = parseInt(k.slice(12, 14));
      const keyDate = new Date(y, m, d).getTime();
      if (keyDate < cutoff) { removed++; continue; }
    }
    cleaned[k] = v;
  }
  return { cleaned: cleaned as CompletedMissions, removed };
}

/** Get the daily challenge key for marking completion */
export function getDailyKey(): string {
  return `daily_${getTodayKey()}`;
}

/** Get seconds remaining until midnight (local time) */
export function getSecondsUntilMidnight(): number {
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
