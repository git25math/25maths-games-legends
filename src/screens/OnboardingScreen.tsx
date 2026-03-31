import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scroll, Eye, Lightbulb, Sword, ChevronRight } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { useAudio } from '../audio';

const LS_ONBOARDING_KEY = 'gl_onboarding_done';

export function isOnboardingDone(): boolean {
  return localStorage.getItem(LS_ONBOARDING_KEY) === '1';
}

export function markOnboardingDone(): void {
  localStorage.setItem(LS_ONBOARDING_KEY, '1');
}

export function clearOnboardingFlag(): void {
  localStorage.removeItem(LS_ONBOARDING_KEY);
}

export const OnboardingScreen = ({
  lang,
  onComplete,
}: {
  lang: Language;
  onComplete: () => void;
}) => {
  const [step, setStep] = useState(0);
  const t = translations[lang];
  const { playTap, playPhaseAdvance } = useAudio();

  const advance = () => {
    playTap();
    if (step < 2) {
      if (step === 1) playPhaseAdvance();
      setStep(step + 1);
    } else {
      markOnboardingDone();
      onComplete();
    }
  };

  const skip = () => {
    markOnboardingDone();
    onComplete();
  };

  const phaseLabels = t.practicePhase as Record<string, string>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-3 sm:px-4">
      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute top-4 sm:top-6 right-4 sm:right-20 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/30 hover:text-white/60 text-xs sm:text-sm font-bold focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg transition-colors z-10"
      >
        {(t as any).skipOnboarding ?? 'Skip'}
      </button>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === step ? 'bg-amber-400 scale-125' : i < step ? 'bg-amber-400/50' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center max-w-lg"
          >
            {/* Scroll icon */}
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
              <Scroll size={40} className="text-amber-400" />
            </div>

            {/* Story text */}
            <p className="text-base sm:text-xl md:text-2xl text-amber-100 font-bold leading-relaxed mb-6 sm:mb-10">
              {t.onboardingStory}
            </p>

            {/* CTA */}
            <button
              onClick={advance}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-300 transition-all"
            >
              {t.onboardingStart}
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="phases"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center max-w-lg"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 sm:mb-8">
              {t.onboardingPhaseTitle}
            </h2>

            <div className="flex flex-col gap-3 sm:gap-4 w-full mb-6 sm:mb-10">
              {/* Green */}
              <div className="flex items-center gap-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4">
                <div className="w-12 h-12 bg-emerald-500/25 rounded-xl flex items-center justify-center shrink-0">
                  <Eye size={24} className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="text-emerald-400 font-black text-sm uppercase tracking-wide">
                    {phaseLabels.green}
                  </div>
                  <div className="text-emerald-100/80 text-sm mt-0.5">
                    {t.onboardingPhaseGreen}
                  </div>
                </div>
              </div>

              {/* Amber */}
              <div className="flex items-center gap-4 bg-amber-500/15 border border-amber-500/30 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4">
                <div className="w-12 h-12 bg-amber-500/25 rounded-xl flex items-center justify-center shrink-0">
                  <Lightbulb size={24} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-amber-400 font-black text-sm uppercase tracking-wide">
                    {phaseLabels.amber}
                  </div>
                  <div className="text-amber-100/80 text-sm mt-0.5">
                    {t.onboardingPhaseAmber}
                  </div>
                </div>
              </div>

              {/* Red */}
              <div className="flex items-center gap-4 bg-rose-500/15 border border-rose-500/30 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4">
                <div className="w-12 h-12 bg-rose-500/25 rounded-xl flex items-center justify-center shrink-0">
                  <Sword size={24} className="text-rose-400" />
                </div>
                <div className="text-left">
                  <div className="text-rose-400 font-black text-sm uppercase tracking-wide">
                    {phaseLabels.red}
                  </div>
                  <div className="text-rose-100/80 text-sm mt-0.5">
                    {t.onboardingPhaseRed}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={advance}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all"
            >
              {t.onboardingPhaseBtn}
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center max-w-lg"
          >
            {/* Pulsing map icon */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-400/40">
                <Sword size={44} className="text-amber-400" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3">
              {t.onboardingGuideTitle}
            </h2>
            <p className="text-sm sm:text-lg text-white/60 mb-6 sm:mb-10">
              {t.onboardingGuideDesc}
            </p>

            <button
              onClick={advance}
              className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-rose-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-300 transition-all"
            >
              {t.onboardingGuideBtn}
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
