/**
 * ExamHubBridge — Cross-platform vocab mastery view (Phase D3, v8.3)
 * Shows ExamHub vocabulary mastery data in Play teacher dashboard.
 * Reads from shared Supabase `leaderboard` table (teacher-readable via RLS).
 */
import { useEffect, useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow } from './types';
import { supabase } from '../../supabase';

type LeaderboardEntry = {
  user_id: string;
  mastery_pct: number;
  mastered_words: number;
  total_words: number;
  score: number;
};

type Props = {
  lang: Language;
  students: StudentRow[];
};

export function ExamHubBridge({ lang, students }: Props) {
  const [vocabData, setVocabData] = useState<Map<string, LeaderboardEntry>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (students.length === 0) return;
    setLoading(true);
    setError(false);

    const userIds = students.map(s => s.user_id);

    supabase
      .from('leaderboard')
      .select('user_id, mastery_pct, mastered_words, total_words, score')
      .in('user_id', userIds)
      .then(({ data, error: err }) => {
        if (err) {
          setError(true);
          setLoading(false);
          return;
        }
        const map = new Map<string, LeaderboardEntry>();
        if (data) {
          for (const row of data as LeaderboardEntry[]) {
            map.set(row.user_id, row);
          }
        }
        setVocabData(map);
        setLoading(false);
      });
  }, [students]);

  // Only show if we have any matching data
  const matchedStudents = students.filter(s => vocabData.has(s.user_id));
  const hasData = matchedStudents.length > 0;

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <BookOpen size={14} className="animate-pulse" />
          {lang === 'en' ? 'Loading ExamHub data...' : '加载 ExamHub 数据...'}
        </div>
      </div>
    );
  }

  if (error || !hasData) {
    return (
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <BookOpen size={14} />
            <span className="font-bold">ExamHub</span>
            <span>— {lang === 'en' ? 'No vocab data for these students' : '这些学生暂无词汇数据'}</span>
          </div>
          <a
            href="https://examhub.25maths.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-indigo-400 hover:text-indigo-600 flex items-center gap-1"
          >
            ExamHub <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  // Compute class averages
  const avgMastery = Math.round(matchedStudents.reduce((sum, s) => sum + (vocabData.get(s.user_id)?.mastery_pct ?? 0), 0) / matchedStudents.length);
  const avgWords = Math.round(matchedStudents.reduce((sum, s) => sum + (vocabData.get(s.user_id)?.mastered_words ?? 0), 0) / matchedStudents.length);

  // Sort students by mastery ascending (weakest first)
  const sorted = [...matchedStudents].sort((a, b) => {
    const aMastery = vocabData.get(a.user_id)?.mastery_pct ?? 0;
    const bMastery = vocabData.get(b.user_id)?.mastery_pct ?? 0;
    return aMastery - bMastery;
  });

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-purple-500" />
          <span className="text-sm font-black text-slate-700">
            ExamHub {lang === 'en' ? 'Vocab Mastery' : '词汇掌握率'}
          </span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-black rounded-full">
            {matchedStudents.length}/{students.length}
          </span>
        </div>
        <a
          href="https://examhub.25maths.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-indigo-400 hover:text-indigo-600 flex items-center gap-1 font-bold"
        >
          {lang === 'en' ? 'Open ExamHub' : '打开 ExamHub'} <ExternalLink size={10} />
        </a>
      </div>

      {/* Class average summary */}
      <div className="px-4 py-3 flex items-center gap-6 bg-purple-50/50 border-b border-slate-100">
        <div className="text-center">
          <div className="text-lg font-black text-purple-600">{avgMastery}%</div>
          <div className="text-[10px] text-slate-400 font-bold">{lang === 'en' ? 'Avg Mastery' : '平均掌握率'}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black text-purple-600">{avgWords}</div>
          <div className="text-[10px] text-slate-400 font-bold">{lang === 'en' ? 'Avg Words' : '平均词汇量'}</div>
        </div>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${avgMastery}%` }}
          />
        </div>
      </div>

      {/* Per-student list */}
      <div className="max-h-48 overflow-y-auto">
        {sorted.map(s => {
          const v = vocabData.get(s.user_id)!;
          const masteryColor = v.mastery_pct >= 80 ? 'text-emerald-600' : v.mastery_pct >= 50 ? 'text-amber-600' : 'text-rose-600';
          const barColor = v.mastery_pct >= 80 ? 'bg-emerald-500' : v.mastery_pct >= 50 ? 'bg-amber-400' : 'bg-rose-400';

          return (
            <div key={s.user_id} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
              <span className="text-[11px] text-slate-600 font-bold w-24 truncate">{s.display_name || 'Anonymous'}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${v.mastery_pct}%` }} />
              </div>
              <span className={`text-[11px] font-black w-10 text-right ${masteryColor}`}>{v.mastery_pct}%</span>
              <span className="text-[10px] text-slate-400 w-16 text-right">{v.mastered_words}/{v.total_words}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
