import type { Mission, Language, DifficultyMode } from '../../types';
import { LatexText } from '../MathView';
import { INPUT_FIELDS } from './inputConfig';

export const InputFields = ({
  mission,
  inputs,
  setInputs,
  difficultyMode,
  tutorialStep,
  isTutorial,
}: {
  mission: Mission;
  inputs: { [key: string]: string };
  setInputs: (inputs: { [key: string]: string }) => void;
  difficultyMode: DifficultyMode;
  tutorialStep: number;
  isTutorial: boolean;
}) => {
  const currentFields = INPUT_FIELDS[mission.type] || [];

  return (
    <div className="space-y-6">
      {currentFields.map(field => {
        const isHighlighted = isTutorial && mission.tutorialSteps?.[tutorialStep]?.highlightField === field.id;
        return (
          <div key={field.id} className={`relative transition-all duration-500 ${isHighlighted ? 'scale-105' : isTutorial ? 'opacity-40 grayscale' : ''}`}>
            <label className="absolute -top-2 left-4 px-2 bg-[#f4e4bc] text-[10px] font-black text-[#5c4033] uppercase tracking-widest z-10">
              <LatexText text={field.label} />
            </label>
            <input
              type="number"
              step="any"
              disabled={isTutorial && !isHighlighted}
              value={inputs[field.id] || ''}
              onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className={`w-full px-6 py-5 bg-white/50 border-2 rounded-lg text-2xl font-black text-[#3d2b1f] focus:bg-white outline-none transition-all shadow-md ${
                isHighlighted ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-[#3d2b1f]'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};
