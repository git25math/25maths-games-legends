import { motion } from 'motion/react';
import { X, Wrench } from 'lucide-react';
import type { Language, Mission, EquipmentState, KPEquipment } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { getEquipmentList, computeRepairBonus, EQUIPMENT_COLORS } from '../utils/equipment';
import { EQUIPMENT_DECAY } from '../utils/gameBalance';
import { EquipmentBadge } from './EquipmentBadge';
import { useAudio } from '../audio';
import { useEscapeKey } from '../hooks/useEscapeKey';

const STATE_LABELS: Record<EquipmentState, { zh: string; zh_TW: string; en: string }> = {
  pristine: { zh: '崭新', zh_TW: '嶄新', en: 'Pristine' },
  worn: { zh: '磨损', zh_TW: '磨損', en: 'Worn' },
  damaged: { zh: '受损', zh_TW: '受損', en: 'Damaged' },
  broken: { zh: '破损', zh_TW: '破損', en: 'Broken' },
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
        className="bg-slate-800/95 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
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
              // Days until next decay threshold (based on current effective health)
              const rate = 100 / EQUIPMENT_DECAY.BROKEN_DAYS; // health pts per day
              const daysUntilNext = eq.health >= 90 ? Math.floor((eq.health - 90) / rate)
                : eq.health >= 60 ? Math.floor((eq.health - 60) / rate)
                : eq.health >= 30 ? Math.floor((eq.health - 30) / rate)
                : null;
              const nextStateName = eq.health >= 90
                ? (lang === 'en' ? 'Worn' : lang === 'zh_TW' ? '磨損' : '磨损')
                : eq.health >= 60
                ? (lang === 'en' ? 'Damaged' : lang === 'zh_TW' ? '受損' : '受损')
                : eq.health >= 30
                ? (lang === 'en' ? 'Broken' : lang === 'zh_TW' ? '破損' : '破损')
                : null;

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
                      <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-visible">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${eq.health}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`h-full rounded-full ${
                            eq.health > 60 ? 'bg-amber-400' :
                            eq.health > 30 ? 'bg-rose-400' : 'bg-slate-400'
                          }`}
                        />
                        {/* State threshold markers */}
                        {[30, 60, 90].map(pct => (
                          <div
                            key={pct}
                            className="absolute top-0 bottom-0 w-px bg-slate-600/80"
                            style={{ left: `${pct}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-white/30">{eq.health}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {needsRepair && (
                        <span className={`text-[10px] ${colors.text}`}>+{bonus} XP</span>
                      )}
                      {daysUntilNext !== null && nextStateName && (
                        <span className={`text-[10px] ${daysUntilNext <= 1 ? 'text-rose-400' : daysUntilNext <= 3 ? 'text-amber-400' : 'text-white/20'}`}>
                          ~{daysUntilNext}d → {nextStateName}
                        </span>
                      )}
                    </div>
                  </div>

                  {needsRepair && (
                    <div className="flex items-center gap-1 shrink-0">
                      {onRepairWithItem && (
                        <button
                          onClick={() => { playTap(); onRepairWithItem(eq.missionId); }}
                          className="flex items-center gap-1 px-2 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold hover:bg-purple-500/30 transition-all"
                          title={lang === 'en' ? 'Use item from backpack' : lang === 'zh_TW' ? '使用背包道具' : '使用背包道具'}
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
