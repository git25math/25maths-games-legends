import { useState, useEffect, Component } from 'react';
import 'katex/dist/katex.min.css';
import { AnimatePresence } from 'motion/react';
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
import { WelcomeScreen } from './screens/WelcomeScreen';
import { GradeSelectScreen } from './screens/GradeSelectScreen';
import { MapScreen } from './screens/MapScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { DashboardScreen } from './screens/DashboardScreen';

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
    // Battle can't be restored (complex internal state) → save as map
    const safeState = gameState === 'battle' ? 'map' : gameState;
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

  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { profile, updateProfile, recordBattleComplete } = useProfile(user, isGuest);
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

  const handlePracticeStart = (mission: Mission) => {
    setActiveMission(mission);
    setGameState('practice');
  };

  const handleBattleComplete = async (success: boolean, score = 0, durationSecs = 0, hpRemaining = 0) => {
    if (success && activeMission && profile) {
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
    }
    setGameState('map');
    setActiveMission(null);
  };

  const handleGuest = () => {
    setIsGuest(true);
    // Profile will be auto-loaded from localStorage by useProfile
  };

  const isLoggedIn = !!user || isGuest;

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
        <div className="fixed bottom-1 left-1 z-50 text-white/15 text-[9px] font-mono">v1.0.2</div>

        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
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
                onDashboard={() => setGameState('dashboard')}
              />
            )}

            {gameState === 'map' && profile && !profile.grade && (
              <GradeSelectScreen
                lang={lang}
                onSelect={(g, cls) => updateProfile({ grade: g, ...(cls ? { class_name: cls } : {}) })}
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
          </AnimatePresence>

          {gameState === 'battle' && activeMission && selectedChar && (
            <MathBattle
              mission={activeMission}
              character={selectedChar}
              onComplete={handleBattleComplete}
              onCancel={() => setGameState('map')}
              lang={lang}
              difficultyMode={selectedDifficulty}
              isMultiplayer={!!activeRoom}
              roomData={activeRoom}
              skillCard={selectedSkillCard}
            />
          )}

          {gameState === 'practice' && activeMission && selectedChar && (
            <PracticeScreen
              mission={activeMission}
              character={selectedChar}
              lang={lang}
              onComplete={() => {
                setGameState('map');
                setActiveMission(null);
              }}
              onCancel={() => {
                setGameState('map');
                setActiveMission(null);
              }}
            />
          )}

          {gameState === 'dashboard' && (
            <DashboardScreen
              lang={lang}
              onClose={() => setGameState('welcome')}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
