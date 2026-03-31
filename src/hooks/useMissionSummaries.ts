import { useEffect, useState, useCallback } from 'react';
import type { MissionSummary } from '../types';
import { loadGradeMissionSummaries } from '../data/missionSummaries/loader';

export function useMissionSummaries(grade?: number | null) {
  const [missions, setMissions] = useState<MissionSummary[]>([]);
  const [loading, setLoading] = useState(!!grade);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const loadData = useCallback(async (g: number, cancelled: { current: boolean }) => {
    try {
      if (!cancelled.current) setError(null);
      const data = await loadGradeMissionSummaries(g);
      if (!cancelled.current) setMissions(data);
    } catch (err) {
      if (!cancelled.current) {
        setMissions([]);
        setError(err instanceof Error ? err : new Error('Failed to load mission summaries'));
      }
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!grade) {
      setMissions([]);
      setLoading(false);
      return;
    }

    const cancelled = { current: false };
    setLoading(true);
    loadData(grade, cancelled);

    return () => {
      cancelled.current = true;
    };
  }, [grade, offline, loadData]);

  return { missions, loading, offline, error };
}
