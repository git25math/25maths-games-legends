import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, GitBranch, Wrench, ChevronRight } from 'lucide-react';
import type { Language, Mission, UserProfile } from '../types';
import { computeTechTree, getTopicMissions, getTopicInfo } from '../utils/techTree';
import type { TechNodeState } from '../utils/techTree';
import { getMistakes } from '../utils/errorMemory';
import type { MistakeRecord } from '../utils/errorMemory';
import { TechTreeColumn } from '../components/TechTreeColumn';
import { lt } from '../i18n/resolveText';
import { hasAnyPracticeCompletion } from '../utils/completionState';

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
  },
};

export const TechTreeScreen = ({
  lang,
  profile,
  missions,
  onBack,
  onMissionStart,
  onPracticeStart,
}: {
  lang: Language;
  profile: UserProfile;
  missions: Mission[];
  onBack: () => void;
  onMissionStart: (mission: Mission) => void;
  onPracticeStart: (mission: Mission) => void;
}) => {
  const l = LABELS[lang];
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const mistakes = useMemo(
    () => getMistakes(profile.completed_missions as Record<string, unknown>) as Record<string, MistakeRecord>,
    [profile.completed_missions],
  );

  const branches = useMemo(
    () => computeTechTree(missions, profile.completed_missions, mistakes),
    [missions, profile.completed_missions, mistakes],
  );

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
              className="absolute right-0 top-0 bottom-0 w-80 md:w-96 bg-slate-800/95 border-l border-white/10 p-5 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Topic header */}
              <div className="mb-4">
                <p className="text-xs text-cyan-400 font-bold">{selectedTopicData.info.topic.id}</p>
                <h2 className="text-lg font-black text-white">
                  {lang === 'en'
                    ? selectedTopicData.info.topic.title
                    : selectedTopicData.info.topic.titleZh}
                </h2>
                <p className="text-xs text-white/30 mt-1">
                  {lang === 'en'
                    ? selectedTopicData.info.chapter.title
                    : selectedTopicData.info.chapter.titleZh}
                </p>
              </div>

              {/* Status */}
              {selectedTopicData.nodeState && (
                <div className={`rounded-xl border p-3 mb-4 ${
                  selectedTopicData.nodeState.status === 'corrupted'
                    ? 'border-rose-500/30 bg-rose-950/30'
                    : selectedTopicData.nodeState.status === 'unlocked'
                    ? 'border-emerald-500/30 bg-emerald-950/30'
                    : selectedTopicData.nodeState.status === 'locked'
                    ? 'border-white/10 bg-white/5'
                    : 'border-amber-500/30 bg-amber-950/30'
                }`}>
                  {selectedTopicData.nodeState.status === 'corrupted' && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                      <Wrench size={12} />
                      {l.corrupted}
                    </div>
                  )}
                  {selectedTopicData.nodeState.status === 'locked' && (
                    <p className="text-white/30 text-xs">{l.locked}</p>
                  )}
                  {(selectedTopicData.nodeState.status === 'researching' || selectedTopicData.nodeState.status === 'available') && (
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
                      <button
                        key={mission.id}
                        onClick={() => onPracticeStart(mission)}
                        className={`w-full text-left rounded-xl border p-3 flex items-center gap-2 transition-all ${
                          completed
                            ? 'border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/30'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${completed ? 'text-emerald-400' : 'text-white'}`}>
                            {lt(mission.title, lang)}
                          </p>
                          {mission.skillName && (
                            <p className="text-[10px] text-white/30 truncate">{lt(mission.skillName, lang)}</p>
                          )}
                        </div>
                        {completed ? (
                          <span className="text-[10px] text-emerald-400 font-bold">{l.completed}</span>
                        ) : (
                          <ChevronRight size={14} className="text-white/30" />
                        )}
                      </button>
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
    </div>
  );
};
