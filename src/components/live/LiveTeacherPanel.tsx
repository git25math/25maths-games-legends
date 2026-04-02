/**
 * LiveTeacherPanel — Teacher control panel for live classroom sessions.
 * Shows: student roster, question pusher, real-time progress, session summary.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Users, CheckCircle2, XCircle, Clock, ChevronRight, Copy, Check, Trophy, BookOpen, X } from 'lucide-react';
import type { Language, Room, Mission } from '../../types';
import type { QuestionStats } from '../../hooks/useLiveSession';
import { lt } from '../../i18n/resolveText';
import { CharacterAvatar } from '../CharacterAvatar';
import { useEscapeKey } from '../../hooks/useEscapeKey';

type SessionSummary = {
  weakKps: { kpId: string; total: number; correct: number; failureRate: number; studentCount: number }[];
  studentMap: Map<string, { correct: number; total: number }>;
  totalQuestions: number;
  totalResponses: number;
};

type Props = {
  lang: Language;
  room: Room;
  userId: string;
  missions: Mission[];
  grade: number;
  questionStats: QuestionStats | null;
  sessionSummary: SessionSummary | null;
  questionIndex: number;
  onPushQuestion: (missionId: number, kpId: string, questionData: Record<string, unknown>, timerSecs?: number) => Promise<string>;
  onEndSession: () => Promise<string>;
  onClose: () => void;
  onAssign?: (kpId: string, missionIds: number[], studentIds: string[]) => void;
};

const TIMER_OPTIONS = [30, 60, 90, 120, null] as const;

export function LiveTeacherPanel({
  lang, room, userId, missions, grade, questionStats, sessionSummary,
  questionIndex, onPushQuestion, onEndSession, onClose, onAssign,
}: Props) {
  useEscapeKey(onClose);
  const en = lang === 'en';
  const [copied, setCopied] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);
  const [timerSecs, setTimerSecs] = useState<number | null>(60);
  const [pushing, setPushing] = useState(false);
  const [showMissionPicker, setShowMissionPicker] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const roomCode = room.id.slice(0, 6).toUpperCase();
  const students = Object.entries(room.players).filter(([uid]) => uid !== room.hostId);
  const studentCount = students.length;
  const currentQ = room.liveMeta?.current_question;
  const isSessionEnded = room.status === 'finished';
  const currentMission = currentQ ? missions.find(m => m.id === currentQ.mission_id) : null;

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(room.id); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const handlePush = async () => {
    if (!selectedMissionId) return;
    const m = missions.find(mi => mi.id === selectedMissionId);
    if (!m) return;
    setPushing(true);
    // Generate randomized question data so all students see the same numbers
    let questionData = m.data;
    if (m.data?.generatorType) {
      try {
        const { generateMission } = await import('../../utils/generateMission');
        const generated = generateMission(m);
        questionData = generated.data;
      } catch { /* fallback to template data */ }
    }
    const err = await onPushQuestion(selectedMissionId, m.kpId || '', questionData, timerSecs ?? undefined);
    setPushing(false);
    if (err) alert(err);
    else setShowMissionPicker(false);
  };

  const handleEnd = async () => {
    if (!confirm(en ? 'End the live session?' : '确定结束课堂？')) return;
    await onEndSession();
    setShowSummary(true);
  };

  // Group missions by unit for picker
  const missionsByUnit = useMemo(() => {
    const map = new Map<string, Mission[]>();
    for (const m of missions) {
      const key = lt(m.unitTitle, lang);
      const arr = map.get(key) || [];
      arr.push(m);
      map.set(key, arr);
    }
    return [...map.entries()];
  }, [missions, lang]);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Radio size={20} className="text-rose-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                {en ? 'Live Classroom' : '实时课堂'}
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full">LIVE</span>
              </h1>
              <p className="text-white/40 text-xs">{room.liveMeta?.class_tag} · Q{questionIndex}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyCode} className="flex items-center gap-1 px-3 py-2 bg-white/10 rounded-xl text-white/60 text-xs font-bold hover:bg-white/20 transition-colors" aria-label="Copy room code">
              {roomCode} {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
            <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── PIN Display (prominent when no students yet) ─── */}
        {studentCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-indigo-600/20 to-rose-600/20 rounded-2xl p-6 border border-indigo-400/20 text-center"
          >
            <p className="text-white/60 text-sm font-bold mb-2">{en ? 'Share this PIN with your students' : '把 PIN 码分享给学生'}</p>
            <button onClick={copyCode} className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors">
              <span className="text-5xl font-black text-white tracking-[0.3em]">{roomCode}</span>
              {copied ? <Check size={24} className="text-emerald-400" /> : <Copy size={24} className="text-white/40" />}
            </button>
            <p className="text-white/30 text-xs mt-3">
              {copied
                ? (en ? 'Copied! Share with students' : '已复制！分享给学生')
                : (en ? 'Students join at play.25maths.com?live' : '学生打开 play.25maths.com?live 输入此 PIN')}
            </p>
          </motion.div>
        )}

        {/* ─── Student Count + Progress ─── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <Users size={20} className="text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{studentCount}</p>
            <p className="text-[10px] text-white/40 font-bold">{en ? 'Students' : '学生'}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <CheckCircle2 size={20} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{questionStats?.answeredCount ?? 0}/{studentCount}</p>
            <p className="text-[10px] text-white/40 font-bold">{en ? 'Answered' : '已答'}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <Trophy size={20} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{questionStats?.correctRate ?? 0}%</p>
            <p className="text-[10px] text-white/40 font-bold">{en ? 'Correct' : '正确率'}</p>
          </div>
        </div>

        {/* ─── Progress Bar ─── */}
        {questionStats && studentCount > 0 && (
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex justify-between text-[10px] text-white/40 font-bold mb-1">
              <span>{en ? 'Response progress' : '答题进度'}</span>
              <span>{questionStats.answeredCount}/{studentCount}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(questionStats.answeredCount / studentCount) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </div>
        )}

        {/* ─── Current Question Info ─── */}
        {currentMission && (
          <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-400/20">
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">
              {en ? `Question ${questionIndex}` : `第 ${questionIndex} 题`}
            </p>
            <p className="text-white font-bold">{lt(currentMission.title, lang)}</p>
            <p className="text-white/40 text-xs">{currentMission.kpId} · {currentMission.topic}</p>
          </div>
        )}

        {/* ─── Student Roster ─── */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-black text-white">{en ? 'Student Responses' : '学生答题状态'}</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5">
            {students.map(([uid, p]) => {
              const stat = questionStats?.perStudent.find(s => s.userId === uid);
              return (
                <div key={uid} className="flex items-center gap-3 px-4 py-3">
                  <CharacterAvatar characterId={p.charId || ''} size={32} />
                  <span className="flex-1 text-sm font-bold text-white truncate">{p.name}</span>
                  {!currentQ ? (
                    <span className="text-white/20 text-xs">{en ? 'Waiting' : '等待中'}</span>
                  ) : !stat?.answered ? (
                    <span className="flex items-center gap-1 text-amber-400/60 text-xs animate-pulse">
                      <Clock size={12} /> {en ? 'Answering...' : '答题中...'}
                    </span>
                  ) : stat.isCorrect ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 size={14} /> {stat.durationMs ? `${Math.round(stat.durationMs / 1000)}s` : ''}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 text-xs">
                      <XCircle size={14} /> {stat.durationMs ? `${Math.round(stat.durationMs / 1000)}s` : ''}
                    </span>
                  )}
                  <span className="text-yellow-400 text-xs font-bold w-12 text-right">{p.score}</span>
                </div>
              );
            })}
            {studentCount === 0 && (
              <div className="px-4 py-8 text-center text-white/30 text-sm">
                {en ? 'Waiting for students to join...' : '等待学生加入...'}
              </div>
            )}
          </div>
        </div>

        {/* ─── Action Buttons ─── */}
        {!isSessionEnded && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowMissionPicker(true)}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronRight size={18} />
              {questionIndex === 0 ? (en ? 'Push First Question' : '推送第一题') : (en ? 'Next Question' : '下一题')}
            </button>
            <button
              onClick={handleEnd}
              className="flex-1 py-4 bg-rose-500/20 text-rose-400 font-black rounded-2xl hover:bg-rose-500/30 transition-colors"
            >
              {en ? 'End Session' : '结束课堂'}
            </button>
          </div>
        )}

        {/* ─── Session Ended: Summary ─── */}
        {isSessionEnded && sessionSummary && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-black text-white">{en ? 'Session Summary' : '课堂总结'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-500/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-white">{sessionSummary.totalQuestions}</p>
                <p className="text-[10px] text-white/40">{en ? 'Questions' : '题目数'}</p>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-white">{sessionSummary.totalResponses}</p>
                <p className="text-[10px] text-white/40">{en ? 'Responses' : '答题数'}</p>
              </div>
            </div>

            {sessionSummary.weakKps.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white/60 mb-2">{en ? 'Weak Areas' : '薄弱知识点'}</h4>
                {sessionSummary.weakKps.slice(0, 5).map(kp => (
                  <div key={kp.kpId} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-white font-bold">{kp.kpId}</span>
                    <span className={`text-xs font-bold ${kp.failureRate > 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {en ? `${kp.failureRate}% wrong` : `${kp.failureRate}% 错误`}
                    </span>
                  </div>
                ))}
                {onAssign && (
                  <button
                    onClick={() => {
                      const weakKpIds = sessionSummary.weakKps.filter(k => k.failureRate > 40).map(k => k.kpId);
                      const weakMissionIds = missions.filter(m => weakKpIds.includes(m.kpId || '')).map(m => m.id);
                      const weakStudentIds = [...sessionSummary.studentMap.entries()]
                        .filter(([, s]) => s.total > 0 && (s.correct / s.total) < 0.6)
                        .map(([uid]) => uid);
                      if (weakMissionIds.length > 0) {
                        onAssign(weakKpIds[0], weakMissionIds, weakStudentIds);
                      }
                    }}
                    className="w-full mt-3 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen size={16} />
                    {en ? 'Assign Practice for Weak KPs' : '布置薄弱知识点练习'}
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
            >
              {en ? 'Close' : '关闭'}
            </button>
          </div>
        )}

        {/* ─── Mission Picker Modal ─── */}
        <AnimatePresence>
          {showMissionPicker && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
              onClick={() => setShowMissionPicker(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                  <h3 className="font-black text-white">{en ? 'Select Question' : '选择题目'}</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={timerSecs ?? ''}
                      onChange={e => setTimerSecs(e.target.value ? Number(e.target.value) : null)}
                      className="bg-white/10 text-white text-xs rounded-lg px-2 py-1 border border-white/10"
                    >
                      {TIMER_OPTIONS.map(t => (
                        <option key={String(t)} value={t ?? ''}>{t ? `${t}s` : (en ? 'No timer' : '无计时')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 p-3 space-y-3">
                  {missionsByUnit.map(([unitTitle, unitMissions]) => (
                    <div key={unitTitle}>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-1 px-2">{unitTitle}</p>
                      {unitMissions.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMissionId(m.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedMissionId === m.id
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                              : 'text-white/60 hover:bg-white/5'
                          }`}
                        >
                          <span className="font-bold">{lt(m.title, lang)}</span>
                          <span className="text-[10px] text-white/30 ml-2">{m.kpId}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-white/10 shrink-0">
                  <button
                    onClick={handlePush}
                    disabled={!selectedMissionId || pushing}
                    className={`w-full py-3 font-black rounded-xl transition-colors ${
                      selectedMissionId && !pushing
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {pushing ? (en ? 'Pushing...' : '推送中...') : (en ? 'Push to Class' : '推送给全班')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
