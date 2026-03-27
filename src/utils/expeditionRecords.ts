const LS_KEY = 'expedition_records_v1';

export type ExpeditionRecord = {
  bestNodes: number;
  bestXP: number;
  lastNodes: number;
  lastXP: number;
  attempts: number;
  totalXP: number;
  lastPlayed: string;
};

export function getExpeditionRecord(id: string): ExpeditionRecord | null {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return all[id] ?? null;
  } catch {
    return null;
  }
}

export function saveExpeditionRecord(
  id: string,
  nodesCleared: number,
  xpEarned: number,
): ExpeditionRecord {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    const prev: ExpeditionRecord = all[id] ?? {
      bestNodes: 0, bestXP: 0, lastNodes: 0, lastXP: 0,
      attempts: 0, totalXP: 0, lastPlayed: '',
    };
    const updated: ExpeditionRecord = {
      bestNodes: Math.max(prev.bestNodes, nodesCleared),
      bestXP: Math.max(prev.bestXP, xpEarned),
      lastNodes: nodesCleared,
      lastXP: xpEarned,
      attempts: prev.attempts + 1,
      totalXP: prev.totalXP + xpEarned,
      lastPlayed: new Date().toISOString().split('T')[0],
    };
    all[id] = updated;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    return updated;
  } catch {
    return {
      bestNodes: nodesCleared, bestXP: xpEarned,
      lastNodes: nodesCleared, lastXP: xpEarned,
      attempts: 1, totalXP: xpEarned,
      lastPlayed: new Date().toISOString().split('T')[0],
    };
  }
}

/** Star rating based on completion ratio */
export function getRating(nodes: number, total: number): string {
  if (total === 0) return '';
  if (nodes >= total) return '★★★';
  if (nodes >= Math.ceil(total * 0.6)) return '★★☆';
  if (nodes > 0) return '★☆☆';
  return '☆☆☆';
}
