/**
 * Interpolates {key} placeholders in a string with values from a params object.
 * Used to parameterize mission story/description text so generators only change numbers.
 *
 * Example: interpolate("已知 $x+{a}={b}$", { a: 5, b: 12 }) → "已知 $x+5=12$"
 */
export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key, offset) => {
    // Skip pure-digit keys (LaTeX arguments like \binom{3}{4})
    if (/^\d+$/.test(key)) return match;
    // Skip when preceded by a \command (LaTeX like \vec{a}, \frac{x}{y})
    const before = template.slice(Math.max(0, offset - 20), offset);
    if (/\\[a-zA-Z]+$/.test(before)) return match;
    const val = params[key];
    return val !== undefined ? String(val) : match;
  });
}

/** Interpolate both zh and en fields of a BilingualText with the same params. */
export function interpolateBilingual(
  template: { zh: string; en: string },
  params: Record<string, string | number>,
): { zh: string; en: string } {
  return {
    zh: interpolate(template.zh, params),
    en: interpolate(template.en, params),
  };
}
