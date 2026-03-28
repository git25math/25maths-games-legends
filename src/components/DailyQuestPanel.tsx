import { motion } from 'motion/react';
import { Scroll, CheckCircle2, ChevronRight, Flame } from 'lucide-react';
import type { Language, Mission } from '../types';
import { getSeasonProgress, getTaskStatus, isDailyTask, getActiveSeasonTasks } from '../utils/seasonTracker';
import { CURRENCY_REWARDS } from '../utils/currency';
import { lt } from '../i18n/resolveText';

const LABELS = {
  zh: { title: '今日军令', allDone: '全部完成！', bonus: '额外赛季经验已领取', start: '一键开始', xp: '赛季经验', battle: '去闯关', practice: '去练习' },
  zh_TW: { title: '今日軍令', allDone: '全部完成！', bonus: '額外賽季經驗已領取', start: '一鍵開始', xp: '賽季經驗', battle: '去闖關', practice: '去練習' },
  en: { title: "Today's Orders", allDone: 'All Complete!', bonus: 'Bonus season XP claimed', start: 'Quick Start', xp: 'Season XP', battle: 'Battle', practice: 'Practice' },
};

/** Task IDs that require battle mode navigation */
const BATTLE_TASK_IDS = new Set(['daily_battles_3', 'daily_streak_3']);

export const DailyQuestPanel = ({
  lang,
  completedMissions,
  onSmartStart,
  onBattleStart,
  recommendedMission,
  isWeakRecommendation = false,
}: {
  lang: Language;
  completedMissions: Record<string, unknown>;
  onSmartStart: (mission: Mission) => void;
  onBattleStart?: (mission: Mission) => void;
  recommendedMission: Mission | null;
  isWeakRecommendation?: boolean;
}) => {
  const l = LABELS[lang];
  const progress = getSeasonProgress(completedMissions);
  const dailyTasks = getActiveSeasonTasks().filter(t => t.frequency === 'daily');
  const statuses = dailyTasks.map(t => getTaskStatus(t, progress));
  const completedCount = statuses.filter(s => s.completed).length;
  const allComplete = completedCount === dailyTasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-rose-950/40 to-amber-950/40 p-4 md:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scroll size={16} className="text-amber-400" />
          <h3 className="text-white font-black text-sm">{l.title}</h3>
        </div>
        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
          allComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'
        }`}>
          {completedCount}/{dailyTasks.length}
        </span>
      </div>

      {/* Task rows */}
      <div className="space-y-2">
        {dailyTasks.map((task, i) => {
          const s = statuses[i];
          const pct = Math.min(100, (s.current / s.target) * 100);
          const isBattleTask = BATTLE_TASK_IDS.has(task.id);
          const canQuickStart = !s.completed && recommendedMission && (isBattleTask ? !!onBattleStart : true);
          return (
            <div key={task.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${s.completed ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
              {s.completed
                ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                : <Flame size={16} className="text-amber-400/60 shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${s.completed ? 'text-emerald-300 line-through opacity-60' : 'text-white/80'}`}>
                  {lt(task.name, lang)}
                </p>
                {!s.completed && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 font-bold shrink-0">{s.current}/{s.target}</span>
                  </div>
                )}
              </div>
              {canQuickStart ? (
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <button
                    onClick={() => isBattleTask ? onBattleStart!(recommendedMission!) : onSmartStart(recommendedMission!)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors ${
                      isBattleTask
                        ? 'bg-rose-600/30 border border-rose-500/30 text-rose-300 hover:bg-rose-600/50'
                        : 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/50'
                    }`}
                  >
                    {isBattleTask ? l.battle : l.practice} →
                  </button>
                  {isDailyTask(task.id) && (
                    <span className="text-[9px] text-emerald-400/60">🍚 +{CURRENCY_REWARDS.DAILY_TASK}</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className={`text-[10px] font-black ${s.completed ? 'text-emerald-400' : 'text-amber-400/50'}`}>
                    +{task.seasonXP} {l.xp}
                  </span>
                  {isDailyTask(task.id) && (
                    <span className={`text-[9px] ${s.completed ? 'text-emerald-400/50 line-through' : 'text-emerald-400/60'}`}>🍚 +{CURRENCY_REWARDS.DAILY_TASK}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: all-done celebration or smart start */}
      {allComplete ? (
        <div className="mt-3 text-center">
          <p className="text-emerald-400 text-xs font-black">{l.allDone}</p>
        </div>
      ) : recommendedMission ? (
        <button
          onClick={() => onSmartStart(recommendedMission)}
          className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-colors min-h-[44px] ${
            isWeakRecommendation
              ? 'bg-rose-500/20 border border-rose-400/30 text-rose-300 hover:bg-rose-500/30'
              : 'bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30'
          }`}
        >
          {isWeakRecommendation
            ? lt({ zh: '复习薄弱点：', en: 'Review weak spot: ' }, lang)
            : `${l.start}: `}{lt(recommendedMission.title, lang)}
          <ChevronRight size={14} />
        </button>
      ) : null}
    </motion.div>
  );
};
