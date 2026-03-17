import { motion } from 'motion/react';
import { CharacterAvatar } from '../CharacterAvatar';
import { DialogueBubble } from '../DialogueBubble';
import { EquationSteps } from '../diagrams/EquationSteps';

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
  const step = tutorialSteps[currentStep];
  if (!step) return null;

  const rawText = step.text[lang];
  const { speaker, dialogue } = extractSpeaker(rawText);
  const hint = step.hint?.[lang];

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
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
            <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-100/80 border border-amber-300 text-xs text-amber-800 leading-relaxed">
              {hint}
            </div>
          )}
        </div>
      </div>

      {/* Equation steps synced to tutorial step */}
      {equationSteps && equationSteps.length > 0 && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-4"
        >
          <EquationSteps
            steps={equationSteps.map(s => ({
              tex: s.tex,
              annotation: s.annotation
                ? (typeof s.annotation === 'string' ? s.annotation : s.annotation[lang])
                : undefined,
            }))}
            currentStep={currentStep}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
