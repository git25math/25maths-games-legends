/**
 * DailySummary — Teacher's 30-second morning glance.
 * Shows: yesterday's activity, homework completion, students needing attention.
 */
import { useMemo } from 'react';
import { Users, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow } from './types';

type Props = {
  lang: Language;
  students: StudentRow[];
  assignmentCompletionRate: number;
  totalAssignments: number;
};

export function DailySummary({ lang, students, assignmentCompletionRate, totalAssignments }: Props) {
  const en = lang === 'en';

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    let activeYesterday = 0;
    let inactive3days = 0;
    let totalScore = 0;
    let lastWeekScore = 0;

    for (const s of students) {
      const cm = s.completed_missions as Record<string, unknown> | null;
      const login = (cm as any)?._login as { lastDate?: string } | undefined;
      const lastDate = login?.lastDate ? new Date(login.lastDate).getTime() : 0;

      if (now - lastDate < dayMs * 2) activeYesterday++;
      if (now - lastDate > dayMs * 3) inactive3days++;

      totalScore += s.total_score || 0;
    }

    const avgScore = students.length > 0 ? Math.round(totalScore / students.length) : 0;

    return { activeYesterday, inactive3days, avgScore, total: students.length };
  }, [students]);

  const cards = [
    {
      icon: <Users size={18} />,
      label: en ? 'Active yesterday' : '昨日活跃',
      value: `${stats.activeYesterday}/${stats.total}`,
      color: stats.activeYesterday > stats.total * 0.5 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50',
    },
    {
      icon: <CheckCircle2 size={18} />,
      label: en ? 'Homework done' : '作业完成',
      value: totalAssignments > 0 ? `${assignmentCompletionRate}%` : '—',
      color: assignmentCompletionRate >= 70 ? 'text-emerald-600 bg-emerald-50' : assignmentCompletionRate >= 40 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50',
    },
    {
      icon: <AlertTriangle size={18} />,
      label: en ? 'Need attention' : '需要关注',
      value: String(stats.inactive3days),
      color: stats.inactive3days > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: <TrendingUp size={18} />,
      label: en ? 'Class avg score' : '班级平均分',
      value: String(stats.avgScore),
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <div key={i} className={`rounded-xl p-3 ${c.color} border border-current/10`}>
          <div className="flex items-center gap-2 mb-1 opacity-70">{c.icon}<span className="text-[10px] font-bold">{c.label}</span></div>
          <div className="text-2xl font-black">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
