/**
 * Error Remediation Graph — maps error types to prerequisite skill gaps
 *
 * When a student makes a specific error type on a topic, this module traces
 * the likely deficient prerequisite skill and returns remediation targets.
 *
 * Design: two-level lookup
 *   1. Topic-specific overrides (TOPIC_REMEDIATION)
 *   2. Chapter-level defaults (CHAPTER_DEFAULTS)
 *
 * Recursive chain: if the remediation target itself has errors in the
 * student's mistake log, the chain traces further back — eventually
 * reaching a foundational skill (ch1) that has no further prereqs.
 */

import type { ErrorType } from './diagnoseError';
import type { MistakeRecord } from './errorMemory';
import { getDominantPattern } from './errorMemory';

// ── Types ──

export type RemediationEntry = {
  topicId: string;
  reason: { zh: string; en: string };
};

type ErrorRemediationMap = Partial<Record<ErrorType, RemediationEntry[]>>;

// ── Chapter-level defaults ──
// Applied when no topic-specific override exists for a given error type.
// These capture the most common root cause for each error type within a chapter.

const CHAPTER_DEFAULTS: Record<string, ErrorRemediationMap> = {
  ch1: {
    sign:      [{ topicId: '1.6', reason: { zh: '负数运算规则', en: 'Negative number operation rules' } }],
    rounding:  [{ topicId: '1.9', reason: { zh: '估算与有效数字', en: 'Estimation and significant figures' } }],
    magnitude: [{ topicId: '1.8', reason: { zh: '标准式与数量级', en: 'Standard form and orders of magnitude' } }],
    method:    [{ topicId: '1.6', reason: { zh: '四则运算基础', en: 'Four operations fundamentals' } }],
    unknown:   [{ topicId: '1.1', reason: { zh: '数的基本概念', en: 'Number fundamentals' } }],
  },
  ch2: {
    sign:      [
      { topicId: '1.6', reason: { zh: '负数运算（正负号规则）', en: 'Negative number operations (sign rules)' } },
      { topicId: '2.1', reason: { zh: '代数代入负值', en: 'Algebraic substitution with negatives' } },
    ],
    rounding:  [
      { topicId: '1.9', reason: { zh: '有效数字与估算', en: 'Significant figures and estimation' } },
      { topicId: '1.4', reason: { zh: '小数运算', en: 'Decimal operations' } },
    ],
    magnitude: [{ topicId: '1.8', reason: { zh: '标准式（小数点位移）', en: 'Standard form (decimal point shift)' } }],
    method:    [
      { topicId: '2.2', reason: { zh: '代数化简与展开', en: 'Algebraic simplification and expansion' } },
      { topicId: '2.1', reason: { zh: '代数基础', en: 'Algebra fundamentals' } },
    ],
    unknown:   [{ topicId: '2.1', reason: { zh: '代数基础概念', en: 'Algebra fundamentals' } }],
  },
  ch3: {
    sign:      [
      { topicId: '1.6', reason: { zh: '负坐标运算', en: 'Negative coordinate operations' } },
      { topicId: '3.3', reason: { zh: '斜率正负判断', en: 'Gradient positive/negative judgment' } },
    ],
    rounding:  [{ topicId: '1.4', reason: { zh: '小数坐标精度', en: 'Decimal coordinate precision' } }],
    magnitude: [{ topicId: '1.11', reason: { zh: '比的化简', en: 'Ratio simplification' } }],
    method:    [
      { topicId: '3.1', reason: { zh: '坐标系基础', en: 'Coordinate system fundamentals' } },
      { topicId: '2.1', reason: { zh: '代数代入', en: 'Algebraic substitution' } },
    ],
    unknown:   [{ topicId: '3.1', reason: { zh: '坐标基础', en: 'Coordinate basics' } }],
  },
  ch4: {
    sign:      [{ topicId: '1.6', reason: { zh: '运算符号', en: 'Operation signs' } }],
    rounding:  [{ topicId: '1.9', reason: { zh: '测量精度', en: 'Measurement precision' } }],
    magnitude: [
      { topicId: '1.11', reason: { zh: '比例因子计算', en: 'Scale factor calculation' } },
      { topicId: '1.6', reason: { zh: '角度和运算错误', en: 'Angle sum arithmetic error' } },
    ],
    method:    [{ topicId: '4.1', reason: { zh: '几何基本术语与性质', en: 'Basic geometrical terms and properties' } }],
    unknown:   [{ topicId: '4.1', reason: { zh: '几何基础', en: 'Geometry fundamentals' } }],
  },
  ch5: {
    sign:      [{ topicId: '1.6', reason: { zh: '面积加减运算符号', en: 'Area addition/subtraction sign' } }],
    rounding:  [{ topicId: '1.9', reason: { zh: '含π计算的精度', en: 'Precision in π calculations' } }],
    magnitude: [
      { topicId: '5.1', reason: { zh: '单位换算（cm²≠cm×cm）', en: 'Unit conversion (cm²≠cm×cm)' } },
      { topicId: '1.3', reason: { zh: '幂运算（面积=²，体积=³）', en: 'Power rules (area=², volume=³)' } },
    ],
    method:    [
      { topicId: '5.2', reason: { zh: '基础面积公式', en: 'Basic area formulas' } },
      { topicId: '4.1', reason: { zh: '图形识别', en: 'Shape identification' } },
    ],
    unknown:   [{ topicId: '5.1', reason: { zh: '度量基础', en: 'Measurement basics' } }],
  },
  ch6: {
    sign:      [
      { topicId: '4.6', reason: { zh: '角度方向判断', en: 'Angle direction judgment' } },
      { topicId: '1.6', reason: { zh: '负数运算', en: 'Negative number operations' } },
    ],
    rounding:  [
      { topicId: '1.9', reason: { zh: '三角值的有效数字', en: 'Sig figs for trig values' } },
      { topicId: '1.3', reason: { zh: '平方根精度', en: 'Square root precision' } },
    ],
    magnitude: [{ topicId: '1.3', reason: { zh: '忘记开方或误平方', en: 'Forgot √ or mis-squared' } }],
    method:    [
      { topicId: '6.1', reason: { zh: '勾股定理基础', en: 'Pythagoras theorem fundamentals' } },
      { topicId: '1.11', reason: { zh: '三角比=比值', en: 'Trig ratio = ratio' } },
    ],
    unknown:   [{ topicId: '6.1', reason: { zh: '勾股定理', en: 'Pythagoras theorem' } }],
  },
  ch7: {
    sign:      [
      { topicId: '3.1', reason: { zh: '负坐标', en: 'Negative coordinates' } },
      { topicId: '4.6', reason: { zh: '旋转方向', en: 'Rotation direction' } },
    ],
    rounding:  [{ topicId: '1.9', reason: { zh: '向量计算精度', en: 'Vector calculation precision' } }],
    magnitude: [{ topicId: '1.11', reason: { zh: '放大缩小比例因子', en: 'Enlargement scale factor' } }],
    method:    [
      { topicId: '3.1', reason: { zh: '坐标系操作', en: 'Coordinate system operations' } },
      { topicId: '4.6', reason: { zh: '角度理解', en: 'Angle understanding' } },
    ],
    unknown:   [{ topicId: '7.1', reason: { zh: '变换基础', en: 'Transformation basics' } }],
  },
  ch8: {
    sign:      [{ topicId: '1.6', reason: { zh: '运算方向', en: 'Operation direction' } }],
    rounding:  [{ topicId: '1.4', reason: { zh: '分数/小数转换', en: 'Fraction/decimal conversion' } }],
    magnitude: [{ topicId: '1.4', reason: { zh: '概率不超过1（分数理解）', en: 'Probability ≤ 1 (fraction understanding)' } }],
    method:    [
      { topicId: '8.1', reason: { zh: '概率基本定义', en: 'Basic probability definition' } },
      { topicId: '1.4', reason: { zh: '分数运算', en: 'Fraction operations' } },
    ],
    unknown:   [{ topicId: '8.1', reason: { zh: '概率基础', en: 'Probability basics' } }],
  },
  ch9: {
    sign:      [{ topicId: '1.6', reason: { zh: '运算符号', en: 'Operation signs' } }],
    rounding:  [{ topicId: '1.9', reason: { zh: '读图精度', en: 'Graph reading precision' } }],
    magnitude: [
      { topicId: '1.11', reason: { zh: '比例/百分比计算', en: 'Ratio/percentage calculation' } },
      { topicId: '1.6', reason: { zh: '总数/频率运算错误', en: 'Total/frequency arithmetic error' } },
    ],
    method:    [
      { topicId: '9.1', reason: { zh: '数据分类基础', en: 'Data classification basics' } },
      { topicId: '1.6', reason: { zh: '四则运算', en: 'Four operations' } },
    ],
    unknown:   [{ topicId: '9.1', reason: { zh: '统计基础', en: 'Statistics basics' } }],
  },
};

// ── Topic-specific overrides ──
// Only define where the topic's error→remediation differs from chapter defaults.
// Each entry lists remediation targets for specific error types on that topic.

const TOPIC_REMEDIATION: Record<string, ErrorRemediationMap> = {
  // ─── Ch1: Number ───
  '1.3': {
    sign:      [{ topicId: '1.6', reason: { zh: '(-2)²≠-(2²) 符号规则', en: '(-2)²≠-(2²) sign rules' } }],
    magnitude: [{ topicId: '1.1', reason: { zh: '混淆平方与平方根', en: 'Confusing square and square root' } }],
    method:    [{ topicId: '1.1', reason: { zh: '数的类型（完全平方数识别）', en: 'Number types (perfect square identification)' } }],
  },
  '1.4': {
    sign:      [{ topicId: '1.6', reason: { zh: '负分数运算', en: 'Negative fraction operations' } }],
    magnitude: [{ topicId: '1.1', reason: { zh: '百分数÷100 被遗漏', en: 'Forgot ÷100 for percentage' } }],
    method:    [{ topicId: '1.1', reason: { zh: '分数/小数/百分数互转概念', en: 'Fraction/decimal/percentage conversion concept' } }],
  },
  '1.7': {
    sign:      [{ topicId: '1.6', reason: { zh: '负底数或负指数', en: 'Negative base or negative index' } }],
    magnitude: [{ topicId: '1.3', reason: { zh: '混淆相乘法则与相加法则', en: 'Confusing multiply vs add index laws' } }],
    method:    [{ topicId: '1.3', reason: { zh: '幂与根基础', en: 'Powers and roots fundamentals' } }],
  },
  '1.8': {
    sign:      [{ topicId: '1.7', reason: { zh: '10的负幂', en: 'Negative powers of 10' } }],
    magnitude: [{ topicId: '1.7', reason: { zh: '10^n 的幂次搞错', en: 'Wrong power of 10' } }],
    method:    [{ topicId: '1.7', reason: { zh: '指数法则I', en: 'Index laws I' } }],
  },
  '1.10': {
    rounding:  [{ topicId: '1.9', reason: { zh: '有效数字和四舍五入规则', en: 'Sig fig and rounding rules' } }],
    magnitude: [{ topicId: '1.9', reason: { zh: '上下界计算方向搞反', en: 'Upper/lower bound direction reversed' } }],
    method:    [{ topicId: '1.9', reason: { zh: '估算技能', en: 'Estimation skills' } }],
  },
  '1.11': {
    magnitude: [{ topicId: '1.4', reason: { zh: '部分与整体的分数关系', en: 'Part-to-whole fraction relationship' } }],
    method:    [
      { topicId: '1.4', reason: { zh: '分数化简', en: 'Fraction simplification' } },
      { topicId: '1.6', reason: { zh: '乘除运算', en: 'Multiplication/division operations' } },
    ],
  },
  '1.12': {
    magnitude: [
      { topicId: '1.8', reason: { zh: '数量级判断（小数点位移）', en: 'Order of magnitude judgment (decimal shift)' } },
      { topicId: '1.11', reason: { zh: '单位之间的比例换算', en: 'Ratio-based unit conversion' } },
    ],
    method:    [{ topicId: '1.11', reason: { zh: '比例关系', en: 'Ratio relationships' } }],
  },
  '1.13': {
    sign:      [{ topicId: '1.6', reason: { zh: '增长vs减少方向', en: 'Increase vs decrease direction' } }],
    magnitude: [{ topicId: '1.4', reason: { zh: '÷100 遗漏', en: '÷100 omission' } }],
    method:    [
      { topicId: '1.4', reason: { zh: '分数/百分数互转', en: 'Fraction/percentage conversion' } },
      { topicId: '1.11', reason: { zh: '比例思维', en: 'Proportional thinking' } },
    ],
  },
  '1.16': {
    sign:      [{ topicId: '1.6', reason: { zh: '利润vs亏损方向', en: 'Profit vs loss direction' } }],
    magnitude: [{ topicId: '1.11', reason: { zh: '汇率比例', en: 'Exchange rate ratio' } }],
    method:    [
      { topicId: '1.13', reason: { zh: '百分数应用', en: 'Percentage applications' } },
      { topicId: '1.11', reason: { zh: '比例关系', en: 'Ratio relationships' } },
    ],
  },
  '1.17': {
    sign:      [{ topicId: '1.6', reason: { zh: '增长vs衰减方向', en: 'Growth vs decay direction' } }],
    magnitude: [{ topicId: '1.7', reason: { zh: '幂次运算错误', en: 'Power calculation error' } }],
    method:    [
      { topicId: '1.13', reason: { zh: '百分数乘数（×1.05 vs ×0.95）', en: 'Percentage multiplier (×1.05 vs ×0.95)' } },
      { topicId: '1.7', reason: { zh: '指数法则', en: 'Index laws' } },
    ],
  },
  '1.18': {
    sign:      [{ topicId: '1.6', reason: { zh: '根式表达式符号', en: 'Surd expression signs' } }],
    magnitude: [{ topicId: '1.3', reason: { zh: '√a×√b = √(ab) 混淆', en: '√a×√b = √(ab) confusion' } }],
    method:    [
      { topicId: '1.3', reason: { zh: '平方根基础', en: 'Square root fundamentals' } },
      { topicId: '1.7', reason: { zh: '指数法则', en: 'Index laws' } },
    ],
  },

  // ─── Ch2: Algebra ───
  '2.2': {
    sign:      [
      { topicId: '1.6', reason: { zh: '展开括号: -(x-3) = -x+3', en: 'Expanding brackets: -(x-3) = -x+3' } },
      { topicId: '2.1', reason: { zh: '负值代入', en: 'Substituting negatives' } },
    ],
    magnitude: [
      { topicId: '1.3', reason: { zh: '幂的运算规则', en: 'Power operation rules' } },
      { topicId: '1.7', reason: { zh: '指数法则', en: 'Index laws' } },
    ],
    method:    [{ topicId: '2.1', reason: { zh: '代数基本概念', en: 'Algebra fundamentals' } }],
  },
  '2.3': {
    sign:      [{ topicId: '2.2', reason: { zh: '分式减法变号', en: 'Sign change when subtracting fractions' } }],
    method:    [
      { topicId: '1.4', reason: { zh: '分数通分与运算', en: 'Fraction common denominator and operations' } },
      { topicId: '2.2', reason: { zh: '因式分解', en: 'Factorisation' } },
    ],
  },
  '2.4': {
    sign:      [
      { topicId: '1.7', reason: { zh: '负指数=倒数', en: 'Negative index = reciprocal' } },
      { topicId: '2.2', reason: { zh: '代数符号处理', en: 'Algebraic sign handling' } },
    ],
    magnitude: [{ topicId: '1.7', reason: { zh: '乘法则vs加法则', en: 'Multiply rule vs add rule' } }],
    method:    [
      { topicId: '1.7', reason: { zh: '指数法则I', en: 'Index laws I' } },
      { topicId: '1.3', reason: { zh: '幂与根', en: 'Powers and roots' } },
    ],
  },
  '2.5': {
    sign:      [
      { topicId: '1.6', reason: { zh: '移项变号', en: 'Sign change when rearranging' } },
      { topicId: '2.2', reason: { zh: '展开括号符号', en: 'Sign when expanding brackets' } },
    ],
    method:    [
      { topicId: '2.2', reason: { zh: '代数化简', en: 'Algebraic simplification' } },
      { topicId: '2.1', reason: { zh: '代数基础', en: 'Algebra basics' } },
    ],
  },
  '2.6': {
    sign:      [
      { topicId: '2.5', reason: { zh: '乘负数翻转不等号', en: 'Flip inequality when ×(negative)' } },
      { topicId: '1.6', reason: { zh: '负数运算', en: 'Negative operations' } },
    ],
    method:    [{ topicId: '2.5', reason: { zh: '方程求解技巧', en: 'Equation solving techniques' } }],
  },
  '2.7': {
    sign:      [
      { topicId: '2.1', reason: { zh: '负公差', en: 'Negative common difference' } },
      { topicId: '1.6', reason: { zh: '负数运算', en: 'Negative operations' } },
    ],
    magnitude: [{ topicId: '1.7', reason: { zh: '等比数列的幂次错误', en: 'Geometric sequence power errors' } }],
    method:    [
      { topicId: '2.1', reason: { zh: '代数代入', en: 'Algebraic substitution' } },
      { topicId: '1.11', reason: { zh: '比例关系', en: 'Proportional reasoning' } },
    ],
  },
  '2.8': {
    magnitude: [{ topicId: '1.7', reason: { zh: 'y=kx^n 的幂关系', en: 'y=kx^n power relationship' } }],
    method:    [
      { topicId: '1.11', reason: { zh: '比与比例', en: 'Ratio and proportion' } },
      { topicId: '2.5', reason: { zh: '方程求解', en: 'Equation solving' } },
    ],
  },
  '2.9': {
    sign:      [{ topicId: '3.3', reason: { zh: '图像斜率方向', en: 'Graph gradient direction' } }],
    magnitude: [{ topicId: '1.12', reason: { zh: '速率单位错误', en: 'Rate unit error' } }],
    method:    [
      { topicId: '3.1', reason: { zh: '坐标读图', en: 'Reading coordinates from graph' } },
      { topicId: '1.12', reason: { zh: '速率概念', en: 'Rate concepts' } },
    ],
  },
  '2.10': {
    sign:      [
      { topicId: '2.1', reason: { zh: '代入负值', en: 'Substituting negatives' } },
      { topicId: '3.3', reason: { zh: '斜率正负', en: 'Gradient positive/negative' } },
    ],
    method:    [
      { topicId: '2.5', reason: { zh: '方程基础', en: 'Equation fundamentals' } },
      { topicId: '3.1', reason: { zh: '坐标基础', en: 'Coordinate basics' } },
    ],
  },
  '2.11': {
    sign:      [{ topicId: '2.10', reason: { zh: '反射翻转混淆', en: 'Reflection/flip confusion' } }],
    method:    [
      { topicId: '2.10', reason: { zh: '函数图像', en: 'Function graphs' } },
      { topicId: '2.5', reason: { zh: '方程', en: 'Equations' } },
    ],
  },
  '2.12': {
    sign:      [{ topicId: '2.2', reason: { zh: '幂法则中的符号', en: 'Sign in power rule' } }],
    magnitude: [{ topicId: '1.7', reason: { zh: '幂次递减错误', en: 'Power reduction error' } }],
    method:    [
      { topicId: '3.3', reason: { zh: '斜率概念（切线=瞬时梯度）', en: 'Gradient concept (tangent = instantaneous gradient)' } },
      { topicId: '2.2', reason: { zh: '代数运算', en: 'Algebraic manipulation' } },
    ],
  },
  '2.13': {
    sign:      [{ topicId: '2.1', reason: { zh: '代入负值', en: 'Substituting negatives' } }],
    method:    [
      { topicId: '2.5', reason: { zh: '解方程（求逆函数）', en: 'Solving equations (finding inverse)' } },
      { topicId: '2.2', reason: { zh: '代数运算', en: 'Algebraic manipulation' } },
    ],
  },

  // ─── Ch3: Coordinate Geometry ───
  '3.1': {
    sign:      [{ topicId: '1.6', reason: { zh: '负坐标在哪个象限', en: 'Which quadrant for negative coordinates' } }],
    method:    [{ topicId: '1.5', reason: { zh: '数轴排序', en: 'Number line ordering' } }],
  },
  '3.2': {
    sign:      [
      { topicId: '2.1', reason: { zh: '代入负x值', en: 'Substituting negative x values' } },
      { topicId: '1.6', reason: { zh: '负数运算', en: 'Negative operations' } },
    ],
    method:    [
      { topicId: '2.1', reason: { zh: '代入法', en: 'Substitution method' } },
      { topicId: '3.1', reason: { zh: '坐标定位', en: 'Coordinate plotting' } },
    ],
  },
  '3.3': {
    sign:      [
      { topicId: '1.6', reason: { zh: '(y₂-y₁)/(x₂-x₁) 负值处理', en: 'Handling negatives in (y₂-y₁)/(x₂-x₁)' } },
      { topicId: '3.1', reason: { zh: '坐标读取错误', en: 'Coordinate reading error' } },
    ],
    magnitude: [{ topicId: '1.11', reason: { zh: '分数化简', en: 'Fraction simplification' } }],
    method:    [
      { topicId: '1.11', reason: { zh: '比值概念（变化率）', en: 'Ratio concept (rate of change)' } },
      { topicId: '3.1', reason: { zh: '坐标读图', en: 'Reading coordinates' } },
    ],
  },
  '3.4': {
    sign:      [{ topicId: '1.6', reason: { zh: '差值平方中的负号', en: 'Negatives when squaring differences' } }],
    magnitude: [{ topicId: '1.3', reason: { zh: '忘记开平方根', en: 'Forgot to take square root' } }],
    method:    [
      { topicId: '1.3', reason: { zh: '平方与平方根', en: 'Squaring and square roots' } },
      { topicId: '3.1', reason: { zh: '坐标读取', en: 'Coordinate reading' } },
    ],
  },
  '3.5': {
    sign:      [
      { topicId: '3.3', reason: { zh: '斜率正负号', en: 'Gradient sign' } },
      { topicId: '2.1', reason: { zh: '代入计算截距', en: 'Substitution to find intercept' } },
    ],
    method:    [
      { topicId: '3.3', reason: { zh: '斜率概念', en: 'Gradient concept' } },
      { topicId: '2.5', reason: { zh: '解方程', en: 'Solving equations' } },
    ],
  },
  '3.6': {
    sign:      [{ topicId: '3.3', reason: { zh: '斜率符号', en: 'Gradient sign' } }],
    method:    [
      { topicId: '3.3', reason: { zh: '斜率概念', en: 'Gradient concept' } },
      { topicId: '3.5', reason: { zh: '直线方程', en: 'Line equations' } },
    ],
  },
  '3.7': {
    sign:      [
      { topicId: '3.3', reason: { zh: '负倒数符号', en: 'Negative reciprocal sign' } },
      { topicId: '1.6', reason: { zh: '负数倒数', en: 'Negative reciprocal' } },
    ],
    magnitude: [{ topicId: '1.11', reason: { zh: '倒数运算', en: 'Reciprocal operation' } }],
    method:    [
      { topicId: '3.6', reason: { zh: '平行线概念', en: 'Parallel lines concept' } },
      { topicId: '1.11', reason: { zh: '比例与倒数', en: 'Ratio and reciprocal' } },
    ],
  },

  // ─── Ch4: Geometry ───
  '4.3': {
    magnitude: [{ topicId: '1.11', reason: { zh: '比例尺换算（1:50000）', en: 'Scale conversion (1:50000)' } }],
    method:    [
      { topicId: '1.11', reason: { zh: '比与比例', en: 'Ratio and proportion' } },
      { topicId: '4.1', reason: { zh: '几何术语', en: 'Geometry terms' } },
    ],
  },
  '4.4': {
    magnitude: [
      { topicId: '1.11', reason: { zh: '比例因子 k', en: 'Scale factor k' } },
      { topicId: '1.3', reason: { zh: '面积比=k²，体积比=k³', en: 'Area ratio=k², volume ratio=k³' } },
    ],
    method:    [
      { topicId: '1.11', reason: { zh: '比例关系', en: 'Ratio relationships' } },
      { topicId: '4.1', reason: { zh: '图形性质', en: 'Shape properties' } },
    ],
  },
  '4.6': {
    magnitude: [{ topicId: '1.6', reason: { zh: '角度和运算错误（三角形≠360°）', en: 'Angle sum error (triangle≠360°)' } }],
    method:    [
      { topicId: '4.1', reason: { zh: '几何基本性质', en: 'Basic geometry properties' } },
    ],
  },
  '4.7': {
    method:    [
      { topicId: '4.6', reason: { zh: '角度推理', en: 'Angle reasoning' } },
      { topicId: '4.1', reason: { zh: '圆的基本性质', en: 'Circle basic properties' } },
    ],
  },
  '4.8': {
    method:    [
      { topicId: '4.2', reason: { zh: '作图基础', en: 'Construction fundamentals' } },
      { topicId: '4.6', reason: { zh: '角度', en: 'Angles' } },
    ],
  },

  // ─── Ch5: Mensuration ───
  '5.1': {
    magnitude: [
      { topicId: '1.8', reason: { zh: '数量级（km ↔ m ↔ cm ↔ mm）', en: 'Magnitude (km ↔ m ↔ cm ↔ mm)' } },
      { topicId: '1.3', reason: { zh: '面积/体积单位换算需要幂', en: 'Area/volume unit conversion needs powers' } },
    ],
    method:    [
      { topicId: '1.11', reason: { zh: '比例换算', en: 'Ratio conversion' } },
      { topicId: '1.4', reason: { zh: '小数运算', en: 'Decimal operations' } },
    ],
  },
  '5.2': {
    magnitude: [{ topicId: '1.6', reason: { zh: '三角形面积÷2遗漏', en: 'Forgot ÷2 for triangle area' } }],
    method:    [
      { topicId: '4.1', reason: { zh: '图形识别（底×高）', en: 'Shape identification (base×height)' } },
      { topicId: '1.6', reason: { zh: '四则运算', en: 'Four operations' } },
    ],
  },
  '5.3': {
    magnitude: [
      { topicId: '5.2', reason: { zh: '直径vs半径（×2 错误）', en: 'Diameter vs radius (×2 error)' } },
      { topicId: '1.11', reason: { zh: '扇形=圆的分数 θ/360', en: 'Sector = fraction of circle θ/360' } },
    ],
    method:    [
      { topicId: '1.11', reason: { zh: '比例思维（弧长=周长的几分之几）', en: 'Proportional thinking (arc = fraction of circumference)' } },
      { topicId: '5.2', reason: { zh: '面积基础', en: 'Area fundamentals' } },
    ],
  },
  '5.4': {
    magnitude: [
      { topicId: '1.3', reason: { zh: 'r²和r³混淆', en: 'Confusing r² and r³' } },
      { topicId: '5.1', reason: { zh: '单位换算（cm³ ≠ m³）', en: 'Unit conversion (cm³ ≠ m³)' } },
    ],
    method:    [
      { topicId: '5.2', reason: { zh: '2D面积 → 3D表面积', en: '2D area → 3D surface area' } },
      { topicId: '5.3', reason: { zh: '圆的面积/周长', en: 'Circle area/circumference' } },
    ],
  },
  '5.5': {
    sign:      [{ topicId: '1.6', reason: { zh: '组合图形加vs减面积', en: 'Compound shapes: add vs subtract area' } }],
    magnitude: [{ topicId: '5.2', reason: { zh: '重复计算或遗漏部分', en: 'Double counting or missing section' } }],
    method:    [
      { topicId: '5.2', reason: { zh: '基本面积公式', en: 'Basic area formulas' } },
      { topicId: '5.3', reason: { zh: '圆/扇形面积', en: 'Circle/sector area' } },
      { topicId: '5.4', reason: { zh: '体积公式', en: 'Volume formulas' } },
    ],
  },

  // ─── Ch6: Trigonometry ───
  '6.1': {
    rounding:  [
      { topicId: '1.9', reason: { zh: '根号结果的有效数字', en: 'Sig figs for square root results' } },
      { topicId: '1.3', reason: { zh: '平方根运算', en: 'Square root operations' } },
    ],
    magnitude: [{ topicId: '1.3', reason: { zh: '忘记开√或误平方', en: 'Forgot √ or mis-squared' } }],
    method:    [
      { topicId: '1.3', reason: { zh: '幂与根', en: 'Powers and roots' } },
      { topicId: '4.6', reason: { zh: '识别直角', en: 'Identifying the right angle' } },
    ],
  },
  '6.2': {
    sign:      [{ topicId: '4.6', reason: { zh: '角度方向判断', en: 'Angle direction judgment' } }],
    magnitude: [{ topicId: '1.11', reason: { zh: '用错比率（sin vs cos vs tan）', en: 'Wrong ratio (sin vs cos vs tan)' } }],
    method:    [
      { topicId: '6.1', reason: { zh: '勾股定理', en: 'Pythagoras theorem' } },
      { topicId: '1.11', reason: { zh: '三角比=对边/邻边/斜边的比', en: 'Trig ratio = ratio of sides' } },
    ],
  },
  '6.3': {
    sign:      [{ topicId: '4.6', reason: { zh: '象限符号', en: 'Quadrant signs' } }],
    method:    [
      { topicId: '6.2', reason: { zh: '三角比基础', en: 'Trig ratio fundamentals' } },
      { topicId: '1.18', reason: { zh: '根式（√3/2 等）', en: 'Surds (√3/2 etc.)' } },
    ],
  },
  '6.4': {
    sign:      [
      { topicId: '6.3', reason: { zh: '三角函数符号变化', en: 'Trig function sign changes' } },
      { topicId: '3.3', reason: { zh: '图像平移与翻转', en: 'Graph shift and reflection' } },
    ],
    method:    [
      { topicId: '6.2', reason: { zh: '三角比', en: 'Trig ratios' } },
      { topicId: '2.10', reason: { zh: '函数图像', en: 'Function graphs' } },
    ],
  },
  '6.5': {
    sign:      [
      { topicId: '2.2', reason: { zh: '余弦定理中的负号 a²=b²+c²-2bc·cosA', en: 'Sign in cosine rule: a²=b²+c²-2bc·cosA' } },
      { topicId: '6.2', reason: { zh: '钝角的cos为负', en: 'cos is negative for obtuse angles' } },
    ],
    magnitude: [{ topicId: '5.2', reason: { zh: '面积公式 ½ab sinC', en: 'Area formula ½ab sinC' } }],
    method:    [
      { topicId: '6.2', reason: { zh: '直角三角形三角比', en: 'Right triangle trig ratios' } },
      { topicId: '5.2', reason: { zh: '面积概念', en: 'Area concept' } },
    ],
  },
  '6.6': {
    magnitude: [{ topicId: '6.1', reason: { zh: '选错对角线', en: 'Wrong diagonal identified' } }],
    method:    [
      { topicId: '6.1', reason: { zh: '勾股定理', en: 'Pythagoras theorem' } },
      { topicId: '5.4', reason: { zh: '3D图形认知', en: '3D shape knowledge' } },
    ],
  },

  // ─── Ch7: Transformations & Vectors ───
  '7.1': {
    sign:      [
      { topicId: '3.1', reason: { zh: '负坐标', en: 'Negative coordinates' } },
      { topicId: '4.6', reason: { zh: '旋转方向（顺时针vs逆时针）', en: 'Rotation direction (CW vs CCW)' } },
    ],
    magnitude: [{ topicId: '1.11', reason: { zh: '放大比例因子', en: 'Enlargement scale factor' } }],
    method:    [
      { topicId: '3.1', reason: { zh: '坐标系', en: 'Coordinate system' } },
      { topicId: '4.6', reason: { zh: '角度', en: 'Angles' } },
    ],
  },
  '7.2': {
    sign:      [
      { topicId: '1.6', reason: { zh: '向量分量正负', en: 'Vector component signs' } },
      { topicId: '3.1', reason: { zh: '方向=坐标差', en: 'Direction = coordinate difference' } },
    ],
    magnitude: [{ topicId: '1.6', reason: { zh: '标量乘法错误', en: 'Scalar multiplication error' } }],
    method:    [
      { topicId: '3.1', reason: { zh: '坐标理解', en: 'Coordinate understanding' } },
      { topicId: '1.6', reason: { zh: '加法/减法运算', en: 'Addition/subtraction operations' } },
    ],
  },
  '7.3': {
    magnitude: [{ topicId: '1.3', reason: { zh: '忘记开√或误平方', en: 'Forgot √ or mis-squared' } }],
    method:    [
      { topicId: '6.1', reason: { zh: '勾股定理', en: 'Pythagoras theorem' } },
      { topicId: '7.2', reason: { zh: '向量基础', en: 'Vector fundamentals' } },
    ],
  },
  '7.4': {
    sign:      [
      { topicId: '7.2', reason: { zh: '向量方向', en: 'Vector direction' } },
      { topicId: '2.2', reason: { zh: '代数符号', en: 'Algebraic signs' } },
    ],
    magnitude: [{ topicId: '1.11', reason: { zh: '位置向量比例', en: 'Position vector ratio' } }],
    method:    [
      { topicId: '7.2', reason: { zh: '向量运算', en: 'Vector operations' } },
      { topicId: '2.2', reason: { zh: '代数化简', en: 'Algebraic simplification' } },
    ],
  },

  // ─── Ch8: Probability ───
  '8.1': {
    magnitude: [{ topicId: '1.4', reason: { zh: '概率范围 0≤P≤1', en: 'Probability range 0≤P≤1' } }],
    method:    [
      { topicId: '1.4', reason: { zh: '分数运算', en: 'Fraction operations' } },
      { topicId: '1.2', reason: { zh: '集合概念', en: 'Set concepts' } },
    ],
  },
  '8.2': {
    magnitude: [{ topicId: '1.13', reason: { zh: '百分比换算', en: 'Percentage conversion' } }],
    method:    [
      { topicId: '8.1', reason: { zh: '概率基础', en: 'Probability basics' } },
      { topicId: '1.11', reason: { zh: '比例', en: 'Proportion' } },
    ],
  },
  '8.3': {
    magnitude: [{ topicId: '1.4', reason: { zh: 'P(A和B)=相乘, P(A或B)=相加 混淆', en: 'P(A and B)=multiply, P(A or B)=add confusion' } }],
    method:    [
      { topicId: '8.1', reason: { zh: '概率基础', en: 'Probability basics' } },
      { topicId: '1.4', reason: { zh: '分数乘法', en: 'Fraction multiplication' } },
    ],
  },
  '8.4': {
    magnitude: [{ topicId: '8.3', reason: { zh: 'P(A∩B) vs P(A|B) 混淆', en: 'P(A∩B) vs P(A|B) confusion' } }],
    method:    [
      { topicId: '8.3', reason: { zh: '组合事件', en: 'Combined events' } },
      { topicId: '1.2', reason: { zh: '集合论（韦恩图）', en: 'Set theory (Venn diagrams)' } },
    ],
  },

  // ─── Ch9: Statistics ───
  '9.1': {
    method:    [{ topicId: '1.1', reason: { zh: '数据类型分类', en: 'Data type classification' } }],
  },
  '9.2': {
    magnitude: [{ topicId: '1.8', reason: { zh: '刻度读数错误', en: 'Scale reading error' } }],
    method:    [{ topicId: '3.1', reason: { zh: '坐标读图', en: 'Coordinate graph reading' } }],
  },
  '9.3': {
    magnitude: [{ topicId: '1.6', reason: { zh: '总数÷个数错误', en: 'Sum ÷ count error' } }],
    method:    [
      { topicId: '1.6', reason: { zh: '四则运算', en: 'Four operations' } },
      { topicId: '1.5', reason: { zh: '排序（求中位数）', en: 'Ordering (for median)' } },
    ],
  },
  '9.4': {
    magnitude: [{ topicId: '1.11', reason: { zh: '饼图角度=分数×360', en: 'Pie chart angle = fraction × 360' } }],
    method:    [
      { topicId: '3.1', reason: { zh: '图表绘制', en: 'Chart plotting' } },
      { topicId: '1.11', reason: { zh: '比例', en: 'Proportion' } },
    ],
  },
  '9.5': {
    sign:      [{ topicId: '3.3', reason: { zh: '最佳拟合线的斜率方向', en: 'Line of best fit gradient direction' } }],
    method:    [
      { topicId: '3.3', reason: { zh: '斜率', en: 'Gradient' } },
      { topicId: '3.5', reason: { zh: '直线方程', en: 'Line equations' } },
    ],
  },
  '9.6': {
    magnitude: [{ topicId: '9.3', reason: { zh: '混淆频率vs累积频率', en: 'Confusing frequency vs cumulative frequency' } }],
    method:    [
      { topicId: '9.3', reason: { zh: '平均数与离散度', en: 'Averages and spread' } },
      { topicId: '3.1', reason: { zh: '坐标读图', en: 'Coordinate reading' } },
    ],
  },
  '9.7': {
    magnitude: [{ topicId: '1.11', reason: { zh: '频率密度=频率÷组距', en: 'Frequency density = freq ÷ class width' } }],
    method:    [
      { topicId: '1.11', reason: { zh: '比值', en: 'Ratio' } },
      { topicId: '9.4', reason: { zh: '统计图表基础', en: 'Statistical chart basics' } },
    ],
  },
};

// ── Public API ──

/**
 * Get direct remediation targets for a topic + error type.
 * Returns topic-specific overrides first, then chapter defaults as fallback.
 */
export function getRemediationTopics(
  topicId: string,
  errorType: ErrorType,
): RemediationEntry[] {
  // 1. Topic-specific override
  const topicMap = TOPIC_REMEDIATION[topicId];
  if (topicMap?.[errorType]) {
    return topicMap[errorType]!.filter(e => e.topicId !== topicId);
  }

  // 2. Chapter-level default (filter out self-references)
  const chapterId = 'ch' + topicId.split('.')[0];
  const chapterMap = CHAPTER_DEFAULTS[chapterId];
  if (chapterMap?.[errorType]) {
    return chapterMap[errorType]!.filter(e => e.topicId !== topicId);
  }

  // 3. Nothing found
  return [];
}

/**
 * Recursive remediation chain: trace error causes back through the
 * knowledge graph. If a remediation target ALSO has errors, recurse
 * until we reach a healthy node or a base topic (ch1 early topics).
 *
 * Returns a chain ordered from most immediate → deepest root cause.
 * Max depth 4 to prevent unbounded recursion.
 */
export function getRemediationChain(
  topicId: string,
  errorType: ErrorType,
  mistakes: Record<string, MistakeRecord>,
  missionTopicMap: Map<string, number[]>,
  maxDepth = 4,
): RemediationEntry[] {
  const visited = new Set<string>();
  const chain: RemediationEntry[] = [];

  function recurse(tid: string, etype: ErrorType, depth: number) {
    if (depth > maxDepth || visited.has(tid)) return;
    visited.add(tid);

    const targets = getRemediationTopics(tid, etype);
    for (const target of targets) {
      chain.push(target);

      // Check if this remediation target has errors too
      const missionIds = missionTopicMap.get(target.topicId) ?? [];
      const topicDominant = getTopicDominantError(missionIds, mistakes);
      if (topicDominant) {
        // This prereq is also weak — recurse deeper
        recurse(target.topicId, topicDominant, depth + 1);
      }
    }
  }

  recurse(topicId, errorType, 0);
  return chain;
}

/** Helper: find the dominant error pattern across all missions in a topic */
function getTopicDominantError(
  missionIds: number[],
  mistakes: Record<string, MistakeRecord>,
): ErrorType | null {
  let maxCount = 0;
  let dominant: ErrorType | null = null;

  for (const mid of missionIds) {
    const rec = mistakes[String(mid)];
    if (rec && rec.count >= 3) { // only consider topics with significant errors
      const pattern = getDominantPattern(rec);
      if (pattern && rec.count > maxCount) {
        maxCount = rec.count;
        dominant = pattern;
      }
    }
  }

  return dominant;
}

/**
 * Get all remediation entries for a topic across ALL error types.
 * Useful for showing the full "skill dependency tree" in UI.
 */
export function getAllRemediations(topicId: string): Record<ErrorType, RemediationEntry[]> {
  const errorTypes: ErrorType[] = ['sign', 'rounding', 'magnitude', 'method', 'unknown'];
  const result = {} as Record<ErrorType, RemediationEntry[]>;
  for (const etype of errorTypes) {
    result[etype] = getRemediationTopics(topicId, etype);
  }
  return result;
}

/**
 * Deep recursive trace: follow remediation links all the way to ch1 roots.
 * Unlike getRemediationChain (max 4 levels, collects all branches),
 * this function:
 *   - Goes up to maxDepth=8
 *   - Only collects nodes that are actually WEAK (errors ≥ weakThreshold)
 *   - Deduplicates by topicId (first occurrence wins)
 *   - Returns nodes in DFS order (immediate prereq → deepest root)
 *
 * The caller should REVERSE the result for a "start from deepest" path.
 */
export function getDeepRemediationPath(
  topicId: string,
  errorType: ErrorType,
  mistakes: Record<string, MistakeRecord>,
  missionTopicMap: Map<string, number[]>,
  weakThreshold = 3,
  maxDepth = 8,
): RemediationEntry[] {
  const visited = new Set<string>();
  const path: RemediationEntry[] = [];

  function recurse(tid: string, etype: ErrorType, depth: number) {
    if (depth > maxDepth || visited.has(tid)) return;
    visited.add(tid);

    const targets = getRemediationTopics(tid, etype);
    for (const target of targets) {
      // Only include nodes that are actually weak
      const missionIds = missionTopicMap.get(target.topicId) ?? [];
      const isWeak = missionIds.some(mid => {
        const rec = mistakes[String(mid)];
        return rec && rec.count >= weakThreshold;
      });

      if (isWeak) {
        path.push(target);
        // Continue tracing through this weak node
        const topicDominant = getTopicDominantError(missionIds, mistakes);
        if (topicDominant) {
          recurse(target.topicId, topicDominant, depth + 1);
        }
      }
    }
  }

  recurse(topicId, errorType, 0);
  return path;
}
