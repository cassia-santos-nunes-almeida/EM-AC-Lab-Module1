import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../progressStore';

/**
 * Tests for the section-based progress model (docs/m1-section-migration-spec.md §3).
 * The legacy page-model API is covered by progressStore.test.ts and is retired
 * once every page has been converted to a section.
 */
describe('progressStore — section model', () => {
  beforeEach(() => {
    useProgressStore.setState({ sections: {} });
  });

  it('starts with no sections', () => {
    expect(useProgressStore.getState().sections).toEqual({});
  });

  it('markVisited creates a section entry with visited=true and zeroed counters', () => {
    useProgressStore.getState().markVisited('gauss');
    expect(useProgressStore.getState().sections.gauss).toEqual({
      visited: true,
      predictionGatesAnswered: 0,
      predictionGatesCorrect: 0,
      conceptChecksCompleted: 0,
      hintsUsed: 0,
    });
  });

  it('markVisited is idempotent and preserves existing counters', () => {
    useProgressStore.getState().incrementConceptChecks('gauss');
    useProgressStore.getState().markVisited('gauss');
    useProgressStore.getState().markVisited('gauss');
    const s = useProgressStore.getState().sections.gauss;
    expect(s.visited).toBe(true);
    expect(s.conceptChecksCompleted).toBe(1);
  });

  it('incrementConceptChecks accumulates per section', () => {
    useProgressStore.getState().incrementConceptChecks('gauss');
    useProgressStore.getState().incrementConceptChecks('gauss');
    useProgressStore.getState().incrementConceptChecks('coulomb');
    expect(useProgressStore.getState().sections.gauss.conceptChecksCompleted).toBe(2);
    expect(useProgressStore.getState().sections.coulomb.conceptChecksCompleted).toBe(1);
  });

  it('incrementHints accumulates', () => {
    useProgressStore.getState().incrementHints('lorentz');
    useProgressStore.getState().incrementHints('lorentz');
    useProgressStore.getState().incrementHints('lorentz');
    expect(useProgressStore.getState().sections.lorentz.hintsUsed).toBe(3);
  });

  it('markPredictionGate counts answered and correct separately', () => {
    useProgressStore.getState().markPredictionGate('faraday', true);
    useProgressStore.getState().markPredictionGate('faraday', false);
    useProgressStore.getState().markPredictionGate('faraday', true);
    const s = useProgressStore.getState().sections.faraday;
    expect(s.predictionGatesAnswered).toBe(3);
    expect(s.predictionGatesCorrect).toBe(2);
  });

  it('keeps sections independent', () => {
    useProgressStore.getState().markVisited('gauss');
    useProgressStore.getState().markPredictionGate('lenz', false);
    expect(useProgressStore.getState().sections.gauss.visited).toBe(true);
    expect(useProgressStore.getState().sections.gauss.predictionGatesAnswered).toBe(0);
    expect(useProgressStore.getState().sections.lenz.visited).toBe(false);
    expect(useProgressStore.getState().sections.lenz.predictionGatesAnswered).toBe(1);
  });
});
