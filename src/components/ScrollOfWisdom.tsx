import { motion } from 'motion/react';
import { BookOpen, XCircle, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import type { Mission, Language } from '../types';
import type { ErrorType } from '../utils/diagnoseError';
import { translations } from '../i18n/translations';
import { lt, resolveFormula } from '../i18n/resolveText';
import { MathView, LatexText } from './MathView';
import { getPattern } from '../utils/errorPatterns';

const ERROR_TIPS: Record<ErrorType, { zh: string; en: string }> = {
  sign: { zh: '注意正负号！上次你在这里犯了符号错误', en: 'Watch your signs! You made a sign error here before' },
  rounding: { zh: '小心四舍五入和小数点', en: 'Be careful with rounding and decimals' },
  magnitude: { zh: '检查量级——上次你的答案差了好几倍', en: 'Check the magnitude — your answer was off by a factor last time' },
  method: { zh: '方法对了但计算出错——仔细算每一步', en: 'Method was right but calculation was wrong — work through each step carefully' },
  unknown: { zh: '这道题需要多想一步，别着急', en: 'Take your time with this one — think it through' },
};

const ERROR_TO_PATTERN: Record<string, string> = {
  sign: 'sign_distribution', rounding: 'generic_number', magnitude: 'generic_number', method: 'generic_algebra',
};

export const ScrollOfWisdom = ({ mission, lang, onClose, errorHint }: {
  mission: Mission; lang: Language; onClose: () => void;
  errorHint?: { count: number; dominant: ErrorType | null } | null;
}) => {
  const t = translations[lang];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
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
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <motion.section 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
              <Sparkles size={18} />
              {t.secretConcept}
            </h3>
            <LatexText text={lt(mission.secret.concept, lang)} className="text-amber-900/80 leading-relaxed" />
          </motion.section>
          <motion.section 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }}
            className="bg-white/50 p-4 rounded-2xl border-2 border-amber-100"
          >
            <h3 className="text-amber-800 font-bold mb-2 uppercase text-xs tracking-widest">{t.secretFormula}</h3>
            <div className="text-center py-2">
              <MathView tex={resolveFormula(mission.secret.formula, lang)} inline={false} className="text-2xl font-black text-indigo-600" />
            </div>
          </motion.section>
          <motion.section
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
              <Zap size={18} />
              {t.secretTips}
            </h3>
            <ul className="space-y-2">
              {mission.secret.tips.map((tip, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-2 text-amber-900/70"
                >
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <LatexText text={lt(tip, lang)} />
                </motion.li>
              ))}
            </ul>
          </motion.section>
          {errorHint && errorHint.count >= 2 && errorHint.dominant && (() => {
            const pattern = getPattern(ERROR_TO_PATTERN[errorHint.dominant] ?? '');
            return (
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4"
              >
                <h3 className="text-rose-700 font-bold text-xs mb-1 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  {lang === 'en' ? 'Advisor\'s Warning' : '军师提醒'}
                  {pattern && <span className="ml-1 opacity-60">{pattern.icon}</span>}
                </h3>
                <p className="text-rose-600/80 text-sm">
                  {lang === 'en' ? ERROR_TIPS[errorHint.dominant].en : ERROR_TIPS[errorHint.dominant].zh}
                </p>
                {pattern && (
                  <p className="text-rose-500/70 text-xs mt-1.5 italic">
                    {lang === 'en' ? pattern.recoveryHint.en : pattern.recoveryHint.zh}
                  </p>
                )}
                <p className="text-rose-400 text-[10px] mt-1">
                  {lang === 'en' ? `(${errorHint.count} errors on record)` : `(历史错误 ${errorHint.count} 次)`}
                </p>
              </motion.section>
            );
          })()}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-xl transition-all min-h-12"
          >
            {t.imReady}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
