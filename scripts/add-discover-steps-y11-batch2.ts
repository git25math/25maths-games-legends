/**
 * Add discoverSteps to Y11 missions batch 2 (Unit 11-19).
 * Run: npx tsx scripts/add-discover-steps-y11-batch2.ts
 */
import * as fs from 'fs';
import * as path from 'path';

type DS = { prompt: {zh:string;en:string}; type:'choice'; choices:{zh:string;en:string}[]; onCorrect:{zh:string;en:string}; onWrong:{zh:string;en:string}; onSkip:{zh:string;en:string} };

const STEPS: Record<number, DS[]> = {
  // === Unit 11: 曲线分析 ===
  11111: [{
    prompt: { zh: '投石车的轨迹是抛物线。怎么找到最高点？', en: 'A catapult\'s trajectory is a parabola. How do you find the highest point?' },
    type: 'choice',
    choices: [
      { zh: '用顶点公式 $x = -\\frac{b}{2a}$', en: 'Use the vertex formula $x = -\\frac{b}{2a}$' },
      { zh: '代入 $x = 0$', en: 'Substitute $x = 0$' },
    ],
    onCorrect: { zh: '完美！$y = ax^2+bx+c$ 的顶点在 $x = -\\frac{b}{2a}$。\n$a < 0$ 时开口朝下，顶点是最高点。$a > 0$ 则是最低点。', en: 'Perfect! Vertex of $y = ax^2+bx+c$ is at $x = -\\frac{b}{2a}$.\n$a < 0$ → opens down → vertex is maximum. $a > 0$ → minimum.' },
    onWrong: { zh: '$x=0$ 只是 $y$ 轴上的点。抛物线的顶点用 $x = -\\frac{b}{2a}$ 计算。', en: '$x=0$ is just a point on the y-axis. The vertex uses $x = -\\frac{b}{2a}$.' },
    onSkip: { zh: '抛物线顶点：$x = -\\frac{b}{2a}$。$a<0$ 最高点，$a>0$ 最低点。', en: 'Parabola vertex: $x = -\\frac{b}{2a}$. $a<0$ → max, $a>0$ → min.' },
  }],
  11112: [{
    prompt: { zh: '投石轨迹什么时候落地？"落地"意味着什么？', en: 'When does the projectile land? What does "landing" mean mathematically?' },
    type: 'choice',
    choices: [
      { zh: '$y = 0$——高度为零就是落地', en: '$y = 0$ — zero height means landing' },
      { zh: '$x = 0$', en: '$x = 0$' },
    ],
    onCorrect: { zh: '对！$y=0$ 就是地面。解 $ax^2+bx+c=0$ 找落点。\n求根公式：$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', en: 'Yes! $y=0$ is ground level. Solve $ax^2+bx+c=0$ for landing points.\nQuadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$' },
    onWrong: { zh: '$x=0$ 是发射点。落地 = 高度为零 = $y=0$。\n用求根公式解：$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', en: '$x=0$ is the launch point. Landing = height zero = $y=0$.\nSolve with: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$' },
    onSkip: { zh: '函数零点 = $y=0$ 的解。用求根公式 $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$。', en: 'Roots = solutions where $y=0$. Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$.' },
  }],
  11113: [{
    prompt: { zh: '函数 $f(x) = 2x^2 + 3x - 5$。如果 $x=3$，$f(3)$ 等于多少？怎么算？', en: 'Function $f(x) = 2x^2 + 3x - 5$. If $x=3$, what is $f(3)$? How to calculate?' },
    type: 'choice',
    choices: [
      { zh: '把所有 $x$ 替换成 3，然后计算', en: 'Replace every $x$ with 3, then calculate' },
      { zh: '把 3 加到函数上', en: 'Add 3 to the function' },
    ],
    onCorrect: { zh: '就这么简单！代入 = 替换。\n$f(3) = 2(3)^2 + 3(3) - 5 = 18 + 9 - 5 = 22$\n先算幂次，再算乘法，最后加减。', en: 'That simple! Substitution = replacement.\n$f(3) = 2(3)^2 + 3(3) - 5 = 18 + 9 - 5 = 22$\nPowers first, then multiply, then add/subtract.' },
    onWrong: { zh: '代入是替换，不是加上去。$f(3)$ 意味着把公式里每个 $x$ 换成 3。\n$f(3) = 2(3)^2 + 3(3) - 5$', en: 'Substitution means replacing, not adding. $f(3)$ means swap every $x$ for 3.\n$f(3) = 2(3)^2 + 3(3) - 5$' },
    onSkip: { zh: '代入求值：把 $x$ 的值替换进去，按运算顺序计算。先幂次→乘法→加减。', en: 'Function evaluation: replace $x$ with the value, follow order of operations. Powers → multiply → add/subtract.' },
  }],

  // === Unit 12: 正弦余弦定理 (补充) ===
  11202: [{
    prompt: { zh: '两支军队从同一点出发，走不同方向。知道两条路的长度和夹角。\n怎么算两军最终的距离？', en: 'Two armies depart from the same point in different directions. Given both path lengths and the angle between.\nHow to find the final distance between them?' },
    type: 'choice',
    choices: [
      { zh: '余弦定理：$c^2 = a^2 + b^2 - 2ab\\cos C$', en: 'Cosine rule: $c^2 = a^2 + b^2 - 2ab\\cos C$' },
      { zh: '直接相加', en: 'Just add them' },
    ],
    onCorrect: { zh: '余弦定理处理"已知两边和夹角，求第三边"。\n它是勾股定理的一般化——90° 时 $\\cos 90°=0$，退化为 $c^2=a^2+b^2$。', en: 'Cosine rule handles "two sides and included angle → third side".\nIt generalizes Pythagoras — at 90°, $\\cos 90°=0$, reduces to $c^2=a^2+b^2$.' },
    onWrong: { zh: '相加只在同一直线上成立。不同方向走的路需要余弦定理。\n$c^2 = a^2 + b^2 - 2ab\\cos C$', en: 'Adding only works on the same line. Different directions need the cosine rule.\n$c^2 = a^2 + b^2 - 2ab\\cos C$' },
    onSkip: { zh: '两边+夹角 → 余弦定理求第三边。$c^2 = a^2 + b^2 - 2ab\\cos C$。', en: 'Two sides + included angle → cosine rule for third side. $c^2 = a^2 + b^2 - 2ab\\cos C$.' },
  }],
  11203: [{
    prompt: { zh: '三边已知，怎么求夹角？', en: 'All three sides known. How to find an angle?' },
    type: 'choice',
    choices: [
      { zh: '余弦定理变形：$\\cos C = \\frac{a^2+b^2-c^2}{2ab}$', en: 'Rearranged cosine rule: $\\cos C = \\frac{a^2+b^2-c^2}{2ab}$' },
      { zh: '用正弦定理', en: 'Use sine rule' },
    ],
    onCorrect: { zh: '对！余弦定理可以反过来用——已知三边求角。\n$\\cos C = \\frac{a^2+b^2-c^2}{2ab}$，然后 $C = \\cos^{-1}(\\text{结果})$。', en: 'Yes! Cosine rule works in reverse — three sides → angle.\n$\\cos C = \\frac{a^2+b^2-c^2}{2ab}$, then $C = \\cos^{-1}(\\text{result})$.' },
    onWrong: { zh: '正弦定理需要已知角。三边全知无角——用余弦定理变形。\n$\\cos C = \\frac{a^2+b^2-c^2}{2ab}$', en: 'Sine rule needs a known angle. Three sides, no angle — rearrange cosine rule.\n$\\cos C = \\frac{a^2+b^2-c^2}{2ab}$' },
    onSkip: { zh: '三边求角：$\\cos C = \\frac{a^2+b^2-c^2}{2ab}$，再取反余弦。', en: 'Three sides → angle: $\\cos C = \\frac{a^2+b^2-c^2}{2ab}$, then inverse cosine.' },
  }],
  11204: [{
    prompt: { zh: '三角形营地两边和夹角已知。面积怎么算？', en: 'Campsite triangle: two sides and included angle known. How to find the area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{1}{2}ab\\sin C$——两边和夹角的正弦', en: '$\\frac{1}{2}ab\\sin C$ — two sides and sine of included angle' },
      { zh: '$\\frac{1}{2} \\times \\text{底} \\times \\text{高}$', en: '$\\frac{1}{2} \\times base \\times height$' },
    ],
    onCorrect: { zh: '当没有直接的"高"时，用正弦面积公式更方便。\n$\\text{Area} = \\frac{1}{2}ab\\sin C$\n本质上 $b\\sin C$ 就是三角形的高。', en: 'When there\'s no direct "height", the sine area formula is more convenient.\nArea $= \\frac{1}{2}ab\\sin C$\nEssentially, $b\\sin C$ IS the height.' },
    onWrong: { zh: '底×高需要知道高——但这里只有两边和夹角。\n$\\frac{1}{2}ab\\sin C$ 不需要高！$b\\sin C$ 就是高的计算。', en: 'Base × height needs the height — but we only have two sides and angle.\n$\\frac{1}{2}ab\\sin C$ doesn\'t need height! $b\\sin C$ calculates the height.' },
    onSkip: { zh: '正弦面积公式：$\\frac{1}{2}ab\\sin C$。两边+夹角直接算面积，无需求高。', en: 'Sine area formula: $\\frac{1}{2}ab\\sin C$. Two sides + included angle → area directly.' },
  }],

  // === Unit 13-14 ===
  11206: [{
    prompt: { zh: '从城楼底面看向楼顶——仰角是什么？', en: 'Looking from the base to the top of a tower — what is the angle of elevation?' },
    type: 'choice',
    choices: [
      { zh: '水平线和视线之间的夹角', en: 'The angle between the horizontal and the line of sight' },
      { zh: '楼的倾斜角度', en: 'The tilt angle of the tower' },
    ],
    onCorrect: { zh: '仰角 = 从水平线向上抬头的角度。\n在三维问题中，先在底面用勾股定理求水平距离，再用 $\\tan\\theta = \\frac{\\text{高}}{\\text{水平距离}}$ 求仰角。', en: 'Elevation angle = angle looking up from horizontal.\nIn 3D: first find horizontal distance using Pythagoras on the base, then $\\tan\\theta = \\frac{height}{horizontal\\ distance}$.' },
    onWrong: { zh: '仰角不是楼自身的角度——是你抬头看的角度。\n从水平线向上看的角度 = $\\tan^{-1}(\\frac{高}{底面距离})$。', en: 'Elevation isn\'t the tower\'s own angle — it\'s how much you tilt your head up.\nAngle from horizontal = $\\tan^{-1}(\\frac{height}{base\\ distance})$.' },
    onSkip: { zh: '仰角 = arctan(高/水平距离)。3D 问题先在底面算对角线距离。', en: 'Elevation = arctan(height / horizontal distance). In 3D, first find diagonal on the base.' },
  }],
  11208: [{
    prompt: { zh: '$\\sqrt{50}$ 不够简洁。怎么化简？', en: '$\\sqrt{50}$ isn\'t neat. How do you simplify it?' },
    type: 'choice',
    choices: [
      { zh: '找最大完全平方因子：$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$', en: 'Find the largest perfect square factor: $\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$' },
      { zh: '用计算器算小数', en: 'Use a calculator for the decimal' },
    ],
    onCorrect: { zh: '化简根式的核心：找完全平方因子，拿到根号外面。\n$\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}$\n$\\sqrt{50} = \\sqrt{25} \\times \\sqrt{2} = 5\\sqrt{2}$', en: 'Simplifying surds: find perfect square factors, bring them outside.\n$\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}$\n$\\sqrt{50} = \\sqrt{25} \\times \\sqrt{2} = 5\\sqrt{2}$' },
    onWrong: { zh: '小数是近似值，数学要求精确答案。\n$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$——这是精确的简化形式。', en: 'Decimal is an approximation. Math requires exact answers.\n$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$ — this is the exact simplified form.' },
    onSkip: { zh: '化简根式：拆出最大完全平方因子。$\\sqrt{n} = \\sqrt{a^2 \\cdot b} = a\\sqrt{b}$。', en: 'Simplify surds: extract largest perfect square factor. $\\sqrt{n} = \\sqrt{a^2 \\cdot b} = a\\sqrt{b}$.' },
  }],

  // === Unit 15: 曲线与直线 ===
  11210: [{
    prompt: { zh: '函数 $y = f(x)$ 向上移 3 个单位。新函数是什么？', en: 'Function $y = f(x)$ moves up 3 units. What\'s the new function?' },
    type: 'choice',
    choices: [
      { zh: '$y = f(x) + 3$', en: '$y = f(x) + 3$' },
      { zh: '$y = f(x + 3)$', en: '$y = f(x + 3)$' },
    ],
    onCorrect: { zh: '上下平移改 $y$：$+3$ 上移，$-3$ 下移。\n左右平移改 $x$（方向相反！）：$f(x-3)$ 右移，$f(x+3)$ 左移。\n记住："上下看外面，左右看里面且反向"。', en: 'Vertical shift changes $y$: $+3$ up, $-3$ down.\nHorizontal shift changes $x$ (opposite direction!): $f(x-3)$ → right, $f(x+3)$ → left.\nRemember: "vertical = outside, horizontal = inside and reversed".' },
    onWrong: { zh: '$f(x+3)$ 是左右平移（且左移！）。上下平移在函数外面加减。\n上移 3：$y = f(x) + 3$', en: '$f(x+3)$ is horizontal shift (left!). Vertical shift adds/subtracts outside.\nUp 3: $y = f(x) + 3$' },
    onSkip: { zh: '上移：$y=f(x)+k$。下移：$-k$。右移：$f(x-k)$。左移：$f(x+k)$。', en: 'Up: $y=f(x)+k$. Down: $-k$. Right: $f(x-k)$. Left: $f(x+k)$.' },
  }],
  11211: [{
    prompt: { zh: '一条路的斜率是 2。垂直的岔路斜率是多少？', en: 'A road has gradient 2. What\'s the gradient of a perpendicular road?' },
    type: 'choice',
    choices: [
      { zh: '$-\\frac{1}{2}$——负倒数', en: '$-\\frac{1}{2}$ — negative reciprocal' },
      { zh: '$-2$', en: '$-2$' },
    ],
    onCorrect: { zh: '垂直线斜率 = 原斜率的负倒数。\n$m_1 \\times m_2 = -1$\n斜率 2 的垂直线：$m = -\\frac{1}{2}$', en: 'Perpendicular gradient = negative reciprocal.\n$m_1 \\times m_2 = -1$\nPerpendicular to gradient 2: $m = -\\frac{1}{2}$' },
    onWrong: { zh: '$-2$ 是取反，不是负倒数。垂直 = 翻转再变号。\n$2 \\to \\frac{1}{2} \\to -\\frac{1}{2}$。验证：$2 \\times (-\\frac{1}{2}) = -1$ ✓', en: '$-2$ is just negation, not negative reciprocal. Perpendicular = flip then negate.\n$2 \\to \\frac{1}{2} \\to -\\frac{1}{2}$. Check: $2 \\times (-\\frac{1}{2}) = -1$ ✓' },
    onSkip: { zh: '垂直线：$m_1 \\times m_2 = -1$。斜率的负倒数。', en: 'Perpendicular: $m_1 \\times m_2 = -1$. Negative reciprocal of the gradient.' },
  }],

  // === Unit 16 ===
  11212: [{
    prompt: { zh: '$y$ 与 $\\sqrt{x}$ 成正比。$x$ 变为 4 倍时，$y$ 变为多少倍？', en: '$y$ is proportional to $\\sqrt{x}$. When $x$ quadruples, how does $y$ change?' },
    type: 'choice',
    choices: [
      { zh: '$y$ 变为 2 倍——$\\sqrt{4}=2$', en: '$y$ doubles — $\\sqrt{4}=2$' },
      { zh: '$y$ 变为 4 倍', en: '$y$ quadruples' },
    ],
    onCorrect: { zh: '正比意味着 $y = k\\sqrt{x}$。\n$x$ 变 4 倍 → $\\sqrt{4x} = 2\\sqrt{x}$ → $y$ 变 2 倍。\n幂次关系中，$x$ 变 $n$ 倍 → $y$ 变 $n^p$ 倍（$p$ 是幂次）。', en: 'Proportional means $y = k\\sqrt{x}$.\n$x$ × 4 → $\\sqrt{4x} = 2\\sqrt{x}$ → $y$ × 2.\nIn power relationships, $x$ × $n$ → $y$ × $n^p$ ($p$ is the power).' },
    onWrong: { zh: '不是线性关系！$y \\propto \\sqrt{x} = x^{0.5}$。\n$x$ 乘 4 → $y$ 乘 $4^{0.5} = 2$。', en: 'Not linear! $y \\propto \\sqrt{x} = x^{0.5}$.\n$x$ × 4 → $y$ × $4^{0.5} = 2$.' },
    onSkip: { zh: '$y \\propto x^n$：$x$ 变 $k$ 倍 → $y$ 变 $k^n$ 倍。$\\sqrt{x}$ 中 $n=0.5$。', en: '$y \\propto x^n$: $x$ × $k$ → $y$ × $k^n$. For $\\sqrt{x}$, $n=0.5$.' },
  }],

  // === Unit 17: 三角进阶 ===
  11214: [{
    prompt: { zh: '已知 $\\tan\\theta = 1$。$\\theta$ 是多少度？', en: 'Given $\\tan\\theta = 1$. What is $\\theta$ in degrees?' },
    type: 'choice',
    choices: [
      { zh: '$45°$——因为 $\\tan 45° = 1$', en: '$45°$ — because $\\tan 45° = 1$' },
      { zh: '$90°$', en: '$90°$' },
    ],
    onCorrect: { zh: '记住特殊角的三角值是基本功！\n$\\tan 45° = 1$（等腰直角三角形，对边=邻边）。\n反三角函数 $\\theta = \\tan^{-1}(1) = 45°$。', en: 'Memorizing special angle trig values is essential!\n$\\tan 45° = 1$ (isosceles right triangle, opposite = adjacent).\nInverse: $\\theta = \\tan^{-1}(1) = 45°$.' },
    onWrong: { zh: '$\\tan 90°$ 未定义（趋向无穷大）！$\\tan 45° = 1$。\n等腰直角三角形：对边 = 邻边 → 比值 = 1。', en: '$\\tan 90°$ is undefined (tends to infinity)! $\\tan 45° = 1$.\nIsosceles right triangle: opposite = adjacent → ratio = 1.' },
    onSkip: { zh: '$\\tan^{-1}(1) = 45°$。反三角函数把比值变回角度。', en: '$\\tan^{-1}(1) = 45°$. Inverse trig turns a ratio back into an angle.' },
  }],
  11215: [{
    prompt: { zh: '特殊角 $30°, 45°, 60°$ 的三角值必须记住。$\\tan 45°$ 等于多少？', en: 'Special angles $30°, 45°, 60°$ — their trig values must be memorized. What is $\\tan 45°$?' },
    type: 'choice',
    choices: [
      { zh: '$1$', en: '$1$' },
      { zh: '$\\frac{\\sqrt{3}}{2}$', en: '$\\frac{\\sqrt{3}}{2}$' },
    ],
    onCorrect: { zh: '对！关键三角值：\n$\\sin 30°=\\frac{1}{2}$，$\\cos 30°=\\frac{\\sqrt{3}}{2}$，$\\tan 30°=\\frac{1}{\\sqrt{3}}$\n$\\sin 45°=\\frac{\\sqrt{2}}{2}$，$\\cos 45°=\\frac{\\sqrt{2}}{2}$，$\\tan 45°=1$\n$\\sin 60°=\\frac{\\sqrt{3}}{2}$，$\\cos 60°=\\frac{1}{2}$，$\\tan 60°=\\sqrt{3}$', en: 'Yes! Key trig values:\n$\\sin 30°=\\frac{1}{2}$, $\\cos 30°=\\frac{\\sqrt{3}}{2}$, $\\tan 30°=\\frac{1}{\\sqrt{3}}$\n$\\sin 45°=\\frac{\\sqrt{2}}{2}$, $\\cos 45°=\\frac{\\sqrt{2}}{2}$, $\\tan 45°=1$\n$\\sin 60°=\\frac{\\sqrt{3}}{2}$, $\\cos 60°=\\frac{1}{2}$, $\\tan 60°=\\sqrt{3}$' },
    onWrong: { zh: '$\\frac{\\sqrt{3}}{2}$ 是 $\\sin 60°$ 或 $\\cos 30°$。$\\tan 45° = 1$。', en: '$\\frac{\\sqrt{3}}{2}$ is $\\sin 60°$ or $\\cos 30°$. $\\tan 45° = 1$.' },
    onSkip: { zh: '30-45-60° 三角值表是必背内容。$\\tan 45°=1$。', en: '30-45-60° trig value table must be memorized. $\\tan 45°=1$.' },
  }],
  11216: [{
    prompt: { zh: '$\\sin 0°$ 等于多少？想象角度从 $0°$ 开始…', en: '$\\sin 0°$ equals what? Imagine the angle starting from $0°$...' },
    type: 'choice',
    choices: [
      { zh: '$0$——角度为零时对边为零', en: '$0$ — at zero angle the opposite side is zero' },
      { zh: '$1$', en: '$1$' },
    ],
    onCorrect: { zh: '$\\sin$ = 对边/斜边。角度 $0°$ 时三角形"扁"成一条线——对边为 0。\n类似地：$\\cos 0° = 1$（全在邻边上），$\\sin 90° = 1$，$\\cos 90° = 0$。', en: '$\\sin$ = opposite/hypotenuse. At $0°$ the triangle "flattens" — opposite = 0.\nSimilarly: $\\cos 0° = 1$ (all on adjacent), $\\sin 90° = 1$, $\\cos 90° = 0$.' },
    onWrong: { zh: '$\\sin 90° = 1$，不是 $\\sin 0°$。\n$0°$ 时三角形完全扁平，对边长度为零 → $\\sin 0° = 0$。', en: '$\\sin 90° = 1$, not $\\sin 0°$.\nAt $0°$ the triangle is completely flat, opposite = zero → $\\sin 0° = 0$.' },
    onSkip: { zh: '$\\sin 0°=0$，$\\cos 0°=1$，$\\sin 90°=1$，$\\cos 90°=0$。', en: '$\\sin 0°=0$, $\\cos 0°=1$, $\\sin 90°=1$, $\\cos 90°=0$.' },
  }],
  11217: [{
    prompt: { zh: '$\\sin x$ 的图像像波浪。它多少度重复一次？', en: 'The $\\sin x$ graph looks like a wave. How many degrees until it repeats?' },
    type: 'choice',
    choices: [
      { zh: '$360°$——一个完整周期', en: '$360°$ — one complete cycle' },
      { zh: '$180°$', en: '$180°$' },
    ],
    onCorrect: { zh: '对！$\\sin x$ 和 $\\cos x$ 的周期都是 $360°$。\n$\\tan x$ 的周期是 $180°$（因为 $\\tan$ 每半圈重复一次）。', en: 'Yes! Both $\\sin x$ and $\\cos x$ have period $360°$.\n$\\tan x$ has period $180°$ (repeats every half cycle).' },
    onWrong: { zh: '$180°$ 是 $\\tan x$ 的周期。$\\sin x$ 需要完整的 $360°$ 才回到起点。\n$0° \\to 90° \\to 180° \\to 270° \\to 360°$：上→零→下→零→上。', en: '$180°$ is the period of $\\tan x$. $\\sin x$ needs a full $360°$ to return.\n$0° \\to 90° \\to 180° \\to 270° \\to 360°$: up → zero → down → zero → up.' },
    onSkip: { zh: '$\\sin/\\cos$ 周期 $360°$，$\\tan$ 周期 $180°$。', en: '$\\sin/\\cos$ period $360°$, $\\tan$ period $180°$.' },
  }],
  11218: [{
    prompt: { zh: '两边长 6 和 8，夹角 $30°$。面积怎么算？', en: 'Two sides 6 and 8, included angle $30°$. How to find the area?' },
    type: 'choice',
    choices: [
      { zh: '$\\frac{1}{2} \\times 6 \\times 8 \\times \\sin 30°$', en: '$\\frac{1}{2} \\times 6 \\times 8 \\times \\sin 30°$' },
      { zh: '$6 \\times 8 = 48$', en: '$6 \\times 8 = 48$' },
    ],
    onCorrect: { zh: '正弦面积公式！$\\sin 30° = \\frac{1}{2}$。\n面积 $= \\frac{1}{2} \\times 6 \\times 8 \\times \\frac{1}{2} = 12$。\n$\\frac{1}{2}ab\\sin C$ 适用于任意三角形。', en: 'Sine area formula! $\\sin 30° = \\frac{1}{2}$.\nArea $= \\frac{1}{2} \\times 6 \\times 8 \\times \\frac{1}{2} = 12$.\n$\\frac{1}{2}ab\\sin C$ works for any triangle.' },
    onWrong: { zh: '$6 \\times 8$ 是矩形面积。三角形还要乘 $\\frac{1}{2}$ 和 $\\sin C$。\n$= \\frac{1}{2} \\times 6 \\times 8 \\times \\sin 30° = 12$', en: '$6 \\times 8$ is rectangle area. Triangle needs $\\frac{1}{2}$ and $\\sin C$.\n$= \\frac{1}{2} \\times 6 \\times 8 \\times \\sin 30° = 12$' },
    onSkip: { zh: '三角面积 = $\\frac{1}{2}ab\\sin C$。代入已知两边和夹角即可。', en: 'Triangle area = $\\frac{1}{2}ab\\sin C$. Substitute the two sides and included angle.' },
  }],
  11219: [{
    prompt: { zh: '正弦定理什么时候用？什么时候用余弦定理？', en: 'When do you use sine rule? When cosine rule?' },
    type: 'choice',
    choices: [
      { zh: '有"边-对角配对"用正弦，有"两边夹角"或"三边"用余弦', en: 'Side-opposite angle pair → sine rule. Two sides + included angle or three sides → cosine' },
      { zh: '都可以随便用', en: 'Either one works anytime' },
    ],
    onCorrect: { zh: '选择规则：\n正弦定理：$\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$ → 需要一对边-角\n余弦定理：$c^2 = a^2+b^2-2ab\\cos C$ → 需要两边+夹角 或 三边', en: 'Selection rule:\nSine: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$ → need one side-angle pair\nCosine: $c^2 = a^2+b^2-2ab\\cos C$ → need 2 sides + included angle, or 3 sides' },
    onWrong: { zh: '不能随便用——取决于已知条件。\n有一对"边和对角" → 正弦定理。没有配对 → 余弦定理。', en: 'Can\'t use either — depends on what\'s known.\nHave a "side and opposite angle" pair → sine. No pair → cosine.' },
    onSkip: { zh: '正弦 ↔ 边角配对。余弦 ↔ 两边夹角或三边。看已知条件选公式。', en: 'Sine ↔ side-angle pair. Cosine ↔ two sides + included angle or three sides. Choose based on knowns.' },
  }],
  11220: [{
    prompt: { zh: '余弦定理求边后，得到 $c^2 = 164$。$c$ 等于多少？', en: 'After cosine rule, $c^2 = 164$. What is $c$?' },
    type: 'choice',
    choices: [
      { zh: '$c = \\sqrt{164} = 2\\sqrt{41} \\approx 12.8$', en: '$c = \\sqrt{164} = 2\\sqrt{41} \\approx 12.8$' },
      { zh: '$c = 164 \\div 2 = 82$', en: '$c = 164 \\div 2 = 82$' },
    ],
    onCorrect: { zh: '从 $c^2$ 到 $c$ 需要开方，不是除以 2。\n$\\sqrt{164} = \\sqrt{4 \\times 41} = 2\\sqrt{41}$\n考试中通常保留根式或四舍五入到适当精度。', en: 'From $c^2$ to $c$ requires square root, not dividing by 2.\n$\\sqrt{164} = \\sqrt{4 \\times 41} = 2\\sqrt{41}$\nIn exams, usually keep surd form or round appropriately.' },
    onWrong: { zh: '$c^2 = 164$ 不是 $2c = 164$！$c^2$ 意味着 $c$ 的平方。\n$c = \\sqrt{164} \\approx 12.8$', en: '$c^2 = 164$ is NOT $2c = 164$! $c^2$ means $c$ squared.\n$c = \\sqrt{164} \\approx 12.8$' },
    onSkip: { zh: '$c^2 = n$ → $c = \\sqrt{n}$。化简根式或保留小数。', en: '$c^2 = n$ → $c = \\sqrt{n}$. Simplify the surd or keep decimal.' },
  }],

  // === Unit 18: 函数进阶 ===
  11222: [{
    prompt: { zh: '$f(x) = x+1$，$g(x) = 2x$。$f(g(3))$ 怎么算？', en: '$f(x) = x+1$, $g(x) = 2x$. How to calculate $f(g(3))$?' },
    type: 'choice',
    choices: [
      { zh: '先算 $g(3)=6$，再算 $f(6)=7$——从里到外', en: 'First $g(3)=6$, then $f(6)=7$ — inside out' },
      { zh: '先算 $f(3)=4$，再算 $g(4)=8$', en: 'First $f(3)=4$, then $g(4)=8$' },
    ],
    onCorrect: { zh: '复合函数从里到外！$f(g(x))$ 先算 $g$，结果喂给 $f$。\n$g(3) = 6$，$f(6) = 7$。\n注意顺序：$f(g(x)) \\neq g(f(x))$！', en: 'Composite functions work inside out! $f(g(x))$: compute $g$ first, feed result to $f$.\n$g(3) = 6$, $f(6) = 7$.\nOrder matters: $f(g(x)) \\neq g(f(x))$!' },
    onWrong: { zh: '那是 $g(f(3))$！$f(g(3))$ 中先做括号里的 $g(3)$。\n$g(3) = 2 \\times 3 = 6$，$f(6) = 6+1 = 7$。', en: 'That\'s $g(f(3))$! In $f(g(3))$, compute $g(3)$ in brackets first.\n$g(3) = 2 \\times 3 = 6$, $f(6) = 6+1 = 7$.' },
    onSkip: { zh: '复合函数：$f(g(x))$ 先算 $g(x)$，结果代入 $f$。从里到外。', en: 'Composite: $f(g(x))$ — compute $g(x)$ first, feed to $f$. Inside out.' },
  }],
  11223: [{
    prompt: { zh: '$f(x) = x^2$。$x$ 可以是任何实数，但 $f(x)$ 能取负值吗？', en: '$f(x) = x^2$. $x$ can be any real number, but can $f(x)$ be negative?' },
    type: 'choice',
    choices: [
      { zh: '不能——平方永远 $\\geq 0$，值域是 $[0, \\infty)$', en: 'No — squares are always $\\geq 0$, range is $[0, \\infty)$' },
      { zh: '能——$(-3)^2 = -9$', en: 'Yes — $(-3)^2 = -9$' },
    ],
    onCorrect: { zh: '定义域 = $x$ 能取什么值。值域 = $f(x)$ 能输出什么值。\n$x^2 \\geq 0$ 对所有实数 $x$ 成立。\n所以定义域 = $\\mathbb{R}$，值域 = $[0, \\infty)$。', en: 'Domain = what $x$ can be. Range = what $f(x)$ can output.\n$x^2 \\geq 0$ for all real $x$.\nSo domain = $\\mathbb{R}$, range = $[0, \\infty)$.' },
    onWrong: { zh: '$(-3)^2 = 9$，不是 $-9$！负数的平方是正数。\n$x^2$ 永远 $\\geq 0$，所以值域是 $[0, \\infty)$。', en: '$(-3)^2 = 9$, NOT $-9$! Squaring a negative gives positive.\n$x^2$ is always $\\geq 0$, so range is $[0, \\infty)$.' },
    onSkip: { zh: '定义域 = 输入范围，值域 = 输出范围。$x^2$ 的值域 = $[0, \\infty)$。', en: 'Domain = input range, range = output range. $x^2$ range = $[0, \\infty)$.' },
  }],
  11224: [{
    prompt: { zh: '$y = (x-1)(x-2)(x-3)$。这条曲线和 $x$ 轴有几个交点？', en: '$y = (x-1)(x-2)(x-3)$. How many times does this curve cross the x-axis?' },
    type: 'choice',
    choices: [
      { zh: '3 个——每个因子 $=0$ 给一个交点', en: '3 — each factor $=0$ gives one crossing' },
      { zh: '1 个', en: '1' },
    ],
    onCorrect: { zh: '已因式分解的多项式，每个因子 $=0$ 给一个 $x$ 轴交点。\n$(x-1)=0 \\to x=1$，$(x-2)=0 \\to x=2$，$(x-3)=0 \\to x=3$。\n3 个不同的根 = 3 个交点。', en: 'In factored form, each factor $=0$ gives an x-intercept.\n$(x-1)=0 \\to x=1$, $(x-2)=0 \\to x=2$, $(x-3)=0 \\to x=3$.\n3 distinct roots = 3 crossings.' },
    onWrong: { zh: '乘积为零，至少一个因子为零。这里有 3 个因子，所以最多 3 个根。\n$x=1, 2, 3$ 都让 $y=0$。', en: 'Product is zero when at least one factor is zero. Three factors → up to 3 roots.\n$x=1, 2, 3$ all make $y=0$.' },
    onSkip: { zh: '因式分解的多项式：令每个因子 $=0$，解出 $x$。几个不同的根 = 几个交点。', en: 'Factored polynomial: set each factor $=0$, solve for $x$. Number of distinct roots = number of crossings.' },
  }],

  // === Unit 19: 向量进阶 ===
  11226: [{
    prompt: { zh: 'M 是 AB 的中点。$\\vec{OA} = \\mathbf{a}$，$\\vec{OB} = \\mathbf{b}$。$\\vec{OM}$ 怎么表示？', en: 'M is the midpoint of AB. $\\vec{OA} = \\mathbf{a}$, $\\vec{OB} = \\mathbf{b}$. How to express $\\vec{OM}$?' },
    type: 'choice',
    choices: [
      { zh: '$\\vec{OM} = \\frac{1}{2}(\\mathbf{a} + \\mathbf{b})$', en: '$\\vec{OM} = \\frac{1}{2}(\\mathbf{a} + \\mathbf{b})$' },
      { zh: '$\\vec{OM} = \\mathbf{a} + \\mathbf{b}$', en: '$\\vec{OM} = \\mathbf{a} + \\mathbf{b}$' },
    ],
    onCorrect: { zh: '中点 = 两端点位置向量的平均。\n$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{\\mathbf{a}+\\mathbf{b}}{2}$\n这是向量几何的核心技巧之一。', en: 'Midpoint = average of the two position vectors.\n$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{\\mathbf{a}+\\mathbf{b}}{2}$\nThis is a core vector geometry technique.' },
    onWrong: { zh: '$\\mathbf{a}+\\mathbf{b}$ 是两个向量之和，不是中点。中点要取平均——除以 2。\n$\\vec{OM} = \\frac{\\mathbf{a}+\\mathbf{b}}{2}$', en: '$\\mathbf{a}+\\mathbf{b}$ is the vector sum, not midpoint. Midpoint needs averaging — divide by 2.\n$\\vec{OM} = \\frac{\\mathbf{a}+\\mathbf{b}}{2}$' },
    onSkip: { zh: '中点公式：$\\vec{OM} = \\frac{\\mathbf{a}+\\mathbf{b}}{2}$。位置向量取平均。', en: 'Midpoint formula: $\\vec{OM} = \\frac{\\mathbf{a}+\\mathbf{b}}{2}$. Average the position vectors.' },
  }],
};

// ── Insertion logic (same as batch 1) ──
const filePath = path.join(import.meta.dirname, '../src/data/missions/y11.ts');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let insertCount = 0;

const insertionPoints = new Map<number, number>();
let currentId: number | null = null;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/id: (\d+), grade: 11/);
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
