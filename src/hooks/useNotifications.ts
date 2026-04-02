import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link_type: string;
  link_id: string;
  is_read: boolean;
  created_at: string;
};

/**
 * Fetches unread notifications from the shared `notifications` table.
 * Marks them as read when the user dismisses them.
 */
export function useNotifications(user: User | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch unread notifications on login + poll every 30s for live session alerts
  useEffect(() => {
    if (!user) { setNotifications([]); return; }

    let cancelled = false;
    const fetchNotifs = () => {
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (cancelled) return;
          setLoading(false);
          if (error) {
            console.error('Failed to load notifications:', error.message);
          } else if (data) {
            setNotifications(data as AppNotification[]);
          }
        });
    };

    setLoading(true);
    fetchNotifs();

    // Poll every 30s to catch live_session notifications from teachers
    const poll = setInterval(fetchNotifs, 30000);

    return () => { cancelled = true; clearInterval(poll); };
  }, [user?.id]);

  /** Mark a single notification as read */
  const markAsRead = useCallback(async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /** Mark all current notifications as read */
  const markAllAsRead = useCallback(async () => {
    const ids = notifications.map(n => n.id);
    if (ids.length === 0) return;
    await supabase.from('notifications').update({ is_read: true }).in('id', ids);
    setNotifications([]);
  }, [notifications]);

  return { notifications, loading, markAsRead, markAllAsRead };
}
