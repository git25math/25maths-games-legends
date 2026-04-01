import { useState } from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { getTranslations } from '../i18n/translations';
import { buttonBase } from '../utils/animationPresets';
import { JoinClassModal } from '../components/JoinClassModal';

export const GradeSelectScreen = ({
  lang,
  onSelect,
}: {
  lang: Language;
  onSelect: (grade: number, className?: string) => void;
}) => {
  const t = getTranslations(lang);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <motion.div key="grade-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center space-y-12 py-20">
      <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">{t.chooseGrade}</h2>

      {/* Grade buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
        {[7, 8, 9, 10, 11].map(g => (
          <motion.button
            key={g}
            {...buttonBase}
            onClick={() => setSelectedGrade(g)}
            animate={selectedGrade === g ? { scale: 1.05, borderColor: '#818cf8' } : { scale: 1, borderColor: 'rgba(255,255,255,0.1)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`p-4 sm:p-8 min-h-[72px] border-2 rounded-3xl text-white group focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              selectedGrade === g
                ? 'bg-indigo-600'
                : 'bg-white/5 hover:bg-indigo-600/50'
            }`}
          >
            <span className="block text-4xl font-black mb-2">{g}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t.year}</span>
          </motion.button>
        ))}
      </div>

      {/* Invite code prompt */}
      {selectedGrade && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-lg font-bold text-white/80">{t.classPrompt}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              {...buttonBase}
              onClick={() => setShowJoinModal(true)}
              className="px-8 py-3 min-h-[44px] bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all min-w-[10rem]"
            >
              🎟️ {t.hasCode}
            </motion.button>
            <motion.button
              {...buttonBase}
              onClick={() => onSelect(selectedGrade)}
              className="px-6 py-3 min-h-[44px] bg-white/10 border border-white/20 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40 transition-all"
            >
              {t.skipForNow}
            </motion.button>
          </div>

          <p className="text-xs text-white/30 max-w-xs">{t.joinedHint}</p>
        </motion.div>
      )}

      {/* Join Class Modal */}
      {showJoinModal && selectedGrade && (
        <JoinClassModal
          lang={lang}
          onJoined={(cls) => {
            setShowJoinModal(false);
            onSelect(selectedGrade, cls);
          }}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </motion.div>
  );
};
