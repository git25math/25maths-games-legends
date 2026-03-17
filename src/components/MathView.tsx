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
  const parts = text.split(/(\$.*?\$)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <MathView key={i} tex={part.slice(1, -1)} />;
        }
        return part;
      })}
    </span>
  );
};
