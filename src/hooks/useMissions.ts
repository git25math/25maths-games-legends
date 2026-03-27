import { useEffect, useState } from 'react';
import type { Mission } from '../types';

/** Dynamically import only the grade's chunk. Returns the grade array. */
async function loadGradeMissions(grade: number): Promise<Mission[]> {
  switch (grade) {
    case 7:  { const m = await import('../data/missions/y7');  return m.MISSIONS_Y7; }
    case 8:  { const m = await import('../data/missions/y8');  return m.MISSIONS_Y8; }
    case 9:  { const m = await import('../data/missions/y9');  return m.MISSIONS_Y9; }
    case 10: { const m = await import('../data/missions/y10'); return m.MISSIONS_Y10; }
    case 11: { const m = await import('../data/missions/y11'); return m.MISSIONS_Y11; }
    case 12: { const m = await import('../data/missions/y12'); return m.MISSIONS_Y12; }
    default: { const m = await import('../data/missions');     return m.MISSIONS; }
  }
}

/**
 * Load missions for a specific grade lazily (per-grade chunk).
 * When grade is null/undefined, returns empty array and loading=true until grade is known.
 */
export function useMissions(grade?: number | null) {
  // loading=true only when a grade is known but data hasn't arrived yet
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(!!grade);

  useEffect(() => {
    if (!grade) {
      // Grade not selected yet — nothing to load, not in a loading state
      setMissions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const data = await loadGradeMissions(grade);
        if (!cancelled) setMissions(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [grade]);

  return { missions, loading };
}
