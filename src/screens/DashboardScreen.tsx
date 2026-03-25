/**
 * DashboardScreen — 教师进度看板 (v8.0)
 * 实时显示全班学生在每个单元的 Green/Amber/Red 完成进度
 * 支持多标签（如 7B + EA）：批量/单个添加、删除标签
 * v8.0: 预警面板 + 学生详情卡（7 维雷达图）
 */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Users, CheckCircle, Circle, Trophy, Plus, X, UserPlus, Tag } from 'lucide-react';
import type { Language, Mission } from '../types';
import { supabase } from '../supabase';
import { SkeletonRow } from '../components/SkeletonRow';
import { INPUT_FOCUS_CLASS } from '../utils/animationPresets';
import { MISSIONS } from '../data/missions';
import { lt } from '../i18n/resolveText';
import { AlertPanel, computeAlerts } from '../components/dashboard/AlertPanel';
import { StudentDetailCard } from '../components/dashboard/StudentDetailCard';
import { ClassOverview } from '../components/dashboard/ClassOverview';
import { KPHeatmap } from '../components/dashboard/KPHeatmap';
import type { StudentRow, UnitEntry } from '../components/dashboard/types';

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

// Predefined class groups
const CLASS_GROUPS: Record<string, string[]> = {
  homeroom: ['7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B', '9C', '10A', '10B', '10C', '11A', '11B', '11C'],
  programme: ['NZH MATHS EA'],
};
const ALL_CLASSES = [...CLASS_GROUPS.homeroom, ...CLASS_GROUPS.programme];

// Tag color mapping
function getTagColor(tag: string): string {
  if (tag.includes('EA')) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (tag.startsWith('7')) return 'bg-sky-50 text-sky-700 border-sky-200';
  if (tag.startsWith('8')) return 'bg-teal-50 text-teal-700 border-teal-200';
  if (tag.startsWith('9')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (tag.startsWith('10')) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (tag.startsWith('11')) return 'bg-violet-50 text-violet-700 border-violet-200';
  return 'bg-indigo-50 text-indigo-700 border-indigo-200';
}

function TagBadge({ tag, onRemove }: { key?: string | number; tag: string; onRemove?: () => void }) {
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${getTagColor(tag)}`}>
      {tag}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-rose-500 transition-colors ml-0.5">
          <X size={8} />
        </button>
      )}
    </span>
  );
}

export function DashboardScreen({ lang, onClose }: Props) {
  const [grade, setGrade] = useState(7);
  const [filterTag, setFilterTag] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [error, setError] = useState('');
  const [addingTagFor, setAddingTagFor] = useState<string | null>(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [showBatchAssign, setShowBatchAssign] = useState(false);
  const [batchTag, setBatchTag] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  const unitMap = useMemo(() => getUnitMap(grade), [grade]);
  const units: UnitEntry[] = useMemo(() => [...unitMap.entries()], [unitMap]);

  // Collect all unique tags for quick-filter chips
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const s of students) {
      for (const t of (s.class_tags || [])) tags.add(t);
    }
    return [...tags].sort();
  }, [students]);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: rpcErr } = await supabase.rpc('get_class_progress', {
        p_grade: grade,
        p_class: filterTag || null,
      });
      if (!rpcErr && data) {
        setStudents((data as StudentRow[]).map(s => ({
          ...s,
          class_tags: s.class_tags || [],
        })));
      } else {
        let query = supabase.from('gl_user_progress').select('*').eq('grade', grade);
        if (filterTag) query = query.contains('class_tags', [filterTag]);
        const { data: fallback, error: fbErr } = await query.order('display_name');
        if (fbErr) {
          setError(lang === 'en' ? 'Failed to load data' : '加载数据失败');
        }
        setStudents(((fallback as StudentRow[]) || []).map(s => ({
          ...s,
          class_tags: s.class_tags || [],
        })));
      }
    } catch {
      setError(lang === 'en' ? 'Network error' : '网络错误');
      setStudents([]);
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  const addStudentTag = async (userId: string, tag: string) => {
    if (!tag.trim()) return;
    const cleanTag = tag.trim().toUpperCase();
    const { error: err } = await supabase.rpc('assign_student_class', { p_user_id: userId, p_class: cleanTag });
    if (!err) {
      setStudents(prev => prev.map(s =>
        s.user_id === userId
          ? { ...s, class_tags: s.class_tags.includes(cleanTag) ? s.class_tags : [...s.class_tags, cleanTag] }
          : s
      ));
    }
    setAddingTagFor(null);
    setNewTagValue('');
  };

  const removeStudentTag = async (userId: string, tag: string) => {
    const { error: err } = await supabase.rpc('remove_student_tag', { p_user_id: userId, p_tag: tag });
    if (!err) {
      setStudents(prev => prev.map(s =>
        s.user_id === userId ? { ...s, class_tags: s.class_tags.filter(t => t !== tag) } : s
      ));
    }
  };

  const batchAddTag = async () => {
    if (!batchTag.trim()) return;
    const cleanTag = batchTag.trim().toUpperCase();
    const { data } = await supabase.rpc('assign_class', { p_grade: grade, p_class: cleanTag });
    setShowBatchAssign(false);
    setBatchTag('');
    if (typeof data === 'number' && data > 0) fetchStudents();
  };

  useEffect(() => { fetchStudents(); }, [grade, filterTag]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-progress')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gl_user_progress' }, (payload) => {
        const updated = payload.new as StudentRow;
        if (!updated || updated.grade !== grade) return;
        if (filterTag && !(updated.class_tags || []).includes(filterTag)) return;
        setStudents(prev => {
          const idx = prev.findIndex(s => s.user_id === updated.user_id);
          const row = { ...updated, class_tags: updated.class_tags || [] };
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = row;
            return next;
          }
          return [...prev, row].sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));
        });
        setLastRefresh(new Date());
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [grade, filterTag]);

  // Stats
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
        if (student.completed_missions?.[String(m.id)]?.green) done++;
      }
    }
    return done;
  };

  // KP mastery counts
  const [kpMasteryMap, setKpMasteryMap] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    supabase.from('play_kp_progress').select('user_id, mastered_at').not('mastered_at', 'is', null)
      .then(({ data }) => {
        if (!data) return;
        const map = new Map<string, number>();
        for (const r of data as { user_id: string; mastered_at: string }[]) {
          map.set(r.user_id, (map.get(r.user_id) ?? 0) + 1);
        }
        setKpMasteryMap(map);
      }, () => {});
  }, [students]);

  // Alerts
  const alerts = useMemo(() => computeAlerts(students, units, totalMissions), [students, units, totalMissions]);

  const LABELS = {
    zh: {
      title: '班级进度看板', student: '学生', score: '分数', overall: '总进度',
      green: '手把手', amber: '练习', red: '闯关', noStudents: '暂无数据',
      liveHint: '实时更新', tags: '标签',
      batchAssign: '批量添加标签', assignAll: '为全部 Y{g} 学生添加:',
      confirm: '确认', cancel: '取消', all: '全部',
    },
    zh_TW: {
      title: '班級進度看板', student: '學生', score: '分數', overall: '總進度',
      green: '手把手', amber: '練習', red: '闖關', noStudents: '暫無數據',
      liveHint: '實時更新', tags: '標籤',
      batchAssign: '批量添加標籤', assignAll: '為全部 Y{g} 學生添加:',
      confirm: '確認', cancel: '取消', all: '全部',
    },
    en: {
      title: 'Class Progress Dashboard', student: 'Student', score: 'Score', overall: 'Overall',
      green: 'Tutorial', amber: 'Practice', red: 'Challenge', noStudents: 'No data yet',
      liveHint: 'Live', tags: 'Tags',
      batchAssign: 'Batch Add Tag', assignAll: 'Add tag to all Y{g} students:',
      confirm: 'OK', cancel: 'Cancel', all: 'All',
    },
  };
  const t = LABELS[lang] || LABELS.zh;

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-md">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-800 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-base font-black">{t.title}</span>
        </button>
        <div className="flex items-center gap-3">
          <select
            value={grade}
            onChange={e => setGrade(Number(e.target.value))}
            className={`bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 shadow-sm transition-shadow ${INPUT_FOCUS_CLASS}`}
          >
            {[7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Y{g}</option>)}
          </select>
          <button
            onClick={fetchStudents}
            className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">{error}</div>
      )}

      {/* ═══ Alert Panel (v8.0) ═══ */}
      <AlertPanel lang={lang} alerts={alerts} onStudentClick={(uid) => {
        const s = students.find(st => st.user_id === uid);
        if (s) setSelectedStudent(s);
      }} />

      {/* ═══ Class Overview Cards (v8.1) ═══ */}
      <ClassOverview lang={lang} grade={grade} filterTag={filterTag} students={students} units={units} totalMissions={totalMissions} />

      {/* Tag filter chips */}
      <div className="flex items-center gap-2 mb-4 px-1 flex-wrap">
        <Tag size={14} className="text-slate-500" />
        <button
          onClick={() => setFilterTag('')}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
            !filterTag ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.all}
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              filterTag === tag ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {tag}
          </button>
        ))}
        <button
          onClick={() => setShowBatchAssign(!showBatchAssign)}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border border-dashed border-indigo-300 text-indigo-500 hover:bg-indigo-50 transition-all"
        >
          <UserPlus size={11} />
          {t.batchAssign}
        </button>
      </div>

      {/* Batch assign panel */}
      <AnimatePresence>
        {showBatchAssign && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 flex items-center gap-3 flex-wrap">
              <UserPlus size={16} className="text-indigo-600" />
              <span className="text-sm font-bold text-indigo-900">{t.assignAll.replace('{g}', String(grade))}</span>
              <select
                value={batchTag}
                onChange={e => setBatchTag(e.target.value)}
                className={`bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-sm text-indigo-900 font-bold ${INPUT_FOCUS_CLASS}`}
                autoFocus
              >
                <option value="">选择...</option>
                {ALL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={batchAddTag} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">{t.confirm}</button>
              <button onClick={() => setShowBatchAssign(false)} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">{t.cancel}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ KP Heatmap (v8.1) ═══ */}
      <KPHeatmap lang={lang} grade={grade} filterTag={filterTag} students={students} onStudentClick={(uid) => {
        const s = students.find(st => st.user_id === uid);
        if (s) setSelectedStudent(s);
      }} />

      {/* Live indicator + stats row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {t.liveHint}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-500" /> {t.green}</span>
          <span className="flex items-center gap-1"><CheckCircle size={11} className="text-amber-500" /> {t.amber}</span>
          <span className="flex items-center gap-1"><CheckCircle size={11} className="text-rose-500" /> {t.red}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Users size={12} />
          {students.length} {t.student}
          <span className="mx-0.5">·</span>
          {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 bg-slate-50 z-20 px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap w-8">#</th>
              <th className="sticky left-8 bg-slate-50 z-20 px-3 py-2.5 text-left font-bold text-slate-700 whitespace-nowrap min-w-[140px]">{t.student}</th>
              <th className="px-2 py-2.5 text-left font-bold text-slate-700 whitespace-nowrap min-w-[100px]">{t.tags}</th>
              <th className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap min-w-[60px]">
                <div className="flex items-center justify-center gap-1"><Trophy size={12} className="text-amber-500" /> {t.score}</div>
              </th>
              <th className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap min-w-[50px]">{t.overall}</th>
              <th className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap min-w-[40px]">KP</th>
              {units.map(([uid, u]) => (
                <th key={uid} className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap border-l border-slate-100" title={u.title}>
                  <div className="text-[10px] leading-tight max-w-[80px] mx-auto truncate">{u.title.replace(/Unit \d+:\s*/, '').split('·')[0]}</div>
                  <div className="text-[8px] text-slate-400 mt-0.5">{u.missions.length} 关</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={6 + units.length} className="text-center py-8 text-slate-400 text-sm">
                  {loading ? (
                    <div className="flex flex-col gap-2 p-4">
                      {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={5 + units.length} />)}
                    </div>
                  ) : t.noStudents}
                </td>
              </tr>
            )}
            {[...students].sort((a, b) => (b.total_score || 0) - (a.total_score || 0)).map((s, i) => {
              const overall = getStudentOverall(s);
              const pct = totalMissions > 0 ? Math.round((overall / totalMissions) * 100) : 0;
              const rank = i + 1;
              return (
                <motion.tr
                  key={s.user_id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className={`border-b border-slate-100 hover:bg-indigo-50/50 transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  onClick={() => setSelectedStudent(s)}
                >
                  <td className="sticky left-0 bg-inherit z-10 px-2 py-2 text-center whitespace-nowrap">
                    {rank === 1 ? <span className="text-base">🥇</span> :
                     rank === 2 ? <span className="text-base">🥈</span> :
                     rank === 3 ? <span className="text-base">🥉</span> :
                     <span className="text-xs font-bold text-slate-400">{rank}</span>}
                  </td>
                  <td className="sticky left-8 bg-inherit z-10 px-3 py-2 font-bold text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[11px] font-black text-white shadow-sm">
                        {(s.display_name || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-xs">{s.display_name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 flex-wrap">
                      {(s.class_tags || []).map(tag => (
                        <TagBadge key={tag} tag={tag} onRemove={() => removeStudentTag(s.user_id, tag)} />
                      ))}
                      {addingTagFor === s.user_id ? (
                        <span className="inline-flex items-center gap-0.5">
                          <select
                            value={newTagValue}
                            onChange={e => { if (e.target.value) addStudentTag(s.user_id, e.target.value); }}
                            className={`text-[9px] bg-white border border-indigo-300 rounded px-1 py-0.5 font-bold text-indigo-900 ${INPUT_FOCUS_CLASS}`}
                            autoFocus
                          >
                            <option value="">选择班级...</option>
                            {ALL_CLASSES.filter(c => !(s.class_tags || []).includes(c)).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <button onClick={() => { setAddingTagFor(null); setNewTagValue(''); }} className="text-rose-400"><X size={10} /></button>
                        </span>
                      ) : (
                        <button
                          onClick={() => { setAddingTagFor(s.user_id); setNewTagValue(''); }}
                          className="w-4 h-4 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-colors"
                        >
                          <Plus size={8} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-sm font-black text-indigo-600">{s.total_score || 0}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-full max-w-[44px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className={`text-xs font-black ${(kpMasteryMap.get(s.user_id) ?? 0) > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {kpMasteryMap.get(s.user_id) ?? 0}
                    </span>
                  </td>
                  {units.map(([uid, u]) => {
                    const p = getStudentUnitProgress(s, u.missions);
                    return (
                      <td key={uid} className="px-2 py-2 border-l border-slate-100">
                        <div className="flex items-center justify-center gap-0.5">
                          <Dot done={p.green === p.total} color="text-emerald-500" />
                          <Dot done={p.amber === p.total} color="text-amber-400" />
                          <Dot done={p.red === p.total} color="text-rose-500" />
                        </div>
                        <div className="text-[8px] text-center text-slate-400 mt-0.5">{p.green}/{p.total}</div>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ═══ Student Detail Card (v8.0) ═══ */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailCard
            lang={lang}
            student={selectedStudent}
            units={units}
            totalMissions={totalMissions}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
