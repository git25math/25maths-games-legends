import { memo, type ReactNode } from 'react';

interface CharacterConfig {
  bodyColor: string;
  accentColor: string;
  skinColor: string;
  headgear: (cx: number, cy: number, s: number) => ReactNode;
  faceExtra?: (cx: number, cy: number, s: number) => ReactNode;
}

const CHARACTER_CONFIGS: Record<string, CharacterConfig> = {
  caocao: {
    bodyColor: '#1a3a5c',
    accentColor: '#d4a017',
    skinColor: '#f5d6b8',
    headgear: (cx, cy, s) => (
      <g>
        {/* Gold crown */}
        <rect x={cx - s * 0.38} y={cy - s * 0.48} width={s * 0.76} height={s * 0.18} rx={s * 0.02} fill="#d4a017" />
        <polygon points={`${cx - s * 0.3},${cy - s * 0.48} ${cx - s * 0.22},${cy - s * 0.62} ${cx - s * 0.14},${cy - s * 0.48}`} fill="#d4a017" />
        <polygon points={`${cx - s * 0.08},${cy - s * 0.48} ${cx},${cy - s * 0.66} ${cx + s * 0.08},${cy - s * 0.48}`} fill="#d4a017" />
        <polygon points={`${cx + s * 0.14},${cy - s * 0.48} ${cx + s * 0.22},${cy - s * 0.62} ${cx + s * 0.3},${cy - s * 0.48}`} fill="#d4a017" />
        {/* Crown gem */}
        <circle cx={cx} cy={cy - s * 0.4} r={s * 0.04} fill="#e74c3c" />
      </g>
    ),
  },
  liubei: {
    bodyColor: '#2d6a2e',
    accentColor: '#4a9e4b',
    skinColor: '#f5d6b8',
    headgear: (cx, cy, s) => (
      <g>
        {/* Green headband */}
        <rect x={cx - s * 0.4} y={cy - s * 0.38} width={s * 0.8} height={s * 0.1} rx={s * 0.03} fill="#4a9e4b" />
        {/* Headband knot on right */}
        <ellipse cx={cx + s * 0.4} cy={cy - s * 0.33} rx={s * 0.08} ry={s * 0.06} fill="#4a9e4b" />
        <ellipse cx={cx + s * 0.46} cy={cy - s * 0.28} rx={s * 0.06} ry={s * 0.04} fill="#3d8b3e" />
        {/* Hair bun */}
        <ellipse cx={cx} cy={cy - s * 0.42} rx={s * 0.18} ry={s * 0.12} fill="#1a1a1a" />
      </g>
    ),
  },
  guanyu: {
    bodyColor: '#2d6a2e',
    accentColor: '#4a9e4b',
    skinColor: '#8b0000',
    headgear: (cx, cy, s) => (
      <g>
        {/* Green hat/headband */}
        <rect x={cx - s * 0.36} y={cy - s * 0.44} width={s * 0.72} height={s * 0.14} rx={s * 0.04} fill="#2d6a2e" />
        <ellipse cx={cx} cy={cy - s * 0.44} rx={s * 0.3} ry={s * 0.1} fill="#2d6a2e" />
      </g>
    ),
    faceExtra: (cx, cy, s) => (
      <g>
        {/* Long flowing beard */}
        <path
          d={`M${cx - s * 0.18},${cy + s * 0.12} Q${cx - s * 0.22},${cy + s * 0.35} ${cx - s * 0.14},${cy + s * 0.48} Q${cx},${cy + s * 0.52} ${cx + s * 0.14},${cy + s * 0.48} Q${cx + s * 0.22},${cy + s * 0.35} ${cx + s * 0.18},${cy + s * 0.12}`}
          fill="#1a1a1a"
        />
        {/* Beard strands */}
        <path d={`M${cx - s * 0.08},${cy + s * 0.2} Q${cx - s * 0.1},${cy + s * 0.38} ${cx - s * 0.06},${cy + s * 0.46}`} stroke="#333" strokeWidth={s * 0.01} fill="none" />
        <path d={`M${cx + s * 0.08},${cy + s * 0.2} Q${cx + s * 0.1},${cy + s * 0.38} ${cx + s * 0.06},${cy + s * 0.46}`} stroke="#333" strokeWidth={s * 0.01} fill="none" />
      </g>
    ),
  },
  zhugeliang: {
    bodyColor: '#5c4033',
    accentColor: '#8b7355',
    skinColor: '#f5d6b8',
    headgear: (cx, cy, s) => (
      <g>
        {/* Turban */}
        <ellipse cx={cx} cy={cy - s * 0.38} rx={s * 0.32} ry={s * 0.18} fill="#5c4033" />
        <rect x={cx - s * 0.28} y={cy - s * 0.42} width={s * 0.56} height={s * 0.12} rx={s * 0.04} fill="#6b5243" />
        {/* White feather fan held up */}
        <g transform={`translate(${cx + s * 0.32},${cy - s * 0.1}) rotate(-20)`}>
          <rect x={0} y={0} width={s * 0.04} height={s * 0.22} rx={s * 0.01} fill="#8b7355" />
          <ellipse cx={s * 0.02} cy={-s * 0.04} rx={s * 0.14} ry={s * 0.12} fill="white" opacity={0.9} />
          <ellipse cx={s * 0.02} cy={-s * 0.04} rx={s * 0.12} ry={s * 0.1} fill="none" stroke="#ddd" strokeWidth={s * 0.008} />
          {/* Fan ribs */}
          <line x1={s * 0.02} y1={s * 0.02} x2={-s * 0.08} y2={-s * 0.1} stroke="#ccc" strokeWidth={s * 0.006} />
          <line x1={s * 0.02} y1={s * 0.02} x2={s * 0.02} y2={-s * 0.14} stroke="#ccc" strokeWidth={s * 0.006} />
          <line x1={s * 0.02} y1={s * 0.02} x2={s * 0.12} y2={-s * 0.1} stroke="#ccc" strokeWidth={s * 0.006} />
        </g>
      </g>
    ),
  },
  sunquan: {
    bodyColor: '#c41e3a',
    accentColor: '#d4a017',
    skinColor: '#f5d6b8',
    headgear: (cx, cy, s) => (
      <g>
        {/* Red helmet */}
        <ellipse cx={cx} cy={cy - s * 0.36} rx={s * 0.36} ry={s * 0.22} fill="#c41e3a" />
        <rect x={cx - s * 0.36} y={cy - s * 0.36} width={s * 0.72} height={s * 0.1} rx={s * 0.02} fill="#c41e3a" />
        {/* Gold trim band */}
        <rect x={cx - s * 0.38} y={cy - s * 0.3} width={s * 0.76} height={s * 0.05} rx={s * 0.01} fill="#d4a017" />
        {/* Helmet top ornament */}
        <circle cx={cx} cy={cy - s * 0.52} r={s * 0.05} fill="#d4a017" />
        <rect x={cx - s * 0.015} y={cy - s * 0.52} width={s * 0.03} height={s * 0.12} fill="#d4a017" />
      </g>
    ),
  },
  diaochan: {
    bodyColor: '#d4739d',
    accentColor: '#e8a0bf',
    skinColor: '#fce4d6',
    headgear: (cx, cy, s) => (
      <g>
        {/* Hair bun */}
        <ellipse cx={cx} cy={cy - s * 0.44} rx={s * 0.24} ry={s * 0.16} fill="#1a1a1a" />
        <ellipse cx={cx} cy={cy - s * 0.52} rx={s * 0.14} ry={s * 0.1} fill="#1a1a1a" />
        {/* Pink flower hairpin */}
        <g transform={`translate(${cx + s * 0.16},${cy - s * 0.52})`}>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={i}
              cx={Math.cos((angle * Math.PI) / 180) * s * 0.06}
              cy={Math.sin((angle * Math.PI) / 180) * s * 0.06}
              rx={s * 0.04}
              ry={s * 0.06}
              fill="#ff85a2"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx={0} cy={0} r={s * 0.03} fill="#ffd700" />
        </g>
        {/* Hair strands framing face */}
        <path d={`M${cx - s * 0.32},${cy - s * 0.2} Q${cx - s * 0.38},${cy + s * 0.05} ${cx - s * 0.3},${cy + s * 0.15}`} stroke="#1a1a1a" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
        <path d={`M${cx + s * 0.32},${cy - s * 0.2} Q${cx + s * 0.38},${cy + s * 0.05} ${cx + s * 0.3},${cy + s * 0.15}`} stroke="#1a1a1a" strokeWidth={s * 0.04} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
};

const FALLBACK_CONFIG: CharacterConfig = {
  bodyColor: '#3d2b1f',
  accentColor: '#f4e4bc',
  skinColor: '#f5d6b8',
  headgear: () => null,
};

export const CharacterAvatar = memo(function CharacterAvatar({
  characterId,
  size = 48,
  speaking = false,
}: {
  characterId: string;
  size?: number;
  speaking?: boolean;
}) {
  const config = CHARACTER_CONFIGS[characterId] ?? FALLBACK_CONFIG;
  const cx = size / 2;
  const cy = size / 2;
  const s = size;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={speaking ? 'animate-[avatar-bounce_0.6s_ease-in-out_infinite]' : ''}
      style={{ flexShrink: 0 }}
    >
      <style>{`
        @keyframes avatar-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>

      {/* Body (small, Q-style) */}
      <rect
        x={cx - s * 0.22}
        y={cy + s * 0.24}
        width={s * 0.44}
        height={s * 0.24}
        rx={s * 0.08}
        fill={config.bodyColor}
      />
      {/* Collar accent */}
      <path
        d={`M${cx - s * 0.1},${cy + s * 0.24} L${cx},${cy + s * 0.32} L${cx + s * 0.1},${cy + s * 0.24}`}
        fill={config.accentColor}
      />

      {/* Big head (Q-style: head takes ~60% of total height) */}
      <circle cx={cx} cy={cy - s * 0.04} r={s * 0.32} fill={config.skinColor} />

      {/* Headgear */}
      {config.headgear(cx, cy - s * 0.04, s)}

      {/* Eyes */}
      <ellipse cx={cx - s * 0.1} cy={cy - s * 0.02} rx={s * 0.04} ry={s * 0.05} fill="#1a1a1a" />
      <ellipse cx={cx + s * 0.1} cy={cy - s * 0.02} rx={s * 0.04} ry={s * 0.05} fill="#1a1a1a" />
      {/* Eye highlights */}
      <circle cx={cx - s * 0.085} cy={cy - s * 0.035} r={s * 0.015} fill="white" />
      <circle cx={cx + s * 0.115} cy={cy - s * 0.035} r={s * 0.015} fill="white" />

      {/* Eyebrows */}
      <line x1={cx - s * 0.15} y1={cy - s * 0.1} x2={cx - s * 0.05} y2={cy - s * 0.11} stroke="#3d2b1f" strokeWidth={s * 0.02} strokeLinecap="round" />
      <line x1={cx + s * 0.05} y1={cy - s * 0.11} x2={cx + s * 0.15} y2={cy - s * 0.1} stroke="#3d2b1f" strokeWidth={s * 0.02} strokeLinecap="round" />

      {/* Mouth — small smile */}
      <path
        d={`M${cx - s * 0.06},${cy + s * 0.08} Q${cx},${cy + s * 0.13} ${cx + s * 0.06},${cy + s * 0.08}`}
        fill="none"
        stroke="#8b4513"
        strokeWidth={s * 0.015}
        strokeLinecap="round"
      />

      {/* Blush cheeks */}
      <ellipse cx={cx - s * 0.18} cy={cy + s * 0.04} rx={s * 0.05} ry={s * 0.03} fill="#ffb6c1" opacity={0.5} />
      <ellipse cx={cx + s * 0.18} cy={cy + s * 0.04} rx={s * 0.05} ry={s * 0.03} fill="#ffb6c1" opacity={0.5} />

      {/* Extra face features (e.g. Guan Yu's beard) */}
      {config.faceExtra?.(cx, cy - s * 0.04, s)}
    </svg>
  );
});
