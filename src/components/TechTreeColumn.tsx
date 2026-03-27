import { motion } from 'motion/react';
import type { Language } from '../types';
import type { TechBranch } from '../utils/techTree';
import type { Topic } from '../data/curriculum/kp-registry';
import { CHAPTERS } from '../data/curriculum/kp-registry';
import { TechNode } from './TechNode';

export const TechTreeColumn = ({
  lang,
  branch,
  onNodeClick,
}: {
  lang: Language;
  branch: TechBranch;
  onNodeClick: (topicId: string) => void;
}) => {
  // Find the chapter to get topic details
  const chapter = CHAPTERS.find(ch => ch.id === branch.chapterId);
  if (!chapter) return null;

  const pct = branch.totalNodes > 0
    ? Math.round((branch.totalUnlocked / branch.totalNodes) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-56 md:w-64"
    >
      {/* Branch header */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md pb-3 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{branch.icon}</span>
          <h3 className="text-sm font-black text-white truncate">
            {lang === 'en' ? branch.title : branch.titleZh}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-emerald-400 rounded-full"
            />
          </div>
          <span className="text-[10px] text-white/40 font-bold">
            {branch.totalUnlocked}/{branch.totalNodes}
          </span>
        </div>
      </div>

      {/* Topic nodes */}
      <div className="flex flex-col">
        {branch.nodes.map((nodeState, i) => {
          const topic = chapter.topics.find(t => t.id === nodeState.topicId);
          if (!topic) return null;
          return (
            <TechNode
              key={nodeState.topicId}
              lang={lang}
              topic={topic}
              state={nodeState}
              isFirst={i === 0}
              onClick={() => onNodeClick(nodeState.topicId)}
            />
          );
        })}
      </div>
    </motion.div>
  );
};
