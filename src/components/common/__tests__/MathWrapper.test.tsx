import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MathWrapper } from '../MathWrapper';

vi.mock('katex', () => ({
  default: {
    renderToString: (latex: string) => `<span class="katex">${latex}</span>`,
  },
}));

describe('MathWrapper', () => {
  it('renders katex output via dangerouslySetInnerHTML', () => {
    const { container } = render(<MathWrapper latex="E = mc^2" />);
    const wrapper = container.querySelector('.katex-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.innerHTML).toContain('E = mc^2');
  });

  it('applies custom className', () => {
    const { container } = render(<MathWrapper latex="x" className="my-math" />);
    expect(container.querySelector('.katex-wrapper')).toHaveClass('my-math');
  });
});
