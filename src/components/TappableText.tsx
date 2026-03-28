/**
 * TappableText — Renders text with tappable vocabulary words.
 *
 * In English mode, mathematical vocabulary terms are auto-detected and
 * rendered as tappable spans (dashed underline). Tapping opens VocabPopup.
 * LaTeX segments ($...$) are rendered via KaTeX and NOT tappable.
 * Chinese mode renders normally (no tap targets).
 */
import { useState, useMemo } from 'react';
import type { Language } from '../types';
import { MathView } from './MathView';
import { findVocabInText, type MathWord } from '../data/vocab/mathVocab';
import { VocabPopup } from './VocabPopup';

type Props = {
  text: string;
  lang: Language;
  /** Mission kpId — used for L2/L3 context in VocabPopup */
  kpId?: string;
  /** Mission description for L2 题意解读 */
  missionDesc?: { zh: string; en: string };
  className?: string;
  /** Callback when a vocab tap event occurs (for analytics) */
  onVocabTap?: (wordId: string, level: 1 | 2 | 3) => void;
};

export function TappableText({ text, lang, kpId, missionDesc, className = '', onVocabTap }: Props) {
  const [activeWord, setActiveWord] = useState<MathWord | null>(null);

  // Only enable tappable words in English mode
  const isEnglish = lang === 'en';

  // Split text into segments: plain text, LaTeX ($...$), and vocab matches
  const segments = useMemo(() => {
    if (!isEnglish || !text) return [{ type: 'text' as const, content: text }];

    // First, split by LaTeX delimiters
    const parts: { type: 'text' | 'latex'; content: string }[] = [];
    let remaining = text;
    const latexRegex = /\$\$[^$]+\$\$|\$[^$]+\$/g;
    let lastIdx = 0;
    let match;

    while ((match = latexRegex.exec(remaining)) !== null) {
      if (match.index > lastIdx) {
        parts.push({ type: 'text', content: remaining.slice(lastIdx, match.index) });
      }
      parts.push({ type: 'latex', content: match[0] });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < remaining.length) {
      parts.push({ type: 'text', content: remaining.slice(lastIdx) });
    }

    // For each text segment, find vocab words
    const result: { type: 'text' | 'latex' | 'vocab'; content: string; word?: MathWord }[] = [];

    for (const part of parts) {
      if (part.type === 'latex') {
        result.push(part);
        continue;
      }

      const vocabMatches = findVocabInText(part.content);
      if (vocabMatches.length === 0) {
        result.push(part);
        continue;
      }

      let pos = 0;
      for (const vm of vocabMatches) {
        if (vm.start > pos) {
          result.push({ type: 'text', content: part.content.slice(pos, vm.start) });
        }
        result.push({ type: 'vocab', content: part.content.slice(vm.start, vm.end), word: vm.word });
        pos = vm.end;
      }
      if (pos < part.content.length) {
        result.push({ type: 'text', content: part.content.slice(pos) });
      }
    }

    return result;
  }, [text, isEnglish]);

  return (
    <>
      <span className={className}>
        {segments.map((seg, i) => {
          if (seg.type === 'latex') {
            const tex = seg.content.replace(/^\$\$?|\$\$?$/g, '');
            const isDisplay = seg.content.startsWith('$$');
            return <MathView key={i} tex={tex} inline={!isDisplay} />;
          }
          if (seg.type === 'vocab' && seg.word) {
            return (
              <button
                key={i}
                onClick={() => { setActiveWord(seg.word!); onVocabTap?.(seg.word!.id, 1); }}
                className="inline text-inherit font-inherit underline decoration-dashed decoration-indigo-400/50 underline-offset-2 hover:decoration-indigo-500 hover:bg-indigo-50 rounded px-0.5 transition-colors cursor-help"
                aria-label={`Look up: ${seg.word.en}`}
              >
                {seg.content}
              </button>
            );
          }
          // Handle newlines in plain text
          return <span key={i}>{seg.content.split('\n').map((line, j) => (
            j > 0 ? <><br />{line}</> : line
          ))}</span>;
        })}
      </span>

      {/* Vocab Popup — three-layer progressive hints */}
      {activeWord && (
        <VocabPopup
          word={activeWord}
          lang={lang}
          kpId={kpId}
          missionDesc={missionDesc}
          onClose={() => setActiveWord(null)}
          onLevelChange={(level) => onVocabTap?.(activeWord.id, level)}
        />
      )}
    </>
  );
}
