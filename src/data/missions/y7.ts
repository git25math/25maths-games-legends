import type { Mission } from '../../types';

export const MISSIONS_Y7: Mission[] = [
  // --- Year 7 Unit 0: 桃园点兵·数论篇 (Number Foundations) ---
  {
    id: 698, grade: 7, unitId: 0, order: -2,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'FACTORS_LIST',
    title: { zh: '点兵编队', en: 'Troop Formation Count' },
    skillName: { zh: '因数列举术', en: 'Listing Factors' },
    skillSummary: { zh: '因数就是能整除一个数的数——把士兵分成几种等分方式', en: 'Factors are numbers that divide evenly — find all ways to split soldiers into equal groups' },
    story: { zh: '刘备刚招募了一批新兵，要想办法编队。{n} 个士兵可以分成几种等人数的队？2 人一队、3 人一队、4 人一队...把所有可能的分法都找出来！', en: 'Liu Bei just recruited soldiers and needs to form squads. {n} soldiers — how many ways to divide them into equal groups? 2 per squad, 3 per squad, 4 per squad... find all possible divisions!' },
    description: { zh: '这个数有几个因数？', en: 'How many factors does this number have?' },
    data: { n: 24, factors: [1, 2, 3, 4, 6, 8, 12, 24], answer: 8, generatorType: 'FACTORS_LIST_RANDOM' }, difficulty: 'Easy', reward: 35,
    kpId: 'kp-1.1-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '刘备：24 个新兵怎么分队？先搞懂"因数"——能把 24 平均分开的数', en: 'Liu Bei: "24 recruits — how to divide? First understand \'factors\' — numbers that divide 24 evenly"' }, highlightField: 'ans' },
      { text: { zh: '刘备：因数成对出现——$1 \\times 24 = 24$，$2 \\times 12 = 24$，$3 \\times 8 = 24$，$4 \\times 6 = 24$', en: 'Liu Bei: "Factors come in pairs: $1 \\times 24$, $2 \\times 12$, $3 \\times 8$, $4 \\times 6$"' }, highlightField: 'ans' },
      { text: { zh: '刘备：所以 24 的全部因数是 $1, 2, 3, 4, 6, 8, 12, 24$——共 8 个', en: 'Liu Bei: "All factors of 24: $1, 2, 3, 4, 6, 8, 12, 24$ — total 8"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：什么是质数？只能被 1 和它自己整除的数', en: 'Zhuge Liang: "What is a prime? A number divisible only by 1 and itself"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：不是质数的叫"合数"——能被拆开', en: 'Zhuge Liang: "Non-primes are composites — they can be split"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：注意——1 不是质数，2 是唯一的偶数质数', en: 'Zhuge Liang: "Note: 1 is NOT prime. 2 is the only even prime"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：前 10 个质数：$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$', en: 'Zhuge Liang: "First 10 primes: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$"' }, highlightField: 'ans' }
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
      { text: { zh: '诸葛亮：24 个新兵，怎么拆成最小的战斗单元？', en: 'Zhuge Liang: "24 recruits — how to split into smallest units?"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：从 2 开始试。24÷2=12，记下 2', en: 'Zhuge Liang: "Start with 2. 24÷2=12, note 2"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：12÷2=6，记下 2。6÷2=3，记下 2。3 是质数，停！', en: 'Zhuge Liang: "12÷2=6, note 2. 6÷2=3, note 2. 3 is prime, stop!"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：$24 = 2 \\times 2 \\times 2 \\times 3 = 2^3 \\times 3$，共 4 个质因数', en: 'Zhuge Liang: "$24 = 2 \\times 2 \\times 2 \\times 3 = 2^3 \\times 3$, 4 prime factors total"' }, highlightField: 'ans' }
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
      {
        text: { zh: '刘备："两营分别有 24 和 36 名士兵，要分成人数相同的小队，每队最多几人？"', en: 'Liu Bei: "Two camps have 24 and 36 soldiers. Split into equal squads — what is the largest squad size?"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '刘备："先对 24 做质因数分解：$24 = 2^3 \\times 3$"', en: 'Liu Bei: "Prime factorize 24: $24 = 2^3 \\times 3$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '刘备："再对 36 做质因数分解：$36 = 2^2 \\times 3^2$"', en: 'Liu Bei: "Prime factorize 36: $36 = 2^2 \\times 3^2$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '刘备："找共有的质因数，取较小的次幂，乘起来：$2^2 \\times 3 = 12$"', en: 'Liu Bei: "Take common primes to lowest power: $2^2 \\times 3 = 12$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '刘备："所以 HCF(24, 36) = 12！每队 12 人，整编完毕！"', en: 'Liu Bei: "So HCF(24, 36) = 12! 12 soldiers per squad, troops organized!"' },
        highlightField: 'ans'
      }
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
      {
        text: { zh: '关羽："我每 6 天巡营一次，张飞每 8 天一次。几天后我们同时巡营？"', en: 'Guan Yu: "I patrol every 6 days, Zhang Fei every 8 days. When do we both patrol together?"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '关羽："先对 6 做质因数分解：$6 = 2 \\times 3$"', en: 'Guan Yu: "Prime factorize 6: $6 = 2 \\times 3$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '关羽："再对 8 做质因数分解：$8 = 2^3$"', en: 'Guan Yu: "Prime factorize 8: $8 = 2^3$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '关羽："每个质因数取大的那个，乘起来：$2^3 \\times 3 = 24$"', en: 'Guan Yu: "Take all primes to highest power: $2^3 \\times 3 = 24$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '关羽："所以 LCM(6, 8) = 24！每 24 天我们同时巡营！"', en: 'Guan Yu: "So LCM(6, 8) = 24! We both patrol together every 24 days!"' },
        highlightField: 'ans'
      }
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
      {
        text: { zh: '张飞："俺们有 48 袋粮和 60 把刀，要平分给各村，每村最多能分几份？"', en: 'Zhang Fei: "We have 48 bags of grain and 60 swords. Each village gets equal shares — what is the max per village?"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张飞："$48 = 2^4 \\times 3$"', en: 'Zhang Fei: "$48 = 2^4 \\times 3$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张飞："$60 = 2^2 \\times 3 \\times 5$"', en: 'Zhang Fei: "$60 = 2^2 \\times 3 \\times 5$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张飞："公共质因数：2 和 3。取最低次幂：$2^2 \\times 3 = 12$"', en: 'Zhang Fei: "Common primes: 2 and 3. Lowest powers: $2^2 \\times 3 = 12$"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张飞："HCF(48, 60) = 12！分给 12 个村，每村 4 袋粮 5 把刀！"', en: 'Zhang Fei: "HCF(48, 60) = 12! Split among 12 villages, each gets 4 bags of grain and 5 swords!"' },
        highlightField: 'ans'
      }
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
      { text: { zh: '诸葛亮："粮仓补给 50 袋，消耗 30 袋。$50 + (-30) = ?$"', en: 'Zhuge Liang: "50 bags resupplied, 30 consumed. $50 + (-30) = ?$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："加一个负数 = 减去它的绝对值。$50 + (-30) = 50 - 30$"', en: 'Zhuge Liang: "Adding a negative = subtracting its absolute value. $50 + (-30) = 50 - 30$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："$50 - 30 = 20$！还剩 20 袋粮草。"', en: 'Zhuge Liang: "$50 - 30 = 20$! 20 bags remaining."' }, highlightField: 'ans' }
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
      { text: { zh: '曹操："先损 20 人，又损 15 人。$(-20) + (-15) = ?$"', en: 'Cao Cao: "Lost 20 soldiers, then 15 more. $(-20) + (-15) = ?$"' }, highlightField: 'ans' },
      { text: { zh: '曹操："两个负数相加，绝对值相加，结果还是负数"', en: 'Cao Cao: "Two negatives added: add absolute values, result stays negative"' }, highlightField: 'ans' },
      { text: { zh: '曹操："$(-20) + (-15) = -35$！共损失 35 人，必须补充兵力。"', en: 'Cao Cao: "$(-20) + (-15) = -35$! 35 soldiers lost, must recruit more."' }, highlightField: 'ans' }
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
      { text: { zh: '关羽："战后先得 40 人投诚，又有 60 人离去。$40 - 60 = ?$"', en: 'Guan Yu: "After battle, 40 joined us but 60 left. $40 - 60 = ?$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："减去的数比原来大，结果就变成负数了"', en: 'Guan Yu: "Subtracting more than you have gives a negative result"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$40 - 60 = -20$！净减少 20 人。"', en: 'Guan Yu: "$40 - 60 = -20$! Net loss of 20."' }, highlightField: 'ans' }
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
    story: { zh: '张飞在追击中发现规律：敌人每天后退（负方向）5 里，连续后退了 3 天。敌人的总位移是多少？负数乘以正数，还是负的！但如果取消撤退呢？', en: 'Zhang Fei spots a pattern while pursuing: the enemy retreats (negative) 5 li per day, for 3 days. What\'s the total displacement? Negative times positive stays negative! But what if the retreat is cancelled?' },
    description: { zh: '计算正负数的乘法或除法。', en: 'Calculate with negative multiplication or division.' },
    data: { a: -5, b: 3, answer: -15, op: '×', mode: 'mul', generatorType: 'INTEGER_MUL_RANDOM' }, difficulty: 'Medium', reward: 50,
    kpId: 'kp-1.6-03', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '张飞：正负数乘除——口诀：同号得正，异号得负', en: 'Zhang Fei: "Rule: same signs → positive, different signs → negative"' }, highlightField: 'ans' },
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
      { text: { zh: '关羽："第一营有全军 $\\frac{1}{3}$ 的粮草，第二营有 $\\frac{1}{4}$。合起来是多少？"', en: 'Guan Yu: "First camp has $\\frac{1}{3}$ of the grain, second has $\\frac{1}{4}$. What is the total?"' }, highlightField: 'ans' },
      { text: { zh: '关羽："分母不同，要先通分。3 和 4 的最小公倍数是 12"', en: 'Guan Yu: "Different denominators — find LCD first. LCM of 3 and 4 is 12"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{1}{3} = \\frac{4}{12}$，$\\frac{1}{4} = \\frac{3}{12}$"', en: 'Guan Yu: "$\\frac{1}{3} = \\frac{4}{12}$, $\\frac{1}{4} = \\frac{3}{12}$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}$"', en: 'Guan Yu: "$\\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}$"' }, highlightField: 'ans' }
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
      { text: { zh: '诸葛亮："粮仓有 $\\frac{3}{4}$ 满，消耗了 $\\frac{1}{6}$，还剩多少？"', en: 'Zhuge Liang: "Granary is $\\frac{3}{4}$ full, consumed $\\frac{1}{6}$. How much remains?"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："4 和 6 的最小公倍数是 12"', en: 'Zhuge Liang: "LCM of 4 and 6 is 12"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："$\\frac{3}{4} = \\frac{9}{12}$，$\\frac{1}{6} = \\frac{2}{12}$"', en: 'Zhuge Liang: "$\\frac{3}{4} = \\frac{9}{12}$, $\\frac{1}{6} = \\frac{2}{12}$"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮："$\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$"', en: 'Zhuge Liang: "$\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$"' }, highlightField: 'ans' }
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
    story: { zh: '运粮队有 2 整箱加 $\\frac{3}{5}$ 箱散装粮草。为了过桥称重，需要全部拆成散装（假分数）。$2\\frac{3}{5}$ 拆成多少个 $\\frac{1}{5}$？', en: 'The supply convoy has 2 full crates plus $\\frac{3}{5}$ of a crate loose. To weigh for the bridge, unpack everything. $2\\frac{3}{5}$ = how many fifths?' },
    description: { zh: '把带分数化成假分数，求分子。', en: 'Convert the mixed number to improper fraction. Find the numerator.' },
    data: { whole: 2, num: 3, den: 5, improperNum: 13, answer: 13, mode: 'to_improper', generatorType: 'MIXED_IMPROPER_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.4-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：$2\\frac{3}{5}$——2 整箱加零散的 $\\frac{3}{5}$ 箱', en: 'Zhuge Liang: "$2\\frac{3}{5}$ — 2 full crates plus $\\frac{3}{5}$ loose"' }, highlightField: 'ans' },
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
    story: { zh: '散装粮草 $\\frac{13}{5}$ 份，需要重新装箱方便运输。每 5 份装一箱，能装几整箱？还剩几份散装？', en: 'Loose grain: $\\frac{13}{5}$ parts. Repack into crates (5 per crate). How many full crates? How many loose parts remain?' },
    description: { zh: '把假分数化成带分数，求整数部分。', en: 'Convert improper fraction to mixed number. Find the whole part.' },
    data: { whole: 2, num: 3, den: 5, improperNum: 13, answer: 2, mode: 'to_mixed', generatorType: 'MIXED_IMPROPER_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.4-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '诸葛亮：$\\frac{13}{5}$——13 份散装，每 5 份一箱', en: 'Zhuge Liang: "$\\frac{13}{5}$ — 13 loose parts, 5 per crate"' }, highlightField: 'ans' },
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
      { text: { zh: '张飞："$\\frac{2}{3}$ 的粮草再取 $\\frac{3}{5}$，能取多少？$\\frac{2}{3} \\times \\frac{3}{5} = ?$"', en: 'Zhang Fei: "Take $\\frac{3}{5}$ of $\\frac{2}{3}$ of the grain. $\\frac{2}{3} \\times \\frac{3}{5} = ?$"' }, highlightField: 'ans' },
      { text: { zh: '张飞："分数乘法：分子乘分子，分母乘分母"', en: 'Zhang Fei: "Fraction multiplication: multiply tops, multiply bottoms"' }, highlightField: 'ans' },
      { text: { zh: '张飞："$\\frac{2 \\times 3}{3 \\times 5} = \\frac{6}{15}$，约分得 $\\frac{2}{5}$"', en: 'Zhang Fei: "$\\frac{2 \\times 3}{3 \\times 5} = \\frac{6}{15}$, simplify to $\\frac{2}{5}$"' }, highlightField: 'ans' }
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
      { text: { zh: '关羽："$\\frac{2}{3} \\div \\frac{3}{5} = ?$ 分数除法怎么算？"', en: 'Guan Yu: "$\\frac{2}{3} \\div \\frac{3}{5} = ?$ How to divide fractions?"' }, highlightField: 'ans' },
      { text: { zh: '关羽："除以一个分数 = 乘以它的倒数。倒数就是把分子分母交换"', en: 'Guan Yu: "Dividing by a fraction = multiplying by its reciprocal. Reciprocal = swap top and bottom"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{2}{3} \\div \\frac{3}{5} = \\frac{2}{3} \\times \\frac{5}{3}$"', en: 'Guan Yu: "$\\frac{2}{3} \\div \\frac{3}{5} = \\frac{2}{3} \\times \\frac{5}{3}$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："分子乘分子，分母乘分母：$\\frac{2 \\times 5}{3 \\times 3} = \\frac{10}{9}$"', en: 'Guan Yu: "Multiply tops, multiply bottoms: $\\frac{2 \\times 5}{3 \\times 3} = \\frac{10}{9}$"' }, highlightField: 'ans' },
      { text: { zh: '关羽："$\\frac{10}{9}$ 已经是最简分数，所以答案是 $\\frac{10}{9}$"', en: 'Guan Yu: "$\\frac{10}{9}$ is already in simplest form, so the answer is $\\frac{10}{9}$"' }, highlightField: 'ans' }
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
      { text: { zh: '诸葛亮：$\\frac{1}{4} = 0.25 = 25\\%$——三种写法，同一个数', en: 'Zhuge Liang: "$\\frac{1}{4} = 0.25 = 25\\%$ — three forms, same value"' }, highlightField: 'ans' },
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
      { text: { zh: '刘备：什么是"平方"？一个数乘以自己', en: 'Liu Bei: "What is squaring? A number times itself"' }, highlightField: 'ans' },
      { text: { zh: '刘备：$7^2 = 7 \\times 7 = 49$，7 行 7 列共 49 人', en: 'Liu Bei: "$7^2 = 7 \\times 7 = 49$, 7 rows × 7 columns = 49 soldiers"' }, highlightField: 'ans' },
      { text: { zh: '刘备：记住前 10 个平方数：$1, 4, 9, 16, 25, 36, 49, 64, 81, 100$', en: 'Liu Bei: "Remember the first 10 squares: $1, 4, 9, 16, 25, 36, 49, 64, 81, 100$"' }, highlightField: 'ans' },
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
      { text: { zh: '张飞：什么是"立方"？一个数乘三次', en: 'Zhang Fei: "What is cubing? A number times itself three times"' }, highlightField: 'ans' },
      { text: { zh: '张飞：先算 $3 \\times 3 = 9$，再乘 3：$9 \\times 3 = 27$', en: 'Zhang Fei: "First $3 \\times 3 = 9$, then × 3: $9 \\times 3 = 27$"' }, highlightField: 'ans' },
      { text: { zh: '张飞：前 5 个立方数：$1, 8, 27, 64, 125$', en: 'Zhang Fei: "First 5 cubes: $1, 8, 27, 64, 125$"' }, highlightField: 'ans' },
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
      { text: { zh: '关羽：平方根是平方的反操作', en: 'Guan Yu: "Square root is the reverse of squaring"' }, highlightField: 'ans' },
      { text: { zh: '关羽：看到 49 人方阵 → 每行 $\\sqrt{49} = 7$ 人', en: 'Guan Yu: "49-soldier square formation → $\\sqrt{49} = 7$ per row"' }, highlightField: 'ans' },
      { text: { zh: '关羽：常见平方根速查表', en: 'Guan Yu: "Common square roots reference"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：平方根——"谁的平方等于这个数？"', en: 'Zhuge Liang: "Square root — whose square equals this number?"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：立方根——"谁的立方等于这个数？"', en: 'Zhuge Liang: "Cube root — whose cube equals this number?"' }, highlightField: 'ans' },
      { text: { zh: '诸葛亮：看清符号！$\\sqrt{\\ }$ 是平方根，$\\sqrt[3]{\\ }$ 是立方根', en: 'Zhuge Liang: "Read the symbol! $\\sqrt{\\ }$ is square root, $\\sqrt[3]{\\ }$ is cube root"' }, highlightField: 'ans' },
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
    tutorialSteps: [
      { text: { zh: '诸葛亮：$2 + 3 \\times 4 = ?$——你觉得答案是 20 还是 14？', en: 'Zhuge Liang: "$2 + 3 \\times 4 = ?$ — do you think it\'s 20 or 14?"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：有括号？括号最大！先算括号里面', en: 'Zhuge Liang: "Brackets? They\'re the boss! Calculate inside first"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：$3x + 4 = 19$——$x$ 被两层包裹，先拆外层', en: 'Zhuge Liang: "$3x + 4 = 19$ — $x$ is double-wrapped, remove outer layer first"' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：内层是 $\\times 3$，用反操作 $\\div 3$ 消除', en: 'Zhuge Liang: "Inner layer: $\\times 3$, reverse: $\\div 3$"' }, highlightField: 'x' },
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
      { text: { zh: '诸葛亮：代入就是——把字母换成数字', en: 'Zhuge Liang: "Substitution means replacing the letter with a number"' }, highlightField: 'ans' },
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
      { text: { zh: '赵云：含 $x^2$ 的式子——先算平方，再算乘法', en: 'Zhao Yun: "Expression with $x^2$ — square first, then multiply"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：$3x + 2x$——同类项合并：$3 + 2 = 5$，字母照抄 → $5x$', en: 'Zhuge Liang: "$3x + 2x$ — like terms: $3 + 2 = 5$, keep letter → $5x$"' }, highlightField: 'ans' },
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
    story: { zh: '曹操治军严明：本月军粮总计 {n} 石，前锋营立了战功，按规矩可以优先领取总粮草的 {pct}%。司库问曹操：到底拨多少石给前锋？', en: 'Cao Cao rules with discipline: this month\'s total grain is {n} units. The vanguard earned merit and gets {pct}% of the total supply first. The treasurer asks: how much goes to the vanguard?' },
    description: { zh: '求 ${n}$ 的 ${pct}\\%$ 是多少。', en: 'Find ${pct}\\%$ of ${n}$.' },
    data: { n: 200, pct: 25, answer: 50, generatorType: 'PERCENTAGE_OF_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.12-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '曹操：百分比就是"每一百份里取几份"', en: 'Cao Cao: "Percentage means out of every 100"' }, highlightField: 'ans' },
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
      { text: { zh: '曹操：增加 20% 就是乘以 1.2', en: 'Cao Cao: "Increase 20% means multiply by 1.2"' }, highlightField: 'ans' },
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
    story: { zh: '曹操的军令写着"步兵与骑兵按 12:8 配比"。谋士荀彧说："丞相，比例可以化简——12:8 就是 3:2，更简洁明了！"', en: 'Cao Cao\'s order reads "infantry to cavalry ratio 12:8." Advisor Xun Yu says: "My lord, simplify — 12:8 is just 3:2, much clearer!"' },
    description: { zh: '化简比，求最简比的第一项。', en: 'Simplify the ratio. Find the first term.' },
    data: { a: 12, b: 8, sa: 3, sb: 2, g: 4, answer: 3, mode: 'simplify', generatorType: 'RATIO_Y7_RANDOM' }, difficulty: 'Easy', reward: 45,
    kpId: 'kp-1.11-01', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '荀彧：化简比跟约分一样——找最大公因数', en: 'Xun Yu: "Simplifying ratios is like simplifying fractions — find the HCF"' }, highlightField: 'ans' },
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
    story: { zh: '攻城胜利后缴获 120 金！按功劳 2:3 分给前锋营和主力营。前锋营虽然人少但冲在最前面，应该分到多少？', en: 'After the siege, 120 gold is captured! Share between vanguard and main army in ratio 2:3. The vanguard charged first — how much do they get?' },
    description: { zh: '把总数按比例分配，求较小份。', en: 'Divide the total in the given ratio. Find the smaller share.' },
    data: { a: 2, b: 3, total: 120, answer: 48, mode: 'divide', generatorType: 'RATIO_Y7_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-1.11-02', sectionId: 'number',
    tutorialSteps: [
      { text: { zh: '曹操：按比分配——三步走', en: 'Cao Cao: "Divide by ratio — three steps"' }, highlightField: 'ans' },
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
      { text: { zh: '关羽：三角形内角和 = $180°$', en: 'Guan Yu: "Angles in a triangle sum to $180°$"' }, highlightField: 'x' },
      { text: { zh: '关羽：第三个角 = $180° - 60° - 50° = 70°$', en: 'Guan Yu: "Third angle = $180° - 60° - 50° = 70°$"' }, highlightField: 'x' },
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
      { text: { zh: '诸葛亮：想象你站在瞭望台正中央，转一整圈看遍所有方向', en: 'Zhuge Liang: "Imagine standing at the center of the watchtower, turning a full circle to see every direction"' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：已知的区域已经覆盖了多少度？', en: 'Zhuge Liang: "How many degrees are already covered?"' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：剩下的缺口就是未知角', en: 'Zhuge Liang: "The remaining gap is the unknown angle"' }, highlightField: 'x' },
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
      { text: { zh: '诸葛亮：坐标就是地图上的"地址"——用两个数字定位', en: 'Zhuge Liang: "Coordinates are the address on a map — two numbers pin a location"' }, highlightField: 'x' },
      { text: { zh: '诸葛亮：$x$ 往右为正，往左为负；$y$ 往上为正，往下为负', en: 'Zhuge Liang: "$x$: right = positive, left = negative; $y$: up = positive, down = negative"' }, highlightField: 'x' },
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
      { text: { zh: '赵云：坐标有四个象限——正负数的组合', en: 'Zhao Yun: "Four quadrants — combinations of positive and negative"' }, highlightField: 'x' },
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
      { text: { zh: '刘备：每天比前天多招 4 人——这就是"公差"', en: 'Liu Bei: "4 more each day — that\'s the common difference"' }, highlightField: 'ans' },
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
      { text: { zh: '赵云：通项公式 $a_n = a_1 + (n-1) \\times d$', en: 'Zhao Yun: "nth term formula: $a_n = a_1 + (n-1) \\times d$"' }, highlightField: 'ans' },
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
    story: { zh: '远征军的粮草每天消耗固定量。第一天有 30 石，每天减少 3 石。第 10 天还剩多少？什么时候彻底断粮？', en: 'The expedition army consumes a fixed amount of grain daily. Starting with 30 units, losing 3 each day. How much on day 10? When do supplies run out?' },
    description: { zh: '递减数列：求第 $n$ 项。', en: 'Decreasing sequence: find term $n$.' },
    data: { a1: 30, d: -3, n: 10, mode: 'nth', generatorType: 'SEQUENCE_Y7_RANDOM' }, difficulty: 'Medium', reward: 55,
    kpId: 'kp-2.7-03', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '赵云：公差可以是负数——每天减少就是"加一个负数"', en: 'Zhao Yun: "Common difference can be negative — daily decrease means adding a negative"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：四舍五入——看要舍去的那一位', en: 'Zhuge Liang: "Rounding — look at the digit being removed"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：大数估算——先找到要舍入的位', en: 'Zhuge Liang: "Large numbers — find the place value first"' }, highlightField: 'ans' },
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
      { text: { zh: '刘备：周长就是绕一圈的总长度', en: 'Liu Bei: "Perimeter is the total distance around"' }, highlightField: 'ans' },
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
      { text: { zh: '张飞：面积就是形状里面有多大', en: 'Zhang Fei: "Area is how much space is inside the shape"' }, highlightField: 'area' },
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
      { text: { zh: '赵云：三角形面积 = 底 × 高 ÷ 2', en: 'Zhao Yun: "Triangle area = base × height ÷ 2"' }, highlightField: 'area' },
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
      { text: { zh: '刘备：周长 = $2(长 + 宽)$，已知周长和宽，反推长', en: 'Liu Bei: "Perimeter = $2(l + w)$, known P and w, find l"' }, highlightField: 'x' },
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
    story: { zh: '赵云设计营地蓝图：长用公式 $2x + 3$ 表示，宽固定为 5。军师说 $x = 4$，算出营地面积！', en: 'Zhao Yun designs the camp: length is $2x + 3$, width is 5. The strategist says $x = 4$. Find the camp area!' },
    description: { zh: '先代入求长，再算面积。', en: 'Substitute to find length, then calculate area.' },
    data: { a: 2, b: 3, x: 4, answer: 55, mode: 'linear', expr: '2x + 3', generatorType: 'SUBSTITUTION_RANDOM' }, difficulty: 'Medium', reward: 60,
    kpId: 'kp-2.2-01', sectionId: 'algebra',
    tutorialSteps: [
      { text: { zh: '赵云：分两步走——先代入求长，再算面积', en: 'Zhao Yun: "Two steps: substitute to find length, then calculate area"' }, highlightField: 'ans' },
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
      { text: { zh: '张飞：众数就是出现次数最多的数——数据里的"人气王"', en: 'Zhang Fei: "Mode = the value appearing most — the \'most popular\' in the data"' }, highlightField: 'ans' },
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
      { text: { zh: '曹操：平均数 = 加起来 ÷ 个数', en: 'Cao Cao: "Mean = add them up ÷ how many"' }, highlightField: 'ans' },
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
      { text: { zh: '诸葛亮：先排序，再找中间', en: 'Zhuge Liang: "Sort first, then find the middle"' }, highlightField: 'ans' },
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
      { text: { zh: '张飞：极差 = 最大的 - 最小的', en: 'Zhang Fei: "Range = biggest − smallest"' }, highlightField: 'ans' },
    ],
    secret: { concept: { zh: '极差衡量数据的"分散程度"——差越大，数据越分散。', en: 'Range measures how spread out the data is — bigger range means more spread.' }, formula: '$\\text{Range} = \\text{Max} - \\text{Min}$', tips: [{ zh: '张飞提示：差距太大就要整训，差距小说明水平齐整！', en: 'Zhang Fei Tip: Big gap means more training needed!' }] },
    storyConsequence: { correct: { zh: '战力差距一目了然！张飞：整训计划安排上了！', en: 'Strength gap crystal clear! Zhang Fei: Training plan is set!' }, wrong: { zh: '数据分析有误，整训方向搞错了…', en: 'Data analysis wrong — training focus is off...' } },
  },
];
