/**
 * EquationSteps — 方程解题步骤可视化 (with writing animation)
 * 覆盖 KP: 2.5-01 ~ 2.5-13
 */
import { motion } from 'motion/react';
import { MathView } from '../MathView';

type Step = {
  tex: string;       // LaTeX of this step
  annotation?: string; // e.g. "÷3 both sides"
};

type Props = {
  steps: Step[];
  currentStep?: number;  // highlights up to this step
  highlightColor?: string;
  interactive?: boolean;
};

const COLORS = {
  wood: '#3d2b1f',
  scroll: '#f4e4bc',
  red: '#8b0000',
  gold: '#b8860b',
};

export function EquationSteps({ steps, currentStep = steps.length - 1, highlightColor }: Props) {
  const active = highlightColor || COLORS.red;

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm mx-auto" role="list" aria-label="Equation solving steps">
      {steps.map((step, i) => {
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;

        return (
          <motion.div
            key={i}
            role="listitem"
            initial={isActive ? { opacity: 0, x: -10 } : false}
            animate={{ opacity: isActive ? 1 : 0.35, x: 0 }}
            transition={{ duration: 0.35, delay: isCurrent ? 0.2 : 0 }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: isCurrent ? `${active}10` : 'transparent',
              borderLeft: isActive ? `3px solid ${active}` : '3px solid transparent',
            }}
          >
            {/* Step number */}
            <motion.span
              animate={{ scale: isCurrent ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: isActive ? active : COLORS.scroll,
                color: isActive ? '#fff' : COLORS.wood,
              }}
            >
              {i + 1}
            </motion.span>

            {/* Math expression */}
            <div className="flex-1">
              <MathView tex={step.tex} className="text-lg" />
            </div>

            {/* Annotation */}
            {step.annotation && isActive && (
              <motion.span
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="text-xs font-medium"
                style={{ color: COLORS.gold }}
              >
                {step.annotation}
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
