import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ArrowDown, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { MODULES, LEARNING_TRACKS } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { cn } from '@/utils/cn';
import { useState } from 'react';

/** A single module node in the learning path */
function ModuleNode({ moduleId }: { moduleId: string }) {
  const mod = MODULES.find((m) => m.id === moduleId);
  const { completedModules } = useProgressStore();
  if (!mod) return null;
  const done = completedModules.includes(mod.id);
  const Icon = mod.icon;

  return (
    <Link
      to={mod.path}
      className={cn(
        'group relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5',
        done
          ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-engineering-blue-400 dark:hover:border-engineering-blue-600'
      )}
    >
      <div className={cn(
        'shrink-0 p-2 rounded-lg transition-transform group-hover:scale-110',
        done ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'
      )}>
        <Icon size={20} className={done ? 'text-green-600 dark:text-green-400' : 'text-engineering-blue-600 dark:text-engineering-blue-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{mod.label}</h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{mod.description}</p>
      </div>
      {done ? (
        <CheckCircle size={16} className="text-green-500 shrink-0" />
      ) : (
        <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-engineering-blue-500 shrink-0 transition-colors" />
      )}
    </Link>
  );
}

/** Vertical connector arrow between nodes */
function Connector({ color }: { color: string }) {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown size={16} className={color} />
    </div>
  );
}

export default function OverviewPage() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const { completedModules } = useProgressStore();
  const totalModules = MODULES.filter((m) => m.id !== 'overview').length;
  const completedCount = completedModules.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero — compact */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center justify-center p-3 bg-engineering-blue-100 dark:bg-engineering-blue-900/30 rounded-2xl">
          <Activity size={36} className="text-engineering-blue-600 dark:text-engineering-blue-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          EM&AC Lab
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Visualize and experiment with the fundamental laws of Electromagnetism and AC Circuits.
          Follow the learning path below or jump to any module.
        </p>
        {completedCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-engineering-blue-50 dark:bg-engineering-blue-900/20 border border-engineering-blue-200 dark:border-engineering-blue-800">
            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-engineering-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((completedCount / totalModules) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-engineering-blue-600 dark:text-engineering-blue-400">
              {completedCount}/{totalModules} complete
            </span>
          </div>
        )}
      </div>

      {/* Suggested starting point */}
      <div className="text-center">
        <Link
          to="/coulomb"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-engineering-blue-600 hover:bg-engineering-blue-700 text-white rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Start with Coulomb's Law <ArrowRight size={16} />
        </Link>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Recommended starting point for beginners</p>
      </div>

      {/* Learning Path Flowchart */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 text-center">
          Learning Path
        </h2>

        {/* Three-column track layout on larger screens, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEARNING_TRACKS.map((track) => {
            const trackModules = track.modules;
            const trackComplete = trackModules.every((id) => completedModules.includes(id));
            return (
              <div key={track.id} className="space-y-1">
                {/* Track header */}
                <div className={cn(
                  'flex items-center justify-between px-4 py-2.5 rounded-t-xl border-2 border-b-0',
                  track.bgColor,
                  track.borderColor,
                )}>
                  <h3 className={cn('text-xs font-bold uppercase tracking-wider', track.color)}>
                    {track.label}
                  </h3>
                  {trackComplete && <CheckCircle size={14} className="text-green-500" />}
                </div>

                {/* Track modules */}
                <div className={cn(
                  'space-y-0 p-3 rounded-b-xl border-2 border-t-0',
                  track.borderColor,
                  'bg-white/50 dark:bg-slate-800/50',
                )}>
                  {trackModules.map((modId, i) => (
                    <div key={modId}>
                      <ModuleNode moduleId={modId} />
                      {i < trackModules.length - 1 && (
                        <Connector color={cn('opacity-40', track.color)} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Convergence arrow */}
        <div className="flex justify-center py-2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-12">
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
            </div>
            <div className="w-48 h-px bg-slate-300 dark:bg-slate-600" />
            <ArrowDown size={18} className="text-purple-500 dark:text-purple-400" />
          </div>
        </div>

        {/* Maxwell capstone */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400">
              Capstone
            </span>
          </div>
          <ModuleNode moduleId="maxwell" />
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            All four laws unified — complete the tracks above first for maximum understanding
          </p>
        </div>
      </div>

      {/* AI Disclaimer — collapsible, compact */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <button
          onClick={() => setDisclaimerOpen(!disclaimerOpen)}
          className="w-full flex items-center gap-2 text-left text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <AlertTriangle size={14} className="text-red-400 shrink-0" />
          <span className="font-semibold">AI Generation Disclaimer & License</span>
          <ChevronDown size={14} className={cn('ml-auto transition-transform', disclaimerOpen && 'rotate-180')} />
        </button>
        {disclaimerOpen && (
          <div className="mt-3 pl-6 space-y-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <p>
              This educational application was architected and generated using{' '}
              <strong className="text-slate-700 dark:text-slate-300">Google's Gemini 3 Flash</strong> model.
              While designed to align with rigorous engineering standards, it may contain errors,
              simplifications, or hallucinations.{' '}
              <strong className="text-slate-700 dark:text-slate-300">Always cross-reference</strong> with your official course reference books.
            </p>
            <div className="flex flex-wrap gap-4 text-[11px]">
              <span>&copy; 2026 [CA/EM&CA], LUT University</span>
              <span>CC BY-NC-SA 4.0</span>
              <span>Kopiosto License</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
