/**
 * BattleContent — Main battle area: story, question, inputs, tutorial (v8.4 refactor)
 */
import { motion } from 'motion/react';
import { MapIcon, Shield, Swords, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Mission, Character, Language, DifficultyMode } from '../../types';
import { translations } from '../../i18n/translations';
import { lt, resolveFormula } from '../../i18n/resolveText';
import { LatexText, MathView } from '../MathView';
import { InputFields } from './InputFields';
import { VisualData } from './VisualData';
import { AnimatedTutorial } from './AnimatedTutorial';
import { WrongAnswerPanel } from './WrongAnswerPanel';
import { tapScale, hoverGlow } from '../../utils/animationPresets';

type Props = {
  mission: Mission;
  currentQuestion: Mission;
  character: Character;
  lang: Language;
  difficultyMode: DifficultyMode;
  storyText: string;
  descText: string;
  interpolatedTutorialSteps: Array<{ text: { zh: string; en: string }; highlightField?: string; hint?: { zh: string; en: string } }> | undefined;
  isTutorial: boolean;
  tutorialStep: number;
  inputs: Record<string, string>;
  setInputs: (inputs: { [key: string]: string }) => void;
  wrongAnswerData: { userInputs: Record<string, string>; expected: Record<string, string> } | null;
  partialCreditInfo: { score: number } | null;
  skillCard: string | null;
  currentQIdx: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  onTutorialPrev: () => void;
  onTutorialNext: () => void;
  onWrongAnswerContinue: () => void;
};

export function BattleContent({
  mission, currentQuestion, character, lang, difficultyMode,
  storyText, descText, interpolatedTutorialSteps,
  isTutorial, tutorialStep, inputs, setInputs,
  wrongAnswerData, partialCreditInfo, skillCard, currentQIdx, isSubmitting,
  onSubmit, onTutorialPrev, onTutorialNext, onWrongAnswerContinue,
}: Props) {
  const t = translations[lang];
  const p = currentQuestion.data ?? {};

  return (
    <div className="p-2 md:p-4 lg:p-8 flex flex-col-reverse md:grid md:grid-cols-2 gap-4 md:gap-8">
      {/* Left: Tactical Map (on mobile: below inputs due to flex-col-reverse) */}
      <div className="bg-parchment-dark rounded-lg p-4 md:p-6 border-2 border-ink/20 shadow-inner">
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
            <MathView tex={resolveFormula(currentQuestion.secret.formula, lang)} className="text-lg font-black text-purple-900" />
          </div>
        )}

        {/* Amber mode: show formula hint */}
        {difficultyMode === 'amber' && (
          <div className="mt-4 p-3 bg-amber-100 border-2 border-amber-300 rounded-lg">
            <div className="text-amber-800 text-xs font-bold mb-1">{t.secretFormula}</div>
            <MathView tex={resolveFormula(currentQuestion.secret.formula, lang)} className="text-lg font-black text-amber-900" />
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

        {/* Wrong answer review panel */}
        {wrongAnswerData && (
          <WrongAnswerPanel
            questionType={currentQuestion.type}
            userInputs={wrongAnswerData.userInputs}
            expected={wrongAnswerData.expected}
            formula={resolveFormula(currentQuestion.secret.formula, lang)}
            tutorialSteps={interpolatedTutorialSteps}
            lang={lang}
            onContinue={onWrongAnswerContinue}
            storyText={!partialCreditInfo && mission.storyConsequence ? lt(mission.storyConsequence.wrong, lang) : undefined}
            isPartial={!!partialCreditInfo}
            partialScore={partialCreditInfo?.score}
          />
        )}

        {isTutorial ? (
          <div className="flex gap-2">
            {tutorialStep > 0 && (
              <button
                onClick={onTutorialPrev}
                className="flex-1 py-4 bg-slate-500 text-white font-black rounded-lg shadow-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2 min-h-12"
              >
                <ChevronLeft size={20} />
                {t.prevStep}
              </button>
            )}
            <button
              onClick={onTutorialNext}
              className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 min-h-12"
            >
              {tutorialStep < (mission.tutorialSteps?.length || 0) - 1 ? t.nextStep : t.tutorialStartBattle}
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <motion.button
            {...(wrongAnswerData ? {} : { ...tapScale, ...hoverGlow })}
            onClick={onSubmit}
            disabled={!!wrongAnswerData || isSubmitting}
            className={`w-full py-4 md:py-6 text-[#f4e4bc] text-lg md:text-2xl font-black rounded-lg transition-shadow flex items-center justify-center gap-4 border-2 min-h-12 ${wrongAnswerData ? 'bg-slate-500 border-slate-600 cursor-not-allowed' : 'bg-[#8b0000] shadow-[0_4px_0_#5c0000] border-[#5c0000]'}`}
          >
            <Swords size={28} />
            {t.attack}
          </motion.button>
        )}
      </div>
    </div>
  );
}
