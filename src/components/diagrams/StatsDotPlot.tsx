/**
 * StatsDotPlot — Dot plot for mean/median/mode/range visualization
 * Covers: STATISTICS type (Y8 Unit 5: resource counting)
 * Shows data points on a number line with the target statistic highlighted
 */

type Props = {
  values: number[];
  mode: 'mean' | 'median' | 'mode' | 'range';
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#c0392b',
  blue: '#2980b9',
  green: '#27ae60',
  bg: 'rgba(184,134,11,0.06)',
  dot: '#4a3520',
  highlight: '#e74c3c',
};

export function StatsDotPlot({ values, mode }: Props) {
  const W = 280;
  const H = 160;
  const marginL = 25;
  const marginR = 15;
  const marginT = 30;
  const marginB = 40;

  const sorted = [...values].sort((a, b) => a - b);
  const vMin = sorted[0];
  const vMax = sorted[sorted.length - 1];
  const pad = Math.max(1, Math.ceil((vMax - vMin) * 0.15));
  const axMin = vMin - pad;
  const axMax = vMax + pad;
  const plotW = W - marginL - marginR;
  const baseY = H - marginB;

  const toX = (v: number) => marginL + ((v - axMin) / (axMax - axMin)) * plotW;

  // Count occurrences for stacking dots
  const counts: Record<number, number> = {};
  for (const v of sorted) counts[v] = (counts[v] || 0) + 1;

  // Compute statistic
  let statValue: number;
  let statLabel: string;
  if (mode === 'mean') {
    statValue = values.reduce((s, v) => s + v, 0) / values.length;
    statLabel = `Mean = ${Number.isInteger(statValue) ? statValue : statValue.toFixed(1)}`;
  } else if (mode === 'median') {
    const mid = Math.floor(sorted.length / 2);
    statValue = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    statLabel = `Median = ${statValue}`;
  } else if (mode === 'mode') {
    const maxCount = Math.max(...Object.values(counts));
    const modeVal = Number(Object.keys(counts).find(k => counts[Number(k)] === maxCount)!);
    statValue = modeVal;
    statLabel = `Mode = ${modeVal}`;
  } else {
    statValue = vMax - vMin;
    statLabel = `Range = ${vMax} - ${vMin} = ${statValue}`;
  }

  // Build dots: stack vertically for duplicate values
  const dotR = 7;
  const dotGap = 2;
  const dots: JSX.Element[] = [];
  const stackCount: Record<number, number> = {};
  for (const v of sorted) {
    stackCount[v] = (stackCount[v] || 0) + 1;
    const stackIdx = stackCount[v] - 1;
    const cx = toX(v);
    const cy = baseY - dotR - stackIdx * (dotR * 2 + dotGap);

    // Highlight based on mode
    let isHighlighted = false;
    if (mode === 'mode') isHighlighted = counts[v] === Math.max(...Object.values(counts));
    else if (mode === 'range') isHighlighted = (v === vMin || v === vMax);

    dots.push(
      <circle key={`${v}-${stackIdx}`} cx={cx} cy={cy} r={dotR}
        fill={isHighlighted ? COLORS.highlight : COLORS.dot}
        opacity={isHighlighted ? 1 : 0.7}
        stroke="white" strokeWidth={1}
      />
    );
    // Show value inside dot
    dots.push(
      <text key={`t${v}-${stackIdx}`} x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fontWeight="bold" fill="white">
        {v}
      </text>
    );
  }

  // Axis ticks
  const ticks: JSX.Element[] = [];
  const step = Math.max(1, Math.ceil((axMax - axMin) / 10));
  for (let t = Math.ceil(axMin); t <= Math.floor(axMax); t += step) {
    ticks.push(
      <g key={`tick${t}`}>
        <line x1={toX(t)} y1={baseY} x2={toX(t)} y2={baseY + 5} stroke={COLORS.wood} strokeWidth={1} />
        <text x={toX(t)} y={baseY + 16} textAnchor="middle" fontSize={9} fill={COLORS.wood}>{t}</text>
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Statistics dot plot showing ${mode}`}>
      <rect x={marginL - 5} y={marginT - 10} width={plotW + 10} height={H - marginT + 5} fill={COLORS.bg} rx={4} />

      {/* Title */}
      <text x={W / 2} y={16} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>
        {statLabel}
      </text>

      {/* Number line */}
      <line x1={marginL} y1={baseY} x2={W - marginR} y2={baseY} stroke={COLORS.wood} strokeWidth={1.5} />
      {ticks}

      {/* Dots */}
      {dots}

      {/* Mean/Median indicator arrow */}
      {(mode === 'mean' || mode === 'median') && (
        <>
          <line x1={toX(statValue)} y1={baseY + 20} x2={toX(statValue)} y2={baseY + 5}
            stroke={COLORS.highlight} strokeWidth={2} markerEnd="url(#arrowhead)" />
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill={COLORS.highlight} />
            </marker>
          </defs>
          <text x={toX(statValue)} y={baseY + 32} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.highlight}>
            {mode === 'mean' ? 'Mean' : 'Median'}
          </text>
        </>
      )}

      {/* Range bracket */}
      {mode === 'range' && (
        <>
          <line x1={toX(vMin)} y1={baseY + 22} x2={toX(vMax)} y2={baseY + 22}
            stroke={COLORS.highlight} strokeWidth={2} />
          <line x1={toX(vMin)} y1={baseY + 18} x2={toX(vMin)} y2={baseY + 26}
            stroke={COLORS.highlight} strokeWidth={2} />
          <line x1={toX(vMax)} y1={baseY + 18} x2={toX(vMax)} y2={baseY + 26}
            stroke={COLORS.highlight} strokeWidth={2} />
          <text x={(toX(vMin) + toX(vMax)) / 2} y={baseY + 36} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.highlight}>
            Range
          </text>
        </>
      )}
    </svg>
  );
}
