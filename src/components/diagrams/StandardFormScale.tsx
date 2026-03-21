/**
 * StandardFormScale — Powers of 10 number line for standard form
 * Covers: STD_FORM type (Y8 Unit 7: march logistics)
 * Shows number placed on logarithmic scale with a × 10^n notation
 */

type Props = {
  number: number;
  a: number;   // coefficient (1 ≤ a < 10)
  n: number;   // power of 10
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#c0392b',
  blue: '#2980b9',
  bg: 'rgba(184,134,11,0.06)',
  tick: 'rgba(61,43,31,0.3)',
};

export function StandardFormScale({ number: num, a, n }: Props) {
  const W = 270;
  const H = 140;
  const lineY = 70;
  const lineX1 = 30;
  const lineX2 = W - 20;
  const lineW = lineX2 - lineX1;

  // Show powers from n-2 to n+2
  const pMin = Math.max(0, n - 2);
  const pMax = n + 2;
  const pRange = pMax - pMin;

  const toX = (p: number) => lineX1 + ((p - pMin) / pRange) * lineW;

  // Position of the actual number on the scale
  const numPos = n + Math.log10(a);
  const numX = lineX1 + ((numPos - pMin) / pRange) * lineW;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${num} = ${a} × 10^${n}`}>
      <rect x={lineX1 - 5} y={20} width={lineW + 10} height={H - 30} fill={COLORS.bg} rx={4} />

      {/* Number line */}
      <line x1={lineX1} y1={lineY} x2={lineX2} y2={lineY} stroke={COLORS.wood} strokeWidth={1.5} />

      {/* Power of 10 ticks */}
      {Array.from({ length: pRange + 1 }, (_, i) => {
        const p = pMin + i;
        const x = toX(p);
        const val = Math.pow(10, p);
        const isTarget = p === n;
        return (
          <g key={p}>
            <line x1={x} y1={lineY - 8} x2={x} y2={lineY + 8} stroke={isTarget ? COLORS.red : COLORS.tick} strokeWidth={isTarget ? 2 : 1} />
            <text x={x} y={lineY + 22} textAnchor="middle" fontSize={9} fontWeight={isTarget ? 'bold' : 'normal'} fill={isTarget ? COLORS.red : COLORS.wood}>
              10{String.fromCodePoint(0x2070 + p)}
            </text>
            <text x={x} y={lineY + 34} textAnchor="middle" fontSize={8} fill={COLORS.wood}>
              {val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}K` : val}
            </text>
          </g>
        );
      })}

      {/* Number marker */}
      <circle cx={numX} cy={lineY} r={5} fill={COLORS.blue} stroke="white" strokeWidth={2} />
      <line x1={numX} y1={lineY - 5} x2={numX} y2={25} stroke={COLORS.blue} strokeWidth={1} strokeDasharray="3,2" />
      <text x={numX} y={20} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.blue}>
        {num.toLocaleString()}
      </text>

      {/* Standard form notation */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
        {a} x 10^{n}
      </text>
    </svg>
  );
}
