import { Sparkles } from 'lucide-react';
import type { Mission, Language } from '../../types';
import { MathView } from '../MathView';
import { translations } from '../../i18n/translations';

export const VisualData = ({ mission, lang }: { mission: Mission; lang: Language }) => {
  const t = translations[lang];

  if (mission.type === 'SIMPLE_EQ') {
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <div className="text-4xl font-black text-[#3d2b1f] mb-2">
          <MathView tex={mission.description[lang].match(/\$(.*?)\$/)?.[1] || ''} />
        </div>
        <p className="text-[#5c4033] text-[10px] font-bold uppercase tracking-widest">基础代数方程 (Simple Equation)</p>
      </div>
    );
  }
  if (mission.type === 'PERCENTAGE') {
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <div className="text-3xl font-black text-[#3d2b1f] mb-2">
          <MathView tex={`${mission.data.initial} \\times (1 + ${mission.data.rate})^{${mission.data.years}}`} />
        </div>
        <p className="text-[#5c4033] text-[10px] font-bold uppercase tracking-widest">复利增长模型 (Compound Growth)</p>
      </div>
    );
  }
  if (mission.type === 'ESTIMATION') {
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <div className="text-5xl font-black text-[#3d2b1f] mb-2">
          <MathView tex={`\\sqrt{${mission.data.value}} \\approx ?`} />
        </div>
        <p className="text-[#5c4033] text-[10px] font-bold uppercase tracking-widest">无理数估算 (Estimation)</p>
      </div>
    );
  }
  if (mission.type === 'LINEAR') {
    const [[x1, y1], [x2, y2]] = mission.data.points;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">{t.pointA}</span>
          <MathView tex={`(${x1}, ${y1})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">{t.pointB}</span>
          <MathView tex={`(${x2}, ${y2})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
      </div>
    );
  }
  if (mission.type === 'AREA' && mission.data.length) {
    const { length, width } = mission.data;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 flex flex-col items-center">
        <div className="w-32 h-20 border-4 border-[#3d2b1f] bg-indigo-500/20 flex items-center justify-center relative">
          <span className="absolute -top-6 text-xs font-bold text-[#5c4033]">长: {length}</span>
          <span className="absolute -left-10 text-xs font-bold text-[#5c4033]">宽: {width}</span>
          <Sparkles className="text-indigo-500/30" size={32} />
        </div>
      </div>
    );
  }
  if (mission.type === 'QUADRATIC') {
    const [p1, p2] = [mission.data.p1, mission.data.p2];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">起点</span>
          <MathView tex={`(${p1[0]}, ${p1[1]})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
        <div className="flex items-center justify-between bg-white/30 p-3 rounded-lg border border-[#3d2b1f]/10">
          <span className="text-xs font-black text-[#5c4033]">落点</span>
          <MathView tex={`(${p2[0]}, ${p2[1]})`} className="text-lg font-black text-[#3d2b1f]" />
        </div>
      </div>
    );
  }
  if (mission.type === 'INDICES') {
    const { base, e1, e2 } = mission.data;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 text-center">
        <MathView tex={`${base}^{${e1}} \\times ${base}^{${e2}} = ${base}^x`} className="text-2xl font-black text-[#3d2b1f]" />
      </div>
    );
  }
  if (mission.type === 'PYTHAGORAS') {
    const { a, b } = mission.data;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10 flex flex-col items-center">
        <div className="w-32 h-24 border-b-4 border-l-4 border-[#3d2b1f] relative">
          <span className="absolute -left-6 top-1/2 text-xs font-bold text-[#5c4033]">{b}</span>
          <span className="absolute bottom-[-24px] left-1/2 text-xs font-bold text-[#5c4033]">{a}</span>
        </div>
      </div>
    );
  }
  if (mission.type === 'SIMULTANEOUS' && mission.data.eq1) {
    const [a1, b1, c1] = mission.data.eq1;
    const [a2, b2, c2] = mission.data.eq2;
    return (
      <div className="bg-white/30 p-6 rounded-lg border border-[#3d2b1f]/10">
        <MathView tex={`\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + ${b2}y = ${c2} \\end{cases}`} className="text-xl font-black text-[#3d2b1f]" />
      </div>
    );
  }
  return null;
};
