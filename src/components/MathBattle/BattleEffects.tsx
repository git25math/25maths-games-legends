/**
 * BattleEffects — Streak milestone flash + floating score + micro-encouragement (v8.4 refactor)
 */
import { AnimatePresence, motion } from 'motion/react';
import type { Language } from '../../types';
import { translations } from '../../i18n/translations';

/** Short, punchy encouragement for correct answers — rotate randomly */
const CORRECT_CHEERS: { zh: string; en: string }[] = [
  { zh: '漂亮！', en: 'Nice!' },
  { zh: '就是这样！', en: 'That\'s it!' },
  { zh: '稳！', en: 'Solid!' },
  { zh: '这是你挣来的。', en: 'You earned this.' },
  { zh: '感觉到了吗？', en: 'Feel that?' },
  { zh: '又进一步！', en: 'One step closer!' },
  { zh: '太强了！', en: 'Powerful!' },
  { zh: '拿下！', en: 'Got it!' },
];

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
            <div className="text-sm font-bold text-yellow-200/80 mt-1">
              {streakMilestone >= 5
                ? (lang === 'en' ? "You're unstoppable." : '势不可挡。')
                : streakMilestone >= 3
                ? (lang === 'en' ? 'You found your rhythm!' : '你找到节奏了！')
                : (lang === 'en' ? 'Keep going!' : '继续保持！')}
            </div>
            {streakMilestone === 5 && (
              <div className="text-lg font-black text-amber-300 mt-1">{t.streakToken} +1</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Score + Micro-Encouragement */}
      <AnimatePresence>
        {floatingScore && (
          <motion.div
            key={floatingScore.key}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -60, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none z-30 text-center"
          >
            <div className="text-3xl font-black text-yellow-500 drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {floatingScore.value}
            </div>
            {!floatingScore.value.startsWith('-') && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-bold text-emerald-300 mt-1 drop-shadow"
              >
                {(() => { const c = CORRECT_CHEERS[floatingScore.key % CORRECT_CHEERS.length]; return lang === 'en' ? c.en : c.zh; })()}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
