/**
 * FDPTriangle — Three-column layout showing fraction/decimal/percentage equivalence.
 * Covers: FDP_CONVERT_RANDOM (Y7/Y8 number conversions)
 */

type Props = {
  num: number;
  den: number;
  dec: number;
  pct: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  blue: '#1a3a5c',
  green: '#2d6a2e',
  empty: '#f4e4bc',
};

export function FDPTriangle({ num, den, dec, pct }: Props) {
  const W = 280;
  const H = 90;

  const boxW = 64;
  const boxH = 44;
  const boxY = 18;
  const gap = 18;
  const totalW = boxW * 3 + gap * 2;
  const startX = (W - totalW) / 2;

  const box1X = startX;
  const box2X = startX + boxW + gap;
  const box3X = startX + (boxW + gap) * 2;

  // Fraction midpoint for drawing the fraction bar
  const fracCx = box1X + boxW / 2;
  const fracCy = boxY + boxH / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${num}/${den} = ${dec} = ${pct}%`}>
      {/* Background */}
      <rect x={4} y={4} width={W - 8} height={H - 8} fill={COLORS.empty} rx={6} stroke={COLORS.wood} strokeWidth={1} opacity={0.4} />

      {/* Box 1: Fraction */}
      <rect x={box1X} y={boxY} width={boxW} height={boxH} fill="rgba(139,0,0,0.08)" stroke={COLORS.red} strokeWidth={1.5} rx={6} />
      <text x={box1X + boxW / 2} y={boxY - 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.red}>Fraction</text>
      {/* Numerator */}
      <text x={fracCx} y={fracCy - 4} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.red}>
        {num}
      </text>
      {/* Fraction bar */}
      <line x1={fracCx - 16} y1={fracCy + 1} x2={fracCx + 16} y2={fracCy + 1} stroke={COLORS.red} strokeWidth={1.5} />
      {/* Denominator */}
      <text x={fracCx} y={fracCy + 14} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.red}>
        {den}
      </text>

      {/* Arrow 1: fraction → decimal */}
      <line x1={box1X + boxW + 2} y1={boxY + boxH / 2} x2={box2X - 2} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={1.5} markerEnd="url(#fdp-arrow)" />
      <text x={box1X + boxW + gap / 2 + 1} y={boxY + boxH / 2 - 5} textAnchor="middle" fontSize={8} fill={COLORS.wood}>
        ÷
      </text>

      {/* Box 2: Decimal */}
      <rect x={box2X} y={boxY} width={boxW} height={boxH} fill="rgba(26,58,92,0.08)" stroke={COLORS.blue} strokeWidth={1.5} rx={6} />
      <text x={box2X + boxW / 2} y={boxY - 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.blue}>Decimal</text>
      <text x={box2X + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.blue}>
        {dec}
      </text>

      {/* Arrow 2: decimal → percentage */}
      <line x1={box2X + boxW + 2} y1={boxY + boxH / 2} x2={box3X - 2} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={1.5} markerEnd="url(#fdp-arrow)" />
      <text x={box2X + boxW + gap / 2 + 1} y={boxY + boxH / 2 - 5} textAnchor="middle" fontSize={8} fill={COLORS.wood}>
        ×100
      </text>

      {/* Box 3: Percentage */}
      <rect x={box3X} y={boxY} width={boxW} height={boxH} fill="rgba(45,106,46,0.08)" stroke={COLORS.green} strokeWidth={1.5} rx={6} />
      <text x={box3X + boxW / 2} y={boxY - 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.green}>Percentage</text>
      <text x={box3X + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.green}>
        {pct}%
      </text>

      {/* Arrow marker */}
      <defs>
        <marker id="fdp-arrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.wood} />
        </marker>
      </defs>
    </svg>
  );
}
