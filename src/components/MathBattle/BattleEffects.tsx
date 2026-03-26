/**
 * BattleEffects — Streak milestone flash + floating score animation (v8.4 refactor)
 */
import { AnimatePresence, motion } from 'motion/react';
import type { Language } from '../../types';
import { translations } from '../../i18n/translations';

type Props = {
  lang: Language;
  streakMilestone: number | null;
  floatingScore: { value: string; key: number } | null;
};

export function BattleEffects({ lang, streakMilestone, floatingScore }: Props) {
  const t = translations[lang];

  return (
    <>
      {/* Streak Milestone Golden Flash */}
      <AnimatePresence>
        {streakMilestone && (
          <motion.div
            key={`milestone-${streakMilestone}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-to-b from-yellow-400/30 via-yellow-500/10 to-transparent pointer-events-none z-[25]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {streakMilestone && (
          <motion.div
            key={`milestone-text-${streakMilestone}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 text-center"
          >
            <div className="text-5xl font-black text-yellow-400 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(250,204,21,0.5)' }}>
              {streakMilestone} {t.streakLabel}!
            </div>
            {streakMilestone === 5 && (
              <div className="text-lg font-black text-amber-300 mt-1">{t.streakToken} +1</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Score Animation */}
      <AnimatePresence>
        {floatingScore && (
          <motion.div
            key={floatingScore.key}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -60, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none z-30 text-3xl font-black text-yellow-500 drop-shadow-lg"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {floatingScore.value}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
