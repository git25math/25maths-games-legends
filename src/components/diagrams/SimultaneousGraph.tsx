/**
 * SimultaneousGraph — Two lines intersecting at solution point
 * Covers: SIMULTANEOUS type (Y8 Unit 8: substitution method)
 * Shows y = ax + b and cx + dy = e as two lines meeting at (solX, solY)
 */

type Props = {
  /** y = ax + b */
  eq1: [number, number]; // [a, b]
  /** cx + dy = e → y = (e - cx) / d */
  eq2: [number, number, number]; // [c, d, e]
  solX: number;
  solY: number;
  step?: number; // 0=axes, 1=line1, 2=line2+intersection
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  red: '#c0392b',
  blue: '#2980b9',
  green: '#27ae60',
  bg: 'rgba(184,134,11,0.06)',
  grid: 'rgba(61,43,31,0.08)',
};

export function SimultaneousGraph({ eq1, eq2, solX, solY, step = 999 }: Props) {
  const W = 280;
  const H = 240;

  // Determine axis range from solution ± padding
  const pad = 3;
  const xMin = Math.min(-1, solX - pad);
  const xMax = Math.max(3, solX + pad);
  const yMin = Math.min(-1, solY - pad);
  const yMax = Math.max(3, solY + pad);

  const marginL = 30;
  const marginR = 15;
  const marginT = 15;
  const marginB = 25;
  const plotW = W - marginL - marginR;
  const plotH = H - marginT - marginB;

  const toSvgX = (x: number) => marginL + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => marginT + ((yMax - y) / (yMax - yMin)) * plotH;

  // Line 1: y = ax + b
  const [a, b] = eq1;
  const line1 = (x: number) => a * x + b;

  // Line 2: cx + dy = e → y = (e - cx) / d
  const [c, d, e] = eq2;
  const line2 = (x: number) => (e - c * x) / d;

  // Generate path for a line function
  const linePath = (fn: (x: number) => number) => {
    const x0 = xMin - 1;
    const x1 = xMax + 1;
    const sx0 = toSvgX(x0);
    const sy0 = toSvgY(fn(x0));
    const sx1 = toSvgX(x1);
    const sy1 = toSvgY(fn(x1));
    return `M${sx0},${sy0} L${sx1},${sy1}`;
  };

  // Grid lines
  const gridLines: JSX.Element[] = [];
  for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
    gridLines.push(
      <line key={`gx${gx}`} x1={toSvgX(gx)} y1={marginT} x2={toSvgX(gx)} y2={H - marginB}
        stroke={gx === 0 ? COLORS.wood : COLORS.grid} strokeWidth={gx === 0 ? 1.5 : 0.5} />
    );
    if (gx !== 0) {
      gridLines.push(
        <text key={`lx${gx}`} x={toSvgX(gx)} y={H - marginB + 14} textAnchor="middle" fontSize={9} fill={COLORS.wood}>{gx}</text>
      );
    }
  }
  for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) {
    gridLines.push(
      <line key={`gy${gy}`} x1={marginL} y1={toSvgY(gy)} x2={W - marginR} y2={toSvgY(gy)}
        stroke={gy === 0 ? COLORS.wood : COLORS.grid} strokeWidth={gy === 0 ? 1.5 : 0.5} />
    );
    if (gy !== 0) {
      gridLines.push(
        <text key={`ly${gy}`} x={marginL - 6} y={toSvgY(gy) + 3} textAnchor="end" fontSize={9} fill={COLORS.wood}>{gy}</text>
      );
    }
  }

  const aDisplay = a === 1 ? '' : a === -1 ? '-' : String(a);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label="Simultaneous equations graph">
      <rect x={marginL} y={marginT} width={plotW} height={plotH} fill={COLORS.bg} rx={4} />

      {/* Grid */}
      {gridLines}

      {/* Axis labels */}
      <text x={W - marginR + 2} y={toSvgY(0) - 4} fontSize={10} fontWeight="bold" fill={COLORS.wood}>x</text>
      <text x={toSvgX(0) + 6} y={marginT + 4} fontSize={10} fontWeight="bold" fill={COLORS.wood}>y</text>

      {/* Line 1: y = ax + b */}
      {step >= 1 && (
        <>
          <clipPath id="plot-clip">
            <rect x={marginL} y={marginT} width={plotW} height={plotH} />
          </clipPath>
          <path d={linePath(line1)} stroke={COLORS.blue} strokeWidth={2} fill="none" clipPath="url(#plot-clip)" />
          <text x={W - marginR - 5} y={marginT + 14} textAnchor="end" fontSize={9} fontWeight="bold" fill={COLORS.blue}>
            y = {aDisplay}x {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}
          </text>
        </>
      )}

      {/* Line 2: cx + dy = e */}
      {step >= 2 && (
        <>
          <path d={linePath(line2)} stroke={COLORS.red} strokeWidth={2} fill="none" clipPath="url(#plot-clip)" />
          <text x={W - marginR - 5} y={marginT + 28} textAnchor="end" fontSize={9} fontWeight="bold" fill={COLORS.red}>
            {c}x + {d}y = {e}
          </text>

          {/* Intersection point */}
          <circle cx={toSvgX(solX)} cy={toSvgY(solY)} r={5} fill={COLORS.green} stroke="white" strokeWidth={2} />
          <text x={toSvgX(solX) + 8} y={toSvgY(solY) - 8} fontSize={10} fontWeight="bold" fill={COLORS.green}>
            ({solX}, {solY})
          </text>

          {/* Dashed projection lines */}
          <line x1={toSvgX(solX)} y1={toSvgY(solY)} x2={toSvgX(solX)} y2={toSvgY(0)}
            stroke={COLORS.green} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
          <line x1={toSvgX(solX)} y1={toSvgY(solY)} x2={toSvgX(0)} y2={toSvgY(solY)}
            stroke={COLORS.green} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
        </>
      )}
    </svg>
  );
}
