import { motion } from 'motion/react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import type { Language } from '../../types';
import { MathView } from '../MathView';
import { INPUT_FIELDS } from './inputConfig';

const LABELS = {
  zh: {
    title: '解题回顾',
    yourAnswer: '你的答案',
    correctAnswer: '正确答案',
    explanation: '解题过程',
    continue: '我明白了，继续',
  },
  en: {
    title: 'Solution Review',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    explanation: 'Solution steps',
    continue: 'Got it, continue',
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
  /** Override the continue button label */
  continueLabel?: string;
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
}: Props) {
  const t = LABELS[lang];
  const fields = INPUT_FIELDS[questionType as keyof typeof INPUT_FIELDS] || [];

  // Only show fields that have expected values
  const relevantFields = fields.filter(f => expected[f.id] !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-red-50 border-2 border-red-200 rounded-xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-red-700 font-bold">
        <AlertTriangle size={20} />
        <span>{t.title}</span>
      </div>

      {/* Answer comparison */}
      <div className="space-y-2">
        {relevantFields.map(field => {
          const userVal = userInputs[field.id] || '—';
          const correctVal = expected[field.id] || '?';
          return (
            <div key={field.id} className="grid grid-cols-2 gap-3">
              <div className="bg-red-100 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-red-400 uppercase mb-1">{t.yourAnswer}</div>
                <div className="text-lg font-black text-red-700">{userVal}</div>
              </div>
              <div className="bg-emerald-100 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">{t.correctAnswer}</div>
                <div className="text-lg font-black text-emerald-700">{correctVal}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula reminder */}
      {formula && (
        <div className="bg-white/60 rounded-lg p-3 border border-red-100">
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t.explanation}</div>
          <div className="flex justify-center">
            <MathView tex={formula.replace(/\$/g, '')} className="text-base text-slate-800" />
          </div>
        </div>
      )}

      {/* Tutorial steps if available (show last step = solution) */}
      {tutorialSteps && tutorialSteps.length > 0 && (
        <div className="bg-white/60 rounded-lg p-3 border border-red-100 text-sm text-slate-700 leading-relaxed">
          {tutorialSteps[tutorialSteps.length - 1].text[lang]}
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
      >
        {continueLabel || t.continue}
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}
