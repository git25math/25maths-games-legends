import { motion } from 'motion/react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

export const GradeSelectScreen = ({
  lang,
  onSelect,
}: {
  lang: Language;
  onSelect: (grade: number) => void;
}) => {
  const t = translations[lang];
  return (
    <motion.div key="grade-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center space-y-12 py-20">
      <h2 className="text-5xl font-black text-white tracking-tighter">{t.chooseGrade}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[7, 8, 9, 10, 11].map(g => (
          <button
            key={g}
            onClick={() => onSelect(g)}
            className="p-8 bg-white/5 border-2 border-white/10 rounded-3xl text-white hover:bg-indigo-600 hover:border-indigo-400 transition-all group"
          >
            <span className="block text-4xl font-black mb-2 group-hover:scale-110 transition-transform">{g}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t.year}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
