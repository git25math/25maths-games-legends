import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, Trophy, MapIcon, Shield, Swords, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import type { Mission, Character, Language, Room, DifficultyMode } from '../../types';
import { translations } from '../../i18n/translations';
import { checkAnswer } from '../../utils/checkCorrectness';
import { interpolate } from '../../utils/interpolate';
import { LatexText, MathView } from '../MathView';
import { InputFields } from './InputFields';
import { VisualData } from './VisualData';
import { AnimatedTutorial } from './AnimatedTutorial';
import { useAudio } from '../../hooks/useAudio';
import { CharacterAvatar } from '../CharacterAvatar';
import { Confetti } from '../Confetti';
import { AchievementCard } from '../AchievementCard';
import { WrongAnswerPanel } from './WrongAnswerPanel';

const DIFFICULTY_MULTIPLIER: Record<DifficultyMode, number> = { green: 1, amber: 1.5, red: 2 };

export const MathBattle = ({
  mission,
  character,
  onComplete,
  onCancel,
  lang,
  difficultyMode,
  isMultiplayer = false,
  roomData = null
}: {
  mission: Mission;
  character: Character;
  onComplete: (success: boolean, score?: number, durationSecs?: number, hpRemaining?: number) => void;
  onCancel: () => void;
  lang: Language;
  difficultyMode: DifficultyMode;
  isMultiplayer?: boolean;
  roomData?: Room | null;
}) => {
  const showTutorial = difficultyMode === 'green' && mission.tutorialSteps && !isMultiplayer;
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
  const [shakeKey, setShakeKey] = useState(0);
  const shaking = shakeKey > 0;
  const achievementTimerRef = useRef<number | null>(null);
  const shakeTimerRef = useRef<number | null>(null);

  const { playBGM, stopBGM, playSuccess, playFail, playClick, muted, toggleMute } = useAudio();

  const t = translations[lang];
  const isTutorial = mode === 'tutorial' && !!mission.tutorialSteps;
  // Interpolate {param} placeholders in story/description with mission.data values
  const p = mission.data ?? {};
  const storyText = interpolate(mission.story[lang], p);
  const descText = interpolate(mission.description[lang], p);

  // Start/stop BGM on mount/unmount + cleanup achievement timer
  useEffect(() => {
    playBGM();
    return () => {
      stopBGM();
      if (achievementTimerRef.current !== null) clearTimeout(achievementTimerRef.current);
      if (shakeTimerRef.current !== null) clearTimeout(shakeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showResult === 'fail') {
      const randomEnc = t.encouragements[Math.floor(Math.random() * t.encouragements.length)];
      setEncouragement(randomEnc);
    }
  }, [showResult]);

  const handleSubmit = () => {
    playClick();
    const result = checkAnswer(mission, inputs);
    if (result.correct) {
      const duration = (Date.now() - startTime) / 1000;
      const speedBonus = Math.max(0, 100 - Math.floor(duration));
      const multiplier = DIFFICULTY_MULTIPLIER[difficultyMode];
      const score = Math.round((mission.reward + speedBonus) * multiplier);
      setFinalScore(score);
      setFinalDuration(Math.round(duration));
      setShowResult('success');
      setShowConfetti(true);
      playSuccess();
      stopBGM();
      achievementTimerRef.current = window.setTimeout(() => setShowAchievement(true), 2000);
    } else {
      playFail();
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
    setHp(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setShowResult('fail');
        stopBGM();
      }
      return next;
    });
  };

  const handleAchievementClose = () => {
    onComplete(true, finalScore, finalDuration, hp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md">
      <Confetti active={showConfetti} />

      {showAchievement && (
        <AchievementCard
          characterId={character.id}
          missionTitle={mission.title}
          score={finalScore}
          duration={finalDuration}
          hp={hp}
          difficulty={difficultyMode}
          lang={lang}
          onClose={handleAchievementClose}
        />
      )}

      <motion.div
        key={`battle-${shakeKey}`}
        initial={shakeKey > 0 ? false : { scale: 0.9, opacity: 0 }}
        animate={shaking ? { x: [0, -6, 6, -4, 4, -2, 2, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={shaking ? { duration: 0.4, ease: 'easeOut' } : undefined}
        className={`bg-[#f4e4bc] w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[12px] border-[#3d2b1f] relative ${shaking ? 'border-red-600' : ''}`}
      >
        {/* Header */}
        <div className="bg-[#3d2b1f] p-4 text-[#f4e4bc] flex justify-between items-center border-b-4 border-[#5c4033]">
          <div className="flex items-center gap-4">
            <CharacterAvatar characterId={character.id} size={56} />
            <div>
              <h2 className="text-xl font-black tracking-widest">{character.name[lang]} - {mission.title[lang]}</h2>
              <div className="flex gap-1 mt-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border border-black ${i < hp ? 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'bg-slate-800'}`} />
                ))}
                <span className="text-[10px] ml-2 font-bold text-red-400 uppercase">{t.hp}</span>
                {/* Difficulty badge */}
                <span className={`ml-4 px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  difficultyMode === 'green' ? 'bg-emerald-600' : difficultyMode === 'amber' ? 'bg-amber-600' : 'bg-rose-600'
                }`}>
                  {t.difficultyMode[difficultyMode]}
                </span>
              </div>
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
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <VisualData mission={mission} lang={lang} />

            {/* Amber mode: show formula hint */}
            {difficultyMode === 'amber' && (
              <div className="mt-4 p-3 bg-amber-100 border-2 border-amber-300 rounded-lg">
                <div className="text-amber-800 text-xs font-bold mb-1">{t.secretFormula}</div>
                <MathView tex={mission.secret.formula.replace(/\$/g, '')} className="text-lg font-black text-amber-900" />
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
            {/* Tutorial overlay for Green mode */}
            {isTutorial && mission.tutorialSteps && (
              <AnimatedTutorial
                tutorialSteps={mission.tutorialSteps}
                equationSteps={mission.data?.tutorialEquationSteps}
                characterId={character.id}
                currentStep={tutorialStep}
                lang={lang}
              />
            )}

            <InputFields
              mission={mission}
              inputs={inputs}
              setInputs={setInputs}
              difficultyMode={difficultyMode}
              tutorialStep={tutorialStep}
              isTutorial={isTutorial}
            />

            {/* Wrong answer review panel */}
            {wrongAnswerData && (
              <WrongAnswerPanel
                questionType={mission.type}
                userInputs={wrongAnswerData.userInputs}
                expected={wrongAnswerData.expected}
                formula={mission.secret.formula}
                tutorialSteps={mission.tutorialSteps}
                lang={lang}
                onContinue={handleWrongAnswerContinue}
              />
            )}

            {isTutorial ? (
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
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {tutorialStep < (mission.tutorialSteps?.length || 0) - 1 ? t.nextStep : t.tutorialStartBattle}
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!!wrongAnswerData}
                className={`w-full py-6 text-[#f4e4bc] text-2xl font-black rounded-lg transition-all flex items-center justify-center gap-4 border-2 ${wrongAnswerData ? 'bg-slate-500 border-slate-600 cursor-not-allowed' : 'bg-[#8b0000] hover:bg-[#a50000] shadow-[0_4px_0_#5c0000] active:translate-y-1 active:shadow-none border-[#5c0000]'}`}
              >
                <Swords size={28} />
                {t.attack}
              </button>
            )}

            <div className="flex justify-center gap-4 pt-2">
              {([t.cards.kill, t.cards.dodge, t.cards.peach] as string[]).map(card => (
                <div key={card} className="w-10 h-14 bg-[#3d2b1f] rounded border border-[#f4e4bc]/20 flex items-center justify-center text-[#f4e4bc] opacity-50">
                  <span className="text-[10px] font-black">{card}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result Overlay */}
        <AnimatePresence>
          {showResult !== 'none' && !showAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20 ${
                showResult === 'success' ? 'bg-[#f4e4bc]/90' : 'bg-[#3d2b1f]/90'
              }`}
            >
              {showResult === 'success' ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-full border-8 border-yellow-500 shadow-2xl">
                  <Trophy size={80} className="text-yellow-500 mb-4 mx-auto" />
                  <h3 className="text-5xl font-black text-slate-900 mb-2">{t.successTitle}</h3>
                  <p className="text-slate-600 font-bold">{t.successDesc}</p>
                </motion.div>
              ) : (
                <motion.div initial={{ y: 50 }} animate={{ y: 0 }}>
                  <XCircle size={80} className="text-red-500 mb-6 mx-auto" />
                  <h3 className="text-5xl font-black text-white mb-4">{t.failTitle}</h3>
                  <p className="text-slate-400 mb-2">{t.failDesc}</p>
                  <p className="text-indigo-400 font-bold mb-8 italic">"{encouragement}"</p>
                  <button
                    onClick={() => { setHp(4); setShowResult('none'); setInputs({}); playBGM(); }}
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
  );
};
