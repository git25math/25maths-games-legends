/**
 * DiscoverPanel — Interactive concept exploration before tutorial.
 * 2-3 micro-questions that build confidence through guided discovery.
 * No scoring, no timer, no pressure. Just curiosity.
 */
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { DiscoverStep, Language } from '../types';
import { lt } from '../i18n/resolveText';
import { LatexText } from './MathView';
import { logAttempt } from '../utils/logAttempt';

type Props = {
  steps: DiscoverStep[];
  lang: Language;
  missionId: number;
  kpId?: string;
  characterName?: string;
  onComplete: () => void;
};

function shuffleWithTracking(choices: { zh: string; en: string }[]) {
  const indexed = choices.map((c, i) => ({ choice: c, originalIdx: i }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return indexed;
}

export function DiscoverPanel({ steps, lang, missionId, kpId, characterName, onComplete }: Props) {
  const [stepIdx, setStepIdx] = useState(() => {
    try {
      const saved = localStorage.getItem(`gl_discover_${missionId}_step`);
      return saved ? Math.min(Number(saved), steps.length - 1) : 0;
    } catch { return 0; }
  });
  // Persist discover step progress
  const setStepIdxPersist = (idx: number) => {
    setStepIdx(idx);
    try { localStorage.setItem(`gl_discover_${missionId}_step`, String(idx)); } catch { /* */ }
  };
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | 'skip' } | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const startTimeRef = useState(() => Date.now())[0];

  const step = stepIdx < steps.length ? steps[stepIdx] : null;

  // Re-shuffle choices when step changes
  const shuffledChoices = useMemo(() => {
    if (!step?.choices || step.choices.length === 0) return [];
    return shuffleWithTracking(step.choices);
  }, [stepIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset state on step change
  useEffect(() => {
    setInput('');
    setFeedback(null);
    setSelectedIdx(null);
  }, [stepIdx]);

  if (!step) return null;
  const promptText = lt(step.prompt, lang);
  const narrator = characterName || (lang === 'en' ? 'Guide' : '引路人');

  const logStep = (action: string, isCorrect: boolean) => {
    logAttempt({
      questionId: `${missionId}-discover-${stepIdx}-${action}`,
      nodeId: kpId || 'discover',
      isCorrect,
      rawAnswer: action,
      sourceMode: 'practice',
      durationMs: Date.now() - startTimeRef,
    });
  };

  const advance = () => {
    if (stepIdx + 1 >= steps.length) {
      try { localStorage.removeItem(`gl_discover_${missionId}_step`); } catch { /* */ }
      onComplete();
    } else {
      setStepIdxPersist(stepIdx + 1);
    }
  };

  const showFeedback = (type: 'correct' | 'wrong' | 'skip', answer?: string) => {
    const text = lt(
      type === 'correct' ? step.onCorrect : type === 'wrong' ? step.onWrong : step.onSkip,
      lang,
    );
    setFeedback({ text, type });
    logStep(answer || type, type === 'correct');
  };

  const handleChoice = (originalIdx: number, displayIdx: number) => {
    if (feedback) return;
    setSelectedIdx(displayIdx);
    // Brief delay to show selection highlight before feedback
    setTimeout(() => {
      const isCorrect = originalIdx === 0;
      showFeedback(isCorrect ? 'correct' : 'wrong', `choice-${originalIdx}`);
    }, 300);
  };

  const handleInputSubmit = () => {
    if (feedback) return;
    const trimmed = input.trim();
    if (!trimmed) {
      showFeedback('skip');
      return;
    }
    const pattern = step.acceptPattern || '';
    const isCorrect = pattern ? new RegExp(pattern, 'i').test(trimmed) : false;
    showFeedback(isCorrect ? 'correct' : 'wrong', trimmed);
  };

  const handleHint = () => {
    if (feedback) return;
    showFeedback('skip', 'hint-requested');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 min-w-0 overflow-hidden"
    >
      {/* Step indicator + narrator */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === stepIdx ? 'bg-amber-400 ring-2 ring-amber-400/30' :
                i < stepIdx ? 'bg-emerald-500' : 'bg-white/15'
              }`} />
            ))}
          </div>
          <span className="text-amber-400/60 text-[10px] font-bold tracking-wider uppercase">
            {lang === 'en' ? 'Discover' : '探索'}
          </span>
        </div>
      </div>

      {/* Prompt card with narrator */}
      <motion.div
        key={`prompt-${stepIdx}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800 border border-amber-500/30 rounded-xl p-5 overflow-hidden"
      >
        <div className="text-amber-400 text-sm font-black mb-3">{narrator}</div>
        <div className="text-white text-base leading-7 whitespace-pre-line break-words [overflow-wrap:anywhere]">
          <LatexText text={promptText} />
        </div>
      </motion.div>

      {/* Interaction area */}
      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            key={`input-${stepIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {step.type === 'choice' && shuffledChoices.length > 0 && (
              <div className="space-y-2">
                {shuffledChoices.map((item, i) => (
                  <motion.button
                    key={`${stepIdx}-${i}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(item.originalIdx, i)}
                    className={`w-full py-4 px-5 min-h-[52px] border-2 rounded-xl text-base text-left transition-all break-words [overflow-wrap:anywhere] ${
                      selectedIdx === i
                        ? 'bg-amber-600 border-amber-400 text-white font-bold'
                        : 'bg-slate-700 hover:bg-slate-600 border-slate-500 text-white'
                    }`}
                  >
                    <LatexText text={lt(item.choice, lang)} />
                  </motion.button>
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

            {/* Hint request — warm, not shameful */}
            <button
              onClick={handleHint}
              className="w-full mt-3 py-2 text-slate-400 text-sm hover:text-white/70 transition-colors"
            >
              {lang === 'en' ? "Give me a hint" : lang === 'zh_TW' ? '給我提示' : '给我提示'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`feedback-${stepIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`rounded-xl p-5 border-2 overflow-hidden ${
              feedback.type === 'correct' ? 'bg-emerald-900 border-emerald-500' :
              feedback.type === 'wrong' ? 'bg-amber-900 border-amber-500' :
              'bg-slate-800 border-slate-500'
            }`}
          >
            {/* Feedback header */}
            <div className={`text-sm font-black mb-3 ${
              feedback.type === 'correct' ? 'text-emerald-200' :
              feedback.type === 'wrong' ? 'text-amber-200' :
              'text-white/70'
            }`}>
              {feedback.type === 'correct'
                ? (lang === 'en' ? 'You got it!' : '你发现了！')
                : feedback.type === 'wrong'
                ? (lang === 'en' ? 'Not quite — here\'s the key insight:' : '差一点——关键在这里：')
                : (lang === 'en' ? 'No problem — let me show you:' : '没关系——我来带你看：')}
            </div>

            <div className="text-white text-base leading-7 whitespace-pre-line break-words [overflow-wrap:anywhere]">
              <LatexText text={feedback.text} />
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={advance}
              className="mt-4 w-full py-3 min-h-[52px] bg-slate-600 hover:bg-slate-500 text-white font-black rounded-xl transition-colors text-base"
            >
              {stepIdx + 1 >= steps.length
                ? (lang === 'en' ? 'I\'m ready — show me the method →' : '我准备好了——教我方法 →')
                : (lang === 'en' ? 'Next →' : '继续 →')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
