import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PredictionGate } from '../PredictionGate';

const options = [
  { id: 'up', label: 'Curves up' },
  { id: 'down', label: 'Curves down' },
  { id: 'straight', label: 'Goes straight' },
];

function renderGate(props: Partial<React.ComponentProps<typeof PredictionGate>> = {}) {
  return render(
    <PredictionGate
      question="Which way does it go?"
      options={options}
      getCorrectAnswer={() => 'up'}
      explanation={<span>Because physics.</span>}
      {...props}
    >
      <div>Revealed simulation</div>
    </PredictionGate>,
  );
}

describe('PredictionGate', () => {
  it('renders the question and options, hiding children behind the gate', () => {
    renderGate();
    expect(screen.getByText('Which way does it go?')).toBeInTheDocument();
    expect(screen.getByText('Curves up')).toBeInTheDocument();
    expect(screen.getByText('Curves down')).toBeInTheDocument();
    expect(screen.queryByText('Revealed simulation')).not.toBeInTheDocument();
  });

  it('fires onPredict(true) and shows "Correct!" when the right option is chosen', () => {
    const onPredict = vi.fn();
    renderGate({ onPredict });
    fireEvent.click(screen.getByText('Curves up'));
    expect(onPredict).toHaveBeenCalledWith(true);
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText('Because physics.')).toBeInTheDocument();
  });

  it('fires onPredict(false) and shows the explanation when a wrong option is chosen', () => {
    const onPredict = vi.fn();
    renderGate({ onPredict });
    fireEvent.click(screen.getByText('Curves down'));
    expect(onPredict).toHaveBeenCalledWith(false);
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
  });

  it('reveals children only after Continue', () => {
    renderGate();
    fireEvent.click(screen.getByText('Curves up'));
    expect(screen.queryByText('Revealed simulation')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Continue'));
    expect(screen.getByText('Revealed simulation')).toBeInTheDocument();
  });

  it('Skip reveals children without answering', () => {
    renderGate();
    fireEvent.click(screen.getByText('Skip'));
    expect(screen.getByText('Revealed simulation')).toBeInTheDocument();
  });

  it('hides Skip when allowSkip is false', () => {
    renderGate({ allowSkip: false });
    expect(screen.queryByText('Skip')).not.toBeInTheDocument();
  });

  it('resetKey change remounts the gate and clears the answer', () => {
    const { rerender } = render(
      <PredictionGate
        question="Q"
        options={options}
        getCorrectAnswer={() => 'up'}
        explanation={<span>exp</span>}
        resetKey="a"
      >
        <div>child</div>
      </PredictionGate>,
    );
    fireEvent.click(screen.getByText('Curves up'));
    expect(screen.getByText('Continue')).toBeInTheDocument();
    rerender(
      <PredictionGate
        question="Q"
        options={options}
        getCorrectAnswer={() => 'up'}
        explanation={<span>exp</span>}
        resetKey="b"
      >
        <div>child</div>
      </PredictionGate>,
    );
    // State cleared by remount: no Continue button, options re-enabled.
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(screen.getByText('Curves up').closest('button')).not.toBeDisabled();
  });
});
