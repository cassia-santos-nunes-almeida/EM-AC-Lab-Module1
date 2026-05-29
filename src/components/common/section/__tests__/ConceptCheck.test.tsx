import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConceptCheck } from '../ConceptCheck';
import type { ConceptCheckData } from '../ConceptCheck';

const multipleChoiceData: ConceptCheckData = {
  mode: 'multiple-choice',
  question: 'What is 2+2?',
  options: [
    { text: '3', correct: false, explanation: 'Too low.' },
    { text: '4', correct: true, explanation: 'Correct!' },
    { text: '5', correct: false, explanation: 'Too high.' },
  ],
  hints: ['Add the two numbers.', 'It is even.', 'It is four.'],
};

const predictRevealData: ConceptCheckData = {
  mode: 'predict-reveal',
  question: 'What color is the sky?',
  answer: 'Blue on a clear day.',
};

describe('ConceptCheck — multiple-choice mode', () => {
  it('renders the question and all options', () => {
    render(<ConceptCheck data={multipleChoiceData} />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows explanation and fires onComplete after a correct answer', () => {
    const onComplete = vi.fn();
    render(<ConceptCheck data={multipleChoiceData} onComplete={onComplete} />);
    fireEvent.click(screen.getByText('4'));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows explanation but does not fire onComplete after a wrong answer', () => {
    const onComplete = vi.fn();
    render(<ConceptCheck data={multipleChoiceData} onComplete={onComplete} />);
    fireEvent.click(screen.getByText('3'));
    expect(screen.getByText('Too low.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('disables option buttons after selection and resets on Try Again', () => {
    render(<ConceptCheck data={multipleChoiceData} />);
    fireEvent.click(screen.getByText('4'));
    expect(screen.getByText('3').closest('button')).toBeDisabled();
    fireEvent.click(screen.getByText('Try Again'));
    expect(screen.getByText('3').closest('button')).not.toBeDisabled();
  });

  it('reveals hints progressively and fires onHint with the 1-based tier', () => {
    const onHint = vi.fn();
    render(<ConceptCheck data={multipleChoiceData} onHint={onHint} />);
    fireEvent.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('Add the two numbers.')).toBeInTheDocument();
    expect(onHint).toHaveBeenLastCalledWith(1);
    fireEvent.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('It is even.')).toBeInTheDocument();
    expect(onHint).toHaveBeenLastCalledWith(2);
  });
});

describe('ConceptCheck — predict-reveal mode', () => {
  it('renders a Reveal button and fires onComplete on reveal', () => {
    const onComplete = vi.fn();
    render(<ConceptCheck data={predictRevealData} onComplete={onComplete} />);
    expect(screen.getByText('Reveal Answer')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reveal Answer'));
    expect(screen.getByText('Blue on a clear day.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('hides the answer when Hide is clicked', () => {
    render(<ConceptCheck data={predictRevealData} />);
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Hide Answer'));
    expect(screen.queryByText('Blue on a clear day.')).not.toBeInTheDocument();
    expect(screen.getByText('Reveal Answer')).toBeInTheDocument();
  });
});
