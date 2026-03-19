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
  | 'PRIME_RANDOM'
  | 'SQUARE_CUBE_RANDOM'
  | 'SQUARE_ROOT_RANDOM'
  | 'SUBSTITUTION_RANDOM'
  | 'PERIMETER_RECT_RANDOM'
  | 'PERCENTAGE_OF_RANDOM'
  | 'ESTIMATION_ROUND_RANDOM'
  | 'ANGLES_TRIANGLE_RANDOM'
  | 'ANGLES_POINT_RANDOM'
  | 'SEQUENCE_Y7_RANDOM'
  | 'STATISTICS_RANGE_RANDOM'
  | 'AREA_TRIANGLE_RANDOM'
  | 'FACTORS_LIST_RANDOM'
  | 'INTEGER_MUL_RANDOM'
  | 'FDP_CONVERT_RANDOM'
  | 'BODMAS_RANDOM'
  | 'SIMPLIFY_RANDOM'
  | 'STATISTICS_MODE_RANDOM'
  | 'SIMPLE_EQ_TWOSTEP_RANDOM'
  | 'COORDINATES_RANDOM'
  | 'RATIO_Y7_RANDOM'
  | 'MIXED_IMPROPER_RANDOM'
  | 'EXPAND_RANDOM'
  | 'FACTORISE_RANDOM'
  | 'INEQUALITY_RANDOM'
  | 'STD_FORM_RANDOM'
  | 'SPEED_RANDOM'
  | 'CIRCLE_Y8_RANDOM'
  | 'VOLUME_Y8_RANDOM'
  | 'PERCENTAGE_INTEREST_RANDOM'
  | 'PARALLEL_ANGLES_RANDOM'
  | 'SYMMETRY_RANDOM'
  | 'SIMULTANEOUS_Y8_RANDOM'
  | 'RATIO_Y8_RANDOM';

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
  SQUARE_CUBE_RANDOM: generateSquareCubeMission,
  SQUARE_ROOT_RANDOM: generateSquareRootMission,
  SUBSTITUTION_RANDOM: generateSubstitutionMission,
  PERIMETER_RECT_RANDOM: generatePerimeterRectMission,
  PERCENTAGE_OF_RANDOM: generatePercentageOfMission,
  ESTIMATION_ROUND_RANDOM: generateEstimationRoundMission,
  ANGLES_TRIANGLE_RANDOM: generateAnglesTriangleMission,
  ANGLES_POINT_RANDOM: generateAnglesPointMission,
  SEQUENCE_Y7_RANDOM: generateSequenceY7Mission,
  STATISTICS_RANGE_RANDOM: generateStatsRangeMission,
  AREA_TRIANGLE_RANDOM: generateAreaTriangleMission,
  FACTORS_LIST_RANDOM: generateFactorsListMission,
  INTEGER_MUL_RANDOM: generateIntegerMulMission,
  FDP_CONVERT_RANDOM: generateFdpConvertMission,
  BODMAS_RANDOM: generateBodmasMission,
  SIMPLIFY_RANDOM: generateSimplifyMission,
  STATISTICS_MODE_RANDOM: generateStatsModeMission,
  SIMPLE_EQ_TWOSTEP_RANDOM: generateTwoStepEqMission,
  COORDINATES_RANDOM: generateCoordinatesMission,
  RATIO_Y7_RANDOM: generateRatioY7Mission,
  MIXED_IMPROPER_RANDOM: generateMixedImproperMission,
  EXPAND_RANDOM: generateExpandMission,
  FACTORISE_RANDOM: generateFactoriseMission,
  INEQUALITY_RANDOM: generateInequalityMission,
  STD_FORM_RANDOM: generateStdFormMission,
  SPEED_RANDOM: generateSpeedMission,
  CIRCLE_Y8_RANDOM: generateCircleY8Mission,
  VOLUME_Y8_RANDOM: generateVolumeY8Mission,
  PERCENTAGE_INTEREST_RANDOM: generatePercentageInterestMission,
  PARALLEL_ANGLES_RANDOM: generateParallelAnglesMission,
  SYMMETRY_RANDOM: generateSymmetryMission,
  SIMULTANEOUS_Y8_RANDOM: generateSimultaneousY8Mission,
  RATIO_Y8_RANDOM: generateRatioY8Mission,
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
        zh: `${narrator}：为什么需要算面积？——扎营得知道地盘有多大`,
        en: `${narrator}: "Why calculate area? — Setting camp means knowing how much ground we have"`,
      },
      hint: {
        zh: `搭帐篷、练兵、存粮，每件事都需要空间\n空间大小怎么衡量？→ 面积\n\n面积就是一个形状里面的空间大小\n用"平方单位"来量（想象铺满小方块）`,
        en: `Pitching tents, training soldiers, storing grain — everything needs space\nHow to measure space? → Area\n\nArea = the space inside a shape\nMeasured in "square units" (imagine filling with small squares)`,
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
    {
      text: {
        zh: `${narrator}：验算——面积合理吗？`,
        en: `${narrator}: "Verify — does the area make sense?"`,
      },
      hint: {
        zh: `$${length} \\times ${width} = ${area}$ ✓\n\n快速检查：\n• 面积一定比长和宽都大（${area} > ${length} 且 ${area} > ${width}）✓\n• 单位是"平方单位"，不是普通单位 ✓`,
        en: `$${length} \\times ${width} = ${area}$ ✓\n\nQuick check:\n• Area must be larger than both length and width (${area} > ${length} and ${area} > ${width}) ✓\n• Units are "square units", not plain units ✓`,
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
  let target = pickRandom(targetPools[tier]);
  // Ensure target ≤ total
  if (target > total) target = Math.min(...targetPools[tier].filter(t => t <= total));
  const narrator = '诸葛亮';

  const description: BilingualText = {
    zh: `随机观一象，抽中吉兆的概率是多少？`,
    en: `What is the probability of an auspicious omen?`,
  };

  const p = target / total;
  const pDisplay = Math.round(p * 10000) / 10000;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要概率？\n战场上充满不确定性——敌军动向、天气变化、伏兵位置。\n概率帮我们量化"可能性"，做出最优决策。`,
        en: `${narrator}: "Why do we need probability?\nThe battlefield is full of uncertainty — enemy movements, weather, ambush positions.\nProbability helps us quantify 'likelihood' and make the best decisions."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：概率是什么？\n概率 = 有利结果数 ÷ 总结果数\n$P = \\frac{\\text{有利结果}}{\\text{总结果}}$\n范围：$0 \\leq P \\leq 1$（$0$ = 不可能，$1$ = 一定发生）`,
        en: `${narrator}: "What is probability?\nProbability = favourable outcomes ÷ total outcomes\n$P = \\frac{\\text{favourable}}{\\text{total}}$\nRange: $0 \\leq P \\leq 1$ ($0$ = impossible, $1$ = certain)"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：找总数\n总共有多少个可能的结果？\n总结果数 = $${total}$`,
        en: `${narrator}: "Find the total\nHow many possible outcomes are there?\nTotal outcomes = $${total}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：找有利数\n我们想要的结果有多少个？\n有利结果数 = $${target}$`,
        en: `${narrator}: "Find the favourable count\nHow many outcomes do we want?\nFavourable outcomes = $${target}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：计算概率\n$P = \\frac{${target}}{${total}} = ${pDisplay}$`,
        en: `${narrator}: "Calculate the probability\n$P = \\frac{${target}}{${total}} = ${pDisplay}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：答案\n概率 $P = ${pDisplay}$`,
        en: `${narrator}: "Answer\nProbability $P = ${pDisplay}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：验算\n$0 \\leq ${pDisplay} \\leq 1$? ✓\n有利数 $${target} \\leq$ 总数 $${total}$? ✓\n概率合理！`,
        en: `${narrator}: "Verify\n$0 \\leq ${pDisplay} \\leq 1$? ✓\nFavourable $${target} \\leq$ total $${total}$? ✓\nProbability is valid!"`,
      },
      highlightField: 'p',
    },
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
  const ansDisplay = Math.round(ans * 100) / 100;
  const minP = Math.min(p1, p2);
  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么需要独立事件概率？\n战场上经常需要多路出击——两支部队同时成功的概率是多少？\n只有算清每条路线的成功率以及组合概率，才能制定最优策略。`, en: `${narrator}: "Why do we need independent event probability?\nIn battle, we often attack on multiple fronts — what's the probability both succeed?\nOnly by calculating each route's success rate and their combined probability can we devise the best strategy."` }, highlightField: 'p' },
    { text: { zh: `${narrator}：什么是独立事件?\n两个事件互不影响，一个发生不会改变另一个的概率。\n例如：抛两次硬币，第一次不影响第二次。`, en: `${narrator}: "What are independent events?\nTwo events where one happening does not affect the other.\nExample: flipping a coin twice — the first flip does not affect the second."` }, highlightField: 'p' },
    { text: { zh: `${narrator}：已知条件：\n第一个事件的概率 $P_1 = ${p1}$\n第二个事件的概率 $P_2 = ${p2}$`, en: `${narrator}: "Given:\nFirst event probability $P_1 = ${p1}$\nSecond event probability $P_2 = ${p2}$"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：独立事件的乘法法则：\n两个独立事件同时发生的概率 = 各自概率相乘\n$P(\\text{both}) = P_1 \\times P_2$`, en: `${narrator}: "Rule for independent events:\nMultiply the probabilities\n$P(\\text{both}) = P_1 \\times P_2$"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：计算：\n$P = ${p1} \\times ${p2} = ${ansDisplay}$\n答案是 $${ansDisplay}$!`, en: `${narrator}: "Calculate:\n$P = ${p1} \\times ${p2} = ${ansDisplay}$\nThe answer is $${ansDisplay}$!"` }, highlightField: 'p' },
    { text: { zh: `${narrator}：验算：\n$P_1 \\times P_2 = ${ansDisplay} \\leq \\min(P_1, P_2) = ${minP}$? ✓\n两件事同时发生的概率不可能比其中任何一件更大！`, en: `${narrator}: "Verify:\n$P_1 \\times P_2 = ${ansDisplay} \\leq \\min(P_1, P_2) = ${minP}$? ✓\nThe probability of both events can never exceed either individual probability!"` }, highlightField: 'p' },
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
        zh: `${narrator}：为什么需要"平均数"？——一个数总结全队水平`,
        en: `${narrator}: "Why do we need the 'mean'? — One number that summarizes the whole team"`,
      },
      hint: {
        zh: `士兵战力各不相同：$${values.join(', ')}$\n\n主公问："整体水平怎么样？"\n总不能把 ${count} 个数字全念一遍\n\n平均数就是——把总量平均分给每一个人\n用一个数字代表整体水平`,
        en: `Soldiers have different strengths: $${values.join(', ')}$\n\nThe lord asks: "What's the overall level?"\nCan't list all ${count} numbers\n\nThe mean = share the total equally among everyone\nOne number representing the whole group`,
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
    {
      text: {
        zh: `${narrator}：验算——平均数合理吗？`,
        en: `${narrator}: "Verify — does the mean make sense?"`,
      },
      hint: {
        zh: `平均数 $${meanRounded}$ 应该在最小值和最大值之间\n\n最小值 = $${Math.min(...values)}$\n最大值 = $${Math.max(...values)}$\n$${Math.min(...values)} \\leq ${meanRounded} \\leq ${Math.max(...values)}$ ✓\n\n反算：$${meanRounded} \\times ${count} = ${meanRounded * count}$${meanRounded * count === sum ? ' = ' + sum + ' ✓' : ' ≈ ' + sum + ' ✓'}`,
        en: `Mean $${meanRounded}$ should be between the minimum and maximum\n\nMin = $${Math.min(...values)}$\nMax = $${Math.max(...values)}$\n$${Math.min(...values)} \\leq ${meanRounded} \\leq ${Math.max(...values)}$ ✓\n\nReverse check: $${meanRounded} \\times ${count} = ${meanRounded * count}$${meanRounded * count === sum ? ' = ' + sum + ' ✓' : ' ≈ ' + sum + ' ✓'}`,
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
  const countPools: Record<DifficultyTier, number[]> = { 1: [5], 2: [5, 7], 3: [7, 9] };
  const valRanges: Record<DifficultyTier, [number, number]> = { 1: [3, 20], 2: [5, 50], 3: [10, 100] };
  const count = pickRandom(countPools[tier]);
  // Use integers for Y7 (simpler than decimals)
  const values = Array.from({ length: count }, () => randInt(valRanges[tier][0], valRanges[tier][1]));
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted[mid]; // odd count, so exact middle

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';
  const description: BilingualText = {
    zh: `求数据 $${sorted.join(', ')}$ 的中位数。`,
    en: `Find the median of $${sorted.join(', ')}$.`,
  };

  // Build position markers for visual
  const posLabels = sorted.map((v, i) => i === mid ? `**[${v}]**` : `${v}`);
  const posLabelsEn = posLabels;

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：什么是"中位数"？——排好队，站在正中间的那个人`, en: `${narrator}: "What is the median? — Line everyone up, and pick the person standing in the exact middle"` },
      hint: { zh: `想象 ${count} 个士兵按身高从矮到高站成一排\n中位数就是站在正中间的那个人的身高\n\n为什么不用平均数？\n因为平均数会被极端值"带偏"——如果队伍里混了一个巨人，平均身高会被拉高\n但中位数不受影响——巨人再高，中间那个人还是那个人`, en: `Imagine ${count} soldiers lined up by height, shortest to tallest\nThe median is the height of the person standing in the exact middle\n\nWhy not use the mean (average)?\nBecause the mean gets "pulled" by extreme values — if a giant joins, the average shoots up\nBut the median doesn't change — the middle person is still the same` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——把数据从小到大排列`, en: `${narrator}: "Step 1 — arrange the data from smallest to largest"` },
      hint: { zh: `原始数据：$${values.join(', ')}$\n\n排序后：$${sorted.join(', ')}$\n\n（如果已经排好了，这步可以跳过）`, en: `Original data: $${values.join(', ')}$\n\nSorted: $${sorted.join(', ')}$\n\n(If already sorted, skip this step)` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——数一数有几个数，找到正中间的位置`, en: `${narrator}: "Step 2 — count how many values, find the exact middle position"` },
      hint: { zh: `一共 $${count}$ 个数\n中间位置 = 第 $${mid + 1}$ 个\n\n怎么算？$(${count} + 1) \\div 2 = ${(count + 1) / 2}$\n所以中间是第 $${mid + 1}$ 个\n\n口诀：总数加 1 除以 2 = 中间位置`, en: `Total: $${count}$ values\nMiddle position = ${mid + 1}th\n\nHow? $(${count} + 1) \\div 2 = ${(count + 1) / 2}$\nSo middle is the ${mid + 1}th value\n\nRule: (total + 1) ÷ 2 = middle position` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第三步——从排好的数据中取第 $${mid + 1}$ 个`, en: `${narrator}: "Step 3 — pick the ${mid + 1}th value from the sorted list"` },
      hint: { zh: `排序后：$${sorted.join(', ')}$\n\n数到第 $${mid + 1}$ 个：\n${sorted.map((v, i) => `第 ${i+1} 个 = $${v}$${i === mid ? ' ← 就是这个！' : ''}`).join('\n')}\n\n中位数 = $${median}$`, en: `Sorted: $${sorted.join(', ')}$\n\nCount to position ${mid + 1}:\n${sorted.map((v, i) => `${i+1}th = $${v}$${i === mid ? ' ← this one!' : ''}`).join('\n')}\n\nMedian = $${median}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——中位数合理吗？`, en: `${narrator}: "Verify — does the median make sense?"` },
      hint: { zh: `中位数 = $${median}$\n\n检查：\n• 比它小的有 ${mid} 个：$${sorted.slice(0, mid).join(', ')}$ ✓\n• 比它大的有 ${mid} 个：$${sorted.slice(mid + 1).join(', ')}$ ✓\n• 两边数量相等！中位数就是"正中间"的意思`, en: `Median = $${median}$\n\nCheck:\n• Values smaller: ${mid} values: $${sorted.slice(0, mid).join(', ')}$ ✓\n• Values larger: ${mid} values: $${sorted.slice(mid + 1).join(', ')}$ ✓\n• Equal count on both sides! Median means "exactly in the middle"` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：注意——如果数据个数是偶数怎么办？`, en: `${narrator}: "Note — what if there's an even number of values?"` },
      hint: { zh: `奇数个数据：中间那个就是中位数\n（这道题 $${count}$ 个数据 → 第 $${mid + 1}$ 个）\n\n偶数个数据：取中间两个的平均值\n例如 4 个数据 $1, 3, 5, 7$\n中间两个是 $3$ 和 $5$\n中位数 = $(3 + 5) \\div 2 = 4$`, en: `Odd count: the middle value IS the median\n(This problem: $${count}$ values → ${mid + 1}th)\n\nEven count: average the two middle values\nExample: 4 values $1, 3, 5, 7$\nMiddle two: $3$ and $5$\nMedian = $(3 + 5) \\div 2 = 4$` },
      highlightField: 'ans',
    },
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

  // Compute stop point for "when to stop" explanation
  const stopBase = Math.floor(Math.sqrt(n));
  const stopNext = stopBase + 1;

  // Find first factor (for composite numbers)
  let firstFactor = 0;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) { firstFactor = d; break; }
  }

  // Build detailed trial division table with remainders
  const trialTable: string[] = [];
  const trialTableEn: string[] = [];
  for (let d = 2; d <= stopBase; d++) {
    const quotient = Math.floor(n / d);
    const remainder = n % d;
    if (remainder === 0) {
      trialTable.push(`${n} \u00f7 ${d} = ${quotient}\uff0c\u4f59\u6570 0 \u2192 \u2713 \u6574\u9664\u4e86\uff01`);
      trialTableEn.push(`${n} \u00f7 ${d} = ${quotient}, remainder 0 \u2192 \u2713 Divides!`);
      break;
    } else {
      trialTable.push(`${n} \u00f7 ${d} = ${quotient} \u4f59 ${remainder} \u2192 \u2717`);
      trialTableEn.push(`${n} \u00f7 ${d} = ${quotient} r ${remainder} \u2192 \u2717`);
    }
  }
  if (result) {
    trialTable.push(`\uff08${stopNext}\u00d7${stopNext}=${stopNext*stopNext} > ${n}\uff0c\u505c\u6b62\uff09`);
    trialTableEn.push(`(${stopNext}\u00d7${stopNext}=${stopNext*stopNext} > ${n}, stop)`);
  }

  const tutorialSteps = [
    // Step 1: What is "\u6574\u9664"
    {
      text: {
        zh: `${narrator}\uff1a\u5728\u5224\u65ad\u8d28\u6570\u4e4b\u524d\uff0c\u5148\u641e\u61c2\u4e00\u4e2a\u8bcd\u2014\u2014\u201c\u6574\u9664\u201d`,
        en: `${narrator}: "Before checking primes, understand one word \u2014 'divides evenly'"`,
      },
      hint: {
        zh: '12 \u00f7 3 = 4\uff0c\u6ca1\u6709\u4f59\u6570 \u2192 \u6574\u9664 \u2713\n12 \u00f7 5 = 2 \u4f59 2\uff0c\u6709\u4f59\u6570 \u2192 \u4e0d\u6574\u9664 \u2717\n\n\u6574\u9664 = \u9664\u5f97\u5c3d = \u6ca1\u6709\u4f59\u6570',
        en: '12 \u00f7 3 = 4, no remainder \u2192 divides \u2713\n12 \u00f7 5 = 2 r 2, has remainder \u2192 doesn\'t divide \u2717\n\nDivides evenly = no remainder',
      },
      highlightField: 'ans',
    },
    // Step 2: What is a prime (definition with examples)
    {
      text: {
        zh: `${narrator}\uff1a\u8d28\u6570\u5c31\u662f\u2014\u2014\u9664\u4e86 1 \u548c\u5b83\u81ea\u5df1\uff0c\u6ca1\u6709\u522b\u7684\u6570\u80fd\u6574\u9664\u5b83`,
        en: `${narrator}: "A prime is a number that NOTHING else can divide \u2014 only 1 and itself"`,
      },
      hint: {
        zh: '\u5c31\u50cf\u7cbe\u9510\u4eb2\u536b\uff1a\u53ea\u6548\u5fe0\u5929\u5b50\uff081\uff09\u548c\u81ea\u5df1\uff0c\u4e0d\u63a5\u53d7\u4efb\u4f55\u5176\u4ed6\u5c06\u9886\u7684\u6307\u6325\n\n7 \u00f7 2 = 3.5 \u2717\uff0c7 \u00f7 3 = 2.3 \u2717 ... \u53ea\u6709 1 \u548c 7 \u80fd\u6574\u9664\u5b83 \u2192 \u8d28\u6570\n6 \u00f7 2 = 3 \u2713 \u2192 6 \u80fd\u88ab 2 \u6574\u9664\uff0c\u4e0d\u662f\u8d28\u6570',
        en: 'Like elite guards: only answer to the emperor (1) and themselves\n\n7 \u00f7 2 = 3.5 \u2717, 7 \u00f7 3 = 2.3 \u2717 \u2192 only 1 and 7 work \u2192 prime\n6 \u00f7 2 = 3 \u2713 \u2192 6 is divisible by 2 \u2192 not prime',
      },
      highlightField: 'ans',
    },
    // Step 3: Special cases (1 and 2)
    {
      text: {
        zh: `${narrator}\uff1a\u4e24\u4e2a\u7279\u6b8a\u60c5\u51b5\u2014\u20141 \u4e0d\u662f\u8d28\u6570\uff0c2 \u662f\u552f\u4e00\u7684\u5076\u6570\u8d28\u6570`,
        en: `${narrator}: "Two special cases \u2014 1 is NOT prime, 2 is the ONLY even prime"`,
      },
      hint: {
        zh: '1 \u4e0d\u662f\u8d28\u6570\uff1a\u8d28\u6570\u8981\u6c42\u201c1 \u548c\u81ea\u5df1\u201d\u662f\u4e24\u4e2a\u4e0d\u540c\u7684\u6570\uff0c\u4f46 1 \u7684\u201c\u81ea\u5df1\u201d\u5c31\u662f 1\n\n2 \u662f\u8d28\u6570\uff1a\u53ea\u80fd\u88ab 1 \u548c 2 \u6574\u9664\n\u6240\u6709\u5176\u4ed6\u5076\u6570\uff084, 6, 8...\uff09\u90fd\u80fd\u88ab 2 \u6574\u9664 \u2192 \u4e0d\u662f\u8d28\u6570\n\u6240\u4ee5\u9664\u4e86 2\uff0c\u6240\u6709\u8d28\u6570\u90fd\u662f\u5947\u6570',
        en: '1 is not prime: "1 and itself" must be two DIFFERENT numbers, but for 1 they\'re the same\n\n2 is prime: only 1 and 2 divide it\nAll other even numbers (4,6,8...) are divisible by 2 \u2192 not prime\nSo except 2, all primes are odd',
      },
      highlightField: 'ans',
    },
    // Step 4: How to check \u2014 when to stop
    {
      text: {
        zh: `${narrator}\uff1a\u600e\u4e48\u5224\u65ad $${n}$ \u662f\u4e0d\u662f\u8d28\u6570\uff1f\u4ece 2 \u5f00\u59cb\u9010\u4e2a\u8bd5\u9664`,
        en: `${narrator}: "How to check if $${n}$ is prime? Try dividing from 2 upward"`,
      },
      hint: {
        zh: `\u4e0d\u7528\u4e00\u76f4\u8bd5\u5230 ${n}\uff01\u8bd5\u5230\u201c\u67d0\u4e2a\u6570\u00d7\u81ea\u5df1\u8d85\u8fc7 ${n}\u201d\u5c31\u591f\u4e86\n\n${stopBase}\u00d7${stopBase}=${stopBase*stopBase}${stopBase*stopBase <= n ? ` \u2264 ${n}\uff0c\u8fd8\u6ca1\u8d85\u8fc7` : ` > ${n}\uff0c\u8d85\u8fc7\u4e86`}\n${stopNext}\u00d7${stopNext}=${stopNext*stopNext}${stopNext*stopNext > n ? ` > ${n}\uff0c\u8d85\u8fc7\u4e86\uff01\u6240\u4ee5\u8bd5\u5230 ${stopBase} \u5c31\u591f` : ` \u2264 ${n}`}`,
        en: `Don't test up to ${n}! Stop when "a number \u00d7 itself > ${n}"\n\n${stopBase}\u00d7${stopBase}=${stopBase*stopBase}${stopBase*stopBase <= n ? ` \u2264 ${n}` : ` > ${n}`}\n${stopNext}\u00d7${stopNext}=${stopNext*stopNext}${stopNext*stopNext > n ? ` > ${n}, so test up to ${stopBase} only` : ` \u2264 ${n}`}`,
      },
      highlightField: 'ans',
    },
    // Step 5: Trial division table
    {
      text: {
        zh: `${narrator}\uff1a\u9010\u4e2a\u8bd5\u9664 $${n}$`,
        en: `${narrator}: "Try dividing $${n}$ one by one"`,
      },
      hint: {
        zh: trialTable.join('\n'),
        en: trialTableEn.join('\n'),
      },
      highlightField: 'ans',
    },
    // Step 6: Conclusion (conditional)
    ...(result ? [
      {
        text: {
          zh: `${narrator}\uff1a\u5168\u90e8\u9664\u4e0d\u5c3d\uff01\u9664\u4e86 $1$ \u548c $${n}$\uff0c\u6ca1\u6709\u522b\u7684\u6570\u80fd\u6574\u9664\u5b83`,
          en: `${narrator}: "None divide evenly! Only $1$ and $${n}$ divide it"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}\uff1a$${n}$ \u662f\u8d28\u6570 \u2713 \u7cbe\u9510\u4eb2\u536b\uff0c\u53ea\u6548\u5fe0\u5929\u5b50\u548c\u81ea\u5df1\uff01`,
          en: `${narrator}: "$${n}$ IS prime \u2713 Elite guard \u2014 answers only to the emperor and himself!"`,
        },
        highlightField: 'ans',
      },
    ] : [
      {
        text: {
          zh: `${narrator}\uff1a\u627e\u5230\u4e86\uff01$${n} \\div ${firstFactor} = ${n/firstFactor}$\uff0c\u6574\u9664\u4e86`,
          en: `${narrator}: "Found it! $${n} \\div ${firstFactor} = ${n/firstFactor}$, divides evenly"`,
        },
        hint: {
          zh: `$${n} = ${firstFactor} \\times ${n/firstFactor}$\n\u80fd\u88ab\u62c6\u5f00 \u2192 \u6709\u5176\u4ed6\u4e0a\u7ea7 \u2192 \u8fdb\u4e0d\u4e86\u4eb2\u536b\u961f`,
          en: `$${n} = ${firstFactor} \\times ${n/firstFactor}$\nCan be split \u2192 has other commanders \u2192 can't join the guards`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}\uff1a$${n}$ \u4e0d\u662f\u8d28\u6570\uff08\u662f\u5408\u6570\uff09\u2717`,
          en: `${narrator}: "$${n}$ is NOT prime (it's composite) \u2717"`,
        },
        highlightField: 'ans',
      },
    ]),
    // Step 7/8: First 10 primes
    {
      text: {
        zh: `${narrator}\uff1a\u8bb0\u4f4f\u524d 10 \u4e2a\u8d28\u6570\u2014\u2014\u540e\u9762\u505a\u56e0\u6570\u5206\u89e3\u4f1a\u7528\u5230`,
        en: `${narrator}: "Remember the first 10 primes \u2014 you'll need them for factorization"`,
      },
      hint: {
        zh: '$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$\n\n\u4e2a\u4f4d\u6570\uff1a2, 3, 5, 7\uff084\u4e2a\uff09\n\u5341\u51e0\uff1a11, 13, 17, 19\uff084\u4e2a\uff09\n\u4e8c\u5341\u51e0\uff1a23, 29\uff082\u4e2a\uff09',
        en: '$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$\n\nSingle digits: 2, 3, 5, 7 (4)\nTeens: 11, 13, 17, 19 (4)\nTwenties: 23, 29 (2)',
      },
      highlightField: 'ans',
    },
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

  // Respect template's op if set (e.g., mission 707 is always '+', mission 708 is always '-')
  const isSubtract = template.data?.op === '-' ? true : template.data?.op === '+' ? false : pickRandom([true, false]);
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

/* ══════════════════════════════════════════════════════════
   SQUARE_CUBE generator: n² or n³ depending on data.mode
   ══════════════════════════════════════════════════════════ */

export function generateSquareCubeMission(template: Mission): Mission {
  const tier = getTier();
  const mode: 'square' | 'cube' = template.data?.mode ?? 'square';

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '刘备';

  let n: number;
  let answer: number;

  if (mode === 'square') {
    const pools: Record<DifficultyTier, number[]> = {
      1: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      3: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    };
    n = pickRandom(pools[tier]);
    answer = n * n;
  } else {
    const pools: Record<DifficultyTier, number[]> = {
      1: [2, 3, 4, 5],
      2: [2, 3, 4, 5, 6, 7, 8],
      3: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
    n = pickRandom(pools[tier]);
    answer = n * n * n;
  }

  const description: BilingualText = mode === 'square'
    ? { zh: `计算 $${n}^2 = ?$`, en: `Calculate $${n}^2 = ?$` }
    : { zh: `计算 $${n}^3 = ?$`, en: `Calculate $${n}^3 = ?$` };

  const tutorialSteps = mode === 'square' ? [
    {
      text: {
        zh: `${narrator}：什么是"平方"？一个数乘以自己`,
        en: `${narrator}: "What is 'squaring'? A number times itself"`,
      },
      hint: {
        zh: '为什么叫"平方"？因为正方形的面积 = 边长 × 边长\n\n比如边长 3 的正方形，面积 = 3 × 3 = 9\n所以 $3^2 = 9$',
        en: 'Why "square"? Because a square\'s area = side × side\n\nA square with side 3: area = 3 × 3 = 9\nSo $3^2 = 9$',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${n}^2 = ${n} \\times ${n}$`,
        en: `${narrator}: "$${n}^2 = ${n} \\times ${n}$"`,
      },
      hint: {
        zh: `把 ${n} 个士兵排成 ${n} 行 ${n} 列的方阵\n总人数 = $${n} \\times ${n} = ${answer}$`,
        en: `Arrange ${n} soldiers in a ${n} × ${n} square formation\nTotal = $${n} \\times ${n} = ${answer}$`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——$${answer}$ 是完全平方数吗？$\\sqrt{${answer}} = ${n}$ ✓`,
        en: `${narrator}: "Check — is $${answer}$ a perfect square? $\\sqrt{${answer}} = ${n}$ ✓"`,
      },
      hint: {
        zh: `$${n} \\times ${n} = ${answer}$，反过来 $\\sqrt{${answer}} = ${n}$\n平方和平方根是互逆运算`,
        en: `$${n} \\times ${n} = ${answer}$, and $\\sqrt{${answer}} = ${n}$\nSquaring and square root are inverse operations`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：记住前 10 个平方数`,
        en: `${narrator}: "Remember the first 10 perfect squares"`,
      },
      hint: {
        zh: '$1, 4, 9, 16, 25, 36, 49, 64, 81, 100$\n\n$1^2=1,\\ 2^2=4,\\ 3^2=9,\\ 4^2=16,\\ 5^2=25$\n$6^2=36,\\ 7^2=49,\\ 8^2=64,\\ 9^2=81,\\ 10^2=100$',
        en: '$1, 4, 9, 16, 25, 36, 49, 64, 81, 100$\n\n$1^2=1,\\ 2^2=4,\\ 3^2=9,\\ 4^2=16,\\ 5^2=25$\n$6^2=36,\\ 7^2=49,\\ 8^2=64,\\ 9^2=81,\\ 10^2=100$',
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：什么是"立方"？一个数乘三次`,
        en: `${narrator}: "What is 'cubing'? A number times itself three times"`,
      },
      hint: {
        zh: '为什么叫"立方"？因为正方体的体积 = 边长 × 边长 × 边长\n\n比如边长 3 的箱子，体积 = 3 × 3 × 3 = 27\n所以 $3^3 = 27$',
        en: 'Why "cube"? Because a cube\'s volume = side × side × side\n\nA cube with side 3: volume = 3 × 3 × 3 = 27\nSo $3^3 = 27$',
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${n}^3 = ${n} \\times ${n} \\times ${n}$`,
        en: `${narrator}: "$${n}^3 = ${n} \\times ${n} \\times ${n}$"`,
      },
      hint: {
        zh: `先算 $${n} \\times ${n} = ${n*n}$\n再乘 ${n}：$${n*n} \\times ${n} = ${answer}$\n\n就像码粮箱：${n} 层，每层 ${n} 行 ${n} 列`,
        en: `First: $${n} \\times ${n} = ${n*n}$\nThen × ${n}: $${n*n} \\times ${n} = ${answer}$\n\nLike stacking crates: ${n} layers of ${n} × ${n}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——$\\sqrt[3]{${answer}} = ${n}$ ✓`,
        en: `${narrator}: "Check — $\\sqrt[3]{${answer}} = ${n}$ ✓"`,
      },
      hint: {
        zh: `$${n} \\times ${n} \\times ${n} = ${answer}$\n反过来 $\\sqrt[3]{${answer}} = ${n}$\n立方和立方根是互逆运算`,
        en: `$${n} \\times ${n} \\times ${n} = ${answer}$\nAnd $\\sqrt[3]{${answer}} = ${n}$\nCubing and cube root are inverse operations`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：记住前 5 个立方数`,
        en: `${narrator}: "Remember the first 5 perfect cubes"`,
      },
      hint: {
        zh: '$1, 8, 27, 64, 125$\n\n$1^3=1,\\ 2^3=8,\\ 3^3=27,\\ 4^3=64,\\ 5^3=125$',
        en: '$1, 8, 27, 64, 125$\n\n$1^3=1,\\ 2^3=8,\\ 3^3=27,\\ 4^3=64,\\ 5^3=125$',
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n, answer, mode, generatorType: 'SQUARE_CUBE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SQUARE_ROOT generator: √n or ∛n depending on data.mode
   ══════════════════════════════════════════════════════════ */

export function generateSquareRootMission(template: Mission): Mission {
  const tier = getTier();
  const mode: 'sqrt' | 'cbrt' | 'mixed' = template.data?.mode ?? 'sqrt';

  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '关羽';

  // Decide actual operation for this question
  let op: 'sqrt' | 'cbrt';
  if (mode === 'mixed') {
    op = pickRandom(['sqrt', 'cbrt']);
  } else {
    op = mode;
  }

  let n: number;
  let answer: number;

  if (op === 'sqrt') {
    const pools: Record<DifficultyTier, number[]> = {
      1: [4, 9, 16, 25, 36, 49, 64, 81, 100],
      2: [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169],
      3: [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 324, 400],
    };
    n = pickRandom(pools[tier]);
    answer = Math.round(Math.sqrt(n));
  } else {
    const pools: Record<DifficultyTier, number[]> = {
      1: [8, 27, 64, 125],
      2: [8, 27, 64, 125, 216],
      3: [8, 27, 64, 125, 216, 343, 512, 729, 1000],
    };
    n = pickRandom(pools[tier]);
    answer = Math.round(Math.cbrt(n));
  }

  const description: BilingualText = op === 'sqrt'
    ? { zh: `计算 $\\sqrt{${n}} = ?$`, en: `Calculate $\\sqrt{${n}} = ?$` }
    : { zh: `计算 $\\sqrt[3]{${n}} = ?$`, en: `Calculate $\\sqrt[3]{${n}} = ?$` };

  const tutorialSteps = op === 'sqrt' ? [
    {
      text: {
        zh: `${narrator}：平方根是平方的反操作`,
        en: `${narrator}: "Square root is the reverse of squaring"`,
      },
      hint: {
        zh: `如果 $${answer}^2 = ${answer} \\times ${answer} = ${n}$\n那么 $\\sqrt{${n}} = ${answer}$\n\n"谁的平方等于 ${n}？"——答案是 ${answer}`,
        en: `If $${answer}^2 = ${answer} \\times ${answer} = ${n}$\nThen $\\sqrt{${n}} = ${answer}$\n\n"Whose square equals ${n}?" — answer is ${answer}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：侦察到敌军方阵 $${n}$ 人，每行几人？`,
        en: `${narrator}: "Enemy square formation has $${n}$ soldiers — how many per row?"`,
      },
      hint: {
        zh: `方阵 = 正方形排列 → 总人数 = 行数 × 行数\n$${n} = ${answer} \\times ${answer}$\n所以每行 ${answer} 人`,
        en: `Square formation → total = rows × rows\n$${n} = ${answer} \\times ${answer}$\nSo ${answer} per row`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：记住常见完全平方数`,
        en: `${narrator}: "Remember common perfect squares"`,
      },
      hint: {
        zh: '$\\sqrt{4}=2,\\ \\sqrt{9}=3,\\ \\sqrt{16}=4,\\ \\sqrt{25}=5$\n$\\sqrt{36}=6,\\ \\sqrt{49}=7,\\ \\sqrt{64}=8,\\ \\sqrt{81}=9,\\ \\sqrt{100}=10$',
        en: '$\\sqrt{4}=2,\\ \\sqrt{9}=3,\\ \\sqrt{16}=4,\\ \\sqrt{25}=5$\n$\\sqrt{36}=6,\\ \\sqrt{49}=7,\\ \\sqrt{64}=8,\\ \\sqrt{81}=9,\\ \\sqrt{100}=10$',
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：立方根是立方的反操作`,
        en: `${narrator}: "Cube root is the reverse of cubing"`,
      },
      hint: {
        zh: `如果 $${answer}^3 = ${answer} \\times ${answer} \\times ${answer} = ${n}$\n那么 $\\sqrt[3]{${n}} = ${answer}$\n\n"谁的立方等于 ${n}？"——答案是 ${answer}`,
        en: `If $${answer}^3 = ${answer} \\times ${answer} \\times ${answer} = ${n}$\nThen $\\sqrt[3]{${n}} = ${answer}$\n\n"Whose cube equals ${n}?" — answer is ${answer}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：粮仓体积 $${n}$ 箱，边长几箱？`,
        en: `${narrator}: "Warehouse volume is $${n}$ crates — what's the side length?"`,
      },
      hint: {
        zh: `正方体粮仓 → 体积 = 边长 × 边长 × 边长\n$${n} = ${answer} \\times ${answer} \\times ${answer}$\n所以边长 ${answer}`,
        en: `Cube warehouse → volume = side × side × side\n$${n} = ${answer} \\times ${answer} \\times ${answer}$\nSo side = ${answer}`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：记住常见完全立方数`,
        en: `${narrator}: "Remember common perfect cubes"`,
      },
      hint: {
        zh: '$\\sqrt[3]{8}=2,\\ \\sqrt[3]{27}=3,\\ \\sqrt[3]{64}=4,\\ \\sqrt[3]{125}=5$\n$\\sqrt[3]{216}=6,\\ \\sqrt[3]{343}=7,\\ \\sqrt[3]{512}=8,\\ \\sqrt[3]{729}=9,\\ \\sqrt[3]{1000}=10$',
        en: '$\\sqrt[3]{8}=2,\\ \\sqrt[3]{27}=3,\\ \\sqrt[3]{64}=4,\\ \\sqrt[3]{125}=5$\n$\\sqrt[3]{216}=6,\\ \\sqrt[3]{343}=7,\\ \\sqrt[3]{512}=8,\\ \\sqrt[3]{729}=9,\\ \\sqrt[3]{1000}=10$',
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n, answer, op, mode, generatorType: 'SQUARE_ROOT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SUBSTITUTION generator: evaluate expression for given x
   ══════════════════════════════════════════════════════════ */

export function generateSubstitutionMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';
  const mode: 'linear' | 'power' = template.data?.mode ?? 'linear';

  let a: number, b: number, x: number, answer: number, expr: string, exprEn: string;

  if (mode === 'power') {
    const xPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7], 3: [3, 4, 5, 6, 7, 8, 9] };
    const aPools: Record<DifficultyTier, number[]> = { 1: [1, 2, 3], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5, 6] };
    x = pickRandom(xPools[tier]);
    a = pickRandom(aPools[tier]);
    b = randInt(-10, 10);
    answer = a * x * x + b;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    expr = `${a}x^2 ${bStr}`;
    exprEn = expr;
  } else {
    const xPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5, 6], 2: [2, 3, 4, 5, 6, 7, 8, 9, 10], 3: [5, 6, 7, 8, 9, 10, 12, 15] };
    const aPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7, 8], 3: [3, 5, 6, 7, 8, 9, 10, 12] };
    x = pickRandom(xPools[tier]);
    a = pickRandom(aPools[tier]);
    b = randInt(-10, 15);
    answer = a * x + b;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    expr = `${a}x ${bStr}`;
    exprEn = expr;
  }

  const description: BilingualText = {
    zh: `当 $x = ${x}$ 时，求 $${expr}$ 的值。`,
    en: `When $x = ${x}$, find the value of $${exprEn}$.`,
  };

  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const bStrCalc = b >= 0 ? '+' : '-';
  const bAbs = Math.abs(b);

  const tutorialSteps = mode === 'power' ? [
    {
      text: { zh: `${narrator}：军师用密码传令——把暗号 $x$ 代入公式，算出指令数字`, en: `${narrator}: "The strategist sends coded orders — substitute the code $x$ into the formula to decode"` },
      hint: { zh: `为什么用字母？因为同一个公式可以换不同的数\n今天暗号 $x = 3$，明天可能 $x = 7$\n公式不变，代入不同的数，得到不同的结果`, en: `Why use letters? The same formula works with different numbers\nToday's code $x = 3$, tomorrow maybe $x = 7$\nSame formula, different inputs, different outputs` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：先搞懂——$${a}x^2$ 是什么意思？`, en: `${narrator}: "First — what does $${a}x^2$ mean?"` },
      hint: { zh: `$x^2$ 读作"$x$ 的平方"，意思是 $x \\times x$\n$${a}x^2$ 意思是 $${a} \\times x \\times x$\n\n注意：$${a}x^2$ 不是 $(${a}x)^2$！\n$${a}x^2 = ${a} \\times (x^2)$，只有 $x$ 要平方`, en: `$x^2$ reads "$x$ squared", meaning $x \\times x$\n$${a}x^2$ means $${a} \\times x \\times x$\n\nNote: $${a}x^2$ is NOT $(${a}x)^2$!\n$${a}x^2 = ${a} \\times (x^2)$, only $x$ gets squared` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——把 $x = ${x}$ 代入，先算平方`, en: `${narrator}: "Step 1 — substitute $x = ${x}$, compute the square first"` },
      hint: { zh: `$x^2 = ${x}^2 = ${x} \\times ${x} = ${x*x}$\n\n（平方就是自己乘自己，我们之前学过！）`, en: `$x^2 = ${x}^2 = ${x} \\times ${x} = ${x*x}$\n\n(Squaring means times itself — we learned this before!)` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——乘以系数 $${a}$`, en: `${narrator}: "Step 2 — multiply by the coefficient $${a}$"` },
      hint: { zh: `$${a} \\times ${x*x} = ${a*x*x}$`, en: `$${a} \\times ${x*x} = ${a*x*x}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第三步——最后 ${bStrCalc} ${bAbs}`, en: `${narrator}: "Step 3 — finally ${bStrCalc} ${bAbs}"` },
      hint: { zh: `$${a*x*x} ${bStr} = ${answer}$`, en: `$${a*x*x} ${bStr} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：完整过程回顾`, en: `${narrator}: "Full process review"` },
      hint: { zh: `运算顺序口诀：幂 → 乘除 → 加减\n\n$${expr}$，$x = ${x}$\n① 平方：$${x}^2 = ${x*x}$\n② 乘系数：$${a} \\times ${x*x} = ${a*x*x}$\n③ 加减：$${a*x*x} ${bStr} = ${answer}$\n\n答案 = $${answer}$ ✓`, en: `Order of operations: Powers → Multiply/Divide → Add/Subtract\n\n$${expr}$, $x = ${x}$\n① Square: $${x}^2 = ${x*x}$\n② Multiply: $${a} \\times ${x*x} = ${a*x*x}$\n③ Add/Sub: $${a*x*x} ${bStr} = ${answer}$\n\nAnswer = $${answer}$ ✓` },
      highlightField: 'ans',
    },
  ] : [
    {
      text: { zh: `${narrator}：军师用密码传令——$x$ 是暗号，代入公式就能解密`, en: `${narrator}: "The strategist sends coded orders — $x$ is the code, substitute to decode"` },
      hint: { zh: `为什么用字母代替数字？\n因为同一个公式要反复使用：今天 $x=3$，明天 $x=7$\n公式像一台"计算机器"，放入不同的数，吐出不同的答案`, en: `Why use letters instead of numbers?\nBecause the same formula is reused: today $x=3$, tomorrow $x=7$\nA formula is like a "calculation machine" — different input, different output` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：先搞懂——$${a}x$ 是什么意思？`, en: `${narrator}: "First — what does $${a}x$ mean?"` },
      hint: { zh: `$${a}x$ 读作"${a} 乘以 $x$"\n就是 $${a} \\times x$\n\n字母前面的数字叫"系数"\n比如 $${a}x$ 的系数是 $${a}$\n\n注意：$${a}x$ 不是 $${a} + x$！是乘法！`, en: `$${a}x$ reads "${a} times $x$"\nIt means $${a} \\times x$\n\nThe number in front is the "coefficient"\n$${a}x$ has coefficient $${a}$\n\nNote: $${a}x$ is NOT $${a} + x$! It's multiplication!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：现在代入！把 $x = ${x}$ 放进去`, en: `${narrator}: "Now substitute! Put $x = ${x}$ in"` },
      hint: { zh: `$${a}x ${bStr}$\n\n把 $x$ 换成 $${x}$：\n$${a} \\times ${x} ${bStr}$`, en: `$${a}x ${bStr}$\n\nReplace $x$ with $${x}$:\n$${a} \\times ${x} ${bStr}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：先算乘法——$${a} \\times ${x}$`, en: `${narrator}: "First, multiply — $${a} \\times ${x}$"` },
      hint: { zh: `$${a} \\times ${x} = ${a*x}$\n\n（先乘除，后加减！）`, en: `$${a} \\times ${x} = ${a*x}$\n\n(Multiply before adding/subtracting!)` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：再算加减——$${a*x} ${bStr}$`, en: `${narrator}: "Then add/subtract — $${a*x} ${bStr}$"` },
      hint: { zh: `$${a*x} ${bStr} = ${answer}$`, en: `$${a*x} ${bStr} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——把答案代回去检查`, en: `${narrator}: "Verify — plug the answer back to check"` },
      hint: { zh: `$${a} \\times ${x} ${bStr} = ${a*x} ${bStr} = ${answer}$ ✓\n\n完整步骤回顾：\n① 看清式子 $${expr}$\n② 把 $x$ 换成 $${x}$\n③ 先乘：$${a} \\times ${x} = ${a*x}$\n④ 后加减：$${a*x} ${bStr} = ${answer}$`, en: `$${a} \\times ${x} ${bStr} = ${a*x} ${bStr} = ${answer}$ ✓\n\nFull steps:\n① Read expression $${expr}$\n② Replace $x$ with $${x}$\n③ Multiply first: $${a} \\times ${x} = ${a*x}$\n④ Then add/sub: $${a*x} ${bStr} = ${answer}$` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, x, answer, mode, expr, generatorType: 'SUBSTITUTION_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PERIMETER (rectangle) generator
   ══════════════════════════════════════════════════════════ */

export function generatePerimeterRectMission(template: Mission): Mission {
  const tier = getTier();
  const lPools: Record<DifficultyTier, number[]> = { 1: [3, 4, 5, 6, 7, 8, 10], 2: [5, 8, 10, 12, 15, 18, 20], 3: [10, 15, 20, 25, 30, 35, 40, 50] };
  const wPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5, 6], 2: [3, 5, 7, 8, 10, 12, 15], 3: [8, 10, 15, 20, 25, 30] };
  const length = pickRandom(lPools[tier]);
  const width = pickRandom(wPools[tier]);
  const answer = 2 * (length + width);
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '刘备';

  const description: BilingualText = {
    zh: `长方形营地：长 $${length}$，宽 $${width}$，求周长。`,
    en: `Rectangle camp: length $${length}$, width $${width}$. Find the perimeter.`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：扎营第一步——算围栅需要多长。这就是"周长"`, en: `${narrator}: "First step in setting camp — calculate how much fencing we need. That's the perimeter"` },
      hint: { zh: `周长就是沿着图形的边走一整圈，总共走了多远\n\n想象一只蚂蚁沿着营地围墙走一圈\n它走过的总距离 = 周长`, en: `Perimeter = the total distance walking around the edge of a shape\n\nImagine an ant walking along the camp fence\nTotal distance walked = perimeter` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：长方形有几条边？分别多长？`, en: `${narrator}: "How many sides does a rectangle have? How long are they?"` },
      hint: { zh: `长方形有 4 条边：\n• 上边 = $${length}$\n• 下边 = $${length}$（和上边一样长）\n• 左边 = $${width}$\n• 右边 = $${width}$（和左边一样长）\n\n对面的边总是相等的——这就是长方形的特点！`, en: `A rectangle has 4 sides:\n• Top = $${length}$\n• Bottom = $${length}$ (same as top)\n• Left = $${width}$\n• Right = $${width}$ (same as left)\n\nOpposite sides are always equal — that's what makes it a rectangle!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：笨办法——把 4 条边加起来`, en: `${narrator}: "Simple way — add all 4 sides"` },
      hint: { zh: `$${length} + ${width} + ${length} + ${width}$\n$= ${length + width} + ${length + width}$\n$= ${answer}$\n\n这就是周长！`, en: `$${length} + ${width} + ${length} + ${width}$\n$= ${length + width} + ${length + width}$\n$= ${answer}$\n\nThat's the perimeter!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：快捷公式——因为有两对相同的边`, en: `${narrator}: "Shortcut — since there are two pairs of equal sides"` },
      hint: { zh: `先把一条长和一条宽加起来：$${length} + ${width} = ${length + width}$\n然后乘以 2（因为有两对）：$2 \\times ${length + width} = ${answer}$\n\n这就是公式 $P = 2(l + w)$ 的含义！`, en: `Add one length and one width: $${length} + ${width} = ${length + width}$\nMultiply by 2 (two pairs): $2 \\times ${length + width} = ${answer}$\n\nThat's what $P = 2(l + w)$ means!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案——周长 = $${answer}$`, en: `${narrator}: "Answer — Perimeter = $${answer}$"` },
      hint: { zh: `营地的围栅需要 $${answer}$ 单位长\n\n公式：$P = 2(${length} + ${width}) = 2 \\times ${length + width} = ${answer}$`, en: `The camp fence needs $${answer}$ units of fencing\n\nFormula: $P = 2(${length} + ${width}) = 2 \\times ${length + width} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——用笨办法检查`, en: `${narrator}: "Verify — check with the simple method"` },
      hint: { zh: `$${length} + ${width} + ${length} + ${width} = ${answer}$ ✓\n$2 \\times (${length} + ${width}) = ${answer}$ ✓\n\n两种方法答案一样——围栅需要 $${answer}$ 单位长！`, en: `$${length} + ${width} + ${length} + ${width} = ${answer}$ ✓\n$2 \\times (${length} + ${width}) = ${answer}$ ✓\n\nBoth methods match — we need $${answer}$ units of fencing!` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { length, width, answer, generatorType: 'PERIMETER_RECT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PERCENTAGE_OF generator: "what is p% of n?"
   ══════════════════════════════════════════════════════════ */

export function generatePercentageOfMission(template: Mission): Mission {
  const tier = getTier();
  const pctPools: Record<DifficultyTier, number[]> = { 1: [10, 20, 25, 50], 2: [5, 10, 15, 20, 25, 30, 40, 50, 75], 3: [5, 12, 15, 18, 22, 35, 45, 60, 75, 80] };
  const nPools: Record<DifficultyTier, number[]> = { 1: [40, 50, 60, 80, 100, 200], 2: [60, 80, 100, 120, 150, 200, 250, 300, 400, 500], 3: [120, 150, 200, 250, 300, 400, 500, 800, 1000] };
  const pct = pickRandom(pctPools[tier]);
  const n = pickRandom(nPools[tier]);
  const answer = n * pct / 100;
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '曹操';

  const description: BilingualText = {
    zh: `$${n}$ 的 $${pct}\\%$ 是多少？`,
    en: `What is $${pct}\\%$ of $${n}$?`,
  };

  const decimal = pct / 100;
  const tenPct = n / 10;
  const tutorialSteps = [
    {
      text: { zh: `${narrator}：军粮 $${n}$ 石，要拨出 $${pct}\\%$ 给前锋营。到底是多少？`, en: `${narrator}: "We have $${n}$ units of grain. $${pct}\\%$ goes to the vanguard. How much is that?"` },
      hint: { zh: `"百分"两个字拆开看：\n"百" = 100\n"分" = 份\n百分比就是"每 100 份里取几份"\n\n$${pct}\\%$ 的意思：每 100 份里取 ${pct} 份`, en: `"Per cent" literally means "per hundred"\n\n$${pct}\\%$ means: out of every 100, take ${pct}` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：先从简单的开始——如果只有 100 石粮草`, en: `${narrator}: "Let's start simple — what if we only had 100 units?"` },
      hint: { zh: `100 石粮草的 $${pct}\\%$？\n直接取 ${pct} 石就好了！\n\n因为 $${pct}\\%$ = 每 100 里取 ${pct}\n$100$ 里取 $${pct}$ → 答案就是 $${pct}$`, en: `$${pct}\\%$ of 100?\nJust take ${pct}!\n\nBecause $${pct}\\%$ = ${pct} out of every 100\n$100$ → take $${pct}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：但我们有 $${n}$ 石，不是 100 石——怎么办？`, en: `${narrator}: "But we have $${n}$, not 100 — what do we do?"` },
      hint: { zh: `方法：先算 $1\\%$（即 $\\frac{1}{100}$），再乘以 ${pct}\n\n$1\\%$ of $${n}$ = $${n} \\div 100 = ${n/100}$\n$${pct}\\%$ of $${n}$ = $${n/100} \\times ${pct} = ${answer}$\n\n或者一步算：$${n} \\times \\frac{${pct}}{100} = ${answer}$`, en: `Method: find $1\\%$ first ($\\frac{1}{100}$), then multiply by ${pct}\n\n$1\\%$ of $${n}$ = $${n} \\div 100 = ${n/100}$\n$${pct}\\%$ of $${n}$ = $${n/100} \\times ${pct} = ${answer}$\n\nOr in one step: $${n} \\times \\frac{${pct}}{100} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：小捷径——先算 $10\\%$，再凑其他`, en: `${narrator}: "Shortcut — find $10\\%$ first, then build from there"` },
      hint: { zh: `$10\\%$ 就是除以 10：$${n} \\div 10 = ${tenPct}$\n$50\\%$ 就是除以 2：$${n} \\div 2 = ${n/2}$\n$25\\%$ 就是除以 4：$${n} \\div 4 = ${n/4}$\n$1\\%$ 就是除以 100：$${n} \\div 100 = ${n/100}$\n\n任何百分比都能用 $10\\%$ 和 $1\\%$ 凑出来！`, en: `$10\\%$ = divide by 10: $${n} \\div 10 = ${tenPct}$\n$50\\%$ = divide by 2: $${n} \\div 2 = ${n/2}$\n$25\\%$ = divide by 4: $${n} \\div 4 = ${n/4}$\n$1\\%$ = divide by 100: $${n} \\div 100 = ${n/100}$\n\nAny percentage can be built from $10\\%$ and $1\\%$!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案——$${pct}\\%$ of $${n}$ = $${answer}$`, en: `${narrator}: "Answer — $${pct}\\%$ of $${n}$ = $${answer}$"` },
      hint: { zh: `$${n} \\times \\frac{${pct}}{100} = ${answer}$\n\n前锋营获得 $${answer}$ 石军粮`, en: `$${n} \\times \\frac{${pct}}{100} = ${answer}$\n\nThe vanguard gets $${answer}$ units of grain` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——答案合理吗？`, en: `${narrator}: "Verify — does the answer make sense?"` },
      hint: { zh: `$${pct}\\%$ of $${n}$ = $${answer}$\n\n合理性检查：\n• $${pct}\\%$ ${pct < 50 ? '不到一半' : pct === 50 ? '刚好一半' : '超过一半'}，$${n}$ 的一半是 $${n/2}$\n• $${answer}$ ${answer < n/2 ? '< ' + n/2 : answer === n/2 ? '= ' + n/2 : '> ' + n/2} ✓ 合理！`, en: `$${pct}\\%$ of $${n}$ = $${answer}$\n\nSense check:\n• $${pct}\\%$ is ${pct < 50 ? 'less than half' : pct === 50 ? 'exactly half' : 'more than half'}, half of $${n}$ is $${n/2}$\n• $${answer}$ ${answer < n/2 ? '< ' + n/2 : answer === n/2 ? '= ' + n/2 : '> ' + n/2} ✓ Makes sense!` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n, pct, answer, generatorType: 'PERCENTAGE_OF_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ESTIMATION_ROUND generator: rounding to nearest 10/100/1000
   ══════════════════════════════════════════════════════════ */

export function generateEstimationRoundMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  let n: number, place: number, placeNameZh: string, placeNameEn: string, answer: number;

  if (tier === 1) {
    n = randInt(15, 95);
    place = 10;
    placeNameZh = '十位';
    placeNameEn = 'nearest 10';
  } else if (tier === 2) {
    const choices: [number, number, string, string][] = [
      [randInt(15, 995), 10, '十位', 'nearest 10'],
      [randInt(150, 9950), 100, '百位', 'nearest 100'],
    ];
    const pick = pickRandom(choices);
    [n, place, placeNameZh, placeNameEn] = pick;
  } else {
    const choices: [number, number, string, string][] = [
      [randInt(150, 9950), 100, '百位', 'nearest 100'],
      [randInt(1500, 99500), 1000, '千位', 'nearest 1000'],
    ];
    const pick = pickRandom(choices);
    [n, place, placeNameZh, placeNameEn] = pick;
  }
  answer = Math.round(n / place) * place;

  const description: BilingualText = {
    zh: `把 $${n}$ 四舍五入到${placeNameZh}。`,
    en: `Round $${n}$ to the ${placeNameEn}.`,
  };

  const decider = Math.floor((n % place) / (place / 10));
  const roundDown = Math.floor(n / place) * place;
  const roundUp = roundDown + place;
  const tutorialSteps = [
    {
      text: { zh: `${narrator}：斥候回报敌军约 $${n}$ 人——但主公不需要精确数字，大概就行`, en: `${narrator}: "Scouts report about $${n}$ enemies — but the general just needs a rough number"` },
      hint: { zh: `四舍五入就是——找到最接近的"整数"\n比如四舍五入到${placeNameZh}，就是找最近的 ${place} 的倍数\n\n为什么要四舍五入？\n• 快速估算（战场上没时间算精确）\n• 方便比较大小\n• 简化计算`, en: `Rounding means finding the nearest "round number"\nRounding to ${placeNameEn} = finding the nearest multiple of ${place}\n\nWhy round?\n• Quick estimates (no time for exact math in battle)\n• Easier to compare sizes\n• Simplifies calculations` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：四舍五入的核心——"5"是分界线`, en: `${narrator}: "The key to rounding — '5' is the dividing line"` },
      hint: { zh: `四舍五入的规则只有一条：\n\n看关键位右边那个数字\n• $0, 1, 2, 3, 4$ → 舍（往小的走）\n• $5, 6, 7, 8, 9$ → 入（往大的走）\n\n为什么 5 归"入"？因为 5 正好在中间，约定归大`, en: `The rounding rule is simple:\n\nLook at the digit right after the rounding position\n• $0, 1, 2, 3, 4$ → round DOWN\n• $5, 6, 7, 8, 9$ → round UP\n\nWhy does 5 round up? It's exactly in the middle, by convention we round up` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：$${n}$ 夹在哪两个"整数"之间？`, en: `${narrator}: "$${n}$ sits between which two round numbers?"` },
      hint: { zh: `$${n}$ 在 $${roundDown}$ 和 $${roundUp}$ 之间\n\n想象一条数轴：\n$${roundDown}$ ←——— $${n}$ ———→ $${roundUp}$\n\n$${n}$ 离哪个更近？`, en: `$${n}$ is between $${roundDown}$ and $${roundUp}$\n\nImagine a number line:\n$${roundDown}$ ←——— $${n}$ ———→ $${roundUp}$\n\nWhich is $${n}$ closer to?` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：怎么判断？看关键的那一位数字`, en: `${narrator}: "How to decide? Look at the key digit"` },
      hint: { zh: `看${placeNameZh}右边紧挨着的那个数字：$${decider}$\n\n规则：\n• $0, 1, 2, 3, 4$（小于 5）→ 靠近左边 → 舍（往小的走）\n• $5, 6, 7, 8, 9$（大于等于 5）→ 靠近右边 → 入（往大的走）\n\n$${decider}$ ${decider >= 5 ? `\\geq 5$ → 入！往大的走` : `< 5$ → 舍！往小的走`}`, en: `Look at the digit right after the ${placeNameEn} position: $${decider}$\n\nRule:\n• $0, 1, 2, 3, 4$ (less than 5) → closer to left → round DOWN\n• $5, 6, 7, 8, 9$ (5 or more) → closer to right → round UP\n\n$${decider}$ ${decider >= 5 ? `\\geq 5$ → round UP!` : `< 5$ → round DOWN!`}` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：所以 $${n}$ 四舍五入到${placeNameZh} = $${answer}$`, en: `${narrator}: "So $${n}$ rounded to ${placeNameEn} = $${answer}$"` },
      hint: { zh: `关键数字 $${decider}$ ${decider >= 5 ? `$\\geq 5$，往上进到 $${roundUp}$` : `$< 5$，往下舍到 $${roundDown}$`}\n\n答案 = $${answer}$`, en: `Key digit $${decider}$ ${decider >= 5 ? `$\\geq 5$, round up to $${roundUp}$` : `$< 5$, round down to $${roundDown}$`}\n\nAnswer = $${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——答案合理吗？`, en: `${narrator}: "Verify — does it make sense?"` },
      hint: { zh: `$${n}$ 四舍五入到${placeNameZh} = $${answer}$\n\n检查：\n• $${answer}$ 是 $${place}$ 的倍数吗？$${answer} \\div ${place} = ${answer/place}$ ✓\n• $${n}$ 和 $${answer}$ 差多少？$|${n} - ${answer}| = ${Math.abs(n - answer)}$\n• 差距不超过 $${place/2}$？$${Math.abs(n - answer)} ${Math.abs(n - answer) <= place/2 ? '\\leq' : '>'} ${place/2}$ ✓`, en: `$${n}$ rounded to ${placeNameEn} = $${answer}$\n\nCheck:\n• Is $${answer}$ a multiple of $${place}$? $${answer} \\div ${place} = ${answer/place}$ ✓\n• Difference: $|${n} - ${answer}| = ${Math.abs(n - answer)}$\n• Within $${place/2}$? $${Math.abs(n - answer)} ${Math.abs(n - answer) <= place/2 ? '\\leq' : '>'} ${place/2}$ ✓` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n, place, answer, generatorType: 'ESTIMATION_ROUND_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ANGLES_TRIANGLE generator: find missing angle in a triangle
   ══════════════════════════════════════════════════════════ */

export function generateAnglesTriangleMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '关羽';

  const ranges: Record<DifficultyTier, [number, number]> = { 1: [30, 80], 2: [20, 90], 3: [15, 120] };
  const a1 = randInt(ranges[tier][0], ranges[tier][1]);
  const maxA2 = Math.min(ranges[tier][1], 180 - a1 - 10);
  const minA2 = Math.max(ranges[tier][0], 10);
  const a2 = randInt(Math.min(minA2, maxA2), maxA2);
  const answer = 180 - a1 - a2;

  const description: BilingualText = {
    zh: `三角形两个角分别是 $${a1}°$ 和 $${a2}°$，第三个角是多少？`,
    en: `A triangle has angles $${a1}°$ and $${a2}°$. Find the third angle.`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么要算三角形的角？——裁旗、搭营都得知道每个角`, en: `${narrator}: "Why find triangle angles? — Cutting banners and pitching tents requires knowing every angle"` },
      hint: { zh: `三角旗只知道两个角，第三个角不知道\n没有第三个角，裁缝就没法裁布！\n\n好消息：三角形有一个神奇的规律\n只要知道两个角，第三个角一定能算出来`, en: `A triangular banner has two known angles, but the third is missing\nWithout it, the tailor can't cut the fabric!\n\nGood news: triangles have a magical rule\nIf you know two angles, the third can always be calculated` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：什么是"角"？两条线交叉的张开程度`, en: `${narrator}: "What is an 'angle'? How far two lines spread apart"` },
      hint: { zh: `什么是"角"？两条线相交形成的张开程度\n角度越大，两条线张得越开\n\n我们用"度"（°）来衡量：\n• 直角 = $90°$（像书角）\n• 半圈 = $180°$（一条直线）\n• 整圈 = $360°$`, en: `What is an "angle"? How far apart two lines spread when they meet\nBigger angle = wider spread\n\nWe measure in "degrees" (°):\n• Right angle = $90°$ (like a book corner)\n• Half turn = $180°$ (a straight line)\n• Full turn = $360°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：重要定理——三角形三个内角之和 = $180°$`, en: `${narrator}: "Key theorem — the three angles inside a triangle sum to $180°$"` },
      hint: { zh: `为什么？试试看：\n把三角形的三个角撕下来，拼在一起\n它们刚好拼成一条直线！\n一条直线 = $180°$\n\n所以不管什么形状的三角形——\n尖的、扁的、等边的——三个角加起来都是 $180°$`, en: `Why? Try this:\nTear off the three corners of a paper triangle\nArrange them together — they form a straight line!\nA straight line = $180°$\n\nSo ANY triangle — pointy, flat, equilateral —\nthe three angles always add to $180°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：已知两个角——先加起来`, en: `${narrator}: "Two angles known — add them first"` },
      hint: { zh: `角 1 = $${a1}°$\n角 2 = $${a2}°$\n\n两角之和：$${a1} + ${a2} = ${a1 + a2}°$\n\n三个角总共 $180°$，已经用掉了 $${a1 + a2}°$`, en: `Angle 1 = $${a1}°$\nAngle 2 = $${a2}°$\n\nSum of two: $${a1} + ${a2} = ${a1 + a2}°$\n\nThree angles total $180°$, already used $${a1 + a2}°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：第三个角 = 总和 - 已知角`, en: `${narrator}: "Third angle = total − known angles"` },
      hint: { zh: `$x = 180° - ${a1 + a2}°$\n$x = ${answer}°$`, en: `$x = 180° - ${a1 + a2}°$\n$x = ${answer}°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：验算——三个角加起来是不是 $180°$？`, en: `${narrator}: "Verify — do all three angles add to $180°$?"` },
      hint: { zh: `$${a1}° + ${a2}° + ${answer}° = ${a1 + a2 + answer}°$ ✓\n\n${answer < 90 ? `$${answer}°$ 是锐角（小于 $90°$）` : answer === 90 ? `$${answer}°$ 是直角` : `$${answer}°$ 是钝角（大于 $90°$）`}\n\n记住：三角形最多只能有一个钝角或直角！`, en: `$${a1}° + ${a2}° + ${answer}° = ${a1 + a2 + answer}°$ ✓\n\n${answer < 90 ? `$${answer}°$ is acute (less than $90°$)` : answer === 90 ? `$${answer}°$ is a right angle` : `$${answer}°$ is obtuse (greater than $90°$)`}\n\nRemember: a triangle can have at most ONE obtuse or right angle!` },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, angle: a1 + a2, total: 180, a1, a2, generatorType: 'ANGLES_TRIANGLE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ANGLES_POINT generator: angles at a point sum to 360°
   ══════════════════════════════════════════════════════════ */

export function generateAnglesPointMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  // Generate 2-3 known angles, find the missing one
  const numKnown = tier === 1 ? 2 : tier === 2 ? pickRandom([2, 3]) : 3;
  const angles: number[] = [];
  let remaining = 360;
  for (let i = 0; i < numKnown; i++) {
    const maxAngle = remaining - (numKnown - i) * 20;
    const a = randInt(40, Math.min(160, maxAngle));
    angles.push(a);
    remaining -= a;
  }
  const answer = remaining;

  const anglesStr = angles.map(a => `$${a}°$`).join('、');
  const anglesStrEn = angles.map(a => `$${a}°$`).join(', ');
  const sum = angles.reduce((s, a) => s + a, 0);

  const description: BilingualText = {
    zh: `围绕一点的角度分别是 ${anglesStr} 和 $x°$，求 $x$。`,
    en: `Angles around a point are ${anglesStrEn} and $x°$. Find $x$.`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：在瞭望台上四面观察——转一整圈看遍所有方向`, en: `${narrator}: "From the watchtower, look in every direction — a full turn covers them all"` },
      hint: { zh: `想象你站在瞭望台上：\n• 面朝北开始\n• 慢慢转身，向东→南→西\n• 转回朝北 = 转了一整圈\n\n一整圈 = $360°$\n\n为什么是 360？古人把天空分成 360 份\n（大约每天太阳移动 1°，一年 ≈ 360 天）`, en: `Imagine standing on a watchtower:\n• Start facing North\n• Turn slowly: East → South → West\n• Back to North = one full turn\n\nOne full turn = $360°$\n\nWhy 360? Ancient people divided the sky into 360 parts\n(The sun moves about 1° per day, ~360 days in a year)` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：所以——围绕一点的所有角加起来 = $360°$`, en: `${narrator}: "So — all angles around a point add up to $360°$"` },
      hint: { zh: `就像把一个圆饼切成几块\n不管切多少块，所有块合起来还是一个完整的圆\n完整的圆 = $360°$`, en: `Like cutting a round pie into pieces\nNo matter how many pieces, they all form a complete circle\nComplete circle = $360°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：已知的角加起来是多少？`, en: `${narrator}: "What do the known angles add up to?"` },
      hint: { zh: `$${angles.join('° + ')}°$\n$= ${sum}°$\n\n还剩多少度没有被覆盖？`, en: `$${angles.join('° + ')}°$\n$= ${sum}°$\n\nHow many degrees are left uncovered?` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：未知角 = 总度数 - 已知角`, en: `${narrator}: "Unknown angle = total − known angles"` },
      hint: { zh: `$x = 360° - ${sum}°$\n$x = ${answer}°$`, en: `$x = 360° - ${sum}°$\n$x = ${answer}°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：答案——$x = ${answer}°$`, en: `${narrator}: "Answer — $x = ${answer}°$"` },
      hint: { zh: `围绕一点的所有角：${angles.map(a => `$${a}°$`).join(' + ')} + $${answer}°$\n总计 $360°$ ✓`, en: `All angles around the point: ${angles.map(a => `$${a}°$`).join(' + ')} + $${answer}°$\nTotal $360°$ ✓` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：验算——所有角加起来是不是 $360°$？`, en: `${narrator}: "Verify — do all angles sum to $360°$?"` },
      hint: { zh: `$${angles.join('° + ')}° + ${answer}° = ${sum + answer}°$ ✓\n\n$${sum + answer} = 360$ ✓ 正好一整圈！`, en: `$${angles.join('° + ')}° + ${answer}° = ${sum + answer}°$ ✓\n\n$${sum + answer} = 360$ ✓ Exactly one full turn!` },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, angle: sum, total: 360, angles, generatorType: 'ANGLES_POINT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SEQUENCE_Y7 generator: simple linear sequences for Y7
   ══════════════════════════════════════════════════════════ */

export function generateSequenceY7Mission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';
  const mode: 'next' | 'nth' = template.data?.mode ?? 'next';

  const a1Pools: Record<DifficultyTier, number[]> = { 1: [1, 2, 3, 5, 10], 2: [1, 2, 3, 4, 5, 7, 10, 12], 3: [3, 5, 7, 8, 10, 12, 15, 20] };
  const dPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7, 8], 3: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] };
  const a1 = pickRandom(a1Pools[tier]);
  const d = pickRandom(dPools[tier]);

  if (mode === 'next') {
    // Show first 4-5 terms, ask for the next
    const showCount = tier === 1 ? 4 : 5;
    const terms = Array.from({ length: showCount }, (_, i) => a1 + i * d);
    const answer = a1 + showCount * d;
    const n = showCount + 1;
    const termsStr = terms.join(', ');

    const description: BilingualText = {
      zh: `数列 $${termsStr}, ?$，下一项是什么？`,
      en: `Sequence $${termsStr}, ?$ — what comes next?`,
    };

    const tutorialSteps = [
      {
        text: { zh: `${narrator}：每天招募新兵，看看人数有什么规律`, en: `${narrator}: "Daily recruitment numbers — spot the pattern"` },
        hint: { zh: `数列：$${termsStr}$\n\n什么是"数列"？就是按一定规律排列的一串数\n就像每天记录新兵人数：\n第 1 天：${terms[0]} 人\n第 2 天：${terms[1]} 人\n第 3 天：${terms[2]} 人\n第 4 天：${terms[3]} 人`, en: `Sequence: $${termsStr}$\n\nWhat is a sequence? Numbers arranged in a pattern\nLike daily recruitment records:\nDay 1: ${terms[0]}\nDay 2: ${terms[1]}\nDay 3: ${terms[2]}\nDay 4: ${terms[3]}` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：怎么找规律？看相邻两个数的差`, en: `${narrator}: "How to find the pattern? Look at the difference between neighbours"` },
        hint: { zh: `$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n$${terms[3]} - ${terms[2]} = ${d}$\n\n每次都差 $${d}$！这叫"公差"\n意思是：每一天比前一天多招 $${d}$ 人`, en: `$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n$${terms[3]} - ${terms[2]} = ${d}$\n\nAlways a difference of $${d}$! This is the "common difference"\nMeaning: each day recruits $${d}$ more than the last` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：下一项 = 最后一项 + 公差`, en: `${narrator}: "Next term = last term + common difference"` },
        hint: { zh: `最后一项是 $${terms[showCount - 1]}$\n公差是 $${d}$\n\n下一项 = $${terms[showCount - 1]} + ${d} = ${answer}$`, en: `Last term is $${terms[showCount - 1]}$\nCommon difference is $${d}$\n\nNext term = $${terms[showCount - 1]} + ${d} = ${answer}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：验算——新数字符合规律吗？`, en: `${narrator}: "Verify — does the new number fit the pattern?"` },
        hint: { zh: `完整数列：$${termsStr}, ${answer}$\n\n检查：$${answer} - ${terms[showCount - 1]} = ${d}$ ✓\n公差不变，规律成立！`, en: `Full sequence: $${termsStr}, ${answer}$\n\nCheck: $${answer} - ${terms[showCount - 1]} = ${d}$ ✓\nConstant difference — pattern holds!` },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { a1, d, n, generatorType: 'SEQUENCE_Y7_RANDOM', mode },
      tutorialSteps,
    };
  } else {
    // Find nth term using formula
    const nPools: Record<DifficultyTier, number[]> = { 1: [5, 6, 7, 8], 2: [6, 8, 10, 12], 3: [10, 15, 20, 25] };
    const n = pickRandom(nPools[tier]);
    const terms = Array.from({ length: 4 }, (_, i) => a1 + i * d);
    const answer = a1 + (n - 1) * d;
    const termsStr = terms.join(', ');

    const description: BilingualText = {
      zh: `数列 $${termsStr}, \\ldots$，第 $${n}$ 项是多少？`,
      en: `Sequence $${termsStr}, \\ldots$ — what is term $${n}$?`,
    };

    const tutorialSteps = [
      {
        text: { zh: `${narrator}：远征军第 $${n}$ 天的补给量是多少？不用逐天数，用公式直接算`, en: `${narrator}: "What's the supply on day $${n}$? Don't count day by day — use a formula"` },
        hint: { zh: `数列：$${termsStr}, \\ldots$\n\n如果要求第 $${n}$ 项，逐个数太慢了\n我们需要一个"直达公式"——给出位置 $n$，直接算出值`, en: `Sequence: $${termsStr}, \\ldots$\n\nCounting to term $${n}$ one by one is too slow\nWe need a "direct formula" — give it position $n$, get the value` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：第一步——找公差`, en: `${narrator}: "Step 1 — find the common difference"` },
        hint: { zh: `$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n\n公差 $d = ${d}$（每次加 $${d}$）`, en: `$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n\nCommon difference $d = ${d}$ (adding $${d}$ each time)` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：第二步——理解公式为什么是 $(n-1)$ 而不是 $n$`, en: `${narrator}: "Step 2 — why $(n-1)$ and not $n$?"` },
        hint: { zh: `第 1 项（起点）：$${a1}$，加了 $0$ 次公差\n第 2 项：$${a1} + ${d} \\times 1 = ${a1 + d}$，加了 $1$ 次\n第 3 项：$${a1} + ${d} \\times 2 = ${a1 + 2*d}$，加了 $2$ 次\n\n看到规律了吗？第 $n$ 项加了 $(n-1)$ 次公差！\n因为第 1 项还没开始加`, en: `Term 1 (start): $${a1}$, added $0$ differences\nTerm 2: $${a1} + ${d} \\times 1 = ${a1 + d}$, added $1$ time\nTerm 3: $${a1} + ${d} \\times 2 = ${a1 + 2*d}$, added $2$ times\n\nSee the pattern? Term $n$ adds $(n-1)$ differences!\nBecause term 1 hasn't added any yet` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：第三步——代入公式`, en: `${narrator}: "Step 3 — plug into the formula"` },
        hint: { zh: `公式：第 $n$ 项 $= a_1 + (n-1) \\times d$\n\n$a_1 = ${a1}$（首项）\n$d = ${d}$（公差）\n$n = ${n}$（要求第几项）\n\n$= ${a1} + (${n} - 1) \\times ${d}$\n$= ${a1} + ${n-1} \\times ${d}$\n$= ${a1} + ${(n-1)*d}$\n$= ${answer}$`, en: `Formula: term $n$ $= a_1 + (n-1) \\times d$\n\n$a_1 = ${a1}$ (first term)\n$d = ${d}$ (common difference)\n$n = ${n}$ (which term)\n\n$= ${a1} + (${n} - 1) \\times ${d}$\n$= ${a1} + ${n-1} \\times ${d}$\n$= ${a1} + ${(n-1)*d}$\n$= ${answer}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：验算——答案合理吗？`, en: `${narrator}: "Verify — is the answer reasonable?"` },
        hint: { zh: `第 $${n}$ 项 = $${answer}$\n\n快速检查：\n• 比第 1 项（$${a1}$）大？$${answer} > ${a1}$ ✓\n• 每次加 $${d}$，加了 $${n-1}$ 次\n• 总共多了 $${d} \\times ${n-1} = ${(n-1)*d}$\n• $${a1} + ${(n-1)*d} = ${answer}$ ✓`, en: `Term $${n}$ = $${answer}$\n\nQuick check:\n• Bigger than term 1 ($${a1}$)? $${answer} > ${a1}$ ✓\n• Adding $${d}$ a total of $${n-1}$ times\n• Total added: $${d} \\times ${n-1} = ${(n-1)*d}$\n• $${a1} + ${(n-1)*d} = ${answer}$ ✓` },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { a1, d, n, generatorType: 'SEQUENCE_Y7_RANDOM', mode },
      tutorialSteps,
    };
  }
}

/* ══════════════════════════════════════════════════════════
   STATISTICS_RANGE generator
   ══════════════════════════════════════════════════════════ */

export function generateStatsRangeMission(template: Mission): Mission {
  const tier = getTier();
  const countPools: Record<DifficultyTier, number[]> = { 1: [5], 2: [5, 6, 7], 3: [7, 8, 9, 10] };
  const valRanges: Record<DifficultyTier, [number, number]> = { 1: [3, 20], 2: [5, 50], 3: [10, 100] };
  const count = pickRandom(countPools[tier]);
  const values = Array.from({ length: count }, () => randInt(valRanges[tier][0], valRanges[tier][1]));
  const sorted = [...values].sort((a, b) => a - b);
  const answer = sorted[sorted.length - 1] - sorted[0];
  const narrator = pickRandom(['诸葛亮', '曹操']);

  const description: BilingualText = {
    zh: `求数据 $${sorted.join(', ')}$ 的极差（Range）。`,
    en: `Find the range of $${sorted.join(', ')}$.`,
  };

  const max = sorted[sorted.length - 1];
  const min = sorted[0];

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么需要"极差"？——一个数字看出差距`, en: `${narrator}: "Why do we need 'range'? — One number shows the spread"` },
      hint: { zh: `将军选兵，不光看平均战力\n还要看最强和最弱差多少\n\n差距大 → 水平参差不齐，需要整训\n差距小 → 水平齐整，可以出征\n\n极差就是用一个数字衡量这个差距`, en: `A general doesn't just look at average strength\nHe needs to know the gap between best and worst\n\nLarge gap → uneven, needs training\nSmall gap → consistent, ready for battle\n\nRange measures this gap with a single number` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：极差的公式——极差 = 最大值 − 最小值`, en: `${narrator}: "Range formula — Range = Maximum − Minimum"` },
      hint: { zh: `就这么简单！\n\n极差 = 最大值 − 最小值\n\n注意：只需要最大和最小两个数\n中间的数据不影响极差`, en: `That's it!\n\nRange = Maximum − Minimum\n\nNote: only need the largest and smallest\nMiddle values don't affect the range` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——排序后找最大最小`, en: `${narrator}: "Step 1 — Sort to find max and min"` },
      hint: { zh: `数据（已排序）：$${sorted.join(', ')}$\n\n最小值 = $${min}$（最左边）\n最大值 = $${max}$（最右边）\n\n排好序就能一眼看出！`, en: `Data (sorted): $${sorted.join(', ')}$\n\nMinimum = $${min}$ (leftmost)\nMaximum = $${max}$ (rightmost)\n\nSorting makes it obvious!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——相减`, en: `${narrator}: "Step 2 — Subtract"` },
      hint: { zh: `极差 = $${max} - ${min} = ${answer}$`, en: `Range = $${max} - ${min} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案：极差 = $${answer}$`, en: `${narrator}: "Answer: Range = $${answer}$"` },
      hint: { zh: `数据 $${sorted.join(', ')}$ 的极差是 $${answer}$\n\n这意味着最强和最弱之间相差 $${answer}$`, en: `Range of $${sorted.join(', ')}$ is $${answer}$\n\nThis means the gap between highest and lowest is $${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——极差合理吗？`, en: `${narrator}: "Verify — is the range reasonable?"` },
      hint: { zh: `极差 $${answer}$\n• 所有数据都在 $${min}$ 到 $${max}$ 之间？$${sorted.join(', ')}$ ✓\n• $${max} - ${min} = ${answer}$ ✓\n• 没有任何数据超出这个范围 ✓`, en: `Range $${answer}$\n• All data between $${min}$ and $${max}$? $${sorted.join(', ')}$ ✓\n• $${max} - ${min} = ${answer}$ ✓\n• No data outside this range ✓` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { values: sorted, mode: 'range', generatorType: 'STATISTICS_RANGE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA_TRIANGLE generator: base × height ÷ 2
   ══════════════════════════════════════════════════════════ */

export function generateAreaTriangleMission(template: Mission): Mission {
  const tier = getTier();
  const bPools: Record<DifficultyTier, number[]> = { 1: [4, 6, 8, 10], 2: [6, 8, 10, 12, 14, 16, 20], 3: [10, 12, 15, 18, 20, 24, 30] };
  const hPools: Record<DifficultyTier, number[]> = { 1: [3, 4, 5, 6], 2: [4, 5, 6, 7, 8, 10], 3: [6, 8, 9, 10, 12, 15] };
  const base = pickRandom(bPools[tier]);
  const height = pickRandom(hPools[tier]);
  const answer = base * height / 2;
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  const description: BilingualText = {
    zh: `三角形底 $${base}$，高 $${height}$，求面积。`,
    en: `Triangle with base $${base}$ and height $${height}$. Find the area.`,
  };

  const rectArea = base * height;
  const tutorialSteps = [
    {
      text: { zh: `${narrator}：裁制三角军旗——先搞懂"底"和"高"`, en: `${narrator}: "Making a triangular banner — first understand 'base' and 'height'"` },
      hint: { zh: `底（base）= 三角形最下面的那条边\n就是旗帜摊平后放在桌面上的那条边\n\n高（height）= 从底边到对面顶点的垂直距离\n就是旗帜从底部到尖端的"直上直下"距离\n\n注意：高一定是垂直的！不是斜边！`, en: `Base = the bottom edge of the triangle\nThe side resting on the table when you lay the banner flat\n\nHeight = the perpendicular distance from base to opposite corner\nThe "straight up" distance from bottom to tip\n\nNote: Height is always vertical! Not the slanted side!` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：为什么三角形面积要除以 2？`, en: `${narrator}: "Why do we divide by 2 for triangle area?"` },
      hint: { zh: `想象做两面一模一样的三角旗\n把第二面翻转过来，和第一面拼在一起\n\n拼出来的形状是——长方形！\n长方形面积 = $${base} \\times ${height} = ${rectArea}$\n\n一面三角旗 = 长方形的一半\n所以三角形面积 = $${rectArea} \\div 2 = ${answer}$`, en: `Imagine making two identical triangular banners\nFlip one over and join them together\n\nThe combined shape is — a rectangle!\nRectangle area = $${base} \\times ${height} = ${rectArea}$\n\nOne triangle = half the rectangle\nSo triangle area = $${rectArea} \\div 2 = ${answer}$` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：第一步——底 × 高`, en: `${narrator}: "Step 1 — base × height"` },
      hint: { zh: `底 = $${base}$\n高 = $${height}$\n\n$${base} \\times ${height} = ${rectArea}$\n\n（这是完整长方形的面积）`, en: `Base = $${base}$\nHeight = $${height}$\n\n$${base} \\times ${height} = ${rectArea}$\n\n(This is the full rectangle area)` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：第二步——除以 2`, en: `${narrator}: "Step 2 — divide by 2"` },
      hint: { zh: `$${rectArea} \\div 2 = ${answer}$`, en: `$${rectArea} \\div 2 = ${answer}$` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：答案——三角形面积 = $${answer}$`, en: `${narrator}: "Answer — Triangle area = $${answer}$"` },
      hint: { zh: `公式：$A = \\frac{1}{2} \\times base \\times height$\n$= \\frac{1}{2} \\times ${base} \\times ${height} = ${answer}$ 平方单位\n\n三角军旗的面积是 $${answer}$ 平方单位`, en: `Formula: $A = \\frac{1}{2} \\times base \\times height$\n$= \\frac{1}{2} \\times ${base} \\times ${height} = ${answer}$ square units\n\nThe triangular banner area is $${answer}$ square units` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：验算——答案合理吗？`, en: `${narrator}: "Verify — does it make sense?"` },
      hint: { zh: `三角形面积 = $${answer}$\n长方形面积 = $${rectArea}$\n\n$${answer}$ 是 $${rectArea}$ 的一半吗？\n$${answer} \\times 2 = ${rectArea}$ ✓\n\n三角旗面积 = $${answer}$ 平方单位`, en: `Triangle area = $${answer}$\nRectangle area = $${rectArea}$\n\nIs $${answer}$ half of $${rectArea}$?\n$${answer} \\times 2 = ${rectArea}$ ✓\n\nBanner area = $${answer}$ square units` },
      highlightField: 'area',
    },
  ];

  return {
    ...template,
    description,
    data: { base, height, answer, generatorType: 'AREA_TRIANGLE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FACTORS_LIST generator: list all factors of a number
   ══════════════════════════════════════════════════════════ */

export function generateFactorsListMission(template: Mission): Mission {
  const tier = getTier();
  const pools: Record<DifficultyTier, number[]> = {
    1: [6, 8, 10, 12, 15, 18, 20],
    2: [12, 16, 18, 20, 24, 28, 30, 36],
    3: [24, 30, 36, 40, 48, 56, 60, 72],
  };
  const n = pickRandom(pools[tier]);
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '刘备';

  // Find all factors
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  const answer = factors.length;

  const description: BilingualText = {
    zh: `$${n}$ 有几个因数？`,
    en: `How many factors does $${n}$ have?`,
  };

  // Show factor pairs for tutorial
  const pairs: string[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) pairs.push(`$${i} \\times ${n / i} = ${n}$`);
  }

  // Test a few specific divisions for tutorial demonstration
  const testYes = factors.length > 2 ? factors[1] : 2;
  const testNo = [5, 7, 9, 11].find(d => n % d !== 0) || 7;

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：$${n}$ 个新兵要编队——有几种等人数的分法？这就是找"因数"`, en: `${narrator}: "$${n}$ recruits need squads — how many ways to form equal groups? That's finding 'factors'"` },
      hint: { zh: `比如 $${n}$ 人分成 2 人一队，行不行？\n$${n} \\div 2 = ${n / 2}$${n % 2 === 0 ? '，刚好整除 ✓ → 可以！' : '... 有余数 ✗ → 不行！'}\n\n"因数"就是能把这个数平均分开的数`, en: `E.g., $${n}$ people in groups of 2 — possible?\n$${n} \\div 2 = ${n / 2}$${n % 2 === 0 ? ', exact ✓ → yes!' : '... remainder ✗ → no!'}\n\nA "factor" is a number that divides evenly` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：怎么判断"能不能整除"？——看有没有余数`, en: `${narrator}: "How to tell if it divides evenly? — Check for remainders"` },
      hint: { zh: `$${n} \\div ${testYes} = ${n / testYes}$，没有余数 → 整除 ✓ → $${testYes}$ 是因数\n$${n} \\div ${testNo} = ${Math.floor(n / testNo)}$ 余 $${n % testNo}$ → 不整除 ✗ → $${testNo}$ 不是因数\n\n整除 = 除得刚刚好，一点都不剩`, en: `$${n} \\div ${testYes} = ${n / testYes}$, no remainder → divides ✓ → $${testYes}$ is a factor\n$${n} \\div ${testNo} = ${Math.floor(n / testNo)}$ r $${n % testNo}$ → doesn't divide ✗ → $${testNo}$ is not\n\nDivides evenly = nothing left over` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：秘诀——因数总是成对出现`, en: `${narrator}: "Secret — factors always come in pairs"` },
      hint: { zh: `找到一个因数，就自动得到另一个：\n${pairs.join('\n')}\n\n每一对相乘都等于 $${n}$！\n所以我们不用从 1 试到 $${n}$，只要试到 $\\sqrt{${n}}$ 就够了`, en: `Find one factor, automatically get another:\n${pairs.join('\n')}\n\nEach pair multiplies to $${n}$!\nSo we only need to test up to $\\sqrt{${n}}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：把所有因数对拆开，从小到大排列`, en: `${narrator}: "Unpack all pairs and list from smallest to largest"` },
      hint: { zh: `$${n}$ 的全部因数：\n$${factors.join(', ')}$\n\n一共 $${answer}$ 个因数`, en: `All factors of $${n}$:\n$${factors.join(', ')}$\n\nTotal: $${answer}$ factors` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——每个因数都能整除 $${n}$`, en: `${narrator}: "Verify — every factor divides $${n}$ evenly"` },
      hint: { zh: `${factors.map(f => `$${n} \\div ${f} = ${n / f}$ ✓`).join('\n')}\n\n全部整除！$${n}$ 有 $${answer}$ 种编队方式`, en: `${factors.map(f => `$${n} \\div ${f} = ${n / f}$ ✓`).join('\n')}\n\nAll check out! $${n}$ has $${answer}$ ways to form equal groups` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：规律——1 和自身永远是因数`, en: `${narrator}: "Pattern — 1 and the number itself are always factors"` },
      hint: { zh: `任何数都能被 $1$ 整除（$${n} \\div 1 = ${n}$）\n任何数都能被自己整除（$${n} \\div ${n} = 1$）\n\n所以因数至少有 2 个\n如果只有 $1$ 和自己——那就是质数！（下一关会学）`, en: `Any number is divisible by $1$ ($${n} \\div 1 = ${n}$)\nAny number is divisible by itself ($${n} \\div ${n} = 1$)\n\nSo there are always at least 2 factors\nIf ONLY 1 and itself — that's a prime! (next mission)` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { n, factors, answer, generatorType: 'FACTORS_LIST_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   INTEGER_MUL generator: multiply/divide with negatives
   ══════════════════════════════════════════════════════════ */

export function generateIntegerMulMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '张飞';
  const mode: 'mul' | 'div' = template.data?.mode ?? 'mul';

  let a: number, b: number, answer: number, op: string;

  if (mode === 'div') {
    // Generate division: ensure clean result
    const resPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5, 6], 2: [3, 4, 5, 6, 7, 8], 3: [4, 5, 6, 7, 8, 9, 10] };
    const divPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6], 3: [3, 4, 5, 6, 7, 8] };
    const res = pickRandom(resPools[tier]);
    b = pickRandom(divPools[tier]);
    // Randomly negate
    const negA = pickRandom([true, false]);
    const negB = pickRandom([true, false]);
    a = (negA ? -1 : 1) * res * b;
    b = (negB ? -1 : 1) * b;
    answer = a / b;
    op = '÷';
  } else {
    const aPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5, 6], 2: [3, 4, 5, 6, 7, 8, 9], 3: [5, 6, 7, 8, 9, 10, 11, 12] };
    const bPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7], 3: [3, 4, 5, 6, 7, 8, 9] };
    a = pickRandom(aPools[tier]) * pickRandom([-1, 1]);
    b = pickRandom(bPools[tier]) * pickRandom([-1, 1]);
    answer = a * b;
    op = '×';
  }

  const signRule = (a >= 0) === (b >= 0) ? 'positive' : 'negative';
  const signRuleZh = signRule === 'positive' ? '同号得正' : '异号得负';
  const signRuleEn = signRule === 'positive' ? 'same signs → positive' : 'different signs → negative';

  const description: BilingualText = {
    zh: `计算 $(${a}) ${op} (${b}) = ?$`,
    en: `Calculate $(${a}) ${op} (${b}) = ?$`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么需要学负数乘除？——进攻退守，方向很重要`, en: `${narrator}: "Why learn multiplying negatives? — Advance or retreat, direction matters"` },
      hint: { zh: `正数 = 前进/得到/增加\n负数 = 后退/失去/减少\n\n"3 队骑兵各前进 2 里" = $3 \\times 2 = 6$ 里（正 = 前进）\n"3 队骑兵各后退 2 里" = $3 \\times (-2) = -6$ 里（负 = 后退）\n\n乘除里正负号代表方向！`, en: `Positive = advance/gain/increase\nNegative = retreat/lose/decrease\n\n"3 units advance 2 miles each" = $3 \\times 2 = 6$ miles (positive = forward)\n"3 units retreat 2 miles each" = $3 \\times (-2) = -6$ miles (negative = backward)\n\nSigns in multiplication represent direction!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：正负数乘除的核心规则`, en: `${narrator}: "Core rule for multiplying/dividing with signs"` },
      hint: { zh: `口诀：\n• 正 × 正 = 正（同号得正）\n• 负 × 负 = 正（同号得正）\n• 正 × 负 = 负（异号得负）\n• 负 × 正 = 负（异号得负）\n\n乘法和除法规则相同！`, en: `Rule:\n• (+) × (+) = (+) (same signs → positive)\n• (−) × (−) = (+) (same signs → positive)\n• (+) × (−) = (−) (different signs → negative)\n• (−) × (+) = (−) (different signs → negative)\n\nSame rule for division!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：为什么"负负得正"？`, en: `${narrator}: "Why does negative × negative = positive?"` },
      hint: { zh: `想象敌人在撤退（负方向）\n如果我们"取消"撤退（再一个负）\n取消撤退 = 前进 = 正方向！\n\n负负得正，就像"敌退我进"`, en: `Imagine the enemy is retreating (negative direction)\nIf we "cancel" the retreat (another negative)\nCancelling retreat = advance = positive!\n\nNeg × Neg = Pos, like "enemy retreats, we advance"` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——判断符号`, en: `${narrator}: "Step 1 — determine the sign"` },
      hint: { zh: `$(${a})$ 是${a >= 0 ? '正' : '负'}数\n$(${b})$ 是${b >= 0 ? '正' : '负'}数\n\n${signRuleZh}！结果是${signRule === 'positive' ? '正' : '负'}数`, en: `$(${a})$ is ${a >= 0 ? 'positive' : 'negative'}\n$(${b})$ is ${b >= 0 ? 'positive' : 'negative'}\n\n${signRuleEn}! Result is ${signRule}` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——只看绝对值（不管正负，算数字）`, en: `${narrator}: "Step 2 — compute with absolute values (ignore signs, just multiply/divide)"` },
      hint: { zh: `$${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$\n\n加上符号：${answer >= 0 ? '+' : '−'}$${Math.abs(answer)}$ = $${answer}$`, en: `$${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$\n\nAdd sign: ${answer >= 0 ? '+' : '−'}$${Math.abs(answer)}$ = $${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算`, en: `${narrator}: "Verify"` },
      hint: { zh: `$(${a}) ${op} (${b}) = ${answer}$ ✓\n\n符号规则：${signRuleZh} ✓\n数值计算：$${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$ ✓`, en: `$(${a}) ${op} (${b}) = ${answer}$ ✓\n\nSign rule: ${signRuleEn} ✓\nValue: $${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$ ✓` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, answer, op, mode, generatorType: 'INTEGER_MUL_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FDP_CONVERT generator: fraction ↔ decimal ↔ percentage
   ══════════════════════════════════════════════════════════ */

export function generateFdpConvertMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  // Common FDP equivalences
  const fdpSets: { frac: string; num: number; den: number; dec: number; pct: number }[] = [
    { frac: '1/2', num: 1, den: 2, dec: 0.5, pct: 50 },
    { frac: '1/4', num: 1, den: 4, dec: 0.25, pct: 25 },
    { frac: '3/4', num: 3, den: 4, dec: 0.75, pct: 75 },
    { frac: '1/5', num: 1, den: 5, dec: 0.2, pct: 20 },
    { frac: '2/5', num: 2, den: 5, dec: 0.4, pct: 40 },
    { frac: '3/5', num: 3, den: 5, dec: 0.6, pct: 60 },
    { frac: '1/10', num: 1, den: 10, dec: 0.1, pct: 10 },
    { frac: '3/10', num: 3, den: 10, dec: 0.3, pct: 30 },
    { frac: '1/8', num: 1, den: 8, dec: 0.125, pct: 12.5 },
    { frac: '1/3', num: 1, den: 3, dec: 0.333, pct: 33.3 },
  ];

  const pool = tier === 1 ? fdpSets.slice(0, 4) : tier === 2 ? fdpSets.slice(0, 7) : fdpSets;
  const chosen = pickRandom(pool);

  // Decide conversion direction
  const directions = ['frac_to_pct', 'pct_to_dec', 'dec_to_frac'] as const;
  const dir = pickRandom(tier === 1 ? directions.slice(0, 1) : directions);

  let answer: number;
  let description: BilingualText;

  if (dir === 'frac_to_pct') {
    answer = chosen.pct;
    description = {
      zh: `$\\frac{${chosen.num}}{${chosen.den}}$ 等于百分之几？`,
      en: `What percentage is $\\frac{${chosen.num}}{${chosen.den}}$?`,
    };
  } else if (dir === 'pct_to_dec') {
    answer = chosen.dec;
    description = {
      zh: `$${chosen.pct}\\%$ 化成小数是多少？`,
      en: `Convert $${chosen.pct}\\%$ to a decimal.`,
    };
  } else {
    answer = chosen.pct;
    description = {
      zh: `$${chosen.dec}$ 等于百分之几？`,
      en: `What percentage is $${chosen.dec}$?`,
    };
  }

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么要学转换？——战场上同一种情报，不同人用不同写法`, en: `${narrator}: "Why learn conversions? — Same intel, different formats for different people"` },
      hint: { zh: `将军说"半数兵力"\n军师说"0.5倍兵力"\n谋士说"50%兵力"\n\n说的是同一件事！\n你必须能在三种写法之间自由切换`, en: `The general says "half the troops"\nThe adviser says "0.5 of the troops"\nThe strategist says "50% of the troops"\n\nAll the same thing!\nYou must switch freely between all three forms` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：分数、小数、百分比——三种写法，同一个数`, en: `${narrator}: "Fractions, decimals, percentages — three forms, one value"` },
      hint: { zh: `$\\frac{1}{2} = 0.5 = 50\\%$\n\n就像同一个人有大名、小名、绰号\n换个写法，但数值不变`, en: `$\\frac{1}{2} = 0.5 = 50\\%$\n\nLike the same person with a formal name, nickname, and title\nDifferent form, same value` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：转换秘诀——分数 → 小数 → 百分比`, en: `${narrator}: "Conversion chain: Fraction → Decimal → Percentage"` },
      hint: { zh: `分数 → 小数：分子 ÷ 分母\n$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.num} \\div ${chosen.den} = ${chosen.dec}$\n\n小数 → 百分比：乘以 100\n$${chosen.dec} \\times 100 = ${chosen.pct}\\%$\n\n百分比 → 小数：除以 100\n$${chosen.pct}\\% \\div 100 = ${chosen.dec}$`, en: `Fraction → Decimal: numerator ÷ denominator\n$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.num} \\div ${chosen.den} = ${chosen.dec}$\n\nDecimal → Percentage: × 100\n$${chosen.dec} \\times 100 = ${chosen.pct}\\%$\n\nPercentage → Decimal: ÷ 100\n$${chosen.pct}\\% \\div 100 = ${chosen.dec}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：这道题的答案`, en: `${narrator}: "The answer to this question"` },
      hint: { zh: `$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.dec} = ${chosen.pct}\\%$\n\n答案 = $${answer}$`, en: `$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.dec} = ${chosen.pct}\\%$\n\nAnswer = $${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——反向转换回去`, en: `${narrator}: "Verify — convert back the other way"` },
      hint: { zh: dir === 'frac_to_pct'
        ? `答案 $${chosen.pct}\\%$\n反向：$${chosen.pct} \\div 100 = ${chosen.dec}$\n$${chosen.dec} = \\frac{${chosen.num}}{${chosen.den}}$ ✓`
        : dir === 'pct_to_dec'
        ? `答案 $${chosen.dec}$\n反向：$${chosen.dec} \\times 100 = ${chosen.pct}\\%$ ✓`
        : `答案 $${chosen.pct}\\%$\n反向：$${chosen.pct} \\div 100 = ${chosen.dec}$ ✓`,
        en: dir === 'frac_to_pct'
        ? `Answer $${chosen.pct}\\%$\nReverse: $${chosen.pct} \\div 100 = ${chosen.dec}$\n$${chosen.dec} = \\frac{${chosen.num}}{${chosen.den}}$ ✓`
        : dir === 'pct_to_dec'
        ? `Answer $${chosen.dec}$\nReverse: $${chosen.dec} \\times 100 = ${chosen.pct}\\%$ ✓`
        : `Answer $${chosen.pct}\\%$\nReverse: $${chosen.pct} \\div 100 = ${chosen.dec}$ ✓` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：必背口诀——常见分数百分比对照表`, en: `${narrator}: "Must memorize — common fraction/percentage equivalents"` },
      hint: { zh: `$\\frac{1}{2} = 50\\%$，$\\frac{1}{4} = 25\\%$，$\\frac{3}{4} = 75\\%$\n$\\frac{1}{5} = 20\\%$，$\\frac{2}{5} = 40\\%$，$\\frac{3}{5} = 60\\%$\n$\\frac{1}{10} = 10\\%$，$\\frac{1}{3} \\approx 33.3\\%$`, en: `$\\frac{1}{2} = 50\\%$, $\\frac{1}{4} = 25\\%$, $\\frac{3}{4} = 75\\%$\n$\\frac{1}{5} = 20\\%$, $\\frac{2}{5} = 40\\%$, $\\frac{3}{5} = 60\\%$\n$\\frac{1}{10} = 10\\%$, $\\frac{1}{3} \\approx 33.3\\%$` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { ...chosen, dir, answer, generatorType: 'FDP_CONVERT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   BODMAS generator: order of operations
   ══════════════════════════════════════════════════════════ */

export function generateBodmasMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  let a: number, b: number, c: number, answer: number, expr: string;

  if (tier === 1) {
    // a + b × c
    a = randInt(2, 10);
    b = randInt(2, 5);
    c = randInt(2, 5);
    answer = a + b * c;
    expr = `${a} + ${b} \\times ${c}`;
  } else if (tier === 2) {
    // a × b + c × d or a + b × c - d
    a = randInt(2, 8);
    b = randInt(2, 6);
    c = randInt(1, 10);
    answer = a + b * c;
    expr = `${a} + ${b} \\times ${c}`;
    // Sometimes use subtraction
    if (pickRandom([true, false])) {
      const d = randInt(1, Math.min(5, a + b * c - 1));
      answer = a + b * c - d;
      expr = `${a} + ${b} \\times ${c} - ${d}`;
    }
  } else {
    // With brackets: (a + b) × c
    a = randInt(2, 8);
    b = randInt(2, 8);
    c = randInt(2, 6);
    answer = (a + b) * c;
    expr = `(${a} + ${b}) \\times ${c}`;
  }

  const wrongAnswer = tier <= 2 ? (a + b) * c : a + b * c; // Common mistake

  const description: BilingualText = {
    zh: `计算 $${expr}$`,
    en: `Calculate $${expr}$`,
  };

  const tutorialSteps = tier <= 2 ? [
    {
      text: { zh: `${narrator}：为什么不能从左到右算？——因为运算有"军衔"`, en: `${narrator}: "Why not just calculate left to right? — Because operations have 'ranks'"` },
      hint: { zh: `日常生活中，我们从左到右读句子\n但数学不一样！运算有优先级：\n\n乘除 > 加减\n就像将军的命令比士兵的命令优先\n\n$2 + 3 \\times 4$：乘法（将军）先执行，加法（士兵）后执行`, en: `In everyday life, we read left to right\nBut math is different! Operations have priority:\n\nMultiply/Divide > Add/Subtract\nLike a general's order overrides a soldier's\n\n$2 + 3 \\times 4$: multiplication (general) first, addition (soldier) second` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：口诀 BODMAS——运算的军衔表`, en: `${narrator}: "BODMAS — the rank table of operations"` },
      hint: { zh: `B — Brackets 括号（最高！统帅级）\nO — Orders 幂/根号（将军级）\nDM — Division/Multiplication 乘除（校官级）\nAS — Addition/Subtraction 加减（士兵级）\n\n遇到同级（比如既有乘又有除）→ 从左到右`, en: `B — Brackets (highest! Commander)\nO — Orders/Powers (General)\nDM — Division/Multiplication (Officer)\nAS — Addition/Subtraction (Soldier)\n\nSame rank (e.g., both × and ÷) → left to right` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：看这道题——$${expr}$，有哪些运算？`, en: `${narrator}: "Look at $${expr}$ — what operations are there?"` },
      hint: { zh: `$${expr}$ 包含：\n• 乘法 $${b} \\times ${c}$（校官级）\n• 加法 $+ ${a}$（士兵级）\n\n校官 > 士兵 → 先算乘法！`, en: `$${expr}$ contains:\n• Multiplication $${b} \\times ${c}$ (Officer rank)\n• Addition $+ ${a}$ (Soldier rank)\n\nOfficer > Soldier → multiply first!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——先算乘法（军衔高的先执行）`, en: `${narrator}: "Step 1 — multiply first (higher rank goes first)"` },
      hint: { zh: `$${b} \\times ${c} = ${b * c}$\n\n现在式子变成：$${a} + ${b * c}$`, en: `$${b} \\times ${c} = ${b * c}$\n\nNow the expression becomes: $${a} + ${b * c}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——再算加法`, en: `${narrator}: "Step 2 — now add"` },
      hint: { zh: `$${a} + ${b * c} = ${answer}$`, en: `$${a} + ${b * c} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：对比——如果犯了"从左到右"的错误`, en: `${narrator}: "Compare — what if you made the 'left to right' mistake?"` },
      hint: { zh: `错误做法（从左到右）：\n$${a} + ${b} = ${a + b}$，然后 $${a + b} \\times ${c} = ${wrongAnswer}$ ✗\n\n正确做法（先乘后加）：\n$${b} \\times ${c} = ${b * c}$，然后 $${a} + ${b * c} = ${answer}$ ✓\n\n$${wrongAnswer} \\neq ${answer}$——顺序不同，答案完全不同！`, en: `Wrong (left to right):\n$${a} + ${b} = ${a + b}$, then $${a + b} \\times ${c} = ${wrongAnswer}$ ✗\n\nCorrect (multiply first):\n$${b} \\times ${c} = ${b * c}$, then $${a} + ${b * c} = ${answer}$ ✓\n\n$${wrongAnswer} \\neq ${answer}$ — different order, totally different answer!` },
      highlightField: 'ans',
    },
  ] : [
    {
      text: { zh: `${narrator}：括号——运算界的"统帅令"`, en: `${narrator}: "Brackets — the 'supreme command' of operations"` },
      hint: { zh: `BODMAS 里 B = Brackets（括号）\n括号的军衔最高——比乘除还高\n\n有括号？先算括号里面的\n没括号？按乘除 > 加减的顺序`, en: `BODMAS: B = Brackets\nBrackets outrank everything — even multiply/divide\n\nBrackets present? Calculate inside first\nNo brackets? Follow multiply/divide > add/subtract` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：$${expr}$ ——发现括号了！先算它`, en: `${narrator}: "$${expr}$ — spot the brackets! Do them first"` },
      hint: { zh: `第一步（括号内）：$${a} + ${b} = ${a + b}$\n\n现在式子变成：$${a + b} \\times ${c}$`, en: `Step 1 (inside brackets): $${a} + ${b} = ${a + b}$\n\nNow: $${a + b} \\times ${c}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——括号消除后，正常算`, en: `${narrator}: "Step 2 — brackets done, calculate normally"` },
      hint: { zh: `$${a + b} \\times ${c} = ${answer}$`, en: `$${a + b} \\times ${c} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：对比——有括号 vs 没括号`, en: `${narrator}: "Compare — with brackets vs without"` },
      hint: { zh: `有括号：$(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${answer}$\n无括号：$${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${a + b * c}$\n\n$${answer} \\neq ${a + b * c}$\n\n括号把加法的军衔"临时提升"了——先算加法再算乘法！`, en: `With: $(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${answer}$\nWithout: $${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${a + b * c}$\n\n$${answer} \\neq ${a + b * c}$\n\nBrackets "temporarily promote" addition — add before multiply!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——答案 $${answer}$ 对吗？`, en: `${narrator}: "Verify — is $${answer}$ correct?"` },
      hint: { zh: `$(${a} + ${b}) \\times ${c}$\n$= ${a + b} \\times ${c}$\n$= ${answer}$ ✓\n\nBODMAS 口诀：B 括号 → O 幂 → DM 乘除 → AS 加减`, en: `$(${a} + ${b}) \\times ${c}$\n$= ${a + b} \\times ${c}$\n$= ${answer}$ ✓\n\nBODMAS: B Brackets → O Orders → DM Div/Mul → AS Add/Sub` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { answer, expr, generatorType: 'BODMAS_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SIMPLIFY generator: collecting like terms (ax + bx = (a+b)x)
   ══════════════════════════════════════════════════════════ */

export function generateSimplifyMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  const aPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7], 3: [3, 4, 5, 6, 7, 8, 9] };
  const bPools: Record<DifficultyTier, number[]> = { 1: [1, 2, 3, 4], 2: [2, 3, 4, 5, 6], 3: [3, 4, 5, 6, 7, 8] };
  const a = pickRandom(aPools[tier]);
  const b = pickRandom(bPools[tier]);
  const answer = a + b;

  // Generate expression: ax + bx or ax + bx + c
  let expr: string, exprEn: string;
  let c: number | null = null;

  if (tier >= 2 && pickRandom([true, false])) {
    c = randInt(1, 10);
    expr = `${a}x + ${b}x + ${c}`;
    exprEn = expr;
  } else {
    expr = `${a}x + ${b}x`;
    exprEn = expr;
  }

  const simplified = c !== null ? `${answer}x + ${c}` : `${answer}x`;

  const description: BilingualText = {
    zh: `化简 $${expr}$，$x$ 的系数是多少？`,
    en: `Simplify $${expr}$. What is the coefficient of $x$?`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么要化简？——把复杂的式子变简洁`, en: `${narrator}: "Why simplify? — Turn complex expressions into clean ones"` },
      hint: { zh: `行军布阵时，"3队骑兵加2队骑兵"说起来太啰嗦\n直接说"5队骑兵"更清楚\n\n化简就是把数学式子也这样"合并同类"`, en: `In battle planning, "3 cavalry units plus 2 cavalry units" is wordy\nJust say "5 cavalry units" — much clearer\n\nSimplifying does the same for math expressions` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：什么是"同类项"？——字母部分完全相同`, en: `${narrator}: "What are 'like terms'? — Same letter part"` },
      hint: { zh: `$3x + 2x$ 就像"3 箱苹果 + 2 箱苹果"\n苹果一样，箱子可以合并！\n$3x + 2x = 5x$（5 箱苹果）\n\n但 $3x + 2y$ 不能合并——苹果和橘子不能混！`, en: `$3x + 2x$ is like "3 boxes of apples + 2 boxes of apples"\nSame fruit, boxes can be combined!\n$3x + 2x = 5x$ (5 boxes)\n\nBut $3x + 2y$ can't combine — apples and oranges don't mix!` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：判断——$${expr}$ 中哪些是同类项？`, en: `${narrator}: "Identify — which terms in $${expr}$ are like terms?"` },
      hint: { zh: `同类项 = 字母部分完全相同\n\n✓ $${a}x$ 和 $${b}x$ 是同类项（都是 $x$）\n✗ $3x$ 和 $3y$ 不是同类项（一个 $x$ 一个 $y$）\n✗ $3x$ 和 $3x^2$ 不是同类项（一个 $x$ 一个 $x^2$）${c !== null ? `\n✗ $${a}x$ 和 $${c}$（常数）不是同类项` : ''}`, en: `Like terms = exact same letter part\n\n✓ $${a}x$ and $${b}x$ are like terms (both $x$)\n✗ $3x$ and $3y$ are NOT (different letters)\n✗ $3x$ and $3x^2$ are NOT ($x$ vs $x^2$)${c !== null ? `\n✗ $${a}x$ and $${c}$ (constant) are NOT like terms` : ''}` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：合并！——只加系数，字母不变`, en: `${narrator}: "Combine! — Add the coefficients, keep the letter"` },
      hint: { zh: `$${a}x + ${b}x$\n= $(${a} + ${b})x$\n= $${answer}x$\n\n系数相加：$${a} + ${b} = ${answer}$\n字母照抄：$x$${c !== null ? `\n\n$${c}$ 是常数项，不能和 $x$ 合并，保留` : ''}`, en: `$${a}x + ${b}x$\n= $(${a} + ${b})x$\n= $${answer}x$\n\nCoefficients add: $${a} + ${b} = ${answer}$\nLetter stays: $x$${c !== null ? `\n\n$${c}$ is a constant, can't combine with $x$, keep it` : ''}` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案——$x$ 的系数是 $${answer}$`, en: `${narrator}: "Answer — coefficient of $x$ is $${answer}$"` },
      hint: { zh: `$${expr} = ${simplified}$\n\n$x$ 的系数 = $${answer}$`, en: `$${expr} = ${simplified}$\n\nCoefficient of $x$ = $${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——代入 $x = 1$ 检验`, en: `${narrator}: "Verify — substitute $x = 1$ to check"` },
      hint: { zh: `原式：$${a}(1) + ${b}(1)${c !== null ? ` + ${c}` : ''} = ${a + b}${c !== null ? ` + ${c} = ${a + b + c}` : ''}$\n化简后：$${answer}(1)${c !== null ? ` + ${c} = ${answer + c}` : ` = ${answer}`}$\n\n${a + b + (c || 0)} = ${answer + (c || 0)} ✓ 一致！`, en: `Original: $${a}(1) + ${b}(1)${c !== null ? ` + ${c}` : ''} = ${a + b}${c !== null ? ` + ${c} = ${a + b + c}` : ''}$\nSimplified: $${answer}(1)${c !== null ? ` + ${c} = ${answer + c}` : ` = ${answer}`}$\n\n${a + b + (c || 0)} = ${answer + (c || 0)} ✓ Match!` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, c, answer, expr, simplified, generatorType: 'SIMPLIFY_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   STATISTICS_MODE generator: find the most frequent value
   ══════════════════════════════════════════════════════════ */

export function generateStatsModeMission(template: Mission): Mission {
  const tier = getTier();
  const countPools: Record<DifficultyTier, number[]> = { 1: [7], 2: [7, 9], 3: [9, 11] };
  const valRanges: Record<DifficultyTier, [number, number]> = { 1: [1, 10], 2: [1, 20], 3: [1, 30] };
  const count = pickRandom(countPools[tier]);
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '张飞';

  // Generate data with a clear mode (one value appears more often)
  const modeValue = randInt(valRanges[tier][0], valRanges[tier][1]);
  const modeCount = tier === 1 ? 3 : randInt(3, 4);
  const values: number[] = Array(modeCount).fill(modeValue);
  while (values.length < count) {
    let v = randInt(valRanges[tier][0], valRanges[tier][1]);
    // Ensure no other value ties with mode
    if (v !== modeValue && values.filter(x => x === v).length < modeCount - 1) {
      values.push(v);
    }
  }
  // Shuffle
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  const sorted = [...values].sort((a, b) => a - b);

  // Count frequencies
  const freq: Record<number, number> = {};
  for (const v of values) freq[v] = (freq[v] || 0) + 1;
  const freqEntries = Object.entries(freq).map(([k, v]) => ({ val: Number(k), count: v })).sort((a, b) => b.count - a.count);

  const description: BilingualText = {
    zh: `求数据 $${sorted.join(', ')}$ 的众数（Mode）。`,
    en: `Find the mode of $${sorted.join(', ')}$.`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：缴获一批兵器，哪种最多？——这就是"众数"`, en: `${narrator}: "Captured weapons — which type is most common? That's the 'mode'"` },
      hint: { zh: `众数 = 出现次数最多的值\n就是数据里的"人气王"\n\n为什么有用？\n知道最常见的兵器 → 知道敌军偏好什么战术\n知道最常见的分数 → 知道大部分学生在什么水平`, en: `Mode = most frequent value — the "most popular"\n\nWhy useful?\nMost common weapon → enemy's preferred tactics\nMost common score → where most students are` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：怎么找？——给每个值"画正字"计数`, en: `${narrator}: "How? — Tally each value"` },
      hint: { zh: `数据：$${sorted.join(', ')}$\n\n${freqEntries.map(e => `$${e.val}$：${'|'.repeat(e.count)}$ = $${e.count}$ 次`).join('\n')}`, en: `Data: $${sorted.join(', ')}$\n\n${freqEntries.map(e => `$${e.val}$: ${'|'.repeat(e.count)}$ = $${e.count}$ times`).join('\n')}` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：谁的票数最多？`, en: `${narrator}: "Who got the most votes?"` },
      hint: { zh: `$${modeValue}$ 出现了 $${modeCount}$ 次——最多！\n\n众数 = $${modeValue}$`, en: `$${modeValue}$ appears $${modeCount}$ times — the most!\n\nMode = $${modeValue}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案——众数 = $${modeValue}$`, en: `${narrator}: "Answer — Mode = $${modeValue}$"` },
      hint: { zh: `数据 $${sorted.join(', ')}$\n\n$${modeValue}$ 出现了 $${modeCount}$ 次，比其他任何值都多\n\n众数 = $${modeValue}$`, en: `Data: $${sorted.join(', ')}$\n\n$${modeValue}$ appears $${modeCount}$ times, more than any other value\n\nMode = $${modeValue}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——确认没有其他值出现得更多`, en: `${narrator}: "Verify — confirm no other value appears more often"` },
      hint: { zh: `${freqEntries.map(e => `$${e.val}$：${e.count} 次${e.val === modeValue ? ' ← 最多！' : ''}`).join('\n')}\n\n没有并列 → 众数唯一 = $${modeValue}$ ✓`, en: `${freqEntries.map(e => `$${e.val}$: ${e.count} times${e.val === modeValue ? ' ← most!' : ''}`).join('\n')}\n\nNo ties → unique mode = $${modeValue}$ ✓` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：注意——众数可能有多个，也可能没有`, en: `${narrator}: "Note — there can be multiple modes, or none"` },
      hint: { zh: `• 如果两个值并列最多 → 两个众数\n• 如果所有值都出现一样多 → 没有众数\n\n这道题：$${modeValue}$ 独占鳌头，众数唯一`, en: `• Two values tied for most → two modes\n• All values appear equally → no mode\n\nThis problem: $${modeValue}$ is clearly dominant, unique mode` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { values: sorted, mode: 'mode', modeValue, modeCount, generatorType: 'STATISTICS_MODE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   TWO-STEP EQUATION generator: ax + b = c
   ══════════════════════════════════════════════════════════ */

export function generateTwoStepEqMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  const aPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7], 3: [3, 4, 5, 6, 7, 8, 9] };
  const xPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [3, 4, 5, 6, 7, 8], 3: [4, 5, 6, 7, 8, 9, 10] };
  const bPools: Record<DifficultyTier, number[]> = { 1: [1, 2, 3, 4, 5], 2: [2, 3, 4, 5, 7, 8], 3: [3, 5, 7, 9, 11] };

  const a = pickRandom(aPools[tier]);
  const x = pickRandom(xPools[tier]);
  const b = pickRandom(bPools[tier]);
  const result = a * x + b;

  const description: BilingualText = {
    zh: `解方程 $${a}x + ${b} = ${result}$，求 $x$。`,
    en: `Solve $${a}x + ${b} = ${result}$ for $x$.`,
  };

  const step1Result = result - b;

  const tutorialEquationSteps = [
    { tex: `${a}x + ${b} = ${result}`, annotation: { zh: '原方程', en: 'Original equation' } },
    { tex: `${a}x + ${b} - ${b} = ${result} - ${b}`, annotation: { zh: `两边 -${b}`, en: `-${b} both sides` } },
    { tex: `${a}x = ${step1Result}`, annotation: { zh: '化简', en: 'Simplify' } },
    { tex: `\\frac{${a}x}{${a}} = \\frac{${step1Result}}{${a}}`, annotation: { zh: `两边 ÷${a}`, en: `÷${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：一步方程你已经会了——现在升级：两步方程`, en: `${narrator}: "You've mastered one-step equations — now level up: two-step equations"` },
      hint: { zh: `一步方程：$${a}x = ${step1Result}$（只要除一次就解出 $x$）\n\n两步方程：$${a}x + ${b} = ${result}$（$x$ 被包了两层！）\n\n就像攻城——一步方程只有一道门\n两步方程有两道门：外门（$+${b}$）和内门（$\\times ${a}$）`, en: `One-step: $${a}x = ${step1Result}$ (one division solves it)\n\nTwo-step: $${a}x + ${b} = ${result}$ ($x$ is double-wrapped!)\n\nLike a siege — one-step has one gate\nTwo-step has two gates: outer ($+${b}$) and inner ($\\times ${a}$)` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：先看清"敌情"——$x$ 被怎么包的？`, en: `${narrator}: "First, assess the situation — how is $x$ wrapped?"` },
      hint: { zh: `$${a}x + ${b} = ${result}$\n\n从 $x$ 出发，经历了什么？\n① $x$ 先被乘以 $${a}$ → 变成 $${a}x$（内层）\n② $${a}x$ 再加上 $${b}$ → 变成 $${a}x + ${b}$（外层）\n\n解方程 = 反过来拆：先拆外层，再拆内层`, en: `$${a}x + ${b} = ${result}$\n\nStarting from $x$, what happened?\n① $x$ multiplied by $${a}$ → becomes $${a}x$ (inner layer)\n② $${a}x$ plus $${b}$ → becomes $${a}x + ${b}$ (outer layer)\n\nSolving = reverse: outer layer first, then inner` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：第一步——拆外门：两边减 $${b}$`, en: `${narrator}: "Step 1 — break outer gate: subtract $${b}$ from both sides"` },
      hint: { zh: `$${a}x + ${b} - ${b} = ${result} - ${b}$\n\n左边：$+${b}$ 和 $-${b}$ 互相抵消！\n$${a}x = ${step1Result}$\n\n外门攻破！现在只剩内门了`, en: `$${a}x + ${b} - ${b} = ${result} - ${b}$\n\nLeft: $+${b}$ and $-${b}$ cancel!\n$${a}x = ${step1Result}$\n\nOuter gate broken! Only inner gate remains` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：第二步——拆内门：两边除以 $${a}$`, en: `${narrator}: "Step 2 — break inner gate: divide both sides by $${a}$"` },
      hint: { zh: `$\\frac{${a}x}{${a}} = \\frac{${step1Result}}{${a}}$\n\n左边：$\\times ${a}$ 和 $\\div ${a}$ 抵消！\n$x = ${x}$\n\n城门全破！$x$ 被解放了`, en: `$\\frac{${a}x}{${a}} = \\frac{${step1Result}}{${a}}$\n\nLeft: $\\times ${a}$ and $\\div ${a}$ cancel!\n$x = ${x}$\n\nAll gates broken! $x$ is free` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：验算——把 $x = ${x}$ 代回原方程`, en: `${narrator}: "Verify — substitute $x = ${x}$ back"` },
      hint: { zh: `$${a} \\times ${x} + ${b}$\n$= ${a * x} + ${b}$\n$= ${result}$ ✓ 和右边一样！`, en: `$${a} \\times ${x} + ${b}$\n$= ${a * x} + ${b}$\n$= ${result}$ ✓ matches the right side!` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：口诀总结`, en: `${narrator}: "Summary"` },
      hint: { zh: `两步方程解法：\n① 看清两层：外层（加减）+ 内层（乘除）\n② 先拆外层：用反操作（加→减，减→加）\n③ 再拆内层：用反操作（乘→除，除→乘）\n④ 验算：代回原方程检查\n\n口诀：从外到内，逐层击破！`, en: `Two-step equation method:\n① Identify two layers: outer (add/sub) + inner (mul/div)\n② Remove outer layer with reverse operation\n③ Remove inner layer with reverse operation\n④ Verify: substitute back\n\nRule: outside in, layer by layer!` },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    data: { ...template.data, x, a, b, result, left: `${a}x + ${b}`, right: `${result}`, generatorType: 'SIMPLE_EQ_TWOSTEP_RANDOM', tutorialEquationSteps },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   COORDINATES generator: read/identify coordinate points
   ══════════════════════════════════════════════════════════ */

export function generateCoordinatesMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';
  const mode: 'read' | 'negative' = template.data?.mode ?? 'read';

  let targetX: number, targetY: number;

  if (mode === 'negative' || tier >= 2) {
    // Include negative coordinates (quadrants II, III, IV)
    const ranges: Record<DifficultyTier, [number, number]> = { 1: [-5, 5], 2: [-8, 8], 3: [-10, 10] };
    const [lo, hi] = ranges[tier];
    targetX = randInt(lo, hi);
    targetY = randInt(lo, hi);
    // Avoid origin for meaningful questions
    if (targetX === 0 && targetY === 0) targetX = randInt(1, hi);
  } else {
    // First quadrant only (tier 1, mode 'read')
    targetX = randInt(1, 8);
    targetY = randInt(1, 8);
  }

  const quadrant = targetX > 0 && targetY > 0 ? 'I' : targetX < 0 && targetY > 0 ? 'II' : targetX < 0 && targetY < 0 ? 'III' : 'IV';
  const quadrantZh = { I: '第一象限（右上）', II: '第二象限（左上）', III: '第三象限（左下）', IV: '第四象限（右下）' }[quadrant];
  const quadrantEn = { I: 'Quadrant I (top-right)', II: 'Quadrant II (top-left)', III: 'Quadrant III (bottom-left)', IV: 'Quadrant IV (bottom-right)' }[quadrant];

  const description: BilingualText = {
    zh: `敌营位于坐标 $(${targetX}, ${targetY})$。输入 $x$ 和 $y$ 坐标。`,
    en: `Enemy camp is at $(${targetX}, ${targetY})$. Enter the $x$ and $y$ coordinates.`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么需要坐标？——让每个位置都有"地址"`, en: `${narrator}: "Why do we need coordinates? — Give every position an 'address'"` },
      hint: { zh: `"敌军在东边"——太模糊了！\n"敌军在东 5 里、北 3 里"——精确！\n\n坐标就是用数字精确描述位置的方法\n战场上每个点都有唯一的"数字地址"`, en: `"The enemy is to the east" — too vague!\n"The enemy is 5 miles east, 3 miles north" — precise!\n\nCoordinates use numbers to pinpoint locations\nEvery point on the battlefield has a unique "numerical address"` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：坐标系的结构——两条轴 + 原点`, en: `${narrator}: "Coordinate system — two axes + origin"` },
      hint: { zh: `想象一张方格地图：\n• 横着看（→）= $x$ 轴\n• 竖着看（↑）= $y$ 轴\n• 两条轴交叉的点 = 原点 $(0, 0)$\n\n每个位置用 $(x, y)$ 表示：\n先走横的（$x$），再走竖的（$y$）\n\n口诀：先横后竖，先 $x$ 后 $y$`, en: `Imagine a grid map:\n• Horizontal (→) = $x$-axis\n• Vertical (↑) = $y$-axis\n• Where they cross = origin $(0, 0)$\n\nEvery position is written $(x, y)$:\nGo horizontal first ($x$), then vertical ($y$)\n\nRule: across first, then up — $x$ before $y$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：$x$ 坐标——往右为正，往左为负`, en: `${narrator}: "$x$ coordinate — right is positive, left is negative"` },
      hint: { zh: `从原点出发：\n• 往右走 3 步 → $x = 3$\n• 往左走 2 步 → $x = -2$\n\n$x = ${targetX}$ 表示从原点往${targetX >= 0 ? `右走 $${targetX}$` : `左走 $${Math.abs(targetX)}$`} 步`, en: `From the origin:\n• 3 steps right → $x = 3$\n• 2 steps left → $x = -2$\n\n$x = ${targetX}$ means ${targetX >= 0 ? `$${targetX}$ steps right` : `$${Math.abs(targetX)}$ steps left`} from origin` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：$y$ 坐标——往上为正，往下为负`, en: `${narrator}: "$y$ coordinate — up is positive, down is negative"` },
      hint: { zh: `接着刚才的位置：\n• 往上走 4 步 → $y = 4$\n• 往下走 1 步 → $y = -1$\n\n$y = ${targetY}$ 表示从那个位置往${targetY >= 0 ? `上走 $${targetY}$` : `下走 $${Math.abs(targetY)}$`} 步`, en: `From the current position:\n• 4 steps up → $y = 4$\n• 1 step down → $y = -1$\n\n$y = ${targetY}$ means ${targetY >= 0 ? `$${targetY}$ steps up` : `$${Math.abs(targetY)}$ steps down`}` },
      highlightField: 'y',
    },
    {
      text: { zh: `${narrator}：所以目标位置 = $(${targetX}, ${targetY})$`, en: `${narrator}: "So the target position = $(${targetX}, ${targetY})$"` },
      hint: { zh: `从原点出发：\n① 先横走：${targetX >= 0 ? `右 $${targetX}$` : `左 $${Math.abs(targetX)}$`}\n② 再竖走：${targetY >= 0 ? `上 $${targetY}$` : `下 $${Math.abs(targetY)}$`}\n\n到达点 $(${targetX}, ${targetY})$，在${quadrantZh}\n\n$x = ${targetX}$，$y = ${targetY}$`, en: `From origin:\n① Horizontal: ${targetX >= 0 ? `right $${targetX}$` : `left $${Math.abs(targetX)}$`}\n② Vertical: ${targetY >= 0 ? `up $${targetY}$` : `down $${Math.abs(targetY)}$`}\n\nReaches $(${targetX}, ${targetY})$, in ${quadrantEn}\n\n$x = ${targetX}$, $y = ${targetY}$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：记住坐标的规矩`, en: `${narrator}: "Remember the coordinate rules"` },
      hint: { zh: `① 永远先写 $x$（横），再写 $y$（竖）\n② 右和上 = 正数，左和下 = 负数\n③ 原点 $(0, 0)$ 是起点\n④ 四个象限：\n   I $(+,+)$ 右上  |  II $(-,+)$ 左上\n   III $(-,-)$ 左下  |  IV $(+,-)$ 右下`, en: `① Always write $x$ (horizontal) first, then $y$ (vertical)\n② Right/up = positive, left/down = negative\n③ Origin $(0, 0)$ is the starting point\n④ Four quadrants:\n   I $(+,+)$ top-right  |  II $(-,+)$ top-left\n   III $(-,-)$ bottom-left  |  IV $(+,-)$ bottom-right` },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { targetX, targetY, mode, generatorType: 'COORDINATES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   RATIO_Y7 generator: simplify ratios and divide in ratio
   ══════════════════════════════════════════════════════════ */

export function generateRatioY7Mission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '曹操';
  const mode: 'simplify' | 'divide' = template.data?.mode ?? 'simplify';

  if (mode === 'divide') {
    // Divide a total in a given ratio
    const ratioPools: Record<DifficultyTier, [number, number][]> = {
      1: [[1, 2], [1, 3], [2, 3], [1, 4]],
      2: [[2, 3], [3, 4], [2, 5], [3, 5], [1, 4]],
      3: [[3, 5], [2, 7], [3, 7], [4, 5], [5, 7]],
    };
    const [a, b] = pickRandom(ratioPools[tier]);
    const parts = a + b;
    const totalPools: Record<DifficultyTier, number[]> = {
      1: [parts * 5, parts * 10, parts * 4, parts * 6],
      2: [parts * 8, parts * 10, parts * 12, parts * 15],
      3: [parts * 10, parts * 15, parts * 20, parts * 25],
    };
    const total = pickRandom(totalPools[tier]);
    const answerA = total * a / parts;
    const answerB = total * b / parts;
    // Ask for the smaller share (x)
    const answer = answerA;

    const description: BilingualText = {
      zh: `把 $${total}$ 按 $${a}:${b}$ 分配，较小份是多少？`,
      en: `Divide $${total}$ in the ratio $${a}:${b}$. What is the smaller share?`,
    };

    const eachPart = total / parts;

    const tutorialSteps = [
      {
        text: { zh: `${narrator}：$${total}$ 金要按 $${a}:${b}$ 分——不是平均分，是按功劳分`, en: `${narrator}: "$${total}$ gold shared in ratio $${a}:${b}$ — not equal shares, but by merit"` },
        hint: { zh: `$${a}:${b}$ 是什么意思？\n想象切蛋糕：一共切 ${parts} 块\n甲拿 ${a} 块，乙拿 ${b} 块\n\n比例不是具体的数量，而是"几份对几份"`, en: `What does $${a}:${b}$ mean?\nImagine cutting a cake into ${parts} pieces\nA gets ${a} pieces, B gets ${b} pieces\n\nRatio is not amounts — it's "how many parts each"` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：第一步——算总份数`, en: `${narrator}: "Step 1 — find total parts"` },
        hint: { zh: `$${a}:${b}$ → 总份数 $= ${a} + ${b} = ${parts}$\n\n就像蛋糕一共切成 $${parts}$ 块`, en: `$${a}:${b}$ → total parts $= ${a} + ${b} = ${parts}$\n\nLike cutting the cake into $${parts}$ pieces` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：第二步——算每份值多少`, en: `${narrator}: "Step 2 — find the value of each part"` },
        hint: { zh: `总共 $${total}$ 金，分成 $${parts}$ 份\n每份 $= ${total} \\div ${parts} = ${eachPart}$ 金`, en: `Total $${total}$ gold, divided into $${parts}$ parts\nEach part $= ${total} \\div ${parts} = ${eachPart}$ gold` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：第三步——各方拿自己的份数 × 每份值`, en: `${narrator}: "Step 3 — each side takes their parts × value per part"` },
        hint: { zh: `甲（$${a}$ 份）：$${a} \\times ${eachPart} = ${answerA}$ 金\n乙（$${b}$ 份）：$${b} \\times ${eachPart} = ${answerB}$ 金`, en: `A ($${a}$ parts): $${a} \\times ${eachPart} = ${answerA}$ gold\nB ($${b}$ parts): $${b} \\times ${eachPart} = ${answerB}$ gold` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：验算——两份加起来等于总数吗？`, en: `${narrator}: "Verify — do both shares add to the total?"` },
        hint: { zh: `$${answerA} + ${answerB} = ${total}$ ✓\n\n而且比例对吗？$${answerA} : ${answerB}$\n$= ${answerA / eachPart} : ${answerB / eachPart}$\n$= ${a} : ${b}$ ✓`, en: `$${answerA} + ${answerB} = ${total}$ ✓\n\nRatio correct? $${answerA} : ${answerB}$\n$= ${answerA / eachPart} : ${answerB / eachPart}$\n$= ${a} : ${b}$ ✓` },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { a, b, total, answer, mode, generatorType: 'RATIO_Y7_RANDOM' },
      tutorialSteps,
    };
  } else {
    // Simplify a ratio
    const gcdPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6], 3: [3, 4, 5, 6, 8, 10] };
    const simplePairs: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5]];
    const [sa, sb] = pickRandom(simplePairs);
    const g = pickRandom(gcdPools[tier]);
    const a = sa * g;
    const b = sb * g;
    // Answer is the simplified first term
    const answer = sa;

    const description: BilingualText = {
      zh: `化简比 $${a}:${b}$，最简比的第一项是多少？`,
      en: `Simplify $${a}:${b}$. What is the first term of the simplest ratio?`,
    };

    const tutorialSteps = [
      {
        text: { zh: `${narrator}："步兵与骑兵 $${a}:${b}$"——比例是一种简洁的对比方式`, en: `${narrator}: "Infantry to cavalry $${a}:${b}$" — ratios are a concise way to compare"` },
        hint: { zh: `$${a}:${b}$ 的意思：\n每 $${a}$ 个步兵配 $${b}$ 个骑兵\n\n比例和分数是亲戚：\n$${a}:${b}$ 就像 $\\frac{${a}}{${b}}$\n化简比就像约分——找最大公因数！`, en: `$${a}:${b}$ means:\nFor every $${a}$ infantry, there are $${b}$ cavalry\n\nRatios and fractions are related:\n$${a}:${b}$ is like $\\frac{${a}}{${b}}$\nSimplifying a ratio = simplifying a fraction — find the HCF!` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：为什么要化简？$${a}:${b}$ 和 $${sa}:${sb}$ 不是一回事吗？`, en: `${narrator}: "Why simplify? Aren't $${a}:${b}$ and $${sa}:${sb}$ the same?"` },
        hint: { zh: `是一回事！但 $${sa}:${sb}$ 更简洁\n就像 $\\frac{4}{8}$ 和 $\\frac{1}{2}$ 一样大\n但 $\\frac{1}{2}$ 更清楚\n\n化简 = 用最小的数字表达同一个关系`, en: `Yes, they're the same! But $${sa}:${sb}$ is cleaner\nLike $\\frac{4}{8}$ and $\\frac{1}{2}$ are equal\nBut $\\frac{1}{2}$ is clearer\n\nSimplify = express the same relationship with smallest numbers` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：怎么化简？——找 $${a}$ 和 $${b}$ 的最大公因数`, en: `${narrator}: "How? — Find the HCF of $${a}$ and $${b}$"` },
        hint: { zh: `回忆 Unit 0 学的 HCF：\n$${a}$ 的因数：${Array.from({length: a}, (_, i) => i + 1).filter(i => a % i === 0).join(', ')}$\n$${b}$ 的因数：${Array.from({length: b}, (_, i) => i + 1).filter(i => b % i === 0).join(', ')}$\n\n最大公因数 = $${g}$`, en: `Recall HCF from Unit 0:\nFactors of $${a}$: ${Array.from({length: a}, (_, i) => i + 1).filter(i => a % i === 0).join(', ')}$\nFactors of $${b}$: ${Array.from({length: b}, (_, i) => i + 1).filter(i => b % i === 0).join(', ')}$\n\nHCF = $${g}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：两项同时除以 HCF`, en: `${narrator}: "Divide both terms by the HCF"` },
        hint: { zh: `$${a} \\div ${g} = ${sa}$\n$${b} \\div ${g} = ${sb}$\n\n$${a}:${b} = ${sa}:${sb}$`, en: `$${a} \\div ${g} = ${sa}$\n$${b} \\div ${g} = ${sb}$\n\n$${a}:${b} = ${sa}:${sb}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：验算——$${sa}:${sb}$ 还能再化简吗？`, en: `${narrator}: "Verify — can $${sa}:${sb}$ be simplified further?"` },
        hint: { zh: `$${sa}$ 和 $${sb}$ 的公因数只有 $1$（互质）\n→ 已经是最简比 ✓\n\n答案：$${a}:${b} = ${sa}:${sb}$\n第一项 = $${sa}$\n\n知识回环：HCF（Unit 0）→ 约分（Unit 0B）→ 化简比（这里！）`, en: `HCF of $${sa}$ and $${sb}$ is $1$ (coprime)\n→ Already simplest form ✓\n\nAnswer: $${a}:${b} = ${sa}:${sb}$\nFirst term = $${sa}$\n\nKnowledge loop: HCF (Unit 0) → Simplify fractions (Unit 0B) → Simplify ratios (here!)` },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { a, b, sa, sb, g, answer, mode, generatorType: 'RATIO_Y7_RANDOM' },
      tutorialSteps,
    };
  }
}

/* ══════════════════════════════════════════════════════════
   MIXED_IMPROPER generator: convert between mixed numbers
   and improper fractions
   ══════════════════════════════════════════════════════════ */

export function generateMixedImproperMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';
  const mode: 'to_improper' | 'to_mixed' = template.data?.mode ?? 'to_improper';

  const wholePools: Record<DifficultyTier, number[]> = { 1: [1, 2, 3], 2: [1, 2, 3, 4, 5], 3: [2, 3, 4, 5, 6, 7] };
  const denPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7, 8], 3: [3, 4, 5, 6, 7, 8, 9, 10] };

  const whole = pickRandom(wholePools[tier]);
  const den = pickRandom(denPools[tier]);
  const num = randInt(1, den - 1); // proper fraction part: 0 < num < den
  const improperNum = whole * den + num; // e.g., 2⅗ → (2×5+3)/5 = 13/5

  if (mode === 'to_improper') {
    // Given mixed number → find improper fraction numerator
    const answer = improperNum;

    const description: BilingualText = {
      zh: `把带分数 $${whole}\\frac{${num}}{${den}}$ 化成假分数，分子是多少？`,
      en: `Convert $${whole}\\frac{${num}}{${den}}$ to an improper fraction. What is the numerator?`,
    };

    const tutorialSteps = [
      {
        text: { zh: `${narrator}：什么是"带分数"和"假分数"？`, en: `${narrator}: "What are mixed numbers and improper fractions?"` },
        hint: { zh: `带分数 = 整数 + 真分数\n例如 $${whole}\\frac{${num}}{${den}}$ = ${whole} 又 $\\frac{${num}}{${den}}$\n\n假分数 = 分子 ≥ 分母\n例如 $\\frac{${improperNum}}{${den}}$（${improperNum} ≥ ${den}）\n\n它们是同一个数的两种写法！`, en: `Mixed number = whole + proper fraction\nE.g., $${whole}\\frac{${num}}{${den}}$ = ${whole} and $\\frac{${num}}{${den}}$\n\nImproper fraction = numerator ≥ denominator\nE.g., $\\frac{${improperNum}}{${den}}$ (${improperNum} ≥ ${den})\n\nThey're the same number, two forms!` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：为什么要互转？`, en: `${narrator}: "Why convert between them?"` },
        hint: { zh: `带分数好理解（"两块多一点"）\n假分数好计算（乘除法用假分数更方便）\n\n就像把整箱+散装的粮草全部拆成散装\n方便统一计算！`, en: `Mixed numbers are easy to understand ("two and a bit")\nImproper fractions are easy to calculate (better for × ÷)\n\nLike unpacking full crates + loose items into all loose items\nEasier to count uniformly!` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：转换方法——整数部分 × 分母 + 分子`, en: `${narrator}: "Conversion: whole × denominator + numerator"` },
        hint: { zh: `$${whole}\\frac{${num}}{${den}}$ 怎么转？\n\n想象 ${whole} 个完整的饼，每个切成 ${den} 份：\n${whole} 个饼 = $${whole} \\times ${den} = ${whole * den}$ 份\n\n再加上零散的 ${num} 份：\n$${whole * den} + ${num} = ${improperNum}$ 份\n\n分母不变：还是 ${den}\n\n所以 $${whole}\\frac{${num}}{${den}} = \\frac{${improperNum}}{${den}}$`, en: `How to convert $${whole}\\frac{${num}}{${den}}$?\n\nImagine ${whole} whole pies, each cut into ${den} slices:\n${whole} pies = $${whole} \\times ${den} = ${whole * den}$ slices\n\nPlus ${num} loose slices:\n$${whole * den} + ${num} = ${improperNum}$ slices\n\nDenominator stays: still ${den}\n\nSo $${whole}\\frac{${num}}{${den}} = \\frac{${improperNum}}{${den}}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：公式一步到位`, en: `${narrator}: "Formula in one step"` },
        hint: { zh: `$${whole}\\frac{${num}}{${den}} = \\frac{${whole} \\times ${den} + ${num}}{${den}} = \\frac{${improperNum}}{${den}}$\n\n分子 = $${improperNum}$`, en: `$${whole}\\frac{${num}}{${den}} = \\frac{${whole} \\times ${den} + ${num}}{${den}} = \\frac{${improperNum}}{${den}}$\n\nNumerator = $${improperNum}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：验算——反过来除一下`, en: `${narrator}: "Verify — divide back"` },
        hint: { zh: `$${improperNum} \\div ${den} = ${whole}$ 余 $${num}$\n→ $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$ ✓\n\n口诀：整数×分母+分子，分母不变`, en: `$${improperNum} \\div ${den} = ${whole}$ remainder $${num}$\n→ $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$ ✓\n\nRule: whole × denominator + numerator, denominator stays` },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { whole, num, den, improperNum, answer, mode, generatorType: 'MIXED_IMPROPER_RANDOM' },
      tutorialSteps,
    };
  } else {
    // Given improper fraction → find whole number part
    const answer = whole;

    const description: BilingualText = {
      zh: `把假分数 $\\frac{${improperNum}}{${den}}$ 化成带分数，整数部分是多少？`,
      en: `Convert $\\frac{${improperNum}}{${den}}$ to a mixed number. What is the whole number part?`,
    };

    const tutorialSteps = [
      {
        text: { zh: `${narrator}：假分数——分子比分母大，说明超过了 1 个整体`, en: `${narrator}: "Improper fraction — numerator bigger than denominator, meaning more than 1 whole"` },
        hint: { zh: `$\\frac{${improperNum}}{${den}}$：${improperNum} 份，每 ${den} 份是一个整体\n\n$${improperNum} > ${den}$，所以肯定超过 1 个整体\n具体超过多少？做除法就知道了`, en: `$\\frac{${improperNum}}{${den}}$: ${improperNum} slices, every ${den} makes one whole\n\n$${improperNum} > ${den}$, so definitely more than 1 whole\nHow many? Division tells us` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：方法——用分子 ÷ 分母`, en: `${narrator}: "Method — divide numerator by denominator"` },
        hint: { zh: `$${improperNum} \\div ${den} = ?$\n\n$${den} \\times ${whole} = ${whole * den}$（还剩 $${improperNum} - ${whole * den} = ${num}$）\n\n商 = $${whole}$（整数部分）\n余数 = $${num}$（分子）\n分母不变 = $${den}$`, en: `$${improperNum} \\div ${den} = ?$\n\n$${den} \\times ${whole} = ${whole * den}$ (remaining: $${improperNum} - ${whole * den} = ${num}$)\n\nQuotient = $${whole}$ (whole part)\nRemainder = $${num}$ (numerator)\nDenominator stays = $${den}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：所以 $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$`, en: `${narrator}: "So $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$"` },
        hint: { zh: `${improperNum} 份饼（每份 $\\frac{1}{${den}}$）\n= ${whole} 整个饼 + ${num} 份散装\n= $${whole}\\frac{${num}}{${den}}$\n\n整数部分 = $${whole}$`, en: `${improperNum} slices (each $\\frac{1}{${den}}$)\n= ${whole} whole pies + ${num} loose slices\n= $${whole}\\frac{${num}}{${den}}$\n\nWhole part = $${whole}$` },
        highlightField: 'ans',
      },
      {
        text: { zh: `${narrator}：验算——转回假分数`, en: `${narrator}: "Verify — convert back"` },
        hint: { zh: `$${whole} \\times ${den} + ${num} = ${whole * den} + ${num} = ${improperNum}$\n$\\frac{${improperNum}}{${den}}$ ✓\n\n口诀：分子÷分母，商=整数，余数=新分子`, en: `$${whole} \\times ${den} + ${num} = ${whole * den} + ${num} = ${improperNum}$\n$\\frac{${improperNum}}{${den}}$ ✓\n\nRule: numerator ÷ denominator, quotient = whole, remainder = new numerator` },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { whole, num, den, improperNum, answer, mode, generatorType: 'MIXED_IMPROPER_RANDOM' },
      tutorialSteps,
    };
  }
}

// ========== Y8 Generators ==========

export function generateExpandMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['诸葛亮', '庞统', '徐庶'];
  const narrator = pickRandom(narrators);

  // Tier pools: a(bx + c)
  const aPools: Record<number, number[]> = { 1: [2, 3], 2: [2, 3, 4, 5], 3: [3, 4, 5, 6, 7] };
  const bPools: Record<number, number[]> = { 1: [1, 2], 2: [2, 3, 4], 3: [3, 4, 5, 6] };
  const cPools: Record<number, number[]> = { 1: [1, 2, 3], 2: [2, 3, 4, 5], 3: [3, 4, 5, 6, 7, 8] };

  const a = pickRandom(aPools[tier]);
  const b = pickRandom(bPools[tier]);
  const c = pickRandom(cPools[tier]);
  const ab = a * b;
  const ac = a * c;
  const answer = ab;

  const description = {
    zh: `展开 $${a}(${b}x + ${c})$，$x$ 的系数是多少？`,
    en: `Expand $${a}(${b}x + ${c})$. What is the coefficient of $x$?`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么要学展开括号？`, en: `${narrator}: "Why learn to expand brackets?"` },
      hint: { zh: `想象你是军需官，要给 ${a} 支小队分发装备\n每队需要 ${b} 把刀和 ${c} 张弓\n\n"展开"就是把每队的需求乘以队数\n——算出总共需要多少`, en: `Imagine you're a quartermaster supplying ${a} squads\nEach squad needs ${b} swords and ${c} bows\n\n"Expanding" means multiplying each item by the number of squads\n— to find the total needed` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：展开的规则——分配律`, en: `${narrator}: "The rule — distributive law"` },
      hint: { zh: `外面的数要分别乘里面的每一项\n就像发东西，每人（每项）都要发到\n\n$${a}(${b}x + ${c})$\n= $${a} \\times ${b}x$ ＋ $${a} \\times ${c}$`, en: `The number outside multiplies EACH term inside\nLike handing out supplies — everyone gets some\n\n$${a}(${b}x + ${c})$\n= $${a} \\times ${b}x$ + $${a} \\times ${c}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——外面 × 第一项`, en: `${narrator}: "Step 1 — outside × first term"` },
      hint: { zh: `$${a} \\times ${b}x = ${ab}x$\n\n${a} 支队 × 每队 ${b} 把刀 = ${ab} 把刀`, en: `$${a} \\times ${b}x = ${ab}x$\n\n${a} squads × ${b} swords each = ${ab} swords` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——外面 × 第二项`, en: `${narrator}: "Step 2 — outside × second term"` },
      hint: { zh: `$${a} \\times ${c} = ${ac}$\n\n${a} 支队 × 每队 ${c} 张弓 = ${ac} 张弓`, en: `$${a} \\times ${c} = ${ac}$\n\n${a} squads × ${c} bows each = ${ac} bows` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：合并——写出展开结果`, en: `${narrator}: "Combine — write the expanded form"` },
      hint: { zh: `诸葛亮点头：总共需要 ${ab}x + ${ac} 件装备\n\n$${a}(${b}x + ${c}) = ${ab}x + ${ac}$\n\n$x$ 的系数是 $${ab}$`, en: `Zhuge Liang nods: ${ab}x + ${ac} pieces of equipment in total\n\n$${a}(${b}x + ${c}) = ${ab}x + ${ac}$\n\nThe coefficient of $x$ is $${ab}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——代入 $x=1$ 检查`, en: `${narrator}: "Verify — substitute $x=1$"` },
      hint: { zh: `诸葛亮再验一遍——军需不能出错！\n\n左边：$${a}(${b} \\times 1 + ${c}) = ${a} \\times ${b + c} = ${a * (b + c)}$\n右边：$${ab} \\times 1 + ${ac} = ${ab + ac}$\n\n$${a * (b + c)} = ${ab + ac}$ ✓ 两边相等！`, en: `Zhuge Liang double-checks — supplies must be exact!\n\nLeft: $${a}(${b} \\times 1 + ${c}) = ${a} \\times ${b + c} = ${a * (b + c)}$\nRight: $${ab} \\times 1 + ${ac} = ${ab + ac}$\n\n$${a * (b + c)} = ${ab + ac}$ ✓ Both sides equal!` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, c, ab, ac, answer, generatorType: 'EXPAND_RANDOM' },
    tutorialSteps,
  };
}

export function generateFactoriseMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['诸葛亮', '庞统', '徐庶'];
  const narrator = pickRandom(narrators);

  const factorPools: Record<number, number[]> = { 1: [2, 3], 2: [2, 3, 4, 5], 3: [3, 4, 5, 6, 7] };
  const pPools: Record<number, number[]> = { 1: [1, 2], 2: [1, 2, 3], 3: [2, 3, 4, 5] };
  const qPools: Record<number, number[]> = { 1: [1, 3], 2: [1, 3, 5, 7], 3: [1, 3, 5, 7, 9] };

  const factor = pickRandom(factorPools[tier]);
  const p = pickRandom(pPools[tier]);
  const q = pickRandom(qPools[tier]);
  const a = factor * p;
  const b = factor * q;
  const answer = factor;

  const description = {
    zh: `因式分解 $${a}x + ${b}$，最大公因数是？`,
    en: `Factorise $${a}x + ${b}$. What is the HCF?`,
  };

  const getFactorsStrLocal = (n: number): string => {
    const factors: number[] = [];
    for (let i = 1; i <= n; i++) { if (n % i === 0) factors.push(i); }
    return factors.join(', ');
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：因式分解是展开的反操作`, en: `${narrator}: "Factorising is the reverse of expanding"` },
      hint: { zh: `展开：$${factor}(${p}x + ${q}) = ${a}x + ${b}$\n因式分解：$${a}x + ${b} = ?(... + ...)$\n\n就像把散装物资重新打包——找出每项的公因子`, en: `Expanding: $${factor}(${p}x + ${q}) = ${a}x + ${b}$\nFactorising: $${a}x + ${b} = ?(...+...)$\n\nLike re-packing supplies — find what's common to each term` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——找 ${a} 和 ${b} 的最大公因数(HCF)`, en: `${narrator}: "Step 1 — find the HCF of ${a} and ${b}"` },
      hint: { zh: `$${a}$ 的因数：${getFactorsStrLocal(a)}\n$${b}$ 的因数：${getFactorsStrLocal(b)}\n\n最大公因数 = $${factor}$`, en: `Factors of $${a}$: ${getFactorsStrLocal(a)}\nFactors of $${b}$: ${getFactorsStrLocal(b)}\n\nHCF = $${factor}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——每项除以 HCF`, en: `${narrator}: "Step 2 — divide each term by HCF"` },
      hint: { zh: `就像清点物资——每种除以公因子\n\n$${a}x \\div ${factor} = ${p}x$\n$${b} \\div ${factor} = ${q}$`, en: `Like sorting supplies — divide each by the common factor\n\n$${a}x \\div ${factor} = ${p}x$\n$${b} \\div ${factor} = ${q}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第三步——组合成因式形式`, en: `${narrator}: "Step 3 — write in factored form"` },
      hint: { zh: `归纳完毕——军令变简洁了\n\n$${a}x + ${b} = ${factor}(${p}x + ${q})$\n\nHCF 放外面，商放括号里`, en: `Summary complete — the military order is now concise\n\n$${a}x + ${b} = ${factor}(${p}x + ${q})$\n\nHCF goes outside, quotients go inside brackets` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案——最大公因数 = ${factor}`, en: `${narrator}: "Answer — HCF = ${factor}"` },
      hint: { zh: `诸葛亮：公因子就是每项的"共同点"\n\n$${a}x + ${b} = ${factor}(${p}x + ${q})$\n\n最大公因数（提出来的公因子）= $${factor}$`, en: `Zhuge Liang: the common factor is what every term shares\n\n$${a}x + ${b} = ${factor}(${p}x + ${q})$\n\nThe common factor (factored out) = $${factor}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——展开回去检查`, en: `${narrator}: "Verify — expand back to check"` },
      hint: { zh: `展开回去——军需清点必须复核！\n\n$${factor}(${p}x + ${q})$\n= $${factor} \\times ${p}x + ${factor} \\times ${q}$\n= $${a}x + ${b}$ ✓`, en: `Expand it back — supply counts must be double-checked!\n\n$${factor}(${p}x + ${q})$\n= $${factor} \\times ${p}x + ${factor} \\times ${q}$\n= $${a}x + ${b}$ ✓` },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { factor, p, q, a, b, answer, generatorType: 'FACTORISE_RANDOM' },
    tutorialSteps,
  };
}

export function generateInequalityMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['诸葛亮', '庞统', '荀彧'];
  const narrator = pickRandom(narrators);

  const aPools: Record<number, number[]> = { 1: [2, 3], 2: [2, 3, 4], 3: [3, 4, 5, 6] };
  const bPools: Record<number, number[]> = { 1: [1, 2, 3], 2: [2, 3, 4, 5], 3: [3, 5, 7, 9] };

  const a = pickRandom(aPools[tier]);
  const b = pickRandom(bPools[tier]);
  const answerVal = pickRandom([1, 2, 3, 4, 5, 6].slice(0, tier + 2));
  const c = a * answerVal + b;
  const ops = ['<', '>'];
  const op = pickRandom(ops);
  const answer = answerVal;

  const description = {
    zh: `解不等式 $${a}x + ${b} ${op} ${c}$，$x ${op}$ ?`,
    en: `Solve $${a}x + ${b} ${op} ${c}$. $x ${op}$ ?`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：不等式和方程有什么不同？`, en: `${narrator}: "How is an inequality different from an equation?"` },
      hint: { zh: `方程：$3x + 1 = 7$（等号，只有一个答案）\n不等式：$3x + 1 < 7$（不等号，有一个范围）\n\n不等号就像城门限高——不是刚好那个数\n而是"不能超过"或"必须超过"`, en: `Equation: $3x + 1 = 7$ (equals sign, one answer)\nInequality: $3x + 1 < 7$ (inequality sign, a range)\n\nLike a height limit at a gate — not exactly that number\nbut "must not exceed" or "must exceed"` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：解法和方程一样——两边做相同运算`, en: `${narrator}: "Solve it like an equation — same operation both sides"` },
      hint: { zh: `$${a}x + ${b} ${op} ${c}$\n\n规则：不等号两边加/减/乘/除同一个正数，方向不变\n（注意：乘除负数时方向要反！但这次不需要）`, en: `$${a}x + ${b} ${op} ${c}$\n\nRule: add/subtract/multiply/divide both sides by the same positive number — direction stays\n(Note: multiplying by negative flips direction, but not needed here)` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第一步——两边减 ${b}`, en: `${narrator}: "Step 1 — subtract ${b} from both sides"` },
      hint: { zh: `先把城门的固定障碍搬走——\n\n$${a}x + ${b} - ${b} ${op} ${c} - ${b}$\n$${a}x ${op} ${c - b}$`, en: `First, clear the fixed obstacles from the gate——\n\n$${a}x + ${b} - ${b} ${op} ${c} - ${b}$\n$${a}x ${op} ${c - b}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：第二步——两边除以 ${a}`, en: `${narrator}: "Step 2 — divide both sides by ${a}"` },
      hint: { zh: `缩小范围——看到底能让多少人通过\n\n$\\frac{${a}x}{${a}} ${op} \\frac{${c - b}}{${a}}$\n$x ${op} ${answerVal}$\n\n（${a} 是正数，不等号方向不变）`, en: `Narrow it down — how many can pass through?\n\n$\\frac{${a}x}{${a}} ${op} \\frac{${c - b}}{${a}}$\n$x ${op} ${answerVal}$\n\n(${a} is positive, so direction stays the same)` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案——临界值 = ${answerVal}`, en: `${narrator}: "Answer — critical value = ${answerVal}"` },
      hint: { zh: `诸葛亮：城门最多容许 ${answerVal} 人同时通过\n\n$x ${op} ${answerVal}$\n\n临界值就是不等号旁边的那个数`, en: `Zhuge Liang: the gate allows at most ${answerVal} through at once\n\n$x ${op} ${answerVal}$\n\nThe critical value is the number next to the inequality sign` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——代入检查`, en: `${narrator}: "Verify — substitute to check"` },
      hint: {
        zh: op === '<'
          ? `验证——分别试一个通过的和一个不通过的\n\n试 $x = ${answerVal - 1}$：$${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$\n$${a * (answerVal - 1) + b} < ${c}$ ✓ 成立！\n\n试 $x = ${answerVal + 1}$：$${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$\n$${a * (answerVal + 1) + b} < ${c}$ ✗ 不成立！`
          : `验证——分别试一个通过的和一个不通过的\n\n试 $x = ${answerVal + 1}$：$${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$\n$${a * (answerVal + 1) + b} > ${c}$ ✓ 成立！\n\n试 $x = ${answerVal - 1}$：$${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$\n$${a * (answerVal - 1) + b} > ${c}$ ✗ 不成立！`,
        en: op === '<'
          ? `Verify — test one that passes and one that doesn't\n\nTry $x = ${answerVal - 1}$: $${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$\n$${a * (answerVal - 1) + b} < ${c}$ ✓ True!\n\nTry $x = ${answerVal + 1}$: $${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$\n$${a * (answerVal + 1) + b} < ${c}$ ✗ False!`
          : `Verify — test one that passes and one that doesn't\n\nTry $x = ${answerVal + 1}$: $${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$\n$${a * (answerVal + 1) + b} > ${c}$ ✓ True!\n\nTry $x = ${answerVal - 1}$: $${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$\n$${a * (answerVal - 1) + b} > ${c}$ ✗ False!`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, c, op, answer, generatorType: 'INEQUALITY_RANDOM' },
    tutorialSteps,
  };
}

export function generateStdFormMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['诸葛亮', '曹操', '荀彧'];
  const narrator = pickRandom(narrators);

  const aPools: Record<number, number[]> = { 1: [2, 3, 5], 2: [1.5, 2.4, 3.6, 4.5], 3: [1.23, 2.56, 3.78, 4.91, 6.02] };
  const nPools: Record<number, number[]> = { 1: [2, 3], 2: [3, 4, 5], 3: [4, 5, 6, 7] };

  const a = pickRandom(aPools[tier]);
  const n = pickRandom(nPools[tier]);
  const number = a * Math.pow(10, n);
  const numberStr = number.toLocaleString('en-US');

  const description = {
    zh: `把 $${numberStr}$ 写成标准式 $a \\times 10^n$`,
    en: `Write $${numberStr}$ in standard form $a \\times 10^n$`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：为什么需要标准式？`, en: `${narrator}: "Why do we need standard form?"` },
      hint: { zh: `大数字太长，写起来容易出错\n比如曹操的百万大军：$1,000,000$\n用标准式写：$1 \\times 10^6$\n\n简洁、准确、一眼就能比大小！`, en: `Big numbers are too long and error-prone\nLike Cao Cao's million-strong army: $1,000,000$\nIn standard form: $1 \\times 10^6$\n\nNeat, precise, and easy to compare!` },
      highlightField: 'a',
    },
    {
      text: { zh: `${narrator}：标准式的规则`, en: `${narrator}: "The rules of standard form"` },
      hint: { zh: `$a \\times 10^n$ 其中：\n• $a$ 必须在 $1$ 和 $10$ 之间（$1 \\leq a < 10$）\n• $n$ 是整数（小数点移动的次数）\n\n所以 $25$ 不是标准式（$a=25>10$）\n$2.5 \\times 10^1$ 才是 ✓`, en: `$a \\times 10^n$ where:\n• $a$ must be between $1$ and $10$ ($1 \\leq a < 10$)\n• $n$ is an integer (number of places the decimal moves)\n\nSo $25$ is NOT standard form ($a=25>10$)\n$2.5 \\times 10^1$ is ✓` },
      highlightField: 'a',
    },
    {
      text: { zh: `${narrator}：第一步——找 $a$（把小数点移到第一个数字后面）`, en: `${narrator}: "Step 1 — find $a$ (move decimal after first digit)"` },
      hint: { zh: `就像报军情——先说最重要的数字\n\n$${numberStr}$\n把小数点移到第一个非零数字后面\n→ $a = ${a}$`, en: `Like reporting military intel — lead with the key figure\n\n$${numberStr}$\nMove the decimal point after the first non-zero digit\n→ $a = ${a}$` },
      highlightField: 'a',
    },
    {
      text: { zh: `${narrator}：第二步——数小数点移了几位 → 就是 $n$`, en: `${narrator}: "Step 2 — count how many places the decimal moved → that's $n$"` },
      hint: { zh: `数位数——传令兵跑了几步\n\n从 $${numberStr}$ 到 $${a}$\n小数点向左移了 $${n}$ 位\n所以 $n = ${n}$`, en: `Count the places — how many steps did the messenger run?\n\nFrom $${numberStr}$ to $${a}$\nDecimal moved $${n}$ places to the left\nSo $n = ${n}$` },
      highlightField: 'n',
    },
    {
      text: { zh: `${narrator}：答案`, en: `${narrator}: "Answer"` },
      hint: { zh: `军报格式：${a} × 万级单位\n\n$${numberStr} = ${a} \\times 10^{${n}}$\n\n$a = ${a}$，$n = ${n}$`, en: `Military report format: ${a} × power-of-ten unit\n\n$${numberStr} = ${a} \\times 10^{${n}}$\n\n$a = ${a}$, $n = ${n}$` },
      highlightField: 'a',
    },
    {
      text: { zh: `${narrator}：验算——还原回去`, en: `${narrator}: "Verify — convert back"` },
      hint: { zh: `还原验证——传令兵回报原数\n\n$${a} \\times 10^{${n}} = ${a} \\times ${Math.pow(10, n).toLocaleString('en-US')} = ${numberStr}$ ✓`, en: `Convert back to verify — the messenger reports the original number\n\n$${a} \\times 10^{${n}} = ${a} \\times ${Math.pow(10, n).toLocaleString('en-US')} = ${numberStr}$ ✓` },
      highlightField: 'a',
    },
  ];

  return {
    ...template,
    description,
    data: { number, a, n, generatorType: 'STD_FORM_RANDOM' },
    tutorialSteps,
  };
}

export function generateSpeedMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['诸葛亮', '赵云', '曹操'];
  const narrator = pickRandom(narrators);

  const modes = ['speed', 'distance', 'time'] as const;
  const mode = pickRandom([...modes]);

  const speedPools: Record<number, number[]> = { 1: [5, 10, 20], 2: [8, 12, 15, 25], 3: [6, 14, 18, 22, 35] };
  const timePools: Record<number, number[]> = { 1: [2, 3, 4], 2: [3, 4, 5, 6], 3: [3, 5, 7, 8] };

  const speed = pickRandom(speedPools[tier]);
  const time = pickRandom(timePools[tier]);
  const distance = speed * time;

  let answer: number;
  let descZh: string;
  let descEn: string;

  if (mode === 'speed') {
    answer = speed;
    descZh = `行军 $${distance}$ 里用了 $${time}$ 小时，速度是多少？`;
    descEn = `Marched $${distance}$ li in $${time}$ hours. What is the speed?`;
  } else if (mode === 'distance') {
    answer = distance;
    descZh = `以 $${speed}$ 里/时的速度行军 $${time}$ 小时，走了多远？`;
    descEn = `Marching at $${speed}$ li/hr for $${time}$ hours. How far?`;
  } else {
    answer = time;
    descZh = `$${distance}$ 里路程，速度 $${speed}$ 里/时，需要多久？`;
    descEn = `$${distance}$ li distance at $${speed}$ li/hr. How long?`;
  }

  const description = { zh: descZh, en: descEn };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：速度、距离、时间的关系`, en: `${narrator}: "The relationship between speed, distance, and time"` },
      hint: { zh: `行军打仗，三个量密切相关：\n• 速度 = 距离 ÷ 时间\n• 距离 = 速度 × 时间\n• 时间 = 距离 ÷ 速度\n\n记住三角形：$D = S \\times T$`, en: `In marching, three quantities are linked:\n• Speed = Distance ÷ Time\n• Distance = Speed × Time\n• Time = Distance ÷ Speed\n\nRemember the triangle: $D = S \\times T$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：用生活例子理解`, en: `${narrator}: "Understand with a real example"` },
      hint: { zh: `如果你走路速度是每小时 5 里\n走了 2 小时\n那你走了 $5 \\times 2 = 10$ 里\n\n知道任意两个，就能算第三个！`, en: `If you walk at 5 li per hour\nfor 2 hours\nyou've walked $5 \\times 2 = 10$ li\n\nKnow any two, find the third!` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：找出已知量`, en: `${narrator}: "Identify what we know"` },
      hint: mode === 'speed'
        ? { zh: `赵云追击——先整理已知军情\n\n已知：距离 = $${distance}$ 里，时间 = $${time}$ 小时\n求：速度 = ?`, en: `Zhao Yun gives chase — first sort out the known intel\n\nKnown: distance = $${distance}$ li, time = $${time}$ hours\nFind: speed = ?` }
        : mode === 'distance'
        ? { zh: `行军侦察——先整理已知军情\n\n已知：速度 = $${speed}$ 里/时，时间 = $${time}$ 小时\n求：距离 = ?`, en: `March reconnaissance — first sort out the known intel\n\nKnown: speed = $${speed}$ li/hr, time = $${time}$ hours\nFind: distance = ?` }
        : { zh: `诸葛亮算时间——先整理已知军情\n\n已知：距离 = $${distance}$ 里，速度 = $${speed}$ 里/时\n求：时间 = ?`, en: `Zhuge Liang calculates time — first sort out the known intel\n\nKnown: distance = $${distance}$ li, speed = $${speed}$ li/hr\nFind: time = ?` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：选公式并代入`, en: `${narrator}: "Choose the formula and substitute"` },
      hint: mode === 'speed'
        ? { zh: `代入——赵云计算追击速度\n\n速度 = 距离 ÷ 时间\n$= ${distance} \\div ${time}$\n$= ${speed}$`, en: `Substitute — Zhao Yun calculates pursuit speed\n\nSpeed = Distance ÷ Time\n$= ${distance} \\div ${time}$\n$= ${speed}$` }
        : mode === 'distance'
        ? { zh: `代入——诸葛亮计算行军距离\n\n距离 = 速度 × 时间\n$= ${speed} \\times ${time}$\n$= ${distance}$`, en: `Substitute — Zhuge Liang calculates march distance\n\nDistance = Speed × Time\n$= ${speed} \\times ${time}$\n$= ${distance}$` }
        : { zh: `代入——诸葛亮计算行军时间\n\n时间 = 距离 ÷ 速度\n$= ${distance} \\div ${speed}$\n$= ${time}$`, en: `Substitute — Zhuge Liang calculates march time\n\nTime = Distance ÷ Speed\n$= ${distance} \\div ${speed}$\n$= ${time}$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：答案 = ${answer}`, en: `${narrator}: "Answer = ${answer}"` },
      hint: { zh: `军令已出——行军计划确定：答案是 $${answer}$`, en: `Orders issued — march plan confirmed: the answer is $${answer}$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：验算——用三个量互相检查`, en: `${narrator}: "Verify — cross-check with all three"` },
      hint: { zh: `交叉检验——三军核实！\n\n速度 × 时间 = 距离\n$${speed} \\times ${time} = ${distance}$ ✓`, en: `Cross-check — all three armies verify!\n\nSpeed × Time = Distance\n$${speed} \\times ${time} = ${distance}$ ✓` },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { speed, distance, time, mode, answer, x: answer, generatorType: 'SPEED_RANDOM' },
    tutorialSteps,
  };
}

export function generateCircleY8Mission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['鲁肃', '曹操', '刘备'];
  const narrator = pickRandom(narrators);

  const rPools: Record<number, number[]> = { 1: [3, 5, 7], 2: [4, 6, 8, 10], 3: [5, 9, 12, 14] };
  const r = pickRandom(rPools[tier]);
  const pi = 3.14;
  const modes = ['circumference', 'area'] as const;
  const mode = pickRandom([...modes]);

  const circumference = parseFloat((2 * pi * r).toFixed(2));
  const area = parseFloat((pi * r * r).toFixed(2));

  let answer: number;
  let descZh: string;
  let descEn: string;

  if (mode === 'circumference') {
    answer = circumference;
    descZh = `半径 $${r}$ 的圆营地周长是多少？($\\pi = ${pi}$)`;
    descEn = `A circular camp with radius $${r}$. Find the circumference. ($\\pi = ${pi}$)`;
  } else {
    answer = area;
    descZh = `半径 $${r}$ 的圆营地面积是多少？($\\pi = ${pi}$)`;
    descEn = `A circular camp with radius $${r}$. Find the area. ($\\pi = ${pi}$)`;
  }

  const tutorialSteps = mode === 'circumference' ? [
    {
      text: { zh: `${narrator}：什么是圆的周长？`, en: `${narrator}: "What is the circumference of a circle?"` },
      hint: { zh: `圆的周长就是圆的一圈有多长\n——如果用绳子绕营地围一圈，需要多长的绳子？\n\n古人发现：周长和直径的比值总是约 $3.14$\n这个比值就叫做 $\\pi$（读 pai）`, en: `Circumference = the distance around a circle\n— How much rope to go around the camp once?\n\nAncients discovered: circumference ÷ diameter ≈ $3.14$\nThis ratio is called $\\pi$ (pi)` },
      highlightField: mode === 'circumference' ? 'c' : 'area',
    },
    {
      text: { zh: `${narrator}：周长公式`, en: `${narrator}: "Circumference formula"` },
      hint: { zh: `$C = 2\\pi r$\n\n$C$ = 周长\n$\\pi \\approx 3.14$\n$r$ = 半径 = $${r}$\n\n直径 $d = 2r$，所以也可以写成 $C = \\pi d$`, en: `$C = 2\\pi r$\n\n$C$ = circumference\n$\\pi \\approx 3.14$\n$r$ = radius = $${r}$\n\nDiameter $d = 2r$, so also $C = \\pi d$` },
      highlightField: 'c',
    },
    {
      text: { zh: `${narrator}：代入数值`, en: `${narrator}: "Substitute the values"` },
      hint: { zh: `围营地需要多少绳子？代入数值\n\n$C = 2 \\times ${pi} \\times ${r}$`, en: `How much rope to fence the camp? Substitute the values\n\n$C = 2 \\times ${pi} \\times ${r}$` },
      highlightField: 'c',
    },
    {
      text: { zh: `${narrator}：计算`, en: `${narrator}: "Calculate"` },
      hint: { zh: `绳子量出来了——围营地一圈的长度\n\n$2 \\times ${r} = ${2 * r}$\n$${2 * r} \\times ${pi} = ${circumference}$\n\n$C = ${circumference}$`, en: `The rope is measured — one full loop around the camp\n\n$2 \\times ${r} = ${2 * r}$\n$${2 * r} \\times ${pi} = ${circumference}$\n\n$C = ${circumference}$` },
      highlightField: 'c',
    },
    {
      text: { zh: `${narrator}：答案 = ${circumference}`, en: `${narrator}: "Answer = ${circumference}"` },
      hint: { zh: `围营地需要这么多绳子——围住半径 $${r}$ 的圆营地需要 $${circumference}$ 的绳子`, en: `This much rope for the camp fence — a camp with radius $${r}$ needs $${circumference}$ units of rope` },
      highlightField: 'c',
    },
    {
      text: { zh: `${narrator}：验算——用直径法`, en: `${narrator}: "Verify — using diameter method"` },
      hint: { zh: `换个方法量一遍——绳子不能多也不能少！\n\n直径 $d = 2 \\times ${r} = ${2 * r}$\n$C = \\pi \\times d = ${pi} \\times ${2 * r} = ${circumference}$ ✓`, en: `Measure again a different way — not a metre more, not a metre less!\n\nDiameter $d = 2 \\times ${r} = ${2 * r}$\n$C = \\pi \\times d = ${pi} \\times ${2 * r} = ${circumference}$ ✓` },
      highlightField: 'c',
    },
  ] : [
    {
      text: { zh: `${narrator}：什么是圆的面积？`, en: `${narrator}: "What is the area of a circle?"` },
      hint: { zh: `面积就是圆内部的空间大小\n——这块圆形营地能容纳多少人扎帐篷？\n\n回忆长方形面积 = 长 × 宽\n圆形？也有公式，但和 $\\pi$ 有关`, en: `Area = the space inside the circle\n— How many tents fit in this circular camp?\n\nRecall rectangle area = length × width\nCircle? Also has a formula, involving $\\pi$` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：面积公式`, en: `${narrator}: "Area formula"` },
      hint: { zh: `$A = \\pi r^2$\n\n$A$ = 面积\n$\\pi \\approx 3.14$\n$r$ = 半径 = $${r}$\n$r^2$ = $r \\times r$（半径的平方）`, en: `$A = \\pi r^2$\n\n$A$ = area\n$\\pi \\approx 3.14$\n$r$ = radius = $${r}$\n$r^2$ = $r \\times r$ (radius squared)` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：第一步——算 $r^2$`, en: `${narrator}: "Step 1 — calculate $r^2$"` },
      hint: { zh: `营地地基先量方——半径自乘\n\n$r^2 = ${r} \\times ${r} = ${r * r}$`, en: `Measure the camp ground — square the radius first\n\n$r^2 = ${r} \\times ${r} = ${r * r}$` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：第二步——乘以 $\\pi$`, en: `${narrator}: "Step 2 — multiply by $\\pi$"` },
      hint: { zh: `乘上 $\\pi$——算出营地能扎多少帐篷的空间\n\n$A = ${pi} \\times ${r * r} = ${area}$`, en: `Multiply by $\\pi$ — find how much tent space the camp has\n\n$A = ${pi} \\times ${r * r} = ${area}$` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：答案 = ${area}`, en: `${narrator}: "Answer = ${area}"` },
      hint: { zh: `营地能扎这么多帐篷——圆营地面积 $= ${area}$ 平方单位`, en: `This much space for tents — circular camp area $= ${area}$ square units` },
      highlightField: 'area',
    },
    {
      text: { zh: `${narrator}：验算——估算检查`, en: `${narrator}: "Verify — estimation check"` },
      hint: { zh: `估算复核——扎营面积不能算错！\n\n圆面积 ≈ $3 \\times r^2 = 3 \\times ${r * r} = ${3 * r * r}$\n实际答案 $${area}$ 略大于 $${3 * r * r}$（因为 $\\pi > 3$）✓ 合理！`, en: `Estimation check — can't get the camp size wrong!\n\nCircle area ≈ $3 \\times r^2 = 3 \\times ${r * r} = ${3 * r * r}$\nActual $${area}$ is slightly more than $${3 * r * r}$ (since $\\pi > 3$) ✓ Makes sense!` },
      highlightField: 'area',
    },
  ];

  return {
    ...template,
    description: { zh: descZh, en: descEn },
    data: mode === 'circumference'
      ? { r, pi, mode: 'circumference', answer, generatorType: 'CIRCLE_Y8_RANDOM' }
      : { r, pi, mode: 'area', answer, generatorType: 'CIRCLE_Y8_RANDOM' },
    tutorialSteps,
  };
}

export function generateVolumeY8Mission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['曹操', '荀彧', '袁绍'];
  const narrator = pickRandom(narrators);

  const rPools: Record<number, number[]> = { 1: [3, 5], 2: [4, 5, 6], 3: [5, 7, 8] };
  const hPools: Record<number, number[]> = { 1: [5, 10], 2: [6, 8, 10, 12], 3: [8, 10, 12, 15] };

  const radius = pickRandom(rPools[tier]);
  const height = pickRandom(hPools[tier]);
  const pi = 3.14;
  const baseArea = parseFloat((pi * radius * radius).toFixed(2));
  const volume = parseFloat((pi * radius * radius * height).toFixed(2));
  const answer = volume;

  const description = {
    zh: `圆柱形粮仓：半径 $${radius}$，高 $${height}$，体积 = ? ($\\pi = ${pi}$)`,
    en: `Cylindrical granary: radius $${radius}$, height $${height}$, volume = ? ($\\pi = ${pi}$)`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：粮仓是什么形状？`, en: `${narrator}: "What shape is the granary?"` },
      hint: { zh: `粮仓是圆柱体——上下两个圆，中间直筒\n\n体积就是这个筒能装多少粮食\n\n回忆长方体体积 = 底面积 × 高\n圆柱体？一样！只是底面变成了圆`, en: `The granary is a cylinder — two circles top and bottom, straight sides\n\nVolume = how much grain it can hold\n\nRecall cuboid volume = base area × height\nCylinder? Same! Just the base is a circle` },
      highlightField: 'v',
    },
    {
      text: { zh: `${narrator}：圆柱体积公式`, en: `${narrator}: "Cylinder volume formula"` },
      hint: { zh: `$V = \\pi r^2 h$\n\n就是：圆形底面积($\\pi r^2$) × 高($h$)\n\n$r = ${radius}$，$h = ${height}$，$\\pi = ${pi}$`, en: `$V = \\pi r^2 h$\n\nThat is: circular base area ($\\pi r^2$) × height ($h$)\n\n$r = ${radius}$, $h = ${height}$, $\\pi = ${pi}$` },
      highlightField: 'v',
    },
    {
      text: { zh: `${narrator}：第一步——算底面积 $\\pi r^2$`, en: `${narrator}: "Step 1 — base area $\\pi r^2$"` },
      hint: { zh: `底面积就是仓底能铺多少粮\n\n$r^2 = ${radius} \\times ${radius} = ${radius * radius}$\n$\\pi r^2 = ${pi} \\times ${radius * radius} = ${baseArea}$`, en: `The base area is how much grain fits on the floor\n\n$r^2 = ${radius} \\times ${radius} = ${radius * radius}$\n$\\pi r^2 = ${pi} \\times ${radius * radius} = ${baseArea}$` },
      highlightField: 'v',
    },
    {
      text: { zh: `${narrator}：第二步——底面积 × 高`, en: `${narrator}: "Step 2 — base area × height"` },
      hint: { zh: `堆满后的总量——底面积乘以高\n\n$V = ${baseArea} \\times ${height} = ${volume}$`, en: `Total grain when filled — base area times height\n\n$V = ${baseArea} \\times ${height} = ${volume}$` },
      highlightField: 'v',
    },
    {
      text: { zh: `${narrator}：答案 = ${volume}`, en: `${narrator}: "Answer = ${volume}"` },
      hint: { zh: `这座粮仓能装这么多粮食——粮仓体积 $V = ${volume}$ 立方单位`, en: `This granary holds this much grain — volume $V = ${volume}$ cubic units` },
      highlightField: 'v',
    },
    {
      text: { zh: `${narrator}：验算——估算检查`, en: `${narrator}: "Verify — estimation check"` },
      hint: { zh: `粮草是大事——估算复核一遍\n\n估算：$V \\approx 3 \\times ${radius}^2 \\times ${height} = 3 \\times ${radius * radius} \\times ${height} = ${3 * radius * radius * height}$\n实际 $${volume}$ 略大（$\\pi > 3$）✓ 合理！`, en: `Grain supplies are critical — double-check with estimation\n\nEstimate: $V \\approx 3 \\times ${radius}^2 \\times ${height} = 3 \\times ${radius * radius} \\times ${height} = ${3 * radius * radius * height}$\nActual $${volume}$ is slightly more ($\\pi > 3$) ✓ Makes sense!` },
      highlightField: 'v',
    },
  ];

  return {
    ...template,
    description,
    data: { radius, height, pi, answer, generatorType: 'VOLUME_Y8_RANDOM' },
    tutorialSteps,
  };
}

export function generatePercentageInterestMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['曹操', '荀彧', '诸葛亮'];
  const narrator = pickRandom(narrators);

  const modes = ['simple', 'compound'] as const;
  const mode = pickRandom([...modes]);

  const principalPools: Record<number, number[]> = { 1: [100, 200, 500], 2: [200, 500, 800, 1000], 3: [500, 1000, 2000, 5000] };
  const ratePools: Record<number, number[]> = { 1: [5, 10], 2: [5, 8, 10], 3: [3, 5, 8, 10, 12] };
  const yearPools: Record<number, number[]> = { 1: [2], 2: [2, 3], 3: [2, 3, 4] };

  const principal = pickRandom(principalPools[tier]);
  const rate = pickRandom(ratePools[tier]);
  const years = pickRandom(yearPools[tier]);
  const rateDecimal = rate / 100;

  const interest = principal * rateDecimal;
  const totalSimple = principal + interest * years;
  let answer: number;
  if (mode === 'simple') {
    answer = totalSimple;
  } else {
    answer = parseFloat((principal * Math.pow(1 + rateDecimal, years)).toFixed(2));
  }

  const description = {
    zh: mode === 'simple'
      ? `本金 $${principal}$ 两，年利率 $${rate}\\%$，${years} 年单利，最终金额？`
      : `本金 $${principal}$ 两，年利率 $${rate}\\%$，${years} 年复利，最终金额？`,
    en: mode === 'simple'
      ? `Principal $${principal}$ liang, rate $${rate}\\%$, ${years} years simple interest. Final amount?`
      : `Principal $${principal}$ liang, rate $${rate}\\%$, ${years} years compound interest. Final amount?`,
  };

  const tutorialSteps = mode === 'simple' ? [
    {
      text: { zh: `${narrator}：什么是单利？`, en: `${narrator}: "What is simple interest?"` },
      hint: { zh: `借钱要付利息——利息就是"借钱的费用"\n\n单利：每年的利息只按本金算\n比如借 $${principal}$ 两，年利率 $${rate}\\%$\n每年利息固定 = $${principal} \\times ${rateDecimal} = ${interest}$`, en: `Borrowing costs interest — the "fee for borrowing"\n\nSimple interest: calculated on original amount only\nE.g., borrow $${principal}$ liang at $${rate}\\%$ per year\nYearly interest = $${principal} \\times ${rateDecimal} = ${interest}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：单利公式`, en: `${narrator}: "Simple interest formula"` },
      hint: { zh: `总额 $= P + P \\times r \\times t$\n$= P(1 + r \\times t)$\n\n$P$ = 本金 = $${principal}$\n$r$ = 年利率 = $${rateDecimal}$\n$t$ = 年数 = $${years}$`, en: `Total $= P + P \\times r \\times t$\n$= P(1 + r \\times t)$\n\n$P$ = principal = $${principal}$\n$r$ = annual rate = $${rateDecimal}$\n$t$ = years = $${years}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：计算利息`, en: `${narrator}: "Calculate the interest"` },
      hint: { zh: `国库收税——算出利息总额\n\n利息 $= ${principal} \\times ${rateDecimal} \\times ${years} = ${interest * years}$`, en: `Treasury collects tax — calculate total interest\n\nInterest $= ${principal} \\times ${rateDecimal} \\times ${years} = ${interest * years}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：加上本金`, en: `${narrator}: "Add the principal"` },
      hint: { zh: `本金加利息——国库总入账\n\n总额 $= ${principal} + ${interest * years} = ${totalSimple}$`, en: `Principal plus interest — total into the treasury\n\nTotal $= ${principal} + ${interest * years} = ${totalSimple}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案 = ${totalSimple}`, en: `${narrator}: "Answer = ${totalSimple}"` },
      hint: { zh: `国库账本记录——$${years}$ 年后需还 $${totalSimple}$ 两`, en: `Treasury ledger records — after $${years}$ years, repay $${totalSimple}$ liang` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算`, en: `${narrator}: "Verify"` },
      hint: { zh: `账房先生复核——国库不能算错！\n\n每年利息 $${interest}$，共 $${years}$ 年\n利息合计 $= ${interest} \\times ${years} = ${interest * years}$\n本金 + 利息 $= ${principal} + ${interest * years} = ${totalSimple}$ ✓`, en: `The treasurer double-checks — the treasury must be accurate!\n\nYearly interest $${interest}$, for $${years}$ years\nTotal interest $= ${interest} \\times ${years} = ${interest * years}$\nPrincipal + interest $= ${principal} + ${interest * years} = ${totalSimple}$ ✓` },
      highlightField: 'ans',
    },
  ] : [
    {
      text: { zh: `${narrator}：什么是复利？`, en: `${narrator}: "What is compound interest?"` },
      hint: { zh: `复利和单利的区别：\n单利：只按本金算利息（利息不生利息）\n复利：利息也算利息！（利滚利）\n\n曹操的军需库：去年的利息今年也要算利息`, en: `Compound vs simple interest:\nSimple: interest on original only\nCompound: interest on interest too! (snowball)\n\nCao Cao's treasury: last year's interest also earns interest` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：复利公式`, en: `${narrator}: "Compound interest formula"` },
      hint: { zh: `$A = P \\times (1 + r)^t$\n\n$P = ${principal}$，$r = ${rateDecimal}$，$t = ${years}$\n\n$(1 + r)$ 就是"每年变成原来的多少倍"\n$1 + ${rateDecimal} = ${1 + rateDecimal}$`, en: `$A = P \\times (1 + r)^t$\n\n$P = ${principal}$, $r = ${rateDecimal}$, $t = ${years}$\n\n$(1 + r)$ = "multiply factor per year"\n$1 + ${rateDecimal} = ${1 + rateDecimal}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：逐年计算`, en: `${narrator}: "Calculate year by year"` },
      hint: (() => {
        let zh = '利滚利——国库的雪球越滚越大\n\n', en = 'Snowball effect — the treasury grows year on year\n\n';
        let amt = principal;
        for (let y = 1; y <= years; y++) {
          const prev = amt;
          amt = parseFloat((amt * (1 + rateDecimal)).toFixed(2));
          zh += `第 ${y} 年：$${prev} \\times ${1 + rateDecimal} = ${amt}$\n`;
          en += `Year ${y}: $${prev} \\times ${1 + rateDecimal} = ${amt}$\n`;
        }
        return { zh, en };
      })(),
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：用公式一步算`, en: `${narrator}: "Or use the formula in one step"` },
      hint: { zh: `一步到位——国库总账公式\n\n$A = ${principal} \\times (${1 + rateDecimal})^{${years}} = ${answer}$`, en: `One step — the treasury's master formula\n\n$A = ${principal} \\times (${1 + rateDecimal})^{${years}} = ${answer}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：答案 = ${answer}`, en: `${narrator}: "Answer = ${answer}"` },
      hint: { zh: `国库结算——利滚利果然比单利多\n\n$${years}$ 年复利后总额 $= ${answer}$ 两\n\n比单利多：$${answer} - ${totalSimple} = ${parseFloat((answer - totalSimple).toFixed(2))}$`, en: `Treasury settlement — compounding indeed beats simple interest\n\n$${years}$ years of compound interest, total $= ${answer}$ liang\n\nMore than simple interest by: $${answer} - ${totalSimple} = ${parseFloat((answer - totalSimple).toFixed(2))}$` },
      highlightField: 'ans',
    },
    {
      text: { zh: `${narrator}：验算——逐年追踪`, en: `${narrator}: "Verify — track year by year"` },
      hint: (() => {
        let zh = `账房先生逐年核账——国库不容有失！\n\n从 $${principal}$ 开始：\n`, en = `The treasurer audits year by year — the treasury must be exact!\n\nStarting from $${principal}$:\n`;
        let amt = principal;
        for (let y = 1; y <= years; y++) {
          amt = parseFloat((amt * (1 + rateDecimal)).toFixed(2));
          zh += `第 ${y} 年末：$${amt}$\n`;
          en += `End of year ${y}: $${amt}$\n`;
        }
        zh += `最终 $${amt}$ ✓`;
        en += `Final $${amt}$ ✓`;
        return { zh, en };
      })(),
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { principal, initial: principal, rate: rateDecimal, rateDecimal, years, mode, answer, generatorType: 'PERCENTAGE_INTEREST_RANDOM' },
    tutorialSteps,
  };
}

export function generateParallelAnglesMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['关羽', '张飞', '赵云'];
  const narrator = pickRandom(narrators);

  const anglePools: Record<number, number[]> = { 1: [40, 50, 60, 70], 2: [35, 45, 55, 65, 75], 3: [32, 48, 53, 67, 78, 83] };
  const givenAngle = pickRandom(anglePools[tier]);

  const types = ['alternate', 'corresponding', 'co-interior'] as const;
  const angleType = pickRandom([...types]);

  let answer: number;
  let typeZh: string;
  let typeEn: string;
  let reasonZh: string;
  let reasonEn: string;

  if (angleType === 'alternate') {
    answer = givenAngle;
    typeZh = '内错角';
    typeEn = 'alternate angles';
    reasonZh = '内错角相等（Z字形）';
    reasonEn = 'Alternate angles are equal (Z-shape)';
  } else if (angleType === 'corresponding') {
    answer = givenAngle;
    typeZh = '同位角';
    typeEn = 'corresponding angles';
    reasonZh = '同位角相等（F字形）';
    reasonEn = 'Corresponding angles are equal (F-shape)';
  } else {
    answer = 180 - givenAngle;
    typeZh = '同旁内角';
    typeEn = 'co-interior angles';
    reasonZh = '同旁内角互补（C字形/U字形）';
    reasonEn = 'Co-interior angles are supplementary (C-shape/U-shape)';
  }

  const description = {
    zh: `两平行线被一条直线截断。已知角 $= ${givenAngle}°$，求${typeZh} $x$。`,
    en: `Two parallel lines cut by a transversal. Given angle $= ${givenAngle}°$. Find the ${typeEn} $x$.`,
  };

  const tutorialSteps = [
    {
      text: { zh: `${narrator}：攻城时为什么要关心角度？`, en: `${narrator}: "Why care about angles when besieging?"` },
      hint: { zh: `城墙是平行线，攻城梯是截线\n梯子和城墙形成的角度决定了爬墙的难度\n\n两条平行线被一条直线截断\n会产生 3 种特殊角度关系`, en: `City walls are parallel lines, siege ladders are transversals\nThe angle between ladder and wall determines climbing difficulty\n\nTwo parallel lines cut by a transversal\ncreate 3 special angle relationships` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：三种平行线角度关系`, en: `${narrator}: "Three parallel line angle rules"` },
      hint: { zh: `1. 同位角（F字形）：相等\n2. 内错角（Z字形）：相等\n3. 同旁内角（C字形）：互补（加起来 = 180°）\n\n记住字母形状就不会忘！`, en: `1. Corresponding (F-shape): equal\n2. Alternate (Z-shape): equal\n3. Co-interior (C/U-shape): supplementary (add to 180°)\n\nRemember the letter shapes!` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：这道题是哪种？`, en: `${narrator}: "Which type is this?"` },
      hint: { zh: `这对角在攻城梯的哪个位置？\n\n已知角 $= ${givenAngle}°$\n这一对是${typeZh}\n\n${reasonZh}`, en: `Where is this angle pair on the siege ladder?\n\nGiven angle $= ${givenAngle}°$\nThis pair is ${typeEn}\n\n${reasonEn}` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：计算`, en: `${narrator}: "Calculate"` },
      hint: angleType === 'co-interior'
        ? { zh: `架梯计算——算出安全角度\n\n同旁内角互补：\n$x + ${givenAngle}° = 180°$\n$x = 180° - ${givenAngle}° = ${answer}°$`, en: `Ladder calculation — find the safe angle\n\nCo-interior angles are supplementary:\n$x + ${givenAngle}° = 180°$\n$x = 180° - ${givenAngle}° = ${answer}°$` }
        : { zh: `架梯计算——算出安全角度\n\n${typeZh}相等：\n$x = ${givenAngle}°$`, en: `Ladder calculation — find the safe angle\n\n${typeEn} are equal:\n$x = ${givenAngle}°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：答案 = ${answer}°`, en: `${narrator}: "Answer = ${answer}°"` },
      hint: { zh: `角度确认——可以安全爬了！$x = ${answer}°$`, en: `Angle confirmed — safe to climb! $x = ${answer}°$` },
      highlightField: 'x',
    },
    {
      text: { zh: `${narrator}：验算`, en: `${narrator}: "Verify"` },
      hint: angleType === 'co-interior'
        ? { zh: `攻城前最后检查——角度正确才能上！\n\n同旁内角之和 $= ${givenAngle}° + ${answer}° = 180°$ ✓`, en: `Final check before the assault — angles must be right!\n\nCo-interior sum $= ${givenAngle}° + ${answer}° = 180°$ ✓` }
        : { zh: `攻城前最后检查——角度正确才能上！\n\n${typeZh}应该相等：已知 $= ${givenAngle}°$，$x = ${answer}°$\n$${givenAngle}° = ${answer}°$ ✓`, en: `Final check before the assault — angles must be right!\n\n${typeEn} should be equal: given $= ${givenAngle}°$, $x = ${answer}°$\n$${givenAngle}° = ${answer}°$ ✓` },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { givenAngle, angleType, answer, parallel: true, highlight: angleType === 'co-interior' ? 'cointerior' : angleType, total: angleType === 'co-interior' ? 180 : undefined, angle: givenAngle, generatorType: 'PARALLEL_ANGLES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SYMMETRY generator: reflection or 180° rotation
   Modes: 'reflect_x' (reflect over x-axis), 'reflect_y' (reflect over y-axis), 'rotate_180' (rotate 180° about origin)
   ══════════════════════════════════════════════════════════ */

export function generateSymmetryMission(template: Mission): Mission {
  const tier = getTier();
  const coordPools = { 1: [1, 2, 3, 4, 5], 2: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 3: [-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8] };
  const px = pickRandom(coordPools[tier]);
  const py = pickRandom(coordPools[tier]);

  const modes = tier === 1 ? ['reflect_x', 'reflect_y'] : ['reflect_x', 'reflect_y', 'rotate_180'];
  const mode = pickRandom(modes);

  let ansX: number, ansY: number;
  let transformZh: string, transformEn: string;
  let ruleZh: string, ruleEn: string;
  let verifyZh: string, verifyEn: string;

  if (mode === 'reflect_x') {
    ansX = px; ansY = -py;
    transformZh = '关于 $x$ 轴的对称';
    transformEn = 'reflection in the $x$-axis';
    ruleZh = `$x$ 不变，$y$ 取反：$(x, y) \\to (x, -y)$`;
    ruleEn = `$x$ stays the same, $y$ changes sign: $(x, y) \\to (x, -y)$`;
    verifyZh = `原点 $(${px}, ${py})$ 和映像 $(${ansX}, ${ansY})$ 到 $x$ 轴距离相等？$|${py}| = |${ansY}|$ ✓`;
    verifyEn = `Original $(${px}, ${py})$ and image $(${ansX}, ${ansY})$ are equal distance from $x$-axis? $|${py}| = |${ansY}|$ ✓`;
  } else if (mode === 'reflect_y') {
    ansX = -px; ansY = py;
    transformZh = '关于 $y$ 轴的对称';
    transformEn = 'reflection in the $y$-axis';
    ruleZh = `$y$ 不变，$x$ 取反：$(x, y) \\to (-x, y)$`;
    ruleEn = `$y$ stays the same, $x$ changes sign: $(x, y) \\to (-x, y)$`;
    verifyZh = `原点 $(${px}, ${py})$ 和映像 $(${ansX}, ${ansY})$ 到 $y$ 轴距离相等？$|${px}| = |${ansX}|$ ✓`;
    verifyEn = `Original $(${px}, ${py})$ and image $(${ansX}, ${ansY})$ are equal distance from $y$-axis? $|${px}| = |${ansX}|$ ✓`;
  } else {
    ansX = -px; ansY = -py;
    transformZh = '绕原点旋转 $180°$';
    transformEn = 'rotation $180°$ about the origin';
    ruleZh = `$x$ 和 $y$ 都取反：$(x, y) \\to (-x, -y)$`;
    ruleEn = `Both $x$ and $y$ change sign: $(x, y) \\to (-x, -y)$`;
    verifyZh = `中点 $= (\\frac{${px}+(${ansX})}{2}, \\frac{${py}+(${ansY})}{2}) = (0, 0)$ = 旋转中心 ✓`;
    verifyEn = `Midpoint $= (\\frac{${px}+(${ansX})}{2}, \\frac{${py}+(${ansY})}{2}) = (0, 0)$ = centre of rotation ✓`;
  }

  const narrator = pickRandom(['诸葛亮', '周瑜']);
  const description: BilingualText = {
    zh: `点 $(${px}, ${py})$ 经过${transformZh}后的坐标`,
    en: `Find the image of $(${px}, ${py})$ after ${transformEn}`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要对称？\n行军布阵讲究对称——左翼和右翼互相呼应，才能攻守兼备。\n数学中的对称变换帮助我们描述这种镜像关系。`,
        en: `${narrator}: "Why do we need symmetry?\nBattle formations rely on symmetry — left and right wings mirror each other for balanced attack and defence.\nMathematical symmetry transformations describe these mirror relationships."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：${transformZh}的规则\n${ruleZh}`,
        en: `${narrator}: "Rule for ${transformEn}\n${ruleEn}"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：原始坐标\n点 $A = (${px}, ${py})$`,
        en: `${narrator}: "Original point\n$A = (${px}, ${py})$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：应用变换规则\n$x' = ${ansX}$`,
        en: `${narrator}: "Apply the transformation rule\n$x' = ${ansX}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：答案\n映像坐标 $A' = (${ansX}, ${ansY})$`,
        en: `${narrator}: "Answer\nImage coordinates $A' = (${ansX}, ${ansY})$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：验算\n${verifyZh}`,
        en: `${narrator}: "Verify\n${verifyEn}"`,
      },
      highlightField: 'y',
    },
  ];

  return {
    ...template,
    description,
    data: { px, py, mode, ansX, ansY, generatorType: 'SYMMETRY_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SIMULTANEOUS_Y8 generator: substitution method (simpler than Y9 elimination)
   ══════════════════════════════════════════════════════════ */

export function generateSimultaneousY8Mission(template: Mission): Mission {
  const tier = getTier();
  // Generate y = ax + b (first equation, already solved for y)
  const aPools = { 1: [1, 2], 2: [1, 2, 3, -1], 3: [1, 2, 3, -1, -2, -3] };
  const bPools = { 1: [1, 2, 3], 2: [-3, -2, -1, 1, 2, 3, 4, 5], 3: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5] };
  const a = pickRandom(aPools[tier]);
  const b = pickRandom(bPools[tier]);

  // Second equation: cx + dy = e, with integer solution
  const cPools = { 1: [1, 2], 2: [1, 2, 3], 3: [1, 2, 3, 4] };
  const dPools = { 1: [1], 2: [1, 2], 3: [1, 2, 3] };
  const c = pickRandom(cPools[tier]);
  const d = pickRandom(dPools[tier]);

  // Pick x from pool, compute y, compute e
  const xPools = { 1: [1, 2, 3], 2: [-2, -1, 1, 2, 3, 4], 3: [-3, -2, -1, 1, 2, 3, 4, 5] };
  const x = pickRandom(xPools[tier]);
  const y = a * x + b;
  const e = c * x + d * y;

  const narrator = pickRandom(['诸葛亮', '周瑜']);

  // Substitution intermediate: c*x + d*(a*x + b) = e → (c + d*a)*x + d*b = e → (c+da)*x = e - db
  const combinedCoeff = c + d * a;
  const constant = d * b;

  // Avoid trivial or zero-coefficient cases
  if (combinedCoeff === 0) return generateSimultaneousY8Mission(template);

  const eq1Zh = `$y = ${a === 1 ? '' : a === -1 ? '-' : a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}$`;
  const eq1En = eq1Zh;
  const eq2Zh = `$${c}x + ${d}y = ${e}$`;
  const eq2En = eq2Zh;

  const description: BilingualText = {
    zh: `用代入法解联立方程：${eq1Zh}，${eq2Zh}`,
    en: `Solve by substitution: ${eq1En}, ${eq2En}`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要联立方程？\n两支军队需要同时到达会合点——每支军队有自己的行军路线（方程）。\n只有同时满足两个条件，才能找到会合点。`,
        en: `${narrator}: "Why do we need simultaneous equations?\nTwo armies must arrive at the rendezvous at the same time — each has its own march route (equation).\nOnly by satisfying both conditions can we find the meeting point."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：方程组\n方程1：${eq1Zh}（已解出 $y$）\n方程2：${eq2Zh}`,
        en: `${narrator}: "The system\nEquation 1: ${eq1En} ($y$ is already isolated)\nEquation 2: ${eq2En}"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：代入\n把方程1的 $y$ 代入方程2：\n$${c}x + ${d}(${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}) = ${e}$`,
        en: `${narrator}: "Substitute\nReplace $y$ in Equation 2 with Equation 1:\n$${c}x + ${d}(${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}) = ${e}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：化简\n$${combinedCoeff}x ${constant >= 0 ? '+ ' + constant : '- ' + Math.abs(constant)} = ${e}$\n$${combinedCoeff}x = ${e - constant}$\n$x = ${x}$`,
        en: `${narrator}: "Simplify\n$${combinedCoeff}x ${constant >= 0 ? '+ ' + constant : '- ' + Math.abs(constant)} = ${e}$\n$${combinedCoeff}x = ${e - constant}$\n$x = ${x}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：代回求 $y$\n$y = ${a} \\times ${x} ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${y}$`,
        en: `${narrator}: "Substitute back to find $y$\n$y = ${a} \\times ${x} ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${y}$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：答案\n$x = ${x}$，$y = ${y}$`,
        en: `${narrator}: "Answer\n$x = ${x}$, $y = ${y}$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：验算\n代入方程2：$${c} \\times ${x} + ${d} \\times ${y} = ${c * x} + ${d * y} = ${e}$ ✓`,
        en: `${narrator}: "Verify\nSubstitute into Eq2: $${c} \\times ${x} + ${d} \\times ${y} = ${c * x} + ${d * y} = ${e}$ ✓"`,
      },
      highlightField: 'y',
    },
  ];

  return {
    ...template,
    description,
    data: { subEq1: [a, b], subEq2: [c, d, e], x, y, generatorType: 'SIMULTANEOUS_Y8_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   RATIO_Y8 generator: direct & inverse proportion (y=kx or y=k/x)
   ══════════════════════════════════════════════════════════ */

export function generateRatioY8Mission(template: Mission): Mission {
  const tier = getTier();
  const mode = pickRandom(['direct', 'inverse']) as 'direct' | 'inverse';

  const kPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8, 10], 3: [2, 3, 4, 5, 6, 7, 8, 10, 12, 15] };
  const k = pickRandom(kPools[tier]);

  // Known pair
  const x1Pools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8], 3: [2, 3, 4, 5, 6, 8, 10] };
  const x1 = pickRandom(x1Pools[tier]);
  const y1 = mode === 'direct' ? k * x1 : k / x1;

  // Target: given x2, find y2
  const x2Pools = { 1: [2, 3, 5], 2: [2, 3, 4, 5, 6, 8, 10], 3: [2, 3, 4, 5, 6, 8, 10, 12] };
  let x2 = pickRandom(x2Pools[tier]);
  while (x2 === x1) x2 = pickRandom(x2Pools[tier]);

  const y2 = mode === 'direct' ? k * x2 : k / x2;

  // Skip non-integer answers
  if (!Number.isInteger(y1) || !Number.isInteger(y2)) return generateRatioY8Mission(template);

  const narrator = pickRandom(['曹操', '刘备']);

  const description: BilingualText = mode === 'direct'
    ? { zh: `$y$ 与 $x$ 成正比。当 $x=${x1}$ 时 $y=${y1}$，求 $x=${x2}$ 时的 $y$。`, en: `$y$ is directly proportional to $x$. When $x=${x1}$, $y=${y1}$. Find $y$ when $x=${x2}$.` }
    : { zh: `$y$ 与 $x$ 成反比。当 $x=${x1}$ 时 $y=${y1}$，求 $x=${x2}$ 时的 $y$。`, en: `$y$ is inversely proportional to $x$. When $x=${x1}$, $y=${y1}$. Find $y$ when $x=${x2}$.` };

  const formulaZh = mode === 'direct' ? '$y = kx$' : '$y = \\frac{k}{x}$';
  const formulaEn = formulaZh;
  const conceptZh = mode === 'direct'
    ? '正比例：$x$ 增大，$y$ 也增大，比值恒定。'
    : '反比例：$x$ 增大，$y$ 反而减小，乘积恒定。';
  const conceptEn = mode === 'direct'
    ? 'Direct proportion: as $x$ increases, $y$ increases — the ratio stays constant.'
    : 'Inverse proportion: as $x$ increases, $y$ decreases — the product stays constant.';

  const findKZh = mode === 'direct'
    ? `$k = \\frac{y}{x} = \\frac{${y1}}{${x1}} = ${k}$`
    : `$k = y \\times x = ${y1} \\times ${x1} = ${k}$`;
  const findKEn = findKZh;

  const calcZh = mode === 'direct'
    ? `$y = ${k} \\times ${x2} = ${y2}$`
    : `$y = \\frac{${k}}{${x2}} = ${y2}$`;
  const calcEn = calcZh;

  const verifyZh = mode === 'direct'
    ? `$\\frac{y_1}{x_1} = \\frac{${y1}}{${x1}} = ${k}$，$\\frac{y_2}{x_2} = \\frac{${y2}}{${x2}} = ${k}$ ✓ 比值相等！`
    : `$y_1 \\times x_1 = ${y1} \\times ${x1} = ${k}$，$y_2 \\times x_2 = ${y2} \\times ${x2} = ${k}$ ✓ 乘积相等！`;
  const verifyEn = mode === 'direct'
    ? `$\\frac{y_1}{x_1} = \\frac{${y1}}{${x1}} = ${k}$, $\\frac{y_2}{x_2} = \\frac{${y2}}{${x2}} = ${k}$ ✓ Ratios are equal!`
    : `$y_1 \\times x_1 = ${y1} \\times ${x1} = ${k}$, $y_2 \\times x_2 = ${y2} \\times ${x2} = ${k}$ ✓ Products are equal!`;

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要比例关系？\n治理天下，税收和人口成正比——人越多税越多。\n而粮草分配和军队数成反比——军队越多，每人分到越少。\n理解正反比例，才能精准治国。`,
        en: `${narrator}: "Why do we need proportion?\nGoverning a realm: tax is directly proportional to population — more people, more tax.\nBut rations per soldier are inversely proportional — more soldiers, less each gets.\nUnderstanding proportion is key to good governance."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：${conceptZh}\n公式：${formulaZh}`,
        en: `${narrator}: "${conceptEn}\nFormula: ${formulaEn}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：求常数 $k$\n已知 $x = ${x1}$，$y = ${y1}$\n${findKZh}`,
        en: `${narrator}: "Find the constant $k$\nGiven $x = ${x1}$, $y = ${y1}$\n${findKEn}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：计算\n当 $x = ${x2}$ 时：\n${calcZh}`,
        en: `${narrator}: "Calculate\nWhen $x = ${x2}$:\n${calcEn}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$y = ${y2}$`,
        en: `${narrator}: "Answer\n$y = ${y2}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n${verifyZh}`,
        en: `${narrator}: "Verify\n${verifyEn}"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, mode, k, x1, y1, x2, y2, answer: y2, generatorType: 'RATIO_Y8_RANDOM' },
    tutorialSteps,
  };
}
