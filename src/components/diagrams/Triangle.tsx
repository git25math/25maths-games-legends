/**
 * Triangle — proportional right-angle-aware SVG
 * Vertex positions computed from actual side lengths for geometric accuracy.
 *
 * Side convention:
 *   sides[0] = A->B (bottom)
 *   sides[1] = B->C (diagonal / right side)
 *   sides[2] = C->A (left side)
 *
 * When rightAngle=0: A is bottom-left with 90°, bottom=leg, left=leg, diagonal=hypotenuse.
 * Pass `length` on sides[0] and sides[2] so the triangle shape matches the actual ratio.
 */

type Side = { length?: number | string; label?: string };
type AngleLabel = { value?: number | string; label?: string };

type Props = {
  sides?: [Side, Side, Side];
  angles?: [AngleLabel, AngleLabel, AngleLabel];
  rightAngle?: 0 | 1 | 2;
  labels?: [string, string, string];
  color?: string;
  interactive?: boolean;
};

const COLORS = {
  wood: '#3d2b1f',
  red: '#8b0000',
  blue: '#1a3a5c',
};

const PAD_L = 50, PAD_T = 30, BASE_Y = 210;
const MAX_W = 190, MAX_H = 180;

function num(v?: number | string): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Compute vertex positions proportional to actual side lengths */
function getVertices(
  rightAngle: number | undefined,
  sides?: [Side, Side, Side],
): [number, number][] {
  if (rightAngle === 0) {
    // Right angle at A (bottom-left). Legs: sides[0]=bottom(a), sides[2]=left(b)
    const a = num(sides?.[0]?.length);
    const b = num(sides?.[2]?.length);
    if (a > 0 && b > 0) {
      const s = Math.min(MAX_W / a, MAX_H / b);
      return [[PAD_L, BASE_Y], [PAD_L + a * s, BASE_Y], [PAD_L, BASE_Y - b * s]];
    }
    return [[PAD_L, BASE_Y], [PAD_L + MAX_W, BASE_Y], [PAD_L, PAD_T]];
  }
  if (rightAngle === 1) {
    // Right angle at B (bottom-right). Legs: sides[0]=bottom, sides[1]=right
    const a = num(sides?.[0]?.length);
    const b = num(sides?.[1]?.length);
    if (a > 0 && b > 0) {
      const s = Math.min(MAX_W / a, MAX_H / b);
      return [[PAD_L, BASE_Y], [PAD_L + a * s, BASE_Y], [PAD_L + a * s, BASE_Y - b * s]];
    }
    return [[PAD_L, BASE_Y], [PAD_L + MAX_W, BASE_Y], [PAD_L + MAX_W, PAD_T]];
  }
  if (rightAngle === 2) {
    // Right angle at C (top). Use Thales circle for a reasonable shape.
    return [[PAD_L, BASE_Y], [PAD_L + MAX_W, BASE_Y], [PAD_L + 60, BASE_Y - MAX_H + 20]];
  }
  // General triangle
  return [[PAD_L, BASE_Y], [PAD_L + MAX_W, BASE_Y], [PAD_L + 90, PAD_T]];
}

export function Triangle({ sides, angles, rightAngle, labels, color }: Props) {
  const c = color || COLORS.wood;
  const width = 280;
  const height = 240;
  const verts = getVertices(rightAngle, sides);
  const sq = 12;

  // Centroid for pushing labels outward
  const cx = (verts[0][0] + verts[1][0] + verts[2][0]) / 3;
  const cy = (verts[0][1] + verts[1][1] + verts[2][1]) / 3;

  const mid = (i: number, j: number): [number, number] => [
    (verts[i][0] + verts[j][0]) / 2,
    (verts[i][1] + verts[j][1]) / 2,
  ];

  const pushOut = (px: number, py: number, dist: number): [number, number] => {
    const dx = px - cx;
    const dy = py - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [px, py];
    return [px + (dx / len) * dist, py + (dy / len) * dist];
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xs mx-auto" role="img" aria-label="Triangle">
      {/* Triangle fill */}
      <polygon
        points={verts.map(v => v.join(',')).join(' ')}
        fill={c}
        fillOpacity={0.05}
        stroke={c}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Right angle marker */}
      {rightAngle !== undefined && (() => {
        const vi = verts[rightAngle];
        const prev = verts[(rightAngle + 2) % 3];
        const next = verts[(rightAngle + 1) % 3];
        const dx1 = prev[0] - vi[0], dy1 = prev[1] - vi[1];
        const dx2 = next[0] - vi[0], dy2 = next[1] - vi[1];
        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (len1 === 0 || len2 === 0) return null;
        const ux1 = (dx1 / len1) * sq, uy1 = (dy1 / len1) * sq;
        const ux2 = (dx2 / len2) * sq, uy2 = (dy2 / len2) * sq;
        return (
          <path
            d={`M${vi[0] + ux1},${vi[1] + uy1} L${vi[0] + ux1 + ux2},${vi[1] + uy1 + uy2} L${vi[0] + ux2},${vi[1] + uy2}`}
            fill="none"
            stroke={COLORS.red}
            strokeWidth={1.5}
          />
        );
      })()}

      {/* Vertex labels */}
      {labels && labels.map((l, i) => {
        if (!l) return null;
        const [lx, ly] = pushOut(verts[i][0], verts[i][1], 16);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
            fontSize={14} fontWeight="bold" fill={c}>{l}</text>
        );
      })}

      {/* Side labels */}
      {sides && (() => {
        const pairs: [number, number][] = [[0, 1], [1, 2], [2, 0]];
        return pairs.map(([i, j], si) => {
          const s = sides[si];
          if (!s.label) return null;
          const [mx, my] = mid(i, j);
          const [lx, ly] = pushOut(mx, my, 16);
          return (
            <text key={`s${si}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
              fontSize={12} fontWeight="bold" fill={COLORS.red}>{s.label}</text>
          );
        });
      })()}

      {/* Angle labels */}
      {angles && angles.map((a, i) => {
        if (!a.label && !a.value) return null;
        const vx = verts[i][0], vy = verts[i][1];
        const dx = cx - vx, dy = cy - vy;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return null;
        const lx = vx + (dx / len) * 24;
        const ly = vy + (dy / len) * 24;
        return (
          <text key={`a${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
            fontSize={11} fill={COLORS.blue}>{a.label || `${a.value}\u00b0`}</text>
        );
      })}
    </svg>
  );
}
