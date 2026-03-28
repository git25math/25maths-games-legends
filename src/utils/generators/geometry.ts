// Auto-extracted from generateMission.ts
import { pickRandom, randInt, signTerm, coeffStr, signCoeff, eqStr, linearExpr, safeRetry, gcdCalc, type Mission, type BilingualText, type DifficultyTier, type GeneratorFn } from './shared';

export function generateAnglesMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const total = template.data?.total || 180;
  const suppRanges = { 1: [30, 150] as const, 2: [20, 160] as const, 3: [10, 170] as const };
  const compRanges = { 1: [20, 70] as const, 2: [10, 80] as const, 3: [5, 85] as const };
  const range = total === 90 ? compRanges[tier] : suppRanges[tier];
  const angle = randInt(range[0], range[1]);
  const ans = total - angle;
  const kind = total === 90 ? { zh: '余角', en: 'complementary' } : { zh: '补角', en: 'supplementary' };
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '吕布';

  const description: BilingualText = {
    zh: `计算${kind.zh}：$${total} - ${angle} = x$。`,
    en: `Calculate ${kind.en} angle: $${total} - ${angle} = x$.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学角度？\n想象你站在城墙上——射箭的角度、城门的开合、军旗的倾斜——全是角度！\n${total === 90 ? '两个角加起来 = 90°，叫"余角"。' : '两个角加起来 = 180°（一条直线），叫"补角"。'}\n学会角度计算，才能精准攻防！`,
        en: `${narrator}: "Why learn angles?\nImagine standing on the city wall — arrow angles, gate openings, flag tilts — all angles!\n${total === 90 ? 'Two angles adding to 90° are complementary.' : 'Two angles adding to 180° (a straight line) are supplementary.'}\nMaster angle calculations for precise attack and defense!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：${kind.zh}的关系——两个角加起来等于 $${total}°$\n已知一个角是 $${angle}°$，另一个是多少？\n\n就像天平——一边放了 $${angle}°$，另一边要放多少才能平衡到 $${total}°$？`,
        en: `${narrator}: "${kind.en} angles add up to $${total}°$\nOne angle is $${angle}°$ — what's the other?\n\nLike a balance — $${angle}°$ on one side, how much on the other to reach $${total}°$?"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：列式——$x = ${total} - ${angle}$`,
        en: `${narrator}: "Set up: $x = ${total} - ${angle}$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：计算——$x = ${total} - ${angle} = ${ans}$\n\n所以${kind.zh}是 $${ans}°$！`,
        en: `${narrator}: "Calculate: $x = ${total} - ${angle} = ${ans}$\n\nSo the ${kind.en} angle is $${ans}°$!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：验算——把两个角加起来\n$${ans} + ${angle} = ${total}$ ✓\n等于 $${total}°$，完全正确！`,
        en: `${narrator}: "Verify — add both angles\n$${ans} + ${angle} = ${total}$ ✓\nEquals $${total}°$, correct!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：记住！${total === 90 ? '余角 = 90° 减已知角' : '补角 = 180° 减已知角'}\n公式：$x = ${total} - \\text{已知角}$\n\n城墙上每个角度都关乎生死——算准了才能赢！`,
        en: `${narrator}: "Remember! ${total === 90 ? 'Complementary = 90° minus known angle' : 'Supplementary = 180° minus known angle'}\nFormula: $x = ${total} - \\text{known angle}$\n\nEvery angle on the wall matters — get it right to win!"`,
      },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, angle, total, ans, generatorType: 'ANGLES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ARITHMETIC sequence generator: a_n = a1 + (n-1)d
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateAnglesTriangleMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '关羽';

  const ranges: Record<DifficultyTier, [number, number]> = { 1: [30, 80], 2: [20, 90], 3: [15, 120] };
  const a1 = randInt(ranges[tier][0], ranges[tier][1]);
  const maxA2 = Math.min(ranges[tier][1], 180 - a1 - 10);
  const minA2 = Math.max(ranges[tier][0], 10);
  const a2 = randInt(Math.min(minA2, maxA2), maxA2);
  const answer = 180 - a1 - a2;

  const description: BilingualText = {
    zh: `三角形两个角分别是 $${a1}°$ 和 $${a2}°$，第三个角是多少？`,
    en: `A triangle has angles $${a1}°$ and $${a2}°$. Find the third angle.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要算三角形的角？\n三角旗只知道两个角，第三个角不知道——没有它，裁缝就没法裁布！\n\n好消息：三角形有一个神奇的规律，只要知道两个角，第三个角一定能算出来。`,
        en: `${narrator}: "Why find triangle angles?\nA triangular banner has two known angles, but the third is missing — without it, the tailor can't cut the fabric!\n\nGood news: triangles have a magical rule. Know two angles, and the third can always be found."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：角度怎么量？\n"角"就是两条线交叉张开的程度。我们用"度"（°）来衡量：\n• 直角 = $90°$（像书角）\n• 半圈 = $180°$（一条直线）\n• 整圈 = $360°$\n\n角度越大，两条线张得越开！`,
        en: `${narrator}: "How do we measure angles?\nAn 'angle' is how far two lines spread when they meet. We measure in 'degrees' (°):\n• Right angle = $90°$ (like a book corner)\n• Half turn = $180°$ (a straight line)\n• Full turn = $360°$\n\nBigger angle = wider spread!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：重要定理——三角形三个角加起来永远 = $180°$\n为什么？把三角形的三个角撕下来，拼在一起——刚好拼成一条直线！\n一条直线 = $180°$。\n\n不管什么形状的三角形——尖的、扁的、等边的——三个角之和都是 $180°$！`,
        en: `${narrator}: "Key theorem — triangle angles ALWAYS add to $180°$\nWhy? Tear off the three corners of a paper triangle and arrange them — they form a straight line!\nA straight line = $180°$.\n\nANY triangle — pointy, flat, equilateral — the three angles always sum to $180°$!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：已知两个角——先加起来\n角 1 = $${a1}°$，角 2 = $${a2}°$\n\n两角之和：$${a1} + ${a2} = ${a1 + a2}°$\n\n三个角总共 $180°$，已经用掉了 $${a1 + a2}°$——剩下的就是第三个角！`,
        en: `${narrator}: "Two angles known — add them first\nAngle 1 = $${a1}°$, Angle 2 = $${a2}°$\n\nSum of two: $${a1} + ${a2} = ${a1 + a2}°$\n\nTotal is $180°$, already used $${a1 + a2}°$ — the rest is the third angle!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：答案\n$x = 180° - ${a1 + a2}° = ${answer}°$\n\n三角旗的第三个角找到了！做得好！`,
        en: `${narrator}: "Answer\n$x = 180° - ${a1 + a2}° = ${answer}°$\n\nThe banner's third angle is found! Well done!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：验算——三个角加起来是 $180°$ 吗？\n$${a1}° + ${a2}° + ${answer}° = ${a1 + a2 + answer}°$ ✓\n\n${answer < 90 ? `$${answer}°$ 是锐角（小于 $90°$）` : answer === 90 ? `$${answer}°$ 是直角` : `$${answer}°$ 是钝角（大于 $90°$）`}\n记住：三角形最多只能有一个钝角或直角！`,
        en: `${narrator}: "Verify — do all three add to $180°$?\n$${a1}° + ${a2}° + ${answer}° = ${a1 + a2 + answer}°$ ✓\n\n${answer < 90 ? `$${answer}°$ is acute (less than $90°$)` : answer === 90 ? `$${answer}°$ is a right angle` : `$${answer}°$ is obtuse (greater than $90°$)`}\nRemember: a triangle can have at most ONE obtuse or right angle!"`,
      },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, angle: a1 + a2, total: 180, a1, a2, generatorType: 'ANGLES_TRIANGLE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   ANGLES_POINT generator: angles at a point sum to 360°
   ══════════════════════════════════════════════════════════ */

export function generateAnglesPointMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  // Generate 2-3 known angles, find the missing one
  const numKnown = tier === 1 ? 2 : tier === 2 ? pickRandom([2, 3]) : 3;
  const angles: number[] = [];
  let remaining = 360;
  for (let i = 0; i < numKnown; i++) {
    const minA = 30;
    const maxA = Math.min(160, remaining - (numKnown - i) * minA);
    // Safety: if maxA < minA, cap to avoid randInt inversion
    const a = maxA < minA ? minA : randInt(minA, maxA);
    angles.push(a);
    remaining -= a;
  }
  const answer = remaining;
  // Safety: ensure answer is positive and reasonable; retry if not
  if (answer < 10 || answer > 350) return safeRetry(template, generateAnglesPointMission, tier);

  const anglesStr = angles.map(a => `$${a}°$`).join('、');
  const anglesStrEn = angles.map(a => `$${a}°$`).join(', ');
  const sum = angles.reduce((s, a) => s + a, 0);

  const description: BilingualText = {
    zh: `围绕一点的角度分别是 ${anglesStr} 和 $x°$，求 $x$。`,
    en: `Angles around a point are ${anglesStrEn} and $x°$. Find $x$.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么是 $360°$？\n想象你站在瞭望台上，面朝北开始，慢慢转身——东→南→西→回到北。\n转了一整圈 = $360°$。\n\n为什么是 360？古人把天空分成 360 份（大约每天太阳移动 $1°$，一年 ≈ 360 天）。`,
        en: `${narrator}: "Why $360°$?\nImagine standing on a watchtower, facing North. Turn slowly — East → South → West → back to North.\nOne full turn = $360°$.\n\nWhy 360? Ancient people divided the sky into 360 parts (the sun moves about $1°$ per day, ~360 days in a year)."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：核心规则——围绕一点的所有角加起来 = $360°$\n就像把一个圆饼切成几块——不管切多少块，所有块合起来还是一个完整的圆！\n\n完整的圆 = $360°$，一度都不会多，一度也不会少。`,
        en: `${narrator}: "Core rule — all angles around a point add up to $360°$\nLike cutting a round pie into pieces — no matter how many, they all form a complete circle!\n\nComplete circle = $360°$. Not one degree more, not one less."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：先把已知的角加起来\n$${angles.join('° + ')}°$\n$= ${sum}°$\n\n$360°$ 里已经有 $${sum}°$ 了——还剩多少度？`,
        en: `${narrator}: "Add up the known angles first\n$${angles.join('° + ')}°$\n$= ${sum}°$\n\n$360°$ has $${sum}°$ accounted for — how many degrees left?"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：用总度数减去已知角\n$x = 360° - ${sum}° = ${answer}°$\n\n就像分蛋糕：总共 $360°$，别人分走了 $${sum}°$，你拿到剩下的 $${answer}°$！`,
        en: `${narrator}: "Subtract known from total\n$x = 360° - ${sum}° = ${answer}°$\n\nLike sharing a cake: total $360°$, others took $${sum}°$, you get the remaining $${answer}°$!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：答案\n$x = ${answer}°$\n\n围绕一点的所有角：${angles.map(a => `$${a}°$`).join(' + ')} + $${answer}°$ = $360°$`,
        en: `${narrator}: "Answer\n$x = ${answer}°$\n\nAll angles around the point: ${angles.map(a => `$${a}°$`).join(' + ')} + $${answer}°$ = $360°$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：验算——所有角加起来是 $360°$ 吗？\n$${angles.join('° + ')}° + ${answer}° = ${sum + answer}°$ ✓\n\n$${sum + answer} = 360$ ✓ 正好一整圈！瞭望完毕，做得漂亮！`,
        en: `${narrator}: "Verify — do all angles sum to $360°$?\n$${angles.join('° + ')}° + ${answer}° = ${sum + answer}°$ ✓\n\n$${sum + answer} = 360$ ✓ Exactly one full turn! Lookout complete — brilliantly done!"`,
      },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, angle: sum, total: 360, angles, generatorType: 'ANGLES_POINT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SEQUENCE_Y7 generator: simple linear sequences for Y7
   ══════════════════════════════════════════════════════════ */

export function generateParallelAnglesMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrators = ['关羽', '张飞', '赵云'];
  const narrator = pickRandom(narrators);

  const anglePools: Record<number, number[]> = { 1: [40, 50, 60, 70], 2: [35, 45, 55, 65, 75], 3: [32, 48, 53, 67, 78, 83] };
  const givenAngle = pickRandom(anglePools[tier]);

  const types = ['alternate', 'corresponding', 'co-interior'] as const;
  const angleType = pickRandom([...types]);

  let answer: number;
  let typeZh: string;
  let typeEn: string;
  let reasonZh: string;
  let reasonEn: string;

  if (angleType === 'alternate') {
    answer = givenAngle;
    typeZh = '内错角';
    typeEn = 'alternate angles';
    reasonZh = '内错角相等（Z字形）';
    reasonEn = 'Alternate angles are equal (Z-shape)';
  } else if (angleType === 'corresponding') {
    answer = givenAngle;
    typeZh = '同位角';
    typeEn = 'corresponding angles';
    reasonZh = '同位角相等（F字形）';
    reasonEn = 'Corresponding angles are equal (F-shape)';
  } else {
    answer = 180 - givenAngle;
    typeZh = '同旁内角';
    typeEn = 'co-interior angles';
    reasonZh = '同旁内角互补（C字形/U字形）';
    reasonEn = 'Co-interior angles are supplementary (C-shape/U-shape)';
  }

  const description = {
    zh: `两平行线被一条直线截断。已知角 $= ${givenAngle}°$，求${typeZh} $x$。`,
    en: `Two parallel lines cut by a transversal. Given angle $= ${givenAngle}°$. Find the ${typeEn} $x$.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：平行线和角度有什么关系？\n你看城墙——上下两道城墙是平行的，攻城梯斜斜地搭在上面。\n梯子和城墙形成了好多角度，而且这些角度之间有神奇的规律！\n\n只要城墙是平行的，这些规律**永远成立**。学会了就能快速算出未知角度！`,
        en: `${narrator}: "What do parallel lines have to do with angles?\nLook at the city walls — the top and bottom walls are parallel, and the siege ladder leans across them.\nThe ladder creates many angles with the walls, and these angles follow magical rules!\n\nAs long as the walls are parallel, these rules ALWAYS hold. Learn them and you can find any unknown angle instantly!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：三种角度规律——记住字母形状就行！\n1. **同位角**（F 字形）：位置相同 → 角度相等\n2. **内错角**（Z 字形）：交叉对望 → 角度相等\n3. **同旁内角**（C 字形）：同侧挤着 → 加起来 = $180°$\n\n画一条横线穿过两条平行线，转动手中的纸，你就能看到 F、Z、C 的形状！`,
        en: `${narrator}: "Three angle rules — just remember the letter shapes!\n1. **Corresponding** (F-shape): same position → equal\n2. **Alternate** (Z-shape): cross-looking → equal\n3. **Co-interior** (C/U-shape): same side → add to $180°$\n\nDraw a line through two parallel lines, rotate the paper, and you'll see F, Z, C shapes!"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：看看这道题是哪种？\n已知角 $= ${givenAngle}°$，要求的 $x$ 和它是什么关系？\n\n这一对是**${typeZh}**！\n${reasonZh}。\n\n${angleType === 'co-interior' ? '它们在截线的同一侧——想象两个人背靠背挤在一起，加起来撑满 $180°$。' : angleType === 'alternate' ? '它们在截线的两侧——像 Z 字形的两个拐角，虽然位置不同但角度一样！' : '它们在截线的同一侧、同一个位置——像 F 字形的两个横杠处，角度完全一样！'}`,
        en: `${narrator}: "Which type is this problem?\nGiven angle $= ${givenAngle}°$, what's the relationship with $x$?\n\nThis pair is **${typeEn}**!\n${reasonEn}.\n\n${angleType === 'co-interior' ? 'They\'re on the same side of the transversal — imagine two people back-to-back, together filling exactly $180°$.' : angleType === 'alternate' ? 'They\'re on opposite sides — like the two turns in a Z, different positions but same angle!' : 'They\'re in matching positions — like the two bars of an F, exactly the same angle!'}"`,
      },
      highlightField: 'x',
    },
    {
      text: angleType === 'co-interior' ? {
        zh: `${narrator}：代入计算\n同旁内角加起来 $= 180°$，所以：\n$x + ${givenAngle}° = 180°$\n$x = 180° - ${givenAngle}° = ${answer}°$\n\n就像拼图——两块拼在一起刚好是一条直线（$180°$），知道一块就能算另一块！`,
        en: `${narrator}: "Plug in and calculate\nCo-interior angles add to $180°$, so:\n$x + ${givenAngle}° = 180°$\n$x = 180° - ${givenAngle}° = ${answer}°$\n\nLike a puzzle — two pieces together make a straight line ($180°$). Know one piece, find the other!"`,
      } : {
        zh: `${narrator}：代入计算\n${typeZh}相等，所以直接：\n$x = ${givenAngle}°$\n\n就这么简单！${angleType === 'alternate' ? 'Z 字形两端的角一模一样。' : 'F 字形两横的角一模一样。'}`,
        en: `${narrator}: "Plug in and calculate\n${typeEn} are equal, so simply:\n$x = ${givenAngle}°$\n\nThat simple! ${angleType === 'alternate' ? 'Both ends of the Z are identical.' : 'Both bars of the F are identical.'}"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}：答案\n$x = ${answer}°$\n\n${angleType === 'co-interior' ? `两个角：$${givenAngle}°$ 和 $${answer}°$，加起来刚好 $180°$！` : `两个角都是 $${answer}°$，完全相等！`}\n攻城角度计算完毕，可以架梯了！`,
        en: `${narrator}: "Answer\n$x = ${answer}°$\n\n${angleType === 'co-interior' ? `The two angles: $${givenAngle}°$ and $${answer}°$, adding to exactly $180°$!` : `Both angles are $${answer}°$ — perfectly equal!`}\nSiege angle calculated — time to raise the ladder!"`,
      },
      highlightField: 'x',
    },
    {
      text: angleType === 'co-interior' ? {
        zh: `${narrator}：验算\n同旁内角之和 $= ${givenAngle}° + ${answer}° = ${givenAngle + answer}°$\n$${givenAngle + answer}° = 180°$ ✓\n\n两块拼图完美合拢！角度万无一失！`,
        en: `${narrator}: "Verify\nCo-interior sum $= ${givenAngle}° + ${answer}° = ${givenAngle + answer}°$\n$${givenAngle + answer}° = 180°$ ✓\n\nPuzzle pieces fit perfectly! Angle confirmed!"`,
      } : {
        zh: `${narrator}：验算\n${typeZh}应该相等：\n已知角 $= ${givenAngle}°$，$x = ${answer}°$\n$${givenAngle}° = ${answer}°$ ✓\n\n左右对称，一模一样！攻城没问题！`,
        en: `${narrator}: "Verify\n${typeEn} should be equal:\nGiven angle $= ${givenAngle}°$, $x = ${answer}°$\n$${givenAngle}° = ${answer}°$ ✓\n\nSymmetrical match! Siege angle confirmed!"`,
      },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { givenAngle, angleType, answer, parallel: true, highlight: angleType === 'co-interior' ? 'cointerior' : angleType, total: angleType === 'co-interior' ? 180 : undefined, angle: givenAngle, generatorType: 'PARALLEL_ANGLES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   SYMMETRY generator: reflection or 180° rotation
   Modes: 'reflect_x' (reflect over x-axis), 'reflect_y' (reflect over y-axis), 'rotate_180' (rotate 180° about origin)
   ══════════════════════════════════════════════════════════ */

export function generateAreaRectMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const lengthPools = { 1: [5, 8, 10], 2: [8, 10, 15, 20, 25, 30, 35, 40], 3: [20, 35, 50, 80] };
  const widthPools = { 1: [3, 5, 7], 2: [5, 8, 10, 15, 20, 25, 30], 3: [15, 25, 40, 60] };
  const length = tier === 2 ? randInt(8, 40) : pickRandom(lengthPools[tier]);
  const width = tier === 2 ? randInt(5, 30) : pickRandom(widthPools[tier]);
  const narrator = pickRandom(['刘备', '曹操', '孙权']);

  const description: BilingualText = {
    zh: `计算营地面积：长 $${length}$，宽 $${width}$。`,
    en: `Calculate camp area: length $${length}$, width $${width}$.`,
  };

  const area = length * width;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要算面积？\n扎营之前总得知道这块地有多大吧？帐篷能搭几个？练兵场够不够用？\n面积就是告诉你——这块地到底有多少"空间"。\n\n你可以想象：在地上铺满 $1 \\times 1$ 的小方块，数一数一共铺了多少块。`,
        en: `${narrator}: "Why calculate area?\nBefore setting up camp, you need to know how big the ground is, right? How many tents fit? Is the drill yard big enough?\nArea tells you — exactly how much 'space' this plot has.\n\nImagine covering the ground with $1 \\times 1$ tiles and counting them all."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：长方形面积的算法超简单\n不用真的一块块数小方块——直接用：\n$$\\text{面积} = \\text{长} \\times \\text{宽}$$\n\n为什么？因为长告诉你一排能放几块，宽告诉你有几排。一乘就得到总数！`,
        en: `${narrator}: "The rectangle area formula is super simple\nNo need to actually count tiles — just use:\n$$\\text{Area} = \\text{length} \\times \\text{width}$$\n\nWhy? Length tells you how many fit in one row, width tells you how many rows. Multiply and you get the total!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：从题目找出长和宽\n长 = $${length}$，宽 = $${width}$\n\n代进去：面积 $= ${length} \\times ${width}$`,
        en: `${narrator}: "Find the length and width from the problem\nLength = $${length}$, width = $${width}$\n\nPlug in: Area $= ${length} \\times ${width}$"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：算一下\n$${length} \\times ${width} = ${area}$\n\n就是这么简单——一步乘法就搞定了！`,
        en: `${narrator}: "Calculate\n$${length} \\times ${width} = ${area}$\n\nThat simple — one multiplication and you're done!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案\n面积 = $${area}$ 平方单位\n\n这块地能铺 ${area} 个小方块那么大！`,
        en: `${narrator}: "Answer\nArea = $${area}$ square units\n\nThis plot is as big as ${area} little tiles!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：验算\n面积 $${area}$ 肯定比长 $${length}$ 和宽 $${width}$ 都大？✓ 对的\n反算：$${area} \\div ${length} = ${width}$ ✓ 刚好等于宽\n\n营地面积确认无误，可以开始搭帐篷了！`,
        en: `${narrator}: "Verify\nArea $${area}$ is definitely bigger than both length $${length}$ and width $${width}$? ✓ Yes\nReverse: $${area} \\div ${length} = ${width}$ ✓ Exactly the width\n\nCamp area confirmed — start pitching tents!"`,
      },
      highlightField: 'area',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, length, width, generatorType: 'AREA_RECT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   AREA (trapezoid) generator
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateAreaTrapMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const aPools = { 1: [3, 5, 8], 2: null, 3: [10, 15, 20] };
  const bOffsets = { 1: [2, 5], 2: null, 3: [5, 15] };
  const hPools = { 1: [3, 5, 7], 2: null, 3: [8, 12, 18] };
  let a = tier === 2 ? randInt(5, 15) : pickRandom(aPools[tier]!);
  let b = tier === 2 ? randInt(a + 2, a + 10) : a + pickRandom(bOffsets[tier]!);
  let h = tier === 2 ? randInt(4, 12) : pickRandom(hPools[tier]!);
  // Ensure (a+b)*h is even so area is integer
  if (((a + b) * h) % 2 !== 0) h += 1;
  const narrator = pickRandom(['赵云', '关羽']);

  const description: BilingualText = {
    zh: `计算梯形阵地面积：上底 $${a}$，下底 $${b}$，高 $${h}$。`,
    en: `Calculate trapezoid area: top $${a}$, base $${b}$, height $${h}$.`,
  };

  const sumAB = a + b;
  const areaVal = (a + b) * h / 2;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学梯形面积？\n城墙上有很多不规则的区域——不是正方形，不是长方形，而是一边长一边短的奇怪形状。\n那就是梯形！上面窄（上底），下面宽（下底），像个"倒着的梯子"。\n\n学会算梯形面积，就能搞定很多现实中不规则的地块！`,
        en: `${narrator}: "Why learn trapezoid area?\nCity walls have many irregular sections — not square, not rectangular, but with one side longer than the other.\nThat's a trapezoid! Narrow on top, wide at the bottom, like an upside-down step.\n\nLearn trapezoid area, and you can handle all sorts of irregular plots in real life!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：梯形面积的公式——为什么除以 2？\n$$\\text{面积} = \\frac{(\\text{上底} + \\text{下底}) \\times \\text{高}}{2}$$\n\n把两个一模一样的梯形"拼"在一起，刚好变成一个平行四边形！\n平行四边形面积 = (上底+下底) × 高，梯形只占一半，所以除以 2。\n这个小窍门记住了，梯形面积就不会错！`,
        en: `${narrator}: "The trapezoid formula — why divide by 2?\n$$\\text{Area} = \\frac{(\\text{top} + \\text{bottom}) \\times \\text{height}}{2}$$\n\nFlip and join two identical trapezoids — they form a parallelogram!\nParallelogram area = (top + bottom) × height, trapezoid is half, so divide by 2.\nRemember this trick and you'll never get it wrong!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：从题目中找出三个数\n上底 $a = ${a}$，下底 $b = ${b}$，高 $h = ${h}$\n\n三个数都找到了——就像找齐三味药材，接下来就是"炼丹"了！`,
        en: `${narrator}: "Find the three numbers from the problem\nTop $a = ${a}$, bottom $b = ${b}$, height $h = ${h}$\n\nAll three found — like gathering three ingredients, now it's time to 'brew the potion'!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：第一步——上底加下底\n$${a} + ${b} = ${sumAB}$\n\n把两条平行边加起来——就像量两条城墙合起来有多长。这是为下一步做准备！`,
        en: `${narrator}: "Step 1 — add top + bottom\n$${a} + ${b} = ${sumAB}$\n\nAdd the two parallel sides — like measuring two walls combined. This prepares for the next step!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：第二步——乘以高，再除以 2\n$\\frac{${sumAB} \\times ${h}}{2} = \\frac{${sumAB * h}}{2} = ${areaVal}$\n\n乘高得出平行四边形的面积，除以 2 就是梯形的面积。两步搞定！`,
        en: `${narrator}: "Step 2 — multiply by height, then halve\n$\\frac{${sumAB} \\times ${h}}{2} = \\frac{${sumAB * h}}{2} = ${areaVal}$\n\nMultiply by height for the parallelogram area, halve it for the trapezoid. Two steps done!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案\n面积 = $${areaVal}$\n\n验算：面积应该比 $${a} \\times ${h} = ${a * h}$（小长方形）大，\n比 $${b} \\times ${h} = ${b * h}$（大长方形）小。\n$${a * h} < ${areaVal} < ${b * h}$ ✓ 夹在中间，完美合理！做得漂亮！`,
        en: `${narrator}: "Answer\nArea = $${areaVal}$\n\nVerify: area should be bigger than $${a} \\times ${h} = ${a * h}$ (small rectangle),\nand smaller than $${b} \\times ${h} = ${b * h}$ (big rectangle).\n$${a * h} < ${areaVal} < ${b * h}$ ✓ Sandwiched perfectly! Brilliantly done!"`,
      },
      highlightField: 'area',
    },
  ];

  return {
    ...template,
    description,
    data: { ...template.data, a, b, h, generatorType: 'AREA_TRAP_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PROBABILITY (simple) generator: P = target/total
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   ══════════════════════════════════════════════════════════ */

export function generateAreaTriangleMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const bPools: Record<DifficultyTier, number[]> = { 1: [4, 6, 8, 10], 2: [6, 8, 10, 12, 14, 16, 20], 3: [10, 12, 15, 18, 20, 24, 30] };
  const hPools: Record<DifficultyTier, number[]> = { 1: [3, 4, 5, 6], 2: [4, 5, 6, 7, 8, 10], 3: [6, 8, 9, 10, 12, 15] };
  const base = pickRandom(bPools[tier]);
  const height = pickRandom(hPools[tier]);
  const answer = base * height / 2;
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '诸葛亮';

  const description: BilingualText = {
    zh: `三角形底 $${base}$，高 $${height}$，求面积。`,
    en: `Triangle with base $${base}$ and height $${height}$. Find the area.`,
  };

  const rectArea = base * height;
  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要学三角形面积？\n裁制三角军旗——先搞懂"底"和"高"。\n\n底（base）= 三角形最下面的边。\n高（height）= 从底边到对面顶点的**垂直**距离——不是斜边！\n\n底 = $${base}$，高 = $${height}$。`,
        en: `${narrator}: "Why learn triangle area?\nMaking a triangular banner — first understand 'base' and 'height'.\n\nBase = the bottom edge of the triangle.\nHeight = the PERPENDICULAR distance from base to opposite corner — not the slanted side!\n\nBase = $${base}$, Height = $${height}$."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：为什么三角形面积要除以 2？\n想象做两面一模一样的三角旗，把第二面翻转拼上——变成一个长方形！\n\n长方形面积 = $${base} \\times ${height} = ${rectArea}$\n三角旗 = 长方形的一半 → 面积 = $${rectArea} \\div 2$！`,
        en: `${narrator}: "Why divide by 2 for triangle area?\nImagine two identical triangular banners — flip one and join them. You get a rectangle!\n\nRectangle area = $${base} \\times ${height} = ${rectArea}$\nTriangle = half the rectangle → area = $${rectArea} \\div 2$!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：第一步——底 × 高\n$${base} \\times ${height} = ${rectArea}$\n\n这是"完整长方形"的面积——三角形只要一半。`,
        en: `${narrator}: "Step 1 — base × height\n$${base} \\times ${height} = ${rectArea}$\n\nThis is the 'full rectangle' area — the triangle needs just half."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：第二步——除以 2\n$${rectArea} \\div 2 = ${answer}$\n\n三角形面积就是长方形面积的一半——就这么简单！`,
        en: `${narrator}: "Step 2 — divide by 2\n$${rectArea} \\div 2 = ${answer}$\n\nTriangle area is half the rectangle — that simple!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案\n三角形面积 $= \\frac{1}{2} \\times ${base} \\times ${height} = ${answer}$ 平方单位\n\n三角军旗裁好了！`,
        en: `${narrator}: "Answer\nTriangle area $= \\frac{1}{2} \\times ${base} \\times ${height} = ${answer}$ square units\n\nBanner cut and ready!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：验算——三角形是长方形的一半吗？\n三角形 $= ${answer}$，长方形 $= ${rectArea}$\n$${answer} \\times 2 = ${rectArea}$ ✓ 确实是一半！\n\n三角军旗面积 $= ${answer}$ 平方单位，做得漂亮！`,
        en: `${narrator}: "Verify — is the triangle half the rectangle?\nTriangle $= ${answer}$, Rectangle $= ${rectArea}$\n$${answer} \\times 2 = ${rectArea}$ ✓ Indeed half!\n\nBanner area $= ${answer}$ square units — brilliantly done!"`,
      },
      highlightField: 'area',
    },
  ];

  return {
    ...template,
    description,
    data: { base, height, answer, generatorType: 'AREA_TRIANGLE_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FACTORS_LIST generator: list all factors of a number
   ══════════════════════════════════════════════════════════ */

export function generatePerimeterRectMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const lPools: Record<DifficultyTier, number[]> = { 1: [3, 4, 5, 6, 7, 8, 10], 2: [5, 8, 10, 12, 15, 18, 20], 3: [10, 15, 20, 25, 30, 35, 40, 50] };
  const wPools: Record<DifficultyTier, number[]> = { 1: [2, 3, 4, 5, 6], 2: [3, 5, 7, 8, 10, 12, 15], 3: [8, 10, 15, 20, 25, 30] };
  const length = pickRandom(lPools[tier]);
  const width = pickRandom(wPools[tier]);
  const answer = 2 * (length + width);
  const narrator = (template.tutorialSteps?.[0]?.text?.zh?.split(/[:\uff1a]/)?.[0]) || '刘备';

  const description: BilingualText = {
    zh: `长方形营地：长 $${length}$，宽 $${width}$，求周长。`,
    en: `Rectangle camp: length $${length}$, width $${width}$. Find the perimeter.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要算周长？\n扎营第一步——围栏围起来！但围栏总共要多长？\n\n周长就是沿着图形的边走一整圈的总距离。\n想象一只蚂蚁沿着营地围墙走一圈，它走过的路 = 周长。`,
        en: `${narrator}: "Why calculate perimeter?\nFirst step in setting camp — put up the fence! But how much fencing do we need?\n\nPerimeter is the total distance walking around the edge of a shape.\nImagine an ant walking along the camp fence — distance walked = perimeter."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：长方形有 4 条边\n• 上边 = $${length}$\n• 下边 = $${length}$（和上边一样长）\n• 左边 = $${width}$\n• 右边 = $${width}$（和左边一样长）\n\n对面的边总是相等的——这就是长方形的特点！`,
        en: `${narrator}: "A rectangle has 4 sides\n• Top = $${length}$\n• Bottom = $${length}$ (same as top)\n• Left = $${width}$\n• Right = $${width}$ (same as left)\n\nOpposite sides are always equal — that's what makes it a rectangle!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：笨办法——把 4 条边全加起来\n$${length} + ${width} + ${length} + ${width}$\n$= ${length + width} + ${length + width}$\n$= ${answer}$\n\n这就是周长！虽然笨，但绝对不会错。`,
        en: `${narrator}: "Simple way — add all 4 sides\n$${length} + ${width} + ${length} + ${width}$\n$= ${length + width} + ${length + width}$\n$= ${answer}$\n\nThat's the perimeter! Simple but foolproof."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：快捷公式——因为有两对相同的边\n先把一条长和一条宽加起来：$${length} + ${width} = ${length + width}$\n然后乘以 2（因为有两对）：$2 \\times ${length + width} = ${answer}$\n\n这就是公式 $P = 2(l + w)$ 的含义！记住这个就够了。`,
        en: `${narrator}: "Shortcut — two pairs of equal sides\nAdd one length and one width: $${length} + ${width} = ${length + width}$\nMultiply by 2 (two pairs): $2 \\times ${length + width} = ${answer}$\n\nThat's what $P = 2(l + w)$ means! Remember this and you're set."`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：答案\n周长 $P = ${answer}$\n\n营地的围栅需要 $${answer}$ 单位长！`,
        en: `${narrator}: "Answer\nPerimeter $P = ${answer}$\n\nThe camp fence needs $${answer}$ units of fencing!"`,
      },
      highlightField: 'ans',
    },
    {
      text: {
        zh: `${narrator}：验算——两种方法互相检查\n笨办法：$${length} + ${width} + ${length} + ${width} = ${answer}$ ✓\n公式法：$2 \\times (${length} + ${width}) = ${answer}$ ✓\n\n两种方法答案一样——围栅准备好了，做得漂亮！`,
        en: `${narrator}: "Verify — cross-check with both methods\nSimple: $${length} + ${width} + ${length} + ${width} = ${answer}$ ✓\nFormula: $2 \\times (${length} + ${width}) = ${answer}$ ✓\n\nBoth methods match — fencing ready, brilliantly done!"`,
      },
      highlightField: 'ans',
    },
  ];

  return {
    ...template,
    description,
    data: { length, width, answer, generatorType: 'PERIMETER_RECT_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   PERCENTAGE_OF generator: "what is p% of n?"
   ══════════════════════════════════════════════════════════ */

const PYTHAGOREAN_TRIPLES: [number, number, number][] = [
  [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
  [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41],
];
const PYTHAGOREAN_TRIPLES_EXTRA: [number, number, number][] = [
  [20, 21, 29], [11, 60, 61],
];

export function generatePythagorasMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const triplePools = {
    1: PYTHAGOREAN_TRIPLES.slice(0, 3),
    2: PYTHAGOREAN_TRIPLES,
    3: [...PYTHAGOREAN_TRIPLES, ...PYTHAGOREAN_TRIPLES_EXTRA],
  };
  const [triA, triB, triC] = pickRandom(triplePools[tier]);
  // Template data determines mode: if template has 'c' key, it's find-leg; if 'b' key, find-hypotenuse
  const findC = !('c' in (template.data || {}));
  const narrator = pickRandom(['关羽', '赵云']);

  let description: BilingualText;
  let data: Record<string, unknown>;

  if (findC) {
    description = {
      zh: `求云梯长度 $c = \\sqrt{${triA}^2 + ${triB}^2}$。`,
      en: `Find ladder length $c = \\sqrt{${triA}^2 + ${triB}^2}$.`,
    };
    // Clean slate — don't spread template.data to avoid c leaking from template
    data = { a: triA, b: triB, generatorType: 'PYTHAGORAS_RANDOM' };
  } else {
    description = {
      zh: `求地道深度 $a = \\sqrt{${triC}^2 - ${triB}^2}$。`,
      en: `Find depth $a = \\sqrt{${triC}^2 - ${triB}^2}$.`,
    };
    // Clean slate — only include fields checkCorrectness needs
    data = { a: triB, c: triC, generatorType: 'PYTHAGORAS_RANDOM' };
  }

  const ans = findC ? triC : triA;
  const tutorialSteps = findC ? [
    { text: { zh: `${narrator}：为什么需要勾股定理？\n攻城要架云梯——城墙高 $${triA}$，梯子底部离城墙 $${triB}$。\n梯子要多长才够得到？不能太短（够不到），也不能带太长的（搬不动）。\n勾股定理就是专门算这种"直角三角形"问题的！`, en: `${narrator}: "Why do we need the Pythagorean theorem?\nTo siege a wall, you need a ladder — wall height $${triA}$, ladder base $${triB}$ from wall.\nHow long must the ladder be? Not too short (can't reach), not too long (can't carry).\nThe Pythagorean theorem is made for this kind of right-angle problem!"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：勾股定理说的是什么？\n在有一个直角的三角形里，两条短边的平方加起来 = 最长边的平方。\n写成公式：$a^{2} + b^{2} = c^{2}$\n\n$a$、$b$ 是两条短边（直角旁边的），$c$ 是最长边（对面的斜边）。`, en: `${narrator}: "What does the theorem say?\nIn a triangle with a right angle, the two short sides squared add up to the longest side squared.\nAs a formula: $a^{2} + b^{2} = c^{2}$\n\n$a$, $b$ are the two short sides (next to the right angle), $c$ is the longest (the hypotenuse)."` }, highlightField: 'c' },
    { text: { zh: `${narrator}：从题目里找数字\n$a = ${triA}$（城墙高度），$b = ${triB}$（离墙距离）\n要求的是 $c$（云梯长度）\n\n信息齐了，开始算！`, en: `${narrator}: "Find the numbers from the problem\n$a = ${triA}$ (wall height), $b = ${triB}$ (distance from wall)\nWe need $c$ (ladder length)\n\nAll info ready — let's calculate!"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：先算平方\n$${triA}^{2} = ${triA} \\times ${triA} = ${triA * triA}$\n$${triB}^{2} = ${triB} \\times ${triB} = ${triB * triB}$\n\n加起来：$${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$\n\n所以 $c^{2} = ${triA * triA + triB * triB}$`, en: `${narrator}: "First, calculate the squares\n$${triA}^{2} = ${triA} \\times ${triA} = ${triA * triA}$\n$${triB}^{2} = ${triB} \\times ${triB} = ${triB * triB}$\n\nAdd them: $${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$\n\nSo $c^{2} = ${triA * triA + triB * triB}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：开平方根——"反向操作"\n$c^{2} = ${triA * triA + triB * triB}$，什么数乘以自己等于 ${triA * triA + triB * triB}？\n$c = \\sqrt{${triA * triA + triB * triB}} = ${triC}$\n\n云梯长度 = $${triC}$！`, en: `${narrator}: "Take the square root — the 'reverse operation'\n$c^{2} = ${triA * triA + triB * triB}$, what number times itself equals ${triA * triA + triB * triB}?\n$c = \\sqrt{${triA * triA + triB * triB}} = ${triC}$\n\nLadder length = $${triC}$!"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：答案 $c = ${triC}$\n\n验算：$${triA}^{2} + ${triB}^{2} = ${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$\n$${triC}^{2} = ${triC * triC}$ ✓ 完全吻合！\n\n云梯准备好了，攻城吧！`, en: `${narrator}: "Answer: $c = ${triC}$\n\nVerify: $${triA}^{2} + ${triB}^{2} = ${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$\n$${triC}^{2} = ${triC * triC}$ ✓ Perfect match!\n\nLadder ready — charge the walls!"` }, highlightField: 'c' },
  ] : [
    { text: { zh: `${narrator}：为什么需要勾股定理？\n挖地道攻城！地面距离知道是 $${triB}$，斜着的隧道长 $${triC}$。\n但地道要挖多深？这就需要勾股定理来算。`, en: `${narrator}: "Why do we need the Pythagorean theorem?\nDigging a tunnel to breach the wall! Ground distance is $${triB}$, tunnel length $${triC}$.\nBut how deep must we dig? The Pythagorean theorem will tell us."` }, highlightField: 'c' },
    { text: { zh: `${narrator}：勾股定理：$a^{2} + b^{2} = c^{2}$\n$c$ 是最长边（隧道），$a$ 和 $b$ 是两条短边。\n这次我们知道 $c$ 和一条短边，要求另一条。\n\n变一下形：$b^{2} = c^{2} - a^{2}$（把已知的移过去）`, en: `${narrator}: "Pythagorean theorem: $a^{2} + b^{2} = c^{2}$\n$c$ is the longest side (tunnel), $a$ and $b$ are the two shorter sides.\nThis time we know $c$ and one short side — find the other.\n\nRearrange: $b^{2} = c^{2} - a^{2}$ (move the known side across)"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：从题目找数字\n隧道长 $c = ${triC}$，地面距离 $a = ${triB}$\n求深度 $b = ?$\n\n代进去算！`, en: `${narrator}: "Find the numbers\nTunnel length $c = ${triC}$, ground distance $a = ${triB}$\nFind depth $b = ?$\n\nLet's substitute and calculate!"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：先算平方，再做减法\n$c^{2} = ${triC} \\times ${triC} = ${triC * triC}$\n$a^{2} = ${triB} \\times ${triB} = ${triB * triB}$\n$b^{2} = ${triC * triC} - ${triB * triB} = ${triC * triC - triB * triB}$`, en: `${narrator}: "Square first, then subtract\n$c^{2} = ${triC} \\times ${triC} = ${triC * triC}$\n$a^{2} = ${triB} \\times ${triB} = ${triB * triB}$\n$b^{2} = ${triC * triC} - ${triB * triB} = ${triC * triC - triB * triB}$"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：开平方根\n$b = \\sqrt{${triC * triC - triB * triB}} = ${triA}$\n\n地道深度 = $${triA}$！`, en: `${narrator}: "Take the square root\n$b = \\sqrt{${triC * triC - triB * triB}} = ${triA}$\n\nTunnel depth = $${triA}$!"` }, highlightField: 'c' },
    { text: { zh: `${narrator}：答案 $b = ${triA}$\n\n验算：$${triA}^{2} + ${triB}^{2} = ${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$\n$${triC}^{2} = ${triC * triC}$ ✓ 完美！\n\n地道挖通了，出其不意！`, en: `${narrator}: "Answer: $b = ${triA}$\n\nVerify: $${triA}^{2} + ${triB}^{2} = ${triA * triA} + ${triB * triB} = ${triA * triA + triB * triB}$\n$${triC}^{2} = ${triC * triC}$ ✓ Perfect!\n\nTunnel complete — surprise attack!"` }, highlightField: 'c' },
  ];

  return { ...template, description, data, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   PERCENTAGE generator: result = initial × (1+rate)^years
   Story is now a template on the mission — generator only updates data + description + tutorialSteps.
   Template data.rate sign determines mode: negative → discount, positive → tax.
   ══════════════════════════════════════════════════════════ */

export function generateTrigonometryMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const func = template.data?.func as string | undefined;
  const narrator = pickRandom(['甘宁', '乐进', '赵云']);

  if (func === 'sin') {
    // sin mode: opposite / sin(angle) = hypotenuse → input c
    const angle = pickRandom([30, 45, 60]);
    const sinVal = angle === 30 ? 0.5 : angle === 45 ? Math.SQRT2 / 2 : Math.sqrt(3) / 2;
    // Pick opposite so hyp is clean-ish
    const oppPoolsTier = {
      1: angle === 30 ? [3, 4, 5, 6] : [3, 4, 5, 6],
      2: angle === 30 ? [3, 4, 5, 6, 8, 10, 50] : [3, 4, 5, 6, 8, 10],
      3: [8, 10, 12, 15, 20],
    };
    const opposite = pickRandom(oppPoolsTier[tier]);
    const hyp = opposite / sinVal;

    const description: BilingualText = {
      zh: `已知角 $${angle}^\\circ$，对边 ${opposite}，求斜边 $c$。`,
      en: `Given angle $${angle}^\\circ$, opposite ${opposite}, find hypotenuse $c$.`,
    };
    const sinValRounded = Math.round(sinVal * 10000) / 10000;
    const hypRounded = Math.round(hyp * 10000) / 10000;
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学三角函数？\n想象你站在江边，对岸有敌营——你不能游过去量距离，但你知道自己的位置和角度。\n三角函数就是"不用走过去就能算出距离"的测量术！\n只要有一个角 + 一条边，就能推出所有边。`,
          en: `${narrator}: "Why learn trigonometry?\nImagine standing by a river — the enemy camp is across, but you can't swim over to measure.\nTrig lets you calculate distance without going there!\nJust one angle + one side, and you can figure out everything."`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：三角函数——直角三角形的万能工具\nSOH-CAH-TOA 口诀：\nSin = 对边/斜边，Cos = 邻边/斜边，Tan = 对边/邻边`,
          en: `${narrator}: "Trig functions — the ultimate tool for right triangles\nSOH-CAH-TOA:\nSin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：这里用 $\\sin$，因为已知对边 = ${opposite}，要求斜边 $c$`,
          en: `${narrator}: "We use $\\sin$ because we know the opposite = ${opposite} and need hypotenuse $c$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：写出等式：$\\sin(${angle}^\\circ) = \\frac{\\text{对边}}{\\text{斜边}} = \\frac{${opposite}}{c}$`,
          en: `${narrator}: "Write the equation: $\\sin(${angle}^\\circ) = \\frac{${opposite}}{c}$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：变形求 $c$：$c = \\frac{${opposite}}{\\sin(${angle}^\\circ)}$`,
          en: `${narrator}: "Rearrange for $c$: $c = \\frac{${opposite}}{\\sin(${angle}^\\circ)}$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：代入计算：$c = \\frac{${opposite}}{${sinValRounded}} = ${hypRounded}$`,
          en: `${narrator}: "Calculate: $c = \\frac{${opposite}}{${sinValRounded}} = ${hypRounded}$"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：所以斜边 $c = ${hypRounded}$!`,
          en: `${narrator}: "So the hypotenuse $c = ${hypRounded}$!"`,
        },
        highlightField: 'c',
      },
      {
        text: {
          zh: `${narrator}：代回检验：$\\sin(${angle}°) \\times ${hypRounded} = ${opposite}$ ✓`,
          en: `${narrator}: "Verify: $\\sin(${angle}°) \\times ${hypRounded} = ${opposite}$ ✓"`,
        },
        highlightField: 'c',
      },
    ];
    return { ...template, description, data: { angle, opposite, func: 'sin', generatorType: 'TRIGONOMETRY_RANDOM' }, tutorialSteps };
  }

  if (func === 'tan_inv') {
    // tan_inv mode: atan2(opposite, adjacent) → input angle
    const pairs: [number, number][] = [[1, 1], [3, 3], [5, 5], [10, 10], [30, 30], [100, 100],
      [1, Math.round(Math.tan(Math.PI / 6) * 1000) / 1000 > 0 ? 1 : 1], // fallback
    ];
    // Use known-angle combos for clean results
    // Checker uses Math.atan2(opp, adj) * 180/PI with tolerance 0.01
    // So angle = round(atan2(opp, adj) * 180/PI) — must match at display level
    const knownAngles: { opp: number; adj: number; angle: number }[] = [
      // 45° (tan = 1)
      { opp: 1, adj: 1, angle: 45 }, { opp: 5, adj: 5, angle: 45 }, { opp: 10, adj: 10, angle: 45 },
      // ~37° (3-4-5 triangle: atan(3/4) ≈ 36.87°)
      { opp: 3, adj: 4, angle: 36.87 }, { opp: 6, adj: 8, angle: 36.87 }, { opp: 9, adj: 12, angle: 36.87 },
      // ~53° (4-3: atan(4/3) ≈ 53.13°)
      { opp: 4, adj: 3, angle: 53.13 }, { opp: 8, adj: 6, angle: 53.13 }, { opp: 12, adj: 9, angle: 53.13 },
      // ~27° (atan(1/2) ≈ 26.57°)
      { opp: 1, adj: 2, angle: 26.57 }, { opp: 3, adj: 6, angle: 26.57 },
      // ~63° (atan(2/1) ≈ 63.43°)
      { opp: 2, adj: 1, angle: 63.43 }, { opp: 6, adj: 3, angle: 63.43 },
    ];
    const chosen = pickRandom(knownAngles);

    const description: BilingualText = {
      zh: `已知对边 ${chosen.opp}，邻边 ${chosen.adj}，求角度 $\\theta$。`,
      en: `Given opposite ${chosen.opp}, adjacent ${chosen.adj}, find angle $\\theta$.`,
    };
    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学反三角函数？\n上一关我们用角度求边长。现在反过来——知道两条边，求角度！\n想象你看到敌军的瞭望塔，知道塔高和距离，就能算出仰望角度——这就是反三角函数！`,
          en: `${narrator}: "Why learn inverse trig?\nLast time we found sides from angles. Now reverse — given two sides, find the angle!\nImagine seeing an enemy tower — knowing its height and your distance, calculate the viewing angle — that's inverse trig!"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：三角函数——直角三角形的万能工具\nSOH-CAH-TOA 口诀：\nSin = 对边/斜边，Cos = 邻边/斜边，Tan = 对边/邻边`,
          en: `${narrator}: "Trig functions — the ultimate tool for right triangles\nSOH-CAH-TOA:\nSin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：已知对边和邻边，可以用 $\\tan$ 来求角度`,
          en: `${narrator}: "Given opposite and adjacent sides, we can use $\\tan$ to find the angle"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：$\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${chosen.opp}}{${chosen.adj}}$`,
          en: `${narrator}: "$\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{${chosen.opp}}{${chosen.adj}}$"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：用反正切(arctan)求角度：$\\theta = \\tan^{-1}\\left(\\frac{${chosen.opp}}{${chosen.adj}}\\right) = \\tan^{-1}(${chosen.opp / chosen.adj})$`,
          en: `${narrator}: "Use inverse tan (arctan) to find the angle: $\\theta = \\tan^{-1}\\left(\\frac{${chosen.opp}}{${chosen.adj}}\\right) = \\tan^{-1}(${chosen.opp / chosen.adj})$"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：答案\n$\\theta = ${chosen.angle}^\\circ$`,
          en: `${narrator}: "Answer\n$\\theta = ${chosen.angle}^\\circ$"`,
        },
        highlightField: 'angle',
      },
      {
        text: {
          zh: `${narrator}：验算\n$\\tan(${chosen.angle}^\\circ) \\approx \\frac{${chosen.opp}}{${chosen.adj}} = ${Math.round(chosen.opp / chosen.adj * 1000) / 1000}$ ✓\n反正切还原了比值，角度确认！`,
          en: `${narrator}: "Verify\n$\\tan(${chosen.angle}^\\circ) \\approx \\frac{${chosen.opp}}{${chosen.adj}} = ${Math.round(chosen.opp / chosen.adj * 1000) / 1000}$ ✓\nInverse tan recovers the ratio — angle confirmed!"`,
        },
        highlightField: 'angle',
      },
    ];
    return { ...template, description, data: { opposite: chosen.opp, adjacent: chosen.adj, func: 'tan_inv', generatorType: 'TRIGONOMETRY_RANDOM' }, tutorialSteps };
  }

  // Default: tan mode — opposite / adjacent → input tan
  const tanOppPools = { 1: [3, 4, 5, 6], 2: [3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20], 3: [8, 10, 12, 15, 20] };
  const tanAdjPools = { 1: [4, 5, 8, 10], 2: [4, 5, 8, 10, 12, 15, 16, 20, 25], 3: [5, 8, 10, 12, 15, 20, 25] };
  const opposite = pickRandom(tanOppPools[tier]);
  const adjacent = pickRandom(tanAdjPools[tier]);
  const tanVal = opposite / adjacent;

  const description: BilingualText = {
    zh: `求正切值 $\\tan(\\theta) = ${opposite} / ${adjacent}$。`,
    en: `Find $\\tan(\\theta) = ${opposite} / ${adjacent}$.`,
  };
  const tanRounded = Math.round(tanVal * 10000) / 10000;
  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学三角函数？\n直角三角形在现实中无处不在：测量城墙高度、计算箭的射程、判断敌营距离……\n三角函数就是用"边的比值"来描述角度，是军事测量的核心工具！`, en: `${narrator}: "Why learn trigonometry?\nRight triangles are everywhere: measuring wall heights, calculating arrow range, judging enemy distance...\nTrig functions use 'side ratios' to describe angles — the core tool of military surveying!"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：SOH-CAH-TOA 口诀\nSin = 对边/斜边\nCos = 邻边/斜边\n**Tan = 对边/邻边**\n\n这道题已知对边和邻边，所以用 $\\tan$！`, en: `${narrator}: "SOH-CAH-TOA\nSin = Opposite/Hypotenuse\nCos = Adjacent/Hypotenuse\n**Tan = Opposite/Adjacent**\n\nWe know opposite and adjacent, so use $\\tan$!"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：写出公式\n$\\tan(\\theta) = \\frac{\\text{对边}}{\\text{邻边}}$\n\n对边 = $${opposite}$，邻边 = $${adjacent}$`, en: `${narrator}: "Write the formula\n$\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}$\n\nOpposite = $${opposite}$, Adjacent = $${adjacent}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：代入数值\n$\\tan(\\theta) = \\frac{${opposite}}{${adjacent}}$\n\n这就是一道除法：$${opposite} \\div ${adjacent}$`, en: `${narrator}: "Substitute the values\n$\\tan(\\theta) = \\frac{${opposite}}{${adjacent}}$\n\nThis is simply: $${opposite} \\div ${adjacent}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：答案\n$\\tan(\\theta) = ${tanRounded}$\n\n$${opposite} \\div ${adjacent} = ${tanRounded}$`, en: `${narrator}: "Answer\n$\\tan(\\theta) = ${tanRounded}$\n\n$${opposite} \\div ${adjacent} = ${tanRounded}$"` }, highlightField: 'tan' },
    { text: { zh: `${narrator}：验算\n$\\tan(\\theta) \\times \\text{邻边} = \\text{对边}$\n$${tanRounded} \\times ${adjacent} = ${Math.round(tanRounded * adjacent * 100) / 100}$\n\n≈ $${opposite}$ ✓ 测量精准！`, en: `${narrator}: "Verify\n$\\tan(\\theta) \\times \\text{adjacent} = \\text{opposite}$\n$${tanRounded} \\times ${adjacent} = ${Math.round(tanRounded * adjacent * 100) / 100}$\n\n≈ $${opposite}$ ✓ Measurement confirmed!"` }, highlightField: 'tan' },
  ];
  return { ...template, description, data: { opposite, adjacent, generatorType: 'TRIGONOMETRY_RANDOM' }, tutorialSteps };
}

/* ══════════════════════════════════════════════════════════
   QUADRATIC generator: y = ax² + c from two points
   topic==='Calculus' → student finds x = p2[0] (vertex x)
   otherwise → student finds a and c
   ══════════════════════════════════════════════════════════ */

export function generateSimilarityMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const sidePools = {
    1: { a: [2, 3, 4, 6, 8, 12], b: [4, 6, 8, 12, 16, 24], c: [3, 4, 6, 8, 10, 12] },
    2: { a: [3, 4, 5, 6, 8, 10], b: [6, 8, 10, 12, 15, 20], c: [4, 5, 6, 7, 9, 12] },
    3: { a: [5, 8, 10, 15, 20, 25], b: [10, 16, 20, 30, 40, 50], c: [6, 8, 12, 15, 20, 25] },
  };
  const a = pickRandom(sidePools[tier].a);
  const b = pickRandom(sidePools[tier].b);
  const c = pickRandom(sidePools[tier].c);
  const correctX = (a / b) * c;

  // Ensure clean answer
  if (correctX !== Math.round(correctX * 100) / 100) return safeRetry(template, generateSimilarityMission, tier);

  const narrator = pickRandom(['关羽', '赵云']);
  const description: BilingualText = {
    zh: `相似三角形：边 ${a} 对应边 ${b}，边 ${c} 对应 $x$。`,
    en: `Similar triangles: side ${a} corresponds to ${b}, side ${c} corresponds to $x$.`,
  };

  const scaleFactor = a / b;
  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学相似？\n想象你站在山顶侦察敌军阵地——远处的帐篷和近处的帐篷形状一模一样，只是大小不同。\n如果你知道近处帐篷的尺寸和距离比例，就能算出远处帐篷的真实大小！\n不用冒险过去量——这就是"相似"的威力：形状相同、比例相同，大小可以不同。`, en: `${narrator}: "Why learn similarity?\nImagine standing on a hilltop scouting the enemy camp — the distant tents look exactly the same shape as the nearby ones, just smaller.\nIf you know the size of the nearby tent and the distance ratio, you can calculate the real size of the far-away tent!\nNo need to risk going over to measure — that's the power of similarity: same shape, same ratio, different size."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：求比例系数(scale factor)：\n$\\frac{${a}}{${b}} = ${scaleFactor}$`, en: `${narrator}: "Find the scale factor:\n$\\frac{${a}}{${b}} = ${scaleFactor}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：找出需要求的边：\n已知第二个三角形的对应边 = $${c}$\n我们要求 $x$。`, en: `${narrator}: "Identify which side we need:\nThe corresponding side in the second triangle = $${c}$\nWe need to find $x$."` }, highlightField: 'x' },
    { text: { zh: `${narrator}：计算：\n$x = ${c} \\times ${scaleFactor} = ${correctX}$`, en: `${narrator}: "Calculate:\n$x = ${c} \\times ${scaleFactor} = ${correctX}$"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：答案：$x = ${correctX}$!`, en: `${narrator}: "Answer: $x = ${correctX}$!"` }, highlightField: 'x' },
    { text: { zh: `${narrator}：验算\n检查比例：$\\frac{${a}}{${b}} = ${scaleFactor}$，$\\frac{${correctX}}{${c}} = ${correctX / c}$\n两个比例相等 ✓ 验证成功！`, en: `${narrator}: "Verify\nCheck ratios: $\\frac{${a}}{${b}} = ${scaleFactor}$, $\\frac{${correctX}}{${c}} = ${correctX / c}$\nBoth ratios are equal ✓ Verified!"` }, highlightField: 'x' },
  ];

  return {
    ...template,
    description,
    data: { a, b, c, generatorType: 'SIMILARITY_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   STATISTICS (mean) generator
   ══════════════════════════════════════════════════════════ */

export function generateCircleY8Mission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrators = ['鲁肃', '曹操', '刘备'];
  const narrator = pickRandom(narrators);

  const rPools: Record<number, number[]> = { 1: [3, 5, 7], 2: [4, 6, 8, 10], 3: [5, 9, 12, 14] };
  const r = pickRandom(rPools[tier]);
  const pi = 3.14;
  const modes = ['circumference', 'area'] as const;
  const mode = (template.data?.mode as typeof modes[number]) || pickRandom([...modes]);

  const circumference = parseFloat((2 * pi * r).toFixed(2));
  const area = parseFloat((pi * r * r).toFixed(2));

  let answer: number;
  let descZh: string;
  let descEn: string;

  if (mode === 'circumference') {
    answer = circumference;
    descZh = `半径 $${r}$ 的圆营地周长是多少？($\\pi = ${pi}$)`;
    descEn = `A circular camp with radius $${r}$. Find the circumference. ($\\pi = ${pi}$)`;
  } else {
    answer = area;
    descZh = `半径 $${r}$ 的圆营地面积是多少？($\\pi = ${pi}$)`;
    descEn = `A circular camp with radius $${r}$. Find the area. ($\\pi = ${pi}$)`;
  }

  const tutorialSteps = mode === 'circumference' ? [
    {
      text: {
        zh: `${narrator}：为什么要算周长？\n想象你要在圆形营地周围建一圈篱笆——需要多长的木材？\n这就是周长的用处！走一圈的距离就是周长。\n\n有个神奇的事：不管圆多大多小，周长除以直径永远约等于 $3.14$。\n这个神奇的比值就叫 $\\pi$（读"派"）——古人花了上千年才精确计算出来！`,
        en: `${narrator}: "Why calculate circumference?\nImagine building a fence around a circular camp — how much wood do you need?\nThat's what circumference is for! The distance around is the circumference.\n\nHere's something magical: no matter how big or small the circle, circumference ÷ diameter always ≈ $3.14$.\nThis magical ratio is called $\\pi$ ('pi') — it took ancient scholars thousands of years to calculate precisely!"`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：周长公式\n$C = 2 \\times \\pi \\times r$\n\n$r = ${r}$ 是半径（从圆心到边的距离），$\\pi \\approx ${pi}$。\n$2r$ 就是直径——想象穿过圆心的一条直线。\n所以也可以写成 $C = \\pi \\times d$（直径乘以 $\\pi$）。\n\n两种写法，一个意思——选你觉得方便的！`,
        en: `${narrator}: "Circumference formula\n$C = 2 \\times \\pi \\times r$\n\n$r = ${r}$ is the radius (centre to edge), $\\pi \\approx ${pi}$.\n$2r$ is the diameter — imagine a line straight through the centre.\nSo you can also write $C = \\pi \\times d$ (diameter times $\\pi$).\n\nTwo versions, same thing — pick whichever feels easier!"`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：第一步——算直径\n$2 \\times r = 2 \\times ${r} = ${2 * r}$\n\n直径就是两个半径拼起来——从这边到那边穿过圆心的长度。`,
        en: `${narrator}: "Step 1 — calculate the diameter\n$2 \\times r = 2 \\times ${r} = ${2 * r}$\n\nDiameter is two radii joined end to end — the full width through the centre."`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：第二步——直径乘以 $\\pi$\n$C = ${2 * r} \\times ${pi} = ${circumference}$\n\n直径知道了，乘以 $\\pi$ 就能"绕一圈"了！`,
        en: `${narrator}: "Step 2 — diameter times $\\pi$\n$C = ${2 * r} \\times ${pi} = ${circumference}$\n\nOnce you know the diameter, multiply by $\\pi$ to 'go all the way around'!"`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：答案\n周长 $C = ${circumference}$\n\n围这个营地一圈需要 $${circumference}$ 长的绳子！篱笆材料备好了！`,
        en: `${narrator}: "Answer\nCircumference $C = ${circumference}$\n\nYou need $${circumference}$ units of rope to go around the camp! Fence materials ready!"`,
      },
      highlightField: 'c',
    },
    {
      text: {
        zh: `${narrator}：验算——换个方法再算一遍\n用 $\\pi \\approx 3$ 快速估算：$3 \\times ${2 * r} = ${3 * 2 * r}$\n实际 $${circumference}$ 比 $${3 * 2 * r}$ 稍大（因为 $\\pi = ${pi} > 3$），合理 ✓\n\n绳子量准了！营地可以动工了，做得好！`,
        en: `${narrator}: "Verify — calculate a different way\nQuick estimate with $\\pi \\approx 3$: $3 \\times ${2 * r} = ${3 * 2 * r}$\nActual $${circumference}$ is slightly more than $${3 * 2 * r}$ (since $\\pi = ${pi} > 3$), makes sense ✓\n\nRope measured correctly! Construction can begin — well done!"`,
      },
      highlightField: 'c',
    },
  ] : [
    {
      text: {
        zh: `${narrator}：为什么要算圆的面积？\n营地是圆形的——你需要知道里面有多大空间，才能决定搭多少个帐篷！\n面积就是圆**里面**占了多大地方。\n\n长方形面积 = 长 × 宽，但圆没有"长"和"宽"。\n别担心，圆的公式其实也只要两步！`,
        en: `${narrator}: "Why calculate a circle's area?\nThe camp is circular — you need to know how much space is inside to decide how many tents fit!\nArea is how much ground the circle COVERS.\n\nRectangle area = length × width, but a circle has no straight sides.\nDon't worry — the circle formula only takes two steps!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：圆面积公式\n$$A = \\pi \\times r^2$$\n\n$r = ${r}$（半径），$r^2$ 就是 $r \\times r$（半径乘以自己）。\n再乘以 $\\pi \\approx ${pi}$。\n\n为什么是 $r^2$？因为面积是二维的——长度×长度=面积，所以半径要"自己乘自己"！`,
        en: `${narrator}: "Circle area formula\n$$A = \\pi \\times r^2$$\n\n$r = ${r}$ (radius), $r^2$ means $r \\times r$ (radius times itself).\nThen multiply by $\\pi \\approx ${pi}$.\n\nWhy $r^2$? Because area is 2D — length × length = area, so the radius 'multiplies itself'!"`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：第一步——算 $r^2$\n$r^2 = ${r} \\times ${r} = ${r * r}$\n\n半径乘以自己——就这么简单！你已经完成一半了。`,
        en: `${narrator}: "Step 1 — calculate $r^2$\n$r^2 = ${r} \\times ${r} = ${r * r}$\n\nRadius times itself — that simple! You're already halfway there."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：第二步——乘以 $\\pi$\n$A = ${pi} \\times ${r * r} = ${area}$\n\n$\\pi$ 就像一个"圆形调整系数"——它把正方形面积（$r^2$）变成圆形面积。`,
        en: `${narrator}: "Step 2 — multiply by $\\pi$\n$A = ${pi} \\times ${r * r} = ${area}$\n\n$\\pi$ is like a 'circle adjustment factor' — it converts the square area ($r^2$) into circular area."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：答案\n面积 $A = ${area}$\n\n这块圆形营地有 $${area}$ 平方单位的空间！帐篷可以安排了。`,
        en: `${narrator}: "Answer\nArea $A = ${area}$\n\nThis circular camp has $${area}$ square units of space! Time to set up tents."`,
      },
      highlightField: 'area',
    },
    {
      text: {
        zh: `${narrator}：验算\n用 $\\pi \\approx 3$ 快速估算：$3 \\times ${r * r} = ${3 * r * r}$\n实际 $${area}$ 比 $${3 * r * r}$ 稍大（因为 $\\pi = ${pi} > 3$），合理 ✓\n\n营地面积确认！做得好！`,
        en: `${narrator}: "Verify\nQuick estimate with $\\pi \\approx 3$: $3 \\times ${r * r} = ${3 * r * r}$\nActual $${area}$ is slightly more than $${3 * r * r}$ (since $\\pi = ${pi} > 3$), makes sense ✓\n\nCamp area confirmed! Well done!"`,
      },
      highlightField: 'area',
    },
  ];

  return {
    ...template,
    description: { zh: descZh, en: descEn },
    data: mode === 'circumference'
      ? { r, pi, mode: 'circumference', answer, generatorType: 'CIRCLE_Y8_RANDOM' }
      : { r, pi, mode: 'area', answer, generatorType: 'CIRCLE_Y8_RANDOM' },
    tutorialSteps,
  };
}

export function generateVolumeMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const mode = template.data?.mode as string | undefined;
  const isCone = mode === 'cone';
  const radiusPools = { 1: [2, 3, 4], 2: [2, 3, 4, 5, 6, 8, 10], 3: [6, 8, 10, 12] };
  const heightPools = { 1: [3, 5, 6], 2: [5, 6, 8, 10, 12, 15, 20], 3: [10, 15, 20, 25] };
  const radius = pickRandom(radiusPools[tier]);
  const height = pickRandom(heightPools[tier]);
  const pi = template.data?.pi || 3;
  const vol = isCone ? (1 / 3) * pi * radius * radius * height : pi * radius * radius * height;
  const narrator = pickRandom(['满宠', '曹操', '刘备']);

  const description: BilingualText = isCone
    ? { zh: `求圆锥体积：半径 $${radius}$，高 $${height}$（$\\pi=${pi}$）。`, en: `Find cone volume: radius $${radius}$, height $${height}$ ($\\pi=${pi}$).` }
    : { zh: `求圆柱体积：半径 $${radius}$，高 $${height}$（$\\pi=${pi}$）。`, en: `Find cylinder volume: radius $${radius}$, height $${height}$ ($\\pi=${pi}$).` };

  const baseArea = Math.round(pi * radius * radius * 100) / 100;
  const volRounded = Math.round(vol * 100) / 100;
  const rSquared = radius * radius;
  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学体积？\n${isCone ? '锥形建筑从烽火台到箭塔随处可见。' : '圆柱形容器从粮仓到水井无处不在。'}\n知道体积才能算出能装多少东西！\n\n体积 = 空间的大小。`, en: `${narrator}: "Why learn volume?\n${isCone ? 'Conical structures are everywhere — from beacons to arrow towers.' : 'Cylindrical containers are everywhere — from granaries to wells.'}\nKnowing volume tells us capacity!\n\nVolume = amount of space."` }, highlightField: 'v' },
    { text: { zh: `${narrator}：${isCone ? '锥体' : '圆柱'}体积公式\n${isCone ? '$$V = \\frac{1}{3} \\pi r^2 h$$\n锥体是同底同高圆柱的 $\\frac{1}{3}$——三个锥体拼成一个柱体！' : '$$V = \\pi r^2 h$$\n底面积 × 高 = 体积。想象一摞圆饼叠起来。'}`, en: `${narrator}: "${isCone ? 'Cone' : 'Cylinder'} volume formula\n${isCone ? '$$V = \\frac{1}{3} \\pi r^2 h$$\nA cone is $\\frac{1}{3}$ of the same cylinder — three cones make one cylinder!' : '$$V = \\pi r^2 h$$\nBase area × height = volume. Imagine stacking round pancakes.'}"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：代入数据\n$r = ${radius}$，$h = ${height}$，$\\pi = ${pi}$\n\n第 1 步：$r^2 = ${radius} \\times ${radius} = ${rSquared}$`, en: `${narrator}: "Substitute\n$r = ${radius}$, $h = ${height}$, $\\pi = ${pi}$\n\nStep 1: $r^2 = ${radius} \\times ${radius} = ${rSquared}$"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：第 2 步：底面积\n$\\pi r^2 = ${pi} \\times ${rSquared} = ${baseArea}$${isCone ? `\n\n第 3 步：乘以高再除以 3\n$\\frac{1}{3} \\times ${baseArea} \\times ${height}$` : `\n\n第 3 步：乘以高\n$${baseArea} \\times ${height}$`}`, en: `${narrator}: "Step 2: Base area\n$\\pi r^2 = ${pi} \\times ${rSquared} = ${baseArea}$${isCone ? `\n\nStep 3: Multiply by height and divide by 3\n$\\frac{1}{3} \\times ${baseArea} \\times ${height}$` : `\n\nStep 3: Multiply by height\n$${baseArea} \\times ${height}$`}"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：答案\n$V = ${volRounded}$\n${isCone ? '烽火台石料量确认！' : '容器容积确认！'}`, en: `${narrator}: "Answer\n$V = ${volRounded}$\n${isCone ? 'Beacon tower materials confirmed!' : 'Container capacity confirmed!'}"` }, highlightField: 'v' },
    { text: { zh: `${narrator}：验算\n${isCone ? '$V \\times 3 = ' + Math.round(volRounded * 3 * 100) / 100 + '$ 应等于同底同高圆柱体积 $\\pi r^2 h = ' + Math.round(baseArea * height * 100) / 100 + '$ ✓' : '$V \\div h = ' + baseArea + '$ 应等于底面积 $\\pi r^2$ ✓'}`, en: `${narrator}: "Verify\n${isCone ? '$V \\times 3 = ' + Math.round(volRounded * 3 * 100) / 100 + '$ should equal cylinder volume $\\pi r^2 h = ' + Math.round(baseArea * height * 100) / 100 + '$ ✓' : '$V \\div h = ' + baseArea + '$ should equal base area $\\pi r^2$ ✓'}"` }, highlightField: 'v' },
  ];

  return {
    ...template,
    description,
    data: { radius, height, pi, ...(isCone ? { mode: 'cone' } : {}), generatorType: 'VOLUME_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   FUNC_VAL generator
   If m defined: y = mx + b, input y
   Else: vertex t = -b/(2a), input t
   ══════════════════════════════════════════════════════════ */

export function generateVolumeY8Mission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrators = ['曹操', '荀彧', '袁绍'];
  const narrator = pickRandom(narrators);

  const rPools: Record<number, number[]> = { 1: [3, 5], 2: [4, 5, 6], 3: [5, 7, 8] };
  const hPools: Record<number, number[]> = { 1: [5, 10], 2: [6, 8, 10, 12], 3: [8, 10, 12, 15] };

  const radius = pickRandom(rPools[tier]);
  const height = pickRandom(hPools[tier]);
  const pi = 3.14;
  const baseArea = parseFloat((pi * radius * radius).toFixed(2));
  const volume = parseFloat((pi * radius * radius * height).toFixed(2));
  const answer = volume;

  const description = {
    zh: `圆柱形粮仓：半径 $${radius}$，高 $${height}$，体积 = ? ($\\pi = ${pi}$)`,
    en: `Cylindrical granary: radius $${radius}$, height $${height}$, volume = ? ($\\pi = ${pi}$)`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}：为什么要算粮仓的体积？\n行军打仗最重要的是什么？粮草！粮仓建多大，就决定能存多少粮食。\n\n粮仓长什么样？上下两个圆，中间直直的——这就是圆柱体。\n体积就是这个圆筒**能装多少粮食**。跟长方体思路一样：底面积 × 高！`,
        en: `${narrator}: "Why calculate the granary's volume?\nWhat's the most important thing in war? Food supplies! The granary's size determines how much grain it stores.\n\nWhat shape is a granary? Two circles top and bottom, straight in the middle — that's a cylinder.\nVolume is how much grain this tube can HOLD. Same as a box: base area × height!"`,
      },
      highlightField: 'v',
    },
    {
      text: {
        zh: `${narrator}：圆柱体积公式\n$$V = \\pi r^2 \\times h$$\n\n翻译成白话：先算圆底面积（$\\pi r^2$），再乘以高（$h$）。\n$r = ${radius}$（半径），$h = ${height}$（高），$\\pi \\approx ${pi}$\n\n跟圆面积公式很像对不对？只是多乘了一个高——从平面"长高"变立体了！`,
        en: `${narrator}: "Cylinder volume formula\n$$V = \\pi r^2 \\times h$$\n\nIn plain words: first calculate the circular base ($\\pi r^2$), then multiply by height ($h$).\n$r = ${radius}$ (radius), $h = ${height}$ (height), $\\pi \\approx ${pi}$\n\nLooks like the circle area formula, right? Just multiply by height — the flat circle 'grows tall' into 3D!"`,
      },
      highlightField: 'v',
    },
    {
      text: {
        zh: `${narrator}：第一步——算底面积\n$r^2 = ${radius} \\times ${radius} = ${radius * radius}$\n$\\pi r^2 = ${pi} \\times ${radius * radius} = ${baseArea}$\n\n这就是仓底一层能铺多少粮食——圆形那层地板的面积。`,
        en: `${narrator}: "Step 1 — calculate the base area\n$r^2 = ${radius} \\times ${radius} = ${radius * radius}$\n$\\pi r^2 = ${pi} \\times ${radius * radius} = ${baseArea}$\n\nThat's how much grain fits in one layer — the area of the circular floor."`,
      },
      highlightField: 'v',
    },
    {
      text: {
        zh: `${narrator}：第二步——底面积乘以高\n$V = ${baseArea} \\times ${height} = ${volume}$\n\n想象一层一层往上叠：底面 $${baseArea}$，叠了 $${height}$ 层，总共 $${volume}$！`,
        en: `${narrator}: "Step 2 — base area times height\n$V = ${baseArea} \\times ${height} = ${volume}$\n\nImagine stacking layers: each layer is $${baseArea}$, stacked $${height}$ high, total $${volume}$!"`,
      },
      highlightField: 'v',
    },
    {
      text: {
        zh: `${narrator}：答案\n体积 $V = ${volume}$\n\n这座粮仓能存 $${volume}$ 立方单位的粮食！够大军吃好一阵子了。`,
        en: `${narrator}: "Answer\nVolume $V = ${volume}$\n\nThis granary stores $${volume}$ cubic units of grain! Enough to feed the army for quite a while."`,
      },
      highlightField: 'v',
    },
    {
      text: {
        zh: `${narrator}：验算\n用 $\\pi \\approx 3$ 快速估算：$3 \\times ${radius * radius} \\times ${height} = ${3 * radius * radius * height}$\n实际 $${volume}$ 比估算 $${3 * radius * radius * height}$ 稍大（因为 $\\pi = ${pi} > 3$），合理 ✓\n\n粮草清点完毕！三军将士有饭吃了，做得漂亮！`,
        en: `${narrator}: "Verify\nQuick estimate with $\\pi \\approx 3$: $3 \\times ${radius * radius} \\times ${height} = ${3 * radius * radius * height}$\nActual $${volume}$ is slightly more than $${3 * radius * radius * height}$ (since $\\pi = ${pi} > 3$), makes sense ✓\n\nGrain count complete! The army is well-fed — brilliantly done!"`,
      },
      highlightField: 'v',
    },
  ];

  return {
    ...template,
    description,
    data: { radius, height, pi, answer, generatorType: 'VOLUME_Y8_RANDOM' },
    tutorialSteps,
  };
}

export function generateSectorMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const narrator = pickRandom(['诸葛亮', '马良', '姜维']);

  const rPools = { 1: [5, 10], 2: [6, 8, 10, 12], 3: [5, 8, 10, 14, 20] };
  const anglePools = { 1: [90, 180], 2: [60, 90, 120, 180], 3: [45, 60, 72, 90, 120, 150] };
  const r = pickRandom(rPools[tier]);
  const angle = pickRandom(anglePools[tier]);
  const pi = 3.14;

  const mode = (template.data?.mode as 'arc' | 'sector_area') || pickRandom(['arc', 'sector_area'] as const);

  let answer: number;
  let questionZh: string, questionEn: string;

  if (mode === 'arc') {
    answer = parseFloat(((angle / 360) * 2 * pi * r).toFixed(2));
    questionZh = `求弧长。`;
    questionEn = `Find the arc length.`;
  } else {
    answer = parseFloat(((angle / 360) * pi * r * r).toFixed(2));
    questionZh = `求扇形面积。`;
    questionEn = `Find the sector area.`;
  }

  const description: BilingualText = {
    zh: `半径 $r = ${r}$，圆心角 $${angle}°$，$\\pi = ${pi}$。${questionZh}`,
    en: `Radius $r = ${r}$, central angle $${angle}°$, $\\pi = ${pi}$. ${questionEn}`,
  };

  const fracStr = angle === 360 ? '1' : angle === 180 ? '\\frac{1}{2}' : angle === 90 ? '\\frac{1}{4}' : `\\frac{${angle}}{360}`;
  const formulaZh = mode === 'arc' ? `$l = \\frac{\\theta}{360} \\times 2\\pi r$` : `$A = \\frac{\\theta}{360} \\times \\pi r^2$`;

  const tutorialSteps = [
    { text: { zh: `${narrator}：为什么要学扇形？\n想象一块圆形的军营地盘——将军只分到其中一个扇形区域。\n圆心角决定了你分到多大一块。学会扇形面积和弧长，就知道自己到底分到了多少地盘！`, en: `${narrator}: "Why learn about sectors?\nImagine a circular military camp — the general only gets one sector of the land.\nThe central angle determines how big your share is. Learn sector area and arc length to know exactly how much territory you've been given!"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：核心思路\n扇形就是"圆的一部分"，占整个圆的 $\\frac{\\theta}{360}$。\n所以${mode === 'arc' ? '弧长' : '扇形面积'} = $\\frac{\\theta}{360}$ × ${mode === 'arc' ? '整个圆周长' : '整个圆面积'}。\n\n公式：${formulaZh}`, en: `${narrator}: "Core idea\nA sector is 'part of a circle', taking up $\\frac{\\theta}{360}$ of the whole.\nSo ${mode === 'arc' ? 'arc length' : 'sector area'} = $\\frac{\\theta}{360}$ × ${mode === 'arc' ? 'full circumference' : 'full area'}.\n\nFormula: ${formulaZh}"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：代入数据\n$\\theta = ${angle}°$，$r = ${r}$，$\\pi = ${pi}$\n分数部分：$\\frac{${angle}}{360} = ${fracStr}$`, en: `${narrator}: "Substitute\n$\\theta = ${angle}°$, $r = ${r}$, $\\pi = ${pi}$\nFraction: $\\frac{${angle}}{360} = ${fracStr}$"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：计算\n先算${mode === 'arc' ? '整圆周长 $2\\pi r$' : '整圆面积 $\\pi r^2$'}，\n再乘以 $\\frac{${angle}}{360}$。`, en: `${narrator}: "Calculate\nFirst find ${mode === 'arc' ? 'full circumference $2\\pi r$' : 'full area $\\pi r^2$'},\nthen multiply by $\\frac{${angle}}{360}$."` }, highlightField: 'area' },
    { text: { zh: `${narrator}：答案\n${mode === 'arc' ? '弧长' : '扇形面积'} = $${answer}$`, en: `${narrator}: "Answer\n${mode === 'arc' ? 'Arc length' : 'Sector area'} = $${answer}$"` }, highlightField: 'area' },
    { text: { zh: `${narrator}：验算\n$${answer} \\times \\frac{360}{${angle}}$ 应该等于${mode === 'arc' ? '整圆周长' : '整圆面积'} ✓`, en: `${narrator}: "Verify\n$${answer} \\times \\frac{360}{${angle}}$ should equal ${mode === 'arc' ? 'full circumference' : 'full area'} ✓"` }, highlightField: 'area' },
  ];

  return {
    ...template,
    description,
    data: { r, pi, angle, mode: mode === 'arc' ? 'circumference' : 'area', answer, generatorType: 'SECTOR_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   CIRCLE THEOREM generator (Y10)
   Theorem A: angle in semicircle = 90°
   Theorem B: angle at centre = 2 × angle at circumference
   ══════════════════════════════════════════════════════════ */

export function generateCircleTheoremMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const theoremType = (template.data?.theoremType as 'semicircle' | 'center_double') || pickRandom(['semicircle', 'center_double'] as const);
  const narrator = pickRandom(['周瑜', '诸葛亮']);

  if (theoremType === 'semicircle') {
    // Given one non-right angle, find the other in a semicircle triangle
    const knownRanges: Record<number, [number, number]> = { 1: [20, 60], 2: [15, 70], 3: [10, 78] };
    const [lo, hi] = knownRanges[tier];
    const knownAngle = randInt(lo, hi);
    const answer = 90 - knownAngle;

    const description: BilingualText = {
      zh: `AB 是直径，C 在圆上。$\\angle ABC = ${knownAngle}°$，求 $\\angle BAC$。`,
      en: `AB is a diameter, C is on the circle. $\\angle ABC = ${knownAngle}°$, find $\\angle BAC$.`,
    };

    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么要学圆中角度？\n赤壁之战，周瑜从岸上观察曹军船阵——"哪个位置看到的角度最大？"\n古希腊数学家泰勒斯发现：圆的直径所对的圆周角，永远是直角！\n无论 C 在圆上哪个位置，$\\angle ACB$ 都等于 $90°$。这就是"直径所对圆周角定理"。`,
          en: `${narrator}: "Why learn circle angles?\nAt the Battle of Red Cliffs, Zhou Yu watched Cao Cao's fleet from shore — 'which position gives the widest angle?'\nAncient Greek mathematician Thales discovered: the inscribed angle subtended by a diameter is always a right angle!\nNo matter where C is on the circle, ∠ACB always equals 90°. This is the Thales' theorem."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：关键定理\n直径所对的圆周角 = $90°$\n因为 AB 是直径，所以 $\\angle ACB = 90°$。\n三角形内角和 = $180°$，所以另外两个角加起来 = $90°$。`,
          en: `${narrator}: "Key theorem\nThe inscribed angle subtended by a diameter = $90°$\nSince AB is a diameter, $\\angle ACB = 90°$.\nAngles in a triangle sum to $180°$, so the other two angles add up to $90°$."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：已知信息\n$\\angle ABC = ${knownAngle}°$（已知）\n$\\angle ACB = 90°$（直径所对圆周角）\n三角形三个角加起来 = $180°$。`,
          en: `${narrator}: "Given info\n$\\angle ABC = ${knownAngle}°$ (given)\n$\\angle ACB = 90°$ (angle in semicircle)\nThree angles of triangle sum to $180°$."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：建立方程\n$\\angle BAC + \\angle ABC + \\angle ACB = 180°$\n$\\angle BAC + ${knownAngle}° + 90° = 180°$\n$\\angle BAC = 180° - ${knownAngle}° - 90°$`,
          en: `${narrator}: "Set up the equation\n$\\angle BAC + \\angle ABC + \\angle ACB = 180°$\n$\\angle BAC + ${knownAngle}° + 90° = 180°$\n$\\angle BAC = 180° - ${knownAngle}° - 90°$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：计算答案\n$\\angle BAC = 180° - ${knownAngle}° - 90° = ${answer}°$`,
          en: `${narrator}: "Calculate\n$\\angle BAC = 180° - ${knownAngle}° - 90° = ${answer}°$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：验算\n三角形三角之和：$${answer}° + ${knownAngle}° + 90° = ${answer + knownAngle + 90}°$ ✓\n完美！所有角之和等于 $180°$。`,
          en: `${narrator}: "Verify\nSum of angles: $${answer}° + ${knownAngle}° + 90° = ${answer + knownAngle + 90}°$ ✓\nPerfect! All angles sum to $180°$."`,
        },
        highlightField: 'x',
      },
    ];

    return {
      ...template,
      description,
      data: { knownAngle, answer, theoremType: 'semicircle', generatorType: 'CIRCLE_THEOREM_RANDOM' },
      tutorialSteps,
    };
  } else {
    // Theorem B: angle at centre = 2 × angle at circumference
    // Given central angle, find inscribed angle (or vice versa)
    const isGivenCentral = pickRandom([true, false]);
    const inscribedRanges: Record<number, [number, number]> = { 1: [20, 60], 2: [15, 75], 3: [10, 85] };
    const [lo, hi] = inscribedRanges[tier];
    const inscribedAngle = randInt(lo, hi);
    const centralAngle = inscribedAngle * 2;

    const knownAngle = isGivenCentral ? centralAngle : inscribedAngle;
    const answer = isGivenCentral ? inscribedAngle : centralAngle;
    const findLabel: BilingualText = isGivenCentral
      ? { zh: '圆周角', en: 'inscribed angle' }
      : { zh: '圆心角', en: 'central angle' };
    const knownLabel: BilingualText = isGivenCentral
      ? { zh: '圆心角', en: 'central angle' }
      : { zh: '圆周角', en: 'inscribed angle' };

    const description: BilingualText = {
      zh: `同弧所对${knownLabel.zh} = $${knownAngle}°$，求${findLabel.zh}（$x$）。`,
      en: `The ${knownLabel.en} subtending the same arc = $${knownAngle}°$. Find the ${findLabel.en} ($x$).`,
    };

    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}：为什么圆心角是圆周角的两倍？\n想象圆心 O、圆上两点 A 和 B，以及圆上另一点 C。\n"圆心角"是从圆心看到 AB 的角，"圆周角"是从 C 看到 AB 的角。\nC 站在"边缘"看，视角只有圆心的一半——这是几何的奇妙规律！`,
          en: `${narrator}: "Why is the central angle double the inscribed angle?\nImagine centre O, two points A and B on the circle, and another point C on the circle.\nThe 'central angle' is the angle from the centre to AB; the 'inscribed angle' is the angle from C to AB.\nC is at the 'edge' — its viewing angle is exactly half the centre's. This is a beautiful pattern!"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：核心定理\n同弧所对圆心角 = 2 × 圆周角\n换句话说：圆周角 = $\\frac{1}{2}$ × 圆心角\n这对圆上任意位置的点 C 都成立（C 和 AB 同侧）。`,
          en: `${narrator}: "Core theorem\nCentral angle = 2 × inscribed angle (subtending same arc)\nIn other words: inscribed angle = $\\frac{1}{2}$ × central angle\nThis holds for any point C on the circle on the same side as the arc."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：识别已知量\n已知${knownLabel.zh} = $${knownAngle}°$\n要求${findLabel.zh} = $x$`,
          en: `${narrator}: "Identify the known\n${knownLabel.en} = $${knownAngle}°$ (given)\nFind ${findLabel.en} = $x$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：写出关系式\n圆心角 = 2 × 圆周角\n${isGivenCentral ? `$${centralAngle}° = 2 × x$` : `$x = 2 × ${inscribedAngle}°$`}`,
          en: `${narrator}: "Write the relationship\nCentral angle = 2 × inscribed angle\n${isGivenCentral ? `$${centralAngle}° = 2 × x$` : `$x = 2 × ${inscribedAngle}°$`}"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：计算答案\n$x = ${answer}°$`,
          en: `${narrator}: "Calculate\n$x = ${answer}°$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}：验算\n圆心角 $${centralAngle}°$ ÷ 2 = 圆周角 $${inscribedAngle}°$ ✓\n比例关系成立！`,
          en: `${narrator}: "Verify\nCentral angle $${centralAngle}°$ ÷ 2 = inscribed angle $${inscribedAngle}°$ ✓\nThe ratio holds!"`,
        },
        highlightField: 'x',
      },
    ];

    return {
      ...template,
      description,
      data: { knownAngle, answer, isGivenCentral, inscribedAngle, centralAngle, theoremType: 'center_double', generatorType: 'CIRCLE_THEOREM_RANDOM' },
      tutorialSteps,
    };
  }
}

/* ══════════════════════════════════════════════════════════
   SIMILAR TRIANGLES generator
   △ABC ~ △DEF: given p=AB, q=BC, r=DE, find EF=x
   ══════════════════════════════════════════════════════════ */

export function generateSimilarTrianglesMission(template: Mission, tier: DifficultyTier = 2): Mission {
  // p = AB (known side of △ABC), q = BC (other known side of △ABC)
  // r = DE (corresponding to AB in △DEF), x = EF (unknown, corresponding to BC)
  const pPools: Record<number, number[]> = { 1: [2, 3, 4, 5], 2: [3, 4, 5, 6, 8], 3: [5, 6, 8, 9, 10] };
  const qPools: Record<number, number[]> = { 1: [4, 6, 8, 10], 2: [6, 8, 9, 12, 15], 3: [9, 12, 14, 16, 20] };
  const scaleFactors: Record<number, number[]> = { 1: [2, 3], 2: [2, 3, 4], 3: [2, 3, 5] };

  const p = pickRandom(pPools[tier]);
  const q = pickRandom(qPools[tier]);
  const scale = pickRandom(scaleFactors[tier]);
  const r = p * scale;
  const x = q * scale;

  // Ensure x is a whole number (always is since p,q,scale are integers)
  if (x !== Math.round(x)) return safeRetry(template, generateSimilarTrianglesMission, tier);

  const narratorPairs: Array<[string, string]> = [
    ['诸葛亮', '赵云'],
    ['曹操', '郭嘉'],
    ['孙权', '周瑜'],
  ];
  const [narrator1, narrator2] = pickRandom(narratorPairs);

  const scenarios = [
    {
      zh: `${narrator1}用影子测量旗杆高度。小旗杆高 $${p}$ 米，影长 $${r}$ 米。大旗杆影长 $${q}$ 米，求大旗杆高度 $x$。`,
      en: `${narrator1} measures flagpole height using shadows. Small flagpole: height $${p}$ m, shadow $${r}$ m. Large flagpole shadow: $${q}$ m. Find height $x$.`,
    },
    {
      zh: `${narrator2}测绘两座相似的营地塔楼。△ABC ~ △DEF，$AB = ${p}$，$BC = ${q}$，$DE = ${r}$，求 $EF = x$。`,
      en: `${narrator2} surveys two similar camp towers. △ABC ~ △DEF, $AB = ${p}$, $BC = ${q}$, $DE = ${r}$. Find $EF = x$.`,
    },
  ];
  const scenario = pickRandom(scenarios);

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator1}："为什么相似三角形能测量遥远的距离？\n\n古人没有现代测量工具，但他们发现：阳光下，同一时刻所有物体的「影子/高度」比值相同。\n一根 ${p} 米的竹竿影长 ${r} 米——这个比值就是「相似比」。\n只要知道另一个物体的影长，就能算出它的真实高度！\n这就是相似三角形的威力：形状角度完全相同，大小按比例变化。"`,
        en: `${narrator1}: "Why can similar triangles measure distant objects?\n\nAncient surveyors had no modern tools, but they discovered: at the same moment, every object has the same shadow-to-height ratio.\nA ${p}-metre pole casts a ${r}-metre shadow — that ratio IS the similarity ratio.\nKnowing another object's shadow length lets you calculate its true height!\nThat's the power of similar triangles: identical angles, proportional sides."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator1}："认识相似三角形的标记方式：\n\n当我们写 △ABC ~ △DEF，意思是：\n• 角 A = 角 D，角 B = 角 E，角 C = 角 F（角度完全对应）\n• 对应边：$\\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{CA}{FD}$（比值完全相同）\n\n已知：$AB = ${p}$，$BC = ${q}$，$DE = ${r}$，求 $EF = x$。"`,
        en: `${narrator1}: "Understanding similar triangle notation:\n\nWhen we write △ABC ~ △DEF, it means:\n• Angle A = Angle D, Angle B = Angle E, Angle C = Angle F (angles match perfectly)\n• Corresponding sides: $\\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{CA}{FD}$ (same ratio)\n\nGiven: $AB = ${p}$, $BC = ${q}$, $DE = ${r}$. Find $EF = x$."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator1}："第一步：求相似比（scale factor）。\n\n$AB$ 对应 $DE$，所以：\n$$k = \\frac{DE}{AB} = \\frac{${r}}{${p}} = ${scale}$$\n\n△DEF 是 △ABC 放大了 ${scale} 倍。"`,
        en: `${narrator1}: "Step 1: Find the scale factor.\n\n$AB$ corresponds to $DE$, so:\n$$k = \\frac{DE}{AB} = \\frac{${r}}{${p}} = ${scale}$$\n\n△DEF is ${scale} times larger than △ABC."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator1}："第二步：用相似比求未知边。\n\n$BC$ 对应 $EF$，用同样的 scale factor：\n$$x = EF = BC \\times k = ${q} \\times ${scale} = ${x}$$"`,
        en: `${narrator1}: "Step 2: Use the scale factor to find the unknown side.\n\n$BC$ corresponds to $EF$, apply the same scale factor:\n$$x = EF = BC \\times k = ${q} \\times ${scale} = ${x}$$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator1}："答案：$x = ${x}$\n\n△DEF 中，$EF = ${x}$。"`,
        en: `${narrator1}: "Answer: $x = ${x}$\n\nIn △DEF, $EF = ${x}$."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator1}："验算——检查三组对应边的比值是否相等：\n$$\\frac{DE}{AB} = \\frac{${r}}{${p}} = ${scale} \\checkmark$$\n$$\\frac{EF}{BC} = \\frac{${x}}{${q}} = ${scale} \\checkmark$$\n两个比值相等！△ABC ~ △DEF 验证成功。"`,
        en: `${narrator1}: "Verify — check that corresponding side ratios are equal:\n$$\\frac{DE}{AB} = \\frac{${r}}{${p}} = ${scale} \\checkmark$$\n$$\\frac{EF}{BC} = \\frac{${x}}{${q}} = ${scale} \\checkmark$$\nBoth ratios equal! △ABC ~ △DEF confirmed."`,
      },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description: scenario,
    data: { p, q, r, generatorType: 'SIMILAR_TRIANGLES_RANDOM' },
    tutorialSteps,
  };
}

/* ══════════════════════════════════════════════════════════
   COORD_3D generator
   3D coordinate problems: midpoint or distance in 3D
   Uses COORD_3D type
   ══════════════════════════════════════════════════════════ */

export function generateCoord3DMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const mode = (template.data?.mode as 'midpoint' | 'distance') ||
    (tier === 1 ? 'midpoint' : pickRandom(['midpoint', 'distance'] as const));

  const coordPools: Record<number, number[]> = {
    1: [0, 1, 2, 3, 4, 5, 6],
    2: [0, 1, 2, 3, 4, 5, 6, 8, 10, -1, -2],
    3: [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 8],
  };

  const pick = () => pickRandom(coordPools[tier]);
  const x1 = pick(), y1 = pick(), z1 = pick();
  const x2 = pick(), y2 = pick(), z2 = pick();

  const narrator = pickRandom(['诸葛亮', '张辽', '曹操', '周瑜']);

  if (mode === 'midpoint') {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const mz = (z1 + z2) / 2;

    // For tier 1, ensure clean midpoints (even sums)
    if (tier === 1 && (x1 + x2) % 2 !== 0) return safeRetry(template, generateCoord3DMission, tier);
    if (tier === 1 && (y1 + y2) % 2 !== 0) return safeRetry(template, generateCoord3DMission, tier);
    if (tier === 1 && (z1 + z2) % 2 !== 0) return safeRetry(template, generateCoord3DMission, tier);

    const description: BilingualText = {
      zh: `在三维空间中，$A = (${x1}, ${y1}, ${z1})$，$B = (${x2}, ${y2}, ${z2})$。\n求线段 $AB$ 的中点坐标 $M(x, y, z)$。`,
      en: `In 3D space, $A = (${x1}, ${y1}, ${z1})$, $B = (${x2}, ${y2}, ${z2})$.\nFind the midpoint $M(x, y, z)$ of segment $AB$.`,
    };

    const tutorialSteps = [
      {
        text: {
          zh: `${narrator}："三维坐标是二维坐标的自然延伸。在二维中我们有 $(x, y)$，在三维中加了高度方向 $z$。\n中点公式同样适用于三维：每个坐标分量分别取平均值。"`,
          en: `${narrator}: "3D coordinates are a natural extension of 2D. We add a height dimension $z$ to $(x, y)$.\nThe midpoint formula applies to each coordinate separately — take the average of each component."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}："三维中点公式：\n$$M = \\left(\\frac{x_1+x_2}{2},\\ \\frac{y_1+y_2}{2},\\ \\frac{z_1+z_2}{2}\\right)$$\n三个分量完全独立——分别计算，再合并。"`,
          en: `${narrator}: "3D Midpoint Formula:\n$$M = \\left(\\frac{x_1+x_2}{2},\\ \\frac{y_1+y_2}{2},\\ \\frac{z_1+z_2}{2}\\right)$$\nThree components are independent — calculate each, then combine."`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}："代入 $A(${x1}, ${y1}, ${z1})$ 和 $B(${x2}, ${y2}, ${z2})$：\n$$x = \\frac{${x1}+${x2}}{2} = \\frac{${x1 + x2}}{2} = ${mx}$$"`,
          en: `${narrator}: "Substitute $A(${x1}, ${y1}, ${z1})$ and $B(${x2}, ${y2}, ${z2})$:\n$$x = \\frac{${x1}+${x2}}{2} = \\frac{${x1 + x2}}{2} = ${mx}$$"`,
        },
        highlightField: 'x',
      },
      {
        text: {
          zh: `${narrator}："$$y = \\frac{${y1}+${y2}}{2} = ${my}$$\n$$z = \\frac{${z1}+${z2}}{2} = ${mz}$$"`,
          en: `${narrator}: "$$y = \\frac{${y1}+${y2}}{2} = ${my}$$\n$$z = \\frac{${z1}+${z2}}{2} = ${mz}$$"`,
        },
        highlightField: 'y',
      },
      {
        text: {
          zh: `${narrator}："答案：中点 $M = (${mx}, ${my}, ${mz})$。"`,
          en: `${narrator}: "Answer: Midpoint $M = (${mx}, ${my}, ${mz})$."`,
        },
        highlightField: 'z',
      },
      {
        text: {
          zh: `${narrator}："验算：$M$ 到 $A$ 的距离 = $M$ 到 $B$ 的距离（中点定义）。\n$MA_x = ${mx}-${x1}=${mx - x1}$，$MB_x = ${x2}-${mx}=${x2 - mx}$。相等 ✓"`,
          en: `${narrator}: "Verify: distance $M$ to $A$ = distance $M$ to $B$ (midpoint definition).\n$MA_x = ${mx}-${x1}=${mx - x1}$, $MB_x = ${x2}-${mx}=${x2 - mx}$. Equal ✓"`,
        },
        highlightField: 'x',
      },
    ];

    return {
      ...template,
      description,
      data: { x1, y1, z1, x2, y2, z2, mode: 'midpoint', generatorType: 'COORD_3D_RANDOM' },
      tutorialSteps,
    };
  }

  // Distance mode
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const distSq = dx * dx + dy * dy + dz * dz;

  // Ensure perfect square distance for clean answer
  if (Math.sqrt(distSq) !== Math.floor(Math.sqrt(distSq))) {
    return safeRetry(template, generateCoord3DMission, tier);
  }
  const dist = Math.sqrt(distSq);

  const description: BilingualText = {
    zh: `在三维空间中，$A = (${x1}, ${y1}, ${z1})$，$B = (${x2}, ${y2}, ${z2})$。\n求线段 $AB$ 的长度 $x$。`,
    en: `In 3D space, $A = (${x1}, ${y1}, ${z1})$, $B = (${x2}, ${y2}, ${z2})$.\nFind the length of segment $AB$ = $x$.`,
  };

  const tutorialSteps = [
    {
      text: {
        zh: `${narrator}："三维距离公式是二维勾股定理的延伸。在二维中 $d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$，三维中再加一项 $z$：\n$$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$$"`,
        en: `${narrator}: "3D distance formula extends the 2D Pythagorean theorem. In 2D: $d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$. In 3D, add the $z$ term:\n$$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}："为什么是这个公式？在三维中，从 $A$ 到 $B$ 可以拆成三个方向的位移，三次使用勾股定理叠加就得到这个公式。"`,
        en: `${narrator}: "Why this formula? In 3D, movement from $A$ to $B$ can be decomposed into three directions. Apply Pythagoras three times and you get this formula."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}："代入 $A(${x1}, ${y1}, ${z1})$ 和 $B(${x2}, ${y2}, ${z2})$：\n$$x_2-x_1 = ${x2}-${x1} = ${dx}$$\n$$y_2-y_1 = ${y2}-${y1} = ${dy}$$\n$$z_2-z_1 = ${z2}-${z1} = ${dz}$$"`,
        en: `${narrator}: "Substitute $A(${x1}, ${y1}, ${z1})$ and $B(${x2}, ${y2}, ${z2})$:\n$$x_2-x_1 = ${x2}-${x1} = ${dx}$$\n$$y_2-y_1 = ${y2}-${y1} = ${dy}$$\n$$z_2-z_1 = ${z2}-${z1} = ${dz}$$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}："计算平方和：\n$$d^2 = ${dx}^2 + ${dy}^2 + ${dz}^2 = ${dx * dx} + ${dy * dy} + ${dz * dz} = ${distSq}$$"`,
        en: `${narrator}: "Calculate sum of squares:\n$$d^2 = ${dx}^2 + ${dy}^2 + ${dz}^2 = ${dx * dx} + ${dy * dy} + ${dz * dz} = ${distSq}$$"`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}："取平方根：$d = \\sqrt{${distSq}} = ${dist}$。"`,
        en: `${narrator}: "Take square root: $d = \\sqrt{${distSq}} = ${dist}$."`,
      },
      highlightField: 'x',
    },
    {
      text: {
        zh: `${narrator}："验算：$d^2 = ${dist}^2 = ${dist * dist}$ ✓ 与计算的 ${distSq} 相等，答案 $x = ${dist}$ 正确。"`,
        en: `${narrator}: "Check: $d^2 = ${dist}^2 = ${dist * dist}$ ✓ Equals calculated ${distSq}. Answer $x = ${dist}$ confirmed."`,
      },
      highlightField: 'x',
    },
  ];

  return {
    ...template,
    description,
    data: { x1, y1, z1, x2, y2, z2, mode: 'distance', generatorType: 'COORD_3D_RANDOM' },
    tutorialSteps,
  };
}

