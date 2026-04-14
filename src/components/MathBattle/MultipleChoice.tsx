/**
 * MultipleChoice — Button-based answer selection for supported question types.
 * Renders 3-4 choice buttons instead of text input fields.
 * Used when mission.data.choices exists.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Language, BilingualText } from '../../types';
import { lt } from '../../i18n/resolveText';
import { MathView, LatexText } from '../MathView';

export type ChoiceOption = {
  label: BilingualText;
  value: string; // the answer value to submit
  isLatex?: boolean; // render as LaTeX
};

type Props = {
  choices: ChoiceOption[];
  onSelect: (value: string) => void;
  disabled: boolean;
  lang: Language;
  result?: 'correct' | 'wrong' | null;
  selectedIndex?: number | null;
  correctIndex?: number;
};

const BUTTON_LETTERS = ['A', 'B', 'C', 'D'];

export function MultipleChoice({ choices, onSelect, disabled, lang, result, selectedIndex, correctIndex }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {choices.map((choice, i) => {
        const isSelected = selectedIndex === i;
        const isCorrectChoice = correctIndex === i;
        const showCorrect = result === 'wrong' && isCorrectChoice;
        const showWrong = result === 'wrong' && isSelected && !isCorrectChoice;
        const showSuccess = result === 'correct' && isSelected;

        let borderColor = disabled ? 'border-slate-200' : 'border-slate-200 hover:border-indigo-400';
        let bgColor = disabled ? 'bg-white' : 'bg-white hover:bg-indigo-50/50';
        let textColor = 'text-slate-800';
        let letterBg = 'bg-slate-100 text-slate-500';

        if (showSuccess) {
          borderColor = 'border-emerald-400';
          bgColor = 'bg-emerald-50';
          textColor = 'text-emerald-800';
          letterBg = 'bg-emerald-500 text-white';
        } else if (showWrong) {
          borderColor = 'border-rose-400';
          bgColor = 'bg-rose-50';
          textColor = 'text-rose-800';
          letterBg = 'bg-rose-500 text-white';
        } else if (showCorrect) {
          borderColor = 'border-emerald-400';
          bgColor = 'bg-emerald-50/50';
          letterBg = 'bg-emerald-400 text-white';
        } else if (isSelected && !result) {
          borderColor = 'border-indigo-500';
          bgColor = 'bg-indigo-50';
          letterBg = 'bg-indigo-500 text-white';
        }

        return (
          <motion.button
            key={i}
            whileTap={disabled ? {} : { scale: 0.97 }}
            onClick={() => !disabled && onSelect(choice.value)}
            disabled={disabled}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${borderColor} ${bgColor} ${textColor} ${disabled && !result ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${letterBg} transition-colors`}>
              {BUTTON_LETTERS[i]}
            </span>
            <span className="flex-1 text-left text-sm font-bold">
              {(() => {
                const text = lt(choice.label, lang);
                // Text contains $...$ delimiters → use LatexText (splits and renders segments).
                // Text is raw LaTeX (no $, but has LaTeX commands) → strip to MathView.
                // Plain text → render as-is.
                if (text.includes('$')) {
                  return <LatexText text={text} className="text-sm" />;
                }
                if (choice.isLatex || /\\frac|\\sqrt|\\times|\\div/.test(text)) {
                  return <MathView tex={text} className="text-sm" />;
                }
                return text;
              })()}
            </span>
            {showSuccess && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
            {showWrong && <XCircle size={20} className="text-rose-500 shrink-0" />}
            {showCorrect && !isSelected && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          </motion.button>
        );
      })}
    </div>
  );
}
