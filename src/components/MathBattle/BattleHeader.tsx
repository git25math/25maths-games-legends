/**
 * BattleHeader — Top bar of MathBattle (v8.4 refactor)
 * Shows character avatar, title, HP/timer, streak, badges, progress, controls.
 */
import { Shield, Swords, Zap, Volume2, VolumeX, XCircle, Flame, Eye, Heart, CheckCircle2 } from 'lucide-react';
import type { Mission, Character, Language, DifficultyMode, Room } from '../../types';
import { translations } from '../../i18n/translations';
import { lt } from '../../i18n/resolveText';
import { CharacterAvatar } from '../CharacterAvatar';
import { CHARACTERS } from '../../data/characters';
import { SKILL_CARDS } from '../SkillCardSelector';
import type { BattleMode } from '../BattleModeSelector';

type Props = {
  mission: Mission;
  character: Character;
  lang: Language;
  difficultyMode: DifficultyMode;
  battleMode: BattleMode;
  hp: number;
  streak: number;
  isMultiQuestion: boolean;
  isMultiplayer: boolean;
  isDailyChallenge: boolean;
  dailyMultiplier: number;
  skillCard: string | null;
  shieldCharges: number;
  speedTimeLeft: number;
  currentQIdx: number;
  correctCount: number;
  totalQuestions: number;
  questionQueueLength: number;
  showResult: 'none' | 'success' | 'fail';
  muted: boolean;
  toggleMute: () => void;
  onCancel: () => void;
  /** PK only — live room snapshot for opponent status display. */
  roomData?: Room | null;
  /** PK only — identifies "me" vs opponent in roomData.players. */
  currentUserId?: string;
};

export function BattleHeader({
  mission, character, lang, difficultyMode, battleMode,
  hp, streak, isMultiQuestion, isMultiplayer, isDailyChallenge, dailyMultiplier,
  skillCard, shieldCharges, speedTimeLeft,
  currentQIdx, correctCount, totalQuestions, questionQueueLength, showResult,
  muted, toggleMute, onCancel,
  roomData, currentUserId,
}: Props) {
  const t = translations[lang];

  // Opponent snapshot (PK only). Uses finishedAt to distinguish "still playing"
  // vs "finished" — in-progress scores aren't broadcast (the player's own
  // totalScore is local until submit), so "live streak" can't be shown, but
  // "they finished before you" is visible the moment their submit lands.
  const opponent = (isMultiplayer && roomData?.players && currentUserId)
    ? Object.entries(roomData.players).find(([uid]) => uid !== currentUserId)
    : null;
  const opponentEntry = opponent?.[1] as (Room['players'][string] & { finishedAt?: number }) | undefined;
  const opponentFinished = !!opponentEntry?.finishedAt;

  return (
    <div className="bg-[#3d2b1f] p-4 text-[#f4e4bc] flex justify-between items-center border-b-4 border-[#5c4033]">
      <div className="flex items-center gap-4">
        <CharacterAvatar characterId={character.id} size={56} />
        <div>
          <h2 className="text-sm sm:text-base md:text-xl font-black tracking-widest truncate max-w-[180px] sm:max-w-none">{lt(character.name, lang)} - {lt(mission.title, lang)}</h2>
          <div className="flex gap-1 mt-1 items-center">
            {battleMode === 'speed' ? (
              <>
                <Zap size={14} className={speedTimeLeft < 10000 ? 'text-rose-400 animate-pulse' : 'text-amber-400'} />
                <span className={`text-sm font-black tabular-nums ${speedTimeLeft < 10000 ? 'text-rose-400' : 'text-amber-300'}`}>
                  {Math.ceil(speedTimeLeft / 1000)}s
                </span>
              </>
            ) : battleMode === 'marathon' ? (
              <>
                <span className="text-[10px] font-bold text-emerald-400">
                  {correctCount}/{totalQuestions} ({totalQuestions > 0 ? Math.round((correctCount / Math.max(1, currentQIdx + (showResult !== 'none' ? 0 : 1))) * 100) : 0}%)
                </span>
              </>
            ) : (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border border-black ${i < hp ? 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'bg-slate-800'}`} />
                ))}
                <span className="text-[10px] ml-2 font-bold text-red-400 uppercase">{t.hp}</span>
              </>
            )}

            {/* Streak badge */}
            {isMultiQuestion && streak >= 2 && (
              <span className="ml-3 flex items-center gap-1 px-2 py-0.5 rounded bg-orange-600 text-[10px] font-black uppercase animate-pulse">
                <Flame size={12} />
                {streak} {t.streakLabel}
              </span>
            )}

            {/* Shield charges indicator */}
            {skillCard === 'shield' && shieldCharges > 0 && (
              <span className="ml-3 px-2 py-0.5 rounded bg-blue-600/60 text-[10px] font-black flex items-center gap-1">
                <Shield size={12} /> {'\u00D7'}{shieldCharges}
              </span>
            )}

            {/* Difficulty badge */}
            <span className="ml-4 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600">
              {t.challenge}
            </span>

            {/* Battle mode badge */}
            {battleMode !== 'classic' && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                battleMode === 'speed' ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {battleMode === 'speed' ? (lang === 'en' ? 'SPEED' : '极速') : (lang === 'en' ? 'MARATHON' : '马拉松')}
              </span>
            )}

            {/* Daily challenge indicator */}
            {isDailyChallenge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-yellow-500 text-black flex items-center gap-1">
                {t.dailyChallenge} ×{dailyMultiplier}
              </span>
            )}

            {/* Active skill card badge */}
            {skillCard && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-600/50 flex items-center gap-1">
                {skillCard === 'shield' ? <Shield size={10} /> : skillCard === 'double' ? <Zap size={10} /> : <Eye size={10} />}
                {lt(SKILL_CARDS.find(c => c.id === skillCard)!.name, lang)}
              </span>
            )}
          </div>

          {/* Progress indicator for multi-question */}
          {isMultiQuestion && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold text-[#f4e4bc]/70">
                {battleMode === 'speed'
                  ? `Q${currentQIdx + 1} · ${correctCount}✓`
                  : (t.questionProgress as string).replace('{n}', String(currentQIdx + 1)).replace('{total}', String(questionQueueLength))}
              </span>
              {battleMode !== 'speed' && (
                <>
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: questionQueueLength }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < currentQIdx ? 'bg-emerald-400' :
                          i === currentQIdx ? 'bg-yellow-400' :
                          'bg-parchment/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex sm:hidden flex-1 h-1.5 bg-parchment/20 rounded-full overflow-hidden max-w-[80px]">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${((currentQIdx + 1) / questionQueueLength) * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Opponent badge — PK only. Finished status is live via realtime;
            score only appears after they submit (in-progress score isn't
            broadcast). Gives the player pressure/relief feedback. */}
        {opponent && opponentEntry && (() => {
          const ch = CHARACTERS.find(c => c.id === opponentEntry.charId);
          const initial = opponentEntry.name?.[0]?.toUpperCase() || '?';
          return (
            <div
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border text-xs font-bold transition-colors ${
                opponentFinished
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                  : 'bg-white/5 border-white/15 text-white/70'
              }`}
              aria-label={lang === 'en' ? 'Opponent status' : '对手状态'}
            >
              <div className={`w-6 h-6 rounded-lg ${ch?.color ?? 'bg-slate-500'} flex items-center justify-center text-white text-[11px] font-black`}>
                {initial}
              </div>
              <span className="truncate max-w-[80px]">{opponentEntry.name || (lang === 'en' ? 'Friend' : '好友')}</span>
              <span className="opacity-60">•</span>
              <span>
                {opponentFinished
                  ? `${lang === 'en' ? 'Done' : '完成'} ${opponentEntry.score ?? 0}`
                  : (lang === 'en' ? 'Solving…' : '答题中')}
              </span>
            </div>
          );
        })()}
        {/* Mute button */}
        <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        {!isMultiplayer && (
          <button onClick={onCancel} aria-label="Exit battle" className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <XCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
