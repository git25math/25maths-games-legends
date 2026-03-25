import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Swords, Zap, Target } from 'lucide-react';
import type { Language } from '../types';

export type BattleMode = 'classic' | 'speed' | 'marathon';

const MODES: { id: BattleMode; icon: typeof Swords; color: string; border: string }[] = [
  { id: 'classic', icon: Swords, color: 'from-indigo-600 to-purple-600', border: 'border-indigo-400/40' },
  { id: 'speed', icon: Zap, color: 'from-amber-600 to-orange-600', border: 'border-amber-400/40' },
  { id: 'marathon', icon: Target, color: 'from-emerald-600 to-teal-600', border: 'border-emerald-400/40' },
];

const LABELS: Record<string, Record<BattleMode, { name: string; desc: string; detail: string }>> = {
  zh: {
    classic: { name: '经典闯关', desc: '5 题 · 4 HP', detail: '答错扣血，连击加分' },
    speed: { name: '极速挑战', desc: '60 秒 · 无限题', detail: '答对+5秒，答错-10秒' },
    marathon: { name: '马拉松', desc: '20 题 · 无 HP', detail: '不扣血，统计正确率' },
  },
  zh_TW: {
    classic: { name: '經典闖關', desc: '5 題 · 4 HP', detail: '答錯扣血，連擊加分' },
    speed: { name: '極速挑戰', desc: '60 秒 · 無限題', detail: '答對+5秒，答錯-10秒' },
    marathon: { name: '馬拉松', desc: '20 題 · 無 HP', detail: '不扣血，統計正確率' },
  },
  en: {
    classic: { name: 'Classic', desc: '5 Qs · 4 HP', detail: 'HP loss on wrong, streak bonus' },
    speed: { name: 'Speed Rush', desc: '60s · Unlimited', detail: '+5s correct, -10s wrong' },
    marathon: { name: 'Marathon', desc: '20 Qs · No HP', detail: 'No HP loss, accuracy stats' },
  },
};

export const BattleModeSelector = ({
  lang,
  onSelect,
}: {
  lang: Language;
  onSelect: (mode: BattleMode) => void;
}) => {
  const l = LABELS[lang] ?? LABELS.en;

  // Escape key defaults to classic mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onSelect('classic'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSelect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onSelect('classic'); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-sm w-full space-y-3"
      >
        <h2 className="text-white font-black text-lg text-center mb-4">
          {lang === 'en' ? 'Choose Battle Mode' : '选择闯关模式'}
        </h2>
        {MODES.map((mode, i) => {
          const info = l[mode.id];
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(mode.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${mode.border} bg-white/5 hover:bg-white/10 transition-colors text-left min-h-[72px]`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center shrink-0`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm">{info.name}</p>
                <p className="text-white/50 text-[10px] font-bold">{info.desc}</p>
                <p className="text-white/30 text-[10px]">{info.detail}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
