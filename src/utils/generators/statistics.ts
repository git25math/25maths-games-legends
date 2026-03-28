// Auto-extracted from generateMission.ts
import { pickRandom, randInt, signTerm, coeffStr, signCoeff, eqStr, linearExpr, safeRetry, gcdCalc, type Mission, type BilingualText, type DifficultyTier, type GeneratorFn } from './shared';

export function generateProbSimpleMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const totalPools = { 1: [10, 12, 20], 2: [20, 30, 36, 40, 50, 52, 60, 80, 100], 3: [60, 80, 100, 200] };
  const targetPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8, 10, 12, 15], 3: [7, 11, 13, 17, 19] };
  const total = pickRandom(totalPools[tier]);
  let target = pickRandom(targetPools[tier]);
  // Ensure target ≤ total
  if (target > total) target = Math.min(...targetPools[tier].filter(t => t <= total));
  const narrator = '诸葛亮';

  const description: BilingualText = {
    zh: `$${total}$ 个卦象中有 $${target}$ 个吉兆，随机抽中的概率是？`,
    en: `$${target}$ favorable outcomes out of $${total}$ total — find the probability.`,
  };

  const p = target / total;
  const pDisplay = Math.round(p * 10000) / 10000;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要概率？\n想象一下：袋子里有 $${total}$ 个球，你闭着眼睛摸一个。\n能摸到你想要的那种球吗？概率就是回答"有多大可能"的数学工具。\n战场上也一样——不确定性无处不在，算清概率才能做最聪明的决定。`,
        en: `${narrator}: "Why do we need probability?\nImagine a bag with $${total}$ balls. You reach in blindfolded.\nWill you grab the one you want? Probability is the maths tool that answers 'how likely is it?'\nOn the battlefield too — uncertainty is everywhere. Calculate probability to make the smartest decision."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：概率的核心思想，只有一句话：\n$$P = \\frac{\\text{我想要的结果数}}{\\text{所有可能的结果数}}$$\n就像摸球：想要的球有几个 ÷ 总共几个球。\n概率的值在 $0$ 到 $1$ 之间：$0$ = 绝不可能，$1$ = 一定发生。`,
        en: `${narrator}: "The core idea of probability fits in one sentence:\n$$P = \\frac{\\text{outcomes I want}}{\\text{all possible outcomes}}$$\nLike drawing balls: how many I want ÷ total balls.\nProbability ranges from $0$ to $1$: $0$ = impossible, $1$ = certain."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：第一步——从题目里找"总数"\n题目说总共有多少种可能？仔细读一遍……\n找到了！总结果数 = $${total}$\n（这就是分母——放在分数线下面的数）`,
        en: `${narrator}: "Step 1 — find the 'total' from the problem\nHow many possible outcomes does the problem describe? Read carefully...\nFound it! Total outcomes = $${total}$\n(This goes on the bottom of the fraction — the denominator)"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：第二步——从题目里找"想要的数"\n我们想要的那种结果有几个？\n找到了！想要的结果数 = $${target}$\n（这就是分子——放在分数线上面的数）\n你做得很好，信息都找齐了！`,
        en: `${narrator}: "Step 2 — find the 'wanted count' from the problem\nHow many of the outcomes are the ones we want?\nFound it! Wanted outcomes = $${target}$\n(This goes on top of the fraction — the numerator)\nGreat job — you've found all the information!"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：现在套公式，慢慢来：\n$P = \\frac{\\text{想要的}}{\\text{总数}} = \\frac{${target}}{${total}}$\n\n接下来算这个除法：$${target} \\div ${total} = ${pDisplay}$`,
        en: `${narrator}: "Now plug into the formula, nice and slow:\n$P = \\frac{\\text{wanted}}{\\text{total}} = \\frac{${target}}{${total}}$\n\nNow do the division: $${target} \\div ${total} = ${pDisplay}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：答案出来了！\n概率 $P = ${pDisplay}$\n\n换个说法：每 $${total}$ 次里大约有 $${target}$ 次能成功。\n恭喜你，概率计算完成！`,
        en: `${narrator}: "We have the answer!\nProbability $P = ${pDisplay}$\n\nIn other words: roughly $${target}$ times out of every $${total}$ tries.\nCongratulations — probability calculated!"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：最后检查一下，确保没算错：\n① $0 \\leq ${pDisplay} \\leq 1$? ✓ 概率在合理范围内\n② 想要的 $${target}$ 不超过总数 $${total}$? ✓ 没有多出来\n全部正确！你现在已经学会了最基础的概率计算，了不起！`,
        en: `${narrator}: "Let's double-check to make sure:\n① $0 \\leq ${pDisplay} \\leq 1$? ✓ Probability is in valid range\n② Wanted $${target}$ doesn't exceed total $${total}$? ✓ Nothing extra\nAll correct! You've now mastered the most basic probability calculation — well done!"`,
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

export function generateProbIndMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const pPools = { 1: [0.5, 0.5], 2: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8], 3: [0.1, 0.2, 0.3, 0.7, 0.8, 0.9] };
  const p1 = pickRandom(pPools[tier]);
  const p2 = pickRandom(pPools[tier]);
  const narrator = '周瑜';

  const description: BilingualText = {
    zh: `两场独立战役，胜率分别为 $${p1}$ 和 $${p2}$。两场都赢的概率是？`,
    en: `Two independent battles with win rates $${p1}$ and $${p2}$. Probability of winning both?`,
  };

  const ans = p1 * p2;
  const ansDisplay = Math.round(ans * 100) / 100;
  const minP = Math.min(p1, p2);
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要算"同时发生"的概率？\n想象你同时派两个探子去打探消息。每个人能不能成功是各自的事。\n但你关心的是：两个人**都**成功的可能性有多大？\n这就是独立事件的组合概率——战场决策的关键。`,
        en: `${narrator}: "Why do we need to calculate 'both happening' probability?\nImagine sending two spies on separate missions. Each one's success is their own affair.\nBut what you care about is: how likely is it that BOTH succeed?\nThis is combined probability of independent events — the key to battlefield decisions."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：什么是"独立"？\n独立 = 互不影响。第一个人成不成功，完全不影响第二个人。\n生活例子：抛两次硬币——第一次正面朝上，不会让第二次更容易或更难。\n判断方法很简单：两件事之间有没有因果关系？没有 = 独立。`,
        en: `${narrator}: "What does 'independent' mean?\nIndependent = no influence. Whether the first person succeeds has zero effect on the second.\nReal-life example: flip a coin twice — heads on the first flip doesn't make the second flip easier or harder.\nSimple test: is there a cause-and-effect link? No link = independent."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：从题目中提取已知信息：\n第一个事件成功概率 → $P_1 = ${p1}$\n第二个事件成功概率 → $P_2 = ${p2}$\n这两个数就是我们的起点，别担心，接下来只需要一步乘法！`,
        en: `${narrator}: "Extract the given information from the problem:\nFirst event success probability → $P_1 = ${p1}$\nSecond event success probability → $P_2 = ${p2}$\nThese two numbers are our starting point. Don't worry — we just need one multiplication!"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：为什么是"乘"？\n直觉：如果第一件事成功的可能是一半($0.5$)，第二件也是一半($0.5$)，\n两个都成功就是"一半的一半"= $0.25$（四分之一）。\n"一半的一半"就是乘法！这就是乘法法则的本质：\n$$P(\\text{都成功}) = P_1 \\times P_2$$`,
        en: `${narrator}: "Why do we MULTIPLY?\nIntuition: if the first event has a half chance ($0.5$), and the second also has a half ($0.5$),\nboth succeeding is 'half of a half' = $0.25$ (a quarter).\n'Half of a half' IS multiplication! That's the essence of the multiplication rule:\n$$P(\\text{both}) = P_1 \\times P_2$$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：代入计算，一步一步来：\n$P = P_1 \\times P_2$\n$P = ${p1} \\times ${p2}$\n$P = ${ansDisplay}$`,
        en: `${narrator}: "Substitute and calculate, step by step:\n$P = P_1 \\times P_2$\n$P = ${p1} \\times ${p2}$\n$P = ${ansDisplay}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：答案\n两个事件同时发生的概率 = $${ansDisplay}$\n\n做到这里你已经很棒了！`,
        en: `${narrator}: "Answer\nProbability of both events happening = $${ansDisplay}$\n\nYou've done brilliantly getting this far!"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：验算——用常识检查：\n两件事**同时**发生，应该比任何一件**单独**发生更难，对吗？\n$${ansDisplay} \\leq ${minP}$? ✓ 确实更小！\n$0 \\leq ${ansDisplay} \\leq 1$? ✓ 在合理范围内\n完美！你已经掌握了独立事件的组合概率！`,
        en: `${narrator}: "Verify — use common sense:\nBOTH events happening should be HARDER than either one alone, right?\n$${ansDisplay} \\leq ${minP}$? ✓ Indeed smaller!\n$0 \\leq ${ansDisplay} \\leq 1$? ✓ Within valid range\nPerfect! You've mastered combined probability of independent events!"`,
      },
      highlightField: 'p',
    },
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

export function generateStatsMeanMission(template: Mission, tier: DifficultyTier = 2): Mission {
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
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：平均数是什么意思？\n想象 ${count} 个士兵站成一排，战力各不相同。\n主公问："咱们的兵整体水平怎么样？"\n你总不能把每个人的数字都报一遍吧？\n\n平均数就是：假如把所有人的战力"匀一匀"，每人能分到多少。\n一个数就能代表整体！`,
        en: `${narrator}: "What does the mean tell us?\nImagine ${count} soldiers in a line, each with different strength.\nThe lord asks: 'How strong is our army overall?'\nYou can't read out every single number!\n\nThe mean is: if we shared everyone's strength equally, how much would each get?\nOne number represents the whole group!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：数一数有多少个数\n$${values.join(', ')}$\n\n数一下……一共 $${count}$ 个数。这就是我们要除以的数。`,
        en: `${narrator}: "Count how many numbers there are\n$${values.join(', ')}$\n\nCount them... $${count}$ numbers in total. This is what we'll divide by."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：先把它们全部加起来\n$${values.join(' + ')} = ${sum}$\n\n这是所有人的战力总和——先"堆"成一大堆。`,
        en: `${narrator}: "First, add them all up\n$${values.join(' + ')} = ${sum}$\n\nThis is everyone's strength combined — pile it all together first."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：然后平均分——除以人数\n$\\frac{${sum}}{${count}} = ${meanRounded}$\n\n就像分饭：总量 ${sum}，${count} 个人分，每人 ${meanRounded}。`,
        en: `${narrator}: "Then share equally — divide by the count\n$\\frac{${sum}}{${count}} = ${meanRounded}$\n\nLike sharing food: total ${sum}, ${count} people, each gets ${meanRounded}."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n平均数 = $${meanRounded}$\n\n做得好！两步就搞定：先加后除。`,
        en: `${narrator}: "Answer\nMean = $${meanRounded}$\n\nGreat job! Just two steps: add first, then divide."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——用常识检查\n平均数应该在最小和最大之间，对不对？\n最小 = $${minVal}$，最大 = $${maxVal}$\n$${minVal} \\leq ${meanRounded} \\leq ${maxVal}$ ✓ 没问题！\n\n反算：$${meanRounded} \\times ${count} = ${meanRounded * count}$${meanRounded * count === sum ? ' = ' + sum + ' ✓ 完美！' : ' ≈ ' + sum + ' ✓ 合理！'}`,
        en: `${narrator}: "Verify — use common sense\nThe mean should be between the smallest and largest, right?\nMin = $${minVal}$, Max = $${maxVal}$\n$${minVal} \\leq ${meanRounded} \\leq ${maxVal}$ ✓ All good!\n\nReverse check: $${meanRounded} \\times ${count} = ${meanRounded * count}$${meanRounded * count === sum ? ' = ' + sum + ' ✓ Perfect!' : ' ≈ ' + sum + ' ✓ Makes sense!'}"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: {
      values, mode: 'mean', generatorType: 'STATISTICS_MEAN_RANDOM',
      choices: (() => {
        const r = meanRounded;
        const distractors = [sum, Math.round(sum / (count + 1) * 100) / 100, Math.round((r + Math.max(...values)) / 2 * 100) / 100]
          .filter(v => v !== r && v > 0);
        const opts = [r, ...distractors.slice(0, 3)].sort((a, b) => a - b);
        return opts.map(v => ({ label: { zh: `$${v}$`, en: `$${v}$` }, value: String(v), isLatex: true }));
      })(),
      correctChoice: String(meanRounded),
    },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   TRIGONOMETRY generator: tan, sin, or tan_inv
   Reads template data.func to decide mode.
   ══════════════════════════════════════════════════════════ */

export function generateStatsMedianMission(template: Mission, tier: DifficultyTier = 2): Mission {
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
      text: {
        zh: `${narrator}：为什么要学中位数？\n想象 ${count} 个士兵按身高从矮到高站成一排。\n站在**正中间**的那个人的身高，就是中位数。\n\n为什么不直接用平均数？因为平均数容易被"极端值"带偏——\n队伍里混进一个两米的巨人，平均身高一下子被拉高了。\n但中位数稳如泰山——巨人再高，中间那个人还是那个人！`,
        en: `${narrator}: "Why learn the median?\nImagine ${count} soldiers lined up by height, shortest to tallest.\nThe height of the person standing in the EXACT MIDDLE is the median.\n\nWhy not use the mean? Because the mean gets pulled by extreme values —\na 2-metre giant sneaks in, the average shoots up.\nBut the median stays rock-solid — the middle person is still the same!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——从小到大"站队"\n原始数据：$${values.join(', ')}$\n\n让它们排好队：$${sorted.join(', ')}$\n\n排好了！就像让士兵从矮到高站整齐。\n这一步是**最关键的**——不排队就找不到真正的中间！`,
        en: `${narrator}: "Step 1 — line them up smallest to largest\nOriginal data: $${values.join(', ')}$\n\nGet them in order: $${sorted.join(', ')}$\n\nAll lined up! Like soldiers sorted by height.\nThis step is **crucial** — without sorting, you can't find the true middle!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——找正中间的位置\n一共 ${count} 个数，中间是第几个？\n$(${count} + 1) \\div 2 = ${(count + 1) / 2}$\n\n所以中间是第 $${mid + 1}$ 个。口诀很简单：**总数加 1，除以 2**！`,
        en: `${narrator}: "Step 2 — find the middle position\nThere are ${count} numbers — which position is the middle?\n$(${count} + 1) \\div 2 = ${(count + 1) / 2}$\n\nSo the middle is position $${mid + 1}$. Easy formula: **total + 1, divide by 2**!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第三步——数到那个位置\n$${sorted.join(', ')}$\n\n从左边开始数：${sorted.slice(0, mid).map((v, i) => `第${i+1}个是${v}`).join('，')}……\n第 ${mid + 1} 个是 $${median}$！← 就是它——队伍的正中心！`,
        en: `${narrator}: "Step 3 — count to that position\n$${sorted.join(', ')}$\n\nCount from the left: ${sorted.slice(0, mid).map((v, i) => `${i+1}st is ${v}`).join(', ')}...\nPosition ${mid + 1} is $${median}$! ← That's it — the exact centre of the line!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n中位数 = $${median}$\n\n排队 → 找位置 → 数过去，三步搞定！你做得太棒了！`,
        en: `${narrator}: "Answer\nMedian = $${median}$\n\nSort → find position → count there. Three steps and done! You're amazing!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——两边数一数\n比 $${median}$ 小的有 ${mid} 个：$${sorted.slice(0, mid).join(', ')}$\n比 $${median}$ 大的有 ${mid} 个：$${sorted.slice(mid + 1).join(', ')}$\n两边一样多 ✓ 它确实站在正中间！\n\n小贴士：如果数据个数是**偶数**，要取中间两个的平均值哦——以后会学到！`,
        en: `${narrator}: "Verify — count both sides\nSmaller than $${median}$: ${mid} values — $${sorted.slice(0, mid).join(', ')}$\nLarger than $${median}$: ${mid} values — $${sorted.slice(mid + 1).join(', ')}$\nEqual on both sides ✓ It really is in the exact middle!\n\nTip: if there's an EVEN number of values, average the two middle ones — you'll learn that later!"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: {
      values: sorted, mode: 'median', generatorType: 'STATISTICS_MEDIAN_RANDOM',
      choices: (() => {
        const m = median;
        const mean = Math.round(sorted.reduce((s, v) => s + v, 0) / sorted.length);
        const distractors = [sorted[mid - 1], sorted[mid + 1] ?? sorted[mid - 2], mean]
          .filter(v => v !== undefined && v !== m);
        const unique = [...new Set([m, ...distractors])].slice(0, 4).sort((a, b) => a - b);
        return unique.map(v => ({ label: { zh: `$${v}$`, en: `$${v}$` }, value: String(v), isLatex: true }));
      })(),
      correctChoice: String(median),
    },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   HCF generator: find highest common factor of two numbers
   ══════════════════════════════════════════════════════════ */

export function generateStatsRangeMission(template: Mission, tier: DifficultyTier = 2): Mission {
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
      text: {
        zh: `${narrator}：为什么需要"极差"？\n将军选兵，不光看平均战力，还要看最强和最弱差多少。\n\n差距大 → 水平参差不齐，需要整训。\n差距小 → 水平齐整，可以出征。\n\n极差就是用一个数字衡量这个差距！`,
        en: `${narrator}: "Why do we need 'range'?\nA general doesn't just look at average strength — he needs to know the gap between best and worst.\n\nLarge gap → uneven, needs training.\nSmall gap → consistent, ready for battle.\n\nRange measures this gap with a single number!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：极差的公式——超简单！\n$$\\text{极差} = \\text{最大值} - \\text{最小值}$$\n\n只需要最大和最小两个数，中间的数据不影响极差。\n所以找到最大最小就行了！`,
        en: `${narrator}: "Range formula — super simple!\n$$\\text{Range} = \\text{Maximum} - \\text{Minimum}$$\n\nOnly need the largest and smallest — middle values don't affect the range.\nSo just find max and min!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——排序，找最大最小\n数据（已排序）：$${sorted.join(', ')}$\n\n最小值 = $${min}$（最左边）\n最大值 = $${max}$（最右边）\n\n排好序一眼就能看出来！`,
        en: `${narrator}: "Step 1 — sort to find max and min\nData (sorted): $${sorted.join(', ')}$\n\nMinimum = $${min}$ (leftmost)\nMaximum = $${max}$ (rightmost)\n\nSorting makes it obvious!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——最大减最小\n极差 $= ${max} - ${min} = ${answer}$\n\n就一步减法，搞定！`,
        en: `${narrator}: "Step 2 — subtract min from max\nRange $= ${max} - ${min} = ${answer}$\n\nOne subtraction — done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n极差 = $${answer}$\n\n最强和最弱之间相差 $${answer}$——${answer > 50 ? '差距很大，需要加紧整训！' : answer > 20 ? '差距中等，还需努力。' : '差距不大，队伍齐整！'}`,
        en: `${narrator}: "Answer\nRange = $${answer}$\n\nGap between highest and lowest is $${answer}$ — ${answer > 50 ? 'large gap, training needed!' : answer > 20 ? 'moderate gap, keep working.' : 'small gap, troops are well-matched!'}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n• 所有数据都在 $${min}$ 到 $${max}$ 之间？$${sorted.join(', ')}$ ✓\n• $${max} - ${min} = ${answer}$ ✓\n• 没有数据超出范围 ✓\n\n极差计算完毕，做得漂亮！`,
        en: `${narrator}: "Verify\n• All data between $${min}$ and $${max}$? $${sorted.join(', ')}$ ✓\n• $${max} - ${min} = ${answer}$ ✓\n• No data outside this range ✓\n\nRange calculated — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: {
      values: sorted, mode: 'range', generatorType: 'STATISTICS_RANGE_RANDOM',
      choices: (() => {
        const r = answer;
        const maxV = sorted[sorted.length - 1];
        const minV = sorted[0];
        const distractors = [maxV, minV, Math.round((maxV + minV) / 2)].filter(v => v !== r);
        const opts = [...new Set([r, ...distractors])].slice(0, 4).sort((a, b) => a - b);
        return opts.map(v => ({ label: { zh: `$${v}$`, en: `$${v}$` }, value: String(v), isLatex: true }));
      })(),
      correctChoice: String(answer),
    },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA_TRIANGLE generator: base × height ÷ 2
   ══════════════════════════════════════════════════════════ */

export function generateStatsModeMission(template: Mission, tier: DifficultyTier = 2): Mission {
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
      text: {
        zh: `${narrator}：缴获一批兵器，哪种最多？——这就是"众数"！\n众数 = 出现次数最多的值，就是数据里的"人气王"。\n\n知道最常见的兵器 → 知道敌军偏好什么战术！`,
        en: `${narrator}: "Captured weapons — which type is most common? That's the 'mode'!\nMode = most frequent value — the 'most popular' in the data.\n\nMost common weapon → enemy's preferred tactics!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：怎么找？给每个值"画正字"计数！\n数据：$${sorted.join(', ')}$\n\n${freqEntries.map(e => `$${e.val}$：${'|'.repeat(e.count)}$ = $${e.count}$ 次`).join('\n')}`,
        en: `${narrator}: "How to find it? Tally each value!\nData: $${sorted.join(', ')}$\n\n${freqEntries.map(e => `$${e.val}$: ${'|'.repeat(e.count)}$ = $${e.count}$ times`).join('\n')}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：谁的票数最多？\n$${modeValue}$ 出现了 $${modeCount}$ 次——比任何其他值都多！\n\n众数 = $${modeValue}$`,
        en: `${narrator}: "Who got the most votes?\n$${modeValue}$ appears $${modeCount}$ times — more than anything else!\n\nMode = $${modeValue}$"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n众数 = $${modeValue}$\n\n$${modeValue}$ 出现了 $${modeCount}$ 次，稳居第一！`,
        en: `${narrator}: "Answer\nMode = $${modeValue}$\n\n$${modeValue}$ appears $${modeCount}$ times — firmly in first place!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——确认没有其他值出现得更多\n${freqEntries.map(e => `$${e.val}$：${e.count} 次${e.val === modeValue ? ' ← 最多！' : ''}`).join('\n')}\n\n没有并列 → 众数唯一 = $${modeValue}$ ✓`,
        en: `${narrator}: "Verify — no other value appears more often\n${freqEntries.map(e => `$${e.val}$: ${e.count} times${e.val === modeValue ? ' ← most!' : ''}`).join('\n')}\n\nNo ties → unique mode = $${modeValue}$ ✓"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：小贴士\n• 两个值并列最多 → 两个众数\n• 所有值出现一样多 → 没有众数\n\n这道题：$${modeValue}$ 独占鳌头，做得漂亮！`,
        en: `${narrator}: "Tips\n• Two values tied for most → two modes\n• All values appear equally → no mode\n\nThis problem: $${modeValue}$ is clearly dominant — brilliantly done!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n数一数 $${modeValue}$ 出现了几次：$${modeCount}$ 次\n其他值最多出现 $${freqEntries[1]?.count ?? 0}$ 次\n$${modeValue}$ 确实最多 ✓`,
        en: `${narrator}: "Verify\nCount how many times $${modeValue}$ appears: $${modeCount}$ times\nOther values appear at most $${freqEntries[1]?.count ?? 0}$ times\n$${modeValue}$ is indeed the most frequent ✓"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: {
      values: sorted, mode: 'mode', modeValue, modeCount, generatorType: 'STATISTICS_MODE_RANDOM',
      choices: (() => {
        const distractors = freqEntries.filter(e => e.val !== modeValue).slice(0, 3).map(e => e.val);
        const opts = [modeValue, ...distractors].sort((a, b) => a - b);
        return opts.map(v => ({ label: { zh: `$${v}$`, en: `$${v}$` }, value: String(v), isLatex: true }));
      })(),
      correctChoice: String(modeValue),
    },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   TWO-STEP EQUATION generator: ax + b = c
   ══════════════════════════════════════════════════════════ */

export function generateCumFreqMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = pickRandom(['司马炎', '杜预', '羊祜']);

  // Generate grouped frequency data
  const groupCount = tier === 1 ? 4 : tier === 2 ? 5 : 6;
  const widthPools = { 1: [10], 2: [10, 20], 3: [5, 10, 20] };
  const width = pickRandom(widthPools[tier]);
  const freqPools = { 1: [3, 5, 8, 10, 12, 15], 2: [4, 6, 8, 10, 12, 15, 20], 3: [5, 8, 10, 15, 20, 25] };

  const groups: { lower: number; upper: number; freq: number }[] = [];
  let lower = 0;
  let totalFreq = 0;
  for (let i = 0; i < groupCount; i++) {
    const freq = pickRandom(freqPools[tier]);
    groups.push({ lower, upper: lower + width, freq });
    totalFreq += freq;
    lower += width;
  }

  // Compute cumulative frequencies
  const cumFreqs: number[] = [];
  let cum = 0;
  for (const g of groups) {
    cum += g.freq;
    cumFreqs.push(cum);
  }

  // Find median class (where cumulative frequency first exceeds n/2)
  const medianPos = totalFreq / 2;
  let medianClass = 0;
  for (let i = 0; i < cumFreqs.length; i++) {
    if (cumFreqs[i] >= medianPos) { medianClass = i; break; }
  }

  // Estimate median using linear interpolation within the class
  const prevCum = medianClass > 0 ? cumFreqs[medianClass - 1] : 0;
  const g = groups[medianClass];
  const median = g.lower + ((medianPos - prevCum) / g.freq) * width;
  const answer = Math.round(median * 10) / 10; // round to 1dp

  const tableZh = groups.map(g => `$${g.lower}$-$${g.upper}$: ${g.freq} 人`).join('，');
  const tableEn = groups.map(g => `$${g.lower}$-$${g.upper}$: ${g.freq}`).join(', ');

  const description: BilingualText = {
    zh: `分组数据：${tableZh}。估计中位数。`,
    en: `Grouped data: ${tableEn}. Estimate the median.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要累加频率？\n想象将军要找全军身高的中位数来制定铠甲标准。直接看频率表——第 1 组 5 人、第 2 组 7 人——很难判断"第 N 个人在哪组"。\n但如果一组一组加起来：前 1 组共 5 人，前 2 组共 12 人，前 3 组共 25 人……数到一半的时候，那组就是中位数所在的组！\n这就是累积频率的威力——把"第 N 个数据在哪"变成一眼就能看出的事。`, en: `${narrator}: "Why add up frequencies?\nImagine a general needs the median height of his army to set armour standards. Looking at the frequency table — group 1 has 5, group 2 has 7 — it's hard to tell 'which group holds the Nth person'.\nBut if you add up group by group: first 1 group has 5, first 2 groups have 12, first 3 have 25… when you reach halfway, that's the median group!\nThat's the power of cumulative frequency — it turns 'where is the Nth value?' into something you can see at a glance."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：累积频率表\n${groups.map((g, i) => `$${g.lower}$-$${g.upper}$: 频率 ${g.freq}，累积 ${cumFreqs[i]}`).join('\n')}\n\n总数 = $${totalFreq}$`, en: `${narrator}: "Cumulative frequency table\n${groups.map((g, i) => `$${g.lower}$-$${g.upper}$: freq ${g.freq}, cum ${cumFreqs[i]}`).join('\n')}\n\nTotal = $${totalFreq}$"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：找中位数位置\n中位数在第 $\\frac{${totalFreq}}{2} = ${medianPos}$ 个数据处。\n从累积频率表中找：哪个组的累积频率**首次达到或超过** ${medianPos}？`, en: `${narrator}: "Find median position\nMedian is at the $\\frac{${totalFreq}}{2} = ${medianPos}$th value.\nFrom the cumulative table: which group's cumulative first reaches or exceeds ${medianPos}?"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：线性插值估计\n中位数在 $${g.lower}$-$${g.upper}$ 这个组内。\n用插值公式精确估计位置。`, en: `${narrator}: "Linear interpolation estimate\nMedian falls in the $${g.lower}$-$${g.upper}$ group.\nUse interpolation to estimate its exact position."` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：答案\n估计中位数 ≈ $${answer}$`, en: `${narrator}: "Answer\nEstimated median ≈ $${answer}$"` }, highlightField: 'ans' },
    { text: { zh: `${narrator}：验算\n中位数应该在中位数所在组的范围内：$${g.lower} \\leq ${answer} \\leq ${g.upper}$ ✓`, en: `${narrator}: "Verify\nMedian should be within the median class: $${g.lower} \\leq ${answer} \\leq ${g.upper}$ ✓"` }, highlightField: 'ans' },
  ];

  return {
    ...template,
    description,
    data: { values: [answer], mode: 'mean', answer, groups, cumFreqs, totalFreq, generatorType: 'CUMFREQ_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PROBABILITY_TREE generator
   Two-stage tree diagram — compound probability
   Uses PROBABILITY_TREE type
   ══════════════════════════════════════════════════════════ */

export function generateProbTreeMission(template: Mission, tier: DifficultyTier = 2): Mission {
  // Friendly fractions as probabilities: numerator/denominator pairs that make clean arithmetic
  const fracPools: Record<number, { n: number; d: number }[]> = {
    1: [{ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 }, { n: 1, d: 4 }, { n: 3, d: 4 }],
    2: [{ n: 1, d: 5 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 1, d: 6 }, { n: 5, d: 6 }, { n: 2, d: 7 }, { n: 3, d: 7 }],
    3: [{ n: 3, d: 8 }, { n: 5, d: 8 }, { n: 3, d: 10 }, { n: 7, d: 10 }, { n: 2, d: 9 }, { n: 5, d: 9 }],
  };

  const frac1 = pickRandom(fracPools[tier]);
  const frac2 = pickRandom(fracPools[Math.min(tier, 2) as 1 | 2 | 3]);
  const p1 = frac1.n / frac1.d;
  const p2 = frac2.n / frac2.d;

  // Pick mode — tier 1: always 'and', tier 2-3: also 'exactly_one' / 'at_least_one'
  const modePool: string[] = tier === 1 ? ['and'] : ['and', 'and', 'exactly_one'];
  const mode = pickRandom(modePool) as 'and' | 'exactly_one';

  let answer: number;
  let answerFrac: string;
  if (mode === 'exactly_one') {
    answer = p1 * (1 - p2) + (1 - p1) * p2;
  } else {
    answer = p1 * p2;
  }
  answer = Math.round(answer * 1000) / 1000;

  // Express answer as fraction (lowest terms)
  function toFracStr(val: number, denom: number): string {
    const numer = Math.round(val * denom);
    const g = gcdCalc(Math.abs(numer), denom);
    return g === denom ? String(numer / g) : `${numer / g}/${denom / g}`;
  }
  const commonDenom = frac1.d * frac2.d;
  answerFrac = toFracStr(answer, commonDenom);

  const narrator = pickRandom(['诸葛亮', '周瑜', '司马懿']);

  // Narrative: spinning two wheels / drawing two balls
  const scenarios = [
    {
      zh: (p1f: string, p2f: string) =>
        `军师布下双转盘阵：第一个转盘指向红区概率为 $\\frac{${frac1.n}}{${frac1.d}}$，第二个转盘指向红区概率为 $\\frac{${frac2.n}}{${frac2.d}}$。`,
      en: (p1f: string, p2f: string) =>
        `Two war drums spin: the first lands on red with probability $\\frac{${frac1.n}}{${frac1.d}}$, the second with probability $\\frac{${frac2.n}}{${frac2.d}}$.`,
      objZh: mode === 'exactly_one' ? '恰好只有一个转盘指向红区的概率？' : '两个转盘都指向红区的概率？',
      objEn: mode === 'exactly_one' ? 'Find the probability exactly one spinner lands on red.' : 'Find the probability both spinners land on red.',
    },
    {
      zh: (p1f: string, p2f: string) =>
        `两支军队各自出击，第一支胜利概率为 $\\frac{${frac1.n}}{${frac1.d}}$，第二支胜利概率为 $\\frac{${frac2.n}}{${frac2.d}}$（两支独立作战）。`,
      en: (p1f: string, p2f: string) =>
        `Two detachments attack independently. The first succeeds with probability $\\frac{${frac1.n}}{${frac1.d}}$, the second with probability $\\frac{${frac2.n}}{${frac2.d}}$.`,
      objZh: mode === 'exactly_one' ? '恰好只有一支军队取胜的概率？' : '两支军队都取得胜利的概率？',
      objEn: mode === 'exactly_one' ? 'Find the probability exactly one detachment succeeds.' : 'Find the probability both detachments succeed.',
    },
  ];

  const scenario = pickRandom(scenarios);
  const description: BilingualText = {
    zh: `${scenario.zh('', '')} ${scenario.objZh}`,
    en: `${scenario.en('', '')} ${scenario.objEn}`,
  };

  const treeZh = mode === 'exactly_one'
    ? `树形图分支：\n• A成功 ($\\frac{${frac1.n}}{${frac1.d}}$) 且 B失败 ($\\frac{${frac2.d - frac2.n}}{${frac2.d}}$) → $\\frac{${frac1.n}}{${frac1.d}} \\times \\frac{${frac2.d - frac2.n}}{${frac2.d}}$\n• A失败 ($\\frac{${frac1.d - frac1.n}}{${frac1.d}}$) 且 B成功 ($\\frac{${frac2.n}}{${frac2.d}}$) → $\\frac{${frac1.d - frac1.n}}{${frac1.d}} \\times \\frac{${frac2.n}}{${frac2.d}}$`
    : `树形图分支：\n• A成功 ($\\frac{${frac1.n}}{${frac1.d}}$) 且 B成功 ($\\frac{${frac2.n}}{${frac2.d}}$) → $\\frac{${frac1.n}}{${frac1.d}} \\times \\frac{${frac2.n}}{${frac2.d}}$`;
  const treeEn = mode === 'exactly_one'
    ? `Tree branches:\n• A succeeds ($\\frac{${frac1.n}}{${frac1.d}}$) and B fails ($\\frac{${frac2.d - frac2.n}}{${frac2.d}}$) → multiply\n• A fails ($\\frac{${frac1.d - frac1.n}}{${frac1.d}}$) and B succeeds ($\\frac{${frac2.n}}{${frac2.d}}$) → multiply`
    : `Tree branches:\n• A succeeds ($\\frac{${frac1.n}}{${frac1.d}}$) and B succeeds ($\\frac{${frac2.n}}{${frac2.d}}$) → multiply`;

  const calcZh = mode === 'exactly_one'
    ? `$P(\\text{恰好一个}) = \\frac{${frac1.n}}{${frac1.d}} \\times \\frac{${frac2.d - frac2.n}}{${frac2.d}} + \\frac{${frac1.d - frac1.n}}{${frac1.d}} \\times \\frac{${frac2.n}}{${frac2.d}} = ${answerFrac}$`
    : `$P(\\text{两者都}) = \\frac{${frac1.n}}{${frac1.d}} \\times \\frac{${frac2.n}}{${frac2.d}} = ${answerFrac}$`;
  const calcEn = mode === 'exactly_one'
    ? `$P(\\text{exactly one}) = \\frac{${frac1.n}}{${frac1.d}} \\times \\frac{${frac2.d - frac2.n}}{${frac2.d}} + \\frac{${frac1.d - frac1.n}}{${frac1.d}} \\times \\frac{${frac2.n}}{${frac2.d}} = ${answerFrac}$`
    : `$P(\\text{both}) = \\frac{${frac1.n}}{${frac1.d}} \\times \\frac{${frac2.n}}{${frac2.d}} = ${answerFrac}$`;

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学树形图？\n战场上常有多事件连续发生。"第一支军队取胜"之后，"第二支军队是否也取胜"——两件事各有不确定性。\n树形图就是把所有可能的"剧情分支"列出来，像棵树一样展开，每条路径的概率一目了然。\n树形图不只是工具——它是把不确定性变成可计算问题的魔法。`,
        en: `${narrator}: "Why learn tree diagrams?\nBattlefields have chains of events. Whether the first detachment wins, then whether the second one does too — each is uncertain.\nA tree diagram lists every possible 'storyline branch', spreading out like a tree. Every path's probability is clear at a glance.\nTree diagrams aren't just a tool — they turn uncertainty into calculable problems."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：核心法则——乘法原理\n两个**独立事件**同时发生：把各自的概率相乘！\n$P(A \\text{ 且 } B) = P(A) \\times P(B)$\n为什么是乘？因为每种 A 的结果都对应所有 B 的可能，总路径数 = $a \\times b$。`,
        en: `${narrator}: "Core rule — Multiplication Principle\nFor two independent events both occurring: MULTIPLY their probabilities!\n$P(A \\text{ and } B) = P(A) \\times P(B)$\nWhy multiply? Every outcome of A pairs with every outcome of B — total paths = $a \\times b$."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：画出树形图\n${treeZh}`,
        en: `${narrator}: "Draw the tree diagram\n${treeEn}"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：计算所求概率\n${calcZh}`,
        en: `${narrator}: "Calculate the required probability\n${calcEn}"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：答案\n所求概率 $= ${answerFrac}$`,
        en: `${narrator}: "Answer\nRequired probability $= ${answerFrac}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：验算\n概率必须在 $[0,1]$ 之间：$0 \\leq ${answerFrac} \\leq 1$ ✓\n所有分支概率之和 = 1 ✓（树形图的自验算法则）`,
        en: `${narrator}: "Verify\nProbability must be in $[0,1]$: $0 \\leq ${answerFrac} \\leq 1$ ✓\nAll branch probabilities sum to 1 ✓ (tree diagram self-check rule)"`,
      },
      highlightField: 'p',
    },
  ];

  return {
    ...template,
    description,
    data: { p1, p2, mode, frac1, frac2, generatorType: 'PROB_TREE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   TREE_DIAGRAM generator: conditional probability (without replacement)
   Two picks from a mixed bag — each event depends on previous pick
   Uses TREE_DIAGRAM type
   ══════════════════════════════════════════════════════════ */

export function generateTreeDiagramMission(template: Mission, tier: DifficultyTier = 2): Mission {
  // Pool of (total, red) combos that yield clean fractions after two picks
  const pools: Record<number, { total: number; red: number }[]> = {
    1: [{ total: 5, red: 2 }, { total: 5, red: 3 }, { total: 4, red: 1 }, { total: 4, red: 3 }],
    2: [{ total: 6, red: 2 }, { total: 6, red: 4 }, { total: 8, red: 3 }, { total: 10, red: 4 }, { total: 10, red: 6 }],
    3: [{ total: 12, red: 5 }, { total: 15, red: 6 }, { total: 20, red: 8 }, { total: 10, red: 3 }],
  };

  const { total, red } = pickRandom(pools[tier]);
  const blue = total - red;

  // Choose mode
  const modePool = tier === 1 ? ['both_red'] : tier === 2 ? ['both_red', 'both_same', 'diff'] : ['both_same', 'diff'];
  const mode = pickRandom(modePool) as 'both_red' | 'both_same' | 'diff';

  // Compute answer (conditional, no replacement)
  let answerVal: number;
  if (mode === 'both_red') {
    answerVal = (red / total) * ((red - 1) / (total - 1));
  } else if (mode === 'both_same') {
    answerVal = (red / total) * ((red - 1) / (total - 1)) + (blue / total) * ((blue - 1) / (total - 1));
  } else {
    answerVal = (red / total) * (blue / (total - 1)) + (blue / total) * (red / (total - 1));
  }
  answerVal = Math.round(answerVal * 10000) / 10000;

  // Express as fraction
  function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
  function toFrac(n: number, d: number): string {
    const g = gcd(Math.abs(n), d);
    const rn = n / g, rd = d / g;
    return rd === 1 ? `${rn}` : `${rn}/${rd}`;
  }
  const denominator = total * (total - 1);
  const numerator = Math.round(answerVal * denominator);
  const answerFrac = toFrac(numerator, denominator);

  const narrator = pickRandom(['诸葛亮', '周瑜', '曹操']);

  // Scenario: draws tokens from a bag
  const itemName = pickRandom([
    { zh: '红色兵符', en: 'red token' },
    { zh: '红玉令', en: 'red jade token' },
  ]);

  const questionZh =
    mode === 'both_red'
      ? `两次都取到${itemName.zh}的概率`
      : mode === 'both_same'
      ? '两次取到同色的概率'
      : '两次取到不同颜色的概率';
  const questionEn =
    mode === 'both_red'
      ? `probability both draws are ${itemName.en}`
      : mode === 'both_same'
      ? 'probability both draws are the same colour'
      : 'probability the two draws are different colours';

  const description: BilingualText = {
    zh: `布袋中有 $${red}$ 个${itemName.zh}和 $${blue}$ 个蓝色兵符（共 $${total}$ 个）。不放回连取两个，求${questionZh}。`,
    en: `A bag contains $${red}$ ${itemName.en}s and $${blue}$ blue tokens ($${total}$ total). Two tokens are drawn without replacement. Find the ${questionEn}.`,
  };

  // Branch fractions for tutorial
  const p1rZh = `\\frac{${red}}{${total}}`;
  const p1bZh = `\\frac{${blue}}{${total}}`;
  const p2r_r = `\\frac{${red - 1}}{${total - 1}}`;
  const p2b_r = `\\frac{${blue}}{${total - 1}}`;
  const p2r_b = `\\frac{${red}}{${total - 1}}`;
  const p2b_b = `\\frac{${blue - 1}}{${total - 1}}`;

  const branchZh =
    mode === 'both_red'
      ? `第一次取红（$${p1rZh}$）→ 第二次也红（$${p2r_r}$）`
      : mode === 'both_same'
      ? `路径1：红→红 $${p1rZh} \\times ${p2r_r}$\n路径2：蓝→蓝 $${p1bZh} \\times ${p2b_b}$`
      : `路径1：红→蓝 $${p1rZh} \\times ${p2b_r}$\n路径2：蓝→红 $${p1bZh} \\times ${p2r_b}$`;
  const branchEn =
    mode === 'both_red'
      ? `First draw red ($${p1rZh}$) → Second also red ($${p2r_r}$)`
      : mode === 'both_same'
      ? `Path 1: red→red $${p1rZh} \\times ${p2r_r}$\nPath 2: blue→blue $${p1bZh} \\times ${p2b_b}$`
      : `Path 1: red→blue $${p1rZh} \\times ${p2b_r}$\nPath 2: blue→red $${p1bZh} \\times ${p2r_b}$`;

  const calcZh =
    mode === 'both_red'
      ? `$P = ${p1rZh} \\times ${p2r_r} = ${answerFrac}$`
      : mode === 'both_same'
      ? `$P = ${p1rZh} \\times ${p2r_r} + ${p1bZh} \\times ${p2b_b} = ${answerFrac}$`
      : `$P = ${p1rZh} \\times ${p2b_r} + ${p1bZh} \\times ${p2r_b} = ${answerFrac}$`;
  const calcEn = calcZh;

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么树形图需要"条件概率"？\n普通树形图假设两次抽取**独立**（放回去）。但战场上"不放回"更真实：抽走一枚令牌，袋中剩余数目变了，第二次概率也随之改变。\n这就是**条件概率**：$P(B|A)$，在 A 已发生的条件下，B 的概率。`,
        en: `${narrator}: "Why do tree diagrams need 'conditional probability'?\nA basic tree assumes draws are **independent** (with replacement). But without replacement, taking one token changes what remains — the second probability depends on the first.\nThis is **conditional probability**: $P(B|A)$ — the probability of B given A has occurred."`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：不放回的关键变化\n第一次取红后，袋中红色变为 $${red}-1 = ${red - 1}$，总数变为 $${total}-1 = ${total - 1}$。\n所以：$P(\\text{第二次红} | \\text{第一次红}) = ${p2r_r}$\n与独立情况不同！这正是"条件"的含义。`,
        en: `${narrator}: "Key change without replacement\nAfter taking one red token, $${red}-1 = ${red - 1}$ red remain, total becomes $${total}-1 = ${total - 1}$.\nSo $P(\\text{2nd red} | \\text{1st red}) = ${p2r_r}$\nDifferent from independent case — that's the 'conditional' part!"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：画出树形图的各分支\n${branchZh}`,
        en: `${narrator}: "Draw the tree diagram branches\n${branchEn}"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：沿路径相乘，多路径相加\n$P(A \\cap B) = P(A) \\times P(B|A)$\n需要的路径概率相乘，再把所有满足条件的路径相加。\n${calcZh}`,
        en: `${narrator}: "Multiply along paths, add across paths\n$P(A \\cap B) = P(A) \\times P(B|A)$\nMultiply along each required path, then add all qualifying paths.\n${calcEn}"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：答案\n所求概率 $= ${answerFrac}$`,
        en: `${narrator}: "Answer\nRequired probability $= ${answerFrac}$"`,
      },
      highlightField: 'p',
    },
    {
      text: {
        zh: `${narrator}：验算\n所有分支概率之和必须 = 1（树形图自验算）。\n且 $0 \\leq ${answerFrac} \\leq 1$ ✓\n把答案化成最简分数或精确小数作为最终答案。`,
        en: `${narrator}: "Verify\nAll branch probabilities must sum to 1 (tree diagram self-check).\nAlso $0 \\leq ${answerFrac} \\leq 1$ ✓\nExpress your answer as a simplified fraction or exact decimal."`,
      },
      highlightField: 'p',
    },
  ];

  return {
    ...template,
    description,
    data: { total, red, blue, mode, generatorType: 'TREE_DIAGRAM_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SECTOR generator: arc length or sector area
   Uses CIRCLE type with answer field
   ══════════════════════════════════════════════════════════ */

