/**
 * Vocabulary Pool — persists student's vocab learning state.
 *
 * Records every vocab tap event and maintains a personal word pool
 * for spaced repetition review. Data stored in localStorage,
 * synced to Supabase when online.
 */

export type VocabTapEvent = {
  wordId: string;
  missionId: number;
  kpId: string;
  timestamp: number;
  l1: boolean;    // opened L1 (word meaning)
  l2: boolean;    // opened L2 (question interpretation)
  l3: boolean;    // opened L3 (method guidance)
  tutorialClicked: boolean;
  finalCorrect: boolean | null;  // null = not yet answered
};

export type VocabPoolEntry = {
  wordId: string;
  state: 'new' | 'learning' | 'familiar' | 'mastered';
  interval: number;        // days until next review
  lastReview: number;      // timestamp
  reviewCount: number;
  correctStreak: number;
  addedAt: number;
  lastKpId: string;        // KP where first encountered
  tapCount: number;        // total times tapped
  maxLevel: 1 | 2 | 3;    // deepest level reached
};

const LS_KEY = 'gl_vocab_pool';
const LS_EVENTS_KEY = 'gl_vocab_events';

// ── Pool CRUD ──

export function getVocabPool(): Record<string, VocabPoolEntry> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function savePool(pool: Record<string, VocabPoolEntry>): void {
  localStorage.setItem(LS_KEY, JSON.stringify(pool));
}

/** Add or update a word in the pool (called on each vocab tap) */
export function recordVocabTap(
  wordId: string,
  level: 1 | 2 | 3,
  kpId: string,
  missionId: number,
): void {
  const pool = getVocabPool();

  if (!pool[wordId]) {
    pool[wordId] = {
      wordId,
      state: 'new',
      interval: 1,
      lastReview: 0,
      reviewCount: 0,
      correctStreak: 0,
      addedAt: Date.now(),
      lastKpId: kpId,
      tapCount: 0,
      maxLevel: level,
    };
  }

  const entry = pool[wordId];
  entry.tapCount++;
  entry.maxLevel = Math.max(entry.maxLevel, level) as 1 | 2 | 3;
  entry.lastKpId = kpId;

  // If student needed L2 or L3, mark as 'learning' (not just browsing)
  if (level >= 2 && entry.state === 'new') {
    entry.state = 'learning';
  }

  savePool(pool);

  // Also record the event for analytics
  recordEvent({ wordId, missionId, kpId, timestamp: Date.now(), l1: true, l2: level >= 2, l3: level >= 3, tutorialClicked: false, finalCorrect: null });
}

/** Mark a word as reviewed (called from VocabReviewPanel) */
export function recordReview(wordId: string, remembered: boolean): void {
  const pool = getVocabPool();
  const entry = pool[wordId];
  if (!entry) return;

  entry.reviewCount++;
  entry.lastReview = Date.now();

  if (remembered) {
    entry.correctStreak++;
    // Increase interval: 1 → 2 → 4 → 8 → 16 → 30
    entry.interval = Math.min(30, entry.interval * 2);
    // State progression
    if (entry.correctStreak >= 4) entry.state = 'mastered';
    else if (entry.correctStreak >= 2) entry.state = 'familiar';
    else entry.state = 'learning';
  } else {
    entry.correctStreak = 0;
    entry.interval = 1; // reset
    entry.state = 'learning';
  }

  savePool(pool);
}

/** Get words due for review (overdue based on interval) */
export function getDueWords(): VocabPoolEntry[] {
  const pool = getVocabPool();
  const now = Date.now();
  const due: VocabPoolEntry[] = [];

  for (const entry of Object.values(pool)) {
    if (entry.state === 'mastered') continue; // skip mastered
    const dueAt = entry.lastReview + entry.interval * 86400000; // interval in days
    if (now >= dueAt || entry.lastReview === 0) {
      due.push(entry);
    }
  }

  return due;
}

/** Get pool stats */
export function getPoolStats(): { total: number; new: number; learning: number; familiar: number; mastered: number; dueCount: number } {
  const pool = getVocabPool();
  const entries = Object.values(pool);
  return {
    total: entries.length,
    new: entries.filter(e => e.state === 'new').length,
    learning: entries.filter(e => e.state === 'learning').length,
    familiar: entries.filter(e => e.state === 'familiar').length,
    mastered: entries.filter(e => e.state === 'mastered').length,
    dueCount: getDueWords().length,
  };
}

// ── Events ──

function recordEvent(event: VocabTapEvent): void {
  try {
    const raw = localStorage.getItem(LS_EVENTS_KEY);
    const events: VocabTapEvent[] = raw ? JSON.parse(raw) : [];
    events.push(event);
    // Keep last 500 events
    if (events.length > 500) events.splice(0, events.length - 500);
    localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(events));
  } catch { /* silent */ }
}

export function getVocabEvents(): VocabTapEvent[] {
  try {
    const raw = localStorage.getItem(LS_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
