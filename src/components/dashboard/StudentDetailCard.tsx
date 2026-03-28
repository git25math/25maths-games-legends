import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertTriangle, BarChart3, ClipboardList, Clock } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow, UnitEntry } from './types';
import { RadarChart } from './RadarChart';
import { supabase } from '../../supabase';
import { useEscapeKey } from '../../hooks/useEscapeKey';

type BattleRecord = {
  mission_id: number;
  success: boolean;
  score: number;
  duration_secs: number;
  created_at: string;
};

type KPRecord = {
  kp_id: string;
  wins: number;
  attempts: number;
  mastered_at: string | null;
};

/** Compute 7-dimension scores (0–1) for radar chart */
function compute7Dimensions(
  student: StudentRow,
  units: UnitEntry[],
  totalMissions: number,
  battles: BattleRecord[],
  kpRecords: KPRecord[],
): number[] {
  // 1. Progress completion rate
  let greenDone = 0;
  for (const [, u] of units) {
    for (const m of u.missions) {
      if ((student.completed_missions as any)?.[String(m.id)]?.green) greenDone++;
    }
  }
  const progress = totalMissions > 0 ? greenDone / totalMissions : 0;

  // 2. Knowledge mastery
  const totalKPs = kpRecords.length;
  const masteredKPs = kpRecords.filter(k => k.mastered_at).length;
  const mastery = totalKPs > 0 ? masteredKPs / Math.max(totalKPs, 10) : 0; // cap at 10 for normalization

  // Pre-parse battle timestamps once (avoid repeated Date construction in filters)
  const weekAgo = Date.now() - 7 * 86400000;
  const battleTimestamps = battles.map(b => new Date(b.created_at).getTime());

  // 3. Activity (battles in last 7 days)
  const recentBattles = battleTimestamps.filter(ts => ts > weekAgo).length;
  const activity = Math.min(recentBattles / 20, 1); // 20 battles/week = 100%

  // 4. Error control rate
  const totalBattles = battles.length;
  const wins = battles.filter(b => b.success).length;
  const errorControl = totalBattles > 0 ? wins / totalBattles : 0;

  // 5. Streak persistence
  const login = (student.completed_missions as any)?._login as { bestStreak?: number } | undefined;
  const streak = Math.min((login?.bestStreak ?? 0) / 30, 1); // 30 days = 100%

  // 6. Subject balance
  let balance = 0;
  const stats = (student as any).stats as Record<string, number> | undefined;
  if (stats) {
    const vals = Object.values(stats).filter(v => typeof v === 'number');
    const mean = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    const stddev = vals.length > 0 ? Math.sqrt(vals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / vals.length) : 0;
    balance = mean > 0 ? Math.max(0, 1 - stddev / mean) : 0;
  }

  // 7. Growth speed (this week XP vs capacity)
  let weekXP = 0;
  for (let i = 0; i < battles.length; i++) {
    if (battleTimestamps[i] > weekAgo && battles[i].success) weekXP += battles[i].score;
  }
  const growth = Math.min(weekXP / 500, 1); // 500 XP/week = 100%

  return [progress, mastery, activity, errorControl, streak, balance, growth];
}

type StudentAssignment = {
  id: string;
  title: string;
  deadline: string | null;
  missionsDone: number;
  missionsTotal: number;
};

export const StudentDetailCard = ({
  lang,
  student,
  units,
  totalMissions,
  assignments = [],
  classAverageDims,
  onClose,
}: {
  lang: Language;
  student: StudentRow;
  units: UnitEntry[];
  totalMissions: number;
  assignments?: StudentAssignment[];
  classAverageDims?: number[];
  onClose: () => void;
}) => {
  useEscapeKey(onClose);
  const [battles, setBattles] = useState<BattleRecord[]>([]);
  const [kpRecords, setKpRecords] = useState<KPRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch via SECURITY DEFINER RPCs (bypasses RLS for teacher access)
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      supabase.rpc('get_student_battles', { p_user_id: student.user_id }),
      supabase.rpc('get_student_kp_progress', { p_user_id: student.user_id }),
    ]).then(([battleRes, kpRes]) => {
      if (!mounted) return;
      setBattles((battleRes.data as BattleRecord[]) || []);
      setKpRecords((kpRes.data as KPRecord[]) || []);
      setLoading(false);
    }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [student.user_id]);

  const dims = compute7Dimensions(student, units, totalMissions, battles, kpRecords);

  const radarLabels = lang === 'en'
    ? ['Progress', 'Mastery', 'Activity', 'Accuracy', 'Streak', 'Balance', 'Growth']
    : ['进度', '掌握', '活跃', '正确率', '坚持', '均衡', '成长'];

  const DIMENSION_TIPS: { zh: string; en: string }[] = [
    { zh: '已通关数 ÷ 总关卡数', en: 'Missions completed / total' },
    { zh: 'KP 掌握数（满10封顶）', en: 'KPs mastered (capped at 10)' },
    { zh: '近7天对局数（20局=满分）', en: 'Battles in last 7 days (20=full)' },
    { zh: '对局胜率', en: 'Battle win rate' },
    { zh: '最佳连续登录天数（30天=满分）', en: 'Best login streak (30d=full)' },
    { zh: '各模块学习均匀程度', en: 'Balance across subjects' },
    { zh: '本周获得 XP（500=满分）', en: 'XP earned this week (500=full)' },
  ];

  // Find the weakest dimension for actionable suggestion
  const weakestIdx = dims.indexOf(Math.min(...dims));
  const SUGGESTIONS: { zh: string; en: string }[] = [
    { zh: '建议多做新关卡，扩展学习范围', en: 'Try more new missions to broaden coverage' },
    { zh: '建议重做薄弱 KP 的关卡，加深理解', en: 'Revisit weak KP missions to deepen understanding' },
    { zh: '建议每天至少玩一局，保持节奏', en: 'Play at least 1 battle daily to stay active' },
    { zh: '建议放慢速度，仔细审题再作答', en: 'Slow down, read questions carefully before answering' },
    { zh: '建议坚持每天登录，哪怕只做一题', en: 'Log in daily, even just one question counts' },
    { zh: '建议尝试不同单元，不要只做擅长的', en: 'Try different units, not just your strengths' },
    { zh: '建议本周多挑战几局，积累经验值', en: 'Challenge more battles this week to earn XP' },
  ];

  const login = (student.completed_missions as any)?._login as { streak?: number; bestStreak?: number; lastDate?: string } | undefined;
  const mistakes = (student.completed_missions as any)?._mistakes as Record<string, { count?: number; patterns?: Record<string, number> }> | undefined;

  // Aggregate error patterns
  const errorSummary: { type: string; count: number }[] = [];
  if (mistakes) {
    const patternCounts: Record<string, number> = {};
    for (const info of Object.values(mistakes)) {
      if (info?.patterns) {
        for (const [type, cnt] of Object.entries(info.patterns)) {
          patternCounts[type] = (patternCounts[type] ?? 0) + cnt;
        }
      }
    }
    for (const [type, count] of Object.entries(patternCounts)) {
      errorSummary.push({ type, count });
    }
    errorSummary.sort((a, b) => b.count - a.count);
  }

  const ERROR_TYPE_LABELS: Record<string, { zh: string; en: string }> = {
    calc: { zh: '计算错误', en: 'Calculation' },
    reading: { zh: '审题错误', en: 'Reading' },
    method: { zh: '方法错误', en: 'Method' },
    concept: { zh: '概念错误', en: 'Concept' },
    vocab: { zh: '词汇错误', en: 'Vocabulary' },
  };

  const recentBattles = battles.slice(0, 10);
  const winRate = battles.length > 0 ? Math.round(battles.filter(b => b.success).length / battles.length * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-white rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-lg font-black text-white">
              {(student.display_name || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">{student.display_name || 'Anonymous'}</h2>
              <p className="text-xs text-slate-400 font-bold">
                Y{student.grade} · {lang === 'en' ? 'Score' : '总分'} {student.total_score}
                {login?.streak ? ` · ${lang === 'en' ? 'Streak' : '连签'} ${login.streak}${lang === 'en' ? 'd' : '天'}` : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-50 rounded-2xl p-3 mb-2">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-slate-300 text-sm">{lang === 'en' ? 'Loading...' : '加载中...'}</div>
          ) : (
            <RadarChart values={dims} labels={radarLabels} compareValues={classAverageDims} />
          )}
        </div>

        {/* Radar legend */}
        {!loading && classAverageDims && (
          <div className="flex items-center gap-4 px-1 mb-1">
            <span className="flex items-center gap-1.5 text-[9px] text-indigo-600 font-bold">
              <span className="w-3 h-0.5 bg-indigo-500 rounded inline-block" /> {lang === 'en' ? 'This student' : '该学生'}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
              <span className="w-3 h-0.5 bg-slate-400 rounded inline-block border-dashed" style={{ borderTop: '1.5px dashed #94a3b8', height: 0 }} /> {lang === 'en' ? 'Class average' : '班级平均'}
            </span>
          </div>
        )}

        {/* Dimension legend */}
        {!loading && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 px-1">
            {radarLabels.map((label, i) => (
              <span key={i} className="text-[9px] text-slate-400" title={lang === 'en' ? DIMENSION_TIPS[i].en : DIMENSION_TIPS[i].zh}>
                <span className="font-bold text-slate-500">{label}</span> {Math.round(dims[i] * 100)}%
              </span>
            ))}
          </div>
        )}

        {/* Actionable suggestion */}
        {!loading && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 mb-4">
            <p className="text-[11px] font-bold text-indigo-700">
              💡 {lang === 'en' ? SUGGESTIONS[weakestIdx].en : SUGGESTIONS[weakestIdx].zh}
            </p>
            <p className="text-[9px] text-indigo-400 mt-0.5">
              {lang === 'en'
                ? `Weakest area: ${radarLabels[weakestIdx]} (${Math.round(dims[weakestIdx] * 100)}%) — ${DIMENSION_TIPS[weakestIdx].en}`
                : `最薄弱: ${radarLabels[weakestIdx]} (${Math.round(dims[weakestIdx] * 100)}%) — ${DIMENSION_TIPS[weakestIdx].zh}`
              }
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-black text-emerald-600">{winRate}%</div>
            <div className="text-[10px] text-emerald-500 font-bold">{lang === 'en' ? 'Win Rate' : '胜率'}</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-black text-indigo-600">{battles.length}</div>
            <div className="text-[10px] text-indigo-500 font-bold">{lang === 'en' ? 'Battles' : '总对局'}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5 text-center">
            <div className="text-lg font-black text-amber-600">{kpRecords.filter(k => k.mastered_at).length}</div>
            <div className="text-[10px] text-amber-500 font-bold">{lang === 'en' ? 'KPs Mastered' : 'KP 已掌握'}</div>
          </div>
        </div>

        {/* Error Patterns */}
        {errorSummary.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={14} className="text-rose-400" />
              <span className="text-xs font-bold text-slate-600">{lang === 'en' ? 'Error Patterns' : '错题模式'}</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {errorSummary.slice(0, 5).map(e => {
                const label = ERROR_TYPE_LABELS[e.type];
                const maxCount = errorSummary[0]?.count || 1;
                return (
                  <div key={e.type} className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1">
                    <div className="h-1.5 rounded-full bg-rose-400" style={{ width: `${Math.max(16, (e.count / maxCount) * 48)}px` }} />
                    <span className="text-[10px] font-bold text-rose-600">
                      {label ? (lang === 'en' ? label.en : label.zh) : e.type}
                    </span>
                    <span className="text-[9px] text-rose-400">{e.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Assignments */}
        {assignments.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <ClipboardList size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-600">{lang === 'en' ? 'Active Assignments' : '当前任务'}</span>
            </div>
            <div className="space-y-1.5">
              {assignments.map(a => {
                const allDone = a.missionsDone === a.missionsTotal;
                const deadlineDays = a.deadline ? Math.ceil((new Date(a.deadline).getTime() - Date.now()) / 86400000) : null;
                return (
                  <div key={a.id} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] ${allDone ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'}`}>
                    <span className={`font-bold flex-1 truncate ${allDone ? 'text-emerald-700' : 'text-indigo-700'}`}>{a.title}</span>
                    <span className={`font-bold ${allDone ? 'text-emerald-500' : 'text-indigo-500'}`}>{a.missionsDone}/{a.missionsTotal}</span>
                    {deadlineDays !== null && !allDone && (
                      <span className={`flex items-center gap-0.5 ${deadlineDays <= 1 ? 'text-rose-500' : 'text-slate-400'}`}>
                        <Clock size={9} />
                        {deadlineDays <= 0 ? (lang === 'en' ? 'overdue' : '逾期') : `${deadlineDays}d`}
                      </span>
                    )}
                    {allDone && <span className="text-emerald-500">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Battles */}
        {recentBattles.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart3 size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-600">{lang === 'en' ? 'Recent Battles' : '近期战绩'}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {recentBattles.map((b, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold ${
                    b.success
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-rose-100 text-rose-500'
                  }`}
                  title={`Mission ${b.mission_id}: ${b.success ? 'Win' : 'Loss'} (${b.score}pts, ${b.duration_secs}s)`}
                >
                  {b.success ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
