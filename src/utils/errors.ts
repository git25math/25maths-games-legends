/**
 * Format any Supabase/PostgREST error or arbitrary unknown for console logging.
 * Supabase errors have shape { message, details, hint, code }; naive String(err)
 * on such objects prints "[object Object]" which hides the real cause.
 */
function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof e.message === 'string') parts.push(e.message);
    if (typeof e.code === 'string' || typeof e.code === 'number') parts.push(`code=${e.code}`);
    if (typeof e.hint === 'string') parts.push(`hint=${e.hint}`);
    if (typeof e.details === 'string') parts.push(`details=${e.details}`);
    if (parts.length > 0) return parts.join(' | ');
    // Fallback: JSON serialize, guard against circular refs
    try { return JSON.stringify(error); } catch { return '[unserializable error]'; }
  }
  return String(error);
}

export function handleSupabaseError(error: unknown, operation: string, path: string) {
  const message = formatError(error);
  console.error(`Supabase Error [${operation}] ${path}:`, message, error);
}

