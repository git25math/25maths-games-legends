import type { BilingualText, CompletedMissions, Mission, MissionSummary } from '../types';

export function toMissionSummary(mission: Mission): MissionSummary {
  return {
    id: mission.id,
    grade: mission.grade,
    unitId: mission.unitId,
    order: mission.order,
    unitTitle: mission.unitTitle,
    title: mission.title,
    topic: mission.topic,
    kpId: mission.kpId,
  };
}

export function toMissionSummaries(missions: Mission[]): MissionSummary[] {
  return missions.map(toMissionSummary);
}

export function buildMissionSummaryMap(missions: MissionSummary[]): Map<number, MissionSummary> {
  const map = new Map<number, MissionSummary>();
  for (const mission of missions) {
    map.set(mission.id, mission);
  }
  return map;
}

export function findMissingMissionSummaryIds(missionIds: number[], missionMap: Map<number, MissionSummary>): number[] {
  const missing = new Set<number>();
  for (const missionId of missionIds) {
    if (!missionMap.has(missionId)) {
      missing.add(missionId);
    }
  }
  return [...missing];
}

export type AssignmentMissionItem = {
  id: number;
  title: BilingualText;
  isDone: boolean;
  missingSummary: boolean;
};

export function resolveAssignmentMissionItems(
  missionIds: number[],
  missionMap: Map<number, MissionSummary>,
  completedMissions: CompletedMissions,
): AssignmentMissionItem[] {
  return missionIds.map((missionId) => {
    const mission = missionMap.get(missionId);
    return {
      id: missionId,
      title: mission?.title ?? { zh: `关卡 #${missionId}`, en: `Mission #${missionId}` },
      isDone: !!(completedMissions[String(missionId)] as any)?.green,
      missingSummary: !mission,
    };
  }).sort((a, b) => Number(a.isDone) - Number(b.isDone));
}
