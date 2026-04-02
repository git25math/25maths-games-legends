/**
 * BottomNav — Mobile bottom navigation (3 tabs: Map / Homework / Me)
 * Simplified from 4 tabs. Expedition + Achievements moved into "Me" panel.
 */
import { motion } from 'motion/react';
import { MapIcon, BookOpen, User } from 'lucide-react';
import type { Language } from '../types';

export type BottomTab = 'map' | 'homework' | 'profile';

const TABS: { id: BottomTab; icon: typeof MapIcon; zh: string; en: string }[] = [
  { id: 'map', icon: MapIcon, zh: '练习', en: 'Practice' },
  { id: 'homework', icon: BookOpen, zh: '作业', en: 'Homework' },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-slate-900/95 backdrop-blur-md border-t border-white/10 safe-area-pb" role="tablist" aria-label="Navigation">
      <div className="flex items-center justify-around h-14">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = badge[tab.id];
          const label = lang === 'en' ? tab.en : tab.zh;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={count ? `${label} (${count})` : label}
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
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-gold-light rounded-full"
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
