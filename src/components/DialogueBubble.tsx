import { memo, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LatexText } from './MathView';

/**
 * DialogueBubble — Character speech with progressive line-by-line reveal.
 * Text appears like a teacher writing on a whiteboard:
 * - Each LINE reveals sequentially (not all at once)
 * - Within a line, characters type at 25ms each
 * - LaTeX blocks fade+scale in with a slight "draw" delay
 * - Newlines create natural pauses between lines
 */
export const DialogueBubble = memo(function DialogueBubble({
  text,
  speaker,
  onComplete: _onComplete,
}: {
  text: string;
  speaker: string;
  onComplete?: () => void;
}) {
  const lines = text.split('\n');
  const [revealedLines, setRevealedLines] = useState(1);
  const timersRef = useRef<number[]>([]);

  // Progressive line reveal
  useEffect(() => {
    setRevealedLines(1);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    let totalDelay = 0;
    for (let i = 1; i < lines.length; i++) {
      const prevLen = lines[i - 1].replace(/\$[^$]+\$/g, 'XX').length;
      totalDelay += prevLen * 25 + 350;
      const lineIdx = i + 1;
      const d = totalDelay;
      timersRef.current.push(window.setTimeout(() => setRevealedLines(prev => Math.max(prev, lineIdx)), d));
    }

    return () => { timersRef.current.forEach(clearTimeout); };
  }, [text]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative bg-white/90 rounded-2xl px-4 py-3 border-2 shadow-lg max-w-sm border-ink"
    >
      {/* Bubble tail */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className="absolute top-4 -left-2.5 w-0 h-0 origin-right border-y-[6px] border-y-transparent border-r-[10px] border-r-ink"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className="absolute top-4 -left-1.5 w-0 h-0 origin-right border-y-[5px] border-y-transparent border-r-[9px] border-r-white/90"
      />

      {/* Speaker */}
      <div className="text-xs font-bold mb-1 text-[#8b0000]">{speaker}</div>

      {/* Lines — progressive reveal */}
      <div className="text-sm leading-relaxed text-ink space-y-0.5">
        {lines.map((line, idx) => {
          if (idx >= revealedLines) return null;
          if (!line.trim()) return <div key={idx} className="h-1" />;
          return <TypewriterLine key={`${idx}-${text.slice(0, 8)}`} text={line} />;
        })}
      </div>
    </motion.div>
  );
});

/** Single line: characters type one by one, LaTeX blocks fade+scale in */
function TypewriterLine({ text }: { text: string }) {
  const tokens = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);
  let charCount = 0;
  const DELAY = 0.025;

  return (
    <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
      {tokens.map((token, ti) => {
        if ((token.startsWith('$$') || token.startsWith('$')) && token.endsWith('$') && token.length > 1) {
          const delay = charCount * DELAY;
          charCount += 3;
          return (
            <motion.span
              key={ti}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay, duration: 0.3, ease: 'easeOut' }}
              className="inline-block"
            >
              <LatexText text={token} />
            </motion.span>
          );
        }
        return token.split('').map((ch, ci) => {
          const delay = charCount * DELAY;
          charCount++;
          return (
            <motion.span key={`${ti}-${ci}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0 }}>
              {ch}
            </motion.span>
          );
        });
      })}
    </motion.div>
  );
}
