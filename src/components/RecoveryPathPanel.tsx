/**
 * RecoveryPathPanel — visual recovery journey from deepest root → corrupted origin
 *
 * Shows a vertical chain of steps, each representing a weak prerequisite skill
 * that must be repaired before the student can return to the original corrupted topic.
 */
import { motion } from 'motion/react';
import { CheckCircle2, Lock, Zap, AlertTriangle, ChevronLeft, Target } from 'lucide-react';
import type { Language } from '../types';
import type { Mission } from '../types';
import type { RecoverySession } from '../utils/recoveryPath';
import { getCurrentStep, isRecoveryComplete } from '../utils/recoveryPath';
import { getTopicInfo } from '../utils/techTree';
import { lt } from '../i18n/resolveText';
import { toTraditional } from '../i18n/zhHantMap';

const ERROR_SYMBOLS: Record<string, string> = {
  sign: '±',
  rounding: '≈',
  magnitude: '×10',
  method: '?',
  unknown: '!',
};

export function RecoveryPathPanel({
  lang,
  session,
  missions,
  onStartStep,
  onCancel,
  onComplete,
}: {
  lang: Language;
  session: RecoverySession;
  missions: Mission[];
  onStartStep: (missionId: number) => void;
  onCancel: () => void;
  onComplete?: () => void;
}) {
  const current = getCurrentStep(session);
  const complete = isRecoveryComplete(session);
  const completedCount = session.steps.filter(s => s.completed).length;
  const totalSteps = session.steps.length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  // Origin topic info for header
  const originInfo = getTopicInfo(session.originTopicId);
  const originName = originInfo
    ? (lang === 'en' ? originInfo.topic.title : lang === 'zh_TW' ? toTraditional(originInfo.topic.titleZh) : originInfo.topic.titleZh)
    : session.originTopicId;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', bounce: 0.2 }}
      className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <button onClick={onCancel} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors" aria-label="Go back">
          <ChevronLeft size={20} className="text-white/60" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white">
            {lt({ zh: '修复路径', en: 'Recovery Path' }, lang)}
          </h3>
          <p className="text-[10px] text-rose-400 truncate">
            {originName} · {ERROR_SYMBOLS[session.originErrorType] ?? '!'} {lt({ zh: '错误', en: 'errors' }, lang)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-400">{completedCount}/{totalSteps}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-emerald-400 rounded-r-full"
        />
      </div>

      {/* Step chain */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0">
        {session.steps.map((step, i) => {
          const isCompleted = step.completed;
          const isActive = i === session.currentStepIdx && !complete;
          const isLocked = i > session.currentStepIdx;
          const isOrigin = i === session.steps.length - 1;

          const topicInfo = getTopicInfo(step.topicId);
          const topicName = topicInfo
            ? (lang === 'en' ? topicInfo.topic.title : lang === 'zh_TW' ? toTraditional(topicInfo.topic.titleZh) : topicInfo.topic.titleZh)
            : step.topicId;
          const reason = lang === 'en' ? step.reason.en : lang === 'zh_TW' ? toTraditional(step.reason.zh) : step.reason.zh;

          return (
            <div key={step.topicId} className="flex flex-col items-stretch">
              {/* Connecting line (not on first step) */}
              {i > 0 && (
                <div className="flex justify-center">
                  <div className={`w-0.5 h-5 ${
                    isCompleted || (isActive && session.steps[i - 1]?.completed) ? 'bg-emerald-400/40' :
                    isActive ? 'bg-amber-400/30' :
                    'bg-white/5'
                  }`} />
                </div>
              )}

              {/* Step card */}
              <motion.div
                initial={isActive ? { scale: 0.98 } : false}
                animate={isActive ? { scale: 1 } : undefined}
                className={`relative rounded-xl border-2 p-3 transition-all ${
                  isCompleted ? 'border-emerald-400/40 bg-emerald-950/30' :
                  isActive ? 'border-amber-400/50 bg-amber-950/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]' :
                  'border-white/5 bg-slate-800/40 opacity-50'
                }`}
              >
                {/* Origin badge */}
                {isOrigin && (
                  <div className="absolute -top-2 right-3 px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 rounded-full">
                    <span className="text-[9px] text-rose-400 font-bold flex items-center gap-1">
                      <Target size={8} />
                      {lt({ zh: '原始节点', en: 'Origin' }, lang)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Status icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-emerald-500/20' :
                    isActive ? 'bg-amber-500/20' :
                    'bg-white/5'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={14} className="text-emerald-400" /> :
                     isActive ? <Zap size={14} className="text-amber-400" /> :
                     <Lock size={12} className="text-white/30" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold ${
                        isCompleted ? 'text-emerald-400' :
                        isActive ? 'text-amber-400' :
                        'text-white/30'
                      }`}>{step.topicId}</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                        isCompleted ? 'bg-emerald-500/10 text-emerald-400/60' :
                        isActive ? 'bg-amber-500/10 text-amber-400' :
                        'bg-white/5 text-white/30'
                      }`}>{ERROR_SYMBOLS[step.errorType] ?? '!'}</span>
                    </div>
                    <p className={`text-xs font-bold truncate ${
                      isCompleted ? 'text-emerald-300/80' :
                      isActive ? 'text-white' :
                      'text-white/30'
                    }`}>{topicName}</p>
                    <p className={`text-[10px] truncate ${
                      isCompleted ? 'text-emerald-400/40' :
                      isActive ? 'text-white/50' :
                      'text-white/25'
                    }`}>{reason}</p>
                  </div>

                  {/* Step number */}
                  <span className={`text-[10px] font-bold flex-shrink-0 ${
                    isCompleted ? 'text-emerald-400/50' :
                    isActive ? 'text-amber-400/60' :
                    'text-white/10'
                  }`}>
                    {i + 1}/{totalSteps}
                  </span>
                </div>

                {/* Practice button for active step */}
                {isActive && (
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => onStartStep(step.missionId)}
                    className="mt-2 w-full py-3 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Zap size={12} />
                    {lt({ zh: '开始练习', en: 'Start Practice' }, lang)}
                  </motion.button>
                )}
              </motion.div>
            </div>
          );
        })}

        {/* Completion message */}
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-center"
          >
            <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-300">
              {lt({ zh: '修复路径完成！', en: 'Recovery Complete!' }, lang)}
            </p>
            <p className="text-[10px] text-emerald-400/60 mt-1">
              {lt({ zh: '所有薄弱知识点已修复，可以继续推进。', en: 'All weak skills repaired. Ready to advance.' }, lang)}
            </p>
            {onComplete && (
              <button
                onClick={onComplete}
                className="mt-3 px-8 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-500 transition-colors"
              >
                {lt({ zh: '继续推进', en: 'Continue' }, lang)}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onCancel}
          className="w-full py-2 rounded-lg bg-white/5 text-white/40 text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
        >
          <AlertTriangle size={10} />
          {lt({ zh: '放弃修复路径', en: 'Abandon Recovery' }, lang)}
        </button>
      </div>
    </motion.div>
  );
}
