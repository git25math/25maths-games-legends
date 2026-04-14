import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { Mission, Language, DifficultyMode } from '../../types';
import { LatexText } from '../MathView';
import { INPUT_FIELDS } from './inputConfig';
import { tt } from '../../i18n/resolveText';

export const InputFields = ({
  mission,
  inputs,
  setInputs,
  difficultyMode,
  tutorialStep,
  isTutorial,
  lang = 'zh',
}: {
  mission: Mission;
  inputs: { [key: string]: string };
  setInputs: (inputs: { [key: string]: string }) => void;
  difficultyMode: DifficultyMode;
  tutorialStep: number;
  isTutorial: boolean;
  lang?: Language;
}) => {
  const fieldConfig = INPUT_FIELDS[mission.type] || { zh: [], en: [] };
  const allFields = fieldConfig[lang as keyof typeof fieldConfig] || fieldConfig[lang === 'zh_TW' ? 'zh' : 'zh'] || [];

  // For types with multiple possible fields (e.g. FUNC_VAL has y and t),
  // only show the field that the mission actually uses (based on highlightField in tutorialSteps)
  const usedFieldIds = mission.tutorialSteps
    ?.map(s => s.highlightField).filter(Boolean) as string[] | undefined;
  const currentFields = usedFieldIds && usedFieldIds.length > 0
    ? allFields.filter(f => usedFieldIds.includes(f.id))
    : allFields;

  // Auto-focus first input when not in tutorial mode (e.g., after wrong answer / new question)
  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isTutorial && firstInputRef.current) {
      const timer = setTimeout(() => firstInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [mission, isTutorial]);

  return (
    <div className="space-y-6">
      {currentFields.map((field, fieldIdx) => {
        const isHighlighted = isTutorial && mission.tutorialSteps?.[tutorialStep]?.highlightField === field.id;
        return (
          <motion.div
            key={field.id}
            animate={isHighlighted ? { scale: 1.05, opacity: 1, filter: 'grayscale(0)' } : isTutorial ? { scale: 1, opacity: 0.4, filter: 'grayscale(1)' } : { scale: 1, opacity: 1, filter: 'grayscale(0)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative"
          >
            <label className="absolute -top-2 left-4 px-2 bg-parchment text-[10px] font-black text-ink-light uppercase tracking-widest z-10">
              <LatexText text={field.label} />
            </label>
            <input
              ref={fieldIdx === 0 ? firstInputRef : undefined}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label={field.label}
              aria-disabled={isTutorial && !isHighlighted}
              disabled={isTutorial && !isHighlighted}
              value={inputs[field.id] || ''}
              onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
              placeholder={field.placeholder}
              className={`w-full px-6 py-5 bg-white/50 border-2 rounded-lg text-2xl font-black text-ink focus:bg-white outline-none transition-all shadow-md ${
                isHighlighted ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-ink'
              }`}
            />
            <div className="mt-1 text-[9px] text-ink-light/40 px-2">
              {tt(lang, 'Supports fractions(3/4), roots(√5), negatives(-3)', '支持分数(3/4)、根号(√5)、负数(-3)')}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
