# Project Reference — EM&AC Lab: Module 1

Detailed technical reference. For quick context, see `CLAUDE.md` instead.
For shared conventions, see `COURSE_GUIDELINES.md`.

---

## Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 19.2.x | Functional components |
| Language | TypeScript | ~5.9.3 | Strict mode |
| Build tool | Vite | 7.3.x | `@vitejs/plugin-react`, `@` path alias |
| Styling | Tailwind CSS | 4.1.x | PostCSS plugin, `cn()` utility |
| Routing | React Router DOM | 7.x | BrowserRouter, lazy-loaded pages |
| Charts | Recharts | 2.x | Available, not yet used |
| Math | KaTeX | 0.16.x | Custom `MathWrapper` component |
| Icons | Lucide React | 0.511.x | Tree-shakeable SVG |
| AI | Google Generative AI SDK | latest | Gemini, API key in localStorage |
| State | Zustand | 5.x | `useThemeStore` + `useProgressStore` |
| PWA | vite-plugin-pwa | 1.0 | skipWaiting, cleanupOutdatedCaches |
| Testing | Vitest | 3.x | 60 tests, jsdom |
| Analytics | @vercel/analytics | latest | Auto page view tracking |

---

## Pages (10 physics modules + 1 overview)

| Route | Page | Canvas Simulations |
|-------|------|--------------------|
| `/` | OverviewPage | — |
| `/maxwell` | MaxwellPage | 4 animated Maxwell equation cards |
| `/gauss` | GaussPage | Electric/Magnetic Gauss mode toggle |
| `/coulomb` | CoulombPage | Drag charges, field lines |
| `/ampere` | AmperePage | Right-hand rule animation |
| `/lorentz` | LorentzPage | Boris integrator cyclotron |
| `/faraday` | FaradayPage | Induction animation |
| `/lenz` | LenzPage | Axial dipole flux model |
| `/em-wave` | EMWavePage | 2D, 3D, phasor views |
| `/polarization` | PolarizationPage | Lissajous, Stokes |
| `/magnetic-circuits` | MagneticCircuitsPage | Toroid, reluctance |

---

## Key Directories

- `src/pages/` — One default-exported page component per route
- `src/components/common/` — Shared UI: Slider, ControlPanel, MathWrapper, ConceptCheck, PredictionGate, ChallengeCard, AiTutor
- `src/components/layout/` — Layout shell, Sidebar, ErrorBoundary
- `src/canvas/` — Canvas drawing helpers (arrows, fieldLines, grid)
- `src/hooks/` — useAnimationFrame, useCanvasSetup, useCanvasTouch, useOnlineStatus
- `src/constants/` — Physics colors, module definitions, quiz content, cross-module URLs
- `src/store/` — Zustand stores (progress + theme)

---

## Content Bridges to Other Modules

- **Magnetic Circuits page** → M2 (transformers, mutual inductance)
- **Phasor concepts** → M3 (transmission line phasors)
- **EM waves** → M3 (wave propagation on lines)
