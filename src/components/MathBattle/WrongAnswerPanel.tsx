import { motion } from 'motion/react';
import { AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import type { Language } from '../../types';
import { MathView } from '../MathView';
import { lt } from '../../i18n/resolveText';
import { INPUT_FIELDS } from './inputConfig';
import { staggerContainer, staggerItem } from '../../utils/animationPresets';
import { parseAnswer } from '../../utils/parseAnswer';

const LABELS = {
  zh: {
    title: '系统故障诊断',
    partialTitle: '信号偏差已修正',
    partialHint: '算法逻辑正确，数值解析误差',
    yourAnswer: '输入数值',
    correctAnswer: '预期数值',
    explanation: '逻辑参照',
    continue: '重置诊断程序',
  },
  zh_TW: {
    title: '系統故障診斷',
    partialTitle: '信號偏差已修正',
    partialHint: '算法邏輯正確，數值解析誤差',
    yourAnswer: '輸入數值',
    correctAnswer: '預期數值',
    explanation: '邏輯參照',
    continue: '重置診斷程序',
  },
  en: {
    title: 'SYSTEM_DIAGNOSTIC',
    partialTitle: 'SIGNAL_DEVIATION_DETECTED',
    partialHint: 'Logic verified // Precision error',
    yourAnswer: 'UPLINK_VAL',
    correctAnswer: 'EXPECTED_VAL',
    explanation: 'LOGIC_REFERENCE',
    continue: 'RESOLVE_DIAGNOSTIC',
  },
} as const;

type Props = {
  questionType: string;
  userInputs: Record<string, string>;
  expected: Record<string, string>;
  formula: string;
  tutorialSteps?: { text: { zh: string; en: string } }[];
  lang: Language;
  onContinue: () => void;
  continueLabel?: string;
  storyText?: string;
  isPartial?: boolean;
  partialScore?: number;
};

export function WrongAnswerPanel({
  questionType,
  userInputs,
  expected,
  formula,
  tutorialSteps,
  lang,
  onContinue,
  continueLabel,
  storyText,
  isPartial = false,
  partialScore,
}: Props) {
  const t = LABELS[lang];
  const fc = INPUT_FIELDS[questionType as keyof typeof INPUT_FIELDS] || { zh: [], en: [] };
  const fields = fc[lang as keyof typeof fc] || fc[lang === 'zh_TW' ? 'zh' : 'zh'] || [];

  const relevantFields = fields.filter(f => expected[f.id] !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-2xl p-6 space-y-6 border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
        isPartial 
          ? 'bg-amber-500/5 border-amber-500/30 shadow-amber-500/10' 
          : 'bg-red-500/5 border-red-500/30 shadow-red-500/10'
      }`}
    >
      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:100%_2px] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(255,255,255,0.2)_50%)]" />

      {/* Header */}
      <div className={`flex items-center gap-3 font-mono ${isPartial ? 'text-amber-400' : 'text-red-500'}`}>
        <div className={`p-2 rounded-lg ${isPartial ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
          {isPartial ? <Activity size={18} /> : <AlertTriangle size={18} />}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-50">Diagnostic_Status</span>
          <span className="text-sm font-black uppercase tracking-widest">{isPartial ? t.partialTitle : t.title}</span>
        </div>
        {isPartial && partialScore !== undefined && (
          <div className="ml-auto px-3 py-1 bg-amber-500/20 rounded-full font-mono text-[10px] font-bold border border-amber-500/30">
            SYNC_YIELD: +{partialScore} (50%)
          </div>
        )}
      </div>

      {/* Hint/Status Text */}
      <div className={`font-mono text-[11px] p-3 rounded-xl border border-dashed uppercase tracking-widest ${
        isPartial ? 'bg-amber-500/10 border-amber-500/20 text-amber-200/70' : 'bg-red-500/10 border-red-500/20 text-red-400/70'
      }`}>
        {isPartial ? t.partialHint : 'CORE_CALCULATION_MISMATCH'}
      </div>

      {/* Answer Data Comparison */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {relevantFields.map(field => {
          const userVal = userInputs[field.id] || '—';
          const correctVal = expected[field.id] || '?';
          const fieldCorrect = isPartial && userVal !== '—' && correctVal !== '?' &&
            !isNaN(parseAnswer(userVal)) && !isNaN(parseFloat(correctVal)) &&
            Math.abs(parseAnswer(userVal) - parseFloat(correctVal)) < 0.01;
          
          return (
            <motion.div variants={staggerItem} key={field.id} className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 border transition-all ${
                fieldCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 
                isPartial ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className={`text-[9px] font-mono font-bold uppercase mb-2 tracking-widest ${
                  fieldCorrect ? 'text-emerald-400/60' : isPartial ? 'text-amber-400/60' : 'text-red-400/60'
                }`}>{t.yourAnswer}</div>
                <div className={`text-xl font-black font-mono ${
                  fieldCorrect ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-red-500'
                }`}>{userVal}</div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="text-[9px] font-mono font-bold text-emerald-400/60 uppercase mb-2 tracking-widest">{t.correctAnswer}</div>
                <div className="text-xl font-black font-mono text-emerald-400">{correctVal}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Story/Consequence — Digital Log Entry */}
      {storyText && (
        <div className="bg-white/5 border-l-2 border-indigo-500 p-4 rounded-r-xl">
          <div className="text-[8px] font-mono text-white/30 uppercase mb-1 tracking-widest">Environmental_Consequence</div>
          <p className="text-xs text-indigo-300/80 font-mono italic leading-relaxed">
            "{storyText}"
          </p>
        </div>
      )}

      {/* Logic Reference (Formula) */}
      {formula && (
        <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-2">
          <div className="text-[9px] font-mono text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full" />
            {t.explanation}
          </div>
          <div className="flex justify-center bg-white/[0.02] p-3 rounded-lg">
            <MathView tex={formula.replace(/\$/g, '')} className="text-lg text-white/80" />
          </div>
        </div>
      )}

      {/* Continue Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className={`w-full py-4 rounded-xl font-mono text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${
          isPartial ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]' : 'bg-slate-800 text-white border border-white/10 hover:bg-slate-700'
        }`}
      >
        {continueLabel || t.continue}
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
}

