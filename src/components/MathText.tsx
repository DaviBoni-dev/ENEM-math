'use client';

import { InlineMath } from 'react-katex';

export default function MathText({ text }: { text: string }) {
  if (!text) return null;

  // Regex que separa o texto por delimitadores $ ... $
  const parts = text.split(/(\$.*?\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // Remove os símbolos $ e renderiza como LaTeX
          const formula = part.substring(1, part.length - 1);
          return <InlineMath key={index} math={formula} />;
        }
        // Retorna o texto normal
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}