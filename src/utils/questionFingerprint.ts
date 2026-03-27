import type { Mission } from '../types';

function normalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = normalizeValue((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export function createQuestionFingerprint(mission: Mission): string {
  return JSON.stringify({
    id: mission.id,
    type: mission.type,
    topic: mission.topic,
    description: mission.description.zh,
    data: normalizeValue(mission.data ?? {}),
  });
}
