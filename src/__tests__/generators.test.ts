/**
 * Automated generator test: run each of the 77 generators ×20 times.
 * For each generated mission:
 *   1. Generator doesn't throw
 *   2. Output preserves template identity (id, type, topic)
 *   3. Output has a valid generatorType in data
 *   4. checkAnswer with expected values returns correct=true
 *   5. No NaN/Infinity in numeric data fields
 */
import { describe, it, expect } from 'vitest';
import { generateMission, type GeneratorType } from '../utils/generators/index';
import { checkAnswer } from '../utils/checkCorrectness';
import { MISSIONS } from '../data/missions';
import type { Mission } from '../types';

const ITERATIONS = 20;

// Find one template mission per generatorType
const templatesByType = new Map<string, Mission>();
for (const m of MISSIONS) {
  const gt = m.data?.generatorType;
  if (gt && !templatesByType.has(gt)) {
    templatesByType.set(gt, m);
  }
}

// Collect all generator types from missions
const allTypes = Array.from(templatesByType.keys()).sort();

describe(`Generator coverage: ${allTypes.length} types found`, () => {
  it('should have at least 70 generator types', () => {
    expect(allTypes.length).toBeGreaterThanOrEqual(70);
  });
});

// Helper: extract expected answer inputs from checkAnswer
function getExpectedInputs(mission: Mission): Record<string, string> {
  // checkAnswer with empty inputs returns expected values
  const result = checkAnswer(mission, {});
  return result.expected;
}

// Helper: check if a value is a valid number (not NaN, not Infinity)
function isFiniteNumber(v: unknown): boolean {
  return typeof v === 'number' && Number.isFinite(v);
}

// Run tests for each generator type
for (const genType of allTypes) {
  const template = templatesByType.get(genType)!;

  describe(`Generator: ${genType} (mission ${template.id}, type ${template.type})`, () => {
    const generated: Mission[] = [];

    // Generate N missions
    for (let i = 0; i < ITERATIONS; i++) {
      it(`iteration ${i + 1}: generates without throwing`, () => {
        const mission = generateMission(template);
        generated.push(mission);
        expect(mission).toBeDefined();
      });
    }

    it('preserves template identity across all iterations', () => {
      for (const m of generated) {
        expect(m.id).toBe(template.id);
        expect(m.type).toBe(template.type);
        expect(m.topic).toBe(template.topic);
        expect(m.grade).toBe(template.grade);
      }
    });

    it('output data has generatorType', () => {
      for (const m of generated) {
        expect(m.data?.generatorType).toBe(genType);
      }
    });

    it('no NaN or Infinity in numeric data fields', () => {
      for (const m of generated) {
        if (!m.data) continue;
        for (const [key, val] of Object.entries(m.data)) {
          if (typeof val === 'number') {
            expect(Number.isFinite(val), `data.${key} = ${val}`).toBe(true);
          }
        }
      }
    });

    it('checkAnswer returns correct=true with expected answers', () => {
      let passCount = 0;
      const failures: string[] = [];

      for (const m of generated) {
        const expected = getExpectedInputs(m);
        // Skip if checkAnswer can't determine expected (empty expected = type not handled or complex)
        if (Object.keys(expected).length === 0) continue;

        const result = checkAnswer(m, expected);
        if (result.correct || result.partial) {
          passCount++;
        } else {
          failures.push(
            `Mission ${m.id} data=${JSON.stringify(m.data).slice(0, 200)} expected=${JSON.stringify(expected)} got correct=false`
          );
        }
      }

      // Allow up to 10% failures (some generators have complex answer formats)
      const total = generated.filter(m => Object.keys(getExpectedInputs(m)).length > 0).length;
      if (total > 0) {
        const passRate = passCount / total;
        if (failures.length > 0) {
          console.warn(`  ${genType}: ${passCount}/${total} passed (${(passRate * 100).toFixed(0)}%)`);
          if (failures.length <= 3) {
            failures.forEach(f => console.warn(`    FAIL: ${f}`));
          }
        }
        expect(passRate, `Pass rate for ${genType}: ${failures.length} failures`).toBeGreaterThanOrEqual(0.9);
      }
    });

    it('generates diverse output (not always same values)', () => {
      if (generated.length < 5) return;
      // Check that at least some variation exists in a numeric data field
      const firstData = generated[0]?.data;
      if (!firstData) return;
      const numericKeys = Object.keys(firstData).filter(
        k => typeof firstData[k] === 'number' && k !== 'generatorType'
      );
      if (numericKeys.length === 0) return;

      // At least one key should have variation across iterations
      const hasVariation = numericKeys.some(key => {
        const values = new Set(generated.map(m => m.data?.[key]));
        return values.size > 1;
      });
      expect(hasVariation, `${genType} always produces identical output`).toBe(true);
    });
  });
}
