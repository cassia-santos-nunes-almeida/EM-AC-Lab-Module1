import { useState, type ReactNode } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProgressStore } from '@/store/progressStore';

/** A single prediction option with correctness and explanation. */
interface PredictionOption {
  /** Display label for the option button. */
  label: string;
  /** Whether this option is the correct prediction. */
  correct: boolean;
  /** Explanation shown after the student commits to a prediction. */
  explanation: string;
}

/** Props for the PredictionGate component. */
interface PredictionGateProps {
  /** Unique identifier for this gate (used for persistence). */
  gateId: string;
  /** The prediction question shown to the student. */
  question: string;
  /** Available prediction options. */
  options: PredictionOption[];
  /** The simulation content revealed after prediction. */
  children: ReactNode;
}

/**
 * Hides a simulation behind a prediction question. The student must commit
 * to a prediction before the simulation is revealed. One-shot — no retries.
 */
export function PredictionGate({ gateId, question, options, children }: PredictionGateProps) {
  const { recordPrediction, getPrediction } = useProgressStore();
  const stored = getPrediction(gateId);

  const [chosen, setChosen] = useState<number | null>(stored ? options.findIndex(o => o.label === stored.chosenLabel) : null);
  const [revealed, setRevealed] = useState(!!stored);

  const handleSelect = (index: number) => {
    if (chosen !== null) return; // one-shot
    setChosen(index);
    const opt = options[index];
    recordPrediction(gateId, opt.correct, opt.label);
    // Brief delay before revealing simulation
    setTimeout(() => setRevealed(true), 300);
  };

  const selectedOption = chosen !== null ? options[chosen] : null;
  const correctOption = options.find(o => o.correct);

  if (!revealed && chosen === null) {
    // Show prediction question
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 space-y-5">
          <div className="flex items-start gap-3">
            <HelpCircle size={24} className="text-indigo-500 shrink-0 mt-0.5" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Make a prediction
            </h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {question}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => handleSelect(i)}
                className="px-4 py-3 text-sm font-medium rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            This is a one-shot prediction — choose carefully!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Result banner */}
      <div className={cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        selectedOption?.correct
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      )}>
        {selectedOption?.correct ? (
          <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
        )}
        <div className="space-y-2 text-sm">
          <p className={cn(
            'font-bold',
            selectedOption?.correct
              ? 'text-emerald-800 dark:text-emerald-300'
              : 'text-red-800 dark:text-red-300'
          )}>
            {selectedOption?.correct ? 'Correct!' : `Not quite — you chose "${selectedOption?.label}"`}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {selectedOption?.explanation}
          </p>
          {selectedOption && !selectedOption.correct && correctOption && (
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              <strong className="text-emerald-700 dark:text-emerald-400">Correct answer: {correctOption.label}.</strong>{' '}
              {correctOption.explanation}
            </p>
          )}
        </div>
      </div>

      {/* Simulation content with fade-in transition */}
      <div className={cn(
        'transition-opacity duration-500',
        revealed ? 'opacity-100' : 'opacity-0'
      )}>
        {children}
      </div>
    </div>
  );
}
