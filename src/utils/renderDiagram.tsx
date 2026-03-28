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
import { RatioBar } from '../components/diagrams/RatioBar';
import { RoundingNumberLine } from '../components/diagrams/RoundingNumberLine';
import { MixedFractionPie } from '../components/diagrams/MixedFractionPie';
import { ParabolaRoots } from '../components/diagrams/ParabolaRoots';
import { TangentLine } from '../components/diagrams/TangentLine';
import { AreaUnderCurve } from '../components/diagrams/AreaUnderCurve';
import { InterestGrowth } from '../components/diagrams/InterestGrowth';
import { FactorPairsGrid } from '../components/diagrams/FactorPairsGrid';
import { SignedMultiply } from '../components/diagrams/SignedMultiply';
import { FDPTriangle } from '../components/diagrams/FDPTriangle';
import { ExpressionOrder } from '../components/diagrams/ExpressionOrder';
import { SimplifyFlow } from '../components/diagrams/SimplifyFlow';

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

  // ── Pythagoras → Right triangle with rightAngle=0 at bottom-left ──
  // Layout: sides[0]=bottom leg (a), sides[1]=hypotenuse (c), sides[2]=left leg (b)
  // Pass `length` so the triangle shape matches actual side ratios
  if (mission.type === 'PYTHAGORAS' && d.a !== undefined) {
    const a = d.a as number;
    if (d.c) {
      // Find leg b: given a and c
      const c = d.c as number;
      const b = Math.round(Math.sqrt(c * c - a * a) * 100) / 100;
      return (
        <Triangle
          sides={[{ label: `a = ${a}`, length: a }, { label: `c = ${c}`, length: c }, { label: 'b = ?', length: b }]}
          rightAngle={0} labels={['', '', '']}
        />
      );
    }
    // Find hypotenuse c: given a and b
    const b = d.b as number;
    const c = Math.round(Math.sqrt(a * a + b * b) * 100) / 100;
    return (
      <Triangle
        sides={[{ label: `a = ${a}`, length: a }, { label: 'c = ?', length: c }, { label: `b = ${b}`, length: b }]}
        rightAngle={0} labels={['', '', '']}
      />
    );
  }

  // ── Trigonometry → Right triangle with angle at vertex 1 (bottom-right) ──
  // Layout: sides[0]=bottom (adjacent), sides[1]=diagonal (hypotenuse), sides[2]=left (opposite)
  // Pass `length` for proportional vertex positions based on actual angle
  if (mission.type === 'TRIGONOMETRY' && d.opposite !== undefined) {
    const opp = d.opposite as number;
    const adj = d.adjacent as number | undefined;
    const func = d.func as string;
    const angleDeg = d.angle as number | undefined;

    // Compute both legs for proportional triangle
    let legBottom: number;
    let legLeft: number;
    if (adj) {
      legBottom = adj;
      legLeft = opp;
    } else if (angleDeg) {
      const angleRad = (angleDeg * Math.PI) / 180;
      legBottom = Math.round((opp / Math.tan(angleRad)) * 100) / 100;
      legLeft = opp;
    } else {
      legBottom = opp; // fallback: isoceles
      legLeft = opp;
    }

    return (
      <Triangle
        sides={func === 'sin'
          ? [{ label: '', length: legBottom }, { label: 'c = ?' }, { label: `opp = ${opp}`, length: legLeft }]
          : [{ label: `adj = ${adj}`, length: legBottom }, { label: '' }, { label: `opp = ${opp}`, length: legLeft }]}
        rightAngle={0}
        angles={func === 'tan_inv'
          ? [{}, { label: '?' }, {}]
          : [{}, { label: `${angleDeg}\u00b0` }, {}]}
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

  // ── Similar Triangles → two triangles side by side ──
  if (mission.type === 'SIMILAR_TRIANGLES' && d.p !== undefined) {
    const p = d.p as number, q = d.q as number, r = d.r as number;
    const scale = r / p;
    const xVal = Math.round(q * scale * 100) / 100;
    // Small triangle △ABC: base=p (bottom), right=q (right), hyp=left
    // Large triangle △DEF: base=r (bottom), right=x (right), hyp=left
    const sA = { x: 20, y: 80 }, sB = { x: 20 + p * 8, y: 80 }, sC = { x: 20 + p * 8, y: 80 - q * 8 };
    const lA = { x: 130, y: 80 }, lB = { x: 130 + r * 8, y: 80 }, lC = { x: 130 + r * 8, y: 80 - xVal * 8 };
    const pts = (v: {x:number,y:number}[]) => v.map(p => `${p.x},${p.y}`).join(' ');
    const mid = (a: {x:number,y:number}, b: {x:number,y:number}) => ({ x: (a.x+b.x)/2, y: (a.y+b.y)/2 });
    return (
      <svg viewBox="0 0 260 100" className="w-full max-w-xs mx-auto">
        {/* Small triangle */}
        <polygon points={pts([sA,sB,sC])} fill="none" stroke="#2980b9" strokeWidth="1.5"/>
        {/* Labels small */}
        <text x={mid(sA,sB).x} y={mid(sA,sB).y+12} textAnchor="middle" fontSize="10" fill="#2980b9">{p}</text>
        <text x={mid(sB,sC).x+8} y={mid(sB,sC).y} textAnchor="middle" fontSize="10" fill="#2980b9">{q}</text>
        <text x={sA.x-5} y={sA.y+10} textAnchor="end" fontSize="9" fill="#555">A</text>
        <text x={sB.x+4} y={sB.y+10} textAnchor="start" fontSize="9" fill="#555">B</text>
        <text x={sC.x+4} y={sC.y-2} textAnchor="start" fontSize="9" fill="#555">C</text>
        {/* Large triangle */}
        <polygon points={pts([lA,lB,lC])} fill="none" stroke="#c0392b" strokeWidth="1.5"/>
        {/* Labels large */}
        <text x={mid(lA,lB).x} y={mid(lA,lB).y+12} textAnchor="middle" fontSize="10" fill="#c0392b">{r}</text>
        <text x={mid(lB,lC).x+8} y={mid(lB,lC).y} textAnchor="middle" fontSize="10" fill="#c0392b">x</text>
        <text x={lA.x-5} y={lA.y+10} textAnchor="end" fontSize="9" fill="#555">D</text>
        <text x={lB.x+4} y={lB.y+10} textAnchor="start" fontSize="9" fill="#555">E</text>
        <text x={lC.x+4} y={lC.y-2} textAnchor="start" fontSize="9" fill="#555">F</text>
        {/* Similar marker */}
        <text x="120" y="50" textAnchor="middle" fontSize="10" fill="#888">~</text>
      </svg>
    );
  }

  // ── Tree Diagram → two-stage probability tree (without replacement) ──
  if (mission.type === 'TREE_DIAGRAM' && d.total !== undefined) {
    const r = d.red as number, b = (d.total as number) - r, t = d.total as number;
    return (
      <svg viewBox="0 0 280 120" className="w-full max-w-xs mx-auto">
        {/* Root */}
        <circle cx="30" cy="60" r="4" fill="#555"/>
        {/* Stage 1 branches */}
        <line x1="34" y1="58" x2="110" y2="25" stroke="#c0392b" strokeWidth="1.2"/>
        <line x1="34" y1="62" x2="110" y2="95" stroke="#2980b9" strokeWidth="1.2"/>
        {/* Stage 1 labels */}
        <text x="65" y="35" textAnchor="middle" fontSize="9" fill="#c0392b">{r}/{t}</text>
        <text x="65" y="88" textAnchor="middle" fontSize="9" fill="#2980b9">{b}/{t}</text>
        <circle cx="114" cy="25" r="3" fill="#c0392b"/>
        <circle cx="114" cy="95" r="3" fill="#2980b9"/>
        <text x="120" y="20" fontSize="8" fill="#c0392b">R</text>
        <text x="120" y="102" fontSize="8" fill="#2980b9">B</text>
        {/* Stage 2 from R */}
        <line x1="117" y1="23" x2="200" y2="10" stroke="#c0392b" strokeWidth="1" strokeDasharray="3"/>
        <line x1="117" y1="27" x2="200" y2="40" stroke="#2980b9" strokeWidth="1" strokeDasharray="3"/>
        <text x="155" y="12" textAnchor="middle" fontSize="8" fill="#c0392b">{r-1}/{t-1}</text>
        <text x="155" y="38" textAnchor="middle" fontSize="8" fill="#2980b9">{b}/{t-1}</text>
        <text x="208" y="12" fontSize="7" fill="#c0392b">RR</text>
        <text x="208" y="42" fontSize="7" fill="#666">RB</text>
        {/* Stage 2 from B */}
        <line x1="117" y1="93" x2="200" y2="80" stroke="#c0392b" strokeWidth="1" strokeDasharray="3"/>
        <line x1="117" y1="97" x2="200" y2="110" stroke="#2980b9" strokeWidth="1" strokeDasharray="3"/>
        <text x="155" y="82" textAnchor="middle" fontSize="8" fill="#c0392b">{r}/{t-1}</text>
        <text x="155" y="108" textAnchor="middle" fontSize="8" fill="#2980b9">{b-1}/{t-1}</text>
        <text x="208" y="82" fontSize="7" fill="#666">BR</text>
        <text x="208" y="112" fontSize="7" fill="#2980b9">BB</text>
        {/* Title */}
        <text x="250" y="60" textAnchor="middle" fontSize="8" fill="#888">no repl.</text>
      </svg>
    );
  }

  // ── Vector 3D → two arrows showing a + b ──
  if (mission.type === 'VECTOR_3D' && d.a1 !== undefined) {
    const a1 = d.a1 as number, a2 = d.a2 as number, b1 = d.b1 as number, b2 = d.b2 as number;
    const cx = 80, cy = 60, sc = 4;
    return (
      <svg viewBox="0 0 200 120" className="w-full max-w-xs mx-auto">
        <defs>
          <marker id="ah" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill="#c0392b"/></marker>
          <marker id="bh" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill="#2980b9"/></marker>
          <marker id="rh" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill="#27ae60"/></marker>
        </defs>
        {/* Grid */}
        <line x1="10" y1={cy} x2="190" y2={cy} stroke="#ddd" strokeWidth="0.5"/>
        <line x1={cx} y1="10" x2={cx} y2="110" stroke="#ddd" strokeWidth="0.5"/>
        {/* Vector a (red) */}
        <line x1={cx} y1={cy} x2={cx+a1*sc} y2={cy-a2*sc} stroke="#c0392b" strokeWidth="1.5" markerEnd="url(#ah)"/>
        <text x={cx+a1*sc/2-6} y={cy-a2*sc/2-4} fontSize="9" fill="#c0392b">a</text>
        {/* Vector b (blue) from tip of a */}
        <line x1={cx+a1*sc} y1={cy-a2*sc} x2={cx+(a1+b1)*sc} y2={cy-(a2+b2)*sc} stroke="#2980b9" strokeWidth="1.5" markerEnd="url(#bh)"/>
        <text x={cx+a1*sc+b1*sc/2+4} y={cy-a2*sc-b2*sc/2-4} fontSize="9" fill="#2980b9">b</text>
        {/* Resultant (green, dashed) */}
        <line x1={cx} y1={cy} x2={cx+(a1+b1)*sc} y2={cy-(a2+b2)*sc} stroke="#27ae60" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#rh)"/>
        <text x={cx+(a1+b1)*sc/2-8} y={cy-(a2+b2)*sc/2+12} fontSize="9" fill="#27ae60" fontWeight="bold">a+b</text>
        {/* Origin label */}
        <text x={cx-8} y={cy+12} fontSize="8" fill="#888">O</text>
      </svg>
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

  // ── RatioBar for RATIO_Y7 and RATIO_RANDOM ──
  if (gen === 'RATIO_Y7_RANDOM' && d.a !== undefined) {
    return <RatioBar a={d.a as number} b={d.b as number} total={d.total as number | undefined} />;
  }
  if (gen === 'RATIO_RANDOM' && d.a !== undefined) {
    return <RatioBar a={d.a as number} b={d.b as number} knownValue={d.knownValue as number} />;
  }

  // ── RoundingNumberLine for ESTIMATION ──
  if (gen === 'ESTIMATION_ROUND_RANDOM' && d.n !== undefined) {
    return <RoundingNumberLine n={d.n as number} place={d.place as number} answer={d.answer as number} />;
  }

  // ── MixedFractionPie for MIXED_IMPROPER ──
  if (gen === 'MIXED_IMPROPER_RANDOM' && d.whole !== undefined) {
    return <MixedFractionPie whole={d.whole as number} num={d.num as number} den={d.den as number} mode={d.mode as 'to_improper' | 'to_mixed'} />;
  }

  // ── Calculus ──
  if (gen === 'ROOTS_RANDOM' && d.a !== undefined && d.b !== undefined && d.c !== undefined) {
    return <ParabolaRoots a={d.a as number} b={d.b as number} c={d.c as number} />;
  }

  if (gen === 'DERIVATIVE_RANDOM' && d.x !== undefined) {
    const xVal = d.x as number;
    const derivSlope = d.func === '3x^2-3' ? 6 * xVal : 2 * xVal;
    return <TangentLine x={xVal} slope={derivSlope} />;
  }

  if (gen === 'INTEGRATION_RANDOM') {
    return (
      <AreaUnderCurve
        func={d.func as 'x' | '3x^2' | '2x'}
        lower={(d.lower ?? d.a) as number}
        upper={(d.upper ?? d.b) as number}
        area={0}
      />
    );
  }

  // ── Interest ──
  if (gen === 'PERCENTAGE_INTEREST_RANDOM' && d.principal !== undefined) {
    return (
      <InterestGrowth
        principal={d.principal as number}
        rate={d.rate as number}
        years={d.years as number}
        mode={(d.mode as 'simple' | 'compound') || 'compound'}
        answer={d.answer as number}
      />
    );
  }

  // ── Final coverage: factors, signed multiply, FDP, BODMAS, simplify ──
  if (gen === 'FACTORS_LIST_RANDOM' && d.factors) {
    return <FactorPairsGrid n={d.n as number} factors={d.factors as number[]} />;
  }

  if (gen === 'INTEGER_MUL_RANDOM' && d.a !== undefined) {
    return <SignedMultiply a={d.a as number} b={d.b as number} answer={d.answer as number} op={(d.op as string) || '×'} />;
  }

  if (gen === 'FDP_CONVERT_RANDOM' && d.num !== undefined) {
    return <FDPTriangle num={d.num as number} den={d.den as number} dec={d.dec as number} pct={d.pct as number} />;
  }

  if (gen === 'BODMAS_RANDOM' && d.expr !== undefined) {
    return <ExpressionOrder expr={d.expr as string} answer={d.answer as number} />;
  }

  if (gen === 'SIMPLIFY_RANDOM' && d.expr !== undefined) {
    return <SimplifyFlow expr={d.expr as string} simplified={d.simplified as string} />;
  }

  return null;
}
