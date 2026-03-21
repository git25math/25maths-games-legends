/**
 * AreaShape — Rectangle or Trapezium area diagram
 * Covers: AREA type (Y8 Unit 3: fortress building)
 * Shows dimensioned shape with area formula
 */

type RectProps = { shape: 'rect'; length: number; width: number };
type TrapProps = { shape: 'trap'; a: number; b: number; h: number };
type Props = RectProps | TrapProps;

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  fill: 'rgba(41,128,185,0.15)',
  stroke: '#2980b9',
  dim: '#c0392b',
};

export function AreaShape(props: Props) {
  const W = 260;
  const H = 180;

  if (props.shape === 'rect') {
    const { length, width } = props;
    const area = length * width;
    // Draw centered rectangle
    const rw = 160;
    const rh = 100;
    const rx = (W - rw) / 2;
    const ry = 25;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Rectangle ${length} x ${width}`}>
        <rect x={rx} y={ry} width={rw} height={rh} fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth={2} rx={2} />

        {/* Width label (top) */}
        <line x1={rx} y1={ry - 8} x2={rx + rw} y2={ry - 8} stroke={COLORS.dim} strokeWidth={1} />
        <text x={rx + rw / 2} y={ry - 12} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.dim}>{length}</text>

        {/* Height label (right) */}
        <line x1={rx + rw + 8} y1={ry} x2={rx + rw + 8} y2={ry + rh} stroke={COLORS.dim} strokeWidth={1} />
        <text x={rx + rw + 14} y={ry + rh / 2 + 4} fontSize={12} fontWeight="bold" fill={COLORS.dim}>{width}</text>

        {/* Area in center */}
        <text x={rx + rw / 2} y={ry + rh / 2 - 4} textAnchor="middle" fontSize={11} fill={COLORS.wood}>Area = {length} x {width}</text>
        <text x={rx + rw / 2} y={ry + rh / 2 + 14} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.gold}>= {area}</text>

        {/* Formula */}
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>A = l x w</text>
      </svg>
    );
  }

  // Trapezium
  const { a, b, h } = props;
  const area = ((a + b) * h) / 2;

  // Draw trapezium centered
  const topW = 80;
  const botW = 160;
  const trapH = 100;
  const topX = (W - topW) / 2;
  const botX = (W - botW) / 2;
  const topY = 25;
  const botY = topY + trapH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Trapezium a=${a} b=${b} h=${h}`}>
      <polygon
        points={`${topX},${topY} ${topX + topW},${topY} ${botX + botW},${botY} ${botX},${botY}`}
        fill={COLORS.fill}
        stroke={COLORS.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Top side label (a) */}
      <text x={W / 2} y={topY - 6} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.dim}>a = {a}</text>

      {/* Bottom side label (b) */}
      <text x={W / 2} y={botY + 16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.dim}>b = {b}</text>

      {/* Height label */}
      <line x1={topX - 12} y1={topY} x2={topX - 12} y2={botY} stroke={COLORS.dim} strokeWidth={1} strokeDasharray="4,2" />
      <text x={topX - 18} y={(topY + botY) / 2 + 4} textAnchor="end" fontSize={12} fontWeight="bold" fill={COLORS.dim}>h = {h}</text>

      {/* Area */}
      <text x={W / 2} y={(topY + botY) / 2 + 4} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>= {area}</text>

      {/* Formula */}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.wood}>
        A = (a + b) x h / 2
      </text>
    </svg>
  );
}
