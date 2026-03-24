/**
 * SignedMultiply — Visual for integer multiplication/division with sign rules.
 * Covers: INTEGER_MUL_RANDOM (Y7/Y8 signed arithmetic)
 */

type Props = {
  a: number;
  b: number;
  answer: number;
  op: string;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#8b0000',
  blue: '#1a3a5c',
  empty: '#f4e4bc',
};

function numColor(n: number): string {
  if (n > 0) return COLORS.blue;
  if (n < 0) return COLORS.red;
  return COLORS.gold;
}

function signLabel(a: number, b: number, op: string): string {
  const aSign = a >= 0 ? '正' : '负';
  const bSign = b >= 0 ? '正' : '负';
  const result = (a >= 0) === (b >= 0) ? '正' : '负';
  const opChar = op === '÷' || op === 'div' ? '÷' : '×';
  return `${aSign}${opChar}${bSign}=${result}`;
}

export function SignedMultiply({ a, b, answer, op }: Props) {
  const W = 260;
  const H = 80;
  const boxW = 44;
  const boxH = 30;
  const boxY = 12;
  const opDisplay = op === '÷' || op === 'div' ? '÷' : '×';

  // Center 5 elements: [a] [op] [b] [=] [answer]
  const totalW = boxW * 3 + 40; // 3 boxes + 2 operator gaps
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${a} ${opDisplay} ${b} = ${answer}`}>
      {/* Background */}
      <rect x={4} y={4} width={W - 8} height={H - 8} fill={COLORS.empty} rx={6} stroke={COLORS.wood} strokeWidth={1} opacity={0.4} />

      {/* Box: a */}
      <rect x={startX} y={boxY} width={boxW} height={boxH} fill="rgba(255,255,255,0.6)" stroke={numColor(a)} strokeWidth={1.5} rx={5} />
      <text x={startX + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={numColor(a)}>
        {a}
      </text>

      {/* Operator */}
      <text x={startX + boxW + 12} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.wood}>
        {opDisplay}
      </text>

      {/* Box: b */}
      <rect x={startX + boxW + 24} y={boxY} width={boxW} height={boxH} fill="rgba(255,255,255,0.6)" stroke={numColor(b)} strokeWidth={1.5} rx={5} />
      <text x={startX + boxW + 24 + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={numColor(b)}>
        {b}
      </text>

      {/* Equals */}
      <text x={startX + boxW * 2 + 36} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.wood}>
        =
      </text>

      {/* Box: answer */}
      <rect x={startX + boxW * 2 + 48} y={boxY} width={boxW} height={boxH} fill="rgba(255,255,255,0.6)" stroke={numColor(answer)} strokeWidth={2} rx={5} />
      <text x={startX + boxW * 2 + 48 + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={15} fontWeight="bold" fill={numColor(answer)}>
        {answer}
      </text>

      {/* Sign rule reminder */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.gold}>
        {signLabel(a, b, op)}
      </text>
    </svg>
  );
}
