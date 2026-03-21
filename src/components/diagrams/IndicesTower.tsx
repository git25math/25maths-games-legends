/**
 * IndicesTower — Visual tower of repeated multiplication for indices
 * Covers: INDICES type (Y8 Unit 7: military strength)
 * Shows base^exponent as stacked blocks of multiplication
 */

type Props = {
  base: number;
  e1: number;
  e2: number;
  op?: 'mul' | 'div'; // multiply or divide law
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: 'rgba(41,128,185,0.2)',
  green: 'rgba(39,174,96,0.2)',
  strokeBlue: '#2980b9',
  strokeGreen: '#27ae60',
  red: '#c0392b',
};

export function IndicesTower({ base, e1, e2, op = 'mul' }: Props) {
  const W = 260;
  const H = 160;
  const blockW = 36;
  const blockH = 28;
  const gap = 3;

  // Left tower: base^e1
  const maxE = Math.max(e1, e2);
  const towerH = maxE * (blockH + gap);
  const startY = (H - towerH) / 2 + 10;

  const leftX = 45;
  const rightX = W - 45 - blockW;
  const opX = W / 2;

  // Build blocks for a tower
  const tower = (x: number, exp: number, color: string, stroke: string) => {
    const blocks: JSX.Element[] = [];
    for (let i = 0; i < exp; i++) {
      const y = startY + (maxE - exp) * (blockH + gap) / 2 + i * (blockH + gap);
      blocks.push(
        <g key={`${x}-${i}`}>
          <rect x={x} y={y} width={blockW} height={blockH} fill={color} stroke={stroke} strokeWidth={1.5} rx={3} />
          <text x={x + blockW / 2} y={y + blockH / 2 + 4} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.wood}>
            {base}
          </text>
        </g>
      );
    }
    return blocks;
  };

  const resultExp = op === 'mul' ? e1 + e2 : e1 - e2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${base}^${e1} ${op === 'mul' ? '×' : '÷'} ${base}^${e2}`}>
      {/* Left tower */}
      {tower(leftX, e1, COLORS.blue, COLORS.strokeBlue)}
      <text x={leftX + blockW / 2} y={startY - 8} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.strokeBlue}>
        {base}^{e1}
      </text>

      {/* Operator */}
      <text x={opX} y={H / 2 + 5} textAnchor="middle" fontSize={20} fontWeight="bold" fill={COLORS.wood}>
        {op === 'mul' ? '\u00D7' : '\u00F7'}
      </text>

      {/* Right tower */}
      {tower(rightX, e2, COLORS.green, COLORS.strokeGreen)}
      <text x={rightX + blockW / 2} y={startY - 8} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.strokeGreen}>
        {base}^{e2}
      </text>

      {/* Result */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
        = {base}^{'{' + (op === 'mul' ? `${e1}+${e2}` : `${e1}-${e2}`) + '}'} = {base}^{resultExp}
        {resultExp <= 4 ? ` = ${Math.pow(base, resultExp)}` : ''}
      </text>
    </svg>
  );
}
