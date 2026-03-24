import { motion } from 'motion/react';
import { X, Wrench } from 'lucide-react';
import type { Language, Mission, EquipmentState, KPEquipment } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { getEquipmentList, computeRepairBonus, EQUIPMENT_COLORS } from '../utils/equipment';
import { EquipmentBadge } from './EquipmentBadge';
import { useAudio } from '../audio';

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
  onClose,
}: {
  lang: Language;
  completedMissions: Record<string, unknown>;
  missions: Mission[];
  onRepair: (missionId: number) => void;
  onClose: () => void;
}) => {
  const t = translations[lang];
  const { playTap } = useAudio();
  const equipment = getEquipmentList(completedMissions);

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
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
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
                    <div className={`text-xs ${colors.text}`}>
                      {lt(label, lang)}
                      {needsRepair && ` · +${bonus} XP`}
                    </div>
                  </div>

                  {needsRepair && (
                    <button
                      onClick={() => { playTap(); onRepair(eq.missionId); }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30 transition-all shrink-0"
                    >
                      <Wrench size={14} />
                      {(t as any).repair ?? '修复'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
