import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  getTodayKey,
  getDailyKey,
  getDailyMission,
  isDailyCompleted,
  isValidDailySubmission,
  pruneOldDailyKeys,
  DAILY_MULTIPLIER,
} from '../utils/dailyChallenge';
import type { Mission, CompletedMissions } from '../types';

function makeMission(id: number, grade: number, hasGenerator = true): Mission {
  return {
    id,
    grade,
    unitId: 1,
    order: 1,
    unitTitle: { zh: '', en: '' },
    topic: 'Algebra',
    type: 'PRIME' as any,
    title: { zh: '', en: '' },
    story: { zh: '', en: '' },
    description: { zh: '', en: '' },
    data: hasGenerator ? { generatorType: 'PRIME_RANDOM' } : {},
    difficulty: 'Easy',
    reward: 10,
    secret: { concept: { zh: '', en: '' }, formula: '', tips: [] },
  } as Mission;
}

describe('dailyChallenge — getTodayKey', () => {
  it('returns YYYYMMDD format matching local date', () => {
    const key = getTodayKey();
    expect(key).toMatch(/^\d{8}$/);
    const d = new Date();
    const expected = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    expect(key).toBe(expected);
  });

  it('getDailyKey prefixes today with daily_', () => {
    expect(getDailyKey()).toBe(`daily_${getTodayKey()}`);
  });
});

describe('dailyChallenge — getDailyMission determinism', () => {
  const pool = Array.from({ length: 20 }, (_, i) => makeMission(i + 1, 7));
  const noGenPool = [makeMission(99, 7, false)];

  it('returns same mission on same day for same grade', () => {
    const m1 = getDailyMission(pool, 7);
    const m2 = getDailyMission(pool, 7);
    expect(m1?.id).toBe(m2?.id);
  });

  it('filters out missions without generatorType', () => {
    const m = getDailyMission([...pool, ...noGenPool], 7);
    expect(m?.id).not.toBe(99);
  });

  it('filters by grade', () => {
    const mixedGrade = [...pool, ...Array.from({ length: 5 }, (_, i) => makeMission(100 + i, 8))];
    const m = getDailyMission(mixedGrade, 7);
    expect(m?.grade).toBe(7);
  });

  it('returns null when pool is empty for grade', () => {
    expect(getDailyMission(pool, 12)).toBeNull();
  });
});

describe('dailyChallenge — isDailyCompleted', () => {
  it('returns false when no daily key set', () => {
    expect(isDailyCompleted({})).toBe(false);
  });

  it('returns true when today key is set', () => {
    const cm = { [getDailyKey()]: true } as any;
    expect(isDailyCompleted(cm)).toBe(true);
  });

  it('ignores other date keys', () => {
    const cm = { daily_20200101: true } as any;
    expect(isDailyCompleted(cm)).toBe(false);
  });
});

describe('dailyChallenge — isValidDailySubmission', () => {
  const pool = Array.from({ length: 20 }, (_, i) => makeMission(i + 1, 7));
  const today = getDailyMission(pool, 7)!;
  const other = pool.find(m => m.id !== today.id)!;

  it('returns true for correct daily mission when not yet completed', () => {
    expect(isValidDailySubmission(today, pool, 7, {} as CompletedMissions)).toBe(true);
  });

  it('returns false for wrong mission id (cheat/stale)', () => {
    expect(isValidDailySubmission(other, pool, 7, {} as CompletedMissions)).toBe(false);
  });

  it('returns false when daily already completed (re-entry)', () => {
    const cm = { [getDailyKey()]: true } as any;
    expect(isValidDailySubmission(today, pool, 7, cm)).toBe(false);
  });

  it('returns false when grade has no daily (no pool)', () => {
    expect(isValidDailySubmission(today, pool, 12, {} as CompletedMissions)).toBe(false);
  });
});

describe('dailyChallenge — pruneOldDailyKeys', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fix "now" to 2026-04-14 for deterministic cutoff math
    vi.setSystemTime(new Date(2026, 3, 14, 12, 0, 0));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('removes daily keys older than retainDays', () => {
    const cm = {
      daily_20260101: true,   // >90 days old
      daily_20260401: true,   // 13 days old
      daily_20260410: true,   // 4 days old (keep)
      daily_20260414: true,   // today (keep)
      // unrelated keys preserved:
      _stamina: { date: '20260414', used: 1, bonus: 0 },
      '123': { green: true },
    };
    const { cleaned, removed } = pruneOldDailyKeys(cm as any, 7);
    expect(removed).toBe(2);
    expect((cleaned as any).daily_20260101).toBeUndefined();
    expect((cleaned as any).daily_20260401).toBeUndefined();
    expect((cleaned as any).daily_20260410).toBe(true);
    expect((cleaned as any).daily_20260414).toBe(true);
    // unrelated keys untouched
    expect((cleaned as any)._stamina).toEqual({ date: '20260414', used: 1, bonus: 0 });
    expect((cleaned as any)['123']).toEqual({ green: true });
  });

  it('ignores malformed daily keys (no 8-digit date)', () => {
    const cm = {
      daily_foo: true,
      daily_202601: true,
      daily_20260410abc: true,
    };
    const { cleaned, removed } = pruneOldDailyKeys(cm as any, 7);
    expect(removed).toBe(0);
    expect(Object.keys(cleaned).length).toBe(3);
  });

  it('no-op when everything is fresh', () => {
    const cm = { daily_20260414: true, daily_20260413: true };
    const { removed } = pruneOldDailyKeys(cm as any, 7);
    expect(removed).toBe(0);
  });
});

describe('dailyChallenge — constants', () => {
  it('DAILY_MULTIPLIER is 3', () => {
    expect(DAILY_MULTIPLIER).toBe(3);
  });
});
