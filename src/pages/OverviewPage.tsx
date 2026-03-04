import { Link } from 'react-router-dom';
import { Activity, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { MODULES } from '@/constants/physics';

export default function OverviewPage() {
  // Skip overview itself from the module cards
  const modules = MODULES.filter((m) => m.id !== 'overview');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-6 py-8 border-b border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center justify-center p-4 bg-engineering-blue-100 dark:bg-engineering-blue-900/30 rounded-2xl">
          <Activity size={48} className="text-engineering-blue-600 dark:text-engineering-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          EM&AC Lab
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An interactive simulation suite designed for engineering students to visualize and
          experiment with the fundamental laws of Electromagnetism and AC Circuits.
        </p>
        <Link
          to="/coulomb"
          className="inline-flex items-center gap-2 px-8 py-3 bg-engineering-blue-600 hover:bg-engineering-blue-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Start Experimenting <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Module Grid */}
        <div className="lg:col-span-8 xl:col-span-9">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-slate-400" /> Learning Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-engineering-blue-400 dark:hover:border-engineering-blue-600 hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="mb-4 text-engineering-blue-600 dark:text-engineering-blue-400 group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {mod.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                    {mod.description}
                  </p>
                  <div className="mt-4 text-xs font-semibold text-engineering-blue-600 dark:text-engineering-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* AI Disclaimer */}
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-5 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-red-800 dark:text-red-300 text-base">
                  AI Generation Disclaimer
                </h3>
                <div className="text-xs text-red-700 dark:text-red-400 leading-relaxed text-justify space-y-2">
                  <p>
                    This educational application was architected and generated using{' '}
                    <strong>Google's Gemini 3 Flash</strong> model. While designed to align with
                    rigorous engineering standards, it may contain errors, simplifications, or
                    hallucinations.
                  </p>
                  <p>
                    <strong>Always cross-reference</strong> all formulas, diagrams, and explanations
                    with your official course reference books.
                  </p>
                  <p>
                    This tool is a supplementary study aid and should not be used as the sole
                    resource for exam preparation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* License */}
          <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-4">
            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                License & Ownership
              </h4>
              <p className="mb-1">© 2026 [CA/EM&CA], LUT University.</p>
              <p>Licensed under CC BY-NC-SA 4.0.</p>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Usage in Teaching
              </h4>
              <p>
                Provided for educational purposes within LUT University. Third-party materials
                used under Kopiosto License.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
