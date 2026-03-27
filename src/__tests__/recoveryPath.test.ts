import { describe, expect, it } from 'vitest';
import {
  buildRecoveryPath,
  advanceRecoveryStep,
  isRecoveryComplete,
  getCurrentStep,
  getRecoverySession,
} from '../utils/recoveryPath';
import type { RecoverySession } from '../utils/recoveryPath';
import type { MistakeRecord } from '../utils/errorMemory';
import type { Mission } from '../types';

// ── Test helpers ──

function makeMission(id: number, kpId: string): Mission {
  return {
    id,
    kpId,
    title: `Mission ${id}`,
    description: '',
    reward: 50,
    secret: { formula: '', answer: 0, explanation: '' },
  } as any;
}

function makeMistake(count: number, dominant: string = 'sign'): MistakeRecord {
  return {
    count,
    lastWrong: '2026-03-27',
    patterns: { [dominant]: count } as any,
  };
}

// Missions spanning multiple topics
const MISSIONS: Mission[] = [
  makeMission(1, 'kp-1.6-01'),
  makeMission(2, 'kp-1.6-02'),
  makeMission(10, 'kp-2.1-01'),
  makeMission(11, 'kp-2.1-02'),
  makeMission(20, 'kp-2.2-01'),
  makeMission(30, 'kp-2.5-01'),
  makeMission(31, 'kp-2.5-02'),
  makeMission(40, 'kp-1.4-01'),
  makeMission(50, 'kp-1.3-01'),
  makeMission(60, 'kp-4.6-01'),
  makeMission(70, 'kp-6.1-01'),
  makeMission(80, 'kp-6.2-01'),
];

describe('recoveryPath', () => {
  describe('buildRecoveryPath', () => {
    it('returns null when no weak prerequisites exist', () => {
      // Origin has errors but all prereqs are healthy
      const mistakes: Record<string, MistakeRecord> = {
        '30': makeMistake(5, 'sign'),
      };
      const result = buildRecoveryPath('2.5', 'sign', mistakes, MISSIONS);
      // No weak prereqs (1.6, 2.2 are all clean) → null or single-step
      expect(result).toBeNull();
    });

    it('builds multi-step path when prerequisites are weak', () => {
      const mistakes: Record<string, MistakeRecord> = {
        '30': makeMistake(6, 'sign'),  // 2.5 — corrupted origin
        '20': makeMistake(4, 'sign'),  // 2.2 — weak prereq
        '1':  makeMistake(3, 'sign'),  // 1.6 — weak deeper prereq
      };
      const result = buildRecoveryPath('2.5', 'sign', mistakes, MISSIONS);
      expect(result).not.toBeNull();
      expect(result!.steps.length).toBeGreaterThanOrEqual(2);
      // Origin should be the last step
      expect(result!.steps[result!.steps.length - 1].topicId).toBe('2.5');
      // Deeper root should come first
      const topicIds = result!.steps.map(s => s.topicId);
      const idx16 = topicIds.indexOf('1.6');
      const idx22 = topicIds.indexOf('2.2');
      const idx25 = topicIds.indexOf('2.5');
      if (idx16 !== -1 && idx22 !== -1) {
        expect(idx16).toBeLessThan(idx22);
      }
      if (idx22 !== -1 && idx25 !== -1) {
        expect(idx22).toBeLessThan(idx25);
      }
    });

    it('origin topic is always the final step', () => {
      const mistakes: Record<string, MistakeRecord> = {
        '30': makeMistake(5, 'method'),
        '20': makeMistake(3, 'method'),
      };
      const result = buildRecoveryPath('2.5', 'method', mistakes, MISSIONS);
      if (result) {
        expect(result.steps[result.steps.length - 1].topicId).toBe('2.5');
      }
    });

    it('does not include duplicate topicIds', () => {
      const mistakes: Record<string, MistakeRecord> = {
        '30': makeMistake(6, 'sign'),
        '20': makeMistake(4, 'sign'),
        '10': makeMistake(3, 'sign'),
        '1':  makeMistake(3, 'sign'),
      };
      const result = buildRecoveryPath('2.5', 'sign', mistakes, MISSIONS);
      if (result) {
        const ids = result.steps.map(s => s.topicId);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });

    it('caps path length at 8 steps', () => {
      // Even with many weak nodes, path should not exceed 8
      const mistakes: Record<string, MistakeRecord> = {};
      MISSIONS.forEach(m => { mistakes[String(m.id)] = makeMistake(5, 'method'); });
      const result = buildRecoveryPath('6.2', 'method', mistakes, MISSIONS);
      if (result) {
        expect(result.steps.length).toBeLessThanOrEqual(8);
      }
    });

    it('each step has a valid missionId from the missions list', () => {
      const mistakes: Record<string, MistakeRecord> = {
        '30': makeMistake(6, 'sign'),
        '20': makeMistake(4, 'sign'),
        '1':  makeMistake(3, 'sign'),
      };
      const result = buildRecoveryPath('2.5', 'sign', mistakes, MISSIONS);
      if (result) {
        const missionIds = new Set(MISSIONS.map(m => m.id));
        for (const step of result.steps) {
          expect(missionIds.has(step.missionId)).toBe(true);
        }
      }
    });

    it('session starts at step 0', () => {
      const mistakes: Record<string, MistakeRecord> = {
        '30': makeMistake(6, 'sign'),
        '20': makeMistake(4, 'sign'),
      };
      const result = buildRecoveryPath('2.5', 'sign', mistakes, MISSIONS);
      if (result) {
        expect(result.currentStepIdx).toBe(0);
        expect(result.startedAt).toBeGreaterThan(0);
      }
    });
  });

  describe('advanceRecoveryStep', () => {
    const session: RecoverySession = {
      originTopicId: '2.5',
      originErrorType: 'sign',
      steps: [
        { topicId: '1.6', reason: { zh: 'r1', en: 'r1' }, errorType: 'sign', missionId: 1, completed: false },
        { topicId: '2.2', reason: { zh: 'r2', en: 'r2' }, errorType: 'sign', missionId: 20, completed: false },
        { topicId: '2.5', reason: { zh: 'r3', en: 'r3' }, errorType: 'sign', missionId: 30, completed: false },
      ],
      currentStepIdx: 0,
      startedAt: Date.now(),
    };

    it('marks current step as completed and advances index', () => {
      const next = advanceRecoveryStep(session);
      expect(next.steps[0].completed).toBe(true);
      expect(next.steps[1].completed).toBe(false);
      expect(next.currentStepIdx).toBe(1);
    });

    it('advances through all steps', () => {
      let s = session;
      for (let i = 0; i < 3; i++) {
        s = advanceRecoveryStep(s);
      }
      expect(s.steps.every(step => step.completed)).toBe(true);
      expect(s.currentStepIdx).toBe(3); // past last index
    });

    it('does not mutate original session', () => {
      const next = advanceRecoveryStep(session);
      expect(session.currentStepIdx).toBe(0);
      expect(session.steps[0].completed).toBe(false);
      expect(next.currentStepIdx).toBe(1);
    });
  });

  describe('isRecoveryComplete', () => {
    it('returns false when steps remain', () => {
      const session: RecoverySession = {
        originTopicId: '2.5', originErrorType: 'sign',
        steps: [
          { topicId: '1.6', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 1, completed: true },
          { topicId: '2.5', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 30, completed: false },
        ],
        currentStepIdx: 1, startedAt: 0,
      };
      expect(isRecoveryComplete(session)).toBe(false);
    });

    it('returns true when all steps completed', () => {
      const session: RecoverySession = {
        originTopicId: '2.5', originErrorType: 'sign',
        steps: [
          { topicId: '1.6', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 1, completed: true },
          { topicId: '2.5', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 30, completed: true },
        ],
        currentStepIdx: 2, startedAt: 0,
      };
      expect(isRecoveryComplete(session)).toBe(true);
    });
  });

  describe('getCurrentStep', () => {
    it('returns correct step', () => {
      const session: RecoverySession = {
        originTopicId: '2.5', originErrorType: 'sign',
        steps: [
          { topicId: '1.6', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 1, completed: true },
          { topicId: '2.5', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 30, completed: false },
        ],
        currentStepIdx: 1, startedAt: 0,
      };
      expect(getCurrentStep(session)?.topicId).toBe('2.5');
    });

    it('returns null when all complete', () => {
      const session: RecoverySession = {
        originTopicId: '2.5', originErrorType: 'sign',
        steps: [
          { topicId: '1.6', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 1, completed: true },
        ],
        currentStepIdx: 1, startedAt: 0,
      };
      expect(getCurrentStep(session)).toBeNull();
    });
  });

  describe('getRecoverySession', () => {
    it('reads session from _recovery field', () => {
      const session: RecoverySession = {
        originTopicId: '2.5', originErrorType: 'sign',
        steps: [{ topicId: '1.6', reason: { zh: '', en: '' }, errorType: 'sign', missionId: 1, completed: false }],
        currentStepIdx: 0, startedAt: 12345,
      };
      const cm = { _recovery: session };
      const result = getRecoverySession(cm);
      expect(result).toEqual(session);
    });

    it('returns null when no _recovery field', () => {
      expect(getRecoverySession({})).toBeNull();
      expect(getRecoverySession({ _recovery: null })).toBeNull();
      expect(getRecoverySession({ _recovery: {} })).toBeNull();
    });

    it('returns null for malformed recovery data', () => {
      // Missing originTopicId
      expect(getRecoverySession({ _recovery: { steps: [], currentStepIdx: 0, startedAt: 1 } })).toBeNull();
      // steps not array
      expect(getRecoverySession({ _recovery: { originTopicId: '2.5', originErrorType: 'sign', steps: 'bad', currentStepIdx: 0, startedAt: 1 } })).toBeNull();
      // Empty steps
      expect(getRecoverySession({ _recovery: { originTopicId: '2.5', originErrorType: 'sign', steps: [], currentStepIdx: 0, startedAt: 1 } })).toBeNull();
      // Negative currentStepIdx
      expect(getRecoverySession({ _recovery: { originTopicId: '2.5', originErrorType: 'sign', steps: [{ topicId: '1.6', missionId: 1, errorType: 'sign', completed: false, reason: { zh: '', en: '' } }], currentStepIdx: -1, startedAt: 1 } })).toBeNull();
      // Invalid step errorType
      expect(getRecoverySession({ _recovery: { originTopicId: '2.5', originErrorType: 'sign', steps: [{ topicId: '1.6', missionId: 1, errorType: 'invalid_type', completed: false, reason: { zh: '', en: '' } }], currentStepIdx: 0, startedAt: 1 } })).toBeNull();
      // Missing step missionId
      expect(getRecoverySession({ _recovery: { originTopicId: '2.5', originErrorType: 'sign', steps: [{ topicId: '1.6', errorType: 'sign', completed: false, reason: { zh: '', en: '' } }], currentStepIdx: 0, startedAt: 1 } })).toBeNull();
      // Non-finite startedAt
      expect(getRecoverySession({ _recovery: { originTopicId: '2.5', originErrorType: 'sign', steps: [{ topicId: '1.6', missionId: 1, errorType: 'sign', completed: false, reason: { zh: '', en: '' } }], currentStepIdx: 0, startedAt: Infinity } })).toBeNull();
    });

    it('round-trips through JSON serialization', () => {
      const session: RecoverySession = {
        originTopicId: '6.2', originErrorType: 'magnitude',
        steps: [
          { topicId: '1.11', reason: { zh: 'r', en: 'r' }, errorType: 'magnitude', missionId: 40, completed: true },
          { topicId: '6.2', reason: { zh: 'r', en: 'r' }, errorType: 'magnitude', missionId: 80, completed: false },
        ],
        currentStepIdx: 1, startedAt: 99999,
      };
      const json = JSON.parse(JSON.stringify({ _recovery: session }));
      expect(getRecoverySession(json)).toEqual(session);
    });
  });
});
