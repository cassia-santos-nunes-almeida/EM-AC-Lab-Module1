import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdjacentModules } from '@/constants/physics';

interface ModuleNavigationProps {
  currentModuleId: string;
}

/** Prev/Next navigation between physics modules */
export function ModuleNavigation({ currentModuleId }: ModuleNavigationProps) {
  const { prev, next } = getAdjacentModules(currentModuleId);

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      {prev ? (
        <Link
          to={prev.path}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">Previous</div>
            <div>{prev.label}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.path}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">Next</div>
            <div>{next.label}</div>
          </div>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
