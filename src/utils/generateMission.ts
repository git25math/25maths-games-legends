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
  | 'PERCENTAGE_RANDOM';

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
};

/** Dispatch to the right generator based on mission.data.generatorType */
export function generateMission(template: Mission): Mission {
  const genType = template.data?.generatorType as GeneratorType | undefined;
  if (!genType || !GENERATOR_MAP[genType]) return template;
  return GENERATOR_MAP[genType](template);
}

/**
 * SIMPLE_EQ (multiplication): ax = result
 * Generator only updates data fields + tutorialSteps.
 * Story/title/description are templates with {a}, {result} — interpolated at render time.
 */
export function generateSimpleEqMission(template: Mission): Mission {
  const a = pickRandom([2, 3, 4, 5, 6, 7, 8, 9]);
  const x = pickRandom([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]);
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
  const a = pickRandom([3, 4, 5, 6, 7, 8, 9, 11, 13, 15]);
  const x = pickRandom([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
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
  const bases = [2, 3, 5];
  const base = pickRandom(bases);
  const op = template.data?.op === 'div' ? 'div' : pickRandom(['mul', 'div'] as const);
  let e1: number, e2: number;
  if (op === 'div') {
    e1 = randInt(4, 9);
    e2 = randInt(2, e1 - 1);
  } else {
    e1 = randInt(2, 5);
    e2 = randInt(2, 5);
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
  const total = template.data?.total || 180;
  const angle = total === 90 ? randInt(10, 80) : randInt(20, 160);
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
  const a1 = pickRandom([50, 80, 100, 150, 200, 300]);
  const d = pickRandom([5, 8, 10, 15, 20, 25, 30, 50]);
  const n = randInt(5, 15);
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
  const length = randInt(8, 40);
  const width = randInt(5, 30);
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
  let a = randInt(5, 20);
  let b = randInt(a + 2, a + 20);
  let h = randInt(4, 15);
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
  const total = pickRandom([20, 30, 36, 40, 50, 52, 60, 80, 100]);
  const target = pickRandom([2, 3, 4, 5, 6, 8, 10, 12, 15]);
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
  const p1 = pickRandom([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const p2 = pickRandom([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
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

export function generatePythagorasMission(template: Mission): Mission {
  const [triA, triB, triC] = pickRandom(PYTHAGOREAN_TRIPLES);
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
  const isDiscount = (template.data?.rate ?? 0) < 0;
  const initial = pickRandom([200, 500, 800, 1000, 1500, 2000, 3000, 5000]);
  const pct = pickRandom([10, 15, 20, 25, 30, 40, 50]);
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
