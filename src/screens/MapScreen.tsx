import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapIcon, Crown, CheckCircle2, Lock, Swords, BookOpen, Star, Flame, Zap, ChevronDown, ChevronRight, Wrench, AlertTriangle, ClipboardList, MoreHorizontal, X, Sparkles } from 'lucide-react';
import type { Language, UserProfile, Mission, Character, CompletedMissions } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { MathView, LatexText } from '../components/MathView';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { interpolate } from '../utils/interpolate';
import { useAudio } from '../audio';
import { supabase } from '../supabase';
import { tapScale, hoverGlow, springIn, staggerContainer, staggerItem } from '../utils/animationPresets';
import { EmptyState } from '../components/EmptyState';
import { getLevelInfo, getRankTier } from '../utils/xpLevels';
import { getDailyMission, isDailyCompleted, getSecondsUntilMidnight, formatCountdown } from '../utils/dailyChallenge';
import { MissionProgressBar } from '../components/MissionProgressBar';
import { RepairDialog } from '../components/RepairDialog';
import { DailyQuestPanel } from '../components/DailyQuestPanel';
import { getSeasonLevel, getSeasonBorder, getSeasonTitle } from '../data/seasons/season1';
import { getSeasonProgress } from '../utils/seasonTracker';
import { getEquipmentState, countNeedsRepair, EQUIPMENT_COLORS, getEquipmentHealth } from '../utils/equipment';
import { healthToEquipmentState } from '../utils/repairItems';
import type { KPEquipment, EquipmentState } from '../types';
import { getExpeditionsForGrade, type Expedition } from '../data/expeditions';
import { getNextMilestone } from '../data/streakMilestones';
import { getWeakMissions, getMistakes, rankByWeakness, getDominantPattern } from '../utils/errorMemory';
import type { MistakeRecord } from '../utils/errorMemory';
import { AssignmentBanner, useMyAssignments } from '../components/AssignmentBanner';
import { StaminaBar } from '../components/StaminaBar';
import { getStamina, getRemainingAttempts } from '../utils/stamina';
import { getInventory, getTotalItems } from '../utils/inventory';
import type { CharacterProgression } from '../types';
import { hasAnyPracticeCompletion, isPracticePerfect } from '../utils/completionState';
import { getCurrency, CURRENCY_LABELS } from '../utils/currency';
import { VocabReviewPanel } from '../components/VocabReviewPanel';
import { JoinClassModal } from '../components/JoinClassModal';
import { toMissionSummaries } from '../utils/missionSummary';
import { loadMissionById } from '../hooks/useMissions';

const SkillTreePanel = lazy(() => import('../components/SkillTreePanel').then(module => ({ default: module.SkillTreePanel })));
const EquipmentPanel = lazy(() => import('../components/EquipmentPanel').then(module => ({ default: module.EquipmentPanel })));
const InventoryPanel = lazy(() => import('../components/InventoryPanel').then(module => ({ default: module.InventoryPanel })));
const ShopPanel = lazy(() => import('../components/ShopPanel').then(module => ({ default: module.ShopPanel })));
const BattlePassPanel = lazy(() => import('../components/BattlePassPanel').then(module => ({ default: module.BattlePassPanel })));
const StrategicScrollsPanel = lazy(() => import('../components/StrategicScrollsPanel').then(module => ({ default: module.StrategicScrollsPanel })));
const ProgressReport = lazy(() => import('../components/ProgressReport').then(module => ({ default: module.ProgressReport })));
const MyAssignments = lazy(() => import('../components/MyAssignments').then(module => ({ default: module.MyAssignments })));
const LearningTimeline = lazy(() => import('../components/LearningTimeline').then(module => ({ default: module.LearningTimeline })));

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

function MapOverlayFallback({ lang }: { lang: Language }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
      <div className="px-5 py-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-indigo-400 animate-spin" />
        <p className="text-sm font-bold text-white/80">
          {lang === 'en' ? 'Loading panel...' : lang === 'zh_TW' ? '載入面板中…' : '加载面板中...'}
        </p>
      </div>
    </div>
  );
}

export const MapScreen = ({
  lang,
  profile,
  missions,
  selectedChar,
  learnerMode = 'practice' as import('../types').LearnerMode,
  onLearnerModeChange,
  autoOpenHomework,
  onHomeworkOpened,
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
  mobileMenuOpen,
  onMobileMenuClose,
}: {
  lang: Language;
  profile: UserProfile;
  missions: Mission[];
  selectedChar: Character | undefined;
  learnerMode?: import('../types').LearnerMode;
  onLearnerModeChange?: (mode: import('../types').LearnerMode) => void;
  autoOpenHomework?: boolean;
  onHomeworkOpened?: () => void;
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
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
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
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [showVocabReview, setShowVocabReview] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [showMyHomework, setShowMyHomework] = useState(false);

  // Auto-open homework from deep link (?hw=1)
  useEffect(() => {
    if (autoOpenHomework) {
      setShowMyHomework(true);
      onHomeworkOpened?.();
    }
  }, [autoOpenHomework]);
  const [expandedCompletedUnit, setExpandedCompletedUnit] = useState<string | null>(null);
  const [showCompletedInCurrentUnit, setShowCompletedInCurrentUnit] = useState(false);

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
      }, () => { /* KP progress load failed — non-blocking */ });
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
  const missionSummaries = useMemo(() => toMissionSummaries(missions), [missions]);
  const missionById = useMemo(() => {
    const map = new Map<number, Mission>();
    for (const mission of missions) {
      map.set(mission.id, mission);
    }
    return map;
  }, [missions]);

  const startAssignmentMission = async (missionId: number) => {
    const mission = missionById.get(missionId) ?? await loadMissionById(missionId);
    if (mission) {
      onPracticeStart(mission);
    }
  };

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
  const rankTier = getRankTier(levelInfo.level);
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

  // ── Assigned missions (from teacher assignments) — single fetch, shared below ──
  const { assignments: myAssignments, assignedMissionIds } = useMyAssignments(profile.user_id);

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

      {/* Mission cards — completed missions compact, active/upcoming full */}
      {(() => {
        const completedInUnit = u.unitMissions.filter(m => hasAnyPracticeCompletion(profile.completed_missions[String(m.id)]));
        const activeAndUpcoming = u.unitMissions.filter(m => !hasAnyPracticeCompletion(profile.completed_missions[String(m.id)]));
        return (<>
          {/* Compact completed row within current unit */}
          {isCurrentUnit && completedInUnit.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => { playTap(); setShowCompletedInCurrentUnit(!showCompletedInCurrentUnit); }}
                className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-xs font-bold"
              >
                <CheckCircle2 size={14} className="text-emerald-400/60" />
                {lt({ zh: `已完成 ${completedInUnit.length} 关`, en: `${completedInUnit.length} completed` }, lang)}
                {showCompletedInCurrentUnit ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              <AnimatePresence>
                {showCompletedInCurrentUnit && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-2"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {completedInUnit.map(mission => {
                        const isPerfect = isPracticePerfect(profile.completed_missions[String(mission.id)]);
                        return (
                          <motion.button
                            key={mission.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { playTap(); onPracticeStart(mission); }}
                            className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-left hover:bg-white/10 transition-colors"
                          >
                            <CheckCircle2 size={14} className="text-emerald-400/70 shrink-0" />
                            <span className="text-white/50 text-[11px] font-bold truncate flex-1">{lt(mission.title, lang)}</span>
                            {isPerfect && <Crown size={12} className="text-amber-400 shrink-0" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Active + upcoming missions — full cards */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {(isCurrentUnit ? activeAndUpcoming : u.unitMissions).map(mission => {
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
                    className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl border-2 transition-shadow ${isLocked ? 'opacity-50 grayscale border-transparent' : isNextUp ? 'border-amber-400 shadow-amber-500/20' : isLastCleared ? 'border-transparent' : 'border-transparent hover:shadow-indigo-500/20'}`}
                  >
                {isNextUp && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-amber-500 text-white text-[11px] sm:text-xs font-black rounded-full z-10 shadow-md">
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
                <h4 className="text-sm sm:text-lg md:text-2xl font-black text-slate-800 mb-1 sm:mb-2 line-clamp-2 pr-10">{lt(mission.title, lang)}</h4>

                {/* Status row — minimal on mobile */}
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider ${
                    mission.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                    mission.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {t.difficulty[mission.difficulty]}
                  </span>
                  <span className="hidden sm:inline text-indigo-500 text-xs font-bold uppercase">{t.questionTypes[mission.type]}</span>
                  {isCompleted && <CheckCircle2 className="text-emerald-500 ml-auto" size={16} />}
                  {isLocked && <Lock className="text-slate-400 ml-auto" size={16} />}
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
                  // Mobile: only show homework + weak badges. Desktop: show all.
                  const hasBadges = isAssigned || isWeak;
                  return hasBadges ? (
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {isAssigned && !isCompleted && (
                        <span className="px-2.5 py-1 bg-purple-500 text-white text-[10px] font-black rounded-full flex items-center gap-1 animate-pulse shadow-sm">
                          <ClipboardList size={10} /> {lt({ zh: '作业', en: 'HW' }, lang)}
                        </span>
                      )}
                      {isWeak && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-full border border-rose-200 flex items-center gap-0.5">
                          <AlertTriangle size={10} /> {lt({ zh: '需复习', en: 'Review' }, lang)}
                        </span>
                      )}
                      {/* Desktop-only badges */}
                      {pb && <span className="hidden sm:inline px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full border border-amber-200">PB {pb}</span>}
                      {isHot && <span className="hidden sm:inline px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full border border-orange-200">🔥 {hotLabel}</span>}
                    </div>
                  ) : <div className="mb-2" />;
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
        </>);
      })()}
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
            <div className={`absolute -bottom-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-xs border-2 border-white/30 shadow-lg ${
              rankTier.tier === 5 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
              rankTier.tier === 4 ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
              rankTier.tier === 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
              rankTier.tier === 2 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              'bg-gradient-to-br from-slate-500 to-slate-600'
            }`}>
              {levelInfo.level}
            </div>
          </button>
          <div>
            <h3 className="text-white font-black text-lg md:text-2xl flex items-center gap-2 flex-wrap">
              {profile.display_name}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                rankTier.tier === 5 ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                rankTier.tier === 4 ? 'bg-rose-500/20 border-rose-400/30 text-rose-300' :
                rankTier.tier === 3 ? 'bg-amber-500/20 border-amber-400/30 text-amber-300' :
                rankTier.tier === 2 ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' :
                'bg-slate-500/20 border-slate-400/30 text-slate-300'
              }`}>
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
                  className={`h-full rounded-full ${
                    rankTier.tier === 5 ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
                    rankTier.tier === 4 ? 'bg-gradient-to-r from-rose-400 to-pink-500' :
                    rankTier.tier === 3 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                    rankTier.tier === 2 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                    'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}
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
            {/* ── Three-currency display (always visible; zero = muted) ── */}
            {(() => {
              const bal = getCurrency(profile.completed_missions as Record<string, unknown>);
              return (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {(['merit', 'wisdom', 'rations'] as const).map(type => {
                    const lbl = CURRENCY_LABELS[type];
                    const isZero = bal[type] === 0;
                    const color = isZero ? 'text-white/25' : type === 'merit' ? 'text-amber-400' : type === 'wisdom' ? 'text-purple-400' : 'text-emerald-400';
                    const bg = isZero ? 'bg-white/5 border-white/10' : type === 'merit' ? 'bg-amber-500/10 border-amber-500/20' : type === 'wisdom' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
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
              <button onClick={onGradeChange} className="px-3 py-1.5 min-h-[36px] bg-amber-600/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 hover:bg-amber-600/40 transition-colors">
                {t.year} {profile.grade}
              </button>
              <button onClick={onCharChange} className="px-3 py-1.5 min-h-[36px] bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 hover:bg-indigo-600/40 transition-colors">
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

              {/* ── 兵法宝典: mobile-only shortcut button (desktop has it in secondary row) ── */}
              <button
                onClick={() => setShowScrolls(true)}
                className="md:hidden px-2 py-0.5 bg-amber-600/20 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-amber-600/40 transition-colors flex items-center gap-1"
              >
                📜 {lang === 'en' ? 'Strategy' : lang === 'zh_TW' ? '兵法寶典' : '兵法宝典'}
              </button>

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
                    <button onClick={() => { setShowProgressReport(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs text-blue-300">
                      📊 {lang === 'en' ? 'Report' : '学习报告'}
                    </button>
                    <button onClick={() => { setShowVocabReview(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs text-purple-300">
                      📖 {lang === 'en' ? 'Vocab Review' : '词汇复习'}
                    </button>
                    <button onClick={() => { setShowTimeline(true); setShowMoreMenu(false); }} className="px-3 py-1.5 bg-amber-600/20 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                      ✨ {lang === 'en' ? 'My Journey' : '成长轨迹'}
                    </button>
                    {onLearnerModeChange && (
                      <div className="flex gap-1">
                        {([['explore', '🌱', '探索'], ['practice', '📖', '练习'], ['exam', '🎯', '备考']] as const).map(([mode, icon, label]) => (
                          <button
                            key={mode}
                            onClick={() => { onLearnerModeChange(mode); setShowMoreMenu(false); }}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              learnerMode === mode ? 'bg-white/20 text-white ring-1 ring-white/30' : 'bg-white/5 text-white/40 hover:text-white/70'
                            }`}
                          >
                            {icon} {lang === 'en' ? mode : label}
                          </button>
                        ))}
                      </div>
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
            <span className={`text-2xl md:text-4xl font-black ${rankTier.color}`}>{levelInfo.level}</span>
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
        assignments={myAssignments}
        missions={missionSummaries}
        completedMissions={profile.completed_missions}
        onMissionStart={startAssignmentMission}
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
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
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
        </Suspense>
      )}

      {showBattlePass && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
          <BattlePassPanel
            lang={lang}
            completedMissions={profile.completed_missions as Record<string, unknown>}
            onClose={() => setShowBattlePass(false)}
          />
        </Suspense>
      )}

      {showEquipmentPanel && onRepairEquipment && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
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
        </Suspense>
      )}

      {showInventory && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
          <InventoryPanel
            lang={lang}
            completedMissions={profile.completed_missions as Record<string, unknown>}
            onClose={() => setShowInventory(false)}
          />
        </Suspense>
      )}

      {showScrolls && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
          <StrategicScrollsPanel
            lang={lang}
            onClose={() => setShowScrolls(false)}
          />
        </Suspense>
      )}

      {showShop && onBuyItem && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
          <ShopPanel
            lang={lang}
            completedMissions={profile.completed_missions as Record<string, unknown>}
            onBuyItem={onBuyItem}
            onClose={() => setShowShop(false)}
          />
        </Suspense>
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

      {/* ── Mobile "Me" bottom sheet ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm md:hidden"
            onClick={onMobileMenuClose}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 bg-[#161226] rounded-t-2xl border-t border-white/10 p-4 pb-24 max-h-[75vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              {/* ═══ Core items (always visible) ═══ */}
              <div className="grid grid-cols-4 gap-3 mb-3">
                {onLeaderboard && (
                  <button onClick={() => { onMobileMenuClose?.(); onLeaderboard(); }}
                    className="flex flex-col items-center gap-1.5 py-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-300 active:bg-yellow-500/20">
                    <span className="text-2xl">🏆</span>
                    <span className="text-xs font-bold">{lang === 'en' ? 'Ranks' : '排行'}</span>
                  </button>
                )}
                <button onClick={() => { onMobileMenuClose?.(); setShowProgressReport(true); }}
                  className="flex flex-col items-center gap-1.5 py-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-300 active:bg-blue-500/20">
                  <span className="text-2xl">📊</span>
                  <span className="text-xs font-bold">{lang === 'en' ? 'Report' : '报告'}</span>
                </button>
                {onStartExpedition && (
                  <button onClick={() => { const exps = getExpeditionsForGrade(profile.grade!); if (exps.length > 0) { onStartExpedition(exps[0].id); } onMobileMenuClose?.(); }}
                    className="flex flex-col items-center gap-1.5 py-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-300 active:bg-amber-500/20">
                    <span className="text-2xl">⚔️</span>
                    <span className="text-xs font-bold">{lang === 'en' ? 'Quest' : '远征'}</span>
                  </button>
                )}
                <button onClick={() => { onMobileMenuClose?.(); setShowJoinClass(true); }}
                  className="flex flex-col items-center gap-1.5 py-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-300 active:bg-indigo-500/20">
                  <span className="text-2xl">🏫</span>
                  <span className="text-xs font-bold">{lang === 'en' ? 'Class' : '班级'}</span>
                </button>
              </div>

              {/* ══�� More items (collapsed) ═══ */}
              <button onClick={() => setShowMoreItems(!showMoreItems)} className="w-full text-center text-white/30 text-[10px] font-bold mb-2">
                {showMoreItems ? (lang === 'en' ? '▲ Less' : '▲ 收起') : (lang === 'en' ? '▼ More tools' : '▼ 更多工具')}
              </button>
              {showMoreItems && (
              <div className="grid grid-cols-4 gap-2">
                {/* 科技树 */}
                {onTechTree && (
                  <button onClick={() => { onMobileMenuClose?.(); onTechTree(); }}
                    className="flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">🌿</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Tech Tree' : '科技树'}</span>
                  </button>
                )}
                {/* 技能树 */}
                {getCharProgression && selectedChar && (
                  <button onClick={() => { onMobileMenuClose?.(); setShowSkillTree(true); }}
                    className="flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">🃏</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Skills' : '技能'}</span>
                  </button>
                )}
                {/* 装备库 */}
                {onRepairEquipment && (
                  <button onClick={() => { onMobileMenuClose?.(); setShowEquipmentPanel(true); }}
                    className="relative flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">🛡️</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Arsenal' : '装备'}</span>
                    {countNeedsRepair(profile.completed_missions as Record<string, unknown>) > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {countNeedsRepair(profile.completed_missions as Record<string, unknown>)}
                      </span>
                    )}
                  </button>
                )}
                {/* 排行榜 */}
                {onLeaderboard && (
                  <button onClick={() => { onMobileMenuClose?.(); onLeaderboard(); }}
                    className="flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">🏆</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Ranks' : '排行'}</span>
                  </button>
                )}
                {/* 好友对决 */}
                {onFriendPK && (
                  <button onClick={() => { onMobileMenuClose?.(); onFriendPK(); }}
                    className="flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">⚔️</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Friend PK' : 'PK'}</span>
                  </button>
                )}
                {/* 成就墙 */}
                {onAchievements && (
                  <button onClick={() => { onMobileMenuClose?.(); onAchievements(); }}
                    className="flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">🏅</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Awards' : '成就'}</span>
                  </button>
                )}
                {/* 教师看板 */}
                {onDashboard && (
                  <button onClick={() => { onMobileMenuClose?.(); onDashboard(); }}
                    className="flex flex-col items-center gap-1 py-3 min-h-[52px] bg-white/5 rounded-xl border border-white/8 text-white/70 active:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="text-xl">📊</span>
                    <span className="text-[11px] font-bold">{lang === 'en' ? 'Dashboard' : '看板'}</span>
                  </button>
                )}
              </div>
              )}
              <div className="h-4" /> {/* safe area spacer above BottomNav */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showProgressReport && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
          <ProgressReport
            lang={lang}
            displayName={profile.display_name || (lang === 'en' ? 'Student' : '学生')}
            grade={profile.grade || 7}
            totalScore={profile.total_score || 0}
            completedMissions={(profile.completed_missions || {}) as CompletedMissions}
            onClose={() => setShowProgressReport(false)}
          />
        </Suspense>
      )}

      {/* Vocab Review Panel */}
      {showVocabReview && (
        <VocabReviewPanel
          lang={lang}
          onClose={() => setShowVocabReview(false)}
        />
      )}

      {/* Learning Timeline */}
      <AnimatePresence>
        {showTimeline && (
          <Suspense fallback={<MapOverlayFallback lang={lang} />}>
            <LearningTimeline
              lang={lang}
              profile={profile}
              onClose={() => setShowTimeline(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {showMyHomework && (
        <Suspense fallback={<MapOverlayFallback lang={lang} />}>
          <MyAssignments
            lang={lang}
            missions={missionSummaries}
            completedMissions={(profile.completed_missions || {}) as CompletedMissions}
            onMissionStart={startAssignmentMission}
            onClose={() => { setShowMyHomework(false); onHomeworkOpened?.(); }}
          />
        </Suspense>
      )}

      {showJoinClass && (
        <JoinClassModal
          lang={lang}
          onJoined={() => { /* profile will refresh on next load */ }}
          onClose={() => setShowJoinClass(false)}
        />
      )}
    </motion.div>
  );
};
