/**
 * RatioBar — Horizontal bar split into two colored segments proportional to a:b ratio.
 * Covers: RATIO_Y7_RANDOM, RATIO_RANDOM (Y7/Y8 ratio questions)
 */

type Props = {
  a: number;
  b: number;
  total?: number;
  knownValue?: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  fill1: '#8b0000',
  fill2: '#1a3a5c',
  result: '#2d6a2e',
  empty: '#f4e4bc',
};

export function RatioBar({ a, b, total, knownValue }: Props) {
  const W = 260;
  const H = 80;
  const barX = 30;
  const barW = 200;
  const barH = 28;
  const barY = 22;

  const sum = a + b;
  const leftW = Math.round(barW * (a / sum));
  const rightW = barW - leftW;

  const leftVal = total !== undefined ? Math.round(total * a / sum) : knownValue;
  const rightVal = total !== undefined ? Math.round(total * b / sum) : undefined;

  const leftLabel = leftVal !== undefined ? String(leftVal) : String(a);
  const rightLabel = knownValue !== undefined && rightVal === undefined ? '?' : (rightVal !== undefined ? String(rightVal) : String(b));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Ratio ${a}:${b}`}>
      {/* Background */}
      <rect x={barX} y={barY} width={barW} height={barH} fill={COLORS.empty} stroke={COLORS.wood} strokeWidth={1} rx={4} />

      {/* Left segment */}
      <rect x={barX} y={barY} width={leftW} height={barH} fill={COLORS.fill1} opacity={0.7} rx={4} />

      {/* Right segment */}
      <rect x={barX + leftW} y={barY} width={rightW} height={barH} fill={COLORS.fill2} opacity={0.7}
        rx={rightW === barW ? 4 : 0} />
      {/* Right rounded corner patch */}
      <rect x={barX + barW - 4} y={barY} width={4} height={barH} fill={COLORS.fill2} opacity={0.7} rx={4} />

      {/* Labels above segments */}
      <text x={barX + leftW / 2} y={barY - 5} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill1}>
        {leftLabel}
      </text>
      <text x={barX + leftW + rightW / 2} y={barY - 5} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill2}>
        {rightLabel}
      </text>

      {/* Inner segment labels */}
      <text x={barX + leftW / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#fff">
        {a}
      </text>
      <text x={barX + leftW + rightW / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#fff">
        {b}
      </text>

      {/* Divider line */}
      <line x1={barX + leftW} y1={barY} x2={barX + leftW} y2={barY + barH} stroke={COLORS.wood} strokeWidth={1.5} />

      {/* Ratio text below */}
      <text x={W / 2} y={barY + barH + 18} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
        {a} : {b}
      </text>
    </svg>
  );
}
