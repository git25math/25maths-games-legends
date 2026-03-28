import { SEASON_1_ID, SEASON_1_TASKS, SEASON_1_REWARDS, type SeasonTask, type SeasonReward, type TaskFrequency } from '../data/seasons/season1';
import { SEASON_2_ID, SEASON_2_TASKS, SEASON_2_REWARDS } from '../data/seasons/season2';
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

/* ── Season registry ── */

type SeasonConfig = { id: string; tasks: SeasonTask[]; rewards: SeasonReward[] };

const SEASONS: SeasonConfig[] = [
  { id: SEASON_1_ID, tasks: SEASON_1_TASKS, rewards: SEASON_1_REWARDS },
  { id: SEASON_2_ID, tasks: SEASON_2_TASKS, rewards: SEASON_2_REWARDS },
];

/** Active season — change this single line to switch seasons */
const ACTIVE_SEASON: SeasonConfig = SEASONS[0];

/** Get the active season's tasks */
export function getActiveSeasonTasks(): SeasonTask[] {
  return ACTIVE_SEASON.tasks;
}

/** Get the active season's ID */
export function getActiveSeasonId(): string {
  return ACTIVE_SEASON.id;
}

/** Get the active season's rewards */
export function getActiveSeasonRewards(): SeasonReward[] {
  return ACTIVE_SEASON.rewards;
}

/* ── Helpers ── */

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
  const tasks = ACTIVE_SEASON.tasks;
  const prog: SeasonProgress = raw ?? {
    season_id: ACTIVE_SEASON.id,
    season_xp: 0,
    task_counts: {},
    completed_tasks: [],
    daily_reset: today(),
    weekly_reset: thisMonday(),
  };

  // If player has progress from a different season, reset for current season
  if (prog.season_id !== ACTIVE_SEASON.id) {
    prog.season_id = ACTIVE_SEASON.id;
    prog.season_xp = 0;
    prog.task_counts = {};
    prog.completed_tasks = [];
    prog.daily_reset = today();
    prog.weekly_reset = thisMonday();
  }

  // Auto-reset daily tasks
  const todayStr = today();
  if (prog.daily_reset !== todayStr) {
    const dailyIds = new Set(tasks.filter(t => t.frequency === 'daily').map(t => t.id));
    dailyIds.forEach(id => delete prog.task_counts[id]);
    prog.completed_tasks = prog.completed_tasks.filter(id => !dailyIds.has(id));
    prog.daily_reset = todayStr;
  }

  // Auto-reset weekly tasks
  const mondayStr = thisMonday();
  if (prog.weekly_reset !== mondayStr) {
    const weeklyIds = new Set(tasks.filter(t => t.frequency === 'weekly').map(t => t.id));
    weeklyIds.forEach(id => delete prog.task_counts[id]);
    prog.completed_tasks = prog.completed_tasks.filter(id => !weeklyIds.has(id));
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
  const tasks = ACTIVE_SEASON.tasks;

  const cm = profile.completed_missions as Record<string, any>;
  const totalMissions = Object.keys(cm).filter(k => !k.startsWith('_') && !k.startsWith('daily_')).length;
  const levelInfo = getLevelInfo(profile.total_score);
  const totalSkills = Object.values((cm._char_progression ?? {}) as Record<string, any>)
    .reduce((sum: number, p: any) => sum + (p.unlocked_skills?.length ?? 0), 0);
  const totalRepairs = Object.values((cm._equipment ?? {}) as Record<string, any>)
    .reduce((sum: number, eq: any) => sum + (eq.repairCount ?? 0), 0);

  for (const task of tasks) {
    if (updated.completed_tasks.includes(task.id)) continue;

    // Evaluate milestone tasks from profile data
    let currentCount = updated.task_counts[task.id] ?? 0;

    if (task.frequency === 'milestone') {
      // S1 milestones
      switch (task.id) {
        case 'milestone_level_10': currentCount = levelInfo.level; break;
        case 'milestone_missions_50': currentCount = totalMissions; break;
        case 'milestone_skill_3': currentCount = totalSkills; break;
        case 'milestone_repair_5': currentCount = totalRepairs; break;
      }
      // S2 milestones
      switch (task.id) {
        case 's2_milestone_level_20': currentCount = levelInfo.level; break;
        case 's2_milestone_missions_100': currentCount = totalMissions; break;
        case 's2_milestone_repair_10': currentCount = totalRepairs; break;
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

/** Increment a daily/weekly task counter (call after relevant action).
 *  Returns the updated progress and whether THIS call caused the task to complete. */
export function incrementTaskCount(
  progress: SeasonProgress,
  taskId: string,
): { updatedProgress: SeasonProgress; justCompleted: boolean } {
  const tasks = ACTIVE_SEASON.tasks;
  const task = tasks.find(t => t.id === taskId);
  if (!task || progress.completed_tasks.includes(taskId)) {
    return { updatedProgress: progress, justCompleted: false };
  }

  const updated = { ...progress, task_counts: { ...progress.task_counts }, completed_tasks: [...progress.completed_tasks] };
  const newCount = (updated.task_counts[taskId] ?? 0) + 1;
  updated.task_counts[taskId] = newCount;

  let justCompleted = false;
  if (newCount >= task.target) {
    updated.completed_tasks.push(taskId);
    updated.season_xp += task.seasonXP;
    justCompleted = true;
  }

  return { updatedProgress: updated, justCompleted };
}

/** Returns true if the given task ID belongs to a daily-reset task */
export function isDailyTask(taskId: string): boolean {
  return ACTIVE_SEASON.tasks.find(t => t.id === taskId)?.frequency === 'daily';
}
