/**
 * ProgressReport — A simple, shareable weekly learning summary.
 * Designed for parents: clear, concise, no jargon.
 * Shows: sessions, missions completed, accuracy, weak spots, encouragement.
 */
import { useMemo } from 'react';
import type { Language, CompletedMissions } from '../types';

type Props = {
  lang: Language;
  displayName: string;
  grade: number;
  totalScore: number;
  completedMissions: CompletedMissions;
  battleResults?: { mission_id: number; success: boolean; score: number; created_at: string }[];
  onClose: () => void;
};

export function ProgressReport({ lang, displayName, grade, totalScore, completedMissions, battleResults = [], onClose }: Props) {
  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Count completed missions (any phase)
    const missionIds = Object.keys(completedMissions).filter(k => !k.startsWith('_'));
    const totalMissions = missionIds.length;

    // This week's battles
    const weekBattles = battleResults.filter(b => new Date(b.created_at).getTime() > weekAgo);
    const weekAttempts = weekBattles.length;
    const weekCorrect = weekBattles.filter(b => b.success).length;
    const weekAccuracy = weekAttempts > 0 ? Math.round((weekCorrect / weekAttempts) * 100) : 0;
    const weekScore = weekBattles.reduce((sum, b) => sum + (b.score || 0), 0);

    // Sessions (unique dates)
    const weekDates = new Set(weekBattles.map(b => new Date(b.created_at).toDateString()));
    const sessions = weekDates.size;

    return { totalMissions, weekAttempts, weekCorrect, weekAccuracy, weekScore, sessions };
  }, [completedMissions, battleResults]);

  const en = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-black text-slate-800">
            {en ? 'Weekly Learning Report' : '本周学习报告'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {displayName} · Y{grade} · {new Date().toLocaleDateString(en ? 'en-GB' : 'zh-CN')}
          </p>
        </div>

        <div className="h-px bg-slate-200" />

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-2xl font-black text-blue-600">{stats.sessions}</div>
            <div className="text-[10px] text-blue-500 font-bold">{en ? 'Sessions' : '学习次数'}</div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-black text-emerald-600">{stats.weekAttempts}</div>
            <div className="text-[10px] text-emerald-500 font-bold">{en ? 'Questions' : '答题数'}</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <div className="text-2xl font-black text-amber-600">{stats.weekAccuracy}%</div>
            <div className="text-[10px] text-amber-500 font-bold">{en ? 'Accuracy' : '正确率'}</div>
          </div>
        </div>

        {/* Progress summary */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">{en ? 'Total missions mastered' : '已掌握关卡'}</span>
            <span className="font-black text-slate-800">{stats.totalMissions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">{en ? 'Total score' : '总积分'}</span>
            <span className="font-black text-slate-800">{totalScore.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">{en ? 'This week\'s score' : '本周得分'}</span>
            <span className="font-black text-indigo-600">+{stats.weekScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Encouragement message — based on data */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-indigo-800 leading-relaxed">
            {stats.weekAttempts === 0
              ? (en
                ? `${displayName} hasn't practised this week yet. Even 10 minutes can make a difference!`
                : `${displayName} 本周还没有练习。哪怕 10 分钟也会有收获！`)
              : stats.weekAccuracy >= 80
              ? (en
                ? `${displayName} is doing great — ${stats.weekAccuracy}% accuracy this week! Keep up the momentum.`
                : `${displayName} 表现优秀——本周正确率 ${stats.weekAccuracy}%！保持这个势头。`)
              : stats.weekAccuracy >= 50
              ? (en
                ? `${displayName} is making progress — ${stats.weekAttempts} questions attempted. Encourage them to review mistakes.`
                : `${displayName} 在进步——本周完成了 ${stats.weekAttempts} 道题。建议鼓励他/她复习做错的题。`)
              : (en
                ? `${displayName} is working hard — ${stats.weekAttempts} attempts this week. Some topics may need extra help from a teacher or tutor.`
                : `${displayName} 很努力——本周做了 ${stats.weekAttempts} 道题。部分知识点可能需要老师或家长额外辅导。`)}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm"
        >
          {en ? 'Close' : '关闭'}
        </button>
      </div>
    </div>
  );
}
