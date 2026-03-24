/**
 * MixedFractionPie — Shows whole pies + partial pie for mixed/improper fraction conversion.
 * Covers: MIXED_IMPROPER_RANDOM (Y7/Y8 fraction conversion)
 */

type Props = {
  whole: number;
  num: number;
  den: number;
  mode: 'to_improper' | 'to_mixed';
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  fill1: '#8b0000',
  fill2: '#1a3a5c',
  result: '#2d6a2e',
  empty: '#f4e4bc',
};

function PieSlice({ cx, cy, r, filled, total }: { cx: number; cy: number; r: number; filled: number; total: number }) {
  if (filled <= 0) {
    return <circle cx={cx} cy={cy} r={r} fill={COLORS.empty} stroke={COLORS.wood} strokeWidth={1.5} />;
  }

  if (filled >= total) {
    return <circle cx={cx} cy={cy} r={r} fill={COLORS.fill1} stroke={COLORS.wood} strokeWidth={1.5} opacity={0.8} />;
  }

  const slices: JSX.Element[] = [];
  // Draw background circle
  slices.push(<circle key="bg" cx={cx} cy={cy} r={r} fill={COLORS.empty} stroke={COLORS.wood} strokeWidth={1.5} />);

  // Draw filled arc
  const angle = (filled / total) * 2 * Math.PI;
  const startX = cx;
  const startY = cy - r;
  const endX = cx + r * Math.sin(angle);
  const endY = cy - r * Math.cos(angle);
  const largeArc = angle > Math.PI ? 1 : 0;

  const pathD = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;
  slices.push(<path key="fill" d={pathD} fill={COLORS.fill1} opacity={0.8} />);

  // Draw division lines
  for (let i = 0; i < total; i++) {
    const a = (i / total) * 2 * Math.PI - Math.PI / 2;
    const lx = cx + r * Math.cos(a);
    const ly = cy + r * Math.sin(a);
    slices.push(<line key={`div${i}`} x1={cx} y1={cy} x2={lx} y2={ly} stroke={COLORS.wood} strokeWidth={0.8} />);
  }

  // Outline
  slices.push(<circle key="outline" cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.wood} strokeWidth={1.5} />);

  return <>{slices}</>;
}

export function MixedFractionPie({ whole, num, den, mode }: Props) {
  const pieCount = whole + (num > 0 ? 1 : 0);
  const r = 16;
  const gap = 6;
  const startX = 20;
  const pieY = 28;

  const piesWidth = pieCount * (r * 2 + gap) - gap;
  const W = Math.max(300, piesWidth + 40);
  const H = 100;

  const improperNum = whole * den + num;

  const mixedStr = num > 0 ? `${whole}  ${num}/${den}` : `${whole}`;
  const improperStr = `${improperNum}/${den}`;

  const leftStr = mode === 'to_improper' ? mixedStr : improperStr;
  const rightStr = mode === 'to_improper' ? improperStr : mixedStr;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img"
      aria-label={mode === 'to_improper' ? `${mixedStr} = ${improperStr}` : `${improperStr} = ${mixedStr}`}>

      {/* Whole pies */}
      {Array.from({ length: whole }).map((_, i) => (
        <PieSlice key={`w${i}`} cx={startX + i * (r * 2 + gap) + r} cy={pieY} r={r} filled={den} total={den} />
      ))}

      {/* Partial pie */}
      {num > 0 && (
        <PieSlice cx={startX + whole * (r * 2 + gap) + r} cy={pieY} r={r} filled={num} total={den} />
      )}

      {/* Count label under each pie */}
      {Array.from({ length: pieCount }).map((_, i) => (
        <text key={`lbl${i}`} x={startX + i * (r * 2 + gap) + r} y={pieY + r + 14} textAnchor="middle"
          fontSize={9} fill={COLORS.wood}>
          {i < whole ? `${den}/${den}` : `${num}/${den}`}
        </text>
      ))}

      {/* Conversion text */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
        {leftStr}  →  {rightStr}
      </text>
    </svg>
  );
}
