import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Flame, Crown, Swords, Target, Star, Shield, Check } from 'lucide-react';
import type { Language, UserProfile } from '../types';
import { lt } from '../i18n/resolveText';
import { getLevelInfo } from '../utils/xpLevels';
import { STREAK_MILESTONES } from '../data/streakMilestones';
import { SEASON_BORDERS, getSeasonLevel, getSeasonBorder } from '../data/seasons/season1';
import { getSeasonProgress } from '../utils/seasonTracker';
import { useAudio } from '../audio';

type AchievementCategory = 'journey' | 'streak' | 'season' | 'collection';

// ── Achievement definitions ──

type AchievementDef = {
  id: string;
  icon: typeof Trophy;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  check: (p: UserProfile) => { unlocked: boolean; progress: number; target: number };
};

const JOURNEY_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_blood', icon: Swords,
    name: { zh: '初战告捷', en: 'First Blood' },
    description: { zh: '完成第一个关卡', en: 'Complete your first mission' },
    check: (p) => {
      const n = countCompleted(p);
      return { unlocked: n >= 1, progress: Math.min(n, 1), target: 1 };
    },
  },
  {
    id: 'ten_victories', icon: Swords,
    name: { zh: '十战十捷', en: 'Ten Victories' },
    description: { zh: '完成 10 个关卡', en: 'Complete 10 missions' },
    check: (p) => {
      const n = countCompleted(p);
      return { unlocked: n >= 10, progress: Math.min(n, 10), target: 10 };
    },
  },
  {
    id: 'half_kingdom', icon: Crown,
    name: { zh: '半壁江山', en: 'Half the Kingdom' },
    description: { zh: '完成 50 个关卡', en: 'Complete 50 missions' },
    check: (p) => {
      const n = countCompleted(p);
      return { unlocked: n >= 50, progress: Math.min(n, 50), target: 50 };
    },
  },
  {
    id: 'centurion', icon: Crown,
    name: { zh: '百战将军', en: 'Centurion' },
    description: { zh: '完成 100 个关卡', en: 'Complete 100 missions' },
    check: (p) => {
      const n = countCompleted(p);
      return { unlocked: n >= 100, progress: Math.min(n, 100), target: 100 };
    },
  },
  {
    id: 'unifier', icon: Crown,
    name: { zh: '一统天下', en: 'Unifier' },
    description: { zh: '完成 200 个关卡', en: 'Complete all 200 missions' },
    check: (p) => {
      const n = countCompleted(p);
      return { unlocked: n >= 200, progress: Math.min(n, 200), target: 200 };
    },
  },
  {
    id: 'level_10', icon: Star,
    name: { zh: '军侯', en: 'Battalion Officer' },
    description: { zh: '达到等级 10', en: 'Reach level 10' },
    check: (p) => {
      const lv = getLevelInfo(p.total_score).level;
      return { unlocked: lv >= 10, progress: Math.min(lv, 10), target: 10 };
    },
  },
  {
    id: 'level_25', icon: Star,
    name: { zh: '奋威将军', en: 'Valor General' },
    description: { zh: '达到等级 25', en: 'Reach level 25' },
    check: (p) => {
      const lv = getLevelInfo(p.total_score).level;
      return { unlocked: lv >= 25, progress: Math.min(lv, 25), target: 25 };
    },
  },
  {
    id: 'level_50', icon: Star,
    name: { zh: '大将军', en: 'Grand General' },
    description: { zh: '达到等级 50（最高）', en: 'Reach level 50 (max)' },
    check: (p) => {
      const lv = getLevelInfo(p.total_score).level;
      return { unlocked: lv >= 50, progress: Math.min(lv, 50), target: 50 };
    },
  },
];

const STREAK_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'streak_3', icon: Flame,
    name: { zh: '三日不息', en: '3-Day Streak' },
    description: { zh: '连续登录 3 天', en: 'Log in 3 days in a row' },
    check: (p) => {
      const best = getBestStreak(p);
      return { unlocked: best >= 3, progress: Math.min(best, 3), target: 3 };
    },
  },
  {
    id: 'streak_7', icon: Flame,
    name: { zh: '七日连珠', en: '7-Day Streak' },
    description: { zh: '连续登录 7 天', en: 'Log in 7 days in a row' },
    check: (p) => {
      const best = getBestStreak(p);
      return { unlocked: best >= 7, progress: Math.min(best, 7), target: 7 };
    },
  },
  ...STREAK_MILESTONES.map((m): AchievementDef => ({
    id: m.id, icon: Flame,
    name: m.title,
    description: { zh: `连续登录 ${m.days} 天`, en: `Log in ${m.days} days in a row` },
    check: (p) => {
      const best = getBestStreak(p);
      const claimed = ((p.completed_missions as any)?._streak_milestones ?? []) as string[];
      return { unlocked: claimed.includes(m.id), progress: Math.min(best, m.days), target: m.days };
    },
  })),
];

const SEASON_ACHIEVEMENTS: AchievementDef[] = SEASON_BORDERS.map((b): AchievementDef => ({
  id: `border_${b.level}`, icon: Shield,
  name: b.name,
  description: { zh: `赛季等级达到 ${b.level} 级`, en: `Reach season level ${b.level}` },
  check: (p) => {
    const sp = getSeasonProgress(p.completed_missions as Record<string, unknown>);
    const { level } = getSeasonLevel(sp.season_xp);
    return { unlocked: level >= b.level, progress: Math.min(level, b.level), target: b.level };
  },
}));

const COLLECTION_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_skill', icon: Target,
    name: { zh: '习得武艺', en: 'First Skill' },
    description: { zh: '解锁第一个英雄技能', en: 'Unlock your first hero skill' },
    check: (p) => {
      const n = countSkills(p);
      return { unlocked: n >= 1, progress: Math.min(n, 1), target: 1 };
    },
  },
  {
    id: 'skill_master', icon: Target,
    name: { zh: '武艺精通', en: 'Skill Master' },
    description: { zh: '解锁 5 个英雄技能', en: 'Unlock 5 hero skills' },
    check: (p) => {
      const n = countSkills(p);
      return { unlocked: n >= 5, progress: Math.min(n, 5), target: 5 };
    },
  },
  {
    id: 'equipment_5', icon: Shield,
    name: { zh: '军备初成', en: 'First Arsenal' },
    description: { zh: '获得 5 件装备', en: 'Earn 5 equipment pieces' },
    check: (p) => {
      const n = countEquipment(p);
      return { unlocked: n >= 5, progress: Math.min(n, 5), target: 5 };
    },
  },
  {
    id: 'equipment_20', icon: Shield,
    name: { zh: '军械大师', en: 'Arsenal Master' },
    description: { zh: '获得 20 件装备', en: 'Earn 20 equipment pieces' },
    check: (p) => {
      const n = countEquipment(p);
      return { unlocked: n >= 20, progress: Math.min(n, 20), target: 20 };
    },
  },
  {
    id: 'repairer', icon: Shield,
    name: { zh: '铁匠学徒', en: 'Apprentice Smith' },
    description: { zh: '修复 3 件装备', en: 'Repair 3 equipment pieces' },
    check: (p) => {
      const n = countRepairs(p);
      return { unlocked: n >= 3, progress: Math.min(n, 3), target: 3 };
    },
  },
];

// ── Helpers ──

function countCompleted(p: UserProfile): number {
  return Object.keys(p.completed_missions).filter(k => !k.startsWith('_') && !k.startsWith('daily_')).length;
}

function getBestStreak(p: UserProfile): number {
  return ((p.completed_missions as any)?._login as { bestStreak?: number })?.bestStreak ?? 0;
}

function countSkills(p: UserProfile): number {
  const cp = (p.completed_missions as any)?._char_progression;
  if (!cp) return 0;
  return (Object.values(cp) as any[]).reduce((sum: number, c: any) => sum + (c?.unlocked_skills?.length ?? 0), 0);
}

function countEquipment(p: UserProfile): number {
  const eq = (p.completed_missions as any)?._equipment;
  return eq ? Object.keys(eq).length : 0;
}

function countRepairs(p: UserProfile): number {
  const eq = (p.completed_missions as any)?._equipment;
  if (!eq) return 0;
  return (Object.values(eq) as any[]).reduce((sum: number, e: any) => sum + (e?.repairCount ?? 0), 0);
}

// ── Category config ──

const CATEGORIES: { id: AchievementCategory; icon: typeof Trophy; label: { zh: string; en: string }; achievements: AchievementDef[] }[] = [
  { id: 'journey', icon: Swords, label: { zh: '征途里程碑', en: 'Journey' }, achievements: JOURNEY_ACHIEVEMENTS },
  { id: 'streak', icon: Flame, label: { zh: '连签传奇', en: 'Streaks' }, achievements: STREAK_ACHIEVEMENTS },
  { id: 'season', icon: Crown, label: { zh: '赛季荣耀', en: 'Season' }, achievements: SEASON_ACHIEVEMENTS },
  { id: 'collection', icon: Target, label: { zh: '收集成就', en: 'Collection' }, achievements: COLLECTION_ACHIEVEMENTS },
];

// ── Component ──

export const AchievementWallPanel = ({
  lang,
  profile,
  onClose,
}: {
  lang: Language;
  profile: UserProfile;
  onClose: () => void;
}) => {
  const { playTap } = useAudio();
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('journey');

  const stats = useMemo(() => {
    let total = 0;
    let unlocked = 0;
    for (const cat of CATEGORIES) {
      for (const ach of cat.achievements) {
        total++;
        if (ach.check(profile).unlocked) unlocked++;
      }
    }
    return { total, unlocked };
  }, [profile]);

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;

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
        className="bg-slate-800/95 border border-white/10 rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {lang === 'en' ? 'Achievement Wall' : '成就墙'}
              </h2>
              <p className="text-xs text-amber-400 font-bold">
                {stats.unlocked}/{stats.total} {lang === 'en' ? 'unlocked' : '已解锁'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 mb-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const catUnlocked = cat.achievements.filter(a => a.check(profile).unlocked).length;
            return (
              <button
                key={cat.id}
                onClick={() => { playTap(); setActiveCategory(cat.id); }}
                className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Icon size={14} />
                <span>{lt(cat.label, lang)}</span>
                <span className="text-[9px] opacity-60">{catUnlocked}/{cat.achievements.length}</span>
              </button>
            );
          })}
        </div>

        {/* Achievement list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {activeCat.achievements.map(ach => {
                const { unlocked, progress, target } = ach.check(profile);
                const Icon = ach.icon;
                return (
                  <div
                    key={ach.id}
                    className={`rounded-xl border p-3 flex items-center gap-3 transition-all ${
                      unlocked
                        ? 'border-amber-400/30 bg-amber-400/5'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      unlocked
                        ? 'bg-amber-400/20'
                        : 'bg-white/5'
                    }`}>
                      {unlocked
                        ? <Check size={18} className="text-amber-400" />
                        : <Icon size={18} className="text-white/20" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold truncate ${unlocked ? 'text-white' : 'text-white/50'}`}>
                        {lt(ach.name, lang)}
                      </div>
                      <div className="text-[10px] text-white/30 truncate">
                        {lt(ach.description, lang)}
                      </div>
                      {!unlocked && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full bg-white/20 rounded-full transition-all"
                              style={{ width: `${(progress / target) * 100}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-white/25 font-bold">{progress}/{target}</span>
                        </div>
                      )}
                    </div>
                    {unlocked && (
                      <div className="shrink-0 text-amber-400 text-lg">
                        <Trophy size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
