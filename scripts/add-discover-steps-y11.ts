/**
 * Add discoverSteps to Y11 missions that are missing them.
 * Run: npx tsx scripts/add-discover-steps-y11.ts
 */
import * as fs from 'fs';
import * as path from 'path';

type DiscoverStep = {
  prompt: { zh: string; en: string };
  type: 'choice';
  choices: { zh: string; en: string }[];
  onCorrect: { zh: string; en: string };
  onWrong: { zh: string; en: string };
  onSkip: { zh: string; en: string };
};

// Discover steps by mission ID — each step scaffolds the WHY before the HOW
const DISCOVER_STEPS: Record<number, DiscoverStep[]> = {
  // === DERIVATIVE_RANDOM (3) ===
  1112: [{
    prompt: { zh: '山坡有的地方陡，有的地方缓。\n你觉得怎么用一个数来描述某个位置有多陡？', en: 'Some parts of a slope are steep, others gentle.\nHow could you use a single number to describe how steep a specific point is?' },
    type: 'choice',
    choices: [
      { zh: '画一条刚好贴着坡面的直线，看它的斜率', en: 'Draw a line that just touches the curve, and measure its gradient' },
      { zh: '量两端的高度差', en: 'Measure the height difference between both ends' },
      { zh: '数一共有多少台阶', en: 'Count how many steps there are' },
    ],
    onCorrect: { zh: '没错！那条"刚好贴着"的线叫做切线。\n导数就是求切线斜率的工具。\n$y = x^n$ 的导数是 $y\' = nx^{n-1}$——指数搬下来当系数，指数减一。', en: 'Exactly! That "just touching" line is called a tangent.\nThe derivative is the tool to find the tangent\'s gradient.\n$y = x^n$ gives $y\' = nx^{n-1}$ — bring down the exponent as coefficient, reduce by 1.' },
    onWrong: { zh: '高度差描述的是整段的变化，但不够精确。\n切线是在某一点刚好贴着曲线的直线——它的斜率就是该点的"陡峭程度"。\n这就是导数：$y = x^n \\Rightarrow y\' = nx^{n-1}$', en: 'Height difference describes the whole section, but isn\'t precise enough.\nA tangent just touches the curve at one point — its gradient IS the steepness.\nThat\'s the derivative: $y = x^n \\Rightarrow y\' = nx^{n-1}$' },
    onSkip: { zh: '切线 = 在某点贴着曲线的直线。它的斜率就是那个点有多陡。\n导数是求这个斜率的工具：$y = x^n \\Rightarrow y\' = nx^{n-1}$。', en: 'A tangent touches the curve at one point. Its gradient = how steep that point is.\nDerivative finds this: $y = x^n \\Rightarrow y\' = nx^{n-1}$.' },
  }],
  1113: [{
    prompt: { zh: '粮仓容量随尺寸变化——先增后减。\n怎么找到"刚好最大"的那个点？', en: 'Granary capacity changes with size — first increases, then decreases.\nHow do you find the "exactly maximum" point?' },
    type: 'choice',
    choices: [
      { zh: '找到变化速度为零的点——从增到减的转折', en: 'Find where the rate of change is zero — the turning point from increase to decrease' },
      { zh: '试很多数看哪个最大', en: 'Try many numbers and see which is biggest' },
      { zh: '取最大的那个 $x$', en: 'Take the largest $x$' },
    ],
    onCorrect: { zh: '对！山峰处攀升速度刚好变为零。\n数学上："导数 = 0" 就是变化速度为零。\n再用二阶导判断是山峰还是山谷：$f\'\'(x) > 0$ 是谷底，$f\'\'(x) < 0$ 是山峰。', en: 'Yes! At a peak, the climb rate becomes exactly zero.\nIn math: "derivative = 0" means rate of change is zero.\nUse second derivative to tell peak from valley: $f\'\'(x) > 0$ = valley, $f\'\'(x) < 0$ = peak.' },
    onWrong: { zh: '试数太慢了！想象爬山——山顶那一瞬间，既不上升也不下降。\n数学语言：导数 = 0。\n然后用二阶导检查：$f\'\'(x) > 0$ → 谷底，$f\'\'(x) < 0$ → 山峰。', en: 'Trying numbers is too slow! Imagine climbing — at the peak, you\'re neither going up nor down.\nIn math: derivative = 0.\nThen check with second derivative: $f\'\'(x) > 0$ → valley, $f\'\'(x) < 0$ → peak.' },
    onSkip: { zh: '极值 = 变化速度为零。先求 $f\'(x) = 0$ 找候选点，再用 $f\'\'(x)$ 判断是极大还是极小。', en: 'Extremum = rate of change is zero. Find $f\'(x) = 0$ for candidates, then $f\'\'(x)$ tells max vs min.' },
  }],
  1181: [{
    prompt: { zh: '行军速度时快时慢。\n知道了位置公式 $s(t)$，怎么算出某一刻的瞬时速度？', en: 'Marching speed varies over time.\nGiven position formula $s(t)$, how do you find the instantaneous speed at a moment?' },
    type: 'choice',
    choices: [
      { zh: '对位置公式求导——导数就是速度', en: 'Differentiate the position formula — derivative IS speed' },
      { zh: '用总距离除以总时间', en: 'Divide total distance by total time' },
      { zh: '量两个时刻之间走了多远', en: 'Measure distance between two moments' },
    ],
    onCorrect: { zh: '完全正确！位置的导数 = 速度，速度的导数 = 加速度。\n$s\'(t)$ 给出 $t$ 时刻的瞬时速度——不是平均，是精确的那一刻。', en: 'Exactly! Derivative of position = velocity, derivative of velocity = acceleration.\n$s\'(t)$ gives instantaneous speed at time $t$ — not average, the exact moment.' },
    onWrong: { zh: '总距离÷总时间是平均速度，但行军速度一直在变。\n导数给出"此刻"的速度：$v(t) = s\'(t)$。导数 = 变化的瞬时速率。', en: 'Total distance ÷ total time gives average speed, but speed keeps changing.\nDerivative gives speed "right now": $v(t) = s\'(t)$. Derivative = instantaneous rate of change.' },
    onSkip: { zh: '导数 = 瞬时变化率。位置求导得速度：$v = s\'(t)$。速度求导得加速度。', en: 'Derivative = instantaneous rate of change. Differentiate position for speed: $v = s\'(t)$.' },
  }],

  // === INTEGRATION_RANDOM (5) ===
  1121: [{
    prompt: { zh: '这块农田一边是直线 $y = x$，一边是 $x$ 轴。它不是长方形。\n怎么算出它的面积？', en: 'This field has $y = x$ on one side and the x-axis on the other. It\'s not a rectangle.\nHow do you find its area?' },
    type: 'choice',
    choices: [
      { zh: '把它切成无数细条，加起来——这就是积分', en: 'Slice it into infinitely thin strips and add them up — that\'s integration' },
      { zh: '用长×宽', en: 'Use length × width' },
      { zh: '量对角线', en: 'Measure the diagonal' },
    ],
    onCorrect: { zh: '完美！积分就是"切片求和"。\n把不规则形状切成无穷多薄条，每条宽度 $dx$，高度 $f(x)$。\n面积 = $\\int f(x)\\,dx$——求导的逆运算！', en: 'Perfect! Integration is "slice and sum".\nCut irregular shapes into infinitely thin strips, each width $dx$, height $f(x)$.\nArea = $\\int f(x)\\,dx$ — the reverse of differentiation!' },
    onWrong: { zh: '长×宽只适用于矩形。这个形状边界是曲线。\n积分的思路：切成超薄的长方形条——每条高 $f(x)$，宽 $dx$——全加起来就是面积。', en: 'Length × width only works for rectangles. This shape has curved boundaries.\nIntegration: slice into ultra-thin rectangles — each height $f(x)$, width $dx$ — add them all up.' },
    onSkip: { zh: '积分 = 无穷多薄片的总和 = 曲线下方的面积。\n$\\int_a^b f(x)\\,dx$ = 从 $a$ 到 $b$ 的面积。积分是求导的逆运算。', en: 'Integration = sum of infinitely thin slices = area under a curve.\n$\\int_a^b f(x)\\,dx$ = area from $a$ to $b$. Integration reverses differentiation.' },
  }],
  1122: [{
    prompt: { zh: '河道截面是曲线形状。要计算水流总量，就需要知道截面面积。\n曲线围成的面积怎么算？', en: 'A river cross-section has a curved shape. To calculate water flow, you need the cross-section area.\nHow do you find the area enclosed by a curve?' },
    type: 'choice',
    choices: [
      { zh: '用定积分——上限减下限求面积', en: 'Use definite integration — substitute upper and lower limits' },
      { zh: '画格子数格子数', en: 'Draw a grid and count squares' },
    ],
    onCorrect: { zh: '对！定积分就是带上下限的积分。\n先求不定积分（反导数），再代入上限减下限：$[F(x)]_a^b = F(b) - F(a)$。', en: 'Yes! A definite integral is integration with limits.\nFind the antiderivative first, then substitute: $[F(x)]_a^b = F(b) - F(a)$.' },
    onWrong: { zh: '数格子太不精确了！积分用数学精确计算。\n步骤：先积分得 $F(x)$，再代入上下限：$F(b) - F(a)$。', en: 'Counting squares is too imprecise! Integration calculates exactly.\nStep: find antiderivative $F(x)$, then substitute limits: $F(b) - F(a)$.' },
    onSkip: { zh: '定积分步骤：积分 → 代入上限 → 减去代入下限。$\\int_a^b f(x)dx = F(b) - F(a)$。', en: 'Definite integral: integrate → substitute upper limit → subtract lower limit. $\\int_a^b f(x)dx = F(b) - F(a)$.' },
  }],
  1123: [{
    prompt: { zh: '不同积分给出不同形状的面积。\n$\\int x^n\\,dx$ 的结果是什么规律？', en: 'Different integrals give areas of different shapes.\nWhat\'s the pattern for $\\int x^n\\,dx$?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{x^{n+1}}{n+1} + C$——指数加一，除以新指数', en: '$\\frac{x^{n+1}}{n+1} + C$ — add 1 to power, divide by new power' },
      { zh: '$nx^{n-1}$——指数减一', en: '$nx^{n-1}$ — subtract 1 from power' },
    ],
    onCorrect: { zh: '你已经掌握了积分法则的核心！\n求导是指数减一，积分刚好反过来——指数加一再除。\n别忘了 $+C$（不定积分的常数）。定积分代入上下限后 $C$ 会消掉。', en: 'You\'ve got the core integration rule!\nDifferentiation subtracts 1 from the power, integration reverses — add 1 then divide.\nDon\'t forget $+C$ (constant for indefinite). It cancels out in definite integrals.' },
    onWrong: { zh: '$nx^{n-1}$ 是求导法则！积分是求导的逆运算：\n指数加 1，除以新指数：$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$。', en: '$nx^{n-1}$ is the differentiation rule! Integration is the reverse:\nAdd 1 to power, divide by new power: $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$.' },
    onSkip: { zh: '积分法则：$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$。指数加一，除以新指数。求导的逆运算。', en: 'Integration rule: $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$. Add 1 to power, divide. Reverse of differentiation.' },
  }],
  1182: [{
    prompt: { zh: '粮草消耗率随时间变化。知道每小时消耗率 $r(t)$，怎么算总消耗量？', en: 'Supply consumption rate varies over time. Given rate $r(t)$ per hour, how to find total consumption?' },
    type: 'choice',
    choices: [
      { zh: '对消耗率积分——积分把"速率"变成"总量"', en: 'Integrate the rate — integration turns "rate" into "total"' },
      { zh: '用最高消耗率乘以总时间', en: 'Multiply peak rate by total time' },
    ],
    onCorrect: { zh: '正是如此！积分的另一层含义：速率 → 总量。\n$\\int_0^T r(t)\\,dt$ = 从 0 到 $T$ 时刻的总消耗。导数把总量变速率，积分反过来。', en: 'Exactly! Integration\'s other meaning: rate → total.\n$\\int_0^T r(t)\\,dt$ = total consumption from 0 to $T$. Derivatives turn total into rate, integration reverses.' },
    onWrong: { zh: '峰值×时间会高估——因为消耗率一直在变。\n积分考虑了每一刻的变化：$\\int r(t)\\,dt$ = 精确的总消耗。', en: 'Peak × time overestimates — the rate keeps changing.\nIntegration accounts for every moment: $\\int r(t)\\,dt$ = exact total consumption.' },
    onSkip: { zh: '积分把变化率变成总量。$\\int_a^b r(t)\\,dt$ = 从 $a$ 到 $b$ 的累积总量。', en: 'Integration turns rate into total. $\\int_a^b r(t)\\,dt$ = accumulated total from $a$ to $b$.' },
  }],
  1183: [{
    prompt: { zh: '行军补给需要计算沿途的总补给量。如果补给密度沿路线变化，怎么算总量？', en: 'March resupply needs total along a route. If supply density varies along the path, how to find the total?' },
    type: 'choice',
    choices: [
      { zh: '对密度函数做定积分', en: 'Take the definite integral of the density function' },
      { zh: '用平均密度乘以路程', en: 'Multiply average density by distance' },
    ],
    onCorrect: { zh: '完美！当密度不均匀时，积分是唯一精确的方法。\n$\\int_a^b \\rho(x)\\,dx$ = 从 $a$ 到 $b$ 的总量。这和求面积本质一样——曲线下方的面积。', en: 'Perfect! When density isn\'t uniform, integration is the only exact method.\n$\\int_a^b \\rho(x)\\,dx$ = total from $a$ to $b$. Same as finding area — the area under the curve.' },
    onWrong: { zh: '平均密度×路程只是近似。积分把路线切成无穷多小段，\n每段用局部密度计算，全加起来 = 精确总量。', en: 'Average × distance is just an approximation. Integration slices the route into infinitely small pieces,\neach using local density, adding all up = exact total.' },
    onSkip: { zh: '不均匀分布 → 积分求总量。$\\int_a^b f(x)\\,dx$ = 曲线下方面积 = 累积总量。', en: 'Non-uniform distribution → integrate for total. $\\int_a^b f(x)\\,dx$ = area under curve = accumulated total.' },
  }],

  // === SEQUENCES (3) ===
  1131: [{
    prompt: { zh: '运粮队每天的运量形成一个数列：3, 6, 9, 12...\n你能看出规律吗？', en: 'The supply convoy\'s daily loads form a sequence: 3, 6, 9, 12...\nCan you see the pattern?' },
    type: 'choice',
    choices: [
      { zh: '每次加3——等差数列', en: 'Adding 3 each time — arithmetic sequence' },
      { zh: '每次乘2——等比数列', en: 'Multiplying by 2 each time — geometric sequence' },
    ],
    onCorrect: { zh: '对！公差 $d = 3$，首项 $a = 3$。\n等差数列通项公式：$a_n = a + (n-1)d$\n想求第 $n$ 天的运量？代入即可。', en: 'Yes! Common difference $d = 3$, first term $a = 3$.\nArithmetic sequence formula: $a_n = a + (n-1)d$\nWant the $n$th day\'s load? Just substitute.' },
    onWrong: { zh: '看差值：$6-3=3$，$9-6=3$，$12-9=3$——每次加 3，是等差数列。\n通项公式：$a_n = a + (n-1)d$，其中 $a=3$，$d=3$。', en: 'Check differences: $6-3=3$, $9-6=3$, $12-9=3$ — adding 3 each time = arithmetic.\nFormula: $a_n = a + (n-1)d$, where $a=3$, $d=3$.' },
    onSkip: { zh: '等差数列：相邻两项差相同。公差 $d$，首项 $a$。\n通项：$a_n = a + (n-1)d$。', en: 'Arithmetic sequence: constant difference between terms. Common difference $d$, first term $a$.\nFormula: $a_n = a + (n-1)d$.' },
  }],
  1132: [{
    prompt: { zh: '知道数列的规律后，怎么直接算出第 50 项，不用一个个数到 50？', en: 'Once you know the pattern, how do you find the 50th term directly without counting to 50?' },
    type: 'choice',
    choices: [
      { zh: '用通项公式 $a_n = a + (n-1)d$ 直接代入 $n=50$', en: 'Use the formula $a_n = a + (n-1)d$ and substitute $n=50$' },
      { zh: '一个个加上去', en: 'Add one by one' },
    ],
    onCorrect: { zh: '这就是通项公式的力量——一步到位！\n$a_{50} = a + 49d$，不需要算前 49 项。数学给了捷径。', en: 'That\'s the power of the formula — one step!\n$a_{50} = a + 49d$, no need for the first 49 terms. Math gives shortcuts.' },
    onWrong: { zh: '一个个加太慢了！通项公式 $a_n = a + (n-1)d$ 让你直接跳到任意一项。\n代入 $n=50$：$a_{50} = a + 49d$。', en: 'Adding one by one is too slow! The formula $a_n = a + (n-1)d$ lets you jump to any term.\nSubstitute $n=50$: $a_{50} = a + 49d$.' },
    onSkip: { zh: '通项公式 = 直达任意项的捷径。$a_n = a + (n-1)d$，代入 $n$ 即得第 $n$ 项。', en: 'The nth term formula = shortcut to any term. $a_n = a + (n-1)d$, substitute $n$ to get the $n$th term.' },
  }],
  1133: [{
    prompt: { zh: '军饷每月翻倍：1, 2, 4, 8, 16...\n这和"每次加固定数"的数列有什么不同？', en: 'Wages double monthly: 1, 2, 4, 8, 16...\nHow is this different from "adding a fixed number" each time?' },
    type: 'choice',
    choices: [
      { zh: '这是乘法增长（等比数列），不是加法增长（等差数列）', en: 'This is multiplicative growth (geometric), not additive (arithmetic)' },
      { zh: '没有区别', en: 'No difference' },
    ],
    onCorrect: { zh: '对！等比数列每项乘以固定的公比 $r$。\n$a_n = a \\cdot r^{n-1}$\n增长比等差快得多——这就是指数爆炸的力量。', en: 'Right! Geometric sequences multiply by a constant ratio $r$.\n$a_n = a \\cdot r^{n-1}$\nGrows much faster than arithmetic — the power of exponential growth.' },
    onWrong: { zh: '区别很大！$2-1=1$，$4-2=2$，$8-4=4$——差值在变大，不是等差。\n但 $2/1=4/2=8/4=2$——比值恒定！这是等比数列：$a_n = a \\cdot r^{n-1}$。', en: 'Big difference! $2-1=1$, $4-2=2$, $8-4=4$ — differences change, not arithmetic.\nBut $2/1=4/2=8/4=2$ — constant ratio! Geometric: $a_n = a \\cdot r^{n-1}$.' },
    onSkip: { zh: '等比数列：相邻两项的比值恒定（公比 $r$）。通项：$a_n = a \\cdot r^{n-1}$。', en: 'Geometric sequence: constant ratio $r$ between consecutive terms. Formula: $a_n = a \\cdot r^{n-1}$.' },
  }],

  // === STATISTICS (6) ===
  1141: [{
    prompt: { zh: '各郡粮产不同。怎么用一个数代表"整体水平"？', en: 'Grain production varies by county. How do you represent the "overall level" with one number?' },
    type: 'choice',
    choices: [
      { zh: '全部加起来除以个数——算平均值', en: 'Add them all up and divide by count — calculate the mean' },
      { zh: '取最大的那个', en: 'Take the maximum' },
    ],
    onCorrect: { zh: '对！平均值 = 总和 ÷ 个数。\n它代表"如果平均分配，每个郡分到多少"。\n$\\bar{x} = \\frac{\\sum x}{n}$', en: 'Yes! Mean = sum ÷ count.\nIt represents "if distributed equally, how much each gets".\n$\\bar{x} = \\frac{\\sum x}{n}$' },
    onWrong: { zh: '最大值只代表最好的一个郡。平均值代表整体。\n$\\bar{x} = \\frac{\\text{总和}}{n}$——全加起来，除以个数。', en: 'Maximum only represents the best county. Mean represents the whole picture.\n$\\bar{x} = \\frac{\\text{sum}}{n}$ — add all, divide by count.' },
    onSkip: { zh: '平均值 = 总和 ÷ 个数 = $\\frac{\\sum x}{n}$。代表数据的中心水平。', en: 'Mean = sum ÷ count = $\\frac{\\sum x}{n}$. Represents the central level of data.' },
  }],
  1142: [{
    prompt: { zh: '如果一个郡兵力特别多（异常值），平均值会被拉高。\n有没有不受异常值影响的代表值？', en: 'If one county has an extremely large army (outlier), the mean gets pulled up.\nIs there a representative value unaffected by outliers?' },
    type: 'choice',
    choices: [
      { zh: '中位数——排好序取中间那个', en: 'Median — sort the data and take the middle value' },
      { zh: '还是用平均值', en: 'Still use the mean' },
    ],
    onCorrect: { zh: '中位数完美抵抗异常值！\n排序后取中间：奇数个取正中，偶数个取中间两个的平均。\n当数据有极端值时，中位数比平均值更可靠。', en: 'Median perfectly resists outliers!\nSort then take the middle: odd count → exact middle, even → average of two middle values.\nWhen data has extremes, median is more reliable than mean.' },
    onWrong: { zh: '平均值会被极端值拉偏。中位数不怕——它只看位置，不看大小。\n排序 → 取中间值。这就是中位数。', en: 'Mean gets pulled by extremes. Median doesn\'t care — it only looks at position, not magnitude.\nSort → take middle. That\'s the median.' },
    onSkip: { zh: '中位数 = 排好序后的中间值。不受异常值影响，比平均值更稳定。', en: 'Median = middle value after sorting. Unaffected by outliers, more stable than mean.' },
  }],
  1143: [{
    prompt: { zh: '最常用的兵器是什么？怎么从一堆数据中找出"最常见"的那个？', en: 'What\'s the most commonly used weapon? How do you find the "most frequent" item in data?' },
    type: 'choice',
    choices: [
      { zh: '数每种出现几次，最多的就是众数', en: 'Count how many times each appears — the most frequent is the mode' },
      { zh: '取平均值', en: 'Take the mean' },
    ],
    onCorrect: { zh: '对！众数 = 出现次数最多的值。\n和平均值不同——众数可以有多个，也可能没有（所有值出现次数相同）。', en: 'Yes! Mode = the value that appears most often.\nUnlike mean — there can be multiple modes, or none (if all appear equally).' },
    onWrong: { zh: '平均值是"中心"，众数是"最常见"——不同概念。\n数一数每种兵器出现几次，最多的那个就是众数。', en: 'Mean is the "center", mode is the "most common" — different concepts.\nCount each weapon\'s frequency — the highest is the mode.' },
    onSkip: { zh: '众数 = 出现频率最高的值。一组数据可以有 0 个、1 个或多个众数。', en: 'Mode = most frequently occurring value. A dataset can have 0, 1, or multiple modes.' },
  }],
  1144: [{
    prompt: { zh: '今天伤亡 5 人，昨天伤亡 50 人。差别很大！\n怎么用一个数描述数据的"分散程度"？', en: 'Today: 5 casualties, yesterday: 50. Big difference!\nHow to describe the "spread" of data with one number?' },
    type: 'choice',
    choices: [
      { zh: '最大值减最小值 = 极差（Range）', en: 'Maximum minus minimum = Range' },
      { zh: '算平均值', en: 'Calculate the mean' },
    ],
    onCorrect: { zh: '极差是最简单的分散度量。\nRange = max - min。告诉你数据跨了多大范围。\n缺点：只看两个极端，忽略了中间。', en: 'Range is the simplest measure of spread.\nRange = max - min. Tells you how wide the data spans.\nWeakness: only looks at two extremes, ignores the middle.' },
    onWrong: { zh: '平均值描述的是"中心"，不是"分散"。\n极差 = 最大 - 最小，描述数据的宽度。', en: 'Mean describes the "center", not the "spread".\nRange = max - min, describes the width of the data.' },
    onSkip: { zh: '极差 = 最大值 - 最小值。衡量数据分散程度的最简单方法。', en: 'Range = max - min. The simplest measure of data spread.' },
  }],
  1171: [{
    prompt: { zh: '数据被分成了几组。每组有自己的频率。\n怎么用分组频率表算出总平均值？', en: 'Data is grouped into intervals, each with its frequency.\nHow do you find the overall mean from a grouped frequency table?' },
    type: 'choice',
    choices: [
      { zh: '用每组中点 × 频率，加起来再除以总频率', en: 'Use midpoint × frequency for each group, sum up, divide by total frequency' },
      { zh: '直接把所有组的中点加起来取平均', en: 'Just add all midpoints and average them' },
    ],
    onCorrect: { zh: '正确！分组均值公式：$\\bar{x} = \\frac{\\sum f \\cdot x_m}{\\sum f}$\n其中 $x_m$ 是组中点，$f$ 是频率。这是加权平均——频率越高的组对结果影响越大。', en: 'Correct! Grouped mean formula: $\\bar{x} = \\frac{\\sum f \\cdot x_m}{\\sum f}$\nwhere $x_m$ is midpoint, $f$ is frequency. This is a weighted average — higher frequency groups have more influence.' },
    onWrong: { zh: '不能直接平均中点——要考虑每组有多少数据。\n加权：$\\bar{x} = \\frac{\\sum (中点 \\times 频率)}{总频率}$。频率多的组权重更大。', en: 'Can\'t just average midpoints — must consider how much data each group has.\nWeighted: $\\bar{x} = \\frac{\\sum (midpoint \\times frequency)}{total frequency}$. Groups with more data weigh more.' },
    onSkip: { zh: '分组均值 = $\\frac{\\sum f \\cdot x_m}{\\sum f}$。用组中点代表该组，按频率加权。', en: 'Grouped mean = $\\frac{\\sum f \\cdot x_m}{\\sum f}$. Midpoint represents each group, weighted by frequency.' },
  }],
  1173: [{
    prompt: { zh: '中位数只告诉你"中间在哪"。\n如果想知道数据的"中间一半"集中在什么范围呢？', en: 'The median only tells you "where the middle is".\nWhat if you want to know the range where the "middle half" of data falls?' },
    type: 'choice',
    choices: [
      { zh: '用四分位数 Q1 和 Q3——中间 50% 的数据在 Q1 到 Q3 之间', en: 'Use quartiles Q1 and Q3 — the middle 50% falls between Q1 and Q3' },
      { zh: '用最大值和最小值', en: 'Use maximum and minimum' },
    ],
    onCorrect: { zh: '四分位数把数据分成四等份。\nQ1 = 下四分位（25%），Q2 = 中位数（50%），Q3 = 上四分位（75%）。\nIQR = Q3 - Q1 = 中间 50% 的宽度。', en: 'Quartiles split data into four equal parts.\nQ1 = lower quartile (25%), Q2 = median (50%), Q3 = upper quartile (75%).\nIQR = Q3 - Q1 = width of the middle 50%.' },
    onWrong: { zh: '最大到最小是全距（range），但它受极端值影响。\n四分位距 IQR = Q3 - Q1，只看中间 50%，更稳定。', en: 'Max to min is the range, but it\'s affected by extremes.\nIQR = Q3 - Q1, only looks at the middle 50%, much more stable.' },
    onSkip: { zh: 'Q1（25%）、Q2（50%=中位数）、Q3（75%）。IQR = Q3 - Q1 = 中间一半数据的范围。', en: 'Q1 (25%), Q2 (50% = median), Q3 (75%). IQR = Q3 - Q1 = range of the middle half.' },
  }],

  // === PROBABILITY (4) ===
  1151: [{
    prompt: { zh: '攻城有成有败。怎么用数字描述"成功的可能性"？', en: 'Sieges can succeed or fail. How do you describe "the chance of success" with a number?' },
    type: 'choice',
    choices: [
      { zh: '有利结果数 ÷ 总结果数 = 概率', en: 'Favorable outcomes ÷ total outcomes = probability' },
      { zh: '赢了就是 100%，输了就是 0%', en: 'Win = 100%, lose = 0%' },
    ],
    onCorrect: { zh: '概率就这么简单：$P = \\frac{\\text{有利}}{\\text{总共}}$\n永远在 0 到 1 之间。0 = 不可能，1 = 必然。\n$P(\\text{不发生}) = 1 - P(\\text{发生})$。', en: 'Probability is that simple: $P = \\frac{\\text{favorable}}{\\text{total}}$\nAlways between 0 and 1. 0 = impossible, 1 = certain.\n$P(\\text{not happening}) = 1 - P(\\text{happening})$.' },
    onWrong: { zh: '那是结果，不是可能性。概率在事情发生之前衡量可能性。\n$P = \\frac{\\text{成功的情况数}}{\\text{所有情况数}}$', en: 'That\'s the outcome, not the chance. Probability measures likelihood before the event.\n$P = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}$' },
    onSkip: { zh: '概率 = 有利结果 ÷ 总结果。范围 0~1。$P(\\bar{A}) = 1 - P(A)$。', en: 'Probability = favorable ÷ total. Range 0-1. $P(\\bar{A}) = 1 - P(A)$.' },
  }],
  1152: [{
    prompt: { zh: '两路大军同时进攻，各自独立。\n两路都成功的概率怎么算？', en: 'Two armies attack simultaneously, each independently.\nHow do you find the probability both succeed?' },
    type: 'choice',
    choices: [
      { zh: '两个概率相乘——独立事件用乘法', en: 'Multiply the two probabilities — independent events use multiplication' },
      { zh: '两个概率相加', en: 'Add the two probabilities' },
    ],
    onCorrect: { zh: '独立事件的"同时发生" = 概率相乘。\n$P(A \\text{ and } B) = P(A) \\times P(B)$\n"相加"用于互斥事件的"或"关系。', en: 'Independent events "both happening" = multiply.\n$P(A \\text{ and } B) = P(A) \\times P(B)$\n"Adding" is for mutually exclusive events and "or" relationships.' },
    onWrong: { zh: '相加是"或"（A 或 B 发生）。"且"（都发生）用乘法。\n独立事件：$P(A \\cap B) = P(A) \\times P(B)$', en: 'Adding is for "or" (A or B happens). "And" (both happen) uses multiplication.\nIndependent events: $P(A \\cap B) = P(A) \\times P(B)$' },
    onSkip: { zh: '独立事件同时发生：相乘。$P(A \\cap B) = P(A) \\times P(B)$。"或"才相加。', en: 'Independent events both happening: multiply. $P(A \\cap B) = P(A) \\times P(B)$. "Or" means add.' },
  }],
  1153: [{
    prompt: { zh: '有些将领既会骑术又会射箭。怎么整理"有交叉"的数据？', en: 'Some generals know both riding and archery. How do you organize overlapping data?' },
    type: 'choice',
    choices: [
      { zh: '用韦恩图——两个圈重叠表示"都会"', en: 'Use a Venn diagram — overlapping circles show "both"' },
      { zh: '分别列两个表', en: 'Make two separate lists' },
    ],
    onCorrect: { zh: '韦恩图完美展示集合关系！\n重叠部分 = 两者都有。\n$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$——减去交集避免重复计数。', en: 'Venn diagrams perfectly show set relationships!\nOverlap = both have it.\n$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ — subtract intersection to avoid double counting.' },
    onWrong: { zh: '两个表看不出交叉！韦恩图用圆圈重叠来表示"都会"的人。\n关键公式：$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$', en: 'Two lists can\'t show overlap! Venn diagrams use overlapping circles for people with "both".\nKey formula: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$' },
    onSkip: { zh: '韦恩图：圈的重叠 = 交集。$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$。', en: 'Venn diagram: circle overlap = intersection. $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.' },
  }],
  1154: [{
    prompt: { zh: '斥候出去探两次。每次可能带回情报，也可能空手。\n怎么画出所有可能的结果？', en: 'A scout goes out twice. Each time may bring intel, or return empty.\nHow do you map out all possible outcomes?' },
    type: 'choice',
    choices: [
      { zh: '用树形图——每次选择分叉一次', en: 'Use a tree diagram — each choice creates a branch' },
      { zh: '列出所有组合', en: 'List all combinations' },
    ],
    onCorrect: { zh: '树形图让多步概率一目了然！\n每个分叉写上概率，沿着分支相乘得到最终概率。\n所有末端概率之和 = 1。', en: 'Tree diagrams make multi-step probability crystal clear!\nWrite probability on each branch, multiply along paths for final probability.\nAll end probabilities sum to 1.' },
    onWrong: { zh: '列组合容易漏！树形图按步骤展开，不会遗漏。\n沿分支相乘 = 该路径的概率。所有路径概率之和 = 1。', en: 'Listing combinations can miss cases! Tree diagrams unfold step by step, nothing missed.\nMultiply along branches = path probability. All paths sum to 1.' },
    onSkip: { zh: '树形图：每步分叉，沿分支乘概率。适合多步连续事件。所有路径概率和 = 1。', en: 'Tree diagram: branch at each step, multiply along paths. Perfect for multi-step events. All paths sum to 1.' },
  }],

  // === VECTORS (5) ===
  1161: [{
    prompt: { zh: '行军先向东走 3 里，再向北走 4 里。\n怎么用数学描述"方向+距离"？', en: 'March 3 li east, then 4 li north.\nHow do you describe "direction + distance" mathematically?' },
    type: 'choice',
    choices: [
      { zh: '用向量——$\\binom{3}{4}$ 既表示方向又表示大小', en: 'Use a vector — $\\binom{3}{4}$ shows both direction and magnitude' },
      { zh: '只用一个数 5（总距离）', en: 'Just use one number 5 (total distance)' },
    ],
    onCorrect: { zh: '向量 = 方向 + 大小。$\\binom{3}{4}$ 表示右移 3、上移 4。\n向量相加：$\\binom{a_1}{b_1} + \\binom{a_2}{b_2} = \\binom{a_1+a_2}{b_1+b_2}$——对应分量相加。', en: 'Vector = direction + magnitude. $\\binom{3}{4}$ means move 3 right, 4 up.\nVector addition: $\\binom{a_1}{b_1} + \\binom{a_2}{b_2} = \\binom{a_1+a_2}{b_1+b_2}$ — add corresponding components.' },
    onWrong: { zh: '5 是距离（大小），但丢失了方向。向量保留两者。\n$\\binom{3}{4}$ 说的是"在 $x$ 方向走 3，$y$ 方向走 4"。', en: '5 is distance (magnitude) but loses direction. Vectors keep both.\n$\\binom{3}{4}$ says "move 3 in $x$, 4 in $y$".' },
    onSkip: { zh: '向量 = 方向 + 大小。列向量 $\\binom{x}{y}$。向量加法：对应分量相加。', en: 'Vector = direction + magnitude. Column vector $\\binom{x}{y}$. Addition: add corresponding components.' },
  }],
  1162: [{
    prompt: { zh: '补给路线需要走两段。每段用向量表示。\n两段加起来的总位移怎么算？', en: 'A supply route has two legs, each represented as a vector.\nHow do you find the total displacement?' },
    type: 'choice',
    choices: [
      { zh: '两个向量相加——各分量对应相加', en: 'Add the two vectors — add corresponding components' },
      { zh: '取较大的那个向量', en: 'Take the larger vector' },
    ],
    onCorrect: { zh: '向量加法 = 首尾相连。$\\vec{a} + \\vec{b}$ 就是从 $\\vec{a}$ 的起点到 $\\vec{b}$ 的终点。\n计算：$\\binom{a_1}{b_1} + \\binom{a_2}{b_2} = \\binom{a_1+a_2}{b_1+b_2}$', en: 'Vector addition = tip-to-tail. $\\vec{a} + \\vec{b}$ goes from start of $\\vec{a}$ to end of $\\vec{b}$.\nCalculation: $\\binom{a_1}{b_1} + \\binom{a_2}{b_2} = \\binom{a_1+a_2}{b_1+b_2}$' },
    onWrong: { zh: '向量不能取"较大的"——它们有方向！两段路径首尾相连才是总位移。\n分量相加：$(3,4) + (1,2) = (4,6)$。', en: 'Can\'t take "the larger" vector — they have directions! Connect tip to tail for total displacement.\nAdd components: $(3,4) + (1,2) = (4,6)$.' },
    onSkip: { zh: '向量加法：$\\binom{a_1}{b_1} + \\binom{a_2}{b_2} = \\binom{a_1+a_2}{b_1+b_2}$。几何意义：首尾相连。', en: 'Vector addition: $\\binom{a_1}{b_1} + \\binom{a_2}{b_2} = \\binom{a_1+a_2}{b_1+b_2}$. Geometry: tip-to-tail.' },
  }],
  1163: [{
    prompt: { zh: '知道了位移向量 $\\binom{3}{4}$，怎么算出实际走了多远？', en: 'Given displacement vector $\\binom{3}{4}$, how do you find the actual distance traveled?' },
    type: 'choice',
    choices: [
      { zh: '用勾股定理：$\\sqrt{3^2 + 4^2} = 5$', en: 'Use Pythagoras: $\\sqrt{3^2 + 4^2} = 5$' },
      { zh: '$3 + 4 = 7$', en: '$3 + 4 = 7$' },
    ],
    onCorrect: { zh: '向量的大小（模）= $|\\vec{v}| = \\sqrt{x^2 + y^2}$。\n这就是勾股定理在向量中的应用——从分量到距离。', en: 'Vector magnitude = $|\\vec{v}| = \\sqrt{x^2 + y^2}$.\nThis is Pythagoras applied to vectors — from components to distance.' },
    onWrong: { zh: '$3+4=7$ 是分量之和，不是实际距离。斜着走比横竖加起来短。\n$|\\vec{v}| = \\sqrt{3^2+4^2} = \\sqrt{25} = 5$。', en: '$3+4=7$ is the sum of components, not actual distance. Diagonal is shorter than horizontal + vertical.\n$|\\vec{v}| = \\sqrt{3^2+4^2} = \\sqrt{25} = 5$.' },
    onSkip: { zh: '向量的模 = $\\sqrt{x^2+y^2}$（勾股定理）。从分量计算实际距离。', en: 'Vector magnitude = $\\sqrt{x^2+y^2}$ (Pythagoras). Calculates actual distance from components.' },
  }],
  1191: [{
    prompt: { zh: '阵法变换需要移动士兵的位置。\n怎么精确描述"从 A 点到 B 点的位移"？', en: 'Formation changes require moving soldiers.\nHow do you precisely describe "displacement from point A to B"?' },
    type: 'choice',
    choices: [
      { zh: '$\\vec{AB} = B - A$——终点坐标减起点坐标', en: '$\\vec{AB} = B - A$ — destination coordinates minus origin coordinates' },
      { zh: '量两点之间的直线距离', en: 'Measure the straight-line distance between points' },
    ],
    onCorrect: { zh: '位移向量 = 终点 - 起点。\n如果 $A(1,2)$，$B(4,6)$，则 $\\vec{AB} = \\binom{4-1}{6-2} = \\binom{3}{4}$。\n向量保留了方向信息——距离只是一个数。', en: 'Displacement vector = destination - origin.\nIf $A(1,2)$, $B(4,6)$, then $\\vec{AB} = \\binom{4-1}{6-2} = \\binom{3}{4}$.\nVectors preserve direction — distance is just a number.' },
    onWrong: { zh: '距离只告诉你多远，不告诉你哪个方向。\n向量 $\\vec{AB} = B - A$ 同时给你方向和大小。', en: 'Distance only tells how far, not which direction.\nVector $\\vec{AB} = B - A$ gives both direction and magnitude.' },
    onSkip: { zh: '位移向量 = 终点 - 起点。$\\vec{AB} = \\binom{x_B - x_A}{y_B - y_A}$。同时包含方向和大小。', en: 'Displacement vector = endpoint - start. $\\vec{AB} = \\binom{x_B - x_A}{y_B - y_A}$. Contains both direction and magnitude.' },
  }],
  1192: [{
    prompt: { zh: '突围需要先向北再转向东。两段位移向量相加就是总位移。\n如果总位移为零意味着什么？', en: 'Breaking out requires moving north then east. Adding the two displacement vectors gives total displacement.\nWhat does zero total displacement mean?' },
    type: 'choice',
    choices: [
      { zh: '回到了原点——走了一圈', en: 'Back to the starting point — went in a circle' },
      { zh: '没有移动', en: 'Didn\'t move at all' },
    ],
    onCorrect: { zh: '总位移为零 = 回到起点，但不代表没移动过！\n$\\vec{a} + \\vec{b} = \\vec{0}$ 意味着 $\\vec{b} = -\\vec{a}$（方向相反，大小相等）。', en: 'Zero total displacement = back to start, but doesn\'t mean no movement!\n$\\vec{a} + \\vec{b} = \\vec{0}$ means $\\vec{b} = -\\vec{a}$ (opposite direction, equal magnitude).' },
    onWrong: { zh: '"没有移动"是没走过路。位移为零是走了但回到原点。\n$\\vec{a} + \\vec{b} = \\vec{0}$：两段位移刚好抵消。', en: '"Didn\'t move" means no travel. Zero displacement means traveled but returned.\n$\\vec{a} + \\vec{b} = \\vec{0}$: two displacements exactly cancel out.' },
    onSkip: { zh: '向量和为零 = 回到起点。$\\vec{a} + \\vec{b} = \\vec{0} \\Rightarrow \\vec{b} = -\\vec{a}$。走了但净位移为零。', en: 'Vector sum zero = back to start. $\\vec{a} + \\vec{b} = \\vec{0} \\Rightarrow \\vec{b} = -\\vec{a}$. Traveled but net displacement is zero.' },
  }],

  // === CUMULATIVE FREQUENCY ===
  1172: [{
    prompt: { zh: '战损数据很多。怎么快速知道"低于某个值的数据有多少个"？', en: 'Lots of casualty data. How to quickly find "how many values are below a certain threshold"?' },
    type: 'choice',
    choices: [
      { zh: '画累积频率图——逐组累加频率', en: 'Draw a cumulative frequency graph — add up frequencies progressively' },
      { zh: '数一个个数', en: 'Count one by one' },
    ],
    onCorrect: { zh: '累积频率 = "小于等于某值"的总数。\n逐组累加后画曲线，就能快速读出中位数、四分位数。\n中位数在总频率的一半处，Q1 在 25%，Q3 在 75%。', en: 'Cumulative frequency = total "less than or equal to" a value.\nAdd up progressively and draw a curve — quickly read off median, quartiles.\nMedian at half total, Q1 at 25%, Q3 at 75%.' },
    onWrong: { zh: '一个个数太慢！累积频率图把所有频率逐步叠加。\n在图上找中位数：画水平线在总频率的 50%，垂直投影到 $x$ 轴。', en: 'Counting one by one is too slow! Cumulative frequency adds up progressively.\nFind median on the graph: draw horizontal at 50% of total, project down to x-axis.' },
    onSkip: { zh: '累积频率 = 逐组叠加频率。从图上读中位数（50%）、Q1（25%）、Q3（75%）。', en: 'Cumulative frequency = add frequencies progressively. Read median (50%), Q1 (25%), Q3 (75%) from graph.' },
  }],

  // === TRIGONOMETRY (3 + 2) ===
  11101: [{
    prompt: { zh: '河对岸太远，无法直接测量。\n只知道这边的一个角度和一段距离，能算出对岸多远吗？', en: 'The opposite bank is too far to measure directly.\nKnowing one angle and one distance on this side, can you calculate the distance?' },
    type: 'choice',
    choices: [
      { zh: '能！用三角比——角度+一条边 → 另一条边', en: 'Yes! Use trigonometric ratios — angle + one side → another side' },
      { zh: '不能，必须过去量', en: 'No, must go there and measure' },
    ],
    onCorrect: { zh: '三角学就是"不用过去也能量"的工具！\nSOH CAH TOA：sin = 对边/斜边，cos = 邻边/斜边，tan = 对边/邻边。\n知道一个角和一条边，就能推出其他边。', en: 'Trigonometry is the "measure without going there" tool!\nSOH CAH TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.\nOne angle + one side → find the others.' },
    onWrong: { zh: '不用过去！三角学专门解决这种问题。\ntan(角度) = 对边 ÷ 邻边。知道角度和邻边 → 算出对边。', en: 'No need to go there! Trigonometry solves exactly this.\ntan(angle) = opposite ÷ adjacent. Know angle and adjacent → calculate opposite.' },
    onSkip: { zh: 'SOH CAH TOA：sin=对/斜，cos=邻/斜，tan=对/邻。一角一边推全部。', en: 'SOH CAH TOA: sin=O/H, cos=A/H, tan=O/A. One angle + one side → find all.' },
  }],
  11102: [{
    prompt: { zh: '两面城墙形成一个夹角。知道两面墙长和夹角，怎么算对面的距离？', en: 'Two walls meet at an angle. Given both wall lengths and the angle, how to find the opposite distance?' },
    type: 'choice',
    choices: [
      { zh: '用余弦定理：$c^2 = a^2 + b^2 - 2ab\\cos C$', en: 'Use the cosine rule: $c^2 = a^2 + b^2 - 2ab\\cos C$' },
      { zh: '用勾股定理', en: 'Use Pythagoras' },
    ],
    onCorrect: { zh: '余弦定理是勾股定理的升级版——适用于任意三角形，不只是直角三角形。\n$c^2 = a^2 + b^2 - 2ab\\cos C$\n当 $C = 90°$ 时，$\\cos 90° = 0$，退化为勾股定理！', en: 'Cosine rule is the upgrade of Pythagoras — works for ANY triangle, not just right-angled.\n$c^2 = a^2 + b^2 - 2ab\\cos C$\nWhen $C = 90°$, $\\cos 90° = 0$, it reduces to Pythagoras!' },
    onWrong: { zh: '勾股定理只适用于直角三角形！当角度不是 90° 时，需要余弦定理。\n$c^2 = a^2 + b^2 - 2ab\\cos C$——多了 $-2ab\\cos C$ 这个修正项。', en: 'Pythagoras only works for right triangles! For other angles, use the cosine rule.\n$c^2 = a^2 + b^2 - 2ab\\cos C$ — adds the $-2ab\\cos C$ correction term.' },
    onSkip: { zh: '余弦定理：$c^2 = a^2 + b^2 - 2ab\\cos C$。任意三角形通用。90° 时退化为勾股。', en: 'Cosine rule: $c^2 = a^2 + b^2 - 2ab\\cos C$. Works for any triangle. At 90° it becomes Pythagoras.' },
  }],
  11103: [{
    prompt: { zh: '知道一条边和对面的角，怎么求其他边？', en: 'Given one side and its opposite angle, how do you find other sides?' },
    type: 'choice',
    choices: [
      { zh: '用正弦定理：$\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$', en: 'Use the sine rule: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$' },
      { zh: '用余弦定理', en: 'Use the cosine rule' },
    ],
    onCorrect: { zh: '正弦定理建立了"边与对角"的比例关系。\n$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$\n知道一组边-角对，就能求另一组。', en: 'Sine rule establishes the ratio between sides and opposite angles.\n$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$\nKnow one side-angle pair → find another.' },
    onWrong: { zh: '余弦定理需要两边和夹角。当你有"边和对角"时，用正弦定理更方便。\n$\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$', en: 'Cosine rule needs two sides and included angle. With "side and opposite angle", sine rule is easier.\n$\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$' },
    onSkip: { zh: '正弦定理：$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$。适用于已知"边和对角"的情况。', en: 'Sine rule: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$. Use when you know "side and opposite angle".' },
  }],
};

// ── Main: line-number based insertion ──
const filePath = path.join(import.meta.dirname, '../src/data/missions/y11.ts');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let insertCount = 0;

// Build map: missionId → tutorialSteps line number (0-indexed)
const insertionPoints = new Map<number, number>();
let currentId: number | null = null;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/id: (\d+), grade: 11/);
  if (idMatch) currentId = Number(idMatch[1]);
  if (lines[i].match(/^\s+tutorialSteps:/) && currentId) {
    // Check no discoverSteps already exists for this mission
    let hasDiscover = false;
    for (let j = i - 1; j > Math.max(0, i - 30); j--) {
      if (lines[j].includes('discoverSteps:')) { hasDiscover = true; break; }
      if (lines[j].match(/id: \d+, grade:/)) break;
    }
    if (!hasDiscover && DISCOVER_STEPS[currentId]) {
      insertionPoints.set(currentId, i);
    }
  }
}

// Insert in reverse order (bottom to top) to preserve line numbers
const sorted = [...insertionPoints.entries()].sort((a, b) => b[1] - a[1]);

for (const [missionId, lineIdx] of sorted) {
  const steps = DISCOVER_STEPS[missionId];
  const indent = '    ';

  // Format steps as TypeScript source
  const formatBi = (obj: {zh: string; en: string}) =>
    `{ zh: ${JSON.stringify(obj.zh)}, en: ${JSON.stringify(obj.en)} }`;

  let stepLines: string[] = [`${indent}discoverSteps: [`];
  for (const step of steps) {
    stepLines.push(`${indent}  {`);
    stepLines.push(`${indent}    prompt: ${formatBi(step.prompt)},`);
    stepLines.push(`${indent}    type: '${step.type}',`);
    stepLines.push(`${indent}    choices: [`);
    for (const c of step.choices) {
      stepLines.push(`${indent}      ${formatBi(c)},`);
    }
    stepLines.push(`${indent}    ],`);
    stepLines.push(`${indent}    onCorrect: ${formatBi(step.onCorrect)},`);
    stepLines.push(`${indent}    onWrong: ${formatBi(step.onWrong)},`);
    stepLines.push(`${indent}    onSkip: ${formatBi(step.onSkip)},`);
    stepLines.push(`${indent}  },`);
  }
  stepLines.push(`${indent}],`);

  lines.splice(lineIdx, 0, ...stepLines);
  insertCount++;
  console.log(`✅ ${missionId} (line ${lineIdx + 1})`);
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log(`\nDone! Added discoverSteps to ${insertCount} missions.`);
