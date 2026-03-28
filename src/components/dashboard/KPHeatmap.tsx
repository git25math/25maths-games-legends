import { useEffect, useRef, useState, useMemo } from 'react';
import { Grid3X3, ChevronDown, ChevronUp } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow, KPProgressRow } from './types';
import { supabase } from '../../supabase';

type CellStatus = 'mastered' | 'learning' | 'struggling' | 'untouched';

function getCellStatus(wins: number, attempts: number, mastered: boolean): CellStatus {
  if (mastered) return 'mastered';
  if (attempts > 2 && wins === 0) return 'struggling';
  if (attempts > 0) return 'learning';
  return 'untouched';
}

const CELL_COLORS: Record<CellStatus, string> = {
  mastered: 'bg-emerald-400',
  learning: 'bg-amber-400',
  struggling: 'bg-rose-400',
  untouched: 'bg-slate-100',
};

const CELL_LABELS: Record<CellStatus, { zh: string; en: string }> = {
  mastered: { zh: '已掌握', en: 'Mastered' },
  learning: { zh: '学习中', en: 'Learning' },
  struggling: { zh: '薄弱', en: 'Struggling' },
  untouched: { zh: '未涉及', en: 'Untouched' },
};

export const KPHeatmap = ({
  lang,
  grade,
  filterTag,
  students,
  onStudentClick,
}: {
  lang: Language;
  grade: number;
  filterTag: string;
  students: StudentRow[];
  onStudentClick: (userId: string) => void;
}) => {
  const [kpData, setKpData] = useState<KPProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setExpanded(false);
    if (tableRef.current) tableRef.current.scrollLeft = 0;
    supabase.rpc('get_class_kp_progress', {
      p_grade: grade,
      p_class: filterTag || null,
    }).then(({ data, error }) => {
      if (!error) setKpData((data as KPProgressRow[]) || []);
      else setKpData([]);
      setLoading(false);
    }, () => { setKpData([]); setLoading(false); });
  }, [grade, filterTag]);

  // Build matrix: studentId → kpId → { wins, attempts, mastered }
  const { kpIds, matrix, kpAvg } = useMemo(() => {
    const kpSet = new Set<string>();
    const mat: Record<string, Record<string, { wins: number; attempts: number; mastered: boolean }>> = {};

    for (const row of kpData) {
      kpSet.add(row.kp_id);
      if (!mat[row.user_id]) mat[row.user_id] = {};
      mat[row.user_id][row.kp_id] = {
        wins: row.wins,
        attempts: row.attempts,
        mastered: !!row.mastered_at,
      };
    }

    const ids = [...kpSet].sort();

    // Compute class average mastery % per KP
    const avg: Record<string, number> = {};
    for (const kp of ids) {
      let mastered = 0;
      let total = 0;
      for (const s of students) {
        total++;
        if (mat[s.user_id]?.[kp]?.mastered) mastered++;
      }
      avg[kp] = total > 0 ? Math.round((mastered / total) * 100) : 0;
    }

    return { kpIds: ids, matrix: mat, kpAvg: avg };
  }, [kpData, students]);

  if (loading) {
    return (
      <div className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
        {lang === 'en' ? 'Loading KP data...' : '加载知识点数据...'}
      </div>
    );
  }

  if (kpIds.length === 0) return null;

  // Show max 15 KPs by default, expand to show all
  const visibleKPs = expanded ? kpIds : kpIds.slice(0, 15);
  const sortedStudents = [...students].sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <Grid3X3 size={14} className="text-indigo-500" />
          <span className="text-xs font-black text-slate-700">
            {lang === 'en' ? 'KP Mastery Heatmap' : '知识点掌握热力图'}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            {kpIds.length} KPs · {students.length} {lang === 'en' ? 'students' : '人'}
          </span>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2">
          {(['mastered', 'learning', 'struggling', 'untouched'] as CellStatus[]).map(s => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-sm ${CELL_COLORS[s]}`} />
              <span className="text-[9px] text-slate-400 font-bold">{lang === 'en' ? CELL_LABELS[s].en : CELL_LABELS[s].zh}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={tableRef} className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 bg-slate-50 z-10 px-2 py-2 text-left font-bold text-slate-600 min-w-[100px]">
                {lang === 'en' ? 'Student' : '学生'}
              </th>
              {visibleKPs.map(kp => {
                const avg = kpAvg[kp] ?? 0;
                const shortName = kp.replace(/^kp-/, '').replace(/-/g, '.');
                return (
                  <th key={kp} className="px-1 py-2 text-center font-bold whitespace-nowrap" title={kp}>
                    <div className="text-[8px] text-slate-500 leading-tight">{shortName}</div>
                    <div className={`text-[8px] font-black mt-0.5 ${avg < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {avg}%
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(s => (
              <tr
                key={s.user_id}
                className="border-b border-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                onClick={() => onStudentClick(s.user_id)}
              >
                <td className="sticky left-0 bg-white z-10 px-2 py-1.5 font-bold text-slate-700 whitespace-nowrap" title={s.display_name || ''}>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block max-w-[80px] truncate">{s.display_name || '?'}</span>
                    {(s.display_name || '').includes(' ') && (
                      <span className="text-[8px] text-slate-400 font-bold shrink-0">
                        {(s.display_name || '').split(' ').pop()?.[0]}
                      </span>
                    )}
                  </span>
                </td>
                {visibleKPs.map(kp => {
                  const cell = matrix[s.user_id]?.[kp];
                  const status: CellStatus = cell
                    ? getCellStatus(cell.wins, cell.attempts, cell.mastered)
                    : 'untouched';
                  return (
                    <td key={kp} className="px-0.5 py-0.5">
                      <div
                        className={`w-full h-5 rounded-sm ${CELL_COLORS[status]} hover:ring-1 hover:ring-slate-400 transition-shadow`}
                        title={`${s.display_name}: ${kp} — ${CELL_LABELS[status].en}${cell ? ` (${cell.wins}/${cell.attempts})` : ''}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Class average row */}
            <tr className="bg-slate-50 border-t-2 border-slate-200">
              <td className="sticky left-0 bg-slate-50 z-10 px-2 py-1.5 font-black text-slate-600 whitespace-nowrap">
                {lang === 'en' ? 'Class Avg' : '班级平均'}
              </td>
              {visibleKPs.map(kp => {
                const avg = kpAvg[kp] ?? 0;
                return (
                  <td key={kp} className="px-0.5 py-1 text-center">
                    <div className={`inline-block px-1 py-0.5 rounded-sm ${avg < 50 ? 'bg-rose-100' : avg < 75 ? 'bg-amber-50' : ''}`}>
                      <span className={`text-[9px] font-black ${avg < 50 ? 'text-rose-600' : avg < 75 ? 'text-amber-600' : 'text-emerald-500'}`}>
                        {avg}%
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Expand/collapse */}
      {kpIds.length > 15 && (
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex items-center gap-1 mx-auto mt-2 px-3 py-1 text-xs text-indigo-500 font-bold hover:bg-indigo-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded
            ? (lang === 'en' ? 'Show less' : '收起')
            : (lang === 'en' ? `Show all ${kpIds.length} KPs` : `展开全部 ${kpIds.length} 个知识点`)
          }
        </button>
      )}
    </div>
  );
};
