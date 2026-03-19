/**
 * DashboardScreen — 教师进度看板
 * 实时显示全班学生在每个单元的 Green/Amber/Red 完成进度
 * 支持批量/单个班级分配
 */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Users, CheckCircle, Circle, Trophy, Edit3, Check, X, UserPlus } from 'lucide-react';
import type { Language, Mission, CompletedMissions } from '../types';
import { supabase } from '../supabase';
import { MISSIONS } from '../data/missions';
import { lt } from '../i18n/resolveText';

type StudentRow = {
  user_id: string;
  display_name: string;
  class_name: string | null;
  total_score: number;
  completed_missions: CompletedMissions;
  updated_at: string;
  grade?: number;
};

type Props = {
  lang: Language;
  onClose: () => void;
};

// Group missions by grade → unitId → ordered missions
function getUnitMap(grade: number): Map<number, { title: string; missions: Mission[] }> {
  const map = new Map<number, { title: string; missions: Mission[] }>();
  const gradeMissions = MISSIONS.filter(m => m.grade === grade).sort((a, b) => {
    if (a.unitId !== b.unitId) return a.unitId - b.unitId;
    return a.order - b.order;
  });
  for (const m of gradeMissions) {
    if (!map.has(m.unitId)) {
      map.set(m.unitId, { title: m.unitTitle ? lt(m.unitTitle, 'zh') : `Unit ${m.unitId}`, missions: [] });
    }
    map.get(m.unitId)!.missions.push(m);
  }
  return map;
}

// Completion dot component
function Dot({ done, color }: { done: boolean; color: string }) {
  if (done) return <CheckCircle size={14} className={color} />;
  return <Circle size={14} className="text-gray-400/40" />;
}

export function DashboardScreen({ lang, onClose }: Props) {
  const [grade, setGrade] = useState(7);
  const [className, setClassName] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [error, setError] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editClassValue, setEditClassValue] = useState('');
  const [showBatchAssign, setShowBatchAssign] = useState(false);
  const [batchClass, setBatchClass] = useState('');

  const unitMap = useMemo(() => getUnitMap(grade), [grade]);
  const units = useMemo(() => [...unitMap.entries()], [unitMap]);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      // Try RPC first (SECURITY DEFINER, bypasses RLS)
      const { data, error: rpcErr } = await supabase.rpc('get_class_progress', {
        p_grade: grade,
        p_class: className || null,
      });
      if (!rpcErr && data) {
        setStudents(data as StudentRow[]);
      } else {
        console.warn('RPC failed, trying fallback:', rpcErr?.message);
        // Fallback: direct query (works if RLS allows)
        let query = supabase.from('gl_user_progress').select('*').eq('grade', grade);
        if (className) query = query.eq('class_name', className);
        const { data: fallback, error: fbErr } = await query.order('display_name');
        if (fbErr) {
          setError(lang === 'en' ? 'Failed to load data' : '加载数据失败');
          console.error('Fallback also failed:', fbErr.message);
        }
        setStudents((fallback as StudentRow[]) || []);
      }
    } catch {
      setError(lang === 'en' ? 'Network error' : '网络错误');
      setStudents([]);
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  // Assign class to a single student
  const assignStudentClass = async (userId: string, newClass: string) => {
    const { error: err } = await supabase.rpc('assign_student_class', {
      p_user_id: userId,
      p_class: newClass || null,
    });
    if (!err) {
      setStudents(prev => prev.map(s =>
        s.user_id === userId ? { ...s, class_name: newClass || null } : s
      ));
    }
    setEditingStudent(null);
  };

  // Batch assign class to all students in current grade
  const batchAssignClass = async () => {
    if (!batchClass.trim()) return;
    const { data } = await supabase.rpc('assign_class', {
      p_grade: grade,
      p_class: batchClass.trim().toUpperCase(),
    });
    setShowBatchAssign(false);
    setBatchClass('');
    if (typeof data === 'number' && data > 0) {
      fetchStudents();
    }
  };

  // Initial fetch + refetch on grade/class change
  useEffect(() => { fetchStudents(); }, [grade, className]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-progress')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'gl_user_progress',
      }, (payload) => {
        const updated = payload.new as StudentRow;
        if (!updated || updated.grade !== grade) return;
        if (className && updated.class_name !== className) return;

        setStudents(prev => {
          const idx = prev.findIndex(s => s.user_id === updated.user_id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updated;
            return next;
          }
          // New student appeared
          return [...prev, updated].sort((a, b) =>
            (a.display_name || '').localeCompare(b.display_name || '')
          );
        });
        setLastRefresh(new Date());
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [grade, className]);

  // Calculate stats
  const totalMissions = useMemo(() => {
    let count = 0;
    for (const [, u] of units) count += u.missions.length;
    return count;
  }, [units]);

  const getStudentUnitProgress = (student: StudentRow, unitMissions: Mission[]) => {
    let green = 0, amber = 0, red = 0;
    for (const m of unitMissions) {
      const c = student.completed_missions?.[String(m.id)];
      if (c?.green) green++;
      if (c?.amber) amber++;
      if (c?.red) red++;
    }
    return { green, amber, red, total: unitMissions.length };
  };

  const getStudentOverall = (student: StudentRow) => {
    let done = 0;
    for (const [, u] of units) {
      for (const m of u.missions) {
        const c = student.completed_missions?.[String(m.id)];
        if (c?.green) done++;
      }
    }
    return done;
  };

  const LABELS = {
    zh: {
      title: '班级进度看板', grade: '年级', class: '班级', placeholder: '如 7B',
      student: '学生', score: '分数', overall: '总进度', refresh: '刷新',
      green: '手把手', amber: '练习', red: '闯关', noStudents: '暂无数据',
      liveHint: '数据实时更新', lastUpdate: '最后更新',
      classCol: '班级', batchAssign: '批量分配班级', assignAll: '将全部 Y{g} 学生分配到:',
      confirm: '确认', cancel: '取消', unassigned: '未分配',
    },
    zh_TW: {
      title: '班級進度看板', grade: '年級', class: '班級', placeholder: '如 7B',
      student: '學生', score: '分數', overall: '總進度', refresh: '刷新',
      green: '手把手', amber: '練習', red: '闖關', noStudents: '暫無數據',
      liveHint: '數據實時更新', lastUpdate: '最後更新',
      classCol: '班級', batchAssign: '批量分配班級', assignAll: '將全部 Y{g} 學生分配到:',
      confirm: '確認', cancel: '取消', unassigned: '未分配',
    },
    en: {
      title: 'Class Progress Dashboard', grade: 'Grade', class: 'Class', placeholder: 'e.g. 7B',
      student: 'Student', score: 'Score', overall: 'Overall', refresh: 'Refresh',
      green: 'Tutorial', amber: 'Practice', red: 'Challenge', noStudents: 'No data yet',
      liveHint: 'Live updates', lastUpdate: 'Last update',
      classCol: 'Class', batchAssign: 'Batch Assign Class', assignAll: 'Assign all Y{g} students to:',
      confirm: 'Confirm', cancel: 'Cancel', unassigned: 'N/A',
    },
  };
  const t = LABELS[lang] || LABELS.zh;

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 bg-white/50 backdrop-blur-sm rounded-2xl px-5 py-3 border border-amber-200/40 shadow-sm">
        <button onClick={onClose} className="flex items-center gap-2 text-amber-800 hover:text-amber-950 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-base font-black">{t.title}</span>
        </button>
        <div className="flex items-center gap-3">
          <select
            value={grade}
            onChange={e => setGrade(Number(e.target.value))}
            className="bg-white/80 border border-amber-200 rounded-lg px-3 py-1.5 text-sm font-bold text-amber-900 shadow-sm"
          >
            <option value={7}>Y7</option>
            <option value={8}>Y8</option>
            <option value={9}>Y9</option>
          </select>
          <input
            type="text"
            value={className}
            onChange={e => setClassName(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            className="bg-white/80 border border-amber-200 rounded-lg px-3 py-1.5 text-sm w-20 text-amber-900 placeholder:text-amber-400 shadow-sm"
          />
          <button
            onClick={fetchStudents}
            className="flex items-center gap-1 bg-white/80 border border-amber-200 rounded-lg px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-3 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Batch assign modal */}
      <AnimatePresence>
        {showBatchAssign && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <UserPlus size={16} className="text-indigo-600" />
              <span className="text-sm font-bold text-indigo-900">
                {t.assignAll.replace('{g}', String(grade))}
              </span>
              <input
                type="text"
                value={batchClass}
                onChange={e => setBatchClass(e.target.value.toUpperCase())}
                placeholder={t.placeholder}
                className="bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-sm w-24 text-indigo-900 font-bold"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && batchAssignClass()}
              />
              <button onClick={batchAssignClass} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">
                {t.confirm}
              </button>
              <button onClick={() => setShowBatchAssign(false)} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                {t.cancel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live indicator + Legend row */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-4 text-xs text-amber-700">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {t.liveHint}
          </span>
          <span className="text-amber-400">|</span>
          <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-500" /> {t.green}</span>
          <span className="flex items-center gap-1"><CheckCircle size={11} className="text-amber-400" /> {t.amber}</span>
          <span className="flex items-center gap-1"><CheckCircle size={11} className="text-rose-500" /> {t.red}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-amber-600/60">
          <button
            onClick={() => setShowBatchAssign(!showBatchAssign)}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
          >
            <UserPlus size={12} />
            {t.batchAssign}
          </button>
          <span className="text-amber-300">|</span>
          <Users size={12} />
          {students.length} {t.student}
          <span className="mx-0.5">·</span>
          {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-amber-200/50 bg-white/60 backdrop-blur-sm shadow-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-amber-50/80 border-b border-amber-200/60">
              <th className="sticky left-0 bg-amber-50/95 backdrop-blur-sm z-20 px-2 py-2 text-center font-bold text-amber-900 whitespace-nowrap w-8">
                #
              </th>
              <th className="sticky left-8 bg-amber-50/95 backdrop-blur-sm z-20 px-3 py-2 text-left font-bold text-amber-900 whitespace-nowrap min-w-[140px]">
                {t.student}
              </th>
              <th className="px-2 py-2 text-center font-bold text-amber-900 whitespace-nowrap min-w-[56px]">
                {t.classCol}
              </th>
              <th className="px-2 py-2 text-center font-bold text-amber-900 whitespace-nowrap min-w-[60px]">
                <div className="flex items-center justify-center gap-1"><Trophy size={12} /> {t.score}</div>
              </th>
              <th className="px-2 py-2 text-center font-bold text-amber-900 whitespace-nowrap min-w-[50px]">
                {t.overall}
              </th>
              {units.map(([uid, u]) => (
                <th
                  key={uid}
                  colSpan={1}
                  className="px-2 py-2 text-center font-bold text-amber-900 whitespace-nowrap border-l border-amber-200/40"
                  title={u.title}
                >
                  <div className="text-[10px] leading-tight max-w-[80px] mx-auto truncate">{u.title.replace(/Unit \d+:\s*/, '').split('·')[0]}</div>
                  <div className="text-[8px] text-amber-600/50 mt-0.5">{u.missions.length} 关</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={4 + units.length} className="text-center py-8 text-[#5c4033]/50 text-sm">
                  {loading ? '加载中...' : t.noStudents}
                </td>
              </tr>
            )}
            {[...students].sort((a, b) => (b.total_score || 0) - (a.total_score || 0)).map((s, i) => {
              const overall = getStudentOverall(s);
              const pct = totalMissions > 0 ? Math.round((overall / totalMissions) * 100) : 0;
              const rank = i + 1;
              return (
                <tr
                  key={s.user_id}
                  className={`border-b border-amber-100 hover:bg-amber-50/60 transition-colors ${i % 2 === 0 ? 'bg-white/60' : 'bg-amber-50/30'}`}
                >
                  {/* Rank */}
                  <td className="sticky left-0 bg-inherit z-10 px-2 py-2 text-center whitespace-nowrap">
                    {rank === 1 ? <span className="text-base">🥇</span> :
                     rank === 2 ? <span className="text-base">🥈</span> :
                     rank === 3 ? <span className="text-base">🥉</span> :
                     <span className="text-xs font-bold text-amber-700/50">{rank}</span>}
                  </td>
                  {/* Student name */}
                  <td className="sticky left-8 bg-inherit z-10 px-3 py-2 font-bold text-amber-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[11px] font-black text-white shadow-sm">
                        {(s.display_name || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-xs">{s.display_name || 'Anonymous'}</span>
                    </div>
                  </td>
                  {/* Class */}
                  <td className="px-2 py-2 text-center">
                    {editingStudent === s.user_id ? (
                      <div className="flex items-center gap-1 justify-center">
                        <input
                          type="text"
                          value={editClassValue}
                          onChange={e => setEditClassValue(e.target.value.toUpperCase())}
                          className="w-14 px-1.5 py-0.5 text-[10px] bg-white border border-indigo-300 rounded font-bold text-center"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') assignStudentClass(s.user_id, editClassValue);
                            if (e.key === 'Escape') setEditingStudent(null);
                          }}
                        />
                        <button onClick={() => assignStudentClass(s.user_id, editClassValue)} className="text-emerald-600 hover:text-emerald-800"><Check size={12} /></button>
                        <button onClick={() => setEditingStudent(null)} className="text-rose-400 hover:text-rose-600"><X size={12} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingStudent(s.user_id); setEditClassValue(s.class_name || ''); }}
                        className="group flex items-center gap-0.5 justify-center text-[10px] font-bold text-amber-600 hover:text-indigo-600 transition-colors"
                      >
                        {s.class_name || <span className="text-amber-400/60 italic">{t.unassigned}</span>}
                        <Edit3 size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </td>
                  {/* Score */}
                  <td className="px-2 py-2 text-center">
                    <span className="text-sm font-black text-amber-700">{s.total_score || 0}</span>
                  </td>
                  {/* Overall progress */}
                  <td className="px-2 py-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-full max-w-[44px] h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-amber-700/70">{pct}%</span>
                    </div>
                  </td>
                  {/* Per-unit progress */}
                  {units.map(([uid, u]) => {
                    const p = getStudentUnitProgress(s, u.missions);
                    return (
                      <td key={uid} className="px-2 py-2 border-l border-amber-100/60">
                        <div className="flex items-center justify-center gap-0.5">
                          <Dot done={p.green === p.total} color="text-emerald-500" />
                          <Dot done={p.amber === p.total} color="text-amber-400" />
                          <Dot done={p.red === p.total} color="text-rose-500" />
                        </div>
                        <div className="text-[8px] text-center text-amber-600/40 mt-0.5">
                          {p.green}/{p.total}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
