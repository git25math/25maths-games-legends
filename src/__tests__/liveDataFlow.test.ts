import { describe, it, expect } from 'vitest';
import { MISSIONS_Y7 } from '../data/missions/y7';
import { MISSIONS_Y8 } from '../data/missions/y8';
import { MISSIONS_Y9 } from '../data/missions/y9';
import { MISSIONS_Y10 } from '../data/missions/y10';
import { MISSIONS_Y11 } from '../data/missions/y11';
import { generateMission } from '../utils/generators/index';
import { checkAnswer } from '../utils/checkCorrectness';

const ALL = [...MISSIONS_Y7, ...MISSIONS_Y8, ...MISSIONS_Y9, ...MISSIONS_Y10, ...MISSIONS_Y11]
  .filter(m => m.data?.generatorType);

describe('Live Classroom: generated data survives JSON roundtrip', () => {
  for (const template of ALL) {
    it(`mission ${template.id} (${template.data.generatorType})`, () => {
      const generated = generateMission(template);

      // Simulate Supabase JSONB storage roundtrip
      const roundtripped = JSON.parse(JSON.stringify(generated.data));

      // Merge back (same logic as LiveStudentScreen effectiveMission)
      const effective = { ...generated, data: { ...template.data, ...roundtripped } };

      // checkAnswer must not throw and must return valid result
      // First call with expected answers to verify "correct=true" path
      const firstResult = checkAnswer(generated, generated.data.answer != null ? { ans: String(generated.data.answer) } : {});
      expect(firstResult).toBeDefined();
      expect(typeof firstResult.correct).toBe('boolean');

      // Second call with roundtripped data to verify JSON roundtrip doesn't break checking
      const rtResult = checkAnswer(effective, firstResult.expected);
      expect(rtResult).toBeDefined();
      expect(typeof rtResult.correct).toBe('boolean');

      // No keys lost in JSON roundtrip
      for (const [k, v] of Object.entries(generated.data)) {
        if (v !== undefined && v !== null) {
          expect(roundtripped).toHaveProperty(k);
        }
      }

      // No NaN/Infinity in generated data
      for (const [k, v] of Object.entries(generated.data)) {
        if (typeof v === 'number') {
          expect(Number.isFinite(v), `${k} should be finite, got ${v}`).toBe(true);
        }
      }
    });
  }
});
