// Inventory system — collectible repair items stored in completed_missions JSONB
// Items are earned from battles and Recovery Packs, used to repair corrupted/damaged equipment

import type { BilingualText } from '../types';
import type { ErrorType } from './diagnoseError';

export type RepairItemType = 'hammer' | 'scroll' | 'crystal' | 'supply';

export type RepairItemDef = {
  id: string;
  type: RepairItemType;
  name: BilingualText;
  description: BilingualText;
  icon: string;           // emoji or lucide icon name
  repairPower: number;    // health points restored (0-100 scale)
  targetPattern?: ErrorType; // bonus effectiveness vs this error type
  bonusMultiplier: number;   // multiplier when pattern matches (e.g. 1.5 = +50%)
};

/** All repair item definitions */
export const REPAIR_ITEMS: RepairItemDef[] = [
  {
    id: 'hammer',
    type: 'hammer',
    name: { zh: '修复锤', en: 'Repair Hammer' },
    description: { zh: '通用修复工具，恢复装备30点耐久', en: 'General repair tool, restores 30 durability' },
    icon: '🔨',
    repairPower: 30,
    bonusMultiplier: 1.0,
  },
  {
    id: 'scroll_sign',
    type: 'scroll',
    name: { zh: '净化卷轴·正负', en: 'Purify Scroll (Sign)' },
    description: { zh: '对正负号错误有额外50%净化效果', en: '+50% effectiveness vs sign errors' },
    icon: '📜',
    repairPower: 60,
    targetPattern: 'sign',
    bonusMultiplier: 1.5,
  },
  {
    id: 'scroll_rounding',
    type: 'scroll',
    name: { zh: '净化卷轴·精度', en: 'Purify Scroll (Rounding)' },
    description: { zh: '对四舍五入错误有额外50%净化效果', en: '+50% effectiveness vs rounding errors' },
    icon: '📜',
    repairPower: 60,
    targetPattern: 'rounding',
    bonusMultiplier: 1.5,
  },
  {
    id: 'scroll_magnitude',
    type: 'scroll',
    name: { zh: '净化卷轴·量级', en: 'Purify Scroll (Magnitude)' },
    description: { zh: '对量级错误有额外50%净化效果', en: '+50% effectiveness vs magnitude errors' },
    icon: '📜',
    repairPower: 60,
    targetPattern: 'magnitude',
    bonusMultiplier: 1.5,
  },
  {
    id: 'scroll_method',
    type: 'scroll',
    name: { zh: '净化卷轴·方法', en: 'Purify Scroll (Method)' },
    description: { zh: '对解法错误有额外50%净化效果', en: '+50% effectiveness vs method errors' },
    icon: '📜',
    repairPower: 60,
    targetPattern: 'method',
    bonusMultiplier: 1.5,
  },
  {
    id: 'crystal',
    type: 'crystal',
    name: { zh: '精通水晶', en: 'Master Crystal' },
    description: { zh: '完全修复装备至崭新状态', en: 'Fully restores equipment to pristine' },
    icon: '💎',
    repairPower: 100,
    bonusMultiplier: 1.0,
  },
  {
    id: 'ration_pack',
    type: 'supply',
    name: { zh: '军营补给包', en: 'Supply Pack' },
    description: { zh: '每日军令的积累，换一次轻度修复。修复力：20', en: 'Daily effort converted to a light repair. Repair power: 20' },
    icon: '📦',
    repairPower: 20,
    bonusMultiplier: 1.0,
  },
];

export type InventoryMap = Record<string, number>;

/** Get inventory from completed_missions JSONB */
export function getInventory(completedMissions: Record<string, unknown>): InventoryMap {
  return ((completedMissions as any)?._inventory ?? {}) as InventoryMap;
}

/** Get total items in inventory */
export function getTotalItems(inventory: InventoryMap): number {
  return Object.values(inventory).reduce((sum, count) => sum + count, 0);
}

/** Add items to inventory (pure function, returns new inventory) */
export function addItem(inventory: InventoryMap, itemId: string, count = 1): InventoryMap {
  return { ...inventory, [itemId]: (inventory[itemId] ?? 0) + count };
}

/** Use (consume) an item. Returns null if insufficient. */
export function useItem(inventory: InventoryMap, itemId: string): InventoryMap | null {
  const current = inventory[itemId] ?? 0;
  if (current <= 0) return null;
  return { ...inventory, [itemId]: current - 1 };
}

/** Get the item definition by ID */
export function getItemDef(itemId: string): RepairItemDef | undefined {
  return REPAIR_ITEMS.find(i => i.id === itemId);
}

/** Calculate effective repair power considering error pattern bonus */
export function getEffectiveRepairPower(
  itemDef: RepairItemDef,
  dominantErrorPattern?: ErrorType | null,
): number {
  if (itemDef.targetPattern && itemDef.targetPattern === dominantErrorPattern) {
    return Math.round(itemDef.repairPower * itemDef.bonusMultiplier);
  }
  return itemDef.repairPower;
}

/** Get available items that can repair (count > 0) */
export function getAvailableRepairItems(inventory: InventoryMap): { itemId: string; count: number; def: RepairItemDef }[] {
  return REPAIR_ITEMS
    .map(def => ({ itemId: def.id, count: inventory[def.id] ?? 0, def }))
    .filter(x => x.count > 0);
}
