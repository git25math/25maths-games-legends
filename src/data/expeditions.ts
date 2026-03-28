import type { BilingualText, DifficultyMode } from '../types';

export type ExpeditionNodeType = 'battle' | 'rest' | 'boss';

export type ExpeditionQuote = {
  text: BilingualText;
  author: BilingualText;
};

export type ExpeditionNode = {
  id: number;
  type: ExpeditionNodeType;
  difficulty: DifficultyMode;
  questionCount: number;
  rationReward: number;
  xpMultiplier: number;
  name: BilingualText;
  intel?: BilingualText;
};

export type Expedition = {
  id: string;
  name: BilingualText;
  description: BilingualText;
  nodes: ExpeditionNode[];
  startingRations: number;
  gradeMin: number;
  gradeMax: number;
  era?: BilingualText;
  quotes?: ExpeditionQuote[];
};

// ── Expedition 1: 赤壁远征 ──────────────────────────────────────────
const REDCLIFFS: Expedition = {
  id: 'exp_redcliffs',
  name: { zh: '赤壁远征', en: 'Red Cliffs Expedition' },
  description: { zh: '带上军粮，一路杀向曹营！答错会消耗军粮，军粮耗尽则远征失败。', en: 'Bring rations and fight through to Cao Cao\'s camp! Wrong answers cost rations.' },
  gradeMin: 7, gradeMax: 12,
  startingRations: 5,
  era: { zh: '建安十三年', en: '208 CE' },
  quotes: [
    { text: { zh: '羽扇纶巾，谈笑间，樯橹灰飞烟灭。', en: 'With feathered fan and silk cap, amidst laughter, the mighty fleet turned to ash.' }, author: { zh: '苏轼', en: 'Su Shi' } },
    { text: { zh: '东风不与周郎便，铜雀春深锁二乔。', en: 'Had the east wind not favoured the young Zhou Yu, the Bronze Sparrow Tower would have locked away the two Qiaos.' }, author: { zh: '杜牧', en: 'Du Mu' } },
    { text: { zh: '孤之有孔明，犹鱼之有水也。', en: 'Zhuge Liang is to me as water is to a fish.' }, author: { zh: '刘备', en: 'Liu Bei' } },
    { text: { zh: '大丈夫处世，当努力建功立业。', en: 'A true hero must strive to build great deeds in this world.' }, author: { zh: '周瑜', en: 'Zhou Yu' } },
  ],
  nodes: [
    { id: 1, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 0, xpMultiplier: 1,
      name: { zh: '前哨战', en: 'Outpost' },
      intel: { zh: '斥候来报：曹军先锋已至江边，数量不多，正面迎击！', en: 'Scouts report: Cao\'s vanguard has reached the river. Engage head-on!' } },
    { id: 2, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 1, xpMultiplier: 1,
      name: { zh: '渡口遭遇', en: 'River Crossing' },
      intel: { zh: '敌军封锁渡口，必须强行突破！', en: 'The enemy has blockaded the crossing. We must break through!' } },
    { id: 3, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 1.5,
      name: { zh: '伏兵夹击', en: 'Ambush' },
      intel: { zh: '两翼伏兵齐出，冷静应对，勿乱阵脚。', en: 'Ambush from both flanks! Stay calm and hold formation.' } },
    { id: 4, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0,
      name: { zh: '补给站', en: 'Supply Point' },
      intel: { zh: '黄盖献粮，东南风将起，稍作休整。', en: 'Huang Gai brings supplies. The southeast wind will rise soon. Rest a while.' } },
    { id: 5, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 2,
      name: { zh: '水寨突破', en: 'Harbor Breach' },
      intel: { zh: '曹军铁锁连舟，寻找弱点，破阵在此一举！', en: 'Cao\'s ships are chained together. Find the weak point and break through!' } },
    { id: 6, type: 'battle', difficulty: 'red', questionCount: 2, rationReward: 1, xpMultiplier: 2.5,
      name: { zh: '火船冲锋', en: 'Fire Ship Charge' },
      intel: { zh: '东风已至！黄盖诈降，火船顺风冲锋！', en: 'The east wind has arrived! Huang Gai\'s fire ships charge with the wind!' } },
    { id: 7, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 3,
      name: { zh: '连环阵', en: 'Chain Formation' },
      intel: { zh: '火势蔓延，曹军连环阵崩溃，乘势冲杀！', en: 'Fire spreads! Cao\'s chained fleet collapses. Press the attack!' } },
    { id: 8, type: 'boss', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 5,
      name: { zh: '曹营决战', en: 'Final Battle' },
      intel: { zh: '曹操仓皇出逃——拦截决战，今日毕全功！', en: 'Cao Cao flees in panic — intercept and finish the battle today!' } },
  ],
};

// ── Expedition 2: 桃园远征 ──────────────────────────────────────────
const PEACHGARDEN: Expedition = {
  id: 'exp_peachgarden',
  name: { zh: '桃园远征', en: 'Peach Garden Expedition' },
  description: { zh: '和刘关张三兄弟一起出发！入门级远征，军粮充足，适合新手。', en: 'Set out with the three sworn brothers! A beginner expedition with generous rations.' },
  gradeMin: 7, gradeMax: 8,
  startingRations: 7,
  era: { zh: '中平元年', en: '184 CE' },
  quotes: [
    { text: { zh: '不求同年同月同日生，但求同年同月同日死。', en: 'We ask not to be born on the same day, but to die on the same day.' }, author: { zh: '桃园三结义', en: 'Peach Garden Oath' } },
    { text: { zh: '勿以恶小而为之，勿以善小而不为。', en: 'Do no evil however small; do good however trivial.' }, author: { zh: '刘备', en: 'Liu Bei' } },
    { text: { zh: '天下英雄，惟使君与操耳。', en: 'The only true heroes under heaven are you, my lord, and Cao Cao.' }, author: { zh: '曹操', en: 'Cao Cao' } },
    { text: { zh: '我乃燕人张翼德！谁敢与我决一死战？', en: 'I am Zhang Fei of Yan! Who dares fight me to the death?' }, author: { zh: '张飞', en: 'Zhang Fei' } },
  ],
  nodes: [
    { id: 1, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 1, xpMultiplier: 1,
      name: { zh: '桃园出发', en: 'Peach Garden Start' },
      intel: { zh: '三英结义，共赴国难，义薄云天！', en: 'Three heroes sworn as brothers, setting out to save the realm!' } },
    { id: 2, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 0, xpMultiplier: 1,
      name: { zh: '乡间小路', en: 'Country Road' },
      intel: { zh: '黄巾余党横行，百姓苦不堪言，三兄弟拔刀相助。', en: 'Yellow Turban remnants roam the countryside. The brothers draw their blades.' } },
    { id: 3, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0,
      name: { zh: '客栈歇脚', en: 'Inn Rest Stop' },
      intel: { zh: '好酒好肉，歇息一夜，明日继续前行。', en: 'Good wine, good meat. Rest tonight and march on tomorrow.' } },
    { id: 4, type: 'battle', difficulty: 'amber', questionCount: 1, rationReward: 0, xpMultiplier: 1.5,
      name: { zh: '山贼拦路', en: 'Bandit Roadblock' },
      intel: { zh: '拦路山贼不知死活，关公一刀，教他做人。', en: 'Bandits block the road. Guan Yu\'s blade will teach them a lesson.' } },
    { id: 5, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 1, xpMultiplier: 2,
      name: { zh: '城门守卫', en: 'Gate Guards' },
      intel: { zh: '幽州城门紧闭，以才智说服守将开门。', en: 'The city gates are shut. Use wisdom to persuade the guards.' } },
    { id: 6, type: 'boss', difficulty: 'red', questionCount: 2, rationReward: 0, xpMultiplier: 4,
      name: { zh: '黄巾首领', en: 'Yellow Turban Chief' },
      intel: { zh: '黄巾首领张宝坐镇——三兄弟合力，一战定乾坤！', en: 'Chief Zhang Bao awaits. The three brothers unite for one decisive battle!' } },
  ],
};

// ── Expedition 3: 北伐远征 ──────────────────────────────────────────
const NORTHERN: Expedition = {
  id: 'exp_northern',
  name: { zh: '北伐远征', en: 'Northern Campaign' },
  description: { zh: '诸葛亮六出祁山！高难度远征，军粮紧张，题目更难，奖励丰厚。', en: 'Zhuge Liang\'s six campaigns north! Hard expedition with tighter rations but greater rewards.' },
  gradeMin: 10, gradeMax: 12,
  startingRations: 4,
  era: { zh: '建兴六年', en: '228 CE' },
  quotes: [
    { text: { zh: '鞠躬尽瘁，死而后已。', en: 'I shall give my all until my dying breath.' }, author: { zh: '诸葛亮', en: 'Zhuge Liang' } },
    { text: { zh: '出师未捷身先死，长使英雄泪满襟。', en: 'He died before his mission was complete, forever making heroes weep.' }, author: { zh: '杜甫', en: 'Du Fu' } },
    { text: { zh: '臣本布衣，躬耕于南阳，苟全性命于乱世。', en: 'I was but a common man, farming in Nanyang, surviving in turbulent times.' }, author: { zh: '诸葛亮', en: 'Zhuge Liang' } },
    { text: { zh: '北定中原，攘除奸凶，兴复汉室，还于旧都。', en: 'Pacify the north, eliminate the treacherous, restore the Han, and return to the old capital.' }, author: { zh: '出师表', en: 'Memorial on Dispatching the Army' } },
  ],
  nodes: [
    { id: 1, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 2,
      name: { zh: '祁山前哨', en: 'Qishan Outpost' },
      intel: { zh: '出祁山，克长安之路从此开始。将士们，随我北伐！', en: 'The road to Chang\'an begins at Qishan. Soldiers, march north with me!' } },
    { id: 2, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 1, xpMultiplier: 2,
      name: { zh: '街亭要塞', en: 'Jieting Fortress' },
      intel: { zh: '街亭乃咽喉要道，此关失守则全盘崩溃，务必死守！', en: 'Jieting is the critical chokepoint. Lose it and all is lost. Hold at all costs!' } },
    { id: 3, type: 'battle', difficulty: 'red', questionCount: 2, rationReward: 0, xpMultiplier: 3,
      name: { zh: '木牛流马', en: 'Wooden Oxen' },
      intel: { zh: '粮草转运靠木牛流马，算清数字，方能持续作战。', en: 'Supply transport depends on the wooden oxen. Get the numbers right to sustain the campaign.' } },
    { id: 4, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0,
      name: { zh: '五丈原补给', en: 'Wuzhang Plains Supply' },
      intel: { zh: '五丈原秋风萧瑟，稍作休整，养精蓄锐。', en: 'Autumn wind blows at Wuzhang Plains. Rest and gather strength.' } },
    { id: 5, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 3.5,
      name: { zh: '空城退敌', en: 'Empty Fort Bluff' },
      intel: { zh: '司马懿兵临城下！兵力悬殊，唯有空城之计，胆大心细。', en: 'Sima Yi approaches! Outnumbered, only the Empty Fort Stratagem can save us.' } },
    { id: 6, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 1, xpMultiplier: 4,
      name: { zh: '火烧上方谷', en: 'Shangfang Valley Fire' },
      intel: { zh: '司马懿中计入谷——点火！此战关乎北伐成败！', en: 'Sima Yi has fallen into the trap — light the fires! This battle decides the campaign!' } },
    { id: 7, type: 'boss', difficulty: 'red', questionCount: 4, rationReward: 0, xpMultiplier: 6,
      name: { zh: '司马懿决战', en: 'Sima Yi Showdown' },
      intel: { zh: '最终决战——此战关乎汉室兴亡，丞相亲临指挥！', en: 'The final showdown — the fate of the Han dynasty hangs in the balance!' } },
  ],
};

// ── Expedition 4: 蜀道行军 ──────────────────────────────────────────
const SHUDAO: Expedition = {
  id: 'exp_shudao',
  name: { zh: '蜀道行军', en: 'Road to Shu' },
  description: { zh: '赤壁大捷后，刘备挥师入蜀！翻山越岭，攻关夺隘，一路杀向成都。', en: 'After Red Cliffs, Liu Bei marches into Shu! Scale mountains, breach passes, and fight your way to Chengdu.' },
  gradeMin: 8, gradeMax: 10,
  startingRations: 5,
  era: { zh: '建安十六年', en: '211 CE' },
  quotes: [
    { text: { zh: '蜀道之难，难于上青天！', en: 'The road to Shu is harder than climbing to the blue sky!' }, author: { zh: '李白', en: 'Li Bai' } },
    { text: { zh: '剑阁峥嵘而崔嵬，一夫当关，万夫莫开。', en: 'Sword Gate towers steep and lofty — one man can hold it against ten thousand.' }, author: { zh: '李白', en: 'Li Bai' } },
    { text: { zh: '益州险塞，沃野千里，天府之土。', en: 'Yizhou is a natural fortress with fertile plains for a thousand li — a land of heavenly abundance.' }, author: { zh: '诸葛亮', en: 'Zhuge Liang' } },
    { text: { zh: '志当存高远。', en: 'One\'s aspirations should reach far and high.' }, author: { zh: '诸葛亮', en: 'Zhuge Liang' } },
  ],
  nodes: [
    { id: 1, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 0, xpMultiplier: 1,
      name: { zh: '荆州集结', en: 'Jingzhou Assembly' },
      intel: { zh: '赤壁胜利后，刘备在荆州整军备战。三万精兵，待命出发！', en: 'After Red Cliffs, Liu Bei musters his forces at Jingzhou. Thirty thousand troops stand ready!' } },
    { id: 2, type: 'battle', difficulty: 'green', questionCount: 1, rationReward: 1, xpMultiplier: 1,
      name: { zh: '樊城突围', en: 'Fan Castle Breakout' },
      intel: { zh: '曹仁扼守樊城，关羽请命先行突破！', en: 'Cao Ren holds Fan Castle. Guan Yu volunteers to break through!' } },
    { id: 3, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 0, xpMultiplier: 1.5,
      name: { zh: '汉水渡口', en: 'Han River Crossing' },
      intel: { zh: '汉水湍急，敌军在对岸设防。渡河需要精密计算！', en: 'The Han River rushes fast with enemies fortified on the opposite bank. Crossing demands precision!' } },
    { id: 4, type: 'rest', difficulty: 'green', questionCount: 0, rationReward: 2, xpMultiplier: 0,
      name: { zh: '山间补给', en: 'Mountain Supply' },
      intel: { zh: '翻越秦岭，山路崎岖。找到一处山泉营地，稍作休整。', en: 'Crossing the Qinling Mountains on rugged paths. A mountain spring campsite offers respite.' } },
    { id: 5, type: 'battle', difficulty: 'amber', questionCount: 2, rationReward: 1, xpMultiplier: 2,
      name: { zh: '阳平关', en: 'Yangping Pass' },
      intel: { zh: '阳平关是汉中门户，张鲁重兵把守。夺关方能入蜀！', en: 'Yangping Pass guards the way to Hanzhong. Zhang Lu\'s heavy garrison must be overcome!' } },
    { id: 6, type: 'battle', difficulty: 'red', questionCount: 2, rationReward: 0, xpMultiplier: 2.5,
      name: { zh: '剑门天险', en: 'Sword Gate Pass' },
      intel: { zh: '"一夫当关，万夫莫开"——剑门关天险，须以智取！', en: '"One man can hold against ten thousand" — Sword Gate\'s natural barrier demands cunning!' } },
    { id: 7, type: 'battle', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 3,
      name: { zh: '绵竹决战', en: 'Mianzhu Battle' },
      intel: { zh: '刘璋最后防线——绵竹关守将李严殊死抵抗！', en: 'Liu Zhang\'s final defense — Commander Li Yan fights desperately at Mianzhu!' } },
    { id: 8, type: 'boss', difficulty: 'red', questionCount: 3, rationReward: 0, xpMultiplier: 5,
      name: { zh: '成都入城', en: 'Enter Chengdu' },
      intel: { zh: '成都城门大开——刘璋出降，蜀汉基业由此开创！', en: 'Chengdu\'s gates open — Liu Zhang surrenders. The foundation of Shu Han begins!' } },
  ],
};

export const EXPEDITIONS: Expedition[] = [REDCLIFFS, PEACHGARDEN, NORTHERN, SHUDAO];

/** Get all expeditions available for a grade */
export function getExpeditionsForGrade(grade: number): Expedition[] {
  return EXPEDITIONS.filter(e => grade >= e.gradeMin && grade <= e.gradeMax);
}

/** Get the best single expedition for a grade (prefer grade-specific) */
export function getExpeditionForGrade(grade: number): Expedition | undefined {
  const all = getExpeditionsForGrade(grade);
  return all.sort((a, b) => (a.gradeMax - a.gradeMin) - (b.gradeMax - b.gradeMin))[0];
}
