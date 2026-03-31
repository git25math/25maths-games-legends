import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, GitBranch, Wrench, ChevronRight, Swords, BookOpen, Flame, Info, X, AlertTriangle } from 'lucide-react';
import type { Language, Mission, UserProfile } from '../types';
import { computeTechTree, getTopicMissions, getTopicInfo, generateQuests } from '../utils/techTree';
import type { TechNodeState, Quest } from '../utils/techTree';
import { getMistakes } from '../utils/errorMemory';
import type { MistakeRecord } from '../utils/errorMemory';
import { TechTreeColumn } from '../components/TechTreeColumn';
import { lt } from '../i18n/resolveText';
import { toTraditional } from '../i18n/zhHantMap';
import { hasAnyPracticeCompletion } from '../utils/completionState';
import { useAudio } from '../audio';
import type { RecoverySession } from '../utils/recoveryPath';
import { RecoveryPathPanel } from '../components/RecoveryPathPanel';

const LABELS = {
  zh: {
    title: '科技树',
    subtitle: '选择研究方向',
    missions: '相关关卡',
    back: '返回',
    locked: '前置未解锁',
    start: '开始练习',
    corrupted: '技能受损 — 需要修复',
    noMissions: '暂无对应关卡',
    completed: '已完成',
    onboardingTitle: '选择你的研究路线',
    onboardingBody: '完成关卡解锁新节点 · 多条路线可同时推进 · 受损节点需要修复',
    onboardingDismiss: '明白了',
  },
  zh_TW: {
    title: '科技樹',
    subtitle: '選擇研究方向',
    missions: '相關關卡',
    back: '返回',
    locked: '前置未解鎖',
    start: '開始練習',
    corrupted: '技能受損 — 需要修復',
    noMissions: '暫無對應關卡',
    completed: '已完成',
    onboardingTitle: '選擇你的研究路線',
    onboardingBody: '完成關卡解鎖新節點 · 多條路線可同時推進 · 受損節點需要修復',
    onboardingDismiss: '明白了',
  },
  en: {
    title: 'Tech Tree',
    subtitle: 'Choose your research path',
    missions: 'Related Missions',
    back: 'Back',
    locked: 'Prerequisites not met',
    start: 'Start Practice',
    corrupted: 'Skill corrupted — needs repair',
    noMissions: 'No missions available yet',
    completed: 'Completed',
    onboardingTitle: 'Choose your research path',
    onboardingBody: 'Complete missions to unlock nodes · Multiple paths available · Corrupted nodes need repair',
    onboardingDismiss: 'Got it',
  },
};

export const TechTreeScreen = ({
  lang,
  profile,
  missions,
  onBack,
  onMissionStart,
  onPracticeStart,
  onRepairMission,
  onStartRecovery,
  recoverySession,
  onRecoveryStepStart,
  onRecoveryCancelled,
}: {
  lang: Language;
  profile: UserProfile;
  missions: Mission[];
  onBack: () => void;
  onMissionStart: (mission: Mission) => void;
  onPracticeStart: (mission: Mission) => void;
  onRepairMission?: (missionId: number) => void;
  onStartRecovery?: (topicId: string) => void;
  recoverySession?: RecoverySession | null;
  onRecoveryStepStart?: (missionId: number) => void;
  onRecoveryCancelled?: () => void;
}) => {
  const l = LABELS[lang];
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('gl_techtree_seen'); } catch { return true; }
  });
  const dismissOnboarding = () => {
    setShowOnboarding(false);
    try { localStorage.setItem('gl_techtree_seen', '1'); } catch {}
  };

  const { playBadgeUnlock } = useAudio();
  const [unlockToast, setUnlockToast] = useState<string | null>(null);
  const prevUnlockedRef = useRef<Set<string>>(new Set());

  const mistakes = useMemo(
    () => getMistakes(profile.completed_missions as Record<string, unknown>) as Record<string, MistakeRecord>,
    [profile.completed_missions],
  );

  const branches = useMemo(
    () => computeTechTree(missions, profile.completed_missions, mistakes),
    [missions, profile.completed_missions, mistakes],
  );

  const quests = useMemo(() => generateQuests(branches), [branches]);

  // Detect newly unlocked nodes and celebrate
  useEffect(() => {
    const currentUnlocked = new Set<string>();
    for (const b of branches) {
      for (const n of b.nodes) {
        if (n.status === 'unlocked') currentUnlocked.add(n.topicId);
      }
    }
    if (prevUnlockedRef.current.size > 0) {
      for (const topicId of currentUnlocked) {
        if (!prevUnlockedRef.current.has(topicId)) {
          // New unlock detected!
          const info = getTopicInfo(topicId);
          if (info) {
            const nameZh = lang === 'zh_TW' ? toTraditional(info.topic.titleZh) : info.topic.titleZh;
            const name = lang === 'en' ? info.topic.title : nameZh;
            playBadgeUnlock();
            setUnlockToast(name);
            setTimeout(() => setUnlockToast(null), 3500);
          }
          break; // Only celebrate one at a time
        }
      }
    }
    prevUnlockedRef.current = currentUnlocked;
  }, [branches]); // eslint-disable-line react-hooks/exhaustive-deps

  // Topic detail panel data
  const selectedTopicData = useMemo(() => {
    if (!selectedTopicId) return null;
    const info = getTopicInfo(selectedTopicId);
    if (!info) return null;
    const topicMissions = getTopicMissions(selectedTopicId, missions);
    // Find node state from branches
    const branch = branches.find(b => b.chapterId === info.chapter.id);
    const nodeState = branch?.nodes.find(n => n.topicId === selectedTopicId);
    return { info, topicMissions, nodeState };
  }, [selectedTopicId, missions, branches]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-cyan-400" />
            <div>
              <h1 className="text-lg font-black">{l.title}</h1>
              <p className="text-[10px] text-white/30">{l.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding banner — first visit only */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-2 overflow-hidden"
          >
            <div className="max-w-6xl mx-auto bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-cyan-300">{l.onboardingTitle}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{l.onboardingBody}</p>
              </div>
              <button
                onClick={dismissOnboarding}
                className="shrink-0 px-4 py-2 min-h-[44px] rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
              >
                {l.onboardingDismiss}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Quest Panel — "What should I do next?" ═══ */}
      {quests.length > 0 && (
        <div className="mx-4 mt-3 max-w-6xl lg:mx-auto">
          <div className="space-y-2">
            {quests.slice(0, 3).map((q, i) => {
              const isRepair = q.type === 'repair';
              const isStabilise = q.type === 'stabilise';
              const isUnlock = q.type === 'unlock';
              const bgColor = isRepair ? 'bg-rose-500/10 border-rose-500/20' : isStabilise ? 'bg-amber-500/10 border-amber-500/20' : isUnlock ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/20';
              const iconColor = isRepair ? 'text-rose-400' : isStabilise ? 'text-amber-400' : isUnlock ? 'text-emerald-400' : 'text-indigo-400';
              const icon = isRepair ? '🔧' : isStabilise ? '⚠️' : isUnlock ? '💡' : '▶️';
              const label = i === 0 ? (lang === 'en' ? 'Main Quest' : '主线任务') : (lang === 'en' ? 'Side Quest' : '支线任务');

              return (
                <button
                  key={q.topicId + q.type}
                  onClick={() => {
                    if (isRepair && onStartRecovery) {
                      onStartRecovery(q.topicId); // Direct to Repair Mode
                    } else {
                      setSelectedTopicId(q.topicId); // Show topic detail
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColor} text-left hover:brightness-110 transition-all`}
                >
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${iconColor}`}>{label}</span>
                      {q.healthScore != null && q.healthScore < 100 && (
                        <span className={`text-[9px] font-bold ${q.healthScore < 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                          HP {q.healthScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white truncate">{lang === 'en' ? q.title : q.titleZh}</p>
                    <p className="text-[10px] text-white/40 truncate">{lang === 'en' ? q.reason : q.reasonZh}</p>
                  </div>
                  <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tech tree columns — horizontal scroll */}
      <div className="overflow-x-auto pb-8">
        <div className="flex gap-4 p-4 min-w-max max-w-6xl mx-auto">
          {branches.map((branch, i) => (
            <TechTreeColumn
              key={branch.chapterId}
              lang={lang}
              branch={branch}
              onNodeClick={setSelectedTopicId}
            />
          ))}
        </div>
      </div>

      {/* Topic detail slide-in panel */}
      <AnimatePresence>
        {selectedTopicId && selectedTopicData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTopicId(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 md:w-96 max-w-[90vw] bg-slate-800/95 border-l border-white/10 p-5 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Topic header */}
              <div className="mb-4">
                <p className="text-xs text-cyan-400 font-bold">{selectedTopicData.info.topic.id}</p>
                <h2 className="text-lg font-black text-white">
                  {lang === 'en'
                    ? selectedTopicData.info.topic.title
                    : lang === 'zh_TW'
                    ? toTraditional(selectedTopicData.info.topic.titleZh)
                    : selectedTopicData.info.topic.titleZh}
                </h2>
                <p className="text-xs text-white/30 mt-1">
                  {lang === 'en'
                    ? selectedTopicData.info.chapter.title
                    : lang === 'zh_TW'
                    ? toTraditional(selectedTopicData.info.chapter.titleZh)
                    : selectedTopicData.info.chapter.titleZh}
                </p>
              </div>

              {/* Status */}
              {selectedTopicData.nodeState && (
                <div className={`rounded-xl border p-3 mb-4 ${
                  selectedTopicData.nodeState.status === 'corrupted'
                    ? 'border-rose-500/30 bg-rose-950/30'
                    : selectedTopicData.nodeState.status === 'at_risk'
                    ? 'border-orange-500/30 bg-orange-950/30'
                    : selectedTopicData.nodeState.status === 'unlocked'
                    ? 'border-emerald-500/30 bg-emerald-950/30'
                    : selectedTopicData.nodeState.status === 'locked'
                    ? 'border-white/10 bg-white/5'
                    : 'border-amber-500/30 bg-amber-950/30'
                }`}>
                  {/* Health Score bar — always show when health < 100 */}
                  {selectedTopicData.nodeState.healthScore < 100 && selectedTopicData.nodeState.status !== 'locked' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-white/40 font-bold">{lang === 'en' ? 'Skill Health' : '技能健康度'}</span>
                        <span className={`font-black ${
                          selectedTopicData.nodeState.healthScore >= 75 ? 'text-emerald-400' :
                          selectedTopicData.nodeState.healthScore >= 50 ? 'text-amber-400' :
                          selectedTopicData.nodeState.healthScore >= 25 ? 'text-orange-400' :
                          'text-rose-400'
                        }`}>{selectedTopicData.nodeState.healthScore}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            selectedTopicData.nodeState.healthScore >= 75 ? 'bg-emerald-400' :
                            selectedTopicData.nodeState.healthScore >= 50 ? 'bg-amber-400' :
                            selectedTopicData.nodeState.healthScore >= 25 ? 'bg-orange-400' :
                            'bg-rose-500'
                          }`}
                          style={{ width: `${selectedTopicData.nodeState.healthScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedTopicData.nodeState.status === 'corrupted' && (
                    <div>
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
                        <Wrench size={12} />
                        {l.corrupted}
                      </div>
                      {selectedTopicData.topicMissions.length > 0 && (
                        <div className="space-y-2">
                          {/* Recovery Path: deep recursive healing journey */}
                          {onStartRecovery && (
                            <button
                              onClick={() => {
                                setSelectedTopicId(null);
                                onStartRecovery(selectedTopicData.topicId);
                              }}
                              className="w-full py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Flame size={12} />
                              {lang === 'en' ? 'Recovery Path' : lang === 'zh_TW' ? '修復路徑' : '修复路径'}
                            </button>
                          )}
                          {/* Fallback: direct single-mission repair */}
                          {onRepairMission && (
                            <button
                              onClick={() => {
                                const missionToRepair = selectedTopicData.topicMissions[0];
                                if (missionToRepair) {
                                  setSelectedTopicId(null);
                                  onRepairMission(missionToRepair.id);
                                }
                              }}
                              className="w-full py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Wrench size={12} />
                              {lang === 'en' ? 'Quick Repair' : lang === 'zh_TW' ? '快速修復' : '快速修复'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedTopicData.nodeState.status === 'locked' && (
                    <p className="text-white/30 text-xs">{l.locked}</p>
                  )}
                  {selectedTopicData.nodeState.status === 'at_risk' && (
                    <div>
                      <div className="flex items-center gap-2 text-orange-400 text-xs font-bold mb-2">
                        <AlertTriangle size={12} />
                        {(() => {
                          const upId = selectedTopicData.nodeState.upstreamCorrupted;
                          const upInfo = upId ? getTopicInfo(upId) : null;
                          const upName = upInfo ? (lang === 'en' ? upInfo.topic.title : lang === 'zh_TW' ? toTraditional(upInfo.topic.titleZh) : upInfo.topic.titleZh) : upId;
                          return lang === 'en'
                            ? `Upstream "${upName}" is corrupted`
                            : lang === 'zh_TW'
                            ? `上游「${upName}」已受損`
                            : `上游「${upName}」已受损`;
                        })()}
                      </div>
                      <p className="text-[11px] text-white/30 mb-2">
                        {lang === 'en'
                          ? 'Fix the upstream skill first to stabilise this node.'
                          : lang === 'zh_TW'
                          ? '請先修復上游技能以穩定此節點。'
                          : '请先修复上游技能以稳定此节点。'}
                      </p>
                      {selectedTopicData.nodeState.upstreamCorrupted && (
                        <button
                          onClick={() => {
                            setSelectedTopicId(selectedTopicData.nodeState!.upstreamCorrupted!);
                          }}
                          className="w-full py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Wrench size={12} />
                          {lt({ zh: '前往修复上游技能', en: 'Go fix upstream skill' }, lang)}
                        </button>
                      )}
                    </div>
                  )}
                  {(selectedTopicData.nodeState.status === 'researching' || selectedTopicData.nodeState.status === 'available' || selectedTopicData.nodeState.status === 'at_risk') && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${Math.round((selectedTopicData.nodeState.progress / Math.max(1, selectedTopicData.nodeState.total)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">
                        {selectedTopicData.nodeState.progress}/{selectedTopicData.nodeState.total}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Mission list */}
              <p className="text-xs text-white/40 font-bold mb-2">{l.missions}</p>
              {selectedTopicData.topicMissions.length === 0 ? (
                <p className="text-white/20 text-sm py-4">{l.noMissions}</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {selectedTopicData.topicMissions.map(mission => {
                    const completed = hasAnyPracticeCompletion(
                      profile.completed_missions[String(mission.id)]
                    );
                    return (
                      <div
                        key={mission.id}
                        className={`rounded-xl border p-3 transition-all ${
                          completed
                            ? 'border-emerald-500/20 bg-emerald-950/20'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${completed ? 'text-emerald-400' : 'text-white'}`}>
                              {lt(mission.title, lang)}
                            </p>
                            {mission.skillName && (
                              <p className="text-[10px] text-white/30 truncate">{lt(mission.skillName, lang)}</p>
                            )}
                          </div>
                          {completed && (
                            <span className="text-[10px] text-emerald-400 font-bold">{l.completed}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onPracticeStart(mission)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-colors"
                          >
                            <BookOpen size={12} />
                            {lang === 'en' ? 'Practice' : lang === 'zh_TW' ? '練習' : '练习'}
                          </button>
                          <button
                            onClick={() => onMissionStart(mission)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/25 transition-colors"
                          >
                            <Swords size={12} />
                            {lang === 'en' ? 'Battle' : lang === 'zh_TW' ? '闯關' : '闯关'}
                            <Flame size={10} className="text-orange-400 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedTopicId(null)}
                className="w-full mt-6 py-2.5 rounded-xl bg-white/5 text-white/50 font-bold text-sm hover:bg-white/10 transition-colors"
              >
                {l.back}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node unlock celebration toast */}
      <AnimatePresence>
        {unlockToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-6 py-3 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/50 rounded-2xl shadow-2xl pointer-events-none"
          >
            <span className="text-xl">🎉</span>
            <div>
              <p className="text-white font-black text-sm">
                {lang === 'en' ? 'Node Unlocked!' : lang === 'zh_TW' ? '節點解鎖！' : '节点解锁！'}
              </p>
              <p className="text-white/70 font-bold text-xs">{unlockToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recovery Path Panel — shown when an active recovery session exists */}
      <AnimatePresence>
        {recoverySession && onRecoveryStepStart && onRecoveryCancelled && (
          <RecoveryPathPanel
            lang={lang}
            session={recoverySession}
            missions={missions}
            onStartStep={(missionId) => {
              setSelectedTopicId(null);
              onRecoveryStepStart(missionId);
            }}
            onCancel={onRecoveryCancelled}
            onComplete={onRecoveryCancelled}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
