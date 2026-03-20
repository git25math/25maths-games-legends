import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, Trophy, MapIcon, Shield, Swords, ChevronRight, ChevronLeft, Volume2, VolumeX, Flame, Heart, Zap, Eye } from 'lucide-react';
import type { Mission, Character, Language, Room, DifficultyMode } from '../../types';
import { translations } from '../../i18n/translations';
import { lt } from '../../i18n/resolveText';
import { checkAnswer, checkPartialCredit } from '../../utils/checkCorrectness';
import { interpolate } from '../../utils/interpolate';
import { tapScale, hoverGlow, buttonBase, VICTORY_TIMING, BATTLE_TIMING } from '../../utils/animationPresets';
import { LatexText, MathView } from '../MathView';
import { InputFields } from './InputFields';
import { VisualData } from './VisualData';
import { AnimatedTutorial } from './AnimatedTutorial';
import { useAudio } from '../../audio';
import { CharacterAvatar } from '../CharacterAvatar';
import { Confetti } from '../Confetti';
import { AchievementCard } from '../AchievementCard';
import { AnimatedCounter } from '../AnimatedCounter';
import { SkillBadgeCard } from '../SkillBadgeCard';
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
  skillCard = null,
  isFirstClear = false,
  completedDifficulties = {},
  isDailyChallenge = false,
  dailyMultiplier = 1,
  onStreakToken,
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
  onStreakToken?: () => void;
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
  const [victoryPhase, setVictoryPhase] = useState<0|1|2|3|4|5>(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiTheme, setConfettiTheme] = useState<'default' | 'goldWhite'>('default');
  const [finalScore, setFinalScore] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [shieldCharges, setShieldCharges] = useState(skillCard === 'shield' ? 2 : 0);
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);
  const [partialCreditInfo, setPartialCreditInfo] = useState<{ score: number } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const shaking = shakeKey > 0;
  const achievementTimerRef = useRef<number | null>(null);
  const shakeTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const milestoneTimerRef = useRef<number | null>(null);
  const floatingKeyRef = useRef(0);

  const {
    playBGM, stopBGM, playClick, muted, toggleMute,
    playCorrect, playWrong, playVictory, playDefeat,
    playStreak, playStreakBreak, playHpLoss,
    playShieldBlock, playBattleEnter, playPartialCredit,
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
      if (milestoneTimerRef.current !== null) clearTimeout(milestoneTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showResult === 'fail') {
      const randomEnc = t.encouragements[Math.floor(Math.random() * t.encouragements.length)];
      setEncouragement(randomEnc);
    }
  }, [showResult]);

  const triggerVictorySequence = () => {
    setShowResult('success');
    
    // Phase A: Dim screen transition & Shockwave/Confetti
    setVictoryPhase(0); // Ensure dimming is visible first
    window.setTimeout(() => stopBGM(), VICTORY_TIMING.dimScreen - 50);
    window.setTimeout(() => {
      playVictory();
      setConfettiTheme('default');
      setConfettiTrigger(prev => prev + 1);
      setVictoryPhase(1); // Shockwave starts after dimming and audio setup
    }, VICTORY_TIMING.dimScreen);

    // Phase B: Badge drop
    achievementTimerRef.current = window.setTimeout(() => {
      setVictoryPhase(2);
    }, VICTORY_TIMING.badgeDrop);

    // Phase C: Stats show
    advanceTimerRef.current = window.setTimeout(() => setVictoryPhase(3), VICTORY_TIMING.statsReveal);

    // Phase D: Skill Badge or skip to E
    shakeTimerRef.current = window.setTimeout(() => {
      if (mission.skillName) {
        setVictoryPhase(4);
        setConfettiTheme('goldWhite');
        setConfettiTrigger(prev => prev + 1);
        // Return button appears after badge animation
        window.setTimeout(() => setVictoryPhase(5), VICTORY_TIMING.returnButton - VICTORY_TIMING.skillBadge); // Relative timing
      } else if (isFirstClear) {
        setConfettiTheme('goldWhite');
        setConfettiTrigger(prev => prev + 1);
        setVictoryPhase(5); // Skip SkillBadge phase, go straight to return button
      } else {
        setVictoryPhase(5); // No skill, no first clear, just show return button
      }
    }, VICTORY_TIMING.skillBadge);
  };

  const handleSubmit = () => {
    playClick();
    const rawResult = checkAnswer(currentQuestion, inputs);
    const result = checkPartialCredit(currentQuestion, inputs, rawResult);

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
        const score = Math.round(currentQuestion.reward * streakMult * diffMult * doubleMult * dailyMultiplier);

        setStreak(newStreak);
        setPeakStreak(prev => Math.max(prev, newStreak));
        setCorrectCount(prev => prev + 1);
        const newTotal = totalScore + score;
        setTotalScore(newTotal);

        // Streak milestone flash (3/5/8)
        if ([3, 5, 8].includes(newStreak)) {
          setStreakMilestone(newStreak);
          if (milestoneTimerRef.current !== null) clearTimeout(milestoneTimerRef.current);
          milestoneTimerRef.current = window.setTimeout(() => setStreakMilestone(null), 800);
          // Award streak token at streak 5
          if (newStreak === 5 && onStreakToken) onStreakToken();
        }

        // Floating score
        const multLabel = doubleMult > 1 ? `x${streakMult * doubleMult}` : streakMult > 1 ? `x${streakMult}` : '';
        const label = multLabel ? `+${score} (${multLabel})` : `+${score}`;
        floatingKeyRef.current += 1;
        setFloatingScore({ value: label, key: floatingKeyRef.current });

        // Check if this was the last question
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(newTotal);
          advanceTimerRef.current = window.setTimeout(() => {
            triggerVictorySequence();
          }, BATTLE_TIMING.advance);
        } else {
          advanceTimerRef.current = window.setTimeout(() => {
            setInputs({});
            setWrongAnswerData(null);
            setPartialCreditInfo(null);
            setCurrentQIdx(prev => prev + 1);
          }, BATTLE_TIMING.advance);
        }
      } else {
        // Single-question: victory replaces correct (avoid overlap)
        const duration = (Date.now() - startTime) / 1000;
        const speedBonus = Math.max(0, 100 - Math.floor(duration));
        const multiplier = DIFFICULTY_MULTIPLIER[difficultyMode];
        const score = Math.round((mission.reward + speedBonus) * multiplier * dailyMultiplier);
        setFinalScore(score);
        setFinalDuration(Math.round(duration));
        triggerVictorySequence();
      }
    } else if (result.partial) {
      // Partial credit: 50% score, no HP loss, no streak break
      playPartialCredit();
      if (isMultiQuestion) {
        const diffMult = DIFFICULTY_MULTIPLIER[difficultyMode];
        const partialScore = Math.round(currentQuestion.reward * 0.5 * diffMult * dailyMultiplier);
        const newTotal = totalScore + partialScore;
        setTotalScore(newTotal);
        // Don't break streak, don't increment correctCount (partial ≠ correct)

        floatingKeyRef.current += 1;
        setFloatingScore({ value: `+${partialScore} (50%)`, key: floatingKeyRef.current });
        setPartialCreditInfo({ score: partialScore });

        // Show partial wrong answer panel then advance
        setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
      } else {
        // Single question partial: show encouraging review panel, let them retry
        // No score awarded — score only on full correct
        setPartialCreditInfo({ score: 0 });
        setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
      }
    } else {
      playWrong();
      setPartialCreditInfo(null);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      setShakeKey(k => k + 1);
      shakeTimerRef.current = window.setTimeout(() => setShakeKey(0), BATTLE_TIMING.shake);
      // Show wrong answer panel with solution before deducting HP
      setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
    }
  };

  const handleWrongAnswerContinue = () => {
    const wasPartial = !!partialCreditInfo;
    setWrongAnswerData(null);
    setInputs({});
    setPartialCreditInfo(null);

    // Partial credit: no HP loss, no streak break — just advance
    if (wasPartial) {
      if (isMultiQuestion) {
        if (currentQIdx + 1 >= questionQueue.length) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => triggerVictorySequence(), BATTLE_TIMING.advance);
        } else {
          setCurrentQIdx(prev => prev + 1);
        }
      }
      // Single question partial: just close the panel, let them retry
      return;
    }

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
            triggerVictorySequence();
          }, BATTLE_TIMING.shieldVictory);
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
        // defeat sound plays after hpLoss fades
        setShowResult('fail');
        stopBGM();
        advanceTimerRef.current = window.setTimeout(() => playDefeat(), BATTLE_TIMING.defeatSound);
      }

      // Still alive — advance to next question
      if (nextHp > 0) {
        if (currentQIdx + 1 >= questionQueue.length) {
          // Was last question, show success (they survived)
          const duration = Math.round((Date.now() - startTime) / 1000);
          setFinalDuration(duration);
          setFinalScore(totalScore);
          advanceTimerRef.current = window.setTimeout(() => {
            stopBGM();
            triggerVictorySequence();
          }, BATTLE_TIMING.shieldVictory);
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
        advanceTimerRef.current = window.setTimeout(() => playDefeat(), BATTLE_TIMING.defeatSound);
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
    setPartialCreditInfo(null);
    setStreakMilestone(null);
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
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-[#050508]/90 backdrop-blur-xl flex items-center justify-center">
      <Confetti trigger={confettiTrigger} />
      
      {/* Global Terminal Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <CalculatorWidget
        lang={lang}
        onUseResult={(val) => setInputs(prev => {
          const fields = Object.keys(prev);
          const emptyField = fields.find(f => !prev[f]) || fields[0];
          if (emptyField) return { ...prev, [emptyField]: val };
          return prev;
        })}
      />

      <motion.div
        key={`battle-${shakeKey}`}
        initial={shakeKey > 0 ? false : { scale: 0.95, opacity: 0 }}
        animate={shaking ? { x: [0, -4, 4, -3, 3, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-slate-950/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        {/* Tactical Corner Brackets */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-indigo-500/40 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-indigo-500/40 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-indigo-500/40 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-indigo-500/40 rounded-br-2xl pointer-events-none" />

        {/* Header: Tactical Uplink Status */}
        <div className="bg-white/[0.02] p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <CharacterAvatar characterId={character.id} size={64} className="border-2 border-indigo-500/30 rounded-xl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-white tracking-[0.15em] uppercase font-mono">{lt(character.name, lang)}</h2>
                <div className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] font-mono text-indigo-400 tracking-tighter uppercase">
                  Node_ID: {activeMission.id.toString().padStart(3, '0')}
                </div>
              </div>

              {/* Integrity Bar (HP) */}
              <div className="flex items-center gap-3">
                <div className="w-32 md:w-48 h-2 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                  <motion.div 
                    initial={false}
                    animate={{ width: `${(hp / 4) * 100}%` }}
                    className={`h-full rounded-full ${
                      hp <= 1 ? 'bg-orange-500' : 'bg-indigo-500'
                    } shadow-[0_0_10px_currentColor]`}
                  />
                </div>
                <span className={`font-mono text-[10px] font-bold ${hp <= 1 ? 'text-orange-500 animate-pulse' : 'text-white/40'}`}>
                  SYS_INTEGRITY: {Math.round((hp / 4) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats Readout */}
            <div className="hidden md:flex flex-col items-end font-mono text-[10px] space-y-0.5">
              <div className="flex gap-2">
                <span className="text-white/20 uppercase tracking-widest">Score //</span>
                <span className="text-white font-bold">{totalScore.toLocaleString().padStart(6, '0')}</span>
              </div>
              <div className="flex gap-2 text-indigo-400/60">
                <span className="uppercase tracking-widest">Uplink //</span>
                <span className="font-bold">ESTABLISHED</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10 mx-2" />

            <button onClick={toggleMute} className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
              {muted ? <VolumeX size={20} className="text-white/30" /> : <Volume2 size={20} className="text-white/70" />}
            </button>
            <button onClick={onCancel} className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 group">
              <XCircle size={24} className="text-white/20 group-hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* Battle Content */}
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          
          {/* Left Side: Tactical Question & Stream */}
          <div className="space-y-8">
            {/* Question Display */}
            <div className="relative group">
              <div className="absolute -top-3 left-3 px-2 bg-[#0a0a10] text-[9px] font-mono text-indigo-400 uppercase tracking-widest z-10">
                Incoming_Data_Stream
              </div>
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-8 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]">
                <MathView 
                  content={currentQuestion.question} 
                  className="text-2xl md:text-3xl text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                />
              </div>
            </div>

            {/* Parameter Input Fields */}
            <div className="space-y-4">
              {currentQuestion.inputs.map((input, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="font-mono text-[10px] text-white/20 group-focus-within:text-indigo-400 transition-colors uppercase">Param_{idx + 1}</span>
                    <div className="w-[1px] h-3 bg-white/10" />
                  </div>
                  <input
                    type="text"
                    value={inputs[input.name] || ''}
                    onChange={(e) => setInputs({ ...inputs, [input.name]: e.target.value })}
                    placeholder={lt(input.label, lang)}
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-indigo-500/50 focus:bg-indigo-500/5 rounded-xl px-4 py-4 pl-24 text-white font-mono placeholder:text-white/10 outline-none transition-all"
                  />
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={Object.keys(inputs).length === 0}
                className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.4em] transition-all relative overflow-hidden group ${
                  Object.keys(inputs).length === 0 
                    ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)]'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Swords size={18} />
                  EXECUTE_UPLINK
                </div>
                {/* Tactical Glitch Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Right Side: Environmental Feedback */}
          <div className="flex flex-col gap-6">
            {/* Strategic Map / Visualizer Mockup */}
            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-3 left-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">Environment_Visualizer</div>
              
              {/* Radar Grid Animation Placeholder */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-500 rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-500/40 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-indigo-500/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-indigo-500/20" />
              </div>

              <div className="relative z-10 text-center space-y-4">
                <div className="text-sm font-mono text-indigo-400 animate-pulse tracking-widest uppercase">Targeting_Active</div>
                <div className="flex justify-center">
                  <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    <Crosshair size={40} className="text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Feedback Terminal */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5 font-mono text-[11px] space-y-3">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/30 uppercase tracking-widest">Telemetry_Stream</span>
                <span className="text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]">● ONLINE</span>
              </div>
              
              {isMultiQuestion && streak >= 2 && (
                <div className="flex justify-between items-center text-orange-400">
                  <span className="uppercase">Streak_Multiplier:</span>
                  <span className="font-bold text-sm">x{getStreakMultiplier(streak)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-white/40 uppercase">Queue_Progress:</span>
                <span className="text-white/80 font-bold">{currentQIdx + 1} / {questionQueue.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/40 uppercase">Time_Elapsed:</span>
                <span className="text-white/80 font-bold">{Math.floor((Date.now() - startTime) / 1000)}S</span>
              </div>

              {/* Progress Dots */}
              <div className="flex gap-1.5 pt-2">
                {questionQueue.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 rounded-sm transition-all duration-500 ${
                      i < currentQIdx ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 
                      i === currentQIdx ? 'bg-white/40 animate-pulse' : 'bg-white/5'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
          {/* Left: Tactical Map */}
          <div className="bg-parchment-dark rounded-lg p-6 border-2 border-ink/20 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-ink font-bold border-b border-ink/10 pb-2">
              <MapIcon size={18} />
              <span>{t.calculating}</span>
            </div>

            <div className="bg-white/40 p-3 rounded-lg mb-4 italic text-xs text-ink-light border-l-4 border-[#8b0000]">
              <LatexText text={storyText} />
            </div>

            <div className="text-ink-light text-sm font-bold mb-6 leading-relaxed">
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

            <div className="mt-8 pt-4 border-t border-ink/10">
              <div className="flex items-center gap-2 text-ink-light text-xs font-bold">
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

            {/* Wrong answer review panel (with partial credit variant) */}
            {wrongAnswerData && (
              <WrongAnswerPanel
                questionType={currentQuestion.type}
                userInputs={wrongAnswerData.userInputs}
                expected={wrongAnswerData.expected}
                formula={currentQuestion.secret.formula}
                tutorialSteps={interpolatedTutorialSteps}
                lang={lang}
                onContinue={handleWrongAnswerContinue}
                storyText={!partialCreditInfo && mission.storyConsequence ? lt(mission.storyConsequence.wrong, lang) : undefined}
                isPartial={!!partialCreditInfo}
                partialScore={partialCreditInfo?.score}
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
              <motion.button
                {...(wrongAnswerData ? {} : { ...tapScale, ...hoverGlow })}
                onClick={handleSubmit}
                disabled={!!wrongAnswerData}
                className={`w-full py-4 md:py-6 text-[#f4e4bc] text-lg md:text-2xl font-black rounded-lg transition-shadow flex items-center justify-center gap-4 border-2 min-h-12 ${wrongAnswerData ? 'bg-slate-500 border-slate-600 cursor-not-allowed' : 'bg-[#8b0000] shadow-[0_4px_0_#5c0000] border-[#5c0000]'}`}
              >
                <Swords size={28} />
                {t.attack}
              </motion.button>
            )}

          </div>
        </div>

        {/* Streak Milestone Golden Flash */}
        <AnimatePresence>
          {streakMilestone && (
            <motion.div
              key={`milestone-${streakMilestone}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-b from-yellow-400/30 via-yellow-500/10 to-transparent pointer-events-none z-[25]"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {streakMilestone && (
            <motion.div
              key={`milestone-text-${streakMilestone}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 text-center"
            >
              <div className="text-5xl font-black text-yellow-400 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(250,204,21,0.5)' }}>
                {streakMilestone} {t.streakLabel}!
              </div>
              {streakMilestone === 5 && (
                <div className="text-lg font-black text-amber-300 mt-1">{t.streakToken} +1</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
          {showResult !== 'none' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 z-[100] overflow-hidden bg-slate-950/90 backdrop-blur-2xl"
            >
              {showResult === 'success' ? (
                <div className="w-full max-w-2xl space-y-8">
                  {/* Phase A: Mission Accomplished Banner */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="relative"
                  >
                    <div className="absolute -top-6 left-0 font-mono text-[10px] text-emerald-500/60 tracking-[0.3em]">OPERATION_STATUS: SUCCESSFUL</div>
                    <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
                      MISSION <span className="text-emerald-500">ACCOMPLISHED</span>
                    </h3>
                    <div className="h-1 w-full bg-emerald-500 mt-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  </motion.div>

                  {/* Phase B: Data Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'TOTAL_SCORE', value: finalScore, unit: 'PTS', icon: <Trophy size={14} />, delay: 0.2 },
                      { label: 'OP_DURATION', value: finalDuration, unit: 'SEC', icon: <span className="text-xs">⏱</span>, delay: 0.4 },
                      { label: 'SYS_INTEGRITY', value: Math.round((hp / 4) * 100), unit: '%', icon: <Heart size={14} />, delay: 0.6 },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: stat.delay }}
                        className="bg-white/[0.03] border border-white/10 p-4 rounded-xl flex flex-col gap-1 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 -rotate-45 translate-x-4 -translate-y-4" />
                        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                          {stat.icon} {stat.label}
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                          {typeof stat.value === 'number' && i === 0 ? (
                            <AnimatedCounter value={stat.value} />
                          ) : (
                            stat.value
                          )}
                          <span className="text-[10px] ml-1 text-white/30">{stat.unit}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Phase C: Performance Rating */}
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-emerald-500/80 uppercase tracking-[0.2em]">Deployment_Rating</div>
                      <div className="text-3xl font-black text-white uppercase tracking-widest">Grade_A_Optimal</div>
                    </div>
                    <div className="text-6xl font-black text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] font-mono">
                      S+
                    </div>
                  </motion.div>

                  {/* Return Action */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-center pt-4"
                  >
                    <button
                      onClick={() => onComplete(true, isMultiQuestion ? totalScore : finalScore, finalDuration, hp)}
                      className="group relative px-12 py-4 bg-white text-black font-black text-sm uppercase tracking-[0.5em] rounded-full overflow-hidden hover:scale-105 transition-transform"
                    >
                      <span className="relative z-10">CONTINUE_TO_COMMAND</span>
                      <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform" />
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="w-full max-w-xl text-center space-y-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="text-red-500 font-mono text-sm tracking-[0.4em] uppercase">CRITICAL_SYSTEM_FAILURE</div>
                    <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                      LINK <span className="text-red-600">TERMINATED</span>
                    </h3>
                  </motion.div>

                  <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl font-mono text-sm text-red-400/80 leading-relaxed italic">
                    "{lt(mission.storyConsequence?.wrong || encouragement, lang)}"
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleRetry}
                      className="w-full py-5 bg-red-600 text-white font-black text-xs uppercase tracking-[0.5em] rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all"
                    >
                      REBOOT_UPLINK
                    </button>
                    <button
                      onClick={onCancel}
                      className="w-full py-4 bg-white/5 text-white/40 font-black text-xs uppercase tracking-[0.5em] rounded-xl hover:bg-white/10 transition-all border border-white/10"
                    >
                      ABORT_MISSION
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </div>
  );
};
