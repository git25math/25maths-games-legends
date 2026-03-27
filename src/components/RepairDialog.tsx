import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, Sparkles, Check } from 'lucide-react';
import type { Language, EquipmentState } from '../types';
import type { ErrorType } from '../utils/diagnoseError';
import { getInventory, getAvailableRepairItems, getEffectiveRepairPower } from '../utils/inventory';
import type { RepairItemDef } from '../utils/inventory';
import { lt } from '../i18n/resolveText';
import { EQUIPMENT_COLORS } from '../utils/equipment';
import { useEscapeKey } from '../hooks/useEscapeKey';

const LABELS = {
  zh: {
    title: '修复装备',
    selectItem: '选择修复道具',
    noItems: '暂无修复道具',
    earnHint: '完成闯关或修复训练即可获得',
    repair: '使用修复',
    preview: '预计恢复',
    bonus: '额外加成',
    success: '修复成功！',
    healthPts: '耐久',
  },
  zh_TW: {
    title: '修復裝備',
    selectItem: '選擇修復道具',
    noItems: '暫無修復道具',
    earnHint: '完成闯關或修復訓練即可獲得',
    repair: '使用修復',
    preview: '預計恢復',
    bonus: '額外加成',
    success: '修復成功！',
    healthPts: '耐久',
  },
  en: {
    title: 'Repair Equipment',
    selectItem: 'Choose a repair item',
    noItems: 'No repair items available',
    earnHint: 'Earn them by completing battles or recovery packs',
    repair: 'Use Repair',
    preview: 'Restores',
    bonus: 'Pattern bonus',
    success: 'Repair successful!',
    healthPts: 'HP',
  },
};

const STATE_LABELS: Record<EquipmentState, { zh: string; zh_TW: string; en: string }> = {
  pristine: { zh: '崭新', zh_TW: '嶄新', en: 'Pristine' },
  worn: { zh: '磨损', zh_TW: '磨損', en: 'Worn' },
  damaged: { zh: '受损', zh_TW: '受損', en: 'Damaged' },
  broken: { zh: '破损', zh_TW: '破損', en: 'Broken' },
};

export const RepairDialog = ({
  lang,
  missionTitle,
  equipmentState,
  equipmentHealth,
  dominantError,
  completedMissions,
  onRepair,
  onClose,
}: {
  lang: Language;
  missionTitle: string;
  equipmentState: EquipmentState;
  equipmentHealth: number;
  dominantError?: ErrorType | null;
  completedMissions: Record<string, unknown>;
  onRepair: (itemId: string) => void;
  onClose: () => void;
}) => {
  const l = LABELS[lang];
  useEscapeKey(onClose);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableItems = getAvailableRepairItems(getInventory(completedMissions));
  const colors = EQUIPMENT_COLORS[equipmentState];
  const stateLabel = STATE_LABELS[equipmentState];

  const handleRepair = () => {
    if (!selectedItemId) return;
    setShowSuccess(true);
    setTimeout(() => {
      onRepair(selectedItemId);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full"
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles size={48} className="mx-auto text-amber-400 mb-4" />
              </motion.div>
              <p className="text-xl font-black text-amber-400">{l.success}</p>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench size={18} className="text-amber-400" />
                  <h2 className="text-lg font-black text-white">{l.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Equipment info */}
              <div className={`rounded-xl border p-3 mb-4 ${colors.border} ${colors.bg}`}>
                <p className="text-sm font-bold text-white">{missionTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold ${colors.text}`}>
                    {lt(stateLabel, lang)}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        equipmentHealth > 60 ? 'bg-amber-400' :
                        equipmentHealth > 30 ? 'bg-rose-400' : 'bg-slate-400'
                      }`}
                      style={{ width: `${equipmentHealth}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">{equipmentHealth}%</span>
                </div>
              </div>

              {/* Item selection */}
              <p className="text-xs text-white/40 font-bold mb-2">{l.selectItem}</p>

              {availableItems.length === 0 ? (
                <div className="text-center py-6 text-white/20">
                  <p className="text-sm">{l.noItems}</p>
                  <p className="text-[10px] mt-1">{l.earnHint}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 mb-4">
                  {availableItems.map(({ itemId, count, def }) => {
                    const isSelected = selectedItemId === itemId;
                    const effectivePower = getEffectiveRepairPower(def, dominantError);
                    const hasBonus = def.targetPattern && def.targetPattern === dominantError;

                    return (
                      <button
                        key={itemId}
                        onClick={() => setSelectedItemId(itemId)}
                        className={`rounded-xl border p-3 flex items-center gap-3 text-left transition-all ${
                          isSelected
                            ? 'border-amber-400/60 bg-amber-400/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xl">{def.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white">{lt(def.name, lang)}</p>
                          <p className="text-[10px] text-white/40">
                            {l.preview}: +{effectivePower} {l.healthPts}
                            {hasBonus && (
                              <span className="text-emerald-400 ml-1">({l.bonus}!)</span>
                            )}
                          </p>
                        </div>
                        <span className="text-sm font-black text-white/50">×{count}</span>
                        {isSelected && <Check size={16} className="text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Repair button */}
              {availableItems.length > 0 && (
                <button
                  onClick={handleRepair}
                  disabled={!selectedItemId}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                    selectedItemId
                      ? 'bg-amber-500 text-white hover:bg-amber-400'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  <Wrench size={16} className="inline mr-2" />
                  {l.repair}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
