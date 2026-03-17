import type { Mission } from '../types';

type BilingualText = { zh: string; en: string };

type StoryTemplate = (a: number, x: number, result: number) => {
  story: BilingualText;
  title: BilingualText;
  tip: BilingualText;
  narrator: string;
};

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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
      highlightField: 'equation',
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
      highlightField: 'divide',
    },
    {
      text: {
        zh: `${narrator}：「所以 x = ${x}！」`,
        en: `${narrator}: "So x = ${x}!"`,
      },
      highlightField: 'answer',
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
