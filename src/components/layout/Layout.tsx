import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, WifiOff } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AiTutor } from '@/components/common/AiTutor';
import { useProgressStore } from '@/store/progressStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { MODULES } from '@/constants/physics';

export function Layout() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useProgressStore();
  const isOnline = useOnlineStatus();
  const location = useLocation();

  // Determine current module for AI Tutor context
  const currentModule = MODULES.find((m) => m.path === location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">EM&AC Lab</h1>
          </div>
        </header>

        {/* Offline banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
            <WifiOff size={14} />
            You are offline. Some features may be unavailable.
          </div>
        )}

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 p-4 md:p-6 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Tutor FAB */}
      <AiTutor moduleContext={currentModule?.label} />
    </div>
  );
}
