/**
 * MathBattle — Main battle component (v8.4 refactor)
 * Orchestrates state + logic; delegates rendering to sub-components:
 *   BattleHeader, BattleContent, BattleEffects, ResultOverlay
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { Mission, Character, Language, Room, DifficultyMode } from '../../types';
import { translations } from '../../i18n/translations';
import { lt, resolveFormula } from '../../i18n/resolveText';
import { checkAnswer, checkPartialCredit } from '../../utils/checkCorrectness';
import { interpolate } from '../../utils/interpolate';
import { VICTORY_TIMING, BATTLE_TIMING } from '../../utils/animationPresets';
import { INPUT_FIELDS } from './inputConfig';
import { useAudio } from '../../audio';
import { Confetti } from '../Confetti';
import { CalculatorWidget } from '../Calculator';
import { generateMission } from '../../utils/generateMission';
import { diagnoseError } from '../../utils/diagnoseError';
import { logAttempt } from '../../utils/logAttempt';

import { BattleHeader } from './BattleHeader';
import { BattleContent } from './BattleContent';
import { BattleEffects } from './BattleEffects';
import { ResultOverlay } from './ResultOverlay';
import { BugReportButton } from '../BugReportButton';
import type { BattleMode } from '../BattleModeSelector';
import { createQuestionFingerprint } from '../../utils/questionFingerprint';

const DIFFICULTY_MULTIPLIER: Record<DifficultyMode, number> = { green: 1, amber: 1.5, red: 2 };
const MODE_QUESTIONS: Record<BattleMode, number> = { classic: 5, speed: 50, marathon: 20 };
const MODE_HP: Record<BattleMode, number> = { classic: 4, speed: 999, marathon: 999 };

export const MathBattle = ({
  mission,
  character,
  onComplete,
  onCancel,
  lang,
  difficultyMode,
  isMultiplayer = false,
  roomData = null,
  skillCard = null,
  isFirstClear = false,
  completedDifficulties = {},
  isDailyChallenge = false,
  dailyMultiplier = 1,
  hotTopicMultiplier = 1,
  onStreakToken,
  onStreakMilestone3,
  onRecordError,
  onDiagnose,
  battleMode = 'classic',
  heroSkillEffect = null,
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
  isFirstClear?: boolean;
  completedDifficulties?: Record<string, boolean>;
  isDailyChallenge?: boolean;
  dailyMultiplier?: number;
  hotTopicMultiplier?: number;
  onStreakToken?: () => void;
  onStreakMilestone3?: () => void;
  onRecordError?: (errorType: import('../../utils/diagnoseError').ErrorType) => void;
  onDiagnose?: () => void;
  battleMode?: BattleMode;
  heroSkillEffect?: { effect: 'extra_hint' | 'time_extend' | 'error_forgive'; value: number } | null;
}) => {
  const isMultiQuestion = !!mission.data?.generatorType;
  const totalQuestions = isMultiQuestion ? MODE_QUESTIONS[battleMode] : 1;

  // Build question queue with deduplication
  const [questionQueue] = useState<Mission[]>(() => {
    if (!isMultiQuestion) return [mission];
    const queue: Mission[] = [];
    const seen = new Set<string>();
    let attempts = 0;
    while (queue.length < totalQuestions && attempts < totalQuestions * 3) {
      const q = generateMission(mission);
      const fp = createQuestionFingerprint(q);
      attempts++;
      if (seen.has(fp) && attempts < totalQuestions * 2) continue;
      seen.add(fp);
      queue.push(q);
    }
    return queue;
  });

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [peakStreak, setPeakStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [floatingScore, setFloatingScore] = useState<{ value: string; key: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questionQueue[currentQIdx] ?? mission;

  // Tutorial only for single-question green mode
  const showTutorial = !isMultiQuestion && difficultyMode === 'green' && mission.tutorialSteps && !isMultiplayer;
  const [mode, setMode] = useState<'tutorial' | 'battle'>(showTutorial ? 'tutorial' : 'battle');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [encouragement, setEncouragement] = useState('');
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState<'none' | 'success' | 'fail'>('none');
  const [wrongAnswerData, setWrongAnswerData] = useState<{ userInputs: Record<string, string>; expected: Record<string, string> } | null>(null);
  const [hp, setHp] = useState(MODE_HP[battleMode]);
  const [heroForgiveCharges, setHeroForgiveCharges] = useState(
    heroSkillEffect?.effect === 'error_forgive' ? heroSkillEffect.value : 0
  );
  const [startTime] = useState(Date.now());
  const [victoryPhase, setVictoryPhase] = useState<0|1|2|3|4|5>(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiTheme, setConfettiTheme] = useState<'default' | 'goldWhite'>('default');
  const [finalScore, setFinalScore] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [shieldCharges, setShieldCharges] = useState(skillCard === 'shield' ? 2 : 0);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);

  // Multiple-choice state
  const [mcResult, setMcResult] = useState<'correct' | 'wrong' | null>(null);
  const [mcSelectedIndex, setMcSelectedIndex] = useState<number | null>(null);
  const [mcCorrectIndex, setMcCorrectIndex] = useState<number | undefined>(undefined);
  const isMultipleChoice = !!currentQuestion.data?.choices;
  const [partialCreditInfo, setPartialCreditInfo] = useState<{ score: number } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const shaking = shakeKey > 0;
  const [speedTimeLeft, setSpeedTimeLeft] = useState(battleMode === 'speed' ? 60000 : 0);
  const speedIntervalRef = useRef<number | null>(null);
  const totalScoreRef = useRef(0);
  totalScoreRef.current = totalScore;
  const achievementTimerRef = useRef<number | null>(null);
  const shakeTimerRef = useRef<number | null>(null);
  const questionStartRef = useRef(Date.now());
  useEffect(() => { questionStartRef.current = Date.now(); }, [currentQIdx]);
  const advanceTimerRef = useRef<number | null>(null);
  const milestoneTimerRef = useRef<number | null>(null);
  const victoryReturnTimerRef = useRef<number | null>(null);
  const floatingKeyRef = useRef(0);

  const {
    playBGM, stopBGM, playClick, muted, toggleMute,
    playCorrect, playWrong, playVictory, playDefeat,
    playStreak, playStreakBreak, playHpLoss,
    playShieldBlock, playBattleEnter, playPartialCredit,
  } = useAudio();

  const t = translations[lang];
  const isTutorial = mode === 'tutorial' && !!mission.tutorialSteps;

  // Interpolate placeholders
  const p = currentQuestion.data ?? {};
  const storyText = interpolate(lt(currentQuestion.story, lang), p);
  const descText = interpolate(lt(currentQuestion.description, lang), p);
  const interpolatedTutorialSteps = currentQuestion.tutorialSteps?.map(step => ({
    ...step,
    text: { zh: interpolate(step.text.zh, p), en: interpolate(step.text.en, p) },
    ...(step.hint ? { hint: { zh: interpolate(step.hint.zh, p), en: interpolate(step.hint.en, p) } } : {}),
  }));

  const getStreakMultiplier = (s: number) => s >= 5 ? 2 : s >= 3 ? 1.5 : 1;

  // ── Lifecycle ──

  useEffect(() => {
    playBattleEnter();
    playBGM();
    return () => {
      stopBGM();
      if (achievementTimerRef.current !== null) clearTimeout(achievementTimerRef.current);
      if (shakeTimerRef.current !== null) clearTimeout(shakeTimerRef.current);
      if (advanceTimerRef.current !== null) clearTimeout(advanceTimerRef.current);
      if (milestoneTimerRef.current !== null) clearTimeout(milestoneTimerRef.current);
      if (victoryReturnTimerRef.current !== null) clearTimeout(victoryReturnTimerRef.current);
      if (speedIntervalRef.current !== null) clearInterval(speedIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (battleMode !== 'speed' || showResult !== 'none') return;
    speedIntervalRef.current = window.setInterval(() => {
      setSpeedTimeLeft(prev => {
        if (prev <= 100) {
          if (speedIntervalRef.current !== null) clearInterval(speedIntervalRef.current);
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(totalScoreRef.current);
          triggerVictorySequence();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => { if (speedIntervalRef.current !== null) clearInterval(speedIntervalRef.current); };
  }, [battleMode, showResult]);

  useEffect(() => {
    if (showResult === 'fail') {
      const randomEnc = t.encouragements[Math.floor(Math.random() * t.encouragements.length)];
      setEncouragement(randomEnc);
    }
  }, [showResult]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (wrongAnswerData) handleWrongAnswerContinue();
      else if (showResult === 'none' && mode === 'battle') handleSubmit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── Core Logic ──

  const triggerVictorySequence = () => {
    setShowResult('success');
    setVictoryPhase(0);
    window.setTimeout(() => stopBGM(), VICTORY_TIMING.dimScreen - 50);
    window.setTimeout(() => {
      playVictory();
      setConfettiTheme('default');
      setConfettiTrigger(prev => prev + 1);
      setVictoryPhase(1);
    }, VICTORY_TIMING.dimScreen);
    achievementTimerRef.current = window.setTimeout(() => setVictoryPhase(2), VICTORY_TIMING.badgeDrop);
    advanceTimerRef.current = window.setTimeout(() => setVictoryPhase(3), VICTORY_TIMING.statsReveal);
    shakeTimerRef.current = window.setTimeout(() => {
      if (mission.skillName) {
        setVictoryPhase(4);
        setConfettiTheme('goldWhite');
        setConfettiTrigger(prev => prev + 1);
        victoryReturnTimerRef.current = window.setTimeout(() => setVictoryPhase(5), VICTORY_TIMING.returnButton - VICTORY_TIMING.skillBadge);
      } else if (isFirstClear) {
        setConfettiTheme('goldWhite');
        setConfettiTrigger(prev => prev + 1);
        setVictoryPhase(5);
      } else {
        setVictoryPhase(5);
      }
    }, VICTORY_TIMING.skillBadge);
  };

  // Multiple-choice handler: set inputs + auto-submit
  const handleMcSelect = (value: string, index: number) => {
    if (isSubmitting || showResult !== 'none' || mcResult) return;
    const correctIdx = (currentQuestion.data.choices as any[]).findIndex((c: any) => String(c.value) === String(currentQuestion.data.correctChoice));
    setMcSelectedIndex(index);
    setMcCorrectIndex(correctIdx);
    // Set the answer in inputs with _mc flag so checkAnswer uses MC path
    setInputs({ ans: value, _mc: '1' });
    const isCorrect = String(value) === String(currentQuestion.data.correctChoice);
    setMcResult(isCorrect ? 'correct' : 'wrong');
    playClick();
    // Delay then process via normal submit flow
    setTimeout(() => {
      setInputs({ ans: value, _mc: '1' });
      handleSubmit();
    }, 600); // Show visual feedback before advancing
  };

  const handleSubmit = () => {
    if (isSubmitting || showResult !== 'none') return;
    // Validate: all fields must have content
    const langKey = lang === 'en' ? 'en' : lang === 'zh_TW' ? 'zh_TW' : 'zh';
    const fieldConfig = INPUT_FIELDS[currentQuestion.type];
    const fields = fieldConfig?.[langKey] ?? fieldConfig?.zh ?? [];
    if (fields.some((f: { id: string }) => !inputs[f.id]?.trim())) {
      setShakeKey(k => k + 1);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = window.setTimeout(() => setShakeKey(0), 400);
      return;
    }
    setIsSubmitting(true);
    playClick();
    const rawResult = checkAnswer(currentQuestion, inputs);
    const result = checkPartialCredit(currentQuestion, inputs, rawResult);
    const qDurationMs = Date.now() - questionStartRef.current;
    const firstVal = (Object.values(inputs)[0] as string) || '';

    if (result.correct) {
      logAttempt({ questionId: `${mission.id}-battle-${currentQIdx}`, nodeId: mission.kpId || mission.type, isCorrect: true, rawAnswer: firstVal, sourceMode: 'practice', durationMs: qDurationMs });
      if (isMultiQuestion) {
        const newStreak = streak + 1;
        if (newStreak >= 2) playStreak(newStreak); else playCorrect();
        const streakMult = getStreakMultiplier(newStreak);
        const diffMult = DIFFICULTY_MULTIPLIER[difficultyMode];
        const doubleMult = (skillCard === 'double' && currentQIdx >= 2) ? 2 : 1;
        const score = Math.round(currentQuestion.reward * streakMult * diffMult * doubleMult * dailyMultiplier * hotTopicMultiplier);

        setStreak(newStreak);
        setPeakStreak(prev => Math.max(prev, newStreak));
        setCorrectCount(prev => prev + 1);
        const newTotal = totalScore + score;
        setTotalScore(newTotal);

        if ([3, 5, 8].includes(newStreak)) {
          setStreakMilestone(newStreak);
          if (milestoneTimerRef.current !== null) clearTimeout(milestoneTimerRef.current);
          milestoneTimerRef.current = window.setTimeout(() => setStreakMilestone(null), 800);
          if (newStreak === 3 && onStreakMilestone3) onStreakMilestone3();
          if (newStreak === 5 && onStreakToken) onStreakToken();
        }

        if (battleMode === 'speed') setSpeedTimeLeft(prev => prev + 5000);

        const multLabel = doubleMult > 1 ? `x${streakMult * doubleMult}` : streakMult > 1 ? `x${streakMult}` : '';
        const timeLabel = battleMode === 'speed' ? ' +5s' : '';
        const label = multLabel ? `+${score} (${multLabel})${timeLabel}` : `+${score}${timeLabel}`;
        floatingKeyRef.current += 1;
        setFloatingScore({ value: label, key: floatingKeyRef.current });

        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(newTotal);
          advanceTimerRef.current = window.setTimeout(() => triggerVictorySequence(), BATTLE_TIMING.advance);
        } else {
          advanceTimerRef.current = window.setTimeout(() => {
            setInputs({}); setWrongAnswerData(null); setPartialCreditInfo(null); setIsSubmitting(false);
            setMcResult(null); setMcSelectedIndex(null); setMcCorrectIndex(undefined);
            setCurrentQIdx(prev => prev + 1);
          }, BATTLE_TIMING.advance);
        }
      } else {
        setIsSubmitting(false);
        const duration = (Date.now() - startTime) / 1000;
        const speedBonus = Math.max(0, 100 - Math.floor(duration));
        const multiplier = DIFFICULTY_MULTIPLIER[difficultyMode];
        const score = Math.round((mission.reward + speedBonus) * multiplier * dailyMultiplier * hotTopicMultiplier);
        setFinalScore(score);
        setFinalDuration(Math.round(duration));
        triggerVictorySequence();
      }
    } else if (result.partial) {
      playPartialCredit();
      if (isMultiQuestion) {
        const diffMult = DIFFICULTY_MULTIPLIER[difficultyMode];
        const partialScore = Math.round(currentQuestion.reward * 0.5 * diffMult * dailyMultiplier);
        const newTotal = totalScore + partialScore;
        setTotalScore(newTotal);
        floatingKeyRef.current += 1;
        setFloatingScore({ value: `+${partialScore} (50%)`, key: floatingKeyRef.current });
        setPartialCreditInfo({ score: partialScore });
        setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
      } else {
        setPartialCreditInfo({ score: 0 });
        setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
      }
    } else {
      playWrong();
      setPartialCreditInfo(null);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      setShakeKey(k => k + 1);
      shakeTimerRef.current = window.setTimeout(() => setShakeKey(0), BATTLE_TIMING.shake);
      const diag = diagnoseError(inputs, result.expected);
      logAttempt({ questionId: `${mission.id}-battle-${currentQIdx}`, nodeId: mission.kpId || mission.type, isCorrect: false, rawAnswer: firstVal, errorPatternId: diag.type, sourceMode: 'practice', durationMs: qDurationMs });
      if (onRecordError) {
        onRecordError(diag.type);
      }
      setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
    }
  };

  const handleWrongAnswerContinue = () => {
    const wasPartial = !!partialCreditInfo;
    setWrongAnswerData(null); setInputs({}); setPartialCreditInfo(null); setIsSubmitting(false);
    setMcResult(null); setMcSelectedIndex(null); setMcCorrectIndex(undefined);

    if (wasPartial) {
      if (isMultiQuestion) {
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration); setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => triggerVictorySequence(), BATTLE_TIMING.advance);
        } else { setCurrentQIdx(prev => prev + 1); }
      }
      return;
    }

    if (isMultiQuestion) {
      if (streak >= 2) playStreakBreak();
      setStreak(0);

      if (shieldCharges > 0) {
        playShieldBlock(); setShieldCharges(prev => prev - 1);
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration); setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => triggerVictorySequence(), BATTLE_TIMING.shieldVictory);
        } else { setCurrentQIdx(prev => prev + 1); }
        return;
      }

      if (heroForgiveCharges > 0) {
        playShieldBlock(); setHeroForgiveCharges(prev => prev - 1);
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration); setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => triggerVictorySequence(), BATTLE_TIMING.shieldVictory);
        } else { setCurrentQIdx(prev => prev + 1); }
        return;
      }

      let alive = true;
      if (battleMode === 'speed') {
        playHpLoss(); setSpeedTimeLeft(prev => Math.max(0, prev - 10000));
        floatingKeyRef.current += 1;
        setFloatingScore({ value: '-10s', key: floatingKeyRef.current });
      } else if (battleMode === 'marathon') {
        playHpLoss();
      } else {
        playHpLoss();
        const nextHp = hp - 1; setHp(nextHp);
        if (nextHp <= 0) {
          alive = false; setShowResult('fail'); stopBGM();
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration); setFinalScore(totalScore);
          onComplete(false, totalScore, duration, 0);
          advanceTimerRef.current = window.setTimeout(() => playDefeat(), BATTLE_TIMING.defeatSound);
        }
      }

      if (alive) {
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration); setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => { stopBGM(); triggerVictorySequence(); }, BATTLE_TIMING.shieldVictory);
        } else { setCurrentQIdx(prev => prev + 1); }
      }
    } else {
      const nextSingleHp = hp - 1; setHp(nextSingleHp);
      if (nextSingleHp <= 0) {
        setShowResult('fail'); stopBGM();
        const duration = Math.round((Date.now() - startTime) / 1000);
        setFinalDuration(duration); setFinalScore(totalScore);
        onComplete(false, totalScore, duration, 0);
        advanceTimerRef.current = window.setTimeout(() => playDefeat(), BATTLE_TIMING.defeatSound);
      }
    }
  };

  const heroScoreBonus = heroSkillEffect?.effect === 'time_extend' ? (heroSkillEffect.value / 100) : 0;

  const handleAchievementClose = () => {
    const baseScore = isMultiQuestion ? totalScore : finalScore;
    const bonusScore = Math.round(baseScore * heroScoreBonus);
    // Score decay: 50% per retry (1st retry = 50%, 2nd retry = 25%)
    const retryPenalty = retryCount > 0 ? Math.pow(0.5, retryCount) : 1;
    const adjustedScore = Math.round((baseScore + bonusScore) * retryPenalty);
    onComplete(true, adjustedScore, finalDuration, hp);
  };

  const canRetry = retryCount < MAX_RETRIES;

  const handleRetry = () => {
    if (!canRetry) return;
    setRetryCount(prev => prev + 1);
    setHp(4); setShowResult('none'); setInputs({}); setWrongAnswerData(null); setPartialCreditInfo(null);
    setStreakMilestone(null); setCurrentQIdx(0); setCorrectCount(0); setStreak(0); setPeakStreak(0);
    setTotalScore(0); setFloatingScore(null); setShieldCharges(skillCard === 'shield' ? 2 : 0);
    setConfettiTheme('default'); setVictoryPhase(0); playBGM();
  };

  // ── Render ──

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/95 backdrop-blur-md">
    <div className="min-h-full flex items-center justify-center py-4">
      <Confetti trigger={confettiTrigger} />
      <CalculatorWidget
        lang={lang}
        onUseResult={(val) => {
          const fieldConfig = INPUT_FIELDS[currentQuestion.type];
          const langKey = lang === 'en' ? 'en' : 'zh';
          const fields = fieldConfig?.[langKey] ?? fieldConfig?.zh ?? [];
          const targetId = fields.find(f => !inputs[f.id])?.id ?? fields[0]?.id;
          if (targetId) setInputs(prev => ({ ...prev, [targetId]: val }));
        }}
      />

      <motion.div
        key={`battle-${shakeKey}`}
        initial={shakeKey > 0 ? false : { scale: 0.9, opacity: 0 }}
        animate={shaking ? { x: [0, -6, 6, -4, 4, -2, 2, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={shaking ? { duration: 0.4, ease: 'easeOut' } : undefined}
        className={`bg-parchment w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[3px] md:border-[6px] border-ink relative ${shaking ? 'border-red-600' : ''}`}
      >
        <BattleHeader
          mission={mission}
          character={character}
          lang={lang}
          difficultyMode={difficultyMode}
          battleMode={battleMode}
          hp={hp}
          streak={streak}
          isMultiQuestion={isMultiQuestion}
          isMultiplayer={isMultiplayer}
          isDailyChallenge={isDailyChallenge}
          dailyMultiplier={dailyMultiplier}
          skillCard={skillCard}
          shieldCharges={shieldCharges}
          speedTimeLeft={speedTimeLeft}
          currentQIdx={currentQIdx}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          questionQueueLength={questionQueue.length}
          showResult={showResult}
          muted={muted}
          toggleMute={toggleMute}
          onCancel={onCancel}
        />

        <BattleContent
          mission={mission}
          currentQuestion={currentQuestion}
          character={character}
          lang={lang}
          difficultyMode={difficultyMode}
          storyText={storyText}
          descText={descText}
          interpolatedTutorialSteps={interpolatedTutorialSteps}
          isTutorial={isTutorial}
          tutorialStep={tutorialStep}
          inputs={inputs}
          setInputs={setInputs}
          wrongAnswerData={wrongAnswerData}
          partialCreditInfo={partialCreditInfo}
          skillCard={skillCard}
          currentQIdx={currentQIdx}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onTutorialPrev={() => { playClick(); setTutorialStep(prev => prev - 1); }}
          onTutorialNext={() => {
            playClick();
            if (tutorialStep < (mission.tutorialSteps?.length || 0) - 1) {
              setTutorialStep(prev => prev + 1);
            } else {
              setMode('battle'); setInputs({});
            }
          }}
          onWrongAnswerContinue={handleWrongAnswerContinue}
          mcResult={mcResult}
          mcSelectedIndex={mcSelectedIndex}
          mcCorrectIndex={mcCorrectIndex}
          onMcSelect={handleMcSelect}
        />

        <BattleEffects
          lang={lang}
          streakMilestone={streakMilestone}
          floatingScore={floatingScore}
        />

        <BugReportButton mission={currentQuestion} lang={lang} />

        <ResultOverlay
          showResult={showResult}
          victoryPhase={victoryPhase}
          mission={mission}
          character={character}
          lang={lang}
          battleMode={battleMode}
          isMultiQuestion={isMultiQuestion}
          isFirstClear={isFirstClear}
          completedDifficulties={completedDifficulties}
          difficultyMode={difficultyMode}
          finalScore={finalScore}
          finalDuration={finalDuration}
          correctCount={correctCount}
          currentQIdx={currentQIdx}
          hp={hp}
          encouragement={encouragement}
          onAchievementClose={handleAchievementClose}
          onRetry={handleRetry}
          canRetry={canRetry}
          retryCount={retryCount}
          maxRetries={MAX_RETRIES}
          onGiveUp={onCancel}
          onDiagnose={onDiagnose}
          hotTopicMultiplier={hotTopicMultiplier}
          isDailyChallenge={isDailyChallenge}
        />
      </motion.div>
    </div>
    </div>
  );
};
