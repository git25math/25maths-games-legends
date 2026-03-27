// Game balance constants — centralized for easy tuning
// Change values here to adjust game economy without hunting through multiple files

/** Daily stamina (Boss trial) limits */
export const STAMINA = {
  MAX_DAILY: 3,
} as const;

/** Equipment decay thresholds (in effective days) */
export const EQUIPMENT_DECAY = {
  WORN_DAYS: 7,
  DAMAGED_DAYS: 14,
  BROKEN_DAYS: 30,
  /** Each recorded error adds this many "effective days" of decay */
  ERROR_PENALTY_DAYS: 1.5,
} as const;

/** Repair item reward conditions */
export const ITEM_REWARDS = {
  /** Minimum battle score (0-100) to earn a Repair Hammer */
  HAMMER_MIN_SCORE: 80,
  /** Minimum Recovery Pack accuracy (0-1) to earn a Purify Scroll */
  SCROLL_MIN_ACCURACY: 0.8,
} as const;

/** Repair item effectiveness */
export const REPAIR_POWER = {
  HAMMER: 30,
  SCROLL: 60,
  CRYSTAL: 100,
  /** Bonus multiplier when scroll matches dominant error pattern */
  PATTERN_BONUS: 1.5,
} as const;

/** Tech tree unlock thresholds */
export const TECH_TREE = {
  /** Minimum missions with errors to mark topic as corrupted */
  CORRUPTION_ERROR_THRESHOLD: 5,
} as const;

/**
 * Shop item prices (currency type → cost per unit)
 * merit = 功勋 (⚔️, earned from battle wins)
 * wisdom = 智略 (📜, earned from practice)
 */
export const SHOP_PRICES: Record<string, { type: 'merit' | 'wisdom' | 'rations'; amount: number }> = {
  hammer:          { type: 'merit',  amount: 30  },
  scroll_sign:     { type: 'wisdom', amount: 50  },
  scroll_rounding: { type: 'wisdom', amount: 50  },
  scroll_magnitude:{ type: 'wisdom', amount: 50  },
  scroll_method:   { type: 'wisdom', amount: 50  },
  crystal:         { type: 'merit',  amount: 80  },
} as const;
