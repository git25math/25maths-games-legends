/**
 * FactorPairsGrid — Shows factor pairs of a number n in a table layout.
 * Covers: FACTORS_LIST_RANDOM (Y7 number theory)
 */

type Props = {
  n: number;
  factors: number[];
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  blue: '#1a3a5c',
  green: '#2d6a2e',
  empty: '#f4e4bc',
};

export function FactorPairsGrid({ n, factors }: Props) {
  // Compute factor pairs
  const pairs: [number, number][] = [];
  for (const f of factors) {
    if (f * f <= n && n % f === 0) {
      pairs.push([f, n / f]);
    }
  }
  // Fallback: derive pairs from n directly if factors array is incomplete
  if (pairs.length === 0) {
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) pairs.push([i, n / i]);
    }
  }

  const rowH = 22;
  const headerH = 32;
  const footerH = 28;
  const H = headerH + pairs.length * rowH + footerH;
  const W = 260;

  const colLeftX = 50;
  const colMidX = 130;
  const colRightX = 210;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Factor pairs of ${n}`}>
      {/* Background */}
      <rect x={4} y={4} width={W - 8} height={H - 8} fill={COLORS.empty} rx={6} stroke={COLORS.wood} strokeWidth={1} opacity={0.5} />

      {/* Header */}
      <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
        Factor Pairs of {n}
      </text>

      {/* Rows */}
      {pairs.map(([a, b], i) => {
        const y = headerH + i * rowH + 16;
        return (
          <g key={i}>
            {/* Alternate row background */}
            {i % 2 === 0 && (
              <rect x={20} y={headerH + i * rowH + 2} width={W - 40} height={rowH} fill="rgba(184,134,11,0.08)" rx={3} />
            )}
            <text x={colLeftX} y={y} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.red}>
              {a}
            </text>
            <text x={colMidX} y={y} textAnchor="middle" fontSize={13} fill={COLORS.wood}>
              ×
            </text>
            <text x={colRightX - 40} y={y} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.blue}>
              {b}
            </text>
            <text x={colRightX} y={y} textAnchor="middle" fontSize={13} fill={COLORS.wood}>
              = {n}
            </text>
          </g>
        );
      })}

      {/* Footer */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.green}>
        Total: {factors.length} factors
      </text>
    </svg>
  );
}
