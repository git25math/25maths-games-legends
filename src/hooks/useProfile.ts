import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import type { UserProfile, CompletedMissions, DifficultyMode, BattleResult, CharacterProgression } from '../types';
import type { User } from '@supabase/supabase-js';
import { handleSupabaseError } from '../utils/errors';
import { getSkillById, defaultProgression } from '../data/heroSkills';

const DEFAULT_STATS = { Algebra: 0, Geometry: 0, Functions: 0, Calculus: 0, Statistics: 0 };
const GUEST_STORAGE_KEY = 'gl_guest_profile';

function loadGuestProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    user_id: 'guest',
    display_name: 'Guest',
    total_score: 0,
    grade: null,
    selected_char_id: '',
    completed_missions: {},
    stats: DEFAULT_STATS,
  };
}

function saveGuestProfile(profile: UserProfile) {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(profile));
  } catch { /* ignore */ }
}

export function useProfile(user: User | null, isGuest: boolean = false) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load profile
  useEffect(() => {
    if (isGuest) {
      setProfile(loadGuestProfile());
      return;
    }
    if (!user) { setProfile(null); return; }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('gl_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const newProfile: UserProfile = {
          user_id: user.id,
          display_name: user.user_metadata?.nickname || user.email?.split('@')[0] || 'Hero',
          total_score: 0,
          grade: null,
          selected_char_id: '',
          completed_missions: {},
          stats: DEFAULT_STATS,
        };
        const { error: insertErr } = await supabase.from('gl_user_progress').insert(newProfile);
        if (insertErr) handleSupabaseError(insertErr, 'create', 'gl_user_progress');
        setProfile(newProfile);
      } else if (error) {
        handleSupabaseError(error, 'get', 'gl_user_progress');
      } else {
        setProfile({
          ...data,
          completed_missions: data.completed_missions || {},
          stats: data.stats || DEFAULT_STATS,
        });
      }
    };

    loadProfile();
  }, [user?.id, isGuest]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (isGuest) {
      setProfile(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        saveGuestProfile(updated);
        return updated;
      });
      return;
    }
    if (!user) return;
    const { error } = await supabase
      .from('gl_user_progress')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    if (error) {
      handleSupabaseError(error, 'update', 'gl_user_progress');
    } else {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  /**
   * Record a battle result. Inserts to gl_battle_results.
   * Returns computed profile updates (completed_missions, stats, newScore) WITHOUT saving them,
   * so the caller can merge additional changes (season, equipment) into a single updateProfile call.
   */
  const recordBattleComplete = async (
    missionId: number,
    difficultyMode: DifficultyMode,
    success: boolean,
    score: number,
    durationSecs: number,
    hpRemaining: number,
    topic: string,
    kpId?: string,
  ): Promise<{ completedMissions: any; stats: typeof DEFAULT_STATS; newScore: number } | null> => {
    if (!profile) return null;

    // Record battle result (skip for guest)
    if (user && !isGuest) {
      const battleResult: BattleResult = {
        user_id: user.id,
        mission_id: missionId,
        kp_id: kpId,
        difficulty_mode: difficultyMode,
        success,
        score,
        duration_secs: durationSecs,
        hp_remaining: hpRemaining,
      };
      const { error: battleErr } = await supabase.from('gl_battle_results').insert(battleResult);
      if (battleErr) handleSupabaseError(battleErr, 'create', 'gl_battle_results');
    }

    if (success) {
      const newCompleted: CompletedMissions = { ...profile.completed_missions };
      if (!newCompleted[String(missionId)]) {
        newCompleted[String(missionId)] = { green: false, amber: false, red: false };
      }
      newCompleted[String(missionId)][difficultyMode] = true;

      const newStats = { ...profile.stats };
      const key = topic as keyof typeof newStats;
      if (key in newStats) newStats[key] += 1;

      // Track personal best per mission
      const cm = newCompleted as any;
      if (!cm._pb) cm._pb = {};
      if (score > (cm._pb[String(missionId)] ?? 0)) {
        cm._pb[String(missionId)] = score;
      }

      return { completedMissions: cm, stats: newStats, newScore: profile.total_score + score };
    }
    return null;
  };

  // --- v7.0: Skill Tree helpers ---

  const getCharProgression = useCallback((charId: string): CharacterProgression => {
    const progs = (profile?.completed_missions as any)?._char_progression as Record<string, CharacterProgression> | undefined;
    return progs?.[charId] ?? defaultProgression(charId);
  }, [profile]);

  const getTotalSP = useCallback((): { total: number; spent: number } => {
    const cm = profile?.completed_missions as any;
    return {
      total: cm?._total_skill_points ?? 0,
      spent: cm?._spent_skill_points ?? 0,
    };
  }, [profile]);

  const unlockSkill = async (charId: string, skillId: string) => {
    if (!profile) return false;
    const skill = getSkillById(skillId);
    if (!skill || skill.charId !== charId) return false;

    const { total, spent } = getTotalSP();
    const available = total - spent;
    if (available < skill.cost) return false;

    const prog = getCharProgression(charId);
    if (prog.unlocked_skills.includes(skillId)) return false;

    const cm = { ...profile.completed_missions } as any;
    if (!cm._char_progression) cm._char_progression = {};
    cm._char_progression[charId] = {
      ...prog,
      unlocked_skills: [...prog.unlocked_skills, skillId],
      active_skill: prog.active_skill ?? skillId, // auto-equip first skill
    };
    cm._spent_skill_points = spent + skill.cost;

    await updateProfile({ completed_missions: cm });
    return true;
  };

  const equipSkill = async (charId: string, skillId: string | null) => {
    if (!profile) return;
    const prog = getCharProgression(charId);
    if (skillId && !prog.unlocked_skills.includes(skillId)) return;

    const cm = { ...profile.completed_missions } as any;
    if (!cm._char_progression) cm._char_progression = {};
    cm._char_progression[charId] = { ...prog, active_skill: skillId };
    await updateProfile({ completed_missions: cm });
  };

  const grantSkillPoint = async (count = 1) => {
    if (!profile || count <= 0) return;
    const cm = { ...profile.completed_missions } as any;
    cm._total_skill_points = (cm._total_skill_points ?? 0) + count;
    await updateProfile({ completed_missions: cm });
  };

  return {
    profile, updateProfile, recordBattleComplete,
    // Skill tree
    getCharProgression, getTotalSP, unlockSkill, equipSkill, grantSkillPoint,
  };
}
