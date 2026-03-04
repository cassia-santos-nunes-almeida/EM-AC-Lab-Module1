# EM&AC Lab — Claude Code Context

## Quick Start

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run lint         # ESLint (incl. jsx-a11y accessibility)
npm test             # Vitest test suite
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

## Key Directories

```
src/
├── components/
│   ├── common/     — Reusable: Slider, ControlPanel, MathWrapper, ConceptCheck, ChallengeCard, AiTutor, ErrorBoundary, etc.
│   └── layout/     — Layout shell (responsive sidebar + main), Sidebar (module nav, progress, dark mode)
├── pages/          — One page per physics module (10 total, lazy-loaded)
├── constants/      — Physics colors, module definitions, quiz content
├── canvas/         — Canvas drawing helpers (arrows, fieldLines, grid)
├── hooks/          — useAnimationFrame, useCanvasSetup, useOnlineStatus
├── store/          — progressStore (Zustand: progress tracking + dark mode)
├── types/          — Shared TypeScript interfaces
└── utils/          — cn() (clsx + tailwind-merge)
```

## Conventions

- **Class merging**: Always use `cn()` from `@/utils/cn` for Tailwind classes
- **Dark mode**: Class-based (`.dark` on `<html>`). Every component MUST have `dark:` variants
- **Canvas colors**: Import `COLORS` / `COLORS_DARK` from `@/constants/physics`; select based on `isDarkMode` from store
- **Math rendering**: Use `<MathWrapper latex="..." />` — never raw HTML or custom parsers
- **Icons**: Import from `lucide-react` — never custom SVG icons
- **Components**: TypeScript + proper interfaces for all props
- **State**: Zustand store for cross-component state; local useState for component-internal state
- **Pages**: Default export, wrapped in ErrorBoundary via App.tsx routing

## Physics Modules

| Route | Page | Canvas? | Key Features |
|---|---|---|---|
| `/` | OverviewPage | No | Module cards, AI disclaimer, license |
| `/maxwell` | MaxwellPage | Yes (×4) | 4 animated Maxwell equation cards |
| `/gauss` | GaussPage | Yes | Electric/Magnetic mode toggle |
| `/coulomb` | CoulombPage | Yes | Drag charges, field lines, force vectors |
| `/ampere` | AmperePage | Yes | Right-hand rule animation with current |
| `/lorentz` | LorentzPage | Yes | Particle physics simulation, cyclotron |
| `/faraday` | FaradayPage | Yes | Induction animation with loops |
| `/lenz` | LenzPage | Yes | Magnet + coil, repulsion/attraction |
| `/em-wave` | EMWavePage | Yes | 3 view modes: 2D, 3D, V-I Phasor |
| `/polarization` | PolarizationPage | Yes | Lissajous + 3D wave propagation |

## Skills

- `/refactor` — 5-phase code refactoring workflow (see `commands/refactor.md`)
- Frontend Design — Educational app design guidelines (see `skills/frontend-design/SKILL.md`)

## Context Files

- `context/current-sprint.md` — Current work progress
- `context/decisions.md` — Architecture decisions log
- `context/known-issues.md` — Known bugs and tech debt

## Do Not Modify

- `docs/em_compreenssive_viewer.html` — Original monolithic reference (preserved for comparison)
- `new-app-blueprint.md` — Blueprint template document
