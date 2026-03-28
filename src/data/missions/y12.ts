import type { Mission } from '../../types';

export const MISSIONS_Y12: Mission[] = [
  // --- Year 12: The Final Stand (Grand Unification) ---
  {
    id: 1211, grade: 12, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 归晋与综合微积分", en: "Unit 1: Unification & Advanced Calculus" },
    topic: 'Calculus', type: 'DERIVATIVE',
    title: { zh: '最后的防线', en: 'The Final Stand' },
    skillName: { zh: '防线极值术', en: 'Defense Optimization' },
    skillSummary: { zh: '令导数为零求极值', en: 'Set derivative to zero for extremum' },
    story: { zh: '守卫成都。城墙受力函数为 $f(x) = x^3 - 3x$。', en: 'Defending Chengdu. Wall stress function: $f(x) = x^3 - 3x$.' },
    description: { zh: '求函数的极小值点 $x$（$x > 0$）。', en: 'Find the local minimum point $x$ ($x > 0$).' },
    data: { x: 1, func: '3x^2-3', generatorType: 'DERIVATIVE_RANDOM' }, difficulty: 'Hard', reward: 1000,
    kpId: 'kp-2.12-01', sectionId: 'algebra',
    discoverSteps: [
      {
        prompt: { zh: '城墙受力不是处处一样——有的地方压力大，有的压力小。\n你觉得怎么找到"压力最小的转折点"？', en: 'Wall stress is not the same everywhere — some spots take more, some less.\nHow would you find the "turning point with least stress"?' },
        type: 'choice',
        choices: [
          { zh: '找变化速度为零的点（导数 = 0）', en: 'Find where the rate of change is zero (derivative = 0)' },
          { zh: '试所有点看哪个最小', en: 'Try all points to see which is smallest' },
          { zh: '取函数的起点', en: 'Take the starting point of the function' },
        ],
        onCorrect: { zh: '你已经有微积分的直觉了！\n变化速度为零 = 导数为零 = 极值点。\n就像走到山谷最底部那一刻，脚下是平的——坡度为零。', en: 'You already have calculus intuition!\nRate of change = 0 means derivative = 0 means extremum.\nLike reaching the valley floor — the ground is flat, gradient is zero.' },
        onWrong: { zh: '试所有点太慢了——导数给了一个捷径！\n导数 = 变化的速度。当导数 = 0，变化停止 = 极值点。', en: 'Testing all points is too slow — derivatives give a shortcut!\nDerivative = rate of change. When derivative = 0, change stops = extremum.' },
        onSkip: { zh: '导数描述"变化有多快"。当导数 = 0，函数不再上升也不下降——这就是极值点。', en: 'Derivatives describe "how fast things change". When derivative = 0, the function stops rising or falling — that is the extremum.' },
      },
      {
        prompt: { zh: '导数为零找到了转折点。但怎么知道它是"最高点"还是"最低点"？\n$f\'\'(x) > 0$ 意味着什么？', en: 'Derivative = 0 finds the turning point. But how to know if it is a max or min?\nWhat does $f\'\'(x) > 0$ mean?' },
        type: 'choice',
        choices: [
          { zh: '曲线在该点向上弯——是最低点', en: 'The curve bends upward — it is a minimum' },
          { zh: '曲线在该点向下弯——是最高点', en: 'The curve bends downward — it is a maximum' },
        ],
        onCorrect: { zh: '对！$f\'\'(x) > 0$ = 曲线凹上 = 碗形 = 最低点（极小值）。\n$f\'\'(x) < 0$ 则相反，像倒碗 = 最高点（极大值）。\n一阶导数找候选，二阶导数当裁判！', en: 'Yes! $f\'\'(x) > 0$ = concave up = bowl shape = minimum.\n$f\'\'(x) < 0$ = opposite, inverted bowl = maximum.\nFirst derivative finds candidates, second derivative judges!' },
        onWrong: { zh: '想象 $f\'\'(x) > 0$ 意味着斜率在增加——从负变正，像从下坡走到上坡。\n中间的那个点就是谷底——最低点！', en: 'Think: $f\'\'(x) > 0$ means the slope is increasing — going from negative to positive.\nThe point in between is the valley floor — the minimum!' },
        onSkip: { zh: '$f\'\'(x) > 0$ → 凹上（碗形）→ 最低点。$f\'\'(x) < 0$ → 凹下（倒碗）→ 最高点。', en: '$f\'\'(x) > 0$ → concave up (bowl) → minimum. $f\'\'(x) < 0$ → concave down (inverted bowl) → maximum.' },
      },
    ],
    tutorialSteps: [
      {
        text: { zh: '刘禅：为什么要找“最稳的防线”？\n城墙受力不会处处一样——有的地方压力大，有的地方压力最小。\n补强材料要先送到“压力最低的转折点”，才能用最少兵力守住成都。\n导数就是帮我们找到这个关键位置的工具。', en: 'Liu Shan: "Why find the most stable part of the wall?\nThe stress on the wall is not the same everywhere — some spots take more pressure, some take the least.\nReinforcements must go to the turning point with the LOWEST stress, so Chengdu can be defended with the least cost.\nDerivatives help us find that key position."' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：把图像想成一条山路\n走向谷底时，坡度会从负数慢慢变成 $0$；过了谷底，又从 $0$ 变回正数。\n所以“最低点”那一瞬间，切线会暂时变平，也就是导数 = $0$。\n先找导数为 $0$ 的位置，再确认它是不是极小值点。', en: 'Liu Shan: "Think of the graph as a mountain path\nAs you walk down into a valley, the gradient goes from negative to $0$; after the valley, it changes from $0$ to positive.\nSo at the LOWEST point, the tangent briefly becomes flat, which means derivative = $0$.\nFirst find where the derivative is $0$, then confirm it is really a minimum."' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：先写出极小值的条件\n极值点先满足 $f\'(x) = 0$。\n题目已经给出 $f\'(x) = 3x^2 - 3$，所以我们解：\n$3x^2 - 3 = 0$', en: 'Liu Shan: "Write the condition for an extremum first\nAn extremum must first satisfy $f\'(x) = 0$.\nThe problem already gives $f\'(x) = 3x^2 - 3$, so we solve:\n$3x^2 - 3 = 0$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：移项\n把常数 $-3$ 移到右边：\n$3x^2 = 3$', en: 'Liu Shan: "Rearrange\nMove the constant $-3$ to the right-hand side:\n$3x^2 = 3$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：再除以 $3$，并开方\n$x^2 = 1$\n所以 $x = \\pm 1$。\n但题目要求 $x > 0$，只取正根：$x = 1$。', en: 'Liu Shan: "Divide by $3$, then take the square root\n$x^2 = 1$\nSo $x = \\pm 1$.\nBut the problem requires $x > 0$, so we keep only the positive root: $x = 1$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：答案\n极小值点在 $x = 1$。\n最该加固的，就是城墙上的这个位置。', en: 'Liu Shan: "Answer\nThe local minimum point is at $x = 1$.\nThis is the part of the wall that should be reinforced first."' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：验算\n只满足 $f\'(x)=0$ 还不够，还要确认它真的是“最小”不是“最大”。\n$f\'\'(x) = 6x$，代入 $x = 1$：$f\'\'(1) = 6 > 0$ ✓\n二阶导数为正，说明这里确实是极小值点。', en: 'Liu Shan: "Verify\nIt is not enough for $f\'(x)=0$ — we must also confirm this point is a MINIMUM, not a maximum.\n$f\'\'(x) = 6x$, and at $x = 1$ we get $f\'\'(1) = 6 > 0$ ✓\nA positive second derivative confirms this point is truly a local minimum."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '先令一阶导数等于 0 找候选点，再用二阶导数判断是极大还是极小。', en: 'First set the first derivative to 0 to find candidate points, then use the second derivative to decide maximum or minimum.' }, formula: "$f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = 1,\\quad f''(1) = 6 > 0$", tips: [{ zh: "刘禅提示：导数先找转折点，二阶导数再确认是不是最低点。", en: "Liu Shan Tip: Use the first derivative to find the turning point, then the second derivative to confirm it is the lowest point." }] },
    storyConsequence: { correct: { zh: '最后的防线——导数精准！做得漂亮！', en: 'The Final Stand — Well done!' }, wrong: { zh: '导数差一步——指数拿下来当系数，指数减 1。', en: 'Not quite... Try again!' } }
  },
  {
    id: 1221, grade: 12, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 战后统计", en: "Unit 2: Post-War Statistics" },
    topic: 'Statistics', type: 'PROBABILITY',
    title: { zh: '胜率评估', en: 'Win Rate Assessment' },
    skillName: { zh: '概率评估术', en: 'Probability Assessment' },
    skillSummary: { zh: '多次独立事件的联合概率', en: 'Joint probability of multiple independent events' },
    story: { zh: '评估统一天下的概率。已知魏国每次胜率为 {p1}。', en: 'Assess the probability of unification. Wei win rate is {p1} each time.' },
    description: { zh: '若发生两次独立战争，魏国全胜的概率是多少？', en: 'If two independent wars occur, what is the probability of Wei winning both?' },
    data: { p1: 0.7, p2: 0.7, generatorType: 'PROBABILITY_IND_RANDOM' }, difficulty: 'Medium', reward: 500,
    kpId: 'kp-8.3-02', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么需要联合概率？\n魏国打一场能赢，不代表连打两场都能赢。\n每多打一场，"全胜"的概率就在缩小——这就是独立事件乘法原理。', en: 'Sima Yan: "Why joint probability?\nWinning one battle doesn\'t guarantee winning two.\nEach extra battle shrinks the \'win all\' probability — that\'s the multiplication rule."' }, highlightField: 'p' },
      { text: { zh: '司马炎：独立事件\n"独立"= 第一场的结果不影响第二场。\n就像抛两次硬币——第一次正面不会影响第二次。\n如果两件事互相不影响，概率就相乘。', en: 'Sima Yan: "Independent events\n\'Independent\' = first result doesn\'t affect the second.\nLike flipping a coin twice — first flip doesn\'t change the second.\nIf two events don\'t affect each other, multiply probabilities."' }, highlightField: 'p' },
      { text: { zh: '司马炎：公式\n$$P(A \\text{ 且 } B) = P(A) \\times P(B)$$\n前提：A 和 B 必须独立。', en: 'Sima Yan: "Formula\n$$P(A \\text{ and } B) = P(A) \\times P(B)$$\nCondition: A and B must be independent."' }, highlightField: 'p' },
      { text: { zh: '司马炎：代入\n$P = {p1} \\times {p2}$', en: 'Sima Yan: "Substitute\n$P = {p1} \\times {p2}$"' }, highlightField: 'p' },
      { text: { zh: '司马炎：答案\n$P = {answer}$\n天下大势，合久必分，分久必合。', en: 'Sima Yan: "Answer\n$P = {answer}$\nThe world unites after division, divides after union."' }, highlightField: 'p' },
      { text: { zh: '司马炎：验算\n$P(全胜)$ 应该小于单场胜率（$0.49 < 0.7$）✓\n$P(全败) = 0.3 \\times 0.3 = 0.09$\n$P(全胜) + P(至少一败) = 1$ ✓', en: 'Sima Yan: "Verify\n$P(\\text{win all})$ should be less than single win rate ($0.49 < 0.7$) ✓\n$P(\\text{lose all}) = 0.3 \\times 0.3 = 0.09$\n$P(\\text{win all}) + P(\\text{at least one loss}) = 1$ ✓"' }, highlightField: 'p' },
    ],
    secret: { concept: { zh: '独立事件联合概率 = 各自概率相乘。P(A且B) = P(A)×P(B)。', en: 'Joint probability of independent events = multiply individual probabilities.' }, formula: '$P(A \\cap B) = P(A) \\times P(B)$', tips: [{ zh: '司马炎提示：独立相乘——天下大势的数学。', en: 'Sima Yan Tip: Independent events multiply — the mathematics of destiny.' }] },
    storyConsequence: { correct: { zh: '胜率评估——概率算准！做得漂亮！', en: 'Win Rate Assessment — Well done!' }, wrong: { zh: '概率差了一点——记住目标数 ÷ 总数。', en: 'Not quite... Try again!' } }
  },

  {
    id: 1212, grade: 12, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 归晋与综合微积分", en: "Unit 1: Unification & Advanced Calculus" },
    topic: 'Calculus', type: 'DERIVATIVE',
    title: { zh: '攻城速率', en: 'Siege Rate' },
    skillName: { zh: '导数求斜率术', en: 'Derivative as Gradient' },
    skillSummary: { zh: '在指定点求切线斜率', en: 'Find tangent gradient at a given point' },
    story: { zh: '攻城进度函数 $f(x) = x^2$，求 $x = 3$ 时的推进速率。', en: 'Siege progress $f(x) = x^2$. Find the advance rate at $x = 3$.' },
    description: { zh: '求 $f(x) = x^2$ 在 $x = 3$ 处的导数值。', en: 'Find the derivative of $f(x) = x^2$ at $x = 3$.' },
    data: { x: 3, func: 'x^2', generatorType: 'DERIVATIVE_RANDOM' }, difficulty: 'Medium', reward: 500,
    kpId: 'kp-2.12-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么要求导数？\n攻城不是匀速推进——有时猛攻，有时停滞。\n"此刻的推进速度"就是导数。知道速率，才能决定何时投入预备队。', en: 'Sima Yan: "Why find derivatives?\nSieges don\'t progress at constant speed — sometimes rushing, sometimes stalling.\nThe \'speed right now\' is the derivative. Knowing the rate tells you when to commit reserves."' }, highlightField: 'k' },
      { text: { zh: '司马炎：幂规则\n$$f(x) = x^n \\Rightarrow f\'(x) = n \\cdot x^{n-1}$$\n指数拿下来当系数，指数减 $1$。\n就这一条规则，搞定所有幂函数！', en: 'Sima Yan: "Power rule\n$$f(x) = x^n \\Rightarrow f\'(x) = n \\cdot x^{n-1}$$\nBring the exponent down as coefficient, reduce exponent by 1.\nThis one rule handles all power functions!"' }, highlightField: 'k' },
      { text: { zh: '司马炎：求导\n$f(x) = x^2$\n$f\'(x) = 2 \\cdot x^{2-1} = 2x$', en: 'Sima Yan: "Differentiate\n$f(x) = x^2$\n$f\'(x) = 2 \\cdot x^{2-1} = 2x$"' }, highlightField: 'k' },
      { text: { zh: '司马炎：代入 $x = 3$\n$f\'(3) = 2 \\times 3 = 6$', en: 'Sima Yan: "Substitute $x = 3$\n$f\'(3) = 2 \\times 3 = 6$"' }, highlightField: 'k' },
      { text: { zh: '司马炎：答案\n在 $x = 3$ 处，攻城速率为 $6$。', en: 'Sima Yan: "Answer\nAt $x = 3$, the siege rate is $6$."' }, highlightField: 'k' },
      { text: { zh: '司马炎：验算\n切线 $y = 6(x-3) + 9 = 6x - 9$\n代入 $x = 3$：$6(3) - 9 = 9 = f(3) = 3^2$ ✓', en: 'Sima Yan: "Verify\nTangent $y = 6(x-3) + 9 = 6x - 9$\nAt $x = 3$: $6(3) - 9 = 9 = f(3) = 3^2$ ✓"' }, highlightField: 'k' },
    ],
    secret: { concept: { zh: '导数 = 切线斜率。$f(x) = x^2$ 的导数是 $f\'(x) = 2x$。', en: 'Derivative = tangent gradient. For $f(x) = x^2$, $f\'(x) = 2x$.' }, formula: "$f'(x) = 2x$", tips: [{ zh: '司马炎提示：幂函数的导数——指数拿下来当系数，指数减1。', en: 'Sima Yan Tip: Power rule — bring the exponent down, reduce it by 1.' }] },
    storyConsequence: { correct: { zh: '攻城速率——导数精准！做得漂亮！', en: 'Siege Rate — Derivative nailed!' }, wrong: { zh: '导数差一步——指数拿下来当系数，指数减 1。', en: 'Not quite... Try again!' } }
  },
  {
    id: 1222, grade: 12, unitId: 2, order: 2,
    unitTitle: { zh: "Unit 2: 战后统计", en: "Unit 2: Post-War Statistics" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '军粮盘点', en: 'Grain Stocktake' },
    skillName: { zh: '加权平均术', en: 'Weighted Mean' },
    skillSummary: { zh: '加权平均 = Σ(值×权重) ÷ Σ权重', en: 'Weighted mean = Σ(value×weight) ÷ Σweights' },
    story: { zh: '三郡粮仓容量不同，求加权平均存粮。', en: 'Three prefectures have different granary sizes. Find the weighted average grain stock.' },
    description: { zh: '计算加权平均值。', en: 'Calculate the weighted mean.' },
    data: { values: [40, 50, 80], mode: 'mean', generatorType: 'STATISTICS_MEAN_RANDOM' }, difficulty: 'Medium', reward: 480,
    kpId: 'kp-8.2-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么要加权平均？\n三个郡的粮仓大小不一样。\n小仓存 40 石，大仓存 80 石——简单平均 $\\frac{40+50+80}{3}$ 不公平。\n大仓应该"说话声更大"——这就是加权的意义。', en: 'Sima Yan: "Why weighted average?\nThree prefectures have different granary sizes.\nSmall stores 40, large stores 80 — simple average $\\frac{40+50+80}{3}$ isn\'t fair.\nThe larger granary should \'count more\' — that\'s what weighting means."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：加权平均公式\n$$\\bar{x} = \\frac{\\sum f_i \\cdot x_i}{\\sum f_i}$$\n$f_i$ = 权重（仓库容量），$x_i$ = 数值（存粮率）\n分子 = 每个值 × 它的权重，分母 = 权重之和。', en: 'Sima Yan: "Weighted mean formula\n$$\\bar{x} = \\frac{\\sum f_i \\cdot x_i}{\\sum f_i}$$\n$f_i$ = weight (granary size), $x_i$ = value (stock rate)\nNumerator = each value × its weight, denominator = sum of weights."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：代入数据\n$\\bar{x} = \\frac{40 + 50 + 80}{3}$\n$= \\frac{170}{3}$', en: 'Sima Yan: "Substitute\n$\\bar{x} = \\frac{40 + 50 + 80}{3}$\n$= \\frac{170}{3}$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：计算\n$= 56.\\overline{6}$\n约 $56.7$ 石。', en: 'Sima Yan: "Calculate\n$= 56.\\overline{6}$\nAbout $56.7$ units."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：答案\n平均存粮约 $56.7$ 石。', en: 'Sima Yan: "Answer\nAverage grain stock is about $56.7$ units."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：验算\n$56.7 \\times 3 = 170.1 \\approx 170$ ✓\n所有仓加起来 $40 + 50 + 80 = 170$ ✓', en: 'Sima Yan: "Verify\n$56.7 \\times 3 = 170.1 \\approx 170$ ✓\nAll granaries: $40 + 50 + 80 = 170$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '加权平均考虑每个数据的"重要程度"。不是简单平均！', en: 'Weighted mean accounts for how important each data point is. Not a simple average!' }, formula: '$\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}$', tips: [{ zh: '司马炎提示：大仓多算，小仓少算——加权平均更公平。', en: 'Sima Yan Tip: Big granaries count more — weighted average is fairer.' }] },
    storyConsequence: { correct: { zh: '军粮盘点——统计精准！做得漂亮！', en: 'Grain Stocktake — Well done!' }, wrong: { zh: '平均值差一点——总和 ÷ 个数，再算算？', en: 'Not quite... Try again!' } }
  },

  // --- Y12 Unit 3: 综合应用 · 三分归晋 (Synthesis) ---
  {
    id: 1231, grade: 12, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 三分归晋·综合篇", en: "Unit 3: Reunification — Synthesis" },
    topic: 'Algebra', type: 'SIMULTANEOUS',
    title: { zh: '三国均势', en: 'Balance of Power' },
    skillName: { zh: '联立方程组术', en: 'Simultaneous Equations' },
    skillSummary: { zh: '消元法解二元方程组', en: 'Elimination method for 2-variable systems' },
    story: { zh: '魏蜀两国军费关系：$2x + y = 100$（魏预算），$x + 3y = 110$（蜀预算）。求各项开支。', en: 'Wei and Shu military budgets: $2x + y = 100$ (Wei), $x + 3y = 110$ (Shu). Find each expenditure.' },
    description: { zh: '用消元法解联立方程组。', en: 'Solve simultaneous equations by elimination.' },
    data: { a1: 2, b1: 1, c1: 100, a2: 1, b2: 3, c2: 110, generatorType: 'SIMULTANEOUS_RANDOM' }, difficulty: 'Medium', reward: 500,
    kpId: 'kp-2.5-08', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么需要联立方程？\n一个方程只有一个限制——答案有无数种可能。\n两个方程 = 两个限制 = 精确定位唯一解。\n就像用两条路线交叉确定一个地点。', en: 'Sima Yan: "Why simultaneous equations?\nOne equation = one constraint — infinite solutions.\nTwo equations = two constraints = one unique solution.\nLike two routes intersecting to pinpoint a location."' }, highlightField: 'x' },
      { text: { zh: '司马炎：消元法思路\n让其中一个未知数"消失"——把两个方程组合成只含一个未知数的新方程。\n就像审讯两个俘虏——交叉对比就能找到真相。', en: 'Sima Yan: "Elimination method\nMake one unknown \'disappear\' — combine equations into one with a single unknown.\nLike interrogating two prisoners — cross-reference to find the truth."' }, highlightField: 'x' },
      { text: { zh: '司马炎：第一步——配平系数\n让某个未知数的系数在两个方程中一样。', en: 'Sima Yan: "Step 1 — balance coefficients\nMake one unknown\'s coefficient the same in both equations."' }, highlightField: 'x' },
      { text: { zh: '司马炎：第二步——相减消元\n两个方程相减，一个未知数消失。', en: 'Sima Yan: "Step 2 — subtract to eliminate\nSubtract equations, one unknown vanishes."' }, highlightField: 'x' },
      { text: { zh: '司马炎：第三步——回代\n把已求出的值代回任一方程，求另一个未知数。', en: 'Sima Yan: "Step 3 — back-substitute\nPlug the found value into either equation to find the other."' }, highlightField: 'y' },
      { text: { zh: '司马炎：验算\n两个值代入两个方程，两个方程都要满足 ✓', en: 'Sima Yan: "Verify\nSubstitute both values into BOTH equations — both must be satisfied ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '联立方程：两个方程两个未知数。消元法：配平→相减→回代。', en: 'Simultaneous: 2 equations, 2 unknowns. Elimination: balance → subtract → back-substitute.' }, formula: '$\\begin{cases} 2x+y=100 \\\\ x+3y=110 \\end{cases}$', tips: [{ zh: '司马炎提示：消元 = 让一个未知数消失。', en: 'Sima Yan Tip: Elimination = make one unknown vanish.' }] },
    storyConsequence: { correct: { zh: '三国均势——联立方程求解成功！做得漂亮！', en: 'Balance of Power — Well done!' }, wrong: { zh: '联立方程差一步——试试重新检查每步运算？', en: 'Not quite... Try again!' } }
  },
  {
    id: 1232, grade: 12, unitId: 3, order: 2,
    unitTitle: { zh: "Unit 3: 三分归晋·综合篇", en: "Unit 3: Reunification — Synthesis" },
    topic: 'Functions', type: 'FUNC_VAL',
    title: { zh: '国力函数', en: 'National Power Function' },
    skillName: { zh: '函数求值术', en: 'Function Evaluation' },
    skillSummary: { zh: 'f(x) 代入求值', en: 'Substitute into f(x)' },
    story: { zh: '魏国国力函数 $f(x) = 2x^2 - 3x + 1$。当 $x = 5$（第五年）时国力是多少？', en: 'Wei national power $f(x) = 2x^2 - 3x + 1$. What\'s the power at $x = 5$ (year 5)?' },
    description: { zh: '将 $x$ 代入函数求值。', en: 'Substitute $x$ into the function to evaluate.' },
    data: { a: 2, b: -3, c: 1, x: 5, generatorType: 'FUNC_VAL_RANDOM' }, difficulty: 'Easy', reward: 450,
    kpId: 'kp-2.13-01', sectionId: 'functions',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么要算国力？\n战争的胜负不看一时勇猛——看的是国力曲线。\n$f(5)$ 就是"第五年国力多少"——一个数字决定攻守。\n会代入函数，就是会预测未来。', en: 'Sima Yan: "Why calculate national power?\nWar isn\'t won by bravery alone — it\'s decided by the power curve.\n$f(5)$ means \'how strong are we in year 5?\' — one number decides attack or defend.\nFunction evaluation is predicting the future."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：代入法\n$f(x) = 2x^2 - 3x + 1$\n$f(5)$ = 把所有 $x$ 换成 $5$。\n注意：$x^2$ 是"先平方再乘系数"，不是"先乘系数再平方"！', en: 'Sima Yan: "Substitution\n$f(x) = 2x^2 - 3x + 1$\n$f(5)$ = replace every $x$ with 5.\nNote: $x^2$ means \'square first, then multiply by coefficient\'!"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：逐项代入\n$f(5) = 2(5)^2 - 3(5) + 1$\n$= 2 \\times 25 - 15 + 1$', en: 'Sima Yan: "Substitute term by term\n$f(5) = 2(5)^2 - 3(5) + 1$\n$= 2 \\times 25 - 15 + 1$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：计算\n$= 50 - 15 + 1 = 36$', en: 'Sima Yan: "Calculate\n$= 50 - 15 + 1 = 36$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：答案\n$f(5) = {answer}$\n第五年魏国国力值！', en: 'Sima Yan: "Answer\n$f(5) = {answer}$\nWei\'s power in year 5!"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：验算\n用计算器验证：$2 \\times 25 = 50$，$50 - 15 = 35$，$35 + 1 = 36$ ✓', en: 'Sima Yan: "Verify\nCalculator check: $2 \\times 25 = 50$, $50 - 15 = 35$, $35 + 1 = 36$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '函数求值：把 x 的值代入每一项，按运算顺序计算。', en: 'Function evaluation: substitute x into each term, follow order of operations.' }, formula: '$f(x) = ax^2 + bx + c$', tips: [{ zh: '司马炎提示：x 换数字，一项一项算。', en: 'Sima Yan Tip: Replace x with the number, calculate term by term.' }] },
    storyConsequence: { correct: { zh: '国力函数——函数值正确！做得漂亮！', en: 'National Power Function — Well done!' }, wrong: { zh: '代入的时候有个小差错——逐步代入试试？', en: 'Not quite... Try again!' } }
  },
  {
    id: 1233, grade: 12, unitId: 3, order: 3,
    unitTitle: { zh: "Unit 3: 三分归晋·综合篇", en: "Unit 3: Reunification — Synthesis" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '最终防线', en: 'The Final Defense' },
    skillName: { zh: '综合三角术', en: 'Combined Trigonometry' },
    skillSummary: { zh: 'SOH-CAH-TOA 综合应用', en: 'SOH-CAH-TOA combined application' },
    story: { zh: '天下归一前的最后一道防线。瞭望塔高 $h$，观察角 $\\theta$，求敌军距离。所有三角知识的综合运用！', en: 'The final defense before reunification. Tower height $h$, observation angle $\\theta$, find enemy distance. All trigonometry combined!' },
    description: { zh: '用 tan 求三角形的未知边。', en: 'Use tan to find an unknown side.' },
    data: { angle: 50, adj: 20, generatorType: 'TRIGONOMETRY_RANDOM', func: 'tan' }, difficulty: 'Hard', reward: 600,
    kpId: 'kp-6.2-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么三角函数是将军的必修课？\n站在瞭望塔上，你不可能飞到敌营量距离。\n但只需一个角度和一条已知边，tan 就能告诉你答案。\n数学让你在安全的高处掌控整个战场。', en: 'Sima Yan: "Why is trigonometry a commander\'s essential skill?\nYou can\'t fly to the enemy camp to measure distance.\nBut with just one angle and one known side, tan gives you the answer.\nMath lets you command the entire battlefield from a safe height."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：正切 = 对边 ÷ 邻边\n$\\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}}$\n瞭望塔高度（对边）和敌军水平距离（邻边）的关系。', en: 'Sima Yan: "Tangent = opposite ÷ adjacent\n$\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$\nRelationship between tower height (opposite) and enemy distance (adjacent)."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：代入\n$\\tan {angle}° = \\frac{x}{{adj}}$\n$x = {adj} \\times \\tan {angle}°$', en: 'Sima Yan: "Substitute\n$\\tan {angle}° = \\frac{x}{{adj}}$\n$x = {adj} \\times \\tan {angle}°$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：计算\n$\\tan {angle}° = {tan_val}$\n$x = {adj} \\times {tan_val} = {answer}$', en: 'Sima Yan: "Calculate\n$\\tan {angle}° = {tan_val}$\n$x = {adj} \\times {tan_val} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：答案\n$x = {answer}$\n天下归一。三国故事到此终章。', en: 'Sima Yan: "Answer\n$x = {answer}$\nThe realm is reunited. The Three Kingdoms saga ends here."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：验算\n$\\frac{{answer}}{{adj}} = \\tan {angle}°$ ✓\n\n"天下大势，合久必分，分久必合。"\n—— 你的数学之旅，才刚刚开始。', en: 'Sima Yan: "Verify\n$\\frac{{answer}}{{adj}} = \\tan {angle}°$ ✓\n\n"The world unites after division, divides after union."\n— Your math journey has just begun."' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'tan θ = 对边/邻边。三国故事结束，数学旅途永远在路上。', en: 'tan θ = opp/adj. The Three Kingdoms end, but the math journey continues forever.' }, formula: '$\\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}$', tips: [{ zh: '司马炎提示：天下大势，合久必分，分久必合。你的数学之路，永远不会结束。', en: 'Sima Yan Tip: The world unites and divides. Your math journey never ends.' }] },
    storyConsequence: { correct: { zh: '最终防线——三角精准！做得漂亮！', en: 'The Final Defense — Well done!' }, wrong: { zh: '三角函数有点棘手——检查一下用的是 sin 还是 cos？', en: 'Not quite... Try again!' } }
  },

  // --- Year 12 Unit 4: 三维战场·向量 ---
  {
    id: 1241, grade: 12, unitId: 4, order: 1,
    unitTitle: { zh: "Unit 4: 三维战场·向量", en: "Unit 4: 3D Battlefield — Vectors" },
    topic: 'Geometry', type: 'VECTOR_3D',
    title: { zh: '空间行军', en: 'Spatial March' },
    skillName: { zh: '三维向量加法', en: '3D Vector Addition' },
    skillSummary: { zh: '$\\vec{a}+\\vec{b}$：分量分别相加', en: '$\\vec{a}+\\vec{b}$: add components separately' },
    story: { zh: '司马昭两路夹击蜀军：$\\vec{a}$ 从东面进攻，$\\vec{b}$ 从山上俯冲。两路合力向量是多少？', en: 'Sima Zhao attacks Shu from two directions: $\\vec{a}$ from the east, $\\vec{b}$ from above. What is the combined force vector?' },
    description: { zh: '求 $\\vec{a}+\\vec{b}$ 的三个分量（x, y, z）。', en: 'Find all three components (x, y, z) of $\\vec{a}+\\vec{b}$.' },
    data: { targetX: 7, targetY: 1, targetZ: 5, a1: 3, a2: 4, a3: 2, b1: 4, b2: -3, b3: 3, generatorType: 'VECTOR_3D_RANDOM' }, difficulty: 'Medium', reward: 500,
    kpId: 'kp-7.2-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '司马昭："为什么要学三维向量？\n二维向量在平地上够用了——但真实战场有高低地形。\n三维向量 $\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}$ 多了一个分量，描述上下方向的力。\n攻山、攻城、空中投射——都需要三维思维。"', en: 'Sima Zhao: "Why 3D vectors?\n2D vectors work on flat ground — but real battlefields have elevation.\n3D vectors $\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}$ add a component for up/down.\nAttacking hills, walls, aerial shots — all need 3D thinking."' }, highlightField: 'x' },
      { text: { zh: '司马昭："三维向量加法——和二维完全一样\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$$\n每个分量独立相加——$x$ 加 $x$，$y$ 加 $y$，$z$ 加 $z$。"', en: 'Sima Zhao: "3D vector addition — exactly like 2D\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$$\nAdd each component independently — $x$ with $x$, $y$ with $y$, $z$ with $z$."' }, highlightField: 'x' },
      { text: { zh: '司马昭："代入分量\n$\\vec{a} = \\begin{pmatrix}3\\\\4\\\\2\\end{pmatrix}$，$\\vec{b} = \\begin{pmatrix}4\\\\-3\\\\3\\end{pmatrix}$\n$x$：$3 + 4 = 7$\n$y$：$4 + (-3) = 1$"', en: 'Sima Zhao: "Substitute components\n$\\vec{a} = \\begin{pmatrix}3\\\\4\\\\2\\end{pmatrix}$, $\\vec{b} = \\begin{pmatrix}4\\\\-3\\\\3\\end{pmatrix}$\n$x$: $3 + 4 = 7$\n$y$: $4 + (-3) = 1$"' }, highlightField: 'y' },
      { text: { zh: '司马昭："计算 z 分量\n$z$：$2 + 3 = 5$"', en: 'Sima Zhao: "Calculate z component\n$z$: $2 + 3 = 5$"' }, highlightField: 'z' },
      { text: { zh: '司马昭："答案\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}7\\\\1\\\\5\\end{pmatrix}$$"', en: 'Sima Zhao: "Answer\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}7\\\\1\\\\5\\end{pmatrix}$$"' }, highlightField: 'x' },
      { text: { zh: '司马昭："验算\n$7 - 4 = 3 = a_1$ ✓\n$1 - (-3) = 4 = a_2$ ✓\n$5 - 3 = 2 = a_3$ ✓\n合力减去 $\\vec{b}$ 应该等于 $\\vec{a}$——三个分量全对！"', en: 'Sima Zhao: "Verify\n$7 - 4 = 3 = a_1$ ✓\n$1 - (-3) = 4 = a_2$ ✓\n$5 - 3 = 2 = a_3$ ✓\nResultant minus $\\vec{b}$ should equal $\\vec{a}$ — all three match!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '三维向量加法：分量分别相加，和二维一模一样。', en: '3D vector addition: add components separately, just like 2D.' }, formula: '$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$', tips: [{ zh: '司马昭提示：三维也不过是多加一个分量而已。', en: 'Sima Zhao Tip: 3D is just one more component to add.' }] },
    storyConsequence: { correct: { zh: '空间行军——三维向量精准！做得漂亮！', en: 'Spatial March — 3D vectors nailed!' }, wrong: { zh: '分量差了一个——x/y/z 分别加对了吗？', en: 'Component error... Try again!' } }
  },
  {
    id: 1242, grade: 12, unitId: 4, order: 2,
    unitTitle: { zh: "Unit 4: 三维战场·向量", en: "Unit 4: 3D Battlefield — Vectors" },
    topic: 'Geometry', type: 'VECTOR_3D',
    title: { zh: '炮火交叉', en: 'Crossfire Vectors' },
    skillName: { zh: '三维向量加法（含负分量）', en: '3D Vector Addition (with negatives)' },
    skillSummary: { zh: '含负数分量的三维向量加法', en: '3D vector addition with negative components' },
    story: { zh: '姜维从两个方向发射弩箭：$\\vec{a}$ 和 $\\vec{b}$，部分分量为负（向下/后方）。合力向量是多少？', en: 'Jiang Wei fires crossbow bolts from two directions: $\\vec{a}$ and $\\vec{b}$, some components negative (downward/backward). Find the resultant.' },
    description: { zh: '求 $\\vec{a}+\\vec{b}$ 的三个分量（x, y, z）。', en: 'Find all three components (x, y, z) of $\\vec{a}+\\vec{b}$.' },
    data: { targetX: 1, targetY: -1, targetZ: 4, a1: -3, a2: 5, a3: 1, b1: 4, b2: -6, b3: 3, generatorType: 'VECTOR_3D_RANDOM' }, difficulty: 'Hard', reward: 550,
    kpId: 'kp-7.2-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '姜维："负分量是什么意思？\n向量 $\\begin{pmatrix}-3\\\\5\\\\1\\end{pmatrix}$ 中，$-3$ 表示向西（负 $x$ 方向）。\n正负号不改变加法规则——该加还是加，只是结果可能是负的。\n负结果意味着合力方向翻转。"', en: 'Jiang Wei: "What do negative components mean?\nIn vector $\\begin{pmatrix}-3\\\\5\\\\1\\end{pmatrix}$, $-3$ means westward (negative $x$).\nSigns don\'t change the addition rule — you still add, but the result may be negative.\nA negative result means the combined force reverses direction."' }, highlightField: 'x' },
      { text: { zh: '姜维："加法公式不变\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$$\n负数加正数 = 抵消；负数加负数 = 更负。关键是符号。"', en: 'Jiang Wei: "Same addition formula\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$$\nNeg + pos = cancel; neg + neg = more negative. Signs are the key."' }, highlightField: 'x' },
      { text: { zh: '姜维："计算 x 和 y\n$x$：$(-3) + 4 = 1$\n$y$：$5 + (-6) = -1$\n注意：$y$ 分量为负，说明合力向南。"', en: 'Jiang Wei: "Calculate x and y\n$x$: $(-3) + 4 = 1$\n$y$: $5 + (-6) = -1$\nNote: $y$ is negative, meaning combined force goes south."' }, highlightField: 'y' },
      { text: { zh: '姜维："计算 z\n$z$：$1 + 3 = 4$"', en: 'Jiang Wei: "Calculate z\n$z$: $1 + 3 = 4$"' }, highlightField: 'z' },
      { text: { zh: '姜维："答案\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}1\\\\-1\\\\4\\end{pmatrix}$$\n合力向东偏南，高度方向分量最大——弩箭从高处射出！"', en: 'Jiang Wei: "Answer\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}1\\\\-1\\\\4\\end{pmatrix}$$\nResultant goes east and slightly south, with the strongest component upward — bolts fired from elevation!"' }, highlightField: 'x' },
      { text: { zh: '姜维："验算\n$\\begin{pmatrix}1\\\\-1\\\\4\\end{pmatrix} - \\begin{pmatrix}4\\\\-6\\\\3\\end{pmatrix} = \\begin{pmatrix}-3\\\\5\\\\1\\end{pmatrix} = \\vec{a}$ ✓\n合力减去 $\\vec{b}$ 还原 $\\vec{a}$——三个分量全对！"', en: 'Jiang Wei: "Verify\n$\\begin{pmatrix}1\\\\-1\\\\4\\end{pmatrix} - \\begin{pmatrix}4\\\\-6\\\\3\\end{pmatrix} = \\begin{pmatrix}-3\\\\5\\\\1\\end{pmatrix} = \\vec{a}$ ✓\nResultant minus $\\vec{b}$ gives back $\\vec{a}$ — all three match!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '负分量表示反方向。加法时正负抵消，方向由符号决定。', en: 'Negative components mean opposite direction. Addition cancels positives with negatives.' }, formula: '$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$', tips: [{ zh: '姜维提示：正负号决定方向——算错方向，弩箭就射到自己人了。', en: 'Jiang Wei Tip: Signs determine direction — get it wrong and you hit your own troops.' }] },
    storyConsequence: { correct: { zh: '炮火交叉——三维向量运用自如！', en: 'Crossfire Vectors — 3D mastery!' }, wrong: { zh: '正负号有点绕——标记每个数的符号再试？', en: 'Sign error... Try again!' } }
  },

  // --- Year 12 Unit 5: 积分面积 · 天下计量 ---
  {
    id: 1251, grade: 12, unitId: 5, order: 1,
    unitTitle: { zh: "Unit 5: 天下计量·积分面积", en: "Unit 5: Grand Measurement — Integral Area" },
    topic: 'Calculus', type: 'INTEGRATION',
    title: { zh: '屯田面积', en: 'Farm Area' },
    skillName: { zh: '定积分求面积', en: 'Definite Integral for Area' },
    skillSummary: { zh: '$\\int_a^b f(x)\\,dx$ 求曲线下面积', en: '$\\int_a^b f(x)\\,dx$ for area under curve' },
    story: { zh: '天下归一后，司马炎重新丈量蜀地良田。一块田的边界由 $f(x) = x$ 描述，从 $x = 0$ 到 $x = 6$。用积分求面积。', en: 'After reunification, Sima Yan resurveys Shu farmland. A field boundary follows $f(x) = x$ from $x = 0$ to $x = 6$. Find the area using integration.' },
    description: { zh: '求 $\\int_0^6 x\\,dx$ 的值。', en: 'Evaluate $\\int_0^6 x\\,dx$.' },
    data: { lower: 0, upper: 6, func: 'x', generatorType: 'INTEGRATION_RANDOM' }, difficulty: 'Medium', reward: 550,
    kpId: 'kp-2.12-02', sectionId: 'algebra',
    discoverSteps: [
      {
        prompt: { zh: '一块三角形的田，底 $6$，高也是 $6$。面积你会算吗？', en: 'A triangular field: base $6$, height $6$. Can you find its area?' },
        type: 'input',
        acceptPattern: '^18$',
        onCorrect: { zh: '对！$\\frac{1}{2} \\times 6 \\times 6 = 18$。\n现在告诉你一个秘密：$\\int_0^6 x\\,dx$ 也等于 $18$！\n积分算的就是这个三角形的面积——微积分和几何在这里完美统一。', en: 'Yes! $\\frac{1}{2} \\times 6 \\times 6 = 18$.\nNow here is a secret: $\\int_0^6 x\\,dx$ also equals $18$!\nIntegration calculates this triangle\'s area — calculus and geometry unite here.' },
        onWrong: { zh: '三角形面积 = $\\frac{1}{2} \\times$ 底 $\\times$ 高 = $\\frac{1}{2} \\times 6 \\times 6 = 18$。\n巧妙的是，$\\int_0^6 x\\,dx$ 也给出同样的答案——积分就是精确版的面积公式。', en: 'Triangle area = $\\frac{1}{2} \\times$ base $\\times$ height = $\\frac{1}{2} \\times 6 \\times 6 = 18$.\nThe beauty is that $\\int_0^6 x\\,dx$ gives the same answer — integration is the precision version of area formulas.' },
        onSkip: { zh: '$\\frac{1}{2} \\times 6 \\times 6 = 18$。积分 $\\int_0^6 x\\,dx$ 也等于 18——几何和微积分的美妙联结。', en: '$\\frac{1}{2} \\times 6 \\times 6 = 18$. The integral $\\int_0^6 x\\,dx$ also equals 18 — a beautiful connection between geometry and calculus.' },
      },
    ],
    tutorialSteps: [
      { text: { zh: '司马炎："为什么积分能算面积？\n面积 = 无数条极细的竖线加起来。每条线高度 $f(x)$，宽度 $dx$。\n$\\int_a^b f(x)\\,dx$ 就是把所有这些极细矩形加起来——这就是积分的几何含义。\n积分不是抽象公式，它是精确测量不规则形状面积的工具！"', en: 'Sima Yan: "Why does integration calculate area?\nArea = sum of infinitely thin vertical strips. Each strip has height $f(x)$ and width $dx$.\n$\\int_a^b f(x)\\,dx$ adds all these infinitesimal rectangles — that\'s the geometric meaning of integration.\nIntegration isn\'t abstract — it precisely measures areas of irregular shapes!"' }, highlightField: 'area' },
      { text: { zh: '司马炎："积分步骤：先求反导数\n$f(x) = x$ 的反导数（不定积分）：\n$$\\int x\\,dx = \\frac{x^2}{2} + C$$\n"反导数"就是"谁的导数等于 $x$？"——答案是 $\\frac{x^2}{2}$。"', en: 'Sima Yan: "Integration step 1: find the antiderivative\nThe antiderivative of $f(x) = x$:\n$$\\int x\\,dx = \\frac{x^2}{2} + C$$\n\'Antiderivative\' means \'whose derivative gives $x$?\' — the answer is $\\frac{x^2}{2}$."' }, highlightField: 'area' },
      { text: { zh: '司马炎："代入上下界\n$$\\int_0^6 x\\,dx = \\left[\\frac{x^2}{2}\\right]_0^6 = \\frac{6^2}{2} - \\frac{0^2}{2}$$"', en: 'Sima Yan: "Substitute the bounds\n$$\\int_0^6 x\\,dx = \\left[\\frac{x^2}{2}\\right]_0^6 = \\frac{6^2}{2} - \\frac{0^2}{2}$$"' }, highlightField: 'area' },
      { text: { zh: '司马炎："计算\n$= \\frac{36}{2} - \\frac{0}{2} = 18 - 0 = 18$"', en: 'Sima Yan: "Calculate\n$= \\frac{36}{2} - \\frac{0}{2} = 18 - 0 = 18$"' }, highlightField: 'area' },
      { text: { zh: '司马炎："答案\n面积 $= 18$ 平方单位\n屯田面积丈量完毕！"', en: 'Sima Yan: "Answer\nArea $= 18$ square units\nFarmland survey complete!"' }, highlightField: 'area' },
      { text: { zh: '司马炎："验算\n$f(x) = x$ 从 $0$ 到 $6$ 围成直角三角形：底 $= 6$，高 $= 6$。\n面积 $= \\frac{1}{2} \\times 6 \\times 6 = 18$ ✓\n和积分结果一致——对于简单形状，积分和几何公式殊途同归！"', en: 'Sima Yan: "Verify\n$f(x) = x$ from $0$ to $6$ forms a right triangle: base $= 6$, height $= 6$.\nArea $= \\frac{1}{2} \\times 6 \\times 6 = 18$ ✓\nMatches the integral — for simple shapes, integration and geometry agree!"' }, highlightField: 'area' },
    ],
    secret: { concept: { zh: '定积分 = 反导数代入上界减去下界。$\\int x\\,dx = x^2/2$。', en: 'Definite integral = antiderivative at upper bound minus lower bound.' }, formula: '$\\int_0^6 x\\,dx = \\left[\\frac{x^2}{2}\\right]_0^6 = 18$', tips: [{ zh: '司马炎提示：对于 $y = x$，积分面积就是三角形面积——可以互相验证！', en: 'Sima Yan Tip: For $y = x$, the integral equals triangle area — use one to check the other!' }] },
    storyConsequence: { correct: { zh: '屯田面积——积分精准！做得漂亮！', en: 'Farm Area — Integration perfect!' }, wrong: { zh: '积分计算有误…再试一次！', en: 'Integration error... Try again!' } }
  },
  {
    id: 1252, grade: 12, unitId: 5, order: 2,
    unitTitle: { zh: "Unit 5: 天下计量·积分面积", en: "Unit 5: Grand Measurement — Integral Area" },
    topic: 'Calculus', type: 'INTEGRATION',
    title: { zh: '城墙曲面', en: 'Curved Rampart' },
    skillName: { zh: '多项式积分', en: 'Polynomial Integration' },
    skillSummary: { zh: '$\\int 3x^2\\,dx = x^3$', en: '$\\int 3x^2\\,dx = x^3$' },
    story: { zh: '重修洛阳城墙，截面曲线为 $f(x) = 3x^2$。从 $x = 0$ 到 $x = 3$，求截面面积。', en: 'Rebuilding Luoyang walls. Cross-section curve: $f(x) = 3x^2$. Find the area from $x = 0$ to $x = 3$.' },
    description: { zh: '求 $\\int_0^3 3x^2\\,dx$ 的值。', en: 'Evaluate $\\int_0^3 3x^2\\,dx$.' },
    data: { lower: 0, upper: 3, func: '3x^2', generatorType: 'INTEGRATION_RANDOM' }, difficulty: 'Hard', reward: 600,
    kpId: 'kp-2.12-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么要积分求面积？\n城墙截面不是矩形——是曲线。\n"长 × 宽"只能算方块面积，曲线下面积只有积分能算。\n重修洛阳城墙，每一寸材料都要精确计算。', en: 'Sima Yan: "Why integrate for area?\nThe wall cross-section isn\'t rectangular — it\'s curved.\n\'Length × width\' only works for rectangles. Curved areas need integration.\nRebuilding Luoyang\'s walls demands precision in every inch of material."' }, highlightField: 'area' },
      { text: { zh: '司马炎："幂函数积分公式\n$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$$\n对 $3x^2$：$n = 2$，所以 $\\frac{3x^3}{3} = x^3$。"', en: 'Sima Yan: "Power rule formula\n$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$$\nFor $3x^2$: $n = 2$, so $\\frac{3x^3}{3} = x^3$."' }, highlightField: 'area' },
      { text: { zh: '司马炎："代入上下界\n$$\\int_0^3 3x^2\\,dx = \\left[x^3\\right]_0^3 = 3^3 - 0^3$$"', en: 'Sima Yan: "Substitute bounds\n$$\\int_0^3 3x^2\\,dx = \\left[x^3\\right]_0^3 = 3^3 - 0^3$$"' }, highlightField: 'area' },
      { text: { zh: '司马炎："计算\n$= 27 - 0 = 27$"', en: 'Sima Yan: "Calculate\n$= 27 - 0 = 27$"' }, highlightField: 'area' },
      { text: { zh: '司马炎："答案\n城墙截面面积 $= 27$ 平方单位"', en: 'Sima Yan: "Answer\nWall cross-section area $= 27$ square units"' }, highlightField: 'area' },
      { text: { zh: '司马炎："验算\n反向验证：$(x^3)\' = 3x^2$ ✓ （反导数的导数 = 原函数）\n$27 > 0$ ✓ （面积为正）\n积分完成——洛阳城墙重修方案确定！"', en: 'Sima Yan: "Verify\nReverse check: $(x^3)\' = 3x^2$ ✓ (derivative of antiderivative = original function)\n$27 > 0$ ✓ (area is positive)\nIntegration done — Luoyang wall reconstruction plan confirmed!"' }, highlightField: 'area' },
    ],
    secret: { concept: { zh: '$\\int 3x^2\\,dx = x^3$：系数和幂的积分抵消，巧妙至极。', en: '$\\int 3x^2\\,dx = x^3$: the coefficient and power integration cancel beautifully.' }, formula: '$\\int_0^3 3x^2\\,dx = [x^3]_0^3 = 27$', tips: [{ zh: '司马炎提示：积分后求导应该还原原函数——这是最可靠的验算方法。', en: 'Sima Yan Tip: Differentiating the integral should give back the original — the most reliable check.' }] },
    storyConsequence: { correct: { zh: '城墙曲面——多项式积分精准！做得漂亮！', en: 'Curved Rampart — Polynomial integration mastered!' }, wrong: { zh: '积分差一步——指数加 1，再除以新指数。', en: 'Integration formula error... Try again!' } }
  },
  {
    id: 1253, grade: 12, unitId: 5, order: 3,
    unitTitle: { zh: "Unit 5: 天下计量·积分面积", en: "Unit 5: Grand Measurement — Integral Area" },
    topic: 'Calculus', type: 'INTEGRATION',
    title: { zh: '四次幂堆积', en: 'Quartic Accumulation' },
    skillName: { zh: '高次积分术', en: 'Higher Power Integration' },
    skillSummary: { zh: '$\\int 4x^3\\,dx = x^4$', en: '$\\int 4x^3\\,dx = x^4$' },
    story: { zh: '城防加固的材料消耗率为 $4x^3$。从起点到终点的总消耗量是多少？', en: 'Fortification material consumption rate is $4x^3$. Find total consumption from start to end.' },
    description: { zh: '求 $\\int_0^b 4x^3\\,dx$ 的值。', en: 'Evaluate $\\int_0^b 4x^3\\,dx$.' },
    data: { lower: 0, upper: 3, func: '4x^3', generatorType: 'INTEGRATION_RANDOM' }, difficulty: 'Hard', reward: 620,
    kpId: 'kp-2.12-02', sectionId: 'calculus',
    tutorialSteps: [
      { text: { zh: '司马炎：为什么要学高次积分？\n城防加固不是线性的——材料消耗随进度呈指数增长。\n$4x^3$ 意味着越到后面，消耗越恐怖。\n只有积分才能精确算出总消耗。', en: 'Sima Yan: "Why learn higher power integration?\nFortification isn\'t linear — material consumption grows exponentially.\n$4x^3$ means the further you go, the more terrifying the cost.\nOnly integration can precisely calculate the total."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：幂规则（积分版）\n$$\\int ax^n\\,dx = \\frac{a}{n+1}x^{n+1} + C$$\n指数加 $1$，除以新指数。\n$n = 3$ 时：$\\frac{4}{3+1}x^{3+1} = \\frac{4}{4}x^4 = x^4$', en: 'Sima Yan: "Power rule (integration)\n$$\\int ax^n\\,dx = \\frac{a}{n+1}x^{n+1} + C$$\nAdd 1 to power, divide by new power.\nFor $n=3$: $\\frac{4}{3+1}x^{3+1} = \\frac{4}{4}x^4 = x^4$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：求不定积分\n$\\int 4x^3\\,dx = x^4 + C$\n系数 $4$ 和新指数 $4$ 正好抵消！', en: 'Sima Yan: "Antiderivative\n$\\int 4x^3\\,dx = x^4 + C$\nCoefficient 4 and new exponent 4 cancel perfectly!"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：代入上下限\n$[x^4]_0^3 = 3^4 - 0^4$\n$= 81 - 0$', en: 'Sima Yan: "Apply bounds\n$[x^4]_0^3 = 3^4 - 0^4$\n$= 81 - 0$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：答案\n总消耗量 $= 81$ 单位。', en: 'Sima Yan: "Answer\nTotal consumption $= 81$ units."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：验算\n$(x^4)\' = 4x^3$ ✓ 导回原函数！\n$3^4 = 81$：$3 \\times 3 = 9$，$9 \\times 9 = 81$ ✓', en: 'Sima Yan: "Verify\n$(x^4)\' = 4x^3$ ✓ Differentiates back!\n$3^4 = 81$: $3 \\times 3 = 9$, $9 \\times 9 = 81$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '$\\int 4x^3\\,dx = x^4 + C$。四次幂增长极快——幂规则照样适用。', en: '$\\int 4x^3\\,dx = x^4 + C$. Fourth powers grow rapidly — power rule still applies.' }, formula: '$\\int 4x^3\\,dx = x^4 + C$', tips: [{ zh: '司马炎提示：$4 \\div 4 = 1$，系数正好抵消！', en: 'Sima Yan Tip: $4 \\div 4 = 1$, the coefficient cancels perfectly!' }] },
    storyConsequence: { correct: { zh: '四次幂堆积——高次积分完成！', en: 'Quartic Accumulation — Higher integration done!' }, wrong: { zh: '高次积分公式有误…再试一次！', en: 'Higher power integration error... Try again!' } }
  },
];
