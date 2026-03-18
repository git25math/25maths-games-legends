/**
 * FractionPie — animated fraction visualization
 * Shows a circle divided into equal slices with some filled
 *
 * Props:
 * - numerator1/denominator1: first fraction
 * - numerator2/denominator2: second fraction (optional, for addition)
 * - step: tutorial step for progressive reveal
 */
import { motion } from 'motion/react';

const COLORS = {
  wood: '#3d2b1f',
  fill1: '#8b0000',    // red for first fraction
  fill2: '#1a3a5c',    // blue for second fraction
  empty: '#f4e4bc',    // scroll color for empty slices
  stroke: '#3d2b1f',
  gold: '#b8860b',
};

type Props = {
  numerator1: number;
  denominator1: number;
  numerator2?: number;
  denominator2?: number;
  /** '+' or '-', defaults to '+' */
  op?: string;
  /** 0=nothing, 1=first pie, 2=both pies, 3=converted pies (same denominator) */
  step?: number;
};

function drawPie(
  cx: number, cy: number, r: number,
  numerator: number, denominator: number,
  fillColor: string, delay: number
): JSX.Element[] {
  const elements: JSX.Element[] = [];

  // Draw filled slices
  for (let i = 0; i < denominator; i++) {
    const startAngle = (i / denominator) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = (1 / denominator) > 0.5 ? 1 : 0;

    const isFilled = i < numerator;
    elements.push(
      <motion.path
        key={`slice-${cx}-${i}`}
        d={`M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
        fill={isFilled ? fillColor : COLORS.empty}
        stroke={COLORS.stroke}
        strokeWidth={1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + i * 0.05 }}
      />
    );
  }

  // Draw slice lines
  for (let i = 0; i < denominator; i++) {
    const angle = (i / denominator) * 2 * Math.PI - Math.PI / 2;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    elements.push(
      <line key={`line-${cx}-${i}`} x1={cx} y1={cy} x2={x2} y2={y2} stroke={COLORS.stroke} strokeWidth={1} />
    );
  }

  // Outer circle
  elements.push(
    <circle key={`ring-${cx}`} cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.stroke} strokeWidth={2} />
  );

  return elements;
}

export function FractionPie({ numerator1, denominator1, numerator2, denominator2, op = '+', step = 999 }: Props) {
  const hasTwoPies = numerator2 !== undefined && denominator2 !== undefined;
  const d2 = denominator2 ?? 1;
  const n2 = numerator2 ?? 0;

  // Compute LCD for step 3 (converted pies)
  function gcdLocal(a: number, b: number): number { while (b) { [a, b] = [b, a % b]; } return a; }
  const lcd = hasTwoPies ? (denominator1 * d2) / gcdLocal(denominator1, d2) : denominator1;
  const convN1 = numerator1 * (lcd / denominator1);
  const convN2 = hasTwoPies ? n2 * (lcd / d2) : 0;
  const resultN = op === '-' ? convN1 - convN2 : convN1 + convN2;

  const showConverted = step >= 3 && hasTwoPies && lcd !== denominator1;
  const showResult = step >= 4 && hasTwoPies;
  const rows = showConverted || showResult ? 2 : 1;
  const WIDTH = hasTwoPies ? 280 : 160;
  const HEIGHT = rows === 2 ? 240 : 130;
  const R = 40;

  const cx1 = hasTwoPies ? 75 : WIDTH / 2;
  const cy1 = 55;
  const cx2 = 205;
  const cy2 = rows === 2 ? 175 : cy1;

  const operatorSymbol = op === '-' ? '−' : '+';

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-sm mx-auto">
      {/* Row 1: Original fractions */}
      {step >= 1 && (
        <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.3 }}>
          {drawPie(cx1, cy1, R, numerator1, denominator1, COLORS.fill1, 0)}
          <text x={cx1} y={cy1 + R + 14} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill1}>
            {numerator1}/{denominator1}
          </text>
        </motion.g>
      )}

      {/* Operator */}
      {step >= 2 && hasTwoPies && (
        <motion.text x={WIDTH / 2} y={cy1 + 5} textAnchor="middle" fontSize={18} fontWeight="bold" fill={COLORS.gold} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {operatorSymbol}
        </motion.text>
      )}

      {/* Second pie (original) */}
      {step >= 2 && hasTwoPies && (
        <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.3, delay: 0.2 }}>
          {drawPie(cx2, cy1, R, n2, d2, COLORS.fill2, 0.2)}
          <text x={cx2} y={cy1 + R + 14} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill2}>
            {n2}/{d2}
          </text>
        </motion.g>
      )}

      {/* Row 2: Converted (same denominator) pies */}
      {showConverted && (
        <>
          <motion.text x={WIDTH / 2} y={cy1 + R + 30} textAnchor="middle" fontSize={11} fill={COLORS.wood} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            ↓ 通分 (LCD={lcd})
          </motion.text>
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.3, delay: 0.4 }}>
            {drawPie(cx1, cy2, R, convN1, lcd, COLORS.fill1, 0.4)}
            <text x={cx1} y={cy2 + R + 14} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill1}>
              {convN1}/{lcd}
            </text>
          </motion.g>
          <motion.text x={WIDTH / 2} y={cy2 + 5} textAnchor="middle" fontSize={18} fontWeight="bold" fill={COLORS.gold} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {operatorSymbol}
          </motion.text>
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.3, delay: 0.5 }}>
            {drawPie(cx2, cy2, R, convN2, lcd, COLORS.fill2, 0.5)}
            <text x={cx2} y={cy2 + R + 14} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.fill2}>
              {convN2}/{lcd}
            </text>
          </motion.g>
        </>
      )}

      {/* Result pie (step 4+) */}
      {showResult && resultN >= 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <text x={WIDTH / 2} y={HEIGHT - 4} textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLORS.gold}>
            = {resultN}/{lcd}
          </text>
        </motion.g>
      )}
    </svg>
  );
}
