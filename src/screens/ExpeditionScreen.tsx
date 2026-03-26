import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Swords, Coffee, Crown, ArrowLeft, Package, ChevronRight, Shield, Trophy, Skull, Scroll } from 'lucide-react';
import type { Language, Mission, Character } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import type { Expedition, ExpeditionQuote } from '../data/expeditions';
import { MISSIONS as LOCAL_MISSIONS } from '../data/missions';
import { generateMission } from '../utils/generateMission';
import { checkAnswer } from '../utils/checkCorrectness';
import { InputFields } from '../components/MathBattle/InputFields';
import { INPUT_FIELDS } from '../components/MathBattle/inputConfig';
import { VisualData } from '../components/MathBattle/VisualData';
import { LatexText } from '../components/MathView';
import { interpolate } from '../utils/interpolate';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CalculatorWidget } from '../components/Calculator';
import { useAudio } from '../audio';
import { getExpeditionRecord, saveExpeditionRecord, getRating, type ExpeditionRecord } from '../utils/expeditionRecords';

type Phase = 'briefing' | 'map' | 'battle' | 'rest' | 'victory' | 'defeat' | 'retreat';

// ── Helpers ──────────────────────────────────────────────────────────

function getChineseDay(d: number): string {
  const n = ['', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d'];
  if (d <= 9) return '\u521d' + n[d]; // 初X
  if (d === 10) return '\u521d\u5341'; // 初十
  if (d < 20) return '\u5341' + n[d - 10]; // 十X
  if (d === 20) return '\u4e8c\u5341'; // 二十
  if (d < 30) return '\u5eff' + n[d - 20]; // 廿X
  if (d === 30) return '\u4e09\u5341'; // 三十
  return '\u4e09\u5341\u4e00'; // 三十一
}

function getAuspiciousDate(era: { zh: string; en: string } | undefined, lang: Language) {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (lang === 'en' || lang === 'zh_TW') {
    const eraStr = era?.[lang === 'zh_TW' ? 'zh' : 'en'] ?? '';
    return { date: `${eraStr}  \u00b7  Month ${m}, Day ${d}`, auspicious: lang === 'zh_TW' ? '\u51fa\u5f81' : 'March Out' };
  }
  const months = ['\u6b63', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341', '\u5341\u4e00', '\u814a'];
  const opts = ['\u51fa\u5f81', '\u7528\u5175', '\u514b\u654c', '\u8fdb\u519b'];
  return { date: `${era?.zh ?? ''}  ${months[m - 1]}\u6708  ${getChineseDay(d)}`, auspicious: opts[(m + d) % opts.length] };
}

function pickQuote(quotes: ExpeditionQuote[]): ExpeditionQuote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

/** Extract correct answer text from mission data, matching visible input fields */
function getCorrectDisplay(question: Mission, lang: Language): string {
  const fieldConfig = INPUT_FIELDS[question.type];
  const langKey = lang === 'en' ? 'en' : 'zh';
  const fields = fieldConfig?.[langKey] ?? fieldConfig?.zh ?? [];
  const data = question.data ?? {};
  const usedFieldIds = question.tutorialSteps
    ?.map(s => s.highlightField).filter(Boolean) as string[] | undefined;
  const visibleFields = usedFieldIds && usedFieldIds.length > 0
    ? fields.filter(f => usedFieldIds.includes(f.id))
    : fields;
  return visibleFields.map(f => `${f.id} = ${data[f.id] ?? '?'}`).join('\u3000');
}

// ── Component ────────────────────────────────────────────────────────

export const ExpeditionScreen = ({
  expedition,
  character,
  lang,
  grade,
  onComplete,
  onSaveRun,
  onCancel,
}: {
  expedition: Expedition;
  character: Character;
  lang: Language;
  grade: number;
  onComplete: (xpEarned: number, nodesCleared: number) => void;
  onSaveRun?: (xpEarned: number, nodesCleared: number) => Promise<void>;
  onCancel: () => void;
}) => {
  const t = translations[lang];
  const { playTap, playSuccess, playFail, playVictory, playDefeat, playPhaseAdvance } = useAudio();

  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
  const [rations, setRations] = useState(expedition.startingRations);
  const [xpEarned, setXpEarned] = useState(0);
  const [phase, setPhase] = useState<Phase>('briefing');
  const [nodesCleared, setNodesCleared] = useState(0);

  // Battle state
  const [battleQuestions, setBattleQuestions] = useState<Mission[]>([]);
  const [battleQIdx, setBattleQIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showRetreatConfirm, setShowRetreatConfirm] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState('');
  const [nodeCompleteXP, setNodeCompleteXP] = useState<number | null>(null);

  // Record state (saved when expedition ends)
  const [savedRecord, setSavedRecord] = useState<ExpeditionRecord | null>(null);
  const [prevRecord, setPrevRecord] = useState<ExpeditionRecord | null>(() => getExpeditionRecord(expedition.id));

  const currentNode = expedition.nodes[currentNodeIdx];

  const generateBattleQuestions = useCallback((count: number) => {
    let pool = LOCAL_MISSIONS.filter(m => m.grade === grade && m.data?.generatorType);
    if (pool.length === 0) pool = LOCAL_MISSIONS.filter(m => Math.abs(m.grade - grade) <= 1 && m.data?.generatorType);
    if (pool.length === 0) pool = LOCAL_MISSIONS.filter(m => m.data?.generatorType);
    const questions: Mission[] = [];
    for (let i = 0; i < count; i++) {
      const template = pool[Math.floor(Math.random() * pool.length)];
      questions.push(generateMission(template));
    }
    return questions;
  }, [grade]);

  const startNode = () => {
    playTap();
    const node = expedition.nodes[currentNodeIdx];
    if (node.type === 'rest') {
      setRations(r => r + node.rationReward);
      playPhaseAdvance();
      setPhase('rest');
    } else {
      const qs = generateBattleQuestions(node.questionCount);
      setBattleQuestions(qs);
      setBattleQIdx(0);
      setInputs({});
      setShowResult('none');
      setPhase('battle');
    }
  };

  const finishExpedition = (finalNodes: number, finalXP: number, endPhase: Phase) => {
    const record = saveExpeditionRecord(expedition.id, finalNodes, finalXP);
    setSavedRecord(record);
    setPhase(endPhase);
  };

  const handleSubmit = () => {
    playTap();
    const question = battleQuestions[battleQIdx];
    const result = checkAnswer(question, inputs);

    if (result.correct) {
      playSuccess();
      setShowResult('correct');
      setTimeout(() => {
        setShowResult('none');
        setInputs({});
        if (battleQIdx + 1 >= battleQuestions.length) {
          completeNode();
        } else {
          setBattleQIdx(prev => prev + 1);
        }
      }, 800);
    } else {
      playFail();
      setShowResult('wrong');
      const newRations = rations - 1;
      setRations(newRations);
      setTimeout(() => {
        setShowResult('none');
        if (newRations <= 0) {
          playDefeat();
          finishExpedition(nodesCleared, xpEarned, 'defeat');
        } else {
          // Show correct answer (keep student's input visible for comparison)
          // Prefer checker's expected values (handles computed answers like Pythagoras)
          const expectedEntries = Object.entries(result.expected || {});
          const answerText = expectedEntries.length > 0
            ? expectedEntries.map(([k, v]) => `${k} = ${v}`).join('\u3000')
            : getCorrectDisplay(question, lang);
          setCorrectAnswerText(answerText);
          setShowCorrectAnswer(true);
          setTimeout(() => {
            setShowCorrectAnswer(false);
            setInputs({});
            const qs = [...battleQuestions];
            const template = LOCAL_MISSIONS.find(m => m.id === question.id) || question;
            qs[battleQIdx] = template.data?.generatorType ? generateMission(template) : template;
            setBattleQuestions(qs);
          }, 1500);
        }
      }, 800);
    }
  };

  const completeNode = () => {
    const node = expedition.nodes[currentNodeIdx];
    const nodeXP = Math.round(100 * node.xpMultiplier);
    const newXP = xpEarned + nodeXP;
    const newNodes = nodesCleared + 1;
    setXpEarned(newXP);
    setNodesCleared(newNodes);
    setRations(r => r + node.rationReward);
    playPhaseAdvance();

    if (currentNodeIdx + 1 >= expedition.nodes.length) {
      playVictory();
      finishExpedition(newNodes, newXP, 'victory');
    } else {
      // Show node completion celebration
      setNodeCompleteXP(nodeXP);
      setTimeout(() => {
        setNodeCompleteXP(null);
        setCurrentNodeIdx(prev => prev + 1);
        setPhase('map');
      }, 1200);
    }
  };

  const handleRetreat = () => {
    playTap();
    // In battle phase, show confirmation first
    if (phase === 'battle') {
      setShowRetreatConfirm(true);
      return;
    }
    finishExpedition(nodesCleared, xpEarned, 'retreat');
  };

  const confirmRetreat = () => {
    setShowRetreatConfirm(false);
    finishExpedition(nodesCleared, xpEarned, 'retreat');
  };

  const NODE_ICONS: Record<string, typeof MapPin> = { battle: Swords, rest: Coffee, boss: Crown };

  // ═══════════════════════════════════════════════════════════════════
  // BRIEFING PHASE
  // ═══════════════════════════════════════════════════════════════════
  if (phase === 'briefing') {
    const quote = expedition.quotes && expedition.quotes.length > 0 ? pickQuote(expedition.quotes) : null;
    const { date, auspicious } = getAuspiciousDate(expedition.era, lang);

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
        <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Auspicious date header */}
          <div className="text-center mb-6">
            <div className="text-amber-400/60 text-xs tracking-[0.25em] mb-1 font-bold">{date}</div>
            <div className="text-amber-300/40 text-[10px] tracking-widest">
              {lang === 'en' ? `Today is auspicious for: ${auspicious}` : `\u4eca\u65e5\u5b9c\uff1a${auspicious}`}
            </div>
          </div>

          {/* Main scroll card */}
          <div className="bg-amber-950/30 border border-amber-700/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Scroll size={18} className="text-amber-500/60" />
              <h2 className="text-2xl font-black text-amber-300">{lt(expedition.name, lang)}</h2>
            </div>
            <p className="text-white/40 text-xs text-center mb-5 leading-relaxed">{lt(expedition.description, lang)}</p>

            {/* Quote */}
            {quote && (
              <motion.div className="border-l-2 border-amber-600/40 pl-4 mb-5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <p className="text-white/70 text-sm italic leading-relaxed">&ldquo;{lt(quote.text, lang)}&rdquo;</p>
                <p className="text-amber-400/60 text-xs mt-1">&mdash;&mdash; {lt(quote.author, lang)}</p>
              </motion.div>
            )}

            {/* Expedition info */}
            {(() => {
              const battleNodes = expedition.nodes.filter(n => n.type !== 'rest');
              const totalQ = battleNodes.reduce((s, n) => s + n.questionCount, 0);
              const estMin = Math.ceil(totalQ * 1.5);
              return (
                <div className="flex flex-wrap justify-center gap-3 mb-5 text-xs">
                  <span className="flex items-center gap-1 text-amber-400/70"><Package size={12} /> {expedition.startingRations} {lang === 'en' ? 'rations' : '\u519b\u7cae'}</span>
                  <span className="flex items-center gap-1 text-white/30"><Swords size={12} /> {battleNodes.length} {lang === 'en' ? 'battles' : '\u5173'}</span>
                  <span className="text-white/20">{lang === 'en' ? `~${estMin} min · ${totalQ}Q` : `\u7ea6${estMin}\u5206\u949f \u00b7 ${totalQ}\u9898`}</span>
                </div>
              );
            })()}

            {/* Records */}
            {prevRecord ? (
              <div className="bg-white/5 rounded-xl p-3 mb-5 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">{lang === 'en' ? 'Last run' : '\u4e0a\u6b21\u6218\u7ee9'}</span>
                  <span className="text-white/60">{prevRecord.lastNodes}/{expedition.nodes.length} {lang === 'en' ? 'nodes' : '\u5173'}  \u00b7  +{prevRecord.lastXP} XP</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">{lang === 'en' ? 'Best' : '\u6700\u4f73\u6218\u7ee9'}</span>
                  <span className="text-amber-400 font-bold">{prevRecord.bestNodes}/{expedition.nodes.length} {lang === 'en' ? 'nodes' : '\u5173'}  \u00b7  +{prevRecord.bestXP} XP  {getRating(prevRecord.bestNodes, expedition.nodes.length)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">{lang === 'en' ? 'Attempts' : '\u51fa\u5f81\u6b21\u6570'}</span>
                  <span className="text-white/40">{lang === 'en' ? `#${prevRecord.attempts + 1}` : `\u7b2c ${prevRecord.attempts + 1} \u6b21`}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-3 mb-5 text-center">
                <p className="text-white/30 text-xs">{lang === 'en' ? 'First expedition' : '\u9996\u6b21\u51fa\u5f81'}</p>
              </div>
            )}

            {/* Buttons */}
            <button onClick={() => { playTap(); setPhase('map'); }} className="w-full py-3 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-400 transition-all text-sm">
              {lang === 'en' ? 'March Out \u2192' : '\u4eca\u65e5\u51fa\u5f81 \u2192'}
            </button>
            <div className="flex gap-2 mt-2">
              <button onClick={onCancel} className="flex-1 py-2 text-white/30 text-sm hover:text-white/50 transition-colors">
                {lang === 'en' ? 'Return' : '\u8fd4\u56de'}
              </button>
              {prevRecord && (
                <button onClick={() => { playTap(); setPhase('map'); }} className="flex-1 py-2 text-amber-400/40 text-sm hover:text-amber-400/70 transition-colors">
                  {lang === 'en' ? 'Skip intro' : '\u8df3\u8fc7\u7b80\u62a5'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAP PHASE
  // ═══════════════════════════════════════════════════════════════════
  if (phase === 'map') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center px-4 py-8">
        <div className="flex items-center gap-3 mb-6 w-full max-w-sm">
          <button onClick={onCancel} className="p-2 text-white/40 hover:text-white"><ArrowLeft size={20} /></button>
          <div className="flex-1">
            <h2 className="text-lg font-black text-white">{lt(expedition.name, lang)}</h2>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className={`flex items-center gap-1 font-bold ${rations <= 2 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}><Package size={14} /> {rations}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold"><Trophy size={14} /> {xpEarned} XP</span>
              <span className="text-white/30">{nodesCleared}/{expedition.nodes.length}</span>
            </div>
          </div>
          {nodesCleared > 0 && (
            <button onClick={handleRetreat} className="px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold">
              {(t as any).retreat ?? 'Retreat'}
            </button>
          )}
        </div>

        {/* Expedition progress bar */}
        <div className="w-full max-w-sm mb-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
              initial={false}
              animate={{ width: `${(nodesCleared / expedition.nodes.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-white/20">
            <span>{lang === 'en' ? 'Start' : '\u51fa\u53d1'}</span>
            <span>{lang === 'en' ? 'Final Battle' : '\u51b3\u6218'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          {expedition.nodes.map((node, idx) => {
            const isCompleted = idx < currentNodeIdx;
            const isCurrent = idx === currentNodeIdx;
            const Icon = NODE_ICONS[node.type];
            const diffColors: Record<string, string> = {
              green: 'border-emerald-500/40 bg-emerald-500/10',
              amber: 'border-amber-500/40 bg-amber-500/10',
              red: 'border-rose-500/40 bg-rose-500/10',
            };

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-xl border p-3 flex items-center gap-3 transition-all ${
                  isCompleted ? 'border-emerald-500/30 bg-emerald-500/5 opacity-60'
                  : isCurrent ? `${diffColors[node.difficulty]} ring-2 ring-white/20`
                  : 'border-white/5 bg-white/[0.02] opacity-30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-400'
                  : isCurrent ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-white/20'
                }`}>
                  {isCompleted ? <Shield size={18} /> : <Icon size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-bold truncate">{lt(node.name, lang)}</div>
                  <div className="text-white/40 text-[10px]">
                    {node.type === 'rest' ? (lang === 'en' ? `+${node.rationReward} rations` : `+${node.rationReward} \u519b\u7cae`)
                      : node.type === 'boss' ? (lang === 'en' ? `${node.questionCount}Q \u00b7 \u00d7${node.xpMultiplier} XP` : `${node.questionCount}\u9898 \u00b7 \u00d7${node.xpMultiplier} XP`)
                      : `${node.questionCount}${lang === 'en' ? 'Q' : '\u9898'}`}
                  </div>
                  {/* Node intel for current node */}
                  {isCurrent && node.intel && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      className="text-amber-400/60 text-[10px] italic mt-0.5 leading-snug"
                    >
                      {lt(node.intel, lang)}
                    </motion.div>
                  )}
                </div>
                {isCurrent && (
                  <button onClick={startNode} className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-400 transition-all shrink-0">
                    <ChevronRight size={16} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // REST PHASE
  // ═══════════════════════════════════════════════════════════════════
  if (phase === 'rest') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <Coffee size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">{lt(currentNode.name, lang)}</h2>
          {currentNode.intel && (
            <p className="text-amber-400/60 text-xs italic mb-3 max-w-xs mx-auto">{lt(currentNode.intel, lang)}</p>
          )}
          <p className="text-amber-400 font-bold mb-6">+{currentNode.rationReward} {lang === 'en' ? 'rations' : '\u519b\u7cae'}</p>
          <p className="text-white/40 text-sm mb-8">{lang === 'en' ? `You now have ${rations} rations.` : `\u73b0\u5728\u6709 ${rations} \u4efd\u519b\u7cae\u3002`}</p>
          <button onClick={() => { setCurrentNodeIdx(prev => prev + 1); setPhase('map'); }} className="px-8 py-3 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-400 transition-all">
            {(t as any).continueMarching ?? 'Continue March'}
          </button>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // BATTLE PHASE
  // ═══════════════════════════════════════════════════════════════════
  if (phase === 'battle') {
    const question = battleQuestions[battleQIdx];
    if (!question) return null;
    const p = question.data ?? {};
    const descText = interpolate(lt(question.description, lang), p);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/95 backdrop-blur-md">
        <div className="min-h-full flex items-center justify-center py-4">
          <CalculatorWidget lang={lang} onUseResult={(val) => {
            const fieldConfig = INPUT_FIELDS[question.type];
            const langKey = lang === 'en' ? 'en' : 'zh';
            const fields = fieldConfig?.[langKey] ?? fieldConfig?.zh ?? [];
            const targetId = fields.find(f => !inputs[f.id])?.id ?? fields[0]?.id;
            if (targetId) setInputs(prev => ({ ...prev, [targetId]: val }));
          }} />

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 w-full max-w-lg relative">
            {/* Battle header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button onClick={handleRetreat} className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <CharacterAvatar characterId={character.id} size={36} />
                <div>
                  <div className="text-white font-bold text-sm">{lt(currentNode.name, lang)}</div>
                  <div className="text-white/40 text-[10px]">
                    {lang === 'en' ? `Q${battleQIdx + 1}/${battleQuestions.length}` : `\u7b2c${battleQIdx + 1}/${battleQuestions.length}\u9898`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1 text-xs font-bold ${rations <= 2 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}><Package size={14} /> {rations}</span>
                {currentNode.type === 'boss' && <span className="text-rose-400 text-xs font-black">\u00d7{currentNode.xpMultiplier}</span>}
              </div>
            </div>

            {/* Retreat confirmation */}
            <AnimatePresence>
              {showRetreatConfirm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-3xl backdrop-blur-sm">
                  <div className="text-center p-6">
                    <Shield size={32} className="text-amber-400 mx-auto mb-3" />
                    <p className="text-white font-bold text-sm mb-1">{lang === 'en' ? 'Retreat?' : '\u786e\u5b9a\u64a4\u9000\uff1f'}</p>
                    <p className="text-white/40 text-xs mb-4">{lang === 'en' ? 'Keep earned XP, end expedition.' : '\u4fdd\u7559\u5df2\u83b7\u7ecf\u9a8c\uff0c\u7ed3\u675f\u8fdc\u5f81\u3002'}</p>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => setShowRetreatConfirm(false)} className="px-4 py-2 bg-white/10 text-white/70 rounded-xl text-xs font-bold">
                        {lang === 'en' ? 'Continue' : '\u7ee7\u7eed\u6218\u6597'}
                      </button>
                      <button onClick={confirmRetreat} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold">
                        {lang === 'en' ? 'Retreat' : '\u64a4\u9000'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Node intel (first question only) */}
            {battleQIdx === 0 && currentNode.intel && (
              <div className="text-amber-400/60 text-[10px] italic mb-3 border-l-2 border-amber-700/30 pl-2">
                {lt(currentNode.intel, lang)}
              </div>
            )}

            {/* Question */}
            <div className="mb-4">
              <LatexText text={descText} className="text-white/80 text-sm leading-relaxed" />
            </div>

            <VisualData mission={question} lang={lang} />

            <div className="mt-4">
              <InputFields
                mission={question}
                inputs={inputs}
                setInputs={setInputs}
                difficultyMode="red"
                tutorialStep={0}
                isTutorial={false}
                lang={lang}
              />
            </div>

            {/* Result flash */}
            <AnimatePresence>
              {showResult === 'correct' && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 rounded-3xl pointer-events-none">
                  <span className="text-emerald-400 font-black text-3xl">{t.correct}</span>
                </motion.div>
              )}
              {showResult === 'wrong' && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-rose-500/20 rounded-3xl pointer-events-none">
                  <span className="text-rose-400 font-black text-xl">-1 {lang === 'en' ? 'ration' : '\u519b\u7cae'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Correct answer display (after wrong, before regeneration) */}
            <AnimatePresence>
              {showCorrectAnswer && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 bg-amber-900/30 border border-amber-600/20 rounded-xl p-3 text-center">
                  <p className="text-amber-400/50 text-[10px] mb-0.5">{lang === 'en' ? 'Correct answer' : '\u6b63\u786e\u7b54\u6848'}</p>
                  <p className="text-amber-300 font-bold text-sm">{correctAnswerText}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={showResult !== 'none' || showCorrectAnswer}
              className="w-full mt-4 py-3 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {t.attack}
            </button>

            {/* Node completion celebration */}
            <AnimatePresence>
              {nodeCompleteXP !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/40 rounded-3xl backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="text-center">
                    <Shield size={40} className="text-emerald-400 mx-auto mb-2" />
                    <h3 className="text-emerald-400 font-black text-xl">{lang === 'en' ? 'Node Cleared!' : '\u5173\u5361\u901a\u8fc7\uff01'}</h3>
                    <p className="text-amber-400 font-bold mt-1">+{nodeCompleteXP} XP</p>
                    {currentNode.rationReward > 0 && (
                      <p className="text-amber-400/60 text-xs mt-0.5">+{currentNode.rationReward} {lang === 'en' ? 'rations' : '\u519b\u7cae'}</p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // RESULT PHASE (Victory / Defeat / Retreat)
  // ═══════════════════════════════════════════════════════════════════
  const isVictory = phase === 'victory';
  const isRetreat = phase === 'retreat';
  const isNewBest = savedRecord && prevRecord && savedRecord.bestNodes > prevRecord.bestNodes;
  const isFirstRun = !prevRecord;
  const rating = getRating(nodesCleared, expedition.nodes.length);
  const { date: reportDate } = getAuspiciousDate(expedition.era, lang);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
        {/* Battle report card */}
        <div className="bg-amber-950/20 border border-amber-700/20 rounded-2xl overflow-hidden">
          {/* Report header */}
          <div className="bg-amber-900/30 px-5 py-3 border-b border-amber-700/20 flex items-center justify-between">
            <div>
              <h3 className="text-amber-300 font-black text-sm">{lt(expedition.name, lang)} {lang === 'en' ? 'Report' : '\u6218\u62a5'}</h3>
              <div className="text-amber-400/40 text-[10px]">{reportDate}</div>
            </div>
            {isVictory ? (
              <Crown size={28} className="text-amber-400" />
            ) : isRetreat ? (
              <Shield size={28} className="text-amber-400/60" />
            ) : (
              <Skull size={28} className="text-rose-400/60" />
            )}
          </div>

          {/* Result title */}
          <div className="text-center py-4">
            <h2 className={`text-xl font-black mb-1 ${isVictory ? 'text-amber-400' : isRetreat ? 'text-amber-300' : 'text-rose-400'}`}>
              {isVictory ? ((t as any).expeditionVictory ?? 'Expedition Complete!')
                : isRetreat ? ((t as any).safeRetreat ?? 'Safe Retreat')
                : ((t as any).rationsDepleted ?? 'Rations Depleted')}
            </h2>
            <p className="text-white/40 text-xs">
              {isVictory ? (lang === 'en' ? 'Full victory. All rewards earned.' : '\u5927\u83b7\u5168\u80dc\uff0c\u5168\u989d\u5956\u52b1\u5df2\u53d1\u653e\u3002')
                : isRetreat ? (lang === 'en' ? 'Withdrew safely. Keep what you earned.' : '\u5b89\u5168\u64a4\u9000\uff0c\u5df2\u83b7\u7ecf\u9a8c\u4fdd\u7559\u3002')
                : (lang === 'en' ? 'Rations depleted. Keep the XP you earned.' : '\u519b\u7cae\u8017\u5c3d\uff0c\u5df2\u83b7\u7ecf\u9a8c\u4fdd\u7559\u3002')}
            </p>
          </div>

          {/* This run stats */}
          <div className="px-5 pb-4">
            <div className="bg-white/5 rounded-xl p-4 mb-3">
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                {lang === 'en' ? 'This Run' : '\u672c\u6b21\u6218\u7ee9'}
              </div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-white/50 text-xs">{lang === 'en' ? 'Nodes' : '\u901a\u5173'}</span>
                <span className="text-white font-black">{nodesCleared}/{expedition.nodes.length} {rating}</span>
              </div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-white/50 text-xs">XP</span>
                <span className="text-amber-400 font-black">+{xpEarned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">{lang === 'en' ? 'Rations left' : '\u519b\u7cae\u4f59\u91cf'}</span>
                <span className="text-white/60 font-bold">{rations}</span>
              </div>
            </div>

            {/* Historical records */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Historical' : '\u5386\u53f2\u6218\u7ee9'}
              </div>
              {savedRecord && (
                <>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/50 text-xs">{lang === 'en' ? 'Best' : '\u6700\u4f73'}</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {savedRecord.bestNodes}/{expedition.nodes.length} {lang === 'en' ? 'nodes' : '\u5173'}
                      {(isNewBest || isFirstRun) && <span className="text-amber-300 ml-1 text-[10px]">{lang === 'en' ? 'NEW!' : '\u65b0\u7eaa\u5f55\uff01'}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/50 text-xs">{lang === 'en' ? 'Best XP' : '\u6700\u9ad8XP'}</span>
                    <span className="text-amber-400/70 font-bold text-sm">+{savedRecord.bestXP}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-xs">{lang === 'en' ? 'Attempts' : '\u51fa\u5f81\u6b21\u6570'}</span>
                    <span className="text-white/40 text-sm">{savedRecord.attempts}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  // Save XP from this run before replaying
                  if (xpEarned > 0 && onSaveRun) {
                    try { await onSaveRun(xpEarned, nodesCleared); } catch { /* save failed, continue */ }
                  }
                  // Update prevRecord so briefing shows latest
                  setPrevRecord(savedRecord);
                  // Reset and replay
                  setCurrentNodeIdx(0);
                  setRations(expedition.startingRations);
                  setXpEarned(0);
                  setNodesCleared(0);
                  setBattleQuestions([]);
                  setBattleQIdx(0);
                  setInputs({});
                  setShowResult('none');
                  setShowRetreatConfirm(false);
                  setShowCorrectAnswer(false);
                  setNodeCompleteXP(null);
                  setSavedRecord(null);
                  setPhase('briefing');
                }}
                className="flex-1 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black rounded-2xl hover:bg-amber-500/30 transition-all text-sm"
              >
                {lang === 'en' ? 'Try Again' : '\u518d\u6218\u4e00\u6b21'}
              </button>
              <button
                onClick={() => onComplete(xpEarned, nodesCleared)}
                className="flex-1 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all text-sm"
              >
                {t.backToMap}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
