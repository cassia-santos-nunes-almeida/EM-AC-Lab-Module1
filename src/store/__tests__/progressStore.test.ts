import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    // Reset to defaults
    useProgressStore.setState({
      completedModules: [],
      isDarkMode: false,
      sidebarOpen: false,
    });
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
    expect(useProgressStore.getState().isDarkMode).toBe(false);
    useProgressStore.getState().toggleDarkMode();
    expect(useProgressStore.getState().isDarkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
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
