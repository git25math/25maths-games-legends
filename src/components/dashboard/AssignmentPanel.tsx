/**
 * AssignmentPanel — Teacher assignment management (Phase D, v8.3)
 * Create, view, and archive mission assignments for a class.
 * Tracks completion rate from student completed_missions data.
 */
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Plus, Archive, Calendar, CheckCircle2, Clock, ChevronDown, ChevronRight, X, Link2, Check } from 'lucide-react';
import type { Language, MissionSummary } from '../../types';
import type { StudentRow, UnitEntry } from './types';
import { supabase } from '../../supabase';
import { lt } from '../../i18n/resolveText';
import { buildMissionSummaryMap } from '../../utils/missionSummary';

type Assignment = {
  id: string;
  grade: number;
  class_tag: string;
  mission_ids: number[];
  title: string;
  description: string | null;
  deadline: string | null;
  created_by: string;
  created_at: string;
  archived_at: string | null;
  target_user_ids: string[] | null;
};

type Props = {
  lang: Language;
  grade: number;
  filterTag: string;
  students: StudentRow[];
  units: UnitEntry[];
  /** Pre-fill context from KPWeaknessPanel "Assign" button */
  kpAssignContext?: { kpId: string; missionIds: number[]; weakStudentNames: string[]; weakStudentIds: string[] } | null;
  onClearKpAssignContext?: () => void;
};

export function AssignmentPanel({ lang, grade, filterTag, students, units, kpAssignContext, onClearKpAssignContext }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [copiedAssignmentId, setCopiedAssignmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-open create modal when KP assign context is set
  useEffect(() => {
    if (kpAssignContext && kpAssignContext.missionIds.length > 0) {
      setShowCreate(true);
    }
  }, [kpAssignContext]);
  const [sharePrompt, setSharePrompt] = useState<{ title: string; url: string } | null>(null);

  // All missions for current grade, grouped by unit
  const gradeMissions = useMemo(() => {
    const missions: MissionSummary[] = [];
    for (const [, u] of units) {
      missions.push(...u.missions);
    }
    return missions;
  }, [units]);

  const missionMap = useMemo(() => buildMissionSummaryMap(gradeMissions), [gradeMissions]);

  // Fetch assignments
  const fetchAssignments = async () => {
    if (!filterTag) return;
    setLoading(true);
    const { data, error } = await supabase.rpc('get_class_assignments', {
      p_grade: grade,
      p_class_tag: filterTag,
    });
    if (!error && data) {
      setAssignments(data as Assignment[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAssignments(); }, [grade, filterTag]);

  // Compute completion for an assignment
  const getCompletionStats = (assignment: Assignment) => {
    let totalDone = 0;
    let totalExpected = 0;
    const perStudent: { name: string; done: number; total: number }[] = [];

    for (const s of students) {
      let done = 0;
      for (const mid of assignment.mission_ids) {
        if ((s.completed_missions as any)?.[String(mid)]?.green) done++;
      }
      perStudent.push({ name: s.display_name || 'Anonymous', done, total: assignment.mission_ids.length });
      totalDone += done;
      totalExpected += assignment.mission_ids.length;
    }

    return {
      rate: totalExpected > 0 ? Math.round((totalDone / totalExpected) * 100) : 0,
      completedStudents: perStudent.filter(s => s.done === s.total).length,
      totalStudents: students.length,
      perStudent,
    };
  };

  // Archive handler — checks return value (false = not your assignment)
  const archiveAssignment = async (id: string) => {
    const { data, error } = await supabase.rpc('archive_assignment', { p_assignment_id: id });
    if (!error && data !== false) {
      setAssignments(prev => prev.map(a => a.id === id ? { ...a, archived_at: new Date().toISOString() } : a));
    } else {
      setToast(lang === 'en' ? 'Could not archive — you may not be the creator' : '归档失败——可能不是您创建的任务');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const active = assignments.filter(a => !a.archived_at);
  const archived = assignments.filter(a => a.archived_at);

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline).getTime() < Date.now();
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return lang === 'en' ? 'No deadline' : '无截止日期';
    const d = new Date(deadline);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return lang === 'en' ? `⚠ Overdue ${-diffDays}d` : `⚠ 逾期 ${-diffDays} 天`;
    if (diffDays === 0) return lang === 'en' ? 'Due today!' : '今天截止！';
    if (diffDays === 1) return lang === 'en' ? 'Due tomorrow' : '明天截止';
    return lang === 'en' ? `${diffDays} days left` : `剩余 ${diffDays} 天`;
  };

  if (!filterTag) return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList size={16} className="text-indigo-500" />
        <h3 className="text-sm font-black text-slate-700">{lang === 'en' ? 'Assignments' : '任务布置'}</h3>
      </div>
      <p className="text-xs text-slate-400">{lang === 'en' ? 'Select a class above to manage assignments.' : '请先在上方选择一个班级，才能布置作业。'}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
          <ClipboardList size={16} className="text-indigo-500" />
          {lang === 'en' ? 'Assignments' : '任务布置'}
          {active.length > 0 && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-full">
              {active.length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} /> {lang === 'en' ? 'New' : '新建'}
        </button>
      </div>

      {/* Active Assignments */}
      {loading ? (
        <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-2 w-20 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ) : active.length === 0 ? (
        <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-slate-100 text-center">
          <p className="text-sm text-slate-400">
            {lang === 'en' ? 'No active assignments for this class' : '该班级暂无活跃任务'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map(a => {
            const stats = getCompletionStats(a);
            const overdue = isOverdue(a.deadline);
            const expanded = expandedId === a.id;

            return (
              <motion.div
                key={a.id}
                layout
                className="bg-white/80 backdrop-blur rounded-2xl border border-slate-100 overflow-hidden"
              >
                {/* Assignment header */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expanded ? null : a.id); } }}
                  onClick={() => setExpandedId(expanded ? null : a.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {expanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                        <h4 className="text-sm font-black text-slate-800 truncate">{a.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 ml-5">
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${overdue ? 'text-rose-500' : 'text-slate-400'}`}>
                          {overdue ? <Clock size={10} className="text-rose-400" /> : <Calendar size={10} />}
                          {formatDeadline(a.deadline)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {a.mission_ids.length} {lang === 'en' ? 'missions' : '关卡'}
                        </span>
                        {stats.totalStudents - stats.completedStudents > 0 && (
                          <span className="text-[10px] font-bold text-rose-500">
                            {stats.totalStudents - stats.completedStudents} {lang === 'en' ? 'incomplete' : '人未完成'}
                          </span>
                        )}
                        {stats.completedStudents === stats.totalStudents && stats.totalStudents > 0 && (
                          <span className="text-[10px] font-bold text-emerald-500">
                            ✓ {lang === 'en' ? 'All done' : '全部完成'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Completion ring */}
                      <div className="relative w-10 h-10">
                        <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90" role="progressbar" aria-valuenow={stats.rate} aria-valuemin={0} aria-valuemax={100}>
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15" fill="none"
                            stroke={stats.rate >= 80 ? '#10b981' : stats.rate >= 40 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={`${stats.rate * 0.9425} 94.25`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-600">
                          {stats.rate}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {stats.completedStudents}/{stats.totalStudents}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${window.location.origin}${window.location.pathname}?hw=${a.id}`;
                          navigator.clipboard.writeText(url).then(() => {
                            setCopiedAssignmentId(a.id);
                            setTimeout(() => setCopiedAssignmentId(null), 2000);
                          });
                        }}
                        className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
                        title={lang === 'en' ? 'Copy homework link' : '复制作业链接'}
                      >
                        {copiedAssignmentId === a.id ? <Check size={14} className="text-emerald-500" /> : <Link2 size={14} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(lang === 'en' ? `Archive "${a.title}"? Students won't see it anymore.` : `归档「${a.title}」？学生将看不到此作业。`)) {
                            archiveAssignment(a.id);
                          }
                        }}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        title={lang === 'en' ? 'Archive' : '归档'}
                      >
                        <Archive size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded: per-student breakdown */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-slate-100">
                        {a.description && (
                          <p className="text-xs text-slate-500 mt-3 mb-2">{a.description}</p>
                        )}
                        {/* Mission list */}
                        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                          {a.mission_ids.map(mid => {
                            const m = missionMap.get(mid);
                            return (
                              <span key={mid} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">
                                {m ? lt(m.title, lang) : `#${mid}`}
                              </span>
                            );
                          })}
                        </div>
                        {/* Per-student progress */}
                        {(() => {
                          const notStarted = stats.perStudent.filter(ps => ps.done === 0);
                          const inProgress = stats.perStudent.filter(ps => ps.done > 0 && ps.done < ps.total);
                          return (
                            <div className="flex items-center gap-2 mb-2 text-[10px] flex-wrap">
                              {notStarted.length > 0 && <span className="font-bold text-rose-500">{notStarted.length} {lang === 'en' ? 'not started' : '人未开始'}</span>}
                              {inProgress.length > 0 && <><span className="text-slate-300">|</span><span className="font-bold text-amber-500">{inProgress.length} {lang === 'en' ? 'in progress' : '人进行中'}</span></>}
                              {stats.completedStudents > 0 && <><span className="text-slate-300">|</span><span className="font-bold text-emerald-500">{stats.completedStudents} {lang === 'en' ? 'done' : '人已完成'}</span></>}
                            </div>
                          );
                        })()}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {stats.perStudent
                            .sort((a, b) => a.done - b.done)
                            .map((ps, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className={`text-[11px] font-bold w-24 truncate ${ps.done < ps.total ? 'text-rose-600' : 'text-slate-600'}`}>{ps.name}</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      ps.done === ps.total ? 'bg-emerald-500' : ps.done > 0 ? 'bg-amber-400' : 'bg-slate-200'
                                    }`}
                                    style={{ width: `${ps.total > 0 ? (ps.done / ps.total) * 100 : 0}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                                  {ps.done}/{ps.total}
                                </span>
                                {ps.done === ps.total && <CheckCircle2 size={12} className="text-emerald-500" />}
                              </div>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Archived toggle */}
      {archived.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            aria-expanded={showArchived}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] text-slate-400 font-bold hover:text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {showArchived ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {showArchived
              ? (lang === 'en' ? 'Hide archived' : '隐藏归档')
              : (lang === 'en' ? `Show ${archived.length} archived` : `显示 ${archived.length} 个归档任务`)
            }
          </button>
          {showArchived && (
            <div className="max-h-40 overflow-y-auto space-y-2 mt-2 pl-1">
              {archived.map(a => (
                <div key={a.id} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 opacity-60">
                  <div className="flex items-center gap-2">
                    <Archive size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-500 font-bold">{a.title}</span>
                    <span className="text-[10px] text-slate-400">{a.mission_ids.length} {lang === 'en' ? 'missions' : '关卡'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateAssignmentModal
            lang={lang}
            grade={grade}
            filterTag={filterTag}
            units={units}
            initialKpId={kpAssignContext?.kpId}
            initialMissionIds={kpAssignContext?.missionIds}
            weakStudentNames={kpAssignContext?.weakStudentNames}
            targetStudentIds={kpAssignContext?.weakStudentIds}
            onClose={() => { setShowCreate(false); onClearKpAssignContext?.(); }}
            onCreated={(title, count, assignmentId) => {
              setShowCreate(false);
              onClearKpAssignContext?.();
              fetchAssignments();
              const url = `${window.location.origin}${window.location.pathname}?hw=${assignmentId || '1'}`;
              setSharePrompt({ title, url });
            }}
          />
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg"
          >
            <CheckCircle2 size={14} className="inline mr-1.5 -mt-0.5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share prompt after creating assignment */}
      <AnimatePresence>
        {sharePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSharePrompt(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="text-lg font-black text-slate-800 mb-1">
                {lang === 'en' ? 'Assignment Created!' : '作业已创建！'}
              </h3>
              <p className="text-sm text-slate-500 mb-4">"{sharePrompt.title}"</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sharePrompt.url);
                  setCopiedAssignmentId('share-prompt');
                  setTimeout(() => { setCopiedAssignmentId(null); setSharePrompt(null); }, 1500);
                }}
                className="w-full py-3 min-h-[48px] bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-colors text-base"
              >
                {copiedAssignmentId === 'share-prompt' ? (lang === 'en' ? '✓ Copied!' : '✓ 已复制！') : (lang === 'en' ? '📋 Copy Link to Share' : '📋 复制链接发到班级群')}
              </button>
              <button
                onClick={() => setSharePrompt(null)}
                className="w-full mt-2 py-2 text-slate-400 text-sm"
              >
                {lang === 'en' ? 'Later' : '稍后'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Create Assignment Modal ──

function CreateAssignmentModal({
  lang, grade, filterTag, units, onClose, onCreated,
  initialKpId, initialMissionIds, weakStudentNames, targetStudentIds,
}: {
  lang: Language;
  grade: number;
  filterTag: string;
  units: UnitEntry[];
  onClose: () => void;
  onCreated: (title: string, missionCount: number, assignmentId?: string) => void;
  initialKpId?: string;
  initialMissionIds?: number[];
  weakStudentNames?: string[];
  targetStudentIds?: string[];
}) {
  const [title, setTitle] = useState(
    initialKpId ? (lang === 'en' ? `Targeted: ${initialKpId}` : `专项练习：${initialKpId}`) : ''
  );
  const [description, setDescription] = useState(
    weakStudentNames?.length
      ? (lang === 'en'
        ? `Recommended for: ${weakStudentNames.join(', ')}`
        : `推荐给：${weakStudentNames.join('、')}`)
      : ''
  );
  const [deadline, setDeadline] = useState('');
  const [selectedMissions, setSelectedMissions] = useState<Set<number>>(
    new Set(initialMissionIds ?? [])
  );
  const [missionSearch, setMissionSearch] = useState('');
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleMission = (id: number) => {
    setSelectedMissions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectUnit = (unitMissions: MissionSummary[]) => {
    setSelectedMissions(prev => {
      const next = new Set(prev);
      const allSelected = unitMissions.every(m => next.has(m.id));
      for (const m of unitMissions) {
        if (allSelected) next.delete(m.id);
        else next.add(m.id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError(lang === 'en' ? 'Title is required' : '请输入任务标题');
      return;
    }
    if (selectedMissions.size === 0) {
      setError(lang === 'en' ? 'Select at least one mission' : '请至少选择一个关卡');
      return;
    }

    setSubmitting(true);
    setError('');

    const { error: rpcErr } = await supabase.rpc('create_assignment', {
      p_grade: grade,
      p_class_tag: filterTag,
      p_mission_ids: [...selectedMissions],
      p_title: title.trim(),
      p_description: description.trim() || null,
      p_deadline: deadline || null,
      p_target_user_ids: targetStudentIds?.length ? targetStudentIds : null,
    });

    if (rpcErr) {
      setError(lang === 'en' ? 'Failed to create assignment' : '创建任务失败');
      setSubmitting(false);
      return;
    }

    onCreated(title.trim(), selectedMissions.size);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800">
              {lang === 'en' ? 'New Assignment' : '新建任务'}
            </h3>
            <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Title */}
          <label className="block mb-4">
            <span className="text-xs font-bold text-slate-500 mb-1 block">
              {lang === 'en' ? 'Title' : '任务标题'} *
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Week 5 Algebra Practice' : '例：第5周代数练习'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </label>

          {/* Description */}
          <label className="block mb-4">
            <span className="text-xs font-bold text-slate-500 mb-1 block">
              {lang === 'en' ? 'Note to students (optional)' : '给学生的备注（可选）'}
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={lang === 'en' ? 'Any instructions or encouragement...' : '写点鼓励的话吧...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </label>

          {/* Deadline */}
          <label className="block mb-4">
            <span className="text-xs font-bold text-slate-500 mb-1 block">
              {lang === 'en' ? 'Deadline (optional)' : '截止日期（可选）'}
            </span>
            <input
              type="datetime-local"
              value={deadline}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {deadline && new Date(deadline) < new Date() && (
              <p className="text-[10px] text-rose-500 mt-1">{lang === 'en' ? '⚠ This deadline is in the past' : '⚠ 此截止日期已过'}</p>
            )}
          </label>

          {/* Class + Grade info */}
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400">
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">Y{grade}</span>
            <span className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full">{filterTag}</span>
          </div>
          {weakStudentNames && weakStudentNames.length > 0 && (
            <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[10px] font-bold text-amber-800">
                {lang === 'en' ? `Targeted for: ${weakStudentNames.join(', ')}` : `专项针对：${weakStudentNames.join('、')}`}
              </p>
            </div>
          )}

          {/* Mission selector */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">
                {lang === 'en' ? 'Select missions' : '选择关卡'} *
              </span>
              <span className="text-[10px] font-bold text-indigo-500">
                {selectedMissions.size} {lang === 'en' ? 'selected' : '已选'}
              </span>
            </div>
            <input
              type="text"
              value={missionSearch}
              onChange={e => setMissionSearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search by topic name...' : '搜索知识点名称...'}
              className="w-full px-3 py-2 mb-2 text-xs border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none"
            />
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border border-slate-100 p-2">
              {units.filter(([, u]) => !missionSearch || u.title.toLowerCase().includes(missionSearch.toLowerCase()) || u.missions.some(m => (m.title?.zh || '').includes(missionSearch) || (m.title?.en || '').toLowerCase().includes(missionSearch.toLowerCase()) || m.type.toLowerCase().includes(missionSearch.toLowerCase()))).map(([uid, u]) => {
                const allSelected = u.missions.every(m => selectedMissions.has(m.id));
                const someSelected = u.missions.some(m => selectedMissions.has(m.id));
                const expanded = expandedUnit === uid;

                return (
                  <div key={uid}>
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5"
                      onClick={() => setExpandedUnit(expanded ? null : uid)}
                    >
                      {expanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); selectUnit(u.missions); }}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          allSelected ? 'bg-indigo-600 border-indigo-600' : someSelected ? 'border-indigo-300 bg-indigo-100' : 'border-slate-300'
                        }`}
                      >
                        {allSelected && <CheckCircle2 size={10} className="text-white" />}
                        {someSelected && !allSelected && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                      </button>
                      <span className="text-xs font-bold text-slate-700 flex-1 truncate">{u.title}</span>
                      <span className="text-[10px] text-slate-400">{u.missions.length}</span>
                    </div>
                    {expanded && (
                      <div className="ml-8 space-y-0.5 mt-1">
                        {u.missions.map(m => (
                          <label key={m.id} className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50/50 rounded-lg px-2 py-1">
                            <input
                              type="checkbox"
                              checked={selectedMissions.has(m.id)}
                              onChange={() => toggleMission(m.id)}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[11px] text-slate-600 truncate">{lt(m.title, lang)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-rose-500 font-bold mb-3">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {lang === 'en' ? 'Cancel' : '取消'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 min-h-[44px] rounded-xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting
                ? (lang === 'en' ? 'Creating...' : '创建中...')
                : (lang === 'en' ? 'Create' : '创建')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
