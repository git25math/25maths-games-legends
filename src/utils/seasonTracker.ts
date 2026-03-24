import { SEASON_1_ID, SEASON_1_TASKS, type SeasonTask, type TaskFrequency } from '../data/seasons/season1';
import type { UserProfile } from '../types';
import { getLevelInfo } from './xpLevels';

export type SeasonProgress = {
  season_id: string;
  season_xp: number;
  task_counts: Record<string, number>; // task_id → current progress count
  completed_tasks: string[];           // task IDs fully completed this period
  daily_reset: string;                 // YYYYMMDD
  weekly_reset: string;                // YYYYMMDD (Monday)
};

const LS_KEY = '_season';

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function thisMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return `${mon.getFullYear()}${String(mon.getMonth() + 1).padStart(2, '0')}${String(mon.getDate()).padStart(2, '0')}`;
}

/** Get or initialize season progress from profile */
export function getSeasonProgress(completedMissions: Record<string, unknown>): SeasonProgress {
  const raw = (completedMissions as any)?.[LS_KEY] as SeasonProgress | undefined;
  const prog: SeasonProgress = raw ?? {
    season_id: SEASON_1_ID,
    season_xp: 0,
    task_counts: {},
    completed_tasks: [],
    daily_reset: today(),
    weekly_reset: thisMonday(),
  };

  // Auto-reset daily tasks
  const todayStr = today();
  if (prog.daily_reset !== todayStr) {
    SEASON_1_TASKS.filter(t => t.frequency === 'daily').forEach(t => {
      delete prog.task_counts[t.id];
      prog.completed_tasks = prog.completed_tasks.filter(id => !id.startsWith('daily_'));
    });
    prog.daily_reset = todayStr;
  }

  // Auto-reset weekly tasks
  const mondayStr = thisMonday();
  if (prog.weekly_reset !== mondayStr) {
    SEASON_1_TASKS.filter(t => t.frequency === 'weekly').forEach(t => {
      delete prog.task_counts[t.id];
      prog.completed_tasks = prog.completed_tasks.filter(id => !id.startsWith('weekly_'));
    });
    prog.weekly_reset = mondayStr;
  }

  return prog;
}

/** Check task status for display */
export function getTaskStatus(task: SeasonTask, progress: SeasonProgress): {
  current: number;
  target: number;
  completed: boolean;
} {
  const completed = progress.completed_tasks.includes(task.id);
  const current = completed ? task.target : (progress.task_counts[task.id] ?? 0);
  return { current, target: task.target, completed };
}

/** Evaluate all tasks against current profile and return XP earned + updated progress */
export function evaluateAndUpdateTasks(
  profile: UserProfile,
  progress: SeasonProgress,
): { updatedProgress: SeasonProgress; xpEarned: number } {
  let xpEarned = 0;
  const updated = { ...progress, task_counts: { ...progress.task_counts }, completed_tasks: [...progress.completed_tasks] };

  const cm = profile.completed_missions as Record<string, any>;
  const totalMissions = Object.keys(cm).filter(k => !k.startsWith('_') && !k.startsWith('daily_')).length;
  const levelInfo = getLevelInfo(profile.total_score);
  const totalSkills = Object.values((cm._char_progression ?? {}) as Record<string, any>)
    .reduce((sum: number, p: any) => sum + (p.unlocked_skills?.length ?? 0), 0);
  const totalRepairs = Object.values((cm._equipment ?? {}) as Record<string, any>)
    .reduce((sum: number, eq: any) => sum + (eq.repairCount ?? 0), 0);

  for (const task of SEASON_1_TASKS) {
    if (updated.completed_tasks.includes(task.id)) continue;

    // Evaluate milestone tasks from profile data
    let currentCount = updated.task_counts[task.id] ?? 0;

    if (task.frequency === 'milestone') {
      switch (task.id) {
        case 'milestone_level_10': currentCount = levelInfo.level; break;
        case 'milestone_missions_50': currentCount = totalMissions; break;
        case 'milestone_skill_3': currentCount = totalSkills; break;
        case 'milestone_repair_5': currentCount = totalRepairs; break;
      }
      updated.task_counts[task.id] = currentCount;
    }

    if (currentCount >= task.target) {
      updated.completed_tasks.push(task.id);
      xpEarned += task.seasonXP;
    }
  }

  updated.season_xp = progress.season_xp + xpEarned;
  return { updatedProgress: updated, xpEarned };
}

/** Increment a daily/weekly task counter (call after relevant action) */
export function incrementTaskCount(progress: SeasonProgress, taskId: string): SeasonProgress {
  const task = SEASON_1_TASKS.find(t => t.id === taskId);
  if (!task || progress.completed_tasks.includes(taskId)) return progress;

  const updated = { ...progress, task_counts: { ...progress.task_counts }, completed_tasks: [...progress.completed_tasks] };
  const newCount = (updated.task_counts[taskId] ?? 0) + 1;
  updated.task_counts[taskId] = newCount;

  if (newCount >= task.target) {
    updated.completed_tasks.push(taskId);
    updated.season_xp += task.seasonXP;
  }

  return updated;
}
