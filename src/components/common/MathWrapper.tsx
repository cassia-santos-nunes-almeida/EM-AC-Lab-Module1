import { useMemo } from 'react';
import katex from 'katex';
import { cn } from '@/utils/cn';

interface MathWrapperProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * KaTeX math renderer with error fallback.
 * Replaces the old custom parseLatex/LatexRenderer.
 */
export function MathWrapper({ latex, displayMode = false, className }: MathWrapperProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
      });
    } catch {
      return `<span class="text-red-500 font-mono text-sm">${latex}</span>`;
    }
  }, [latex, displayMode]);

  return (
    <span
      className={cn('katex-wrapper', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
