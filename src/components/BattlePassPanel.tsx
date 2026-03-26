import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Check, Lock, Gift, Flame, Swords, Shield, Palette } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { SEASON_1_TASKS, SEASON_1_REWARDS, getSeasonLevel, type SeasonTask } from '../data/seasons/season1';
import { getSeasonProgress, getTaskStatus, type SeasonProgress } from '../utils/seasonTracker';
import { useAudio } from '../audio';
import { useEscapeKey } from '../hooks/useEscapeKey';

const FREQ_ICONS: Record<string, typeof Star> = { daily: Flame, weekly: Swords, milestone: Star };
const FREQ_COLORS: Record<string, string> = {
  daily: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  weekly: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
  milestone: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
};

export const BattlePassPanel = ({
  lang,
  completedMissions,
  onClose,
}: {
  lang: Language;
  completedMissions: Record<string, unknown>;
  onClose: () => void;
}) => {
  const t = translations[lang];
  const { playTap } = useAudio();
  useEscapeKey(onClose);
  const [tab, setTab] = useState<'tasks' | 'rewards'>('tasks');

  const progress = getSeasonProgress(completedMissions);
  const { level, progress: levelProgress, xpInLevel, xpForLevel } = getSeasonLevel(progress.season_xp);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-white">
              {(t as any).growthHandbook ?? 'Growth Handbook'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-amber-400 font-black text-sm">Lv.{level}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[100px]">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all" style={{ width: `${levelProgress * 100}%` }} />
              </div>
              <span className="text-[10px] text-amber-400/70 font-bold">{xpInLevel}/{xpForLevel}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['tasks', 'rewards'] as const).map(tabId => (
            <button
              key={tabId}
              onClick={() => { playTap(); setTab(tabId); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === tabId ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {tabId === 'tasks' ? ((t as any).tasks ?? 'Tasks') : ((t as any).rewards ?? 'Rewards')}
            </button>
          ))}
        </div>

        {/* Tasks tab */}
        {tab === 'tasks' && (
          <div className="flex flex-col gap-2">
            {(['daily', 'weekly', 'milestone'] as const).map(freq => {
              const tasks = SEASON_1_TASKS.filter(t => t.frequency === freq);
              return (
                <div key={freq}>
                  <div className="text-[10px] font-bold uppercase text-white/30 mb-1 tracking-wider">
                    {freq === 'daily' ? ((translations[lang] as any).freqDaily ?? 'Daily') : freq === 'weekly' ? ((translations[lang] as any).freqWeekly ?? 'Weekly') : ((translations[lang] as any).freqMilestone ?? 'Milestone')}
                  </div>
                  {tasks.map(task => {
                    const status = getTaskStatus(task, progress);
                    const Icon = FREQ_ICONS[freq];
                    const colorClass = FREQ_COLORS[freq];
                    return (
                      <div key={task.id} className={`rounded-xl border p-3 mb-1.5 flex items-center gap-3 ${status.completed ? 'border-emerald-500/30 bg-emerald-500/5' : `${colorClass}`}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${status.completed ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                          {status.completed ? <Check size={16} className="text-emerald-400" /> : <Icon size={16} className={colorClass.split(' ')[0]} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs font-bold truncate">{lt(task.name, lang)}</div>
                          <div className="text-white/40 text-[10px] truncate">{lt(task.description, lang)}</div>
                          {!status.completed && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(status.current / status.target) * 100}%` }} />
                              </div>
                              <span className="text-[9px] text-white/30 font-bold">{status.current}/{status.target}</span>
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold shrink-0 ${status.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {status.completed ? '✓' : `+${task.seasonXP}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Rewards tab */}
        {tab === 'rewards' && (
          <div className="flex flex-col gap-1">
            {SEASON_1_REWARDS.map(r => {
              const unlocked = level >= r.level;
              const isCurrent = level === r.level - 1;
              return (
                <div key={r.level} className={`rounded-lg border p-2.5 flex items-center gap-3 ${
                  unlocked ? 'border-amber-400/30 bg-amber-400/5' : isCurrent ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/[0.02] opacity-50'
                }`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                    unlocked ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-white/30'
                  }`}>
                    {unlocked ? <Check size={14} /> : r.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-bold truncate">{lt(r.reward.name, lang)}</div>
                  </div>
                  <div className="shrink-0">
                    {r.reward.type === 'skill_point' && <Shield size={14} className="text-purple-400" />}
                    {r.reward.type === 'xp_boost' && <Star size={14} className="text-yellow-400" />}
                    {r.reward.type === 'title' && <Gift size={14} className="text-indigo-400" />}
                    {r.reward.type === 'border' && <Palette size={14} className="text-pink-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
