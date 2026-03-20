# EM&AC Lab — Module 1: Electromagnetic Fundamentals

> **Global rules:** see `../CLAUDE.md`. **Recurring corrections:** see `../PATTERNS.md`. **Session state:** see `../SESSION.md`.

Part of the three-module EM&AC Lab course: **M1 (EM Fundamentals)** → M2 (Circuit Analysis) → M3 (Transmission Lines & Antennas).

## Quick Start

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run lint         # ESLint (incl. jsx-a11y accessibility)
npm test             # Vitest test suite (71 tests)
npm run preview      # Preview production build locally
```

## Architecture

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (PostCSS) |
| State | Zustand (persisted to localStorage) |
| Routing | react-router-dom v7 (lazy-loaded pages) |
| Icons | lucide-react |
| Math | KaTeX via `MathWrapper` component |
| Charts | recharts (available, not yet used) |
| AI Tutor | Google Gemini API (client-side) |
| PWA | vite-plugin-pwa |
| Testing | Vitest + @testing-library/react |
| Analytics | @vercel/analytics |

## Key Directories

```
src/
├── components/
│   ├── common/     — Reusable: Slider, ControlPanel, MathWrapper, ConceptCheck, PredictionGate, ChallengeCard, AiTutor, etc.
│   └── layout/     — Layout shell (responsive sidebar + main), Sidebar (module nav, progress, dark mode)
├── pages/          — One page per physics module (10 total, lazy-loaded)
├── constants/      — Physics colors, module definitions, quiz content, cross-module URLs
├── canvas/         — Canvas drawing helpers (arrows, fieldLines, grid)
├── hooks/          — useAnimationFrame, useCanvasSetup, useCanvasTouch, useOnlineStatus
├── store/          — progressStore (Zustand: progress + theme), useThemeStore persisted to `emac-theme`
├── types/          — Shared TypeScript interfaces
└── utils/          — cn() (clsx + tailwind-merge)
```

## Module-Specific Conventions

- **Canvas colors**: Import `COLORS` / `COLORS_DARK` from `@/constants/physics`; select based on `isDarkMode` from store
- **Pages**: Default export, wrapped in ErrorBoundary via App.tsx routing

## Physics Modules

| Route | Page | Canvas? | Key Features |
|---|---|---|---|
| `/` | OverviewPage | No | Module cards, AI disclaimer, license |
| `/maxwell` | MaxwellPage | Yes (×4) | 4 animated Maxwell cards, integral + differential forms |
| `/gauss` | GaussPage | Yes | Electric/Magnetic mode toggle |
| `/coulomb` | CoulombPage | Yes | Drag charges, field lines, force vectors |
| `/ampere` | AmperePage | Yes | Right-hand rule animation with current |
| `/lorentz` | LorentzPage | Yes | Boris integrator cyclotron simulation |
| `/faraday` | FaradayPage | Yes | Induction animation with loops |
| `/lenz` | LenzPage | Yes | Axial dipole flux model, magnet + coil |
| `/em-wave` | EMWavePage | Yes | 2D, 3D, V-I Phasor, Phasor Sync views |
| `/polarization` | PolarizationPage | Yes | Lissajous + 3D, Stokes parameters |
| `/magnetic-circuits` | MagneticCircuitsPage | Yes | Toroid, reluctance, mutual inductance, bridge to M2 |

## Content Bridges

- **Magnetic Circuits page** → M2 (transformers, mutual inductance) — contains "Continue to Module 2" link
- **Phasor concepts** → M3 (transmission line phasors)
- **EM waves** → M3 (wave propagation on lines)

## Skills

- `/refactor` — 5-phase code refactoring workflow (see `commands/refactor.md`)
- Frontend Design — Educational app design guidelines (see `skills/frontend-design/SKILL.md`)

## Reference

- `context/decisions.md` — Architecture decisions log (20 ADRs)

## Do Not Modify

- `docs/em_compreenssive_viewer.html` — Original monolithic reference (preserved for comparison)
- `new-app-blueprint.md` — Blueprint template document
