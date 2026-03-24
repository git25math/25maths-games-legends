/**
 * ExpressionOrder — Shows a BODMAS expression with operation priority highlighting.
 * Covers: BODMAS_RANDOM (Y7/Y8 order of operations)
 */

type Props = {
  expr: string;
  answer: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  green: '#2d6a2e',
  empty: '#f4e4bc',
  highBg: 'rgba(184,134,11,0.2)',
  lowBg: 'rgba(26,58,92,0.08)',
};

/** Split expression into tokens (numbers, operators, brackets) */
function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let current = '';
  for (const ch of expr) {
    if ('+-×÷*/()'.includes(ch)) {
      if (current.trim()) tokens.push(current.trim());
      tokens.push(ch);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens;
}

function isHighPriority(op: string): boolean {
  return op === '×' || op === '÷' || op === '*' || op === '/';
}

function isOperator(token: string): boolean {
  return ['+', '-', '×', '÷', '*', '/'].includes(token);
}

export function ExpressionOrder({ expr, answer }: Props) {
  const W = 280;
  const H = 70;
  const tokens = tokenize(expr);

  // Compute character widths for layout
  const charW = 11;
  const totalTextW = tokens.reduce((sum, t) => sum + t.length * charW + 4, 0);
  let cursorX = (W - totalTextW) / 2;

  // Build token positions
  const positions: { token: string; x: number; w: number; isOp: boolean; isHigh: boolean }[] = [];
  for (const token of tokens) {
    const w = token.length * charW + 4;
    positions.push({
      token,
      x: cursorX,
      w,
      isOp: isOperator(token),
      isHigh: isHighPriority(token),
    });
    cursorX += w;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`BODMAS: ${expr} = ${answer}`}>
      {/* Background */}
      <rect x={4} y={4} width={W - 8} height={H - 8} fill={COLORS.empty} rx={6} stroke={COLORS.wood} strokeWidth={1} opacity={0.4} />

      {/* Expression tokens with priority highlights */}
      {positions.map((p, i) => {
        // Highlight high-priority operators and their adjacent operands
        const prevIsHigh = i > 0 && positions[i - 1].isHigh;
        const nextIsHigh = i < positions.length - 1 && positions[i + 1].isHigh;
        const highlight = p.isHigh || (!p.isOp && (prevIsHigh || nextIsHigh));

        return (
          <g key={i}>
            {highlight && (
              <rect x={p.x - 1} y={14} width={p.w + 2} height={22} fill={COLORS.highBg} rx={3} />
            )}
            {!highlight && p.isOp && (
              <rect x={p.x - 1} y={14} width={p.w + 2} height={22} fill={COLORS.lowBg} rx={3} />
            )}
            <text
              x={p.x + p.w / 2} y={30}
              textAnchor="middle"
              fontSize={14}
              fontWeight="bold"
              fill={p.isOp ? (p.isHigh ? COLORS.gold : COLORS.wood) : COLORS.wood}
            >
              {p.token}
            </text>
          </g>
        );
      })}

      {/* Priority legend */}
      <rect x={20} y={42} width={10} height={10} fill={COLORS.highBg} rx={2} />
      <text x={34} y={51} fontSize={8} fill={COLORS.wood}>×÷ first</text>
      <rect x={80} y={42} width={10} height={10} fill={COLORS.lowBg} rx={2} />
      <text x={94} y={51} fontSize={8} fill={COLORS.wood}>+- second</text>

      {/* Answer */}
      <text x={W - 30} y={51} textAnchor="end" fontSize={12} fontWeight="bold" fill={COLORS.green}>
        = {answer}
      </text>
    </svg>
  );
}
