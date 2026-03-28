import type { Mission } from '../../types';

export const MISSIONS_Y7: Mission[] = [
  // --- Year 7 Unit 0: 桃园点兵·数论篇 (Number Foundations) ---
  {
    id: 698, grade: 7, unitId: 0, order: -2,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'FACTORS_LIST',
    title: { zh: '点兵编队', en: 'Troop Formation Count' },
    discoverSteps: [
      {
        prompt: { zh: '12 个士兵要排成整齐的方阵。\n你觉得可以排成几排？每排几人？\n\n试试看——有没有一种排法是每排 3 人？', en: '12 soldiers need to form neat rows.\nHow many rows could you make? How many per row?\n\nTry this — could you have 3 per row?' },
        type: 'choice',
        choices: [
          { zh: '可以！12 ÷ 3 = 4，排成 4 排', en: 'Yes! 12 ÷ 3 = 4, make 4 rows' },
          { zh: '不行，除不尽', en: 'No, it doesn\'t divide evenly' },
          { zh: '不确定', en: 'Not sure' },
        ],
        acceptPattern: '',
        onCorrect: { zh: '你发现了！12 ÷ 3 刚好整除，所以 3 是 12 的一个"因数"。\n能整除一个数的数，就叫这个数的因数。\n你刚才做的事情，就是在找因数。', en: 'You found it! 12 ÷ 3 divides exactly, so 3 is a "factor" of 12.\nA number that divides evenly into another is called a factor.\nWhat you just did? That\'s finding factors.' },
        onWrong: { zh: '试试算一下：12 ÷ 3 = ？如果结果是整数，就说明 3 人一排可以排整齐。\n答案是 4——所以 3 是 12 的"因数"。能整除的数就是因数。', en: 'Try calculating: 12 ÷ 3 = ? If it\'s a whole number, 3 per row works.\nThe answer is 4 — so 3 is a "factor" of 12. Numbers that divide evenly are factors.' },
        onSkip: { zh: '没关系，我来带你看。12 ÷ 3 = 4，刚好整除！\n所以 3 个人一排，排 4 排，正好 12 人。\n能被 12 整除的数（比如 3），就叫 12 的"因数"。', en: 'No worries, let me show you. 12 ÷ 3 = 4, divides exactly!\nSo 3 per row, 4 rows, exactly 12 soldiers.\nNumbers that divide evenly into 12 (like 3) are called "factors" of 12.' },
      },
      {
        prompt: { zh: '那 12 的因数一共有几个？\n提示：从 1 开始试，1, 2, 3, 4, 6, ...', en: 'How many factors does 12 have in total?\nHint: start from 1 and try each: 1, 2, 3, 4, 6, ...' },
        type: 'input',
        acceptPattern: '^6|六|six',
        onCorrect: { zh: '厉害！12 的因数是 1, 2, 3, 4, 6, 12——一共 6 个。\n你注意到了吗？因数总是成对出现的：1×12, 2×6, 3×4。\n接下来我们学习系统地找出所有因数的方法。', en: 'Impressive! Factors of 12 are 1, 2, 3, 4, 6, 12 — that\'s 6.\nNotice anything? Factors come in pairs: 1×12, 2×6, 3×4.\nNext, we\'ll learn a systematic way to find all factors.' },
        onWrong: { zh: '接近了！我们来数一数：\n$12 ÷ 1 = 12$ ✓ → 因数：1, 12\n$12 ÷ 2 = 6$ ✓ → 因数：2, 6\n$12 ÷ 3 = 4$ ✓ → 因数：3, 4\n一共 6 个！发现了吗——它们成对出现。', en: 'Close! Let\'s count:\n$12 ÷ 1 = 12$ ✓ → factors: 1, 12\n$12 ÷ 2 = 6$ ✓ → factors: 2, 6\n$12 ÷ 3 = 4$ ✓ → factors: 3, 4\nThat\'s 6! Notice — they come in pairs.' },
        onSkip: { zh: '没关系，因数就是这样找的：\n从 1 开始一个个试，能整除就是因数。\n$1, 2, 3, 4, 6, 12$ ——一共 6 个。\n秘诀：因数总是成对的（$1×12, 2×6, 3×4$），所以只需要试到一半就够了！', en: 'No problem. Here\'s how to find factors:\nStart from 1, try each — if it divides evenly, it\'s a factor.\n$1, 2, 3, 4, 6, 12$ — that\'s 6.\nTrick: factors come in pairs ($1×12, 2×6, 3×4$), so you only need to check up to halfway!' },
      },
    ],
    skillName: { zh: '因数列举术', en: 'Listing Factors' },
    skillSummary: { zh: '因数就是能整除一个数的数——把士兵分成几种等分方式', en: 'Factors are numbers that divide evenly — find all ways to split soldiers into equal groups' },
    story: { zh: '刘备刚招募了一批新兵，要想办法编队。{n} 个士兵可以分成几种等人数的队？2 人一队、3 人一队、4 人一队...把所有可能的分法都找出来！', en: 'Liu Bei just recruited soldiers and needs to form squads. {n} soldiers — how many ways to divide them into equal groups? 2 per squad, 3 per squad, 4 per squad... find all possible divisions!' },
    description: { zh: '这个数有几个因数？', en: 'How many factors does this number have?' },
    data: { n: 24, factors: [1, 2, 3, 4, 6, 8, 12, 24], answer: 8, generatorType: 'FACTORS_LIST_RANDOM' }, difficulty: 'Easy', reward: 35,
    kpId: 'kp-1.1-02', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '刘备：24 个新兵怎么分成人数相等的小队？\n\n"因数"就是能把 24 平均分开的数。比如 $24 \div 3 = 8$ 整除，说明 3 是因数。找出**所有**因数，就能知道所有可能的分法！', en: 'Liu Bei: How to divide 24 recruits into equal-sized teams?\n\nA "factor" is a number that divides 24 exactly. For example $24 \div 3 = 8$ exactly, so 3 is a factor. Find **all** factors to know every possible team size!' }, highlightField: 'ans' },
      { text: { zh: '刘备：系统找因数——用配对法\n因数成对出现：若 $a$ 是因数，则 $24 \div a$ 也是因数。\n从 $1$ 开始，逐一试除，直到两个因数相遇！', en: 'Liu Bei: Find factors systematically — use pairing\nFactors come in pairs: if $a$ is a factor, then $24 \div a$ is also a factor.\nStart from $1$, test each divisor until the two factors meet!' }, highlightField: 'ans' },
      { text: { zh: '刘备：枚举配对\n$1 \times 24 = 24$ ✓\n$2 \times 12 = 24$ ✓\n$3 \times 8 = 24$ ✓\n$4 \times 6 = 24$ ✓\n$5 \times ? = 24$：$24 \div 5$ 不整除 ✗', en: 'Liu Bei: List the pairs\n$1 \\times 24 = 24$ ✓\n$2 \\times 12 = 24$ ✓\n$3 \\times 8 = 24$ ✓\n$4 \\times 6 = 24$ ✓\n$5 \\times ? = 24$: $24 \div 5$ not exact ✗' }, highlightField: 'ans' },
      { text: { zh: '刘备：收集所有因数\n$\\{1, 2, 3, 4, 6, 8, 12, 24\\}$\n\n共 $8$ 个因数。', en: 'Liu Bei: Collect all factors\n$\\{1, 2, 3, 4, 6, 8, 12, 24\\}$\n\n$8$ factors in total.' }, highlightField: 'ans' },
      { text: { zh: '刘备：答案\n$24$ 共有 $8$ 个因数。\n\n可以分成 1, 2, 3, 4, 6, 8, 12, 或 24 人的小队！', en: 'Liu Bei: Answer\n$24$ has $8$ factors.\n\nTeams of 1, 2, 3, 4, 6, 8, 12, or 24 are all possible!' }, highlightField: 'ans' },
      { text: { zh: '刘备：验算——逐一确认\n$24 \div 1 = 24$ ✓, $24 \div 2 = 12$ ✓, $24 \div 3 = 8$ ✓, $24 \div 4 = 6$ ✓\n$24 \div 6 = 4$ ✓, $24 \div 8 = 3$ ✓, $24 \div 12 = 2$ ✓, $24 \div 24 = 1$ ✓', en: 'Liu Bei: Verify — confirm each one\n$24 \div 1 = 24$ ✓, $24 \div 2 = 12$ ✓, $24 \div 3 = 8$ ✓, $24 \div 4 = 6$ ✓\n$24 \div 6 = 4$ ✓, $24 \div 8 = 3$ ✓, $24 \div 12 = 2$ ✓, $24 \div 24 = 1$ ✓' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '因数是能整除一个数的数。因数成对出现，一对乘起来等于原数。', en: 'Factors divide a number evenly. They come in pairs whose product is the original number.' }, formula: { zh: '$n = a \\times b \\Rightarrow a, b \\text{ 都是 } n \\text{ 的因数}$', en: '$n = a \\times b \\Rightarrow a, b \\text{ are factors of } n$' }, tips: [{ zh: '刘备提示：编队方式越多，战术越灵活！', en: 'Liu Bei Tip: More ways to divide = more tactical flexibility!' }] },
    storyConsequence: { correct: { zh: '点兵编队——因数全部找齐！做得漂亮！', en: 'Troop Formation Count — Well done!' }, wrong: { zh: '因数漏了几个…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 699, grade: 7, unitId: 0, order: -1,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'PRIME',
    title: { zh: '选拔亲卫', en: 'Selecting Elite Guards' },
    skillName: { zh: '质数辨识术', en: 'Prime Recognition' },
    skillSummary: { zh: '质数只能被 1 和自己整除', en: 'Primes are only divisible by 1 and themselves' },
    story: { zh: '桃园结义后要选拔精锐亲卫。"质数战士"不能被拆分——只听命于天子和自己。判断一个数是不是质数！', en: 'After the oath, elite guards must be selected. "Prime warriors" cannot be split — they answer only to the emperor and themselves. Determine if a number is prime!' },
    description: { zh: '判断这个数是不是质数。', en: 'Determine if this number is prime.' },
    data: { n: 17, isPrime: true, generatorType: 'PRIME_RANDOM' }, difficulty: 'Easy', reward: 35,
    kpId: 'kp-1.1-01', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '诸葛亮：亲卫队为什么要"质数"人？\n\n质数只能被 1 和自己整除，不能被分成等大的小组——就像亲卫必须铁板一块，不能被分化！判断一个数是不是质数，要用**试除法**。', en: 'Zhuge Liang: Why does the elite guard need "prime" numbers?\n\nA prime is only divisible by 1 and itself — it cannot be split into equal groups. Like the elite guard being unbreakable! To test primality, use the trial division method.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：质数的定义\n- 只有两个因数：$1$ 和自身\n- 注意：$1$ **不是**质数（只有一个因数）\n- $2$ 是唯一的偶数质数！\n\n合数 = 有三个或以上因数', en: 'Zhuge Liang: Definition of prime\n- Has exactly two factors: $1$ and itself\n- Note: $1$ is NOT prime (only one factor)\n- $2$ is the only even prime!\n\nComposite = has three or more factors' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：试除法——检验 17\n只需试到 $\\sqrt{17} \\approx 4.1$，即测试 $2, 3$\n\n（若 $17$ 有因数 $> 4.1$，对应的另一个因数必 $< 4.1$，早已被找到）', en: 'Zhuge Liang: Trial division — testing 17\nOnly need to test up to $\\sqrt{17} \\approx 4.1$, i.e. test $2, 3$\n\n(If 17 had a factor $> 4.1$, its pair would be $< 4.1$ and already found)' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：逐一试除\n$17 \div 2 = 8.5$（不整除）\n$17 \div 3 = 5.67$（不整除）\n\n没有因数 → $17$ 是质数！', en: 'Zhuge Liang: Test each divisor\n$17 \div 2 = 8.5$ (not exact)\n$17 \div 3 = 5.67$ (not exact)\n\nNo factors found → $17$ is prime!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n$17$ 是**质数**。\n\n亲卫队 17 人，铁板一块，无法分化！', en: 'Zhuge Liang: Answer\n$17$ is prime.\n\nElite guard of 17 — unbreakable, cannot be divided!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$17$ 的因数只有 $1$ 和 $17$——确认是质数 ✓\n\n常见质数速记：$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$', en: 'Zhuge Liang: Verify\n$17$ has only two factors: $1$ and $17$ — confirmed prime ✓\n\nCommon primes to know: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '质数是只能被 1 和自己整除的数，是所有整数的"基本零件"。', en: 'Primes are numbers divisible only by 1 and themselves — the building blocks of all integers.' }, formula: { zh: '$\\text{质数 = 只被 1 和自己整除}$', en: '$\\text{Prime = only divisible by 1 and itself}$' }, tips: [{ zh: '诸葛亮提示：质数是万数之本，先识别它们，才能做因数分解。', en: 'Zhuge Liang Tip: Primes are the foundation — identify them first, then factorize.' }] },
    storyConsequence: { correct: { zh: '选拔亲卫——质数一个不漏！做得漂亮！', en: 'Selecting Elite Guards — Well done!' }, wrong: { zh: '混进了合数…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 700, grade: 7, unitId: 0, order: 0,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'FACTOR_TREE',
    title: { zh: '拆解兵力', en: 'Breaking Down Forces' },
    skillName: { zh: '质因数分解术', en: 'Prime Factorization' },
    skillSummary: { zh: '把一个数拆成质数的乘积', en: 'Break a number into a product of primes' },
    story: { zh: '桃园结义后要编制军队。一批新兵要拆成最小的战斗单元——每个单元只有"质数"人。', en: 'After the oath, the army needs organizing. New recruits must be split into smallest units — each with a prime number of soldiers.' },
    description: { zh: '把这个数拆成质因数，数一数共几个。', en: 'Factorize this number into primes and count them.' },
    data: { n: 24, primeCount: 4, generatorType: 'FACTOR_TREE_RANDOM' }, difficulty: 'Easy', reward: 40,
    kpId: 'kp-1.1-08', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '诸葛亮：质因数分解——拆成最小战斗单元\n\n质数是不可再分的原子单位。任何合数都能被拆成质数的乘积——就像把 24 名新兵拆成最小战斗小组，每组都不可再分！', en: 'Zhuge Liang: Prime factorisation — break down to smallest units\n\nPrimes are indivisible atomic units. Any composite can be broken into a product of primes — like splitting 24 recruits into the smallest possible unbreakable squads!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：因数树法\n从最小质数 $2$ 开始，能整除就拆开，直到所有末端都是质数。\n$$24 \to 2 \times 12 \to 2 \times 2 \times 6 \to 2 \times 2 \times 2 \times 3$$', en: 'Zhuge Liang: Factor tree method\nStart from the smallest prime $2$; if it divides evenly, split it; repeat until all end nodes are prime.\n$$24 \\to 2 \\times 12 \\to 2 \\times 2 \\times 6 \\to 2 \\times 2 \\times 2 \\times 3$$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第一步——从 2 开始\n$24 \div 2 = 12$（整除！）\n记下 $2$，继续对 $12$ 分解。', en: 'Zhuge Liang: Step 1 — start with 2\n$24 \div 2 = 12$ (exact!)\nWrite down $2$, continue factorising $12$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：继续拆\n$12 \div 2 = 6$ → 记下 $2$\n$6 \div 2 = 3$ → 记下 $2$\n$3$ 是质数 → 停！', en: 'Zhuge Liang: Continue splitting\n$12 \div 2 = 6$ → write $2$\n$6 \div 2 = 3$ → write $2$\n$3$ is prime → stop!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：结果\n$$24 = 2 \times 2 \times 2 \times 3 = 2^3 \times 3$$\n共 $4$ 个质因数（含重复）。', en: 'Zhuge Liang: Result\n$$24 = 2 \\times 2 \\times 2 \\times 3 = 2^3 \\times 3$$\n$4$ prime factors in total (counting repeats).' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$$2^3 \times 3 = 8 \times 3 = 24 \\checkmark$$\n\n乘回来还是 24——分解正确！', en: 'Zhuge Liang: Verify\n$$2^3 \\times 3 = 8 \\times 3 = 24 \\checkmark$$\n\nMultiply back and get 24 — factorisation correct!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '任何大于 1 的整数都能唯一地分解为质数的乘积。', en: 'Every integer greater than 1 can be uniquely expressed as a product of primes.' }, formula: { zh: '$\\text{因数树：从上往下拆到全是质数}$', en: '$\\text{Factor tree: split top-down until all primes}$' }, tips: [{ zh: '诸葛亮提示：知己知彼，先把自己的兵力拆解清楚。', en: 'Zhuge Liang Tip: Know yourself — first break down your own forces clearly.' }] },
    storyConsequence: { correct: { zh: '拆解兵力——因数树完美拆解！做得漂亮！', en: 'Breaking Down Forces — Well done!' }, wrong: { zh: '分解不到底…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 701, grade: 7, unitId: 0, order: 1,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'HCF',
    title: { zh: '整编队伍', en: 'Organizing Troops' },
    skillName: { zh: '公因数术', en: 'Common Factor' },
    skillSummary: { zh: '最大公因数(HCF)就是两个数共有的最大因数', en: 'HCF: prime factorize, then take common primes to lowest power' },
    story: { zh: '桃园结义后，刘关张三兄弟开始整编队伍。两营士兵人数不同，要分成人数相同的小队一起操练——每队最多能有几个人？', en: 'After the oath, the brothers organize troops. Two camps with different numbers must split into equal squads for training — what\'s the largest squad size?' },
    description: { zh: '求最大公因数 (HCF)。', en: 'Find the Highest Common Factor (HCF).' },
    data: { numbers: [24, 36], generatorType: 'HCF_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-1.1-08', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '刘备：最大公因数（HCF）——找最大的共同分法\n\n两营分别有 24 和 36 人，要分成人数**相同**的小队。最多能每队几人？最大公因数就是最大的"共同因数"！', en: 'Liu Bei: HCF — find the largest common divisor\n\nTwo battalions: 24 and 36 soldiers, to be split into equal teams. What\'s the maximum team size? HCF is the largest number that divides both!' }, highlightField: 'ans' },
      { text: { zh: '刘备："先对 24 做质因数分解：$24 = 2^3 \times 3$"', en: 'Liu Bei: "First factorise 24: $24 = 2^3 \\times 3$"' }, highlightField: 'ans' },
      { text: { zh: '刘备："再对 36 做质因数分解：$36 = 2^2 \times 3^2$"', en: 'Liu Bei: "Then factorise 36: $36 = 2^2 \\times 3^2$"' }, highlightField: 'ans' },
      { text: { zh: '刘备："找共有的质因数，取较小的次幂，乘起来：$2^2 \times 3 = 12$"\n\n$2$ 的较小次幂：$\\min(3, 2) = 2$，$3$ 的较小次幂：$\\min(1, 2) = 1$', en: 'Liu Bei: "Find shared primes, take the smaller power, multiply: $2^2 \\times 3 = 12$"\n\n$2$: smaller power $\\min(3,2) = 2$; $3$: smaller power $\\min(1,2) = 1$' }, highlightField: 'ans' },
      { text: { zh: '刘备："所以 HCF(24, 36) = 12！每队 12 人，整编完毕！"', en: 'Liu Bei: "So HCF(24, 36) = 12! 12 soldiers per team — integration complete!"' }, highlightField: 'ans' },
      { text: { zh: '刘备：验算\n$24 \div 12 = 2$ ✓，$36 \div 12 = 3$ ✓\n有没有更大的公因数？$12 \times 2 = 24 > 12$ 但不整除 36 ✓\n\nHCF = 12 确认！', en: 'Liu Bei: Verify\n$24 \div 12 = 2$ ✓, $36 \div 12 = 3$ ✓\nIs there a larger common factor? $12 \times 2 = 24$ does not divide 36 ✓\n\nHCF = 12 confirmed!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'HCF 是两个数共有质因数（每个取次幂小的那个）的乘积。', en: 'HCF is the product of common prime factors, each taken to the lowest power.' }, formula: { zh: '$\\text{HCF = 短除法左边全乘}$', en: '$\\text{HCF = multiply all left-side divisors}$' }, tips: [{ zh: '刘备提示：队伍整齐，方能出征。', en: 'Liu Bei Tip: Well-organized troops are ready to march.' }] },
    storyConsequence: { correct: { zh: '整编队伍——最大公因数精准！做得漂亮！', en: 'Organizing Troops — Well done!' }, wrong: { zh: '公因数没找到最大的…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 702, grade: 7, unitId: 0, order: 2,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'LCM',
    title: { zh: '巡营排班', en: 'Patrol Schedule' },
    skillName: { zh: '公倍数术', en: 'Common Multiple' },
    skillSummary: { zh: 'LCM：分解质因数，每个质因数取大的那个，乘起来', en: 'LCM: prime factorize, then take all primes to highest power' },
    story: { zh: '甲将军每隔一段时间巡营一次，乙将军也是。上次同日巡营后，下一次两人再次同日是第几天？', en: 'General A patrols at one interval, General B at another. After their last shared patrol day, when is the next time both patrol on the same day?' },
    description: { zh: '求最小公倍数 (LCM)。', en: 'Find the Least Common Multiple (LCM).' },
    data: { numbers: [6, 8], generatorType: 'LCM_RANDOM' }, difficulty: 'Easy', reward: 55,
    kpId: 'kp-1.1-09', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '关羽：最小公倍数（LCM）——找最早重合的时刻\n\n我每 6 天巡营，张飞每 8 天。什么时候同时巡营？最小公倍数就是两个数的"最小共同倍数"！', en: 'Guan Yu: LCM — find the earliest they coincide\n\nI patrol every 6 days, Zhang Fei every 8. When do we patrol together? LCM is the smallest number that is a multiple of both!' }, highlightField: 'ans' },
      { text: { zh: '关羽："先对 6 做质因数分解：$6 = 2 \times 3$"', en: 'Guan Yu: "Factorise 6: $6 = 2 \\times 3$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："再对 8 做质因数分解：$8 = 2^3$"', en: 'Guan Yu: "Factorise 8: $8 = 2^3$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："每个质因数取大的那个，乘起来：$2^3 \times 3 = 24$"\n\n$2$ 的较大次幂：$\\max(1, 3) = 3$，$3$ 的较大次幂：$\\max(1, 0) = 1$', en: 'Guan Yu: "For each prime, take the larger power, multiply: $2^3 \\times 3 = 24$"\n\n$2$: larger power $\\max(1,3) = 3$; $3$: larger power $\\max(1,0) = 1$' }, highlightField: 'ans' },
      { text: { zh: '关羽："所以 LCM(6, 8) = 24！每 24 天我们同时巡营！"', en: 'Guan Yu: "So LCM(6, 8) = 24! We patrol together every 24 days!"' }, highlightField: 'ans' },
      { text: { zh: '关羽：验算\n$24 \div 6 = 4$ ✓（6 的倍数），$24 \div 8 = 3$ ✓（8 的倍数）\n有没有更小的？$12 \div 8 = 1.5$ ✗ → $24$ 确实是最小公倍数 ✓', en: 'Guan Yu: Verify\n$24 \div 6 = 4$ ✓ (multiple of 6), $24 \div 8 = 3$ ✓ (multiple of 8)\nSmaller? $12 \div 8 = 1.5$ ✗ → $24$ is indeed the LCM ✓' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'LCM 是所有质因数（每个取次幂大的那个）的乘积。', en: 'LCM is the product of all prime factors, each taken to the highest power.' }, formula: { zh: '$\\text{LCM = 左边×底部全乘}$', en: '$\\text{LCM = multiply left side × bottom}$' }, tips: [{ zh: '关羽提示：排班有序，方能守备森严。', en: 'Guan Yu Tip: Orderly schedules make strong defenses.' }] },
    storyConsequence: { correct: { zh: '巡营排班——最小公倍数正确！做得漂亮！', en: 'Patrol Schedule — Well done!' }, wrong: { zh: '公倍数算岔了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 703, grade: 7, unitId: 0, order: 3,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'HCF',
    title: { zh: '平分军粮', en: 'Dividing Grain Equally' },
    skillName: { zh: '因数分解术', en: 'Factorization' },
    skillSummary: { zh: '用 HCF 解决实际均分问题', en: 'Use HCF to solve real equal-sharing problems' },
    story: { zh: '桃园起义前，需要把军粮和兵器分给各村。每村拿到的粮食数量要完全相同，兵器数量也要完全相同，且不能有剩余。最多能分给几个村？', en: 'Before the uprising, grain and weapons must be distributed to villages. Each village gets exactly the same amount of grain and weapons, with nothing left over. What is the maximum number of villages?' },
    description: { zh: '求最大公因数 (HCF)。', en: 'Find the Highest Common Factor (HCF).' },
    data: { numbers: [48, 60], generatorType: 'HCF_RANDOM' }, difficulty: 'Medium', reward: 65,
    kpId: 'kp-1.1-08', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '张飞：最大公因数再练！\n\n有 48 袋粮和 60 把刀，要**平均**分给每个村（每村数量相同）。最多能分给几个村？答案就是 48 和 60 的最大公因数（HCF）！', en: 'Zhang Fei: HCF practice again!\n\n48 grain bags and 60 swords, to be distributed equally to each village. Maximum number of villages? That\'s the HCF of 48 and 60!' }, highlightField: 'ans' },
      { text: { zh: '张飞："$48 = 2^4 \times 3$"', en: 'Zhang Fei: "$48 = 2^4 \\times 3$"' }, highlightField: 'ans' },
      { text: { zh: '张飞："$60 = 2^2 \times 3 \times 5$"', en: 'Zhang Fei: "$60 = 2^2 \\times 3 \\times 5$"' }, highlightField: 'ans' },
      { text: { zh: '张飞："公共质因数：2 和 3。取最低次幂：$2^2 \times 3 = 12$"\n\n（$5$ 只出现在 60 的分解中，不是公因数）', en: 'Zhang Fei: "Shared primes: 2 and 3. Take lower powers: $2^2 \\times 3 = 12$"\n\n($5$ only appears in 60\'s factorisation, so not a shared prime)' }, highlightField: 'ans' },
      { text: { zh: '张飞："HCF(48, 60) = 12！分给 12 个村，每村 4 袋粮 5 把刀！"', en: 'Zhang Fei: "HCF(48, 60) = 12! Distribute to 12 villages, each gets 4 bags and 5 swords!"' }, highlightField: 'ans' },
      { text: { zh: '张飞：验算\n$48 \div 12 = 4$ ✓，$60 \div 12 = 5$ ✓\n有没有比 12 更大的公因数？$24$：$60 \div 24 = 2.5$ ✗\n\nHCF = 12 确认！', en: 'Zhang Fei: Verify\n$48 \div 12 = 4$ ✓, $60 \div 12 = 5$ ✓\nIs there a larger common factor? Try $24$: $60 \div 24 = 2.5$ ✗\n\nHCF = 12 confirmed!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: 'HCF 用于解决"平均分配且无剩余"的问题。', en: 'HCF solves "equal distribution with no remainder" problems.' }, formula: { zh: '$\\text{HCF} = \\text{最大均分数}$', en: '$\\text{HCF} = \\text{largest equal share}$' }, tips: [{ zh: '张飞提示：粮草不均，军心不稳！', en: 'Zhang Fei Tip: Unequal rations cause unrest!' }] },
    storyConsequence: { correct: { zh: '平分军粮——最大公因数精准！做得漂亮！', en: 'Dividing Grain Equally — Well done!' }, wrong: { zh: '公因数没找到最大的…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 0A: 行军算账·正负数篇 ---
  {
    id: 704, grade: 7, unitId: 0, order: 4,
    unitTitle: { zh: "Unit 0A: 行军算账·正负数篇", en: "Unit 0A: March Accounting — Integers" },
    topic: 'Algebra', type: 'INTEGER_ADD',
    title: { zh: '粮草盈亏', en: 'Grain Surplus & Loss' },
    skillName: { zh: '正负加减术', en: 'Integer Addition' },
    skillSummary: { zh: '正数+负数：绝对值大的决定符号', en: 'Positive + negative: the larger absolute value determines the sign' },
    story: { zh: '行军途中，粮草有增有减。正数代表补给，负数代表消耗。', en: 'On the march, supplies rise and fall. Positive means resupply, negative means consumption.' },
    description: { zh: '计算粮草变化。', en: 'Calculate the supply change.' },
    data: { a: 50, b: -30, op: '+', answer: 20, generatorType: 'INTEGER_ADD_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.6-01', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '诸葛亮：正加负数——粮仓盈亏问题\n\n补给进来是正，消耗出去是负。$50 + (-30)$ 就是"进 50 袋，出 30 袋"。加一个负数，等于减去它的绝对值！', en: 'Zhuge Liang: Positive plus negative — warehouse balance\n\nSupply coming in is positive, consumption is negative. $50 + (-30)$ means "50 bags in, 30 bags out". Adding a negative equals subtracting its absolute value!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：规则\n$$a + (-b) = a - b$$\n\n异号相加 = 绝对值相减，符号跟绝对值大的那个！', en: 'Zhuge Liang: Rule\n$$a + (-b) = a - b$$\n\nAdding different signs = subtract absolute values; sign follows the larger absolute value!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n$$50 + (-30)$$\n\n正数 $50$，负数 $-30$——异号！', en: 'Zhuge Liang: Read the problem\n$$50 + (-30)$$\n\nPositive $50$, negative $-30$ — different signs!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：转换——加负数变减法\n$$50 + (-30) = 50 - 30$$', en: 'Zhuge Liang: Convert — adding negative becomes subtraction\n$$50 + (-30) = 50 - 30$$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：计算\n$$50 - 30 = 20$$\n\n粮仓还剩 $20$ 袋！', en: 'Zhuge Liang: Calculate\n$$50 - 30 = 20$$\n\n$20$ grain bags remaining!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$20 + 30 = 50$ ✓（把消耗加回去还原）\n\n粮草盈余 $20$ 袋，后勤无忧！', en: 'Zhuge Liang: Verify\n$20 + 30 = 50$ ✓ (add consumption back to restore original)\n\n$20$ bags surplus — logistics secure!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '加一个负数就是减去它；结果的正负取决于谁的数字更大。', en: 'Adding a negative = subtracting it; the sign depends on which number is larger.' }, formula: '$a + (-b) = a - b$', tips: [{ zh: '诸葛亮提示：知彼知己，粮草先行。', en: 'Zhuge Liang Tip: Know your supplies before you march.' }] },
    storyConsequence: { correct: { zh: '粮草盈亏——正负运算无误！做得漂亮！', en: 'Grain Surplus & Loss — Well done!' }, wrong: { zh: '正负号搞混了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 705, grade: 7, unitId: 0, order: 5,
    unitTitle: { zh: "Unit 0A: 行军算账·正负数篇", en: "Unit 0A: March Accounting — Integers" },
    topic: 'Algebra', type: 'INTEGER_ADD',
    title: { zh: '连续损失', en: 'Consecutive Losses' },
    skillName: { zh: '负数相加术', en: 'Adding Negatives' },
    skillSummary: { zh: '两个负数相加：绝对值相加，结果为负', en: 'Adding two negatives: add absolute values, result is negative' },
    story: { zh: '连续两场败仗，士兵不断减员。负数加负数，损失在累积。', en: 'Two consecutive defeats. Negative plus negative — losses accumulate.' },
    description: { zh: '计算总损失。', en: 'Calculate total loss.' },
    data: { a: -20, b: -15, op: '+', answer: -35, generatorType: 'INTEGER_ADD_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-1.6-01', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '曹操：双重损失——两个负数相加\n\n先损 20 人（$-20$），又损 15 人（$-15$）。两次都是减少——负加负，越来越少！两个负数相加，结果更负！', en: 'Cao Cao: Double loss — adding two negatives\n\nFirst lost 20 ($-20$), then 15 more ($-15$). Both are reductions — negative plus negative means even more negative!' }, highlightField: 'ans' },
      { text: { zh: '曹操：规则\n$$(-a) + (-b) = -(a + b)$$\n\n同号相加：绝对值相加，符号不变（都是负的）。', en: 'Cao Cao: Rule\n$$(-a) + (-b) = -(a + b)$$\n\nSame signs added: add the absolute values, keep the sign (both negative).' }, highlightField: 'ans' },
      { text: { zh: '曹操：读取数据\n$$(-20) + (-15)$$\n\n两个都是负数——同号！', en: 'Cao Cao: Read the problem\n$$(-20) + (-15)$$\n\nBoth negative — same signs!' }, highlightField: 'ans' },
      { text: { zh: '曹操：同号相加\n绝对值相加：$20 + 15 = 35$\n\n结果保持负号：$-(35) = -35$', en: 'Cao Cao: Same signs — add absolute values\nAbsolute values: $20 + 15 = 35$\n\nKeep the negative sign: $-(35) = -35$' }, highlightField: 'ans' },
      { text: { zh: '曹操：答案\n$$(-20) + (-15) = -35$$\n\n共损失 $35$ 人，必须紧急补充兵力！', en: 'Cao Cao: Answer\n$$(-20) + (-15) = -35$$\n\nTotal loss: $35$ — must urgently reinforce!' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n$-35 + 15 = -20$ ✓（倒推：减少的补回 15，还是原来那次的损失）\n\n本相已知己知彼，厉兵秣马！', en: 'Cao Cao: Verify\n$-35 + 15 = -20$ ✓ (reverse: add back $15$ to get first loss)\n\nI know both sides — time to replenish and prepare!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '负数加负数，绝对值相加，符号取负。', en: 'Negative plus negative: add absolute values, keep negative sign.' }, formula: '$(-a) + (-b) = -(a+b)$', tips: [{ zh: '曹操提示：胜败乃兵家常事，关键是算清损失。', en: 'Cao Cao Tip: Victory and defeat are normal — the key is counting your losses.' }] },
    storyConsequence: { correct: { zh: '连续损失——正负运算无误！做得漂亮！', en: 'Consecutive Losses — Well done!' }, wrong: { zh: '正负号搞混了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 706, grade: 7, unitId: 0, order: 6,
    unitTitle: { zh: "Unit 0A: 行军算账·正负数篇", en: "Unit 0A: March Accounting — Integers" },
    topic: 'Algebra', type: 'INTEGER_ADD',
    title: { zh: '攻守得失', en: 'Gains and Losses' },
    skillName: { zh: '混合运算术', en: 'Mixed Operations' },
    skillSummary: { zh: '正负数混合加减，注意符号', en: 'Mixed positive/negative operations — watch the signs' },
    story: { zh: '一场战斗有得有失。先算总账，看看净变化是正还是负。', en: 'Every battle has gains and losses. Calculate the net change.' },
    description: { zh: '计算净变化。', en: 'Calculate the net change.' },
    data: { a: 40, b: 60, op: '-', answer: -20, generatorType: 'INTEGER_ADD_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-1.6-02', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '关羽：得少失多——结果变负！\n\n战后 40 人投诚（$+40$），60 人离去（$-60$）。得少失多，净结果是负的——损失比收获大！$40 - 60 < 0$。', en: 'Guan Yu: Gained less than lost — result goes negative!\n\n40 joined ($+40$), 60 left ($-60$). Lost more than gained — net result is negative! $40 - 60 < 0$.' }, highlightField: 'ans' },
      { text: { zh: '关羽：规则——减去更大的数\n$$40 - 60 = -(60 - 40)$$\n\n大减小得正，小减大得负！', en: 'Guan Yu: Rule — subtracting a larger number\n$$40 - 60 = -(60 - 40)$$\n\nLarger minus smaller is positive; smaller minus larger is negative!' }, highlightField: 'ans' },
      { text: { zh: '关羽：读取数据\n$$40 - 60$$\n\n$40 < 60$，所以 $40 - 60$ 是负数。', en: 'Guan Yu: Read the problem\n$$40 - 60$$\n\n$40 < 60$, so $40 - 60$ is negative.' }, highlightField: 'ans' },
      { text: { zh: '关羽：计算绝对值的差\n$$60 - 40 = 20$$\n\n加上负号：$40 - 60 = -20$', en: 'Guan Yu: Calculate the difference of absolute values\n$$60 - 40 = 20$$\n\nAdd the negative sign: $40 - 60 = -20$' }, highlightField: 'ans' },
      { text: { zh: '关羽：答案\n$$40 - 60 = -20$$\n\n净减少 $20$ 人——要赶紧征兵！', en: 'Guan Yu: Answer\n$$40 - 60 = -20$$\n\nNet decrease of $20$ — must recruit urgently!' }, highlightField: 'ans' },
      { text: { zh: '关羽：验算\n$-20 + 60 = 40$ ✓（补充 60 人后变回初始的 40 人投诚）\n\n净损 $20$ 人确认！', en: 'Guan Yu: Verify\n$-20 + 60 = 40$ ✓ (add 60 back to restore the initial 40 gained)\n\nNet loss of $20$ confirmed!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '减去比自己大的数，结果为负。', en: 'Subtracting more than you have gives a negative.' }, formula: '$a - b = -(b - a)$ when $b > a$', tips: [{ zh: '关羽提示：胜败之间，一算便知。', en: 'Guan Yu Tip: Between victory and defeat, the numbers tell all.' }] },
    storyConsequence: { correct: { zh: '攻守得失——正负运算无误！做得漂亮！', en: 'Gains and Losses — Well done!' }, wrong: { zh: '正负号搞混了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 0A 续: 整数乘除 ---
  {
    id: 693, grade: 7, unitId: 0, order: 6.5,
    unitTitle: { zh: "Unit 0A: 行军算账·正负数篇", en: "Unit 0A: March Accounting — Integers" },
    topic: 'Algebra', type: 'INTEGER_MUL',
    title: { zh: '敌退我进', en: 'Enemy Retreats, We Advance' },
    skillName: { zh: '正负数乘除术', en: 'Integer Multiply/Divide' },
    skillSummary: { zh: '同号得正，异号得负——先定符号，再算数值', en: 'Same signs → positive, different signs → negative' },
    story: { zh: '张飞在追击中发现规律：敌人每天位移 {a} 里，连续 {b} 天。总位移是多少？注意正负号！', en: 'Zhang Fei spots a pattern: the enemy moves {a} li per day for {b} days. What is the total displacement? Watch the signs!' },
    description: { zh: '计算正负数的乘法或除法。', en: 'Calculate with negative multiplication or division.' },
    data: { a: -5, b: 3, answer: -15, op: '×', mode: 'mul', generatorType: 'INTEGER_MUL_RANDOM' }, difficulty: 'Medium', reward: 50,
    kpId: 'kp-1.6-03', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '张飞：为什么负数乘正数还是负的？\n\n敌军每天后退 $5$ 里（$-5$），连续后退 $3$ 天——他们一共在负方向移动了 $15$ 里。三次负方向就是更负！口诀：**异号得负，同号得正**。', en: 'Zhang Fei: Why does negative times positive stay negative?\n\nThe enemy retreats 5 li per day ($-5$) for 3 days — they moved 15 li in the negative direction. Three negatives = more negative! Rule: **different signs → negative, same signs → positive**.' }, highlightField: 'ans' },
      { text: { zh: '张飞：符号规则一览\n$(+) \\times (+) = +$\n$(+) \\times (-) = -$\n$(-) \\times (+) = -$\n$(-) \\times (-) = +$\n\n记住：不同号→负，相同号→正！', en: 'Zhang Fei: Sign rules summary\n$(+) \\times (+) = +$\n$(+) \\times (-) = -$\n$(-) \\times (+) = -$\n$(-) \\times (-) = +$\n\nRemember: different signs → negative, same signs → positive!' }, highlightField: 'ans' },
      { text: { zh: '张飞：读题\n$$-5 \\times 3$$\n\n一个负数（$-5$），一个正数（$3$）——异号！', en: 'Zhang Fei: Read the problem\n$$-5 \\times 3$$\n\nOne negative ($-5$), one positive ($3$) — different signs!' }, highlightField: 'ans' },
      { text: { zh: '张飞：第一步——定符号\n异号 → 结果为**负**\n\n先知道答案是负数。', en: 'Zhang Fei: Step 1 — determine the sign\nDifferent signs → result is **negative**\n\nWe know the answer will be negative.' }, highlightField: 'ans' },
      { text: { zh: '张飞：第二步——算数值\n$$5 \\times 3 = 15$$\n\n加上符号：$-5 \\times 3 = -15$', en: 'Zhang Fei: Step 2 — calculate the magnitude\n$$5 \\times 3 = 15$$\n\nAdd the sign: $-5 \\times 3 = -15$' }, highlightField: 'ans' },
      { text: { zh: '张飞：验算\n$$(-15) \\div 3 = -5 \\checkmark$$\n\n负数除以正数还是负数——验算通过！', en: 'Zhang Fei: Verify\n$$(-15) \\div 3 = -5 \\checkmark$$\n\nNegative divided by positive stays negative — verified!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '同号相乘得正，异号相乘得负。除法规则相同。', en: 'Same signs multiply to positive, different signs to negative. Same rule for division.' }, formula: '$(-a) \\times (-b) = ab,\\quad (-a) \\times b = -(ab)$', tips: [{ zh: '张飞提示：负负得正——敌人的敌人就是朋友！', en: 'Zhang Fei Tip: Neg × Neg = Pos — the enemy of my enemy is my friend!' }] },
    storyConsequence: { correct: { zh: '敌退我进——乘除精准！做得漂亮！', en: 'Enemy Retreats, We Advance — Well done!' }, wrong: { zh: '符号判断有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 0B: 军粮分配·分数篇 ---
  {
    id: 697, grade: 7, unitId: 0, order: 6.8,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'FRAC_ADD',
    title: { zh: '分饼入门', en: 'Sharing the Pie' },
    skillName: { zh: '分数概念术', en: 'Understanding Fractions' },
    skillSummary: { zh: '分数 = 把整体切成等份后取几份', en: 'Fraction = equal parts of a whole, take some' },
    discoverSteps: [
      {
        prompt: { zh: '一块饼切成 4 等份。你吃了 1 份。\n你吃了整块饼的多少？', en: 'A pie is cut into 4 equal pieces. You eat 1 piece.\nHow much of the whole pie did you eat?' },
        type: 'choice',
        choices: [
          { zh: '四分之一（$\\frac{1}{4}$）', en: 'One quarter ($\\frac{1}{4}$)' },
          { zh: '一半', en: 'A half' },
          { zh: '不知道怎么表示', en: 'Not sure how to write it' },
        ],
        acceptPattern: '',
        onCorrect: { zh: '对！切成 4 份取 1 份 = $\\frac{1}{4}$。\n分数就是这么来的：下面的数（分母）= 切了几份，上面的数（分子）= 取了几份。', en: 'Right! 4 pieces, take 1 = $\\frac{1}{4}$.\nThat\'s where fractions come from: bottom number (denominator) = how many pieces, top (numerator) = how many you take.' },
        onWrong: { zh: '想象一下：一整块饼切成 4 块，你只吃了其中 1 块。\n写成分数就是 $\\frac{1}{4}$——"4 份里的 1 份"。\n下面的 4 = 总共几份，上面的 1 = 你拿了几份。', en: 'Picture this: a whole pie cut into 4 pieces, you eat just 1.\nAs a fraction: $\\frac{1}{4}$ — "1 out of 4 pieces".\nBottom 4 = total pieces, top 1 = pieces you took.' },
        onSkip: { zh: '没关系！分数其实就是"几份里取几份"。\n$\\frac{1}{4}$ 的意思是：切成 4 份，取了 1 份。\n下面的数叫分母（总份数），上面的叫分子（取的份数）。', en: 'No worries! A fraction just means "how many pieces out of how many".\n$\\frac{1}{4}$ means: cut into 4, took 1.\nBottom = denominator (total), top = numerator (taken).' },
      },
      {
        prompt: { zh: '你吃了 $\\frac{1}{4}$，你的朋友也吃了 $\\frac{1}{4}$。\n你们一共吃了多少？', en: 'You ate $\\frac{1}{4}$, your friend also ate $\\frac{1}{4}$.\nHow much did you eat together?' },
        type: 'input',
        acceptPattern: '2\\/4|1\\/2|0\\.5|½|二分之一|一半|half|two.quarter',
        onCorrect: { zh: '没错！$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$。\n分母一样的时候，直接把分子加起来就行！\n（$\\frac{2}{4}$ 还可以化简成 $\\frac{1}{2}$——这个以后再学。）', en: 'Yes! $\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$.\nWhen denominators match, just add the numerators!\n($\\frac{2}{4}$ simplifies to $\\frac{1}{2}$ — we\'ll learn that later.)' },
        onWrong: { zh: '这样想：4 块里你拿了 1 块，朋友拿了 1 块。\n一共拿了 2 块——还是 4 块里面的。\n所以 $\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$。分母不变，分子相加！', en: 'Think of it this way: out of 4 pieces, you took 1, friend took 1.\nTogether that\'s 2 pieces — still out of 4.\nSo $\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$. Denominator stays, numerators add!' },
        onSkip: { zh: '想象 4 块饼。你拿 1 块，朋友拿 1 块。一共拿了 2 块。\n$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$\n规则很简单：分母相同时，只加分子！', en: 'Imagine 4 slices. You take 1, friend takes 1. Together that\'s 2.\n$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$\nSimple rule: same denominator → just add numerators!' },
      },
    ],
    story: { zh: '桃园结义后第一顿饭！一块大饼切成 4 等份。刘备拿了 $\\frac{1}{4}$，关羽也拿了 $\\frac{1}{4}$。一共拿了多少？', en: 'First meal after the Peach Garden Oath! A flatbread cut into 4 equal pieces. Liu Bei takes $\\frac{1}{4}$, Guan Yu takes $\\frac{1}{4}$. How much in total?' },
    description: { zh: '$\\frac{1}{4} + \\frac{1}{4} = ?$', en: '$\\frac{1}{4} + \\frac{1}{4} = ?$' },
    data: { n1: 1, d1: 4, n2: 1, d2: 4, op: '+', ansNum: 1, ansDen: 2, generatorType: 'FRAC_ADD_SAME_DEN_RANDOM' },
    difficulty: 'Easy', reward: 30,
    kpId: 'kp-1.4-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '刘备：什么是分数？\n想象一块大饼——切成 4 等份。\n$\\frac{1}{4}$ 就是"切 4 份取 1 份"。\n\n分母（下面）= 切几份，分子（上面）= 拿几份。就这么简单！', en: 'Liu Bei: "What is a fraction?\nImagine a big flatbread — cut into 4 equal pieces.\n$\\frac{1}{4}$ means \'cut into 4, take 1\'.\n\nDenominator (bottom) = how many slices, Numerator (top) = how many you take. That simple!"' }, highlightField: 'ans' },
      { text: { zh: '刘备：分数的大小怎么看？\n$\\frac{1}{4}$ 比 $\\frac{1}{2}$ 小——因为同一块饼，切 4 份每份比切 2 份的小！\n$\\frac{3}{4}$ 比 $\\frac{1}{4}$ 大——同样切 4 份，拿 3 份比拿 1 份多。\n\n分母越大每份越小，分子越大拿得越多。', en: 'Liu Bei: "How to compare fractions?\n$\\frac{1}{4}$ is less than $\\frac{1}{2}$ — same pie, 4 slices are smaller than 2!\n$\\frac{3}{4}$ is more than $\\frac{1}{4}$ — same slicing, 3 pieces > 1 piece.\n\nBigger denominator = smaller pieces, bigger numerator = more pieces."' }, highlightField: 'ans' },
      { text: { zh: '刘备：同分母加法——超简单！\n两个人都从同一块饼（切 4 份）里拿：\n刘备拿 $\\frac{1}{4}$（1 份），关羽拿 $\\frac{1}{4}$（1 份）。\n\n切法一样（分母相同），直接加分子：$1 + 1 = 2$ 份。', en: 'Liu Bei: "Same denominator addition — super easy!\nBoth take from the same pie (cut into 4):\nLiu Bei takes $\\frac{1}{4}$ (1 piece), Guan Yu takes $\\frac{1}{4}$ (1 piece).\n\nSame slicing (same denominator), just add numerators: $1 + 1 = 2$ pieces."' }, highlightField: 'ans' },
      { text: { zh: '刘备：$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$\n\n但 $\\frac{2}{4}$ 能化简吗？$2$ 和 $4$ 都能被 $2$ 整除：\n$\\frac{2 \\div 2}{4 \\div 2} = \\frac{1}{2}$\n\n拿了半块饼！', en: 'Liu Bei: "$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}$\n\nCan $\\frac{2}{4}$ be simplified? Both $2$ and $4$ divide by $2$:\n$\\frac{2 \\div 2}{4 \\div 2} = \\frac{1}{2}$\n\nHalf the pie!"' }, highlightField: 'ans' },
      { text: { zh: '刘备：答案\n$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4} = \\frac{1}{2}$\n\n两人合拿了半块饼。', en: 'Liu Bei: "Answer\n$\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4} = \\frac{1}{2}$\n\nTogether they took half the pie."' }, highlightField: 'ans' },
      { text: { zh: '刘备：验算——半块饼对吗？\n4 份里拿了 2 份 = $\\frac{2}{4}$ = 一半 ✓\n\n记住口诀：同分母加法 = 分母不变，分子相加！\n下一关开始异分母——那才是真正的挑战！做得好！', en: 'Liu Bei: "Verify — is half right?\n2 out of 4 pieces = $\\frac{2}{4}$ = half ✓\n\nRemember: same denominator = keep denominator, add numerators!\nNext mission: different denominators — the real challenge! Well done!"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '分数 = 把整体平均分成几份，取其中几份。$\\frac{1}{4}$ = 切 4 份取 1 份。同分母加法：分母不变，分子相加。', en: 'Fraction = divide whole into equal parts, take some. $\\frac{1}{4}$ = cut into 4, take 1. Same denominator: keep denominator, add numerators.' }, formula: '$\\frac{a}{n} + \\frac{b}{n} = \\frac{a+b}{n}$', tips: [{ zh: '刘备提示：分母是切法，分子是拿法——切法一样才能直接加！', en: 'Liu Bei Tip: Denominator is how you cut, numerator is how much you take — same cut means just add!' }] },
    storyConsequence: { correct: { zh: '大饼分好了！兄弟们第一顿饭吃得开心！', en: 'Pie shared perfectly! Brothers enjoy their first meal together!' }, wrong: { zh: '饼分错了，有人多吃有人少吃…', en: 'Pie shared unevenly — someone got more, someone less...' } },
  },
  {
    id: 707, grade: 7, unitId: 0, order: 7,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'FRAC_ADD',
    title: { zh: '合并粮草', en: 'Combining Grain' },
    skillName: { zh: '分数通分术', en: 'Common Denominator' },
    skillSummary: { zh: '异分母分数相加：通分→加分子→约分', en: 'Adding fractions with different denominators: find LCD → add numerators → simplify' },
    story: { zh: '两营粮草要合并运输。第一营占总量的一部分，第二营占另一部分。', en: 'Two camps combine their grain for transport. Each has a fraction of the total.' },
    description: { zh: '计算合并后的分数。', en: 'Calculate the combined fraction.' },
    data: { n1: 1, d1: 3, n2: 1, d2: 4, op: '+', ansNum: 7, ansDen: 12, generatorType: 'FRAC_ADD_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-1.4-01', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '关羽：合并粮草——分母不同怎么加？\n\n$\\frac{1}{3}$ 和 $\\frac{1}{4}$ 就像"三等份"和"四等份"——大小不同，不能直接加！必须先换成**同样大小的份数**（通分），才能相加。', en: 'Guan Yu: Combining grain — how to add with different denominators?\n\n$\\frac{1}{3}$ and $\\frac{1}{4}$ are like "thirds" and "quarters" — different unit sizes, cannot add directly! Must convert to the same unit size (common denominator) first.' }, highlightField: 'ans' },
      { text: { zh: '关羽：通分步骤\n1. 找分母的最小公倍数（LCM）\n2. 每个分数的分子分母同乘倍数\n3. 再加分子，分母不变', en: 'Guan Yu: Steps to find common denominator\n1. Find the LCM of the denominators\n2. Multiply numerator and denominator of each fraction by the needed factor\n3. Add the numerators; denominator stays the same' }, highlightField: 'ans' },
      { text: { zh: '关羽："分母不同，要先通分。3 和 4 的最小公倍数是 12"', en: 'Guan Yu: "Different denominators — find common denominator. LCM(3,4) = 12"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{1}{3} = \\frac{4}{12}$，$\\frac{1}{4} = \\frac{3}{12}$"\n\n$\\frac{1}{3}$：$3 \times 4 = 12$，分子也乘 4；$\\frac{1}{4}$：$4 \times 3 = 12$，分子也乘 3', en: 'Guan Yu: "$\\frac{1}{3} = \\frac{4}{12}$, $\\frac{1}{4} = \\frac{3}{12}$"\n\n$\\frac{1}{3}$: $3 \times 4 = 12$, multiply numerator by $4$; $\\frac{1}{4}$: $4 \times 3 = 12$, multiply numerator by $3$' }, highlightField: 'ans' },
      { text: { zh: '关羽：加法\n$$\\frac{4}{12} + \\frac{3}{12} = \\frac{4+3}{12} = \\frac{7}{12}$$', en: 'Guan Yu: Add\n$$\\frac{4}{12} + \\frac{3}{12} = \\frac{4+3}{12} = \\frac{7}{12}$$' }, highlightField: 'ans' },
      { text: { zh: '关羽：验算\n$\\frac{7}{12}$ 能化简吗？$\\gcd(7, 12) = 1$，已是最简 ✓\n$\\frac{7}{12} > \\frac{1}{2}$——两营合计超过一半粮草！', en: 'Guan Yu: Verify\nCan $\\frac{7}{12}$ be simplified? $\\gcd(7, 12) = 1$ — already simplest ✓\n$\\frac{7}{12} > \\frac{1}{2}$ — combined, over half the grain supply!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '异分母分数相加：先通分（找 LCD），再加分子，最后约分。', en: 'Adding fractions with different denominators: find LCD, add numerators, then simplify.' }, formula: '$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$', tips: [{ zh: '关羽提示：合兵一处，粮草先算。', en: 'Guan Yu Tip: Before merging troops, count the grain.' }] },
    storyConsequence: { correct: { zh: '合并粮草——分数加减完美！做得漂亮！', en: 'Combining Grain — Well done!' }, wrong: { zh: '通分出了问题…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 708, grade: 7, unitId: 0, order: 8,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'FRAC_ADD',
    title: { zh: '消耗军粮', en: 'Consuming Grain' },
    skillName: { zh: '分数减法术', en: 'Fraction Subtraction' },
    skillSummary: { zh: '异分母分数相减：通分→减分子→约分', en: 'Subtracting fractions: find LCD → subtract numerators → simplify' },
    story: { zh: '粮仓存粮消耗了一部分，需要计算剩余比例。', en: 'A portion of the grain has been consumed. Calculate what remains.' },
    description: { zh: '计算剩余分数。', en: 'Calculate the remaining fraction.' },
    data: { n1: 3, d1: 4, n2: 1, d2: 6, op: '-', ansNum: 7, ansDen: 12, generatorType: 'FRAC_ADD_RANDOM' }, difficulty: 'Easy', reward: 55,
    kpId: 'kp-1.4-01', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '诸葛亮：分数减法——先通分，再减\n\n粮仓 $\\frac{3}{4}$ 满，消耗了 $\\frac{1}{6}$。分母不同（4 和 6），不能直接相减！和加法一样，先找公分母！', en: 'Zhuge Liang: Fraction subtraction — common denominator first, then subtract\n\nStorehouse is $\\frac{3}{4}$ full; consumed $\\frac{1}{6}$. Different denominators (4 and 6) — cannot subtract directly! Same as addition: find common denominator first!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：找公分母\n$\\text{LCM}(4, 6) = ?$\n$4 = 2^2$，$6 = 2 \times 3$\n$\\text{LCM} = 2^2 \times 3 = 12$', en: 'Zhuge Liang: Find common denominator\n$\\text{LCM}(4, 6) = ?$\n$4 = 2^2$, $6 = 2 \\times 3$\n$\\text{LCM} = 2^2 \\times 3 = 12$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：通分\n$\\frac{3}{4} = \\frac{9}{12}$\n$\\frac{1}{6} = \\frac{2}{12}$', en: 'Zhuge Liang: Convert to common denominator\n$\\frac{3}{4} = \\frac{9}{12}$\n$\\frac{1}{6} = \\frac{2}{12}$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：减法\n$$\\frac{9}{12} - \\frac{2}{12} = \\frac{9-2}{12} = \\frac{7}{12}$$', en: 'Zhuge Liang: Subtract\n$$\\frac{9}{12} - \\frac{2}{12} = \\frac{9-2}{12} = \\frac{7}{12}$$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n粮仓还剩 $\\frac{7}{12}$。', en: 'Zhuge Liang: Answer\n$\\frac{7}{12}$ of the storehouse remains.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$\\frac{7}{12} + \\frac{2}{12} = \\frac{9}{12} = \\frac{3}{4}$ ✓（加回消耗量恢复原状）\n\n粮草核算完毕！', en: 'Zhuge Liang: Verify\n$\\frac{7}{12} + \\frac{2}{12} = \\frac{9}{12} = \\frac{3}{4}$ ✓ (adding consumption back restores original)\n\nGrain audit complete!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '异分母分数相减：通分后减分子，最后约分。', en: 'Subtracting fractions: find LCD, subtract numerators, then simplify.' }, formula: '$\\frac{a}{b} - \\frac{c}{d} = \\frac{ad - bc}{bd}$', tips: [{ zh: '诸葛亮提示：粮草不可不算，算清方能持久。', en: 'Zhuge Liang Tip: Always track your supplies — accurate counts sustain campaigns.' }] },
    storyConsequence: { correct: { zh: '消耗军粮——分数加减完美！做得漂亮！', en: 'Consuming Grain — Well done!' }, wrong: { zh: '通分出了问题…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 0B 续: 带分数↔假分数互转 ---
  {
    id: 692, grade: 7, unitId: 0, order: 8.3,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'MIXED_IMPROPER',
    title: { zh: '整箱拆零', en: 'Unpacking Crates' },
    skillName: { zh: '带分数化假分数', en: 'Mixed to Improper' },
    skillSummary: { zh: '整数×分母+分子 = 假分数的分子，分母不变', en: 'whole × denominator + numerator = improper numerator, denominator stays' },
    story: { zh: '运粮队有 {whole} 整箱加 $\\frac{num}{den}$ 箱散装粮草。为了过桥称重，需要全部拆成散装（假分数）。${whole}\\frac{num}{den}$ 拆成多少个 $\\frac{1}{den}$？', en: 'The supply convoy has {whole} full crates plus $\\frac{num}{den}$ of a crate loose. To weigh for the bridge, unpack everything into $\\frac{1}{den}$ portions. How many?' },
    description: { zh: '把带分数化成假分数，求分子。', en: 'Convert the mixed number to improper fraction. Find the numerator.' },
    data: { whole: 2, num: 3, den: 5, improperNum: 13, answer: 13, mode: 'to_improper', generatorType: 'MIXED_IMPROPER_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.4-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要把带分数化成假分数？\n\n过桥称重时，必须把整箱拆成散装——$2\\frac{3}{5}$ 箱粮草，到底是多少个 $\\frac{1}{5}$ 份？假分数把所有东西变成同一单位，更好计算！', en: 'Zhuge Liang: Why convert mixed numbers to improper fractions?\n\nWhen weighing at a bridge, everything must be unpacked — $2\\frac{3}{5}$ crates: how many $\\frac{1}{5}$ portions is that? An improper fraction puts everything in the same unit, easier to calculate!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：方法——整数 × 分母 + 分子\n$$2\\frac{3}{5}: \\quad 2 \\times 5 + 3 = \\text{假分数分子}$$\n分母不变，还是 $5$。', en: 'Zhuge Liang: Method — whole × denominator + numerator\n$$2\\frac{3}{5}: \\quad 2 \\times 5 + 3 = \\text{improper numerator}$$\nDenominator stays the same: $5$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n带分数 $2\\frac{3}{5}$：整数部分 $= 2$，分子 $= 3$，分母 $= 5$', en: 'Zhuge Liang: Read the values\nMixed number $2\\frac{3}{5}$: whole $= 2$, numerator $= 3$, denominator $= 5$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第一步——整数 × 分母\n$$2 \\times 5 = 10$$\n\n2 整箱，每箱 5 份 = 10 份', en: 'Zhuge Liang: Step 1 — whole × denominator\n$$2 \\times 5 = 10$$\n\n2 full crates, 5 portions each = 10 portions' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第二步——加上分子\n$$10 + 3 = 13$$\n\n答案：$\\frac{13}{5}$，分子是 $13$', en: 'Zhuge Liang: Step 2 — add the numerator\n$$10 + 3 = 13$$\n\nAnswer: $\\frac{13}{5}$, numerator is $13$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$\\frac{13}{5}$ 反向化回来：$13 \\div 5 = 2$ 余 $3$，即 $2\\frac{3}{5}$ ✓', en: 'Zhuge Liang: Verify\n$\\frac{13}{5}$ converted back: $13 \\div 5 = 2$ remainder $3$, giving $2\\frac{3}{5}$ ✓' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '带分数化假分数：整数×分母+分子=新分子，分母不变。', en: 'Mixed to improper: whole × denominator + numerator = new numerator.' }, formula: '$a\\frac{b}{c} = \\frac{ac + b}{c}$', tips: [{ zh: '诸葛亮提示：整箱拆零，方便过秤！', en: 'Zhuge Liang Tip: Unpack crates for easy weighing!' }] },
    storyConsequence: { correct: { zh: '整箱拆零——转换成功！做得漂亮！', en: 'Unpacking Crates — Well done!' }, wrong: { zh: '整数和分数没对上…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 690, grade: 7, unitId: 0, order: 8.6,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'MIXED_IMPROPER',
    title: { zh: '散装装箱', en: 'Repacking Loose Items' },
    skillName: { zh: '假分数化带分数', en: 'Improper to Mixed' },
    skillSummary: { zh: '分子÷分母：商=整数部分，余数=新分子，分母不变', en: 'Numerator ÷ denominator: quotient = whole, remainder = new numerator' },
    story: { zh: '散装粮草 $\\frac{improperNum}{den}$ 份，需要重新装箱方便运输。每 {den} 份装一箱，能装几整箱？还剩几份散装？', en: 'Loose grain: $\\frac{improperNum}{den}$ parts. Repack into crates ({den} per crate). How many full crates? How many loose parts remain?' },
    description: { zh: '把假分数化成带分数，求整数部分。', en: 'Convert improper fraction to mixed number. Find the whole part.' },
    data: { whole: 2, num: 3, den: 5, improperNum: 13, answer: 2, mode: 'to_mixed', generatorType: 'MIXED_IMPROPER_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.4-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么要把假分数化成带分数？\n\n$\\frac{13}{5}$ 份粮草——士兵说"几整箱加几份散装"更直观。假分数化带分数就是把大数用"整数+余数"表示！', en: 'Zhuge Liang: Why convert improper fractions to mixed numbers?\n\n$\\frac{13}{5}$ portions — soldiers understand "2 full crates plus 3 loose" better. Converting is expressing a big fraction as "whole + remainder"!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：方法——用带余除法\n$$\\frac{13}{5}: \\quad 13 \\div 5 = 2 \\text{ 余 } 3$$\n商 $= 2$（整数），余数 $= 3$（分子），分母不变 $= 5$', en: 'Zhuge Liang: Method — use division with remainder\n$$\\frac{13}{5}: \\quad 13 \\div 5 = 2 \\text{ remainder } 3$$\nQuotient $= 2$ (whole), remainder $= 3$ (numerator), denominator stays $= 5$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n假分数 $\\frac{13}{5}$：分子 $= 13$，分母 $= 5$\n\n问：整数部分（商）是多少？', en: 'Zhuge Liang: Read the data\nImproper fraction $\\frac{13}{5}$: numerator $= 13$, denominator $= 5$\n\nQuestion: what is the whole number part (quotient)?' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：除法计算\n$$13 \\div 5 = 2 \\text{ 余 } 3$$\n\n整数部分 $= 2$', en: 'Zhuge Liang: Division calculation\n$$13 \\div 5 = 2 \\text{ remainder } 3$$\n\nWhole number part $= 2$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：写出带分数\n$$\\frac{13}{5} = 2\\frac{3}{5}$$\n\n答案（整数部分）$= 2$', en: 'Zhuge Liang: Write the mixed number\n$$\\frac{13}{5} = 2\\frac{3}{5}$$\n\nAnswer (whole number part) $= 2$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$2\\frac{3}{5}$ 化回假分数：$2 \\times 5 + 3 = 13$，即 $\\frac{13}{5} \\checkmark$\n\n2 整箱 + 3 份散装，装车出发！', en: 'Zhuge Liang: Verify\nConvert $2\\frac{3}{5}$ back: $2 \\times 5 + 3 = 13$, giving $\\frac{13}{5} \\checkmark$\n\n2 full crates + 3 loose — load up and march!' }, highlightField: 'ans' },
    ],
    storyConsequence: {
      correct: { zh: '诸葛亮：2 整箱 + 3 份散装，装车出发！', en: 'Zhuge Liang: "2 full crates + 3 loose — load up and march!"' },
      wrong: { zh: '诸葛亮：装错了！粮草对不上数...重新清点！', en: 'Zhuge Liang: "Wrong count! Grain doesn\'t match... recount!"' },
    },
    secret: { concept: { zh: '假分数化带分数：做除法，商=整数，余数=分子，分母不变。', en: 'Improper to mixed: divide, quotient = whole, remainder = numerator.' }, formula: '$\\frac{n}{d} = (n \\div d)\\frac{n \\bmod d}{d}$', tips: [{ zh: '诸葛亮提示：散装装箱，做除法就对了！', en: 'Zhuge Liang Tip: Repacking = division!' }] }
  },
  {
    id: 709, grade: 7, unitId: 0, order: 9,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'FRAC_MUL',
    title: { zh: '粮草翻倍', en: 'Grain Multiplication' },
    skillName: { zh: '分数乘法术', en: 'Fraction Multiplication' },
    skillSummary: { zh: '分子乘分子，分母乘分母，最后约分', en: 'Multiply tops, multiply bottoms, then simplify' },
    story: { zh: '军粮需要按比例分配，学会分数乘法才能精确计算。', en: 'Grain must be distributed proportionally — fraction multiplication is the key skill.' },
    description: { zh: '计算分数乘法。', en: 'Calculate the fraction multiplication.' },
    data: { n1: 2, d1: 3, n2: 3, d2: 5, op: 'mul', ansNum: 2, ansDen: 5, generatorType: 'FRAC_MUL_RANDOM' }, difficulty: 'Easy', reward: 55,
    kpId: 'kp-1.4-02', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '张飞：分数乘法——"几分之几的几分之几"是多少？\n\n$\\frac{2}{3}$ 的粮草，再取其中的 $\\frac{3}{5}$——就是取一部分的一部分。分数乘法就是"缩小再缩小"！分子乘分子，分母乘分母。', en: 'Zhang Fei: Fraction multiplication — "what fraction of a fraction"?\n\nTake $\\frac{3}{5}$ of $\\frac{2}{3}$ — taking a part of a part. Fraction multiplication is "shrinking twice"! Numerator times numerator, denominator times denominator.' }, highlightField: 'ans' },
      { text: { zh: '张飞：乘法公式\n$$\\frac{a}{b} \times \\frac{c}{d} = \\frac{a \times c}{b \times d}$$\n\n分子分母分别相乘，然后约分到最简！', en: 'Zhang Fei: Multiplication formula\n$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$$\n\nMultiply numerators and denominators separately, then simplify!' }, highlightField: 'ans' },
      { text: { zh: '张飞：读取数据\n$$\\frac{2}{3} \times \\frac{3}{5}$$\n\n分子：$2 \times 3 = 6$，分母：$3 \times 5 = 15$', en: 'Zhang Fei: Read the data\n$$\\frac{2}{3} \\times \\frac{3}{5}$$\n\nNumerator: $2 \\times 3 = 6$, denominator: $3 \\times 5 = 15$' }, highlightField: 'ans' },
      { text: { zh: '张飞：计算\n$$\\frac{2 \times 3}{3 \times 5} = \\frac{6}{15}$$\n\n能约分吗？$\\gcd(6, 15) = 3$', en: 'Zhang Fei: Calculate\n$$\\frac{2 \\times 3}{3 \\times 5} = \\frac{6}{15}$$\n\nCan simplify? $\\gcd(6, 15) = 3$' }, highlightField: 'ans' },
      { text: { zh: '张飞：约分\n$$\\frac{6}{15} = \\frac{6 \div 3}{15 \div 3} = \\frac{2}{5}$$\n\n答案：$\\frac{2}{5}$', en: 'Zhang Fei: Simplify\n$$\\frac{6}{15} = \\frac{6 \div 3}{15 \div 3} = \\frac{2}{5}$$\n\nAnswer: $\\frac{2}{5}$' }, highlightField: 'ans' },
      { text: { zh: '张飞：验算\n$\\frac{2}{5} \times \\frac{5}{2} = 1$ ✓（用倒数验算——乘回来等于 1）\n\n也可以用小数验：$0.667 \times 0.6 \\approx 0.4 = \\frac{2}{5}$ ✓', en: 'Zhang Fei: Verify\n$\\frac{2}{5} \\times \\frac{5}{2} = 1$ ✓ (verify with reciprocal)\n\nOr with decimals: $0.667 \\times 0.6 \\approx 0.4 = \\frac{2}{5}$ ✓' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '分数乘法：分子×分子，分母×分母，最后约分。', en: 'Fraction multiplication: numerator×numerator, denominator×denominator, then simplify.' }, formula: '$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$', tips: [{ zh: '张飞提示：俺虽粗人，乘法还是会的！', en: 'Zhang Fei Tip: I may be rough, but I can multiply!' }] },
    storyConsequence: { correct: { zh: '粮草翻倍——分数乘除过关！做得漂亮！', en: 'Grain Multiplication — Well done!' }, wrong: { zh: '分数运算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 710, grade: 7, unitId: 0, order: 10,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'FRAC_MUL',
    title: { zh: '分粮入户', en: 'Grain Division' },
    skillName: { zh: '分数除法术', en: 'Fraction Division' },
    skillSummary: { zh: '除以一个分数 = 乘以它的倒数（分子分母交换）', en: 'Dividing by a fraction = multiplying by its reciprocal (swap top and bottom)' },
    story: { zh: '要把粮草按户分配。除以一个分数，就是乘以它的倒数。', en: 'Distribute grain per household. Dividing by a fraction means multiplying by its reciprocal.' },
    description: { zh: '计算分数除法。', en: 'Calculate the fraction division.' },
    data: { n1: 2, d1: 3, n2: 3, d2: 5, op: 'div', ansNum: 10, ansDen: 9, generatorType: 'FRAC_MUL_RANDOM' }, difficulty: 'Medium', reward: 60,
    kpId: 'kp-1.4-02', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '关羽：分数除法——为什么"翻转再乘"？\n\n$\\frac{2}{3} \div \\frac{3}{5}$ 问的是"$\\frac{2}{3}$ 里面有几个 $\\frac{3}{5}$？"翻转 $\\frac{3}{5}$ 变成 $\\frac{5}{3}$，再乘——这和除法等价！', en: 'Guan Yu: Dividing fractions — why "flip and multiply"?\n\n$\\frac{2}{3} \div \\frac{3}{5}$ asks "how many $\\frac{3}{5}$s fit in $\\frac{2}{3}$?" Flip $\\frac{3}{5}$ to $\\frac{5}{3}$, then multiply — equivalent to division!' }, highlightField: 'ans' },
      { text: { zh: '关羽："除以一个分数 = 乘以它的倒数。倒数就是把分子分母交换"', en: 'Guan Yu: "Dividing by a fraction = multiplying by its reciprocal. Reciprocal: swap numerator and denominator"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{2}{3} \div \\frac{3}{5} = \\frac{2}{3} \times \\frac{5}{3}$"', en: 'Guan Yu: "$\\frac{2}{3} \div \\frac{3}{5} = \\frac{2}{3} \\times \\frac{5}{3}$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："分子乘分子，分母乘分母：$\\frac{2 \times 5}{3 \times 3} = \\frac{10}{9}$"', en: 'Guan Yu: "Numerator times numerator, denominator times denominator: $\\frac{2 \\times 5}{3 \\times 3} = \\frac{10}{9}$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{10}{9}$ 已经是最简分数，所以答案是 $\\frac{10}{9}$"', en: 'Guan Yu: "$\\frac{10}{9}$ is already in simplest form, so the answer is $\\frac{10}{9}$"' }, highlightField: 'ans' },
      { text: { zh: '关羽：验算\n$\\frac{10}{9} \times \\frac{3}{5} = \\frac{30}{45} = \\frac{2}{3}$ ✓\n\n结果正确——粮草分配数量核实！', en: 'Guan Yu: Verify\n$\\frac{10}{9} \\times \\frac{3}{5} = \\frac{30}{45} = \\frac{2}{3}$ ✓\n\nCorrect — grain division verified!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '分数除法：除以一个分数 = 乘以它的倒数。', en: 'Fraction division: dividing by a fraction = multiplying by its reciprocal.' }, formula: '$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$', tips: [{ zh: '关羽提示：翻转乾坤，化除为乘！', en: 'Guan Yu Tip: Flip and multiply — turn division into multiplication!' }] },
    storyConsequence: { correct: { zh: '分粮入户——分数乘除过关！做得漂亮！', en: 'Grain Division — Well done!' }, wrong: { zh: '分数运算有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 0B 续: 分数↔小数↔百分比 桥梁 ---
  {
    id: 694, grade: 7, unitId: 0, order: 10.5,
    unitTitle: { zh: "Unit 0B: 军粮分配·分数篇", en: "Unit 0B: Grain Division — Fractions" },
    topic: 'Algebra', type: 'FDP_CONVERT',
    title: { zh: '情报三译', en: 'Intelligence in Three Formats' },
    skillName: { zh: '分小百互转术', en: 'F-D-P Conversion' },
    skillSummary: { zh: '分数 ÷ 得小数 × 100 得百分比——三种写法，一个数', en: 'Fraction ÷ = decimal × 100 = percentage — three forms, one number' },
    story: { zh: '诸葛亮收到三路探子的情报，分别用分数、小数、百分比汇报粮草损耗率。看似不同，其实说的是同一个数！学会互相转换，才能统一分析。', en: 'Zhuge Liang receives intelligence from three scouts — one reports in fractions, one in decimals, one in percentages. They look different but say the same thing! Master conversion to unify the analysis.' },
    description: { zh: '完成分数、小数、百分比之间的转换。', en: 'Convert between fractions, decimals, and percentages.' },
    data: { frac: '1/4', num: 1, den: 4, dec: 0.25, pct: 25, dir: 'frac_to_pct', answer: 25, generatorType: 'FDP_CONVERT_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.4-03', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么同一个数有三种写法？\n\n三路探子用不同格式汇报了同一个损耗率——分数、小数、百分比只是不同"语言"，说的是同一件事。学会互转，才能在战场上统一分析！', en: 'Zhuge Liang: Why does one number have three forms?\n\nThree scouts reported the same loss rate in different formats — fractions, decimals, and percentages are just different "languages" saying the same thing. Master conversion to unify battlefield analysis!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：转换路线\n$$\\text{分数} \\xrightarrow{\\div} \\text{小数} \\xrightarrow{\\times 100} \\text{百分比}$$\n\n分数先做除法变小数，再乘以 $100$ 得百分比。', en: 'Zhuge Liang: Conversion path\n$$\\text{Fraction} \\xrightarrow{\\div} \\text{Decimal} \\xrightarrow{\\times 100} \\text{Percentage}$$\n\nDivide the fraction to get the decimal, then multiply by $100$ for the percentage.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n分数 $\\frac{1}{4}$，求对应的百分比。\n\n分子 $= 1$，分母 $= 4$。', en: 'Zhuge Liang: Read the data\nFraction $\\frac{1}{4}$, find the equivalent percentage.\n\nNumerator $= 1$, denominator $= 4$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第一步——分数变小数\n$$1 \\div 4 = 0.25$$\n\n小数 $= 0.25$', en: 'Zhuge Liang: Step 1 — fraction to decimal\n$$1 \\div 4 = 0.25$$\n\nDecimal $= 0.25$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第二步——小数变百分比\n$$0.25 \\times 100 = 25$$\n\n答案：$25\\%$', en: 'Zhuge Liang: Step 2 — decimal to percentage\n$$0.25 \\times 100 = 25$$\n\nAnswer: $25\\%$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$$25\\% = \\frac{25}{100} = \\frac{1}{4} \\checkmark$$\n\n三路探子说的果然是同一件事！', en: 'Zhuge Liang: Verify\n$$25\\% = \\frac{25}{100} = \\frac{1}{4} \\checkmark$$\n\nAll three scouts were reporting the same thing!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '分数、小数、百分比是同一个数的三种写法。关键转换：分子÷分母=小数，小数×100=百分比。', en: 'Fractions, decimals, and percentages are three representations of the same number.' }, formula: '$\\frac{a}{b} = a \\div b = \\text{decimal} \\times 100\\%$', tips: [{ zh: '诸葛亮提示：情报统一格式，才能准确决策！', en: 'Zhuge Liang Tip: Unified format means accurate decisions!' }] },
    storyConsequence: { correct: { zh: '情报三译——转换一气呵成！做得漂亮！', en: 'Intelligence in Three Formats — Well done!' }, wrong: { zh: '转换出了差错…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 0C: 排兵布阵·幂与根篇 (Powers & Roots) ---
  {
    id: 713, grade: 7, unitId: 0, order: 11,
    unitTitle: { zh: "Unit 0C: 排兵布阵·幂与根篇", en: "Unit 0C: Battle Formation — Powers & Roots" },
    topic: 'Algebra', type: 'SQUARE_CUBE',
    title: { zh: '方阵操练', en: 'Square Formation Drill' },
    skillName: { zh: '平方计算术', en: 'Squaring Numbers' },
    skillSummary: { zh: '一个数的平方 = 这个数 × 自己', en: 'A number squared = the number × itself' },
    story: { zh: '刘备：兄弟们，今天操练方阵！士兵排成 n 行 n 列的正方形——这就是"平方"的由来。', en: 'Liu Bei: "Brothers, today we drill square formations! Soldiers in n rows and n columns — that\'s where \'squaring\' comes from."' },
    description: { zh: '计算 $n^2$。', en: 'Calculate $n^2$.' },
    data: { n: 7, answer: 49, mode: 'square', generatorType: 'SQUARE_CUBE_RANDOM' }, difficulty: 'Easy', reward: 40,
    kpId: 'kp-1.3-01', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '刘备：方阵训练——为什么用"平方"？\n\n$7 \times 7$ 的方阵，$7$ 行 $7$ 列，总人数 $= 7^2$。"平方"就是一个数乘以自己——正方形面积的计算！$n^2 = n \times n$。', en: 'Liu Bei: Square formation — why "square"?\n\nA $7 \times 7$ formation, 7 rows and 7 columns, total $= 7^2$. "Squaring" means multiplying a number by itself — it calculates the area of a square! $n^2 = n \times n$.' }, highlightField: 'ans' },
      { text: { zh: '刘备：平方的含义\n$$n^2 = n \times n$$\n\n读作"$n$ 的平方"，表示 $n$ 用了 $2$ 次。', en: 'Liu Bei: What squaring means\n$$n^2 = n \\times n$$\n\nRead "$n$ squared" — $n$ used $2$ times.' }, highlightField: 'ans' },
      { text: { zh: '刘备：读取数据\n求 $7^2$（即 $7$ 的平方）', en: 'Liu Bei: Read the data\nFind $7^2$ (the square of $7$)' }, highlightField: 'ans' },
      { text: { zh: '刘备：计算\n$$7^2 = 7 \times 7 = 49$$\n\n方阵总人数 $= 49$ 人。', en: 'Liu Bei: Calculate\n$$7^2 = 7 \\times 7 = 49$$\n\nTotal formation soldiers $= 49$.' }, highlightField: 'ans' },
      { text: { zh: '刘备：答案\n$7^2 = 49$', en: 'Liu Bei: Answer\n$7^2 = 49$' }, highlightField: 'ans' },
      { text: { zh: '刘备：验算\n$49 \div 7 = 7$ ✓\n\n前 10 个平方数速查：$1, 4, 9, 16, 25, 36, 49, 64, 81, 100$', en: 'Liu Bei: Verify\n$49 \div 7 = 7$ ✓\n\nFirst 10 perfect squares: $1, 4, 9, 16, 25, 36, 49, 64, 81, 100$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '平方就是一个数乘以自己，写作 $n^2$。来源于正方形面积公式。', en: 'Squaring means multiplying a number by itself, written $n^2$. Named after the area of a square.' }, formula: '$n^2 = n \\times n$', tips: [{ zh: '刘备提示：方阵排兵，行列相同，总数就是边长的平方！', en: 'Liu Bei Tip: In a square formation, rows equal columns — total is the side length squared!' }] },
    storyConsequence: { correct: { zh: '方阵操练——幂次全对！做得漂亮！', en: 'Square Formation Drill — Well done!' }, wrong: { zh: '幂次算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 714, grade: 7, unitId: 0, order: 12,
    unitTitle: { zh: "Unit 0C: 排兵布阵·幂与根篇", en: "Unit 0C: Battle Formation — Powers & Roots" },
    topic: 'Algebra', type: 'SQUARE_CUBE',
    title: { zh: '粮箱码垛', en: 'Stacking Supply Crates' },
    skillName: { zh: '立方计算术', en: 'Cubing Numbers' },
    skillSummary: { zh: '一个数的立方 = 这个数 × 自己 × 自己', en: 'A number cubed = the number × itself × itself' },
    story: { zh: '张飞：粮箱码成正方体！n 层，每层 n 行 n 列——这就是"立方"！', en: 'Zhang Fei: "Stack crates into a cube! n layers, each n rows × n columns — that\'s cubing!"' },
    description: { zh: '计算 $n^3$。', en: 'Calculate $n^3$.' },
    data: { n: 3, answer: 27, mode: 'cube', generatorType: 'SQUARE_CUBE_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.3-02', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '张飞：粮箱码垛——为什么用"立方"？\n\n$3 \times 3 \times 3$ 的粮箱方块，$3$ 层 $\times 3$ 行 $\times 3$ 列 $= 3^3$ 箱。"立方"就是一个数乘三次——正方体体积的计算！', en: 'Zhang Fei: Stacking crates — why "cube"?\n\n$3 \times 3 \times 3$ crate block: $3$ layers $\times 3$ rows $\times 3$ columns $= 3^3$ crates. "Cubing" means multiplying a number by itself three times — it calculates the volume of a cube!' }, highlightField: 'ans' },
      { text: { zh: '张飞：立方的含义\n$$n^3 = n \times n \times n$$\n\n读作"$n$ 的立方"，表示 $n$ 用了 $3$ 次。', en: 'Zhang Fei: What cubing means\n$$n^3 = n \\times n \\times n$$\n\nRead "$n$ cubed" — $n$ used $3$ times.' }, highlightField: 'ans' },
      { text: { zh: '张飞：读取数据\n求 $3^3$（即 $3$ 的立方）', en: 'Zhang Fei: Read the data\nFind $3^3$ (the cube of $3$)' }, highlightField: 'ans' },
      { text: { zh: '张飞：分两步计算\n$$3 \times 3 = 9, \quad 9 \times 3 = 27$$', en: 'Zhang Fei: Calculate in two steps\n$$3 \\times 3 = 9, \\quad 9 \\times 3 = 27$$' }, highlightField: 'ans' },
      { text: { zh: '张飞：答案\n$3^3 = 27$\n\n粮箱方块共 $27$ 箱！', en: 'Zhang Fei: Answer\n$3^3 = 27$\n\nThe crate block contains $27$ crates!' }, highlightField: 'ans' },
      { text: { zh: '张飞：验算\n$27 \div 3 = 9$，$9 \div 3 = 3$ ✓\n\n前 5 个立方数：$1, 8, 27, 64, 125$', en: 'Zhang Fei: Verify\n$27 \div 3 = 9$, $9 \div 3 = 3$ ✓\n\nFirst 5 perfect cubes: $1, 8, 27, 64, 125$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '立方就是一个数乘三次，写作 $n^3$。来源于正方体体积公式。', en: 'Cubing means multiplying a number by itself three times, written $n^3$. Named after the volume of a cube.' }, formula: '$n^3 = n \\times n \\times n$', tips: [{ zh: '张飞提示：码粮箱，三个方向都一样长，总数就是边长的立方！', en: 'Zhang Fei Tip: Stacking crates — same length in all three directions, total is the side cubed!' }] },
    storyConsequence: { correct: { zh: '粮箱码垛——幂次全对！做得漂亮！', en: 'Stacking Supply Crates — Well done!' }, wrong: { zh: '幂次算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 715, grade: 7, unitId: 0, order: 13,
    unitTitle: { zh: "Unit 0C: 排兵布阵·幂与根篇", en: "Unit 0C: Battle Formation — Powers & Roots" },
    topic: 'Algebra', type: 'SQUARE_ROOT',
    title: { zh: '侦察敌阵', en: 'Scouting Enemy Formation' },
    skillName: { zh: '平方根速算', en: 'Square Root' },
    skillSummary: { zh: '平方根是平方的反操作：√n 就是"谁的平方等于 n"', en: 'Square root reverses squaring: √n means "whose square equals n"' },
    story: { zh: '关羽：侦察兵报告敌军方阵人数。要知道每行几人，就要求"平方根"！', en: 'Guan Yu: "Scouts report the enemy square formation size. To find soldiers per row, we need the square root!"' },
    description: { zh: '计算 $\\sqrt{n}$。', en: 'Calculate $\\sqrt{n}$.' },
    data: { n: 49, answer: 7, mode: 'sqrt', generatorType: 'SQUARE_ROOT_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.3-03', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '关羽：侦察敌阵——从总人数反推每行几人！\n\n已知方阵共 $49$ 人，正方形方阵每行每列相同。问：每行几人？这就是求**平方根** $\\sqrt{49}$——平方的反操作！', en: 'Guan Yu: Scouting the enemy formation — find the side length from total soldiers!\n\nA square formation of $49$ soldiers, equal rows and columns. Question: how many per row? That\'s the square root $\\sqrt{49}$ — the inverse of squaring!' }, highlightField: 'ans' },
      { text: { zh: '关羽：平方根的含义\n$$\\sqrt{n} = x \\iff x^2 = n$$\n\n"$x$ 是 $n$ 的平方根"意思是"$x$ 的平方等于 $n$"。', en: 'Guan Yu: What square root means\n$$\\sqrt{n} = x \\iff x^2 = n$$\n\n"$x$ is the square root of $n$" means "$x$ squared equals $n$".' }, highlightField: 'ans' },
      { text: { zh: '关羽：读题\n$$\\sqrt{49} = ?$$\n\n问：哪个数的平方等于 $49$？', en: 'Guan Yu: Read the problem\n$$\\sqrt{49} = ?$$\n\nQuestion: which number squared equals $49$?' }, highlightField: 'ans' },
      { text: { zh: '关羽：找答案\n试 $7$：$7^2 = 49$ ✓\n\n$$\\sqrt{49} = 7$$', en: 'Guan Yu: Find the answer\nTry $7$: $7^2 = 49$ ✓\n\n$$\\sqrt{49} = 7$$' }, highlightField: 'ans' },
      { text: { zh: '关羽：答案\n$\\sqrt{49} = 7$\n\n每行 $7$ 人，方阵 $7 \times 7 = 49$ 人！', en: 'Guan Yu: Answer\n$\\sqrt{49} = 7$\n\n$7$ per row, formation $7 \\times 7 = 49$ soldiers!' }, highlightField: 'ans' },
      { text: { zh: '关羽：验算\n$7^2 = 49 \\checkmark$\n\n常见平方根：$\\sqrt{1}=1, \\sqrt{4}=2, \\sqrt{9}=3, \\sqrt{16}=4, \\sqrt{25}=5, \\sqrt{36}=6, \\sqrt{49}=7$', en: 'Guan Yu: Verify\n$7^2 = 49 \\checkmark$\n\nCommon square roots: $\\sqrt{1}=1, \\sqrt{4}=2, \\sqrt{9}=3, \\sqrt{16}=4, \\sqrt{25}=5, \\sqrt{36}=6, \\sqrt{49}=7$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '平方根 $\\sqrt{n}$ 就是"谁的平方等于 n"。它是平方运算的逆运算。', en: 'Square root $\\sqrt{n}$ means "whose square equals n". It\'s the inverse of squaring.' }, formula: '$\\sqrt{n^2} = n$', tips: [{ zh: '关羽提示：知道方阵总人数，开方就能算出每行几人！', en: 'Guan Yu Tip: Know the total in a square formation — take the square root to find soldiers per row!' }] },
    storyConsequence: { correct: { zh: '侦察敌阵——开方准确！做得漂亮！', en: 'Scouting Enemy Formation — Well done!' }, wrong: { zh: '开方结果不对…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 716, grade: 7, unitId: 0, order: 14,
    unitTitle: { zh: "Unit 0C: 排兵布阵·幂与根篇", en: "Unit 0C: Battle Formation — Powers & Roots" },
    topic: 'Algebra', type: 'SQUARE_ROOT',
    title: { zh: '综合考核', en: 'Combined Assessment' },
    skillName: { zh: '幂与根综合', en: 'Powers & Roots Mastery' },
    skillSummary: { zh: '混合练习平方根和立方根', en: 'Mixed practice of square roots and cube roots' },
    story: { zh: '诸葛亮：最终考核！随机出题，可能是方阵求边长（√），也可能是粮仓求边长（∛）。', en: 'Zhuge Liang: "Final assessment! Random questions — find the side of a square formation (√) or a warehouse (∛)."' },
    description: { zh: '计算平方根或立方根。', en: 'Calculate the square or cube root.' },
    data: { n: 64, answer: 8, mode: 'mixed', op: 'sqrt', generatorType: 'SQUARE_ROOT_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-1.3-03', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '诸葛亮：综合考核——平方根还是立方根？\n\n$\\sqrt{64}$ 还是 $\\sqrt[3]{64}$？符号不同，答案不同！看清符号是关键——$\\sqrt{\\ }$ 是平方根，$\\sqrt[3]{\\ }$ 是立方根。', en: 'Zhuge Liang: Combined test — square root or cube root?\n\n$\\sqrt{64}$ or $\\sqrt[3]{64}$? Different symbols, different answers! Reading the symbol is key — $\\sqrt{}$ = square root, $\\sqrt[3]{}$ = cube root.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：两种根的含义\n$\\sqrt{n}$：哪个数的平方等于 $n$？→ $x^2 = n$\n$\\sqrt[3]{n}$：哪个数的立方等于 $n$？→ $x^3 = n$', en: 'Zhuge Liang: Two types of roots\n$\\sqrt{n}$: which number squared equals $n$? → $x^2 = n$\n$\\sqrt[3]{n}$: which number cubed equals $n$? → $x^3 = n$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读题\n$$\\sqrt{64} = ?$$\n\n问：哪个数的平方等于 $64$？', en: 'Zhuge Liang: Read the problem\n$$\\sqrt{64} = ?$$\n\nQuestion: which number squared equals $64$?' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：试验\n试 $8$：$8^2 = 64$ ✓\n\n（对比：$\\sqrt[3]{64} = 4$，因为 $4^3 = 64$）', en: 'Zhuge Liang: Test\nTry $8$: $8^2 = 64$ ✓\n\n(Comparison: $\\sqrt[3]{64} = 4$ because $4^3 = 64$)' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n$\\sqrt{64} = 8$', en: 'Zhuge Liang: Answer\n$\\sqrt{64} = 8$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$8^2 = 64 \\checkmark$\n\n综合考核通过！符号识别是关键！', en: 'Zhuge Liang: Verify\n$8^2 = 64 \\checkmark$\n\nCombined test passed! Symbol recognition is key!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '平方根和立方根分别是平方和立方的逆运算。看清根号上的小数字！', en: 'Square root and cube root are the inverses of squaring and cubing. Watch the index on the radical!' }, formula: '$\\sqrt{n^2} = n,\\quad \\sqrt[3]{n^3} = n$', tips: [{ zh: '诸葛亮提示：方阵用平方根，粮仓用立方根——看清题目再下笔！', en: 'Zhuge Liang Tip: Formations use square root, warehouses use cube root — read carefully before answering!' }] },
    storyConsequence: { correct: { zh: '方阵和粮仓的尺寸全算对了！诸葛亮：孺子可教！', en: 'Formation and warehouse dimensions all correct! Zhuge Liang: "A worthy student!"' }, wrong: { zh: '算错了尺寸，方阵排不齐…', en: 'Wrong dimensions — the formation is uneven...' } },
  },
  // --- Year 7 Unit 1 前置: 运算顺序 BODMAS ---
  {
    id: 695, grade: 7, unitId: 1, order: 0,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'BODMAS',
    title: { zh: '军令如山', en: 'Orders of Command' },
    skillName: { zh: '运算顺序术', en: 'Order of Operations (BODMAS)' },
    skillSummary: { zh: '括号 → 幂 → 乘除 → 加减——军令有先后，运算也有顺序', en: 'Brackets → Orders → Division/Multiplication → Addition/Subtraction' },
    story: { zh: '军令如山——先执行紧急命令（括号），再执行高级命令（乘除），最后执行一般命令（加减）。算错顺序，全军溃散！', en: 'Military orders have priority! Execute urgent orders (brackets) first, then senior orders (multiply/divide), then general orders (add/subtract). Wrong order = army collapses!' },
    description: { zh: '按正确顺序计算。', en: 'Calculate in the correct order.' },
    data: { answer: 14, expr: '2 + 3 \\times 4', generatorType: 'BODMAS_RANDOM' }, difficulty: 'Easy', reward: 40,
    kpId: 'kp-1.6-03', sectionId: 'number',
    discoverSteps: [
      {
        prompt: { zh: '$2 + 3 \\times 4 = ?$\n\n你觉得答案是多少？', en: '$2 + 3 \\times 4 = ?$\n\nWhat do you think the answer is?' },
        type: 'choice',
        choices: [
          { zh: '14（先算乘法 $3 \\times 4$，再加 $2$）', en: '14 (multiply $3 \\times 4$ first, then add $2$)' },
          { zh: '20（从左到右 $2 + 3 = 5$，再 $\\times 4$）', en: '20 (left to right: $2 + 3 = 5$, then $\\times 4$)' },
        ],
        onCorrect: { zh: '你发现了！乘法要比加法先算——就像军令有优先级，数学运算也有。\n这叫"运算顺序"（BODMAS）。', en: 'You got it! Multiplication comes before addition — just like military orders have priority levels.\nThis is called "Order of Operations" (BODMAS).' },
        onWrong: { zh: '很多人都选 20——这是最常见的错误！\n秘密是：乘法比加法优先。先算 $3 \\times 4 = 12$，再算 $2 + 12 = 14$。\n记住：乘除先，加减后。', en: 'Many people choose 20 — it is the most common mistake!\nThe secret: multiplication has higher priority than addition. $3 \\times 4 = 12$ first, then $2 + 12 = 14$.\nRemember: multiply/divide first, add/subtract after.' },
        onSkip: { zh: '没关系，我来带你看。\n$2 + 3 \\times 4$——先做乘法：$3 \\times 4 = 12$，再做加法：$2 + 12 = 14$。\n答案是 14，不是 20。', en: 'No worries, let me show you.\n$2 + 3 \\times 4$ — multiplication first: $3 \\times 4 = 12$, then addition: $2 + 12 = 14$.\nThe answer is 14, not 20.' },
      },
      {
        prompt: { zh: '那 $(2 + 3) \\times 4$ 呢？括号改变了什么？', en: 'What about $(2 + 3) \\times 4$? What do brackets change?' },
        type: 'choice',
        choices: [
          { zh: '括号里最先算，所以 $= 5 \\times 4 = 20$', en: 'Brackets are calculated first, so $= 5 \\times 4 = 20$' },
          { zh: '括号没有用，还是 14', en: 'Brackets do nothing, still 14' },
        ],
        onCorrect: { zh: '完美！括号就像"紧急军令"——无论里面是什么运算，都最优先执行。\nBODMAS 第一个字母 B = Brackets（括号）！', en: 'Perfect! Brackets are like "urgent orders" — whatever is inside gets done first.\nBODMAS — the B stands for Brackets!' },
        onWrong: { zh: '括号的威力很大！括号内的运算永远最先执行。\n$(2+3) = 5$，然后 $5 \\times 4 = 20$。', en: 'Brackets are powerful! Whatever is inside always goes first.\n$(2+3) = 5$, then $5 \\times 4 = 20$.' },
        onSkip: { zh: '括号 = 最高优先级。$(2+3)$ 先算 → $5$，再 $\\times 4 = 20$。', en: 'Brackets = highest priority. $(2+3)$ first → $5$, then $\\times 4 = 20$.' },
      },
    ],
    tutorialSteps: [
      { text: { zh: '诸葛亮：$2 + 3 \\times 4 = ?$ 你认为是 20 还是 14？\n\n很多人从左到右算：$(2+3) \\times 4 = 20$。但数学规定：乘法比加法优先！正确答案是 $14$，不是 $20$。', en: 'Zhuge Liang: $2 + 3 \\times 4 = ?$ — 20 or 14?\n\nMany people calculate left to right: $(2+3) \\times 4 = 20$. But maths rules: multiplication beats addition! The correct answer is $14$, not $20$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：口诀 BODMAS（无括号时）\n乘除 → 加减\n\n遇到加法和乘法混合，先做乘法！', en: 'Zhuge Liang: BODMAS when there are no brackets\nDivision/Multiplication → Addition/Subtraction\n\nWhen addition and multiplication mix, do the multiplication first!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读懂表达式\n$$2 + 3 \\times 4$$\n\n没有括号，但有乘法。先找到乘法部分：$3 \\times 4$', en: 'Zhuge Liang: Read the expression\n$$2 + 3 \\times 4$$\n\nNo brackets, but there is multiplication. Find the multiplication part first: $3 \\times 4$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第一步——先算乘法\n$$3 \\times 4 = 12$$\n\n表达式变成：$2 + 12$', en: 'Zhuge Liang: Step 1 — do the multiplication first\n$$3 \\times 4 = 12$$\n\nExpression becomes: $2 + 12$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第二步——再算加法\n$$2 + 12 = 14$$\n\n答案：$14$', en: 'Zhuge Liang: Step 2 — now do the addition\n$$2 + 12 = 14$$\n\nAnswer: $14$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n从左到右会得 $20$，正确顺序得 $14$。\n$$14 = 2 + 12 = 2 + 3 \\times 4 \\checkmark$$', en: 'Zhuge Liang: Verify\nLeft-to-right gives $20$; correct order gives $14$.\n$$14 = 2 + 12 = 2 + 3 \\times 4 \\checkmark$$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '运算顺序：括号最先，然后幂，再乘除，最后加减。不是从左到右！', en: 'Order of operations: Brackets first, then powers, then multiply/divide, finally add/subtract. NOT left to right!' }, formula: '$\\text{B → O → DM → AS}$', tips: [{ zh: '诸葛亮提示：军令如山，顺序错了全盘皆输！', en: 'Zhuge Liang Tip: Like military orders — wrong sequence means total defeat!' }] },
    storyConsequence: { correct: { zh: '军令如山——运算顺序完全正确！做得漂亮！', en: 'Orders of Command — Well done!' }, wrong: { zh: '运算顺序搞错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 691, grade: 7, unitId: 1, order: 0.5,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'BODMAS',
    title: { zh: '括号将令', en: 'Brackets Override' },
    skillName: { zh: '括号优先术', en: 'Brackets First' },
    skillSummary: { zh: '括号是最高优先级——括号里的永远先算', en: 'Brackets have highest priority — always calculate inside brackets first' },
    story: { zh: '诸葛亮的加密升级了！加了括号的密令，括号内的运算优先执行——就像将军的命令比士兵的命令优先级更高！', en: 'Zhuge Liang upgrades his encryption with brackets! Operations inside brackets execute first — like a general\'s orders override a soldier\'s!' },
    description: { zh: '含括号的运算——括号最先。', en: 'Calculate with brackets — brackets first.' },
    data: { answer: 35, expr: '(3 + 4) \\times 5', generatorType: 'BODMAS_RANDOM' }, difficulty: 'Medium', reward: 50,
    kpId: 'kp-1.6-03', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：为什么括号里的要先算？\n\n军令有优先级——将军的命令（括号）比士兵的命令（加减乘除）优先级高！有括号时，必须先执行括号里的命令，否则全军大乱。', en: 'Zhuge Liang: Why must we calculate inside brackets first?\n\nMilitary orders have priority — a general\'s orders (brackets) outrank a soldier\'s (addition/multiplication)! With brackets, always execute the bracketed command first or the army falls into chaos.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：运算顺序口诀 BODMAS\n括号 → 幂 → 乘除 → 加减\n\n括号是老大，加减是小兵。', en: 'Zhuge Liang: BODMAS order of operations\nBrackets → Orders → Division/Multiplication → Addition/Subtraction\n\nBrackets are the general; addition/subtraction are foot soldiers.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读懂题目\n$$(3 + 4) \\times 5$$\n\n有括号！先执行括号内的命令：$3 + 4$', en: 'Zhuge Liang: Read the expression\n$$(3 + 4) \\times 5$$\n\nThere are brackets! Execute the bracketed command first: $3 + 4$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第一步——计算括号\n$$3 + 4 = 7$$\n\n括号完成，表达式变成 $7 \\times 5$', en: 'Zhuge Liang: Step 1 — calculate inside brackets\n$$3 + 4 = 7$$\n\nBracket done, expression becomes $7 \\times 5$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第二步——计算结果\n$$7 \\times 5 = 35$$\n\n答案：$35$', en: 'Zhuge Liang: Step 2 — calculate the result\n$$7 \\times 5 = 35$$\n\nAnswer: $35$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算——没有括号会怎样？\n$$3 + 4 \\times 5 = 3 + 20 = 23 \\ne 35$$\n\n括号改变了答案！所以括号优先至关重要。', en: 'Zhuge Liang: Verify — what if there were no brackets?\n$$3 + 4 \\times 5 = 3 + 20 = 23 \\ne 35$$\n\nBrackets changed the answer! That\'s why bracket priority is critical.' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '括号改变运算顺序——括号内的永远最先算。有括号先算括号，没括号先算乘除。', en: 'Brackets change the order — inside brackets is always first. With brackets: brackets first. Without: multiply/divide first.' }, formula: '$\\text{B → O → DM → AS}$', tips: [{ zh: '诸葛亮提示：括号就像军令状——盖了印的优先执行！', en: 'Zhuge Liang Tip: Brackets are like sealed orders — they take priority!' }] },
    storyConsequence: { correct: { zh: '括号将令——运算顺序完全正确！做得漂亮！', en: 'Brackets Override — Well done!' }, wrong: { zh: '运算顺序搞错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7: The Peach Garden Oath (Foundations) ---
  {
    id: 711, grade: 7, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '桃园结义', en: 'Oath in the Garden' },
    skillName: { zh: '等式平衡术', en: 'Equation Balance' },
    skillSummary: { zh: '等式两边同时加减同一个数，等号保持不变', en: 'Add or subtract the same number from both sides, the equation stays balanced' },
    story: { zh: '桃园三结义——刘关张焚香祭天。刘备备了 {result} 坛桃花酿，祭天仪式要用 {a} 坛。三兄弟要算清楚：仪式之后还能剩几坛庆功？', en: 'The Peach Garden Oath — Liu Bei, Guan Yu, and Zhang Fei burn incense to heaven. Liu Bei prepared {result} jars of peach wine. The ceremony needs {a} jars. The brothers must figure out: how many jars remain for the celebration?' },
    description: { zh: '解方程 $x+{a}={result}$，求剩余的酒坛数 $x$。', en: 'Solve $x+{a}={result}$. Find the remaining jars $x$.' },
    data: { x: 7, a: 5, result: 12, generatorType: 'SIMPLE_EQ_ADD_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-2.1-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮：为什么要学方程？\n生活中很多时候我们知道结果但不知道原因——"总共 {result} 坛酒，仪式用了 {a} 坛，剩多少？"\n方程就是"反向推理"的工具：知道总数和部分，倒推未知的那个！', en: 'Zhuge Liang: "Why learn equations?\nOften we know the result but not the cause — \"{result} total jars, {a} used for ceremony, how many left?\"\nAn equation is a tool for \'reverse reasoning\': know the total and part, find the unknown!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：$x + {a} = {result}$——某个数加上 {a}，等于 {result}。这个数是多少？\n\n等号就像天平——左边 $x + {a}$，右边 ${result}$，现在是平的。', en: 'Zhuge Liang: "$x + {a} = {result}$ — what number plus {a} equals {result}?\n\nThe equals sign is a balance — left: $x+{a}$, right: ${result}$, perfectly level."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：$x$ 旁边有个 $+{a}$，想把它移走。怎么移？用反操作——减 {a}。\n加了再减，刚好抵消！对一边做什么，另一边必须做同样的事。', en: 'Zhuge Liang: "$x$ has $+{a}$ next to it. Remove it with the opposite: subtract {a}.\nAdd then subtract = cancel! Whatever we do to one side, we must do to the other."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：天平两边同时减 {a}：\n左边 $x + {a} - {a} = x$（抵消了）\n右边 ${result} - {a} = {x}$', en: 'Zhuge Liang: "Subtract {a} from both sides:\nLeft: $x + {a} - {a} = x$ (cancelled)\nRight: ${result} - {a} = {x}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：答案\n$x = {x}$！仪式用 {a} 坛，剩 {x} 坛庆功。', en: 'Zhuge Liang: "Answer\n$x = {x}$! {a} for ceremony, {x} for celebration."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：验算\n代回原式：${x} + {a} = {result}$ ✓ 等式成立！\n每人 {x} 坛美酒，结义大吉！', en: 'Zhuge Liang: "Verify\nSubstitute back: ${x} + {a} = {result}$ ✓ Equation holds!\n{x} jars each — the oath is sealed!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '等式两边同时加减同一个数，等式依然成立。', en: 'Adding or subtracting the same number from both sides keeps the equation balanced.' }, formula: '$x + a = b \\Rightarrow x = b - a$', tips: [{ zh: '刘备提示：兄弟同心，其利断金。', en: 'Liu Tip: Unity is strength.' }] },
    storyConsequence: { correct: { zh: '桃园结义——方程完美求解！做得漂亮！', en: 'Oath in the Garden — Well done!' }, wrong: { zh: '方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 712, grade: 7, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '招兵买马', en: 'Recruiting Soldiers' },
    skillName: { zh: '方程破解术', en: 'Equation Solver' },
    skillSummary: { zh: '等式两边同时乘除同一个非零数', en: 'Multiply or divide both sides by the same non-zero number' },
    story: { zh: '结义之后，三兄弟要招兵买马。关羽去铁匠铺买剑——{a} 把青龙剑总价 {result} 金。铁匠不肯还价，关羽得算清楚每把多少钱，免得被坑！', en: 'After the oath, the brothers arm up. Guan Yu visits the blacksmith — {a} Green Dragon swords cost {result} gold total. The smith won\'t haggle, so Guan Yu must calculate the price per sword!' },
    description: { zh: '解方程 ${a}x={result}$，求每把剑的单价 $x$。', en: 'Solve ${a}x={result}$ for the price per sword $x$.' },
    data: { x: 5, a: 3, result: 15, generatorType: 'SIMPLE_EQ_RANDOM' }, difficulty: 'Easy', reward: 60,
    kpId: 'kp-2.5-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '关羽：为什么要学这个？\n买东西最怕被坑！知道总价和数量，算单价就靠方程。\n铁匠说"3 把剑 15 金"——每把到底多少？不算清楚绝不掏钱！', en: 'Guan Yu: "Why learn this?\nNobody wants to be cheated! Knowing total and quantity, equations find the unit price.\nThe smith says \'3 swords for 15 gold\' — how much each? Don\'t pay until you know!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽：{a} 把长剑总价 {result} 金，每把多少钱？\n写成方程：${a}x = {result}$\n$x$ = 每把剑的价格（我们要求的）', en: 'Guan Yu: "{a} swords cost {result} gold — how much each?\nAs equation: ${a}x = {result}$\n$x$ = price per sword (what we want)"' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽：$x$ 被 {a} 乘着。要让 $x$ 单独出来，用反操作——除以 {a}。\n天平两边必须做同样的事！', en: 'Guan Yu: "$x$ is multiplied by {a}. To isolate $x$, use the opposite: divide by {a}.\nBoth sides must be treated equally!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽：左边 ${a}x \\div {a} = x$（{a} 被消掉了）\n右边 ${result} \\div {a} = {x}$', en: 'Guan Yu: "Left: ${a}x \\div {a} = x$ ({a} cancelled)\nRight: ${result} \\div {a} = {x}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽：答案\n$x = {x}$ 金/把', en: 'Guan Yu: "Answer\n$x = {x}$ gold per sword"' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽：验算\n${a} \\times {x} = {result}$ ✓ 总价吻合！\n每把剑 {x} 金，买剑去！', en: 'Guan Yu: "Verify\n${a} \\times {x} = {result}$ ✓ Total matches!\n{x} gold each — let\'s buy!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '等式两边同时乘除同一个非零数，等式依然成立。', en: 'Multiplying or dividing both sides by the same non-zero number keeps the equation balanced.' }, formula: '$ax = b \\Rightarrow x = b/a$', tips: [{ zh: '关羽提示：买东西一定要算清楚！', en: 'Guan Yu Tip: Always count correctly when shopping!' }] },
    storyConsequence: { correct: { zh: '招兵买马——方程完美求解！做得漂亮！', en: 'Recruiting Soldiers — Well done!' }, wrong: { zh: '方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 1 续: 两步方程 ---
  {
    id: 696, grade: 7, unitId: 1, order: 2.5,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '攻城双关', en: 'Two-Gate Siege' },
    skillName: { zh: '两步方程术', en: 'Two-Step Equations' },
    skillSummary: { zh: '两步方程 ax+b=c：先减 b，再除以 a——像拆礼物，先外层后内层', en: 'Two-step equation ax+b=c: subtract b first, then divide by a — unwrap layer by layer' },
    story: { zh: '攻城时要破两道关卡：外门和内门。两步方程也一样——$x$ 被两层运算包裹，要一层一层拆开。先拆外层（加减），再拆内层（乘除）！', en: 'Siege requires breaking two gates: outer and inner. Two-step equations are the same — $x$ is wrapped in two operations. Remove the outer layer (add/sub) first, then inner (mul/div)!' },
    description: { zh: '解两步方程 ${a}x+{b}={result}$，求 $x$。', en: 'Solve ${a}x+{b}={result}$ for $x$.' },
    data: { x: 5, a: 3, b: 4, result: 19, left: '3x + 4', right: '19', generatorType: 'SIMPLE_EQ_TWOSTEP_RANDOM' }, difficulty: 'Medium', reward: 65,
    kpId: 'kp-2.5-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：攻城有两层门——两步解方程！\n\n$3x + 4 = 19$，$x$ 被"乘以 3"和"加 4"两层保护。要找到 $x$，必须一层一层拆开——先拆外层（$+4$），再拆内层（$\\times 3$）！', en: 'Zhuge Liang: Two gates to storm — solve in two steps!\n\n$3x + 4 = 19$: $x$ is protected by "multiply by 3" and "add 4". To find $x$, peel off one layer at a time — outer first ($+4$), then inner ($\\times 3$)!' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：方程的黄金法则\n等式两边做**相同操作**，等号不变。\n加了就减，乘了就除——用反操作！', en: 'Zhuge Liang: The golden rule of equations\nDo the same operation to both sides, and equality holds.\nAdded? Subtract. Multiplied? Divide — use inverse operations!' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：读题\n$$3x + 4 = 19$$\n\n外层：$+4$，内层：$\\times 3$', en: 'Zhuge Liang: Read the equation\n$$3x + 4 = 19$$\n\nOuter layer: $+4$, inner layer: $\\times 3$' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：第一步——拆外层 $+4$\n$$3x + 4 - 4 = 19 - 4$$\n$$3x = 15$$', en: 'Zhuge Liang: Step 1 — remove outer layer $+4$\n$$3x + 4 - 4 = 19 - 4$$\n$$3x = 15$$' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：第二步——拆内层 $\\times 3$\n$$3x \\div 3 = 15 \\div 3$$\n$$x = 5$$', en: 'Zhuge Liang: Step 2 — remove inner layer $\\times 3$\n$$3x \\div 3 = 15 \\div 3$$\n$$x = 5$$' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：验算——代回原式\n$$3(5) + 4 = 15 + 4 = 19 \\checkmark$$\n\n城门攻破！$x = 5$', en: 'Zhuge Liang: Verify — substitute back\n$$3(5) + 4 = 15 + 4 = 19 \\checkmark$$\n\nGate stormed! $x = 5$' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '两步方程：先去掉加减（外层），再去掉乘除（内层）。顺序不能反！', en: 'Two-step equations: remove add/sub (outer) first, then mul/div (inner). Order matters!' }, formula: '$ax + b = c \\Rightarrow x = \\frac{c - b}{a}$', tips: [{ zh: '诸葛亮提示：攻城先破外门，解方程先去外层！', en: 'Zhuge Liang Tip: Siege the outer gate first, solve outer operations first!' }] },
    storyConsequence: { correct: { zh: '攻城双关——方程完美求解！做得漂亮！', en: 'Two-Gate Siege — Well done!' }, wrong: { zh: '方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 1 续: 代入求值 ---
  {
    id: 717, grade: 7, unitId: 1, order: 3,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SUBSTITUTION',
    title: { zh: '军情密码', en: 'Military Code' },
    skillName: { zh: '代入求值术', en: 'Substitution' },
    skillSummary: { zh: '把具体数字代替字母，算出表达式的值', en: 'Replace the letter with a number and evaluate the expression' },
    story: { zh: '诸葛亮用密码传递军情——用公式 $ax + b$ 加密。已知密钥 $x$，算出密文！', en: 'Zhuge Liang uses a code formula $ax + b$ to encrypt messages. Given the key $x$, calculate the output!' },
    description: { zh: '代入 $x$ 的值，计算表达式。', en: 'Substitute the value of $x$ and evaluate.' },
    data: { a: 3, b: 5, x: 4, answer: 17, mode: 'linear', generatorType: 'SUBSTITUTION_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-2.2-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：代入求值——密码破解的关键\n\n密码公式 $3x + 5$ 中，$x$ 是密钥。知道密钥就能解出密文。"代入"就是把字母 $x$ 换成具体数字，然后按运算顺序算出结果。', en: 'Zhuge Liang: Substitution — the key to breaking the code\n\nIn code formula $3x + 5$, $x$ is the key. Knowing the key, decrypt the message. "Substitution" means replacing letter $x$ with a specific number, then calculating in the correct order.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：代入步骤\n1. 把所有 $x$ 换成括号里的数字\n2. 按 BODMAS 顺序计算\n\n每个字母只是一个"占位符"——等着被真实数字替换！', en: 'Zhuge Liang: Substitution steps\n1. Replace every $x$ with the given number (in brackets)\n2. Calculate in BODMAS order\n\nEvery letter is just a "placeholder" — waiting to be replaced by a real number!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n表达式 $3x + 5$，密钥 $x = 4$\n\n找到所有字母 $x$ 的位置。', en: 'Zhuge Liang: Read the data\nExpression $3x + 5$, key $x = 4$\n\nFind every position of letter $x$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第一步——代入\n$$3x + 5 \\quad\\Rightarrow\\quad 3(4) + 5$$\n\n把 $x$ 换成 $4$（用括号包住更清晰）', en: 'Zhuge Liang: Step 1 — substitute\n$$3x + 5 \\quad\\Rightarrow\\quad 3(4) + 5$$\n\nReplace $x$ with $4$ (brackets make it clearer)' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：第二步——按顺序计算\n先乘：$3 \\times 4 = 12$\n再加：$12 + 5 = 17$\n\n答案：$17$', en: 'Zhuge Liang: Step 2 — calculate in order\nMultiply first: $3 \\times 4 = 12$\nThen add: $12 + 5 = 17$\n\nAnswer: $17$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$$3(4) + 5 = 12 + 5 = 17 \\checkmark$$\n\n密码解出！任务完成。', en: 'Zhuge Liang: Verify\n$$3(4) + 5 = 12 + 5 = 17 \\checkmark$$\n\nCode cracked! Mission complete.' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '代入就是用具体数值替换变量，然后按运算顺序计算。', en: 'Substitution means replacing variables with values, then computing step by step.' }, formula: { zh: '$\\text{代入 } x \\text{ 的值，按顺序计算}$', en: '$\\text{Substitute } x \\text{, then compute in order}$' }, tips: [{ zh: '诸葛亮提示：先乘除，后加减！', en: 'Zhuge Liang Tip: Multiply/divide first, then add/subtract!' }] },
    storyConsequence: { correct: { zh: '军情密码——代入精准！做得漂亮！', en: 'Military Code — Well done!' }, wrong: { zh: '代入算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 718, grade: 7, unitId: 1, order: 4,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SUBSTITUTION',
    title: { zh: '投石车射程', en: 'Catapult Range' },
    skillName: { zh: '含幂代入术', en: 'Substitution with Powers' },
    skillSummary: { zh: '先算幂，再算乘，最后加减', en: 'Powers first, then multiply, then add/subtract' },
    story: { zh: '投石车的射程公式含有 $x^2$。赵云需要代入参数计算准确的射程！', en: 'The catapult range formula contains $x^2$. Zhao Yun needs to substitute parameters for accurate range!' },
    description: { zh: '代入 $x$ 的值，计算含幂的表达式。', en: 'Substitute $x$ and evaluate the expression with powers.' },
    data: { a: 2, b: 3, x: 3, answer: 21, mode: 'power', generatorType: 'SUBSTITUTION_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-2.2-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '赵云：投石车射程公式含 $x^2$——为什么？\n\n投石车的射程不是线性的——角度稍微变一点，射程变化很大。含幂的公式能模拟这种"加速效应"。$x^2$ 就是 $x$ 乘以自己，先算它！', en: 'Zhao Yun: Why does the catapult formula contain $x^2$?\n\nCatapult range isn\'t linear — a small angle change gives a big range change. Power formulas model this "acceleration effect". $x^2$ means $x$ times itself — calculate it first!' }, highlightField: 'ans' },
      { text: { zh: '赵云：含幂的代入顺序（BODMAS）\n1. 先算幂：$x^2$ 先平方\n2. 再算乘法：系数 × 结果\n3. 最后加减\n\n幂的优先级比乘法更高！', en: 'Zhao Yun: Substitution order with powers (BODMAS)\n1. Powers first: square $x^2$\n2. Then multiply: coefficient × result\n3. Finally add/subtract\n\nPowers have higher priority than multiplication!' }, highlightField: 'ans' },
      { text: { zh: '赵云：读取数据\n表达式 $2x^2 + 3$，参数 $x = 3$\n\n需要代入 $x = 3$，注意有 $x^2$ 项！', en: 'Zhao Yun: Read the data\nExpression $2x^2 + 3$, parameter $x = 3$\n\nSubstitute $x = 3$; note the $x^2$ term!' }, highlightField: 'ans' },
      { text: { zh: '赵云：第一步——先算幂\n$$x^2 = 3^2 = 9$$\n\n表达式变成 $2(9) + 3$', en: 'Zhao Yun: Step 1 — calculate the power first\n$$x^2 = 3^2 = 9$$\n\nExpression becomes $2(9) + 3$' }, highlightField: 'ans' },
      { text: { zh: '赵云：第二步——乘法，再加减\n$$2 \\times 9 = 18, \\quad 18 + 3 = 21$$\n\n射程 $= 21$', en: 'Zhao Yun: Step 2 — multiply, then add\n$$2 \\times 9 = 18, \\quad 18 + 3 = 21$$\n\nRange $= 21$' }, highlightField: 'ans' },
      { text: { zh: '赵云：验算\n$$2(3)^2 + 3 = 2(9) + 3 = 18 + 3 = 21 \\checkmark$$\n\n射程精确，投石车参数设置完毕！', en: 'Zhao Yun: Verify\n$$2(3)^2 + 3 = 2(9) + 3 = 18 + 3 = 21 \\checkmark$$\n\nRange confirmed, catapult parameters set!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '运算顺序：幂 → 乘除 → 加减。代入后要严格按顺序计算。', en: 'Order of operations: Powers → Multiply/Divide → Add/Subtract.' }, formula: '$\\text{Powers} \\rightarrow \\times\\div \\rightarrow +\\,-$', tips: [{ zh: '赵云提示：先算指数，才能射得准！', en: 'Zhao Yun Tip: Powers first for accurate aim!' }] },
    storyConsequence: { correct: { zh: '投石车射程——代入精准！做得漂亮！', en: 'Catapult Range — Well done!' }, wrong: { zh: '代入算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 1 续: 化简同类项 ---
  {
    id: 719, grade: 7, unitId: 1, order: 5,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SIMPLIFY',
    title: { zh: '合兵一处', en: 'Combining Forces' },
    skillName: { zh: '合并同类项术', en: 'Collecting Like Terms' },
    skillSummary: { zh: '同类项（字母相同的项）可以合并——系数相加，字母不变', en: 'Like terms (same letter) can be combined — add coefficients, keep the letter' },
    story: { zh: '战场上来了多路援军，都是步兵（$x$）。3 路来了 $3x$，2 路来了 $2x$——合兵一处就是 $5x$！但骑兵（$y$）和步兵不能混编。', en: 'Reinforcements arrive from multiple routes, all infantry ($x$). 3 routes bring $3x$, 2 routes bring $2x$ — combine to $5x$! But cavalry ($y$) and infantry can\'t merge.' },
    description: { zh: '化简表达式，求 $x$ 的系数。', en: 'Simplify the expression, find the coefficient of $x$.' },
    data: { a: 3, b: 2, c: null, answer: 5, expr: '3x + 2x', simplified: '5x', generatorType: 'SIMPLIFY_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-2.2-03', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '诸葛亮：合兵一处——为什么要合并同类项？\n\n3 路步兵来了 $3x$ 人，又来了 $2x$ 人。步兵加步兵可以合并——但步兵（$x$）不能和骑兵（$y$）混！合并同类项就是把"同种兵力"加在一起，让算式更简洁。', en: 'Zhuge Liang: Combining forces — why collect like terms?\n\n3 infantry units bring $3x$ troops, then $2x$ more arrive. Infantry plus infantry can merge — but infantry ($x$) can\'t mix with cavalry ($y$)! Collecting like terms means adding troops of the "same type" together, simplifying the expression.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：同类项规则\n- 字母部分完全相同 → 可以合并\n- $3x$ 和 $2x$ 都是"$x$"项 → 可以合并\n- $3x$ 和 $2y$ 字母不同 → **不能**合并\n\n只加系数，字母照抄！', en: 'Zhuge Liang: Like terms rule\n- Identical letter parts → can combine\n- $3x$ and $2x$ are both "$x$" terms → can combine\n- $3x$ and $2y$ have different letters → **cannot** combine\n\nOnly add the coefficients; keep the letter!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：识别同类项\n$$3x + 2x$$\n\n两项都含 $x$——是同类项，可以合并！', en: 'Zhuge Liang: Identify like terms\n$$3x + 2x$$\n\nBoth terms contain $x$ — they are like terms, ready to combine!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：合并——只加系数\n$$3x + 2x = (3 + 2)x$$\n\n系数相加：$3 + 2 = 5$', en: 'Zhuge Liang: Combine — only add the coefficients\n$$3x + 2x = (3 + 2)x$$\n\nAdd the coefficients: $3 + 2 = 5$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：结果\n$$3x + 2x = 5x$$\n\n字母 $x$ 不变，系数变为 $5$，答案为 $5$。', en: 'Zhuge Liang: Result\n$$3x + 2x = 5x$$\n\nLetter $x$ unchanged, coefficient becomes $5$, answer is $5$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算（令 $x = 1$）\n$$3(1) + 2(1) = 5 = 5(1) \\checkmark$$\n\n合并同类项结果正确！', en: 'Zhuge Liang: Verify (let $x = 1$)\n$$3(1) + 2(1) = 5 = 5(1) \\checkmark$$\n\nCollecting like terms is correct!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '同类项（字母和指数完全相同）可以合并，只需把系数相加减。', en: 'Like terms (same letter and power) can be combined by adding/subtracting coefficients.' }, formula: '$ax + bx = (a+b)x$', tips: [{ zh: '诸葛亮提示：合兵一处，势如破竹！', en: 'Zhuge Liang Tip: United forces are unstoppable!' }] },
    storyConsequence: { correct: { zh: '合兵一处，势如破竹！代数入门完成！', en: 'Forces combined — unstoppable! Algebra intro complete!' }, wrong: { zh: '步兵骑兵混编失败，阵型大乱…', en: 'Infantry-cavalry mix-up — formation chaos...' } },
  },
  {
    id: 721, grade: 7, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 粮草调度与比例", en: "Unit 2: Logistics & Ratios" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '分配军粮', en: 'Distributing Grain' },
    skillName: { zh: '比例分配术', en: 'Proportional Division' },
    skillSummary: { zh: '总量除以份数得到每份', en: 'Divide total by number of parts' },
    story: { zh: '军粮分配需按比例。已知 ${a}x = {result}$，求每份军粮 $x$。', en: 'Grain must be distributed proportionally. ${a}x = {result}$, find $x$.' },
    description: { zh: '解方程 ${a}x={result}$。', en: 'Solve ${a}x={result}$.' },
    data: { x: 12, a: 2, result: 24, generatorType: 'SIMPLE_EQ_RANDOM' }, difficulty: 'Easy', reward: 70,
    kpId: 'kp-1.12-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '曹操：为什么要学这个？\n打仗最怕粮草不均——分多了浪费，分少了哗变。\n"总量 ÷ 份数 = 每份"——这就是公平分配的数学保障！', en: 'Cao Cao: "Why learn this?\nIn war, uneven supplies cause waste or mutiny.\n\'Total ÷ portions = each\' — this is the mathematical guarantee of fair distribution!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操：{a} 个营地共需 {result} 斛军粮，每营分多少？\n方程：${a}x = {result}$', en: 'Cao Cao: "{a} camps need {result} units — how much per camp?\nEquation: ${a}x = {result}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操：$x$ 被 {a} 乘着。用反操作——两边同时除以 {a}', en: 'Cao Cao: "$x$ is multiplied by {a}. Opposite operation — divide both sides by {a}"' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操：左边 ${a}x \\div {a} = x$\n右边 ${result} \\div {a} = {x}$', en: 'Cao Cao: "Left: ${a}x \\div {a} = x$\nRight: ${result} \\div {a} = {x}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操：答案\n$x = {x}$！每营 {x} 斛粮草。', en: 'Cao Cao: "Answer\n$x = {x}$! {x} units per camp."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操：验算\n${a} \\times {x} = {result}$ ✓ 军粮无误，开拔！', en: 'Cao Cao: "Verify\n${a} \\times {x} = {result}$ ✓ Supplies confirmed — march!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '比例关系建模：总量 = 份数 x 每份，再用除法求每份。', en: 'Proportional modeling: total = parts x each, use division to find each part.' }, formula: '$ax = b \\Rightarrow x = b/a$', tips: [{ zh: '曹操提示：公平分配，方能稳定军心。', en: 'Cao Cao Tip: Fair distribution keeps the army stable.' }] },
    storyConsequence: { correct: { zh: '分配军粮——方程完美求解！做得漂亮！', en: 'Distributing Grain — Well done!' }, wrong: { zh: '方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 722, grade: 7, unitId: 2, order: 2,
    unitTitle: { zh: "Unit 2: 粮草调度与比例", en: "Unit 2: Logistics & Ratios" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '征调民夫', en: 'Drafting Laborers' },
    skillName: { zh: '均分计算术', en: 'Equal Division' },
    skillSummary: { zh: '除法是乘法的逆运算', en: 'Division is the inverse of multiplication' },
    story: { zh: '修筑工事需要民夫。已知 {a} 个村庄共征调了 ${a}x = {result}$ 人。', en: 'Laborers are needed for fortifications. {a} villages drafted ${a}x = {result}$ people.' },
    description: { zh: '解方程 ${a}x={result}$，求每个村庄的人数 $x$。', en: 'Solve ${a}x={result}$ for $x$ per village.' },
    data: { x: 20, a: 5, result: 100, generatorType: 'SIMPLE_EQ_RANDOM' }, difficulty: 'Easy', reward: 75,
    kpId: 'kp-1.12-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '张飞：为什么要学这个？\n征调民夫最讲公平——村大多出、村小少出，但要有据可查。\n$5 \\times x = 100$——这就是把"公平"写成数学的方法！', en: 'Zhang Fei: "Why learn this?\nDrafting must be fair — big villages give more, small ones less, but with proof.\n$5 \\times x = 100$ — this is fairness written as math!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞：{a} 个村庄共出 {result} 人修工事，每村出几人？\n方程：${a}x = {result}$', en: 'Zhang Fei: "{a} villages sent {result} people — how many each?\nEquation: ${a}x = {result}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞：乘法的反操作是除法。两边同时除以 {a}，把 {a} 消掉！', en: 'Zhang Fei: "Opposite of multiplication = division. Divide both sides by {a} to cancel it!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞：左边 ${a}x \\div {a} = x$\n右边 ${result} \\div {a} = {x}$', en: 'Zhang Fei: "Left: ${a}x \\div {a} = x$\nRight: ${result} \\div {a} = {x}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞：答案\n$x = {x}$！每村 {x} 人。', en: 'Zhang Fei: "Answer\n$x = {x}$! {x} per village."' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞：验算\n${a} \\times {x} = {result}$ ✓ 公平合理，谁也别想多出少出！', en: 'Zhang Fei: "Verify\n${a} \\times {x} = {result}$ ✓ Fair and square — no one gives more or less!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '除法是乘法的逆运算：知道总量和份数，就能求每份。', en: 'Division is the inverse of multiplication: knowing total and parts, find each part.' }, formula: '$x = \\frac{b}{a}$', tips: [{ zh: '张飞提示：算清楚，才公平！', en: 'Zhang Fei Tip: Count right, keep it fair!' }] },
    storyConsequence: { correct: { zh: '征调民夫——方程完美求解！做得漂亮！', en: 'Drafting Laborers — Well done!' }, wrong: { zh: '方程解错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 2 续: 百分比 ---
  {
    id: 723, grade: 7, unitId: 2, order: 3,
    unitTitle: { zh: "Unit 2: 粮草调度与比例", en: "Unit 2: Logistics & Ratios" },
    topic: 'Algebra', type: 'PERCENTAGE',
    title: { zh: '军饷提成', en: 'Military Stipend' },
    skillName: { zh: '百分比计算术', en: 'Percentage Calculation' },
    skillSummary: { zh: 'p% of n = n × p/100', en: 'p% of n = n × p/100' },
    discoverSteps: [
      {
        prompt: { zh: '超市打折："七折优惠"。\n原价 100 元的东西，打七折后你要付多少钱？', en: 'A shop has a "30% off" sale.\nAn item costs $100. How much do you pay after the discount?' },
        type: 'choice',
        choices: [
          { zh: '70 元', en: '$70' },
          { zh: '30 元', en: '$30' },
          { zh: '不确定', en: 'Not sure' },
        ],
        acceptPattern: '',
        onCorrect: { zh: '对！打七折 = 付原价的 70% = 100 × 0.7 = 70 元。\n"百分比"就是"每一百里面取多少"。70% = 每 100 取 70。', en: 'Right! 30% off means you pay 70% = 100 × 0.7 = $70.\n"Percent" literally means "per hundred". 70% = 70 out of every 100.' },
        onWrong: { zh: '"七折"的意思是付原价的十分之七。\n100 的十分之七 = 100 × 0.7 = 70 元。\n"百分比"就是"每一百里面取多少"——70% 就是每 100 取 70。', en: '"30% off" means you pay 70% of the original.\n70% of 100 = 100 × 0.7 = $70.\nPercent means "per hundred" — 70% = 70 out of every 100.' },
        onSkip: { zh: '没关系！百分比其实就是"每 100 里取几个"。\n70% 就是每 100 取 70。所以 100 元的 70% = 70 元。\n打七折 = 付 70%。就这么简单。', en: 'No worries! Percent just means "out of every 100".\n70% means take 70 out of 100. So 70% of $100 = $70.\n30% off = pay 70%. That\'s all there is to it.' },
      },
      {
        prompt: { zh: '那如果原价是 200 元，打七折要付多少？', en: 'Now if the original price is $200, how much after 30% off?' },
        type: 'input',
        acceptPattern: '140',
        onCorrect: { zh: '完美！200 × 0.7 = 140 元。\n不管原价多少，方法一样：原价 × 百分比 ÷ 100。\n接下来我们用这个方法解决军粮分配的问题。', en: 'Perfect! 200 × 0.7 = $140.\nSame method regardless of price: original × percent ÷ 100.\nNow let\'s use this to solve a military supply problem.' },
        onWrong: { zh: '70% 的 200 = 200 × 70 ÷ 100 = 140。\n或者更快：200 × 0.7 = 140。\n方法：原价 × 百分比 ÷ 100。简单吧？', en: '70% of 200 = 200 × 70 ÷ 100 = 140.\nOr quicker: 200 × 0.7 = 140.\nMethod: original × percent ÷ 100. Simple!' },
        onSkip: { zh: '和刚才一模一样的方法：\n200 × 70 ÷ 100 = 140 元。\n记住：百分比计算 = 数字 × 百分比 ÷ 100。', en: 'Exact same method as before:\n200 × 70 ÷ 100 = $140.\nRemember: percentage calculation = number × percent ÷ 100.' },
      },
    ],
    story: { zh: '曹操治军严明：本月军粮总计 {n} 石，前锋营立了战功，按规矩可以优先领取总粮草的 {pct}%。司库问曹操：到底拨多少石给前锋？', en: 'Cao Cao rules with discipline: this month\'s total grain is {n} units. The vanguard earned merit and gets {pct}% of the total supply first. The treasurer asks: how much goes to the vanguard?' },
    description: { zh: '求 ${n}$ 的 ${pct}\\%$ 是多少。', en: 'Find ${pct}\\%$ of ${n}$.' },
    data: { n: 200, pct: 25, answer: 50, generatorType: 'PERCENTAGE_OF_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.12-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '曹操：前锋营要多少粮草？\n\n"总量的 25%"——百分比就是"每一百份里取几份"。200 石粮草，取其中的 25 份每百 = 取 $\\frac{25}{100}$ 的部分。这在军队分配、税收、折扣中无处不在！', en: 'Cao Cao: How much grain for the vanguard?\n\n"25% of the total" — percentage means "out of every 100 parts, take this many". 200 units of grain, take 25 per hundred = take $\\frac{25}{100}$ of the total. This appears everywhere: army allocation, taxes, discounts!' }, highlightField: 'ans' },
      { text: { zh: '曹操：百分比计算公式\n$$p\\% \\text{ of } n = n \\times \\frac{p}{100}$$\n\n或者：先把百分比变成小数，再乘。', en: 'Cao Cao: Percentage calculation formula\n$$p\\% \\text{ of } n = n \\times \\frac{p}{100}$$\n\nOr: convert the percentage to a decimal first, then multiply.' }, highlightField: 'ans' },
      { text: { zh: '曹操：读取数据\n求 $200$ 石的 $25\\%$\n\n$n = 200$，$p = 25$', en: 'Cao Cao: Read the data\nFind $25\\%$ of $200$ units\n\n$n = 200$, $p = 25$' }, highlightField: 'ans' },
      { text: { zh: '曹操：转换百分比为小数\n$$25\\% = \\frac{25}{100} = 0.25$$', en: 'Cao Cao: Convert percentage to decimal\n$$25\\% = \\frac{25}{100} = 0.25$$' }, highlightField: 'ans' },
      { text: { zh: '曹操：计算\n$$200 \\times 0.25 = 50$$\n\n前锋营分得 $50$ 石粮草。', en: 'Cao Cao: Calculate\n$$200 \\times 0.25 = 50$$\n\nThe vanguard receives $50$ units of grain.' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n$50$ 是 $200$ 的多少？$\\frac{50}{200} = 0.25 = 25\\% \\checkmark$\n\n前锋营的粮草分配完毕！', en: 'Cao Cao: Verify\nWhat fraction of $200$ is $50$? $\\frac{50}{200} = 0.25 = 25\\% \\checkmark$\n\nVanguard grain allocation complete!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '百分比就是"每百份中的份数"。求 p% of n，用 n × p ÷ 100。', en: 'Percentage means "parts per hundred". To find p% of n, use n × p ÷ 100.' }, formula: '$p\\% \\text{ of } n = n \\times \\frac{p}{100}$', tips: [{ zh: '曹操提示：百分比是商业和军事的通用语言！', en: 'Cao Cao Tip: Percentages are the universal language of business and warfare!' }] },
    storyConsequence: { correct: { zh: '军饷提成——百分比算得好！做得漂亮！', en: 'Military Stipend — Well done!' }, wrong: { zh: '百分比算差了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 724, grade: 7, unitId: 2, order: 4,
    unitTitle: { zh: "Unit 2: 粮草调度与比例", en: "Unit 2: Logistics & Ratios" },
    topic: 'Algebra', type: 'PERCENTAGE',
    title: { zh: '粮价涨跌', en: 'Grain Price Change' },
    skillName: { zh: '百分比增减术', en: 'Percentage Increase/Decrease' },
    skillSummary: { zh: '增加 p% → 乘以 (1 + p/100)；减少 p% → 乘以 (1 - p/100)', en: 'Increase p% → multiply by (1+p/100); Decrease p% → multiply by (1-p/100)' },
    story: { zh: '曹操正在囤粮备战。探子来报：前方战区粮价涨了！原来每石 {initial} 金的粟米，现在贵了 {rate}。曹操必须快速算出新价格——是继续采购，还是另寻粮道？', en: 'Cao Cao is stockpiling grain for war. A spy reports: grain prices in the war zone have risen! Millet that cost {initial} gold per unit is now more expensive. Cao Cao must quickly calculate the new price — keep buying or find another route?' },
    description: { zh: '计算百分比增减后的新价格。', en: 'Calculate the new price after percentage change.' },
    data: { initial: 200, rate: 0.2, years: 1, generatorType: 'PERCENTAGE_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-1.12-03', sectionId: 'number',
    storyConsequence: {
      correct: { zh: '曹操：算得好！知道了新价格，本相可以从容调度——从南方走水路运粮，成本更低！', en: 'Cao Cao: "Well calculated! Knowing the new price, I can reroute supplies by river from the south — cheaper!"' },
      wrong: { zh: '曹操：算错了？军国大事岂能儿戏！重新算来！', en: 'Cao Cao: "Wrong?! Military affairs are no game! Calculate again!"' },
    },
    tutorialSteps: [
      { text: { zh: '曹操：涨价了！为什么增加 20% 要乘以 1.2？\n\n原价是"100%"，涨了 20% 后变成"120%"。所以新价格 $=$ 原价 $\\times 120\\% =$ 原价 $\\times 1.2$。乘以 $1.2$ 比先求增加量再相加更快捷！', en: 'Cao Cao: Prices rose! Why does a 20% increase mean multiply by 1.2?\n\nThe original price is "100%"; after a 20% rise it becomes "120%". So new price $=$ original $\\times 120\\% =$ original $\\times 1.2$. Multiplying by $1.2$ is faster than finding the increase then adding!' }, highlightField: 'ans' },
      { text: { zh: '曹操：百分比变化公式\n增加 $p\\%$ → 新值 $=$ 原值 $\\times (1 + \\frac{p}{100})$\n减少 $p\\%$ → 新值 $=$ 原值 $\\times (1 - \\frac{p}{100})$\n\n增加 $20\\%$ → 乘以 $1.20$', en: 'Cao Cao: Percentage change formula\nIncrease $p\\%$ → new $=$ original $\\times (1 + \\frac{p}{100})$\nDecrease $p\\%$ → new $=$ original $\\times (1 - \\frac{p}{100})$\n\nIncrease $20\\%$ → multiply by $1.20$' }, highlightField: 'ans' },
      { text: { zh: '曹操：读取数据\n原价 $200$ 金，涨幅 $20\\%$\n\n求新价格。', en: 'Cao Cao: Read the data\nOriginal price $200$ gold, increase $20\\%$\n\nFind the new price.' }, highlightField: 'ans' },
      { text: { zh: '曹操：求乘数\n$$1 + \\frac{20}{100} = 1 + 0.2 = 1.2$$', en: 'Cao Cao: Find the multiplier\n$$1 + \\frac{20}{100} = 1 + 0.2 = 1.2$$' }, highlightField: 'ans' },
      { text: { zh: '曹操：计算新价格\n$$200 \\times 1.2 = 240$$\n\n新价格 $= 240$ 金', en: 'Cao Cao: Calculate new price\n$$200 \\times 1.2 = 240$$\n\nNew price $= 240$ gold' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n增加量 $= 200 \\times 0.2 = 40$\n$200 + 40 = 240 \\checkmark$\n\n两种方法结果相同——转道走水路！', en: 'Cao Cao: Verify\nIncrease $= 200 \\times 0.2 = 40$\n$200 + 40 = 240 \\checkmark$\n\nBoth methods agree — reroute via the river!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '增减百分比的关键是乘法因子：增加用 (1+r)，减少用 (1-r)。', en: 'The key to percentage change is the multiplier: increase (1+r), decrease (1-r).' }, formula: { zh: '$\\text{新值} = \\text{原值} \\times (1 \\pm r)$', en: '$\\text{New} = \\text{Original} \\times (1 \\pm r)$' }, tips: [{ zh: '曹操提示：粮价涨跌关乎国运，算清楚才能决策！', en: 'Cao Cao Tip: Grain prices affect the nation — calculate clearly to decide wisely!' }] }
  },
  // --- Year 7 Unit 2 续: 比例化简与分配 ---
  {
    id: 725, grade: 7, unitId: 2, order: 5,
    unitTitle: { zh: "Unit 2: 粮草调度与比例", en: "Unit 2: Logistics & Ratios" },
    topic: 'Algebra', type: 'RATIO',
    title: { zh: '精简军令', en: 'Simplify Orders' },
    skillName: { zh: '比例化简术', en: 'Simplifying Ratios' },
    skillSummary: { zh: '化简比就像约分——两项同时除以最大公因数', en: 'Simplify ratio like simplifying fractions — divide both terms by HCF' },
    story: { zh: '曹操的军令写着"步兵与骑兵按 {a}:{b} 配比"。谋士荀彧说："丞相，比例可以化简——{a}:{b} 就是 {sa}:{sb}，更简洁明了！"', en: 'Cao Cao\'s order reads "infantry to cavalry ratio {a}:{b}." Advisor Xun Yu says: "My lord, simplify — {a}:{b} is just {sa}:{sb}, much clearer!"' },
    description: { zh: '化简比，求最简比的第一项。', en: 'Simplify the ratio. Find the first term.' },
    data: { a: 12, b: 8, sa: 3, sb: 2, g: 4, answer: 3, mode: 'simplify', generatorType: 'RATIO_Y7_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.11-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '荀彧：12:8 能化简成 3:2——为什么要化简？\n\n$12:8$ 和 $3:2$ 表达的是完全一样的比例关系——只是 $12:8$ 更"啰嗦"。化简后更清晰，不容易出错。化简比就像约分：两项同时除以最大公因数（HCF）！', en: 'Xun Yu: 12:8 simplifies to 3:2 — why simplify?\n\n$12:8$ and $3:2$ express exactly the same ratio — $12:8$ is just more verbose. Simpler is clearer and less error-prone. Simplifying ratios is like simplifying fractions: divide both terms by the HCF!' }, highlightField: 'ans' },
      { text: { zh: '荀彧：化简比的步骤\n1. 找两个数的最大公因数（HCF）\n2. 两项同时除以 HCF\n3. 验证结果互质（不能再约分）\n\nHCF = 最大公因数！', en: 'Xun Yu: Steps to simplify a ratio\n1. Find the HCF of both numbers\n2. Divide both terms by the HCF\n3. Verify the result is in lowest terms (can\'t simplify further)\n\nHCF = Highest Common Factor!' }, highlightField: 'ans' },
      { text: { zh: '荀彧：读取数据\n比 $12:8$，求最简比。\n\n先找 $12$ 和 $8$ 的公因数。', en: 'Xun Yu: Read the data\nRatio $12:8$, find the simplest form.\n\nFirst find the common factors of $12$ and $8$.' }, highlightField: 'ans' },
      { text: { zh: '荀彧：找最大公因数\n$12$ 的因数：$1, 2, 3, 4, 6, 12$\n$8$ 的因数：$1, 2, 4, 8$\n\n公因数：$1, 2, 4$，最大公因数 HCF $= 4$', en: 'Xun Yu: Find the HCF\nFactors of $12$: $1, 2, 3, 4, 6, 12$\nFactors of $8$: $1, 2, 4, 8$\n\nCommon factors: $1, 2, 4$; HCF $= 4$' }, highlightField: 'ans' },
      { text: { zh: '荀彧：除以 HCF\n$$12 \\div 4 = 3, \\quad 8 \\div 4 = 2$$\n\n最简比 $= 3:2$，答案（第一项）$= 3$', en: 'Xun Yu: Divide by HCF\n$$12 \\div 4 = 3, \\quad 8 \\div 4 = 2$$\n\nSimplest ratio $= 3:2$, answer (first term) $= 3$' }, highlightField: 'ans' },
      { text: { zh: '荀彧：验算\n$3 \\times 4 = 12$ ✓，$2 \\times 4 = 8$ ✓\n$3$ 和 $2$ 的公因数只有 $1$——已是最简 ✓\n\n丞相，比例化简完毕！', en: 'Xun Yu: Verify\n$3 \\times 4 = 12$ ✓, $2 \\times 4 = 8$ ✓\n$3$ and $2$ share no common factor other than $1$ — fully simplified ✓\n\nMy lord, the ratio is simplified!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '化简比 = 两项同除以最大公因数。和约分原理完全相同！', en: 'Simplify ratio = divide both by HCF. Exact same principle as simplifying fractions!' }, formula: '$a:b = \\frac{a}{\\text{HCF}}:\\frac{b}{\\text{HCF}}$', tips: [{ zh: '荀彧提示：化简比和约分是一回事——Unit 0 学的 HCF 在这里又用上了！', en: 'Xun Yu Tip: Simplifying ratios IS simplifying fractions — the HCF from Unit 0 comes back!' }] },
    storyConsequence: { correct: { zh: '精简军令——比例搞定！做得漂亮！', en: 'Simplify Orders — Well done!' }, wrong: { zh: '比例没算对…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 726, grade: 7, unitId: 2, order: 6,
    unitTitle: { zh: "Unit 2: 粮草调度与比例", en: "Unit 2: Logistics & Ratios" },
    topic: 'Algebra', type: 'RATIO',
    title: { zh: '战利分配', en: 'Sharing War Spoils' },
    skillName: { zh: '按比分配术', en: 'Dividing in a Ratio' },
    skillSummary: { zh: '按比例分配：先算总份数，再算每份值，最后乘以各自份数', en: 'Divide in ratio: total parts first, then value per part, then multiply' },
    story: { zh: '攻城胜利后缴获 {total} 金！按功劳 {a}:{b} 分给前锋营和主力营。前锋营虽然人少但冲在最前面，应该分到多少？', en: 'After the siege, {total} gold is captured! Share between vanguard and main army in ratio {a}:{b}. The vanguard charged first — how much do they get?' },
    description: { zh: '把总数按比例分配，求较小份。', en: 'Divide the total in the given ratio. Find the smaller share.' },
    data: { a: 2, b: 3, total: 120, answer: 48, mode: 'divide', generatorType: 'RATIO_Y7_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-1.11-02', sectionId: 'number',
        tutorialSteps: [
      { text: { zh: '曹操：战利品按比分配——比例公式\n\n$a:b$ 分 $T$ 件，$A$ 分得 $\\frac{a}{a+b} \times T$，$B$ 分得 $\\frac{b}{a+b} \times T$。总份数 $= a + b$，每份价值 $= T \div (a+b)$！', en: 'Cao Cao: Divide loot by ratio — ratio sharing formula\n\nIn ratio $a:b$ sharing $T$ items: $A$ gets $\\frac{a}{a+b} \times T$, $B$ gets $\\frac{b}{a+b} \times T$. Total parts $= a + b$, value per part $= T \div (a+b)$!' }, highlightField: 'ans' },
      { text: { zh: '曹操：三步走\n1. 求总份数 $a + b$\n2. 求每份 = 总量 $\div$ 总份数\n3. 乘以各自份数得答案', en: 'Cao Cao: Three steps\n1. Find total parts $a + b$\n2. Find value per part = total $\div$ total parts\n3. Multiply each share by their portion count' }, highlightField: 'ans' },
      { text: { zh: '曹操：读取数据（假设按 3:2 分 60 件战利品，求第一份）\n\n总份数 $= 3 + 2 = 5$', en: 'Cao Cao: Read the data (e.g. split 60 items in ratio 3:2, find first share)\n\nTotal parts $= 3 + 2 = 5$' }, highlightField: 'ans' },
      { text: { zh: '曹操：求每份\n$$60 \div 5 = 12 \text{ 件/份}$$', en: 'Cao Cao: Find value per part\n$$60 \div 5 = 12 \\text{ items/part}$$' }, highlightField: 'ans' },
      { text: { zh: '曹操：求第一份\n$$3 \times 12 = 36$$\n\n第二份：$2 \times 12 = 24$', en: 'Cao Cao: Find first share\n$$3 \\times 12 = 36$$\n\nSecond share: $2 \\times 12 = 24$' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n$36 + 24 = 60$ ✓（两份加起来等于总量）\n$36 : 24 = 3 : 2$ ✓（比例正确）', en: 'Cao Cao: Verify\n$36 + 24 = 60$ ✓ (shares sum to total)\n$36 : 24 = 3 : 2$ ✓ (ratio correct)' }, highlightField: 'ans' },
    ],
    storyConsequence: {
      correct: { zh: '曹操：分配公正！前锋 48 金，主力 72 金——军心大振！', en: 'Cao Cao: "Fair distribution! Vanguard 48, main 72 — morale soars!"' },
      wrong: { zh: '曹操：分配不均，前锋将士不服...重新算！', en: 'Cao Cao: "Unfair split — vanguard soldiers revolt! Recalculate!"' },
    },
    secret: { concept: { zh: '按比分配三步：总份数→每份值→各自乘。这连接了除法、乘法和比例三个技能！', en: 'Divide in ratio: total parts → value per part → multiply each. This connects division, multiplication, and ratios!' }, formula: { zh: '$\\text{份额} = \\text{总数} \\times \\frac{\\text{自己的份数}}{\\text{总份数}}$', en: '$\\text{Share} = \\text{Total} \\times \\frac{\\text{own parts}}{\\text{total parts}}$' }, tips: [{ zh: '曹操提示：功劳大的多分——但得算公平！', en: 'Cao Cao Tip: More merit, more reward — but it must be fair!' }] }
  },
  {
    id: 731, grade: 7, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 关隘与角度", en: "Unit 3: Passes & Angles" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '据守虎牢关', en: 'Defending Hulao Pass' },
    skillName: { zh: '补角洞察术', en: 'Supplementary Angles' },
    skillSummary: { zh: '补角之和为 180°', en: 'Supplementary angles sum to 180°' },
    story: { zh: '虎牢关地势险要。已知城墙一侧角度为 ${angle}^\\circ$，求其补角 $x$ 以布置弩床。', en: 'Hulao Pass is steep. One side angle is ${angle}^\\circ$, find its supplementary angle $x$ for ballista placement.' },
    description: { zh: '计算补角：$180 - {angle} = x$。', en: 'Calculate supplementary angle: $180 - {angle} = x$.' },
    data: { angle: 120, total: 180, generatorType: 'ANGLES_RANDOM' }, difficulty: 'Easy', reward: 80,
    storyConsequence: {
      correct: { zh: '弩床角度精确，万箭齐发，敌军溃败！虎牢关固若金汤！', en: 'Perfect angle! Arrows rain down, the enemy retreats! Hulao Pass holds firm!' },
      wrong: { zh: '角度偏差，箭阵出现盲区...敌军趁虚而入，需要重新布防！', en: 'Angle miscalculated, a gap in the arrow coverage... the enemy breaks through! Reposition needed!' },
    },
    kpId: 'kp-4.6-01', sectionId: 'geometry',
    discoverSteps: [
      {
        prompt: { zh: '站在城墙上看——城墙是一条直线。\n你觉得一条直线展开是多少度？', en: 'Standing on the wall — the wall is a straight line.\nHow many degrees is a straight line?' },
        type: 'choice',
        choices: [
          { zh: '$180°$（半圈）', en: '$180°$ (half turn)' },
          { zh: '$360°$（一整圈）', en: '$360°$ (full turn)' },
          { zh: '$90°$（直角）', en: '$90°$ (right angle)' },
        ],
        onCorrect: { zh: '你发现了！一条直线 = $180°$。\n如果城墙一侧是 $120°$，那另一侧就是 $180° - 120° = 60°$。\n两个角加起来 = $180°$，这就叫"补角"。', en: 'You got it! A straight line = $180°$.\nIf one side of the wall is $120°$, the other is $180° - 120° = 60°$.\nTwo angles summing to $180°$ are called "supplementary".' },
        onWrong: { zh: '想一想：一整圈是 $360°$，半圈就是 $180°$。\n直线就是"刚好走了半圈"，所以是 $180°$。', en: 'Think: a full turn is $360°$, half is $180°$.\nA straight line is "exactly half a turn", so $180°$.' },
        onSkip: { zh: '没关系——一条直线 = $180°$。记住这个，后面就好办了。', en: 'No worries — a straight line = $180°$. Remember this and the rest is easy.' },
      },
    ],
    tutorialSteps: [
      {
        text: { zh: '吕布：城墙是一条直线。先搞清楚——一条直线是多少度？', en: 'Lu Bu: "The wall is a straight line. First — how many degrees is a straight line?"' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布：两个角加起来等于 $180°$，就叫互为"补角"', en: 'Lu Bu: "Two angles summing to $180°$ are called supplementary"' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布：城墙一侧 ${angle}°$，另一侧 $x$。方程：${angle} + x = 180$', en: 'Lu Bu: "Wall: one side ${angle}°$, other $x$. Equation: ${angle} + x = 180$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布：两边同时减 {angle}：$x = 180 - {angle} = {ans}$', en: 'Lu Bu: "Subtract {angle}: $x = 180 - {angle} = {ans}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布：验算：${angle} + {ans} = 180$ ✓ 弩床仰角 ${ans}°$，万箭齐发！', en: 'Lu Bu: "Verify: ${angle} + {ans} = 180$ ✓ Ballista ${ans}°$ — fire!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布：规律——一个角越大，它的补角越小。两个数加起来必须是 $180$', en: 'Lu Bu: "Pattern: bigger angle = smaller supplement. Must sum to $180$"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '补角之和为 $180^\\circ$。', en: 'Supplementary angles sum to $180^\\circ$.' }, formula: '$x + y = 180^\\circ$', tips: [{ zh: '吕布提示：角度不对，箭矢难中！', en: "Lu Bu Tip: If the angle is wrong, the arrows won't hit!" }] }
  },
  {
    id: 732, grade: 7, unitId: 3, order: 2,
    unitTitle: { zh: "Unit 3: 关隘与角度", en: "Unit 3: Passes & Angles" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '交叉火力', en: 'Crossfire' },
    skillName: { zh: '余角洞察术', en: 'Complementary Angles' },
    skillSummary: { zh: '余角之和为 90°', en: 'Complementary angles sum to 90°' },
    story: { zh: '布置两座箭塔。已知两塔射击线成直角，其中一个角为 ${angle}^\\circ$。', en: 'Set up two arrow towers. Their lines form a right angle, one angle is ${angle}^\\circ$.' },
    description: { zh: '计算余角 $x$：${total} - {angle} = x$。', en: 'Calculate complementary angle $x$: ${total} - {angle} = x$.' },
    data: { angle: 35, total: 90, generatorType: 'ANGLES_RANDOM' }, difficulty: 'Easy', reward: 85,
    kpId: 'kp-4.6-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '高顺：两条射击线垂直，成直角。直角 = $90°$', en: 'Gao Shun: "Two firing lines perpendicular = right angle = $90°$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺：两个角加起来 = $90°$，叫互为"余角"', en: 'Gao Shun: "Two angles summing to $90°$ are complementary"' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺：一角 ${angle}°$，方程：${angle} + x = 90$', en: 'Gao Shun: "One angle ${angle}°$, equation: ${angle} + x = 90$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺：两边减 {angle}：$x = 90 - {angle} = {ans}$', en: 'Gao Shun: "Subtract {angle}: $x = 90 - {angle} = {ans}$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺：验算：${angle} + {ans} = 90$ ✓ 交叉火力 ${ans}°$，陷阵营出击！', en: 'Gao Shun: "Verify: ${angle} + {ans} = 90$ ✓ Crossfire ${ans}°$!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺：一眼分清——$180°$ 是补角（"补"笔画多，数字大），$90°$ 是余角（"余"笔画少，数字小）', en: 'Gao Shun: "Quick tip: Supplementary = Straight line = $180°$. Complementary = Corner (right angle) = $90°$"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '余角之和为 $90^\\circ$。', en: 'Complementary angles sum to $90^\\circ$.' }, formula: '$x + y = 90^\\circ$', tips: [{ zh: '高顺提示：陷阵营，角度必争！', en: 'Gao Shun Tip: For the Camp Crushers, every angle counts!' }] },
    storyConsequence: { correct: { zh: '交叉火力——角度完美！做得漂亮！', en: 'Crossfire — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 733, grade: 7, unitId: 3, order: 3,
    unitTitle: { zh: "Unit 3: 关隘与角度", en: "Unit 3: Passes & Angles" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '八卦阵位', en: 'Eight Trigrams Position' },
    skillName: { zh: '角度推演术', en: 'Angle Deduction' },
    skillSummary: { zh: '已知一角求其补角或余角', en: 'Find supplementary or complementary angle' },
    story: { zh: '诸葛亮布置八卦阵。阵眼向东射出一道令旗，方向角 ${angle}°$；另一道令旗与它正好成一条直线。', en: 'Zhuge Liang sets up the Eight Trigrams. A command flag points east at ${angle}°$; another flag forms a straight line with it.' },
    description: { zh: '求另一个角 $x$。', en: 'Find the other angle $x$.' },
    data: { angle: 45, total: 180, generatorType: 'ANGLES_RANDOM' }, difficulty: 'Medium', reward: 90,
    kpId: 'kp-4.6-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮：为什么两个角加起来是 $180°$？\n一条直线是"半圈"——从一个方向到正对面，刚好 $180°$。\n直线上的两个角就像切蛋糕——不管怎么切，两块加起来永远是半个圆！', en: 'Zhuge Liang: "Why do the two angles sum to $180°$?\nA straight line is \'half a turn\' — exactly $180°$.\nTwo angles on a line are like cutting a cake — however you cut, both pieces always make a semicircle!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：两道令旗合成一条直线——直线两侧角加起来 $= 180°$\n\n一角 ${angle}°$，方程：${angle} + x = 180$', en: 'Zhuge Liang: "Two flags form a straight line — angles on a line sum to $180°$\n\nOne angle ${angle}°$, equation: ${angle} + x = 180$"' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：解方程\n$x = 180 - {angle}$\n用总度数减去已知角。', en: 'Zhuge Liang: "Solve\n$x = 180 - {angle}$\nSubtract the known angle from the total."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：答案\n$x = {ans}°$\n令旗方向角确认！', en: 'Zhuge Liang: "Answer\n$x = {ans}°$\nFlag direction confirmed!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：验算\n${angle} + {ans} = 180$ ✓ 两角之和确实等于 $180°$！', en: 'Zhuge Liang: "Verify\n${angle} + {ans} = 180$ ✓ Sum of both angles is indeed $180°$!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮：自检规则——锐角（$< 90°$）配钝角（$> 90°$）。如果两个都是锐角，一定算错了！\n八卦阵布阵完毕，诸葛亮满意地点了点头。', en: 'Zhuge Liang: "Self-check: acute ($< 90°$) pairs with obtuse ($> 90°$). If both are acute, something is wrong!\nThe Eight Trigrams formation is set — Zhuge Liang nods approvingly."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '补角的实际应用：方向角合成一条直线，互为补角。', en: 'Practical use of supplementary angles: direction angles forming a straight line are supplementary.' }, formula: '$x = 180° - y$', tips: [{ zh: '诸葛亮提示：阵法变幻，皆在术数。', en: 'Zhuge Tip: The changes in the formation are all in the numbers.' }] },
    storyConsequence: { correct: { zh: '八卦阵位——角度完美！做得漂亮！', en: 'Eight Trigrams Position — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 3 续: 三角形内角 & 周角 ---
  {
    id: 734, grade: 7, unitId: 3, order: 4,
    unitTitle: { zh: "Unit 3: 关隘与角度", en: "Unit 3: Passes & Angles" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '三角旗阵', en: 'Triangular Banner' },
    skillName: { zh: '三角内角和', en: 'Triangle Angle Sum' },
    skillSummary: { zh: '三角形三个内角之和 = 180°', en: 'The three interior angles of a triangle sum to 180°' },
    story: { zh: '关羽布置三角旗阵，需要计算旗帜的第三个角度。三角形内角和永远是 180°！', en: 'Guan Yu sets up a triangular banner formation. The angles in a triangle always sum to 180°!' },
    description: { zh: '求三角形的第三个角。', en: 'Find the missing angle in the triangle.' },
    data: { angle: 110, total: 180, a1: 60, a2: 50, generatorType: 'ANGLES_TRIANGLE_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-4.3-01', sectionId: 'geometry',
        tutorialSteps: [
      { text: { zh: '关羽：三角旗阵缺角——三角形内角和！\n\n三角形任意三个角加起来永远是 $180°$。这是几何的铁律！知道两个角，第三个角 $= 180° -$ 已知两角之和。', en: 'Guan Yu: Missing angle in the triangular banner — triangle angle sum!\n\nThe three angles of any triangle always add up to $180°$. This is an iron law of geometry! Know two angles, find the third: $= 180° -$ sum of known angles.' }, highlightField: 'ans' },
      { text: { zh: '关羽：三角形内角和公式\n$$\\angle A + \\angle B + \\angle C = 180°$$\n\n适用于任何形状的三角形！', en: 'Guan Yu: Triangle angle sum formula\n$$\\angle A + \\angle B + \\angle C = 180°$$\n\nApplies to any triangle, any shape!' }, highlightField: 'ans' },
      { text: { zh: '关羽：读取数据\n已知两角：$60°$ 和 $50°$\n求第三角 $x$', en: 'Guan Yu: Read the data\nKnown angles: $60°$ and $50°$\nFind the third angle $x$' }, highlightField: 'ans' },
      { text: { zh: '关羽：建立方程\n$$60° + 50° + x = 180°$$\n$$110° + x = 180°$$', en: 'Guan Yu: Set up equation\n$$60° + 50° + x = 180°$$\n$$110° + x = 180°$$' }, highlightField: 'ans' },
      { text: { zh: '关羽：计算\n$$x = 180° - 110° = 70°$$', en: 'Guan Yu: Calculate\n$$x = 180° - 110° = 70°$$' }, highlightField: 'ans' },
      { text: { zh: '关羽：验算\n$$60° + 50° + 70° = 180° \\checkmark$$\n\n三角旗阵完美！', en: 'Guan Yu: Verify\n$$60° + 50° + 70° = 180° \\checkmark$$\n\nTriangular banner perfect!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '三角形内角和定理：任何三角形的三个内角之和 = 180°。', en: 'Triangle angle sum theorem: the three interior angles of any triangle sum to 180°.' }, formula: '$a + b + c = 180°$', tips: [{ zh: '关羽提示：三角旗阵，角度精准才能列阵如山！', en: 'Guan Yu Tip: Precise angles make an immovable formation!' }] },
    storyConsequence: { correct: { zh: '三角旗阵——角度完美！做得漂亮！', en: 'Triangular Banner — Well done!' }, wrong: { zh: '角度算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 735, grade: 7, unitId: 3, order: 5,
    unitTitle: { zh: "Unit 3: 关隘与角度", en: "Unit 3: Passes & Angles" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '瞭望全景', en: 'Watchtower Panorama' },
    skillName: { zh: '周角计算术', en: 'Angles at a Point' },
    skillSummary: { zh: '围绕一点的所有角之和 = 360°', en: 'All angles around a point sum to 360°' },
    story: { zh: '诸葛亮登上瞭望台，把四周分成几个监视区域。每个区域由不同的将领负责。已知其他区域的角度，只剩一个方向没有标注——那正是敌军最可能偷袭的方向！', en: 'Zhuge Liang climbs the watchtower and divides the surroundings into patrol sectors. Each sector is assigned to a general. All angles are marked except one — and that\'s exactly where the enemy is most likely to attack!' },
    description: { zh: '求围绕一点的未知角。', en: 'Find the missing angle around a point.' },
    data: { angle: 260, total: 360, angles: [120, 140], generatorType: 'ANGLES_POINT_RANDOM' }, difficulty: 'Easy', reward: 50,
    storyConsequence: {
      correct: { zh: '诸葛亮：好！$x$ 度方向正是敌军来路——立刻派赵云镇守此方！全方位无死角！', en: 'Zhuge Liang: "That $x°$ direction is the enemy\'s approach — send Zhao Yun to guard it immediately! Full 360° coverage, no blind spots!"' },
      wrong: { zh: '诸葛亮：角度算错了...那个方向留出了漏洞，敌军趁夜偷袭！重新计算！', en: 'Zhuge Liang: "Wrong angle... that gap left a blind spot. The enemy attacked at night! Recalculate!"' },
    },
    kpId: 'kp-4.3-02', sectionId: 'geometry',
        tutorialSteps: [
      { text: { zh: '诸葛亮：瞭望全景——一点周角是 $360°$！\n\n站在瞭望台转一整圈，看遍所有方向，转了 $360°$。一个点周围所有角之和 $= 360°$。知道几个区域，剩下的缺口就能算出！', en: 'Zhuge Liang: Full panoramic view — angles around a point sum to $360°$!\n\nStanding at the watchtower and turning a full circle covers all directions: $360°$. All angles around a point sum to $360°$. Know some sectors, calculate the remaining gap!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：周角公式\n$$\\text{所有角之和} = 360°$$\n\n求缺角：$x = 360° - \\text{已知角之和}$', en: 'Zhuge Liang: Angles around a point\n$$\\text{Sum of all angles} = 360°$$\n\nFind missing angle: $x = 360° -$ sum of known angles' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n已知区域：$120°$ 和 $140°$\n求剩余角 $x$', en: 'Zhuge Liang: Read the data\nKnown sectors: $120°$ and $140°$\nFind remaining angle $x$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：已知角之和\n$$120° + 140° = 260°$$', en: 'Zhuge Liang: Sum of known angles\n$$120° + 140° = 260°$$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：求缺角\n$$x = 360° - 260° = 100°$$', en: 'Zhuge Liang: Find missing angle\n$$x = 360° - 260° = 100°$$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$$120° + 140° + 100° = 360° \\checkmark$$\n\n全景覆盖无死角！', en: 'Zhuge Liang: Verify\n$$120° + 140° + 100° = 360° \\checkmark$$\n\nFull panoramic coverage, no blind spots!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '围绕一点的所有角加起来等于 360°（一整圈）。少一度都是防御漏洞！', en: 'Angles around a point sum to 360° (a full turn). Even 1° missing is a gap in defense!' }, formula: { zh: '$\\text{全部角之和} = 360°$', en: '$\\text{All angles sum} = 360°$' }, tips: [{ zh: '诸葛亮提示：三百六十度无死角，方可高枕无忧！', en: 'Zhuge Liang Tip: Full 360° coverage — only then can you sleep soundly!' }] }
  },
  // --- Year 7 Unit 3A: 战场地图·坐标篇 ---
  {
    id: 745, grade: 7, unitId: 3, order: 6,
    unitTitle: { zh: "Unit 3A: 战场地图·坐标篇", en: "Unit 3A: Battlefield Map — Coordinates" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '读图定位', en: 'Map Reading' },
    skillName: { zh: '坐标读写术', en: 'Reading Coordinates' },
    skillSummary: { zh: '坐标 (x, y)：先横后竖，右上为正', en: 'Coordinates (x, y): horizontal first, then vertical; right/up = positive' },
    story: { zh: '诸葛亮展开战场地图，上面标满了方格。"每个敌营都有一个坐标——先看横坐标（左右），再看纵坐标（上下）。读准坐标，才能精确打击！"', en: 'Zhuge Liang unfolds the battlefield map, covered in grid squares. "Every enemy camp has coordinates — read the x (horizontal) first, then y (vertical). Accurate coordinates mean precise strikes!"' },
    description: { zh: '读出目标位置的坐标 $(x, y)$。', en: 'Read the coordinates $(x, y)$ of the target.' },
    data: { targetX: 3, targetY: 5, mode: 'read', generatorType: 'COORDINATES_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-3.1-01', sectionId: 'geometry',
        tutorialSteps: [
      { text: { zh: '诸葛亮：读图定位——坐标是地图上的"地址"！\n\n战场地图上每个位置都有唯一坐标 $(x, y)$。$x$ 是横坐标（左右），$y$ 是纵坐标（上下）。先读 $x$，再读 $y$——先横后纵！', en: 'Zhuge Liang: Map reading — coordinates are the "address" on a map!\n\nEvery position on the battlefield map has a unique coordinate $(x, y)$. $x$ is horizontal (left-right), $y$ is vertical (up-down). Read $x$ first, then $y$ — across before up!' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：坐标轴规则\n$x > 0$: 右（正方向）\n$x < 0$: 左（负方向）\n$y > 0$: 上（正方向）\n$y < 0$: 下（负方向）\n\n原点 $(0, 0)$ 是中心！', en: 'Zhuge Liang: Coordinate axis rules\n$x > 0$: right (positive direction)\n$x < 0$: left (negative direction)\n$y > 0$: up (positive direction)\n$y < 0$: down (negative direction)\n\nOrigin $(0, 0)$ is the centre!' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：读取图形\n找到图上标记的点，先读 $x$ 轴的位置（从原点往右数）', en: 'Zhuge Liang: Read from the graph\nFind the marked point; read the $x$-axis position first (count right from origin)' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：读 $x$ 坐标\n从原点往右数 $3$ 格 → $x = 3$', en: 'Zhuge Liang: Read the $x$-coordinate\nCount $3$ units right from origin → $x = 3$' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：读 $y$ 坐标\n从原点往上数 $5$ 格 → $y = 5$\n\n答案：坐标 $(3, 5)$，$x = 3$', en: 'Zhuge Liang: Read the $y$-coordinate\nCount $5$ units up from origin → $y = 5$\n\nAnswer: coordinate $(3, 5)$, $x = 3$' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：验算\n从 $(0,0)$ 向右 $3$ 向上 $5$ 到达标记点 ✓\n\n敌营位置锁定！', en: 'Zhuge Liang: Verify\nFrom $(0,0)$ go right $3$ up $5$ to reach the marked point ✓\n\nEnemy camp location confirmed!' }, highlightField: 'x' },
    ],
    secret: { concept: { zh: '坐标系用 (x,y) 两个数字标记位置。x 是左右，y 是上下。原点 (0,0) 是起点。', en: 'The coordinate system uses (x,y) to mark positions. x = left/right, y = up/down. Origin (0,0) is the start.' }, formula: '$(x, y)$：先横后竖', tips: [{ zh: '诸葛亮提示：读图如读兵法——坐标不准，全盘皆输！', en: 'Zhuge Liang Tip: Reading maps is like reading strategy — wrong coordinates mean total defeat!' }] },
    storyConsequence: { correct: { zh: '读图定位——坐标精准！做得漂亮！', en: 'Map Reading — Well done!' }, wrong: { zh: '坐标定位有误…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 746, grade: 7, unitId: 3, order: 7,
    unitTitle: { zh: "Unit 3A: 战场地图·坐标篇", en: "Unit 3A: Battlefield Map — Coordinates" },
    topic: 'Geometry', type: 'COORDINATES',
    title: { zh: '四象限侦察', en: 'Four Quadrant Recon' },
    skillName: { zh: '负坐标辨识术', en: 'Negative Coordinates' },
    skillSummary: { zh: '坐标可以是负数——左边和下面是负的，四个象限都要能定位', en: 'Coordinates can be negative — left/down are negative, locate in all four quadrants' },
    story: { zh: '赵云奉命侦察四个方向的敌营。有的在右上（正正），有的在左下（负负）。坐标有正有负，四个象限都不能漏！', en: 'Zhao Yun scouts enemy camps in all directions. Some are top-right (+,+), others bottom-left (−,−). Coordinates can be positive or negative — cover all four quadrants!' },
    description: { zh: '读出含负数的坐标。', en: 'Read coordinates with negative values.' },
    data: { targetX: -3, targetY: 4, mode: 'negative', generatorType: 'COORDINATES_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-3.1-02', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云：四象限侦察——负坐标代表什么方向？\n\n坐标轴把地图分成四个象限。$x < 0$ 表示**左**，$y > 0$ 表示**上**。点 $(-3, 4)$ 在左上方的第二象限——这是包抄的最佳位置！', en: 'Zhao Yun: Four-quadrant scouting — what direction do negative coordinates mean?\n\nThe axes divide the map into four quadrants. $x < 0$ means **left**, $y > 0$ means **up**. Point $(-3, 4)$ is in the upper-left second quadrant — perfect position for flanking!' }, highlightField: 'x' },
      { text: { zh: '赵云：四象限速记\n第一象限：$(+, +)$ 右上\n第二象限：$(-, +)$ 左上\n第三象限：$(-, -)$ 左下\n第四象限：$(+, -)$ 右下', en: 'Zhao Yun: Four quadrants quick reference\nQ1: $(+, +)$ upper right\nQ2: $(-, +)$ upper left\nQ3: $(-, -)$ lower left\nQ4: $(+, -)$ lower right' }, highlightField: 'x' },
      { text: { zh: '赵云：读取图形\n找到图上标记的点，先判断在哪个象限，再数格子。', en: 'Zhao Yun: Read from the graph\nFind the marked point; identify the quadrant first, then count squares.' }, highlightField: 'x' },
      { text: { zh: '赵云：读 $x$ 坐标\n点在原点**左边** $3$ 格 → $x = -3$\n（向左 = 负方向）', en: 'Zhao Yun: Read the $x$-coordinate\nPoint is $3$ squares to the **left** of origin → $x = -3$\n(Going left = negative direction)' }, highlightField: 'x' },
      { text: { zh: '赵云：读 $y$ 坐标\n点在原点**上方** $4$ 格 → $y = 4$\n\n答案：坐标 $(-3, 4)$，$x = -3$', en: 'Zhao Yun: Read the $y$-coordinate\nPoint is $4$ squares **above** origin → $y = 4$\n\nAnswer: coordinate $(-3, 4)$, $x = -3$' }, highlightField: 'x' },
      { text: { zh: '赵云：验算\n$(-3, 4)$ 在第二象限（左上）✓\n从原点向左 $3$ 向上 $4$ 到达标记点 ✓\n\n敌营位置锁定，包抄出发！', en: 'Zhao Yun: Verify\n$(-3, 4)$ is in Q2 (upper left) ✓\nFrom origin: left $3$ up $4$ reaches the marked point ✓\n\nEnemy location confirmed — flanking begins!' }, highlightField: 'x' },
    ],
    storyConsequence: {
      correct: { zh: '赵云：坐标精确！敌营位置锁定，可以包抄！', en: 'Zhao Yun: "Precise coordinates! Enemy camp located — ready to flank!"' },
      wrong: { zh: '赵云：坐标搞反了...侦察兵跑错方向！重新定位！', en: 'Zhao Yun: "Coordinates mixed up... scouts went the wrong way! Relocate!"' },
    },
    secret: { concept: { zh: '四个象限由 x 和 y 的正负决定。负坐标 = 反方向。', en: 'Four quadrants depend on signs of x and y. Negative = opposite direction.' }, formula: 'I$(+,+)$ II$(-,+)$ III$(-,-)$ IV$(+,-)$', tips: [{ zh: '赵云提示：正负不分，敌友不明！', en: 'Zhao Yun Tip: Mix up signs and you can\'t tell friend from foe!' }] }
  },
  // --- Year 7 Unit 4: 行军数列·序列篇 ---
  {
    id: 741, grade: 7, unitId: 4, order: 1,
    unitTitle: { zh: "Unit 4: 行军数列·序列篇", en: "Unit 4: March Sequence — Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '增兵步伐', en: 'Troop Buildup Pattern' },
    skillName: { zh: '数列续写术', en: 'Sequence Next Term' },
    skillSummary: { zh: '找规律：每次加多少？下一个就再加那么多', en: 'Find the pattern: what\'s added each time? Add it again for the next term' },
    story: { zh: '刘备每天招募新兵，人数呈规律增长。观察规律，预测明天的新兵人数！', en: 'Liu Bei recruits daily in a pattern. Observe and predict tomorrow\'s count!' },
    description: { zh: '找出数列的下一项。', en: 'Find the next term in the sequence.' },
    data: { a1: 3, d: 4, n: 5, mode: 'next', generatorType: 'SEQUENCE_Y7_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-2.7-01', sectionId: 'algebra',
        tutorialSteps: [
      { text: { zh: '刘备：增兵步伐——这是等差数列！\n\n每天比前天多招 $4$ 人，就是"公差 $d = 4$"的等差数列。数列的每一项都比上一项多一个固定值——这个固定值就是"公差"。', en: 'Liu Bei: Growing army — this is an arithmetic sequence!\n\nRecruiting 4 more each day than the day before means the common difference $d = 4$. Each term is exactly one fixed value more than the previous — that fixed value is the "common difference".' }, highlightField: 'ans' },
      { text: { zh: '刘备：等差数列识别方法\n计算相邻两项的差：$a_2 - a_1 = a_3 - a_2 = \\ldots = d$\n\n差值恒定 → 等差数列！', en: 'Liu Bei: How to identify arithmetic sequences\nCalculate differences between consecutive terms: $a_2 - a_1 = a_3 - a_2 = \\ldots = d$\n\nConstant difference → arithmetic sequence!' }, highlightField: 'ans' },
      { text: { zh: '刘备：读取数据\n每天增加的人数相同，差值 $d = 4$。\n\n写出数列：$a_1, a_1+4, a_1+8, \\ldots$', en: 'Liu Bei: Read the data\nThe same number of recruits added each day, difference $d = 4$.\n\nSequence: $a_1, a_1+4, a_1+8, \\ldots$' }, highlightField: 'ans' },
      { text: { zh: '刘备：验证公差\n连续几天之差都等于 $4$——确认是公差！', en: 'Liu Bei: Verify common difference\nDifferences between consecutive days all equal $4$ — confirmed common difference!' }, highlightField: 'ans' },
      { text: { zh: '刘备：答案\n公差 $d = 4$\n\n每天比前天多招 $4$ 人——增兵有序！', en: 'Liu Bei: Answer\nCommon difference $d = 4$\n\nRecruiting 4 more each day — orderly reinforcement!' }, highlightField: 'ans' },
      { text: { zh: '刘备：验算\n用通项公式验证第 $n$ 项：$a_n = a_1 + (n-1) \times 4$\n\n如果 $a_1 = 5$，第 3 天 $= 5 + 2 \times 4 = 13$，确实比第 2 天（$9$）多 $4$ ✓', en: 'Liu Bei: Verify\nUse nth term formula to verify: $a_n = a_1 + (n-1) \\times 4$\n\nIf $a_1 = 5$, day 3 $= 5 + 2 \\times 4 = 13$, indeed $4$ more than day 2 ($9$) ✓' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '等差数列：每项与前一项的差（公差）恒定。下一项 = 最后一项 + 公差。', en: 'Arithmetic sequence: the difference between consecutive terms is constant. Next = last + common difference.' }, formula: { zh: '$\\text{下一项} = \\text{末项} + d$', en: '$\\text{Next term} = \\text{Last term} + d$' }, tips: [{ zh: '刘备提示：找到规律，就能预见未来！', en: 'Liu Bei Tip: Find the pattern, predict the future!' }] },
    storyConsequence: { correct: { zh: '增兵步伐——数列过关！做得漂亮！', en: 'Troop Buildup Pattern — Well done!' }, wrong: { zh: '数列公式用错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 742, grade: 7, unitId: 4, order: 2,
    unitTitle: { zh: "Unit 4: 行军数列·序列篇", en: "Unit 4: March Sequence — Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '远征推算', en: 'Expedition Projection' },
    skillName: { zh: '通项公式术', en: 'Nth Term Formula' },
    skillSummary: { zh: '第 n 项 = 首项 + (n-1) × 公差', en: 'nth term = first term + (n-1) × common difference' },
    story: { zh: '赵云远征在外，需要推算第 n 天的补给量。用通项公式直接算！', en: 'Zhao Yun is on expedition — calculate the supply for day n using the formula!' },
    description: { zh: '用通项公式求第 $n$ 项。', en: 'Use the nth term formula to find term $n$.' },
    data: { a1: 5, d: 3, n: 8, mode: 'nth', generatorType: 'SEQUENCE_Y7_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-2.7-02', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '赵云：远征第 8 天要多少补给？\n\n如果每天数出来，要数 8 次——太麻烦！通项公式让我们直接跳到第 $n$ 天。规律是：每天补给等差增加，这叫**等差数列**。', en: 'Zhao Yun: How much supply is needed on day 8 of the expedition?\n\nCounting day by day takes 8 steps — too slow! The nth term formula lets us jump directly to day $n$. The pattern: supplies increase by a fixed amount each day — this is an **arithmetic sequence**.' }, highlightField: 'ans' },
      { text: { zh: '赵云：等差数列通项公式\n$$a_n = a_1 + (n-1) \\times d$$\n其中：$a_1$ = 第 1 项，$d$ = 公差（每次增加的量），$n$ = 项数\n\n代入一次，直接得答案！', en: 'Zhao Yun: Arithmetic sequence nth term formula\n$$a_n = a_1 + (n-1) \\times d$$\nWhere: $a_1$ = first term, $d$ = common difference, $n$ = term number\n\nSubstitute once, get the answer directly!' }, highlightField: 'ans' },
      { text: { zh: '赵云：读取数据\n首项 $a_1 = 5$，公差 $d = 3$，求第 $n = 8$ 项。\n\n每天比前一天多 $3$ 石。', en: 'Zhao Yun: Read the data\nFirst term $a_1 = 5$, common difference $d = 3$, find term $n = 8$.\n\nEach day adds 3 more units than the day before.' }, highlightField: 'ans' },
      { text: { zh: '赵云：代入公式\n$$a_8 = 5 + (8-1) \\times 3 = 5 + 7 \\times 3$$', en: 'Zhao Yun: Substitute into formula\n$$a_8 = 5 + (8-1) \\times 3 = 5 + 7 \\times 3$$' }, highlightField: 'ans' },
      { text: { zh: '赵云：计算\n$$5 + 7 \\times 3 = 5 + 21 = 26$$\n\n第 8 天补给量 $= 26$ 石', en: 'Zhao Yun: Calculate\n$$5 + 7 \\times 3 = 5 + 21 = 26$$\n\nDay 8 supply $= 26$ units' }, highlightField: 'ans' },
      { text: { zh: '赵云：验算（逐项列举）\n$5, 8, 11, 14, 17, 20, 23, 26$\n第 8 项 $= 26 \\checkmark$\n\n远征补给计划完成！', en: 'Zhao Yun: Verify (list the terms)\n$5, 8, 11, 14, 17, 20, 23, 26$\nTerm 8 $= 26 \\checkmark$\n\nExpedition supply plan complete!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '通项公式让你不必逐项数，直接跳到第 n 项。', en: 'The nth term formula lets you jump directly to any term without counting one by one.' }, formula: '$a_n = a_1 + (n-1)d$', tips: [{ zh: '赵云提示：兵贵神速，公式比逐个数快！', en: 'Zhao Yun Tip: Speed matters — formulas beat counting one by one!' }] },
    storyConsequence: { correct: { zh: '远征推算——数列过关！做得漂亮！', en: 'Expedition Projection — Well done!' }, wrong: { zh: '数列公式用错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 4 续: 递减数列（跨单元：负数+数列）---
  {
    id: 743, grade: 7, unitId: 4, order: 3,
    unitTitle: { zh: "Unit 4: 行军数列·序列篇", en: "Unit 4: March Sequence — Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '粮草日减', en: 'Dwindling Supplies' },
    skillName: { zh: '递减数列术', en: 'Decreasing Sequences' },
    skillSummary: { zh: '公差为负数——每一项比前一项少，数列在递减', en: 'Negative common difference — each term is smaller, sequence decreases' },
    story: { zh: '远征军的粮草每天消耗固定量。第一天有 {a1} 石，每天变化 {d} 石。第 {n} 天还剩多少？什么时候彻底断粮？', en: 'The expedition army consumes fixed grain daily. Starting with {a1} units, changing by {d} each day. How much on day {n}? When do supplies run out?' },
    description: { zh: '递减数列：求第 $n$ 项。', en: 'Decreasing sequence: find term $n$.' },
    data: { a1: 30, d: -3, n: 10, mode: 'nth', generatorType: 'SEQUENCE_Y7_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-2.7-03', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '赵云：军粮每天减少——这也是等差数列！\n\n不只有增加的数列，减少也是等差。公差 $d < 0$ 时数列递减。第 10 天还剩多少粮？倒计时开始！', en: 'Zhao Yun: Grain depletes daily — this is also an arithmetic sequence!\n\nSequences don\'t only increase; decreasing is arithmetic too. When $d < 0$, the sequence decreases. How much grain on day 10? The countdown begins!' }, highlightField: 'ans' },
      { text: { zh: '赵云：递减数列公式——完全一样！\n$$a_n = a_1 + (n-1) \\times d$$\n\n只是 $d$ 是负数。每天"加"一个负数就是减少。', en: 'Zhao Yun: Decreasing sequence — same formula!\n$$a_n = a_1 + (n-1) \\times d$$\n\nJust with $d$ as a negative number. Adding a negative each day means decreasing.' }, highlightField: 'ans' },
      { text: { zh: '赵云：读取数据\n首日 $a_1 = 30$ 石，每天减少 $d = -3$ 石，求第 $n = 10$ 天。', en: 'Zhao Yun: Read the data\nDay 1: $a_1 = 30$ units, daily change: $d = -3$ units, find term $n = 10$.' }, highlightField: 'ans' },
      { text: { zh: '赵云：代入公式\n$$a_{10} = 30 + (10-1) \\times (-3) = 30 + 9 \\times (-3)$$', en: 'Zhao Yun: Substitute into formula\n$$a_{10} = 30 + (10-1) \\times (-3) = 30 + 9 \\times (-3)$$' }, highlightField: 'ans' },
      { text: { zh: '赵云：计算\n$$30 + 9 \\times (-3) = 30 - 27 = 3$$\n\n第 10 天剩 $3$ 石——危险！', en: 'Zhao Yun: Calculate\n$$30 + 9 \\times (-3) = 30 - 27 = 3$$\n\nDay 10 has only $3$ units left — danger!' }, highlightField: 'ans' },
      { text: { zh: '赵云：验算（关键几天）\n第 1 天: 30 → 第 4 天: 21 → 第 7 天: 12 → 第 10 天: $3 \\checkmark$\n\n断粮警报！第 11 天将归零！', en: 'Zhao Yun: Verify (key days)\nDay 1: 30 → Day 4: 21 → Day 7: 12 → Day 10: $3 \\checkmark$\n\nSupply alert! Day 11 will be zero!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '公差为负数时数列递减。公式不变：$a_n = a_1 + (n-1)d$，只是 $d < 0$。', en: 'Negative common difference = decreasing sequence. Same formula, just $d < 0$.' }, formula: '$a_n = a_1 + (n-1)d,\\quad d < 0$', tips: [{ zh: '赵云提示：知道粮草何时耗尽，才能提前安排补给线！', en: 'Zhao Yun Tip: Know when supplies run out to plan the supply line ahead!' }] },
    storyConsequence: { correct: { zh: '粮草消耗精准预测，补给线及时安排！', en: 'Supply depletion predicted accurately — resupply arranged in time!' }, wrong: { zh: '粮草耗尽时间算错，大军断粮…', en: 'Supply exhaustion miscalculated — army runs out of food...' } },
  },
  // --- Year 7 Unit 5: 估算篇 ---
  {
    id: 751, grade: 7, unitId: 5, order: 1,
    unitTitle: { zh: "Unit 5: 斥候估算·近似值篇", en: "Unit 5: Scout Estimation — Rounding" },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '斥候报数', en: 'Scout Headcount' },
    skillName: { zh: '四舍五入术', en: 'Rounding Numbers' },
    skillSummary: { zh: '看要舍去的那一位：0-4 舍，5-9 入', en: 'Look at the digit to remove: 0-4 round down, 5-9 round up' },
    story: { zh: '斥候回报敌军人数，但不需要精确数字——四舍五入到大概即可！', en: 'Scouts report enemy numbers — an approximate round figure is enough!' },
    description: { zh: '四舍五入。', en: 'Round the number.' },
    data: { n: 347, place: 10, answer: 350, generatorType: 'ESTIMATION_ROUND_RANDOM' }, difficulty: 'Easy', reward: 40,
    kpId: 'kp-1.9-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：斥候报数为什么要四舍五入？\n\n战场上不需要精确到个位——"347 人"和"350 人"在战术上没区别，但 350 更容易记忆和传递。四舍五入让数字简洁，利于快速决策！', en: 'Zhuge Liang: Why do scouts round numbers?\n\nOn the battlefield, exact figures aren\'t needed — "347 soldiers" and "350 soldiers" are tactically the same, but 350 is easier to remember and relay. Rounding keeps numbers clean for fast decisions!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：四舍五入规则\n四舍：要舍去的那一位数字 $0{-}4$ → 直接舍掉\n五入：要舍去的那一位数字 $5{-}9$ → 前一位进 $1$\n\n关键：**看要舍去的那位**，不是最高位！', en: 'Zhuge Liang: Rounding rule\nRound down: the digit being removed is $0{-}4$ → just drop it\nRound up: the digit being removed is $5{-}9$ → add 1 to the previous digit\n\nKey: **look at the digit being removed**, not the highest digit!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n$347$，四舍五入到十位。\n\n要舍去的是个位（$7$），十位会受影响。', en: 'Zhuge Liang: Read the data\n$347$, round to the nearest 10.\n\nThe digit being removed is the ones digit ($7$); the tens digit will be affected.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：判断——个位是 7\n$$347: \\quad \\text{十位} = 4, \\quad \\text{个位} = 7$$\n个位 $7 \\geq 5$ → **五入**，十位进 1：$4 \\to 5$', en: 'Zhuge Liang: Check — ones digit is 7\n$$347: \\quad \\text{tens} = 4, \\quad \\text{ones} = 7$$\nOnes digit $7 \\geq 5$ → **round up**, tens digit increases: $4 \\to 5$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：结果\n$$347 \\approx 350$$\n\n个位变为 $0$，十位从 $4$ 进到 $5$。', en: 'Zhuge Liang: Result\n$$347 \\approx 350$$\n\nOnes becomes $0$, tens rounds up from $4$ to $5$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$347$ 在 $340$ 和 $350$ 之间。\n$347 - 340 = 7$，$350 - 347 = 3$\n\n离 $350$ 更近 → 四舍五入到 $350 \\checkmark$', en: 'Zhuge Liang: Verify\n$347$ is between $340$ and $350$.\n$347 - 340 = 7$, $350 - 347 = 3$\n\nCloser to $350$ → rounds to $350 \\checkmark$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '四舍五入：看要去掉的那一位，0-4 不变，5-9 前一位加 1。', en: 'Rounding: look at the digit being removed. 0-4 stays, 5-9 rounds up.' }, formula: { zh: '$\\text{看下一位：} < 5 \\text{ 舍，} \\geq 5 \\text{ 入}$', en: '$\\text{Check next digit: } < 5 \\text{ round down, } \\geq 5 \\text{ round up}$' }, tips: [{ zh: '诸葛亮提示：战场上要的是大局观，不纠结零头！', en: 'Zhuge Liang Tip: On the battlefield, focus on the big picture!' }] },
    storyConsequence: { correct: { zh: '斥候报数——估算精准！做得漂亮！', en: 'Scout Headcount — Well done!' }, wrong: { zh: '估算偏差太大…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 752, grade: 7, unitId: 5, order: 2,
    unitTitle: { zh: "Unit 5: 斥候估算·近似值篇", en: "Unit 5: Scout Estimation — Rounding" },
    topic: 'Algebra', type: 'ESTIMATION',
    title: { zh: '大军估数', en: 'Army Estimate' },
    skillName: { zh: '大数估算术', en: 'Large Number Rounding' },
    skillSummary: { zh: '四舍五入到百位或千位', en: 'Round to the nearest hundred or thousand' },
    story: { zh: '大军压境，需要快速估算双方兵力差距。大数估算派上用场！', en: 'With a massive army approaching, quickly estimate the force difference!' },
    description: { zh: '四舍五入到更高位。', en: 'Round to a higher place value.' },
    data: { n: 3847, place: 100, answer: 3800, generatorType: 'ESTIMATION_ROUND_RANDOM' }, difficulty: 'Medium', reward: 50,
    kpId: 'kp-1.9-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：大军压境——百位精度够用！\n\n双方兵力 $3847$ 和 $3800$ 在战略上没区别。四舍五入到百位，方便快速比较。数字越大，需要的精度越低——战场决策要快！', en: 'Zhuge Liang: Massive army approaching — nearest hundred is precise enough!\n\nForce sizes of $3847$ and $3800$ are strategically equivalent. Rounding to the nearest hundred enables quick comparison. Larger numbers need less precision — battlefield decisions must be fast!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：四舍五入到百位\n关键：看**十位**（百位右边那一位）\n十位 $0{-}4$ → 百位不变，后面变 $0$\n十位 $5{-}9$ → 百位进 $1$，后面变 $0$', en: 'Zhuge Liang: Rounding to the nearest hundred\nKey: look at the **tens digit** (the digit to the right of hundreds)\nTens $0{-}4$ → hundreds stays, rest become $0$\nTens $5{-}9$ → hundreds increases by $1$, rest become $0$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n$3847$，四舍五入到**百位**。\n\n定位各位：千位$3$，百位$8$，十位$4$，个位$7$。', en: 'Zhuge Liang: Read the data\n$3847$, round to the nearest **hundred**.\n\nIdentify digits: thousands $3$, hundreds $8$, tens $4$, ones $7$.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：判断——十位是 4\n$$3\\underbrace{8}_{\\text{百位}}\\underbrace{4}_{\\text{十位}}7$$\n十位 $4 < 5$ → **四舍**，百位保持 $8$', en: 'Zhuge Liang: Check — tens digit is 4\n$$3\\underbrace{8}_{\\text{hundreds}}\\underbrace{4}_{\\text{tens}}7$$\nTens digit $4 < 5$ → **round down**, hundreds stays at $8$' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：结果\n$$3847 \\approx 3800$$\n\n十位和个位变为 $0$，百位不变。', en: 'Zhuge Liang: Result\n$$3847 \\approx 3800$$\n\nTens and ones become $0$; hundreds unchanged.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n$3847$ 在 $3800$ 和 $3900$ 之间。\n$3847 - 3800 = 47$，$3900 - 3847 = 53$\n\n离 $3800$ 更近 → 四舍五入到 $3800 \\checkmark$', en: 'Zhuge Liang: Verify\n$3847$ is between $3800$ and $3900$.\n$3847 - 3800 = 47$, $3900 - 3847 = 53$\n\nCloser to $3800$ → rounds to $3800 \\checkmark$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '四舍五入到百位看十位，到千位看百位——总是看"下一位"。', en: 'To round to hundreds look at tens, to round to thousands look at hundreds — always check the next digit.' }, formula: { zh: '$\\text{看"下一位"决定舍入}$', en: '$\\text{Check the next digit to decide rounding}$' }, tips: [{ zh: '诸葛亮提示：知己知彼，估算也要精准到位！', en: 'Zhuge Liang Tip: Know your enemy — even estimates should be strategic!' }] },
    storyConsequence: { correct: { zh: '大军兵力估算到位，战略部署精准！', en: 'Army strength estimated correctly — strategy deployed precisely!' }, wrong: { zh: '估算偏差太大，战略判断失误…', en: 'Estimate too far off — strategic miscalculation...' } },
  },
  // --- Year 7 Unit 6: 营寨丈量·周长与面积篇 ---
  {
    id: 761, grade: 7, unitId: 6, order: 1,
    unitTitle: { zh: "Unit 6: 营寨丈量·周长与面积篇", en: "Unit 6: Camp Survey — Perimeter & Area" },
    topic: 'Geometry', type: 'PERIMETER',
    title: { zh: '围栅建营', en: 'Building the Camp Fence' },
    skillName: { zh: '周长计算术', en: 'Perimeter Calculation' },
    skillSummary: { zh: '长方形周长 = 2 × (长 + 宽)', en: 'Rectangle perimeter = 2 × (length + width)' },
    story: { zh: '刘备安营扎寨，需要计算围栅的总长度——这就是周长！', en: 'Liu Bei sets up camp — calculate the total fence length needed. That\'s the perimeter!' },
    description: { zh: '计算长方形周长。', en: 'Calculate the rectangle perimeter.' },
    data: { length: 12, width: 8, answer: 40, generatorType: 'PERIMETER_RECT_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-4.5-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '刘备：围营寨需要多少栅栏？\n\n营寨是长方形，要围起来就需要四条边的总长度——这就是"周长"。周长就是绕形状一圈的距离。长方形有两对等长的边！', en: 'Liu Bei: How much fencing to surround the camp?\n\nThe camp is a rectangle; to fence it we need the total of all four sides — that\'s the "perimeter". Perimeter is the total distance around a shape. A rectangle has two pairs of equal sides!' }, highlightField: 'ans' },
      { text: { zh: '刘备：长方形周长公式\n$$\\text{周长} = 2 \\times (\\text{长} + \\text{宽})$$\n\n为什么 $\\times 2$？因为对面两条边相等，各出现两次！', en: 'Liu Bei: Rectangle perimeter formula\n$$\\text{Perimeter} = 2 \\times (\\text{length} + \\text{width})$$\n\nWhy $\\times 2$? Because opposite sides are equal, each appearing twice!' }, highlightField: 'ans' },
      { text: { zh: '刘备：读取数据\n长 $= 12$ 米，宽 $= 8$ 米\n\n四条边：$12, 8, 12, 8$', en: 'Liu Bei: Read the data\nLength $= 12$ m, width $= 8$ m\n\nFour sides: $12, 8, 12, 8$' }, highlightField: 'ans' },
      { text: { zh: '刘备：第一步——括号内先加\n$$12 + 8 = 20$$', en: 'Liu Bei: Step 1 — add inside brackets first\n$$12 + 8 = 20$$' }, highlightField: 'ans' },
      { text: { zh: '刘备：第二步——乘以 2\n$$2 \\times 20 = 40$$\n\n周长 $= 40$ 米', en: 'Liu Bei: Step 2 — multiply by 2\n$$2 \\times 20 = 40$$\n\nPerimeter $= 40$ m' }, highlightField: 'ans' },
      { text: { zh: '刘备：验算（绕一圈）\n$$12 + 8 + 12 + 8 = 40 \\checkmark$$\n\n栅栏准备 $40$ 米，营寨安全！', en: 'Liu Bei: Verify (go around once)\n$$12 + 8 + 12 + 8 = 40 \\checkmark$$\n\nPrepare $40$ m of fencing — camp is secure!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '周长是图形一圈的总长度。长方形：P = 2(l+w)。', en: 'Perimeter is the total distance around a shape. Rectangle: P = 2(l+w).' }, formula: '$P = 2(l + w)$', tips: [{ zh: '刘备提示：围栅不够长，敌人就攻进来了！', en: 'Liu Bei Tip: If the fence is too short, the enemy gets in!' }] },
    storyConsequence: { correct: { zh: '围栅建营——周长无误！做得漂亮！', en: 'Building the Camp Fence — Well done!' }, wrong: { zh: '周长算错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 762, grade: 7, unitId: 6, order: 2,
    unitTitle: { zh: "Unit 6: 营寨丈量·周长与面积篇", en: "Unit 6: Camp Survey — Perimeter & Area" },
    topic: 'Geometry', type: 'AREA',
    title: { zh: '营地面积', en: 'Camp Ground Area' },
    skillName: { zh: '长方形面积术', en: 'Rectangle Area' },
    skillSummary: { zh: '长方形面积 = 长 × 宽', en: 'Rectangle area = length × width' },
    story: { zh: '张飞负责规划营地面积。长方形营地的面积 = 长 × 宽。', en: 'Zhang Fei plans the camp ground. Rectangle area = length × width.' },
    description: { zh: '计算长方形面积。', en: 'Calculate the rectangle area.' },
    data: { length: 15, width: 8, generatorType: 'AREA_RECT_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-4.5-02', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '张飞：营地有多大？\n\n周长告诉我们边界有多长，面积告诉我们内部有多大。想象在地面铺 $1 \\times 1$ 米的方格，数数能铺多少块——这就是面积！长方形面积 $=$ 长 $\\times$ 宽（横向方格数 × 纵向方格数）。', en: 'Zhang Fei: How big is the camp ground?\n\nPerimeter tells us the boundary length; area tells us the interior size. Imagine tiling the ground with $1 \\times 1$ m squares — count how many fit. That\'s area! Rectangle area $=$ length $\\times$ width (columns × rows of squares).' }, highlightField: 'area' },
      { text: { zh: '张飞：长方形面积公式\n$$\\text{面积} = \\text{长} \\times \\text{宽}$$\n\n面积用平方单位（如 $\\text{m}^2$）——"二维"的测量！', en: 'Zhang Fei: Rectangle area formula\n$$\\text{Area} = \\text{length} \\times \\text{width}$$\n\nArea uses square units (e.g. $\\text{m}^2$) — a "two-dimensional" measurement!' }, highlightField: 'area' },
      { text: { zh: '张飞：读取数据\n长 $= 15$ 米，宽 $= 8$ 米\n\n准备计算面积。', en: 'Zhang Fei: Read the data\nLength $= 15$ m, width $= 8$ m\n\nReady to calculate area.' }, highlightField: 'area' },
      { text: { zh: '张飞：拆分计算（更容易）\n$$15 \\times 8 = (10 + 5) \\times 8 = 80 + 40 = 120$$', en: 'Zhang Fei: Split to calculate (easier)\n$$15 \\times 8 = (10 + 5) \\times 8 = 80 + 40 = 120$$' }, highlightField: 'area' },
      { text: { zh: '张飞：结果\n$$\\text{面积} = 15 \\times 8 = 120 \\text{ m}^2$$\n\n营地面积 $120$ 平方米！', en: 'Zhang Fei: Result\n$$\\text{Area} = 15 \\times 8 = 120 \\text{ m}^2$$\n\nCamp ground is $120$ square metres!' }, highlightField: 'area' },
      { text: { zh: '张飞：验算\n$10 \\times 8 = 80$，$5 \\times 8 = 40$，$80 + 40 = 120 \\checkmark$\n\n营地规划完毕！', en: 'Zhang Fei: Verify\n$10 \\times 8 = 80$, $5 \\times 8 = 40$, $80 + 40 = 120 \\checkmark$\n\nCamp layout complete!' }, highlightField: 'area' },
    ],
    secret: { concept: { zh: '面积是图形内部的大小。长方形面积 = 长 × 宽。', en: 'Area is the space inside a shape. Rectangle area = length × width.' }, formula: '$A = l \\times w$', tips: [{ zh: '张飞提示：营地够大，才能屯兵万千！', en: 'Zhang Fei Tip: A big camp holds a big army!' }] },
    storyConsequence: { correct: { zh: '营地面积——面积正确！做得漂亮！', en: 'Camp Ground Area — Well done!' }, wrong: { zh: '面积不对…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 763, grade: 7, unitId: 6, order: 3,
    unitTitle: { zh: "Unit 6: 营寨丈量·周长与面积篇", en: "Unit 6: Camp Survey — Perimeter & Area" },
    topic: 'Geometry', type: 'AREA',
    title: { zh: '三角旗帜', en: 'Triangular Banner' },
    skillName: { zh: '三角形面积术', en: 'Triangle Area' },
    skillSummary: { zh: '三角形面积 = 底 × 高 ÷ 2', en: 'Triangle area = base × height ÷ 2' },
    story: { zh: '赵云要制作三角军旗。三角形面积 = 底 × 高 ÷ 2——是长方形的一半！', en: 'Zhao Yun makes triangular banners. Triangle area = base × height ÷ 2 — half a rectangle!' },
    description: { zh: '计算三角形面积。', en: 'Calculate the triangle area.' },
    data: { base: 10, height: 6, answer: 30, generatorType: 'AREA_TRIANGLE_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-4.5-02', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '赵云：三角军旗用多少布料？\n\n三角形面积比长方形少——三角形刚好是同底同高长方形的**一半**。为什么？把两个同样的三角形拼在一起，正好组成一个长方形！省了一半布料！', en: 'Zhao Yun: How much fabric for a triangular banner?\n\nTriangle area is less than a rectangle — a triangle is exactly **half** of a rectangle with the same base and height. Why? Put two identical triangles together and they form a rectangle! Half the fabric!' }, highlightField: 'area' },
      { text: { zh: '赵云：三角形面积公式\n$$\\text{面积} = \\frac{\\text{底} \\times \\text{高}}{2}$$\n\n注意："高"是垂直高度，不是斜边！', en: 'Zhao Yun: Triangle area formula\n$$\\text{Area} = \\frac{\\text{base} \\times \\text{height}}{2}$$\n\nNote: "height" is the perpendicular height, not the slant side!' }, highlightField: 'area' },
      { text: { zh: '赵云：读取数据\n底 $= 10$ 米，高 $= 6$ 米\n\n先想象同底同高的长方形：面积 $= 10 \\times 6 = 60$', en: 'Zhao Yun: Read the data\nBase $= 10$ m, height $= 6$ m\n\nFirst imagine the rectangle with same base and height: area $= 10 \\times 6 = 60$' }, highlightField: 'area' },
      { text: { zh: '赵云：计算——长方形面积的一半\n$$10 \\times 6 \\div 2 = 60 \\div 2 = 30$$', en: 'Zhao Yun: Calculate — half the rectangle area\n$$10 \\times 6 \\div 2 = 60 \\div 2 = 30$$' }, highlightField: 'area' },
      { text: { zh: '赵云：结果\n$$\\text{三角形面积} = 30 \\text{ m}^2$$\n\n军旗需要 $30$ 平方米布料！', en: 'Zhao Yun: Result\n$$\\text{Triangle area} = 30 \\text{ m}^2$$\n\nThe banner needs $30$ square metres of fabric!' }, highlightField: 'area' },
      { text: { zh: '赵云：验算\n同底同高长方形面积 $= 60$，三角形 $= \\frac{60}{2} = 30 \\checkmark$\n\n军旗制作完毕！', en: 'Zhao Yun: Verify\nSame base and height rectangle area $= 60$, triangle $= \\frac{60}{2} = 30 \\checkmark$\n\nBanner fabrication complete!' }, highlightField: 'area' },
    ],
    secret: { concept: { zh: '三角形面积 = 底 × 高 ÷ 2。可以理解为长方形面积的一半。', en: 'Triangle area = base × height ÷ 2. It\'s half the area of a rectangle.' }, formula: '$A = \\frac{b \\times h}{2}$', tips: [{ zh: '赵云提示：旗帜虽小，面积公式却大有用处！', en: 'Zhao Yun Tip: Small banner, big formula!' }] },
    storyConsequence: { correct: { zh: '三角旗帜——面积正确！做得漂亮！', en: 'Triangular Banner — Well done!' }, wrong: { zh: '面积不对…再试一次！', en: 'Not quite... Try again!' } }
  },
  // --- Year 7 Unit 6 续: 跨单元应用（方程+周长，代入+面积）---
  {
    id: 764, grade: 7, unitId: 6, order: 4,
    unitTitle: { zh: "Unit 6: 营寨丈量·周长与面积篇", en: "Unit 6: Camp Survey — Perimeter & Area" },
    topic: 'Geometry', type: 'SIMPLE_EQ',
    title: { zh: '围栅反推', en: 'Fence Reverse Problem' },
    skillName: { zh: '逆向周长术', en: 'Reverse Perimeter' },
    skillSummary: { zh: '已知周长和一条边，反推另一条边——周长公式反着用', en: 'Given perimeter and one side, find the other — use the perimeter formula in reverse' },
    story: { zh: '刘备有 $2 \\times ({a} + x) = {result}$ 根围栅（周长 {result}），营地宽已经确定为 {a}。营地能做多长？', en: 'Liu Bei has {result} fence posts (perimeter {result}), camp width is fixed at {a}. How long can the camp be?' },
    description: { zh: '已知周长和宽，求长。解方程 $2({a} + x) = {result}$。', en: 'Given perimeter and width, find length. Solve $2({a} + x) = {result}$.' },
    data: { x: 8, a: 12, result: 40, generatorType: 'SIMPLE_EQ_TWOSTEP_RANDOM' }, difficulty: 'Medium', reward: 60,
    kpId: 'kp-4.5-01', sectionId: 'geometry',
    tutorialSteps: [
      { text: { zh: '刘备：围栅反推——已知周长，求边长！\n\n已知营寨周长 $40$ 米、宽 $12$ 米，求**长**。把周长公式变成方程求解——代数解决几何问题！', en: 'Liu Bei: Reverse the fence problem — find side length from perimeter!\n\nKnown: camp perimeter $= 40$ m, width $= 12$ m, find the **length**. Turn the perimeter formula into an equation — algebra solves a geometry problem!' }, highlightField: 'x' },
      { text: { zh: '刘备：公式与方程\n$$P = 2(l + w)$$\n\n已知 $P = 40$，$w = 12$，代入求 $l$。', en: 'Liu Bei: Formula to equation\n$$P = 2(l + w)$$\n\nKnown: $P = 40$, $w = 12$; substitute and find $l$.' }, highlightField: 'x' },
      { text: { zh: '刘备：代入已知量\n$$40 = 2(l + 12)$$', en: 'Liu Bei: Substitute known values\n$$40 = 2(l + 12)$$' }, highlightField: 'x' },
      { text: { zh: '刘备：第一步——两边除以 2\n$$40 \\div 2 = l + 12$$\n$$20 = l + 12$$', en: 'Liu Bei: Step 1 — divide both sides by 2\n$$40 \\div 2 = l + 12$$\n$$20 = l + 12$$' }, highlightField: 'x' },
      { text: { zh: '刘备：第二步——两边减 12\n$$20 - 12 = l$$\n$$l = 8$$', en: 'Liu Bei: Step 2 — subtract 12 from both sides\n$$20 - 12 = l$$\n$$l = 8$$' }, highlightField: 'x' },
      { text: { zh: '刘备：验算\n$$P = 2(8 + 12) = 2 \\times 20 = 40 \\checkmark$$\n\n长 $8$ 宽 $12$，刚好围起来！营地开建！', en: 'Liu Bei: Verify\n$$P = 2(8 + 12) = 2 \\times 20 = 40 \\checkmark$$\n\nLength $8$, width $12$ — perfect fit! Start building!' }, highlightField: 'x' },
    ],
    storyConsequence: {
      correct: { zh: '刘备：长 8 宽 12，刚好围起来！营地开建！', en: 'Liu Bei: "Length 8, width 12 — perfect fit! Start building!"' },
      wrong: { zh: '刘备：围栅不够长...重新算！', en: 'Liu Bei: "Not enough fencing... recalculate!"' },
    },
    secret: { concept: { zh: '周长公式可以反着用：已知周长求边长，就是解方程。几何和代数是一家！', en: 'The perimeter formula works in reverse: finding a side from the perimeter IS solving an equation. Geometry and algebra are one!' }, formula: '$2(l + w) = P \\Rightarrow l = \\frac{P}{2} - w$', tips: [{ zh: '刘备提示：正着算是求周长，反着算就是解方程——同一个公式，两种用法！', en: 'Liu Bei Tip: Forward = find perimeter. Reverse = solve equation. Same formula, two uses!' }] }
  },
  {
    id: 765, grade: 7, unitId: 6, order: 5,
    unitTitle: { zh: "Unit 6: 营寨丈量·周长与面积篇", en: "Unit 6: Camp Survey — Perimeter & Area" },
    topic: 'Geometry', type: 'SUBSTITUTION',
    title: { zh: '营地蓝图', en: 'Camp Blueprint' },
    skillName: { zh: '代入面积术', en: 'Substitution into Area' },
    skillSummary: { zh: '把代数表达式代入面积公式——代数和几何的结合', en: 'Substitute algebraic expressions into area formulas — where algebra meets geometry' },
    story: { zh: '赵云设计营地蓝图：长用公式 ${expr}$ 表示，宽固定为 5。军师说 $x = {x}$，算出营地面积！', en: 'Zhao Yun designs the camp: length is ${expr}$, width is 5. The strategist says $x = {x}$. Find the camp area!' },
    description: { zh: '先代入求长，再算面积。', en: 'Substitute to find length, then calculate area.' },
    data: { a: 2, b: 3, x: 4, answer: 55, mode: 'linear', expr: '2x + 3', generatorType: 'SUBSTITUTION_RANDOM' }, difficulty: 'Medium', reward: 60,
    kpId: 'kp-2.2-01', sectionId: 'algebra',
        tutorialSteps: [
      { text: { zh: '赵云：营地蓝图——两步应用题！\n\n先用代入法求"长"（代入给定值算表达式），再用面积公式算面积。这是代数与几何的结合——先求边长，再求面积！', en: 'Zhao Yun: Camp blueprint — two-step application!\n\nFirst use substitution to find the "length" (substitute given value into expression), then use area formula. This combines algebra and geometry — find side length first, then area!' }, highlightField: 'ans' },
      { text: { zh: '赵云：第一步——代入求长\n把给定的 $x$ 值代入长度表达式，得到具体长度。', en: 'Zhao Yun: Step 1 — substitution to find length\nSubstitute the given value of $x$ into the length expression to get the specific length.' }, highlightField: 'ans' },
      { text: { zh: '赵云：第二步——面积公式\n$$\\text{面积} = \\text{长} \times \\text{宽}$$\n\n用第一步求出的长，乘以已知的宽。', en: 'Zhao Yun: Step 2 — area formula\n$$\\text{Area} = \\text{length} \\times \\text{width}$$\n\nUse the length from step 1, multiply by the given width.' }, highlightField: 'ans' },
      { text: { zh: '赵云：代入计算\n若长 $= 2x + 1$，$x = 4$：\n$$2(4) + 1 = 9$$\n\n长 $= 9$ 米', en: 'Zhao Yun: Substitute and calculate\nIf length $= 2x + 1$, $x = 4$:\n$$2(4) + 1 = 9$$\n\nLength $= 9$ m' }, highlightField: 'ans' },
      { text: { zh: '赵云：计算面积\n假设宽 $= 5$ 米：\n$$\\text{面积} = 9 \times 5 = 45 \\text{ m}^2$$', en: 'Zhao Yun: Calculate area\nIf width $= 5$ m:\n$$\\text{Area} = 9 \\times 5 = 45 \\text{ m}^2$$' }, highlightField: 'ans' },
      { text: { zh: '赵云：验算\n代回：$2(4)+1=9$，$9 \times 5 = 45$ ✓\n\n营地蓝图完成！', en: 'Zhao Yun: Verify\nBack-substitute: $2(4)+1=9$, $9 \\times 5 = 45$ ✓\n\nCamp blueprint complete!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '代数和几何可以结合：用公式表示边长，代入后就能算面积。这是高中数学的基础！', en: 'Algebra + geometry combine: express sides as formulas, substitute to find area. This is the foundation of advanced math!' }, formula: '$A = (2x + 3) \\times w$', tips: [{ zh: '赵云提示：会画蓝图还不够，还要会算面积！', en: 'Zhao Yun Tip: Drawing blueprints isn\'t enough — you must calculate the area!' }] },
    storyConsequence: { correct: { zh: '营地蓝图完美落地，代数+几何完美结合！', en: 'Camp blueprint executed perfectly — algebra + geometry in harmony!' }, wrong: { zh: '蓝图尺寸算错，营地太小住不下…', en: 'Blueprint dimensions wrong — camp too small for the troops...' } },
  },
  // --- Year 7 Unit 7: 战后统计·数据篇 ---
  {
    id: 770, grade: 7, unitId: 7, order: 0,
    unitTitle: { zh: "Unit 7: 战后统计·数据篇", en: "Unit 7: Post-battle Stats — Data" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '兵器清点', en: 'Weapon Inventory' },
    skillName: { zh: '众数辨识术', en: 'Mode (Most Common)' },
    skillSummary: { zh: '众数 = 出现次数最多的数——数据里的"人气王"', en: 'Mode = the value that appears most often' },
    story: { zh: '张飞清点缴获的兵器：刀、枪、剑、戟...哪种兵器数量最多？出现次数最多的那个就是"众数"！', en: 'Zhang Fei inventories captured weapons: swords, spears, halberds... Which type is most common? The most frequent value is the "mode"!' },
    description: { zh: '找出数据的众数（出现次数最多的数）。', en: 'Find the mode (most frequent value).' },
    data: { values: [3, 5, 5, 5, 7, 8, 12], mode: 'mode', modeValue: 5, modeCount: 3, generatorType: 'STATISTICS_MODE_RANDOM' }, difficulty: 'Easy', reward: 40,
    kpId: 'kp-9.3-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '张飞：哪种兵器最常见？\n\n战场上缴获的兵器有很多种，但哪种最多？最常见的那个数值叫**众数**（Mode）——它是数据里的"人气王"！对于战场补给来说，最常见的最重要。', en: 'Zhang Fei: Which weapon type is most common?\n\nMany types of weapons were captured, but which type appears most? The most frequent value is called the **mode** — it\'s the "most popular" in the data! For battlefield supply, the most common item matters most.' }, highlightField: 'ans' },
      { text: { zh: '张飞：求众数的方法\n逐一统计每个数值出现的次数，找出次数最多的那个。\n\n数据少时可以直接数；数据多时先排序再数！', en: 'Zhang Fei: How to find the mode\nCount how many times each value appears; find the one with the highest count.\n\nFor small datasets, count directly; for large ones, sort first then count!' }, highlightField: 'ans' },
      { text: { zh: '张飞：读取数据\n$\\{3, 5, 5, 5, 7, 8, 12\\}$\n\n共 $7$ 个数据，开始统计！', en: 'Zhang Fei: Read the data\n$\\{3, 5, 5, 5, 7, 8, 12\\}$\n\n$7$ data values total, start counting!' }, highlightField: 'ans' },
      { text: { zh: '张飞：统计次数\n$3$ → $1$ 次，$5$ → $3$ 次，$7$ → $1$ 次，$8$ → $1$ 次，$12$ → $1$ 次\n\n$5$ 出现了 $3$ 次，最多！', en: 'Zhang Fei: Count frequencies\n$3$ → $1$ time, $5$ → $3$ times, $7$ → $1$ time, $8$ → $1$ time, $12$ → $1$ time\n\n$5$ appears $3$ times — the most!' }, highlightField: 'ans' },
      { text: { zh: '张飞：答案\n众数 $= 5$\n\n兵器库里最多的是 $5$ 型兵器！', en: 'Zhang Fei: Answer\nMode $= 5$\n\nThe most common weapon type in the arsenal is type $5$!' }, highlightField: 'ans' },
      { text: { zh: '张飞：验算\n没有任何数值比 $5$（$3$ 次）出现得更多。\n其他所有值只出现 $1$ 次。\n众数 $= 5 \\checkmark$', en: 'Zhang Fei: Verify\nNo other value appears more than $5$ (which appears $3$ times).\nAll other values appear only $1$ time.\nMode $= 5 \\checkmark$' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '众数是出现频率最高的值。一组数据可以有多个众数，也可以没有众数。', en: 'Mode is the most frequent value. Data can have multiple modes or no mode.' }, formula: { zh: '$\\text{众数 = 频率最高的值}$', en: '$\\text{Mode = most frequent value}$' }, tips: [{ zh: '张飞提示：哪种兵器最多，就知道敌军的战术偏好！', en: 'Zhang Fei Tip: The most common weapon reveals the enemy\'s tactics!' }] },
    storyConsequence: { correct: { zh: '兵器清点——数据分析到位！做得漂亮！', en: 'Weapon Inventory — Well done!' }, wrong: { zh: '数据分析出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 771, grade: 7, unitId: 7, order: 1,
    unitTitle: { zh: "Unit 7: 战后统计·数据篇", en: "Unit 7: Post-battle Stats — Data" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '平均战力', en: 'Average Strength' },
    skillName: { zh: '平均数计算术', en: 'Mean Calculation' },
    skillSummary: { zh: '平均数 = 所有数之和 ÷ 个数', en: 'Mean = sum of all values ÷ number of values' },
    story: { zh: '曹操统计各营战斗力，用平均数来评估整体水平。', en: 'Cao Cao evaluates battalion strength using the mean (average).' },
    description: { zh: '求平均数。', en: 'Find the mean.' },
    data: { values: [8, 12, 15, 10, 5], mode: 'mean', generatorType: 'STATISTICS_MEAN_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-9.3-01', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '曹操：哪个营整体战力最强？\n\n各营战斗力不一样，用**平均数**（Mean）代表整体水平最公平。平均数就是把所有的值"匀平"——如果每个人都一样，那个"一样"的值就是平均数。', en: 'Cao Cao: Which battalion has the strongest overall combat power?\n\nBattalion strengths vary; the **mean** (average) fairly represents the overall level. The mean is the "even-out" value — if everyone were equal, that equal value is the mean.' }, highlightField: 'ans' },
      { text: { zh: '曹操：平均数公式\n$$\\overline{x} = \\frac{\\text{总和}}{\\text{个数}}$$\n\n第一步求和，第二步除以数据个数。', en: 'Cao Cao: Mean formula\n$$\\overline{x} = \\frac{\\text{sum}}{\\text{count}}$$\n\nStep 1: sum all values; Step 2: divide by the count.' }, highlightField: 'ans' },
      { text: { zh: '曹操：读取数据\n各营战斗力：$\\{8, 12, 15, 10, 5\\}$\n\n共 $5$ 个营，开始求和！', en: 'Cao Cao: Read the data\nBattalion strengths: $\\{8, 12, 15, 10, 5\\}$\n\n$5$ battalions, start adding!' }, highlightField: 'ans' },
      { text: { zh: '曹操：第一步——求和\n$$8 + 12 + 15 + 10 + 5 = 50$$', en: 'Cao Cao: Step 1 — find the sum\n$$8 + 12 + 15 + 10 + 5 = 50$$' }, highlightField: 'ans' },
      { text: { zh: '曹操：第二步——除以个数\n$$50 \\div 5 = 10$$\n\n平均战斗力 $= 10$', en: 'Cao Cao: Step 2 — divide by count\n$$50 \\div 5 = 10$$\n\nAverage combat strength $= 10$' }, highlightField: 'ans' },
      { text: { zh: '曹操：验算\n$5$ 个 $10$ 的总和 $= 5 \\times 10 = 50 \\checkmark$\n\n如果每营都是平均水平 $10$，总和还是 $50$——验算通过！', en: 'Cao Cao: Verify\n$5$ tens sum to $5 \\times 10 = 50 \\checkmark$\n\nIf every battalion were at the average level $10$, the total would still be $50$ — verified!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '平均数把总量平均分给每个数据。它代表数据的"中心水平"。', en: 'The mean shares the total equally. It represents the "center" of the data.' }, formula: '$\\bar{x} = \\frac{\\sum x}{n}$', tips: [{ zh: '曹操提示：知道全军平均水平，才能精准调度！', en: 'Cao Cao Tip: Know the average to optimize deployment!' }] },
    storyConsequence: { correct: { zh: '平均战力——数据分析到位！做得漂亮！', en: 'Average Strength — Well done!' }, wrong: { zh: '数据分析出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 772, grade: 7, unitId: 7, order: 2,
    unitTitle: { zh: "Unit 7: 战后统计·数据篇", en: "Unit 7: Post-battle Stats — Data" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '中位排名', en: 'Median Rank' },
    skillName: { zh: '中位数计算术', en: 'Median Calculation' },
    skillSummary: { zh: '排序后取中间的数', en: 'Sort the values, then pick the middle one' },
    story: { zh: '诸葛亮要找出"中间水平"的士兵——先排序，再取中间值。', en: 'Zhuge Liang finds the "middle level" soldier — sort first, then pick the middle.' },
    description: { zh: '求中位数。', en: 'Find the median.' },
    data: { values: [3, 7, 8, 12, 15], mode: 'median', generatorType: 'STATISTICS_MEDIAN_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-9.3-02', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '诸葛亮：中位数——不受极端值影响的"中间人"\n\n平均数会被极端高/低值拉偏。中位数是"中间那个人"——一半比他强，一半比他弱，不受两端极端值影响。评估"中间水平"最可靠！', en: 'Zhuge Liang: Median — the "middle person" unaffected by extremes\n\nThe mean can be skewed by extreme values. The median is the "person in the middle" — half score higher, half score lower — not affected by extremes. Most reliable for assessing "middle level"!' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：求中位数的步骤\n1. **排序**：从小到大排列所有数据\n2. **找中间**：奇数个数据 → 取正中间那个\n\n（偶数个数据时取中间两个的平均值）', en: 'Zhuge Liang: Steps to find the median\n1. **Sort**: arrange all data from smallest to largest\n2. **Find the middle**: odd count → take the exact middle value\n\n(Even count → take the average of the two middle values)' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：读取数据\n$\\{3, 7, 8, 12, 15\\}$（已排好序！）\n\n共 $5$ 个数据（奇数），找中间第 $3$ 个。', en: 'Zhuge Liang: Read the data\n$\\{3, 7, 8, 12, 15\\}$ (already sorted!)\n\n$5$ values (odd count), find the $3$rd one in the middle.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：定位中间\n$$\\underbrace{3, 7}_{\\text{左边}}, \\underbrace{8}_{\\text{中间}}, \\underbrace{12, 15}_{\\text{右边}}$$\n\n中间位置：$\\frac{5+1}{2} = 3$，第 $3$ 个数。', en: 'Zhuge Liang: Locate the middle\n$$\\underbrace{3, 7}_{\\text{left}}, \\underbrace{8}_{\\text{middle}}, \\underbrace{12, 15}_{\\text{right}}$$\n\nMiddle position: $\\frac{5+1}{2} = 3$, the $3$rd value.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：答案\n中位数 $= 8$\n\n$8$ 就是"中间水平"的士兵战斗力。', en: 'Zhuge Liang: Answer\nMedian $= 8$\n\n$8$ represents the "middle level" soldier\'s combat strength.' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：验算\n左边：$3, 7$（$2$ 个比 $8$ 小）\n右边：$12, 15$（$2$ 个比 $8$ 大）\n\n两边对称，$8$ 确实是中位数 ✓', en: 'Zhuge Liang: Verify\nLeft: $3, 7$ ($2$ values less than $8$)\nRight: $12, 15$ ($2$ values greater than $8$)\n\nSymmetric on both sides — $8$ is indeed the median ✓' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '中位数是排序后正中间的值。它不受极端值影响。', en: 'Median is the middle value after sorting. It\'s not affected by outliers.' }, formula: { zh: '$\\text{排序后取中间值}$', en: '$\\text{Middle value after sorting}$' }, tips: [{ zh: '诸葛亮提示：中位数比平均数更稳定——一个极端值不会带偏它！', en: 'Zhuge Liang Tip: Median is more stable than mean — one outlier won\'t skew it!' }] },
    storyConsequence: { correct: { zh: '中位排名——数据分析到位！做得漂亮！', en: 'Median Rank — Well done!' }, wrong: { zh: '数据分析出错了…再试一次！', en: 'Not quite... Try again!' } }
  },
  {
    id: 773, grade: 7, unitId: 7, order: 3,
    unitTitle: { zh: "Unit 7: 战后统计·数据篇", en: "Unit 7: Post-battle Stats — Data" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '战力差距', en: 'Strength Spread' },
    skillName: { zh: '极差计算术', en: 'Range Calculation' },
    skillSummary: { zh: '极差 = 最大值 - 最小值', en: 'Range = Maximum - Minimum' },
    story: { zh: '张飞要看各营战力差距有多大——用极差（Range）来衡量！', en: 'Zhang Fei measures the gap between battalions using the range!' },
    description: { zh: '求极差（Range）。', en: 'Find the range.' },
    data: { values: [5, 8, 12, 15, 20], mode: 'range', generatorType: 'STATISTICS_RANGE_RANDOM' }, difficulty: 'Easy', reward: 40,
    kpId: 'kp-9.3-03', sectionId: 'statistics',
    tutorialSteps: [
      { text: { zh: '张飞：各营战力差距有多大？\n\n平均数告诉我们整体水平，但差距呢？**极差**（Range）衡量数据的"跨度"——最强和最弱之间的差距。极差越大，说明各营差异越悬殊；极差越小，说明各营实力均衡。', en: 'Zhang Fei: How wide is the gap between battalions?\n\nThe mean tells us the average level, but what about the spread? The **range** measures the data "span" — the gap between strongest and weakest. Large range = big disparities; small range = balanced strength.' }, highlightField: 'ans' },
      { text: { zh: '张飞：极差公式\n$$\\text{极差（Range）} = \\text{最大值} - \\text{最小值}$$\n\n只需要两个数：最大和最小。快速！', en: 'Zhang Fei: Range formula\n$$\\text{Range} = \\text{Maximum} - \\text{Minimum}$$\n\nOnly needs two values: maximum and minimum. Quick!' }, highlightField: 'ans' },
      { text: { zh: '张飞：读取数据\n$\\{5, 8, 12, 15, 20\\}$（已排好序）\n\n最小值 $= 5$，最大值 $= 20$', en: 'Zhang Fei: Read the data\n$\\{5, 8, 12, 15, 20\\}$ (already sorted)\n\nMinimum $= 5$, maximum $= 20$' }, highlightField: 'ans' },
      { text: { zh: '张飞：计算\n$$\\text{极差} = 20 - 5 = 15$$', en: 'Zhang Fei: Calculate\n$$\\text{Range} = 20 - 5 = 15$$' }, highlightField: 'ans' },
      { text: { zh: '张飞：结果\n极差 $= 15$\n\n最强营（$20$）和最弱营（$5$）之间差了 $15$——差距相当大！', en: 'Zhang Fei: Result\nRange $= 15$\n\nThe strongest battalion ($20$) and weakest ($5$) differ by $15$ — quite a large gap!' }, highlightField: 'ans' },
      { text: { zh: '张飞：验算\n$20 - 5 = 15 \\checkmark$\n数据跨度从 $5$ 到 $20$，宽度 $15$。\n\n该练练了，差距太大！', en: 'Zhang Fei: Verify\n$20 - 5 = 15 \\checkmark$\nData spans from $5$ to $20$, width $15$.\n\nTime for training — the gap is too big!' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '极差衡量数据的"分散程度"——差越大，数据越分散。', en: 'Range measures how spread out the data is — bigger range means more spread.' }, formula: '$\\text{Range} = \\text{Max} - \\text{Min}$', tips: [{ zh: '张飞提示：差距太大就要整训，差距小说明水平齐整！', en: 'Zhang Fei Tip: Big gap means more training needed!' }] },
    storyConsequence: { correct: { zh: '战力差距一目了然！张飞：整训计划安排上了！', en: 'Strength gap crystal clear! Zhang Fei: Training plan is set!' }, wrong: { zh: '数据分析有误，整训方向搞错了…', en: 'Data analysis wrong — training focus is off...' } },
  },
];
