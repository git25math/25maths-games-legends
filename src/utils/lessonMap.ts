/**
 * KP → ExamHub Guided Lesson mapping
 * Mirrors ExamHub's _glLessonMap() in guided-lesson.js
 * Used to link Play failures to ExamHub guided lessons for remediation.
 */

const KP_LESSON_MAP: Record<string, string> = {
  'kp-1.7-01': 'stdform', 'kp-1.9-01': 'stdform',
  'kp-1.10-01': 'rounding-estimation', 'kp-1.11-01': 'limits-of-accuracy',
  'kp-1.12-01': 'ratio-and-sharing', 'kp-1.13-01': 'percentage-change',
  'kp-1.15-01': 'travel-avg-speed',
  'kp-1.16-01': 'simple-compound-interest', 'kp-1.17-01': 'exponential-growth-decay',
  'kp-1.18-01': 'surds-rationalising',
  'kp-2.1-01': 'algebraic-substitution', 'kp-2.2-01': 'rearranging-formulae',
  'kp-2.2-02': 'negative-expansion', 'kp-2.2-03': 'negative-expansion',
  'kp-2.3-01': 'expansion-factorisation', 'kp-2.3-02': 'advanced-factorisation',
  'kp-2.4-01': 'algebraic-fractions',
  'kp-2.5-01': 'linear-equations', 'kp-2.5-02': 'quadratic-equations',
  'kp-2.6-01': 'inequalities',
  'kp-2.7-01': 'sequences-nth-term', 'kp-2.8-01': 'direct-inverse-proportion',
  'kp-2.9-01': 'kinematics-graphs',
  'kp-2.10-01': 'graphs-of-functions', 'kp-2.11-01': 'sketching-curves',
  'kp-2.12-01': 'differentiation', 'kp-2.13-01': 'function-notation',
  'kp-3.1-01': 'cartesian-coordinates', 'kp-3.2-01': 'drawing-linear-graphs',
  'kp-3.3-01': 'gradient-linear-graphs',
  'kp-3.4-01': 'line-segment-length', 'kp-3.4-02': 'midpoint-line-segment',
  'kp-3.5-01': 'straight-line-equation',
  'kp-3.6-01': 'parallel-lines-coord', 'kp-3.7-01': 'perpendicular-lines-coord',
  'kp-4.1-01': 'geometrical-terms', 'kp-4.2-01': 'geometrical-constructions',
  'kp-4.3-01': 'scale-drawings', 'kp-4.3-02': 'bearings',
  'kp-4.4-01': 'similarity-congruence', 'kp-4.4-02': 'similar-area-volume',
  'kp-4.5-01': 'symmetry',
  'kp-4.6-01': 'angles-parallel-lines', 'kp-4.6-02': 'angles-polygons',
  'kp-4.7-01': 'circle-theorems', 'kp-4.7-02': 'tangent-alternate-segment',
  'kp-4.8-01': 'loci',
  'kp-5.1-01': 'units-conversions', 'kp-5.2-01': 'perimeter-area',
  'kp-5.3-01': 'circles-circumference-area', 'kp-5.3-02': 'arcs-sectors',
  'kp-5.4-01': 'prisms-cylinders', 'kp-5.4-02': 'pyramids-cones-spheres',
  'kp-5.5-01': 'compound-shapes',
  'kp-6.1-01': 'pythagoras', 'kp-6.2-01': 'trig-sohcahtoa',
  'kp-6.3-01': 'exact-trig-values', 'kp-6.4-01': 'trig-graphs-equations',
  'kp-6.5-01': 'sine-rule', 'kp-6.5-02': 'cosine-rule',
  'kp-6.5-03': 'area-triangle-trig', 'kp-6.6-01': '3d-trigonometry',
  'kp-7.1-01': 'transformations', 'kp-7.1-02': 'enlargement',
  'kp-7.2-01': 'vectors-2d', 'kp-7.3-01': 'vector-magnitude', 'kp-7.4-01': 'vector-geometry',
  'kp-8.1-01': 'basic-probability', 'kp-8.1-02': 'complementary-events',
  'kp-8.2-01': 'relative-expected-frequency',
  'kp-8.3-01': 'combined-events', 'kp-8.3-02': 'mutually-exclusive-independent',
  'kp-8.4-01': 'conditional-probability',
  'kp-9.1-01': 'types-of-data', 'kp-9.1-02': 'frequency-tables',
  'kp-9.3-01': 'mean-median-mode', 'kp-9.3-02': 'averages-frequency-tables',
  'kp-9.4-01': 'pie-bar-charts', 'kp-9.4-02': 'stem-leaf-diagrams',
  'kp-9.5-01': 'scatter-diagrams', 'kp-9.5-02': 'line-of-best-fit',
  'kp-9.6-01': 'cumulative-frequency', 'kp-9.6-02': 'quartiles-iqr',
  'kp-9.7-01': 'histograms',
};

/** Get ExamHub lesson ID for a given KP ID. Returns null if no lesson exists. */
export function getLessonId(kpId: string): string | null {
  return KP_LESSON_MAP[kpId] ?? null;
}

/** Build ExamHub deep link URL for a guided lesson */
export function getExamHubLessonUrl(kpId: string): string | null {
  const lessonId = getLessonId(kpId);
  if (!lessonId) return null;
  return `https://examhub.25maths.com/?lesson=${encodeURIComponent(lessonId)}`;
}
