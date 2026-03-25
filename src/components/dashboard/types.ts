import type { CompletedMissions, Mission } from '../../types';

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
