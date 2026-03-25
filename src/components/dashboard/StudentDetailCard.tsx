import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, AlertTriangle, BarChart3 } from 'lucide-react';
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

  // 3. Activity (battles in last 7 days)
  const weekAgo = Date.now() - 7 * 86400000;
  const recentBattles = battles.filter(b => new Date(b.created_at).getTime() > weekAgo).length;
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
  const weekBattles = battles.filter(b => new Date(b.created_at).getTime() > weekAgo && b.success);
  const weekXP = weekBattles.reduce((sum, b) => sum + b.score, 0);
  const growth = Math.min(weekXP / 500, 1); // 500 XP/week = 100%

  return [progress, mastery, activity, errorControl, streak, balance, growth];
}

export const StudentDetailCard = ({
  lang,
  student,
  units,
  totalMissions,
  onClose,
}: {
  lang: Language;
  student: StudentRow;
  units: UnitEntry[];
  totalMissions: number;
  onClose: () => void;
}) => {
  useEscapeKey(onClose);
  const [battles, setBattles] = useState<BattleRecord[]>([]);
  const [kpRecords, setKpRecords] = useState<KPRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch battle history + KP records
  // NOTE: gl_battle_results RLS policy only allows user to see own data.
  // Teacher sees empty battles unless RLS is updated or an RPC with SECURITY DEFINER is added.
  // play_kp_progress has the same limitation. Radar degrades gracefully with zeros.
  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase
        .from('gl_battle_results')
        .select('mission_id, success, score, duration_secs, created_at')
        .eq('user_id', student.user_id)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('play_kp_progress')
        .select('kp_id, wins, attempts, mastered_at')
        .eq('user_id', student.user_id),
    ]).then(([battleRes, kpRes]) => {
      setBattles((battleRes.data as BattleRecord[]) || []);
      setKpRecords((kpRes.data as KPRecord[]) || []);
      setLoading(false);
    });
  }, [student.user_id]);

  const dims = compute7Dimensions(student, units, totalMissions, battles, kpRecords);

  const radarLabels = lang === 'en'
    ? ['Progress', 'Mastery', 'Activity', 'Accuracy', 'Streak', 'Balance', 'Growth']
    : ['进度', '掌握', '活跃', '正确率', '坚持', '均衡', '成长'];

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
        <div className="bg-slate-50 rounded-2xl p-3 mb-4">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-slate-300 text-sm">{lang === 'en' ? 'Loading...' : '加载中...'}</div>
          ) : (
            <RadarChart values={dims} labels={radarLabels} />
          )}
        </div>

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
