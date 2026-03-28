// Auto-extracted from generateMission.ts
import { pickRandom, randInt, signTerm, coeffStr, signCoeff, eqStr, linearExpr, safeRetry, gcdCalc, buildNumericMC, type Mission, type BilingualText, type DifficultyTier, type GeneratorFn } from './shared';

export function generateSymmetryMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const coordPools = { 1: [1, 2, 3, 4, 5], 2: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 3: [-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8] };
  const px = pickRandom(coordPools[tier]);
  const py = pickRandom(coordPools[tier]);

  const modes = tier === 1 ? ['reflect_x', 'reflect_y'] : ['reflect_x', 'reflect_y', 'rotate_180'];
  const mode = pickRandom(modes);

  let ansX: number, ansY: number;
  let transformZh: string, transformEn: string;
  let ruleZh: string, ruleEn: string;
  let verifyZh: string, verifyEn: string;

  if (mode === 'reflect_x') {
    ansX = px; ansY = -py;
    transformZh = '关于 $x$ 轴的对称';
    transformEn = 'reflection in the $x$-axis';
    ruleZh = `$x$ 不变，$y$ 取反：$(x, y) \\to (x, -y)$`;
    ruleEn = `$x$ stays the same, $y$ changes sign: $(x, y) \\to (x, -y)$`;
    verifyZh = `原点 $(${px}, ${py})$ 和映像 $(${ansX}, ${ansY})$ 到 $x$ 轴距离相等？$|${py}| = |${ansY}|$ ✓`;
    verifyEn = `Original $(${px}, ${py})$ and image $(${ansX}, ${ansY})$ are equal distance from $x$-axis? $|${py}| = |${ansY}|$ ✓`;
  } else if (mode === 'reflect_y') {
    ansX = -px; ansY = py;
    transformZh = '关于 $y$ 轴的对称';
    transformEn = 'reflection in the $y$-axis';
    ruleZh = `$y$ 不变，$x$ 取反：$(x, y) \\to (-x, y)$`;
    ruleEn = `$y$ stays the same, $x$ changes sign: $(x, y) \\to (-x, y)$`;
    verifyZh = `原点 $(${px}, ${py})$ 和映像 $(${ansX}, ${ansY})$ 到 $y$ 轴距离相等？$|${px}| = |${ansX}|$ ✓`;
    verifyEn = `Original $(${px}, ${py})$ and image $(${ansX}, ${ansY})$ are equal distance from $y$-axis? $|${px}| = |${ansX}|$ ✓`;
  } else {
    ansX = -px; ansY = -py;
    transformZh = '绕原点旋转 $180°$';
    transformEn = 'rotation $180°$ about the origin';
    ruleZh = `$x$ 和 $y$ 都取反：$(x, y) \\to (-x, -y)$`;
    ruleEn = `Both $x$ and $y$ change sign: $(x, y) \\to (-x, -y)$`;
    verifyZh = `中点 $= (\\frac{${px}+(${ansX})}{2}, \\frac{${py}+(${ansY})}{2}) = (0, 0)$ = 旋转中心 ✓`;
    verifyEn = `Midpoint $= (\\frac{${px}+(${ansX})}{2}, \\frac{${py}+(${ansY})}{2}) = (0, 0)$ = centre of rotation ✓`;
  }

  const narrator = pickRandom(['诸葛亮', '周瑜']);
  const description: BilingualText = {
    zh: `点 $(${px}, ${py})$ 经过${transformZh}后的坐标`,
    en: `Find the image of $(${px}, ${py})$ after ${transformEn}`,
  };

  // Build intuitive explanation based on mode
  let intuitionZh: string, intuitionEn: string;
  let xExplainZh: string, xExplainEn: string;
  let yExplainZh: string, yExplainEn: string;
  if (mode === 'reflect_x') {
    intuitionZh = `想象 $x$ 轴是一面横放的镜子。\n你站在点 $(${px}, ${py})$ 上往镜子里看——镜子里的你，左右位置没变，但上下翻转了。`;
    intuitionEn = `Imagine the $x$-axis is a horizontal mirror.\nYou stand at $(${px}, ${py})$ and look in the mirror — your reflection keeps the same left-right position, but flips up-down.`;
    xExplainZh = `$x$ 坐标：镜子是横的，所以左右不变。\n$x' = ${px}$（和原来一样）`;
    xExplainEn = `$x$ coordinate: the mirror is horizontal, so left-right stays.\n$x' = ${px}$ (same as before)`;
    yExplainZh = `$y$ 坐标：上下翻转 = 正变负，负变正。\n$y$ 原来是 $${py}$，翻转后变成 $${ansY}$\n（"取反"就是加个负号，或者去掉负号）`;
    yExplainEn = `$y$ coordinate: up-down flips = positive becomes negative, negative becomes positive.\n$y$ was $${py}$, after flipping it becomes $${ansY}$\n("Change sign" means add a minus, or remove one)`;
  } else if (mode === 'reflect_y') {
    intuitionZh = `想象 $y$ 轴是一面竖放的镜子。\n你站在点 $(${px}, ${py})$ 上往镜子里看——镜子里的你，上下位置没变，但左右翻转了。`;
    intuitionEn = `Imagine the $y$-axis is a vertical mirror.\nYou stand at $(${px}, ${py})$ and look in the mirror — your reflection keeps the same up-down position, but flips left-right.`;
    xExplainZh = `$x$ 坐标：左右翻转 = 正变负，负变正。\n$x$ 原来是 $${px}$，翻转后变成 $${ansX}$`;
    xExplainEn = `$x$ coordinate: left-right flips = positive becomes negative, negative becomes positive.\n$x$ was $${px}$, after flipping it becomes $${ansX}$`;
    yExplainZh = `$y$ 坐标：镜子是竖的，所以上下不变。\n$y' = ${py}$（和原来一样）`;
    yExplainEn = `$y$ coordinate: the mirror is vertical, so up-down stays.\n$y' = ${py}$ (same as before)`;
  } else {
    intuitionZh = `想象你把整张纸绕中心点（原点）转半圈($180°$)。\n所有东西都"对面翻"了——左边的到右边，上面的到下面。`;
    intuitionEn = `Imagine spinning the whole page half a turn ($180°$) around the centre (origin).\nEverything flips to the opposite side — left goes right, top goes bottom.`;
    xExplainZh = `$x$ 坐标：转了半圈，左右互换。\n$x$ 原来是 $${px}$，翻转后变成 $${ansX}$`;
    xExplainEn = `$x$ coordinate: half turn swaps left and right.\n$x$ was $${px}$, after turning it becomes $${ansX}$`;
    yExplainZh = `$y$ 坐标：转了半圈，上下也互换。\n$y$ 原来是 $${py}$，翻转后变成 $${ansY}$`;
    yExplainEn = `$y$ coordinate: half turn swaps up and down too.\n$y$ was $${py}$, after turning it becomes $${ansY}$`;
  }

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要对称？\n布阵讲究左右呼应——你的左翼有 10 名弓箭手，右翼也要有 10 名。\n如果阵法不对称，敌人只要攻击薄弱的一侧就赢了。\n数学中的对称变换，就是帮我们精确计算"镜像位置"的工具。`,
        en: `${narrator}: "Why do we need symmetry?\nFormations need balance — 10 archers on the left, 10 on the right.\nIf a formation isn't symmetrical, the enemy just attacks the weak side.\nSymmetry transformations in maths are the tool for calculating exact mirror positions."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：${intuitionZh}\n\n别急，我们一步一步来！`,
        en: `${narrator}: "${intuitionEn}\n\nDon't rush — let's take it one step at a time!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：先看原始坐标\n我们的点在 $A = (${px}, ${py})$\n$x = ${px}$ 表示它在${px > 0 ? '右边' : px < 0 ? '左边' : '正中间'}\n$y = ${py}$ 表示它在${py > 0 ? '上面' : py < 0 ? '下面' : '正中间'}`,
        en: `${narrator}: "First, look at the original coordinates\nOur point is at $A = (${px}, ${py})$\n$x = ${px}$ means it's on the ${px > 0 ? 'right' : px < 0 ? 'left' : 'centre'}\n$y = ${py}$ means it's ${py > 0 ? 'above' : py < 0 ? 'below' : 'at the centre'}"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：先算新的 $x$ 坐标\n${xExplainZh}`,
        en: `${narrator}: "First, calculate the new $x$\n${xExplainEn}"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：再算新的 $y$ 坐标\n${yExplainZh}`,
        en: `${narrator}: "Now calculate the new $y$\n${yExplainEn}"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：把两个坐标组合起来\n新坐标 $A' = (${ansX}, ${ansY})$\n\n做得好！你已经完成了变换！`,
        en: `${narrator}: "Combine both coordinates\nNew coordinates $A' = (${ansX}, ${ansY})$\n\nWell done — you've completed the transformation!"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：记住规则，以后就更快了：\n${ruleZh}\n这个规则适用于所有的点，不只是这一个。`,
        en: `${narrator}: "Remember the rule for next time:\n${ruleEn}\nThis rule works for ALL points, not just this one."`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：验算\n${verifyZh}\n太棒了！对称变换掌握了，以后排兵布阵就靠你了！`,
        en: `${narrator}: "Verify\n${verifyEn}\nBrilliant! You've mastered symmetry — you'll be designing formations in no time!"`,
      },
      highlightField: 'y',
    },
  ];

  return {
    ...template,
    description,
    data: { px, py, mode, ansX, ansY, generatorType: 'SYMMETRY_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SIMULTANEOUS_Y8 generator: substitution method (simpler than Y9 elimination)
   ══════════════════════════════════════════════════════════ */

export function generateRotationMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = pickRandom(['诸葛亮', '马谡', '魏延']);

  const pointPools = { 1: [1, 2, 3, 4], 2: [-4, -3, -2, 2, 3, 4, 5], 3: [-5, -4, -3, 3, 4, 5, 6] };
  const px = pickRandom(pointPools[tier]);
  const py = pickRandom(pointPools[tier]);

  const angles = tier === 1 ? [90, 180] : [90, 180, 270];
  const angle = pickRandom(angles);

  let ansX: number, ansY: number;
  if (angle === 90) { ansX = -py; ansY = px; }
  else if (angle === 180) { ansX = -px; ansY = -py; }
  else { ansX = py; ansY = -px; } // 270°

  const description: BilingualText = {
    zh: `将点 $(${px}, ${py})$ 绕原点逆时针旋转 $${angle}°$，求新坐标。`,
    en: `Rotate point $(${px}, ${py})$ by $${angle}°$ anticlockwise about the origin. Find new coordinates.`,
  };

  const ruleZh = angle === 90 ? '$(x,y) \\to (-y, x)$' : angle === 180 ? '$(x,y) \\to (-x, -y)$' : '$(x,y) \\to (y, -x)$';
  const ruleEn = ruleZh;

  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学旋转？\n八阵图的奥秘！阵法变换就是把士兵的位置绕中心点旋转。\n掌握旋转规则，就能预测阵法变化后每个人的新位置。\n$90°$ = 向左转一个直角，$180°$ = 掉头，$270°$ = 向右转一个直角。`, en: `${narrator}: "Why learn rotation?\nThe secret of the Eight Formations! Changing formations means rotating soldiers' positions around a center.\nMaster rotation rules, and you can predict everyone's new position after a formation change.\n$90°$ = turn left one right angle, $180°$ = about-face, $270°$ = turn right one right angle."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：旋转 $${angle}°$ 的规则\n${ruleZh}\n\n记住：逆时针是正方向（数学约定）。`, en: `${narrator}: "The $${angle}°$ rotation rule\n${ruleEn}\n\nRemember: anticlockwise is the positive direction (math convention)."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：代入坐标\n原点 $(${px}, ${py})$\n按规则变换每个坐标。`, en: `${narrator}: "Substitute coordinates\nOriginal $(${px}, ${py})$\nApply the rule to each coordinate."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：计算\n$x' = ${ansX}$，$y' = ${ansY}$`, en: `${narrator}: "Calculate\n$x' = ${ansX}$, $y' = ${ansY}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案\n旋转后的新坐标 = $(${ansX}, ${ansY})$\n阵型变换完成！`, en: `${narrator}: "Answer\nNew coordinates after rotation = $(${ansX}, ${ansY})$\nFormation transform complete!"` }, highlightField: 'y' },
    { text: { zh: `${narrator}：验算\n新点到原点的距离应该和原点到旧点的距离相等（旋转不改变距离）。\n$\\sqrt{(${px})^2 + (${py})^2} = \\sqrt{(${ansX})^2 + (${ansY})^2}$ ✓`, en: `${narrator}: "Verify\nDistance from origin to new point should equal distance to old point (rotation preserves distance).\n$\\sqrt{(${px})^2 + (${py})^2} = \\sqrt{(${ansX})^2 + (${ansY})^2}$ ✓"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, targetX: ansX, targetY: ansY, px, py, angle, generatorType: 'ROTATION_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ENLARGEMENT generator: enlarge a point from the origin by scale factor k
   ══════════════════════════════════════════════════════════ */

export function generateEnlargementMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = pickRandom(['诸葛亮', '魏延', '姜维']);

  const pointPools = { 1: [1, 2, 3], 2: [1, 2, 3, 4, 5], 3: [-3, -2, 2, 3, 4, 5] };
  const px = pickRandom(pointPools[tier]);
  const py = pickRandom(pointPools[tier]);
  const kPools = { 1: [2, 3], 2: [2, 3, -1, -2], 3: [2, 3, -1, -2, -3] };
  const k = pickRandom(kPools[tier]);

  const ansX = k * px;
  const ansY = k * py;

  const description: BilingualText = {
    zh: `以原点为中心，将点 $(${px}, ${py})$ 放大 $${k}$ 倍，求新坐标。`,
    en: `Enlarge point $(${px}, ${py})$ by scale factor $${k}$ from the origin. Find new coordinates.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学缩放？\n地图制图！把实际地形按比例缩小画在图上——或者反过来，从地图推算实际距离。\n缩放就是"保持形状，改变大小"。\n倍数 > 1 → 放大，0 < 倍数 < 1 → 缩小，负数 → 翻转！`, en: `${narrator}: "Why learn enlargement?\nMap-making! Scale real terrain down onto a map — or work backwards to find real distances.\nEnlargement means 'keep the shape, change the size'.\nFactor > 1 → enlarge, 0 < factor < 1 → shrink, negative → flip!"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：从原点放大的规则\n$$（x, y) \\to (kx, ky)$$\n每个坐标都乘以放大倍数 $k = ${k}$。就这么简单！`, en: `${narrator}: "Enlargement from origin rule\n$$(x, y) \\to (kx, ky)$$\nMultiply each coordinate by scale factor $k = ${k}$. That simple!"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：代入\n原点 $(${px}, ${py})$，倍数 $k = ${k}$\n$x' = ${k} \\times ${px} = ${ansX}$\n$y' = ${k} \\times ${py} = ${ansY}$`, en: `${narrator}: "Substitute\nOriginal $(${px}, ${py})$, factor $k = ${k}$\n$x' = ${k} \\times ${px} = ${ansX}$\n$y' = ${k} \\times ${py} = ${ansY}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案\n放大后坐标 = $(${ansX}, ${ansY})$`, en: `${narrator}: "Answer\nEnlarged coordinates = $(${ansX}, ${ansY})$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案确认\n阵型放大 ${Math.abs(k)} 倍${k < 0 ? '并翻转' : ''}完成！`, en: `${narrator}: "Confirmed\nFormation enlarged ${Math.abs(k)}×${k < 0 ? ' and flipped' : ''} — done!"` }, highlightField: 'y' },
    { text: { zh: `${narrator}：验算\n新坐标 ÷ $k$ 应该等于原坐标：\n$${ansX} \\div ${k} = ${px}$ ✓\n$${ansY} \\div ${k} = ${py}$ ✓`, en: `${narrator}: "Verify\nNew coordinates ÷ $k$ should equal original:\n$${ansX} \\div ${k} = ${px}$ ✓\n$${ansY} \\div ${k} = ${py}$ ✓"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, targetX: ansX, targetY: ansY, px, py, k, generatorType: 'ENLARGEMENT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   VECTOR_ADD generator: add two 2D vectors
   ══════════════════════════════════════════════════════════ */

export function generateVectorAddMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = pickRandom(['诸葛亮', '姜维', '赵云']);

  const pools = { 1: [1, 2, 3, 4], 2: [-4, -3, -2, 2, 3, 4, 5], 3: [-5, -4, -3, 3, 4, 5, 6] };
  const a1 = pickRandom(pools[tier]);
  const a2 = pickRandom(pools[tier]);
  const b1 = pickRandom(pools[tier]);
  const b2 = pickRandom(pools[tier]);

  const ansX = a1 + b1;
  const ansY = a2 + b2;

  const description: BilingualText = {
    zh: `向量 $\\vec{a} = \\binom{${a1}}{${a2}}$，$\\vec{b} = \\binom{${b1}}{${b2}}$，求 $\\vec{a} + \\vec{b}$ 的 $x$ 和 $y$ 分量。`,
    en: `Vector $\\vec{a} = \\binom{${a1}}{${a2}}$, $\\vec{b} = \\binom{${b1}}{${b2}}$. Find the $x$ and $y$ components of $\\vec{a} + \\vec{b}$.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学向量？\n赵云从A点出发，先向东走3里再向北走4里。最终在哪？光知道距离不够，还得知道方向！\n向量就是同时记录"走多远"和"往哪走"。\n$\\binom{${a1}}{${a2}}$ 表示"水平 ${a1}，垂直 ${a2}"。`, en: `${narrator}: "Why learn vectors?\nZhao Yun starts at point A, walks 3 li east then 4 li north. Where does he end up? Distance alone isn't enough — you need direction too!\nA vector records both 'how far' and 'which way'.\n$\\binom{${a1}}{${a2}}$ means 'horizontal ${a1}, vertical ${a2}'."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：向量加法\n两段行军路线首尾相接——终点就是总位移。\n$$\\vec{a} + \\vec{b} = \\binom{${a1} ${signTerm(b1)}}{${a2} ${signTerm(b2)}}$$\n$x$ 分量加 $x$ 分量，$y$ 分量加 $y$ 分量。`, en: `${narrator}: "Vector addition\nTwo march routes end-to-end — the endpoint is the total displacement.\n$$\\vec{a} + \\vec{b} = \\binom{${a1} ${signTerm(b1)}}{${a2} ${signTerm(b2)}}$$\nAdd $x$ to $x$, $y$ to $y$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：计算 $x$ 分量\n$${a1} ${signTerm(b1)} = ${ansX}$`, en: `${narrator}: "Calculate $x$ component\n$${a1} ${signTerm(b1)} = ${ansX}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：计算 $y$ 分量\n$${a2} ${signTerm(b2)} = ${ansY}$`, en: `${narrator}: "Calculate $y$ component\n$${a2} ${signTerm(b2)} = ${ansY}$"` }, highlightField: 'y' },
    { text: { zh: `${narrator}：答案\n$\\vec{a} + \\vec{b} = \\binom{${ansX}}{${ansY}}$\n两段行军合并，总位移确认！`, en: `${narrator}: "Answer\n$\\vec{a} + \\vec{b} = \\binom{${ansX}}{${ansY}}$\nTwo marches combined, total displacement confirmed!"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：验算\n$\\binom{${ansX}}{${ansY}} - \\binom{${b1}}{${b2}} = \\binom{${a1}}{${a2}}$ ✓ 减回去等于第一段！`, en: `${narrator}: "Verify\n$\\binom{${ansX}}{${ansY}} - \\binom{${b1}}{${b2}} = \\binom{${a1}}{${a2}}$ ✓ Subtract back = first segment!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { targetX: ansX, targetY: ansY, a1, a2, b1, b2, generatorType: 'VECTOR_ADD_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   VECTOR_3D generator: add two 3D vectors
   ══════════════════════════════════════════════════════════ */

export function generateVector3DMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = pickRandom(['诸葛亮', '姜维', '司马懿']);

  const pools = { 1: [1, 2, 3, 4], 2: [-4, -3, -2, 2, 3, 4, 5], 3: [-6, -5, -4, 3, 4, 5, 6, 7] };
  const a1 = pickRandom(pools[tier]);
  const a2 = pickRandom(pools[tier]);
  const a3 = pickRandom(pools[tier]);
  const b1 = pickRandom(pools[tier]);
  const b2 = pickRandom(pools[tier]);
  const b3 = pickRandom(pools[tier]);

  const ansX = a1 + b1;
  const ansY = a2 + b2;
  const ansZ = a3 + b3;

  const description: BilingualText = {
    zh: `三维向量 $\\vec{a} = \\begin{pmatrix}${a1}\\\\${a2}\\\\${a3}\\end{pmatrix}$，$\\vec{b} = \\begin{pmatrix}${b1}\\\\${b2}\\\\${b3}\\end{pmatrix}$，求 $\\vec{a} + \\vec{b}$ 的三个分量。`,
    en: `3D vectors $\\vec{a} = \\begin{pmatrix}${a1}\\\\${a2}\\\\${a3}\\end{pmatrix}$, $\\vec{b} = \\begin{pmatrix}${b1}\\\\${b2}\\\\${b3}\\end{pmatrix}$. Find all three components of $\\vec{a} + \\vec{b}$.`,
  };

  const tutorialSteps = [
    { text: { zh: `${narrator}："为什么要学三维向量？\n\n真实的战场是三维的——不仅有东西南北，还有高低。\n弩箭射向敌阵：水平方向 $${a1}$，纵向 $${a2}$，还有高度 $${a3}$。\n三维向量 $\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}$ 同时记录三个方向的分量。"`, en: `${narrator}: "Why learn 3D vectors?\n\nReal battlefields are three-dimensional — not just north-south-east-west, but also up-down.\nAn arrow toward the enemy: horizontal $${a1}$, lateral $${a2}$, height $${a3}$.\nA 3D vector $\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}$ records all three components."` }, highlightField: 'x' },
    { text: { zh: `${narrator}："三维向量加法和二维一模一样——分量分别相加：\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}${a1}${signTerm(b1)}\\\\${a2}${signTerm(b2)}\\\\${a3}${signTerm(b3)}\\end{pmatrix}$$"`, en: `${narrator}: "3D vector addition works exactly like 2D — add components separately:\n$$\\vec{a}+\\vec{b} = \\begin{pmatrix}${a1}${signTerm(b1)}\\\\${a2}${signTerm(b2)}\\\\${a3}${signTerm(b3)}\\end{pmatrix}$$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}："$x$ 分量：$${a1} ${signTerm(b1)} = ${ansX}$"`, en: `${narrator}: "$x$ component: $${a1} ${signTerm(b1)} = ${ansX}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}："$y$ 分量：$${a2} ${signTerm(b2)} = ${ansY}$\n$z$ 分量：$${a3} ${signTerm(b3)} = ${ansZ}$"`, en: `${narrator}: "$y$ component: $${a2} ${signTerm(b2)} = ${ansY}$\n$z$ component: $${a3} ${signTerm(b3)} = ${ansZ}$"` }, highlightField: 'y' },
    { text: { zh: `${narrator}："答案：$\\vec{a}+\\vec{b} = \\begin{pmatrix}${ansX}\\\\${ansY}\\\\${ansZ}\\end{pmatrix}$"`, en: `${narrator}: "Answer: $\\vec{a}+\\vec{b} = \\begin{pmatrix}${ansX}\\\\${ansY}\\\\${ansZ}\\end{pmatrix}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}："验算：$\\begin{pmatrix}${ansX}\\\\${ansY}\\\\${ansZ}\\end{pmatrix} - \\begin{pmatrix}${b1}\\\\${b2}\\\\${b3}\\end{pmatrix} = \\begin{pmatrix}${a1}\\\\${a2}\\\\${a3}\\end{pmatrix}$ ✓ 减回去等于第一段！"`, en: `${narrator}: "Verify: $\\begin{pmatrix}${ansX}\\\\${ansY}\\\\${ansZ}\\end{pmatrix} - \\begin{pmatrix}${b1}\\\\${b2}\\\\${b3}\\end{pmatrix} = \\begin{pmatrix}${a1}\\\\${a2}\\\\${a3}\\end{pmatrix}$ ✓ Subtract back = first vector!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { targetX: ansX, targetY: ansY, targetZ: ansZ, a1, a2, a3, b1, b2, b3, generatorType: 'VECTOR_3D_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   CUMFREQ generator: cumulative frequency — find median from grouped data
   Uses STATISTICS type with mode='mean' (checker uses data.answer path)
   ══════════════════════════════════════════════════════════ */

export function generateDerivativeMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const func = template.data?.func as string | undefined;
  const narrator = pickRandom(['姜维', '诸葛亮', '刘禅']);

  if (func === '3x^2-3') {
    // f(x) = x³ - 3x → f'(x) = 3x² - 3 = 0 → x² = 1 → x = 1 (x>0)
    // Always x=1 for this function form (critical point at x=1)
    const x = 1;
    const description: BilingualText = {
      zh: `求 $f'(x) = 3x^2 - 3 = 0$ 的正根 $x$。`,
      en: `Find positive root $x$ of $f'(x) = 3x^2 - 3 = 0$.`,
    };
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要找“最稳的防线”？\n城墙受力不会处处一样——有的地方压力大，有的地方压力最小。\n补强材料要先送到“压力最低的转折点”，才能用最少兵力守住成都。\n导数就是帮我们找到这个关键位置的工具。`,
          en: `${narrator}: "Why find the most stable part of the wall?\nThe stress on the wall is not the same everywhere — some spots take more pressure, some take the least.\nReinforcements must go to the turning point with the LOWEST stress, so Chengdu can be defended with the least cost.\nDerivatives are the tool that helps us find that key position."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：把图像想成一条山路\n走向谷底时，坡度会从负数慢慢变成 $0$；过了谷底，又从 $0$ 变回正数。\n所以“最低点”那一瞬间，切线会暂时变平，也就是导数 = $0$。\n先找导数为 $0$ 的位置，再确认它是不是极小值点。`,
          en: `${narrator}: "Think of the graph as a mountain path\nAs you walk down into a valley, the slope goes from negative to $0$; after the valley, it changes from $0$ to positive.\nSo at the LOWEST point, the tangent briefly becomes flat, which means derivative = $0$.\nFirst find where the derivative is $0$, then confirm it is really a minimum."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：先写出极小值的条件\n极值点先满足 $f'(x) = 0$。\n题目已经给出 $f'(x) = 3x^2 - 3$，所以我们解：\n$3x^2 - 3 = 0$`,
          en: `${narrator}: "Write the condition for an extremum first\nAn extremum must first satisfy $f'(x) = 0$.\nThe problem already gives $f'(x) = 3x^2 - 3$, so we solve:\n$3x^2 - 3 = 0$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：移项\n把常数 $-3$ 移到右边：\n$3x^2 = 3$`,
          en: `${narrator}: "Rearrange\nMove the constant $-3$ to the right-hand side:\n$3x^2 = 3$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：再除以 $3$，并开方\n$x^2 = 1$\n所以 $x = \\pm 1$。\n但题目要求 $x > 0$，只取正根：$x = ${x}$。`,
          en: `${narrator}: "Divide by $3$, then take the square root\n$x^2 = 1$\nSo $x = \\pm 1$.\nBut the problem requires $x > 0$, so we keep only the positive root: $x = ${x}$."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：答案\n极小值点在 $x = ${x}$。\n最该加固的，就是城墙上的这个位置。`,
          en: `${narrator}: "Answer\nThe local minimum point is at $x = ${x}$.\nThis is the part of the wall that should be reinforced first."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：验算\n只满足 $f'(x)=0$ 还不够，还要确认它真的是“最小”不是“最大”。\n$f''(x) = 6x$，代入 $x = ${x}$：$f''(${x}) = 6 > 0$ ✓\n二阶导数为正，说明这里确实是极小值点。`,
          en: `${narrator}: "Verify\nIt is not enough for $f'(x)=0$ — we must also confirm this point is a MINIMUM, not a maximum.\n$f''(x) = 6x$, and at $x = ${x}$ we get $f''(${x}) = 6 > 0$ ✓\nA positive second derivative confirms this point is truly a local minimum."`,
        },
        highlightField: 'x',
      },
    ];
    return { ...template, description, data: { x, func: '3x^2-3', generatorType: 'DERIVATIVE_RANDOM' }, tutorialSteps };
  }

  // Pick from multiple slope functions based on tier/random
  const funcVariants = tier >= 3
    ? ['x^2', 'x^3', '2x^2+1'] as const
    : tier >= 2
      ? ['x^2', 'x^3'] as const
      : ['x^2'] as const;
  const chosenFunc = pickRandom([...funcVariants]);

  const xPools = { 1: [1, 2, 3], 2: [1, 2, 3, 4, -1, -2], 3: [-3, -2, 2, 3, 4, 5] };
  const x = pickRandom(xPools[tier]);

  let k: number, yExpr: string, dyExpr: string, calcExpr: string;
  if (chosenFunc === 'x^3') {
    k = 3 * x * x;
    yExpr = 'x^3'; dyExpr = '3x^2'; calcExpr = `3 \\times ${x}^2 = 3 \\times ${x * x} = ${k}`;
  } else if (chosenFunc === '2x^2+1') {
    k = 4 * x;
    yExpr = '2x^2 + 1'; dyExpr = '4x'; calcExpr = `4 \\times ${x} = ${k}`;
  } else {
    k = 2 * x;
    yExpr = 'x^2'; dyExpr = '2x'; calcExpr = `2 \\times ${x} = ${k}`;
  }
  const y = chosenFunc === 'x^3' ? x * x * x : chosenFunc === '2x^2+1' ? 2 * x * x + 1 : x * x;

  const description: BilingualText = {
    zh: `求 $y = ${yExpr}$ 在 $x = ${x}$ 处的切线斜率 $k$。`,
    en: `Find tangent slope $k$ of $y = ${yExpr}$ at $x = ${x}$.`,
  };
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学导数？\n想象一辆马车在加速——速度一直在变。某一瞬间到底有多快？\n导数就是回答"此刻的变化有多快"的工具。函数是位置，导数就是速度！`,
        en: `${narrator}: "Why learn derivatives?\nImagine a chariot accelerating — its speed keeps changing. How fast is it going at one exact moment?\nThe derivative answers 'how fast is the change right now'. The function is position, the derivative is speed!"`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：对 $y = ${yExpr}$ 求导\n$$\\frac{dy}{dx} = ${dyExpr}$$\n幂规则：指数拿下来当系数，指数减 1。`,
        en: `${narrator}: "Differentiate $y = ${yExpr}$\n$$\\frac{dy}{dx} = ${dyExpr}$$\nPower rule: bring exponent down as coefficient, reduce exponent by 1."`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：代入 $x = ${x}$\n$k = ${calcExpr}$`,
        en: `${narrator}: "Substitute $x = ${x}$\n$k = ${calcExpr}$"`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：计算结果\n$k = ${k}$`,
        en: `${narrator}: "Result\n$k = ${k}$"`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：答案 $k = ${k}$\n在 $x = ${x}$ 处，曲线的倾斜程度是 ${k}。`,
        en: `${narrator}: "Answer: $k = ${k}$\nAt $x = ${x}$, the steepness of the curve is ${k}."`,
      },
      highlightField: 'k',
    },
    {
      text: {
        zh: `${narrator}：验算\n$x = ${x}$ 处 $y = ${y}$；取 $x = ${x + 0.1}$ 算差分斜率，应接近 $${k}$ ✓`,
        en: `${narrator}: "Verify\nAt $x = ${x}$, $y = ${y}$; try $x = ${x + 0.1}$ for a difference quotient, should be close to $${k}$ ✓"`,
      },
      highlightField: 'k',
    },
  ];
  const story: BilingualText = {
    zh: `曲线 $y = ${yExpr}$，在 $x = ${x}$ 处修筑切线支架，斜率 $k$ 是多少？`,
    en: `Curve $y = ${yExpr}$: build a tangent support at $x = ${x}$. What is the slope $k$?`,
  };
  return { ...template, story, description, data: { x, func: chosenFunc, generatorType: 'DERIVATIVE_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   INTEGRATION generator: definite integral
   func='x': ∫ x dx = 0.5*(u²-l²)
   func='3x^2': ∫ 3x² dx = u³-l³
   else: ∫ 2x dx = u²-l²
   ══════════════════════════════════════════════════════════ */

export function generateIntegrationMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const func = template.data?.func as string;
  const narrator = pickRandom(['邓艾', '钟会', '诸葛亮']);

  const lowerPools = { 1: [0, 1], 2: [0, 1, 2], 3: [0, 2] };
  const upperOffsets = { 1: [2, 3], 2: [2, 3, 4, 5], 3: [5, 6, 8] };

  if (func === 'x') {
    const lower = pickRandom(lowerPools[tier]);
    const upper = lower + pickRandom(upperOffsets[tier]);
    const area = 0.5 * (upper * upper - lower * lower);

    const description: BilingualText = {
      zh: `求 $\\int_{${lower}}^{${upper}} x\\,dx$。`,
      en: `Find $\\int_{${lower}}^{${upper}} x\\,dx$.`,
    };
    const fUpper = 0.5 * upper * upper;
    const fLower = 0.5 * lower * lower;
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学积分？\n导数告诉你"速度"，积分告诉你"走了多远"。\n知道每一刻的速度，怎么算总路程？把每小段加起来——这就是积分的核心思想！`,
          en: `${narrator}: "Why learn integration?\nDerivatives tell you 'speed', integrals tell you 'how far you've gone'.\nKnowing the speed at every moment, how do you find total distance? Add up every tiny piece — that's the core idea of integration!"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：反导数（原函数）是什么? $\\int x\\,dx = \\frac{x^{2}}{2}$`,
          en: `${narrator}: "What is the antiderivative? $\\int x\\,dx = \\frac{x^{2}}{2}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：代入上下限：$F(${upper}) - F(${lower})$`,
          en: `${narrator}: "Substitute the limits: $F(${upper}) - F(${lower})$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：计算 $F(${upper}) = \\frac{${upper}^{2}}{2} = ${fUpper}$，$F(${lower}) = \\frac{${lower}^{2}}{2} = ${fLower}$`,
          en: `${narrator}: "Calculate $F(${upper}) = \\frac{${upper}^{2}}{2} = ${fUpper}$, $F(${lower}) = \\frac{${lower}^{2}}{2} = ${fLower}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：相减得到面积：$${fUpper} - ${fLower} = ${area}$!`,
          en: `${narrator}: "Subtract to get the area: $${fUpper} - ${fLower} = ${area}$!"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：验算\n$y = x$ 是一条直线，面积 = 梯形面积\n$= \\frac{(${lower} + ${upper}) \\times (${upper} - ${lower})}{2} = \\frac{${lower + upper} \\times ${upper - lower}}{2} = ${(lower + upper) * (upper - lower) / 2}$ ✓`,
          en: `${narrator}: "Verify\n$y = x$ is a straight line, area = trapezoid area\n$= \\frac{(${lower} + ${upper}) \\times (${upper} - ${lower})}{2} = \\frac{${lower + upper} \\times ${upper - lower}}{2} = ${(lower + upper) * (upper - lower) / 2}$ ✓"`,
        },
        highlightField: 'area',
      },
    ];
    return { ...template, description, data: { lower, upper, func: 'x', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
  }

  if (func === '3x^2') {
    const lower = pickRandom(tier === 3 ? [0, 1, 2] : [0, 1]);
    const upper = lower + pickRandom(tier === 1 ? [1, 2] : tier === 2 ? [1, 2, 3] : [2, 3, 4]);
    const area = upper * upper * upper - lower * lower * lower;

    const description: BilingualText = {
      zh: `求 $\\int_{${lower}}^{${upper}} 3x^2\\,dx$。`,
      en: `Find $\\int_{${lower}}^{${upper}} 3x^2\\,dx$.`,
    };
    const fUpper = upper * upper * upper;
    const fLower = lower * lower * lower;
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学积分？\n导数告诉你"速度"，积分告诉你"走了多远"。\n知道每一刻的速度，怎么算总路程？把每小段加起来——这就是积分的核心思想！`,
          en: `${narrator}: "Why learn integration?\nDerivatives tell you 'speed', integrals tell you 'how far you've gone'.\nKnowing the speed at every moment, how do you find total distance? Add up every tiny piece — that's the core idea of integration!"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：反导数（原函数）是什么? $\\int 3x^{2}\\,dx = x^{3}$`,
          en: `${narrator}: "What is the antiderivative? $\\int 3x^{2}\\,dx = x^{3}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：代入上下限：$F(${upper}) - F(${lower})$`,
          en: `${narrator}: "Substitute the limits: $F(${upper}) - F(${lower})$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：计算 $F(${upper}) = ${upper}^{3} = ${fUpper}$，$F(${lower}) = ${lower}^{3} = ${fLower}$`,
          en: `${narrator}: "Calculate $F(${upper}) = ${upper}^{3} = ${fUpper}$, $F(${lower}) = ${lower}^{3} = ${fLower}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：答案\n面积 = $${fUpper} - ${fLower} = ${area}$`,
          en: `${narrator}: "Answer\nArea = $${fUpper} - ${fLower} = ${area}$"`,
        },
        highlightField: 'area',
      },
      {
        text: {
          zh: `${narrator}：验算\n导数检查：$(x^3)' = 3x^2$ ✓ 原函数正确\n$F(${upper}) - F(${lower}) = ${fUpper} - ${fLower} = ${area}$ ✓`,
          en: `${narrator}: "Verify\nDerivative check: $(x^3)' = 3x^2$ ✓ Antiderivative correct\n$F(${upper}) - F(${lower}) = ${fUpper} - ${fLower} = ${area}$ ✓"`,
        },
        highlightField: 'area',
      },
    ];
    return { ...template, description, data: { lower, upper, func: '3x^2', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
  }

  if (func === '4x^3') {
    const lower = pickRandom(lowerPools[tier]);
    const uOffsets4 = { 1: [1, 2], 2: [1, 2, 3], 3: [2, 3] };
    const upper = lower + pickRandom(uOffsets4[tier]);
    const area = Math.pow(upper, 4) - Math.pow(lower, 4);

    const description: BilingualText = {
      zh: `求 $\\int_{${lower}}^{${upper}} 4x^3\\,dx$。`,
      en: `Find $\\int_{${lower}}^{${upper}} 4x^3\\,dx$.`,
    };
    const fU = Math.pow(upper, 4);
    const fL = Math.pow(lower, 4);
    const tutorialSteps = [
      { text: { zh: `${narrator}：为什么学 $\\int 4x^3$？\n四次幂增长极快——城墙加厚的材料成本就是这种曲线。积分帮我们算总量！`, en: `${narrator}: "Why learn $\\int 4x^3$?\nFourth powers grow rapidly — the material cost of thickening a wall follows this curve. Integration gives us the total!"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：幂规则\n$$\\int 4x^3\\,dx = \\frac{4}{3+1}x^{3+1} = x^4 + C$$\n指数加 1，再除以新指数，$4 \\div 4 = 1$。`, en: `${narrator}: "Power rule\n$$\\int 4x^3\\,dx = \\frac{4}{3+1}x^{3+1} = x^4 + C$$\nAdd 1 to exponent, divide: $4 \\div 4 = 1$."` }, highlightField: 'area' },
      { text: { zh: `${narrator}：代入上下界\n$F(${upper}) = ${upper}^4 = ${fU}$\n$F(${lower}) = ${lower}^4 = ${fL}$`, en: `${narrator}: "Substitute bounds\n$F(${upper}) = ${upper}^4 = ${fU}$\n$F(${lower}) = ${lower}^4 = ${fL}$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：做减法\n$${fU} - ${fL} = ${area}$`, en: `${narrator}: "Subtract\n$${fU} - ${fL} = ${area}$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：答案\n$\\int_{${lower}}^{${upper}} 4x^3\\,dx = ${area}$`, en: `${narrator}: "Answer\n$\\int_{${lower}}^{${upper}} 4x^3\\,dx = ${area}$"` }, highlightField: 'area' },
      { text: { zh: `${narrator}：验算\n对 $x^4$ 求导得 $4x^3$ ✓ 积分和导数互为逆运算！`, en: `${narrator}: "Verify\nDifferentiate $x^4$ to get $4x^3$ ✓ Integration and differentiation are inverses!"` }, highlightField: 'area' },
    ];
    return { ...template, description, data: { lower, upper, func: '4x^3', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
  }

  // else: ∫ 2x dx = u² - l²
  const lower = pickRandom(lowerPools[tier]);
  const upper = lower + pickRandom(tier === 1 ? [2, 3] : tier === 2 ? [2, 3, 4] : [3, 4, 6]);
  const area = upper * upper - lower * lower;

  const description: BilingualText = {
    zh: `求 $\\int_{${lower}}^{${upper}} 2x\\,dx$。`,
    en: `Find $\\int_{${lower}}^{${upper}} 2x\\,dx$.`,
  };
  const fUpper = upper * upper;
  const fLower = lower * lower;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学积分？\n导数告诉你"速度"，积分告诉你"走了多远"。\n知道每一刻的速度，怎么算总路程？把每小段加起来——这就是积分的核心思想！`,
        en: `${narrator}: "Why learn integration?\nDerivatives tell you 'speed', integrals tell you 'how far you've gone'.\nKnowing the speed at every moment, how do you find total distance? Add up every tiny piece — that's the core idea of integration!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：反导数（"导数的反操作"）\n$\\int 2x\\,dx = x^{2}$`,
        en: `${narrator}: "Antiderivative ('reverse of differentiation')\n$\\int 2x\\,dx = x^{2}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：代入上下限：$F(${upper}) - F(${lower})$`,
        en: `${narrator}: "Substitute the limits: $F(${upper}) - F(${lower})$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：计算 $F(${upper}) = ${upper}^{2} = ${fUpper}$，$F(${lower}) = ${lower}^{2} = ${fLower}$`,
        en: `${narrator}: "Calculate $F(${upper}) = ${upper}^{2} = ${fUpper}$, $F(${lower}) = ${lower}^{2} = ${fLower}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案\n面积 = $${fUpper} - ${fLower} = ${area}$`,
        en: `${narrator}: "Answer\nArea = $${fUpper} - ${fLower} = ${area}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：验算\n导数检查：$(x^2)' = 2x$ ✓ 原函数正确\n$F(${upper}) - F(${lower}) = ${fUpper} - ${fLower} = ${area}$ ✓`,
        en: `${narrator}: "Verify\nDerivative check: $(x^2)' = 2x$ ✓ Antiderivative correct\n$F(${upper}) - F(${lower}) = ${fUpper} - ${fLower} = ${area}$ ✓"`,
      },
      highlightField: 'area',
    },
  ];
  return { ...template, description, data: { lower, upper, func: '2x', generatorType: 'INTEGRATION_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   VOLUME generator: cylinder V = pi*r²*h (or cone V = 1/3*pi*r²*h)
   ══════════════════════════════════════════════════════════ */

export function generateRatioMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const ratios: [number, number][] = [[2, 3], [2, 5], [3, 4], [3, 5], [3, 7], [4, 5], [1, 3], [1, 4]];
  const [a, b] = pickRandom(ratios);
  const multiplierPools = { 1: [10, 20, 50], 2: [50, 100, 150, 200, 300, 500], 3: [200, 500, 800, 1000] };
  const multiplier = pickRandom(multiplierPools[tier]);

  const narrator = pickRandom(['曹操', '刘备']);
  const description: BilingualText = {
    zh: `比例 $${a}:${b}$，已知前项为 ${a * multiplier}，求后项。`,
    en: `Ratio $${a}:${b}$, first term is ${a * multiplier}, find second term.`,
  };

  const knownValue = a * multiplier;
  const answerValue = b * multiplier;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学比例？\n分军粮！100石粮食要按 $${a}:${b}$ 分给两营，怎么分才公平？\n比例就是"几份对几份"的分配方案——$${a}:${b}$ 意思是每 $${a}$ 份配 $${b}$ 份。`,
        en: `${narrator}: "Why learn ratios?\nDividing army rations! 100 bushels split $${a}:${b}$ between two camps — how to be fair?\nA ratio is a 'how many parts each' plan — $${a}:${b}$ means $${a}$ parts to $${b}$ parts."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：已知信息：\n比例是 $${a}:${b}$\n前项的实际值 = $${knownValue}$\n求后项的实际值。`,
        en: `${narrator}: "Given information:\nRatio is $${a}:${b}$\nFirst term actual value = $${knownValue}$\nFind the second term."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：找倍率(scale factor)\n$${knownValue} \\div ${a} = ${multiplier}$——每一份代表 $${multiplier}$。`,
        en: `${narrator}: "Find the scale factor\n$${knownValue} \\div ${a} = ${multiplier}$ — each part is worth $${multiplier}$."`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：用倍率乘以另一个比例份数：$${b} \\times ${multiplier} = ${answerValue}$`,
        en: `${narrator}: "Multiply the other ratio part by the scale factor: $${b} \\times ${multiplier} = ${answerValue}$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：答案：后项 = $${answerValue}$`,
        en: `${narrator}: "Answer: second term = $${answerValue}$"`,
      },
      highlightField: 'y',
    },
    {
      text: {
        zh: `${narrator}：验算\n检查比例：$${knownValue} : ${answerValue} = ${knownValue / multiplier} : ${answerValue / multiplier} = ${a} : ${b}$ ✓\n化简后回到原比例，验证成功！`,
        en: `${narrator}: "Verify\nCheck ratio: $${knownValue} : ${answerValue} = ${knownValue / multiplier} : ${answerValue / multiplier} = ${a} : ${b}$ ✓\nSimplifies back to the original ratio, verified!"`,
      },
      highlightField: 'y',
    },
  ];

  return {
    ...template,
    description,
    data: { a, b, answer: answerValue, generatorType: 'RATIO_RANDOM', ...buildNumericMC(answerValue, [a * multiplier, answerValue + a, answerValue - b, b]) },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SIMILARITY generator: proportional sides
   ══════════════════════════════════════════════════════════ */

export function generateRatioY7Mission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '曹操';
  const mode: 'simplify' | 'divide' = template.data?.mode ?? 'simplify';

  if (mode === 'divide') {
    // Divide a total in a given ratio
    const ratioPools: Record<DifficultyTier, [number, number][]> = {
      1: [[1, 2], [1, 3], [2, 3], [1, 4]],
      2: [[2, 3], [3, 4], [2, 5], [3, 5], [1, 4]],
      3: [[3, 5], [2, 7], [3, 7], [4, 5], [5, 7]],
    };
    const [a, b] = pickRandom(ratioPools[tier]);
    const parts = a + b;
    const totalPools: Record<DifficultyTier, number[]> = {
      1: [parts * 5, parts * 10, parts * 4, parts * 6],
      2: [parts * 8, parts * 10, parts * 12, parts * 15],
      3: [parts * 10, parts * 15, parts * 20, parts * 25],
    };
    const total = pickRandom(totalPools[tier]);
    const answerA = total * a / parts;
    const answerB = total * b / parts;
    // Ask for the smaller share (x)
    const answer = answerA;

    const description: BilingualText = {
      zh: `把 $${total}$ 按 $${a}:${b}$ 分配，较小份是多少？`,
      en: `Divide $${total}$ in the ratio $${a}:${b}$. What is the smaller share?`,
    };

    const eachPart = total / parts;

    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学"按比分配"？\n打仗立功，赏金不能平分——谁功劳大谁拿多。$${a}:${b}$ 就是分配方案。\n\n想象切蛋糕：一共切 $${parts}$ 块，甲拿 $${a}$ 块，乙拿 $${b}$ 块。\n比例不是具体数量，是"几份对几份"！`,
          en: `${narrator}: "Why learn 'dividing in a ratio'?\nWar rewards can't be split equally — bigger contribution, bigger share. $${a}:${b}$ is the split plan.\n\nImagine cutting a cake: $${parts}$ slices total, A gets $${a}$, B gets $${b}$.\nRatio isn't amounts — it's 'how many parts each'!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：第一步——算总份数\n$${a}:${b}$ → 总份数 $= ${a} + ${b} = ${parts}$\n\n蛋糕一共切 $${parts}$ 块。这一步很关键——漏了就全错！`,
          en: `${narrator}: "Step 1 — find total parts\n$${a}:${b}$ → total parts $= ${a} + ${b} = ${parts}$\n\nCake gets cut into $${parts}$ pieces. This step is crucial — miss it and everything goes wrong!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：第二步——算每份值多少\n总共 $${total}$ 金，分成 $${parts}$ 份：\n每份 $= ${total} \\div ${parts} = ${eachPart}$ 金\n\n每一块蛋糕值 $${eachPart}$ 金！`,
          en: `${narrator}: "Step 2 — find the value of each part\nTotal $${total}$ gold, divided into $${parts}$ parts:\nEach part $= ${total} \\div ${parts} = ${eachPart}$ gold\n\nEach slice of cake is worth $${eachPart}$ gold!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：第三步——各方拿走自己的份\n甲（$${a}$ 份）：$${a} \\times ${eachPart} = ${answerA}$ 金\n乙（$${b}$ 份）：$${b} \\times ${eachPart} = ${answerB}$ 金\n\n较小份 = $${answer}$ 金。`,
          en: `${narrator}: "Step 3 — each takes their share\nA ($${a}$ parts): $${a} \\times ${eachPart} = ${answerA}$ gold\nB ($${b}$ parts): $${b} \\times ${eachPart} = ${answerB}$ gold\n\nSmaller share = $${answer}$ gold."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：答案\n较小份 = $${answer}$ 金\n\n$${total}$ 金按 $${a}:${b}$ 分 → $${answerA}$ 和 $${answerB}$。`,
          en: `${narrator}: "Answer\nSmaller share = $${answer}$ gold\n\n$${total}$ gold in ratio $${a}:${b}$ → $${answerA}$ and $${answerB}$."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：验算——两份加起来等于总数吗？\n$${answerA} + ${answerB} = ${total}$ ✓\n\n比例对吗？$${answerA} : ${answerB} = ${a} : ${b}$ ✓\n\n赏金分配完毕，公平公正！做得漂亮！`,
          en: `${narrator}: "Verify — do both shares add to the total?\n$${answerA} + ${answerB} = ${total}$ ✓\n\nRatio correct? $${answerA} : ${answerB} = ${a} : ${b}$ ✓\n\nRewards distributed fairly! Brilliantly done!"`,
        },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { a, b, total, answer, mode, generatorType: 'RATIO_Y7_RANDOM' },
      tutorialSteps,
    };
  } else {
    // Simplify a ratio
    const gcdPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6], 3: [3, 4, 5, 6, 8, 10] };
    const simplePairs: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5]];
    const [sa, sb] = pickRandom(simplePairs);
    const g = pickRandom(gcdPools[tier]);
    const a = sa * g;
    const b = sb * g;
    // Answer is the simplified first term
    const answer = sa;

    const description: BilingualText = {
      zh: `化简比 $${a}:${b}$，最简比的第一项是多少？`,
      en: `Simplify $${a}:${b}$. What is the first term of the simplest ratio?`,
    };

    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：化简比——和约分是一回事！\n"步兵 $${a}$ 人，骑兵 $${b}$ 人"写成比就是 $${a}:${b}$。\n\n比例和分数是亲戚：$${a}:${b}$ 就像 $\\frac{${a}}{${b}}$。\n化简比 = 约分 = 找最大公因数！`,
          en: `${narrator}: "Simplifying ratios — same as simplifying fractions!\n'$${a}$ infantry, $${b}$ cavalry' as a ratio is $${a}:${b}$.\n\nRatios and fractions are related: $${a}:${b}$ is like $\\frac{${a}}{${b}}$.\nSimplify ratio = simplify fraction = find the HCF!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：为什么要化简？\n$${a}:${b}$ 和 $${sa}:${sb}$ 是同一个比例——但 $${sa}:${sb}$ 更简洁！\n\n就像 $\\frac{4}{8}$ 和 $\\frac{1}{2}$ 一样大，但 $\\frac{1}{2}$ 更清楚。\n化简 = 用最小的数字表达同一个关系。`,
          en: `${narrator}: "Why simplify?\n$${a}:${b}$ and $${sa}:${sb}$ are the same ratio — but $${sa}:${sb}$ is cleaner!\n\nLike $\\frac{4}{8}$ and $\\frac{1}{2}$ are equal, but $\\frac{1}{2}$ is clearer.\nSimplify = smallest numbers, same relationship."`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：怎么化简？找 $${a}$ 和 $${b}$ 的最大公因数（HCF）！\n$${a}$ 的因数：$${Array.from({length: a}, (_, i) => i + 1).filter(i => a % i === 0).join(', ')}$\n$${b}$ 的因数：$${Array.from({length: b}, (_, i) => i + 1).filter(i => b % i === 0).join(', ')}$\n\n最大公因数 = $${g}$——还记得 Unit 0 学的 HCF 吗？这里派上用场了！`,
          en: `${narrator}: "How? Find the HCF of $${a}$ and $${b}$!\nFactors of $${a}$: $${Array.from({length: a}, (_, i) => i + 1).filter(i => a % i === 0).join(', ')}$\nFactors of $${b}$: $${Array.from({length: b}, (_, i) => i + 1).filter(i => b % i === 0).join(', ')}$\n\nHCF = $${g}$ — remember HCF from Unit 0? It's useful here!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：两项同时除以 HCF\n$${a} \\div ${g} = ${sa}$\n$${b} \\div ${g} = ${sb}$\n\n所以 $${a}:${b} = ${sa}:${sb}$——就这么简单！`,
          en: `${narrator}: "Divide both terms by the HCF\n$${a} \\div ${g} = ${sa}$\n$${b} \\div ${g} = ${sb}$\n\nSo $${a}:${b} = ${sa}:${sb}$ — that's it!"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：答案\n$${a}:${b} = ${sa}:${sb}$，第一项 = $${sa}$`,
          en: `${narrator}: "Answer\n$${a}:${b} = ${sa}:${sb}$, first term = $${sa}$"`,
        },
        highlightField: 'ans',
      },
      {
        text: {
          zh: `${narrator}：验算——$${sa}:${sb}$ 还能再化简吗？\n$${sa}$ 和 $${sb}$ 的公因数只有 $1$（互质）→ 已经最简 ✓\n\n知识回环：HCF（Unit 0）→ 约分（Unit 0B）→ 化简比（这里！）\n学过的东西都串起来了，做得漂亮！`,
          en: `${narrator}: "Verify — can $${sa}:${sb}$ be simplified further?\nHCF of $${sa}$ and $${sb}$ is $1$ (coprime) → already simplest ✓\n\nKnowledge loop: HCF (Unit 0) → Simplify fractions (Unit 0B) → Simplify ratios (here!)\nEverything connects — brilliantly done!"`,
        },
        highlightField: 'ans',
      },
    ];

    return {
      ...template,
      description,
      data: { a, b, sa, sb, g, answer, mode, generatorType: 'RATIO_Y7_RANDOM' },
      tutorialSteps,
    };
  }
}

/* ══════════════════════════════════════════════════════════
   MIXED_IMPROPER generator: convert between mixed numbers
   and improper fractions
   ══════════════════════════════════════════════════════════ */

export function generateRatioY8Mission(template: Mission, tier: DifficultyTier = 2): Mission {
  const mode = (template.data?.mode as 'direct' | 'inverse') || pickRandom(['direct', 'inverse']) as 'direct' | 'inverse';

  const x1Pools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8], 3: [2, 3, 4, 5, 6, 8, 10] };
  const x2Pools = { 1: [2, 3, 5], 2: [2, 3, 4, 5, 6, 8, 10], 3: [2, 3, 4, 5, 6, 8, 10, 12] };
  const x1 = pickRandom(x1Pools[tier]);
  let x2 = pickRandom(x2Pools[tier]);
  while (x2 === x1) x2 = pickRandom(x2Pools[tier]);

  let k: number, y1: number, y2: number;
  if (mode === 'inverse') {
    // For inverse proportion y=k/x, k must be divisible by both x1 and x2
    const lcm = (a: number, b: number) => { const g = (a: number, b: number): number => b ? g(b, a % b) : a; return a * b / g(a, b); };
    const minK = lcm(x1, x2);
    const kMultipliers = { 1: [1, 2], 2: [1, 2, 3], 3: [1, 2, 3, 4] };
    k = minK * pickRandom(kMultipliers[tier]);
    y1 = k / x1;
    y2 = k / x2;
  } else {
    const kPools = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 8, 10], 3: [2, 3, 4, 5, 6, 7, 8, 10, 12, 15] };
    k = pickRandom(kPools[tier]);
    y1 = k * x1;
    y2 = k * x2;
  }

  const narrator = pickRandom(['曹操', '刘备']);

  const description: BilingualText = mode === 'direct'
    ? { zh: `$y$ 与 $x$ 成正比。当 $x=${x1}$ 时 $y=${y1}$，求 $x=${x2}$ 时的 $y$。`, en: `$y$ is directly proportional to $x$. When $x=${x1}$, $y=${y1}$. Find $y$ when $x=${x2}$.` }
    : { zh: `$y$ 与 $x$ 成反比。当 $x=${x1}$ 时 $y=${y1}$，求 $x=${x2}$ 时的 $y$。`, en: `$y$ is inversely proportional to $x$. When $x=${x1}$, $y=${y1}$. Find $y$ when $x=${x2}$.` };

  const formulaZh = mode === 'direct' ? '$y = kx$' : '$y = \\frac{k}{x}$';
  const formulaEn = formulaZh;
  const conceptZh = mode === 'direct'
    ? '正比例：$x$ 增大，$y$ 也增大，比值恒定。'
    : '反比例：$x$ 增大，$y$ 反而减小，乘积恒定。';
  const conceptEn = mode === 'direct'
    ? 'Direct proportion: as $x$ increases, $y$ increases — the ratio stays constant.'
    : 'Inverse proportion: as $x$ increases, $y$ decreases — the product stays constant.';

  const findKZh = mode === 'direct'
    ? `$k = \\frac{y}{x} = \\frac{${y1}}{${x1}} = ${k}$`
    : `$k = y \\times x = ${y1} \\times ${x1} = ${k}$`;
  const findKEn = findKZh;

  const calcZh = mode === 'direct'
    ? `$y = ${k} \\times ${x2} = ${y2}$`
    : `$y = \\frac{${k}}{${x2}} = ${y2}$`;
  const calcEn = calcZh;

  const verifyZh = mode === 'direct'
    ? `$\\frac{y_1}{x_1} = \\frac{${y1}}{${x1}} = ${k}$，$\\frac{y_2}{x_2} = \\frac{${y2}}{${x2}} = ${k}$ ✓ 比值相等！`
    : `$y_1 \\times x_1 = ${y1} \\times ${x1} = ${k}$，$y_2 \\times x_2 = ${y2} \\times ${x2} = ${k}$ ✓ 乘积相等！`;
  const verifyEn = mode === 'direct'
    ? `$\\frac{y_1}{x_1} = \\frac{${y1}}{${x1}} = ${k}$, $\\frac{y_2}{x_2} = \\frac{${y2}}{${x2}} = ${k}$ ✓ Ratios are equal!`
    : `$y_1 \\times x_1 = ${y1} \\times ${x1} = ${k}$, $y_2 \\times x_2 = ${y2} \\times ${x2} = ${k}$ ✓ Products are equal!`;

  const directAnalogy = {
    zh: `想象一个水龙头：开大一倍，水流也大一倍。\n水流和开度成**正比**——一个变大，另一个也按同样倍数变大。\n它们的比值 $\\frac{y}{x}$ 永远不变，这个不变的比值就叫 $k$。`,
    en: `Imagine a tap: open it twice as much, water flows twice as fast.\nWater flow is DIRECTLY proportional to how far you open it — one grows, the other grows by the same factor.\nTheir ratio $\\frac{y}{x}$ never changes — this unchanging ratio is called $k$.`,
  };
  const inverseAnalogy = {
    zh: `想象分蛋糕：人越多，每人分到的越少。\n每人的份量和人数成**反比**——一个变大，另一个就变小。\n它们的乘积 $x \\times y$ 永远不变（因为蛋糕总量没变），这个不变的乘积就叫 $k$。`,
    en: `Imagine sharing a cake: more people means less each person gets.\nEach person's share is INVERSELY proportional to the number of people — one grows, the other shrinks.\nTheir product $x \\times y$ never changes (the cake stays the same size) — this unchanging product is called $k$.`,
  };
  const analogy = mode === 'direct' ? directAnalogy : inverseAnalogy;

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么需要比例？\n治理天下处处是比例关系：\n税收和人口成正比（人越多税越多），粮草和军队数成反比（兵越多每人分到越少）。\n掌握比例，就能用已知推算未知——这是治国的核心能力！`,
        en: `${narrator}: "Why do we need proportion?\nGoverning a realm is all about proportion:\nTax is proportional to population (more people, more tax). Rations are inversely proportional to army size (more soldiers, less each gets).\nMaster proportion, and you can predict the unknown from the known — a ruler's core skill!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：${analogy.zh}`,
        en: `${narrator}: "${analogy.en}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：从题目提取已知信息：\n已知一组数据：当 $x = ${x1}$ 时，$y = ${y1}$\n目标：求当 $x = ${x2}$ 时，$y = ?$\n\n信息都找齐了，接下来就是三步计算！`,
        en: `${narrator}: "Extract the given information:\nKnown pair: when $x = ${x1}$, $y = ${y1}$\nGoal: find $y$ when $x = ${x2}$\n\nAll information gathered — just three calculation steps to go!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第一步——求常数 $k$\n$k$ 就是那个"永远不变的数"。用已知数据算出它：\n${findKZh}\n\n$k = ${k}$，记住这个数！`,
        en: `${narrator}: "Step 1 — find the constant $k$\n$k$ is the 'number that never changes'. Calculate it from the known data:\n${findKEn}\n\n$k = ${k}$, remember this number!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：第二步——用 $k$ 和新的 $x$ 求 $y$\n$k$ 不变，$x$ 变了，$y$ 自然跟着变。\n当 $x = ${x2}$ 时：\n${calcZh}`,
        en: `${narrator}: "Step 2 — use $k$ and the new $x$ to find $y$\n$k$ stays the same, $x$ changes, so $y$ changes accordingly.\nWhen $x = ${x2}$:\n${calcEn}"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n$y = ${y2}$\n\n做得非常好！你已经完成了比例计算！`,
        en: `${narrator}: "Answer\n$y = ${y2}$\n\nVery well done — you've completed the proportion calculation!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n${verifyZh}\n$k$ 果然没变！说明我们算对了。`,
        en: `${narrator}: "Verify\n${verifyEn}\n$k$ really didn't change! That confirms our answer is correct."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：总结规律\n${mode === 'direct' ? '正比例：$x$ 变大 → $y$ 也变大（同向变化）' : '反比例：$x$ 变大 → $y$ 反而变小（反向变化）'}\n公式：${formulaZh}\n\n掌握了这个规律，以后碰到类似题目就不怕了！了不起！`,
        en: `${narrator}: "Summary\n${mode === 'direct' ? 'Direct proportion: $x$ increases → $y$ increases too (same direction)' : 'Inverse proportion: $x$ increases → $y$ decreases (opposite direction)'}\nFormula: ${formulaEn}\n\nWith this pattern mastered, you'll never fear proportion problems again! Impressive!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算\n$${x2} \\times ${k} = ${y2}$ ✓\n比例关系确认无误！`,
        en: `${narrator}: "Verify\n$${x2} \\times ${k} = ${y2}$ ✓\nProportion confirmed!"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, mode, k, x1, y1, x2, y2, answer: y2, generatorType: 'RATIO_Y8_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   VENN generator: two-set Venn diagram problems
   Asks for intersection, union, complement, or set-only count
   ══════════════════════════════════════════════════════════ */
