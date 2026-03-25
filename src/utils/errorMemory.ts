import type { ErrorType } from './diagnoseError';

export type MistakeRecord = {
  count: number;
  lastWrong: string;  // YYYY-MM-DD
  patterns: Record<ErrorType, number>;  // error type → count
};

type MistakesMap = Record<string, MistakeRecord>;

/** Read mistakes map from completed_missions */
export function getMistakes(completedMissions: Record<string, unknown>): MistakesMap {
  return ((completedMissions as any)?._mistakes ?? {}) as MistakesMap;
}

/** Record one or more errors into the mistakes map (pure function, returns new map) */
export function recordErrors(
  mistakes: MistakesMap,
  missionId: number,
  errors: ErrorType[],
): MistakesMap {
  if (errors.length === 0) return mistakes;
  const key = String(missionId);
  const existing = mistakes[key] ?? { count: 0, lastWrong: '', patterns: {} as Record<ErrorType, number> };
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const newPatterns = { ...existing.patterns };
  for (const err of errors) {
    newPatterns[err] = (newPatterns[err] ?? 0) + 1;
  }

  return {
    ...mistakes,
    [key]: {
      count: existing.count + errors.length,
      lastWrong: today,
      patterns: newPatterns,
    },
  };
}

/** Get the dominant error pattern for a mission (most frequent) */
export function getDominantPattern(record: MistakeRecord): ErrorType | null {
  let max = 0;
  let dominant: ErrorType | null = null;
  for (const [type, count] of Object.entries(record.patterns)) {
    if (count > max) { max = count; dominant = type as ErrorType; }
  }
  return dominant;
}

/** Get missions with high error rates (count >= threshold) */
export function getWeakMissions(mistakes: MistakesMap, threshold = 3): Set<number> {
  const weak = new Set<number>();
  for (const [mid, rec] of Object.entries(mistakes)) {
    if (rec.count >= threshold) weak.add(Number(mid));
  }
  return weak;
}

/** Rank mission IDs by weakness score (errors * recency weight). Returns sorted IDs, weakest first. */
export function rankByWeakness(mistakes: MistakesMap): number[] {
  const now = Date.now();
  return Object.entries(mistakes)
    .map(([mid, rec]) => {
      const daysSince = rec.lastWrong
        ? Math.max(1, (now - new Date(rec.lastWrong).getTime()) / 86400000)
        : 30;
      // Score: more errors + more recent = higher priority
      const score = rec.count / Math.sqrt(daysSince);
      return { mid: Number(mid), score };
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.mid);
}

/** Get error pattern summary for a specific mission (for pre-battle tips) */
export function getMissionErrorSummary(
  mistakes: MistakesMap,
  missionId: number,
): { count: number; dominant: ErrorType | null; patterns: Record<string, number> } | null {
  const rec = mistakes[String(missionId)];
  if (!rec || rec.count === 0) return null;
  return { count: rec.count, dominant: getDominantPattern(rec), patterns: rec.patterns };
}
