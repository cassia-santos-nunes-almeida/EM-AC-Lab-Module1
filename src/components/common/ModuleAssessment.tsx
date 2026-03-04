import { useState } from 'react';
import { ConceptCheck } from './ConceptCheck';
import { ChallengeCard } from './ChallengeCard';
import { moduleQuizzes, moduleChallenges } from '@/constants/quizContent';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModuleAssessmentProps {
  moduleId: string;
}

/**
 * Combined quiz + challenge section for a physics module.
 * Shows 3 concept-check questions and 1 guided challenge.
 */
export function ModuleAssessment({ moduleId }: ModuleAssessmentProps) {
  const quizzes = moduleQuizzes[moduleId] ?? [];
  const challenges = moduleChallenges[moduleId] ?? [];
  const [expanded, setExpanded] = useState(true);
  const [quizIndex, setQuizIndex] = useState(0);

  if (quizzes.length === 0 && challenges.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
      >
        <BookOpen size={18} className="text-engineering-blue-500" />
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex-grow">
          Test Your Understanding
        </span>
        {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Quiz navigation */}
          {quizzes.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Question:</span>
              {quizzes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQuizIndex(i)}
                  className={cn(
                    'w-7 h-7 rounded-full text-xs font-bold transition-colors',
                    i === quizIndex
                      ? 'bg-engineering-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-engineering-blue-100 dark:hover:bg-engineering-blue-900/30'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Current quiz question */}
          {quizzes[quizIndex] && (
            <ConceptCheck
              key={`${moduleId}-${quizIndex}`}
              question={quizzes[quizIndex]}
            />
          )}

          {/* Challenge */}
          {challenges.map((challenge, i) => (
            <ChallengeCard key={i} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}
