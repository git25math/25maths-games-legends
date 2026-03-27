/**
 * Error Pattern Identification System — v1.0 (Rule-Based)
 *
 * Three-layer architecture:
 *   Layer 1: Question-level — match specific wrong answers to known patterns
 *   Layer 2: Skill-level — aggregate patterns to tech tree nodes
 *   Layer 3: Transfer-level — detect cross-node cognitive weaknesses (future)
 *
 * Design principles:
 *   1. Rules first, AI later
 *   2. Few high-quality patterns > many vague ones
 *   3. Every pattern must have a Recovery Pack
 *   4. Every pattern must be explainable to students
 */

import type { ErrorType } from './diagnoseError';

// ═══════════════════════════════════════════════════════════════
// Error Pattern Registry — Controlled Vocabulary
// ═══════════════════════════════════════════════════════════════

export type ErrorPattern = {
  id: string;                    // e.g., "sign_distribution"
  domain: string;                // e.g., "algebra"
  topicIds: string[];            // tech tree topics this pattern affects
  label: { en: string; zh: string };
  description: { en: string; zh: string };
  icon: string;                  // e.g., "±"
  severityWeight: number;        // 1.0 = normal, 1.5 = severe
  legacyType: ErrorType;         // maps to existing diagnoseError type
  recoveryHint: { en: string; zh: string };
  recoveryPackId: string;        // e.g., "RP-ALG-001"
};

/** Central error pattern registry — single source of truth */
export const ERROR_PATTERNS: Record<string, ErrorPattern> = {
  // ── Algebra: Expansion ──
  sign_distribution: {
    id: 'sign_distribution',
    domain: 'algebra',
    topicIds: ['2.2', '2.3', '2.5'],
    label: { en: 'Sign Distribution Error', zh: '符号分配失误' },
    description: {
      en: 'Negative sign not distributed to all terms inside brackets.',
      zh: '负号没有正确分配给括号内的每一项。',
    },
    icon: '±',
    severityWeight: 1.4,
    legacyType: 'sign',
    recoveryHint: {
      en: 'Remember: multiply the sign to EVERY term inside the bracket.',
      zh: '记住：把括号外的符号乘到括号内的每一项。',
    },
    recoveryPackId: 'RP-ALG-001',
  },

  term_omission: {
    id: 'term_omission',
    domain: 'algebra',
    topicIds: ['2.2', '2.3'],
    label: { en: 'Term Omission', zh: '漏项' },
    description: {
      en: 'One or more terms were lost during expansion or simplification.',
      zh: '展开或化简过程中丢失了一项或多项。',
    },
    icon: '…',
    severityWeight: 1.2,
    legacyType: 'method',
    recoveryHint: {
      en: 'Count the terms: multiply each term inside by the factor outside.',
      zh: '数一数项数：外面的因子要乘到里面的每一项。',
    },
    recoveryPackId: 'RP-ALG-002',
  },


  coefficient_distribution: {
    id: 'coefficient_distribution',
    domain: 'algebra',
    topicIds: ['2.1', '2.2', '2.3', '2.5'],
    label: { en: 'Coefficient Distribution Error', zh: '系数分配计算错误' },
    description: {
      en: 'Expansion structure correct but coefficient multiplication is wrong.',
      zh: '展开结构正确但系数乘法计算出错。',
    },
    icon: '×',
    severityWeight: 1.1,
    legacyType: 'method',
    recoveryHint: {
      en: 'Multiply the outside number by EACH coefficient inside: 4(2x-3) means 4×2x and 4×(-3).',
      zh: '把外面的数和里面每个系数相乘：4(2x-3) 就是 4×2x 和 4×(-3)。',
    },
    recoveryPackId: 'RP-ALG-004',
  },

  like_term_merge: {
    id: 'like_term_merge',
    domain: 'algebra',
    topicIds: ['2.1', '2.2'],
    label: { en: 'Like Terms Error', zh: '同类项合并错误' },
    description: {
      en: 'Failed to correctly combine like terms (same variable, same power).',
      zh: '没有正确合并同类项（相同变量、相同次数）。',
    },
    icon: 'x+x',
    severityWeight: 1.0,
    legacyType: 'method',
    recoveryHint: {
      en: 'Like terms have the same letter and power. Only add/subtract the coefficients.',
      zh: '同类项的字母和次数相同，只需加减系数。',
    },
    recoveryPackId: 'RP-ALG-003',
  },

  operation_order: {
    id: 'operation_order',
    domain: 'number',
    topicIds: ['1.6', '2.1'],
    label: { en: 'Operation Order (BODMAS)', zh: '运算顺序错误' },
    description: {
      en: 'Operations performed in wrong order (BODMAS/BIDMAS not followed).',
      zh: '运算顺序不对，没有遵循先乘除后加减。',
    },
    icon: 'B·O',
    severityWeight: 1.3,
    legacyType: 'method',
    recoveryHint: {
      en: 'BODMAS: Brackets → Orders → Division/Multiplication → Addition/Subtraction.',
      zh: '运算顺序：括号 → 指数 → 乘除 → 加减。',
    },
    recoveryPackId: 'RP-NUM-001',
  },

  // ── Algebra: Equations ──
  inverse_operation: {
    id: 'inverse_operation',
    domain: 'algebra',
    topicIds: ['2.5', '2.6'],
    label: { en: 'Inverse Operation Error', zh: '逆运算错误' },
    description: {
      en: 'Used wrong inverse when solving (e.g., subtracted instead of divided).',
      zh: '解方程时用了错误的逆运算（如用减法代替除法）。',
    },
    icon: '⟲',
    severityWeight: 1.2,
    legacyType: 'method',
    recoveryHint: {
      en: 'To "undo" an operation: + ↔ −, × ↔ ÷, ^2 ↔ √.',
      zh: '逆运算：加↔减，乘↔除，平方↔开根号。',
    },
    recoveryPackId: 'RP-ALG-005',
  },

  equation_balance: {
    id: 'equation_balance',
    domain: 'algebra',
    topicIds: ['2.5'],
    label: { en: 'Equation Balance Error', zh: '等式不平衡' },
    description: {
      en: 'Operation applied to one side of the equation but not the other.',
      zh: '操作只对等式一边进行，没有两边同时操作。',
    },
    icon: '⚖',
    severityWeight: 1.3,
    legacyType: 'method',
    recoveryHint: {
      en: 'Whatever you do to one side, do exactly the same to the other side.',
      zh: '对一边做的操作，另一边也要做完全一样的。',
    },
    recoveryPackId: 'RP-ALG-006',
  },

  // ── Number: Fractions ──
  fraction_operation: {
    id: 'fraction_operation',
    domain: 'number',
    topicIds: ['1.4', '1.6'],
    label: { en: 'Fraction Operation Error', zh: '分数运算错误' },
    description: {
      en: 'Error in adding/subtracting/multiplying fractions (e.g., added denominators).',
      zh: '分数加减乘除出错（如分母相加了）。',
    },
    icon: '½',
    severityWeight: 1.1,
    legacyType: 'method',
    recoveryHint: {
      en: 'Add/subtract: find common denominator first. Multiply: top × top, bottom × bottom.',
      zh: '加减：先通分。乘法：分子×分子，分母×分母。',
    },
    recoveryPackId: 'RP-NUM-002',
  },

  // ── Number: Percentages ──
  percentage_direction: {
    id: 'percentage_direction',
    domain: 'number',
    topicIds: ['1.13'],
    label: { en: 'Percentage Direction Error', zh: '百分数方向错误' },
    description: {
      en: 'Increase vs decrease confusion, or finding % of wrong base.',
      zh: '增加/减少搞反，或以错误的基数计算百分数。',
    },
    icon: '%↕',
    severityWeight: 1.1,
    legacyType: 'method',
    recoveryHint: {
      en: 'Increase: multiply by (1 + r). Decrease: multiply by (1 − r). Base is always the ORIGINAL.',
      zh: '增加：×(1+r)。减少：×(1−r)。基数永远是原来的值。',
    },
    recoveryPackId: 'RP-NUM-003',
  },

  // ── Geometry: Angles ──
  angle_sum_rule: {
    id: 'angle_sum_rule',
    domain: 'geometry',
    topicIds: ['4.6'],
    label: { en: 'Angle Sum Rule Error', zh: '角度求和规则错误' },
    description: {
      en: 'Used wrong angle sum (e.g., 360° for triangle instead of 180°).',
      zh: '用了错误的角度总和（如三角形用了360°而不是180°）。',
    },
    icon: '△°',
    severityWeight: 1.0,
    legacyType: 'method',
    recoveryHint: {
      en: 'Triangle = 180°. Quadrilateral = 360°. Polygon = (n−2) × 180°.',
      zh: '三角形 = 180°。四边形 = 360°。多边形 = (n−2) × 180°。',
    },
    recoveryPackId: 'RP-GEO-001',
  },

  // ── Geometry: Parallel Lines ──
  parallel_line_angle: {
    id: 'parallel_line_angle',
    domain: 'geometry',
    topicIds: ['4.6', '4.7'],
    label: { en: 'Parallel Line Angle Error', zh: '平行线角度混淆' },
    description: {
      en: 'Confused alternate, corresponding, or co-interior angles formed by a transversal cutting parallel lines.',
      zh: '平行线被截线切割时，混淆了内错角、同位角或同旁内角。',
    },
    icon: '∥°',
    severityWeight: 1.2,
    legacyType: 'method',
    recoveryHint: {
      en: 'Alternate (Z-angles) = equal. Corresponding (F-angles) = equal. Co-interior (C-angles) add up to 180°.',
      zh: '内错角（Z形）相等。同位角（F形）相等。同旁内角（C形）之和为180°。',
    },
    recoveryPackId: 'RP-GEO-002',
  },

  // ── Geometry: Pythagoras ──
  pythagoras_hypotenuse: {
    id: 'pythagoras_hypotenuse',
    domain: 'geometry',
    topicIds: ['4.8'],
    label: { en: 'Pythagoras Hypotenuse Error', zh: '勾股定理斜边识别错误' },
    description: {
      en: 'Incorrectly identified the hypotenuse, or subtracted when should have added (or vice versa).',
      zh: '斜边识别错误，或者加减运算方向搞反了（勾股加还是减）。',
    },
    icon: 'a²+b²',
    severityWeight: 1.1,
    legacyType: 'method',
    recoveryHint: {
      en: 'The hypotenuse c is always opposite the right angle (the longest side). c² = a² + b². To find a leg: a² = c² − b².',
      zh: '斜边c永远对着直角（最长边）。求斜边：c² = a² + b²。求直角边：a² = c² − b²。',
    },
    recoveryPackId: 'RP-GEO-003',
  },

  // ── Geometry: Area/Perimeter ──
  area_formula_wrong: {
    id: 'area_formula_wrong',
    domain: 'geometry',
    topicIds: ['5.2', '5.3'],
    label: { en: 'Wrong Area Formula', zh: '面积公式用错' },
    description: {
      en: 'Applied the wrong area formula (e.g., rectangle formula for triangle, or forgot the ½ factor).',
      zh: '用了错误的面积公式（如用矩形公式算三角形，或忘了½系数）。',
    },
    icon: '½bh',
    severityWeight: 1.1,
    legacyType: 'method',
    recoveryHint: {
      en: 'Rectangle: l×w. Triangle: ½×base×height. Parallelogram: base×height. Trapezium: ½(a+b)×h.',
      zh: '长方形: l×w。三角形: ½×底×高。平行四边形: 底×高。梯形: ½(a+b)×h。',
    },
    recoveryPackId: 'RP-GEO-004',
  },

  // ── Geometry: Circles ──
  arc_sector_confusion: {
    id: 'arc_sector_confusion',
    domain: 'geometry',
    topicIds: ['5.4', '5.5'],
    label: { en: 'Arc/Sector Confusion', zh: '弧长与扇形面积混淆' },
    description: {
      en: 'Used the sector area formula when arc length was asked (or vice versa), or forgot the angle fraction θ/360.',
      zh: '题目求弧长却算了扇形面积（或反之），或忘记用角度分数θ/360。',
    },
    icon: '⌒vs⌖',
    severityWeight: 1.2,
    legacyType: 'method',
    recoveryHint: {
      en: 'Arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². Both need the angle fraction θ/360.',
      zh: '弧长 = (θ/360) × 2πr。扇形面积 = (θ/360) × πr²。两个公式都需要角度分数θ/360。',
    },
    recoveryPackId: 'RP-GEO-005',
  },

  circle_theorem_error: {
    id: 'circle_theorem_error',
    domain: 'geometry',
    topicIds: ['4.9'],
    label: { en: 'Circle Theorem Misapplied', zh: '圆周角定理误用' },
    description: {
      en: 'Applied the wrong circle theorem, or confused the inscribed angle with the central angle.',
      zh: '用错了圆周定理，或混淆了圆周角与圆心角。',
    },
    icon: '⊙°',
    severityWeight: 1.3,
    legacyType: 'method',
    recoveryHint: {
      en: 'Key theorems: (1) Angle in a semicircle = 90°. (2) Central angle = 2 × inscribed angle on same arc. (3) Angles in same segment are equal.',
      zh: '关键定理：①直径所对圆周角=90°。②圆心角=同弧上圆周角的2倍。③同弧上圆周角相等。',
    },
    recoveryPackId: 'RP-GEO-006',
  },

  // ── Trigonometry ──
  trig_ratio_swap: {
    id: 'trig_ratio_swap',
    domain: 'trigonometry',
    topicIds: ['6.2'],
    label: { en: 'Trig Ratio Swap', zh: '三角比用错' },
    description: {
      en: 'Used sin when should have used cos (or vice versa), or mixed up O/A/H.',
      zh: '该用 sin 时用了 cos（或反过来），或者对边/邻边/斜边搞混了。',
    },
    icon: 'sin↔cos',
    severityWeight: 1.3,
    legacyType: 'method',
    recoveryHint: {
      en: 'SOH CAH TOA: Sin=Opposite/Hypotenuse, Cos=Adjacent/Hypotenuse, Tan=Opposite/Adjacent.',
      zh: 'SOH CAH TOA: Sin=对边/斜边, Cos=邻边/斜边, Tan=对边/邻边。',
    },
    recoveryPackId: 'RP-TRIG-001',
  },

  trig_inverse_confusion: {
    id: 'trig_inverse_confusion',
    domain: 'trigonometry',
    topicIds: ['6.2', '6.3'],
    label: { en: 'Trig Inverse Confusion', zh: '反三角函数混淆' },
    description: {
      en: 'Confused sin⁻¹(x) with 1/sin(x), or forgot to apply the inverse function when finding an angle.',
      zh: '把 sin⁻¹(x) 误作 1/sin(x)，或求角度时忘记使用反三角函数。',
    },
    icon: 'sin⁻¹',
    severityWeight: 1.2,
    legacyType: 'method',
    recoveryHint: {
      en: 'sin⁻¹(x) means "the angle whose sin is x" — press INV/SHIFT on calculator. It does NOT equal 1/sin(x).',
      zh: 'sin⁻¹(x) 是"sin值为x的角度"——按计算器INV/SHIFT键。它不等于1/sin(x)。',
    },
    recoveryPackId: 'RP-TRIG-002',
  },

  sine_cosine_rule_choice: {
    id: 'sine_cosine_rule_choice',
    domain: 'trigonometry',
    topicIds: ['6.4', '6.5'],
    label: { en: 'Wrong Sine/Cosine Rule', zh: '正弦/余弦定理选择错误' },
    description: {
      en: 'Used the sine rule when the cosine rule was needed (or vice versa), leading to an unsolvable setup.',
      zh: '该用余弦定理时用了正弦定理（或反之），导致方程无解。',
    },
    icon: 'a/sinA',
    severityWeight: 1.3,
    legacyType: 'method',
    recoveryHint: {
      en: 'Sine Rule: use when you have angle-side pairs (AAS or SSA). Cosine Rule: use for SAS (two sides + included angle) or SSS (three sides).',
      zh: '正弦定理：角-边对应已知（AAS/SSA）。余弦定理：两边夹角(SAS)或三边已知(SSS)。',
    },
    recoveryPackId: 'RP-TRIG-003',
  },

  bearing_direction_error: {
    id: 'bearing_direction_error',
    domain: 'trigonometry',
    topicIds: ['6.6'],
    label: { en: 'Bearing Direction Error', zh: '方位角方向错误' },
    description: {
      en: 'Measured bearing from wrong direction (not north), or confused clockwise/anticlockwise convention.',
      zh: '没有从正北方向量起，或顺时针/逆时针方向搞反了。',
    },
    icon: 'N→°',
    severityWeight: 1.1,
    legacyType: 'method',
    recoveryHint: {
      en: 'Bearings are ALWAYS measured clockwise from North. Write as 3-digit numbers (e.g., 045° not 45°).',
      zh: '方位角永远从正北方向顺时针量起。用3位数表示（如045°而不是45°）。',
    },
    recoveryPackId: 'RP-TRIG-004',
  },

  // ── Statistics ──
  mean_median_confusion: {
    id: 'mean_median_confusion',
    domain: 'statistics',
    topicIds: ['9.3'],
    label: { en: 'Mean/Median Confusion', zh: '均值/中位数混淆' },
    description: {
      en: 'Calculated mean when asked for median, or vice versa.',
      zh: '题目问中位数却算了均值，或者反过来。',
    },
    icon: 'x̄↔M',
    severityWeight: 1.0,
    legacyType: 'method',
    recoveryHint: {
      en: 'Mean = sum ÷ count. Median = middle value when sorted.',
      zh: '均值 = 总和÷个数。中位数 = 排序后的中间值。',
    },
    recoveryPackId: 'RP-STAT-001',
  },

  // ── Generic fallbacks ──
  generic_algebra: {
    id: 'generic_algebra',
    domain: 'algebra',
    topicIds: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7'],
    label: { en: 'Algebra Error', zh: '代数错误' },
    description: { en: 'An error in algebraic manipulation.', zh: '代数运算出错。' },
    icon: 'x?',
    severityWeight: 0.8,
    legacyType: 'method',
    recoveryHint: { en: 'Review the algebraic steps carefully.', zh: '仔细回顾代数步骤。' },
    recoveryPackId: 'RP-ALG-000',
  },

  generic_number: {
    id: 'generic_number',
    domain: 'number',
    topicIds: ['1.1', '1.3', '1.4', '1.6'],
    label: { en: 'Arithmetic Error', zh: '算术错误' },
    description: { en: 'A calculation or arithmetic error.', zh: '计算错误。' },
    icon: '#?',
    severityWeight: 0.7,
    legacyType: 'method',
    recoveryHint: { en: 'Double-check your arithmetic step by step.', zh: '逐步检查你的计算。' },
    recoveryPackId: 'RP-NUM-000',
  },

  generic_geometry: {
    id: 'generic_geometry',
    domain: 'geometry',
    topicIds: ['4.1', '4.6', '5.2'],
    label: { en: 'Geometry Error', zh: '几何错误' },
    description: { en: 'An error in geometric reasoning.', zh: '几何推理出错。' },
    icon: '△?',
    severityWeight: 0.8,
    legacyType: 'method',
    recoveryHint: { en: 'Review the geometric properties and formulas.', zh: '回顾几何性质和公式。' },
    recoveryPackId: 'RP-GEO-000',
  },
};

// ═══════════════════════════════════════════════════════════════
// Question-Level Error Detection Rules
// ═══════════════════════════════════════════════════════════════

export type DetectionRule = {
  patternId: string;
  matchType: 'exact' | 'regex' | 'numeric_relation';
  /** For exact: the wrong answer string. For numeric_relation: the relation to check. */
  value?: string;
  /** For numeric_relation: 'negate' | 'double' | 'half' | 'off_by_one' */
  relation?: string;
};

export type QuestionErrorConfig = {
  questionType: string;          // matches mission.type
  topicId: string;
  rules: DetectionRule[];
  fallbackPatternId: string;     // if no rule matches
};

/**
 * Enhanced error detection: tries question-specific rules first,
 * then falls back to the legacy diagnoseError numeric comparison.
 */
export function detectErrorPattern(
  userAnswer: string,
  expectedAnswer: string,
  topicId?: string,
): { patternId: string; confidence: number } {
  const userNorm = normalizeAnswer(userAnswer);
  const expNorm = normalizeAnswer(expectedAnswer);

  if (userNorm === expNorm) {
    return { patternId: '', confidence: 1.0 }; // correct
  }

  // Rule-based detection: numeric relationships
  const userNum = parseFloat(userNorm);
  const expNum = parseFloat(expNorm);

  if (!isNaN(userNum) && !isNaN(expNum) && expNum !== 0) {
    // Sign error: |user| == |expected| but opposite sign
    if (Math.abs(userNum + expNum) < 0.01 && Math.abs(expNum) > 0.01) {
      return { patternId: 'sign_distribution', confidence: 0.9 };
    }

    // Off by factor of 10 (magnitude/decimal point error)
    const ratio = userNum / expNum;
    if (Math.abs(ratio - 10) < 0.01 || Math.abs(ratio - 0.1) < 0.01) {
      return { patternId: 'generic_number', confidence: 0.7 };
    }

    // Very close (rounding)
    const diff = Math.abs(userNum - expNum);
    if (diff > 0 && diff < 1) {
      return { patternId: 'generic_number', confidence: 0.6 };
    }
  }

  // Fallback by topic/domain — use most specific pattern available
  if (topicId) {
    const ch = topicId.split('.')[0];
    const sub = parseFloat(topicId.split('.')[1] ?? '0');

    if (ch === '1') return { patternId: 'generic_number', confidence: 0.4 };
    if (ch === '2') return { patternId: 'generic_algebra', confidence: 0.4 };

    if (ch === '4') {
      // ch4 sub-topics: 4.6=angles, 4.7=parallel, 4.8=pythagoras, 4.9=circle theorems
      if (sub >= 9) return { patternId: 'circle_theorem_error', confidence: 0.45 };
      if (sub >= 8) return { patternId: 'pythagoras_hypotenuse', confidence: 0.45 };
      if (sub >= 7) return { patternId: 'parallel_line_angle', confidence: 0.45 };
      if (sub >= 6) return { patternId: 'angle_sum_rule', confidence: 0.45 };
      return { patternId: 'generic_geometry', confidence: 0.4 };
    }

    if (ch === '5') {
      // ch5 sub-topics: 5.2=area, 5.3=perimeter, 5.4=arc, 5.5=sector
      if (sub >= 4) return { patternId: 'arc_sector_confusion', confidence: 0.5 };
      if (sub >= 2) return { patternId: 'area_formula_wrong', confidence: 0.45 };
      return { patternId: 'generic_geometry', confidence: 0.4 };
    }

    if (ch === '6') {
      // ch6 sub-topics: 6.2=SOH CAH TOA, 6.3=inverse, 6.4=sine rule, 6.5=cosine rule, 6.6=bearings
      if (sub >= 6) return { patternId: 'bearing_direction_error', confidence: 0.5 };
      if (sub >= 4) return { patternId: 'sine_cosine_rule_choice', confidence: 0.5 };
      if (sub >= 3) return { patternId: 'trig_inverse_confusion', confidence: 0.5 };
      if (sub >= 2) return { patternId: 'trig_ratio_swap', confidence: 0.5 };
      return { patternId: 'trig_ratio_swap', confidence: 0.4 };
    }
  }

  return { patternId: 'generic_number', confidence: 0.3 };
}

/** Normalize answer string for comparison */
function normalizeAnswer(s: string): string {
  return s
    .replace(/\s+/g, '')
    .replace(/\u2212/g, '-') // unicode minus → ascii
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .toLowerCase()
    .trim();
}

/** Get pattern info by ID */
export function getPattern(patternId: string): ErrorPattern | null {
  return ERROR_PATTERNS[patternId] ?? null;
}

/** Get all patterns affecting a specific topic */
export function getPatternsForTopic(topicId: string): ErrorPattern[] {
  return Object.values(ERROR_PATTERNS).filter(p => p.topicIds.includes(topicId));
}
