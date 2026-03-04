import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedModules: string[];
  isDarkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  markComplete: (moduleId: string) => void;
  markIncomplete: (moduleId: string) => void;
  isComplete: (moduleId: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedModules: [],
      isDarkMode: false,
      sidebarOpen: false,

      toggleDarkMode: () => {
        set((s) => ({ isDarkMode: !s.isDarkMode }));
        document.documentElement.classList.toggle('dark');
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      markComplete: (moduleId) =>
        set((s) => ({
          completedModules: s.completedModules.includes(moduleId)
            ? s.completedModules
            : [...s.completedModules, moduleId],
        })),

      markIncomplete: (moduleId) =>
        set((s) => ({
          completedModules: s.completedModules.filter((id) => id !== moduleId),
        })),

      isComplete: (moduleId) => get().completedModules.includes(moduleId),
    }),
    {
      name: 'em-lab-progress',
      partialize: (state) => ({
        completedModules: state.completedModules,
        isDarkMode: state.isDarkMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
