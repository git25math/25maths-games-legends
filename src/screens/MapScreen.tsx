import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapIcon, Crown, CheckCircle2, Lock, Swords, BookOpen, Star, Flame, Zap } from 'lucide-react';
import type { Language, UserProfile, Mission, Character } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { MathView, LatexText } from '../components/MathView';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { interpolate } from '../utils/interpolate';
import { useAudio } from '../audio';
import { tapScale, hoverGlow, springIn, staggerContainer, staggerItem } from '../utils/animationPresets';
import { EmptyState } from '../components/EmptyState';
import { getLevelInfo } from '../utils/xpLevels';
import { getDailyMission, isDailyCompleted, getSecondsUntilMidnight, formatCountdown } from '../utils/dailyChallenge';

const CHAPTER_IMAGES = [
  './map/ch1-peach-garden.png',
  './map/ch2-hulao-pass.png',
  './map/ch3-guandu.png',
  './map/ch4-longzhong.png',
  './map/ch5-red-cliffs.png',
  './map/ch6-jingzhou.png',
  './map/ch7-northern-campaign.png',
  './map/ch8-probability.png',
  './map/ch9-unification.png',
];

export const MapScreen = ({
  lang,
  profile,
  missions,
  selectedChar,
  onMissionStart,
  onPracticeStart,
  onGradeChange,
  onCharChange,
  onCreateRoom,
  onDashboard,
  onDailyChallenge,
  lastClearedMissionId,
  clearLastClearedMission,
}: {
  lang: Language;
  profile: UserProfile;
  missions: Mission[];
  selectedChar: Character | undefined;
  onMissionStart: (mission: Mission) => void;
  onPracticeStart: (mission: Mission) => void;
  onGradeChange: () => void;
  onCharChange: () => void;
  onCreateRoom: (type: 'team' | 'pk', missionId: number) => void;
  onDashboard?: () => void;
  onDailyChallenge?: (mission: Mission) => void;
  lastClearedMissionId?: number | null;
  clearLastClearedMission?: () => void;
}) => {
  const t = translations[lang];
  const { playTap, playBGMMap, stopBGM } = useAudio();

  // Daily challenge countdown timer
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight());
  useEffect(() => {
    const timer = setInterval(() => setCountdown(getSecondsUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    playBGMMap();
    return () => stopBGM();
  }, []);

  useEffect(() => {
    if (lastClearedMissionId && clearLastClearedMission) {
      const timer = setTimeout(() => {
        clearLastClearedMission();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastClearedMissionId, clearLastClearedMission]);

  const gradeMissions = missions.filter(m => m.grade === profile.grade);
  const completedCount = Object.keys(profile.completed_missions).filter(id =>
    // Skip special keys (daily_*, _streak_tokens)
    !id.startsWith('daily_') && !id.startsWith('_') &&
    Object.values(profile.completed_missions[id] || {}).some(Boolean)
  ).length;

  // XP Level info
  const levelInfo = getLevelInfo(profile.total_score);
  const rankName = levelInfo.rank[lang === 'zh_TW' ? 'zh_TW' : lang === 'en' ? 'en' : 'zh'];

  // Daily challenge
  const dailyMission = getDailyMission(missions, profile.grade);
  const dailyDone = isDailyCompleted(profile.completed_missions);

  // Streak tokens (stored in completed_missions as special keys)
  const streakTokens = ((profile.completed_missions as Record<string, unknown>)['_streak_tokens'] as number) || 0;

  return (
    <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 pb-20">
      {/* Profile Header — Tactical Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-slate-950/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-indigo-500/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-indigo-500/30" />
        
        <div className="flex items-center gap-6 relative z-10">
          <button onClick={onCharChange} className="relative group">
            <div className="border-2 border-indigo-500/30 p-1 rounded-xl bg-slate-900 shadow-[0_0_20px_rgba(79,70,229,0.15)] group-hover:border-indigo-400 transition-all">
              <CharacterAvatar characterId={selectedChar?.id || ''} size={80} className="rounded-lg" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-lg px-2 py-1 flex items-center justify-center text-white font-mono font-bold text-[10px] border border-white/20 shadow-lg">
              LVL_{levelInfo.level}
            </div>
          </button>
          
          <div className="space-y-2">
            <h3 className="text-white font-black text-xl md:text-3xl flex items-center gap-3 tracking-tight">
              {profile.display_name}
              <span className="font-mono text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-400/20 rounded text-indigo-300 uppercase tracking-widest">
                {rankName}
              </span>
            </h3>
            
            {/* XP Progress Bar Tactical */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Experience_Yield</span>
                <span className="font-mono text-[9px] text-indigo-400/70">{levelInfo.currentXP} / {levelInfo.xpForNextLevel}</span>
              </div>
              <div className="w-full md:w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress * 100}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button onClick={onGradeChange} className="font-mono text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/60 hover:bg-white/10 transition-all uppercase tracking-tighter">
                YEAR_{profile.grade}
              </button>
              <button onClick={onCharChange} className="font-mono text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/60 hover:bg-white/10 transition-all uppercase tracking-tighter">
                SWITCH_OPERATOR
              </button>
              {streakTokens > 0 && (
                <span className="font-mono text-[10px] px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded text-orange-400 uppercase flex items-center gap-1.5">
                  <Flame size={10} /> {streakTokens} TOKENS
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8 md:gap-12 border-l border-white/5 pl-8 hidden lg:flex">
          <div className="text-right">
            <span className="block text-white/20 font-mono text-[9px] uppercase mb-1 tracking-[0.2em]">Asset_Score</span>
            <span className="text-3xl font-black text-white font-mono tracking-tighter">{profile.total_score.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="block text-white/20 font-mono text-[9px] uppercase mb-1 tracking-[0.2em]">Nodes_Cleared</span>
            <span className="text-3xl font-black text-emerald-500 font-mono tracking-tighter">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Daily Challenge — Tactical Priority */}
      {dailyMission && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl border p-6 ${
            dailyDone
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-indigo-600/10 border-indigo-500/30'
          }`}
        >
          <div className="absolute top-2 right-4 font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">Priority_Target_Daily</div>
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${dailyDone ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse'}`}>
                <Zap size={28} />
              </div>
              <div className="space-y-1">
                <h4 className={`font-black text-xl tracking-tight ${dailyDone ? 'text-emerald-400' : 'text-white'}`}>
                  {t.dailyChallenge}
                  {!dailyDone && <span className="ml-3 text-[9px] font-mono font-bold px-2 py-0.5 bg-indigo-500 text-white rounded uppercase tracking-widest">{t.dailyReward}</span>}
                </h4>
                <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  {dailyDone
                    ? <span className="text-emerald-500/60 flex items-center gap-2"><CheckCircle2 size={12} /> {t.dailyCompleted} // REFRESH_IN {formatCountdown(countdown)}</span>
                    : <>{lt(dailyMission.title, lang)} // TYPE: {t.questionTypes[dailyMission.type]}</>
                  }
                </div>
              </div>
            </div>
            {!dailyDone && onDailyChallenge && (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { playTap(); onDailyChallenge(dailyMission); }}
                className="px-8 py-3 bg-white text-black font-black text-xs rounded-xl uppercase tracking-[0.3em] transition-all"
              >
                DEPLOY_NOW
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Mission Grid with Tactical Topography Background */}
      <div className="relative rounded-3xl overflow-hidden bg-[#020205] border border-white/5">
        {/* Digital Grid/Topo Background */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ 
          backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px), linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
          backgroundSize: '40px 40px, 80px 80px, 80px 80px'
        }} />
        
        <div className="relative z-10 space-y-20 p-6 md:p-12">
        {gradeMissions.length === 0 ? (
          <EmptyState 
            icon={<MapIcon size={48} className="text-white/20" />} 
            title={lang === 'zh' ? '暂无关卡' : 'NO_OPERATIONS_AVAILABLE'} 
            description={lang === 'en' ? 'Node initialization in progress.' : '该年级的关卡正在建设中。'} 
          />
        ) : (
          Array.from(new Set(gradeMissions.map(m => lt(m.unitTitle, lang)))).map((unitTitle, unitIndex) => (
            <div key={unitTitle} className="space-y-8">
              <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-6">
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-indigo-500/60 uppercase tracking-[0.4em]">Sector_0{unitIndex + 1}</div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                    {unitTitle}
                    <div className="h-0.5 w-12 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                  </h3>
                </div>
                <div className="h-px flex-1 bg-white/5" />
              </motion.div>

              <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gradeMissions
                  .filter(m => lt(m.unitTitle, lang) === unitTitle)
                  .sort((a, b) => a.order - b.order)
                  .map(mission => {
                    const comp = profile.completed_missions[String(mission.id)];
                    const isCompleted = comp && Object.values(comp).some(Boolean);
                    const prevMission = gradeMissions.find(m => m.unitId === mission.unitId && m.order === mission.order - 1);
                    const prevComp = prevMission ? profile.completed_missions[String(prevMission.id)] : null;
                    const isLocked = mission.order > 1 && prevMission && !(prevComp && Object.values(prevComp).some(Boolean));
                    const isPlayable = !isLocked && !isCompleted;
                    
                    return (
                      <motion.div
                        key={mission.id}
                        variants={staggerItem}
                        className="relative group"
                      >
                        <div className={`relative h-full bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border transition-all duration-500 ${
                          isLocked ? 'border-white/5 opacity-40 grayscale' : 
                          isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' : 
                          'border-white/10 hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.1)]'
                        }`}>
                          {/* Node ID Tag */}
                          <div className="absolute top-3 right-4 font-mono text-[9px] text-white/20 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">
                            NODE_ID_{mission.id.toString().padStart(3, '0')}
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-widest border ${
                                mission.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                                mission.difficulty === 'Medium' ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' :
                                'border-red-500/30 text-red-400 bg-red-500/5'
                              }`}>
                                {mission.difficulty}
                              </div>
                              {isCompleted && (
                                <div className="flex gap-1 items-center">
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                  <div className="flex gap-0.5">
                                    {comp?.green && <div className="w-1.5 h-3 bg-emerald-500 rounded-sm" />}
                                    {comp?.amber && <div className="w-1.5 h-3 bg-orange-500 rounded-sm" />}
                                    {comp?.red && <div className="w-1.5 h-3 bg-red-500 rounded-sm" />}
                                  </div>
                                </div>
                              )}
                              {isLocked && <Lock size={16} className="text-white/20" />}
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-indigo-300 transition-colors">{lt(mission.title, lang)}</h4>
                              <div className="font-mono text-[9px] text-indigo-500/60 uppercase tracking-widest">{t.questionTypes[mission.type]}</div>
                            </div>

                            <p className="text-white/40 text-xs leading-relaxed line-clamp-2 font-mono h-8">
                              {lt(mission.description, lang)}
                            </p>

                            <div className="flex gap-2 pt-2">
                              {!isLocked ? (
                                <>
                                  <motion.button
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    onClick={() => { playTap(); onPracticeStart(mission); }}
                                    className="flex-1 py-2.5 border border-white/10 rounded-xl font-mono text-[10px] text-white/60 uppercase tracking-widest flex items-center justify-center gap-2 hover:border-white/30 transition-all"
                                  >
                                    <BookOpen size={12} />
                                    DRY_RUN
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { playTap(); onMissionStart(mission); }}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                                  >
                                    <Swords size={12} />
                                    ENGAGE
                                  </motion.button>
                                </>
                              ) : (
                                <div className="w-full py-2.5 bg-white/5 rounded-xl text-center font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">
                                  LOCKED_DATA
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </div>
          )))}
        </div>
      </div>
    </motion.div>
  );
};
