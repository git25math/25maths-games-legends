/**
 * SmartSuggestions — 3 actionable tips for the teacher based on class data.
 * Placed after DailySummary at top of dashboard.
 */
import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow } from './types';
import type { StudentAlert } from './types';
import { toTraditional } from '../../i18n/zhHantMap';

type Props = {
  lang: Language;
  students: StudentRow[];
  alerts: StudentAlert[];
  weakestKP?: { kpId: string; failureRate: number; count: number };
};

type Suggestion = { icon: string; text: string; priority: number };

export function SmartSuggestions({ lang, students, alerts, weakestKP }: Props) {
  const txt = (zh: string, en: string) => lang === 'en' ? en : lang === 'zh_TW' ? toTraditional(zh) : zh;

  const suggestions = useMemo(() => {
    const tips: Suggestion[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // 1. Inactive students
    const inactive = students.filter(s => {
      const cm = s.completed_missions as Record<string, any> | null;
      const login = (cm as any)?._login as { lastDate?: string } | undefined;
      const last = login?.lastDate ? new Date(login.lastDate).getTime() : 0;
      return now - last > dayMs * 5;
    });
    if (inactive.length > 0) {
      const names = inactive.slice(0, 3).map(s => s.display_name || '?').join('、');
      const more = inactive.length > 3 ? txt(` 等${inactive.length}人`, ` +${inactive.length - 3} more`) : '';
      tips.push({
        icon: '⚠️',
        text: txt(`${names}${more} 已超过 5 天未登录，建议联系了解情况。`, `${names}${more} haven't logged in for 5+ days. Consider reaching out.`),
        priority: 90,
      });
    }

    // 2. Weakest KP
    if (weakestKP && weakestKP.failureRate > 30) {
      tips.push({
        icon: '📊',
        text: txt(`${weakestKP.kpId} 失败率 ${weakestKP.failureRate}%（${weakestKP.count} 人），建议课堂重点讲解。`, `${weakestKP.kpId} has ${weakestKP.failureRate}% failure rate (${weakestKP.count} students). Consider reviewing this topic in class.`),
        priority: 80,
      });
    }

    // 3. Top improver
    const sorted = [...students].sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
    const topStudent = sorted[0];
    if (topStudent && (topStudent.total_score || 0) > 200) {
      tips.push({
        icon: '🌟',
        text: txt(`${topStudent.display_name || '领先学生'} 以 ${topStudent.total_score} 分领跑，可以给他/她安排挑战题。`, `${topStudent.display_name || 'Top student'} leads with ${topStudent.total_score} pts. Consider giving them a challenge task.`),
        priority: 50,
      });
    }

    // 4. Low participation
    const activeCount = students.filter(s => {
      const cm = s.completed_missions as Record<string, any> | null;
      const login = (cm as any)?._login as { lastDate?: string } | undefined;
      return login?.lastDate && now - new Date(login.lastDate).getTime() < dayMs * 7;
    }).length;
    const rate = students.length > 0 ? Math.round((activeCount / students.length) * 100) : 0;
    if (rate < 50 && students.length > 3) {
      tips.push({
        icon: '📢',
        text: txt(`本周只有 ${rate}% 的学生活跃，建议发送作业链接提升参与度。`, `Only ${rate}% of students were active this week. Try sending a homework link to boost engagement.`),
        priority: 70,
      });
    }

    return tips.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }, [students, alerts, weakestKP, lang]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-amber-600" />
        <h3 className="text-sm font-black text-amber-800">{txt('本周建议', 'This Week\'s Suggestions')}</h3>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-amber-900">
            <span>{s.icon}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
