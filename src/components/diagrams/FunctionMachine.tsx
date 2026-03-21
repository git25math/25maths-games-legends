/**
 * FunctionMachine — Input→Function→Output visual for function evaluation
 * Covers: FUNC_VAL type (Y8 Unit 4: strategy planning)
 * Shows x → f(x) = mx + b → result as a flow diagram
 */

type Props = {
  x: number;
  m: number;
  b: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: '#2980b9',
  green: '#27ae60',
  red: '#c0392b',
  machineBg: 'rgba(41,128,185,0.12)',
  inputBg: 'rgba(39,174,96,0.15)',
  outputBg: 'rgba(184,134,11,0.15)',
};

export function FunctionMachine({ x, m, b }: Props) {
  const W = 270;
  const H = 130;
  const result = m * x + b;

  // Layout: [input] → [machine] → [output]
  const boxH = 50;
  const boxY = 30;

  // Input box
  const inX = 10;
  const inW = 50;

  // Machine box
  const machX = 80;
  const machW = 100;

  // Output box
  const outX = 200;
  const outW = 60;

  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const mDisplay = m === 1 ? '' : m === -1 ? '-' : String(m);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`f(${x}) = ${m}(${x}) + ${b}`}>
      {/* Input box */}
      <rect x={inX} y={boxY} width={inW} height={boxH} fill={COLORS.inputBg} stroke={COLORS.green} strokeWidth={2} rx={6} />
      <text x={inX + inW / 2} y={boxY - 6} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.green}>Input</text>
      <text x={inX + inW / 2} y={boxY + boxH / 2 + 6} textAnchor="middle" fontSize={18} fontWeight="bold" fill={COLORS.green}>
        {x}
      </text>

      {/* Arrow 1 */}
      <line x1={inX + inW + 3} y1={boxY + boxH / 2} x2={machX - 3} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={2} markerEnd="url(#fm-arrow)" />

      {/* Machine box */}
      <rect x={machX} y={boxY} width={machW} height={boxH} fill={COLORS.machineBg} stroke={COLORS.blue} strokeWidth={2} rx={6} />
      <text x={machX + machW / 2} y={boxY - 6} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.blue}>Function</text>
      <text x={machX + machW / 2} y={boxY + boxH / 2 + 1} textAnchor="middle" fontSize={14} fontWeight="bold" fill={COLORS.blue}>
        f(x) = {mDisplay}x {bSign}
      </text>
      <text x={machX + machW / 2} y={boxY + boxH / 2 + 16} textAnchor="middle" fontSize={10} fill={COLORS.wood}>
        {mDisplay}({x}) {bSign}
      </text>

      {/* Arrow 2 */}
      <line x1={machX + machW + 3} y1={boxY + boxH / 2} x2={outX - 3} y2={boxY + boxH / 2}
        stroke={COLORS.wood} strokeWidth={2} markerEnd="url(#fm-arrow)" />

      {/* Output box */}
      <rect x={outX} y={boxY} width={outW} height={boxH} fill={COLORS.outputBg} stroke={COLORS.gold} strokeWidth={2} rx={6} />
      <text x={outX + outW / 2} y={boxY - 6} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.gold}>Output</text>
      <text x={outX + outW / 2} y={boxY + boxH / 2 + 6} textAnchor="middle" fontSize={18} fontWeight="bold" fill={COLORS.gold}>
        {result}
      </text>

      {/* Arrow marker */}
      <defs>
        <marker id="fm-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={COLORS.wood} />
        </marker>
      </defs>

      {/* Result formula */}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.wood}>
        f({x}) = {result}
      </text>
    </svg>
  );
}
