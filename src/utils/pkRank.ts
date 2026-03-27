export const RANK_MULTIPLIERS = [2.0, 1.5, 1.2, 1.0];

export function getRankMultiplier(rank: number): number {
  if (rank < 0) return 1.0;
  return RANK_MULTIPLIERS[Math.min(rank, RANK_MULTIPLIERS.length - 1)];
}
