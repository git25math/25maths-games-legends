/**
 * ResultOverlay — Victory (5-phase) + Defeat screens (v8.4 refactor)
 */
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, Trophy, Heart, CheckCircle2, BookOpen } from 'lucide-react';
import type { Mission, Character, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { lt, resolveFormula } from '../../i18n/resolveText';
import { CharacterAvatar } from '../CharacterAvatar';
import { AnimatedCounter } from '../AnimatedCounter';
import { SkillBadgeCard } from '../SkillBadgeCard';
import type { BattleMode } from '../BattleModeSelector';
import { getExamHubLessonUrl } from '../../utils/lessonMap';

type Props = {
  showResult: 'none' | 'success' | 'fail';
  victoryPhase: 0 | 1 | 2 | 3 | 4 | 5;
  mission: Mission;
  character: Character;
  lang: Language;
  battleMode: BattleMode;
  isMultiQuestion: boolean;
  isFirstClear: boolean;
  completedDifficulties: Record<string, boolean>;
  difficultyMode: string;
  finalScore: number;
  finalDuration: number;
  correctCount: number;
  currentQIdx: number;
  hp: number;
  encouragement: string;
  onAchievementClose: () => void;
  onRetry: () => void;
  canRetry?: boolean;
  retryCount?: number;
  maxRetries?: number;
  onGiveUp?: () => void;
};

export function ResultOverlay({
  showResult, victoryPhase, mission, character, lang, battleMode,
  isMultiQuestion, isFirstClear, completedDifficulties, difficultyMode,
  finalScore, finalDuration, correctCount, currentQIdx, hp,
  encouragement, onAchievementClose, onRetry,
  canRetry = true, retryCount = 0, maxRetries = 2, onGiveUp,
}: Props) {
  if (showResult === 'none') return null;

  const t = translations[lang];
  const willBePerfect = Object.values({ ...completedDifficulties, [difficultyMode]: true }).filter(Boolean).length === 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center z-20 overflow-hidden ${
          showResult === 'success' ? 'bg-transparent' : 'bg-ink/90'
        }`}
      >
        {showResult === 'success' ? (
          <>
            {/* Phase A: Background & Shockwave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black pointer-events-none"
            />
            {victoryPhase >= 1 && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 m-auto w-[300px] h-[300px] rounded-full border-[20px] border-yellow-400 pointer-events-none"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.2)_0%,transparent_70%)] pointer-events-none" />
              </>
            )}

            {/* Phase B: Badge Drop */}
            {victoryPhase >= 2 && (
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ y: -200, scale: 1.5, rotateZ: -15 }}
                  animate={{ y: 0, scale: 1, rotateZ: 0 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="relative"
                >
                  {/* First Clear / Perfect Clear Halo */}
                  {(isFirstClear || willBePerfect) && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className={`absolute -inset-8 rounded-full border-4 border-dashed opacity-50 ${willBePerfect ? 'border-purple-400' : 'border-yellow-400'}`}
                    />
                  )}
                  <div className={`w-32 h-32 rounded-full border-8 shadow-2xl flex items-center justify-center overflow-hidden ${willBePerfect ? 'border-purple-500 bg-gradient-to-br from-yellow-400 to-purple-600' : 'border-yellow-500 bg-gradient-to-br from-ink to-ink-light'}`}>
                    <CharacterAvatar characterId={character.id} size={96} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6"
                >
                  <h3 className="text-4xl md:text-6xl font-black text-ink mb-2 drop-shadow-md">
                    {willBePerfect ? (lang === 'zh' ? '完美通关！' : lang === 'zh_TW' ? '完美通關！' : 'Perfect Clear!') : t.successTitle}
                  </h3>
                  {(isFirstClear || willBePerfect) && (
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`font-black text-xl tracking-widest ${willBePerfect ? 'text-purple-600' : 'text-yellow-600'}`}
                    >
                      {willBePerfect ? (lang === 'zh' ? '三星达成！' : lang === 'zh_TW' ? '三星達成！' : '3 Stars Achieved!') : (lang === 'zh' ? '首次通关！' : lang === 'zh_TW' ? '首次通關！' : 'First Clear!')}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            )}

            {/* Phase C: Stats Bubbles */}
            {victoryPhase >= 3 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex gap-4 mt-8 z-10"
              >
                {[
                  { icon: <Trophy size={20} className="text-yellow-600" />, label: lang === 'zh' ? '得分' : lang === 'zh_TW' ? '得分' : 'Score', value: finalScore, color: 'bg-yellow-100 border-yellow-300' },
                  { icon: <span className="text-xl">⏱️</span>, label: lang === 'zh' ? '用时' : lang === 'zh_TW' ? '用時' : 'Time', value: `${finalDuration}s`, color: 'bg-blue-100 border-blue-300' },
                  battleMode === 'marathon' || battleMode === 'speed'
                    ? { icon: <CheckCircle2 size={20} className="text-emerald-500" />, label: lang === 'zh' ? '正确率' : lang === 'zh_TW' ? '正確率' : 'Accuracy', value: `${correctCount}/${isMultiQuestion ? currentQIdx + 1 : 1}`, color: 'bg-emerald-100 border-emerald-300' }
                    : { icon: <Heart size={20} className="text-red-500 fill-red-500" />, label: lang === 'zh' ? '剩余体力' : lang === 'zh_TW' ? '剩餘體力' : 'HP Left', value: hp, color: 'bg-red-100 border-red-300' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.4 + i * 0.2 }}
                    className={`flex flex-col items-center p-3 md:p-4 rounded-2xl border-2 shadow-lg w-24 md:w-32 ${stat.color}`}
                  >
                    <div className="mb-1">{stat.icon}</div>
                    <div className="text-[10px] font-bold text-ink/60 uppercase">{stat.label}</div>
                    <div className="text-xl font-black text-ink mt-1">
                      {typeof stat.value === 'number' && i === 0 ? (
                        <AnimatedCounter value={stat.value} />
                      ) : (
                        stat.value
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Phase D: Skill Badge */}
            <AnimatePresence>
              {victoryPhase === 4 && mission.skillName && (
                <motion.div
                  key="skill-badge"
                  exit={{ scale: 0.5, opacity: 0, y: -50 }}
                  className="absolute inset-0 z-20"
                >
                  <SkillBadgeCard
                    characterId={character.id}
                    skillName={mission.skillName}
                    skillSummary={mission.skillSummary || ''}
                    formula={resolveFormula(mission.secret.formula, lang)}
                    missionTitle={mission.title}
                    lang={lang}
                    onClose={() => {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip button: appears after badge drop (phase 2-4) before return button */}
            {victoryPhase >= 2 && victoryPhase < 5 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
                onClick={onAchievementClose}
                className="absolute bottom-8 px-6 py-2.5 bg-white/10 text-white/60 text-sm font-bold rounded-xl hover:bg-white/20 transition-colors z-30 backdrop-blur-sm"
              >
                {lang === 'en' ? 'Skip →' : '跳过 →'}
              </motion.button>
            )}

            {/* Phase E: Return Button */}
            {victoryPhase >= 5 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onAchievementClose}
                className="absolute bottom-8 px-12 py-5 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-indigo-500 transition-colors z-30"
              >
                {t.backToMap}
              </motion.button>
            )}
          </>
        ) : (
          <motion.div initial={{ y: 50 }} animate={{ y: 0 }}>
            <XCircle size={80} className="text-red-500 mb-6 mx-auto" />
            <h3 className="text-3xl md:text-5xl font-black text-white mb-4">{t.failTitle}</h3>
            <p className="text-slate-400 mb-2">{t.failDesc}</p>
            {mission.storyConsequence ? (
              <p className="text-amber-400 font-bold mb-8 italic">{lt(mission.storyConsequence.wrong, lang)}</p>
            ) : (
              <p className="text-indigo-400 font-bold mb-8 italic">"{encouragement}"</p>
            )}
            {canRetry ? (
              <div className="space-y-3">
                <button
                  onClick={onRetry}
                  className="px-12 py-5 bg-red-700 text-white font-black rounded-xl shadow-xl hover:bg-red-600 transition-all"
                >
                  {t.retry}
                </button>
                <p className="text-slate-500 text-sm">
                  {lang === 'en'
                    ? `${maxRetries - retryCount} ${maxRetries - retryCount === 1 ? 'retry' : 'retries'} left`
                    : `还剩 ${maxRetries - retryCount} 次重试机会`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-amber-400 font-bold text-lg">
                  {lang === 'en'
                    ? "No retries left. That's OK — every master was once a beginner."
                    : '重试机会用完了。没关系——每个高手都曾经是新手。'}
                </p>
                {(() => {
                  const lessonUrl = mission.kpId ? getExamHubLessonUrl(mission.kpId) : null;
                  return lessonUrl ? (
                    <a
                      href={lessonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-10 py-5 bg-purple-700 text-white font-black rounded-xl shadow-xl hover:bg-purple-600 transition-all"
                    >
                      <BookOpen size={20} />
                      {lang === 'en' ? 'Learn This Skill' : '去学会这个技能'}
                    </a>
                  ) : null;
                })()}
                {onGiveUp && (
                  <div>
                    <button
                      onClick={onGiveUp}
                      className="px-10 py-3 bg-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-600/50 transition-all text-sm"
                    >
                      {lang === 'en' ? 'Back to Map' : '返回地图'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
