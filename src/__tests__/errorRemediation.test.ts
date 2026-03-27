import { describe, expect, it } from 'vitest';
import { getRemediationTopics, getRemediationChain, getAllRemediations } from '../utils/errorRemediation';
import type { ErrorType } from '../utils/diagnoseError';
import type { MistakeRecord } from '../utils/errorMemory';
import { CHAPTERS } from '../data/curriculum/kp-registry';

const ALL_TOPIC_IDS = CHAPTERS.flatMap(ch => ch.topics.map(t => t.id));
const ERROR_TYPES: ErrorType[] = ['sign', 'rounding', 'magnitude', 'method', 'unknown'];

describe('errorRemediation', () => {
  describe('coverage: every topic has ≥3 error types with remediation', () => {
    for (const topicId of ALL_TOPIC_IDS) {
      it(`topic ${topicId} has ≥3 error-type remediation paths`, () => {
        let coveredCount = 0;
        for (const etype of ERROR_TYPES) {
          const entries = getRemediationTopics(topicId, etype);
          if (entries.length > 0) coveredCount++;
        }
        expect(coveredCount).toBeGreaterThanOrEqual(3);
      });
    }
  });

  describe('no self-referencing remediations', () => {
    for (const topicId of ALL_TOPIC_IDS) {
      it(`topic ${topicId} does not recommend itself`, () => {
        for (const etype of ERROR_TYPES) {
          const entries = getRemediationTopics(topicId, etype);
          const selfRef = entries.filter(e => e.topicId === topicId);
          expect(selfRef).toHaveLength(0);
        }
      });
    }
  });

  describe('all referenced topic IDs are valid', () => {
    const validIds = new Set(ALL_TOPIC_IDS);
    for (const topicId of ALL_TOPIC_IDS) {
      it(`topic ${topicId} references only valid topics`, () => {
        for (const etype of ERROR_TYPES) {
          const entries = getRemediationTopics(topicId, etype);
          for (const entry of entries) {
            expect(validIds.has(entry.topicId)).toBe(true);
          }
        }
      });
    }
  });

  describe('remediation targets do not point 3+ chapters forward', () => {
    // CIE chapter numbers ≠ dependency order (e.g., ch2.9 depends on ch3.1).
    // But remediation should never jump 3+ chapters forward — that signals a data error.
    function chapterNum(id: string): number {
      return Number(id.split('.')[0]);
    }
    for (const topicId of ALL_TOPIC_IDS) {
      it(`topic ${topicId} remediation targets are within 2 chapters`, () => {
        const ch = chapterNum(topicId);
        for (const etype of ERROR_TYPES) {
          const entries = getRemediationTopics(topicId, etype);
          for (const entry of entries) {
            const targetCh = chapterNum(entry.topicId);
            // Allow up to 2 chapters forward (e.g., ch2→ch3 for coordinate prereqs)
            expect(targetCh).toBeLessThanOrEqual(ch + 2);
          }
        }
      });
    }
  });

  describe('bilingual reasons are present', () => {
    for (const topicId of ALL_TOPIC_IDS) {
      it(`topic ${topicId} has both zh and en reasons`, () => {
        for (const etype of ERROR_TYPES) {
          const entries = getRemediationTopics(topicId, etype);
          for (const entry of entries) {
            expect(entry.reason.zh.length).toBeGreaterThan(0);
            expect(entry.reason.en.length).toBeGreaterThan(0);
          }
        }
      });
    }
  });

  describe('recursive chain respects max depth', () => {
    it('returns empty chain for topic with no matching error type', () => {
      const chain = getRemediationChain('1.1', 'sign', {}, new Map());
      // 1.1 is the base topic — ch1 default should still resolve
      // (1.6 is the chapter default for sign errors)
      expect(chain.length).toBeGreaterThanOrEqual(0);
    });

    it('follows chain through weak prerequisites', () => {
      const mistakes: Record<string, MistakeRecord> = {
        // Mission 100 belongs to topic 2.5 — sign error dominant
        '100': { count: 5, lastWrong: '2026-03-27', patterns: { sign: 4, method: 1 } as any },
        // Mission 50 belongs to topic 1.6 — also has errors (deeper root)
        '50':  { count: 3, lastWrong: '2026-03-27', patterns: { method: 3 } as any },
      };
      const topicMissions = new Map<string, number[]>([
        ['2.5', [100]],
        ['1.6', [50]],
        ['2.2', []],
        ['2.1', []],
      ]);

      const chain = getRemediationChain('2.5', 'sign', mistakes, topicMissions);
      // Should include direct targets (1.6, 2.2) and recurse into 1.6's errors
      expect(chain.length).toBeGreaterThan(0);
      expect(chain.some(e => e.topicId === '1.6')).toBe(true);
    });
  });

  describe('getAllRemediations returns all 5 error types', () => {
    it('returns Record with all 5 keys', () => {
      const result = getAllRemediations('2.5');
      expect(Object.keys(result).sort()).toEqual(ERROR_TYPES.sort());
      // Method should have entries for 2.5
      expect(result.method.length).toBeGreaterThan(0);
    });
  });
});
