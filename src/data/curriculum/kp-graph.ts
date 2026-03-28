/**
 * KP-level knowledge graph — fine-grained prerequisite & forward links.
 *
 * Data sources:
 *   - math-video-engine YAML prerequisite fields (73 hard edges)
 *   - Same-topic sequential ordering (soft edges)
 *   - Cross-topic mathematical dependencies from techTree.ts (soft edges)
 *
 * Total: 362 edges, 0 cycles (verified DAG).
 */

export type KPEdgeStrength = 'hard' | 'soft';

export type KPEdge = {
  from: string;
  to: string;
  strength: KPEdgeStrength;
  reason: { zh: string; en: string };
};

// ═══════════════════════════════════════════════════════════
// KP-Level Prerequisite Edges (362 total)
// ═══════════════════════════════════════════════════════════

export const KP_EDGES: KPEdge[] = [
  { from: 'kp-1.1-02', to: 'kp-1.1-07', strength: 'hard', reason: { zh: 'Prime Numbers是HCF & LCM的前置', en: 'Prime Numbers is prerequisite for HCF & LCM' } },
  { from: 'kp-1.15-02', to: 'kp-1.15-03', strength: 'hard', reason: { zh: '12-hour & 24-hour Clock是Timetables & Time Zones的前置', en: '12-hour & 24-hour Clock is prerequisite for Timetables & Time Zones' } },
  { from: 'kp-1.15-01', to: 'kp-1.15-03', strength: 'hard', reason: { zh: 'Time Calculations是Timetables & Time Zones的前置', en: 'Time Calculations is prerequisite for Timetables & Time Zones' } },
  { from: 'kp-1.16-01', to: 'kp-1.16-02', strength: 'hard', reason: { zh: 'Simple Interest是Compound Interest & Depreciation的前置', en: 'Simple Interest is prerequisite for Compound Interest & Depreciation' } },
  { from: 'kp-1.3-02', to: 'kp-1.18-01', strength: 'hard', reason: { zh: 'Index Notation是Simplifying Surds and Rationalising的前置', en: 'Index Notation is prerequisite for Simplifying Surds and Rationalising' } },
  { from: 'kp-2.1-01', to: 'kp-2.1-02', strength: 'hard', reason: { zh: 'Algebra Basics是Writing & Interpreting Algebraic Expressions的前置', en: 'Algebra Basics is prerequisite for Writing & Interpreting Algebraic Expressions' } },
  { from: 'kp-2.1-01', to: 'kp-2.1-03', strength: 'hard', reason: { zh: 'Algebra Basics是Substitution into Expressions的前置', en: 'Algebra Basics is prerequisite for Substitution into Expressions' } },
  { from: 'kp-2.10-01', to: 'kp-2.11-01', strength: 'hard', reason: { zh: 'Sketching Functions (linear, quadratic)是Sketching Functions (cubic, reciprocal, exponential)的前置', en: 'Sketching Functions (linear, quadratic) is prerequisite for Sketching Functions (cubic, reciprocal, exponential)' } },
  { from: 'kp-2.10-01', to: 'kp-2.11-02', strength: 'hard', reason: { zh: 'Sketching Functions (linear, quadratic)是Transformations of Functions的前置', en: 'Sketching Functions (linear, quadratic) is prerequisite for Transformations of Functions' } },
  { from: 'kp-2.11-01', to: 'kp-2.11-02', strength: 'hard', reason: { zh: 'Sketching Functions (cubic, reciprocal, exponential)是Transformations of Functions的前置', en: 'Sketching Functions (cubic, reciprocal, exponential) is prerequisite for Transformations of Functions' } },
  { from: 'kp-2.1-01', to: 'kp-2.2-01', strength: 'hard', reason: { zh: 'Algebra Basics是Collecting Like Terms的前置', en: 'Algebra Basics is prerequisite for Collecting Like Terms' } },
  { from: 'kp-2.1-01', to: 'kp-2.2-02', strength: 'hard', reason: { zh: 'Algebra Basics是Expanding Single Brackets的前置', en: 'Algebra Basics is prerequisite for Expanding Single Brackets' } },
  { from: 'kp-2.2-02', to: 'kp-2.2-03', strength: 'hard', reason: { zh: 'Expanding Single Brackets是Expanding Double Brackets的前置', en: 'Expanding Single Brackets is prerequisite for Expanding Double Brackets' } },
  { from: 'kp-2.2-03', to: 'kp-2.2-04', strength: 'hard', reason: { zh: 'Expanding Double Brackets是Expanding Triple Brackets的前置', en: 'Expanding Double Brackets is prerequisite for Expanding Triple Brackets' } },
  { from: 'kp-2.2-02', to: 'kp-2.2-05', strength: 'hard', reason: { zh: 'Expanding Single Brackets是Factorising — Common Factor的前置', en: 'Expanding Single Brackets is prerequisite for Factorising — Common Factor' } },
  { from: 'kp-2.2-03', to: 'kp-2.2-06', strength: 'hard', reason: { zh: 'Expanding Double Brackets是Factorising — Difference of Two Squares的前置', en: 'Expanding Double Brackets is prerequisite for Factorising — Difference of Two Squares' } },
  { from: 'kp-2.2-03', to: 'kp-2.2-07', strength: 'hard', reason: { zh: 'Expanding Double Brackets是Factorising — Quadratic (a=1)的前置', en: 'Expanding Double Brackets is prerequisite for Factorising — Quadratic (a=1)' } },
  { from: 'kp-2.2-07', to: 'kp-2.2-08', strength: 'hard', reason: { zh: 'Factorising — Quadratic (a=1)是Factorising — Quadratic (a!=1)的前置', en: 'Factorising — Quadratic (a=1) is prerequisite for Factorising — Quadratic (a!=1)' } },
  { from: 'kp-2.2-03', to: 'kp-2.2-08', strength: 'hard', reason: { zh: 'Expanding Double Brackets是Factorising — Quadratic (a!=1)的前置', en: 'Expanding Double Brackets is prerequisite for Factorising — Quadratic (a!=1)' } },
  { from: 'kp-2.2-05', to: 'kp-2.2-09', strength: 'hard', reason: { zh: 'Factorising — Common Factor是Algebraic Fractions — Simplifying的前置', en: 'Factorising — Common Factor is prerequisite for Algebraic Fractions — Simplifying' } },
  { from: 'kp-2.2-07', to: 'kp-2.2-09', strength: 'hard', reason: { zh: 'Factorising — Quadratic (a=1)是Algebraic Fractions — Simplifying的前置', en: 'Factorising — Quadratic (a=1) is prerequisite for Algebraic Fractions — Simplifying' } },
  { from: 'kp-2.2-06', to: 'kp-2.2-09', strength: 'hard', reason: { zh: 'Factorising — Difference of Two Squares是Algebraic Fractions — Simplifying的前置', en: 'Factorising — Difference of Two Squares is prerequisite for Algebraic Fractions — Simplifying' } },
  { from: 'kp-2.2-09', to: 'kp-2.2-10', strength: 'hard', reason: { zh: 'Algebraic Fractions — Simplifying是Algebraic Fractions — Adding & Subtracting的前置', en: 'Algebraic Fractions — Simplifying is prerequisite for Algebraic Fractions — Adding & Subtracting' } },
  { from: 'kp-2.2-02', to: 'kp-2.2-10', strength: 'hard', reason: { zh: 'Expanding Single Brackets是Algebraic Fractions — Adding & Subtracting的前置', en: 'Expanding Single Brackets is prerequisite for Algebraic Fractions — Adding & Subtracting' } },
  { from: 'kp-2.2-09', to: 'kp-2.2-11', strength: 'hard', reason: { zh: 'Algebraic Fractions — Simplifying是Algebraic Fractions — Multiplying & Dividing的前置', en: 'Algebraic Fractions — Simplifying is prerequisite for Algebraic Fractions — Multiplying & Dividing' } },
  { from: 'kp-2.2-05', to: 'kp-2.2-11', strength: 'hard', reason: { zh: 'Factorising — Common Factor是Algebraic Fractions — Multiplying & Dividing的前置', en: 'Factorising — Common Factor is prerequisite for Algebraic Fractions — Multiplying & Dividing' } },
  { from: 'kp-2.2-07', to: 'kp-2.2-11', strength: 'hard', reason: { zh: 'Factorising — Quadratic (a=1)是Algebraic Fractions — Multiplying & Dividing的前置', en: 'Factorising — Quadratic (a=1) is prerequisite for Algebraic Fractions — Multiplying & Dividing' } },
  { from: 'kp-2.2-03', to: 'kp-2.2-13', strength: 'hard', reason: { zh: 'Expanding Double Brackets是Completing the Square的前置', en: 'Expanding Double Brackets is prerequisite for Completing the Square' } },
  { from: 'kp-2.2-05', to: 'kp-2.3-01', strength: 'hard', reason: { zh: 'Factorising — Common Factor是Simplifying Algebraic Fractions (Factorising First)的前置', en: 'Factorising — Common Factor is prerequisite for Simplifying Algebraic Fractions (Factorising First)' } },
  { from: 'kp-2.2-06', to: 'kp-2.3-01', strength: 'hard', reason: { zh: 'Factorising — Difference of Two Squares是Simplifying Algebraic Fractions (Factorising First)的前置', en: 'Factorising — Difference of Two Squares is prerequisite for Simplifying Algebraic Fractions (Factorising First)' } },
  { from: 'kp-2.2-07', to: 'kp-2.3-01', strength: 'hard', reason: { zh: 'Factorising — Quadratic (a=1)是Simplifying Algebraic Fractions (Factorising First)的前置', en: 'Factorising — Quadratic (a=1) is prerequisite for Simplifying Algebraic Fractions (Factorising First)' } },
  { from: 'kp-2.2-09', to: 'kp-2.3-02', strength: 'hard', reason: { zh: 'Algebraic Fractions — Simplifying是Adding & Subtracting Algebraic Fractions (Common Denominator)的前置', en: 'Algebraic Fractions — Simplifying is prerequisite for Adding & Subtracting Algebraic Fractions (Common Denominator)' } },
  { from: 'kp-2.2-09', to: 'kp-2.3-03', strength: 'hard', reason: { zh: 'Algebraic Fractions — Simplifying是Multiplying & Dividing Algebraic Fractions (Factorise & Cancel)的前置', en: 'Algebraic Fractions — Simplifying is prerequisite for Multiplying & Dividing Algebraic Fractions (Factorise & Cancel)' } },
  { from: 'kp-1.7-01', to: 'kp-2.4-01', strength: 'hard', reason: { zh: 'Laws of Indices是Index Laws — Basic Rules for Algebra的前置', en: 'Laws of Indices is prerequisite for Index Laws — Basic Rules for Algebra' } },
  { from: 'kp-2.4-01', to: 'kp-2.4-02', strength: 'hard', reason: { zh: 'Index Laws — Basic Rules for Algebra是Fractional & Negative Indices with Algebra的前置', en: 'Index Laws — Basic Rules for Algebra is prerequisite for Fractional & Negative Indices with Algebra' } },
  { from: 'kp-1.3-03', to: 'kp-2.4-02', strength: 'hard', reason: { zh: 'Index Laws & Fractional/Negative Indices是Fractional & Negative Indices with Algebra的前置', en: 'Index Laws & Fractional/Negative Indices is prerequisite for Fractional & Negative Indices with Algebra' } },
  { from: 'kp-2.4-01', to: 'kp-2.4-03', strength: 'hard', reason: { zh: 'Index Laws — Basic Rules for Algebra是Simplifying Mixed Index Expressions的前置', en: 'Index Laws — Basic Rules for Algebra is prerequisite for Simplifying Mixed Index Expressions' } },
  { from: 'kp-2.4-02', to: 'kp-2.4-03', strength: 'hard', reason: { zh: 'Fractional & Negative Indices with Algebra是Simplifying Mixed Index Expressions的前置', en: 'Fractional & Negative Indices with Algebra is prerequisite for Simplifying Mixed Index Expressions' } },
  { from: 'kp-2.2-02', to: 'kp-2.5-03', strength: 'hard', reason: { zh: 'Expanding Single Brackets是Equations with Brackets的前置', en: 'Expanding Single Brackets is prerequisite for Equations with Brackets' } },
  { from: 'kp-2.5-01', to: 'kp-2.5-03', strength: 'hard', reason: { zh: 'Solving Linear Equations是Equations with Brackets的前置', en: 'Solving Linear Equations is prerequisite for Equations with Brackets' } },
  { from: 'kp-2.5-01', to: 'kp-2.5-04', strength: 'hard', reason: { zh: 'Solving Linear Equations是Equations with Fractions的前置', en: 'Solving Linear Equations is prerequisite for Equations with Fractions' } },
  { from: 'kp-2.5-01', to: 'kp-2.5-05', strength: 'hard', reason: { zh: 'Solving Linear Equations是Equations with Unknown on Both Sides的前置', en: 'Solving Linear Equations is prerequisite for Equations with Unknown on Both Sides' } },
  { from: 'kp-2.5-02', to: 'kp-2.5-05', strength: 'hard', reason: { zh: 'Simultaneous Equations — Elimination是Equations with Unknown on Both Sides的前置', en: 'Simultaneous Equations — Elimination is prerequisite for Equations with Unknown on Both Sides' } },
  { from: 'kp-2.2-02', to: 'kp-2.5-05', strength: 'hard', reason: { zh: 'Expanding Single Brackets是Equations with Unknown on Both Sides的前置', en: 'Expanding Single Brackets is prerequisite for Equations with Unknown on Both Sides' } },
  { from: 'kp-2.5-02', to: 'kp-2.5-06', strength: 'hard', reason: { zh: 'Simultaneous Equations — Elimination是Simultaneous Equations — Elimination (Matching Coefficients)的前置', en: 'Simultaneous Equations — Elimination is prerequisite for Simultaneous Equations — Elimination (Matching Coefficients)' } },
  { from: 'kp-2.5-01', to: 'kp-2.5-07', strength: 'hard', reason: { zh: 'Solving Linear Equations是Simultaneous Equations — Substitution的前置', en: 'Solving Linear Equations is prerequisite for Simultaneous Equations — Substitution' } },
  { from: 'kp-2.1-03', to: 'kp-2.5-07', strength: 'hard', reason: { zh: 'Substitution into Expressions是Simultaneous Equations — Substitution的前置', en: 'Substitution into Expressions is prerequisite for Simultaneous Equations — Substitution' } },
  { from: 'kp-2.5-07', to: 'kp-2.5-08', strength: 'hard', reason: { zh: 'Simultaneous Equations — Substitution是Simultaneous Equations — One Linear One Non-linear的前置', en: 'Simultaneous Equations — Substitution is prerequisite for Simultaneous Equations — One Linear One Non-linear' } },
  { from: 'kp-2.2-07', to: 'kp-2.5-09', strength: 'hard', reason: { zh: 'Factorising — Quadratic (a=1)是Quadratic Equations — Factorising的前置', en: 'Factorising — Quadratic (a=1) is prerequisite for Quadratic Equations — Factorising' } },
  { from: 'kp-2.2-03', to: 'kp-2.5-09', strength: 'hard', reason: { zh: 'Expanding Double Brackets是Quadratic Equations — Factorising的前置', en: 'Expanding Double Brackets is prerequisite for Quadratic Equations — Factorising' } },
  { from: 'kp-2.2-08', to: 'kp-2.5-11', strength: 'hard', reason: { zh: 'Factorising — Quadratic (a!=1)是Quadratic Equations — Completing the Square的前置', en: 'Factorising — Quadratic (a!=1) is prerequisite for Quadratic Equations — Completing the Square' } },
  { from: 'kp-2.1-02', to: 'kp-2.5-12', strength: 'hard', reason: { zh: 'Writing & Interpreting Algebraic Expressions是Setting Up Equations from Context的前置', en: 'Writing & Interpreting Algebraic Expressions is prerequisite for Setting Up Equations from Context' } },
  { from: 'kp-2.1-03', to: 'kp-2.5-13', strength: 'hard', reason: { zh: 'Substitution into Expressions是Iteration & Trial and Improvement的前置', en: 'Substitution into Expressions is prerequisite for Iteration & Trial and Improvement' } },
  { from: 'kp-2.4-03', to: 'kp-2.5-13', strength: 'hard', reason: { zh: 'Simplifying Mixed Index Expressions是Iteration & Trial and Improvement的前置', en: 'Simplifying Mixed Index Expressions is prerequisite for Iteration & Trial and Improvement' } },
  { from: 'kp-2.3-01', to: 'kp-2.6-01', strength: 'hard', reason: { zh: 'Simplifying Algebraic Fractions (Factorising First)是Double Inequalities的前置', en: 'Simplifying Algebraic Fractions (Factorising First) is prerequisite for Double Inequalities' } },
  { from: 'kp-2.3-02', to: 'kp-2.6-01', strength: 'hard', reason: { zh: 'Adding & Subtracting Algebraic Fractions (Common Denominator)是Double Inequalities的前置', en: 'Adding & Subtracting Algebraic Fractions (Common Denominator) is prerequisite for Double Inequalities' } },
  { from: 'kp-2.3-01', to: 'kp-2.6-02', strength: 'hard', reason: { zh: 'Simplifying Algebraic Fractions (Factorising First)是Graphical Inequalities的前置', en: 'Simplifying Algebraic Fractions (Factorising First) is prerequisite for Graphical Inequalities' } },
  { from: 'kp-2.5-09', to: 'kp-2.6-03', strength: 'hard', reason: { zh: 'Quadratic Equations — Factorising是Quadratic Inequalities的前置', en: 'Quadratic Equations — Factorising is prerequisite for Quadratic Inequalities' } },
  { from: 'kp-2.8-01', to: 'kp-2.8-05', strength: 'hard', reason: { zh: 'Inverse Proportion (y = k/x)是Inverse Variation的前置', en: 'Inverse Proportion (y = k/x) is prerequisite for Inverse Variation' } },
  { from: 'kp-2.8-05', to: 'kp-2.8-06', strength: 'hard', reason: { zh: 'Inverse Variation是Joint Variation的前置', en: 'Inverse Variation is prerequisite for Joint Variation' } },
  { from: 'kp-2.8-07', to: 'kp-2.8-08', strength: 'hard', reason: { zh: 'Partial Variation是Variation Graphs & Identifying Type的前置', en: 'Partial Variation is prerequisite for Variation Graphs & Identifying Type' } },
  { from: 'kp-2.9-01', to: 'kp-2.9-02', strength: 'hard', reason: { zh: 'Distance-Time Graphs是Speed-Time Graphs的前置', en: 'Distance-Time Graphs is prerequisite for Speed-Time Graphs' } },
  { from: 'kp-2.9-02', to: 'kp-2.9-04', strength: 'hard', reason: { zh: 'Speed-Time Graphs是Area Under a Curve的前置', en: 'Speed-Time Graphs is prerequisite for Area Under a Curve' } },
  { from: 'kp-3.5-01', to: 'kp-3.5-02', strength: 'hard', reason: { zh: 'y = mx + c — Gradient & y-intercept是Finding Equation of a Line (gradient + point)的前置', en: 'y = mx + c — Gradient & y-intercept is prerequisite for Finding Equation of a Line (gradient + point)' } },
  { from: 'kp-3.3-02', to: 'kp-3.5-03', strength: 'hard', reason: { zh: 'Gradient from Coordinates是Finding Equation of a Line (two points)的前置', en: 'Gradient from Coordinates is prerequisite for Finding Equation of a Line (two points)' } },
  { from: 'kp-3.5-02', to: 'kp-3.5-03', strength: 'hard', reason: { zh: 'Finding Equation of a Line (gradient + point)是Finding Equation of a Line (two points)的前置', en: 'Finding Equation of a Line (gradient + point) is prerequisite for Finding Equation of a Line (two points)' } },
  { from: 'kp-5.1-02', to: 'kp-5.1-03', strength: 'hard', reason: { zh: 'Metric Unit Conversions (Length, Mass, Capacity)是Converting Units of Area & Volume的前置', en: 'Metric Unit Conversions (Length, Mass, Capacity) is prerequisite for Converting Units of Area & Volume' } },
  { from: 'kp-6.4-01', to: 'kp-6.4-02', strength: 'hard', reason: { zh: 'Trigonometric Graphs and Equations是Solving Trig Equations (0-360)的前置', en: 'Trigonometric Graphs and Equations is prerequisite for Solving Trig Equations (0-360)' } },
  { from: 'kp-6.1-01', to: 'kp-6.5-02', strength: 'hard', reason: { zh: 'Pythagoras\' Theorem是Cosine Rule — Finding a Side的前置', en: 'Pythagoras\' Theorem is prerequisite for Cosine Rule — Finding a Side' } },
  { from: 'kp-6.1-01', to: 'kp-6.6-01', strength: 'hard', reason: { zh: 'Pythagoras\' Theorem是Pythagoras & Trig in 3D的前置', en: 'Pythagoras\' Theorem is prerequisite for Pythagoras & Trig in 3D' } },
  { from: 'kp-6.2-03', to: 'kp-6.6-01', strength: 'hard', reason: { zh: 'Trigonometric Ratios (SOH CAH TOA)是Pythagoras & Trig in 3D的前置', en: 'Trigonometric Ratios (SOH CAH TOA) is prerequisite for Pythagoras & Trig in 3D' } },
  { from: 'kp-9.2-02', to: 'kp-9.2-03', strength: 'hard', reason: { zh: 'Reading Tables & Bar Charts是Pie Charts & Drawing Inferences的前置', en: 'Reading Tables & Bar Charts is prerequisite for Pie Charts & Drawing Inferences' } },
  { from: 'kp-1.1-01', to: 'kp-1.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-02', to: 'kp-1.1-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-03', to: 'kp-1.1-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-04', to: 'kp-1.1-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-05', to: 'kp-1.1-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-06', to: 'kp-1.1-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-07', to: 'kp-1.1-08', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.1-08', to: 'kp-1.1-09', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.1' } },
  { from: 'kp-1.2-01', to: 'kp-1.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.2' } },
  { from: 'kp-1.2-02', to: 'kp-1.2-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.2' } },
  { from: 'kp-1.2-03', to: 'kp-1.2-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.2' } },
  { from: 'kp-1.2-04', to: 'kp-1.2-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.2' } },
  { from: 'kp-1.3-01', to: 'kp-1.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.3' } },
  { from: 'kp-1.3-02', to: 'kp-1.3-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.3' } },
  { from: 'kp-1.4-01', to: 'kp-1.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.4' } },
  { from: 'kp-1.4-02', to: 'kp-1.4-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.4' } },
  { from: 'kp-1.4-03', to: 'kp-1.4-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.4' } },
  { from: 'kp-1.5-01', to: 'kp-1.5-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.5' } },
  { from: 'kp-1.5-02', to: 'kp-1.5-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.5' } },
  { from: 'kp-1.6-01', to: 'kp-1.6-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.6' } },
  { from: 'kp-1.6-02', to: 'kp-1.6-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.6' } },
  { from: 'kp-1.6-03', to: 'kp-1.6-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.6' } },
  { from: 'kp-1.7-01', to: 'kp-1.7-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.7' } },
  { from: 'kp-1.8-01', to: 'kp-1.8-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.8' } },
  { from: 'kp-1.9-01', to: 'kp-1.9-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.9' } },
  { from: 'kp-1.9-02', to: 'kp-1.9-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.9' } },
  { from: 'kp-1.9-03', to: 'kp-1.9-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.9' } },
  { from: 'kp-1.9-04', to: 'kp-1.9-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.9' } },
  { from: 'kp-1.9-05', to: 'kp-1.9-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.9' } },
  { from: 'kp-1.9-06', to: 'kp-1.9-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.9' } },
  { from: 'kp-1.10-01', to: 'kp-1.10-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.10' } },
  { from: 'kp-1.10-02', to: 'kp-1.10-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.10' } },
  { from: 'kp-1.10-03', to: 'kp-1.10-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.10' } },
  { from: 'kp-1.10-04', to: 'kp-1.10-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.10' } },
  { from: 'kp-1.11-01', to: 'kp-1.11-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.11' } },
  { from: 'kp-1.11-02', to: 'kp-1.11-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.11' } },
  { from: 'kp-1.11-03', to: 'kp-1.11-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.11' } },
  { from: 'kp-1.11-04', to: 'kp-1.11-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.11' } },
  { from: 'kp-1.12-01', to: 'kp-1.12-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.12' } },
  { from: 'kp-1.12-02', to: 'kp-1.12-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.12' } },
  { from: 'kp-1.13-01', to: 'kp-1.13-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.13' } },
  { from: 'kp-1.13-02', to: 'kp-1.13-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.13' } },
  { from: 'kp-1.13-03', to: 'kp-1.13-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.13' } },
  { from: 'kp-1.15-01', to: 'kp-1.15-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.15' } },
  { from: 'kp-1.16-02', to: 'kp-1.16-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 1.16' } },
  { from: 'kp-2.1-02', to: 'kp-2.1-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.1' } },
  { from: 'kp-2.2-01', to: 'kp-2.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-04', to: 'kp-2.2-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-05', to: 'kp-2.2-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-06', to: 'kp-2.2-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-08', to: 'kp-2.2-09', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-10', to: 'kp-2.2-11', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-11', to: 'kp-2.2-12', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.2-12', to: 'kp-2.2-13', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.2' } },
  { from: 'kp-2.3-01', to: 'kp-2.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.3' } },
  { from: 'kp-2.3-02', to: 'kp-2.3-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.3' } },
  { from: 'kp-2.3-03', to: 'kp-2.3-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.3' } },
  { from: 'kp-2.5-01', to: 'kp-2.5-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-02', to: 'kp-2.5-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-03', to: 'kp-2.5-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-04', to: 'kp-2.5-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-05', to: 'kp-2.5-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-06', to: 'kp-2.5-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-08', to: 'kp-2.5-09', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-09', to: 'kp-2.5-10', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-10', to: 'kp-2.5-11', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-11', to: 'kp-2.5-12', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.5-12', to: 'kp-2.5-13', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.5' } },
  { from: 'kp-2.6-01', to: 'kp-2.6-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.6' } },
  { from: 'kp-2.6-02', to: 'kp-2.6-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.6' } },
  { from: 'kp-2.6-03', to: 'kp-2.6-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.6' } },
  { from: 'kp-2.7-01', to: 'kp-2.7-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.7' } },
  { from: 'kp-2.7-02', to: 'kp-2.7-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.7' } },
  { from: 'kp-2.7-03', to: 'kp-2.7-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.7' } },
  { from: 'kp-2.7-04', to: 'kp-2.7-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.7' } },
  { from: 'kp-2.8-01', to: 'kp-2.8-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.8' } },
  { from: 'kp-2.8-02', to: 'kp-2.8-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.8' } },
  { from: 'kp-2.8-03', to: 'kp-2.8-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.8' } },
  { from: 'kp-2.8-04', to: 'kp-2.8-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.8' } },
  { from: 'kp-2.8-06', to: 'kp-2.8-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.8' } },
  { from: 'kp-2.9-02', to: 'kp-2.9-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.9' } },
  { from: 'kp-2.9-03', to: 'kp-2.9-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.9' } },
  { from: 'kp-2.9-04', to: 'kp-2.9-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.9' } },
  { from: 'kp-2.10-01', to: 'kp-2.10-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.10' } },
  { from: 'kp-2.10-02', to: 'kp-2.10-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.10' } },
  { from: 'kp-2.10-03', to: 'kp-2.10-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.10' } },
  { from: 'kp-2.11-02', to: 'kp-2.11-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.11' } },
  { from: 'kp-2.12-01', to: 'kp-2.12-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.12' } },
  { from: 'kp-2.13-01', to: 'kp-2.13-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.13' } },
  { from: 'kp-2.13-02', to: 'kp-2.13-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.13' } },
  { from: 'kp-2.13-03', to: 'kp-2.13-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 2.13' } },
  { from: 'kp-3.1-01', to: 'kp-3.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.1' } },
  { from: 'kp-3.3-01', to: 'kp-3.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.3' } },
  { from: 'kp-3.4-01', to: 'kp-3.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.4' } },
  { from: 'kp-3.4-02', to: 'kp-3.4-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.4' } },
  { from: 'kp-3.4-03', to: 'kp-3.4-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.4' } },
  { from: 'kp-3.5-03', to: 'kp-3.5-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.5' } },
  { from: 'kp-3.6-01', to: 'kp-3.6-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 3.6' } },
  { from: 'kp-4.1-01', to: 'kp-4.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.1' } },
  { from: 'kp-4.1-02', to: 'kp-4.1-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.1' } },
  { from: 'kp-4.2-01', to: 'kp-4.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.2' } },
  { from: 'kp-4.2-02', to: 'kp-4.2-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.2' } },
  { from: 'kp-4.2-03', to: 'kp-4.2-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.2' } },
  { from: 'kp-4.3-01', to: 'kp-4.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.3' } },
  { from: 'kp-4.3-02', to: 'kp-4.3-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.3' } },
  { from: 'kp-4.4-01', to: 'kp-4.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.4' } },
  { from: 'kp-4.4-02', to: 'kp-4.4-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.4' } },
  { from: 'kp-4.4-03', to: 'kp-4.4-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.4' } },
  { from: 'kp-4.4-04', to: 'kp-4.4-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.4' } },
  { from: 'kp-4.4-05', to: 'kp-4.4-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.4' } },
  { from: 'kp-4.5-01', to: 'kp-4.5-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.5' } },
  { from: 'kp-4.6-01', to: 'kp-4.6-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-02', to: 'kp-4.6-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-03', to: 'kp-4.6-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-04', to: 'kp-4.6-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-05', to: 'kp-4.6-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-06', to: 'kp-4.6-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-07', to: 'kp-4.6-08', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-08', to: 'kp-4.6-09', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.6-09', to: 'kp-4.6-10', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.6' } },
  { from: 'kp-4.7-01', to: 'kp-4.7-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.7' } },
  { from: 'kp-4.7-02', to: 'kp-4.7-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.7' } },
  { from: 'kp-4.7-03', to: 'kp-4.7-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.7' } },
  { from: 'kp-4.7-04', to: 'kp-4.7-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.7' } },
  { from: 'kp-4.7-05', to: 'kp-4.7-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.7' } },
  { from: 'kp-4.8-01', to: 'kp-4.8-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.8' } },
  { from: 'kp-4.8-02', to: 'kp-4.8-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 4.8' } },
  { from: 'kp-5.1-01', to: 'kp-5.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.1' } },
  { from: 'kp-5.2-01', to: 'kp-5.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.2' } },
  { from: 'kp-5.2-02', to: 'kp-5.2-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.2' } },
  { from: 'kp-5.3-01', to: 'kp-5.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.3' } },
  { from: 'kp-5.3-02', to: 'kp-5.3-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.3' } },
  { from: 'kp-5.3-03', to: 'kp-5.3-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.3' } },
  { from: 'kp-5.3-04', to: 'kp-5.3-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.3' } },
  { from: 'kp-5.3-05', to: 'kp-5.3-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.3' } },
  { from: 'kp-5.4-01', to: 'kp-5.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.4' } },
  { from: 'kp-5.4-02', to: 'kp-5.4-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.4' } },
  { from: 'kp-5.4-03', to: 'kp-5.4-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.4' } },
  { from: 'kp-5.4-04', to: 'kp-5.4-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.4' } },
  { from: 'kp-5.4-05', to: 'kp-5.4-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.4' } },
  { from: 'kp-5.4-06', to: 'kp-5.4-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.4' } },
  { from: 'kp-5.5-01', to: 'kp-5.5-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.5' } },
  { from: 'kp-5.5-02', to: 'kp-5.5-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 5.5' } },
  { from: 'kp-6.1-01', to: 'kp-6.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.1' } },
  { from: 'kp-6.2-01', to: 'kp-6.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.2' } },
  { from: 'kp-6.2-02', to: 'kp-6.2-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.2' } },
  { from: 'kp-6.3-01', to: 'kp-6.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.3' } },
  { from: 'kp-6.4-02', to: 'kp-6.4-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.4' } },
  { from: 'kp-6.5-01', to: 'kp-6.5-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.5' } },
  { from: 'kp-6.5-02', to: 'kp-6.5-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.5' } },
  { from: 'kp-6.5-03', to: 'kp-6.5-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.5' } },
  { from: 'kp-6.5-04', to: 'kp-6.5-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.5' } },
  { from: 'kp-6.5-05', to: 'kp-6.5-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.5' } },
  { from: 'kp-6.5-06', to: 'kp-6.5-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.5' } },
  { from: 'kp-6.6-01', to: 'kp-6.6-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 6.6' } },
  { from: 'kp-7.1-01', to: 'kp-7.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-02', to: 'kp-7.1-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-03', to: 'kp-7.1-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-04', to: 'kp-7.1-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-05', to: 'kp-7.1-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-06', to: 'kp-7.1-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-07', to: 'kp-7.1-08', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-08', to: 'kp-7.1-09', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-09', to: 'kp-7.1-10', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-10', to: 'kp-7.1-11', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.1-11', to: 'kp-7.1-12', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.1' } },
  { from: 'kp-7.2-01', to: 'kp-7.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.2' } },
  { from: 'kp-7.2-02', to: 'kp-7.2-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.2' } },
  { from: 'kp-7.4-01', to: 'kp-7.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 7.4' } },
  { from: 'kp-8.1-01', to: 'kp-8.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.1' } },
  { from: 'kp-8.2-01', to: 'kp-8.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.2' } },
  { from: 'kp-8.3-01', to: 'kp-8.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.3-02', to: 'kp-8.3-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.3-03', to: 'kp-8.3-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.3-04', to: 'kp-8.3-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.3-05', to: 'kp-8.3-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.3-06', to: 'kp-8.3-07', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.3-07', to: 'kp-8.3-08', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.3' } },
  { from: 'kp-8.4-01', to: 'kp-8.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 8.4' } },
  { from: 'kp-9.1-01', to: 'kp-9.1-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.1' } },
  { from: 'kp-9.2-01', to: 'kp-9.2-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.2' } },
  { from: 'kp-9.3-01', to: 'kp-9.3-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.3' } },
  { from: 'kp-9.3-02', to: 'kp-9.3-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.3' } },
  { from: 'kp-9.3-03', to: 'kp-9.3-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.3' } },
  { from: 'kp-9.3-04', to: 'kp-9.3-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.3' } },
  { from: 'kp-9.3-05', to: 'kp-9.3-06', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.3' } },
  { from: 'kp-9.4-01', to: 'kp-9.4-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.4' } },
  { from: 'kp-9.4-02', to: 'kp-9.4-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.4' } },
  { from: 'kp-9.4-03', to: 'kp-9.4-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.4' } },
  { from: 'kp-9.4-04', to: 'kp-9.4-05', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.4' } },
  { from: 'kp-9.5-01', to: 'kp-9.5-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.5' } },
  { from: 'kp-9.5-02', to: 'kp-9.5-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.5' } },
  { from: 'kp-9.5-03', to: 'kp-9.5-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.5' } },
  { from: 'kp-9.6-01', to: 'kp-9.6-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.6' } },
  { from: 'kp-9.6-02', to: 'kp-9.6-03', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.6' } },
  { from: 'kp-9.6-03', to: 'kp-9.6-04', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.6' } },
  { from: 'kp-9.7-01', to: 'kp-9.7-02', strength: 'soft', reason: { zh: '同一Topic内递进', en: 'Sequential within topic 9.7' } },
  { from: 'kp-1.3-03', to: 'kp-1.7-01', strength: 'soft', reason: { zh: 'Topic 1.3→1.7的跨章节关联', en: 'Cross-topic link: 1.3 → 1.7' } },
  { from: 'kp-1.7-02', to: 'kp-1.8-01', strength: 'soft', reason: { zh: 'Topic 1.7→1.8的跨章节关联', en: 'Cross-topic link: 1.7 → 1.8' } },
  { from: 'kp-1.9-07', to: 'kp-1.10-01', strength: 'soft', reason: { zh: 'Topic 1.9→1.10的跨章节关联', en: 'Cross-topic link: 1.9 → 1.10' } },
  { from: 'kp-1.4-04', to: 'kp-1.11-01', strength: 'soft', reason: { zh: 'Topic 1.4→1.11的跨章节关联', en: 'Cross-topic link: 1.4 → 1.11' } },
  { from: 'kp-1.11-05', to: 'kp-1.12-01', strength: 'soft', reason: { zh: 'Topic 1.11→1.12的跨章节关联', en: 'Cross-topic link: 1.11 → 1.12' } },
  { from: 'kp-1.4-04', to: 'kp-1.13-01', strength: 'soft', reason: { zh: 'Topic 1.4→1.13的跨章节关联', en: 'Cross-topic link: 1.4 → 1.13' } },
  { from: 'kp-1.13-04', to: 'kp-1.16-01', strength: 'soft', reason: { zh: 'Topic 1.13→1.16的跨章节关联', en: 'Cross-topic link: 1.13 → 1.16' } },
  { from: 'kp-1.11-05', to: 'kp-1.16-01', strength: 'soft', reason: { zh: 'Topic 1.11→1.16的跨章节关联', en: 'Cross-topic link: 1.11 → 1.16' } },
  { from: 'kp-1.7-02', to: 'kp-1.17-01', strength: 'soft', reason: { zh: 'Topic 1.7→1.17的跨章节关联', en: 'Cross-topic link: 1.7 → 1.17' } },
  { from: 'kp-1.13-04', to: 'kp-1.17-01', strength: 'soft', reason: { zh: 'Topic 1.13→1.17的跨章节关联', en: 'Cross-topic link: 1.13 → 1.17' } },
  { from: 'kp-1.3-03', to: 'kp-1.18-01', strength: 'soft', reason: { zh: 'Topic 1.3→1.18的跨章节关联', en: 'Cross-topic link: 1.3 → 1.18' } },
  { from: 'kp-1.7-02', to: 'kp-1.18-01', strength: 'soft', reason: { zh: 'Topic 1.7→1.18的跨章节关联', en: 'Cross-topic link: 1.7 → 1.18' } },
  { from: 'kp-1.6-04', to: 'kp-2.1-01', strength: 'soft', reason: { zh: 'Topic 1.6→2.1的跨章节关联', en: 'Cross-topic link: 1.6 → 2.1' } },
  { from: 'kp-2.2-13', to: 'kp-2.3-01', strength: 'soft', reason: { zh: 'Topic 2.2→2.3的跨章节关联', en: 'Cross-topic link: 2.2 → 2.3' } },
  { from: 'kp-1.4-04', to: 'kp-2.3-01', strength: 'soft', reason: { zh: 'Topic 1.4→2.3的跨章节关联', en: 'Cross-topic link: 1.4 → 2.3' } },
  { from: 'kp-1.7-02', to: 'kp-2.4-01', strength: 'soft', reason: { zh: 'Topic 1.7→2.4的跨章节关联', en: 'Cross-topic link: 1.7 → 2.4' } },
  { from: 'kp-2.1-03', to: 'kp-2.4-01', strength: 'soft', reason: { zh: 'Topic 2.1→2.4的跨章节关联', en: 'Cross-topic link: 2.1 → 2.4' } },
  { from: 'kp-2.2-13', to: 'kp-2.5-01', strength: 'soft', reason: { zh: 'Topic 2.2→2.5的跨章节关联', en: 'Cross-topic link: 2.2 → 2.5' } },
  { from: 'kp-2.1-03', to: 'kp-2.7-01', strength: 'soft', reason: { zh: 'Topic 2.1→2.7的跨章节关联', en: 'Cross-topic link: 2.1 → 2.7' } },
  { from: 'kp-1.11-05', to: 'kp-2.8-01', strength: 'soft', reason: { zh: 'Topic 1.11→2.8的跨章节关联', en: 'Cross-topic link: 1.11 → 2.8' } },
  { from: 'kp-2.5-13', to: 'kp-2.8-01', strength: 'soft', reason: { zh: 'Topic 2.5→2.8的跨章节关联', en: 'Cross-topic link: 2.5 → 2.8' } },
  { from: 'kp-3.1-02', to: 'kp-2.9-01', strength: 'soft', reason: { zh: 'Topic 3.1→2.9的跨章节关联', en: 'Cross-topic link: 3.1 → 2.9' } },
  { from: 'kp-1.12-03', to: 'kp-2.9-01', strength: 'soft', reason: { zh: 'Topic 1.12→2.9的跨章节关联', en: 'Cross-topic link: 1.12 → 2.9' } },
  { from: 'kp-3.2-01', to: 'kp-2.10-01', strength: 'soft', reason: { zh: 'Topic 3.2→2.10的跨章节关联', en: 'Cross-topic link: 3.2 → 2.10' } },
  { from: 'kp-2.5-13', to: 'kp-2.10-01', strength: 'soft', reason: { zh: 'Topic 2.5→2.10的跨章节关联', en: 'Cross-topic link: 2.5 → 2.10' } },
  { from: 'kp-2.10-04', to: 'kp-2.11-01', strength: 'soft', reason: { zh: 'Topic 2.10→2.11的跨章节关联', en: 'Cross-topic link: 2.10 → 2.11' } },
  { from: 'kp-2.5-13', to: 'kp-2.11-01', strength: 'soft', reason: { zh: 'Topic 2.5→2.11的跨章节关联', en: 'Cross-topic link: 2.5 → 2.11' } },
  { from: 'kp-3.3-02', to: 'kp-2.12-01', strength: 'soft', reason: { zh: 'Topic 3.3→2.12的跨章节关联', en: 'Cross-topic link: 3.3 → 2.12' } },
  { from: 'kp-2.4-03', to: 'kp-2.12-01', strength: 'soft', reason: { zh: 'Topic 2.4→2.12的跨章节关联', en: 'Cross-topic link: 2.4 → 2.12' } },
  { from: 'kp-2.5-13', to: 'kp-2.13-01', strength: 'soft', reason: { zh: 'Topic 2.5→2.13的跨章节关联', en: 'Cross-topic link: 2.5 → 2.13' } },
  { from: 'kp-2.2-13', to: 'kp-2.13-01', strength: 'soft', reason: { zh: 'Topic 2.2→2.13的跨章节关联', en: 'Cross-topic link: 2.2 → 2.13' } },
  { from: 'kp-2.1-03', to: 'kp-3.1-01', strength: 'soft', reason: { zh: 'Topic 2.1→3.1的跨章节关联', en: 'Cross-topic link: 2.1 → 3.1' } },
  { from: 'kp-3.1-02', to: 'kp-3.2-01', strength: 'soft', reason: { zh: 'Topic 3.1→3.2的跨章节关联', en: 'Cross-topic link: 3.1 → 3.2' } },
  { from: 'kp-2.5-13', to: 'kp-3.2-01', strength: 'soft', reason: { zh: 'Topic 2.5→3.2的跨章节关联', en: 'Cross-topic link: 2.5 → 3.2' } },
  { from: 'kp-3.2-01', to: 'kp-3.3-01', strength: 'soft', reason: { zh: 'Topic 3.2→3.3的跨章节关联', en: 'Cross-topic link: 3.2 → 3.3' } },
  { from: 'kp-1.4-04', to: 'kp-3.3-01', strength: 'soft', reason: { zh: 'Topic 1.4→3.3的跨章节关联', en: 'Cross-topic link: 1.4 → 3.3' } },
  { from: 'kp-3.1-02', to: 'kp-3.4-01', strength: 'soft', reason: { zh: 'Topic 3.1→3.4的跨章节关联', en: 'Cross-topic link: 3.1 → 3.4' } },
  { from: 'kp-1.3-03', to: 'kp-3.4-01', strength: 'soft', reason: { zh: 'Topic 1.3→3.4的跨章节关联', en: 'Cross-topic link: 1.3 → 3.4' } },
  { from: 'kp-3.3-02', to: 'kp-3.5-01', strength: 'soft', reason: { zh: 'Topic 3.3→3.5的跨章节关联', en: 'Cross-topic link: 3.3 → 3.5' } },
  { from: 'kp-2.5-13', to: 'kp-3.5-01', strength: 'soft', reason: { zh: 'Topic 2.5→3.5的跨章节关联', en: 'Cross-topic link: 2.5 → 3.5' } },
  { from: 'kp-3.5-04', to: 'kp-3.6-01', strength: 'soft', reason: { zh: 'Topic 3.5→3.6的跨章节关联', en: 'Cross-topic link: 3.5 → 3.6' } },
  { from: 'kp-3.6-02', to: 'kp-3.7-01', strength: 'soft', reason: { zh: 'Topic 3.6→3.7的跨章节关联', en: 'Cross-topic link: 3.6 → 3.7' } },
  { from: 'kp-1.4-04', to: 'kp-3.7-01', strength: 'soft', reason: { zh: 'Topic 1.4→3.7的跨章节关联', en: 'Cross-topic link: 1.4 → 3.7' } },
  { from: 'kp-1.11-05', to: 'kp-4.3-01', strength: 'soft', reason: { zh: 'Topic 1.11→4.3的跨章节关联', en: 'Cross-topic link: 1.11 → 4.3' } },
  { from: 'kp-1.11-05', to: 'kp-4.4-01', strength: 'soft', reason: { zh: 'Topic 1.11→4.4的跨章节关联', en: 'Cross-topic link: 1.11 → 4.4' } },
  { from: 'kp-2.5-13', to: 'kp-4.6-01', strength: 'soft', reason: { zh: 'Topic 2.5→4.6的跨章节关联', en: 'Cross-topic link: 2.5 → 4.6' } },
  { from: 'kp-4.6-10', to: 'kp-4.7-01', strength: 'soft', reason: { zh: 'Topic 4.6→4.7的跨章节关联', en: 'Cross-topic link: 4.6 → 4.7' } },
  { from: 'kp-4.2-04', to: 'kp-4.8-01', strength: 'soft', reason: { zh: 'Topic 4.2→4.8的跨章节关联', en: 'Cross-topic link: 4.2 → 4.8' } },
  { from: 'kp-4.7-06', to: 'kp-4.8-01', strength: 'soft', reason: { zh: 'Topic 4.7→4.8的跨章节关联', en: 'Cross-topic link: 4.7 → 4.8' } },
  { from: 'kp-1.4-04', to: 'kp-5.1-01', strength: 'soft', reason: { zh: 'Topic 1.4→5.1的跨章节关联', en: 'Cross-topic link: 1.4 → 5.1' } },
  { from: 'kp-4.1-03', to: 'kp-5.2-01', strength: 'soft', reason: { zh: 'Topic 4.1→5.2的跨章节关联', en: 'Cross-topic link: 4.1 → 5.2' } },
  { from: 'kp-1.6-04', to: 'kp-5.2-01', strength: 'soft', reason: { zh: 'Topic 1.6→5.2的跨章节关联', en: 'Cross-topic link: 1.6 → 5.2' } },
  { from: 'kp-5.2-03', to: 'kp-5.3-01', strength: 'soft', reason: { zh: 'Topic 5.2→5.3的跨章节关联', en: 'Cross-topic link: 5.2 → 5.3' } },
  { from: 'kp-1.11-05', to: 'kp-5.3-01', strength: 'soft', reason: { zh: 'Topic 1.11→5.3的跨章节关联', en: 'Cross-topic link: 1.11 → 5.3' } },
  { from: 'kp-5.2-03', to: 'kp-5.4-01', strength: 'soft', reason: { zh: 'Topic 5.2→5.4的跨章节关联', en: 'Cross-topic link: 5.2 → 5.4' } },
  { from: 'kp-5.3-06', to: 'kp-5.4-01', strength: 'soft', reason: { zh: 'Topic 5.3→5.4的跨章节关联', en: 'Cross-topic link: 5.3 → 5.4' } },
  { from: 'kp-5.2-03', to: 'kp-5.5-01', strength: 'soft', reason: { zh: 'Topic 5.2→5.5的跨章节关联', en: 'Cross-topic link: 5.2 → 5.5' } },
  { from: 'kp-5.3-06', to: 'kp-5.5-01', strength: 'soft', reason: { zh: 'Topic 5.3→5.5的跨章节关联', en: 'Cross-topic link: 5.3 → 5.5' } },
  { from: 'kp-4.6-10', to: 'kp-6.1-01', strength: 'soft', reason: { zh: 'Topic 4.6→6.1的跨章节关联', en: 'Cross-topic link: 4.6 → 6.1' } },
  { from: 'kp-1.3-03', to: 'kp-6.1-01', strength: 'soft', reason: { zh: 'Topic 1.3→6.1的跨章节关联', en: 'Cross-topic link: 1.3 → 6.1' } },
  { from: 'kp-6.1-02', to: 'kp-6.2-01', strength: 'soft', reason: { zh: 'Topic 6.1→6.2的跨章节关联', en: 'Cross-topic link: 6.1 → 6.2' } },
  { from: 'kp-1.4-04', to: 'kp-6.2-01', strength: 'soft', reason: { zh: 'Topic 1.4→6.2的跨章节关联', en: 'Cross-topic link: 1.4 → 6.2' } },
  { from: 'kp-6.2-03', to: 'kp-6.3-01', strength: 'soft', reason: { zh: 'Topic 6.2→6.3的跨章节关联', en: 'Cross-topic link: 6.2 → 6.3' } },
  { from: 'kp-1.18-01', to: 'kp-6.3-01', strength: 'soft', reason: { zh: 'Topic 1.18→6.3的跨章节关联', en: 'Cross-topic link: 1.18 → 6.3' } },
  { from: 'kp-6.2-03', to: 'kp-6.4-01', strength: 'soft', reason: { zh: 'Topic 6.2→6.4的跨章节关联', en: 'Cross-topic link: 6.2 → 6.4' } },
  { from: 'kp-2.10-04', to: 'kp-6.4-01', strength: 'soft', reason: { zh: 'Topic 2.10→6.4的跨章节关联', en: 'Cross-topic link: 2.10 → 6.4' } },
  { from: 'kp-6.2-03', to: 'kp-6.5-01', strength: 'soft', reason: { zh: 'Topic 6.2→6.5的跨章节关联', en: 'Cross-topic link: 6.2 → 6.5' } },
  { from: 'kp-5.2-03', to: 'kp-6.5-01', strength: 'soft', reason: { zh: 'Topic 5.2→6.5的跨章节关联', en: 'Cross-topic link: 5.2 → 6.5' } },
  { from: 'kp-5.4-07', to: 'kp-6.6-01', strength: 'soft', reason: { zh: 'Topic 5.4→6.6的跨章节关联', en: 'Cross-topic link: 5.4 → 6.6' } },
  { from: 'kp-3.1-02', to: 'kp-7.1-01', strength: 'soft', reason: { zh: 'Topic 3.1→7.1的跨章节关联', en: 'Cross-topic link: 3.1 → 7.1' } },
  { from: 'kp-4.6-10', to: 'kp-7.1-01', strength: 'soft', reason: { zh: 'Topic 4.6→7.1的跨章节关联', en: 'Cross-topic link: 4.6 → 7.1' } },
  { from: 'kp-3.1-02', to: 'kp-7.2-01', strength: 'soft', reason: { zh: 'Topic 3.1→7.2的跨章节关联', en: 'Cross-topic link: 3.1 → 7.2' } },
  { from: 'kp-2.1-03', to: 'kp-7.2-01', strength: 'soft', reason: { zh: 'Topic 2.1→7.2的跨章节关联', en: 'Cross-topic link: 2.1 → 7.2' } },
  { from: 'kp-7.2-03', to: 'kp-7.3-01', strength: 'soft', reason: { zh: 'Topic 7.2→7.3的跨章节关联', en: 'Cross-topic link: 7.2 → 7.3' } },
  { from: 'kp-6.1-02', to: 'kp-7.3-01', strength: 'soft', reason: { zh: 'Topic 6.1→7.3的跨章节关联', en: 'Cross-topic link: 6.1 → 7.3' } },
  { from: 'kp-7.2-03', to: 'kp-7.4-01', strength: 'soft', reason: { zh: 'Topic 7.2→7.4的跨章节关联', en: 'Cross-topic link: 7.2 → 7.4' } },
  { from: 'kp-2.2-13', to: 'kp-7.4-01', strength: 'soft', reason: { zh: 'Topic 2.2→7.4的跨章节关联', en: 'Cross-topic link: 2.2 → 7.4' } },
  { from: 'kp-1.4-04', to: 'kp-8.1-01', strength: 'soft', reason: { zh: 'Topic 1.4→8.1的跨章节关联', en: 'Cross-topic link: 1.4 → 8.1' } },
  { from: 'kp-8.1-02', to: 'kp-8.2-01', strength: 'soft', reason: { zh: 'Topic 8.1→8.2的跨章节关联', en: 'Cross-topic link: 8.1 → 8.2' } },
  { from: 'kp-8.1-02', to: 'kp-8.3-01', strength: 'soft', reason: { zh: 'Topic 8.1→8.3的跨章节关联', en: 'Cross-topic link: 8.1 → 8.3' } },
  { from: 'kp-1.4-04', to: 'kp-8.3-01', strength: 'soft', reason: { zh: 'Topic 1.4→8.3的跨章节关联', en: 'Cross-topic link: 1.4 → 8.3' } },
  { from: 'kp-8.3-08', to: 'kp-8.4-01', strength: 'soft', reason: { zh: 'Topic 8.3→8.4的跨章节关联', en: 'Cross-topic link: 8.3 → 8.4' } },
  { from: 'kp-1.6-04', to: 'kp-9.1-01', strength: 'soft', reason: { zh: 'Topic 1.6→9.1的跨章节关联', en: 'Cross-topic link: 1.6 → 9.1' } },
  { from: 'kp-9.1-02', to: 'kp-9.3-01', strength: 'soft', reason: { zh: 'Topic 9.1→9.3的跨章节关联', en: 'Cross-topic link: 9.1 → 9.3' } },
  { from: 'kp-1.6-04', to: 'kp-9.3-01', strength: 'soft', reason: { zh: 'Topic 1.6→9.3的跨章节关联', en: 'Cross-topic link: 1.6 → 9.3' } },
  { from: 'kp-9.1-02', to: 'kp-9.4-01', strength: 'soft', reason: { zh: 'Topic 9.1→9.4的跨章节关联', en: 'Cross-topic link: 9.1 → 9.4' } },
  { from: 'kp-1.4-04', to: 'kp-9.4-01', strength: 'soft', reason: { zh: 'Topic 1.4→9.4的跨章节关联', en: 'Cross-topic link: 1.4 → 9.4' } },
  { from: 'kp-3.1-02', to: 'kp-9.5-01', strength: 'soft', reason: { zh: 'Topic 3.1→9.5的跨章节关联', en: 'Cross-topic link: 3.1 → 9.5' } },
  { from: 'kp-9.1-02', to: 'kp-9.5-01', strength: 'soft', reason: { zh: 'Topic 9.1→9.5的跨章节关联', en: 'Cross-topic link: 9.1 → 9.5' } },
  { from: 'kp-9.3-06', to: 'kp-9.6-01', strength: 'soft', reason: { zh: 'Topic 9.3→9.6的跨章节关联', en: 'Cross-topic link: 9.3 → 9.6' } },
  { from: 'kp-9.4-05', to: 'kp-9.6-01', strength: 'soft', reason: { zh: 'Topic 9.4→9.6的跨章节关联', en: 'Cross-topic link: 9.4 → 9.6' } },
  { from: 'kp-9.4-05', to: 'kp-9.7-01', strength: 'soft', reason: { zh: 'Topic 9.4→9.7的跨章节关联', en: 'Cross-topic link: 9.4 → 9.7' } },
  { from: 'kp-1.11-05', to: 'kp-9.7-01', strength: 'soft', reason: { zh: 'Topic 1.11→9.7的跨章节关联', en: 'Cross-topic link: 1.11 → 9.7' } },
];

// ═══════════════════════════════════════════════════════════
// Derived lookup maps (built once at import time)
// ═══════════════════════════════════════════════════════════

const _prereqMap = new Map<string, KPEdge[]>();
const _leadsToMap = new Map<string, KPEdge[]>();

for (const edge of KP_EDGES) {
  if (!_prereqMap.has(edge.to)) _prereqMap.set(edge.to, []);
  _prereqMap.get(edge.to)!.push(edge);
  if (!_leadsToMap.has(edge.from)) _leadsToMap.set(edge.from, []);
  _leadsToMap.get(edge.from)!.push(edge);
}

/** Get all prerequisite edges for a KP (what must be learned before this) */
export function getKPPrereqs(kpId: string): KPEdge[] {
  return _prereqMap.get(kpId) ?? [];
}

/** Get all forward edges from a KP (what this unlocks) */
export function getKPLeadsTo(kpId: string): KPEdge[] {
  return _leadsToMap.get(kpId) ?? [];
}

/** Trace the prerequisite chain upward (deepest roots first) */
export function getPrereqChain(kpId: string, maxDepth = 5): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();
  function dfs(id: string, depth: number) {
    if (depth > maxDepth || visited.has(id)) return;
    visited.add(id);
    for (const edge of getKPPrereqs(id)) {
      dfs(edge.from, depth + 1);
    }
    chain.push(id);
  }
  for (const edge of getKPPrereqs(kpId)) {
    dfs(edge.from, 0);
  }
  return chain;
}

/** Trace the forward chain downward (what this KP leads to) */
export function getForwardChain(kpId: string, maxDepth = 3): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();
  function dfs(id: string, depth: number) {
    if (depth > maxDepth || visited.has(id)) return;
    visited.add(id);
    chain.push(id);
    for (const edge of getKPLeadsTo(id)) {
      dfs(edge.to, depth + 1);
    }
  }
  for (const edge of getKPLeadsTo(kpId)) {
    dfs(edge.to, 0);
  }
  return chain;
}

/** Get hub KPs (≥3 forward links — critical foundations) */
export function getHubKPs(): string[] {
  return [..._leadsToMap.entries()]
    .filter(([, edges]) => edges.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([kpId]) => kpId);
}

/** Total edge count */
export const KP_EDGE_COUNT = KP_EDGES.length;
