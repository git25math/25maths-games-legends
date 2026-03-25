import { useState, useEffect, Component } from 'react';
import 'katex/dist/katex.min.css';
import { AnimatePresence, motion } from 'motion/react';
import { Languages, LogOut, XCircle } from 'lucide-react';

import type { Language, Mission, GameState, DifficultyMode } from './types';
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
import { cleanStalePracticeKeys } from './hooks/usePracticeState';
import { getActiveSkillEffect } from './data/heroSkills';
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
    const safeState = (gameState === 'battle' || gameState === 'onboarding' || gameState === 'expedition') ? 'map' : gameState;
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
  const [selectedDifficulty] = useState<DifficultyMode>('red');
  const [isGuest, setIsGuest] = useState(persisted.isGuest);
  const [lastClearedMissionId, setLastClearedMissionId] = useState<number | null>(null);
  const [isDailyBattle, setIsDailyBattle] = useState(false);
  const [isRepairMode, setIsRepairMode] = useState(false);
  const [activeExpedition, setActiveExpedition] = useState<Expedition | null>(null);

  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const {
    profile, updateProfile, recordBattleComplete,
    getCharProgression, getTotalSP, unlockSkill, equipSkill, grantSkillPoint,
    markEquipment, repairEquipment,
  } = useProfile(user, isGuest);
  const { missions } = useMissions();
  const { activeRoom, createRoom, toggleReady, startGame, leaveRoom } = useMultiplayer(user, profile);

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

  // If not logged in and stuck on a screen that requires auth, redirect to welcome
  useEffect(() => {
    if (!authLoading && !user && !isGuest && gameState !== 'welcome' && gameState !== 'dashboard') {
      setGameState('welcome');
    }
  }, [authLoading, user, isGuest, gameState]);

  const selectedChar = CHARACTERS.find(c => c.id === (selectedCharId || profile?.selected_char_id));

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
      // Multi-question missions: show skill card selector first
      setActiveMission(battleMission);
      setSelectedSkillCard(null);
      setShowSkillCards(true);
    } else {
      // Single-question: go directly to ScrollOfWisdom
      setActiveMission(battleMission);
      setShowSecret(true);
    }
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

  const handleStreakToken = () => {
    if (!profile) return;
    const currentTokens = ((profile.completed_missions as Record<string, unknown>)['_streak_tokens'] as number) || 0;
    updateProfile({
      completed_missions: { ...profile.completed_missions, _streak_tokens: currentTokens + 1 } as any,
    });
  };

  const handlePracticeStart = (mission: Mission) => {
    setActiveMission(mission);
    setGameState('practice');
  };

  const handleBattleComplete = async (success: boolean, score = 0, durationSecs = 0, hpRemaining = 0) => {
    if (success && activeMission && profile) {
      // v7.0: Detect level-up for skill point grant
      const prevLevel = getLevelInfo(profile.total_score).level;

      // If daily challenge, inject daily key into completed_missions BEFORE
      // recordBattleComplete, which spreads profile.completed_missions internally.
      if (isDailyBattle) {
        (profile.completed_missions as Record<string, unknown>)[getDailyKey()] = true;
      }

      await recordBattleComplete(
        activeMission.id,
        selectedDifficulty,
        success,
        score,
        durationSecs,
        hpRemaining,
        activeMission.topic,
        activeMission.kpId,
      );
      setLastClearedMissionId(activeMission.id);

      // v7.0: Grant skill points on level-up (batch, single update)
      const newLevel = getLevelInfo(profile.total_score + score).level;
      const levelsGained = newLevel - prevLevel;
      if (levelsGained > 0) {
        await grantSkillPoint(levelsGained);
      }

      // v7.0: Mark equipment on Red difficulty win
      if (selectedDifficulty === 'red') {
        await markEquipment(activeMission.id);
      }

      // v7.2: Season task tracking
      if (profile) {
        const cm = { ...profile.completed_missions } as any;
        let sp = getSeasonProgress(cm);
        sp = incrementTaskCount(sp, 'daily_battles_3');
        if (selectedDifficulty === 'red') {
          sp = incrementTaskCount(sp, 'weekly_red_3');
        }
        // Evaluate milestones
        const { updatedProgress } = evaluateAndUpdateTasks(profile, sp);
        cm._season = updatedProgress;
        await updateProfile({ completed_missions: cm });
      }
    }
    setIsDailyBattle(false);
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
            />
          )}
        </AnimatePresence>

        {/* Version indicator */}
        <div className="fixed bottom-1 left-1 z-50 text-white/15 text-[9px] font-mono">v7.0.0</div>

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
                />
              )}

              {gameState === 'lobby' && activeRoom && user && (
                <LobbyScreen
                  lang={lang}
                  room={activeRoom}
                  userId={user.id}
                  onReady={toggleReady}
                  onStart={startGame}
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
                  onStreakToken={handleStreakToken}
                  heroSkillEffect={selectedChar ? getActiveSkillEffect(getCharProgression(selectedChar.id)) : null}
                />
              )}

              {gameState === 'practice' && activeMission && selectedChar && (
                <PracticeScreen
                  mission={activeMission}
                  character={selectedChar}
                  lang={lang}
                  onComplete={async () => {
                    // Save practice completion — all 3 phases done + award XP
                    if (profile) {
                      const cm = { ...profile.completed_missions } as any;
                      const key = String(activeMission.id);
                      const isFirstClear = !cm[key]?.red;
                      cm[key] = { ...(cm[key] || {}), green: true, amber: true, red: true };
                      const xpReward = isFirstClear ? (activeMission.reward || 100) : Math.round((activeMission.reward || 100) * 0.2);
                      await updateProfile({
                        completed_missions: cm,
                        total_score: profile.total_score + xpReward,
                      });
                      setLastClearedMissionId(activeMission.id);
                    }
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
                    const bonus = await repairEquipment(activeMission.id);
                    setIsRepairMode(false);
                    setGameState('map');
                    setActiveMission(null);
                    // TODO: show repair success toast with bonus XP on MapScreen
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
}
