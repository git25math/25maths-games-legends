import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, BookOpen, ChevronRight, ChevronLeft, Swords, MapIcon, CheckCircle2 } from 'lucide-react';
import type { Mission, Character, Language, DifficultyMode } from '../types';
import { translations } from '../i18n/translations';
import { lt, resolveFormula } from '../i18n/resolveText';
import { generateMission, type DifficultyTier } from '../utils/generateMission';
import { checkAnswer } from '../utils/checkCorrectness';
import { interpolate } from '../utils/interpolate';
import { LatexText, MathView } from '../components/MathView';
import { InputFields } from '../components/MathBattle/InputFields';
import { INPUT_FIELDS } from '../components/MathBattle/inputConfig';
import { VisualData } from '../components/MathBattle/VisualData';
import { AnimatedTutorial } from '../components/MathBattle/AnimatedTutorial';
import { WrongAnswerPanel } from '../components/MathBattle/WrongAnswerPanel';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { SkillBadgeCard } from '../components/SkillBadgeCard';
import { CalculatorWidget } from '../components/Calculator';
import { renderDiagram } from '../utils/renderDiagram';
import { useAudio } from '../audio';
import { buttonBase, DURATION } from '../utils/animationPresets';
import { usePracticePersistedState } from '../hooks/usePracticeState';

type PracticePhase = 'green' | 'amber' | 'red';

const PHASE_ORDER: PracticePhase[] = ['green', 'amber', 'red'];

export const PracticeScreen = ({
  mission,
  character,
  lang,
  onComplete,
  onCancel,
  onEnterBattle,
  repairMode = false,
  onRepairComplete,
}: {
  mission: Mission;
  character: Character;
  lang: Language;
  onComplete: () => void;
  onCancel: () => void;
  onEnterBattle?: () => void;
  repairMode?: boolean;
  onRepairComplete?: () => void;
}) => {
  const t = translations[lang];

  // Persisted practice state (survives page refresh)
  // Repair mode: force Red phase, ignore persistence
  const {
    phase: persistedPhase, setPhase: setCurrentPhase,
    tutorialStep, setTutorialStep,
    adaptiveTier, setAdaptiveTier,
    consecutiveCorrect, setConsecutiveCorrect,
    consecutiveWrong, setConsecutiveWrong,
  } = usePracticePersistedState(mission.id);

  const currentPhase = repairMode ? 'red' as const : persistedPhase;

  const [currentMission, setCurrentMission] = useState<Mission>(() => generateMission(mission, adaptiveTier));
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [wrongAnswerData, setWrongAnswerData] = useState<{
    userInputs: Record<string, string>;
    expected: Record<string, string>;
  } | null>(null);
  const [showCorrectFlash, setShowCorrectFlash] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const shaking = shakeKey > 0;
  const [showBadge, setShowBadge] = useState(false);
  const [phaseToast, setPhaseToast] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // v7.0: Repair mode — count correct answers, complete after 3
  const [repairCorrect, setRepairCorrect] = useState(0);
  const REPAIR_TARGET = 3;

  const {
    playSuccess, playFail, playClick,
    playTierUp, playTierDown, playPhaseAdvance, playBadgeUnlock,
  } = useAudio();

  const phaseIndex = PHASE_ORDER.indexOf(currentPhase);

  // Interpolated texts
  const p = currentMission.data ?? {};
  const storyText = interpolate(lt(currentMission.story, lang), p);
  const descText = interpolate(lt(currentMission.description, lang), p);

  // Interpolate tutorialSteps with mission data (same as story/description)
  const interpolatedTutorialSteps = currentMission.tutorialSteps?.map(step => ({
    ...step,
    text: { zh: interpolate(step.text.zh, p), en: interpolate(step.text.en, p) },
    ...(step.hint ? { hint: { zh: interpolate(step.hint.zh, p), en: interpolate(step.hint.en, p) } } : {}),
  }));

  const regenerateQuestion = useCallback(() => {
    setCurrentMission(generateMission(mission, adaptiveTier));
    setInputs({});
    setWrongAnswerData(null);
    setTutorialStep(0);
  }, [mission, adaptiveTier]);

  const handleSubmit = () => {
    playClick();
    const result = checkAnswer(currentMission, inputs);
    if (result.correct) {
      playSuccess();
      setShowCorrectFlash(true);
      // Adaptive: track consecutive correct, level up after 3
      const newCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newCorrect);
      setConsecutiveWrong(0);
      if (newCorrect >= 3 && adaptiveTier < 3 && currentPhase !== 'green') {
        playTierUp();
        setAdaptiveTier(prev => Math.min(3, prev + 1) as DifficultyTier);
        setConsecutiveCorrect(0);
        setPhaseToast((t as any).difficultyUp ?? 'Difficulty up!');
        setTimeout(() => setPhaseToast(null), 2000);
      }
      setTimeout(() => {
        setShowCorrectFlash(false);
        // v7.0: Repair mode — complete after 3 correct
        if (repairMode) {
          const newRepair = repairCorrect + 1;
          setRepairCorrect(newRepair);
          if (newRepair >= REPAIR_TARGET) {
            if (onRepairComplete) onRepairComplete();
            return;
          }
        }
        regenerateQuestion();
      }, DURATION.entrance * 1000);
    } else {
      playFail();
      setShakeKey(k => k + 1);
      setTimeout(() => setShakeKey(0), DURATION.slow * 1000);
      // Adaptive: track consecutive wrong, level down after 2
      const newWrong = consecutiveWrong + 1;
      setConsecutiveWrong(newWrong);
      setConsecutiveCorrect(0);
      if (newWrong >= 2 && adaptiveTier > 1 && currentPhase !== 'green') {
        playTierDown();
        setAdaptiveTier(prev => Math.max(1, prev - 1) as DifficultyTier);
        setConsecutiveWrong(0);
        setPhaseToast((t as any).difficultyDown ?? 'Easier numbers!');
        setTimeout(() => setPhaseToast(null), 2000);
      }
      setWrongAnswerData({ userInputs: { ...inputs }, expected: result.expected });
    }
  };

  const handleWrongAnswerContinue = () => {
    setWrongAnswerData(null);
    regenerateQuestion();
  };

  const handlePhaseForward = () => {
    if (currentPhase === 'red') {
      if (mission.skillName && mission.skillSummary) {
        playBadgeUnlock();
        setShowBadge(true);
      } else if (onEnterBattle) {
        onEnterBattle();
      } else {
        onComplete();
      }
      return;
    }
    playPhaseAdvance();
    const nextPhase = PHASE_ORDER[phaseIndex + 1];
    setCurrentPhase(nextPhase);
    // Show phase transition toast
    const toastMsg = nextPhase === 'amber' ? ((t as any).phaseToAmber ?? 'Now try with hints.')
      : ((t as any).phaseToRed ?? 'No hints — independent challenge!');
    setPhaseToast(toastMsg);
    setTimeout(() => setPhaseToast(null), 2500);
    regenerateQuestion();
  };

  const handlePhaseBack = () => {
    if (phaseIndex === 0) return;
    const prevPhase = PHASE_ORDER[phaseIndex - 1];
    setCurrentPhase(prevPhase);
    regenerateQuestion();
  };

  // Skill badge takes over the entire screen
  if (showBadge && mission.skillName && mission.skillSummary) {
    return (
      <SkillBadgeCard
        characterId={character.id}
        skillName={mission.skillName}
        skillSummary={mission.skillSummary}
        formula={resolveFormula(mission.secret.formula, lang)}
        missionTitle={mission.title}
        lang={lang}
        onClose={onEnterBattle || onComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/95 backdrop-blur-md">
    <div className="min-h-full flex items-center justify-center py-4">
      <CalculatorWidget
        lang={lang}
        onUseResult={(val) => {
          const fieldConfig = INPUT_FIELDS[currentMission.type];
          const langKey = lang === 'en' ? 'en' : 'zh';
          const fields = fieldConfig?.[langKey] ?? fieldConfig?.zh ?? [];
          const targetId = fields.find(f => !inputs[f.id])?.id ?? fields[0]?.id;
          if (targetId) setInputs(prev => ({ ...prev, [targetId]: val }));
        }}
      />

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
                {t.correct}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase transition toast */}
      <AnimatePresence>
        {phaseToast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-2xl pointer-events-none"
          >
            {phaseToast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={`practice-${shakeKey}`}
        initial={shakeKey > 0 ? false : { scale: 0.9, opacity: 0 }}
        animate={shaking ? { x: [0, -6, 6, -4, 4, -2, 2, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={shaking ? { duration: 0.4, ease: 'easeOut' } : undefined}
        className={`bg-parchment w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[3px] md:border-[6px] border-ink relative ${shaking ? 'border-red-600' : ''}`}
      >
        {/* Header */}
        <div className="bg-[#3d2b1f] p-4 text-[#f4e4bc] flex justify-between items-center border-b-4 border-[#5c4033]">
          <div className="flex items-center gap-4">
            <CharacterAvatar characterId={character.id} size={56} />
            <div>
              <h2 className="text-base md:text-xl font-black tracking-widest flex items-center gap-2">
                <BookOpen size={18} />
                {lt(mission.title, lang)}
              </h2>
              {/* Phase indicator — repair mode shows progress bar instead */}
              {repairMode ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-400 text-xs font-bold">
                    {`${(t as any).repair ?? '修复'} ${repairCorrect}/${REPAIR_TARGET}`}
                  </span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-[120px]">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(repairCorrect / REPAIR_TARGET) * 100}%` }} />
                  </div>
                </div>
              ) : (
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
                      <motion.div
                        animate={isCurrent ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={isCurrent ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : undefined}
                        className={`w-3 h-3 rounded-full border border-black ${
                          isCurrent || isCompleted ? colors[phase] : dimColors[phase]
                        } ${isCurrent ? 'ring-2 ring-white/50' : ''}`}
                      />
                      <span className={`text-[9px] font-bold uppercase ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                        {t.practicePhase[phase]}
                      </span>
                    </div>
                  );
                })}
              {/* Adaptive difficulty tier indicator (Amber/Red only) */}
              {currentPhase !== 'green' && (
                <div className="flex items-center gap-1 ml-2">
                  {[1, 2, 3].map(star => (
                    <span key={star} className={`text-[10px] ${star <= adaptiveTier ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                  ))}
                </div>
              )}
              {/* Consecutive correct streak mini-bar */}
              {currentPhase !== 'green' && consecutiveCorrect > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-1.5 h-3 rounded-sm ${i <= consecutiveCorrect ? 'bg-emerald-400' : 'bg-white/15'}`} />
                  ))}
                  <span className="text-[8px] text-emerald-400/70 font-bold ml-0.5">{consecutiveCorrect}/3</span>
                </div>
              )}
              </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-600/30 rounded-full text-xs font-bold">
              {t.practice}
            </span>
            <button
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-xs font-bold min-h-10"
            >
              <ChevronLeft size={16} />
              {t.back}
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
          >
            {/* Left: Question area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#e8d5a7] rounded-lg p-3 md:p-6 border-2 border-[#3d2b1f]/20 shadow-inner"
            >
            <div className="flex items-center gap-2 mb-4 text-ink font-bold border-b border-ink/10 pb-2">
              <MapIcon size={18} />
              <span>{t.practicePhase[currentPhase]}</span>
            </div>

            {/* Story text */}
            <div className="bg-white/40 p-3 rounded-lg mb-4 italic text-xs text-ink-light border-l-4 border-[#8b0000]">
              <LatexText text={storyText} />
            </div>

            {/* Description text */}
            <div className="text-ink-light text-sm font-bold mb-6 leading-relaxed">
              <LatexText text={descText} />
            </div>

            {/* Visual diagram — rendered by renderDiagram or fallback to VisualData */}
            {renderDiagram(currentMission, currentPhase, tutorialStep)
              || (currentPhase !== 'red' ? <VisualData mission={currentMission} lang={lang} /> : null)}

            {/* Green phase: show formula in left panel as reference */}
            {currentPhase === 'green' && (
              <div className="mt-4 p-3 bg-emerald-100 border-2 border-emerald-300 rounded-lg">
                <div className="text-emerald-800 text-xs font-bold mb-1">{t.secretFormula}</div>
                <MathView tex={resolveFormula(currentMission.secret.formula, lang)} className="text-lg font-black text-emerald-900" />
              </div>
            )}
          </motion.div>

          {/* Right: Inputs and controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >            {currentPhase === 'green' ? (
              <>
                {/* GREEN PHASE: Worked example — no input, just watch the solution */}
                <div className="px-3 py-2 bg-amber-900/40 border border-amber-600/30 rounded-lg text-amber-100 text-xs font-bold text-center">
                  {(t as any).greenPhaseHint ?? 'Just watch — click through each step.'}
                </div>
                {currentMission.tutorialSteps && (
                  <AnimatedTutorial
                    tutorialSteps={interpolatedTutorialSteps!}
                    equationSteps={currentMission.data?.tutorialEquationSteps}
                    characterId={character.id}
                    currentStep={tutorialStep}
                    lang={lang}
                  />
                )}

                {/* Step through tutorial with prev/next, then offer "next example" */}
                <div className="flex gap-2">
                  {tutorialStep > 0 && (
                    <motion.button
                      {...buttonBase}
                      onClick={() => { playClick(); setTutorialStep(prev => prev - 1); }}
                      className="flex-1 py-4 bg-slate-500 text-white font-black rounded-lg shadow-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 min-h-12"
                    >
                      <ChevronLeft size={20} />
                      {t.prevStep}
                    </motion.button>
                  )}
                  {tutorialStep < (currentMission.tutorialSteps?.length || 1) - 1 ? (
                    <motion.button
                      {...buttonBase}
                      onClick={() => { playClick(); setTutorialStep(prev => prev + 1); }}
                      className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 min-h-12"
                    >
                      {t.nextStep}
                      <ChevronRight size={20} />
                    </motion.button>
                  ) : (
                    <motion.button
                      {...buttonBase}
                      onClick={() => { playClick(); regenerateQuestion(); }}
                      className="flex-1 py-4 bg-[#3d2b1f] text-[#f4e4bc] font-black rounded-lg shadow-lg hover:bg-[#5c4033] transition-colors flex items-center justify-center gap-2 min-h-12"
                    >
                      {t.seeAnotherExample}
                      <ChevronRight size={20} />
                    </motion.button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* AMBER / RED PHASE: Student answers */}
                {currentPhase === 'amber' && (
                  <div className="p-3 bg-amber-100 border-2 border-amber-300 rounded-lg mb-2">
                    <div className="text-amber-800 text-xs font-bold mb-1">{t.secretFormula}</div>
                    <MathView tex={resolveFormula(currentMission.secret.formula, lang)} className="text-lg font-black text-amber-900" />
                    <div className="text-amber-700/60 text-[10px] font-bold mt-1">
                      {(t as any).amberPhaseHint ?? 'Hint: use this formula!'}
                    </div>
                  </div>
                )}
                {currentPhase === 'red' && (
                  <div className="px-3 py-2 bg-amber-900/40 border border-amber-600/30 rounded-lg text-amber-100 text-xs font-bold text-center mb-2">
                    {(t as any).redPhaseHint ?? 'No hints — you can do it!'}
                  </div>
                )}

                <InputFields
                  mission={currentMission}
                  inputs={inputs}
                  setInputs={setInputs}
                  difficultyMode={currentPhase as DifficultyMode}
                  tutorialStep={0}
                  isTutorial={false}
                  lang={lang}
                />

                {/* Wrong answer review panel */}
                {wrongAnswerData && (
                  <WrongAnswerPanel
                    questionType={currentMission.type}
                    userInputs={wrongAnswerData.userInputs}
                    expected={wrongAnswerData.expected}
                    formula={resolveFormula(currentMission.secret.formula, lang)}
                    tutorialSteps={interpolatedTutorialSteps}
                    lang={lang}
                    onContinue={handleWrongAnswerContinue}
                    continueLabel={t.gotItNextQuestion}
                  />
                )}

                <motion.button
                  {...(wrongAnswerData || showCorrectFlash ? {} : buttonBase)}
                  onClick={handleSubmit}
                  disabled={!!wrongAnswerData || showCorrectFlash}
                  className={`w-full py-5 text-[#f4e4bc] text-xl font-black rounded-lg transition-colors flex items-center justify-center gap-3 border-2 min-h-12 ${
                    wrongAnswerData || showCorrectFlash
                      ? 'bg-slate-500 border-slate-600 cursor-not-allowed'
                      : 'bg-[#8b0000] shadow-[0_4px_0_#5c0000] border-[#5c0000]'
                  }`}
                >
                  <Swords size={24} />
                  {t.attack}
                </motion.button>
              </>
            )}

            {/* Phase navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex gap-3"
            >
              {phaseIndex > 0 && (
                <motion.button
                  {...buttonBase}
                  onClick={handlePhaseBack}
                  className="flex-1 py-3 bg-white/50 border-2 border-ink/20 text-ink font-bold rounded-lg hover:bg-white/70 transition-colors flex items-center justify-center gap-2 text-sm min-h-12"
                >
                  <ChevronLeft size={16} />
                  {t.goBack}
                </motion.button>
              )}
              <motion.button
                {...buttonBase}
                onClick={handlePhaseForward}
                className={`flex-1 py-3 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border-2 min-h-12 ${
                  currentPhase === 'red'
                    ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-500'
                    : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                }`}
              >
                {currentPhase === 'green' ? t.startPractice : currentPhase === 'amber' ? t.removeHints : t.enterChallenge}
                <ChevronRight size={16} />
              </motion.button>
            </motion.div>

            {/* Back to map */}
            <motion.button
              {...buttonBase}
              onClick={onCancel}
              className="w-full py-2 text-ink/50 hover:text-ink text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeft size={14} />
              {t.backToMap}
            </motion.button>
          </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>

    {/* Exit confirmation overlay */}
    <AnimatePresence>
      {showExitConfirm && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
            className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-xs text-center"
          >
            <p className="text-white font-bold mb-1">{lang === 'en' ? 'Quit practice?' : '\u9000\u51fa\u7ec3\u4e60\uff1f'}</p>
            <p className="text-white/40 text-xs mb-4">{lang === 'en' ? 'Current phase progress will be lost.' : '\u5f53\u524d\u9636\u6bb5\u8fdb\u5ea6\u5c06\u4e22\u5931\u3002'}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2.5 bg-white/10 text-white/70 rounded-xl text-xs font-bold">
                {lang === 'en' ? 'Continue' : '\u7ee7\u7eed\u7ec3\u4e60'}
              </button>
              <button onClick={onCancel} className="flex-1 py-2.5 bg-rose-500/80 text-white rounded-xl text-xs font-bold">
                {lang === 'en' ? 'Quit' : '\u9000\u51fa'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};
