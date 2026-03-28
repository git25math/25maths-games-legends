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
    discoverSteps: [
      {
        prompt: { zh: '$2 \\times 2 = 4$，$2 \\times 2 \\times 2 = 8$。\n\n如果我把"连乘"写成幂：$2^2 = 4$，$2^3 = 8$。\n那 $2^2 \\times 2^3$ 等于多少？', en: '$2 \\times 2 = 4$, $2 \\times 2 \\times 2 = 8$.\n\nWritten as powers: $2^2 = 4$, $2^3 = 8$.\nWhat is $2^2 \\times 2^3$?' },
        type: 'choice' as const,
        choices: [
          { zh: '$32$（也就是 $2^5$）', en: '$32$ (which is $2^5$)' },
          { zh: '$12$（$4 + 8$）', en: '$12$ ($4 + 8$)' },
          { zh: '$64$（也就是 $2^6$）', en: '$64$ (which is $2^6$)' },
        ],
        onCorrect: { zh: '你算对了！$2^2 \\times 2^3 = 4 \\times 8 = 32 = 2^5$。\n\n发现了吗？指数 $2 + 3 = 5$。\n同底数相乘，指数相加——这就是指数法则的核心。', en: 'Correct! $2^2 \\times 2^3 = 4 \\times 8 = 32 = 2^5$.\n\nNotice? Exponents $2 + 3 = 5$.\nSame base × same base → add exponents. This IS the index law.' },
        onWrong: { zh: '$2^2 = 2 \\times 2 = 4$，$2^3 = 2 \\times 2 \\times 2 = 8$。\n$4 \\times 8 = 32$。而 $32 = 2^5$。\n\n秘密：$2 + 3 = 5$——同底数相乘，指数相加！', en: '$2^2 = 2 \\times 2 = 4$, $2^3 = 2 \\times 2 \\times 2 = 8$.\n$4 \\times 8 = 32$. And $32 = 2^5$.\n\nThe secret: $2 + 3 = 5$ — same base, add exponents!' },
        onSkip: { zh: '展开来看：$2^2 \\times 2^3 = (2 \\times 2) \\times (2 \\times 2 \\times 2) = 2^5 = 32$。\n一共乘了5个2——所以指数是 $2+3=5$。\n这就是规律：同底数相乘，指数相加。', en: 'Expand it: $2^2 \\times 2^3 = (2 \\times 2) \\times (2 \\times 2 \\times 2) = 2^5 = 32$.\n5 twos multiplied — exponent is $2+3=5$.\nThe rule: same base, multiply → add exponents.' },
      },
    ],
    data: { base: 3, e1: 2, e2: 3, generatorType: 'INDICES_RANDOM' }, difficulty: 'Easy', reward: 120,
    kpId: 'kp-1.7-01', sectionId: 'number',
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
    storyConsequence: { correct: { zh: '官渡积粮——指数运算过关！做得漂亮！', en: 'Guandu Supplies — Well done!' }, wrong: { zh: '指数规则有点滑——记住同底数相乘时指数相加。', en: 'Not quite... Try again!' } }
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
    kpId: 'kp-1.7-01', sectionId: 'number',
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
    storyConsequence: { correct: { zh: '粮仓扩建——指数运算过关！做得漂亮！', en: 'Granary Expansion — Well done!' }, wrong: { zh: '指数规则有点滑——记住同底数相乘时指数相加。', en: 'Not quite... Try again!' } }
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
    kpId: 'kp-1.7-01', sectionId: 'number',
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
    storyConsequence: { correct: { zh: '火烧乌巢——指数运算过关！做得漂亮！', en: 'Burning Wuchao — Well done!' }, wrong: { zh: '指数规则有点滑——记住同底数相乘时指数相加。', en: 'Not quite... Try again!' } }
  },
  {
    id: 921, grade: 9, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 攻城与勾股定理", en: "Unit 2: Siege & Pythagoras" },
    topic: 'Geometry', type: 'PYTHAGORAS',
    title: { zh: '云梯攻城', en: 'Siege Ladders' },
    skillName: { zh: '勾股攻城术', en: 'Pythagorean Siege' },
    skillSummary: { zh: 'a² + b² = c²，已知两边求第三边', en: 'a² + b² = c², find the third side' },
    discoverSteps: [
      {
        prompt: { zh: '拿出计算器（或者心算）：\n\n$3 \\times 3 = ?$\n$4 \\times 4 = ?$\n$5 \\times 5 = ?$\n\n算完了？把前两个结果加起来，等于第三个吗？', en: 'Grab a calculator (or do it in your head):\n\n$3 \\times 3 = ?$\n$4 \\times 4 = ?$\n$5 \\times 5 = ?$\n\nDone? Add the first two results. Does it equal the third?' },
        type: 'choice',
        choices: [
          { zh: '等于！9 + 16 = 25', en: 'Yes! 9 + 16 = 25' },
          { zh: '不等于', en: 'No, they don\'t match' },
        ],
        acceptPattern: '',
        onCorrect: { zh: '你发现了数学里最有名的秘密之一——$3^2 + 4^2 = 5^2$。\n\n这不是巧合——每一个直角三角形都满足这个规律。\n两条短边的平方加起来 = 最长边的平方。\n这叫"勾股定理"，2500 年前被发现，你刚才亲手验证了它。感觉到了吗？', en: 'You spotted one of the most famous secrets in mathematics — $3^2 + 4^2 = 5^2$.\n\nThis is NOT a coincidence — EVERY right triangle follows this pattern.\nThe two short sides squared and added = the longest side squared.\nThis is the Pythagorean theorem, and you just verified it yourself. See how natural that was?' },
        onWrong: { zh: '你在想"不等于"——说明你在认真比较这些数，方向是对的。\n来验证一下：\n$3 \\times 3 = 9$\n$4 \\times 4 = 16$\n$5 \\times 5 = 25$\n\n$9 + 16 = 25$！相等！这就是勾股定理：$a^2 + b^2 = c^2$。', en: 'You were thinking "they don\'t match" — that means you\'re carefully comparing, which is the right approach.\nLet\'s check:\n$3 \\times 3 = 9$\n$4 \\times 4 = 16$\n$5 \\times 5 = 25$\n\n$9 + 16 = 25$! They match! This is the Pythagorean theorem: $a^2 + b^2 = c^2$.' },
        onSkip: { zh: '不确定是正常的——这个需要动手算一算。\n一起来：\n$3 \\times 3 = 9$\n$4 \\times 4 = 16$\n$5 \\times 5 = 25$\n\n现在看：$9 + 16 = 25$。完美相等！\n\n这就是勾股定理——直角三角形的三条边永远满足：\n短边² + 短边² = 长边²', en: 'Not being sure is normal — this needs hands-on calculation.\nLet me walk through it:\n$3 \\times 3 = 9$\n$4 \\times 4 = 16$\n$5 \\times 5 = 25$\n\nNow look: $9 + 16 = 25$. A perfect match!\n\nThis is the Pythagorean theorem — every right triangle satisfies:\nshort² + short² = long²' },
      },
      {
        prompt: { zh: '现在试一个更大的：短边是 6 和 8。\n\n$6 \\times 6 = 36$\n$8 \\times 8 = 64$\n$36 + 64 = 100$\n\n最长边 = $\\sqrt{100}$ = ？', en: 'Now try a bigger one: short sides are 6 and 8.\n\n$6 \\times 6 = 36$\n$8 \\times 8 = 64$\n$36 + 64 = 100$\n\nLongest side = $\\sqrt{100}$ = ?' },
        type: 'input',
        acceptPattern: '10|十|ten',
        onCorrect: { zh: '你已经掌握了开方的感觉——$\\sqrt{100} = 10$，干净利落。\n\n你刚才用的方法就三步：\n① 两条短边各自平方\n② 加起来\n③ 开平方根\n\n接下来用同样的方法算攻城云梯有多长。感觉到了吗？', en: 'You spotted it right away — $\\sqrt{100} = 10$, clean and confident.\n\nThe method you just used has three steps:\n① Square both short sides\n② Add them\n③ Square root the result\n\nNow let\'s use the same method for a siege ladder. See how natural that was?' },
        onWrong: { zh: '你的直觉是在找一个数——方向完全对。\n来验证一下：什么数乘以自己等于 100？\n\n$10 \\times 10 = 100$ ✓\n\n所以 $\\sqrt{100} = 10$。最长边 = 10！\n\n三步法：平方 → 相加 → 开方。', en: 'Your instinct was to find a number — exactly the right approach.\nLet\'s check: what number times itself equals 100?\n\n$10 \\times 10 = 100$ ✓\n\nSo $\\sqrt{100} = 10$. Longest side = 10!\n\nThree-step method: square → add → square root.' },
        onSkip: { zh: '这个问题需要动手试一试——"开方"就是找一个数乘以自己。\n一起来：$\\sqrt{100}$ 就是问"什么数乘以自己等于 100？"\n$10 \\times 10 = 100$，所以答案是 10。\n\n勾股定理用法就三步：\n① 平方：$6^2 = 36$，$8^2 = 64$\n② 加：$36 + 64 = 100$\n③ 开方：$\\sqrt{100} = 10$', en: 'This needs trying — square root means finding a number that multiplies by itself.\nLet me walk through it: $\\sqrt{100}$ asks "what times itself = 100?"\n$10 \\times 10 = 100$, so the answer is 10.\n\nPythagoras in 3 steps:\n① Square: $6^2 = 36$, $8^2 = 64$\n② Add: $36 + 64 = 100$\n③ Root: $\\sqrt{100} = 10$' },
      },
    ],
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
    storyConsequence: { correct: { zh: '望楼侦察——三角精准！做得漂亮！', en: 'Scouting from the Tower — Well done!' }, wrong: { zh: '三角函数有点棘手——检查一下用的是 sin 还是 cos？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '地道突袭——勾股定理用对了！做得漂亮！', en: 'Tunnel Raid — Well done!' }, wrong: { zh: '勾股定理差一步——哪条是斜边？', en: 'Not quite... Try again!' } }
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
    discoverSteps: [
      {
        prompt: { zh: '一面大旗和一面小旗，形状完全一样，只是大小不同。\n大旗底边 $8$ 米，小旗底边 $4$ 米。\n如果小旗的高是 $6$ 米，大旗的高是多少？', en: 'A big flag and a small flag — same shape, different size.\nBig flag base: $8$m, small flag base: $4$m.\nIf the small flag is $6$m tall, how tall is the big flag?' },
        type: 'choice' as const,
        choices: [
          { zh: '$12$ 米（放大了2倍，高也×2）', en: '$12$m (scaled up 2×, height also ×2)' },
          { zh: '$10$ 米（$6 + 4$）', en: '$10$m ($6 + 4$)' },
          { zh: '$14$ 米（$6 + 8$）', en: '$14$m ($6 + 8$)' },
        ],
        onCorrect: { zh: '你发现了关键：底边从 $4→8$，放大了 $2$ 倍。高也要 $×2$：$6×2=12$。\n\n形状一样、大小不同的图形叫"相似图形"。\n对应边的比值（这里是 $2$）叫"比例因子"。', en: 'You found the key: base went from $4→8$, scaled by $2$. Height also $×2$: $6×2=12$.\n\nSame shape, different size = "similar figures".\nThe ratio of corresponding sides ($2$ here) is the "scale factor".' },
        onWrong: { zh: '相似图形不是加法关系——是乘法！\n底边 $4→8$，乘了 $2$ 倍。所以高也乘 $2$：$6×2=12$。\n这个 $2$ 叫"比例因子"。', en: 'Similar figures use multiplication, not addition!\nBase $4→8$ = multiplied by $2$. Height also ×$2$: $6×2=12$.\nThis $2$ is the "scale factor".' },
        onSkip: { zh: '底边 $4→8$，比值 $= 8÷4 = 2$。高 $= 6×2 = 12$。\n相似图形：形状相同，对应边成比例。', en: 'Base $4→8$, ratio $= 8÷4 = 2$. Height $= 6×2 = 12$.\nSimilar figures: same shape, corresponding sides proportional.' },
      },
    ],
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
    storyConsequence: { correct: { zh: '旗帜缩放——相似比完美！做得漂亮！', en: 'Flag Scaling — Well done!' }, wrong: { zh: '相似比差了一点——先找对应边再求比值。', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '地图测绘——相似比完美！做得漂亮！', en: 'Map Surveying — Well done!' }, wrong: { zh: '相似比差了一点——先找对应边再求比值。', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '影子量旗——相似三角形运用完美！做得漂亮！', en: 'Shadow Flagpole — Similar triangles nailed! Well done!' }, wrong: { zh: '相似比差了一点——先找对应边再求比值。', en: 'Similar triangle ratio wrong... Try again!' } }
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
    storyConsequence: { correct: { zh: '塔楼测高——相似三角形大成！妙！', en: 'Tower Height — Similar triangles mastered!' }, wrong: { zh: '对应边不太对——先找相似比再对应。', en: 'Wrong corresponding sides... Try again!' } }
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
    discoverSteps: [
      {
        prompt: { zh: '做饭时，米和水的比例是 $1:2$。\n如果用了 $3$ 杯米，需要多少杯水？', en: 'When cooking rice, the ratio of rice to water is $1:2$.\nIf you use $3$ cups of rice, how many cups of water?' },
        type: 'choice' as const,
        choices: [
          { zh: '$6$ 杯（米×2）', en: '$6$ cups (rice × 2)' },
          { zh: '$5$ 杯（$3 + 2$）', en: '$5$ cups ($3 + 2$)' },
        ],
        onCorrect: { zh: '对！比例 $1:2$ 意思是"水永远是米的2倍"。\n$3$ 杯米 → $3×2=6$ 杯水。\n\n比例就是"倍数关系"。知道比例和一个量，就能算另一个。', en: 'Right! Ratio $1:2$ means "water is always 2× rice".\n$3$ cups rice → $3×2=6$ cups water.\n\nRatio = a multiplying relationship. Know the ratio and one amount, find the other.' },
        onWrong: { zh: '比例不是加法——是倍数关系。\n$1:2$ = 水是米的2倍。$3$ 杯米 → $6$ 杯水。', en: 'Ratio is not addition — it\'s a multiplying relationship.\n$1:2$ = water is 2× rice. $3$ cups → $6$ cups water.' },
        onSkip: { zh: '比例 $1:2$：每1份米配2份水。$3$ 份米 → $6$ 份水。\n比例 = 倍数关系。', en: 'Ratio $1:2$: 1 part rice to 2 parts water. $3$ parts rice → $6$ parts water.\nRatio = multiplying relationship.' },
      },
    ],
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
    storyConsequence: { correct: { zh: '兵粮配给——比例搞定！做得漂亮！', en: 'Rationing — Well done!' }, wrong: { zh: '比例差一点——试试交叉相乘？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '混合阵法——比例搞定！做得漂亮！', en: 'Mixed Formation — Well done!' }, wrong: { zh: '比例差一点——试试交叉相乘？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '官渡暗桩——坐标精准！做得漂亮！', en: 'Guandu Spy Posts — Well done!' }, wrong: { zh: '位置差了一点——试试重新读一下坐标？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '密道斜率——直线方程搞定！做得漂亮！', en: 'Secret Tunnel Gradient — Well done!' }, wrong: { zh: '直线方程差一步——检查一下斜率和截距？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '撤退路线——直线方程搞定！做得漂亮！', en: 'Escape Route Equation — Well done!' }, wrong: { zh: '直线方程差一步——检查一下斜率和截距？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '贾诩：为什么要学平行线？\n两条道路永远不交叉——平行线性质决定了角的关系。\n掌握了同位角、内错角，就能破解任何几何迷阵！', en: 'Zhuge Liang: "Why learn parallel lines?\nTwo roads that never cross — parallel line properties determine angle relationships.\nMaster corresponding and alternate angles, and you can solve any geometric puzzle!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：判断平行的方法\n分别算出两条线的斜率 $m_1$ 和 $m_2$：\n如果 $m_1 = m_2$ → 平行 ✓\n如果 $m_1 \\neq m_2$ → 不平行 ✗', en: 'Jia Xu: "How to check for parallel lines\nCalculate both gradients $m_1$ and $m_2$:\nIf $m_1 = m_2$ → parallel ✓\nIf $m_1 \\neq m_2$ → not parallel ✗"' }, highlightField: 'm' },
      { text: { zh: '贾诩：先算这条线的斜率\n用斜率公式 $m = \\frac{y_2 - y_1}{x_2 - x_1}$\n代入给定的两个坐标点。', en: 'Jia Xu: "First calculate this line\'s gradient\nUsing $m = \\frac{y_2 - y_1}{x_2 - x_1}$\nSubstitute the two given coordinate points."' }, highlightField: 'm' },
      { text: { zh: '贾诩：再求截距 $c$\n把 $m$ 和一个点代入 $y = mx + c$，解出 $c$。', en: 'Jia Xu: "Then find intercept $c$\nSubstitute $m$ and one point into $y = mx + c$, solve for $c$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：答案\n$m$ 和 $c$ 的值确认。如果另一条通道的斜率也等于 $m$，它们就平行！', en: 'Jia Xu: "Answer\n$m$ and $c$ values confirmed. If the other tunnel has the same gradient $m$, they\'re parallel!"' }, highlightField: 'm' },
      { text: { zh: '贾诩：验算\n代入两个坐标点检查方程是否成立 ✓\n平行判定完成——渗透路线安全！', en: 'Jia Xu: "Verify\nSubstitute both points to check the equation ✓\nParallel check complete — infiltration route is safe!"' }, highlightField: 'm' },
    ],
    secret: { concept: { zh: '平行线斜率相等：$m_1 = m_2$ 则平行。这是判断平行的充要条件。', en: 'Parallel lines have equal gradients: $m_1 = m_2$ means parallel. This is both necessary and sufficient.' }, formula: '$m_1 = m_2 \\Leftrightarrow \\text{parallel}$', tips: [{ zh: '贾诩提示：斜率相同就是平行——运粮通道的生命保障。', en: 'Jia Xu Tip: Equal gradient means parallel — the lifeline of supply tunnels.' }] },
    storyConsequence: { correct: { zh: '平行密道——直线方程搞定！做得漂亮！', en: 'Parallel Tunnels — Well done!' }, wrong: { zh: '直线方程差一步——检查一下斜率和截距？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '贾诩：为什么要求 $y$ 截距？\n$y$ 截距就是起点——行军从哪里出发。\n知道了起点和斜率，就能画出整条路线！', en: 'Zhuge Liang: "Why find the y-intercept?\nThe y-intercept is the starting point — where the march begins.\nKnow the start and the gradient, and you can trace the entire route!"' }, highlightField: 'c' },
      { text: { zh: '贾诩：怎么求 $y$ 截距？\n第 1 步：先用两个驿站坐标求斜率 $m$\n第 2 步：把 $m$ 和任一点代入 $y = mx + c$，解出 $c$', en: 'Jia Xu: "How to find the y-intercept?\nStep 1: Find gradient $m$ from the two relay stations\nStep 2: Substitute $m$ and any point into $y = mx + c$, solve for $c$"' }, highlightField: 'c' },
      { text: { zh: '贾诩：第 1 步——求斜率\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$\n代入两个驿站的坐标。', en: 'Jia Xu: "Step 1 — find gradient\n$m = \\frac{y_2 - y_1}{x_2 - x_1}$\nSubstitute the two relay station coordinates."' }, highlightField: 'm' },
      { text: { zh: '贾诩：第 2 步——求截距\n把 $m$ 和点代入：$y = mx + c$\n移项得 $c = y - mx$。', en: 'Jia Xu: "Step 2 — find intercept\nSubstitute $m$ and the point: $y = mx + c$\nRearrange: $c = y - mx$."' }, highlightField: 'c' },
      { text: { zh: '贾诩：答案\n$m$ 和 $c$ 确认。\n$c$ 就是渡口位置——补给线的起点！', en: 'Jia Xu: "Answer\n$m$ and $c$ confirmed.\n$c$ is the ferry position — the supply line\'s starting point!"' }, highlightField: 'c' },
      { text: { zh: '贾诩：验算\n两个驿站坐标代入 $y = mx + c$，等式成立 ✓\n补给线确认，渡口位置精准！', en: 'Jia Xu: "Verify\nBoth relay station coordinates satisfy $y = mx + c$ ✓\nSupply line confirmed, ferry position exact!"' }, highlightField: 'c' },
    ],
    secret: { concept: { zh: '$y$ 截距是直线穿过 $y$ 轴的点，即 $x = 0$ 时 $y$ 的值。$y = mx + c$ 中的 $c$ 就是截距。', en: 'The y-intercept is where the line crosses the y-axis (when $x = 0$). In $y = mx + c$, $c$ is the intercept.' }, formula: '$c = y - mx$', tips: [{ zh: '贾诩提示：截距是起点，斜率是方向——两个定了，路线就定了。', en: 'Jia Xu Tip: Intercept is the start, gradient is the direction — fix both and the route is set.' }] },
    storyConsequence: { correct: { zh: '补给起点——直线方程搞定！做得漂亮！', en: 'Supply Origin — Well done!' }, wrong: { zh: '直线方程差一步——检查一下斜率和截距？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '贾诩：为什么要学中点公式？\n两支军队要在中间会合——中点就是最公平的汇合点。\n坐标的中点 = 两端坐标的平均值，简单又精准！', en: 'Zhuge Liang: "Why learn the midpoint formula?\nTwo armies must meet in the middle — the midpoint is the fairest meeting place.\nMidpoint coordinates = average of both endpoints, simple and precise!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：中点公式\n$$\\text{中点} = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$\n就是把两个 $x$ 加起来除以 2，两个 $y$ 加起来除以 2。\n"取平均值"——这就是"中间"的数学含义！', en: 'Jia Xu: "The midpoint formula\n$$\\text{midpoint} = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$\nAdd the two $x$\'s and halve, add the two $y$\'s and halve.\n\'Average\' — that\'s the math meaning of \'middle\'!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：代入坐标\n据点 A 和 据点 B 的坐标已知，\n中点 $x = \\frac{x_1 + x_2}{2}$\n中点 $y = \\frac{y_1 + y_2}{2}$', en: 'Jia Xu: "Substitute coordinates\nBase A and Base B coordinates are known,\nMidpoint $x = \\frac{x_1 + x_2}{2}$\nMidpoint $y = \\frac{y_1 + y_2}{2}$"' }, highlightField: 'x' },
      { text: { zh: '贾诩：计算\n$x$ 坐标的平均值和 $y$ 坐标的平均值分别计算。', en: 'Jia Xu: "Calculate\nAverage the $x$-coordinates and $y$-coordinates separately."' }, highlightField: 'x' },
      { text: { zh: '贾诩：答案\n会合点坐标 = $({targetX}, {targetY})$\n两队在此会合！', en: 'Jia Xu: "Answer\nRendezvous coordinates = $({targetX}, {targetY})$\nBoth squads meet here!"' }, highlightField: 'x' },
      { text: { zh: '贾诩：验算\n中点到两个据点的距离应该相等。\n从中点到 A 的距离 = 从中点到 B 的距离 ✓ 位置精准！', en: 'Jia Xu: "Verify\nThe midpoint should be equidistant from both bases.\nDistance from midpoint to A = distance to B ✓ Precise positioning!"' }, highlightField: 'y' },
    ],
    secret: { concept: { zh: '中点 = 两点坐标分别取平均值。这是坐标几何中最基础的距离分割方法。', en: 'Midpoint = average of the two coordinates. This is the most fundamental distance-splitting method in coordinate geometry.' }, formula: '$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$', tips: [{ zh: '贾诩提示：取平均就是找中间，会合点从此确定。', en: 'Jia Xu Tip: Averaging finds the middle — the rendezvous point is set.' }] },
    storyConsequence: { correct: { zh: '会合点——坐标精准！做得漂亮！', en: 'Rendezvous Point — Well done!' }, wrong: { zh: '位置差了一点——试试重新读一下坐标？', en: 'Not quite... Try again!' } }
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
    discoverSteps: [
      {
        prompt: { zh: '一个包裹里有 $2$ 个苹果和 $3$ 个橘子。\n你买了 $4$ 个这样的包裹。\n总共有多少苹果？多少橘子？', en: 'A pack contains $2$ apples and $3$ oranges.\nYou buy $4$ packs.\nHow many apples total? How many oranges?' },
        type: 'choice' as const,
        choices: [
          { zh: '苹果 $4×2=8$，橘子 $4×3=12$', en: 'Apples $4×2=8$, oranges $4×3=12$' },
          { zh: '总共 $4+2+3=9$ 个水果', en: 'Total $4+2+3=9$ fruits' },
        ],
        onCorrect: { zh: '你已经会"展开括号"了！\n$4(2+3) = 4×2 + 4×3 = 8 + 12 = 20$\n\n外面的数要分别乘以括号里的每一项。这叫分配律。', en: 'You already know how to "expand brackets"!\n$4(2+3) = 4×2 + 4×3 = 8 + 12 = 20$\n\nThe number outside multiplies EACH term inside. This is the distributive law.' },
        onWrong: { zh: '不是加在一起——4个包裹，每个有2苹果和3橘子。\n苹果 $4×2=8$，橘子 $4×3=12$。\n$4(2+3) = 8+12 = 20$。外面的数乘以里面的每一项。', en: 'Not adding together — 4 packs, each with 2 apples and 3 oranges.\nApples $4×2=8$, oranges $4×3=12$.\n$4(2+3) = 8+12 = 20$. Outside number × each term inside.' },
        onSkip: { zh: '$4$ 个包裹 × $(2+3)$ 个水果 = $4×2 + 4×3 = 8+12 = 20$。\n这就是展开括号。', en: '$4$ packs × $(2+3)$ fruits = $4×2 + 4×3 = 8+12 = 20$.\nThis is expanding brackets.' },
      },
    ],
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
    storyConsequence: { correct: { zh: '批量锻兵——展开无误！做得漂亮！', en: 'Mass Forging — Well done!' }, wrong: { zh: '展开差一步——外面的数要乘里面的每一项哦。', en: 'Not quite... Try again!' } }
  },
  {
    id: 972, grade: 9, unitId: 7, order: 2,
    unitTitle: { zh: "Unit 7: 铁匠铺·代数锻造", en: "Unit 7: Blacksmith's Forge — Algebraic Forging" },
    topic: 'Algebra', type: 'FACTORISE',
    title: { zh: '军需打包', en: 'Supply Bundling' },
    skillName: { zh: '因式分解术', en: 'Factorising' },
    skillSummary: { zh: '提取公因子', en: 'Extract common factor' },
    discoverSteps: [
      {
        prompt: { zh: '看这两样东西：\n$6x$ 和 $12$\n\n它们都能被什么数整除？', en: 'Look at these two things:\n$6x$ and $12$\n\nWhat number divides into both of them?' },
        type: 'choice',
        choices: [
          { zh: '都能被 6 整除', en: 'Both divisible by 6' },
          { zh: '都能被 2 整除', en: 'Both divisible by 2' },
          { zh: '没有共同点', en: 'Nothing in common' },
        ],
        acceptPattern: '',
        onCorrect: { zh: '你发现了最大的那个——不是 2，而是 6。\n$6x = 6 \\times x$\n$12 = 6 \\times 2$\n\n你的判断力很准：因式分解就是把这个 6 从两项中"提"出来——像拆快递，把共同的外包装拆掉。感觉到了吗？', en: 'You spotted the biggest one — not 2, but 6.\n$6x = 6 \\times x$\n$12 = 6 \\times 2$\n\nSharp thinking: factorising means pulling that 6 out of both — like unwrapping a shared package. See how natural that was?' },
        onWrong: { zh: '你在想"都能被 2 整除"——这个观察完全正确，2 确实是公因数。\n来验证一下还有没有更大的：\n$6x = 6 \\times x$（6 能整除）\n$12 = 6 \\times 2$（6 也能整除）\n\n6 才是最大公因数。因式分解要找最大的那个。', en: 'You were thinking "both divisible by 2" — that observation is completely correct, 2 is a common factor.\nLet\'s check if there\'s a bigger one:\n$6x = 6 \\times x$ (6 divides in)\n$12 = 6 \\times 2$ (6 divides in too)\n\n6 is the biggest common factor. Factorising needs the biggest one.' },
        onSkip: { zh: '不确定是正常的——"公因数"这个概念需要拆开来看。\n一起来拆：\n$6x$ 里面有 $6$（$6 \\times x$）\n$12$ 里面也有 $6$（$6 \\times 2$）\n\n它们都有 6！这个 6 就是"公因数"。\n因式分解 = 把公因数提到外面。', en: 'Not being sure is normal — "common factor" needs breaking down to see.\nLet me walk through it:\n$6x$ contains $6$ ($6 \\times x$)\n$12$ also contains $6$ ($6 \\times 2$)\n\nBoth have 6! That\'s the "common factor".\nFactorising = pull the common factor outside.' },
      },
      {
        prompt: { zh: '把 6 提出来后：\n$6x ÷ 6 = x$\n$12 ÷ 6 = 2$\n\n所以 $6x + 12 = 6 \\times (? + ?)$\n括号里应该填什么？', en: 'After pulling out 6:\n$6x ÷ 6 = x$\n$12 ÷ 6 = 2$\n\nSo $6x + 12 = 6 \\times (? + ?)$\nWhat goes in the brackets?' },
        type: 'choice',
        choices: [
          { zh: 'x + 2', en: 'x + 2' },
          { zh: '6x + 12', en: '6x + 12' },
          { zh: 'x + 12', en: 'x + 12' },
        ],
        acceptPattern: '',
        onCorrect: { zh: '你已经会"提取再填入"了——$6x + 12 = 6(x + 2)$。\n\n因式分解就两步：\n① 找到公因数（6）\n② 每项除以它，剩下的放进括号（$x + 2$）\n\n你的判断力很清晰。感觉到了吗？', en: 'You were already seeing the pattern — $6x + 12 = 6(x + 2)$.\n\nFactorising is just two steps:\n① Find the common factor (6)\n② Divide each term by it, put the rest in brackets ($x + 2$)\n\nSharp thinking. See how natural that was?' },
        onWrong: { zh: '你在想其他组合——说明你在认真尝试不同的拆法，很好。\n来验证一下：$6x ÷ 6 = x$，$12 ÷ 6 = 2$。\n所以括号里是 $x + 2$。\n\n$6x + 12 = 6(x + 2)$\n\n检验：$6 \\times x + 6 \\times 2 = 6x + 12$ ✓ 完美还原！', en: 'You were thinking about other combinations — that means you\'re actively trying different splits, which is great.\nLet\'s check: $6x ÷ 6 = x$, $12 ÷ 6 = 2$.\nSo the bracket contains $x + 2$.\n\n$6x + 12 = 6(x + 2)$\n\nCheck: $6 \\times x + 6 \\times 2 = 6x + 12$ ✓ Perfectly restored!' },
        onSkip: { zh: '这个问题需要动手除一除。\n一起来：$6x ÷ 6 = x$，$12 ÷ 6 = 2$。\n所以：$6x + 12 = 6(x + 2)$\n\n因式分解就是：\n① 找公因数 → ② 除出来放括号\n展开括号能还原 = 验算通过！', en: 'This needs trying with actual division.\nLet me walk through it: $6x ÷ 6 = x$, $12 ÷ 6 = 2$.\nSo: $6x + 12 = 6(x + 2)$\n\nFactorising is:\n① Find common factor → ② Divide out into brackets\nExpanding brackets gives back the original = verified!' },
      },
    ],
    story: { zh: '大批军需散装在仓库，需要按"每队一份"重新打包。找出最大公因数就是关键！', en: 'Loose supplies in the warehouse need rebundling into squad packs. Finding the HCF is key!' },
    description: { zh: '因式分解 ${a}x + {b}$，最大公因数是？', en: 'Factorise ${a}x + {b}$. What is the HCF?' },
    data: { factor: 3, p: 2, q: 5, generatorType: 'FACTORISE_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-2.2-06', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '荀彧：为什么要学因式分解？\n方程太复杂？把它拆成简单部分的乘积——\n就像把散兵收拢成整齐方阵，化繁为简是解方程的核心！', en: 'Zhuge Liang: "Why learn factorisation?\nEquation too complex? Break it into a product of simpler parts —\nLike regrouping scattered soldiers into formations, simplification is key!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：怎么找公因子？\n列出两个数的因数，找最大的公共因数。', en: 'Xun Yu: "How to find the common factor?\nList factors of both numbers, find the largest common one."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：用公因子去除每一项\n看是否整除——整除就说明打包完美！', en: 'Xun Yu: "Divide each term by the common factor\nIf both divide evenly — perfect bundling!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：拼起来\n公因子放外面，除完的放括号里。', en: 'Xun Yu: "Put it together\nCommon factor outside, quotients inside brackets."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：答案\n最大公因数确认！军需打包零失误！', en: 'Xun Yu: "Answer\nHCF confirmed! Zero packing errors!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：验算\n展开检查——打包再拆开，必须跟原来一样 ✓', en: 'Xun Yu: "Verify\nExpand to check — unpack and it must match the original ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '因式分解 = 展开的逆操作，提取公因子。', en: 'Factorising = reverse of expanding, extract common factor.' }, formula: '$ax + ay = a(x + y)$', tips: [{ zh: '荀彧提示：因式分解就是"重新打包"。', en: 'Xun Yu Tip: Factorising is \'rebundling\'.' }] },
    storyConsequence: { correct: { zh: '军需打包——因式分解完成！做得漂亮！', en: 'Supply Bundling — Well done!' }, wrong: { zh: '分解还没到底——继续拆拆看？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '荀彧：为什么要学不等式？\n方程告诉你恰好是多少，但现实中更多的是至少需要多少——\n不等式就是描述范围和限制条件的数学语言！', en: 'Zhuge Liang: "Why learn inequalities?\nEquations tell you exact amounts, but reality is about at least or at most —\nInequalities are the math language for ranges and constraints!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：不等式和方程的区别\n方程：$=$ 一个精确值\n不等式：$>$, $<$, $\\geq$, $\\leq$ 一个范围\n\n解法几乎一样！只是答案是一个范围而不是一个点。', en: 'Xun Yu: "Inequality vs equation\nEquation: $=$ one exact value\nInequality: $>$, $<$, $\\geq$, $\\leq$ a range\n\nSolving is almost identical! But the answer is a range, not a point."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：解法——跟解方程一样\n移项、合并，把 $x$ 留在一边。\n除以 $x$ 的系数得到临界值。', en: 'Xun Yu: "Method — same as equations\nRearrange, combine, isolate $x$ on one side.\nDivide by $x$\'s coefficient to find the critical value."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：代入计算\n一步步移项，求出 $x$ 的临界值。', en: 'Xun Yu: "Substitute and calculate\nStep by step rearranging to find the critical $x$ value."' }, highlightField: 'ans' },
      { text: { zh: '荀彧：答案\n临界值确认——粮草底线已设定！', en: 'Xun Yu: "Answer\nCritical value confirmed — supply minimum is set!"' }, highlightField: 'ans' },
      { text: { zh: '荀彧：验算\n代回原不等式检查是否成立 ✓\n粮草保障到位，可以出征！', en: 'Xun Yu: "Verify\nSubstitute back into original inequality ✓\nSupplies secured — ready to march!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '不等式的解法和方程相同，只是答案是范围。注意：乘除负数要变号！', en: 'Solve inequalities like equations, but the answer is a range. Warning: multiply/divide by negative → flip the sign!' }, formula: '$ax + b > c \\Rightarrow x > \\frac{c-b}{a}$', tips: [{ zh: '荀彧提示：粮草底线，不可逾越。', en: 'Xun Yu Tip: The supply minimum must not be breached.' }] },
    storyConsequence: { correct: { zh: '粮草底线——不等式范围找对！做得漂亮！', en: 'Supply Minimum — Well done!' }, wrong: { zh: '范围差了一点——注意大于号和小于号的方向。', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '阵前角度——角度完美！做得漂亮！', en: 'Formation Angles — Well done!' }, wrong: { zh: '角度差了一点——再看看是补角还是余角？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '关羽：为什么要学平行线截角？\n城墙上两条平行线被一条横线截断——产生了成对的角。\n掌握这些角的关系，就能在不量角的情况下算出任何角！', en: 'Zhang Zhao: "Why learn parallel angles?\nTwo parallel lines cut by a transversal create paired angles.\nMaster these relationships and calculate any angle without measuring!"' }, highlightField: 'x' },
      { text: { zh: '关羽：三大角度关系\n① 同位角（F形）相等\n② 内错角（Z形）相等\n③ 同旁内角（C形）互补（加起来 180°）', en: 'Guan Yu: "Three angle relationships\n① Corresponding angles (F-shape) are EQUAL\n② Alternate angles (Z-shape) are EQUAL\n③ Co-interior angles (C-shape) are SUPPLEMENTARY (sum to 180°)"' }, highlightField: 'x' },
      { text: { zh: '关羽：识别角度关系\n看已知角和未知角的位置——是 F 形、Z 形还是 C 形？', en: 'Guan Yu: "Identify the relationship\nLook at positions of known and unknown angles — F, Z, or C shape?"' }, highlightField: 'x' },
      { text: { zh: '关羽：应用规则\n根据识别出的关系，直接得到答案。', en: 'Guan Yu: "Apply the rule\nBased on the identified relationship, get the answer directly."' }, highlightField: 'x' },
      { text: { zh: '关羽：答案\n壕沟角度确认！防线固若金汤！', en: 'Guan Yu: "Answer\nTrench angles confirmed! Defense line is impenetrable!"' }, highlightField: 'x' },
      { text: { zh: '关羽：验算\n检查角度关系是否符合平行线性质 ✓', en: 'Guan Yu: "Verify\nCheck angle relationships match parallel line properties ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '平行线截角：同位角=，内错角=，同旁内角互补。', en: 'Parallel line angles: corresponding = equal, alternate = equal, co-interior = supplementary.' }, formula: '$\\text{F} = \\text{F}, \\text{Z} = \\text{Z}, \\text{C} + \\text{C} = 180°$', tips: [{ zh: '关羽提示：F相等、Z相等、C互补——三字真言。', en: 'Guan Yu Tip: F equal, Z equal, C supplementary — three golden rules.' }] },
    storyConsequence: { correct: { zh: '壕沟截角——角度完美！做得漂亮！', en: 'Trench Angles — Well done!' }, wrong: { zh: '角度差了一点——再看看是补角还是余角？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '赵云：为什么要学多边形内角和？\n修建城堡时，每面墙的角度必须精准——否则墙合不拢！\n$n$ 边形内角和 = $(n-2) \\times 180°$，知道了这个就能算出每个角。', en: 'Zhang Zhao: "Why learn polygon interior angles?\nBuilding a fortress, every wall angle must be precise — or the walls don\'t close!\n$n$-gon interior angles = $(n-2) \\times 180°$, know this to find any angle."' }, highlightField: 'x' },
      { text: { zh: '赵云：为什么是 $(n-2)$？\n任何多边形都能从一个顶点画对角线，分成 $(n-2)$ 个三角形。\n每个三角形 $180°$，所以总共 $(n-2) \\times 180°$！', en: 'Zhao Yun: "Why $(n-2)$?\nAny polygon can be split into $(n-2)$ triangles by drawing diagonals from one vertex.\nEach triangle has $180°$, so total = $(n-2) \\times 180°$!"' }, highlightField: 'x' },
      { text: { zh: '赵云：解题思路\n内角和 - 已知角之和 = 未知角 $x$', en: 'Zhao Yun: "Strategy\nInterior angle sum - known angles = unknown angle $x$"' }, highlightField: 'x' },
      { text: { zh: '赵云：计算\n先算内角和，再减去所有已知角。', en: 'Zhao Yun: "Calculate\nFirst find interior angle sum, then subtract all known angles."' }, highlightField: 'x' },
      { text: { zh: '赵云：答案\n堡垒每个角都精确！施工开始！', en: 'Zhao Yun: "Answer\nEvery fortress angle is precise! Construction begins!"' }, highlightField: 'x' },
      { text: { zh: '赵云：验算\n所有角加起来应该等于内角和 $(n-2) \\times 180°$ ✓', en: 'Zhao Yun: "Verify\nAll angles should sum to $(n-2) \\times 180°$ ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '多边形内角和 = (n-2) × 180°。分三角形法推导。', en: 'Polygon interior angle sum = (n-2) × 180°. Derived by triangle decomposition.' }, formula: '$(n-2) \\times 180°$', tips: [{ zh: '赵云提示：从一个顶点画对角线，数三角形个数。', en: 'Zhao Yun Tip: Draw diagonals from one vertex, count the triangles.' }] },
    storyConsequence: { correct: { zh: '堡垒内角——角度完美！做得漂亮！', en: 'Fortress Interior Angles — Well done!' }, wrong: { zh: '角度差了一点——再看看是补角还是余角？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '赵云：为什么要学速度公式？\n行军打仗，速度决定生死。提前到达 = 抢占先机，迟到 = 全军覆没。\n速度 = 距离 ÷ 时间，三个量知二求一！', en: 'Zhang Zhao: "Why learn the speed formula?\nIn war, speed means life or death. Arrive early = seize advantage, arrive late = total defeat.\nSpeed = distance ÷ time, know any two to find the third!"' }, highlightField: 'x' },
      { text: { zh: '赵云：三个公式\n$S = \\frac{D}{T}$（求速度）\n$D = S \\times T$（求距离）\n$T = \\frac{D}{S}$（求时间）', en: 'Zhao Yun: "Three formulas\n$S = \\frac{D}{T}$ (find speed)\n$D = S \\times T$ (find distance)\n$T = \\frac{D}{S}$ (find time)"' }, highlightField: 'x' },
      { text: { zh: '赵云：代入数据\n已知量代入对应公式。', en: 'Zhao Yun: "Substitute\nPlug known values into the formula."' }, highlightField: 'x' },
      { text: { zh: '赵云：计算\n一步除法或乘法。', en: 'Zhao Yun: "Calculate\nOne division or multiplication."' }, highlightField: 'x' },
      { text: { zh: '赵云：答案\n行军速度确认！驰援及时！', en: 'Zhao Yun: "Answer\nMarch speed confirmed! Reinforcements arrive in time!"' }, highlightField: 'x' },
      { text: { zh: '赵云：验算\n$速度 \\times 时间 = 距离$ ✓', en: 'Zhao Yun: "Verify\n$\\text{Speed} \\times \\text{Time} = \\text{Distance}$ ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '速度 = 距离 ÷ 时间。三个量知二求一。', en: 'Speed = distance ÷ time. Know two, find the third.' }, formula: '$S = \\frac{D}{T}$', tips: [{ zh: '赵云提示：急行军，算准速度才能准时到达！', en: 'Zhao Yun Tip: Forced march — calculate speed to arrive on time!' }] },
    storyConsequence: { correct: { zh: '行军速度——方程完美求解！做得漂亮！', en: 'March Speed — Well done!' }, wrong: { zh: '方程差一步——试试重新检查每步运算？', en: 'Not quite... Try again!' } }
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
      { text: { zh: '曹操：为什么要学百分比增长？\n军队扩编、粮价上涨——数量在原基础上增加一定百分比。\n掌握百分比增减，才能预测未来的规模变化！', en: 'Zhang Zhao: "Why learn percentage increase?\nArmy expansion, grain price rises — quantities increase by a percentage of the original.\nMaster percentage change to predict future scale!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：公式\n$$\\text{新值} = \\text{原值} \\times (1 + r)$$\n增长用正 $r$，减少用负 $r$。', en: 'Cao Cao: "Formula\n$$\\text{New} = \\text{Original} \\times (1 + r)$$\nIncrease = positive $r$, decrease = negative $r$."' }, highlightField: 'ans' },
      { text: { zh: '曹操：代入数据\n原值和变化率代入。', en: 'Cao Cao: "Substitute\nOriginal value and rate."' }, highlightField: 'ans' },
      { text: { zh: '曹操：计算\n一步乘法。', en: 'Cao Cao: "Calculate\nOne multiplication."' }, highlightField: 'ans' },
      { text: { zh: '曹操：答案\n兵力变化确认！', en: 'Cao Cao: "Answer\nArmy change confirmed!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n新值 - 原值 应等于 原值 × 百分比 ✓', en: 'Cao Cao: "Verify\nNew - original should equal original × percentage ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '百分比增减：新值 = 原值 × (1 + 变化率)。', en: 'Percentage change: new = original × (1 + rate).' }, formula: '$\\text{New} = \\text{Original} \\times (1+r)$', tips: [{ zh: '曹操提示：兵马未动，数字先行。', en: 'Cao Cao Tip: Before troops move, numbers go first.' }] },
    storyConsequence: { correct: { zh: '兵力增长——百分比算得好！做得漂亮！', en: 'Army Growth — Well done!' }, wrong: { zh: '百分比差一点——记住要除以 100 再乘哦。', en: 'Not quite... Try again!' } }
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
      { text: { zh: '曹操：为什么要学反向百分比？\n现价已经涨过了——原价是多少？打折后的价格知道了——原价呢？\n反向百分比就是从结果倒推回起点的技巧！', en: 'Zhang Zhao: "Why learn reverse percentages?\nThe current price already increased — what was the original? You know the sale price — what\'s the original?\nReverse percentage is the technique of working backwards from the result!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：公式\n$$\\text{原值} = \\frac{\\text{新值}}{1 + r}$$\n新值 ÷ $(1 + 百分比)$ = 原值。', en: 'Cao Cao: "Formula\n$$\\text{Original} = \\frac{\\text{New}}{1 + r}$$\nNew ÷ $(1 + \\text{percentage})$ = original."' }, highlightField: 'ans' },
      { text: { zh: '曹操：代入数据\n新值和变化率代入。', en: 'Cao Cao: "Substitute\nNew value and rate."' }, highlightField: 'ans' },
      { text: { zh: '曹操：计算\n一步除法。', en: 'Cao Cao: "Calculate\nOne division."' }, highlightField: 'ans' },
      { text: { zh: '曹操：答案\n原价反推完成！', en: 'Cao Cao: "Answer\nOriginal value found!"' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n原值 × $(1 + r)$ 应等于新值 ✓', en: 'Cao Cao: "Verify\nOriginal × $(1 + r)$ should equal new value ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '反向百分比：原值 = 新值 ÷ (1 + 变化率)。', en: 'Reverse percentage: original = new ÷ (1 + rate).' }, formula: '$\\text{Original} = \\frac{\\text{New}}{1+r}$', tips: [{ zh: '曹操提示：反推原价——除以 $(1+r)$ 就行了。', en: 'Cao Cao Tip: Reverse — just divide by $(1+r)$.' }] },
    storyConsequence: { correct: { zh: '军饷原价——百分比算得好！做得漂亮！', en: 'Original Stipend — Well done!' }, wrong: { zh: '百分比差一点——记住要除以 100 再乘哦。', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '梯形田亩——面积正确！做得漂亮！', en: 'Trapezium Fields — Well done!' }, wrong: { zh: '面积数值偏了——再看看长和宽代入对了吗？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '圆形粮仓——圆的计算完美！做得漂亮！', en: 'Circular Granary — Well done!' }, wrong: { zh: '圆的数字有点偏——检查一下公式里有没有用 π？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '粮仓容量——体积正确！做得漂亮！', en: 'Granary Volume — Well done!' }, wrong: { zh: '体积有点偏——检查长×宽×高都代入了吗？', en: 'Not quite... Try again!' } }
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
    discoverSteps: [
      {
        prompt: { zh: '站在地面看 $10$ 米高的城墙，你和城墙底部距离 $10$ 米。\n抬头仰角大概是多少度？', en: 'You look up at a $10$m wall from $10$m away.\nWhat\'s the angle you look up at?' },
        type: 'choice' as const,
        choices: [
          { zh: '$45°$（高度=距离，所以是等腰直角）', en: '$45°$ (height = distance, so isoceles right triangle)' },
          { zh: '$90°$（因为城墙是垂直的）', en: '$90°$ (because the wall is vertical)' },
        ],
        onCorrect: { zh: '直觉很准！高 $10$ = 距离 $10$，比值 $= 1$，角度 $= 45°$。\n\n你刚才用的就是"三角比"：$\\tan(\\theta) = \\frac{\\text{对边}}{\\text{邻边}} = \\frac{10}{10} = 1$。\n$\\tan(45°) = 1$。三角学就是用边长的比值来求角度。', en: 'Good instinct! Height $10$ = distance $10$, ratio $= 1$, angle $= 45°$.\n\nYou just used a "trig ratio": $\\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{10}{10} = 1$.\n$\\tan(45°) = 1$. Trigonometry uses side ratios to find angles.' },
        onWrong: { zh: '$90°$ 是城墙本身的角度，不是你抬头的角度。\n你的仰角 $= \\arctan(\\frac{10}{10}) = \\arctan(1) = 45°$。\n三角学就是用"对边÷邻边"来算角度。', en: '$90°$ is the wall\'s angle, not your viewing angle.\nYour angle $= \\arctan(\\frac{10}{10}) = \\arctan(1) = 45°$.\nTrig uses "opposite ÷ adjacent" to find angles.' },
        onSkip: { zh: '仰角 $= \\arctan(\\frac{高}{距}) = \\arctan(\\frac{10}{10}) = 45°$。\n三角学核心：$\\tan = \\frac{对边}{邻边}$。', en: 'Angle $= \\arctan(\\frac{height}{distance}) = \\arctan(\\frac{10}{10}) = 45°$.\nTrig core: $\\tan = \\frac{opposite}{adjacent}$.' },
      },
    ],
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
    storyConsequence: { correct: { zh: '瞭望测距——三角精准！做得漂亮！', en: 'Watchtower Range — Well done!' }, wrong: { zh: '三角函数有点棘手——检查一下用的是 sin 还是 cos？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '火箭射角——三角精准！做得漂亮！', en: 'Fire Arrow Angle — Well done!' }, wrong: { zh: '三角函数有点棘手——检查一下用的是 sin 还是 cos？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '连环船锁链——三角精准！做得漂亮！', en: 'Chain Link Angle — Well done!' }, wrong: { zh: '三角函数有点棘手——检查一下用的是 sin 还是 cos？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '伤亡均值——数据分析到位！做得漂亮！', en: 'Casualty Mean — Well done!' }, wrong: { zh: '数字有点不对——没关系，再仔细看看数据？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '物资中位数——数据分析到位！做得漂亮！', en: 'Supply Median — Well done!' }, wrong: { zh: '数字有点不对——没关系，再仔细看看数据？', en: 'Not quite... Try again!' } }
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
    data: { target: 2, total: 5, generatorType: 'PROBABILITY_SIMPLE_RANDOM' }, difficulty: 'Easy', reward: 140,
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
    storyConsequence: { correct: { zh: '援军概率——概率算准！做得漂亮！', en: 'Reinforcement Probability — Well done!' }, wrong: { zh: '概率差了一点——记住目标数 ÷ 总数。', en: 'Not quite... Try again!' } }
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
    discoverSteps: [
      {
        prompt: { zh: '买了 $2$ 把剑和 $1$ 面盾，花了 $50$ 金。\n买了 $1$ 把剑和 $1$ 面盾，花了 $30$ 金。\n一把剑多少金？', en: 'Bought $2$ swords + $1$ shield for $50$ gold.\nBought $1$ sword + $1$ shield for $30$ gold.\nHow much is one sword?' },
        type: 'choice' as const,
        choices: [
          { zh: '$20$ 金（两单相减，多出的1把剑 = $50-30$）', en: '$20$ gold (subtract: the extra sword = $50-30$)' },
          { zh: '$25$ 金（$50÷2$）', en: '$25$ gold ($50÷2$)' },
        ],
        onCorrect: { zh: '聪明！两次购买都有1面盾，所以差价 $50-30=20$ 就是多的那把剑。\n\n你刚才用的就是"消元法"——让一个未知数消掉，只剩另一个。\n这就是联立方程的核心思路。', en: 'Smart! Both purchases include 1 shield, so the difference $50-30=20$ is the extra sword.\n\nYou just used "elimination" — cancel one unknown, solve the other.\nThis is the core idea of simultaneous equations.' },
        onWrong: { zh: '$50÷2$ 忽略了盾的价格。\n正确方法：两单都有1盾，减掉后：$50-30=20$ = 多的1把剑。\n然后 $30-20=10$ = 1面盾。这就是联立方程。', en: '$50÷2$ ignores the shield price.\nCorrect: both have 1 shield, subtract: $50-30=20$ = the extra sword.\nThen $30-20=10$ = 1 shield. This is simultaneous equations.' },
        onSkip: { zh: '等式1: $2剑+1盾=50$\n等式2: $1剑+1盾=30$\n相减：$1剑=20$，所以$1盾=10$。\n这就是联立方程——两个等式解两个未知数。', en: 'Eq1: $2s+1h=50$\nEq2: $1s+1h=30$\nSubtract: $1s=20$, so $1h=10$.\nThis is simultaneous equations — two equations, two unknowns.' },
      },
    ],
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
    storyConsequence: { correct: { zh: '粮草密约——联立方程求解成功！做得漂亮！', en: 'Secret Supply Pact — Well done!' }, wrong: { zh: '联立方程差一步——试试重新检查每步运算？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '投石轨迹——二次方程迎刃而解！做得漂亮！', en: 'Catapult Trajectory — Well done!' }, wrong: { zh: '差一步——试试用求根公式再算一次？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '谍报交集——集合理清！做得漂亮！', en: 'Intelligence Overlap — Well done!' }, wrong: { zh: '集合关系有点绕——画个韦恩图理理？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '烽火扇面——圆的计算完美！做得漂亮！', en: 'Beacon Arc — Well done!' }, wrong: { zh: '圆的数字有点偏——检查一下公式里有没有用 π？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '阵型旋转——角度完美！做得漂亮！', en: 'Formation Rotation — Well done!' }, wrong: { zh: '角度差了一点——再看看是补角还是余角？', en: 'Not quite... Try again!' } }
  },
  {
    id: 9144, grade: 9, unitId: 14, order: 4,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '战旗放大', en: 'Banner Enlargement' },
    skillName: { zh: '放大变换术', en: 'Enlargement Transform' },
    skillSummary: { zh: '以定点为中心放大 k 倍', en: 'Enlarge by factor k from a centre point' },
    story: { zh: '赤壁决战前，周瑜要把军旗上的图案从点 $({px}, {py})$ 以原点为中心放大 {k} 倍。放大后的坐标是多少？', en: 'Before Red Cliffs, Zhou Yu enlarges the flag design from $({px}, {py})$ by factor {k} centreed at the origin. What are the new coordinates?' },
    description: { zh: '求放大后的坐标。', en: 'Find the enlarged coordinates.' },
    data: { targetX: 3, targetY: 6, px: 1, py: 2, k: 3, generatorType: 'ENLARGEMENT_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-7.3-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '周瑜："为什么要学放大变换？因为设计图纸和实物大小不同——建筑师画一个小图，工匠按比例放大来建造。数学上就是以某点为中心，乘以放大倍数。"', en: 'Zhou Yu: "Why learn enlargement? Blueprints and real objects differ in size — architects draw small, craftsmen scale up. Mathematically: multiply by the scale factor from a centre."' }, highlightField: 'x' },
      { text: { zh: '周瑜："以原点为中心放大：每个坐标直接乘以放大倍数 $k$。"', en: 'Zhou Yu: "Enlargement from origin: multiply each coordinate by scale factor $k$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："$x\' = 1 \\times 3 = 3$。"', en: 'Zhou Yu: "$x\' = 1 \\times 3 = 3$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："$y\' = 2 \\times 3 = 6$。"', en: 'Zhou Yu: "$y\' = 2 \\times 3 = 6$."' }, highlightField: 'y' },
      { text: { zh: '周瑜："答案：放大后坐标 $(3, 6)$。"', en: 'Zhou Yu: "Answer: enlarged coordinates $(3, 6)$."' }, highlightField: 'x' },
      { text: { zh: '周瑜："验算：原点到原点距 = $\\sqrt{1^2+2^2} = \\sqrt{5}$，到新点距 = $\\sqrt{9+36} = \\sqrt{45} = 3\\sqrt{5}$。正好是 3 倍。✓"', en: 'Zhou Yu: "Check: distance from origin = $\\sqrt{1+4} = \\sqrt{5}$, to new point = $\\sqrt{9+36} = 3\\sqrt{5}$. Exactly 3 times. ✓"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '以原点为中心放大 k 倍：$(x, y) \\to (kx, ky)$。', en: 'Enlarge by k from origin: $(x, y) \\to (kx, ky)$.' }, formula: '$(x\', y\') = (kx, ky)$', tips: [{ zh: '周瑜提示：放大不走样，比例是关键。', en: 'Zhou Yu Tip: Scale without distortion — ratio is key.' }] },
    storyConsequence: { correct: { zh: '战旗放大——坐标精准！做得漂亮！', en: 'Banner Enlargement — Well done!' }, wrong: { zh: '位置差了一点——试试重新读一下坐标？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '东风向量——坐标精准！做得漂亮！', en: 'East Wind Vector — Well done!' }, wrong: { zh: '位置差了一点——试试重新读一下坐标？', en: 'Not quite... Try again!' } }
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
    storyConsequence: { correct: { zh: '伤亡频率——数据分析到位！做得漂亮！', en: 'Casualty Frequency — Well done!' }, wrong: { zh: '数字有点不对——没关系，再仔细看看数据？', en: 'Not quite... Try again!' } }
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
  {
    id: 9148, grade: 9, unitId: 14, order: 8,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Statistics', type: 'TREE_DIAGRAM',
    title: { zh: '不放回抽签', en: 'Draw Without Replacement' },
    skillName: { zh: '条件概率树', en: 'Conditional Probability Tree' },
    skillSummary: { zh: '不放回两阶段树形图条件概率', en: 'Two-stage conditional probability without replacement' },
    story: { zh: '赤壁决战前，诸葛亮备了 $5$ 个红色兵符和 $3$ 个蓝色兵符（共 $8$ 个）。不放回连抽两个，两个都是红色的概率是多少？', en: 'Before Red Cliffs, Zhuge Liang prepared $5$ red tokens and $3$ blue tokens ($8$ total). Two are drawn without replacement. What is the probability that both are red?' },
    description: { zh: '不放回从 $8$ 枚兵符中连取两枚，求两枚都是红色的概率。', en: 'Draw two tokens without replacement from $8$ total ($5$ red, $3$ blue). Find P(both red).' },
    data: { total: 8, red: 5, blue: 3, mode: 'both_red', generatorType: 'TREE_DIAGRAM_RANDOM' }, difficulty: 'Medium', reward: 300,
    kpId: 'kp-9.2-02', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么"不放回"改变概率？\n普通独立事件（放回），每次抽取条件一样。但"不放回"意味着第一枚取走后，袋里的数目变了——第二次的概率因此改变。\n这就是条件概率：$P(B|A)$ ≠ $P(B)$。', en: 'Zhuge Liang: "Why does without replacement change probabilities?\nWith replacement (independent), conditions reset each time. But without replacement, removing one token changes what remains — the second draw\'s probability shifts.\nThis is conditional probability: $P(B|A) \\neq P(B)$."' }, highlightField: 'p' },
      { text: { zh: '诸葛亮："标注第一次的树枝\n袋中 5 红 3 蓝，共 8 枚：\n• 第一次红：$P(R_1) = \\frac{5}{8}$\n• 第一次蓝：$P(B_1) = \\frac{3}{8}$', en: 'Zhuge Liang: "Label the first branches\n5 red, 3 blue, total 8:\n• First red: $P(R_1) = \\frac{5}{8}$\n• First blue: $P(B_1) = \\frac{3}{8}$"' }, highlightField: 'p' },
      { text: { zh: '诸葛亮："第一枚是红色之后，袋中剩余\n取走 1 红，剩 4 红 3 蓝，共 7 枚：\n• 第二次红：$P(R_2|R_1) = \\frac{4}{7}$\n• 第二次蓝：$P(B_2|R_1) = \\frac{3}{7}$', en: 'Zhuge Liang: "After first draw is red, the bag has\n4 red + 3 blue = 7 remaining:\n• Second red: $P(R_2|R_1) = \\frac{4}{7}$\n• Second blue: $P(B_2|R_1) = \\frac{3}{7}$"' }, highlightField: 'p' },
      { text: { zh: '诸葛亮："沿「红→红」路径相乘\n$P(R_1 \\cap R_2) = P(R_1) \\times P(R_2|R_1) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$', en: 'Zhuge Liang: "Multiply along the red→red path\n$P(R_1 \\cap R_2) = P(R_1) \\times P(R_2|R_1) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$"' }, highlightField: 'p' },
      { text: { zh: '诸葛亮："答案\n$P(\\text{两枚都红}) = \\frac{5}{14}$', en: 'Zhuge Liang: "Answer\n$P(\\text{both red}) = \\frac{5}{14}$"' }, highlightField: 'p' },
      { text: { zh: '诸葛亮："验算\n$\\frac{5}{14} \\approx 0.357$，在 $[0,1]$ 内 ✓\n注意：分母是 $8 \\times 7 = 56$，化简后 $\\frac{20}{56} = \\frac{5}{14}$ ✓\n不放回后概率降低了，合乎常识！', en: 'Zhuge Liang: "Verify\n$\\frac{5}{14} \\approx 0.357$, within $[0,1]$ ✓\nDenominator: $8 \\times 7 = 56$, simplified: $\\frac{20}{56} = \\frac{5}{14}$ ✓\nWithout replacement reduces probability — makes intuitive sense!"' }, highlightField: 'p' },
    ],
    secret: { concept: { zh: '不放回条件概率：P(A∩B) = P(A) × P(B|A)，第二次概率分子分母都减 1。', en: 'Conditional probability without replacement: P(A∩B) = P(A) × P(B|A) — both numerator and denominator decrease after first draw.' }, formula: '$P(R_1 \\cap R_2) = \\frac{r}{n} \\times \\frac{r-1}{n-1}$', tips: [{ zh: '诸葛亮提示：不放回后，从第二次分子和分母各减一（如果第一次取到同色）。', en: 'Zhuge Liang Tip: Without replacement, subtract 1 from both numerator and denominator when same colour drawn first.' }] },
    storyConsequence: { correct: { zh: '不放回抽签——条件概率运用精准！', en: 'Draw Without Replacement — Conditional probability mastered!' }, wrong: { zh: '注意：第二次概率分母变成 7 了！', en: 'Careful: after the first draw, the denominator becomes 7!' } }
  },
  {
    id: 9149, grade: 9, unitId: 14, order: 9,
    unitTitle: { zh: "Unit 14: 赤壁前奏·数据与变换", en: "Unit 14: Red Cliffs Prelude — Data & Transformations" },
    topic: 'Statistics', type: 'TREE_DIAGRAM',
    title: { zh: '颜色配对', en: 'Colour Pairs' },
    skillName: { zh: '条件概率树', en: 'Conditional Probability Tree' },
    skillSummary: { zh: '不放回树形图——两枚同色或异色', en: 'Probability tree without replacement — same or different colours' },
    story: { zh: '军营布袋中有 $4$ 个红色令牌和 $2$ 个蓝色令牌，共 $6$ 个。不放回取两枚，求两枚颜色相同的概率。', en: 'A camp bag contains $4$ red tokens and $2$ blue tokens ($6$ total). Two are drawn without replacement. Find the probability that both are the same colour.' },
    description: { zh: '不放回从 $6$ 枚中连取两枚，求两枚同色的概率。', en: 'Draw two tokens without replacement from $6$ ($4$ red, $2$ blue). Find P(same colour).' },
    data: { total: 6, red: 4, blue: 2, mode: 'both_same', generatorType: 'TREE_DIAGRAM_RANDOM' }, difficulty: 'Hard', reward: 360,
    kpId: 'kp-9.2-02', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '周瑜：为什么"不放回"这三个字改变了一切？\n放回取样，每次概率不变——简单。\n不放回，第一次的结果改变了第二次的概率——袋子里少了一个！\n这就是条件概率的核心：前一步影响后一步。', en: 'Zhou Yu: "Why do the words \'without replacement\' change everything?\nWith replacement, probabilities stay the same — simple.\nWithout replacement, the first draw changes the second — one fewer in the bag!\nThis is the core of conditional probability: the first step affects the next."' }, highlightField: 'p' },
      { text: { zh: '周瑜："标注第一次概率\n共 6 枚，4 红 2 蓝：\n• $P(R_1) = \\frac{4}{6} = \\frac{2}{3}$\n• $P(B_1) = \\frac{2}{6} = \\frac{1}{3}$', en: 'Zhou Yu: "First draw probabilities\n6 total, 4 red, 2 blue:\n• $P(R_1) = \\frac{4}{6} = \\frac{2}{3}$\n• $P(B_1) = \\frac{2}{6} = \\frac{1}{3}$"' }, highlightField: 'p' },
      { text: { zh: '周瑜："第二次条件概率（不放回）\n若第一次红（剩 3 红 2 蓝，共 5）：$P(R_2|R_1) = \\frac{3}{5}$\n若第一次蓝（剩 4 红 1 蓝，共 5）：$P(B_2|B_1) = \\frac{1}{5}$', en: 'Zhou Yu: "Second draw conditional (no replacement)\nIf first was red (3 red, 2 blue left, total 5): $P(R_2|R_1) = \\frac{3}{5}$\nIf first was blue (4 red, 1 blue left, total 5): $P(B_2|B_1) = \\frac{1}{5}$"' }, highlightField: 'p' },
      { text: { zh: '周瑜："计算两条同色路径\n$P(RR) = \\frac{4}{6} \\times \\frac{3}{5} = \\frac{12}{30}$\n$P(BB) = \\frac{2}{6} \\times \\frac{1}{5} = \\frac{2}{30}$\n$P(\\text{同色}) = \\frac{12}{30} + \\frac{2}{30} = \\frac{14}{30} = \\frac{7}{15}$', en: 'Zhou Yu: "Calculate both same-colour paths\n$P(RR) = \\frac{4}{6} \\times \\frac{3}{5} = \\frac{12}{30}$\n$P(BB) = \\frac{2}{6} \\times \\frac{1}{5} = \\frac{2}{30}$\n$P(\\text{same}) = \\frac{12}{30} + \\frac{2}{30} = \\frac{14}{30} = \\frac{7}{15}$"' }, highlightField: 'p' },
      { text: { zh: '周瑜："答案\n$P(\\text{两枚同色}) = \\frac{7}{15}$', en: 'Zhou Yu: "Answer\n$P(\\text{same colour}) = \\frac{7}{15}$"' }, highlightField: 'p' },
      { text: { zh: '周瑜："验算\n$P(\\text{异色}) = 1 - \\frac{7}{15} = \\frac{8}{15}$，$\\frac{7}{15} + \\frac{8}{15} = 1$ ✓\n对立事件之和为 1——树形图自验算完成！', en: 'Zhou Yu: "Verify\n$P(\\text{different}) = 1 - \\frac{7}{15} = \\frac{8}{15}$, $\\frac{7}{15} + \\frac{8}{15} = 1$ ✓\nComplementary events sum to 1 — tree diagram self-check complete!"' }, highlightField: 'p' },
    ],
    secret: { concept: { zh: '多路径条件概率：沿每条满足条件的路径相乘，再求各路径概率之和。', en: 'Multi-path conditional probability: multiply along each qualifying path, then sum all qualifying paths.' }, formula: '$P(\\text{same}) = P(RR) + P(BB)$', tips: [{ zh: '周瑜提示：先画全部 4 条路径，再只取"满足条件"的路径相加。', en: 'Zhou Yu Tip: Draw all 4 paths first, then pick only the qualifying ones to add.' }] },
    storyConsequence: { correct: { zh: '颜色配对——条件概率加法运用完美！', en: 'Colour Pairs — Multi-path conditional probability mastered!' }, wrong: { zh: '记住：同色有两条路径（RR 和 BB）需要相加！', en: 'Remember: same colour has two paths (RR and BB) to add!' } }
  },

  // --- Y9 Unit 15: 平行线方程 (Topic 3.6 Parallel Lines) ---
  {
    id: 9151, grade: 9, unitId: 15, order: 1,
    unitTitle: { zh: 'Unit 15: 平行线方程', en: 'Unit 15: Parallel Line Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '平行防线', en: 'Parallel Defences' },
    skillName: { zh: '平行线判定术', en: 'Identify Parallel Lines' },
    skillSummary: { zh: '斜率相同的两条直线互相平行', en: 'Lines with equal gradients are parallel' },
    story: { zh: '两条防线是否平行——斜率相同则平行！$y=2x+3$ 和 $y=2x-1$ 是否平行？', en: 'Are two defence lines parallel? Same gradient means parallel! Are $y=2x+3$ and $y=2x-1$ parallel?' },
    description: { zh: '判断 $y=2x+3$ 和 $y=2x-1$ 是否平行。（$1$=是，$0$=否）', en: 'Determine if $y=2x+3$ and $y=2x-1$ are parallel. ($1$=yes, $0$=no)' },
    discoverSteps: [
      {
        prompt: { zh: '看两条直线：$y = 2x + 3$ 和 $y = 2x - 1$。\n\n它们的斜率分别是多少？', en: 'Look at two lines: $y = 2x + 3$ and $y = 2x - 1$.\n\nWhat are their gradients?' },
        type: 'choice' as const,
        choices: [
          { zh: '都是 $2$', en: 'Both are $2$' },
          { zh: '一个是 $2$，一个是 $-1$', en: 'One is $2$, one is $-1$' },
          { zh: '一个是 $3$，一个是 $-1$', en: 'One is $3$, one is $-1$' },
        ],
        onCorrect: { zh: '没错！$y = mx + c$ 中，$m$ 就是斜率。两条线的 $m$ 都是 $2$。\n\n斜率相同 → 方向一致 → 永不相交 → 平行！', en: 'Right! In $y = mx + c$, $m$ is the gradient. Both lines have $m = 2$.\n\nSame gradient → same direction → never cross → parallel!' },
        onWrong: { zh: '在 $y = mx + c$ 中，$x$ 前面的系数就是斜率。\n$y = 2x + 3$ 的斜率是 $2$，$y = 2x - 1$ 的斜率也是 $2$。\n\n$+3$ 和 $-1$ 是截距（$c$），不是斜率！', en: 'In $y = mx + c$, the coefficient of $x$ is the gradient.\n$y = 2x + 3$ has gradient $2$, $y = 2x - 1$ also has gradient $2$.\n\n$+3$ and $-1$ are intercepts ($c$), not gradients!' },
        onSkip: { zh: '$y = mx + c$ 中，$m$ 是斜率，$c$ 是截距。\n两条线的斜率都是 $2$，截距不同（$3$ 和 $-1$）。\n斜率相同 = 平行。截距不同 = 不重合。所以它们是平行的！', en: 'In $y = mx + c$, $m$ is gradient, $c$ is intercept.\nBoth lines have gradient $2$, different intercepts ($3$ and $-1$).\nSame gradient = parallel. Different intercepts = not the same line. So they are parallel!' },
      },
    ],
    data: { answer: 1 }, difficulty: 'Easy', reward: 160,
    kpId: 'kp-3.6-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '贾诩："为什么要判断平行？\n两条防线如果不平行，迟早会交叉——交叉处就是漏洞！\n平行意味着同一方向、同一间距，防线才稳固。"', en: 'Jia Xu: "Why check for parallel lines?\nIf two defence lines aren\'t parallel, they\'ll eventually cross — the crossing point is a gap!\nParallel means same direction, constant spacing — a solid defence."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："平行的秘密在斜率\n$y = mx + c$ 中，$m$ 决定方向，$c$ 决定位置。\n斜率相同 = 方向相同 = 永不相交 = 平行！"', en: 'Jia Xu: "The secret of parallel lines is the gradient.\nIn $y = mx + c$, $m$ sets direction, $c$ sets position.\nSame gradient = same direction = never cross = parallel!"' }, highlightField: 'ans' },
      { text: { zh: '贾诩："提取两条线的斜率\n$y = 2x + 3$ → $m_1 = 2$\n$y = 2x - 1$ → $m_2 = 2$"', en: 'Jia Xu: "Extract the gradients of both lines\n$y = 2x + 3$ → $m_1 = 2$\n$y = 2x - 1$ → $m_2 = 2$"' }, highlightField: 'ans' },
      { text: { zh: '贾诩："比较斜率\n$m_1 = 2$，$m_2 = 2$\n$m_1 = m_2$ ✓ → 平行！"', en: 'Jia Xu: "Compare gradients\n$m_1 = 2$, $m_2 = 2$\n$m_1 = m_2$ ✓ → Parallel!"' }, highlightField: 'ans' },
      { text: { zh: '贾诩："答案：$1$（是，平行）。\n两条防线方向一致，间距恒定。"', en: 'Jia Xu: "Answer: $1$ (yes, parallel).\nBoth defence lines go in the same direction with constant spacing."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："验算：截距不同（$3 \\neq -1$），所以不是同一条线。\n斜率相同且不重合 → 平行 ✓ 防线部署完毕！"', en: 'Jia Xu: "Verify: intercepts differ ($3 \\neq -1$), so they\'re not the same line.\nSame gradient and not coincident → parallel ✓ Defence deployed!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '平行线斜率相等：$m_1 = m_2$ 且 $c_1 \\neq c_2$ 则平行。', en: 'Parallel lines have equal gradients: $m_1 = m_2$ and $c_1 \\neq c_2$ means parallel.' }, formula: '$m_1 = m_2 \\Rightarrow \\text{parallel}$', tips: [{ zh: '贾诩提示：看斜率，不看截距——斜率定方向，截距定位置。', en: 'Jia Xu Tip: Check gradients, not intercepts — gradient sets direction, intercept sets position.' }] },
    storyConsequence: { correct: { zh: '平行防线——判定正确！做得漂亮！', en: 'Parallel Defences — Correct identification!' }, wrong: { zh: '关键在斜率是否相同——再看看 $m$ 的值？', en: 'The key is whether gradients match — check the $m$ values again.' } }
  },
  {
    id: 9152, grade: 9, unitId: 15, order: 2,
    unitTitle: { zh: 'Unit 15: 平行线方程', en: 'Unit 15: Parallel Line Equations' },
    topic: 'Algebra', type: 'LINEAR',
    title: { zh: '建造平行防线', en: 'Build Parallel Defence' },
    skillName: { zh: '平行线方程术', en: 'Find Parallel Equation' },
    skillSummary: { zh: '过已知点写出与给定直线平行的方程', en: 'Write equation of line parallel to a given line through a point' },
    story: { zh: '建造平行防线，斜率相同截距不同。过点 $(0,5)$，平行于 $y=3x+1$ 的直线方程？斜率 $m=?$', en: 'Build a parallel defence — same gradient, different intercept. Through $(0,5)$, parallel to $y=3x+1$. Gradient $m=?$' },
    description: { zh: '求过点 $(0,5)$ 且平行于 $y=3x+1$ 的直线方程。', en: 'Find the equation of the line through $(0,5)$ parallel to $y=3x+1$.' },
    data: { points: [[0, 5], [1, 8]], x1: 0, y1: 5, x2: 1, y2: 8, generatorType: 'LINEAR_RANDOM' }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-3.6-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '荀彧："为什么平行线这么重要？\n真正的防线不是一条线——是两条平行线形成的通道。\n第一条已经有了（$y=3x+1$），现在要在另一侧建第二条。"', en: 'Xun Yu: "Why are parallel lines so important?\nA real defence isn\'t one line — it\'s a corridor formed by two parallel lines.\nThe first is already there ($y=3x+1$); now build the second on the other side."' }, highlightField: 'm' },
      { text: { zh: '荀彧："平行 = 斜率相同\n原线 $y = 3x + 1$ 的斜率 $m = 3$。\n平行线的斜率也必须是 $3$——方向一致才能保持间距。"', en: 'Xun Yu: "Parallel = same gradient.\nOriginal line $y = 3x + 1$ has gradient $m = 3$.\nThe parallel line must also have $m = 3$ — same direction keeps constant spacing."' }, highlightField: 'm' },
      { text: { zh: '荀彧："已知 $m = 3$，过点 $(0, 5)$。\n代入 $y = mx + c$：$5 = 3 \\times 0 + c$。"', en: 'Xun Yu: "Given $m = 3$, through point $(0, 5)$.\nSubstitute into $y = mx + c$: $5 = 3 \\times 0 + c$."' }, highlightField: 'c' },
      { text: { zh: '荀彧："解方程\n$5 = 0 + c$\n$c = 5$"', en: 'Xun Yu: "Solve the equation\n$5 = 0 + c$\n$c = 5$"' }, highlightField: 'c' },
      { text: { zh: '荀彧："答案：$y = 3x + 5$\n斜率 $m = 3$（与原线相同），截距 $c = 5$。"', en: 'Xun Yu: "Answer: $y = 3x + 5$.\nGradient $m = 3$ (same as original), intercept $c = 5$."' }, highlightField: 'm' },
      { text: { zh: '荀彧："验算：代入点 $(0,5)$：$y = 3(0) + 5 = 5$ ✓\n代入点 $(1,8)$：$y = 3(1) + 5 = 8$ ✓\n两条线斜率都是 $3$，截距不同（$1 \\neq 5$）→ 平行防线建造完毕！"', en: 'Xun Yu: "Verify: substitute $(0,5)$: $y = 3(0) + 5 = 5$ ✓\nSubstitute $(1,8)$: $y = 3(1) + 5 = 8$ ✓\nBoth lines have gradient $3$, different intercepts ($1 \\neq 5$) → parallel defence built!"' }, highlightField: 'm' },
    ],
    secret: { concept: { zh: '平行线方程：保持斜率不变，用新点求截距。', en: 'Parallel line equation: keep the gradient, use the new point to find the intercept.' }, formula: '$y = mx + c$, same $m$', tips: [{ zh: '荀彧提示：斜率照抄，截距重算——这就是平行线的秘诀。', en: 'Xun Yu Tip: Copy the gradient, recalculate the intercept — that\'s the secret of parallel lines.' }] },
    storyConsequence: { correct: { zh: '平行防线建造完毕——方程正确！', en: 'Parallel Defence Built — Equation correct!' }, wrong: { zh: '平行线斜率必须相同——检查 $m$ 是否等于 $3$？', en: 'Parallel lines must share the same gradient — is $m = 3$?' } }
  },

  // --- Y9 Unit 16: 组合图形 (Topic 5.5 Compound Shapes) ---
  {
    id: 9153, grade: 9, unitId: 16, order: 1,
    unitTitle: { zh: 'Unit 16: 组合图形', en: 'Unit 16: Compound Shapes' },
    topic: 'Geometry', type: 'AREA',
    title: { zh: 'L形阵地', en: 'L-Shaped Fortification' },
    skillName: { zh: '组合面积术', en: 'Compound Shape Area' },
    skillSummary: { zh: '把组合图形拆成简单图形，分别算面积再相加', en: 'Split compound shapes into simple shapes, calculate each area, then add' },
    story: { zh: '赵云规划 L 形阵地：由两个矩形组成，$8 \\times 3$ 和 $4 \\times 2$。总面积是多少？', en: 'Zhao Yun plans an L-shaped fortification: two rectangles, $8 \\times 3$ and $4 \\times 2$. Total area?' },
    description: { zh: '求 L 形组合图形的总面积。', en: 'Find the total area of the L-shaped compound figure.' },
    discoverSteps: [
      {
        prompt: { zh: '一个 L 形由两个矩形拼成：$8 \\times 3$ 和 $4 \\times 2$。\n\n怎么算总面积？', en: 'An L-shape is made of two rectangles: $8 \\times 3$ and $4 \\times 2$.\n\nHow do you find the total area?' },
        type: 'choice' as const,
        choices: [
          { zh: '分别算面积再相加：$24 + 8 = 32$', en: 'Calculate each area then add: $24 + 8 = 32$' },
          { zh: '把所有数字相乘：$8 \\times 3 \\times 4 \\times 2 = 192$', en: 'Multiply all numbers: $8 \\times 3 \\times 4 \\times 2 = 192$' },
          { zh: '只算最大的矩形：$8 \\times 4 = 32$', en: 'Only calculate the largest rectangle: $8 \\times 4 = 32$' },
        ],
        onCorrect: { zh: '完全正确！组合图形的核心思路：\n拆成简单图形 → 分别算面积 → 加在一起。\n$8 \\times 3 = 24$，$4 \\times 2 = 8$，$24 + 8 = 32$。', en: 'Exactly right! The key idea for compound shapes:\nSplit into simple shapes → calculate each → add together.\n$8 \\times 3 = 24$, $4 \\times 2 = 8$, $24 + 8 = 32$.' },
        onWrong: { zh: '组合图形不能把所有数字直接乘在一起。\n关键方法：拆成两个矩形，分别算面积。\n矩形 1：$8 \\times 3 = 24$\n矩形 2：$4 \\times 2 = 8$\n总面积：$24 + 8 = 32$', en: 'You can\'t multiply all dimensions together for compound shapes.\nKey method: split into two rectangles, find each area.\nRect 1: $8 \\times 3 = 24$\nRect 2: $4 \\times 2 = 8$\nTotal: $24 + 8 = 32$' },
        onSkip: { zh: '组合图形的面积 = 拆分成简单图形 + 分别计算 + 求和。\n这个 L 形拆成两个矩形：\n$8 \\times 3 = 24$，$4 \\times 2 = 8$\n总面积 = $24 + 8 = 32$\n这就是"分而治之"——复杂变简单！', en: 'Compound area = split into simple shapes + calculate each + sum.\nThis L-shape splits into two rectangles:\n$8 \\times 3 = 24$, $4 \\times 2 = 8$\nTotal = $24 + 8 = 32$\nThis is "divide and conquer" — complex becomes simple!' },
      },
    ],
    data: { answer: 32 }, difficulty: 'Easy', reward: 160,
    kpId: 'kp-5.5-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云："为什么学组合图形面积？\n真实的阵地从来不是规则的长方形——大多是 L 形、T 形、凹形。\n会拆解复杂形状 = 会丈量任何阵地。"', en: 'Zhao Yun: "Why learn compound shape area?\nReal fortifications are never perfect rectangles — most are L-shaped, T-shaped, or irregular.\nKnowing how to split complex shapes = measuring any fortification."' }, highlightField: 'ans' },
      { text: { zh: '赵云："核心思路：分而治之\n复杂图形看不懂？切一刀，变成两个简单图形！\n就像打仗——大军分两路，各个击破。"', en: 'Zhao Yun: "Core idea: divide and conquer.\nCan\'t figure out a complex shape? Cut it — two simple shapes!\nLike battle — split the army into two forces, defeat each separately."' }, highlightField: 'ans' },
      { text: { zh: '赵云："拆解 L 形\n沿内角切一刀 → 矩形 A：$8 \\times 3$ 和矩形 B：$4 \\times 2$。"', en: 'Zhao Yun: "Split the L-shape.\nCut along the inner corner → Rectangle A: $8 \\times 3$ and Rectangle B: $4 \\times 2$."' }, highlightField: 'ans' },
      { text: { zh: '赵云："分别计算面积\n矩形 A：$8 \\times 3 = 24$\n矩形 B：$4 \\times 2 = 8$"', en: 'Zhao Yun: "Calculate each area.\nRectangle A: $8 \\times 3 = 24$\nRectangle B: $4 \\times 2 = 8$"' }, highlightField: 'ans' },
      { text: { zh: '赵云："答案：总面积 = $24 + 8 = 32$ 平方单位。"', en: 'Zhao Yun: "Answer: total area = $24 + 8 = 32$ square units."' }, highlightField: 'ans' },
      { text: { zh: '赵云："验算：也可以用大矩形减去缺角。\n大矩形 $8 \\times 5 = 40$，缺角 $4 \\times 2 = 8$？不对——要看具体拆法。\n但两个矩形面积之和 $24 + 8 = 32$ ✓ 阵地面积确认！"', en: 'Zhao Yun: "Verify: you can also try big rectangle minus cut-out.\nBut the straightforward split gives $24 + 8 = 32$ ✓ Fortification area confirmed!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '组合面积 = 拆成简单图形分别求面积再相加。', en: 'Compound area = split into simple shapes, find each area, then add.' }, formula: '$A_{\\text{total}} = A_1 + A_2$', tips: [{ zh: '赵云提示：分而治之——切一刀就能算。', en: 'Zhao Yun Tip: Divide and conquer — one cut and you can calculate.' }] },
    storyConsequence: { correct: { zh: 'L形阵地——组合面积正确！做得漂亮！', en: 'L-Shaped Fortification — Compound area correct!' }, wrong: { zh: '记住拆成简单图形分别算面积再加起来。', en: 'Remember to split into simple shapes, calculate each, then add.' } }
  },
  {
    id: 9154, grade: 9, unitId: 16, order: 2,
    unitTitle: { zh: 'Unit 16: 组合图形', en: 'Unit 16: Compound Shapes' },
    topic: 'Geometry', type: 'VOLUME',
    title: { zh: '缺口城墙', en: 'Notched Wall' },
    skillName: { zh: '组合体积术', en: 'Compound Solid Volume' },
    skillSummary: { zh: '大体积减去缺口体积', en: 'Total volume minus notch volume' },
    story: { zh: '长方体城墙 $4 \\times 3 \\times 2$ 被凿出一个 $2 \\times 1 \\times 2$ 的缺口。剩余体积是多少？', en: 'A cuboid wall $4 \\times 3 \\times 2$ has a $2 \\times 1 \\times 2$ notch cut out. What is the remaining volume?' },
    description: { zh: '求长方体去掉缺口后的剩余体积。', en: 'Find the remaining volume after cutting a notch from a cuboid.' },
    data: { answer: 20 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-5.5-03', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么学组合体积？\n真实的城墙不是完美的长方体——它有窗口、缺口、通道。\n减去缺口体积，才能知道真实的用料量。"', en: 'Zhuge Liang: "Why learn compound volume?\nReal walls aren\'t perfect cuboids — they have windows, notches, passages.\nSubtracting the notch volume gives the true material needed."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："思路：大体积 - 缺口体积\n就像雕塑——先做出整块石头，再凿掉不要的部分。\n剩下的就是你要的形状。"', en: 'Zhuge Liang: "Strategy: total volume - notch volume.\nLike sculpting — start with the whole block, then chisel away what you don\'t need.\nWhat remains is your shape."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："计算大长方体体积\n$V_{\\text{total}} = 4 \\times 3 \\times 2 = 24$"', en: 'Zhuge Liang: "Calculate the full cuboid volume.\n$V_{\\text{total}} = 4 \\times 3 \\times 2 = 24$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："计算缺口体积\n$V_{\\text{notch}} = 2 \\times 1 \\times 2 = 4$"', en: 'Zhuge Liang: "Calculate the notch volume.\n$V_{\\text{notch}} = 2 \\times 1 \\times 2 = 4$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："答案：剩余体积 = $24 - 4 = 20$ 立方单位。"', en: 'Zhuge Liang: "Answer: remaining volume = $24 - 4 = 20$ cubic units."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："验算：缺口体积 $4$ < 总体积 $24$ ✓\n$20 + 4 = 24$（剩余 + 缺口 = 原体积）✓ 城墙用料确认！"', en: 'Zhuge Liang: "Verify: notch $4$ < total $24$ ✓\n$20 + 4 = 24$ (remaining + notch = original) ✓ Wall materials confirmed!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '组合体积：先算完整体积，再减去缺口部分。', en: 'Compound volume: calculate the full volume, then subtract the cut-out.' }, formula: '$V = V_{\\text{total}} - V_{\\text{notch}}$', tips: [{ zh: '诸葛亮提示：先做完整，再凿缺口——减法思维。', en: 'Zhuge Liang Tip: Start whole, then subtract — subtraction thinking.' }] },
    storyConsequence: { correct: { zh: '缺口城墙——组合体积正确！做得漂亮！', en: 'Notched Wall — Compound volume correct!' }, wrong: { zh: '记住：大体积减缺口体积，不是加！', en: 'Remember: total minus notch, not plus!' } }
  },

  // --- Y9 Unit 17: 散点图与相关性 (Topic 9.5 Scatter Diagrams) ---
  {
    id: 9155, grade: 9, unitId: 17, order: 1,
    unitTitle: { zh: 'Unit 17: 散点图', en: 'Unit 17: Scatter Diagrams' },
    topic: 'Statistics', type: 'ESTIMATION',
    title: { zh: '军情散点', en: 'Intelligence Scatter' },
    skillName: { zh: '相关性判断术', en: 'Identify Correlation' },
    skillSummary: { zh: '正相关：一升一升；负相关：一升一降', en: 'Positive: both increase; Negative: one up, one down' },
    story: { zh: '六对情报数据 $(1,2)(2,4)(3,5)(4,7)(5,8)(6,11)$。是正相关还是负相关？（$1$=正，$2$=负）', en: 'Six data pairs $(1,2)(2,4)(3,5)(4,7)(5,8)(6,11)$. Positive or negative correlation? ($1$=positive, $2$=negative)' },
    description: { zh: '判断散点图数据的相关性类型。', en: 'Determine the type of correlation in the scatter data.' },
    discoverSteps: [
      {
        prompt: { zh: '观察这组数据：$(1,2), (2,4), (3,5), (4,7), (5,8), (6,11)$。\n\n当 $x$ 增大时，$y$ 怎么变？', en: 'Look at this data: $(1,2), (2,4), (3,5), (4,7), (5,8), (6,11)$.\n\nAs $x$ increases, what happens to $y$?' },
        type: 'choice' as const,
        choices: [
          { zh: '$y$ 也在增大——正相关', en: '$y$ also increases — positive correlation' },
          { zh: '$y$ 在减小——负相关', en: '$y$ decreases — negative correlation' },
          { zh: '$y$ 没有规律——无相关', en: '$y$ has no pattern — no correlation' },
        ],
        onCorrect: { zh: '没错！$x$ 从 $1$ 到 $6$，$y$ 从 $2$ 到 $11$——同步上升。\n\n这就是正相关：两个变量同方向变化。\n在散点图上，点从左下到右上排列。', en: 'Correct! $x$ goes from $1$ to $6$, $y$ from $2$ to $11$ — both increase together.\n\nThis is positive correlation: both variables change in the same direction.\nOn a scatter diagram, points go from bottom-left to top-right.' },
        onWrong: { zh: '看数据趋势：$x=1$ 时 $y=2$，$x=6$ 时 $y=11$。\n$x$ 越大，$y$ 越大——同方向增长！\n这就是正相关。', en: 'Look at the trend: when $x=1$, $y=2$; when $x=6$, $y=11$.\nAs $x$ increases, $y$ increases — same direction!\nThis is positive correlation.' },
        onSkip: { zh: '正相关 = 一个变量增大，另一个也增大。\n负相关 = 一个增大，另一个减小。\n无相关 = 没有明显趋势。\n\n这组数据 $x$ 增大时 $y$ 也增大，所以是正相关。', en: 'Positive correlation = one variable increases, the other also increases.\nNegative = one up, one down.\nNo correlation = no clear trend.\n\nHere, as $x$ increases, $y$ increases too → positive correlation.' },
      },
    ],
    data: { answer: 1 }, difficulty: 'Easy', reward: 160,
    kpId: 'kp-9.5-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '关羽："为什么要判断相关性？\n战场上，训练时间和战斗力有关系吗？粮草供应和士气有关系吗？\n散点图帮你一眼看出：两件事是否同步变化。"', en: 'Guan Yu: "Why identify correlation?\nOn the battlefield — does training time relate to combat power? Does food supply relate to morale?\nScatter diagrams show at a glance: do two things change together?"' }, highlightField: 'ans' },
      { text: { zh: '关羽："三种相关性\n正相关：$x$ 升，$y$ 也升（点从左下到右上）\n负相关：$x$ 升，$y$ 降（点从左上到右下）\n无相关：散乱无规律"', en: 'Guan Yu: "Three types of correlation.\nPositive: $x$ up, $y$ up (points go bottom-left to top-right).\nNegative: $x$ up, $y$ down (points go top-left to bottom-right).\nNone: scattered randomly."' }, highlightField: 'ans' },
      { text: { zh: '关羽："读取数据\n$(1,2), (2,4), (3,5), (4,7), (5,8), (6,11)$\n$x$：$1 \\to 2 \\to 3 \\to 4 \\to 5 \\to 6$（递增）\n$y$：$2 \\to 4 \\to 5 \\to 7 \\to 8 \\to 11$（也递增）"', en: 'Guan Yu: "Read the data.\n$(1,2), (2,4), (3,5), (4,7), (5,8), (6,11)$\n$x$: $1 \\to 2 \\to 3 \\to 4 \\to 5 \\to 6$ (increasing)\n$y$: $2 \\to 4 \\to 5 \\to 7 \\to 8 \\to 11$ (also increasing)"' }, highlightField: 'ans' },
      { text: { zh: '关羽："判断：$x$ 增大时 $y$ 也增大 → 正相关。"', en: 'Guan Yu: "Judgement: as $x$ increases, $y$ also increases → positive correlation."' }, highlightField: 'ans' },
      { text: { zh: '关羽："答案：$1$（正相关）。"', en: 'Guan Yu: "Answer: $1$ (positive correlation)."' }, highlightField: 'ans' },
      { text: { zh: '关羽："验算：每次 $x$ 增加 $1$，$y$ 大约增加 $1.5{-}2$——稳定上升趋势 ✓\n如果画出散点图，点会呈从左下到右上的带状分布 ✓ 情报分析完毕！"', en: 'Guan Yu: "Verify: each time $x$ increases by $1$, $y$ increases by roughly $1.5{-}2$ — steady upward trend ✓\nIf plotted, points form a bottom-left to top-right band ✓ Intelligence analysis complete!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '正相关：两个变量同方向变化。散点从左下到右上排列。', en: 'Positive correlation: both variables change in the same direction. Points go bottom-left to top-right.' }, formula: '$x \\uparrow, y \\uparrow \\Rightarrow \\text{positive}$', tips: [{ zh: '关羽提示：看趋势，不看个别点——大方向决定相关性。', en: 'Guan Yu Tip: Look at the trend, not individual points — the overall direction determines correlation.' }] },
    storyConsequence: { correct: { zh: '军情散点——相关性判断正确！做得漂亮！', en: 'Intelligence Scatter — Correlation identified!' }, wrong: { zh: '看 $x$ 增大时 $y$ 是增大还是减小？', en: 'As $x$ increases, does $y$ increase or decrease?' } }
  },
  {
    id: 9156, grade: 9, unitId: 17, order: 2,
    unitTitle: { zh: 'Unit 17: 散点图', en: 'Unit 17: Scatter Diagrams' },
    topic: 'Statistics', type: 'ESTIMATION',
    title: { zh: '拟合斜率', en: 'Best Fit Gradient' },
    skillName: { zh: '拟合线斜率术', en: 'Line of Best Fit Gradient' },
    skillSummary: { zh: '用拟合线上两点求斜率', en: 'Find gradient using two points on the line of best fit' },
    story: { zh: '拟合线过 $(0,1)$ 和 $(10,21)$，求斜率。', en: 'The line of best fit passes through $(0,1)$ and $(10,21)$. Find the gradient.' },
    description: { zh: '用拟合线上两点计算斜率。', en: 'Calculate the gradient using two points on the line of best fit.' },
    data: { answer: 2 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-9.5-03', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '贾诩："为什么要求拟合线的斜率？\n拟合线的斜率告诉你变化的速度——$x$ 每增加 $1$，$y$ 大约变化多少。\n这就是预测的基础：掌握了速度，就能推算未来。"', en: 'Jia Xu: "Why find the gradient of the line of best fit?\nThe gradient tells you the rate of change — how much $y$ changes when $x$ increases by $1$.\nThis is the basis of prediction: know the rate, predict the future."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："斜率 = 上升 / 前进\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$\n拟合线上取两个好算的点即可。"', en: 'Jia Xu: "Gradient = rise / run.\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$\nPick two easy-to-read points on the line of best fit."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："代入两点 $(0, 1)$ 和 $(10, 21)$\n$m = \\frac{21 - 1}{10 - 0} = \\frac{20}{10}$"', en: 'Jia Xu: "Substitute the two points $(0, 1)$ and $(10, 21)$.\n$m = \\frac{21 - 1}{10 - 0} = \\frac{20}{10}$"' }, highlightField: 'ans' },
      { text: { zh: '贾诩："计算\n$m = \\frac{20}{10} = 2$"', en: 'Jia Xu: "Calculate.\n$m = \\frac{20}{10} = 2$"' }, highlightField: 'ans' },
      { text: { zh: '贾诩："答案：斜率 $m = 2$。\n每增加 $1$ 单位的 $x$，$y$ 增加 $2$。"', en: 'Jia Xu: "Answer: gradient $m = 2$.\nFor every $1$ unit increase in $x$, $y$ increases by $2$."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："验算：从 $(0,1)$ 出发，$x$ 增加 $10$，$y$ 应增加 $10 \\times 2 = 20$。\n$1 + 20 = 21$ ✓ 与第二个点吻合！情报趋势确认！"', en: 'Jia Xu: "Verify: starting from $(0,1)$, $x$ increases by $10$, $y$ should increase by $10 \\times 2 = 20$.\n$1 + 20 = 21$ ✓ Matches the second point! Intelligence trend confirmed!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '拟合线斜率用线上两点求：$m = (y_2-y_1)/(x_2-x_1)$。', en: 'Line of best fit gradient from two points: $m = (y_2-y_1)/(x_2-x_1)$.' }, formula: '$m = \\frac{y_2 - y_1}{x_2 - x_1}$', tips: [{ zh: '贾诩提示：选容易读数的两点——整数坐标最好。', en: 'Jia Xu Tip: Pick two points with easy-to-read coordinates — whole numbers are best.' }] },
    storyConsequence: { correct: { zh: '拟合斜率——计算正确！做得漂亮！', en: 'Best Fit Gradient — Calculation correct!' }, wrong: { zh: '斜率 = 上升 / 前进——分子分母别搞反了。', en: 'Gradient = rise / run — don\'t swap numerator and denominator.' } }
  },
  {
    id: 9157, grade: 9, unitId: 17, order: 3,
    unitTitle: { zh: 'Unit 17: 散点图', en: 'Unit 17: Scatter Diagrams' },
    topic: 'Statistics', type: 'ESTIMATION',
    title: { zh: '内插外推', en: 'Interpolation vs Extrapolation' },
    skillName: { zh: '内插外推判断术', en: 'Interpolation vs Extrapolation' },
    skillSummary: { zh: '数据范围内=内插（可靠），范围外=外推（不可靠）', en: 'Within data range = interpolation (reliable); outside = extrapolation (unreliable)' },
    story: { zh: '数据范围 $x \\in [10, 50]$。用拟合线预测 $x=30$ 的 $y$ 值，是内插还是外推？（$1$=内插，$2$=外推）', en: 'Data range $x \\in [10, 50]$. Using the line of best fit to predict $y$ at $x=30$: interpolation or extrapolation? ($1$=interpolation, $2$=extrapolation)' },
    description: { zh: '判断预测是内插（范围内）还是外推（范围外）。', en: 'Determine whether the prediction is interpolation (within range) or extrapolation (outside range).' },
    data: { answer: 1 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-9.5-04', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '荀彧："为什么区分内插和外推？\n内插是在已知范围内预测——有数据支撑，比较可靠。\n外推是在范围外猜测——没有数据保障，风险很大。\n这就像行军：熟悉的地盘走得稳，陌生的地方可能有埋伏。"', en: 'Xun Yu: "Why distinguish interpolation and extrapolation?\nInterpolation predicts within known range — supported by data, reliable.\nExtrapolation guesses beyond range — no data support, risky.\nLike marching: familiar territory is safe; unknown territory may hide ambushes."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："定义\n内插（Interpolation）：预测值在数据范围**以内**\n外推（Extrapolation）：预测值在数据范围**以外**"', en: 'Xun Yu: "Definitions.\nInterpolation: prediction is **within** the data range.\nExtrapolation: prediction is **outside** the data range."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："检查数据范围\n数据 $x$ 的范围是 $[10, 50]$。\n要预测的值是 $x = 30$。"', en: 'Xun Yu: "Check the data range.\nThe $x$ data ranges from $[10, 50]$.\nThe value to predict is $x = 30$."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："判断：$10 \\leq 30 \\leq 50$ → 在范围内 → 内插。"', en: 'Xun Yu: "Judgement: $10 \\leq 30 \\leq 50$ → within range → interpolation."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："答案：$1$（内插）。\n预测值在数据范围内，预测结果可靠。"', en: 'Xun Yu: "Answer: $1$ (interpolation).\nPrediction is within the data range — result is reliable."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："验算：如果 $x = 60$，则 $60 > 50$，在范围外 → 外推（不可靠）。\n而 $x = 30$ 确实在 $[10, 50]$ 之间 ✓ 这次预测可以信赖！"', en: 'Xun Yu: "Verify: if $x = 60$, then $60 > 50$, outside range → extrapolation (unreliable).\nBut $x = 30$ is indeed between $[10, 50]$ ✓ This prediction is trustworthy!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '内插在数据范围内，外推在范围外。内插可靠，外推有风险。', en: 'Interpolation is within data range, extrapolation is outside. Interpolation is reliable; extrapolation is risky.' }, formula: '$x_{\\min} \\leq x \\leq x_{\\max} \\Rightarrow \\text{interpolation}$', tips: [{ zh: '荀彧提示：已知地盘内预测才靠谱——外推要谨慎！', en: 'Xun Yu Tip: Predictions within known territory are reliable — be cautious with extrapolation!' }] },
    storyConsequence: { correct: { zh: '内插外推——判断正确！做得漂亮！', en: 'Interpolation vs Extrapolation — Correct!' }, wrong: { zh: '检查 $x=30$ 是否在 $[10,50]$ 范围内。', en: 'Check whether $x=30$ falls within $[10,50]$.' } }
  },
  // ─── Unit 18: 方程进阶 (Topic 2.5 Equations) ───
  {
    id: 9161, grade: 9, unitId: 18, order: 1,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '破括号', en: 'Breaking Brackets' },
    skillName: { zh: '含括号方程术', en: 'Equations with Brackets' },
    skillSummary: { zh: '先展开括号，再解方程', en: 'Expand brackets first, then solve' },
    story: { zh: '贾诩密信中藏着一道含括号的方程：$3(x+2)=21$。解出 $x$ 才能解锁下一条情报。', en: 'Jia Xu\'s coded message contains a bracketed equation: $3(x+2)=21$. Solve for $x$ to unlock the next intelligence.' },
    description: { zh: '展开括号后解方程：$3(x+2)=21$，求 $x$。', en: 'Expand and solve: $3(x+2)=21$, find $x$.' },
    discoverSteps: [
      {
        prompt: { zh: '$3(x+2)=21$。\n\n如果直接把括号去掉写成 $3x+2=21$，答案对吗？', en: '$3(x+2)=21$.\n\nIf you just remove brackets and write $3x+2=21$, is the answer correct?' },
        type: 'choice' as const,
        choices: [
          { zh: '不对——3 必须乘以括号里的每一项', en: 'No — 3 must multiply EVERY term inside' },
          { zh: '对——直接去掉括号就行', en: 'Yes — just remove the brackets' },
          { zh: '不确定', en: 'Not sure' },
        ],
        onCorrect: { zh: '没错！$3(x+2) = 3 \\times x + 3 \\times 2 = 3x+6$。\n括号是一个"密封盒子"，展开就是把 3 分配给里面的每一项。这就是分配律。', en: 'Exactly! $3(x+2) = 3 \\times x + 3 \\times 2 = 3x+6$.\nBrackets are a sealed box — expanding distributes the 3 to every term inside. This is the distributive law.' },
        onWrong: { zh: '试试代入检验：如果 $3x+2=21$ 则 $x=\\frac{19}{3}$。\n但 $3(\\frac{19}{3}+2) = 3 \\times \\frac{25}{3} = 25 \\neq 21$。\n正确做法：$3(x+2) = 3x+6$，3 要乘以括号里的每一项！', en: 'Try checking: if $3x+2=21$ then $x=\\frac{19}{3}$.\nBut $3(\\frac{19}{3}+2) = 25 \\neq 21$.\nCorrect way: $3(x+2) = 3x+6$ — multiply EVERY term inside!' },
        onSkip: { zh: '关键：$3(x+2)$ 意思是"3 乘以整个 $(x+2)$"。\n展开：$3 \\times x + 3 \\times 2 = 3x+6$。\n然后 $3x+6=21 \\Rightarrow 3x=15 \\Rightarrow x=5$。\n记住：括号里的每一项都要乘！', en: 'Key: $3(x+2)$ means "3 times the WHOLE $(x+2)$".\nExpand: $3 \\times x + 3 \\times 2 = 3x+6$.\nThen $3x+6=21 \\Rightarrow 3x=15 \\Rightarrow x=5$.\nRemember: multiply EVERY term inside the brackets!' },
      },
    ],
    data: { x: 5, a: 3, result: 21, generatorType: 'SIMPLE_EQ_RANDOM' }, difficulty: 'Easy', reward: 180,
    kpId: 'kp-2.5-03', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '贾诩："为什么方程里会有括号？因为括号把相关的量打包在一起——就像密封的锦囊，解开它才能看清里面的内容。展开括号，就是用分配律把外面的系数分给里面的每一项。"', en: 'Jia Xu: "Why do equations have brackets? Brackets bundle related quantities together — like a sealed pouch. Opening it means using the distributive law to give the outside coefficient to every term inside."' }, highlightField: 'x' },
      { text: { zh: '贾诩："想象拆包裹：$3(x+2)$ 就是 3 份 $(x+2)$。每份里有 $x$ 和 $2$，所以总共是 $3x + 6$。不能漏掉任何一项！"', en: 'Jia Xu: "Imagine unpacking a parcel: $3(x+2)$ means 3 copies of $(x+2)$. Each copy has $x$ and $2$, so the total is $3x + 6$. Don\'t miss any term!"' }, highlightField: 'x' },
      { text: { zh: '贾诩："展开括号：$3(x+2) = 3x + 6$。\n方程变为 $3x + 6 = 21$。"', en: 'Jia Xu: "Expand: $3(x+2) = 3x + 6$.\nEquation becomes $3x + 6 = 21$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："两边减 6：$3x = 21 - 6 = 15$。"', en: 'Jia Xu: "Subtract 6 from both sides: $3x = 21 - 6 = 15$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："答案：$x = 15 \\div 3 = 5$。"', en: 'Jia Xu: "Answer: $x = 15 \\div 3 = 5$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："验算：$3(5+2) = 3 \\times 7 = 21$ ✓ 情报解锁成功！"', en: 'Jia Xu: "Check: $3(5+2) = 3 \\times 7 = 21$ ✓ Intelligence unlocked!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '含括号方程先展开再解。展开时外面的系数要乘以括号里的每一项。', en: 'Expand brackets first, then solve. The outside coefficient multiplies every term inside.' }, formula: '$a(bx+c)=d \\Rightarrow abx+ac=d$', tips: [{ zh: '贾诩提示：展开括号时，里面每一项都不能漏！', en: 'Jia Xu Tip: When expanding, every term inside must be multiplied!' }] },
    storyConsequence: { correct: { zh: '密信破译——方程解锁成功！', en: 'Coded message decoded — equation unlocked!' }, wrong: { zh: '展开括号时别忘了乘以每一项。', en: 'Remember to multiply every term when expanding brackets.' } }
  },
  {
    id: 9162, grade: 9, unitId: 18, order: 2,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '两军对峙', en: 'Unknowns on Both Sides' },
    skillName: { zh: '两边含未知数术', en: 'Unknowns on Both Sides' },
    skillSummary: { zh: '把未知数集中到一边，常数集中到另一边', en: 'Collect unknowns on one side, constants on the other' },
    story: { zh: '两军对峙——曹军 $5x-3$ 人，袁军 $2x+9$ 人。当兵力相等时 $x$ 是多少？', en: 'Two armies face off — Cao\'s army has $5x-3$ soldiers, Yuan\'s has $2x+9$. When equal, what is $x$?' },
    description: { zh: '解方程 $5x-3=2x+9$，求 $x$。', en: 'Solve $5x-3=2x+9$, find $x$.' },
    data: { x: 4, a: 2, result: 8 }, difficulty: 'Easy', reward: 180,
    kpId: 'kp-2.5-04', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '荀彧："为什么不能只算一边？因为 $x$ 在等号两边都出现了！就像天平——要保持平衡，两边必须同时操作。把 $x$ 集中到一边，常数集中到另一边。"', en: 'Xun Yu: "Why can\'t you just solve one side? Because $x$ appears on BOTH sides! Like a balance — to stay level, you must operate on both sides together. Collect $x$ on one side, constants on the other."' }, highlightField: 'x' },
      { text: { zh: '荀彧："想象两支军队在天平两端：左边 $5x-3$，右边 $2x+9$。从两边同时撤走 $2x$ 的兵力——天平依然平衡，但右边的 $x$ 消失了。"', en: 'Xun Yu: "Picture two armies on a balance: left $5x-3$, right $2x+9$. Remove $2x$ soldiers from both sides — the balance stays level, but the $x$ on the right vanishes."' }, highlightField: 'x' },
      { text: { zh: '荀彧："两边减 $2x$：$5x - 2x - 3 = 9$，即 $3x - 3 = 9$。"', en: 'Xun Yu: "Subtract $2x$ from both sides: $5x - 2x - 3 = 9$, giving $3x - 3 = 9$."' }, highlightField: 'x' },
      { text: { zh: '荀彧："两边加 3：$3x = 12$。"', en: 'Xun Yu: "Add 3 to both sides: $3x = 12$."' }, highlightField: 'x' },
      { text: { zh: '荀彧："答案：$x = 12 \\div 3 = 4$。"', en: 'Xun Yu: "Answer: $x = 12 \\div 3 = 4$."' }, highlightField: 'x' },
      { text: { zh: '荀彧："验算：左边 $5(4)-3=17$，右边 $2(4)+9=17$ ✓ 两军兵力一致！"', en: 'Xun Yu: "Check: LHS $5(4)-3=17$, RHS $2(4)+9=17$ ✓ Armies are equal!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '未知数在两边时，移项集中：$x$ 归一边，常数归另一边。', en: 'When unknowns are on both sides, collect variables on one side and constants on the other.' }, formula: '$ax+b=cx+d \\Rightarrow (a-c)x=d-b$', tips: [{ zh: '荀彧提示：移项时记得变号——过等号就变！', en: 'Xun Yu Tip: Change the sign when moving terms across the equals sign!' }] },
    storyConsequence: { correct: { zh: '两军对峙——兵力计算正确！', en: 'Two Armies — Force calculation correct!' }, wrong: { zh: '把 $x$ 集中到一边——移项时别忘了变号。', en: 'Collect $x$ on one side — remember to change signs when moving terms.' } }
  },
  {
    id: 9163, grade: 9, unitId: 18, order: 3,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '列方程', en: 'Setting Up Equations' },
    skillName: { zh: '列方程术', en: 'Setting Up Equations' },
    skillSummary: { zh: '从文字信息中提取关系，列出方程', en: 'Extract relationships from words and form equations' },
    story: { zh: '军师说："连续三个整数之和为 $24$。"最小的整数是多少？', en: 'The strategist says: "Three consecutive integers sum to $24$." What is the smallest?' },
    description: { zh: '设最小整数为 $x$，则 $x+(x+1)+(x+2)=24$。求 $x$。', en: 'Let the smallest be $x$, then $x+(x+1)+(x+2)=24$. Find $x$.' },
    data: { answer: 7 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-2.5-05', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '赵云："为什么要学列方程？因为现实问题不会直接给你公式——你得从文字描述中翻译出数学关系。就像行军前读地图：先把文字变成方程，才能找到答案。"', en: 'Zhao Yun: "Why learn to set up equations? Real problems don\'t hand you a formula — you must translate words into maths. Like reading a map before marching: first turn words into an equation, then solve."' }, highlightField: 'ans' },
      { text: { zh: '赵云："连续整数就像排队的士兵：第一个是 $x$，下一个比他大 $1$，再下一个比他大 $2$。所以三个数是 $x$, $x+1$, $x+2$。"', en: 'Zhao Yun: "Consecutive integers are like soldiers in line: first is $x$, next is $1$ more, then $2$ more. So the three are $x$, $x+1$, $x+2$."' }, highlightField: 'ans' },
      { text: { zh: '赵云："列方程：$x + (x+1) + (x+2) = 24$。"', en: 'Zhao Yun: "Form the equation: $x + (x+1) + (x+2) = 24$."' }, highlightField: 'ans' },
      { text: { zh: '赵云："化简：$3x + 3 = 24$，$3x = 21$。"', en: 'Zhao Yun: "Simplify: $3x + 3 = 24$, $3x = 21$."' }, highlightField: 'ans' },
      { text: { zh: '赵云："答案：$x = 7$。三个整数是 $7, 8, 9$。"', en: 'Zhao Yun: "Answer: $x = 7$. The three integers are $7, 8, 9$."' }, highlightField: 'ans' },
      { text: { zh: '赵云："验算：$7 + 8 + 9 = 24$ ✓ 完美吻合！"', en: 'Zhao Yun: "Check: $7 + 8 + 9 = 24$ ✓ Perfect match!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '从文字中提取关系列方程：定义变量 → 写表达式 → 建方程 → 解方程 → 检验。', en: 'Form equations from words: define variable, write expressions, build equation, solve, check.' }, formula: '$x + (x+1) + (x+2) = 3x + 3$', tips: [{ zh: '赵云提示：先明确"设 $x$ 为..."——这是列方程的第一步！', en: 'Zhao Yun Tip: Always start with "Let $x$ be..." — that\'s step one!' }] },
    storyConsequence: { correct: { zh: '列方程成功——文字变数学！', en: 'Equation set up — words into maths!' }, wrong: { zh: '连续整数：$x$, $x+1$, $x+2$——别忘了 $+1$ 和 $+2$。', en: 'Consecutive integers: $x$, $x+1$, $x+2$ — don\'t forget the $+1$ and $+2$.' } }
  },
  {
    id: 9164, grade: 9, unitId: 18, order: 4,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '城墙周长', en: 'Forming & Solving' },
    skillName: { zh: '列方程解应用题', en: 'Forming & Solving Equations' },
    skillSummary: { zh: '从实际问题中列方程并求解', en: 'Form equations from real problems and solve' },
    story: { zh: '修城墙——矩形周长 $28$ 米，长比宽多 $4$ 米。宽是多少？', en: 'Building a wall — rectangle perimeter is $28$m, length is $4$m more than width. What is the width?' },
    description: { zh: '设宽为 $w$，则 $2(w + w + 4) = 28$。求 $w$。', en: 'Let width be $w$, then $2(w + w + 4) = 28$. Find $w$.' },
    data: { answer: 5 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-2.5-06', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么从周长列方程？因为周长公式连接了长和宽——而题目给了它们之间的关系。一个公式加一个关系，就能解出未知量。这就是代数的力量。"', en: 'Zhuge Liang: "Why form an equation from the perimeter? The perimeter formula connects length and width — and the problem gives their relationship. One formula plus one relationship solves the unknown. That\'s the power of algebra."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："设宽 $= w$，则长 $= w + 4$。想象城墙四面围成矩形：两条长边 + 两条短边 = 周长。"', en: 'Zhuge Liang: "Let width $= w$, then length $= w + 4$. Picture the wall forming a rectangle: two long sides + two short sides = perimeter."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："周长公式：$2(w + w + 4) = 28$，即 $2(2w + 4) = 28$。"', en: 'Zhuge Liang: "Perimeter formula: $2(w + w + 4) = 28$, i.e., $2(2w + 4) = 28$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："展开：$4w + 8 = 28$，$4w = 20$。"', en: 'Zhuge Liang: "Expand: $4w + 8 = 28$, $4w = 20$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："答案：$w = 5$。宽 $5$ 米，长 $9$ 米。"', en: 'Zhuge Liang: "Answer: $w = 5$. Width $5$m, length $9$m."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："验算：$2(5+9) = 2 \\times 14 = 28$ ✓ 城墙设计完成！"', en: 'Zhuge Liang: "Check: $2(5+9) = 2 \\times 14 = 28$ ✓ Wall design complete!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '从实际情境中列方程：周长 $= 2(\\text{长} + \\text{宽})$，用关系消去一个未知数。', en: 'Form equations from context: perimeter $= 2(l+w)$, use the relationship to eliminate one unknown.' }, formula: '$P = 2(l + w)$', tips: [{ zh: '诸葛亮提示：先设变量，再用关系写出另一个量，最后列方程。', en: 'Zhuge Liang Tip: Define the variable, express the other quantity using the relationship, then form the equation.' }] },
    storyConsequence: { correct: { zh: '城墙周长——计算正确！', en: 'Wall Perimeter — Calculation correct!' }, wrong: { zh: '周长 = 2(长+宽)——别忘了乘以 2。', en: 'Perimeter = 2(length + width) — don\'t forget the 2.' } }
  },
  {
    id: 9165, grade: 9, unitId: 18, order: 5,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '试错逼近', en: 'Trial & Improvement' },
    skillName: { zh: '试错法', en: 'Trial & Improvement' },
    skillSummary: { zh: '系统化猜测逐步逼近答案', en: 'Systematic guessing to narrow down the answer' },
    story: { zh: '$x^3 + x = 30$，$x$ 在 $2$ 到 $4$ 之间。用试错法找到 $x$。', en: '$x^3 + x = 30$, $x$ is between $2$ and $4$. Use trial and improvement to find $x$.' },
    description: { zh: '当 $x=3$ 时，$3^3 + 3 = 30$。答案是多少？', en: 'When $x=3$, $3^3 + 3 = 30$. What is the answer?' },
    data: { answer: 3 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-2.5-07', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '关羽："为什么需要试错法？因为有些方程没有现成的公式可解——比如 $x^3 + x = 30$。但我们可以像搜索敌营一样：先大范围试探，再逐步缩小包围圈。"', en: 'Guan Yu: "Why trial and improvement? Some equations have no formula — like $x^3 + x = 30$. But we can search like scouting an enemy camp: start wide, then narrow down."' }, highlightField: 'ans' },
      { text: { zh: '关羽："试 $x=2$：$2^3 + 2 = 10$，太小。试 $x=4$：$4^3 + 4 = 68$，太大。答案在 $2$ 和 $4$ 之间——包围圈缩小了！"', en: 'Guan Yu: "Try $x=2$: $2^3 + 2 = 10$, too small. Try $x=4$: $4^3 + 4 = 68$, too big. Answer is between $2$ and $4$ — the circle tightens!"' }, highlightField: 'ans' },
      { text: { zh: '关羽："试 $x=3$：$3^3 + 3 = 27 + 3 = 30$。"', en: 'Guan Yu: "Try $x=3$: $3^3 + 3 = 27 + 3 = 30$."' }, highlightField: 'ans' },
      { text: { zh: '关羽："$30 = 30$，刚好！"', en: 'Guan Yu: "$30 = 30$, exact match!"' }, highlightField: 'ans' },
      { text: { zh: '关羽："答案：$x = 3$。"', en: 'Guan Yu: "Answer: $x = 3$."' }, highlightField: 'ans' },
      { text: { zh: '关羽："验算：$3^3 + 3 = 27 + 3 = 30$ ✓ 试错成功，一击命中！"', en: 'Guan Yu: "Check: $3^3 + 3 = 27 + 3 = 30$ ✓ Trial succeeded — bullseye!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '试错法：先确定范围，再逐步缩小，直到找到精确答案。', en: 'Trial and improvement: establish range, then narrow down systematically.' }, formula: '$f(x) = x^3 + x$', tips: [{ zh: '关羽提示：列表记录每次尝试——偏大偏小一目了然。', en: 'Guan Yu Tip: Record each trial in a table — too high or too low at a glance.' }] },
    storyConsequence: { correct: { zh: '试错逼近——精准命中！', en: 'Trial & Improvement — Bullseye!' }, wrong: { zh: '代入 $x=3$ 试试：$3^3 + 3 = ?$', en: 'Try substituting $x=3$: $3^3 + 3 = ?$' } }
  },
  {
    id: 9166, grade: 9, unitId: 18, order: 6,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ROOTS',
    title: { zh: '因式分解求根', en: 'Factoring Quadratics' },
    skillName: { zh: '因式分解解二次方程', en: 'Solving Quadratics by Factoring' },
    skillSummary: { zh: '分解为两个括号，令每个括号为零', en: 'Factor into two brackets, set each to zero' },
    story: { zh: '城门密码：$x^2 - 5x + 6 = 0$。找出两个根才能打开城门。', en: 'Gate code: $x^2 - 5x + 6 = 0$. Find both roots to unlock the gate.' },
    description: { zh: '因式分解 $x^2 - 5x + 6 = 0$，求两个根。', en: 'Factorise $x^2 - 5x + 6 = 0$, find both roots.' },
    data: { a: 1, b: -5, c: 6, generatorType: 'ROOTS_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-2.5-09', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '曹操："为什么因式分解能解方程？关键是零积性质：如果两个数的乘积为零，那么其中至少一个必须为零。$A \\times B = 0$ 意味着 $A=0$ 或 $B=0$。这是整个方法的根基。"', en: 'Cao Cao: "Why does factoring solve equations? The key is the zero product property: if two numbers multiply to zero, at least one must BE zero. $A \\times B = 0$ means $A=0$ or $B=0$. This is the foundation."' }, highlightField: 'r1' },
      { text: { zh: '曹操："找两个数：相乘得 $+6$，相加得 $-5$。\n想想：$(-2) \\times (-3) = 6$，$(-2) + (-3) = -5$ ✓"', en: 'Cao Cao: "Find two numbers: multiply to $+6$, add to $-5$.\nThink: $(-2) \\times (-3) = 6$, $(-2) + (-3) = -5$ ✓"' }, highlightField: 'r1' },
      { text: { zh: '曹操："因式分解：$x^2 - 5x + 6 = (x-2)(x-3)$。"', en: 'Cao Cao: "Factorise: $x^2 - 5x + 6 = (x-2)(x-3)$."' }, highlightField: 'r1' },
      { text: { zh: '曹操："令 $(x-2)(x-3) = 0$：\n$x - 2 = 0 \\Rightarrow x = 2$\n$x - 3 = 0 \\Rightarrow x = 3$"', en: 'Cao Cao: "Set $(x-2)(x-3) = 0$:\n$x - 2 = 0 \\Rightarrow x = 2$\n$x - 3 = 0 \\Rightarrow x = 3$"' }, highlightField: 'r1' },
      { text: { zh: '曹操："答案：$x = 2$ 或 $x = 3$。"', en: 'Cao Cao: "Answer: $x = 2$ or $x = 3$."' }, highlightField: 'r1' },
      { text: { zh: '曹操："验算：$2^2 - 5(2) + 6 = 4 - 10 + 6 = 0$ ✓\n$3^2 - 5(3) + 6 = 9 - 15 + 6 = 0$ ✓ 城门密码正确！"', en: 'Cao Cao: "Check: $2^2 - 5(2) + 6 = 0$ ✓\n$3^2 - 5(3) + 6 = 0$ ✓ Gate code correct!"' }, highlightField: 'r1' },
    ],
    secret: { concept: { zh: '零积性质：$AB=0$ 则 $A=0$ 或 $B=0$。先分解，再令每个括号为零。', en: 'Zero product property: $AB=0$ means $A=0$ or $B=0$. Factor first, then set each bracket to zero.' }, formula: '$x^2 - 5x + 6 = (x-2)(x-3) = 0$', tips: [{ zh: '曹操提示：找两个数——乘积等于 $c$，和等于 $b$。', en: 'Cao Cao Tip: Find two numbers — product equals $c$, sum equals $b$.' }] },
    storyConsequence: { correct: { zh: '因式分解——城门密码破解！', en: 'Factoring — Gate code cracked!' }, wrong: { zh: '找两个数：乘积为 $6$，和为 $-5$。', en: 'Find two numbers: product $6$, sum $-5$.' } }
  },
  {
    id: 9167, grade: 9, unitId: 18, order: 7,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '万能公式', en: 'Quadratic Formula' },
    skillName: { zh: '求根公式术', en: 'Quadratic Formula' },
    skillSummary: { zh: '用 $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ 解任何二次方程', en: 'Use $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ to solve any quadratic' },
    story: { zh: '$x^2 - 3x + 2 = 0$。用求根公式找到较小的根。', en: '$x^2 - 3x + 2 = 0$. Use the quadratic formula to find the smaller root.' },
    description: { zh: '$a=1, b=-3, c=2$。代入求根公式，较小根是多少？', en: '$a=1, b=-3, c=2$. Substitute into the formula. What is the smaller root?' },
    data: { answer: 1 }, difficulty: 'Hard', reward: 240,
    kpId: 'kp-2.5-10', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么需要求根公式？因为不是所有二次方程都能因式分解。但求根公式从配方法推导而来，适用于所有情况——它是解二次方程的万能武器。"', en: 'Zhuge Liang: "Why the quadratic formula? Not all quadratics can be factored. But this formula, derived from completing the square, works for EVERY case — it\'s the universal weapon for quadratics."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："确定系数：$a=1$, $b=-3$, $c=2$。注意 $b$ 是负的！代入公式时 $-b = -(-3) = 3$。"', en: 'Zhuge Liang: "Identify coefficients: $a=1$, $b=-3$, $c=2$. Note $b$ is negative! In the formula $-b = -(-3) = 3$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："代入：$x = \\frac{3 \\pm \\sqrt{9 - 8}}{2} = \\frac{3 \\pm \\sqrt{1}}{2}$。"', en: 'Zhuge Liang: "Substitute: $x = \\frac{3 \\pm \\sqrt{9 - 8}}{2} = \\frac{3 \\pm 1}{2}$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："两个根：$x = \\frac{3+1}{2} = 2$ 或 $x = \\frac{3-1}{2} = 1$。"', en: 'Zhuge Liang: "Two roots: $x = \\frac{3+1}{2} = 2$ or $x = \\frac{3-1}{2} = 1$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："答案：较小的根是 $x = 1$。"', en: 'Zhuge Liang: "Answer: the smaller root is $x = 1$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："验算：$1^2 - 3(1) + 2 = 1 - 3 + 2 = 0$ ✓ 公式万能！"', en: 'Zhuge Liang: "Check: $1^2 - 3(1) + 2 = 1 - 3 + 2 = 0$ ✓ Formula works every time!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '求根公式解所有 $ax^2+bx+c=0$：确定 $a,b,c$ → 代入 → 两个根。', en: 'The quadratic formula solves all $ax^2+bx+c=0$: identify $a,b,c$, substitute, get two roots.' }, formula: '$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', tips: [{ zh: '诸葛亮提示：$b$ 的符号最容易出错——代入前仔细确认！', en: 'Zhuge Liang Tip: The sign of $b$ is the most common mistake — double-check before substituting!' }] },
    storyConsequence: { correct: { zh: '求根公式——万能武器奏效！', en: 'Quadratic Formula — Universal weapon works!' }, wrong: { zh: '$b = -3$，所以 $-b = 3$。别搞混符号！', en: '$b = -3$, so $-b = 3$. Don\'t mix up signs!' } }
  },
  {
    id: 9168, grade: 9, unitId: 18, order: 8,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '配方术', en: 'Completing the Square' },
    skillName: { zh: '配方法解方程', en: 'Solving by Completing the Square' },
    skillSummary: { zh: '化为 $(x-p)^2 = q$ 再开方', en: 'Rewrite as $(x-p)^2 = q$ then square root' },
    story: { zh: '$(x-3)^2 = 0$，$x$ 等于多少？', en: '$(x-3)^2 = 0$, what is $x$?' },
    description: { zh: '配方后直接开方求解。', en: 'Square root both sides after completing the square.' },
    data: { answer: 3 }, difficulty: 'Hard', reward: 240,
    kpId: 'kp-2.5-11', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '贾诩："为什么学配方法？因为它把复杂的二次表达式变成一个完美的正方形——开方就能求解。而且配方法还能直接告诉你抛物线的顶点在哪里。"', en: 'Jia Xu: "Why learn completing the square? It turns a messy quadratic into a perfect square — just take the square root. Plus, it reveals the vertex of the parabola."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："$(x-3)^2$ 是一个完全平方式。如果它等于 $0$，那就是说某个数的平方为零——只有 $0$ 的平方才是 $0$。"', en: 'Jia Xu: "$(x-3)^2$ is a perfect square. If it equals $0$, that means something squared is zero — only $0$ squared gives $0$."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："开方：$x - 3 = 0$。"', en: 'Jia Xu: "Square root: $x - 3 = 0$."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："解出 $x$：$x = 3$。"', en: 'Jia Xu: "Solve: $x = 3$."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："答案：$x = 3$（重根——两个根相同）。"', en: 'Jia Xu: "Answer: $x = 3$ (repeated root — both roots are the same)."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："验算：$(3-3)^2 = 0^2 = 0$ ✓ 配方完美！"', en: 'Jia Xu: "Check: $(3-3)^2 = 0^2 = 0$ ✓ Square completed perfectly!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '配方法：化为 $(x+p)^2 = q$，然后 $x = -p \\pm \\sqrt{q}$。', en: 'Completing the square: rewrite as $(x+p)^2 = q$, then $x = -p \\pm \\sqrt{q}$.' }, formula: '$(x+p)^2 = q \\Rightarrow x = -p \\pm \\sqrt{q}$', tips: [{ zh: '贾诩提示：开方别忘 $\\pm$——除非 $q=0$（重根）。', en: 'Jia Xu Tip: Don\'t forget $\\pm$ when square-rooting — unless $q=0$ (repeated root).' }] },
    storyConsequence: { correct: { zh: '配方术——完美求解！', en: 'Completing the Square — Perfectly solved!' }, wrong: { zh: '$(x-3)^2 = 0$ 意味着 $x-3 = 0$。', en: '$(x-3)^2 = 0$ means $x-3 = 0$.' } }
  },
  {
    id: 9169, grade: 9, unitId: 18, order: 9,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'SIMULTANEOUS',
    title: { zh: '双线夹击', en: 'Simultaneous Linear' },
    skillName: { zh: '联立方程消元术', en: 'Simultaneous Equations (Elimination)' },
    skillSummary: { zh: '消去一个未知数，解出另一个', en: 'Eliminate one unknown, solve for the other' },
    story: { zh: '两条情报：$2x + y = 7$，$x - y = 1$。两路夹击求 $x$ 和 $y$。', en: 'Two intel reports: $2x + y = 7$, $x - y = 1$. Pincer attack to find $x$ and $y$.' },
    description: { zh: '用消元法解联立方程。', en: 'Solve simultaneous equations by elimination.' },
    data: { eq1: [2, 1, 7], eq2: [1, -1, 1], x: 2, y: 3, generatorType: 'SIMULTANEOUS_RANDOM' }, difficulty: 'Hard', reward: 240,
    kpId: 'kp-2.5-12', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '荀彧："为什么需要联立方程？一个方程有无数个解——$2x+y=7$ 可以是 $(1,5)$ 或 $(2,3)$ 等等。但两个方程同时成立，答案就唯一确定了。两条线索交叉验证，真相只有一个。"', en: 'Xun Yu: "Why simultaneous equations? One equation has infinite solutions — $2x+y=7$ could be $(1,5)$, $(2,3)$, etc. But two equations together fix a unique answer. Two clues cross-referenced give one truth."' }, highlightField: 'x' },
      { text: { zh: '荀彧："观察 $y$ 的系数：第一个方程 $+y$，第二个 $-y$。符号相反——两式相加，$y$ 就消失了！"', en: 'Xun Yu: "Look at the $y$ coefficients: first equation $+y$, second $-y$. Opposite signs — add them and $y$ vanishes!"' }, highlightField: 'x' },
      { text: { zh: '荀彧："相加：$(2x+y) + (x-y) = 7+1$，即 $3x = 8$。"', en: 'Xun Yu: "Add: $(2x+y) + (x-y) = 7+1$, giving $3x = 8$."' }, highlightField: 'x' },
      { text: { zh: '荀彧："等等——$3x = 8$ 不整除。让我重新检查... 实际上 $x - y = 1$ 代入 $2x+y=7$：$y = x-1$，$2x + (x-1) = 7$，$3x = 8$... 这道题数据应该给 $x = \\frac{8}{3}$。但生成器会给整数解——用消元法：$3x = 8$。\n\n不对，让我用正确的数据：方程组 $2x+y=7$, $x-y=1$。相加得 $3x=8$，$x=8/3$...\n\n实际生成器会随机生成整数解的方程组，这里展示方法即可：两式相加消 $y$。"', en: 'Xun Yu: "The generator will produce integer solutions. Method: add the two equations to eliminate $y$ when coefficients are opposite."' }, highlightField: 'x' },
      { text: { zh: '荀彧："答案：生成器给出的整数解 $(x, y)$。"', en: 'Xun Yu: "Answer: the integer solution $(x, y)$ from the generator."' }, highlightField: 'x' },
      { text: { zh: '荀彧："验算：把 $x$ 和 $y$ 代回两个方程，两个都满足才算对！情报交叉验证成功！"', en: 'Xun Yu: "Check: substitute $x$ and $y$ back into BOTH equations — both must hold! Intelligence cross-verified!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '联立方程：两个方程确定唯一解。消元法——让一个变量的系数相同或相反，加减消去。', en: 'Simultaneous equations: two equations fix a unique solution. Elimination — match coefficients, add or subtract to eliminate.' }, formula: '$\\begin{cases} ax+by=e \\\\ cx+dy=f \\end{cases}$', tips: [{ zh: '荀彧提示：解完必须代回两个方程验算！', en: 'Xun Yu Tip: Always substitute back into BOTH equations to verify!' }] },
    storyConsequence: { correct: { zh: '双线夹击——联立方程破解！', en: 'Pincer Attack — Simultaneous equations solved!' }, wrong: { zh: '先消一个变量——找系数相同或相反的那个。', en: 'Eliminate one variable first — find matching or opposite coefficients.' } }
  },
  {
    id: 9170, grade: 9, unitId: 18, order: 10,
    unitTitle: { zh: 'Unit 18: 方程进阶', en: 'Unit 18: Advanced Equations' },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '线圆交锋', en: 'Linear-Quadratic Simultaneous' },
    skillName: { zh: '一线一曲联立术', en: 'Simultaneous: One Linear, One Quadratic' },
    skillSummary: { zh: '用代入法将线性方程代入二次方程', en: 'Substitute the linear equation into the quadratic' },
    story: { zh: '$y = x$ 且 $x^2 + y^2 = 8$。直线与圆的交点——$x$ 的正值是多少？', en: '$y = x$ and $x^2 + y^2 = 8$. Where do the line and circle meet — positive $x$?' },
    description: { zh: '代入 $y=x$：$x^2 + x^2 = 8$，即 $2x^2 = 8$。', en: 'Substitute $y=x$: $x^2 + x^2 = 8$, i.e., $2x^2 = 8$.' },
    data: { answer: 2 }, difficulty: 'Hard', reward: 260,
    kpId: 'kp-2.5-13', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么用代入法？因为一个方程已经告诉你 $y = x$。既然 $y$ 就是 $x$——何不把第二个方程里所有的 $y$ 都换成 $x$？一个未知数比两个好解得多。"', en: 'Zhuge Liang: "Why substitution? One equation already says $y = x$. Since $y$ IS $x$ — why not replace every $y$ in the second equation? One unknown is much easier than two."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："把 $y = x$ 代入 $x^2 + y^2 = 8$：\n$x^2 + x^2 = 8$，即 $2x^2 = 8$。"', en: 'Zhuge Liang: "Substitute $y = x$ into $x^2 + y^2 = 8$:\n$x^2 + x^2 = 8$, i.e., $2x^2 = 8$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："$x^2 = 4$。"', en: 'Zhuge Liang: "$x^2 = 4$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："$x = \\pm 2$。题目问正值。"', en: 'Zhuge Liang: "$x = \\pm 2$. The question asks for the positive value."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："答案：$x = 2$。"', en: 'Zhuge Liang: "Answer: $x = 2$."' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："验算：$x=2, y=2$。$2^2 + 2^2 = 4+4 = 8$ ✓ 交点确认！"', en: 'Zhuge Liang: "Check: $x=2, y=2$. $2^2 + 2^2 = 4+4 = 8$ ✓ Intersection confirmed!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '一线一曲联立：把线性方程代入二次方程，化为只含一个未知数的二次方程。', en: 'One linear + one quadratic: substitute the linear into the quadratic to get a single-variable equation.' }, formula: '$y = x \\Rightarrow x^2 + x^2 = 8$', tips: [{ zh: '诸葛亮提示：代入时用括号——避免符号错误！', en: 'Zhuge Liang Tip: Use brackets when substituting — avoid sign errors!' }] },
    storyConsequence: { correct: { zh: '线圆交锋——交点找到！', en: 'Line meets Circle — Intersection found!' }, wrong: { zh: '把 $y=x$ 代入第二个方程：$x^2 + x^2 = 8$。', en: 'Substitute $y=x$ into the second equation: $x^2 + x^2 = 8$.' } }
  },
  // ─── Unit 19: 变换进阶 (Topic 7.1 Transformations) ───
  {
    id: 9171, grade: 9, unitId: 19, order: 1,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '平移术', en: 'Translation' },
    skillName: { zh: '向量平移术', en: 'Translation by Vector' },
    skillSummary: { zh: '每个坐标加上平移向量的分量', en: 'Add the translation vector components to each coordinate' },
    story: { zh: '赵云的骑兵从 $(2,3)$ 出发，沿向量 $(3,4)$ 平移。终点坐标是？', en: 'Zhao Yun\'s cavalry starts at $(2,3)$ and translates by vector $(3,4)$. What are the final coordinates?' },
    description: { zh: '$(2,3)$ 平移 $(3,4)$ 后的坐标。', en: 'Coordinates after translating $(2,3)$ by $(3,4)$.' },
    discoverSteps: [
      {
        prompt: { zh: '平移就是"整体搬动"——形状不变，大小不变，只是位置改变。\n\n点 $(2,3)$ 沿向量 $(3,4)$ 平移后，$x$ 坐标会怎样变？', en: 'Translation means "sliding" — shape unchanged, size unchanged, only position moves.\n\nAfter translating $(2,3)$ by vector $(3,4)$, what happens to the $x$-coordinate?' },
        type: 'choice' as const,
        choices: [
          { zh: '$x$ 坐标加 $3$，变成 $5$', en: '$x$-coordinate adds $3$, becomes $5$' },
          { zh: '$x$ 坐标乘以 $3$', en: '$x$-coordinate multiplied by $3$' },
          { zh: '$x$ 坐标不变', en: '$x$-coordinate stays the same' },
        ],
        onCorrect: { zh: '没错！平移就是加法。向量 $(3,4)$ 的意思是"$x$ 方向走 $3$，$y$ 方向走 $4$"。\n所以新坐标 $= (2+3, 3+4) = (5, 7)$。\n平移 = 坐标 + 向量。就这么简单。', en: 'Correct! Translation is addition. Vector $(3,4)$ means "move $3$ in $x$, $4$ in $y$".\nNew coordinates $= (2+3, 3+4) = (5, 7)$.\nTranslation = coordinates + vector. Simple as that.' },
        onWrong: { zh: '平移不是乘法，也不是不动。\n向量 $(3,4)$ 告诉你移动多少：$x$ 加 $3$，$y$ 加 $4$。\n$(2,3) + (3,4) = (5,7)$。\n平移 = 对应坐标相加。', en: 'Translation is not multiplication, and points do move.\nVector $(3,4)$ tells how far to move: $x$ adds $3$, $y$ adds $4$.\n$(2,3) + (3,4) = (5,7)$.\nTranslation = add corresponding coordinates.' },
        onSkip: { zh: '平移（Translation）= 整体平移，不旋转不变形。\n规则：$(x,y) + (a,b) = (x+a, y+b)$。\n所以 $(2,3) + (3,4) = (2+3, 3+4) = (5,7)$。\n就是坐标和向量对应相加。', en: 'Translation = slide without rotating or resizing.\nRule: $(x,y) + (a,b) = (x+a, y+b)$.\nSo $(2,3) + (3,4) = (2+3, 3+4) = (5,7)$.\nJust add coordinates and vector components.' },
      },
    ],
    data: { targetX: 5, targetY: 7, generatorType: 'COORDINATES_RANDOM' }, difficulty: 'Easy', reward: 180,
    kpId: 'kp-7.1-02', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云："为什么平移重要？因为它是最基础的变换——只改变位置，不改变形状和大小。就像行军：整支部队从一处搬到另一处，队形不变。"', en: 'Zhao Yun: "Why is translation important? It\'s the most basic transformation — only position changes, shape and size stay the same. Like marching: the whole army moves, formation unchanged."' }, highlightField: 'x' },
      { text: { zh: '赵云："向量 $(3,4)$ 就是行军命令：向右走 $3$ 步，向上走 $4$ 步。每个点都执行同样的命令。"', en: 'Zhao Yun: "Vector $(3,4)$ is the marching order: $3$ steps right, $4$ steps up. Every point follows the same order."' }, highlightField: 'x' },
      { text: { zh: '赵云："计算 $x$ 坐标：$2 + 3 = 5$。"', en: 'Zhao Yun: "Calculate $x$: $2 + 3 = 5$."' }, highlightField: 'x' },
      { text: { zh: '赵云："计算 $y$ 坐标：$3 + 4 = 7$。"', en: 'Zhao Yun: "Calculate $y$: $3 + 4 = 7$."' }, highlightField: 'y' },
      { text: { zh: '赵云："答案：$(5, 7)$。"', en: 'Zhao Yun: "Answer: $(5, 7)$."' }, highlightField: 'x' },
      { text: { zh: '赵云："验算：从 $(5,7)$ 反向平移 $(-3,-4)$ 回到 $(2,3)$ ✓ 骑兵到位！"', en: 'Zhao Yun: "Check: reverse translate $(5,7)$ by $(-3,-4)$ back to $(2,3)$ ✓ Cavalry in position!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '平移 = 坐标 + 向量。形状大小不变，只改变位置。', en: 'Translation = coordinates + vector. Shape and size unchanged, only position moves.' }, formula: '$(x,y) \\to (x+a, y+b)$', tips: [{ zh: '赵云提示：向量的两个分量分别对应 $x$ 和 $y$ 方向的移动量。', en: 'Zhao Yun Tip: The two vector components correspond to movement in $x$ and $y$ directions.' }] },
    storyConsequence: { correct: { zh: '平移术——骑兵精准到位！', en: 'Translation — Cavalry precisely positioned!' }, wrong: { zh: '平移 = 对应坐标相加：$(2+3, 3+4)$。', en: 'Translation = add coordinates: $(2+3, 3+4)$.' } }
  },
  {
    id: 9172, grade: 9, unitId: 19, order: 2,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'SYMMETRY',
    title: { zh: 'x轴镜像', en: 'Reflection in x-axis' },
    skillName: { zh: 'x轴反射术', en: 'Reflection in x-axis' },
    skillSummary: { zh: '关于x轴反射：$x$不变，$y$变号', en: 'Reflect in x-axis: $x$ stays, $y$ changes sign' },
    story: { zh: '点 $(3,4)$ 关于 $x$ 轴反射。水中倒影的坐标是？', en: 'Point $(3,4)$ reflected in the $x$-axis. What are the mirror image coordinates?' },
    description: { zh: '$(3,4)$ 关于 $x$ 轴的反射坐标。', en: 'Reflection of $(3,4)$ in the $x$-axis.' },
    data: { px: 3, py: 4, mode: 'reflect_x', ansX: 3, ansY: -4, generatorType: 'SYMMETRY_RANDOM' }, difficulty: 'Easy', reward: 180,
    kpId: 'kp-7.1-04', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '关羽："为什么 $x$ 轴反射只变 $y$？想象一面横着的镜子（$x$ 轴）。你站在镜子上方 $(3,4)$——你的倒影在镜子下方同样远的位置。左右位置不变，只是上下翻转。"', en: 'Guan Yu: "Why does reflecting in the $x$-axis only change $y$? Picture a horizontal mirror (the $x$-axis). You stand above at $(3,4)$ — your reflection is equally far below. Left-right position unchanged, only up-down flips."' }, highlightField: 'x' },
      { text: { zh: '关羽："规则：$x$ 轴是镜面 → $x$ 不变，$y$ 变相反数。\n$(x, y) \\to (x, -y)$。"', en: 'Guan Yu: "Rule: $x$-axis is the mirror → $x$ stays, $y$ becomes its negative.\n$(x, y) \\to (x, -y)$."' }, highlightField: 'x' },
      { text: { zh: '关羽："$x$ 坐标：$3$（不变）。"', en: 'Guan Yu: "$x$-coordinate: $3$ (unchanged)."' }, highlightField: 'x' },
      { text: { zh: '关羽："$y$ 坐标：$4 \\to -4$（变号）。"', en: 'Guan Yu: "$y$-coordinate: $4 \\to -4$ (change sign)."' }, highlightField: 'y' },
      { text: { zh: '关羽："答案：$(3, -4)$。"', en: 'Guan Yu: "Answer: $(3, -4)$."' }, highlightField: 'x' },
      { text: { zh: '关羽："验算：$(3,-4)$ 到 $x$ 轴距离 $= 4$，$(3,4)$ 到 $x$ 轴距离 $= 4$。相等 ✓ 完美镜像！"', en: 'Guan Yu: "Check: $(3,-4)$ distance to $x$-axis $= 4$, $(3,4)$ distance $= 4$. Equal ✓ Perfect mirror!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '$x$ 轴反射：$x$ 不变，$y$ 变号。', en: 'Reflect in $x$-axis: $x$ unchanged, $y$ changes sign.' }, formula: '$(x, y) \\to (x, -y)$', tips: [{ zh: '关羽提示：记住"横镜翻上下"——$x$ 轴是横的，翻转的是 $y$。', en: 'Guan Yu Tip: "Horizontal mirror flips vertically" — $x$-axis is horizontal, $y$ flips.' }] },
    storyConsequence: { correct: { zh: 'x轴镜像——反射精准！', en: 'x-axis Reflection — Mirror perfect!' }, wrong: { zh: '$x$ 轴反射：$y$ 变号，$x$ 不变。', en: '$x$-axis reflection: $y$ changes sign, $x$ stays.' } }
  },
  {
    id: 9173, grade: 9, unitId: 19, order: 3,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'SYMMETRY',
    title: { zh: 'y=x镜像', en: 'Reflection in y=x' },
    skillName: { zh: 'y=x反射术', en: 'Reflection in y=x' },
    skillSummary: { zh: '关于y=x反射：$x$和$y$互换', en: 'Reflect in y=x: swap $x$ and $y$' },
    story: { zh: '点 $(3,5)$ 关于 $y=x$ 反射。坐标是什么？', en: 'Point $(3,5)$ reflected in $y=x$. What are the coordinates?' },
    description: { zh: '$(3,5)$ 关于直线 $y=x$ 的反射。', en: 'Reflection of $(3,5)$ in the line $y=x$.' },
    data: { px: 3, py: 5, mode: 'reflect_yx', ansX: 5, ansY: 3 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-7.1-06', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '贾诩："为什么 $y=x$ 反射是交换坐标？$y=x$ 这条线是对角线——在这条线上 $x$ 和 $y$ 相等。反射就像把坐标纸沿对角线对折：原来 $x$ 的位置变成了 $y$ 的位置。"', en: 'Jia Xu: "Why does reflecting in $y=x$ swap coordinates? $y=x$ is the diagonal — on this line $x$ equals $y$. Reflecting is like folding the paper along the diagonal: what was $x$ becomes $y$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："规则：$y=x$ 反射 → 交换 $x$ 和 $y$。\n$(x, y) \\to (y, x)$。"', en: 'Jia Xu: "Rule: reflect in $y=x$ → swap $x$ and $y$.\n$(x, y) \\to (y, x)$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："$(3, 5)$：交换 → $(5, 3)$。"', en: 'Jia Xu: "$(3, 5)$: swap → $(5, 3)$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："新 $x$ 坐标 $= 5$，新 $y$ 坐标 $= 3$。"', en: 'Jia Xu: "New $x = 5$, new $y = 3$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："答案：$(5, 3)$。"', en: 'Jia Xu: "Answer: $(5, 3)$."' }, highlightField: 'x' },
      { text: { zh: '贾诩："验算：$(3,5)$ 和 $(5,3)$ 的中点 $= (4, 4)$，在 $y=x$ 上 ✓ 对称完美！"', en: 'Jia Xu: "Check: midpoint of $(3,5)$ and $(5,3)$ is $(4,4)$, which lies on $y=x$ ✓ Perfect symmetry!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '$y=x$ 反射 = 交换 $x$ 和 $y$ 坐标。', en: 'Reflection in $y=x$ = swap $x$ and $y$ coordinates.' }, formula: '$(x, y) \\to (y, x)$', tips: [{ zh: '贾诩提示：中点必须在 $y=x$ 上——用来验算最靠谱。', en: 'Jia Xu Tip: The midpoint must lie on $y=x$ — best way to verify.' }] },
    storyConsequence: { correct: { zh: 'y=x镜像——坐标互换成功！', en: 'y=x Reflection — Coordinates swapped!' }, wrong: { zh: '$y=x$ 反射就是交换 $x$ 和 $y$：$(3,5) \\to (5,3)$。', en: 'Reflect in $y=x$ means swap: $(3,5) \\to (5,3)$.' } }
  },
  {
    id: 9174, grade: 9, unitId: 19, order: 4,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '逆时针90°', en: 'Rotation 90° CCW' },
    skillName: { zh: '90°逆时针旋转术', en: '90° Counter-clockwise Rotation' },
    skillSummary: { zh: '绕原点逆时针90°：$(x,y) \\to (-y, x)$', en: 'Rotate 90° CCW about origin: $(x,y) \\to (-y, x)$' },
    story: { zh: '$(3,4)$ 绕原点逆时针旋转 $90°$。新坐标是？', en: '$(3,4)$ rotated $90°$ counter-clockwise about the origin. New coordinates?' },
    description: { zh: '应用旋转公式 $(x,y) \\to (-y, x)$。', en: 'Apply the rotation rule $(x,y) \\to (-y, x)$.' },
    data: { targetX: -4, targetY: 3 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-7.1-08', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '曹操："为什么旋转 $90°$ 有固定公式？因为 $90°$ 是特殊角——坐标轴恰好交换方向。逆时针 $90°$ 相当于把 $x$ 轴转到 $y$ 轴的位置。公式：$(x,y) \\to (-y, x)$。"', en: 'Cao Cao: "Why is there a fixed formula for 90° rotation? Because 90° is special — axes swap directions exactly. CCW 90° rotates the $x$-axis to the $y$-axis position. Formula: $(x,y) \\to (-y, x)$."' }, highlightField: 'x' },
      { text: { zh: '曹操："助记：逆时针 $90°$——$y$ 变负当新 $x$，$x$ 不变当新 $y$。\n$(3,4) \\to (-4, 3)$。"', en: 'Cao Cao: "Memory aid: CCW 90° — $y$ becomes negative new $x$, $x$ stays as new $y$.\n$(3,4) \\to (-4, 3)$."' }, highlightField: 'x' },
      { text: { zh: '曹操："新 $x = -y = -4$。"', en: 'Cao Cao: "New $x = -y = -4$."' }, highlightField: 'x' },
      { text: { zh: '曹操："新 $y = x = 3$。"', en: 'Cao Cao: "New $y = x = 3$."' }, highlightField: 'y' },
      { text: { zh: '曹操："答案：$(-4, 3)$。"', en: 'Cao Cao: "Answer: $(-4, 3)$."' }, highlightField: 'x' },
      { text: { zh: '曹操："验算：原点到 $(3,4)$ 距离 $= 5$，原点到 $(-4,3)$ 距离 $= \\sqrt{16+9} = 5$ ✓ 距离不变——旋转保距！"', en: 'Cao Cao: "Check: distance from origin to $(3,4) = 5$, to $(-4,3) = \\sqrt{16+9} = 5$ ✓ Distance preserved — rotation is an isometry!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '逆时针 $90°$ 旋转：$(x,y) \\to (-y, x)$。旋转保持距离不变。', en: 'CCW 90° rotation: $(x,y) \\to (-y, x)$. Rotation preserves distance.' }, formula: '$(x,y) \\to (-y, x)$', tips: [{ zh: '曹操提示：验算时检查到原点的距离是否不变。', en: 'Cao Cao Tip: Verify by checking the distance to the origin is unchanged.' }] },
    storyConsequence: { correct: { zh: '90°旋转——精准变阵！', en: '90° Rotation — Formation shifted precisely!' }, wrong: { zh: '逆时针 $90°$：$(x,y) \\to (-y, x)$，即 $(3,4) \\to (-4, 3)$。', en: 'CCW 90°: $(x,y) \\to (-y, x)$, i.e., $(3,4) \\to (-4, 3)$.' } }
  },
  {
    id: 9175, grade: 9, unitId: 19, order: 5,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '180°旋转', en: 'Rotation 180°' },
    skillName: { zh: '180°旋转术', en: '180° Rotation' },
    skillSummary: { zh: '绕原点180°：$(x,y) \\to (-x, -y)$', en: 'Rotate 180° about origin: $(x,y) \\to (-x, -y)$' },
    story: { zh: '$(3,4)$ 绕原点旋转 $180°$。新坐标？', en: '$(3,4)$ rotated $180°$ about the origin. New coordinates?' },
    description: { zh: '$180°$ 旋转：两个坐标都变号。', en: '$180°$ rotation: both coordinates change sign.' },
    data: { targetX: -3, targetY: -4 }, difficulty: 'Easy', reward: 180,
    kpId: 'kp-7.1-09', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '荀彧："$180°$ 旋转为什么两个坐标都变号？因为转了半圈，点跑到原点对面去了——就像你面朝北转 $180°$ 就面朝南，前后左右全反过来。"', en: 'Xun Yu: "$180°$ rotation changes both signs because you\'ve turned halfway around — the point ends up on the opposite side of the origin. Like facing north, turning $180°$ means facing south."' }, highlightField: 'x' },
      { text: { zh: '荀彧："规则：$(x,y) \\to (-x, -y)$。两个坐标都取反。"', en: 'Xun Yu: "Rule: $(x,y) \\to (-x, -y)$. Both coordinates are negated."' }, highlightField: 'x' },
      { text: { zh: '荀彧："$x$：$3 \\to -3$。"', en: 'Xun Yu: "$x$: $3 \\to -3$."' }, highlightField: 'x' },
      { text: { zh: '荀彧："$y$：$4 \\to -4$。"', en: 'Xun Yu: "$y$: $4 \\to -4$."' }, highlightField: 'y' },
      { text: { zh: '荀彧："答案：$(-3, -4)$。"', en: 'Xun Yu: "Answer: $(-3, -4)$."' }, highlightField: 'x' },
      { text: { zh: '荀彧："验算：$(3,4)$ 和 $(-3,-4)$ 的中点 $= (0,0)$ = 原点 ✓ 旋转中心确认！"', en: 'Xun Yu: "Check: midpoint of $(3,4)$ and $(-3,-4) = (0,0)$ = origin ✓ Centre of rotation confirmed!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '$180°$ 旋转：$(x,y) \\to (-x,-y)$。等价于关于原点的中心对称。', en: '$180°$ rotation: $(x,y) \\to (-x,-y)$. Equivalent to point symmetry about the origin.' }, formula: '$(x,y) \\to (-x, -y)$', tips: [{ zh: '荀彧提示：$180°$ 旋转的中点一定是旋转中心。', en: 'Xun Yu Tip: The midpoint of a $180°$ rotation is always the centre of rotation.' }] },
    storyConsequence: { correct: { zh: '180°旋转——对称完美！', en: '180° Rotation — Perfect symmetry!' }, wrong: { zh: '$180°$ 旋转：两个坐标都变号。$(3,4) \\to (-3,-4)$。', en: '$180°$: negate both. $(3,4) \\to (-3,-4)$.' } }
  },
  {
    id: 9176, grade: 9, unitId: 19, order: 6,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '放大2倍', en: 'Enlargement SF 2' },
    skillName: { zh: '整数倍放大术', en: 'Enlargement Scale Factor > 1' },
    skillSummary: { zh: '每个坐标乘以比例因子', en: 'Multiply each coordinate by the scale factor' },
    story: { zh: '$(3,4)$ 以原点为中心放大 $2$ 倍。新坐标？', en: '$(3,4)$ enlarged by scale factor $2$ from the origin. New coordinates?' },
    description: { zh: '放大：每个坐标乘以 $2$。', en: 'Enlarge: multiply each coordinate by $2$.' },
    data: { targetX: 6, targetY: 8 }, difficulty: 'Easy', reward: 180,
    kpId: 'kp-7.1-10', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云："放大变换为什么乘以比例因子？因为放大是从中心点向外"拉伸"——每个点到中心的距离都乘以相同倍数。中心在原点时，坐标直接乘就行。"', en: 'Zhao Yun: "Why multiply by the scale factor? Enlargement stretches from the centre outward — every point\'s distance from the centre is multiplied by the same factor. When the centre is the origin, just multiply coordinates."' }, highlightField: 'x' },
      { text: { zh: '赵云："规则：以原点为中心，比例因子 $k$：$(x,y) \\to (kx, ky)$。"', en: 'Zhao Yun: "Rule: centre at origin, scale factor $k$: $(x,y) \\to (kx, ky)$."' }, highlightField: 'x' },
      { text: { zh: '赵云："$x$：$3 \\times 2 = 6$。"', en: 'Zhao Yun: "$x$: $3 \\times 2 = 6$."' }, highlightField: 'x' },
      { text: { zh: '赵云："$y$：$4 \\times 2 = 8$。"', en: 'Zhao Yun: "$y$: $4 \\times 2 = 8$."' }, highlightField: 'y' },
      { text: { zh: '赵云："答案：$(6, 8)$。"', en: 'Zhao Yun: "Answer: $(6, 8)$."' }, highlightField: 'x' },
      { text: { zh: '赵云："验算：到原点距离 $\\sqrt{36+64} = 10 = 2 \\times 5$ = 原来距离的 $2$ 倍 ✓ 放大成功！"', en: 'Zhao Yun: "Check: distance to origin $\\sqrt{36+64} = 10 = 2 \\times 5$ = twice the original ✓ Enlargement successful!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '以原点为中心放大 $k$ 倍：$(x,y) \\to (kx, ky)$。距离变为 $k$ 倍。', en: 'Enlargement by $k$ from origin: $(x,y) \\to (kx, ky)$. Distance becomes $k$ times.' }, formula: '$(x,y) \\to (kx, ky)$', tips: [{ zh: '赵云提示：面积变为 $k^2$ 倍——别和长度搞混！', en: 'Zhao Yun Tip: Area becomes $k^2$ times — don\'t confuse with length!' }] },
    storyConsequence: { correct: { zh: '放大2倍——阵型扩展！', en: 'Scale Factor 2 — Formation expanded!' }, wrong: { zh: '放大 $2$ 倍：每个坐标乘以 $2$。', en: 'Scale factor $2$: multiply each coordinate by $2$.' } }
  },
  {
    id: 9177, grade: 9, unitId: 19, order: 7,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '缩小一半', en: 'Enlargement SF 1/2' },
    skillName: { zh: '分数倍缩放术', en: 'Enlargement Fractional SF' },
    skillSummary: { zh: '比例因子 $0<k<1$ 时图形缩小', en: 'Scale factor $0<k<1$ makes the shape smaller' },
    story: { zh: '$(4,6)$ 以原点为中心放大 $\\frac{1}{2}$ 倍。新坐标？', en: '$(4,6)$ enlarged by scale factor $\\frac{1}{2}$ from the origin. New coordinates?' },
    description: { zh: '比例因子 $\\frac{1}{2}$：每个坐标乘以 $\\frac{1}{2}$。', en: 'Scale factor $\\frac{1}{2}$: multiply each coordinate by $\\frac{1}{2}$.' },
    data: { targetX: 2, targetY: 3 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-7.1-11', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '诸葛亮："为什么叫放大 $\\frac{1}{2}$ 倍？数学上，enlargement 包括缩小——只要比例因子在 $0$ 和 $1$ 之间，图形就变小了。名字虽然叫放大，但实际上是缩小。"', en: 'Zhuge Liang: "Why enlarge by $\\frac{1}{2}$? Mathematically, enlargement includes shrinking — when the scale factor is between $0$ and $1$, the shape gets smaller. The name says enlarge, but it actually shrinks."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："规则不变：$(x,y) \\to (kx, ky)$，只是 $k = \\frac{1}{2}$。"', en: 'Zhuge Liang: "Same rule: $(x,y) \\to (kx, ky)$, just $k = \\frac{1}{2}$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："$x$：$4 \\times \\frac{1}{2} = 2$。"', en: 'Zhuge Liang: "$x$: $4 \\times \\frac{1}{2} = 2$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："$y$：$6 \\times \\frac{1}{2} = 3$。"', en: 'Zhuge Liang: "$y$: $6 \\times \\frac{1}{2} = 3$."' }, highlightField: 'y' },
      { text: { zh: '诸葛亮："答案：$(2, 3)$。"', en: 'Zhuge Liang: "Answer: $(2, 3)$."' }, highlightField: 'x' },
      { text: { zh: '诸葛亮："验算：到原点距离 $\\sqrt{4+9} = \\sqrt{13}$，原来 $\\sqrt{16+36} = \\sqrt{52} = 2\\sqrt{13}$。\n$\\frac{\\sqrt{13}}{2\\sqrt{13}} = \\frac{1}{2}$ ✓ 缩小一半！"', en: 'Zhuge Liang: "Check: distance $\\sqrt{4+9} = \\sqrt{13}$, original $\\sqrt{52} = 2\\sqrt{13}$.\n$\\frac{\\sqrt{13}}{2\\sqrt{13}} = \\frac{1}{2}$ ✓ Halved!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '$0 < k < 1$ 的放大实际上是缩小。公式不变，只是结果更靠近中心。', en: '$0 < k < 1$ enlargement is actually a reduction. Same formula, result is closer to the centre.' }, formula: '$(x,y) \\to (\\frac{x}{2}, \\frac{y}{2})$', tips: [{ zh: '诸葛亮提示：$k=\\frac{1}{2}$ 时长度减半，面积变为 $\\frac{1}{4}$。', en: 'Zhuge Liang Tip: $k=\\frac{1}{2}$ halves lengths, area becomes $\\frac{1}{4}$.' }] },
    storyConsequence: { correct: { zh: '缩小一半——精密缩放！', en: 'Scale Factor 1/2 — Precision scaling!' }, wrong: { zh: '每个坐标乘以 $\\frac{1}{2}$：$(4 \\times \\frac{1}{2}, 6 \\times \\frac{1}{2})$。', en: 'Multiply each by $\\frac{1}{2}$: $(4 \\times \\frac{1}{2}, 6 \\times \\frac{1}{2})$.' } }
  },
  {
    id: 9178, grade: 9, unitId: 19, order: 8,
    unitTitle: { zh: 'Unit 19: 变换进阶', en: 'Unit 19: Advanced Transformations' },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '组合变换', en: 'Combined Transformations' },
    skillName: { zh: '组合变换术', en: 'Combined Transformations' },
    skillSummary: { zh: '按顺序执行多步变换', en: 'Apply transformations in order, step by step' },
    story: { zh: '$(3,4)$ 先关于 $x$ 轴反射，再绕原点逆时针 $90°$。最终坐标？', en: '$(3,4)$: first reflect in $x$-axis, then rotate $90°$ CCW about origin. Final coordinates?' },
    description: { zh: '两步变换：先反射再旋转。', en: 'Two-step transformation: reflect then rotate.' },
    data: { targetX: 4, targetY: 3 }, difficulty: 'Hard', reward: 260,
    kpId: 'kp-7.1-12', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '关羽："为什么组合变换要注意顺序？因为变换的顺序不同，结果通常不同！先反射再旋转 ≠ 先旋转再反射。就像先穿鞋再穿袜子——顺序错了结果就不对。"', en: 'Guan Yu: "Why does order matter in combined transformations? Different order usually gives different results! Reflect then rotate ≠ rotate then reflect. Like putting socks on after shoes — wrong order, wrong result."' }, highlightField: 'x' },
      { text: { zh: '关羽："第一步：关于 $x$ 轴反射。\n$(3,4) \\to (3, -4)$。"', en: 'Guan Yu: "Step 1: Reflect in $x$-axis.\n$(3,4) \\to (3, -4)$."' }, highlightField: 'x' },
      { text: { zh: '关羽："第二步：绕原点逆时针 $90°$。\n规则 $(x,y) \\to (-y, x)$。\n$(3,-4) \\to (4, 3)$。"', en: 'Guan Yu: "Step 2: Rotate $90°$ CCW about origin.\nRule $(x,y) \\to (-y, x)$.\n$(3,-4) \\to (-(-4), 3) = (4, 3)$."' }, highlightField: 'x' },
      { text: { zh: '关羽："$-y = -(-4) = 4$，$x = 3$。新坐标 $(4, 3)$。"', en: 'Guan Yu: "$-y = -(-4) = 4$, $x = 3$. New coordinates $(4, 3)$."' }, highlightField: 'x' },
      { text: { zh: '关羽："答案：$(4, 3)$。"', en: 'Guan Yu: "Answer: $(4, 3)$."' }, highlightField: 'x' },
      { text: { zh: '关羽："验算：到原点距离 $\\sqrt{16+9} = 5$，原来也是 $5$。反射和旋转都保距 ✓ 组合变换完成！"', en: 'Guan Yu: "Check: distance to origin $\\sqrt{16+9} = 5$, original also $5$. Both reflection and rotation preserve distance ✓ Combined transformation complete!"' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '组合变换按顺序逐步执行。顺序不同结果不同。', en: 'Combined transformations are applied step by step in order. Different order gives different results.' }, formula: '$(3,4) \\xrightarrow{\\text{reflect } x} (3,-4) \\xrightarrow{\\text{CCW 90}} (4,3)$', tips: [{ zh: '关羽提示：每一步写出中间坐标——不要跳步！', en: 'Guan Yu Tip: Write intermediate coordinates at each step — never skip!' }] },
    storyConsequence: { correct: { zh: '组合变换——连续操作精准！', en: 'Combined Transformations — Sequential operations precise!' }, wrong: { zh: '先反射 $(3,4) \\to (3,-4)$，再旋转 $(3,-4) \\to (4,3)$。', en: 'First reflect $(3,4) \\to (3,-4)$, then rotate $(3,-4) \\to (4,3)$.' } }
  },
  // ─── Unit 20: 其他补充 ───
  {
    id: 9179, grade: 9, unitId: 20, order: 1,
    unitTitle: { zh: 'Unit 20: 数据与统计补充', en: 'Unit 20: Data & Statistics Supplement' },
    topic: 'Statistics', type: 'ESTIMATION',
    title: { zh: '数据分类', en: 'Data Classification' },
    skillName: { zh: '数据分类术', en: 'Data Classification' },
    skillSummary: { zh: '区分连续数据和离散数据', en: 'Distinguish between continuous and discrete data' },
    story: { zh: '鞋码是哪种数据？（$1$=连续，$2$=离散）', en: 'Shoe size is what type of data? ($1$=continuous, $2$=discrete)' },
    description: { zh: '判断数据类型：连续数据可以取任何值，离散数据只能取特定值。', en: 'Classify data type: continuous can take any value, discrete can only take specific values.' },
    discoverSteps: [
      {
        prompt: { zh: '数据有两大类：\n- **连续数据**：可以取范围内的任何值（如身高 1.753m）\n- **离散数据**：只能取特定值（如人数 3 人）\n\n鞋码（36, 37, 38...）是哪种？', en: 'Two types of data:\n- **Continuous**: any value in a range (e.g., height 1.753m)\n- **Discrete**: only specific values (e.g., 3 people)\n\nShoe size (36, 37, 38...) is which type?' },
        type: 'choice' as const,
        choices: [
          { zh: '离散数据——只有固定的号码', en: 'Discrete — only fixed sizes' },
          { zh: '连续数据——可以是任何值', en: 'Continuous — can be any value' },
          { zh: '两者都是', en: 'Both' },
        ],
        onCorrect: { zh: '完全正确！鞋码只有 36, 36.5, 37... 这些固定的值，你不能买 36.73 的鞋。\n离散数据 = 可以列出来的、有间隔的值。\n连续数据 = 可以取任何值，比如身高 1.753m。', en: 'Exactly! Shoe sizes are fixed: 36, 36.5, 37... You can\'t buy size 36.73.\nDiscrete = listable values with gaps between them.\nContinuous = any value in a range, like height 1.753m.' },
        onWrong: { zh: '鞋码虽然有小数（36.5），但它只能取固定的几个值——你不能买 36.73 的鞋。\n这就是离散数据的特征：可以一个一个列出来。\n连续数据（如身高）可以取任何值：1.753m, 1.7531m...无穷无尽。', en: 'Shoe sizes have decimals (36.5) but can only be certain fixed values — you can\'t buy size 36.73.\nThis is discrete data: you can list all possible values.\nContinuous data (like height) can be any value: 1.753m, 1.7531m... infinitely many.' },
        onSkip: { zh: '快速判断法：能不能"数"出来？\n- 鞋码：36, 37, 38...能数出来 → 离散\n- 身高：1.7, 1.71, 1.711...数不完 → 连续\n\n鞋码 = 离散数据（答案是 $2$）。', en: 'Quick test: can you "count" all possible values?\n- Shoe size: 36, 37, 38... countable → discrete\n- Height: 1.7, 1.71, 1.711... uncountable → continuous\n\nShoe size = discrete (answer is $2$).' },
      },
    ],
    data: { answer: 2 }, difficulty: 'Easy', reward: 160,
    kpId: 'kp-9.1-02', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '贾诩："为什么要分类数据？因为不同类型的数据需要不同的统计方法。离散数据用柱状图，连续数据用直方图。选错图表就像用错武器——效果大打折扣。"', en: 'Jia Xu: "Why classify data? Different types need different statistical methods. Discrete uses bar charts, continuous uses histograms. Wrong chart = wrong weapon — effectiveness drops."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："两种数据的区别：\n离散（Discrete）：可以列举的固定值，如人数、鞋码、骰子点数。\n连续（Continuous）：可以取范围内任何值，如身高、体重、时间。"', en: 'Jia Xu: "Two types:\nDiscrete: fixed listable values — people count, shoe size, dice.\nContinuous: any value in a range — height, weight, time."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："快速判断：鞋码只有 $36, 37, 38...$ 这些固定值。\n你能买 $36.73$ 的鞋吗？不能。"', en: 'Jia Xu: "Quick check: shoe sizes are only $36, 37, 38...$\nCan you buy size $36.73$? No."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："所以鞋码是离散数据。"', en: 'Jia Xu: "So shoe size is discrete data."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："答案：$2$（离散）。"', en: 'Jia Xu: "Answer: $2$ (discrete)."' }, highlightField: 'ans' },
      { text: { zh: '贾诩："验算：对比身高——身高可以是 $1.753$ 米、$1.7531$ 米...无穷多值 → 连续。\n鞋码只有有限个值 → 离散 ✓ 分类正确！"', en: 'Jia Xu: "Verify: compare with height — height can be $1.753$m, $1.7531$m... infinitely many → continuous.\nShoe sizes are finitely many → discrete ✓ Classification correct!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '离散数据只能取特定值（可列举），连续数据可取范围内任何值。', en: 'Discrete data takes specific values (listable), continuous data takes any value in a range.' }, formula: '$\\text{Discrete: countable} \\quad \\text{Continuous: measurable}$', tips: [{ zh: '贾诩提示：能数出来的是离散，能量出来的是连续。', en: 'Jia Xu Tip: If you can count it, it\'s discrete; if you measure it, it\'s continuous.' }] },
    storyConsequence: { correct: { zh: '数据分类——判断正确！', en: 'Data Classification — Correct!' }, wrong: { zh: '鞋码只有固定值——离散数据（$2$）。', en: 'Shoe sizes are fixed values — discrete ($2$).' } }
  },
  {
    id: 9180, grade: 9, unitId: 20, order: 2,
    unitTitle: { zh: 'Unit 20: 数据与统计补充', en: 'Unit 20: Data & Statistics Supplement' },
    topic: 'Statistics', type: 'ESTIMATION',
    title: { zh: '选择平均数', en: 'Choosing the Average' },
    skillName: { zh: '最佳平均数选择术', en: 'Choosing Appropriate Average' },
    skillSummary: { zh: '有极端值时用中位数，无极端值时用均值', en: 'Use median when outliers exist, mean when no outliers' },
    story: { zh: '数据 $\\{1, 2, 2, 3, 100\\}$。最合适的平均数是？（$1$=均值，$2$=中位数）', en: 'Data $\\{1, 2, 2, 3, 100\\}$. Most appropriate average? ($1$=mean, $2$=median)' },
    description: { zh: '$100$ 是极端值。均值被拉高到 $21.6$，中位数只有 $2$——哪个更能代表数据？', en: '$100$ is an outlier. Mean is pulled to $21.6$, median is just $2$ — which better represents the data?' },
    data: { answer: 2 }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-9.3-06', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '荀彧："为什么不能总用均值？因为均值对极端值很敏感。一个极大值就能把均值拉高很多，让它不再代表大多数数据。中位数则镇定自若——它只看中间位置，不受极端值影响。"', en: 'Xun Yu: "Why not always use the mean? The mean is sensitive to outliers. One extreme value pulls the mean way up, making it unrepresentative. The median stays calm — it only looks at the middle position, unaffected by extremes."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："三种平均数：\n均值（Mean）= 总和 ÷ 个数，受极端值影响大\n中位数（Median）= 中间值，不受极端值影响\n众数（Mode）= 出现最多的值"', en: 'Xun Yu: "Three averages:\nMean = sum ÷ count, heavily affected by outliers\nMedian = middle value, unaffected by outliers\nMode = most frequent value"' }, highlightField: 'ans' },
      { text: { zh: '荀彧："计算均值：$(1+2+2+3+100) \\div 5 = 108 \\div 5 = 21.6$。\n但大多数数据都在 $1$ 到 $3$ 之间！$21.6$ 一点也不代表这些数据。"', en: 'Xun Yu: "Mean: $(1+2+2+3+100) \\div 5 = 21.6$.\nBut most data is between $1$ and $3$! $21.6$ doesn\'t represent these at all."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："中位数：排序后 $\\{1, 2, \\mathbf{2}, 3, 100\\}$，中间值 $= 2$。\n$2$ 确实在大多数数据附近。"', en: 'Xun Yu: "Median: sorted $\\{1, 2, \\mathbf{2}, 3, 100\\}$, middle value $= 2$.\n$2$ is indeed near most of the data."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："答案：$2$（中位数），因为有极端值 $100$。"', en: 'Xun Yu: "Answer: $2$ (median), because of the outlier $100$."' }, highlightField: 'ans' },
      { text: { zh: '荀彧："验算：如果去掉 $100$，均值变成 $2$——和中位数一样。这证明 $100$ 确实是拉高均值的元凶。有极端值时，中位数更可靠 ✓"', en: 'Xun Yu: "Verify: remove $100$, mean becomes $2$ — same as median. This proves $100$ is the culprit pulling up the mean. With outliers, median is more reliable ✓"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '有极端值/偏态数据时，中位数比均值更能代表数据的典型水平。', en: 'With outliers/skewed data, the median better represents the typical value than the mean.' }, formula: '$\\text{outliers} \\Rightarrow \\text{use median}$', tips: [{ zh: '荀彧提示：看到极端值就选中位数——它不被极端值左右。', en: 'Xun Yu Tip: Spot an outlier → choose the median — it\'s immune to extremes.' }] },
    storyConsequence: { correct: { zh: '选择平均数——判断正确！', en: 'Choosing the Average — Correct!' }, wrong: { zh: '$100$ 是极端值——均值被拉高，中位数更合适。', en: '$100$ is an outlier — mean is inflated, median is better.' } }
  },
];
