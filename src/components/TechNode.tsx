import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, AlertTriangle, Loader2, Zap } from 'lucide-react';
import type { Language } from '../types';
import type { TechNodeStatus, TechNodeState } from '../utils/techTree';
import type { Topic } from '../data/curriculum/kp-registry';
import { lt } from '../i18n/resolveText';

const STATUS_CONFIG: Record<TechNodeStatus, {
  ring: string;
  bg: string;
  text: string;
  glow: string;
  icon: typeof Lock;
}> = {
  locked: {
    ring: 'border-white/10',
    bg: 'bg-slate-800/80',
    text: 'text-white/20',
    glow: '',
    icon: Lock,
  },
  available: {
    ring: 'border-cyan-400/50',
    bg: 'bg-cyan-950/50',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.2)]',
    icon: Zap,
  },
  researching: {
    ring: 'border-amber-400/50',
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.2)]',
    icon: Loader2,
  },
  unlocked: {
    ring: 'border-emerald-400/50',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.2)]',
    icon: CheckCircle2,
  },
  corrupted: {
    ring: 'border-rose-400/50',
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_12px_rgba(251,113,133,0.3)]',
    icon: AlertTriangle,
  },
  at_risk: {
    ring: 'border-orange-400/40',
    bg: 'bg-orange-950/30',
    text: 'text-orange-400',
    glow: 'shadow-[0_0_8px_rgba(251,146,60,0.15)]',
    icon: AlertTriangle,
  },
};

export const TechNode = ({
  lang,
  topic,
  state,
  isFirst,
  onClick,
}: {
  key?: any;
  lang: Language;
  topic: Topic;
  state: TechNodeState;
  isFirst: boolean;
  onClick: () => void;
}) => {
  const config = STATUS_CONFIG[state.status];
  const Icon = config.icon;
  const isLocked = state.status === 'locked';
  const isClickable = !isLocked;
  const title = lang === 'en' ? topic.title : topic.titleZh;
  const [showLockedHint, setShowLockedHint] = useState(false);

  const handleClick = () => {
    if (isLocked) {
      setShowLockedHint(true);
      setTimeout(() => setShowLockedHint(false), 2000);
      return;
    }
    onClick();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Connecting line from previous node */}
      {!isFirst && (
        <div className={`w-0.5 h-6 ${
          state.status === 'locked' ? 'bg-white/5' :
          state.status === 'corrupted' ? 'bg-rose-400/30' :
          'bg-white/20'
        }`} />
      )}

      {/* Node */}
      <motion.button
        onClick={handleClick}
        whileTap={isClickable ? { scale: 0.95 } : undefined}
        className={`relative w-full rounded-2xl border-2 p-3 transition-all ${config.ring} ${config.bg} ${config.glow} ${
          isClickable ? 'cursor-pointer hover:brightness-110' : 'cursor-default opacity-60'
        }`}
      >
        {/* Corruption crack effect — pulsing glow + subtle scale */}
        {state.status === 'corrupted' && (
          <motion.div
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 0 0px rgba(251,113,133,0)',
                '0 0 12px rgba(251,113,133,0.4)',
                '0 0 0px rgba(251,113,133,0)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl border-2 border-rose-500/40 pointer-events-none"
          />
        )}

        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} border ${config.ring}`}>
            <Icon size={14} className={config.text} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className={`text-xs font-bold truncate ${config.text}`}>{topic.id}</p>
            <p className="text-[10px] text-white/40 truncate">{title}</p>
          </div>
          {state.total > 0 && (
            <span className={`text-[10px] font-bold ${config.text}`}>
              {state.progress}/{state.total}
            </span>
          )}
        </div>

        {/* Progress bar for researching/available nodes */}
        {state.total > 0 && state.status !== 'locked' && (
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((state.progress / state.total) * 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                state.status === 'corrupted' ? 'bg-rose-400' :
                state.status === 'at_risk' ? 'bg-orange-400' :
                state.status === 'unlocked' ? 'bg-emerald-400' :
                state.status === 'researching' ? 'bg-amber-400' :
                'bg-cyan-400'
              }`}
            />
          </div>
        )}

        {/* Corruption label */}
        {state.corruptionPattern && (
          <div className="mt-1.5 flex items-center gap-1">
            <AlertTriangle size={10} className="text-rose-400" />
            <span className="text-[9px] text-rose-400 font-bold">
              {state.corruptionPattern === 'sign' ? '±' :
               state.corruptionPattern === 'rounding' ? '≈' :
               state.corruptionPattern === 'magnitude' ? '×10' :
               state.corruptionPattern === 'method' ? '?' : '!'}
              {' '}
              {lang === 'en' ? 'Corrupted' : lang === 'zh_TW' ? '受損' : '受损'}
            </span>
          </div>
        )}

        {/* At risk label — upstream node corrupted */}
        {state.upstreamCorrupted && state.status === 'at_risk' && (
          <div className="mt-1.5 flex items-center gap-1">
            <AlertTriangle size={10} className="text-orange-400" />
            <span className="text-[9px] text-orange-400 font-bold">
              {lang === 'en' ? `Upstream ${state.upstreamCorrupted} unstable` : lang === 'zh_TW' ? `上游 ${state.upstreamCorrupted} 不穩定` : `上游 ${state.upstreamCorrupted} 不稳定`}
            </span>
          </div>
        )}
      </motion.button>

      {/* Locked hint tooltip */}
      <AnimatePresence>
        {showLockedHint && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 px-2 py-1 bg-slate-700 border border-white/10 rounded-lg text-[10px] text-white/60 whitespace-nowrap"
          >
            🔒 {lang === 'en' ? 'Complete previous topics first' : lang === 'zh_TW' ? '請先完成前置課題' : '请先完成前置课题'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
