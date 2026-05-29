import { describe, it, expect, beforeEach } from 'vitest';
import {
  useProgressStore,
  useThemeStore,
  isModuleComplete,
  migrateSectionsFromLegacy,
} from '../progressStore';

describe('progressStore — theme + UI', () => {
  beforeEach(() => {
    useProgressStore.setState({ sections: {}, sidebarOpen: false });
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.classList.remove('dark');
  });

  it('toggles dark mode', () => {
    expect(useThemeStore.getState().theme).toBe('light');
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('toggles sidebar', () => {
    expect(useProgressStore.getState().sidebarOpen).toBe(false);
    useProgressStore.getState().toggleSidebar();
    expect(useProgressStore.getState().sidebarOpen).toBe(true);
  });

  it('sets sidebar open explicitly', () => {
    useProgressStore.getState().setSidebarOpen(true);
    expect(useProgressStore.getState().sidebarOpen).toBe(true);
    useProgressStore.getState().setSidebarOpen(false);
    expect(useProgressStore.getState().sidebarOpen).toBe(false);
  });
});

describe('isModuleComplete — derived completion badge', () => {
  it('is false for an unvisited / missing section', () => {
    expect(isModuleComplete(undefined, 'gauss')).toBe(false);
    expect(isModuleComplete(
      { visited: false, predictionGatesAnswered: 0, predictionGatesCorrect: 0, conceptChecksCompleted: 3, hintsUsed: 0 },
      'gauss',
    )).toBe(false);
  });

  it('is false when visited but checks are incomplete', () => {
    expect(isModuleComplete(
      { visited: true, predictionGatesAnswered: 0, predictionGatesCorrect: 0, conceptChecksCompleted: 2, hintsUsed: 0 },
      'gauss',
    )).toBe(false);
  });

  it('is true when visited and all expected checks are done', () => {
    expect(isModuleComplete(
      { visited: true, predictionGatesAnswered: 0, predictionGatesCorrect: 0, conceptChecksCompleted: 3, hintsUsed: 0 },
      'gauss',
    )).toBe(true);
  });

  it('treats overview (0 expected checks) as complete once visited', () => {
    expect(isModuleComplete(
      { visited: true, predictionGatesAnswered: 0, predictionGatesCorrect: 0, conceptChecksCompleted: 0, hintsUsed: 0 },
      'overview',
    )).toBe(true);
  });
});

describe('migrateSectionsFromLegacy — one-time em-lab-progress → emac-m1-progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns {} when no legacy data exists', () => {
    expect(migrateSectionsFromLegacy()).toEqual({});
  });

  it('seeds visited=true from legacy completedModules', () => {
    localStorage.setItem('em-lab-progress', JSON.stringify({
      state: { completedModules: ['gauss', 'coulomb'] },
    }));
    const seeded = migrateSectionsFromLegacy();
    expect(seeded.gauss).toEqual({
      visited: true,
      predictionGatesAnswered: 0,
      predictionGatesCorrect: 0,
      conceptChecksCompleted: 0,
      hintsUsed: 0,
    });
    expect(seeded.coulomb.visited).toBe(true);
    expect(Object.keys(seeded)).toHaveLength(2);
  });

  it('does not migrate when the new key already exists', () => {
    localStorage.setItem('emac-m1-progress', JSON.stringify({ state: { sections: {} } }));
    localStorage.setItem('em-lab-progress', JSON.stringify({
      state: { completedModules: ['gauss'] },
    }));
    expect(migrateSectionsFromLegacy()).toEqual({});
  });

  it('tolerates a malformed legacy blob', () => {
    localStorage.setItem('em-lab-progress', 'not json');
    expect(migrateSectionsFromLegacy()).toEqual({});
  });
});
