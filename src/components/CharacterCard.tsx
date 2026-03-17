import { motion } from 'motion/react';
import type { Character, Language } from '../types';
import { translations } from '../i18n/translations';
import { MathView, LatexText } from './MathView';
import { CharacterAvatar } from './CharacterAvatar';

export const CharacterCard = ({ character, isSelected, onSelect, lang }: { character: Character; isSelected: boolean; onSelect: () => void; lang: Language; key?: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onSelect}
    className={`cursor-pointer p-4 rounded-2xl border-4 transition-all ${
      isSelected ? 'border-yellow-400 shadow-xl scale-105 bg-white/10' : 'border-transparent bg-white/5'
    }`}
  >
    <div className="mx-auto mb-4 flex justify-center">
      <CharacterAvatar characterId={character.id} size={96} />
    </div>
    <h3 className="text-lg font-bold text-white text-center">{character.name[lang]}</h3>
    <p className="text-yellow-300 text-xs text-center font-medium mb-3">{character.role[lang]}</p>

    <div className="bg-black/20 p-2 rounded-lg mb-3">
      <p className="text-[10px] text-indigo-300 font-bold mb-1">武将技能：</p>
      <LatexText text={character.skill[lang]} className="text-[10px] text-white/80 leading-tight italic" />
    </div>

    <div className="space-y-1 mb-3">
      {Object.entries(character.stats).map(([key, val]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase w-8">{translations[lang].stats[key as keyof typeof character.stats]}</span>
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${character.color}`} style={{ width: `${val}%` }} />
          </div>
          <MathView tex={val} className="text-[10px] text-white font-bold" />
        </div>
      ))}
    </div>
    <p className="text-gray-400 text-[10px] text-center leading-tight">{character.description[lang]}</p>
  </motion.div>
);
