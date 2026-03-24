import { useState, useCallback, useEffect } from 'react';

/**
 * localStorage-backed useState: reads initial value from storage,
 * writes back on every setState call. Falls back to defaultValue
 * if key is absent or unparseable.
 */
export function usePersisted<T>(key: string, defaultValue: T, validate?: (v: unknown) => boolean): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValueRaw] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (validate && !validate(parsed)) return defaultValue;
        return parsed as T;
      }
    } catch { /* ignore */ }
    return defaultValue;
  });

  const setValue = useCallback((val: T | ((prev: T) => T)) => {
    setValueRaw(prev => {
      const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [key]);

  return [value, setValue];
}

/** Prefix for all practice persistence keys */
const PREFIX = 'gl_practice_';

/** Get the storage key for a given mission + field */
function pk(missionId: number, field: string): string {
  return `${PREFIX}${missionId}_${field}`;
}

/** Clear practice state for a specific mission */
export function clearPracticeState(missionId: number): void {
  const fields = ['phase', 'step', 'tier', 'cc', 'cw', 'ts'];
  fields.forEach(f => {
    try { localStorage.removeItem(pk(missionId, f)); } catch { /* ignore */ }
  });
}

/**
 * Clean up stale practice keys older than maxAge (default 7 days).
 * Call once on app startup.
 */
export function cleanStalePracticeKeys(maxAgeDays = 7): void {
  const now = Date.now();
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(PREFIX)) continue;
      // Check if this mission has a timestamp key
      if (key.endsWith('_ts')) {
        const ts = Number(localStorage.getItem(key));
        if (ts && now - ts > maxAgeMs) {
          // Extract missionId from key: gl_practice_123_ts → 123
          const match = key.match(/gl_practice_(\d+)_ts/);
          if (match) {
            const mid = match[1];
            ['phase', 'step', 'tier', 'cc', 'cw', 'ts'].forEach(f => {
              keysToRemove.push(`${PREFIX}${mid}_${f}`);
            });
          }
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

/**
 * Hook that provides persisted practice state for a mission.
 * Returns the same interface as individual useStates but backed by localStorage.
 */
export function usePracticePersistedState(missionId: number) {
  const [phase, setPhase] = usePersisted<'green' | 'amber' | 'red'>(
    pk(missionId, 'phase'), 'green',
    v => v === 'green' || v === 'amber' || v === 'red'
  );
  const [tutorialStep, setTutorialStep] = usePersisted<number>(pk(missionId, 'step'), 0);
  const [adaptiveTier, setAdaptiveTier] = usePersisted<1 | 2 | 3>(
    pk(missionId, 'tier'), 1,
    v => v === 1 || v === 2 || v === 3
  );
  const [consecutiveCorrect, setConsecutiveCorrect] = usePersisted<number>(pk(missionId, 'cc'), 0);
  const [consecutiveWrong, setConsecutiveWrong] = usePersisted<number>(pk(missionId, 'cw'), 0);

  // Update timestamp on mount
  useEffect(() => {
    try { localStorage.setItem(pk(missionId, 'ts'), String(Date.now())); } catch { /* ignore */ }
  }, [missionId]);

  return {
    phase, setPhase,
    tutorialStep, setTutorialStep,
    adaptiveTier, setAdaptiveTier,
    consecutiveCorrect, setConsecutiveCorrect,
    consecutiveWrong, setConsecutiveWrong,
  };
}
