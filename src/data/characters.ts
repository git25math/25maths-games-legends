import type { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'caocao',
    name: { zh: '曹操', en: 'Cao Cao' },
    role: { zh: '魏武帝', en: 'Emperor of Wei' },
    image: 'https://picsum.photos/seed/caocao/200/200',
    color: 'bg-blue-700',
    description: { zh: '宁教我负天下人，休教天下人负我。', en: 'A strategic mastermind who excels in overall command.' },
    skill: { zh: '【屯田】：初始位置(b)计算加成，更易稳固后方。', en: '【Tuntian】: Bonus in calculating Intercept (b), securing the base.' },
    stats: { power: 85, speed: 70, wisdom: 95 }
  },
  {
    id: 'liubei',
    name: { zh: '刘备', en: 'Liu Bei' },
    role: { zh: '汉昭烈帝', en: 'Emperor of Shu' },
    image: 'https://picsum.photos/seed/liubei/200/200',
    color: 'bg-emerald-600',
    description: { zh: '惟贤惟德，能服于人。', en: 'Leads with benevolence and virtue to unite people.' },
    skill: { zh: '【激将】：多人模式下，队友计算正确时你获得额外功勋。', en: '【Provoke】: Gain extra merit when allies answer correctly in multiplayer.' },
    stats: { power: 75, speed: 65, wisdom: 90 }
  },
  {
    id: 'sunquan',
    name: { zh: '孙权', en: 'Sun Quan' },
    role: { zh: '吴大帝', en: 'Emperor of Wu' },
    image: 'https://picsum.photos/seed/sunquan/200/200',
    color: 'bg-red-600',
    description: { zh: '坐断东南战未休。', en: 'Master of balance and defense in the Southeast.' },
    skill: { zh: '【制衡】：计算错误时有50%几率不扣除体力。', en: '【Balance】: 50% chance to not lose HP on wrong answers.' },
    stats: { power: 80, speed: 75, wisdom: 85 }
  },
  {
    id: 'guanyu',
    name: { zh: '关羽', en: 'Guan Yu' },
    role: { zh: '美髯公', en: 'God of War' },
    image: 'https://picsum.photos/seed/guanyu/200/200',
    color: 'bg-green-700',
    description: { zh: '千里走单骑，义薄云天。', en: 'Unmatched power and loyalty, a true legend on the battlefield.' },
    skill: { zh: '【武圣】：计算斜率(m)速度极快时，攻击力翻倍。', en: '【Wusheng】: Double damage when calculating Slope (m) rapidly.' },
    stats: { power: 100, speed: 80, wisdom: 60 }
  },
  {
    id: 'zhugeliang',
    name: { zh: '诸葛亮', en: 'Zhuge Liang' },
    role: { zh: '卧龙', en: 'Sleeping Dragon' },
    image: 'https://picsum.photos/seed/zhugeliang/200/200',
    color: 'bg-slate-600',
    description: { zh: '运筹帷幄之中，决胜千里之外。', en: 'The embodiment of wisdom, winning battles from miles away.' },
    skill: { zh: '【观星】：直接预览计算公式，洞察先机。', en: '【Guanxing】: Preview the calculation formula directly.' },
    stats: { power: 30, speed: 50, wisdom: 100 }
  },
  {
    id: 'diaochan',
    name: { zh: '貂蝉', en: 'Diao Chan' },
    role: { zh: '闭月', en: 'The Beauty' },
    image: 'https://picsum.photos/seed/diaochan/200/200',
    color: 'bg-pink-500',
    description: { zh: '一点樱桃启绛唇，两行碎玉喷阳春。', en: 'Incredible speed and grace, confusing enemies with ease.' },
    skill: { zh: '【离间】：使敌军计算难度降低（数值变小）。', en: '【Divisive】: Reduces calculation difficulty (smaller numbers).' },
    stats: { power: 40, speed: 100, wisdom: 80 }
  }
];
