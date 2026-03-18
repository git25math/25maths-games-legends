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
    <span className={`overflow-wrap-anywhere ${className}`} style={{ overflowWrap: 'anywhere' }}>
      {lines.map((line, li) => {
        // Match $...$ but not empty $$ (which would be display math)
        const parts = line.split(/(\$(?!\$).*?\$)/g);
        return (
          <span key={li}>
            {li > 0 && <br />}
            {parts.map((part, pi) => {
              if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
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
