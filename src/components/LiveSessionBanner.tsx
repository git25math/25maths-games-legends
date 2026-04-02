/**
 * LiveSessionBanner — Notification banner on MapScreen when a live session is active.
 * Reads from useNotifications, shows "Join Now" for live_session type.
 */
import { motion } from 'motion/react';
import { Radio, X } from 'lucide-react';
import type { Language } from '../types';
import type { AppNotification } from '../hooks/useNotifications';

type Props = {
  notifications: AppNotification[];
  onJoin: (roomId: string) => void;
  onDismiss: (id: string) => void;
  lang: Language;
};

export function LiveSessionBanner({ notifications, onJoin, onDismiss, lang }: Props) {
  const liveNotifs = notifications.filter(n => n.type === 'live_session' && n.link_type === 'live_room');
  if (liveNotifs.length === 0) return null;

  const en = lang === 'en';
  const notif = liveNotifs[0]; // show most recent

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-3 mb-3 bg-gradient-to-r from-rose-600 to-indigo-600 rounded-2xl p-4 shadow-xl flex items-center gap-3"
    >
      <Radio size={20} className="text-white animate-pulse shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-sm truncate">{notif.title}</p>
        <p className="text-white/70 text-xs truncate">{notif.body}</p>
      </div>
      <button
        onClick={() => onJoin(notif.link_id)}
        className="px-4 py-2 bg-white text-slate-900 font-black text-xs rounded-xl shrink-0 hover:bg-white/90 transition-colors"
      >
        {en ? 'Join Now' : '立即加入'}
      </button>
      <button
        onClick={() => onDismiss(notif.id)}
        className="p-1 text-white/40 hover:text-white transition-colors shrink-0"
        aria-label={en ? 'Dismiss' : '关闭'}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
