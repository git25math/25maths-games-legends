/**
 * ProbabilityBar — Simple probability visualization
 * Shows target/total as colored segments, or p1*p2 for independent events
 */

type SimpleProps = { mode: 'simple'; target: number; total: number };
type IndProps = { mode: 'independent'; p1: number; p2: number };
type Props = SimpleProps | IndProps;

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  target: '#27ae60',
  miss: '#e0d5c0',
  stroke: '#3d2b1f',
  p1: '#2980b9',
  p2: '#c0392b',
};

export function ProbabilityBar(props: Props) {
  const W = 260;
  const H = props.mode === 'independent' ? 140 : 100;

  if (props.mode === 'simple') {
    const { target, total } = props;
    const barW = 200;
    const barH = 28;
    const bx = (W - barW) / 2;
    const by = 20;
    const targetW = (target / total) * barW;
    const p = target / total;
    const pDisplay = Number.isInteger(p * 100) ? `${p * 100}%` : `${target}/${total}`;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Probability ${target}/${total}`}>
        {/* Background bar */}
        <rect x={bx} y={by} width={barW} height={barH} rx={4} fill={COLORS.miss} stroke={COLORS.stroke} strokeWidth={1.5} />
        {/* Target segment */}
        <rect x={bx} y={by} width={targetW} height={barH} rx={4} fill={COLORS.target} opacity={0.7} />
        {/* Fix right corner when target < total */}
        {target < total && <rect x={bx + targetW - 4} y={by} width={4} height={barH} fill={COLORS.target} opacity={0.7} />}
        {/* Divider lines */}
        {Array.from({ length: total - 1 }, (_, i) => {
          const x = bx + ((i + 1) / total) * barW;
          return <line key={i} x1={x} y1={by} x2={x} y2={by + barH} stroke={COLORS.stroke} strokeWidth={0.5} opacity={0.4} />;
        })}
        {/* Labels */}
        <text x={bx + targetW / 2} y={by + barH / 2 + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="white">{target}</text>
        <text x={bx + targetW + (barW - targetW) / 2} y={by + barH / 2 + 4} textAnchor="middle" fontSize={10} fill={COLORS.wood}>{total - target}</text>
        {/* Bottom labels */}
        <text x={W / 2} y={by + barH + 18} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.gold}>
          P = {target}/{total} = {pDisplay}
        </text>
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={COLORS.wood}>
          {target} favorable / {total} total
        </text>
      </svg>
    );
  }

  // Independent events: show two bars and multiplication
  const { p1, p2 } = props;
  const product = p1 * p2;
  const barW = 90;
  const barH = 20;
  const y1 = 15;
  const y2 = 50;
  const yResult = 90;

  const drawBar = (x: number, y: number, pct: number, color: string, label: string) => (
    <>
      <rect x={x} y={y} width={barW} height={barH} rx={3} fill={COLORS.miss} stroke={COLORS.stroke} strokeWidth={1} />
      <rect x={x} y={y} width={barW * pct} height={barH} rx={3} fill={color} opacity={0.6} />
      <text x={x + barW + 6} y={y + barH / 2 + 4} fontSize={10} fontWeight="bold" fill={color}>{label}</text>
    </>
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`P(A∩B) = ${p1} × ${p2}`}>
      <text x={20} y={y1 + barH / 2 + 4} fontSize={10} fontWeight="bold" fill={COLORS.wood}>P(A)</text>
      {drawBar(50, y1, p1, COLORS.p1, `${Math.round(p1 * 100)}%`)}

      <text x={20} y={y2 + barH / 2 + 4} fontSize={10} fontWeight="bold" fill={COLORS.wood}>P(B)</text>
      {drawBar(50, y2, p2, COLORS.p2, `${Math.round(p2 * 100)}%`)}

      {/* Multiplication sign */}
      <text x={W / 2} y={80} textAnchor="middle" fontSize={11} fill={COLORS.wood}>×</text>

      <text x={20} y={yResult + barH / 2 + 4} fontSize={10} fontWeight="bold" fill={COLORS.wood}>P(A∩B)</text>
      {drawBar(50, yResult, product, COLORS.gold, `${Math.round(product * 10000) / 100}%`)}

      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.gold}>
        = {Math.round(product * 10000) / 10000}
      </text>
    </svg>
  );
}
