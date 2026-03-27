import { useEffect, useState } from 'react';
import type { Mission } from '../types';

/**
 * Use local mission data directly.
 *
 * Previously loaded from Supabase gl_missions table, but the DB data is stale
 * (missing generatorType, parameterized stories, skillName, etc.).
 * All mission data is now maintained in src/data/missions.ts.
 * DB sync can be re-enabled in Phase 3 when gl_missions is updated.
 */
export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadMissions = async () => {
      try {
        const { MISSIONS } = await import('../data/missions');
        if (!cancelled) {
          setMissions(MISSIONS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMissions();

    return () => {
      cancelled = true;
    };
  }, []);

  return { missions, loading };
}
