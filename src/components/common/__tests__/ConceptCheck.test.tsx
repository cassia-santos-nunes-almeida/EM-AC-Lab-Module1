import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

const mockRecordHintUsage = vi.hoisted(() => vi.fn());

vi.mock('@/store/progressStore', () => ({
  useProgressStore: () => ({
    recordHintUsage: mockRecordHintUsage,
    getHintTier: () => 0,
  }),
}));

const hintQuestion = {
  question: 'What is the unit of electric charge?',
  options: ['Coulomb', 'Volt', 'Ampere'],
  correctIndex: 0,
  explanation: 'The SI unit of electric charge is the Coulomb (C).',
  hints: [
    { tier: 1 as const, label: 'Think about units', content: 'Consider SI base units for charge.' },
    { tier: 2 as const, label: 'Named after a scientist', content: 'The unit is named after Charles-Augustin de Coulomb.' },
    { tier: 3 as const, label: 'Final hint', content: 'It starts with the letter C.' },
  ],
};

describe('ConceptCheck with 3-tier hints', () => {
  beforeEach(() => {
    mockRecordHintUsage.mockClear();
  });

  it('shows Need a hint? button after wrong answer', () => {
    render(<ConceptCheck question={hintQuestion} hintKey="test:1" />);
    fireEvent.click(screen.getByText('Volt'));
    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Need a hint?')).toBeInTheDocument();
  });

  it('reveals tier 1 hint on click', () => {
    render(<ConceptCheck question={hintQuestion} hintKey="test:1" />);
    fireEvent.click(screen.getByText('Volt'));
    fireEvent.click(screen.getByText('Check Answer'));
    fireEvent.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('Think about units')).toBeInTheDocument();
    expect(screen.getByText('Consider SI base units for charge.')).toBeInTheDocument();
  });

  it('reveals tier 2 hint after tier 1', () => {
    render(<ConceptCheck question={hintQuestion} hintKey="test:1" />);
    fireEvent.click(screen.getByText('Volt'));
    fireEvent.click(screen.getByText('Check Answer'));
    fireEvent.click(screen.getByText('Need a hint?'));
    // After tier 1 is revealed, next button shows tier 2 label
    fireEvent.click(screen.getByText('Named after a scientist'));
    expect(screen.getByText('The unit is named after Charles-Augustin de Coulomb.')).toBeInTheDocument();
  });

  it('reveals all 3 tiers sequentially', () => {
    render(<ConceptCheck question={hintQuestion} hintKey="test:1" />);
    fireEvent.click(screen.getByText('Volt'));
    fireEvent.click(screen.getByText('Check Answer'));
    // Tier 1
    fireEvent.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('Consider SI base units for charge.')).toBeInTheDocument();
    // Tier 2
    fireEvent.click(screen.getByText('Named after a scientist'));
    expect(screen.getByText('The unit is named after Charles-Augustin de Coulomb.')).toBeInTheDocument();
    // Tier 3
    fireEvent.click(screen.getByText('Final hint'));
    expect(screen.getByText('It starts with the letter C.')).toBeInTheDocument();
  });

  it('does not show hints after correct answer', () => {
    render(<ConceptCheck question={hintQuestion} hintKey="test:1" />);
    fireEvent.click(screen.getByText('Coulomb'));
    fireEvent.click(screen.getByText('Check Answer'));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(screen.queryByText('Need a hint?')).not.toBeInTheDocument();
  });
});
