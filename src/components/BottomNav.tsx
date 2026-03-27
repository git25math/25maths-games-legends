/**
 * BottomNav — Mobile bottom navigation bar (4 tabs)
 * Replaces the "More" dropdown menu on mobile for better UX.
 * Only visible on screens < md breakpoint.
 */
import { motion } from 'motion/react';
import { MapIcon, Swords, Trophy, User } from 'lucide-react';
import type { Language } from '../types';

export type BottomTab = 'map' | 'expedition' | 'achievements' | 'profile';

const TABS: { id: BottomTab; icon: typeof MapIcon; zh: string; en: string }[] = [
  { id: 'map', icon: MapIcon, zh: '地图', en: 'Map' },
  { id: 'expedition', icon: Swords, zh: '远征', en: 'Quest' },
  { id: 'achievements', icon: Trophy, zh: '成就', en: 'Awards' },
  { id: 'profile', icon: User, zh: '我的', en: 'Me' },
];

type Props = {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  lang: Language;
  badge?: Partial<Record<BottomTab, number>>;
};

export function BottomNav({ activeTab, onTabChange, lang, badge = {} }: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-white/10 safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = badge[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full relative transition-colors ${
                isActive ? 'text-gold-light' : 'text-white/40'
              }`}
            >
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative"
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {count != null && count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </motion.div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-gold-light' : 'text-white/30'}`}>
                {lang === 'en' ? tab.en : tab.zh}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold-light rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
