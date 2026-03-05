import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConceptCheck } from '../ConceptCheck';

const question = {
  question: 'What is the speed of light?',
  options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s'],
  correctIndex: 0,
  explanation: 'Light travels at approximately 3×10⁸ m/s in vacuum.',
};

describe('ConceptCheck', () => {
  it('renders question and options', () => {
    render(<ConceptCheck question={question} />);
    expect(screen.getByText('What is the speed of light?')).toBeInTheDocument();
    expect(screen.getByText('3×10⁸ m/s')).toBeInTheDocument();
    expect(screen.getByText('3×10⁶ m/s')).toBeInTheDocument();
  });

  it('check answer button is disabled until selection', () => {
    render(<ConceptCheck question={question} />);
    expect(screen.getByText('Check Answer')).toBeDisabled();
  });

  it('enables submit after selecting an option', () => {
    render(<ConceptCheck question={question} />);
    fireEvent.click(screen.getByText('3×10⁸ m/s'));
    expect(screen.getByText('Check Answer')).not.toBeDisabled();
  });

  it('shows correct feedback on right answer', () => {
    const onCorrect = vi.fn();
    render(<ConceptCheck question={question} onCorrect={onCorrect} />);
    fireEvent.click(screen.getByText('3×10⁸ m/s'));
    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(onCorrect).toHaveBeenCalled();
  });

  it('shows incorrect feedback on wrong answer', () => {
    render(<ConceptCheck question={question} />);
    fireEvent.click(screen.getByText('3×10⁶ m/s'));
    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Not quite.')).toBeInTheDocument();
    expect(screen.getByText(question.explanation)).toBeInTheDocument();
  });

  it('allows retry after incorrect answer', () => {
    render(<ConceptCheck question={question} />);
    fireEvent.click(screen.getByText('3×10⁶ m/s'));
    fireEvent.click(screen.getByText('Check Answer'));
    fireEvent.click(screen.getByText('Try again'));
    expect(screen.getByText('Check Answer')).toBeDisabled();
  });
});
