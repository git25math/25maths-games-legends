/**
 * ParentReport — Teacher generates a shareable report for one student's parent.
 * Plain text, copyable to WeChat. No login required for parent.
 */
import { useState, useMemo } from 'react';
import { Copy, Check, X } from 'lucide-react';
import type { Language } from '../../types';
import type { StudentRow } from './types';

type Props = {
  lang: Language;
  student: StudentRow;
  grade: number;
  onClose: () => void;
};

export function ParentReport({ lang, student, grade, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const en = lang === 'en';

  const report = useMemo(() => {
    const cm = student.completed_missions as Record<string, any> | null;
    const name = student.display_name || 'Student';
    const score = student.total_score || 0;
    const missionKeys = Object.keys(cm || {}).filter(k => !k.startsWith('_'));
    const completed = missionKeys.filter(k => (cm as any)?.[k]?.green).length;

    const login = (cm as any)?._login as { lastDate?: string } | undefined;
    const lastActive = login?.lastDate
      ? new Date(login.lastDate).toLocaleDateString(en ? 'en-GB' : 'zh-CN')
      : (en ? 'Unknown' : '未知');

    const date = new Date().toLocaleDateString(en ? 'en-GB' : 'zh-CN');

    if (en) {
      return `Learning Report — ${name} (Y${grade})
Date: ${date}
━━━━━━━━━━━━━━━━━━━━
Missions completed: ${completed}
Total score: ${score}
Last active: ${lastActive}

${score > 500
  ? `${name} is making excellent progress! Keep up the great work.`
  : score > 100
  ? `${name} is practising regularly. Encourage them to keep going — consistency is key.`
  : `${name} could benefit from more regular practice. Even 10 minutes a day helps.`}

Practice at: play.25maths.com

— ${name}'s Math Teacher`;
    }

    return `学习报告 — ${name}（Y${grade}）
日期：${date}
━━━━━━━━━━━━━━━━━━━━
已完成关卡：${completed} 关
总积分：${score}
最近活跃：${lastActive}

${score > 500
  ? `${name} 表现优秀，进步明显！请继续鼓励。`
  : score > 100
  ? `${name} 在坚持练习。请鼓励他/她保持节奏——持续性是进步的关键。`
  : `${name} 可以增加练习频率。哪怕每天 10 分钟也会有明显帮助。`}

练习地址：play.25maths.com

—— ${name} 的数学老师`;
  }, [student, grade, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-800">{en ? 'Parent Report' : '家长报告'}</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">
              {copied ? <><Check size={12} /> {en ? 'Copied!' : '已复制！'}</> : <><Copy size={12} /> {en ? 'Copy' : '复制'}</>}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
        </div>
        <pre className="p-5 text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-[65vh] overflow-y-auto">
          {report}
        </pre>
      </div>
    </div>
  );
}
