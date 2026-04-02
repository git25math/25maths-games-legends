/**
 * LiveStudentScreen — Student view for live classroom sessions.
 * States: waiting → answering → answered → session ended.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Radio, Clock, CheckCircle2, XCircle, Trophy, BookOpen, Loader2 } from 'lucide-react';
import type { Language, Room, Mission } from '../../types';
import type { LiveQuestion } from '../../types';
import { lt } from '../../i18n/resolveText';
import { LatexText } from '../MathView';
import { CharacterAvatar } from '../CharacterAvatar';
import { checkCorrectness as checkAnswer } from '../../utils/checkCorrectness';
import { useEscapeKey } from '../../hooks/useEscapeKey';

type Props = {
  lang: Language;
  room: Room;
  userId: string;
  mission: Mission | null;
  questionIndex: number;
  onSubmitResponse: (answer: Record<string, string>, isCorrect: boolean, errorType?: string, durationMs?: number) => Promise<string>;
  onClose: () => void;
};

export function LiveStudentScreen({ lang, room, userId, mission, questionIndex, onSubmitResponse, onClose }: Props) {
  useEscapeKey(onClose);
  const en = lang === 'en';
  const currentQ = room.liveMeta?.current_question;
  const timerSecs = room.liveMeta?.timer_secs;
  const isSessionEnded = room.status === 'finished';
  const myPlayer = room.players[userId];

  // ─── Answer state ───
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const questionStartRef = useRef<number>(0);
  const lastQuestionIndexRef = useRef<number>(-1);

  // Reset state when new question arrives
  useEffect(() => {
    if (questionIndex !== lastQuestionIndexRef.current && questionIndex > 0) {
      lastQuestionIndexRef.current = questionIndex;
      setInputs({});
      setSubmitted(false);
      setResult(null);
      questionStartRef.current = Date.now();
    }
  }, [questionIndex]);

  // ─── Timer countdown ───
  const [countdown, setCountdown] = useState<number | null>(null);
  useEffect(() => {
    if (!currentQ || !timerSecs || submitted) { setCountdown(null); return; }
    const tick = () => {
      const elapsed = (Date.now() - currentQ.pushed_at) / 1000;
      const remaining = Math.max(0, timerSecs - elapsed);
      setCountdown(Math.ceil(remaining));
      if (remaining <= 0 && !submitted) {
        handleSubmit(); // auto-submit on timeout
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [currentQ?.pushed_at, timerSecs, submitted]);

  const handleSubmit = async () => {
    if (submitted || submitting || !mission || !currentQ) return;
    setSubmitting(true);
    const durationMs = Date.now() - questionStartRef.current;

    // Check answer locally
    const isCorrect = checkAnswer(mission, inputs);

    setResult({ correct: isCorrect });
    setSubmitted(true);

    // Submit to server
    await onSubmitResponse(inputs, isCorrect, isCorrect ? undefined : 'method', durationMs);
    setSubmitting(false);
  };

  // ─── Leaderboard (from room.players) ───
  const leaderboard = useMemo(() => {
    return Object.entries(room.players)
      .filter(([uid]) => uid !== room.hostId)
      .map(([uid, p]) => ({ uid, name: p.name, score: p.score, charId: p.charId }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [room.players, room.hostId]);

  const myRank = leaderboard.findIndex(e => e.uid === userId) + 1;

  // ─── INPUT FIELDS from mission config ───
  const inputFields = mission?.data?.choices
    ? null // MC questions handled differently
    : [{ id: 'ans', label: en ? 'Answer' : '答案', placeholder: '' }]; // simplified for MVP

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 overflow-y-auto">
      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-4 pb-20">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-rose-400 animate-pulse" />
            <span className="text-sm font-black text-white">{en ? 'Live Classroom' : '实时课堂'}</span>
            <span className="text-xs text-white/40">{room.liveMeta?.class_tag}</span>
          </div>
          {myRank > 0 && (
            <span className="text-xs font-bold text-indigo-400">#{myRank} · {myPlayer?.score ?? 0} pts</span>
          )}
        </div>

        {/* ─── State: Waiting for question ─── */}
        {!currentQ && !isSessionEnded && (
          <div className="text-center py-16 space-y-4">
            <Loader2 size={40} className="text-indigo-400 mx-auto animate-spin" />
            <p className="text-white/60 font-bold">{en ? 'Waiting for teacher to push a question...' : '等待老师推送题目...'}</p>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] text-white/30 font-bold uppercase mb-2">{en ? 'Class Ranking' : '班级排名'}</p>
              {leaderboard.map((e, i) => (
                <div key={e.uid} className={`flex items-center gap-2 py-1.5 ${e.uid === userId ? 'text-indigo-300' : 'text-white/60'}`}>
                  <span className="w-5 text-xs font-bold">{i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}</span>
                  <CharacterAvatar characterId={e.charId || ''} size={20} />
                  <span className="flex-1 text-xs font-bold truncate">{e.name}</span>
                  <span className="text-xs font-bold text-yellow-400">{e.score}</span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-white/20 text-xs py-4">{en ? 'No scores yet' : '暂无分数'}</p>
              )}
            </div>
          </div>
        )}

        {/* ─── State: Answering ─── */}
        {currentQ && !isSessionEnded && mission && (
          <div className="space-y-4">
            {/* Timer */}
            {countdown !== null && !submitted && (
              <div className="flex items-center justify-center gap-2">
                <Clock size={16} className={countdown <= 10 ? 'text-rose-400' : 'text-white/40'} />
                <span className={`text-2xl font-black ${countdown <= 10 ? 'text-rose-400' : 'text-white'}`}>{countdown}s</span>
              </div>
            )}

            {/* Question */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-2">
                Q{questionIndex} · {mission.topic}
              </p>
              <div className="text-white font-bold mb-3">
                <LatexText text={lt(mission.description, lang)} className="text-white" />
              </div>
              {mission.data?.story && (
                <p className="text-white/40 text-xs italic">{lt(mission.story, lang)}</p>
              )}
            </div>

            {/* Input or Result */}
            {!submitted ? (
              <div className="space-y-3">
                {inputFields?.map(field => (
                  <input
                    key={field.id}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder={field.placeholder || (en ? 'Your answer' : '你的答案')}
                    value={inputs[field.id] || ''}
                    onChange={e => setInputs({ ...inputs, [field.id]: e.target.value })}
                    className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-xl font-bold placeholder-white/20 focus:border-indigo-400 focus:bg-white/15 outline-none transition-all"
                  />
                ))}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !Object.values(inputs).some(v => (v as string).trim())}
                  className={`w-full py-4 font-black text-lg rounded-xl transition-colors ${
                    submitting || !Object.values(inputs).some(v => (v as string).trim())
                      ? 'bg-white/10 text-white/30 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {submitting ? (en ? 'Submitting...' : '提交中...') : (en ? 'Submit' : '提交')}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl p-6 text-center border-2 ${
                  result?.correct
                    ? 'bg-emerald-500/10 border-emerald-400/30'
                    : 'bg-rose-500/10 border-rose-400/30'
                }`}
              >
                {result?.correct ? (
                  <>
                    <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-2" />
                    <p className="text-emerald-400 font-black text-xl">{en ? 'Correct!' : '答对了！'}</p>
                  </>
                ) : (
                  <>
                    <XCircle size={48} className="text-rose-400 mx-auto mb-2" />
                    <p className="text-rose-400 font-black text-xl">{en ? 'Incorrect' : '答错了'}</p>
                  </>
                )}
                <p className="text-white/30 text-xs mt-3">{en ? 'Waiting for next question...' : '等待下一题...'}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* ─── State: Session Ended ─── */}
        {isSessionEnded && (
          <div className="text-center py-8 space-y-6">
            <Trophy size={48} className="text-yellow-400 mx-auto" />
            <h2 className="text-2xl font-black text-white">{en ? 'Session Complete!' : '课堂结束！'}</h2>

            {/* Final ranking */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
              <p className="text-[10px] text-white/30 font-bold uppercase mb-3">{en ? 'Final Ranking' : '最终排名'}</p>
              {leaderboard.map((e, i) => (
                <div key={e.uid} className={`flex items-center gap-3 py-2 ${e.uid === userId ? 'text-indigo-300 bg-indigo-500/10 -mx-2 px-2 rounded-lg' : 'text-white/60'}`}>
                  <span className="w-6 text-center font-black">{i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}</span>
                  <CharacterAvatar characterId={e.charId || ''} size={28} />
                  <span className="flex-1 font-bold text-sm truncate">{e.name}{e.uid === userId ? (en ? ' (You)' : ' (我)') : ''}</span>
                  <span className="font-black text-yellow-400">{e.score}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-colors"
            >
              {en ? 'Back to Map' : '返回地图'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
