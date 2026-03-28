import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Zap, Target, TrendingUp, Star, AlertTriangle } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow, UnitEntry } from './types';
import { countGreenMissions } from './types';
import { supabase } from '../../supabase';

type BattleStat = {
  user_id: string;
  display_name: string;
  battles: number;
  wins: number;
  total_score: number;
  avg_duration: number;
};

export const ClassOverview = ({
  lang,
  grade,
  filterTag,
  students,
  units,
  totalMissions,
}: {
  lang: Language;
  grade: number;
  filterTag: string;
  students: StudentRow[];
  units: UnitEntry[];
  totalMissions: number;
}) => {
  const [battleStats, setBattleStats] = useState<BattleStat[]>([]);

  useEffect(() => {
    setBattleStats([]); // clear stale data on filter change
    supabase.rpc('get_class_battle_stats', {
      p_grade: grade,
      p_class: filterTag || null,
    }).then(({ data, error }) => {
      if (!error && data) setBattleStats(data as BattleStat[]);
    }, () => { setBattleStats([]); });
  }, [grade, filterTag]);

  // Compute stats
  const avgScore = students.length > 0
    ? Math.round(students.reduce((s, st) => s + (st.total_score || 0), 0) / students.length)
    : 0;

  const avgProgress = useMemo(() => {
    if (students.length === 0 || totalMissions === 0) return 0;
    const total = students.reduce((sum, s) => sum + countGreenMissions(s.completed_missions, units) / totalMissions, 0);
    return Math.round((total / students.length) * 100);
  }, [students, units, totalMissions]);

  // Active in last 7 days (from battle stats)
  const activeCount = battleStats.filter(b => b.battles > 0).length;

  // Total weekly battles
  const weeklyBattles = battleStats.reduce((s, b) => s + b.battles, 0);

  const cards = [
    {
      icon: Users,
      label: lang === 'en' ? 'Students' : '学生',
      value: String(students.length),
      sub: `${activeCount} ${lang === 'en' ? 'played this week' : '人本周参与'}`,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Target,
      label: lang === 'en' ? 'Avg Progress' : '平均进度',
      value: `${avgProgress}%`,
      sub: `${totalMissions} ${lang === 'en' ? 'missions' : '关卡'}`,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconColor: 'text-emerald-400',
    },
    {
      icon: TrendingUp,
      label: lang === 'en' ? 'Avg Score' : '平均分',
      value: String(avgScore),
      sub: lang === 'en' ? 'total XP' : '总功勋',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      iconColor: 'text-amber-400',
    },
    {
      icon: Zap,
      label: lang === 'en' ? 'Weekly Battles' : '本周对局',
      value: String(weeklyBattles),
      sub: `${lang === 'en' ? 'last 7 days' : '近 7 天'}`,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      iconColor: 'text-rose-400',
    },
  ];

  // Top performer (highest score) and needs help (lowest progress)
  const topPerformer = useMemo(() => {
    if (battleStats.length === 0) return null;
    const best = [...battleStats].sort((a, b) => b.total_score - a.total_score)[0];
    return best?.display_name || null;
  }, [battleStats]);

  const needsHelp = useMemo(() => {
    if (students.length === 0 || totalMissions === 0) return null;
    let worst: StudentRow | null = null;
    let worstPct = 1;
    for (const s of students) {
      const pct = countGreenMissions(s.completed_missions, units) / totalMissions;
      if (pct < worstPct) { worstPct = pct; worst = s; }
    }
    return worst?.display_name || null;
  }, [students, units, totalMissions]);

  return (
    <div className="mb-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border p-3 ${c.color}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={c.iconColor} />
                <span className="text-[10px] font-bold opacity-70">{c.label}</span>
              </div>
              <div className="text-xl font-black">{c.value}</div>
              <div className="text-[10px] opacity-50 font-bold">{c.sub}</div>
            </motion.div>
          );
        })}
      </div>
      {/* Quick glance: top + needs help */}
      {(topPerformer || needsHelp) && (
        <div className="flex flex-wrap gap-3 px-1">
          {topPerformer && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
              <Star size={12} className="text-amber-400" />
              {lang === 'en' ? 'Top performer:' : '本周之星:'} {topPerformer}
            </span>
          )}
          {needsHelp && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500">
              <AlertTriangle size={12} className="text-rose-400" />
              {lang === 'en' ? 'Needs support:' : '最需关注:'} {needsHelp}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
