import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Swords, UserPlus } from 'lucide-react';
import type { Language, Mission } from '../types';
import { lt } from '../i18n/resolveText';
import { MISSIONS } from '../data/missions';
import { useAudio } from '../audio';
import { useEscapeKey } from '../hooks/useEscapeKey';

export const PKSetupPanel = ({
  lang,
  grade,
  onCreateRoom,
  onJoinRoom,
  onClose,
}: {
  lang: Language;
  grade: number;
  onCreateRoom: (missionId: number) => void;
  onJoinRoom: (roomCode: string) => void;
  onClose: () => void;
}) => {
  const { playTap } = useAudio();
  useEscapeKey(onClose);
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [roomCode, setRoomCode] = useState('');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const gradeMissions = MISSIONS.filter(m => m.grade === grade);

  // Group by unit
  const units = Array.from(new Set(gradeMissions.map(m => lt(m.unitTitle, lang))));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-slate-800/95 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Swords size={20} className="text-rose-400" />
            </div>
            <h2 className="text-lg font-black text-white">
              {lang === 'en' ? 'Friend PK' : '好友对决'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 min-w-10 min-h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Choose mode */}
        {mode === 'choose' && (
          <div className="flex flex-col gap-3">
            <p className="text-white/50 text-xs text-center mb-2">
              {lang === 'en'
                ? 'Challenge a friend to a math duel!'
                : '向朋友发起数学对决！'}
            </p>
            <button
              onClick={() => { playTap(); setMode('create'); }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Swords size={24} className="text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">
                  {lang === 'en' ? 'Create Room' : '创建房间'}
                </p>
                <p className="text-white/40 text-xs">
                  {lang === 'en' ? 'Pick a topic and invite your friend' : '选择题目，邀请好友加入'}
                </p>
              </div>
            </button>
            <button
              onClick={() => { playTap(); setMode('join'); }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <UserPlus size={24} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">
                  {lang === 'en' ? 'Join Room' : '加入房间'}
                </p>
                <p className="text-white/40 text-xs">
                  {lang === 'en' ? 'Enter a room code from your friend' : '输入好友的房间代码'}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Create room — pick mission */}
        {mode === 'create' && (
          <div className="flex-1 overflow-y-auto">
            <button
              onClick={() => { playTap(); setMode('choose'); }}
              className="text-white/40 text-xs font-bold mb-3 hover:text-white transition-colors"
            >
              {'< '}{lang === 'en' ? 'Back' : '返回'}
            </button>
            <p className="text-white/50 text-xs mb-3">
              {lang === 'en' ? 'Choose a mission for the duel:' : '选择对决题目：'}
            </p>
            {gradeMissions.length === 0 && (
              <p className="text-white/30 text-xs text-center py-8">
                {lang === 'en' ? 'No missions available for your grade.' : '当前年级暂无可用关卡。'}
              </p>
            )}
            <div className="space-y-3">
              {units.map(unitTitle => {
                const unitMissions = gradeMissions.filter(m => lt(m.unitTitle, lang) === unitTitle);
                return (
                  <div key={unitTitle}>
                    <div className="text-[10px] font-bold uppercase text-white/30 mb-1 tracking-wider">{unitTitle}</div>
                    <div className="space-y-1">
                      {unitMissions.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { playTap(); setSelectedMission(m); }}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            selectedMission?.id === m.id
                              ? 'border-indigo-400/40 bg-indigo-400/10 text-indigo-300'
                              : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/5'
                          }`}
                        >
                          {lt(m.title, lang)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedMission && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onCreateRoom(selectedMission.id)}
                className="w-full mt-4 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-colors text-sm"
              >
                {lang === 'en' ? 'Create Room' : '创建房间'}
              </motion.button>
            )}
          </div>
        )}

        {/* Join room — enter code */}
        {mode === 'join' && (
          <div>
            <button
              onClick={() => { playTap(); setMode('choose'); }}
              className="text-white/40 text-xs font-bold mb-3 hover:text-white transition-colors"
            >
              {'< '}{lang === 'en' ? 'Back' : '返回'}
            </button>
            <p className="text-white/50 text-xs mb-3">
              {lang === 'en' ? 'Enter the room code from your friend:' : '输入好友发送的房间代码：'}
            </p>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.trim())}
              onKeyDown={(e) => { if (e.key === 'Enter' && roomCode.length >= 6) onJoinRoom(roomCode); }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData('text').trim();
                if (pasted.length >= 6) {
                  e.preventDefault();
                  setRoomCode(pasted);
                  setTimeout(() => onJoinRoom(pasted), 100);
                }
              }}
              placeholder={lang === 'en' ? 'Room code or full ID' : '房间代码或完整 ID'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center font-mono text-lg tracking-[0.2em] placeholder:text-white/20 placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:border-indigo-400/50"
              maxLength={36}
              autoFocus
            />
            <button
              onClick={() => { if (roomCode.length >= 6) onJoinRoom(roomCode); }}
              disabled={roomCode.length < 6}
              className="w-full mt-4 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {lang === 'en' ? 'Join Room' : '加入房间'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
