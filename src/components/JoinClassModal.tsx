/**
 * JoinClassModal — Student enters a 6-digit invite code to join a class.
 * Accessible from MapScreen profile area.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { joinClassByCode } from '../utils/classInvite';

export function JoinClassModal({ lang, onJoined, onClose }: {
  lang: Language;
  onJoined: (className: string) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const en = lang === 'en';

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      setError(en ? 'Code must be at least 4 characters' : '邀请码至少 4 个字符');
      return;
    }
    setJoining(true);
    setError(null);
    const result = await joinClassByCode(trimmed);
    setJoining(false);
    if (result.success) {
      setSuccess(result.className || trimmed);
      setTimeout(() => {
        onJoined(result.className || trimmed);
        onClose();
      }, 1500);
    } else {
      setError(result.error || (en ? 'Invalid code' : '无效邀请码'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-lg font-black text-slate-800">
              {en ? 'Joined!' : '加入成功！'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {en ? `You are now in "${success}"` : `你已加入「${success}」`}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-black text-slate-800 text-center mb-1">
              {en ? 'Join a Class' : '加入班级'}
            </h2>
            <p className="text-xs text-slate-400 text-center mb-4">
              {en ? 'Enter the code your teacher gave you' : '输入老师给你的邀请码'}
            </p>

            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="MK7A28"
              maxLength={8}
              className="w-full px-4 py-4 text-center text-2xl font-black tracking-[0.3em] border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none uppercase"
              autoFocus
            />

            {error && (
              <p className="text-xs text-rose-500 text-center mt-2">{error}</p>
            )}

            <button
              onClick={handleJoin}
              disabled={joining || code.trim().length < 4}
              className="w-full mt-4 py-3 min-h-[48px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-xl transition-colors"
            >
              {joining ? '...' : en ? 'Join Class' : '加入班级'}
            </button>

            <button
              onClick={onClose}
              className="w-full mt-2 py-2 text-slate-400 text-sm hover:text-slate-600 transition-colors"
            >
              {en ? 'Cancel' : '取消'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
