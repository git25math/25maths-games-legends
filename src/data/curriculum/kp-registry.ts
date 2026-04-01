/**
 * CIE 0580 Knowledge Point Registry — 294 atomic KPs
 * Source of truth: math-video-engine/curriculum/cie_0580/syllabus_tree.yaml
 *
 * This is the IMMUTABLE skeleton. Story themes and school mappings
 * are layered on top. KP IDs never change.
 */

export type ScriptType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8';
export type Tier = 'both' | 'ext' | 'core';

export interface KnowledgePoint {
  id: string;            // e.g., "kp-2.5-06"
  title: string;         // English title
  titleZh: string;       // Chinese title
  type: ScriptType;      // T1-T8 determines game mechanic
  tier: Tier;            // core/both/ext
  duration: number;      // video duration in seconds
  prereqs: string[];     // prerequisite KP IDs
  topicId: string;       // e.g., "2.5"
  chapterId: string;     // e.g., "ch2"
  kn_id?: string;        // canonical knowledge-network node ID (e.g., "kn_0042")
}

export interface Topic {
  id: string;            // e.g., "2.5"
  title: string;
  titleZh: string;
  tier: Tier;
  kpIds: string[];
}

export interface Chapter {
  id: string;            // e.g., "ch1"
  title: string;
  titleZh: string;
  topics: Topic[];
}

// ═══════════════════════════════════════════════════════════════
// Chapter 1: Number (64 KPs)
// ═══════════════════════════════════════════════════════════════
const ch1: Chapter = {
  id: 'ch1', title: 'Number', titleZh: '数论',
  topics: [
    { id: '1.1', title: 'Types of number', titleZh: '数的类型', tier: 'both',
      kpIds: ['kp-1.1-01','kp-1.1-02','kp-1.1-03','kp-1.1-04','kp-1.1-05','kp-1.1-06','kp-1.1-07','kp-1.1-08','kp-1.1-09'] },
    { id: '1.2', title: 'Sets', titleZh: '集合与韦恩图', tier: 'both',
      kpIds: ['kp-1.2-01','kp-1.2-02','kp-1.2-03','kp-1.2-04','kp-1.2-05'] },
    { id: '1.3', title: 'Powers and roots', titleZh: '幂与根', tier: 'both',
      kpIds: ['kp-1.3-01','kp-1.3-02','kp-1.3-03'] },
    { id: '1.4', title: 'Fractions, decimals, percentages', titleZh: '分数、小数、百分数', tier: 'both',
      kpIds: ['kp-1.4-01','kp-1.4-02','kp-1.4-03','kp-1.4-04'] },
    { id: '1.5', title: 'Ordering', titleZh: '排序', tier: 'both',
      kpIds: ['kp-1.5-01','kp-1.5-02','kp-1.5-03'] },
    { id: '1.6', title: 'The four operations', titleZh: '四则运算', tier: 'both',
      kpIds: ['kp-1.6-01','kp-1.6-02','kp-1.6-03','kp-1.6-04'] },
    { id: '1.7', title: 'Indices I', titleZh: '指数法则I', tier: 'both',
      kpIds: ['kp-1.7-01','kp-1.7-02'] },
    { id: '1.8', title: 'Standard form', titleZh: '标准式', tier: 'both',
      kpIds: ['kp-1.8-01','kp-1.8-02'] },
    { id: '1.9', title: 'Estimation', titleZh: '估算', tier: 'both',
      kpIds: ['kp-1.9-01','kp-1.9-02','kp-1.9-03','kp-1.9-04','kp-1.9-05','kp-1.9-06','kp-1.9-07'] },
    { id: '1.10', title: 'Limits of accuracy', titleZh: '精度范围', tier: 'ext',
      kpIds: ['kp-1.10-01','kp-1.10-02','kp-1.10-03','kp-1.10-04','kp-1.10-05'] },
    { id: '1.11', title: 'Ratio and proportion', titleZh: '比与比例', tier: 'both',
      kpIds: ['kp-1.11-01','kp-1.11-02','kp-1.11-03','kp-1.11-04','kp-1.11-05'] },
    { id: '1.12', title: 'Rates', titleZh: '速率', tier: 'both',
      kpIds: ['kp-1.12-01','kp-1.12-02','kp-1.12-03'] },
    { id: '1.13', title: 'Percentages', titleZh: '百分数应用', tier: 'both',
      kpIds: ['kp-1.13-01','kp-1.13-02','kp-1.13-03','kp-1.13-04'] },
    { id: '1.14', title: 'Using a calculator', titleZh: '计算器使用', tier: 'core',
      kpIds: ['kp-1.14-01'] },
    { id: '1.15', title: 'Time', titleZh: '时间', tier: 'both',
      kpIds: ['kp-1.15-01','kp-1.15-02','kp-1.15-03'] },
    { id: '1.16', title: 'Money', titleZh: '货币', tier: 'both',
      kpIds: ['kp-1.16-01','kp-1.16-02','kp-1.16-03'] },
    { id: '1.17', title: 'Exponential growth and decay', titleZh: '指数增长与衰减', tier: 'ext',
      kpIds: ['kp-1.17-01'] },
    { id: '1.18', title: 'Surds', titleZh: '根式', tier: 'ext',
      kpIds: ['kp-1.18-01'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 2: Algebra and Graphs (78 KPs)
// ═══════════════════════════════════════════════════════════════
const ch2: Chapter = {
  id: 'ch2', title: 'Algebra and graphs', titleZh: '代数与图像',
  topics: [
    { id: '2.1', title: 'Introduction to algebra', titleZh: '代数入门', tier: 'both',
      kpIds: ['kp-2.1-01','kp-2.1-02','kp-2.1-03'] },
    { id: '2.2', title: 'Algebraic manipulation', titleZh: '代数运算', tier: 'both',
      kpIds: ['kp-2.2-01','kp-2.2-02','kp-2.2-03','kp-2.2-04','kp-2.2-05','kp-2.2-06','kp-2.2-07','kp-2.2-08','kp-2.2-09','kp-2.2-10','kp-2.2-11','kp-2.2-12','kp-2.2-13'] },
    { id: '2.3', title: 'Algebraic fractions', titleZh: '代数分式', tier: 'ext',
      kpIds: ['kp-2.3-01','kp-2.3-02','kp-2.3-03','kp-2.3-04'] },
    { id: '2.4', title: 'Indices II', titleZh: '指数法则II', tier: 'both',
      kpIds: ['kp-2.4-01','kp-2.4-02','kp-2.4-03'] },
    { id: '2.5', title: 'Equations', titleZh: '方程', tier: 'both',
      kpIds: ['kp-2.5-01','kp-2.5-02','kp-2.5-03','kp-2.5-04','kp-2.5-05','kp-2.5-06','kp-2.5-07','kp-2.5-08','kp-2.5-09','kp-2.5-10','kp-2.5-11','kp-2.5-12','kp-2.5-13'] },
    { id: '2.6', title: 'Inequalities', titleZh: '不等式', tier: 'both',
      kpIds: ['kp-2.6-01','kp-2.6-02','kp-2.6-03','kp-2.6-04'] },
    { id: '2.7', title: 'Sequences', titleZh: '数列', tier: 'both',
      kpIds: ['kp-2.7-01','kp-2.7-02','kp-2.7-03','kp-2.7-04','kp-2.7-05'] },
    { id: '2.8', title: 'Proportion', titleZh: '正反比例', tier: 'ext',
      kpIds: ['kp-2.8-01','kp-2.8-02','kp-2.8-03','kp-2.8-04','kp-2.8-05','kp-2.8-06','kp-2.8-07','kp-2.8-08'] },
    { id: '2.9', title: 'Graphs in practical situations', titleZh: '实际问题图像', tier: 'both',
      kpIds: ['kp-2.9-01','kp-2.9-02','kp-2.9-03','kp-2.9-04','kp-2.9-05'] },
    { id: '2.10', title: 'Graphs of functions', titleZh: '函数图像', tier: 'both',
      kpIds: ['kp-2.10-01','kp-2.10-02','kp-2.10-03','kp-2.10-04'] },
    { id: '2.11', title: 'Sketching curves', titleZh: '曲线草图', tier: 'ext',
      kpIds: ['kp-2.11-01','kp-2.11-02','kp-2.11-03'] },
    { id: '2.12', title: 'Differentiation', titleZh: '微分', tier: 'ext',
      kpIds: ['kp-2.12-01','kp-2.12-02'] },
    { id: '2.13', title: 'Functions', titleZh: '函数', tier: 'ext',
      kpIds: ['kp-2.13-01','kp-2.13-02','kp-2.13-03','kp-2.13-04'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 3: Coordinate Geometry (16 KPs)
// ═══════════════════════════════════════════════════════════════
const ch3: Chapter = {
  id: 'ch3', title: 'Coordinate geometry', titleZh: '坐标几何',
  topics: [
    { id: '3.1', title: 'Coordinates', titleZh: '坐标', tier: 'both',
      kpIds: ['kp-3.1-01','kp-3.1-02'] },
    { id: '3.2', title: 'Drawing linear graphs', titleZh: '画线性图像', tier: 'both',
      kpIds: ['kp-3.2-01'] },
    { id: '3.3', title: 'Gradient of linear graphs', titleZh: '线性图像斜率', tier: 'both',
      kpIds: ['kp-3.3-01','kp-3.3-02'] },
    { id: '3.4', title: 'Length and midpoint', titleZh: '长度与中点', tier: 'ext',
      kpIds: ['kp-3.4-01','kp-3.4-02','kp-3.4-03','kp-3.4-04'] },
    { id: '3.5', title: 'Equations of linear graphs', titleZh: '直线方程', tier: 'both',
      kpIds: ['kp-3.5-01','kp-3.5-02','kp-3.5-03','kp-3.5-04'] },
    { id: '3.6', title: 'Parallel lines', titleZh: '平行线', tier: 'both',
      kpIds: ['kp-3.6-01','kp-3.6-02'] },
    { id: '3.7', title: 'Perpendicular lines', titleZh: '垂直线', tier: 'ext',
      kpIds: ['kp-3.7-01'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 4: Geometry (37 KPs)
// ═══════════════════════════════════════════════════════════════
const ch4: Chapter = {
  id: 'ch4', title: 'Geometry', titleZh: '几何',
  topics: [
    { id: '4.1', title: 'Geometrical terms', titleZh: '几何术语', tier: 'both',
      kpIds: ['kp-4.1-01','kp-4.1-02','kp-4.1-03'] },
    { id: '4.2', title: 'Geometrical constructions', titleZh: '几何作图', tier: 'both',
      kpIds: ['kp-4.2-01','kp-4.2-02','kp-4.2-03','kp-4.2-04'] },
    { id: '4.3', title: 'Scale drawings and bearings', titleZh: '比例图与方位角', tier: 'both',
      kpIds: ['kp-4.3-01','kp-4.3-02','kp-4.3-03'] },
    { id: '4.4', title: 'Similarity and congruence', titleZh: '相似与全等', tier: 'both',
      kpIds: ['kp-4.4-01','kp-4.4-02','kp-4.4-03','kp-4.4-04','kp-4.4-05','kp-4.4-06'] },
    { id: '4.5', title: 'Symmetry', titleZh: '对称', tier: 'both',
      kpIds: ['kp-4.5-01','kp-4.5-02'] },
    { id: '4.6', title: 'Angles', titleZh: '角', tier: 'both',
      kpIds: ['kp-4.6-01','kp-4.6-02','kp-4.6-03','kp-4.6-04','kp-4.6-05','kp-4.6-06','kp-4.6-07','kp-4.6-08','kp-4.6-09','kp-4.6-10'] },
    { id: '4.7', title: 'Circle theorems', titleZh: '圆定理', tier: 'ext',
      kpIds: ['kp-4.7-01','kp-4.7-02','kp-4.7-03','kp-4.7-04','kp-4.7-05','kp-4.7-06'] },
    { id: '4.8', title: 'Constructions and loci', titleZh: '作图与轨迹', tier: 'ext',
      kpIds: ['kp-4.8-01','kp-4.8-02','kp-4.8-03'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 5: Mensuration (22 KPs)
// ═══════════════════════════════════════════════════════════════
const ch5: Chapter = {
  id: 'ch5', title: 'Mensuration', titleZh: '度量',
  topics: [
    { id: '5.1', title: 'Units of measure', titleZh: '计量单位', tier: 'both',
      kpIds: ['kp-5.1-01','kp-5.1-02','kp-5.1-03'] },
    { id: '5.2', title: 'Area and perimeter', titleZh: '面积与周长', tier: 'both',
      kpIds: ['kp-5.2-01','kp-5.2-02','kp-5.2-03'] },
    { id: '5.3', title: 'Circles, arcs and sectors', titleZh: '圆、弧与扇形', tier: 'both',
      kpIds: ['kp-5.3-01','kp-5.3-02','kp-5.3-03','kp-5.3-04','kp-5.3-05','kp-5.3-06'] },
    { id: '5.4', title: 'Surface area and volume', titleZh: '表面积与体积', tier: 'both',
      kpIds: ['kp-5.4-01','kp-5.4-02','kp-5.4-03','kp-5.4-04','kp-5.4-05','kp-5.4-06','kp-5.4-07'] },
    { id: '5.5', title: 'Compound shapes', titleZh: '组合图形', tier: 'both',
      kpIds: ['kp-5.5-01','kp-5.5-02','kp-5.5-03'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 6: Trigonometry (19 KPs)
// ═══════════════════════════════════════════════════════════════
const ch6: Chapter = {
  id: 'ch6', title: 'Trigonometry', titleZh: '三角学',
  topics: [
    { id: '6.1', title: "Pythagoras' theorem", titleZh: '勾股定理', tier: 'both',
      kpIds: ['kp-6.1-01','kp-6.1-02'] },
    { id: '6.2', title: 'Right-angled triangles', titleZh: '直角三角形', tier: 'both',
      kpIds: ['kp-6.2-01','kp-6.2-02','kp-6.2-03'] },
    { id: '6.3', title: 'Exact trigonometric values', titleZh: '三角精确值', tier: 'ext',
      kpIds: ['kp-6.3-01','kp-6.3-02'] },
    { id: '6.4', title: 'Trigonometric functions', titleZh: '三角函数', tier: 'ext',
      kpIds: ['kp-6.4-01','kp-6.4-02','kp-6.4-03'] },
    { id: '6.5', title: 'Non-right-angled triangles', titleZh: '非直角三角形', tier: 'ext',
      kpIds: ['kp-6.5-01','kp-6.5-02','kp-6.5-03','kp-6.5-04','kp-6.5-05','kp-6.5-06','kp-6.5-07'] },
    { id: '6.6', title: '3D trigonometry', titleZh: '三维三角', tier: 'ext',
      kpIds: ['kp-6.6-01','kp-6.6-02'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 7: Transformations and Vectors (18 KPs)
// ═══════════════════════════════════════════════════════════════
const ch7: Chapter = {
  id: 'ch7', title: 'Transformations and vectors', titleZh: '变换与向量',
  topics: [
    { id: '7.1', title: 'Transformations', titleZh: '变换', tier: 'both',
      kpIds: ['kp-7.1-01','kp-7.1-02','kp-7.1-03','kp-7.1-04','kp-7.1-05','kp-7.1-06','kp-7.1-07','kp-7.1-08','kp-7.1-09','kp-7.1-10','kp-7.1-11','kp-7.1-12'] },
    { id: '7.2', title: 'Vectors in 2D', titleZh: '二维向量', tier: 'both',
      kpIds: ['kp-7.2-01','kp-7.2-02','kp-7.2-03'] },
    { id: '7.3', title: 'Magnitude of a vector', titleZh: '向量的模', tier: 'ext',
      kpIds: ['kp-7.3-01'] },
    { id: '7.4', title: 'Vector geometry', titleZh: '向量几何', tier: 'ext',
      kpIds: ['kp-7.4-01','kp-7.4-02'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 8: Probability (14 KPs)
// ═══════════════════════════════════════════════════════════════
const ch8: Chapter = {
  id: 'ch8', title: 'Probability', titleZh: '概率',
  topics: [
    { id: '8.1', title: 'Introduction to probability', titleZh: '概率入门', tier: 'both',
      kpIds: ['kp-8.1-01','kp-8.1-02'] },
    { id: '8.2', title: 'Relative and expected frequencies', titleZh: '相对频率与期望频率', tier: 'both',
      kpIds: ['kp-8.2-01','kp-8.2-02'] },
    { id: '8.3', title: 'Combined events', titleZh: '组合事件', tier: 'both',
      kpIds: ['kp-8.3-01','kp-8.3-02','kp-8.3-03','kp-8.3-04','kp-8.3-05','kp-8.3-06','kp-8.3-07','kp-8.3-08'] },
    { id: '8.4', title: 'Conditional probability', titleZh: '条件概率', tier: 'ext',
      kpIds: ['kp-8.4-01','kp-8.4-02'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Chapter 9: Statistics (26 KPs)
// ═══════════════════════════════════════════════════════════════
const ch9: Chapter = {
  id: 'ch9', title: 'Statistics', titleZh: '统计',
  topics: [
    { id: '9.1', title: 'Classifying and tabulating data', titleZh: '数据分类与列表', tier: 'both',
      kpIds: ['kp-9.1-01','kp-9.1-02'] },
    { id: '9.2', title: 'Interpreting statistical data', titleZh: '数据解读', tier: 'both',
      kpIds: ['kp-9.2-01','kp-9.2-02','kp-9.2-03'] },
    { id: '9.3', title: 'Averages and measures of spread', titleZh: '平均数与离散度', tier: 'both',
      kpIds: ['kp-9.3-01','kp-9.3-02','kp-9.3-03','kp-9.3-04','kp-9.3-05','kp-9.3-06'] },
    { id: '9.4', title: 'Statistical charts and diagrams', titleZh: '统计图表', tier: 'both',
      kpIds: ['kp-9.4-01','kp-9.4-02','kp-9.4-03','kp-9.4-04','kp-9.4-05'] },
    { id: '9.5', title: 'Scatter diagrams and correlation', titleZh: '散点图与相关性', tier: 'both',
      kpIds: ['kp-9.5-01','kp-9.5-02','kp-9.5-03','kp-9.5-04'] },
    { id: '9.6', title: 'Cumulative frequency', titleZh: '累积频率', tier: 'ext',
      kpIds: ['kp-9.6-01','kp-9.6-02','kp-9.6-03','kp-9.6-04'] },
    { id: '9.7', title: 'Histograms', titleZh: '频率直方图', tier: 'ext',
      kpIds: ['kp-9.7-01','kp-9.7-02'] },
  ]
};

// ═══════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════

export const CHAPTERS: Chapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9];

/** Flat list of all KP IDs for quick lookup */
export const ALL_KP_IDS: string[] = CHAPTERS.flatMap(ch =>
  ch.topics.flatMap(t => t.kpIds)
);

/** Get topic by KP ID */
export function getTopicForKp(kpId: string): Topic | undefined {
  for (const ch of CHAPTERS) {
    for (const t of ch.topics) {
      if (t.kpIds.includes(kpId)) return t;
    }
  }
  return undefined;
}

/** Get chapter by KP ID */
export function getChapterForKp(kpId: string): Chapter | undefined {
  for (const ch of CHAPTERS) {
    for (const t of ch.topics) {
      if (t.kpIds.includes(kpId)) return ch;
    }
  }
  return undefined;
}

/** Total KP count */
export const TOTAL_KPS = ALL_KP_IDS.length;

// ═══════════════════════════════════════════════════════════════
// Knowledge Network mapping (Phase 2B.1b)
// Maps Play KP IDs → canonical kn_ids from knowledge-network seed
// ═══════════════════════════════════════════════════════════════

/** KP ID → canonical knowledge-network node ID */
export const KP_KN_MAP: Record<string, string> = {
  // Ch1: Number — 1.1 Types of number
  'kp-1.1-01': 'kn_0001', // Place value
  'kp-1.1-02': 'kn_0002', // Prime numbers
  'kp-1.1-03': 'kn_0009', // Square numbers and roots
  'kp-1.1-04': 'kn_0004', // Multiples
  'kp-1.1-05': 'kn_0011', // Reciprocal
  'kp-1.1-06': 'kn_0003', // Factors
  'kp-1.1-07': 'kn_0007', // LCM
  'kp-1.1-08': 'kn_0005', // Prime factorisation
  'kp-1.1-09': 'kn_0008', // HCF/LCM in context
  // 1.2 Sets
  'kp-1.2-01': 'kn_0012', // List Set Elements
  'kp-1.2-02': 'kn_0012', // Set concepts (Venn)
  'kp-1.2-03': 'kn_0013', // Set Cardinality
  'kp-1.2-04': 'kn_0013', // Set Cardinality
  'kp-1.2-05': 'kn_0013', // Set Cardinality
  // 1.3 Powers and roots
  'kp-1.3-01': 'kn_0014', // Evaluate powers
  'kp-1.3-02': 'kn_0015', // Evaluate roots
  'kp-1.3-03': 'kn_0019', // Index laws
  // 1.4 Fractions, decimals, percentages
  'kp-1.4-01': 'kn_0020', // Fraction concept
  'kp-1.4-02': 'kn_0030', // Multiply fractions
  'kp-1.4-03': 'kn_0027', // FDP conversion
  'kp-1.4-04': 'kn_0031', // Fraction of an amount
  // 1.6 Four operations
  'kp-1.6-01': 'kn_0033', // Negative numbers
  'kp-1.6-02': 'kn_0311', // Add/subtract negatives
  'kp-1.6-03': 'kn_0032', // Order of operations (BODMAS)
  'kp-1.6-04': 'kn_0034', // Decimal arithmetic
  // 1.7 Indices I
  'kp-1.7-01': 'kn_0016', // Zero index
  'kp-1.7-02': 'kn_0018', // Fractional index
  // 1.8 Standard form
  'kp-1.8-01': 'kn_0036', // Standard form concept
  'kp-1.8-02': 'kn_0037', // Convert to standard form
  // 1.9 Estimation
  'kp-1.9-01': 'kn_0044', // Round to nearest 10/100/1000
  'kp-1.9-02': 'kn_0043', // Round to significant figures
  'kp-1.9-03': 'kn_0042', // Round to decimal places
  'kp-1.9-04': 'kn_0045', // Estimate by rounding
  'kp-1.9-05': 'kn_0045', // Estimate (check)
  'kp-1.9-06': 'kn_0045', // Estimate (lengths)
  'kp-1.9-07': 'kn_0043', // Round to SF
  // 1.10 Limits of accuracy
  'kp-1.10-01': 'kn_0046', // Upper & lower bounds
  'kp-1.10-02': 'kn_0050', // Error interval notation
  'kp-1.10-03': 'kn_0047', // Bounds of sums
  'kp-1.10-04': 'kn_0048', // Bounds of products
  'kp-1.10-05': 'kn_0051', // Bounds in context
  // 1.11 Ratio and proportion
  'kp-1.11-01': 'kn_0052', // Simplify ratios
  'kp-1.11-02': 'kn_0054', // Share in a given ratio
  'kp-1.11-03': 'kn_0055', // Ratio word problems
  'kp-1.11-04': 'kn_0053', // Write as a ratio
  'kp-1.11-05': 'kn_0054', // Share in ratio
  // 1.12 Rates
  'kp-1.12-01': 'kn_0058', // Convert length units
  'kp-1.12-02': 'kn_0056', // Speed-Distance-Time
  'kp-1.12-03': 'kn_0057', // Convert speed units
  // 1.13 Percentages
  'kp-1.13-01': 'kn_0062', // Percentage of an amount
  'kp-1.13-02': 'kn_0064', // Percentage increase
  'kp-1.13-03': 'kn_0069', // Compound interest
  'kp-1.13-04': 'kn_0067', // Reverse percentage
  // 1.15 Time
  'kp-1.15-01': 'kn_0075', // Calculate duration
  'kp-1.15-02': 'kn_0073', // 12/24 hour time
  'kp-1.15-03': 'kn_0077', // Time zones
  // 1.16 Money
  'kp-1.16-01': 'kn_0068', // Simple interest
  'kp-1.16-02': 'kn_0069', // Compound interest
  'kp-1.16-03': 'kn_0078', // Currency exchange
  // 1.17 Exponential growth
  'kp-1.17-01': 'kn_0070', // Exponential growth and decay

  // Ch2: Algebra — 2.1 Introduction
  'kp-2.1-01': 'kn_0083', // Substitution
  'kp-2.1-02': 'kn_0084', // Formula Substitution
  'kp-2.1-03': 'kn_0083', // Substitution (two-variable)
  // 2.2 Algebraic manipulation
  'kp-2.2-01': 'kn_0085', // Collect like terms
  'kp-2.2-02': 'kn_0086', // Expand single bracket
  'kp-2.2-03': 'kn_0085', // Collect like terms
  'kp-2.2-04': 'kn_0087', // Expand two brackets (FOIL)
  'kp-2.2-05': 'kn_0094', // Form algebraic expressions
  'kp-2.2-06': 'kn_0089', // Factorise by common factor
  'kp-2.2-07': 'kn_0090', // Factorise quadratic
  'kp-2.2-08': 'kn_0091', // Difference of two squares
  'kp-2.2-09': 'kn_0093', // Algebraic fractions
  'kp-2.2-10': 'kn_0092', // Factorise by grouping
  'kp-2.2-11': 'kn_0096', // Algebraic proof
  'kp-2.2-12': 'kn_0019', // Index laws
  'kp-2.2-13': 'kn_0095', // Rearrange formulae
  // 2.3 Algebraic fractions
  'kp-2.3-01': 'kn_0097', // Simplify algebraic fraction
  'kp-2.3-02': 'kn_0307', // Simplify by factorising
  'kp-2.3-03': 'kn_0098', // Add algebraic fractions
  'kp-2.3-04': 'kn_0309', // Multiply/divide algebraic fractions
  // 2.4 Indices II
  'kp-2.4-01': 'kn_0099', // Multiply/divide index laws
  'kp-2.4-02': 'kn_0101', // Negative and fractional indices
  'kp-2.4-03': 'kn_0100', // Power of a power
  // 2.5 Equations
  'kp-2.5-01': 'kn_0103', // One-step equations
  'kp-2.5-02': 'kn_0104', // Two-step equations
  'kp-2.5-03': 'kn_0106', // Equations with fractions
  'kp-2.5-04': 'kn_0105', // Equations with x on both sides
  'kp-2.5-05': 'kn_0110', // Form and solve equations
  'kp-2.5-06': 'kn_0110', // Form and solve equations
  'kp-2.5-07': 'kn_0110', // Trial & improvement
  'kp-2.5-08': 'kn_0107', // Simultaneous equations
  'kp-2.5-09': 'kn_0108', // Solve quadratic by factorising
  'kp-2.5-10': 'kn_0109', // Quadratic formula
  'kp-2.5-11': 'kn_0108', // Completing the square
  'kp-2.5-12': 'kn_0303', // Simultaneous by elimination
  'kp-2.5-13': 'kn_0107', // Linear-Quadratic simultaneous
  // 2.6 Inequalities
  'kp-2.6-01': 'kn_0111', // Solve linear inequality
  'kp-2.6-02': 'kn_0111', // Graphical inequalities
  'kp-2.6-03': 'kn_0111', // Negative flip
  'kp-2.6-04': 'kn_0112', // Compound inequality
  // 2.7 Sequences
  'kp-2.7-01': 'kn_0113', // Recognise pattern
  'kp-2.7-02': 'kn_0115', // nth term linear
  'kp-2.7-03': 'kn_0114', // Term-to-term rule
  'kp-2.7-04': 'kn_0116', // Use nth term formula
  'kp-2.7-05': 'kn_0117', // nth term quadratic
  // 2.8 Proportion
  'kp-2.8-01': 'kn_0121', // Inverse proportion
  'kp-2.8-02': 'kn_0122', // Write proportion formula
  'kp-2.8-03': 'kn_0120', // Direct proportion
  'kp-2.8-04': 'kn_0120', // Direct proportion
  'kp-2.8-05': 'kn_0121', // Inverse proportion
  'kp-2.8-06': 'kn_0123', // Proportional change
  'kp-2.8-07': 'kn_0123', // Proportional change
  'kp-2.8-08': 'kn_0122', // Proportion formula
  // 2.9 Graphs in practical situations
  'kp-2.9-01': 'kn_0124', // Speed-Time
  'kp-2.9-02': 'kn_0125', // Average Speed
  'kp-2.9-03': 'kn_0126', // Speed Unit Conversion
  'kp-2.9-04': 'kn_0125', // Average Speed
  'kp-2.9-05': 'kn_0124', // Speed-Time
  // 2.10 Graphs of functions
  'kp-2.10-01': 'kn_0127', // Complete Table of Values
  'kp-2.10-02': 'kn_0129', // Equation of a Line
  'kp-2.10-03': 'kn_0130', // Identify Function Type
  'kp-2.10-04': 'kn_0130', // Identify Function Type
  // 2.11 Sketching curves
  'kp-2.11-01': 'kn_0131', // Solve trig equations
  'kp-2.11-02': 'kn_0132', // Find turning points
  'kp-2.11-03': 'kn_0133', // Trig reflex angle
  // 2.13 Functions
  'kp-2.13-01': 'kn_0134', // Evaluate f(x)
  'kp-2.13-02': 'kn_0136', // Inverse f^-1(x)
  'kp-2.13-03': 'kn_0135', // Composite fg(x)
  'kp-2.13-04': 'kn_0134', // Domain & Range

  // Ch3: Coordinate Geometry
  'kp-3.1-01': 'kn_0137', // Plot and read coordinates
  'kp-3.1-02': 'kn_0137', // Plot and read coordinates
  'kp-3.2-01': 'kn_0141', // Equation of a line
  'kp-3.3-01': 'kn_0140', // Gradient
  'kp-3.3-02': 'kn_0140', // Gradient
  'kp-3.4-01': 'kn_0138', // Find midpoint
  'kp-3.4-02': 'kn_0139', // Distance between points
  'kp-3.4-03': 'kn_0139', // Distance between points
  'kp-3.4-04': 'kn_0138', // Find midpoint
  'kp-3.5-01': 'kn_0141', // Equation of a line
  'kp-3.5-02': 'kn_0141', // Equation of a line
  'kp-3.5-03': 'kn_0141', // Equation of a line
  'kp-3.5-04': 'kn_0141', // Equation of a line
  'kp-3.6-01': 'kn_0140', // Gradient (parallel)
  'kp-3.6-02': 'kn_0141', // Equation of line (parallel)
  'kp-3.7-01': 'kn_0142', // Perpendicular gradient

  // Ch4: Geometry
  // 4.4 Similarity → Pythagoras nodes
  'kp-4.4-01': 'kn_0313', // Pythagoras concept
  'kp-4.4-02': 'kn_0314', // Find hypotenuse
  'kp-4.4-03': 'kn_0315', // Find shorter side
  // 4.6 Angles
  'kp-4.6-01': 'kn_0145', // Angles in a triangle
  'kp-4.6-02': 'kn_0146', // Angles on a straight line
  'kp-4.6-03': 'kn_0148', // Angles with parallel lines
  'kp-4.6-04': 'kn_0148', // Angles with parallel lines
  'kp-4.6-05': 'kn_0149', // Polygon angles
  'kp-4.6-06': 'kn_0149', // Polygon angles
  'kp-4.6-07': 'kn_0149', // Polygon angles
  'kp-4.6-08': 'kn_0149', // Polygon angles
  'kp-4.6-09': 'kn_0146', // Angles on a straight line
  'kp-4.6-10': 'kn_0149', // Polygon angles
  // 4.7 Circle theorems
  'kp-4.7-01': 'kn_0318', // Angle in semicircle
  'kp-4.7-02': 'kn_0317', // Angle at centre
  'kp-4.7-03': 'kn_0320', // Apply circle theorem
  'kp-4.7-04': 'kn_0319', // Tangent perpendicular
  'kp-4.7-05': 'kn_0318', // Angle in semicircle
  'kp-4.7-06': 'kn_0320', // Apply circle theorem

  // Ch5: Mensuration
  'kp-5.2-01': 'kn_0329', // Area of 2D shapes
  'kp-5.2-02': 'kn_0329', // Area of 2D shapes
  'kp-5.2-03': 'kn_0329', // Area of 2D shapes
  'kp-5.3-01': 'kn_0330', // Circumference and area of circle
  'kp-5.3-02': 'kn_0330', // Circumference and area of circle
  'kp-5.3-03': 'kn_0150', // Arc length
  'kp-5.3-04': 'kn_0151', // Sector area
  'kp-5.3-05': 'kn_0150', // Arc length
  'kp-5.3-06': 'kn_0330', // Circumference and area of circle

  // Ch6: Trigonometry
  'kp-6.1-01': 'kn_0313', // Pythagoras
  'kp-6.1-02': 'kn_0314', // Find hypotenuse
  'kp-6.2-01': 'kn_0326', // Sine/cosine/tangent ratios
  'kp-6.2-02': 'kn_0327', // Find side using trig
  'kp-6.2-03': 'kn_0328', // Find angle using inverse trig
  'kp-6.4-01': 'kn_0153', // Solve trig equation
  'kp-6.4-02': 'kn_0154', // Linear trig equation
  'kp-6.4-03': 'kn_0153', // Solve trig equation

  // Ch7: Vectors
  'kp-7.2-01': 'kn_0322', // Add and subtract vectors
  'kp-7.2-02': 'kn_0323', // Multiply vector by scalar
  'kp-7.2-03': 'kn_0325', // Use position vectors
  'kp-7.3-01': 'kn_0322', // Add and subtract vectors
  'kp-7.4-01': 'kn_0324', // Position vectors
  'kp-7.4-02': 'kn_0325', // Use position vectors

  // Ch8: Probability
  'kp-8.1-01': 'kn_0155', // Simple Probability
  'kp-8.1-02': 'kn_0156', // Complementary Probability
  'kp-8.2-01': 'kn_0157', // Expected Frequency
  'kp-8.2-02': 'kn_0157', // Expected Frequency
  'kp-8.3-01': 'kn_0155', // Simple Probability
  'kp-8.3-02': 'kn_0158', // Independent Events
  'kp-8.3-03': 'kn_0158', // Independent Events
  'kp-8.3-04': 'kn_0158', // Independent Events
  'kp-8.3-05': 'kn_0156', // Complementary Probability
  'kp-8.3-06': 'kn_0155', // Simple Probability
  'kp-8.3-07': 'kn_0155', // Simple Probability
  'kp-8.3-08': 'kn_0155', // Simple Probability
  'kp-8.4-01': 'kn_0160', // Two Without Replacement
  'kp-8.4-02': 'kn_0161', // Conditional Given

  // Ch9: Statistics
  'kp-9.1-01': 'kn_0162', // Calculate the mean
  'kp-9.1-02': 'kn_0162', // Calculate the mean
  'kp-9.3-01': 'kn_0164', // Find the mode
  'kp-9.3-02': 'kn_0163', // Find the median
  'kp-9.3-03': 'kn_0165', // Find the range
  'kp-9.3-04': 'kn_0165', // Find the range
  'kp-9.3-05': 'kn_0166', // Mean from frequency table
  'kp-9.3-06': 'kn_0167', // Missing value / combined mean
  'kp-9.5-01': 'kn_0168', // Identify Correlation Type
  'kp-9.5-02': 'kn_0169', // Use Line of Best Fit
  'kp-9.5-03': 'kn_0169', // Use Line of Best Fit
  'kp-9.5-04': 'kn_0168', // Identify Correlation Type
};

/** Get canonical kn_id for a Play KP */
export function getKnIdForKp(kpId: string): string | undefined {
  return KP_KN_MAP[kpId];
}
