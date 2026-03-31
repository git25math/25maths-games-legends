/**
 * RepairScreen — Skill Repair Mode (Resilience Engine MVP)
 *
 * Flow: Diagnosis Card → 5 Targeted Questions → Repair Complete → Return
 *
 * Design principles:
 *   - Student is "repairing a skill", not "doing extra homework"
 *   - Every feedback line names the specific error pattern
 *   - Clear impact statement: "this affects Factorising and Algebraic Fractions"
 *   - Time commitment upfront: "5 questions · ~3 minutes"
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight, Zap, BookOpen, Shield } from 'lucide-react';
import type { Language, Mission } from '../types';
import { getPattern } from '../utils/errorPatterns';
import { getTopicInfo } from '../utils/techTree';
import type { SkillHealthState } from '../utils/skillHealth';
import { processRecoveryComplete } from '../utils/skillHealth';
import { lt } from '../i18n/resolveText';
import { generateMission } from '../utils/generateMission';
import { checkAnswer } from '../utils/checkCorrectness';
import { INPUT_FIELDS } from '../components/MathBattle/inputConfig';
import { MathView, LatexText } from '../components/MathView';
import { interpolate } from '../utils/interpolate';
import { useAudio } from '../audio';
import { Confetti } from '../components/Confetti';

type RepairPhase = 'diagnosis' | 'practice' | 'complete';

export const RepairScreen = ({
  lang,
  topicId,
  patternId,
  healthState,
  missions,
  onComplete,
  onCancel,
}: {
  lang: Language;
  topicId: string;
  patternId: string | null;
  healthState: SkillHealthState;
  missions: Mission[];
  onComplete: (restoredState: SkillHealthState) => void;
  onCancel: () => void;
}) => {
  const [phase, setPhase] = useState<RepairPhase>('diagnosis');
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { playCorrect, playWrong, playVictory, playTap, playBadgeUnlock } = useAudio();
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const TOTAL_QUESTIONS = 5;
  const SUCCESS_THRESHOLD = 0.8; // 80% = 4/5

  const topicInfo = getTopicInfo(topicId);
  const pattern = patternId ? getPattern(patternId) : null;
  const topicTitle = topicInfo ? (lang === 'en' ? topicInfo.topic.title : topicInfo.topic.titleZh) : topicId;

  // Get repair missions — prefer pattern-specific generators (e.g., EXPAND_NEG_RANDOM for sign_distribution)
  const PATTERN_GENERATORS: Record<string, string> = {
    sign_distribution: 'EXPAND_NEG_RANDOM',
  };
  const preferredGen = patternId ? PATTERN_GENERATORS[patternId] : undefined;

  const topicMissions = missions.filter(m => {
    if (!m.kpId || !m.data?.generatorType) return false;
    // If we have a preferred generator for this pattern, prioritize it
    if (preferredGen && m.data.generatorType === preferredGen) return true;
    const match = m.kpId.match(/^kp-(\d+\.\d+)/);
    return match && match[1] === topicId;
  });

  // Generate questions — prefer pattern-specific missions first
  const [questions] = useState<Mission[]>(() => {
    // Sort: preferred generator first
    const sorted = [...topicMissions].sort((a, b) => {
      if (preferredGen) {
        if (a.data?.generatorType === preferredGen && b.data?.generatorType !== preferredGen) return -1;
        if (b.data?.generatorType === preferredGen && a.data?.generatorType !== preferredGen) return 1;
      }
      return 0;
    });
    const pool = sorted.length > 0 ? sorted : missions.filter(m => m.data?.generatorType).slice(0, 5);
    if (pool.length === 0) return []; // guard: no questions available
    const qs: Mission[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const base = pool[i % pool.length];
      qs.push(generateMission(base));
    }
    return qs;
  });

  const currentQuestion = questions[currentQ];

  // Downstream topics affected
  const downstreamTopics = topicInfo ? (() => {
    const CROSS = (globalThis as any).__CROSS_CHAPTER_PREREQS as Record<string, string[]> | undefined;
    // Simple: find topics in same chapter after this one
    const ch = topicInfo.chapter;
    const idx = topicInfo.topicIndex;
    return ch.topics.slice(idx + 1, idx + 4).map(t => lang === 'en' ? t.title : t.titleZh);
  })() : [];

  const handleSubmit = () => {
    if (!currentQuestion || showFeedback) return;
    const result = checkAnswer(currentQuestion, inputs);
    if (result.correct) {
      playCorrect();
      setCorrectCount(c => c + 1);
      setShowFeedback('correct');
    } else {
      playWrong();
      setShowFeedback('wrong');
    }
    setTimeout(() => {
      setShowFeedback(null);
      setInputs({});
      if (currentQ + 1 >= TOTAL_QUESTIONS) {
        const finalCorrect = correctCount + (showFeedback === 'correct' ? 0 : 0); // already incremented above
        if (correctCount >= Math.ceil(TOTAL_QUESTIONS * SUCCESS_THRESHOLD)) {
          playBadgeUnlock();
          setConfettiTrigger(t => t + 1);
        }
        playVictory();
        setPhase('complete');
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 1500);
  };

  const handleFinish = () => {
    const accuracy = correctCount / TOTAL_QUESTIONS;
    if (accuracy >= SUCCESS_THRESHOLD) {
      onComplete(processRecoveryComplete(healthState));
    } else {
      onCancel(); // Didn't meet threshold — return without full restore
    }
  };

  const accuracy = correctCount / Math.max(1, currentQ + (phase === 'complete' ? 0 : 1));
  const isSuccess = phase === 'complete' && (correctCount / TOTAL_QUESTIONS) >= SUCCESS_THRESHOLD;

  // ═══ Diagnosis Phase ═══
  if (phase === 'diagnosis') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-5"
        >
          {/* Back button */}
          <button onClick={onCancel} className="flex items-center gap-2 min-h-[44px] text-white/30 hover:text-white/60 focus-visible:ring-2 focus-visible:ring-white/30 rounded-lg text-sm" aria-label={lang === 'en' ? 'Back to map' : '返回地图'}>
            <ArrowLeft size={16} /> {lang === 'en' ? 'Back' : '返回'}
          </button>

          {/* Header with crack effect */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 text-center relative overflow-hidden">
            {/* Pulsing crack lines */}
            <motion.div
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 30% 40%, rgba(251,113,133,0.3) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(251,113,133,0.2) 0%, transparent 35%)',
              }}
            />
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0px rgba(251,113,133,0)', '0 0 20px rgba(251,113,133,0.4)', '0 0 0px rgba(251,113,133,0)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-500/30"
              >
                <Wrench size={28} className="text-rose-400" />
              </motion.div>
              <h2 className="text-xl font-black text-white mb-2">
                {lang === 'en' ? 'Repair Mode' : '修复模式'}
              </h2>
              <p className="text-rose-300 font-bold">{topicTitle}</p>
              <p className="text-white/30 text-xs mt-2">
                {lang === 'en'
                  ? "You're not broken — you just need a closer look at this one thing."
                  : '你不是不会——你只是在这个地方需要多看一眼。'}
              </p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-sm font-bold text-white">
                {lang === 'en' ? 'Detected Issue' : '检测到的问题'}
              </span>
            </div>
            {pattern ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pattern.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{lang === 'en' ? pattern.label.en : pattern.label.zh}</p>
                  <p className="text-xs text-white/50">{lang === 'en' ? pattern.description.en : pattern.description.zh}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/50">
                {lang === 'en' ? 'This skill needs stabilisation.' : '此技能需要巩固。'}
              </p>
            )}
          </div>

          {/* Impact */}
          {downstreamTopics.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-400 mb-2">
                {lang === 'en' ? 'Impact — this affects:' : '影响范围：'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {downstreamTopics.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-300 font-bold">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Repair plan */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-400 mb-2">
              {lang === 'en' ? 'Repair Plan' : '修复方案'}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1"><BookOpen size={12} /> {TOTAL_QUESTIONS} {lang === 'en' ? 'questions' : '题'}</span>
              <span className="flex items-center gap-1"><Zap size={12} /> ~3 {lang === 'en' ? 'min' : '分钟'}</span>
              <span className="flex items-center gap-1"><Shield size={12} /> {lang === 'en' ? 'Instant feedback' : '即时反馈'}</span>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { playTap(); setPhase('practice'); }}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <Wrench size={20} />
            {lang === 'en' ? 'Start Repair' : '开始修复'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ═══ Practice Phase ═══
  if (phase === 'practice' && currentQuestion) {
    const p = currentQuestion.data ?? {};
    const desc = interpolate(lt(currentQuestion.description, lang), p);

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Header */}
        <div className="bg-rose-900/30 border-b border-rose-500/20 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={16} className="text-rose-400" />
              <span className="text-sm font-bold text-rose-300">
                {lang === 'en' ? 'Repair Mode' : '修复模式'}
              </span>
            </div>
            <span className="text-sm font-black text-white tabular-nums">
              {currentQ + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
          {/* Progress bar */}
          <div className="max-w-lg mx-auto mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${((currentQ + 1) / TOTAL_QUESTIONS) * 100}%` }}
              className="h-full bg-rose-400 rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg w-full space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <LatexText text={desc} className="text-white text-sm font-bold" />
            </div>

            {/* Pattern hint */}
            {pattern && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2">
                <p className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                  <span>{pattern.icon}</span>
                  {lang === 'en' ? pattern.recoveryHint.en : pattern.recoveryHint.zh}
                </p>
              </div>
            )}

            {/* Input fields — uses inputConfig for correct field IDs per question type */}
            <div className="space-y-3">
              {(() => {
                const fieldConfig = INPUT_FIELDS[currentQuestion.type];
                const langKey = lang === 'en' ? 'en' : 'zh';
                const fields = fieldConfig?.[langKey] ?? fieldConfig?.zh ?? [{ id: 'ans', label: lang === 'en' ? 'Answer' : '答案', placeholder: '?' }];
                return fields.map((field, fi) => (
                  <div key={field.id}>
                    <label className="text-[10px] text-white/40 font-bold mb-1 block">{field.label}</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={inputs[field.id] ?? ''}
                      onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg font-bold text-center placeholder:text-white/20 focus:border-rose-400 focus:outline-none"
                      onKeyDown={e => { if (e.key === 'Enter' && fi === fields.length - 1) handleSubmit(); }}
                      autoFocus={fi === 0}
                    />
                  </div>
                ));
              })()}

              {/* Feedback overlay */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-xl text-center font-bold ${
                      showFeedback === 'correct' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {showFeedback === 'correct'
                      ? (lang === 'en'
                        ? `Feel that? That's a piece clicking into place. ${correctCount + 1}/${TOTAL_QUESTIONS} repaired.`
                        : `感觉到了吗？那是一块拼图咔嗒到位的声音。${correctCount + 1}/${TOTAL_QUESTIONS} 已修复。`)
                      : (lang === 'en'
                        ? `Not yet — but you're getting closer. This is exactly why we're here.`
                        : `还差一步——但你离正确越来越近了。这正是我们在这里的原因。`)
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={Object.values(inputs).every(v => !(v as string)?.trim()) || !!showFeedback}
                className="w-full py-4 bg-rose-600 text-white font-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === 'en' ? 'Submit' : '提交'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ Complete Phase ═══
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Confetti trigger={confettiTrigger} theme="goldWhite" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {isSuccess ? (
          <>
            {/* Glowing restored node effect */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-emerald-400 blur-xl"
              />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="relative w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400/40"
              >
                <CheckCircle2 size={40} className="text-emerald-400" />
              </motion.div>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-black text-white"
            >
              {lang === 'en' ? 'Skill Repaired!' : '技能已修复！'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-emerald-400 font-bold"
            >
              {pattern
                ? (lang === 'en' ? `${pattern.label.en} resolved` : `${pattern.label.zh}已消除`)
                : (lang === 'en' ? `${topicTitle} stabilised` : `${topicTitle}已稳定`)
              }
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/50 text-sm italic"
            >
              {lang === 'en'
                ? "This is yours now. You earned it."
                : '这是你挣来的。这个技能现在真的属于你了。'}
            </motion.p>
            <p className="text-white/30 text-xs">
              {correctCount}/{TOTAL_QUESTIONS}
            </p>
            {downstreamTopics.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
                <p className="text-xs text-emerald-400 font-bold">
                  {lang === 'en' ? 'Downstream stability improved:' : '下游稳定性已恢复：'}
                </p>
                <p className="text-xs text-white/40 mt-1">{downstreamTopics.join(' · ')}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={40} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {lang === 'en' ? 'Almost there!' : '差一点点！'}
            </h2>
            <p className="text-amber-400 font-bold">
              {lang === 'en'
                ? `${correctCount}/${TOTAL_QUESTIONS} correct — need ${Math.ceil(TOTAL_QUESTIONS * SUCCESS_THRESHOLD)} to pass`
                : `${correctCount}/${TOTAL_QUESTIONS} 正确 — 需要 ${Math.ceil(TOTAL_QUESTIONS * SUCCESS_THRESHOLD)} 题通过`
              }
            </p>
          </>
        )}

        <div className="flex flex-col gap-2 pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className={`w-full py-4 font-black text-lg rounded-2xl ${
              isSuccess
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                : 'bg-amber-600 text-white shadow-xl shadow-amber-500/20'
            }`}
          >
            {isSuccess
              ? (lang === 'en' ? 'Continue →' : '继续 →')
              : (lang === 'en' ? 'Back to Map' : '返回地图')
            }
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
