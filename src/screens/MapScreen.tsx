import { useEffect, useRef, useState } from 'react';
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
import { MissionProgressBar } from '../components/MissionProgressBar';
import { SkillTreePanel } from '../components/SkillTreePanel';
import { EquipmentPanel } from '../components/EquipmentPanel';
import { EquipmentBadge } from '../components/EquipmentBadge';
import { BattlePassPanel } from '../components/BattlePassPanel';
import { getEquipmentState, countNeedsRepair } from '../utils/equipment';
import type { CharacterProgression } from '../types';

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
  getCharProgression,
  getTotalSP,
  onUnlockSkill,
  onEquipSkill,
  onRepairEquipment,
  onStartExpedition,
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
  // v7.0: Skill tree + Equipment
  getCharProgression?: (charId: string) => CharacterProgression;
  getTotalSP?: () => { total: number; spent: number };
  onUnlockSkill?: (charId: string, skillId: string) => void;
  onEquipSkill?: (charId: string, skillId: string | null) => void;
  onRepairEquipment?: (missionId: number) => void;
  onStartExpedition?: () => void;
}) => {
  const t = translations[lang];
  const { playTap, playBGMMap, stopBGM } = useAudio();

  // v7.0: Panel overlays
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  const [showBattlePass, setShowBattlePass] = useState(false);

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

  const nextUpRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

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

  // Auto-scroll to "Start here" card on initial load
  useEffect(() => {
    if (nextUpRef.current && !hasScrolled.current) {
      hasScrolled.current = true;
      const timer = setTimeout(() => {
        nextUpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600); // wait for entrance animations
      return () => clearTimeout(timer);
    }
  }, [gradeMissions.length]);

  // Streak tokens (stored in completed_missions as special keys)
  const streakTokens = ((profile.completed_missions as Record<string, unknown>)['_streak_tokens'] as number) || 0;

  return (
    <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
      {/* Profile Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Avatar — clickable to change character */}
          <button onClick={onCharChange} className="relative group">
            <div className="border-4 border-white/20 shadow-2xl rounded-full group-hover:border-indigo-400 transition-colors">
              <CharacterAvatar characterId={selectedChar?.id || ''} size={72} />
            </div>
            {/* Level badge on avatar */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-xs border-2 border-white/30 shadow-lg">
              {levelInfo.level}
            </div>
          </button>
          <div>
            <h3 className="text-white font-black text-lg md:text-2xl flex items-center gap-2">
              {profile.display_name}
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300">
                {rankName}
              </span>
            </h3>
            {/* XP Progress Bar */}
            <div className="flex items-center gap-2 mt-1.5">
              <Star size={12} className="text-yellow-400" />
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[120px] max-w-[200px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                />
              </div>
              <span className="text-[10px] text-yellow-400/70 font-bold">
                {levelInfo.xpForNextLevel > 0
                  ? `${levelInfo.currentXP}/${levelInfo.xpForNextLevel}`
                  : 'MAX'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-indigo-400 font-bold text-sm">{selectedChar ? lt(selectedChar.name, lang) : ''}</p>
              <span className="text-white/20">|</span>
              <button
                onClick={onGradeChange}
                className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors"
              >
                {t.year} {profile.grade}
              </button>
              <button
                onClick={onCharChange}
                className="px-2 py-0.5 bg-indigo-600/20 border border-indigo-500/30 rounded text-xs text-indigo-300 hover:bg-indigo-600/40 transition-colors"
              >
                {t.switchChar}
              </button>
              {/* Streak tokens */}
              {streakTokens > 0 && (
                <span className={`px-2 py-0.5 rounded text-xs font-black flex items-center gap-1 ${streakTokens >= 3 ? 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-300' : 'bg-orange-600/20 border border-orange-500/30 text-orange-300'}`}>
                  <Flame size={12} /> {streakTokens} {t.streakToken}
                  {streakTokens >= 3 && <> · <Crown size={10} /> {t.streakKing}</>}
                </span>
              )}
              {/* v7.0: Skill Tree + Equipment buttons */}
              {getCharProgression && selectedChar && (
                <button
                  onClick={() => setShowSkillTree(true)}
                  className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-300 hover:bg-purple-600/40 transition-colors"
                >
                  {(t as any).skillTree ?? 'Skills'}
                </button>
              )}
              {onRepairEquipment && (() => {
                const repairCount = countNeedsRepair(profile.completed_missions as Record<string, unknown>);
                return (
                  <button
                    onClick={() => setShowEquipmentPanel(true)}
                    className="relative px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors"
                  >
                    {(t as any).equipmentArsenal ?? 'Arsenal'}
                    {repairCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {repairCount}
                      </span>
                    )}
                  </button>
                );
              })()}
              <button
                onClick={() => setShowBattlePass(true)}
                className="px-2 py-0.5 bg-rose-600/20 border border-rose-500/30 rounded text-xs text-rose-300 hover:bg-rose-600/40 transition-colors"
              >
                {lang === 'en' ? 'Handbook' : '手册'}
              </button>
              {onStartExpedition && (
                <button
                  onClick={onStartExpedition}
                  className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-300 hover:bg-orange-600/40 transition-colors animate-pulse"
                >
                  {lang === 'en' ? 'Expedition' : '远征'}
                </button>
              )}
              {onDashboard && (
                <button
                  onClick={onDashboard}
                  className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/30 rounded text-xs text-emerald-300 hover:bg-emerald-600/40 transition-colors"
                >
                  {t.dashboard}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-8 md:gap-12">
          <div className="text-center">
            <span className="block text-slate-400 text-xs font-bold uppercase mb-1 tracking-widest">{t.totalScore}</span>
            <MathView tex={profile.total_score} className="text-2xl md:text-4xl font-black text-yellow-400" />
          </div>
          <div className="text-center">
            <span className="block text-slate-400 text-xs font-bold uppercase mb-1 tracking-widest">{t.level}</span>
            <span className="text-2xl md:text-4xl font-black text-amber-400">{levelInfo.level}</span>
          </div>
          <div className="text-center">
            <span className="block text-slate-400 text-xs font-bold uppercase mb-1 tracking-widest">{t.completed}</span>
            <MathView tex={completedCount} className="text-2xl md:text-4xl font-black text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      {dailyMission && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl border-2 p-4 md:p-6 ${
            dailyDone
              ? 'bg-emerald-900/30 border-emerald-500/30'
              : 'bg-gradient-to-r from-yellow-900/40 via-amber-900/40 to-yellow-900/40 border-yellow-500/40'
          }`}
        >
          {!dailyDone && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent animate-pulse pointer-events-none" />
          )}
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dailyDone ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`}>
                <Zap size={24} className={dailyDone ? 'text-emerald-400' : 'text-yellow-400'} />
              </div>
              <div>
                <h4 className={`font-black text-lg ${dailyDone ? 'text-emerald-300' : 'text-yellow-300'}`}>
                  {t.dailyChallenge}
                  {!dailyDone && <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-yellow-500/20 rounded-full">{t.dailyReward}</span>}
                </h4>
                <p className="text-white/60 text-sm">
                  {dailyDone
                    ? <><CheckCircle2 size={14} className="inline text-emerald-400 mr-1" />{t.dailyCompleted} · {t.dailyCountdown} {formatCountdown(countdown)}</>
                    : <>{lt(dailyMission.title, lang)} — {t.questionTypes[dailyMission.type]}</>
                  }
                </p>
              </div>
            </div>
            {!dailyDone && onDailyChallenge && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playTap(); onDailyChallenge(dailyMission); }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-shadow"
              >
                <Swords size={16} className="inline mr-2" />
                {t.missionStart}
              </motion.button>
            )}
            {dailyDone && (
              <div className="text-emerald-400/60 text-sm font-bold">{t.dailyTomorrow}</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Multiplayer — hidden until Phase 5 */}

      {/* Mission Grid with World Map Background */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1a1a2e]">
        <img
          src={lang === 'zh' ? './map/world-map-zh.png' : './map/world-map-en.png'}
          alt="Three Kingdoms Map"
          loading="lazy"
          className="w-full rounded-3xl opacity-10 md:opacity-30 absolute inset-0 object-cover h-full pointer-events-none"
        />
        <div className="relative z-10 space-y-16 p-4 md:p-8">
        {gradeMissions.length === 0 ? (
          <EmptyState 
            icon={<MapIcon size={48} />} 
            title={t.noMissions}
            description={t.noMissionsDesc} 
          />
        ) : (
          Array.from(new Set(gradeMissions.map(m => lt(m.unitTitle, lang)))).map((unitTitle, unitIndex) => {
            const unitMissions = gradeMissions.filter(m => lt(m.unitTitle, lang) === unitTitle).sort((a, b) => a.order - b.order);
            const completedSet = new Set(unitMissions.filter(m => {
              const c = profile.completed_missions[String(m.id)];
              return c && Object.values(c).some(Boolean);
            }).map(m => String(m.id)));
            const unitComplete = unitMissions.length > 0 && completedSet.size === unitMissions.length;
            // Find first playable (unlocked + not completed) mission in unit
            const firstPlayable = unitMissions.find((m, i) => {
              const done = completedSet.has(String(m.id));
              if (done) return false;
              if (i === 0) return true;
              return completedSet.has(String(unitMissions[i - 1].id));
            });

            return (
            <div key={unitTitle} className="space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <div className="flex items-center gap-3">
                <img
                  src={CHAPTER_IMAGES[unitIndex % CHAPTER_IMAGES.length]}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400/30 shadow-lg"
                />
                <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <MapIcon className="text-indigo-400" />
                  {unitTitle}
                  {unitComplete && (
                    <span className="ml-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full normal-case tracking-normal">
                      {(t as any).unitConquered ?? 'Conquered'}
                    </span>
                  )}
                </h3>
              </div>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>
            {/* Mission progress bar */}
            <MissionProgressBar
              missions={unitMissions}
              completedIds={completedSet}
              currentId={firstPlayable?.id}
            />
            <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {unitMissions
                .map(mission => {
                  const comp = profile.completed_missions[String(mission.id)];
                  const isNextUp = mission.id === firstPlayable?.id;
                  const isCompleted = comp && Object.values(comp).some(Boolean);
                  const prevMission = gradeMissions.find(m => m.unitId === mission.unitId && m.order === mission.order - 1);
                  const prevComp = prevMission ? profile.completed_missions[String(prevMission.id)] : null;
                  const isLocked = mission.order > 1 && prevMission && !(prevComp && Object.values(prevComp).some(Boolean));
                  const isPlayable = !isLocked && !isCompleted;
                  const isPerfect = comp?.green && comp?.amber && comp?.red;
                  const isLastCleared = lastClearedMissionId === mission.id;
                  
                  const cardVariants = isLocked ? { initial: { opacity: 0.5, y: 0 }, animate: { opacity: 0.5, y: 0 } } : staggerItem;

                  return (
                    <motion.div
                      key={mission.id}
                      ref={isNextUp ? nextUpRef : undefined}
                      variants={cardVariants}
                      className="relative group"
                      {...(!isLocked ? {
                        whileHover: { y: -4, boxShadow: "0 12px 40px rgba(99,102,241,0.15)" },
                        whileTap: { y: -2, scale: 0.98 },
                        transition: { type: "spring", stiffness: 300, damping: 20 },
                      } : {})}
                    >
                      <motion.div
                        animate={isPlayable ? { scale: [1, 1.02, 1] } : (isLastCleared ? { borderColor: ['#e2e8f0', '#facc15', '#facc15', '#e2e8f0'] } : {})}
                        transition={isPlayable ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : (isLastCleared ? { duration: 2.5, ease: "easeInOut" } : {})}
                        className={`bg-white rounded-[2rem] p-5 md:p-8 shadow-2xl border-2 transition-shadow ${isLocked ? 'opacity-50 grayscale border-transparent' : isNextUp ? 'border-amber-400 shadow-amber-500/20' : isLastCleared ? 'border-transparent' : 'border-transparent hover:shadow-indigo-500/20'}`}
                      >
                        {isNextUp && (
                          <div className="absolute -top-3 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full z-10 shadow-md">
                            {(t as any).startHere ?? 'Start here!'}
                          </div>
                        )}
                        {isLastCleared && (
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 1, 1, 0], y: -60, scale: 1.3 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg font-black text-yellow-400 z-50 pointer-events-none drop-shadow-md whitespace-nowrap"
                          >
                            {(t as any).missionCleared ?? 'Cleared!'}
                          </motion.div>
                        )}
                        {isPerfect && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5, damping: 12 }}
                            className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg border-2 border-white z-10 group/badge"
                          >
                            <Crown size={20} className="text-white" />
                            <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {t.perfectClear}
                            </div>
                          </motion.div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            mission.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                            mission.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {t.difficulty[mission.difficulty]}
                          </div>
                          {isCompleted ? (
                            <motion.div {...springIn} transition={{ type: "spring", bounce: 0.4 }} className="flex gap-1">
                              {comp?.green && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                              {comp?.amber && <div className="w-3 h-3 rounded-full bg-amber-500" />}
                              {comp?.red && <div className="w-3 h-3 rounded-full bg-rose-500" />}
                              <CheckCircle2 className="text-emerald-500 ml-1" size={20} />
                            </motion.div>
                          ) : isLocked ? <Lock className="text-slate-400" size={28} /> : null}
                        </div>
                        <h4 className="text-lg md:text-2xl font-black text-slate-800 mb-1">{lt(mission.title, lang)}</h4>
                        <p className="text-indigo-600 text-[10px] font-bold mb-3 uppercase">{t.questionTypes[mission.type]}</p>
                        <LatexText text={interpolate(lt(mission.description, lang), mission.data ?? {})} className="text-slate-500 text-sm mb-8 line-clamp-3 block" />
                        <div className="flex gap-2">
                          <motion.button
                            {...(isLocked ? {} : { ...tapScale, ...hoverGlow })}
                            disabled={!!isLocked}
                            onClick={() => { playTap(); onPracticeStart(mission); }}
                            className={`flex-1 py-3 rounded-2xl font-black flex items-center justify-center gap-1.5 text-xs md:text-sm min-h-12 ${
                              isLocked ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                            }`}
                          >
                            <BookOpen size={16} />
                            {isLocked ? t.locked : t.practice}
                          </motion.button>
                          <motion.button
                            {...(isLocked ? {} : { ...tapScale, ...hoverGlow })}
                            disabled={!!isLocked}
                            onClick={() => { playTap(); onMissionStart(mission); }}
                            className={`flex-1 py-3 rounded-2xl font-black flex items-center justify-center gap-1.5 text-xs md:text-sm min-h-12 ${
                              isLocked ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            }`}
                          >
                            <Swords size={16} />
                            {isLocked ? t.locked : t.challenge}
                          </motion.button>
                        </div>
                        {isLocked && (
                          <p className="mt-2 text-[10px] text-rose-500 font-bold text-center">{t.lockedByOrder}</p>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
            </motion.div>
          </div>
          );
        }))}
        </div>
      </div>
      {/* v7.0: Skill Tree Panel */}
      {showSkillTree && selectedChar && getCharProgression && getTotalSP && onUnlockSkill && onEquipSkill && (
        <SkillTreePanel
          lang={lang}
          charId={selectedChar.id}
          charName={lt(selectedChar.name, lang)}
          progression={getCharProgression(selectedChar.id)}
          availableSP={(() => { const sp = getTotalSP(); return sp.total - sp.spent; })()}
          onUnlock={(skillId) => onUnlockSkill(selectedChar.id, skillId)}
          onEquip={(skillId) => onEquipSkill(selectedChar.id, skillId)}
          onClose={() => setShowSkillTree(false)}
        />
      )}

      {/* v7.2: Battle Pass / Growth Handbook */}
      {showBattlePass && (
        <BattlePassPanel
          lang={lang}
          completedMissions={profile.completed_missions as Record<string, unknown>}
          onClose={() => setShowBattlePass(false)}
        />
      )}

      {/* v7.0: Equipment Panel */}
      {showEquipmentPanel && onRepairEquipment && (
        <EquipmentPanel
          lang={lang}
          completedMissions={profile.completed_missions as Record<string, unknown>}
          missions={missions}
          onRepair={(missionId) => {
            setShowEquipmentPanel(false);
            onRepairEquipment(missionId);
          }}
          onClose={() => setShowEquipmentPanel(false)}
        />
      )}
    </motion.div>
  );
};
