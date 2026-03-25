/**
 * ParallelTransversal — geometrically accurate parallel lines + transversal
 * KP: 4.6-04
 *
 * The transversal crosses both parallel lines at the correct angle.
 * ix2 is computed from the angle and line gap (not hardcoded to midX).
 *
 * Angle regions at each intersection (for angle=θ, rightward = 0° CW):
 *   Region A (upper-right) = θ          Region B (upper-left) = 180°-θ
 *   Region C (lower-left)  = θ          Region D (lower-right) = 180°-θ
 *
 * Interior = between the parallel lines:
 *   At line1: below → C, D            At line2: above → A, B
 *
 * Corresponding (F): A@line1 ↔ A@line2 (same position, equal)
 * Alternate interior (Z): C@line1 ↔ A@line2 (opposite sides, interior, equal)
 * Co-interior (C): C@line1 ↔ B@line2 (same side=left, interior, sum=180°)
 */

type AngleHighlight = 'corresponding' | 'alternate' | 'cointerior';

type Props = {
  angle?: number;
  highlight?: AngleHighlight;
  showLabels?: boolean;
  interactive?: boolean;
};

const COLORS = {
  wood: '#3d2b1f',
  red: '#8b0000',
  blue: '#1a3a5c',
  green: '#2d6a2e',
  gold: '#b8860b',
};

const HL_COLORS: Record<AngleHighlight, string> = {
  corresponding: COLORS.red,
  alternate: COLORS.blue,
  cointerior: COLORS.green,
};

export function ParallelTransversal({ angle = 60, highlight, showLabels = true }: Props) {
  const width = 300;
  const height = 260;
  const lineStartX = 20;
  const lineLen = 260;
  const line1Y = 85;
  const line2Y = 185;
  const rad = (angle * Math.PI) / 180;
  const arcR = 24;
  const givenColor = highlight ? HL_COLORS[highlight] : COLORS.red;
  const unknownColor = '#d4a017';

  // ── Intersection points ──
  // Transversal goes from upper-right to lower-left at the given angle
  const ix1 = 175;
  const gap = line2Y - line1Y;
  const ix2 = ix1 - gap / Math.tan(rad);

  // Extend transversal beyond both intersections
  const ext = 35;
  const txTopX = ix1 + ext * Math.cos(rad);
  const txTopY = line1Y - ext * Math.sin(rad);
  const txBotX = ix2 - ext * Math.cos(rad);
  const txBotY = line2Y + ext * Math.sin(rad);

  // ── Direction unit vectors (SVG: y-down) ──
  const dR: [number, number] = [1, 0];                              // right →
  const dL: [number, number] = [-1, 0];                             // left ←
  const dUR: [number, number] = [Math.cos(rad), -Math.sin(rad)];    // up-right ↗ (along transversal)
  const dDL: [number, number] = [-Math.cos(rad), Math.sin(rad)];    // down-left ↙

  // ── Wedge helper: draws a filled angle sector ──
  // sweep: 0=CCW on screen, 1=CW on screen
  function wedge(
    cx: number, cy: number, d1: [number, number], d2: [number, number],
    sweep: 0 | 1, fill: string, opacity: number, dashed?: boolean,
  ) {
    const sx = cx + arcR * d1[0], sy = cy + arcR * d1[1];
    const ex = cx + arcR * d2[0], ey = cy + arcR * d2[1];
    return (
      <path
        d={`M${cx},${cy} L${sx},${sy} A${arcR},${arcR} 0 0,${sweep} ${ex},${ey} Z`}
        fill={fill} fillOpacity={opacity}
        stroke={fill} strokeWidth={dashed ? 2.5 : 2}
        strokeDasharray={dashed ? '4,3' : 'none'}
      />
    );
  }

  // ── Label position: midpoint of arc, pushed outward ──
  function labelPos(cx: number, cy: number, d1: [number, number], d2: [number, number], dist: number): [number, number] {
    const mx = (d1[0] + d2[0]) / 2;
    const my = (d1[1] + d2[1]) / 2;
    const len = Math.sqrt(mx * mx + my * my) || 1;
    return [cx + (mx / len) * dist, cy + (my / len) * dist];
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm mx-auto" role="img" aria-label="Parallel lines with transversal">
      {/* Parallel lines */}
      <line x1={lineStartX} y1={line1Y} x2={lineStartX + lineLen} y2={line1Y} stroke={COLORS.wood} strokeWidth={2} />
      <line x1={lineStartX} y1={line2Y} x2={lineStartX + lineLen} y2={line2Y} stroke={COLORS.wood} strokeWidth={2} />
      {/* Parallel arrows */}
      <text x={lineStartX + lineLen - 40} y={line1Y - 8} fontSize={10} fill={COLORS.wood}>{'\u25b8\u25b8'}</text>
      <text x={lineStartX + lineLen - 40} y={line2Y - 8} fontSize={10} fill={COLORS.wood}>{'\u25b8\u25b8'}</text>

      {/* Transversal — passes through both actual intersection points */}
      <line x1={txTopX} y1={txTopY} x2={txBotX} y2={txBotY} stroke={COLORS.gold} strokeWidth={2} />

      {/* ── CORRESPONDING (F-shape): Region A at both intersections ── */}
      {highlight === 'corresponding' && (
        <>
          {/* Given: Region A at line1 (upper-right, exterior) — dirR→dirUR CCW */}
          {wedge(ix1, line1Y, dR, dUR, 0, givenColor, 0.2)}
          {/* Unknown: Region A at line2 (upper-right, interior) — dirR→dirUR CCW */}
          {wedge(ix2, line2Y, dR, dUR, 0, unknownColor, 0.25, true)}
        </>
      )}

      {/* ── ALTERNATE INTERIOR (Z-shape): C@line1 ↔ A@line2 ── */}
      {highlight === 'alternate' && (
        <>
          {/* Given: Region C at line1 (lower-left, interior) — dirL→dirDL CCW */}
          {wedge(ix1, line1Y, dL, dDL, 0, givenColor, 0.2)}
          {/* Unknown: Region A at line2 (upper-right, interior) — dirR→dirUR CCW */}
          {wedge(ix2, line2Y, dR, dUR, 0, unknownColor, 0.25, true)}
        </>
      )}

      {/* ── CO-INTERIOR (C/U-shape): C@line1 ↔ B@line2, both left side ── */}
      {highlight === 'cointerior' && (
        <>
          {/* Given: Region C at line1 (lower-left, interior) — dirL→dirDL CCW */}
          {wedge(ix1, line1Y, dL, dDL, 0, givenColor, 0.2)}
          {/* Unknown: Region B at line2 (upper-left, interior) — dirUR→dirL CCW */}
          {wedge(ix2, line2Y, dUR, dL, 0, unknownColor, 0.25, true)}
        </>
      )}

      {/* ── Labels ── */}
      {showLabels && highlight === 'corresponding' && (() => {
        const [gx, gy] = labelPos(ix1, line1Y, dR, dUR, arcR + 12);
        const [ux, uy] = labelPos(ix2, line2Y, dR, dUR, arcR + 12);
        return (
          <>
            <text x={gx} y={gy} fontSize={13} fontWeight="bold" fill={givenColor} textAnchor="middle" dominantBaseline="central">{angle}{'\u00b0'}</text>
            <text x={ux} y={uy} fontSize={16} fontWeight="bold" fontStyle="italic" fill={unknownColor} textAnchor="middle" dominantBaseline="central">x</text>
          </>
        );
      })()}

      {showLabels && highlight === 'alternate' && (() => {
        const [gx, gy] = labelPos(ix1, line1Y, dL, dDL, arcR + 12);
        const [ux, uy] = labelPos(ix2, line2Y, dR, dUR, arcR + 12);
        return (
          <>
            <text x={gx} y={gy} fontSize={13} fontWeight="bold" fill={givenColor} textAnchor="middle" dominantBaseline="central">{angle}{'\u00b0'}</text>
            <text x={ux} y={uy} fontSize={16} fontWeight="bold" fontStyle="italic" fill={unknownColor} textAnchor="middle" dominantBaseline="central">x</text>
          </>
        );
      })()}

      {showLabels && highlight === 'cointerior' && (() => {
        const [gx, gy] = labelPos(ix1, line1Y, dL, dDL, arcR + 12);
        const [ux, uy] = labelPos(ix2, line2Y, dUR, dL, arcR + 14);
        return (
          <>
            <text x={gx} y={gy} fontSize={13} fontWeight="bold" fill={givenColor} textAnchor="middle" dominantBaseline="central">{angle}{'\u00b0'}</text>
            <text x={ux} y={uy} fontSize={16} fontWeight="bold" fontStyle="italic" fill={unknownColor} textAnchor="middle" dominantBaseline="central">x</text>
          </>
        );
      })()}

      {showLabels && !highlight && (
        <text x={ix1 + arcR + 8} y={line1Y - 6} fontSize={13} fontWeight="bold" fill={givenColor}>{angle}{'\u00b0'}</text>
      )}

      {/* Letter shape hint */}
      {highlight === 'corresponding' && <text x={8} y={20} fontSize={11} fill={givenColor} opacity={0.6}>F</text>}
      {highlight === 'alternate' && <text x={8} y={20} fontSize={11} fill={givenColor} opacity={0.6}>Z</text>}
      {highlight === 'cointerior' && <text x={8} y={20} fontSize={11} fill={givenColor} opacity={0.6}>C</text>}

      {/* Intersection dots */}
      <circle cx={ix1} cy={line1Y} r={3} fill={COLORS.wood} />
      <circle cx={ix2} cy={line2Y} r={3} fill={COLORS.wood} />
    </svg>
  );
}
