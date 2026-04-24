/**
 * DerivationToasts — M0 Phase 3 反馈层
 *
 * 监听 window 'm0:derivation' 事件,按产品灵魂 6 条原则做轻量反馈:
 *   - XP toast (仅答对时)   · 原则 4: 肯定过程而非天赋
 *   - FLM 升级 toast         · 原则 3: 描述感受而非结果
 *
 * 降级 / achievement / level-up 弹窗留到 Phase 7.5 灵魂审查统一打磨。
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { DerivationResult } from '../utils/recordAttempt';

interface XpToast { id: number; amount: number }
interface FlmToast { id: number; copy: { en: string; zh: string } }

/** FLM 升级文案 — 以学生为主语,描述感受,不暴露 mastery_state 标签 */
function flmUpgradeCopy(before: string, after: string): { en: string; zh: string } | null {
  if (before === 'learning' && after === 'familiarity') {
    return {
      en: "You're starting to know this one.",
      zh: '你开始熟悉它了。',
    };
  }
  if (before === 'familiarity' && after === 'mastery') {
    return {
      en: "This one is yours now.",
      zh: '这块已经是你的了。',
    };
  }
  return null; // 不处理降级与同级
}

export function DerivationToasts({ lang = 'zh' }: { lang?: 'en' | 'zh' }) {
  const [xpToast, setXpToast] = useState<XpToast | null>(null);
  const [flmToast, setFlmToast] = useState<FlmToast | null>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<DerivationResult>).detail;
      if (!detail?.success) return;

      // XP toast: 仅在答对(health_delta > 0) 且 awarded > 0 时显示
      // 避免错题再附加 "+2 XP" 带来的量化/奖励失重感
      if (detail.flm.health_delta > 0 && detail.xp.awarded > 0) {
        const id = ++counterRef.current;
        setXpToast({ id, amount: detail.xp.awarded });
        setTimeout(() => setXpToast(prev => (prev?.id === id ? null : prev)), 2000);
      }

      // FLM upgrade toast
      const copy = flmUpgradeCopy(detail.flm.before_state, detail.flm.after_state);
      if (copy) {
        const id = ++counterRef.current;
        setFlmToast({ id, copy });
        setTimeout(() => setFlmToast(prev => (prev?.id === id ? null : prev)), 3500);
      }
    };

    window.addEventListener('m0:derivation', handler);
    return () => window.removeEventListener('m0:derivation', handler);
  }, []);

  return (
    <>
      {/* XP toast · 右下角 · 柔和不抢戏 */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            key={xpToast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-4 sm:right-8 z-[90] flex items-center gap-2 px-3 py-1.5 bg-amber-500/90 backdrop-blur-md border border-amber-300/60 rounded-lg shadow-lg pointer-events-none"
          >
            <span className="text-base">✨</span>
            <p className="text-white font-semibold text-sm">
              +{xpToast.amount}
              <span className="ml-2 text-white/80 font-normal text-xs">
                {lang === 'en' ? "you earned this" : '你挣来的'}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLM upgrade toast · 居中上方 · 更慢,让感受落地 */}
      <AnimatePresence>
        {flmToast && (
          <motion.div
            key={flmToast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 bg-violet-600/95 backdrop-blur-lg border border-violet-400/60 rounded-xl shadow-2xl pointer-events-none max-w-[90vw]"
          >
            <p className="text-white font-medium text-sm text-center">
              {lang === 'en' ? flmToast.copy.en : flmToast.copy.zh}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
