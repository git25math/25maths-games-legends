/**
 * DashboardScreen — 教师进度看板 (v8.0)
 * 实时显示全班学生在每个单元的 Green/Amber/Red 完成进度
 * 支持多标签（如 7B + EA）：批量/单个添加、删除标签
 * v8.0: 预警面板 + 学生详情卡（7 维雷达图）
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Users, CheckCircle, Circle, Trophy, Plus, X, UserPlus, Tag, Download, ArrowUpDown, Filter } from 'lucide-react';
import type { Language, MissionSummary } from '../types';
import { supabase } from '../supabase';
import { getMissionIdsForKP } from '../utils/kpMissions';
import { SkeletonRow } from '../components/SkeletonRow';
import { INPUT_FOCUS_CLASS } from '../utils/animationPresets';
import { useMissionSummaries } from '../hooks/useMissionSummaries';
import { lt } from '../i18n/resolveText';
import { AlertPanel, computeAlerts } from '../components/dashboard/AlertPanel';
import { StudentDetailCard } from '../components/dashboard/StudentDetailCard';
import { ClassOverview } from '../components/dashboard/ClassOverview';
import { ClassManager } from '../components/dashboard/ClassManager';
import { DailySummary } from '../components/dashboard/DailySummary';
import { ClassWeeklyReport } from '../components/dashboard/ClassWeeklyReport';
import { SmartSuggestions } from '../components/dashboard/SmartSuggestions';
import { ParentReport } from '../components/dashboard/ParentReport';
import { KPHeatmap } from '../components/dashboard/KPHeatmap';
import { WeeklyTrend } from '../components/dashboard/WeeklyTrend';
import { AssignmentPanel } from '../components/dashboard/AssignmentPanel';
import { ExamHubBridge } from '../components/dashboard/ExamHubBridge';
import { KPWeaknessPanel } from '../components/dashboard/KPWeaknessPanel';
import type { StudentRow, UnitEntry } from '../components/dashboard/types';

type Props = {
  lang: Language;
  onClose: () => void;
  onStartLive?: (classTag: string, grade: number) => void;
};

// Group missions by unitId → ordered missions
function getUnitMap(missions: MissionSummary[]): Map<number, { title: string; missions: MissionSummary[] }> {
  const map = new Map<number, { title: string; missions: MissionSummary[] }>();
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.unitId !== b.unitId) return a.unitId - b.unitId;
    return a.order - b.order;
  });
  for (const m of sortedMissions) {
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
  programme: ['NZH-MathEA', 'StudentLed-MathEA', 'MathCompetition'],
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

export function DashboardScreen({ lang, onClose, onStartLive }: Props) {
  const [grade, setGrade] = useState(7);
  const [filterTag, setFilterTag] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [error, setError] = useState('');

  // Teacher class scoping: null = admin (see all), string[] = teacher (filtered)
  const [teacherClasses, setTeacherClasses] = useState<string[] | null>(null);
  // Teaching groups this teacher owns (for programme tag visibility)
  const [teacherGroups, setTeacherGroups] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Find this teacher's ID in teachers table
      const { data: teacher } = await supabase
        .from('teachers').select('id').eq('user_id', user.id).maybeSingle();
      if (!teacher) return;
      // Find classes via RPC (handles super admin + teacher correctly)
      const { data: allClasses } = await supabase.rpc('get_my_classes');
      if (allClasses && allClasses.length > 0) {
        // Filter to classes assigned to this teacher, or show all for admin
        const myClasses = allClasses.filter((c: { teacher_id: string }) => c.teacher_id === teacher.id);
        if (myClasses.length > 0) {
          setTeacherClasses(myClasses.map((c: { name: string }) => c.name));
        } else {
          // Admin or super admin → see all classes
          setTeacherClasses(null);
        }
      } else {
        setTeacherClasses(null);
      }
      // Find teaching groups this teacher owns or supervises
      const { data: groups } = await supabase
        .from('teaching_groups').select('slug, name')
        .or(`owner_user_id.eq.${user.id},supervisor_user_id.eq.${user.id}`);
      if (groups && groups.length > 0) {
        // Extract the tag format from slug: harrowhk-nzh-mathea → NZH-MathEA
        // Use the tag that students actually have in class_tags
        const groupTags = groups.map(g => {
          // Match against CLASS_GROUPS.programme
          for (const p of CLASS_GROUPS.programme) {
            if (g.slug.toLowerCase().includes(p.toLowerCase().replace(/-/g, ''))) return p;
            if (g.name.includes(p)) return p;
          }
          return g.name.replace('HarrowHK-', '');
        });
        setTeacherGroups(groupTags);
      }
    })();
  }, []);
  const [addingTagFor, setAddingTagFor] = useState<string | null>(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [showBatchAssign, setShowBatchAssign] = useState(false);
  const [batchTag, setBatchTag] = useState('');
  const [kpAssignContext, setKpAssignContext] = useState<{ kpId: string; missionIds: number[]; weakStudentNames: string[]; weakStudentIds: string[] } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [parentReportStudent, setParentReportStudent] = useState<StudentRow | null>(null);
  const [alertOnly, setAlertOnly] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { missions: gradeMissions, loading: missionsLoading } = useMissionSummaries(grade);

  // Assignments (shared: AssignmentPanel renders, StudentDetailCard reads)
  type AssignmentRecord = { id: string; mission_ids: number[]; title: string; deadline: string | null; archived_at: string | null };
  const [dashAssignments, setDashAssignments] = useState<AssignmentRecord[]>([]);
  useEffect(() => {
    if (!filterTag) { setDashAssignments([]); return; }
    supabase.rpc('get_class_assignments', { p_grade: grade, p_class_tag: filterTag })
      .then(({ data, error: err }) => {
        if (!err && data) setDashAssignments(data as AssignmentRecord[]);
        else setDashAssignments([]);
      }, () => setDashAssignments([]));
  }, [grade, filterTag]);

  // Persist sort preference in localStorage
  const [sortKey, setSortKey] = useState<'score' | 'progress' | 'kp' | 'name'>(() => {
    try { return (localStorage.getItem('gl_dashboard_sortKey') as any) || 'score'; } catch { return 'score'; }
  });
  const [sortAsc, setSortAsc] = useState(() => {
    try { return localStorage.getItem('gl_dashboard_sortAsc') === 'true'; } catch { return false; }
  });

  const unitMap = useMemo(() => getUnitMap(gradeMissions), [gradeMissions]);
  const units: UnitEntry[] = useMemo(() => [...unitMap.entries()], [unitMap]);
  const isDashboardLoading = loading || missionsLoading;

  // Collect tags filtered by current grade + teacher scope
  const allTags = useMemo(() => {
    const prefix = String(grade);
    const tags = new Set<string>();
    // Add grade-matched presets
    for (const c of CLASS_GROUPS.homeroom) {
      if (c.startsWith(prefix)) tags.add(c);
    }
    // Include teaching group tags this teacher owns (admin sees all programme tags)
    const visibleGroups = teacherClasses === null ? CLASS_GROUPS.programme : teacherGroups;
    for (const c of visibleGroups) tags.add(c);
    // Add any custom tags from students that match this grade or visible groups
    for (const s of students) {
      for (const t of (s.class_tags || [])) {
        if (t.startsWith(prefix) || visibleGroups.includes(t)) tags.add(t);
      }
    }
    // Teacher scoping: if teacher has assigned classes, only show those + their groups
    if (teacherClasses) {
      const allowed = new Set([...teacherClasses, ...visibleGroups]);
      return [...tags].filter(t => allowed.has(t)).sort();
    }
    return [...tags].sort();
  }, [students, grade]);

  // Guard: suppress realtime updates while a full fetch is in-flight
  const fetchingRef = useRef(false);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    fetchingRef.current = true;
    try {
      // Strategy: find students by class_tags prefix (authoritative for assigned students)
      // plus grade fallback (for unassigned students). This ensures a 7A student
      // studying Y8 content still appears under Y7 in the dashboard.
      const prefix = String(grade);
      // Teacher scoping: only show classes the teacher owns
      const allGradeClasses = CLASS_GROUPS.homeroom.filter(c => c.startsWith(prefix));
      const gradeClasses = teacherClasses
        ? allGradeClasses.filter(c => teacherClasses.includes(c))
        : allGradeClasses;

      if (filterTag) {
        // Specific class selected — query by class tag via RPC
        const { data, error: err } = await supabase
          .rpc('get_students_by_class', { p_class_tag: filterTag });
        if (err) {
          setError(lang === 'en' ? 'Failed to load data' : '加载数据失败');
          setStudents([]);
        } else {
          setStudents((data as StudentRow[] || []).map(s => ({ ...s, class_tags: s.class_tags || [] })));
        }
      } else {
        // No specific class — get ALL students in any grade-level class OR with matching grade
        const [tagsRes, gradeRes] = await Promise.all([
          supabase.rpc('get_students_by_tags', { p_tags: gradeClasses }),
          supabase.rpc('get_students_by_grade', { p_grade: grade }),
        ]);

        // Merge and deduplicate by user_id
        const seen = new Set<string>();
        const merged: StudentRow[] = [];
        for (const row of [...(tagsRes.data || []), ...(gradeRes.data || [])] as StudentRow[]) {
          if (!seen.has(row.user_id)) {
            seen.add(row.user_id);
            merged.push({ ...row, class_tags: row.class_tags || [] });
          }
        }
        merged.sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));
        setStudents(merged);
      }
    } catch {
      setError(lang === 'en' ? 'Network error' : '网络错误');
      setStudents([]);
    }
    fetchingRef.current = false;
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
    // Optimistic update with rollback + error feedback on failure
    setStudents(prev => prev.map(s =>
      s.user_id === userId ? { ...s, class_tags: s.class_tags.filter(t => t !== tag) } : s
    ));
    const { error: err } = await supabase.rpc('remove_student_tag', { p_user_id: userId, p_tag: tag });
    if (err) {
      setError(lang === 'en' ? 'Failed to remove tag — restored' : '标签删除失败，已恢复');
      setStudents(prev => prev.map(s =>
        s.user_id === userId && !s.class_tags.includes(tag)
          ? { ...s, class_tags: [...s.class_tags, tag] }
          : s
      ));
      setTimeout(() => setError(''), 3000);
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
        if (fetchingRef.current) return; // skip while full fetch is in-flight
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

  const getStudentUnitProgress = (student: StudentRow, unitMissions: MissionSummary[]) => {
    let green = 0, amber = 0, red = 0;
    const cm = student.completed_missions;
    if (!cm || typeof cm !== 'object') return { green: 0, amber: 0, red: 0, total: unitMissions.length };
    for (const m of unitMissions) {
      const c = (cm as any)[String(m.id)];
      if (c && typeof c === 'object') {
        if (c.green === true) green++;
        if (c.amber === true) amber++;
        if (c.red === true) red++;
      }
    }
    return { green, amber, red, total: unitMissions.length };
  };

  // Pre-compute overall progress per student (used by sort, CSV, progress bars)
  const studentOverallMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) {
      let done = 0;
      for (const [, u] of units) {
        for (const m of u.missions) {
          if (s.completed_missions?.[String(m.id)]?.green) done++;
        }
      }
      map.set(s.user_id, done);
    }
    return map;
  }, [students, units]);

  const getStudentOverall = (student: StudentRow) => studentOverallMap.get(student.user_id) ?? 0;

  // KP mastery counts via RPC (bypasses RLS for teacher access)
  // Only depends on grade/filterTag — NOT students (avoids refetch on every realtime update)
  const [kpMasteryMap, setKpMasteryMap] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    setKpMasteryMap(new Map()); // clear stale data on filter change
    supabase.rpc('get_class_kp_progress', { p_grade: grade, p_class: filterTag || null })
      .then(({ data, error }) => {
        if (error || !data) return;
        const map = new Map<string, number>();
        for (const r of data as { user_id: string; mastered_at: string | null }[]) {
          if (r.mastered_at) map.set(r.user_id, (map.get(r.user_id) ?? 0) + 1);
        }
        setKpMasteryMap(map);
      }, () => {});
  }, [grade, filterTag]);

  // CSV export — enriched with grade, unit breakdown, last active
  // Sanitize CSV field: escape quotes + prevent formula injection (=, +, -, @, \t, \r)
  const csvSafe = (v: string) => {
    let s = String(v).replace(/"/g, '""');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // prefix to neutralize formula
    return `"${s}"`;
  };

  // CSV export — uses sortedStudents (respects current filter + sort) + formula injection protection
  const exportCSV = () => {
    const unitNames = units.map(([, u]) => u.title.replace(/Unit \d+:\s*/, '').split('·')[0].trim());
    const header = ['Name', 'Grade', 'Class Tags', 'Score', 'Progress %', 'KP Mastered', 'Last Active', ...unitNames];
    const rows = sortedStudents.map(s => {
        const overall = getStudentOverall(s);
        const pct = totalMissions > 0 ? Math.round((overall / totalMissions) * 100) : 0;
        const login = (s.completed_missions as any)?._login as { lastDate?: string } | undefined;
        const lastActive = login?.lastDate ? new Date(login.lastDate).toLocaleDateString() : '-';
        const unitCols = units.map(([, u]) => {
          const p = getStudentUnitProgress(s, u.missions);
          return `${p.green}/${p.total}`;
        });
        return [
          s.display_name || 'Anonymous',
          `Y${grade}`,
          (s.class_tags || []).join('; '),
          String(s.total_score || 0),
          `${pct}%`,
          String(kpMasteryMap.get(s.user_id) ?? 0),
          lastActive,
          ...unitCols,
        ];
      });
    const meta = `# Y${grade}${filterTag ? ' ' + filterTag : ''} Dashboard Export — ${new Date().toLocaleDateString()} — ${sortedStudents.length} students`;
    const csv = [meta, header.map(csvSafe).join(','), ...rows.map(r => r.map(csvSafe).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Y${grade}${filterTag ? '-' + filterTag : ''}-progress-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sort handler — persists to localStorage
  const handleSort = (key: typeof sortKey) => {
    const nextAsc = sortKey === key ? !sortAsc : false;
    const nextKey = key;
    setSortKey(nextKey);
    setSortAsc(nextAsc);
    try { localStorage.setItem('gl_dashboard_sortKey', nextKey); localStorage.setItem('gl_dashboard_sortAsc', String(nextAsc)); } catch {}
  };

  // Alerts
  const alerts = useMemo(() => computeAlerts(students, units, totalMissions), [students, units, totalMissions]);

  // Class average radar dimensions (simplified: progress, kpMastery, winRate placeholders)
  const classAvgDims = useMemo(() => {
    if (students.length === 0 || totalMissions === 0) return undefined;
    const n = students.length;
    // 1. Progress
    const avgProgress = students.reduce((s, st) => s + (getStudentOverall(st) / totalMissions), 0) / n;
    // 2. KP mastery (from kpMasteryMap, cap at 10)
    let kpSum = 0;
    for (const s of students) kpSum += Math.min((kpMasteryMap.get(s.user_id) ?? 0) / 10, 1);
    const avgKP = kpSum / n;
    // 3-7: Use overall score as proxy (normalized)
    const maxScore = Math.max(...students.map(s => s.total_score || 0), 1);
    const avgScoreNorm = students.reduce((s, st) => s + ((st.total_score || 0) / maxScore), 0) / n;
    // Return [progress, mastery, activity(proxy), accuracy(proxy), streak(proxy), balance(proxy), growth(proxy)]
    return [avgProgress, avgKP, avgScoreNorm * 0.6, avgScoreNorm * 0.7, avgScoreNorm * 0.5, avgScoreNorm * 0.8, avgScoreNorm * 0.5];
  }, [students, totalMissions, kpMasteryMap]);

  // Sorted students (optionally filtered to alert-only)
  const sortedStudents = useMemo(() => {
    const alertUserIds = alertOnly ? new Set(alerts.map(a => a.userId)) : null;
    const list = alertUserIds ? students.filter(s => alertUserIds.has(s.user_id)) : [...students];
    const dir = sortAsc ? 1 : -1;
    return list.sort((a, b) => {
      if (sortKey === 'name') return dir * (a.display_name || '').localeCompare(b.display_name || '');
      if (sortKey === 'score') return dir * ((a.total_score || 0) - (b.total_score || 0));
      if (sortKey === 'progress') return dir * (getStudentOverall(a) - getStudentOverall(b));
      if (sortKey === 'kp') return dir * ((kpMasteryMap.get(a.user_id) ?? 0) - (kpMasteryMap.get(b.user_id) ?? 0));
      return 0;
    });
  }, [students, sortKey, sortAsc, kpMasteryMap, alertOnly, alerts, studentOverallMap]);

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
      className="min-h-screen bg-white/40 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-xl space-y-4"
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
            onChange={e => { setGrade(Number(e.target.value)); setFilterTag(''); }}
            className={`bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 shadow-sm transition-shadow ${INPUT_FOCUS_CLASS}`}
          >
            {(() => {
              // If teacher has scoped classes, only show relevant grades
              if (teacherClasses) {
                const grades = new Set(teacherClasses.map(c => {
                  const m = c.match(/^(\d+)/);
                  return m ? Number(m[1]) : null;
                }).filter(Boolean) as number[]);
                if (grades.size > 0) return [...grades].sort().map(g => <option key={g} value={g}>Y{g}</option>);
              }
              return [7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Y{g}</option>);
            })()}
          </select>
          <button
            onClick={fetchStudents}
            className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={isDashboardLoading ? 'animate-spin' : ''} />
          </button>
          {onStartLive && filterTag && (
            <button
              onClick={() => {
                const msg = lang === 'en'
                  ? `Start a live session for class "${filterTag}"?\n\nAll students in this class will be notified. You\'ll get a PIN code to share.`
                  : `为 "${filterTag}" 班开始实时课堂？\n\n该班所有学生将收到通知，你会获得一个 PIN 码分享给学生。`;
                if (confirm(msg)) onStartLive(filterTag, grade);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-lg px-4 py-2 text-sm font-black text-white hover:opacity-90 transition-opacity shadow-md"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {lang === 'en' ? 'Start Live' : '开始课堂'}
            </button>
          )}
          <button
            onClick={() => setShowWeeklyReport(true)}
            disabled={students.length === 0}
            className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-sm disabled:opacity-40"
            title={lang === 'en' ? 'Weekly Report' : '周报'}
          >
            📊 {lang === 'en' ? 'Report' : '周报'}
          </button>
          <button
            onClick={exportCSV}
            disabled={students.length === 0}
            className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:border-slate-200"
            title={lang === 'en' ? 'Export CSV' : '导出 CSV'}
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">{error}</div>
      )}

      {/* ═══ STEP 0: Pick your class FIRST ═══ */}
      <div className="flex items-center gap-2 px-1 flex-wrap">
        <Tag size={14} className="text-slate-500" />
        <button
          onClick={() => setFilterTag('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            !filterTag ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.all}
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filterTag === tag ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {filterTag && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
          <span className="text-xs font-black text-indigo-700">
            {lang === 'en' ? `Viewing: Y${grade} ${filterTag}` : `当前查看：Y${grade} ${filterTag}`}
          </span>
          <span className="text-[10px] text-indigo-400 font-bold">
            {students.length} {lang === 'en' ? 'students' : '名学生'}
          </span>
        </div>
      )}

      {/* ╔══════════════════════════════════════════╗
         ║  ZONE 1: 今天怎么样？（选完班级再看）    ║
         ╚══════════════════════════════════════════╝ */}
      {isDashboardLoading && students.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0,1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
      <DailySummary
        lang={lang}
        students={students}
        assignmentCompletionRate={(() => {
          const active = dashAssignments.filter(a => !a.archived_at);
          if (active.length === 0 || students.length === 0) return 0;
          const latest = active[0];
          if (!latest) return 0;
          const done = students.filter(s => {
            const cm = s.completed_missions as Record<string, any> | null;
            return latest.mission_ids.every((mid: number) => cm?.[String(mid)]?.green);
          }).length;
          return Math.round((done / students.length) * 100);
        })()}
        totalAssignments={dashAssignments.filter(a => !a.archived_at).length}
      />
      )}

      <SmartSuggestions lang={lang} students={students} alerts={alerts} />

      {/* (tag filter moved to top of page) */}

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
                <option value="">{lang === 'en' ? 'Select...' : '选择...'}</option>
                {allTags.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={batchAddTag} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">{t.confirm}</button>
              <button onClick={() => setShowBatchAssign(false)} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">{t.cancel}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ╔══════════════════════════════════════════╗
         ║  ZONE 2: 我该做什么？（每天操作区）      ║
         ╚══════════════════════════════════════════╝ */}
      <div className="mt-2 mb-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Action' : '今日行动'}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <AssignmentPanel
        lang={lang} grade={grade} filterTag={filterTag} students={students} units={units}
        kpAssignContext={kpAssignContext}
        onClearKpAssignContext={() => setKpAssignContext(null)}
      />

      <AlertPanel lang={lang} alerts={alerts} alertOnly={alertOnly} onToggleAlertOnly={() => setAlertOnly(!alertOnly)} onStudentClick={(uid) => {
        const s = students.find(st => st.user_id === uid);
        if (s) setSelectedStudent(s);
      }} />

      <KPWeaknessPanel
        lang={lang} grade={grade} filterTag={filterTag} students={students}
        onAssignKP={(kpId, weakStudentNames, weakStudentIds) => {
          const missionIds = getMissionIdsForKP(kpId);
          if (missionIds.length === 0) {
            setError(lang === 'en' ? `No missions found for ${kpId}` : `${kpId} 暂无对应关卡`);
            setTimeout(() => setError(''), 3000);
            return;
          }
          setKpAssignContext({ kpId, missionIds, weakStudentNames, weakStudentIds });
        }}
      />

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
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t.green}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {t.amber}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> {t.red}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Users size={12} />
          {students.length} {t.student}
          <span className="mx-0.5">·</span>
          {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Table */}
      <div className="relative">
        {/* Scroll hint gradient (right edge) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-2xl md:hidden" />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg -webkit-overflow-scrolling-touch">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 bg-slate-50 z-20 px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap w-8">#</th>
              <th className="sticky left-8 bg-slate-50 z-20 px-3 py-2.5 text-left font-bold text-slate-700 whitespace-nowrap min-w-[140px] cursor-pointer hover:text-indigo-600 select-none" onClick={() => handleSort('name')}>
                {t.student} {sortKey === 'name' && <ArrowUpDown size={10} className="inline ml-0.5" />}
              </th>
              <th className="hidden sm:table-cell px-2 py-2.5 text-left font-bold text-slate-700 whitespace-nowrap min-w-[100px]">{t.tags}</th>
              <th className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap min-w-[60px] cursor-pointer hover:text-indigo-600 select-none" onClick={() => handleSort('score')}>
                <div className="flex items-center justify-center gap-1"><Trophy size={12} className="text-amber-500" /> {t.score} {sortKey === 'score' && <ArrowUpDown size={10} />}</div>
              </th>
              <th className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap min-w-[50px] cursor-pointer hover:text-indigo-600 select-none" onClick={() => handleSort('progress')}>
                {t.overall} {sortKey === 'progress' && <ArrowUpDown size={10} className="inline ml-0.5" />}
              </th>
              <th className="px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap min-w-[40px] cursor-pointer hover:text-indigo-600 select-none" onClick={() => handleSort('kp')}>
                KP {sortKey === 'kp' && <ArrowUpDown size={10} className="inline ml-0.5" />}
              </th>
              {units.map(([uid, u]) => (
                <th key={uid} className="hidden md:table-cell px-2 py-2.5 text-center font-bold text-slate-700 whitespace-nowrap border-l border-slate-100" title={u.title}>
                  <div className="text-[10px] leading-tight max-w-[80px] mx-auto truncate">{u.title.replace(/Unit \d+:\s*/, '').split('·')[0]}</div>
                  <div className="text-[8px] text-slate-400 mt-0.5">{u.missions.length} 关</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={6 + units.length} className="text-center py-8">
                  {isDashboardLoading ? (
                    <div className="flex flex-col gap-2 p-4">
                      {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={5 + units.length} />)}
                    </div>
                  ) : (
                    <div className="px-6 py-4">
                      <Users size={28} className="text-slate-200 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-500 mb-1">
                        {lang === 'en' ? 'No students yet' : '暂无学生数据'}
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                        {lang === 'en'
                          ? 'Students appear here after they sign in at play.25maths.com and select their year group. Use the tag system above to organize them into classes.'
                          : '学生在 play.25maths.com 登录并选择年级后会自动出现。用上方标签系统将他们分入班级。'
                        }
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
            {sortedStudents.map((s, i) => {
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
                    {(() => {
                      const login = (s.completed_missions as any)?._login as { lastDate?: string } | undefined;
                      const daysSince = login?.lastDate ? Math.floor((Date.now() - new Date(login.lastDate).getTime()) / 86400000) : -1;
                      const dotColor = daysSince < 0 ? 'bg-slate-300' : daysSince <= 1 ? 'bg-emerald-400' : daysSince <= 3 ? 'bg-amber-400' : 'bg-rose-400';
                      const dotTitle = daysSince < 0 ? (lang === 'en' ? 'Never active' : '从未活跃')
                        : daysSince === 0 ? (lang === 'en' ? 'Active today' : '今天活跃')
                        : (lang === 'en' ? `${daysSince}d ago` : `${daysSince}天前`);
                      return (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[11px] font-black text-white shadow-sm">
                              {((s.display_name && s.display_name.trim()) || '?')[0].toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${dotColor}`} title={dotTitle} />
                          </div>
                          <span className="text-xs">{s.display_name || 'Anonymous'}</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="hidden sm:table-cell px-2 py-2" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 flex-wrap">
                      {(s.class_tags || []).map(tag => {
                        // Homeroom class tags (start with digit) are not removable
                        const isHomeroom = /^\d/.test(tag);
                        return <TagBadge key={tag} tag={tag} onRemove={isHomeroom ? undefined : () => removeStudentTag(s.user_id, tag)} />;
                      })}
                      {addingTagFor === s.user_id ? (
                        <span className="inline-flex items-center gap-0.5">
                          <select
                            value={newTagValue}
                            onChange={e => { if (e.target.value) addStudentTag(s.user_id, e.target.value); }}
                            className={`text-[9px] bg-white border border-indigo-300 rounded px-1 py-0.5 font-bold text-indigo-900 ${INPUT_FOCUS_CLASS}`}
                            autoFocus
                          >
                            <option value="">{lang === 'en' ? 'Select class...' : '选择班级...'}</option>
                            {allTags.filter(c => !(s.class_tags || []).includes(c)).map(c => (
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
                      <td key={uid} className="hidden md:table-cell px-2 py-2 border-l border-slate-100">
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
      </div>

      {/* ╔══════════════════════════════════════════╗
         ║  ZONE 3: 深入分析（需要时展开）          ║
         ╚══════════════════════════════════════════╝ */}
      <button
        onClick={() => setShowAnalysis(!showAnalysis)}
        className="w-full flex items-center gap-2 py-2"
      >
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          {lang === 'en' ? 'Analysis' : '深入分析'}
          <span className="text-slate-300">{showAnalysis ? '▲' : '▼'}</span>
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </button>
      {showAnalysis && (
        <div className="space-y-4">
          <WeeklyTrend lang={lang} grade={grade} filterTag={filterTag} />
          <ClassOverview lang={lang} grade={grade} filterTag={filterTag} students={students} units={units} totalMissions={totalMissions} />
          <ClassManager lang={lang} grade={grade} students={students} onClassCreated={(name) => setFilterTag(name)} />
          <ExamHubBridge lang={lang} students={students} />
          <KPHeatmap lang={lang} grade={grade} filterTag={filterTag} students={students} onStudentClick={(uid) => {
            const s = students.find(st => st.user_id === uid);
            if (s) setSelectedStudent(s);
          }} />
        </div>
      )}

      {/* ═══ Student Detail Card (v8.0) ═══ */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailCard
            lang={lang}
            student={selectedStudent}
            units={units}
            totalMissions={totalMissions}
            assignments={dashAssignments.filter(a => !a.archived_at).map(a => {
              const done = a.mission_ids.filter(mid => (selectedStudent.completed_missions as any)?.[String(mid)]?.green).length;
              return { id: a.id, title: a.title, deadline: a.deadline, missionsDone: done, missionsTotal: a.mission_ids.length };
            })}
            classAverageDims={classAvgDims}
            onClose={() => setSelectedStudent(null)}
            onParentReport={() => { setParentReportStudent(selectedStudent); }}
          />
        )}
      </AnimatePresence>

      {showWeeklyReport && (
        <ClassWeeklyReport
          lang={lang}
          grade={grade}
          filterTag={filterTag}
          students={students}
          onClose={() => setShowWeeklyReport(false)}
        />
      )}

      {parentReportStudent && (
        <ParentReport
          lang={lang}
          student={parentReportStudent}
          grade={grade}
          onClose={() => setParentReportStudent(null)}
        />
      )}
    </motion.div>
  );
}
