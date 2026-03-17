import { useState, Component } from 'react';
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
import { DifficultySelector } from './components/DifficultySelector';
import { MathBattle } from './components/MathBattle';
import { generateMission } from './utils/generateMission';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { GradeSelectScreen } from './screens/GradeSelectScreen';
import { MapScreen } from './screens/MapScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { PracticeScreen } from './screens/PracticeScreen';

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
            <h2 className="text-2xl font-black text-white mb-4">系统错误</h2>
            <p className="text-slate-400 mb-8">出错了，请稍后再试。</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all">
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>('green');
  const [isGuest, setIsGuest] = useState(false);

  const { user, signIn, signUp, signOut } = useAuth();
  const { profile, updateProfile, recordBattleComplete } = useProfile(user, isGuest);
  const { missions } = useMissions();
  const { activeRoom, createRoom, toggleReady, startGame, leaveRoom } = useMultiplayer(user, profile);

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
    }
    setActiveMission(battleMission);
    setSelectedDifficulty('red'); // Challenge = no hints
    setShowSecret(true);
  };

  const handlePracticeStart = (mission: Mission) => {
    setActiveMission(mission);
    setGameState('practice');
  };

  const handleDifficultySelect = (mode: DifficultyMode) => {
    setSelectedDifficulty(mode);
    setShowDifficultySelector(false);
    // Randomize: if mission has generatorType, generate new data
    if (activeMission?.data?.generatorType) {
      setActiveMission(generateMission(activeMission));
    }
    setShowSecret(true);
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
        {/* Top controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all"
          >
            <Languages size={18} />
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          {user && (
            <button
              onClick={signOut}
              className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full hover:bg-rose-500/30 transition-all"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {showDifficultySelector && activeMission && (
            <DifficultySelector
              lang={lang}
              completion={profile?.completed_missions[String(activeMission.id)]}
              onSelect={handleDifficultySelect}
              onClose={() => setShowDifficultySelector(false)}
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
              />
            )}

            {gameState === 'map' && profile && !profile.grade && (
              <GradeSelectScreen
                lang={lang}
                onSelect={(g) => updateProfile({ grade: g })}
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
        </div>
      </div>
    </ErrorBoundary>
  );
}
