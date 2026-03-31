import { useEffect, useMemo, useState } from 'react';

import { loadAllMissionSummaries } from '../data/missionSummaries/loader';
import type { MissionSummary } from '../types';
import { buildMissionSummaryMap, findMissingMissionSummaryIds } from '../utils/missionSummary';

export function useAssignmentMissionMap(missionIds: number[], missions: MissionSummary[]) {
  const [extraMissions, setExtraMissions] = useState<MissionSummary[]>([]);
  const baseMap = useMemo(() => buildMissionSummaryMap(missions), [missions]);

  const mergedMap = useMemo(() => {
    const map = new Map(baseMap);
    for (const mission of extraMissions) {
      map.set(mission.id, mission);
    }
    return map;
  }, [baseMap, extraMissions]);

  const missingMissionIds = useMemo(
    () => findMissingMissionSummaryIds(missionIds, mergedMap),
    [missionIds, mergedMap],
  );
  const missingMissionIdsKey = missingMissionIds.join(',');

  useEffect(() => {
    if (missingMissionIds.length === 0) return;

    let cancelled = false;
    loadAllMissionSummaries().then((allMissions) => {
      if (cancelled) return;
      const missingSet = new Set(missingMissionIds);
      setExtraMissions(allMissions.filter(mission => missingSet.has(mission.id)));
    }).catch(() => {
      if (cancelled) return;
      setExtraMissions([]);
    });

    return () => {
      cancelled = true;
    };
  }, [missingMissionIdsKey]);

  return mergedMap;
}
