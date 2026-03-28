import type { Mission } from '../../types';

export const MISSIONS_Y9: Mission[] = [
  // --- Year 9: The Battle of Guandu (Strategy) ---
  {
    id: 911, grade: 9, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 粮草与指数定律", en: "Unit 1: Supplies & Indices" },
    topic: 'Algebra', type: 'INDICES',
    title: { zh: '官渡积粮', en: 'Guandu Supplies' },
    skillName: { zh: '指数乘法术', en: 'Index Multiplication' },
    skillSummary: { zh: '同底数幂相乘，指数相加', en: 'Same base: multiply → add exponents' },
    story: { zh: '官渡之战前夕，曹操囤积粮草。第一年产粮 ${base}^{e1}$ 斛，第二年产粮是第一年的 ${base}^{e2}$ 倍。', en: "Before Guandu, Cao Cao stores grain. Year 1 yields ${base}^{e1}$, Year 2 is ${base}^{e2}$ times that." },
    description: { zh: '计算总产量：${base}^{e1} \\times {base}^{e2} = {base}^x$，求 $x$。', en: 'Calculate total: ${base}^{e1} \\times {base}^{e2} = {base}^x$, find $x$.' },
    data: { base: 3, e1: 2, e2: 3, generatorType: 'INDICES_RANDOM' }, difficulty: 'Easy', reward: 120,
    kpId: 'kp-1.3-02', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '郭嘉："官渡决战在即，我们要合并两年的粮草。为什么不能直接把指数加起来？因为 $3^2$ 不是 $3 \\times 2$——它是 $3 \\times 3 = 9$。"', en: 'Guo Jia: "Guandu is coming — we need to combine two years of grain. Why can\'t we just add exponents? Because $3^2$ isn\'t $3 \\times 2$ — it\'s $3 \\times 3 = 9$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："想象叠砖块：$3^2$ 是叠 2 层（每层 3 块），$3^3$ 是叠 3 层。合并就是总共叠了 $2+3=5$ 层——底数不变，层数相加。"', en: 'Guo Jia: "Think of stacking bricks: $3^2$ is 2 layers (3 per layer), $3^3$ is 3 layers. Combining means $2+3=5$ layers total — base stays, layers add."' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："写出公式：$3^2 \\times 3^3 = 3^{2+3}$——底数相同，指数相加。"', en: 'Guo Jia: "Write the rule: $3^2 \\times 3^3 = 3^{2+3}$ — same base, add exponents."' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："计算指数：$2 + 3 = 5$，所以 $3^2 \\times 3^3 = 3^5$。"', en: 'Guo Jia: "Calculate the exponent: $2 + 3 = 5$, so $3^2 \\times 3^3 = 3^5$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："答案：$x = 5$。"', en: 'Guo Jia: "Answer: $x = 5$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："验算：$3^2 = 9$，$3^3 = 27$，$9 \\times 27 = 243$。而 $3^5 = 243$。✓ 完全吻合！粮草充足，可以决战官渡。"', en: 'Guo Jia: "Check: $3^2 = 9$, $3^3 = 27$, $9 \\times 27 = 243$. And $3^5 = 243$. ✓ Perfect match! Grain secured for Guandu."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '同底数幂相乘，指数相加。', en: 'Multiply powers with same base: add exponents.' }, formula: '$a^m \\times a^n = a^{m+n}$', tips: [{ zh: '郭嘉提示：算清粮草，方能决战官渡。', en: 'Guo Jia Tip: Count the grain to win at Guandu.' }] },
    storyConsequence: { correct: { zh: '官渡积粮——指数运算过关！做得漂亮！', en: 'Guandu Supplies — Well done!' }, wrong: { zh: '指数运算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 912, grade: 9, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 粮草与指数定律", en: "Unit 1: Supplies & Indices" },
    topic: 'Algebra', type: 'INDICES',
    title: { zh: '粮仓扩建', en: 'Granary Expansion' },
    skillName: { zh: '指数相加术', en: 'Index Addition' },
    skillSummary: { zh: '同底数幂相乘，指数相加', en: 'Multiply same-base powers: add exponents' },
    story: { zh: '粮仓扩建。第一批 ${base}^{e1}$ 单位，扩建 ${base}^{e2}$ 倍。', en: 'Granary expansion. Batch 1: ${base}^{e1}$ units, expanded ${base}^{e2}$ times.' },
    description: { zh: '利用同底数幂相乘性质：$a^m \\times a^n = a^{m+n}$。', en: 'Use same-base multiplication: $a^m \\times a^n = a^{m+n}$.' },
    data: { base: 2, e1: 3, e2: 2, generatorType: 'INDICES_RANDOM' }, difficulty: 'Medium', reward: 140,
    kpId: 'kp-1.3-02', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '程昱："粮仓要扩建——为什么要学指数？因为粮食产量每年翻倍，$2^3$ 意味着连续翻了 3 次，不是简单的 $2 \\times 3$。"', en: 'Cheng Yu: "Why learn indices? Because grain doubles each year. $2^3$ means 3 doublings, not simply $2 \\times 3$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："翻倍的翻倍还是翻倍：$2^3$ 翻了 3 次，再翻 $2^2$ 次——总共翻了 $3+2$ 次。底数（翻倍率）不变，次数叠加。"', en: 'Cheng Yu: "Doubling a doubling is still doubling: $2^3$ is 3 times, then $2^2$ more — total $3+2$ times. The base (rate) stays, counts stack."' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："代入公式：$2^3 \\times 2^2 = 2^{3+2}$。"', en: 'Cheng Yu: "Apply the rule: $2^3 \\times 2^2 = 2^{3+2}$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："加指数：$3 + 2 = 5$。"', en: 'Cheng Yu: "Add exponents: $3 + 2 = 5$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："答案 $x = 5$。"', en: 'Cheng Yu: "Answer: $x = 5$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："验算：$2^3 = 8$，$2^2 = 4$，$8 \\times 4 = 32$。而 $2^5 = 32$。✓ 空间利用最大化！"', en: 'Cheng Yu: "Check: $2^3 = 8$, $2^2 = 4$, $8 \\times 4 = 32$. And $2^5 = 32$. ✓ Space maximized!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '同底数幂相乘，底数不变，指数相加。', en: 'Multiply same-base powers: base stays, add exponents.' }, formula: '$a^m \\times a^n = a^{m+n}$', tips: [{ zh: '程昱提示：空间利用要最大化。', en: 'Cheng Yu Tip: Maximize space utilization.' }] },
    storyConsequence: { correct: { zh: '粮仓扩建——指数运算过关！做得漂亮！', en: 'Granary Expansion — Well done!' }, wrong: { zh: '指数运算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 913, grade: 9, unitId: 1, order: 3,
    unitTitle: { zh: "Unit 1: 粮草与指数定律", en: "Unit 1: Supplies & Indices" },
    topic: 'Algebra', type: 'INDICES',
    title: { zh: '火烧乌巢', en: 'Burning Wuchao' },
    skillName: { zh: '指数除法术', en: 'Index Division' },
    skillSummary: { zh: '同底数幂相除，指数相减', en: 'Same base: divide → subtract exponents' },
    story: { zh: '袭击袁绍粮仓。已知粮仓数量为 ${base}^{e1}$，每把火能烧毁 ${base}^{e2}$ 座。', en: "Attacking Wuchao. There are ${base}^{e1}$ granaries, each fire destroys ${base}^{e2}$." },
    description: { zh: '计算剩余粮仓：${base}^{e1} / {base}^{e2} = {base}^x$，求 $x$。', en: 'Calculate remaining: ${base}^{e1} / {base}^{e2} = {base}^x$, find $x$.' },
    data: { base: 2, e1: 8, e2: 5, op: 'div', generatorType: 'INDICES_RANDOM' }, difficulty: 'Medium', reward: 160,
    kpId: 'kp-1.3-02', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '曹操："乌巢一火定乾坤——为什么除法要减指数？因为除法是乘法的反操作：乘法加层，除法就是拆层。"', en: 'Cao Cao: "One fire at Wuchao changes everything — why subtract exponents for division? Because division reverses multiplication: if multiply adds layers, divide removes them."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："想象 $2^8$ 是 8 层砖，烧掉 $2^5$ 相当于拆走 5 层——剩下 $8-5 = 3$ 层，即 $2^3$。"', en: 'Cao Cao: "Imagine $2^8$ is 8 layers of bricks. Burning $2^5$ removes 5 layers — leaving $8-5 = 3$ layers, i.e., $2^3$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："写出公式：$2^8 \\div 2^5 = 2^{8-5}$——底数不变，指数相减。"', en: 'Cao Cao: "Write the rule: $2^8 \\div 2^5 = 2^{8-5}$ — base unchanged, subtract exponents."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："算指数：$8 - 5 = 3$。"', en: 'Cao Cao: "Calculate: $8 - 5 = 3$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："答案 $x = 3$。"', en: 'Cao Cao: "Answer: $x = 3$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："验算：$2^8 = 256$，$2^5 = 32$，$256 \\div 32 = 8$。而 $2^3 = 8$。✓ 乌巢一火，袁绍必败！"', en: 'Cao Cao: "Check: $2^8 = 256$, $2^5 = 32$, $256 \\div 32 = 8$. And $2^3 = 8$. ✓ Wuchao burns, Yuan Shao falls!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '同底数幂相除，指数相减。', en: 'Divide powers with same base: subtract exponents.' }, formula: '$a^m / a^n = a^{m-n}$', tips: [{ zh: '曹操提示：乌巢一火，袁绍必败！', en: 'Cao Tip: Once Wuchao burns, Yuan Shao is finished!' }] },
    storyConsequence: { correct: { zh: '火烧乌巢——指数运算过关！做得漂亮！', en: 'Burning Wuchao — Well done!' }, wrong: { zh: '指数运算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 921, grade: 9, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 攻城与勾股定理", en: "Unit 2: Siege & Pythagoras" },
    topic: 'Geometry', type: 'PYTHAGORAS',
    title: { zh: '云梯攻城', en: 'Siege Ladders' },
    skillName: { zh: '勾股攻城术', en: 'Pythagorean Siege' },
    skillSummary: { zh: 'a² + b² = c²，已知两边求第三边', en: 'a² + b² = c², find the third side' },
    story: { zh: "攻打袁绍营寨。城墙高 {b} 丈，护城河宽 {a} 丈。", en: "Attacking Yuan Shao's camp. Walls {b} units high, moat {a} units wide." },
    description: { zh: '求云梯长度 $c$。', en: 'Find ladder length $c$.' },
    data: { a: 6, b: 8, generatorType: 'PYTHAGORAS_RANDOM' }, difficulty: 'Medium', reward: 200,
    storyConsequence: {
      correct: { zh: '云梯精准搭上城头！将士们鱼贯而入，攻城成功！', en: 'The ladder reaches the top perfectly! Soldiers storm the walls, siege successful!' },
      wrong: { zh: '云梯太短了！差了几丈，将士们只能撤退，改走地道突袭...', en: 'The ladder is too short! Soldiers must retreat and try the tunnel approach...' },
    },
    kpId: 'kp-6.1-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '许褚："为什么攻城需要数学？因为梯子短一寸就够不着城头——你不可能先爬上去再量。这道题事关性命！"', en: 'Xu Chu: "Why does siege need math? A ladder one inch too short means you can\'t reach the top — you can\'t measure while climbing. This is life or death!"' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："城墙和地面构成一个直角——像一个 L 形。梯子斜靠上去，就是直角三角形的斜边。勾股定理专门解决这种问题。"', en: 'Xu Chu: "The wall and ground form a right angle — like an L shape. The ladder leaning against it is the hypotenuse. The Pythagorean theorem solves exactly this."' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："先算两条直角边的平方：$6^2 = 36$，$8^2 = 64$。"', en: 'Xu Chu: "Square both legs: $6^2 = 36$, $8^2 = 64$."' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："加起来：$36 + 64 = 100$，所以 $c^2 = 100$。"', en: 'Xu Chu: "Add them: $36 + 64 = 100$, so $c^2 = 100$."' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："开方：$c = \\sqrt{100} = 10$ 丈。"', en: 'Xu Chu: "Square root: $c = \\sqrt{100} = 10$ units."' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："验算：$10^2 = 100$，$6^2 + 8^2 = 36 + 64 = 100$。✓ 对上了！梯子够长了，俺先上！"', en: 'Xu Chu: "Check: $10^2 = 100$, $6^2 + 8^2 = 36 + 64 = 100$. ✓ It works! Ladder is long enough, I\'ll go first!"' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '直角三角形中，$a^2 + b^2 = c^2$。', en: 'In a right triangle, $a^2 + b^2 = c^2$.' }, formula: '$a^2 + b^2 = c^2$', tips: [{ zh: "许褚提示：梯子不够长，俺可跳不上去！", en: "Xu Chu Tip: If the ladder is too short, I can't jump up!" }] }
  },
  {
    id: 922, grade: 9, unitId: 2, order: 2,
    unitTitle: { zh: "Unit 2: 攻城与勾股定理", en: "Unit 2: Siege & Pythagoras" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '望楼侦察', en: 'Scouting from the Tower' },
    skillName: { zh: '望楼测距术', en: 'Tower Ranging' },
    skillSummary: { zh: '用正切值计算距离', en: 'Calculate distance using tangent' },
    story: { zh: '从望楼俯瞰敌营。已知望楼高 {opposite} 丈，与敌营水平距离 {adjacent} 丈。', en: 'Scouting from a tower. Height {opposite}, horizontal distance {adjacent}.' },
    description: { zh: '求正切值 $\\tan(\\theta) = \\text{对边} / \\text{邻边}$。', en: 'Find $\\tan(\\theta) = \\text{opposite} / \\text{adjacent}$.' },
    data: { opposite: 12, adjacent: 16, generatorType: 'TRIGONOMETRY_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-6.2-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '乐进："为什么侦察兵要懂三角？因为你站在望楼上，不可能拿绳子量到敌营——但你知道楼高和角度，数学就能算出距离。"', en: 'Yue Jin: "Why do scouts need trigonometry? You can\'t stretch a rope to the enemy camp from a tower — but with height and angle, math gives you the distance."' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："望楼、地面、视线构成直角三角形。楼高是「对边」（竖着的），地面距离是「邻边」（横着的）。正切就是竖÷横。"', en: 'Yue Jin: "The tower, ground, and line of sight form a right triangle. Tower height is the \'opposite\' (vertical), ground distance is the \'adjacent\' (horizontal). Tangent = vertical ÷ horizontal."' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："代入：$\\tan(\\theta) = \\text{对边} / \\text{邻边} = 12 / 16$。"', en: 'Yue Jin: "Substitute: $\\tan(\\theta) = \\text{opposite} / \\text{adjacent} = 12 / 16$."' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："化简分数：$12 / 16 = 3 / 4 = 0.75$。"', en: 'Yue Jin: "Simplify: $12 / 16 = 3 / 4 = 0.75$."' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："答案：$\\tan(\\theta) = 0.75$。"', en: 'Yue Jin: "Answer: $\\tan(\\theta) = 0.75$."' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："验算：$0.75 \\times 16 = 12$，正好等于楼高。✓ 看清距离，方能百步穿杨。"', en: 'Yue Jin: "Check: $0.75 \\times 16 = 12$, exactly the tower height. ✓ See the distance, hit the mark."' },
        highlightField: 'tan'
      }
    ],
    secret: { concept: { zh: '正切值是直角三角形对边与邻边的比。', en: 'Tangent is the ratio of opposite to adjacent side.' }, formula: '$\\tan(\\theta) = a / b$', tips: [{ zh: '乐进提示：看清距离，方能百步穿杨。', en: 'Yue Jin Tip: See the distance clearly to hit the mark.' }] },
    storyConsequence: { correct: { zh: '望楼侦察——三角精准！做得漂亮！', en: 'Scouting from the Tower — Well done!' }, wrong: { zh: '三角函数算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 923, grade: 9, unitId: 2, order: 3,
    unitTitle: { zh: "Unit 2: 攻城与勾股定理", en: "Unit 2: Siege & Pythagoras" },
    topic: 'Geometry', type: 'PYTHAGORAS',
    title: { zh: '地道突袭', en: 'Tunnel Raid' },
    skillName: { zh: '勾股探测术', en: 'Pythagorean Probe' },
    skillSummary: { zh: '用勾股定理求未知边长', en: 'Use Pythagorean theorem for unknown side' },
    story: { zh: '挖掘地道突袭袁绍。地道斜长 {c} 丈，水平距离 {a} 丈。', en: 'Digging a tunnel to raid Yuan Shao. Slant length {c}, horizontal distance {a}.' },
    description: { zh: '求地道深度 $b$。', en: 'Find tunnel depth $b$.' },
    data: { a: 24, c: 25, generatorType: 'PYTHAGORAS_RANDOM' }, difficulty: 'Hard', reward: 250,
    kpId: 'kp-6.1-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '曹洪："为什么地道要用数学？你知道从入口到出口的斜距（25 丈）和水平距离（24 丈），但你不知道要挖多深——挖浅了会被敌人发现！"', en: 'Cao Hong: "Why does tunneling need math? You know the slant distance (25) and horizontal distance (24), but not the depth — too shallow and the enemy finds you!"' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："地道的截面是直角三角形：水平距离是一条直角边 $a$，深度是另一条直角边 $b$，斜距是斜边 $c$。这次我们知道斜边，要反过来求。"', en: 'Cao Hong: "The tunnel cross-section is a right triangle: horizontal = leg $a$, depth = leg $b$, slant = hypotenuse $c$. This time we know $c$ and need to find $b$."' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："变形勾股定理：$b^2 = c^2 - a^2 = 25^2 - 24^2$。"', en: 'Cao Hong: "Rearrange Pythagoras: $b^2 = c^2 - a^2 = 25^2 - 24^2$."' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："分别算：$625 - 576 = 49$。"', en: 'Cao Hong: "Calculate: $625 - 576 = 49$."' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："开方：$b = \\sqrt{49} = 7$ 丈。"', en: 'Cao Hong: "Square root: $b = \\sqrt{49} = 7$ units."' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："验算：$7^2 + 24^2 = 49 + 576 = 625 = 25^2$。✓ 完美！地道够深，神不知鬼不觉。"', en: 'Cao Hong: "Check: $7^2 + 24^2 = 49 + 576 = 625 = 25^2$. ✓ Perfect! Deep enough to stay hidden."' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '勾股定理变形：$b = \\sqrt{c^2 - a^2}$。', en: 'Pythagorean variant: $b = \\sqrt{c^2 - a^2}$.' }, formula: '$b^2 = c^2 - a^2$', tips: [{ zh: "曹洪提示：地道要挖深，别被发现了！", en: "Cao Hong Tip: Dig deep, don't get spotted!" }] },
    storyConsequence: { correct: { zh: '地道突袭——勾股定理用对了！做得漂亮！', en: 'Tunnel Raid — Well done!' }, wrong: { zh: '勾股定理用错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 931, grade: 9, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 阵法与相似", en: "Unit 3: Formations & Similarity" },
    topic: 'Geometry', type: 'SIMILARITY',
    title: { zh: '旗帜缩放', en: 'Flag Scaling' },
    skillName: { zh: '旗帜缩放术', en: 'Flag Scaling' },
    skillSummary: { zh: '相似比求未知边', en: 'Use similarity ratio for unknown sides' },
    story: { zh: '赵云要为阵前制作一面巨型战旗。原图只有手掌大小，必须按比例放大——形状不能走样，尺寸必须精准。', en: 'Zhao Yun needs a massive battle flag for the front line. The design is palm-sized and must be scaled up perfectly — same shape, bigger dimensions.' },
    description: { zh: '求大旗的宽 $x$。', en: 'Find the width $x$ of the large flag.' },
    data: { a: 6, b: 2, c: 3, generatorType: 'SIMILARITY_RANDOM' }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-4.4-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '赵云："为什么放大旗帜要按比例？如果你随意拉伸，图案就变形了——战旗必须形状完全一致，只是尺寸变大。这就是「相似」。"', en: 'Zhao Yun: "Why scale proportionally? If you stretch randomly, the design distorts — battle flags must keep the exact same shape, just bigger. That\'s \'similarity\'."' },
        highlightField: 'x'
      },
      {
        text: { zh: '赵云："相似的关键：对应边的比值相同。小旗长 2 宽 3，大旗长 6——先找放大了几倍。"', en: 'Zhao Yun: "The key to similarity: corresponding sides have equal ratios. Small flag 2×3, large flag length 6 — first find the scale factor."' },
        highlightField: 'x'
      },
      {
        text: { zh: '赵云："比例尺 = 大旗长 ÷ 小旗长 = $6 \\div 2 = 3$ 倍。"', en: 'Zhao Yun: "Scale factor = large ÷ small = $6 \\div 2 = 3$ times."' },
        highlightField: 'x'
      },
      {
        text: { zh: '赵云："宽也要放大同样倍数：$x = 3 \\times 3 = 9$。"', en: 'Zhao Yun: "Width scales by the same factor: $x = 3 \\times 3 = 9$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '赵云："答案：$x = 9$ 尺。"', en: 'Zhao Yun: "Answer: $x = 9$ feet."' },
        highlightField: 'x'
      },
      {
        text: { zh: '赵云："验算：小旗长宽比 = $2:3$，大旗长宽比 = $6:9 = 2:3$。✓ 比值一致——形状完美保持！"', en: 'Zhao Yun: "Check: small flag ratio = $2:3$, large flag ratio = $6:9 = 2:3$. ✓ Ratios match — shape perfectly preserved!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '相似图形对应边成比例。', en: 'Similar figures have proportional corresponding sides.' }, formula: '$a/b = x/c$', tips: [{ zh: '于禁提示：军旗要统一，威严不可废。', en: 'Yu Jin Tip: Flags must be uniform, dignity must be maintained.' }] },
    storyConsequence: { correct: { zh: '旗帜缩放——相似比完美！做得漂亮！', en: 'Flag Scaling — Well done!' }, wrong: { zh: '相似比算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 932, grade: 9, unitId: 3, order: 2,
    unitTitle: { zh: "Unit 3: 阵法与相似", en: "Unit 3: Formations & Similarity" },
    topic: 'Geometry', type: 'SIMILARITY',
    title: { zh: '地图测绘', en: 'Map Surveying' },
    skillName: { zh: '地图测绘术', en: 'Map Survey' },
    skillSummary: { zh: '对应边成比例', en: 'Corresponding sides are proportional' },
    story: { zh: '诸葛亮在沙盘上比划行军路线——沙盘上 {b} 寸等于实际 {a} 步。如果沙盘上两城相距 {c} 寸，实际要走多远？', en: 'Zhuge Liang traces a march route on the sand table — {b} inch on the table equals {a} paces in reality. If two cities are {c} inches apart on the table, how far is the real distance?' },
    description: { zh: '求实际距离 $x$（单位：厘米）。', en: 'Find actual distance $x$ (in cm).' },
    data: { a: 1000, b: 1, c: 5, generatorType: 'SIMILARITY_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-4.4-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮："为什么地图要有比例尺？因为你不可能把真实世界直接画到沙盘上——1 寸代表 1000 步，这就是缩小版的现实。"', en: 'Zhuge Liang: "Why do maps need a scale? You can\'t draw the real world at actual size — 1 inch represents 1000 paces, a miniature version of reality."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："比例尺就是相似比：图上 1 厘米 = 实际 1000 厘米。图上量出来多少，乘以比例尺就是实际距离。"', en: 'Zhuge Liang: "The scale is the similarity ratio: 1cm on map = 1000cm in reality. Multiply the map measurement by the scale to get real distance."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："列等式：$1:1000 = 5:x$，即 $x = 5 \\times 1000$。"', en: 'Zhuge Liang: "Set up: $1:1000 = 5:x$, so $x = 5 \\times 1000$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："计算：$5 \\times 1000 = 5000$。"', en: 'Zhuge Liang: "Calculate: $5 \\times 1000 = 5000$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："答案：实际距离 $x = 5000$ 厘米。"', en: 'Zhuge Liang: "Answer: actual distance $x = 5000$ cm."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："验算：$5000 \\div 1000 = 5$，正好是图上距离。✓ 差之毫厘，谬以千里——但我们算得分毫不差！"', en: 'Zhuge Liang: "Check: $5000 \\div 1000 = 5$, exactly the map distance. ✓ A tiny error leads to a huge mistake — but our math is spot on!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '比例尺是图上距离与实际距离的比。', en: 'Scale is the ratio of map distance to actual distance.' }, formula: '$Scale = Map / Actual$', tips: [{ zh: '董昭提示：差之毫厘，谬以千里。', en: 'Dong Zhao Tip: A tiny error leads to a huge mistake.' }] },
    storyConsequence: { correct: { zh: '地图测绘——相似比完美！做得漂亮！', en: 'Map Surveying — Well done!' }, wrong: { zh: '相似比算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 933, grade: 9, unitId: 3, order: 3,
    unitTitle: { zh: "Unit 3: 阵法与相似", en: "Unit 3: Formations & Similarity" },
    topic: 'Geometry', type: 'SIMILAR_TRIANGLES',
    title: { zh: '影子量旗', en: 'Shadow Flagpole' },
    skillName: { zh: '相似三角形术', en: 'Similar Triangles' },
    skillSummary: { zh: '对应边成比例：△ABC ~ △DEF → AB/DE = BC/EF', en: 'Corresponding sides proportional: △ABC ~ △DEF → AB/DE = BC/EF' },
    story: { zh: '赵云用影子法测量军旗高度。小标杆高 {p} 米，投影 {r} 米；大旗杆投影 {q} 米。大旗杆多高？', en: 'Zhao Yun measures the flag height using shadows. Small pole: height {p} m, shadow {r} m. Large pole shadow: {q} m. How tall is the flagpole?' },
    description: { zh: '△ABC ~ △DEF，$AB={p}$，$BC={q}$，$DE={r}$，求 $EF=x$。', en: '△ABC ~ △DEF, $AB={p}$, $BC={q}$, $DE={r}$. Find $EF=x$.' },
    data: { p: 4, q: 6, r: 8, generatorType: 'SIMILAR_TRIANGLES_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-4.4-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云："为什么相似三角形能测量遥远的距离？\n\n古人没有现代测量工具，但他们发现：阳光下，同一时刻所有物体的「影子/高度」比值相同。\n一根 4 米的竹竿影长 8 米——这个比值就是「相似比」。\n只要知道另一个物体的影长，就能算出它的真实高度！"', en: 'Zhao Yun: "Why can similar triangles measure distant objects?\n\nAncient surveyors discovered: at the same moment, every object has the same shadow-to-height ratio.\nA 4m pole casts an 8m shadow — that ratio IS the similarity ratio.\nKnowing the large pole\'s shadow length lets you calculate its true height!"' }, highlightField: 'x' },
      { text: { zh: '赵云："认识相似三角形：△ABC ~ △DEF 意味着\n• 三组角完全对应（角A=角D，角B=角E，角C=角F）\n• 三组对应边的比值相同：$\\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{CA}{FD}$\n已知：$AB=4$，$BC=6$，$DE=8$，求 $EF=x$。"', en: 'Zhao Yun: "△ABC ~ △DEF means:\n• Three pairs of equal angles (A=D, B=E, C=F)\n• All pairs of corresponding sides share the same ratio: $\\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{CA}{FD}$\nGiven: $AB=4$, $BC=6$, $DE=8$. Find $EF=x$."' }, highlightField: 'x' },
      { text: { zh: '赵云："读取数据\n△ABC：$AB = 4$，$BC = 6$\n△DEF：$DE = 8$（对应 AB），$EF = x$（对应 BC，待求）"', en: 'Zhao Yun: "Read the data\n△ABC: $AB = 4$, $BC = 6$\n△DEF: $DE = 8$ (corresponds to AB), $EF = x$ (corresponds to BC, unknown)"' }, highlightField: 'x' },
      { text: { zh: '赵云："第一步——求相似比（scale factor）\n$AB$ 对应 $DE$：\n$$k = \\frac{DE}{AB} = \\frac{8}{4} = 2$$\n△DEF 是 △ABC 的 2 倍大！"', en: 'Zhao Yun: "Step 1 — find the scale factor\n$AB$ corresponds to $DE$:\n$$k = \\frac{DE}{AB} = \\frac{8}{4} = 2$$\n△DEF is 2 times larger than △ABC!"' }, highlightField: 'x' },
      { text: { zh: '赵云："第二步——用相似比求未知边\n$BC$ 对应 $EF$，同乘放大倍数：\n$$x = EF = BC \\times k = 6 \\times 2 = 12$$\n答案：$x = 12$"', en: 'Zhao Yun: "Step 2 — use scale factor to find unknown side\n$BC$ corresponds to $EF$, multiply by scale factor:\n$$x = EF = BC \\times k = 6 \\times 2 = 12$$\nAnswer: $x = 12$"' }, highlightField: 'x' },
      { text: { zh: '赵云："验算——检查对应比值是否相等\n$$\\frac{DE}{AB} = \\frac{8}{4} = 2 \\checkmark$$\n$$\\frac{EF}{BC} = \\frac{12}{6} = 2 \\checkmark$$\n两个比值相等，△ABC ~ △DEF 验证成功！"', en: 'Zhao Yun: "Verify — check corresponding ratios are equal\n$$\\frac{DE}{AB} = \\frac{8}{4} = 2 \\checkmark$$\n$$\\frac{EF}{BC} = \\frac{12}{6} = 2 \\checkmark$$\nBoth ratios match — △ABC ~ △DEF confirmed!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '相似三角形的对应边成比例。找出 scale factor，再乘以对应边即可。', en: 'Corresponding sides of similar triangles are proportional. Find the scale factor, multiply.' }, formula: '$\\frac{DE}{AB} = \\frac{EF}{BC} = k$', tips: [{ zh: '赵云提示：先找 scale factor，再用它求所有未知边！', en: 'Zhao Yun Tip: Find scale factor first, then use it for all unknown sides!' }] },
    storyConsequence: { correct: { zh: '影子量旗——相似三角形运用完美！做得漂亮！', en: 'Shadow Flagpole — Similar triangles nailed! Well done!' }, wrong: { zh: '相似比算错了…再试一次！', en: 'Similar triangle ratio wrong... Try again!' } }
  },
  {
    id: 934, grade: 9, unitId: 3, order: 4,
    unitTitle: { zh: "Unit 3: 阵法与相似", en: "Unit 3: Formations & Similarity" },
    topic: 'Geometry', type: 'SIMILAR_TRIANGLES',
    title: { zh: '塔楼测高', en: 'Tower Height' },
    skillName: { zh: '相似三角形进阶', en: 'Similar Triangles Advanced' },
    skillSummary: { zh: '相似比 k = DE/AB，求 x = BC × k', en: 'Scale factor k = DE/AB, find x = BC × k' },
    story: { zh: '诸葛亮测量两座相似烽火台。小烽火台 $AB = {p}$，$BC = {q}$；大烽火台 $DE = {r}$，求 $EF = x$。', en: 'Zhuge Liang measures two similar beacon towers. Small tower: $AB = {p}$, $BC = {q}$. Large tower: $DE = {r}$. Find $EF = x$.' },
    description: { zh: '△ABC ~ △DEF，$AB={p}$，$BC={q}$，$DE={r}$，求 $EF=x$。', en: '△ABC ~ △DEF, $AB={p}$, $BC={q}$, $DE={r}$. Find $EF=x$.' },
    data: { p: 5, q: 9, r: 10, generatorType: 'SIMILAR_TRIANGLES_RANDOM' }, difficulty: 'Hard', reward: 260,
    kpId: 'kp-4.4-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么需要进阶练习？相似三角形在建筑、测量、工程中无处不在——掌握它等于获得了一件万能测量武器。形状相同的三角形，对应边之比永远相等。"', en: 'Zhuge Liang: "Why practice more? Similar triangles appear everywhere — architecture, surveying, engineering. Master this and you have a universal measuring tool. Same shape triangles always have equal corresponding side ratios."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："△ABC ~ △DEF 表示：角A=角D，角B=角E，角C=角F。\n已知：$AB = 5$，$BC = 9$，$DE = 10$，求 $EF = x$。\n$AB$ 对应 $DE$（都是第一条边），$BC$ 对应 $EF$（都是第二条边）。"', en: 'Zhuge Liang: "△ABC ~ △DEF means: ∠A=∠D, ∠B=∠E, ∠C=∠F.\nGiven: $AB = 5$, $BC = 9$, $DE = 10$. Find $EF = x$.\n$AB$ corresponds to $DE$ (both first sides), $BC$ corresponds to $EF$ (both second sides)."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："求相似比：\n$$k = \\frac{DE}{AB} = \\frac{10}{5} = 2$$\n△DEF 是 △ABC 的 2 倍大。"', en: 'Zhuge Liang: "Find scale factor:\n$$k = \\frac{DE}{AB} = \\frac{10}{5} = 2$$\n△DEF is 2 times △ABC."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："用相似比求未知边：\n$$x = EF = BC \\times k = 9 \\times 2 = 18$$"', en: 'Zhuge Liang: "Apply scale factor to find unknown:\n$$x = EF = BC \\times k = 9 \\times 2 = 18$$"' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："答案：$x = 18$。"', en: 'Zhuge Liang: "Answer: $x = 18$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："验算（两种方法）：\n方法一：$\\frac{DE}{AB} = \\frac{10}{5} = 2$，$\\frac{EF}{BC} = \\frac{18}{9} = 2$ ✓ 相等！\n方法二：比例方程 $\\frac{5}{10} = \\frac{9}{x}$ → $5x = 90$ → $x = 18$ ✓ 一致！"', en: 'Zhuge Liang: "Check (two methods):\nMethod 1: $\\frac{DE}{AB} = \\frac{10}{5} = 2$, $\\frac{EF}{BC} = \\frac{18}{9} = 2$ ✓ Equal!\nMethod 2: proportion $\\frac{5}{10} = \\frac{9}{x}$ → $5x = 90$ → $x = 18$ ✓ Matches!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '相似比 k = 大三角形对应边 ÷ 小三角形对应边。', en: 'Scale factor k = large triangle side ÷ corresponding small triangle side.' }, formula: '$k = \\frac{DE}{AB},\\quad x = BC \\times k$', tips: [{ zh: '诸葛亮提示：相似比确定后，所有对应边都用同一个 k。', en: 'Zhuge Liang Tip: Once the scale factor is found, use the same k for all corresponding sides.' }] },
    storyConsequence: { correct: { zh: '塔楼测高——相似三角形大成！妙！', en: 'Tower Height — Similar triangles mastered!' }, wrong: { zh: '对应边搞错了…再试一次！', en: 'Wrong corresponding sides... Try again!' } }
  },
  {
    id: 941, grade: 9, unitId: 4, order: 1,
    unitTitle: { zh: "Unit 4: 军备与比率", en: "Unit 4: Armaments & Ratio" },
    topic: 'Algebra', type: 'RATIO',
    title: { zh: '兵粮配给', en: 'Rationing' },
    skillName: { zh: '兵粮配比术', en: 'Supply Ratio' },
    skillSummary: { zh: '比例 a:b 求未知项', en: 'Find unknown in ratio a:b' },
    story: { zh: '曹操下令：前锋营和后勤营的粮草按 {a}:{b} 配给。根据前锋营已领的量，算出后勤营应领多少。分少了后勤罢工，分多了前锋挨饿。', en: 'Cao Cao orders: vanguard and logistics camps share grain at {a}:{b} ratio. Given the vanguard\'s amount, calculate how much logistics should receive. Too little and they revolt, too much and the vanguard starves.' },
    description: { zh: '求所需粮草 $y$（即 $1000:y = 2:5$）。', en: 'Find grain $y$ (i.e., $1000:y = 2:5$).' },
    data: { a: 2, b: 5, generatorType: 'RATIO_RANDOM' }, difficulty: 'Medium', reward: 240,
    kpId: 'kp-1.12-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '李典："为什么粮草不能随便分？分少了后勤罢工，分多了前锋挨饿——比例就是确保公平的数学工具。2:5 意味着前锋每领 2 份，后勤就要领 5 份。"', en: 'Li Dian: "Why can\'t we split grain randomly? Too little and logistics revolts, too much and the vanguard starves — ratio is the math tool for fairness. 2:5 means for every 2 shares the vanguard gets, logistics gets 5."' },
        highlightField: 'x'
      },
      {
        text: { zh: '李典："比例像个放大器：2:5 可以放大成 4:10、6:15、1000:?——关键是找到放大了多少倍。"', en: 'Li Dian: "A ratio is like a multiplier: 2:5 can become 4:10, 6:15, 1000:? — the key is finding how many times it was scaled up."' },
        highlightField: 'x'
      },
      {
        text: { zh: '李典："求倍数：前锋的 2 份变成了 1000，放大了 $1000 \\div 2 = 500$ 倍。"', en: 'Li Dian: "Find the multiplier: vanguard\'s 2 became 1000, scaled by $1000 \\div 2 = 500$ times."' },
        highlightField: 'y'
      },
      {
        text: { zh: '李典："后勤也要放大同样倍数：$y = 5 \\times 500 = 2500$。"', en: 'Li Dian: "Logistics scales the same way: $y = 5 \\times 500 = 2500$."' },
        highlightField: 'y'
      },
      {
        text: { zh: '李典："答案：$y = 2500$ 石。"', en: 'Li Dian: "Answer: $y = 2500$ units."' },
        highlightField: 'y'
      },
      {
        text: { zh: '李典："验算：$1000:2500$，两边同除 500 得 $2:5$。✓ 比例一致！后勤保障，重中之重。"', en: 'Li Dian: "Check: $1000:2500$, divide both by 500 to get $2:5$. ✓ Ratio matches! Logistics secured."' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '比例式中，内项之积等于外项之积。', en: 'In a proportion, the product of means equals the product of extremes.' }, formula: '$2y = 5000 \\Rightarrow y = 2500$', tips: [{ zh: '李典提示：后勤保障，重中之重。', en: 'Li Dian Tip: Logistics is the top priority.' }] },
    storyConsequence: { correct: { zh: '兵粮配给——比例搞定！做得漂亮！', en: 'Rationing — Well done!' }, wrong: { zh: '比例没算对…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 942, grade: 9, unitId: 4, order: 2,
    unitTitle: { zh: "Unit 4: 军备与比率", en: "Unit 4: Armaments & Ratio" },
    topic: 'Algebra', type: 'RATIO',
    title: { zh: '混合阵法', en: 'Mixed Formation' },
    skillName: { zh: '兵种混编术', en: 'Troop Mix' },
    skillSummary: { zh: '交叉相乘法', en: 'Cross multiplication' },
    story: { zh: '周瑜组建混合部队：每 {a} 名步兵配 {b} 名骑兵。步兵已有若干人，需要多少骑兵？比例不对阵法就散了。', en: 'Zhou Yu assembles a mixed force: {a} infantry for every {b} cavalry. Calculate the cavalry needed based on infantry count. Wrong ratio and the formation falls apart.' },
    description: { zh: '求骑兵数量 $y$。', en: 'Find cavalry count $y$.' },
    data: { a: 3, b: 1, generatorType: 'RATIO_RANDOM' }, difficulty: 'Medium', reward: 260,
    kpId: 'kp-1.12-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '曹纯："为什么阵法要讲比例？骑兵太多浪费战马，太少突击力不足——3 名步兵配 1 名骑兵，是虎豹骑经过百战验证的黄金比例。"', en: 'Cao Chun: "Why does formation need ratios? Too many cavalry wastes horses, too few lacks punch — 3 infantry to 1 cavalry is the Tiger Cavalry\'s battle-tested golden ratio."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹纯："比例 3:1 是一个「小队模型」：每 3 个步兵搭配 1 个骑兵。现在要把这个模型放大到 900 名步兵的规模。"', en: 'Cao Chun: "Ratio 3:1 is a \'squad model\': every 3 infantry paired with 1 cavalry. Now we scale this model up to 900 infantry."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹纯："求有多少个小队：$900 \\div 3 = 300$ 个小队。"', en: 'Cao Chun: "Find the number of squads: $900 \\div 3 = 300$ squads."' },
        highlightField: 'y'
      },
      {
        text: { zh: '曹纯："每个小队配 1 名骑兵：$y = 1 \\times 300 = 300$。"', en: 'Cao Chun: "Each squad gets 1 cavalry: $y = 1 \\times 300 = 300$."' },
        highlightField: 'y'
      },
      {
        text: { zh: '曹纯："答案：$y = 300$ 名骑兵。"', en: 'Cao Chun: "Answer: $y = 300$ cavalry."' },
        highlightField: 'y'
      },
      {
        text: { zh: '曹纯："验算：$900:300$，两边同除 300 得 $3:1$。✓ 比例一致！虎豹骑出击，势不可挡！"', en: 'Cao Chun: "Check: $900:300$, divide both by 300 to get $3:1$. ✓ Ratio matches! Tiger Cavalry strikes, unstoppable!"' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '比例的基本性质。', en: 'Basic properties of ratios.' }, formula: '$3:1 = 900:y$', tips: [{ zh: "曹纯提示：虎豹骑出击，势不可挡！", en: "Cao Chun Tip: When the Tiger and Leopard Cavalry strikes, it's unstoppable!" }] },
    storyConsequence: { correct: { zh: '混合阵法——比例搞定！做得漂亮！', en: 'Mixed Formation — Well done!' }, wrong: { zh: '比例没算对…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Year 9 Unit 5-6: Guandu Espionage — Coordinate Geometry ---
  {
    id: 951, grade: 9, unitId: 5, order: 1,
    unitTitle: { zh: "Unit 5: 密探坐标·情报网", en: "Unit 5: Spy Coordinates — Intelligence Network" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '官渡暗桩', en: 'Guandu Spy Posts' },
    skillName: { zh: '坐标定位术', en: 'Coordinate Plotting' },
    skillSummary: { zh: '在坐标系中读取和标注点', en: 'Read and plot points on coordinate axes' },
    story: { zh: '官渡之战前夕，贾诩在敌营布下暗桩。每个密探的位置用坐标标记在地图上。', en: 'Before the Battle of Guandu, Jia Xu plants spies in the enemy camp. Each spy\'s position is marked on a coordinate map.' },
    description: { zh: '密探在地图上的坐标是 $({targetX}, {targetY})$，标出该位置。', en: 'The spy\'s coordinate on the map is $({targetX}, {targetY})$. Plot the position.' },
    data: { targetX: 3, targetY: 4, generatorType: 'COORDINATES_RANDOM' }, difficulty: 'Easy', reward: 120,
    kpId: 'kp-3.1-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '贾诩：为什么要用坐标？\n战场就像一张棋盘——光说"在东边"太模糊，必须精确到"东 3 步、北 4 步"。\n坐标系就是给战场画上网格线，每个位置都有唯一的"门牌号"：$(x, y)$。', en: 'Jia Xu: "Why use coordinates?\nA battlefield is like a chessboard — saying \'to the east\' is too vague. We need \'3 steps east, 4 steps north\'.\nCoordinates put a grid on the battlefield — every position gets a unique \'address\': $(x, y)$."' }, highlightField: 'x' },
      { text: { zh: '贾诩：什么是 $x$ 和 $y$？\n$x$ = 左右位置（正数往右，负数往左）\n$y$ = 上下位置（正数往上，负数往下）\n\n$(3, 4)$ 就是"从原点往右走 3 格，再往上走 4 格"。', en: 'Jia Xu: "What are $x$ and $y$?\n$x$ = left-right position (positive = right, negative = left)\n$y$ = up-down position (positive = up, negative = down)\n\n$(3, 4)$ means \'from the origin, go 3 right and 4 up\'."' }, highlightField: 'x' },
      { text: { zh: '贾诩：怎么找到点？\n第 1 步：从原点 $(0,0)$ 出发\n第 2 步：沿 $x$ 轴走 ${targetX}$ 格（往右）\n第 3 步：沿 $y$ 轴走 ${targetY}$ 格（往上）\n到了！', en: 'Jia Xu: "How to locate the point?\nStep 1: Start at origin $(0,0)$\nStep 2: Move ${targetX}$ along the $x$-axis (right)\nStep 3: Move ${targetY}$ along the $y$-axis (up)\nYou\'re there!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：所以密探的坐标\n$x = {targetX}$，$y = {targetY}$\n位置确认：$({targetX}, {targetY})$', en: 'Jia Xu: "So the spy\'s coordinates are\n$x = {targetX}$, $y = {targetY}$\nPosition confirmed: $({targetX}, {targetY})$"' }, highlightField: 'x' },
      { text: { zh: '贾诩：答案\n$x = {targetX}$，$y = {targetY}$\n暗桩就位，情报网启动！', en: 'Jia Xu: "Answer\n$x = {targetX}$, $y = {targetY}$\nSpy in position — intelligence network activated!"' }, highlightField: 'y' },
      { text: { zh: '贾诩：验算\n从原点出发：右走 ${targetX}$ → 上走 ${targetY}$ → 到达 $({targetX}, {targetY})$ ✓\n反过来：从 $({targetX}, {targetY})$ 左走 ${targetX}$、下走 ${targetY}$ 回到原点 ✓ 定位精准！', en: 'Jia Xu: "Verify\nFrom origin: right ${targetX}$ → up ${targetY}$ → reach $({targetX}, {targetY})$ ✓\nReverse: from $({targetX}, {targetY})$ left ${targetX}$, down ${targetY}$ back to origin ✓ Pinpoint accuracy!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '坐标系中每个点由 $(x, y)$ 唯一确定。$x$ 是水平位置，$y$ 是垂直位置。', en: 'Every point in the coordinate system is uniquely determined by $(x, y)$. $x$ is horizontal, $y$ is vertical.' }, formula: '$(x, y)$', tips: [{ zh: '贾诩提示：坐标就是战场上的门牌号，精确到每一格。', en: 'Jia Xu Tip: Coordinates are the addresses on the battlefield — precise to every grid square.' }] },
    storyConsequence: { correct: { zh: '官渡暗桩——坐标精准！做得漂亮！', en: 'Guandu Spy Posts — Well done!' }, wrong: { zh: '坐标定位有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 952, grade: 9, unitId: 5, order: 2,
    unitTitle: { zh: "Unit 5: 密探坐标·情报网", en: "Unit 5: Spy Coordinates — Intelligence Network" },
    topic: 'Algebra', type: 'LINEAR',
    title: { zh: '密道斜率', en: 'Secret Tunnel Gradient' },
    skillName: { zh: '斜率计算术', en: 'Gradient Calculation' },
    skillSummary: { zh: '用两点求直线斜率 m = (y2-y1)/(x2-x1)', en: 'Find gradient from two points: m = (y2-y1)/(x2-x1)' },
    story: { zh: '两个密探哨所之间有一条秘密通道。需要计算通道的坡度（斜率），确保运送物资顺畅。', en: 'A secret tunnel connects two spy outposts. Calculate the tunnel\'s slope (gradient) to ensure smooth supply transport.' },
    description: { zh: '求经过两点的直线的斜率 $m$ 和截距 $c$。', en: 'Find the gradient $m$ and intercept $c$ of the line through two points.' },
    data: { points: [[1, 3], [3, 7]], generatorType: 'LINEAR_RANDOM' }, difficulty: 'Medium', reward: 160,
    kpId: 'kp-3.3-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '贾诩：为什么要学斜率？\n你走上坡路——坡越陡，走一步上升越多。\n斜率就是衡量"陡不陡"的数。密道的坡度决定了运送速度！', en: 'Jia Xu: "Why learn gradients?\nWalking uphill — the steeper it is, the more you rise per step.\nGradient measures this \'steepness\'. The tunnel\'s slope determines supply speed!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：斜率公式\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$\n上面 = 垂直变化（上升了多少）\n下面 = 水平变化（前进了多少）', en: 'Jia Xu: "The gradient formula\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$\nTop = vertical change (rise)\nBottom = horizontal change (run)"' }, highlightField: 'm' },
      { text: { zh: '贾诩：代入两个哨所的坐标\n哨所 A = $({points[0][0]}, {points[0][1]})$，哨所 B = $({points[1][0]}, {points[1][1]})$\n$m = \\frac{{points[1][1]} - {points[0][1]}}{{points[1][0]} - {points[0][0]}}$', en: 'Jia Xu: "Substitute the outpost coordinates\nOutpost A = $({points[0][0]}, {points[0][1]})$, Outpost B = $({points[1][0]}, {points[1][1]})$\n$m = \\frac{{points[1][1]} - {points[0][1]}}{{points[1][0]} - {points[0][0]}}$"' }, highlightField: 'm' },
      { text: { zh: '贾诩：计算\n分子：${points[1][1]} - {points[0][1]}$ = 垂直变化\n分母：${points[1][0]} - {points[0][0]}$ = 水平变化\n一除就得到斜率 $m$！', en: 'Jia Xu: "Calculate\nNumerator: ${points[1][1]} - {points[0][1]}$ = rise\nDenominator: ${points[1][0]} - {points[0][0]}$ = run\nDivide to get gradient $m$!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：再求截距 $c$\n把 $m$ 和任一点代入 $y = mx + c$，解出 $c$。', en: 'Jia Xu: "Now find intercept $c$\nSubstitute $m$ and any point into $y = mx + c$, solve for $c$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：验算\n把两个哨所坐标分别代入 $y = mx + c$，看是否成立。\n密道坡度确认，物资运送畅通！', en: 'Jia Xu: "Verify\nSubstitute both outpost coordinates into $y = mx + c$ to check.\nTunnel gradient confirmed — supplies flow smoothly!"' }, highlightField: 'm' },
    ],
    secret: { concept: { zh: '斜率 = 垂直变化 ÷ 水平变化。正斜率上升，负斜率下降，零斜率水平。', en: 'Gradient = rise ÷ run. Positive = uphill, negative = downhill, zero = flat.' }, formula: '$m = \\frac{y_2 - y_1}{x_2 - x_1}$', tips: [{ zh: '贾诩提示：密道的坡度，决定了运送的成败。', en: 'Jia Xu Tip: The tunnel\'s slope determines the success of the supply run.' }] },
    storyConsequence: { correct: { zh: '密道斜率——直线方程搞定！做得漂亮！', en: 'Secret Tunnel Gradient — Well done!' }, wrong: { zh: '直线方程有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 953, grade: 9, unitId: 5, order: 3,
    unitTitle: { zh: "Unit 5: 密探坐标·情报网", en: "Unit 5: Spy Coordinates — Intelligence Network" },
    topic: 'Algebra', type: 'LINEAR',
    title: { zh: '撤退路线', en: 'Escape Route Equation' },
    skillName: { zh: '直线方程术', en: 'Line Equation' },
    skillSummary: { zh: '写出 y = mx + c 形式的直线方程', en: 'Write line equation in y = mx + c form' },
    story: { zh: '密探暴露，需要紧急撤退！根据两个安全点的坐标，规划一条直线撤退路线。', en: 'The spy is exposed and needs to escape! Plan a straight-line escape route through two safe points.' },
    description: { zh: '求直线方程 $y = mx + c$，其中 $m$ 是斜率，$c$ 是截距。', en: 'Find the equation $y = mx + c$ where $m$ is the gradient and $c$ is the intercept.' },
    data: { points: [[0, 2], [3, 8]], generatorType: 'LINEAR_RANDOM' }, difficulty: 'Hard', reward: 200,
    kpId: 'kp-3.5-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '贾诩：为什么需要直线方程？\n知道两个安全点还不够——撤退路线上的每个位置都要能算出来。\n$y = mx + c$ 就是"万能导航公式"：给任何 $x$，都能算出 $y$。', en: 'Jia Xu: "Why do we need the line equation?\nKnowing two safe points isn\'t enough — we need every position along the route.\n$y = mx + c$ is the \'universal navigation formula\': give any $x$, get $y$."' }, highlightField: 'm' },
      { text: { zh: '贾诩：第一步——求斜率 $m$\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$\n代入两个安全点的坐标。', en: 'Jia Xu: "Step 1 — find gradient $m$\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$\nSubstitute the two safe point coordinates."' }, highlightField: 'm' },
      { text: { zh: '贾诩：第二步——求截距 $c$\n$m$ 已知，选任一点代入 $y = mx + c$，解出 $c$。\n截距就是路线的"起始高度"——$x = 0$ 时 $y$ 的值。', en: 'Jia Xu: "Step 2 — find intercept $c$\n$m$ is known. Substitute any point into $y = mx + c$ and solve for $c$.\nThe intercept is the route\'s \'starting height\' — the value of $y$ when $x = 0$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：代入计算\n用点 $({points[0][0]}, {points[0][1]})$：\n${points[0][1]} = m \\times {points[0][0]} + c$\n解出 $c$。', en: 'Jia Xu: "Substitute and calculate\nUsing point $({points[0][0]}, {points[0][1]})$:\n${points[0][1]} = m \\times {points[0][0]} + c$\nSolve for $c$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：答案\n撤退路线方程：$y = mx + c$\n有了这个方程，路线上任何位置都可以精确定位！', en: 'Jia Xu: "Answer\nEscape route equation: $y = mx + c$\nWith this equation, every position on the route can be precisely located!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：验算\n把两个安全点都代入方程，看 $y$ 值是否匹配。\n两点都在线上 ✓ 撤退路线确认！密探安全撤离！', en: 'Jia Xu: "Verify\nSubstitute both safe points — check if $y$ values match.\nBoth points on the line ✓ Escape route confirmed! Spy safely extracted!"' }, highlightField: 'm' },
    ],
    secret: { concept: { zh: '直线方程 $y = mx + c$：$m$ 是斜率（多陡），$c$ 是截距（起点高度）。两个点就能确定唯一一条直线。', en: 'Line equation $y = mx + c$: $m$ = gradient (steepness), $c$ = intercept (starting height). Two points determine a unique line.' }, formula: '$y = mx + c$', tips: [{ zh: '贾诩提示：两个点定一条线，密探的生命线。', en: 'Jia Xu Tip: Two points define a line — the spy\'s lifeline.' }] },
    storyConsequence: { correct: { zh: '撤退路线——直线方程搞定！做得漂亮！', en: 'Escape Route Equation — Well done!' }, wrong: { zh: '直线方程有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 961, grade: 9, unitId: 6, order: 1,
    unitTitle: { zh: "Unit 6: 斜率密信·平行渗透", en: "Unit 6: Gradient Cipher — Parallel Infiltration" },
    topic: 'Algebra', type: 'LINEAR',
    title: { zh: '平行密道', en: 'Parallel Tunnels' },
    skillName: { zh: '平行判定术', en: 'Parallel Line Check' },
    skillSummary: { zh: '平行线斜率相等', en: 'Parallel lines have equal gradients' },
    story: { zh: '袁绍修建了两条平行的运粮通道。贾诩要验证它们是否真的平行——关键是比较斜率！', en: 'Yuan Shao built two parallel supply tunnels. Jia Xu must verify they\'re truly parallel — the key is comparing gradients!' },
    description: { zh: '求两条直线的斜率 $m$ 和截距 $c$。', en: 'Find the gradient $m$ and intercept $c$ of the line.' },
    data: { points: [[0, 1], [2, 5]], generatorType: 'LINEAR_RANDOM' }, difficulty: 'Easy', reward: 140,
    kpId: 'kp-3.3-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要学平行线？\n两条道路永远不交叉——平行线性质决定了角的关系。\n掌握了同位角、内错角，就能破解任何几何迷阵！', en: 'Zhuge Liang: "Why learn parallel lines?\nTwo roads that never cross — parallel line properties determine angle relationships.\nMaster corresponding and alternate angles, and you can solve any geometric puzzle!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：判断平行的方法\n分别算出两条线的斜率 $m_1$ 和 $m_2$：\n如果 $m_1 = m_2$ → 平行 ✓\n如果 $m_1 \\neq m_2$ → 不平行 ✗', en: 'Jia Xu: "How to check for parallel lines\nCalculate both gradients $m_1$ and $m_2$:\nIf $m_1 = m_2$ → parallel ✓\nIf $m_1 \\neq m_2$ → not parallel ✗"' }, highlightField: 'm' },
      { text: { zh: '贾诩：先算这条线的斜率\n用斜率公式 $m = \\frac{y_2 - y_1}{x_2 - x_1}$\n代入给定的两个坐标点。', en: 'Jia Xu: "First calculate this line\'s gradient\nUsing $m = \\frac{y_2 - y_1}{x_2 - x_1}$\nSubstitute the two given coordinate points."' }, highlightField: 'm' },
      { text: { zh: '贾诩：再求截距 $c$\n把 $m$ 和一个点代入 $y = mx + c$，解出 $c$。', en: 'Jia Xu: "Then find intercept $c$\nSubstitute $m$ and one point into $y = mx + c$, solve for $c$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：答案\n$m$ 和 $c$ 的值确认。如果另一条通道的斜率也等于 $m$，它们就平行！', en: 'Jia Xu: "Answer\n$m$ and $c$ values confirmed. If the other tunnel has the same gradient $m$, they\'re parallel!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：验算\n代入两个坐标点检查方程是否成立 ✓\n平行判定完成——渗透路线安全！', en: 'Jia Xu: "Verify\nSubstitute both points to check the equation ✓\nParallel check complete — infiltration route is safe!"' }, highlightField: 'm' },
    ],
    secret: { concept: { zh: '平行线斜率相等：$m_1 = m_2$ 则平行。这是判断平行的充要条件。', en: 'Parallel lines have equal gradients: $m_1 = m_2$ means parallel. This is both necessary and sufficient.' }, formula: '$m_1 = m_2 \\Leftrightarrow \\text{parallel}$', tips: [{ zh: '贾诩提示：斜率相同就是平行——运粮通道的生命保障。', en: 'Jia Xu Tip: Equal gradient means parallel — the lifeline of supply tunnels.' }] },
    storyConsequence: { correct: { zh: '平行密道——直线方程搞定！做得漂亮！', en: 'Parallel Tunnels — Well done!' }, wrong: { zh: '直线方程有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 962, grade: 9, unitId: 6, order: 2,
    unitTitle: { zh: "Unit 6: 斜率密信·平行渗透", en: "Unit 6: Gradient Cipher — Parallel Infiltration" },
    topic: 'Algebra', type: 'LINEAR',
    title: { zh: '补给起点', en: 'Supply Origin' },
    skillName: { zh: 'y 截距术', en: 'Y-Intercept' },
    skillSummary: { zh: '求直线在 y 轴上的截距', en: 'Find where the line crosses the y-axis' },
    story: { zh: '补给线从某个渡口出发。已知路线经过两个驿站，求补给线的起始渡口位置（y 截距）。', en: 'The supply line starts from a ferry crossing. Given two relay stations on the route, find the starting ferry position (y-intercept).' },
    description: { zh: '求直线的斜率 $m$ 和截距 $c$（$y$ 轴交点）。', en: 'Find the gradient $m$ and intercept $c$ (where the line crosses the $y$-axis).' },
    data: { points: [[2, 5], [4, 9]], generatorType: 'LINEAR_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-3.5-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要求 $y$ 截距？\n$y$ 截距就是起点——行军从哪里出发。\n知道了起点和斜率，就能画出整条路线！', en: 'Zhuge Liang: "Why find the y-intercept?\nThe y-intercept is the starting point — where the march begins.\nKnow the start and the slope, and you can trace the entire route!"' }, highlightField: 'c' },
      { text: { zh: '贾诩：怎么求 $y$ 截距？\n第 1 步：先用两个驿站坐标求斜率 $m$\n第 2 步：把 $m$ 和任一点代入 $y = mx + c$，解出 $c$', en: 'Jia Xu: "How to find the y-intercept?\nStep 1: Find gradient $m$ from the two relay stations\nStep 2: Substitute $m$ and any point into $y = mx + c$, solve for $c$"' }, highlightField: 'c' },
      { text: { zh: '贾诩：第 1 步——求斜率\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$\n代入两个驿站的坐标。', en: 'Jia Xu: "Step 1 — find gradient\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$\nSubstitute the two relay station coordinates."' }, highlightField: 'm' },
      { text: { zh: '贾诩：第 2 步——求截距\n把 $m$ 和点代入：$y = mx + c$\n移项得 $c = y - mx$。', en: 'Jia Xu: "Step 2 — find intercept\nSubstitute $m$ and the point: $y = mx + c$\nRearrange: $c = y - mx$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：答案\n$m$ 和 $c$ 确认。\n$c$ 就是渡口位置——补给线的起点！', en: 'Jia Xu: "Answer\n$m$ and $c$ confirmed.\n$c$ is the ferry position — the supply line\'s starting point!"' }, highlightField: 'c' },
      { text: { zh: '贾诩：验算\n两个驿站坐标代入 $y = mx + c$，等式成立 ✓\n补给线确认，渡口位置精准！', en: 'Jia Xu: "Verify\nBoth relay station coordinates satisfy $y = mx + c$ ✓\nSupply line confirmed, ferry position exact!"' }, highlightField: 'c' },
    ],
    secret: { concept: { zh: '$y$ 截距是直线穿过 $y$ 轴的点，即 $x = 0$ 时 $y$ 的值。$y = mx + c$ 中的 $c$ 就是截距。', en: 'The y-intercept is where the line crosses the y-axis (when $x = 0$). In $y = mx + c$, $c$ is the intercept.' }, formula: '$c = y - mx$', tips: [{ zh: '贾诩提示：截距是起点，斜率是方向——两个定了，路线就定了。', en: 'Jia Xu Tip: Intercept is the start, gradient is the direction — fix both and the route is set.' }] },
    storyConsequence: { correct: { zh: '补给起点——直线方程搞定！做得漂亮！', en: 'Supply Origin — Well done!' }, wrong: { zh: '直线方程有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 963, grade: 9, unitId: 6, order: 3,
    unitTitle: { zh: "Unit 6: 斜率密信·平行渗透", en: "Unit 6: Gradient Cipher — Parallel Infiltration" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '会合点', en: 'Rendezvous Point' },
    skillName: { zh: '中点公式术', en: 'Midpoint Formula' },
    skillSummary: { zh: '求两点的中点坐标', en: 'Find the midpoint of two points' },
    story: { zh: '两支密探小队要在两个据点的正中间会合。求会合点的精确坐标。', en: 'Two spy squads will rendezvous exactly halfway between two bases. Find the exact coordinates of the meeting point.' },
    description: { zh: '求两点 $A$ 和 $B$ 的中点坐标 $(x, y)$。', en: 'Find the midpoint coordinates $(x, y)$ of points $A$ and $B$.' },
    data: { targetX: 3, targetY: 5, generatorType: 'COORDINATES_RANDOM' }, difficulty: 'Hard', reward: 200,
    kpId: 'kp-3.4-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要学中点公式？\n两支军队要在中间会合——中点就是最公平的汇合点。\n坐标的中点 = 两端坐标的平均值，简单又精准！', en: 'Zhuge Liang: "Why learn the midpoint formula?\nTwo armies must meet in the middle — the midpoint is the fairest meeting place.\nMidpoint coordinates = average of both endpoints, simple and precise!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：中点公式\n$$\\text{中点} = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$\n就是把两个 $x$ 加起来除以 2，两个 $y$ 加起来除以 2。\n"取平均值"——这就是"中间"的数学含义！', en: 'Jia Xu: "The midpoint formula\n$$\\text{midpoint} = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$\nAdd the two $x$\'s and halve, add the two $y$\'s and halve.\n\'Average\' — that\'s the math meaning of \'middle\'!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：代入坐标\n据点 A 和 据点 B 的坐标已知，\n中点 $x = \\frac{x_1 + x_2}{2}$\n中点 $y = \\frac{y_1 + y_2}{2}$', en: 'Jia Xu: "Substitute coordinates\nBase A and Base B coordinates are known,\nMidpoint $x = \\frac{x_1 + x_2}{2}$\nMidpoint $y = \\frac{y_1 + y_2}{2}$"' }, highlightField: 'x' },
      { text: { zh: '贾诩：计算\n$x$ 坐标的平均值和 $y$ 坐标的平均值分别计算。', en: 'Jia Xu: "Calculate\nAverage the $x$-coordinates and $y$-coordinates separately."' }, highlightField: 'x' },
      { text: { zh: '贾诩：答案\n会合点坐标 = $({targetX}, {targetY})$\n两队在此会合！', en: 'Jia Xu: "Answer\nRendezvous coordinates = $({targetX}, {targetY})$\nBoth squads meet here!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：验算\n中点到两个据点的距离应该相等。\n从中点到 A 的距离 = 从中点到 B 的距离 ✓ 位置精准！', en: 'Jia Xu: "Verify\nThe midpoint should be equidistant from both bases.\nDistance from midpoint to A = distance to B ✓ Precise positioning!"' }, highlightField: 'y' },
    ],
    secret: { concept: { zh: '中点 = 两点坐标分别取平均值。这是坐标几何中最基础的距离分割方法。', en: 'Midpoint = average of the two coordinates. This is the most fundamental distance-splitting method in coordinate geometry.' }, formula: '$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$', tips: [{ zh: '贾诩提示：取平均就是找中间，会合点从此确定。', en: 'Jia Xu Tip: Averaging finds the middle — the rendezvous point is set.' }] },
    storyConsequence: { correct: { zh: '会合点——坐标精准！做得漂亮！', en: 'Rendezvous Point — Well done!' }, wrong: { zh: '坐标定位有误…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Year 9 Unit 7: Guandu Preparations — Algebra Deepening ---
  {
    id: 971, grade: 9, unitId: 7, order: 1,
    unitTitle: { zh: "Unit 7: 铁匠铺·代数锻造", en: "Unit 7: Blacksmith's Forge — Algebraic Forging" },
    topic: 'Algebra', type: 'EXPAND',
    title: { zh: '批量锻兵', en: 'Mass Forging' },
    skillName: { zh: '展开括号术', en: 'Expanding Brackets' },
    skillSummary: { zh: 'a(bx + c) = abx + ac', en: 'a(bx + c) = abx + ac' },
    story: { zh: '铁匠铺要给 {a} 支小队锻造装备。每队需要刀和弓，展开计算总量。', en: 'The forge supplies {a} squads with weapons. Each squad needs swords and bows — expand to find totals.' },
    description: { zh: '展开 ${a}({b}x + {c})$，$x$ 的系数是多少？', en: 'Expand ${a}({b}x + {c})$. What is the coefficient of $x$?' },
    data: { a: 3, b: 2, c: 5, generatorType: 'EXPAND_RANDOM' }, difficulty: 'Easy', reward: 140,
    kpId: 'kp-2.2-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '荀彧：为什么要学展开括号？\n铁匠铺要给 3 支小队发装备。每队 2 把刀和 5 张弓。\n总共要多少？把每队的需求"拆开"——这就是展开！', en: 'Xun Yu: "Why learn to expand?\nThe forge supplies 3 squads. Each needs 2 swords and 5 bows.\nHow many total? \'Unpack\' each squad\'s needs — that\'s expanding!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：展开规则\n外面的数跟里面的**每一项**都乘一遍：\n$a(bx + c) = a \\times bx + a \\times c$\n不能漏掉任何一项！', en: 'Xun Yu: "Expanding rule\nThe outside number multiplies EVERY term inside:\n$a(bx + c) = a \\times bx + a \\times c$\nDon\'t skip any term!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：先算第一项\n外面 × 第一项：$a \\times bx$', en: 'Xun Yu: "First term\nOutside × first: $a \\times bx$"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：再算第二项\n外面 × 第二项：$a \\times c$', en: 'Xun Yu: "Second term\nOutside × second: $a \\times c$"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：答案\n$x$ 的系数 = $a \\times b$\n军需发放完毕！', en: 'Xun Yu: "Answer\nCoefficient of $x$ = $a \\times b$\nSupplies distributed!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：验算\n代入 $x = 1$ 检查两边是否相等 ✓', en: 'Xun Yu: "Verify\nSubstitute $x = 1$ and check both sides match ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '展开括号：外面的数和里面的每一项相乘。', en: 'Expand: multiply the outside by every term inside.' }, formula: '$a(bx+c) = abx + ac$', tips: [{ zh: '荀彧提示：展开就是"拆包裹"——每种物资都要点到。', en: 'Xun Yu Tip: Expanding is \'unpacking\' — count every item.' }] },
    storyConsequence: { correct: { zh: '批量锻兵——展开无误！做得漂亮！', en: 'Mass Forging — Well done!' }, wrong: { zh: '展开出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 972, grade: 9, unitId: 7, order: 2,
    unitTitle: { zh: "Unit 7: 铁匠铺·代数锻造", en: "Unit 7: Blacksmith's Forge — Algebraic Forging" },
    topic: 'Algebra', type: 'FACTORISE',
    title: { zh: '军需打包', en: 'Supply Bundling' },
    skillName: { zh: '因式分解术', en: 'Factorising' },
    skillSummary: { zh: '提取公因子', en: 'Extract common factor' },
    story: { zh: '大批军需散装在仓库，需要按"每队一份"重新打包。找出最大公因数就是关键！', en: 'Loose supplies in the warehouse need rebundling into squad packs. Finding the HCF is key!' },
    description: { zh: '因式分解 ${a}x + {b}$，最大公因数是？', en: 'Factorise ${a}x + {b}$. What is the HCF?' },
    data: { factor: 3, p: 2, q: 5, generatorType: 'FACTORISE_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-2.2-06', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要学因式分解？\n方程太复杂？把它拆成简单部分的乘积——\n就像把散兵收拢成整齐方阵，化繁为简是解方程的核心！', en: 'Zhuge Liang: "Why learn factorisation?\nEquation too complex? Break it into a product of simpler parts —\nLike regrouping scattered soldiers into formations, simplification is key!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：怎么找公因子？\n列出两个数的因数，找最大的公共因数。', en: 'Xun Yu: "How to find the common factor?\nList factors of both numbers, find the largest common one."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：用公因子去除每一项\n看是否整除——整除就说明打包完美！', en: 'Xun Yu: "Divide each term by the common factor\nIf both divide evenly — perfect bundling!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：拼起来\n公因子放外面，除完的放括号里。', en: 'Xun Yu: "Put it together\nCommon factor outside, quotients inside brackets."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：答案\n最大公因数确认！军需打包零失误！', en: 'Xun Yu: "Answer\nHCF confirmed! Zero packing errors!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：验算\n展开检查——打包再拆开，必须跟原来一样 ✓', en: 'Xun Yu: "Verify\nExpand to check — unpack and it must match the original ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '因式分解 = 展开的逆操作，提取公因子。', en: 'Factorising = reverse of expanding, extract common factor.' }, formula: '$ax + ay = a(x + y)$', tips: [{ zh: '荀彧提示：因式分解就是"重新打包"。', en: 'Xun Yu Tip: Factorising is \'rebundling\'.' }] },
    storyConsequence: { correct: { zh: '军需打包——因式分解完成！做得漂亮！', en: 'Supply Bundling — Well done!' }, wrong: { zh: '因式分解不完全…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 973, grade: 9, unitId: 7, order: 3,
    unitTitle: { zh: "Unit 7: 铁匠铺·代数锻造", en: "Unit 7: Blacksmith's Forge — Algebraic Forging" },
    topic: 'Algebra', type: 'INEQUALITY',
    title: { zh: '粮草底线', en: 'Supply Minimum' },
    skillName: { zh: '不等式术', en: 'Inequalities' },
    skillSummary: { zh: '解一元一次不等式', en: 'Solve linear inequalities' },
    story: { zh: '出征前粮草不能低于最低保障线。如果每天消耗固定量，至少需要准备多少？', en: 'Before campaign, supplies must meet the minimum. With fixed daily consumption, how much to prepare?' },
    description: { zh: '解不等式，求临界值。', en: 'Solve the inequality. Find the critical value.' },
    data: { a: 4, b: 3, c: 15, generatorType: 'INEQUALITY_RANDOM' }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-2.6-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要学不等式？\n方程告诉你恰好是多少，但现实中更多的是至少需要多少——\n不等式就是描述范围和限制条件的数学语言！', en: 'Zhuge Liang: "Why learn inequalities?\nEquations tell you exact amounts, but reality is about at least or at most —\nInequalities are the math language for ranges and constraints!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：不等式和方程的区别\n方程：$=$ 一个精确值\n不等式：$>$, $<$, $\\geq$, $\\leq$ 一个范围\n\n解法几乎一样！只是答案是一个范围而不是一个点。', en: 'Xun Yu: "Inequality vs equation\nEquation: $=$ one exact value\nInequality: $>$, $<$, $\\geq$, $\\leq$ a range\n\nSolving is almost identical! But the answer is a range, not a point."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：解法——跟解方程一样\n移项、合并，把 $x$ 留在一边。\n除以 $x$ 的系数得到临界值。', en: 'Xun Yu: "Method — same as equations\nRearrange, combine, isolate $x$ on one side.\nDivide by $x$\'s coefficient to find the critical value."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：代入计算\n一步步移项，求出 $x$ 的临界值。', en: 'Xun Yu: "Substitute and calculate\nStep by step rearranging to find the critical $x$ value."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：答案\n临界值确认——粮草底线已设定！', en: 'Xun Yu: "Answer\nCritical value confirmed — supply minimum is set!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：验算\n代回原不等式检查是否成立 ✓\n粮草保障到位，可以出征！', en: 'Xun Yu: "Verify\nSubstitute back into original inequality ✓\nSupplies secured — ready to march!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '不等式的解法和方程相同，只是答案是范围。注意：乘除负数要变号！', en: 'Solve inequalities like equations, but the answer is a range. Warning: multiply/divide by negative → flip the sign!' }, formula: '$ax + b > c \\Rightarrow x > \\frac{c-b}{a}$', tips: [{ zh: '荀彧提示：粮草底线，不可逾越。', en: 'Xun Yu Tip: The supply minimum must not be breached.' }] },
    storyConsequence: { correct: { zh: '粮草底线——不等式范围找对！做得漂亮！', en: 'Supply Minimum — Well done!' }, wrong: { zh: '不等式范围搞错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 974, grade: 9, unitId: 7, order: 4,
    unitTitle: { zh: "Unit 7: 铁匠铺·代数锻造", en: "Unit 7: Blacksmith's Forge — Algebraic Forging" },
    topic: 'Algebra', type: 'STD_FORM',
    title: { zh: '百万雄师', en: 'Million-Strong Army' },
    skillName: { zh: '标准式表达术', en: 'Standard Form' },
    skillSummary: { zh: 'a × 10^n 形式表达大数', en: 'Express large numbers as a × 10^n' },
    story: { zh: '曹操号称百万大军。如何用简洁的方式表达这个庞大的数字？标准式！', en: 'Cao Cao claims a million-strong army. How to express this huge number concisely? Standard form!' },
    description: { zh: '把数字写成 $a \\times 10^n$ 的形式，求 $a$ 和 $n$。', en: 'Write the number in standard form $a \\times 10^n$. Find $a$ and $n$.' },
    data: { number: 250000, a: 2.5, n: 5, generatorType: 'STD_FORM_RANDOM' }, difficulty: 'Hard', reward: 220,
    kpId: 'kp-1.8-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '荀彧：为什么需要标准式？\n"八十三万"太长了——标准式让大数变简洁：\n$830000 = 8.3 \\times 10^5$\n科学家、军师都用这种方法表达大数！', en: 'Xun Yu: "Why standard form?\n\'Eight hundred thirty thousand\' is too long — standard form makes it concise:\n$830000 = 8.3 \\times 10^5$\nScientists and strategists use this to express big numbers!"' }, highlightField: 'a' },
      { text: { zh: '荀彧：标准式的规则\n$a \\times 10^n$，其中 $1 \\leq a < 10$\n$a$ = 1 到 10 之间的数（只有一位整数）\n$n$ = 小数点移动了几位', en: 'Xun Yu: "Standard form rules\n$a \\times 10^n$ where $1 \\leq a < 10$\n$a$ = number between 1 and 10 (one digit before decimal)\n$n$ = how many places the decimal moved"' }, highlightField: 'a' },
      { text: { zh: '荀彧：怎么转换？\n把小数点移到第一个非零数字后面，数移了几位就是 $n$。', en: 'Xun Yu: "How to convert?\nMove the decimal point after the first non-zero digit. Count the moves = $n$."' }, highlightField: 'a' },
      { text: { zh: '荀彧：代入数据\n原数是 ${number}$\n小数点移到 $a$ 的位置，数 $n$ 位。', en: 'Xun Yu: "Substitute\nOriginal number is ${number}$\nMove decimal to get $a$, count $n$ places."' }, highlightField: 'n' },
      { text: { zh: '荀彧：答案\n$a$ 和 $n$ 确认。百万雄师，一式概之！', en: 'Xun Yu: "Answer\n$a$ and $n$ confirmed. A million troops, expressed in one formula!"' }, highlightField: 'a' },
      { text: { zh: '荀彧：验算\n$a \\times 10^n$ 展开应该等于原数 ✓', en: 'Xun Yu: "Verify\n$a \\times 10^n$ expanded should equal the original number ✓"' }, highlightField: 'a' },
    ],
    secret: { concept: { zh: '标准式 = a × 10^n，其中 1 ≤ a < 10。用于简洁表达极大或极小的数。', en: 'Standard form = a × 10^n where 1 ≤ a < 10. Used to express very large or small numbers concisely.' }, formula: '$a \\times 10^n$', tips: [{ zh: '荀彧提示：百万雄师，标准式一目了然。', en: 'Xun Yu Tip: A million troops — standard form says it all.' }] },
    storyConsequence: { correct: { zh: '百万雄师——标准形式正确！做得漂亮！', en: 'Million-Strong Army — Well done!' }, wrong: { zh: '标准形式转换失误…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Year 9 Unit 8: Battle Angles & Parallel Lines ---
  {
    id: 981, grade: 9, unitId: 8, order: 1,
    unitTitle: { zh: "Unit 8: 阵前角度·平行线", en: "Unit 8: Battle Angles — Parallel Lines" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '阵前角度', en: 'Formation Angles' },
    skillName: { zh: '直线角度术', en: 'Angles on a Line' },
    skillSummary: { zh: '直线上的角之和 = 180°', en: 'Angles on a straight line = 180°' },
    story: { zh: '赵云布阵迎敌，需要计算阵型中各角的大小。直线上的角加起来一定是 180°。', en: 'Zhao Yun sets formation against the enemy. Calculate angles in the formation. Angles on a line sum to 180°.' },
    description: { zh: '直线上的角分别是 ${angle}°$ 和 $x°$，求 $x$。', en: 'Angles on a line are ${angle}°$ and $x°$. Find $x$.' },
    data: { angle: 120, total: 180, generatorType: 'ANGLES_RANDOM' }, difficulty: 'Easy', reward: 140,
    kpId: 'kp-4.6-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云：为什么直线上的角等于 180°？\n一条直线是"半圈"——从一个方向到正对面。\n半圈 = $180°$，所以直线上的角加起来一定是 $180°$。', en: 'Zhao Yun: "Why do angles on a line equal 180°?\nA straight line is \'half a turn\' — from one direction to its opposite.\nHalf turn = $180°$, so angles on a line always sum to $180°$."' }, highlightField: 'x' },
      { text: { zh: '赵云：核心规则\n$$\\text{已知角} + x = 180°$$\n所以 $x = 180° - \\text{已知角}$', en: 'Zhao Yun: "Core rule\n$$\\text{known angle} + x = 180°$$\nSo $x = 180° - \\text{known angle}$"' }, highlightField: 'x' },
      { text: { zh: '赵云：代入\n已知角 = ${angle}°$\n$x = 180° - {angle}°$', en: 'Zhao Yun: "Substitute\nKnown angle = ${angle}°$\n$x = 180° - {angle}°$"' }, highlightField: 'x' },
      { text: { zh: '赵云：计算\n$180 - {angle}$ = ？', en: 'Zhao Yun: "Calculate\n$180 - {angle}$ = ?"' }, highlightField: 'x' },
      { text: { zh: '赵云：答案\n$x$ 确认！阵型角度精准！', en: 'Zhao Yun: "Answer\n$x$ confirmed! Formation angles precise!"' }, highlightField: 'x' },
      { text: { zh: '赵云：验算\n${angle}° + x° = 180°$ ✓ 完美！', en: 'Zhao Yun: "Verify\n${angle}° + x° = 180°$ ✓ Perfect!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '直线上的角之和 = 180°。这是最基础的角度关系。', en: 'Angles on a straight line sum to 180°. The most basic angle relationship.' }, formula: '$a + b = 180°$', tips: [{ zh: '赵云提示：直线半圈，180度不多不少。', en: 'Zhao Yun Tip: A straight line is half a turn — exactly 180°.' }] },
    storyConsequence: { correct: { zh: '阵前角度——角度完美！做得漂亮！', en: 'Formation Angles — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 982, grade: 9, unitId: 8, order: 2,
    unitTitle: { zh: "Unit 8: 阵前角度·平行线", en: "Unit 8: Battle Angles — Parallel Lines" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '壕沟截角', en: 'Trench Angles' },
    skillName: { zh: '平行线截角术', en: 'Parallel Line Angles' },
    skillSummary: { zh: '同位角相等，内错角相等', en: 'Corresponding angles equal, alternate angles equal' },
    story: { zh: '两条平行壕沟被一条斜路截断。利用平行线性质求未知角度。', en: 'Two parallel trenches cut by a transversal road. Use parallel line properties to find unknown angles.' },
    description: { zh: '平行线被截线切割，已知一个角，求 $x$。', en: 'Parallel lines cut by transversal. Given one angle, find $x$.' },
    data: { angle: 65, total: 180, answer: 65, generatorType: 'PARALLEL_ANGLES_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-4.6-04', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '张昭：为什么要学平行线截角？\n城墙上两条平行线被一条横线截断——产生了成对的角。\n掌握这些角的关系，就能在不量角的情况下算出任何角！', en: 'Zhang Zhao: "Why learn parallel angles?\nTwo parallel lines cut by a transversal create paired angles.\nMaster these relationships and calculate any angle without measuring!"' }, highlightField: 'x' },
      { text: { zh: '关羽：三大角度关系\n① 同位角（F形）相等\n② 内错角（Z形）相等\n③ 同旁内角（C形）互补（加起来 180°）', en: 'Guan Yu: "Three angle relationships\n① Corresponding angles (F-shape) are EQUAL\n② Alternate angles (Z-shape) are EQUAL\n③ Co-interior angles (C-shape) are SUPPLEMENTARY (sum to 180°)"' }, highlightField: 'x' },
      { text: { zh: '关羽：识别角度关系\n看已知角和未知角的位置——是 F 形、Z 形还是 C 形？', en: 'Guan Yu: "Identify the relationship\nLook at positions of known and unknown angles — F, Z, or C shape?"' }, highlightField: 'x' },
      { text: { zh: '关羽：应用规则\n根据识别出的关系，直接得到答案。', en: 'Guan Yu: "Apply the rule\nBased on the identified relationship, get the answer directly."' }, highlightField: 'x' },
      { text: { zh: '关羽：答案\n壕沟角度确认！防线固若金汤！', en: 'Guan Yu: "Answer\nTrench angles confirmed! Defense line is impenetrable!"' }, highlightField: 'x' },
      { text: { zh: '关羽：验算\n检查角度关系是否符合平行线性质 ✓', en: 'Guan Yu: "Verify\nCheck angle relationships match parallel line properties ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '平行线截角：同位角=，内错角=，同旁内角互补。', en: 'Parallel line angles: corresponding = equal, alternate = equal, co-interior = supplementary.' }, formula: '$\\text{F} = \\text{F}, \\text{Z} = \\text{Z}, \\text{C} + \\text{C} = 180°$', tips: [{ zh: '关羽提示：F相等、Z相等、C互补——三字真言。', en: 'Guan Yu Tip: F equal, Z equal, C supplementary — three golden rules.' }] },
    storyConsequence: { correct: { zh: '壕沟截角——角度完美！做得漂亮！', en: 'Trench Angles — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 983, grade: 9, unitId: 8, order: 3,
    unitTitle: { zh: "Unit 8: 阵前角度·平行线", en: "Unit 8: Battle Angles — Parallel Lines" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '堡垒内角', en: 'Fortress Interior Angles' },
    skillName: { zh: '多边形内角术', en: 'Polygon Interior Angles' },
    skillSummary: { zh: '内角和 = (n-2) × 180°', en: 'Interior angle sum = (n-2) × 180°' },
    story: { zh: '设计多边形堡垒。需要知道每个角的大小才能精确施工。内角和公式是关键！', en: 'Designing a polygon fortress. Need each angle for precise construction. The interior angle sum formula is key!' },
    description: { zh: '多边形一些角已知，求未知角 $x$。', en: 'Some angles of a polygon are known. Find unknown angle $x$.' },
    data: { angle: 300, total: 360, generatorType: 'ANGLES_POINT_RANDOM' }, difficulty: 'Hard', reward: 220,
    kpId: 'kp-4.6-06', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '张昭：为什么要学多边形内角和？\n修建城堡时，每面墙的角度必须精准——否则墙合不拢！\n$n$ 边形内角和 = $(n-2) \\times 180°$，知道了这个就能算出每个角。', en: 'Zhang Zhao: "Why learn polygon interior angles?\nBuilding a fortress, every wall angle must be precise — or the walls don\'t close!\n$n$-gon interior angles = $(n-2) \\times 180°$, know this to find any angle."' }, highlightField: 'x' },
      { text: { zh: '赵云：为什么是 $(n-2)$？\n任何多边形都能从一个顶点画对角线，分成 $(n-2)$ 个三角形。\n每个三角形 $180°$，所以总共 $(n-2) \\times 180°$！', en: 'Zhao Yun: "Why $(n-2)$?\nAny polygon can be split into $(n-2)$ triangles by drawing diagonals from one vertex.\nEach triangle has $180°$, so total = $(n-2) \\times 180°$!"' }, highlightField: 'x' },
      { text: { zh: '赵云：解题思路\n内角和 - 已知角之和 = 未知角 $x$', en: 'Zhao Yun: "Strategy\nInterior angle sum - known angles = unknown angle $x$"' }, highlightField: 'x' },
      { text: { zh: '赵云：计算\n先算内角和，再减去所有已知角。', en: 'Zhao Yun: "Calculate\nFirst find interior angle sum, then subtract all known angles."' }, highlightField: 'x' },
      { text: { zh: '赵云：答案\n堡垒每个角都精确！施工开始！', en: 'Zhao Yun: "Answer\nEvery fortress angle is precise! Construction begins!"' }, highlightField: 'x' },
      { text: { zh: '赵云：验算\n所有角加起来应该等于内角和 $(n-2) \\times 180°$ ✓', en: 'Zhao Yun: "Verify\nAll angles should sum to $(n-2) \\times 180°$ ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '多边形内角和 = (n-2) × 180°。分三角形法推导。', en: 'Polygon interior angle sum = (n-2) × 180°. Derived by triangle decomposition.' }, formula: '$(n-2) \\times 180°$', tips: [{ zh: '赵云提示：从一个顶点画对角线，数三角形个数。', en: 'Zhao Yun Tip: Draw diagonals from one vertex, count the triangles.' }] },
    storyConsequence: { correct: { zh: '堡垒内角——角度完美！做得漂亮！', en: 'Fortress Interior Angles — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Year 9 Unit 9: March Speed & Percentages ---
  {
    id: 991, grade: 9, unitId: 9, order: 1,
    unitTitle: { zh: "Unit 9: 行军速算·百分之道", en: "Unit 9: March Speed — Way of Percentages" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '行军速度', en: 'March Speed' },
    skillName: { zh: '速度公式术', en: 'Speed Formula' },
    skillSummary: { zh: '速度 = 距离 ÷ 时间', en: 'Speed = distance ÷ time' },
    story: { zh: '赵云急行军驰援。已知距离和时间，求行军速度。', en: 'Zhao Yun races to reinforce. Given distance and time, find march speed.' },
    description: { zh: '求速度、距离或时间。', en: 'Find speed, distance, or time.' },
    data: { speed: 15, distance: 60, time: 4, mode: 'speed', answer: 15, x: 15, generatorType: 'SPEED_RANDOM' }, difficulty: 'Easy', reward: 140,
    kpId: 'kp-1.12-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '张昭：为什么要学速度公式？\n行军打仗，速度决定生死。提前到达 = 抢占先机，迟到 = 全军覆没。\n速度 = 距离 ÷ 时间，三个量知二求一！', en: 'Zhang Zhao: "Why learn the speed formula?\nIn war, speed means life or death. Arrive early = seize advantage, arrive late = total defeat.\nSpeed = distance ÷ time, know any two to find the third!"' }, highlightField: 'x' },
      { text: { zh: '赵云：三个公式\n$S = \\frac{D}{T}$（求速度）\n$D = S \\times T$（求距离）\n$T = \\frac{D}{S}$（求时间）', en: 'Zhao Yun: "Three formulas\n$S = \\frac{D}{T}$ (find speed)\n$D = S \\times T$ (find distance)\n$T = \\frac{D}{S}$ (find time)"' }, highlightField: 'x' },
      { text: { zh: '赵云：代入数据\n已知量代入对应公式。', en: 'Zhao Yun: "Substitute\nPlug known values into the formula."' }, highlightField: 'x' },
      { text: { zh: '赵云：计算\n一步除法或乘法。', en: 'Zhao Yun: "Calculate\nOne division or multiplication."' }, highlightField: 'x' },
      { text: { zh: '赵云：答案\n行军速度确认！驰援及时！', en: 'Zhao Yun: "Answer\nMarch speed confirmed! Reinforcements arrive in time!"' }, highlightField: 'x' },
      { text: { zh: '赵云：验算\n$速度 \\times 时间 = 距离$ ✓', en: 'Zhao Yun: "Verify\n$\\text{Speed} \\times \\text{Time} = \\text{Distance}$ ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '速度 = 距离 ÷ 时间。三个量知二求一。', en: 'Speed = distance ÷ time. Know two, find the third.' }, formula: '$S = \\frac{D}{T}$', tips: [{ zh: '赵云提示：急行军，算准速度才能准时到达！', en: 'Zhao Yun Tip: Forced march — calculate speed to arrive on time!' }] },
    storyConsequence: { correct: { zh: '行军速度——方程完美求解！做得漂亮！', en: 'March Speed — Well done!' }, wrong: { zh: '方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 992, grade: 9, unitId: 9, order: 2,
    unitTitle: { zh: "Unit 9: 行军速算·百分之道", en: "Unit 9: March Speed — Way of Percentages" },
    topic: 'Algebra', type: 'PERCENTAGE',
    title: { zh: '兵力增长', en: 'Army Growth' },
    skillName: { zh: '百分比增减术', en: 'Percentage Increase/Decrease' },
    skillSummary: { zh: '增减后 = 原值 × (1 ± 百分比)', en: 'New = original × (1 ± percentage)' },
    story: { zh: '曹操招兵买马，兵力增长了一定百分比。求增长后的兵力。', en: 'Cao Cao recruits troops, army grows by a percentage. Find the new army size.' },
    description: { zh: '计算百分比变化后的值。', en: 'Calculate the value after percentage change.' },
    data: { initial: 5000, rate: 0.2, years: 1, answer: 6000, generatorType: 'PERCENTAGE_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-1.13-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '张昭：为什么要学百分比增长？\n军队扩编、粮价上涨——数量在原基础上增加一定百分比。\n掌握百分比增减，才能预测未来的规模变化！', en: 'Zhang Zhao: "Why learn percentage increase?\nArmy expansion, grain price rises — quantities increase by a percentage of the original.\nMaster percentage change to predict future scale!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：公式\n$$\\text{新值} = \\text{原值} \\times (1 + r)$$\n增长用正 $r$，减少用负 $r$。', en: 'Cao Cao: "Formula\n$$\\text{New} = \\text{Original} \\times (1 + r)$$\nIncrease = positive $r$, decrease = negative $r$."' }, highlightField: 'ans' },
      { text: { zh: '曹操：代入数据\n原值和变化率代入。', en: 'Cao Cao: "Substitute\nOriginal value and rate."' }, highlightField: 'ans' },
      { text: { zh: '曹操：计算\n一步乘法。', en: 'Cao Cao: "Calculate\nOne multiplication."' }, highlightField: 'ans' },
      { text: { zh: '曹操：答案\n兵力变化确认！', en: 'Cao Cao: "Answer\nArmy change confirmed!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n新值 - 原值 应等于 原值 × 百分比 ✓', en: 'Cao Cao: "Verify\nNew - original should equal original × percentage ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '百分比增减：新值 = 原值 × (1 + 变化率)。', en: 'Percentage change: new = original × (1 + rate).' }, formula: '$\\text{New} = \\text{Original} \\times (1+r)$', tips: [{ zh: '曹操提示：兵马未动，数字先行。', en: 'Cao Cao Tip: Before troops move, numbers go first.' }] },
    storyConsequence: { correct: { zh: '兵力增长——百分比算得好！做得漂亮！', en: 'Army Growth — Well done!' }, wrong: { zh: '百分比算差了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 993, grade: 9, unitId: 9, order: 3,
    unitTitle: { zh: "Unit 9: 行军速算·百分之道", en: "Unit 9: March Speed — Way of Percentages" },
    topic: 'Algebra', type: 'PERCENTAGE',
    title: { zh: '军饷原价', en: 'Original Stipend' },
    skillName: { zh: '反向百分比术', en: 'Reverse Percentage' },
    skillSummary: { zh: '已知增减后求原值', en: 'Find original given the changed value' },
    story: { zh: '军饷加税后的金额已知。需要反推出税前原价——反向百分比！', en: 'Post-tax stipend is known. Need to find the pre-tax original — reverse percentage!' },
    description: { zh: '已知变化后的值和百分比，求原值。', en: 'Given the changed value and percentage, find the original.' },
    data: { initial: 500, rate: 0.25, years: 1, answer: 625, generatorType: 'PERCENTAGE_RANDOM' }, difficulty: 'Hard', reward: 220,
    kpId: 'kp-1.13-04', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '张昭：为什么要学反向百分比？\n现价已经涨过了——原价是多少？打折后的价格知道了——原价呢？\n反向百分比就是从结果倒推回起点的技巧！', en: 'Zhang Zhao: "Why learn reverse percentages?\nThe current price already increased — what was the original? You know the sale price — what\'s the original?\nReverse percentage is the technique of working backwards from the result!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：公式\n$$\\text{原值} = \\frac{\\text{新值}}{1 + r}$$\n新值 ÷ $(1 + 百分比)$ = 原值。', en: 'Cao Cao: "Formula\n$$\\text{Original} = \\frac{\\text{New}}{1 + r}$$\nNew ÷ $(1 + \\text{percentage})$ = original."' }, highlightField: 'ans' },
      { text: { zh: '曹操：代入数据\n新值和变化率代入。', en: 'Cao Cao: "Substitute\nNew value and rate."' }, highlightField: 'ans' },
      { text: { zh: '曹操：计算\n一步除法。', en: 'Cao Cao: "Calculate\nOne division."' }, highlightField: 'ans' },
      { text: { zh: '曹操：答案\n原价反推完成！', en: 'Cao Cao: "Answer\nOriginal value found!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n原值 × $(1 + r)$ 应等于新值 ✓', en: 'Cao Cao: "Verify\nOriginal × $(1 + r)$ should equal new value ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '反向百分比：原值 = 新值 ÷ (1 + 变化率)。', en: 'Reverse percentage: original = new ÷ (1 + rate).' }, formula: '$\\text{Original} = \\frac{\\text{New}}{1+r}$', tips: [{ zh: '曹操提示：反推原价——除以 $(1+r)$ 就行了。', en: 'Cao Cao Tip: Reverse — just divide by $(1+r)$.' }] },
    storyConsequence: { correct: { zh: '军饷原价——百分比算得好！做得漂亮！', en: 'Original Stipend — Well done!' }, wrong: { zh: '百分比算差了…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Y9 Unit 10: 度量篇 · 荆州屯田 (Mensuration) ---
  {
    id: 9101, grade: 9, unitId: 10, order: 1,
    unitTitle: { zh: "Unit 10: 荆州屯田·度量篇", en: "Unit 10: Jingzhou Fields — Mensuration" },
    topic: 'Geometry', type: 'AREA',
    title: { zh: '梯形田亩', en: 'Trapezium Fields' },
    skillName: { zh: '梯形面积术', en: 'Trapezium Area' },
    skillSummary: { zh: '½(a+b)×h', en: '½(a+b)×h' },
    story: { zh: '诸葛亮治理荆州，要丈量一块梯形的屯田。上边短、下边长，怎么算面积？', en: 'Zhuge Liang governs Jingzhou and must measure a trapezium-shaped field. Short top, long bottom — how to find the area?' },
    description: { zh: '求梯形面积，已知上底 $a$、下底 $b$、高 $h$。', en: 'Find the trapezium area given parallel sides $a$, $b$ and height $h$.' },
    data: { a: 5, b: 9, h: 6, generatorType: 'AREA_TRAP_RANDOM' }, difficulty: 'Easy', reward: 160,
    kpId: 'kp-5.2-03', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么需要梯形面积？\n不是所有田地都是方方正正的——大多数田是一头宽一头窄的梯形。\n会算梯形面积 = 会丈量天下大多数土地。', en: 'Zhuge Liang: "Why learn trapezium area?\nNot all fields are perfect rectangles — most are wider at one end.\nKnowing trapezium area = measuring most land in the world."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：生活类比\n想象一个梯子——上面窄、下面宽。\n梯形面积 = 把上下两边"平均"一下 × 高度。\n就像把不规则田地"拉成长方形"再算。', en: 'Zhuge Liang: "Think of a ladder — narrow at top, wide at bottom.\nTrapezium area = average the two parallel sides × height.\nLike stretching an irregular field into a rectangle."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：公式\n$$A = \\frac{1}{2}(a + b) \\times h$$\n$a$ = 上底 ({a})，$b$ = 下底 ({b})，$h$ = 高 ({h})。', en: 'Zhuge Liang: "Formula\n$$A = \\frac{1}{2}(a + b) \\times h$$\n$a$ = top ({a}), $b$ = bottom ({b}), $h$ = height ({h})."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：代入计算\n$A = \\frac{1}{2}({a} + {b}) \\times {h}$\n$= \\frac{1}{2} \\times {ab_sum} \\times {h}$', en: 'Zhuge Liang: "Substitute\n$A = \\frac{1}{2}({a} + {b}) \\times {h}$\n$= \\frac{1}{2} \\times {ab_sum} \\times {h}$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n面积 = {answer} 平方单位。\n这块屯田可以养活不少将士！', en: 'Zhuge Liang: "Answer\nArea = {answer} square units.\nThis field can feed many soldiers!"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n换一种方法：把梯形分成一个长方形 + 一个三角形。\n长方形 = {a} × {h} = {rect_area}，三角形 = ½ × ({b}-{a}) × {h} = {tri_area}。\n{rect_area} + {tri_area} = {answer} ✓', en: 'Zhuge Liang: "Verify\nSplit into rectangle + triangle.\nRect = {a}×{h} = {rect_area}, Triangle = ½×({b}-{a})×{h} = {tri_area}.\n{rect_area} + {tri_area} = {answer} ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '梯形面积 = ½(上底+下底)×高。把两条平行边"取平均"再乘以高。', en: 'Trapezium area = ½(a+b)×h. Average the parallel sides, then multiply by height.' }, formula: '$A = \\frac{1}{2}(a+b)h$', tips: [{ zh: '诸葛亮提示：上下取平均，再乘高。', en: 'Zhuge Liang Tip: Average top and bottom, then multiply by height.' }] },
    storyConsequence: { correct: { zh: '梯形田亩——面积正确！做得漂亮！', en: 'Trapezium Fields — Well done!' }, wrong: { zh: '面积不对…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9102, grade: 9, unitId: 10, order: 2,
    unitTitle: { zh: "Unit 10: 荆州屯田·度量篇", en: "Unit 10: Jingzhou Fields — Mensuration" },
    topic: 'Geometry', type: 'CIRCLE',
    title: { zh: '圆形粮仓', en: 'Circular Granary' },
    skillName: { zh: '圆面积术', en: 'Circle Area' },
    skillSummary: { zh: 'A = πr²', en: 'A = πr²' },
    story: { zh: '荆州新建圆形粮仓，需要计算底面面积来估算储粮量。半径已知，求面积！', en: 'A circular granary is being built in Jingzhou. Calculate the base area to estimate grain storage. Radius known, find area!' },
    description: { zh: '求圆的面积，已知半径 $r$。', en: 'Find the circle area given radius $r$.' },
    data: { r: 7, generatorType: 'CIRCLE_Y8_RANDOM', mode: 'area' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-5.3-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么圆形粮仓？\n圆是用最少城墙围出最大面积的形状——古人智慧！\n同样的周长，圆的面积比正方形大 $27\\%$。', en: 'Zhuge Liang: "Why circular granaries?\nA circle encloses the most area with the least wall — ancient wisdom!\nSame perimeter, a circle has 27% more area than a square."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：公式\n$$A = \\pi r^2$$\n$\\pi \\approx 3.14159$，$r$ = 半径 ({r})。\n面积和半径的关系是"平方"——半径翻倍，面积变4倍！', en: 'Zhuge Liang: "Formula\n$$A = \\pi r^2$$\n$\\pi \\approx 3.14159$, $r$ = radius ({r}).\nArea scales with the square — double the radius, quadruple the area!"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：代入\n$A = \\pi \\times {r}^2 = \\pi \\times {r_sq}$', en: 'Zhuge Liang: "Substitute\n$A = \\pi \\times {r}^2 = \\pi \\times {r_sq}$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：计算\n$A = {r_sq}\\pi \\approx {answer}$（保留三位有效数字）', en: 'Zhuge Liang: "Calculate\n$A = {r_sq}\\pi \\approx {answer}$ (3 significant figures)"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n粮仓底面积 ≈ {answer} 平方单位。', en: 'Zhuge Liang: "Answer\nGranary base area ≈ {answer} square units."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n用 $A \\div \\pi$ 应该等于 $r^2 = {r_sq}$ ✓', en: 'Zhuge Liang: "Verify\n$A \\div \\pi$ should equal $r^2 = {r_sq}$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '圆面积 = πr²。半径的平方乘以π。', en: 'Circle area = πr². Radius squared times π.' }, formula: '$A = \\pi r^2$', tips: [{ zh: '诸葛亮提示：半径平方，再乘π。', en: 'Zhuge Liang Tip: Square the radius, multiply by π.' }] },
    storyConsequence: { correct: { zh: '圆形粮仓——圆的计算完美！做得漂亮！', en: 'Circular Granary — Well done!' }, wrong: { zh: '圆的计算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9103, grade: 9, unitId: 10, order: 3,
    unitTitle: { zh: "Unit 10: 荆州屯田·度量篇", en: "Unit 10: Jingzhou Fields — Mensuration" },
    topic: 'Geometry', type: 'VOLUME',
    title: { zh: '粮仓容量', en: 'Granary Volume' },
    skillName: { zh: '柱体体积术', en: 'Prism Volume' },
    skillSummary: { zh: 'V = 底面积 × 高', en: 'V = base area × height' },
    story: { zh: '粮仓高度确定后，需要计算总容量。底面积已知，高度已知——柱体体积！', en: 'With the granary height set, calculate total capacity. Base area known, height known — prism volume!' },
    description: { zh: '求柱体体积，已知底面积和高。', en: 'Find the prism volume given base area and height.' },
    data: { baseArea: 50, height: 8, generatorType: 'VOLUME_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-5.4-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么学柱体体积？\n粮仓就是一个立体——知道底面积和高度，就能算出能装多少粮食。\n这个公式适用于所有"上下一样粗"的形状。', en: 'Zhuge Liang: "Why learn prism volume?\nA granary is a 3D shape — knowing base area and height tells you how much grain fits.\nThis formula works for any shape with uniform cross-section."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：类比\n想象一摞饼——每层面积相同，叠多高就有多大体积。\n体积 = 一层面积 × 层数（高度）。', en: 'Zhuge Liang: "Analogy\nImagine stacking pancakes — same area each layer, height = number of layers.\nVolume = one layer × how many layers."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：公式\n$$V = A_{\\text{base}} \\times h$$\n底面积 = {baseArea}，高 = {height}。', en: 'Zhuge Liang: "Formula\n$$V = A_{\\text{base}} \\times h$$\nBase area = {baseArea}, height = {height}."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：计算\n$V = {baseArea} \\times {height} = {answer}$', en: 'Zhuge Liang: "Calculate\n$V = {baseArea} \\times {height} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n粮仓容量 = {answer} 立方单位。', en: 'Zhuge Liang: "Answer\nGranary volume = {answer} cubic units."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$V \\div h = {baseArea}$（底面积）✓\n$V \\div A = {height}$（高度）✓', en: 'Zhuge Liang: "Verify\n$V \\div h = {baseArea}$ (base area) ✓\n$V \\div A = {height}$ (height) ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '柱体体积 = 底面积 × 高。适用于所有棱柱和圆柱。', en: 'Prism volume = base area × height. Works for all prisms and cylinders.' }, formula: '$V = A \\times h$', tips: [{ zh: '诸葛亮提示：底面积乘高——万能柱体公式。', en: 'Zhuge Liang Tip: Base area × height — universal prism formula.' }] },
    storyConsequence: { correct: { zh: '粮仓容量——体积正确！做得漂亮！', en: 'Granary Volume — Well done!' }, wrong: { zh: '体积算错了…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Y9 Unit 11: 三角篇 · 赤壁前夜 (Trigonometry Extension) ---
  {
    id: 9111, grade: 9, unitId: 11, order: 1,
    unitTitle: { zh: "Unit 11: 赤壁前夜·三角篇", en: "Unit 11: Eve of Red Cliffs — Trigonometry" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '瞭望测距', en: 'Watchtower Range' },
    skillName: { zh: '正弦测距术', en: 'Sine Ranging' },
    skillSummary: { zh: 'sin θ = 对边/斜边', en: 'sin θ = opposite/hypotenuse' },
    story: { zh: '赤壁大战前夜，周瑜派人上瞭望塔测量曹军船队的距离。用正弦比就能算出来！', en: 'The night before Red Cliffs, Zhou Yu sends scouts up the watchtower to measure Cao Cao\'s fleet distance. Sine ratio makes it possible!' },
    description: { zh: '用 sin 求三角形的未知边。', en: 'Use sin to find an unknown side of a triangle.' },
    data: { angle: 30, hyp: 20, generatorType: 'TRIGONOMETRY_RANDOM', func: 'sin' }, difficulty: 'Easy', reward: 160,
    kpId: 'kp-6.1-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '周瑜：为什么需要三角测距？\n我站在瞭望塔上，能看到敌船，也知道俯角是 {angle}°。\n但我不能游过去量距离——三角函数就是"不用走过去也能量出来"的工具！', en: 'Zhou Yu: "Why trigonometric ranging?\nI stand on the watchtower, see the enemy fleet, know the angle is {angle}°.\nBut I can\'t swim over to measure — trig is the tool for measuring without going there!"' }, highlightField: 'ans' },
      { text: { zh: '周瑜：三角比\n$\\sin \\theta = \\frac{\\text{对边}}{\\text{斜边}}$\n"对边"就是我要求的距离，"斜边"是视线长度。', en: 'Zhou Yu: "Trig ratio\n$\\sin \\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$\n\'Opposite\' is the distance I want, \'hypotenuse\' is the line of sight."' }, highlightField: 'ans' },
      { text: { zh: '周瑜：代入\n$\\sin {angle}° = \\frac{x}{{hyp}}$\n$x = {hyp} \\times \\sin {angle}°$', en: 'Zhou Yu: "Substitute\n$\\sin {angle}° = \\frac{x}{{hyp}}$\n$x = {hyp} \\times \\sin {angle}°$"' }, highlightField: 'ans' },
      { text: { zh: '周瑜：计算\n$\\sin {angle}° = {sin_val}$\n$x = {hyp} \\times {sin_val} = {answer}$', en: 'Zhou Yu: "Calculate\n$\\sin {angle}° = {sin_val}$\n$x = {hyp} \\times {sin_val} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '周瑜：答案\n敌船距离 = {answer}。\n火攻射程够了！', en: 'Zhou Yu: "Answer\nEnemy distance = {answer}.\nFire attack range confirmed!"' }, highlightField: 'ans' },
      { text: { zh: '周瑜：验算\n$\\frac{{answer}}{{hyp}} = {sin_val} = \\sin {angle}°$ ✓', en: 'Zhou Yu: "Verify\n$\\frac{{answer}}{{hyp}} = {sin_val} = \\sin {angle}°$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'sin θ = 对边/斜边。已知角和斜边，可求对边。', en: 'sin θ = opp/hyp. Given angle and hypotenuse, find opposite.' }, formula: '$\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}$', tips: [{ zh: '周瑜提示：SOH — sin = 对/斜。', en: 'Zhou Yu Tip: SOH — sin = opposite/hypotenuse.' }] },
    storyConsequence: { correct: { zh: '瞭望测距——三角精准！做得漂亮！', en: 'Watchtower Range — Well done!' }, wrong: { zh: '三角函数算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9112, grade: 9, unitId: 11, order: 2,
    unitTitle: { zh: "Unit 11: 赤壁前夜·三角篇", en: "Unit 11: Eve of Red Cliffs — Trigonometry" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '火箭射角', en: 'Fire Arrow Angle' },
    skillName: { zh: '余弦射角术', en: 'Cosine Angle' },
    skillSummary: { zh: 'cos θ = 邻边/斜边', en: 'cos θ = adjacent/hypotenuse' },
    story: { zh: '黄盖要计算火箭的发射角度。知道水平距离和斜射距离，用余弦反推角度！', en: 'Huang Gai needs the fire arrow launch angle. Knowing horizontal and slant distances, use cosine to find the angle!' },
    description: { zh: '用 cos 求三角形的未知边。', en: 'Use cos to find an unknown side of a triangle.' },
    data: { angle: 45, hyp: 14, generatorType: 'TRIGONOMETRY_RANDOM', func: 'cos' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-6.1-02', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '黄盖：为什么需要余弦？\n火箭不是直线飞的——有水平距离也有斜距离。\n$\\cos$ 连接"你能看到的距离"（邻边）和"实际射程"（斜边）。', en: 'Huang Gai: "Why cosine?\nFire arrows don\'t fly straight — there\'s horizontal distance and slant distance.\n$\\cos$ connects \'visible distance\' (adjacent) and \'actual range\' (hypotenuse)."' }, highlightField: 'ans' },
      { text: { zh: '黄盖：公式\n$\\cos \\theta = \\frac{\\text{邻边}}{\\text{斜边}}$\n邻边 = 斜边 × cos θ。', en: 'Huang Gai: "Formula\n$\\cos \\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$\nAdjacent = hypotenuse × cos θ."' }, highlightField: 'ans' },
      { text: { zh: '黄盖：代入\n$\\cos {angle}° = \\frac{x}{{hyp}}$\n$x = {hyp} \\times \\cos {angle}°$', en: 'Huang Gai: "Substitute\n$\\cos {angle}° = \\frac{x}{{hyp}}$\n$x = {hyp} \\times \\cos {angle}°$"' }, highlightField: 'ans' },
      { text: { zh: '黄盖：计算\n$\\cos {angle}° = {cos_val}$\n$x = {hyp} \\times {cos_val} = {answer}$', en: 'Huang Gai: "Calculate\n$\\cos {angle}° = {cos_val}$\n$x = {hyp} \\times {cos_val} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '黄盖：答案\n水平距离 = {answer}。\n火攻方位确认！', en: 'Huang Gai: "Answer\nHorizontal distance = {answer}.\nFire attack bearing confirmed!"' }, highlightField: 'ans' },
      { text: { zh: '黄盖：验算\n$\\frac{{answer}}{{hyp}} = {cos_val} = \\cos {angle}°$ ✓', en: 'Huang Gai: "Verify\n$\\frac{{answer}}{{hyp}} = {cos_val} = \\cos {angle}°$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'cos θ = 邻边/斜边。已知角和斜边，可求邻边。', en: 'cos θ = adj/hyp. Given angle and hypotenuse, find adjacent.' }, formula: '$\\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}$', tips: [{ zh: '黄盖提示：CAH — cos = 邻/斜。', en: 'Huang Gai Tip: CAH — cos = adjacent/hypotenuse.' }] },
    storyConsequence: { correct: { zh: '火箭射角——三角精准！做得漂亮！', en: 'Fire Arrow Angle — Well done!' }, wrong: { zh: '三角函数算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9113, grade: 9, unitId: 11, order: 3,
    unitTitle: { zh: "Unit 11: 赤壁前夜·三角篇", en: "Unit 11: Eve of Red Cliffs — Trigonometry" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '连环船锁链', en: 'Chain Link Angle' },
    skillName: { zh: '正切桥接术', en: 'Tangent Bridge' },
    skillSummary: { zh: 'tan θ = 对边/邻边', en: 'tan θ = opposite/adjacent' },
    story: { zh: '庞统献连环计，锁链从甲板到水面形成一个角度。用正切可以算出锁链长度！', en: 'Pang Tong suggests chaining ships together. The chain from deck to water forms an angle. Tangent reveals the chain length!' },
    description: { zh: '用 tan 求三角形的未知边。', en: 'Use tan to find an unknown side of a triangle.' },
    data: { angle: 35, adj: 12, generatorType: 'TRIGONOMETRY_RANDOM', func: 'tan' }, difficulty: 'Hard', reward: 200,
    kpId: 'kp-6.1-02', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '庞统：为什么需要正切？\n锁链从甲板垂下来（对边），甲板到水面的水平距离（邻边）已知。\n$\\tan$ 就是"垂直 ÷ 水平"——最直接的角度关系。', en: 'Pang Tong: "Why tangent?\nThe chain hangs from the deck (opposite), horizontal distance to water (adjacent) is known.\n$\\tan$ is \'vertical ÷ horizontal\' — the most direct angle relationship."' }, highlightField: 'ans' },
      { text: { zh: '庞统：公式\n$\\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}}$\n对边 = 邻边 × tan θ。', en: 'Pang Tong: "Formula\n$\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}$\nOpposite = adjacent × tan θ."' }, highlightField: 'ans' },
      { text: { zh: '庞统：代入\n$\\tan {angle}° = \\frac{x}{{adj}}$\n$x = {adj} \\times \\tan {angle}°$', en: 'Pang Tong: "Substitute\n$\\tan {angle}° = \\frac{x}{{adj}}$\n$x = {adj} \\times \\tan {angle}°$"' }, highlightField: 'ans' },
      { text: { zh: '庞统：计算\n$\\tan {angle}° = {tan_val}$\n$x = {adj} \\times {tan_val} = {answer}$', en: 'Pang Tong: "Calculate\n$\\tan {angle}° = {tan_val}$\n$x = {adj} \\times {tan_val} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '庞统：答案\n锁链长度 = {answer}。\n连环计成功——曹军战船全部锁住！', en: 'Pang Tong: "Answer\nChain length = {answer}.\nThe chaining strategy works — Cao Cao\'s fleet is locked together!"' }, highlightField: 'ans' },
      { text: { zh: '庞统：验算\n$\\frac{{answer}}{{adj}} = {tan_val} = \\tan {angle}°$ ✓', en: 'Pang Tong: "Verify\n$\\frac{{answer}}{{adj}} = {tan_val} = \\tan {angle}°$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'tan θ = 对边/邻边。已知角和邻边，可求对边。', en: 'tan θ = opp/adj. Given angle and adjacent, find opposite.' }, formula: '$\\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}$', tips: [{ zh: '庞统提示：TOA — tan = 对/邻。SOH-CAH-TOA 三兄弟！', en: 'Pang Tong Tip: TOA — tan = opposite/adjacent. SOH-CAH-TOA trio!' }] },
    storyConsequence: { correct: { zh: '连环船锁链——三角精准！做得漂亮！', en: 'Chain Link Angle — Well done!' }, wrong: { zh: '三角函数算错了…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Y9 Unit 12: 统计篇 · 战后清点 (Statistics) ---
  {
    id: 9121, grade: 9, unitId: 12, order: 1,
    unitTitle: { zh: "Unit 12: 战后清点·统计篇", en: "Unit 12: Post-battle Census — Statistics" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '伤亡均值', en: 'Casualty Mean' },
    skillName: { zh: '平均数术', en: 'Mean Calculation' },
    skillSummary: { zh: '总和 ÷ 个数', en: 'Sum ÷ count' },
    story: { zh: '赤壁之战结束，需要统计各营伤亡。求五个营的平均伤亡人数。', en: 'After Red Cliffs, casualties must be tallied. Find the mean casualties across five camps.' },
    description: { zh: '计算一组数据的平均数。', en: 'Calculate the mean of a dataset.' },
    data: { values: [12, 18, 15, 22, 8], generatorType: 'STATISTICS_MEAN_RANDOM' }, difficulty: 'Easy', reward: 140,
    kpId: 'kp-9.1-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '司马懿：为什么需要平均数？\n五个营的伤亡各不相同——一个数字总结全部情况，就是"平均数"。\n它代表"如果每个营一样多，会是多少"。', en: 'Sima Yi: "Why the mean?\nFive camps have different casualties — one number summarizes everything.\nIt represents \'if every camp were equal, how many would each have\'."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：公式\n$$\\bar{x} = \\frac{\\text{总和}}{\\text{个数}}$$\n把所有数据加起来，再除以数据的个数。', en: 'Sima Yi: "Formula\n$$\\bar{x} = \\frac{\\text{sum}}{\\text{count}}$$\nAdd all values, divide by how many there are."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：代入\n总和 = {sum}，个数 = {count}。', en: 'Sima Yi: "Substitute\nSum = {sum}, count = {count}."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：计算\n$\\bar{x} = {sum} \\div {count} = {answer}$', en: 'Sima Yi: "Calculate\n$\\bar{x} = {sum} \\div {count} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '司马懿：答案\n平均伤亡 = {answer} 人。', en: 'Sima Yi: "Answer\nMean casualties = {answer}."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：验算\n$\\bar{x} \\times {count} = {sum}$（等于总和）✓', en: 'Sima Yi: "Verify\n$\\bar{x} \\times {count} = {sum}$ (equals sum) ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '平均数 = 总和 ÷ 个数。一个数字代表整体水平。', en: 'Mean = sum ÷ count. One number represents the whole.' }, formula: '$\\bar{x} = \\frac{\\sum x}{n}$', tips: [{ zh: '司马懿提示：先加后除——平均数就这么简单。', en: 'Sima Yi Tip: Add then divide — mean is that simple.' }] },
    storyConsequence: { correct: { zh: '伤亡均值——数据分析到位！做得漂亮！', en: 'Casualty Mean — Well done!' }, wrong: { zh: '数据分析出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9122, grade: 9, unitId: 12, order: 2,
    unitTitle: { zh: "Unit 12: 战后清点·统计篇", en: "Unit 12: Post-battle Census — Statistics" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '物资中位数', en: 'Supply Median' },
    skillName: { zh: '中位数术', en: 'Median Finding' },
    skillSummary: { zh: '排序后取中间值', en: 'Sort and take the middle value' },
    story: { zh: '清点各营剩余物资，找出"中间水平"——中位数不受极端值影响！', en: 'Tally remaining supplies per camp, find the \'middle level\' — median isn\'t affected by extremes!' },
    description: { zh: '计算一组数据的中位数。', en: 'Calculate the median of a dataset.' },
    data: { values: [45, 23, 67, 12, 56, 34, 89], generatorType: 'STATISTICS_MEDIAN_RANDOM' }, difficulty: 'Medium', reward: 160,
    kpId: 'kp-9.3-02', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '司马懿：为什么中位数比平均数好？\n如果一个营物资 $1000$，其他都只有 $20$，平均数就会被拉高——不准！\n中位数 = "排好队站中间的那个人"，不受极端值影响。', en: 'Sima Yi: "Why is median better than mean?\nIf one camp has 1000 supplies and others have 20, the mean gets inflated — misleading!\nMedian = \'the person standing in the middle of a line\' — not affected by extremes."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：步骤\n1. 把数据从小到大排列\n2. 找中间的那个值\n（偶数个数据：取中间两个的平均）', en: 'Sima Yi: "Steps\n1. Sort data from smallest to largest\n2. Find the middle value\n(Even count: average the two middle values)"' }, highlightField: 'ans' },
      { text: { zh: '司马懿：排序\n原数据排列后的结果。', en: 'Sima Yi: "Sort\nData arranged in order."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：找中间\n共 {count} 个数据，中间位置 = 第 {mid_pos} 个。', en: 'Sima Yi: "Find middle\n{count} values, middle position = #{mid_pos}."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：答案\n中位数 = {answer}。', en: 'Sima Yi: "Answer\nMedian = {answer}."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：验算\n中位数左右两边的数据个数应该相等 ✓', en: 'Sima Yi: "Verify\nEqual count of values on both sides of the median ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '中位数 = 排序后中间的值。不受极端值影响。', en: 'Median = middle value after sorting. Not affected by outliers.' }, formula: 'Sort → middle value', tips: [{ zh: '司马懿提示：先排队，再找中间人。', en: 'Sima Yi Tip: Line up first, then find the middle person.' }] },
    storyConsequence: { correct: { zh: '物资中位数——数据分析到位！做得漂亮！', en: 'Supply Median — Well done!' }, wrong: { zh: '数据分析出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9123, grade: 9, unitId: 12, order: 3,
    unitTitle: { zh: "Unit 12: 战后清点·统计篇", en: "Unit 12: Post-battle Census — Statistics" },
    topic: 'Statistics', type: 'PROBABILITY',
    title: { zh: '援军概率', en: 'Reinforcement Probability' },
    skillName: { zh: '基本概率术', en: 'Basic Probability' },
    skillSummary: { zh: 'P = 有利结果 ÷ 总结果', en: 'P = favorable ÷ total' },
    story: { zh: '司马懿分析情报：{total} 路援军中有 {favorable} 路能及时赶到。援军到达的概率是多少？', en: 'Sima Yi analyzes intel: {favorable} of {total} reinforcement routes will arrive in time. What\'s the probability?' },
    description: { zh: '计算简单事件的概率。', en: 'Calculate the probability of a simple event.' },
    data: { favorable: 2, total: 5, generatorType: 'PROBABILITY_SIMPLE_RANDOM' }, difficulty: 'Easy', reward: 140,
    kpId: 'kp-8.1-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '司马懿：为什么需要概率？\n战场上充满不确定性——概率就是"量化不确定性"的工具。\n$P = 0$ 绝不发生，$P = 1$ 必定发生。', en: 'Sima Yi: "Why probability?\nThe battlefield is full of uncertainty — probability is the tool to quantify it.\n$P = 0$ never happens, $P = 1$ always happens."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：公式\n$$P(\\text{事件}) = \\frac{\\text{有利结果数}}{\\text{总结果数}}$$\n就像"有多少好苹果 ÷ 总共多少苹果"。', en: 'Sima Yi: "Formula\n$$P(\\text{event}) = \\frac{\\text{favorable}}{\\text{total}}$$\nLike \'how many good apples ÷ total apples\'."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：代入\n有利 = {favorable}（能及时到的路线），总共 = {total}。', en: 'Sima Yi: "Substitute\nFavorable = {favorable} (routes arriving in time), total = {total}."' }, highlightField: 'ans' },
      { text: { zh: '司马懿：计算\n$P = \\frac{{favorable}}{{total}} = {answer}$', en: 'Sima Yi: "Calculate\n$P = \\frac{{favorable}}{{total}} = {answer}$"' }, highlightField: 'ans' },
      { text: { zh: '司马懿：答案\n援军到达概率 = {answer}。\n四成把握——值得一赌！', en: 'Sima Yi: "Answer\nReinforcement probability = {answer}.\n40% chance — worth the gamble!"' }, highlightField: 'ans' },
      { text: { zh: '司马懿：验算\n概率在 0 和 1 之间 ✓\n$P(\\text{到}) + P(\\text{不到}) = 1$ ✓', en: 'Sima Yi: "Verify\nProbability is between 0 and 1 ✓\n$P(\\text{arrive}) + P(\\text{not}) = 1$ ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '概率 = 有利结果 ÷ 总结果。0 到 1 之间，越大越可能。', en: 'Probability = favorable ÷ total. Between 0 and 1, higher = more likely.' }, formula: '$P = \\frac{\\text{favorable}}{\\text{total}}$', tips: [{ zh: '司马懿提示：好的 ÷ 全部 = 概率。', en: 'Sima Yi Tip: Good ÷ all = probability.' }] },
    storyConsequence: { correct: { zh: '援军概率——概率算准！做得漂亮！', en: 'Reinforcement Probability — Well done!' }, wrong: { zh: '概率算偏了…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Year 9 Unit 13: 赤壁前奏·高等代数 (Simultaneous & Quadratic) ---
  {
    id: 9131, grade: 9, unitId: 13, order: 1,
    unitTitle: { zh: "Unit 13: 赤壁前奏·高等代数", en: "Unit 13: Red Cliffs Prelude — Advanced Algebra" },
    topic: 'Algebra', type: 'SIMULTANEOUS',
    title: { zh: '粮草密约', en: 'Secret Supply Pact' },
    skillName: { zh: '联立解密术', en: 'Simultaneous Decryption' },
    skillSummary: { zh: '消元法解二元一次方程组', en: 'Solve simultaneous linear equations by elimination' },
    story: { zh: '赤壁大战前，孙权和刘备秘密谈判——两个条件缺一不可。$x$ 万精兵 + $y$ 万石粮草，总兵力 $x + y = 8$，兵力差 $x - y = 2$。', en: 'Before Red Cliffs, Sun Quan and Liu Bei negotiate in secret — two conditions, both required. $x$ elite troops + $y$ grain supplies, total $x + y = 8$, difference $x - y = 2$.' },
    description: { zh: '求 $x$ 和 $y$。', en: 'Find $x$ and $y$.' },
    data: { x: 5, y: 3, generatorType: 'SIMULTANEOUS_RANDOM' }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-2.5-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '鲁肃："为什么要用联立方程？因为有两个未知数——单靠一个条件定不了。就像谈判，双方各出一个条件，两个条件一起才能锁定方案。"', en: 'Lu Su: "Why simultaneous equations? Two unknowns — one condition isn\'t enough. Like a negotiation: each side sets a condition, both together lock in the deal."' }, highlightField: 'x' },
      { text: { zh: '鲁肃："消元法的思路：把两个方程加在一起或减在一起，让一个未知数消失。就像筛子——过滤掉一个变量。"', en: 'Lu Su: "Elimination idea: add or subtract equations to make one variable vanish. Like a sieve — filter out one variable."' }, highlightField: 'x' },
      { text: { zh: '鲁肃："两式相加：$(x+y) + (x-y) = 8 + 2$，得 $2x = 10$。"', en: 'Lu Su: "Add both: $(x+y) + (x-y) = 8 + 2$, giving $2x = 10$."' }, highlightField: 'x' },
      { text: { zh: '鲁肃："$x = 10 \\div 2 = 5$。代入第一式：$5 + y = 8$，$y = 3$。"', en: 'Lu Su: "$x = 10 \\div 2 = 5$. Substitute: $5 + y = 8$, $y = 3$."' }, highlightField: 'y' },
      { text: { zh: '鲁肃："答案：$x = 5$，$y = 3$。"', en: 'Lu Su: "Answer: $x = 5$, $y = 3$."' }, highlightField: 'x' },
      { text: { zh: '鲁肃："验算：$5 + 3 = 8$ ✓，$5 - 3 = 2$ ✓。两个条件都满足——密约达成！联军同心，其利断金。"', en: 'Lu Su: "Check: $5 + 3 = 8$ ✓, $5 - 3 = 2$ ✓. Both conditions met — pact sealed! United, they cut through gold."' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '联立方程：两个等式两个未知数，消元法让一个未知数消失。', en: 'Simultaneous equations: two equations, two unknowns — elimination removes one.' }, formula: '$x + y = 8,\\; x - y = 2$', tips: [{ zh: '鲁肃提示：联军同心，其利断金。', en: 'Lu Su Tip: United, they cut through gold.' }] },
    storyConsequence: { correct: { zh: '粮草密约——联立方程求解成功！做得漂亮！', en: 'Secret Supply Pact — Well done!' }, wrong: { zh: '联立方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9132, grade: 9, unitId: 13, order: 2,
    unitTitle: { zh: "Unit 13: 赤壁前奏·高等代数", en: "Unit 13: Red Cliffs Prelude — Advanced Algebra" },
    topic: 'Algebra', type: 'QUADRATIC',
    title: { zh: '投石轨迹', en: 'Catapult Trajectory' },
    skillName: { zh: '抛物线顶点术', en: 'Parabola Vertex' },
    skillSummary: { zh: '二次函数 $y = ax^2 + bx + c$ 的顶点', en: 'Vertex of quadratic $y = ax^2 + bx + c$' },
    story: { zh: '周瑜下令投石攻击曹军战船。石块轨迹为 $h = -x^2 + 6x$，$h$ 是高度，$x$ 是水平距离。石块最高能飞多高？', en: 'Zhou Yu orders a catapult strike on Cao\'s ships. The stone\'s path follows $h = -x^2 + 6x$. How high does it fly?' },
    description: { zh: '求最大高度时的 $x$ 值。', en: 'Find $x$ at maximum height.' },
    data: { p1: [0, 0], p2: [3, 9], generatorType: 'QUADRATIC_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-2.10-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '周瑜："为什么抛物线是二次函数？因为石块既受水平推力又受重力下拉——两个力叠加出弧形轨迹。最高点就是函数的顶点。"', en: 'Zhou Yu: "Why is the trajectory a quadratic? The stone has both horizontal thrust and downward gravity — two forces create a curved path. The peak is the vertex."' }, highlightField: 'x' },
      { text: { zh: '周瑜："$h = -x^2 + 6x$，这是一个开口朝下的抛物线（因为 $x^2$ 前是负号）。顶点就在对称轴上。"', en: 'Zhou Yu: "$h = -x^2 + 6x$ is a downward-opening parabola (negative $x^2$). The vertex sits on the axis of symmetry."' }, highlightField: 'x' },
      { text: { zh: '周瑜："对称轴公式：$x = -b/(2a)$。这里 $a = -1$，$b = 6$。"', en: 'Zhou Yu: "Axis formula: $x = -b/(2a)$. Here $a = -1$, $b = 6$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："代入：$x = -6/(2 \\times -1) = -6/(-2) = 3$。"', en: 'Zhou Yu: "Substitute: $x = -6/(2 \\times -1) = -6/(-2) = 3$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："答案：$x = 3$。"', en: 'Zhou Yu: "Answer: $x = 3$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："验算：$h(3) = -(3)^2 + 6(3) = -9 + 18 = 9$。试旁边：$h(2) = -4+12 = 8 < 9$。✓ 确实是最高点！石块精准砸中敌船。"', en: 'Zhou Yu: "Check: $h(3) = -9 + 18 = 9$. Try nearby: $h(2) = -4+12 = 8 < 9$. ✓ It is the peak! Stone hits the enemy ship."' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '二次函数顶点在对称轴 $x = -b/(2a)$ 处。', en: 'Quadratic vertex is at axis of symmetry $x = -b/(2a)$.' }, formula: '$x = -\\frac{b}{2a}$', tips: [{ zh: '周瑜提示：找到最高点，才能精准打击。', en: 'Zhou Yu Tip: Find the peak to strike precisely.' }] },
    storyConsequence: { correct: { zh: '投石轨迹——二次方程迎刃而解！做得漂亮！', en: 'Catapult Trajectory — Well done!' }, wrong: { zh: '二次方程算岔了…再试一次！', en: 'Not quite... Try again!' } }
  },

  // --- Year 9 Unit 14: 赤壁前奏·数据与变换 (Venn, CumFreq, Sector, Transformations, Vectors) ---
  {
    id: 9141, grade: 9, unitId: 14, order: 1,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Statistics', type: 'VENN',
    title: { zh: '谍报交集', en: 'Intelligence Overlap' },
    skillName: { zh: '韦恩情报术', en: 'Venn Intelligence' },
    skillSummary: { zh: '韦恩图求交集', en: 'Find intersection using Venn diagram' },
    story: { zh: '赤壁前夕，孙权的探子和刘备的探子分别打听到一些曹军将领的名单。50 名曹将中，孙方知道 25 个，刘方知道 20 个，双方都知道的有几人？', en: 'Before Red Cliffs, Sun\'s and Liu\'s spies each gathered lists of Cao\'s generals. Of 50 generals, Sun knows 25, Liu knows 20 — how many do both know?' },
    description: { zh: '已知 15 人只被孙方知道，求双方都知道的人数。', en: '15 are known only to Sun. Find how many both know.' },
    data: { total: 50, setA: 25, setB: 20, aOnly: 15, both: 10, bOnly: 10, neither: 15, union: 35, answer: 10, mode: 'intersection', generatorType: 'VENN_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-8.1-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么要用韦恩图？因为两份名单有重叠——有些将领两边都知道。韦恩图用两个圈把重叠部分清楚地画出来。"', en: 'Zhuge Liang: "Why Venn diagrams? Two lists overlap — some generals appear on both. Venn diagrams use two circles to clearly show the overlap."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："画两个圈：圈 A = 孙方（25人），圈 B = 刘方（20人）。重叠部分 = 双方都知道的。"', en: 'Zhuge Liang: "Draw two circles: A = Sun (25), B = Liu (20). The overlap = known by both."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："只被孙方知道的 = 15 人。所以重叠 = 孙方总数 - 只孙方 = $25 - 15 = 10$。"', en: 'Zhuge Liang: "Known only to Sun = 15. So overlap = Sun total - Sun only = $25 - 15 = 10$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："只被刘方知道的 = $20 - 10 = 10$ 人。"', en: 'Zhuge Liang: "Known only to Liu = $20 - 10 = 10$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："答案：双方都知道 10 人。"', en: 'Zhuge Liang: "Answer: both know 10 generals."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："验算：只孙 15 + 双方 10 + 只刘 10 + 都不知道 15 = 50。✓ 总数对上！情报汇总，知己知彼。"', en: 'Zhuge Liang: "Check: Sun-only 15 + both 10 + Liu-only 10 + neither 15 = 50. ✓ Total matches! Intelligence gathered — know your enemy."' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '韦恩图：$|A \\cap B| = |A| - |A \\text{ only}|$。', en: 'Venn: $|A \\cap B| = |A| - |A \\text{ only}|$.' }, formula: '$|A \\cup B| = |A| + |B| - |A \\cap B|$', tips: [{ zh: '诸葛亮提示：知己知彼，百战不殆。', en: 'Zhuge Liang Tip: Know yourself and your enemy, and you\'ll never lose.' }] },
    storyConsequence: { correct: { zh: '谍报交集——集合理清！做得漂亮！', en: 'Intelligence Overlap — Well done!' }, wrong: { zh: '集合关系理错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9142, grade: 9, unitId: 14, order: 2,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Geometry', type: 'CIRCLE',
    title: { zh: '烽火扇面', en: 'Beacon Arc' },
    skillName: { zh: '扇形弧长术', en: 'Sector Arc Length' },
    skillSummary: { zh: '扇形弧长 = 角度/360 × 周长', en: 'Arc length = angle/360 × circumference' },
    story: { zh: '沿江烽火台呈扇形分布，圆心在周瑜大营。半径 {r} 里，扇形角 {angle}°。烽火传递要沿弧线走——弧长是多少？', en: 'Beacon towers line the river in a sector from Zhou Yu\'s camp. Radius {r} li, angle {angle}°. Fire signals travel along the arc — how long is it?' },
    description: { zh: '求弧长（取 $\\pi = 3.14$）。', en: 'Find the arc length (use $\\pi = 3.14$).' },
    data: { r: 10, pi: 3.14, angle: 90, mode: 'circumference', answer: 15.7, generatorType: 'SECTOR_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-5.3-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '周瑜："为什么要学弧长？因为烽火沿弧线传递，不是直线——弧线比直线长，必须精确计算才知道传令要多久。"', en: 'Zhou Yu: "Why learn arc length? Beacon signals travel along a curve, not a straight line — curves are longer, so exact calculation tells us how long signals take."' }, highlightField: 'ans' },
      { text: { zh: '周瑜："弧长是整个圆周长的一部分。90° 是一整圈 360° 的四分之一，所以弧长 = 圆周长 ÷ 4。"', en: 'Zhou Yu: "Arc length is a fraction of the full circumference. 90° is one-quarter of 360°, so arc = circumference ÷ 4."' }, highlightField: 'ans' },
      { text: { zh: '周瑜："圆周长 = $2\\pi r = 2 \\times 3.14 \\times 10 = 62.8$。"', en: 'Zhou Yu: "Circumference = $2\\pi r = 2 \\times 3.14 \\times 10 = 62.8$."' }, highlightField: 'ans' },
      { text: { zh: '周瑜："弧长 = $\\frac{90}{360} \\times 62.8 = \\frac{1}{4} \\times 62.8 = 15.7$。"', en: 'Zhou Yu: "Arc = $\\frac{90}{360} \\times 62.8 = \\frac{1}{4} \\times 62.8 = 15.7$."' }, highlightField: 'ans' },
      { text: { zh: '周瑜："答案：弧长 = 15.7 里。"', en: 'Zhou Yu: "Answer: arc length = 15.7 li."' }, highlightField: 'ans' },
      { text: { zh: '周瑜："验算：$15.7 \\times 4 = 62.8$，正好是整圈周长。✓ 90° 确实是四分之一圈！"', en: 'Zhou Yu: "Check: $15.7 \\times 4 = 62.8$, exactly the full circumference. ✓ 90° is indeed one-quarter!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '弧长 = 角度/360 × 圆周长。', en: 'Arc length = angle/360 × circumference.' }, formula: '$l = \\frac{\\theta}{360} \\times 2\\pi r$', tips: [{ zh: '周瑜提示：弧线比直线长，计算不能偷懒。', en: 'Zhou Yu Tip: Curves are longer than lines — no shortcuts in calculation.' }] },
    storyConsequence: { correct: { zh: '烽火扇面——圆的计算完美！做得漂亮！', en: 'Beacon Arc — Well done!' }, wrong: { zh: '圆的计算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9143, grade: 9, unitId: 14, order: 3,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '阵型旋转', en: 'Formation Rotation' },
    skillName: { zh: '旋转变换术', en: 'Rotation Transform' },
    skillSummary: { zh: '绕定点旋转后坐标', en: 'Coordinates after rotation around a point' },
    story: { zh: '诸葛亮布八阵图，核心阵眼在 $({px}, {py})$。前锋绕阵眼逆时针旋转 {angle}°。旋转后前锋在哪里？', en: 'Zhuge Liang sets up the Eight Formations. The formation core is at $({px}, {py})$. The vanguard rotates {angle}° counter-clockwise around the core. Where does the vanguard end up?' },
    description: { zh: '求旋转后的坐标。', en: 'Find the coordinates after rotation.' },
    data: { targetX: 3, targetY: 7, px: 3, py: 4, angle: 90, generatorType: 'ROTATION_RANDOM' }, difficulty: 'Medium', reward: 240,
    kpId: 'kp-7.2-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么要学旋转？八阵图的精妙在于阵型可以随时转向——敌人从东来就转向东，从北来就转向北。数学上就是绕一个中心点旋转。"', en: 'Zhuge Liang: "Why learn rotation? The Eight Formations\' brilliance is that they can face any direction — math rotation around a center point makes this possible."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："先平移到原点：前锋相对阵眼 = $(6-3, 4-4) = (3, 0)$。"', en: 'Zhuge Liang: "First translate to origin: vanguard relative to core = $(6-3, 4-4) = (3, 0)$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："逆时针 90°：$(x, y) \\to (-y, x)$。所以 $(3, 0) \\to (0, 3)$。"', en: 'Zhuge Liang: "90° counter-clockwise: $(x, y) \\to (-y, x)$. So $(3, 0) \\to (0, 3)$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："再平移回去：$(0+3, 3+4) = (3, 7)$。"', en: 'Zhuge Liang: "Translate back: $(0+3, 3+4) = (3, 7)$."' }, highlightField: 'y' },
      { text: { zh: '诸葛亮："答案：旋转后坐标 $(3, 7)$。"', en: 'Zhuge Liang: "Answer: rotated coordinates $(3, 7)$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："验算：原点距 = $\\sqrt{3^2+0^2} = 3$，新点距 = $\\sqrt{0^2+3^2} = 3$。✓ 半径不变——旋转只改方向不改距离！"', en: 'Zhuge Liang: "Check: original distance = $\\sqrt{3^2+0^2} = 3$, new distance = $\\sqrt{0^2+3^2} = 3$. ✓ Radius unchanged — rotation changes direction, not distance!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '旋转：先平移到原点，应用旋转公式，再平移回来。', en: 'Rotation: translate to origin, apply rotation formula, translate back.' }, formula: '$(x,y) \\xrightarrow{90°\\text{CCW}} (-y, x)$', tips: [{ zh: '诸葛亮提示：八阵图变幻莫测，全靠旋转之妙。', en: 'Zhuge Liang Tip: The Eight Formations shift unpredictably, all through rotation.' }] },
    storyConsequence: { correct: { zh: '阵型旋转——角度完美！做得漂亮！', en: 'Formation Rotation — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9144, grade: 9, unitId: 14, order: 4,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '战旗放大', en: 'Banner Enlargement' },
    skillName: { zh: '放大变换术', en: 'Enlargement Transform' },
    skillSummary: { zh: '以定点为中心放大 k 倍', en: 'Enlarge by factor k from a center point' },
    story: { zh: '赤壁决战前，周瑜要把军旗上的图案从点 $({px}, {py})$ 以原点为中心放大 {k} 倍。放大后的坐标是多少？', en: 'Before Red Cliffs, Zhou Yu enlarges the flag design from $({px}, {py})$ by factor {k} centered at the origin. What are the new coordinates?' },
    description: { zh: '求放大后的坐标。', en: 'Find the enlarged coordinates.' },
    data: { targetX: 3, targetY: 6, px: 1, py: 2, k: 3, generatorType: 'ENLARGEMENT_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-7.3-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '周瑜："为什么要学放大变换？因为设计图纸和实物大小不同——建筑师画一个小图，工匠按比例放大来建造。数学上就是以某点为中心，乘以放大倍数。"', en: 'Zhou Yu: "Why learn enlargement? Blueprints and real objects differ in size — architects draw small, craftsmen scale up. Mathematically: multiply by the scale factor from a center."' }, highlightField: 'x' },
      { text: { zh: '周瑜："以原点为中心放大：每个坐标直接乘以放大倍数 $k$。"', en: 'Zhou Yu: "Enlargement from origin: multiply each coordinate by scale factor $k$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："$x\' = 1 \\times 3 = 3$。"', en: 'Zhou Yu: "$x\' = 1 \\times 3 = 3$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："$y\' = 2 \\times 3 = 6$。"', en: 'Zhou Yu: "$y\' = 2 \\times 3 = 6$."' }, highlightField: 'y' },
      { text: { zh: '周瑜："答案：放大后坐标 $(3, 6)$。"', en: 'Zhou Yu: "Answer: enlarged coordinates $(3, 6)$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："验算：原点到原点距 = $\\sqrt{1^2+2^2} = \\sqrt{5}$，到新点距 = $\\sqrt{9+36} = \\sqrt{45} = 3\\sqrt{5}$。正好是 3 倍。✓"', en: 'Zhou Yu: "Check: distance from origin = $\\sqrt{1+4} = \\sqrt{5}$, to new point = $\\sqrt{9+36} = 3\\sqrt{5}$. Exactly 3 times. ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '以原点为中心放大 k 倍：$(x, y) \\to (kx, ky)$。', en: 'Enlarge by k from origin: $(x, y) \\to (kx, ky)$.' }, formula: '$(x\', y\') = (kx, ky)$', tips: [{ zh: '周瑜提示：放大不走样，比例是关键。', en: 'Zhou Yu Tip: Scale without distortion — ratio is key.' }] },
    storyConsequence: { correct: { zh: '战旗放大——坐标精准！做得漂亮！', en: 'Banner Enlargement — Well done!' }, wrong: { zh: '坐标定位有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9145, grade: 9, unitId: 14, order: 5,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '东风向量', en: 'East Wind Vector' },
    skillName: { zh: '向量加法术', en: 'Vector Addition' },
    skillSummary: { zh: '两个向量相加', en: 'Add two vectors' },
    story: { zh: '赤壁之战，诸葛亮借东风。风向是向量 $\\vec{a} = (3, 2)$，水流是向量 $\\vec{b} = (1, -1)$。火船的实际移动方向 = 风 + 水流。', en: 'At Red Cliffs, Zhuge Liang summons the east wind. Wind vector $\\vec{a} = (3, 2)$, current $\\vec{b} = (1, -1)$. The fire ship\'s actual movement = wind + current.' },
    description: { zh: '求合向量 $\\vec{a} + \\vec{b}$ 的坐标。', en: 'Find the resultant vector $\\vec{a} + \\vec{b}$.' },
    data: { targetX: 4, targetY: 1, a1: 3, a2: 2, b1: 1, b2: -1, generatorType: 'VECTOR_ADD_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-7.2-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么要学向量？因为火船同时受风和水流两股力——方向不同、大小不同。向量把「方向+大小」打包成一个数学对象，加在一起就是合力。"', en: 'Zhuge Liang: "Why vectors? The fire ship faces two forces — wind and current, different directions and strengths. Vectors pack \'direction + magnitude\' into one math object; adding them gives the net force."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："向量加法超级简单：对应分量直接相加。$x$ 加 $x$，$y$ 加 $y$。"', en: 'Zhuge Liang: "Vector addition is simple: add corresponding components. $x$ plus $x$, $y$ plus $y$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："$x$ 分量：$3 + 1 = 4$。"', en: 'Zhuge Liang: "$x$ component: $3 + 1 = 4$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："$y$ 分量：$2 + (-1) = 1$。"', en: 'Zhuge Liang: "$y$ component: $2 + (-1) = 1$."' }, highlightField: 'y' },
      { text: { zh: '诸葛亮："答案：合向量 = $(4, 1)$。"', en: 'Zhuge Liang: "Answer: resultant = $(4, 1)$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："验算：画图检查——从原点画 $(3,2)$，再从终点画 $(1,-1)$，到达 $(4,1)$。✓ 东风一起，火烧连营！"', en: 'Zhuge Liang: "Check: draw $(3,2)$ from origin, then $(1,-1)$ from its tip — arrives at $(4,1)$. ✓ East wind rises, fire engulfs the fleet!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '向量加法：对应分量相加。', en: 'Vector addition: add corresponding components.' }, formula: '$\\vec{a} + \\vec{b} = (a_1+b_1, a_2+b_2)$', tips: [{ zh: '诸葛亮提示：万事俱备，只欠东风。', en: 'Zhuge Liang Tip: Everything is ready, we just need the east wind.' }] },
    storyConsequence: { correct: { zh: '东风向量——坐标精准！做得漂亮！', en: 'East Wind Vector — Well done!' }, wrong: { zh: '坐标定位有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9146, grade: 9, unitId: 14, order: 6,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '伤亡频率', en: 'Casualty Frequency' },
    skillName: { zh: '累积频率术', en: 'Cumulative Frequency' },
    skillSummary: { zh: '从频率表画累积频率曲线', en: 'Draw cumulative frequency curve from frequency table' },
    story: { zh: '赤壁之后，司马懿统计各军伤亡数据。50 个部队的阵亡人数分成 5 组。累积频率帮你回答：有多少部队伤亡不超过 20 人？', en: 'After Red Cliffs, Sima Yi tallies casualties. 50 units sorted into 5 groups. Cumulative frequency answers: how many units had 20 or fewer casualties?' },
    description: { zh: '求伤亡不超过 20 人的部队数（即累积频率）。', en: 'Find units with casualties ≤ 20 (cumulative frequency).' },
    data: { values: [20], mode: 'mean', answer: 20, groups: [{lower:0,upper:10,freq:8},{lower:10,upper:20,freq:12},{lower:20,upper:30,freq:15},{lower:30,upper:40,freq:10},{lower:40,upper:50,freq:5}], cumFreqs: [8,20,35,45,50], totalFreq: 50, generatorType: 'CUMFREQ_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-9.1-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '司马懿："为什么要学累积频率？普通频率告诉你每组有多少，累积频率告诉你到目前为止总共有多少——就像点人数时从头数到尾。"', en: 'Sima Yi: "Why cumulative frequency? Regular frequency tells per group, cumulative tells the running total — like counting people from start to end."' }, highlightField: 'ans' },
      { text: { zh: '司马懿："累积 = 逐组叠加。第一组 8，前两组 = $8 + 12 = 20$，前三组 = $20 + 15 = 35$...像滚雪球。"', en: 'Sima Yi: "Cumulative = running sum. Group 1: 8, first two: $8 + 12 = 20$, first three: $20 + 15 = 35$... like a snowball."' }, highlightField: 'ans' },
      { text: { zh: '司马懿："列表：0-10: 8 → 累积 8 | 10-20: 12 → 累积 $8+12=20$ | 20-30: 15 → 累积 35。"', en: 'Sima Yi: "Table: 0-10: 8 → cum. 8 | 10-20: 12 → cum. $8+12=20$ | 20-30: 15 → cum. 35."' }, highlightField: 'ans' },
      { text: { zh: '司马懿："伤亡 ≤ 20 对应前两组的累积频率 = 20。"', en: 'Sima Yi: "Casualties ≤ 20 corresponds to the first two groups\' cumulative = 20."' }, highlightField: 'ans' },
      { text: { zh: '司马懿："答案：20 个部队伤亡不超过 20 人。"', en: 'Sima Yi: "Answer: 20 units had casualties ≤ 20."' }, highlightField: 'ans' },
      { text: { zh: '司马懿："验算：最终累积 = $8+12+15+10+5 = 50$，等于总部队数。✓ 数据核对无误。"', en: 'Sima Yi: "Check: final cumulative = $8+12+15+10+5 = 50$, equals total units. ✓ Data verified."' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '累积频率 = 逐组频率的连续求和。', en: 'Cumulative frequency = running sum of group frequencies.' }, formula: '$CF_n = \\sum_{i=1}^{n} f_i$', tips: [{ zh: '司马懿提示：数据是冷酷的，但它不会骗人。', en: 'Sima Yi Tip: Data is cold, but it never lies.' }] },
    storyConsequence: { correct: { zh: '伤亡频率——数据分析到位！做得漂亮！', en: 'Casualty Frequency — Well done!' }, wrong: { zh: '数据分析出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 9147, grade: 9, unitId: 14, order: 7,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Statistics', type: 'PROBABILITY_TREE',
    title: { zh: '二阶兵符', en: 'Two-Stage Token' },
    skillName: { zh: '概率树形图', en: 'Probability Tree' },
    skillSummary: { zh: '两阶段独立事件概率计算', en: 'Two-stage independent event probability' },
    story: { zh: '赤壁前夜，细作两次传令。第一次成功概率 $\\frac{1}{2}$，第二次成功概率 $\\frac{1}{3}$。两次都成功的概率是多少？', en: 'On the eve of Red Cliffs, a spy delivers two messages. The first succeeds with probability $\\frac{1}{2}$, the second with $\\frac{1}{3}$. What is the probability that both succeed?' },
    description: { zh: '用树形图求两次都成功的概率。', en: 'Use a probability tree to find P(both succeed).' },
    data: { p1: 1/2, p2: 1/3, mode: 'and', frac1: '1/2', frac2: '1/3', generatorType: 'PROB_TREE_RANDOM' }, difficulty: 'Medium', reward: 280,
    kpId: 'kp-9.2-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '荀彧："为什么要学树形图？情报两次传递，每次都可能成功或失败——我们要算「都成功」的概率，树形图把每种可能性都画出来。"', en: 'Xun Yu: "Why probability trees? A message passes through two stages, each can succeed or fail — we need P(both succeed). A tree diagrams every possibility."' }, highlightField: 'p' },
      { text: { zh: '荀彧："乘法原则：独立事件同时发生，概率相乘。P(A 且 B) = P(A) × P(B)。"', en: 'Xun Yu: "Multiplication rule: independent events both occurring — multiply probabilities. P(A and B) = P(A) × P(B)."' }, highlightField: 'p' },
      { text: { zh: '荀彧："画树：第一阶段 → 成功 ($\\frac{1}{2}$) / 失败 ($\\frac{1}{2}$)。从「成功」分支再画第二阶段 → 成功 ($\\frac{1}{3}$) / 失败 ($\\frac{2}{3}$)。"', en: 'Xun Yu: "Draw tree: Stage 1 → success ($\\frac{1}{2}$) / fail ($\\frac{1}{2}$). From success branch, Stage 2 → success ($\\frac{1}{3}$) / fail ($\\frac{2}{3}$)."' }, highlightField: 'p' },
      { text: { zh: '荀彧："沿「成功-成功」路径相乘：$\\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$。"', en: 'Xun Yu: "Multiply along success-success path: $\\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$."' }, highlightField: 'p' },
      { text: { zh: '荀彧："答案：P(两次都成功) = $\\frac{1}{6}$。"', en: 'Xun Yu: "Answer: P(both succeed) = $\\frac{1}{6}$."' }, highlightField: 'p' },
      { text: { zh: '荀彧："验算：四条路径概率之和 = $\\frac{1}{6} + \\frac{2}{6} + \\frac{1}{6} + \\frac{2}{6} = 1$ ✓ 树形图每层概率之和必须为 1。"', en: 'Xun Yu: "Check: four branch probabilities sum to 1 ✓ Every level of a probability tree must sum to 1."' }, highlightField: 'p' },
    ],
    secret: { concept: { zh: '独立两阶段事件：沿树形图路径相乘，各路径概率之和为 1。', en: 'Independent two-stage events: multiply along tree paths; all paths sum to 1.' }, formula: '$P(A \\cap B) = P(A) \\times P(B)$', tips: [{ zh: '荀彧提示：树的每一层概率之和为 1，出错必能自我检验。', en: 'Xun Yu Tip: Each level of the tree sums to 1 — errors are self-checking.' }] },
    storyConsequence: { correct: { zh: '二阶兵符——概率树形图运用完美！做得漂亮！', en: 'Two-Stage Token — Well done!' }, wrong: { zh: '概率计算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
];
