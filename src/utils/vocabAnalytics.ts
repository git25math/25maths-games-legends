/**
 * Vocab Analytics — analyzes tap event patterns to generate recommendations.
 *
 * L1 high frequency → vocab weakness (push vocab review)
 * L2 high frequency → reading weakness (push question-interpretation training)
 * L3 high frequency → method weakness (push KP tutorials)
 */

import type { VocabTapEvent } from './vocabPool';
import { getVocabEvents, getVocabPool } from './vocabPool';

export type VocabInsight = {
  type: 'vocab_weak' | 'reading_weak' | 'method_weak';
  message: { zh: string; en: string };
  wordIds: string[];
  kpIds: string[];
};

/**
 * Analyze vocab tap patterns and generate learning insights.
 */
export function analyzeVocabPatterns(): VocabInsight[] {
  const events = getVocabEvents();
  if (events.length < 3) return []; // Need minimum data

  const insights: VocabInsight[] = [];

  // Count L1/L2/L3 frequencies per word
  const wordL1 = new Map<string, number>();
  const wordL2 = new Map<string, number>();
  const wordL3 = new Map<string, number>();
  const kpL2 = new Map<string, number>();
  const kpL3 = new Map<string, number>();

  for (const e of events) {
    if (e.l1) wordL1.set(e.wordId, (wordL1.get(e.wordId) || 0) + 1);
    if (e.l2) {
      wordL2.set(e.wordId, (wordL2.get(e.wordId) || 0) + 1);
      kpL2.set(e.kpId, (kpL2.get(e.kpId) || 0) + 1);
    }
    if (e.l3) {
      wordL3.set(e.wordId, (wordL3.get(e.wordId) || 0) + 1);
      kpL3.set(e.kpId, (kpL3.get(e.kpId) || 0) + 1);
    }
  }

  // Insight 1: Vocab weakness (≥3 L1 taps on same word)
  const vocabWeak = [...wordL1.entries()].filter(([, c]) => c >= 3).map(([w]) => w);
  if (vocabWeak.length > 0) {
    insights.push({
      type: 'vocab_weak',
      message: {
        zh: `你在 ${vocabWeak.length} 个单词上反复查看——建议去"词汇复习"巩固一下。`,
        en: `You've looked up ${vocabWeak.length} words multiple times — try a vocab review session.`,
      },
      wordIds: vocabWeak.slice(0, 5),
      kpIds: [],
    });
  }

  // Insight 2: Reading weakness (≥2 L2 taps on same KP)
  const readingWeak = [...kpL2.entries()].filter(([, c]) => c >= 2).map(([k]) => k);
  if (readingWeak.length > 0) {
    insights.push({
      type: 'reading_weak',
      message: {
        zh: `你在 ${readingWeak.length} 个知识点的题目理解上需要加强。`,
        en: `You need extra help understanding questions in ${readingWeak.length} topics.`,
      },
      wordIds: [],
      kpIds: readingWeak.slice(0, 5),
    });
  }

  // Insight 3: Method weakness (≥2 L3 taps on same KP)
  const methodWeak = [...kpL3.entries()].filter(([, c]) => c >= 2).map(([k]) => k);
  if (methodWeak.length > 0) {
    insights.push({
      type: 'method_weak',
      message: {
        zh: `你在 ${methodWeak.length} 个知识点的解题方法上需要复习教程。`,
        en: `You should review tutorials for ${methodWeak.length} topics where you needed method help.`,
      },
      wordIds: [],
      kpIds: methodWeak.slice(0, 5),
    });
  }

  return insights;
}

/**
 * Get a quick summary for display on MapScreen.
 */
export function getVocabQuickInsight(lang: 'en' | 'zh' | 'zh_TW'): string | null {
  const pool = getVocabPool();
  const entries = Object.values(pool);
  if (entries.length === 0) return null;

  const learning = entries.filter(e => e.state === 'learning' || e.state === 'new').length;
  if (learning === 0) return null;

  const en = lang === 'en';
  return en
    ? `📖 ${learning} word${learning > 1 ? 's' : ''} in your review pool`
    : `📖 ${learning} 个词汇待复习`;
}
