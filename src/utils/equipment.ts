import type { EquipmentState, KPEquipment } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Thresholds in days */
const THRESHOLDS = { worn: 7, damaged: 14, broken: 30 };

/** Compute equipment state from time since last mastery */
export function getEquipmentState(lastMasteredAt: number): EquipmentState {
  const daysSince = (Date.now() - lastMasteredAt) / DAY_MS;
  if (daysSince >= THRESHOLDS.broken) return 'broken';
  if (daysSince >= THRESHOLDS.damaged) return 'damaged';
  if (daysSince >= THRESHOLDS.worn) return 'worn';
  return 'pristine';
}

/** Tailwind color classes for each state */
export const EQUIPMENT_COLORS: Record<EquipmentState, { bg: string; text: string; border: string }> = {
  pristine: { bg: 'bg-amber-400/20', text: 'text-amber-400', border: 'border-amber-400/40' },
  worn:     { bg: 'bg-yellow-400/20', text: 'text-yellow-400', border: 'border-yellow-400/40' },
  damaged:  { bg: 'bg-rose-400/20', text: 'text-rose-400', border: 'border-rose-400/40' },
  broken:   { bg: 'bg-slate-400/20', text: 'text-slate-400', border: 'border-slate-400/40' },
};

/** Sort priority (broken first, pristine last) */
const STATE_PRIORITY: Record<EquipmentState, number> = {
  broken: 0, damaged: 1, worn: 2, pristine: 3,
};

/** Get all equipment from completed_missions JSONB, sorted by urgency */
export function getEquipmentList(completedMissions: Record<string, unknown>): (KPEquipment & { state: EquipmentState })[] {
  const raw = (completedMissions as any)._equipment as Record<string, KPEquipment> | undefined;
  if (!raw) return [];
  return Object.entries(raw)
    .map(([mid, eq]) => ({
      ...eq,
      missionId: Number(mid),
      state: getEquipmentState(eq.lastMasteredAt),
    }))
    .sort((a, b) => STATE_PRIORITY[a.state] - STATE_PRIORITY[b.state]);
}

/** Count non-pristine equipment (for notification badge) */
export function countNeedsRepair(completedMissions: Record<string, unknown>): number {
  return getEquipmentList(completedMissions).filter(e => e.state === 'damaged' || e.state === 'broken').length;
}

/** Compute repair bonus XP (100 base + 50 per previous repair, cap 350) */
export function computeRepairBonus(repairCount: number): number {
  return Math.min(100 + 50 * repairCount, 350);
}
