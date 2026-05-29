import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ── Theme store (shared key with M2/M3) ─────────────────────────── */

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Migrate from old em-lab-progress isDarkMode to the shared emac-theme key
function migrateThemeFromLegacy(): Theme {
  try {
    const legacy = localStorage.getItem('em-lab-progress');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.state?.isDarkMode) return 'dark';
    }
  } catch { /* ignore parse errors */ }
  return 'light';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as Theme,
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(next);
          return { theme: next };
        }),
    }),
    {
      name: 'emac-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If emac-theme was never set, try migrating from legacy key
          if (state.theme === 'light') {
            const migrated = migrateThemeFromLegacy();
            if (migrated === 'dark') {
              state.theme = 'dark';
            }
          }
          applyTheme(state.theme);
        }
      },
    }
  )
);

/* ── Progress store (section-based model) ────────────────────────── */

/** Progress tracking for a single section. */
export interface SectionProgress {
  visited: boolean;
  predictionGatesAnswered: number;
  predictionGatesCorrect: number;
  conceptChecksCompleted: number;
  hintsUsed: number;
}

function defaultSectionProgress(): SectionProgress {
  return {
    visited: false,
    predictionGatesAnswered: 0,
    predictionGatesCorrect: 0,
    conceptChecksCompleted: 0,
    hintsUsed: 0,
  };
}

/**
 * Concept-check targets per section, used to derive the "complete" badge shown
 * in the sidebar and overview (docs/m1-section-migration-spec.md §3). Overview
 * is a landing section with no checks and is excluded from completion counts.
 */
export const EXPECTED_CHECKS: Record<string, number> = {
  coulomb: 3,
  gauss: 3,
  ampere: 3,
  lorentz: 3,
  faraday: 3,
  lenz: 3,
  'em-wave': 3,
  polarization: 3,
  maxwell: 3,
  'magnetic-circuits': 3,
};

/** A section is "complete" once it has been visited and its concept checks done. */
export function isModuleComplete(progress: SectionProgress | undefined, id: string): boolean {
  if (!progress) return false;
  return progress.visited && progress.conceptChecksCompleted >= (EXPECTED_CHECKS[id] ?? 0);
}

/**
 * One-time migration from the legacy page-model key (`em-lab-progress`) to the
 * section-model key (`emac-m1-progress`): if the new key is absent but the
 * legacy blob exists, seed `visited = true` for each previously-completed
 * module (best-effort — the old shape had no per-section counters, so those
 * start at 0). The legacy `isDarkMode` field is handled separately by the theme
 * store. See docs/m1-section-migration-spec.md §3.
 */
export function migrateSectionsFromLegacy(): Record<string, SectionProgress> {
  try {
    if (typeof localStorage === 'undefined') return {};
    if (localStorage.getItem('emac-m1-progress')) return {}; // already on the new key
    const legacy = localStorage.getItem('em-lab-progress');
    if (!legacy) return {};
    const parsed = JSON.parse(legacy);
    const completed = parsed?.state?.completedModules;
    if (!Array.isArray(completed)) return {};
    const sections: Record<string, SectionProgress> = {};
    for (const id of completed) {
      if (typeof id === 'string') {
        sections[id] = { ...defaultSectionProgress(), visited: true };
      }
    }
    return sections;
  } catch {
    return {};
  }
}

interface ProgressState {
  sections: Record<string, SectionProgress>;
  markVisited: (sectionId: string) => void;
  markPredictionGate: (sectionId: string, correct: boolean) => void;
  incrementConceptChecks: (sectionId: string) => void;
  incrementHints: (sectionId: string) => void;

  // UI state (not persisted)
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      sections: migrateSectionsFromLegacy(),

      markVisited: (sectionId) =>
        set((s) => ({
          sections: {
            ...s.sections,
            [sectionId]: { ...(s.sections[sectionId] ?? defaultSectionProgress()), visited: true },
          },
        })),

      markPredictionGate: (sectionId, correct) =>
        set((s) => {
          const prev = s.sections[sectionId] ?? defaultSectionProgress();
          return {
            sections: {
              ...s.sections,
              [sectionId]: {
                ...prev,
                predictionGatesAnswered: prev.predictionGatesAnswered + 1,
                predictionGatesCorrect: prev.predictionGatesCorrect + (correct ? 1 : 0),
              },
            },
          };
        }),

      incrementConceptChecks: (sectionId) =>
        set((s) => {
          const prev = s.sections[sectionId] ?? defaultSectionProgress();
          return {
            sections: {
              ...s.sections,
              [sectionId]: { ...prev, conceptChecksCompleted: prev.conceptChecksCompleted + 1 },
            },
          };
        }),

      incrementHints: (sectionId) =>
        set((s) => {
          const prev = s.sections[sectionId] ?? defaultSectionProgress();
          return {
            sections: {
              ...s.sections,
              [sectionId]: { ...prev, hintsUsed: prev.hintsUsed + 1 },
            },
          };
        }),

      // ── UI state (not persisted) ──
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'emac-m1-progress',
      partialize: (state) => ({ sections: state.sections }),
    }
  )
);
