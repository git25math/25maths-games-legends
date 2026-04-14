// Shared date key utility — single source of truth for "today" in YYYYMMDD (local time).
// Used by dailyChallenge, stamina, and any other day-scoped state.
// Local timezone is intentional: "today" matches the user's wall clock.

/** Get today's date key in YYYYMMDD format (local time) */
export function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}
