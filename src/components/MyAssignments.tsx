/**
 * MyAssignments — Student sees their assigned homework.
 * Fetches from get_my_assignments() RPC. Shows title, deadline, progress.
 * Tapping a mission navigates to practice.
 */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import type { Language, MissionSummary, CompletedMissions } from '../types';
import { supabase } from '../supabase';
import { lt } from '../i18n/resolveText';
import { toTraditional } from '../i18n/zhHantMap';
import { resolveAssignmentMissionItems } from '../utils/missionSummary';
import { useAssignmentMissionMap } from '../hooks/useAssignmentMissionMap';

type AssignmentData = {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  mission_ids: number[];
  created_at: string;
};

type Props = {
  lang: Language;
  missions: MissionSummary[];
  completedMissions: CompletedMissions;
  onMissionStart: (missionId: number) => void;
  onClose: () => void;
};

export function MyAssignments({ lang, missions, completedMissions, onMissionStart, onClose }: Props) {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const txt = (zh: string, en: string) => lang === 'en' ? en : lang === 'zh_TW' ? toTraditional(zh) : zh;
  const assignmentMissionIds = useMemo(
    () => assignments.flatMap(assignment => assignment.mission_ids),
    [assignments],
  );
  const missionMap = useAssignmentMissionMap(assignmentMissionIds, missions);

  useEffect(() => {
    supabase.rpc('get_my_assignments').then(({ data, error }) => {
      if (error) console.warn('Failed to load assignments:', error.message);
      setAssignments((data || []) as AssignmentData[]);
      setLoading(false);
    }).catch(() => {
      setAssignments([]);
      setLoading(false);
    });
  }, []);

  const getMissionProgress = (missionIds: number[]) => {
    let done = 0;
    for (const mid of missionIds) {
      const c = completedMissions[String(mid)];
      if (c && (c as any).green) done++;
    }
    return { done, total: missionIds.length };
  };

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-8 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            <h2 className="text-base font-black text-slate-800">
              {txt('我的作业', 'My Homework')}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[calc(100vh-120px)] sm:max-h-[65vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-8">
              {txt('加载中...', 'Loading...')}
            </p>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-slate-400">
                {txt('还没有作业。', 'No homework assigned yet.')}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {txt('加入一个班级后，老师会在这里布置作业。', 'Join a class to receive assignments from your teacher.')}
              </p>
            </div>
          ) : (
            assignments.map(a => {
              const { done, total } = getMissionProgress(a.mission_ids);
              const allDone = done >= total;
              const overdue = isOverdue(a.deadline);
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <div key={a.id} className={`rounded-2xl border-2 p-4 ${
                  allDone ? 'bg-emerald-50 border-emerald-200' :
                  overdue ? 'bg-rose-50 border-rose-200' :
                  'bg-white border-slate-200'
                }`}>
                  {/* Title + status */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-black text-slate-800">{a.title}</h3>
                    {allDone && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                    {overdue && !allDone && <AlertTriangle size={16} className="text-rose-500 flex-shrink-0" />}
                  </div>

                  {a.description && (
                    <p className="text-xs text-slate-500 mb-2">{a.description}</p>
                  )}

                  {/* Deadline with countdown */}
                  {a.deadline && (() => {
                    const daysLeft = Math.ceil((new Date(a.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const label = overdue && !allDone
                      ? txt('已过期', 'Overdue')
                      : daysLeft === 0 ? txt('今天截止！', 'Due today!')
                      : daysLeft === 1 ? txt('明天截止', 'Due tomorrow')
                      : txt(`还剩 ${daysLeft} 天`, `${daysLeft} days left`);
                    const urgent = !allDone && daysLeft <= 1;
                    return (
                      <div className={`flex items-center gap-1 text-xs mb-2 ${overdue && !allDone ? 'text-rose-500 font-bold' : urgent ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        <Clock size={10} />
                        {label}
                      </div>
                    );
                  })()}

                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${allDone ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{done}/{total}</span>
                  </div>

                  {/* Celebration when all done */}
                  {allDone && (
                    <div className="text-center py-2 mb-2">
                      <p className="text-emerald-600 text-sm font-black">
                        {txt('全部完成！做得漂亮！', 'All done! Great work!')} 🎉
                      </p>
                    </div>
                  )}

                  {/* Mission list — undone first */}
                  <div className="space-y-1.5">
                    {resolveAssignmentMissionItems(a.mission_ids, missionMap, completedMissions)
                      .map(({ id, title, isDone, missingSummary }) => {
                      return (
                        <button
                          key={id}
                          onClick={() => { if (!isDone) { onClose(); onMissionStart(id); } }}
                          disabled={isDone}
                          className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-left text-sm transition-all ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-600 line-through opacity-50'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-slate-800 border border-indigo-200 font-bold'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={16} /> : <BookOpen size={16} className="text-indigo-500" />}
                          <span className="truncate">{lt(title, lang)}</span>
                          {missingSummary && !isDone && <span className="text-[10px] text-slate-400">{txt('补载中', 'Loading')}</span>}
                          {!isDone && <span className="ml-auto text-indigo-400 text-xs">→</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
