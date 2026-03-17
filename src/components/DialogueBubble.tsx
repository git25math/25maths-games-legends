import { useState, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { LatexText } from './MathView';

export const DialogueBubble = memo(function DialogueBubble({
  text,
  speaker,
  onComplete,
}: {
  text: string;
  speaker: string;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setTypingDone(false);
    let index = 0;
    const speed = text.length > 30 ? 25 : 40;

    const timer = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
      } else {
        clearInterval(timer);
        setTypingDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative bg-white/90 rounded-2xl px-4 py-3 border-2 shadow-lg max-w-xs"
      style={{ borderColor: '#3d2b1f' }}
    >
      {/* Bubble tail pointing left */}
      <div
        className="absolute top-4 -left-2.5 w-0 h-0"
        style={{
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: '10px solid #3d2b1f',
        }}
      />
      <div
        className="absolute top-4 -left-1.5 w-0 h-0"
        style={{
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: '9px solid rgba(255,255,255,0.9)',
        }}
      />

      {/* Speaker name */}
      <div className="text-xs font-bold mb-1" style={{ color: '#8b0000' }}>
        {speaker}
      </div>

      {/* Typed text — plain during typing, LaTeX-rendered when done */}
      <div className="text-sm leading-relaxed" style={{ color: '#3d2b1f' }}>
        {typingDone ? (
          <LatexText text={text} />
        ) : (
          <>
            {displayedText}
            <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-[#3d2b1f] animate-pulse align-text-bottom" />
          </>
        )}
      </div>
    </motion.div>
  );
});
