import { Sparkles } from 'lucide-react';
import type { Mission, Language } from '../../types';
import { MathView } from '../MathView';
import { interpolate } from '../../utils/interpolate';
import { translations } from '../../i18n/translations';
import {
  NumberLine,
  VennDiagram,
  FactorTree,
  NumberGrid,
  BalanceScale,
  EquationSteps,
  CoordinatePlane,
  AngleArc,
  ParallelTransversal,
  IntersectingLines,
  Triangle,
  CompassRose,
} from '../diagrams';

const VIS_LABELS = {
  zh: { simpleEq: '基础代数方程', compound: '复利增长模型', estimation: '无理数估算', length: '长', width: '宽', start: '起点', end: '落点' },
  en: { simpleEq: 'Simple Equation', compound: 'Compound Growth', estimation: 'Estimation', length: 'L', width: 'W', start: 'Start', end: 'End' },
} as const;

export const VisualData = ({ mission, lang }: { mission: Mission; lang: Language }) => {
  const t = translations[lang];
  const vl = VIS_LABELS[lang];

  // ──────────────────────────────
  // New diagram-based visualizations
  // ──────────────────────────────

  if (mission.type === 'VENN' && mission.data.sets) {
    return (
      <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
        <VennDiagram
          sets={mission.data.sets}
          intersection={mission.data.intersection}
          universalLabel={mission.data.universalLabel}
        />
      </div>
    );
  }

  if (mission.type === 'ANGLES' && mission.data.angle != null) {
    // Parallel transversal
    if (mission.data.parallel) {
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <ParallelTransversal
            angle={mission.data.angle}
            highlight={mission.data.highlight}
            showLabels
          />
        </div>
      );
    }
    // Intersecting lines / vertically opposite
    if (mission.data.intersecting) {
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <IntersectingLines
            angle={mission.data.angle}
            showVerticallyOpposite={mission.data.showVerticallyOpposite}
          />
        </div>
      );
    }
    // Bearing / compass
    if (mission.data.bearing != null) {
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <CompassRose bearing={mission.data.bearing} showNorth />
        </div>
      );
    }
    // Generic angle
    return (
      <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
        <AngleArc angle={mission.data.angle} label={mission.data.label} showProtractor={mission.data.showProtractor} />
      </div>
    );
  }

  if (mission.type === 'TRIGONOMETRY' && mission.data.triangle) {
    return (
      <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
        <Triangle
          sides={mission.data.triangle.sides}
          angles={mission.data.triangle.angles}
          rightAngle={mission.data.triangle.rightAngle}
          labels={mission.data.triangle.labels}
        />
      </div>
    );
  }

  // ──────────────────────────────
  // Original visualizations (preserved)
  // ──────────────────────────────

  if (mission.type === 'SIMPLE_EQ') {
    // Enhanced: show balance scale if equation data available
    if (mission.data.left && mission.data.right) {
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <BalanceScale left={mission.data.left} right={mission.data.right} operation={mission.data.operation} />
        </div>
      );
    }
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <div className="text-4xl font-black text-[#3d2b1f] mb-2">
          <MathView tex={interpolate(mission.description[lang], mission.data ?? {}).match(/\$(.*?)\$/)?.[1] || ''} />
        </div>
        <p className="text-[#5c4033] text-[10px] font-bold uppercase tracking-widest">{vl.simpleEq}</p>
      </div>
    );
  }
  if (mission.type === 'PERCENTAGE') {
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <div className="text-3xl font-black text-[#3d2b1f] mb-2">
          <MathView tex={`${mission.data.initial} \\times (1 + ${mission.data.rate})^{${mission.data.years}}`} />
        </div>
        <p className="text-[#5c4033] text-[10px] font-bold uppercase tracking-widest">{vl.compound}</p>
      </div>
    );
  }
  if (mission.type === 'ESTIMATION') {
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <div className="text-5xl font-black text-[#3d2b1f] mb-2">
          <MathView tex={`\\sqrt{${mission.data.value}} \\approx ?`} />
        </div>
        <p className="text-[#5c4033] text-[10px] font-bold uppercase tracking-widest">{vl.estimation}</p>
      </div>
    );
  }
  if (mission.type === 'LINEAR') {
    // Enhanced: show coordinate plane if we have enough data
    if (mission.data.points && mission.data.showGraph) {
      const [[x1, y1], [x2, y2]] = mission.data.points;
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <CoordinatePlane
            xRange={mission.data.xRange || [-5, 10]}
            yRange={mission.data.yRange || [-5, 10]}
            points={[
              { x: x1, y: y1, label: 'A', color: '#8b0000' },
              { x: x2, y: y2, label: 'B', color: '#8b0000' },
            ]}
            lines={[{
              points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
              color: '#1a3a5c',
            }]}
          />
        </div>
      );
    }
    const [[x1, y1], [x2, y2]] = mission.data.points;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">{t.pointA}</span>
          <MathView tex={`(${x1}, ${y1})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">{t.pointB}</span>
          <MathView tex={`(${x2}, ${y2})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
      </div>
    );
  }
  if (mission.type === 'AREA' && mission.data.length) {
    const { length, width } = mission.data;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 flex flex-col items-center">
        <div className="w-32 h-20 border-4 border-[#3d2b1f] bg-indigo-500/20 flex items-center justify-center relative">
          <span className="absolute -top-6 text-xs font-bold text-[#5c4033]">{vl.length}: {length}</span>
          <span className="absolute -left-10 text-xs font-bold text-[#5c4033]">{vl.width}: {width}</span>
          <Sparkles className="text-indigo-500/30" size={32} />
        </div>
      </div>
    );
  }
  if (mission.type === 'QUADRATIC') {
    // Enhanced: show coordinate plane with curve
    if (mission.data.a != null && mission.data.showGraph) {
      const { a, b, c } = mission.data;
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <CoordinatePlane
            xRange={mission.data.xRange || [-5, 5]}
            yRange={mission.data.yRange || [-5, 10]}
            curves={[{
              fn: (x: number) => a * x * x + (b || 0) * x + (c || 0),
              color: '#8b0000',
            }]}
          />
        </div>
      );
    }
    const [p1, p2] = [mission.data.p1, mission.data.p2];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">{vl.start}</span>
          <MathView tex={`(${p1[0]}, ${p1[1]})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">{vl.end}</span>
          <MathView tex={`(${p2[0]}, ${p2[1]})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
      </div>
    );
  }
  if (mission.type === 'INDICES') {
    const { base, e1, e2 } = mission.data;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <MathView tex={`${base}^{${e1}} \\times ${base}^{${e2}} = ${base}^x`} className="text-2xl font-black text-[#3d2b1f]" />
      </div>
    );
  }
  if (mission.type === 'PYTHAGORAS') {
    // Enhanced: show triangle diagram
    if (mission.data.showDiagram === true) {
      const { a, b } = mission.data;
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <Triangle
            sides={[
              { label: String(a) },
              { label: String(b) },
              { label: '?' },
            ]}
            rightAngle={0}
            labels={['A', 'B', 'C']}
          />
        </div>
      );
    }
    const { a, b } = mission.data;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 flex flex-col items-center">
        <div className="w-32 h-24 border-b-4 border-l-4 border-[#3d2b1f] relative">
          <span className="absolute -left-6 top-1/2 text-xs font-bold text-[#5c4033]">{b}</span>
          <span className="absolute bottom-[-24px] left-1/2 text-xs font-bold text-[#5c4033]">{a}</span>
        </div>
      </div>
    );
  }
  if (mission.type === 'SIMULTANEOUS' && mission.data.eq1) {
    // Enhanced: show equation steps if available
    if (mission.data.steps) {
      return (
        <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
          <EquationSteps steps={mission.data.steps} currentStep={mission.data.currentStep} />
        </div>
      );
    }
    const [a1, b1, c1] = mission.data.eq1;
    const [a2, b2, c2] = mission.data.eq2;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10">
        <MathView tex={`\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + ${b2}y = ${c2} \\end{cases}`} className="text-xl font-black text-[#3d2b1f]" />
      </div>
    );
  }

  // ──────────────────────────────
  // Additional diagram-based types
  // ──────────────────────────────

  // Number line visualization
  if (mission.data?.numberLine) {
    return (
      <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
        <NumberLine
          min={mission.data.numberLine.min}
          max={mission.data.numberLine.max}
          marks={mission.data.numberLine.marks}
          highlights={mission.data.numberLine.highlights}
        />
      </div>
    );
  }

  // Factor tree visualization
  if (mission.data?.factorTree) {
    return (
      <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
        <FactorTree root={mission.data.factorTree} />
      </div>
    );
  }

  // Number grid visualization
  if (mission.data?.numberGrid) {
    return (
      <div className="bg-white/30 p-4 rounded-lg border border-[#3d2b1f]/10">
        <NumberGrid
          range={mission.data.numberGrid.range}
          highlights={mission.data.numberGrid.highlights}
          columns={mission.data.numberGrid.columns}
        />
      </div>
    );
  }

  return null;
};
