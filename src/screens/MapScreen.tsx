import { motion } from 'motion/react';
import { MapIcon, Crown, ChevronRight, CheckCircle2, Lock, Users, Swords, BookOpen } from 'lucide-react';
import type { Language, UserProfile, Mission, Character } from '../types';
import { translations } from '../i18n/translations';
import { MathView, LatexText } from '../components/MathView';
import { interpolate } from '../utils/interpolate';

export const MapScreen = ({
  lang,
  profile,
  missions,
  selectedChar,
  onMissionStart,
  onPracticeStart,
  onGradeChange,
  onCreateRoom,
}: {
  lang: Language;
  profile: UserProfile;
  missions: Mission[];
  selectedChar: Character | undefined;
  onMissionStart: (mission: Mission) => void;
  onPracticeStart: (mission: Mission) => void;
  onGradeChange: () => void;
  onCreateRoom: (type: 'team' | 'pk', missionId: number) => void;
}) => {
  const t = translations[lang];
  const gradeMissions = missions.filter(m => m.grade === profile.grade);
  const completedCount = Object.keys(profile.completed_missions).filter(id =>
    Object.values(profile.completed_missions[id] || {}).some(Boolean)
  ).length;

  return (
    <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
      {/* Profile Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl ${selectedChar?.color}`}>
            <img src={selectedChar?.image} alt={selectedChar?.name[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg md:text-2xl flex items-center gap-2">
              {profile.display_name}
              <Crown size={20} className="text-yellow-400" />
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-indigo-400 font-bold text-lg">{selectedChar?.role[lang]}</p>
              <button
                onClick={onGradeChange}
                className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white/40 hover:text-white transition-colors"
              >
                {t.year} {profile.grade} ({lang === 'zh' ? '修改' : 'change'})
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-12">
          <div className="text-center">
            <span className="block text-slate-400 text-xs font-bold uppercase mb-1 tracking-widest">{t.totalScore}</span>
            <MathView tex={profile.total_score} className="text-2xl md:text-4xl font-black text-yellow-400" />
          </div>
          <div className="text-center">
            <span className="block text-slate-400 text-xs font-bold uppercase mb-1 tracking-widest">{t.completed}</span>
            <MathView tex={completedCount} className="text-2xl md:text-4xl font-black text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Multiplayer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onCreateRoom('team', gradeMissions[0]?.id || 1)}
          className="p-5 md:p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white flex items-center justify-between group overflow-hidden relative min-h-12"
        >
          <div className="relative z-10 text-left">
            <h4 className="text-lg md:text-2xl font-black mb-1">{t.teamMode}</h4>
            <p className="text-indigo-200 text-sm">{t.multiplayer}</p>
          </div>
          <Users size={48} className="text-white/20 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => onCreateRoom('pk', gradeMissions[0]?.id || 1)}
          className="p-5 md:p-8 bg-gradient-to-br from-rose-600 to-rose-800 rounded-3xl text-white flex items-center justify-between group overflow-hidden relative min-h-12"
        >
          <div className="relative z-10 text-left">
            <h4 className="text-lg md:text-2xl font-black mb-1">{t.pkMode}</h4>
            <p className="text-rose-200 text-sm">{t.multiplayer}</p>
          </div>
          <Swords size={48} className="text-white/20 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Mission Grid */}
      <div className="space-y-16">
        {Array.from(new Set(gradeMissions.map(m => m.unitTitle[lang]))).map((unitTitle) => (
          <div key={unitTitle} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <MapIcon className="text-indigo-400" />
                {unitTitle}
              </h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {gradeMissions
                .filter(m => m.unitTitle[lang] === unitTitle)
                .sort((a, b) => a.order - b.order)
                .map(mission => {
                  const comp = profile.completed_missions[String(mission.id)];
                  const isCompleted = comp && Object.values(comp).some(Boolean);
                  const prevMission = gradeMissions.find(m => m.unitId === mission.unitId && m.order === mission.order - 1);
                  const prevComp = prevMission ? profile.completed_missions[String(prevMission.id)] : null;
                  const isLocked = mission.order > 1 && prevMission && !(prevComp && Object.values(prevComp).some(Boolean));

                  return (
                    <div key={mission.id} className="relative group">
                      <div className={`bg-white rounded-[2rem] p-5 md:p-8 shadow-2xl transition-all ${isLocked ? 'opacity-50 grayscale' : 'hover:-translate-y-2'}`}>
                        <div className="flex justify-between items-start mb-6">
                          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            mission.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                            mission.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {t.difficulty[mission.difficulty]}
                          </div>
                          {isCompleted ? (
                            <div className="flex gap-1">
                              {comp?.green && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                              {comp?.amber && <div className="w-3 h-3 rounded-full bg-amber-500" />}
                              {comp?.red && <div className="w-3 h-3 rounded-full bg-rose-500" />}
                              <CheckCircle2 className="text-emerald-500 ml-1" size={20} />
                            </div>
                          ) : isLocked ? <Lock className="text-slate-400" size={28} /> : null}
                        </div>
                        <h4 className="text-lg md:text-2xl font-black text-slate-800 mb-1">{mission.title[lang]}</h4>
                        <p className="text-indigo-600 text-[10px] font-bold mb-3 uppercase">{t.questionTypes[mission.type]}</p>
                        <LatexText text={interpolate(mission.description[lang], mission.data ?? {})} className="text-slate-500 text-sm mb-8 line-clamp-2 block" />
                        <div className="flex gap-2">
                          <button
                            disabled={!!isLocked}
                            onClick={() => onPracticeStart(mission)}
                            className={`flex-1 py-3 rounded-2xl font-black flex items-center justify-center gap-1.5 transition-all text-xs md:text-sm min-h-12 ${
                              isLocked ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                            }`}
                          >
                            <BookOpen size={16} />
                            {isLocked ? t.locked : t.practice}
                          </button>
                          <button
                            disabled={!!isLocked}
                            onClick={() => onMissionStart(mission)}
                            className={`flex-1 py-3 rounded-2xl font-black flex items-center justify-center gap-1.5 transition-all text-xs md:text-sm min-h-12 ${
                              isLocked ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                            }`}
                          >
                            <Swords size={16} />
                            {isLocked ? t.locked : t.challenge}
                          </button>
                        </div>
                        {isLocked && (
                          <p className="mt-2 text-[10px] text-rose-500 font-bold text-center">{t.lockedByOrder}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
