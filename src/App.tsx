import { useState, useEffect, useRef, useMemo, Component, Suspense, lazy } from 'react';
import 'katex/dist/katex.min.css';
import { AnimatePresence, motion } from 'motion/react';
import { Languages, LogOut, XCircle } from 'lucide-react';

import type { Language, Mission, GameState, DifficultyMode, KPEquipment } from './types';
import { computeRepairBonus } from './utils/equipment';
import { supabase } from './supabase';
import { recordErrors, getMissionErrorSummary, getMistakes as getMistakesMap, getDominantPattern } from './utils/errorMemory';
import { CHARACTERS } from './data/characters';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useMissions } from './hooks/useMissions';
import { useMultiplayer, PK_COUNTDOWN_SECS, getFirstFinishTime, getFirstOpponentFinishTime } from './hooks/useMultiplayer';
import { useNotifications } from './hooks/useNotifications';
import { useLiveSession } from './hooks/useLiveSession';
import { LiveSessionBanner } from './components/LiveSessionBanner';

// generateMission is loaded lazily via dynamic import() to keep it out of the
// critical path (352 KB generators chunk deferred until first use).
const lazyGenerate = () => import('./utils/generateMission').then(m => m.generateMission);
const loadProcessAttemptUtils = () => import('./utils/processAttempt');
import { getDailyKey, DAILY_MULTIPLIER } from './utils/dailyChallenge';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { GradeSelectScreen } from './screens/GradeSelectScreen';
import { OnboardingScreen, isOnboardingDone, clearOnboardingFlag } from './screens/OnboardingScreen';
import { cleanStalePracticeKeys, clearPracticeState } from './hooks/usePracticeState';
import { translations } from './i18n/translations';
import { getHotTopic } from './utils/hotTopic';
import { getKnIdForKp } from './data/curriculum/kp-registry';
import { getActiveSkillEffect } from './data/heroSkills';
import { STREAK_MILESTONES, getNewlyEarnedMilestone, getNextMilestone } from './data/streakMilestones';
const ScrollOfWisdom = lazy(() => import('./components/ScrollOfWisdom').then(m => ({ default: m.ScrollOfWisdom })));
const SkillCardSelector = lazy(() => import('./components/SkillCardSelector').then(m => ({ default: m.SkillCardSelector })));
const BattleModeSelector = lazy(() => import('./components/BattleModeSelector').then(m => ({ default: m.BattleModeSelector })));
const StaminaGate = lazy(() => import('./components/StaminaGate').then(m => ({ default: m.StaminaGate })));
const RepairCompleteOverlay = lazy(() => import('./components/RepairCompleteOverlay').then(m => ({ default: m.RepairCompleteOverlay })));
import { getLevelInfo } from './utils/xpLevels';
import { getSeasonProgress, incrementTaskCount, evaluateAndUpdateTasks, isDailyTask } from './utils/seasonTracker';
import { getExpeditionsForGrade } from './data/expeditions';
import type { Expedition } from './data/expeditions';
import { hasAnyPracticeCompletion, markPracticeCompleted } from './utils/completionState';
import { getRankMultiplier } from './utils/pkRank';
import { getStamina, getRemainingAttempts, consumeAttempt, grantBonusAttempt } from './utils/stamina';
import { awardCurrency, buyItem, CURRENCY_REWARDS } from './utils/currency';
import { SHOP_PRICES } from './utils/gameBalance';
import { getInventory, addItem, useItem } from './utils/inventory';
import { awardBattleItems, computeRecoveryReward } from './utils/repairItems';
import { buildRecoveryPath, advanceRecoveryStep, isRecoveryComplete, getCurrentStep, getRecoverySession } from './utils/recoveryPath';
import type { RecoverySession } from './utils/recoveryPath';
import { toMissionSummaries } from './utils/missionSummary';

import { BottomNav, type BottomTab } from "./components/BottomNav";
import { Confetti } from './components/Confetti';
import { useLessonRecovery } from './hooks/useLessonRecovery';
import { getSkillHealth, getSkillHealthMap, processRecoveryComplete, setSkillHealth } from './utils/skillHealth';
const MathBattle = lazy(() => import('./components/MathBattle').then(module => ({ default: module.MathBattle })));
const MapScreen = lazy(() => import('./screens/MapScreen').then(module => ({ default: module.MapScreen })));
const LobbyScreen = lazy(() => import('./screens/LobbyScreen').then(module => ({ default: module.LobbyScreen })));
const PracticeScreen = lazy(() => import('./screens/PracticeScreen').then(module => ({ default: module.PracticeScreen })));
const RepairScreen = lazy(() => import('./screens/RepairScreen').then(module => ({ default: module.RepairScreen })));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen').then(module => ({ default: module.DashboardScreen })));
const TechTreeScreen = lazy(() => import('./screens/TechTreeScreen').then(module => ({ default: module.TechTreeScreen })));
const LeaderboardPanel = lazy(() => import('./components/LeaderboardPanel').then(module => ({ default: module.LeaderboardPanel })));
const AchievementWallPanel = lazy(() => import('./components/AchievementWallPanel').then(module => ({ default: module.AchievementWallPanel })));
const PKSetupPanel = lazy(() => import('./components/PKSetupPanel').then(module => ({ default: module.PKSetupPanel })));
const PKResultPanel = lazy(() => import('./components/PKResultPanel').then(module => ({ default: module.PKResultPanel })));
const ExpeditionScreen = lazy(() => import('./screens/ExpeditionScreen').then(module => ({ default: module.ExpeditionScreen })));
const NotificationModal = lazy(() => import('./components/NotificationModal').then(module => ({ default: module.NotificationModal })));
const LiveTeacherPanel = lazy(() => import('./components/live/LiveTeacherPanel').then(module => ({ default: module.LiveTeacherPanel })));
const LiveStudentScreen = lazy(() => import('./components/live/LiveStudentScreen').then(module => ({ default: module.LiveStudentScreen })));
const LivePinJoin = lazy(() => import('./components/live/LivePinJoin').then(module => ({ default: module.LivePinJoin })));

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
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all min-h-[48px]">
              刷新页面 / Refresh
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

function ScreenLoader({ lang, label }: { lang: Language; label: string }) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="rounded-3xl border border-white/15 bg-slate-900/70 px-8 py-6 text-center shadow-2xl backdrop-blur-xl">
        {!timedOut ? (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-emerald-400" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              {label}
            </p>
            <p className="mt-2 text-xs text-white/45">
              {lang === 'en' ? 'Please wait a moment.' : '请稍等片刻。'}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-rose-400 mb-2">
              {lang === 'en' ? 'Connection seems slow.' : '连接似乎有点慢。'}
            </p>
            <p className="text-xs text-white/50 mb-4">
              {lang === 'en' ? 'Please check your internet and try again.' : '请检查网络连接后重试。'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors"
            >
              {lang === 'en' ? 'Retry' : '重试'}
            </button>
          </>
        )}
      </div>
    </div>
  );
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
    const safeState = (gameState === 'battle' || gameState === 'onboarding' || gameState === 'modeSelect' || gameState === 'expedition' || gameState === 'leaderboard' || gameState === 'achievements' || gameState === 'pk_setup' || gameState === 'tech_tree' || gameState === 'repair' || gameState === 'live_teacher' || gameState === 'live_student') ? 'map' : gameState;
    const safeMission = safeState === 'practice' ? missionId : null;
    localStorage.setItem(LS_STATE_KEY, JSON.stringify({ gameState: safeState, charId, isGuest, missionId: safeMission }));
  } catch { /* ignore */ }
}

export default function App() {
  const persistedRef = useRef<PersistedState | null>(null);
  if (!persistedRef.current) {
    persistedRef.current = loadPersistedState();
  }
  const persisted = persistedRef.current;
  const [lang, setLangState] = useState<Language>(() => {
    try { const s = localStorage.getItem('gl_lang'); if (s === 'zh' || s === 'zh_TW' || s === 'en') return s; } catch {}
    // Auto-detect from browser language
    const browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hant')) return 'zh_TW';
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  });
  const setLang = (l: Language) => { setLangState(l); try { localStorage.setItem('gl_lang', l); } catch {} };

  // --- Auto-hide top controls (language + logout) ---
  const [topControlsVisible, setTopControlsVisible] = useState(true);
  const topControlsTimer = useRef<number | null>(null);
  const resetTopControlsTimer = () => {
    if (topControlsTimer.current) clearTimeout(topControlsTimer.current);
    setTopControlsVisible(true);
    topControlsTimer.current = window.setTimeout(() => setTopControlsVisible(false), 3000);
  };
  useEffect(() => {
    resetTopControlsTimer();
    return () => { if (topControlsTimer.current) clearTimeout(topControlsTimer.current); };
  }, []);

  const [learnerMode, setLearnerMode] = useState<import('./types').LearnerMode>(() => {
    try { const s = localStorage.getItem('gl_learner_mode'); if (s === 'explore' || s === 'practice' || s === 'exam') return s; } catch {}
    return 'practice';
  });
  const handleSetLearnerMode = (m: import('./types').LearnerMode) => {
    setLearnerMode(m);
    try { localStorage.setItem('gl_learner_mode', m); } catch {}
  };
  const [gameState, setGameState] = useState<GameState>(persisted.gameState);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(persisted.charId);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
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
  const [repairTopicId, setRepairTopicId] = useState<string | null>(null);
  const [repairPatternId, setRepairPatternId] = useState<string | null>(null);
  const [activeExpedition, setActiveExpedition] = useState<Expedition | null>(null);
  const [levelUpNotif, setLevelUpNotif] = useState<{ newLevel: number; rankName: string; spEarned: number } | null>(null);
  const [levelUpConfetti, setLevelUpConfetti] = useState(0);
  const [skillHealToast, setSkillHealToast] = useState<{ topicId: string; delta: number; newHealth: number } | null>(null);
  const [repairToast, setRepairToast] = useState<{ bonus: number } | null>(null);
  const [nearLevelToast, setNearLevelToast] = useState<{ xpNeeded: number; rankName: string } | null>(null);
  const [loginRewardNotif, setLoginRewardNotif] = useState<{ streak: number; xp: number; sp: number } | null>(null);
  const [showPKResult, setShowPKResult] = useState(false);
  const [pkCountdown, setPkCountdown] = useState<number | null>(null); // seconds remaining, null = no countdown
  const [showStaminaGate, setShowStaminaGate] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHomeworkTab, setShowHomeworkTab] = useState(false);
  const [homeworkBadge, setHomeworkBadge] = useState(0);
  const [repairCompleteInfo, setRepairCompleteInfo] = useState<{ missionId: number; bonus: number; scrollAwarded: boolean } | null>(null);
  const [pendingBattleMission, setPendingBattleMission] = useState<Mission | null>(null);
  const [itemRewardToast, setItemRewardToast] = useState<{ items: { itemId: string; reason: string }[] } | null>(null);
  const [recoverySession, setRecoverySession] = useState<RecoverySession | null>(null);
  const recoverySessionRef = useRef<RecoverySession | null>(null);
  recoverySessionRef.current = recoverySession; // sync ref with state to avoid stale closures

  // Refs to accumulate mid-battle updates that get merged into handleBattleComplete's single save
  const pendingSeasonTasksRef = useRef<string[]>([]);
  const pendingStreakTokensRef = useRef(0);
  const pendingErrorsRef = useRef<import('./utils/diagnoseError').ErrorType[]>([]);
  // Track latest score to avoid stale closure in per-phase XP awards
  const latestScoreRef = useRef(0);

  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const {
    profile, updateProfile, addScore, recordBattleComplete,
    getCharProgression, getTotalSP, unlockSkill, equipSkill,
  } = useProfile(user, isGuest);
  const { missions, loading: missionsLoading, offline } = useMissions(profile?.grade);
  const missionSummaries = useMemo(() => toMissionSummaries(missions), [missions]);
  const { activeRoom, createRoom, joinRoom, toggleReady, startGame, submitScore, leaveRoomClean, startNextRound, fetchAndSetRoom } = useMultiplayer(user, profile);
  const liveSession = useLiveSession(activeRoom, user);
  const { notifications: sysNotifications, markAsRead: markNotifRead, markAllAsRead: markAllNotifsRead } = useNotifications(user);
  // Anonymous live session state (PIN-based, no login)
  const [anonLiveId, setAnonLiveId] = useState<string | null>(null);
  const [anonNickname, setAnonNickname] = useState<string | null>(null);
  const initialMissionIdRef = useRef<number | null>(persisted.missionId ?? null);
  const hasRestoredMissionRef = useRef(false);

  // Homework badge: count active assignments for bottom nav
  useEffect(() => {
    if (!user || isGuest) { setHomeworkBadge(0); return; }
    supabase.rpc('get_my_assignments').then(({ data }) => {
      if (data) setHomeworkBadge((data as any[]).filter((a: any) => !a.archived_at).length);
    });
  }, [user, isGuest]);

  // ExamHub lesson recovery detection — "you just completed training!"
  const { offer: lessonRecoveryOffer, dismiss: dismissLessonRecovery } = useLessonRecovery(
    user?.id ?? null,
    profile?.completed_missions ?? null,
  );

  // Must be after profile declaration
  if (profile) latestScoreRef.current = profile.total_score;
  // Snapshot players from finished round (before reset clears scores to 0)
  const lastRoundPlayersRef = useRef<Record<string, any> | null>(null);
  const pkXpAwardedRef = useRef(false);
  useEffect(() => {
    if (activeRoom?.status === 'finished' && activeRoom.type === 'pk') {
      lastRoundPlayersRef.current = { ...activeRoom.players };
    }
  }, [activeRoom?.status]);

  // Check URL for live join (?live or /live path)
  const [showPinJoin] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('live') || window.location.pathname.includes('/live');
    } catch { return false; }
  });

  // Check URL for homework deep link (?hw=<id>)
  const [pendingHomework, setPendingHomework] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('hw') || null;
    } catch { return null; }
  });

  // Persist state across page refresh
  useEffect(() => {
    saveAppState(gameState, selectedCharId, isGuest, activeMission?.id);
  }, [gameState, selectedCharId, isGuest, activeMission?.id]);

  useEffect(() => {
    if (missionsLoading || hasRestoredMissionRef.current) return;
    hasRestoredMissionRef.current = true;
    const missionId = initialMissionIdRef.current;
    if (!missionId) return;
    const found = missions.find(m => m.id === missionId);
    if (found) {
      setActiveMission(found);
    }
  }, [missions, missionsLoading]);

  // Restore recovery session from profile on load (with 14-day expiry)
  useEffect(() => {
    if (!profile) return;
    try {
      const saved = getRecoverySession(profile.completed_missions as any);
      if (saved && !recoverySessionRef.current) {
        const ageMs = Date.now() - (saved.startedAt || 0);
        const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
        if (ageMs > TWO_WEEKS) {
          // Discard stale session silently
          const cm = structuredClone(profile.completed_missions) as any;
          delete cm._recovery;
          updateProfile({ completed_missions: cm });
        } else {
          setRecoverySession(saved);
        }
      }
    } catch {
      // Malformed _recovery data — silently ignore
    }
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // If Supabase auth restored a session, jump to map
  useEffect(() => {
    if (user && gameState === 'welcome') {
      setGameState('map');
    }
  }, [user]);

  // PK countdown: when any opponent finished and I haven't, tick down 30→0
  const pkAutoCompleteRef = useRef(false);
  const handleBattleCompleteRef = useRef<(s: boolean, sc: number, d: number, hp: number) => void>(() => {});
  const [pkFirstFinish, setPkFirstFinish] = useState<number | null>(null);

  // Detect when first OPPONENT finishes (latches — only set once per battle)
  // Critical: must exclude current user's own finishedAt to avoid self-triggering countdown
  useEffect(() => {
    if (!activeRoom || activeRoom.type !== 'pk') { setPkFirstFinish(null); return; }
    if (gameState !== 'battle') return; // only detect during active battle
    const t = getFirstOpponentFinishTime(activeRoom, user?.id);
    if (t) setPkFirstFinish(prev => prev ?? t); // latch: don't overwrite
  }, [activeRoom?.players, gameState, user?.id]);

  // Run countdown timer based on pkFirstFinish
  useEffect(() => {
    if (gameState !== 'battle' || !pkFirstFinish) {
      setPkCountdown(null);
      pkAutoCompleteRef.current = false;
      // Also clear the latch when leaving battle to prevent stale data on next PK
      if (gameState !== 'battle') setPkFirstFinish(null);
      return;
    }
    // If current user already finished, no countdown needed
    if (user && activeRoom?.players[user.id]?.finishedAt) {
      setPkCountdown(null);
      return;
    }
    const tick = () => {
      const elapsed = (Date.now() - pkFirstFinish) / 1000;
      const remaining = Math.max(0, PK_COUNTDOWN_SECS - elapsed);
      setPkCountdown(Math.ceil(remaining));
      if (remaining <= 0 && !pkAutoCompleteRef.current) {
        pkAutoCompleteRef.current = true;
        handleBattleCompleteRef.current(false, 0, 0, 0);
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [gameState, pkFirstFinish]);

  // PK: show result when room status='finished' and all players done
  useEffect(() => {
    if (activeRoom?.status === 'finished' && !showPKResult && activeRoom?.type === 'pk') {
      setShowPKResult(true);
      setActiveMission(null);
      setGameState('map');
    }
  }, [activeRoom?.status]);

  /** Award PK bonus XP exactly once per round (guard via pkXpAwardedRef) */
  const awardPkXp = () => {
    if (pkXpAwardedRef.current || !profile || !user || !activeRoom) return;
    const snap = lastRoundPlayersRef.current ?? activeRoom.players;
    const ranked = Object.entries(snap).sort(([, a]: [string, any], [, b]: [string, any]) => b.score - a.score);
    const myRank = ranked.findIndex(([uid]) => uid === user.id);
    const myScore = (snap[user.id] as any)?.score ?? 0;
    if (myScore <= 0) { pkXpAwardedRef.current = true; return; }
    const multiplier = getRankMultiplier(myRank);
    const bonusXP = Math.round(myScore * (multiplier - 1));
    pkXpAwardedRef.current = true;
    if (bonusXP > 0) {
      latestScoreRef.current += bonusXP;
      addScore(bonusXP);
    }
  };

  // PK: When room resets to 'waiting' (host picked next round), settle XP + navigate to lobby
  useEffect(() => {
    if (activeRoom?.status === 'waiting' && showPKResult && user && activeRoom.type === 'pk') {
      awardPkXp();
      lastRoundPlayersRef.current = null;
      setShowPKResult(false);
      pkAutoCompleteRef.current = false;
      setGameState('lobby');
    } else if (activeRoom?.status === 'waiting' && gameState === 'map' && activeRoom.type === 'pk') {
      setGameState('lobby');
    }
  }, [activeRoom?.status, activeRoom?.missionId]);

  // PK: When non-host detects room status='playing' via realtime, auto-enter battle
  useEffect(() => {
    if (gameState !== 'lobby' || activeRoom?.status !== 'playing') return;
    if (activeMission) return; // already set
    if (missionsLoading || missions.length === 0) return; // wait for missions to load
    pkXpAwardedRef.current = false; // Reset XP guard for new round
    const m = missions.find(mi => mi.id === activeRoom.missionId);
    if (m) {
      if (m.data?.generatorType) {
        lazyGenerate().then(gen => { setActiveMission(gen(m)); setGameState('battle'); });
      } else {
        setActiveMission(m);
        setGameState('battle');
      }
    }
  }, [activeRoom?.missionId, activeRoom?.status, activeMission, gameState, missions, missionsLoading]);

  // Auto-detect live room: students enter live_student mode when they join a live room
  useEffect(() => {
    if (!activeRoom || activeRoom.type !== 'live' || !user) return;
    if (user.id === activeRoom.hostId) {
      if (gameState !== 'live_teacher') setGameState('live_teacher');
    } else {
      if (gameState !== 'live_student') setGameState('live_student');
    }
  }, [activeRoom?.type, activeRoom?.id, user?.id]);

  // If not logged in and stuck on a screen that requires auth, redirect to welcome
  useEffect(() => {
    if (!authLoading && !user && !isGuest && gameState !== 'welcome' && gameState !== 'dashboard') {
      setGameState('welcome');
    }
  }, [authLoading, user, isGuest, gameState]);

  // Login streak: check once when profile first loads (once per calendar day)
  useEffect(() => {
    if (!profile) return;
    // Use local date (consistent with dailyChallenge and seasonTracker)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const loginData = (profile.completed_missions as any)?._login as
      { lastDate: string; streak: number; bestStreak: number } | undefined;

    // Already checked today — double guard: DB field + localStorage
    if (loginData?.lastDate === todayStr) return;
    const loginDoneKey = `gl_login_done_${todayStr}`;
    if (localStorage.getItem(loginDoneKey)) return;

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

    const cm = structuredClone(profile.completed_missions) as any;
    cm._login = { lastDate: todayStr, streak: newStreak, bestStreak, sessionStart: Date.now() };

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

    // Set localStorage lock BEFORE async — prevents rapid refresh double-fire
    try { localStorage.setItem(loginDoneKey, '1'); } catch { /* ignore */ }

    (async () => {
      await updateProfile({ completed_missions: cm });
      // Only add XP + show notification after profile save succeeds
      latestScoreRef.current += xp;
      await addScore(xp);
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
    // Check daily stamina before allowing battle
    if (profile) {
      const stamina = getStamina(profile.completed_missions);
      if (getRemainingAttempts(stamina) <= 0) {
        setPendingBattleMission(mission);
        setShowStaminaGate(true);
        return;
      }
    }

    // Challenge mode: skip difficulty selector, go straight to battle
    // Difficulty progression (Green→Amber→Red) is handled in Practice mode
    if (mission.data?.generatorType) {
      lazyGenerate().then(gen => {
        setActiveMission(gen(mission));
        setSelectedSkillCard(null);
        // Show battle mode selector first, then skill cards
        setShowBattleModeSelector(true);
      });
    } else {
      // Single-question: go directly to ScrollOfWisdom
      setActiveMission(mission);
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
      setLevelUpConfetti(c => c + 1);
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
    // Use ref to get latest score (avoids stale closure across phases)
    const prevScore = latestScoreRef.current;
    latestScoreRef.current = prevScore + xp; // optimistic update for next phase
    const levelsGained = computeLevelsGained(prevScore, xp);
    if (levelsGained > 0) {
      // Merge SP into single write
      const cm = structuredClone(profile.completed_missions) as any;
      cm._total_skill_points = (cm._total_skill_points ?? 0) + levelsGained;
      await updateProfile({ completed_missions: cm });
    }
    await addScore(xp);
    showLevelUpNotifications(prevScore, xp, levelsGained);
  };

  const battleSubmittingRef = useRef(false);
  const handleBattleComplete = async (success: boolean, score = 0, durationSecs = 0, hpRemaining = 0) => {
    // Client-side lock: prevent multi-window / double-submit
    if (battleSubmittingRef.current) return;
    battleSubmittingRef.current = true;
    try {
    // Always record battle result (success AND failure) for data integrity
    if (activeMission && profile) {
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

    if (success) {
      const prevScore = latestScoreRef.current;
      const isFirstClearBattle = !profile.completed_missions[String(activeMission.id)];

      if (battleData) {
        let { completedMissions: cm, stats } = battleData; // cm is reassigned below by setSkillHealth

        if (isDailyBattle) {
          cm[getDailyKey()] = true;
        }

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
        { const { updatedProgress, justCompleted } = incrementTaskCount(sp, 'daily_battles_3');
          sp = updatedProgress;
          if (justCompleted) awardCurrency(cm, 'rations', CURRENCY_REWARDS.DAILY_TASK); }
        if (selectedDifficulty === 'red') {
          const { updatedProgress } = incrementTaskCount(sp, 'weekly_red_3');
          sp = updatedProgress;
        }
        if (isFirstClearBattle) {
          const { updatedProgress } = incrementTaskCount(sp, 'weekly_new_5');
          sp = updatedProgress;
        }
        // Drain any mid-battle season tasks (e.g., streak milestone)
        for (const taskId of pendingSeasonTasksRef.current) {
          const { updatedProgress, justCompleted } = incrementTaskCount(sp, taskId);
          sp = updatedProgress;
          if (justCompleted && isDailyTask(taskId)) awardCurrency(cm, 'rations', CURRENCY_REWARDS.DAILY_TASK);
        }
        // NOTE: evaluateAndUpdateTasks is deferred until after item awarding (below)

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

        // Step 5a: Consume stamina (1 attempt per battle)
        const currentStamina = getStamina(cm);
        cm._stamina = consumeAttempt(currentStamina);

        // Step 5b: Award repair items based on performance
        const errorCount = pendingErrorsRef.current.length;
        const { inventory: newInventory, awarded } = awardBattleItems(
          getInventory(cm),
          success,
          score,
          selectedDifficulty,
          errorCount,
        );
        if (awarded.length > 0) {
          cm._inventory = newInventory;
          // Master Crystal also grants +1 bonus stamina attempt
          if (awarded.some(r => r.itemId === 'crystal')) {
            cm._stamina = grantBonusAttempt(cm._stamina ?? getStamina(cm));
          }
          // Show toast after a short delay (after battle result animation)
          setTimeout(() => {
            setItemRewardToast({ items: awarded });
            setTimeout(() => setItemRewardToast(null), 3500);
          }, 1500);
          // Track season milestones for items
          if (awarded.some(r => r.itemId === 'crystal')) {
            const { updatedProgress } = incrementTaskCount(sp, 'weekly_crystal_1');
            sp = updatedProgress;
          }
        }

        // Evaluate season tasks (after all increments including items)
        const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
        cm._season = updatedProgress;

        // Step 5: Merge pending errors into mistake memory
        if (pendingErrorsRef.current.length > 0) {
          cm._mistakes = recordErrors(
            (cm._mistakes ?? {}) as any,
            activeMission.id,
            pendingErrorsRef.current,
          );
        }

        // Step 5b: Update skill health via Resilience Engine
        if (activeMission.kpId) {
          const topicMatch = activeMission.kpId.match(/^kp-(\d+\.\d+)/);
          if (topicMatch) {
            try {
              const { processAttempt } = await loadProcessAttemptUtils();
              const topicId = topicMatch[1];
              const prevHealth = getSkillHealth(cm as Record<string, unknown>, topicId);
              const { newState, result: healthResult } = processAttempt(prevHealth, true, undefined, topicId);
              cm = setSkillHealth(cm as Record<string, unknown>, topicId, newState) as any;
              // Show skill health recovery toast if health was below 100
              if (prevHealth.healthScore < 100 && healthResult.healthDelta > 0) {
                setSkillHealToast({ topicId, delta: healthResult.healthDelta, newHealth: newState.healthScore });
                setTimeout(() => setSkillHealToast(null), 3000);
              }
              // Fire-and-forget: sync to Supabase user_skill_health table
              if (user && !isGuest) {
                const knId = activeMission.kpId ? getKnIdForKp(activeMission.kpId) ?? null : null;
                supabase.from('user_skill_health').upsert({
                  user_id: user.id,
                  node_id: topicId,
                  kn_id: knId,
                  health_score: newState.healthScore,
                  corruption_level: newState.corruptionLevel,
                  dominant_error_pattern_id: newState.dominantPatternId,
                  consecutive_same_pattern_count: newState.consecutiveSamePattern,
                  total_attempt_count: newState.totalAttempts,
                  last_attempt_at: new Date().toISOString(),
                }, { onConflict: 'user_id,node_id' }).then(() => {}, () => {});
              }
            } catch (error) {
              console.error('Failed to lazy-load processAttempt for battle success', error);
            }
          }
        }

        // Award merit currency for battle win
        awardCurrency(cm, 'merit', CURRENCY_REWARDS.BATTLE_WIN);
        if (isDailyBattle) {
          awardCurrency(cm, 'merit', CURRENCY_REWARDS.DAILY_WIN_BONUS);
        }

        // Step 6: Save progress + score via separate safe channels
        latestScoreRef.current = prevScore + score;
        await updateProfile({ completed_missions: cm, stats });
        await addScore(score);

        // Step 6: Notifications only (no writes)
        showLevelUpNotifications(prevScore, score, levelsGained);

        // Step 7: Bridge to shared play_kp_progress table (fire-and-forget)
        if (activeMission.kpId && user) {
          supabase.rpc('upsert_play_kp', {
            p_user_id: user.id, p_kp_id: activeMission.kpId,
            p_success: true, p_score: score,
            p_kn_id: getKnIdForKp(activeMission.kpId) ?? null,
          });
        }
      }

      setLastClearedMissionId(activeMission.id);
    } // end if (success)
    } // end if (activeMission && profile) — recordBattleComplete

    // Bridge failed attempts too (tracks attempts without incrementing wins)
    if (!success && activeMission?.kpId && user) {
      supabase.rpc('upsert_play_kp', {
        p_user_id: user.id, p_kp_id: activeMission.kpId,
        p_success: false, p_score: score,
        p_kn_id: getKnIdForKp(activeMission.kpId) ?? null,
      });
    }
    // Failed battles: consume stamina + record errors + update skill health
    if (!success && profile && activeMission) {
      let cm = structuredClone(profile.completed_missions) as any;
      // Stamina
      cm._stamina = consumeAttempt(getStamina(cm));
      // Errors
      if (pendingErrorsRef.current.length > 0) {
        cm._mistakes = recordErrors(
          (cm._mistakes ?? {}) as any,
          activeMission.id,
          pendingErrorsRef.current,
        );
      }
      // Skill health update via Resilience Engine — single call per battle, not per error
      // One failed battle = one processAttempt call with the dominant error pattern
      if (activeMission.kpId) {
        const topicMatch = activeMission.kpId.match(/^kp-(\d+\.\d+)/);
        if (topicMatch) {
          try {
            const { processAttempt } = await loadProcessAttemptUtils();
            const topicId = topicMatch[1];
            const health = getSkillHealth(cm as Record<string, unknown>, topicId);
            // Use first error as dominant pattern (or generic if none)
            const dominantErr = pendingErrorsRef.current[0];
            const patternId = dominantErr === 'sign' ? 'sign_distribution' : dominantErr === 'method' ? 'generic_algebra' : dominantErr ? 'generic_number' : undefined;
            const { newState, result: healthResult } = processAttempt(health, false, patternId, topicId);
            cm = setSkillHealth(cm as Record<string, unknown>, topicId, newState) as any;
            // Fire-and-forget: sync to Supabase
            if (user && !isGuest) {
              const knId = activeMission?.kpId ? getKnIdForKp(activeMission.kpId) ?? null : null;
              supabase.from('user_skill_health').upsert({
                user_id: user.id,
                node_id: topicId,
                kn_id: knId,
                health_score: newState.healthScore,
                corruption_level: newState.corruptionLevel,
                dominant_error_pattern_id: newState.dominantPatternId,
                consecutive_same_pattern_count: newState.consecutiveSamePattern,
                recent_error_count: newState.recentErrorCount,
                total_attempt_count: newState.totalAttempts,
                last_attempt_at: new Date().toISOString(),
                last_error_at: new Date().toISOString(),
                recommended_recovery_pack_id: newState.corruptionLevel === 'blocked' || newState.corruptionLevel === 'critical'
                  ? healthResult.recoveryPackId
                  : null,
              }, { onConflict: 'user_id,node_id' }).then(() => {}, () => {});
            }
          } catch (error) {
            console.error('Failed to lazy-load processAttempt for battle failure', error);
          }
        }
      }
      // Award items even on failure (score-based: only if score >= threshold)
      const { inventory: newInv, awarded } = awardBattleItems(
        getInventory(cm), false, score, selectedDifficulty, pendingErrorsRef.current.length,
      );
      if (awarded.length > 0) cm._inventory = newInv;
      // Single atomic write
      await updateProfile({ completed_missions: cm });
      if (awarded.length > 0) {
        setTimeout(() => {
          setItemRewardToast({ items: awarded });
          setTimeout(() => setItemRewardToast(null), 3500);
        }, 1500);
      }
    }
    // Always drain pending refs (even on failure, so stale data doesn't leak to next battle)
    pendingSeasonTasksRef.current = [];
    pendingStreakTokensRef.current = 0;
    pendingErrorsRef.current = [];
    setIsDailyBattle(false);

    // PK mode: submit score, go to map, wait for room.status='finished' to show podium
    if (activeRoom?.type === 'pk' && user) {
      // Guard: skip if already submitted (race between countdown auto-complete and manual answer)
      if (activeRoom.players[user.id]?.finishedAt) return;
      await submitScore(score);
      pkAutoCompleteRef.current = false;
      setPkCountdown(null);
      setPkFirstFinish(null);
      setActiveMission(null);
      setGameState('map'); // unmount MathBattle; PKResult effect fires when room finishes
      return;
    }

    setGameState('map');
    setActiveMission(null);
    } finally {
      battleSubmittingRef.current = false;
    }
  };
  handleBattleCompleteRef.current = handleBattleComplete;

  const handleGuest = () => {
    setIsGuest(true);
    // Profile will be auto-loaded from localStorage by useProfile
  };

  const isLoggedIn = !!user || isGuest;
  // Teacher access: check teachers table (cached) OR TEACHER tag fallback
  const [isTeacherDb, setIsTeacherDb] = useState(false);
  useEffect(() => {
    if (!user || isGuest) { setIsTeacherDb(false); return; }
    supabase.from('teachers').select('id').eq('user_id', user.id).maybeSingle()
      .then(({ data, error }) => setIsTeacherDb(!error && !!data));
  }, [user, isGuest]);
  const isTeacher = isTeacherDb || (profile?.class_tags ?? []).some(t => t.toUpperCase() === 'TEACHER');
  const isMissionShellLoading = missionsLoading && (
    gameState === 'map' ||
    gameState === 'lobby' ||
    gameState === 'battle' ||
    gameState === 'practice' ||
    gameState === 'pk_setup' ||
    gameState === 'expedition'
  );

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
        {/* Top controls — auto-hide after 3s, tap dot to reveal */}
        <div
          className="fixed top-4 right-4 z-50"
          onMouseEnter={resetTopControlsTimer}
        >
          <div className={`flex items-center gap-2 transition-all duration-300 origin-right ${topControlsVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none absolute right-0'}`}>
            <button
              onClick={() => { setLang(lang === 'zh' ? 'zh_TW' : lang === 'zh_TW' ? 'en' : 'zh'); resetTopControlsTimer(); }}
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
          <button
            onClick={resetTopControlsTimer}
            aria-label="Show controls"
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/40 hover:text-white/70 hover:bg-white/20 transition-all duration-300 ${topControlsVisible ? 'opacity-0 scale-75 pointer-events-none absolute right-0' : 'opacity-100 scale-100 pointer-events-auto'}`}
          >
            <Languages size={16} />
          </button>
        </div>

        {/* Overlays — lazy loaded (all appear after user interaction, null fallback is safe) */}
        <Suspense fallback={null}>
          <AnimatePresence>
            {showBattleModeSelector && (
              <BattleModeSelector lang={lang} onSelect={handleBattleModeSelect} />
            )}
          </AnimatePresence>
        </Suspense>

        <Suspense fallback={null}>
          <AnimatePresence>
            {showSkillCards && (
              <SkillCardSelector
                lang={lang}
                onSelect={handleSkillCardSelect}
              />
            )}
          </AnimatePresence>
        </Suspense>

        <Suspense fallback={null}>
          <AnimatePresence>
            {showStaminaGate && (
              <StaminaGate
                lang={lang}
                onPractice={() => {
                  setShowStaminaGate(false);
                  if (pendingBattleMission) {
                    handlePracticeStart(pendingBattleMission);
                    setPendingBattleMission(null);
                  }
                }}
                onBack={() => { setShowStaminaGate(false); setPendingBattleMission(null); }}
              />
            )}
          </AnimatePresence>
        </Suspense>

        {/* System notifications — shown on login when unread messages exist */}
        <Suspense fallback={null}>
          {sysNotifications.length > 0 && gameState === 'map' && (
            <NotificationModal
              lang={lang}
              notifications={sysNotifications}
              onDismiss={markNotifRead}
              onDismissAll={markAllNotifsRead}
            />
          )}
        </Suspense>

        {/* v5.0 Step 5+6: Repair Complete — "Skill Stabilised" + Retry */}
        <Suspense fallback={null}>
          <AnimatePresence>
            {repairCompleteInfo && (
              <RepairCompleteOverlay
                lang={lang}
                bonus={repairCompleteInfo.bonus}
                scrollAwarded={repairCompleteInfo.scrollAwarded}
                onRetry={() => {
                  const m = missions.find(mi => mi.id === repairCompleteInfo.missionId);
                  setRepairCompleteInfo(null);
                  if (m) handlePracticeStart(m);
                }}
                onBack={() => {
                  setRepairCompleteInfo(null);
                  setActiveMission(null);
                }}
              />
            )}
          </AnimatePresence>
        </Suspense>

        <Suspense fallback={null}>
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
        </Suspense>

        {/* Version indicator */}
        <div className="fixed bottom-1 left-1 z-50 text-white/15 text-[10px] font-mono">v10.5</div>

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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full"
            >
              <Suspense fallback={<ScreenLoader lang={lang} label={lang === 'en' ? 'Loading screen' : '正在加载页面'} />}>
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
                  onDashboard={isTeacher ? () => setGameState('dashboard') : undefined}
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
                  onComplete={() => setGameState('modeSelect')}
                />
              )}

              {gameState === 'modeSelect' && (
                <div className="min-h-[80vh] flex items-center justify-center px-6">
                  <div className="max-w-md w-full space-y-4">
                    <h2 className="text-center text-lg font-black text-white mb-1">
                      {lang === 'en' ? 'How would you like to learn?' : '你想怎么学？'}
                    </h2>
                    <p className="text-center text-xs text-white/40 mb-4">
                      {lang === 'en' ? 'You can change this anytime in the menu.' : '以后可以随时在菜单里切换。'}
                    </p>
                    {([
                      { mode: 'explore' as const, icon: '🌱', zh: '慢慢来，我想从基础开始', en: 'Take it slow — start from the basics', sub_zh: '每个知识点都有探索环节，节奏更轻松', sub_en: 'Each topic has a discovery phase, at a relaxed pace', color: 'from-emerald-900/40 to-emerald-800/20 border-emerald-600/30 hover:border-emerald-500/50' },
                      { mode: 'practice' as const, icon: '📖', zh: '正常练习', en: 'Regular practice', sub_zh: '标准学习路径，适合大多数同学', sub_en: 'Standard learning path, works for most students', color: 'from-blue-900/40 to-blue-800/20 border-blue-600/30 hover:border-blue-500/50' },
                      { mode: 'exam' as const, icon: '🎯', zh: '我在备考，帮我抓重点', en: 'I\'m preparing for exams — focus on key areas', sub_zh: '跳过已学内容，集中训练薄弱环节', sub_en: 'Skip what you know, drill what you don\'t', color: 'from-amber-900/40 to-amber-800/20 border-amber-600/30 hover:border-amber-500/50' },
                    ]).map(opt => (
                      <button
                        key={opt.mode}
                        onClick={() => { handleSetLearnerMode(opt.mode); setGameState('map'); }}
                        className={`w-full text-left p-4 rounded-xl border bg-gradient-to-r ${opt.color} transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <div className="text-sm font-bold text-white">{lang === 'en' ? opt.en : opt.zh}</div>
                            <div className="text-[10px] text-white/40 mt-0.5">{lang === 'en' ? opt.sub_en : opt.sub_zh}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isMissionShellLoading && (
                <ScreenLoader lang={lang} label={lang === 'en' ? 'Loading mission data' : '正在加载关卡数据'} />
              )}

              {offline && (
                <div className="fixed top-0 left-0 right-0 z-[90] bg-amber-500 text-white text-center text-xs font-bold py-1.5">
                  {lang === 'en' ? '⚠ Offline — progress will sync when reconnected' : '⚠ 离线模式——重新连网后自动同步进度'}
                </div>
              )}

              {/* Live Session Banner — shown when teacher starts a session */}
              {gameState === 'map' && sysNotifications.some(n => n.type === 'live_session') && (
                <LiveSessionBanner
                  notifications={sysNotifications}
                  onJoin={async (roomId) => {
                    const err = await liveSession.joinLiveRoom(roomId);
                    if (err) { alert(err); return; }
                    await fetchAndSetRoom(roomId);
                    // auto-detect effect will switch to live_student
                  }}
                  onDismiss={markNotifRead}
                  lang={lang}
                />
              )}

              {!isMissionShellLoading && gameState === 'map' && profile && profile.grade && (
                <MapScreen
                  lang={lang}
                  profile={profile}
                  missions={missions}
                  selectedChar={selectedChar}
                  learnerMode={learnerMode}
                  onLearnerModeChange={handleSetLearnerMode}
                  autoOpenHomework={!!pendingHomework || showHomeworkTab}
                  onHomeworkOpened={() => { setPendingHomework(null); setShowHomeworkTab(false); window.history.replaceState({}, '', window.location.pathname); }}
                  onMissionStart={handleMissionStart}
                  onPracticeStart={handlePracticeStart}
                  onGradeChange={() => updateProfile({ grade: null })}
                  onCharChange={() => { setSelectedCharId(null); setGameState('welcome'); }}
                  onCreateRoom={createRoom}
                  onDashboard={isTeacher ? () => setGameState('dashboard') : undefined}
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
                  onBuyItem={async (itemId: string): Promise<boolean> => {
                    if (!profile) return false;
                    const price = SHOP_PRICES[itemId];
                    if (!price) return false;
                    const cm = structuredClone(profile.completed_missions) as any;
                    const updated = buyItem(cm, itemId, price.type, price.amount);
                    if (!updated) return false; // insufficient balance
                    await updateProfile({ completed_missions: updated as any });
                    return true;
                  }}
                  onRepairWithItem={async (missionId, itemId) => {
                    if (!profile) return;
                    const cm = structuredClone(profile.completed_missions) as any;
                    const inv = getInventory(cm);
                    const newInv = useItem(inv, itemId);
                    if (!newInv) return;
                    // Reset equipment mastery timestamp to now (repair)
                    if (cm._equipment?.[String(missionId)]) {
                      cm._equipment[String(missionId)].lastMasteredAt = Date.now();
                      cm._equipment[String(missionId)].repairCount = (cm._equipment[String(missionId)].repairCount ?? 0) + 1;
                    }
                    // Clear mistake record for this mission
                    if (cm._mistakes?.[String(missionId)]) {
                      cm._mistakes[String(missionId)] = { count: 0, lastWrong: '', patterns: {} };
                    }
                    cm._inventory = newInv;
                    await updateProfile({ completed_missions: cm });
                  }}
                  hotTopicInfo={hotTopic}
                  onLeaderboard={() => setGameState('leaderboard')}
                  onAchievements={() => setGameState('achievements')}
                  onFriendPK={user ? () => setGameState('pk_setup') : undefined}
                  onTechTree={() => setGameState('tech_tree')}
                  mobileMenuOpen={mobileMenuOpen}
                  onMobileMenuClose={() => setMobileMenuOpen(false)}
                />
              )}

              {!isMissionShellLoading && gameState === 'lobby' && activeRoom && user && (
                <LobbyScreen
                  lang={lang}
                  missions={missions}
                  room={activeRoom}
                  userId={user.id}
                  onReady={toggleReady}
                  onStart={async () => {
                    const err = await startGame();
                    if (err) {
                      // RPC validation failed — stay in lobby
                      alert(lang === 'en' ? `Cannot start: ${err}` : `无法开始: ${err}`);
                    }
                    // Don't manually set gameState — Effect #6 will detect status='playing'
                    // via realtime and transition ALL players (host + guests) simultaneously
                  }}
                  onLeave={async () => { await leaveRoomClean(); setGameState('map'); }}
                />
              )}

              {!isMissionShellLoading && gameState === 'battle' && activeMission && selectedChar && (
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
                  onDiagnose={() => setGameState('tech_tree')}
                  battleMode={selectedBattleMode}
                  heroSkillEffect={selectedChar ? getActiveSkillEffect(getCharProgression(selectedChar.id)) : null}
                />
              )}

              {!isMissionShellLoading && gameState === 'practice' && activeMission && selectedChar && (
                <PracticeScreen
                  key={`practice-${activeMission.id}-${isRepairMode}`}
                  mission={activeMission}
                  character={selectedChar}
                  lang={lang}
                  learnerMode={learnerMode}
                  phaseCompletions={profile?.completed_missions[String(activeMission.id)] as any}
                  onEarnXP={handlePracticeEarnXP}
                  onRecordError={handleRecordError}
                  repairPattern={isRepairMode && profile ? (() => {
                    const mistakes = getMistakesMap(profile.completed_missions as Record<string, unknown>);
                    const rec = mistakes[String(activeMission.id)];
                    return rec ? getDominantPattern(rec) : null;
                  })() : null}
                  onRepairIntercept={() => {
                    // v5.0: Switch to repair mode — key prop forces remount
                    setIsRepairMode(true);
                  }}
                  onComplete={async () => {
                    // Save practice completion — all 4 phases done (XP already awarded per-phase)
                    if (profile) {
                      const cm = structuredClone(profile.completed_missions) as any;
                      const key = String(activeMission.id);
                      const isFirstClearPractice = !hasAnyPracticeCompletion(cm[key]);
                      cm[key] = markPracticeCompleted(cm[key]);
                      // Season tasks
                      let sp = getSeasonProgress(cm);
                      { const { updatedProgress, justCompleted } = incrementTaskCount(sp, 'daily_practice_1');
                        sp = updatedProgress;
                        if (justCompleted) awardCurrency(cm, 'rations', CURRENCY_REWARDS.DAILY_TASK); }
                      if (isFirstClearPractice) {
                        const { updatedProgress: sp2 } = incrementTaskCount(sp, 'weekly_new_5');
                        sp = sp2;
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
                      // Award wisdom currency for practice completion
                      awardCurrency(cm, 'wisdom', CURRENCY_REWARDS.PRACTICE_COMPLETE);
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
                          p_kn_id: getKnIdForKp(activeMission.kpId) ?? null,
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
                  onCancel={async () => {
                    // Persist any errors recorded so far (even on mid-session cancel)
                    if (profile && activeMission && pendingErrorsRef.current.length > 0) {
                      const cm = structuredClone(profile.completed_missions) as any;
                      cm._mistakes = recordErrors(
                        (cm._mistakes ?? {}) as any,
                        activeMission.id,
                        pendingErrorsRef.current,
                      );
                      await updateProfile({ completed_missions: cm });
                      pendingErrorsRef.current = [];
                    }
                    setIsRepairMode(false);
                    setGameState('map');
                    setActiveMission(null);
                  }}
                  repairMode={isRepairMode}
                  onRepairComplete={async () => {
                    // Inline repair + season + scroll reward into single updateProfile
                    if (profile) {
                      const cm = structuredClone(profile.completed_missions) as any;
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
                      // Award Purify Scroll based on dominant error pattern
                      const mistakesMap = getMistakesMap(cm);
                      const missionMistakes = mistakesMap[String(activeMission.id)];
                      let scrollAwarded: { itemId: string; reason: string } | null = null;
                      if (missionMistakes) {
                        const dominant = getDominantPattern(missionMistakes);
                        if (dominant) {
                          // Recovery Pack = 100% accuracy (completed 3/3 correct)
                          scrollAwarded = computeRecoveryReward(dominant, 1.0);
                          if (scrollAwarded) {
                            const inv = getInventory(cm);
                            cm._inventory = addItem(inv, scrollAwarded.itemId);
                          }
                        }
                      }
                      // Clear mistake record after successful repair
                      if (cm._mistakes?.[String(activeMission.id)]) {
                        cm._mistakes[String(activeMission.id)] = { count: 0, lastWrong: '', patterns: {} };
                      }
                      // Season task: weekly_repair_1
                      let sp = getSeasonProgress(cm);
                      { const { updatedProgress: sp2 } = incrementTaskCount(sp, 'weekly_repair_1');
                        sp = sp2; }
                      const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
                      cm._season = updatedProgress;
                      // Recovery session: advance step + heal prereq topic
                      const currentRecovery = recoverySessionRef.current;
                      if (currentRecovery) {
                        // Heal the current step's prereq topic health + clear mistakes
                        const currentStep = getCurrentStep(currentRecovery);
                        if (currentStep) {
                          const stepTopicId = currentStep.topicId;
                          // Restore health via Resilience Engine API (mutate cm in-place)
                          const stepHealth = getSkillHealth(cm as Record<string, unknown>, stepTopicId);
                          if (stepHealth.corruptionLevel !== 'none') {
                            const healed = processRecoveryComplete(stepHealth);
                            const updated = setSkillHealth(cm as Record<string, unknown>, stepTopicId, healed);
                            Object.assign(cm, updated);
                          }
                          // Clear mistakes for all missions in this prereq topic
                          if (cm._mistakes) {
                            for (const [mid] of Object.entries(cm._mistakes)) {
                              const m = missions.find(mission => mission.id === Number(mid));
                              if (m?.kpId?.startsWith(`kp-${stepTopicId}`)) {
                                (cm._mistakes as any)[mid] = { count: 0, lastWrong: '', patterns: {} };
                              }
                            }
                          }
                        }
                        const advanced = advanceRecoveryStep(currentRecovery);
                        if (isRecoveryComplete(advanced)) {
                          delete cm._recovery;
                          setRecoverySession(null);
                        } else {
                          cm._recovery = advanced;
                          setRecoverySession(advanced);
                        }
                      }

                      latestScoreRef.current += bonus;
                      await updateProfile({ completed_missions: cm });
                      await addScore(bonus);
                      setIsRepairMode(false);

                      if (currentRecovery) {
                        // In recovery mode: go back to tech tree to show next step
                        setGameState('tech_tree');
                        setActiveMission(null);
                      } else {
                        // Normal repair: show "Skill Stabilised" closure
                        setRepairCompleteInfo({
                          missionId: activeMission.id,
                          bonus,
                          scrollAwarded: !!scrollAwarded,
                        });
                        setGameState('map');
                      }
                      // Don't clear activeMission yet — needed for retry (non-recovery)
                      if (bonus > 0) {
                        setRepairToast({ bonus });
                        setTimeout(() => setRepairToast(null), 3000);
                      }
                      if (scrollAwarded) {
                        setTimeout(() => {
                          setItemRewardToast({ items: [scrollAwarded!] });
                          setTimeout(() => setItemRewardToast(null), 3500);
                        }, bonus > 0 ? 3200 : 500);
                      }
                    } else {
                      setIsRepairMode(false);
                      setGameState('map');
                      setActiveMission(null);
                    }
                  }}
                />
              )}

              {!isMissionShellLoading && gameState === 'expedition' && profile?.grade && selectedChar && activeExpedition && (() => {
                const saveExpeditionXP = async (xp: number, nodes: number) => {
                  if (profile && xp > 0) {
                    const cm = structuredClone(profile.completed_missions) as any;
                    let sp = getSeasonProgress(cm);
                    for (let i = 0; i < nodes; i++) {
                      const { updatedProgress: sp2, justCompleted } = incrementTaskCount(sp, 'daily_battles_3');
                      sp = sp2;
                      if (justCompleted) awardCurrency(cm, 'rations', CURRENCY_REWARDS.DAILY_TASK);
                    }
                    const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
                    cm._season = updatedProgress;
                    latestScoreRef.current += xp;
                    await updateProfile({ completed_missions: cm });
                    await addScore(xp);
                  }
                };
                return (
                  <ExpeditionScreen
                    expedition={activeExpedition}
                    character={selectedChar}
                    lang={lang}
                    grade={profile.grade}
                    missions={missions}
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
                  onStartLive={async (classTag: string, grade: number) => {
                    const { data, error } = await supabase.rpc('create_live_room', { p_class_tag: classTag, p_grade: grade });
                    if (error || data?.error) { alert(error?.message || data?.error); return; }
                    const roomId = data?.room_id;
                    if (roomId) {
                      await fetchAndSetRoom(roomId);
                      // auto-detect effect will set gameState to live_teacher
                    }
                  }}
                />
              )}

              {/* Live Classroom screens */}
              {gameState === 'live_teacher' && activeRoom?.type === 'live' && user && (
                <Suspense fallback={<ScreenLoader lang={lang} label={lang === 'en' ? 'Loading classroom' : '加载课堂'} />}>
                  <LiveTeacherPanel
                    lang={lang}
                    room={activeRoom}
                    userId={user.id}
                    missions={missions}
                    grade={profile?.grade ?? 7}
                    questionStats={liveSession.questionStats}
                    sessionSummary={liveSession.sessionSummary}
                    questionIndex={liveSession.questionIndex}
                    onPushQuestion={liveSession.pushQuestion}
                    onEndSession={liveSession.endSession}
                    onClose={async () => { await leaveRoomClean(); setGameState('dashboard'); }}
                    onAssign={async (kpId, missionIds, studentIds) => {
                      const classTag = activeRoom.liveMeta?.class_tag;
                      if (!classTag) return;
                      await supabase.rpc('create_assignment', {
                        p_grade: profile?.grade ?? 7,
                        p_class_tag: classTag,
                        p_mission_ids: missionIds,
                        p_title: `Live Session Practice — ${kpId}`,
                        p_description: null,
                        p_deadline: null,
                        p_target_user_ids: studentIds.length > 0 ? studentIds : null,
                      });
                      alert(lang === 'en' ? 'Practice assigned!' : '已布置练习！');
                    }}
                  />
                </Suspense>
              )}

              {gameState === 'live_student' && activeRoom?.type === 'live' && user && (
                <Suspense fallback={<ScreenLoader lang={lang} label={lang === 'en' ? 'Joining classroom' : '加入课堂'} />}>
                  <LiveStudentScreen
                    lang={lang}
                    room={activeRoom}
                    userId={user.id}
                    mission={liveSession.currentQuestion ? missions.find(m => m.id === liveSession.currentQuestion!.mission_id) ?? null : null}
                    questionIndex={liveSession.questionIndex}
                    completedMissions={profile?.completed_missions as Record<string, unknown> ?? {}}
                    onSubmitResponse={liveSession.submitResponse}
                    onUpdateMistakes={(cm) => updateProfile({ completed_missions: cm })}
                    onClose={async () => { await leaveRoomClean(); setGameState('map'); }}
                  />
                </Suspense>
              )}

              {/* PIN-based anonymous join (play.25maths.com?live) */}
              {showPinJoin && !anonLiveId && gameState !== 'live_student' && gameState !== 'live_teacher' && (
                <Suspense fallback={null}>
                  <LivePinJoin
                    lang={lang}
                    onJoined={async (roomId, anonId, nickname) => {
                      setAnonLiveId(anonId);
                      setAnonNickname(nickname);
                      await fetchAndSetRoom(roomId);
                    }}
                    onBack={() => window.location.href = window.location.pathname}
                  />
                </Suspense>
              )}

              {/* Anonymous student in live session (joined via PIN) */}
              {anonLiveId && activeRoom?.type === 'live' && (
                <Suspense fallback={<ScreenLoader lang={lang} label={lang === 'en' ? 'Joining classroom' : '加入课堂'} />}>
                  <LiveStudentScreen
                    lang={lang}
                    room={activeRoom}
                    userId={anonLiveId}
                    mission={liveSession.currentQuestion ? missions.find(m => m.id === liveSession.currentQuestion!.mission_id) ?? null : null}
                    questionIndex={liveSession.questionIndex}
                    completedMissions={{}}
                    onSubmitResponse={async (answer, isCorrect, errorType, durationMs) => {
                      // Anonymous: use anon RPC instead of auth-based one
                      const { data, error } = await supabase.rpc('submit_live_response_anon', {
                        p_room_id: activeRoom.id,
                        p_anon_id: anonLiveId,
                        p_mission_id: liveSession.currentQuestion?.mission_id ?? 0,
                        p_question_index: liveSession.questionIndex,
                        p_answer: answer,
                        p_is_correct: isCorrect,
                        p_error_type: errorType ?? null,
                        p_duration_ms: durationMs ?? null,
                        p_kp_id: liveSession.currentQuestion?.kp_id ?? null,
                      });
                      if (error) return error.message;
                      if (data?.error) return data.error;
                      return '';
                    }}
                    onUpdateMistakes={() => {}}
                    onClose={() => { setAnonLiveId(null); setAnonNickname(null); window.location.href = window.location.pathname; }}
                  />
                </Suspense>
              )}

              {gameState === 'leaderboard' && profile && profile.grade && (
                <LeaderboardPanel
                  lang={lang}
                  grade={profile.grade}
                  currentUserId={profile.user_id}
                  classTags={profile.class_tags ?? undefined}
                  isAdmin={isTeacher && !(profile.class_tags ?? []).some(t => /^\d/.test(t))}
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

              {gameState === 'tech_tree' && profile && (
                <TechTreeScreen
                  lang={lang}
                  profile={profile}
                  missions={missions}
                  onBack={() => setGameState('map')}
                  onMissionStart={handleMissionStart}
                  onPracticeStart={handlePracticeStart}
                  onRepairMission={(missionId) => {
                    const m = missions.find(m => m.id === missionId);
                    if (m) {
                      setActiveMission(m);
                      setIsRepairMode(true);
                      setGameState('practice');
                    }
                  }}
                  onStartRecovery={async (topicId) => {
                    if (!profile) return;
                    const healthMap = getSkillHealthMap(profile.completed_missions as Record<string, unknown>);
                    const health = healthMap[topicId];
                    const patternId = health?.dominantPatternId ?? null;
                    const errorType = (patternId ?? 'method') as import('./utils/diagnoseError').ErrorType;

                    try {
                      const mistakes = getMistakesMap(profile.completed_missions as Record<string, unknown>);
                      const recoveryPath = await buildRecoveryPath(topicId, errorType, mistakes, missions);

                      if (recoveryPath && recoveryPath.steps.length > 1) {
                        // Multi-step: persist session and show RecoveryPathPanel
                        setRecoverySession(recoveryPath);
                        const cm = structuredClone(profile.completed_missions) as any;
                        cm._recovery = recoveryPath;
                        updateProfile({ completed_missions: cm });
                        return;
                      }
                    } catch (error) {
                      console.error('Failed to build recovery path, falling back to single-topic repair', error);
                    }

                    // Single-topic fallback: direct to RepairScreen
                    setRepairTopicId(topicId);
                    setRepairPatternId(patternId);
                    setGameState('repair');
                  }}
                  recoverySession={recoverySession}
                  onRecoveryStepStart={(missionId) => {
                    const m = missions.find(m => m.id === missionId);
                    if (m) {
                      setActiveMission(m);
                      setIsRepairMode(true);
                      setGameState('practice');
                    }
                  }}
                  onRecoveryCancelled={async () => {
                    if (profile) {
                      const cm = structuredClone(profile.completed_missions) as any;
                      delete cm._recovery;
                      await updateProfile({ completed_missions: cm });
                    }
                    setRecoverySession(null);
                    setActiveMission(null);
                  }}
                />
              )}

              {/* ═══ Repair Mode ═══ */}
              {gameState === 'repair' && profile && repairTopicId && (
                <RepairScreen
                  lang={lang}
                  topicId={repairTopicId}
                  patternId={repairPatternId}
                  healthState={getSkillHealth(profile.completed_missions as Record<string, unknown>, repairTopicId)}
                  missions={missions}
                  onComplete={async (restoredState) => {
                    // Write restored health back to profile
                    const cm = structuredClone(profile.completed_missions) as any;
                    const updated = setSkillHealth(cm as Record<string, unknown>, repairTopicId!, restoredState);
                    await updateProfile({ completed_missions: updated as import('./types').CompletedMissions });
                    setRepairTopicId(null);
                    setRepairPatternId(null);
                    setGameState('tech_tree');
                  }}
                  onCancel={() => {
                    setRepairTopicId(null);
                    setRepairPatternId(null);
                    setGameState('tech_tree');
                  }}
                />
              )}

              {gameState === 'pk_setup' && profile && profile.grade && user && (
                <PKSetupPanel
                  lang={lang}
                  grade={profile.grade}
                  missions={missionSummaries}
                  onCreateRoom={async (missionId) => {
                    const ok = await createRoom('pk', missionId);
                    if (ok) {
                      setGameState('lobby');
                    } else {
                      alert(lang === 'en' ? 'Failed to create room. Please try again.' : '创建房间失败，请重试。');
                    }
                  }}
                  onJoinRoom={async (code) => {
                    const err = await joinRoom(code);
                    if (!err) {
                      setGameState('lobby');
                    } else {
                      const msg = lang === 'en'
                        ? `Could not join room: ${err}`
                        : `无法加入房间: ${err}`;
                      alert(msg);
                    }
                  }}
                  onClose={async () => { await leaveRoomClean(); setGameState('map'); }}
                />
              )}
              </Suspense>
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

        {/* ═══ Level-Up Confetti ═══ */}
        <Confetti trigger={levelUpConfetti} theme="goldWhite" />

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

        {/* ═══ PK Waiting Toast ═══ */}
        <AnimatePresence>
          {gameState === 'map' && activeRoom?.type === 'pk' && activeRoom.status === 'playing' && user && activeRoom.players[user.id]?.finishedAt && !showPKResult && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 px-6 py-3 bg-indigo-600/90 backdrop-blur-md border border-indigo-400/50 rounded-2xl shadow-2xl"
            >
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <p className="text-white font-bold text-sm">
                {lang === 'en' ? 'Waiting for opponents...' : '等待对手完成...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ PK Countdown Bar ═══ */}
        <AnimatePresence>
          {pkCountdown !== null && pkCountdown > 0 && gameState === 'battle' && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="fixed top-14 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 px-5 py-2.5 bg-rose-600/90 backdrop-blur-md border border-rose-400/50 rounded-2xl shadow-2xl"
            >
              <span className="text-lg">⚡</span>
              <div className="flex-1">
                <p className="text-white font-black text-sm">
                  {lang === 'en'
                    ? `Opponent finished! ${pkCountdown}s left`
                    : `对手已完成！还剩 ${pkCountdown} 秒`}
                </p>
                <div className="h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    animate={{ width: `${(pkCountdown / PK_COUNTDOWN_SECS) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ PK Result Overlay ═══ */}
        <AnimatePresence>
          {showPKResult && activeRoom && user && (
            <Suspense fallback={<ScreenLoader lang={lang} label={lang === 'en' ? 'Loading result' : '正在加载结算'} />}>
              <PKResultPanel
                lang={lang}
                missions={missionSummaries}
                room={activeRoom}
                currentUserId={user.id}
                grade={profile?.grade ?? 7}
                onNextRound={async (missionId: number) => {
                  awardPkXp();
                  const ok = await startNextRound(missionId);
                  if (ok) {
                    setShowPKResult(false);
                    pkAutoCompleteRef.current = false;
                    setGameState('lobby');
                  }
                }}
                onClose={async () => {
                  awardPkXp();
                  setShowPKResult(false);
                  pkAutoCompleteRef.current = false;
                  await leaveRoomClean();
                }}
              />
            </Suspense>
          )}
        </AnimatePresence>

        {/* ═══ Item Reward Toast ═══ */}
        <AnimatePresence>
          {itemRewardToast && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-6 py-3 bg-purple-500/90 backdrop-blur-md border border-purple-400/50 rounded-2xl shadow-2xl pointer-events-none"
            >
              <span className="text-xl">{itemRewardToast.items[0]?.itemId === 'crystal' ? '💎' : itemRewardToast.items[0]?.itemId?.startsWith('scroll') ? '📜' : '🔨'}</span>
              <div>
                <p className="text-white font-black text-sm">
                  {lang === 'en' ? 'Item Obtained!' : lang === 'zh_TW' ? '獲得道具！' : '获得道具！'}
                </p>
                <p className="text-white/70 font-bold text-xs">
                  {itemRewardToast.items.map(i =>
                    i.itemId === 'crystal' ? (lang === 'en' ? 'Master Crystal' : '精通水晶') :
                    i.itemId === 'hammer' ? (lang === 'en' ? 'Repair Hammer' : lang === 'zh_TW' ? '修復錘' : '修复锤') :
                    (lang === 'en' ? 'Purify Scroll' : lang === 'zh_TW' ? '淨化卷軸' : '净化卷轴')
                  ).join(' + ')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ ExamHub Lesson Recovery Offer ═══ */}
        <AnimatePresence>
          {lessonRecoveryOffer && gameState === 'map' && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[85] w-[90%] max-w-sm bg-purple-600/95 backdrop-blur-md border border-purple-400/40 rounded-2xl shadow-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🎓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm mb-1">
                    {lang === 'en' ? 'Training Complete!' : '特训完成！'}
                  </p>
                  <p className="text-purple-200 text-xs mb-3">
                    {lang === 'en'
                      ? "You just finished a guided lesson. Ready for another try?"
                      : '你刚完成了引导课。准备好再挑战一次了吗？'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dismissLessonRecovery();
                        // Navigate to repair mode for the topic
                        setRepairTopicId(lessonRecoveryOffer.topicId);
                        setRepairPatternId(null);
                        setGameState('repair');
                      }}
                      className="flex-1 py-2 bg-white/20 text-white font-bold text-xs rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {lang === 'en' ? 'Retry Now →' : '再试一次 →'}
                    </button>
                    <button
                      onClick={dismissLessonRecovery}
                      className="px-3 py-2 text-purple-300/60 text-xs font-bold hover:text-purple-200 transition-colors"
                    >
                      {lang === 'en' ? 'Later' : '稍后'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Skill Heal Toast (shown after successful battle when health was low) ═══ */}
        <AnimatePresence>
          {skillHealToast && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[85] flex items-center gap-2 px-4 py-2 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/50 rounded-xl shadow-xl pointer-events-none"
            >
              <span className="text-sm">💚</span>
              <p className="text-white font-bold text-xs">
                {lang === 'en' ? `Skill +${skillHealToast.delta} HP → ${skillHealToast.newHealth}%` : `技能 +${skillHealToast.delta} HP → ${skillHealToast.newHealth}%`}
              </p>
            </motion.div>
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

        {/* ═══ Global Bottom Navigation (mobile only, hidden during battle/welcome/onboarding) ═══ */}
        {gameState !== 'welcome' && gameState !== 'onboarding' && gameState !== 'battle' && gameState !== 'repair' && (
          <BottomNav
            activeTab={
              mobileMenuOpen ? 'profile'
                : showHomeworkTab ? 'homework'
                : 'map'
            }
            onTabChange={(tab: BottomTab) => {
              if (tab === 'map') {
                setMobileMenuOpen(false);
                setShowHomeworkTab(false);
                if (gameState !== 'map') setGameState('map');
              } else if (tab === 'homework') {
                setMobileMenuOpen(false);
                setShowHomeworkTab(prev => !prev);
                if (gameState !== 'map') setGameState('map');
              } else if (tab === 'profile') {
                setShowHomeworkTab(false);
                setGameState('map');
                setMobileMenuOpen(prev => !prev);
              }
            }}
            lang={lang}
            badge={homeworkBadge > 0 ? { homework: homeworkBadge } : undefined}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
