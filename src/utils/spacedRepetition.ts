/**
 * Spaced Repetition — smart review ordering for vocab pool.
 *
 * Algorithm priorities:
 * 1. Overdue words first (past their review interval)
 * 2. Words from current KP (context-relevant)
 * 3. Higher tap count (more struggled)
 * 4. Random shuffle within each group (variety)
 */

import type { VocabPoolEntry } from './vocabPool';
import { getDueWords, getVocabPool } from './vocabPool';

export type ReviewRecommendation = {
  wordId: string;
  urgency: 'overdue' | 'due' | 'upcoming';
  reason: { zh: string; en: string };
  daysOverdue: number;
};

/**
 * Get recommended review words, sorted by priority.
 * @param currentKpId — if provided, words from this KP are boosted
 * @param limit — max words to return (default 8)
 */
export function getReviewRecommendations(
  currentKpId?: string,
  limit = 8,
): ReviewRecommendation[] {
  const pool = getVocabPool();
  const now = Date.now();
  const DAY = 86400000;
  const recs: ReviewRecommendation[] = [];

  for (const entry of Object.values(pool)) {
    if (entry.state === 'mastered') continue;

    const dueAt = entry.lastReview + entry.interval * DAY;
    const daysOverdue = Math.floor((now - dueAt) / DAY);

    let urgency: 'overdue' | 'due' | 'upcoming';
    if (daysOverdue > 0) urgency = 'overdue';
    else if (daysOverdue >= -1) urgency = 'due';
    else urgency = 'upcoming';

    // Only include overdue and due words
    if (urgency === 'upcoming' && !currentKpId) continue;

    const isCurrentKP = currentKpId && entry.lastKpId === currentKpId;

    recs.push({
      wordId: entry.wordId,
      urgency,
      daysOverdue: Math.max(0, daysOverdue),
      reason: isCurrentKP
        ? { zh: '当前知识点相关词汇', en: 'Related to current topic' }
        : urgency === 'overdue'
        ? { zh: `已逾期 ${daysOverdue} 天`, en: `${daysOverdue} days overdue` }
        : { zh: '今天到期复习', en: 'Due for review today' },
    });
  }

  // Sort: overdue first, then current KP, then by days overdue
  recs.sort((a, b) => {
    const urgencyOrder = { overdue: 0, due: 1, upcoming: 2 };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    // Within same urgency, current KP words first
    const aKP = currentKpId && pool[a.wordId]?.lastKpId === currentKpId ? 0 : 1;
    const bKP = currentKpId && pool[b.wordId]?.lastKpId === currentKpId ? 0 : 1;
    if (aKP !== bKP) return aKP - bKP;
    // Then by days overdue
    return b.daysOverdue - a.daysOverdue;
  });

  // Add some randomness within groups (shuffle adjacent items)
  for (let i = recs.length - 1; i > 0; i--) {
    if (recs[i].urgency === recs[i - 1].urgency && Math.random() < 0.3) {
      [recs[i], recs[i - 1]] = [recs[i - 1], recs[i]];
    }
  }

  return recs.slice(0, limit);
}

/**
 * Get a brief summary for display ("3 words due for review")
 */
export function getReviewSummary(): { dueCount: number; text: { zh: string; en: string } } | null {
  const due = getDueWords();
  if (due.length === 0) return null;
  return {
    dueCount: due.length,
    text: {
      zh: `📖 ${due.length} 个词汇需要复习`,
      en: `📖 ${due.length} word${due.length > 1 ? 's' : ''} due for review`,
    },
  };
}
