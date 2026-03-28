import { useState } from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { buttonBase } from '../utils/animationPresets';
import { JoinClassModal } from '../components/JoinClassModal';

export const GradeSelectScreen = ({
  lang,
  onSelect,
}: {
  lang: Language;
  onSelect: (grade: number, className?: string) => void;
}) => {
  const t = translations[lang];
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const LABELS = {
    zh: { classPrompt: '你有老师给的邀请码吗？', hasCode: '有邀请码', noCode: '暂时跳过，稍后加入', joinedHint: '没有邀请码也可以先玩——随时可以在设置中加入班级。' },
    zh_TW: { classPrompt: '你有老師給的邀請碼嗎？', hasCode: '有邀請碼', noCode: '暫時跳過，稍後加入', joinedHint: '沒有邀請碼也可以先玩——隨時可以在設定中加入班級。' },
    en: { classPrompt: 'Do you have a class invite code from your teacher?', hasCode: 'I have a code', noCode: 'Skip for now', joinedHint: 'No code? No worries — you can join a class anytime from settings.' },
  };
  const l = LABELS[lang] || LABELS.zh;

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
            className={`p-4 sm:p-8 border-2 rounded-3xl text-white group ${
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

      {/* Invite code prompt — replaces manual class input */}
      {selectedGrade && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-lg font-bold text-white/80">{l.classPrompt}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              {...buttonBase}
              onClick={() => setShowJoinModal(true)}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-500 transition-all min-w-[10rem]"
            >
              🎟️ {l.hasCode}
            </motion.button>
            <motion.button
              {...buttonBase}
              onClick={() => onSelect(selectedGrade)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition-all"
            >
              {l.noCode}
            </motion.button>
          </div>

          <p className="text-xs text-white/30 max-w-xs">{l.joinedHint}</p>
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
