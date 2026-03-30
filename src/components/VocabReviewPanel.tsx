/**
 * VocabReviewPanel — Spaced repetition flashcard review.
 *
 * Shows words from the student's vocab pool that are due for review.
 * Cards flip to reveal meaning. Student marks "remembered" or "not yet".
 *
 * Product Soul: "每天花2分钟，词汇就不会成为你的障碍。"
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCcw, BookOpen, ArrowRight } from 'lucide-react';
import type { Language } from '../types';
import { getWordById } from '../data/vocab/mathVocab';
import { getReviewRecommendations } from '../utils/spacedRepetition';
import { recordReview, getPoolStats } from '../utils/vocabPool';

type Props = {
  lang: Language;
  currentKpId?: string;
  onClose: () => void;
};

export function VocabReviewPanel({ lang, currentKpId, onClose }: Props) {
  const en = lang === 'en';
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);

  const recommendations = useMemo(
    () => getReviewRecommendations(currentKpId, 8),
    [currentKpId]
  );

  const stats = getPoolStats();
  const currentRec = recommendations[currentIdx];
  const currentWord = currentRec ? getWordById(currentRec.wordId) : null;

  const handleResponse = (remembered: boolean) => {
    if (currentRec) {
      recordReview(currentRec.wordId, remembered);
    }
    setFlipped(false);
    setCompleted(c => c + 1);
    if (currentIdx < recommendations.length - 1) {
      setCurrentIdx(i => i + 1);
    }
  };

  const allDone = currentIdx >= recommendations.length - 1 && completed > 0;

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
        >
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-lg font-black text-slate-800 mb-2">
            {en ? 'No words to review!' : '没有需要复习的词汇！'}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {en ? 'Keep practising — new words will appear as you learn.' : '继续练习——遇到新词时它们会自动加入复习池。'}
          </p>
          <button onClick={onClose} className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors min-h-[44px]">
            {en ? 'Got it' : '知道了'}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500" />
            <span className="text-sm font-black text-slate-700">
              {en ? 'Vocab Review' : '词汇复习'}
            </span>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
              {completed + 1}/{recommendations.length}
            </span>
          </div>
          <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-100 rounded-full" aria-label="Close">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Pool stats */}
        <div className="px-5 pb-2 flex gap-2 text-[10px]">
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{stats.mastered} {en ? 'mastered' : '已掌握'}</span>
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{stats.learning} {en ? 'learning' : '学习中'}</span>
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{stats.total} {en ? 'total' : '总计'}</span>
        </div>

        {/* Card area */}
        {allDone ? (
          <div className="px-5 py-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-black text-slate-800 mb-2">
              {en ? 'Review complete!' : '复习完成！'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {en ? `You reviewed ${completed} words. Great job!` : `你复习了 ${completed} 个词汇。做得好！`}
            </p>
          </div>
        ) : currentWord ? (
          <div className="px-5 py-4">
            {/* Urgency badge */}
            {currentRec.urgency === 'overdue' && (
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold mb-2 inline-block">
                {en ? `${currentRec.daysOverdue}d overdue` : `逾期 ${currentRec.daysOverdue} 天`}
              </span>
            )}

            {/* Flashcard */}
            <motion.div
              key={currentIdx}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-50 rounded-xl p-6 text-center min-h-[160px] flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              {!flipped ? (
                <>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{currentWord.en}</h3>
                  {currentWord.examFreq.tier === 'core' && <span className="text-[10px] text-red-500 font-bold">🔥 CORE</span>}
                  <p className="text-xs text-slate-400 mt-3">{en ? 'Tap to reveal meaning' : '点击翻转查看含义'}</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-indigo-600 mb-2">{currentWord.zh || '—'}</h3>
                  {currentWord.desc && <p className="text-sm text-slate-600">{currentWord.desc}</p>}
                  {currentWord.examPhrases?.[0] && (
                    <p className="text-[11px] text-slate-400 mt-2 italic">"{currentWord.examPhrases[0].en}"</p>
                  )}
                </>
              )}
            </motion.div>
          </div>
        ) : null}

        {/* Action buttons */}
        {!allDone && flipped && (
          <div className="px-5 pb-4 flex gap-2">
            <button
              onClick={() => handleResponse(false)}
              className="flex-1 py-3 bg-rose-100 text-rose-700 font-bold text-sm rounded-xl hover:bg-rose-200 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              <RotateCcw size={14} />
              {en ? 'Not yet' : '还不熟'}
            </button>
            <button
              onClick={() => handleResponse(true)}
              className="flex-1 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              <Check size={14} />
              {en ? 'Got it!' : '记住了！'}
            </button>
          </div>
        )}

        {/* Continue / Close */}
        {allDone && (
          <div className="px-5 pb-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ArrowRight size={16} />
              {en ? 'Continue learning' : '继续学习'}
            </button>
          </div>
        )}

        {/* Soul message */}
        <div className="px-5 pb-3">
          <p className="text-[10px] text-slate-300 text-center italic">
            {en ? 'Every word you review is one less barrier in your exam.' : '每复习一个词，考试就少一个障碍。'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
