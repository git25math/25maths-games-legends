import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, Trophy, MapIcon, Shield, Swords, ChevronRight, ChevronLeft, Volume2, VolumeX, Flame } from 'lucide-react';
import type { Mission, Character, Language, Room, DifficultyMode } from '../../types';
import { translations } from '../../i18n/translations';
import { lt } from '../../i18n/resolveText';
import { checkAnswer } from '../../utils/checkCorrectness';
import { interpolate } from '../../utils/interpolate';
import { LatexText, MathView } from '../MathView';
import { InputFields } from './InputFields';
import { VisualData } from './VisualData';
import { AnimatedTutorial } from './AnimatedTutorial';
import { useAudio } from '../../audio';
import { CharacterAvatar } from '../CharacterAvatar';
import { Confetti } from '../Confetti';
import { AchievementCard } from '../AchievementCard';
import { WrongAnswerPanel } from './WrongAnswerPanel';
import { generateMission } from '../../utils/generateMission';
import { SKILL_CARDS } from '../SkillCardSelector';
import { CalculatorWidget } from '../Calculator';

const DIFFICULTY_MULTIPLIER: Record<DifficultyMode, number> = { green: 1, amber: 1.5, red: 2 };
const TOTAL_QUESTIONS = 5;

export const MathBattle = ({
  mission,
  character,
  onComplete,
  onCancel,
  lang,
  difficultyMode,
  isMultiplayer = false,
  roomData = null,
  skillCard = null
}: {
  mission: Mission;
  character: Character;
  onComplete: (success: boolean, score?: number, durationSecs?: number, hpRemaining?: number) => void;
  onCancel: () => void;
  lang: Language;
  difficultyMode: DifficultyMode;
  isMultiplayer?: boolean;
  roomData?: Room | null;
  skillCard?: string | null;
}) => {
  const isMultiQuestion = !!mission.data?.generatorType;

  // Build question queue: 5 generated questions for multi-question, or just [mission] for single
  const [questionQueue] = useState<Mission[]>(() => {
    if (!isMultiQuestion) return [mission];
    return Array.from({ length: TOTAL_QUESTIONS }, () => generateMission(mission));
  });

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [peakStreak, setPeakStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [floatingScore, setFloatingScore] = useState<{ value: string; key: number } | null>(null);

  const currentQuestion = questionQueue[currentQIdx];

  // Tutorial only for single-question green mode
  const showTutorial = !isMultiQuestion && difficultyMode === 'green' && mission.tutorialSteps && !isMultiplayer;
  const [mode, setMode] = useState<'tutorial' | 'battle'>(showTutorial ? 'tutorial' : 'battle');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [encouragement, setEncouragement] = useState('');
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState<'none' | 'success' | 'fail'>('none');
  const [wrongAnswerData, setWrongAnswerData] = useState<{ userInputs: Record<string, string>; expected: Record<string, string> } | null>(null);
  const [hp, setHp] = useState(4);
  const [startTime] = useState(Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [shieldCharges, setShieldCharges] = useState(skillCard === 'shield' ? 2 : 0);
  const [shakeKey, setShakeKey] = useState(0);
  const shaking = shakeKey > 0;
  const achievementTimerRef = useRef<number | null>(null);
  const shakeTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const floatingKeyRef = useRef(0);

  const {
    playBGM, stopBGM, playClick, muted, toggleMute,
    playCorrect, playWrong, playVictory, playDefeat,
    playStreak, playStreakBreak, playHpLoss,
    playShieldBlock, playBattleEnter,
  } = useAudio();

  const t = translations[lang];
  const isTutorial = mode === 'tutorial' && !!mission.tutorialSteps;

  // Interpolate {param} placeholders using current question's data
  const p = currentQuestion.data ?? {};
  const storyText = interpolate(lt(currentQuestion.story, lang), p);
  const descText = interpolate(lt(currentQuestion.description, lang), p);

  // Interpolate tutorialSteps with mission data (same as story/description)
  const interpolatedTutorialSteps = currentQuestion.tutorialSteps?.map(step => ({
    ...step,
    text: { zh: interpolate(step.text.zh, p), en: interpolate(step.text.en, p) },
    ...(step.hint ? { hint: { zh: interpolate(step.hint.zh, p), en: interpolate(step.hint.en, p) } } : {}),
  }));

  // Streak multiplier: >=5 -> x2, >=3 -> x1.5, else x1
  const getStreakMultiplier = (s: number) => s >= 5 ? 2 : s >= 3 ? 1.5 : 1;

  // Battle enter stinger → BGM start on mount
  useEffect(() => {
    playBattleEnter();
    playBGM();
    return () => {
      stopBGM();
      if (achievementTimerRef.current !== null) clearTimeout(achievementTimerRef.current);
      if (shakeTimerRef.current !== null) clearTimeout(shakeTimerRef.current);
      if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showResult === 'fail') {
      const randomEnc = t.encouragements[Math.floor(Math.random() * t.encouragements.length)];
      setEncouragement(randomEnc);
    }
  }, [showResult]);

  const advanceToNextQuestion = () => {
    setInputs({});
    setWrongAnswerData(null);
    if (currentQIdx + 1 >= questionQueue.length) {
      // All questions done — success
      const duration = Math.round((Date.now() - startTime) / 1000);
      setFinalDuration(duration);
      setFinalScore(totalScore);
      setShowResult('success');
      setShowConfetti(true);
      stopBGM();
      achievementTimerRef.current = window.setTimeout(() => setShowAchievement(true), 2000);
    } else {
      setCurrentQIdx(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    playClick();
    const result = checkAnswer(currentQuestion, inputs);
    if (result.correct) {
      if (isMultiQuestion) {
        // Multi-question: combo scoring
        const newStreak = streak + 1;
        // Play streak sound (which supersedes correct) or plain correct
        if (newStreak >= 2) playStreak(newStreak);
        else playCorrect();
        const streakMult = getStreakMultiplier(newStreak);
        const diffMult = DIFFICULTY_MULTIPLIER[difficultyMode];
        const doubleMult = (skillCard === 'double' && currentQIdx >= 2) ? 2 : 1;
        const score = Math.round(currentQuestion.reward * streakMult * diffMult * doubleMult);

        setStreak(newStreak);
        setPeakStreak(prev => Math.max(prev, newStreak));
        setCorrectCount(prev => prev + 1);
        const newTotal = totalScore + score;
        setTotalScore(newTotal);

        // Floating score
        const multLabel = doubleMult > 1 ? `x${streakMult * doubleMult}` : streakMult > 1 ? `x${streakMult}` : '';
        const label = multLabel ? `+${score} (${multLabel})` : `+${score}`;
        floatingKeyRef.current += 1;
        setFloatingScore({ value: label, key: floatingKeyRef.current });

        // Check if this was the last question
        if (currentQIdx + 1 >= questionQueue.length) {
          // Final question correct — show success after brief delay
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(newTotal);
          advanceTimerRef.current = window.setTimeout(() => {
            playVictory();
            setShowResult('success');
            setShowConfetti(true);
            stopBGM();
            achievementTimerRef.current = window.setTimeout(() => setShowAchievement(true), 2000);
          }, 600);
        } else {
          // Advance after 600ms
          advanceTimerRef.current = window.setTimeout(() => {
            setInputs({});
            setWrongAnswerData(null);
            setCurrentQIdx(prev => prev + 1);
          }, 600);
        }
      } else {
        // Single-question: victory replaces correct (avoid overlap)
        playVictory();  // no playCorrect — victory subsumes it
        const duration = (Date.now() - startTime) / 1000;
        const speedBonus = Math.max(0, 100 - Math.floor(duration));
        const multiplier = DIFFICULTY_MULTIPLIER[difficultyMode];
        const score = Math.round((mission.reward + speedBonus) * multiplier);
        setFinalScore(score);
        setFinalDuration(Math.round(duration));
        setShowResult('success');
        setShowConfetti(true);
        stopBGM();
        achievementTimerRef.current = window.setTimeout(() => setShowAchievement(true), 2000);
      }
    } else {
      playWrong();
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      setShakeKey(k => k + 1);
      shakeTimerRef.current = window.setTimeout(() => setShakeKey(0), 500);
      // Show wrong answer panel with solution before deducting HP
      setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
    }
  };

  const handleWrongAnswerContinue = () => {
    setWrongAnswerData(null);
    setInputs({});

    if (isMultiQuestion) {
      // Reset streak on wrong
      if (streak >= 2) playStreakBreak();
      setStreak(0);

      // Shield absorbs wrong answer damage
      if (shieldCharges > 0) {
        playShieldBlock();
        setShieldCharges(prev => prev - 1);
        // Shield absorbed — still alive, advance
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => {
            setShowResult('success');
            setShowConfetti(true);
            stopBGM();
            achievementTimerRef.current = window.setTimeout(() => setShowAchievement(true), 2000);
          }, 300);
        } else {
          setCurrentQIdx(prev => prev + 1);
        }
        return;
      }

      playHpLoss();
      const nextHp = hp - 1;
      setHp(nextHp);
      if (nextHp <= 0) {
        // Show fail overlay immediately to block interaction;
        // defeat sound plays after hpLoss fades (400ms)
        setShowResult('fail');
        stopBGM();
        advanceTimerRef.current = window.setTimeout(() => playDefeat(), 400);
      }

      // Still alive — advance to next question
      if (nextHp > 0) {
        if (currentQIdx + 1 >= questionQueue.length) {
          // Was last question, show success (they survived)
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => {
            setShowResult('success');
            setShowConfetti(true);
            stopBGM();
            achievementTimerRef.current = window.setTimeout(() => setShowAchievement(true), 2000);
          }, 300);
        } else {
          setCurrentQIdx(prev => prev + 1);
        }
      }
    } else {
      // Single-question: original behavior
      const nextSingleHp = hp - 1;
      setHp(nextSingleHp);
      if (nextSingleHp <= 0) {
        setShowResult('fail');
        stopBGM();
        advanceTimerRef.current = window.setTimeout(() => playDefeat(), 400);
      }
    }
  };

  const handleAchievementClose = () => {
    onComplete(true, isMultiQuestion ? totalScore : finalScore, finalDuration, hp);
  };

  const handleRetry = () => {
    setHp(4);
    setShowResult('none');
    setInputs({});
    setWrongAnswerData(null);
    setCurrentQIdx(0);
    setCorrectCount(0);
    setStreak(0);
    setPeakStreak(0);
    setTotalScore(0);
    setFloatingScore(null);
    setShieldCharges(skillCard === 'shield' ? 2 : 0);
    playBGM();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/95 backdrop-blur-md">
    <div className="min-h-full flex items-center justify-center py-4">
      <Confetti active={showConfetti} />
      <CalculatorWidget
        lang={lang}
        onUseResult={(val) => setInputs(prev => {
          // Put result in the first empty field, or the first field
          const fields = Object.keys(prev);
          const emptyField = fields.find(f => !prev[f]) || fields[0];
          if (emptyField) return { ...prev, [emptyField]: val };
          return prev;
        })}
      />

      {showAchievement && (
        <AchievementCard
          characterId={character.id}
          missionTitle={mission.title}
          score={isMultiQuestion ? totalScore : finalScore}
          duration={finalDuration}
          hp={hp}
          difficulty={difficultyMode}
          lang={lang}
          onClose={handleAchievementClose}
          {...(isMultiQuestion ? { correctCount, totalQuestions: questionQueue.length, peakStreak } : {})}
        />
      )}

      <motion.div
        key={`battle-${shakeKey}`}
        initial={shakeKey > 0 ? false : { scale: 0.9, opacity: 0 }}
        animate={shaking ? { x: [0, -6, 6, -4, 4, -2, 2, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={shaking ? { duration: 0.4, ease: 'easeOut' } : undefined}
        className={`bg-[#f4e4bc] w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[6px] md:border-[12px] border-[#3d2b1f] relative ${shaking ? 'border-red-600' : ''}`}
      >
        {/* Header */}
        <div className="bg-[#3d2b1f] p-4 text-[#f4e4bc] flex justify-between items-center border-b-4 border-[#5c4033]">
          <div className="flex items-center gap-4">
            <CharacterAvatar characterId={character.id} size={56} />
            <div>
              <h2 className="text-base md:text-xl font-black tracking-widest">{lt(character.name, lang)} - {lt(mission.title, lang)}</h2>
              <div className="flex gap-1 mt-1 items-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border border-black ${i < hp ? 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'bg-slate-800'}`} />
                ))}
                <span className="text-[10px] ml-2 font-bold text-red-400 uppercase">{t.hp}</span>

                {/* Streak badge */}
                {isMultiQuestion && streak >= 2 && (
                  <span className="ml-3 flex items-center gap-1 px-2 py-0.5 rounded bg-orange-600 text-[10px] font-black uppercase animate-pulse">
                    <Flame size={12} />
                    {streak} {t.streakLabel}
                  </span>
                )}

                {/* Shield charges indicator */}
                {skillCard === 'shield' && shieldCharges > 0 && (
                  <span className="ml-3 px-2 py-0.5 rounded bg-blue-600/60 text-[10px] font-black">
                    {'\u{1F6E1}\u{FE0F}'} {'\u00D7'}{shieldCharges}
                  </span>
                )}

                {/* Difficulty badge */}
                <span className="ml-4 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600">
                  {t.challenge}
                </span>

                {/* Active skill card badge */}
                {skillCard && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-600/50">
                    {SKILL_CARDS.find(c => c.id === skillCard)?.icon}
                  </span>
                )}
              </div>

              {/* Progress indicator for multi-question */}
              {isMultiQuestion && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold text-[#f4e4bc]/70">
                    {(t.questionProgress as string).replace('{n}', String(currentQIdx + 1)).replace('{total}', String(questionQueue.length))}
                  </span>
                  <div className="flex gap-1">
                    {questionQueue.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < currentQIdx ? 'bg-emerald-400' :
                          i === currentQIdx ? 'bg-yellow-400' :
                          'bg-[#f4e4bc]/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mute button */}
            <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {!isMultiplayer && (
              <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Battle Content */}
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Tactical Map */}
          <div className="bg-[#e8d5a7] rounded-lg p-6 border-2 border-[#3d2b1f]/20 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-[#3d2b1f] font-bold border-b border-[#3d2b1f]/10 pb-2">
              <MapIcon size={18} />
              <span>{t.calculating}</span>
            </div>

            <div className="bg-white/40 p-3 rounded-lg mb-4 italic text-xs text-[#5c4033] border-l-4 border-[#8b0000]">
              <LatexText text={storyText} />
            </div>

            <div className="text-[#5c4033] text-sm font-bold mb-6 leading-relaxed">
              <LatexText text={descText} />
            </div>
            <VisualData mission={currentQuestion} lang={lang} />

            {/* Reveal skill card: show formula hint on Q1 */}
            {skillCard === 'reveal' && currentQIdx === 0 && (
              <div className="mt-4 p-3 bg-purple-100 border-2 border-purple-300 rounded-lg">
                <div className="text-purple-800 text-xs font-bold mb-1">{'\u{1F52E}'} {t.secretFormula}</div>
                <MathView tex={currentQuestion.secret.formula.replace(/\$/g, '')} className="text-lg font-black text-purple-900" />
              </div>
            )}

            {/* Amber mode: show formula hint */}
            {difficultyMode === 'amber' && (
              <div className="mt-4 p-3 bg-amber-100 border-2 border-amber-300 rounded-lg">
                <div className="text-amber-800 text-xs font-bold mb-1">{t.secretFormula}</div>
                <MathView tex={currentQuestion.secret.formula.replace(/\$/g, '')} className="text-lg font-black text-amber-900" />
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-[#3d2b1f]/10">
              <div className="flex items-center gap-2 text-[#5c4033] text-xs font-bold">
                <Shield size={14} />
                <span>{t.defense}：{character.stats.wisdom}</span>
              </div>
            </div>
          </div>

          {/* Right: Inputs */}
          <div className="space-y-6">
            {/* Tutorial overlay for Green mode (single-question only) */}
            {isTutorial && interpolatedTutorialSteps && (
              <AnimatedTutorial
                tutorialSteps={interpolatedTutorialSteps}
                equationSteps={mission.data?.tutorialEquationSteps}
                characterId={character.id}
                currentStep={tutorialStep}
                lang={lang}
              />
            )}

            <InputFields
              mission={currentQuestion}
              inputs={inputs}
              setInputs={setInputs}
              difficultyMode={difficultyMode}
              tutorialStep={tutorialStep}
              isTutorial={isTutorial}
              lang={lang}
            />

            {/* Wrong answer review panel */}
            {wrongAnswerData && (
              <WrongAnswerPanel
                questionType={currentQuestion.type}
                userInputs={wrongAnswerData.userInputs}
                expected={wrongAnswerData.expected}
                formula={currentQuestion.secret.formula}
                tutorialSteps={interpolatedTutorialSteps}
                lang={lang}
                onContinue={handleWrongAnswerContinue}
                storyText={mission.storyConsequence ? lt(mission.storyConsequence.wrong, lang) : undefined}
              />
            )}

            {isTutorial ? (
              <div className="flex gap-2">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => { playClick(); setTutorialStep(prev => prev - 1); }}
                    className="flex-1 py-4 bg-slate-500 text-white font-black rounded-lg shadow-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2 min-h-12"
                  >
                    <ChevronLeft size={20} />
                    {t.prevStep}
                  </button>
                )}
                <button
                  onClick={() => {
                    playClick();
                    if (tutorialStep < (mission.tutorialSteps?.length || 0) - 1) {
                      setTutorialStep(prev => prev + 1);
                    } else {
                      setMode('battle');
                      setInputs({});
                    }
                  }}
                  className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 min-h-12"
                >
                  {tutorialStep < (mission.tutorialSteps?.length || 0) - 1 ? t.nextStep : t.tutorialStartBattle}
                  <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!!wrongAnswerData}
                className={`w-full py-4 md:py-6 text-[#f4e4bc] text-lg md:text-2xl font-black rounded-lg transition-all flex items-center justify-center gap-4 border-2 min-h-12 ${wrongAnswerData ? 'bg-slate-500 border-slate-600 cursor-not-allowed' : 'bg-[#8b0000] hover:bg-[#a50000] shadow-[0_4px_0_#5c0000] active:translate-y-1 active:shadow-none border-[#5c0000]'}`}
              >
                <Swords size={28} />
                {t.attack}
              </button>
            )}

          </div>
        </div>

        {/* Floating Score Animation */}
        <AnimatePresence>
          {floatingScore && (
            <motion.div
              key={floatingScore.key}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -60, opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none z-30 text-3xl font-black text-yellow-500 drop-shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              {floatingScore.value}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Overlay */}
        <AnimatePresence>
          {showResult !== 'none' && !showAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center z-20 ${
                showResult === 'success' ? 'bg-[#f4e4bc]/90' : 'bg-[#3d2b1f]/90'
              }`}
            >
              {showResult === 'success' ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-white p-6 md:p-12 rounded-full border-8 border-yellow-500 shadow-2xl">
                  <Trophy size={80} className="text-yellow-500 mb-4 mx-auto" />
                  <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{t.successTitle}</h3>
                  <p className="text-slate-600 font-bold">{t.successDesc}</p>
                  {mission.storyConsequence && (
                    <p className="text-emerald-600 font-bold mt-3 italic text-sm">{lt(mission.storyConsequence.correct, lang)}</p>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ y: 50 }} animate={{ y: 0 }}>
                  <XCircle size={80} className="text-red-500 mb-6 mx-auto" />
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4">{t.failTitle}</h3>
                  <p className="text-slate-400 mb-2">{t.failDesc}</p>
                  {mission.storyConsequence ? (
                    <p className="text-amber-400 font-bold mb-8 italic">{lt(mission.storyConsequence.wrong, lang)}</p>
                  ) : (
                    <p className="text-indigo-400 font-bold mb-8 italic">"{encouragement}"</p>
                  )}
                  <button
                    onClick={handleRetry}
                    className="px-12 py-5 bg-red-700 text-white font-black rounded-xl shadow-xl hover:bg-red-600 transition-all"
                  >
                    {t.retry}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </div>
  );
};
