import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ChevronDown, ChevronRight, ChevronUp, Star } from 'lucide-react';
import type { Language } from '../../types';
import { MathView } from '../MathView';
import { lt } from '../../i18n/resolveText';
import { LatexText } from '../MathView';
import { INPUT_FIELDS } from './inputConfig';
import { staggerContainer, staggerItem } from '../../utils/animationPresets';
import { parseAnswer } from '../../utils/parseAnswer';
import { diagnoseError } from '../../utils/diagnoseError';
import { getPattern } from '../../utils/errorPatterns';
import { findVocabInText } from '../../data/vocab/mathVocab';

const LABELS = {
  zh: {
    title: '解题回顾',
    partialTitle: '接近正确！',
    partialHint: '方法正确，计算有误',
    yourAnswer: '你的答案',
    correctAnswer: '正确答案',
    explanation: '解题过程',
    continue: '我懂了，继续前进！',
    showSteps: '看解题过程',
    hideSteps: '收起',
  },
  zh_TW: {
    title: '解題回顧',
    partialTitle: '接近正確！',
    partialHint: '方法正確，計算有誤',
    yourAnswer: '你的答案',
    correctAnswer: '正確答案',
    explanation: '解題過程',
    continue: '我懂了，繼續前進！',
    showSteps: '看解題過程',
    hideSteps: '收起',
  },
  en: {
    title: 'Solution Review',
    partialTitle: 'Almost Right!',
    partialHint: 'Right method, calculation error',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    explanation: 'Solution steps',
    continue: 'I understand — onward!',
    showSteps: 'Show solution steps',
    hideSteps: 'Hide',
  },
} as const;

/**
 * 产品灵魂语录 — 接住学生没说出口的声音
 * 学生做错时心里想的不是"答案是什么"，而是"我是不是很笨？"
 * 系统要在学生下这个结论之前先接住他。
 */
const SOUL_MESSAGES: { zh: string; en: string }[] = [
  { zh: '这一步卡住了？没关系，我们一起再看一遍。', en: "Stuck on this step? That's OK — let's look at it together." },
  { zh: '做错不丢人。每一次试错，都是离正确更近一步。', en: "Getting it wrong isn't failure. Every attempt brings you closer." },
  { zh: '你敢尝试，就已经比放弃的人强了。', en: "You tried — that already puts you ahead of those who gave up." },
  { zh: '这道题难住了很多人。你不是一个人。', en: "This problem trips up many people. You're not alone." },
  { zh: '看看正确答案，下次你就知道了。这就是学习。', en: "See the correct answer — next time you'll know. That's learning." },
  { zh: '差一点点！你的思路是对的，只是细节需要打磨。', en: "So close! Your thinking is right — just the details need polishing." },
  { zh: '每个高手都曾经在这里摔过。区别在于——他们爬起来了。', en: "Every master once fell here. The difference? They got back up." },
  { zh: '我不会走的。我们在一起。', en: "I'm not going anywhere. We're in this together." },
];

type Props = {
  questionType: string;
  userInputs: Record<string, string>;
  expected: Record<string, string>;
  formula: string;
  tutorialSteps?: { text: { zh: string; en: string } }[];
  lang: Language;
  onContinue: () => void;
  continueLabel?: string;
  /** Story consequence text for wrong answer */
  storyText?: string;
  /** Partial credit mode: yellow border, encouraging message */
  isPartial?: boolean;
  /** Partial credit score earned */
  partialScore?: number;
  /** KP prerequisite hint — what foundation skill may be weak */
  prereqHint?: { kpId: string; reason: { zh: string; en: string } } | null;
  /** Question description text — used to extract related vocab */
  descText?: string;
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
  prereqHint,
  descText,
}: Props) {
  const t = LABELS[lang];
  const fc = INPUT_FIELDS[questionType as keyof typeof INPUT_FIELDS] || { zh: [], en: [] };
  const fields = fc[lang as keyof typeof fc] || fc[lang === 'zh_TW' ? 'zh' : 'zh'] || [];
  const [showAllSteps, setShowAllSteps] = useState(false);

  // Only show fields that have expected values
  const relevantFields = fields.filter(f => expected[f.id] !== undefined);

  // Error diagnosis
  const diagnosis = diagnoseError(userInputs, expected, isPartial);

  // Show last 3 tutorial steps (answer + verify + key step), or all if expanded
  const stepsToShow = tutorialSteps && tutorialSteps.length > 0
    ? showAllSteps
      ? tutorialSteps
      : tutorialSteps.slice(Math.max(0, tutorialSteps.length - 3))
    : [];

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-5 space-y-4 border-2 ${isPartial ? 'bg-yellow-50 border-yellow-300' : 'bg-red-100 border-red-300'}`}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 font-bold ${isPartial ? 'text-yellow-700' : 'text-red-700'}`}>
        {isPartial ? <Star size={20} className="text-yellow-500" /> : <AlertTriangle size={20} />}
        <span>{isPartial ? t.partialTitle : t.title}</span>
        {isPartial && partialScore !== undefined && partialScore > 0 && (
          <span className="ml-auto text-sm bg-yellow-200 px-2 py-0.5 rounded-full font-black text-yellow-800">+{partialScore} (50%)</span>
        )}
      </div>

      {/* Soul message — catch the student before they think "I'm stupid" */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={`text-sm italic leading-relaxed ${isPartial ? 'text-yellow-600' : 'text-slate-500'}`}
      >
        {(() => {
          const msgs = isPartial
            ? SOUL_MESSAGES.filter((_, i) => i === 5 || i === 1) // partial: encouraging ones
            : SOUL_MESSAGES;
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          return lang === 'en' ? msg.en : msg.zh;
        })()}
      </motion.p>

      {/* Error diagnosis */}
      {(() => {
        // Map legacy type to pattern for enhanced display
        const patternMap: Record<string, string> = { sign: 'sign_distribution', method: 'generic_algebra', rounding: 'generic_number', magnitude: 'generic_number' };
        const pattern = getPattern(patternMap[diagnosis.type] ?? '');
        return (
          <div className={`rounded-lg p-3 text-sm font-bold leading-relaxed ${
            diagnosis.type === 'method' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
            diagnosis.type === 'sign' || diagnosis.type === 'rounding' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
            diagnosis.type === 'magnitude' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
            'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {pattern && (
              <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                <span className="text-base">{pattern.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {lang === 'en' ? pattern.label.en : pattern.label.zh}
                </span>
              </div>
            )}
            {diagnosis.message[lang]}
          </div>
        );
      })()}

      {/* Prerequisite root cause hint — KP-level intelligence */}
      {prereqHint && !isPartial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-indigo-50 border border-indigo-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🔍</span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
              {lang === 'en' ? 'Root Cause' : '根因分析'}
            </span>
          </div>
          <p className="text-xs text-indigo-700 leading-relaxed">
            {lang === 'en'
              ? `This might be tricky because of: ${prereqHint.reason.en}. Strengthening ${prereqHint.kpId} could help.`
              : `可能卡在这里的原因：${prereqHint.reason.zh}。巩固 ${prereqHint.kpId} 会有帮助。`}
          </p>
        </motion.div>
      )}

      {/* Related vocabulary from the question */}
      {descText && lang === 'en' && (() => {
        const vocabMatches = findVocabInText(descText);
        if (vocabMatches.length === 0) return null;
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-wider mb-1.5">
              {lang === 'en' ? 'Key vocabulary in this question' : '本题关键词汇'}
            </p>
            <div className="flex flex-wrap gap-1">
              {vocabMatches.slice(0, 4).map((vm, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded text-[11px]">
                  <span className="font-bold text-purple-700">{vm.word.en}</span>
                  <span className="text-purple-400">= {vm.word.zh}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Answer comparison */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
        {relevantFields.map(field => {
          const userVal = userInputs[field.id] || '—';
          const correctVal = expected[field.id] || '?';
          // In partial mode, check if this specific field was correct
          const fieldCorrect = isPartial && userVal !== '—' && correctVal !== '?' &&
            !isNaN(parseAnswer(userVal)) && !isNaN(parseAnswer(correctVal)) &&
            Math.abs(parseAnswer(userVal) - parseAnswer(correctVal)) < 0.01;
          return (
            <motion.div variants={staggerItem} key={field.id} className="grid grid-cols-2 gap-3">
              <div className={`rounded-lg p-3 text-center ${fieldCorrect ? 'bg-emerald-100' : isPartial ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <div className={`text-[10px] font-bold uppercase mb-1 ${fieldCorrect ? 'text-emerald-500' : isPartial ? 'text-yellow-500' : 'text-red-400'}`}>{t.yourAnswer}</div>
                <div className={`text-lg font-black ${fieldCorrect ? 'text-emerald-700' : isPartial ? 'text-yellow-700' : 'text-red-700'}`}>{userVal}</div>
              </div>
              <div className="bg-emerald-100 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">{t.correctAnswer}</div>
                <div className="text-lg font-black text-emerald-700">{correctVal}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Story consequence */}
      {storyText && (
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-amber-800 text-sm italic leading-relaxed">
          {storyText}
        </div>
      )}

      {/* Formula reminder */}
      {formula && (
        <div className={`bg-white/60 rounded-lg p-3 border ${isPartial ? 'border-yellow-200' : 'border-red-100'}`}>
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t.explanation}</div>
          <div className="flex justify-center">
            <MathView tex={formula.replace(/\$/g, '')} className="text-base text-slate-800" />
          </div>
        </div>
      )}

      {/* Tutorial steps — show last 3 by default, expandable to all */}
      {stepsToShow.length > 0 && (
        <div className={`bg-white/60 rounded-lg p-3 border text-sm text-slate-700 leading-relaxed space-y-2 ${isPartial ? 'border-yellow-200' : 'border-red-100'}`}>
          {stepsToShow.map((step, i) => (
            <div key={i} className={i < stepsToShow.length - 1 ? 'pb-2 border-b border-slate-200' : ''}>
              <LatexText text={lt(step.text, lang)} />
            </div>
          ))}
          {tutorialSteps && tutorialSteps.length > 3 && (
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-800 transition-colors"
            >
              {showAllSteps ? <><ChevronUp size={14} /> {t.hideSteps}</> : <><ChevronDown size={14} /> {t.showSteps}</>}
            </button>
          )}
        </div>
      )}

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onContinue}
        className="w-full py-3 min-h-[48px] bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {continueLabel || t.continue}
        <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
}
