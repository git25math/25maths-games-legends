import { motion } from 'motion/react';
import { Trophy, Swords, X } from 'lucide-react';
import type { Language, Room } from '../types';
import { lt } from '../i18n/resolveText';
import { CHARACTERS } from '../data/characters';

export const PKResultPanel = ({
  lang,
  room,
  currentUserId,
  onClose,
}: {
  lang: Language;
  room: Room;
  currentUserId: string;
  onClose: () => void;
}) => {
  const players = Object.entries(room.players).sort(([, a], [, b]) => b.score - a.score);

  // Edge case: opponent left mid-battle → show "Match Cancelled"
  if (players.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.7, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-500/20 mx-auto mb-4 flex items-center justify-center">
            <X size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            {lang === 'en' ? 'Match Cancelled' : '对决取消'}
          </h2>
          <p className="text-white/40 text-xs mb-6">
            {lang === 'en' ? 'Your opponent left the match.' : '对手已离开对决。'}
          </p>
          <button onClick={onClose} className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-colors text-sm">
            {lang === 'en' ? 'Back to Map' : '返回地图'}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const winnerId = players[0][0];
  const isWinner = winnerId === currentUserId;
  const isTie = players[0][1].score === players[1][1].score;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center"
      >
        {/* Result icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isTie
              ? 'bg-amber-500/20'
              : isWinner
                ? 'bg-amber-500/20'
                : 'bg-slate-500/20'
          }`}
        >
          {isTie
            ? <Swords size={36} className="text-amber-400" />
            : isWinner
              ? <Trophy size={36} className="text-amber-400" />
              : <Swords size={36} className="text-slate-400" />
          }
        </motion.div>

        {/* Title */}
        <h2 className={`text-2xl font-black mb-1 ${
          isTie ? 'text-amber-400' : isWinner ? 'text-amber-400' : 'text-white'
        }`}>
          {isTie
            ? (lang === 'en' ? 'Draw!' : '平局！')
            : isWinner
              ? (lang === 'en' ? 'Victory!' : '胜利！')
              : (lang === 'en' ? 'Defeat' : '失败')
          }
        </h2>
        <p className="text-white/40 text-xs mb-6">
          {isTie
            ? (lang === 'en' ? 'You are evenly matched!' : '旗鼓相当！')
            : isWinner
              ? (lang === 'en' ? 'You outscored your opponent!' : '你的得分超过了对手！')
              : (lang === 'en' ? 'Better luck next time!' : '下次再战！')
          }
        </p>

        {/* Score comparison */}
        <div className="space-y-3 mb-6">
          {players.map(([uid, p], idx) => {
            const ch = CHARACTERS.find(c => c.id === p.charId);
            const isMe = uid === currentUserId;
            const isFirst = idx === 0 && !isTie;
            return (
              <motion.div
                key={uid}
                initial={{ opacity: 0, x: isMe ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.15 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isFirst
                    ? 'border-amber-400/30 bg-amber-400/5'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                {isFirst && !isTie && (
                  <Trophy size={16} className="text-amber-400 shrink-0" />
                )}
                <div className={`w-10 h-10 rounded-xl ${ch?.color ?? 'bg-slate-500'} flex items-center justify-center text-white font-black shrink-0`}>
                  {p.name?.[0] || '?'}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-sm font-bold truncate">
                    {p.name}
                    {isMe && <span className="text-indigo-400 text-[10px] ml-1">({lang === 'en' ? 'You' : '你'})</span>}
                  </p>
                  <p className="text-white/30 text-[10px]">{ch ? lt(ch.role, lang) : ''}</p>
                </div>
                <div className={`text-lg font-black ${isFirst && !isTie ? 'text-amber-400' : 'text-white/60'}`}>
                  {p.score}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-colors text-sm"
        >
          {lang === 'en' ? 'Back to Map' : '返回地图'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
