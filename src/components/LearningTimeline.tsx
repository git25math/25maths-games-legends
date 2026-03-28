/**
 * LearningTimeline — 每个学生独一无二的成长轨迹时间线
 * 几月几号，完成了什么，正确率多少，获得了什么
 * Data: gl_battle_results (Supabase) + completed_missions (localStorage)
 */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Star, Heart, Zap, Target, ChevronDown, ChevronUp, Sparkles, X, CheckCircle2, XCircle } from 'lucide-react';
import type { Language, UserProfile } from '../types';
import { MISSIONS } from '../data/missions';
import { lt } from '../i18n/resolveText';
import { getLevelInfo } from '../utils/xpLevels';
import { supabase } from '../supabase';

// ── Types ──

type TimelineEntry = {
  date: string;           // YYYY-MM-DD
  timestamp: number;      // epoch ms
  type: 'battle' | 'milestone' | 'streak' | 'level';
  success: boolean;
  missionId: number;
  missionTitle: { zh: string; en: string };
  score: number;
  duration: number;       // seconds
  difficulty: string;
  accuracy?: string;      // e.g., "4/5"
  reward?: string;        // e.g., "+150 XP"
  soulMessage?: { zh: string; en: string };
};

type Props = {
  lang: Language;
  profile: UserProfile;
  onClose: () => void;
};

// ── Mission name cache ──
const missionNameMap = new Map<number, { zh: string; en: string }>();
for (const m of MISSIONS) missionNameMap.set(m.id, m.title);

// ── Soul messages for different achievement types ──
const SOUL_VICTORY: { zh: string; en: string }[] = [
  { zh: '每一次胜利都是你应得的。', en: 'Every victory is yours to keep.' },
  { zh: '你做到了——这不是运气。', en: 'You did it — this isn\'t luck.' },
  { zh: '记住这个时刻。', en: 'Remember this moment.' },
];
const SOUL_DEFEAT: { zh: string; en: string }[] = [
  { zh: '跌倒了？这说明你在往前走。', en: 'Fell down? That means you were moving forward.' },
  { zh: '每个高手的履历上都有这一笔。', en: 'Every master has this on their résumé.' },
];
const SOUL_STREAK: { zh: string; en: string }[] = [
  { zh: '坚持就是超能力。', en: 'Consistency is your superpower.' },
  { zh: '习惯的力量比天赋更持久。', en: 'The power of habit outlasts talent.' },
];

export function LearningTimeline({ lang, profile, onClose }: Props) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch battle history from Supabase
  useEffect(() => {
    if (profile.user_id === 'guest') { setLoading(false); return; }
    supabase
      .from('gl_battle_results')
      .select('mission_id, success, score, duration_secs, difficulty_mode, hp_remaining, created_at')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (!data) { setLoading(false); return; }
        const mapped: TimelineEntry[] = (data as any[]).map((b, i) => {
          const title = missionNameMap.get(b.mission_id) ?? { zh: `关卡 #${b.mission_id}`, en: `Mission #${b.mission_id}` };
          const soul = b.success
            ? SOUL_VICTORY[i % SOUL_VICTORY.length]
            : SOUL_DEFEAT[i % SOUL_DEFEAT.length];
          return {
            date: b.created_at.slice(0, 10),
            timestamp: new Date(b.created_at).getTime(),
            type: 'battle' as const,
            success: b.success,
            missionId: b.mission_id,
            missionTitle: title,
            score: b.score ?? 0,
            duration: b.duration_secs ?? 0,
            difficulty: b.difficulty_mode ?? 'green',
            accuracy: b.hp_remaining !== null ? `HP ${b.hp_remaining}` : undefined,
            reward: b.success ? `+${b.score} XP` : undefined,
            soulMessage: soul,
          };
        });
        setEntries(mapped);
        setLoading(false);
      });
  }, [profile.user_id]);

  // Add local milestones (streaks, level)
  const allEntries = useMemo(() => {
    const extras: TimelineEntry[] = [];
    const cm = profile.completed_missions as any;

    // Login streak milestones
    const milestones = cm?._streak_milestones as { day: number; claimed: boolean; claimedAt?: string }[] | undefined;
    if (milestones) {
      for (const m of milestones) {
        if (m.claimed && m.claimedAt) {
          extras.push({
            date: m.claimedAt.slice(0, 10),
            timestamp: new Date(m.claimedAt).getTime(),
            type: 'streak', success: true, missionId: 0,
            missionTitle: { zh: `连续登录 ${m.day} 天`, en: `${m.day}-day login streak` },
            score: 0, duration: 0, difficulty: '',
            reward: lang === 'en' ? 'Streak bonus' : '连签奖励',
            soulMessage: SOUL_STREAK[m.day % SOUL_STREAK.length],
          });
        }
      }
    }

    // Current level
    const lvl = getLevelInfo(profile.total_score);
    if (lvl.level > 1) {
      extras.push({
        date: new Date().toISOString().slice(0, 10),
        timestamp: Date.now(),
        type: 'level', success: true, missionId: 0,
        missionTitle: { zh: `达到等级 ${lvl.level}`, en: `Reached Level ${lvl.level}` },
        score: profile.total_score, duration: 0, difficulty: '',
        reward: `${profile.total_score} XP`,
        soulMessage: { zh: '你在成长。数字不会说谎。', en: "You're growing. Numbers don't lie." },
      });
    }

    return [...entries, ...extras].sort((a, b) => b.timestamp - a.timestamp);
  }, [entries, profile]);

  const LIMIT = 20;
  const visible = showAll ? allEntries : allEntries.slice(0, LIMIT);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEntry[]>();
    for (const e of visible) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return [...map.entries()];
  }, [visible]);

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (dateStr === today) return lang === 'en' ? 'Today' : '今天';
    if (dateStr === yesterday) return lang === 'en' ? 'Yesterday' : '昨天';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'zh-CN', { month: 'short', day: 'numeric' });
  };

  const diffColor = (d: string) => d === 'green' ? 'bg-emerald-100 text-emerald-700' : d === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';

  // Stats summary
  const stats = useMemo(() => {
    const battles = allEntries.filter(e => e.type === 'battle');
    const wins = battles.filter(e => e.success).length;
    const totalXP = battles.reduce((s, e) => s + e.score, 0);
    return { total: battles.length, wins, winRate: battles.length > 0 ? Math.round(wins / battles.length * 100) : 0, totalXP };
  }, [allEntries]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-8 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h2 className="text-lg font-black text-slate-800">
              {lang === 'en' ? 'My Learning Journey' : '我的成长轨迹'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        {/* Stats bar */}
        <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-amber-50 border-b border-slate-100">
          <div className="flex gap-3 text-center">
            <div className="flex-1">
              <div className="text-lg font-black text-indigo-600">{stats.total}</div>
              <div className="text-[9px] text-indigo-400 font-bold">{lang === 'en' ? 'Battles' : '对局'}</div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-emerald-600">{stats.winRate}%</div>
              <div className="text-[9px] text-emerald-400 font-bold">{lang === 'en' ? 'Win Rate' : '胜率'}</div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-amber-600">{stats.totalXP}</div>
              <div className="text-[9px] text-amber-400 font-bold">XP</div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-purple-600">{getLevelInfo(profile.total_score).level}</div>
              <div className="text-[9px] text-purple-400 font-bold">{lang === 'en' ? 'Level' : '等级'}</div>
            </div>
          </div>
        </div>

        {/* Timeline entries */}
        <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(85vh - 200px)' }}>
          {loading ? (
            <div className="text-center py-8 animate-pulse">
              <Sparkles size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-300">{lang === 'en' ? 'Loading your journey...' : '加载你的旅程...'}</p>
            </div>
          ) : allEntries.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-bold">
                {lang === 'en' ? 'Your journey is just beginning!' : '你的旅程才刚刚开始！'}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'en' ? 'Complete missions to fill your timeline' : '完成关卡来填满你的时间线'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {grouped.map(([date, evts]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-black text-slate-400">{formatDate(date)}</span>
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] text-slate-300">{evts.length} {lang === 'en' ? 'events' : '条记录'}</span>
                  </div>

                  <div className="space-y-2 pl-1">
                    {evts.map((entry, i) => (
                      <motion.div
                        key={`${date}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex gap-3 items-start"
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          entry.type === 'streak' ? 'bg-orange-100' :
                          entry.type === 'level' ? 'bg-purple-100' :
                          entry.success ? 'bg-emerald-100' : 'bg-rose-100'
                        }`}>
                          {entry.type === 'streak' ? <Flame size={14} className="text-orange-500" /> :
                           entry.type === 'level' ? <Zap size={14} className="text-purple-500" /> :
                           entry.success ? <CheckCircle2 size={14} className="text-emerald-500" /> :
                           <XCircle size={14} className="text-rose-400" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700 truncate">
                              {lang === 'en' ? entry.missionTitle.en : entry.missionTitle.zh}
                            </span>
                            {entry.difficulty && (
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${diffColor(entry.difficulty)}`}>
                                {entry.difficulty.toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Stats row */}
                          <div className="flex items-center gap-3 mt-0.5">
                            {entry.reward && (
                              <span className="text-[10px] font-bold text-amber-500">{entry.reward}</span>
                            )}
                            {entry.duration > 0 && (
                              <span className="text-[10px] text-slate-400">{entry.duration}s</span>
                            )}
                            {entry.accuracy && (
                              <span className="text-[10px] text-slate-400">{entry.accuracy}</span>
                            )}
                          </div>

                          {/* Soul message */}
                          {entry.soulMessage && (
                            <p className="text-[9px] text-slate-300 italic mt-0.5">
                              {lang === 'en' ? entry.soulMessage.en : entry.soulMessage.zh}
                            </p>
                          )}
                        </div>

                        {/* Time */}
                        <span className="text-[9px] text-slate-300 shrink-0 mt-1">
                          {new Date(entry.timestamp).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {allEntries.length > LIMIT && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-xs text-indigo-500 font-bold"
                >
                  {showAll
                    ? <><ChevronUp size={14} /> {lang === 'en' ? 'Show less' : '收起'}</>
                    : <><ChevronDown size={14} /> {lang === 'en' ? `Show all ${allEntries.length}` : `查看全部 ${allEntries.length} 条`}</>
                  }
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
