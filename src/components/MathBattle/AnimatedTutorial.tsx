import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterAvatar } from '../CharacterAvatar';
import { DialogueBubble } from '../DialogueBubble';
import { LatexText } from '../MathView';
import { EquationSteps } from '../diagrams/EquationSteps';
import { lt } from '../../i18n/resolveText';
import { useAudio } from '../../audio';

type TutorialStep = {
  text: { zh: string; en: string };
  hint?: { zh: string; en: string };
  highlightField?: string;
};

type EquationStep = {
  tex: string;
  annotation?: string | { zh: string; en: string };
};

type Props = {
  tutorialSteps: TutorialStep[];
  equationSteps?: EquationStep[];
  characterId: string;
  currentStep: number;
  lang: 'zh' | 'en';
};

/**
 * Extract speaker name from tutorial text.
 * Splits on full-width '：' or ASCII ':', takes the first part.
 * Falls back to 'narrator' if no colon is found.
 */
function extractSpeaker(text: string): { speaker: string; dialogue: string } {
  const colonIdx = text.indexOf('：');
  const asciiColonIdx = text.indexOf(':');

  // Pick whichever colon appears first (prefer full-width)
  let idx = -1;
  if (colonIdx !== -1 && asciiColonIdx !== -1) {
    idx = Math.min(colonIdx, asciiColonIdx);
  } else if (colonIdx !== -1) {
    idx = colonIdx;
  } else if (asciiColonIdx !== -1) {
    idx = asciiColonIdx;
  }

  if (idx === -1) {
    return { speaker: 'narrator', dialogue: text };
  }

  return {
    speaker: text.slice(0, idx).trim(),
    dialogue: text.slice(idx + 1).trim(),
  };
}

export function AnimatedTutorial({
  tutorialSteps,
  equationSteps,
  characterId,
  currentStep,
  lang,
}: Props) {
  const { speakTactical } = useAudio();
  const prevStepRef = useRef(currentStep);
  const direction = currentStep >= prevStepRef.current ? 1 : -1;

  const step = tutorialSteps[currentStep];
  const rawText = step ? lt(step.text, lang) : '';
  const { speaker, dialogue } = extractSpeaker(rawText);
  const hint = step?.hint ? lt(step.hint, lang) : undefined;

  // Voice Guidance Trigger
  useEffect(() => {
    if (dialogue && !muted) {
      // Advanced Math-to-Speech Cleaning
      let speechText = dialogue
        .replace(/\$/g, '') // Remove TeX markers
        .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 over $2') // Fractions
        .replace(/\^\{?([^}]*)\}?/g, ' to the power of $1') // Powers
        .replace(/\\sqrt\{?([^}]*)\}?/g, 'square root of $1') // Roots
        .replace(/\\approx/g, 'approximately equal to') // Approx
        .replace(/\\pm/g, 'plus or minus') // Plus-minus
        .replace(/\\times/g, 'times') // Multiplication
        .replace(/\*/g, ' times ') // Asterisk multiplication
        .replace(/=/g, ' equals '); // Equals

      // Delay slightly for the radio static SFX to finish
      const timer = window.setTimeout(() => {
        speakTactical(speechText, lang as any);
      }, 50);
      
      return () => window.clearTimeout(timer);
    }
    prevStepRef.current = currentStep;
  }, [currentStep, dialogue, lang, speakTactical, muted]);

  if (!step) return null;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        initial={{ opacity: 0, x: direction * 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -30 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-indigo-600/10 border-2 border-indigo-500/30 p-4 rounded-xl"
      >
        {/* Top row: avatar + dialogue bubble */}
        <div className="flex items-start gap-3">
          <CharacterAvatar characterId={characterId} size={48} speaking />
          <div className="flex-1 min-w-0">
            <DialogueBubble text={dialogue} speaker={speaker} />
            {/* Hint box */}
            {hint && (
              <motion.div 
                animate={{ boxShadow: ['0 0 0px rgba(245,158,11,0)', '0 0 15px rgba(245,158,11,0.5)', '0 0 0px rgba(245,158,11,0)'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-amber-100/80 border border-amber-300 text-xs text-amber-800 leading-relaxed overflow-hidden" 
                style={{ wordBreak: 'break-word' }}
              >
                <LatexText text={hint} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Equation steps synced to tutorial step */}
        {equationSteps && equationSteps.length > 0 && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.3)', '0 0 0px rgba(99,102,241,0)'] 
            }}
            transition={{ 
              opacity: { delay: 0.15, duration: 0.3 },
              boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            className="mt-4 rounded-xl"
          >
            <EquationSteps
              steps={equationSteps.map(s => ({
                tex: s.tex,
                annotation: s.annotation
                  ? (typeof s.annotation === 'string' ? s.annotation : lt(s.annotation, lang))
                  : undefined,
              }))}
              currentStep={currentStep}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
