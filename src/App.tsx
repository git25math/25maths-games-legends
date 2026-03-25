import { useState, useEffect, useRef, Component } from 'react';
import 'katex/dist/katex.min.css';
import { AnimatePresence, motion } from 'motion/react';
import { Languages, LogOut, XCircle } from 'lucide-react';

import type { Language, Mission, GameState, DifficultyMode, KPEquipment } from './types';
import { computeRepairBonus } from './utils/equipment';
import { supabase } from './supabase';
import { recordErrors, getMissionErrorSummary, getMistakes as getMistakesMap } from './utils/errorMemory';
import { CHARACTERS } from './data/characters';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useMissions } from './hooks/useMissions';
import { useMultiplayer } from './hooks/useMultiplayer';

import { ScrollOfWisdom } from './components/ScrollOfWisdom';
import { MathBattle } from './components/MathBattle';
import { SkillCardSelector } from './components/SkillCardSelector';
import { generateMission } from './utils/generateMission';
import { MISSIONS as LOCAL_MISSIONS } from './data/missions';
import { getDailyKey, DAILY_MULTIPLIER } from './utils/dailyChallenge';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { GradeSelectScreen } from './screens/GradeSelectScreen';
import { MapScreen } from './screens/MapScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { OnboardingScreen, isOnboardingDone, clearOnboardingFlag } from './screens/OnboardingScreen';
import { cleanStalePracticeKeys, clearPracticeState } from './hooks/usePracticeState';
import { translations } from './i18n/translations';
import { getHotTopic } from './utils/hotTopic';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { getActiveSkillEffect } from './data/heroSkills';
import { STREAK_MILESTONES, getNewlyEarnedMilestone, getNextMilestone } from './data/streakMilestones';
import { BattleModeSelector } from './components/BattleModeSelector';
import { AchievementWallPanel } from './components/AchievementWallPanel';
import { PKSetupPanel } from './components/PKSetupPanel';
import { PKResultPanel } from './components/PKResultPanel';
import { getLevelInfo } from './utils/xpLevels';
import { getSeasonProgress, incrementTaskCount, evaluateAndUpdateTasks } from './utils/seasonTracker';
import { ExpeditionScreen } from './screens/ExpeditionScreen';
import { getExpeditionForGrade, getExpeditionsForGrade } from './data/expeditions';
import type { Expedition } from './data/expeditions';

// Clean up stale practice localStorage keys on startup
cleanStalePracticeKeys();

class ErrorBoundary extends Component<{ children: any }, { hasError: boolean; error: any }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center max-w-md">
            <XCircle size={64} className="text-rose-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">系统错误 / System Error</h2>
            <p className="text-slate-400 mb-8">出错了，请稍后再试。/ Something went wrong. Please try again.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all">
              刷新页面 / Refresh
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const LS_GUEST_KEY = 'gl_guest_profile';
const LS_STATE_KEY = 'gl_app_state';

type PersistedState = {
  gameState: GameState;
  charId: string | null;
  isGuest: boolean;
  missionId?: number | null; // for restoring practice/battle
};

function loadPersistedState(): PersistedState {
  try {
    const saved = localStorage.getItem(LS_STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  if (localStorage.getItem(LS_GUEST_KEY)) {
    return { gameState: 'map', charId: null, isGuest: true };
  }
  return { gameState: 'welcome', charId: null, isGuest: false };
}

function saveAppState(gameState: GameState, charId: string | null, isGuest: boolean, missionId?: number | null) {
  try {
    // Battle/onboarding/expedition can't be restored → save as map
    const safeState = (gameState === 'battle' || gameState === 'onboarding' || gameState === 'expedition' || gameState === 'leaderboard' || gameState === 'achievements' || gameState === 'pk_setup') ? 'map' : gameState;
    const safeMission = safeState === 'practice' ? missionId : null;
    localStorage.setItem(LS_STATE_KEY, JSON.stringify({ gameState: safeState, charId, isGuest, missionId: safeMission }));
  } catch { /* ignore */ }
}

export default function App() {
  const persisted = loadPersistedState();
  const [lang, setLang] = useState<Language>('zh');
  const [gameState, setGameState] = useState<GameState>(persisted.gameState);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(persisted.charId);
  const [activeMission, setActiveMission] = useState<Mission | null>(() => {
    // Restore mission from persisted ID (for practice mode refresh)
    if (persisted.missionId) {
      const found = LOCAL_MISSIONS.find(m => m.id === persisted.missionId);
      return found || null;
    }
    return null;
  });
  const [showSecret, setShowSecret] = useState(false);
  const [selectedSkillCard, setSelectedSkillCard] = useState<string | null>(null);
  const [showSkillCards, setShowSkillCards] = useState(false);
  const [showBattleModeSelector, setShowBattleModeSelector] = useState(false);
  const [selectedBattleMode, setSelectedBattleMode] = useState<import('./components/BattleModeSelector').BattleMode>('classic');
  const [selectedDifficulty] = useState<DifficultyMode>('red');
  const [isGuest, setIsGuest] = useState(persisted.isGuest);
  const [lastClearedMissionId, setLastClearedMissionId] = useState<number | null>(null);
  const [isDailyBattle, setIsDailyBattle] = useState(false);
  const [isRepairMode, setIsRepairMode] = useState(false);
  const [activeExpedition, setActiveExpedition] = useState<Expedition | null>(null);
  const [levelUpNotif, setLevelUpNotif] = useState<{ newLevel: number; rankName: string; spEarned: number } | null>(null);
  const [repairToast, setRepairToast] = useState<{ bonus: number } | null>(null);
  const [nearLevelToast, setNearLevelToast] = useState<{ xpNeeded: number; rankName: string } | null>(null);
  const [loginRewardNotif, setLoginRewardNotif] = useState<{ streak: number; xp: number; sp: number } | null>(null);
  const [showPKResult, setShowPKResult] = useState(false);
  const [pkBattleRoom, setPkBattleRoom] = useState<import('./types').Room | null>(null);

  // Refs to accumulate mid-battle updates that get merged into handleBattleComplete's single save
  const pendingSeasonTasksRef = useRef<string[]>([]);
  const pendingStreakTokensRef = useRef(0);
  const pendingErrorsRef = useRef<import('./utils/diagnoseError').ErrorType[]>([]);

  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const {
    profile, updateProfile, recordBattleComplete,
    getCharProgression, getTotalSP, unlockSkill, equipSkill,
  } = useProfile(user, isGuest);
  const { missions } = useMissions();
  const { activeRoom, createRoom, joinRoom, toggleReady, startGame, submitScore, finishRoom, leaveRoom } = useMultiplayer(user, profile);

  // Persist state across page refresh
  useEffect(() => {
    saveAppState(gameState, selectedCharId, isGuest, activeMission?.id);
  }, [gameState, selectedCharId, isGuest, activeMission?.id]);

  // If Supabase auth restored a session, jump to map
  useEffect(() => {
    if (user && gameState === 'welcome') {
      setGameState('map');
    }
  }, [user]);

  // PK: When non-host detects room status='playing' via realtime, auto-enter battle
  useEffect(() => {
    if (gameState === 'lobby' && activeRoom?.status === 'playing' && !activeMission) {
      const m = LOCAL_MISSIONS.find(mi => mi.id === activeRoom.missionId);
      if (m) {
        const battleMission = m.data?.generatorType ? generateMission(m) : m;
        setActiveMission(battleMission);
        setGameState('battle');
      }
    }
  }, [activeRoom?.status, gameState]);

  // If not logged in and stuck on a screen that requires auth, redirect to welcome
  useEffect(() => {
    if (!authLoading && !user && !isGuest && gameState !== 'welcome' && gameState !== 'dashboard') {
      setGameState('welcome');
    }
  }, [authLoading, user, isGuest, gameState]);

  // Login streak: check once when profile first loads
  useEffect(() => {
    if (!profile) return;
    // Use local date (consistent with dailyChallenge and seasonTracker)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const loginData = (profile.completed_missions as any)?._login as
      { lastDate: string; streak: number; bestStreak: number } | undefined;

    // Already checked today
    if (loginData?.lastDate === todayStr) return;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const prevStreak = loginData?.streak ?? 0;
    const newStreak = loginData?.lastDate === yesterdayStr ? prevStreak + 1 : 1;
    const bestStreak = Math.max(newStreak, loginData?.bestStreak ?? 0);

    // XP rewards: 7-day cycle repeats (Day 8 = Day 1 rewards, Day 14 = Day 7, etc.)
    const streakRewards: Record<number, number> = { 1: 20, 2: 20, 3: 50, 4: 50, 5: 50, 6: 50, 7: 150 };
    const cycleDay = ((newStreak - 1) % 7) + 1;
    let xp = streakRewards[cycleDay] ?? 50;
    let sp = cycleDay === 7 ? 1 : 0;

    const cm = { ...profile.completed_missions } as any;
    cm._login = { lastDate: todayStr, streak: newStreak, bestStreak };

    // Check streak milestones (14/21/30/60/100 days)
    const claimed = (cm._streak_milestones ?? []) as string[];
    const milestone = getNewlyEarnedMilestone(newStreak, claimed);
    if (milestone) {
      cm._streak_milestones = [...claimed, milestone.id];
      xp += milestone.xp;
      sp += milestone.sp;
    }

    // Merge SP into same write (avoid stale-profile race)
    if (sp > 0) {
      cm._total_skill_points = (cm._total_skill_points ?? 0) + sp;
    }

    (async () => {
      await updateProfile({ completed_missions: cm, total_score: profile.total_score + xp });
      setLoginRewardNotif({ streak: newStreak, xp, sp });
      setTimeout(() => setLoginRewardNotif(null), milestone ? 8000 : 5000);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.user_id]);

  const selectedChar = CHARACTERS.find(c => c.id === (selectedCharId || profile?.selected_char_id));
  const hotTopic = getHotTopic();

  const handleCharSelect = (id: string) => {
    setSelectedCharId(id);
    if (profile) updateProfile({ selected_char_id: id });
  };

  const handleMissionStart = (mission: Mission) => {
    // Challenge mode: skip difficulty selector, go straight to battle
    // Difficulty progression (Green→Amber→Red) is handled in Practice mode
    let battleMission = mission;
    if (mission.data?.generatorType) {
      battleMission = generateMission(mission);
      setActiveMission(battleMission);
      setSelectedSkillCard(null);
      // Show battle mode selector first, then skill cards
      setShowBattleModeSelector(true);
    } else {
      // Single-question: go directly to ScrollOfWisdom
      setActiveMission(battleMission);
      setShowSecret(true);
    }
  };

  const handleBattleModeSelect = (mode: import('./components/BattleModeSelector').BattleMode) => {
    setSelectedBattleMode(mode);
    setShowBattleModeSelector(false);
    setShowSkillCards(true);
  };

  const handleSkillCardSelect = (cardId: string) => {
    setSelectedSkillCard(cardId);
    setShowSkillCards(false);
    setShowSecret(true);
  };

  const handleDailyChallenge = (mission: Mission) => {
    setIsDailyBattle(true);
    handleMissionStart(mission);
  };

  // Don't updateProfile here — it would race with handleBattleComplete.
  // Instead, queue the increment and merge it in the single save.
  const handleStreakToken = () => {
    pendingStreakTokensRef.current += 1;
  };

  // Queue error types for the current battle/practice (merged on completion)
  const handleRecordError = (errorType: import('./utils/diagnoseError').ErrorType) => {
    pendingErrorsRef.current.push(errorType);
  };

  // Don't updateProfile here — it would race with handleBattleComplete.
  // Instead, queue the task ID and merge it in the single save.
  const handleStreakMilestone3 = () => {
    pendingSeasonTasksRef.current.push('daily_streak_3');
  };

  const handlePracticeStart = (mission: Mission) => {
    setActiveMission(mission);
    setGameState('practice');
  };

  /** Compute how many levels were gained (for merging SP into the caller's atomic write) */
  const computeLevelsGained = (prevScore: number, gainedXP: number) => {
    return getLevelInfo(prevScore + gainedXP).level - getLevelInfo(prevScore).level;
  };

  /** Show level-up / near-level notifications (NO writes — caller handles SP merge) */
  const showLevelUpNotifications = (prevScore: number, gainedXP: number, levelsGained: number) => {
    const newInfo = getLevelInfo(prevScore + gainedXP);
    if (levelsGained > 0) {
      const rankName = lang === 'en' ? newInfo.rank.en : lang === 'zh_TW' ? newInfo.rank.zh_TW : newInfo.rank.zh;
      setLevelUpNotif({ newLevel: newInfo.level, rankName, spEarned: levelsGained });
      setTimeout(() => setLevelUpNotif(null), 4000);
    } else if (newInfo.xpForNextLevel > 0) {
      const threshold = Math.ceil(newInfo.xpForNextLevel * 0.15);
      const xpNeeded = newInfo.xpForNextLevel - newInfo.currentXP;
      if (xpNeeded <= threshold && xpNeeded > 0) {
        const nextInfo = getLevelInfo(newInfo.totalXPForLevel + newInfo.xpForNextLevel);
        const nextRank = lang === 'en' ? nextInfo.rank.en : lang === 'zh_TW' ? nextInfo.rank.zh_TW : nextInfo.rank.zh;
        setNearLevelToast({ xpNeeded, rankName: nextRank });
        setTimeout(() => setNearLevelToast(null), 3500);
      }
    }
  };

  const handlePracticeEarnXP = async (xp: number) => {
    if (!profile || xp <= 0) return;
    const prevScore = profile.total_score;
    const levelsGained = computeLevelsGained(prevScore, xp);
    if (levelsGained > 0) {
      // Merge SP + score into single write
      const cm = { ...profile.completed_missions } as any;
      cm._total_skill_points = (cm._total_skill_points ?? 0) + levelsGained;
      await updateProfile({ total_score: prevScore + xp, completed_missions: cm });
    } else {
      await updateProfile({ total_score: prevScore + xp });
    }
    showLevelUpNotifications(prevScore, xp, levelsGained);
  };

  const handleBattleComplete = async (success: boolean, score = 0, durationSecs = 0, hpRemaining = 0) => {
    if (success && activeMission && profile) {
      const prevScore = profile.total_score;
      const isFirstClearBattle = !profile.completed_missions[String(activeMission.id)];

      // If daily challenge, inject daily key into completed_missions BEFORE
      // recordBattleComplete, which spreads profile.completed_missions internally.
      if (isDailyBattle) {
        (profile.completed_missions as Record<string, unknown>)[getDailyKey()] = true;
      }

      // Step 1: Insert battle record to DB + compute profile data (does NOT save)
      const battleData = await recordBattleComplete(
        activeMission.id,
        selectedDifficulty,
        success,
        score,
        durationSecs,
        hpRemaining,
        activeMission.topic,
        activeMission.kpId,
      );

      if (battleData) {
        const { completedMissions: cm, stats, newScore } = battleData;

        // Step 2: Merge equipment into the same completed_missions
        if (selectedDifficulty === 'red') {
          if (!cm._equipment) cm._equipment = {};
          const existing = cm._equipment[String(activeMission.id)];
          cm._equipment[String(activeMission.id)] = {
            missionId: activeMission.id,
            lastMasteredAt: Date.now(),
            repairCount: existing?.repairCount ?? 0,
          };
        }

        // Step 3: Merge season tasks into the same completed_missions
        let sp = getSeasonProgress(cm);
        sp = incrementTaskCount(sp, 'daily_battles_3');
        if (selectedDifficulty === 'red') {
          sp = incrementTaskCount(sp, 'weekly_red_3');
        }
        if (isFirstClearBattle) {
          sp = incrementTaskCount(sp, 'weekly_new_5');
        }
        // Drain any mid-battle season tasks (e.g., streak milestone)
        for (const taskId of pendingSeasonTasksRef.current) {
          sp = incrementTaskCount(sp, taskId);
        }
        const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
        cm._season = updatedProgress;

        // Drain pending streak tokens
        if (pendingStreakTokensRef.current > 0) {
          const cur = (cm._streak_tokens as number) || 0;
          cm._streak_tokens = cur + pendingStreakTokensRef.current;
        }

        // Step 4: Merge level-up SP into the same write
        const levelsGained = computeLevelsGained(prevScore, score);
        if (levelsGained > 0) {
          cm._total_skill_points = (cm._total_skill_points ?? 0) + levelsGained;
        }

        // Step 5: Merge pending errors into mistake memory
        if (pendingErrorsRef.current.length > 0) {
          cm._mistakes = recordErrors(
            (cm._mistakes ?? {}) as any,
            activeMission.id,
            pendingErrorsRef.current,
          );
        }

        // Step 6: Single atomic updateProfile call
        await updateProfile({ total_score: newScore, completed_missions: cm, stats });

        // Step 6: Notifications only (no writes)
        showLevelUpNotifications(prevScore, score, levelsGained);

        // Step 7: Bridge to shared play_kp_progress table (fire-and-forget)
        if (activeMission.kpId && user) {
          supabase.rpc('upsert_play_kp', {
            p_user_id: user.id, p_kp_id: activeMission.kpId,
            p_success: true, p_score: score,
          });
        }
      }

      setLastClearedMissionId(activeMission.id);
    }
    // Bridge failed attempts too (tracks attempts without incrementing wins)
    if (!success && activeMission?.kpId && user) {
      supabase.rpc('upsert_play_kp', {
        p_user_id: user.id, p_kp_id: activeMission.kpId,
        p_success: false, p_score: score,
      });
    }
    // Always drain pending refs (even on failure, so stale data doesn't leak to next battle)
    pendingSeasonTasksRef.current = [];
    pendingStreakTokensRef.current = 0;
    pendingErrorsRef.current = [];
    setIsDailyBattle(false);

    // PK mode: submit score and show result overlay
    if (activeRoom?.type === 'pk') {
      await submitScore(score);
      setPkBattleRoom({ ...activeRoom, players: { ...activeRoom.players, ...(user ? { [user.id]: { ...activeRoom.players[user.id], score } } : {}) } });
      setShowPKResult(true);
      setActiveMission(null);
      setGameState('map');
      return;
    }

    setGameState('map');
    setActiveMission(null);
  };

  const handleGuest = () => {
    setIsGuest(true);
    // Profile will be auto-loaded from localStorage by useProfile
  };

  const isLoggedIn = !!user || isGuest;
  const isAdmin = user?.email === 'zhuxingda86@hotmail.com';

  // Loading splash while auth initializes
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl animate-pulse">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p className="text-white/40 text-sm font-bold">{lang === 'zh' ? '25 数学三国' : lang === 'zh_TW' ? '25 數學三國' : '25 Math Legends'}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
        {/* Top controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'zh' ? 'zh_TW' : lang === 'zh_TW' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all"
          >
            <Languages size={18} />
            {lang === 'zh' ? '繁體' : lang === 'zh_TW' ? 'EN' : '简体'}
          </button>
          {(user || isGuest) && (
            <button
              onClick={() => {
                signOut();
                setIsGuest(false);
                setGameState('welcome');
                setActiveMission(null);
                setSelectedCharId(null);
                localStorage.removeItem(LS_STATE_KEY);
                localStorage.removeItem(LS_GUEST_KEY);
                clearOnboardingFlag();
              }}
              className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full hover:bg-rose-500/30 transition-all"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {showBattleModeSelector && (
            <BattleModeSelector lang={lang} onSelect={handleBattleModeSelect} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSkillCards && (
            <SkillCardSelector
              lang={lang}
              onSelect={handleSkillCardSelect}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSecret && activeMission && (
            <ScrollOfWisdom
              mission={activeMission}
              lang={lang}
              onClose={() => { setShowSecret(false); setGameState('battle'); }}
              errorHint={profile && activeMission
                ? getMissionErrorSummary(getMistakesMap(profile.completed_missions as Record<string, unknown>), activeMission.id)
                : null
              }
            />
          )}
        </AnimatePresence>

        {/* Version indicator */}
        <div className="fixed bottom-1 left-1 z-50 text-white/15 text-[9px] font-mono">v7.4.0</div>

        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                gameState === 'map'
                  ? (profile && !profile.grade ? 'grade' : 'map')
                  : gameState === 'onboarding' ? 'onboarding'
                  : gameState
              }
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full"
            >
              {gameState === 'welcome' && (
                <WelcomeScreen
                  lang={lang}
                  selectedCharId={selectedCharId}
                  onCharSelect={handleCharSelect}
                  onStart={() => setGameState('map')}
                  isLoggedIn={isLoggedIn}
                  onLogin={signIn}
                  onSignup={signUp}
                  onLogout={signOut}
                  onGuest={handleGuest}
                  onDashboard={isAdmin ? () => setGameState('dashboard') : undefined}
                />
              )}

              {gameState === 'map' && profile && !profile.grade && (
                <GradeSelectScreen
                  lang={lang}
                  onSelect={(g, cls) => {
                    updateProfile({ grade: g, ...(cls ? { class_name: cls, class_tags: [cls] } : {}) });
                    if (!isOnboardingDone()) {
                      setGameState('onboarding');
                    }
                  }}
                />
              )}

              {gameState === 'onboarding' && (
                <OnboardingScreen
                  lang={lang}
                  onComplete={() => setGameState('map')}
                />
              )}

              {gameState === 'map' && profile && profile.grade && (
                <MapScreen
                  lang={lang}
                  profile={profile}
                  missions={missions}
                  selectedChar={selectedChar}
                  onMissionStart={handleMissionStart}
                  onPracticeStart={handlePracticeStart}
                  onGradeChange={() => updateProfile({ grade: null })}
                  onCharChange={() => { setSelectedCharId(null); setGameState('welcome'); }}
                  onCreateRoom={createRoom}
                  onDashboard={isAdmin ? () => setGameState('dashboard') : undefined}
                  onDailyChallenge={handleDailyChallenge}
                  lastClearedMissionId={lastClearedMissionId}
                  clearLastClearedMission={() => setLastClearedMissionId(null)}
                  getCharProgression={getCharProgression}
                  getTotalSP={getTotalSP}
                  onUnlockSkill={unlockSkill}
                  onEquipSkill={equipSkill}
                  onStartExpedition={profile?.grade && getExpeditionsForGrade(profile.grade).length > 0 ? (expId: string) => {
                    const exp = getExpeditionsForGrade(profile.grade!).find(e => e.id === expId);
                    if (exp) { setActiveExpedition(exp); setGameState('expedition'); }
                  } : undefined}
                  onRepairEquipment={(missionId) => {
                    const m = missions.find(m => m.id === missionId);
                    if (m) {
                      setActiveMission(m);
                      setIsRepairMode(true);
                      setGameState('practice');
                    }
                  }}
                  hotTopicInfo={hotTopic}
                  onLeaderboard={() => setGameState('leaderboard')}
                  onAchievements={() => setGameState('achievements')}
                  onFriendPK={user ? () => setGameState('pk_setup') : undefined}
                />
              )}

              {gameState === 'lobby' && activeRoom && user && (
                <LobbyScreen
                  lang={lang}
                  room={activeRoom}
                  userId={user.id}
                  onReady={toggleReady}
                  onStart={() => {
                    startGame();
                    // Set activeMission from room's missionId so MathBattle can render
                    const m = LOCAL_MISSIONS.find(mi => mi.id === activeRoom.missionId);
                    if (m) {
                      const battleMission = m.data?.generatorType ? generateMission(m) : m;
                      setActiveMission(battleMission);
                    }
                    setGameState('battle');
                  }}
                  onLeave={() => { leaveRoom(); setGameState('map'); }}
                />
              )}

              {gameState === 'battle' && activeMission && selectedChar && (
                <MathBattle
                  mission={activeMission}
                  character={selectedChar}
                  onComplete={handleBattleComplete}
                  onCancel={() => { setIsDailyBattle(false); setGameState('map'); }}
                  lang={lang}
                  difficultyMode={selectedDifficulty}
                  isMultiplayer={!!activeRoom}
                  roomData={activeRoom}
                  skillCard={selectedSkillCard}
                  isFirstClear={activeMission ? !profile?.completed_missions[String(activeMission.id)] : true}
                  completedDifficulties={activeMission && profile ? profile.completed_missions[String(activeMission.id)] : {}}
                  isDailyChallenge={isDailyBattle}
                  dailyMultiplier={isDailyBattle ? DAILY_MULTIPLIER : 1}
                  hotTopicMultiplier={activeMission.topic === hotTopic.topic ? hotTopic.multiplier : 1}
                  onStreakToken={handleStreakToken}
                  onStreakMilestone3={handleStreakMilestone3}
                  onRecordError={handleRecordError}
                  battleMode={selectedBattleMode}
                  heroSkillEffect={selectedChar ? getActiveSkillEffect(getCharProgression(selectedChar.id)) : null}
                />
              )}

              {gameState === 'practice' && activeMission && selectedChar && (
                <PracticeScreen
                  mission={activeMission}
                  character={selectedChar}
                  lang={lang}
                  phaseCompletions={profile?.completed_missions[String(activeMission.id)] as any}
                  onEarnXP={handlePracticeEarnXP}
                  onRecordError={handleRecordError}
                  onComplete={async () => {
                    // Save practice completion — all 4 phases done (XP already awarded per-phase)
                    if (profile) {
                      const cm = { ...profile.completed_missions } as any;
                      const key = String(activeMission.id);
                      const isFirstClearPractice = !cm[key] || !Object.values(cm[key] || {}).some(Boolean);
                      cm[key] = { ...(cm[key] || {}), green: true, amber: true, red: true };
                      // Season tasks
                      let sp = getSeasonProgress(cm);
                      sp = incrementTaskCount(sp, 'daily_practice_1');
                      if (isFirstClearPractice) {
                        sp = incrementTaskCount(sp, 'weekly_new_5');
                      }
                      const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
                      cm._season = updatedProgress;
                      // Inline equipment marking (avoids a second stale-profile updateProfile call)
                      if (!cm._equipment) cm._equipment = {};
                      const existingEq = cm._equipment[String(activeMission.id)];
                      cm._equipment[String(activeMission.id)] = {
                        missionId: activeMission.id,
                        lastMasteredAt: Date.now(),
                        repairCount: existingEq?.repairCount ?? 0,
                      };
                      // Merge pending errors
                      if (pendingErrorsRef.current.length > 0) {
                        cm._mistakes = recordErrors(
                          (cm._mistakes ?? {}) as any,
                          activeMission.id,
                          pendingErrorsRef.current,
                        );
                      }
                      // Single atomic save
                      await updateProfile({ completed_missions: cm });
                      setLastClearedMissionId(activeMission.id);
                      // Bridge to shared play_kp_progress
                      if (activeMission.kpId && user) {
                        supabase.rpc('upsert_play_kp', {
                          p_user_id: user.id, p_kp_id: activeMission.kpId,
                          p_success: true, p_score: 0,
                        });
                      }
                    }
                    // Clear persisted practice state + error refs
                    pendingErrorsRef.current = [];
                    clearPracticeState(activeMission.id);
                    setIsRepairMode(false);
                    setGameState('map');
                    setActiveMission(null);
                  }}
                  onCancel={() => {
                    setIsRepairMode(false);
                    setGameState('map');
                    setActiveMission(null);
                  }}
                  repairMode={isRepairMode}
                  onRepairComplete={async () => {
                    // Inline repair + season into single updateProfile (avoids stale-profile race)
                    if (profile) {
                      const cm = { ...profile.completed_missions } as any;
                      const eq = cm._equipment?.[String(activeMission.id)] as KPEquipment | undefined;
                      const bonus = eq ? computeRepairBonus(eq.repairCount) : 0;
                      // Update equipment
                      if (eq) {
                        cm._equipment[String(activeMission.id)] = {
                          ...eq,
                          lastMasteredAt: Date.now(),
                          repairCount: eq.repairCount + 1,
                        };
                      }
                      // Season task: weekly_repair_1
                      let sp = getSeasonProgress(cm);
                      sp = incrementTaskCount(sp, 'weekly_repair_1');
                      const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
                      cm._season = updatedProgress;
                      await updateProfile({
                        completed_missions: cm,
                        total_score: profile.total_score + bonus,
                      });
                      setIsRepairMode(false);
                      setGameState('map');
                      setActiveMission(null);
                      if (bonus > 0) {
                        setRepairToast({ bonus });
                        setTimeout(() => setRepairToast(null), 3000);
                      }
                    } else {
                      setIsRepairMode(false);
                      setGameState('map');
                      setActiveMission(null);
                    }
                  }}
                />
              )}

              {gameState === 'expedition' && profile?.grade && selectedChar && activeExpedition && (() => {
                const saveExpeditionXP = async (xp: number, nodes: number) => {
                  if (profile && xp > 0) {
                    const cm = { ...profile.completed_missions } as any;
                    let sp = getSeasonProgress(cm);
                    for (let i = 0; i < nodes; i++) {
                      sp = incrementTaskCount(sp, 'daily_battles_3');
                    }
                    const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
                    cm._season = updatedProgress;
                    await updateProfile({ total_score: profile.total_score + xp, completed_missions: cm });
                  }
                };
                return (
                  <ExpeditionScreen
                    expedition={activeExpedition}
                    character={selectedChar}
                    lang={lang}
                    grade={profile.grade}
                    onSaveRun={saveExpeditionXP}
                    onComplete={async (xpEarned, nodesCleared) => {
                      await saveExpeditionXP(xpEarned, nodesCleared);
                      setActiveExpedition(null);
                      setGameState('map');
                    }}
                    onCancel={() => { setActiveExpedition(null); setGameState('map'); }}
                  />
                );
              })()}

              {gameState === 'dashboard' && (
                <DashboardScreen
                  lang={lang}
                  onClose={() => setGameState(isLoggedIn ? 'map' : 'welcome')}
                />
              )}

              {gameState === 'leaderboard' && profile && profile.grade && (
                <LeaderboardPanel
                  lang={lang}
                  grade={profile.grade}
                  currentUserId={profile.user_id}
                  classTags={profile.class_tags ?? undefined}
                  onClose={() => setGameState('map')}
                />
              )}

              {gameState === 'achievements' && profile && (
                <AchievementWallPanel
                  lang={lang}
                  profile={profile}
                  onClose={() => setGameState('map')}
                />
              )}

              {gameState === 'pk_setup' && profile && profile.grade && user && (
                <PKSetupPanel
                  lang={lang}
                  grade={profile.grade}
                  onCreateRoom={(missionId) => {
                    createRoom('pk', missionId);
                    setGameState('lobby');
                  }}
                  onJoinRoom={async (code) => {
                    const ok = await joinRoom(code);
                    if (ok) {
                      setGameState('lobby');
                    } else {
                      // Show inline error — PKSetupPanel handles via onJoinError
                      alert(lang === 'en' ? 'Room not found. Check the code and try again.' : '未找到房间，请检查代码后重试。');
                    }
                  }}
                  onClose={() => setGameState('map')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══ Login Streak Reward ═══ */}
        <AnimatePresence>
          {loginRewardNotif && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[95] pointer-events-auto text-center"
              onClick={() => setLoginRewardNotif(null)}
            >
              <div className="bg-gradient-to-br from-emerald-900/95 to-teal-900/95 backdrop-blur-xl border-2 border-emerald-400/40 rounded-3xl px-10 py-7 shadow-[0_0_50px_rgba(52,211,153,0.3)] max-w-xs mx-4">
                <div className="text-4xl mb-2">{loginRewardNotif.streak >= 30 ? '👑' : loginRewardNotif.streak >= 14 ? '🔥' : loginRewardNotif.streak >= 3 ? '⚡' : '🌅'}</div>
                <p className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-1">
                  {lang === 'en' ? `Day ${loginRewardNotif.streak} Streak!` : `连续登录第 ${loginRewardNotif.streak} 天！`}
                </p>
                <p className="text-white font-black text-xl mb-3">
                  +{loginRewardNotif.xp} XP
                  {loginRewardNotif.sp > 0 && <span className="text-purple-300 ml-2">+{loginRewardNotif.sp} SP</span>}
                </p>
                {loginRewardNotif.streak % 7 === 0 && (
                  <p className="text-yellow-300 text-xs font-bold mb-2">{lang === 'en' ? '🏆 Weekly streak bonus!' : '🏆 每周连登奖励！'}</p>
                )}
                {(() => {
                  const claimed = ((profile?.completed_missions as any)?._streak_milestones ?? []) as string[];
                  const earned = STREAK_MILESTONES.find(m => m.days === loginRewardNotif.streak);
                  const next = getNextMilestone(loginRewardNotif.streak, claimed);
                  return (
                    <>
                      {earned && claimed.includes(earned.id) && (
                        <p className="text-amber-300 text-xs font-black mb-2 animate-pulse">
                          🎖 {lang === 'en' ? earned.title.en : earned.title.zh}
                        </p>
                      )}
                      {next && (
                        <p className="text-white/30 text-[10px] mb-2">
                          {lang === 'en' ? `Next milestone: Day ${next.days} — ${next.title.en}` : `下个里程碑：第 ${next.days} 天 — ${next.title.zh}`}
                        </p>
                      )}
                    </>
                  );
                })()}
                <p className="text-white/20 text-[10px]">{lang === 'en' ? 'Tap to dismiss' : '点击关闭'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Near Level-Up Nudge Toast ═══ */}
        <AnimatePresence>
          {nearLevelToast && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 px-5 py-2.5 bg-yellow-500/90 backdrop-blur-md border border-yellow-400/50 rounded-2xl shadow-2xl pointer-events-none"
            >
              <span className="text-lg">⚡</span>
              <p className="text-slate-900 font-black text-sm">
                {lang === 'en'
                  ? `Only ${nearLevelToast.xpNeeded} XP to ${nearLevelToast.rankName}!`
                  : `再 ${nearLevelToast.xpNeeded} 分晋升${nearLevelToast.rankName}！`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Level-Up Celebration Overlay ═══ */}
        <AnimatePresence>
          {levelUpNotif && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.6, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: -20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="pointer-events-auto text-center bg-gradient-to-br from-amber-900/95 to-yellow-900/95 backdrop-blur-xl border-2 border-amber-400/50 rounded-3xl px-10 py-8 shadow-[0_0_60px_rgba(251,191,36,0.4)] max-w-xs mx-4"
                onClick={() => setLevelUpNotif(null)}
              >
                <motion.div
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl mb-3"
                >
                  ⭐
                </motion.div>
                <p className="text-amber-400 text-xs font-black tracking-[0.2em] uppercase mb-1">
                  {(translations[lang] as any).levelUpTitle ?? '晋升！'}
                </p>
                <p className="text-white font-black text-2xl mb-1">
                  Lv.{levelUpNotif.newLevel}
                </p>
                <p className="text-yellow-300 font-bold text-base mb-4">
                  {levelUpNotif.rankName}
                </p>
                {levelUpNotif.spEarned > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 400 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/30 border border-purple-400/40 rounded-full"
                  >
                    <span className="text-purple-300 font-black text-sm">
                      {(translations[lang] as any).levelUpSP ?? '+1 修炼点'}
                      {levelUpNotif.spEarned > 1 ? ` ×${levelUpNotif.spEarned}` : ''}
                    </span>
                  </motion.div>
                )}
                <p className="text-white/20 text-[10px] mt-4">{lang === 'en' ? 'Tap to dismiss' : '点击关闭'}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ PK Result Overlay ═══ */}
        <AnimatePresence>
          {showPKResult && pkBattleRoom && user && (
            <PKResultPanel
              lang={lang}
              room={pkBattleRoom}
              currentUserId={user.id}
              onClose={() => {
                setShowPKResult(false);
                setPkBattleRoom(null);
                leaveRoom();
              }}
            />
          )}
        </AnimatePresence>

        {/* ═══ Repair Success Toast ═══ */}
        <AnimatePresence>
          {repairToast && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-6 py-3 bg-amber-500/90 backdrop-blur-md border border-amber-400/50 rounded-2xl shadow-2xl pointer-events-none"
            >
              <span className="text-xl">🔧</span>
              <div>
                <p className="text-slate-900 font-black text-sm">
                  {(translations[lang] as any).repairSuccessXP ?? '装备修复完成'}
                </p>
                <p className="text-slate-900/70 font-bold text-xs">
                  +{repairToast.bonus} XP
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
