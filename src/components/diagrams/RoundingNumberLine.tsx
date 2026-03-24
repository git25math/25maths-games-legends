/**
 * RoundingNumberLine — Number line showing original value and its rounded boundaries.
 * Covers: ESTIMATION_ROUND_RANDOM (Y7/Y8 rounding questions)
 */

type Props = {
  n: number;
  place: number;
  answer: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  fill1: '#8b0000',
  result: '#2d6a2e',
  empty: '#f4e4bc',
};

export function RoundingNumberLine({ n, place, answer }: Props) {
  const W = 280;
  const H = 90;
  const lineY = 40;
  const lineX1 = 30;
  const lineX2 = 250;
  const lineW = lineX2 - lineX1;

  const lower = Math.floor(n / place) * place;
  const upper = lower + place;
  const range = upper - lower;

  const toX = (v: number) => lineX1 + ((v - lower) / range) * lineW;

  const nX = toX(n);
  const lowerX = lineX1;
  const upperX = lineX2;
  const ansX = toX(answer);

  const distLower = Math.abs(n - lower);
  const distUpper = Math.abs(upper - n);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Rounding ${n} to nearest ${place}`}>
      {/* Main line */}
      <line x1={lineX1} y1={lineY} x2={lineX2} y2={lineY} stroke={COLORS.wood} strokeWidth={2} />

      {/* Tick marks */}
      <line x1={lowerX} y1={lineY - 8} x2={lowerX} y2={lineY + 8} stroke={COLORS.wood} strokeWidth={2} />
      <line x1={upperX} y1={lineY - 8} x2={upperX} y2={lineY + 8} stroke={COLORS.wood} strokeWidth={2} />
      <line x1={nX} y1={lineY - 6} x2={nX} y2={lineY + 6} stroke={COLORS.fill1} strokeWidth={2} />

      {/* Boundary labels */}
      <text x={lowerX} y={lineY + 22} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>{lower}</text>
      <text x={upperX} y={lineY + 22} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>{upper}</text>

      {/* N label */}
      <text x={nX} y={lineY - 12} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill1}>{n}</text>

      {/* Distance labels */}
      <text x={(lowerX + nX) / 2} y={lineY - 20} textAnchor="middle" fontSize={9} fill={COLORS.wood}>{distLower}</text>
      <text x={(nX + upperX) / 2} y={lineY - 20} textAnchor="middle" fontSize={9} fill={COLORS.wood}>{distUpper}</text>

      {/* Arrow from n to answer */}
      <path
        d={`M ${nX} ${lineY + 28} Q ${(nX + ansX) / 2} ${lineY + 42} ${ansX} ${lineY + 28}`}
        fill="none" stroke={COLORS.result} strokeWidth={1.5}
        markerEnd="url(#arrowRound)"
      />
      <defs>
        <marker id="arrowRound" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.result} />
        </marker>
      </defs>

      {/* Answer circle */}
      <circle cx={ansX} y={lineY} cy={lineY} r={12} fill="none" stroke={COLORS.gold} strokeWidth={2} />
      <text x={ansX} y={lineY + 36 + 14} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.gold}>
        {answer}
      </text>
    </svg>
  );
}
