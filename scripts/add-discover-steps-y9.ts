/**
 * Add discoverSteps to Y9 missions (all 74).
 * Run: npx tsx scripts/add-discover-steps-y9.ts
 */
import * as fs from 'fs';
import * as path from 'path';

type DS = { prompt: {zh:string;en:string}; type:'choice'; choices:{zh:string;en:string}[]; onCorrect:{zh:string;en:string}; onWrong:{zh:string;en:string}; onSkip:{zh:string;en:string} };

const STEPS: Record<number, DS[]> = {
  // === Unit 1: 指数运算 ===
  912: [{
    prompt: { zh: '粮仓要扩建！$a^3 \\times a^4$ 怎么算？为什么底数不变？', en: 'Expanding the granary! How to calculate $a^3 \\times a^4$? Why does the base stay the same?' },
    type: 'choice',
    choices: [
      { zh: '$a^{3+4} = a^7$——同底数幂相乘，指数相加', en: '$a^{3+4} = a^7$ — same base, add exponents' },
      { zh: '$a^{3 \\times 4} = a^{12}$', en: '$a^{3 \\times 4} = a^{12}$' },
    ],
    onCorrect: { zh: '同底数幂相乘，底数不变，指数相加：$a^m \\times a^n = a^{m+n}$。\n本质：$a^3 = a \\cdot a \\cdot a$，$a^4 = a \\cdot a \\cdot a \\cdot a$，合起来 7 个 $a$ 相乘。', en: 'Same base multiplication: keep base, add exponents: $a^m \\times a^n = a^{m+n}$.\nWhy? $a^3 = a \\cdot a \\cdot a$, $a^4 = a \\cdot a \\cdot a \\cdot a$, together = 7 copies of $a$.' },
    onWrong: { zh: '指数相乘是幂的幂：$(a^3)^4 = a^{12}$。同底相乘是指数相加！\n$a^3 \\times a^4 = a^{3+4} = a^7$', en: 'Multiplying exponents is power of power: $(a^3)^4 = a^{12}$. Same base multiplication adds exponents!\n$a^3 \\times a^4 = a^{3+4} = a^7$' },
    onSkip: { zh: '同底数幂相乘：$a^m \\times a^n = a^{m+n}$。底数不变，指数相加。', en: 'Same base multiplication: $a^m \\times a^n = a^{m+n}$. Keep base, add exponents.' },
  }],
  913: [{
    prompt: { zh: '火烧乌巢！$a^7 \\div a^3$ 怎么算？', en: 'Burning Wuchao! How to calculate $a^7 \\div a^3$?' },
    type: 'choice',
    choices: [
      { zh: '$a^{7-3} = a^4$——同底数幂相除，指数相减', en: '$a^{7-3} = a^4$ — same base, subtract exponents' },
      { zh: '$a^{7+3} = a^{10}$', en: '$a^{7+3} = a^{10}$' },
    ],
    onCorrect: { zh: '同底数幂相除：$a^m \\div a^n = a^{m-n}$。\n7 个 $a$ 除以 3 个 $a$，消掉 3 个，剩 4 个。', en: 'Same base division: $a^m \\div a^n = a^{m-n}$.\n7 copies of $a$ divided by 3, cancel 3, leaves 4.' },
    onWrong: { zh: '相加是乘法的规则！除法要减：$a^7 \\div a^3 = a^{7-3} = a^4$。', en: 'Adding is the multiplication rule! Division subtracts: $a^7 \\div a^3 = a^{7-3} = a^4$.' },
    onSkip: { zh: '同底数幂相除：$a^m \\div a^n = a^{m-n}$。除法 = 指数相减。', en: 'Same base division: $a^m \\div a^n = a^{m-n}$. Division = subtract exponents.' },
  }],

  // === Unit 2: 三角函数 & 勾股 ===
  922: [{
    prompt: { zh: '望楼上观察敌营。已知对面城墙高(对边)和你到城墙的距离(邻边)。用哪个三角比？', en: 'From the watchtower, you see the enemy wall. Given the wall height (opposite) and your distance (adjacent). Which trig ratio?' },
    type: 'choice',
    choices: [
      { zh: '$\\tan\\theta = \\frac{\\text{对边}}{\\text{邻边}}$', en: '$\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$' },
      { zh: '$\\sin\\theta = \\frac{\\text{对边}}{\\text{斜边}}$', en: '$\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$' },
    ],
    onCorrect: { zh: 'SOH-CAH-TOA！有对边和邻边 → 用 $\\tan$。\n$\\tan\\theta = \\frac{O}{A}$。没有斜边参与时，tan 是你的武器。', en: 'SOH-CAH-TOA! Opposite and adjacent → use $\\tan$.\n$\\tan\\theta = \\frac{O}{A}$. When hypotenuse isn\'t involved, tan is your tool.' },
    onWrong: { zh: '$\\sin$ 需要斜边，但这里只有对边和邻边。\n$\\tan\\theta = \\frac{\\text{对边}}{\\text{邻边}}$——TOA！', en: '$\\sin$ needs the hypotenuse, but we only have opposite and adjacent.\n$\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$ — TOA!' },
    onSkip: { zh: 'SOH-CAH-TOA：对/邻 → tan，对/斜 → sin，邻/斜 → cos。', en: 'SOH-CAH-TOA: O/A → tan, O/H → sin, A/H → cos.' },
  }],
  923: [{
    prompt: { zh: '地道突袭！直角三角形两条短边是 3 和 4，斜边多长？', en: 'Tunnel raid! Right triangle with legs 3 and 4. How long is the hypotenuse?' },
    type: 'choice',
    choices: [
      { zh: '$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$', en: '$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$' },
      { zh: '$3 + 4 = 7$', en: '$3 + 4 = 7$' },
    ],
    onCorrect: { zh: '勾股定理：$c^2 = a^2 + b^2$。$c = \\sqrt{9+16} = 5$。\n3-4-5 是最经典的勾股三元组！', en: 'Pythagoras: $c^2 = a^2 + b^2$. $c = \\sqrt{9+16} = 5$.\n3-4-5 is the most classic Pythagorean triple!' },
    onWrong: { zh: '边长不能直接相加求斜边！要用勾股定理。\n$c = \\sqrt{a^2+b^2} = \\sqrt{9+16} = 5$', en: 'You can\'t just add sides for the hypotenuse! Use Pythagoras.\n$c = \\sqrt{a^2+b^2} = \\sqrt{9+16} = 5$' },
    onSkip: { zh: '勾股定理：$c = \\sqrt{a^2+b^2}$。求短边：$a = \\sqrt{c^2-b^2}$。', en: 'Pythagoras: $c = \\sqrt{a^2+b^2}$. For a leg: $a = \\sqrt{c^2-b^2}$.' },
  }],

  // === Unit 3: 相似 ===
  932: [{
    prompt: { zh: '地图比例尺 1:50000。图上 3cm 代表实际多远？', en: 'Map scale 1:50000. A 3cm line on the map represents what real distance?' },
    type: 'choice',
    choices: [
      { zh: '$3 \\times 50000 = 150000$ cm $= 1.5$ km', en: '$3 \\times 50000 = 150000$ cm $= 1.5$ km' },
      { zh: '$50000 \\div 3$ cm', en: '$50000 \\div 3$ cm' },
    ],
    onCorrect: { zh: '比例尺 = 图上:实际。1:50000 意味着图上 1cm = 实际 50000cm。\n图上 3cm → $3 \\times 50000 = 150000$ cm $= 1500$ m $= 1.5$ km。', en: 'Scale = map:real. 1:50000 means 1cm on map = 50000cm in reality.\n3cm on map → $3 \\times 50000 = 150000$ cm $= 1500$ m $= 1.5$ km.' },
    onWrong: { zh: '比例尺是乘法关系！图上距离 × 比例尺 = 实际距离。\n$3 \\times 50000 = 150000$ cm $= 1.5$ km', en: 'Scale is multiplicative! Map distance × scale factor = real distance.\n$3 \\times 50000 = 150000$ cm $= 1.5$ km' },
    onSkip: { zh: '比例尺 1:n → 图上 × n = 实际距离。注意单位换算。', en: 'Scale 1:n → map distance × n = real distance. Watch unit conversion.' },
  }],
  933: [{
    prompt: { zh: '两棵树的影子和树高成比例。小树高 2m 影长 3m，大树影长 9m。大树多高？', en: 'Tree shadows are proportional to height. Small tree: 2m tall, 3m shadow. Big tree: 9m shadow. How tall?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{2}{3} = \\frac{h}{9}$，$h = 6$ m', en: '$\\frac{2}{3} = \\frac{h}{9}$, $h = 6$ m' },
      { zh: '$2 + 9 = 11$ m', en: '$2 + 9 = 11$ m' },
    ],
    onCorrect: { zh: '相似三角形的对应边成比例！\n$\\frac{\\text{高}_1}{\\text{影}_1} = \\frac{\\text{高}_2}{\\text{影}_2}$\n$\\frac{2}{3} = \\frac{h}{9}$ → $h = 6$ m', en: 'Similar triangles have proportional corresponding sides!\n$\\frac{height_1}{shadow_1} = \\frac{height_2}{shadow_2}$\n$\\frac{2}{3} = \\frac{h}{9}$ → $h = 6$ m' },
    onWrong: { zh: '不是加法！相似三角形用比例。$\\frac{2}{3} = \\frac{h}{9}$，交叉相乘得 $h = 6$。', en: 'Not addition! Similar triangles use proportions. $\\frac{2}{3} = \\frac{h}{9}$, cross multiply → $h = 6$.' },
    onSkip: { zh: '相似三角形：对应边比例相等。列比例方程，交叉相乘求解。', en: 'Similar triangles: corresponding sides in proportion. Set up ratio, cross multiply.' },
  }],
  934: [{
    prompt: { zh: '如何判断两个三角形相似？', en: 'How to determine if two triangles are similar?' },
    type: 'choice',
    choices: [
      { zh: '对应角相等（AA准则就够）', en: 'Corresponding angles equal (AA criterion is enough)' },
      { zh: '对应边相等', en: 'Corresponding sides equal' },
    ],
    onCorrect: { zh: '两组角相等就能判定相似（第三组角自动确定）。\n相似 ≠ 全等：形状相同但大小可以不同。\n对应边成比例，比例系数 $k$ 叫做相似比。', en: 'Two pairs of equal angles → similar (third angle automatically determined).\nSimilar ≠ congruent: same shape but can differ in size.\nCorresponding sides in ratio, the scale factor $k$.' },
    onWrong: { zh: '对应边相等是全等(SSS)，不是相似！\n相似只需要形状相同：AA（两角相等）就足够了。', en: 'Equal corresponding sides means congruent (SSS), not similar!\nSimilar only needs same shape: AA (two equal angles) is enough.' },
    onSkip: { zh: 'AA 准则：两角相等 → 相似。相似三角形对应边成比例。', en: 'AA criterion: two equal angles → similar. Similar triangles have proportional sides.' },
  }],

  // === Unit 4: 比例 ===
  942: [{
    prompt: { zh: '曹操将 600 名士兵按 2:3:5 分配到三个阵地。每个阵地各多少人？', en: 'Cao Cao splits 600 soldiers in ratio 2:3:5 across three positions. How many at each?' },
    type: 'choice',
    choices: [
      { zh: '总份数 $2+3+5=10$，每份 60 人 → 120:180:300', en: 'Total parts $2+3+5=10$, each part 60 → 120:180:300' },
      { zh: '直接除以 3，每阵地 200 人', en: 'Divide by 3, 200 each' },
    ],
    onCorrect: { zh: '比例分配三步走：\n1. 加总份数：$2+3+5=10$\n2. 每份 = $600 \\div 10 = 60$\n3. 各组 = $2 \\times 60, 3 \\times 60, 5 \\times 60$', en: 'Ratio sharing in 3 steps:\n1. Total parts: $2+3+5=10$\n2. Each part = $600 \\div 10 = 60$\n3. Each group = $2 \\times 60, 3 \\times 60, 5 \\times 60$' },
    onWrong: { zh: '等分是 1:1:1。比例 2:3:5 意味着分配不均。\n总份数 = $2+3+5 = 10$，每份 = $600 \\div 10 = 60$。', en: 'Equal split is 1:1:1. Ratio 2:3:5 means unequal shares.\nTotal parts = $2+3+5 = 10$, each part = $600 \\div 10 = 60$.' },
    onSkip: { zh: '比例分配：总份数 → 每份大小 → 各组 = 份数 × 每份。', en: 'Ratio sharing: total parts → value per part → each group = parts × value.' },
  }],

  // === Unit 5: 坐标与直线 ===
  951: [{
    prompt: { zh: '官渡战场上设暗桩，坐标 $(3, -2)$ 表示什么？', en: 'Setting traps at Guandu. What does coordinate $(3, -2)$ mean?' },
    type: 'choice',
    choices: [
      { zh: '从原点右走 3，下走 2', en: 'From origin: 3 right, 2 down' },
      { zh: '从原点下走 3，右走 2', en: 'From origin: 3 down, 2 right' },
    ],
    onCorrect: { zh: '坐标 $(x, y)$：$x$ 是水平(左右)，$y$ 是垂直(上下)。\n正 = 右/上，负 = 左/下。$(3,-2)$ = 右3下2。', en: 'Coordinate $(x, y)$: $x$ is horizontal (left/right), $y$ is vertical (up/down).\nPositive = right/up, negative = left/down. $(3,-2)$ = right 3, down 2.' },
    onWrong: { zh: '坐标顺序是"先 $x$ 后 $y$"——先水平再垂直。\n$(3, -2)$：$x=3$ 右走，$y=-2$ 下走。', en: 'Coordinate order is "x first, y second" — horizontal then vertical.\n$(3, -2)$: $x=3$ right, $y=-2$ down.' },
    onSkip: { zh: '$(x,y)$：$x$ 先走(水平)，$y$ 后走(垂直)。正=右/上，负=左/下。', en: '$(x,y)$: $x$ first (horizontal), $y$ second (vertical). Positive = right/up, negative = left/down.' },
  }],
  952: [{
    prompt: { zh: '密道的路径是 $y = 2x + 3$。"2"和"3"分别代表什么？', en: 'The tunnel path is $y = 2x + 3$. What do "2" and "3" represent?' },
    type: 'choice',
    choices: [
      { zh: '2 是斜率(坡度)，3 是 $y$ 轴截距', en: '2 is the gradient (slope), 3 is the y-intercept' },
      { zh: '2 是截距，3 是斜率', en: '2 is the intercept, 3 is the gradient' },
    ],
    onCorrect: { zh: '$y = mx + c$：$m$ 是斜率(每走 1 步升降多少)，$c$ 是起点($x=0$ 时的 $y$ 值)。\n斜率 2 = 每右移 1 单位，上升 2 单位。截距 3 = 从 $(0,3)$ 出发。', en: '$y = mx + c$: $m$ is gradient (rise per unit run), $c$ is y-intercept (y value when $x=0$).\nGradient 2 = rise 2 for every 1 right. Intercept 3 = starts at $(0,3)$.' },
    onWrong: { zh: '在 $y = mx + c$ 中，$x$ 前面的系数是斜率，常数项是截距。\n$y = 2x + 3$：$m=2$（斜率），$c=3$（截距）。', en: 'In $y = mx + c$, the coefficient of $x$ is the gradient, the constant is the intercept.\n$y = 2x + 3$: $m=2$ (gradient), $c=3$ (intercept).' },
    onSkip: { zh: '$y = mx + c$：$m$ = 斜率（$x$ 的系数），$c$ = $y$ 轴截距（常数项）。', en: '$y = mx + c$: $m$ = gradient (coefficient of $x$), $c$ = y-intercept (constant).' },
  }],
  953: [{
    prompt: { zh: '过 $(1, 5)$ 和 $(3, 11)$ 的直线，方程怎么求？', en: 'Line through $(1, 5)$ and $(3, 11)$. How to find the equation?' },
    type: 'choice',
    choices: [
      { zh: '先求斜率 $m = \\frac{11-5}{3-1} = 3$，再代入求 $c$', en: 'First find gradient $m = \\frac{11-5}{3-1} = 3$, then substitute to find $c$' },
      { zh: '直接把两个点加起来', en: 'Just add the two points together' },
    ],
    onCorrect: { zh: '两步求直线方程：\n1. $m = \\frac{y_2-y_1}{x_2-x_1} = \\frac{11-5}{3-1} = 3$\n2. 代入一点：$5 = 3(1) + c$ → $c = 2$\n方程：$y = 3x + 2$', en: 'Two steps to find line equation:\n1. $m = \\frac{y_2-y_1}{x_2-x_1} = \\frac{11-5}{3-1} = 3$\n2. Substitute one point: $5 = 3(1) + c$ → $c = 2$\nEquation: $y = 3x + 2$' },
    onWrong: { zh: '加点没有意义！先求斜率：$m = \\frac{\\Delta y}{\\Delta x}$，再代入一个点求截距。', en: 'Adding points is meaningless! First find gradient: $m = \\frac{\\Delta y}{\\Delta x}$, then substitute a point for intercept.' },
    onSkip: { zh: '求直线方程：先求斜率 $m = \\frac{y_2-y_1}{x_2-x_1}$，再用 $y=mx+c$ 代入一点求 $c$。', en: 'Line equation: gradient $m = \\frac{y_2-y_1}{x_2-x_1}$, then substitute a point into $y=mx+c$ for $c$.' },
  }],

  // === Unit 6: 平行线与截距 ===
  961: [{
    prompt: { zh: '两条密道平行意味着什么？$y=2x+1$ 和 $y=2x+5$ 的关系？', en: 'Two tunnels are parallel. What\'s the relationship between $y=2x+1$ and $y=2x+5$?' },
    type: 'choice',
    choices: [
      { zh: '斜率相同($m=2$)，截距不同', en: 'Same gradient ($m=2$), different intercepts' },
      { zh: '截距相同，斜率不同', en: 'Same intercept, different gradients' },
    ],
    onCorrect: { zh: '平行线 = 方向一样 = 斜率相同！\n$y=2x+1$ 和 $y=2x+5$ 都有 $m=2$，只是起点不同($c=1$ vs $c=5$)。\n平行线永不相交。', en: 'Parallel lines = same direction = same gradient!\n$y=2x+1$ and $y=2x+5$ both have $m=2$, just different starting points ($c=1$ vs $c=5$).\nParallel lines never intersect.' },
    onWrong: { zh: '平行 = 同一个方向 = 斜率相同。截距相同的话就是同一条线了！', en: 'Parallel = same direction = same gradient. Same intercept would be the same line!' },
    onSkip: { zh: '平行线：$m_1 = m_2$，截距不同。方向相同，永不相交。', en: 'Parallel lines: $m_1 = m_2$, different intercepts. Same direction, never meet.' },
  }],
  962: [{
    prompt: { zh: '补给起点：$y$ 轴截距是什么？怎么找？', en: 'Supply starting point: what is the y-intercept? How to find it?' },
    type: 'choice',
    choices: [
      { zh: '令 $x = 0$，算出的 $y$ 值就是截距', en: 'Set $x = 0$, the resulting $y$ value is the intercept' },
      { zh: '令 $y = 0$，算出的 $x$ 值', en: 'Set $y = 0$, the resulting $x$ value' },
    ],
    onCorrect: { zh: '$y$ 轴截距 = 直线穿过 $y$ 轴的点 = $x=0$ 时的 $y$ 值。\n在 $y = mx + c$ 中，$c$ 就是截距。\n令 $y=0$ 求的是 $x$ 轴截距（另一个概念）。', en: 'Y-intercept = where the line crosses the y-axis = $y$ value when $x=0$.\nIn $y = mx + c$, $c$ is the intercept.\nSetting $y=0$ gives the x-intercept (different concept).' },
    onWrong: { zh: '令 $y=0$ 求的是 $x$ 轴截距。$y$ 轴截距是令 $x=0$！\n在 $y=mx+c$ 中直接看常数项 $c$。', en: 'Setting $y=0$ gives x-intercept. Y-intercept is when $x=0$!\nIn $y=mx+c$, just read the constant $c$.' },
    onSkip: { zh: '$y$ 截距：令 $x=0$，或直接读 $y=mx+c$ 中的 $c$。', en: 'Y-intercept: set $x=0$, or read $c$ from $y=mx+c$.' },
  }],
  963: [{
    prompt: { zh: '两军会合！$A(2,6)$ 和 $B(8,4)$ 的中点在哪？', en: 'Two armies converge! Where is the midpoint of $A(2,6)$ and $B(8,4)$?' },
    type: 'choice',
    choices: [
      { zh: '$\\left(\\frac{2+8}{2}, \\frac{6+4}{2}\\right) = (5, 5)$', en: '$\\left(\\frac{2+8}{2}, \\frac{6+4}{2}\\right) = (5, 5)$' },
      { zh: '$(8-2, 6-4) = (6, 2)$', en: '$(8-2, 6-4) = (6, 2)$' },
    ],
    onCorrect: { zh: '中点 = 两端坐标各取平均。\n$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$\n就像两个人各走一半路程在中间会合。', en: 'Midpoint = average of each coordinate.\n$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$\nLike two people each walking halfway to meet in the middle.' },
    onWrong: { zh: '相减求的是向量/差值，不是中点。中点是取平均！\n$M = \\left(\\frac{2+8}{2}, \\frac{6+4}{2}\\right) = (5, 5)$', en: 'Subtraction gives the vector/difference, not midpoint. Midpoint is the average!\n$M = \\left(\\frac{2+8}{2}, \\frac{6+4}{2}\\right) = (5, 5)$' },
    onSkip: { zh: '中点公式：$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$。各坐标取平均。', en: 'Midpoint formula: $M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$. Average each coordinate.' },
  }],

  // === Unit 7: 不等式 & 标准式 ===
  973: [{
    prompt: { zh: '粮草不能低于底线！$3x - 5 > 7$ 怎么解？', en: 'Supplies can\'t drop below the line! How to solve $3x - 5 > 7$?' },
    type: 'choice',
    choices: [
      { zh: '像解方程一样移项：$3x > 12$，$x > 4$', en: 'Rearrange like an equation: $3x > 12$, $x > 4$' },
      { zh: '直接猜一个数试试', en: 'Just guess a number and try' },
    ],
    onCorrect: { zh: '不等式和方程的解法几乎一样！\n$3x - 5 > 7$ → $3x > 12$ → $x > 4$\n唯一陷阱：乘除负数时要翻转不等号方向。', en: 'Inequalities solve almost like equations!\n$3x - 5 > 7$ → $3x > 12$ → $x > 4$\nOnly trap: flip the sign when multiplying/dividing by a negative.' },
    onWrong: { zh: '猜测不可靠。不等式有系统解法——和方程一样移项！\n$3x - 5 > 7$ → $3x > 12$ → $x > 4$', en: 'Guessing is unreliable. Inequalities have systematic solutions — rearrange like equations!\n$3x - 5 > 7$ → $3x > 12$ → $x > 4$' },
    onSkip: { zh: '解不等式：像方程一样操作。注意：乘除负数时翻转不等号。', en: 'Solve inequalities: operate like equations. Warning: flip sign when multiplying/dividing by negative.' },
  }],
  974: [{
    prompt: { zh: '百万雄师！怎么用标准式写 45000？', en: 'A million-strong army! How to write 45000 in standard form?' },
    type: 'choice',
    choices: [
      { zh: '$4.5 \\times 10^4$', en: '$4.5 \\times 10^4$' },
      { zh: '$45 \\times 10^3$', en: '$45 \\times 10^3$' },
    ],
    onCorrect: { zh: '标准式：$a \\times 10^n$，其中 $1 \\leq a < 10$。\n$45000 = 4.5 \\times 10^4$（小数点移了 4 位）。\n$45 \\times 10^3$ 不是标准式，因为 45 不在 1~10 之间。', en: 'Standard form: $a \\times 10^n$ where $1 \\leq a < 10$.\n$45000 = 4.5 \\times 10^4$ (decimal moved 4 places).\n$45 \\times 10^3$ is NOT standard form because 45 is not between 1 and 10.' },
    onWrong: { zh: '$45 \\times 10^3$ 虽然等于 45000，但不是标准式！$a$ 必须在 1 到 10 之间。\n$4.5 \\times 10^4$ 才是正确的标准式。', en: '$45 \\times 10^3$ equals 45000 but isn\'t standard form! $a$ must be between 1 and 10.\n$4.5 \\times 10^4$ is the correct standard form.' },
    onSkip: { zh: '标准式：$a \\times 10^n$，$1 \\leq a < 10$。小数点移到第一位非零数字后面。', en: 'Standard form: $a \\times 10^n$, $1 \\leq a < 10$. Move decimal after first non-zero digit.' },
  }],

  // === Unit 8: 角度 ===
  981: [{
    prompt: { zh: '阵前两个角在同一条直线上。一个角是 $110°$，另一个呢？', en: 'Two angles on a straight line. One is $110°$, what\'s the other?' },
    type: 'choice',
    choices: [
      { zh: '$180° - 110° = 70°$', en: '$180° - 110° = 70°$' },
      { zh: '$360° - 110° = 250°$', en: '$360° - 110° = 250°$' },
    ],
    onCorrect: { zh: '直线上的角度之和 = $180°$（平角）。\n$180° - 110° = 70°$。\n$360°$ 是一整圈（周角），用于一个点周围所有角度之和。', en: 'Angles on a straight line sum to $180°$ (straight angle).\n$180° - 110° = 70°$.\n$360°$ is a full turn, used for angles around a point.' },
    onWrong: { zh: '$360°$ 是一整圈。直线只是半圈 = $180°$。\n另一个角 = $180° - 110° = 70°$。', en: '$360°$ is a full turn. A straight line is half turn = $180°$.\nOther angle = $180° - 110° = 70°$.' },
    onSkip: { zh: '直线上角度和 = $180°$。一点周围角度和 = $360°$。', en: 'Angles on line = $180°$. Angles around point = $360°$.' },
  }],
  982: [{
    prompt: { zh: '壕沟中两条平行线被一条直线截过。同位角有什么关系？', en: 'Two parallel lines cut by a transversal in the trench. What about corresponding angles?' },
    type: 'choice',
    choices: [
      { zh: '同位角相等', en: 'Corresponding angles are equal' },
      { zh: '同位角互补（和为 $180°$）', en: 'Corresponding angles are supplementary (sum to $180°$)' },
    ],
    onCorrect: { zh: '平行线截角三大定理：\n1. 同位角相等（F 型）\n2. 内错角相等（Z 型）\n3. 同旁内角互补（C 型，和为 $180°$）', en: 'Three parallel line angle theorems:\n1. Corresponding angles equal (F shape)\n2. Alternate angles equal (Z shape)\n3. Co-interior angles supplementary (C shape, sum $180°$)' },
    onWrong: { zh: '互补的是同旁内角(C型)，不是同位角！\n同位角(F型)和内错角(Z型)都是相等的。', en: 'Supplementary applies to co-interior angles (C shape), not corresponding!\nCorresponding (F) and alternate (Z) angles are equal.' },
    onSkip: { zh: '平行线：同位角相等(F)，内错角相等(Z)，同旁内角互补(C)。', en: 'Parallel lines: corresponding equal (F), alternate equal (Z), co-interior supplementary (C).' },
  }],
  983: [{
    prompt: { zh: '堡垒是正六边形。每个内角多少度？', en: 'The fortress is a regular hexagon. What is each interior angle?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{(6-2) \\times 180°}{6} = 120°$', en: '$\\frac{(6-2) \\times 180°}{6} = 120°$' },
      { zh: '$\\frac{360°}{6} = 60°$', en: '$\\frac{360°}{6} = 60°$' },
    ],
    onCorrect: { zh: '多边形内角和 = $(n-2) \\times 180°$。\n六边形：$(6-2) \\times 180° = 720°$。正六边形每个角：$720° \\div 6 = 120°$。\n$360° \\div n$ 求的是外角！', en: 'Polygon interior angle sum = $(n-2) \\times 180°$.\nHexagon: $(6-2) \\times 180° = 720°$. Regular hexagon each angle: $720° \\div 6 = 120°$.\n$360° \\div n$ gives the exterior angle!' },
    onWrong: { zh: '$360° \\div 6 = 60°$ 是外角！内角 = $180° - 60° = 120°$。\n或直接用公式：$\\frac{(n-2) \\times 180°}{n}$', en: '$360° \\div 6 = 60°$ is the exterior angle! Interior = $180° - 60° = 120°$.\nOr use formula: $\\frac{(n-2) \\times 180°}{n}$' },
    onSkip: { zh: '内角和 = $(n-2) \\times 180°$。正多边形每个内角 = 内角和 $\\div n$。外角 = $360° \\div n$。', en: 'Interior sum = $(n-2) \\times 180°$. Regular polygon each angle = sum $\\div n$. Exterior = $360° \\div n$.' },
  }],

  // === Unit 9: 速度与百分比 ===
  991: [{
    prompt: { zh: '行军 120km 用了 4 小时。平均速度多少？', en: 'Marched 120km in 4 hours. What\'s the average speed?' },
    type: 'choice',
    choices: [
      { zh: '$120 \\div 4 = 30$ km/h', en: '$120 \\div 4 = 30$ km/h' },
      { zh: '$120 \\times 4 = 480$ km/h', en: '$120 \\times 4 = 480$ km/h' },
    ],
    onCorrect: { zh: '速度 = 距离 ÷ 时间。$S = \\frac{D}{T}$\n三角形记忆法：D 在上，S 和 T 在下。\n遮住要求的量，剩下的就是算法。', en: 'Speed = Distance ÷ Time. $S = \\frac{D}{T}$\nTriangle method: D on top, S and T below.\nCover what you need, the rest shows the formula.' },
    onWrong: { zh: '乘法给的是"距离"！速度是除法：$S = \\frac{D}{T} = \\frac{120}{4} = 30$ km/h。', en: 'Multiplying gives "distance"! Speed is division: $S = \\frac{D}{T} = \\frac{120}{4} = 30$ km/h.' },
    onSkip: { zh: '$S = \\frac{D}{T}$，$D = S \\times T$，$T = \\frac{D}{S}$。速度 = 距离 ÷ 时间。', en: '$S = \\frac{D}{T}$, $D = S \\times T$, $T = \\frac{D}{S}$. Speed = Distance ÷ Time.' },
  }],
  992: [{
    prompt: { zh: '兵力 800 人增长 15%。现在多少人？', en: 'Army of 800 grows by 15%. How many now?' },
    type: 'choice',
    choices: [
      { zh: '$800 \\times 1.15 = 920$', en: '$800 \\times 1.15 = 920$' },
      { zh: '$800 + 15 = 815$', en: '$800 + 15 = 815$' },
    ],
    onCorrect: { zh: '增长 15% = 原来的 $100\\% + 15\\% = 115\\% = 1.15$ 倍。\n$800 \\times 1.15 = 920$\n乘数法：增 → $1 + \\frac{p}{100}$，减 → $1 - \\frac{p}{100}$', en: 'Increase 15% = $100\\% + 15\\% = 115\\% = 1.15$ of original.\n$800 \\times 1.15 = 920$\nMultiplier method: increase → $1 + \\frac{p}{100}$, decrease → $1 - \\frac{p}{100}$' },
    onWrong: { zh: '15% 不是加 15！百分比是相对于原数的。\n$15\\%$ of $800 = 120$。总数 $= 800 + 120 = 920$。或直接 $800 \\times 1.15$。', en: '15% doesn\'t mean add 15! Percentage is relative to the original.\n$15\\%$ of $800 = 120$. Total $= 800 + 120 = 920$. Or just $800 \\times 1.15$.' },
    onSkip: { zh: '百分比增减：乘数法。增 $p\\%$ → $\\times (1+\\frac{p}{100})$，减 → $\\times (1-\\frac{p}{100})$。', en: 'Percentage change: multiplier. Increase $p\\%$ → $\\times (1+\\frac{p}{100})$, decrease → $\\times (1-\\frac{p}{100})$.' },
  }],
  993: [{
    prompt: { zh: '涨薪 20% 后军饷是 ¥360。涨薪前是多少？', en: 'After a 20% pay rise, salary is ¥360. What was it before?' },
    type: 'choice',
    choices: [
      { zh: '$360 \\div 1.2 = 300$', en: '$360 \\div 1.2 = 300$' },
      { zh: '$360 - 20\\% \\times 360 = 288$', en: '$360 - 20\\% \\times 360 = 288$' },
    ],
    onCorrect: { zh: '反向百分比：已知变化后的值，求原值。\n涨 $20\\%$ → 乘数 $= 1.2$。反过来：$\\frac{360}{1.2} = 300$。\n陷阱：不能从 360 减 20%，因为 360 不是原始基数！', en: 'Reverse percentage: given the changed value, find original.\nIncrease 20% → multiplier $= 1.2$. Reverse: $\\frac{360}{1.2} = 300$.\nTrap: can\'t subtract 20% from 360, because 360 isn\'t the original base!' },
    onWrong: { zh: '陷阱！$360$ 的 $20\\%$ 是 $72$，但 $360$ 不是原价！\n原价 × $1.2 = 360$ → 原价 $= \\frac{360}{1.2} = 300$。\n验证：$300 \\times 1.2 = 360$ ✓', en: 'Trap! $20\\%$ of $360$ is $72$, but $360$ isn\'t the original!\nOriginal × $1.2 = 360$ → Original $= \\frac{360}{1.2} = 300$.\nCheck: $300 \\times 1.2 = 360$ ✓' },
    onSkip: { zh: '反向百分比：原值 = 变化后 ÷ 乘数。涨 $p\\%$ 的乘数 = $1+\\frac{p}{100}$。', en: 'Reverse percentage: original = changed value ÷ multiplier. Increase $p\\%$ multiplier = $1+\\frac{p}{100}$.' },
  }],

  // === Unit 10: 面积与体积 ===
  9101: [{
    prompt: { zh: '田亩是梯形。上底 5m，下底 9m，高 4m。面积多少？', en: 'The field is a trapezium. Top 5m, bottom 9m, height 4m. Area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{1}{2}(5+9) \\times 4 = 28$ m$^2$', en: '$\\frac{1}{2}(5+9) \\times 4 = 28$ m$^2$' },
      { zh: '$5 \\times 9 \\times 4 = 180$ m$^2$', en: '$5 \\times 9 \\times 4 = 180$ m$^2$' },
    ],
    onCorrect: { zh: '梯形面积 = $\\frac{1}{2}(a+b) \\times h$\n$(a+b)$ 是两条平行边之和，$h$ 是垂直高度。\n本质：两底取平均 × 高。', en: 'Trapezium area = $\\frac{1}{2}(a+b) \\times h$\n$(a+b)$ is sum of parallel sides, $h$ is perpendicular height.\nEssentially: average of parallel sides × height.' },
    onWrong: { zh: '三个数全部相乘是长方体体积的思路！梯形面积需要平均两底。\n$\\frac{1}{2}(5+9) \\times 4 = 28$ m$^2$', en: 'Multiplying all three is a cuboid volume approach! Trapezium area averages the bases.\n$\\frac{1}{2}(5+9) \\times 4 = 28$ m$^2$' },
    onSkip: { zh: '梯形面积：$\\frac{1}{2}(a+b) \\times h$。两平行边之和的一半 × 高。', en: 'Trapezium area: $\\frac{1}{2}(a+b) \\times h$. Half the sum of parallel sides × height.' },
  }],
  9102: [{
    prompt: { zh: '圆形粮仓底面半径 5m。面积多少？', en: 'Circular granary with radius 5m. What\'s the area?' },
    type: 'choice',
    choices: [
      { zh: '$\\pi r^2 = \\pi \\times 5^2 = 25\\pi$ m$^2$', en: '$\\pi r^2 = \\pi \\times 5^2 = 25\\pi$ m$^2$' },
      { zh: '$2\\pi r = 10\\pi$ m', en: '$2\\pi r = 10\\pi$ m' },
    ],
    onCorrect: { zh: '圆面积 = $\\pi r^2$（$r$ 是半径）。\n圆周长 = $2\\pi r$（或 $\\pi d$）。\n面积带 $r^2$（二维），周长带 $r$（一维）。', en: 'Circle area = $\\pi r^2$ ($r$ is radius).\nCircumference = $2\\pi r$ (or $\\pi d$).\nArea has $r^2$ (2D), circumference has $r$ (1D).' },
    onWrong: { zh: '$2\\pi r$ 是周长（一圈的长度），不是面积！\n面积 = $\\pi r^2 = 25\\pi$ m$^2$。记住：面积有"平方"。', en: '$2\\pi r$ is circumference (distance around), not area!\nArea = $\\pi r^2 = 25\\pi$ m$^2$. Remember: area has "squared".' },
    onSkip: { zh: '圆面积 = $\\pi r^2$。周长 = $2\\pi r$。面积用 $r^2$，周长用 $r$。', en: 'Circle area = $\\pi r^2$. Circumference = $2\\pi r$. Area uses $r^2$, circumference uses $r$.' },
  }],
  9103: [{
    prompt: { zh: '粮仓是圆柱体。底面积 $25\\pi$ m$^2$，高 3m。容量(体积)多少？', en: 'Granary is a cylinder. Base area $25\\pi$ m$^2$, height 3m. Volume?' },
    type: 'choice',
    choices: [
      { zh: '$25\\pi \\times 3 = 75\\pi$ m$^3$', en: '$25\\pi \\times 3 = 75\\pi$ m$^3$' },
      { zh: '$25\\pi + 3 = (25\\pi + 3)$ m$^3$', en: '$25\\pi + 3 = (25\\pi + 3)$ m$^3$' },
    ],
    onCorrect: { zh: '柱体体积 = 底面积 × 高。$V = A \\times h$\n不管底面是什么形状（圆形、三角形、梯形），都是底面积乘高！', en: 'Prism/cylinder volume = base area × height. $V = A \\times h$\nRegardless of base shape (circle, triangle, trapezium), it\'s always base area × height!' },
    onWrong: { zh: '加法不对！体积 = 底面积 × 高（乘法）。\n$V = 25\\pi \\times 3 = 75\\pi$ m$^3$', en: 'Addition is wrong! Volume = base area × height (multiplication).\n$V = 25\\pi \\times 3 = 75\\pi$ m$^3$' },
    onSkip: { zh: '柱体体积 = 底面积 × 高。适用于所有柱体（圆柱、棱柱等）。', en: 'Prism/cylinder volume = base area × height. Works for all prisms and cylinders.' },
  }],

  // === Unit 11: 三角函数补充 ===
  9112: [{
    prompt: { zh: '火箭射角已知，斜边(射程) 10m，夹角 $60°$。邻边多长？用哪个比？', en: 'Rocket angle known, hypotenuse 10m, angle $60°$. Adjacent side? Which ratio?' },
    type: 'choice',
    choices: [
      { zh: '$\\cos 60° = \\frac{\\text{邻边}}{10}$，邻边 $= 10 \\cos 60°$', en: '$\\cos 60° = \\frac{\\text{adj}}{10}$, adj $= 10\\cos 60°$' },
      { zh: '$\\sin 60° = \\frac{\\text{邻边}}{10}$', en: '$\\sin 60° = \\frac{\\text{adj}}{10}$' },
    ],
    onCorrect: { zh: 'CAH！$\\cos\\theta = \\frac{\\text{邻边}}{\\text{斜边}}$\n邻边 $= \\text{斜边} \\times \\cos\\theta = 10 \\times \\cos 60° = 10 \\times 0.5 = 5$', en: 'CAH! $\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$\nAdjacent $= \\text{hyp} \\times \\cos\\theta = 10 \\times \\cos 60° = 10 \\times 0.5 = 5$' },
    onWrong: { zh: '$\\sin$ 连接的是对边和斜边(SOH)，不是邻边！\n邻边用 $\\cos$：$\\cos\\theta = \\frac{A}{H}$ → CAH', en: '$\\sin$ connects opposite and hypotenuse (SOH), not adjacent!\nAdjacent uses $\\cos$: $\\cos\\theta = \\frac{A}{H}$ → CAH' },
    onSkip: { zh: 'SOH-CAH-TOA：邻边和斜边 → cos。$A = H \\times \\cos\\theta$。', en: 'SOH-CAH-TOA: adjacent and hypotenuse → cos. $A = H \\times \\cos\\theta$.' },
  }],
  9113: [{
    prompt: { zh: '连环船锁链：已知角度 $40°$ 和邻边 8m。对边(锁链长)多少？', en: 'Chain lock: angle $40°$ and adjacent 8m. Opposite side (chain length)?' },
    type: 'choice',
    choices: [
      { zh: '$\\tan 40° = \\frac{\\text{对边}}{8}$，对边 $= 8\\tan 40°$', en: '$\\tan 40° = \\frac{\\text{opp}}{8}$, opp $= 8\\tan 40°$' },
      { zh: '$\\cos 40° = \\frac{8}{\\text{对边}}$', en: '$\\cos 40° = \\frac{8}{\\text{opp}}$' },
    ],
    onCorrect: { zh: 'TOA！对边和邻边 → $\\tan$。\n$\\tan\\theta = \\frac{O}{A}$ → $O = A \\times \\tan\\theta = 8 \\times \\tan 40°$', en: 'TOA! Opposite and adjacent → $\\tan$.\n$\\tan\\theta = \\frac{O}{A}$ → $O = A \\times \\tan\\theta = 8 \\times \\tan 40°$' },
    onWrong: { zh: '$\\cos$ 连接邻边和斜边，这里没有斜边！\n有对边和邻边 → 用 $\\tan$：$O = A \\times \\tan\\theta$', en: '$\\cos$ connects adjacent and hypotenuse, but there\'s no hypotenuse here!\nOpposite and adjacent → use $\\tan$: $O = A \\times \\tan\\theta$' },
    onSkip: { zh: 'TOA：$\\tan\\theta = \\frac{O}{A}$。求对边 = 邻边 × tan(角度)。', en: 'TOA: $\\tan\\theta = \\frac{O}{A}$. Opposite = adjacent × tan(angle).' },
  }],

  // === Unit 12: 统计 & 概率 ===
  9121: [{
    prompt: { zh: '5 场战斗伤亡人数：10, 15, 20, 30, 25。平均伤亡是多少？', en: '5 battles with casualties: 10, 15, 20, 30, 25. What\'s the mean?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{10+15+20+30+25}{5} = 20$', en: '$\\frac{10+15+20+30+25}{5} = 20$' },
      { zh: '中间的数 20', en: 'The middle number, 20' },
    ],
    onCorrect: { zh: '平均数(mean) = 总和 ÷ 个数。\n$\\frac{100}{5} = 20$\n中间的数是中位数(median)，那是另一个概念！', en: 'Mean = total sum ÷ count.\n$\\frac{100}{5} = 20$\nThe middle number is the median — that\'s a different concept!' },
    onWrong: { zh: '中间的数是中位数，不是平均数！平均数要算总和再除以个数。\n$(10+15+20+30+25) \\div 5 = 20$', en: 'The middle number is the median, not the mean! Mean requires summing then dividing.\n$(10+15+20+30+25) \\div 5 = 20$' },
    onSkip: { zh: '平均数 = $\\frac{\\text{总和}}{\\text{个数}}$。别和中位数混淆！', en: 'Mean = $\\frac{\\text{sum}}{\\text{count}}$. Don\'t confuse with median!' },
  }],
  9122: [{
    prompt: { zh: '物资数量：3, 7, 8, 12, 15。中位数是多少？', en: 'Supply quantities: 3, 7, 8, 12, 15. What\'s the median?' },
    type: 'choice',
    choices: [
      { zh: '$8$——排序后正中间的数', en: '$8$ — the middle number when sorted' },
      { zh: '$\\frac{3+7+8+12+15}{5} = 9$', en: '$\\frac{3+7+8+12+15}{5} = 9$' },
    ],
    onCorrect: { zh: '中位数 = 排序后正中间的值。5 个数 → 第 3 个。\n偶数个数据时取中间两个的平均。\n中位数不受极端值影响，比平均数更"稳"。', en: 'Median = middle value when sorted. 5 numbers → 3rd one.\nWith even count, average the two middle values.\nMedian isn\'t affected by outliers — more "stable" than mean.' },
    onWrong: { zh: '那是平均数的算法！中位数是排序后的中间值。\n$3, 7, \\mathbf{8}, 12, 15$ → 中位数 = $8$', en: 'That\'s the mean formula! Median is the middle value when sorted.\n$3, 7, \\mathbf{8}, 12, 15$ → median = $8$' },
    onSkip: { zh: '中位数：先排序，再取中间值。偶数个时取中间两数平均。', en: 'Median: sort first, then take middle value. Even count → average the two middle values.' },
  }],
  9123: [{
    prompt: { zh: '袋中 3 红 2 蓝共 5 球。随机摸到红球的概率？', en: 'Bag with 3 red, 2 blue = 5 balls. Probability of picking red?' },
    type: 'choice',
    choices: [
      { zh: '$P = \\frac{3}{5}$', en: '$P = \\frac{3}{5}$' },
      { zh: '$P = \\frac{3}{2}$', en: '$P = \\frac{3}{2}$' },
    ],
    onCorrect: { zh: '概率 = $\\frac{\\text{有利结果数}}{\\text{总结果数}}$\n$P(\\text{红}) = \\frac{3}{5}$。概率永远在 $0$ 到 $1$ 之间。', en: 'Probability = $\\frac{\\text{favorable outcomes}}{\\text{total outcomes}}$\n$P(\\text{red}) = \\frac{3}{5}$. Probability is always between 0 and 1.' },
    onWrong: { zh: '$\\frac{3}{2} > 1$，概率不可能超过 1！分母是总数，不是另一种颜色。\n$P = \\frac{\\text{红球}}{\\text{总球}} = \\frac{3}{5}$', en: '$\\frac{3}{2} > 1$, probability can\'t exceed 1! Denominator is total, not other color.\n$P = \\frac{\\text{red}}{\\text{total}} = \\frac{3}{5}$' },
    onSkip: { zh: '概率 = $\\frac{\\text{有利}}{\\text{总数}}$。范围 $0 \\leq P \\leq 1$。', en: 'Probability = $\\frac{\\text{favorable}}{\\text{total}}$. Range $0 \\leq P \\leq 1$.' },
  }],

  // === Unit 13: 二次函数 ===
  9132: [{
    prompt: { zh: '投石轨迹 $y = -x^2 + 6x - 5$。顶点(最高点)怎么求？', en: 'Projectile path $y = -x^2 + 6x - 5$. How to find the vertex (peak)?' },
    type: 'choice',
    choices: [
      { zh: '$x = -\\frac{b}{2a} = -\\frac{6}{-2} = 3$，代入求 $y$', en: '$x = -\\frac{b}{2a} = -\\frac{6}{-2} = 3$, substitute for $y$' },
      { zh: '令 $y = 0$ 求根', en: 'Set $y = 0$ for roots' },
    ],
    onCorrect: { zh: '顶点横坐标 $x = -\\frac{b}{2a} = 3$。\n$y = -(3)^2 + 6(3) - 5 = -9+18-5 = 4$。顶点 $(3, 4)$。\n$a < 0$ → 开口朝下 → 顶点是最高点。', en: 'Vertex x-coordinate: $x = -\\frac{b}{2a} = 3$.\n$y = -(3)^2 + 6(3) - 5 = -9+18-5 = 4$. Vertex $(3, 4)$.\n$a < 0$ → opens down → vertex is the maximum.' },
    onWrong: { zh: '令 $y=0$ 求的是根（和 $x$ 轴交点），不是顶点！\n顶点用 $x = -\\frac{b}{2a}$，再代入求 $y$。', en: 'Setting $y=0$ gives roots (x-intercepts), not vertex!\nVertex uses $x = -\\frac{b}{2a}$, then substitute for $y$.' },
    onSkip: { zh: '顶点公式：$x = -\\frac{b}{2a}$，代入求 $y$。$a>0$ 最低点，$a<0$ 最高点。', en: 'Vertex formula: $x = -\\frac{b}{2a}$, substitute for $y$. $a>0$ min, $a<0$ max.' },
  }],

  // === Unit 14: 韦恩图、扇形、变换 ===
  9141: [{
    prompt: { zh: '100 名谍报人员：60 人会骑马，45 人会射箭，20 人都会。会其中至少一样的有多少人？', en: '100 spies: 60 ride horses, 45 do archery, 20 do both. How many do at least one?' },
    type: 'choice',
    choices: [
      { zh: '$60 + 45 - 20 = 85$ 人', en: '$60 + 45 - 20 = 85$' },
      { zh: '$60 + 45 = 105$ 人', en: '$60 + 45 = 105$' },
    ],
    onCorrect: { zh: '韦恩图公式：$|A \\cup B| = |A| + |B| - |A \\cap B|$\n直接相加会重复计算"都会"的人，所以要减去交集。\n$60 + 45 - 20 = 85$。不会的 = $100 - 85 = 15$。', en: 'Venn diagram formula: $|A \\cup B| = |A| + |B| - |A \\cap B|$\nDirect addition double-counts the "both" group, so subtract intersection.\n$60 + 45 - 20 = 85$. Neither = $100 - 85 = 15$.' },
    onWrong: { zh: '105 > 100 人？不可能！直接加会重复算"都会"的 20 人。\n$|A \\cup B| = 60 + 45 - 20 = 85$', en: '105 > 100 people? Impossible! Direct addition double-counts the 20 who do both.\n$|A \\cup B| = 60 + 45 - 20 = 85$' },
    onSkip: { zh: '韦恩图：$|A \\cup B| = |A| + |B| - |A \\cap B|$。减去交集避免重复计算。', en: 'Venn diagram: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Subtract intersection to avoid double-counting.' },
  }],
  9142: [{
    prompt: { zh: '烽火台扇形区域：半径 10m，圆心角 $72°$。弧长多少？', en: 'Beacon sector: radius 10m, angle $72°$. What\'s the arc length?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{72}{360} \\times 2\\pi(10) = 4\\pi$ m', en: '$\\frac{72}{360} \\times 2\\pi(10) = 4\\pi$ m' },
      { zh: '$72 \\times 10 = 720$ m', en: '$72 \\times 10 = 720$ m' },
    ],
    onCorrect: { zh: '弧长 = $\\frac{\\theta}{360} \\times 2\\pi r$（圆周长的一部分）。\n$\\frac{72}{360} = \\frac{1}{5}$，圆周 = $20\\pi$。\n弧长 = $\\frac{1}{5} \\times 20\\pi = 4\\pi$ m', en: 'Arc length = $\\frac{\\theta}{360} \\times 2\\pi r$ (fraction of circumference).\n$\\frac{72}{360} = \\frac{1}{5}$, circumference = $20\\pi$.\nArc = $\\frac{1}{5} \\times 20\\pi = 4\\pi$ m' },
    onWrong: { zh: '角度和半径不能直接相乘！弧长是圆周长的一个比例。\n弧长 = $\\frac{\\theta}{360} \\times 2\\pi r$', en: 'You can\'t just multiply angle by radius! Arc length is a fraction of circumference.\nArc = $\\frac{\\theta}{360} \\times 2\\pi r$' },
    onSkip: { zh: '弧长 = $\\frac{\\theta}{360} \\times 2\\pi r$。扇形面积 = $\\frac{\\theta}{360} \\times \\pi r^2$。', en: 'Arc length = $\\frac{\\theta}{360} \\times 2\\pi r$. Sector area = $\\frac{\\theta}{360} \\times \\pi r^2$.' },
  }],
  9143: [{
    prompt: { zh: '点 $(3, 1)$ 绕原点逆时针旋转 $90°$。新坐标是什么？', en: 'Point $(3, 1)$ rotated $90°$ anticlockwise about origin. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(-1, 3)$', en: '$(-1, 3)$' },
      { zh: '$(1, -3)$', en: '$(1, -3)$' },
    ],
    onCorrect: { zh: '逆时针 $90°$ 旋转公式：$(x,y) \\to (-y, x)$。\n$(3,1) \\to (-1, 3)$。\n顺时针 $90°$：$(x,y) \\to (y, -x)$。', en: 'Anticlockwise $90°$: $(x,y) \\to (-y, x)$.\n$(3,1) \\to (-1, 3)$.\nClockwise $90°$: $(x,y) \\to (y, -x)$.' },
    onWrong: { zh: '$(1,-3)$ 是顺时针 $90°$！逆时针公式：$(x,y) \\to (-y, x)$。\n$(3,1) \\to (-1, 3)$', en: '$(1,-3)$ is clockwise $90°$! Anticlockwise: $(x,y) \\to (-y, x)$.\n$(3,1) \\to (-1, 3)$' },
    onSkip: { zh: '逆时针 $90°$：$(x,y) \\to (-y,x)$。顺时针 $90°$：$(x,y) \\to (y,-x)$。', en: 'ACW $90°$: $(x,y) \\to (-y,x)$. CW $90°$: $(x,y) \\to (y,-x)$.' },
  }],
  9144: [{
    prompt: { zh: '战旗上的点 $(2, 3)$ 以原点为中心放大 2 倍。新坐标？', en: 'Banner point $(2, 3)$ enlarged by factor 2 from origin. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(4, 6)$——每个坐标乘以 2', en: '$(4, 6)$ — multiply each coordinate by 2' },
      { zh: '$(2+2, 3+2) = (4, 5)$', en: '$(2+2, 3+2) = (4, 5)$' },
    ],
    onCorrect: { zh: '以原点为中心放大 $k$ 倍：$(x,y) \\to (kx, ky)$。\n$(2,3) \\to (4, 6)$。距离原点变为原来的 $k$ 倍。', en: 'Enlargement factor $k$ from origin: $(x,y) \\to (kx, ky)$.\n$(2,3) \\to (4, 6)$. Distance from origin multiplied by $k$.' },
    onWrong: { zh: '放大不是加法！放大是乘法：每个坐标 × 缩放因子。\n$(2,3) \\times 2 = (4, 6)$', en: 'Enlargement isn\'t addition! It\'s multiplication: each coordinate × scale factor.\n$(2,3) \\times 2 = (4, 6)$' },
    onSkip: { zh: '原点放大 $k$ 倍：$(x,y) \\to (kx, ky)$。坐标都乘以缩放因子。', en: 'Enlargement $k$ from origin: $(x,y) \\to (kx, ky)$. Multiply coordinates by scale factor.' },
  }],
  9145: [{
    prompt: { zh: '东风助阵！向量 $\\mathbf{a} = \\binom{3}{2}$ 和 $\\mathbf{b} = \\binom{1}{-4}$。$\\mathbf{a}+\\mathbf{b}$ 是多少？', en: 'Eastern wind! Vector $\\mathbf{a} = \\binom{3}{2}$ and $\\mathbf{b} = \\binom{1}{-4}$. What is $\\mathbf{a}+\\mathbf{b}$?' },
    type: 'choice',
    choices: [
      { zh: '$\\binom{3+1}{2+(-4)} = \\binom{4}{-2}$', en: '$\\binom{3+1}{2+(-4)} = \\binom{4}{-2}$' },
      { zh: '$\\binom{3 \\times 1}{2 \\times (-4)} = \\binom{3}{-8}$', en: '$\\binom{3 \\times 1}{2 \\times (-4)} = \\binom{3}{-8}$' },
    ],
    onCorrect: { zh: '向量加法：对应分量相加。\n$\\binom{a_1}{a_2} + \\binom{b_1}{b_2} = \\binom{a_1+b_1}{a_2+b_2}$\n几何意义：先走 $\\mathbf{a}$，再走 $\\mathbf{b}$，合起来就是 $\\mathbf{a}+\\mathbf{b}$。', en: 'Vector addition: add corresponding components.\n$\\binom{a_1}{a_2} + \\binom{b_1}{b_2} = \\binom{a_1+b_1}{a_2+b_2}$\nGeometrically: walk $\\mathbf{a}$ then $\\mathbf{b}$ — combined displacement is $\\mathbf{a}+\\mathbf{b}$.' },
    onWrong: { zh: '向量加法是加，不是乘！每个分量分别相加。\n$\\binom{3}{2} + \\binom{1}{-4} = \\binom{4}{-2}$', en: 'Vector addition means adding, not multiplying! Add each component separately.\n$\\binom{3}{2} + \\binom{1}{-4} = \\binom{4}{-2}$' },
    onSkip: { zh: '向量加法：$\\binom{a}{b} + \\binom{c}{d} = \\binom{a+c}{b+d}$。对应分量相加。', en: 'Vector addition: $\\binom{a}{b} + \\binom{c}{d} = \\binom{a+c}{b+d}$. Add components.' },
  }],
  9146: [{
    prompt: { zh: '累积频率曲线上，中位数怎么找？', en: 'On a cumulative frequency curve, how to find the median?' },
    type: 'choice',
    choices: [
      { zh: '总频率的一半处画水平线，读 $x$ 值', en: 'Draw horizontal line at half total frequency, read $x$ value' },
      { zh: '找曲线的最高点', en: 'Find the highest point of the curve' },
    ],
    onCorrect: { zh: '累积频率求中位数：\n1. 总频率 ÷ 2\n2. 从 $y$ 轴该点画水平线到曲线\n3. 从交点画垂线到 $x$ 轴，读数\n四分位数类似：$\\frac{1}{4}$ 和 $\\frac{3}{4}$ 处。', en: 'Cumulative frequency for median:\n1. Total frequency ÷ 2\n2. Horizontal line from y-axis to curve\n3. Vertical line down to x-axis, read value\nQuartiles similar: $\\frac{1}{4}$ and $\\frac{3}{4}$ positions.' },
    onWrong: { zh: '最高点只是总频率！中位数在总频率一半处。\n从 $\\frac{n}{2}$ 画水平线到曲线，再读 $x$ 值。', en: 'The highest point is just the total frequency! Median is at half.\nDraw horizontal at $\\frac{n}{2}$ to curve, then read $x$ value.' },
    onSkip: { zh: '累积频率中位数：总频率 $\\div 2$ 处水平线交曲线，向下读 $x$。', en: 'Cumulative frequency median: horizontal at total $\\div 2$, intersect curve, read $x$ down.' },
  }],
  9147: [{
    prompt: { zh: '两次发射兵符，每次成功率 $\\frac{2}{3}$。两次都成功的概率？', en: 'Two launches, each with $\\frac{2}{3}$ success rate. Probability both succeed?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$', en: '$\\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$' },
      { zh: '$\\frac{2}{3} + \\frac{2}{3} = \\frac{4}{3}$', en: '$\\frac{2}{3} + \\frac{2}{3} = \\frac{4}{3}$' },
    ],
    onCorrect: { zh: '"都"= 相乘（AND 规则）。概率树沿分支相乘。\n$P(\\text{都成功}) = \\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$\n"或"才是相加（但要注意互斥条件）。', en: '"Both" = multiply (AND rule). Multiply along tree branches.\n$P(\\text{both success}) = \\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$\n"Or" uses addition (but check for mutual exclusivity).' },
    onWrong: { zh: '$\\frac{4}{3} > 1$，概率不可能超过 1！"都"用乘法，不是加法。\n$\\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$', en: '$\\frac{4}{3} > 1$, probability can\'t exceed 1! "Both" uses multiplication, not addition.\n$\\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$' },
    onSkip: { zh: 'AND = 乘法，OR = 加法。概率树：沿分支乘，平行分支加。', en: 'AND = multiply, OR = add. Tree: multiply along branches, add parallel branches.' },
  }],
  9148: [{
    prompt: { zh: '袋中 5 红 3 蓝。不放回抽两次，两次都是红的概率？', en: 'Bag: 5 red, 3 blue. Draw twice without replacement. P(both red)?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$', en: '$\\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$' },
      { zh: '$\\frac{5}{8} \\times \\frac{5}{8} = \\frac{25}{64}$', en: '$\\frac{5}{8} \\times \\frac{5}{8} = \\frac{25}{64}$' },
    ],
    onCorrect: { zh: '不放回 = 第二次总数和有利数都变了！\n第一次：$\\frac{5}{8}$。拿走一红后：$\\frac{4}{7}$。\n$P = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{5}{14}$', en: 'Without replacement = both total and favorable change for the second draw!\nFirst: $\\frac{5}{8}$. After removing one red: $\\frac{4}{7}$.\n$P = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{5}{14}$' },
    onWrong: { zh: '$\\frac{5}{8} \\times \\frac{5}{8}$ 是放回的概率！不放回时，第二次分子分母都要减 1。\n$\\frac{5}{8} \\times \\frac{4}{7} = \\frac{5}{14}$', en: '$\\frac{5}{8} \\times \\frac{5}{8}$ is WITH replacement! Without replacement, both numerator and denominator decrease.\n$\\frac{5}{8} \\times \\frac{4}{7} = \\frac{5}{14}$' },
    onSkip: { zh: '不放回：第二次的分子分母都变。$P = \\frac{5}{8} \\times \\frac{4}{7}$。', en: 'Without replacement: second draw changes both numerator and denominator. $P = \\frac{5}{8} \\times \\frac{4}{7}$.' },
  }],
  9149: [{
    prompt: { zh: '袋中 4 红 3 蓝。不放回抽两次，两次同色的概率？', en: 'Bag: 4 red, 3 blue. Draw twice without replacement. P(same color)?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{4}{7} \\times \\frac{3}{6} + \\frac{3}{7} \\times \\frac{2}{6}$', en: '$\\frac{4}{7} \\times \\frac{3}{6} + \\frac{3}{7} \\times \\frac{2}{6}$' },
      { zh: '$\\frac{4}{7} \\times \\frac{3}{6}$', en: '$\\frac{4}{7} \\times \\frac{3}{6}$' },
    ],
    onCorrect: { zh: '"同色"有两种情况：都红 OR 都蓝。\n都红：$\\frac{4}{7} \\times \\frac{3}{6}$\n都蓝：$\\frac{3}{7} \\times \\frac{2}{6}$\n同色 = 都红 + 都蓝 = $\\frac{12}{42} + \\frac{6}{42} = \\frac{18}{42} = \\frac{3}{7}$', en: '"Same color" has two cases: both red OR both blue.\nBoth red: $\\frac{4}{7} \\times \\frac{3}{6}$\nBoth blue: $\\frac{3}{7} \\times \\frac{2}{6}$\nSame = $\\frac{12}{42} + \\frac{6}{42} = \\frac{18}{42} = \\frac{3}{7}$' },
    onWrong: { zh: '只算了都红！"同色"还包括都蓝。\n同色 = P(都红) + P(都蓝) = $\\frac{4}{7} \\times \\frac{3}{6} + \\frac{3}{7} \\times \\frac{2}{6}$', en: 'Only counted both red! "Same color" also includes both blue.\nSame = P(both red) + P(both blue) = $\\frac{4}{7} \\times \\frac{3}{6} + \\frac{3}{7} \\times \\frac{2}{6}$' },
    onSkip: { zh: '同色 = P(都红) + P(都蓝)。分支相乘，平行相加。', en: 'Same color = P(both red) + P(both blue). Multiply along branches, add parallel paths.' },
  }],

  // === Unit 15: 补充直线 ===
  9152: [{
    prompt: { zh: '直线 $y = 3x + 1$ 的平行线过点 $(2, 10)$。方程？', en: 'Parallel to $y = 3x + 1$ through $(2, 10)$. Equation?' },
    type: 'choice',
    choices: [
      { zh: '斜率 $m=3$，代入 $(2,10)$：$10=3(2)+c$，$c=4$ → $y=3x+4$', en: 'Gradient $m=3$, sub $(2,10)$: $10=3(2)+c$, $c=4$ → $y=3x+4$' },
      { zh: '$y = 3x + 10$', en: '$y = 3x + 10$' },
    ],
    onCorrect: { zh: '平行 → 同斜率 $m=3$。代入已知点求截距：\n$10 = 3(2) + c$ → $c = 4$\n方程：$y = 3x + 4$', en: 'Parallel → same gradient $m=3$. Substitute known point for intercept:\n$10 = 3(2) + c$ → $c = 4$\nEquation: $y = 3x + 4$' },
    onWrong: { zh: '不能直接把 $y$ 坐标当截距！要代入点求 $c$。\n$10 = 3 \\times 2 + c$ → $c = 4$。方程 $y = 3x + 4$。', en: 'Can\'t just use the y-coordinate as intercept! Substitute the point for $c$.\n$10 = 3 \\times 2 + c$ → $c = 4$. Equation: $y = 3x + 4$.' },
    onSkip: { zh: '平行线：同斜率，代入新点求新截距。', en: 'Parallel line: same gradient, substitute new point for new intercept.' },
  }],

  // === Unit 15b: 体积 & 散点图 ===
  9154: [{
    prompt: { zh: '城墙有一段缺口。复合体怎么算体积？', en: 'The wall has a gap. How to find the volume of a composite solid?' },
    type: 'choice',
    choices: [
      { zh: '拆成简单形状分别算，再加减', en: 'Split into simple shapes, calculate each, then add/subtract' },
      { zh: '直接用长 × 宽 × 高', en: 'Just use length × width × height' },
    ],
    onCorrect: { zh: '复合体积 = 拆分成长方体/棱柱/圆柱等简单形状。\n缺口 = 大体积 - 小体积。\nL 形 = 两个长方体相加。关键是识别拆分方式。', en: 'Composite volume = break into cuboids/prisms/cylinders.\nGap = large volume - small volume.\nL-shape = two cuboids added. Key is identifying how to split.' },
    onWrong: { zh: '长 × 宽 × 高只适用于长方体！复合体要拆分成简单形状。\n加法(拼接)或减法(挖空)。', en: 'L × W × H only works for cuboids! Composite solids need splitting.\nAddition (combine) or subtraction (cut out).' },
    onSkip: { zh: '复合体积：拆成简单形状，加(拼接)或减(挖空)。', en: 'Composite volume: split into simple shapes, add (combine) or subtract (cut out).' },
  }],
  9156: [{
    prompt: { zh: '散点图上画了拟合线。怎么估算斜率？', en: 'A line of best fit is drawn on a scatter plot. How to estimate the gradient?' },
    type: 'choice',
    choices: [
      { zh: '在线上取两个远离的点，用 $m = \\frac{\\Delta y}{\\Delta x}$', en: 'Pick two well-separated points on the line, use $m = \\frac{\\Delta y}{\\Delta x}$' },
      { zh: '数散点的个数', en: 'Count the number of points' },
    ],
    onCorrect: { zh: '拟合线斜率 = 在线上(不是数据点！)取两点求斜率。\n点取得越远，误差越小。\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$', en: 'Line of best fit gradient = pick two points ON THE LINE (not data points!).\nFarther apart = less error.\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$' },
    onWrong: { zh: '散点个数和斜率无关！斜率要在拟合线上取两点计算。\n$m = \\frac{\\Delta y}{\\Delta x}$', en: 'Number of points is irrelevant to gradient! Take two points on the line.\n$m = \\frac{\\Delta y}{\\Delta x}$' },
    onSkip: { zh: '拟合线斜率：线上取两点，$m = \\frac{\\Delta y}{\\Delta x}$。', en: 'Line of best fit gradient: two points on line, $m = \\frac{\\Delta y}{\\Delta x}$.' },
  }],
  9157: [{
    prompt: { zh: '用拟合线预测。"内插"和"外推"哪个更可靠？', en: 'Predicting with line of best fit. Which is more reliable: interpolation or extrapolation?' },
    type: 'choice',
    choices: [
      { zh: '内插更可靠——在数据范围内预测', en: 'Interpolation — predicting within data range' },
      { zh: '外推更可靠——预测更远的值', en: 'Extrapolation — predicting beyond data' },
    ],
    onCorrect: { zh: '内插 = 在已有数据范围内预测 → 可靠。\n外推 = 超出数据范围预测 → 不可靠，因为趋势可能改变。\n考试常问："为什么这个预测不可靠？"→ 因为是外推。', en: 'Interpolation = predicting within data range → reliable.\nExtrapolation = predicting beyond data → unreliable, trend may change.\nExam often asks: "Why is this prediction unreliable?" → because it\'s extrapolation.' },
    onWrong: { zh: '外推超出了数据范围，趋势可能不再成立！\n内插在已知范围内，有数据支撑，更可靠。', en: 'Extrapolation goes beyond data range — the trend might not hold!\nInterpolation stays within known range, supported by data, more reliable.' },
    onSkip: { zh: '内插(范围内) = 可靠。外推(范围外) = 不可靠，趋势可能变。', en: 'Interpolation (within range) = reliable. Extrapolation (beyond range) = unreliable.' },
  }],

  // === Unit 16: 方程 ===
  9162: [{
    prompt: { zh: '两军对峙！$5x - 3 = 2x + 9$。怎么解？', en: 'Two armies face off! $5x - 3 = 2x + 9$. How to solve?' },
    type: 'choice',
    choices: [
      { zh: '把 $x$ 集中到一边：$5x - 2x = 9 + 3$，$3x = 12$，$x = 4$', en: 'Collect $x$ terms: $5x - 2x = 9 + 3$, $3x = 12$, $x = 4$' },
      { zh: '两边同时除以 $x$', en: 'Divide both sides by $x$' },
    ],
    onCorrect: { zh: '移项大法！$x$ 项移到一边，常数移到另一边。\n$5x - 2x = 9 + 3$ → $3x = 12$ → $x = 4$\n验证：$5(4)-3 = 17$，$2(4)+9 = 17$ ✓', en: 'Rearranging! Collect $x$ on one side, constants on the other.\n$5x - 2x = 9 + 3$ → $3x = 12$ → $x = 4$\nCheck: $5(4)-3 = 17$, $2(4)+9 = 17$ ✓' },
    onWrong: { zh: '除以 $x$ 会丢失解($x$ 可能为 0)！正确做法是移项。\n$5x - 2x = 9 + 3$ → $3x = 12$ → $x = 4$', en: 'Dividing by $x$ can lose solutions ($x$ could be 0)! Rearrange instead.\n$5x - 2x = 9 + 3$ → $3x = 12$ → $x = 4$' },
    onSkip: { zh: '解方程：$x$ 移一边，数字移另一边，移项变号。', en: 'Solve equation: $x$ terms one side, numbers the other. Sign changes when moving.' },
  }],
  9163: [{
    prompt: { zh: '三个连续整数之和为 42。怎么列方程？', en: 'Three consecutive integers sum to 42. How to set up the equation?' },
    type: 'choice',
    choices: [
      { zh: '$n + (n+1) + (n+2) = 42$', en: '$n + (n+1) + (n+2) = 42$' },
      { zh: '$42 \\div 3 = 14$，直接得答案', en: '$42 \\div 3 = 14$, answer directly' },
    ],
    onCorrect: { zh: '三连续整数：$n, n+1, n+2$。\n$n + (n+1) + (n+2) = 42$\n$3n + 3 = 42$ → $3n = 39$ → $n = 13$\n三个数：13, 14, 15。', en: 'Three consecutive: $n, n+1, n+2$.\n$n + (n+1) + (n+2) = 42$\n$3n + 3 = 42$ → $3n = 39$ → $n = 13$\nThe three: 13, 14, 15.' },
    onWrong: { zh: '除以 3 只在三个数相等时成立！连续整数不相等。\n用 $n, n+1, n+2$ 列方程：$3n + 3 = 42$。', en: 'Dividing by 3 only works for equal numbers! Consecutive integers aren\'t equal.\nUse $n, n+1, n+2$: $3n + 3 = 42$.' },
    onSkip: { zh: '连续整数：$n, n+1, n+2, ...$。列方程用代数表示"连续"。', en: 'Consecutive integers: $n, n+1, n+2, ...$. Use algebra to express "consecutive".' },
  }],
  9164: [{
    prompt: { zh: '长方形城墙：长 $(2x+3)$m，宽 $x$m，周长 30m。$x$ 等于多少？', en: 'Rectangular wall: length $(2x+3)$m, width $x$m, perimeter 30m. Find $x$.' },
    type: 'choice',
    choices: [
      { zh: '$2(2x+3) + 2x = 30$，$6x + 6 = 30$，$x = 4$', en: '$2(2x+3) + 2x = 30$, $6x + 6 = 30$, $x = 4$' },
      { zh: '$(2x+3) \\times x = 30$', en: '$(2x+3) \\times x = 30$' },
    ],
    onCorrect: { zh: '周长 = 两长 + 两宽 = $2(2x+3) + 2x$。\n$4x + 6 + 2x = 30$ → $6x = 24$ → $x = 4$\n长 = $2(4)+3 = 11$m，宽 = $4$m。', en: 'Perimeter = 2 lengths + 2 widths = $2(2x+3) + 2x$.\n$4x + 6 + 2x = 30$ → $6x = 24$ → $x = 4$\nLength = $2(4)+3 = 11$m, width = $4$m.' },
    onWrong: { zh: '长 × 宽是面积，不是周长！周长 = $2 \\times$ 长 $+ 2 \\times$ 宽。\n$2(2x+3) + 2x = 30$', en: 'Length × width is area, not perimeter! Perimeter = $2 \\times$ length $+ 2 \\times$ width.\n$2(2x+3) + 2x = 30$' },
    onSkip: { zh: '长方形周长 = $2(l+w)$。列方程后像普通方程一样解。', en: 'Rectangle perimeter = $2(l+w)$. Set up equation then solve normally.' },
  }],
  9165: [{
    prompt: { zh: '$x^3 + x = 50$。精确解不好求，怎么用试错法逼近？', en: '$x^3 + x = 50$. Exact solution is hard. How to use trial and improvement?' },
    type: 'choice',
    choices: [
      { zh: '猜一个值代入，看结果偏大还是偏小，调整再试', en: 'Guess a value, substitute, check if too big or small, adjust and retry' },
      { zh: '两边同时开立方', en: 'Cube root both sides' },
    ],
    onCorrect: { zh: '试值法：\n$x=3$：$27+3=30$ (太小)\n$x=4$：$64+4=68$ (太大)\n$x=3.5$：$42.875+3.5=46.375$ (太小)\n继续缩小范围直到精度够。', en: 'Trial and improvement:\n$x=3$: $27+3=30$ (too small)\n$x=4$: $64+4=68$ (too big)\n$x=3.5$: $42.875+3.5=46.375$ (too small)\nKeep narrowing until sufficient accuracy.' },
    onWrong: { zh: '不能直接开立方——因为还有个 $+x$ 项！\n试值法：猜 → 代入 → 判断大小 → 调整 → 再试。', en: 'Can\'t just cube root — there\'s also $+x$!\nTrial and improvement: guess → substitute → check → adjust → retry.' },
    onSkip: { zh: '试值法：猜值代入，比较结果，缩小范围，重复直到够精确。', en: 'Trial and improvement: guess, substitute, compare, narrow range, repeat.' },
  }],
  9166: [{
    prompt: { zh: '$x^2 - 5x + 6 = 0$。因式分解怎么解？', en: '$x^2 - 5x + 6 = 0$. How to solve by factoring?' },
    type: 'choice',
    choices: [
      { zh: '$(x-2)(x-3) = 0$，$x=2$ 或 $x=3$', en: '$(x-2)(x-3) = 0$, $x=2$ or $x=3$' },
      { zh: '$x = 5 - 6 = -1$', en: '$x = 5 - 6 = -1$' },
    ],
    onCorrect: { zh: '因式分解：找两个数相乘 $= 6$，相加 $= -5$。\n$-2 \\times -3 = 6$，$-2 + (-3) = -5$ ✓\n$(x-2)(x-3) = 0$ → $x=2$ 或 $x=3$', en: 'Factoring: find two numbers that multiply to $6$ and add to $-5$.\n$-2 \\times -3 = 6$, $-2 + (-3) = -5$ ✓\n$(x-2)(x-3) = 0$ → $x=2$ or $x=3$' },
    onWrong: { zh: '不能直接加减系数！二次方程要因式分解或用公式。\n$(x-2)(x-3) = 0$ → 乘积为零则某因子为零。', en: 'Can\'t just add/subtract coefficients! Quadratics need factoring or formula.\n$(x-2)(x-3) = 0$ → if product is zero, one factor must be zero.' },
    onSkip: { zh: '因式分解：找两数乘积=$c$、和=$b$。$(x-p)(x-q)=0$ → $x=p$ 或 $x=q$。', en: 'Factor: find two numbers with product=$c$, sum=$b$. $(x-p)(x-q)=0$ → $x=p$ or $x=q$.' },
  }],
  9167: [{
    prompt: { zh: '$2x^2 + 3x - 5 = 0$ 没法轻松因式分解。用什么万能公式？', en: '$2x^2 + 3x - 5 = 0$ is hard to factor. What universal formula to use?' },
    type: 'choice',
    choices: [
      { zh: '$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', en: '$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$' },
      { zh: '$x = \\frac{-c}{b}$', en: '$x = \\frac{-c}{b}$' },
    ],
    onCorrect: { zh: '求根公式适用于所有 $ax^2+bx+c=0$！\n$a=2, b=3, c=-5$\n$x = \\frac{-3 \\pm \\sqrt{9+40}}{4} = \\frac{-3 \\pm 7}{4}$\n$x = 1$ 或 $x = -2.5$', en: 'Quadratic formula works for ALL $ax^2+bx+c=0$!\n$a=2, b=3, c=-5$\n$x = \\frac{-3 \\pm \\sqrt{9+40}}{4} = \\frac{-3 \\pm 7}{4}$\n$x = 1$ or $x = -2.5$' },
    onWrong: { zh: '$\\frac{-c}{b}$ 只适用于一次方程！二次方程用求根公式。\n$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', en: '$\\frac{-c}{b}$ only works for linear equations! Quadratics use the quadratic formula.\n$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$' },
    onSkip: { zh: '求根公式：$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$。适用于所有二次方程。', en: 'Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$. Works for all quadratics.' },
  }],
  9168: [{
    prompt: { zh: '$x^2 + 6x + 5$。配方法怎么写？', en: '$x^2 + 6x + 5$. How to complete the square?' },
    type: 'choice',
    choices: [
      { zh: '$(x+3)^2 - 4$', en: '$(x+3)^2 - 4$' },
      { zh: '$(x+6)^2 + 5$', en: '$(x+6)^2 + 5$' },
    ],
    onCorrect: { zh: '配方法：$x^2 + bx$ → $(x + \\frac{b}{2})^2 - (\\frac{b}{2})^2$\n$x^2 + 6x + 5 = (x+3)^2 - 9 + 5 = (x+3)^2 - 4$\n顶点形式：顶点在 $(-3, -4)$。', en: 'Completing the square: $x^2 + bx$ → $(x + \\frac{b}{2})^2 - (\\frac{b}{2})^2$\n$x^2 + 6x + 5 = (x+3)^2 - 9 + 5 = (x+3)^2 - 4$\nVertex form: vertex at $(-3, -4)$.' },
    onWrong: { zh: '括号里取 $b$ 的一半，不是直接放 $b$！\n$b=6$ → 一半 $= 3$ → $(x+3)^2$。然后减去 $3^2=9$，加上原常数 5。', en: 'Inside the bracket, take half of $b$, not $b$ itself!\n$b=6$ → half $= 3$ → $(x+3)^2$. Then subtract $3^2=9$, add original constant 5.' },
    onSkip: { zh: '配方：$(x+\\frac{b}{2})^2 - (\\frac{b}{2})^2 + c$。括号里放 $b$ 的一半。', en: 'Complete square: $(x+\\frac{b}{2})^2 - (\\frac{b}{2})^2 + c$. Half of $b$ inside bracket.' },
  }],
  9169: [{
    prompt: { zh: '双线夹击！$x + y = 7$ 且 $2x - y = 5$。怎么解？', en: 'Pincer attack! $x + y = 7$ and $2x - y = 5$. How to solve?' },
    type: 'choice',
    choices: [
      { zh: '两式相加消去 $y$：$3x = 12$，$x = 4$', en: 'Add both equations to eliminate $y$: $3x = 12$, $x = 4$' },
      { zh: '两式相乘', en: 'Multiply both equations together' },
    ],
    onCorrect: { zh: '消元法！$y$ 和 $-y$ 相加刚好消去。\n$(x+y) + (2x-y) = 7+5$ → $3x = 12$ → $x = 4$\n代回：$4 + y = 7$ → $y = 3$。解 $(4, 3)$。', en: 'Elimination! $y$ and $-y$ cancel when added.\n$(x+y) + (2x-y) = 7+5$ → $3x = 12$ → $x = 4$\nSubstitute back: $4 + y = 7$ → $y = 3$. Solution $(4, 3)$.' },
    onWrong: { zh: '方程不能相乘！用消元法（加减）或代入法。\n这里 $y$ 和 $-y$ 相加正好消去。', en: 'Equations can\'t be multiplied together! Use elimination (add/subtract) or substitution.\nHere $y$ and $-y$ cancel when added.' },
    onSkip: { zh: '联立方程：消元法(加减消变量)或代入法。解完一个变量代回求另一个。', en: 'Simultaneous equations: elimination (add/subtract) or substitution. Solve one, substitute back.' },
  }],
  9170: [{
    prompt: { zh: '直线 $y = 2x + 1$ 和圆 $x^2 + y^2 = 25$。交点怎么求？', en: 'Line $y = 2x + 1$ and circle $x^2 + y^2 = 25$. How to find intersections?' },
    type: 'choice',
    choices: [
      { zh: '把 $y = 2x+1$ 代入圆方程，解二次方程', en: 'Substitute $y = 2x+1$ into circle equation, solve quadratic' },
      { zh: '画图估算', en: 'Draw a graph and estimate' },
    ],
    onCorrect: { zh: '代入法！$x^2 + (2x+1)^2 = 25$\n$x^2 + 4x^2 + 4x + 1 = 25$ → $5x^2 + 4x - 24 = 0$\n解这个二次方程得到两个 $x$，代回求 $y$。', en: 'Substitution! $x^2 + (2x+1)^2 = 25$\n$x^2 + 4x^2 + 4x + 1 = 25$ → $5x^2 + 4x - 24 = 0$\nSolve this quadratic for two $x$ values, substitute back for $y$.' },
    onWrong: { zh: '画图只能估算。精确交点要用代数——把直线方程代入圆方程。', en: 'Drawing only gives estimates. Exact intersections need algebra — substitute line into circle.' },
    onSkip: { zh: '直线与曲线交点：代入法化为一个方程，解出坐标。', en: 'Line-curve intersection: substitute to get one equation, solve for coordinates.' },
  }],

  // === Unit 17: 对称与变换 ===
  9172: [{
    prompt: { zh: '点 $(3, 5)$ 关于 $x$ 轴反射。新坐标？', en: 'Point $(3, 5)$ reflected in the x-axis. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(3, -5)$——$x$ 不变，$y$ 变号', en: '$(3, -5)$ — $x$ stays, $y$ changes sign' },
      { zh: '$(-3, 5)$', en: '$(-3, 5)$' },
    ],
    onCorrect: { zh: '$x$ 轴反射：$(x, y) \\to (x, -y)$。水平轴当镜子，上下翻转。\n$y$ 轴反射：$(x, y) \\to (-x, y)$。左右翻转。\n记住：哪个轴当镜子，另一个坐标变号。', en: 'X-axis reflection: $(x, y) \\to (x, -y)$. Horizontal mirror, flip vertically.\nY-axis reflection: $(x, y) \\to (-x, y)$. Flip horizontally.\nRemember: the axis is the mirror, the OTHER coordinate changes sign.' },
    onWrong: { zh: '$(-3, 5)$ 是 $y$ 轴反射！$x$ 轴反射改变的是 $y$ 坐标。\n$(3, 5) \\to (3, -5)$', en: '$(-3, 5)$ is y-axis reflection! X-axis reflection changes the $y$ coordinate.\n$(3, 5) \\to (3, -5)$' },
    onSkip: { zh: '$x$ 轴反射：$y$ 变号。$y$ 轴反射：$x$ 变号。', en: 'X-axis reflection: $y$ changes sign. Y-axis reflection: $x$ changes sign.' },
  }],
  9173: [{
    prompt: { zh: '点 $(4, 1)$ 关于 $y = x$ 反射。新坐标？', en: 'Point $(4, 1)$ reflected in $y = x$. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(1, 4)$——$x$ 和 $y$ 互换', en: '$(1, 4)$ — swap $x$ and $y$' },
      { zh: '$(-4, -1)$', en: '$(-4, -1)$' },
    ],
    onCorrect: { zh: '$y = x$ 反射：$(x, y) \\to (y, x)$，坐标互换！\n$(4, 1) \\to (1, 4)$\n几何直觉：$y=x$ 是 45° 对角线，翻转后 $x$ 和 $y$ 交换角色。', en: '$y = x$ reflection: $(x, y) \\to (y, x)$, swap coordinates!\n$(4, 1) \\to (1, 4)$\nGeometric intuition: $y=x$ is the 45° diagonal, flipping swaps $x$ and $y$ roles.' },
    onWrong: { zh: '两个都变号是原点旋转 $180°$！$y=x$ 反射是互换 $x$ 和 $y$。\n$(4, 1) \\to (1, 4)$', en: 'Both changing sign is $180°$ rotation about origin! $y=x$ reflection swaps $x$ and $y$.\n$(4, 1) \\to (1, 4)$' },
    onSkip: { zh: '$y=x$ 反射：$(x,y) \\to (y,x)$。坐标互换。', en: '$y=x$ reflection: $(x,y) \\to (y,x)$. Swap coordinates.' },
  }],
  9174: [{
    prompt: { zh: '点 $(2, 5)$ 绕原点逆时针 $90°$。新坐标？', en: 'Point $(2, 5)$ rotated $90°$ anticlockwise about origin. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(-5, 2)$', en: '$(-5, 2)$' },
      { zh: '$(5, -2)$', en: '$(5, -2)$' },
    ],
    onCorrect: { zh: '逆时针 $90°$：$(x, y) \\to (-y, x)$。\n$(2, 5) \\to (-5, 2)$\n记忆：逆时针 → $y$ 变负放前面，$x$ 放后面。', en: 'ACW $90°$: $(x, y) \\to (-y, x)$.\n$(2, 5) \\to (-5, 2)$\nMemory: anticlockwise → negate $y$ put first, $x$ goes second.' },
    onWrong: { zh: '$(5, -2)$ 是顺时针 $90°$：$(x,y) \\to (y, -x)$。\n逆时针 $90°$：$(x,y) \\to (-y, x)$。方向搞反了！', en: '$(5, -2)$ is clockwise $90°$: $(x,y) \\to (y, -x)$.\nAnticlockwise $90°$: $(x,y) \\to (-y, x)$. Direction is reversed!' },
    onSkip: { zh: '逆时针 $90°$：$(-y, x)$。顺时针 $90°$：$(y, -x)$。', en: 'ACW $90°$: $(-y, x)$. CW $90°$: $(y, -x)$.' },
  }],
  9175: [{
    prompt: { zh: '点 $(3, -2)$ 绕原点旋转 $180°$。新坐标？', en: 'Point $(3, -2)$ rotated $180°$ about origin. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(-3, 2)$——两个坐标都变号', en: '$(-3, 2)$ — both coordinates change sign' },
      { zh: '$(3, 2)$', en: '$(3, 2)$' },
    ],
    onCorrect: { zh: '$180°$ 旋转：$(x, y) \\to (-x, -y)$。两个坐标都变号。\n这和关于原点的点对称是一回事！\n$(3, -2) \\to (-3, 2)$', en: '$180°$ rotation: $(x, y) \\to (-x, -y)$. Both coordinates negate.\nThis is the same as point symmetry about the origin!\n$(3, -2) \\to (-3, 2)$' },
    onWrong: { zh: '$(3, 2)$ 只改了 $y$ 的符号——那是 $x$ 轴反射！\n$180°$ 旋转：两个坐标都变号。$(-3, 2)$。', en: '$(3, 2)$ only changed $y$\'s sign — that\'s x-axis reflection!\n$180°$ rotation: both coordinates negate. $(-3, 2)$.' },
    onSkip: { zh: '$180°$ 旋转 = 原点对称：$(x,y) \\to (-x,-y)$。', en: '$180°$ rotation = point symmetry about origin: $(x,y) \\to (-x,-y)$.' },
  }],
  9176: [{
    prompt: { zh: '点 $(3, 4)$ 以原点为中心放大 2 倍。新坐标？', en: 'Point $(3, 4)$ enlarged by factor 2 from origin. New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(6, 8)$', en: '$(6, 8)$' },
      { zh: '$(5, 6)$', en: '$(5, 6)$' },
    ],
    onCorrect: { zh: '以原点为中心放大 $k$ 倍：$(x,y) \\to (kx, ky)$。\n$(3,4) \\to (6, 8)$。\n距离原点的距离也变为 $k$ 倍。', en: 'Enlargement factor $k$ from origin: $(x,y) \\to (kx, ky)$.\n$(3,4) \\to (6, 8)$.\nDistance from origin also multiplied by $k$.' },
    onWrong: { zh: '放大不是加 2！是乘以 2。$(3,4) \\times 2 = (6, 8)$。', en: 'Enlargement isn\'t adding 2! It\'s multiplying by 2. $(3,4) \\times 2 = (6, 8)$.' },
    onSkip: { zh: '放大 $k$ 倍(原点)：$(x,y) \\to (kx, ky)$。', en: 'Enlargement $k$ (from origin): $(x,y) \\to (kx, ky)$.' },
  }],
  9177: [{
    prompt: { zh: '点 $(8, 6)$ 以原点为中心缩小一半(放大因子 $\\frac{1}{2}$)。新坐标？', en: 'Point $(8, 6)$ reduced by half from origin (scale factor $\\frac{1}{2}$). New coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(4, 3)$', en: '$(4, 3)$' },
      { zh: '$(7, 5)$', en: '$(7, 5)$' },
    ],
    onCorrect: { zh: '缩小 = 放大因子 $0 < k < 1$。\n$(8, 6) \\times \\frac{1}{2} = (4, 3)$\n放大和缩小用同一个公式，只是 $k$ 的大小不同。', en: 'Reduction = scale factor $0 < k < 1$.\n$(8, 6) \\times \\frac{1}{2} = (4, 3)$\nEnlargement and reduction use the same formula, just different $k$ values.' },
    onWrong: { zh: '$(7, 5)$ 是减了 1——缩小不是减法！缩小是乘以分数。\n$(8, 6) \\times \\frac{1}{2} = (4, 3)$', en: '$(7, 5)$ subtracted 1 — reduction isn\'t subtraction! It\'s multiplying by a fraction.\n$(8, 6) \\times \\frac{1}{2} = (4, 3)$' },
    onSkip: { zh: '缩小 = 乘以 $k$（$0 < k < 1$）。和放大同一公式。', en: 'Reduction = multiply by $k$ ($0 < k < 1$). Same formula as enlargement.' },
  }],
  9178: [{
    prompt: { zh: '点 $(2, 3)$ 先关于 $x$ 轴反射，再放大 2 倍。最终坐标？', en: 'Point $(2, 3)$: reflect in x-axis, then enlarge by 2. Final coordinates?' },
    type: 'choice',
    choices: [
      { zh: '$(2, -3) \\to (4, -6)$', en: '$(2, -3) \\to (4, -6)$' },
      { zh: '$(4, 6) \\to (4, -6)$', en: '$(4, 6) \\to (4, -6)$' },
    ],
    onCorrect: { zh: '组合变换：按顺序执行！\n1. $x$ 轴反射：$(2, 3) \\to (2, -3)$\n2. 放大 2 倍：$(2, -3) \\to (4, -6)$\n顺序很重要——先放大再反射可能结果不同。', en: 'Combined transformations: apply in order!\n1. X-axis reflection: $(2, 3) \\to (2, -3)$\n2. Enlargement ×2: $(2, -3) \\to (4, -6)$\nOrder matters — enlarge then reflect may give different results.' },
    onWrong: { zh: '顺序颠倒了！先反射再放大。\n反射：$(2,3) \\to (2,-3)$。放大：$(2,-3) \\to (4,-6)$。', en: 'Order is reversed! Reflect first, then enlarge.\nReflect: $(2,3) \\to (2,-3)$. Enlarge: $(2,-3) \\to (4,-6)$.' },
    onSkip: { zh: '组合变换：严格按给定顺序逐步执行。顺序不同可能结果不同。', en: 'Combined transformations: apply strictly in given order. Different order may give different results.' },
  }],

  // === Unit 18: 统计补充 ===
  9180: [{
    prompt: { zh: '数据有极端值(如一人军饷特别高)。用平均数还是中位数更合适？', en: 'Data has an outlier (e.g., one very high salary). Mean or median more appropriate?' },
    type: 'choice',
    choices: [
      { zh: '中位数——不受极端值影响', en: 'Median — not affected by outliers' },
      { zh: '平均数——考虑了所有数据', en: 'Mean — considers all data' },
    ],
    onCorrect: { zh: '中位数对极端值"免疫"，因为只看中间位置。\n平均数会被极端值拉偏（一个超大值拉高整体）。\n考试常问：有偏态数据时为什么选中位数。', en: 'Median is "immune" to outliers — only looks at the middle position.\nMean gets pulled by extremes (one huge value raises the overall).\nExam often asks: why choose median for skewed data.' },
    onWrong: { zh: '平均数虽然用了所有数据，但极端值会严重扭曲它！\n一个人年薪百万，其他人年薪 5 万——平均数不代表"典型"。', en: 'Mean uses all data but extremes badly distort it!\nOne person earning millions, others earning 50k — mean doesn\'t represent "typical".' },
    onSkip: { zh: '有极端值/偏态数据 → 用中位数。对称分布 → 平均数更好。', en: 'With outliers/skewed data → use median. Symmetric distribution → mean is better.' },
  }],

  // === Unit 19: 分式与数列 ===
  9182: [{
    prompt: { zh: '$\\frac{6x^2}{3x}$ 怎么化简？', en: 'How to simplify $\\frac{6x^2}{3x}$?' },
    type: 'choice',
    choices: [
      { zh: '$2x$——数字约分，$x$ 指数相减', en: '$2x$ — divide numbers, subtract exponents for $x$' },
      { zh: '$2x^2$', en: '$2x^2$' },
    ],
    onCorrect: { zh: '分式约分：数字÷数字，同底指数相减。\n$\\frac{6x^2}{3x} = \\frac{6}{3} \\times \\frac{x^2}{x} = 2 \\times x^{2-1} = 2x$', en: 'Fraction simplification: divide numbers, subtract exponents for same base.\n$\\frac{6x^2}{3x} = \\frac{6}{3} \\times \\frac{x^2}{x} = 2 \\times x^{2-1} = 2x$' },
    onWrong: { zh: '分母的 $x$ 也要约掉！$\\frac{x^2}{x} = x^{2-1} = x$，不是 $x^2$。\n$\\frac{6x^2}{3x} = 2x$', en: 'The $x$ in the denominator also cancels! $\\frac{x^2}{x} = x^{2-1} = x$, not $x^2$.\n$\\frac{6x^2}{3x} = 2x$' },
    onSkip: { zh: '代数分式约分：系数相除，同底变量指数相减。', en: 'Algebraic fraction: divide coefficients, subtract exponents for same base variables.' },
  }],
  9184: [{
    prompt: { zh: '等比数列 $2, 6, 18, ...$。第 $n$ 项怎么求？', en: 'Geometric sequence $2, 6, 18, ...$. How to find the $n$th term?' },
    type: 'choice',
    choices: [
      { zh: '$a_n = 2 \\times 3^{n-1}$——首项 × 公比$^{n-1}$', en: '$a_n = 2 \\times 3^{n-1}$ — first term × ratio$^{n-1}$' },
      { zh: '$a_n = 2 + 4(n-1)$', en: '$a_n = 2 + 4(n-1)$' },
    ],
    onCorrect: { zh: '等比数列通项：$a_n = a_1 \\times r^{n-1}$\n首项 $a_1 = 2$，公比 $r = \\frac{6}{2} = 3$\n$a_n = 2 \\times 3^{n-1}$\n等差才用加法公式。', en: 'Geometric sequence: $a_n = a_1 \\times r^{n-1}$\nFirst term $a_1 = 2$, ratio $r = \\frac{6}{2} = 3$\n$a_n = 2 \\times 3^{n-1}$\nArithmetic uses the addition formula.' },
    onWrong: { zh: '$2 + 4(n-1)$ 是等差数列的公式！这里是等比(每次乘 3)。\n$a_n = a_1 \\times r^{n-1} = 2 \\times 3^{n-1}$', en: '$2 + 4(n-1)$ is the arithmetic formula! This is geometric (multiply by 3 each time).\n$a_n = a_1 \\times r^{n-1} = 2 \\times 3^{n-1}$' },
    onSkip: { zh: '等比通项：$a_n = a_1 \\times r^{n-1}$。等差：$a_n = a_1 + (n-1)d$。', en: 'Geometric: $a_n = a_1 \\times r^{n-1}$. Arithmetic: $a_n = a_1 + (n-1)d$.' },
  }],
  9186: [{
    prompt: { zh: '两点 $(1, 3)$ 和 $(5, 7)$ 的中点？', en: 'Midpoint of $(1, 3)$ and $(5, 7)$?' },
    type: 'choice',
    choices: [
      { zh: '$(3, 5)$——各坐标取平均', en: '$(3, 5)$ — average each coordinate' },
      { zh: '$(4, 4)$——各坐标相减', en: '$(4, 4)$ — subtract each coordinate' },
    ],
    onCorrect: { zh: '中点 = $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right) = \\left(\\frac{1+5}{2}, \\frac{3+7}{2}\\right) = (3, 5)$', en: 'Midpoint = $\\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right) = \\left(\\frac{1+5}{2}, \\frac{3+7}{2}\\right) = (3, 5)$' },
    onWrong: { zh: '相减得到的是差/向量！中点是取平均(相加÷2)。\n$M = \\left(\\frac{1+5}{2}, \\frac{3+7}{2}\\right) = (3, 5)$', en: 'Subtraction gives difference/vector! Midpoint averages (add ÷ 2).\n$M = \\left(\\frac{1+5}{2}, \\frac{3+7}{2}\\right) = (3, 5)$' },
    onSkip: { zh: '中点：各坐标相加除以 2。$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$。', en: 'Midpoint: add coordinates and divide by 2. $M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$.' },
  }],
  9187: [{
    prompt: { zh: '已知斜率 $m = 2$ 和一个点 $(1, 5)$。直线方程？', en: 'Given gradient $m = 2$ and point $(1, 5)$. Line equation?' },
    type: 'choice',
    choices: [
      { zh: '$5 = 2(1) + c$ → $c = 3$ → $y = 2x + 3$', en: '$5 = 2(1) + c$ → $c = 3$ → $y = 2x + 3$' },
      { zh: '$y = 2x + 5$', en: '$y = 2x + 5$' },
    ],
    onCorrect: { zh: '已知斜率和一点：代入 $y = mx + c$ 求 $c$。\n$5 = 2(1) + c$ → $c = 3$\n方程：$y = 2x + 3$', en: 'Given gradient and a point: substitute into $y = mx + c$ for $c$.\n$5 = 2(1) + c$ → $c = 3$\nEquation: $y = 2x + 3$' },
    onWrong: { zh: '不能直接把 $y$ 坐标当截距！要代入计算。\n$5 = 2(1) + c$ → $c = 5 - 2 = 3$。$y = 2x + 3$', en: 'Can\'t just use the y-coordinate as intercept! Must substitute and calculate.\n$5 = 2(1) + c$ → $c = 5 - 2 = 3$. $y = 2x + 3$' },
    onSkip: { zh: '斜率 + 一点 → 代入 $y = mx + c$ 求截距 $c$。', en: 'Gradient + a point → substitute into $y = mx + c$ to find intercept $c$.' },
  }],
  9188: [{
    prompt: { zh: '两条直线 $y = x + 1$ 和 $y = 3x - 5$ 的交点怎么求？', en: 'Intersection of $y = x + 1$ and $y = 3x - 5$?' },
    type: 'choice',
    choices: [
      { zh: '令两个 $y$ 相等：$x + 1 = 3x - 5$，解 $x$', en: 'Set both $y$ equal: $x + 1 = 3x - 5$, solve for $x$' },
      { zh: '代入 $x = 0$', en: 'Substitute $x = 0$' },
    ],
    onCorrect: { zh: '交点 = 两方程同时成立。两个都等于 $y$，所以令右边相等。\n$x + 1 = 3x - 5$ → $6 = 2x$ → $x = 3$\n$y = 3 + 1 = 4$。交点 $(3, 4)$。', en: 'Intersection = both equations hold. Both equal $y$, so set right sides equal.\n$x + 1 = 3x - 5$ → $6 = 2x$ → $x = 3$\n$y = 3 + 1 = 4$. Intersection $(3, 4)$.' },
    onWrong: { zh: '$x=0$ 只给你 $y$ 轴上的截距，不是交点！\n交点：令 $y_1 = y_2$，解出 $x$，再求 $y$。', en: '$x=0$ only gives y-intercepts, not the intersection!\nIntersection: set $y_1 = y_2$, solve for $x$, then find $y$.' },
    onSkip: { zh: '两线交点：令 $y_1 = y_2$（或联立方程），解 $x$ 后代回求 $y$。', en: 'Line intersection: set $y_1 = y_2$ (or solve simultaneous), find $x$ then $y$.' },
  }],

  // === Unit 19b: 相似与概率补充 ===
  9191: [{
    prompt: { zh: '两个相似立体，线性比 $k = 2$。体积比是多少？', en: 'Two similar solids, linear ratio $k = 2$. What\'s the volume ratio?' },
    type: 'choice',
    choices: [
      { zh: '$k^3 = 2^3 = 8$', en: '$k^3 = 2^3 = 8$' },
      { zh: '$k^2 = 2^2 = 4$', en: '$k^2 = 2^2 = 4$' },
    ],
    onCorrect: { zh: '相似比的规律：\n长度比 = $k$\n面积比 = $k^2$\n体积比 = $k^3$\n尺寸每加一维，比值多乘一次 $k$。', en: 'Similar ratio rules:\nLength ratio = $k$\nArea ratio = $k^2$\nVolume ratio = $k^3$\nEach added dimension multiplies the ratio by another $k$.' },
    onWrong: { zh: '$k^2$ 是面积比！体积是三维的，所以体积比 = $k^3$。\n线性比 2 → 面积比 4 → 体积比 8。', en: '$k^2$ is the area ratio! Volume is 3D, so volume ratio = $k^3$.\nLinear ratio 2 → area ratio 4 → volume ratio 8.' },
    onSkip: { zh: '长度比 $k$，面积比 $k^2$，体积比 $k^3$。维度决定幂次。', en: 'Length ratio $k$, area ratio $k^2$, volume ratio $k^3$. Dimension determines power.' },
  }],
  9192: [{
    prompt: { zh: '三角形 ABC 和 DEF 相似。$AB = 6$, $DE = 9$, $BC = 8$。$EF$ 等于多少？', en: 'Triangles ABC and DEF are similar. $AB = 6$, $DE = 9$, $BC = 8$. Find $EF$.' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{DE}{AB} = \\frac{9}{6} = 1.5$，$EF = 8 \\times 1.5 = 12$', en: '$\\frac{DE}{AB} = \\frac{9}{6} = 1.5$, $EF = 8 \\times 1.5 = 12$' },
      { zh: '$EF = 8 + 3 = 11$', en: '$EF = 8 + 3 = 11$' },
    ],
    onCorrect: { zh: '相似三角形对应边成比例！\n缩放因子 $k = \\frac{DE}{AB} = \\frac{9}{6} = 1.5$\n$EF = BC \\times k = 8 \\times 1.5 = 12$', en: 'Similar triangles have proportional corresponding sides!\nScale factor $k = \\frac{DE}{AB} = \\frac{9}{6} = 1.5$\n$EF = BC \\times k = 8 \\times 1.5 = 12$' },
    onWrong: { zh: '加 3 不对！相似是乘法关系(比例)，不是加法。\n$k = \\frac{9}{6} = 1.5$，$EF = 8 \\times 1.5 = 12$', en: 'Adding 3 is wrong! Similarity uses multiplication (ratio), not addition.\n$k = \\frac{9}{6} = 1.5$, $EF = 8 \\times 1.5 = 12$' },
    onSkip: { zh: '相似：求缩放因子 $k$，再用 $k$ 乘以对应边。是乘法不是加法。', en: 'Similar: find scale factor $k$, multiply corresponding side by $k$. Multiplication, not addition.' },
  }],
  9193: [{
    prompt: { zh: '两个三角形的三组角都相等(AAA)。能证明全等吗？', en: 'Two triangles have all three angles equal (AAA). Are they congruent?' },
    type: 'choice',
    choices: [
      { zh: '不能——AAA 只能证相似，不能证全等', en: 'No — AAA only proves similarity, not congruence' },
      { zh: '能——角都一样就一定全等', en: 'Yes — same angles means congruent' },
    ],
    onCorrect: { zh: 'AAA 证明形状相同(相似)，但大小可以不同！\n全等需要至少一条边的信息：SSS, SAS, ASA, AAS, RHS。\n相似 ≠ 全等。', en: 'AAA proves same shape (similar), but size can differ!\nCongruence needs at least one side: SSS, SAS, ASA, AAS, RHS.\nSimilar ≠ congruent.' },
    onWrong: { zh: '角相等只保证形状一样！大三角形和小三角形可以角度完全相同。\nAAA → 相似。全等要有边的信息。', en: 'Equal angles only guarantee same shape! A large and small triangle can have identical angles.\nAAA → similar. Congruence needs side information.' },
    onSkip: { zh: 'AAA = 相似(形状相同)。全等 = 形状+大小相同，需要边的条件。', en: 'AAA = similar (same shape). Congruent = same shape + size, needs side conditions.' },
  }],
  9195: [{
    prompt: { zh: '掷骰子和抛硬币是独立事件。$P(6) = \\frac{1}{6}$，$P(\\text{正面}) = \\frac{1}{2}$。同时发生的概率？', en: 'Rolling die and flipping coin are independent. $P(6) = \\frac{1}{6}$, $P(heads) = \\frac{1}{2}$. Probability of both?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$', en: '$\\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$' },
      { zh: '$\\frac{1}{6} + \\frac{1}{2} = \\frac{2}{3}$', en: '$\\frac{1}{6} + \\frac{1}{2} = \\frac{2}{3}$' },
    ],
    onCorrect: { zh: '独立事件"同时发生" = 概率相乘。\n$P(A \\cap B) = P(A) \\times P(B) = \\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$\n独立 = 一个事件不影响另一个。', en: 'Independent events "both happening" = multiply probabilities.\n$P(A \\cap B) = P(A) \\times P(B) = \\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$\nIndependent = one event doesn\'t affect the other.' },
    onWrong: { zh: '加法用于"或"(OR)，不是"且"(AND)！\n"都发生" = 乘法：$\\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$', en: 'Addition is for "or" (OR), not "and" (AND)!\n"Both happen" = multiplication: $\\frac{1}{6} \\times \\frac{1}{2} = \\frac{1}{12}$' },
    onSkip: { zh: '独立事件：$P(A \\cap B) = P(A) \\times P(B)$。AND = 乘，OR = 加。', en: 'Independent events: $P(A \\cap B) = P(A) \\times P(B)$. AND = multiply, OR = add.' },
  }],
  9196: [{
    prompt: { zh: '下雨的概率是 $0.3$。不下雨的概率？', en: 'Probability of rain is $0.3$. Probability of no rain?' },
    type: 'choice',
    choices: [
      { zh: '$1 - 0.3 = 0.7$', en: '$1 - 0.3 = 0.7$' },
      { zh: '$0.3 \\times 0.3 = 0.09$', en: '$0.3 \\times 0.3 = 0.09$' },
    ],
    onCorrect: { zh: '补事件：$P(\\text{非}A) = 1 - P(A)$\n所有可能概率之和 = 1。$P(\\text{雨}) + P(\\text{无雨}) = 1$\n$P(\\text{无雨}) = 1 - 0.3 = 0.7$', en: 'Complement: $P(\\text{not }A) = 1 - P(A)$\nAll probabilities sum to 1. $P(rain) + P(no\\ rain) = 1$\n$P(no\\ rain) = 1 - 0.3 = 0.7$' },
    onWrong: { zh: '概率相乘是"连续两天都下雨"——不是补事件！\n$P(\\text{非}A) = 1 - P(A) = 1 - 0.3 = 0.7$', en: 'Multiplying probabilities is "rain on two consecutive days" — not complement!\n$P(\\text{not }A) = 1 - P(A) = 1 - 0.3 = 0.7$' },
    onSkip: { zh: '补事件：$P(\\text{非}A) = 1 - P(A)$。概率总和 = 1。', en: 'Complement: $P(\\text{not }A) = 1 - P(A)$. Probabilities sum to 1.' },
  }],
  9197: [{
    prompt: { zh: '两个骰子同时掷。有多少种组合？', en: 'Two dice rolled together. How many combinations?' },
    type: 'choice',
    choices: [
      { zh: '$6 \\times 6 = 36$ 种', en: '$6 \\times 6 = 36$ outcomes' },
      { zh: '$6 + 6 = 12$ 种', en: '$6 + 6 = 12$ outcomes' },
    ],
    onCorrect: { zh: '乘法原理：第一个骰子 6 种 × 第二个 6 种 = 36 种组合。\n可以画 $6 \\times 6$ 的样本空间表来列举所有可能。', en: 'Multiplication principle: die 1 has 6 outcomes × die 2 has 6 = 36 combinations.\nDraw a $6 \\times 6$ sample space grid to list all possibilities.' },
    onWrong: { zh: '加法是错的！每种第一个结果都能配 6 种第二个结果。\n$6 \\times 6 = 36$（不是 12）。列举法：画表格更清晰。', en: 'Addition is wrong! Each first outcome pairs with 6 second outcomes.\n$6 \\times 6 = 36$ (not 12). Listing method: draw a grid for clarity.' },
    onSkip: { zh: '乘法原理：$m$ 种 × $n$ 种 = $m \\times n$ 种组合。两骰子 = 36 种。', en: 'Multiplication principle: $m \\times n$ total outcomes. Two dice = 36.' },
  }],
  9198: [{
    prompt: { zh: '互斥事件是什么意思？', en: 'What does "mutually exclusive" mean?' },
    type: 'choice',
    choices: [
      { zh: '不能同时发生——$P(A \\cap B) = 0$', en: 'Cannot happen at the same time — $P(A \\cap B) = 0$' },
      { zh: '一定同时发生', en: 'Must happen together' },
    ],
    onCorrect: { zh: '互斥 = 不相容 = 不能同时发生。\n例：一枚硬币不能同时正面和反面。\n$P(A \\cap B) = 0$。韦恩图中两圆不重叠。', en: 'Mutually exclusive = incompatible = cannot happen simultaneously.\nExample: a coin can\'t be heads AND tails.\n$P(A \\cap B) = 0$. Venn diagram: circles don\'t overlap.' },
    onWrong: { zh: '"一定同时发生"没有专门术语。互斥是反义——绝不同时发生。\n$P(A \\cap B) = 0$', en: '"Must happen together" has no standard term. Mutually exclusive means the opposite — never together.\n$P(A \\cap B) = 0$' },
    onSkip: { zh: '互斥：不能同时发生。$P(A \\cap B) = 0$。韦恩图不重叠。', en: 'Mutually exclusive: can\'t happen simultaneously. $P(A \\cap B) = 0$. No Venn overlap.' },
  }],
  9199: [{
    prompt: { zh: '事件 A 和 B 互斥。$P(A) = 0.3$，$P(B) = 0.5$。$P(A \\text{ 或 } B)$ = ？', en: 'Events A and B are mutually exclusive. $P(A) = 0.3$, $P(B) = 0.5$. $P(A \\text{ or } B)$ = ?' },
    type: 'choice',
    choices: [
      { zh: '$0.3 + 0.5 = 0.8$', en: '$0.3 + 0.5 = 0.8$' },
      { zh: '$0.3 \\times 0.5 = 0.15$', en: '$0.3 \\times 0.5 = 0.15$' },
    ],
    onCorrect: { zh: '互斥事件的"或"直接加！\n$P(A \\cup B) = P(A) + P(B) = 0.8$\n因为 $P(A \\cap B) = 0$（不重叠），不需要减去交集。', en: 'For mutually exclusive events, "or" is simple addition!\n$P(A \\cup B) = P(A) + P(B) = 0.8$\nSince $P(A \\cap B) = 0$ (no overlap), no need to subtract intersection.' },
    onWrong: { zh: '乘法是"同时发生"(AND)。互斥事件"或"用加法。\n$P(A \\cup B) = 0.3 + 0.5 = 0.8$', en: 'Multiplication is "both" (AND). Mutually exclusive "or" uses addition.\n$P(A \\cup B) = 0.3 + 0.5 = 0.8$' },
    onSkip: { zh: '互斥+OR = 直接加：$P(A \\cup B) = P(A) + P(B)$。', en: 'Mutually exclusive + OR = direct addition: $P(A \\cup B) = P(A) + P(B)$.' },
  }],
};

// ── Insertion logic (same as y11 batch scripts) ──
const filePath = path.join(import.meta.dirname, '../src/data/missions/y9.ts');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let insertCount = 0;

const insertionPoints = new Map<number, number>();
let currentId: number | null = null;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/id: (\d+), grade: 9/);
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
