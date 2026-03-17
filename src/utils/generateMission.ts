import type { Mission } from '../types';

type BilingualText = { zh: string; en: string };

type StoryTemplate = (a: number, x: number, result: number) => {
  story: BilingualText;
  title: BilingualText;
  tip: BilingualText;
  narrator: string;
};

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

const storyTemplates: StoryTemplate[] = [
  // 1. 关羽买刀
  (a, _x, result) => ({
    story: {
      zh: `关羽欲购${a}把青龙偃月刀，共需${result}两黄金。每把刀价值几何？`,
      en: `Guan Yu wants to buy ${a} Green Dragon Crescent Blades for a total of ${result} gold. How much does each blade cost?`,
    },
    title: { zh: '关羽买刀', en: 'Guan Yu Buys Blades' },
    tip: {
      zh: `总价${result}金÷${a}把＝每把单价`,
      en: `Total ${result} gold ÷ ${a} blades = price per blade`,
    },
    narrator: '关羽',
  }),
  // 2. 张飞分酒
  (a, _x, result) => ({
    story: {
      zh: `张飞将${result}升美酒均分入${a}坛，每坛几升？`,
      en: `Zhang Fei divides ${result} liters of wine equally into ${a} jars. How many liters per jar?`,
    },
    title: { zh: '张飞分酒', en: 'Zhang Fei Shares Wine' },
    tip: {
      zh: `${result}升÷${a}坛＝每坛升数`,
      en: `${result} liters ÷ ${a} jars = liters per jar`,
    },
    narrator: '张飞',
  }),
  // 3. 赵云备马
  (a, _x, result) => ({
    story: {
      zh: `赵云为骑兵备${a}匹战马，共花${result}两白银。每匹马多少银两？`,
      en: `Zhao Yun prepares ${a} warhorses for the cavalry, costing ${result} silver in total. How much silver per horse?`,
    },
    title: { zh: '赵云备马', en: 'Zhao Yun Prepares Horses' },
    tip: {
      zh: `${result}两白银÷${a}匹＝每匹价格`,
      en: `${result} silver ÷ ${a} horses = price per horse`,
    },
    narrator: '赵云',
  }),
  // 4. 诸葛亮配药
  (a, _x, result) => ({
    story: {
      zh: `诸葛亮配制${a}剂良药，共需${result}味草药。每剂需几味？`,
      en: `Zhuge Liang prepares ${a} doses of medicine using ${result} herbs in total. How many herbs per dose?`,
    },
    title: { zh: '诸葛亮配药', en: 'Zhuge Liang Mixes Medicine' },
    tip: {
      zh: `${result}味草药÷${a}剂＝每剂用量`,
      en: `${result} herbs ÷ ${a} doses = herbs per dose`,
    },
    narrator: '诸葛亮',
  }),
  // 5. 曹操练兵
  (a, _x, result) => ({
    story: {
      zh: `曹操将${result}名士兵编为${a}队，每队几人？`,
      en: `Cao Cao organizes ${result} soldiers into ${a} squads. How many soldiers per squad?`,
    },
    title: { zh: '曹操练兵', en: 'Cao Cao Drills Soldiers' },
    tip: {
      zh: `${result}人÷${a}队＝每队人数`,
      en: `${result} soldiers ÷ ${a} squads = soldiers per squad`,
    },
    narrator: '曹操',
  }),
  // 6. 孙权造船
  (a, _x, result) => ({
    story: {
      zh: `孙权建造${a}艘战船，共需${result}块船板。每艘需几块？`,
      en: `Sun Quan builds ${a} warships requiring ${result} planks in total. How many planks per ship?`,
    },
    title: { zh: '孙权造船', en: 'Sun Quan Builds Ships' },
    tip: {
      zh: `${result}块÷${a}艘＝每艘用量`,
      en: `${result} planks ÷ ${a} ships = planks per ship`,
    },
    narrator: '孙权',
  }),
];

export function generateSimpleEqMission(template: Mission): Mission {
  const aPool = [2, 3, 4, 5, 6, 7, 8, 9];
  const xPool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];

  const a = pickRandom(aPool);
  const x = pickRandom(xPool);
  const result = a * x;

  const storyTemplate = pickRandom(storyTemplates);
  const { story, title, tip, narrator } = storyTemplate(a, x, result);

  const description: BilingualText = {
    zh: `解方程 $${a}x=${result}$，求 $x$。`,
    en: `Solve $${a}x=${result}$ for $x$.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：「${a}x = ${result}，如何求出 x？」`,
        en: `${narrator}: "${a}x = ${result}, how do we find x?"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：「等式两边同时除以 ${a}」`,
        en: `${narrator}: "Divide both sides by ${a}"`,
      },
      hint: {
        zh: `${a}x ÷ ${a} = ${result} ÷ ${a}`,
        en: `${a}x ÷ ${a} = ${result} ÷ ${a}`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：「所以 x = ${x}！」`,
        en: `${narrator}: "So x = ${x}!"`,
      },
      highlightField: 'x',
    },
  ];

  const tutorialEquationSteps = [
    { tex: `${a}x = ${result}`, annotation: { zh: '列方程', en: 'Equation' } },
    { tex: `${a}x \\div ${a} = ${result} \\div ${a}`, annotation: { zh: `两边÷${a}`, en: `÷${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  const data = {
    ...template.data,
    x,
    left: `${a}x`,
    right: `${result}`,
    generatorType: 'SIMPLE_EQ_RANDOM',
    tutorialEquationSteps,
  };

  return {
    ...template,
    title,
    story,
    description,
    data,
    tutorialSteps,
    secret: {
      ...template.secret,
      tips: [tip, ...template.secret.tips],
    },
  };
}

/* ── Addition / Subtraction equation: x + a = b ── */

const addStoryTemplates: StoryTemplate[] = [
  // 1. 刘备分酒
  (a, x, result) => ({
    story: {
      zh: `刘备宴请群臣，已备 ${x} 壶美酒，又添 ${a} 壶，共 ${result} 壶。原有几壶？`,
      en: `Liu Bei hosts a banquet with ${x} jugs of wine plus ${a} more, totaling ${result}. How many jugs were there originally?`,
    },
    title: { zh: '刘备分酒', en: 'Liu Bei Shares Wine' },
    tip: {
      zh: `总共${result}壶 − 新添${a}壶 ＝ 原有壶数`,
      en: `Total ${result} jugs − ${a} added = original jugs`,
    },
    narrator: '刘备',
  }),
  // 2. 关羽行军
  (a, x, result) => ({
    story: {
      zh: `关羽已行军 ${x} 里，再行 ${a} 里即达目的地，全程 ${result} 里。已行几里？`,
      en: `Guan Yu has marched ${x} miles and has ${a} more to go, totaling ${result} miles. How far has he marched?`,
    },
    title: { zh: '关羽行军', en: 'Guan Yu Marches' },
    tip: {
      zh: `全程${result}里 − 剩余${a}里 ＝ 已行里数`,
      en: `Total ${result} miles − ${a} remaining = miles marched`,
    },
    narrator: '关羽',
  }),
  // 3. 张飞打铁
  (a, x, result) => ({
    story: {
      zh: `张飞已锻 ${x} 把宝刀，还需再锻 ${a} 把，共需 ${result} 把。已锻几把？`,
      en: `Zhang Fei has forged ${x} swords and needs ${a} more, for a total of ${result}. How many has he forged?`,
    },
    title: { zh: '张飞打铁', en: 'Zhang Fei Forges Swords' },
    tip: {
      zh: `共需${result}把 − 待锻${a}把 ＝ 已锻数量`,
      en: `Total ${result} swords − ${a} remaining = swords forged`,
    },
    narrator: '张飞',
  }),
  // 4. 诸葛亮算粮
  (a, x, result) => ({
    story: {
      zh: `诸葛亮清点粮草，${x} 车军粮加上 ${a} 车储备粮，共 ${result} 车。军粮几车？`,
      en: `Zhuge Liang counts ${x} carts of grain plus ${a} reserve carts, totaling ${result}. How many carts of grain?`,
    },
    title: { zh: '诸葛亮算粮', en: 'Zhuge Liang Counts Grain' },
    tip: {
      zh: `共${result}车 − 储备${a}车 ＝ 军粮车数`,
      en: `Total ${result} carts − ${a} reserve = grain carts`,
    },
    narrator: '诸葛亮',
  }),
  // 5. 赵云点兵
  (a, x, result) => ({
    story: {
      zh: `赵云点兵，${x} 骑兵加 ${a} 步兵，共 ${result} 人。骑兵几人？`,
      en: `Zhao Yun musters ${x} cavalry and ${a} infantry, totaling ${result} soldiers. How many cavalry?`,
    },
    title: { zh: '赵云点兵', en: 'Zhao Yun Musters Troops' },
    tip: {
      zh: `共${result}人 − 步兵${a}人 ＝ 骑兵人数`,
      en: `Total ${result} − ${a} infantry = cavalry count`,
    },
    narrator: '赵云',
  }),
  // 6. 曹操征税
  (a, x, result) => ({
    story: {
      zh: `曹操收得赋税 ${x} 两黄金，加上进贡 ${a} 两，共 ${result} 两。赋税几何？`,
      en: `Cao Cao collects ${x} gold in tax plus ${a} in tribute, totaling ${result}. How much was the tax?`,
    },
    title: { zh: '曹操征税', en: 'Cao Cao Collects Tax' },
    tip: {
      zh: `共${result}两 − 进贡${a}两 ＝ 赋税金额`,
      en: `Total ${result} gold − ${a} tribute = tax amount`,
    },
    narrator: '曹操',
  }),
];

export function generateAddEqMission(template: Mission): Mission {
  const aPool = [3, 4, 5, 6, 7, 8, 9, 11, 13, 15];
  const xPool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];

  const a = pickRandom(aPool);
  const x = pickRandom(xPool);
  const result = x + a;

  const storyTemplate = pickRandom(addStoryTemplates);
  const { story, title, tip, narrator } = storyTemplate(a, x, result);

  const description: BilingualText = {
    zh: `解方程 $x+${a}=${result}$，求 $x$。`,
    en: `Solve $x+${a}=${result}$ for $x$.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：「x + ${a} = ${result}，如何求出 x？」`,
        en: `${narrator}: "x + ${a} = ${result}, how do we find x?"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：「等式两边同时减去 ${a}」`,
        en: `${narrator}: "Subtract ${a} from both sides"`,
      },
      hint: {
        zh: `x + ${a} − ${a} = ${result} − ${a}`,
        en: `x + ${a} − ${a} = ${result} − ${a}`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：「所以 x = ${x}！」`,
        en: `${narrator}: "So x = ${x}!"`,
      },
      highlightField: 'x',
    },
  ];

  const tutorialEquationSteps = [
    { tex: `x + ${a} = ${result}`, annotation: { zh: '列方程', en: 'Equation' } },
    { tex: `x + ${a} - ${a} = ${result} - ${a}`, annotation: { zh: `两边-${a}`, en: `-${a} both sides` } },
    { tex: `x = ${x}`, annotation: { zh: '求解', en: 'Solution' } },
  ];

  const data = {
    ...template.data,
    x,
    left: `x+${a}`,
    right: `${result}`,
    generatorType: 'SIMPLE_EQ_ADD_RANDOM',
    tutorialEquationSteps,
  };

  return {
    ...template,
    title,
    story,
    description,
    data,
    tutorialSteps,
    secret: {
      ...template.secret,
      tips: [tip, ...template.secret.tips],
    },
  };
}

/* ══════════════════════════════════════════════════════════
   INDICES generator: a^e1 × a^e2 = a^x  or  a^e1 / a^e2 = a^x
   ══════════════════════════════════════════════════════════ */

const indicesStories = [
  (base: number, e1: number, e2: number, op: string) => ({
    story: {
      zh: op === 'div'
        ? `曹操清点仓库，总量 $${base}^{${e1}}$，分出 $${base}^{${e2}}$ 后剩余 $${base}^x$。`
        : `曹操屯粮，第一批 $${base}^{${e1}}$，第二批是 $${base}^{${e2}}$ 倍，总量 $${base}^x$。`,
      en: op === 'div'
        ? `Cao Cao has $${base}^{${e1}}$ in stock, gives away $${base}^{${e2}}$, remainder is $${base}^x$.`
        : `Cao Cao stores grain: batch 1 is $${base}^{${e1}}$, batch 2 is $${base}^{${e2}}$ times, total $${base}^x$.`,
    },
    narrator: '曹操',
  }),
  (base: number, e1: number, e2: number, op: string) => ({
    story: {
      zh: op === 'div'
        ? `孙权舰队 $${base}^{${e1}}$ 艘，损失 $${base}^{${e2}}$ 后剩 $${base}^x$ 艘。`
        : `孙权造船，第一期 $${base}^{${e1}}$，扩建 $${base}^{${e2}}$ 倍，共 $${base}^x$ 艘。`,
      en: op === 'div'
        ? `Sun Quan's fleet of $${base}^{${e1}}$ loses $${base}^{${e2}}$, leaving $${base}^x$.`
        : `Sun Quan builds ships: phase 1 is $${base}^{${e1}}$, expanded $${base}^{${e2}}$ times, total $${base}^x$.`,
    },
    narrator: '孙权',
  }),
];

export function generateIndicesMission(template: Mission): Mission {
  const bases = [2, 3, 5];
  const base = pickRandom(bases);
  const op = pickRandom(['mul', 'div'] as const);
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

  const { story, narrator } = pickRandom(indicesStories)(base, e1, e2, op);
  const description: BilingualText = {
    zh: `计算 $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^x$，求 $x$。`,
    en: `Calculate $${base}^{${e1}} ${sym} ${base}^{${e2}} = ${base}^x$, find $x$.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「${base}^{${e1}} ${op === 'div' ? '÷' : '×'} ${base}^{${e2}} = ${base}^x」`, en: `${narrator}: "${base}^{${e1}} ${op === 'div' ? '÷' : '×'} ${base}^{${e2}} = ${base}^x"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「${op === 'div' ? '底数相同，指数相减' : '底数相同，指数相加'}：x = ${e1} ${op === 'div' ? '-' : '+'} ${e2}」`, en: `${narrator}: "${op === 'div' ? 'Same base, subtract exponents' : 'Same base, add exponents'}: x = ${e1} ${op === 'div' ? '-' : '+'} ${e2}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「所以 x = ${ans}！」`, en: `${narrator}: "So x = ${ans}!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    story,
    description,
    data: { ...template.data, base, e1, e2, op: op === 'div' ? 'div' : undefined, generatorType: 'INDICES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ANGLES generator: supplementary (180) or complementary (90)
   ══════════════════════════════════════════════════════════ */

export function generateAnglesMission(template: Mission): Mission {
  const total = template.data?.total || 180;
  const angle = total === 90 ? randInt(10, 80) : randInt(20, 160);
  const ans = total - angle;
  const kind = total === 90 ? { zh: '余角', en: 'complementary' } : { zh: '补角', en: 'supplementary' };

  const narrators = ['关羽', '赵云', '张飞'];
  const narrator = pickRandom(narrators);
  const story: BilingualText = {
    zh: `布阵之际，一角为 $${angle}^\\circ$，求其${kind.zh} $x$。`,
    en: `During formation, one angle is $${angle}^\\circ$, find the ${kind.en} angle $x$.`,
  };
  const description: BilingualText = {
    zh: `计算${kind.zh}：$${total} - ${angle} = x$。`,
    en: `Calculate ${kind.en} angle: $${total} - ${angle} = x$.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：「已知角 ${angle}°，求${kind.zh}。」`, en: `${narrator}: "Given angle ${angle}°, find ${kind.en}."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「${kind.zh}之和为 ${total}°：x = ${total} − ${angle}」`, en: `${narrator}: "${kind.en} angles sum to ${total}°: x = ${total} − ${angle}"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：「所以 x = ${ans}°！」`, en: `${narrator}: "So x = ${ans}°!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    story,
    description,
    data: { ...template.data, angle, total, generatorType: 'ANGLES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ARITHMETIC sequence generator: a_n = a1 + (n-1)d
   ══════════════════════════════════════════════════════════ */

const arithStories = [
  (a1: number, d: number, n: number) => ({
    story: { zh: `联军每日增兵，第一日 ${a1} 人，此后每日增加 ${d} 人。`, en: `Reinforcements arrive daily: ${a1} on day 1, increasing by ${d} daily.` },
    description: { zh: `求第 ${n} 日的增兵人数。$a_n = a_1 + (n-1)d$`, en: `Find reinforcements on Day ${n}. $a_n = a_1 + (n-1)d$` },
    narrator: '诸葛亮',
  }),
  (a1: number, d: number, n: number) => ({
    story: { zh: `修建防御工事，第一排 ${a1} 根木桩，每排增加 ${d} 根。`, en: `Building fortifications: row 1 has ${a1} stakes, ${d} more each row.` },
    description: { zh: `求第 ${n} 排的木桩数。`, en: `Find stakes in Row ${n}.` },
    narrator: '赵云',
  }),
  (a1: number, d: number, n: number) => ({
    story: { zh: `运粮队每日增加 ${d} 担粮。第一日 ${a1} 担。`, en: `Supply team increases by ${d} units daily. Day 1 is ${a1}.` },
    description: { zh: `求第 ${n} 日的运粮量。`, en: `Find supply on Day ${n}.` },
    narrator: '曹操',
  }),
];

export function generateArithmeticMission(template: Mission): Mission {
  const a1 = pickRandom([50, 80, 100, 150, 200, 300]);
  const d = pickRandom([5, 8, 10, 15, 20, 25, 30, 50]);
  const n = randInt(5, 15);
  const ans = a1 + (n - 1) * d;

  const tmpl = pickRandom(arithStories)(a1, d, n);
  const { narrator } = tmpl;

  const tutorialSteps = [
    { text: { zh: `${narrator}：「等差数列，首项 ${a1}，公差 ${d}，求第 ${n} 项。」`, en: `${narrator}: "Arithmetic sequence: a1=${a1}, d=${d}, find term ${n}."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「公式：a_n = ${a1} + (${n}-1)×${d}」`, en: `${narrator}: "Formula: a_n = ${a1} + (${n}-1)×${d}"` }, hint: { zh: `${a1} + ${(n - 1) * d} = ?`, en: `${a1} + ${(n - 1) * d} = ?` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：「所以 a_${n} = ${ans}！」`, en: `${narrator}: "So a_${n} = ${ans}!"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    story: tmpl.story,
    description: tmpl.description,
    data: { ...template.data, a1, d, n, generatorType: 'ARITHMETIC_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA (rectangular) generator
   ══════════════════════════════════════════════════════════ */

export function generateAreaRectMission(template: Mission): Mission {
  const length = randInt(8, 40);
  const width = randInt(5, 30);
  const narrator = pickRandom(['刘备', '曹操', '孙权']);

  const story: BilingualText = {
    zh: `修建营地，长 ${length} 丈，宽 ${width} 丈。`,
    en: `Building a camp: length ${length}, width ${width}.`,
  };
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
    story,
    description,
    data: { ...template.data, length, width, generatorType: 'AREA_RECT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA (trapezoid) generator
   ══════════════════════════════════════════════════════════ */

export function generateAreaTrapMission(template: Mission): Mission {
  let a = randInt(5, 20);
  let b = randInt(a + 2, a + 20);
  let h = randInt(4, 15);
  // Ensure (a+b)*h is even so area is integer
  if (((a + b) * h) % 2 !== 0) h += 1;
  const narrator = pickRandom(['赵云', '关羽']);

  const story: BilingualText = {
    zh: `修筑梯形点将台。上底 ${a} 丈，下底 ${b} 丈，高 ${h} 丈。`,
    en: `Building a trapezoidal platform. Top ${a}, bottom ${b}, height ${h}.`,
  };
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
    story,
    description,
    data: { ...template.data, a, b, h, generatorType: 'AREA_TRAP_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PROBABILITY (simple) generator: P = target/total
   ══════════════════════════════════════════════════════════ */

export function generateProbSimpleMission(template: Mission): Mission {
  const total = pickRandom([20, 30, 36, 40, 50, 52, 60, 80, 100]);
  const target = pickRandom([2, 3, 4, 5, 6, 8, 10, 12, 15]);
  const narrator = '诸葛亮';

  const story: BilingualText = {
    zh: `诸葛亮观天象，共 ${total} 种卦象，其中 ${target} 种为吉兆。`,
    en: `Zhuge Liang reads the sky: ${total} omens total, ${target} are auspicious.`,
  };
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
    story,
    description,
    data: { ...template.data, total, target, generatorType: 'PROBABILITY_SIMPLE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PROBABILITY (independent events) generator: P = p1 × p2
   ══════════════════════════════════════════════════════════ */

export function generateProbIndMission(template: Mission): Mission {
  const p1 = pickRandom([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const p2 = pickRandom([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const narrator = '周瑜';

  const story: BilingualText = {
    zh: `两艘战船各自着火概率分别为 ${p1} 和 ${p2}，两船同时着火的概率是多少？`,
    en: `Two ships have fire probabilities of ${p1} and ${p2}. What's the probability both catch fire?`,
  };
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
    story,
    description,
    data: { ...template.data, p1, p2, generatorType: 'PROBABILITY_IND_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PYTHAGORAS generator: uses integer triples
   ══════════════════════════════════════════════════════════ */

const PYTHAGOREAN_TRIPLES: [number, number, number][] = [
  [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
  [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41],
];

export function generatePythagorasMission(template: Mission): Mission {
  const [a, b, c] = pickRandom(PYTHAGOREAN_TRIPLES);
  const findC = Math.random() > 0.4; // 60% find hypotenuse, 40% find leg
  const narrator = pickRandom(['关羽', '赵云']);

  let story: BilingualText, description: BilingualText, data: any;

  if (findC) {
    story = {
      zh: `攻城需架云梯。城墙高 ${a} 丈，距墙底 ${b} 丈处出发。`,
      en: `Siege ladder needed. Wall height ${a}, distance from base ${b}.`,
    };
    description = {
      zh: `求云梯长度 $c = \\sqrt{${a}^2 + ${b}^2}$。`,
      en: `Find ladder length $c = \\sqrt{${a}^2 + ${b}^2}$.`,
    };
    // Clean slate — don't spread template.data to avoid c leaking from template
    data = { a, b, generatorType: 'PYTHAGORAS_RANDOM' };
  } else {
    story = {
      zh: `挖掘地道。斜长 ${c} 丈，水平距离 ${b} 丈。求深度。`,
      en: `Digging a tunnel. Slant ${c}, horizontal ${b}. Find depth.`,
    };
    description = {
      zh: `求地道深度 $a = \\sqrt{${c}^2 - ${b}^2}$。`,
      en: `Find depth $a = \\sqrt{${c}^2 - ${b}^2}$.`,
    };
    // Clean slate — only include fields checkCorrectness needs
    data = { a: b, c, generatorType: 'PYTHAGORAS_RANDOM' };
  }

  const ans = findC ? c : a;
  const tutorialSteps = [
    { text: { zh: `${narrator}：「勾股定理：a² + b² = c²」`, en: `${narrator}: "Pythagorean theorem: a² + b² = c²"` }, highlightField: 'c' },
    { text: { zh: findC ? `${narrator}：「c = sqrt(${a}² + ${b}²) = sqrt(${a * a + b * b})」` : `${narrator}：「a = sqrt(${c}² - ${b}²) = sqrt(${c * c - b * b})」`, en: findC ? `${narrator}: "c = sqrt(${a}² + ${b}²) = sqrt(${a * a + b * b})"` : `${narrator}: "a = sqrt(${c}² - ${b}²) = sqrt(${c * c - b * b})"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：「答案 = ${ans}！」`, en: `${narrator}: "Answer = ${ans}!"` }, highlightField: 'c' },
  ];

  return { ...template, story, description, data, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   PERCENTAGE generator: result = initial × (1+rate)^years
   ══════════════════════════════════════════════════════════ */

export function generatePercentageMission(template: Mission): Mission {
  const isDiscount = Math.random() > 0.5;
  const initial = pickRandom([200, 500, 800, 1000, 1500, 2000, 3000, 5000]);
  const pct = pickRandom([10, 15, 20, 25, 30, 40, 50]);
  const rate = isDiscount ? -pct / 100 : pct / 100;
  const result = initial * (1 + rate);
  const narrator = '曹操';

  const story: BilingualText = isDiscount
    ? { zh: `采购军备原价 ${initial} 金，商家给予 ${pct}% 折扣。`, en: `Military supplies cost ${initial} gold, merchant offers ${pct}% discount.` }
    : { zh: `产粮 ${initial} 斛，加征 ${pct}% 粮税后总额多少？`, en: `Grain harvest ${initial}, with ${pct}% tax added, total?` };

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
    story,
    description,
    data: { ...template.data, initial, rate, years: 1, generatorType: 'PERCENTAGE_RANDOM' },
    tutorialSteps,
  };
}
