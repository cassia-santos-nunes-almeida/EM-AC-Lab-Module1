import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { QuizQuestion } from '@/types';

interface ConceptCheckProps {
  question: QuizQuestion;
  onCorrect?: () => void;
}

/**
 * Multiple-choice predict-then-reveal quiz component.
 * Students must commit to an answer before seeing the result.
 */
export function ConceptCheck({ question, onCorrect }: ConceptCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === question.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === question.correctIndex) {
      onCorrect?.();
    }
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={18} className="text-engineering-blue-500" />
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
          Concept Check
        </h4>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
        {question.question}
      </p>

      <div className="space-y-2 mb-4">
        {question.options.map((option, i) => {
          let optionStyle = 'border-slate-200 dark:border-slate-700 hover:border-engineering-blue-300 dark:hover:border-engineering-blue-600';
          if (revealed) {
            if (i === question.correctIndex) {
              optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20';
            } else if (i === selected && !isCorrect) {
              optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20';
            }
          } else if (i === selected) {
            optionStyle = 'border-engineering-blue-500 bg-engineering-blue-50 dark:bg-engineering-blue-900/20';
          }

          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              className={cn(
                'w-full text-left p-3 rounded-lg border-2 text-sm transition-all',
                optionStyle,
                !revealed && 'cursor-pointer'
              )}
            >
              <span className="font-mono text-xs text-slate-400 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              <span className="text-slate-700 dark:text-slate-300">{option}</span>
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={cn(
            'w-full py-2.5 rounded-lg text-sm font-bold transition-colors',
            selected !== null
              ? 'bg-engineering-blue-600 text-white hover:bg-engineering-blue-700'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          )}
        >
          Check Answer
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className={cn(
              'flex items-center gap-2 p-3 rounded-lg text-sm font-semibold',
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            )}
          >
            {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {question.explanation}
          </p>
          <button
            onClick={handleReset}
            className="text-xs text-engineering-blue-600 dark:text-engineering-blue-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
