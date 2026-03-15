import { useMemo } from 'react';
import katex from 'katex';
import { cn } from '@/utils/cn';

interface MathWrapperProps {
  /** LaTeX formula string */
  formula?: string;
  /** @deprecated Use `formula` instead */
  latex?: string;
  /** Display as block (centered) mode */
  block?: boolean;
  /** @deprecated Use `block` instead */
  displayMode?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * KaTeX math renderer with error fallback.
 * Replaces the old custom parseLatex/LatexRenderer.
 */
export function MathWrapper({ formula, latex, block, displayMode, className }: MathWrapperProps) {
  const text = formula ?? latex ?? '';
  const isBlock = block ?? displayMode ?? false;

  const html = useMemo(() => {
    try {
      return katex.renderToString(text, {
        displayMode: isBlock,
        throwOnError: false,
        trust: true,
      });
    } catch {
      return `<span class="text-red-500 font-mono text-sm">${text}</span>`;
    }
  }, [text, isBlock]);

  return (
    <span
      role="math"
      aria-label={text}
      className={cn('katex-wrapper', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
