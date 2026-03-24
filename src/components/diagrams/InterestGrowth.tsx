/**
 * InterestGrowth — Year-by-year bar chart showing compound/simple interest growth.
 * Covers: PERCENTAGE_INTEREST_RANDOM generator type
 */

type Props = {
  principal: number;
  rate: number;
  years: number;
  mode: 'simple' | 'compound';
  answer: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  green: '#2d6a2e',
  empty: '#f4e4bc',
  blue: '#1a3a5c',
};

export function InterestGrowth({ principal, rate, years, mode, answer }: Props) {
  const W = 280;
  const H = 140;
  const barAreaX = 30;
  const barAreaW = W - 60;
  const barAreaTop = 20;
  const barAreaBottom = H - 25;
  const barAreaH = barAreaBottom - barAreaTop;

  // Compute amounts for each year
  const amounts: number[] = [];
  for (let y = 0; y <= years; y++) {
    if (mode === 'simple') {
      amounts.push(principal + principal * rate * y);
    } else {
      amounts.push(principal * Math.pow(1 + rate, y));
    }
  }

  const maxAmount = Math.max(...amounts);
  const barCount = years + 1;
  const gap = 4;
  const barW = Math.min(36, (barAreaW - gap * barCount) / barCount);
  const totalBarsW = barCount * barW + (barCount - 1) * gap;
  const startX = barAreaX + (barAreaW - totalBarsW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${mode} interest growth over ${years} years`}>
      {/* Background */}
      <rect width={W} height={H} fill={COLORS.empty} rx={8} />

      {/* Baseline */}
      <line x1={barAreaX} y1={barAreaBottom} x2={W - 30} y2={barAreaBottom} stroke={COLORS.wood} strokeWidth={1} />

      {amounts.map((amt, i) => {
        const x = startX + i * (barW + gap);
        const totalH = (amt / maxAmount) * barAreaH;
        const principalH = (principal / maxAmount) * barAreaH;
        const growthH = totalH - principalH;
        const barTop = barAreaBottom - totalH;

        return (
          <g key={i}>
            {/* Principal portion */}
            <rect
              x={x} y={barAreaBottom - principalH} width={barW} height={principalH}
              fill={COLORS.gold} stroke={COLORS.wood} strokeWidth={0.8} rx={2}
            />
            {/* Growth portion */}
            {growthH > 0 && (
              <rect
                x={x} y={barTop} width={barW} height={growthH}
                fill={COLORS.green} stroke={COLORS.wood} strokeWidth={0.8} rx={2}
              />
            )}
            {/* Year label */}
            <text x={x + barW / 2} y={barAreaBottom + 12} textAnchor="middle" fontSize={8} fill={COLORS.wood}>
              Y{i}
            </text>
            {/* Final bar: show answer */}
            {i === years && (
              <text x={x + barW / 2} y={barTop - 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.blue}>
                {answer}
              </text>
            )}
          </g>
        );
      })}

      {/* Mode label */}
      <text x={W / 2} y={12} textAnchor="middle" fontSize={10} fill={COLORS.gold} fontWeight="bold">
        {mode === 'compound' ? 'Compound' : 'Simple'} Interest
      </text>
    </svg>
  );
}
