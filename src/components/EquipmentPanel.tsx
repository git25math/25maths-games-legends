import { motion } from 'motion/react';
import { X, Wrench } from 'lucide-react';
import type { Language, Mission, EquipmentState, KPEquipment } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { getEquipmentList, computeRepairBonus, EQUIPMENT_COLORS } from '../utils/equipment';
import { EquipmentBadge } from './EquipmentBadge';
import { useAudio } from '../audio';
import { useEscapeKey } from '../hooks/useEscapeKey';

const STATE_LABELS: Record<EquipmentState, { zh: string; en: string }> = {
  pristine: { zh: '崭新', en: 'Pristine' },
  worn: { zh: '磨损', en: 'Worn' },
  damaged: { zh: '受损', en: 'Damaged' },
  broken: { zh: '破损', en: 'Broken' },
};

export const EquipmentPanel = ({
  lang,
  completedMissions,
  missions,
  onRepair,
  onRepairWithItem,
  onOpenInventory,
  onClose,
}: {
  lang: Language;
  completedMissions: Record<string, unknown>;
  missions: Mission[];
  onRepair: (missionId: number) => void;
  onRepairWithItem?: (missionId: number) => void;
  onOpenInventory?: () => void;
  onClose: () => void;
}) => {
  const t = translations[lang];
  const { playTap } = useAudio();
  useEscapeKey(onClose);
  const mistakes = (completedMissions as any)?._mistakes as Record<string, { count: number }> | undefined;
  const equipment = getEquipmentList(completedMissions, mistakes);

  const getMissionTitle = (missionId: number): string => {
    const m = missions.find(m => m.id === missionId);
    return m ? lt(m.title, lang) : `#${missionId}`;
  };

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
          <h2 className="text-xl font-black text-white">
            {(t as any).equipmentArsenal ?? '装备库'}
          </h2>
          <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {equipment.length === 0 ? (
          <div className="text-center text-white/30 py-12">
            <p className="text-sm">{(t as any).noEquipment ?? '完成 Red 难度关卡即可获得装备'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {equipment.map(eq => {
              const colors = EQUIPMENT_COLORS[eq.state];
              const needsRepair = eq.state !== 'pristine';
              const label = STATE_LABELS[eq.state];
              const bonus = computeRepairBonus(eq.repairCount);

              return (
                <div
                  key={eq.missionId}
                  className={`rounded-xl border p-3 flex items-center gap-3 ${colors.border} ${colors.bg}`}
                >
                  <EquipmentBadge state={eq.state} size={20} />

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">
                      {getMissionTitle(eq.missionId)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold ${colors.text}`}>
                        {lt(label, lang)}
                      </span>
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${eq.health}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`h-full rounded-full ${
                            eq.health > 60 ? 'bg-amber-400' :
                            eq.health > 30 ? 'bg-rose-400' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <span className="text-[9px] text-white/30">{eq.health}%</span>
                    </div>
                    {needsRepair && (
                      <div className={`text-[10px] ${colors.text} mt-0.5`}>+{bonus} XP</div>
                    )}
                  </div>

                  {needsRepair && (
                    <div className="flex items-center gap-1 shrink-0">
                      {onRepairWithItem && (
                        <button
                          onClick={() => { playTap(); onRepairWithItem(eq.missionId); }}
                          className="flex items-center gap-1 px-2 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold hover:bg-purple-500/30 transition-all"
                          title={lang === 'en' ? 'Use item from backpack' : '使用背包道具'}
                        >
                          🔨
                        </button>
                      )}
                      <button
                        onClick={() => { playTap(); onRepair(eq.missionId); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30 transition-all"
                      >
                        <Wrench size={14} />
                        {(t as any).repair ?? '修复'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Inventory shortcut */}
        {onOpenInventory && (
          <button
            onClick={() => { playTap(); onOpenInventory(); }}
            className="w-full mt-4 py-2 rounded-xl bg-white/5 text-white/40 text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            🎒 {lang === 'en' ? 'View Backpack' : lang === 'zh_TW' ? '查看背包' : '查看背包'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};
