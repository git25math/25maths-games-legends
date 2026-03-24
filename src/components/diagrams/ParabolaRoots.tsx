/**
 * ParabolaRoots — Shows a parabola y = ax² + bx + c with x-axis crossing points (roots) marked.
 * Covers: ROOTS_RANDOM generator type
 */

type Props = { a: number; b: number; c: number };

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  blue: '#1a3a5c',
  empty: '#f4e4bc',
};

export function ParabolaRoots({ a, b, c }: Props) {
  const W = 280;
  const H = 200;
  const cx = W / 2;
  const cy = H / 2;

  // Vertex
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;

  // Roots
  const disc = b * b - 4 * a * c;
  const r1 = disc >= 0 ? (-b + Math.sqrt(disc)) / (2 * a) : undefined;
  const r2 = disc >= 0 ? (-b - Math.sqrt(disc)) / (2 * a) : undefined;

  // Determine x-range: include roots + vertex with padding
  const xPoints = [vx];
  if (r1 !== undefined) xPoints.push(r1);
  if (r2 !== undefined) xPoints.push(r2);
  const xMin = Math.min(...xPoints) - 2;
  const xMax = Math.max(...xPoints) + 2;

  // y-range: sample the curve to find extremes
  const N = 40;
  const step = (xMax - xMin) / N;
  const yVals: number[] = [];
  for (let i = 0; i <= N; i++) {
    const xi = xMin + i * step;
    yVals.push(a * xi * xi + b * xi + c);
  }
  const yMinVal = Math.min(...yVals, 0);
  const yMaxVal = Math.max(...yVals, 0);
  const pad = 1;

  // Map math → SVG
  const scaleX = (W - 40) / (xMax - xMin);
  const scaleY = (H - 40) / ((yMaxVal + pad) - (yMinVal - pad));
  const toSvgX = (x: number) => 20 + (x - xMin) * scaleX;
  const toSvgY = (y: number) => H - 20 - (y - (yMinVal - pad)) * scaleY;

  // Parabola polyline
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const xi = xMin + i * step;
    const yi = a * xi * xi + b * xi + c;
    pts.push(`${toSvgX(xi).toFixed(1)},${toSvgY(yi).toFixed(1)}`);
  }

  // Axis positions in SVG
  const axisY = toSvgY(0);
  const axisX = toSvgX(0);

  const rootLabel = (val: number) => {
    const rounded = Math.round(val * 10) / 10;
    return rounded === Math.round(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Parabola y = ${a}x² + ${b}x + ${c} with roots`}>
      {/* Background */}
      <rect width={W} height={H} fill={COLORS.empty} rx={8} />

      {/* Axes */}
      <line x1={20} y1={axisY} x2={W - 20} y2={axisY} stroke={COLORS.wood} strokeWidth={1.2} />
      <line x1={axisX} y1={20} x2={axisX} y2={H - 20} stroke={COLORS.wood} strokeWidth={1.2} />

      {/* Axis labels */}
      <text x={W - 16} y={axisY - 4} fontSize={10} fill={COLORS.wood}>x</text>
      <text x={axisX + 4} y={16} fontSize={10} fill={COLORS.wood}>y</text>

      {/* Parabola */}
      <polyline points={pts.join(' ')} fill="none" stroke={COLORS.blue} strokeWidth={2} />

      {/* Root markers */}
      {r1 !== undefined && (
        <>
          <circle cx={toSvgX(r1)} cy={axisY} r={5} fill={COLORS.red} />
          <text x={toSvgX(r1)} y={axisY + 16} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.red}>
            x₁={rootLabel(r1)}
          </text>
        </>
      )}
      {r2 !== undefined && Math.abs(r1! - r2) > 0.01 && (
        <>
          <circle cx={toSvgX(r2)} cy={axisY} r={5} fill={COLORS.red} />
          <text x={toSvgX(r2)} y={axisY + 16} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.red}>
            x₂={rootLabel(r2)}
          </text>
        </>
      )}

      {/* Equation label */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={COLORS.gold} fontWeight="bold">
        y = {a === 1 ? '' : a === -1 ? '-' : a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
      </text>
    </svg>
  );
}
