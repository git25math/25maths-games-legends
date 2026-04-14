import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCheck } from 'lucide-react';
import type { Language } from '../types';
import type { AppNotification } from '../hooks/useNotifications';
import { tt } from '../i18n/resolveText';

type Props = {
  lang: Language;
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
};

const LABELS = {
  zh: { title: '系统通知', markAll: '全部已读', close: '关闭', empty: '暂无通知' },
  zh_TW: { title: '系統通知', markAll: '全部已讀', close: '關閉', empty: '暫無通知' },
  en: { title: 'Notifications', markAll: 'Mark all read', close: 'Close', empty: 'No notifications' },
};

function formatDate(iso: string, lang: Language): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
}

const TYPE_COLORS: Record<string, string> = {
  info: 'bg-indigo-500',
  warning: 'bg-amber-500',
  score_adjustment: 'bg-rose-500',
  achievement: 'bg-emerald-500',
};

export function NotificationModal({ lang, notifications, onDismiss, onDismissAll }: Props) {
  const t = LABELS[lang] || LABELS.en;

  if (notifications.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="notif-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onDismissAll}
      >
        <motion.div
          key="notif-modal"
          role="dialog"
          aria-modal="true"
          aria-label={tt(lang, 'Notifications', '通知')}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Bell size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">{t.title}</h3>
                <p className="text-xs text-slate-400 font-bold">{notifications.length} {tt(lang, 'unread', '未读')}</p>
              </div>
            </div>
            <button
              onClick={onDismissAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <CheckCheck size={14} />
              {t.markAll}
            </button>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="relative bg-slate-50 rounded-2xl p-4 group"
              >
                <button
                  onClick={() => onDismiss(n.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label={t.close}
                >
                  <X size={14} className="text-slate-400" />
                </button>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm leading-snug">{n.title}</p>
                    {n.body && (
                      <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">{n.body}</p>
                    )}
                    <p className="text-[10px] text-slate-300 mt-2 font-bold">
                      {formatDate(n.created_at, lang)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer — dismiss all */}
          <div className="px-6 py-4 border-t border-slate-100">
            <button
              onClick={onDismissAll}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-colors text-sm"
            >
              {tt(lang, 'Got it', '我知道了')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
