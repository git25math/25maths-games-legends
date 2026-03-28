/**
 * DiscoverPanel — Interactive concept exploration before tutorial.
 * 2-3 micro-questions that build confidence through guided discovery.
 * No scoring, no timer, no pressure. Just curiosity.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { DiscoverStep, Language } from '../types';
import { lt } from '../i18n/resolveText';
import { MathView } from './MathView';

type Props = {
  steps: DiscoverStep[];
  lang: Language;
  onComplete: () => void;
};

export function DiscoverPanel({ steps, lang, onComplete }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | 'skip' } | null>(null);

  if (stepIdx >= steps.length) return null;
  const step = steps[stepIdx];
  const promptText = lt(step.prompt, lang);

  const advance = () => {
    setFeedback(null);
    setInput('');
    if (stepIdx + 1 >= steps.length) {
      onComplete();
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  const handleChoice = (choiceIdx: number) => {
    if (feedback) return;
    // For choice type, first choice is always correct (author puts correct answer first)
    const isCorrect = choiceIdx === 0;
    const text = lt(isCorrect ? step.onCorrect : step.onWrong, lang);
    setFeedback({ text, type: isCorrect ? 'correct' : 'wrong' });
  };

  const handleInputSubmit = () => {
    if (feedback) return;
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      const text = lt(step.onSkip, lang);
      setFeedback({ text, type: 'skip' });
      return;
    }
    const pattern = step.acceptPattern || '';
    const isCorrect = pattern ? new RegExp(pattern, 'i').test(trimmed) : false;
    const text = lt(isCorrect ? step.onCorrect : step.onWrong, lang);
    setFeedback({ text, type: isCorrect ? 'correct' : 'wrong' });
  };

  const handleSkip = () => {
    if (feedback) return;
    const text = lt(step.onSkip, lang);
    setFeedback({ text, type: 'skip' });
  };

  // Shuffle choices but track which index was originally 0 (correct)
  const [shuffledChoices] = useState(() => {
    if (!step.choices || step.choices.length === 0) return [];
    const indexed = step.choices.map((c, i) => ({ choice: c, originalIdx: i }));
    // Fisher-Yates shuffle
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    return indexed;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === stepIdx ? 'bg-amber-400' : i < stepIdx ? 'bg-emerald-500' : 'bg-white/20'}`} />
          ))}
        </div>
        <span className="text-white/30 text-[10px]">
          {lang === 'en' ? 'Discover' : '探索'}
        </span>
      </div>

      {/* Prompt */}
      <div className="bg-gradient-to-br from-amber-900/40 to-slate-800/60 border border-amber-600/20 rounded-xl p-4">
        <MathView tex={promptText} className="text-white/90 text-sm leading-relaxed whitespace-pre-line" />
      </div>

      {/* Interaction area */}
      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {step.type === 'choice' && shuffledChoices.length > 0 && (
              <div className="space-y-2">
                {shuffledChoices.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(item.originalIdx)}
                    className="w-full py-3 px-4 min-h-[48px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 rounded-xl text-white/80 text-sm text-left transition-all"
                  >
                    <MathView tex={lt(item.choice, lang)} className="inline" />
                  </button>
                ))}
              </div>
            )}

            {step.type === 'input' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleInputSubmit()}
                  placeholder={lang === 'en' ? 'Type your answer...' : '输入你的答案...'}
                  className="flex-1 py-3 px-4 min-h-[48px] bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:border-amber-500/50 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleInputSubmit}
                  className="py-3 px-6 min-h-[48px] bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {lang === 'en' ? 'Go' : '确定'}
                </button>
              </div>
            )}

            {/* Skip option */}
            <button
              onClick={handleSkip}
              className="w-full mt-2 text-white/20 text-[10px] hover:text-white/40 transition-colors"
            >
              {lang === 'en' ? "I'm not sure..." : '我不确定...'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 border ${
              feedback.type === 'correct' ? 'bg-emerald-900/30 border-emerald-500/30' :
              feedback.type === 'wrong' ? 'bg-amber-900/30 border-amber-500/30' :
              'bg-slate-800/50 border-white/10'
            }`}
          >
            <MathView tex={feedback.text} className="text-white/90 text-sm leading-relaxed whitespace-pre-line" />

            <button
              onClick={advance}
              className="mt-3 w-full py-3 min-h-[48px] bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm"
            >
              {stepIdx + 1 >= steps.length
                ? (lang === 'en' ? 'Got it — let\'s learn the method →' : '明白了——来学方法 →')
                : (lang === 'en' ? 'Next →' : '继续 →')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
