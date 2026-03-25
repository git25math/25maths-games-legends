import { motion } from 'motion/react';
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow, StudentAlert, UnitEntry } from './types';

/** Compute alerts for all students */
export function computeAlerts(
  students: StudentRow[],
  units: UnitEntry[],
  totalMissions: number,
): StudentAlert[] {
  const now = Date.now();
  const alerts: StudentAlert[] = [];

  // Class average progress
  const avgProgress = students.length > 0
    ? students.reduce((sum, s) => {
        let done = 0;
        for (const [, u] of units) {
          for (const m of u.missions) {
            if ((s.completed_missions as any)?.[String(m.id)]?.green) done++;
          }
        }
        return sum + (totalMissions > 0 ? done / totalMissions : 0);
      }, 0) / students.length
    : 0;

  for (const s of students) {
    const login = (s.completed_missions as any)?._login as { lastDate?: string; streak?: number; bestStreak?: number } | undefined;
    const name = s.display_name || 'Anonymous';

    // 1. Login check
    if (login?.lastDate) {
      const last = new Date(login.lastDate).getTime();
      const daysSince = Math.floor((now - last) / 86400000);
      if (daysSince >= 7) {
        alerts.push({ userId: s.user_id, name, level: 'critical', reason: `${daysSince} 天未登录`, reasonEn: `${daysSince} days inactive` });
      } else if (daysSince >= 3) {
        alerts.push({ userId: s.user_id, name, level: 'warning', reason: `${daysSince} 天未登录`, reasonEn: `${daysSince} days inactive` });
      }
    } else {
      // Never logged in streak data
      alerts.push({ userId: s.user_id, name, level: 'warning', reason: '从未登录', reasonEn: 'Never logged in' });
    }

    // 2. Progress check (behind class average by >20%)
    let done = 0;
    for (const [, u] of units) {
      for (const m of u.missions) {
        if ((s.completed_missions as any)?.[String(m.id)]?.green) done++;
      }
    }
    const myProgress = totalMissions > 0 ? done / totalMissions : 0;
    if (avgProgress > 0.1 && myProgress < avgProgress - 0.2) {
      const pct = Math.round(myProgress * 100);
      const avgPct = Math.round(avgProgress * 100);
      alerts.push({ userId: s.user_id, name, level: 'warning', reason: `进度 ${pct}%（班级均 ${avgPct}%）`, reasonEn: `Progress ${pct}% (class avg ${avgPct}%)` });
    }

    // 3. Error pattern check (any KP with 3+ mistakes)
    const mistakes = (s.completed_missions as any)?._mistakes as Record<string, { count?: number }> | undefined;
    if (mistakes) {
      for (const [mid, info] of Object.entries(mistakes)) {
        if (info?.count && info.count >= 5) {
          alerts.push({ userId: s.user_id, name, level: 'critical', reason: `关卡 ${mid} 错误 ${info.count} 次`, reasonEn: `Mission ${mid}: ${info.count} errors` });
          break; // only one error alert per student
        }
      }
    }
  }

  // Sort: critical first, then warning
  return alerts.sort((a, b) => {
    if (a.level !== b.level) return a.level === 'critical' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export const AlertPanel = ({
  lang,
  alerts,
  onStudentClick,
}: {
  lang: Language;
  alerts: StudentAlert[];
  onStudentClick: (userId: string) => void;
}) => {
  if (alerts.length === 0) return null;

  const critical = alerts.filter(a => a.level === 'critical');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-rose-500" />
        <span className="text-sm font-black text-rose-800">
          {lang === 'en'
            ? `${alerts.length} student${alerts.length > 1 ? 's' : ''} need attention`
            : `${alerts.length} 名学生需要关注`
          }
        </span>
        {critical.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
            {critical.length} {lang === 'en' ? 'urgent' : '紧急'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {alerts.slice(0, 8).map((a, i) => (
          <button
            key={`${a.userId}-${i}`}
            onClick={() => onStudentClick(a.userId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:shadow-sm ${
              a.level === 'critical'
                ? 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200'
                : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200'
            }`}
          >
            {a.level === 'critical' ? <Clock size={12} /> : <TrendingDown size={12} />}
            <span>{a.name}</span>
            <span className="text-[10px] opacity-70">{lang === 'en' ? a.reasonEn : a.reason}</span>
          </button>
        ))}
        {alerts.length > 8 && (
          <span className="px-3 py-1.5 text-xs text-slate-400 font-bold">
            +{alerts.length - 8} {lang === 'en' ? 'more' : '更多'}
          </span>
        )}
      </div>
    </motion.div>
  );
};
