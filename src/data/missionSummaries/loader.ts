import type { MissionSummary } from '../../types';

type MissionSummaryLoader = () => Promise<MissionSummary[]>;

const DEFAULT_GRADE_LOADERS = new Map<number, MissionSummaryLoader>([
  [7, async () => (await import('./y7')).MISSION_SUMMARIES_Y7],
  [8, async () => (await import('./y8')).MISSION_SUMMARIES_Y8],
  [9, async () => (await import('./y9')).MISSION_SUMMARIES_Y9],
  [10, async () => (await import('./y10')).MISSION_SUMMARIES_Y10],
  [11, async () => (await import('./y11')).MISSION_SUMMARIES_Y11],
  [12, async () => (await import('./y12')).MISSION_SUMMARIES_Y12],
]);

const gradeLoaders = new Map(DEFAULT_GRADE_LOADERS);
const gradeCache = new Map<number, Promise<MissionSummary[]>>();
let allMissionSummariesPromise: Promise<MissionSummary[]> | null = null;

function getGradeLoader(grade: number): MissionSummaryLoader {
  return gradeLoaders.get(grade) ?? (async () => (await import('./index')).MISSION_SUMMARIES);
}

export function loadGradeMissionSummaries(grade: number): Promise<MissionSummary[]> {
  if (!gradeCache.has(grade)) {
    const promise = getGradeLoader(grade)().catch((error) => {
      gradeCache.delete(grade);
      throw error;
    });
    gradeCache.set(grade, promise);
  }
  return gradeCache.get(grade)!;
}

export function loadAllMissionSummaries(): Promise<MissionSummary[]> {
  if (!allMissionSummariesPromise) {
    allMissionSummariesPromise = Promise.all([
      loadGradeMissionSummaries(7),
      loadGradeMissionSummaries(8),
      loadGradeMissionSummaries(9),
      loadGradeMissionSummaries(10),
      loadGradeMissionSummaries(11),
      loadGradeMissionSummaries(12),
    ]).then(([y7, y8, y9, y10, y11, y12]) => [
      ...y7,
      ...y8,
      ...y9,
      ...y10,
      ...y11,
      ...y12,
    ]).catch((error) => {
      allMissionSummariesPromise = null;
      throw error;
    });
  }
  return allMissionSummariesPromise;
}

export function __resetMissionSummaryLoaderForTests() {
  gradeCache.clear();
  allMissionSummariesPromise = null;
  gradeLoaders.clear();
  for (const [grade, loader] of DEFAULT_GRADE_LOADERS.entries()) {
    gradeLoaders.set(grade, loader);
  }
}

export function __setMissionSummaryLoaderForTests(grade: number, loader: MissionSummaryLoader) {
  gradeLoaders.set(grade, loader);
  gradeCache.delete(grade);
  allMissionSummariesPromise = null;
}
