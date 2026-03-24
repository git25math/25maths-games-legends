/**
 * AreaUnderCurve — Shows a curve with shaded area between lower and upper bounds.
 * Covers: INTEGRATION_RANDOM generator type
 */

type Props = {
  func: 'x' | '3x^2' | '2x';
  lower: number;
  upper: number;
  area: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: '#1a3a5c',
  green: '#2d6a2e',
  empty: '#f4e4bc',
};

function evaluate(func: Props['func'], x: number): number {
  switch (func) {
    case 'x': return x;
    case '2x': return 2 * x;
    case '3x^2': return 3 * x * x;
  }
}

function funcLabel(func: Props['func']): string {
  switch (func) {
    case 'x': return 'y = x';
    case '2x': return 'y = 2x';
    case '3x^2': return 'y = 3x²';
  }
}

export function AreaUnderCurve({ func, lower, upper, area }: Props) {
  const W = 280;
  const H = 200;

  // x-range with padding
  const xMin = Math.min(lower - 1, -1);
  const xMax = Math.max(upper + 1, upper + 1);

  // Sample curve for y-range
  const N = 40;
  const step = (xMax - xMin) / N;
  const yVals: number[] = [0];
  for (let i = 0; i <= N; i++) {
    const xi = xMin + i * step;
    yVals.push(evaluate(func, xi));
  }
  const yMin = Math.min(...yVals) - 1;
  const yMax = Math.max(...yVals) + 1;

  // Map math → SVG
  const toSvgX = (v: number) => 20 + ((v - xMin) / (xMax - xMin)) * (W - 40);
  const toSvgY = (v: number) => H - 20 - ((v - yMin) / (yMax - yMin)) * (H - 40);

  // Curve polyline
  const curvePts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const xi = xMin + i * step;
    curvePts.push(`${toSvgX(xi).toFixed(1)},${toSvgY(evaluate(func, xi)).toFixed(1)}`);
  }

  // Shaded region polygon: (lower,0) → curve points in [lower,upper] → (upper,0)
  const shadeSamples = 30;
  const shadeStep = (upper - lower) / shadeSamples;
  let shadePts = `${toSvgX(lower).toFixed(1)},${toSvgY(0).toFixed(1)}`;
  for (let i = 0; i <= shadeSamples; i++) {
    const xi = lower + i * shadeStep;
    shadePts += ` ${toSvgX(xi).toFixed(1)},${toSvgY(evaluate(func, xi)).toFixed(1)}`;
  }
  shadePts += ` ${toSvgX(upper).toFixed(1)},${toSvgY(0).toFixed(1)}`;

  // Axis positions
  const axisY = toSvgY(0);
  const axisX = toSvgX(0);

  // Area label position (center of shaded region)
  const midX = (lower + upper) / 2;
  const midY = evaluate(func, midX) / 2;

  // Compute area if not provided
  const displayArea = area !== 0 ? area : computeArea(func, lower, upper);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Area under ${funcLabel(func)} from ${lower} to ${upper}`}>
      {/* Background */}
      <rect width={W} height={H} fill={COLORS.empty} rx={8} />

      {/* Axes */}
      <line x1={20} y1={axisY} x2={W - 20} y2={axisY} stroke={COLORS.wood} strokeWidth={1.2} />
      <line x1={axisX} y1={20} x2={axisX} y2={H - 20} stroke={COLORS.wood} strokeWidth={1.2} />

      {/* Axis labels */}
      <text x={W - 16} y={axisY - 4} fontSize={10} fill={COLORS.wood}>x</text>
      <text x={axisX + 4} y={16} fontSize={10} fill={COLORS.wood}>y</text>

      {/* Shaded region */}
      <polygon points={shadePts} fill="rgba(45,106,46,0.25)" stroke={COLORS.green} strokeWidth={1} />

      {/* Curve */}
      <polyline points={curvePts.join(' ')} fill="none" stroke={COLORS.blue} strokeWidth={2} />

      {/* Bound markers */}
      <line x1={toSvgX(lower)} y1={axisY - 4} x2={toSvgX(lower)} y2={axisY + 4} stroke={COLORS.wood} strokeWidth={2} />
      <line x1={toSvgX(upper)} y1={axisY - 4} x2={toSvgX(upper)} y2={axisY + 4} stroke={COLORS.wood} strokeWidth={2} />
      <text x={toSvgX(lower)} y={axisY + 16} textAnchor="middle" fontSize={9} fill={COLORS.wood}>{lower}</text>
      <text x={toSvgX(upper)} y={axisY + 16} textAnchor="middle" fontSize={9} fill={COLORS.wood}>{upper}</text>

      {/* Area label */}
      <text x={toSvgX(midX)} y={toSvgY(midY)} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.green}>
        {displayArea}
      </text>

      {/* Function label */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={COLORS.gold} fontWeight="bold">
        {funcLabel(func)}
      </text>
    </svg>
  );
}

function computeArea(func: Props['func'], lower: number, upper: number): number {
  // Simple exact integration
  switch (func) {
    case 'x': return Math.round(((upper * upper - lower * lower) / 2) * 100) / 100;
    case '2x': return Math.round((upper * upper - lower * lower) * 100) / 100;
    case '3x^2': return Math.round((upper * upper * upper - lower * lower * lower) * 100) / 100;
  }
}
