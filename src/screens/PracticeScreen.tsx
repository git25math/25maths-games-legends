import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, BookOpen, ChevronRight, ChevronLeft, Swords, MapIcon, CheckCircle2 } from 'lucide-react';
import type { Mission, Character, Language, DifficultyMode } from '../types';
import { translations } from '../i18n/translations';
import { generateMission } from '../utils/generateMission';
import { checkAnswer } from '../utils/checkCorrectness';
import { interpolate } from '../utils/interpolate';
import { LatexText, MathView } from '../components/MathView';
import { InputFields } from '../components/MathBattle/InputFields';
import { VisualData } from '../components/MathBattle/VisualData';
import { AnimatedTutorial } from '../components/MathBattle/AnimatedTutorial';
import { WrongAnswerPanel } from '../components/MathBattle/WrongAnswerPanel';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { SkillBadgeCard } from '../components/SkillBadgeCard';
import { useAudio } from '../hooks/useAudio';

type PracticePhase = 'green' | 'amber' | 'red';

const PHASE_ORDER: PracticePhase[] = ['green', 'amber', 'red'];

export const PracticeScreen = ({
  mission,
  character,
  lang,
  onComplete,
  onCancel,
}: {
  mission: Mission;
  character: Character;
  lang: Language;
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const t = translations[lang];

  const [currentPhase, setCurrentPhase] = useState<PracticePhase>('green');
  const [currentMission, setCurrentMission] = useState<Mission>(() => {
    const gen = generateMission(mission);
    console.log('[PracticeScreen] init:', { origA: mission.data?.a, genA: gen.data?.a, genResult: gen.data?.result, genType: mission.data?.generatorType });
    return gen;
  });
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [wrongAnswerData, setWrongAnswerData] = useState<{
    userInputs: Record<string, string>;
    expected: Record<string, string>;
  } | null>(null);
  const [showCorrectFlash, setShowCorrectFlash] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialForGreen, setShowTutorialForGreen] = useState(true);
  const [shakeKey, setShakeKey] = useState(0);
  const shaking = shakeKey > 0;
  const [showBadge, setShowBadge] = useState(false);

  const { playSuccess, playFail, playClick } = useAudio();

  const phaseIndex = PHASE_ORDER.indexOf(currentPhase);
  const hasTutorial = currentPhase === 'green' && showTutorialForGreen && !!currentMission.tutorialSteps;

  // Interpolated texts
  const p = currentMission.data ?? {};
  const storyText = interpolate(currentMission.story[lang], p);
  const descText = interpolate(currentMission.description[lang], p);

  const regenerateQuestion = useCallback(() => {
    const gen = generateMission(mission);
    console.log('[PracticeScreen] regen:', { a: gen.data?.a, result: gen.data?.result, x: gen.data?.x });
    setCurrentMission(gen);
    setInputs({});
    setWrongAnswerData(null);
    setTutorialStep(0);
  }, [mission]);

  const handleSubmit = () => {
    playClick();
    const result = checkAnswer(currentMission, inputs);
    if (result.correct) {
      playSuccess();
      setShowCorrectFlash(true);
      setTimeout(() => {
        setShowCorrectFlash(false);
        // After first green question, stop showing tutorial for subsequent ones
        setShowTutorialForGreen(false);
        regenerateQuestion();
      }, 800);
    } else {
      playFail();
      setShakeKey(k => k + 1);
      setTimeout(() => setShakeKey(0), 500);
      setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
    }
  };

  const handleWrongAnswerContinue = () => {
    setWrongAnswerData(null);
    setInputs({});
    // No HP deduction, no penalty — just clear and stay
  };

  const handlePhaseForward = () => {
    if (currentPhase === 'red') {
      // Show skill badge if mission has skillName, otherwise just complete
      if (mission.skillName) {
        setShowBadge(true);
      } else {
        onComplete();
      }
      return;
    }
    const nextPhase = PHASE_ORDER[phaseIndex + 1];
    setCurrentPhase(nextPhase);
    setShowTutorialForGreen(true);
    regenerateQuestion();
  };

  const handlePhaseBack = () => {
    if (phaseIndex === 0) return;
    const prevPhase = PHASE_ORDER[phaseIndex - 1];
    setCurrentPhase(prevPhase);
    setShowTutorialForGreen(false); // Don't replay tutorial when going back
    regenerateQuestion();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md">
      {/* Skill badge overlay */}
      {showBadge && mission.skillName && mission.skillSummary && (
        <SkillBadgeCard
          characterId={character.id}
          skillName={mission.skillName}
          skillSummary={mission.skillSummary}
          formula={mission.secret.formula}
          missionTitle={mission.title}
          lang={lang}
          onClose={onComplete}
        />
      )}

      {/* Correct answer flash overlay */}
      <AnimatePresence>
        {showCorrectFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-500 rounded-2xl shadow-2xl"
            >
              <CheckCircle2 size={32} className="text-white" />
              <span className="text-white text-2xl font-black">
                {lang === 'zh' ? '正确！' : 'Correct!'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={`practice-${shakeKey}`}
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
              <h2 className="text-base md:text-xl font-black tracking-widest flex items-center gap-2">
                <BookOpen size={18} />
                {mission.title[lang]}
              </h2>
              {/* Phase indicator */}
              <div className="flex items-center gap-2 mt-1">
                {PHASE_ORDER.map((phase, i) => {
                  const isCurrent = phase === currentPhase;
                  const isCompleted = i < phaseIndex;
                  const colors: Record<PracticePhase, string> = {
                    green: 'bg-emerald-500',
                    amber: 'bg-amber-500',
                    red: 'bg-rose-500',
                  };
                  const dimColors: Record<PracticePhase, string> = {
                    green: 'bg-emerald-900',
                    amber: 'bg-amber-900',
                    red: 'bg-rose-900',
                  };
                  return (
                    <div key={phase} className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 rounded-full border border-black transition-all ${
                          isCurrent || isCompleted ? colors[phase] : dimColors[phase]
                        } ${isCurrent ? 'ring-2 ring-white/50 animate-pulse' : ''}`}
                      />
                      <span className={`text-[9px] font-bold uppercase ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                        {t.practicePhase[phase]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-600/30 rounded-full text-xs font-bold">
              {t.practice}
            </span>
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-xs font-bold min-h-10"
            >
              <ChevronLeft size={16} />
              {lang === 'zh' ? '返回' : 'Back'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Question area */}
          <div className="bg-[#e8d5a7] rounded-lg p-6 border-2 border-[#3d2b1f]/20 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-[#3d2b1f] font-bold border-b border-[#3d2b1f]/10 pb-2">
              <MapIcon size={18} />
              <span>{t.practicePhase[currentPhase]}</span>
            </div>

            {/* Story text */}
            <div className="bg-white/40 p-3 rounded-lg mb-4 italic text-xs text-[#5c4033] border-l-4 border-[#8b0000]">
              <LatexText text={storyText} />
            </div>

            {/* Description text */}
            <div className="text-[#5c4033] text-sm font-bold mb-6 leading-relaxed">
              <LatexText text={descText} />
            </div>

            {/* Visual diagram */}
            <VisualData mission={currentMission} lang={lang} />

            {/* Green phase: show formula too (after tutorial) */}
            {currentPhase === 'green' && !hasTutorial && (
              <div className="mt-4 p-3 bg-emerald-100 border-2 border-emerald-300 rounded-lg">
                <div className="text-emerald-800 text-xs font-bold mb-1">{t.secretFormula}</div>
                <MathView tex={currentMission.secret.formula.replace(/\$/g, '')} className="text-lg font-black text-emerald-900" />
              </div>
            )}

            {/* Amber phase: always show formula hint */}
            {currentPhase === 'amber' && (
              <div className="mt-4 p-3 bg-amber-100 border-2 border-amber-300 rounded-lg">
                <div className="text-amber-800 text-xs font-bold mb-1">{t.secretFormula}</div>
                <MathView tex={currentMission.secret.formula.replace(/\$/g, '')} className="text-lg font-black text-amber-900" />
              </div>
            )}

            {/* Red phase: no hints */}
          </div>

          {/* Right: Inputs and controls */}
          <div className="space-y-6">
            {/* Tutorial overlay for Green mode (first question only) */}
            {hasTutorial && currentMission.tutorialSteps && (
              <AnimatedTutorial
                tutorialSteps={currentMission.tutorialSteps}
                equationSteps={currentMission.data?.tutorialEquationSteps}
                characterId={character.id}
                currentStep={tutorialStep}
                lang={lang}
              />
            )}

            <InputFields
              mission={currentMission}
              inputs={inputs}
              setInputs={setInputs}
              difficultyMode={currentPhase as DifficultyMode}
              tutorialStep={tutorialStep}
              isTutorial={hasTutorial}
            />

            {/* Wrong answer review panel */}
            {wrongAnswerData && (
              <WrongAnswerPanel
                questionType={currentMission.type}
                userInputs={wrongAnswerData.userInputs}
                expected={wrongAnswerData.expected}
                formula={currentMission.secret.formula}
                tutorialSteps={currentMission.tutorialSteps}
                lang={lang}
                onContinue={handleWrongAnswerContinue}
              />
            )}

            {/* Action buttons */}
            {hasTutorial ? (
              <button
                onClick={() => {
                  playClick();
                  if (tutorialStep < (currentMission.tutorialSteps?.length || 0) - 1) {
                    setTutorialStep(prev => prev + 1);
                  } else {
                    // Tutorial complete — switch to battle mode for this question
                    setShowTutorialForGreen(false);
                    setInputs({});
                  }
                }}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 min-h-12"
              >
                {tutorialStep < (currentMission.tutorialSteps?.length || 0) - 1 ? t.nextStep : t.tutorialStartBattle}
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!!wrongAnswerData || showCorrectFlash}
                className={`w-full py-5 text-[#f4e4bc] text-xl font-black rounded-lg transition-all flex items-center justify-center gap-3 border-2 min-h-12 ${
                  wrongAnswerData || showCorrectFlash
                    ? 'bg-slate-500 border-slate-600 cursor-not-allowed'
                    : 'bg-[#8b0000] hover:bg-[#a50000] shadow-[0_4px_0_#5c0000] active:translate-y-1 active:shadow-none border-[#5c0000]'
                }`}
              >
                <Swords size={24} />
                {t.attack}
              </button>
            )}

            {/* Phase navigation */}
            <div className="flex gap-3">
              {phaseIndex > 0 && (
                <button
                  onClick={handlePhaseBack}
                  className="flex-1 py-3 bg-white/50 border-2 border-[#3d2b1f]/20 text-[#3d2b1f] font-bold rounded-lg hover:bg-white/70 transition-all flex items-center justify-center gap-2 text-sm min-h-12"
                >
                  <ChevronLeft size={16} />
                  {t.goBack}
                </button>
              )}
              <button
                onClick={handlePhaseForward}
                className={`flex-1 py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm border-2 min-h-12 ${
                  currentPhase === 'red'
                    ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-500'
                    : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                }`}
              >
                {currentPhase === 'red' ? t.enterChallenge : t.readyForNext}
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Back to map */}
            <button
              onClick={onCancel}
              className="w-full py-2 text-[#3d2b1f]/50 hover:text-[#3d2b1f] text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeft size={14} />
              {lang === 'zh' ? '返回地图' : 'Back to Map'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
