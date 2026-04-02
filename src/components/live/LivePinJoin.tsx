/**
 * LivePinJoin — PIN-based anonymous join for Live Classroom.
 * Used for large events: no login required, just PIN + nickname.
 * Teacher must still be authenticated to create sessions.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, ArrowRight, Loader2 } from 'lucide-react';
import type { Language } from '../../types';
import { supabase } from '../../supabase';

type Props = {
  lang: Language;
  onJoined: (roomId: string, anonId: string, nickname: string) => void;
  onBack: () => void;
};

export function LivePinJoin({ lang, onJoined, onBack }: Props) {
  const en = lang === 'en';
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'pin' | 'name'>('pin');

  const handlePinSubmit = () => {
    if (pin.trim().length < 4) return;
    setStep('name');
  };

  const handleJoin = async () => {
    if (!nickname.trim()) return;
    setLoading(true);
    setError('');
    const { data, error: rpcErr } = await supabase.rpc('join_live_anonymous', {
      p_pin: pin.trim().toLowerCase(),
      p_nickname: nickname.trim(),
    });
    setLoading(false);
    if (rpcErr) { setError(en ? 'Connection failed. Try again.' : '连接失败，请重试。'); return; }
    if (data?.error === 'invalid_pin') { setError(en ? 'Invalid PIN. Check and try again.' : 'PIN 码无效，请检查后重试。'); setStep('pin'); return; }
    if (data?.error) { setError(data.error); return; }
    if (data?.ok && data?.room_id && data?.anon_id) {
      onJoined(data.room_id, data.anon_id, nickname.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-b from-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-6 text-center"
      >
        {/* Logo */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto">
            <Radio size={32} className="text-rose-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white">25 Math Live</h1>
          <p className="text-white/40 text-sm">{en ? 'Join a live classroom session' : '加入实时课堂'}</p>
        </div>

        {/* Step 1: PIN */}
        {step === 'pin' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                {en ? 'Enter PIN Code' : '输入 PIN 码'}
              </label>
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                maxLength={6}
                value={pin}
                onChange={e => { setPin(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
                placeholder="ABC123"
                className="w-full text-center text-4xl font-black tracking-[0.3em] px-6 py-5 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/20 focus:border-indigo-400 outline-none transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-rose-400 text-sm font-bold">{error}</p>}
            <button
              onClick={handlePinSubmit}
              disabled={pin.trim().length < 4}
              className={`w-full py-4 font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 ${
                pin.trim().length >= 4
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {en ? 'Next' : '下一步'} <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Nickname */}
        {step === 'name' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white/5 rounded-xl px-4 py-2 inline-flex items-center gap-2">
              <span className="text-white/40 text-xs">PIN:</span>
              <span className="text-white font-black tracking-widest">{pin}</span>
              <button onClick={() => setStep('pin')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">
                {en ? 'Change' : '修改'}
              </button>
            </div>
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                {en ? 'Your Nickname' : '你的昵称'}
              </label>
              <input
                type="text"
                maxLength={20}
                value={nickname}
                onChange={e => { setNickname(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                placeholder={en ? 'Enter your name' : '输入你的名字'}
                className="w-full text-center text-2xl font-black px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/20 focus:border-indigo-400 outline-none transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-rose-400 text-sm font-bold">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading || !nickname.trim()}
              className={`w-full py-4 font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 ${
                loading || !nickname.trim()
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? (en ? 'Joining...' : '加入中...') : (en ? 'Join Session' : '加入课堂')}
            </button>
          </motion.div>
        )}

        {/* Back link */}
        <button
          onClick={onBack}
          className="text-white/30 text-xs font-bold hover:text-white/60 transition-colors"
        >
          {en ? '← Back to 25 Math Legends' : '← 返回 25 数学三国'}
        </button>
      </motion.div>
    </div>
  );
}
