import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapIcon, Crown, CheckCircle2, Lock, Swords, BookOpen, Star, Flame, Zap, ChevronDown, ChevronRight, Wrench, AlertTriangle, ClipboardList, MoreHorizontal, X } from 'lucide-react';
import type { Language, UserProfile, Mission, Character } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { MathView, LatexText } from '../components/MathView';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { interpolate } from '../utils/interpolate';
import { useAudio } from '../audio';
import { supabase } from '../supabase';
import { tapScale, hoverGlow, springIn, staggerContainer, staggerItem } from '../utils/animationPresets';
import { EmptyState } from '../components/EmptyState';
import { getLevelInfo } from '../utils/xpLevels';
import { getDailyMission, isDailyCompleted, getSecondsUntilMidnight, formatCountdown } from '../utils/dailyChallenge';
import { MissionProgressBar } from '../components/MissionProgressBar';
import { SkillTreePanel } from '../components/SkillTreePanel';
import { EquipmentPanel } from '../components/EquipmentPanel';
import { InventoryPanel } from '../components/InventoryPanel';
import { ShopPanel } from '../components/ShopPanel';
import { RepairDialog } from '../components/RepairDialog';
import { BattlePassPanel } from '../components/BattlePassPanel';
import { DailyQuestPanel } from '../components/DailyQuestPanel';
import { StrategicScrollsPanel } from '../components/StrategicScrollsPanel';
import { getSeasonLevel, getSeasonBorder, getSeasonTitle } from '../data/seasons/season1';
import { getSeasonProgress } from '../utils/seasonTracker';
import { getEquipmentState, countNeedsRepair, EQUIPMENT_COLORS, getEquipmentHealth } from '../utils/equipment';
import { healthToEquipmentState } from '../utils/repairItems';
import type { KPEquipment, EquipmentState } from '../types';
import { getExpeditionsForGrade, type Expedition } from '../data/expeditions';
import { getNextMilestone } from '../data/streakMilestones';
import { getWeakMissions, getMistakes, rankByWeakness, getDominantPattern } from '../utils/errorMemory';
import type { MistakeRecord } from '../utils/errorMemory';
import { AssignmentBanner, useAssignedMissionIds } from '../components/AssignmentBanner';
import { StaminaBar } from '../components/StaminaBar';
import { getStamina, getRemainingAttempts } from '../utils/stamina';
import { getInventory, getTotalItems } from '../utils/inventory';
import type { CharacterProgression } from '../types';
import { hasAnyPracticeCompletion, isPracticePerfect } from '../utils/completionState';
import { getCurrency, CURRENCY_LABELS } from '../utils/currency';


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

// ── Unit data helper ──
type UnitData = {
  unitTitle: string;
  unitIndex: number;
  unitMissions: Mission[];
  completedSet: Set<string>;
  unitComplete: boolean;
  firstPlayable: Mission | undefined;
};

function computeUnits(gradeMissions: Mission[], profile: UserProfile, lang: Language): UnitData[] {
  return Array.from(new Set(gradeMissions.map(m => lt(m.unitTitle, lang)))).map((unitTitle, unitIndex) => {
    const unitMissions = gradeMissions.filter(m => lt(m.unitTitle, lang) === unitTitle).sort((a, b) => a.order - b.order);
    const completedSet = new Set(unitMissions.filter(m => {
      const c = profile.completed_missions[String(m.id)];
      return hasAnyPracticeCompletion(c);
    }).map(m => String(m.id)));
    const unitComplete = unitMissions.length > 0 && completedSet.size === unitMissions.length;
    const firstPlayable = unitMissions.find((m, i) => {
      if (completedSet.has(String(m.id))) return false;
      if (i === 0) return true;
      return completedSet.has(String(unitMissions[i - 1].id));
    });
    return { unitTitle, unitIndex, unitMissions, completedSet, unitComplete, firstPlayable };
  });
}

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
  onRepairWithItem,
  onBuyItem,
  onStartExpedition,
  hotTopicInfo,
  onLeaderboard,
  onAchievements,
  onFriendPK,
  onTechTree,
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
  getCharProgression?: (charId: string) => CharacterProgression;
  getTotalSP?: () => { total: number; spent: number };
  onUnlockSkill?: (charId: string, skillId: string) => void;
  onEquipSkill?: (charId: string, skillId: string | null) => void;
  onRepairEquipment?: (missionId: number) => void;
  onRepairWithItem?: (missionId: number, itemId: string) => void;
  onBuyItem?: (itemId: string) => Promise<boolean>;
  onStartExpedition?: (expeditionId: string) => void;
  hotTopicInfo?: { topic: string; label: { zh: string; zh_TW: string; en: string }; multiplier: number };
  onLeaderboard?: () => void;
  onAchievements?: () => void;
  onFriendPK?: () => void;
  onTechTree?: () => void;
}) => {
  const t = translations[lang];
  const { playTap, playBGMMap, stopBGM } = useAudio();

  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  const [showBattlePass, setShowBattlePass] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showScrolls, setShowScrolls] = useState(false);
  const [repairDialogTarget, setRepairDialogTarget] = useState<number | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [expandedCompletedUnit, setExpandedCompletedUnit] = useState<string | null>(null);

  // Daily challenge countdown
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight());
  useEffect(() => {
    const timer = setInterval(() => setCountdown(getSecondsUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Class rank + top 5 leaderboard (runs once on load)
  const [classRankInfo, setClassRankInfo] = useState<{ rank: number; total: number } | null>(null);
  const [classTop5, setClassTop5] = useState<{ display_name: string; total_score: number; user_id: string }[]>([]);
  const [classRankLoading, setClassRankLoading] = useState(true);
  useEffect(() => {
    const tags = profile.class_tags;
    if (!tags?.length || !profile.grade) { setClassRankLoading(false); return; }
    setClassRankLoading(true);
    supabase
      .from('gl_user_progress')
      .select('user_id, display_name, total_score')
      .eq('grade', profile.grade)
      .contains('class_tags', [tags[0]])
      .order('total_score', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!data) { setClassRankLoading(false); return; }
        const rank = data.findIndex(d => d.user_id === profile.user_id) + 1;
        setClassRankInfo(rank > 0 ? { rank, total: data.length } : null);
        setClassTop5(data.slice(0, 5) as any[]);
        setClassRankLoading(false);
      }, () => { setClassRankLoading(false); });
  }, [profile.user_id]);

  // KP progress from shared bridge table (for badges on mission cards)
  const [kpProgress, setKpProgress] = useState<Map<string, { wins: number; mastered: boolean }>>(new Map());
  useEffect(() => {
    if (profile.user_id === 'guest') return;
    supabase
      .from('play_kp_progress')
      .select('kp_id, wins, mastered_at')
      .eq('user_id', profile.user_id)
      .then(({ data }) => {
        if (!data) return;
        const map = new Map<string, { wins: number; mastered: boolean }>();
        for (const r of data as { kp_id: string; wins: number; mastered_at: string | null }[]) {
          map.set(r.kp_id, { wins: r.wins, mastered: !!r.mastered_at });
        }
        setKpProgress(map);
      }, () => {});
  }, [profile.user_id]);

  useEffect(() => { playBGMMap(); return () => stopBGM(); }, []);

  useEffect(() => {
    if (lastClearedMissionId && clearLastClearedMission) {
      const timer = setTimeout(() => clearLastClearedMission(), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastClearedMissionId, clearLastClearedMission]);

  // ── Auto-scroll to current unit ──
  const currentUnitRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const prevGrade = useRef(profile.grade);

  // Reset scroll flag on grade change
  useEffect(() => {
    if (prevGrade.current !== profile.grade) {
      hasScrolled.current = false;
      prevGrade.current = profile.grade;
    }
  }, [profile.grade]);

  const gradeMissions = missions.filter(m => m.grade === profile.grade);

  useEffect(() => {
    if (currentUnitRef.current && !hasScrolled.current) {
      hasScrolled.current = true;
      const timer = setTimeout(() => {
        const block = window.innerHeight < 700 ? 'start' as const : 'center' as const;
        currentUnitRef.current?.scrollIntoView({ behavior: 'smooth', block });
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [gradeMissions.length]);

  const completedCount = Object.keys(profile.completed_missions).filter(id =>
    !id.startsWith('daily_') && !id.startsWith('_') &&
    hasAnyPracticeCompletion(profile.completed_missions[id])
  ).length;
  const levelInfo = getLevelInfo(profile.total_score);
  const rankName = levelInfo.rank[lang === 'zh_TW' ? 'zh_TW' : lang === 'en' ? 'en' : 'zh'];
  const seasonProgress = getSeasonProgress(profile.completed_missions as Record<string, unknown>);
  const seasonLevelInfo = getSeasonLevel(seasonProgress.season_xp);
  const seasonBorder = getSeasonBorder(seasonLevelInfo.level);
  const seasonTitle = getSeasonTitle(seasonLevelInfo.level);
  const xpToNext = levelInfo.xpForNextLevel - levelInfo.currentXP;
  const isNearLevel = levelInfo.xpForNextLevel > 0 && xpToNext <= Math.ceil(levelInfo.xpForNextLevel * 0.20) && xpToNext > 0;
  const nextRankName = isNearLevel
    ? getLevelInfo(levelInfo.totalXPForLevel + levelInfo.xpForNextLevel).rank[lang === 'zh_TW' ? 'zh_TW' : lang === 'en' ? 'en' : 'zh']
    : '';
  const dailyMission = getDailyMission(missions, profile.grade);
  const dailyDone = isDailyCompleted(profile.completed_missions);
  const streakTokens = ((profile.completed_missions as Record<string, unknown>)['_streak_tokens'] as number) || 0;

  // ── Compute unit sections ──
  const unitDataList = computeUnits(gradeMissions, profile, lang);
  const currentUnitIdx = unitDataList.findIndex(u => u.firstPlayable);
  const activeUnitIdx = currentUnitIdx >= 0 ? currentUnitIdx : unitDataList.length - 1;
  const completedUnits = unitDataList.slice(0, Math.max(0, activeUnitIdx));
  const currentUnit = unitDataList[activeUnitIdx];
  const upcomingUnits = unitDataList.slice(activeUnitIdx + 1);

  // ── Assigned mission IDs (from teacher assignments) ──
  const assignedMissionIds = useAssignedMissionIds(profile.user_id);

  // ── Equipment decay map (for repair badges on cards) ──
  const equipmentDecayMap = (() => {
    const raw = (profile.completed_missions as any)?._equipment as Record<string, KPEquipment> | undefined;
    if (!raw) return new Map<number, EquipmentState>();
    const map = new Map<number, EquipmentState>();
    for (const [mid, eq] of Object.entries(raw)) {
      const state = getEquipmentState(eq.lastMasteredAt);
      if (state !== 'pristine') map.set(Number(mid), state);
    }
    return map;
  })();

  // ── Weak missions (high error rate) + dominant error pattern ──
  const { weakMissionSet, weakMissionPatterns } = useMemo(() => {
    const mistakesRaw = ((profile.completed_missions as any)?._mistakes ?? {}) as Record<string, MistakeRecord>;
    const set = getWeakMissions(mistakesRaw as any, 3);
    const patterns = new Map<number, string | null>();
    for (const id of set) {
      const rec = mistakesRaw[String(id)];
      if (rec) {
        const p = getDominantPattern(rec);
        patterns.set(id, p === 'sign' ? '±' : p === 'rounding' ? '≈' : p === 'magnitude' ? '×10' : p === 'method' ? '?' : null);
      }
    }
    return { weakMissionSet: set, weakMissionPatterns: patterns };
  }, [profile.completed_missions]);

  // ── Render a full mission grid for a unit ──
  const renderUnitGrid = (u: UnitData, isCurrentUnit: boolean) => (
    <div className="space-y-6">
      {/* Unit header */}
      <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-amber-400/20 rounded-lg sm:rounded-xl blur-md" />
            <img
              src={CHAPTER_IMAGES[u.unitIndex % CHAPTER_IMAGES.length]}
              alt=""
              className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover border-2 border-amber-400/30 shadow-lg"
            />
          </div>
          <h3 className="text-base sm:text-2xl font-black text-white uppercase tracking-widest flex items-center gap-2 sm:gap-3">
            <MapIcon className="text-indigo-400" size={18} />
            <span className="truncate">{u.unitTitle}</span>
            {u.unitComplete && (
              <span className="ml-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-xs font-bold rounded-full normal-case tracking-normal flex-shrink-0">
                {(t as any).unitConquered ?? 'Conquered'}
              </span>
            )}
          </h3>
        </div>
        <div className="h-px flex-1 bg-white/10" />
      </motion.div>

      {/* Progress bar */}
      <MissionProgressBar
        missions={u.unitMissions}
        completedIds={u.completedSet}
        currentId={u.firstPlayable?.id}
      />

      {/* Mission card grid */}
      <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
        {u.unitMissions.map(mission => {
          const comp = profile.completed_missions[String(mission.id)];
          const isNextUp = mission.id === u.firstPlayable?.id;
          const isCompleted = hasAnyPracticeCompletion(comp);
          const prevMission = gradeMissions.find(m => m.unitId === mission.unitId && m.order === mission.order - 1);
          const prevComp = prevMission ? profile.completed_missions[String(prevMission.id)] : null;
          const isLocked = mission.order > 1 && prevMission && !hasAnyPracticeCompletion(prevComp);
          const isPlayable = !isLocked && !isCompleted;
          const isPerfect = isPracticePerfect(comp);
          const isLastCleared = lastClearedMissionId === mission.id;
          const cardVariants = isLocked ? { initial: { opacity: 0.5, y: 0 }, animate: { opacity: 0.5, y: 0 } } : staggerItem;

          return (
            <motion.div
              key={mission.id}
              ref={isNextUp && isCurrentUnit ? currentUnitRef : undefined}
              variants={cardVariants}
              className="relative group"
              {...(!isLocked ? {
                whileHover: { y: -4, boxShadow: "0 12px 40px rgba(99,102,241,0.15)" },
                whileTap: { y: -2, scale: 0.98 },
                transition: { type: "spring", stiffness: 300, damping: 20 },
              } : {
                whileTap: { x: [0, -4, 4, -3, 3, -1, 1, 0] },
                transition: { duration: 0.4 },
                onClick: () => { playTap(); },
              })}
            >
              <motion.div
                animate={isPlayable ? { scale: [1, 1.02, 1] } : (isLastCleared ? { borderColor: ['#e2e8f0', '#facc15', '#facc15', '#e2e8f0'] } : {})}
                transition={isPlayable ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : (isLastCleared ? { duration: 2.5, ease: "easeInOut" } : {})}
                className={`bg-white rounded-xl sm:rounded-[2rem] p-3 sm:p-5 md:p-8 shadow-2xl border-2 transition-shadow ${isLocked ? 'opacity-50 grayscale border-transparent' : isNextUp ? 'border-amber-400 shadow-amber-500/20' : isLastCleared ? 'border-transparent' : 'border-transparent hover:shadow-indigo-500/20'}`}
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
                {!isPerfect && (() => {
                  const eqState = equipmentDecayMap.get(mission.id);
                  if (!eqState || !onRepairEquipment) return null;
                  const colors = EQUIPMENT_COLORS[eqState];
                  return (
                    <button
                      onClick={(e) => { e.stopPropagation(); playTap(); onRepairEquipment(mission.id); }}
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center shadow-md z-10 hover:scale-110 transition-transform`}
                      title={lt({ zh: '需要修复', en: 'Needs repair' }, lang)}
                    >
                      <Wrench size={14} className={colors.text} />
                    </button>
                  );
                })()}
                {/* Title first — primary visual weight */}
                <h4 className="text-sm sm:text-lg md:text-2xl font-black text-slate-800 mb-1 sm:mb-2 line-clamp-2 pr-8">{lt(mission.title, lang)}</h4>

                {/* Difficulty + completion + type — secondary, compact row */}
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    mission.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                    mission.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {t.difficulty[mission.difficulty]}
                  </span>
                  <span className="text-slate-400 text-[9px]">·</span>
                  <span className="text-indigo-500 text-[9px] font-bold uppercase">{t.questionTypes[mission.type]}</span>
                  {isCompleted ? (
                    <span className="flex gap-0.5 ml-auto">
                      {comp?.green && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                      {comp?.amber && <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                      {comp?.red && <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                      <CheckCircle2 className="text-emerald-500 ml-0.5" size={14} />
                    </span>
                  ) : isLocked ? <Lock className="text-slate-400 ml-auto" size={16} /> : null}
                </div>

                {/* Description — hidden on small mobile, visible on sm+ */}
                <LatexText text={interpolate(lt(mission.description, lang), mission.data ?? {})} className="hidden sm:block text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3" />
                {(() => {
                  const pb = (profile.completed_missions as any)?._pb?.[String(mission.id)] as number | undefined;
                  const isHot = hotTopicInfo?.topic === mission.topic;
                  const hotLabel = hotTopicInfo ? (lang === 'en' ? hotTopicInfo.label.en : lang === 'zh_TW' ? hotTopicInfo.label.zh_TW : hotTopicInfo.label.zh) : '';
                  const isWeak = weakMissionSet.has(mission.id);
                  const kpProg = mission.kpId ? kpProgress.get(mission.kpId) : undefined;
                  const isAssigned = assignedMissionIds.has(mission.id);
                  return (pb || isHot || isWeak || kpProg || isAssigned) ? (
                    <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                      {isAssigned && !isCompleted && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black rounded-full border border-purple-200 flex items-center gap-0.5">
                          <ClipboardList size={10} /> {lt({ zh: '老师布置', en: 'Assigned' }, lang)}
                        </span>
                      )}
                      {kpProg?.mastered && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200 flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> {lt({ zh: '已掌握', en: 'Mastered' }, lang)}
                        </span>
                      )}
                      {kpProg && !kpProg.mastered && kpProg.wins > 0 && (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-black rounded-full border border-sky-200">
                          {lang === 'en' ? `${kpProg.wins} wins` : `${kpProg.wins} ${lang === 'zh_TW' ? '勝' : '胜'}`}
                        </span>
                      )}
                      {isWeak && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-full border border-rose-200 flex items-center gap-0.5">
                          <AlertTriangle size={10} /> {lt({ zh: '薄弱点', en: 'Needs review' }, lang)}
                          {weakMissionPatterns.get(mission.id) && (
                            <span className="ml-0.5 opacity-70">{weakMissionPatterns.get(mission.id)}</span>
                          )}
                        </span>
                      )}
                      {pb && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full border border-amber-200">
                          PB {pb}
                        </span>
                      )}
                      {isHot && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full border border-orange-200 animate-pulse">
                          🔥 {lang === 'en' ? `${hotLabel} ×1.5` : `本周热点 ×1.5`}
                        </span>
                      )}
                    </div>
                  ) : <div className="mb-4" />;
                })()}
                <motion.button
                  {...(isLocked ? {} : { ...tapScale, ...hoverGlow })}
                  disabled={!!isLocked}
                  onClick={() => { playTap(); onPracticeStart(mission); }}
                  className={`w-full py-3 rounded-2xl font-black flex items-center justify-center gap-2 text-sm min-h-12 ${
                    isLocked ? 'bg-slate-100 text-slate-400'
                      : isCompleted ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-200'
                      : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  }`}
                >
                  {isLocked ? <><Lock size={16} /> {t.locked}</>
                    : isCompleted ? <><BookOpen size={16} /> {lt({ zh: '复习', en: 'Review' }, lang)}</>
                    : <><Swords size={16} /> {lt({ zh: '开始学习', en: 'Start Learning' }, lang)}</>
                  }
                </motion.button>
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

  // Count corrupted (blocked/critical) skill nodes for the warning banner
  const corruptedTopicCount = useMemo(() => {
    const skillHealthMap = (profile.completed_missions as any)?._skillHealth as Record<string, any> | undefined;
    if (!skillHealthMap) return 0;
    return Object.values(skillHealthMap).filter(
      h => h && (h.corruptionLevel === 'blocked' || h.corruptionLevel === 'critical')
    ).length;
  }, [profile.completed_missions]);

  // Memoize smart recommendation to avoid re-computing on every render
  const smartRecommendation = useMemo(() => {
    // Check for corrupted skill nodes first — repair is highest priority
    const skillHealthMap = (profile.completed_missions as any)?._skillHealth as Record<string, any> | undefined;
    if (skillHealthMap) {
      for (const [topicId, health] of Object.entries(skillHealthMap)) {
        if (health && (health.corruptionLevel === 'blocked' || health.corruptionLevel === 'critical')) {
          // Find a mission in this topic to suggest repair
          const topicMission = gradeMissions.find(m => {
            if (!m.kpId) return false;
            const match = m.kpId.match(/^kp-(\d+\.\d+)/);
            return match && match[1] === topicId;
          });
          if (topicMission) {
            return { recommendedMission: topicMission, isWeakRecommendation: true as const, isRepairRecommendation: true as const, repairTopicId: topicId };
          }
        }
      }
    }
    // Fallback: traditional weakness ranking
    const mistakes = getMistakes(profile.completed_missions as Record<string, unknown>);
    const weakRanked = rankByWeakness(mistakes);
    const gradeMissionIds = new Set(gradeMissions.map(m => m.id));
    const weakInGrade = weakRanked.find(id => gradeMissionIds.has(id));
    if (weakInGrade) {
      const m = gradeMissions.find(gm => gm.id === weakInGrade);
      if (m) return { recommendedMission: m, isWeakRecommendation: true as const };
    }
    return { recommendedMission: currentUnit?.firstPlayable ?? null, isWeakRecommendation: false as const };
  }, [profile.completed_missions, gradeMissions, currentUnit]);

  return (
    <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 sm:space-y-8 md:space-y-12 pb-bottom-nav md:pb-0">
      {/* ═══════════════════ Smart Recommendation Banner ═══════════════════ */}
      {smartRecommendation.recommendedMission && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl border overflow-hidden ${
            (smartRecommendation as any).isRepairRecommendation
              ? 'bg-rose-600/15 border-rose-500/30'
              : smartRecommendation.isWeakRecommendation
              ? 'bg-rose-600/10 border-rose-500/20'
              : 'bg-indigo-600/10 border-indigo-500/20'
          }`}
        >
          {/* Repair urgency pulse */}
          {(smartRecommendation as any).isRepairRecommendation && (
            <motion.div
              animate={{ opacity: [0, 0.08, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-rose-500 pointer-events-none"
            />
          )}
          <div className="flex items-center gap-2 min-w-0 relative">
            <span className="text-lg flex-shrink-0">{smartRecommendation.isWeakRecommendation ? '🔧' : '💡'}</span>
            <div className="min-w-0">
              <p className={`text-[10px] font-bold ${smartRecommendation.isWeakRecommendation ? 'text-rose-400' : 'text-indigo-400'}`}>
                {(smartRecommendation as any).isRepairRecommendation
                  ? (lang === 'en' ? 'Skill needs repair' : '技能需要修复')
                  : smartRecommendation.isWeakRecommendation
                  ? (lang === 'en' ? 'Needs review' : '建议复习')
                  : (lang === 'en' ? 'Next up' : '推荐下一步')}
              </p>
              <p className="text-sm font-black text-white truncate">{lt(smartRecommendation.recommendedMission.title, lang)}</p>
            </div>
          </div>
          <motion.button
            {...tapScale}
            onClick={() => { playTap(); onPracticeStart(smartRecommendation.recommendedMission!); }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-black text-white ${
              smartRecommendation.isWeakRecommendation ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {lang === 'en' ? 'Go →' : '去学习 →'}
          </motion.button>
        </motion.div>
      )}

      {/* ═══════════════════ Corruption Warning Banner ═══════════════════ */}
      {corruptedTopicCount > 0 && onTechTree && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-orange-500/40 bg-orange-900/20 overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0, 0.06, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-orange-400 pointer-events-none"
          />
          <div className="flex items-center gap-2 relative">
            <AlertTriangle size={16} className="text-orange-400 flex-shrink-0" />
            <p className="text-sm font-bold text-orange-200">
              {lang === 'en'
                ? `${corruptedTopicCount} skill node${corruptedTopicCount > 1 ? 's' : ''} need repair`
                : lang === 'zh_TW'
                ? `${corruptedTopicCount} 個知識節點需要修復`
                : `${corruptedTopicCount} 个知识节点需要修复`}
            </p>
          </div>
          <button
            onClick={() => { playTap(); onTechTree(); }}
            className="flex-shrink-0 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded-lg transition-colors relative"
          >
            {lang === 'en' ? 'Tech Tree →' : '科技树 →'}
          </button>
        </motion.div>
      )}

      {/* ═══════════════════ Profile Header ═══════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 bg-white/5 backdrop-blur-xl p-3 sm:p-4 md:p-8 rounded-2xl sm:rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <button onClick={onCharChange} className="relative group">
            <div className={`border-4 shadow-2xl rounded-full transition-colors ${seasonBorder ? seasonBorder.color : 'border-white/20'} group-hover:border-indigo-400`}>
              <CharacterAvatar characterId={selectedChar?.id || ''} size={72} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-xs border-2 border-white/30 shadow-lg">
              {levelInfo.level}
            </div>
          </button>
          <div>
            <h3 className="text-white font-black text-lg md:text-2xl flex items-center gap-2 flex-wrap">
              {profile.display_name}
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300">
                {rankName}
              </span>
              {seasonTitle && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300">
                  {lt(seasonTitle, lang)}
                </span>
              )}
            </h3>
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
              {isNearLevel ? (
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-[10px] text-yellow-300 font-black"
                >
                  {lang === 'en' ? `${xpToNext} XP to ${nextRankName}!` : `再 ${xpToNext} 分 → ${nextRankName}`}
                </motion.span>
              ) : (
                <span className="text-[10px] text-yellow-400/70 font-bold">
                  {levelInfo.xpForNextLevel > 0 ? `${levelInfo.currentXP}/${levelInfo.xpForNextLevel}` : 'MAX'}
                </span>
              )}
            </div>
            {classRankLoading ? (
              <div className="h-3 w-36 bg-white/10 rounded-full animate-pulse mt-1" />
            ) : classRankInfo && (
              <p className="text-white/30 text-[10px] font-bold mt-1">
                {lang === 'en'
                  ? `Class rank #${classRankInfo.rank} of ${classRankInfo.total} · Top ${Math.round((classRankInfo.rank / classRankInfo.total) * 100)}%`
                  : `班级第 ${classRankInfo.rank} 名 · 共 ${classRankInfo.total} 人 · 超越 ${Math.round(((classRankInfo.total - classRankInfo.rank) / classRankInfo.total) * 100)}%`
                }
              </p>
            )}
            {/* ── Three-currency display ── */}
            {(() => {
              const bal = getCurrency(profile.completed_missions as Record<string, unknown>);
              const nonZero = (['merit', 'wisdom', 'rations'] as const).filter(k => bal[k] > 0);
              if (nonZero.length === 0) return null;
              return (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {nonZero.map(type => {
                    const lbl = CURRENCY_LABELS[type];
                    const color = type === 'merit' ? 'text-amber-400' : type === 'wisdom' ? 'text-purple-400' : 'text-emerald-400';
                    const bg = type === 'merit' ? 'bg-amber-500/10 border-amber-500/20' : type === 'wisdom' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
                    return (
                      <span key={type} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black ${bg} ${color}`}>
                        {lbl.icon} {bal[type]} {lang === 'en' ? lbl.en : lang === 'zh_TW' ? lbl.zh_TW : lbl.zh}
                      </span>
                    );
                  })}
                </div>
              );
            })()}
            {/* ── Core buttons (always visible) ── */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-indigo-400 font-bold text-sm">{selectedChar ? lt(selectedChar.name, lang) : ''}</p>
              <span className="text-white/20">|</span>
              <button onClick={onGradeChange} className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors">
                {t.year} {profile.grade}
              </button>
              <button onClick={onCharChange} className="px-2 py-0.5 bg-indigo-600/20 border border-indigo-500/30 rounded text-xs text-indigo-300 hover:bg-indigo-600/40 transition-colors">
                {t.switchChar}
              </button>
              {streakTokens > 0 && (
                <span className={`px-2 py-0.5 rounded text-xs font-black flex items-center gap-1 ${streakTokens >= 3 ? 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-300' : 'bg-orange-600/20 border border-orange-500/30 text-orange-300'}`}>
                  <Flame size={12} /> {streakTokens} {t.streakToken}
                  {streakTokens >= 3 && <> · <Crown size={10} /> {t.streakKing}</>}
                </span>
              )}
              {(() => {
                const loginData = (profile.completed_missions as any)?._login as { streak: number } | undefined;
                if (!loginData?.streak || loginData.streak < 3) return null;
                const claimed = ((profile.completed_missions as any)?._streak_milestones ?? []) as string[];
                const next = getNextMilestone(loginData.streak, claimed);
                if (!next) return null;
                const daysLeft = next.days - loginData.streak;
                return (
                  <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/30 rounded text-[10px] text-emerald-300 font-bold">
                    🔥 {loginData.streak}{lang === 'en' ? 'd' : '天'} · {lang === 'en' ? `${daysLeft}d to ${next.title.en}` : `${daysLeft}天→${next.title.zh}`}
                  </span>
                );
              })()}

              {/* ── Stamina indicator ── */}
              {(() => {
                const stamina = getStamina(profile.completed_missions as Record<string, unknown>);
                return <StaminaBar lang={lang} remaining={getRemainingAttempts(stamina)} bonus={stamina.bonus} />;
              })()}

              {/* ── Secondary buttons: visible on md+, collapsed on mobile ── */}
              {/* Desktop: inline buttons */}
              <div className="hidden md:contents">
                {onTechTree && (
                  <button onClick={onTechTree} className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-500/30 rounded text-xs text-cyan-300 hover:bg-cyan-600/40 transition-colors flex items-center gap-1">
                    🌿 {lang === 'en' ? 'Tech Tree' : '科技树'}
                  </button>
                )}
                {getCharProgression && selectedChar && (
                  <button onClick={() => setShowSkillTree(true)} className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-300 hover:bg-purple-600/40 transition-colors">
                    {(t as any).skillTree ?? 'Skills'}
                  </button>
                )}
                {onRepairEquipment && (() => {
                  const repairCount = countNeedsRepair(profile.completed_missions as Record<string, unknown>);
                  return (
                    <button onClick={() => setShowEquipmentPanel(true)} className="relative px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors">
                      {(t as any).equipmentArsenal ?? 'Arsenal'}
                      {repairCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{repairCount}</span>
                      )}
                    </button>
                  );
                })()}
                {(() => {
                  const itemCount = getTotalItems(getInventory(profile.completed_missions as Record<string, unknown>));
                  return (
                    <button onClick={() => setShowInventory(true)} className="relative px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors">
                      🎒 {lang === 'en' ? 'Backpack' : lang === 'zh_TW' ? '背包' : '背包'}
                      {itemCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{itemCount}</span>
                      )}
                    </button>
                  );
                })()}
                {onBuyItem && (
                  <button onClick={() => setShowShop(true)} className="px-2 py-0.5 bg-yellow-600/20 border border-yellow-500/30 rounded text-xs text-yellow-300 hover:bg-yellow-600/40 transition-colors">
                    🏪 {lang === 'en' ? 'Shop' : lang === 'zh_TW' ? '商店' : '商店'}
                  </button>
                )}
                {onLeaderboard && (
                  <button onClick={onLeaderboard} className="px-2 py-0.5 bg-yellow-600/20 border border-yellow-500/30 rounded text-xs text-yellow-300 hover:bg-yellow-600/40 transition-colors flex items-center gap-1">
                    🏆 {lang === 'en' ? 'Ranks' : '排行榜'}
                  </button>
                )}
                {onAchievements && (
                  <button onClick={onAchievements} className="px-2 py-0.5 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-300 hover:bg-purple-600/40 transition-colors">
                    {lang === 'en' ? 'Achievements' : '成就墙'}
                  </button>
                )}
                {onFriendPK && (
                  <button onClick={onFriendPK} className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-500/30 rounded text-xs text-cyan-300 hover:bg-cyan-600/40 transition-colors">
                    {lang === 'en' ? 'Friend PK' : '好友对决'}
                  </button>
                )}
                <button onClick={() => setShowBattlePass(true)} className="px-2 py-0.5 bg-rose-600/20 border border-rose-500/30 rounded text-xs text-rose-300 hover:bg-rose-600/40 transition-colors">
                  {(t as any).growthHandbook ?? '\u624b\u518c'}
                </button>
                <button onClick={() => setShowScrolls(true)} className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors flex items-center gap-1">
                  📜 {lang === 'en' ? 'Strategy' : lang === 'zh_TW' ? '兵法寶典' : '兵法宝典'}
                </button>
                {onStartExpedition && (() => {
                  const exps = getExpeditionsForGrade(profile.grade!);
                  if (exps.length === 0) return null;
                  if (exps.length === 1) return (
                    <button onClick={() => onStartExpedition(exps[0].id)} className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-300 hover:bg-orange-600/40 transition-colors animate-pulse">
                      {(t as any).expedition ?? '\u8fdc\u5f81'}
                    </button>
                  );
                  return exps.map(exp => (
                    <button key={exp.id} onClick={() => onStartExpedition(exp.id)} className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-300 hover:bg-orange-600/40 transition-colors">
                      {lt(exp.name, lang)}
                    </button>
                  ));
                })()}
                {onDashboard && (
                  <button onClick={onDashboard} className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-500/30 rounded text-xs text-emerald-300 hover:bg-emerald-600/40 transition-colors">
                    {t.dashboard}
                  </button>
                )}
              </div>

              {/* Mobile: "More" toggle — hidden when BottomNav is active */}
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="hidden px-2 py-0.5 bg-white/10 border border-white/20 rounded text-xs text-white/70 hover:bg-white/20 transition-colors relative"
              >
                {showMoreMenu ? <X size={14} /> : <MoreHorizontal size={14} />}
                {onRepairEquipment && countNeedsRepair(profile.completed_missions as Record<string, unknown>) > 0 && !showMoreMenu && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Mobile expanded menu — replaced by BottomNav profile panel */}
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden overflow-hidden mt-2"
                >
                  <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-xl border border-white/10">
                    {onTechTree && (
                      <button onClick={() => { onTechTree(); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-300">
                        🌿 {lang === 'en' ? 'Tech Tree' : '科技树'}
                      </button>
                    )}
                    {getCharProgression && selectedChar && (
                      <button onClick={() => { setShowSkillTree(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs text-purple-300">
                        {(t as any).skillTree ?? 'Skills'}
                      </button>
                    )}
                    {onRepairEquipment && (
                      <button onClick={() => { setShowEquipmentPanel(true); setShowMoreMenu(false); }} className="relative px-3 py-1.5 bg-amber-600/20 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                        {(t as any).equipmentArsenal ?? 'Arsenal'}
                        {countNeedsRepair(profile.completed_missions as Record<string, unknown>) > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{countNeedsRepair(profile.completed_missions as Record<string, unknown>)}</span>
                        )}
                      </button>
                    )}
                    <button onClick={() => { setShowInventory(true); setShowMoreMenu(false); }} className="relative px-3 py-1.5 bg-amber-600/20 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                      🎒 {lang === 'en' ? 'Backpack' : lang === 'zh_TW' ? '背包' : '背包'}
                      {getTotalItems(getInventory(profile.completed_missions as Record<string, unknown>)) > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{getTotalItems(getInventory(profile.completed_missions as Record<string, unknown>))}</span>
                      )}
                    </button>
                    {onBuyItem && (
                      <button onClick={() => { setShowShop(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-xs text-yellow-300">
                        🏪 {lang === 'en' ? 'Shop' : lang === 'zh_TW' ? '商店' : '商店'}
                      </button>
                    )}
                    {onLeaderboard && (
                      <button onClick={() => { onLeaderboard(); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-xs text-yellow-300">
                        🏆 {lang === 'en' ? 'Ranks' : '排行榜'}
                      </button>
                    )}
                    {onAchievements && (
                      <button onClick={() => { onAchievements(); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs text-purple-300">
                        {lang === 'en' ? 'Achievements' : '成就墙'}
                      </button>
                    )}
                    {onFriendPK && (
                      <button onClick={() => { onFriendPK(); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-300">
                        {lang === 'en' ? 'Friend PK' : '好友对决'}
                      </button>
                    )}
                    <button onClick={() => { setShowBattlePass(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-rose-600/20 border border-rose-500/30 rounded-lg text-xs text-rose-300">
                      {(t as any).growthHandbook ?? '\u624b\u518c'}
                    </button>
                    <button onClick={() => { setShowScrolls(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-amber-600/20 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                      📜 {lang === 'en' ? 'Strategy' : lang === 'zh_TW' ? '兵法寶典' : '兵法宝典'}
                    </button>
                    {onStartExpedition && (() => {
                      const exps = getExpeditionsForGrade(profile.grade!);
                      if (exps.length === 0) return null;
                      return exps.map(exp => (
                        <button key={exp.id} onClick={() => { onStartExpedition(exp.id); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-orange-600/20 border border-orange-500/30 rounded-lg text-xs text-orange-300">
                          {lt(exp.name, lang)}
                        </button>
                      ));
                    })()}
                    {onDashboard && (
                      <button onClick={() => { onDashboard(); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
                        {t.dashboard}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* ═══════════════════ Daily Challenge ═══════════════════ */}
      {dailyMission && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 md:p-6 ${
            dailyDone ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-gradient-to-r from-yellow-900/40 via-amber-900/40 to-yellow-900/40 border-yellow-500/40'
          }`}
        >
          {!dailyDone && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent animate-pulse pointer-events-none" />}
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${dailyDone ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`}>
                <Zap size={20} className={dailyDone ? 'text-emerald-400' : 'text-yellow-400'} />
              </div>
              <div className="min-w-0">
                <h4 className={`font-black text-sm sm:text-lg ${dailyDone ? 'text-emerald-300' : 'text-yellow-300'}`}>
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
            {dailyDone && <div className="text-emerald-400/60 text-sm font-bold">{t.dailyTomorrow}</div>}
          </div>
        </motion.div>
      )}

      {/* ═══════════════════ Daily Quest Panel ═══════════════════ */}
      <DailyQuestPanel
        lang={lang}
        completedMissions={profile.completed_missions as Record<string, unknown>}
        onSmartStart={(m) => { playTap(); onPracticeStart(m); }}
        onBattleStart={(m) => { playTap(); onMissionStart(m); }}
        {...smartRecommendation}
      />

      {/* ═══════════════════ Class Arena — Top 5 ═══════════════════ */}
      {classTop5.length >= 2 && profile.class_tags?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-indigo-900/30 border border-indigo-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-amber-400" />
              <span className="text-sm font-black text-white">
                {profile.class_tags[0]} {lang === 'en' ? 'Arena' : '竞技场'}
              </span>
            </div>
            {classRankInfo && (
              <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                #{classRankInfo.rank}/{classRankInfo.total}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {classTop5.map((entry, i) => {
              const isMe = entry.user_id === profile.user_id;
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                    isMe ? 'bg-amber-500/15 border border-amber-400/20' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="w-5 text-center text-xs font-black">
                    {i < 3 ? medals[i] : <span className="text-white/30">{i + 1}</span>}
                  </span>
                  <span className={`flex-1 text-xs font-bold truncate ${isMe ? 'text-amber-300' : 'text-white/70'}`}>
                    {entry.display_name || 'Anonymous'}
                    {isMe && <span className="ml-1 text-[9px] text-amber-400/60">{lang === 'en' ? '(you)' : '(我)'}</span>}
                  </span>
                  <span className={`text-xs font-black tabular-nums ${isMe ? 'text-amber-400' : 'text-white/40'}`}>
                    {entry.total_score.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ═══════════════════ Teacher Assignments (v8.3) ═══════════════════ */}
      <AssignmentBanner
        lang={lang}
        userId={profile.user_id}
        completedMissions={profile.completed_missions}
        onMissionStart={onPracticeStart}
      />

      {/* ═══════════════════ Mission Map ═══════════════════ */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1a1a2e]">
        <img
          src={lang === 'zh' ? './map/world-map-zh.png' : './map/world-map-en.png'}
          alt="Three Kingdoms Map"
          loading="lazy"
          className="w-full rounded-3xl opacity-10 md:opacity-30 absolute inset-0 object-cover h-full pointer-events-none"
        />
        <div className="relative z-10 space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-8">
          {gradeMissions.length === 0 ? (
            <EmptyState icon={<MapIcon size={48} />} title={t.noMissions} description={t.noMissionsDesc} />
          ) : (
            <>
              {/* ── Completed Units: Compact Badge Row ── */}
              {completedUnits.length > 0 && (
                <div>
                  <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">
                    {lt({ zh: '已征服的战役', en: 'Conquered Campaigns' }, lang)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {completedUnits.map(u => {
                      const isExpanded = expandedCompletedUnit === u.unitTitle;
                      return (
                        <button
                          key={u.unitTitle}
                          onClick={() => { playTap(); setExpandedCompletedUnit(isExpanded ? null : u.unitTitle); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                            isExpanded
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          <img src={CHAPTER_IMAGES[u.unitIndex % CHAPTER_IMAGES.length]} alt="" className="w-7 h-7 rounded-lg object-cover" />
                          <span className="hidden sm:inline max-w-[120px] truncate">{u.unitTitle}</span>
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanded completed unit */}
                  <AnimatePresence>
                    {expandedCompletedUnit && (() => {
                      const u = completedUnits.find(u => u.unitTitle === expandedCompletedUnit);
                      if (!u) return null;
                      return (
                        <motion.div
                          key={u.unitTitle}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-4"
                        >
                          {renderUnitGrid(u, false)}
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Current Unit: Full Display ── */}
              {currentUnit && (
                <div ref={currentUnitRef}>
                  {renderUnitGrid(currentUnit, true)}
                </div>
              )}

              {/* ── Upcoming Units: Preview Cards ── */}
              {upcomingUnits.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">
                    {lt({ zh: '前方战役', en: 'Upcoming Campaigns' }, lang)}
                  </h3>
                  {upcomingUnits.map(u => (
                    <motion.div
                      key={u.unitTitle}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl"
                    >
                      <img src={CHAPTER_IMAGES[u.unitIndex % CHAPTER_IMAGES.length]} alt="" className="w-10 h-10 rounded-lg object-cover grayscale opacity-50" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white/40 text-sm font-bold truncate">{u.unitTitle}</h4>
                        <p className="text-white/20 text-[10px]">
                          {u.unitMissions.length} {lt({ zh: '关', en: 'missions' }, lang)} · {lt({ zh: '待解锁', en: 'Locked' }, lang)}
                        </p>
                      </div>
                      <Lock size={16} className="text-white/15 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════ Overlay Panels ═══════════════════ */}
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

      {showBattlePass && (
        <BattlePassPanel
          lang={lang}
          completedMissions={profile.completed_missions as Record<string, unknown>}
          onClose={() => setShowBattlePass(false)}
        />
      )}

      {showEquipmentPanel && onRepairEquipment && (
        <EquipmentPanel
          lang={lang}
          completedMissions={profile.completed_missions as Record<string, unknown>}
          missions={missions}
          onRepair={(missionId) => { setShowEquipmentPanel(false); onRepairEquipment(missionId); }}
          onRepairWithItem={onRepairWithItem ? (missionId) => {
            setShowEquipmentPanel(false);
            setRepairDialogTarget(missionId);
          } : undefined}
          onOpenInventory={() => { setShowEquipmentPanel(false); setShowInventory(true); }}
          onClose={() => setShowEquipmentPanel(false)}
        />
      )}

      {showInventory && (
        <InventoryPanel
          lang={lang}
          completedMissions={profile.completed_missions as Record<string, unknown>}
          onClose={() => setShowInventory(false)}
        />
      )}

      {showScrolls && (
        <StrategicScrollsPanel
          lang={lang}
          onClose={() => setShowScrolls(false)}
        />
      )}

      {showShop && onBuyItem && (
        <ShopPanel
          lang={lang}
          completedMissions={profile.completed_missions as Record<string, unknown>}
          onBuyItem={onBuyItem}
          onClose={() => setShowShop(false)}
        />
      )}

      {repairDialogTarget !== null && onRepairWithItem && (() => {
        const cm = profile.completed_missions as Record<string, unknown>;
        const mission = missions.find(m => m.id === repairDialogTarget);
        if (!mission) return null;
        const eq = (cm._equipment as Record<string, { lastMasteredAt: number }> | undefined)?.[String(repairDialogTarget)];
        const mistakesMap = getMistakes(cm) as Record<string, MistakeRecord>;
        const mRecord = mistakesMap[String(repairDialogTarget)];
        const health = eq ? getEquipmentHealth(eq.lastMasteredAt, mRecord) : 0;
        const dominantError = mRecord ? getDominantPattern(mRecord) : null;
        const equipmentState = healthToEquipmentState(health);
        return (
          <RepairDialog
            lang={lang}
            missionTitle={lt(mission.title, lang)}
            equipmentState={equipmentState}
            equipmentHealth={health}
            dominantError={dominantError}
            completedMissions={cm}
            onRepair={(itemId) => {
              onRepairWithItem(repairDialogTarget, itemId);
              setRepairDialogTarget(null);
            }}
            onClose={() => setRepairDialogTarget(null)}
          />
        );
      })()}

      {/* BottomNav is now rendered globally in App.tsx */}
    </motion.div>
  );
};
