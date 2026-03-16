import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PredictionGate } from '../PredictionGate';

vi.mock('@/store/progressStore', () => ({
  useProgressStore: () => ({
    recordPrediction: vi.fn(),
    getPrediction: () => undefined,
  }),
}));

const options = [
  { label: 'Option A', correct: true, explanation: 'A is correct because of physics.' },
  { label: 'Option B', correct: false, explanation: 'B is wrong because of math.' },
  { label: 'Option C', correct: false, explanation: 'C is wrong because of logic.' },
];

describe('PredictionGate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders question and options', () => {
    render(
      <PredictionGate gateId="test-gate" question="What happens next?" options={options}>
        <div>Simulation content</div>
      </PredictionGate>
    );
    expect(screen.getByText('What happens next?')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('shows "Make a prediction" heading', () => {
    render(
      <PredictionGate gateId="test-gate" question="What happens next?" options={options}>
        <div>Simulation content</div>
      </PredictionGate>
    );
    expect(screen.getByText('Make a prediction')).toBeInTheDocument();
    expect(screen.getByText(/one-shot prediction/)).toBeInTheDocument();
  });

  it('shows result banner after selecting correct option', () => {
    render(
      <PredictionGate gateId="test-gate" question="What happens next?" options={options}>
        <div>Simulation content</div>
      </PredictionGate>
    );
    fireEvent.click(screen.getByText('Option A'));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows result banner after selecting wrong option', () => {
    render(
      <PredictionGate gateId="test-gate" question="What happens next?" options={options}>
        <div>Simulation content</div>
      </PredictionGate>
    );
    fireEvent.click(screen.getByText('Option B'));
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
  });

  it('shows correct answer when wrong option selected', () => {
    render(
      <PredictionGate gateId="test-gate" question="What happens next?" options={options}>
        <div>Simulation content</div>
      </PredictionGate>
    );
    fireEvent.click(screen.getByText('Option B'));
    expect(screen.getByText(/Correct answer: Option A/)).toBeInTheDocument();
  });

  it('reveals children after selection', () => {
    render(
      <PredictionGate gateId="test-gate" question="What happens next?" options={options}>
        <div>Simulation content</div>
      </PredictionGate>
    );
    fireEvent.click(screen.getByText('Option A'));
    // Children not yet visible (opacity-0 before timer fires)
    expect(screen.getByText('Simulation content')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // After 300ms delay, children become fully visible (opacity-100)
    expect(screen.getByText('Simulation content')).toBeInTheDocument();
  });
});
