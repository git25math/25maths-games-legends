/**
 * KP → Mission lookup: find all missions that teach a specific Knowledge Point.
 * Used by teacher dashboard to create targeted assignments from weak KPs.
 */
import type { Mission } from '../types';
import { MISSIONS } from '../data/missions';

/** Cache: kpId → mission IDs (built once on first call) */
let kpMissionCache: Map<string, number[]> | null = null;

function ensureCache(): Map<string, number[]> {
  if (kpMissionCache) return kpMissionCache;
  kpMissionCache = new Map();
  for (const m of MISSIONS) {
    if (!m.kpId) continue;
    const existing = kpMissionCache.get(m.kpId) ?? [];
    existing.push(m.id);
    kpMissionCache.set(m.kpId, existing);
  }
  return kpMissionCache;
}

/** Get all mission IDs that teach a specific KP */
export function getMissionIdsForKP(kpId: string): number[] {
  return ensureCache().get(kpId) ?? [];
}

/** Get all missions (full objects) that teach a specific KP */
export function getMissionsForKP(kpId: string): Mission[] {
  const ids = new Set(getMissionIdsForKP(kpId));
  return MISSIONS.filter(m => ids.has(m.id));
}

/** Get mission IDs for a topic (e.g., "2.5" matches "kp-2.5-01", "kp-2.5-02", etc.) */
export function getMissionIdsForTopic(topicId: string): number[] {
  const prefix = `kp-${topicId}`;
  const result: number[] = [];
  for (const [kpId, missionIds] of ensureCache()) {
    if (kpId.startsWith(prefix)) result.push(...missionIds);
  }
  return result;
}
