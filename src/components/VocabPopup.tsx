/**
 * VocabPopup — Three-layer progressive hint system.
 *
 * L1: Word meaning (词义) — always shown first
 * L2: Question interpretation (题意解读) — "I still don't understand the question"
 * L3: Method guidance (解法引导) — links to KP tutorial
 *
 * Students progress through layers only as needed.
 * Every interaction is recorded for analytics.
 *
 * Product Soul: "我一步步陪你弄清楚" — not "你不会这个"
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, ChevronRight, Check, HelpCircle } from 'lucide-react';
import type { Language } from '../types';
import type { MathWord } from '../data/vocab/mathVocab';
import { getTopicForKp } from '../data/curriculum/kp-registry';

type Props = {
  word: MathWord;
  lang: Language;
  kpId?: string;
  missionDesc?: { zh: string; en: string };
  onClose: () => void;
  onLevelChange?: (level: 1 | 2 | 3) => void;
};

export function VocabPopup({ word, lang, kpId, missionDesc, onClose, onLevelChange }: Props) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const en = lang === 'en';

  const topic = kpId ? getTopicForKp(kpId) : null;
  const topicName = topic ? (en ? topic.title : topic.titleZh) : '';

  const advanceLevel = (next: 2 | 3) => {
    setLevel(next);
    onLevelChange?.(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">
              {en ? `Level ${level} Hint` : `第${level}层提示`}
            </span>
          </div>
          <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors" aria-label="Close">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* L1: Word Meaning — always visible */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-black text-slate-800">{word.en}</h3>
            {/* Exam frequency badge */}
            {word.examFreq && word.examFreq.tier === 'core' && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-black rounded">🔥 {en ? 'CORE' : '核心'}</span>
            )}
            {word.examFreq && word.examFreq.tier === 'high' && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[9px] font-black rounded">⭐ {en ? 'HIGH' : '高频'}</span>
            )}
          </div>
          <p className="text-lg text-indigo-600 font-bold mb-2">{word.zh}</p>
          {word.desc && (
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3">
              {word.desc}
            </p>
          )}

          {/* Multiple senses (一词多义) */}
          {word.senses && word.senses.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-[10px] font-bold text-purple-500 uppercase">{en ? 'Multiple meanings' : '一词多义'}</p>
              {word.senses.map((s, i) => (
                <div key={i} className="text-xs text-slate-600 bg-purple-50 rounded px-2 py-1">
                  <span className="font-bold">{s.meaning.zh}</span> — {s.meaning.en}
                </div>
              ))}
            </div>
          )}

          {/* Exam phrases (真题句式) */}
          {word.examPhrases && word.examPhrases.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">{en ? 'In exam questions' : '真题句式'}</p>
              {word.examPhrases.slice(0, 2).map((p, i) => (
                <p key={i} className="text-[11px] text-slate-500 italic leading-relaxed">"{p.en}"</p>
              ))}
            </div>
          )}

          {/* Exam frequency stat */}
          {word.examFreq && word.examFreq.paperCount > 0 && (
            <p className="text-[10px] text-slate-300 mt-2">
              {en
                ? `Appeared in ${word.examFreq.paperCount}/228 papers (${word.examFreq.paperPct}%)`
                : `出现在 ${word.examFreq.paperCount}/228 套卷中 (${word.examFreq.paperPct}%)`}
            </p>
          )}

          {kpId && topicName && (
            <p className="text-[10px] text-slate-400 mt-2">
              {en ? `Appears in: ${topicName}` : `出现在：${topicName}`}
            </p>
          )}
        </div>

        {/* L2: Question Interpretation */}
        <AnimatePresence>
          {level >= 2 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100"
            >
              <div className="px-5 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen size={14} className="text-amber-500" />
                  <span className="text-xs font-bold text-amber-700">
                    {en ? 'What the question is asking' : '题意解读'}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed bg-amber-50 rounded-lg p-3">
                  {missionDesc
                    ? (en ? missionDesc.en : missionDesc.zh)
                    : (en
                      ? 'Read the question carefully — identify what is given and what you need to find.'
                      : '仔细读题——找出已知条件和求解目标。')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* L3: Method Guidance */}
        <AnimatePresence>
          {level >= 3 && kpId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100"
            >
              <div className="px-5 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen size={14} className="text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700">
                    {en ? 'How to solve it' : '解法引导'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {en
                    ? `This question relates to ${topicName || kpId}. Review the tutorial for step-by-step guidance.`
                    : `这道题涉及${topicName || kpId}。查看教程获取分步指导。`}
                </p>
                <button
                  onClick={() => {
                    // TODO: Navigate to tutorial for this KP
                    onLevelChange?.(3);
                  }}
                  className="w-full py-2.5 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen size={14} />
                  {en ? 'Open Tutorial' : '打开教程'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Check size={16} />
            {en ? 'Got it!' : '我懂了！'}
          </button>

          {level === 1 && (
            <button
              onClick={() => advanceLevel(2)}
              className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              {en ? "Don't understand the question" : '不理解题意'}
              <ChevronRight size={14} />
            </button>
          )}

          {level === 2 && kpId && (
            <button
              onClick={() => advanceLevel(3)}
              className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              {en ? "Don't know how to solve" : '不知道怎么做'}
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Soul message */}
        <div className="px-5 pb-4">
          <p className="text-[10px] text-slate-300 text-center italic">
            {en
              ? "Tapping words doesn't affect your score. I'm here to help. 😊"
              : '点击查词不影响分数。我在这里帮你。😊'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
