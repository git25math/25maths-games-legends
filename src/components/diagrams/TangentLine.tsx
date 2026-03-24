/**
 * TangentLine — Shows y = x² parabola with a tangent line at point (x, x²).
 * Covers: DERIVATIVE_RANDOM generator type
 */

type Props = { x: number; slope: number };

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  blue: '#1a3a5c',
  green: '#2d6a2e',
  empty: '#f4e4bc',
};

export function TangentLine({ x, slope }: Props) {
  const W = 280;
  const H = 200;

  // Point of tangency
  const px = x;
  const py = px * px;

  // x-range: center around tangent point, at least [-3, 3]
  const xMin = Math.min(-3, px - 3);
  const xMax = Math.max(3, px + 3);

  // Sample parabola to get y-range
  const N = 40;
  const step = (xMax - xMin) / N;
  const yVals: number[] = [0];
  for (let i = 0; i <= N; i++) {
    const xi = xMin + i * step;
    yVals.push(xi * xi);
  }
  // Also include tangent line endpoints
  const tExtend = 2;
  const tY1 = slope * (px - tExtend - px) + py;
  const tY2 = slope * (px + tExtend - px) + py;
  yVals.push(tY1, tY2);

  const yMin = Math.min(...yVals) - 1;
  const yMax = Math.max(...yVals) + 1;

  // Map math → SVG
  const toSvgX = (v: number) => 20 + ((v - xMin) / (xMax - xMin)) * (W - 40);
  const toSvgY = (v: number) => H - 20 - ((v - yMin) / (yMax - yMin)) * (H - 40);

  // Parabola polyline
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const xi = xMin + i * step;
    pts.push(`${toSvgX(xi).toFixed(1)},${toSvgY(xi * xi).toFixed(1)}`);
  }

  // Tangent line: y = slope * (t - px) + py
  const t1x = px - tExtend;
  const t1y = slope * (t1x - px) + py;
  const t2x = px + tExtend;
  const t2y = slope * (t2x - px) + py;

  // Axis positions
  const axisY = toSvgY(0);
  const axisX = toSvgX(0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Tangent to y=x² at x=${x}`}>
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

      {/* Tangent line */}
      <line
        x1={toSvgX(t1x)} y1={toSvgY(t1y)}
        x2={toSvgX(t2x)} y2={toSvgY(t2y)}
        stroke={COLORS.green} strokeWidth={2} strokeDasharray="6 3"
      />

      {/* Tangent point */}
      <circle cx={toSvgX(px)} cy={toSvgY(py)} r={5} fill={COLORS.red} />

      {/* Point label */}
      <text x={toSvgX(px) + 8} y={toSvgY(py) - 8} fontSize={9} fill={COLORS.red} fontWeight="bold">
        ({px}, {py})
      </text>

      {/* Slope label */}
      <text x={toSvgX(t2x) + 4} y={toSvgY(t2y) - 4} fontSize={10} fill={COLORS.green} fontWeight="bold">
        slope = {slope}
      </text>

      {/* Equation label */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={COLORS.gold} fontWeight="bold">
        y = x²
      </text>
    </svg>
  );
}
