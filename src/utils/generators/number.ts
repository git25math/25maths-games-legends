// Auto-extracted from generateMission.ts — CH1 Number generators
import { pickRandom, randInt, signTerm, coeffStr, signCoeff, eqStr, linearExpr, safeRetry, getTier, gcdCalc, type Mission, type BilingualText, type DifficultyTier, type GeneratorFn } from './shared';

/* ── Number-specific helpers ── */

function primeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.set(d, (factors.get(d) || 0) + 1); n /= d; }
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

function shortDivision(a: number, b: number): { steps: { prime: number; quotientA: number; quotientB: number }[]; bottomA: number; bottomB: number } {
  const steps: { prime: number; quotientA: number; quotientB: number }[] = [];
  let curA = a, curB = b;
  let d = 2;
  while (d <= Math.min(curA, curB)) {
    if (curA % d === 0 && curB % d === 0) { curA /= d; curB /= d; steps.push({ prime: d, quotientA: curA, quotientB: curB }); }
    else { d++; }
  }
  return { steps, bottomA: curA, bottomB: curB };
}

function isPrimeCheck(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) { if (n % d === 0) return false; }
  return true;
}

type FactorTreeNode = { value: number; isPrime?: boolean; children?: [FactorTreeNode, FactorTreeNode] };

function buildFactorTree(n: number): FactorTreeNode {
  if (n <= 1) return { value: n, isPrime: true };
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return { value: n, children: [{ value: d, isPrime: true }, buildFactorTree(n / d)] };
  }
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

/* ── Generators ── */

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
        zh: `${narrator}：为什么要学正负数加减？\n正数 = "有/得到"，负数 = "没有/失去"。\n想象一条数线：右边越来越多（正），左边越来越少（负）。\n\n加正数 = 往右走，加负数 = 往左走。学会了就能算盈亏！`,
        en: `${narrator}: "Why learn adding/subtracting with negatives?\nPositive = 'have/gain', Negative = 'don't have/lose'.\nImagine a number line: right = more (positive), left = less (negative).\n\nAdd positive = go right, add negative = go left. Master this for profit/loss!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：题目是 $${exprStr}$，一步步来`,
        en: `${narrator}: "The expression is $${exprStr}$, step by step"`,
      },
      highlightField: 'ans',
    },
    ...(op === '+' && a >= 0 && b < 0 ? [
      {
        text: {
          zh: `${narrator}：口袋有 $${a}$，花掉 $${Math.abs(b)}$\n加一个负数 = 减去它的绝对值。\n$${b}$ 的绝对值是 $${Math.abs(b)}$，所以"加 $${b}$" = "减 $${Math.abs(b)}$"。`,
          en: `${narrator}: "Have $${a}$, spend $${Math.abs(b)}$\nAdding a negative = subtracting its absolute value.\n$${b}$'s absolute value is $${Math.abs(b)}$, so 'add $${b}$' = 'subtract $${Math.abs(b)}$'."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：$${a} + (${b}) = ${a} - ${Math.abs(b)} = ${answer}$\n\n数线验算：从 $${a}$ 出发，往左走 $${Math.abs(b)}$ 步，到达 $${answer}$。`,
          en: `${narrator}: "$${a} + (${b}) = ${a} - ${Math.abs(b)} = ${answer}$\n\nNumber line: start at $${a}$, go left $${Math.abs(b)}$ steps, reach $${answer}$."`,
        },
        highlightField: 'ans',
      },
    ] : op === '+' && a < 0 && b < 0 ? [
      {
        text: {
          zh: `${narrator}：第一笔亏 $${Math.abs(a)}$，第二笔又亏 $${Math.abs(b)}$——两笔亏损叠加！\n两个都是负的 → 去掉负号加起来 → 结果取负号。`,
          en: `${narrator}: "First loss $${Math.abs(a)}$, second loss $${Math.abs(b)}$ — losses pile up!\nBoth negative → add the numbers → result is negative."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：$${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}$，加负号 → $${answer}$\n\n数线：从 $0$ 往左 $${Math.abs(a)}$ 步到 $${a}$，再左 $${Math.abs(b)}$ 步到 $${answer}$。`,
          en: `${narrator}: "$${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}$, add minus → $${answer}$\n\nNumber line: from $0$ left $${Math.abs(a)}$ to $${a}$, then left $${Math.abs(b)}$ more to $${answer}$."`,
        },
        highlightField: 'ans',
      },
    ] : op === '-' && a >= 0 && b <= a ? [
      {
        text: {
          zh: `${narrator}：有 $${a}$，减去 $${b}$——减得够，直接减！\n这是最简单的情况：大数减小数，结果一定是正的。`,
          en: `${narrator}: "Have $${a}$, subtract $${b}$ — enough to subtract, just do it!\nSimplest case: big minus small, result is always positive."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：$${a} - ${b} = ${answer}$\n\n数线：从 $${a}$ 往左 $${b}$ 步，到 $${answer}$。`,
          en: `${narrator}: "$${a} - ${b} = ${answer}$\n\nNumber line: from $${a}$, left $${b}$ steps, reach $${answer}$."`,
        },
        highlightField: 'ans',
      },
    ] : op === '-' && a >= 0 && b > a ? [
      {
        text: {
          zh: `${narrator}：只有 $${a}$，要减 $${b}$——减不够！\n$${b} > ${a}$，减完会穿过 $0$ 变成负数。缺口就是答案的绝对值。`,
          en: `${narrator}: "Only have $${a}$, subtract $${b}$ — not enough!\n$${b} > ${a}$, subtraction crosses $0$ into negatives. The gap is the answer's size."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：交换算差值 $${b} - ${a} = ${b - a}$，加负号 → $${answer}$\n\n数线：从 $${a}$ 往左 $${b}$ 步，经过 $0$，到 $${answer}$。`,
          en: `${narrator}: "Swap: $${b} - ${a} = ${b - a}$, add minus → $${answer}$\n\nNumber line: from $${a}$, left $${b}$ steps, past $0$, reach $${answer}$."`,
        },
        highlightField: 'ans',
      },
    ] : [
      {
        text: {
          zh: `${narrator}：已经亏 $${Math.abs(a)}$，再消耗 $${b}$——亏损在增加！\n已经在负数区，再减正数 = 往更负的方向走。`,
          en: `${narrator}: "Already lost $${Math.abs(a)}$, spend $${b}$ more — losses grow!\nAlready negative, subtract positive = go even more negative."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：$${Math.abs(a)} + ${b} = ${Math.abs(a) + b}$，取负号 → $${answer}$\n\n数线：从 $${a}$ 往左 $${b}$ 步，到 $${answer}$。`,
          en: `${narrator}: "$${Math.abs(a)} + ${b} = ${Math.abs(a) + b}$, make negative → $${answer}$\n\nNumber line: from $${a}$, left $${b}$ steps, reach $${answer}$."`,
        },
        highlightField: 'ans',
      },
    ]),
    {
      text: {
        zh: `${narrator}：答案\n$${exprStr} = ${answer}$\n\n${answer >= 0 ? '结果是正数——赚了！' : '结果是负数——亏了！'}账算清了，做得漂亮！`,
        en: `${narrator}: "Answer\n$${exprStr} = ${answer}$\n\n${answer >= 0 ? 'Positive result — profit!' : 'Negative result — loss!'} All accounted for — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n反向运算：$${answer} ${op === '+' ? '-' : '+'} ${op === '+' ? (b < 0 ? `(${b})` : `${b}`) : `${b}`} = ${a}$ ✓\n回到了第一个数 $${a}$，说明计算正确！`,
        en: `${narrator}: "Verify\nReverse operation: $${answer} ${op === '+' ? '-' : '+'} ${op === '+' ? (b < 0 ? `(${b})` : `${b}`) : `${b}`} = ${a}$ ✓\nWe get back to the first number $${a}$, so the calculation is correct!"`,
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
      text: {
        zh: `${narrator}：为什么要学负数乘除？——进攻退守，方向很重要！\n正数 = 前进/得到，负数 = 后退/失去。\n\n"3 队骑兵各前进 2 里" = $3 \\times 2 = 6$ 里（正 = 前进）\n"3 队骑兵各后退 2 里" = $3 \\times (-2) = -6$ 里（负 = 后退）`,
        en: `${narrator}: "Why learn multiplying negatives? Direction matters!\nPositive = advance/gain, Negative = retreat/lose.\n\n'3 units advance 2 miles' = $3 \\times 2 = 6$ miles (positive = forward)\n'3 units retreat 2 miles' = $3 \\times (-2) = -6$ miles (negative = backward)"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：核心口诀——两句话搞定\n• **同号得正**：正×正 = 正，负×负 = 正\n• **异号得负**：正×负 = 负，负×正 = 负\n\n乘法和除法规则完全相同！记住这两句就够了。`,
        en: `${narrator}: "Core rule — two lines and you're done\n• **Same signs → positive**: (+)×(+) = (+), (−)×(−) = (+)\n• **Different signs → negative**: (+)×(−) = (−), (−)×(+) = (−)\n\nSame rule for division! Remember these two lines."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：为什么"负负得正"？\n想象敌人在撤退（负方向），我们"取消"撤退（再一个负）。\n取消撤退 = 前进 = 正方向！\n\n负负得正，就像"敌退我进"——两个负号互相抵消！`,
        en: `${narrator}: "Why does negative × negative = positive?\nImagine the enemy retreating (negative). We 'cancel' the retreat (another negative).\nCancelling retreat = advance = positive!\n\nNeg × Neg = Pos, like 'enemy retreats, we advance' — two negatives cancel out!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——判断符号\n$(${a})$ 是${a >= 0 ? '正' : '负'}数，$(${b})$ 是${b >= 0 ? '正' : '负'}数。\n\n${signRuleZh}！所以结果是${signRule === 'positive' ? '**正**' : '**负**'}数。`,
        en: `${narrator}: "Step 1 — determine the sign\n$(${a})$ is ${a >= 0 ? 'positive' : 'negative'}, $(${b})$ is ${b >= 0 ? 'positive' : 'negative'}.\n\n${signRuleEn}! So the result is **${signRule}**."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——不管正负，先算数字\n$${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$\n\n加上符号：${answer >= 0 ? '' : '−'}$${Math.abs(answer)}$ → 答案 = $${answer}$`,
        en: `${narrator}: "Step 2 — ignore signs, just calculate\n$${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$\n\nAdd sign: ${answer >= 0 ? '' : '−'}$${Math.abs(answer)}$ → answer = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n$(${a}) ${op} (${b}) = ${answer}$ ✓\n符号：${signRuleZh} ✓\n数值：$${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$ ✓\n\n做得漂亮！`,
        en: `${narrator}: "Verify\n$(${a}) ${op} (${b}) = ${answer}$ ✓\nSign: ${signRuleEn} ✓\nValue: $${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(answer)}$ ✓\n\nBrilliantly done!"`,
      },
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
  if (isSubtract && adjN1 === adjN2) return safeRetry(template, generateFracAddMission);

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
        zh: `${narrator}：为什么不能直接${isSubtract ? '减' : '加'}？\n你的饼切成 $${dispD1}$ 份，我的切成 $${dispD2}$ 份——每份大小不一样！\n不统一份数，就没法直接${isSubtract ? '减' : '加'}。\n\n就像你的 1 块和我的 1 块大小不同——先切成一样大的才行！`,
        en: `${narrator}: "Why can't we just ${isSubtract ? 'subtract' : 'add'} directly?\nYour pie has $${dispD1}$ pieces, mine has $${dispD2}$ — each piece is different size!\nCan't ${isSubtract ? 'subtract' : 'add'} until pieces are the same size.\n\nYour 1 piece ≠ my 1 piece — cut both the same first!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：找公分母——两块饼都切成一样多的份\n列出 $${dispD1}$ 的倍数，看哪个也能被 $${dispD2}$ 整除：\n${multiplesForLCD.zh}\n\n公分母 = $${recalcLcd}$！`,
        en: `${narrator}: "Find the common denominator — cut both pies the same\nList multiples of $${dispD1}$, check which is divisible by $${dispD2}$:\n${multiplesForLCD.en}\n\nCommon denominator = $${recalcLcd}$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：通分第一个——$\\frac{${dispN1}}{${dispD1}}$\n分母 $${dispD1} \\to ${recalcLcd}$，乘了 $${k1}$。\n分子也必须乘 $${k1}$（不然分数值就变了）：$${dispN1} \\times ${k1} = ${recalcAdjN1}$\n\n$\\frac{${dispN1}}{${dispD1}} = \\frac{${recalcAdjN1}}{${recalcLcd}}$`,
        en: `${narrator}: "Convert first — $\\frac{${dispN1}}{${dispD1}}$\nDenominator $${dispD1} \\to ${recalcLcd}$, multiplied by $${k1}$.\nNumerator must also ×$${k1}$ (or the value changes): $${dispN1} \\times ${k1} = ${recalcAdjN1}$\n\n$\\frac{${dispN1}}{${dispD1}} = \\frac{${recalcAdjN1}}{${recalcLcd}}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：通分第二个——$\\frac{${dispN2}}{${dispD2}}$\n分母 $${dispD2} \\to ${recalcLcd}$，乘了 $${k2}$。分子也乘：$${dispN2} \\times ${k2} = ${recalcAdjN2}$\n\n$\\frac{${dispN2}}{${dispD2}} = \\frac{${recalcAdjN2}}{${recalcLcd}}$`,
        en: `${narrator}: "Convert second — $\\frac{${dispN2}}{${dispD2}}$\nDenominator $${dispD2} \\to ${recalcLcd}$, ×$${k2}$. Numerator too: $${dispN2} \\times ${k2} = ${recalcAdjN2}$\n\n$\\frac{${dispN2}}{${dispD2}} = \\frac{${recalcAdjN2}}{${recalcLcd}}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：分母相同了——直接${isSubtract ? '减' : '加'}分子！\n$\\frac{${recalcAdjN1}}{${recalcLcd}} ${op} \\frac{${recalcAdjN2}}{${recalcLcd}} = \\frac{${recalcAdjN1} ${op} ${recalcAdjN2}}{${recalcLcd}} = \\frac{${rawAns}}{${recalcLcd}}$\n\n分母不变，只${isSubtract ? '减' : '加'}分子——就这么简单！`,
        en: `${narrator}: "Same denominator now — just ${isSubtract ? 'subtract' : 'add'} numerators!\n$\\frac{${recalcAdjN1}}{${recalcLcd}} ${op} \\frac{${recalcAdjN2}}{${recalcLcd}} = \\frac{${rawAns}}{${recalcLcd}}$\n\nDenominator stays, just ${isSubtract ? 'subtract' : 'add'} numerators — that simple!"`,
      },
      highlightField: 'ans',
    },
    ...(needsSimplify ? [
      {
        text: {
          zh: `${narrator}：化简——$${rawAns}$ 和 $${recalcLcd}$ 的公因数是 $${gcdCalc(rawAns, recalcLcd)}$\n都除以 $${gcdCalc(rawAns, recalcLcd)}$：$\\frac{${rawAns} \\div ${gcdCalc(rawAns, recalcLcd)}}{${recalcLcd} \\div ${gcdCalc(rawAns, recalcLcd)}} = ${ansDisplay}$`,
          en: `${narrator}: "Simplify — $${rawAns}$ and $${recalcLcd}$ share factor $${gcdCalc(rawAns, recalcLcd)}$\nDivide both: $\\frac{${rawAns} \\div ${gcdCalc(rawAns, recalcLcd)}}{${recalcLcd} \\div ${gcdCalc(rawAns, recalcLcd)}} = ${ansDisplay}$"`,
        },
        highlightField: 'ans',
      },
    ] : [
      {
        text: {
          zh: `${narrator}：能化简吗？$${rawAns}$ 和 $${recalcLcd}$ 没有公因数——已经最简了！`,
          en: `${narrator}: "Can it simplify? $${rawAns}$ and $${recalcLcd}$ share no factors — already simplest!"`,
        },
        highlightField: 'ans',
      },
    ]),
    {
      text: {
        zh: `${narrator}：答案\n$${ansDisplay}$\n\n验算：$\\frac{${ansNum}}{${ansDen}} \\approx ${(ansNum/ansDen).toFixed(3)}$——做得漂亮！`,
        en: `${narrator}: "Answer\n$${ansDisplay}$\n\nCheck: $\\frac{${ansNum}}{${ansDen}} \\approx ${(ansNum/ansDen).toFixed(3)}$ — brilliantly done!"`,
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
        zh: `${narrator}：分数除法——先用整数感受\n有 6 个苹果，每人分 2 个：$6 \\div 2 = 3$ 人。\n有 6 个苹果，每人分 $\\frac{1}{2}$ 个：$6 \\div \\frac{1}{2} = 12$ 人！\n\n注意：$6 \\div \\frac{1}{2} = 6 \\times 2 = 12$——除以分数 = 乘以倒数！`,
        en: `${narrator}: "Fraction division — feel it with whole numbers first\n6 apples, 2 per person: $6 \\div 2 = 3$ people.\n6 apples, $\\frac{1}{2}$ per person: $6 \\div \\frac{1}{2} = 12$ people!\n\nNotice: $6 \\div \\frac{1}{2} = 6 \\times 2 = 12$ — dividing by a fraction = multiplying by its reciprocal!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：什么是"倒数"？分子分母互换！\n$\\frac{${n2}}{${d2}}$ 的倒数是 $\\frac{${d2}}{${n2}}$。\n\n除以 $\\frac{${n2}}{${d2}}$ = 乘以 $\\frac{${d2}}{${n2}}$——记住这个就够了！`,
        en: `${narrator}: "What's a reciprocal? Swap numerator and denominator!\nReciprocal of $\\frac{${n2}}{${d2}}$ is $\\frac{${d2}}{${n2}}$.\n\nDivide by $\\frac{${n2}}{${d2}}$ = multiply by $\\frac{${d2}}{${n2}}$ — remember this and you're set!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把除法变乘法\n$\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}} = \\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}}$\n\n翻转第二个分数，除号变乘号！`,
        en: `${narrator}: "Turn division into multiplication\n$\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}} = \\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}}$\n\nFlip the second fraction, change ÷ to ×!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：分子乘分子，分母乘分母\n$\\frac{${n1} \\times ${d2}}{${d1} \\times ${n2}} = \\frac{${rawNum}}{${rawDen}}$`,
        en: `${narrator}: "Tops × tops, bottoms × bottoms\n$\\frac{${n1} \\times ${d2}}{${d1} \\times ${n2}} = \\frac{${rawNum}}{${rawDen}}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: needsSimplify ? {
        zh: `${narrator}：化简——$${rawNum}$ 和 $${rawDen}$ 的公因数是 $${simplifyG}$\n都除以 $${simplifyG}$：$\\frac{${rawNum} \\div ${simplifyG}}{${rawDen} \\div ${simplifyG}} = ${ansDisplay}$`,
        en: `${narrator}: "Simplify — HCF of $${rawNum}$ and $${rawDen}$ is $${simplifyG}$\nDivide both: $\\frac{${rawNum} \\div ${simplifyG}}{${rawDen} \\div ${simplifyG}} = ${ansDisplay}$"`,
      } : {
        zh: `${narrator}：检查是否需要化简\n$\\frac{${rawNum}}{${rawDen}}$——分子分母没有公因数，已经是最简分数！\n\n化简就是找分子分母的最大公因数 (HCF)，都除以它。`,
        en: `${narrator}: "Check if simplification is needed\n$\\frac{${rawNum}}{${rawDen}}$ — no common factor between numerator and denominator. Already in simplest form!\n\nSimplifying = find HCF of top and bottom, divide both by it."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${ansDisplay}$\n\n$\\frac{${ansNum}}{${ansDen}} \\approx ${(ansNum/ansDen).toFixed(3)}$——做得漂亮！`,
        en: `${narrator}: "Answer\n$${ansDisplay}$\n\n$\\frac{${ansNum}}{${ansDen}} \\approx ${(ansNum/ansDen).toFixed(3)}$ — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n反向运算：$${ansDisplay} \\times \\frac{${n2}}{${d2}} = \\frac{${ansNum} \\times ${n2}}{${ansDen} \\times ${d2}} = \\frac{${ansNum * n2}}{${ansDen * d2}}$${gcdCalc(ansNum * n2, ansDen * d2) > 1 ? ` = \\frac{${n1}}{${d1}}` : ` = \\frac{${n1}}{${d1}}`}$ ✓\n回到了原来的 $\\frac{${n1}}{${d1}}$，验证成功！`,
        en: `${narrator}: "Verify\nReverse: $${ansDisplay} \\times \\frac{${n2}}{${d2}} = \\frac{${ansNum} \\times ${n2}}{${ansDen} \\times ${d2}} = \\frac{${n1}}{${d1}}$ ✓\nWe get back to $\\frac{${n1}}{${d1}}$, verified!"`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：分数乘法——"取一部分的一部分"\n想象 ${previewTotal} 袋粮食，先取 $\\frac{${n1}}{${d1}}$ = ${previewFirst} 袋。\n再从这 ${previewFirst} 袋里取 $\\frac{${n2}}{${d2}}$ = ${previewSecond} 袋。\n\n$${previewSecond}$ 袋占原来 $${previewTotal}$ 袋的 $\\frac{${previewSecond}}{${previewTotal}}$——这就是分数乘法！`,
        en: `${narrator}: "Fraction multiplication — 'a part of a part'\nImagine ${previewTotal} bags of grain. Take $\\frac{${n1}}{${d1}}$ = ${previewFirst} bags.\nFrom those, take $\\frac{${n2}}{${d2}}$ = ${previewSecond} bags.\n\n$${previewSecond}$ out of $${previewTotal}$ = $\\frac{${previewSecond}}{${previewTotal}}$ — that's fraction multiplication!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：规则超简单——分子×分子，分母×分母\n$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$\n\n不用通分！分数乘法比加法还简单！`,
        en: `${narrator}: "Rule is super simple — tops × tops, bottoms × bottoms\n$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$\n\nNo common denominator needed! Fraction multiplication is easier than addition!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：代入计算\n$\\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${rawNum}}{${rawDen}}$`,
        en: `${narrator}: "Substitute and calculate\n$\\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${rawNum}}{${rawDen}}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: needsSimplify ? {
        zh: `${narrator}：化简——$${rawNum}$ 和 $${rawDen}$ 的公因数是 $${simplifyG}$\n都除以 $${simplifyG}$：$\\frac{${rawNum} \\div ${simplifyG}}{${rawDen} \\div ${simplifyG}} = ${ansDisplay}$`,
        en: `${narrator}: "Simplify — HCF of $${rawNum}$ and $${rawDen}$ is $${simplifyG}$\nDivide both: $\\frac{${rawNum} \\div ${simplifyG}}{${rawDen} \\div ${simplifyG}} = ${ansDisplay}$"`,
      } : {
        zh: `${narrator}：检查是否需要化简\n$\\frac{${rawNum}}{${rawDen}}$——已经是最简分数，无需化简！`,
        en: `${narrator}: "Check if simplification needed\n$\\frac{${rawNum}}{${rawDen}}$ — already in simplest form!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${ansDisplay}$\n\n分数乘法的结果通常比原来更小——取一部分的一部分，当然更少！\n$\\frac{${ansNum}}{${ansDen}} \\approx ${(ansNum/ansDen).toFixed(3)}$——做得漂亮！`,
        en: `${narrator}: "Answer\n$${ansDisplay}$\n\nFraction multiplication usually gives a smaller result — a part of a part is naturally less!\n$\\frac{${ansNum}}{${ansDen}} \\approx ${(ansNum/ansDen).toFixed(3)}$ — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n反向运算：$${ansDisplay} \\div \\frac{${n2}}{${d2}} = ${ansDisplay} \\times \\frac{${d2}}{${n2}} = \\frac{${n1}}{${d1}}$ ✓\n回到了原来的 $\\frac{${n1}}{${d1}}$，验证成功！`,
        en: `${narrator}: "Verify\nReverse: $${ansDisplay} \\div \\frac{${n2}}{${d2}} = ${ansDisplay} \\times \\frac{${d2}}{${n2}} = \\frac{${n1}}{${d1}}$ ✓\nWe get back to $\\frac{${n1}}{${d1}}$, verified!"`,
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
        text: {
          zh: `${narrator}：为什么有两种分数写法？\n分粮食时，说"${whole}又$\\frac{${num}}{${den}}$石"比"$\\frac{${improperNum}}{${den}}$石"更直观——一听就知道大概${whole}石多一点。\n但做计算时，假分数 $\\frac{${improperNum}}{${den}}$ 乘除更方便。\n\n两种写法各有方便之处！带分数 = 整数 + 真分数，假分数 = 分子 ≥ 分母。`,
          en: `${narrator}: "Why are there two ways to write fractions?\nWhen distributing grain, '${whole} and $\\frac{${num}}{${den}}$' is clearer — you instantly know it's about ${whole} and a bit more.\nBut for calculation, $\\frac{${improperNum}}{${den}}$ is easier to multiply and divide.\n\nEach form has its use! Mixed = whole + proper fraction, improper = numerator ≥ denominator."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：为什么要互转？\n带分数好理解（"${whole}块多一点"），假分数好计算（乘除法更方便）。\n\n就像整箱+散装粮草全拆成散装——方便统一计算！`,
          en: `${narrator}: "Why convert?\nMixed numbers are easy to understand ('${whole} and a bit'), improper fractions are easy to calculate (better for × ÷).\n\nLike unpacking full crates into loose items — easier to count!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：转换方法——整数×分母+分子\n想象 ${whole} 个饼，每个切成 ${den} 份：\n${whole} 个饼 = $${whole} \\times ${den} = ${whole * den}$ 份\n加上散装 ${num} 份：$${whole * den} + ${num} = ${improperNum}$ 份\n\n分母不变，还是 ${den}。所以 $${whole}\\frac{${num}}{${den}} = \\frac{${improperNum}}{${den}}$`,
          en: `${narrator}: "Method — whole × denominator + numerator\nImagine ${whole} pies, each cut into ${den} slices:\n${whole} pies = $${whole} \\times ${den} = ${whole * den}$ slices\nPlus ${num} loose: $${whole * den} + ${num} = ${improperNum}$ slices\n\nDenominator stays ${den}. So $${whole}\\frac{${num}}{${den}} = \\frac{${improperNum}}{${den}}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：公式一步到位\n$${whole}\\frac{${num}}{${den}} = \\frac{${whole} \\times ${den} + ${num}}{${den}} = \\frac{${improperNum}}{${den}}$\n\n分子 = $${improperNum}$。就这么简单！`,
          en: `${narrator}: "Formula in one step\n$${whole}\\frac{${num}}{${den}} = \\frac{${whole} \\times ${den} + ${num}}{${den}} = \\frac{${improperNum}}{${den}}$\n\nNumerator = $${improperNum}$. That's it!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：答案\n分子 = $${improperNum}$\n\n$${whole}\\frac{${num}}{${den}} = \\frac{${improperNum}}{${den}}$`,
          en: `${narrator}: "Answer\nNumerator = $${improperNum}$\n\n$${whole}\\frac{${num}}{${den}} = \\frac{${improperNum}}{${den}}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：验算——反过来除\n$${improperNum} \\div ${den} = ${whole}$ 余 $${num}$\n→ $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$ ✓\n\n口诀：整数×分母+分子，分母不变。做得漂亮！`,
          en: `${narrator}: "Verify — divide back\n$${improperNum} \\div ${den} = ${whole}$ remainder $${num}$\n→ $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$ ✓\n\nRule: whole × denom + numerator, denom stays. Brilliantly done!"`,
        },
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
        text: {
          zh: `${narrator}：假分数是什么意思？\n$\\frac{${improperNum}}{${den}}$：有 ${improperNum} 份，每 ${den} 份组成 1 个整体。\n$${improperNum} > ${den}$，肯定超过 1 个整体！\n\n想象散装粮草要装箱——能装满几箱？`,
          en: `${narrator}: "What does an improper fraction mean?\n$\\frac{${improperNum}}{${den}}$: ${improperNum} slices, every ${den} makes 1 whole.\n$${improperNum} > ${den}$, so definitely more than 1 whole!\n\nImagine packing loose grain into crates — how many full crates?"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：带分数好在哪？\n假分数 $\\frac{${improperNum}}{${den}}$ 不直观——"${improperNum} 份"到底是多少？\n带分数 $${whole}\\frac{${num}}{${den}}$ 一看就懂——"${whole} 个整的加 $\\frac{${num}}{${den}}$"！\n\n日常交流用带分数，计算用假分数——各有所长。`,
          en: `${narrator}: "Why are mixed numbers better for understanding?\nImproper $\\frac{${improperNum}}{${den}}$ isn't intuitive — '${improperNum} slices' means what exactly?\nMixed $${whole}\\frac{${num}}{${den}}$ is clear — '${whole} wholes plus $\\frac{${num}}{${den}}$'!\n\nUse mixed for everyday, improper for calculation — each has its strength."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：方法——分子 ÷ 分母\n$${improperNum} \\div ${den}$\n\n商 = 整数部分（装满了几箱）\n余数 = 新分子（散装几份）\n分母不变 = $${den}$`,
          en: `${narrator}: "Method — numerator ÷ denominator\n$${improperNum} \\div ${den}$\n\nQuotient = whole part (how many full crates)\nRemainder = new numerator (loose items)\nDenominator stays = $${den}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：计算\n$${den} \\times ${whole} = ${whole * den}$，还剩 $${improperNum} - ${whole * den} = ${num}$\n\n商 $${whole}$，余数 $${num}$\n所以 $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$`,
          en: `${narrator}: "Calculate\n$${den} \\times ${whole} = ${whole * den}$, remaining: $${improperNum} - ${whole * den} = ${num}$\n\nQuotient $${whole}$, remainder $${num}$\nSo $\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：答案\n整数部分 = $${whole}$\n\n$\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$\n${improperNum} 份 = ${whole} 整箱 + ${num} 份散装。`,
          en: `${narrator}: "Answer\nWhole part = $${whole}$\n\n$\\frac{${improperNum}}{${den}} = ${whole}\\frac{${num}}{${den}}$\n${improperNum} slices = ${whole} full crates + ${num} loose."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：验算——转回假分数检查\n$${whole} \\times ${den} + ${num} = ${whole * den} + ${num} = ${improperNum}$\n$\\frac{${improperNum}}{${den}}$ ✓\n\n口诀：分子÷分母，商=整数，余数=新分子。做得漂亮！`,
          en: `${narrator}: "Verify — convert back to check\n$${whole} \\times ${den} + ${num} = ${whole * den} + ${num} = ${improperNum}$\n$\\frac{${improperNum}}{${den}}$ ✓\n\nRule: numerator ÷ denom, quotient = whole, remainder = new numerator. Brilliantly done!"`,
        },
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
    {
      text: {
        zh: `${narrator}：先搞懂一个词——"整除"\n$12 \\div 3 = 4$，没有余数 → 整除 ✓\n$12 \\div 5 = 2$ 余 $2$，有余数 → 不整除 ✗\n\n整除 = 除得刚刚好，一点不剩！`,
        en: `${narrator}: "First understand one word — 'divides evenly'\n$12 \\div 3 = 4$, no remainder → divides ✓\n$12 \\div 5 = 2$ r $2$, has remainder → doesn't divide ✗\n\nDivides evenly = nothing left over!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：什么是质数？\n除了 $1$ 和它自己，没有别的数能整除它——就像精锐亲卫：只效忠天子和自己。\n\n$7 \\div 2$ ✗，$7 \\div 3$ ✗ → 只有 $1$ 和 $7$ 能整除 → 质数\n$6 \\div 2 = 3$ ✓ → 有别的因数 → 不是质数`,
        en: `${narrator}: "What is a prime?\nNothing else divides it except $1$ and itself — like elite guards: only answer to the emperor.\n\n$7 \\div 2$ ✗, $7 \\div 3$ ✗ → only $1$ and $7$ work → prime\n$6 \\div 2 = 3$ ✓ → has other factors → not prime"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：两个特殊情况\n• $1$ 不是质数——"$1$ 和自己"不是两个不同的数\n• $2$ 是唯一的偶数质数——所有其他偶数都能被 $2$ 整除\n\n所以除了 $2$，所有质数都是奇数！`,
        en: `${narrator}: "Two special cases\n• $1$ is NOT prime — '1 and itself' aren't two different numbers\n• $2$ is the ONLY even prime — all other evens are divisible by $2$\n\nSo except $2$, all primes are odd!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：怎么判断 $${n}$？从 $2$ 开始逐个试除\n不用试到 $${n}$！试到 $\\sqrt{${n}}$ 就够了。\n\n$${stopBase}\\times${stopBase}=${stopBase*stopBase}$${stopBase*stopBase <= n ? ` \\leq ${n}` : ` > ${n}`}，$${stopNext}\\times${stopNext}=${stopNext*stopNext} > ${n}$\n所以只要试到 $${stopBase}$ 就够了！`,
        en: `${narrator}: "How to check $${n}$? Try dividing from $2$ up\nNo need to go to $${n}$! Up to $\\sqrt{${n}}$ is enough.\n\n$${stopBase}\\times${stopBase}=${stopBase*stopBase}$${stopBase*stopBase <= n ? ` \\leq ${n}` : ` > ${n}`}, $${stopNext}\\times${stopNext}=${stopNext*stopNext} > ${n}$\nSo we only need to test up to $${stopBase}$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：逐个试除 $${n}$\n${trialTable.join('\n')}`,
        en: `${narrator}: "Try dividing $${n}$ one by one\n${trialTableEn.join('\n')}"`,
      },
      highlightField: 'ans',
    },
    ...(result ? [
      {
        text: {
          zh: `${narrator}：全部除不尽！$${n}$ 是质数 ✓\n除了 $1$ 和 $${n}$，没有别的数能整除它。\n\n精锐亲卫，只效忠天子和自己！`,
          en: `${narrator}: "None divide evenly! $${n}$ IS prime ✓\nOnly $1$ and $${n}$ divide it.\n\nElite guard — answers only to the emperor and himself!"`,
        },
        highlightField: 'ans',
      },
    ] : [
      {
        text: {
          zh: `${narrator}：找到了！$${n} \\div ${firstFactor} = ${n/firstFactor}$，整除了！\n$${n} = ${firstFactor} \\times ${n/firstFactor}$——能被拆开，说明有别的"上级"。\n\n$${n}$ 不是质数（是合数）✗`,
          en: `${narrator}: "Found it! $${n} \\div ${firstFactor} = ${n/firstFactor}$, divides evenly!\n$${n} = ${firstFactor} \\times ${n/firstFactor}$ — can be split, meaning other 'commanders' exist.\n\n$${n}$ is NOT prime (it's composite) ✗"`,
        },
        highlightField: 'ans',
      },
    ]),
    {
      text: {
        zh: `${narrator}：答案\n$${n}$ ${result ? '是质数 → 答 $1$' : '不是质数 → 答 $0$'}`,
        en: `${narrator}: "Answer\n$${n}$ ${result ? 'IS prime → answer $1$' : 'is NOT prime → answer $0$'}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：必背——前 10 个质数\n$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$\n\n个位数：$2, 3, 5, 7$（4个）\n十几：$11, 13, 17, 19$（4个）\n二十几：$23, 29$（2个）\n\n后面做因数树会用到！做得漂亮！`,
        en: `${narrator}: "Must memorize — first 10 primes\n$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$\n\nSingle digits: $2, 3, 5, 7$ (4)\nTeens: $11, 13, 17, 19$ (4)\nTwenties: $23, 29$ (2)\n\nYou'll need these for factor trees! Brilliantly done!"`,
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
        zh: `${narrator}：${n} 个新兵要拆成最小的战斗单元——怎么拆？\n"最小单元"就是质数——只能被 $1$ 和自己整除的数。\n$2, 3, 5, 7, 11$ 都是质数。$4$ 不是（$4=2\\times2$），$6$ 不是（$6=2\\times3$）。`,
        en: `${narrator}: "${n} recruits need splitting into smallest units — how?\n'Smallest units' are primes — only divisible by $1$ and themselves.\n$2, 3, 5, 7, 11$ are primes. $4$ is not ($4=2\\times2$), $6$ is not ($6=2\\times3$)."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：画"因数树"——从 $${n}$ 开始一层层往下拆\n方法：从最小的质数 $2$ 开始试。\n能整除就拆成两个数，不能就试下一个质数（$3, 5, 7...$）。\n直到所有数都是质数为止！`,
        en: `${narrator}: "Draw a 'factor tree' — start with $${n}$, split layer by layer\nMethod: try the smallest prime $2$ first.\nDivides evenly? Split into two. Doesn't? Try the next prime ($3, 5, 7...$).\nStop when every number is prime!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：一步步拆 $${n}$\n${factSteps.join('\n')}`,
        en: `${narrator}: "Break down $${n}$ step by step\n${factStepsEn.join('\n')}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：看因数树的"叶子"——最底部不能再拆的数\n叶子们：$${leaves.join(', ')}$\n一共 $${primeCount}$ 个质因数。\n\n这些就是 $${n}$ 的"基本零件"！`,
        en: `${narrator}: "Look at the 'leaves' — bottom numbers that can't split further\nLeaves: $${leaves.join(', ')}$\nTotal: $${primeCount}$ prime factors.\n\nThese are $${n}$'s 'building blocks'!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${n} = ${factorization}$\n\n验算：$${leaves.join(' \\times ')} = ${n}$ ✓`,
        en: `${narrator}: "Answer\n$${n} = ${factorization}$\n\nVerify: $${leaves.join(' \\times ')} = ${n}$ ✓"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：神奇的事——不管怎么拆，最终结果都一样！\n这叫"算术基本定理"。试试从不同的数开始（比如先拆成 $6\\times6$ 而不是 $2\\times18$），叶子排出来一定相同。\n\n每个数的"质数配方"是唯一的——做得漂亮！`,
        en: `${narrator}: "Amazing fact — no matter how you split, the result is always the same!\nThis is the 'Fundamental Theorem of Arithmetic'. Try splitting differently (e.g. $6\\times6$ vs $2\\times18$) — the leaves are always identical.\n\nEvery number has a unique 'prime recipe' — brilliantly done!"`,
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
      text: {
        zh: `${narrator}：$${n}$ 个新兵要编队——有几种等人数的分法？\n比如分成 2 人一队：$${n} \\div 2 = ${n / 2}$${n % 2 === 0 ? '，整除 ✓ 可以！' : '，有余数 ✗ 不行！'}\n\n"因数"就是能把一个数平均分开的数——没有余数才算！`,
        en: `${narrator}: "$${n}$ recruits need squads — how many ways to form equal groups?\nE.g., groups of 2: $${n} \\div 2 = ${n / 2}$${n % 2 === 0 ? ', exact ✓ works!' : ', remainder ✗ doesn\'t work!'}\n\nA 'factor' is a number that divides evenly — no remainder!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：怎么判断能不能整除？看有没有余数！\n$${n} \\div ${testYes} = ${n / testYes}$，没余数 → 整除 ✓ → $${testYes}$ 是因数\n$${n} \\div ${testNo} = ${Math.floor(n / testNo)}$ 余 $${n % testNo}$ → 不整除 ✗ → $${testNo}$ 不是因数\n\n整除 = 除得刚刚好，一点都不剩！`,
        en: `${narrator}: "How to check? Look for remainders!\n$${n} \\div ${testYes} = ${n / testYes}$, no remainder → divides ✓ → $${testYes}$ is a factor\n$${n} \\div ${testNo} = ${Math.floor(n / testNo)}$ r $${n % testNo}$ → doesn't divide ✗ → $${testNo}$ is not\n\nDivides evenly = nothing left over!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：秘诀——因数总是成对出现！\n找到一个因数，就自动得到另一个：\n${pairs.join('\n')}\n\n每一对相乘都等于 $${n}$！所以只要试到 $\\sqrt{${n}}$ 就够了。`,
        en: `${narrator}: "Secret — factors always come in pairs!\nFind one factor, automatically get another:\n${pairs.join('\n')}\n\nEach pair multiplies to $${n}$! So we only need to test up to $\\sqrt{${n}}$."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：把所有因数从小到大排列\n$${n}$ 的全部因数：$${factors.join(', ')}$\n\n一共 $${answer}$ 个因数！`,
        en: `${narrator}: "List all factors from smallest to largest\nAll factors of $${n}$: $${factors.join(', ')}$\n\nTotal: $${answer}$ factors!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——每个因数都能整除 $${n}$\n${factors.map(f => `$${n} \\div ${f} = ${n / f}$ ✓`).join('\n')}\n\n全部整除！$${n}$ 有 $${answer}$ 种编队方式。`,
        en: `${narrator}: "Verify — every factor divides $${n}$ evenly\n${factors.map(f => `$${n} \\div ${f} = ${n / f}$ ✓`).join('\n')}\n\nAll check out! $${n}$ has $${answer}$ ways to form equal groups."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：记住——1 和自身永远是因数！\n$${n} \\div 1 = ${n}$ ✓，$${n} \\div ${n} = 1$ ✓\n\n所以因数至少有 2 个。如果**只有** 1 和自己——那就是质数！（下一关会学）`,
        en: `${narrator}: "Remember — 1 and the number itself are ALWAYS factors!\n$${n} \\div 1 = ${n}$ ✓, $${n} \\div ${n} = 1$ ✓\n\nSo there are always at least 2 factors. If ONLY 1 and itself — that's a prime! (next mission)"`,
      },
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
      zh: `${narrator}：方法二——短除法！一张图同时算 HCF 和 LCM\n把 $${a}$ 和 $${b}$ 并排写，找能同时整除两个数的质数，写在左边。`,
      en: `${narrator}: "Method 2 — short division! One diagram gives both HCF and LCM\nWrite $${a}$ and $${b}$ side by side, find a prime dividing both, write it on the left."`,
    },
    highlightField: 'ans',
  });

  const tph0 = tryPrimesHint(0);
  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：找能同时整除 $${a}$ 和 $${b}$ 的最小质数\n${tph0.zh}`,
      en: `${narrator}: "Find the smallest prime dividing both $${a}$ and $${b}$\n${tph0.en}"`,
    },
    highlightField: 'ans',
  });

  if (sd.steps.length === 1) {
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：底部 $${sd.bottomA}$ 和 $${sd.bottomB}$ 互质（没有公因数了），停止！`,
        en: `${narrator}: "Bottom $${sd.bottomA}$ and $${sd.bottomB}$ are coprime (no common factor) — stop!"`,
      },
      highlightField: 'ans',
    });
  } else if (sd.steps.length === 2) {
    const tph1 = tryPrimesHint(1);
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：继续找 $${sd.steps[0].quotientA}$ 和 $${sd.steps[0].quotientB}$ 的公因数\n${tph1.zh}`,
        en: `${narrator}: "Continue — common factor of $${sd.steps[0].quotientA}$ and $${sd.steps[0].quotientB}$\n${tph1.en}"`,
      },
      highlightField: 'ans',
    });
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：底部 $${sd.bottomA}$ 和 $${sd.bottomB}$ 互质，停止！`,
        en: `${narrator}: "Bottom $${sd.bottomA}$ and $${sd.bottomB}$ are coprime — stop!"`,
      },
      highlightField: 'ans',
    });
  } else {
    const tph1 = tryPrimesHint(1);
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：继续找 $${sd.steps[0].quotientA}$ 和 $${sd.steps[0].quotientB}$ 的公因数\n${tph1.zh}`,
        en: `${narrator}: "Continue — common factor of $${sd.steps[0].quotientA}$ and $${sd.steps[0].quotientB}$\n${tph1.en}"`,
      },
      highlightField: 'ans',
    });
    sdTutorialSteps.push({
      text: {
        zh: `${narrator}：继续除，直到底部两数互质\n看左边的 SVG 图——所有步骤已完成！`,
        en: `${narrator}: "Keep dividing until bottom numbers are coprime\nSee the SVG diagram — all steps complete!"`,
      },
      highlightField: 'ans',
    });
  }

  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：读 HCF = 左边那列全乘起来\n$${leftCol.join(' \\times ')} = ${hcfFromSD}$\n\n左边是两个数"共同能整除"的部分，乘起来 = HCF！`,
      en: `${narrator}: "Read HCF = multiply the left column\n$${leftCol.join(' \\times ')} = ${hcfFromSD}$\n\nLeft column = shared divisible parts, product = HCF!"`,
    },
    highlightField: 'ans',
  });

  sdTutorialSteps.push({
    text: {
      zh: `${narrator}：顺便——LCM = 左边 × 底部全乘起来\n$${leftCol.join(' \\times ')} \\times ${sd.bottomA} \\times ${sd.bottomB} = ${lcmFromSD}$\n\n左边 = 公共部分，底部 = 各自剩下的，合起来 = LCM！`,
      en: `${narrator}: "Bonus — LCM = left × bottom, all multiplied\n$${leftCol.join(' \\times ')} \\times ${sd.bottomA} \\times ${sd.bottomB} = ${lcmFromSD}$\n\nLeft = shared, bottom = remainders, combined = LCM!"`,
    },
    highlightField: 'ans',
  });

  const tutorialSteps = [
    // Phase 1: listing factors
    {
      text: {
        zh: `${narrator}：$${a}$ 人和 $${b}$ 人分成一样大的小队，每队最多几人？\n"能分" = 除得尽、没有余数（$12 \\div 3 = 4$ ✓，$12 \\div 5 = 2.4$ ✗）。\n先用最简单的方法——挨个试！`,
        en: `${narrator}: "$${a}$ and $${b}$ people into equal squads — max per squad?\n'Can split' = divides evenly ($12 \\div 3 = 4$ ✓, $12 \\div 5 = 2.4$ ✗).\nSimplest method first — test one by one!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${a}$ 的因数（能整除 $${a}$ 的数）\n${factorsA.map(f => `$${a} \\div ${f} = ${a/f}$ ✓`).join('，')}\n\n$${a}$ 的因数：$${factorsA.join(', ')}$`,
        en: `${narrator}: "Factors of $${a}$ (numbers that divide $${a}$ evenly)\n${factorsA.map(f => `$${a} \\div ${f} = ${a/f}$ ✓`).join(', ')}\n\nFactors of $${a}$: $${factorsA.join(', ')}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${b}$ 的因数\n${factorsB.map(f => `$${b} \\div ${f} = ${b/f}$ ✓`).join('，')}\n\n$${b}$ 的因数：$${factorsB.join(', ')}$`,
        en: `${narrator}: "Factors of $${b}$\n${factorsB.map(f => `$${b} \\div ${f} = ${b/f}$ ✓`).join(', ')}\n\nFactors of $${b}$: $${factorsB.join(', ')}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：找两边都有的——"公因数"\n$${a}$：$${factorsA.join(', ')}$\n$${b}$：$${factorsB.join(', ')}$\n\n都有的：$${commonFactors.join(', ')}$`,
        en: `${narrator}: "Find what's in BOTH lists — 'common factors'\n$${a}$: $${factorsA.join(', ')}$\n$${b}$: $${factorsB.join(', ')}$\n\nIn both: $${commonFactors.join(', ')}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：公因数里最大的 = $${h}$ → HCF!\n验算：$${a} \\div ${h} = ${a/h}$ ✓，$${b} \\div ${h} = ${b/h}$ ✓\n\n每队 $${h}$ 人，整编完成！`,
        en: `${narrator}: "Largest common factor = $${h}$ → HCF!\nVerify: $${a} \\div ${h} = ${a/h}$ ✓, $${b} \\div ${h} = ${b/h}$ ✓\n\n$${h}$ per squad — formation complete!"`,
      },
      highlightField: 'ans',
    },
    // Phase 2: Short division (dynamic steps)
    ...sdTutorialSteps,
    // Phase 3: Prime factorization
    {
      text: {
        zh: `${narrator}：方法三——质因数分解\n$${a} = ${factA}$\n$${b} = ${factB}$\n\n和短除法本质相同，只是画法不同。`,
        en: `${narrator}: "Method 3 — prime factorization\n$${a} = ${factA}$\n$${b} = ${factB}$\n\nSame idea as short division, different notation."`,
      },
      highlightField: 'ans',
    },
    {
      text: (() => {
        const fA = primeFactors(a);
        const fB = primeFactors(b);
        const lines: string[] = [];
        const enLines: string[] = [];
        for (const [p, expA] of fA) {
          const expB = fB.get(p);
          if (expB !== undefined) {
            const minExp = Math.min(expA, expB);
            lines.push(`$${p}$：$${a}$ 有 ${expA} 个，$${b}$ 有 ${expB} 个 → 取少的 = ${minExp} 个`);
            enLines.push(`$${p}$: $${a}$ has ${expA}, $${b}$ has ${expB} → take smaller = ${minExp}`);
          }
        }
        return { zh: `${narrator}：共有质数取少的 = HCF\n${lines.join('\n')}`, en: `${narrator}: "Common primes, take smaller count = HCF\n${enLines.join('\n')}"` };
      })(),
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：HCF = $${formatFactorization(h)} = ${h}$\n三种方法，同一个答案！\n验算：$${a} \\div ${h} = ${a/h}$ ✓，$${b} \\div ${h} = ${b/h}$ ✓`,
        en: `${narrator}: "HCF = $${formatFactorization(h)} = ${h}$\nThree methods, same answer!\nVerify: $${a} \\div ${h} = ${a/h}$ ✓, $${b} \\div ${h} = ${b/h}$ ✓"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：三种方法各有用处\n• 挨个试：最简单，适合初学\n• 短除法：最快，同时求 HCF 和 LCM，推荐做题用\n• 质因数分解：适合理解原理\n\n做得漂亮！`,
        en: `${narrator}: "Each method has its use\n• Test one by one: simplest, good for beginners\n• Short division: fastest, gives both HCF and LCM, best for exams\n• Prime factorization: best for understanding theory\n\nBrilliantly done!"`,
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
    highlightField: 'ans',
  });

  const tphL0 = tryPrimesHintL(0);
  sdLcmSteps.push({
    text: {
      zh: `${narrator}：找能同时整除 $${a}$ 和 $${b}$ 的最小质数\n${tphL0.zh}`,
      en: `${narrator}: "Find the smallest prime dividing both $${a}$ and $${b}$\n${tphL0.en}"`,
    },
    highlightField: 'ans',
  });

  if (sdL.steps.length === 1) {
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：底部 $${sdL.bottomA}$ 和 $${sdL.bottomB}$ 互质，停止！`,
        en: `${narrator}: "Bottom $${sdL.bottomA}$ and $${sdL.bottomB}$ are coprime — stop!"`,
      },
      highlightField: 'ans',
    });
  } else if (sdL.steps.length === 2) {
    const tphL1 = tryPrimesHintL(1);
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：继续找 $${sdL.steps[0].quotientA}$ 和 $${sdL.steps[0].quotientB}$ 的公因数\n${tphL1.zh}`,
        en: `${narrator}: "Continue — common factor of $${sdL.steps[0].quotientA}$ and $${sdL.steps[0].quotientB}$\n${tphL1.en}"`,
      },
      highlightField: 'ans',
    });
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：底部 $${sdL.bottomA}$ 和 $${sdL.bottomB}$ 互质，停止！`,
        en: `${narrator}: "Bottom $${sdL.bottomA}$ and $${sdL.bottomB}$ are coprime — stop!"`,
      },
      highlightField: 'ans',
    });
  } else {
    const tphL1 = tryPrimesHintL(1);
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：继续找 $${sdL.steps[0].quotientA}$ 和 $${sdL.steps[0].quotientB}$ 的公因数\n${tphL1.zh}`,
        en: `${narrator}: "Continue — common factor of $${sdL.steps[0].quotientA}$ and $${sdL.steps[0].quotientB}$\n${tphL1.en}"`,
      },
      highlightField: 'ans',
    });
    sdLcmSteps.push({
      text: {
        zh: `${narrator}：继续除，直到底部两数互质\n看左边的 SVG 图——所有步骤已完成！`,
        en: `${narrator}: "Keep dividing until bottom numbers are coprime\nSee the SVG diagram — all steps complete!"`,
      },
      highlightField: 'ans',
    });
  }

  sdLcmSteps.push({
    text: {
      zh: `${narrator}：LCM = 左边 × 底部全乘起来\n$${leftColL.join(' \\times ')} \\times ${sdL.bottomA} \\times ${sdL.bottomB} = ${lcmFromSDL}$\n\n左边 = 公共部分，底部 = 各自剩余，合起来 = LCM！`,
      en: `${narrator}: "LCM = left × bottom, all multiplied\n$${leftColL.join(' \\times ')} \\times ${sdL.bottomA} \\times ${sdL.bottomB} = ${lcmFromSDL}$\n\nLeft = shared, bottom = remainders, combined = LCM!"`,
    },
    highlightField: 'ans',
  });

  sdLcmSteps.push({
    text: {
      zh: `${narrator}：为什么？\n$${a} = ${factA}$，$${b} = ${factB}$\n左边（$${leftColL.join(' \\times ')}$）= 共有部分，底部（$${sdL.bottomA}, ${sdL.bottomB}$）= 独有部分。\n全乘 = 不重不漏包含所有质因数！`,
      en: `${narrator}: "Why?\n$${a} = ${factA}$, $${b} = ${factB}$\nLeft ($${leftColL.join(' \\times ')}$) = shared, bottom ($${sdL.bottomA}, ${sdL.bottomB}$) = unique.\nMultiply all = every prime factor covered, no double-counting!"`,
    },
    highlightField: 'ans',
  });

  const tutorialSteps = [
    // Phase 1: listing multiples
    {
      text: {
        zh: `${narrator}：先用最简单的方法——列出倍数，看哪个最先"撞上"\n倍数 = 用这个数 × 1, 2, 3, 4... 得到的数。`,
        en: `${narrator}: "Simplest method first — list multiples and see which matches first\nMultiples = multiply the number by 1, 2, 3, 4..."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${a}$ 的倍数\n$${multiplesA.join(', ')}$`,
        en: `${narrator}: "Multiples of $${a}$\n$${multiplesA.join(', ')}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${b}$ 的倍数\n$${multiplesB.join(', ')}$`,
        en: `${narrator}: "Multiples of $${b}$\n$${multiplesB.join(', ')}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：找两边都有的！\n$${a}$：$${multiplesA.join(', ')}$\n$${b}$：$${multiplesB.join(', ')}$\n\n都有的：$${commonMultiples.join(', ')}$——最小的是 $${lcm}$！`,
        en: `${narrator}: "Find what's in BOTH!\n$${a}$: $${multiplesA.join(', ')}$\n$${b}$: $${multiplesB.join(', ')}$\n\nIn both: $${commonMultiples.join(', ')}$ — smallest is $${lcm}$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：LCM($${a}$, $${b}$) = $${lcm}$\n验算：$${lcm} \\div ${a} = ${lcm/a}$ ✓，$${lcm} \\div ${b} = ${lcm/b}$ ✓\n\n"同时能被两个数整除的最小数" = 最小公倍数 (LCM)！`,
        en: `${narrator}: "LCM($${a}$, $${b}$) = $${lcm}$\nCheck: $${lcm} \\div ${a} = ${lcm/a}$ ✓, $${lcm} \\div ${b} = ${lcm/b}$ ✓\n\n'Smallest number divisible by both' = Least Common Multiple (LCM)!"`,
      },
      highlightField: 'ans',
    },
    // Phase 2: Short division (dynamic steps)
    ...sdLcmSteps,
    // Phase 3: Prime factorization
    {
      text: {
        zh: `${narrator}：方法三——质因数分解\n$${a} = ${factA}$\n$${b} = ${factB}$`,
        en: `${narrator}: "Method 3 — prime factorization\n$${a} = ${factA}$\n$${b} = ${factB}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: (() => {
        const fA = primeFactors(a);
        const fB = primeFactors(b);
        const allPrimes = new Set([...fA.keys(), ...fB.keys()]);
        const lines: string[] = [];
        const enLines: string[] = [];
        for (const p of [...allPrimes].sort((x, y) => x - y)) {
          const expA = fA.get(p) || 0;
          const expB = fB.get(p) || 0;
          lines.push(`$${p}$：$${a}$ 有 ${expA} 个，$${b}$ 有 ${expB} 个 → 取多的 = ${Math.max(expA, expB)} 个`);
          enLines.push(`$${p}$: $${a}$ has ${expA}, $${b}$ has ${expB} → take larger = ${Math.max(expA, expB)}`);
        }
        return { zh: `${narrator}：和 HCF 正好相反！HCF 取少的，LCM 取多的\n${lines.join('\n')}`, en: `${narrator}: "Opposite of HCF! HCF takes smaller, LCM takes larger\n${enLines.join('\n')}"` };
      })(),
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：LCM = $${formatFactorization(lcm)} = ${lcm}$\n三种方法，同一个答案！\n验算：$${lcm} \\div ${a} = ${lcm/a}$ ✓，$${lcm} \\div ${b} = ${lcm/b}$ ✓`,
        en: `${narrator}: "LCM = $${formatFactorization(lcm)} = ${lcm}$\nThree methods, same answer!\nVerify: $${lcm} \\div ${a} = ${lcm/a}$ ✓, $${lcm} \\div ${b} = ${lcm/b}$ ✓"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：三种方法各有用处\n• 列倍数：最简单，适合初学\n• 短除法：最快，同时求 HCF 和 LCM，推荐做题用\n• 质因数分解：适合理解原理\n\n做得漂亮！`,
        en: `${narrator}: "Each method has its use\n• List multiples: simplest, good for beginners\n• Short division: fastest, gives both HCF and LCM, best for exams\n• Prime factorization: best for understanding theory\n\nBrilliantly done!"`,
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
        zh: `${narrator}：为什么叫"平方"？\n想象一块正方形的营地，边长 $${n}$ 丈。\n正方形面积 = 边长 × 边长 = $${n} \\times ${n}$。\n\n"平方"就是一个数**乘以自己**——因为正方形是"平"的！`,
        en: `${narrator}: "Why is it called 'squaring'?\nImagine a square camp, side length $${n}$.\nSquare area = side × side = $${n} \\times ${n}$.\n\n'Squaring' means a number TIMES ITSELF — because a square is flat!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${n}^2$ 就是 $${n} \\times ${n}$\n把 ${n} 个士兵排成 $${n}$ 行 $${n}$ 列的方阵——总共多少人？\n\n$${n} \\times ${n} = ${answer}$\n\n方阵排好了！`,
        en: `${narrator}: "$${n}^2$ means $${n} \\times ${n}$\nArrange soldiers in a $${n}$ × $${n}$ square formation — how many total?\n\n$${n} \\times ${n} = ${answer}$\n\nFormation complete!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${n}^2 = ${answer}$\n\n$${n}$ 的平方就是 $${answer}$——方阵里有 $${answer}$ 个士兵。`,
        en: `${narrator}: "Answer\n$${n}^2 = ${answer}$\n\n$${n}$ squared is $${answer}$ — the formation has $${answer}$ soldiers."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——$\\sqrt{${answer}} = ${n}$ ✓\n$${n} \\times ${n} = ${answer}$，反过来 $\\sqrt{${answer}} = ${n}$。\n\n平方和平方根是互逆运算——就像加和减一样！`,
        en: `${narrator}: "Verify — $\\sqrt{${answer}} = ${n}$ ✓\n$${n} \\times ${n} = ${answer}$, and $\\sqrt{${answer}} = ${n}$.\n\nSquaring and square root are inverse operations — like addition and subtraction!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：必背——前 10 个平方数\n$1^2=1$，$2^2=4$，$3^2=9$，$4^2=16$，$5^2=25$\n$6^2=36$，$7^2=49$，$8^2=64$，$9^2=81$，$10^2=100$\n\n背下这些，以后一看就知道答案！`,
        en: `${narrator}: "Must memorize — first 10 perfect squares\n$1^2=1$, $2^2=4$, $3^2=9$, $4^2=16$, $5^2=25$\n$6^2=36$, $7^2=49$, $8^2=64$, $9^2=81$, $10^2=100$\n\nMemorize these and you'll know instantly!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：小窍门——平方数的规律\n$1, 4, 9, 16, 25, 36, 49, 64, 81, 100$\n相邻平方数的差：$3, 5, 7, 9, 11, 13, 15, 17, 19$\n\n差总是连续的奇数！这就是平方的秘密。做得漂亮！`,
        en: `${narrator}: "Cool pattern — differences between squares\n$1, 4, 9, 16, 25, 36, 49, 64, 81, 100$\nDifferences: $3, 5, 7, 9, 11, 13, 15, 17, 19$\n\nAlways consecutive odd numbers! That's the secret of squares. Brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：为什么叫"立方"？\n想象一个正方体的粮箱，边长 $${n}$ 丈。\n正方体体积 = 边长 × 边长 × 边长 = $${n} \\times ${n} \\times ${n}$。\n\n"立方"就是一个数**乘三次**——因为正方体是"立"体的！`,
        en: `${narrator}: "Why is it called 'cubing'?\nImagine a cube-shaped crate, side $${n}$.\nCube volume = side × side × side = $${n} \\times ${n} \\times ${n}$.\n\n'Cubing' means a number TIMES ITSELF THREE TIMES — because a cube is 3D!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${n}^3$ 分两步算\n先算 $${n} \\times ${n} = ${n*n}$（一层有多少）\n再乘 $${n}$：$${n*n} \\times ${n} = ${answer}$（$${n}$ 层叠起来）\n\n就像码粮箱：$${n}$ 层，每层 $${n}$ 行 $${n}$ 列。`,
        en: `${narrator}: "$${n}^3$ in two steps\nFirst: $${n} \\times ${n} = ${n*n}$ (one layer)\nThen × $${n}$: $${n*n} \\times ${n} = ${answer}$ (stack $${n}$ layers)\n\nLike stacking crates: $${n}$ layers of $${n}$ × $${n}$."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${n}^3 = ${answer}$\n\n$${n}$ 的立方就是 $${answer}$——粮箱能装这么多！`,
        en: `${narrator}: "Answer\n$${n}^3 = ${answer}$\n\n$${n}$ cubed is $${answer}$ — that's how much the crate holds!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——$\\sqrt[3]{${answer}} = ${n}$ ✓\n$${n} \\times ${n} \\times ${n} = ${answer}$，反过来 $\\sqrt[3]{${answer}} = ${n}$。\n\n立方和立方根是互逆运算！`,
        en: `${narrator}: "Verify — $\\sqrt[3]{${answer}} = ${n}$ ✓\n$${n} \\times ${n} \\times ${n} = ${answer}$, and $\\sqrt[3]{${answer}} = ${n}$.\n\nCubing and cube root are inverse operations!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：必背——前 5 个立方数\n$1^3=1$，$2^3=8$，$3^3=27$，$4^3=64$，$5^3=125$\n\n立方数增长比平方快得多——$5^3 = 125$，但 $5^2$ 才 $25$！`,
        en: `${narrator}: "Must memorize — first 5 perfect cubes\n$1^3=1$, $2^3=8$, $3^3=27$, $4^3=64$, $5^3=125$\n\nCubes grow much faster than squares — $5^3 = 125$, but $5^2$ is only $25$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：平方 vs 立方——对比记忆\n平方（$n^2$）= 面积（二维，$n \\times n$）\n立方（$n^3$）= 体积（三维，$n \\times n \\times n$）\n\n指数 2 = 二维，指数 3 = 三维——指数就是维度！做得漂亮！`,
        en: `${narrator}: "Square vs Cube — compare and remember\nSquare ($n^2$) = area (2D, $n \\times n$)\nCube ($n^3$) = volume (3D, $n \\times n \\times n$)\n\nExponent 2 = 2D, exponent 3 = 3D — the exponent IS the dimension! Brilliantly done!"`,
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
        zh: `${narrator}：为什么要学平方根？\n侦察到敌军方阵 $${n}$ 人——每行几人？\n\n知道总面积（$${n}$），反推边长——这就是平方根！\n平方根是平方的**反操作**："谁的平方等于 $${n}$？"`,
        en: `${narrator}: "Why learn square roots?\nEnemy square formation has $${n}$ soldiers — how many per row?\n\nKnow the total area ($${n}$), find the side — that's the square root!\nSquare root is the REVERSE of squaring: 'whose square equals $${n}$?'"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：怎么找？想想哪个数乘以自己等于 $${n}$\n$${answer} \\times ${answer} = ${n}$ ✓\n\n所以 $\\sqrt{${n}} = ${answer}$——方阵每行 $${answer}$ 人！`,
        en: `${narrator}: "How to find it? Think: which number times itself equals $${n}$?\n$${answer} \\times ${answer} = ${n}$ ✓\n\nSo $\\sqrt{${n}} = ${answer}$ — $${answer}$ soldiers per row!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：如果不确定，可以试几个数\n$${answer > 2 ? `${answer-1} \\times ${answer-1} = ${(answer-1)*(answer-1)}$（太小）\n` : ''}${answer} \\times ${answer} = ${n}$（刚好！）\n${answer < 15 ? `$${answer+1} \\times ${answer+1} = ${(answer+1)*(answer+1)}$（太大）` : ''}\n\n夹在中间一试就知道了！`,
        en: `${narrator}: "If unsure, try a few numbers\n${answer > 2 ? `$${answer-1} \\times ${answer-1} = ${(answer-1)*(answer-1)}$ (too small)\n` : ''}$${answer} \\times ${answer} = ${n}$ (perfect!)\n${answer < 15 ? `$${answer+1} \\times ${answer+1} = ${(answer+1)*(answer+1)}$ (too big)` : ''}\n\nBracket it and you'll find it!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$\\sqrt{${n}} = ${answer}$`,
        en: `${narrator}: "Answer\n$\\sqrt{${n}} = ${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——平方回去\n$${answer}^2 = ${answer} \\times ${answer} = ${n}$ ✓\n\n平方和平方根是互逆运算——就像乘法和除法！`,
        en: `${narrator}: "Verify — square it back\n$${answer}^2 = ${answer} \\times ${answer} = ${n}$ ✓\n\nSquaring and square root are inverses — like multiplication and division!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：必背表\n$\\sqrt{4}=2$，$\\sqrt{9}=3$，$\\sqrt{16}=4$，$\\sqrt{25}=5$\n$\\sqrt{36}=6$，$\\sqrt{49}=7$，$\\sqrt{64}=8$，$\\sqrt{81}=9$，$\\sqrt{100}=10$\n\n背熟这些，平方根一秒搞定！做得漂亮！`,
        en: `${narrator}: "Must memorize\n$\\sqrt{4}=2$, $\\sqrt{9}=3$, $\\sqrt{16}=4$, $\\sqrt{25}=5$\n$\\sqrt{36}=6$, $\\sqrt{49}=7$, $\\sqrt{64}=8$, $\\sqrt{81}=9$, $\\sqrt{100}=10$\n\nMemorize these and square roots take one second! Brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：为什么要学立方根？\n粮仓体积 $${n}$ 立方，边长是多少？\n\n知道总体积，反推边长——这就是立方根！\n立方根是立方的**反操作**："谁的立方等于 $${n}$？"`,
        en: `${narrator}: "Why learn cube roots?\nWarehouse volume is $${n}$ cubic — what's the side length?\n\nKnow the volume, find the side — that's the cube root!\nCube root is the REVERSE of cubing: 'whose cube equals $${n}$?'"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：哪个数乘三次等于 $${n}$？\n$${answer} \\times ${answer} \\times ${answer} = ${n}$ ✓\n\n所以 $\\sqrt[3]{${n}} = ${answer}$——粮仓边长 $${answer}$！`,
        en: `${narrator}: "Which number times itself three times equals $${n}$?\n$${answer} \\times ${answer} \\times ${answer} = ${n}$ ✓\n\nSo $\\sqrt[3]{${n}} = ${answer}$ — warehouse side = $${answer}$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$\\sqrt[3]{${n}} = ${answer}$`,
        en: `${narrator}: "Answer\n$\\sqrt[3]{${n}} = ${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——立方回去\n$${answer}^3 = ${answer} \\times ${answer} \\times ${answer} = ${n}$ ✓\n\n立方和立方根是互逆运算！`,
        en: `${narrator}: "Verify — cube it back\n$${answer}^3 = ${answer} \\times ${answer} \\times ${answer} = ${n}$ ✓\n\nCubing and cube root are inverses!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：必背表\n$\\sqrt[3]{8}=2$，$\\sqrt[3]{27}=3$，$\\sqrt[3]{64}=4$，$\\sqrt[3]{125}=5$\n$\\sqrt[3]{216}=6$，$\\sqrt[3]{343}=7$，$\\sqrt[3]{512}=8$，$\\sqrt[3]{729}=9$，$\\sqrt[3]{1000}=10$`,
        en: `${narrator}: "Must memorize\n$\\sqrt[3]{8}=2$, $\\sqrt[3]{27}=3$, $\\sqrt[3]{64}=4$, $\\sqrt[3]{125}=5$\n$\\sqrt[3]{216}=6$, $\\sqrt[3]{343}=7$, $\\sqrt[3]{512}=8$, $\\sqrt[3]{729}=9$, $\\sqrt[3]{1000}=10$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：平方根 vs 立方根——对比记忆\n$\\sqrt{n}$：谁 × 谁 = $n$？（面积→边长）\n$\\sqrt[3]{n}$：谁 × 谁 × 谁 = $n$？（体积→边长）\n\n根号里的小数字告诉你"乘几次"。没数字 = 2次，3 = 3次。做得漂亮！`,
        en: `${narrator}: "Square root vs Cube root — compare\n$\\sqrt{n}$: who × who = $n$? (area → side)\n$\\sqrt[3]{n}$: who × who × who = $n$? (volume → side)\n\nThe small number in the root tells you 'how many times'. No number = 2, 3 = 3. Brilliantly done!"`,
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
        zh: `${narrator}：为什么指数这么有用？\n粮草倍增的故事：1石粮食，每月翻倍，3个月后多少？$2^3=8$ 石！\n指数就是"连续乘"的简写——$2^{3}$ 表示 $2 \\times 2 \\times 2$。\n底数(base)是被乘的数，指数(index)是乘的次数。`,
        en: `${narrator}: "Why are indices so useful?\nA grain-doubling story: 1 bushel of grain doubles each month — after 3 months? $2^3=8$ bushels!\nAn index is shorthand for 'repeated multiplication' — $2^{3}$ means $2 \\times 2 \\times 2$.\nBase = the number being multiplied. Index = how many times."`,
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
    {
      text: op === 'div' ? {
        zh: `${narrator}：验算\n把指数展开：$${base}^{${e1}} = ${base}$ 乘 $${e1}$ 次，$${base}^{${e2}} = ${base}$ 乘 $${e2}$ 次。\n除法 = 消去 $${e2}$ 个 $${base}$，剩下 $${e1} - ${e2} = ${ans}$ 个，即 $${base}^{${ans}}$ ✓`,
        en: `${narrator}: "Verify\nExpand: $${base}^{${e1}}$ = $${base}$ multiplied $${e1}$ times, $${base}^{${e2}}$ = $${base}$ multiplied $${e2}$ times.\nDivision = cancel $${e2}$ copies of $${base}$, leaving $${e1} - ${e2} = ${ans}$ copies, i.e. $${base}^{${ans}}$ ✓"`,
      } : {
        zh: `${narrator}：验算\n把指数展开：$${base}^{${e1}} = ${base}$ 乘 $${e1}$ 次，$${base}^{${e2}} = ${base}$ 乘 $${e2}$ 次。\n合在一起 = $${base}$ 乘 $${e1} + ${e2} = ${ans}$ 次，即 $${base}^{${ans}}$ ✓`,
        en: `${narrator}: "Verify\nExpand: $${base}^{${e1}}$ = $${base}$ multiplied $${e1}$ times, $${base}^{${e2}}$ = $${base}$ multiplied $${e2}$ times.\nCombined = $${base}$ multiplied $${e1} + ${e2} = ${ans}$ times, i.e. $${base}^{${ans}}$ ✓"`,
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
    { frac: '7/10', num: 7, den: 10, dec: 0.7, pct: 70 },
  ];

  const pool = tier === 1 ? fdpSets.slice(0, 4) : tier === 2 ? fdpSets.slice(0, 7) : fdpSets;
  const chosen = pickRandom(pool);

  // Decide conversion direction
  const directions = ['frac_to_pct', 'pct_to_dec', 'dec_to_frac'] as const;
  const dir = pickRandom([...(tier === 1 ? directions.slice(0, 1) : directions)]);

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
      text: {
        zh: `${narrator}：为什么要学转换？\n将军说"半数兵力"，军师说"0.5倍兵力"，谋士说"50%兵力"——说的是同一件事！\n\n分数、小数、百分比是三种写法，你必须能自由切换。`,
        en: `${narrator}: "Why learn conversions?\nThe general says 'half the troops', the adviser says '0.5 of the troops', the strategist says '50%' — all the same thing!\n\nFractions, decimals, percentages are three forms. You must switch freely between them."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：三种写法，同一个数\n$\\frac{1}{2} = 0.5 = 50\\%$\n\n就像同一个人有大名、小名、绰号——换个写法，但数值不变！`,
        en: `${narrator}: "Three forms, one value\n$\\frac{1}{2} = 0.5 = 50\\%$\n\nLike the same person with a formal name, nickname, and title — different form, same value!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：转换秘诀\n分数 → 小数：分子 ÷ 分母\n$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.num} \\div ${chosen.den} = ${chosen.dec}$\n\n小数 → 百分比：乘 100 → $${chosen.dec} \\times 100 = ${chosen.pct}\\%$\n百分比 → 小数：除 100 → $${chosen.pct}\\% \\div 100 = ${chosen.dec}$`,
        en: `${narrator}: "Conversion secrets\nFraction → Decimal: numerator ÷ denominator\n$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.num} \\div ${chosen.den} = ${chosen.dec}$\n\nDecimal → %: × 100 → $${chosen.dec} \\times 100 = ${chosen.pct}\\%$\n% → Decimal: ÷ 100 → $${chosen.pct}\\% \\div 100 = ${chosen.dec}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.dec} = ${chosen.pct}\\%$\n\n答案 = $${answer}$`,
        en: `${narrator}: "Answer\n$\\frac{${chosen.num}}{${chosen.den}} = ${chosen.dec} = ${chosen.pct}\\%$\n\nAnswer = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——反向转换回去\n${dir === 'frac_to_pct'
          ? `$${chosen.pct}\\% \\div 100 = ${chosen.dec}$，$${chosen.dec} = \\frac{${chosen.num}}{${chosen.den}}$ ✓`
          : dir === 'pct_to_dec'
          ? `$${chosen.dec} \\times 100 = ${chosen.pct}\\%$ ✓`
          : `$${chosen.pct}\\% \\div 100 = ${chosen.dec}$ ✓`}\n\n正反都对得上——转换正确！`,
        en: `${narrator}: "Verify — convert back\n${dir === 'frac_to_pct'
          ? `$${chosen.pct}\\% \\div 100 = ${chosen.dec}$, $${chosen.dec} = \\frac{${chosen.num}}{${chosen.den}}$ ✓`
          : dir === 'pct_to_dec'
          ? `$${chosen.dec} \\times 100 = ${chosen.pct}\\%$ ✓`
          : `$${chosen.pct}\\% \\div 100 = ${chosen.dec}$ ✓`}\n\nBoth directions match — conversion correct!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：必背——常见对照表\n$\\frac{1}{2} = 50\\%$，$\\frac{1}{4} = 25\\%$，$\\frac{3}{4} = 75\\%$\n$\\frac{1}{5} = 20\\%$，$\\frac{2}{5} = 40\\%$，$\\frac{3}{5} = 60\\%$\n$\\frac{1}{10} = 10\\%$，$\\frac{1}{3} \\approx 33.3\\%$\n\n背下这些，考试快人一步！`,
        en: `${narrator}: "Must memorize — quick reference\n$\\frac{1}{2} = 50\\%$, $\\frac{1}{4} = 25\\%$, $\\frac{3}{4} = 75\\%$\n$\\frac{1}{5} = 20\\%$, $\\frac{2}{5} = 40\\%$, $\\frac{3}{5} = 60\\%$\n$\\frac{1}{10} = 10\\%$, $\\frac{1}{3} \\approx 33.3\\%$\n\nMemorize these and you'll be faster than everyone!"`,
      },
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
      text: {
        zh: `${narrator}：为什么不能从左到右算？\n日常读句子从左到右，但数学不一样！运算有"军衔"：\n\n乘除 > 加减——将军的命令比士兵优先。\n$2 + 3 \\times 4$：乘法（将军）先行，加法（士兵）等候！`,
        en: `${narrator}: "Why not just left to right?\nWe read sentences left to right, but math is different! Operations have 'ranks':\n\nMultiply/Divide > Add/Subtract — general's orders override soldiers'.\n$2 + 3 \\times 4$: multiplication (general) first, addition (soldier) waits!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：BODMAS——运算的军衔表\nB — Brackets 括号（统帅级，最高！）\nO — Orders 幂/根号（将军级）\nDM — Division/Multiplication 乘除（校官级）\nAS — Addition/Subtraction 加减（士兵级）\n\n同级的（比如又乘又除）→ 从左到右。`,
        en: `${narrator}: "BODMAS — the rank table\nB — Brackets (Commander, highest!)\nO — Orders/Powers (General)\nDM — Division/Multiplication (Officer)\nAS — Addition/Subtraction (Soldier)\n\nSame rank (e.g., × and ÷ together) → left to right."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${expr}$ 有哪些运算？\n• 乘法 $${b} \\times ${c}$（校官级）\n• 加法 $+ ${a}$（士兵级）\n\n校官 > 士兵 → 先算乘法！`,
        en: `${narrator}: "$${expr}$ — what operations are there?\n• Multiplication $${b} \\times ${c}$ (Officer)\n• Addition $+ ${a}$ (Soldier)\n\nOfficer > Soldier → multiply first!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——先算乘法\n$${b} \\times ${c} = ${b * c}$\n\n式子变成：$${a} + ${b * c}$`,
        en: `${narrator}: "Step 1 — multiply first\n$${b} \\times ${c} = ${b * c}$\n\nExpression becomes: $${a} + ${b * c}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——再算加法\n$${a} + ${b * c} = ${answer}$\n\n答案 = $${answer}$`,
        en: `${narrator}: "Step 2 — now add\n$${a} + ${b * c} = ${answer}$\n\nAnswer = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——对比"从左到右"的错误\n❌ 错误：$${a} + ${b} = ${a + b}$，$${a + b} \\times ${c} = ${wrongAnswer}$\n✓ 正确：$${b} \\times ${c} = ${b * c}$，$${a} + ${b * c} = ${answer}$\n\n$${wrongAnswer} \\neq ${answer}$——顺序不同，答案天差地别！做得漂亮！`,
        en: `${narrator}: "Verify — compare with the 'left to right' mistake\n❌ Wrong: $${a} + ${b} = ${a + b}$, $${a + b} \\times ${c} = ${wrongAnswer}$\n✓ Correct: $${b} \\times ${c} = ${b * c}$, $${a} + ${b * c} = ${answer}$\n\n$${wrongAnswer} \\neq ${answer}$ — different order, totally different answer! Brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：括号——运算界的"统帅令"！\nBODMAS 里 B = Brackets，军衔最高——比乘除还高。\n\n有括号？**先算括号里面的**，不管里面是什么运算。\n括号就是临时提拔：让低级运算获得最高优先权！`,
        en: `${narrator}: "Brackets — the 'supreme command' of operations!\nBODMAS: B = Brackets, highest rank — outranks even multiply/divide.\n\nBrackets present? Calculate INSIDE FIRST, no matter what.\nBrackets = temporary promotion for any operation inside!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${expr}$——发现括号了！先算它\n括号内：$${a} + ${b} = ${a + b}$\n\n式子变成：$${a + b} \\times ${c}$\n\n括号消除了——接下来正常算。`,
        en: `${narrator}: "$${expr}$ — brackets spotted! Do them first\nInside brackets: $${a} + ${b} = ${a + b}$\n\nExpression becomes: $${a + b} \\times ${c}$\n\nBrackets gone — now calculate normally."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：括号消除后——正常乘\n$${a + b} \\times ${c} = ${answer}$\n\n答案 = $${answer}$`,
        en: `${narrator}: "Brackets done — now multiply\n$${a + b} \\times ${c} = ${answer}$\n\nAnswer = $${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：对比——有括号 vs 没括号\n有：$(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${answer}$\n无：$${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${a + b * c}$\n\n$${answer} \\neq ${a + b * c}$——括号改变了一切！`,
        en: `${narrator}: "Compare — with brackets vs without\nWith: $(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${answer}$\nWithout: $${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${a + b * c}$\n\n$${answer} \\neq ${a + b * c}$ — brackets change everything!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$(${a} + ${b}) \\times ${c} = ${answer}$`,
        en: `${narrator}: "Answer\n$(${a} + ${b}) \\times ${c} = ${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n$(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${answer}$ ✓\n\nBODMAS 口诀：B括号 → O幂 → DM乘除 → AS加减\n记住军衔表，运算顺序永不出错！做得漂亮！`,
        en: `${narrator}: "Verify\n$(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${answer}$ ✓\n\nBODMAS: B Brackets → O Orders → DM Div/Mul → AS Add/Sub\nRemember the rank table — never get the order wrong! Brilliantly done!"`,
      },
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
      text: {
        zh: `${narrator}：为什么要算百分比？\n军粮 $${n}$ 石，要拨 $${pct}\\%$ 给前锋营。知道比例才能精确分配——多一石浪费，少一石前线挨饿。\n\n百分比让"部分占整体多少"一目了然：$${pct}\\%$ 就是每 100 份里取 ${pct} 份。`,
        en: `${narrator}: "Why do we need percentages?\nWe have $${n}$ units of grain, and $${pct}\\%$ must go to the vanguard. Knowing the ratio means precise allocation — too much is wasteful, too little and the front line starves.\n\nPercentages make 'how much of the whole' crystal clear: $${pct}\\%$ means ${pct} out of every 100."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先想简单的——如果只有 100 石粮草\n100 石的 $${pct}\\%$ 是多少？直接取 $${pct}$ 石就好了！\n\n因为 $${pct}\\%$ = 每 100 份取 ${pct} 份。\n所以 100 里取 $${pct}$ → 答案就是 $${pct}$。超简单！`,
        en: `${narrator}: "Start simple — what if we only had 100 units?\n$${pct}\\%$ of 100? Just take $${pct}$!\n\nBecause $${pct}\\%$ = ${pct} out of every 100.\nSo from 100, take $${pct}$ → answer is $${pct}$. Super easy!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：但我们有 $${n}$ 石，不是 100 石——怎么办？\n先算 $1\\%$（把总数除以 100），再乘以 ${pct}：\n\n$1\\%$ of $${n}$ = $${n} \\div 100 = ${n/100}$\n$${pct}\\%$ of $${n}$ = $${n/100} \\times ${pct} = ${answer}$\n\n或者一步到位：$${n} \\times \\frac{${pct}}{100} = ${answer}$`,
        en: `${narrator}: "But we have $${n}$, not 100 — what do we do?\nFind $1\\%$ first (divide total by 100), then multiply by ${pct}:\n\n$1\\%$ of $${n}$ = $${n} \\div 100 = ${n/100}$\n$${pct}\\%$ of $${n}$ = $${n/100} \\times ${pct} = ${answer}$\n\nOr in one step: $${n} \\times \\frac{${pct}}{100} = ${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：小捷径——记住这些"快速百分比"\n$10\\%$ = 除以 10：$${n} \\div 10 = ${tenPct}$\n$50\\%$ = 除以 2：$${n} \\div 2 = ${n/2}$\n$25\\%$ = 除以 4：$${n} \\div 4 = ${n/4}$\n$1\\%$ = 除以 100：$${n} \\div 100 = ${n/100}$\n\n任何百分比都能用这几个"积木"拼出来！`,
        en: `${narrator}: "Shortcut — remember these 'quick percentages'\n$10\\%$ = divide by 10: $${n} \\div 10 = ${tenPct}$\n$50\\%$ = divide by 2: $${n} \\div 2 = ${n/2}$\n$25\\%$ = divide by 4: $${n} \\div 4 = ${n/4}$\n$1\\%$ = divide by 100: $${n} \\div 100 = ${n/100}$\n\nAny percentage can be built from these 'building blocks'!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${pct}\\%$ of $${n}$ = $${answer}$\n\n$${n} \\times \\frac{${pct}}{100} = ${answer}$\n前锋营获得 $${answer}$ 石军粮！`,
        en: `${narrator}: "Answer\n$${pct}\\%$ of $${n}$ = $${answer}$\n\n$${n} \\times \\frac{${pct}}{100} = ${answer}$\nThe vanguard gets $${answer}$ units of grain!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——答案合理吗？\n$${pct}\\%$ ${pct < 50 ? '不到一半' : pct === 50 ? '刚好一半' : '超过一半'}，$${n}$ 的一半是 $${n/2}$。\n$${answer}$ ${answer < n/2 ? '< ' + n/2 : answer === n/2 ? '= ' + n/2 : '> ' + n/2} ✓ 合理！\n\n军粮分配完毕，做得漂亮！`,
        en: `${narrator}: "Verify — does the answer make sense?\n$${pct}\\%$ is ${pct < 50 ? 'less than half' : pct === 50 ? 'exactly half' : 'more than half'}, half of $${n}$ is $${n/2}$.\n$${answer}$ ${answer < n/2 ? '< ' + n/2 : answer === n/2 ? '= ' + n/2 : '> ' + n/2} ✓ Makes sense!\n\nGrain allocation complete — brilliantly done!"`,
      },
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
  const changeAmount = initial * decimal;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：百分比是什么意思？\n很简单——"百分之${pct}"就是"每 100 份里取 ${pct} 份"。\n生活中到处都是：商店打折、考试得分、税率……\n${isDiscount ? '今天我们算的是打折——原价便宜了多少。' : '今天我们算的是涨价——原来的基础上多了多少。'}`,
        en: `${narrator}: "What does percentage mean?\nSimple — '${pct} percent' means 'take ${pct} out of every 100'.\nIt's everywhere in life: shop discounts, exam scores, tax rates...\n${isDiscount ? 'Today we\'re calculating a discount — how much cheaper.' : 'Today we\'re calculating an increase — how much more.'}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：从题目里找信息\n原来的值 = $${initial}$\n${isDiscount ? '减少' : '增加'} $${pct}\\%$\n\n接下来分三步走，慢慢来！`,
        en: `${narrator}: "Find the information from the problem\nOriginal value = $${initial}$\n${isDiscount ? 'Decrease' : 'Increase'} by $${pct}\\%$\n\nThree steps ahead — nice and easy!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——把百分比变成小数\n怎么变？除以 100 就行（小数点往左挪两位）\n$${pct}\\% = ${pct} \\div 100 = ${decimal}$\n\n这个 $${decimal}$ 就是"变化的比例"。`,
        en: `${narrator}: "Step 1 — turn the percentage into a decimal\nHow? Just divide by 100 (move decimal point two places left)\n$${pct}\\% = ${pct} \\div 100 = ${decimal}$\n\nThis $${decimal}$ is the 'rate of change'."`,
      },
      highlightField: 'ans',
    },
    {
      text: isDiscount ? {
        zh: `${narrator}：第二步——算变化了多少\n减少 $${decimal}$ 意味着保留了 $1 - ${decimal} = ${multiplier}$\n\n换个说法：原来有 100%，去掉 ${pct}%，还剩 ${pct === 50 ? '一半' : (100 - pct) + '%'}。\n所以新值 = 原值 $\\times ${multiplier}$`,
        en: `${narrator}: "Step 2 — calculate the change\nDecrease by $${decimal}$ means keeping $1 - ${decimal} = ${multiplier}$\n\nAnother way: had 100%, remove ${pct}%, left with ${100 - pct}%.\nSo new value = original $\\times ${multiplier}$"`,
      } : {
        zh: `${narrator}：第二步——算变化了多少\n增加 $${decimal}$ 意味着变成了 $1 + ${decimal} = ${multiplier}$\n\n换个说法：原来 100%，加上 ${pct}%，一共 ${100 + pct}%。\n所以新值 = 原值 $\\times ${multiplier}$`,
        en: `${narrator}: "Step 2 — calculate the change\nIncrease by $${decimal}$ means becoming $1 + ${decimal} = ${multiplier}$\n\nAnother way: had 100%, add ${pct}%, total ${100 + pct}%.\nSo new value = original $\\times ${multiplier}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第三步——算出最终结果\n$${initial} \\times ${multiplier} = ${result}$`,
        en: `${narrator}: "Step 3 — calculate the final result\n$${initial} \\times ${multiplier} = ${result}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案 = $${result}$\n\n验算：变化量 $= ${initial} \\times ${decimal} = ${changeAmount}$\n${isDiscount ? `$${initial} - ${changeAmount} = ${result}$` : `$${initial} + ${changeAmount} = ${result}$`} ✓\n\n百分比就是这么简单！做得好！`,
        en: `${narrator}: "Answer = $${result}$\n\nVerify: change = $${initial} \\times ${decimal} = ${changeAmount}$\n${isDiscount ? `$${initial} - ${changeAmount} = ${result}$` : `$${initial} + ${changeAmount} = ${result}$`} ✓\n\nPercentages are that simple! Great job!"`,
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

export function generatePercentageInterestMission(template: Mission): Mission {
  const tier = getTier();
  const narrators = ['曹操', '荀彧', '诸葛亮'];
  const narrator = pickRandom(narrators);

  const modes = ['simple', 'compound'] as const;
  const mode = (template.data?.mode as typeof modes[number]) || pickRandom([...modes]);

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
      text: {
        zh: `${narrator}：为什么要学利息？\n你把 $${principal}$ 两银子存进国库，过了 $${years}$ 年去取——结果多了一些钱！\n多出来的就是"利息"，是国库为了感谢你存钱而给你的奖励。\n\n单利是最简单的一种：每年的利息都按**最初的本金**来算，固定不变。`,
        en: `${narrator}: "Why learn about interest?\nYou deposit $${principal}$ liang into the treasury. After $${years}$ years, you withdraw — and there's MORE money!\nThe extra is 'interest' — the treasury's reward for letting them use your money.\n\nSimple interest is the easiest type: each year's interest is based on the ORIGINAL amount, never changing."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：单利公式长什么样？\n$$\\text{总额} = P + P \\times r \\times t = P(1 + r \\times t)$$\n\n$P$ = 本金 = $${principal}$（你最初存了多少）\n$r$ = 年利率 = $${rateDecimal}$（就是 $${rate}\\%$ 变成小数）\n$t$ = 年数 = $${years}$（存了几年）\n\n三个数一乘一加，搞定！`,
        en: `${narrator}: "What does the simple interest formula look like?\n$$\\text{Total} = P + P \\times r \\times t = P(1 + r \\times t)$$\n\n$P$ = principal = $${principal}$ (how much you deposited)\n$r$ = annual rate = $${rateDecimal}$ (that's $${rate}\\%$ as a decimal)\n$t$ = years = $${years}$ (how long it's deposited)\n\nMultiply three numbers, add once — done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——算每年的利息\n每年利息 $= P \\times r = ${principal} \\times ${rateDecimal} = ${interest}$\n\n意思是每年国库给你 $${interest}$ 两银子作为利息。\n$${years}$ 年总共给你多少？$${interest} \\times ${years} = ${interest * years}$ 两！`,
        en: `${narrator}: "Step 1 — calculate yearly interest\nYearly interest $= P \\times r = ${principal} \\times ${rateDecimal} = ${interest}$\n\nThat means the treasury pays you $${interest}$ liang each year.\nOver $${years}$ years? $${interest} \\times ${years} = ${interest * years}$ liang total!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——本金加利息\n你最初存了 $${principal}$ 两，利息一共 $${interest * years}$ 两。\n\n总额 $= ${principal} + ${interest * years} = ${totalSimple}$\n\n就像打仗后清点：原来的兵 + 新招的兵 = 总兵力！`,
        en: `${narrator}: "Step 2 — principal plus interest\nYou originally deposited $${principal}$ liang, total interest is $${interest * years}$ liang.\n\nTotal $= ${principal} + ${interest * years} = ${totalSimple}$\n\nLike counting troops after battle: original soldiers + new recruits = total force!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${years}$ 年后总额 = $${totalSimple}$ 两\n\n从 $${principal}$ 变成 $${totalSimple}$，多赚了 $${interest * years}$ 两！做得好！`,
        en: `${narrator}: "Answer\nAfter $${years}$ years, total = $${totalSimple}$ liang\n\nFrom $${principal}$ to $${totalSimple}$ — earned $${interest * years}$ liang extra! Well done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——逐年对账\n每年利息固定 $${interest}$ 两，$${years}$ 年就是 $${interest} \\times ${years} = ${interest * years}$ 两。\n本金 + 利息 $= ${principal} + ${interest * years} = ${totalSimple}$ ✓\n\n账目清晰，万无一失！国库账房先生都佩服你！`,
        en: `${narrator}: "Verify — check the books year by year\nFixed yearly interest $${interest}$ liang, for $${years}$ years: $${interest} \\times ${years} = ${interest * years}$ liang.\nPrincipal + interest $= ${principal} + ${interest * years} = ${totalSimple}$ ✓\n\nBooks balanced perfectly! Even the treasury accountant is impressed!"`,
      },
      highlightField: 'ans',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：为什么要学复利？\n你知道"滚雪球"吗？雪球越大，每滚一圈粘的雪就越多，越滚越大越快！\n复利就是钱的"滚雪球"——利息也会产生利息！\n\n跟单利不同：单利每年只按本金算利息，复利每年按"本金+已有利息"算。`,
        en: `${narrator}: "Why learn compound interest?\nKnow what a snowball does? The bigger it gets, the more snow it picks up each roll — growing faster and faster!\nCompound interest is money's 'snowball' — interest earns interest too!\n\nUnlike simple interest (calculated on the original only), compound interest uses 'principal + accumulated interest' each year."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：复利公式\n$$A = P \\times (1 + r)^t$$\n\n$P = ${principal}$（本金），$r = ${rateDecimal}$（利率），$t = ${years}$（年数）\n\n$(1 + r) = ${1 + rateDecimal}$ 就是"每过一年，钱变成原来的 $${1 + rateDecimal}$ 倍"。\n指数 $t$ 的意思是连续乘 $${years}$ 次——雪球滚了 $${years}$ 圈！`,
        en: `${narrator}: "Compound interest formula\n$$A = P \\times (1 + r)^t$$\n\n$P = ${principal}$ (principal), $r = ${rateDecimal}$ (rate), $t = ${years}$ (years)\n\n$(1 + r) = ${1 + rateDecimal}$ means 'each year, money becomes $${1 + rateDecimal}$ times what it was'.\nThe exponent $t$ means multiply $${years}$ times — the snowball rolls $${years}$ times!"`,
      },
      highlightField: 'ans',
    },
    {
      text: (() => {
        let zh = `${narrator}：逐年看看雪球怎么滚的\n`, en = `${narrator}: "Watch the snowball grow year by year\n`;
        let amt = principal;
        for (let y = 1; y <= years; y++) {
          const prev = amt;
          amt = parseFloat((amt * (1 + rateDecimal)).toFixed(2));
          const yearInterest = parseFloat((prev * rateDecimal).toFixed(2));
          zh += `第 ${y} 年：$${prev} \\times ${1 + rateDecimal} = ${amt}$（利息 $${yearInterest}$）\n`;
          en += `Year ${y}: $${prev} \\times ${1 + rateDecimal} = ${amt}$ (interest $${yearInterest}$)\n`;
        }
        zh += `\n看到了吗？每年的利息在变大——因为本金在变大！这就是复利的威力。`;
        en += `\nSee? Each year's interest grows — because the base amount grows! That's the power of compounding."`;
        return { zh, en };
      })(),
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：用公式一步搞定\n$A = ${principal} \\times (${1 + rateDecimal})^{${years}} = ${answer}$\n\n逐年算和公式算，结果一模一样！\n公式更快，逐年算更直观——两种方法你都会了！`,
        en: `${narrator}: "Or use the formula in one shot\n$A = ${principal} \\times (${1 + rateDecimal})^{${years}} = ${answer}$\n\nYear-by-year and formula give the exact same result!\nFormula is faster, year-by-year is more intuitive — now you know both!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${years}$ 年复利后总额 = $${answer}$ 两\n\n比单利 $${totalSimple}$ 多了 $${parseFloat((answer - totalSimple).toFixed(2))}$ 两！\n时间越长，复利的雪球效应越明显。做得漂亮！`,
        en: `${narrator}: "Answer\nAfter $${years}$ years of compound interest, total = $${answer}$ liang\n\nThat's $${parseFloat((answer - totalSimple).toFixed(2))}$ more than simple interest ($${totalSimple}$)!\nThe longer the time, the stronger the snowball effect. Brilliant work!"`,
      },
      highlightField: 'ans',
    },
    {
      text: (() => {
        let zh = `${narrator}：验算——再走一遍雪球路线\n从 $${principal}$ 开始：\n`, en = `${narrator}: "Verify — trace the snowball path again\nStarting from $${principal}$:\n`;
        let amt = principal;
        for (let y = 1; y <= years; y++) {
          amt = parseFloat((amt * (1 + rateDecimal)).toFixed(2));
          zh += `第 ${y} 年末：$${amt}$\n`;
          en += `End of year ${y}: $${amt}$\n`;
        }
        zh += `最终 $${amt}$ ✓ 和公式算出来的一模一样！\n\n国库大账查清了，你是最棒的账房先生！`;
        en += `Final $${amt}$ ✓ Matches the formula exactly!\n\nTreasury audit complete — you're the best accountant in the kingdom!"`;
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
      text: {
        zh: `${narrator}：为什么要四舍五入？\n斥候回报敌军约 $${n}$ 人——但主公不需要精确数字，大概就行！\n\n四舍五入就是找到最接近的"整数"。\n四舍五入到${placeNameZh}，就是找最近的 $${place}$ 的倍数。\n战场上没时间算精确数字，快速估算才能赢！`,
        en: `${narrator}: "Why do we need rounding?\nScouts report about $${n}$ enemies — but the general just needs a rough number!\n\nRounding means finding the nearest 'round number'.\nRounding to ${placeNameEn} = finding the nearest multiple of $${place}$.\nNo time for exact math in battle — quick estimates win wars!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：四舍五入的唯一规则——"5"是分界线\n看关键位右边那个数字：\n• $0, 1, 2, 3, 4$ → 舍（往小的走）\n• $5, 6, 7, 8, 9$ → 入（往大的走）\n\n为什么 5 归"入"？因为 5 正好在中间，约定归大。就这一条规则！`,
        en: `${narrator}: "The ONE rule of rounding — '5' is the dividing line\nLook at the digit right after the rounding position:\n• $0, 1, 2, 3, 4$ → round DOWN\n• $5, 6, 7, 8, 9$ → round UP\n\nWhy does 5 round up? It's exactly in the middle — by convention we go up. Just this one rule!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：$${n}$ 夹在哪两个"整数"之间？\n$${n}$ 在 $${roundDown}$ 和 $${roundUp}$ 之间。\n\n想象一条数轴：\n$${roundDown}$ ←——— $${n}$ ———→ $${roundUp}$\n\n$${n}$ 离哪个更近？看下一步就知道！`,
        en: `${narrator}: "$${n}$ sits between which two round numbers?\n$${n}$ is between $${roundDown}$ and $${roundUp}$.\n\nImagine a number line:\n$${roundDown}$ ←——— $${n}$ ———→ $${roundUp}$\n\nWhich is $${n}$ closer to? Next step reveals it!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：看关键的那一位数字\n${placeNameZh}右边紧挨着的那个数字是 $${decider}$。\n\n$${decider}$ ${decider >= 5 ? `$\\geq 5$ → 入！往大的走（$${roundUp}$）` : `$< 5$ → 舍！往小的走（$${roundDown}$）`}\n\n就这么简单——一个数字决定方向！`,
        en: `${narrator}: "Look at the key digit\nThe digit right after the ${placeNameEn} position is $${decider}$.\n\n$${decider}$ ${decider >= 5 ? `$\\geq 5$ → round UP! Go to $${roundUp}$` : `$< 5$ → round DOWN! Go to $${roundDown}$`}\n\nThat simple — one digit decides the direction!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${n}$ 四舍五入到${placeNameZh} $= ${answer}$\n\n关键数字 $${decider}$ ${decider >= 5 ? `$\\geq 5$，进位到 $${roundUp}$` : `$< 5$，舍去到 $${roundDown}$`}。做得好！`,
        en: `${narrator}: "Answer\n$${n}$ rounded to ${placeNameEn} $= ${answer}$\n\nKey digit $${decider}$ ${decider >= 5 ? `$\\geq 5$, round up to $${roundUp}$` : `$< 5$, round down to $${roundDown}$`}. Well done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n• $${answer}$ 是 $${place}$ 的倍数吗？$${answer} \\div ${place} = ${answer/place}$ ✓\n• $${n}$ 和 $${answer}$ 差多少？$|${n} - ${answer}| = ${Math.abs(n - answer)}$\n• 差距不超过 $${place/2}$？$${Math.abs(n - answer)} ${Math.abs(n - answer) <= place/2 ? '\\leq' : '>'} ${place/2}$ ✓\n\n军情估算完毕，万无一失！`,
        en: `${narrator}: "Verify\n• Is $${answer}$ a multiple of $${place}$? $${answer} \\div ${place} = ${answer/place}$ ✓\n• Difference: $|${n} - ${answer}| = ${Math.abs(n - answer)}$\n• Within $${place/2}$? $${Math.abs(n - answer)} ${Math.abs(n - answer) <= place/2 ? '\\leq' : '>'} ${place/2}$ ✓\n\nIntelligence estimate complete — spot on!"`,
      },
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
      text: {
        zh: `${narrator}：为什么需要标准式？\n你试试写一下曹操的百万大军——$1,000,000$。好长对不对？容易数错零！\n标准式就是把大数字"缩写"成一个简洁的形式：$1 \\times 10^6$。\n\n简洁、不会写错、一眼就能比大小。科学家、工程师天天用它！`,
        en: `${narrator}: "Why do we need standard form?\nTry writing Cao Cao's million-strong army — $1,000,000$. So long! Easy to miscount zeros!\nStandard form 'compresses' big numbers into a neat form: $1 \\times 10^6$.\n\nNeat, error-free, easy to compare. Scientists and engineers use it every day!"`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：标准式的两个规则\n$a \\times 10^n$——就这个格式，记住两条：\n• $a$ 必须在 $1$ 到 $10$ 之间（$3.6$ 可以，$36$ 不行，$0.5$ 也不行）\n• $n$ 就是小数点挪了几位\n\n就像报军情：先说最关键的数字（$a$），再说规模是"万"还是"百万"（$10^n$）。`,
        en: `${narrator}: "Two rules of standard form\n$a \\times 10^n$ — just this format, remember two things:\n• $a$ must be between $1$ and $10$ ($3.6$ is fine, $36$ is not, $0.5$ isn't either)\n• $n$ is how many places the decimal moved\n\nLike a military report: state the key figure ($a$) first, then the scale — 'ten-thousands' or 'millions' ($10^n$)."`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：第一步——找 $a$\n看这个数：$${numberStr}$\n把小数点挪到第一个非零数字后面，让它变成 $1$ 到 $10$ 之间的数。\n\n$a = ${a}$ ✓ 在 $1$ 到 $10$ 之间——完美！就像挑出军情中最关键的数字。`,
        en: `${narrator}: "Step 1 — find $a$\nLook at this number: $${numberStr}$\nMove the decimal after the first non-zero digit to get a number between $1$ and $10$.\n\n$a = ${a}$ ✓ Between $1$ and $10$ — perfect! Like picking out the key figure in a report."`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：第二步——数小数点挪了几位\n从 $${numberStr}$ 变成 $${a}$，小数点往左跳了几步？\n数一数……$${n}$ 步！所以 $n = ${n}$。\n\n$n$ 越大，说明原来的数越大——$10^{${n}}$ 就是 $${Math.pow(10, n).toLocaleString('en-US')}$！`,
        en: `${narrator}: "Step 2 — count decimal places moved\nFrom $${numberStr}$ to $${a}$, how many jumps left did the decimal make?\nCount... $${n}$ jumps! So $n = ${n}$.\n\nThe bigger $n$ is, the bigger the original number — $10^{${n}}$ is $${Math.pow(10, n).toLocaleString('en-US')}$!"`,
      },
      highlightField: 'n',
    },
    {
      text: {
        zh: `${narrator}：答案\n$$${numberStr} = ${a} \\times 10^{${n}}$$\n\n$a = ${a}$，$n = ${n}$——大数字瞬间变简洁！\n以后遇到再大的数字都不怕了。`,
        en: `${narrator}: "Answer\n$$${numberStr} = ${a} \\times 10^{${n}}$$\n\n$a = ${a}$, $n = ${n}$ — the big number is now compact!\nNo matter how large the number, you can handle it now."`,
      },
      highlightField: 'a',
    },
    {
      text: {
        zh: `${narrator}：验算——还原回去\n$${a} \\times 10^{${n}} = ${a} \\times ${Math.pow(10, n).toLocaleString('en-US')} = ${numberStr}$ ✓\n\n和原来的数一模一样！标准式掌握了，做得漂亮！`,
        en: `${narrator}: "Verify — convert back\n$${a} \\times 10^{${n}} = ${a} \\times ${Math.pow(10, n).toLocaleString('en-US')} = ${numberStr}$ ✓\n\nExactly the same as the original! Standard form mastered — brilliantly done!"`,
      },
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
  const mode = (template.data?.mode as typeof modes[number]) || pickRandom([...modes]);

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
      text: {
        zh: `${narrator}：为什么要学速度公式？\n打仗最怕什么？迟到！如果不会算速度，部队就不知道几时出发才能准时到达。\n\n现实中也一样——坐火车、跑步、开车，都在和速度、距离、时间打交道。\n学会了这三个量的关系，你就能规划任何行程！`,
        en: `${narrator}: "Why learn the speed formula?\nWhat's the worst thing in war? Being late! Without knowing speed, the army can't figure out when to march to arrive on time.\n\nSame in real life — trains, running, driving — all about speed, distance, and time.\nLearn how these three relate, and you can plan any journey!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：速度、距离、时间——三角公式\n记住一个公式就够了：\n$$\\text{距离} = \\text{速度} \\times \\text{时间}$$\n\n知道任意两个，就能算第三个：\n• 速度 $= \\frac{\\text{距离}}{\\text{时间}}$\n• 时间 $= \\frac{\\text{距离}}{\\text{速度}}$\n\n就像一个三角形：遮住哪个，剩下两个告诉你答案！`,
        en: `${narrator}: "Speed, distance, time — the triangle formula\nJust remember one equation:\n$$\\text{Distance} = \\text{Speed} \\times \\text{Time}$$\n\nKnow any two, find the third:\n• Speed $= \\frac{\\text{Distance}}{\\text{Time}}$\n• Time $= \\frac{\\text{Distance}}{\\text{Speed}}$\n\nLike a triangle — cover one, and the other two give you the answer!"`,
      },
      highlightField: 'x',
    },
    {
      text: mode === 'speed' ? {
        zh: `${narrator}：题目问速度——找出已知量\n已知：距离 = $${distance}$ 里，时间 = $${time}$ 小时\n求：速度 = ？\n\n速度就是"每小时走了多远"——把总路程平均分给每个小时。\n所以用**除法**：距离 ÷ 时间。`,
        en: `${narrator}: "The question asks for speed — find the knowns\nKnown: distance = $${distance}$ li, time = $${time}$ hrs\nFind: speed = ?\n\nSpeed is 'how far per hour' — share the total distance equally across each hour.\nSo we use **division**: distance ÷ time."`,
      } : mode === 'distance' ? {
        zh: `${narrator}：题目问距离——找出已知量\n已知：速度 = $${speed}$ 里/时，时间 = $${time}$ 小时\n求：距离 = ？\n\n每小时走 $${speed}$ 里，走了 $${time}$ 个小时——总共走了多远？\n用**乘法**：速度 × 时间。`,
        en: `${narrator}: "The question asks for distance — find the knowns\nKnown: speed = $${speed}$ li/hr, time = $${time}$ hrs\nFind: distance = ?\n\n$${speed}$ li every hour, for $${time}$ hours — how far in total?\nUse **multiplication**: speed × time."`,
      } : {
        zh: `${narrator}：题目问时间——找出已知量\n已知：距离 = $${distance}$ 里，速度 = $${speed}$ 里/时\n求：时间 = ？\n\n总共要走 $${distance}$ 里，每小时能走 $${speed}$ 里——要走几个小时？\n用**除法**：距离 ÷ 速度。`,
        en: `${narrator}: "The question asks for time — find the knowns\nKnown: distance = $${distance}$ li, speed = $${speed}$ li/hr\nFind: time = ?\n\n$${distance}$ li to travel, going $${speed}$ li each hour — how many hours?\nUse **division**: distance ÷ speed."`,
      },
      highlightField: 'x',
    },
    {
      text: mode === 'speed' ? {
        zh: `${narrator}：代入计算\n速度 $= \\frac{\\text{距离}}{\\text{时间}} = \\frac{${distance}}{${time}} = ${speed}$ 里/时\n\n意思是这支部队每小时行军 $${speed}$ 里——${speed >= 20 ? '这可是急行军的速度！' : '稳步前进！'}`,
        en: `${narrator}: "Substitute and calculate\nSpeed $= \\frac{\\text{Distance}}{\\text{Time}} = \\frac{${distance}}{${time}} = ${speed}$ li/hr\n\nThat means the army marches $${speed}$ li every hour — ${speed >= 20 ? 'that\'s a rapid march!' : 'steady advance!'}"`,
      } : mode === 'distance' ? {
        zh: `${narrator}：代入计算\n距离 $= \\text{速度} \\times \\text{时间} = ${speed} \\times ${time} = ${distance}$ 里\n\n${time} 个小时后，部队已经走了 $${distance}$ 里！${distance >= 100 ? '好远！' : '路程不算远。'}`,
        en: `${narrator}: "Substitute and calculate\nDistance $= \\text{Speed} \\times \\text{Time} = ${speed} \\times ${time} = ${distance}$ li\n\nAfter ${time} hours, the army has covered $${distance}$ li! ${distance >= 100 ? 'Quite far!' : 'Not too far.'}"`,
      } : {
        zh: `${narrator}：代入计算\n时间 $= \\frac{\\text{距离}}{\\text{速度}} = \\frac{${distance}}{${speed}} = ${time}$ 小时\n\n需要 $${time}$ 小时才能到达！${time >= 6 ? '行军辛苦，要做好准备。' : '很快就能到！'}`,
        en: `${narrator}: "Substitute and calculate\nTime $= \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{${distance}}{${speed}} = ${time}$ hours\n\nIt takes $${time}$ hours to arrive! ${time >= 6 ? 'A long march — better prepare well.' : 'You\'ll be there in no time!'}"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：答案\n${mode === 'speed' ? `速度 = $${answer}$ 里/时` : mode === 'distance' ? `距离 = $${answer}$ 里` : `时间 = $${answer}$ 小时`}\n\n行军计划有了数据支撑，出发吧！`,
        en: `${narrator}: "Answer\n${mode === 'speed' ? `Speed = $${answer}$ li/hr` : mode === 'distance' ? `Distance = $${answer}$ li` : `Time = $${answer}$ hours`}\n\nThe march plan has data backing — let's move out!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：验算——三个量互相验证\n速度 $\\times$ 时间 $=$ 距离？\n$${speed} \\times ${time} = ${distance}$ ✓\n\n三个量完美吻合！行军计划万无一失，做得漂亮！`,
        en: `${narrator}: "Verify — cross-check all three\nSpeed $\\times$ Time $=$ Distance?\n$${speed} \\times ${time} = ${distance}$ ✓\n\nAll three match perfectly! March plan confirmed — brilliantly done!"`,
      },
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

export function generateVennMission(template: Mission): Mission {
  const tier = getTier();
  const narrator = pickRandom(['司马炎', '杜预', '诸葛亮']);

  // Total, set A only, intersection, set B only
  const totalPools = { 1: [20, 30, 40], 2: [30, 50, 80, 100], 3: [50, 100, 150, 200] };
  const total = pickRandom(totalPools[tier]);

  // Generate set sizes ensuring valid Venn diagram
  const aOnlyPools = { 1: [3, 5, 8], 2: [5, 8, 10, 15], 3: [10, 15, 20, 25] };
  const bothPools = { 1: [2, 3, 4], 2: [3, 5, 8, 10], 3: [5, 10, 15, 20] };
  const bOnlyPools = { 1: [4, 6, 7], 2: [6, 8, 12, 14], 3: [8, 12, 18, 22] };

  const aOnly = pickRandom(aOnlyPools[tier]);
  const both = pickRandom(bothPools[tier]);
  const bOnly = pickRandom(bOnlyPools[tier]);
  const neither = total - aOnly - both - bOnly;

  // Ensure neither >= 0
  if (neither < 0) return safeRetry(template, generateVennMission);

  const setA = aOnly + both;
  const setB = bOnly + both;
  const union = aOnly + both + bOnly;

  // Pick question mode
  const modes = tier === 1
    ? ['intersection', 'union'] as const
    : ['intersection', 'union', 'a_only', 'neither'] as const;
  const mode = pickRandom([...modes]);

  let answer: number;
  let questionZh: string;
  let questionEn: string;

  switch (mode) {
    case 'intersection':
      answer = both;
      questionZh = `两类都参加的有多少人？`;
      questionEn = `How many are in both groups?`;
      break;
    case 'union':
      answer = union;
      questionZh = `至少参加一类的有多少人？`;
      questionEn = `How many are in at least one group?`;
      break;
    case 'a_only':
      answer = aOnly;
      questionZh = `只参加 A 类的有多少人？`;
      questionEn = `How many are in group A only?`;
      break;
    case 'neither':
      answer = neither;
      questionZh = `两类都不参加的有多少人？`;
      questionEn = `How many are in neither group?`;
      break;
  }

  const description: BilingualText = {
    zh: `总共 $${total}$ 人，A 类 $${setA}$ 人，B 类 $${setB}$ 人，两类都参加 $${both}$ 人。${questionZh}`,
    en: `Total $${total}$ people, Group A: $${setA}$, Group B: $${setB}$, both: $${both}$. ${questionEn}`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要用韦恩图？\n清点诸侯！有人会骑马，有人会射箭，有人两样都会——怎么不重复地数清楚？\n画两个圈，重叠的就是"都会"的人！\n韦恩图就是这样把复杂的分类变得一目了然。`,
        en: `${narrator}: "Why use Venn diagrams?\nCounting warriors! Some can ride, some can shoot, some can do both — how do you count without double-counting?\nDraw two circles — the overlap is people who can do both!\nThat's how Venn diagrams make complex classification crystal clear."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：韦恩图的四个区域\n① A 类独有 = $${aOnly}$ 人\n② 两类都有（交集）= $${both}$ 人\n③ B 类独有 = $${bOnly}$ 人\n④ 都不在（圈外）= $${neither}$ 人\n\n四个区域加起来 = 总数 $${total}$！`,
        en: `${narrator}: "Four regions of the Venn diagram\n① A only = $${aOnly}$\n② Both (intersection) = $${both}$\n③ B only = $${bOnly}$\n④ Neither (outside) = $${neither}$\n\nAll four add up to total $${total}$!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：核心关系\n$|A| = \\text{A独有} + \\text{交集} = ${aOnly} + ${both} = ${setA}$\n$|B| = \\text{B独有} + \\text{交集} = ${bOnly} + ${both} = ${setB}$\n$|A \\cup B| = \\text{A独有} + \\text{交集} + \\text{B独有} = ${union}$`,
        en: `${narrator}: "Core relationships\n$|A| = \\text{A only} + \\text{both} = ${aOnly} + ${both} = ${setA}$\n$|B| = \\text{B only} + \\text{both} = ${bOnly} + ${both} = ${setB}$\n$|A \\cup B| = \\text{A only} + \\text{both} + \\text{B only} = ${union}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：解题\n题目问的是：${questionZh}\n从韦恩图中直接读出对应区域的数值。`,
        en: `${narrator}: "Solve\nThe question asks: ${questionEn}\nRead the corresponding region directly from the Venn diagram."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$${answer}$`,
        en: `${narrator}: "Answer\n$${answer}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n四个区域：$${aOnly} + ${both} + ${bOnly} + ${neither} = ${aOnly + both + bOnly + neither}$\n总数 = $${total}$ ✓ 分类无遗漏！`,
        en: `${narrator}: "Verify\nFour regions: $${aOnly} + ${both} + ${bOnly} + ${neither} = ${aOnly + both + bOnly + neither}$\nTotal = $${total}$ ✓ No one missed!"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { total, setA, setB, aOnly, both, bOnly, neither, union, answer, mode, generatorType: 'VENN_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ROTATION generator: rotate a point around origin by 90/180/270°
   ══════════════════════════════════════════════════════════ */

