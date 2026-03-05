import { Lightbulb } from 'lucide-react';

/** Displays a real-world context hook at the top of a module page. */
interface RealWorldHookProps {
  /** The hook text (2-3 sentences connecting physics to real-world application). */
  text: string;
}

export function RealWorldHook({ text }: RealWorldHookProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-900/20 mb-4">
      <Lightbulb size={20} className="text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
