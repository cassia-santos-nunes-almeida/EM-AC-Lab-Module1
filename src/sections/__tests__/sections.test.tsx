import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock katex for all sections that use MathWrapper
vi.mock('katex', () => ({
  default: {
    renderToString: (latex: string) => `<span class="katex">${latex}</span>`,
  },
}));

// Helper to render a section inside a router
function renderSection(Section: React.ComponentType) {
  return render(
    <MemoryRouter>
      <Section />
    </MemoryRouter>
  );
}

describe('Section smoke tests', () => {
  it('OverviewSection renders the hero', async () => {
    const { OverviewSection } = await import('../overview');
    renderSection(OverviewSection);
    expect(screen.getByText('EM&AC Lab')).toBeInTheDocument();
  });

  it('MaxwellSection renders', async () => {
    const { MaxwellSection } = await import('../maxwell');
    renderSection(MaxwellSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('GaussSection renders', async () => {
    const { GaussSection } = await import('../gauss');
    renderSection(GaussSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
    // The guided-challenge capstone is wired in at the end of the section.
    expect(screen.getByText('Flux Through Any Surface')).toBeInTheDocument();
  });

  it('CoulombSection renders', async () => {
    const { CoulombSection } = await import('../coulomb');
    renderSection(CoulombSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('AmpereSection renders', async () => {
    const { AmpereSection } = await import('../ampere');
    renderSection(AmpereSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('LorentzSection renders', async () => {
    const { LorentzSection } = await import('../lorentz');
    renderSection(LorentzSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('FaradaySection renders', async () => {
    const { FaradaySection } = await import('../faraday');
    renderSection(FaradaySection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('LenzSection renders', async () => {
    const { LenzSection } = await import('../lenz');
    renderSection(LenzSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('EMWaveSection renders', async () => {
    const { EMWaveSection } = await import('../em-wave');
    renderSection(EMWaveSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('PolarizationSection renders', async () => {
    const { PolarizationSection } = await import('../polarization');
    renderSection(PolarizationSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });

  it('MagneticCircuitsSection renders', async () => {
    const { MagneticCircuitsSection } = await import('../magnetic-circuits');
    renderSection(MagneticCircuitsSection);
    expect(screen.getByText('Why This Matters')).toBeInTheDocument();
  });
});
