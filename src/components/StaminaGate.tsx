import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, BookOpen } from 'lucide-react';
import type { Language } from '../types';
import { getSecondsUntilReset, formatCountdown } from '../utils/stamina';
import { useAudio } from '../audio';

const LABELS = {
  zh: {
    title: '今日试炼次数已用完',
    subtitle: '明日自动恢复',
    resetIn: '恢复倒计时',
    practiceHint: '练习模式不限次数，继续磨炼实力！',
    practiceBtn: '继续练习',
    backBtn: '返回地图',
  },
  zh_TW: {
    title: '今日試煉次數已用完',
    subtitle: '明日自動恢復',
    resetIn: '恢復倒計時',
    practiceHint: '練習模式不限次數，繼續磨練實力！',
    practiceBtn: '繼續練習',
    backBtn: '返回地圖',
  },
  en: {
    title: 'Daily trials depleted',
    subtitle: 'Resets tomorrow',
    resetIn: 'Resets in',
    practiceHint: 'Practice mode is unlimited — keep sharpening your skills!',
    practiceBtn: 'Practice Instead',
    backBtn: 'Back to Map',
  },
};

/**
 * Full-screen overlay shown when student tries to battle with 0 stamina.
 * Offers Practice as alternative + countdown to reset.
 */
export const StaminaGate = ({
  lang,
  onPractice,
  onBack,
}: {
  lang: Language;
  onPractice: () => void;
  onBack: () => void;
}) => {
  const l = LABELS[lang];
  const [seconds, setSeconds] = useState(getSecondsUntilReset());
  const { playTap, playDefeat } = useAudio();

  // Play "depleted" sound on mount
  useEffect(() => {
    playDefeat();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(getSecondsUntilReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center"
      >
        {/* Depleted flames */}
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.12, 0.2, 0.12] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <Flame size={28} className="text-white/20" />
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-black text-white mb-1">{l.title}</h2>
        <p className="text-white/40 text-sm mb-5">{l.subtitle}</p>

        {/* Countdown */}
        <div className="bg-white/5 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs text-white/40 font-bold">{l.resetIn}</span>
          </div>
          <p className="text-2xl font-black text-amber-400 tracking-wider font-mono">
            {formatCountdown(seconds)}
          </p>
        </div>

        {/* Practice hint */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-bold">{l.practiceHint}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { playTap(); onPractice(); }}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-400 transition-colors"
          >
            <BookOpen size={16} className="inline mr-2" />
            {l.practiceBtn}
          </button>
          <button
            onClick={() => { playTap(); onBack(); }}
            className="w-full py-2.5 rounded-xl bg-white/5 text-white/50 font-bold text-sm hover:bg-white/10 transition-colors"
          >
            {l.backBtn}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
