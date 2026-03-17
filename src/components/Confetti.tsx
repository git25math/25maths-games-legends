import { memo, useEffect, useMemo, useState } from "react";

const COLORS = ["#FFD700", "#8b0000", "#2d6a2e", "#b8860b", "#4f46e5", "#ef4444", "#f59e0b", "#fff"];
const PARTICLE_COUNT = 60;
const DURATION_MS = 3000;

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  color: string;
  delay: number;
  width: number;
  height: number;
  rotation: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  id: number;
}

export const Confetti = memo(function Confetti({ active }: ConfettiProps) {
  const [visible, setVisible] = useState(false);

  // Regenerate random values each time active flips to true
  const particles = useMemo<Particle[]>(() => {
    if (!active) return [];
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 280;
      const sx = (Math.random() - 0.5) * 60;
      const sy = (Math.random() - 0.5) * 60;
      return {
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 500,
        width: Math.random() > 0.5 ? 10 : 7,
        height: Math.random() > 0.5 ? 10 : 14,
        rotation: Math.random() * 1080 - 540,
        startX: sx,
        startY: sy,
        endX: sx + Math.cos(angle) * distance,
        endY: sy + Math.sin(angle) * distance + 100, // gravity pull
      };
    });
  }, [active]);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(timer);
  }, [active]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style>{`
        @keyframes confetti-burst {
          0% {
            transform: translate(var(--cb-sx), var(--cb-sy)) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--cb-ex), var(--cb-ey)) rotate(var(--cb-r));
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: 1,
            opacity: 0,
            animation: `confetti-burst 1.5s ease-out ${p.delay}ms forwards`,
            ["--cb-sx" as string]: `${p.startX}px`,
            ["--cb-sy" as string]: `${p.startY}px`,
            ["--cb-ex" as string]: `${p.endX}px`,
            ["--cb-ey" as string]: `${p.endY}px`,
            ["--cb-r" as string]: `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
});
