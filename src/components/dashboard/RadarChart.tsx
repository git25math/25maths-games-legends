/** SVG Radar Chart — 7 dimensions, 0–1 scale */

type RadarProps = {
  values: number[]; // 7 values, each 0–1
  labels: string[];
  size?: number;
  color?: string;
};

export const RadarChart = ({ values, labels, size = 200, color = '#6366f1' }: RadarProps) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = values.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  const point = (i: number, scale: number) => {
    const angle = startAngle + i * angleStep;
    return {
      x: cx + r * scale * Math.cos(angle),
      y: cy + r * scale * Math.sin(angle),
    };
  };

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Data polygon
  const dataPoints = values.map((v, i) => point(i, Math.min(v, 1)));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto" role="img" aria-label={labels.map((l, i) => `${l}: ${Math.round(values[i] * 100)}%`).join(', ')}>
      {/* Grid rings */}
      {rings.map(scale => (
        <polygon
          key={scale}
          points={Array.from({ length: n }, (_, i) => {
            const p = point(i, scale);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={scale === 1 ? 1.5 : 0.5}
        />
      ))}

      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth={0.5} />;
      })}

      {/* Data area */}
      <polygon points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} stroke="white" strokeWidth={1.5} />
      ))}

      {/* Labels */}
      {labels.map((label, i) => {
        const p = point(i, 1.22);
        const angle = startAngle + i * angleStep;
        const textAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px] font-bold"
          >
            {label}
          </text>
        );
      })}

      {/* Center value labels */}
      {values.map((v, i) => {
        const p = point(i, Math.min(v, 1) + 0.12);
        if (v <= 0) return null;
        return (
          <text
            key={`v${i}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-indigo-600 text-[9px] font-black"
          >
            {Math.round(v * 100)}
          </text>
        );
      })}
    </svg>
  );
};
