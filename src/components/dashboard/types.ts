import type { CompletedMissions, Mission } from '../../types';

/** Count green-completed missions for a student across all units */
export function countGreenMissions(cm: CompletedMissions, units: UnitEntry[]): number {
  let done = 0;
  for (const [, u] of units) {
    for (const m of u.missions) {
      if ((cm as any)?.[String(m.id)]?.green) done++;
    }
  }
  return done;
}

export type StudentRow = {
  user_id: string;
  display_name: string;
  class_name: string | null;
  class_tags: string[];
  total_score: number;
  completed_missions: CompletedMissions;
  updated_at: string;
  grade?: number;
};

export type AlertLevel = 'warning' | 'critical';

export type StudentAlert = {
  userId: string;
  name: string;
  level: AlertLevel;
  reason: string;
  reasonEn: string;
};

export type UnitEntry = [number, { title: string; missions: Mission[] }];

/** Shared KP progress row type — used by KPHeatmap, KPWeaknessPanel, StudentDetailCard */
export type KPProgressRow = {
  user_id: string;
  display_name?: string;
  kp_id: string;
  wins: number;
  attempts: number;
  mastered_at: string | null;
};
