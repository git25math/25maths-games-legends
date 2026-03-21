/**
 * ArithmeticSequence — Number line showing equal jumps
 * Covers: ARITHMETIC type (Y7/Y8: sequence patterns)
 * Shows a1, a1+d, a1+2d... with arrows between terms
 */

type Props = {
  a1: number;
  d: number;
  n: number; // how many terms to show (capped at 6 for display)
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: '#2980b9',
  red: '#c0392b',
  bg: 'rgba(184,134,11,0.06)',
};

export function ArithmeticSequence({ a1, d, n }: Props) {
  const W = 280;
  const H = 120;
  const show = Math.min(n, 6);
  const marginL = 20;
  const marginR = 20;
  const lineY = 55;
  const plotW = W - marginL - marginR;

  const terms = Array.from({ length: show }, (_, i) => a1 + i * d);
  const spacing = plotW / (show - 1 || 1);

  const toX = (i: number) => marginL + i * spacing;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Arithmetic sequence: a1=${a1}, d=${d}`}>
      <rect x={5} y={10} width={W - 10} height={H - 20} fill={COLORS.bg} rx={6} />

      {/* Term dots and labels */}
      {terms.map((t, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={lineY} r={14} fill="white" stroke={i === 0 ? COLORS.blue : COLORS.wood} strokeWidth={2} />
          <text x={toX(i)} y={lineY + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>{t}</text>
          {/* Term index */}
          <text x={toX(i)} y={lineY + 30} textAnchor="middle" fontSize={8} fill={COLORS.wood}>a{i + 1}</text>
        </g>
      ))}

      {/* Jump arrows with +d */}
      {terms.slice(0, -1).map((_, i) => {
        const x1 = toX(i) + 15;
        const x2 = toX(i + 1) - 15;
        const arcY = lineY - 25;
        return (
          <g key={`a${i}`}>
            <path d={`M${x1},${lineY - 14} Q${(x1 + x2) / 2},${arcY} ${x2},${lineY - 14}`}
              fill="none" stroke={COLORS.red} strokeWidth={1.5} markerEnd="url(#seq-arrow)" />
            <text x={(x1 + x2) / 2} y={arcY - 2} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.red}>
              +{d}
            </text>
          </g>
        );
      })}

      {n > 6 && (
        <text x={W - 15} y={lineY + 5} fontSize={14} fill={COLORS.wood}>...</text>
      )}

      <defs>
        <marker id="seq-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={COLORS.red} />
        </marker>
      </defs>

      {/* Formula */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.gold}>
        an = {a1} + (n-1) x {d}
      </text>
    </svg>
  );
}
