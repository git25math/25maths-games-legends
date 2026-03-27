// Repair item earning conditions and equipment repair logic
// Items are awarded based on battle/practice performance

import type { EquipmentState } from '../types';
import type { ErrorType } from './diagnoseError';
import type { MistakeRecord } from './errorMemory';
import { getDominantPattern } from './errorMemory';
import type { InventoryMap, RepairItemDef } from './inventory';
import { addItem, getItemDef, getEffectiveRepairPower } from './inventory';

/** Determine which items to award after a battle */
export function computeBattleRewards(
  success: boolean,
  score: number,
  difficultyMode: string,
  errorCount: number,
): { itemId: string; reason: string }[] {
  const rewards: { itemId: string; reason: string }[] = [];

  // Hammer: complete any battle with score ≥ 80%
  if (success && score >= 80) {
    rewards.push({ itemId: 'hammer', reason: 'battle_score_80' });
  }

  // Crystal: complete Red difficulty with 0 errors (perfect run)
  if (success && difficultyMode === 'red' && errorCount === 0) {
    rewards.push({ itemId: 'crystal', reason: 'red_perfect' });
  }

  return rewards;
}

/** Determine which scroll to award after a Recovery Pack (based on error pattern fixed) */
export function computeRecoveryReward(
  errorPattern: ErrorType,
  accuracy: number,
): { itemId: string; reason: string } | null {
  if (accuracy < 0.8) return null;

  // Map error pattern to corresponding scroll
  const scrollMap: Record<ErrorType, string> = {
    sign: 'scroll_sign',
    rounding: 'scroll_rounding',
    magnitude: 'scroll_magnitude',
    method: 'scroll_method',
    unknown: 'hammer', // generic pattern gets a hammer instead
  };

  return {
    itemId: scrollMap[errorPattern] ?? 'hammer',
    reason: `recovery_${errorPattern}`,
  };
}

/** Apply repair item to equipment, returns new health score (0-100) */
export function applyRepair(
  currentHealth: number,
  itemId: string,
  dominantError?: ErrorType | null,
): { newHealth: number; restored: number } | null {
  const def = getItemDef(itemId);
  if (!def) return null;

  const power = getEffectiveRepairPower(def, dominantError);
  const newHealth = Math.min(100, currentHealth + power);
  return { newHealth, restored: newHealth - currentHealth };
}

/** Convert health score (0-100) to equipment state */
export function healthToEquipmentState(health: number): EquipmentState {
  if (health >= 90) return 'pristine';
  if (health >= 60) return 'worn';
  if (health >= 30) return 'damaged';
  return 'broken';
}

/** Convert equipment state to approximate health score */
export function equipmentStateToHealth(state: EquipmentState): number {
  switch (state) {
    case 'pristine': return 100;
    case 'worn': return 70;
    case 'damaged': return 40;
    case 'broken': return 10;
  }
}

/** Award items and return updated inventory */
export function awardBattleItems(
  inventory: InventoryMap,
  success: boolean,
  score: number,
  difficultyMode: string,
  errorCount: number,
): { inventory: InventoryMap; awarded: { itemId: string; reason: string }[] } {
  const rewards = computeBattleRewards(success, score, difficultyMode, errorCount);
  let inv = inventory;
  for (const r of rewards) {
    inv = addItem(inv, r.itemId);
  }
  return { inventory: inv, awarded: rewards };
}
