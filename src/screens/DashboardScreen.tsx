/**
 * DashboardScreen — 教师进度看板
 * 实时显示全班学生在每个单元的 Green/Amber/Red 完成进度
 */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, Users, CheckCircle, Circle, Trophy } from 'lucide-react';
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

  const unitMap = useMemo(() => getUnitMap(grade), [grade]);
  const units = useMemo(() => [...unitMap.entries()], [unitMap]);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Try RPC first (SECURITY DEFINER, bypasses RLS)
      const { data, error } = await supabase.rpc('get_class_progress', {
        p_grade: grade,
        p_class: className || null,
      });
      if (!error && data) {
        setStudents(data as StudentRow[]);
      } else {
        // Fallback: direct query (works if RLS allows)
        let query = supabase.from('gl_user_progress').select('*').eq('grade', grade);
        if (className) query = query.eq('class_name', className);
        const { data: fallback } = await query.order('display_name');
        setStudents((fallback as StudentRow[]) || []);
      }
    } catch {
      setStudents([]);
    }
    setLoading(false);
    setLastRefresh(new Date());
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
    },
    zh_TW: {
      title: '班級進度看板', grade: '年級', class: '班級', placeholder: '如 7B',
      student: '學生', score: '分數', overall: '總進度', refresh: '刷新',
      green: '手把手', amber: '練習', red: '闖關', noStudents: '暫無數據',
      liveHint: '數據實時更新', lastUpdate: '最後更新',
    },
    en: {
      title: 'Class Progress Dashboard', grade: 'Grade', class: 'Class', placeholder: 'e.g. 7B',
      student: 'Student', score: 'Score', overall: 'Overall', refresh: 'Refresh',
      green: 'Tutorial', amber: 'Practice', red: 'Challenge', noStudents: 'No data yet',
      liveHint: 'Live updates', lastUpdate: 'Last update',
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
        <div className="flex items-center gap-2 text-xs text-amber-600/60">
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
                <td colSpan={3 + units.length} className="text-center py-8 text-[#5c4033]/50 text-sm">
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
