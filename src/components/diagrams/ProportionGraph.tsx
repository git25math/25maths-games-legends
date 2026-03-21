/**
 * ProportionGraph — Direct or inverse proportion curve
 * Covers: RATIO_Y8 type (Y8 Unit 7: supply logistics)
 * Direct: y = kx (straight line through origin)
 * Inverse: y = k/x (hyperbola)
 */
import type { JSX } from 'react';


type Props = {
  mode: 'direct' | 'inverse';
  k: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const COLORS = {
  wood: '#3d2b1f',
  gold: '#b8860b',
  blue: '#2980b9',
  red: '#c0392b',
  bg: 'rgba(184,134,11,0.06)',
  grid: 'rgba(61,43,31,0.08)',
  green: '#27ae60',
};

export function ProportionGraph({ mode, k, x1, y1, x2, y2 }: Props) {
  const W = 260;
  const H = 200;
  const marginL = 35;
  const marginR = 15;
  const marginT = 20;
  const marginB = 30;
  const plotW = W - marginL - marginR;
  const plotH = H - marginT - marginB;

  // Determine axis range
  const maxX = Math.max(x1, x2) * 1.3;
  const maxY = Math.max(y1, y2) * 1.3;

  const toSvgX = (x: number) => marginL + (x / maxX) * plotW;
  const toSvgY = (y: number) => marginT + plotH - (y / maxY) * plotH;

  // Generate curve points
  const curvePoints: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * maxX;
    if (x === 0 && mode === 'inverse') continue;
    const y = mode === 'direct' ? k * x : k / x;
    if (y > maxY * 1.2 || y < 0) continue;
    const sx = toSvgX(x);
    const sy = toSvgY(y);
    curvePoints.push(`${curvePoints.length === 0 ? 'M' : 'L'}${sx},${sy}`);
  }

  // Grid
  const gridLines: JSX.Element[] = [];
  const xStep = Math.ceil(maxX / 6);
  const yStep = Math.ceil(maxY / 6);
  for (let gx = xStep; gx < maxX; gx += xStep) {
    gridLines.push(
      <line key={`gx${gx}`} x1={toSvgX(gx)} y1={marginT} x2={toSvgX(gx)} y2={H - marginB} stroke={COLORS.grid} strokeWidth={0.5} />
    );
    gridLines.push(
      <text key={`lx${gx}`} x={toSvgX(gx)} y={H - marginB + 14} textAnchor="middle" fontSize={8} fill={COLORS.wood}>{gx}</text>
    );
  }
  for (let gy = yStep; gy < maxY; gy += yStep) {
    gridLines.push(
      <line key={`gy${gy}`} x1={marginL} y1={toSvgY(gy)} x2={W - marginR} y2={toSvgY(gy)} stroke={COLORS.grid} strokeWidth={0.5} />
    );
    gridLines.push(
      <text key={`ly${gy}`} x={marginL - 5} y={toSvgY(gy) + 3} textAnchor="end" fontSize={8} fill={COLORS.wood}>{gy}</text>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label={`${mode} proportion y=${mode === 'direct' ? `${k}x` : `${k}/x`}`}>
      <rect x={marginL} y={marginT} width={plotW} height={plotH} fill={COLORS.bg} rx={4} />
      {gridLines}

      {/* Axes */}
      <line x1={marginL} y1={H - marginB} x2={W - marginR} y2={H - marginB} stroke={COLORS.wood} strokeWidth={1.5} />
      <line x1={marginL} y1={marginT} x2={marginL} y2={H - marginB} stroke={COLORS.wood} strokeWidth={1.5} />
      <text x={W - marginR} y={H - marginB - 5} fontSize={10} fontWeight="bold" fill={COLORS.wood}>x</text>
      <text x={marginL + 8} y={marginT + 4} fontSize={10} fontWeight="bold" fill={COLORS.wood}>y</text>

      {/* Curve */}
      <clipPath id="prop-clip">
        <rect x={marginL} y={marginT} width={plotW} height={plotH} />
      </clipPath>
      <path d={curvePoints.join(' ')} stroke={COLORS.blue} strokeWidth={2} fill="none" clipPath="url(#prop-clip)" />

      {/* Known point */}
      <circle cx={toSvgX(x1)} cy={toSvgY(y1)} r={4} fill={COLORS.green} stroke="white" strokeWidth={1.5} />
      <text x={toSvgX(x1) + 6} y={toSvgY(y1) - 6} fontSize={9} fontWeight="bold" fill={COLORS.green}>
        ({x1}, {y1})
      </text>

      {/* Target point */}
      <circle cx={toSvgX(x2)} cy={toSvgY(y2)} r={4} fill={COLORS.red} stroke="white" strokeWidth={1.5} />
      <text x={toSvgX(x2) + 6} y={toSvgY(y2) - 6} fontSize={9} fontWeight="bold" fill={COLORS.red}>
        ({x2}, ?)
      </text>

      {/* Formula */}
      <text x={W / 2} y={H - 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.gold}>
        {mode === 'direct' ? `y = ${k}x` : `y = ${k}/x`}
      </text>
    </svg>
  );
}
