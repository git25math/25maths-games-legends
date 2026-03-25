import { motion } from 'motion/react';
import { X, Lock, Check, Zap } from 'lucide-react';
import type { Language, CharacterProgression } from '../types';
import { getCharSkills, getSkillById } from '../data/heroSkills';
import { lt } from '../i18n/resolveText';
import { translations } from '../i18n/translations';
import { useAudio } from '../audio';

export const SkillTreePanel = ({
  lang,
  charId,
  charName,
  progression,
  availableSP,
  onUnlock,
  onEquip,
  onClose,
}: {
  lang: Language;
  charId: string;
  charName: string;
  progression: CharacterProgression;
  availableSP: number;
  onUnlock: (skillId: string) => void;
  onEquip: (skillId: string | null) => void;
  onClose: () => void;
}) => {
  const t = translations[lang];
  const skills = getCharSkills(charId);
  const { playTap, playBadgeUnlock } = useAudio();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white">{charName}</h2>
            <p className="text-amber-400 text-sm font-bold">
              {(t as any).skillPointsAvailable ?? '修炼点'}: {availableSP}
            </p>
            <p className="text-white/30 text-[10px] mt-0.5">
              {(t as any).spSourceHint ?? '每升一级 +1 修炼点'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Skill nodes */}
        <div className="flex flex-col gap-3">
          {skills.map((skill, idx) => {
            const isUnlocked = progression.unlocked_skills.includes(skill.id);
            const isEquipped = progression.active_skill === skill.id;
            const canAfford = availableSP >= skill.cost;
            const prevUnlocked = idx === 0 || progression.unlocked_skills.includes(skills[idx - 1].id);

            return (
              <div key={skill.id} className="relative">
                {/* Connecting line */}
                {idx > 0 && (
                  <div className={`absolute -top-3 left-1/2 w-0.5 h-3 ${
                    isUnlocked ? 'bg-amber-400/60' : 'bg-white/10'
                  }`} />
                )}

                <div className={`rounded-2xl border p-4 transition-all ${
                  isEquipped
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20'
                    : isUnlocked
                    ? 'border-indigo-400/40 bg-indigo-400/5'
                    : 'border-white/10 bg-white/5 opacity-70'
                }`}>
                  <div className="flex items-start gap-3">
                    {/* Tier badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-black ${
                      isEquipped ? 'bg-amber-400 text-slate-900'
                      : isUnlocked ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white/40'
                    }`}>
                      {isUnlocked ? <Check size={18} /> : <Lock size={16} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">
                          {lt(skill.name, lang)}
                        </span>
                        <span className="text-xs text-white/30">Tier {skill.tier}</span>
                        {isEquipped && (
                          <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                            {(t as any).equipped ?? '已装备'}
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mt-1">
                        {lt(skill.description, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex gap-2">
                    {!isUnlocked && prevUnlocked && (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            playBadgeUnlock();
                            onUnlock(skill.id);
                          }
                        }}
                        disabled={!canAfford}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-amber-500 text-white hover:bg-amber-400'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={14} />
                        {(t as any).unlockSkill ?? '解锁'} ({skill.cost} SP)
                      </button>
                    )}
                    {isUnlocked && !isEquipped && (
                      <button
                        onClick={() => { playTap(); onEquip(skill.id); }}
                        className="px-4 py-2 bg-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-500/50 transition-all"
                      >
                        {(t as any).equipSkill ?? '装备'}
                      </button>
                    )}
                    {isEquipped && (
                      <button
                        onClick={() => { playTap(); onEquip(null); }}
                        className="px-4 py-2 bg-white/5 text-white/30 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                      >
                        {(t as any).unequipSkill ?? '卸下'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
