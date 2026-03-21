/**
 * PercentageBar — Horizontal bar showing percentage of a whole
 * Covers: PERCENTAGE type (Y8 Unit 2: resource management)
 * Shows base amount, percentage portion, and result
 */

type Props = {
  initial: number;
  pct: number;     // percentage as whole number (e.g. 20, 40, 15)
  increase: boolean; // true = increase, false = decrease
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  base: 'rgba(41,128,185,0.25)',
  portion: 'rgba(231,76,60,0.3)',
  increase: 'rgba(39,174,96,0.3)',
  strokeBase: '#2980b9',
  strokePortion: '#e74c3c',
  strokeIncrease: '#27ae60',
};

export function PercentageBar({ initial, pct, increase }: Props) {
  const W = 270;
  const H = 120;
  const barX = 30;
  const barW = 210;
  const barH = 40;
  const barY = 30;

  const fraction = pct / 100;
  const portionW = Math.round(barW * Math.min(fraction, 1));
  const amount = Math.round(initial * fraction);
  const result = increase ? initial + amount : initial - amount;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${pct}% of ${initial}`}>
      {/* Full bar = initial */}
      <rect x={barX} y={barY} width={barW} height={barH} fill={COLORS.base} stroke={COLORS.strokeBase} strokeWidth={1.5} rx={4} />

      {/* Percentage portion */}
      <rect x={barX} y={barY} width={portionW} height={barH}
        fill={increase ? COLORS.increase : COLORS.portion}
        stroke={increase ? COLORS.strokeIncrease : COLORS.strokePortion}
        strokeWidth={1.5} rx={4}
      />

      {/* Portion percentage label */}
      <text x={barX + portionW / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight="bold"
        fill={increase ? COLORS.strokeIncrease : COLORS.strokePortion}>
        {pct}%
      </text>

      {/* Full bar label */}
      <text x={barX + barW / 2} y={barY - 8} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.strokeBase}>
        {initial} (100%)
      </text>

      {/* Amount label */}
      <text x={barX + portionW / 2} y={barY + barH + 16} textAnchor="middle" fontSize={10} fontWeight="bold"
        fill={increase ? COLORS.strokeIncrease : COLORS.strokePortion}>
        {pct}% = {amount}
      </text>

      {/* Result */}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.gold}>
        {initial} {increase ? '+' : '-'} {amount} = {result}
      </text>
    </svg>
  );
}
