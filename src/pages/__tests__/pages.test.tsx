import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock katex for all pages that use MathWrapper
vi.mock('katex', () => ({
  default: {
    renderToString: (latex: string) => `<span class="katex">${latex}</span>`,
  },
}));

// Helper to render a page inside a router
function renderPage(Page: React.ComponentType) {
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>
  );
}

describe('Page smoke tests', () => {
  it('OverviewPage renders module cards', async () => {
    const { default: OverviewPage } = await import('../OverviewPage');
    renderPage(OverviewPage);
    expect(screen.getByText('EM&AC Lab')).toBeInTheDocument();
  });

  it('MaxwellPage renders', async () => {
    const { default: MaxwellPage } = await import('../MaxwellPage');
    renderPage(MaxwellPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('GaussPage renders', async () => {
    const { default: GaussPage } = await import('../GaussPage');
    renderPage(GaussPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('CoulombPage renders', async () => {
    const { default: CoulombPage } = await import('../CoulombPage');
    renderPage(CoulombPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('AmperePage renders', async () => {
    const { default: AmperePage } = await import('../AmperePage');
    renderPage(AmperePage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('LorentzPage renders', async () => {
    const { default: LorentzPage } = await import('../LorentzPage');
    renderPage(LorentzPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('FaradayPage renders', async () => {
    const { default: FaradayPage } = await import('../FaradayPage');
    renderPage(FaradayPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('LenzPage renders', async () => {
    const { default: LenzPage } = await import('../LenzPage');
    renderPage(LenzPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('EMWavePage renders', async () => {
    const { default: EMWavePage } = await import('../EMWavePage');
    renderPage(EMWavePage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('PolarizationPage renders', async () => {
    const { default: PolarizationPage } = await import('../PolarizationPage');
    renderPage(PolarizationPage);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });
});
