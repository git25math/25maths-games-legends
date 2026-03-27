/**
 * Three-currency economy for 25Maths Play v9.2.0
 *
 * 三币体系：
 *  功勋 (merit)   — gold   — earned from battle victories
 *  智略 (wisdom)  — silver — earned from practice completions
 *  军粮 (rations) — bronze — earned from daily tasks & expeditions
 *
 * Stored in completed_missions._currency
 */

export type CurrencyType = 'merit' | 'wisdom' | 'rations';

export interface CurrencyBalance {
  merit: number;
  wisdom: number;
  rations: number;
}

const CURRENCY_KEY = '_currency';

/** Read currency balance from completed_missions */
export function getCurrency(cm: Record<string, unknown>): CurrencyBalance {
  const raw = cm[CURRENCY_KEY] as Partial<CurrencyBalance> | undefined;
  return {
    merit: raw?.merit ?? 0,
    wisdom: raw?.wisdom ?? 0,
    rations: raw?.rations ?? 0,
  };
}

/** Award currency — returns mutated copy (call with structuredClone result) */
export function awardCurrency(
  cm: Record<string, unknown>,
  type: CurrencyType,
  amount: number,
): Record<string, unknown> {
  if (amount <= 0) return cm;
  const current = getCurrency(cm);
  current[type] = current[type] + amount;
  cm[CURRENCY_KEY] = current;
  return cm;
}

/** Spend currency — returns null if insufficient balance */
export function spendCurrency(
  cm: Record<string, unknown>,
  type: CurrencyType,
  amount: number,
): Record<string, unknown> | null {
  if (amount <= 0) return cm;
  const current = getCurrency(cm);
  if (current[type] < amount) return null; // insufficient
  current[type] = current[type] - amount;
  cm[CURRENCY_KEY] = current;
  return cm;
}

/** Currency display names for all three languages */
export const CURRENCY_LABELS: Record<CurrencyType, { zh: string; zh_TW: string; en: string; icon: string }> = {
  merit:   { zh: '功勋', zh_TW: '功勛', en: 'Merit',   icon: '⚔️' },
  wisdom:  { zh: '智略', zh_TW: '智略', en: 'Wisdom',  icon: '📜' },
  rations: { zh: '军粮', zh_TW: '軍糧', en: 'Rations', icon: '🍚' },
};

/** Battle economy constants */
export const CURRENCY_REWARDS = {
  /** Merit per correct answer in battle */
  BATTLE_CORRECT: 5,
  /** Merit bonus for winning a full battle */
  BATTLE_WIN: 30,
  /** Merit for daily challenge win */
  DAILY_WIN_BONUS: 50,
  /** Wisdom for completing practice */
  PRACTICE_COMPLETE: 20,
  /** Rations for completing a daily task */
  DAILY_TASK: 10,
} as const;
