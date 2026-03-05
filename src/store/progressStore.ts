import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Maps moduleId → set of correctly answered question indices */
type QuizScores = Record<string, number[]>;

interface ProgressState {
  completedModules: string[];
  quizScores: QuizScores;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  markComplete: (moduleId: string) => void;
  markIncomplete: (moduleId: string) => void;
  isComplete: (moduleId: string) => boolean;
  recordCorrect: (moduleId: string, questionIndex: number) => void;
  getScore: (moduleId: string) => number[];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedModules: [],
      quizScores: {},
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

      recordCorrect: (moduleId, questionIndex) =>
        set((s) => {
          const prev = s.quizScores[moduleId] ?? [];
          if (prev.includes(questionIndex)) return s;
          return { quizScores: { ...s.quizScores, [moduleId]: [...prev, questionIndex] } };
        }),

      getScore: (moduleId) => get().quizScores[moduleId] ?? [],
    }),
    {
      name: 'em-lab-progress',
      partialize: (state) => ({
        completedModules: state.completedModules,
        quizScores: state.quizScores,
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
