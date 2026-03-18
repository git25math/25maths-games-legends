import type { Mission, BilingualText } from '../types';

/* ── Shared helpers ── */

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ── Generator type registry ── */

export type GeneratorType =
  | 'SIMPLE_EQ_RANDOM'
  | 'SIMPLE_EQ_ADD_RANDOM'
  | 'INDICES_RANDOM'
  | 'ANGLES_RANDOM'
  | 'ARITHMETIC_RANDOM'
  | 'AREA_RECT_RANDOM'
  | 'AREA_TRAP_RANDOM'
  | 'PROBABILITY_SIMPLE_RANDOM'
  | 'PROBABILITY_IND_RANDOM'
  | 'PYTHAGORAS_RANDOM'
  | 'PERCENTAGE_RANDOM'
  | 'LINEAR_RANDOM'
  | 'SIMULTANEOUS_RANDOM'
  | 'RATIO_RANDOM'
  | 'SIMILARITY_RANDOM'
  | 'STATISTICS_MEAN_RANDOM'
  | 'TRIGONOMETRY_RANDOM'
  | 'QUADRATIC_RANDOM'
  | 'ROOTS_RANDOM'
  | 'DERIVATIVE_RANDOM'
  | 'INTEGRATION_RANDOM'
  | 'VOLUME_RANDOM'
  | 'FUNC_VAL_RANDOM'
  | 'STATISTICS_MEDIAN_RANDOM';

/** Adaptive difficulty tier: 1=easy, 2=medium(default), 3=hard */
export type DifficultyTier = 1 | 2 | 3;

// Module-level tier for generators to read (set before each generation call)
let _currentTier: DifficultyTier = 2;

const GENERATOR_MAP: Record<GeneratorType, (t: Mission) => Mission> = {
  SIMPLE_EQ_RANDOM: generateSimpleEqMission,
  SIMPLE_EQ_ADD_RANDOM: generateAddEqMission,
  INDICES_RANDOM: generateIndicesMission,
  ANGLES_RANDOM: generateAnglesMission,
  ARITHMETIC_RANDOM: generateArithmeticMission,
  AREA_RECT_RANDOM: generateAreaRectMission,
  AREA_TRAP_RANDOM: generateAreaTrapMission,
  PROBABILITY_SIMPLE_RANDOM: generateProbSimpleMission,
  PROBABILITY_IND_RANDOM: generateProbIndMission,
  PYTHAGORAS_RANDOM: generatePythagorasMission,
  PERCENTAGE_RANDOM: generatePercentageMission,
  LINEAR_RANDOM: generateLinearMission,
  SIMULTANEOUS_RANDOM: generateSimultaneousMission,
  RATIO_RANDOM: generateRatioMission,
  SIMILARITY_RANDOM: generateSimilarityMission,
  STATISTICS_MEAN_RANDOM: generateStatsMeanMission,
  TRIGONOMETRY_RANDOM: generateTrigonometryMission,
  QUADRATIC_RANDOM: generateQuadraticMission,
  ROOTS_RANDOM: generateRootsMission,
  DERIVATIVE_RANDOM: generateDerivativeMission,
  INTEGRATION_RANDOM: generateIntegrationMission,
  VOLUME_RANDOM: generateVolumeMission,
  FUNC_VAL_RANDOM: generateFuncValMission,
  STATISTICS_MEDIAN_RANDOM: generateStatsMedianMission,
};

/** Dispatch to the right generator. Optional tier controls number difficulty. */
export function generateMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const genType = template.data?.generatorType as GeneratorType | undefined;
  if (!genType || !GENERATOR_MAP[genType]) return template;
  _currentTier = tier;
  return GENERATOR_MAP[genType](template);
}

/** Get current tier — called by generators */
function getTier(): DifficultyTier { return _currentTier; }

/**
 * SIMPLE_EQ (multiplication): ax = result
 * Generator only updates data fields + tutorialSteps.
 * Story/title/description are templates with {a}, {result} — interpolated at render time.
 */
export function generateSimpleEqMission(template: Mission): Mission {
  const tier = getTier();
  const aPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7, 8, 9], 3: [3, 5, 7, 8, 9, 11, 12, 15] };
  const xPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15], 3: [5, 8, 10, 12, 15, 18, 20, 25] };
  const a = pickRandom(aPools[tier]);
  const x = pickRandom(xPools[tier]);
  const result = a * x;

  const tutorialSteps = [
    { text: { zh: `军师：「${a}x = ${result}，如何求出 x？」`, en: `Strategist: "${a}x = ${result}, how do we find x?"` }, highlightField: 'x' },
    { text: { zh: `军师：「等式两边同时除以 ${a}」`, en: `Strategist: "Divide both sides by ${a}"` }, hint: { zh: `${a}x ÷ ${a} = ${result} ÷ ${a}`, en: `${a}x ÷ ${a} = ${result} ÷ ${a}` }, highlightField: 'x' },
    { text: { zh: `军师：「所以 x = ${x}！」`, en: `Strategist: "So x = ${x}!"` }, highlightField: 'x' },
  ];

  const tutorialEquationSteps = [
    { tex: `${a}x = ${result}`, annotation: { zh: '列方程', en: 'Equation' } },
    { tex: `${a}x \\div ${a} = ${result} \\div ${a}`, annotation: { zh: `两边÷${a}`, en: `÷${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  return {
    ...template,
    // title: preserved (never replaced)
    // story: preserved (template with {a}, {result} — interpolated at render)
    // description: preserved (template — interpolated at render)
    data: { ...template.data, x, a, result, left: `${a}x`, right: `${result}`, generatorType: 'SIMPLE_EQ_RANDOM', tutorialEquationSteps },
    tutorialSteps,
  };
}

/**
 * SIMPLE_EQ (addition): x + a = result
 * Generator only updates data fields + tutorialSteps.
 * Story/title/description are templates with {a}, {result} — interpolated at render time.
 */
export function generateAddEqMission(template: Mission): Mission {
  const tier = getTier();
  const aPools = { 1: [3, 4, 5, 6], 2: [3, 4, 5, 6, 7, 8, 9, 11, 13, 15], 3: [7, 9, 11, 13, 15, 18, 21, 25] };
  const xPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20], 3: [8, 10, 12, 15, 18, 20, 25, 30] };
  const a = pickRandom(aPools[tier]);
  const x = pickRandom(xPools[tier]);
  const result = x + a;

  const tutorialSteps = [
    { text: { zh: `军师：「x + ${a} = ${result}，如何求出 x？」`, en: `Strategist: "x + ${a} = ${result}, how do we find x?"` }, highlightField: 'x' },
    { text: { zh: `军师：「等式两边同时减去 ${a}」`, en: `Strategist: "Subtract ${a} from both sides"` }, hint: { zh: `x + ${a} − ${a} = ${result} − ${a}`, en: `x + ${a} − ${a} = ${result} − ${a}` }, highlightField: 'x' },
    { text: { zh: `军师：「所以 x = ${x}！」`, en: `Strategist: "So x = ${x}!"` }, highlightField: 'x' },
  ];

  const tutorialEquationSteps = [
    { tex: `x + ${a} = ${result}`, annotation: { zh: '列方程', en: 'Equation' } },
    { tex: `x + ${a} - ${a} = ${result} - ${a}`, annotation: { zh: `两边-${a}`, en: `-${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  return {
    ...template,
    data: { ...template.data, x, a, result, left: `x+${a}`, right: `${result}`, generatorType: 'SIMPLE_EQ_ADD_RANDOM', tutorialEquationSteps },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   INDICES generator: a^e1 × a^e2 = a^x  or  a^e1 / a^e2 = a^x
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateIndicesMission(template: Mission): Mission {
  const tier = getTier();
  const basePools = { 1: [2, 3], 2: [2, 3, 5], 3: [2, 3, 5, 7] };
  const base = pickRandom(basePools[tier]);
  const op = template.data?.op === 'div' ? 'div' : pickRandom(['mul', 'div'] as const);
  let e1: number, e2: number;
  const eRanges = { 1: [2, 3] as const, 2: [2, 5] as const, 3: [3, 8] as const };
  if (op === 'div') {
    e1 = randInt(Math.max(eRanges[tier][0] + 1, 4), eRanges[tier][1] + 1);
    e2 = randInt(eRanges[tier][0], e1 - 1);
  } else {
    e1 = randInt(eRanges[tier][0], eRanges[tier][1]);
    e2 = randInt(eRanges[tier][0], eRanges[tier][1]);
  }
  const ans = op === 'div' ? e1 - e2 : e1 + e2;
  const sym = op === 'div' ? '/' : '\\times';

  const description: BilingualText = {
    zh: `计算 $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^x$，求 $x$。`,
    en: `Calculate $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^x$, find $x$.`,
  };

  const narrator = pickRandom(['曹操', '孙权', '关羽']);
  const tutorialSteps = [
    { text: { zh: `${narrator}：「${base}^{${e1}} ${op === 'div' ? '÷' : '×'} ${base}^{${e2}} = ${base}^x」`, en: `${narrator}: "${base}^{${e1}} ${op === 'div' ? '÷' : '×'} ${base}^{${e2}} = ${base}^x"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「${op === 'div' ? '底数相同，指数相减' : '底数相同，指数相加'}：x = ${e1} ${op === 'div' ? '-' : '+'} ${e2}」`, en: `${narrator}: "${op === 'div' ? 'Same base, subtract exponents' : 'Same base, add exponents'}: x = ${e1} ${op === 'div' ? '-' : '+'} ${e2}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「所以 x = ${ans}！」`, en: `${narrator}: "So x = ${ans}!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, base, e1, e2, op: op === 'div' ? 'div' : undefined, generatorType: 'INDICES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ANGLES generator: supplementary (180) or complementary (90)
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateAnglesMission(template: Mission): Mission {
  const tier = getTier();
  const total = template.data?.total || 180;
  const suppRanges = { 1: [30, 150] as const, 2: [20, 160] as const, 3: [10, 170] as const };
  const compRanges = { 1: [20, 70] as const, 2: [10, 80] as const, 3: [5, 85] as const };
  const range = total === 90 ? compRanges[tier] : suppRanges[tier];
  const angle = randInt(range[0], range[1]);
  const ans = total - angle;
  const kind = total === 90 ? { zh: '余角', en: 'complementary' } : { zh: '补角', en: 'supplementary' };

  const description: BilingualText = {
    zh: `计算${kind.zh}：$${total} - ${angle} = x$。`,
    en: `Calculate ${kind.en} angle: $${total} - ${angle} = x$.`,
  };

  const narrator = pickRandom(['关羽', '赵云', '张飞']);
  const tutorialSteps = [
    { text: { zh: `${narrator}：「已知角 ${angle}°，求${kind.zh}。」`, en: `${narrator}: "Given angle ${angle}°, find ${kind.en}."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「${kind.zh}之和为 ${total}°：x = ${total} − ${angle}」`, en: `${narrator}: "${kind.en} angles sum to ${total}°: x = ${total} − ${angle}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「所以 x = ${ans}°！」`, en: `${narrator}: "So x = ${ans}°!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, angle, total, generatorType: 'ANGLES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ARITHMETIC sequence generator: a_n = a1 + (n-1)d
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateArithmeticMission(template: Mission): Mission {
  const tier = getTier();
  const a1Pools = { 1: [50, 80, 100], 2: [50, 80, 100, 150, 200, 300], 3: [200, 500, 800] };
  const dPools = { 1: [5, 8, 10], 2: [5, 8, 10, 15, 20, 25, 30, 50], 3: [15, 25, 50, 75] };
  const nRanges = { 1: [3, 6] as const, 2: [5, 15] as const, 3: [10, 20] as const };
  const a1 = pickRandom(a1Pools[tier]);
  const d = pickRandom(dPools[tier]);
  const n = randInt(nRanges[tier][0], nRanges[tier][1]);
  const ans = a1 + (n - 1) * d;

  const description: BilingualText = {
    zh: `求第 ${n} 项。$a_n = a_1 + (n-1)d$`,
    en: `Find term ${n}. $a_n = a_1 + (n-1)d$`,
  };

  const narrator = pickRandom(['诸葛亮', '赵云', '曹操']);
  const tutorialSteps = [
    { text: { zh: `${narrator}：「等差数列，首项 ${a1}，公差 ${d}，求第 ${n} 项。」`, en: `${narrator}: "Arithmetic sequence: a1=${a1}, d=${d}, find term ${n}."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「公式：a_n = ${a1} + (${n}-1)×${d}」`, en: `${narrator}: "Formula: a_n = ${a1} + (${n}-1)×${d}"` }, hint: { zh: `${a1} + ${(n - 1) * d} = ?`, en: `${a1} + ${(n - 1) * d} = ?` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「所以 a_${n} = ${ans}！」`, en: `${narrator}: "So a_${n} = ${ans}!"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, a1, d, n, generatorType: 'ARITHMETIC_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA (rectangular) generator
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateAreaRectMission(template: Mission): Mission {
  const tier = getTier();
  const lengthPools = { 1: [5, 8, 10], 2: [8, 10, 15, 20, 25, 30, 35, 40], 3: [20, 35, 50, 80] };
  const widthPools = { 1: [3, 5, 7], 2: [5, 8, 10, 15, 20, 25, 30], 3: [15, 25, 40, 60] };
  const length = tier === 2 ? randInt(8, 40) : pickRandom(lengthPools[tier]);
  const width = tier === 2 ? randInt(5, 30) : pickRandom(widthPools[tier]);
  const narrator = pickRandom(['刘备', '曹操', '孙权']);

  const description: BilingualText = {
    zh: `计算营地面积。`,
    en: `Calculate the camp area.`,
  };

  const area = length * width;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「长方形面积 = 长 × 宽」`, en: `${narrator}: "Rectangle area = length × width"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：「${length} × ${width} = ?」`, en: `${narrator}: "${length} × ${width} = ?"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：「面积 = ${area} 平方丈！」`, en: `${narrator}: "Area = ${area} square units!"` }, highlightField: 'area' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, length, width, generatorType: 'AREA_RECT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA (trapezoid) generator
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateAreaTrapMission(template: Mission): Mission {
  const tier = getTier();
  const aPools = { 1: [3, 5, 8], 2: null, 3: [10, 15, 20] };
  const bOffsets = { 1: [2, 5], 2: null, 3: [5, 15] };
  const hPools = { 1: [3, 5, 7], 2: null, 3: [8, 12, 18] };
  let a = tier === 2 ? randInt(5, 20) : pickRandom(aPools[tier]!);
  let b = tier === 2 ? randInt(a + 2, a + 20) : a + pickRandom(bOffsets[tier]!);
  let h = tier === 2 ? randInt(4, 15) : pickRandom(hPools[tier]!);
  // Ensure (a+b)*h is even so area is integer
  if (((a + b) * h) % 2 !== 0) h += 1;
  const narrator = pickRandom(['赵云', '关羽']);

  const description: BilingualText = {
    zh: `计算梯形面积：$(a+b)h/2$。`,
    en: `Calculate trapezoid area: $(a+b)h/2$.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「梯形面积 = (上底+下底)×高÷2」`, en: `${narrator}: "Trapezoid area = (top+bottom)×height÷2"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：「(${a}+${b})×${h}÷2 = ?」`, en: `${narrator}: "(${a}+${b})×${h}÷2 = ?"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：「面积 = ${(a + b) * h / 2}！」`, en: `${narrator}: "Area = ${(a + b) * h / 2}!"` }, highlightField: 'area' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, a, b, h, generatorType: 'AREA_TRAP_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PROBABILITY (simple) generator: P = target/total
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateProbSimpleMission(template: Mission): Mission {
  const tier = getTier();
  const totalPools = { 1: [10, 12, 20], 2: [20, 30, 36, 40, 50, 52, 60, 80, 100], 3: [60, 80, 100, 200] };
  const targetPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8, 10, 12, 15], 3: [7, 11, 13, 17, 19] };
  const total = pickRandom(totalPools[tier]);
  const target = pickRandom(targetPools[tier]);
  const narrator = '诸葛亮';

  const description: BilingualText = {
    zh: `随机观一象，抽中吉兆的概率是多少？`,
    en: `What is the probability of an auspicious omen?`,
  };

  const p = target / total;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「概率 = 有利结果数 ÷ 总结果数」`, en: `${narrator}: "Probability = favorable ÷ total"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：「P = ${target} ÷ ${total}」`, en: `${narrator}: "P = ${target} ÷ ${total}"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：「P = ${Math.round(p * 10000) / 10000}！」`, en: `${narrator}: "P = ${Math.round(p * 10000) / 10000}!"` }, highlightField: 'p' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, total, target, generatorType: 'PROBABILITY_SIMPLE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PROBABILITY (independent events) generator: P = p1 × p2
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateProbIndMission(template: Mission): Mission {
  const tier = getTier();
  const pPools = { 1: [0.5, 0.5], 2: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8], 3: [0.1, 0.2, 0.3, 0.7, 0.8, 0.9] };
  const p1 = pickRandom(pPools[tier]);
  const p2 = pickRandom(pPools[tier]);
  const narrator = '周瑜';

  const description: BilingualText = {
    zh: `计算独立事件同时发生的概率：$P(A \\cap B) = P(A) \\times P(B)$。`,
    en: `Calculate prob of independent events: $P(A \\cap B) = P(A) \\times P(B)$.`,
  };

  const ans = p1 * p2;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「独立事件同时发生：P = P1 × P2」`, en: `${narrator}: "Independent events: P = P1 × P2"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：「P = ${p1} × ${p2}」`, en: `${narrator}: "P = ${p1} × ${p2}"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：「P = ${Math.round(ans * 100) / 100}！」`, en: `${narrator}: "P = ${Math.round(ans * 100) / 100}!"` }, highlightField: 'p' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, p1, p2, generatorType: 'PROBABILITY_IND_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PYTHAGORAS generator: uses integer triples
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   Template data determines mode: has 'c' → find-leg, has 'b' → find-hypotenuse.
   ══════════════════════════════════════════════════════════ */

const PYTHAGOREAN_TRIPLES: [number, number, number][] = [
  [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
  [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41],
];

const PYTHAGOREAN_TRIPLES_EXTRA: [number, number, number][] = [
  [20, 21, 29], [11, 60, 61],
];

export function generatePythagorasMission(template: Mission): Mission {
  const tier = getTier();
  const triplePools = {
    1: PYTHAGOREAN_TRIPLES.slice(0, 3),
    2: PYTHAGOREAN_TRIPLES,
    3: [...PYTHAGOREAN_TRIPLES, ...PYTHAGOREAN_TRIPLES_EXTRA],
  };
  const [triA, triB, triC] = pickRandom(triplePools[tier]);
  // Template data determines mode: if template has 'c' key, it's find-leg; if 'b' key, find-hypotenuse
  const findC = !('c' in (template.data || {}));
  const narrator = pickRandom(['关羽', '赵云']);

  let description: BilingualText;
  let data: Record<string, unknown>;

  if (findC) {
    description = {
      zh: `求云梯长度 $c = \\sqrt{${triA}^2 + ${triB}^2}$。`,
      en: `Find ladder length $c = \\sqrt{${triA}^2 + ${triB}^2}$.`,
    };
    // Clean slate — don't spread template.data to avoid c leaking from template
    data = { a: triA, b: triB, generatorType: 'PYTHAGORAS_RANDOM' };
  } else {
    description = {
      zh: `求地道深度 $a = \\sqrt{${triC}^2 - ${triB}^2}$。`,
      en: `Find depth $a = \\sqrt{${triC}^2 - ${triB}^2}$.`,
    };
    // Clean slate — only include fields checkCorrectness needs
    data = { a: triB, c: triC, generatorType: 'PYTHAGORAS_RANDOM' };
  }

  const ans = findC ? triC : triA;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「勾股定理：a² + b² = c²」`, en: `${narrator}: "Pythagorean theorem: a² + b² = c²"` }, highlightField: 'c' },
    { text: { zh: findC ? `${narrator}：「c = sqrt(${triA}² + ${triB}²) = sqrt(${triA * triA + triB * triB})」` : `${narrator}：「a = sqrt(${triC}² - ${triB}²) = sqrt(${triC * triC - triB * triB})」`, en: findC ? `${narrator}: "c = sqrt(${triA}² + ${triB}²) = sqrt(${triA * triA + triB * triB})"` : `${narrator}: "a = sqrt(${triC}² - ${triB}²) = sqrt(${triC * triC - triB * triB})"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：「答案 = ${ans}！」`, en: `${narrator}: "Answer = ${ans}!"` }, highlightField: 'c' },
  ];

  return { ...template, description, data, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   PERCENTAGE generator: result = initial × (1+rate)^years
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   Template data.rate sign determines mode: negative → discount, positive → tax.
   ══════════════════════════════════════════════════════════ */

export function generatePercentageMission(template: Mission): Mission {
  const tier = getTier();
  const isDiscount = (template.data?.rate ?? 0) < 0;
  const initialPools = { 1: [100, 200, 500], 2: [200, 500, 800, 1000, 1500, 2000, 3000, 5000], 3: [2000, 5000, 8000] };
  const pctPools = { 1: [10, 20, 50], 2: [10, 15, 20, 25, 30, 40, 50], 3: [12, 15, 18, 22, 35] };
  const initial = pickRandom(initialPools[tier]);
  const pct = pickRandom(pctPools[tier]);
  const rate = isDiscount ? -pct / 100 : pct / 100;
  const result = initial * (1 + rate);
  const narrator = '曹操';

  const description: BilingualText = isDiscount
    ? { zh: `计算折后价：$${initial} \\times (1 - ${pct}\\%)$`, en: `Calculate discounted price: $${initial} \\times (1 - ${pct}\\%)$` }
    : { zh: `计算总额：$${initial} \\times (1 + ${pct}\\%)$`, en: `Calculate total: $${initial} \\times (1 + ${pct}\\%)$` };

  const formulaStr = isDiscount ? `${initial} × (1 - ${pct}%)` : `${initial} × (1 + ${pct}%)`;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「${isDiscount ? '折扣' : '加税'}计算：原价 × (1 ${isDiscount ? '-' : '+'} 百分比)」`, en: `${narrator}: "${isDiscount ? 'Discount' : 'Tax'}: original × (1 ${isDiscount ? '-' : '+'} rate)"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「${formulaStr} = ?」`, en: `${narrator}: "${formulaStr} = ?"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「答案 = ${result}！」`, en: `${narrator}: "Answer = ${result}!"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, initial, pct, rate, years: 1, generatorType: 'PERCENTAGE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   LINEAR generator: y = mx + b from two points
   ══════════════════════════════════════════════════════════ */

export function generateLinearMission(template: Mission): Mission {
  const tier = getTier();
  const mPools = { 1: [1, 2, -1, -2], 2: [1, 2, 3, -1, -2, -3], 3: [-4, -3, -2, 2, 3, 4, 5] };
  const bPools = { 1: [0, 1, 2, 3, -1], 2: [-5, -3, -1, 0, 1, 3, 5], 3: [-8, -5, -3, 3, 5, 7, 10] };
  const m = pickRandom(mPools[tier]);
  const b = pickRandom(bPools[tier]);
  const x1 = pickRandom([-2, -1, 0, 1, 2, 3]);
  const x2 = x1 + pickRandom([1, 2, 3]);
  const y1 = m * x1 + b;
  const y2 = m * x2 + b;

  const narrator = pickRandom(['诸葛亮', '曹操']);
  const description: BilingualText = {
    zh: `求经过 A(${x1}, ${y1}) 和 B(${x2}, ${y2}) 的直线方程 $y = mx + b$。`,
    en: `Find the equation $y = mx + b$ through A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「斜率 m = (y₂-y₁)/(x₂-x₁) = (${y2}-${y1})/(${x2}-${x1})」`, en: `${narrator}: "Slope m = (y₂-y₁)/(x₂-x₁) = (${y2}-${y1})/(${x2}-${x1})"` }, highlightField: 'm' },
    { text: { zh: `${narrator}：「m = ${m}，代入 b = y₁ - mx₁ = ${y1} - ${m}×${x1}」`, en: `${narrator}: "m = ${m}, substitute b = y₁ - mx₁ = ${y1} - ${m}×${x1}"` }, highlightField: 'b' },
    { text: { zh: `${narrator}：「b = ${b}，直线方程 y = ${m}x + ${b}」`, en: `${narrator}: "b = ${b}, line equation y = ${m}x + ${b}"` }, highlightField: 'b' },
  ];

  return {
    ...template,
    description,
    data: { points: [[x1, y1], [x2, y2]], x1, y1, x2, y2, generatorType: 'LINEAR_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SIMULTANEOUS generator: two linear equations
   ══════════════════════════════════════════════════════════ */

export function generateSimultaneousMission(template: Mission): Mission {
  const tier = getTier();
  // Generate solution first, then build equations
  const xyPools = { 1: [-2, -1, 1, 2], 2: [-3, -2, -1, 1, 2, 3, 4, 5], 3: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] };
  const coeffPools = { 1: [1, 2], 2: [1, 2, 3, -1], 3: [1, 2, 3, -1, -2] };
  const x = pickRandom(xyPools[tier]);
  const y = pickRandom(xyPools[tier]);
  const a1 = pickRandom(coeffPools[tier]);
  const b1 = pickRandom(tier === 2 ? [1, 2, -1] : coeffPools[tier]);
  const a2 = pickRandom(tier === 2 ? [1, -1, 2] : coeffPools[tier]);
  const b2 = pickRandom(coeffPools[tier]);
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;

  // Ensure the system has unique solution (det ≠ 0)
  const det = a1 * b2 - a2 * b1;
  if (det === 0) return generateSimultaneousMission(template); // retry

  const narrator = pickRandom(['周瑜', '诸葛亮']);
  const description: BilingualText = {
    zh: `解联立方程：$${a1}x + ${b1}y = ${c1}$，$${a2}x + ${b2}y = ${c2}$`,
    en: `Solve: $${a1}x + ${b1}y = ${c1}$, $${a2}x + ${b2}y = ${c2}$`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「联立方程 ${a1}x+${b1}y=${c1} 和 ${a2}x+${b2}y=${c2}」`, en: `${narrator}: "System: ${a1}x+${b1}y=${c1} and ${a2}x+${b2}y=${c2}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「消元得 x = ${x}」`, en: `${narrator}: "Eliminate to get x = ${x}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「代回得 y = ${y}」`, en: `${narrator}: "Substitute back: y = ${y}"` }, highlightField: 'y' },
  ];

  return {
    ...template,
    description,
    data: { eq1: [a1, b1, c1], eq2: [a2, b2, c2], x, y, generatorType: 'SIMULTANEOUS_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   RATIO generator: a:b = x:y, given one value find the other
   ══════════════════════════════════════════════════════════ */

export function generateRatioMission(template: Mission): Mission {
  const tier = getTier();
  const ratios: [number, number][] = [[2, 3], [2, 5], [3, 4], [3, 5], [3, 7], [4, 5], [1, 3], [1, 4]];
  const [a, b] = pickRandom(ratios);
  const multiplierPools = { 1: [10, 20, 50], 2: [50, 100, 150, 200, 300, 500], 3: [200, 500, 800, 1000] };
  const multiplier = pickRandom(multiplierPools[tier]);

  const narrator = pickRandom(['曹操', '刘备']);
  const description: BilingualText = {
    zh: `比例 $${a}:${b}$，已知前项为 ${a * multiplier}，求后项。`,
    en: `Ratio $${a}:${b}$, first term is ${a * multiplier}, find second term.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「比例 ${a}:${b}，前项 ${a * multiplier}」`, en: `${narrator}: "Ratio ${a}:${b}, first term ${a * multiplier}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「倍率 = ${a * multiplier} ÷ ${a} = ${multiplier}」`, en: `${narrator}: "Multiplier = ${a * multiplier} ÷ ${a} = ${multiplier}"` }, highlightField: 'y' },
    { text: { zh: `${narrator}：「后项 = ${b} × ${multiplier} = ${b * multiplier}」`, en: `${narrator}: "Second term = ${b} × ${multiplier} = ${b * multiplier}"` }, highlightField: 'y' },
  ];

  return {
    ...template,
    description,
    data: { a, b, generatorType: 'RATIO_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SIMILARITY generator: proportional sides
   ══════════════════════════════════════════════════════════ */

export function generateSimilarityMission(template: Mission): Mission {
  const tier = getTier();
  const sidePools = {
    1: { a: [2, 3, 4, 6, 8, 12], b: [4, 6, 8, 12, 16, 24], c: [3, 4, 6, 8, 10, 12] },
    2: { a: [3, 4, 5, 6, 8, 10], b: [6, 8, 10, 12, 15, 20], c: [4, 5, 6, 7, 9, 12] },
    3: { a: [5, 8, 10, 15, 20, 25], b: [10, 16, 20, 30, 40, 50], c: [6, 8, 12, 15, 20, 25] },
  };
  const a = pickRandom(sidePools[tier].a);
  const b = pickRandom(sidePools[tier].b);
  const c = pickRandom(sidePools[tier].c);
  const correctX = (a / b) * c;

  // Ensure clean answer
  if (correctX !== Math.round(correctX * 100) / 100) return generateSimilarityMission(template);

  const narrator = pickRandom(['关羽', '赵云']);
  const description: BilingualText = {
    zh: `相似三角形：边 ${a} 对应边 ${b}，边 ${c} 对应 $x$。`,
    en: `Similar triangles: side ${a} corresponds to ${b}, side ${c} corresponds to $x$.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「相似比 = ${a}/${b}」`, en: `${narrator}: "Similarity ratio = ${a}/${b}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「x = ${c} × ${a}/${b} = ${correctX}」`, en: `${narrator}: "x = ${c} × ${a}/${b} = ${correctX}"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { a, b, c, generatorType: 'SIMILARITY_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   STATISTICS (mean) generator
   ══════════════════════════════════════════════════════════ */

export function generateStatsMeanMission(template: Mission): Mission {
  const tier = getTier();
  const countPools = { 1: [5], 2: [5, 6, 7, 8], 3: [8, 9, 10] };
  const valRanges = { 1: [5, 20] as const, 2: [10, 50] as const, 3: [20, 100] as const };
  const count = pickRandom(countPools[tier]);
  const values = Array.from({ length: count }, () => randInt(valRanges[tier][0], valRanges[tier][1]));
  const sum = values.reduce((s, v) => s + v, 0);
  const mean = sum / count;

  const narrator = pickRandom(['曹操', '诸葛亮']);
  const description: BilingualText = {
    zh: `求数据 ${values.join(', ')} 的平均值。`,
    en: `Find the mean of ${values.join(', ')}.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「平均值 = 总和 ÷ 个数」`, en: `${narrator}: "Mean = sum ÷ count"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「(${values.join('+')}) ÷ ${count} = ${sum} ÷ ${count}」`, en: `${narrator}: "(${values.join('+')}) ÷ ${count} = ${sum} ÷ ${count}"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「平均值 = ${Math.round(mean * 100) / 100}」`, en: `${narrator}: "Mean = ${Math.round(mean * 100) / 100}"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    description,
    data: { values, mode: 'mean', generatorType: 'STATISTICS_MEAN_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   TRIGONOMETRY generator: tan, sin, or tan_inv
   Reads template data.func to decide mode.
   ══════════════════════════════════════════════════════════ */

export function generateTrigonometryMission(template: Mission): Mission {
  const tier = getTier();
  const func = template.data?.func as string | undefined;
  const narrator = pickRandom(['甘宁', '乐进', '赵云']);

  if (func === 'sin') {
    // sin mode: opposite / sin(angle) = hypotenuse → input c
    const angle = pickRandom([30, 45, 60]);
    const sinVal = angle === 30 ? 0.5 : angle === 45 ? Math.SQRT2 / 2 : Math.sqrt(3) / 2;
    // Pick opposite so hyp is clean-ish
    const oppPoolsTier = {
      1: angle === 30 ? [3, 4, 5, 6] : [3, 4, 5, 6],
      2: angle === 30 ? [3, 4, 5, 6, 8, 10, 50] : [3, 4, 5, 6, 8, 10],
      3: [8, 10, 12, 15, 20],
    };
    const opposite = pickRandom(oppPoolsTier[tier]);
    const hyp = opposite / sinVal;

    const description: BilingualText = {
      zh: `已知角 $${angle}^\\circ$，对边 ${opposite}，求斜边 $c$。`,
      en: `Given angle $${angle}^\\circ$, opposite ${opposite}, find hypotenuse $c$.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「$\\sin(${angle}^\\circ)$ 联系对边和斜边」`, en: `${narrator}: "$\\sin(${angle}^\\circ)$ connects opposite and hypotenuse"` }, highlightField: 'c' },
      { text: { zh: `${narrator}：「$c = ${opposite} / \\sin(${angle}^\\circ) = ${opposite} / ${Math.round(sinVal * 10000) / 10000}$」`, en: `${narrator}: "$c = ${opposite} / \\sin(${angle}^\\circ) = ${opposite} / ${Math.round(sinVal * 10000) / 10000}$"` }, highlightField: 'c' },
      { text: { zh: `${narrator}：「$c = ${Math.round(hyp * 10000) / 10000}$！」`, en: `${narrator}: "$c = ${Math.round(hyp * 10000) / 10000}$!"` }, highlightField: 'c' },
    ];
    return { ...template, description, data: { angle, opposite, func: 'sin', generatorType: 'TRIGONOMETRY_RANDOM' }, tutorialSteps };
  }

  if (func === 'tan_inv') {
    // tan_inv mode: atan2(opposite, adjacent) → input angle
    const pairs: [number, number][] = [[1, 1], [3, 3], [5, 5], [10, 10], [30, 30], [100, 100],
      [1, Math.round(Math.tan(Math.PI / 6) * 1000) / 1000 > 0 ? 1 : 1], // fallback
    ];
    // Use known-angle combos for clean results
    const knownAngles: { opp: number; adj: number; angle: number }[] = [
      { opp: 1, adj: 1, angle: 45 }, { opp: 3, adj: 3, angle: 45 }, { opp: 5, adj: 5, angle: 45 },
      { opp: 8, adj: 8, angle: 45 }, { opp: 10, adj: 10, angle: 45 }, { opp: 15, adj: 15, angle: 45 },
      { opp: 20, adj: 20, angle: 45 }, { opp: 50, adj: 50, angle: 45 }, { opp: 100, adj: 100, angle: 45 },
    ];
    const chosen = pickRandom(knownAngles);

    const description: BilingualText = {
      zh: `已知对边 ${chosen.opp}，邻边 ${chosen.adj}，求角度 $\\theta$。`,
      en: `Given opposite ${chosen.opp}, adjacent ${chosen.adj}, find angle $\\theta$.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「$\\tan(\\theta) = ${chosen.opp}/${chosen.adj}$」`, en: `${narrator}: "$\\tan(\\theta) = ${chosen.opp}/${chosen.adj}$"` }, highlightField: 'angle' },
      { text: { zh: `${narrator}：「$\\theta = \\arctan(${chosen.opp / chosen.adj})$」`, en: `${narrator}: "$\\theta = \\arctan(${chosen.opp / chosen.adj})$"` }, highlightField: 'angle' },
      { text: { zh: `${narrator}：「$\\theta = ${chosen.angle}^\\circ$！」`, en: `${narrator}: "$\\theta = ${chosen.angle}^\\circ$!"` }, highlightField: 'angle' },
    ];
    return { ...template, description, data: { opposite: chosen.opp, adjacent: chosen.adj, func: 'tan_inv', generatorType: 'TRIGONOMETRY_RANDOM' }, tutorialSteps };
  }

  // Default: tan mode — opposite / adjacent → input tan
  const tanOppPools = { 1: [3, 4, 5, 6], 2: [3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20], 3: [8, 10, 12, 15, 20] };
  const tanAdjPools = { 1: [4, 5, 8, 10], 2: [4, 5, 8, 10, 12, 15, 16, 20, 25], 3: [5, 8, 10, 12, 15, 20, 25] };
  const opposite = pickRandom(tanOppPools[tier]);
  const adjacent = pickRandom(tanAdjPools[tier]);
  const tanVal = opposite / adjacent;

  const description: BilingualText = {
    zh: `求正切值 $\\tan(\\theta) = ${opposite} / ${adjacent}$。`,
    en: `Find $\\tan(\\theta) = ${opposite} / ${adjacent}$.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「$\\tan(\\theta) = \\text{对边}/\\text{邻边}$」`, en: `${narrator}: "$\\tan(\\theta) = \\text{opposite}/\\text{adjacent}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：「$= ${opposite} / ${adjacent}$」`, en: `${narrator}: "$= ${opposite} / ${adjacent}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：「$\\tan(\\theta) = ${Math.round(tanVal * 10000) / 10000}$！」`, en: `${narrator}: "$\\tan(\\theta) = ${Math.round(tanVal * 10000) / 10000}$!"` }, highlightField: 'tan' },
  ];
  return { ...template, description, data: { opposite, adjacent, generatorType: 'TRIGONOMETRY_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   QUADRATIC generator: y = ax² + c from two points
   topic==='Calculus' → student finds x = p2[0] (vertex x)
   otherwise → student finds a and c
   ══════════════════════════════════════════════════════════ */

export function generateQuadraticMission(template: Mission): Mission {
  const tier = getTier();
  const isCal = template.topic === 'Calculus';
  const narrator = pickRandom(['周瑜', '诸葛亮']);

  if (isCal) {
    // Calculus mode: f(x) = ax² + bx, vertex at x = -b/(2a). Student enters x = p2[0].
    const calAPools = { 1: [-1], 2: [-3, -2, -1], 3: [-3, -2, -1] };
    const calBPools = { 1: [4, 6], 2: [4, 6, 8, 10, 12], 3: [4, 6, 8, 10, 12] };
    const a = pickRandom(calAPools[tier]);
    const b = pickRandom(calBPools[tier]);
    const vertexX = -b / (2 * a);
    // Ensure clean integer
    if (vertexX !== Math.round(vertexX)) return generateQuadraticMission(template);
    const vertexY = a * vertexX * vertexX + b * vertexX;

    const description: BilingualText = {
      zh: `求 $f(x)$ 达到最大值时的 $x$。`,
      en: `Find $x$ where $f(x)$ is maximum.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「二次函数 $f(x) = ${a}x^2 + ${b}x$，顶点公式 $x = -b/(2a)$。」`, en: `${narrator}: "Quadratic $f(x) = ${a}x^2 + ${b}x$, vertex at $x = -b/(2a)$."` }, highlightField: 'x' },
      { text: { zh: `${narrator}：「$x = -${b}/(2 \\times ${a}) = ${vertexX}$」`, en: `${narrator}: "$x = -${b}/(2 \\times ${a}) = ${vertexX}$"` }, highlightField: 'x' },
      { text: { zh: `${narrator}：「$x = ${vertexX}$！最优解！」`, en: `${narrator}: "$x = ${vertexX}$! Optimal!"` }, highlightField: 'x' },
    ];
    return { ...template, description, data: { p1: [0, 0], p2: [vertexX, vertexY], generatorType: 'QUADRATIC_RANDOM' }, tutorialSteps };
  }

  // Functions mode: y = ax² + c, p1=[0,c], p2=[x2, a*x2²+c]. Student finds a and c.
  const funcAPools = { 1: [-1, 1], 2: [-3, -2, -1, 1, 2, 3], 3: [-3, -2, 2, 3, 4] };
  const funcCPools = { 1: [0, 1, 2], 2: [-5, -3, 0, 3, 5, 10], 3: [-10, -5, 5, 10] };
  const a = pickRandom(funcAPools[tier]);
  const c = pickRandom(funcCPools[tier]);
  const x2 = pickRandom([1, 2, 3, 4, 5]);
  const y2 = a * x2 * x2 + c;

  const description: BilingualText = {
    zh: `求抛物线 $y = ax^2 + c$ 的系数 $a$ 和 $c$。`,
    en: `Find coefficients $a$ and $c$ of $y = ax^2 + c$.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「过 $(0, ${c})$ 和 $(${x2}, ${y2})$，$y = ax^2 + c$。」`, en: `${narrator}: "Through $(0, ${c})$ and $(${x2}, ${y2})$, $y = ax^2 + c$."` }, highlightField: 'a' },
    { text: { zh: `${narrator}：「$x=0$ 时 $y=c=${c}$。代入第二点：$a = (${y2}-${c})/${x2}^2 = ${a}$」`, en: `${narrator}: "At $x=0$, $y=c=${c}$. Substitute: $a = (${y2}-${c})/${x2}^2 = ${a}$"` }, highlightField: 'a' },
    { text: { zh: `${narrator}：「$a=${a}, c=${c}$！」`, en: `${narrator}: "$a=${a}, c=${c}$!"` }, highlightField: 'c' },
  ];
  return { ...template, description, data: { p1: [0, c], p2: [x2, y2], generatorType: 'QUADRATIC_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   ROOTS generator: ax² + bx + c = 0 from factored form
   Student enters either root x
   ══════════════════════════════════════════════════════════ */

export function generateRootsMission(template: Mission): Mission {
  const tier = getTier();
  const rootPools = { 1: [-3, -2, -1, 1, 2, 3], 2: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 3: [-8, -5, -3, 3, 5, 7, 8] };
  const r1 = pickRandom(rootPools[tier]);
  let r2 = pickRandom(rootPools[tier]);
  // Avoid r1 === r2 for variety (but it's not wrong)
  if (r1 === r2) r2 = r1 + pickRandom([1, 2, -1, -2]);
  // a=1: (x - r1)(x - r2) = x² - (r1+r2)x + r1*r2
  const a = 1;
  const b = -(r1 + r2);
  const c = r1 * r2;
  // Verify discriminant >= 0 (always true for real roots from factored form)
  const narrator = pickRandom(['周瑜', '曹仁', '诸葛亮']);

  const description: BilingualText = {
    zh: `求方程 $x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0$ 的一个根。`,
    en: `Find a root of $x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0$.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「$x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0$」`, en: `${narrator}: "$x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「因式分解：$(x ${r1 >= 0 ? '-' : '+'}${Math.abs(r1)})(x ${r2 >= 0 ? '-' : '+'}${Math.abs(r2)}) = 0$」`, en: `${narrator}: "Factor: $(x ${r1 >= 0 ? '-' : '+'}${Math.abs(r1)})(x ${r2 >= 0 ? '-' : '+'}${Math.abs(r2)}) = 0$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「$x = ${r1}$ 或 $x = ${r2}$！」`, en: `${narrator}: "$x = ${r1}$ or $x = ${r2}$!"` }, highlightField: 'x' },
  ];
  return { ...template, description, data: { a, b, c, generatorType: 'ROOTS_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   DERIVATIVE generator
   func='3x^2-3': critical point → input x (data.x)
   default (x^2): slope at point → input k = 2*data.x
   ══════════════════════════════════════════════════════════ */

export function generateDerivativeMission(template: Mission): Mission {
  const tier = getTier();
  const func = template.data?.func as string | undefined;
  const narrator = pickRandom(['姜维', '诸葛亮', '刘禅']);

  if (func === '3x^2-3') {
    // f(x) = x³ - 3x → f'(x) = 3x² - 3 = 0 → x² = 1 → x = 1 (x>0)
    // Always x=1 for this function form (critical point at x=1)
    const x = 1;
    const description: BilingualText = {
      zh: `求 $f'(x) = 3x^2 - 3 = 0$ 的正根 $x$。`,
      en: `Find positive root $x$ of $f'(x) = 3x^2 - 3 = 0$.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「$f'(x) = 3x^2 - 3 = 0$」`, en: `${narrator}: "$f'(x) = 3x^2 - 3 = 0$"` }, highlightField: 'x' },
      { text: { zh: `${narrator}：「$3x^2 = 3 \\Rightarrow x^2 = 1$」`, en: `${narrator}: "$3x^2 = 3 \\Rightarrow x^2 = 1$"` }, highlightField: 'x' },
      { text: { zh: `${narrator}：「$x = ${x}$（取正值）！」`, en: `${narrator}: "$x = ${x}$ (positive)!"` }, highlightField: 'x' },
    ];
    return { ...template, description, data: { x, func: '3x^2-3', generatorType: 'DERIVATIVE_RANDOM' }, tutorialSteps };
  }

  // Default: y = x², slope k = 2x at point x
  const xPools = { 1: [1, 2, 3], 2: [1, 2, 3, 4, 5, -1, -2, -3], 3: [-5, -3, 3, 5, 7, 8] };
  const x = pickRandom(xPools[tier]);
  const k = 2 * x;
  const y = x * x;

  const description: BilingualText = {
    zh: `求 $y = x^2$ 在 $x = ${x}$ 处的切线斜率 $k$。`,
    en: `Find tangent slope $k$ of $y = x^2$ at $x = ${x}$.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「$y = x^2$，导数 $y' = 2x$」`, en: `${narrator}: "$y = x^2$, derivative $y' = 2x$"` }, highlightField: 'k' },
    { text: { zh: `${narrator}：「在 $x=${x}$ 处：$k = 2 \\times ${x}$」`, en: `${narrator}: "At $x=${x}$: $k = 2 \\times ${x}$"` }, highlightField: 'k' },
    { text: { zh: `${narrator}：「$k = ${k}$！」`, en: `${narrator}: "$k = ${k}$!"` }, highlightField: 'k' },
  ];
  return { ...template, description, data: { x, func: 'x^2', generatorType: 'DERIVATIVE_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   INTEGRATION generator: definite integral
   func='x': ∫ x dx = 0.5*(u²-l²)
   func='3x^2': ∫ 3x² dx = u³-l³
   else: ∫ 2x dx = u²-l²
   ══════════════════════════════════════════════════════════ */

export function generateIntegrationMission(template: Mission): Mission {
  const tier = getTier();
  const func = template.data?.func as string;
  const narrator = pickRandom(['邓艾', '钟会', '诸葛亮']);

  const lowerPools = { 1: [0, 1], 2: [0, 1, 2], 3: [0, 2] };
  const upperOffsets = { 1: [2, 3], 2: [2, 3, 4, 5], 3: [5, 6, 8] };

  if (func === 'x') {
    const lower = pickRandom(lowerPools[tier]);
    const upper = lower + pickRandom(upperOffsets[tier]);
    const area = 0.5 * (upper * upper - lower * lower);

    const description: BilingualText = {
      zh: `求 $\\int_{${lower}}^{${upper}} x\\,dx$。`,
      en: `Find $\\int_{${lower}}^{${upper}} x\\,dx$.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「$\\int x\\,dx = \\frac{1}{2}x^2$」`, en: `${narrator}: "$\\int x\\,dx = \\frac{1}{2}x^2$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：「$= \\frac{1}{2}(${upper}^2 - ${lower}^2) = \\frac{1}{2}(${upper * upper} - ${lower * lower})$」`, en: `${narrator}: "$= \\frac{1}{2}(${upper}^2 - ${lower}^2) = \\frac{1}{2}(${upper * upper} - ${lower * lower})$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：「面积 = ${area}！」`, en: `${narrator}: "Area = ${area}!"` }, highlightField: 'area' },
    ];
    return { ...template, description, data: { lower, upper, func: 'x', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
  }

  if (func === '3x^2') {
    const lower = pickRandom(tier === 3 ? [0, 1, 2] : [0, 1]);
    const upper = lower + pickRandom(tier === 1 ? [1, 2] : tier === 2 ? [1, 2, 3] : [2, 3, 4]);
    const area = upper * upper * upper - lower * lower * lower;

    const description: BilingualText = {
      zh: `求 $\\int_{${lower}}^{${upper}} 3x^2\\,dx$。`,
      en: `Find $\\int_{${lower}}^{${upper}} 3x^2\\,dx$.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「$\\int 3x^2\\,dx = x^3$」`, en: `${narrator}: "$\\int 3x^2\\,dx = x^3$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：「$= ${upper}^3 - ${lower}^3 = ${upper * upper * upper} - ${lower * lower * lower}$」`, en: `${narrator}: "$= ${upper}^3 - ${lower}^3 = ${upper * upper * upper} - ${lower * lower * lower}$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：「面积 = ${area}！」`, en: `${narrator}: "Area = ${area}!"` }, highlightField: 'area' },
    ];
    return { ...template, description, data: { lower, upper, func: '3x^2', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
  }

  // else: ∫ 2x dx = u² - l²
  const lower = pickRandom(lowerPools[tier]);
  const upper = lower + pickRandom(tier === 1 ? [2, 3] : tier === 2 ? [2, 3, 4] : [3, 4, 6]);
  const area = upper * upper - lower * lower;

  const description: BilingualText = {
    zh: `求 $\\int_{${lower}}^{${upper}} 2x\\,dx$。`,
    en: `Find $\\int_{${lower}}^{${upper}} 2x\\,dx$.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「$\\int 2x\\,dx = x^2$」`, en: `${narrator}: "$\\int 2x\\,dx = x^2$"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：「$= ${upper}^2 - ${lower}^2 = ${upper * upper} - ${lower * lower}$」`, en: `${narrator}: "$= ${upper}^2 - ${lower}^2 = ${upper * upper} - ${lower * lower}$"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：「面积 = ${area}！」`, en: `${narrator}: "Area = ${area}!"` }, highlightField: 'area' },
  ];
  return { ...template, description, data: { lower, upper, func: '2x', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   VOLUME generator: cylinder V = pi*r²*h (or cone V = 1/3*pi*r²*h)
   ══════════════════════════════════════════════════════════ */

export function generateVolumeMission(template: Mission): Mission {
  const tier = getTier();
  const mode = template.data?.mode as string | undefined;
  const isCone = mode === 'cone';
  const radiusPools = { 1: [2, 3, 4], 2: [2, 3, 4, 5, 6, 8, 10], 3: [6, 8, 10, 12] };
  const heightPools = { 1: [3, 5, 6], 2: [5, 6, 8, 10, 12, 15, 20], 3: [10, 15, 20, 25] };
  const radius = pickRandom(radiusPools[tier]);
  const height = pickRandom(heightPools[tier]);
  const pi = template.data?.pi || 3;
  const vol = isCone ? (1 / 3) * pi * radius * radius * height : pi * radius * radius * height;
  const narrator = pickRandom(['满宠', '曹操', '刘备']);

  const description: BilingualText = isCone
    ? { zh: `求圆锥体积 $V = \\frac{1}{3}\\pi r^2 h$（$\\pi=${pi}$）。`, en: `Find cone volume $V = \\frac{1}{3}\\pi r^2 h$ ($\\pi=${pi}$).` }
    : { zh: `求圆柱体积 $V = \\pi r^2 h$（$\\pi=${pi}$）。`, en: `Find cylinder volume $V = \\pi r^2 h$ ($\\pi=${pi}$).` };

  const baseArea = pi * radius * radius;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「半径 ${radius}，高 ${height}，$\\pi=${pi}$」`, en: `${narrator}: "Radius ${radius}, height ${height}, $\\pi=${pi}$"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：「底面积 = $\\pi r^2 = ${pi} \\times ${radius}^2 = ${baseArea}$」`, en: `${narrator}: "Base area = $\\pi r^2 = ${pi} \\times ${radius}^2 = ${baseArea}$"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：「$V = ${Math.round(vol * 100) / 100}$！」`, en: `${narrator}: "$V = ${Math.round(vol * 100) / 100}$!"` }, highlightField: 'v' },
  ];

  return {
    ...template,
    description,
    data: { radius, height, pi, ...(isCone ? { mode: 'cone' } : {}), generatorType: 'VOLUME_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FUNC_VAL generator
   If m defined: y = mx + b, input y
   Else: vertex t = -b/(2a), input t
   ══════════════════════════════════════════════════════════ */

export function generateFuncValMission(template: Mission): Mission {
  const tier = getTier();
  const hasM = template.data?.m !== undefined;
  const narrator = pickRandom(['夏侯惇', '曹操', '赵云']);

  if (hasM) {
    const mPools = { 1: [1, 2], 2: [1, 2, 3, -1, -2], 3: [-3, -2, 3, 4] };
    const bPools = { 1: [0, 1, 2], 2: [-5, -3, -1, 0, 1, 2, 4, 5, 8], 3: [-8, -5, 5, 8] };
    const xPools = { 1: [1, 2, 3], 2: [1, 2, 3, 4, 5, -1, -2], 3: [-3, -2, 4, 5] };
    const m = pickRandom(mPools[tier]);
    const b = pickRandom(bPools[tier]);
    const x = pickRandom(xPools[tier]);
    const y = m * x + b;

    const description: BilingualText = {
      zh: `求 $y = ${m}x ${b >= 0 ? '+' : ''}${b}$ 在 $x=${x}$ 处的值。`,
      en: `Find $y = ${m}x ${b >= 0 ? '+' : ''}${b}$ at $x=${x}$.`,
    };
    const tutorialSteps = [
      { text: { zh: `${narrator}：「$y = ${m}x ${b >= 0 ? '+' : ''}${b}$，代入 $x=${x}$」`, en: `${narrator}: "$y = ${m}x ${b >= 0 ? '+' : ''}${b}$, substitute $x=${x}$"` }, highlightField: 'y' },
      { text: { zh: `${narrator}：「$y = ${m} \\times ${x} ${b >= 0 ? '+' : ''}${b} = ${m * x} ${b >= 0 ? '+' : ''}${b}$」`, en: `${narrator}: "$y = ${m} \\times ${x} ${b >= 0 ? '+' : ''}${b} = ${m * x} ${b >= 0 ? '+' : ''}${b}$"` }, highlightField: 'y' },
      { text: { zh: `${narrator}：「$y = ${y}$！」`, en: `${narrator}: "$y = ${y}$!"` }, highlightField: 'y' },
    ];
    return { ...template, description, data: { m, b, x, generatorType: 'FUNC_VAL_RANDOM' }, tutorialSteps };
  }

  // Vertex form: t = -b/(2a)
  const a = pickRandom([-3, -2, -1, 1, 2, 3]);
  const bCoeff = pickRandom([2, 4, 6, 8, 10, 12, -2, -4, -6]);
  const t = -bCoeff / (2 * a);
  if (t !== Math.round(t * 100) / 100) return generateFuncValMission(template);

  const description: BilingualText = {
    zh: `求 $f(x) = ${a}x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x$ 的顶点 $t$。`,
    en: `Find vertex $t$ of $f(x) = ${a}x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x$.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「$t = -b/(2a) = -${bCoeff}/(2 \\times ${a})$」`, en: `${narrator}: "$t = -b/(2a) = -${bCoeff}/(2 \\times ${a})$"` }, highlightField: 't' },
    { text: { zh: `${narrator}：「$t = ${t}$！」`, en: `${narrator}: "$t = ${t}$!"` }, highlightField: 't' },
  ];
  return { ...template, description, data: { a, b: bCoeff, generatorType: 'FUNC_VAL_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   STATISTICS MEDIAN generator
   ══════════════════════════════════════════════════════════ */

export function generateStatsMedianMission(template: Mission): Mission {
  const tier = getTier();
  const countPools = { 1: [5], 2: [5, 7], 3: [7, 9] };
  const ranges = { 1: [1.5, 0.4] as const, 2: [1.5, 0.6] as const, 3: [1.4, 0.7] as const };
  const count = pickRandom(countPools[tier]);
  const values = Array.from({ length: count }, () => {
    // Heights in a tier-dependent range (one decimal)
    return Math.round((ranges[tier][0] + Math.random() * ranges[tier][1]) * 10) / 10;
  });
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted[mid]; // odd count, so exact middle

  const narrator = pickRandom(['典韦', '曹操']);
  const description: BilingualText = {
    zh: `求数据 ${sorted.join(', ')} 的中位数。`,
    en: `Find the median of ${sorted.join(', ')}.`,
  };
  const tutorialSteps = [
    { text: { zh: `${narrator}：「先排序，再找中间值。${count} 个数，中间是第 ${mid + 1} 个。」`, en: `${narrator}: "Sort first, find middle. ${count} numbers, middle is position ${mid + 1}."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「排序后：${sorted.join(', ')}」`, en: `${narrator}: "Sorted: ${sorted.join(', ')}"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「中位数 = ${median}！」`, en: `${narrator}: "Median = ${median}!"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    description,
    data: { values: sorted, mode: 'median', generatorType: 'STATISTICS_MEDIAN_RANDOM' },
    tutorialSteps,
  };
}
