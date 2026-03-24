import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Swords, Coffee, Crown, ArrowLeft, Package, ChevronRight, Shield, Trophy, Skull } from 'lucide-react';
import type { Language, Mission, Character } from '../types';
import { translations } from '../i18n/translations';
import { lt } from '../i18n/resolveText';
import type { Expedition, ExpeditionNode } from '../data/expeditions';
import { MISSIONS as LOCAL_MISSIONS } from '../data/missions';
import { generateMission } from '../utils/generateMission';
import { checkAnswer } from '../utils/checkCorrectness';
import { InputFields } from '../components/MathBattle/InputFields';
import { VisualData } from '../components/MathBattle/VisualData';
import { LatexText } from '../components/MathView';
import { interpolate } from '../utils/interpolate';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CalculatorWidget } from '../components/Calculator';
import { useAudio } from '../audio';

type Phase = 'map' | 'battle' | 'rest' | 'victory' | 'defeat' | 'retreat';

export const ExpeditionScreen = ({
  expedition,
  character,
  lang,
  grade,
  onComplete,
  onCancel,
}: {
  expedition: Expedition;
  character: Character;
  lang: Language;
  grade: number;
  onComplete: (xpEarned: number, nodesCleared: number) => void;
  onCancel: () => void;
}) => {
  const t = translations[lang];
  const { playTap, playSuccess, playFail, playVictory, playDefeat, playPhaseAdvance } = useAudio();

  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
  const [rations, setRations] = useState(expedition.startingRations);
  const [xpEarned, setXpEarned] = useState(0);
  const [phase, setPhase] = useState<Phase>('map');
  const [nodesCleared, setNodesCleared] = useState(0);

  // Battle state
  const [battleQuestions, setBattleQuestions] = useState<Mission[]>([]);
  const [battleQIdx, setBattleQIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<'none' | 'correct' | 'wrong'>('none');

  const currentNode = expedition.nodes[currentNodeIdx];

  // Pick random missions matching grade for battle nodes
  const generateBattleQuestions = useCallback((count: number) => {
    // Try exact grade first, fall back to ±1 grade, then all dynamic missions
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
      // Rest node: just grant rations
      setRations(r => r + node.rationReward);
      playPhaseAdvance();
      setPhase('rest');
    } else {
      // Battle or boss node
      const qs = generateBattleQuestions(node.questionCount);
      setBattleQuestions(qs);
      setBattleQIdx(0);
      setInputs({});
      setShowResult('none');
      setPhase('battle');
    }
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
        // Next question or complete node
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
        setInputs({});
        if (newRations <= 0) {
          // Expedition failed
          playDefeat();
          setPhase('defeat');
        } else {
          // Continue — same question with new numbers
          const qs = [...battleQuestions];
          const template = LOCAL_MISSIONS.find(m => m.id === question.id) || question;
          qs[battleQIdx] = template.data?.generatorType ? generateMission(template) : template;
          setBattleQuestions(qs);
        }
      }, 800);
    }
  };

  const completeNode = () => {
    const node = expedition.nodes[currentNodeIdx];
    const nodeXP = Math.round(100 * node.xpMultiplier);
    setXpEarned(prev => prev + nodeXP);
    setNodesCleared(prev => prev + 1);
    setRations(r => r + node.rationReward);
    playPhaseAdvance();

    if (currentNodeIdx + 1 >= expedition.nodes.length) {
      // All nodes cleared — victory!
      playVictory();
      setPhase('victory');
    } else {
      // Advance to next node
      setCurrentNodeIdx(prev => prev + 1);
      setPhase('map');
    }
  };

  const handleRetreat = () => {
    playTap();
    setPhase('retreat');
  };

  const NODE_ICONS: Record<string, typeof MapPin> = { battle: Swords, rest: Coffee, boss: Crown };

  // --- MAP PHASE ---
  if (phase === 'map') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 w-full max-w-sm">
          <button onClick={onCancel} className="p-2 text-white/40 hover:text-white"><ArrowLeft size={20} /></button>
          <div className="flex-1">
            <h2 className="text-lg font-black text-white">{lt(expedition.name, lang)}</h2>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold"><Package size={14} /> {rations}</span>
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

        {/* Node map */}
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {expedition.nodes.map((node, idx) => {
            const isCompleted = idx < currentNodeIdx;
            const isCurrent = idx === currentNodeIdx;
            const isLocked = idx > currentNodeIdx;
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
                    {node.type === 'rest' ? (lang === 'en' ? `+${node.rationReward} rations` : `+${node.rationReward} 军粮`)
                      : node.type === 'boss' ? (lang === 'en' ? `${node.questionCount}Q · ×${node.xpMultiplier} XP` : `${node.questionCount}题 · ×${node.xpMultiplier} XP`)
                      : `${node.questionCount}${lang === 'en' ? 'Q' : '题'}`}
                  </div>
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

  // --- REST PHASE ---
  if (phase === 'rest') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <Coffee size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">{lt(currentNode.name, lang)}</h2>
          <p className="text-amber-400 font-bold mb-6">+{currentNode.rationReward} {lang === 'en' ? 'rations' : '军粮'}</p>
          <p className="text-white/40 text-sm mb-8">{lang === 'en' ? `You now have ${rations} rations.` : `现在有 ${rations} 份军粮。`}</p>
          <button onClick={() => { setCurrentNodeIdx(prev => prev + 1); setPhase('map'); }} className="px-8 py-3 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-400 transition-all">
            {(t as any).continueMarching ?? 'Continue March'}
          </button>
        </motion.div>
      </div>
    );
  }

  // --- BATTLE PHASE ---
  if (phase === 'battle') {
    const question = battleQuestions[battleQIdx];
    if (!question) return null;
    const p = question.data ?? {};
    const descText = interpolate(lt(question.description, lang), p);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/95 backdrop-blur-md">
        <div className="min-h-full flex items-center justify-center py-4">
          <CalculatorWidget lang={lang} onUseResult={(val) => setInputs(prev => {
            const fields = Object.keys(prev);
            const emptyField = fields.find(f => !prev[f]) || fields[0];
            if (emptyField) return { ...prev, [emptyField]: val };
            return prev;
          })} />

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 w-full max-w-lg">
            {/* Battle header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CharacterAvatar characterId={character.id} size={36} />
                <div>
                  <div className="text-white font-bold text-sm">{lt(currentNode.name, lang)}</div>
                  <div className="text-white/40 text-[10px]">
                    {lang === 'en' ? `Q${battleQIdx + 1}/${battleQuestions.length}` : `第${battleQIdx + 1}/${battleQuestions.length}题`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-amber-400 text-xs font-bold"><Package size={14} /> {rations}</span>
                {currentNode.type === 'boss' && <span className="text-rose-400 text-xs font-black">×{currentNode.xpMultiplier}</span>}
              </div>
            </div>

            {/* Question */}
            <div className="mb-4">
              <LatexText text={descText} className="text-white/80 text-sm leading-relaxed" />
            </div>

            {/* Visual data */}
            <VisualData mission={question} lang={lang} />

            {/* Input */}
            <div className="mt-4">
              <InputFields
                mission={question}
                inputs={inputs}
                onChange={(field, val) => setInputs(prev => ({ ...prev, [field]: val }))}
                lang={lang}
                disabled={showResult !== 'none'}
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
                  <span className="text-rose-400 font-black text-xl">-1 {lang === 'en' ? 'ration' : '军粮'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={showResult !== 'none'}
              className="w-full mt-4 py-3 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {t.attack}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VICTORY / DEFEAT / RETREAT ---
  const isVictory = phase === 'victory';
  const isRetreat = phase === 'retreat';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
        {isVictory ? (
          <Crown size={64} className="text-amber-400 mx-auto mb-4" />
        ) : isRetreat ? (
          <Shield size={64} className="text-amber-400 mx-auto mb-4" />
        ) : (
          <Skull size={64} className="text-rose-400 mx-auto mb-4" />
        )}

        <h2 className={`text-2xl font-black mb-2 ${isVictory ? 'text-amber-400' : isRetreat ? 'text-amber-300' : 'text-rose-400'}`}>
          {isVictory ? ((t as any).expeditionVictory ?? 'Expedition Complete!')
            : isRetreat ? ((t as any).safeRetreat ?? 'Safe Retreat')
            : ((t as any).rationsDepleted ?? 'Rations Depleted')}
        </h2>

        <p className="text-white/50 text-sm mb-6">
          {isVictory ? ((t as any).expeditionVictoryDesc ?? 'Full rewards earned.')
            : isRetreat ? ((t as any).safeRetreatDesc ?? 'Keep what you earned.')
            : ((t as any).rationsDepletedDesc ?? 'Keep the XP you earned.')}
        </p>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <span className="text-white/30 text-xs font-bold block">{(t as any).nodes ?? 'Nodes'}</span>
            <span className="text-2xl font-black text-emerald-400">{nodesCleared}/{expedition.nodes.length}</span>
          </div>
          <div className="text-center">
            <span className="text-white/30 text-xs font-bold block">XP</span>
            <span className="text-2xl font-black text-amber-400">+{xpEarned}</span>
          </div>
        </div>

        <button
          onClick={() => onComplete(xpEarned, nodesCleared)}
          className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all"
        >
          {t.backToMap}
        </button>
      </motion.div>
    </div>
  );
};
