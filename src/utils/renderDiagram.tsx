/**
 * renderDiagram — Selects and renders the appropriate SVG diagram for a mission.
 * Extracted from PracticeScreen to reduce JSX nesting depth.
 */
import type { JSX } from 'react';
import type { Mission } from '../types';
import { AnimatedCoordinatePlane } from '../components/diagrams/AnimatedCoordinatePlane';
import { AnimatedQuadraticPlane } from '../components/diagrams/AnimatedQuadraticPlane';
import { ShortDivision } from '../components/diagrams/ShortDivision';
import { FactorTree } from '../components/diagrams/FactorTree';
import { AnimatedNumberLine } from '../components/diagrams/AnimatedNumberLine';
import { FractionPie } from '../components/diagrams/FractionPie';
import { NumberGrid } from '../components/diagrams/NumberGrid';
import { BalanceScale } from '../components/diagrams/BalanceScale';
import { AngleArc } from '../components/diagrams/AngleArc';
import { Triangle } from '../components/diagrams/Triangle';
import { ParallelTransversal } from '../components/diagrams/ParallelTransversal';
import { CircleDiagram } from '../components/diagrams/CircleDiagram';
import { SymmetryPlane } from '../components/diagrams/SymmetryPlane';
import { CylinderDiagram } from '../components/diagrams/CylinderDiagram';
import { SpeedTriangle } from '../components/diagrams/SpeedTriangle';
import { SimultaneousGraph } from '../components/diagrams/SimultaneousGraph';
import { StatsDotPlot } from '../components/diagrams/StatsDotPlot';
import { AreaShape } from '../components/diagrams/AreaShape';
import { AlgebraBox } from '../components/diagrams/AlgebraBox';
import { PercentageBar } from '../components/diagrams/PercentageBar';
import { StandardFormScale } from '../components/diagrams/StandardFormScale';
import { IndicesTower } from '../components/diagrams/IndicesTower';
import { FunctionMachine } from '../components/diagrams/FunctionMachine';
import { ProportionGraph } from '../components/diagrams/ProportionGraph';
import { ArithmeticSequence } from '../components/diagrams/ArithmeticSequence';
import { PerimeterRect } from '../components/diagrams/PerimeterRect';
import { CoordinatePlane } from '../components/diagrams/CoordinatePlane';
import { SubstitutionFlow } from '../components/diagrams/SubstitutionFlow';
import { ProbabilityBar } from '../components/diagrams/ProbabilityBar';
import { VennDiagram } from '../components/diagrams/VennDiagram';

type Phase = 'green' | 'amber' | 'red';

/**
 * Returns the SVG diagram element for the given mission, or null if no diagram matches.
 * Does NOT return a fallback — caller should render VisualData when null.
 */
export function renderDiagram(
  mission: Mission,
  phase: Phase,
  tutorialStep: number,
): JSX.Element | null {
  if (phase === 'red') return null;

  const d = mission.data;
  if (!d) return null;

  const step = phase === 'amber' ? 999 : Math.max(0, tutorialStep);
  const gen = d.generatorType as string | undefined;

  // ── Coordinate graphs ──
  if (mission.type === 'LINEAR' && d.points) {
    const pts = d.points as [number, number][];
    const m = (pts[1][1] - pts[0][1]) / (pts[1][0] - pts[0][0]);
    const c = pts[0][1] - m * pts[0][0];
    return <AnimatedCoordinatePlane step={step} points={d.points} m={m} c={c} />;
  }

  if (mission.type === 'QUADRATIC' && d.p1) {
    const p1 = d.p1 as [number, number];
    const p2 = d.p2 as [number, number];
    const isCal = mission.topic === 'Calculus';
    const cVal = isCal ? 0 : p1[1];
    const aVal = isCal
      ? (p2[0] !== 0 ? -p2[1] / (p2[0] * p2[0]) : 1)
      : (p2[0] !== 0 ? (p2[1] - cVal) / (p2[0] * p2[0]) : 1);
    const bVal = isCal && p2[0] !== 0 ? 2 * p2[1] / p2[0] : 0;
    return <AnimatedQuadraticPlane step={step} points={[p1, p2]} a={aVal} b={bVal} c={cVal} />;
  }

  // ── Number theory ──
  if ((mission.type === 'HCF' || mission.type === 'LCM') && d.sdSteps) {
    return (
      <ShortDivision
        a={d.sdA as number} b={d.sdB as number}
        steps={d.sdSteps as any[]}
        bottomA={d.sdBottomA as number} bottomB={d.sdBottomB as number}
        revealSteps={phase === 'amber' ? 999 : Math.max(0, tutorialStep - 6)}
        showHCF={phase === 'amber' || tutorialStep >= 10}
        showLCM={phase === 'amber' || tutorialStep >= 11}
      />
    );
  }

  if (mission.type === 'FACTOR_TREE' && d.tree) {
    return <FactorTree root={d.tree} revealDepth={phase === 'amber' ? 999 : Math.max(0, tutorialStep - 1)} />;
  }

  if (mission.type === 'PRIME' && d.n) {
    return <NumberGrid range={[2, 30]} highlights={[{ type: 'prime' }]} columns={10} />;
  }

  if (mission.type === 'SQUARE_CUBE') {
    return <NumberGrid range={[1, 100]} highlights={[{ type: d.mode === 'cube' ? 'cube' : 'square' }]} columns={10} />;
  }

  if (mission.type === 'SQUARE_ROOT') {
    return <NumberGrid range={[1, 100]} highlights={d.op === 'cbrt' ? [{ type: 'cube' }] : [{ type: 'square' }]} columns={10} />;
  }

  // ── Fractions ──
  if (mission.type === 'FRAC_ADD' && d.d1) {
    return (
      <FractionPie
        numerator1={d.n1 as number} denominator1={d.d1 as number}
        numerator2={d.n2 as number} denominator2={d.d2 as number}
        op={d.op as string || '+'} step={step}
      />
    );
  }

  if (mission.type === 'FRAC_MUL' && d.d1) {
    return (
      <FractionPie
        numerator1={d.n1 as number} denominator1={d.d1 as number}
        numerator2={d.n2 as number} denominator2={d.d2 as number}
        step={step}
      />
    );
  }

  // ── Number line ──
  if (mission.type === 'INTEGER_ADD' && d.answer !== undefined) {
    return (
      <AnimatedNumberLine
        start={d.a as number} end={d.answer as number}
        movement={d.op === '+' ? d.b as number : -(d.b as number)}
        step={phase === 'amber' ? 999 : Math.max(0, tutorialStep - 1)}
      />
    );
  }

  if (mission.type === 'INEQUALITY' && d.answer !== undefined) {
    return (
      <AnimatedNumberLine
        start={0} end={0} movement={0}
        inequalityOp={d.op as '<' | '>' | '≤' | '≥'}
        inequalityBoundary={d.answer as number}
        step={step}
      />
    );
  }

  // ── Algebra ──
  if (mission.type === 'SIMPLE_EQ' && d.left) {
    return (
      <BalanceScale
        left={String(d.left)} right={String(d.right)}
        operation={d.a ? `÷${d.a}` : undefined}
        step={phase === 'amber' ? 999 : Math.max(0, tutorialStep - 2)}
        resultLeft="x" resultRight={String(d.x)}
      />
    );
  }

  if (mission.type === 'SUBSTITUTION' && d.x !== undefined && gen === 'SUBSTITUTION_RANDOM') {
    return (
      <SubstitutionFlow
        expr={d.expr as string || ''} x={d.x as number}
        answer={d.answer as number} mode={d.mode as string || 'linear'}
      />
    );
  }

  if (mission.type === 'EXPAND' && d.a !== undefined && gen === 'EXPAND_RANDOM') {
    return <AlgebraBox mode="expand" a={d.a as number} b={d.b as number} c={d.c as number} />;
  }

  if (mission.type === 'FACTORISE' && d.factor !== undefined) {
    return <AlgebraBox mode="factorise" factor={d.factor as number} p={d.p as number} q={d.q as number} />;
  }

  if (mission.type === 'INDICES' && d.base !== undefined && d.e1 !== undefined) {
    return (
      <IndicesTower
        base={d.base as number} e1={d.e1 as number} e2={d.e2 as number}
        op={(d.op as string) === 'div' ? 'div' : 'mul'}
      />
    );
  }

  if (gen === 'STD_FORM_RANDOM' && d.a !== undefined) {
    return <StandardFormScale number={d.number as number} a={d.a as number} n={d.n as number} />;
  }

  if (gen === 'SIMULTANEOUS_Y8_RANDOM' && d.subEq1) {
    return (
      <SimultaneousGraph
        eq1={d.subEq1 as [number, number]}
        eq2={d.subEq2 as [number, number, number]}
        solX={d.x as number} solY={d.y as number}
        step={phase === 'amber' ? 999 : Math.max(0, tutorialStep - 1)}
      />
    );
  }

  // ── Functions ──
  if (gen === 'FUNC_VAL_RANDOM' && d.m !== undefined) {
    return <FunctionMachine x={d.x as number} m={d.m as number} b={d.b as number} />;
  }

  // ── Geometry ──
  if (mission.type === 'ANGLES' && d.parallel) {
    return <ParallelTransversal angle={d.angle as number} highlight={d.highlight as 'corresponding' | 'alternate' | 'cointerior'} />;
  }

  if (mission.type === 'ANGLES' && d.angle) {
    return <AngleArc angle={d.angle as number} label={`${d.angle}°`} showProtractor />;
  }

  if (mission.type === 'PYTHAGORAS' && d.a !== undefined) {
    return (
      <Triangle
        sides={d.c
          ? [{ label: `a = ${d.a}` }, { label: 'b = ?' }, { label: `c = ${d.c}` }]
          : [{ label: `a = ${d.a}` }, { label: `b = ${d.b}` }, { label: 'c = ?' }]
        }
        rightAngle={0} labels={['', '', '']}
      />
    );
  }

  // ── Trigonometry → Triangle with angle + side labels ──
  if (mission.type === 'TRIGONOMETRY' && d.opposite !== undefined) {
    const opp = d.opposite as number;
    const adj = d.adjacent as number | undefined;
    const func = d.func as string;
    return (
      <Triangle
        sides={func === 'sin'
          ? [{ label: `opp = ${opp}` }, { label: 'c = ?' }, { label: '' }]
          : [{ label: `opp = ${opp}` }, { label: '' }, { label: `adj = ${adj}` }]}
        rightAngle={0}
        angles={func === 'tan_inv'
          ? [{ label: '? °' }, {}, { label: '90°' }]
          : [{ label: `${d.angle}°` }, {}, { label: '90°' }]}
      />
    );
  }

  // ── Similarity → Triangle with scale labels ──
  if (mission.type === 'SIMILARITY' && d.a !== undefined && d.b !== undefined) {
    return (
      <Triangle
        sides={[{ label: `${d.a}` }, { label: `${d.b}` }, { label: 'x = ?' }]}
        labels={['', '', '']}
        color="#2980b9"
      />
    );
  }

  // ── Area triangle ──
  if (mission.type === 'AREA' && gen === 'AREA_TRIANGLE_RANDOM' && d.base !== undefined) {
    return <AreaShape shape="triangle" base={d.base as number} height={d.height as number} />;
  }

  if (mission.type === 'CIRCLE' && d.r !== undefined) {
    return <CircleDiagram radius={d.r as number} showArea={d.mode === 'area'} showCircumference={d.mode === 'circumference'} />;
  }

  if (mission.type === 'SYMMETRY' && d.px !== undefined) {
    return (
      <SymmetryPlane
        px={d.px as number} py={d.py as number}
        ansX={d.ansX as number} ansY={d.ansY as number}
        mode={d.mode as 'reflect_x' | 'reflect_y' | 'rotate_180'} step={step}
      />
    );
  }

  if (mission.type === 'VOLUME' && d.radius !== undefined) {
    return <CylinderDiagram radius={d.radius as number} height={d.height as number} step={step} />;
  }

  if (mission.type === 'AREA' && gen === 'AREA_TRAP_RANDOM') {
    return <AreaShape shape="trap" a={d.a as number} b={d.b as number} h={d.h as number} />;
  }

  if (mission.type === 'AREA' && d.length !== undefined) {
    return <AreaShape shape="rect" length={d.length as number} width={d.width as number} />;
  }

  if (mission.type === 'PERIMETER' && d.length !== undefined) {
    return <PerimeterRect length={d.length as number} width={d.width as number} />;
  }

  if (mission.type === 'COORDINATES' && d.targetX !== undefined) {
    return (
      <CoordinatePlane
        xRange={[-5, 5]} yRange={[-5, 5]}
        points={[{ x: d.targetX as number, y: d.targetY as number, label: `(${d.targetX}, ${d.targetY})`, color: '#c0392b' }]}
      />
    );
  }

  // ── Applied math ──
  if (gen === 'SPEED_RANDOM' && d.mode) {
    return (
      <SpeedTriangle
        speed={d.speed as number} distance={d.distance as number} time={d.time as number}
        mode={d.mode as 'speed' | 'distance' | 'time'}
      />
    );
  }

  if (gen === 'RATIO_Y8_RANDOM' && d.k !== undefined) {
    return (
      <ProportionGraph
        mode={d.mode as 'direct' | 'inverse'} k={d.k as number}
        x1={d.x1 as number} y1={d.y1 as number}
        x2={d.x2 as number} y2={d.y2 as number}
      />
    );
  }

  if (mission.type === 'PERCENTAGE' && d.initial !== undefined && d.pct !== undefined) {
    return <PercentageBar initial={d.initial as number} pct={d.pct as number} increase={(d.rate as number) >= 0} />;
  }

  // PERCENTAGE_OF uses 'n' instead of 'initial'
  if (gen === 'PERCENTAGE_OF_RANDOM' && d.n !== undefined && d.pct !== undefined) {
    return <PercentageBar initial={d.n as number} pct={d.pct as number} increase={true} />;
  }

  // SIMULTANEOUS Y10 — convert eq arrays to slope-intercept for graph
  if (gen === 'SIMULTANEOUS_RANDOM' && d.eq1 && d.eq2) {
    const [a1, b1, c1] = d.eq1 as number[];
    const [a2, b2, c2] = d.eq2 as number[];
    if (b1 !== 0) {
      return (
        <SimultaneousGraph
          eq1={[-a1 / b1, c1 / b1]}
          eq2={[a2, b2, c2]}
          solX={d.x as number} solY={d.y as number} step={step}
        />
      );
    }
  }

  if (mission.type === 'ARITHMETIC' && d.a1 !== undefined) {
    return <ArithmeticSequence a1={d.a1 as number} d={d.d as number} n={d.n as number} />;
  }

  // ── Statistics ──
  if ((mission.type === 'STATISTICS' || mission.type === 'PROBABILITY') && d.values && d.mode) {
    return <StatsDotPlot values={d.values as number[]} mode={d.mode as 'mean' | 'median' | 'mode' | 'range'} />;
  }

  // ── Probability (simple & independent) ──
  if (gen === 'PROBABILITY_SIMPLE_RANDOM' && d.target !== undefined && d.total !== undefined) {
    return <ProbabilityBar mode="simple" target={d.target as number} total={d.total as number} />;
  }

  if (gen === 'PROBABILITY_IND_RANDOM' && d.p1 !== undefined && d.p2 !== undefined) {
    return <ProbabilityBar mode="independent" p1={d.p1 as number} p2={d.p2 as number} />;
  }

  // ── Venn diagram ──
  if (gen === 'VENN_RANDOM' && d.aOnly !== undefined) {
    return (
      <VennDiagram
        sets={[
          { label: 'A', elements: [String(d.aOnly)] },
          { label: 'B', elements: [String(d.bOnly)] },
        ]}
        intersection={[String(d.both)]}
        universalLabel={`ξ = ${d.total}`}
      />
    );
  }

  return null;
}
