import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, TrendingDown, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow, StudentAlert, UnitEntry } from './types';
import { countGreenMissions } from './types';

/** Compute alerts for all students */
export function computeAlerts(
  students: StudentRow[],
  units: UnitEntry[],
  totalMissions: number,
): StudentAlert[] {
  const now = Date.now();
  const alerts: StudentAlert[] = [];

  // Class average progress
  const avgProgress = students.length > 0 && totalMissions > 0
    ? students.reduce((sum, s) => sum + countGreenMissions(s.completed_missions, units) / totalMissions, 0) / students.length
    : 0;

  for (const s of students) {
    const login = (s.completed_missions as any)?._login as { lastDate?: string; streak?: number; bestStreak?: number } | undefined;
    const name = s.display_name || 'Anonymous';

    // 1. Login check — skip brand-new students (total_score === 0, not yet interacted)
    if (login?.lastDate) {
      const last = new Date(login.lastDate).getTime();
      const daysSince = Math.floor((now - last) / 86400000);
      if (daysSince >= 7) {
        alerts.push({ userId: s.user_id, name, level: 'critical', reason: `${daysSince} 天未登录`, reasonEn: `${daysSince} days inactive`, suggestion: '建议联系家长，确认学生是否需要帮助', suggestionEn: 'Contact parent to check if student needs support' });
      } else if (daysSince >= 3) {
        alerts.push({ userId: s.user_id, name, level: 'warning', reason: `${daysSince} 天未登录`, reasonEn: `${daysSince} days inactive`, suggestion: '可课上提醒学生登录练习', suggestionEn: 'Remind student to log in during class' });
      }
    } else if ((s.total_score ?? 0) > 0) {
      // Has score but no login record — likely a data gap, worth flagging
      alerts.push({ userId: s.user_id, name, level: 'warning', reason: '从未登录游戏', reasonEn: 'Never played', suggestion: '建议课上引导首次体验', suggestionEn: 'Guide first-time experience in class' });
    }

    // 2. Progress check (behind class average by >20%)
    const done = countGreenMissions(s.completed_missions, units);
    const myProgress = totalMissions > 0 ? done / totalMissions : 0;
    if (avgProgress > 0.1 && myProgress < avgProgress - 0.2) {
      const pct = Math.round(myProgress * 100);
      const avgPct = Math.round(avgProgress * 100);
      alerts.push({ userId: s.user_id, name, level: 'warning', reason: `进度 ${pct}%（班级均 ${avgPct}%）`, reasonEn: `Progress ${pct}% (class avg ${avgPct}%)`, suggestion: '建议布置较简单的关卡，帮助建立信心', suggestionEn: 'Assign easier missions to build confidence' });
    }

    // 3. Error pattern check (any KP with 3+ mistakes)
    const mistakes = (s.completed_missions as any)?._mistakes as Record<string, { count?: number }> | undefined;
    if (mistakes) {
      for (const [mid, info] of Object.entries(mistakes)) {
        if (info?.count && info.count >= 5) {
          alerts.push({ userId: s.user_id, name, level: 'critical', reason: `关卡 ${mid} 错误 ${info.count} 次`, reasonEn: `Mission ${mid}: ${info.count} errors`, suggestion: '建议布置该知识点专项练习，或安排引导课', suggestionEn: 'Assign targeted practice or a guided lesson for this topic' });
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
  alertOnly,
  onToggleAlertOnly,
  onStudentClick,
}: {
  lang: Language;
  alerts: StudentAlert[];
  alertOnly: boolean;
  onToggleAlertOnly: () => void;
  onStudentClick: (userId: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  if (alerts.length === 0) return null;

  const critical = alerts.filter(a => a.level === 'critical');
  const COLLAPSED_LIMIT = 6;
  const hasMore = alerts.length > COLLAPSED_LIMIT;
  const visible = expanded ? alerts : alerts.slice(0, COLLAPSED_LIMIT);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={14} className="text-rose-500" />
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
        <button
          onClick={onToggleAlertOnly}
          className={`ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
            alertOnly
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white/80 text-rose-600 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <Filter size={10} />
          {alertOnly
            ? (lang === 'en' ? 'Show all' : '显示全部')
            : (lang === 'en' ? 'Filter table' : '只看预警')
          }
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {visible.map((a, i) => (
          <button
            key={`${a.userId}-${i}`}
            onClick={() => onStudentClick(a.userId)}
            className={`flex flex-col items-start px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:shadow-sm ${
              a.level === 'critical'
                ? 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200'
                : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {a.level === 'critical' ? <Clock size={12} /> : <TrendingDown size={12} />}
              <span>{a.name}</span>
              <span className="text-[10px] opacity-70">{lang === 'en' ? a.reasonEn : a.reason}</span>
            </div>
            {a.suggestion && (
              <span className="text-[9px] opacity-50 mt-0.5 font-normal">
                → {lang === 'en' ? a.suggestionEn : a.suggestion}
              </span>
            )}
          </button>
        ))}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-500 font-bold hover:text-rose-600 transition-colors"
          >
            {expanded
              ? <><ChevronUp size={12} /> {lang === 'en' ? 'Show less' : '收起'}</>
              : <><ChevronDown size={12} /> +{alerts.length - COLLAPSED_LIMIT} {lang === 'en' ? 'more' : '更多'}</>
            }
          </button>
        )}
      </div>
    </motion.div>
  );
};
