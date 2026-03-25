// Auto-extracted from generateMission.ts
import { pickRandom, randInt, signTerm, coeffStr, signCoeff, eqStr, linearExpr, safeRetry, getTier, gcdCalc, type Mission, type BilingualText, type DifficultyTier, type GeneratorFn } from './shared';

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
    { tex: `${a} \\times ${x} = ${result}`, annotation: { zh: `验算：代回原式 ✓`, en: `Verify: substitute back ✓` } },
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
    { tex: `${x} + ${a} = ${result}`, annotation: { zh: `验算：代回原式 ✓`, en: `Verify: substitute back ✓` } },
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
      text: {
        zh: `${narrator}：为什么要学两步方程？\n现实中的问题很少"一步到位"——"买 ${a} 件东西再付 ${b} 元运费，共花了 ${result} 元，每件多少钱？"\n两步方程就是帮你一层层拆开这种"包裹"的工具。\n\n学会两步方程，现实中大部分未知数都能求出来！`,
        en: `${narrator}: "Why learn two-step equations?\nReal problems rarely have one step — '${a} items plus ${b} yuan shipping = ${result} yuan total, how much per item?'\nTwo-step equations help you unwrap these layers.\n\nMaster this, and you can solve most real-world unknowns!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：两步方程 $${a}x + ${b} = ${result}$，$x$ 被包了两层！\n\n就像攻城——两道门：外门（$+${b}$）和内门（$\\times ${a}$）。先攻外门，再攻内门。`,
        en: `${narrator}: "Two-step equation $${a}x + ${b} = ${result}$, $x$ is double-wrapped!\n\nLike a siege — two gates: outer ($+${b}$) and inner ($\\times ${a}$). Break outer first, then inner."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：$x$ 被怎么包的？\n① $x$ 先被乘以 $${a}$ → $${a}x$（内层）\n② $${a}x$ 再加 $${b}$ → $${a}x + ${b}$（外层）\n\n解方程 = 反过来拆：先拆外层，再拆内层！`,
        en: `${narrator}: "How is $x$ wrapped?\n① $x$ multiplied by $${a}$ → $${a}x$ (inner)\n② $${a}x$ plus $${b}$ → $${a}x + ${b}$ (outer)\n\nSolving = reverse: outer first, then inner!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：第一步——攻外门：两边减 $${b}$\n$${a}x + ${b} - ${b} = ${result} - ${b}$\n$+${b}$ 和 $-${b}$ 互相抵消！\n$${a}x = ${step1Result}$\n\n外门攻破！只剩内门了。`,
        en: `${narrator}: "Step 1 — break outer gate: subtract $${b}$ from both sides\n$${a}x + ${b} - ${b} = ${result} - ${b}$\n$+${b}$ and $-${b}$ cancel!\n$${a}x = ${step1Result}$\n\nOuter gate broken! Only inner gate remains."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：第二步——攻内门：两边除以 $${a}$\n$\\frac{${a}x}{${a}} = \\frac{${step1Result}}{${a}}$\n$\\times ${a}$ 和 $\\div ${a}$ 抵消！\n$x = ${x}$\n\n城门全破！$x$ 解放了！`,
        en: `${narrator}: "Step 2 — break inner gate: divide both sides by $${a}$\n$\\frac{${a}x}{${a}} = \\frac{${step1Result}}{${a}}$\n$\\times ${a}$ and $\\div ${a}$ cancel!\n$x = ${x}$\n\nAll gates broken! $x$ is free!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：验算——把 $x = ${x}$ 代回去\n$${a} \\times ${x} + ${b} = ${a * x} + ${b} = ${result}$ ✓\n\n和右边一样！答案正确。`,
        en: `${narrator}: "Verify — substitute $x = ${x}$ back\n$${a} \\times ${x} + ${b} = ${a * x} + ${b} = ${result}$ ✓\n\nMatches the right side! Answer confirmed."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：口诀——从外到内，逐层击破！\n① 看清两层：外层（加减）+ 内层（乘除）\n② 先拆外层（反操作：加→减）\n③ 再拆内层（反操作：乘→除）\n④ 代回验算\n\n两步方程就这么简单，做得漂亮！`,
        en: `${narrator}: "Rule — outside in, layer by layer!\n① Identify two layers: outer (add/sub) + inner (mul/div)\n② Remove outer with reverse operation\n③ Remove inner with reverse operation\n④ Verify by substituting back\n\nTwo-step equations — that simple! Brilliantly done!"`,
      },
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
    zh: `展开 $${a}(${coeffStr(b, 'x')} + ${c})$，$x$ 的系数是多少？`,
    en: `Expand $${a}(${coeffStr(b, 'x')} + ${c})$. What is the coefficient of $x$?`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学展开括号？\n你想啊，你是军需官，要给 ${a} 支小队发装备。\n每队要 ${b} 把刀和 ${c} 张弓。\n那总共要多少？把每队的需求乘以队伍数——这就是"展开"！`,
        en: `${narrator}: "Why learn to expand brackets?\nThink about it — you're the quartermaster, supplying ${a} squads.\nEach squad needs ${b} swords and ${c} bows.\nHow many in total? Multiply each squad's needs by the number of squads — that's 'expanding'!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：展开的规则其实特别简单\n就一句话：外面的数要跟里面的**每一项**都乘一遍。\n就像发东西——每种物资都得发到，不能漏掉任何一项！\n\n$${a}(${coeffStr(b, 'x')} + ${c})$ = $${a} \\times ${coeffStr(b, 'x')}$ ＋ $${a} \\times ${c}$`,
        en: `${narrator}: "The rule for expanding is really simple\nOne sentence: the outside number multiplies EVERY term inside.\nLike handing out supplies — every type of gear gets distributed, nothing skipped!\n\n$${a}(${coeffStr(b, 'x')} + ${c})$ = $${a} \\times ${coeffStr(b, 'x')}$ + $${a} \\times ${c}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先算第一项\n外面的 $${a}$ 乘以里面的第一项 $${coeffStr(b, 'x')}$：\n$${a} \\times ${coeffStr(b, 'x')} = ${coeffStr(ab, 'x')}$\n\n就是说：${a} 支队 × 每队 ${b} 把刀 = ${ab} 把刀！`,
        en: `${narrator}: "Calculate the first term\nThe outside $${a}$ times the first inside term $${coeffStr(b, 'x')}$:\n$${a} \\times ${coeffStr(b, 'x')} = ${coeffStr(ab, 'x')}$\n\nThat means: ${a} squads × ${b} swords each = ${ab} swords!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：再算第二项\n外面的 $${a}$ 乘以里面的第二项 $${c}$：\n$${a} \\times ${c} = ${ac}$\n\n${a} 支队 × 每队 ${c} 张弓 = ${ac} 张弓！\n两项都算完了，你真棒！`,
        en: `${narrator}: "Now the second term\nThe outside $${a}$ times the second inside term $${c}$:\n$${a} \\times ${c} = ${ac}$\n\n${a} squads × ${c} bows each = ${ac} bows!\nBoth terms done — great job!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把两项拼起来就是答案\n$${a}(${coeffStr(b, 'x')} + ${c}) = ${coeffStr(ab, 'x')} + ${ac}$\n\n题目问 $x$ 的系数是多少？就是 $x$ 前面那个数：$${ab}$\n\n总共 ${ab} 把刀和 ${ac} 张弓，装备齐全！`,
        en: `${narrator}: "Put both terms together for the answer\n$${a}(${coeffStr(b, 'x')} + ${c}) = ${coeffStr(ab, 'x')} + ${ac}$\n\nThe question asks for the coefficient of $x$ — that's the number in front: $${ab}$\n\n${ab} swords and ${ac} bows — fully equipped!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——代个数检查一下\n让 $x = 1$，看两边是不是一样：\n左边：$${a}(${b} \\times 1 + ${c}) = ${a} \\times ${b + c} = ${a * (b + c)}$\n右边：$${ab} \\times 1 + ${ac} = ${ab + ac}$\n$${a * (b + c)} = ${ab + ac}$ ✓ 一模一样！\n\n军需发放零误差，完美！`,
        en: `${narrator}: "Verify — plug in a number to check\nLet $x = 1$, see if both sides match:\nLeft: $${a}(${b} \\times 1 + ${c}) = ${a} \\times ${b + c} = ${a * (b + c)}$\nRight: $${ab} \\times 1 + ${ac} = ${ab + ac}$\n$${a * (b + c)} = ${ab + ac}$ ✓ Exact match!\n\nZero errors in supply distribution — perfect!"`,
      },
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
  let p = pickRandom(pPools[tier]);
  let q = pickRandom(qPools[tier]);
  // Ensure gcd(p,q) === 1 so that `factor` is the true HCF of a and b
  const pqGcd = (a: number, b: number): number => { while (b) { [a, b] = [b, a % b]; } return a; };
  if (pqGcd(p, q) !== 1) return safeRetry(template, generateFactoriseMission);
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
      text: {
        zh: `${narrator}：因式分解是什么？其实就是"展开"的反操作\n展开是拆包裹：$${factor}(${coeffStr(p, 'x')} + ${q}) = ${a}x + ${b}$\n因式分解是重新打包：$${a}x + ${b} = ?(... + ...)$\n\n想象桌上散着 ${a} 把刀和 ${b} 张弓，你要把它们按"每队一份"重新打包。\n第一件事：找出每种东西的"公共份数"——也就是最大公因数！`,
        en: `${narrator}: "What is factorising? It's just the REVERSE of expanding!\nExpanding is unpacking: $${factor}(${coeffStr(p, 'x')} + ${q}) = ${a}x + ${b}$\nFactorising is re-packing: $${a}x + ${b} = ?(...+...)$\n\nImagine ${a} swords and ${b} bows scattered on the table — you need to re-pack them into squad bundles.\nFirst job: find how many squads they can split into equally — the highest common factor!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：找 $${a}$ 和 $${b}$ 的最大公因数\n$${a}$ 能被哪些数整除？${getFactorsStrLocal(a)}\n$${b}$ 能被哪些数整除？${getFactorsStrLocal(b)}\n\n两边都有的最大的数是几？是 $${factor}$！\n这就是它们的最大公因数。`,
        en: `${narrator}: "Find the HCF of $${a}$ and $${b}$\nWhat divides $${a}$ evenly? ${getFactorsStrLocal(a)}\nWhat divides $${b}$ evenly? ${getFactorsStrLocal(b)}\n\nThe biggest number in BOTH lists? It's $${factor}$!\nThat's their highest common factor."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：用最大公因数去除每一项\n$${a}x \\div ${factor} = ${coeffStr(p, 'x')}$（${a} 把刀分成 ${factor} 份，每份 ${p} 把）\n$${b} \\div ${factor} = ${q}$（${b} 张弓分成 ${factor} 份，每份 ${q} 张）\n\n看，分得刚刚好，没有剩余！`,
        en: `${narrator}: "Divide each term by the HCF\n$${a}x \\div ${factor} = ${coeffStr(p, 'x')}$ (${a} swords into ${factor} packs = ${p} each)\n$${b} \\div ${factor} = ${q}$ (${b} bows into ${factor} packs = ${q} each)\n\nSee — divides perfectly, nothing left over!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：拼起来就行了\n公因数放外面，除完的结果放括号里：\n$${a}x + ${b} = ${factor}(${coeffStr(p, 'x')} + ${q})$\n\n意思就是：${factor} 个包裹，每个包裹里 ${p} 把刀和 ${q} 张弓。`,
        en: `${narrator}: "Put it together\nHCF goes outside, the quotients go inside brackets:\n$${a}x + ${b} = ${factor}(${coeffStr(p, 'x')} + ${q})$\n\nMeaning: ${factor} packs, each containing ${p} swords and ${q} bows."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n提出来的公因数 = $${factor}$\n\n$${a}x + ${b} = ${factor}(${coeffStr(p, 'x')} + ${q})$\n做得好！因式分解就是"打包"，你学会了！`,
        en: `${narrator}: "Answer\nThe common factor = $${factor}$\n\n$${a}x + ${b} = ${factor}(${coeffStr(p, 'x')} + ${q})$\nWell done — factorising is just 're-packing', and you've got it!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——拆开检查\n把包裹拆开看看对不对：\n$${factor} \\times ${coeffStr(p, 'x')} = ${a}x$ ✓\n$${factor} \\times ${q} = ${b}$ ✓\n\n$${factor}(${coeffStr(p, 'x')} + ${q}) = ${a}x + ${b}$ ✓ 完全一致！\n军需打包零失误！`,
        en: `${narrator}: "Verify — unpack and check\nOpen the packs to see if they're right:\n$${factor} \\times ${coeffStr(p, 'x')} = ${a}x$ ✓\n$${factor} \\times ${q} = ${b}$ ✓\n\n$${factor}(${coeffStr(p, 'x')} + ${q}) = ${a}x + ${b}$ ✓ Perfect match!\nZero packing errors!"`,
      },
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
    expr = `${coeffStr(a, 'x')} + ${coeffStr(b, 'x')} + ${c}`;
    exprEn = expr;
  } else {
    expr = `${coeffStr(a, 'x')} + ${coeffStr(b, 'x')}`;
    exprEn = expr;
  }

  const simplified = c !== null ? `${coeffStr(answer, 'x')} + ${c}` : `${coeffStr(answer, 'x')}`;

  const description: BilingualText = {
    zh: `化简 $${expr}$，$x$ 的系数是多少？`,
    en: `Simplify $${expr}$. What is the coefficient of $x$?`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要化简？\n"3队骑兵加2队骑兵"太啰嗦——直接说"5队骑兵"更清楚！\n化简就是把数学式子也这样"合并同类"。`,
        en: `${narrator}: "Why simplify?\n'3 cavalry units plus 2 cavalry units' is wordy — just say '5 cavalry units'!\nSimplifying does the same for math expressions."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：什么是"同类项"？\n$3x + 2x$ 就像"3箱苹果 + 2箱苹果"——苹果一样，箱子可以合并！\n$3x + 2x = 5x$（5箱苹果）\n\n但 $3x + 2y$ 不能合并——苹果和橘子不能混！`,
        en: `${narrator}: "What are 'like terms'?\n$3x + 2x$ is like '3 boxes of apples + 2 boxes of apples' — same fruit, combine!\n$3x + 2x = 5x$ (5 boxes)\n\nBut $3x + 2y$ can't combine — apples and oranges don't mix!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${expr}$ 中哪些是同类项？\n✓ $${coeffStr(a, 'x')}$ 和 $${coeffStr(b, 'x')}$ 是同类项（都是 $x$）${c !== null ? `\n✗ $${coeffStr(a, 'x')}$ 和 $${c}$（常数）不是同类项——一个有 $x$ 一个没有` : ''}\n\n同类项 = 字母部分完全相同！`,
        en: `${narrator}: "Which terms in $${expr}$ are like terms?\n✓ $${coeffStr(a, 'x')}$ and $${coeffStr(b, 'x')}$ are like terms (both $x$)${c !== null ? `\n✗ $${coeffStr(a, 'x')}$ and $${c}$ (constant) are NOT like terms` : ''}\n\nLike terms = exact same letter part!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：合并！只加系数，字母不变\n$${coeffStr(a, 'x')} + ${coeffStr(b, 'x')} = (${a} + ${b})x = ${coeffStr(answer, 'x')}$\n\n系数相加：$${a} + ${b} = ${answer}$，字母 $x$ 照抄。${c !== null ? `\n$${c}$ 是常数项，保留不动。` : ''}`,
        en: `${narrator}: "Combine! Add coefficients, keep the letter\n$${coeffStr(a, 'x')} + ${coeffStr(b, 'x')} = (${a} + ${b})x = ${coeffStr(answer, 'x')}$\n\nCoefficients: $${a} + ${b} = ${answer}$, letter $x$ stays.${c !== null ? `\n$${c}$ is a constant — keep it separate.` : ''}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${expr} = ${simplified}$\n$x$ 的系数 = $${answer}$`,
        en: `${narrator}: "Answer\n$${expr} = ${simplified}$\nCoefficient of $x$ = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——代入 $x = 1$ 检查\n原式：$${a}(1) + ${b}(1)${c !== null ? ` + ${c}` : ''} = ${a + b + (c || 0)}$\n化简后：$${answer}(1)${c !== null ? ` + ${c}` : ''} = ${answer + (c || 0)}$\n\n$${a + b + (c || 0)} = ${answer + (c || 0)}$ ✓ 一致！做得漂亮！`,
        en: `${narrator}: "Verify — substitute $x = 1$\nOriginal: $${a}(1) + ${b}(1)${c !== null ? ` + ${c}` : ''} = ${a + b + (c || 0)}$\nSimplified: $${answer}(1)${c !== null ? ` + ${c}` : ''} = ${answer + (c || 0)}$\n\n$${a + b + (c || 0)} = ${answer + (c || 0)}$ ✓ Match! Brilliantly done!"`,
      },
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

  const opWordZh = op === '<' ? '小于' : '大于';
  const opWordEn = op === '<' ? 'less than' : 'greater than';
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：不等式和方程有什么不一样？\n方程用的是"$=$"（等号），答案只有一个数。\n不等式用的是"$${op}$"（${opWordZh}号），答案是一个**范围**。\n\n你可以想象城门有个限高杆——不是说刚好那个高度才能过，\n而是"${op === '<' ? '矮于这个高度的都能过' : '高于这个高度的才能过'}"。`,
        en: `${narrator}: "How is an inequality different from an equation?\nAn equation uses '$=$' (equals) — there's exactly one answer.\nAn inequality uses '$${op}$' (${opWordEn}) — the answer is a RANGE.\n\nImagine a height barrier at the gate — it's not about being exactly that height,\nit's about '${op === '<' ? 'anything shorter can pass' : 'only taller ones can pass'}'."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：好消息！解法跟方程**一模一样**\n$${a}x + ${b} ${op} ${c}$\n\n两边加减乘除同一个正数，不等号方向不变。\n（只有乘除负数才要翻方向，但这题不需要，放心！）\n跟解方程一样，把 $x$ 单独留在一边就行！`,
        en: `${narrator}: "Good news! The solving method is EXACTLY the same as equations\n$${a}x + ${b} ${op} ${c}$\n\nAdd, subtract, multiply, or divide both sides by the same positive number — the sign stays.\n(Only multiplying by a negative flips it, but we don't need that here — no worries!)\nJust get $x$ alone on one side!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先把多余的数搬走——两边减 $${b}$\n$${a}x + ${b} - ${b} ${op} ${c} - ${b}$\n$${a}x ${op} ${c - b}$\n\n看，$+${b}$ 和 $-${b}$ 互相抵消了，$x$ 这边更干净了！`,
        en: `${narrator}: "First, move the extra number — subtract $${b}$ from both sides\n$${a}x + ${b} - ${b} ${op} ${c} - ${b}$\n$${a}x ${op} ${c - b}$\n\nSee, $+${b}$ and $-${b}$ cancel out — $x$'s side is cleaner now!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：再除以 $${a}$，把 $x$ 完全解放出来\n$\\frac{${a}x}{${a}} ${op} \\frac{${c - b}}{${a}}$\n$x ${op} ${answerVal}$\n\n（$${a}$ 是正数，不等号方向不变 ✓）\n$x$ 找到了！`,
        en: `${narrator}: "Now divide by $${a}$ to free $x$ completely\n$\\frac{${a}x}{${a}} ${op} \\frac{${c - b}}{${a}}$\n$x ${op} ${answerVal}$\n\n($${a}$ is positive, so the sign doesn't flip ✓)\n$x$ found!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$x ${op} ${answerVal}$\n\n这个 $${answerVal}$ 就是分界线——${op === '<' ? '$x$ 只要比 ' + answerVal + ' 小就满足条件' : '$x$ 只要比 ' + answerVal + ' 大就满足条件'}。\n你做得很好！`,
        en: `${narrator}: "Answer\n$x ${op} ${answerVal}$\n\nThis $${answerVal}$ is the boundary — ${op === '<' ? '$x$ just needs to be less than ' + answerVal + ' to satisfy the condition' : '$x$ just needs to be greater than ' + answerVal + ' to satisfy the condition'}.\nGreat work!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: op === '<'
          ? `${narrator}：验算——试两个数看看\n试 $x = ${answerVal - 1}$（应该满足）：\n$${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$，$${a * (answerVal - 1) + b} < ${c}$ ✓ 对的！\n\n试 $x = ${answerVal + 1}$（应该不满足）：\n$${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$，$${a * (answerVal + 1) + b} < ${c}$ ✗ 果然不行！\n\n分界线验证通过，完美！`
          : `${narrator}：验算——试两个数看看\n试 $x = ${answerVal + 1}$（应该满足）：\n$${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$，$${a * (answerVal + 1) + b} > ${c}$ ✓ 对的！\n\n试 $x = ${answerVal - 1}$（应该不满足）：\n$${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$，$${a * (answerVal - 1) + b} > ${c}$ ✗ 果然不行！\n\n分界线验证通过，完美！`,
        en: op === '<'
          ? `${narrator}: "Verify — try two numbers\nTry $x = ${answerVal - 1}$ (should work):\n$${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$, $${a * (answerVal - 1) + b} < ${c}$ ✓ Correct!\n\nTry $x = ${answerVal + 1}$ (shouldn't work):\n$${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$, $${a * (answerVal + 1) + b} < ${c}$ ✗ Indeed not!\n\nBoundary verified — perfect!"`
          : `${narrator}: "Verify — try two numbers\nTry $x = ${answerVal + 1}$ (should work):\n$${a} \\times ${answerVal + 1} + ${b} = ${a * (answerVal + 1) + b}$, $${a * (answerVal + 1) + b} > ${c}$ ✓ Correct!\n\nTry $x = ${answerVal - 1}$ (shouldn't work):\n$${a} \\times ${answerVal - 1} + ${b} = ${a * (answerVal - 1) + b}$, $${a * (answerVal - 1) + b} > ${c}$ ✗ Indeed not!\n\nBoundary verified — perfect!"`,
      },
      highlightField: 'ans',
    },
  ];

  const story: BilingualText = {
    zh: `出征前条件必须满足！解不等式 $${a}x + ${b} ${op} ${c}$，找到 $x$ 的范围。`,
    en: `Before marching, the condition must hold! Solve $${a}x + ${b} ${op} ${c}$ to find the range of $x$.`,
  };
  return {
    ...template,
    story,
    description,
    data: { a, b, c, op, answer, generatorType: 'INEQUALITY_RANDOM' },
    tutorialSteps,
  };
}

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
      text: {
        zh: `${narrator}：为什么要学代入？\n军师用密码传令：公式是 $${expr}$，暗号 $x = ${x}$。\n把 $x$ 代入公式，就能解读指令！\n\n公式像一台机器——放入不同的 $x$，吐出不同的答案。`,
        en: `${narrator}: "Why learn substitution?\nThe strategist sends coded orders: formula is $${expr}$, code $x = ${x}$.\nSubstitute $x$ to decode the instruction!\n\nA formula is like a machine — different $x$, different output."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先搞懂——$${a}x^2$ 是什么意思？\n$x^2$ = $x$ 的平方 = $x \\times x$\n$${a}x^2$ = $${a} \\times x \\times x$\n\n**注意**：$${a}x^2$ 不是 $(${a}x)^2$！只有 $x$ 要平方，$${a}$ 不用。`,
        en: `${narrator}: "First — what does $${a}x^2$ mean?\n$x^2$ = $x$ squared = $x \\times x$\n$${a}x^2$ = $${a} \\times x \\times x$\n\n**Note**: $${a}x^2$ is NOT $(${a}x)^2$! Only $x$ gets squared, not $${a}$."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——代入 $x = ${x}$，先算平方\n$x^2 = ${x}^2 = ${x} \\times ${x} = ${x*x}$\n\n平方就是自己乘自己——之前学过的！`,
        en: `${narrator}: "Step 1 — substitute $x = ${x}$, square first\n$x^2 = ${x}^2 = ${x} \\times ${x} = ${x*x}$\n\nSquaring means times itself — we learned this before!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——乘以系数 $${a}$\n$${a} \\times ${x*x} = ${a*x*x}$\n\n先幂后乘——运算顺序别忘了！`,
        en: `${narrator}: "Step 2 — multiply by coefficient $${a}$\n$${a} \\times ${x*x} = ${a*x*x}$\n\nPowers first, then multiply — remember the order!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第三步—— ${bStrCalc} $${bAbs}$\n$${a*x*x} ${bStr} = ${answer}$\n\n答案 = $${answer}$`,
        en: `${narrator}: "Step 3 — ${bStrCalc} $${bAbs}$\n$${a*x*x} ${bStr} = ${answer}$\n\nAnswer = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——完整回顾\n运算顺序：幂 → 乘除 → 加减\n\n① 平方：$${x}^2 = ${x*x}$\n② 乘系数：$${a} \\times ${x*x} = ${a*x*x}$\n③ 加减：$${a*x*x} ${bStr} = ${answer}$ ✓\n\n密码解读成功，做得漂亮！`,
        en: `${narrator}: "Verify — full review\nOrder: Powers → Multiply → Add/Sub\n\n① Square: $${x}^2 = ${x*x}$\n② Multiply: $${a} \\times ${x*x} = ${a*x*x}$\n③ Add/Sub: $${a*x*x} ${bStr} = ${answer}$ ✓\n\nCode decoded — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：为什么要学代入？\n军师传令用密码：公式 $${expr}$，暗号 $x = ${x}$。\n把 $x$ 代进去就能解密！\n\n公式像一台机器——放入不同的数，吐出不同的答案。`,
        en: `${narrator}: "Why learn substitution?\nThe strategist's coded message: formula $${expr}$, code $x = ${x}$.\nSubstitute $x$ to decode!\n\nA formula is a machine — different input, different output."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先搞懂——$${a}x$ 是什么意思？\n$${a}x$ = $${a} \\times x$（${a} 乘以 $x$）。\n字母前面的数字叫"系数"，$${a}x$ 的系数就是 $${a}$。\n\n**注意**：$${a}x$ 是乘法，不是 $${a} + x$！`,
        en: `${narrator}: "First — what does $${a}x$ mean?\n$${a}x$ = $${a} \\times x$ (${a} times $x$).\nThe number in front is the 'coefficient' — $${a}x$ has coefficient $${a}$.\n\n**Note**: $${a}x$ is multiplication, NOT $${a} + x$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：代入！把 $x$ 换成 $${x}$\n$${a}x ${bStr}$\n→ $${a} \\times ${x} ${bStr}$\n\n所有的 $x$ 都换成 $${x}$，其他不动。`,
        en: `${narrator}: "Substitute! Replace $x$ with $${x}$\n$${a}x ${bStr}$\n→ $${a} \\times ${x} ${bStr}$\n\nReplace every $x$ with $${x}$, keep everything else."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先算乘法\n$${a} \\times ${x} = ${a*x}$\n\n先乘除，后加减——运算顺序是铁律！`,
        en: `${narrator}: "Multiply first\n$${a} \\times ${x} = ${a*x}$\n\nMultiply before add/subtract — order of operations is law!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：再算加减\n$${a*x} ${bStr} = ${answer}$\n\n答案 = $${answer}$`,
        en: `${narrator}: "Then add/subtract\n$${a*x} ${bStr} = ${answer}$\n\nAnswer = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n$${a} \\times ${x} ${bStr} = ${a*x} ${bStr} = ${answer}$ ✓\n\n完整步骤：看清式子 → 代入 $x$ → 先乘 → 后加减。\n密码解读成功，做得漂亮！`,
        en: `${narrator}: "Verify\n$${a} \\times ${x} ${bStr} = ${a*x} ${bStr} = ${answer}$ ✓\n\nFull process: read expression → substitute $x$ → multiply first → add/sub last.\nCode decoded — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ];

  const story: BilingualText = {
    zh: `军师密令：代入 $x = ${x}$，计算 $${expr}$ 的值。`,
    en: `Strategist's coded order: substitute $x = ${x}$ to find the value of $${expr}$.`,
  };
  return {
    ...template,
    story,
    description,
    data: { a, b, x, answer, mode, expr, generatorType: 'SUBSTITUTION_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PERIMETER (rectangle) generator
   ══════════════════════════════════════════════════════════ */

export function generateLinearMission(template: Mission): Mission {
  const tier = getTier();
  const mPools = { 1: [1, 2, -1, -2], 2: [1, 2, 3, -1, -2, -3], 3: [-4, -3, -2, 2, 3, 4, 5] };
  const cPools = { 1: [0, 1, 2, 3, -1], 2: [-5, -3, -1, 0, 1, 3, 5], 3: [-8, -5, -3, 3, 5, 7, 10] };
  const m = pickRandom(mPools[tier]);
  const c = pickRandom(cPools[tier]);
  const x1 = pickRandom([-2, -1, 0, 1, 2, 3]);
  const x2 = x1 + pickRandom([1, 2, 3]); // guarantees x2 > x1 (no division by zero)
  if (x2 === x1) return safeRetry(template, generateLinearMission); // defensive guard
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
    {
      text: {
        zh: `${narrator}：为什么要学直线方程？\n你看，行军路线、粮草涨价、人口增长——很多东西的变化都是"匀速"的。\n直线方程 $y = mx + c$ 就是用来描述这种"匀速变化"的万能工具。\n学会了它，就能预测未来的趋势！`,
        en: `${narrator}: "Why learn the equation of a line?\nThink about it — march routes, rising grain prices, population growth — many things change at a steady rate.\nThe line equation $y = mx + c$ is the universal tool for describing this 'steady change'.\nLearn it, and you can predict future trends!"`,
      },
      highlightField: 'm',
    },
    {
      text: {
        zh: `${narrator}：什么是斜率 $m$？\n你走上坡路——坡越陡，走一步横向距离上升越多，对吧？\n斜率就是衡量"陡不陡"的数：\n$$m = \\frac{\\text{上升了多少}}{\\text{往前走了多少}} = \\frac{y \\text{ 的变化}}{x \\text{ 的变化}}$$\n正数 = 上坡，负数 = 下坡，零 = 平路。`,
        en: `${narrator}: "What is slope $m$?\nImagine walking uphill — the steeper it is, the more you rise for each step forward, right?\nSlope measures exactly this 'steepness':\n$$m = \\frac{\\text{rise}}{\\text{run}} = \\frac{\\text{change in } y}{\\text{change in } x}$$\nPositive = uphill, negative = downhill, zero = flat."`,
      },
      highlightField: 'm',
    },
    {
      text: {
        zh: `${narrator}：从题目找出两个点\n题目给了我们两个坐标：\n点 A = $(${x1}, ${y1})$ → $x_1 = ${x1}$，$y_1 = ${y1}$\n点 B = $(${x2}, ${y2})$ → $x_2 = ${x2}$，$y_2 = ${y2}$\n\n有了两个点，斜率就能算出来！`,
        en: `${narrator}: "Find the two points from the problem\nWe're given two coordinates:\nPoint A = $(${x1}, ${y1})$ → $x_1 = ${x1}$, $y_1 = ${y1}$\nPoint B = $(${x2}, ${y2})$ → $x_2 = ${x2}$, $y_2 = ${y2}$\n\nWith two points, we can calculate the slope!"`,
      },
      highlightField: 'm',
    },
    {
      text: {
        zh: `${narrator}：算斜率，一步步来\n上升了多少？$y_2 - y_1 = ${y2} - (${y1}) = ${y2 - y1}$\n往前走了多少？$x_2 - x_1 = ${x2} - (${x1}) = ${x2 - x1}$\n\n斜率 $m = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$\n\n${m > 0 ? '正数，说明是上坡趋势！' : m < 0 ? '负数，说明是下坡趋势！' : '零，说明是平路！'}`,
        en: `${narrator}: "Calculate slope step by step\nRise: $y_2 - y_1 = ${y2} - (${y1}) = ${y2 - y1}$\nRun: $x_2 - x_1 = ${x2} - (${x1}) = ${x2 - x1}$\n\nSlope $m = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$\n\n${m > 0 ? 'Positive — uphill trend!' : m < 0 ? 'Negative — downhill trend!' : 'Zero — flat!'}"`,
      },
      highlightField: 'm',
    },
    {
      text: {
        zh: `${narrator}：什么是截距 $c$？\n$c$ 就是"起点"——当 $x = 0$ 的时候，$y$ 是多少。\n想象一条路从原点出发，$c$ 就是出发点的高度。\n\n现在 $m$ 已经知道了，只剩 $c$ 要找。用一个已知的点就能算出来！`,
        en: `${narrator}: "What is intercept $c$?\n$c$ is the 'starting point' — when $x = 0$, what is $y$?\nImagine a road from the origin, $c$ is the starting height.\n\nWe already know $m$, only $c$ is left. We can find it using any known point!"`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：把点 A 代入方程求 $c$\n$y = mx + c$ 里，把 $m = ${m}$，$x = ${x1}$，$y = ${y1}$ 代进去：\n$${y1} = ${m} \\times (${x1}) + c$\n$${y1} = ${mTimesX1} + c$\n$c = ${cExpr} = ${c}$\n\n$c$ 也找到了！你做得太好了！`,
        en: `${narrator}: "Substitute point A into the equation to find $c$\nIn $y = mx + c$, put $m = ${m}$, $x = ${x1}$, $y = ${y1}$:\n$${y1} = ${m} \\times (${x1}) + c$\n$${y1} = ${mTimesX1} + c$\n$c = ${cExpr} = ${c}$\n\n$c$ found too! You're doing brilliantly!"`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：答案\n$$y = ${linearExpr(m, c)}$$\n这就是这条直线的方程！有了它，给任何 $x$ 都能算出对应的 $y$。`,
        en: `${narrator}: "Answer\n$$y = ${linearExpr(m, c)}$$\nThis is the equation of the line! With it, give any $x$ and you can find the matching $y$."`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：验算——用点 B 检查\n把 B$(${x2}, ${y2})$ 代回方程：\n$y = ${m} \\times (${x2}) ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ${m * x2} ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ${y2}$ ✓\n和点 B 的 $y$ 坐标一致！\n\n恭喜！直线方程学会了，未来的趋势你说了算！`,
        en: `${narrator}: "Verify — check with point B\nSubstitute B$(${x2}, ${y2})$ back:\n$y = ${m} \\times (${x2}) ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ${m * x2} ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ${y2}$ ✓\nMatches point B's $y$ coordinate!\n\nCongratulations! You've mastered line equations — you're the one predicting the trends now!"`,
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
    if (vertexX !== Math.round(vertexX)) return safeRetry(template, generateQuadraticMission);
    const vertexY = a * vertexX * vertexX + b * vertexX;

    const description: BilingualText = {
      zh: `求 $f(x)$ 达到最大值时的 $x$。`,
      en: `Find $x$ where $f(x)$ is maximum.`,
    };
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学二次函数？\n想象投石车——石头飞出去的轨迹就是抛物线！\n$f(x) = ax^2 + bx + c$ 描述了这种曲线。\n找到"顶点"= 找到石头飞得最高/最远的那个点——这就是战场上的关键信息！`,
          en: `${narrator}: "Why learn quadratics?\nImagine a catapult — the stone's path is a parabola!\n$f(x) = ax^2 + bx + c$ describes this curve.\nFinding the vertex = finding the highest/farthest point — crucial battlefield intelligence!"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：抛物线的顶点——曲线的最高/最低点\n顶点公式：$x = \\frac{-b}{2a}$`,
          en: `${narrator}: "The vertex — highest or lowest point on the curve\nVertex formula: $x = \\frac{-b}{2a}$"`,
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
          zh: `${narrator}：答案\n$x = ${vertexX}$\n顶点在 $x = ${vertexX}$ 处，此时 $f(${vertexX}) = ${vertexY}$`,
          en: `${narrator}: "Answer\n$x = ${vertexX}$\nThe vertex is at $x = ${vertexX}$, where $f(${vertexX}) = ${vertexY}$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：验算\n代入 $x = ${vertexX}$：$f(${vertexX}) = ${a} \\times ${vertexX}^2 + ${b} \\times ${vertexX} = ${a * vertexX * vertexX} + ${b * vertexX} = ${vertexY}$ ✓\n顶点位置确认！`,
          en: `${narrator}: "Verify\nSubstitute $x = ${vertexX}$: $f(${vertexX}) = ${a} \\times ${vertexX}^2 + ${b} \\times ${vertexX} = ${a * vertexX * vertexX} + ${b * vertexX} = ${vertexY}$ ✓\nVertex confirmed!"`,
        },
        highlightField: 'x',
      },
    ];
    const story: BilingualText = {
      zh: `最优化策略：目标函数 $f(x) = ${a}x^2 ${signCoeff(b, 'x')}$。求最大值时的 $x$。`,
      en: `Optimize strategy: function $f(x) = ${a}x^2 ${signCoeff(b, 'x')}$. Find $x$ for maximum.`,
    };
    return { ...template, story, description, data: { p1: [0, 0], p2: [vertexX, vertexY], generatorType: 'QUADRATIC_RANDOM' }, tutorialSteps };
  }

  // Functions mode: y = ax² + c, p1=[0,c], p2=[x2, a*x2²+c]. Student finds a and c.
  const funcAPools = { 1: [-1, 1], 2: [-3, -2, -1, 1, 2, 3], 3: [-3, -2, 2, 3, 4] };
  const funcCPools = { 1: [0, 1, 2], 2: [-5, -3, 0, 3, 5, 10], 3: [-10, -5, 5, 10] };
  const a = pickRandom(funcAPools[tier]);
  const c = pickRandom(funcCPools[tier]);
  const x2 = pickRandom([1, 2, 3, 4, 5]);
  const y2 = a * x2 * x2 + c;

  const description: BilingualText = {
    zh: `抛物线经过 $A(${0}, ${c})$ 和 $B(${x2}, ${y2})$，求 $a$ 和 $c$。`,
    en: `Parabola through $A(${0}, ${c})$ and $B(${x2}, ${y2})$ — find $a$ and $c$.`,
  };
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学求二次函数系数？\n想象你看到敌军投石车的石头轨迹——知道两个落点，就能推出整条抛物线，预测下一颗石头落哪！\n已知两个点 → 列两个方程 → 解出 $a$ 和 $c$，这就是"逆向工程"。`,
        en: `${narrator}: "Why learn to find quadratic coefficients?\nImagine tracing enemy catapult stones — knowing two landing points, you can deduce the full parabola and predict the next impact!\nTwo points → two equations → solve for $a$ and $c$ — that's reverse engineering."`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：抛物线 $y = ax^{2} + c$ 经过两个点，我们要求出系数 $a$ 和 $c$`,
        en: `${narrator}: "The parabola $y = ax^{2} + c$ passes through two points — we need to find coefficients $a$ and $c$"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：代入第一个点 $(0, ${c})$\n$y = a \\times 0^{2} + c = c$，所以 $c = ${c}$\n（$x=0$ 时 $a$ 项消失，只剩 $c$！）`,
        en: `${narrator}: "Substitute first point $(0, ${c})$\n$y = a \\times 0^{2} + c = c$, so $c = ${c}$\n(When $x=0$, the $a$ term vanishes — only $c$ remains!)"`,
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
        zh: `${narrator}：$${y2} = a \\times ${x2}^{2} ${signTerm(c)}$，解出 $a$`,
        en: `${narrator}: "$${y2} = a \\times ${x2}^{2} ${signTerm(c)}$, solve for $a$"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：$a = \\frac{${y2} ${signTerm(-c)}}{${x2}^{2}} = \\frac{${y2 - c}}{${x2 * x2}} = ${a}$`,
        en: `${narrator}: "$a = \\frac{${y2} ${signTerm(-c)}}{${x2}^{2}} = \\frac{${y2 - c}}{${x2 * x2}} = ${a}$"`,
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
    {
      text: {
        zh: `${narrator}：验算——代点 B 回方程\n$y = ${a} \\times ${x2}^2 + ${c} = ${a * x2 * x2 + c}$\n$= ${y2}$ ✓ 和点 B 的 y 坐标一致！`,
        en: `${narrator}: "Verify — substitute point B back into the equation\n$y = ${a} \\times ${x2}^2 + ${c} = ${a * x2 * x2 + c}$\n$= ${y2}$ ✓ Matches point B's y-coordinate!"`,
      },
      highlightField: 'c',
    },
  ];
  const story: BilingualText = {
    zh: `抛物线 $y = ax^2 ${signTerm(c)}$ 经过点 $A(0,\\ ${c})$ 和 $B(${x2},\\ ${y2})$，求系数 $a$ 和 $c$。`,
    en: `Parabola $y = ax^2 ${signTerm(c)}$ passes through $A(0,\\ ${c})$ and $B(${x2},\\ ${y2})$ — find $a$ and $c$.`,
  };
  return { ...template, story, description, data: { p1: [0, c], p2: [x2, y2], generatorType: 'QUADRATIC_RANDOM' }, tutorialSteps };
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

  const quadDisplay = `x^2 ${signCoeff(b, 'x')} ${signTerm(c)} = 0`;
  const description: BilingualText = {
    zh: `求方程 $${quadDisplay}$ 的一个根。`,
    en: `Find a root of $${quadDisplay}$.`,
  };
  const quadEqStr = `x^{2} ${signCoeff(b, 'x')} ${signTerm(c)} = 0`;
  const factorStr = `(x ${r1 >= 0 ? '-' : '+'}${Math.abs(r1)})(x ${r2 >= 0 ? '-' : '+'}${Math.abs(r2)}) = 0`;
  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要"求根"？\n投石车发射后，石头什么时候落地？就是找抛物线和地面的交点——让 $y=0$ 的那个 $x$ 值！\n求根 = 找到让方程等于零的 $x$。`, en: `${narrator}: "Why do we 'find roots'?\nWhen a catapult launches a boulder, when does it hit the ground? That's finding where the parabola meets the ground — the $x$ value that makes $y=0$!\nFinding roots = finding the $x$ that makes the equation equal zero."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：方程是：\n$${quadEqStr}$`, en: `${narrator}: "The equation is:\n$${quadEqStr}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：方法：因式分解\n把方程写成 $(x - r_1)(x - r_2) = 0$ 的形式。\n我们需要两个数，乘积 = $${c}$，相加 = $${-b}$。`, en: `${narrator}: "Method: factorize\nWrite the equation as $(x - r_1)(x - r_2) = 0$.\nWe need two numbers that multiply to give $${c}$ and add to give $${-b}$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：这两个数是 $${r1}$ 和 $${r2}$：\n验证：$(${r1}) \\times (${r2}) = ${r1 * r2}$ (= $${c}$)\n验证：$(${r1}) + (${r2}) = ${r1 + r2}$ (= $${-b}$)`, en: `${narrator}: "The two numbers are $${r1}$ and $${r2}$:\nCheck: $(${r1}) \\times (${r2}) = ${r1 * r2}$ (= $${c}$)\nCheck: $(${r1}) + (${r2}) = ${r1 + r2}$ (= $${-b}$)"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：所以 $${factorStr}$\n意味着 $x = ${r1}$ 或 $x = ${r2}$`, en: `${narrator}: "So $${factorStr}$\nThis means $x = ${r1}$ or $x = ${r2}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案：$x = ${r1}$ 或 $x = ${r2}$!`, en: `${narrator}: "Answer: $x = ${r1}$ or $x = ${r2}$!"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：验算——代根回原方程 ✓\n把 $x = ${r1}$ 代入：$(${r1})^2 ${signCoeff(b, '')}(${r1}) ${signTerm(c)} = ${r1*r1 + b*r1 + c}$ ✓\n把 $x = ${r2}$ 代入：$(${r2})^2 ${signCoeff(b, '')}(${r2}) ${signTerm(c)} = ${r2*r2 + b*r2 + c}$ ✓\n两个都等于 0，验证通过！`, en: `${narrator}: "Verify — substitute roots back ✓\nPut $x = ${r1}$: $(${r1})^2 ${signCoeff(b, '')}(${r1}) ${signTerm(c)} = ${r1*r1 + b*r1 + c}$ ✓\nPut $x = ${r2}$: $(${r2})^2 ${signCoeff(b, '')}(${r2}) ${signTerm(c)} = ${r2*r2 + b*r2 + c}$ ✓\nBoth equal 0 — verified!"` }, highlightField: 'x' },
  ];
  const quadEqOnly = `x^2 ${signCoeff(b, 'x')} ${signTerm(c)}`;
  const story: BilingualText = {
    zh: `投石轨迹 $y = ${quadEqOnly}$，令 $y = 0$ 求落地点——求方程 $${quadDisplay}$ 的根。`,
    en: `Catapult trajectory $y = ${quadEqOnly}$. Set $y = 0$ to find landing — solve $${quadDisplay}$.`,
  };
  return { ...template, story, description, data: { a, b, c, generatorType: 'ROOTS_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   DERIVATIVE generator
   func='3x^2-3': critical point → input x (data.x)
   default (x^2): slope at point → input k = 2*data.x
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
  if (det === 0) return safeRetry(template, generateSimultaneousMission); // retry

  const narrator = pickRandom(['周瑜', '诸葛亮']);
  const eq1Display = eqStr(a1, b1, c1);
  const eq2Display = eqStr(a2, b2, c2);
  const description: BilingualText = {
    zh: `解联立方程：$${eq1Display}$，$${eq2Display}$`,
    en: `Solve: $${eq1Display}$, $${eq2Display}$`,
  };

  // Compute elimination intermediate values for tutorial
  // Use sign-aware multipliers so b-coefficients cancel (same sign → subtract, diff sign → add)
  const sameSignB = (b1 > 0 && b2 > 0) || (b1 < 0 && b2 < 0);
  const elimMul1 = Math.abs(b2);
  const elimMul2 = Math.abs(b1);
  const newA1 = a1 * elimMul1;
  const newB1 = b1 * elimMul1;
  const newC1 = c1 * elimMul1;
  const newA2 = a2 * elimMul2;
  const newB2 = b2 * elimMul2;
  const newC2 = c2 * elimMul2;
  // When b1,b2 same sign: subtract to cancel; when opposite sign: add to cancel
  const elimA = sameSignB ? newA1 - newA2 : newA1 + newA2;
  const elimC = sameSignB ? newC1 - newC2 : newC1 + newC2;
  // Safety: if elimA is still 0 after sign-aware elimination, retry
  if (elimA === 0) return safeRetry(template, generateSimultaneousMission);

  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么需要两个方程？\n一个未知数用一个方程就够，但两个未知数——比如粮草和兵力——必须两个条件才能定位答案！\n联立方程 = 用两个条件锁定两个未知数。`, en: `${narrator}: "Why do we need two equations?\nOne unknown needs just one equation, but two unknowns — like grain supply and troop count — require two conditions to pin down the answer!\nSimultaneous equations = using two conditions to lock in two unknowns."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：写出两个方程：\n方程1: $${eq1Display}$\n方程2: $${eq2Display}$`, en: `${narrator}: "Write the two equations:\nEq1: $${eq1Display}$\nEq2: $${eq2Display}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：目标：让一个变量的系数相同，这样就能消去它。\n我们选择消去 $y$。`, en: `${narrator}: "Goal: make the coefficient of one variable the same in both equations, so we can eliminate it.\nLet's eliminate $y$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：方程1 乘以 $${elimMul1}$: $${eqStr(newA1, newB1, newC1)}$\n方程2 乘以 $${elimMul2}$: $${eqStr(newA2, newB2, newC2)}$`, en: `${narrator}: "Multiply Eq1 by $${elimMul1}$: $${eqStr(newA1, newB1, newC1)}$\nMultiply Eq2 by $${elimMul2}$: $${eqStr(newA2, newB2, newC2)}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：两式${sameSignB ? '相减' : '相加'}，$y$ 消去：\n$${coeffStr(elimA, 'x')} = ${elimC}$\n$x = ${elimC} \\div ${elimA} = ${x}$`, en: `${narrator}: "${sameSignB ? 'Subtract' : 'Add'} the equations, $y$ disappears:\n$${coeffStr(elimA, 'x')} = ${elimC}$\n$x = ${elimC} \\div ${elimA} = ${x}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：把 $x = ${x}$ 代回方程1：\n$${a1} \\times (${x}) ${signCoeff(b1, 'y')} = ${c1}$\n$${coeffStr(b1, 'y')} = ${c1 - a1 * x}$\n$y = ${y}$`, en: `${narrator}: "Substitute $x = ${x}$ back into Eq1:\n$${a1} \\times (${x}) ${signCoeff(b1, 'y')} = ${c1}$\n$${coeffStr(b1, 'y')} = ${c1 - a1 * x}$\n$y = ${y}$"` }, highlightField: 'y' },
    { text: { zh: `${narrator}：答案：$x = ${x}$，$y = ${y}$!`, en: `${narrator}: "Answer: $x = ${x}$, $y = ${y}$!"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：验算——把 $x = ${x}$，$y = ${y}$ 代回两个方程 ✓\n方程1：$${a1}(${x}) ${signCoeff(b1, '')}(${y}) = ${a1*x + b1*y}$ = $${c1}$ ✓\n方程2：$${a2}(${x}) ${signCoeff(b2, '')}(${y}) = ${a2*x + b2*y}$ = $${c2}$ ✓\n两个方程都成立，验证通过！`, en: `${narrator}: "Verify — substitute $x = ${x}$, $y = ${y}$ back into both equations ✓\nEq1: $${a1}(${x}) ${signCoeff(b1, '')}(${y}) = ${a1*x + b1*y}$ = $${c1}$ ✓\nEq2: $${a2}(${x}) ${signCoeff(b2, '')}(${y}) = ${a2*x + b2*y}$ = $${c2}$ ✓\nBoth equations hold — verified!"` }, highlightField: 'x' },
  ];

  const story: BilingualText = {
    zh: `两军军费联立方程：$${eq1Display}$，$${eq2Display}$。求各项开支 $x$ 和 $y$。`,
    en: `Military budget system: $${eq1Display}$, $${eq2Display}$. Find expenditures $x$ and $y$.`,
  };
  return {
    ...template,
    story,
    description,
    data: { eq1: [a1, b1, c1], eq2: [a2, b2, c2], x, y, generatorType: 'SIMULTANEOUS_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   RATIO generator: a:b = x:y, given one value find the other
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
  if (combinedCoeff === 0) return safeRetry(template, generateSimultaneousY8Mission);

  const eq1Zh = `$y = ${linearExpr(a, b)}$`;
  const eq1En = eq1Zh;
  const eq2Zh = `$${coeffStr(c, 'x')} ${signCoeff(d, 'y')} = ${e}$`;
  const eq2En = eq2Zh;

  const description: BilingualText = {
    zh: `用代入法解联立方程：${eq1Zh}，${eq2Zh}`,
    en: `Solve by substitution: ${eq1En}, ${eq2En}`,
  };

  // Build sign display helpers
  const bSign = b >= 0 ? '+ ' + b : '- ' + Math.abs(b);
  const constSign = constant >= 0 ? '+ ' + constant : '- ' + Math.abs(constant);
  const aDisplay = a === 1 ? '' : a === -1 ? '-' : String(a);

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要联立方程？\n想象两支军队要在某个地点会合。第一支走的是一条路（方程1），第二支走另一条路（方程2）。\n只有找到**两条路的交叉点**，才知道在哪里碰头。\n联立方程就是找这个交叉点的方法！`,
        en: `${narrator}: "Why do we need simultaneous equations?\nImagine two armies meeting at a point. The first takes one road (Equation 1), the second another (Equation 2).\nOnly by finding where the two roads CROSS can we know the meeting point.\nSimultaneous equations are the method for finding that crossing!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：我们有两个方程：\n方程1：${eq1Zh}\n方程2：${eq2Zh}\n\n注意方程1已经告诉我们 $y$ 等于什么了——这是代入法的关键起点！`,
        en: `${narrator}: "We have two equations:\nEquation 1: ${eq1En}\nEquation 2: ${eq2En}\n\nNotice Equation 1 already tells us what $y$ equals — this is the key starting point for substitution!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：什么是"代入"？\n很简单：方程1说 $y = ${aDisplay}x ${bSign}$\n我们把这个整体"塞"进方程2里，**替换掉方程2里的 $y$**。\n就像在句子里用具体描述替换一个代号。\n别紧张，跟着我一步步来！`,
        en: `${narrator}: "What is 'substitution'?\nSimple: Equation 1 says $y = ${aDisplay}x ${bSign}$\nWe take this whole expression and 'plug it in' to Equation 2, REPLACING the $y$ there.\nIt's like replacing a codename with its actual description in a sentence.\nDon't worry — follow me step by step!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：执行代入\n方程2原来是 ${eq2Zh}\n用 $(${aDisplay}x ${bSign})$ 替换 $y$：\n$$${coeffStr(c, 'x')} + ${coeffStr(d, '')}(${aDisplay}x ${bSign}) = ${e}$$\n现在方程里只剩 $x$ 一个未知数了！`,
        en: `${narrator}: "Do the substitution\nEquation 2 was ${eq2En}\nReplace $y$ with $(${aDisplay}x ${bSign})$:\n$$${coeffStr(c, 'x')} + ${coeffStr(d, '')}(${aDisplay}x ${bSign}) = ${e}$$\nNow there's only ONE unknown — $x$!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：展开括号\n$${coeffStr(d, '')} \\times ${aDisplay}x = ${coeffStr(d * a, 'x')}$\n$${coeffStr(d, '')} \\times (${bSign.replace('+ ', '').replace('- ', '-')}) = ${constant}$\n\n展开后得到：$${coeffStr(c, 'x')} ${signCoeff(d * a, 'x')} ${constSign} = ${e}$\n合并 $x$ 的项：$${coeffStr(combinedCoeff, 'x')} ${constSign} = ${e}$`,
        en: `${narrator}: "Expand the brackets\n$${coeffStr(d, '')} \\times ${aDisplay}x = ${coeffStr(d * a, 'x')}$\n$${coeffStr(d, '')} \\times (${bSign.replace('+ ', '').replace('- ', '-')}) = ${constant}$\n\nAfter expanding: $${coeffStr(c, 'x')} ${signCoeff(d * a, 'x')} ${constSign} = ${e}$\nCombine the $x$ terms: $${coeffStr(combinedCoeff, 'x')} ${constSign} = ${e}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：解出 $x$\n$${coeffStr(combinedCoeff, 'x')} ${constSign} = ${e}$\n移项：$${coeffStr(combinedCoeff, 'x')} = ${e} ${signTerm(-constant)} = ${e - constant}$\n除以系数：$x = \\frac{${e - constant}}{${combinedCoeff}} = ${x}$\n\n$x$ 找到了！你做得太好了！`,
        en: `${narrator}: "Solve for $x$\n$${coeffStr(combinedCoeff, 'x')} ${constSign} = ${e}$\nRearrange: $${coeffStr(combinedCoeff, 'x')} = ${e} ${signTerm(-constant)} = ${e - constant}$\nDivide: $x = \\frac{${e - constant}}{${combinedCoeff}} = ${x}$\n\n$x$ found! You're doing brilliantly!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：代回求 $y$\n把 $x = ${x}$ 代回方程1：\n$y = ${aDisplay} \\times ${x} ${bSign}$\n$y = ${a * x} ${bSign}$\n$y = ${y}$`,
        en: `${narrator}: "Substitute back to find $y$\nPut $x = ${x}$ back into Equation 1:\n$y = ${aDisplay} \\times ${x} ${bSign}$\n$y = ${a * x} ${bSign}$\n$y = ${y}$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：答案\n$$x = ${x}, \\quad y = ${y}$$\n这就是两条路的交叉点——两军的会合点！`,
        en: `${narrator}: "Answer\n$$x = ${x}, \\quad y = ${y}$$\nThis is where the two roads cross — the armies' meeting point!"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：验算——把答案代回方程2检查：\n$${c} \\times (${x}) + ${d} \\times (${y})$\n$= ${c * x} ${signTerm(d * y)}$\n$= ${e}$ ✓ 和方程2右边一致！\n\n恭喜你！代入法的每一步你都跟上了，非常出色！`,
        en: `${narrator}: "Verify — plug the answer back into Equation 2:\n$${c} \\times (${x}) + ${d} \\times (${y})$\n$= ${c * x} ${signTerm(d * y)}$\n$= ${e}$ ✓ Matches Equation 2!\n\nCongratulations! You followed every step of substitution perfectly — outstanding!"`,
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

    const funcDisplay = linearExpr(m, b);
    const description: BilingualText = {
      zh: `求 $y = ${funcDisplay}$ 在 $x=${x}$ 处的值。`,
      en: `Find $y = ${funcDisplay}$ at $x=${x}$.`,
    };
    const bSign = b >= 0 ? '+ ' + b : '- ' + Math.abs(b);
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：函数是什么？\n你可以把函数想象成一台机器——你往里面丢一个数($x$)，它就吐出另一个数($y$)。\n每次丢同一个数进去，出来的结果一定一样。\n今天这台机器的规则是：$y = ${funcDisplay}$`,
          en: `${narrator}: "What is a function?\nThink of it as a machine — you feed in a number ($x$), and it spits out another ($y$).\nSame input always gives the same output.\nToday's machine rule is: $y = ${funcDisplay}$"`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：题目问什么？\n当 $x = ${x}$ 时，$y$ 等于多少？\n就是说——把 $${x}$ 丢进机器里，看出来什么。`,
          en: `${narrator}: "What does the problem ask?\nWhen $x = ${x}$, what is $y$?\nIn other words — feed $${x}$ into the machine and see what comes out."`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：代入——把 $x$ 换成 $${x}$\n$y = ${m} \\times ${x} ${bSign}$\n\n就是把公式里所有的 $x$ 都换成 $${x}$，其他不动。`,
          en: `${narrator}: "Substitute — replace $x$ with $${x}$\n$y = ${m} \\times ${x} ${bSign}$\n\nJust swap every $x$ in the formula with $${x}$, keep everything else."`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：按顺序计算\n先算乘法：$${m} \\times ${x} = ${m * x}$\n再${b >= 0 ? '加' : '减'}：$${m * x} ${bSign} = ${y}$`,
          en: `${narrator}: "Calculate in order\nMultiply first: $${m} \\times ${x} = ${m * x}$\nThen ${b >= 0 ? 'add' : 'subtract'}: $${m * x} ${bSign} = ${y}$"`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：答案\n$y = ${y}$\n\n机器吐出来了！当 $x = ${x}$ 时，$y = ${y}$。`,
          en: `${narrator}: "Answer\n$y = ${y}$\n\nThe machine has spoken! When $x = ${x}$, $y = ${y}$."`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}：验算\n把答案代回去：$${m} \\times ${x} ${bSign} = ${m * x} ${bSign} = ${y}$ ✓\n\n恭喜！你已经学会了"代入求值"——以后碰到任何函数都用这个方法！`,
          en: `${narrator}: "Verify\nPlug the answer back: $${m} \\times ${x} ${bSign} = ${m * x} ${bSign} = ${y}$ ✓\n\nCongratulations! You've learned 'substitution' — use this method for any function!"`,
        },
        highlightField: 'y',
      },
    ];
    const story: BilingualText = {
      zh: `函数 $y = ${funcDisplay}$，当 $x = ${x}$ 时，函数值是多少？`,
      en: `Function $y = ${funcDisplay}$: what is the value when $x = ${x}$?`,
    };
    return { ...template, story, description, data: { m, b, x, generatorType: 'FUNC_VAL_RANDOM' }, tutorialSteps };
  }

  // Vertex form: t = -b/(2a)
  const a = pickRandom([-3, -2, -1, 1, 2, 3]);
  const bCoeff = pickRandom([2, 4, 6, 8, 10, 12, -2, -4, -6]);
  const t = -bCoeff / (2 * a);
  if (t !== Math.round(t * 100) / 100) return safeRetry(template, generateFuncValMission);

  const description: BilingualText = {
    zh: `求 $f(x) = ${a}x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x$ 的顶点 $t$。`,
    en: `Find vertex $t$ of $f(x) = ${a}x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x$.`,
  };
  const negBCoeff = -bCoeff;
  const twoA = 2 * a;
  const fOfT = a * t * t + bCoeff * t;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要找顶点？\n抛物线像一座山（或一个碗）——顶点就是**最高点或最低点**。\n${a > 0 ? '这条抛物线开口朝上，顶点是最低点——比如山谷的谷底。' : '这条抛物线开口朝下，顶点是最高点——比如箭射出后飞到最高的那一瞬间。'}\n\n找到顶点，就知道"极限在哪里"——这在军事策略中极其重要！`,
        en: `${narrator}: "Why find the vertex?\nA parabola is like a mountain (or a bowl) — the vertex is the HIGHEST or LOWEST point.\n${a > 0 ? 'This parabola opens upward, so the vertex is the lowest point — like the bottom of a valley.' : 'This parabola opens downward, so the vertex is the highest point — like an arrow at its peak.'}\n\nFind the vertex, and you know 'where the limit is' — crucial for military strategy!"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：顶点公式\n对于 $f(x) = ax^2 + bx$，顶点的横坐标：\n$$t = \\frac{-b}{2a}$$\n\n这里 $a = ${a}$，$b = ${bCoeff}$。\n就是把这两个数代进去就行——两步搞定！`,
        en: `${narrator}: "The vertex formula\nFor $f(x) = ax^2 + bx$, the vertex's x-coordinate is:\n$$t = \\frac{-b}{2a}$$\n\nHere $a = ${a}$, $b = ${bCoeff}$.\nJust plug these two numbers in — two steps and done!"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：第一步——算分子 $-b$\n$-b = -(${bCoeff}) = ${negBCoeff}$\n\n就是把 $b$ 变成相反数。${bCoeff > 0 ? '正变负！' : '负变正！'}`,
        en: `${narrator}: "Step 1 — calculate the numerator $-b$\n$-b = -(${bCoeff}) = ${negBCoeff}$\n\nJust flip the sign of $b$. ${bCoeff > 0 ? 'Positive becomes negative!' : 'Negative becomes positive!'}"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：第二步——算分母 $2a$，然后相除\n$2a = 2 \\times ${a} = ${twoA}$\n\n$t = \\frac{${negBCoeff}}{${twoA}} = ${t}$`,
        en: `${narrator}: "Step 2 — calculate denominator $2a$, then divide\n$2a = 2 \\times ${a} = ${twoA}$\n\n$t = \\frac{${negBCoeff}}{${twoA}} = ${t}$"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：答案\n顶点横坐标 $t = ${t}$\n\n${a > 0 ? '这就是抛物线的最低点位置！' : '这就是抛物线的最高点位置！'}做得好！`,
        en: `${narrator}: "Answer\nVertex x-coordinate $t = ${t}$\n\n${a > 0 ? 'This is where the parabola hits its lowest point!' : 'This is where the parabola reaches its peak!'} Well done!"`,
      },
      highlightField: 't',
    },
    {
      text: {
        zh: `${narrator}：验算——代回原函数\n$f(${t}) = ${a} \\times (${t})^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff} \\times (${t}) = ${fOfT}$\n\n在 $t$ 左右各取一个点：\n$f(${t - 1}) = ${a * (t - 1) * (t - 1) + bCoeff * (t - 1)}$，$f(${t + 1}) = ${a * (t + 1) * (t + 1) + bCoeff * (t + 1)}$\n两边都${a > 0 ? '更大' : '更小'} → $t = ${t}$ 确实是${a > 0 ? '最低点' : '最高点'} ✓`,
        en: `${narrator}: "Verify — substitute back into the function\n$f(${t}) = ${a} \\times (${t})^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff} \\times (${t}) = ${fOfT}$\n\nCheck a point on each side:\n$f(${t - 1}) = ${a * (t - 1) * (t - 1) + bCoeff * (t - 1)}$, $f(${t + 1}) = ${a * (t + 1) * (t + 1) + bCoeff * (t + 1)}$\nBoth are ${a > 0 ? 'higher' : 'lower'} → $t = ${t}$ really is the ${a > 0 ? 'minimum' : 'maximum'} ✓"`,
      },
      highlightField: 't',
    },
  ];
  const funcDisp = `${a}x^2 ${bCoeff >= 0 ? '+' : ''}${bCoeff}x`;
  const story: BilingualText = {
    zh: `函数 $f(x) = ${funcDisp}$ 的${a > 0 ? '最小' : '最大'}值在哪里？求顶点横坐标 $t$。`,
    en: `Where is the ${a > 0 ? 'minimum' : 'maximum'} of $f(x) = ${funcDisp}$? Find the vertex coordinate $t$.`,
  };
  return { ...template, story, description, data: { a, b: bCoeff, generatorType: 'FUNC_VAL_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   STATISTICS MEDIAN generator
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
  const a2 = a1 + d;
  const a3 = a1 + 2 * d;
  const nMinus1 = n - 1;
  const step = nMinus1 * d;
  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学等差数列？\n曹操每天招兵 $${a1}$ 人，每天比前一天多招 $${d}$ 人。第 $${n}$ 天能招多少？\n不用一天天数，公式直接算！\n\n这种"每次多同样的数"的数列，就是**等差数列**，每次多的数叫**公差** $d = ${d}$。`, en: `${narrator}: "Why learn arithmetic sequences?\nCao Cao recruits $${a1}$ soldiers on day 1, adding $${d}$ more each day. How many on day $${n}$?\nNo need to count day by day — a formula gives the answer instantly!\n\nThis pattern of 'adding the same amount each time' is an **arithmetic sequence**, and the amount added is the **common difference** $d = ${d}$."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：核心公式\n$a_n = a_1 + (n-1) \\times d$\n\n为什么是 $n-1$？第 1 项不用加，第 2 项加 1 次，第 3 项加 2 次……\n第 $n$ 项加 $(n-1)$ 次！`, en: `${narrator}: "Core formula\n$a_n = a_1 + (n-1) \\times d$\n\nWhy $n-1$? Term 1 adds nothing, Term 2 adds once, Term 3 adds twice...\nTerm $n$ adds $(n-1)$ times!"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：代入数值\n$a_{${n}} = ${a1} + (${n}-1) \\times ${d}$\n\n先算括号：$${n} - 1 = ${nMinus1}$`, en: `${narrator}: "Substitute values\n$a_{${n}} = ${a1} + (${n}-1) \\times ${d}$\n\nBrackets first: $${n} - 1 = ${nMinus1}$"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：再算乘法\n$${nMinus1} \\times ${d} = ${step}$\n\n意思就是：从第 1 项开始，公差加了 ${nMinus1} 次，总共多了 $${step}$。`, en: `${narrator}: "Then multiply\n$${nMinus1} \\times ${d} = ${step}$\n\nMeaning: from term 1, the common difference was added ${nMinus1} times, totaling $${step}$ more."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：答案\n$a_{${n}} = ${a1} + ${step} = ${ans}$\n\n第 ${n} 项 = $${ans}$！`, en: `${narrator}: "Answer\n$a_{${n}} = ${a1} + ${step} = ${ans}$\n\nTerm ${n} = $${ans}$!"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：验算\n反过来想：$${ans} - ${a1} = ${step}$\n$${step} \\div ${d} = ${nMinus1}$\n$${nMinus1} + 1 = ${n}$ ✓ 确实是第 ${n} 项！`, en: `${narrator}: "Verify\nThink backwards: $${ans} - ${a1} = ${step}$\n$${step} \\div ${d} = ${nMinus1}$\n$${nMinus1} + 1 = ${n}$ ✓ Confirmed as term ${n}!"` }, highlightField: 'ans' },
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
        text: {
          zh: `${narrator}：为什么要学数列？\n每天招募新兵，人数有规律：$${termsStr}$\n\n什么是"数列"？按一定规律排列的一串数。\n就像每天的记录：第1天 ${terms[0]} 人，第2天 ${terms[1]} 人……看出来了吗？`,
          en: `${narrator}: "Why learn sequences?\nDaily recruitment follows a pattern: $${termsStr}$\n\nWhat is a sequence? Numbers arranged in a pattern.\nLike daily records: Day 1: ${terms[0]}, Day 2: ${terms[1]}... See the pattern?"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：怎么找规律？看相邻两数的差！\n$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n$${terms[3]} - ${terms[2]} = ${d}$\n\n每次都差 $${d}$！这叫"公差"——每天比前一天多招 $${d}$ 人。`,
          en: `${narrator}: "How to find the pattern? Look at differences!\n$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n$${terms[3]} - ${terms[2]} = ${d}$\n\nAlways $${d}$! This is the 'common difference' — $${d}$ more each day."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：知道公差就能预测下一个！\n下一项 = 最后一项 + 公差\n$= ${terms[showCount - 1]} + ${d} = ${answer}$\n\n就像预测明天的招兵人数——有了规律，未来可预见！`,
          en: `${narrator}: "With the common difference, predict the next!\nNext term = last term + common difference\n$= ${terms[showCount - 1]} + ${d} = ${answer}$\n\nLike predicting tomorrow's recruitment — with a pattern, the future is predictable!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：答案\n下一项 = $${answer}$\n\n完整数列：$${termsStr}, ${answer}$`,
          en: `${narrator}: "Answer\nNext term = $${answer}$\n\nFull sequence: $${termsStr}, ${answer}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：验算——新数字符合规律吗？\n$${answer} - ${terms[showCount - 1]} = ${d}$ ✓ 公差不变！\n\n整个数列每一步都差 $${d}$，规律完美成立！`,
          en: `${narrator}: "Verify — does the new number fit?\n$${answer} - ${terms[showCount - 1]} = ${d}$ ✓ Same difference!\n\nEvery step differs by $${d}$ — pattern holds perfectly!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：总结\n等差数列：每一项比前一项多（或少）相同的数。\n找规律 → 算公差 → 加上去 → 验算。\n\n有了这个方法，任何等差数列都难不倒你！做得漂亮！`,
          en: `${narrator}: "Summary\nArithmetic sequence: each term differs from the last by the same amount.\nFind pattern → calculate difference → add → verify.\n\nWith this method, no arithmetic sequence can stump you! Brilliantly done!"`,
        },
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
        text: {
          zh: `${narrator}：为什么要学等差数列？\n想象远征军每天的补给——第 1 天 ${a1} 袋，之后每天多（或少）固定的量。\n这种"匀速增减"的规律到处都是：工资涨幅、台阶高度、利息增长...\n学会通项公式，就能直接算出第 100 天的值，不用一天天数！`,
          en: `${narrator}: "Why learn arithmetic sequences?\nImagine daily army supplies — day 1 is ${a1}, then a fixed increase (or decrease) each day.\nThis 'steady change' pattern is everywhere: salary raises, stair heights, interest growth...\nLearn the formula to instantly calculate day 100, no counting needed!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：远征军第 $${n}$ 天的补给量是多少？\n数列：$${termsStr}, \\ldots$\n\n逐个数到第 $${n}$ 项太慢了——我们需要一个"直达公式"！\n给出位置 $n$，直接算出值。`,
          en: `${narrator}: "What's the supply on day $${n}$?\nSequence: $${termsStr}, \\ldots$\n\nCounting one by one to term $${n}$ is too slow — we need a 'direct formula'!\nGive it position $n$, get the value instantly."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：第一步——找公差\n$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n\n公差 $d = ${d}$（每次加 $${d}$）。有了公差就能用公式了！`,
          en: `${narrator}: "Step 1 — find the common difference\n$${terms[1]} - ${terms[0]} = ${d}$\n$${terms[2]} - ${terms[1]} = ${d}$\n\nCommon difference $d = ${d}$ (adding $${d}$ each time). With this, we can use the formula!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：公式为什么是 $(n-1)$？\n第 1 项：$${a1}$，加了 $0$ 次公差\n第 2 项：$${a1} + ${d} \\times 1 = ${a1 + d}$，加了 $1$ 次\n第 3 项：$${a1} + ${d} \\times 2 = ${a1 + 2*d}$，加了 $2$ 次\n\n规律：第 $n$ 项加了 $(n-1)$ 次公差——因为第 1 项还没开始加！`,
          en: `${narrator}: "Why $(n-1)$ in the formula?\nTerm 1: $${a1}$, added $0$ differences\nTerm 2: $${a1} + ${d} \\times 1 = ${a1 + d}$, added $1$ time\nTerm 3: $${a1} + ${d} \\times 2 = ${a1 + 2*d}$, added $2$ times\n\nPattern: term $n$ adds $(n-1)$ differences — because term 1 hasn't added any yet!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：代入公式\n$\\text{第 } n \\text{ 项} = a_1 + (n-1) \\times d$\n$= ${a1} + (${n} - 1) \\times ${d}$\n$= ${a1} + ${n-1} \\times ${d}$\n$= ${a1} + ${(n-1)*d} = ${answer}$`,
          en: `${narrator}: "Plug into the formula\n$\\text{Term } n = a_1 + (n-1) \\times d$\n$= ${a1} + (${n} - 1) \\times ${d}$\n$= ${a1} + ${n-1} \\times ${d}$\n$= ${a1} + ${(n-1)*d} = ${answer}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：答案\n第 $${n}$ 项 = $${answer}$\n\n不用逐个数，公式一步到位！`,
          en: `${narrator}: "Answer\nTerm $${n}$ = $${answer}$\n\nNo counting one by one — the formula gets there in one shot!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：验算\n• 比第 1 项（$${a1}$）大？$${answer} > ${a1}$ ✓\n• 加了 $${n-1}$ 次公差 $${d}$：$${d} \\times ${n-1} = ${(n-1)*d}$\n• $${a1} + ${(n-1)*d} = ${answer}$ ✓\n\n远征军补给计划精准无误，做得漂亮！`,
          en: `${narrator}: "Verify\n• Bigger than term 1 ($${a1}$)? $${answer} > ${a1}$ ✓\n• Added $${d}$ exactly $${n-1}$ times: $${d} \\times ${n-1} = ${(n-1)*d}$\n• $${a1} + ${(n-1)*d} = ${answer}$ ✓\n\nExpedition supply plan spot-on — brilliantly done!"`,
        },
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

  const onAxis = targetX === 0 || targetY === 0;
  const quadrant = onAxis ? (targetX === 0 && targetY === 0 ? 'O' : targetX === 0 ? 'Y' : 'X')
    : targetX > 0 && targetY > 0 ? 'I' : targetX < 0 && targetY > 0 ? 'II' : targetX < 0 && targetY < 0 ? 'III' : 'IV';
  const quadrantZh: Record<string, string> = { I: '第一象限（右上）', II: '第二象限（左上）', III: '第三象限（左下）', IV: '第四象限（右下）', X: '$x$ 轴上', Y: '$y$ 轴上', O: '原点' };
  const quadrantEn: Record<string, string> = { I: 'Quadrant I (top-right)', II: 'Quadrant II (top-left)', III: 'Quadrant III (bottom-left)', IV: 'Quadrant IV (bottom-right)', X: 'on the $x$-axis', Y: 'on the $y$-axis', O: 'at the origin' };

  const description: BilingualText = {
    zh: `敌营位于坐标 $(${targetX}, ${targetY})$。输入 $x$ 和 $y$ 坐标。`,
    en: `Enemy camp is at $(${targetX}, ${targetY})$. Enter the $x$ and $y$ coordinates.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要坐标？\n"敌军在东边"——太模糊了！"敌军在东 5 里、北 3 里"——精确！\n\n坐标就是用数字精确描述位置的方法。战场上每个点都有唯一的"数字地址"。`,
        en: `${narrator}: "Why do we need coordinates?\n'The enemy is east' — too vague! 'East 5, north 3' — precise!\n\nCoordinates use numbers to pinpoint locations. Every battlefield point has a unique 'numerical address'."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：坐标系——两条轴 + 原点\n想象一张方格地图：\n• 横着看（→）= $x$ 轴\n• 竖着看（↑）= $y$ 轴\n• 交叉点 = 原点 $(0, 0)$\n\n每个位置写成 $(x, y)$。口诀：**先横后竖，先 $x$ 后 $y$**！`,
        en: `${narrator}: "Coordinate system — two axes + origin\nImagine a grid map:\n• Horizontal (→) = $x$-axis\n• Vertical (↑) = $y$-axis\n• Where they cross = origin $(0, 0)$\n\nEvery position is $(x, y)$. Rule: **across first, then up — $x$ before $y$**!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：$x$ 坐标——横着走\n从原点出发，往右 = 正，往左 = 负。\n\n$x = ${targetX}$ 表示从原点往${targetX >= 0 ? `右走 $${targetX}$` : `左走 $${Math.abs(targetX)}$`} 步。`,
        en: `${narrator}: "$x$ coordinate — move horizontally\nFrom the origin, right = positive, left = negative.\n\n$x = ${targetX}$ means ${targetX >= 0 ? `$${targetX}$ steps right` : `$${Math.abs(targetX)}$ steps left`} from origin."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：$y$ 坐标——竖着走\n到了 $x$ 的位置后，往上 = 正，往下 = 负。\n\n$y = ${targetY}$ 表示往${targetY >= 0 ? `上走 $${targetY}$` : `下走 $${Math.abs(targetY)}$`} 步。`,
        en: `${narrator}: "$y$ coordinate — move vertically\nFrom the $x$ position, up = positive, down = negative.\n\n$y = ${targetY}$ means ${targetY >= 0 ? `$${targetY}$ steps up` : `$${Math.abs(targetY)}$ steps down`}."`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：答案\n$(${targetX}, ${targetY})$ 在${quadrantZh[quadrant]}。\n\n从原点：① 横走 ${targetX >= 0 ? `右 $${targetX}$` : `左 $${Math.abs(targetX)}$`} ② 竖走 ${targetY >= 0 ? `上 $${targetY}$` : `下 $${Math.abs(targetY)}$`}\n\n$x = ${targetX}$，$y = ${targetY}$`,
        en: `${narrator}: "Answer\n$(${targetX}, ${targetY})$ is ${quadrantEn[quadrant]}.\n\nFrom origin: ① Horizontal ${targetX >= 0 ? `right $${targetX}$` : `left $${Math.abs(targetX)}$`} ② Vertical ${targetY >= 0 ? `up $${targetY}$` : `down $${Math.abs(targetY)}$`}\n\n$x = ${targetX}$, $y = ${targetY}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：记住四个象限\nI $(+,+)$ 右上 | II $(-,+)$ 左上\nIII $(-,-)$ 左下 | IV $(+,-)$ 右下\n\n永远先 $x$ 后 $y$，右上正正，逆时针转！做得漂亮！`,
        en: `${narrator}: "Remember the four quadrants\nI $(+,+)$ top-right | II $(-,+)$ top-left\nIII $(-,-)$ bottom-left | IV $(+,-)$ bottom-right\n\nAlways $x$ first then $y$, start top-right, go counter-clockwise! Brilliantly done!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: onAxis
          ? `${narrator}：验算\n点 $(${targetX}, ${targetY})$ 在${quadrantZh[quadrant]}\n${targetX === 0 ? '$x = 0$ → 在 $y$ 轴上' : '$y = 0$ → 在 $x$ 轴上'} ✓`
          : `${narrator}：验算\n点 $(${targetX}, ${targetY})$ 在${quadrantZh[quadrant]}\n${targetX > 0 ? '正' : '负'} $x$ + ${targetY > 0 ? '正' : '负'} $y$ → 象限判断 ✓`,
        en: onAxis
          ? `${narrator}: "Verify\nPoint $(${targetX}, ${targetY})$ is ${quadrantEn[quadrant]}\n${targetX === 0 ? '$x = 0$ → on the $y$-axis' : '$y = 0$ → on the $x$-axis'} ✓"`
          : `${narrator}: "Verify\nPoint $(${targetX}, ${targetY})$ is in ${quadrantEn[quadrant]}\n${targetX > 0 ? 'positive' : 'negative'} $x$ + ${targetY > 0 ? 'positive' : 'negative'} $y$ → quadrant confirmed ✓"`,
      },
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

