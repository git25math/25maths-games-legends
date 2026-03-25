import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Swords, X } from 'lucide-react';
import type { Language, Room, RoomPlayer } from '../types';
import { lt } from '../i18n/resolveText';
import { CHARACTERS } from '../data/characters';
import { Confetti } from './Confetti';

/** XP multiplier by rank (1st, 2nd, 3rd, rest) */
export const RANK_MULTIPLIERS = [2.0, 1.5, 1.2, 1.0];
export function getRankMultiplier(rank: number): number {
  return RANK_MULTIPLIERS[Math.min(rank, RANK_MULTIPLIERS.length - 1)];
}

const MEDAL_COLORS = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
const MEDAL_BG = ['bg-amber-400/20', 'bg-slate-300/10', 'bg-amber-600/10'];
const MEDAL_BORDER = ['border-amber-400/40', 'border-slate-300/30', 'border-amber-600/30'];
const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];

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
  const players = Object.entries(room.players)
    .sort(([, a], [, b]) => b.score - a.score);

  const [revealStep, setRevealStep] = useState(0); // 0=initial, 1..N=revealing ranks bottom-up
  const [showConfetti, setShowConfetti] = useState(false);

  const totalPlayers = players.length;

  // Staggered reveal: bottom rank first, then up to #1
  useEffect(() => {
    if (totalPlayers < 2) return;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setRevealStep(step);
      if (step >= totalPlayers) {
        clearInterval(timer);
        // Confetti for the winner reveal
        setTimeout(() => setShowConfetti(true), 300);
      }
    }, 600);
    return () => clearInterval(timer);
  }, [totalPlayers]);

  // Edge case: <2 players → match cancelled
  if (totalPlayers < 2) {
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
            {lang === 'en' ? 'Not enough players.' : '人数不足。'}
          </p>
          <button onClick={onClose} className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-colors text-sm">
            {lang === 'en' ? 'Back to Map' : '返回地图'}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const myRank = players.findIndex(([uid]) => uid === currentUserId);
  const isTie = players[0][1].score === players[1][1].score;

  // Title text
  const getTitle = () => {
    if (isTie && myRank <= 1) return lang === 'en' ? 'Draw!' : '平局！';
    if (myRank === 0) return lang === 'en' ? 'Victory!' : '胜利！';
    if (myRank === 1 && totalPlayers > 2) return lang === 'en' ? 'Runner Up!' : '亚军！';
    if (myRank === 2) return lang === 'en' ? 'Third Place!' : '季军！';
    return lang === 'en' ? 'Good Fight!' : '好战！';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="text-5xl mb-2"
        >
          {myRank === 0 ? '🏆' : myRank <= 2 ? MEDAL_EMOJI[myRank] : '⚔️'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: totalPlayers * 0.6 + 0.3 }}
          className={`text-2xl font-black mb-1 ${myRank === 0 ? 'text-amber-400' : 'text-white'}`}
        >
          {getTitle()}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: totalPlayers * 0.6 + 0.5 }}
          className="text-white/40 text-xs mb-5"
        >
          {lang === 'en'
            ? `Your rank: #${myRank + 1} of ${totalPlayers}`
            : `你的名次：第 ${myRank + 1} 名（共 ${totalPlayers} 人）`
          }
        </motion.p>

        {/* Podium — reveal bottom-up */}
        <div className="space-y-2 mb-6">
          {players.map(([uid, p], idx) => {
            // Reveal order: last place first → champion last
            const revealOrder = totalPlayers - idx; // champion = totalPlayers, last = 1
            const isRevealed = revealStep >= revealOrder;
            const ch = CHARACTERS.find(c => c.id === p.charId);
            const isMe = uid === currentUserId;
            const medal = idx < 3 ? idx : -1;
            const multiplier = getRankMultiplier(idx);

            return (
              <AnimatePresence key={uid}>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, x: idx === 0 ? 0 : isMe ? -30 : 30, scale: idx === 0 ? 0.8 : 1 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 22,
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      medal >= 0
                        ? `${MEDAL_BORDER[medal]} ${MEDAL_BG[medal]}`
                        : 'border-white/10 bg-white/[0.02]'
                    } ${isMe ? 'ring-2 ring-indigo-400/40' : ''}`}
                  >
                    {/* Rank */}
                    <div className={`w-8 text-center font-black text-lg shrink-0 ${
                      medal >= 0 ? MEDAL_COLORS[medal] : 'text-white/30'
                    }`}>
                      {medal >= 0 ? MEDAL_EMOJI[medal] : `#${idx + 1}`}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl ${ch?.color ?? 'bg-slate-500'} flex items-center justify-center text-white font-black shrink-0`}>
                      {p.name?.[0] || '?'}
                    </div>

                    {/* Name */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white text-sm font-bold truncate">
                        {p.name}
                        {isMe && <span className="text-indigo-400 text-[10px] ml-1">({lang === 'en' ? 'You' : '你'})</span>}
                      </p>
                      {multiplier > 1 && (
                        <p className={`text-[10px] font-bold ${MEDAL_COLORS[medal] ?? 'text-white/30'}`}>
                          XP ×{multiplier}
                        </p>
                      )}
                    </div>

                    {/* Score */}
                    <div className={`text-lg font-black shrink-0 ${
                      medal >= 0 ? MEDAL_COLORS[medal] : 'text-white/40'
                    }`}>
                      {p.score}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Close button — only after all revealed */}
        <AnimatePresence>
          {revealStep >= totalPlayers && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-colors text-sm"
            >
              {lang === 'en' ? 'Back to Map' : '返回地图'}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
