import { useEffect, useState, useCallback } from 'react';
import type { Mission } from '../types';

/** Dynamically import only the grade's chunk. Returns the grade array. */
export async function loadGradeMissions(grade: number): Promise<Mission[]> {
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

export async function loadMissionById(missionId: number): Promise<Mission | null> {
  const id = String(missionId);
  const inferredGrade = id.startsWith('12')
    ? 12
    : id.startsWith('11')
      ? 11
      : id.startsWith('10')
        ? 10
        : id.startsWith('9')
          ? 9
          : id.startsWith('8')
            ? 8
            : 7;

  const inferredGradeMissions = await loadGradeMissions(inferredGrade);
  const inferredMatch = inferredGradeMissions.find(mission => mission.id === missionId);
  if (inferredMatch) return inferredMatch;

  const allGrades = [7, 8, 9, 10, 11, 12].filter(grade => grade !== inferredGrade);
  for (const grade of allGrades) {
    const missions = await loadGradeMissions(grade);
    const mission = missions.find(item => item.id === missionId);
    if (mission) return mission;
  }

  return null;
}

/**
 * Load missions for a specific grade lazily (per-grade chunk).
 * When grade is null/undefined, returns empty array and loading=true until grade is known.
 */
export function useMissions(grade?: number | null) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(!!grade);
  const [offline, setOffline] = useState(!navigator.onLine);

  // Track online/offline status
  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  const loadData = useCallback(async (g: number, cancelled: { current: boolean }) => {
    try {
      const data = await loadGradeMissions(g);
      if (!cancelled.current) setMissions(data);
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, []);

  // Auto-retry on reconnect
  useEffect(() => {
    if (!grade) { setMissions([]); setLoading(false); return; }

    const cancelled = { current: false };
    setLoading(true);
    loadData(grade, cancelled);

    return () => { cancelled.current = true; };
  }, [grade, offline, loadData]); // re-trigger when coming back online

  return { missions, loading, offline };
}
