import katex from 'katex';

export const MathView = ({ tex, inline = true, className = "" }: { tex: string | number; inline?: boolean; className?: string; key?: any }) => {
  try {
    const html = katex.renderToString(String(tex), {
      throwOnError: false,
      displayMode: !inline
    });
    return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span className={className}>{String(tex)}</span>;
  }
};

export const LatexText = ({ text, className = "" }: { text: string; className?: string }) => {
  // Split by newlines first, then by LaTeX delimiters within each line
  const lines = text.split('\n');
  return (
    <span className={className}>
      {lines.map((line, li) => {
        const parts = line.split(/(\$.*?\$)/g);
        return (
          <span key={li}>
            {li > 0 && <br />}
            {parts.map((part, pi) => {
              if (part.startsWith('$') && part.endsWith('$')) {
                return <MathView key={pi} tex={part.slice(1, -1)} />;
              }
              return part;
            })}
          </span>
        );
      })}
    </span>
  );
};
