import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChallengeCard } from '../ChallengeCard';

const challenge = {
  title: 'Field Line Challenge',
  description: 'Explore electric field lines.',
  instructions: ['Step one', 'Step two', 'Step three'],
  hint: 'Try adjusting the charge.',
};

describe('ChallengeCard', () => {
  it('renders title, description, and instructions', () => {
    render(<ChallengeCard challenge={challenge} />);
    expect(screen.getByText('Field Line Challenge')).toBeInTheDocument();
    expect(screen.getByText('Explore electric field lines.')).toBeInTheDocument();
    expect(screen.getByText('Step one')).toBeInTheDocument();
  });

  it('advances steps with Next Step button', () => {
    render(<ChallengeCard challenge={challenge} />);
    fireEvent.click(screen.getByText('Next Step'));
    // Step one should now be crossed out (completed)
    const stepOne = screen.getByText('Step one');
    expect(stepOne.closest('div')).toHaveClass('line-through');
  });

  it('shows Mark Complete on last step', () => {
    render(<ChallengeCard challenge={challenge} />);
    fireEvent.click(screen.getByText('Next Step'));
    fireEvent.click(screen.getByText('Next Step'));
    expect(screen.getByText('Mark Complete')).toBeInTheDocument();
  });

  it('calls onComplete and shows completed state', () => {
    const onComplete = vi.fn();
    render(<ChallengeCard challenge={challenge} onComplete={onComplete} />);
    fireEvent.click(screen.getByText('Next Step'));
    fireEvent.click(screen.getByText('Next Step'));
    fireEvent.click(screen.getByText('Mark Complete'));
    expect(onComplete).toHaveBeenCalled();
  });

  it('shows hint when Hint button is clicked', () => {
    render(<ChallengeCard challenge={challenge} />);
    fireEvent.click(screen.getByText('Hint'));
    expect(screen.getByText('Try adjusting the charge.')).toBeInTheDocument();
  });
});
