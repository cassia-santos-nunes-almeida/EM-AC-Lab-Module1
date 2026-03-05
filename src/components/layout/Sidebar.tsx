import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, CheckCircle, X } from 'lucide-react';
import { MODULES, LEARNING_TRACKS } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { cn } from '@/utils/cn';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode, completedModules } = useProgressStore();
  const progress = Math.round(
    (completedModules.length / (MODULES.length - 1)) * 100 // -1 for overview
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <Link to="/" className="flex items-center gap-2" onClick={onClose} aria-label="EM&AC Lab home">
            <div className="p-2 bg-engineering-blue-600 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                EM&AC Lab
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Module 1</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-500 dark:text-slate-400">Progress</span>
            <span className="font-bold text-engineering-blue-600 dark:text-engineering-blue-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-engineering-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Module list grouped by learning track */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* Overview link */}
          {(() => {
            const overview = MODULES.find((m) => m.id === 'overview')!;
            const Icon = overview.icon;
            const isActive = location.pathname === overview.path;
            return (
              <Link
                to={overview.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-engineering-blue-50 dark:bg-engineering-blue-900/20 text-engineering-blue-700 dark:text-engineering-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Icon size={18} className={isActive ? 'text-engineering-blue-500' : ''} />
                <span className="flex-1">{overview.shortLabel}</span>
              </Link>
            );
          })()}

          {/* Track groups */}
          {LEARNING_TRACKS.map((track) => (
            <div key={track.id} className="mt-3">
              <div className={cn('px-4 py-1 text-[10px] font-bold uppercase tracking-widest', track.color)}>
                {track.label}
              </div>
              {MODULES.filter((m) => track.modules.includes(m.id)).map((mod) => {
                const isActive = location.pathname === mod.path;
                const isCompleted = completedModules.includes(mod.id);
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.id}
                    to={mod.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-all',
                      isActive
                        ? 'bg-engineering-blue-50 dark:bg-engineering-blue-900/20 text-engineering-blue-700 dark:text-engineering-blue-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <Icon size={16} className={isActive ? 'text-engineering-blue-500' : ''} />
                    <span className="flex-1">{mod.shortLabel}</span>
                    {isCompleted && (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Capstone modules (Maxwell, Magnetic Circuits) */}
          {(() => {
            const capstoneModules = MODULES.filter((m) => m.track === 'capstone');
            if (capstoneModules.length === 0) return null;
            return (
              <div className="mt-3">
                <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400">
                  Capstone
                </div>
                {capstoneModules.map((mod) => {
                  const isActive = location.pathname === mod.path;
                  const isCompleted = completedModules.includes(mod.id);
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.id}
                      to={mod.path}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-all',
                        isActive
                          ? 'bg-engineering-blue-50 dark:bg-engineering-blue-900/20 text-engineering-blue-700 dark:text-engineering-blue-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <Icon size={16} className={isActive ? 'text-engineering-blue-500' : ''} />
                      <span className="flex-1">{mod.shortLabel}</span>
                      {isCompleted && (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })()}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-600">
            Designed for Engineering Students
          </p>
        </div>
      </aside>
    </>
  );
}
