/**
 * SimplifyFlow — Before/after algebraic simplification flow.
 * Covers: SIMPLIFY_RANDOM (Y7/Y8 collecting like terms)
 */

type Props = {
  expr: string;
  simplified: string;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  green: '#2d6a2e',
  empty: '#f4e4bc',
};

export function SimplifyFlow({ expr, simplified }: Props) {
  const W = 280;
  const H = 60;

  const boxW = 90;
  const boxH = 30;
  const boxY = 10;
  const gap = 60;
  const startX = (W - boxW * 2 - gap) / 2;
  const box1X = startX;
  const box2X = startX + boxW + gap;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Simplify ${expr} to ${simplified}`}>
      {/* Background */}
      <rect x={4} y={2} width={W - 8} height={H - 4} fill={COLORS.empty} rx={6} stroke={COLORS.wood} strokeWidth={1} opacity={0.4} />

      {/* Box 1: Original expression */}
      <rect x={box1X} y={boxY} width={boxW} height={boxH} fill="rgba(139,0,0,0.08)" stroke={COLORS.red} strokeWidth={1.5} rx={6} />
      <text x={box1X + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.red}>
        {expr.length > 14 ? expr.slice(0, 14) : expr}
      </text>

      {/* Arrow with label */}
      <defs>
        <marker id="simp-arrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.wood} />
        </marker>
      </defs>
      <line
        x1={box1X + boxW + 4} y1={boxY + boxH / 2}
        x2={box2X - 4} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={1.5} markerEnd="url(#simp-arrow)"
      />
      <text x={(box1X + boxW + box2X) / 2} y={boxY + boxH / 2 - 6} textAnchor="middle" fontSize={7} fill={COLORS.gold} fontWeight="bold">
        collect like terms
      </text>

      {/* Box 2: Simplified */}
      <rect x={box2X} y={boxY} width={boxW} height={boxH} fill="rgba(45,106,46,0.08)" stroke={COLORS.green} strokeWidth={2} rx={6} />
      <text x={box2X + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.green}>
        {simplified}
      </text>

      {/* Bottom label */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.gold}>
        Simplify
      </text>
    </svg>
  );
}
