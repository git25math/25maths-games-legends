import { useState } from 'react';
import { motion } from 'motion/react';
import { Timer, Copy, Check, Swords, Users } from 'lucide-react';
import type { Language, Room } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import { CHARACTERS } from '../data/characters';
import { MISSIONS } from '../data/missions';
import { buttonBase } from '../utils/animationPresets';

export const LobbyScreen = ({
  lang,
  room,
  userId,
  onReady,
  onStart,
  onLeave,
}: {
  lang: Language;
  room: Room;
  userId: string;
  onReady: () => void;
  onStart: () => void;
  onLeave: () => void;
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const roomCode = room.id.slice(0, 6).toUpperCase();
  const playerCount = Object.keys(room.players).length;
  const allReady = playerCount >= 2 && Object.values(room.players).every(p => p.isReady);
  const mission = MISSIONS.find(m => m.id === room.missionId);
  const isPK = room.type === 'pk';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  };

  return (
    <motion.div key="lobby" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-[3rem] p-8 shadow-2xl">
        {/* Header with room code */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isPK ? <Swords size={24} className="text-rose-500" /> : <Users size={24} className="text-indigo-500" />}
              <h2 className="text-3xl font-black text-slate-800">
                {isPK ? (lang === 'en' ? 'Friend PK' : '好友对决') : t.teamMode}
              </h2>
            </div>
            {mission && (
              <p className="text-slate-400 text-sm font-bold">
                {lt(mission.title, lang)}
              </p>
            )}
            <p className="text-slate-400 flex items-center gap-2 font-bold text-sm mt-1">
              <Timer size={16} />
              {playerCount < 2
                ? (lang === 'en' ? 'Waiting for opponent...' : '等待对手加入...')
                : (lang === 'en' ? 'Ready to battle!' : '准备开战！')
              }
            </p>
          </div>

          {/* Room code card */}
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Room Code' : '房间代码'}
            </div>
            <button
              onClick={copyCode}
              className="bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-2xl font-black text-slate-700 text-xl tracking-[0.2em] transition-colors flex items-center gap-2"
            >
              {roomCode}
              {copied
                ? <Check size={16} className="text-emerald-500" />
                : <Copy size={16} className="text-slate-400" />
              }
            </button>
            <p className="text-[10px] text-slate-400 mt-1">
              {copied
                ? (lang === 'en' ? 'Copied! Send to your friend' : '已复制！发给好友')
                : (lang === 'en' ? 'Tap to copy & share' : '点击复制，发给好友')
              }
            </p>
          </div>
        </div>

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(room.players).map(([uid, p]: [string, any]) => {
            const ch = CHARACTERS.find(c => c.id === p.charId);
            const isMe = uid === userId;
            return (
              <motion.div
                key={uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl flex items-center justify-between border-2 transition-all ${
                  isMe
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${ch?.color ?? 'bg-slate-200'} flex items-center justify-center text-2xl font-black text-white`}>
                    {p.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-black text-slate-800">
                      {p.name}
                      {isMe && <span className="text-indigo-500 text-xs ml-1">({lang === 'en' ? 'You' : '你'})</span>}
                    </p>
                    <p className="text-xs text-indigo-500 font-bold">
                      {ch ? lt(ch.role, lang) : ''}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
                  p.isReady ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                }`}>
                  {p.isReady ? (lang === 'en' ? 'Ready' : '就绪') : '...'}
                </div>
              </motion.div>
            );
          })}

          {/* Empty slot */}
          {playerCount < 2 && (
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <p className="text-slate-300 font-bold text-sm">
                {lang === 'en' ? 'Waiting for player...' : '等待玩家...'}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            {...buttonBase}
            onClick={onLeave}
            className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors"
          >
            {t.leave}
          </motion.button>
          <motion.button
            {...buttonBase}
            onClick={onReady}
            className={`flex-[2] py-4 font-black rounded-2xl transition-colors ${
              room.players[userId]?.isReady
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {room.players[userId]?.isReady ? (lang === 'en' ? 'Ready!' : '已就绪！') : t.ready}
          </motion.button>
          {userId === room.hostId && (
            <motion.button
              {...buttonBase}
              onClick={onStart}
              disabled={!allReady}
              className={`flex-1 py-4 font-black rounded-2xl transition-colors ${
                allReady
                  ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300'
                  : 'bg-yellow-400/30 text-slate-400 cursor-not-allowed'
              }`}
            >
              {t.startBattle}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
