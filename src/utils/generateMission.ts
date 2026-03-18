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
  | 'STATISTICS_MEDIAN_RANDOM'
  | 'HCF_RANDOM'
  | 'LCM_RANDOM'
  | 'INTEGER_ADD_RANDOM'
  | 'FRAC_ADD_RANDOM'
  | 'FRAC_MUL_RANDOM'
  | 'FACTOR_TREE_RANDOM'
  | 'PRIME_RANDOM';

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
  FACTOR_TREE_RANDOM: generateFactorTreeMission,
  PRIME_RANDOM: generatePrimeMission,
  HCF_RANDOM: generateHcfMission,
  LCM_RANDOM: generateLcmMission,
  INTEGER_ADD_RANDOM: generateIntegerAddMission,
  FRAC_ADD_RANDOM: generateFracAddMission,
  FRAC_MUL_RANDOM: generateFracMulMission,
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

  const tutorialEquationSteps = [
    { tex: `${a}x = ${result}`, annotation: { zh: '原方程', en: 'Original equation' } },
    { tex: `\\frac{${a}x}{${a}} = \\frac{${result}}{${a}}`, annotation: { zh: `两边÷${a}`, en: `÷${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  return {
    ...template,
    // title: preserved (never replaced)
    // story: preserved (template with {a}, {result} — interpolated at render)
    // description: preserved (template — interpolated at render)
    data: { ...template.data, x, a, result, left: `${a}x`, right: `${result}`, generatorType: 'SIMPLE_EQ_RANDOM', tutorialEquationSteps },
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

  const tutorialEquationSteps = [
    { tex: `x + ${a} = ${result}`, annotation: { zh: '原方程', en: 'Original equation' } },
    { tex: `x + ${a} - ${a} = ${result} - ${a}`, annotation: { zh: `两边-${a}`, en: `-${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  return {
    ...template,
    data: { ...template.data, x, a, result, left: `x+${a}`, right: `${result}`, generatorType: 'SIMPLE_EQ_ADD_RANDOM', tutorialEquationSteps },
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
  // Follow template: if template has op='div', stay div; otherwise stay mul
  // Don't randomize op — it must match the story context
  const op = template.data?.op === 'div' ? 'div' : 'mul';
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
  const sym = op === 'div' ? '\\div' : '\\times';

  const description: BilingualText = {
    zh: `计算 $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^x$，求 $x$。`,
    en: `Calculate $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^x$, find $x$.`,
  };

  const narrator = pickRandom(['曹操', '孙权', '关羽']);
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：什么是指数(index/power)?\n$2^{3}$ 表示 $2 \\times 2 \\times 2 = 8$\n右上角的小数字告诉你要乘多少次。`,
        en: `${narrator}: "What is an index (power)?\n$2^{3}$ means $2 \\times 2 \\times 2 = 8$\nThe small number on top tells you how many times to multiply."`,
      },
      hint: {
        zh: '底数(base)是被乘的数\n指数(index)是乘的次数',
        en: 'The base is the number being multiplied\nThe index (power) is how many times',
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：看这道题：$${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^{x}$\n底数是 $${base}$，两个指数分别是 $${e1}$ 和 $${e2}$。`,
        en: `${narrator}: "Look at this expression: $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^{x}$\nThe base is $${base}$, and the two powers are $${e1}$ and $${e2}$."`,
      },
      highlightField: 'x',
    },
    {
      text: op === 'div' ? {
        zh: `${narrator}：指数除法法则：$a^{m} \\div a^{n} = a^{m-n}$\n底数不变，指数相减。`,
        en: `${narrator}: "Index law for division: $a^{m} \\div a^{n} = a^{m-n}$\nThe base stays the same, subtract the powers."`,
      } : {
        zh: `${narrator}：指数乘法法则：$a^{m} \\times a^{n} = a^{m+n}$\n底数不变，指数相加。`,
        en: `${narrator}: "Index law for multiplication: $a^{m} \\times a^{n} = a^{m+n}$\nThe base stays the same, add the powers."`,
      },
      hint: op === 'div' ? {
        zh: '底数相同时，除法就是把指数减掉',
        en: 'When the bases are the same, division means subtract the powers',
      } : {
        zh: '底数相同时，乘法就是把指数加起来',
        en: 'When the bases are the same, multiplication means add the powers',
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：代入数值：$x = ${e1} ${op === 'div' ? '-' : '+'} ${e2}$`,
        en: `${narrator}: "Substitute the numbers: $x = ${e1} ${op === 'div' ? '-' : '+'} ${e2}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：计算：$${e1} ${op === 'div' ? '-' : '+'} ${e2} = ${ans}$`,
        en: `${narrator}: "Calculate: $${e1} ${op === 'div' ? '-' : '+'} ${e2} = ${ans}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：答案：$x = ${ans}$`,
        en: `${narrator}: "Answer: $x = ${ans}$"`,
      },
      highlightField: 'x',
    },
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

  return {
    ...template,
    description,
    data: { ...template.data, angle, total, ans, generatorType: 'ANGLES_RANDOM' },
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
    { text: { zh: `${narrator}：等差数列，首项 ${a1}，公差 ${d}，求第 ${n} 项。`, en: `${narrator}: "Arithmetic sequence: a1=${a1}, d=${d}, find term ${n}."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：公式：a_n = ${a1} + (${n}-1)×${d}`, en: `${narrator}: "Formula: a_n = ${a1} + (${n}-1)×${d}"` }, hint: { zh: `${a1} + ${(n - 1) * d} = ?`, en: `${a1} + ${(n - 1) * d} = ?` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：所以 a_${n} = ${ans}！`, en: `${narrator}: "So a_${n} = ${ans}!"` }, highlightField: 'ans' },
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
    {
      text: {
        zh: `${narrator}：什么是面积?\n面积是一个形状里面的空间大小，用平方单位来量。`,
        en: `${narrator}: "What is area?\nArea is the space inside a shape, measured in square units."`,
      },
      hint: {
        zh: '想象用小方块铺满这个形状，数一数有多少个',
        en: 'Imagine filling the shape with small squares and counting them',
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：长方形的面积公式：$\\text{Area} = \\text{length} \\times \\text{width}$`,
        en: `${narrator}: "Rectangle area formula: $\\text{Area} = \\text{length} \\times \\text{width}$"`,
      },
      hint: {
        zh: '数一数里面能放多少个单位正方形',
        en: 'Count how many unit squares fit inside',
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：代入数值：$\\text{Area} = ${length} \\times ${width}$`,
        en: `${narrator}: "Substitute: $\\text{Area} = ${length} \\times ${width}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：计算：$${length} \\times ${width} = ${area}$`,
        en: `${narrator}: "Calculate: $${length} \\times ${width} = ${area}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案：面积 = $${area}$ 平方单位`,
        en: `${narrator}: "Answer: Area = $${area}$ square units"`,
      },
      highlightField: 'area',
    },
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

  const sumAB = a + b;
  const areaVal = (a + b) * h / 2;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：什么是梯形?\n梯形有一对平行的边(上底和下底)，另外两条边不平行。`,
        en: `${narrator}: "What is a trapezoid?\nA shape with one pair of parallel sides (top and bottom). The other two sides are not parallel."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：梯形面积公式：$\\text{Area} = \\frac{(a + b) \\times h}{2}$`,
        en: `${narrator}: "Trapezoid area formula: $\\text{Area} = \\frac{(a + b) \\times h}{2}$"`,
      },
      hint: {
        zh: '把两条平行边加起来，乘以高，再除以2',
        en: 'Add the two parallel sides, multiply by height, then halve',
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：找出已知量：\n上底 $a = ${a}$，下底 $b = ${b}$，高 $h = ${h}$`,
        en: `${narrator}: "Identify the values:\nTop $a = ${a}$, Bottom $b = ${b}$, Height $h = ${h}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：先把两条平行边加起来：$${a} + ${b} = ${sumAB}$`,
        en: `${narrator}: "First add the two parallel sides: $${a} + ${b} = ${sumAB}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：乘以高，再除以2：$\\frac{${sumAB} \\times ${h}}{2} = \\frac{${sumAB * h}}{2} = ${areaVal}$`,
        en: `${narrator}: "Multiply by height, then divide by 2: $\\frac{${sumAB} \\times ${h}}{2} = \\frac{${sumAB * h}}{2} = ${areaVal}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案：面积 = $${areaVal}$`,
        en: `${narrator}: "Answer: Area = $${areaVal}$"`,
      },
      highlightField: 'area',
    },
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
    { text: { zh: `${narrator}：概率 = 有利结果数 ÷ 总结果数`, en: `${narrator}: "Probability = favorable ÷ total"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：P = ${target} ÷ ${total}`, en: `${narrator}: "P = ${target} ÷ ${total}"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：P = ${Math.round(p * 10000) / 10000}！`, en: `${narrator}: "P = ${Math.round(p * 10000) / 10000}!"` }, highlightField: 'p' },
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
    { text: { zh: `${narrator}：什么是概率?\n概率是一个 0 到 1 之间的数，表示事件发生的可能性。\n$0$ = 不可能，$1$ = 一定发生。`, en: `${narrator}: "What is probability?\nA number from 0 to 1 that tells us how likely something is.\n$0$ = impossible, $1$ = certain."` }, highlightField: 'p' },
    { text: { zh: `${narrator}：什么是独立事件?\n两个事件互不影响，一个发生不会改变另一个的概率。\n例如：抛两次硬币，第一次不影响第二次。`, en: `${narrator}: "What are independent events?\nTwo events where one happening does not affect the other.\nExample: flipping a coin twice — the first flip does not affect the second."` }, highlightField: 'p' },
    { text: { zh: `${narrator}：已知条件：\n第一个事件的概率 $P_1 = ${p1}$\n第二个事件的概率 $P_2 = ${p2}$`, en: `${narrator}: "Given:\nFirst event probability $P_1 = ${p1}$\nSecond event probability $P_2 = ${p2}$"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：独立事件的乘法法则：\n两个独立事件同时发生的概率 = 各自概率相乘\n$P(\\text{both}) = P_1 \\times P_2$`, en: `${narrator}: "Rule for independent events:\nMultiply the probabilities\n$P(\\text{both}) = P_1 \\times P_2$"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：计算：\n$P = ${p1} \\times ${p2} = ${Math.round(ans * 100) / 100}$\n答案是 $${Math.round(ans * 100) / 100}$!`, en: `${narrator}: "Calculate:\n$P = ${p1} \\times ${p2} = ${Math.round(ans * 100) / 100}$\nThe answer is $${Math.round(ans * 100) / 100}$!"` }, highlightField: 'p' },
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
  const tutorialSteps = findC ? [
    { text: { zh: `${narrator}：什么是勾股定理?\n在直角三角形中，$a^{2} + b^{2} = c^{2}$\n其中 $c$ 是最长的边，叫做斜边(hypotenuse)。`, en: `${narrator}: "What is the Pythagorean theorem?\nIn a right triangle, $a^{2} + b^{2} = c^{2}$\nwhere $c$ is the longest side, called the hypotenuse."` }, highlightField: 'c' },
    { text: { zh: `${narrator}：找出已知量：\n$a = ${triA}$，$b = ${triB}$\n我们需要求 $c$（斜边）。`, en: `${narrator}: "Identify the known values:\n$a = ${triA}$, $b = ${triB}$\nWe need to find $c$ (the hypotenuse)."` }, highlightField: 'c' },
    { text: { zh: `${narrator}：代入公式：\n$c^{2} = ${triA}^{2} + ${triB}^{2}$`, en: `${narrator}: "Substitute into the formula:\n$c^{2} = ${triA}^{2} + ${triB}^{2}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：计算平方：\n$c^{2} = ${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$`, en: `${narrator}: "Calculate the squares:\n$c^{2} = ${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：开平方根：\n$c = \\sqrt{${triA * triA + triB * triB}} = ${triC}$`, en: `${narrator}: "Take the square root:\n$c = \\sqrt{${triA * triA + triB * triB}} = ${triC}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：答案：$c = ${triC}$!`, en: `${narrator}: "Answer: $c = ${triC}$!"` }, highlightField: 'c' },
  ] : [
    { text: { zh: `${narrator}：什么是勾股定理?\n在直角三角形中，$a^{2} + b^{2} = c^{2}$\n其中 $c$ 是最长的边，叫做斜边(hypotenuse)。`, en: `${narrator}: "What is the Pythagorean theorem?\nIn a right triangle, $a^{2} + b^{2} = c^{2}$\nwhere $c$ is the longest side, called the hypotenuse."` }, highlightField: 'c' },
    { text: { zh: `${narrator}：找出已知量：\n斜边 $c = ${triC}$，一条直角边 $a = ${triB}$\n我们需要求另一条直角边 $b$。`, en: `${narrator}: "Identify the known values:\nHypotenuse $c = ${triC}$, one leg $a = ${triB}$\nWe need to find the other leg $b$."` }, highlightField: 'c' },
    { text: { zh: `${narrator}：变形公式：\n$b^{2} = c^{2} - a^{2}$`, en: `${narrator}: "Rearrange the formula:\n$b^{2} = c^{2} - a^{2}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：计算：\n$b^{2} = ${triC}^{2} - ${triB}^{2} = ${triC * triC} - ${triB * triB} = ${triC * triC - triB * triB}$`, en: `${narrator}: "Calculate:\n$b^{2} = ${triC}^{2} - ${triB}^{2} = ${triC * triC} - ${triB * triB} = ${triC * triC - triB * triB}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：开平方根：\n$b = \\sqrt{${triC * triC - triB * triB}} = ${triA}$`, en: `${narrator}: "Take the square root:\n$b = \\sqrt{${triC * triC - triB * triB}} = ${triA}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：答案：$b = ${triA}$!`, en: `${narrator}: "Answer: $b = ${triA}$!"` }, highlightField: 'c' },
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

  const decimal = pct / 100;
  const multiplier = isDiscount ? 1 - decimal : 1 + decimal;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：什么是百分比?\n"百分"就是"每一百份中"。\n$${pct}\\% = \\frac{${pct}}{100} = ${decimal}$`,
        en: `${narrator}: "What is a percentage?\n'Per cent' means 'out of 100'.\n$${pct}\\% = \\frac{${pct}}{100} = ${decimal}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：题目信息：\n起始值 = $${initial}$\n百分比 = $${pct}\\%$${isDiscount ? '(减少)' : '(增加)'}`,
        en: `${narrator}: "Given information:\nStarting value = $${initial}$\nPercentage = $${pct}\\%$${isDiscount ? ' (decrease)' : ' (increase)'}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把百分比转成小数：$${pct}\\% = ${decimal}$`,
        en: `${narrator}: "Convert percentage to decimal: $${pct}\\% = ${decimal}$"`,
      },
      hint: {
        zh: '除以100就行：把小数点往左移两位',
        en: 'Just divide by 100: move the decimal point two places left',
      },
      highlightField: 'ans',
    },
    {
      text: isDiscount ? {
        zh: `${narrator}：减少用这个公式：\n新值 = 原值 $\\times$ $(1 - ${decimal})$ = 原值 $\\times$ $${multiplier}$`,
        en: `${narrator}: "For decrease, use this formula:\nNew = Original $\\times$ $(1 - ${decimal})$ = Original $\\times$ $${multiplier}$"`,
      } : {
        zh: `${narrator}：增加用这个公式：\n新值 = 原值 $\\times$ $(1 + ${decimal})$ = 原值 $\\times$ $${multiplier}$`,
        en: `${narrator}: "For increase, use this formula:\nNew = Original $\\times$ $(1 + ${decimal})$ = Original $\\times$ $${multiplier}$"`,
      },
      hint: isDiscount ? {
        zh: '减少就是用1减去小数，得到保留的比例',
        en: 'Decrease means subtract the decimal from 1 to get the remaining fraction',
      } : {
        zh: '增加就是用1加上小数，得到总的比例',
        en: 'Increase means add the decimal to 1 to get the total fraction',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：计算：$${initial} \\times ${multiplier} = ${result}$`,
        en: `${narrator}: "Calculate: $${initial} \\times ${multiplier} = ${result}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案：$${result}$`,
        en: `${narrator}: "Answer: $${result}$"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, initial, pct, rate, years: 1, generatorType: 'PERCENTAGE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   LINEAR generator: y = mx + c from two points
   ══════════════════════════════════════════════════════════ */

export function generateLinearMission(template: Mission): Mission {
  const tier = getTier();
  const mPools = { 1: [1, 2, -1, -2], 2: [1, 2, 3, -1, -2, -3], 3: [-4, -3, -2, 2, 3, 4, 5] };
  const cPools = { 1: [0, 1, 2, 3, -1], 2: [-5, -3, -1, 0, 1, 3, 5], 3: [-8, -5, -3, 3, 5, 7, 10] };
  const m = pickRandom(mPools[tier]);
  const c = pickRandom(cPools[tier]);
  const x1 = pickRandom([-2, -1, 0, 1, 2, 3]);
  const x2 = x1 + pickRandom([1, 2, 3]);
  const y1 = m * x1 + c;
  const y2 = m * x2 + c;

  const narrator = pickRandom(['诸葛亮', '曹操']);
  const description: BilingualText = {
    zh: `求经过 A(${x1}, ${y1}) 和 B(${x2}, ${y2}) 的直线方程 $y = mx + c$。`,
    en: `Find the equation $y = mx + c$ through A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
  };

  // Build substitution string for c calculation: y1 = m*x1 + c → c = y1 - m*x1
  const mTimesX1 = m * x1;
  const cExpr = mTimesX1 >= 0
    ? `${y1} - ${mTimesX1}`
    : `${y1} - (${mTimesX1})`;

  const tutorialSteps = [
    // Step 1: 斜率的定义
    {
      text: {
        zh: `${narrator}：斜率(gradient)就是直线的陡峭程度：$m = \\frac{y\\text{的变化量}}{x\\text{的变化量}}$`,
        en: `${narrator}: "Gradient measures the steepness of a line: $m = \\frac{\\text{change in } y}{\\text{change in } x}$"`,
      },
      hint: {
        zh: '斜率就是"y 变了多少"除以"x 变了多少"',
        en: 'Gradient is "how much y changes" divided by "how much x changes"',
      },
      highlightField: 'm',
    },
    // Step 2: 用数学公式来表示
    {
      text: {
        zh: `${narrator}：用坐标点的公式表示：$m = \\frac{y_2 - y_1}{x_2 - x_1}$`,
        en: `${narrator}: "Using coordinate formula: $m = \\frac{y_2 - y_1}{x_2 - x_1}$"`,
      },
      hint: {
        zh: `$x_1$ 和 $y_1$ 就是第一个点 A 的横坐标和纵坐标\n所以 $x_1 = ${x1}$，$y_1 = ${y1}$\n同理 $x_2 = ${x2}$，$y_2 = ${y2}$ 来自第二个点 B`,
        en: `$x_1$ and $y_1$ are the x and y of the first point A\nSo $x_1 = ${x1}$, $y_1 = ${y1}$\nLikewise $x_2 = ${x2}$, $y_2 = ${y2}$ come from point B`,
      },
      highlightField: 'm',
    },
    // Step 3: 代入具体数值，算出 m
    {
      text: {
        zh: `${narrator}：代入 A(${x1}, ${y1}) 和 B(${x2}, ${y2})：$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$`,
        en: `${narrator}: "Substitute A(${x1}, ${y1}) and B(${x2}, ${y2}): $m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$"`,
      },
      highlightField: 'm',
    },
    // Step 4: 把 m 代回直线方程
    {
      text: {
        zh: `${narrator}：把 $m = ${m}$ 代回直线方程：$y = ${m}x + c$`,
        en: `${narrator}: "Substitute $m = ${m}$ back into the equation: $y = ${m}x + c$"`,
      },
      hint: {
        zh: '现在只剩 c 未知，用任意一个已知点就能求出 c',
        en: 'Now only c is unknown — use any known point to find c',
      },
      highlightField: 'c',
    },
    // Step 5: 用第一个点代入求 c
    {
      text: {
        zh: `${narrator}：用点 A(${x1}, ${y1}) 来求 $c$。这里 $x = ${x1}$，$y = ${y1}$，代入 $y = ${m}x + c$：$${y1} = ${m} \\times (${x1}) + c$`,
        en: `${narrator}: "Use point A(${x1}, ${y1}) to find $c$. Here $x = ${x1}$, $y = ${y1}$, substitute into $y = ${m}x + c$: $${y1} = ${m} \\times (${x1}) + c$"`,
      },
      hint: {
        zh: `也可以用点 B(${x2}, ${y2}) 来算，结果一样`,
        en: `You could also use point B(${x2}, ${y2}) — the result is the same`,
      },
      highlightField: 'c',
    },
    // Step 6: 算出 c
    {
      text: {
        zh: `${narrator}：解得：$c = ${cExpr} = ${c}$`,
        en: `${narrator}: "Solving: $c = ${cExpr} = ${c}$"`,
      },
      highlightField: 'c',
    },
    // Step 7: 最终方程
    {
      text: {
        zh: `${narrator}：所以直线方程为：$y = ${m}x ${c >= 0 ? '+' : ''} ${c}$`,
        en: `${narrator}: "Therefore the equation of the line is: $y = ${m}x ${c >= 0 ? '+' : ''} ${c}$"`,
      },
      highlightField: 'c',
    },
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

  // Compute elimination intermediate values for tutorial
  const elimMul1 = Math.abs(b2);
  const elimMul2 = Math.abs(b1);
  const newA1 = a1 * elimMul1;
  const newB1 = b1 * elimMul1;
  const newC1 = c1 * elimMul1;
  const newA2 = a2 * elimMul2;
  const newB2 = b2 * elimMul2;
  const newC2 = c2 * elimMul2;
  const elimA = newA1 - newA2;
  const elimC = newC1 - newC2;

  const tutorialSteps = [
    { text: { zh: `${narrator}：什么是联立方程?\n两个方程包含两个未知数，需要同时求解。`, en: `${narrator}: "What are simultaneous equations?\nTwo equations with two unknowns — solve both at the same time."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：写出两个方程：\n方程1: $${a1}x + ${b1}y = ${c1}$\n方程2: $${a2}x + ${b2}y = ${c2}$`, en: `${narrator}: "Write the two equations:\nEq1: $${a1}x + ${b1}y = ${c1}$\nEq2: $${a2}x + ${b2}y = ${c2}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：目标：让一个变量的系数相同，这样就能消去它。\n我们选择消去 $y$。`, en: `${narrator}: "Goal: make the coefficient of one variable the same in both equations, so we can eliminate it.\nLet's eliminate $y$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：方程1 乘以 $${elimMul1}$: $${newA1}x + ${newB1}y = ${newC1}$\n方程2 乘以 $${elimMul2}$: $${newA2}x + ${newB2}y = ${newC2}$`, en: `${narrator}: "Multiply Eq1 by $${elimMul1}$: $${newA1}x + ${newB1}y = ${newC1}$\nMultiply Eq2 by $${elimMul2}$: $${newA2}x + ${newB2}y = ${newC2}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：两式相减，$y$ 消去：\n$${elimA}x = ${elimC}$\n$x = ${elimC} \\div ${elimA} = ${x}$`, en: `${narrator}: "Subtract one from the other, $y$ disappears:\n$${elimA}x = ${elimC}$\n$x = ${elimC} \\div ${elimA} = ${x}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：把 $x = ${x}$ 代回方程1：\n$${a1} \\times ${x} + ${b1}y = ${c1}$\n$${b1}y = ${c1 - a1 * x}$\n$y = ${y}$`, en: `${narrator}: "Substitute $x = ${x}$ back into Eq1:\n$${a1} \\times ${x} + ${b1}y = ${c1}$\n$${b1}y = ${c1 - a1 * x}$\n$y = ${y}$"` }, highlightField: 'y' },
    { text: { zh: `${narrator}：答案：$x = ${x}$，$y = ${y}$!`, en: `${narrator}: "Answer: $x = ${x}$, $y = ${y}$!"` }, highlightField: 'x' },
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

  const knownValue = a * multiplier;
  const answerValue = b * multiplier;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：什么是比例?\n比例是比较两个量的方式。\n$${a}:${b}$ 意思是"每 $${a}$ 份的一种，就有 $${b}$ 份的另一种"。`,
        en: `${narrator}: "What is a ratio?\nA ratio compares two quantities.\n$${a}:${b}$ means 'for every $${a}$ of one, there are $${b}$ of the other'."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：已知信息：\n比例是 $${a}:${b}$\n前项的实际值 = $${knownValue}$\n求后项的实际值。`,
        en: `${narrator}: "Given information:\nRatio is $${a}:${b}$\nFirst term actual value = $${knownValue}$\nFind the second term."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：找倍率(scale factor)：\n用已知量除以它对应的比例份数：$${knownValue} \\div ${a} = ${multiplier}$`,
        en: `${narrator}: "Find the scale factor:\nDivide the known value by its ratio part: $${knownValue} \\div ${a} = ${multiplier}$"`,
      },
      hint: {
        zh: '倍率告诉你每一份代表多少',
        en: 'The scale factor tells you how much each part is worth',
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：用倍率乘以另一个比例份数：$${b} \\times ${multiplier} = ${answerValue}$`,
        en: `${narrator}: "Multiply the other ratio part by the scale factor: $${b} \\times ${multiplier} = ${answerValue}$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：答案：后项 = $${answerValue}$`,
        en: `${narrator}: "Answer: second term = $${answerValue}$"`,
      },
      highlightField: 'y',
    },
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

  const scaleFactor = a / b;
  const tutorialSteps = [
    { text: { zh: `${narrator}：什么是"相似"?\n形状相同，大小不同。对应边的比例相同。`, en: `${narrator}: "What does 'similar' mean?\nSame shape, different size. Corresponding sides have the same ratio."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：求比例系数(scale factor)：\n$\\frac{${a}}{${b}} = ${scaleFactor}$`, en: `${narrator}: "Find the scale factor:\n$\\frac{${a}}{${b}} = ${scaleFactor}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：找出需要求的边：\n已知第二个三角形的对应边 = $${c}$\n我们要求 $x$。`, en: `${narrator}: "Identify which side we need:\nThe corresponding side in the second triangle = $${c}$\nWe need to find $x$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：计算：\n$x = ${c} \\times ${scaleFactor} = ${correctX}$`, en: `${narrator}: "Calculate:\n$x = ${c} \\times ${scaleFactor} = ${correctX}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案：$x = ${correctX}$!`, en: `${narrator}: "Answer: $x = ${correctX}$!"` }, highlightField: 'x' },
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

  const meanRounded = Math.round(mean * 100) / 100;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：什么是平均数(mean)?\n把所有数加起来，再除以数的个数。`,
        en: `${narrator}: "What is the mean (average)?\nAdd up all the numbers, then divide by how many there are."`,
      },
      hint: {
        zh: '平均数就是把总量平均分给每一个',
        en: 'The mean is the total shared equally among all values',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：列出所有数：$${values.join(', ')}$\n一共有 $${count}$ 个数。`,
        en: `${narrator}: "List all numbers: $${values.join(', ')}$\nThere are $${count}$ numbers in total."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把它们加起来：\n$${values.join(' + ')} = ${sum}$`,
        en: `${narrator}: "Add them up:\n$${values.join(' + ')} = ${sum}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：除以个数：$\\frac{${sum}}{${count}}$`,
        en: `${narrator}: "Divide by the count: $\\frac{${sum}}{${count}}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案：平均数 = $${meanRounded}$`,
        en: `${narrator}: "Answer: Mean = $${meanRounded}$"`,
      },
      highlightField: 'ans',
    },
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
    const sinValRounded = Math.round(sinVal * 10000) / 10000;
    const hypRounded = Math.round(hyp * 10000) / 10000;
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：三角函数可以用来算直角三角形中的未知边长`,
          en: `${narrator}: "Trig functions help us find unknown sides in a right triangle"`,
        },
        hint: {
          zh: 'SOH-CAH-TOA 是记忆口诀\nSin = Opposite / Hypotenuse\nCos = Adjacent / Hypotenuse\nTan = Opposite / Adjacent',
          en: 'SOH-CAH-TOA is the memory trick\nSin = Opposite / Hypotenuse\nCos = Adjacent / Hypotenuse\nTan = Opposite / Adjacent',
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：这里用 $\\sin$，因为已知对边 = ${opposite}，要求斜边 $c$`,
          en: `${narrator}: "We use $\\sin$ because we know the opposite = ${opposite} and need hypotenuse $c$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：写出等式：$\\sin(${angle}^\\circ) = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{${opposite}}{c}$`,
          en: `${narrator}: "Write the equation: $\\sin(${angle}^\\circ) = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{${opposite}}{c}$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：变形求 $c$：$c = \\frac{${opposite}}{\\sin(${angle}^\\circ)}$`,
          en: `${narrator}: "Rearrange for $c$: $c = \\frac{${opposite}}{\\sin(${angle}^\\circ)}$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：代入计算：$c = \\frac{${opposite}}{${sinValRounded}} = ${hypRounded}$`,
          en: `${narrator}: "Calculate: $c = \\frac{${opposite}}{${sinValRounded}} = ${hypRounded}$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：所以斜边 $c = ${hypRounded}$!`,
          en: `${narrator}: "So the hypotenuse $c = ${hypRounded}$!"`,
        },
        highlightField: 'c',
      },
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
      {
        text: {
          zh: `${narrator}：三角函数可以用来算直角三角形中的未知边长`,
          en: `${narrator}: "Trig functions help us find unknown sides in a right triangle"`,
        },
        hint: {
          zh: 'SOH-CAH-TOA 是记忆口诀\nSin = Opposite / Hypotenuse\nCos = Adjacent / Hypotenuse\nTan = Opposite / Adjacent',
          en: 'SOH-CAH-TOA is the memory trick\nSin = Opposite / Hypotenuse\nCos = Adjacent / Hypotenuse\nTan = Opposite / Adjacent',
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：已知对边和邻边，可以用 $\\tan$ 来求角度`,
          en: `${narrator}: "Given opposite and adjacent sides, we can use $\\tan$ to find the angle"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：$\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${chosen.opp}}{${chosen.adj}}$`,
          en: `${narrator}: "$\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${chosen.opp}}{${chosen.adj}}$"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：用反正切(arctan)求角度：$\\theta = \\tan^{-1}\\left(\\frac{${chosen.opp}}{${chosen.adj}}\\right) = \\tan^{-1}(${chosen.opp / chosen.adj})$`,
          en: `${narrator}: "Use inverse tan (arctan) to find the angle: $\\theta = \\tan^{-1}\\left(\\frac{${chosen.opp}}{${chosen.adj}}\\right) = \\tan^{-1}(${chosen.opp / chosen.adj})$"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：所以 $\\theta = ${chosen.angle}^\\circ$!`,
          en: `${narrator}: "So $\\theta = ${chosen.angle}^\\circ$!"`,
        },
        highlightField: 'angle',
      },
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
    { text: { zh: `${narrator}：$\\tan(\\theta) = \\text{对边}/\\text{邻边}$`, en: `${narrator}: "$\\tan(\\theta) = \\text{opposite}/\\text{adjacent}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：$= ${opposite} / ${adjacent}$`, en: `${narrator}: "$= ${opposite} / ${adjacent}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：$\\tan(\\theta) = ${Math.round(tanVal * 10000) / 10000}$！`, en: `${narrator}: "$\\tan(\\theta) = ${Math.round(tanVal * 10000) / 10000}$!"` }, highlightField: 'tan' },
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
      {
        text: {
          zh: `${narrator}：要找抛物线的顶点 -- 就是曲线的最高点或最低点`,
          en: `${narrator}: "We need to find the vertex of the parabola — the highest or lowest point on the curve"`,
        },
        hint: {
          zh: '顶点横坐标的公式是 $x = \\frac{-b}{2a}$',
          en: 'The formula for the vertex x-coordinate is $x = \\frac{-b}{2a}$',
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：我们的函数是 $f(x) = ${a}x^{2} + ${b}x$，其中 $a = ${a}$，$b = ${b}$`,
          en: `${narrator}: "Our function is $f(x) = ${a}x^{2} + ${b}x$, where $a = ${a}$, $b = ${b}$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：代入公式：$x = \\frac{-(${b})}{2 \\times (${a})}$`,
          en: `${narrator}: "Substitute into the formula: $x = \\frac{-(${b})}{2 \\times (${a})}$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：计算分子：$-(${b}) = ${-b}$\n计算分母：$2 \\times (${a}) = ${2 * a}$\n所以 $x = \\frac{${-b}}{${2 * a}} = ${vertexX}$`,
          en: `${narrator}: "Numerator: $-(${b}) = ${-b}$\nDenominator: $2 \\times (${a}) = ${2 * a}$\nSo $x = \\frac{${-b}}{${2 * a}} = ${vertexX}$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：答案 $x = ${vertexX}$! 顶点在 $x = ${vertexX}$ 处，此时 $f(${vertexX}) = ${vertexY}$`,
          en: `${narrator}: "Answer: $x = ${vertexX}$! The vertex is at $x = ${vertexX}$, where $f(${vertexX}) = ${vertexY}$"`,
        },
        highlightField: 'x',
      },
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
    {
      text: {
        zh: `${narrator}：抛物线 $y = ax^{2} + c$ 经过两个点，我们要求出系数 $a$ 和 $c$`,
        en: `${narrator}: "The parabola $y = ax^{2} + c$ passes through two points — we need to find coefficients $a$ and $c$"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：先看第一个点 $(0, ${c})$，代入 $x = 0$：$y = a \\times 0^{2} + c = c$，所以 $c = ${c}$`,
        en: `${narrator}: "Look at the first point $(0, ${c})$: substitute $x = 0$: $y = a \\times 0^{2} + c = c$, so $c = ${c}$"`,
      },
      hint: {
        zh: '为什么? $a \\times 0^{2} + c = c$，$x=0$ 时 $a$ 项消失了',
        en: 'Why? $a \\times 0^{2} + c = c$ — when $x=0$, the $a$ term vanishes',
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：现在知道 $c = ${c}$，代入第二个点 $(${x2}, ${y2})$`,
        en: `${narrator}: "Now we know $c = ${c}$, substitute the second point $(${x2}, ${y2})$"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：$${y2} = a \\times ${x2}^{2} + ${c}$，解出 $a$`,
        en: `${narrator}: "$${y2} = a \\times ${x2}^{2} + ${c}$, solve for $a$"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：$a = \\frac{${y2} - ${c}}{${x2}^{2}} = \\frac{${y2 - c}}{${x2 * x2}} = ${a}$`,
        en: `${narrator}: "$a = \\frac{${y2} - ${c}}{${x2}^{2}} = \\frac{${y2 - c}}{${x2 * x2}} = ${a}$"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：答案：$a = ${a}$，$c = ${c}$!`,
        en: `${narrator}: "Answer: $a = ${a}$, $c = ${c}$!"`,
      },
      highlightField: 'c',
    },
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
  const eqStr = `x^{2} ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`;
  const factorStr = `(x ${r1 >= 0 ? '-' : '+'}${Math.abs(r1)})(x ${r2 >= 0 ? '-' : '+'}${Math.abs(r2)}) = 0`;
  const tutorialSteps = [
    { text: { zh: `${narrator}：什么是"求根"?\n找到让方程等于零的 $x$ 值。`, en: `${narrator}: "What does 'finding roots' mean?\nFinding the values of $x$ that make the equation equal zero."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：方程是：\n$${eqStr}$`, en: `${narrator}: "The equation is:\n$${eqStr}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：方法：因式分解\n把方程写成 $(x - r_1)(x - r_2) = 0$ 的形式。\n我们需要两个数，乘积 = $${c}$，相加 = $${-b}$。`, en: `${narrator}: "Method: factorize\nWrite the equation as $(x - r_1)(x - r_2) = 0$.\nWe need two numbers that multiply to give $${c}$ and add to give $${-b}$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：这两个数是 $${r1}$ 和 $${r2}$：\n验证：$${r1} \\times ${r2} = ${r1 * r2}$ (= $${c}$)\n验证：$${r1} + ${r2} = ${r1 + r2}$ (= $${-b}$)`, en: `${narrator}: "The two numbers are $${r1}$ and $${r2}$:\nCheck: $${r1} \\times ${r2} = ${r1 * r2}$ (= $${c}$)\nCheck: $${r1} + ${r2} = ${r1 + r2}$ (= $${-b}$)"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：所以 $${factorStr}$\n意味着 $x = ${r1}$ 或 $x = ${r2}$`, en: `${narrator}: "So $${factorStr}$\nThis means $x = ${r1}$ or $x = ${r2}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案：$x = ${r1}$ 或 $x = ${r2}$!`, en: `${narrator}: "Answer: $x = ${r1}$ or $x = ${r2}$!"` }, highlightField: 'x' },
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
      {
        text: {
          zh: `${narrator}：导数等于零的点就是函数的极值点 -- 最高或最低点`,
          en: `${narrator}: "Points where the derivative equals zero are extrema — the highest or lowest points"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：我们要解 $f'(x) = 3x^{2} - 3 = 0$`,
          en: `${narrator}: "We need to solve $f'(x) = 3x^{2} - 3 = 0$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：移项：$3x^{2} = 3$`,
          en: `${narrator}: "Rearrange: $3x^{2} = 3$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：两边除以 3：$x^{2} = 1$，开方得 $x = 1$（取正值）`,
          en: `${narrator}: "Divide both sides by 3: $x^{2} = 1$, take the square root: $x = 1$ (positive value)"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：答案 $x = ${x}$! 这就是函数的极值点`,
          en: `${narrator}: "Answer: $x = ${x}$! This is the extremum of the function"`,
        },
        highlightField: 'x',
      },
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
    {
      text: {
        zh: `${narrator}：导数就是函数在某一点的"变化速度"（切线斜率）`,
        en: `${narrator}: "The derivative is the 'rate of change' of a function at a specific point (slope of the tangent line)"`,
      },
      hint: {
        zh: '对于 $y = x^{2}$，导数公式是 $y\\prime = 2x$',
        en: 'For $y = x^{2}$, the derivative formula is $y\\prime = 2x$',
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：我们要求 $x = ${x}$ 处的斜率`,
        en: `${narrator}: "We need to find the slope at $x = ${x}$"`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：代入公式：$k = 2 \\times ${x}$`,
        en: `${narrator}: "Substitute into the formula: $k = 2 \\times ${x}$"`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：计算：$k = ${k}$`,
        en: `${narrator}: "Calculate: $k = ${k}$"`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：答案 $k = ${k}$! 在 $x = ${x}$ 处，曲线的倾斜程度是 ${k}`,
        en: `${narrator}: "Answer: $k = ${k}$! At $x = ${x}$, the steepness of the curve is ${k}"`,
      },
      highlightField: 'k',
    },
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
    const fUpper = 0.5 * upper * upper;
    const fLower = 0.5 * lower * lower;
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：积分就是求曲线下面围成的面积`,
          en: `${narrator}: "Integration means finding the area under the curve"`,
        },
        hint: {
          zh: `从 $x = ${lower}$ 到 $x = ${upper}$，$y = x$ 曲线下面有多大面积?`,
          en: `From $x = ${lower}$ to $x = ${upper}$, how much area is under the $y = x$ curve?`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：反导数（原函数）是什么? $\\int x\\,dx = \\frac{x^{2}}{2}$`,
          en: `${narrator}: "What is the antiderivative? $\\int x\\,dx = \\frac{x^{2}}{2}$"`,
        },
        hint: {
          zh: '求原函数就是"导数的反操作"',
          en: 'Finding the antiderivative is the "reverse of differentiation"',
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：代入上下限：$F(${upper}) - F(${lower})$`,
          en: `${narrator}: "Substitute the limits: $F(${upper}) - F(${lower})$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：计算 $F(${upper}) = \\frac{${upper}^{2}}{2} = ${fUpper}$，$F(${lower}) = \\frac{${lower}^{2}}{2} = ${fLower}$`,
          en: `${narrator}: "Calculate $F(${upper}) = \\frac{${upper}^{2}}{2} = ${fUpper}$, $F(${lower}) = \\frac{${lower}^{2}}{2} = ${fLower}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：相减得到面积：$${fUpper} - ${fLower} = ${area}$!`,
          en: `${narrator}: "Subtract to get the area: $${fUpper} - ${fLower} = ${area}$!"`,
        },
        highlightField: 'area',
      },
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
    const fUpper = upper * upper * upper;
    const fLower = lower * lower * lower;
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：积分就是求曲线下面围成的面积`,
          en: `${narrator}: "Integration means finding the area under the curve"`,
        },
        hint: {
          zh: `从 $x = ${lower}$ 到 $x = ${upper}$，$y = 3x^{2}$ 曲线下面有多大面积?`,
          en: `From $x = ${lower}$ to $x = ${upper}$, how much area is under the $y = 3x^{2}$ curve?`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：反导数（原函数）是什么? $\\int 3x^{2}\\,dx = x^{3}$`,
          en: `${narrator}: "What is the antiderivative? $\\int 3x^{2}\\,dx = x^{3}$"`,
        },
        hint: {
          zh: '求原函数就是"导数的反操作"',
          en: 'Finding the antiderivative is the "reverse of differentiation"',
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：代入上下限：$F(${upper}) - F(${lower})$`,
          en: `${narrator}: "Substitute the limits: $F(${upper}) - F(${lower})$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：计算 $F(${upper}) = ${upper}^{3} = ${fUpper}$，$F(${lower}) = ${lower}^{3} = ${fLower}$`,
          en: `${narrator}: "Calculate $F(${upper}) = ${upper}^{3} = ${fUpper}$, $F(${lower}) = ${lower}^{3} = ${fLower}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：相减得到面积：$${fUpper} - ${fLower} = ${area}$!`,
          en: `${narrator}: "Subtract to get the area: $${fUpper} - ${fLower} = ${area}$!"`,
        },
        highlightField: 'area',
      },
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
  const fUpper = upper * upper;
  const fLower = lower * lower;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：积分就是求曲线下面围成的面积`,
        en: `${narrator}: "Integration means finding the area under the curve"`,
      },
      hint: {
        zh: `从 $x = ${lower}$ 到 $x = ${upper}$，$y = 2x$ 曲线下面有多大面积?`,
        en: `From $x = ${lower}$ to $x = ${upper}$, how much area is under the $y = 2x$ curve?`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：反导数（原函数）是什么? $\\int 2x\\,dx = x^{2}$`,
        en: `${narrator}: "What is the antiderivative? $\\int 2x\\,dx = x^{2}$"`,
      },
      hint: {
        zh: '求原函数就是"导数的反操作"',
        en: 'Finding the antiderivative is the "reverse of differentiation"',
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：代入上下限：$F(${upper}) - F(${lower})$`,
        en: `${narrator}: "Substitute the limits: $F(${upper}) - F(${lower})$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：计算 $F(${upper}) = ${upper}^{2} = ${fUpper}$，$F(${lower}) = ${lower}^{2} = ${fLower}$`,
        en: `${narrator}: "Calculate $F(${upper}) = ${upper}^{2} = ${fUpper}$, $F(${lower}) = ${lower}^{2} = ${fLower}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：相减得到面积：$${fUpper} - ${fLower} = ${area}$!`,
        en: `${narrator}: "Subtract to get the area: $${fUpper} - ${fLower} = ${area}$!"`,
      },
      highlightField: 'area',
    },
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
    { text: { zh: `${narrator}：半径 ${radius}，高 ${height}，$\\pi=${pi}$`, en: `${narrator}: "Radius ${radius}, height ${height}, $\\pi=${pi}$"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：底面积 = $\\pi r^2 = ${pi} \\times ${radius}^2 = ${baseArea}$`, en: `${narrator}: "Base area = $\\pi r^2 = ${pi} \\times ${radius}^2 = ${baseArea}$"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：$V = ${Math.round(vol * 100) / 100}$！`, en: `${narrator}: "$V = ${Math.round(vol * 100) / 100}$!"` }, highlightField: 'v' },
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
      {
        text: {
          zh: `${narrator}：我们要计算函数在某一点的值`,
          en: `${narrator}: "We need to calculate the value of a function at a specific point"`,
        },
        hint: {
          zh: '函数就是一个"计算规则"——给它一个 x，它会算出一个 y',
          en: 'A function is a "calculation rule" — give it an x, it produces a y',
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：函数是 $y = ${m}x ${b >= 0 ? '+' : ''}${b}$，要求 $x = ${x}$ 时 $y$ 是多少`,
          en: `${narrator}: "The function is $y = ${m}x ${b >= 0 ? '+' : ''}${b}$, find $y$ when $x = ${x}$"`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：把 $x = ${x}$ 代入公式，就是把公式里的 $x$ 换成 ${x}\n$y = ${m} \\times ${x} ${b >= 0 ? '+' : ''}${b}$`,
          en: `${narrator}: "Substitute $x = ${x}$ into the formula — replace $x$ with ${x}\n$y = ${m} \\times ${x} ${b >= 0 ? '+' : ''}${b}$"`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：先算乘法 $${m} \\times ${x} = ${m * x}$，再加上 ${b}\n$y = ${m * x} ${b >= 0 ? '+' : ''}${b} = ${y}$`,
          en: `${narrator}: "First multiply $${m} \\times ${x} = ${m * x}$, then add ${b}\n$y = ${m * x} ${b >= 0 ? '+' : ''}${b} = ${y}$"`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：所以 $y = ${y}$!`,
          en: `${narrator}: "So $y = ${y}$!"`,
        },
        highlightField: 'y',
      },
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
  const negBCoeff = -bCoeff;
  const twoA = 2 * a;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：求二次函数的顶点横坐标 $t$`,
        en: `${narrator}: "Find the x-coordinate of the vertex, $t$"`,
      },
      hint: {
        zh: '顶点是抛物线最高点或最低点的位置',
        en: 'The vertex is the highest or lowest point of the parabola',
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：函数 $f(x) = ${a}x^{2} ${bCoeff >= 0 ? '+' : ''}${bCoeff}x$，顶点公式 $t = \\frac{-b}{2a}$`,
        en: `${narrator}: "Function $f(x) = ${a}x^{2} ${bCoeff >= 0 ? '+' : ''}${bCoeff}x$, vertex formula $t = \\frac{-b}{2a}$"`,
      },
      hint: {
        zh: `这个公式告诉我们顶点在哪里\n其中 $a = ${a}$，$b = ${bCoeff}$`,
        en: `This formula tells us where the vertex is\nHere $a = ${a}$, $b = ${bCoeff}$`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：代入：$t = \\frac{-(${bCoeff})}{2 \\times ${a}}$`,
        en: `${narrator}: "Substitute: $t = \\frac{-(${bCoeff})}{2 \\times ${a}}$"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：计算：$t = \\frac{${negBCoeff}}{2 \\times ${a}} = \\frac{${negBCoeff}}{${twoA}} = ${t}$`,
        en: `${narrator}: "Calculate: $t = \\frac{${negBCoeff}}{2 \\times ${a}} = \\frac{${negBCoeff}}{${twoA}} = ${t}$"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：所以顶点横坐标 $t = ${t}$!`,
        en: `${narrator}: "So the vertex x-coordinate is $t = ${t}$!"`,
      },
      highlightField: 't',
    },
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
    { text: { zh: `${narrator}：先排序，再找中间值。${count} 个数，中间是第 ${mid + 1} 个。`, en: `${narrator}: "Sort first, find middle. ${count} numbers, middle is position ${mid + 1}."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：排序后：${sorted.join(', ')}`, en: `${narrator}: "Sorted: ${sorted.join(', ')}"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：中位数 = ${median}！`, en: `${narrator}: "Median = ${median}!"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    description,
    data: { values: sorted, mode: 'median', generatorType: 'STATISTICS_MEDIAN_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   HCF generator: find highest common factor of two numbers
   ══════════════════════════════════════════════════════════ */

function gcdCalc(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function primeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      n /= d;
    }
    d++;
  }
  if (n > 1) factors.set(n, (factors.get(n) || 0) + 1);
  return factors;
}

function formatFactorization(n: number): string {
  const factors = primeFactors(n);
  const parts: string[] = [];
  for (const [base, exp] of [...factors.entries()].sort((a, b) => a[0] - b[0])) {
    parts.push(exp === 1 ? `${base}` : `${base}^{${exp}}`);
  }
  return parts.join(' \\times ');
}

/** Short division: finds common prime factors step by step */
function shortDivision(a: number, b: number): { steps: { prime: number; quotientA: number; quotientB: number }[]; bottomA: number; bottomB: number } {
  const steps: { prime: number; quotientA: number; quotientB: number }[] = [];
  let curA = a, curB = b;
  let d = 2;
  while (d <= Math.min(curA, curB)) {
    if (curA % d === 0 && curB % d === 0) {
      curA /= d;
      curB /= d;
      steps.push({ prime: d, quotientA: curA, quotientB: curB });
      // don't increment d — same prime might divide again
    } else {
      d++;
    }
  }
  return { steps, bottomA: curA, bottomB: curB };
}

/* ══════════════════════════════════════════════════════════
   PRIME generator: is a number prime or not?
   ══════════════════════════════════════════════════════════ */

function isPrimeCheck(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false;
  }
  return true;
}

export function generatePrimeMission(template: Mission): Mission {
  const tier = getTier();
  // Mix of primes and non-primes for variety
  const primePools: Record<DifficultyTier, number[]> = { 1: [2, 3, 5, 7, 11, 13], 2: [17, 19, 23, 29, 31, 37], 3: [41, 43, 47, 53, 59, 61, 67, 71] };
  const compositePools: Record<DifficultyTier, number[]> = { 1: [4, 6, 8, 9, 10, 12, 14, 15], 2: [16, 18, 20, 21, 22, 24, 25, 26, 27, 28], 3: [33, 35, 39, 49, 51, 55, 57, 63, 65, 69] };

  // 50% chance prime, 50% composite
  const usePrime = pickRandom([true, false]);
  const n = usePrime ? pickRandom(primePools[tier]) : pickRandom(compositePools[tier]);
  const result = isPrimeCheck(n);

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '\u8bf8\u845b\u4eae';

  const description: BilingualText = {
    zh: `$${n}$ \u662f\u8d28\u6570\u5417\uff1f\uff08\u662f = 1\uff0c\u5426 = 0\uff09`,
    en: `Is $${n}$ prime? (yes = 1, no = 0)`,
  };

  // Build the trial division table for the hint
  const trialSteps: string[] = [];
  const trialStepsEn: string[] = [];
  let foundFactor = false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      trialSteps.push(`${n} \u00f7 ${d} = ${n/d} \u2713 \u6574\u9664\u4e86\uff01`);
      trialStepsEn.push(`${n} \u00f7 ${d} = ${n/d} \u2713 Divides evenly!`);
      foundFactor = true;
      break;
    } else {
      trialSteps.push(`${n} \u00f7 ${d} = ${(n/d).toFixed(2)}... \u2717`);
      trialStepsEn.push(`${n} \u00f7 ${d} = ${(n/d).toFixed(2)}... \u2717`);
    }
  }
  if (!foundFactor) {
    const stopAt = Math.ceil(Math.sqrt(n));
    trialSteps.push(`${stopAt} \u00d7 ${stopAt} = ${stopAt*stopAt} > ${n}\uff0c\u4e0d\u7528\u518d\u8bd5\u4e86\uff01`);
    trialStepsEn.push(`${stopAt} \u00d7 ${stopAt} = ${stopAt*stopAt} > ${n}, no need to try further!`);
  }

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}\uff1a$${n}$ \u662f\u4e0d\u662f\u8d28\u6570\uff1f\u5148\u56de\u5fc6\u2014\u2014\u8d28\u6570\u5c31\u662f\u53ea\u80fd\u88ab $1$ \u548c\u5b83\u81ea\u5df1\u6574\u9664\u7684\u6570`,
        en: `${narrator}: "Is $${n}$ prime? Remember \u2014 a prime can only be divided by $1$ and itself"`,
      },
      hint: {
        zh: '\u8d28\u6570\u6218\u58eb\uff1a\u4e0d\u80fd\u88ab\u62c6\u5206\u7684\u6700\u5f3a\u4e2a\u4f53\n\u53ea\u542c\u547d\u4e8e\u5929\u5b50\uff081\uff09\u548c\u81ea\u5df1\n\u6bd4\u5982 2, 3, 5, 7, 11 \u90fd\u662f\u8d28\u6570',
        en: 'Prime warriors: indivisible individuals\nOnly answer to the emperor (1) and themselves\nE.g. 2, 3, 5, 7, 11 are primes',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}\uff1a\u600e\u4e48\u5224\u65ad\uff1f\u4ece $2$ \u5f00\u59cb\uff0c\u9010\u4e2a\u8bd5\u9664`,
        en: `${narrator}: "How to check? Start from $2$, try dividing one by one"`,
      },
      hint: {
        zh: `\u7a8d\u95e8\uff1a\u4e0d\u7528\u8bd5\u5230 ${n}\uff0c\u8bd5\u5230\u201c\u67d0\u4e2a\u6570\u00d7\u81ea\u5df1\u8d85\u8fc7 ${n}\u201d\u5c31\u591f\u4e86\n\u56e0\u4e3a\u5982\u679c\u5b58\u5728\u5927\u7684\u56e0\u6570\uff0c\u4e00\u5b9a\u6709\u5bf9\u5e94\u7684\u5c0f\u56e0\u6570\uff08\u6211\u4eec\u5df2\u7ecf\u8bd5\u8fc7\u4e86\uff09`,
        en: `Shortcut: don't test up to ${n}, stop when "a number \u00d7 itself > ${n}"\nIf a large factor exists, a corresponding small one must too (already tested)`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}\uff1a\u9010\u4e2a\u8bd5\u9664 $${n}$`,
        en: `${narrator}: "Try dividing $${n}$ one by one"`,
      },
      hint: {
        zh: trialSteps.join('\n'),
        en: trialStepsEn.join('\n'),
      },
      highlightField: 'ans',
    },
    ...(result ? [
      {
        text: {
          zh: `${narrator}\uff1a\u5168\u90e8\u9664\u4e0d\u5c3d\uff01\u9664\u4e86 $1$ \u548c $${n}$ \u81ea\u5df1\uff0c\u6ca1\u6709\u522b\u7684\u6570\u80fd\u6574\u9664\u5b83`,
          en: `${narrator}: "None divide evenly! No number other than $1$ and $${n}$ divides it"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}\uff1a$${n}$ **\u662f\u8d28\u6570** \u2713 \u4e0d\u53ef\u62c6\u5206\u7684\u7cbe\u9510\u6218\u58eb\uff01`,
          en: `${narrator}: "$${n}$ IS prime \u2713 An indivisible elite warrior!"`,
        },
        highlightField: 'ans',
      },
    ] : [
      {
        text: {
          zh: `${narrator}\uff1a\u627e\u5230\u4e86\uff01$${n}$ \u80fd\u88ab ${(() => { for (let d=2;d*d<=n;d++) if(n%d===0) return d; return n; })()} \u6574\u9664`,
          en: `${narrator}: "Found one! $${n}$ is divisible by ${(() => { for (let d=2;d*d<=n;d++) if(n%d===0) return d; return n; })()}"`,
        },
        hint: {
          zh: `$${n} = ${(() => { for (let d=2;d*d<=n;d++) if(n%d===0) return `${d} \\times ${n/d}`; return `${n}`; })()}$\n\u80fd\u88ab\u62c6\u5f00\uff0c\u8bf4\u660e\u4e0d\u662f\u8d28\u6570`,
          en: `$${n} = ${(() => { for (let d=2;d*d<=n;d++) if(n%d===0) return `${d} \\times ${n/d}`; return `${n}`; })()}$\nCan be split, so not prime`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}\uff1a$${n}$ **\u4e0d\u662f\u8d28\u6570**\uff08\u662f\u5408\u6570\uff09\u2717 \u80fd\u88ab\u62c6\u5206\u6210\u66f4\u5c0f\u7684\u6570`,
          en: `${narrator}: "$${n}$ is NOT prime (it's composite) \u2717 Can be split into smaller numbers"`,
        },
        highlightField: 'ans',
      },
    ]),
  ];

  return {
    ...template,
    description,
    data: { n, isPrime: result, generatorType: 'PRIME_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FACTOR_TREE generator: prime factorization of a single number
   ══════════════════════════════════════════════════════════ */

type FactorTreeNode = {
  value: number;
  isPrime?: boolean;
  children?: [FactorTreeNode, FactorTreeNode];
};

function buildFactorTree(n: number): FactorTreeNode {
  if (n <= 1) return { value: n, isPrime: true };
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      return {
        value: n,
        children: [
          { value: d, isPrime: true },
          buildFactorTree(n / d),
        ],
      };
    }
  }
  // n is prime
  return { value: n, isPrime: true };
}

function getTreeDepth(node: FactorTreeNode): number {
  if (!node.children) return 0;
  return 1 + Math.max(getTreeDepth(node.children[0]), getTreeDepth(node.children[1]));
}

function getLeaves(node: FactorTreeNode): number[] {
  if (!node.children) return [node.value];
  return [...getLeaves(node.children[0]), ...getLeaves(node.children[1])];
}

export function generateFactorTreeMission(template: Mission): Mission {
  const tier = getTier();
  const pools = {
    1: [12, 18, 20, 24, 28, 30],
    2: [36, 40, 42, 48, 54, 56, 60],
    3: [72, 84, 90, 96, 120, 180],
  };
  const n = pickRandom(pools[tier]);
  const tree = buildFactorTree(n);
  const leaves = getLeaves(tree);
  const depth = getTreeDepth(tree);
  const primeCount = leaves.length;
  const factorization = formatFactorization(n);

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[：:]/)?.[0]) || '军师';

  const description: BilingualText = {
    zh: `把 $${n}$ 拆成质数的乘积，一共有几个质因数？（重复的也算）`,
    en: `Break $${n}$ into prime factors — how many prime factors total? (count repeats)`,
  };

  // Build step-by-step factorization process for hints
  const factSteps: string[] = [];
  const factStepsEn: string[] = [];
  let remaining = n;
  let d = 2;
  while (d * d <= remaining) {
    if (remaining % d === 0) {
      factSteps.push(`${remaining} ÷ ${d} = ${remaining / d}`);
      factStepsEn.push(`${remaining} ÷ ${d} = ${remaining / d}`);
      remaining = remaining / d;
    } else {
      d++;
    }
  }
  if (remaining > 1) {
    factSteps.push(`${remaining} 是质数，停！`);
    factStepsEn.push(`${remaining} is prime, stop!`);
  }

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：${n} 个新兵要拆成最小的战斗单元。怎么拆？`,
        en: `${narrator}: "${n} recruits need to be split into the smallest units. How?"`,
      },
      hint: {
        zh: '"最小单元"就是质数——只能被 1 和自己整除的数\n比如 2, 3, 5, 7, 11 都是质数\n4 不是（4=2×2），6 不是（6=2×3）',
        en: '"Smallest units" are primes — only divisible by 1 and themselves\nE.g. 2, 3, 5, 7, 11\n4 is not (4=2×2), 6 is not (6=2×3)',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：画"因数树"——从 ${n} 开始，一层一层往下拆`,
        en: `${narrator}: "Draw a factor tree — start with ${n}, split layer by layer"`,
      },
      hint: {
        zh: `方法：从最小的质数 2 开始试\n能整除就拆成两个数，不能就试下一个质数\n直到所有数都是质数为止`,
        en: `Method: start with smallest prime 2\nIf it divides evenly, split into two numbers\nKeep going until all numbers are prime`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：一步步拆 ${n}`,
        en: `${narrator}: "Break down ${n} step by step"`,
      },
      hint: {
        zh: factSteps.join('\n'),
        en: factStepsEn.join('\n'),
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：看因数树的"叶子"——最底部不能再拆的数`,
        en: `${narrator}: "Look at the 'leaves' — the numbers at the bottom that can't be split further"`,
      },
      hint: {
        zh: `叶子们：${leaves.join(', ')}\n一共 ${primeCount} 个质因数`,
        en: `Leaves: ${leaves.join(', ')}\nTotal: ${primeCount} prime factors`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：所以 $${n} = ${factorization}$`,
        en: `${narrator}: "So $${n} = ${factorization}$"`,
      },
      hint: {
        zh: `一共 ${primeCount} 个质因数（重复的也要算）\n验算：${leaves.join(' × ')} = ${n} ✓`,
        en: `Total ${primeCount} prime factors (count repeats)\nVerify: ${leaves.join(' × ')} = ${n} ✓`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：不管怎么拆，最终结果都一样——这叫"算术基本定理"`,
        en: `${narrator}: "No matter how you split it, the result is always the same — this is the Fundamental Theorem of Arithmetic"`,
      },
      hint: {
        zh: '试试从不同的数开始拆（比如先拆成 6×6 而不是 2×18）\n最终叶子排列出来一定相同',
        en: 'Try splitting differently (e.g. 6×6 instead of 2×18)\nThe leaves will always be the same',
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n, primeCount, tree, leaves, generatorType: 'FACTOR_TREE_RANDOM' },
    tutorialSteps,
  };
}

export function generateHcfMission(template: Mission): Mission {
  const tier = getTier();
  // Generate two numbers that have a non-trivial HCF
  const hcfPools = { 1: [2, 3, 4, 5, 6], 2: [4, 6, 8, 10, 12], 3: [6, 8, 12, 15, 18, 24] };
  const multPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7], 3: [3, 5, 7, 8, 9, 11] };

  const h = pickRandom(hcfPools[tier]);
  let m1 = pickRandom(multPools[tier]);
  let m2 = pickRandom(multPools[tier]);
  // Ensure m1 and m2 are coprime so HCF is exactly h
  while (gcdCalc(m1, m2) !== 1) {
    m2 = pickRandom(multPools[tier]);
  }
  const a = h * m1;
  const b = h * m2;

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[：:]/)?.[0]) || '军师';
  const description: BilingualText = {
    zh: `求 $${a}$ 和 $${b}$ 的最大公因数 (HCF)。`,
    en: `Find the Highest Common Factor (HCF) of $${a}$ and $${b}$.`,
  };

  const factA = formatFactorization(a);
  const factB = formatFactorization(b);

  // Helper: compute all factors of a number
  const factorsOf = (n: number): number[] => {
    const f: number[] = [];
    for (let i = 1; i <= n; i++) { if (n % i === 0) f.push(i); }
    return f;
  };
  const factorsA = factorsOf(a);
  const factorsB = factorsOf(b);
  const commonFactors = factorsA.filter(f => factorsB.includes(f));

  // Phase 2: Short division
  const sd = shortDivision(a, b);
  const leftCol = sd.steps.map(s => s.prime);
  const hcfFromSD = leftCol.reduce((p, c) => p * c, 1);
  const lcmFromSD = hcfFromSD * sd.bottomA * sd.bottomB;


  // Build "try primes" explanation for a given step
  const tryPrimesHint = (stepIdx: number): { zh: string; en: string } => {
    const prevA = stepIdx === 0 ? a : sd.steps[stepIdx - 1].quotientA;
    const prevB = stepIdx === 0 ? b : sd.steps[stepIdx - 1].quotientB;
    const step = sd.steps[stepIdx];
    const zhLines: string[] = [];
    const enLines: string[] = [];
    // Show trying primes from 2 up to the one that works
    for (let p = 2; p <= step.prime; p++) {
      const divA = prevA % p === 0;
      const divB = prevB % p === 0;
      if (divA && divB) {
        zhLines.push(`${p} 能同时整除 ${prevA} 和 ${prevB}? ${prevA}/${p}=${prevA/p} ✓  ${prevB}/${p}=${prevB/p} ✓ -- 可以!`);
        enLines.push(`Does ${p} divide both ${prevA} and ${prevB}? ${prevA}/${p}=${prevA/p} ✓  ${prevB}/${p}=${prevB/p} ✓ -- Yes!`);
      } else {
        const reason = !divA ? `${prevA}/${p} 除不尽` : `${prevB}/${p} 除不尽`;
        const enReason = !divA ? `${prevA}/${p} not exact` : `${prevB}/${p} not exact`;
        zhLines.push(`${p} 能同时整除 ${prevA} 和 ${prevB}? ${reason} ✗`);
        enLines.push(`Does ${p} divide both ${prevA} and ${prevB}? ${enReason} ✗`);
      }
    }
    return { zh: zhLines.join('\n'), en: enLines.join('\n') };
  };

  // Dynamic short division steps (Phase 2)
  const sdTutorialSteps: { text: { zh: string; en: string }; hint?: { zh: string; en: string }; highlightField: string }[] = [];

  // Step: intro
  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：方法一太慢。短除法一张图，同时算出 HCF 和 LCM`,
      en: `${narrator}: "Method 1 is slow. Short division — one diagram gives both HCF and LCM"`,
    },
    hint: {
      zh: '把两个数并排写，找能同时整除两个数的质数，写在左边',
      en: 'Write both numbers side by side, find a prime that divides both, write it on the left',
    },
    highlightField: 'ans',
  });

  // Step: first division
  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：找能同时整除 $${a}$ 和 $${b}$ 的最小质数`,
      en: `${narrator}: "Find the smallest prime that divides both $${a}$ and $${b}$"`,
    },
    hint: tryPrimesHint(0),
    highlightField: 'ans',
  });

  if (sd.steps.length === 1) {
    // Only one step — bottom already has no common factor
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：底部的 ${sd.bottomA} 和 ${sd.bottomB} 没有公因数了，停止`,
        en: `${narrator}: "${sd.bottomA} and ${sd.bottomB} at the bottom share no common factor — stop"`,
      },
      hint: { zh: `${sd.bottomA} 和 ${sd.bottomB} 互质（没有大于 1 的公因数）`, en: `${sd.bottomA} and ${sd.bottomB} are coprime (no common factor > 1)` },
      highlightField: 'ans',
    });
  } else if (sd.steps.length === 2) {
    // Two steps
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：继续找 ${sd.steps[0].quotientA} 和 ${sd.steps[0].quotientB} 的公因数`,
        en: `${narrator}: "Continue — find common factor of ${sd.steps[0].quotientA} and ${sd.steps[0].quotientB}"`,
      },
      hint: tryPrimesHint(1),
      highlightField: 'ans',
    });
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：底部的 ${sd.bottomA} 和 ${sd.bottomB} 没有公因数了，停止`,
        en: `${narrator}: "${sd.bottomA} and ${sd.bottomB} at the bottom share no common factor — stop"`,
      },
      hint: { zh: `${sd.bottomA} 和 ${sd.bottomB} 互质，停止`, en: `${sd.bottomA} and ${sd.bottomB} are coprime — stop` },
      highlightField: 'ans',
    });
  } else {
    // Three or more steps — show first two individually, then "continue" with final
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：继续找 ${sd.steps[0].quotientA} 和 ${sd.steps[0].quotientB} 的公因数`,
        en: `${narrator}: "Continue — find common factor of ${sd.steps[0].quotientA} and ${sd.steps[0].quotientB}"`,
      },
      hint: tryPrimesHint(1),
      highlightField: 'ans',
    });
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：继续除，直到底部两个数没有公因数`,
        en: `${narrator}: "Keep dividing until the bottom numbers share no common factor"`,
      },
      hint: { zh: `看左边的 SVG 图——所有除法步骤已完成`, en: `See the SVG diagram — all division steps complete` },
      highlightField: 'ans',
    });
  }

  // Step: read HCF
  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：读结果 -- HCF = 左边那列全部乘起来`,
      en: `${narrator}: "Read the result — HCF = multiply everything in the left column"`,
    },
    hint: {
      zh: `左边是 ${leftCol.join(' x ')} = ${hcfFromSD}\n左边的数是两个数"共同能被整除"的部分，乘起来就是最大公因数`,
      en: `Left column: ${leftCol.join(' x ')} = ${hcfFromSD}\nThe left column contains the shared divisible parts — their product is the HCF`,
    },
    highlightField: 'ans',
  });

  // Step: read LCM bonus
  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：顺便 -- LCM = 左边 x 底部全部乘起来`,
      en: `${narrator}: "Bonus — LCM = left column x bottom row, all multiplied"`,
    },
    hint: {
      zh: `${leftCol.join(' x ')} x ${sd.bottomA} x ${sd.bottomB} = ${lcmFromSD}\n左边是公共部分，底部是各自剩下的部分，合起来就是 LCM`,
      en: `${leftCol.join(' x ')} x ${sd.bottomA} x ${sd.bottomB} = ${lcmFromSD}\nLeft = shared part, bottom = remaining parts, combined = LCM`,
    },
    highlightField: 'ans',
  });

  const tutorialSteps = [
    // Phase 1: listing factors (Steps 1-6)
    {
      text: {
        zh: `${narrator}：${a} 人和 ${b} 人要分成一样大的小队。每队最多几人？先用最简单的方法——挨个试`,
        en: `${narrator}: "${a} and ${b} people split into equal squads. Max per squad? Let's try the simplest method — test one by one"`,
      },
      hint: {
        zh: '什么叫"能分"? 就是除得尽、没有余数\n比如 12/3=4，刚好分完 ✓\n12/5=2.4，有人剩下 ✗',
        en: 'What does "can be split" mean? Divides evenly, no remainder\nE.g. 12/3=4, splits perfectly ✓\n12/5=2.4, someone left over ✗',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把 ${a} 所有"能整除"的数找出来（从 1 开始试）`,
        en: `${narrator}: "Find all numbers that divide ${a} evenly (start from 1)"`,
      },
      hint: {
        zh: `${factorsA.map(f => `${a}/${f}=${a/f} ✓`).join('\n')}\n\n${a} 的因数是: ${factorsA.join(', ')}`,
        en: `${factorsA.map(f => `${a}/${f}=${a/f} ✓`).join('\n')}\n\nFactors of ${a}: ${factorsA.join(', ')}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}："因数"就是能把一个数除得尽的数。${a} 的因数是: ${factorsA.join(', ')}`,
        en: `${narrator}: "A factor is a number that divides another evenly. Factors of ${a}: ${factorsA.join(', ')}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：同样找出 ${b} 的所有因数`,
        en: `${narrator}: "Now find all factors of ${b}"`,
      },
      hint: {
        zh: `${factorsB.map(f => `${b}/${f}=${b/f} ✓`).join('\n')}\n\n${b} 的因数是: ${factorsB.join(', ')}`,
        en: `${factorsB.map(f => `${b}/${f}=${b/f} ✓`).join('\n')}\n\nFactors of ${b}: ${factorsB.join(', ')}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：找两边都有的因数——这叫"公因数"`,
        en: `${narrator}: "Find factors that appear in BOTH lists — these are 'common factors'"`,
      },
      hint: {
        zh: `${a} 的因数: ${factorsA.join(', ')}\n${b} 的因数: ${factorsB.join(', ')}\n\n两边都有的: ${commonFactors.join(', ')}`,
        en: `Factors of ${a}: ${factorsA.join(', ')}\nFactors of ${b}: ${factorsB.join(', ')}\n\nIn both: ${commonFactors.join(', ')}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：公因数里最大的是 $${h}$ -- 这就是"最大公因数"(HCF)!`,
        en: `${narrator}: "The largest common factor is $${h}$ — this is the HCF!"`,
      },
      hint: {
        zh: `公因数: ${commonFactors.join(', ')}\n最大的是 ${h}\n\n验算: ${a}/${h}=${a/h} ✓  ${b}/${h}=${b/h} ✓\n每队 ${h} 人，整编完成!`,
        en: `Common factors: ${commonFactors.join(', ')}\nLargest is ${h}\n\nVerify: ${a}/${h}=${a/h} ✓  ${b}/${h}=${b/h} ✓\n${h} per squad, done!`,
      },
      highlightField: 'ans',
    },
    // Phase 2: Short division (dynamic steps)
    ...sdTutorialSteps,
    // Phase 3: Prime factorization (3 steps)
    {
      text: {
        zh: `${narrator}：第三种方法 -- 质因数分解（和短除法本质相同，画法不同）`,
        en: `${narrator}: "Method 3 — prime factorization (same idea as short division, different notation)"`,
      },
      hint: {
        zh: `$${a} = ${factA}$\n$${b} = ${factB}$`,
        en: `$${a} = ${factA}$\n$${b} = ${factB}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：对比，共有质数取少的 = HCF`,
        en: `${narrator}: "Compare — for each common prime, take the smaller count = HCF"`,
      },
      hint: (() => {
        const fA = primeFactors(a);
        const fB = primeFactors(b);
        const lines: string[] = [];
        const enLines: string[] = [];
        for (const [p, expA] of fA) {
          const expB = fB.get(p);
          if (expB !== undefined) {
            const minExp = Math.min(expA, expB);
            lines.push(`${p}: ${a} 有 ${expA} 个，${b} 有 ${expB} 个 -> 取少的 = ${minExp} 个`);
            enLines.push(`${p}: ${a} has ${expA}, ${b} has ${expB} -> take smaller = ${minExp}`);
          }
        }
        return { zh: lines.join('\n'), en: enLines.join('\n') };
      })(),
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：HCF = $${formatFactorization(h)} = ${h}$（三种方法，同一个答案!）`,
        en: `${narrator}: "HCF = $${formatFactorization(h)} = ${h}$ (three methods, same answer!)"`,
      },
      hint: {
        zh: `验算: ${a}/${h}=${a/h} ✓  ${b}/${h}=${b/h} ✓`,
        en: `Verify: ${a}/${h}=${a/h} ✓  ${b}/${h}=${b/h} ✓`,
      },
      highlightField: 'ans',
    },
    // Summary step
    {
      text: {
        zh: `${narrator}：三种方法各有用处`,
        en: `${narrator}: "Each method has its use"`,
      },
      hint: {
        zh: '挨个试: 最简单，适合初学\n短除法: 最快，同时求 HCF 和 LCM，推荐做题用\n质因数分解: 适合理解原理',
        en: 'Test one by one: simplest, good for beginners\nShort division: fastest, gives both HCF and LCM, recommended for exams\nPrime factorization: best for understanding the theory',
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { numbers: [a, b], generatorType: 'HCF_RANDOM', sdA: a, sdB: b, sdSteps: sd.steps, sdBottomA: sd.bottomA, sdBottomB: sd.bottomB },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   LCM generator: find least common multiple of two numbers
   ══════════════════════════════════════════════════════════ */

export function generateLcmMission(template: Mission): Mission {
  const tier = getTier();
  const hcfPools = { 1: [2, 3, 4], 2: [2, 3, 4, 5, 6], 3: [4, 6, 8, 10, 12] };
  const multPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 7], 3: [3, 5, 7, 8, 11] };

  const h = pickRandom(hcfPools[tier]);
  let m1 = pickRandom(multPools[tier]);
  let m2 = pickRandom(multPools[tier]);
  while (gcdCalc(m1, m2) !== 1) {
    m2 = pickRandom(multPools[tier]);
  }
  const a = h * m1;
  const b = h * m2;
  const lcm = (a * b) / gcdCalc(a, b);

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[：:]/)?.[0]) || '军师';
  const description: BilingualText = {
    zh: `求 $${a}$ 和 $${b}$ 的最小公倍数 (LCM)。`,
    en: `Find the Least Common Multiple (LCM) of $${a}$ and $${b}$.`,
  };

  const factA = formatFactorization(a);
  const factB = formatFactorization(b);

  // Helper: list multiples up to lcm
  const multiplesA: number[] = [];
  for (let i = 1; i * a <= lcm; i++) multiplesA.push(i * a);
  const multiplesB: number[] = [];
  for (let i = 1; i * b <= lcm; i++) multiplesB.push(i * b);
  const commonMultiples = multiplesA.filter(m => multiplesB.includes(m));

  // Phase 2: Short division
  const sdL = shortDivision(a, b);
  const leftColL = sdL.steps.map(s => s.prime);
  const hcfFromSDL = leftColL.reduce((p, c) => p * c, 1);
  const lcmFromSDL = hcfFromSDL * sdL.bottomA * sdL.bottomB;

  const tryPrimesHintL = (stepIdx: number): { zh: string; en: string } => {
    const prevA = stepIdx === 0 ? a : sdL.steps[stepIdx - 1].quotientA;
    const prevB = stepIdx === 0 ? b : sdL.steps[stepIdx - 1].quotientB;
    const step = sdL.steps[stepIdx];
    const zhLines: string[] = [];
    const enLines: string[] = [];
    for (let p = 2; p <= step.prime; p++) {
      const divA = prevA % p === 0;
      const divB = prevB % p === 0;
      if (divA && divB) {
        zhLines.push(`${p} 能同时整除 ${prevA} 和 ${prevB}? ${prevA}/${p}=${prevA/p} ✓  ${prevB}/${p}=${prevB/p} ✓ -- 可以!`);
        enLines.push(`Does ${p} divide both ${prevA} and ${prevB}? ${prevA}/${p}=${prevA/p} ✓  ${prevB}/${p}=${prevB/p} ✓ -- Yes!`);
      } else {
        const reason = !divA ? `${prevA}/${p} 除不尽` : `${prevB}/${p} 除不尽`;
        const enReason = !divA ? `${prevA}/${p} not exact` : `${prevB}/${p} not exact`;
        zhLines.push(`${p} 能同时整除 ${prevA} 和 ${prevB}? ${reason} ✗`);
        enLines.push(`Does ${p} divide both ${prevA} and ${prevB}? ${enReason} ✗`);
      }
    }
    return { zh: zhLines.join('\n'), en: enLines.join('\n') };
  };

  const sdLcmSteps: { text: { zh: string; en: string }; hint?: { zh: string; en: string }; highlightField: string }[] = [];

  // Intro
  sdLcmSteps.push({
    text: {
      zh: `${narrator}：和 HCF 的短除法画法完全一样 -- 只是读结果不同`,
      en: `${narrator}: "Same short division diagram as HCF — just read the result differently"`,
    },
    hint: {
      zh: '把两个数并排写，找能同时整除两个数的质数，写在左边',
      en: 'Write both numbers side by side, find a prime that divides both, write it on the left',
    },
    highlightField: 'ans',
  });

  // First division
  sdLcmSteps.push({
    text: {
      zh: `${narrator}：找能同时整除 $${a}$ 和 $${b}$ 的最小质数`,
      en: `${narrator}: "Find the smallest prime that divides both $${a}$ and $${b}$"`,
    },
    hint: tryPrimesHintL(0),
    highlightField: 'ans',
  });

  if (sdL.steps.length === 1) {
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：底部的 ${sdL.bottomA} 和 ${sdL.bottomB} 没有公因数了，停止`,
        en: `${narrator}: "${sdL.bottomA} and ${sdL.bottomB} at the bottom share no common factor — stop"`,
      },
      hint: { zh: `看左边的图——除法已完成`, en: `See the diagram — division complete` },
      highlightField: 'ans',
    });
  } else if (sdL.steps.length === 2) {
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：继续找 ${sdL.steps[0].quotientA} 和 ${sdL.steps[0].quotientB} 的公因数`,
        en: `${narrator}: "Continue — find common factor of ${sdL.steps[0].quotientA} and ${sdL.steps[0].quotientB}"`,
      },
      hint: tryPrimesHintL(1),
      highlightField: 'ans',
    });
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：底部的 ${sdL.bottomA} 和 ${sdL.bottomB} 没有公因数了，停止`,
        en: `${narrator}: "${sdL.bottomA} and ${sdL.bottomB} at the bottom share no common factor — stop"`,
      },
      hint: { zh: `看左边的图——除法已完成`, en: `See the diagram — division complete` },
      highlightField: 'ans',
    });
  } else {
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：继续找 ${sdL.steps[0].quotientA} 和 ${sdL.steps[0].quotientB} 的公因数`,
        en: `${narrator}: "Continue — find common factor of ${sdL.steps[0].quotientA} and ${sdL.steps[0].quotientB}"`,
      },
      hint: tryPrimesHintL(1),
      highlightField: 'ans',
    });
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：继续除，直到底部两个数没有公因数`,
        en: `${narrator}: "Keep dividing until the bottom numbers share no common factor"`,
      },
      hint: { zh: `看左边的图——除法已完成`, en: `See the diagram — division complete` },
      highlightField: 'ans',
    });
  }

  // Read LCM result
  sdLcmSteps.push({
    text: {
      zh: `${narrator}：LCM = 左边 x 底部全部乘起来`,
      en: `${narrator}: "LCM = left column x bottom row, all multiplied"`,
    },
    hint: {
      zh: `${leftColL.join(' x ')} x ${sdL.bottomA} x ${sdL.bottomB} = ${lcmFromSDL}\n左边是公共部分，底部是各自剩下的部分，合起来就是 LCM`,
      en: `${leftColL.join(' x ')} x ${sdL.bottomA} x ${sdL.bottomB} = ${lcmFromSDL}\nLeft = shared part, bottom = remaining parts, combined = LCM`,
    },
    highlightField: 'ans',
  });

  // Why explanation
  sdLcmSteps.push({
    text: {
      zh: `${narrator}：为什么? $${a}$ 和 $${b}$ 的质因数，合并但不重复算左边的`,
      en: `${narrator}: "Why? Merge the prime factors of $${a}$ and $${b}$, but don't double-count the left column"`,
    },
    hint: {
      zh: `$${a} = ${factA}$\n$${b} = ${factB}$\n左边(${leftColL.join(' x ')})已经是两个数共有的部分\n底部(${sdL.bottomA}, ${sdL.bottomB})是各自独有的部分\n全乘 = 不重不漏包含所有质因数`,
      en: `$${a} = ${factA}$\n$${b} = ${factB}$\nLeft (${leftColL.join(' x ')}) = shared factors\nBottom (${sdL.bottomA}, ${sdL.bottomB}) = unique remainders\nMultiply all = cover every prime factor without double-counting`,
    },
    highlightField: 'ans',
  });

  const tutorialSteps = [
    // Phase 1: listing multiples (Steps 1-5)
    {
      text: {
        zh: `${narrator}：先用最笨的方法——把两个数的倍数都列出来，看哪个最先撞上`,
        en: `${narrator}: "Let's start with the simplest method — list out multiples of both numbers and see which one matches first"`,
      },
      hint: {
        zh: '倍数就是用这个数乘以 1, 2, 3, 4...得到的数',
        en: 'Multiples are what you get by multiplying the number by 1, 2, 3, 4...',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：列出 $${a}$ 的倍数`,
        en: `${narrator}: "List the multiples of $${a}$"`,
      },
      hint: {
        zh: `${multiplesA.join(', ')}`,
        en: `${multiplesA.join(', ')}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：列出 $${b}$ 的倍数`,
        en: `${narrator}: "List the multiples of $${b}$"`,
      },
      hint: {
        zh: `${multiplesB.join(', ')}`,
        en: `${multiplesB.join(', ')}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：找两边都有的——第一个就是最小公倍数`,
        en: `${narrator}: "Find the ones in BOTH lists — the first match is the LCM"`,
      },
      hint: {
        zh: `$${a}$ 的倍数: ${multiplesA.join(', ')}\n$${b}$ 的倍数: ${multiplesB.join(', ')}\n\n两边都有的: ${commonMultiples.join(', ')}\n最小的是 ${lcm}`,
        en: `Multiples of $${a}$: ${multiplesA.join(', ')}\nMultiples of $${b}$: ${multiplesB.join(', ')}\n\nIn both: ${commonMultiples.join(', ')}\nSmallest is ${lcm}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：LCM($${a}$, $${b}$) = $${lcm}$! 验算: $${lcm} \\div ${a} = ${lcm/a}$ \\checkmark  $${lcm} \\div ${b} = ${lcm/b}$ \\checkmark`,
        en: `${narrator}: "LCM($${a}$, $${b}$) = $${lcm}$! Check: $${lcm} \\div ${a} = ${lcm/a}$ \\checkmark  $${lcm} \\div ${b} = ${lcm/b}$ \\checkmark"`,
      },
      hint: {
        zh: '"同时能被两个数整除的最小数"叫最小公倍数(LCM)',
        en: 'The smallest number divisible by both numbers is called the Least Common Multiple (LCM)',
      },
      highlightField: 'ans',
    },
    // Phase 2: Short division (dynamic steps)
    ...sdLcmSteps,
    // Phase 3: Prime factorization (3 steps)
    {
      text: {
        zh: `${narrator}：第三种方法 -- 质因数分解（和短除法本质相同，画法不同）`,
        en: `${narrator}: "Method 3 — prime factorization (same idea as short division, different notation)"`,
      },
      hint: {
        zh: `$${a} = ${factA}$\n$${b} = ${factB}$`,
        en: `$${a} = ${factA}$\n$${b} = ${factB}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：注意 -- 和 HCF 正好相反! HCF 取少的，LCM 取多的`,
        en: `${narrator}: "Note — opposite of HCF! HCF takes smaller count, LCM takes larger"`,
      },
      hint: (() => {
        const fA = primeFactors(a);
        const fB = primeFactors(b);
        const allPrimes = new Set([...fA.keys(), ...fB.keys()]);
        const lines: string[] = [];
        const enLines: string[] = [];
        for (const p of [...allPrimes].sort((x, y) => x - y)) {
          const expA = fA.get(p) || 0;
          const expB = fB.get(p) || 0;
          lines.push(`${p}: $${a}$ 有 ${expA} 个，$${b}$ 有 ${expB} 个 -> 取多的 = ${Math.max(expA, expB)} 个`);
          enLines.push(`${p}: $${a}$ has ${expA}, $${b}$ has ${expB} -> take larger = ${Math.max(expA, expB)}`);
        }
        return { zh: lines.join('\n'), en: enLines.join('\n') };
      })(),
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：LCM = $${formatFactorization(lcm)} = ${lcm}$（三种方法，同一个答案!）`,
        en: `${narrator}: "LCM = $${formatFactorization(lcm)} = ${lcm}$ (three methods, same answer!)"`,
      },
      hint: {
        zh: `验算: $${lcm} \\div ${a} = ${lcm/a}$ \\checkmark  $${lcm} \\div ${b} = ${lcm/b}$ \\checkmark`,
        en: `Verify: $${lcm} \\div ${a} = ${lcm/a}$ \\checkmark  $${lcm} \\div ${b} = ${lcm/b}$ \\checkmark`,
      },
      highlightField: 'ans',
    },
    // Summary step
    {
      text: {
        zh: `${narrator}：三种方法各有用处`,
        en: `${narrator}: "Each method has its use"`,
      },
      hint: {
        zh: '列倍数: 最简单，适合初学\n短除法: 最快，同时求 HCF 和 LCM，推荐做题用\n质因数分解: 适合理解原理',
        en: 'List multiples: simplest, good for beginners\nShort division: fastest, gives both HCF and LCM, recommended for exams\nPrime factorization: best for understanding the theory',
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { numbers: [a, b], generatorType: 'LCM_RANDOM', sdA: a, sdB: b, sdSteps: sdL.steps, sdBottomA: sdL.bottomA, sdBottomB: sdL.bottomB },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   INTEGER_ADD generator: positive/negative number addition/subtraction
   ══════════════════════════════════════════════════════════ */

export function generateIntegerAddMission(template: Mission): Mission {
  const tier = getTier();
  const posPools = { 1: [5, 10, 15, 20, 25, 30], 2: [10, 20, 30, 40, 50], 3: [25, 40, 55, 70, 85, 100] };
  const negPools = { 1: [-5, -10, -15, -20], 2: [-10, -20, -30, -40, -50], 3: [-25, -40, -55, -70, -85] };

  // Generate operation: positive+negative, negative+negative, or mixed
  const mode = pickRandom(['pos_neg', 'neg_neg', 'mixed'] as const);
  let a: number, b: number, op: string, answer: number;

  if (mode === 'pos_neg') {
    a = pickRandom(posPools[tier]);
    b = pickRandom(negPools[tier]);
    op = '+';
    answer = a + b;
  } else if (mode === 'neg_neg') {
    a = pickRandom(negPools[tier]);
    b = pickRandom(negPools[tier]);
    op = '+';
    answer = a + b;
  } else {
    a = pickRandom([...posPools[tier], ...negPools[tier]]);
    b = pickRandom(posPools[tier]);
    op = '-';
    answer = a - b;
  }

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[：:]/)?.[0]) || '军师';
  const bStr = b < 0 ? `(${b})` : `${b}`;
  const exprStr = `${a} ${op} ${bStr}`;

  const description: BilingualText = {
    zh: `计算 $${exprStr}$`,
    en: `Calculate $${exprStr}$`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：正数代表"有"、"得到"；负数代表"没有"、"失去"`,
        en: `${narrator}: "Positive = 'have' or 'gain'; Negative = 'don't have' or 'lose'"`,
      },
      hint: {
        zh: '想象一条数线：\n...−3, −2, −1, 0, 1, 2, 3...\n右边是正数（越来越多）\n左边是负数（越来越少）',
        en: 'Imagine a number line:\n...−3, −2, −1, 0, 1, 2, 3...\nRight = positive (more)\nLeft = negative (less)',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：题目是 $${exprStr}$，来算一算`,
        en: `${narrator}: "The expression is $${exprStr}$, let's work it out"`,
      },
      highlightField: 'ans',
    },
    // Case A: positive + negative
    ...(op === '+' && a >= 0 && b < 0 ? [
      {
        text: {
          zh: `${narrator}：口袋有 $${a}$，花掉了 $${Math.abs(b)}$——加一个负数就是减去它`,
          en: `${narrator}: "Have $${a}$, spend $${Math.abs(b)}$ — adding a negative means subtracting it"`,
        },
        hint: {
          zh: `$${b}$ 是负数，去掉负号就是 ${Math.abs(b)}\n所以"加 $${b}$"就是"减 ${Math.abs(b)}"`,
          en: `$${b}$ is negative, without the sign it's ${Math.abs(b)}\nSo "add $${b}$" means "subtract ${Math.abs(b)}"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：$${a} + (${b}) = ${a} - ${Math.abs(b)} = ${answer}$`,
          en: `${narrator}: "$${a} + (${b}) = ${a} - ${Math.abs(b)} = ${answer}$"`,
        },
        hint: {
          zh: `数线验算：从 ${a} 出发，往左走 ${Math.abs(b)} 步，到 ${answer}`,
          en: `Number line: start at ${a}, go left ${Math.abs(b)} steps, reach ${answer}`,
        },
        highlightField: 'ans',
      },
    ] : op === '+' && a < 0 && b < 0 ? [
      // Case B: negative + negative
      {
        text: {
          zh: `${narrator}：第一笔亏了 ${Math.abs(a)}，第二笔又亏了 ${Math.abs(b)}——两笔亏损叠加`,
          en: `${narrator}: "First loss: ${Math.abs(a)}. Second loss: ${Math.abs(b)} — losses add up"`,
        },
        hint: {
          zh: '两个都是亏的，总亏损 = 两个数字加起来，结果取负号',
          en: 'Both are losses, total loss = add the numbers, result is negative',
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：去掉负号：${Math.abs(a)} 和 ${Math.abs(b)}，加起来 = ${Math.abs(a) + Math.abs(b)}，加回负号 → $${answer}$`,
          en: `${narrator}: "Remove signs: ${Math.abs(a)} and ${Math.abs(b)}, add = ${Math.abs(a) + Math.abs(b)}, add back minus → $${answer}$"`,
        },
        hint: {
          zh: `数线验算：从 0 往左 ${Math.abs(a)} 步到 ${a}，再往左 ${Math.abs(b)} 步到 ${answer}`,
          en: `Number line: from 0 go left ${Math.abs(a)} to ${a}, then left ${Math.abs(b)} more to ${answer}`,
        },
        highlightField: 'ans',
      },
    ] : op === '-' && a >= 0 && b <= a ? [
      // Case C: big - small (positive result)
      {
        text: {
          zh: `${narrator}：有 ${a}，减去 ${b}——减得够，直接减`,
          en: `${narrator}: "Have ${a}, subtract ${b} — enough to subtract, just do it"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：$${a} - ${b} = ${answer}$`,
          en: `${narrator}: "$${a} - ${b} = ${answer}$"`,
        },
        hint: {
          zh: `数线验算：从 ${a} 出发，往左走 ${b} 步，到 ${answer}`,
          en: `Number line: start at ${a}, go left ${b} steps, reach ${answer}`,
        },
        highlightField: 'ans',
      },
    ] : op === '-' && a >= 0 && b > a ? [
      // Case D: small - big (negative result)
      {
        text: {
          zh: `${narrator}：只有 ${a}，要减去 ${b}——减不够！缺口是多少？`,
          en: `${narrator}: "Only have ${a}, need to subtract ${b} — not enough! What's the gap?"`,
        },
        hint: {
          zh: `${b} 比 ${a} 大，减不够，结果会变成负数`,
          en: `${b} is bigger than ${a}, can't subtract fully, result will be negative`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：交换算差值：$${b} - ${a} = ${b - a}$，加负号 → $${answer}$`,
          en: `${narrator}: "Swap and find difference: $${b} - ${a} = ${b - a}$, add minus → $${answer}$"`,
        },
        hint: {
          zh: `数线验算：从 ${a} 出发，往左走 ${b} 步，经过 0，到 ${answer}`,
          en: `Number line: from ${a}, go left ${b} steps, past 0, reach ${answer}`,
        },
        highlightField: 'ans',
      },
    ] : [
      // Case E: negative - positive
      {
        text: {
          zh: `${narrator}：已经亏了 ${Math.abs(a)}，再额外消耗 ${b}——亏损在增加`,
          en: `${narrator}: "Already lost ${Math.abs(a)}, spend ${b} more — losses grow"`,
        },
        hint: {
          zh: '已经在负数区，再减正数，就是往更负的方向走',
          en: 'Already in negative territory, subtracting positive goes even more negative',
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：两个亏损加起来：${Math.abs(a)} + ${b} = ${Math.abs(a) + b}，取负号 → $${answer}$`,
          en: `${narrator}: "Add both losses: ${Math.abs(a)} + ${b} = ${Math.abs(a) + b}, make negative → $${answer}$"`,
        },
        hint: {
          zh: `数线验算：从 ${a} 出发，往左走 ${b} 步，到 ${answer}`,
          en: `Number line: from ${a}, go left ${b} steps, reach ${answer}`,
        },
        highlightField: 'ans',
      },
    ]),
    // Final step for all cases
    {
      text: {
        zh: `${narrator}：$${exprStr} = ${answer}$，账算清了！`,
        en: `${narrator}: "$${exprStr} = ${answer}$, all accounted for!"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, op, answer, generatorType: 'INTEGER_ADD_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FRAC_ADD generator: fraction addition/subtraction
   ══════════════════════════════════════════════════════════ */

export function generateFracAddMission(template: Mission): Mission {
  const tier = getTier();
  const denPools = { 1: [2, 3, 4, 5, 6], 2: [3, 4, 5, 6, 8, 10], 3: [4, 5, 6, 7, 8, 9, 10, 12] };

  const d1 = pickRandom(denPools[tier]);
  let d2 = pickRandom(denPools[tier]);
  while (d2 === d1) d2 = pickRandom(denPools[tier]); // different denominators

  // Ensure numerators < denominators (proper fractions)
  const n1 = pickRandom(Array.from({ length: d1 - 1 }, (_, i) => i + 1));
  const n2 = pickRandom(Array.from({ length: d2 - 1 }, (_, i) => i + 1));

  const isSubtract = pickRandom([true, false]);
  const lcd = (d1 * d2) / gcdCalc(d1, d2);
  const adjN1 = n1 * (lcd / d1);
  const adjN2 = n2 * (lcd / d2);

  // Guard: if subtraction would give 0 (equal fractions), regenerate
  if (isSubtract && adjN1 === adjN2) return generateFracAddMission(template);

  let ansNum: number, ansDen: number;
  if (isSubtract) {
    // Make sure result is positive
    if (adjN1 >= adjN2) {
      ansNum = adjN1 - adjN2;
    } else {
      ansNum = adjN2 - adjN1;
    }
  } else {
    ansNum = adjN1 + adjN2;
  }
  ansDen = lcd;

  // Simplify
  const g = gcdCalc(Math.abs(ansNum), ansDen);
  ansNum = ansNum / g;
  ansDen = ansDen / g;

  // Make sure first fraction is larger for subtraction
  let dispN1 = n1, dispD1 = d1, dispN2 = n2, dispD2 = d2;
  if (isSubtract && adjN1 < adjN2) {
    dispN1 = n2; dispD1 = d2; dispN2 = n1; dispD2 = d1;
  }

  const op = isSubtract ? '-' : '+';
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[：:]/)?.[0]) || '军师';

  const description: BilingualText = {
    zh: `计算 $\\frac{${dispN1}}{${dispD1}} ${op} \\frac{${dispN2}}{${dispD2}}$`,
    en: `Calculate $\\frac{${dispN1}}{${dispD1}} ${op} \\frac{${dispN2}}{${dispD2}}$`,
  };

  const recalcLcd = (dispD1 * dispD2) / gcdCalc(dispD1, dispD2);
  const recalcAdjN1 = dispN1 * (recalcLcd / dispD1);
  const recalcAdjN2 = dispN2 * (recalcLcd / dispD2);
  const ansDisplay = ansDen === 1 ? `${ansNum}` : `\\frac{${ansNum}}{${ansDen}}`;
  const rawAns = isSubtract ? recalcAdjN1 - recalcAdjN2 : recalcAdjN1 + recalcAdjN2;
  const needsSimplify = ansNum !== rawAns || ansDen !== recalcLcd;

  // Helper: generate multiples list for finding LCD
  const multiplesForLCD = (() => {
    const mults: string[] = [];
    const enMults: string[] = [];
    for (let i = 1; i <= recalcLcd / dispD1; i++) {
      const m = dispD1 * i;
      const ok = m % dispD2 === 0;
      if (ok) {
        mults.push(`${m} → ${m}÷${dispD2}=${m/dispD2} ✓ 找到了！`);
        enMults.push(`${m} → ${m}÷${dispD2}=${m/dispD2} ✓ Found it!`);
      } else {
        mults.push(`${m} → ${m}÷${dispD2}=${(m/dispD2).toFixed(1)} ✗`);
        enMults.push(`${m} → ${m}÷${dispD2}=${(m/dispD2).toFixed(1)} ✗`);
      }
    }
    return { zh: mults.join('\n'), en: enMults.join('\n') };
  })();

  const k1 = recalcLcd / dispD1;
  const k2 = recalcLcd / dispD2;

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：先别急着算。想象一下——你有一块饼切成 ${dispD1} 份，我有一块同样大的饼切成 ${dispD2} 份`,
        en: `${narrator}: "Don't rush. Imagine — your pie is cut into ${dispD1} pieces, my pie into ${dispD2} pieces"`,
      },
      hint: {
        zh: `你的 1 份和我的 1 份大小不一样！\n切成 ${dispD1} 份和切成 ${dispD2} 份，每份大小不同\n不统一成一样大的份，就没法直接${isSubtract ? '减' : '加'}`,
        en: `Your 1 piece and my 1 piece are different sizes!\n${dispD1} pieces vs ${dispD2} pieces — each piece is a different size\nCan't ${isSubtract ? 'subtract' : 'add'} until pieces are the same size`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：要把两块饼都切成一样多的份——找一个数，既能被 ${dispD1} 整除，也能被 ${dispD2} 整除`,
        en: `${narrator}: "Cut both pies into the same number of pieces — find a number divisible by both ${dispD1} and ${dispD2}"`,
      },
      hint: {
        zh: `列出 ${dispD1} 的倍数，看哪个也能被 ${dispD2} 整除：\n${multiplesForLCD.zh}\n\n公分母 = ${recalcLcd}`,
        en: `List multiples of ${dispD1}, check which is also divisible by ${dispD2}:\n${multiplesForLCD.en}\n\nCommon denominator = ${recalcLcd}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把 $\\frac{${dispN1}}{${dispD1}}$ 变成分母是 ${recalcLcd} 的分数`,
        en: `${narrator}: "Convert $\\frac{${dispN1}}{${dispD1}}$ to denominator ${recalcLcd}"`,
      },
      hint: {
        zh: `分母 ${dispD1}→${recalcLcd}，乘了 ${k1}\n分子也必须乘 ${k1}（不然分数的值就变了）\n${dispN1}×${k1}=${recalcAdjN1}\n\n$\\frac{${dispN1}}{${dispD1}} = \\frac{${recalcAdjN1}}{${recalcLcd}}$`,
        en: `Denominator ${dispD1}→${recalcLcd}, multiplied by ${k1}\nNumerator must also ×${k1} (otherwise fraction value changes)\n${dispN1}×${k1}=${recalcAdjN1}\n\n$\\frac{${dispN1}}{${dispD1}} = \\frac{${recalcAdjN1}}{${recalcLcd}}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把 $\\frac{${dispN2}}{${dispD2}}$ 也变成分母是 ${recalcLcd} 的分数`,
        en: `${narrator}: "Convert $\\frac{${dispN2}}{${dispD2}}$ to denominator ${recalcLcd} too"`,
      },
      hint: {
        zh: `分母 ${dispD2}→${recalcLcd}，乘了 ${k2}\n分子也乘 ${k2}：${dispN2}×${k2}=${recalcAdjN2}\n\n$\\frac{${dispN2}}{${dispD2}} = \\frac{${recalcAdjN2}}{${recalcLcd}}$`,
        en: `Denominator ${dispD2}→${recalcLcd}, multiplied by ${k2}\nNumerator also ×${k2}: ${dispN2}×${k2}=${recalcAdjN2}\n\n$\\frac{${dispN2}}{${dispD2}} = \\frac{${recalcAdjN2}}{${recalcLcd}}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：现在都是 ${recalcLcd} 份里的几份了——直接${isSubtract ? '减' : '加'}分子！`,
        en: `${narrator}: "Now both are out of ${recalcLcd} — just ${isSubtract ? 'subtract' : 'add'} the numerators!"`,
      },
      hint: {
        zh: `$\\frac{${recalcAdjN1}}{${recalcLcd}} ${op} \\frac{${recalcAdjN2}}{${recalcLcd}} = \\frac{${recalcAdjN1} ${op} ${recalcAdjN2}}{${recalcLcd}} = \\frac{${rawAns}}{${recalcLcd}}$\n\n分母不变，只${isSubtract ? '减' : '加'}分子`,
        en: `$\\frac{${recalcAdjN1}}{${recalcLcd}} ${op} \\frac{${recalcAdjN2}}{${recalcLcd}} = \\frac{${rawAns}}{${recalcLcd}}$\n\nDenominator stays, just ${isSubtract ? 'subtract' : 'add'} numerators`,
      },
      highlightField: 'ans',
    },
    ...(needsSimplify ? [
      {
        text: {
          zh: `${narrator}：$\\frac{${rawAns}}{${recalcLcd}}$ 能化简吗？看分子和分母有没有公因数`,
          en: `${narrator}: "Can $\\frac{${rawAns}}{${recalcLcd}}$ be simplified? Check if numerator and denominator share a factor"`,
        },
        hint: {
          zh: `${rawAns} 和 ${recalcLcd} 的公因数是 ${gcdCalc(rawAns, recalcLcd)}\n分子分母都除以 ${gcdCalc(rawAns, recalcLcd)}：\n$\\frac{${rawAns}÷${gcdCalc(rawAns, recalcLcd)}}{${recalcLcd}÷${gcdCalc(rawAns, recalcLcd)}} = ${ansDisplay}$`,
          en: `${rawAns} and ${recalcLcd} share factor ${gcdCalc(rawAns, recalcLcd)}\nDivide both by ${gcdCalc(rawAns, recalcLcd)}:\n$\\frac{${rawAns}÷${gcdCalc(rawAns, recalcLcd)}}{${recalcLcd}÷${gcdCalc(rawAns, recalcLcd)}} = ${ansDisplay}$`,
        },
        highlightField: 'ans',
      },
    ] : [
      {
        text: {
          zh: `${narrator}：$\\frac{${rawAns}}{${recalcLcd}}$ 能化简吗？${rawAns} 和 ${recalcLcd} 没有公因数，已经是最简了`,
          en: `${narrator}: "Can $\\frac{${rawAns}}{${recalcLcd}}$ be simplified? ${rawAns} and ${recalcLcd} share no factors — already simplest"`,
        },
        highlightField: 'ans',
      },
    ]),
    {
      text: {
        zh: `${narrator}：答案是 $${ansDisplay}$！\n验算：$${ansNum/ansDen}$ ≈ ${(ansNum/ansDen).toFixed(3)}`,
        en: `${narrator}: "Answer: $${ansDisplay}$!\nCheck: $${ansNum/ansDen}$ ≈ ${(ansNum/ansDen).toFixed(3)}"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n1: dispN1, d1: dispD1, n2: dispN2, d2: dispD2, op, ansNum, ansDen, generatorType: 'FRAC_ADD_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FRAC_MUL generator: fraction multiplication/division
   ══════════════════════════════════════════════════════════ */

export function generateFracMulMission(template: Mission): Mission {
  const tier = getTier();
  const denPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8], 3: [3, 4, 5, 6, 7, 8, 9, 10] };

  const d1 = pickRandom(denPools[tier]);
  const d2 = pickRandom(denPools[tier]);
  const n1 = pickRandom(Array.from({ length: d1 - 1 }, (_, i) => i + 1));
  const n2 = pickRandom(Array.from({ length: d2 - 1 }, (_, i) => i + 1));

  // Respect template's op: 'div' forces division, 'mul' forces multiplication, otherwise random
  const isDivide = template.data?.op === 'div' ? true : template.data?.op === 'mul' ? false : pickRandom([true, false]);

  let ansNum: number, ansDen: number;
  if (isDivide) {
    // a/b / c/d = a/b * d/c = (a*d)/(b*c)
    ansNum = n1 * d2;
    ansDen = d1 * n2;
  } else {
    // a/b * c/d = (a*c)/(b*d)
    ansNum = n1 * n2;
    ansDen = d1 * d2;
  }

  // Simplify
  const g = gcdCalc(Math.abs(ansNum), Math.abs(ansDen));
  ansNum = ansNum / g;
  ansDen = ansDen / g;

  const op = isDivide ? '\\div' : '\\times';
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[：:]/)?.[0]) || '军师';

  const description: BilingualText = {
    zh: `计算 $\\frac{${n1}}{${d1}} ${op} \\frac{${n2}}{${d2}}$`,
    en: `Calculate $\\frac{${n1}}{${d1}} ${op} \\frac{${n2}}{${d2}}$`,
  };

  const ansDisplay = ansDen === 1 ? `${ansNum}` : `\\frac{${ansNum}}{${ansDen}}`;
  const rawNum = isDivide ? n1 * d2 : n1 * n2;
  const rawDen = isDivide ? d1 * n2 : d1 * d2;
  const simplifyG = gcdCalc(rawNum, rawDen);
  const needsSimplify = simplifyG > 1;

  // Integer preview for multiplication mode
    const previewTotal = d1 * d2;
    const previewFirst = previewTotal * n1 / d1; // n1/d1 of total
    const previewSecond = previewFirst * n2 / d2; // n2/d2 of previewFirst

  const tutorialSteps = isDivide ? [
    {
      text: {
        zh: `${narrator}：先用整数建立直觉`,
        en: `${narrator}: "Let's build intuition with whole numbers first"`,
      },
      hint: {
        zh: `有 6 个苹果，每人分 2 个：$6 \\div 2 = 3$ 人\n有 6 个苹果，每人分 $\\frac{1}{2}$ 个：$6 \\div \\frac{1}{2} = 12$ 人\n注意：$6 \\div \\frac{1}{2} = 6 \\times 2 = 12$\n除以 $\\frac{1}{2}$，等于乘以 2`,
        en: `6 apples, 2 per person: $6 \\div 2 = 3$ people\n6 apples, $\\frac{1}{2}$ per person: $6 \\div \\frac{1}{2} = 12$ people\nNotice: $6 \\div \\frac{1}{2} = 6 \\times 2 = 12$\nDividing by $\\frac{1}{2}$ = multiplying by 2`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：为什么"除以分数 = 乘以倒数"？`,
        en: `${narrator}: "Why does dividing by a fraction = multiplying by its reciprocal?"`,
      },
      hint: {
        zh: `$\\frac{${n2}}{${d2}}$ 的倒数是 $\\frac{${d2}}{${n2}}$（分子分母互换）\n除以 $\\frac{${n2}}{${d2}}$ = 乘以 $\\frac{${d2}}{${n2}}$`,
        en: `The reciprocal of $\\frac{${n2}}{${d2}}$ is $\\frac{${d2}}{${n2}}$ (swap numerator and denominator)\nDividing by $\\frac{${n2}}{${d2}}$ = multiplying by $\\frac{${d2}}{${n2}}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：回到题目——把除法变成乘法\n$\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}} = \\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}}$`,
        en: `${narrator}: "Back to our problem — turn division into multiplication"\n$\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}} = \\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：分子乘分子，分母乘分母\n$\\frac{${n1} \\times ${d2}}{${d1} \\times ${n2}} = \\frac{${rawNum}}{${rawDen}}$`,
        en: `${narrator}: "Multiply tops, multiply bottoms"\n$\\frac{${n1} \\times ${d2}}{${d1} \\times ${n2}} = \\frac{${rawNum}}{${rawDen}}$`,
      },
      highlightField: 'ans',
    },
    ...(needsSimplify ? [{
      text: {
        zh: `${narrator}：化简——${rawNum} 和 ${rawDen} 的最大公因数是 ${simplifyG}`,
        en: `${narrator}: "Simplify — the HCF of ${rawNum} and ${rawDen} is ${simplifyG}"`,
      },
      hint: {
        zh: `分子分母都除以 ${simplifyG}：$\\frac{${rawNum}\\div${simplifyG}}{${rawDen}\\div${simplifyG}} = ${ansDisplay}$`,
        en: `Divide both by ${simplifyG}: $\\frac{${rawNum}\\div${simplifyG}}{${rawDen}\\div${simplifyG}} = ${ansDisplay}$`,
      },
      highlightField: 'ans',
    }] : []),
    {
      text: {
        zh: `${narrator}：答案是 $${ansDisplay}$`,
        en: `${narrator}: "The answer is $${ansDisplay}$"`,
      },
      hint: {
        zh: `验算：${(ansNum/ansDen).toFixed(3)}`,
        en: `Check: ${(ansNum/ansDen).toFixed(3)}`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：分数乘法就是"取一部分的一部分"——先用整数感受一下`,
        en: `${narrator}: "Fraction multiplication means 'a part of a part' — let's feel it with whole numbers first"`,
      },
      hint: {
        zh: `想象有 ${previewTotal} 袋粮食\n先取 $\\frac{${n1}}{${d1}}$：${previewTotal} × $\\frac{${n1}}{${d1}}$ = ${previewFirst} 袋\n再取其中的 $\\frac{${n2}}{${d2}}$：${previewFirst} × $\\frac{${n2}}{${d2}}$ = ${previewSecond} 袋\n${previewSecond} 袋占原来 ${previewTotal} 袋的 $\\frac{${previewSecond}}{${previewTotal}}$`,
        en: `Imagine ${previewTotal} bags of grain\nTake $\\frac{${n1}}{${d1}}$: ${previewTotal} × $\\frac{${n1}}{${d1}}$ = ${previewFirst} bags\nThen take $\\frac{${n2}}{${d2}}$ of those: ${previewFirst} × $\\frac{${n2}}{${d2}}$ = ${previewSecond} bags\n${previewSecond} bags out of ${previewTotal} = $\\frac{${previewSecond}}{${previewTotal}}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：分数乘法的规则——分子乘分子，分母乘分母`,
        en: `${narrator}: "The rule for fraction multiplication — multiply tops, multiply bottoms"`,
      },
      hint: {
        zh: '$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$',
        en: '$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：代入计算：$\\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${rawNum}}{${rawDen}}$`,
        en: `${narrator}: "Substitute and calculate: $\\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${rawNum}}{${rawDen}}$"`,
      },
      highlightField: 'ans',
    },
    ...(needsSimplify ? [{
      text: {
        zh: `${narrator}：化简——${rawNum} 和 ${rawDen} 的最大公因数是 ${simplifyG}`,
        en: `${narrator}: "Simplify — the HCF of ${rawNum} and ${rawDen} is ${simplifyG}"`,
      },
      hint: {
        zh: `分子分母都除以 ${simplifyG}：$\\frac{${rawNum}\\div${simplifyG}}{${rawDen}\\div${simplifyG}} = ${ansDisplay}$`,
        en: `Divide both by ${simplifyG}: $\\frac{${rawNum}\\div${simplifyG}}{${rawDen}\\div${simplifyG}} = ${ansDisplay}$`,
      },
      highlightField: 'ans',
    }] : []),
    {
      text: {
        zh: `${narrator}：答案是 $${ansDisplay}$`,
        en: `${narrator}: "The answer is $${ansDisplay}$"`,
      },
      hint: {
        zh: `分数乘法的结果通常比原来的数更小——取一部分的一部分，当然更少\n验算：${(ansNum/ansDen).toFixed(3)}`,
        en: `Fraction multiplication usually gives a smaller result — a part of a part is naturally less\nCheck: ${(ansNum/ansDen).toFixed(3)}`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n1, d1, n2, d2, op: isDivide ? 'div' : 'mul', ansNum, ansDen, generatorType: 'FRAC_MUL_RANDOM' },
    tutorialSteps,
  };
}
