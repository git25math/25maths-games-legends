import { Flame } from 'lucide-react';
import type { Language } from '../types';
import { MAX_STAMINA } from '../utils/stamina';

const LABELS = {
  zh: { title: '今日试炼', remaining: '剩余' },
  zh_TW: { title: '今日試煉', remaining: '剩餘' },
  en: { title: 'Daily Trials', remaining: 'left' },
};

/**
 * Compact stamina display — 3 flame icons with count.
 * Shows in MapScreen header area.
 */
export const StaminaBar = ({
  lang,
  remaining,
}: {
  lang: Language;
  remaining: number;
}) => {
  const l = LABELS[lang];
  const total = MAX_STAMINA;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
      <span className="text-[10px] text-white/40 font-bold mr-0.5">{l.title}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <Flame
            key={i}
            size={14}
            className={i < remaining
              ? 'text-orange-400 drop-shadow-[0_0_4px_rgba(251,146,60,0.6)]'
              : 'text-white/15'
            }
            fill={i < remaining ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <span className={`text-[10px] font-black ml-0.5 ${
        remaining > 0 ? 'text-orange-400' : 'text-white/30'
      }`}>
        {remaining}/{total}
      </span>
    </div>
  );
};
