import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore, useThemeStore } from '../progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    // Reset to defaults
    useProgressStore.setState({
      completedModules: [],
      quizScores: {},
      predictions: {},
      hintUsage: {},
      sidebarOpen: false,
    });
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.classList.remove('dark');
  });

  it('starts with empty completed modules', () => {
    expect(useProgressStore.getState().completedModules).toEqual([]);
  });

  it('marks a module complete', () => {
    useProgressStore.getState().markComplete('gauss');
    expect(useProgressStore.getState().completedModules).toContain('gauss');
  });

  it('does not duplicate completed modules', () => {
    useProgressStore.getState().markComplete('gauss');
    useProgressStore.getState().markComplete('gauss');
    expect(useProgressStore.getState().completedModules.filter((m) => m === 'gauss')).toHaveLength(1);
  });

  it('marks a module incomplete', () => {
    useProgressStore.getState().markComplete('gauss');
    useProgressStore.getState().markIncomplete('gauss');
    expect(useProgressStore.getState().completedModules).not.toContain('gauss');
  });

  it('isComplete returns correct value', () => {
    expect(useProgressStore.getState().isComplete('maxwell')).toBe(false);
    useProgressStore.getState().markComplete('maxwell');
    expect(useProgressStore.getState().isComplete('maxwell')).toBe(true);
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

  it('records correct quiz answers', () => {
    useProgressStore.getState().recordCorrect('gauss', 0);
    useProgressStore.getState().recordCorrect('gauss', 2);
    expect(useProgressStore.getState().getScore('gauss')).toEqual([0, 2]);
  });

  it('does not duplicate quiz scores', () => {
    useProgressStore.getState().recordCorrect('gauss', 0);
    useProgressStore.getState().recordCorrect('gauss', 0);
    expect(useProgressStore.getState().getScore('gauss')).toEqual([0]);
  });

  it('returns empty array for unscored modules', () => {
    expect(useProgressStore.getState().getScore('unknown')).toEqual([]);
  });
});
