import { motion } from 'motion/react';
import { CheckCircle2, Swords, MapIcon, Sparkles } from 'lucide-react';
import type { Language } from '../types';
import { useAudio } from '../audio';
import { useEffect } from 'react';

const LABELS = {
  zh: {
    title: '技能已稳定',
    subtitle: '修复训练完成！错误记录已清除。',
    retryBtn: '再次挑战这关',
    mapBtn: '返回地图',
    scrollEarned: '获得净化卷轴',
  },
  zh_TW: {
    title: '技能已穩定',
    subtitle: '修復訓練完成！錯誤記錄已清除。',
    retryBtn: '再次挑戰這關',
    mapBtn: '返回地圖',
    scrollEarned: '獲得淨化卷軸',
  },
  en: {
    title: 'Skill Stabilised',
    subtitle: 'Repair complete! Error record cleared.',
    retryBtn: 'Retry This Mission',
    mapBtn: 'Back to Map',
    scrollEarned: 'Purify Scroll earned',
  },
};

export const RepairCompleteOverlay = ({
  lang,
  bonus,
  scrollAwarded,
  onRetry,
  onBack,
}: {
  lang: Language;
  bonus: number;
  scrollAwarded: boolean;
  onRetry: () => void;
  onBack: () => void;
}) => {
  const l = LABELS[lang];
  const { playPhaseAdvance, playTap } = useAudio();

  useEffect(() => {
    playPhaseAdvance();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-slate-800/95 border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center"
        >
          <Sparkles size={32} className="text-emerald-400" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-black text-emerald-400 mb-1"
        >
          ✨ {l.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-white/40 mb-4"
        >
          {l.subtitle}
        </motion.p>

        {/* Rewards summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 rounded-xl p-3 mb-5 space-y-1"
        >
          {bonus > 0 && (
            <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-bold">
              <CheckCircle2 size={14} /> +{bonus} XP
            </div>
          )}
          {scrollAwarded && (
            <div className="flex items-center justify-center gap-2 text-blue-400 text-xs font-bold">
              📜 {l.scrollEarned}
            </div>
          )}
        </motion.div>

        {/* Action buttons — Step 6: Retry option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-2"
        >
          <button
            onClick={() => { playTap(); onRetry(); }}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            <Swords size={16} />
            {l.retryBtn}
          </button>
          <button
            onClick={() => { playTap(); onBack(); }}
            className="w-full py-2.5 rounded-xl bg-white/5 text-white/50 font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <MapIcon size={14} />
            {l.mapBtn}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
