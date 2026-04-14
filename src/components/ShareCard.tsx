/**
 * ShareCard — Screenshot-friendly achievement card shown after victory.
 * Designed to look great when students screenshot and share in group chats.
 * Dark theme with gold accents for a premium "trophy" feel.
 */
import { motion } from 'motion/react';
import { Trophy, Flame, Clock, Zap, Share2 } from 'lucide-react';
import type { Language, BilingualText, Character } from '../types';
import { lt, tt } from '../i18n/resolveText';
import { CharacterAvatar } from './CharacterAvatar';

type Props = {
  missionTitle: BilingualText;
  skillName?: BilingualText;
  characterId: string;
  characterName: BilingualText;
  score: number;
  duration: number;
  streak: number;
  isFirstClear: boolean;
  isPerfect: boolean;
  grade: number;
  lang: Language;
  onClose: () => void;
};

export function ShareCard({
  missionTitle, skillName, characterId, characterName,
  score, duration, streak, isFirstClear, isPerfect, grade, lang, onClose,
}: Props) {
  const title = lt(missionTitle, lang);
  const skill = skillName ? lt(skillName, lang) : '';
  const charName = lt(characterName, lang);
  const dateStr = new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'zh-CN', { month: 'short', day: 'numeric' });

  const badge = isPerfect
    ? { text: tt(lang, 'PERFECT CLEAR', '完美通关'), color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/30' }
    : isFirstClear
    ? { text: tt(lang, 'FIRST CLEAR', '首次通关'), color: 'from-yellow-500 to-amber-500', glow: 'shadow-yellow-500/30' }
    : { text: tt(lang, 'VICTORY', '胜利'), color: 'from-indigo-500 to-blue-500', glow: 'shadow-indigo-500/30' };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        {/* The Card — designed for screenshot */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl ${badge.glow}`}>
          {/* Top pattern decoration */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4 opacity-10">
            <Trophy size={80} />
          </div>

          <div className="relative px-6 pt-8 pb-6">
            {/* Badge */}
            <div className="flex justify-center mb-5">
              <span className={`px-5 py-1.5 rounded-full text-white text-xs font-black tracking-widest bg-gradient-to-r ${badge.color} shadow-lg`}>
                {badge.text}
              </span>
            </div>

            {/* Character + Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[14px] bg-slate-800 flex items-center justify-center overflow-hidden">
                  <CharacterAvatar characterId={characterId} size={56} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white truncate">{title}</h3>
                {skill && <p className="text-xs text-indigo-300 font-bold truncate">{skill}</p>}
                <p className="text-[10px] text-white/40 font-bold mt-0.5">Y{grade} · {charName} · {dateStr}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <Trophy size={16} className="text-yellow-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{score}</div>
                <div className="text-[9px] text-white/40 font-bold uppercase">{tt(lang, 'Score', '得分')}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <Clock size={16} className="text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{duration}s</div>
                <div className="text-[9px] text-white/40 font-bold uppercase">{tt(lang, 'Time', '用时')}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <Flame size={16} className="text-orange-400 mx-auto mb-1" />
                <div className="text-lg font-black text-white">{streak}</div>
                <div className="text-[9px] text-white/40 font-bold uppercase">{tt(lang, 'Streak', '连胜')}</div>
              </div>
            </div>

            {/* Branding footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-indigo-400" />
                <span className="text-[11px] text-white/50 font-black tracking-wide">play.25maths.com</span>
              </div>
              <span className="text-[10px] text-white/30 font-bold">{tt(lang, 'Three Kingdoms Math', '三国数学')}</span>
            </div>
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="flex gap-3 mt-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 text-white/70 text-sm font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            {tt(lang, 'Close', '关闭')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
