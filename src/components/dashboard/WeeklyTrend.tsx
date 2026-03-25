import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Language } from '../../types';
import { supabase } from '../../supabase';

type WeekStat = {
  user_id: string;
  battles: number;
  wins: number;
  total_score: number;
};

type WeekSummary = {
  battles: number;
  wins: number;
  xp: number;
  activeStudents: number;
};

function summarize(data: WeekStat[]): WeekSummary {
  return {
    battles: data.reduce((s, d) => s + d.battles, 0),
    wins: data.reduce((s, d) => s + d.wins, 0),
    xp: data.reduce((s, d) => s + d.total_score, 0),
    activeStudents: data.filter(d => d.battles > 0).length,
  };
}

function TrendBadge({ current, previous, lang }: { current: number; previous: number; lang: Language }) {
  if (previous === 0 && current === 0) return null;
  const pct = previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  if (pct === 0) return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
      <Minus size={10} /> {lang === 'en' ? 'same' : '持平'}
    </span>
  );
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {up ? '+' : ''}{pct}%
    </span>
  );
}

/** Simple SVG bar comparison chart */
function CompareBar({ label, thisWeek, lastWeek, color }: { label: string; thisWeek: number; lastWeek: number; color: string }) {
  const max = Math.max(thisWeek, lastWeek, 1);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-slate-500 w-14 text-right shrink-0">{label}</span>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <div className={`h-3 rounded-sm ${color}`} style={{ width: `${(thisWeek / max) * 100}%`, minWidth: thisWeek > 0 ? 4 : 0 }} />
          <span className="text-[9px] font-bold text-slate-600">{thisWeek}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 rounded-sm bg-slate-200" style={{ width: `${(lastWeek / max) * 100}%`, minWidth: lastWeek > 0 ? 4 : 0 }} />
          <span className="text-[9px] font-bold text-slate-400">{lastWeek}</span>
        </div>
      </div>
    </div>
  );
}

export const WeeklyTrend = ({
  lang,
  grade,
  filterTag,
}: {
  lang: Language;
  grade: number;
  filterTag: string;
}) => {
  const [thisWeek, setThisWeek] = useState<WeekSummary>({ battles: 0, wins: 0, xp: 0, activeStudents: 0 });
  const [lastWeek, setLastWeek] = useState<WeekSummary>({ battles: 0, wins: 0, xp: 0, activeStudents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    thisMonday.setHours(0, 0, 0, 0);

    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(lastMonday.getDate() - 7);

    Promise.all([
      supabase.rpc('get_class_battle_stats', {
        p_grade: grade,
        p_class: filterTag || null,
        p_since: thisMonday.toISOString(),
      }),
      supabase.rpc('get_class_battle_stats', {
        p_grade: grade,
        p_class: filterTag || null,
        p_since: lastMonday.toISOString(),
      }),
    ]).then(([thisRes, bothRes]) => {
      const thisData = (thisRes.data as WeekStat[]) || [];
      const bothData = (bothRes.data as WeekStat[]) || [];

      // "both" includes this week + last week. Subtract this week to get last week only.
      const thisIds = new Set(thisData.map(d => d.user_id));
      const lastOnly: WeekStat[] = [];
      for (const d of bothData) {
        const thisEntry = thisData.find(t => t.user_id === d.user_id);
        if (thisEntry) {
          lastOnly.push({
            user_id: d.user_id,
            battles: d.battles - thisEntry.battles,
            wins: d.wins - thisEntry.wins,
            total_score: d.total_score - thisEntry.total_score,
          });
        } else {
          lastOnly.push(d);
        }
      }

      setThisWeek(summarize(thisData));
      setLastWeek(summarize(lastOnly));
      setLoading(false);
    });
  }, [grade, filterTag]);

  if (loading) return null;
  if (thisWeek.battles === 0 && lastWeek.battles === 0) return null;

  return (
    <div className="mb-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-500" />
          <span className="text-xs font-black text-slate-700">
            {lang === 'en' ? 'Weekly Comparison' : '周报对比'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-indigo-400 inline-block" /> {lang === 'en' ? 'This week' : '本周'}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-slate-200 inline-block" /> {lang === 'en' ? 'Last week' : '上周'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <CompareBar label={lang === 'en' ? 'Battles' : '对局'} thisWeek={thisWeek.battles} lastWeek={lastWeek.battles} color="bg-indigo-400" />
          <CompareBar label={lang === 'en' ? 'Wins' : '胜利'} thisWeek={thisWeek.wins} lastWeek={lastWeek.wins} color="bg-emerald-400" />
        </div>
        <div className="space-y-2">
          <CompareBar label="XP" thisWeek={thisWeek.xp} lastWeek={lastWeek.xp} color="bg-amber-400" />
          <CompareBar label={lang === 'en' ? 'Active' : '活跃'} thisWeek={thisWeek.activeStudents} lastWeek={lastWeek.activeStudents} color="bg-rose-400" />
        </div>
      </div>

      {/* Trend badges */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-bold">{lang === 'en' ? 'Battles' : '对局'}</span>
          <TrendBadge current={thisWeek.battles} previous={lastWeek.battles} lang={lang} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-bold">XP</span>
          <TrendBadge current={thisWeek.xp} previous={lastWeek.xp} lang={lang} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-bold">{lang === 'en' ? 'Active' : '活跃'}</span>
          <TrendBadge current={thisWeek.activeStudents} previous={lastWeek.activeStudents} lang={lang} />
        </div>
      </div>
    </div>
  );
};
