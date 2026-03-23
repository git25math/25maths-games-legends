/**
 * Shared helpers used by all generator modules.
 * This is the ONLY place these utilities are defined.
 */
import type { Mission, BilingualText } from '../../types';

// Re-export for convenience
export type { Mission, BilingualText };

/* ── Random ── */

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ── Display formatting ── */

/** Format number with sign: 3→"+ 3", -3→"- 3" */
export function signTerm(n: number): string {
  return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

/** Format coefficient×variable: 1→"x", -1→"-x", 3→"3x" */
export function coeffStr(coeff: number, variable: string): string {
  if (coeff === 1) return variable;
  if (coeff === -1) return `-${variable}`;
  return `${coeff}${variable}`;
}

/** Format coefficient×variable with leading sign: 1→"+ x", -1→"- x" */
export function signCoeff(coeff: number, variable: string): string {
  if (coeff === 0) return '+ 0';
  return coeff > 0 ? `+ ${coeffStr(coeff, variable)}` : `- ${coeffStr(Math.abs(coeff), variable)}`;
}

/** Format "ax + by = c" with correct signs */
export function eqStr(a: number, b: number, c: number, xVar = 'x', yVar = 'y'): string {
  return `${coeffStr(a, xVar)} ${signCoeff(b, yVar)} = ${c}`;
}

/** Format "mx + c" style linear expression */
export function linearExpr(m: number, c: number, variable = 'x'): string {
  if (c === 0) return coeffStr(m, variable);
  return `${coeffStr(m, variable)} ${signTerm(c)}`;
}

/* ── Retry logic ── */

const MAX_RETRY = 20;

export function safeRetry<T>(template: Mission, generator: (t: Mission) => T): T {
  const count = ((template as any)._retryCount || 0) + 1;
  if (count > MAX_RETRY) throw new Error(`Generator exceeded ${MAX_RETRY} retries`);
  return generator({ ...template, _retryCount: count } as any);
}

/* ── Difficulty tier ── */

export type DifficultyTier = 1 | 2 | 3;

let _currentTier: DifficultyTier = 2;

export function getTier(): DifficultyTier { return _currentTier; }
export function setTier(t: DifficultyTier): void { _currentTier = t; }

/* ── Math helpers ── */

export function gcdCalc(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

/** Generator function signature */
export type GeneratorFn = (template: Mission) => Mission;
