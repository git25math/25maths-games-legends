/**
 * Add discoverSteps to Y10 missions (68 missions).
 * Run: npx tsx scripts/add-discover-steps-y10.ts
 */
import * as fs from 'fs';
import * as path from 'path';

type DS = { prompt: {zh:string;en:string}; type:'choice'; choices:{zh:string;en:string}[]; onCorrect:{zh:string;en:string}; onWrong:{zh:string;en:string}; onSkip:{zh:string;en:string} };

const STEPS: Record<number, DS[]> = {

  // === Roots/Quadratics ===
  1012: [{
    prompt: { zh: '赤壁火船烧出一道火弧。火势覆盖的水平宽度——就是抛物线两个根之间的距离。怎么找这两个根？', en: 'Fire ships at Red Cliffs burn an arc. The horizontal span of the fire — the distance between two roots of a parabola. How to find them?' },
    type: 'choice',
    choices: [
      { zh: '令 $y=0$，解二次方程', en: 'Set $y=0$ and solve the quadratic' },
      { zh: '令 $x=0$，代入求值', en: 'Set $x=0$ and substitute' },
    ],
    onCorrect: { zh: '根 = 曲线与 $x$ 轴的交点 = $y=0$ 的解。\n解 $ax^2+bx+c=0$ 得到两个根 $x_1, x_2$，火势宽度 $= |x_1 - x_2|$。\n求根公式：$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', en: 'Roots = where the curve crosses the x-axis = solutions of $y=0$.\nSolve $ax^2+bx+c=0$ for $x_1, x_2$; fire span $= |x_1 - x_2|$.\nQuadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$' },
    onWrong: { zh: '$x=0$ 只给出 $y$ 轴上的截距。根是曲线碰到 $x$ 轴的地方——令 $y=0$。', en: '$x=0$ only gives the y-intercept. Roots are where the curve meets the x-axis — set $y=0$.' },
    onSkip: { zh: '二次方程的根 = 令 $y=0$ 的解。用求根公式或因式分解。', en: 'Roots of a quadratic = solutions when $y=0$. Use the quadratic formula or factorisation.' },
  }],
  1013: [{
    prompt: { zh: '投石车发射石块，轨迹为 $y = -x^2 + 5x$。石块在哪里落地？"落地"在数学上怎么表达？', en: 'A catapult launches a stone along $y = -x^2 + 5x$. Where does it land? What does "landing" mean mathematically?' },
    type: 'choice',
    choices: [
      { zh: '$y=0$ 且 $x>0$——高度为零就是落地', en: '$y=0$ and $x>0$ — zero height means landing' },
      { zh: '求最高点', en: 'Find the highest point' },
    ],
    onCorrect: { zh: '落地 = 高度归零 = $y=0$。\n$-x^2+5x=0 \\Rightarrow x(-x+5)=0 \\Rightarrow x=0$ 或 $x=5$。\n$x=0$ 是发射点，$x=5$ 是落地点。', en: 'Landing = height returns to zero = $y=0$.\n$-x^2+5x=0 \\Rightarrow x(-x+5)=0 \\Rightarrow x=0$ or $x=5$.\n$x=0$ is launch, $x=5$ is landing.' },
    onWrong: { zh: '最高点是顶点，不是落地点。石块落地 = 回到地面 = $y=0$。\n解 $y=0$ 并取 $x>0$ 的根。', en: 'Highest point is the vertex, not landing. Landing = back to ground = $y=0$.\nSolve $y=0$ and take the $x>0$ root.' },
    onSkip: { zh: '落地 = $y=0$。解方程取正根。发射点在 $x=0$，落点在另一个根。', en: 'Landing = $y=0$. Solve and take the positive root. Launch at $x=0$, land at the other root.' },
  }],

  // === Simultaneous Equations ===
  1022: [{
    prompt: { zh: '粮草互换：3车粮+2车草=26两银，1车粮+4车草=22两银。为什么需要两个方程？', en: 'Supply trade: 3 grain + 2 hay = 26 silver, 1 grain + 4 hay = 22 silver. Why do we need two equations?' },
    type: 'choice',
    choices: [
      { zh: '两个未知数需要两个方程才能唯一确定', en: 'Two unknowns need two equations for a unique solution' },
      { zh: '一个方程就够了', en: 'One equation is enough' },
    ],
    onCorrect: { zh: '一个方程有无穷多组解。两个方程 = 两条直线的交点 = 唯一解。\n消元法：第二个方程 ×3 → $3x+12y=66$，减去第一个方程消去 $x$。\n或代入法：从第二个方程 $x=22-4y$ 代入第一个。', en: 'One equation has infinitely many solutions. Two equations = intersection of two lines = unique solution.\nElimination: multiply 2nd by 3 → $3x+12y=66$, subtract 1st to eliminate $x$.\nOr substitution: from 2nd, $x=22-4y$, sub into 1st.' },
    onWrong: { zh: '一个方程两个未知数——无穷多组解！必须两个方程联立才能锁定 $x$ 和 $y$。', en: 'One equation, two unknowns — infinitely many solutions! Need two equations to pin down $x$ and $y$.' },
    onSkip: { zh: '$n$ 个未知数需要 $n$ 个独立方程。用消元法或代入法求解。', en: '$n$ unknowns need $n$ independent equations. Solve by elimination or substitution.' },
  }],
  1023: [{
    prompt: { zh: '赤壁调度：大船 $x$ 艘+小船 $y$ 艘，$x+y=10$，$5x+2y=38$。怎么最快求解？', en: 'Fleet dispatch: large boats $x$ + small boats $y$, $x+y=10$, $5x+2y=38$. Fastest method?' },
    type: 'choice',
    choices: [
      { zh: '从 $x+y=10$ 得 $y=10-x$，代入第二个方程', en: 'From $x+y=10$ get $y=10-x$, substitute into the second' },
      { zh: '两个方程直接相加', en: 'Just add the two equations' },
    ],
    onCorrect: { zh: '代入法在其中一个方程容易变形时最高效。\n$y=10-x$ 代入：$5x+2(10-x)=38$\n$5x+20-2x=38 \\Rightarrow 3x=18 \\Rightarrow x=6$，$y=4$。', en: 'Substitution is most efficient when one equation rearranges easily.\n$y=10-x$ sub in: $5x+2(10-x)=38$\n$5x+20-2x=38 \\Rightarrow 3x=18 \\Rightarrow x=6$, $y=4$.' },
    onWrong: { zh: '直接相加得 $6x+3y=48$——未知数没有被消掉！\n要消去一个未知数，用代入或先乘系数再相减。', en: 'Adding gives $6x+3y=48$ — no unknown eliminated!\nTo eliminate, substitute or multiply then subtract.' },
    onSkip: { zh: '代入法：从简单方程解出一个变量，代入另一个。消元法：对齐系数再相减。', en: 'Substitution: solve one variable from the simpler equation, sub into the other. Elimination: match coefficients then subtract.' },
  }],

  // === Probability ===
  1032: [{
    prompt: { zh: '连环计：庞统说服曹操锁船（成功率0.7），黄盖诈降（成功率0.8）。两件事都成功的概率是多少？', en: 'Chain strategy: Pang Tong convinces Cao Cao to chain ships (P=0.7), Huang Gai feigns surrender (P=0.8). Probability both succeed?' },
    type: 'choice',
    choices: [
      { zh: '$0.7 \\times 0.8 = 0.56$——独立事件相乘', en: '$0.7 \\times 0.8 = 0.56$ — multiply for independent events' },
      { zh: '$0.7 + 0.8 = 1.5$', en: '$0.7 + 0.8 = 1.5$' },
    ],
    onCorrect: { zh: '独立事件"同时发生" = 概率相乘。\n$P(A \\cap B) = P(A) \\times P(B)$\n注意：概率不会超过 1！相加得到 1.5 一定是错的。', en: 'Independent events "both happening" = multiply probabilities.\n$P(A \\cap B) = P(A) \\times P(B)$\nNote: probability never exceeds 1! Adding to get 1.5 is definitely wrong.' },
    onWrong: { zh: '概率超过 1 一定是错的！"同时" = 相乘，不是相加。\n$P(A \\cap B) = 0.7 \\times 0.8 = 0.56$', en: 'Probability over 1 is always wrong! "Both" = multiply, not add.\n$P(A \\cap B) = 0.7 \\times 0.8 = 0.56$' },
    onSkip: { zh: '独立事件同时发生：$P(A \\cap B) = P(A) \\times P(B)$。"同时"想到"乘"。', en: 'Independent events both occurring: $P(A \\cap B) = P(A) \\times P(B)$. "Both" → "multiply".' },
  }],
  1033: [{
    prompt: { zh: '华容道有 5 条路，其中 2 条有伏兵。随机选一条，遇到伏兵的概率是多少？', en: 'Huarong Pass has 5 paths, 2 have ambushes. Picking randomly, what is the probability of an ambush?' },
    type: 'choice',
    choices: [
      { zh: '$P = \\frac{2}{5}$——有利结果÷总结果', en: '$P = \\frac{2}{5}$ — favourable ÷ total' },
      { zh: '$P = \\frac{5}{2}$', en: '$P = \\frac{5}{2}$' },
    ],
    onCorrect: { zh: '概率的基本公式：$P = \\frac{\\text{有利结果数}}{\\text{总结果数}}$\n2 条有伏兵 ÷ 5 条路 = $\\frac{2}{5}$。\n概率永远在 0 到 1 之间。', en: 'Basic probability formula: $P = \\frac{\\text{favourable outcomes}}{\\text{total outcomes}}$\n2 ambush paths ÷ 5 total paths = $\\frac{2}{5}$.\nProbability is always between 0 and 1.' },
    onWrong: { zh: '$\\frac{5}{2} = 2.5$——概率不能大于 1！分子是有利的，分母是总数。\n$P = \\frac{2}{5}$', en: '$\\frac{5}{2} = 2.5$ — probability cannot exceed 1! Numerator is favourable, denominator is total.\n$P = \\frac{2}{5}$' },
    onSkip: { zh: '$P = \\frac{\\text{有利}}{\\text{总数}}$，结果在 $[0, 1]$ 之间。', en: '$P = \\frac{\\text{favourable}}{\\text{total}}$, always between 0 and 1.' },
  }],
  1034: [{
    prompt: { zh: '诸葛亮连占两卦，每卦吉凶各半。用概率树求"恰好一次吉"的概率——怎么算？', en: 'Zhuge Liang reads two fortunes, each 50-50 lucky/unlucky. Using a tree diagram, find P(exactly one lucky). How?' },
    type: 'choice',
    choices: [
      { zh: '画树形图，把"吉凶"和"凶吉"两条路径的概率加起来', en: 'Draw a tree, add probabilities of "lucky-unlucky" and "unlucky-lucky" paths' },
      { zh: '直接算 $0.5 \\times 0.5$', en: 'Just calculate $0.5 \\times 0.5$' },
    ],
    onCorrect: { zh: '"恰好一次"有两条路径：\n吉→凶：$0.5 \\times 0.5 = 0.25$\n凶→吉：$0.5 \\times 0.5 = 0.25$\n合计：$0.25 + 0.25 = 0.5$\n树形图帮你不遗漏任何路径！', en: '"Exactly one" has two paths:\nLucky→Unlucky: $0.5 \\times 0.5 = 0.25$\nUnlucky→Lucky: $0.5 \\times 0.5 = 0.25$\nTotal: $0.25 + 0.25 = 0.5$\nTree diagrams ensure no path is missed!' },
    onWrong: { zh: '$0.5 \\times 0.5 = 0.25$ 只是"两次都吉"的概率。\n"恰好一次"要加上两条路径：吉凶 + 凶吉。', en: '$0.5 \\times 0.5 = 0.25$ is only P(both lucky).\n"Exactly one" needs both paths: lucky-unlucky + unlucky-lucky.' },
    onSkip: { zh: '概率树：沿路径相乘，不同路径相加。"恰好一次" = 两条路径之和。', en: 'Tree diagram: multiply along branches, add between paths. "Exactly one" = sum of two paths.' },
  }],

  // === Trigonometry ===
  1042: [{
    prompt: { zh: '旗舰与敌船之间的距离和高度差已知。求两船之间的夹角 $\\theta$——用哪个三角比？', en: 'Distance and height difference between flagship and enemy known. Find angle $\\theta$ — which trig ratio?' },
    type: 'choice',
    choices: [
      { zh: '看已知边是对边、邻边还是斜边，选 SOH CAH TOA', en: 'Check if known sides are opposite, adjacent, or hypotenuse — use SOH CAH TOA' },
      { zh: '都用 $\\sin$', en: 'Always use $\\sin$' },
    ],
    onCorrect: { zh: 'SOH CAH TOA 三选一的关键：看你有哪两条边。\n$\\sin\\theta = \\frac{O}{H}$，$\\cos\\theta = \\frac{A}{H}$，$\\tan\\theta = \\frac{O}{A}$\n有对边和邻边 → $\\tan$；有对边和斜边 → $\\sin$；有邻边和斜边 → $\\cos$。', en: 'SOH CAH TOA selection: check which two sides you have.\n$\\sin\\theta = \\frac{O}{H}$, $\\cos\\theta = \\frac{A}{H}$, $\\tan\\theta = \\frac{O}{A}$\nOpposite + Adjacent → $\\tan$; Opposite + Hypotenuse → $\\sin$; Adjacent + Hypotenuse → $\\cos$.' },
    onWrong: { zh: '不能总用 $\\sin$！三角比的选择取决于已知的两条边。\n记住 SOH CAH TOA 三个口诀对应三种情况。', en: 'Can\'t always use $\\sin$! The ratio depends on which two sides are known.\nRemember SOH CAH TOA — three ratios for three situations.' },
    onSkip: { zh: 'SOH: $\\sin=O/H$，CAH: $\\cos=A/H$，TOA: $\\tan=O/A$。看已知边选公式。', en: 'SOH: $\\sin=O/H$, CAH: $\\cos=A/H$, TOA: $\\tan=O/A$. Choose based on known sides.' },
  }],
  1043: [{
    prompt: { zh: '火攻时从江面看城墙顶。水平距离 30m，城墙高 20m。仰角 $\\theta$ 怎么求？', en: 'During fire attack, looking up at the wall top. Horizontal distance 30m, wall height 20m. Find elevation angle $\\theta$.' },
    type: 'choice',
    choices: [
      { zh: '$\\tan\\theta = \\frac{20}{30}$，$\\theta = \\tan^{-1}(\\frac{2}{3})$', en: '$\\tan\\theta = \\frac{20}{30}$, $\\theta = \\tan^{-1}(\\frac{2}{3})$' },
      { zh: '$\\sin\\theta = \\frac{20}{30}$', en: '$\\sin\\theta = \\frac{20}{30}$' },
    ],
    onCorrect: { zh: '仰角问题：已知对边（高度）和邻边（水平距离）→ 用 $\\tan$。\n$\\tan\\theta = \\frac{\\text{对边}}{\\text{邻边}} = \\frac{20}{30} = \\frac{2}{3}$\n$\\theta = \\tan^{-1}(\\frac{2}{3}) \\approx 33.7°$', en: 'Elevation angle: given opposite (height) and adjacent (horizontal) → use $\\tan$.\n$\\tan\\theta = \\frac{opp}{adj} = \\frac{20}{30} = \\frac{2}{3}$\n$\\theta = \\tan^{-1}(\\frac{2}{3}) \\approx 33.7°$' },
    onWrong: { zh: '$\\sin$ 用的是斜边，但这里 30m 是水平距离（邻边），不是斜边！\n对边 + 邻边 → $\\tan\\theta = \\frac{20}{30}$。', en: '$\\sin$ uses hypotenuse, but 30m is horizontal distance (adjacent), not hypotenuse!\nOpposite + Adjacent → $\\tan\\theta = \\frac{20}{30}$.' },
    onSkip: { zh: '仰角 = $\\tan^{-1}(\\frac{\\text{高}}{\\text{水平距离}})$。对边和邻边 → $\\tan$。', en: 'Elevation = $\\tan^{-1}(\\frac{height}{horizontal})$. Opposite and adjacent → $\\tan$.' },
  }],

  // === Sequences ===
  1051: [{
    prompt: { zh: '赤壁增兵：第一天 200 人，之后每天多派 50 人。第 $n$ 天派多少人？', en: 'Red Cliffs reinforcements: 200 on day 1, adding 50 more each day. How many on day $n$?' },
    type: 'choice',
    choices: [
      { zh: '$a_n = 200 + (n-1) \\times 50$——等差数列', en: '$a_n = 200 + (n-1) \\times 50$ — arithmetic sequence' },
      { zh: '$a_n = 200 \\times 50^n$', en: '$a_n = 200 \\times 50^n$' },
    ],
    onCorrect: { zh: '每天"多一样多" = 等差数列。公差 $d=50$，首项 $a=200$。\n$a_n = a + (n-1)d = 200 + (n-1) \\times 50$\n第5天：$200 + 4 \\times 50 = 400$ 人。', en: 'Same amount added each day = arithmetic sequence. Common difference $d=50$, first term $a=200$.\n$a_n = a + (n-1)d = 200 + (n-1) \\times 50$\nDay 5: $200 + 4 \\times 50 = 400$.' },
    onWrong: { zh: '$200 \\times 50^n$ 是指数增长——第2天就变一万了！\n"每天多50"是加法，不是乘法。等差数列：$a_n = a + (n-1)d$。', en: '$200 \\times 50^n$ is exponential growth — day 2 would be ten thousand!\n"50 more each day" is addition, not multiplication. Arithmetic: $a_n = a + (n-1)d$.' },
    onSkip: { zh: '等差数列：$a_n = a + (n-1)d$。$a$ = 首项，$d$ = 公差。', en: 'Arithmetic sequence: $a_n = a + (n-1)d$. $a$ = first term, $d$ = common difference.' },
  }],
  1052: [{
    prompt: { zh: '连弩阵：第一排 3 架弩机，每多一排加 2 架。第 $n$ 排有多少架？', en: 'Crossbow formation: 3 in row 1, adding 2 per row. How many in row $n$?' },
    type: 'choice',
    choices: [
      { zh: '$a_n = 3 + (n-1) \\times 2 = 2n+1$', en: '$a_n = 3 + (n-1) \\times 2 = 2n+1$' },
      { zh: '$a_n = 3 \\times 2^n$', en: '$a_n = 3 \\times 2^n$' },
    ],
    onCorrect: { zh: '首项 $a=3$，公差 $d=2$。\n$a_n = 3 + (n-1)(2) = 3 + 2n - 2 = 2n+1$\n验证：$n=1 \\to 3$，$n=2 \\to 5$，$n=3 \\to 7$ ✓', en: 'First term $a=3$, common difference $d=2$.\n$a_n = 3 + (n-1)(2) = 3 + 2n - 2 = 2n+1$\nCheck: $n=1 \\to 3$, $n=2 \\to 5$, $n=3 \\to 7$' },
    onWrong: { zh: '$3 \\times 2^n$ 是等比数列（翻倍）。这里每排"加"2，不是"乘"2。\n加法增长 = 等差数列 $a_n = a + (n-1)d$。', en: '$3 \\times 2^n$ is geometric (doubling). Here each row "adds" 2, not "multiplies" by 2.\nAdditive growth = arithmetic: $a_n = a + (n-1)d$.' },
    onSkip: { zh: '区分等差（加）和等比（乘）。每排加 $d$ → $a_n = a + (n-1)d$。', en: 'Distinguish arithmetic (add) from geometric (multiply). Add $d$ per row → $a_n = a + (n-1)d$.' },
  }],
  1053: [{
    prompt: { zh: '粮草消耗：第1天用100石，之后每天多消耗15石。第 $n$ 天消耗多少？', en: 'Supply consumption: 100 units on day 1, increasing by 15 each day. How much on day $n$?' },
    type: 'choice',
    choices: [
      { zh: '$a_n = 100 + (n-1) \\times 15$', en: '$a_n = 100 + (n-1) \\times 15$' },
      { zh: '$a_n = 100 + 15n$', en: '$a_n = 100 + 15n$' },
    ],
    onCorrect: { zh: '注意是 $(n-1)$，不是 $n$！第 1 天增加了 0 次。\n$a_1 = 100 + 0 \\times 15 = 100$ ✓\n$a_2 = 100 + 1 \\times 15 = 115$ ✓\n常见错误：忘记减 1，导致首项多加了一个 $d$。', en: 'Note it\'s $(n-1)$, not $n$! Day 1 has 0 increases.\n$a_1 = 100 + 0 \\times 15 = 100$ ✓\n$a_2 = 100 + 1 \\times 15 = 115$ ✓\nCommon mistake: forgetting to subtract 1, adding an extra $d$ to the first term.' },
    onWrong: { zh: '$100 + 15n$ 在 $n=1$ 时 = $115$，但第1天应该是 100！\n$(n-1)$ 确保第1天增加了 0 次公差。', en: '$100 + 15n$ gives $115$ when $n=1$, but day 1 should be 100!\n$(n-1)$ ensures day 1 has zero increases.' },
    onSkip: { zh: '$a_n = a + (n-1)d$。用 $n=1$ 验算首项是否正确。', en: '$a_n = a + (n-1)d$. Always verify with $n=1$ to check the first term.' },
  }],
  1054: [{
    prompt: { zh: '军阵排列：3, 7, 11, 15, ... 求第 $n$ 项的通项公式 $pn+q$。怎么找 $p$ 和 $q$？', en: 'Formation pattern: 3, 7, 11, 15, ... Find the $n$th term formula $pn+q$. How to find $p$ and $q$?' },
    type: 'choice',
    choices: [
      { zh: '$p$ = 公差 = 4，代入 $n=1$ 解出 $q$', en: '$p$ = common difference = 4, substitute $n=1$ to find $q$' },
      { zh: '$p$ = 首项 = 3', en: '$p$ = first term = 3' },
    ],
    onCorrect: { zh: '等差数列通项 $= pn + q$，其中 $p =$ 公差。\n$p = 7-3 = 4$。代入 $n=1$：$4(1)+q = 3 \\Rightarrow q = -1$。\n通项公式：$4n - 1$。验证：$n=2 \\to 7$ ✓', en: 'Arithmetic $n$th term $= pn + q$, where $p =$ common difference.\n$p = 7-3 = 4$. Sub $n=1$: $4(1)+q = 3 \\Rightarrow q = -1$.\nFormula: $4n - 1$. Check: $n=2 \\to 7$ ✓' },
    onWrong: { zh: '$p$ 是每项增加的量（公差），不是首项。\n3→7→11→15：每次加4，所以 $p=4$。', en: '$p$ is the amount added each term (common difference), not the first term.\n3→7→11→15: adding 4 each time, so $p=4$.' },
    onSkip: { zh: '通项公式 $pn+q$：$p$ = 公差，$q$ = 代入 $n=1$ 后解出。', en: 'Formula $pn+q$: $p$ = common difference, $q$ = solve by substituting $n=1$.' },
  }],
  1055: [{
    prompt: { zh: '兵力预测：等差数列首项 $a=50$，公差 $d=8$。第 20 项是多少？', en: 'Force prediction: arithmetic sequence $a=50$, $d=8$. What is the 20th term?' },
    type: 'choice',
    choices: [
      { zh: '$a_{20} = 50 + 19 \\times 8 = 202$', en: '$a_{20} = 50 + 19 \\times 8 = 202$' },
      { zh: '$a_{20} = 50 + 20 \\times 8 = 210$', en: '$a_{20} = 50 + 20 \\times 8 = 210$' },
    ],
    onCorrect: { zh: '第 $n$ 项要加 $(n-1)$ 个公差！第20项加了19个公差。\n$a_{20} = 50 + 19 \\times 8 = 50 + 152 = 202$\n从第1项到第20项，增加了 19 次。', en: 'The $n$th term adds $(n-1)$ common differences! The 20th adds 19.\n$a_{20} = 50 + 19 \\times 8 = 50 + 152 = 202$\nFrom term 1 to term 20, there are 19 increases.' },
    onWrong: { zh: '$n=20$ 时加的是 $19 \\times d$，不是 $20 \\times d$！\n想一想：从第1项到第2项，只增加了1次，所以 $(n-1)$ 次。', en: 'At $n=20$ you add $19 \\times d$, not $20 \\times d$!\nThink: from term 1 to term 2, there\'s only 1 increase — hence $(n-1)$ times.' },
    onSkip: { zh: '$a_n = a + (n-1)d$。第 $n$ 项经历了 $(n-1)$ 次增长。', en: '$a_n = a + (n-1)d$. The $n$th term has undergone $(n-1)$ increases.' },
  }],
  1056: [{
    prompt: { zh: '瘟疫蔓延：第1天10人感染，之后每天感染人数是前一天的3倍。第 $n$ 天多少人？这是什么数列？', en: 'Plague spreads: 10 infected on day 1, tripling daily. How many on day $n$? What type of sequence?' },
    type: 'choice',
    choices: [
      { zh: '$a_n = 10 \\times 3^{n-1}$——等比数列', en: '$a_n = 10 \\times 3^{n-1}$ — geometric sequence' },
      { zh: '$a_n = 10 + 3n$——等差数列', en: '$a_n = 10 + 3n$ — arithmetic sequence' },
    ],
    onCorrect: { zh: '"每天是前一天的 $r$ 倍" = 等比数列。公比 $r=3$。\n$a_n = a \\times r^{n-1} = 10 \\times 3^{n-1}$\n等比增长极快：第5天 $= 10 \\times 81 = 810$ 人！', en: '"Each day is $r$ times the previous" = geometric sequence. Common ratio $r=3$.\n$a_n = a \\times r^{n-1} = 10 \\times 3^{n-1}$\nGeometric growth is explosive: day 5 $= 10 \\times 81 = 810$!' },
    onWrong: { zh: '"加"是等差，"乘"是等比。每天乘以3 → 等比。\n$a_n = a \\times r^{n-1} = 10 \\times 3^{n-1}$', en: '"Add" = arithmetic, "multiply" = geometric. Daily tripling → geometric.\n$a_n = a \\times r^{n-1} = 10 \\times 3^{n-1}$' },
    onSkip: { zh: '等比数列：$a_n = a \\times r^{n-1}$。$a$ = 首项，$r$ = 公比。', en: 'Geometric sequence: $a_n = a \\times r^{n-1}$. $a$ = first term, $r$ = common ratio.' },
  }],

  // === Area ===
  1061: [{
    prompt: { zh: '诸葛亮丈量田亩：一块长方形田地长 12 步、宽 8 步。面积怎么算？', en: 'Zhuge Liang measures farmland: a rectangular field 12 paces long, 8 paces wide. Area?' },
    type: 'choice',
    choices: [
      { zh: '$12 \\times 8 = 96$ 平方步', en: '$12 \\times 8 = 96$ square paces' },
      { zh: '$(12 + 8) \\times 2 = 40$ 步', en: '$(12 + 8) \\times 2 = 40$ paces' },
    ],
    onCorrect: { zh: '面积 = 长 $\\times$ 宽。$(12+8)\\times 2$ 是周长，不是面积！\n面积衡量覆盖了多少地面，单位是"平方"。\n周长衡量绕一圈有多长，单位是"长度"。', en: 'Area = length $\\times$ width. $(12+8)\\times 2$ is perimeter, not area!\nArea measures how much ground is covered (square units).\nPerimeter measures distance around (linear units).' },
    onWrong: { zh: '那是周长（绕一圈的长度），不是面积（覆盖的地面）。\n面积 = 长 × 宽 = $12 \\times 8 = 96$ 平方步。', en: 'That\'s perimeter (distance around), not area (ground covered).\nArea = length × width = $12 \\times 8 = 96$ square paces.' },
    onSkip: { zh: '长方形面积 = 长 × 宽。别和周长 = 2(长+宽) 搞混。', en: 'Rectangle area = length × width. Don\'t confuse with perimeter = 2(length + width).' },
  }],
  1062: [{
    prompt: { zh: '堤坝截面是三角形，底边 10m，高 6m。截面积是多少？', en: 'Dam cross-section is a triangle, base 10m, height 6m. Cross-sectional area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{1}{2} \\times 10 \\times 6 = 30$ m²', en: '$\\frac{1}{2} \\times 10 \\times 6 = 30$ m²' },
      { zh: '$10 \\times 6 = 60$ m²', en: '$10 \\times 6 = 60$ m²' },
    ],
    onCorrect: { zh: '三角形 = 长方形的一半！底 × 高 是长方形面积，再 ÷ 2。\n$A = \\frac{1}{2}bh = \\frac{1}{2} \\times 10 \\times 6 = 30$ m²\n注意：高必须是垂直于底边的距离。', en: 'Triangle = half a rectangle! Base × height is rectangle area, then ÷ 2.\n$A = \\frac{1}{2}bh = \\frac{1}{2} \\times 10 \\times 6 = 30$ m²\nNote: height must be perpendicular to the base.' },
    onWrong: { zh: '$60$ m² 是长方形面积。三角形只占长方形的一半。\n$A = \\frac{1}{2} \\times 底 \\times 高 = 30$ m²', en: '$60$ m² is rectangle area. A triangle takes up half.\n$A = \\frac{1}{2} \\times base \\times height = 30$ m²' },
    onSkip: { zh: '三角形面积 = $\\frac{1}{2}bh$。是同底同高长方形的一半。', en: 'Triangle area = $\\frac{1}{2}bh$. Half the rectangle with same base and height.' },
  }],
  1063: [{
    prompt: { zh: '城墙截面是梯形：上底 4m，下底 8m，高 5m。面积怎么算？', en: 'Wall cross-section is a trapezium: parallel sides 4m and 8m, height 5m. Area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{1}{2}(4+8) \\times 5 = 30$ m²', en: '$\\frac{1}{2}(4+8) \\times 5 = 30$ m²' },
      { zh: '$4 \\times 8 \\times 5$', en: '$4 \\times 8 \\times 5$' },
    ],
    onCorrect: { zh: '梯形面积 = $\\frac{1}{2}(a+b) \\times h$，其中 $a, b$ 是两条平行边。\n本质上是"两条平行边的平均长度 × 高"。\n$\\frac{4+8}{2} \\times 5 = 6 \\times 5 = 30$ m²', en: 'Trapezium area = $\\frac{1}{2}(a+b) \\times h$, where $a, b$ are parallel sides.\nEssentially "average of parallel sides × height".\n$\\frac{4+8}{2} \\times 5 = 6 \\times 5 = 30$ m²' },
    onWrong: { zh: '三个数相乘没有意义。梯形公式是"上下底之和的一半 × 高"。\n$A = \\frac{1}{2}(4+8) \\times 5 = 30$ m²', en: 'Multiplying three numbers doesn\'t apply. Trapezium formula: "half the sum of parallel sides × height".\n$A = \\frac{1}{2}(4+8) \\times 5 = 30$ m²' },
    onSkip: { zh: '梯形面积 = $\\frac{1}{2}(a+b)h$。上底加下底取平均再乘以高。', en: 'Trapezium area = $\\frac{1}{2}(a+b)h$. Average of parallel sides times height.' },
  }],
  1064: [{
    prompt: { zh: '瞭望塔底座是半径 $r=5$m 的圆。占地面积是多少？', en: 'Watchtower base is a circle with radius $r=5$m. Ground area?' },
    type: 'choice',
    choices: [
      { zh: '$\\pi r^2 = 25\\pi$ m²', en: '$\\pi r^2 = 25\\pi$ m²' },
      { zh: '$2\\pi r = 10\\pi$ m', en: '$2\\pi r = 10\\pi$ m' },
    ],
    onCorrect: { zh: '面积 = $\\pi r^2$，周长 = $2\\pi r$。别搞混！\n$\\pi \\times 5^2 = 25\\pi \\approx 78.5$ m²\n面积是二维量（平方），周长是一维量（长度）。', en: 'Area = $\\pi r^2$, circumference = $2\\pi r$. Don\'t mix them up!\n$\\pi \\times 5^2 = 25\\pi \\approx 78.5$ m²\nArea is 2D (squared), circumference is 1D (length).' },
    onWrong: { zh: '$2\\pi r$ 是周长——绕一圈的距离。面积用 $\\pi r^2$。\n$\\pi \\times 5^2 = 25\\pi$ m²', en: '$2\\pi r$ is circumference — distance around. Area uses $\\pi r^2$.\n$\\pi \\times 5^2 = 25\\pi$ m²' },
    onSkip: { zh: '圆面积 = $\\pi r^2$。圆周长 = $2\\pi r$ 或 $\\pi d$。', en: 'Circle area = $\\pi r^2$. Circumference = $2\\pi r$ or $\\pi d$.' },
  }],
  1065: [{
    prompt: { zh: '两块三角形田地形状相同、大小不同——"相似三角形"。已知一条边和对应边的比是 $2:5$。另一对对应边怎么算？', en: 'Two triangle fields, same shape, different size — "similar triangles". One pair of sides has ratio $2:5$. How to find another pair?' },
    type: 'choice',
    choices: [
      { zh: '所有对应边的比都相等：$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{2}{5}$', en: 'All corresponding side ratios are equal: $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{2}{5}$' },
      { zh: '另一对边差 3', en: 'The other pair differs by 3' },
    ],
    onCorrect: { zh: '相似 = 同形不同大 → 对应边成比例。\n比例 $2:5$ 意味着大三角形每条边是小的 $\\frac{5}{2}$ 倍。\n所有边乘同一个比例因子。面积比 = 边比的平方 = $4:25$。', en: 'Similar = same shape, different size → corresponding sides proportional.\nRatio $2:5$ means the larger is $\\frac{5}{2}$ times the smaller for every side.\nAll sides scale by the same factor. Area ratio = side ratio squared = $4:25$.' },
    onWrong: { zh: '相似三角形是比例关系，不是差值关系。\n$2:5$ 意味着每条边都乘以 $\\frac{5}{2}$，不是加 3。', en: 'Similar triangles use ratios, not differences.\n$2:5$ means every side multiplied by $\\frac{5}{2}$, not +3.' },
    onSkip: { zh: '相似三角形：对应边成比例。边比 $k$ → 面积比 $k^2$ → 体积比 $k^3$。', en: 'Similar triangles: corresponding sides proportional. Side ratio $k$ → area ratio $k^2$ → volume ratio $k^3$.' },
  }],

  // === 3D Coordinates ===
  1066: [{
    prompt: { zh: '两位将领从城楼两端出发会师。A$(2,4,6)$，B$(8,10,12)$。中点坐标怎么求？', en: 'Two generals march from opposite ends. A$(2,4,6)$, B$(8,10,12)$. How to find the midpoint?' },
    type: 'choice',
    choices: [
      { zh: '每个坐标取平均：$(\\frac{2+8}{2}, \\frac{4+10}{2}, \\frac{6+12}{2})$', en: 'Average each coordinate: $(\\frac{2+8}{2}, \\frac{4+10}{2}, \\frac{6+12}{2})$' },
      { zh: '坐标相减', en: 'Subtract the coordinates' },
    ],
    onCorrect: { zh: '中点 = 两端点坐标的平均值。3D 也一样！\n$M = (\\frac{2+8}{2}, \\frac{4+10}{2}, \\frac{6+12}{2}) = (5, 7, 9)$\n$x, y, z$ 每个维度分别取平均。', en: 'Midpoint = average of endpoint coordinates. Same in 3D!\n$M = (\\frac{2+8}{2}, \\frac{4+10}{2}, \\frac{6+12}{2}) = (5, 7, 9)$\nAverage each dimension separately.' },
    onWrong: { zh: '坐标相减得到的是向量（位移），不是中点。\n中点 = $\\frac{A+B}{2}$，每个坐标取平均。', en: 'Subtracting coordinates gives a vector (displacement), not a midpoint.\nMidpoint = $\\frac{A+B}{2}$, average each coordinate.' },
    onSkip: { zh: '中点公式（2D/3D通用）：$M = (\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}, \\frac{z_1+z_2}{2})$。', en: 'Midpoint formula (works in 2D/3D): $M = (\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}, \\frac{z_1+z_2}{2})$.' },
  }],
  1067: [{
    prompt: { zh: '烽火定位：两座烽火台 $P(1,3,5)$、$Q(7,9,11)$。中点是信号中继站。坐标？', en: 'Beacon positioning: two towers $P(1,3,5)$, $Q(7,9,11)$. Midpoint is the relay station. Coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(4, 6, 8)$——每个坐标分别求平均', en: '$(4, 6, 8)$ — average each coordinate separately' },
      { zh: '$(6, 6, 6)$——坐标相减', en: '$(6, 6, 6)$ — subtract coordinates' },
    ],
    onCorrect: { zh: '$M = (\\frac{1+7}{2}, \\frac{3+9}{2}, \\frac{5+11}{2}) = (4, 6, 8)$ ✓\n中点公式在任意维度都成立：每个分量取平均。', en: '$M = (\\frac{1+7}{2}, \\frac{3+9}{2}, \\frac{5+11}{2}) = (4, 6, 8)$ ✓\nMidpoint formula works in any dimension: average each component.' },
    onWrong: { zh: '相减得到位移向量 $(6,6,6)$，不是中点。\n中点 = $(\\frac{1+7}{2}, \\frac{3+9}{2}, \\frac{5+11}{2}) = (4, 6, 8)$', en: 'Subtracting gives displacement vector $(6,6,6)$, not midpoint.\nMidpoint = $(\\frac{1+7}{2}, \\frac{3+9}{2}, \\frac{5+11}{2}) = (4, 6, 8)$' },
    onSkip: { zh: '中点 = 两点坐标逐个求平均。$M = \\frac{P+Q}{2}$。', en: 'Midpoint = average coordinates component-wise. $M = \\frac{P+Q}{2}$.' },
  }],

  // === Volume ===
  1072: [{
    prompt: { zh: '水井是圆柱形，半径 $r=2$m，深 $h=10$m。水井的体积（容水量）是多少？', en: 'A well is cylindrical, radius $r=2$m, depth $h=10$m. Volume (water capacity)?' },
    type: 'choice',
    choices: [
      { zh: '$\\pi r^2 h = \\pi \\times 4 \\times 10 = 40\\pi$ m³', en: '$\\pi r^2 h = \\pi \\times 4 \\times 10 = 40\\pi$ m³' },
      { zh: '$2\\pi r h = 40\\pi$ m²', en: '$2\\pi r h = 40\\pi$ m²' },
    ],
    onCorrect: { zh: '圆柱体积 = 底面积 × 高 = $\\pi r^2 h$。\n$2\\pi rh$ 是侧面积（展开成长方形），不是体积！\n体积单位是 m³，面积单位是 m²。', en: 'Cylinder volume = base area × height = $\\pi r^2 h$.\n$2\\pi rh$ is lateral surface area (unwrap into rectangle), not volume!\nVolume is m³, area is m².' },
    onWrong: { zh: '$2\\pi rh$ 是侧面积。体积 = 底面积 × 高 = $\\pi r^2 h$。\n$\\pi \\times 2^2 \\times 10 = 40\\pi$ m³', en: '$2\\pi rh$ is lateral surface area. Volume = base area × height = $\\pi r^2 h$.\n$\\pi \\times 2^2 \\times 10 = 40\\pi$ m³' },
    onSkip: { zh: '圆柱体积 = $\\pi r^2 h$。底面积 ($\\pi r^2$) × 高 ($h$)。', en: 'Cylinder volume = $\\pi r^2 h$. Base area ($\\pi r^2$) × height ($h$).' },
  }],
  1073: [{
    prompt: { zh: '烽火台是圆锥形。它的体积和同底同高的圆柱相比是多少？', en: 'A beacon tower is cone-shaped. How does its volume compare to a cylinder with the same base and height?' },
    type: 'choice',
    choices: [
      { zh: '圆锥 = 圆柱的 $\\frac{1}{3}$，即 $V = \\frac{1}{3}\\pi r^2 h$', en: 'Cone = $\\frac{1}{3}$ of cylinder, i.e. $V = \\frac{1}{3}\\pi r^2 h$' },
      { zh: '圆锥 = 圆柱的 $\\frac{1}{2}$', en: 'Cone = $\\frac{1}{2}$ of cylinder' },
    ],
    onCorrect: { zh: '记住"三分之一"法则：锥体 = 对应柱体的 $\\frac{1}{3}$。\n圆锥：$\\frac{1}{3}\\pi r^2 h$\n三棱锥：$\\frac{1}{3} \\times$ 底面积 $\\times h$\n这在所有锥体中通用！', en: 'Remember the "one-third" rule: cone = $\\frac{1}{3}$ of corresponding prism.\nCone: $\\frac{1}{3}\\pi r^2 h$\nPyramid: $\\frac{1}{3} \\times$ base area $\\times h$\nThis applies to ALL pointed solids!' },
    onWrong: { zh: '不是一半！圆锥是圆柱的 $\\frac{1}{3}$。\n$V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h$', en: 'Not half! A cone is $\\frac{1}{3}$ of a cylinder.\n$V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h$' },
    onSkip: { zh: '锥体体积 = $\\frac{1}{3}$ × 底面积 × 高。圆锥 = $\\frac{1}{3}\\pi r^2 h$。', en: 'Cone volume = $\\frac{1}{3}$ × base area × height. Cone = $\\frac{1}{3}\\pi r^2 h$.' },
  }],

  // === Functions/Percentage ===
  1081: [{
    prompt: { zh: '连弩射程公式 $f(x) = 3x^2 - 2x + 5$。当 $x=4$ 时射程是多少？', en: 'Crossbow range formula $f(x) = 3x^2 - 2x + 5$. What is the range when $x=4$?' },
    type: 'choice',
    choices: [
      { zh: '代入 $x=4$：$3(16) - 2(4) + 5 = 45$', en: 'Substitute $x=4$: $3(16) - 2(4) + 5 = 45$' },
      { zh: '把 4 加到 $f(x)$ 上', en: 'Add 4 to $f(x)$' },
    ],
    onCorrect: { zh: '代入 = 替换所有 $x$ 为给定值，然后按运算顺序计算。\n$f(4) = 3(4)^2 - 2(4) + 5 = 48 - 8 + 5 = 45$\n先算幂次 → 乘法 → 加减。', en: 'Substitution = replace every $x$ with the value, then follow order of operations.\n$f(4) = 3(4)^2 - 2(4) + 5 = 48 - 8 + 5 = 45$\nPowers first → multiply → add/subtract.' },
    onWrong: { zh: '代入不是"加上去"。$f(4)$ 意味着把每个 $x$ 替换成 4。\n$f(4) = 3 \\times 16 - 2 \\times 4 + 5 = 45$', en: 'Substitution is not "adding". $f(4)$ means replace every $x$ with 4.\n$f(4) = 3 \\times 16 - 2 \\times 4 + 5 = 45$' },
    onSkip: { zh: '代入求值：$x$ 替换为数值，按 BIDMAS 顺序计算。', en: 'Function evaluation: replace $x$ with the value, follow BIDMAS order.' },
  }],
  1082: [{
    prompt: { zh: '战损评估：开战前 800 人，战后剩 600 人。战损百分比是多少？', en: 'Battle damage: 800 troops before, 600 after. What is the percentage loss?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{800-600}{800} \\times 100\\% = 25\\%$', en: '$\\frac{800-600}{800} \\times 100\\% = 25\\%$' },
      { zh: '$\\frac{800-600}{600} \\times 100\\%$', en: '$\\frac{800-600}{600} \\times 100\\%$' },
    ],
    onCorrect: { zh: '百分比变化 = $\\frac{\\text{变化量}}{\\text{原始值}} \\times 100\\%$\n分母是原始值（战前），不是新值！\n$\\frac{200}{800} \\times 100\\% = 25\\%$ 损失。', en: 'Percentage change = $\\frac{\\text{change}}{\\text{original}} \\times 100\\%$\nDenominator is original value (before), not new value!\n$\\frac{200}{800} \\times 100\\% = 25\\%$ loss.' },
    onWrong: { zh: '分母应该是原始值 800，不是战后的 600！\n百分比变化永远以"变化前"为基准。$\\frac{200}{800} = 25\\%$', en: 'Denominator should be original 800, not the after-value 600!\nPercentage change always uses the "before" as base. $\\frac{200}{800} = 25\\%$' },
    onSkip: { zh: '百分比变化 = $\\frac{\\text{变化量}}{\\text{原始值}} \\times 100\\%$。分母是原值。', en: 'Percentage change = $\\frac{change}{original} \\times 100\\%$. Denominator is original.' },
  }],
  1083: [{
    prompt: { zh: '粮仓存粮 1000 石，每年增长 5%。3 年后有多少？为什么不能用 $1000 + 3 \\times 50$？', en: 'Granary: 1000 units, growing 5% yearly. After 3 years? Why not $1000 + 3 \\times 50$?' },
    type: 'choice',
    choices: [
      { zh: '因为每年的 5% 是基于上一年的新总量——$1000 \\times 1.05^3$', en: 'Because each year\'s 5% is based on the new total — $1000 \\times 1.05^3$' },
      { zh: '$1000 + 150 = 1150$', en: '$1000 + 150 = 1150$' },
    ],
    onCorrect: { zh: '这就是复利的威力！每年增长基于去年的总量，不是最初的本金。\n$1000 \\times 1.05^3 = 1000 \\times 1.157625 = 1157.63$\n比单利的 1150 多了 7.63！时间越长差距越大。', en: 'This is the power of compound interest! Each year\'s growth is based on last year\'s total.\n$1000 \\times 1.05^3 = 1000 \\times 1.157625 = 1157.63$\nMore than simple interest\'s 1150 by 7.63! The gap widens over time.' },
    onWrong: { zh: '$1150$ 是单利计算（每年固定加 50）。但复利中第二年的 5% 是基于 1050，不是 1000！\n复利公式：$A = P \\times (1+r)^n$', en: '$1150$ is simple interest (flat 50 per year). But in compound interest, year 2\'s 5% is based on 1050, not 1000!\nCompound: $A = P \\times (1+r)^n$' },
    onSkip: { zh: '复利：$A = P(1+r)^n$。每期增长基于新总额，不是原始本金。', en: 'Compound interest: $A = P(1+r)^n$. Each period\'s growth is on the new total, not the original.' },
  }],

  // === Transformations ===
  1091: [{
    prompt: { zh: '沿河反射：点 $(3, 2)$ 关于 $y$ 轴反射后坐标是什么？', en: 'River reflection: point $(3, 2)$ reflected in the y-axis. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(-3, 2)$——$x$ 变号，$y$ 不变', en: '$(-3, 2)$ — $x$ changes sign, $y$ stays' },
      { zh: '$(3, -2)$', en: '$(3, -2)$' },
    ],
    onCorrect: { zh: '反射规则：\n关于 $y$ 轴：$(x,y) \\to (-x, y)$\n关于 $x$ 轴：$(x,y) \\to (x, -y)$\n关于 $y=x$：$(x,y) \\to (y, x)$\n哪条轴不动就不变号。', en: 'Reflection rules:\nIn y-axis: $(x,y) \\to (-x, y)$\nIn x-axis: $(x,y) \\to (x, -y)$\nIn $y=x$: $(x,y) \\to (y, x)$\nThe axis you reflect in stays unchanged.' },
    onWrong: { zh: '$(3, -2)$ 是关于 $x$ 轴的反射。关于 $y$ 轴反射 → $x$ 变号。\n$(3, 2) \\to (-3, 2)$', en: '$(3, -2)$ is reflection in the x-axis. Reflection in y-axis → $x$ changes sign.\n$(3, 2) \\to (-3, 2)$' },
    onSkip: { zh: '$y$ 轴反射：$x$ 变号。$x$ 轴反射：$y$ 变号。', en: 'y-axis reflection: negate $x$. x-axis reflection: negate $y$.' },
  }],
  1092: [{
    prompt: { zh: '阵型平移：三角形一个顶点在 $(2, 3)$，沿向量 $\\binom{4}{-1}$ 平移。新坐标？', en: 'Formation translation: a triangle vertex at $(2, 3)$, translated by vector $\\binom{4}{-1}$. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(2+4, 3+(-1)) = (6, 2)$', en: '$(2+4, 3+(-1)) = (6, 2)$' },
      { zh: '$(2 \\times 4, 3 \\times (-1)) = (8, -3)$', en: '$(2 \\times 4, 3 \\times (-1)) = (8, -3)$' },
    ],
    onCorrect: { zh: '平移 = 坐标加上向量。\n$(x, y) + \\binom{a}{b} = (x+a, y+b)$\n$(2+4, 3-1) = (6, 2)$\n平移不改变形状和大小，只改变位置。', en: 'Translation = add the vector to coordinates.\n$(x, y) + \\binom{a}{b} = (x+a, y+b)$\n$(2+4, 3-1) = (6, 2)$\nTranslation changes position only — shape and size stay the same.' },
    onWrong: { zh: '平移是加法，不是乘法！向量告诉你移动多少，不是缩放多少。\n$(2, 3) + \\binom{4}{-1} = (6, 2)$', en: 'Translation is addition, not multiplication! The vector tells you how far to move, not how to scale.\n$(2, 3) + \\binom{4}{-1} = (6, 2)$' },
    onSkip: { zh: '平移：$(x,y) \\to (x+a, y+b)$。向量分量加到坐标上。', en: 'Translation: $(x,y) \\to (x+a, y+b)$. Add vector components to coordinates.' },
  }],
  1093: [{
    prompt: { zh: '旋转阵型：点 $(1, 0)$ 绕原点逆时针旋转 $90°$。新坐标？', en: 'Rotation formation: point $(1, 0)$ rotated $90°$ anticlockwise about the origin. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(0, 1)$——$90°$ 逆时针：$(x,y) \\to (-y, x)$', en: '$(0, 1)$ — $90°$ anticlockwise: $(x,y) \\to (-y, x)$' },
      { zh: '$(0, -1)$', en: '$(0, -1)$' },
    ],
    onCorrect: { zh: '旋转规则（绕原点）：\n$90°$ 逆时针：$(x,y) \\to (-y, x)$\n$90°$ 顺时针：$(x,y) \\to (y, -x)$\n$180°$：$(x,y) \\to (-x, -y)$\n$(1,0) \\to (0, 1)$ ✓', en: 'Rotation rules (about origin):\n$90°$ anticlockwise: $(x,y) \\to (-y, x)$\n$90°$ clockwise: $(x,y) \\to (y, -x)$\n$180°$: $(x,y) \\to (-x, -y)$\n$(1,0) \\to (0, 1)$ ✓' },
    onWrong: { zh: '$(0, -1)$ 是顺时针 $90°$。逆时针 $90°$：$(x,y) \\to (-y, x)$。\n$(1, 0) \\to (-(0), 1) = (0, 1)$', en: '$(0, -1)$ is clockwise $90°$. Anticlockwise $90°$: $(x,y) \\to (-y, x)$.\n$(1, 0) \\to (-(0), 1) = (0, 1)$' },
    onSkip: { zh: '逆时针 $90°$：$(x,y)\\to(-y,x)$。顺时针 $90°$：$(x,y)\\to(y,-x)$。$180°$：$(-x,-y)$。', en: 'Anticlockwise $90°$: $(x,y)\\to(-y,x)$. Clockwise $90°$: $(x,y)\\to(y,-x)$. $180°$: $(-x,-y)$.' },
  }],
  1094: [{
    prompt: { zh: '阵型放大：三角形顶点 $(2, 3)$，以原点为中心、比例因子 3 放大。新坐标？', en: 'Formation enlargement: vertex $(2, 3)$, centre of enlargement at origin, scale factor 3. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(6, 9)$——每个坐标乘以比例因子', en: '$(6, 9)$ — multiply each coordinate by the scale factor' },
      { zh: '$(5, 6)$——每个坐标加 3', en: '$(5, 6)$ — add 3 to each coordinate' },
    ],
    onCorrect: { zh: '以原点为中心放大：每个坐标 × 比例因子。\n$(2, 3) \\times 3 = (6, 9)$\n放大改变大小但保持形状。比例因子 >1 放大，0-1 之间缩小。', en: 'Enlargement from origin: multiply each coordinate by scale factor.\n$(2, 3) \\times 3 = (6, 9)$\nEnlargement changes size but preserves shape. Factor >1 enlarges, 0-1 shrinks.' },
    onWrong: { zh: '放大是乘法，不是加法！放大因子是缩放的倍数。\n$(2, 3) \\times 3 = (6, 9)$，不是 $(2+3, 3+3)$。', en: 'Enlargement is multiplication, not addition! Scale factor multiplies.\n$(2, 3) \\times 3 = (6, 9)$, not $(2+3, 3+3)$.' },
    onSkip: { zh: '以原点为中心放大：$(x,y) \\to (kx, ky)$。$k$ = 比例因子。', en: 'Enlargement from origin: $(x,y) \\to (kx, ky)$. $k$ = scale factor.' },
  }],

  // === Sector/Arc ===
  1102: [{
    prompt: { zh: '烽火覆盖区域是扇形。半径 $r=10$m，圆心角 $\\theta=72°$。面积？', en: 'Beacon coverage is a sector. Radius $r=10$m, angle $\\theta=72°$. Area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{72}{360} \\times \\pi \\times 10^2 = 20\\pi$ m²', en: '$\\frac{72}{360} \\times \\pi \\times 10^2 = 20\\pi$ m²' },
      { zh: '$\\pi \\times 10^2 = 100\\pi$ m²', en: '$\\pi \\times 10^2 = 100\\pi$ m²' },
    ],
    onCorrect: { zh: '扇形 = 圆的一部分。占了多大一部分？$\\frac{\\theta}{360}$。\n扇形面积 = $\\frac{\\theta}{360} \\times \\pi r^2 = \\frac{72}{360} \\times 100\\pi = \\frac{1}{5} \\times 100\\pi = 20\\pi$ m²\n$72° = \\frac{1}{5}$ 个完整圆。', en: 'Sector = fraction of a circle. What fraction? $\\frac{\\theta}{360}$.\nSector area = $\\frac{\\theta}{360} \\times \\pi r^2 = \\frac{72}{360} \\times 100\\pi = \\frac{1}{5} \\times 100\\pi = 20\\pi$ m²\n$72° = \\frac{1}{5}$ of a full circle.' },
    onWrong: { zh: '$100\\pi$ 是整个圆的面积！扇形只占圆的 $\\frac{72}{360} = \\frac{1}{5}$。\n$\\frac{1}{5} \\times 100\\pi = 20\\pi$ m²', en: '$100\\pi$ is the full circle! The sector is only $\\frac{72}{360} = \\frac{1}{5}$ of it.\n$\\frac{1}{5} \\times 100\\pi = 20\\pi$ m²' },
    onSkip: { zh: '扇形面积 = $\\frac{\\theta}{360} \\times \\pi r^2$。角度占 360° 的比例 × 整圆面积。', en: 'Sector area = $\\frac{\\theta}{360} \\times \\pi r^2$. Angle fraction × full circle area.' },
  }],
  1103: [{
    prompt: { zh: '两阵相隔：阵地 A$(1,2)$，阵地 B$(4,6)$。两阵距离怎么算？', en: 'Two formations apart: camp A$(1,2)$, camp B$(4,6)$. Distance between them?' },
    type: 'choice',
    choices: [
      { zh: '$d = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = 5$', en: '$d = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = 5$' },
      { zh: '$d = (4-1) + (6-2) = 7$', en: '$d = (4-1) + (6-2) = 7$' },
    ],
    onCorrect: { zh: '距离公式 = 勾股定理的应用！\n$d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$\n水平差 $3$，垂直差 $4$ → $\\sqrt{9+16} = \\sqrt{25} = 5$\n这就是 3-4-5 直角三角形！', en: 'Distance formula = Pythagoras applied to coordinates!\n$d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$\nHorizontal difference 3, vertical 4 → $\\sqrt{9+16} = \\sqrt{25} = 5$\nA classic 3-4-5 right triangle!' },
    onWrong: { zh: '直接相加是"曼哈顿距离"（沿网格走），不是直线距离。\n直线距离用勾股定理：$\\sqrt{3^2+4^2} = 5$。', en: 'Adding is "Manhattan distance" (along grid), not straight-line distance.\nStraight-line uses Pythagoras: $\\sqrt{3^2+4^2} = 5$.' },
    onSkip: { zh: '两点间距离 = $\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$。本质是勾股定理。', en: 'Distance = $\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$. Essentially Pythagoras.' },
  }],
  10121: [{
    prompt: { zh: '水寨扇面：半径 $r=8$m，角度 $45°$。扇形面积怎么算？', en: 'Water camp sector: radius $r=8$m, angle $45°$. Sector area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{45}{360} \\times \\pi \\times 8^2 = 8\\pi$ m²', en: '$\\frac{45}{360} \\times \\pi \\times 8^2 = 8\\pi$ m²' },
      { zh: '$\\frac{1}{2} \\times 8 \\times 8 = 32$ m²', en: '$\\frac{1}{2} \\times 8 \\times 8 = 32$ m²' },
    ],
    onCorrect: { zh: '$\\frac{45}{360} = \\frac{1}{8}$，扇形占圆的八分之一。\n$\\frac{1}{8} \\times \\pi \\times 64 = 8\\pi \\approx 25.1$ m²\n先化简分数再算，更不容易出错。', en: '$\\frac{45}{360} = \\frac{1}{8}$, the sector is one-eighth of the circle.\n$\\frac{1}{8} \\times \\pi \\times 64 = 8\\pi \\approx 25.1$ m²\nSimplify the fraction first for easier calculation.' },
    onWrong: { zh: '那是三角形面积公式。扇形是圆的一部分，要用 $\\frac{\\theta}{360} \\times \\pi r^2$。\n$\\frac{45}{360} \\times 64\\pi = 8\\pi$ m²', en: 'That\'s the triangle area formula. A sector is part of a circle: $\\frac{\\theta}{360} \\times \\pi r^2$.\n$\\frac{45}{360} \\times 64\\pi = 8\\pi$ m²' },
    onSkip: { zh: '扇形面积 = $\\frac{\\theta}{360} \\pi r^2$。先把 $\\frac{\\theta}{360}$ 化简。', en: 'Sector area = $\\frac{\\theta}{360} \\pi r^2$. Simplify $\\frac{\\theta}{360}$ first.' },
  }],
  10122: [{
    prompt: { zh: '弧长测量：半径 $r=6$m，圆心角 $120°$。弧长是多少？', en: 'Arc length measurement: radius $r=6$m, angle $120°$. Arc length?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{120}{360} \\times 2\\pi \\times 6 = 4\\pi$ m', en: '$\\frac{120}{360} \\times 2\\pi \\times 6 = 4\\pi$ m' },
      { zh: '$\\frac{120}{360} \\times \\pi \\times 6^2$', en: '$\\frac{120}{360} \\times \\pi \\times 6^2$' },
    ],
    onCorrect: { zh: '弧长 = 圆周长的一部分 = $\\frac{\\theta}{360} \\times 2\\pi r$。\n$\\frac{120}{360} = \\frac{1}{3}$，弧长 = $\\frac{1}{3} \\times 12\\pi = 4\\pi$ m。\n弧长是长度（一维），面积是二维！', en: 'Arc length = fraction of circumference = $\\frac{\\theta}{360} \\times 2\\pi r$.\n$\\frac{120}{360} = \\frac{1}{3}$, arc = $\\frac{1}{3} \\times 12\\pi = 4\\pi$ m.\nArc is length (1D), area is 2D!' },
    onWrong: { zh: '那是扇形面积公式！弧长用周长：$\\frac{\\theta}{360} \\times 2\\pi r$。\n面积 = $\\frac{\\theta}{360} \\pi r^2$，弧长 = $\\frac{\\theta}{360} \\times 2\\pi r$。', en: 'That\'s the sector area formula! Arc length uses circumference: $\\frac{\\theta}{360} \\times 2\\pi r$.\nArea = $\\frac{\\theta}{360} \\pi r^2$, Arc = $\\frac{\\theta}{360} \\times 2\\pi r$.' },
    onSkip: { zh: '弧长 = $\\frac{\\theta}{360} \\times 2\\pi r$。面积用 $\\pi r^2$，弧长用 $2\\pi r$。', en: 'Arc length = $\\frac{\\theta}{360} \\times 2\\pi r$. Area uses $\\pi r^2$, arc uses $2\\pi r$.' },
  }],

  // === Algebra ===
  10111: [{
    prompt: { zh: '火攻展开：$3(2x + 5)$ 怎么展开？', en: 'Fire attack expansion: how to expand $3(2x + 5)$?' },
    type: 'choice',
    choices: [
      { zh: '$6x + 15$——3 分别乘以括号里每一项', en: '$6x + 15$ — multiply 3 by each term inside' },
      { zh: '$6x + 5$', en: '$6x + 5$' },
    ],
    onCorrect: { zh: '展开 = 分配律：外面的数乘以括号里的每一项。\n$3 \\times 2x = 6x$，$3 \\times 5 = 15$\n$3(2x+5) = 6x + 15$\n每一项都要乘，不能只乘第一项！', en: 'Expanding = distributive law: multiply the outside by EACH term inside.\n$3 \\times 2x = 6x$, $3 \\times 5 = 15$\n$3(2x+5) = 6x + 15$\nEvery term gets multiplied!' },
    onWrong: { zh: '5 也要乘以 3！展开括号时，外面的数乘以里面的每一项。\n$3(2x+5) = 3 \\times 2x + 3 \\times 5 = 6x + 15$', en: '5 must also be multiplied by 3! When expanding, the outside multiplies every term inside.\n$3(2x+5) = 3 \\times 2x + 3 \\times 5 = 6x + 15$' },
    onSkip: { zh: '展开括号：$a(b+c) = ab + ac$。每一项都要乘。', en: 'Expand brackets: $a(b+c) = ab + ac$. Multiply every term.' },
  }],
  10112: [{
    prompt: { zh: '战后整编：$x^2 + 5x + 6$ 能分解成什么形式？', en: 'Post-battle reorganisation: how to factorise $x^2 + 5x + 6$?' },
    type: 'choice',
    choices: [
      { zh: '$(x+2)(x+3)$——找两个数：乘积=6，和=5', en: '$(x+2)(x+3)$ — find two numbers: product = 6, sum = 5' },
      { zh: '$x(x+5) + 6$', en: '$x(x+5) + 6$' },
    ],
    onCorrect: { zh: '因式分解 $x^2+bx+c$：找两个数 $p, q$ 使得 $p+q=b$，$pq=c$。\n$2+3=5$ ✓，$2 \\times 3=6$ ✓\n$(x+2)(x+3)$。验证：展开回去 = $x^2+5x+6$ ✓', en: 'To factorise $x^2+bx+c$: find $p, q$ where $p+q=b$ and $pq=c$.\n$2+3=5$ ✓, $2 \\times 3=6$ ✓\n$(x+2)(x+3)$. Check: expand back = $x^2+5x+6$ ✓' },
    onWrong: { zh: '$x(x+5)+6$ 不是完全分解——还有 $+6$ 在外面。\n要找 $(x+p)(x+q)$ 形式：$p \\times q = 6$，$p + q = 5$。', en: '$x(x+5)+6$ isn\'t fully factored — there\'s still $+6$ outside.\nFind $(x+p)(x+q)$ form: $p \\times q = 6$, $p + q = 5$.' },
    onSkip: { zh: '因式分解 $x^2+bx+c$：找两个数，和 = $b$，积 = $c$。然后写成 $(x+p)(x+q)$。', en: 'Factorise $x^2+bx+c$: find two numbers, sum = $b$, product = $c$. Write as $(x+p)(x+q)$.' },
  }],
  10113: [{
    prompt: { zh: '粮草底线：军需要求 $3x + 7 > 22$。$x$ 最少是多少？', en: 'Supply minimum: requirement $3x + 7 > 22$. What is the minimum $x$?' },
    type: 'choice',
    choices: [
      { zh: '$x > 5$——和解方程一样，两边减 7 再除以 3', en: '$x > 5$ — same as solving equations: subtract 7, divide by 3' },
      { zh: '$x > 29$', en: '$x > 29$' },
    ],
    onCorrect: { zh: '解不等式和解方程一样——但注意：乘除负数时符号要反转！\n$3x + 7 > 22$\n$3x > 15$\n$x > 5$\n本题除以正数 3，符号不变。', en: 'Solving inequalities is like equations — but beware: multiply/divide by negative → flip the sign!\n$3x + 7 > 22$\n$3x > 15$\n$x > 5$\nHere we divide by positive 3, so sign stays.' },
    onWrong: { zh: '要两边减 7，不是加 7！$3x > 22 - 7 = 15$，$x > 5$。\n不等式的操作和方程一样：减再除。', en: 'Subtract 7 from both sides, not add! $3x > 22 - 7 = 15$, $x > 5$.\nInequality operations are the same as equations: subtract then divide.' },
    onSkip: { zh: '解不等式：像方程一样移项。注意：乘除负数要翻转不等号。', en: 'Solve inequalities like equations. Key rule: multiply/divide by negative → flip the inequality sign.' },
  }],

  // === Statistics ===
  10131: [{
    prompt: { zh: '军力均值：五营兵力分别是 30, 40, 50, 60, 70。平均每营多少人？', en: 'Army mean: five camps have 30, 40, 50, 60, 70 troops. Average per camp?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{30+40+50+60+70}{5} = 50$', en: '$\\frac{30+40+50+60+70}{5} = 50$' },
      { zh: '中间那个数 50', en: 'The middle number, 50' },
    ],
    onCorrect: { zh: '平均数 = $\\frac{\\text{总和}}{\\text{个数}}$\n$\\frac{250}{5} = 50$\n中间那个数是中位数——这里碰巧和平均数相同，但通常不一样！', en: 'Mean = $\\frac{\\text{total}}{\\text{count}}$\n$\\frac{250}{5} = 50$\nThe middle number is the median — it happens to equal the mean here, but usually they differ!' },
    onWrong: { zh: '中间的数是中位数 (median)，不是平均数 (mean)！\n平均数必须先求总和再除以个数。这里碰巧相同是因为数据均匀分布。', en: 'The middle number is the median, not the mean!\nMean requires summing all values then dividing by count. They match here only because the data is evenly spaced.' },
    onSkip: { zh: '平均数 (mean) = 总和 ÷ 个数。中位数 (median) = 排序后中间值。别混淆。', en: 'Mean = sum ÷ count. Median = middle value when sorted. Don\'t confuse them.' },
  }],
  10132: [{
    prompt: { zh: '极差分析：各路兵力——最多 120 人，最少 30 人。极差（range）是多少？', en: 'Range analysis: troop sizes — max 120, min 30. What is the range?' },
    type: 'choice',
    choices: [
      { zh: '$120 - 30 = 90$', en: '$120 - 30 = 90$' },
      { zh: '$\\frac{120+30}{2} = 75$', en: '$\\frac{120+30}{2} = 75$' },
    ],
    onCorrect: { zh: '极差 = 最大值 - 最小值 = 数据的"跨度"。\n$120 - 30 = 90$\n极差衡量数据的离散程度——越大越分散。\n$\\frac{120+30}{2}$ 是两个端点的中间值，不是极差。', en: 'Range = maximum - minimum = the "spread" of data.\n$120 - 30 = 90$\nRange measures dispersion — larger range means more spread out.\n$\\frac{120+30}{2}$ is the midpoint, not range.' },
    onWrong: { zh: '那是中点值（midrange），不是极差！极差 = 最大 - 最小。\n$120 - 30 = 90$', en: 'That\'s the midrange, not the range! Range = max - min.\n$120 - 30 = 90$' },
    onSkip: { zh: '极差 = 最大值 - 最小值。衡量数据跨度。', en: 'Range = maximum - minimum. Measures data spread.' },
  }],
  10133: [{
    prompt: { zh: '众数决策：刀 5 把、枪 8 把、剑 8 把、弓 3 把。出现最多的武器是什么？', en: 'Mode decision: 5 swords, 8 spears, 8 blades, 3 bows. Most frequent weapon?' },
    type: 'choice',
    choices: [
      { zh: '枪和剑都是众数——各出现 8 次', en: 'Spears and blades are both modes — each appears 8 times' },
      { zh: '只有一个众数', en: 'There can only be one mode' },
    ],
    onCorrect: { zh: '众数 = 出现次数最多的数据。可以有多个众数！\n枪 8 次，剑 8 次 → 双众数 (bimodal)。\n如果所有数据出现次数相同 → 无众数。', en: 'Mode = most frequent value. There CAN be multiple modes!\nSpears 8, blades 8 → bimodal.\nIf all values appear equally → no mode.' },
    onWrong: { zh: '众数可以有多个！当两个或更多值出现次数相同且最多时，都是众数。\n这里枪和剑都出现了 8 次。', en: 'There can be multiple modes! When two or more values share the highest frequency, all are modes.\nHere spears and blades both appear 8 times.' },
    onSkip: { zh: '众数 = 出现最多的值。可有 0 个、1 个或多个众数。', en: 'Mode = most frequent value. Can have 0, 1, or multiple modes.' },
  }],

  // === Circle Theorems ===
  10141: [{
    prompt: { zh: '半圆直角：直径 AB 上有一点 C 在圆上。$\\angle ACB$ 等于多少？为什么？', en: 'Semicircle angle: point C is on a circle with diameter AB. What is $\\angle ACB$? Why?' },
    type: 'choice',
    choices: [
      { zh: '$90°$——直径对应的圆周角是直角', en: '$90°$ — angle in a semicircle is a right angle' },
      { zh: '$180°$', en: '$180°$' },
    ],
    onCorrect: { zh: '泰勒斯定理：直径所对的圆周角永远是 $90°$。\n为什么？圆心角 = $180°$（直径是半圆），圆周角 = $\\frac{1}{2}$ 圆心角 = $90°$。\n看到直径 → 想到直角！', en: 'Thales\' theorem: angle subtended by a diameter is always $90°$.\nWhy? Central angle = $180°$ (diameter spans semicircle), inscribed angle = $\\frac{1}{2}$ central = $90°$.\nSee diameter → think right angle!' },
    onWrong: { zh: '$180°$ 是一条直线的角度，不是圆周角。直径对的圆周角 = $90°$。\n这是最基础的圆定理之一。', en: '$180°$ is a straight line angle, not an inscribed angle. Angle in semicircle = $90°$.\nThis is one of the most fundamental circle theorems.' },
    onSkip: { zh: '半圆定理：直径对应的圆周角 = $90°$。看到直径就找直角。', en: 'Semicircle theorem: angle subtended by diameter = $90°$. See diameter → find right angle.' },
  }],
  10142: [{
    prompt: { zh: '圆心角定理：圆心角和同弧上的圆周角有什么关系？', en: 'Central angle theorem: how are the central angle and the inscribed angle on the same arc related?' },
    type: 'choice',
    choices: [
      { zh: '圆心角 = 2 × 圆周角', en: 'Central angle = 2 × inscribed angle' },
      { zh: '它们相等', en: 'They are equal' },
    ],
    onCorrect: { zh: '这是所有圆定理的根基！同一条弧：\n圆心角 = $2 \\times$ 圆周角\n例如：圆周角 $35°$ → 圆心角 $70°$\n半圆定理就是它的特例（圆心角 $180°$ → 圆周角 $90°$）。', en: 'This is the foundation of all circle theorems! Same arc:\nCentral angle = $2 \\times$ inscribed angle\nExample: inscribed $35°$ → central $70°$\nSemicircle theorem is a special case (central $180°$ → inscribed $90°$).' },
    onWrong: { zh: '它们不相等！圆心角是圆周角的两倍。\n圆心在圆的正中心，"看"同一段弧的角度更大。', en: 'They\'re not equal! Central angle is twice the inscribed angle.\nThe centre is right in the middle, so it "sees" the same arc at a wider angle.' },
    onSkip: { zh: '圆心角 = 2 × 圆周角（同弧）。这是所有圆定理的基础。', en: 'Central angle = 2 × inscribed angle (same arc). Foundation of all circle theorems.' },
  }],
  10152: [{
    prompt: { zh: '同弓形角：同一条弧 AB 上的两个圆周角 $\\angle ACB$ 和 $\\angle ADB$。它们有什么关系？', en: 'Angles in same segment: two inscribed angles $\\angle ACB$ and $\\angle ADB$ on the same arc AB. Relationship?' },
    type: 'choice',
    choices: [
      { zh: '它们相等——同弧上的圆周角相等', en: 'They are equal — angles subtended by the same arc are equal' },
      { zh: '加起来等于 $180°$', en: 'They add up to $180°$' },
    ],
    onCorrect: { zh: '同弧上的圆周角相等！不管 C 和 D 在弧上什么位置。\n为什么？因为它们都是同一个圆心角的一半。\n$\\angle ACB = \\angle ADB = \\frac{1}{2} \\times$ 圆心角', en: 'Inscribed angles on the same arc are equal! Regardless of where C and D are on the arc.\nWhy? Both are half the same central angle.\n$\\angle ACB = \\angle ADB = \\frac{1}{2} \\times$ central angle' },
    onWrong: { zh: '加起来 $180°$ 是圆内接四边形对角的性质。\n同弧上的圆周角是相等的，不是互补的。', en: 'Adding to $180°$ is for opposite angles in a cyclic quadrilateral.\nAngles in the same segment are equal, not supplementary.' },
    onSkip: { zh: '同弧上的圆周角相等。它们都是同一圆心角的一半。', en: 'Angles in the same segment are equal. Both are half the same central angle.' },
  }],
  10153: [{
    prompt: { zh: '圆内接四边形 ABCD。$\\angle A = 110°$。对角 $\\angle C$ 等于多少？', en: 'Cyclic quadrilateral ABCD. $\\angle A = 110°$. What is the opposite angle $\\angle C$?' },
    type: 'choice',
    choices: [
      { zh: '$\\angle C = 70°$——对角互补，$110° + 70° = 180°$', en: '$\\angle C = 70°$ — opposite angles supplementary, $110° + 70° = 180°$' },
      { zh: '$\\angle C = 110°$——对角相等', en: '$\\angle C = 110°$ — opposite angles equal' },
    ],
    onCorrect: { zh: '圆内接四边形：对角之和 = $180°$（互补）。\n$\\angle A + \\angle C = 180°$，$\\angle B + \\angle D = 180°$\n不是相等！是互补。\n只有四个顶点都在圆上才成立。', en: 'Cyclic quadrilateral: opposite angles sum to $180°$ (supplementary).\n$\\angle A + \\angle C = 180°$, $\\angle B + \\angle D = 180°$\nNot equal — supplementary!\nOnly works when all four vertices lie on the circle.' },
    onWrong: { zh: '对角不是相等，是互补！$\\angle A + \\angle C = 180°$。\n$110° + \\angle C = 180°$，所以 $\\angle C = 70°$。', en: 'Opposite angles aren\'t equal — they\'re supplementary! $\\angle A + \\angle C = 180°$.\n$110° + \\angle C = 180°$, so $\\angle C = 70°$.' },
    onSkip: { zh: '圆内接四边形：对角互补（和 = $180°$）。记住：补不是等！', en: 'Cyclic quadrilateral: opposite angles are supplementary (sum = $180°$). Remember: supplementary, not equal!' },
  }],
  10154: [{
    prompt: { zh: '一条直线和圆只有一个交点——这是切线。切线和半径在切点处成什么角？', en: 'A line touches a circle at exactly one point — a tangent. What angle does the tangent make with the radius at the point of contact?' },
    type: 'choice',
    choices: [
      { zh: '$90°$——切线⊥半径', en: '$90°$ — tangent is perpendicular to radius' },
      { zh: '$60°$', en: '$60°$' },
    ],
    onCorrect: { zh: '切线与半径在切点处垂直 ($90°$)。\n这是因为半径是从圆心到切点的最短距离——最短距离一定是垂直的。\n看到切线 → 画半径 → 标直角！', en: 'Tangent meets radius at $90°$ at the point of tangency.\nThe radius to the tangent point is the shortest distance from centre to line — shortest distance is always perpendicular.\nSee tangent → draw radius → mark right angle!' },
    onWrong: { zh: '$60°$ 没有特殊几何意义。切线和半径永远垂直：$90°$。\n这是一个"永远成立"的定理，不依赖圆的大小。', en: '$60°$ has no special geometric significance here. Tangent and radius are always perpendicular: $90°$.\nThis theorem holds universally, regardless of circle size.' },
    onSkip: { zh: '切线⊥半径（在切点处成 $90°$）。看到切线就找直角。', en: 'Tangent ⊥ radius ($90°$ at point of tangency). See tangent → find right angle.' },
  }],

  // === Proportion ===
  10156: [{
    prompt: { zh: '正比平方：$y \\propto x^2$。当 $x=3$ 时 $y=18$。$x=5$ 时 $y=?$', en: 'Direct proportion squared: $y \\propto x^2$. When $x=3$, $y=18$. Find $y$ when $x=5$.' },
    type: 'choice',
    choices: [
      { zh: '先求 $k$：$18 = k \\times 9$，$k=2$。再算 $y = 2 \\times 25 = 50$', en: 'Find $k$ first: $18 = k \\times 9$, $k=2$. Then $y = 2 \\times 25 = 50$' },
      { zh: '$y = 18 \\times \\frac{5}{3} = 30$', en: '$y = 18 \\times \\frac{5}{3} = 30$' },
    ],
    onCorrect: { zh: '$y \\propto x^2$ 意味着 $y = kx^2$。\n第一步：用已知值求 $k$。$18 = k \\times 3^2 = 9k$，$k=2$。\n第二步：$y = 2 \\times 5^2 = 50$。\n注意：不是线性比例！$x$ 变 $\\frac{5}{3}$ 倍，$y$ 变 $(\\frac{5}{3})^2$ 倍。', en: '$y \\propto x^2$ means $y = kx^2$.\nStep 1: Find $k$ using known values. $18 = k \\times 3^2 = 9k$, $k=2$.\nStep 2: $y = 2 \\times 5^2 = 50$.\nNote: not linear! $x$ scales by $\\frac{5}{3}$, $y$ scales by $(\\frac{5}{3})^2$.' },
    onWrong: { zh: '$\\frac{5}{3}$ 只在线性比例 ($y \\propto x$) 时成立。这里是 $y \\propto x^2$！\n必须先求常数 $k$，再用 $y = kx^2$ 计算。', en: '$\\frac{5}{3}$ only works for linear proportion ($y \\propto x$). Here it\'s $y \\propto x^2$!\nMust find constant $k$ first, then use $y = kx^2$.' },
    onSkip: { zh: '$y \\propto x^n$ → $y = kx^n$。用已知点求 $k$，再代入新 $x$。', en: '$y \\propto x^n$ → $y = kx^n$. Use known point to find $k$, then substitute new $x$.' },
  }],
  10157: [{
    prompt: { zh: '联合变量：$z \\propto xy$。当 $x=2, y=3$ 时 $z=12$。$x=4, y=5$ 时 $z=?$', en: 'Joint variation: $z \\propto xy$. When $x=2, y=3$, $z=12$. Find $z$ when $x=4, y=5$.' },
    type: 'choice',
    choices: [
      { zh: '$z = kxy$，$k = \\frac{12}{6} = 2$，$z = 2 \\times 4 \\times 5 = 40$', en: '$z = kxy$, $k = \\frac{12}{6} = 2$, $z = 2 \\times 4 \\times 5 = 40$' },
      { zh: '$z = 12 \\times \\frac{4}{2} \\times \\frac{5}{3}$', en: '$z = 12 \\times \\frac{4}{2} \\times \\frac{5}{3}$' },
    ],
    onCorrect: { zh: '联合正比：$z = kxy$。\n$12 = k \\times 2 \\times 3 = 6k$，$k=2$。\n$z = 2 \\times 4 \\times 5 = 40$。\n第二种方法虽然也能得到正确答案，但先求 $k$ 更清晰可靠。', en: 'Joint variation: $z = kxy$.\n$12 = k \\times 2 \\times 3 = 6k$, $k=2$.\n$z = 2 \\times 4 \\times 5 = 40$.\nThe ratio method also works, but finding $k$ first is clearer and more reliable.' },
    onWrong: { zh: '这个比例方法其实也能算出正确答案！$12 \\times 2 \\times \\frac{5}{3} = 40$。\n但更标准的做法是：先写公式 $z=kxy$，求 $k$，再代入。', en: 'The ratio method actually gives the right answer too! $12 \\times 2 \\times \\frac{5}{3} = 40$.\nBut the standard approach is: write formula $z=kxy$, find $k$, then substitute.' },
    onSkip: { zh: '联合正比 $z \\propto xy$：$z = kxy$。用已知值求 $k$。', en: 'Joint variation $z \\propto xy$: $z = kxy$. Find $k$ from known values.' },
  }],

  // === Estimation/Remaining 20 ===
  10158: [{
    prompt: { zh: '变量图像：$y = \\frac{k}{x}$（$k>0$）的图像是什么形状？', en: 'Variable graph: what shape is $y = \\frac{k}{x}$ ($k>0$)?' },
    type: 'choice',
    choices: [
      { zh: '双曲线——两条分离的曲线在第一和第三象限', en: 'Hyperbola — two separate curves in quadrants I and III' },
      { zh: '一条直线', en: 'A straight line' },
    ],
    onCorrect: { zh: '反比关系 $y = \\frac{k}{x}$ 产生双曲线。\n$x$ 越大，$y$ 越小（但永远不到零）。\n$x=0$ 无定义——图像永远不穿过 $y$ 轴。\n$k>0$ 时在一、三象限；$k<0$ 时在二、四象限。', en: 'Inverse relationship $y = \\frac{k}{x}$ produces a hyperbola.\nAs $x$ increases, $y$ decreases (but never reaches zero).\n$x=0$ is undefined — graph never crosses the y-axis.\n$k>0$: quadrants I & III; $k<0$: quadrants II & IV.' },
    onWrong: { zh: '直线是 $y = mx + c$。$y = \\frac{k}{x}$ 是反比——曲线，不是直线。', en: 'Straight line is $y = mx + c$. $y = \\frac{k}{x}$ is inverse — a curve, not a line.' },
    onSkip: { zh: '$y = \\frac{k}{x}$：双曲线。两条曲线趋近但不碰到坐标轴（渐近线）。', en: '$y = \\frac{k}{x}$: hyperbola. Two curves approaching but never touching the axes (asymptotes).' },
  }],
  10160: [{
    prompt: { zh: '运算中的界：$a = 3.5$（精确到 0.1），$b = 2.5$（精确到 0.1）。$a + b$ 的上界是多少？', en: 'Bounds in operations: $a = 3.5$ (to 1 d.p.), $b = 2.5$ (to 1 d.p.). Upper bound of $a + b$?' },
    type: 'choice',
    choices: [
      { zh: '$3.55 + 2.55 = 6.1$——各取上界再相加', en: '$3.55 + 2.55 = 6.1$ — add the upper bounds' },
      { zh: '$3.5 + 2.5 = 6.0$', en: '$3.5 + 2.5 = 6.0$' },
    ],
    onCorrect: { zh: '精确到 0.1 意味着：$3.5$ 的范围是 $[3.45, 3.55)$。\n加法的上界 = 上界 + 上界。\n$a_{\\max} + b_{\\max} = 3.55 + 2.55 = 6.1$\n乘法也类似：最大 × 最大 = 上界。', en: 'Rounded to 1 d.p. means: $3.5$ ranges from $[3.45, 3.55)$.\nUpper bound of sum = upper + upper.\n$a_{max} + b_{max} = 3.55 + 2.55 = 6.1$\nMultiplication: max × max = upper bound.' },
    onWrong: { zh: '$6.0$ 是四舍五入后的值，不是上界。\n$3.5$ 可能最大是 $3.5499... \\approx 3.55$。两个上界相加。', en: '$6.0$ is the rounded value, not the upper bound.\n$3.5$ could be as large as $3.5499... \\approx 3.55$. Add both upper bounds.' },
    onSkip: { zh: '加法上界 = 上界 + 上界。精确到 0.1 → 上界 = 值 + 0.05。', en: 'Upper bound of sum = UB + UB. Rounded to 1 d.p. → UB = value + 0.05.' },
  }],
  10161: [{
    prompt: { zh: '$A = 10$（精确到整数），$B = 3$（精确到整数）。$\\frac{A}{B}$ 的最大值？', en: '$A = 10$ (to nearest integer), $B = 3$ (to nearest integer). Maximum value of $\\frac{A}{B}$?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{10.5}{2.5} = 4.2$——分子取上界，分母取下界', en: '$\\frac{10.5}{2.5} = 4.2$ — numerator upper bound, denominator lower bound' },
      { zh: '$\\frac{10.5}{3.5} = 3$', en: '$\\frac{10.5}{3.5} = 3$' },
    ],
    onCorrect: { zh: '除法的最大值：让分子尽量大（上界），分母尽量小（下界）。\n$A_{max} = 10.5$，$B_{min} = 2.5$\n$\\frac{A}{B}_{max} = \\frac{10.5}{2.5} = 4.2$\n除法中分母小 → 结果大！', en: 'To maximize a fraction: numerator as large (UB) and denominator as small (LB) as possible.\n$A_{max} = 10.5$, $B_{min} = 2.5$\n$\\frac{A}{B}_{max} = \\frac{10.5}{2.5} = 4.2$\nSmaller denominator → larger result!' },
    onWrong: { zh: '分母取上界会让分数变小！要最大化分数：分子最大 ÷ 分母最小。\n$\\frac{10.5}{2.5} = 4.2$', en: 'Upper bound on denominator makes the fraction smaller! To maximize: largest numerator ÷ smallest denominator.\n$\\frac{10.5}{2.5} = 4.2$' },
    onSkip: { zh: '最大化分数：$\\frac{UB}{LB}$。最小化分数：$\\frac{LB}{UB}$。', en: 'Maximize fraction: $\\frac{UB}{LB}$. Minimize: $\\frac{LB}{UB}$.' },
  }],
  10163: [{
    prompt: { zh: '列联表：60 名士兵中，会骑马的有 24 人，其中 8 人还会射箭。随机选一个会骑马的士兵，他也会射箭的概率？', en: 'Contingency table: of 60 soldiers, 24 ride horses, 8 of those also do archery. P(archery | horse rider)?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{8}{24} = \\frac{1}{3}$——在骑兵中找射手', en: '$\\frac{8}{24} = \\frac{1}{3}$ — find archers among riders' },
      { zh: '$\\frac{8}{60}$', en: '$\\frac{8}{60}$' },
    ],
    onCorrect: { zh: '条件概率！"已知他是骑兵"→ 总数缩小到 24，不是 60。\n$P(\\text{射箭}|\\text{骑马}) = \\frac{8}{24} = \\frac{1}{3}$\n条件概率的分母是"条件限定的子集"。', en: 'Conditional probability! "Given he rides" → total shrinks to 24, not 60.\n$P(archery|rider) = \\frac{8}{24} = \\frac{1}{3}$\nIn conditional probability, the denominator is the restricted subset.' },
    onWrong: { zh: '$\\frac{8}{60}$ 是从全军中随机选到会骑马又会射箭的概率。\n但题目说"已知是骑兵"→ 分母是 24 个骑兵。', en: '$\\frac{8}{60}$ is P(rider AND archer) from the whole army.\nBut "given he rides" → denominator is the 24 riders.' },
    onSkip: { zh: '条件概率：$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$。"已知B"时分母缩小到B。', en: 'Conditional probability: $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$. "Given B" → denominator shrinks to B.' },
  }],
  10165: [{
    prompt: { zh: '读直方图：某柱的组距是 5，柱高（频率密度）是 4。这组有多少个数据？', en: 'Reading a histogram: class width 5, bar height (frequency density) 4. How many data points in this class?' },
    type: 'choice',
    choices: [
      { zh: '频率 = 频率密度 × 组距 = $4 \\times 5 = 20$', en: 'Frequency = frequency density × class width = $4 \\times 5 = 20$' },
      { zh: '频率 = 柱高 = 4', en: 'Frequency = bar height = 4' },
    ],
    onCorrect: { zh: '直方图的关键：柱的面积 = 频率，不是柱高！\n频率 = 频率密度 × 组距 = $4 \\times 5 = 20$\n组距不等时，柱高只表示"密度"，面积才是真正的频率。', en: 'Key histogram fact: bar AREA = frequency, not height!\nFrequency = frequency density × class width = $4 \\times 5 = 20$\nWith unequal widths, height shows density; area shows actual frequency.' },
    onWrong: { zh: '直方图中柱高不等于频率！那是条形图。\n直方图：频率 = 柱高 × 组距 = 面积。$4 \\times 5 = 20$。', en: 'In histograms, bar height does NOT equal frequency! That\'s a bar chart.\nHistogram: frequency = height × width = area. $4 \\times 5 = 20$.' },
    onSkip: { zh: '直方图：频率 = 频率密度 × 组距 = 柱的面积。', en: 'Histogram: frequency = frequency density × class width = bar area.' },
  }],
  10172: [{
    prompt: { zh: '负数翻转：$-2x < -6$。解这个不等式。', en: 'Negative flip: $-2x < -6$. Solve this inequality.' },
    type: 'choice',
    choices: [
      { zh: '$x > 3$——除以负数要翻转不等号', en: '$x > 3$ — dividing by negative flips the inequality' },
      { zh: '$x < 3$', en: '$x < 3$' },
    ],
    onCorrect: { zh: '除以负数 → 不等号翻转！这是最容易犯的错误。\n$-2x < -6$\n$x > 3$（除以 $-2$，$<$ 变成 $>$）\n验证：$x=4$：$-8 < -6$ ✓。$x=2$：$-4 < -6$ ✗。', en: 'Dividing by negative → flip the inequality! The most common mistake.\n$-2x < -6$\n$x > 3$ (divide by $-2$, $<$ becomes $>$)\nCheck: $x=4$: $-8 < -6$ ✓. $x=2$: $-4 < -6$ ✗.' },
    onWrong: { zh: '$x < 3$ 忘记翻转了！乘或除以负数 → 不等号必须反向。\n试试 $x=2$：$-2(2)=-4$，$-4 < -6$？不对！', en: '$x < 3$ forgot to flip! Multiply/divide by negative → inequality reverses.\nTry $x=2$: $-2(2)=-4$, $-4 < -6$? False!' },
    onSkip: { zh: '铁律：乘除负数 → 翻转不等号。代入数值验证方向。', en: 'Iron rule: multiply/divide by negative → flip inequality. Substitute values to verify direction.' },
  }],
  10173: [{
    prompt: { zh: '双重不等式：$1 \\leq 2x - 3 < 5$。求整数解。', en: 'Double inequality: $1 \\leq 2x - 3 < 5$. Find integer solutions.' },
    type: 'choice',
    choices: [
      { zh: '三部分同时加 3 再除以 2：$2 \\leq x < 4$，整数 2, 3', en: 'Add 3 to all three parts, divide by 2: $2 \\leq x < 4$, integers 2, 3' },
      { zh: '分别解两个不等式：$x \\geq 2$ 和 $x < 4$', en: 'Solve two separate inequalities: $x \\geq 2$ and $x < 4$' },
    ],
    onCorrect: { zh: '两种方法都对！整体操作更简洁：\n$1 \\leq 2x-3 < 5$\n$4 \\leq 2x < 8$（三边加 3）\n$2 \\leq x < 4$（三边除以 2）\n整数解：$x = 2, 3$。注意 4 不包含（$<$）！', en: 'Both methods work! Operating on all three parts is cleaner:\n$1 \\leq 2x-3 < 5$\n$4 \\leq 2x < 8$ (add 3)\n$2 \\leq x < 4$ (divide by 2)\nInteger solutions: $x = 2, 3$. Note 4 excluded ($<$)!' },
    onWrong: { zh: '分别解也是对的！关键是两个结果取交集。\n$2x-3 \\geq 1 \\Rightarrow x \\geq 2$\n$2x-3 < 5 \\Rightarrow x < 4$\n交集：$2 \\leq x < 4$，整数 2, 3。', en: 'Solving separately also works! Take the intersection of both results.\n$2x-3 \\geq 1 \\Rightarrow x \\geq 2$\n$2x-3 < 5 \\Rightarrow x < 4$\nIntersection: $2 \\leq x < 4$, integers 2, 3.' },
    onSkip: { zh: '双重不等式：三部分同时操作，或分别解再取交集。注意 $\\leq$ 和 $<$ 的区别。', en: 'Double inequality: operate on all three parts, or solve separately and intersect. Watch $\\leq$ vs $<$.' },
  }],
  10175: [{
    prompt: { zh: '反比例：$y \\propto \\frac{1}{x}$。$x$ 翻倍时 $y$ 怎么变？', en: 'Inverse proportion: $y \\propto \\frac{1}{x}$. When $x$ doubles, what happens to $y$?' },
    type: 'choice',
    choices: [
      { zh: '$y$ 减半——$x$ 越大 $y$ 越小', en: '$y$ halves — as $x$ increases, $y$ decreases' },
      { zh: '$y$ 也翻倍', en: '$y$ also doubles' },
    ],
    onCorrect: { zh: '反比例 = $y = \\frac{k}{x}$。$x$ 翻倍 → $y = \\frac{k}{2x} = \\frac{1}{2} \\cdot \\frac{k}{x}$。\n$y$ 变为原来的一半。\n反比关系：一个变大，另一个变小。$xy = k$ 永远是常数。', en: 'Inverse proportion = $y = \\frac{k}{x}$. $x$ doubles → $y = \\frac{k}{2x} = \\frac{1}{2} \\cdot \\frac{k}{x}$.\n$y$ becomes half.\nInverse: one increases, the other decreases. $xy = k$ is always constant.' },
    onWrong: { zh: '那是正比（$y \\propto x$）！反比是相反的——$x$ 大 $y$ 就小。\n$y = \\frac{k}{x}$，$x$ 翻倍 → $y$ 减半。', en: 'That\'s direct proportion ($y \\propto x$)! Inverse is opposite — bigger $x$, smaller $y$.\n$y = \\frac{k}{x}$, $x$ doubles → $y$ halves.' },
    onSkip: { zh: '反比：$y = \\frac{k}{x}$，$xy = k$。$x$ 乘 $n$ → $y$ 除以 $n$。', en: 'Inverse: $y = \\frac{k}{x}$, $xy = k$. $x$ × $n$ → $y$ ÷ $n$.' },
  }],
  10176: [{
    prompt: { zh: '部分变分：$y = ax + b$。当 $x=0$ 时 $y=5$，$x=2$ 时 $y=11$。求 $a$ 和 $b$。', en: 'Partial variation: $y = ax + b$. When $x=0$, $y=5$; when $x=2$, $y=11$. Find $a$ and $b$.' },
    type: 'choice',
    choices: [
      { zh: '$b=5$（代入 $x=0$），$a=3$（代入 $x=2$）', en: '$b=5$ (sub $x=0$), $a=3$ (sub $x=2$)' },
      { zh: '$a=5, b=11$', en: '$a=5, b=11$' },
    ],
    onCorrect: { zh: '$x=0$ 时：$y = a(0)+b = b = 5$。\n$x=2$ 时：$11 = 2a+5 \\Rightarrow 2a=6 \\Rightarrow a=3$。\n$y = 3x+5$。部分变分 = 有固定部分 ($b$) + 变动部分 ($ax$)。', en: '$x=0$: $y = a(0)+b = b = 5$.\n$x=2$: $11 = 2a+5 \\Rightarrow 2a=6 \\Rightarrow a=3$.\n$y = 3x+5$. Partial variation = fixed part ($b$) + variable part ($ax$).' },
    onWrong: { zh: '$a$ 是 $x$ 的系数（斜率），$b$ 是常数项（$x=0$ 时的 $y$）。\n$b=5$，$11=2a+5$，$a=3$。', en: '$a$ is the coefficient of $x$ (gradient), $b$ is the constant ($y$ when $x=0$).\n$b=5$, $11=2a+5$, $a=3$.' },
    onSkip: { zh: '$y=ax+b$：$b$ = 截距（$x=0$ 时），$a$ = 斜率。代入两点求解。', en: '$y=ax+b$: $b$ = intercept ($x=0$), $a$ = gradient. Substitute two points to solve.' },
  }],
  10178: [{
    prompt: { zh: '立方函数：$y = 2x^3$。当 $x=1$ 时 $y$ 等于多少？$x=-1$ 呢？', en: 'Cubic function: $y = 2x^3$. What is $y$ when $x=1$? What about $x=-1$?' },
    type: 'choice',
    choices: [
      { zh: '$x=1$: $y=2$，$x=-1$: $y=-2$——立方保留符号', en: '$x=1$: $y=2$, $x=-1$: $y=-2$ — cubing preserves sign' },
      { zh: '$x=1$: $y=2$，$x=-1$: $y=2$', en: '$x=1$: $y=2$, $x=-1$: $y=2$' },
    ],
    onCorrect: { zh: '立方和平方的关键区别：$(-1)^3 = -1$，$(-1)^2 = 1$。\n立方保留负号：$2(-1)^3 = 2 \\times (-1) = -2$。\n立方函数图像是 S 形，经过原点，关于原点对称。', en: 'Key difference between cubic and quadratic: $(-1)^3 = -1$, $(-1)^2 = 1$.\nCubing preserves the negative: $2(-1)^3 = 2 \\times (-1) = -2$.\nCubic graph is S-shaped, through origin, symmetric about origin.' },
    onWrong: { zh: '平方会把负号吃掉，但立方不会！\n$(-1)^2 = 1$，$(-1)^3 = -1$\n奇数幂保留符号，偶数幂变正。', en: 'Squaring absorbs the negative, but cubing doesn\'t!\n$(-1)^2 = 1$, $(-1)^3 = -1$\nOdd powers preserve sign, even powers make positive.' },
    onSkip: { zh: '奇数幂（立方）保留负号。偶数幂（平方）结果总为正。', en: 'Odd powers (cube) preserve sign. Even powers (square) always give positive.' },
  }],
  10180: [{
    prompt: { zh: '弦切角定理（交替弓形角）：切线和弦之间的角等于什么？', en: 'Alternate segment theorem: the angle between a tangent and a chord equals what?' },
    type: 'choice',
    choices: [
      { zh: '等于对面弓形中的圆周角', en: 'The inscribed angle in the alternate (opposite) segment' },
      { zh: '等于圆心角', en: 'The central angle' },
    ],
    onCorrect: { zh: '弦切角 = 交替弓形中的圆周角。\n切线和弦在切点形成的角 = 弦另一侧弧上的圆周角。\n这是圆定理中最常考的一个——看到切线和弦就想到它！', en: 'Angle between tangent and chord = inscribed angle in the alternate segment.\nThe angle formed at the tangent point = inscribed angle on the other side of the chord.\nThis is one of the most tested circle theorems — see tangent + chord, think alternate segment!' },
    onWrong: { zh: '不是圆心角。弦切角等于对面弓形中的圆周角。\n记住：切线+弦 → 看对面弓形的角。', en: 'Not the central angle. Tangent-chord angle equals the inscribed angle in the opposite segment.\nRemember: tangent + chord → look at the alternate segment.' },
    onSkip: { zh: '弦切角定理：切线与弦的夹角 = 交替弓形中的圆周角。', en: 'Alternate segment theorem: angle between tangent and chord = inscribed angle in the alternate segment.' },
  }],
  10182: [{
    prompt: { zh: '半圆弧长：半径 $r$ 的半圆，弧长是多少？', en: 'Semicircle arc: what is the arc length of a semicircle with radius $r$?' },
    type: 'choice',
    choices: [
      { zh: '$\\pi r$——整圆周长的一半', en: '$\\pi r$ — half the full circumference' },
      { zh: '$2\\pi r$', en: '$2\\pi r$' },
    ],
    onCorrect: { zh: '整圆周长 = $2\\pi r$。半圆 = 一半 = $\\pi r$。\n或用扇形弧长公式：$\\frac{180}{360} \\times 2\\pi r = \\pi r$。\n注意半圆的周长 = 弧长 + 直径 = $\\pi r + 2r$！', en: 'Full circumference = $2\\pi r$. Semicircle = half = $\\pi r$.\nOr use sector formula: $\\frac{180}{360} \\times 2\\pi r = \\pi r$.\nNote semicircle perimeter = arc + diameter = $\\pi r + 2r$!' },
    onWrong: { zh: '$2\\pi r$ 是整圆的周长。半圆弧长是一半：$\\pi r$。', en: '$2\\pi r$ is the full circumference. Semicircle arc is half: $\\pi r$.' },
    onSkip: { zh: '半圆弧长 = $\\pi r$。半圆周长（含直径）= $\\pi r + 2r$。', en: 'Semicircle arc = $\\pi r$. Semicircle perimeter (incl. diameter) = $\\pi r + 2r$.' },
  }],
  10183: [{
    prompt: { zh: '圆周长：直径 $d = 14$cm。圆周长是多少？', en: 'Circumference: diameter $d = 14$cm. What is the circumference?' },
    type: 'choice',
    choices: [
      { zh: '$C = \\pi d = 14\\pi \\approx 44$cm', en: '$C = \\pi d = 14\\pi \\approx 44$cm' },
      { zh: '$C = \\pi r^2 = 49\\pi$', en: '$C = \\pi r^2 = 49\\pi$' },
    ],
    onCorrect: { zh: '周长 = $\\pi d = 2\\pi r$。面积 = $\\pi r^2$。\n知道直径 → 用 $C = \\pi d$ 更快。知道半径 → 用 $C = 2\\pi r$。\n$14\\pi \\approx 14 \\times 3.14 = 43.96$cm。', en: 'Circumference = $\\pi d = 2\\pi r$. Area = $\\pi r^2$.\nKnow diameter → use $C = \\pi d$. Know radius → use $C = 2\\pi r$.\n$14\\pi \\approx 14 \\times 3.14 = 43.96$cm.' },
    onWrong: { zh: '$\\pi r^2$ 是面积公式！$r = 7$，$\\pi \\times 49$ 是面积。\n周长 = $\\pi d = 14\\pi$cm。单位是 cm（长度），不是 cm²。', en: '$\\pi r^2$ is the area formula! $r = 7$, $\\pi \\times 49$ is area.\nCircumference = $\\pi d = 14\\pi$cm. Units: cm (length), not cm².' },
    onSkip: { zh: '周长 = $\\pi d$ 或 $2\\pi r$。面积 = $\\pi r^2$。看单位区分。', en: 'Circumference = $\\pi d$ or $2\\pi r$. Area = $\\pi r^2$. Distinguish by units.' },
  }],
  10185: [{
    prompt: { zh: '球体体积：半径 $r=3$cm。体积是多少？', en: 'Sphere volume: radius $r=3$cm. Volume?' },
    type: 'choice',
    choices: [
      { zh: '$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi(27) = 36\\pi$ cm³', en: '$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi(27) = 36\\pi$ cm³' },
      { zh: '$V = 4\\pi r^2 = 36\\pi$ cm²', en: '$V = 4\\pi r^2 = 36\\pi$ cm²' },
    ],
    onCorrect: { zh: '球体体积 = $\\frac{4}{3}\\pi r^3$。别和表面积 $4\\pi r^2$ 搞混！\n$\\frac{4}{3}\\pi(3)^3 = \\frac{4}{3} \\times 27\\pi = 36\\pi$ cm³\n体积 = 立方（cm³），面积 = 平方（cm²）。', en: 'Sphere volume = $\\frac{4}{3}\\pi r^3$. Don\'t confuse with surface area $4\\pi r^2$!\n$\\frac{4}{3}\\pi(3)^3 = \\frac{4}{3} \\times 27\\pi = 36\\pi$ cm³\nVolume = cubic (cm³), area = square (cm²).' },
    onWrong: { zh: '$4\\pi r^2$ 是球的表面积（cm²），不是体积（cm³）！\n体积 = $\\frac{4}{3}\\pi r^3$。注意 $r^3$ 和 $\\frac{4}{3}$。', en: '$4\\pi r^2$ is sphere surface area (cm²), not volume (cm³)!\nVolume = $\\frac{4}{3}\\pi r^3$. Note $r^3$ and $\\frac{4}{3}$.' },
    onSkip: { zh: '球体：体积 = $\\frac{4}{3}\\pi r^3$，表面积 = $4\\pi r^2$。', en: 'Sphere: volume = $\\frac{4}{3}\\pi r^3$, surface area = $4\\pi r^2$.' },
  }],
  10186: [{
    prompt: { zh: '球体表面积：半径 $r=5$cm。表面积？', en: 'Sphere surface area: radius $r=5$cm. Surface area?' },
    type: 'choice',
    choices: [
      { zh: '$A = 4\\pi r^2 = 4\\pi(25) = 100\\pi$ cm²', en: '$A = 4\\pi r^2 = 4\\pi(25) = 100\\pi$ cm²' },
      { zh: '$A = \\frac{4}{3}\\pi r^3$', en: '$A = \\frac{4}{3}\\pi r^3$' },
    ],
    onCorrect: { zh: '球面积 = $4\\pi r^2$ = 4 个大圆的面积。\n$4\\pi(5)^2 = 100\\pi \\approx 314$ cm²\n记忆技巧：表面积带 $r^2$（二维），体积带 $r^3$（三维）。', en: 'Sphere SA = $4\\pi r^2$ = area of 4 great circles.\n$4\\pi(5)^2 = 100\\pi \\approx 314$ cm²\nMemory tip: SA has $r^2$ (2D), volume has $r^3$ (3D).' },
    onWrong: { zh: '$\\frac{4}{3}\\pi r^3$ 是体积！表面积 = $4\\pi r^2$。\n看幂次：$r^2$ = 面积，$r^3$ = 体积。', en: '$\\frac{4}{3}\\pi r^3$ is volume! Surface area = $4\\pi r^2$.\nCheck the power: $r^2$ = area, $r^3$ = volume.' },
    onSkip: { zh: '球：SA = $4\\pi r^2$（$r^2$ = 面积），V = $\\frac{4}{3}\\pi r^3$（$r^3$ = 体积）。', en: 'Sphere: SA = $4\\pi r^2$ ($r^2$ = area), V = $\\frac{4}{3}\\pi r^3$ ($r^3$ = volume).' },
  }],
  10187: [{
    prompt: { zh: '圆柱表面积：半径 $r$，高 $h$。总表面积由哪些部分组成？', en: 'Cylinder surface area: radius $r$, height $h$. What parts make up the total SA?' },
    type: 'choice',
    choices: [
      { zh: '两个圆 + 侧面长方形 = $2\\pi r^2 + 2\\pi rh$', en: 'Two circles + lateral rectangle = $2\\pi r^2 + 2\\pi rh$' },
      { zh: '$\\pi r^2 + 2\\pi rh$', en: '$\\pi r^2 + 2\\pi rh$' },
    ],
    onCorrect: { zh: '圆柱表面积 = 顶 + 底 + 侧面\n两个圆：$2 \\times \\pi r^2$\n侧面展开是长方形：$2\\pi r \\times h$（周长 × 高）\n总 SA = $2\\pi r^2 + 2\\pi rh = 2\\pi r(r+h)$', en: 'Cylinder SA = top + bottom + lateral surface\nTwo circles: $2 \\times \\pi r^2$\nLateral unwraps to rectangle: $2\\pi r \\times h$ (circumference × height)\nTotal SA = $2\\pi r^2 + 2\\pi rh = 2\\pi r(r+h)$' },
    onWrong: { zh: '别忘了有两个圆面（顶和底）！只写一个 $\\pi r^2$ 漏了一面。\n总 SA = $2\\pi r^2 + 2\\pi rh$', en: 'Don\'t forget there are TWO circular faces (top and bottom)! One $\\pi r^2$ misses a face.\nTotal SA = $2\\pi r^2 + 2\\pi rh$' },
    onSkip: { zh: '圆柱总表面积 = $2\\pi r^2 + 2\\pi rh$。两个圆 + 侧面展开长方形。', en: 'Cylinder total SA = $2\\pi r^2 + 2\\pi rh$. Two circles + lateral rectangle.' },
  }],
  10189: [{
    prompt: { zh: '四分位数：15 个有序数据。下四分位数 $Q_1$ 在第几个位置？', en: 'Quartiles: 15 ordered data points. What position is the lower quartile $Q_1$?' },
    type: 'choice',
    choices: [
      { zh: '第 4 个——$\\frac{15+1}{4} = 4$', en: '4th value — $\\frac{15+1}{4} = 4$' },
      { zh: '第 3.75 个', en: '3.75th value' },
    ],
    onCorrect: { zh: '$n$ 个数据点：\n$Q_1$ 位置 = $\\frac{n+1}{4}$\n$Q_2$（中位数）= $\\frac{n+1}{2}$\n$Q_3$ = $\\frac{3(n+1)}{4}$\n$n=15$：$Q_1$ 第 4 个，$Q_2$ 第 8 个，$Q_3$ 第 12 个。', en: '$n$ data points:\n$Q_1$ position = $\\frac{n+1}{4}$\n$Q_2$ (median) = $\\frac{n+1}{2}$\n$Q_3$ = $\\frac{3(n+1)}{4}$\n$n=15$: $Q_1$ at 4th, $Q_2$ at 8th, $Q_3$ at 12th.' },
    onWrong: { zh: '$\\frac{n}{4} = 3.75$ 不是标准公式。用 $\\frac{n+1}{4}$ 来定位四分位数。\n$\\frac{15+1}{4} = 4$，$Q_1$ 是第 4 个值。', en: '$\\frac{n}{4} = 3.75$ isn\'t the standard formula. Use $\\frac{n+1}{4}$ to locate quartiles.\n$\\frac{15+1}{4} = 4$, $Q_1$ is the 4th value.' },
    onSkip: { zh: '四分位数位置：$Q_1 = \\frac{n+1}{4}$，$Q_2 = \\frac{n+1}{2}$，$Q_3 = \\frac{3(n+1)}{4}$。', en: 'Quartile positions: $Q_1 = \\frac{n+1}{4}$, $Q_2 = \\frac{n+1}{2}$, $Q_3 = \\frac{3(n+1)}{4}$.' },
  }],
  10190: [{
    prompt: { zh: 'T形面积：一个 T 形怎么计算面积？', en: 'T-shape area: how to calculate the area of a T-shape?' },
    type: 'choice',
    choices: [
      { zh: '分割成两个矩形，分别算再相加', en: 'Split into two rectangles, calculate each, then add' },
      { zh: '长 × 宽', en: 'Length × width' },
    ],
    onCorrect: { zh: '复合图形 → 分割成基本图形（矩形、三角形、半圆等）。\nT 形 = 横条矩形 + 竖条矩形。\n分别算面积再相加。注意不要重复计算重叠区域！', en: 'Composite shapes → split into basic shapes (rectangles, triangles, semicircles, etc.).\nT-shape = horizontal rectangle + vertical rectangle.\nCalculate each area, then add. Don\'t double-count overlapping regions!' },
    onWrong: { zh: 'T 形不是简单的矩形，不能直接用长×宽。\n把它分成两个矩形来计算。', en: 'T-shape isn\'t a simple rectangle — can\'t just use length × width.\nSplit it into two rectangles.' },
    onSkip: { zh: '复合图形：分割成基本图形，分别计算面积再求和。', en: 'Composite shapes: split into basic shapes, calculate each area, then sum.' },
  }],
  10192: [{
    prompt: { zh: '精度极限：一段绳子长 6cm，精确到 1cm。最短可能是多少？', en: 'Accuracy limits: a rope is 6cm long, measured to the nearest 1cm. What is the shortest it could be?' },
    type: 'choice',
    choices: [
      { zh: '$5.5$cm——下界 = 6 - 0.5', en: '$5.5$cm — lower bound = 6 - 0.5' },
      { zh: '$5$cm', en: '$5$cm' },
    ],
    onCorrect: { zh: '精确到 1cm 意味着：$5.5 \\leq \\text{实际长度} < 6.5$。\n下界 = 测量值 - 精度的一半。\n$6 - 0.5 = 5.5$cm。\n$5.5$ 可以四舍五入到 $6$，但 $5.4$ 会变成 $5$。', en: 'To nearest 1cm means: $5.5 \\leq actual < 6.5$.\nLower bound = measurement - half the precision.\n$6 - 0.5 = 5.5$cm.\n$5.5$ rounds to $6$, but $5.4$ would round to $5$.' },
    onWrong: { zh: '$5$cm 四舍五入是 $5$，不是 $6$！\n下界 = 测量值 - 精度的一半 = $6 - 0.5 = 5.5$cm。', en: '$5$cm rounds to $5$, not $6$!\nLower bound = measurement - half precision = $6 - 0.5 = 5.5$cm.' },
    onSkip: { zh: '下界 = 值 - 精度/2。精确到 1cm → $\\pm 0.5$cm。精确到 0.1 → $\\pm 0.05$。', en: 'Lower bound = value - precision/2. To nearest 1cm → $\\pm 0.5$cm. To 0.1 → $\\pm 0.05$.' },
  }],
  10193: [{
    prompt: { zh: '散点预判：散点图上点从左下到右上分布。这是什么相关性？', en: 'Scatter prediction: points on a scatter graph trend from bottom-left to top-right. What correlation?' },
    type: 'choice',
    choices: [
      { zh: '正相关——$x$ 增大时 $y$ 也增大', en: 'Positive correlation — as $x$ increases, $y$ increases' },
      { zh: '负相关', en: 'Negative correlation' },
    ],
    onCorrect: { zh: '正相关：左下→右上（同向变化）\n负相关：左上→右下（反向变化）\n无相关：没有明显趋势（散乱分布）\n相关性不等于因果关系！', en: 'Positive: bottom-left → top-right (same direction)\nNegative: top-left → bottom-right (opposite direction)\nNo correlation: no clear trend (scattered)\nCorrelation does NOT mean causation!' },
    onWrong: { zh: '负相关是从左上到右下（一个增大另一个减小）。\n左下到右上 = 同时增大 = 正相关。', en: 'Negative is top-left to bottom-right (one increases, other decreases).\nBottom-left to top-right = both increase = positive correlation.' },
    onSkip: { zh: '正相关：同向。负相关：反向。无相关：无趋势。相关≠因果。', en: 'Positive: same direction. Negative: opposite. None: no trend. Correlation ≠ causation.' },
  }],
};

// ── Insertion logic (same as batch 1) ──
const filePath = path.join(import.meta.dirname, '../src/data/missions/y10.ts');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let insertCount = 0;

const insertionPoints = new Map<number, number>();
let currentId: number | null = null;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/id: (\d+), grade: 10/);
  if (idMatch) currentId = Number(idMatch[1]);
  if (lines[i].match(/^\s+tutorialSteps:/) && currentId) {
    let hasDiscover = false;
    for (let j = i - 1; j > Math.max(0, i - 30); j--) {
      if (lines[j].includes('discoverSteps:')) { hasDiscover = true; break; }
      if (lines[j].match(/id: \d+, grade:/)) break;
    }
    if (!hasDiscover && STEPS[currentId]) {
      insertionPoints.set(currentId, i);
    }
  }
}

const sorted = [...insertionPoints.entries()].sort((a, b) => b[1] - a[1]);
const formatBi = (obj: {zh:string;en:string}) => `{ zh: ${JSON.stringify(obj.zh)}, en: ${JSON.stringify(obj.en)} }`;

for (const [missionId, lineIdx] of sorted) {
  const steps = STEPS[missionId];
  const indent = '    ';
  let stepLines: string[] = [`${indent}discoverSteps: [`];
  for (const step of steps) {
    stepLines.push(`${indent}  {`);
    stepLines.push(`${indent}    prompt: ${formatBi(step.prompt)},`);
    stepLines.push(`${indent}    type: '${step.type}',`);
    stepLines.push(`${indent}    choices: [`);
    for (const c of step.choices) stepLines.push(`${indent}      ${formatBi(c)},`);
    stepLines.push(`${indent}    ],`);
    stepLines.push(`${indent}    onCorrect: ${formatBi(step.onCorrect)},`);
    stepLines.push(`${indent}    onWrong: ${formatBi(step.onWrong)},`);
    stepLines.push(`${indent}    onSkip: ${formatBi(step.onSkip)},`);
    stepLines.push(`${indent}  },`);
  }
  stepLines.push(`${indent}],`);
  lines.splice(lineIdx, 0, ...stepLines);
  insertCount++;
  console.log(`✅ ${missionId}`);
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log(`\nDone! Added ${insertCount} discoverSteps.`);
