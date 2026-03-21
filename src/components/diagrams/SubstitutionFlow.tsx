/**
 * SubstitutionFlow — Shows expression with value substituted in
 * Covers: SUBSTITUTION type (Y7 Unit 4: strategy)
 * Visual: expression → plug in x → compute → answer
 */

type Props = {
  expr: string;   // e.g. "3x + 2" or "2x²"
  x: number;
  answer: number;
  mode: string;   // 'linear' or 'power'
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: '#2980b9',
  green: '#27ae60',
  red: '#c0392b',
  bg: 'rgba(184,134,11,0.06)',
  boxBg: 'rgba(41,128,185,0.1)',
};

export function SubstitutionFlow({ expr, x, answer, mode }: Props) {
  const W = 270;
  const H = 110;

  // Three boxes: expression → substituted → result
  const boxW = 70;
  const boxH = 44;
  const boxY = 25;
  const gap = 15;
  const totalW = boxW * 3 + gap * 2;
  const startX = (W - totalW) / 2;

  const box1X = startX;
  const box2X = startX + boxW + gap;
  const box3X = startX + (boxW + gap) * 2;

  // Build substituted expression display
  let substituted: string;
  if (mode === 'power') {
    substituted = `${x}² + ...`;
  } else {
    substituted = expr.replace(/x/g, `(${x})`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`Substitute x=${x} into ${expr}`}>
      <rect x={5} y={8} width={W - 10} height={H - 16} fill={COLORS.bg} rx={6} />

      {/* Box 1: Expression */}
      <rect x={box1X} y={boxY} width={boxW} height={boxH} fill={COLORS.boxBg} stroke={COLORS.blue} strokeWidth={1.5} rx={6} />
      <text x={box1X + boxW / 2} y={boxY - 5} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.blue}>Expression</text>
      <text x={box1X + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.blue}>
        {expr || `${mode === 'power' ? 'x²' : 'ax+b'}`}
      </text>

      {/* Arrow 1 */}
      <line x1={box1X + boxW + 2} y1={boxY + boxH / 2} x2={box2X - 2} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={1.5} markerEnd="url(#sub-arrow)" />

      {/* Box 2: Substituted */}
      <rect x={box2X} y={boxY} width={boxW} height={boxH} fill="rgba(192,57,43,0.1)" stroke={COLORS.red} strokeWidth={1.5} rx={6} />
      <text x={box2X + boxW / 2} y={boxY - 5} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.red}>x = {x}</text>
      <text x={box2X + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.red}>
        {substituted.length > 10 ? substituted.slice(0, 10) : substituted}
      </text>

      {/* Arrow 2 */}
      <line x1={box2X + boxW + 2} y1={boxY + boxH / 2} x2={box3X - 2} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={1.5} markerEnd="url(#sub-arrow)" />

      {/* Box 3: Answer */}
      <rect x={box3X} y={boxY} width={boxW} height={boxH} fill="rgba(39,174,96,0.1)" stroke={COLORS.green} strokeWidth={2} rx={6} />
      <text x={box3X + boxW / 2} y={boxY - 5} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.green}>Result</text>
      <text x={box3X + boxW / 2} y={boxY + boxH / 2 + 6} textAnchor="middle" fontSize={18} fontWeight="bold" fill={COLORS.green}>
        {answer}
      </text>

      <defs>
        <marker id="sub-arrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={COLORS.wood} />
        </marker>
      </defs>

      {/* Bottom label */}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.gold}>
        When x = {x}, {expr || 'f(x)'} = {answer}
      </text>
    </svg>
  );
}
