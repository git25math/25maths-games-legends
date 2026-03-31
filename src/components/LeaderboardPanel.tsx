import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, X, RefreshCw, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase';
import { getLevelInfo } from '../utils/xpLevels';
import { CharacterAvatar } from './CharacterAvatar';
import type { Language } from '../types';
import { useEscapeKey } from '../hooks/useEscapeKey';

type LeaderEntry = {
  user_id: string;
  display_name: string;
  total_score: number;
  selected_char_id: string;
};

type WeeklyEntry = LeaderEntry & { weeklyXP: number };

type TabId = 'class' | 'grade' | 'school' | 'weekly';

const MEDAL = ['🥇', '🥈', '🥉'];

const TAB_LABELS: Record<TabId, { zh: string; zh_TW: string; en: string }> = {
  class: { zh: '我的班', zh_TW: '我的班', en: 'My Class' },
  grade: { zh: '年级', zh_TW: '年級', en: 'Grade' },
  school: { zh: '全校', zh_TW: '全校', en: 'School' },
  weekly: { zh: '本周', zh_TW: '本週', en: 'Weekly' },
};

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  // Use local midnight (consistent with seasonTracker's thisMonday)
  const mon = new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0);
  return mon.toISOString();
}

export const LeaderboardPanel = ({
  lang,
  grade,
  currentUserId,
  classTags,
  isAdmin,
  onClose,
}: {
  lang: Language;
  grade: number;
  currentUserId: string;
  classTags?: string[];
  isAdmin?: boolean;
  onClose: () => void;
}) => {
  useEscapeKey(onClose);
  const hasClass = classTags && classTags.length > 0;
  const availableTabs: TabId[] = (hasClass || isAdmin)
    ? ['class', 'grade', 'school', 'weekly']
    : ['grade', 'weekly'];
  const [tab, setTab] = useState<TabId>(hasClass ? 'class' : 'grade');
  const [gradeEntries, setGradeEntries] = useState<LeaderEntry[]>([]);
  const [classEntries, setClassEntries] = useState<LeaderEntry[]>([]);
  const [schoolEntries, setSchoolEntries] = useState<LeaderEntry[]>([]);
  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGrade = () => {
    return supabase
      .rpc('get_grade_leaderboard', { p_grade: grade, p_limit: 20 })
      .then(({ data, error: err }) => {
        if (err) throw err;
        setGradeEntries((data as LeaderEntry[]) ?? []);
      });
  };

  const fetchClass = () => {
    if (!hasClass) return Promise.resolve();
    return supabase
      .rpc('get_class_leaderboard', { p_class_tag: classTags![0], p_limit: 50 })
      .then(({ data, error: err }) => {
        if (err) throw err;
        setClassEntries((data as LeaderEntry[]) ?? []);
      });
  };

  const fetchSchool = () => {
    return supabase
      .rpc('get_school_leaderboard', { p_limit: 50 })
      .then(({ data, error: err }) => {
        if (err) throw err;
        setSchoolEntries((data as LeaderEntry[]) ?? []);
      });
  };

  const fetchWeekly = () => {
    const mondayISO = getMondayISO();
    // Fetch this week's battles + grade user list via RPC, aggregate client-side
    return Promise.all([
      supabase
        .from('gl_battle_results')
        .select('user_id, score')
        .eq('success', true)
        .gte('created_at', mondayISO),
      supabase
        .rpc('get_grade_leaderboard', { p_grade: grade, p_limit: 100 }),
    ]).then(([battleRes, userRes]) => {
      if (battleRes.error) throw battleRes.error;
      if (userRes.error) throw userRes.error;
      const userMap = new Map((userRes.data as LeaderEntry[]).map(u => [u.user_id, u]));
      const xpMap = new Map<string, number>();
      for (const row of (battleRes.data ?? []) as { user_id: string; score: number }[]) {
        if (userMap.has(row.user_id)) {
          xpMap.set(row.user_id, (xpMap.get(row.user_id) ?? 0) + row.score);
        }
      }
      const weekly: WeeklyEntry[] = [];
      for (const [uid, xp] of xpMap.entries()) {
        const user = userMap.get(uid);
        if (user && xp > 0) weekly.push({ ...user, weeklyXP: xp });
      }
      weekly.sort((a, b) => b.weeklyXP - a.weeklyXP);
      setWeeklyEntries(weekly.slice(0, 20));
    });
  };

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    Promise.all([fetchGrade(), fetchClass(), fetchSchool(), fetchWeekly()])
      .then(() => { if (mountedRef.current) setLoading(false); })
      .catch(() => { if (mountedRef.current) { setError(true); setLoading(false); } });
  };

  useEffect(fetchData, [grade]);

  const entries = tab === 'class' ? classEntries : tab === 'school' ? schoolEntries : tab === 'weekly' ? [] : gradeEntries;
  const isWeekly = tab === 'weekly';
  const myRank = entries.findIndex(e => e.user_id === currentUserId) + 1;
  const myWeeklyRank = weeklyEntries.findIndex(e => e.user_id === currentUserId) + 1;
  const displayRank = isWeekly ? myWeeklyRank : myRank;

  const title = tab === 'class' && hasClass
    ? (lang === 'en' ? `${classTags![0]} Leaderboard` : `${classTags![0]} 排行榜`)
    : tab === 'school'
    ? (lang === 'en' ? 'School Top 50' : '全校前 50')
    : tab === 'weekly'
    ? (lang === 'en' ? 'Weekly Progress' : '本周进步')
    : (lang === 'en' ? `Year ${grade} Leaderboard` : `${grade} 年级排行榜`);

  const renderEntry = (entry: LeaderEntry, idx: number, weeklyXP?: number) => {
    const isMe = entry.user_id === currentUserId;
    const levelInfo = getLevelInfo(entry.total_score);
    const rankName = lang === 'en' ? levelInfo.rank.en : lang === 'zh_TW' ? levelInfo.rank.zh_TW : levelInfo.rank.zh;
    return (
      <motion.div
        key={entry.user_id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
          isMe ? 'bg-indigo-500/20 border-indigo-400/40' : 'bg-white/5 border-white/5'
        }`}
      >
        <span className="w-7 text-center font-black text-sm shrink-0">
          {idx < 3 ? MEDAL[idx] : <span className="text-white/40">#{idx + 1}</span>}
        </span>
        <CharacterAvatar characterId={entry.selected_char_id || ''} size={32} />
        <div className="flex-1 min-w-0">
          <p className={`font-black text-sm truncate ${isMe ? 'text-indigo-300' : 'text-white'}`}>
            {entry.display_name}{isMe && (lang === 'en' ? ' (You)' : ' (我)')}
          </p>
          <p className="text-white/30 text-[10px]">Lv.{levelInfo.level} · {rankName}</p>
        </div>
        <span className={`font-black text-sm shrink-0 ${weeklyXP !== undefined ? 'text-emerald-400' : 'text-yellow-400'}`}>
          {weeklyXP !== undefined ? `+${weeklyXP.toLocaleString()}` : entry.total_score.toLocaleString()}
        </span>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-sm w-full max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" />
            <h2 className="text-lg font-black text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-3 shrink-0">
          {availableTabs.map(t => {
            const label = TAB_LABELS[t][lang === 'zh_TW' ? 'zh_TW' : lang === 'en' ? 'en' : 'zh'];
            const Icon = t === 'class' ? Users : t === 'weekly' ? TrendingUp : Trophy;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-black transition-colors min-h-[36px] ${
                  tab === t ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30' : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10'
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            );
          })}
        </div>

        {displayRank > 0 && (
          <div className="mb-3 px-3 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-center shrink-0">
            <span className="text-indigo-300 text-xs font-black">
              {lang === 'en' ? `Your rank: #${displayRank}` : `我的排名：第 ${displayRank} 名`}
            </span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {loading ? (
            <div className="text-white/30 text-center py-12 text-sm">
              {lang === 'en' ? 'Loading...' : '加载中...'}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-rose-400/60 text-sm mb-3">{lang === 'en' ? 'Failed to load' : '加载失败'}</p>
              <button onClick={fetchData} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white/60 text-xs font-bold hover:bg-white/20 transition-colors">
                <RefreshCw size={12} /> {lang === 'en' ? 'Retry' : '重试'}
              </button>
            </div>
          ) : isWeekly ? (
            weeklyEntries.length === 0 ? (
              <div className="text-white/30 text-center py-12 text-sm">
                {lang === 'en' ? 'No battles this week yet' : '本周还没有闯关记录'}
              </div>
            ) : weeklyEntries.map((entry, idx) => renderEntry(entry, idx, entry.weeklyXP))
          ) : entries.length === 0 ? (
            <div className="text-white/30 text-center py-12 text-sm">
              {lang === 'en' ? 'No data yet' : '暂无数据'}
            </div>
          ) : entries.map((entry, idx) => renderEntry(entry, idx))}
        </div>
      </motion.div>
    </motion.div>
  );
};
