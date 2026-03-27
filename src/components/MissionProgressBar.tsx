import { Fragment } from 'react';
import { motion } from 'motion/react';
import type { Mission } from '../types';

type Props = {
  missions: Mission[];
  completedIds: Set<string>;
  currentId?: number;
};

/**
 * Horizontal progress bar showing mission chain within a unit.
 * ● = completed (green glow), ◉ = current (amber pulse), ○ = locked (dim)
 */
export function MissionProgressBar({ missions, completedIds, currentId }: Props) {
  if (missions.length <= 1) return null;

  return (
    <div className="flex items-center gap-0.5 px-4 py-3 overflow-x-auto scrollbar-none">
      {missions.map((m, i) => {
        const done = completedIds.has(String(m.id));
        const isCurrent = m.id === currentId;
        return (
          <Fragment key={m.id}>
            {/* Node */}
            {isCurrent ? (
              <motion.div
                animate={{ scale: [1, 1.3, 1], boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 8px rgba(251,191,36,0.6)', '0 0 0px rgba(251,191,36,0)'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400/30 flex-shrink-0"
                title={typeof m.title === 'string' ? m.title : m.title.zh}
              />
            ) : (
              <div
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                  done
                    ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.4)]'
                    : 'bg-white/15 border border-white/25'
                }`}
                title={typeof m.title === 'string' ? m.title : m.title.zh}
              />
            )}
            {/* Connector line */}
            {i < missions.length - 1 && (
              <div
                className={`h-0.5 flex-1 min-w-3 max-w-8 flex-shrink ${
                  done ? 'bg-emerald-400/50' : 'bg-white/8'
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
