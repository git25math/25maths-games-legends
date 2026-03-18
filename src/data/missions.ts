import type { Mission } from '../types';

export const MISSIONS: Mission[] = [
  // --- Year 7 Unit 0: 桃园点兵·数论篇 (Number Foundations) ---
  {
    id: 701, grade: 7, unitId: 0, order: 1,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'HCF',
    title: { zh: '整编队伍', en: 'Organizing Troops' },
    skillName: { zh: '公因数术', en: 'Common Factor' },
    skillSummary: { zh: 'HCF：质因数分解后取公共质因数的最低次幂', en: 'HCF: prime factorize, then take common primes to lowest power' },
    story: { zh: '桃园结义后，刘关张三兄弟开始整编队伍。现有两营士兵，要分成人数相同的小队操练。', en: 'After the oath, the three brothers organize their troops. Two camps must be split into equal-sized squads.' },
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
        text: { zh: '刘备："取公共质因数的最低次幂：$2^2 \\times 3 = 12$"', en: 'Liu Bei: "Take common primes to lowest power: $2^2 \\times 3 = 12$"' },
        hint: { zh: '公共质因数是 2 和 3\n2 的最低次幂是 $2^2$（取 24 的）\n3 的最低次幂是 $3^1$（取 24 的）', en: 'Common primes are 2 and 3\nLowest power of 2 is $2^2$ (from 24)\nLowest power of 3 is $3^1$ (from 24)' },
        highlightField: 'ans'
      },
      {
        text: { zh: '刘备："所以 HCF(24, 36) = 12！每队 12 人，整编完毕！"', en: 'Liu Bei: "So HCF(24, 36) = 12! 12 soldiers per squad, troops organized!"' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: 'HCF 是两个数共有的最大因数。', en: 'HCF is the largest factor common to both numbers.' }, formula: '$\\text{HCF}: \\text{取公共质因数的最低次幂}$', tips: [{ zh: '刘备提示：队伍整齐，方能出征。', en: 'Liu Bei Tip: Well-organized troops are ready to march.' }] }
  },
  {
    id: 702, grade: 7, unitId: 0, order: 2,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'LCM',
    title: { zh: '巡营排班', en: 'Patrol Schedule' },
    skillName: { zh: '公倍数术', en: 'Common Multiple' },
    skillSummary: { zh: 'LCM：质因数分解后取所有质因数的最高次幂', en: 'LCM: prime factorize, then take all primes to highest power' },
    story: { zh: '三位将军分别每隔一段时间巡营。需要安排所有人同时巡营的日子。', en: 'Three generals patrol at different intervals. Find when they all patrol together.' },
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
        text: { zh: '关羽："取所有质因数的最高次幂：$2^3 \\times 3 = 24$"', en: 'Guan Yu: "Take all primes to highest power: $2^3 \\times 3 = 24$"' },
        hint: { zh: '出现过的质因数是 2 和 3\n2 的最高次幂是 $2^3$（取 8 的）\n3 的最高次幂是 $3^1$（取 6 的）', en: 'Primes that appear are 2 and 3\nHighest power of 2 is $2^3$ (from 8)\nHighest power of 3 is $3^1$ (from 6)' },
        highlightField: 'ans'
      },
      {
        text: { zh: '关羽："所以 LCM(6, 8) = 24！每 24 天我们同时巡营！"', en: 'Guan Yu: "So LCM(6, 8) = 24! We both patrol together every 24 days!"' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: 'LCM 是两个数共有的最小倍数。', en: 'LCM is the smallest number divisible by both.' }, formula: '$\\text{LCM}: \\text{取所有质因数的最高次幂}$', tips: [{ zh: '关羽提示：排班有序，方能守备森严。', en: 'Guan Yu Tip: Orderly schedules make strong defenses.' }] }
  },
  {
    id: 703, grade: 7, unitId: 0, order: 3,
    unitTitle: { zh: "Unit 0: 桃园点兵·数论篇", en: "Unit 0: Peach Garden — Number Theory" },
    topic: 'Algebra', type: 'HCF',
    title: { zh: '平分军粮', en: 'Dividing Grain Equally' },
    skillName: { zh: '因数分解术', en: 'Factorization' },
    skillSummary: { zh: '用 HCF 解决实际均分问题', en: 'Use HCF to solve real equal-sharing problems' },
    story: { zh: '桃园起义前，需要把军粮和兵器分给各村。要保证每村分到的数量完全相同。', en: 'Before the uprising, grain and weapons must be distributed equally to villages.' },
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
        hint: { zh: '5 只出现在 60 里，不是公共因数\n所以不算进 HCF', en: '5 only appears in 60, not a common factor\nSo it is not included in HCF' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张飞："HCF(48, 60) = 12！分给 12 个村，每村 4 袋粮 5 把刀！"', en: 'Zhang Fei: "HCF(48, 60) = 12! Split among 12 villages, each gets 4 bags of grain and 5 swords!"' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: 'HCF 用于解决平均分配问题。', en: 'HCF solves equal distribution problems.' }, formula: '$\\text{HCF}(48, 60) = 2^2 \\times 3 = 12$', tips: [{ zh: '张飞提示：粮草不均，军心不稳！', en: 'Zhang Fei Tip: Unequal rations cause unrest!' }] }
  },
  // --- Year 7: The Peach Garden Oath (Foundations) ---
  {
    id: 711, grade: 7, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '桃园结义', en: 'Oath in the Garden' },
    skillName: { zh: '等式平衡术', en: 'Equation Balance' },
    skillSummary: { zh: '等式两边同时加减同一个数，等号保持不变', en: 'Add or subtract the same number from both sides, the equation stays balanced' },
    story: { zh: '刘关张三人结义，需平分美酒。已知总酒量为 $x+{a}={result}$。', en: 'Three brothers share wine. Total amount: $x+{a}={result}$.' },
    description: { zh: '解方程 $x+{a}={result}$，求 $x$。', en: 'Solve $x+{a}={result}$ for $x$.' },
    data: { x: 7, a: 5, result: 12, generatorType: 'SIMPLE_EQ_ADD_RANDOM' }, difficulty: 'Easy', reward: 50,
    kpId: 'kp-2.1-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮："三位将军结义，需平分美酒。方程 $x+5=12$ 中，$x$ 是每人的酒量。"', en: 'Zhuge Liang: "Three brothers share wine. In $x+5=12$, $x$ is each person\'s share."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："等式两边同时减去 5：$x = 12 - 5$"', en: 'Zhuge Liang: "Subtract 5 from both sides: $x = 12 - 5$"' },
        hint: { zh: '12 减去 5 等于多少？', en: 'What is 12 minus 5?' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："所以 $x = 7$！每人分得 7 斛美酒。结义成功！"', en: 'Zhuge Liang: "So $x = 7$! Each gets 7 units of wine. The oath is sealed!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '等式两边同时加减同一个数，等式依然成立。', en: 'Adding or subtracting the same number from both sides keeps the equation balanced.' }, formula: '$x + a = b \\Rightarrow x = b - a$', tips: [{ zh: '刘备提示：兄弟同心，其利断金。', en: 'Liu Tip: Unity is strength.' }] }
  },
  {
    id: 712, grade: 7, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 结义与代数入门", en: "Unit 1: Oath & Intro to Algebra" },
    topic: 'Algebra', type: 'SIMPLE_EQ',
    title: { zh: '招兵买马', en: 'Recruiting Soldiers' },
    skillName: { zh: '方程破解术', en: 'Equation Solver' },
    skillSummary: { zh: '等式两边同时乘除同一个非零数', en: 'Multiply or divide both sides by the same non-zero number' },
    story: { zh: '为了起义，需要购买兵器。已知 {a} 把长剑的价格是 {result} 金，即 ${a}x={result}$。', en: 'To start the rebellion, weapons are needed. {a} swords cost {result} gold: ${a}x={result}$.' },
    description: { zh: '解方程 ${a}x={result}$，求单价 $x$。', en: 'Solve ${a}x={result}$ for the unit price $x$.' },
    data: { x: 5, a: 3, result: 15, generatorType: 'SIMPLE_EQ_RANDOM' }, difficulty: 'Easy', reward: 60,
    kpId: 'kp-2.5-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '关羽："兄长，三把剑共需 15 金。方程 $3x=15$ 中，$x$ 代表每把剑的价格。"', en: 'Guan Yu: "Brother, three swords cost 15 gold. In $3x=15$, $x$ is the price per sword."' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽："等式两边同时除以 3：$x = 15 \\div 3$"', en: 'Guan Yu: "Divide both sides by 3: $x = 15 \\div 3$"' },
        hint: { zh: '15 除以 3 等于多少？', en: 'What is 15 divided by 3?' },
        highlightField: 'x'
      },
      {
        text: { zh: '关羽："所以 $x = 5$！每把剑 5 金，公道价！"', en: 'Guan Yu: "So $x = 5$! 5 gold per sword, a fair price!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '等式两边同时乘除同一个非零数，等式依然成立。', en: 'Multiplying or dividing both sides by the same non-zero number keeps the equation balanced.' }, formula: '$ax = b \\Rightarrow x = b/a$', tips: [{ zh: '张飞提示：俺老张买东西从不讲价，但一定要算清楚！', en: 'Zhang Fei Tip: I never haggle, but I always count correctly!' }] }
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
        text: { zh: '曹操："粮草乃军中命脉。$2x = 24$ 中，$x$ 是每份军粮数量。"', en: 'Cao Cao: "Supplies are the army\'s lifeline. In $2x = 24$, $x$ is each portion of grain."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："两边同时除以 2：$x = 24 \\div 2$"', en: 'Cao Cao: "Divide both sides by 2: $x = 24 \\div 2$"' },
        hint: { zh: '24 除以 2 等于多少？', en: 'What is 24 divided by 2?' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："$x = 12$！每份军粮 12 斛，分配完毕。"', en: 'Cao Cao: "$x = 12$! 12 units of grain per share, distribution complete."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '比例是代数的基础。', en: 'Ratios are the foundation of algebra.' }, formula: '$ax = b \\Rightarrow x = b/a$', tips: [{ zh: '关羽提示：公平分配，方能稳定军心。', en: 'Guan Yu Tip: Fair distribution keeps the army stable.' }] }
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
        text: { zh: '张飞："五个村庄，征调 100 人！$5x = 100$，$x$ 就是每村出的人数。"', en: 'Zhang Fei: "Five villages, drafting 100 people! In $5x = 100$, $x$ is the number per village."' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞："两边都除以 5：$x = 100 \\div 5$"', en: 'Zhang Fei: "Divide both sides by 5: $x = 100 \\div 5$"' },
        hint: { zh: '100 除以 5 等于多少？', en: 'What is 100 divided by 5?' },
        highlightField: 'x'
      },
      {
        text: { zh: '张飞："$x = 20$！每村出 20 人，公平合理！"', en: 'Zhang Fei: "$x = 20$! 20 people per village, fair and square!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '除法是乘法的逆运算。', en: 'Division is the inverse of multiplication.' }, formula: '$x = \\frac{b}{a}$', tips: [{ zh: '张昭提示：内政管理，贵在精准。', en: 'Zhang Zhao Tip: Internal management relies on precision.' }] }
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
        text: { zh: '吕布："虎牢关城墙一侧角度为 $120^\\circ$，要布置弩床，须知其补角。"', en: 'Lu Bu: "The wall angle at Hulao Pass is $120^\\circ$. To place the ballista, we need the supplementary angle."' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布："补角之和为 $180^\\circ$，所以 $x = 180 - 120$"', en: 'Lu Bu: "Supplementary angles sum to $180^\\circ$, so $x = 180 - 120$"' },
        hint: { zh: '180 减去 120 等于多少？', en: 'What is 180 minus 120?' },
        highlightField: 'x'
      },
      {
        text: { zh: '吕布："$x = 60^\\circ$！弩床角度确定，万箭齐发！"', en: 'Lu Bu: "$x = 60^\\circ$! Ballista angle set, fire at will!"' },
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
        text: { zh: '高顺："两座箭塔的射击线成直角，一个角为 $35^\\circ$，须求另一个角。"', en: 'Gao Shun: "Two towers form a right angle. One angle is $35^\\circ$, find the other."' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺："余角之和为 $90^\\circ$，所以 $x = 90 - 35$"', en: 'Gao Shun: "Complementary angles sum to $90^\\circ$, so $x = 90 - 35$"' },
        hint: { zh: '90 减去 35 等于多少？', en: 'What is 90 minus 35?' },
        highlightField: 'x'
      },
      {
        text: { zh: '高顺："$x = 55^\\circ$！交叉火力覆盖完美！陷阵营，出击！"', en: 'Gao Shun: "$x = 55^\\circ$! Crossfire coverage is perfect! Camp Crushers, attack!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '余角之和为 $90^\\circ$。', en: 'Complementary angles sum to $90^\\circ$.' }, formula: '$x + y = 90^\\circ$', tips: [{ zh: '高顺提示：陷阵营，角度必争！', en: 'Gao Shun Tip: For the Camp Crushers, every angle counts!' }] }
  },
  {
    id: 733, grade: 7, unitId: 3, order: 3,
    unitTitle: { zh: "Unit 3: 关隘与角度", en: "Unit 3: Passes & Angles" },
    topic: 'Geometry', type: 'ANGLES',
    title: { zh: '八卦阵位', en: 'Eight Trigrams Position' },
    skillName: { zh: '角度推演术', en: 'Angle Deduction' },
    skillSummary: { zh: '已知一角求其补角或余角', en: 'Find supplementary or complementary angle' },
    story: { zh: '布置八卦阵。已知阵法中心发出的两个方位角互为补角，其中一个是 ${angle}^\\circ$。', en: 'Setting up the Eight Trigrams. Two central angles are supplementary, one is ${angle}^\\circ$.' },
    description: { zh: '求另一个角 $x$。', en: 'Find the other angle $x$.' },
    data: { angle: 45, total: 180, generatorType: 'ANGLES_RANDOM' }, difficulty: 'Medium', reward: 90,
    kpId: 'kp-4.6-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮："八卦阵中，两个方位角互为补角。已知一角 $45^\\circ$，须求另一角。"', en: 'Zhuge Liang: "In the Eight Trigrams, two bearing angles are supplementary. One is $45^\\circ$, find the other."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："补角之和为 $180^\\circ$。因此 $x = 180 - 45$"', en: 'Zhuge Liang: "Supplementary angles sum to $180^\\circ$. So $x = 180 - 45$"' },
        hint: { zh: '180 减去 45 等于多少？', en: 'What is 180 minus 45?' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："$x = 135^\\circ$！阵法变幻莫测，皆在术数之间。"', en: 'Zhuge Liang: "$x = 135^\\circ$! The formation changes are all in the numbers."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '补角之和为 $180^\\circ$。', en: 'Supplementary angles sum to $180^\\circ$.' }, formula: '$x = 180 - 45$', tips: [{ zh: '诸葛亮提示：阵法变幻，皆在术数。', en: 'Zhuge Tip: The changes in the formation are all in the numbers.' }] }
  },

  // --- Year 8: The Yellow Turban Rebellion (Expansion) ---
  {
    id: 811, grade: 8, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 进军与线性方程", en: "Unit 1: Marching & Linear Equations" },
    topic: 'Functions', type: 'LINEAR',
    title: { zh: '急行军', en: 'Forced March' },
    skillName: { zh: '行军路线术', en: 'March Route' },
    skillSummary: { zh: '斜率 m = (y₂-y₁)/(x₂-x₁)，截距 c = y₁ - mx₁', en: 'Slope m = (y₂-y₁)/(x₂-x₁), intercept c = y₁ - mx₁' },
    story: { zh: '黄巾军作乱，曹操率部急行军。已知出发点为 $({x1}, {y1})$，1小时后到达 $({x2}, {y2})$。', en: "Yellow Turbans are rebelling. Cao Cao leads a forced march. Start at $({x1}, {y1})$, reach $({x2}, {y2})$ in 1 hour." },
    description: { zh: '求行军路线的函数表达式 $y = mx + c$。', en: 'Find the function $y = mx + c$ for the march route.' },
    data: { points: [[0, 2], [1, 5]], x1: 0, y1: 2, x2: 1, y2: 5, generatorType: 'LINEAR_RANDOM' }, difficulty: 'Medium', reward: 150,
    kpId: 'kp-3.5-01', sectionId: 'functions',
    tutorialSteps: [
      {
        text: { zh: '曹操："急行军路线经过 $(0,2)$ 和 $(1,5)$ 两点。先求斜率 $m$。"', en: 'Cao Cao: "The march route passes through $(0,2)$ and $(1,5)$. First find the slope $m$."' },
        highlightField: 'm'
      },
      {
        text: { zh: '曹操："$m = (5-2)/(1-0) = 3$。斜率就是行军速度！再看截距 $c$。"', en: 'Cao Cao: "$m = (5-2)/(1-0) = 3$. The slope is the march speed! Now the intercept $c$."' },
        hint: { zh: '起点 $(0,2)$ 的 $y$ 值就是截距 $c$', en: 'The $y$ value at starting point $(0,2)$ is the intercept $c$' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹操："$c = 2$！行军路线为 $y = 3x + 2$。兵贵神速！"', en: 'Cao Cao: "$c = 2$! The march route is $y = 3x + 2$. Speed is vital!"' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '斜率 $m$ 代表变化率，截距 $c$ 代表初始值。', en: 'Slope $m$ is the rate of change, intercept $c$ is the initial value.' }, formula: '$m = \\frac{y_2 - y_1}{x_2 - x_1},\\quad c = y_1 - mx_1$', tips: [{ zh: '曹操提示：兵贵神速，路线必须精准！', en: 'Cao Tip: Speed is vital, the route must be precise!' }] }
  },
  {
    id: 812, grade: 8, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 进军与线性方程", en: "Unit 1: Marching & Linear Equations" },
    topic: 'Functions', type: 'FUNC_VAL',
    title: { zh: '追击哨兵', en: 'Intercepting Scouts' },
    skillName: { zh: '追击函数术', en: 'Pursuit Function' },
    skillSummary: { zh: '代入求函数值', en: 'Substitute to find function value' },
    story: { zh: '发现敌军哨兵！哨兵位置符合 $y = {m}x + {b}$，我军需在 $x={x}$ 处拦截。', en: "Enemy scouts spotted! Their position follows $y = {m}x + {b}$. Intercept at $x={x}$." },
    description: { zh: '计算拦截点的 $y$ 坐标。', en: 'Calculate the $y$ coordinate of the intercept point.' },
    data: { m: 1, b: 4, x: 2, generatorType: 'FUNC_VAL_RANDOM' }, difficulty: 'Medium', reward: 160,
    kpId: 'kp-3.5-01', sectionId: 'functions',
    tutorialSteps: [
      {
        text: { zh: '夏侯惇："哨兵位置符合 $y = x + 4$，需在 $x=2$ 处拦截。"', en: 'Xiahou Dun: "Scout position follows $y = x + 4$. Intercept at $x=2$."' },
        highlightField: 'y'
      },
      {
        text: { zh: '夏侯惇："将 $x=2$ 代入函数：$y = 2 + 4$"', en: 'Xiahou Dun: "Substitute $x=2$ into the function: $y = 2 + 4$"' },
        hint: { zh: '2 加 4 等于多少？', en: 'What is 2 plus 4?' },
        highlightField: 'y'
      },
      {
        text: { zh: '夏侯惇："$y = 6$！拦截点坐标为 $(2, 6)$。锁定目标，绝不放过！"', en: 'Xiahou Dun: "$y = 6$! Intercept point is $(2, 6)$. Lock on target, let no one escape!"' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '函数值随自变量变化。', en: 'Function values change with the independent variable.' }, formula: '$y = f(x)$', tips: [{ zh: '夏侯惇提示：锁定目标，绝不放过！', en: 'Xiahou Dun Tip: Lock on target, let no one escape!' }] }
  },
  {
    id: 813, grade: 8, unitId: 1, order: 3,
    unitTitle: { zh: "Unit 1: 进军与线性方程", en: "Unit 1: Marching & Linear Equations" },
    topic: 'Functions', type: 'LINEAR',
    title: { zh: '合围之势', en: 'Encirclement' },
    skillName: { zh: '合围路线术', en: 'Encirclement Route' },
    skillSummary: { zh: '直线方程 y = mx + c', en: 'Line equation y = mx + c' },
    story: { zh: '两路大军合围。已知路线经过 $({x1}, {y1})$ 和 $({x2}, {y2})$。', en: 'Two armies encircle. The route passes through $({x1}, {y1})$ and $({x2}, {y2})$.' },
    description: { zh: '求斜率 $m$。', en: 'Find the slope $m$.' },
    data: { points: [[2, 10], [4, 18]], x1: 2, y1: 10, x2: 4, y2: 18, generatorType: 'LINEAR_RANDOM' }, difficulty: 'Medium', reward: 170,
    kpId: 'kp-3.3-01', sectionId: 'functions',
    tutorialSteps: [
      {
        text: { zh: '曹仁："合围路线经过 $(2,10)$ 和 $(4,18)$。先求斜率 $m$。"', en: 'Cao Ren: "The encirclement route passes through $(2,10)$ and $(4,18)$. Find slope $m$."' },
        highlightField: 'm'
      },
      {
        text: { zh: '曹仁："斜率公式：$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{18-10}{4-2}$"', en: 'Cao Ren: "Slope formula: $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{18-10}{4-2}$"' },
        hint: { zh: '8 除以 2 等于多少？', en: 'What is 8 divided by 2?' },
        highlightField: 'm'
      },
      {
        text: { zh: '曹仁："$m = 4$！然后求截距 $c = y_1 - mx_1 = 10 - 4 \\times 2 = 2$"', en: 'Cao Ren: "$m = 4$! Then intercept $c = y_1 - mx_1 = 10 - 4 \\times 2 = 2$"' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '斜率公式：$m = \\frac{y_2 - y_1}{x_2 - x_1}$。', en: 'Slope formula: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.' }, formula: '$m = \\frac{y_2 - y_1}{x_2 - x_1},\\quad c = y_1 - mx_1$', tips: [{ zh: '曹仁提示：守如泰山，攻如雷霆。', en: 'Cao Ren Tip: Defend like a mountain, attack like thunder.' }] }
  },
  {
    id: 821, grade: 8, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 营地与几何面积", en: "Unit 2: Camps & Geometric Area" },
    topic: 'Geometry', type: 'AREA',
    title: { zh: '安营扎寨', en: 'Setting Camp' },
    skillName: { zh: '面积丈量术', en: 'Area Measurement' },
    skillSummary: { zh: '长方形面积 = 长 × 宽', en: 'Rectangle area = length × width' },
    story: { zh: '为了抵御黄巾军，需要建立一个长方形营地。长为 {length} 丈，宽为 {width} 丈。', en: 'To defend against rebels, a rectangular camp is needed. Length {length}, Width {width}.' },
    description: { zh: '计算营地的总面积。', en: 'Calculate the total area of the camp.' },
    data: { length: 20, width: 15, generatorType: 'AREA_RECT_RANDOM' }, difficulty: 'Easy', reward: 100,
    kpId: 'kp-5.2-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '荀彧："营地为长方形，长 20 丈，宽 15 丈。面积公式为长乘宽。"', en: 'Xun Yu: "The camp is rectangular, length 20, width 15. Area = length times width."' },
        highlightField: 'area'
      },
      {
        text: { zh: '荀彧："$Area = 20 \\times 15$"', en: 'Xun Yu: "$Area = 20 \\times 15$"' },
        hint: { zh: '20 乘以 15 等于多少？', en: 'What is 20 times 15?' },
        highlightField: 'area'
      },
      {
        text: { zh: '荀彧："面积为 300 平方丈！营地规划完毕。"', en: 'Xun Yu: "The area is 300 square units! Camp planning is complete."' },
        highlightField: 'area'
      }
    ],
    secret: { concept: { zh: '长方形面积等于长乘以宽。', en: 'Area of a rectangle is length times width.' }, formula: '$Area = L \\times W$', tips: [{ zh: '荀彧提示：合理的营地布局是防守的关键。', en: 'Xun Yu Tip: A well-planned camp is key to defense.' }] }
  },
  {
    id: 822, grade: 8, unitId: 2, order: 2,
    unitTitle: { zh: "Unit 2: 营地与几何面积", en: "Unit 2: Camps & Geometric Area" },
    topic: 'Geometry', type: 'VOLUME',
    title: { zh: '修筑粮仓', en: 'Building Granaries' },
    skillName: { zh: '粮仓容积术', en: 'Granary Volume' },
    skillSummary: { zh: '圆柱体积公式', en: 'Cylinder volume formula' },
    story: { zh: '建立圆柱形粮仓。底面半径 {radius} 丈，高 {height} 丈。', en: 'Build a cylindrical granary. Base radius {radius}, height {height}.' },
    description: { zh: '计算体积：$V = \\pi r^2 h$（取 $\\pi = 3$）。', en: 'Calculate volume: $V = \\pi r^2 h$ (use $\\pi = 3$).' },
    data: { radius: 5, height: 10, pi: 3, generatorType: 'VOLUME_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-5.4-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '满宠："粮仓为圆柱形，半径 5 丈，高 10 丈。体积公式为 $V = \\pi r^2 h$。"', en: 'Man Chong: "The granary is cylindrical, radius 5, height 10. Volume formula: $V = \\pi r^2 h$."' },
        highlightField: 'v'
      },
      {
        text: { zh: '满宠："先算底面积：$\\pi r^2 = 3 \\times 5^2 = 75$"', en: 'Man Chong: "First calculate base area: $\\pi r^2 = 3 \\times 5^2 = 75$"' },
        hint: { zh: '再乘以高度 10', en: 'Then multiply by height 10' },
        highlightField: 'v'
      },
      {
        text: { zh: '满宠："$V = 75 \\times 10 = 750$ 立方丈！粮仓越深，存粮越多。"', en: 'Man Chong: "$V = 75 \\times 10 = 750$ cubic units! The deeper the granary, the more grain it holds."' },
        highlightField: 'v'
      }
    ],
    secret: { concept: { zh: '圆柱体积等于底面积乘以高。', en: 'Cylinder volume is base area times height.' }, formula: '$V = \\pi r^2 h$', tips: [{ zh: '满宠提示：粮仓越深，存粮越多。', en: 'Man Chong Tip: The deeper the granary, the more grain it holds.' }] }
  },
  {
    id: 823, grade: 8, unitId: 2, order: 3,
    unitTitle: { zh: "Unit 2: 营地与几何面积", en: "Unit 2: Camps & Geometric Area" },
    topic: 'Geometry', type: 'AREA',
    title: { zh: '点将台', en: 'Command Platform' },
    skillName: { zh: '梯形面积术', en: 'Trapezoid Area' },
    skillSummary: { zh: '梯形面积 = (上底+下底)×高÷2', en: 'Trapezoid area = (top+bottom)×height÷2' },
    story: { zh: '修筑一个梯形点将台。上底 {a} 丈，下底 {b} 丈，高 {h} 丈。', en: 'Build a trapezoidal platform. Top base {a}, bottom base {b}, height {h}.' },
    description: { zh: '计算梯形面积：$(a+b)h/2$。', en: 'Calculate trapezoid area: $(a+b)h/2$.' },
    data: { a: 10, b: 20, h: 8, generatorType: 'AREA_TRAP_RANDOM' }, difficulty: 'Medium', reward: 190,
    kpId: 'kp-5.2-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '袁绍："点将台为梯形。上底 10 丈，下底 20 丈，高 8 丈。"', en: 'Yuan Shao: "The platform is trapezoidal. Top 10, bottom 20, height 8."' },
        highlightField: 'area'
      },
      {
        text: { zh: '袁绍："梯形面积公式：$A = (a+b) \\times h / 2 = (10+20) \\times 8 / 2$"', en: 'Yuan Shao: "Trapezoid area: $A = (a+b) \\times h / 2 = (10+20) \\times 8 / 2$"' },
        hint: { zh: '先算 $(10+20) = 30$，再算 $30 \\times 8 / 2$', en: 'First $(10+20) = 30$, then $30 \\times 8 / 2$' },
        highlightField: 'area'
      },
      {
        text: { zh: '袁绍："面积为 120 平方丈！点将台必须高大威严！"', en: 'Yuan Shao: "Area is 120 square units! The platform must be grand and majestic!"' },
        highlightField: 'area'
      }
    ],
    secret: { concept: { zh: '梯形面积是底之和乘以高的一半。', en: 'Trapezoid area is sum of bases times half the height.' }, formula: '$A = (a+b)h/2$', tips: [{ zh: '袁绍提示：点将台一定要高大威严！', en: 'Yuan Shao Tip: The platform must be grand and majestic!' }] }
  },
  {
    id: 831, grade: 8, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 赋税与百分比", en: "Unit 3: Tax & Percentages" },
    topic: 'Algebra', type: 'PERCENTAGE',
    title: { zh: '征收粮税', en: 'Collecting Grain Tax' },
    skillName: { zh: '百分比征税术', en: 'Percentage Tax' },
    skillSummary: { zh: '加税 = 原价 × (1 + 百分比)', en: 'Tax = original × (1 + rate)' },
    story: { zh: '曹操在兖州推行屯田。已知农户产粮 {initial} 斛，加征 {pct}% 后，总产出为多少？', en: 'Cao Cao implements tuntian. A farmer yields {initial}, after adding {pct}% tax, what is the total?' },
    description: { zh: '计算总额：${initial} \\times (1 + {pct}\\%)$。', en: 'Calculate total: ${initial} \\times (1 + {pct}\\%)$.' },
    data: { initial: 1000, pct: 40, rate: 0.4, years: 1, generatorType: 'PERCENTAGE_RANDOM' }, difficulty: 'Easy', reward: 150,
    kpId: 'kp-1.13-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '枣祗："屯田之策，产粮 1000 斛，税率 40%。"', en: 'Zao Zhi: "Tuntian policy: yield 1000 units, tax rate 40%."' },
        highlightField: 'ans'
      },
      {
        text: { zh: '枣祗："百分比计算：$1000 \\times 0.4$"', en: 'Zao Zhi: "Percentage calculation: $1000 \\times 0.4$"' },
        hint: { zh: '1000 乘以 0.4 等于多少？', en: 'What is 1000 times 0.4?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '枣祗："应缴粮税 400 斛！屯田之策，乃强兵之本。"', en: 'Zao Zhi: "Tax amount is 400 units! Tuntian is the foundation of a strong army."' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '百分比是分母为 100 的分数。', en: 'Percentage is a fraction with denominator 100.' }, formula: '$Tax = Total \\times Rate$', tips: [{ zh: '枣祗提示：屯田之策，乃强兵之本。', en: 'Zao Zhi Tip: The tuntian policy is the foundation of a strong army.' }] }
  },
  {
    id: 832, grade: 8, unitId: 3, order: 2,
    unitTitle: { zh: "Unit 3: 赋税与百分比", en: "Unit 3: Tax & Percentages" },
    topic: 'Algebra', type: 'PERCENTAGE',
    title: { zh: '军备折扣', en: 'Armament Discount' },
    skillName: { zh: '折扣计算术', en: 'Discount Calculation' },
    skillSummary: { zh: '折后价 = 原价 × (1 - 百分比)', en: 'Discounted = original × (1 - rate)' },
    story: { zh: '购买一批精铁。原价 {initial} 金，由于大批量采购，商家给予 {pct}% 的折扣。', en: 'Buying fine iron. Original price {initial}, {pct}% discount for bulk.' },
    description: { zh: '计算折后价格：${initial} \\times (1 - {pct}\\%)$。', en: 'Calculate discounted price: ${initial} \\times (1 - {pct}\\%)$.' },
    data: { initial: 5000, pct: 15, rate: -0.15, years: 1, generatorType: 'PERCENTAGE_RANDOM' }, difficulty: 'Medium', reward: 180,
    kpId: 'kp-1.13-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '韩浩："精铁原价 5000 金，打八五折（15% 折扣）。"', en: 'Han Hao: "Fine iron costs 5000 gold, with a 15% discount."' },
        highlightField: 'ans'
      },
      {
        text: { zh: '韩浩："折后价 = 原价 $\\times$ (1 - 折扣率) = $5000 \\times 0.85$"', en: 'Han Hao: "Discounted price = Original $\\times$ (1 - discount rate) = $5000 \\times 0.85$"' },
        hint: { zh: '5000 乘以 0.85 等于多少？', en: 'What is 5000 times 0.85?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '韩浩："折后价为 4250 金！精打细算，方能支撑长久战事。"', en: 'Han Hao: "Discounted price is 4250 gold! Careful planning supports long-term warfare."' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '折扣是在原价基础上减去的百分比。', en: 'Discount is a percentage subtracted from the original price.' }, formula: '$Price = Original \\times (1 - Discount)$', tips: [{ zh: '韩浩提示：精打细算，方能支撑长久战事。', en: 'Han Hao Tip: Careful planning supports long-term warfare.' }] }
  },
  {
    id: 841, grade: 8, unitId: 4, order: 1,
    unitTitle: { zh: "Unit 4: 军籍与数据", en: "Unit 4: Census & Data" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '士兵平均年龄', en: 'Average Soldier Age' },
    skillName: { zh: '军情统计术', en: 'Military Statistics' },
    skillSummary: { zh: '平均值 = 总和 ÷ 个数', en: 'Mean = sum ÷ count' },
    story: { zh: '统计一队精锐士兵的年龄：20, 22, 24, 26, 28。', en: "Stats for elite soldiers' ages: 20, 22, 24, 26, 28." },
    description: { zh: '计算平均年龄（Mean）。', en: 'Calculate the Mean age.' },
    data: { values: [20, 22, 24, 26, 28], mode: 'mean', generatorType: 'STATISTICS_MEAN_RANDOM' }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-9.3-01', sectionId: 'statistics',
    tutorialSteps: [
      {
        text: { zh: '满宠："统计精锐士兵年龄：20, 22, 24, 26, 28。求平均年龄。"', en: 'Man Chong: "Elite soldier ages: 20, 22, 24, 26, 28. Find the mean."' },
        highlightField: 'ans'
      },
      {
        text: { zh: '满宠："平均数 = 所有数之和 $\\div$ 个数 = $(20+22+24+26+28) \\div 5$"', en: 'Man Chong: "Mean = sum of all values $\\div$ count = $(20+22+24+26+28) \\div 5$"' },
        hint: { zh: '总和为 120，除以 5 等于多少？', en: 'Sum is 120, divided by 5 equals?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '满宠："平均年龄为 24 岁！了解士兵，方能用兵如神。"', en: 'Man Chong: "The mean age is 24! Know your soldiers to lead them like a god."' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '平均数是所有数值之和除以个数。', en: 'Mean is the sum of all values divided by the count.' }, formula: '$\\bar{x} = \\sum x / n$', tips: [{ zh: '满宠提示：了解士兵，方能用兵如神。', en: 'Man Chong Tip: Know your soldiers to lead them like a god.' }] }
  },
  {
    id: 842, grade: 8, unitId: 4, order: 2,
    unitTitle: { zh: "Unit 4: 军籍与数据", en: "Unit 4: Census & Data" },
    topic: 'Statistics', type: 'STATISTICS',
    title: { zh: '身高分布', en: 'Height Distribution' },
    skillName: { zh: '身高中位术', en: 'Height Median' },
    skillSummary: { zh: '排序后找中间值', en: 'Sort and find the middle value' },
    story: { zh: '测量亲卫队的身高（丈）：1.7, 1.8, 1.8, 1.9, 2.0。', en: 'Measuring guard heights: 1.7, 1.8, 1.8, 1.9, 2.0.' },
    description: { zh: '计算中位数（Median）。', en: 'Calculate the Median height.' },
    data: { values: [1.7, 1.8, 1.8, 1.9, 2.0], mode: 'median', generatorType: 'STATISTICS_MEDIAN_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-9.3-01', sectionId: 'statistics',
    tutorialSteps: [
      {
        text: { zh: '典韦："亲卫队身高：1.7, 1.8, 1.8, 1.9, 2.0。求中位数。"', en: 'Dian Wei: "Guard heights: 1.7, 1.8, 1.8, 1.9, 2.0. Find the median."' },
        highlightField: 'ans'
      },
      {
        text: { zh: '典韦："先排序（已排好），再找中间那个数。5 个数，中间是第 3 个。"', en: 'Dian Wei: "Sort first (already sorted), then find the middle value. 5 numbers, middle is the 3rd."' },
        hint: { zh: '第 3 个数是多少？', en: 'What is the 3rd number?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '典韦："中位数是 1.8！俺这身高 2.0，在队里数一数二！"', en: 'Dian Wei: "The median is 1.8! My height of 2.0 is among the top!"' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '中位数是将数据按大小排列后处于中间位置的数。', en: 'Median is the middle value when data is sorted.' }, formula: 'Sorted: 1.7, 1.8, 1.8, 1.9, 2.0', tips: [{ zh: '典韦提示：俺这身高，在队里也是数一数二的！', en: 'Dian Wei Tip: My height is among the top in the squad!' }] }
  },

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
        text: { zh: '郭嘉："官渡之战前，粮草为 $3^2 \\times 3^3$。同底数幂相乘，指数相加。"', en: 'Guo Jia: "Before Guandu, grain is $3^2 \\times 3^3$. Same base powers multiply: add exponents."' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："$3^2 \\times 3^3 = 3^{2+3} = 3^x$，所以 $x = 2 + 3$"', en: 'Guo Jia: "$3^2 \\times 3^3 = 3^{2+3} = 3^x$, so $x = 2 + 3$"' },
        hint: { zh: '2 加 3 等于多少？', en: 'What is 2 plus 3?' },
        highlightField: 'x'
      },
      {
        text: { zh: '郭嘉："$x = 5$！算清粮草，方能决战官渡！"', en: 'Guo Jia: "$x = 5$! Count the grain to win at Guandu!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '同底数幂相乘，指数相加。', en: 'Multiply powers with same base: add exponents.' }, formula: '$a^m \\times a^n = a^{m+n}$', tips: [{ zh: '郭嘉提示：算清粮草，方能决战官渡。', en: 'Guo Jia Tip: Count the grain to win at Guandu.' }] }
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
        text: { zh: '程昱："粮仓容量为 $(2^3)^2$。幂的乘方，底数不变，指数相乘。"', en: 'Cheng Yu: "Granary capacity is $(2^3)^2$. Power of a power: base stays, exponents multiply."' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："$(2^3)^2 = 2^{3 \\times 2} = 2^x$，所以 $x = 3 \\times 2$"', en: 'Cheng Yu: "$(2^3)^2 = 2^{3 \\times 2} = 2^x$, so $x = 3 \\times 2$"' },
        hint: { zh: '3 乘以 2 等于多少？', en: 'What is 3 times 2?' },
        highlightField: 'x'
      },
      {
        text: { zh: '程昱："$x = 6$！空间利用要最大化。"', en: 'Cheng Yu: "$x = 6$! Maximize space utilization."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '同底数幂相乘，底数不变，指数相加。', en: 'Multiply same-base powers: base stays, add exponents.' }, formula: '$a^m \\times a^n = a^{m+n}$', tips: [{ zh: '程昱提示：空间利用要最大化。', en: 'Cheng Yu Tip: Maximize space utilization.' }] }
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
        text: { zh: '曹操："乌巢粮仓 $2^8$ 座，一把火烧 $2^5$ 座。同底数幂相除，指数相减。"', en: 'Cao Cao: "$2^8$ granaries at Wuchao, fire destroys $2^5$. Same base division: subtract exponents."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："$2^8 / 2^5 = 2^{8-5} = 2^x$，所以 $x = 8 - 5$"', en: 'Cao Cao: "$2^8 / 2^5 = 2^{8-5} = 2^x$, so $x = 8 - 5$"' },
        hint: { zh: '8 减去 5 等于多少？', en: 'What is 8 minus 5?' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹操："$x = 3$！乌巢一火，袁绍必败！"', en: 'Cao Cao: "$x = 3$! Once Wuchao burns, Yuan Shao is finished!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '同底数幂相除，指数相减。', en: 'Divide powers with same base: subtract exponents.' }, formula: '$a^m / a^n = a^{m-n}$', tips: [{ zh: '曹操提示：乌巢一火，袁绍必败！', en: 'Cao Tip: Once Wuchao burns, Yuan Shao is finished!' }] }
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
        text: { zh: '许褚："城墙高 8 丈，护城河宽 6 丈。云梯是直角三角形的斜边！"', en: 'Xu Chu: "Wall height 8, moat width 6. The ladder is the hypotenuse of a right triangle!"' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："勾股定理：$c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100$"', en: 'Xu Chu: "Pythagoras: $c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100$"' },
        hint: { zh: '$\\sqrt{100}$ 等于多少？', en: 'What is $\\sqrt{100}$?' },
        highlightField: 'c'
      },
      {
        text: { zh: '许褚："$c = 10$ 丈！梯子够长了，俺先上！"', en: 'Xu Chu: "$c = 10$ units! The ladder is long enough, I\'ll go first!"' },
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
        text: { zh: '乐进："望楼高 12 丈，敌营水平距离 16 丈。需求正切值。"', en: 'Yue Jin: "Tower height 12, horizontal distance 16. Find the tangent value."' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："$\\tan(\\theta) = \\text{对边} / \\text{邻边} = 12 / 16$"', en: 'Yue Jin: "$\\tan(\\theta) = \\text{opposite} / \\text{adjacent} = 12 / 16$"' },
        hint: { zh: '12 除以 16，化简为最简分数', en: '12 divided by 16, simplify to lowest terms' },
        highlightField: 'tan'
      },
      {
        text: { zh: '乐进："$\\tan(\\theta) = 0.75$！看清距离，方能百步穿杨。"', en: 'Yue Jin: "$\\tan(\\theta) = 0.75$! See the distance clearly to hit the mark."' },
        highlightField: 'tan'
      }
    ],
    secret: { concept: { zh: '正切值是直角三角形对边与邻边的比。', en: 'Tangent is the ratio of opposite to adjacent side.' }, formula: '$\\tan(\\theta) = a / b$', tips: [{ zh: '乐进提示：看清距离，方能百步穿杨。', en: 'Yue Jin Tip: See the distance clearly to hit the mark.' }] }
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
        text: { zh: '曹洪："地道斜长 25 丈，水平距离 24 丈。用勾股定理求深度。"', en: 'Cao Hong: "Tunnel slant length 25, horizontal distance 24. Use Pythagoras to find depth."' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："$b^2 = c^2 - a^2 = 25^2 - 24^2 = 625 - 576 = 49$"', en: 'Cao Hong: "$b^2 = c^2 - a^2 = 25^2 - 24^2 = 625 - 576 = 49$"' },
        hint: { zh: '$\\sqrt{49}$ 等于多少？', en: 'What is $\\sqrt{49}$?' },
        highlightField: 'c'
      },
      {
        text: { zh: '曹洪："$b = 7$ 丈！地道要挖深，别被发现了！"', en: 'Cao Hong: "$b = 7$ units! Dig deep, don\'t get spotted!"' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '勾股定理变形：$b = \\sqrt{c^2 - a^2}$。', en: 'Pythagorean variant: $b = \\sqrt{c^2 - a^2}$.' }, formula: '$b^2 = c^2 - a^2$', tips: [{ zh: "曹洪提示：地道要挖深，别被发现了！", en: "Cao Hong Tip: Dig deep, don't get spotted!" }] }
  },
  {
    id: 931, grade: 9, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 阵法与相似", en: "Unit 3: Formations & Similarity" },
    topic: 'Geometry', type: 'SIMILARITY',
    title: { zh: '旗帜缩放', en: 'Flag Scaling' },
    skillName: { zh: '旗帜缩放术', en: 'Flag Scaling' },
    skillSummary: { zh: '相似比求未知边', en: 'Use similarity ratio for unknown sides' },
    story: { zh: '制作一面大旗。按相似比例缩放。', en: 'Making a large flag. Scale by similarity ratio.' },
    description: { zh: '求大旗的宽 $x$。', en: 'Find the width $x$ of the large flag.' },
    data: { a: 6, b: 2, c: 3, generatorType: 'SIMILARITY_RANDOM' }, difficulty: 'Medium', reward: 200,
    kpId: 'kp-4.4-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '于禁："小旗长 2 宽 3，大旗长 6。相似图形对应边成比例。"', en: 'Yu Jin: "Small flag: length 2, width 3. Large flag: length 6. Similar figures have proportional sides."' },
        highlightField: 'x'
      },
      {
        text: { zh: '于禁："比例尺 = $6/2 = 3$，所以大旗宽 = $3 \\times 3 = x$"', en: 'Yu Jin: "Scale factor = $6/2 = 3$, so large flag width = $3 \\times 3 = x$"' },
        hint: { zh: '3 乘以 3 等于多少？', en: 'What is 3 times 3?' },
        highlightField: 'x'
      },
      {
        text: { zh: '于禁："$x = 9$ 尺！军旗要统一，威严不可废。"', en: 'Yu Jin: "$x = 9$ feet! Flags must be uniform, dignity must be maintained."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '相似图形对应边成比例。', en: 'Similar figures have proportional corresponding sides.' }, formula: '$a/b = x/c$', tips: [{ zh: '于禁提示：军旗要统一，威严不可废。', en: 'Yu Jin Tip: Flags must be uniform, dignity must be maintained.' }] }
  },
  {
    id: 932, grade: 9, unitId: 3, order: 2,
    unitTitle: { zh: "Unit 3: 阵法与相似", en: "Unit 3: Formations & Similarity" },
    topic: 'Geometry', type: 'SIMILARITY',
    title: { zh: '地图测绘', en: 'Map Surveying' },
    skillName: { zh: '地图测绘术', en: 'Map Survey' },
    skillSummary: { zh: '对应边成比例', en: 'Corresponding sides are proportional' },
    story: { zh: '在地图上测量距离。按比例换算。', en: 'Measuring distance on a map. Convert by scale ratio.' },
    description: { zh: '求实际距离 $x$（单位：厘米）。', en: 'Find actual distance $x$ (in cm).' },
    data: { a: 1000, b: 1, c: 5, generatorType: 'SIMILARITY_RANDOM' }, difficulty: 'Medium', reward: 220,
    kpId: 'kp-4.4-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '董昭："地图比例尺 1:1000，图上距离 5 厘米。相似比例关系！"', en: 'Dong Zhao: "Map scale 1:1000, map distance 5cm. Similar proportional relationship!"' },
        highlightField: 'x'
      },
      {
        text: { zh: '董昭："$1:1000 = 5:x$，所以 $x = 5 \\times 1000$"', en: 'Dong Zhao: "$1:1000 = 5:x$, so $x = 5 \\times 1000$"' },
        hint: { zh: '5 乘以 1000 等于多少？', en: 'What is 5 times 1000?' },
        highlightField: 'x'
      },
      {
        text: { zh: '董昭："$x = 5000$ 厘米！差之毫厘，谬以千里。"', en: 'Dong Zhao: "$x = 5000$ cm! A tiny error leads to a huge mistake."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '比例尺是图上距离与实际距离的比。', en: 'Scale is the ratio of map distance to actual distance.' }, formula: '$Scale = Map / Actual$', tips: [{ zh: '董昭提示：差之毫厘，谬以千里。', en: 'Dong Zhao Tip: A tiny error leads to a huge mistake.' }] }
  },
  {
    id: 941, grade: 9, unitId: 4, order: 1,
    unitTitle: { zh: "Unit 4: 军备与比率", en: "Unit 4: Armaments & Ratio" },
    topic: 'Algebra', type: 'RATIO',
    title: { zh: '兵粮配给', en: 'Rationing' },
    skillName: { zh: '兵粮配比术', en: 'Supply Ratio' },
    skillSummary: { zh: '比例 a:b 求未知项', en: 'Find unknown in ratio a:b' },
    story: { zh: '分配粮草。按固定比例配给。', en: 'Allocating grain. Distribute by fixed ratio.' },
    description: { zh: '求所需粮草 $y$（即 $1000:y = 2:5$）。', en: 'Find grain $y$ (i.e., $1000:y = 2:5$).' },
    data: { a: 2, b: 5, generatorType: 'RATIO_RANDOM' }, difficulty: 'Medium', reward: 240,
    kpId: 'kp-1.12-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '李典："士兵与粮草比例 2:5，现有 1000 名士兵。先求比例因子。"', en: 'Li Dian: "Soldiers to grain ratio 2:5, with 1000 soldiers. First find the scale factor."' },
        highlightField: 'x'
      },
      {
        text: { zh: '李典："$1000 \\div 2 = 500$（比例因子），所以粮草 $y = 5 \\times 500$"', en: 'Li Dian: "$1000 \\div 2 = 500$ (scale factor), so grain $y = 5 \\times 500$"' },
        hint: { zh: '5 乘以 500 等于多少？', en: 'What is 5 times 500?' },
        highlightField: 'y'
      },
      {
        text: { zh: '李典："$y = 2500$！后勤保障，重中之重。"', en: 'Li Dian: "$y = 2500$! Logistics is the top priority."' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '比例式中，内项之积等于外项之积。', en: 'In a proportion, the product of means equals the product of extremes.' }, formula: '$2y = 5000 \\Rightarrow y = 2500$', tips: [{ zh: '李典提示：后勤保障，重中之重。', en: 'Li Dian Tip: Logistics is the top priority.' }] }
  },
  {
    id: 942, grade: 9, unitId: 4, order: 2,
    unitTitle: { zh: "Unit 4: 军备与比率", en: "Unit 4: Armaments & Ratio" },
    topic: 'Algebra', type: 'RATIO',
    title: { zh: '混合阵法', en: 'Mixed Formation' },
    skillName: { zh: '兵种混编术', en: 'Troop Mix' },
    skillSummary: { zh: '交叉相乘法', en: 'Cross multiplication' },
    story: { zh: '混合兵种。按固定比例编组。', en: 'Mixing troops. Organize by fixed ratio.' },
    description: { zh: '求骑兵数量 $y$。', en: 'Find cavalry count $y$.' },
    data: { a: 3, b: 1, generatorType: 'RATIO_RANDOM' }, difficulty: 'Medium', reward: 260,
    kpId: 'kp-1.12-01', sectionId: 'number',
    tutorialSteps: [
      {
        text: { zh: '曹纯："步兵与骑兵比例 3:1，步兵 900 人。求骑兵数。"', en: 'Cao Chun: "Infantry to cavalry ratio 3:1, 900 infantry. Find cavalry count."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹纯："$900 \\div 3 = 300$（比例因子），骑兵 $y = 1 \\times 300$"', en: 'Cao Chun: "$900 \\div 3 = 300$ (scale factor), cavalry $y = 1 \\times 300$"' },
        hint: { zh: '1 乘以 300 等于多少？', en: 'What is 1 times 300?' },
        highlightField: 'y'
      },
      {
        text: { zh: '曹纯："$y = 300$ 骑兵！虎豹骑出击，势不可挡！"', en: 'Cao Chun: "$y = 300$ cavalry! Tiger and Leopard Cavalry strikes, unstoppable!"' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '比例的基本性质。', en: 'Basic properties of ratios.' }, formula: '$3:1 = 900:y$', tips: [{ zh: "曹纯提示：虎豹骑出击，势不可挡！", en: "Cao Chun Tip: When the Tiger and Leopard Cavalry strikes, it's unstoppable!" }] }
  },

  // --- Year 10: The Battle of Red Cliffs (Complexity) ---
  {
    id: 1011, grade: 10, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 火攻轨迹与二次函数", en: "Unit 1: Fire Attack & Quadratic Functions" },
    topic: 'Functions', type: 'QUADRATIC',
    title: { zh: '草船借箭', en: 'Straw Boats Borrow Arrows' },
    skillName: { zh: '投石轨迹术', en: 'Catapult Trajectory' },
    skillSummary: { zh: '抛物线系数求解', en: 'Solve parabola coefficients' },
    story: { zh: '大雾弥漫，诸葛亮草船借箭。箭矢高度 $h = -x^2 + 10x$，求最高点 $x$。', en: 'Dense fog covers the river. Zhuge Liang borrows arrows with straw boats. Arrow height $h = -x^2 + 10x$, find the peak $x$.' },
    description: { zh: '求箭矢飞行的最高点坐标。', en: 'Find the peak coordinates of the arrow trajectory.' },
    data: { p1: [0, 0], p2: [5, 25], generatorType: 'QUADRATIC_RANDOM' }, difficulty: 'Easy', reward: 300,
    kpId: 'kp-2.10-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '周瑜："诸葛亮草船借箭，箭矢轨迹是抛物线 $h = -x^2 + 10x$。我们要找最高点。"', en: 'Zhou Yu: "Zhuge Liang borrows arrows. The trajectory $h = -x^2 + 10x$ is a parabola. Find the peak."' },
        highlightField: 'a'
      },
      {
        text: { zh: '周瑜："二次函数 $y = ax^2 + bx$ 的顶点在 $x = -b/(2a)$。这里 $a=-1, b=10$。"', en: 'Zhou Yu: "For $y = ax^2 + bx$, vertex is at $x = -b/(2a)$. Here $a=-1, b=10$."' },
        hint: { zh: '$x = -10/(2 \\times -1) = ?$', en: '$x = -10/(2 \\times -1) = ?$' },
        highlightField: 'a'
      },
      {
        text: { zh: '周瑜："$x = 5$，代入得 $h = -25+50 = 25$。最高点在 $(5, 25)$！妙计成功！"', en: 'Zhou Yu: "$x = 5$, so $h = -25+50 = 25$. Peak at $(5, 25)$! Brilliant strategy!"' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '二次函数顶点公式：$x = -b/(2a)$。', en: 'Vertex formula: $x = -b/(2a)$.' }, formula: '$x = -b/(2a)$', tips: [{ zh: '周瑜提示：草船借箭，妙在算准轨迹。', en: 'Zhou Yu Tip: Borrowing arrows with straw boats — the key is calculating the trajectory.' }] }
  },
  {
    id: 1012, grade: 10, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 火攻轨迹与二次函数", en: "Unit 1: Fire Attack & Quadratic Functions" },
    topic: 'Functions', type: 'ROOTS',
    title: { zh: '火烧赤壁', en: 'Burning Red Cliffs' },
    skillName: { zh: '赤壁破阵术', en: 'Red Cliffs Breakthrough' },
    skillSummary: { zh: '求二次方程的根', en: 'Find roots of a quadratic equation' },
    story: { zh: "火船冲向曹营。火势蔓延范围由 $y = -x^2 + 16$ 描述。", en: "Fire ships rush Cao's camp. Fire spread range: $y = -x^2 + 16$." },
    description: { zh: '求火势覆盖的水平宽度（即两根之差）。', en: 'Find the horizontal width of the fire (difference between roots).' },
    data: { a: -1, b: 0, c: 16, generatorType: 'ROOTS_RANDOM' }, difficulty: 'Medium', reward: 350,
    kpId: 'kp-2.10-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '周瑜："火势范围 $y = -x^2 + 16$。令 $y=0$，求 $x$ 的根。"', en: 'Zhou Yu: "Fire range $y = -x^2 + 16$. Set $y=0$, find roots of $x$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '周瑜："$-x^2 + 16 = 0 \\Rightarrow x^2 = 16 \\Rightarrow x = \\pm 4$"', en: 'Zhou Yu: "$-x^2 + 16 = 0 \\Rightarrow x^2 = 16 \\Rightarrow x = \\pm 4$"' },
        hint: { zh: '两根之差 = $4 - (-4)$ = ?', en: 'Difference of roots = $4 - (-4)$ = ?' },
        highlightField: 'x'
      },
      {
        text: { zh: '周瑜："宽度为 8！火借风势，风助火威！"', en: 'Zhou Yu: "Width is 8! Fire relies on the wind, and wind aids the fire!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '求根公式：$x = \\pm \\sqrt{-c/a}$。', en: 'Quadratic roots: $x = \\pm \\sqrt{-c/a}$.' }, formula: '$x = \\pm 4$', tips: [{ zh: '周瑜提示：火借风势，风助火威。', en: 'Zhou Yu Tip: Fire relies on the wind, and wind aids the fire.' }] }
  },
  {
    id: 1013, grade: 10, unitId: 1, order: 3,
    unitTitle: { zh: "Unit 1: 火攻轨迹与二次函数", en: "Unit 1: Fire Attack & Quadratic Functions" },
    topic: 'Functions', type: 'ROOTS',
    title: { zh: '投石射程', en: 'Catapult Range' },
    skillName: { zh: '射程计算术', en: 'Range Calculation' },
    skillSummary: { zh: '用求根公式计算射程', en: 'Calculate range using quadratic formula' },
    story: { zh: '曹军在岸边架起投石机。石块轨迹为 $y = -x^2 + 100$。', en: 'Cao army sets up catapults. Stone trajectory: $y = -x^2 + 100$.' },
    description: { zh: '求石块落地的位置 $x$（即 $y=0$ 且 $x>0$ 的根）。', en: 'Find where the stone hits the ground $x$ (root of $y=0$ where $x>0$).' },
    data: { a: -1, b: 0, c: 100, generatorType: 'ROOTS_RANDOM' }, difficulty: 'Hard', reward: 480,
    kpId: 'kp-2.10-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '曹仁："石块轨迹 $y = -x^2 + 100$，求落地位置（$y=0$, $x>0$）。"', en: 'Cao Ren: "Stone trajectory $y = -x^2 + 100$, find landing position ($y=0$, $x>0$)."' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹仁："$-x^2 + 100 = 0 \\Rightarrow x^2 = 100$"', en: 'Cao Ren: "$-x^2 + 100 = 0 \\Rightarrow x^2 = 100$"' },
        hint: { zh: '$\\sqrt{100}$ 等于多少？（取正值）', en: 'What is $\\sqrt{100}$? (take positive value)' },
        highlightField: 'x'
      },
      {
        text: { zh: '曹仁："$x = 10$！射程之内，皆为魏土！"', en: 'Cao Ren: "$x = 10$! Everything within range belongs to Wei!"' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '二次方程的根即为函数与x轴的交点。', en: 'Roots of a quadratic are where the function meets the x-axis.' }, formula: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', tips: [{ zh: '曹仁提示：射程之内，皆为魏土！', en: 'Cao Ren Tip: Everything within range belongs to Wei!' }] }
  },
  {
    id: 1021, grade: 10, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 连环计与联立方程", en: "Unit 2: Chain Strategy & Simultaneous Equations" },
    topic: 'Algebra', type: 'SIMULTANEOUS',
    title: { zh: '兵力合围', en: 'Troop Encirclement' },
    skillName: { zh: '合围联立术', en: 'Simultaneous Siege' },
    skillSummary: { zh: '消元法解联立方程', en: 'Elimination method for simultaneous equations' },
    story: { zh: '孙刘联军合围曹操。两路兵力需满足两个条件。', en: 'Sun-Liu coalition encircles Cao. Two forces must satisfy two conditions.' },
    description: { zh: '求孙军 $x$ 和刘军 $y$ 的兵力。', en: 'Find Sun army $x$ and Liu army $y$ strength.' },
    data: { x: 5000, y: 5000, generatorType: 'SIMULTANEOUS_RANDOM' }, difficulty: 'Easy', reward: 320,
    kpId: 'kp-2.5-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '鲁肃："赤壁之战在即，孙刘联盟合围曹操！$x + y = 10000$，$2x - y = 5000$。用加减消元法。"', en: 'Lu Su: "The Battle of Red Cliffs is imminent! Sun-Liu alliance encircles Cao! $x + y = 10000$, $2x - y = 5000$. Use elimination."' },
        highlightField: 'x'
      },
      {
        text: { zh: '鲁肃："两式相加：$(x+y)+(2x-y) = 15000 \\Rightarrow 3x = 15000$"', en: 'Lu Su: "Add both: $(x+y)+(2x-y) = 15000 \\Rightarrow 3x = 15000$"' },
        hint: { zh: '$x = 15000 \\div 3$ = ?', en: '$x = 15000 \\div 3$ = ?' },
        highlightField: 'x'
      },
      {
        text: { zh: '鲁肃："$x = 5000$，代入得 $y = 5000$。联军同心，其利断金！赤壁必胜！"', en: 'Lu Su: "$x = 5000$, substitute to get $y = 5000$. United coalition cuts through gold! Victory at Red Cliffs!"' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '加减消元法。', en: 'Elimination method.' }, formula: '$3x = 15000 \\Rightarrow x = 5000$', tips: [{ zh: '鲁肃提示：联军同心，其利断金。', en: 'Lu Su Tip: When the coalition is of one mind, they can cut through gold.' }] }
  },
  {
    id: 1022, grade: 10, unitId: 2, order: 2,
    unitTitle: { zh: "Unit 2: 连环计与联立方程", en: "Unit 2: Chain Strategy & Simultaneous Equations" },
    topic: 'Algebra', type: 'SIMULTANEOUS',
    title: { zh: '粮草互换', en: 'Resource Exchange' },
    skillName: { zh: '粮草互换术', en: 'Supply Exchange' },
    skillSummary: { zh: '代入法解联立方程', en: 'Substitution method' },
    story: { zh: '孙刘两军交换物资。两种交易需满足两个等式。', en: 'Sun and Liu exchange resources. Two trades must satisfy two equations.' },
    description: { zh: '求一车粮 $x$ 和一车草 $y$ 的价格。', en: 'Find price of 1 grain $x$ and 1 grass $y$.' },
    data: { eq1: [3, 2, 12], eq2: [2, 3, 13], generatorType: 'SIMULTANEOUS_RANDOM' }, difficulty: 'Medium', reward: 550,
    kpId: 'kp-2.5-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '鲁肃："$3x+2y=12$，$2x+3y=13$。系数对称，可用加减消元。"', en: 'Lu Su: "$3x+2y=12$, $2x+3y=13$. Symmetric coefficients, use elimination."' },
        highlightField: 'x'
      },
      {
        text: { zh: '鲁肃："两式相加：$5x+5y=25 \\Rightarrow x+y=5$；相减：$x-y=-1$"', en: 'Lu Su: "Add: $5x+5y=25 \\Rightarrow x+y=5$; Subtract: $x-y=-1$"' },
        hint: { zh: '从 $x+y=5$ 和 $x-y=-1$ 解出 $x$ 和 $y$', en: 'Solve $x$ and $y$ from $x+y=5$ and $x-y=-1$' },
        highlightField: 'x'
      },
      {
        text: { zh: '鲁肃："$x=2$, $y=3$！互通有无，方能持久。"', en: 'Lu Su: "$x=2$, $y=3$! Mutual exchange is the key to endurance."' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '加减消元法可以快速解系数对称的方程组。', en: 'Addition/subtraction elimination works well for symmetric coefficients.' }, formula: '$\\begin{cases} 3x + 2y = 12 \\\\ 2x + 3y = 13 \\end{cases}$', tips: [{ zh: '鲁肃提示：互通有无，方能持久。', en: 'Lu Su Tip: Mutual exchange is the key to endurance.' }] }
  },
  {
    id: 1023, grade: 10, unitId: 2, order: 3,
    unitTitle: { zh: "Unit 2: 连环计与联立方程", en: "Unit 2: Chain Strategy & Simultaneous Equations" },
    topic: 'Algebra', type: 'SIMULTANEOUS',
    title: { zh: '战船调度', en: 'Ship Deployment' },
    skillName: { zh: '战船调度术', en: 'Fleet Coordination' },
    skillSummary: { zh: '两个方程两个未知数', en: 'Two equations, two unknowns' },
    story: { zh: '调度战船。大小两种船需满足两个条件。', en: 'Deploying ships. Two types of ships must satisfy two conditions.' },
    description: { zh: '求大船和小船的数量。', en: 'Find the number of large and small ships.' },
    data: { x: 10, y: 10, generatorType: 'SIMULTANEOUS_RANDOM' }, difficulty: 'Hard', reward: 400,
    kpId: 'kp-2.5-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '周瑜："$x+y=20$，$10x+5y=150$。用代入消元法。"', en: 'Zhou Yu: "$x+y=20$, $10x+5y=150$. Use substitution method."' },
        highlightField: 'x'
      },
      {
        text: { zh: '周瑜："由第一式 $y=20-x$，代入第二式：$10x+5(20-x)=150$"', en: 'Zhou Yu: "From first equation $y=20-x$, substitute: $10x+5(20-x)=150$"' },
        hint: { zh: '$10x + 100 - 5x = 150 \\Rightarrow 5x = 50$', en: '$10x + 100 - 5x = 150 \\Rightarrow 5x = 50$' },
        highlightField: 'x'
      },
      {
        text: { zh: '周瑜："$x=10$ 大船，$y=10$ 小船。兵贵神速，调度有方！"', en: 'Zhou Yu: "$x=10$ large, $y=10$ small. Speed is precious, deployment must be orderly!"' },
        highlightField: 'y'
      }
    ],
    secret: { concept: { zh: '代入消元法。', en: 'Substitution method.' }, formula: '$5x = 50 \\Rightarrow x = 10$', tips: [{ zh: '周瑜提示：兵贵神速，调度有方。', en: 'Zhou Yu Tip: Speed is precious in war, deployment must be orderly.' }] }
  },
  {
    id: 1031, grade: 10, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 天命占卜与概率", en: "Unit 3: Divination & Probability" },
    topic: 'Algebra', type: 'PROBABILITY',
    title: { zh: '借东风', en: 'Borrowing the East Wind' },
    skillName: { zh: '概率占卜术', en: 'Probability Basics' },
    skillSummary: { zh: '概率 = 有利结果数 ÷ 总结果数', en: 'Probability = favorable ÷ total outcomes' },
    story: { zh: '诸葛亮设坛借东风。已知 {total} 张卦牌中，有 {target} 张是"东风"。', en: 'Zhuge Liang prays for the wind. Out of {total} cards, {target} are "East Wind".' },
    description: { zh: '随机抽一张，抽中"东风"的概率是多少？', en: 'Draw one card, what is the probability of "East Wind"?' },
    data: { total: 52, target: 4, generatorType: 'PROBABILITY_SIMPLE_RANDOM' }, difficulty: 'Easy', reward: 300,
    storyConsequence: {
      correct: { zh: '东风如期而至！火攻大计成功，曹军战船陷入火海！', en: 'The East Wind arrives! The fire attack succeeds, Cao Cao\'s fleet burns!' },
      wrong: { zh: '东风未至...庞统建议先用连环计拖延时间，等待下一次机会。', en: 'The wind fails to come... Pang Tong suggests the chain strategy to buy time.' },
    },
    kpId: 'kp-8.1-01', sectionId: 'statistics',
    tutorialSteps: [
      {
        text: { zh: '庞统："52 张卦牌中有 4 张东风。概率 = 目标数 / 总数。"', en: 'Pang Tong: "4 East Wind cards out of 52. Probability = target / total."' },
        highlightField: 'p'
      },
      {
        text: { zh: '庞统："$P = 4/52 = 1/13$"', en: 'Pang Tong: "$P = 4/52 = 1/13$"' },
        hint: { zh: '4 和 52 的最大公约数是 4', en: 'GCD of 4 and 52 is 4' },
        highlightField: 'p'
      },
      {
        text: { zh: '庞统："概率为 $1/13$！万事俱备，只欠东风。"', en: 'Pang Tong: "Probability is $1/13$! Everything is ready, except the wind."' },
        highlightField: 'p'
      }
    ],
    secret: { concept: { zh: '概率等于目标事件数除以总事件数。', en: 'Probability is target events divided by total events.' }, formula: '$P(A) = n(A) / n(S)$', tips: [{ zh: '庞统提示：万事俱备，只欠东风。', en: 'Pang Tong Tip: Everything is ready, except the wind.' }] }
  },
  {
    id: 1032, grade: 10, unitId: 3, order: 2,
    unitTitle: { zh: "Unit 3: 天命占卜与概率", en: "Unit 3: Divination & Probability" },
    topic: 'Algebra', type: 'PROBABILITY',
    title: { zh: '连环计', en: 'Chain Link Strategy' },
    skillName: { zh: '独立事件术', en: 'Independent Events' },
    skillSummary: { zh: '独立事件同时发生：P = P₁ × P₂', en: 'Independent events: P = P₁ × P₂' },
    story: { zh: '庞统献连环计。已知单艘船着火概率为 {p1}，两艘独立战船同时着火的概率是多少？', en: 'Pang Tong suggests the chain link. Prob of one ship burning is {p1}. Prob of two independent ships burning?' },
    description: { zh: '计算独立事件同时发生的概率：$P(A \\cap B) = P(A) \\times P(B)$。', en: 'Calculate prob of independent events: $P(A \\cap B) = P(A) \\times P(B)$.' },
    data: { p1: 0.6, p2: 0.6, generatorType: 'PROBABILITY_IND_RANDOM' }, difficulty: 'Medium', reward: 350,
    kpId: 'kp-8.3-02', sectionId: 'statistics',
    tutorialSteps: [
      {
        text: { zh: '庞统："每艘船着火概率 0.6。两船独立，联合概率用乘法。"', en: 'Pang Tong: "Each ship burns with probability 0.6. They are independent, use multiplication."' },
        highlightField: 'p'
      },
      {
        text: { zh: '庞统："$P(A \\cap B) = P(A) \\times P(B) = 0.6 \\times 0.6$"', en: 'Pang Tong: "$P(A \\cap B) = P(A) \\times P(B) = 0.6 \\times 0.6$"' },
        hint: { zh: '0.6 乘以 0.6 等于多少？', en: 'What is 0.6 times 0.6?' },
        highlightField: 'p'
      },
      {
        text: { zh: '庞统："$P = 0.36$！铁索连舟后，概率直接变为 1。连环计，妙哉！"', en: 'Pang Tong: "$P = 0.36$! With chains linking ships, probability becomes 1. Chain strategy, brilliant!"' },
        highlightField: 'p'
      }
    ],
    secret: { concept: { zh: '独立事件的联合概率是各自概率的乘积。', en: 'Joint probability of independent events is the product of their probabilities.' }, formula: '$P(A \\text{ and } B) = P(A) \\cdot P(B)$', tips: [{ zh: '庞统提示：铁索连舟，火势一发不可收拾。', en: 'Pang Tong Tip: Chain the boats, and the fire will be unstoppable.' }] }
  },
  {
    id: 1033, grade: 10, unitId: 3, order: 3,
    unitTitle: { zh: "Unit 3: 天命占卜与概率", en: "Unit 3: Divination & Probability" },
    topic: 'Algebra', type: 'PROBABILITY',
    title: { zh: '华容道伏兵', en: 'Huarong Pass Ambush' },
    skillName: { zh: '简单概率术', en: 'Simple Probability' },
    skillSummary: { zh: 'P = 目标数 / 总数', en: 'P = target / total' },
    story: { zh: '曹操败走华容道。{total} 条路中有 {target} 条设有伏兵。随机选一条，遇到伏兵的概率是多少？', en: 'Cao Cao retreats via Huarong Pass. {target} out of {total} paths have ambushes. Pick one at random, what is the probability of an ambush?' },
    description: { zh: '求遇到伏兵的概率 $P = {target}/{total}$。', en: 'Find the probability of ambush: $P = {target}/{total}$.' },
    data: { total: 27, target: 19, generatorType: 'PROBABILITY_SIMPLE_RANDOM' }, difficulty: 'Hard', reward: 450,
    kpId: 'kp-8.1-02', sectionId: 'statistics',
    tutorialSteps: [
      {
        text: { zh: '关羽："华容道共 27 条路，其中 19 条有伏兵。"', en: 'Guan Yu: "Huarong Pass has 27 paths, 19 of which have ambushes."' },
        highlightField: 'p'
      },
      {
        text: { zh: '关羽："概率 $P = \\frac{\\text{伏兵路数}}{\\text{总路数}} = \\frac{19}{27}$"', en: 'Guan Yu: "Probability $P = \\frac{\\text{ambush paths}}{\\text{total paths}} = \\frac{19}{27}$"' },
        hint: { zh: '用分数或小数作答', en: 'Answer as a fraction or decimal' },
        highlightField: 'p'
      },
      {
        text: { zh: '关羽："$P ≈ 0.70$。义释曹操，天意如此！"', en: 'Guan Yu: "$P ≈ 0.70$. Releasing Cao Cao was fate!"' },
        highlightField: 'p'
      }
    ],
    secret: { concept: { zh: '简单概率：$P = \\frac{\\text{目标数}}{\\text{总数}}$。', en: 'Simple probability: $P = \\frac{\\text{target}}{\\text{total}}$.' }, formula: '$P = 19/27$', tips: [{ zh: '关羽提示：义薄云天，放他一马。', en: 'Guan Yu Tip: Loyalty as high as the sky, let him pass.' }] }
  },
  {
    id: 1041, grade: 10, unitId: 4, order: 1,
    unitTitle: { zh: "Unit 4: 水战风云与三角函数", en: "Unit 4: Naval Warfare & Trigonometry" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '战船间距', en: 'Ship Distance' },
    skillName: { zh: '战船测距术', en: 'Ship Distance' },
    skillSummary: { zh: '用正弦值求斜边', en: 'Find hypotenuse using sine' },
    story: { zh: '江面上烟雾缭绕。已知我军旗舰与敌舰连线与江岸成 ${angle}^\\circ$ 角，对边距离为 {opposite} 丈。', en: "Mist on the river. The line between flagship and enemy is ${angle}^\\circ$ to the bank, opposite distance is {opposite}." },
    description: { zh: '求斜边距离 $c$。', en: 'Find hypotenuse distance $c$.' },
    data: { angle: 30, opposite: 50, func: 'sin', generatorType: 'TRIGONOMETRY_RANDOM' }, difficulty: 'Easy', reward: 400,
    kpId: 'kp-6.2-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '甘宁："赤壁江面烟雾弥漫，旗舰与敌舰连线成 $30^\\circ$，对边 50 丈。$\\sin$ 联系对边和斜边。"', en: 'Gan Ning: "Mist covers Red Cliffs. Line at $30^\\circ$, opposite is 50. $\\sin$ connects opposite and hypotenuse."' },
        highlightField: 'c'
      },
      {
        text: { zh: '甘宁："$\\sin(30^\\circ) = \\text{对边}/\\text{斜边} = 50/c$，即 $0.5 = 50/c$"', en: 'Gan Ning: "$\\sin(30^\\circ) = \\text{opp}/\\text{hyp} = 50/c$, so $0.5 = 50/c$"' },
        hint: { zh: '$c = 50 / 0.5$ = ?', en: '$c = 50 / 0.5$ = ?' },
        highlightField: 'c'
      },
      {
        text: { zh: '甘宁："$c = 100$ 丈！水战之中，距离就是生命！"', en: 'Gan Ning: "$c = 100$ units! In naval battle, distance is life!"' },
        highlightField: 'c'
      }
    ],
    secret: { concept: { zh: '正弦值是对边与斜边的比。', en: 'Sine is the ratio of opposite to hypotenuse.' }, formula: '$\\sin(\\theta) = \\text{opp} / \\text{hyp}$', tips: [{ zh: '甘宁提示：水战之中，距离就是生命！', en: 'Gan Ning Tip: In naval battle, distance is life!' }] }
  },
  {
    id: 1042, grade: 10, unitId: 4, order: 2,
    unitTitle: { zh: "Unit 4: 水战风云与三角函数", en: "Unit 4: Naval Warfare & Trigonometry" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '旗舰夹角', en: 'Flagship Angle' },
    skillName: { zh: '旗舰夹角术', en: 'Flagship Angle' },
    skillSummary: { zh: '反正切求角度', en: 'Find angle using inverse tangent' },
    story: { zh: '计算旗舰与护卫舰的夹角。已知对边 {opposite} 丈，邻边 {adjacent} 丈。', en: 'Calculate the angle between flagship and escort. Opposite {opposite}, adjacent {adjacent}.' },
    description: { zh: '求角度 $\\theta$。', en: 'Find angle $\\theta$.' },
    data: { opposite: 30, adjacent: 30, func: 'tan_inv', generatorType: 'TRIGONOMETRY_RANDOM' }, difficulty: 'Medium', reward: 650,
    kpId: 'kp-6.2-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '甘宁："旗舰与护卫舰的位置关系——对边 30，邻边 30。先求正切值。"', en: 'Gan Ning: "Position between flagship and escort — opposite 30, adjacent 30. First find the tangent."' },
        highlightField: 'angle'
      },
      {
        text: { zh: '甘宁："$\\tan(\\theta) = 30/30 = 1$。什么角度的正切值等于 1？"', en: 'Gan Ning: "$\\tan(\\theta) = 30/30 = 1$. What angle has tangent equal to 1?"' },
        hint: { zh: '$\\tan(45^\\circ) = 1$', en: '$\\tan(45^\\circ) = 1$' },
        highlightField: 'angle'
      },
      {
        text: { zh: '甘宁："$\\theta = 45^\\circ$！火攻之势，在于风向与角度的完美契合。"', en: 'Gan Ning: "$\\theta = 45^\\circ$! The power of fire lies in the perfect match of wind and angle."' },
        highlightField: 'angle'
      }
    ],
    secret: { concept: { zh: '正切值为1时，角度为 45 度。', en: 'When tangent is 1, the angle is 45 degrees.' }, formula: '$\\theta = \\arctan(a/b)$', tips: [{ zh: '甘宁提示：火攻之势，在于风向与角度的完美契合。', en: 'Gan Ning Tip: The power of fire lies in the perfect match of wind and angle.' }] }
  },
  {
    id: 1043, grade: 10, unitId: 4, order: 3,
    unitTitle: { zh: "Unit 4: 水战风云与三角函数", en: "Unit 4: Naval Warfare & Trigonometry" },
    topic: 'Geometry', type: 'TRIGONOMETRY',
    title: { zh: '火攻仰角', en: 'Fire Attack Angle' },
    skillName: { zh: '火攻仰角术', en: 'Fire Attack Angle' },
    skillSummary: { zh: '反正切求仰角', en: 'Find elevation angle using inverse tangent' },
    story: { zh: "火船冲向曹营。已知火船与曹营水平距离 {adjacent} 丈，高度差 {opposite} 丈。", en: "Fire ships rush Cao's camp. Horizontal distance {adjacent}, height difference {opposite}." },
    description: { zh: '求仰角 $\\theta$。', en: 'Find elevation angle $\\theta$.' },
    data: { opposite: 100, adjacent: 100, func: 'tan_inv', generatorType: 'TRIGONOMETRY_RANDOM' }, difficulty: 'Hard', reward: 700,
    kpId: 'kp-6.2-01', sectionId: 'geometry',
    tutorialSteps: [
      {
        text: { zh: '甘宁："火船冲向曹营！水平距 100 丈，高度差 100 丈。求仰角。"', en: 'Gan Ning: "Fire ships charge Cao\'s camp! Horizontal distance 100, height difference 100. Find elevation angle."' },
        highlightField: 'angle'
      },
      {
        text: { zh: '甘宁："$\\tan(\\theta) = \\text{对边}/\\text{邻边} = 100/100 = 1$"', en: 'Gan Ning: "$\\tan(\\theta) = \\text{opposite}/\\text{adjacent} = 100/100 = 1$"' },
        hint: { zh: '$\\arctan(1) = ?$ 度', en: '$\\arctan(1) = ?$ degrees' },
        highlightField: 'angle'
      },
      {
        text: { zh: '甘宁："$\\theta = 45^\\circ$！百骑劫营，出奇制胜！"', en: 'Gan Ning: "$\\theta = 45^\\circ$! A hundred riders raid the camp, winning by surprise!"' },
        highlightField: 'angle'
      }
    ],
    secret: { concept: { zh: '正切值等于对边除以邻边。', en: 'Tangent equals opposite divided by adjacent.' }, formula: '$\\tan(\\theta) = 1 \\Rightarrow \\theta = 45^\\circ$', tips: [{ zh: '甘宁提示：百骑劫营，出奇制胜。', en: 'Gan Ning Tip: A hundred riders raid the camp, winning by surprise.' }] }
  },
  {
    id: 1051, grade: 10, unitId: 5, order: 1,
    unitTitle: { zh: "Unit 5: 等差军阵与序列", en: "Unit 5: Military Formations & Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '赤壁增兵', en: 'Red Cliffs Reinforcements' },
    skillName: { zh: '等差数列术', en: 'Arithmetic Sequence' },
    skillSummary: { zh: 'aₙ = a₁ + (n-1)d', en: 'aₙ = a₁ + (n-1)d' },
    story: { zh: '孙刘联军持续增兵。第一日到达 {a1} 人，此后每日增加 {d} 人。', en: 'The Sun-Liu alliance receives reinforcements. Day 1: {a1} troops, increasing by {d} daily.' },
    description: { zh: '求第 {n} 日的增兵人数。$a_n = a_1 + (n-1)d$', en: 'Find reinforcements on Day {n}. $a_n = a_1 + (n-1)d$' },
    data: { a1: 200, d: 150, n: 8, generatorType: 'ARITHMETIC_RANDOM' }, difficulty: 'Easy', reward: 300,
    kpId: 'kp-2.7-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '鲁肃："联军增兵有序，首日 200，日增 150。这是等差数列！"', en: 'Lu Su: "Reinforcements follow a pattern. Day 1: 200, +150 daily. An arithmetic sequence!"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '鲁肃："通项公式 $a_n = a_1 + (n-1)d = 200 + 7 \\times 150$"', en: 'Lu Su: "General term: $a_n = a_1 + (n-1)d = 200 + 7 \\times 150$"' },
        hint: { zh: '200 + 1050 = ?', en: '200 + 1050 = ?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '鲁肃："第 8 日增兵 1250 人！兵力充沛，可以开战了！"', en: 'Lu Su: "Day 8: 1250 troops! Forces are sufficient, time to fight!"' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '等差数列通项公式：$a_n = a_1 + (n-1)d$', en: 'Arithmetic sequence: $a_n = a_1 + (n-1)d$' }, formula: '$a_n = a_1 + (n-1)d$', tips: [{ zh: '鲁肃提示：兵马未动，粮草先行。', en: 'Lu Su Tip: Before troops move, supplies go first.' }] }
  },
  {
    id: 1052, grade: 10, unitId: 5, order: 2,
    unitTitle: { zh: "Unit 5: 等差军阵与序列", en: "Unit 5: Military Formations & Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '连弩齐射', en: 'Crossbow Volley' },
    skillName: { zh: '数列应用术', en: 'Sequence Application' },
    skillSummary: { zh: '等差数列求任意项', en: 'Find any term of arithmetic sequence' },
    story: { zh: '诸葛连弩部署。第一排 {a1} 架弩，每排增加 {d} 架。', en: 'Zhuge crossbows deployed. Row 1: {a1} crossbows, +{d} per row.' },
    description: { zh: '求第 {n} 排的弩机数量。', en: 'Find crossbows in Row {n}.' },
    data: { a1: 10, d: 6, n: 12, generatorType: 'ARITHMETIC_RANDOM' }, difficulty: 'Medium', reward: 400,
    kpId: 'kp-2.7-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮："连弩阵法，首排 10 架，逐排增 6。求第 12 排。"', en: 'Zhuge Liang: "Crossbow formation. Row 1: 10, +6 per row. Find Row 12."' },
        highlightField: 'ans'
      },
      {
        text: { zh: '诸葛亮："$a_{12} = 10 + (12-1) \\times 6 = 10 + 66$"', en: 'Zhuge Liang: "$a_{12} = 10 + (12-1) \\times 6 = 10 + 66$"' },
        hint: { zh: '10 + 66 = ?', en: '10 + 66 = ?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '诸葛亮："76 架连弩齐射，万箭齐发！"', en: 'Zhuge Liang: "76 crossbows fire in unison, a storm of arrows!"' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '等差数列应用：排兵布阵。', en: 'Arithmetic sequences in formation planning.' }, formula: '$a_{12} = 10 + 11 \\times 6 = 76$', tips: [{ zh: '诸葛亮提示：连弩之威，在于密集。', en: 'Zhuge Tip: The power of crossbows is in their density.' }] }
  },
  {
    id: 1053, grade: 10, unitId: 5, order: 3,
    unitTitle: { zh: "Unit 5: 等差军阵与序列", en: "Unit 5: Military Formations & Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '粮草消耗', en: 'Supply Depletion' },
    skillName: { zh: '数列推算术', en: 'Sequence Calculation' },
    skillSummary: { zh: '首项、公差、项数三要素', en: 'First term, common difference, term number' },
    story: { zh: '赤壁战后统计粮草消耗。第一日消耗 {a1} 石，每日增加 {d} 石。持续 {n} 日。', en: 'Post-battle supply audit. Day 1: {a1} units consumed, +{d} daily for {n} days.' },
    description: { zh: '求第 {n} 日的消耗量。', en: 'Find consumption on Day {n}.' },
    data: { a1: 300, d: 20, n: 15, generatorType: 'ARITHMETIC_RANDOM' }, difficulty: 'Hard', reward: 500,
    kpId: 'kp-2.7-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '张昭："赤壁大捷，但粮草消耗惊人。首日 300 石，日增 20 石。"', en: 'Zhang Zhao: "Great victory at Red Cliffs, but supply costs are alarming. Day 1: 300, +20 daily."' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张昭："第 15 日：$a_{15} = 300 + 14 \\times 20 = 300 + 280$"', en: 'Zhang Zhao: "Day 15: $a_{15} = 300 + 14 \\times 20 = 300 + 280$"' },
        hint: { zh: '300 + 280 = ?', en: '300 + 280 = ?' },
        highlightField: 'ans'
      },
      {
        text: { zh: '张昭："580 石！主公，必须精打细算，方能长久。"', en: 'Zhang Zhao: "580 units! My lord, we must budget carefully to sustain."' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '等差数列在实际问题中的应用。', en: 'Arithmetic sequences in real-world problems.' }, formula: '$a_{15} = 300 + 14 \\times 20 = 580$', tips: [{ zh: '张昭提示：内政之要，在于精算。', en: 'Zhang Zhao Tip: The key to governance is precise calculation.' }] }
  },

  // --- Year 11: Northern Expedition (Advanced) ---
  {
    id: 1111, grade: 11, unitId: 1, order: 1,
    unitTitle: { zh: "Unit 1: 出师表与微分优化", en: "Unit 1: Memorial & Differentiation" },
    topic: 'Calculus', type: 'QUADRATIC',
    title: { zh: '出师北伐', en: 'Northern Expedition' },
    skillName: { zh: '出师推演术', en: 'Campaign Projection' },
    skillSummary: { zh: '求顶点找最优解', en: 'Find vertex for optimal solution' },
    story: { zh: "诸葛亮六出祁山，需优化粮草运输路径。路径损耗函数为 $f(x) = -x^2 + 8x$。", en: "Zhuge Liang's expeditions need optimal supply routes. Loss function: $f(x) = -x^2 + 8x$." },
    description: { zh: '求 $f(x)$ 达到最大值时的 $x$（即导数为0的点）。', en: 'Find $x$ where $f(x)$ is maximum (derivative is 0).' },
    data: { p1: [0, 0], p2: [4, 16], generatorType: 'QUADRATIC_RANDOM' }, difficulty: 'Hard', reward: 800,
    kpId: 'kp-2.12-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '诸葛亮："路径损耗 $f(x) = -x^2 + 8x$，这是二次函数，$a=-1$, $b=8$。"', en: 'Zhuge Liang: "Path loss $f(x) = -x^2 + 8x$, a quadratic with $a=-1$, $b=8$."' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："顶点处取最大值：$x = -b/(2a) = -8/(2 \\times -1) = 4$"', en: 'Zhuge Liang: "Maximum at vertex: $x = -b/(2a) = -8/(2 \\times -1) = 4$"' },
        hint: { zh: '$-8 / -2$ 等于多少？', en: 'What is $-8 / -2$?' },
        highlightField: 'x'
      },
      {
        text: { zh: '诸葛亮："$x = 4$！鞠躬尽瘁，死而后已。运输之利，在于精微。"', en: 'Zhuge Liang: "$x = 4$! Devoted to the end. The key to transport is precision."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '导数为零的点可能是函数的极值点。', en: 'Points where derivative is zero can be extrema.' }, formula: "$f'(x) = 0$", tips: [{ zh: '诸葛亮提示：鞠躬尽瘁，死而后已。运输之利，在于精微。', en: 'Zhuge Tip: Devoted to the end. The key to transport is precision.' }] }
  },
  {
    id: 1112, grade: 11, unitId: 1, order: 2,
    unitTitle: { zh: "Unit 1: 出师表与微分优化", en: "Unit 1: Memorial & Differentiation" },
    topic: 'Calculus', type: 'DERIVATIVE',
    title: { zh: '剑阁栈道', en: 'Jiange Pass' },
    skillName: { zh: '栈道极值术', en: 'Mountain Pass Optimization' },
    skillSummary: { zh: '求导数得切线斜率', en: 'Differentiate to find tangent slope' },
    story: { zh: '蜀军修筑栈道。山坡曲线为 $y = x^2$。在点 $({x}, {x}^2)$ 处需修筑一条切线支架。', en: 'Shu army builds a plank road. Slope curve $y = x^2$. Build a tangent support at $({x}, {x}^2)$.' },
    description: { zh: '求切线的斜率 $k$（即 $y=x^2$ 在 $x={x}$ 处的导数）。', en: 'Find tangent slope $k$ (derivative of $y=x^2$ at $x={x}$).' },
    data: { x: 2, func: 'x^2', generatorType: 'DERIVATIVE_RANDOM' }, difficulty: 'Hard', reward: 850,
    kpId: 'kp-2.12-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '姜维："山坡曲线 $y = x^2$，在 $(2,4)$ 处求切线斜率。先求导数。"', en: 'Jiang Wei: "Slope curve $y = x^2$, find tangent slope at $(2,4)$. First differentiate."' },
        highlightField: 'k'
      },
      {
        text: { zh: '姜维："$y\' = 2x$。在 $x=2$ 处：$k = 2 \\times 2$"', en: 'Jiang Wei: "$y\' = 2x$. At $x=2$: $k = 2 \\times 2$"' },
        hint: { zh: '2 乘以 2 等于多少？', en: 'What is 2 times 2?' },
        highlightField: 'k'
      },
      {
        text: { zh: '姜维："$k = 4$！栈道险峻，支架必须稳固。"', en: 'Jiang Wei: "$k = 4$! The plank road is steep, the support must be stable."' },
        highlightField: 'k'
      }
    ],
    secret: { concept: { zh: '导数代表曲线在某一点的切线斜率。', en: 'Derivative is the slope of the tangent at a point.' }, formula: "$(x^n)' = nx^{n-1}$", tips: [{ zh: '姜维提示：栈道险峻，支架必须稳固。', en: 'Jiang Wei Tip: The plank road is steep, the support must be stable.' }] }
  },
  {
    id: 1121, grade: 11, unitId: 2, order: 1,
    unitTitle: { zh: "Unit 2: 屯田与定积分", en: "Unit 2: Farming & Integration" },
    topic: 'Calculus', type: 'INTEGRATION',
    title: { zh: '测量农田', en: 'Surveying Farmland' },
    skillName: { zh: '农田丈量术', en: 'Field Measurement' },
    skillSummary: { zh: '定积分求面积', en: 'Find area using definite integral' },
    story: { zh: '在汉中屯田。农田边界由 $y = x$ 和 $x$ 轴以及 $x={upper}$ 围成。', en: 'Farming in Hanzhong. Field bounded by $y=x$, x-axis, and $x={upper}$.' },
    description: { zh: '求该区域的面积。', en: 'Find the area of the region.' },
    data: { lower: 0, upper: 4, func: 'x', generatorType: 'INTEGRATION_RANDOM' }, difficulty: 'Hard', reward: 900,
    kpId: 'kp-2.12-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '邓艾："农田由 $y=x$、$x$ 轴和 $x=4$ 围成。用积分求面积。"', en: 'Deng Ai: "Field bounded by $y=x$, x-axis, and $x=4$. Use integration for area."' },
        highlightField: 'area'
      },
      {
        text: { zh: '邓艾："$\\int_0^4 x\\,dx = [\\frac{1}{2}x^2]_0^4 = \\frac{1}{2}(4^2) - \\frac{1}{2}(0^2)$"', en: 'Deng Ai: "$\\int_0^4 x\\,dx = [\\frac{1}{2}x^2]_0^4 = \\frac{1}{2}(4^2) - \\frac{1}{2}(0^2)$"' },
        hint: { zh: '$\\frac{1}{2} \\times 16 = ?$', en: '$\\frac{1}{2} \\times 16 = ?$' },
        highlightField: 'area'
      },
      {
        text: { zh: '邓艾："面积为 8！屯田之计，在于地利。"', en: 'Deng Ai: "Area is 8! The plan for farming lies in the advantage of the land."' },
        highlightField: 'area'
      }
    ],
    secret: { concept: { zh: '定积分可以计算曲线下的面积。', en: 'Definite integral calculates the area under a curve.' }, formula: '$\\int x dx = \\frac{1}{2}x^2$', tips: [{ zh: '邓艾提示：屯田之计，在于地利。', en: "Deng Ai Tip: The plan for farming lies in the advantage of the land." }] }
  },
  {
    id: 1122, grade: 11, unitId: 2, order: 2,
    unitTitle: { zh: "Unit 2: 屯田与定积分", en: "Unit 2: Farming & Integration" },
    topic: 'Calculus', type: 'INTEGRATION',
    title: { zh: '河道流量', en: 'River Flow' },
    skillName: { zh: '河道流量术', en: 'River Flow' },
    skillSummary: { zh: '积分求总流量', en: 'Find total flow using integration' },
    story: { zh: '计算河道流量。流速函数为 $v(t) = 3t^2$。', en: 'Calculate river flow. Velocity function: $v(t) = 3t^2$.' },
    description: { zh: '求总流量。', en: 'Find total flow.' },
    data: { lower: 0, upper: 2, func: '3x^2', generatorType: 'INTEGRATION_RANDOM' }, difficulty: 'Hard', reward: 950,
    kpId: 'kp-2.12-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '钟会："流速函数 $v(t) = 3t^2$。积分求总流量。"', en: 'Zhong Hui: "Velocity function $v(t) = 3t^2$. Integrate to find total flow."' },
        highlightField: 'area'
      },
      {
        text: { zh: '钟会："$\\int_0^2 3t^2\\,dt = [t^3]_0^2 = 2^3 - 0^3$"', en: 'Zhong Hui: "$\\int_0^2 3t^2\\,dt = [t^3]_0^2 = 2^3 - 0^3$"' },
        hint: { zh: '$2^3$ 等于多少？', en: 'What is $2^3$?' },
        highlightField: 'area'
      },
      {
        text: { zh: '钟会："总流量为 8！水流湍急，需精确计算。"', en: 'Zhong Hui: "Total flow is 8! The water is swift, precise calculation is needed."' },
        highlightField: 'area'
      }
    ],
    secret: { concept: { zh: '积分是导数的逆运算。', en: 'Integration is the inverse of differentiation.' }, formula: '$\\int x^2 dx = \\frac{1}{3}x^3$', tips: [{ zh: '钟会提示：水流湍急，需精确计算。', en: 'Zhong Hui Tip: The water is swift, precise calculation is needed.' }] }
  },
  {
    id: 1131, grade: 11, unitId: 3, order: 1,
    unitTitle: { zh: "Unit 3: 粮草序列", en: "Unit 3: Supply Sequences" },
    topic: 'Algebra', type: 'ARITHMETIC',
    title: { zh: '运粮序列', en: 'Supply Line' },
    skillName: { zh: '数列预测术', en: 'Sequence Prediction' },
    skillSummary: { zh: '用等差公式预测未来值', en: 'Predict future values with arithmetic formula' },
    story: { zh: '运粮队每日增加 {d} 担粮。第一日 {a1} 担。', en: 'Supply team increases by {d} units daily. Day 1 is {a1}.' },
    description: { zh: '求第 {n} 日的运粮量。', en: 'Find the supply amount on Day {n}.' },
    data: { a1: 100, d: 50, n: 10, generatorType: 'ARITHMETIC_RANDOM' }, difficulty: 'Medium', reward: 400,
    kpId: 'kp-2.7-01', sectionId: 'algebra',
    tutorialSteps: [
      {
        text: { zh: '费祎："运粮队每日增加 50 担，第一日 100 担。等差数列问题！"', en: 'Fei Yi: "Daily increase of 50 units, Day 1 is 100. Arithmetic sequence!"' },
        highlightField: 'ans'
      },
      {
        text: { zh: '费祎："$a_n = a_1 + (n-1)d = 100 + (10-1) \\times 50$"', en: 'Fei Yi: "$a_n = a_1 + (n-1)d = 100 + (10-1) \\times 50$"' },
        hint: { zh: '$9 \\times 50 = 450$，再加 100', en: '$9 \\times 50 = 450$, then add 100' },
        highlightField: 'ans'
      },
      {
        text: { zh: '费祎："$a_{10} = 550$ 担！粮草充足，军心方稳。"', en: 'Fei Yi: "$a_{10} = 550$ units! With sufficient supplies, the army\'s morale is stable."' },
        highlightField: 'ans'
      }
    ],
    secret: { concept: { zh: '等差数列通项公式：$a_n = a_1 + (n-1)d$。', en: 'Arithmetic sequence formula: $a_n = a_1 + (n-1)d$.' }, formula: '$a_{10} = 100 + 9 \\times 50$', tips: [{ zh: '费祎提示：粮草充足，军心方稳。', en: "Fei Yi Tip: With sufficient supplies, the army's morale is stable." }] }
  },

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
        text: { zh: '刘禅："城墙受力 $f(x) = x^3 - 3x$。求导数 $f\'(x)$，令其为零。"', en: 'Liu Shan: "Wall stress $f(x) = x^3 - 3x$. Find $f\'(x)$ and set it to zero."' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅："$f\'(x) = 3x^2 - 3 = 0 \\Rightarrow x^2 = 1$"', en: 'Liu Shan: "$f\'(x) = 3x^2 - 3 = 0 \\Rightarrow x^2 = 1$"' },
        hint: { zh: '$x > 0$，所以 $x = ?$', en: '$x > 0$, so $x = ?$' },
        highlightField: 'x'
      },
      {
        text: { zh: '刘禅："$x = 1$！此间乐，不思蜀。但防线还是要守的。"', en: 'Liu Shan: "$x = 1$! I am happy here. But the defense must be held."' },
        highlightField: 'x'
      }
    ],
    secret: { concept: { zh: '二阶导数大于零的点为极小值点。', en: 'Points where the second derivative is positive are local minima.' }, formula: "$f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = 1$", tips: [{ zh: "刘禅提示：此间乐，不思蜀。但防线还是要守的。", en: "Liu Shan Tip: I am happy here and don't miss Shu. But the defense must be held." }] }
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
      {
        text: { zh: '司马炎："魏国每次胜率 0.7。两次独立战争全胜，用乘法原理。"', en: 'Sima Yan: "Wei win rate is 0.7 each time. For both wins in independent wars, use multiplication."' },
        highlightField: 'p'
      },
      {
        text: { zh: '司马炎："$P = 0.7 \\times 0.7$"', en: 'Sima Yan: "$P = 0.7 \\times 0.7$"' },
        hint: { zh: '0.7 乘以 0.7 等于多少？', en: 'What is 0.7 times 0.7?' },
        highlightField: 'p'
      },
      {
        text: { zh: '司马炎："$P = 0.49$！天下大势，合久必分，分久必合。"', en: 'Sima Yan: "$P = 0.49$! The world\'s trend: unite after division, divide after union."' },
        highlightField: 'p'
      }
    ],
    secret: { concept: { zh: '独立事件的乘法原理。', en: 'Multiplication principle for independent events.' }, formula: '$0.7 \\times 0.7 = 0.49$', tips: [{ zh: "司马炎提示：天下大势，合久必分，分久必合。", en: "Sima Yan Tip: The world's trend is to unite after long division, and divide after long union." }] }
  }
];
