import { motion } from 'motion/react';
import { X, Package } from 'lucide-react';
import type { Language } from '../types';
import { getInventory, REPAIR_ITEMS, getTotalItems } from '../utils/inventory';
import { lt } from '../i18n/resolveText';
import { useEscapeKey } from '../hooks/useEscapeKey';

const LABELS = {
  zh: { title: '背包', empty: '暂无道具，完成闯关即可获得', total: '总计' },
  zh_TW: { title: '背包', empty: '暫無道具，完成闯關即可獲得', total: '總計' },
  en: { title: 'Backpack', empty: 'No items yet — earn them by completing battles', total: 'Total' },
};

const TYPE_COLORS = {
  hammer: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400' },
  scroll: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400' },
  crystal: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400' },
};

export const InventoryPanel = ({
  lang,
  completedMissions,
  onClose,
}: {
  lang: Language;
  completedMissions: Record<string, unknown>;
  onClose: () => void;
}) => {
  const l = LABELS[lang];
  useEscapeKey(onClose);
  const inventory = getInventory(completedMissions);
  const total = getTotalItems(inventory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-amber-400" />
            <h2 className="text-xl font-black text-white">{l.title}</h2>
            <span className="text-xs text-white/30 font-bold">{l.total}: {total}</span>
          </div>
          <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {total === 0 ? (
          <div className="text-center text-white/30 py-12">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{l.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {REPAIR_ITEMS.map(item => {
              const count = inventory[item.id] ?? 0;
              if (count === 0) return null;
              const colors = TYPE_COLORS[item.type];
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 flex items-center gap-3 ${colors.border} ${colors.bg}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${colors.text}`}>{lt(item.name, lang)}</p>
                    <p className="text-[10px] text-white/40">{lt(item.description, lang)}</p>
                  </div>
                  <span className={`text-lg font-black ${colors.text}`}>×{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* How to earn hint */}
        <div className="mt-4 px-3 py-2 rounded-xl bg-white/5 text-[10px] text-white/30">
          {lang === 'en'
            ? <>🔨 Score ≥80% in battle · 📜 Complete Recovery Pack · 💎 Red difficulty, 0 errors</>
            : lang === 'zh_TW'
            ? <>🔨 闯關≥80分 · 📜 完成修復訓練 · 💎 紅色難度零失誤</>
            : <>🔨 闯关≥80分 · 📜 完成修复训练 · 💎 红色难度零失误</>
          }
        </div>
      </motion.div>
    </motion.div>
  );
};
