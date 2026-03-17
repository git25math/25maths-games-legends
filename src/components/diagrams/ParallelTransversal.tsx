/**
 * ParallelTransversal — 平行线与截线角度关系
 * 覆盖 KP: 4.6-04
 */

type AngleHighlight = 'corresponding' | 'alternate' | 'cointerior';

type Props = {
  angle?: number;          // the acute angle made by the transversal (default 60)
  highlight?: AngleHighlight;
  showLabels?: boolean;
  interactive?: boolean;
};

const COLORS = {
  wood: '#3d2b1f',
  red: '#8b0000',
  blue: '#1a3a5c',
  green: '#2d6a2e',
  gold: '#b8860b',
};

const HIGHLIGHT_COLORS: Record<AngleHighlight, string> = {
  corresponding: COLORS.red,
  alternate: COLORS.blue,
  cointerior: COLORS.green,
};

export function ParallelTransversal({ angle = 60, highlight, showLabels = true }: Props) {
  const width = 300;
  const height = 260;
  const lineLen = 240;
  const lineStartX = 30;
  const line1Y = 80;
  const line2Y = 180;
  const rad = (angle * Math.PI) / 180;

  // Transversal crosses both parallel lines
  const midX = width / 2;
  const transLen = 140;
  const tx1 = midX - transLen * Math.cos(rad);
  const ty1 = line1Y + transLen * Math.sin(rad) - 40;
  const tx2 = midX + transLen * Math.cos(rad);
  const ty2 = line1Y - transLen * Math.sin(rad) + 200;

  const arcR = 25;
  const highlightColor = highlight ? HIGHLIGHT_COLORS[highlight] : COLORS.red;

  // Intersection points
  // Simple: transversal at midX on both lines
  const ix1 = midX; // intersection with line 1
  const ix2 = midX; // intersection with line 2

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm mx-auto" role="img" aria-label="Parallel lines with transversal">
      {/* Parallel line arrows (indicating parallel) */}
      <g>
        {/* Line 1 */}
        <line x1={lineStartX} y1={line1Y} x2={lineStartX + lineLen} y2={line1Y} stroke={COLORS.wood} strokeWidth={2} />
        {/* Line 2 */}
        <line x1={lineStartX} y1={line2Y} x2={lineStartX + lineLen} y2={line2Y} stroke={COLORS.wood} strokeWidth={2} />

        {/* Parallel arrows */}
        <text x={lineStartX + lineLen - 40} y={line1Y - 8} fontSize={10} fill={COLORS.wood}>▸▸</text>
        <text x={lineStartX + lineLen - 40} y={line2Y - 8} fontSize={10} fill={COLORS.wood}>▸▸</text>
      </g>

      {/* Transversal */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={COLORS.gold} strokeWidth={2} />

      {/* Angle arcs at intersection 1 */}
      {highlight === 'corresponding' && (
        <>
          <path d={`M${ix1 + arcR},${line1Y} A${arcR},${arcR} 0 0,0 ${ix1 + arcR * Math.cos(-rad)},${line1Y + arcR * Math.sin(-rad)}`} fill={highlightColor} fillOpacity={0.2} stroke={highlightColor} strokeWidth={2} />
          <path d={`M${ix2 + arcR},${line2Y} A${arcR},${arcR} 0 0,0 ${ix2 + arcR * Math.cos(-rad)},${line2Y + arcR * Math.sin(-rad)}`} fill={highlightColor} fillOpacity={0.2} stroke={highlightColor} strokeWidth={2} />
        </>
      )}

      {highlight === 'alternate' && (
        <>
          <path d={`M${ix1 + arcR},${line1Y} A${arcR},${arcR} 0 0,0 ${ix1 + arcR * Math.cos(-rad)},${line1Y + arcR * Math.sin(-rad)}`} fill={highlightColor} fillOpacity={0.2} stroke={highlightColor} strokeWidth={2} />
          <path d={`M${ix2 - arcR},${line2Y} A${arcR},${arcR} 0 0,1 ${ix2 - arcR * Math.cos(-rad)},${line2Y - arcR * Math.sin(-rad)}`} fill={highlightColor} fillOpacity={0.2} stroke={highlightColor} strokeWidth={2} />
        </>
      )}

      {highlight === 'cointerior' && (
        <>
          <path d={`M${ix1 + arcR},${line1Y} A${arcR},${arcR} 0 0,1 ${ix1 + arcR * Math.cos(rad)},${line1Y + arcR * Math.sin(rad)}`} fill={highlightColor} fillOpacity={0.2} stroke={highlightColor} strokeWidth={2} />
          <path d={`M${ix2 + arcR},${line2Y} A${arcR},${arcR} 0 0,0 ${ix2 + arcR * Math.cos(-rad)},${line2Y + arcR * Math.sin(-rad)}`} fill={highlightColor} fillOpacity={0.2} stroke={highlightColor} strokeWidth={2} />
        </>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <text x={ix1 + arcR + 8} y={line1Y - 6} fontSize={13} fontWeight="bold" fill={highlightColor}>{angle}°</text>
          {highlight === 'alternate' && (
            <text x={ix2 - arcR - 28} y={line2Y + 5} fontSize={13} fontWeight="bold" fill={highlightColor}>{angle}°</text>
          )}
          {highlight === 'corresponding' && (
            <text x={ix2 + arcR + 8} y={line2Y - 6} fontSize={13} fontWeight="bold" fill={highlightColor}>{angle}°</text>
          )}
          {highlight === 'cointerior' && (
            <text x={ix2 + arcR + 8} y={line2Y - 6} fontSize={13} fontWeight="bold" fill={highlightColor}>{180 - angle}°</text>
          )}
        </>
      )}

      {/* Intersection dots */}
      <circle cx={ix1} cy={line1Y} r={3} fill={COLORS.wood} />
      <circle cx={ix2} cy={line2Y} r={3} fill={COLORS.wood} />
    </svg>
  );
}
