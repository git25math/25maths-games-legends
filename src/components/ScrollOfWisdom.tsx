import { motion } from 'motion/react';
import { BookOpen, XCircle, Sparkles, Zap } from 'lucide-react';
import type { Mission, Language } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { MathView, LatexText } from './MathView';

export const ScrollOfWisdom = ({ mission, lang, onClose }: { mission: Mission; lang: Language; onClose: () => void }) => {
  const t = translations[lang];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
    >
      <div className="bg-amber-50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-8 border-amber-200">
        <div className="bg-amber-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-amber-900 flex items-center gap-2">
            <BookOpen size={28} />
            {t.secretBook}
          </h2>
          <button onClick={onClose} className="text-amber-900 hover:bg-amber-300 p-2 rounded-full transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-5 md:p-8 space-y-6">
          <section>
            <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
              <Sparkles size={18} />
              {t.secretConcept}
            </h3>
            <LatexText text={lt(mission.secret.concept, lang)} className="text-amber-900/80 leading-relaxed" />
          </section>
          <section className="bg-white/50 p-4 rounded-2xl border-2 border-amber-100">
            <h3 className="text-amber-800 font-bold mb-2 uppercase text-xs tracking-widest">{t.secretFormula}</h3>
            <div className="text-center py-2">
              <MathView tex={mission.secret.formula.replace(/\$/g, '')} inline={false} className="text-2xl font-black text-indigo-600" />
            </div>
          </section>
          <section>
            <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
              <Zap size={18} />
              {t.secretTips}
            </h3>
            <ul className="space-y-2">
              {mission.secret.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-amber-900/70">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <LatexText text={lt(tip, lang)} />
                </li>
              ))}
            </ul>
          </section>
          <button
            onClick={onClose}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-xl transition-all min-h-12"
          >
            {t.imReady}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
