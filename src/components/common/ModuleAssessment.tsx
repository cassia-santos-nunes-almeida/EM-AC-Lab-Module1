import { useState, useEffect } from 'react';
import { ConceptCheck } from './ConceptCheck';
import { ChallengeCard } from './ChallengeCard';
import { moduleQuizzes, moduleChallenges } from '@/constants/quizContent';
import { useProgressStore } from '@/store/progressStore';
import { BookOpen, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModuleAssessmentProps {
  moduleId: string;
}

/**
 * Combined quiz + challenge section for a physics module.
 * Shows 3 concept-check questions and 1 guided challenge.
 * Tracks quiz scores and auto-completes module when all correct.
 */
export function ModuleAssessment({ moduleId }: ModuleAssessmentProps) {
  const quizzes = moduleQuizzes[moduleId] ?? [];
  const challenges = moduleChallenges[moduleId] ?? [];
  const [expanded, setExpanded] = useState(true);
  const [quizIndex, setQuizIndex] = useState(0);
  const { recordCorrect, getScore, markComplete } = useProgressStore();
  const correctIndices = getScore(moduleId);
  const score = correctIndices.length;
  const total = quizzes.length;
  const allCorrect = total > 0 && score >= total;

  // Auto-mark module complete when all quiz questions answered correctly
  useEffect(() => {
    if (allCorrect) markComplete(moduleId);
  }, [allCorrect, moduleId, markComplete]);

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
        {total > 0 && (
          <span className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            allCorrect
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          )}>
            {score}/{total}
          </span>
        )}
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
                  aria-label={`Question ${i + 1}`}
                  aria-current={i === quizIndex ? 'true' : undefined}
                  className={cn(
                    'w-7 h-7 rounded-full text-xs font-bold transition-colors',
                    i === quizIndex
                      ? 'bg-engineering-blue-600 text-white'
                      : correctIndices.includes(i)
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-1 ring-green-400'
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
              onCorrect={() => recordCorrect(moduleId, quizIndex)}
              hintKey={`${moduleId}:${quizIndex}`}
            />
          )}

          {/* Completion banner */}
          {allCorrect && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Trophy size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Module complete! All {total} questions answered correctly.
              </span>
            </div>
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
