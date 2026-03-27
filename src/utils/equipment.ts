import type { EquipmentState, KPEquipment } from '../types';
import type { MistakeRecord } from './errorMemory';

import { EQUIPMENT_DECAY } from './gameBalance';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Thresholds in days (effective days, including error penalty) */
const THRESHOLDS = {
  worn: EQUIPMENT_DECAY.WORN_DAYS,
  damaged: EQUIPMENT_DECAY.DAMAGED_DAYS,
  broken: EQUIPMENT_DECAY.BROKEN_DAYS,
};

/** Error penalty: each recorded error adds this many "effective days" of decay */
const ERROR_PENALTY_DAYS = EQUIPMENT_DECAY.ERROR_PENALTY_DAYS;

/** Compute equipment state from time since last mastery */
export function getEquipmentState(lastMasteredAt: number): EquipmentState {
  const daysSince = (Date.now() - lastMasteredAt) / DAY_MS;
  if (daysSince >= THRESHOLDS.broken) return 'broken';
  if (daysSince >= THRESHOLDS.damaged) return 'damaged';
  if (daysSince >= THRESHOLDS.worn) return 'worn';
  return 'pristine';
}

/**
 * Enhanced equipment state: factors in error patterns to accelerate decay.
 * Each recorded error adds ERROR_PENALTY_DAYS to the effective age.
 * e.g., equipment mastered 5 days ago with 4 errors → effective age = 5 + 4*1.5 = 11 days → "damaged"
 */
export function getEnhancedEquipmentState(
  lastMasteredAt: number,
  mistakeRecord?: MistakeRecord | null,
): EquipmentState {
  const timeDays = (Date.now() - lastMasteredAt) / DAY_MS;
  const errorPenalty = mistakeRecord ? mistakeRecord.count * ERROR_PENALTY_DAYS : 0;
  const effectiveDays = timeDays + errorPenalty;
  if (effectiveDays >= THRESHOLDS.broken) return 'broken';
  if (effectiveDays >= THRESHOLDS.damaged) return 'damaged';
  if (effectiveDays >= THRESHOLDS.worn) return 'worn';
  return 'pristine';
}

/** Compute approximate health score (0-100) for an equipment piece */
export function getEquipmentHealth(
  lastMasteredAt: number,
  mistakeRecord?: MistakeRecord | null,
): number {
  const timeDays = (Date.now() - lastMasteredAt) / DAY_MS;
  const errorPenalty = mistakeRecord ? mistakeRecord.count * ERROR_PENALTY_DAYS : 0;
  const effectiveDays = timeDays + errorPenalty;
  // Linear decay from 100 to 0 over THRESHOLDS.broken days
  return Math.max(0, Math.round(100 * (1 - effectiveDays / THRESHOLDS.broken)));
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

/** Get all equipment from completed_missions JSONB, sorted by urgency.
 *  If mistakes map provided, factors error count into both state calculation and sort. */
export function getEquipmentList(
  completedMissions: Record<string, unknown>,
  mistakes?: Record<string, { count: number }>,
): (KPEquipment & { state: EquipmentState; health: number })[] {
  const raw = (completedMissions as any)._equipment as Record<string, KPEquipment> | undefined;
  if (!raw) return [];
  return Object.entries(raw)
    .map(([mid, eq]) => {
      const mistakeRec = mistakes?.[mid] as MistakeRecord | undefined;
      return {
        ...eq,
        missionId: Number(mid),
        state: getEnhancedEquipmentState(eq.lastMasteredAt, mistakeRec),
        health: getEquipmentHealth(eq.lastMasteredAt, mistakeRec),
      };
    })
    .sort((a, b) => {
      const pA = STATE_PRIORITY[a.state];
      const pB = STATE_PRIORITY[b.state];
      if (pA !== pB) return pA - pB;
      // Same state: sort by health (lower health = higher priority)
      return a.health - b.health;
    });
}

/** Count non-pristine equipment (for notification badge) */
export function countNeedsRepair(completedMissions: Record<string, unknown>): number {
  return getEquipmentList(completedMissions).filter(e => e.state === 'damaged' || e.state === 'broken').length;
}

/** Compute repair bonus XP (100 base + 50 per previous repair, cap 350) */
export function computeRepairBonus(repairCount: number): number {
  return Math.min(100 + 50 * repairCount, 350);
}
