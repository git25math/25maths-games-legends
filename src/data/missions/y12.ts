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
    tutorialSteps: [
      {
        text: { zh: '刘禅：为什么要找“最稳的防线”？\n城墙受力不会处处一样——有的地方压力大，有的地方压力最小。\n补强材料要先送到“压力最低的转折点”，才能用最少兵力守住成都。\n导数就是帮我们找到这个关键位置的工具。', en: 'Liu Shan: "Why find the most stable part of the wall?\nThe stress on the wall is not the same everywhere — some spots take more pressure, some take the least.\nReinforcements must go to the turning point with the LOWEST stress, so Chengdu can be defended with the least cost.\nDerivatives help us find that key position."' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅：把图像想成一条山路\n走向谷底时，坡度会从负数慢慢变成 $0$；过了谷底，又从 $0$ 变回正数。\n所以“最低点”那一瞬间，切线会暂时变平，也就是导数 = $0$。\n先找导数为 $0$ 的位置，再确认它是不是极小值点。', en: 'Liu Shan: "Think of the graph as a mountain path\nAs you walk down into a valley, the slope goes from negative to $0$; after the valley, it changes from $0$ to positive.\nSo at the LOWEST point, the tangent briefly becomes flat, which means derivative = $0$.\nFirst find where the derivative is $0$, then confirm it is really a minimum."' },
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
    storyConsequence: { correct: { zh: '最后的防线——导数精准！做得漂亮！', en: 'The Final Stand — Well done!' }, wrong: { zh: '导数计算有误…再试一次！', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '胜率评估——概率算准！做得漂亮！', en: 'Win Rate Assessment — Well done!' }, wrong: { zh: '概率算偏了…再试一次！', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '三国均势——联立方程求解成功！做得漂亮！', en: 'Balance of Power — Well done!' }, wrong: { zh: '联立方程解错了…再试一次！', en: 'Not quite... Try again!' } }
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
      { text: { zh: '司马炎：函数是什么？\n函数就是一台"输入→输出"的机器。\n给它一个 $x$，它吐出一个 $f(x)$。\n$f(5)$ 就是把 $5$ 塞进机器看出来什么。', en: 'Sima Yan: "What\'s a function?\nA function is an input→output machine.\nGive it an $x$, it gives back $f(x)$.\n$f(5)$ means feed 5 into the machine and see what comes out."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：代入法\n$f(x) = 2x^2 - 3x + 1$\n$f(5)$ = 把所有 $x$ 换成 $5$。\n注意：$x^2$ 是"先平方再乘系数"，不是"先乘系数再平方"！', en: 'Sima Yan: "Substitution\n$f(x) = 2x^2 - 3x + 1$\n$f(5)$ = replace every $x$ with 5.\nNote: $x^2$ means \'square first, then multiply by coefficient\'!"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：逐项代入\n$f(5) = 2(5)^2 - 3(5) + 1$\n$= 2 \\times 25 - 15 + 1$', en: 'Sima Yan: "Substitute term by term\n$f(5) = 2(5)^2 - 3(5) + 1$\n$= 2 \\times 25 - 15 + 1$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：计算\n$= 50 - 15 + 1 = 36$', en: 'Sima Yan: "Calculate\n$= 50 - 15 + 1 = 36$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：答案\n$f(5) = {answer}$\n第五年魏国国力值！', en: 'Sima Yan: "Answer\n$f(5) = {answer}$\nWei\'s power in year 5!"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：验算\n用计算器验证：$2 \\times 25 = 50$，$50 - 15 = 35$，$35 + 1 = 36$ ✓', en: 'Sima Yan: "Verify\nCalculator check: $2 \\times 25 = 50$, $50 - 15 = 35$, $35 + 1 = 36$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '函数求值：把 x 的值代入每一项，按运算顺序计算。', en: 'Function evaluation: substitute x into each term, follow order of operations.' }, formula: '$f(x) = ax^2 + bx + c$', tips: [{ zh: '司马炎提示：x 换数字，一项一项算。', en: 'Sima Yan Tip: Replace x with the number, calculate term by term.' }] },
    storyConsequence: { correct: { zh: '国力函数——函数值正确！做得漂亮！', en: 'National Power Function — Well done!' }, wrong: { zh: '函数值代入有误…再试一次！', en: 'Not quite... Try again!' } }
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
      { text: { zh: '司马炎：三年所学，此刻汇聚\n从 Y9 的 SOH-CAH-TOA 到 Y11 的正弦余弦定理——你已经走过了完整的三角旅程。\n这最后一题，用最基本的 tan，但心境已不同。', en: 'Sima Yan: "Three years of learning converge here\nFrom Y9\'s SOH-CAH-TOA to Y11\'s sine and cosine rules — you\'ve completed the full trig journey.\nThis final problem uses basic tan, but your understanding is now complete."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：正切 = 对边 ÷ 邻边\n$\\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}}$\n瞭望塔高度（对边）和敌军水平距离（邻边）的关系。', en: 'Sima Yan: "Tangent = opposite ÷ adjacent\n$\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$\nRelationship between tower height (opposite) and enemy distance (adjacent)."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：代入\n$\\tan {angle}° = \\frac{x}{{adj}}$\n$x = {adj} \\times \\tan {angle}°$', en: 'Sima Yan: "Substitute\n$\\tan {angle}° = \\frac{x}{{adj}}$\n$x = {adj} \\times \\tan {angle}°$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：计算\n$\\tan {angle}° = {tan_val}$\n$x = {adj} \\times {tan_val} = {answer}$', en: 'Sima Yan: "Calculate\n$\\tan {angle}° = {tan_val}$\n$x = {adj} \\times {tan_val} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '司马炎：答案\n$x = {answer}$\n天下归一。三国故事到此终章。', en: 'Sima Yan: "Answer\n$x = {answer}$\nThe realm is reunited. The Three Kingdoms saga ends here."' }, highlightField: 'ans' },
      { text: { zh: '司马炎：验算\n$\\frac{{answer}}{{adj}} = \\tan {angle}°$ ✓\n\n"天下大势，合久必分，分久必合。"\n—— 你的数学之旅，才刚刚开始。', en: 'Sima Yan: "Verify\n$\\frac{{answer}}{{adj}} = \\tan {angle}°$ ✓\n\n"The world unites after division, divides after union."\n— Your math journey has just begun."' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'tan θ = 对边/邻边。三国故事结束，数学旅途永远在路上。', en: 'tan θ = opp/adj. The Three Kingdoms end, but the math journey continues forever.' }, formula: '$\\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}$', tips: [{ zh: '司马炎提示：天下大势，合久必分，分久必合。你的数学之路，永远不会结束。', en: 'Sima Yan Tip: The world unites and divides. Your math journey never ends.' }] },
    storyConsequence: { correct: { zh: '最终防线——三角精准！做得漂亮！', en: 'The Final Defense — Well done!' }, wrong: { zh: '三角函数算错了…再试一次！', en: 'Not quite... Try again!' } }
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
    kpId: 'kp-4.11-01', sectionId: 'geometry',
    tutorialSteps: [],
    secret: { concept: { zh: '三维向量加法：分量分别相加，和二维一模一样。', en: '3D vector addition: add components separately, just like 2D.' }, formula: '$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$', tips: [{ zh: '司马昭提示：三维也不过是多加一个分量而已。', en: 'Sima Zhao Tip: 3D is just one more component to add.' }] },
    storyConsequence: { correct: { zh: '空间行军——三维向量精准！做得漂亮！', en: 'Spatial March — 3D vectors nailed!' }, wrong: { zh: '分量加错了…再试一次！', en: 'Component error... Try again!' } }
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
    kpId: 'kp-4.11-01', sectionId: 'geometry',
    tutorialSteps: [],
    secret: { concept: { zh: '负分量表示反方向。加法时正负抵消，方向由符号决定。', en: 'Negative components mean opposite direction. Addition cancels positives with negatives.' }, formula: '$\\vec{a}+\\vec{b} = \\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\\\a_3+b_3\\end{pmatrix}$', tips: [{ zh: '姜维提示：正负号决定方向——算错方向，弩箭就射到自己人了。', en: 'Jiang Wei Tip: Signs determine direction — get it wrong and you hit your own troops.' }] },
    storyConsequence: { correct: { zh: '炮火交叉——三维向量运用自如！', en: 'Crossfire Vectors — 3D mastery!' }, wrong: { zh: '正负号算错了…再试一次！', en: 'Sign error... Try again!' } }
  }
];
