import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CollapsibleSection } from '../CollapsibleSection';

describe('CollapsibleSection', () => {
  it('starts collapsed by default', () => {
    render(
      <CollapsibleSection title="Details">
        <span>Hidden content</span>
      </CollapsibleSection>
    );
    expect(screen.getByText('Details')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts open when defaultOpen is true', () => {
    render(
      <CollapsibleSection title="Details" defaultOpen>
        <span>Visible content</span>
      </CollapsibleSection>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles on click', () => {
    render(
      <CollapsibleSection title="Details">
        <span>Content</span>
      </CollapsibleSection>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
