// Backward-compat barrel: re-exports from grade-split files.
// useMissions.ts loads grade files directly (per-grade lazy chunks).
// DashboardScreen and other static importers use this barrel.
export { MISSIONS, MISSIONS_Y7, MISSIONS_Y8, MISSIONS_Y9, MISSIONS_Y10, MISSIONS_Y11, MISSIONS_Y12 } from './missions/index';
