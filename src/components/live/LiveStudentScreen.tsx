/**
 * LiveStudentScreen — Student view for live classroom sessions.
 * States: waiting → answering → answered → session ended.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Radio, Clock, CheckCircle2, XCircle, Trophy, BookOpen, Loader2 } from 'lucide-react';
import type { Language, Room, Mission } from '../../types';
import type { LiveQuestion } from '../../types';
import { lt, tt } from '../../i18n/resolveText';
import { LatexText } from '../MathView';
import { CharacterAvatar } from '../CharacterAvatar';
import { InputFields } from '../MathBattle/InputFields';
import { MultipleChoice } from '../MathBattle/MultipleChoice';
import { INPUT_FIELDS } from '../MathBattle/inputConfig';
import { checkAnswer } from '../../utils/checkCorrectness';
import { diagnoseError } from '../../utils/diagnoseError';
import { getMistakes, recordErrors } from '../../utils/errorMemory';
import type { ErrorType } from '../../utils/diagnoseError';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { loadMissionById } from '../../hooks/useMissions';
import { renderDiagram } from '../../utils/renderDiagram';

type Props = {
  lang: Language;
  room: Room;
  userId: string;
  questionIndex: number;
  completedMissions: Record<string, unknown>;
  onSubmitResponse: (answer: Record<string, string>, isCorrect: boolean, errorType?: string, durationMs?: number) => Promise<string>;
  onUpdateMistakes: (mistakes: Record<string, unknown>) => void;
  onClose: () => void;
};

/** Interpolate {key} placeholders in story text with data values.
 *  Only replaces keys that exist in the data object.
 *  Preserves LaTeX braces like \frac{1}{4}, single-letter math vars {a},{b},
 *  and LaTeX commands {pmatrix}. */
// Common aliases: story templates sometimes use different names than generator data keys
const STORY_ALIASES: Record<string, string> = { favorable: 'target' };

function interpolateStory(text: string, data: Record<string, unknown>): string {
  return text.replace(/\{([a-zA-Z]\w*)\}/g, (match, key) => {
    if (key in data) return String(data[key]);
    const alias = STORY_ALIASES[key];
    if (alias && alias in data) return String(data[alias]);
    return match;
  });
}

export function LiveStudentScreen({ lang, room, userId, questionIndex, completedMissions, onSubmitResponse, onUpdateMistakes, onClose }: Props) {
  useEscapeKey(onClose);
  const en = lang === 'en';
  const currentQ = room.liveMeta?.current_question;
  const timerSecs = room.liveMeta?.timer_secs;
  const isSessionEnded = room.status === 'finished';
  const myPlayer = room.players[userId];

  // Load mission template by ID (handles cross-grade: teacher Y8 → student Y7)
  const [baseMission, setBaseMission] = useState<Mission | null>(null);
  useEffect(() => {
    if (!currentQ?.mission_id) { setBaseMission(null); return; }
    loadMissionById(currentQ.mission_id).then(m => setBaseMission(m));
  }, [currentQ?.mission_id]);

  // Merge generated data from teacher into mission template
  const effectiveMission = useMemo(() => {
    if (!baseMission) return null;
    const genData = currentQ?.generated_data;
    if (!genData) return baseMission;
    return { ...baseMission, data: { ...baseMission.data, ...genData } };
  }, [baseMission, currentQ?.generated_data]);

  // ─── Answer state ───
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; expected?: Record<string, string> } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const questionStartRef = useRef<number>(0);
  const lastQuestionIndexRef = useRef<number>(-1);

  // Auto-close after session ends (give 10s to see final ranking)
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!isSessionEnded) return;
    const timer = setTimeout(() => onCloseRef.current(), 10000);
    return () => clearTimeout(timer);
  }, [isSessionEnded]);

  // Reset state when new question arrives
  useEffect(() => {
    if (questionIndex !== lastQuestionIndexRef.current && questionIndex > 0) {
      lastQuestionIndexRef.current = questionIndex;
      setInputs({});
      setSubmitted(false);
      setResult(null);
      setMcSelected(null);
      questionStartRef.current = Date.now();
    }
  }, [questionIndex]);

  // ─── Timer countdown ───
  const [countdown, setCountdown] = useState<number | null>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (!currentQ || !timerSecs || submitted) { setCountdown(null); return; }
    const tick = () => {
      const elapsed = (Date.now() - currentQ.pushed_at) / 1000;
      const remaining = Math.max(0, timerSecs - elapsed);
      setCountdown(Math.ceil(remaining));
      if (remaining <= 0 && !submitted) {
        handleSubmitRef.current(); // use ref to avoid stale closure
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [currentQ?.pushed_at, timerSecs, submitted]);

  const handleSubmit = async () => {
    if (submitted || submitting || !effectiveMission || !currentQ) return;
    setSubmitting(true);
    const durationMs = Date.now() - questionStartRef.current;

    // Check answer locally with full result (correct, partial, expected)
    const checkResult = checkAnswer(effectiveMission, inputs);
    const isCorrect = checkResult.correct;

    // Diagnose error type using real comparison
    let errorType: string | undefined;
    if (!isCorrect) {
      const diagnosis = diagnoseError(inputs, checkResult.expected, checkResult.partial);
      errorType = diagnosis.type;
    }

    setResult({ correct: isCorrect, expected: checkResult.expected });
    setSubmitted(true);

    // Bridge errors to errorMemory for cross-product recommendations
    if (!isCorrect && effectiveMission.id && errorType) {
      const mistakes = getMistakes(completedMissions);
      const updated = recordErrors(mistakes, effectiveMission.id, [errorType as ErrorType]);
      onUpdateMistakes({ ...completedMissions, _mistakes: updated });
    }

    // Submit to server
    await onSubmitResponse(inputs, isCorrect, errorType, durationMs);
    setSubmitting(false);
  };
  handleSubmitRef.current = handleSubmit;

  // ─── Leaderboard (from room.players) ───
  const leaderboard = useMemo(() => {
    return Object.entries(room.players)
      .filter(([uid]) => uid !== room.hostId)
      .map(([uid, p]) => ({ uid, name: p.name, score: p.score, charId: p.charId }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [room.players, room.hostId]);

  const myRank = leaderboard.findIndex(e => e.uid === userId) + 1;

  // ─── Check if this is a multiple-choice question ───
  const hasChoices = !!(effectiveMission?.data?.choices);
  const [mcSelected, setMcSelected] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 overflow-y-auto">
      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-4 pb-20">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-rose-400 animate-pulse" />
            <span className="text-sm font-black text-white">{tt(lang, 'Live Classroom', '实时课堂')}</span>
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
            <p className="text-white/60 font-bold">{tt(lang, 'Waiting for teacher to push a question...', '等待老师推送题目...')}</p>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] text-white/30 font-bold uppercase mb-2">{tt(lang, 'Class Ranking', '班级排名')}</p>
              {leaderboard.map((e, i) => (
                <div key={e.uid} className={`flex items-center gap-2 py-1.5 ${e.uid === userId ? 'text-indigo-300' : 'text-white/60'}`}>
                  <span className="w-5 text-xs font-bold">{i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}</span>
                  <CharacterAvatar characterId={e.charId || ''} size={20} />
                  <span className="flex-1 text-xs font-bold truncate">{e.name}</span>
                  <span className="text-xs font-bold text-yellow-400">{e.score}</span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-white/20 text-xs py-4">{tt(lang, 'No scores yet', '暂无分数')}</p>
              )}
            </div>
          </div>
        )}

        {/* ─── State: Answering ─── */}
        {currentQ && !isSessionEnded && effectiveMission && (
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
                Q{questionIndex} · {effectiveMission.topic}
              </p>
              <div className="text-white font-bold mb-3">
                <LatexText text={interpolateStory(lt(effectiveMission.description, lang), effectiveMission.data)} className="text-white" />
              </div>
              {effectiveMission.story && (
                <p className="text-white/40 text-xs italic">
                  <LatexText text={interpolateStory(lt(effectiveMission.story, lang), effectiveMission.data)} className="text-white/40" />
                </p>
              )}
            </div>

            {/* SVG Diagram (coordinates, triangles, graphs, etc.) */}
            {(() => {
              const diagram = renderDiagram(effectiveMission, 'amber', 999);
              return diagram ? (
                <div className="bg-white rounded-2xl p-4 border border-white/10">
                  {diagram}
                </div>
              ) : null;
            })()}

            {/* Input or Result */}
            {!submitted ? (
              <div className="space-y-3">
                {hasChoices ? (
                  <MultipleChoice
                    choices={effectiveMission.data.choices}
                    onSelect={(value) => {
                      const mcInputs = { ans: value };
                      setInputs(mcInputs);
                      setMcSelected(effectiveMission.data.choices.findIndex((c: any) => c.value === value));
                      // Auto-submit MC: use direct check instead of handleSubmit to avoid stale closure
                      if (!submitted && !submitting && effectiveMission && currentQ) {
                        setSubmitting(true);
                        const durationMs = Date.now() - questionStartRef.current;
                        const cr = checkAnswer(effectiveMission, mcInputs);
                        let et: string | undefined;
                        if (!cr.correct) { et = diagnoseError(mcInputs, cr.expected, cr.partial).type; }
                        setResult({ correct: cr.correct, expected: cr.expected });
                        setSubmitted(true);
                        if (!cr.correct && effectiveMission.id && et) {
                          const m = getMistakes(completedMissions);
                          onUpdateMistakes({ ...completedMissions, _mistakes: recordErrors(m, effectiveMission.id, [et as ErrorType]) });
                        }
                        onSubmitResponse(mcInputs, cr.correct, et, durationMs).then(() => setSubmitting(false));
                      }
                    }}
                    disabled={submitting}
                    lang={lang}
                    selectedIndex={mcSelected}
                  />
                ) : (
                  <>
                    <InputFields
                      mission={{ ...effectiveMission, tutorialSteps: undefined } as any}
                      inputs={inputs}
                      setInputs={setInputs}
                      difficultyMode="green"
                      tutorialStep={0}
                      isTutorial={false}
                      lang={lang}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !Object.values(inputs).some(v => (v as string).trim())}
                      className={`w-full py-4 font-black text-lg rounded-xl transition-colors ${
                        submitting || !Object.values(inputs).some(v => (v as string).trim())
                          ? 'bg-white/10 text-white/30 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {submitting ? (tt(lang, 'Submitting...', '提交中...')) : (tt(lang, 'Submit', '提交'))}
                    </button>
                  </>
                )}
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
                    <p className="text-emerald-400 font-black text-xl">{tt(lang, 'Correct!', '答对了！')}</p>
                  </>
                ) : (
                  <>
                    <XCircle size={48} className="text-rose-400 mx-auto mb-2" />
                    <p className="text-rose-400 font-black text-xl">{tt(lang, 'Incorrect', '答错了')}</p>
                    {result?.expected && Object.keys(result.expected).length > 0 && (
                      <p className="text-white/40 text-sm mt-2">
                        {tt(lang, 'Answer: ', '正确答案：')}{Object.values(result.expected).join(', ')}
                      </p>
                    )}
                  </>
                )}
                <p className="text-white/30 text-xs mt-3">{tt(lang, 'Waiting for next question...', '等待下一题...')}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* ─── State: Session Ended ─── */}
        {isSessionEnded && (
          <div className="text-center py-8 space-y-6">
            <Trophy size={48} className="text-yellow-400 mx-auto" />
            <h2 className="text-2xl font-black text-white">{tt(lang, 'Session Complete!', '课堂结束！')}</h2>

            {/* Final ranking */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
              <p className="text-[10px] text-white/30 font-bold uppercase mb-3">{tt(lang, 'Final Ranking', '最终排名')}</p>
              {leaderboard.map((e, i) => (
                <div key={e.uid} className={`flex items-center gap-3 py-2 ${e.uid === userId ? 'text-indigo-300 bg-indigo-500/10 -mx-2 px-2 rounded-lg' : 'text-white/60'}`}>
                  <span className="w-6 text-center font-black">{i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}</span>
                  <CharacterAvatar characterId={e.charId || ''} size={28} />
                  <span className="flex-1 font-bold text-sm truncate">{e.name}{e.uid === userId ? (tt(lang, ' (You)', ' (我)')) : ''}</span>
                  <span className="font-black text-yellow-400">{e.score}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-colors"
            >
              {tt(lang, 'Back to Map', '返回地图')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
