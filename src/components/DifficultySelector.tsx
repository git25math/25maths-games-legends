import { motion } from 'motion/react';
import { Shield, Sparkles, Sword } from 'lucide-react';
import type { DifficultyMode, Language, MissionCompletion } from '../types';
import { translations } from '../i18n/translations';

const DIFFICULTY_CONFIG: { mode: DifficultyMode; icon: typeof Shield; colors: string; multiplier: number }[] = [
  { mode: 'green', icon: Shield, colors: 'from-emerald-500 to-emerald-700 border-emerald-400', multiplier: 1 },
  { mode: 'amber', icon: Sparkles, colors: 'from-amber-500 to-amber-700 border-amber-400', multiplier: 1.5 },
  { mode: 'red', icon: Sword, colors: 'from-rose-500 to-rose-700 border-rose-400', multiplier: 2 },
];

export const DifficultySelector = ({
  lang,
  completion,
  onSelect,
  onClose,
}: {
  lang: Language;
  completion?: MissionCompletion;
  onSelect: (mode: DifficultyMode) => void;
  onClose: () => void;
}) => {
  const t = translations[lang];
  const comp = completion || { green: false, amber: false, red: false };

  const isUnlocked = (mode: DifficultyMode): boolean => {
    if (mode === 'green') return true;
    if (mode === 'amber') return comp.green;
    if (mode === 'red') return comp.amber;
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#f4e4bc] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-8 border-[#3d2b1f] p-8"
      >
        <h2 className="text-2xl font-black text-[#3d2b1f] text-center mb-8">{t.chooseDifficulty}</h2>
        <div className="space-y-4">
          {DIFFICULTY_CONFIG.map(({ mode, icon: Icon, colors, multiplier }) => {
            const unlocked = isUnlocked(mode);
            const completed = comp[mode];
            return (
              <button
                key={mode}
                disabled={!unlocked}
                onClick={() => onSelect(mode)}
                className={`w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                  unlocked
                    ? `bg-gradient-to-r ${colors} text-white hover:scale-[1.02] shadow-lg`
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300'
                }`}
              >
                <Icon size={32} />
                <div className="flex-1 text-left">
                  <div className="font-black text-lg">{t.difficultyMode[mode]}</div>
                  <div className="text-sm opacity-80">{t.difficultyModeDesc[mode]}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-xl">{t.difficultyMultiplier[mode]}</div>
                  {completed && <div className="text-xs font-bold opacity-80">✓</div>}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#3d2b1f] text-[#f4e4bc] font-black rounded-xl hover:bg-[#5c4033] transition-all"
        >
          {lang === 'zh' ? '返回' : 'Back'}
        </button>
      </motion.div>
    </motion.div>
  );
};
