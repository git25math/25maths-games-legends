/**
 * Three Kingdoms (三国演义) Story Theme
 *
 * This is a PLUGGABLE story layer. The same 294 KPs can use
 * different themes (西游记, 哈利波特, etc.) by swapping this file.
 *
 * Each chapter maps to a historical arc. Each topic gets a battle/event.
 * Each KP gets a specific scenario within that event.
 */

export interface StoryTheme {
  id: string;
  name: { zh: string; en: string };
  chapterStories: Record<string, ChapterStory>;
}

export interface ChapterStory {
  arc: { zh: string; en: string };           // Story arc name
  narrator: string;                           // Default narrator for this chapter
  narrators: string[];                        // Available narrators
  topicEvents: Record<string, TopicEvent>;   // Topic ID → event
}

export interface TopicEvent {
  event: { zh: string; en: string };         // Battle/event name
  setting: { zh: string; en: string };       // Scene description
  narrator: string;                           // Override narrator
}

export const THREE_KINGDOMS: StoryTheme = {
  id: 'three-kingdoms',
  name: { zh: '三国演义', en: 'Romance of the Three Kingdoms' },
  chapterStories: {
    // ═══════════════════════════════════════
    // CH1: Number → 桃园结义·奠基篇
    // ═══════════════════════════════════════
    ch1: {
      arc: { zh: '桃园结义·奠基篇', en: 'Peach Garden Oath — Foundation' },
      narrator: '刘备',
      narrators: ['刘备', '关羽', '张飞', '诸葛亮'],
      topicEvents: {
        '1.1': { event: { zh: '桃园三结义', en: 'Oath of the Peach Garden' }, setting: { zh: '刘关张桃园结义，点算兵马，整数清点', en: 'Three brothers count soldiers and resources' }, narrator: '刘备' },
        '1.2': { event: { zh: '诸侯分阵', en: 'Lords Form Alliances' }, setting: { zh: '诸侯结盟，集合运算分清敌友', en: 'Lords ally, using sets to distinguish friend from foe' }, narrator: '曹操' },
        '1.3': { event: { zh: '军备锻造', en: 'Forging Weapons' }, setting: { zh: '铁匠铺锻造兵器，幂次计算产量', en: 'Blacksmiths forge weapons, powers calculate output' }, narrator: '张飞' },
        '1.4': { event: { zh: '粮草分配', en: 'Grain Distribution' }, setting: { zh: '军粮按比例分配各营', en: 'Distribute grain proportionally to camps' }, narrator: '关羽' },
        '1.5': { event: { zh: '兵力排序', en: 'Ranking Military Strength' }, setting: { zh: '各路诸侯兵力排序', en: 'Rank lords by military strength' }, narrator: '曹操' },
        '1.6': { event: { zh: '后勤运算', en: 'Logistics Calculation' }, setting: { zh: '粮草运输的四则运算', en: 'Four operations in supply logistics' }, narrator: '诸葛亮' },
        '1.7': { event: { zh: '兵器指数', en: 'Weapon Indices' }, setting: { zh: '兵器数量的指数增长', en: 'Exponential growth in weapon production' }, narrator: '曹操' },
        '1.8': { event: { zh: '天文观测', en: 'Astronomical Observation' }, setting: { zh: '观星台用标准式记录星距', en: 'Observatory uses standard form for star distances' }, narrator: '诸葛亮' },
        '1.9': { event: { zh: '战场估算', en: 'Battlefield Estimation' }, setting: { zh: '敌军数量的快速估算', en: 'Rapid estimation of enemy forces' }, narrator: '周瑜' },
        '1.10': { event: { zh: '精确侦察', en: 'Precision Scouting' }, setting: { zh: '探马回报的精度分析', en: 'Analyzing accuracy of scout reports' }, narrator: '郭嘉' },
        '1.11': { event: { zh: '军粮配比', en: 'Supply Ratios' }, setting: { zh: '按比例调配各营粮草', en: 'Proportional supply allocation' }, narrator: '荀彧' },
        '1.12': { event: { zh: '急行军速率', en: 'March Speed Rates' }, setting: { zh: '行军速率决定战机', en: 'March rates determine battle timing' }, narrator: '曹操' },
        '1.13': { event: { zh: '赋税百分', en: 'Tax Percentages' }, setting: { zh: '屯田制的百分比税率', en: 'Percentage tax rates in the tuntian system' }, narrator: '曹操' },
        '1.14': { event: { zh: '算盘运筹', en: 'Abacus Planning' }, setting: { zh: '军师用算盘精确计算', en: 'Strategist uses abacus for precise calculation' }, narrator: '诸葛亮' },
        '1.15': { event: { zh: '行军时辰', en: 'March Timing' }, setting: { zh: '古时辰与现代时间换算', en: 'Converting ancient time units' }, narrator: '关羽' },
        '1.16': { event: { zh: '军饷钱粮', en: 'Military Pay' }, setting: { zh: '发放军饷的货币计算', en: 'Currency calculations for soldier pay' }, narrator: '张飞' },
        '1.17': { event: { zh: '瘟疫蔓延', en: 'Plague Spread' }, setting: { zh: '军中瘟疫的指数扩散', en: 'Exponential spread of plague in camp' }, narrator: '华佗' },
        '1.18': { event: { zh: '宝剑铸炼', en: 'Sword Forging' }, setting: { zh: '铸剑中的根式计算', en: 'Surd calculations in sword forging' }, narrator: '张飞' },
      }
    },

    // ═══════════════════════════════════════
    // CH2: Algebra → 群雄逐鹿·代数篇
    // ═══════════════════════════════════════
    ch2: {
      arc: { zh: '群雄逐鹿·代数篇', en: 'Warring Lords — Algebra' },
      narrator: '诸葛亮',
      narrators: ['诸葛亮', '曹操', '周瑜', '司马懿'],
      topicEvents: {
        '2.1': { event: { zh: '军令如山', en: 'Military Orders' }, setting: { zh: '用代数表达军令', en: 'Express military orders in algebra' }, narrator: '诸葛亮' },
        '2.2': { event: { zh: '阵法演变', en: 'Formation Evolution' }, setting: { zh: '变换阵法的代数操作', en: 'Algebraic manipulation of formations' }, narrator: '诸葛亮' },
        '2.3': { event: { zh: '情报密码', en: 'Intelligence Codes' }, setting: { zh: '破译敌军密码的分式运算', en: 'Cracking enemy codes with algebraic fractions' }, narrator: '郭嘉' },
        '2.4': { event: { zh: '兵器升级', en: 'Weapon Upgrade' }, setting: { zh: '武器升级的指数法则', en: 'Index laws in weapon upgrades' }, narrator: '曹操' },
        '2.5': { event: { zh: '联军会师', en: 'Allied Forces Meet' }, setting: { zh: '联立方程求解兵力部署', en: 'Simultaneous equations for troop deployment' }, narrator: '周瑜' },
        '2.6': { event: { zh: '兵力约束', en: 'Force Constraints' }, setting: { zh: '不等式限制的兵力调度', en: 'Inequality constraints on deployments' }, narrator: '司马懿' },
        '2.7': { event: { zh: '等差军阵', en: 'Arithmetic Formations' }, setting: { zh: '等差数列排兵布阵', en: 'Arithmetic sequences in battle formations' }, narrator: '诸葛亮' },
        '2.8': { event: { zh: '军需比例', en: 'Supply Proportions' }, setting: { zh: '正反比例分配军需', en: 'Direct/inverse proportion in supplies' }, narrator: '荀彧' },
        '2.9': { event: { zh: '行军图谱', en: 'March Charts' }, setting: { zh: '速度-时间图分析行军', en: 'Speed-time graphs for march analysis' }, narrator: '曹操' },
        '2.10': { event: { zh: '火攻轨迹', en: 'Fire Attack Trajectories' }, setting: { zh: '抛物线与二次函数图像', en: 'Parabolic trajectories and quadratic graphs' }, narrator: '周瑜' },
        '2.11': { event: { zh: '天象预测', en: 'Sky Predictions' }, setting: { zh: '草图预判函数走势', en: 'Sketching curves to predict outcomes' }, narrator: '诸葛亮' },
        '2.12': { event: { zh: '攻城最优', en: 'Siege Optimization' }, setting: { zh: '微分求极值优化攻城', en: 'Differentiation to optimize siege strategy' }, narrator: '诸葛亮' },
        '2.13': { event: { zh: '连环妙计', en: 'Chain Strategies' }, setting: { zh: '复合函数与反函数的连锁计策', en: 'Composite and inverse functions as chain strategies' }, narrator: '庞统' },
      }
    },

    // ═══════════════════════════════════════
    // CH3: Coordinate Geometry → 官渡谍报·坐标篇
    // ═══════════════════════════════════════
    ch3: {
      arc: { zh: '官渡谍报·坐标篇', en: 'Battle of Guandu — Coordinates' },
      narrator: '曹操',
      narrators: ['曹操', '郭嘉', '许褚', '荀攸'],
      topicEvents: {
        '3.1': { event: { zh: '军事地图', en: 'Military Map' }, setting: { zh: '建立坐标系标注敌营', en: 'Coordinate system for marking enemy camps' }, narrator: '曹操' },
        '3.2': { event: { zh: '进军路线', en: 'March Route' }, setting: { zh: '画出线性进军路线', en: 'Drawing linear march routes' }, narrator: '曹操' },
        '3.3': { event: { zh: '地势分析', en: 'Terrain Analysis' }, setting: { zh: '斜率分析地势陡缓', en: 'Gradient analysis of terrain' }, narrator: '郭嘉' },
        '3.4': { event: { zh: '侦察距离', en: 'Scouting Range' }, setting: { zh: '计算两营距离与中点', en: 'Distance and midpoint between camps' }, narrator: '许褚' },
        '3.5': { event: { zh: '奇袭路线', en: 'Surprise Attack Route' }, setting: { zh: '直线方程规划奇袭', en: 'Linear equations for surprise attacks' }, narrator: '曹操' },
        '3.6': { event: { zh: '平行包围', en: 'Parallel Encirclement' }, setting: { zh: '平行部署形成包围', en: 'Parallel deployments for encirclement' }, narrator: '荀攸' },
        '3.7': { event: { zh: '垂直截击', en: 'Perpendicular Intercept' }, setting: { zh: '垂直截击敌军退路', en: 'Perpendicular intercept of retreat path' }, narrator: '郭嘉' },
      }
    },

    // ═══════════════════════════════════════
    // CH4: Geometry → 攻城略地·几何篇
    // ═══════════════════════════════════════
    ch4: {
      arc: { zh: '攻城略地·几何篇', en: 'Conquest — Geometry' },
      narrator: '吕布',
      narrators: ['吕布', '关羽', '赵云', '诸葛亮'],
      topicEvents: {
        '4.1': { event: { zh: '城池识别', en: 'Fortress Recognition' }, setting: { zh: '识别城池几何形状', en: 'Recognizing fortress shapes' }, narrator: '赵云' },
        '4.2': { event: { zh: '工事修筑', en: 'Fortification Construction' }, setting: { zh: '几何作图修筑防线', en: 'Geometric constructions for defense lines' }, narrator: '关羽' },
        '4.3': { event: { zh: '比例沙盘', en: 'Scale Model' }, setting: { zh: '比例图制作战场沙盘', en: 'Scale drawings for battlefield models' }, narrator: '诸葛亮' },
        '4.4': { event: { zh: '旗帜相似', en: 'Similar Banners' }, setting: { zh: '相似与全等判断旗号', en: 'Similarity and congruence in banner design' }, narrator: '赵云' },
        '4.5': { event: { zh: '阵法对称', en: 'Formation Symmetry' }, setting: { zh: '八卦阵的对称性', en: 'Symmetry in the Eight Trigrams formation' }, narrator: '诸葛亮' },
        '4.6': { event: { zh: '城门角度', en: 'Gate Angles' }, setting: { zh: '城门与箭塔的角度计算', en: 'Angle calculations for gates and towers' }, narrator: '吕布' },
        '4.7': { event: { zh: '圆城攻略', en: 'Circular Fortress' }, setting: { zh: '圆形城池的圆定理', en: 'Circle theorems for circular fortresses' }, narrator: '诸葛亮' },
        '4.8': { event: { zh: '行军轨迹', en: 'March Loci' }, setting: { zh: '作图与轨迹规划行军', en: 'Constructions and loci for march planning' }, narrator: '赵云' },
      }
    },

    // ═══════════════════════════════════════
    // CH5: Mensuration → 安营扎寨·度量篇
    // ═══════════════════════════════════════
    ch5: {
      arc: { zh: '安营扎寨·度量篇', en: 'Setting Camp — Mensuration' },
      narrator: '荀彧',
      narrators: ['荀彧', '曹操', '鲁肃', '诸葛亮'],
      topicEvents: {
        '5.1': { event: { zh: '度量标准', en: 'Measurement Standards' }, setting: { zh: '统一度量衡丈量土地', en: 'Standardizing measurements for land survey' }, narrator: '荀彧' },
        '5.2': { event: { zh: '营地面积', en: 'Camp Area' }, setting: { zh: '计算营地面积与围墙周长', en: 'Calculate camp area and perimeter' }, narrator: '曹操' },
        '5.3': { event: { zh: '铁锁连舟', en: 'Iron Chain Ships' }, setting: { zh: '圆形铁环与扇形甲板', en: 'Circular iron rings and sector decks' }, narrator: '周瑜' },
        '5.4': { event: { zh: '粮仓修筑', en: 'Granary Construction' }, setting: { zh: '粮仓的表面积与体积', en: 'Surface area and volume of granaries' }, narrator: '荀彧' },
        '5.5': { event: { zh: '复合工事', en: 'Compound Fortification' }, setting: { zh: '组合图形的城防面积', en: 'Compound shapes in fortress design' }, narrator: '诸葛亮' },
      }
    },

    // ═══════════════════════════════════════
    // CH6: Trigonometry → 赤壁水战·三角篇
    // ═══════════════════════════════════════
    ch6: {
      arc: { zh: '赤壁水战·三角篇', en: 'Battle of Red Cliffs — Trigonometry' },
      narrator: '周瑜',
      narrators: ['周瑜', '诸葛亮', '黄盖', '甘宁'],
      topicEvents: {
        '6.1': { event: { zh: '云梯攻城', en: 'Siege Ladders' }, setting: { zh: '勾股定理求云梯长度', en: "Pythagoras' theorem for ladder length" }, narrator: '许褚' },
        '6.2': { event: { zh: '江上测距', en: 'River Distance' }, setting: { zh: 'SOH CAH TOA 测量水面距离', en: 'SOH CAH TOA for river measurements' }, narrator: '甘宁' },
        '6.3': { event: { zh: '精确射击', en: 'Precision Archery' }, setting: { zh: '特殊角精确值瞄准', en: 'Exact trig values for aiming' }, narrator: '黄忠' },
        '6.4': { event: { zh: '潮汐预测', en: 'Tide Prediction' }, setting: { zh: '三角函数图像预测潮汐', en: 'Trig graphs for tide prediction' }, narrator: '诸葛亮' },
        '6.5': { event: { zh: '战船编队', en: 'Ship Formation' }, setting: { zh: '正弦余弦定理调度战船', en: 'Sine/cosine rules for ship deployment' }, narrator: '周瑜' },
        '6.6': { event: { zh: '立体攻防', en: '3D Warfare' }, setting: { zh: '三维空间的攻城计算', en: '3D trigonometry in siege warfare' }, narrator: '诸葛亮' },
      }
    },

    // ═══════════════════════════════════════
    // CH7: Transformations → 八阵图变·向量篇
    // ═══════════════════════════════════════
    ch7: {
      arc: { zh: '八阵图变·向量篇', en: 'Eight Formations — Vectors' },
      narrator: '诸葛亮',
      narrators: ['诸葛亮', '姜维', '赵云', '魏延'],
      topicEvents: {
        '7.1': { event: { zh: '八阵图变', en: 'Eight Formations Transform' }, setting: { zh: '八卦阵的平移、旋转、反射变换', en: 'Translation, rotation, reflection in formations' }, narrator: '诸葛亮' },
        '7.2': { event: { zh: '行军向量', en: 'March Vectors' }, setting: { zh: '用向量描述行军方向', en: 'Vectors for march direction' }, narrator: '赵云' },
        '7.3': { event: { zh: '兵力大小', en: 'Force Magnitude' }, setting: { zh: '向量的模表示兵力', en: 'Vector magnitude represents force' }, narrator: '姜维' },
        '7.4': { event: { zh: '夹击合围', en: 'Pincer Attack' }, setting: { zh: '向量几何规划合围路线', en: 'Vector geometry for pincer movements' }, narrator: '诸葛亮' },
      }
    },

    // ═══════════════════════════════════════
    // CH8: Probability → 天命占卜·概率篇
    // ═══════════════════════════════════════
    ch8: {
      arc: { zh: '天命占卜·概率篇', en: 'Divination — Probability' },
      narrator: '诸葛亮',
      narrators: ['诸葛亮', '司马懿', '关羽', '庞统'],
      topicEvents: {
        '8.1': { event: { zh: '卜卦问天', en: 'Divination' }, setting: { zh: '占卜吉凶的基础概率', en: 'Basic probability in fortune telling' }, narrator: '诸葛亮' },
        '8.2': { event: { zh: '战场统计', en: 'Battle Statistics' }, setting: { zh: '历次战役的频率分析', en: 'Frequency analysis of past battles' }, narrator: '司马懿' },
        '8.3': { event: { zh: '连环计策', en: 'Chain Strategies' }, setting: { zh: '独立事件与组合概率', en: 'Independent and combined event probabilities' }, narrator: '庞统' },
        '8.4': { event: { zh: '华容道赌', en: 'Huarong Pass Gamble' }, setting: { zh: '条件概率的博弈', en: 'Conditional probability in pursuit' }, narrator: '关羽' },
      }
    },

    // ═══════════════════════════════════════
    // CH9: Statistics → 战后统计·数据篇
    // ═══════════════════════════════════════
    ch9: {
      arc: { zh: '战后统计·数据篇', en: 'Post-War — Statistics' },
      narrator: '司马懿',
      narrators: ['司马懿', '张昭', '诸葛亮', '鲁肃'],
      topicEvents: {
        '9.1': { event: { zh: '军籍登记', en: 'Census Registration' }, setting: { zh: '数据分类与列表编制', en: 'Data classification and tabulation' }, narrator: '张昭' },
        '9.2': { event: { zh: '战报分析', en: 'Battle Report Analysis' }, setting: { zh: '解读战报数据', en: 'Interpreting battle report data' }, narrator: '司马懿' },
        '9.3': { event: { zh: '战力评估', en: 'Combat Assessment' }, setting: { zh: '平均数、中位数评估战力', en: 'Mean, median for combat assessment' }, narrator: '鲁肃' },
        '9.4': { event: { zh: '天下大势图', en: 'Strategic Charts' }, setting: { zh: '用图表展示天下格局', en: 'Charts showing the state of kingdoms' }, narrator: '诸葛亮' },
        '9.5': { event: { zh: '战果相关', en: 'Victory Correlation' }, setting: { zh: '散点图分析胜负因素', en: 'Scatter diagrams for victory factors' }, narrator: '司马懿' },
        '9.6': { event: { zh: '人口统计', en: 'Population Census' }, setting: { zh: '累积频率分析人口分布', en: 'Cumulative frequency for population' }, narrator: '张昭' },
        '9.7': { event: { zh: '兵器分布', en: 'Weapon Distribution' }, setting: { zh: '频率直方图统计兵器', en: 'Histograms for weapon distribution' }, narrator: '司马懿' },
      }
    },
  }
};
