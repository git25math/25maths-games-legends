/**
 * CylinderDiagram — 3D isometric cylinder for volume visualization
 * Covers: VOLUME type (Y8 Unit 3: granary building)
 * Shows radius, height, base area concept
 */

type Props = {
  radius: number;
  height: number;
  step?: number; // 0=outline, 1=base labels, 2=height+volume
};

const COLORS = {
  wood: '#3d2b1f',
  fill: 'rgba(184,134,11,0.08)',
  stroke: '#b8860b',
  base: '#1a3a5c',
  height: '#8b0000',
  label: '#3d2b1f',
};

export function CylinderDiagram({ radius, height, step = 999 }: Props) {
  const W = 260;
  const H = 240;
  const cx = W / 2;

  // Visual dimensions (pixels)
  const rx = 55; // horizontal radius of ellipse (3D perspective)
  const ry = 18; // vertical radius of ellipse
  const cylH = 110; // visual cylinder height

  const topY = 45;
  const botY = topY + cylH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" role="img" aria-label="Cylinder diagram">
      {/* Back half of top ellipse (behind cylinder body) */}
      <path
        d={`M ${cx - rx} ${topY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${topY}`}
        fill="none" stroke={COLORS.stroke} strokeWidth={1} strokeDasharray="4,3" opacity={0.4}
      />

      {/* Cylinder body (two vertical lines) */}
      <line x1={cx - rx} y1={topY} x2={cx - rx} y2={botY} stroke={COLORS.stroke} strokeWidth={1.5} />
      <line x1={cx + rx} y1={topY} x2={cx + rx} y2={botY} stroke={COLORS.stroke} strokeWidth={1.5} />

      {/* Bottom ellipse (full) */}
      <ellipse cx={cx} cy={botY} rx={rx} ry={ry} fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth={1.5} />

      {/* Front half of top ellipse */}
      <path
        d={`M ${cx - rx} ${topY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${topY}`}
        fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth={1.5}
      />

      {/* Fill body */}
      <rect x={cx - rx} y={topY} width={rx * 2} height={cylH} fill={COLORS.fill} stroke="none" />

      {/* Radius line on top ellipse */}
      {step >= 1 && (
        <g>
          <line x1={cx} y1={topY} x2={cx + rx} y2={topY} stroke={COLORS.base} strokeWidth={2} />
          <circle cx={cx} cy={topY} r={2.5} fill={COLORS.base} />
          <text x={cx + rx / 2} y={topY - 6} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.base}>
            r = {radius}
          </text>
          {/* πr² label at base centre */}
          <text x={cx} y={botY + ry + 16} textAnchor="middle" fontSize={11} fontWeight="bold" fill={COLORS.base}>
            底面积 = πr²
          </text>
        </g>
      )}

      {/* Height line */}
      {step >= 2 && (
        <g>
          <line x1={cx + rx + 15} y1={topY} x2={cx + rx + 15} y2={botY} stroke={COLORS.height} strokeWidth={2} />
          {/* Arrow heads */}
          <polygon points={`${cx + rx + 15},${topY - 4} ${cx + rx + 12},${topY + 3} ${cx + rx + 18},${topY + 3}`} fill={COLORS.height} />
          <polygon points={`${cx + rx + 15},${botY + 4} ${cx + rx + 12},${botY - 3} ${cx + rx + 18},${botY - 3}`} fill={COLORS.height} />
          <text x={cx + rx + 25} y={(topY + botY) / 2 + 4} fontSize={12} fontWeight="bold" fill={COLORS.height}>
            h = {height}
          </text>
          {/* Volume formula */}
          <text x={cx} y={H - 8} textAnchor="middle" fontSize={12} fontWeight="bold" fill={COLORS.label}>
            V = πr²h
          </text>
        </g>
      )}
    </svg>
  );
}
