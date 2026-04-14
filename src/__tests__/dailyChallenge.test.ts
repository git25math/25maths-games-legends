import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DAILY_MULTIPLIER,
  formatCountdown,
  getDailyKey,
  getDailyMission,
  getSecondsUntilMidnight,
  getTodayKey,
  isDailyCompleted,
  isValidDailySubmission,
} from '../utils/dailyChallenge';
import type { CompletedMissions, Mission } from '../types';

function makeMission(id: number, grade: number, hasGenerator = true): Mission {
  return {
    id,
    grade,
    // Minimal valid Mission fields — we only care about id/grade/data.generatorType for these tests.
    title: { zh: `关 ${id}`, en: `Mission ${id}` },
    topic: { zh: '测试', en: 'Test' },
    type: 'input',
    questionType: 'LINEAR',
    data: hasGenerator ? { generatorType: 'LINEAR_RANDOM' } : {},
  } as unknown as Mission;
}

describe('getTodayKey', () => {
  afterEach(() => vi.useRealTimers());

  it('returns 8-char YYYYMMDD in local time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 14, 12, 0, 0)); // 2026-04-14 local
    expect(getTodayKey()).toBe('20260414');
  });

  it('pads month and day with leading zeros', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 3, 9, 0, 0)); // 2026-01-03
    expect(getTodayKey()).toBe('20260103');
  });

  it('changes across midnight boundary', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 14, 23, 59, 59));
    const before = getTodayKey();
    vi.setSystemTime(new Date(2026, 3, 15, 0, 0, 1));
    const after = getTodayKey();
    expect(before).toBe('20260414');
    expect(after).toBe('20260415');
  });
});

describe('getDailyMission', () => {
  it('returns null when no mission matches grade', () => {
    const missions = [makeMission(1, 7), makeMission(2, 8)];
    expect(getDailyMission(missions, 9)).toBeNull();
  });

  it('returns null when grade matches but no generator', () => {
    const missions = [makeMission(1, 7, false), makeMission(2, 7, false)];
    expect(getDailyMission(missions, 7)).toBeNull();
  });

  it('filters by grade and selects from pool with generator', () => {
    const missions = [
      makeMission(1, 7, true),
      makeMission(2, 7, true),
      makeMission(3, 8, true),
    ];
    const today = getDailyMission(missions, 7);
    expect(today).not.toBeNull();
    expect([1, 2]).toContain(today!.id);
  });

  it('is deterministic: same day + pool → same mission', () => {
    const missions = Array.from({ length: 20 }, (_, i) => makeMission(i + 1, 7));
    const a = getDailyMission(missions, 7);
    const b = getDailyMission(missions, 7);
    expect(a!.id).toBe(b!.id);
  });
});

describe('isValidDailySubmission', () => {
  const missions = [makeMission(1, 7), makeMission(2, 7), makeMission(3, 7)];
  const today = getDailyMission(missions, 7)!;
  const other = missions.find(m => m.id !== today.id)!;

  it('returns true for today\'s mission when not yet completed', () => {
    expect(isValidDailySubmission(today, missions, 7, {})).toBe(true);
  });

  it('returns false when already completed today (anti-double-count)', () => {
    const completed: CompletedMissions = { [getDailyKey()]: true } as CompletedMissions;
    expect(isValidDailySubmission(today, missions, 7, completed)).toBe(false);
  });

  it('returns false when submitted mission is not today\'s daily (anti-tamper)', () => {
    expect(isValidDailySubmission(other, missions, 7, {})).toBe(false);
  });

  it('returns false when no daily available for grade (null guard)', () => {
    expect(isValidDailySubmission(today, [], 7, {})).toBe(false);
  });
});

describe('isDailyCompleted', () => {
  it('matches the current day key', () => {
    const k = getDailyKey();
    const completed = { [k]: true } as CompletedMissions;
    expect(isDailyCompleted(completed)).toBe(true);
  });

  it('returns false when only a different day is marked (cross-midnight safety)', () => {
    const completed = { daily_20200101: true } as unknown as CompletedMissions;
    expect(isDailyCompleted(completed)).toBe(false);
  });
});

describe('countdown helpers', () => {
  afterEach(() => vi.useRealTimers());

  it('getSecondsUntilMidnight is in [0, 86400)', () => {
    const s = getSecondsUntilMidnight();
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThan(86400);
  });

  it('getSecondsUntilMidnight at 23:59:30 is ~30s', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 14, 23, 59, 30));
    const s = getSecondsUntilMidnight();
    expect(s).toBeGreaterThanOrEqual(29);
    expect(s).toBeLessThanOrEqual(30);
  });

  it('formatCountdown pads HH:MM:SS', () => {
    expect(formatCountdown(0)).toBe('00:00:00');
    expect(formatCountdown(65)).toBe('00:01:05');
    expect(formatCountdown(3661)).toBe('01:01:01');
    expect(formatCountdown(86399)).toBe('23:59:59');
  });
});

describe('constants', () => {
  it('DAILY_MULTIPLIER is 3x', () => {
    expect(DAILY_MULTIPLIER).toBe(3);
  });
});
