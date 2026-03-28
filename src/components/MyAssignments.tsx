/**
 * MyAssignments — Student sees their assigned homework.
 * Fetches from get_my_assignments() RPC. Shows title, deadline, progress.
 * Tapping a mission navigates to practice.
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import type { Language, Mission, CompletedMissions } from '../types';
import { supabase } from '../supabase';
import { lt } from '../i18n/resolveText';
import { toTraditional } from '../i18n/zhHantMap';

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
  missions: Mission[];
  completedMissions: CompletedMissions;
  onMissionStart: (mission: Mission) => void;
  onClose: () => void;
};

export function MyAssignments({ lang, missions, completedMissions, onMissionStart, onClose }: Props) {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const txt = (zh: string, en: string) => lang === 'en' ? en : lang === 'zh_TW' ? toTraditional(zh) : zh;

  useEffect(() => {
    supabase.rpc('get_my_assignments').then(({ data }) => {
      setAssignments((data || []) as AssignmentData[]);
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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
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
                <div key={a.id} className={`rounded-xl border-2 p-4 ${
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

                  {/* Mission list */}
                  <div className="space-y-1">
                    {a.mission_ids.map(mid => {
                      const mission = missions.find(m => m.id === mid);
                      if (!mission) return null;
                      const isDone = !!(completedMissions[String(mid)] as any)?.green;
                      return (
                        <button
                          key={mid}
                          onClick={() => { onClose(); onMissionStart(mission); }}
                          disabled={isDone}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-600 line-through opacity-60'
                              : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={12} /> : <BookOpen size={12} />}
                          <span className="truncate">{lt(mission.title, lang)}</span>
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
