/**
 * SpeedTriangle — Distance/Speed/Time triangle diagram
 * The classic "cover one to find the formula" visual
 * Covers: SPEED type (Y8 Unit 7: march planning)
 */

type Props = {
  speed?: number;
  distance?: number;
  time?: number;
  mode: 'speed' | 'distance' | 'time'; // which one is unknown
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  blue: '#1a3a5c',
  unknown: '#ef4444',
  bg: 'rgba(184,134,11,0.06)',
};

export function SpeedTriangle({ speed, distance, time, mode }: Props) {
  const W = 260;
  const H = 200;
  const cx = W / 2;

  // Triangle vertices
  const topY = 30;
  const botY = 150;
  const leftX = 50;
  const rightX = W - 50;
  const midX = cx;

  // Dividing line (horizontal, splits D on top from S×T on bottom)
  const divY = 85;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label="Speed-Distance-Time triangle">
      {/* Outer triangle */}
      <polygon
        points={`${midX},${topY} ${leftX},${botY} ${rightX},${botY}`}
        fill={COLORS.bg}
        stroke={COLORS.wood}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Horizontal divider */}
      <line x1={leftX + 18} y1={divY} x2={rightX - 18} y2={divY} stroke={COLORS.wood} strokeWidth={1.5} />

      {/* Vertical divider in bottom half */}
      <line x1={cx} y1={divY} x2={cx} y2={botY - 8} stroke={COLORS.wood} strokeWidth={1.5} />

      {/* D (Distance) — top section */}
      <text
        x={cx} y={divY - 16}
        textAnchor="middle"
        fontSize={mode === 'distance' ? 20 : 16}
        fontWeight="bold"
        fill={mode === 'distance' ? COLORS.unknown : COLORS.gold}
      >
        {mode === 'distance' ? '?' : `D = ${distance}`}
      </text>
      <text x={cx} y={divY - 1} textAnchor="middle" fontSize={9} fill={COLORS.wood}>
        距离 Distance
      </text>

      {/* S (Speed) — bottom-left */}
      <text
        x={(leftX + cx) / 2 + 5} y={divY + 32}
        textAnchor="middle"
        fontSize={mode === 'speed' ? 18 : 14}
        fontWeight="bold"
        fill={mode === 'speed' ? COLORS.unknown : COLORS.blue}
      >
        {mode === 'speed' ? '?' : `S = ${speed}`}
      </text>
      <text x={(leftX + cx) / 2 + 5} y={divY + 47} textAnchor="middle" fontSize={9} fill={COLORS.wood}>
        速度 Speed
      </text>

      {/* × symbol */}
      <text x={cx} y={divY + 35} textAnchor="middle" fontSize={16} fontWeight="bold" fill={COLORS.wood}>×</text>

      {/* T (Time) — bottom-right */}
      <text
        x={(cx + rightX) / 2 - 5} y={divY + 32}
        textAnchor="middle"
        fontSize={mode === 'time' ? 18 : 14}
        fontWeight="bold"
        fill={mode === 'time' ? COLORS.unknown : COLORS.red}
      >
        {mode === 'time' ? '?' : `T = ${time}`}
      </text>
      <text x={(cx + rightX) / 2 - 5} y={divY + 47} textAnchor="middle" fontSize={9} fill={COLORS.wood}>
        时间 Time
      </text>

      {/* Formula reminder at bottom */}
      <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>
        {mode === 'distance' ? 'D = S × T' : mode === 'speed' ? 'S = D ÷ T' : 'T = D ÷ S'}
      </text>
    </svg>
  );
}
