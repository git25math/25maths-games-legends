/**
 * AlgebraBox — Grid model for expanding brackets or factorising
 * EXPAND: a(bx + c) shown as area model grid
 * FACTORISE: ax + b shown as grid → factor(px + q)
 * Covers: EXPAND + FACTORISE types (Y8 Unit 6: siege weapons)
 */

type ExpandProps = {
  mode: 'expand';
  a: number;   // coefficient outside bracket
  b: number;   // x coefficient inside
  c: number;   // constant inside
};

type FactoriseProps = {
  mode: 'factorise';
  factor: number; // GCF
  p: number;      // first term ÷ factor
  q: number;      // second term ÷ factor
};

type Props = ExpandProps | FactoriseProps;

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: 'rgba(41,128,185,0.15)',
  green: 'rgba(39,174,96,0.15)',
  strokeBlue: '#2980b9',
  strokeGreen: '#27ae60',
  red: '#c0392b',
};

export function AlgebraBox(props: Props) {
  const W = 260;
  const H = 160;

  if (props.mode === 'expand') {
    const { a, b, c } = props;
    // Area model: a × (bx + c)
    // Grid:        | bx    | c    |
    //    a         | a·bx  | a·c  |
    const gx = 50;
    const gy = 40;
    const gw1 = 100; // bx column
    const gw2 = 70;  // c column
    const gh = 60;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Expand ${a}(${b}x + ${c})`}>
        {/* Header row: bx and c */}
        <text x={gx + gw1 / 2} y={gy - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.strokeBlue}>{b}x</text>
        <text x={gx + gw1 + gw2 / 2} y={gy - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.strokeGreen}>{c}</text>

        {/* Side: a */}
        <text x={gx - 12} y={gy + gh / 2 + 4} textAnchor="end" fontSize={13} fontWeight="bold" fill={COLORS.red}>{a}</text>

        {/* Grid cells */}
        <rect x={gx} y={gy} width={gw1} height={gh} fill={COLORS.blue} stroke={COLORS.strokeBlue} strokeWidth={1.5} rx={2} />
        <rect x={gx + gw1} y={gy} width={gw2} height={gh} fill={COLORS.green} stroke={COLORS.strokeGreen} strokeWidth={1.5} rx={2} />

        {/* Cell values */}
        <text x={gx + gw1 / 2} y={gy + gh / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.wood}>{a * b}x</text>
        <text x={gx + gw1 + gw2 / 2} y={gy + gh / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.wood}>{a * c}</text>

        {/* Multiplication signs */}
        <text x={gx - 2} y={gy - 8} textAnchor="end" fontSize={11} fill={COLORS.wood}>x</text>

        {/* Result */}
        <text x={W / 2} y={gy + gh + 28} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
          {a}({b}x + {c}) = {a * b}x + {a * c}
        </text>
      </svg>
    );
  }

  // Factorise mode
  const { factor, p, q } = props;
  const a = factor * p;
  const b = factor * q;

  const gx = 50;
  const gy = 40;
  const gw1 = 100;
  const gw2 = 70;
  const gh = 60;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Factorise ${a}x + ${b}`}>
      {/* Header: p and q (inside bracket) */}
      <text x={gx + gw1 / 2} y={gy - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.strokeBlue}>{p}x</text>
      <text x={gx + gw1 + gw2 / 2} y={gy - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.strokeGreen}>{q}</text>

      {/* Side: factor (GCF) */}
      <text x={gx - 12} y={gy + gh / 2 + 4} textAnchor="end" fontSize={13} fontWeight="bold" fill={COLORS.red}>{factor}</text>

      {/* Grid cells */}
      <rect x={gx} y={gy} width={gw1} height={gh} fill={COLORS.blue} stroke={COLORS.strokeBlue} strokeWidth={1.5} rx={2} />
      <rect x={gx + gw1} y={gy} width={gw2} height={gh} fill={COLORS.green} stroke={COLORS.strokeGreen} strokeWidth={1.5} rx={2} />

      {/* Cell values */}
      <text x={gx + gw1 / 2} y={gy + gh / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.wood}>{a}x</text>
      <text x={gx + gw1 + gw2 / 2} y={gy + gh / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.wood}>{b}</text>

      <text x={gx - 2} y={gy - 8} textAnchor="end" fontSize={11} fill={COLORS.wood}>x</text>

      {/* Result */}
      <text x={W / 2} y={gy + gh + 28} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
        {a}x + {b} = {factor}({p}x + {q})
      </text>
    </svg>
  );
}
