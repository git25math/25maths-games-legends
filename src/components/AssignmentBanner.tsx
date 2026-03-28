/**
 * AssignmentBanner — Student-facing assignment display (Phase D2, v8.3)
 * Shows active assignments from teachers with deadline countdown.
 * Renders above the mission map on MapScreen.
 */
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Clock, CheckCircle2, ChevronDown, ChevronRight, Swords } from 'lucide-react';
import type { Language, Mission, CompletedMissions } from '../types';
import { supabase } from '../supabase';
import { lt } from '../i18n/resolveText';
import { MISSIONS } from '../data/missions';

// Module-level: built once, shared across all renders
const MISSION_MAP = new Map<number, Mission>();
for (const m of MISSIONS) MISSION_MAP.set(m.id, m);

type StudentAssignment = {
  id: string;
  grade: number;
  class_tag: string;
  mission_ids: number[];
  title: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
};

type Props = {
  lang: Language;
  assignments: StudentAssignment[];
  completedMissions: CompletedMissions;
  onMissionStart: (mission: Mission) => void;
};

export function AssignmentBanner({ lang, assignments, completedMissions, onMissionStart }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (assignments.length === 0) return null;

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: lang === 'en' ? `Overdue ${-diffDays}d` : `已逾期 ${-diffDays} 天`, urgent: true };
    if (diffDays === 0) return { text: lang === 'en' ? 'Due today!' : '今天截止！', urgent: true };
    if (diffDays === 1) return { text: lang === 'en' ? 'Due tomorrow' : '明天截止', urgent: true };
    if (diffDays <= 3) return { text: lang === 'en' ? `${diffDays} days left` : `剩余 ${diffDays} 天`, urgent: false };
    return { text: lang === 'en' ? `${diffDays} days left` : `剩余 ${diffDays} 天`, urgent: false };
  };

  return (
    <div className="space-y-3">
      {assignments.map(a => {
        const expanded = expandedId === a.id;
        const deadlineInfo = formatDeadline(a.deadline);
        const completedCount = a.mission_ids.filter(mid =>
          (completedMissions as any)?.[String(mid)]?.green
        ).length;
        const allDone = completedCount === a.mission_ids.length;

        return (
          <motion.div
            key={a.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border-2 overflow-hidden ${
              allDone
                ? 'bg-emerald-900/20 border-emerald-500/20'
                : deadlineInfo?.urgent
                  ? 'bg-gradient-to-r from-rose-900/30 to-amber-900/30 border-rose-500/30'
                  : 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30'
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expanded ? null : a.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    allDone ? 'bg-emerald-500/20' : 'bg-indigo-500/20'
                  }`}>
                    {allDone
                      ? <CheckCircle2 size={20} className="text-emerald-400" />
                      : <ClipboardList size={20} className="text-indigo-400" />
                    }
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-black text-sm truncate ${allDone ? 'text-emerald-300' : 'text-white'}`}>
                      {a.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-white/40 text-[10px] font-bold">
                        {completedCount}/{a.mission_ids.length} {lang === 'en' ? 'done' : '已完成'}
                      </span>
                      {deadlineInfo && (
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                          deadlineInfo.urgent ? 'text-rose-400' : 'text-white/40'
                        }`}>
                          <Clock size={10} /> {deadlineInfo.text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Progress ring */}
                  <div className="relative w-9 h-9">
                    <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none"
                        stroke={allDone ? '#10b981' : '#818cf8'}
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${(a.mission_ids.length > 0 ? (completedCount / a.mission_ids.length) : 0) * 94.25} 94.25`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white/70">
                      {a.mission_ids.length > 0 ? Math.round((completedCount / a.mission_ids.length) * 100) : 0}%
                    </span>
                  </div>
                  {expanded ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-white/10 pt-3">
                    {a.description && (
                      <p className="text-xs text-white/50 mb-3 italic">{a.description}</p>
                    )}
                    <div className="space-y-2">
                      {a.mission_ids.map(mid => {
                        const mission = MISSION_MAP.get(mid);
                        if (!mission) return null;
                        const isDone = (completedMissions as any)?.[String(mid)]?.green;
                        return (
                          <div key={mid} className="flex items-center gap-3">
                            {isDone
                              ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              : <div className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" />
                            }
                            <span className={`text-xs font-bold flex-1 truncate ${isDone ? 'text-emerald-300/70 line-through' : 'text-white/80'}`}>
                              {lt(mission.title, lang)}
                            </span>
                            {!isDone && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onMissionStart(mission); }}
                                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/40 border border-indigo-500/30 rounded-lg text-[10px] font-bold text-indigo-300 hover:bg-indigo-600/60 transition-colors shrink-0"
                              >
                                <Swords size={10} /> {lang === 'en' ? 'Go' : '去做'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Single source of truth for student assignments.
 * Returns both the full list and a Set of assigned mission IDs.
 * Use this hook once in MapScreen; pass `assignments` prop to AssignmentBanner.
 */
export function useMyAssignments(userId: string): {
  assignments: StudentAssignment[];
  assignedMissionIds: Set<number>;
} {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);

  useEffect(() => {
    if (userId === 'guest') return;
    supabase.rpc('get_my_assignments').then(({ data, error }) => {
      if (!error && data) setAssignments(data as StudentAssignment[]);
    }, () => {});
  }, [userId]);

  const assignedMissionIds = useMemo(() => {
    const set = new Set<number>();
    for (const a of assignments) {
      for (const mid of a.mission_ids) set.add(mid);
    }
    return set;
  }, [assignments]);

  return { assignments, assignedMissionIds };
}


