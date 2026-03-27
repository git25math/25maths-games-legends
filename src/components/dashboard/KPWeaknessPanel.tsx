/**
 * KPWeaknessPanel — 班级 KP 薄弱点排名 (P2)
 * Aggregates play_kp_progress across all students in a class to identify
 * the KPs where students struggle most. Links to ExamHub guided lessons.
 */
import { useEffect, useState, useMemo } from 'react';
import { AlertTriangle, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow } from './types';
import { supabase } from '../../supabase';
import { getExamHubLessonUrl, getLessonId } from '../../utils/lessonMap';

type KPProgressRow = {
  user_id: string;
  display_name: string;
  kp_id: string;
  wins: number;
  attempts: number;
  mastered_at: string | null;
};

type AggregatedKP = {
  kpId: string;
  totalAttempts: number;
  totalWins: number;
  failureRate: number;
  studentCount: number;         // students who attempted
  strugglingCount: number;      // students with attempts>2 and wins===0
  blockedCount: number;         // students with blocked/critical corruption (Resilience Engine)
  hasLesson: boolean;
  lessonUrl: string | null;
};

export function KPWeaknessPanel({
  lang,
  grade,
  filterTag,
  students,
}: {
  lang: Language;
  grade: number;
  filterTag: string;
  students: StudentRow[];
}) {
  const [kpData, setKpData] = useState<KPProgressRow[]>([]);
  const [healthData, setHealthData] = useState<{ user_id: string; node_id: string; corruption_level: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    const studentIds = students.map(s => s.user_id);
    Promise.all([
      supabase.rpc('get_class_kp_progress', {
        p_grade: grade,
        p_class: filterTag || null,
      }),
      // Fetch Resilience Engine health data for blocked/critical nodes
      studentIds.length > 0
        ? supabase.from('user_skill_health')
            .select('user_id, node_id, corruption_level')
            .in('user_id', studentIds)
            .in('corruption_level', ['blocked', 'critical'])
        : Promise.resolve({ data: [] }),
    ]).then(([kpRes, healthRes]) => {
      setKpData((kpRes.data as KPProgressRow[]) ?? []);
      setHealthData((healthRes.data as any[]) ?? []);
      setLoading(false);
    });
  }, [grade, filterTag, students]);

  const weakestKPs = useMemo(() => {
    const studentIds = new Set(students.map(s => s.user_id));
    const kpMap = new Map<string, AggregatedKP>();

    for (const row of kpData) {
      if (!studentIds.has(row.user_id)) continue;
      if (row.attempts === 0) continue;

      if (!kpMap.has(row.kp_id)) {
        kpMap.set(row.kp_id, {
          kpId: row.kp_id,
          totalAttempts: 0,
          totalWins: 0,
          failureRate: 0,
          studentCount: 0,
          strugglingCount: 0,
          blockedCount: 0,
          hasLesson: !!getLessonId(row.kp_id),
          lessonUrl: getExamHubLessonUrl(row.kp_id),
        });
      }
      const kp = kpMap.get(row.kp_id)!;
      kp.totalAttempts += row.attempts;
      kp.totalWins += row.wins;
      kp.studentCount += 1;
      if (row.attempts > 2 && row.wins === 0) kp.strugglingCount += 1;
    }

    // Merge Resilience Engine blocked counts
    for (const h of healthData) {
      // node_id is topicId (e.g., '2.2'), find matching kp_ids
      for (const [kpId, kp] of kpMap) {
        const topicMatch = kpId.match(/^kp-(\d+\.\d+)/);
        if (topicMatch && topicMatch[1] === h.node_id) {
          kp.blockedCount += 1;
          break; // count each student once per topic
        }
      }
    }

    // Calculate failure rate and sort
    const result: AggregatedKP[] = [];
    for (const kp of kpMap.values()) {
      if (kp.totalAttempts >= 3) { // Minimum sample size
        kp.failureRate = Math.round(((kp.totalAttempts - kp.totalWins) / kp.totalAttempts) * 100);
        result.push(kp);
      }
    }

    return result
      .filter(k => k.failureRate > 0)
      .sort((a, b) => b.failureRate - a.failureRate || b.strugglingCount - a.strugglingCount);
  }, [kpData, students]);

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <AlertTriangle size={14} className="animate-pulse" />
          {lang === 'en' ? 'Analyzing weak points...' : '分析薄弱点...'}
        </div>
      </div>
    );
  }

  if (weakestKPs.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <AlertTriangle size={14} />
          {lang === 'en' ? 'Not enough battle data yet to identify weak points.' : '对局数据不足，暂无法识别薄弱点。'}
        </div>
      </div>
    );
  }

  const displayKPs = expanded ? weakestKPs : weakestKPs.slice(0, 5);
  const hasMore = weakestKPs.length > 5;

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-rose-500" />
          <span className="text-sm font-black text-slate-700">
            {lang === 'en' ? 'Class Weak Points' : '班级薄弱点排名'}
          </span>
          <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full">
            {weakestKPs.length} KPs
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {lang === 'en' ? 'by failure rate' : '按失败率排序'}
        </span>
      </div>

      {/* KP List */}
      <div className="divide-y divide-slate-50">
        {displayKPs.map((kp, idx) => {
          const barColor = kp.failureRate >= 70 ? 'bg-rose-500' : kp.failureRate >= 40 ? 'bg-amber-400' : 'bg-blue-400';
          const textColor = kp.failureRate >= 70 ? 'text-rose-600' : kp.failureRate >= 40 ? 'text-amber-600' : 'text-blue-600';

          return (
            <div key={kp.kpId} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/50 transition-colors">
              {/* Rank */}
              <span className={`text-xs font-black w-5 ${idx < 3 ? 'text-rose-500' : 'text-slate-400'}`}>
                {idx + 1}
              </span>

              {/* KP ID + info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 truncate">{kp.kpId}</span>
                  {kp.hasLesson && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[9px] font-bold rounded">
                      {lang === 'en' ? 'LESSON' : '有课程'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${kp.failureRate}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {kp.studentCount}{lang === 'en' ? ' students' : '人'}
                    {kp.blockedCount > 0 && (
                      <span className="text-rose-500 ml-1 font-bold">
                        ({kp.blockedCount}{lang === 'en' ? ' blocked' : '人受阻'})
                      </span>
                    )}
                    {kp.blockedCount === 0 && kp.strugglingCount > 0 && (
                      <span className="text-amber-500 ml-1">
                        ({kp.strugglingCount}{lang === 'en' ? ' weak' : '人薄弱'})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Failure rate */}
              <span className={`text-sm font-black w-12 text-right ${textColor}`}>
                {kp.failureRate}%
              </span>

              {/* Lesson link */}
              {kp.lessonUrl ? (
                <a
                  href={kp.lessonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-lg hover:bg-purple-200 transition-colors"
                  title={lang === 'en' ? 'Open guided lesson in ExamHub' : '在 ExamHub 打开引导课'}
                >
                  <BookOpen size={10} />
                  <ExternalLink size={8} />
                </a>
              ) : (
                <div className="w-[42px]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-[11px] text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-100"
        >
          {expanded
            ? <>{lang === 'en' ? 'Show less' : '收起'} <ChevronUp size={12} /></>
            : <>{lang === 'en' ? `Show all ${weakestKPs.length}` : `查看全部 ${weakestKPs.length} 个`} <ChevronDown size={12} /></>
          }
        </button>
      )}
    </div>
  );
}
