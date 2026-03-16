import { useMemo } from 'react';
import katex from 'katex';
import { cn } from '@/utils/cn';

interface MathWrapperProps {
  /** LaTeX formula string */
  formula?: string;
  /** Display as block (centered) mode */
  block?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * KaTeX math renderer with error fallback.
 */
export function MathWrapper({ formula, block, className }: MathWrapperProps) {
  const text = formula ?? '';
  const isBlock = block ?? false;

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
