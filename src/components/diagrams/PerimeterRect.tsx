/**
 * PerimeterRect — Rectangle with labeled sides showing perimeter calculation
 * Covers: PERIMETER type (Y7 Unit 5: fortress walls)
 */

type Props = {
  length: number;
  width: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: '#2980b9',
  red: '#c0392b',
  fill: 'rgba(41,128,185,0.1)',
};

export function PerimeterRect({ length, width }: Props) {
  const W = 260;
  const H = 150;
  const rw = 160;
  const rh = 80;
  const rx = (W - rw) / 2;
  const ry = 25;
  const perimeter = 2 * (length + width);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Rectangle ${length} x ${width}, P=${perimeter}`}>
      {/* Rectangle with dashed border to show "walking around" */}
      <rect x={rx} y={ry} width={rw} height={rh} fill={COLORS.fill} stroke={COLORS.blue} strokeWidth={2.5}
        strokeDasharray="8,4" rx={2} />

      {/* Top label (length) */}
      <text x={rx + rw / 2} y={ry - 6} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.red}>{length}</text>

      {/* Bottom label (length) */}
      <text x={rx + rw / 2} y={ry + rh + 16} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.red}>{length}</text>

      {/* Left label (width) */}
      <text x={rx - 10} y={ry + rh / 2 + 4} textAnchor="end" fontSize={13} fontWeight="bold" fill={COLORS.blue}>{width}</text>

      {/* Right label (width) */}
      <text x={rx + rw + 10} y={ry + rh / 2 + 4} textAnchor="start" fontSize={13} fontWeight="bold" fill={COLORS.blue}>{width}</text>

      {/* Direction arrows at corners */}
      {[[rx, ry], [rx + rw, ry], [rx + rw, ry + rh], [rx, ry + rh]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill={COLORS.gold} />
      ))}

      {/* Formula */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.gold}>
        P = 2({length} + {width}) = {perimeter}
      </text>
    </svg>
  );
}
