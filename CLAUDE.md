# EM&AC Lab — Module 1: Electromagnetic Fundamentals

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

| Skill | Purpose | Location |
|-------|---------|----------|
| context-evaluator | Session lifecycle, context loading, correction capture | `.claude/skill/context_evaluator/SKILL.md` |
| handover | Cross-chat session continuity via Notion | `.claude/skill/handover/SKILL.md` |
| refactor | Safe code refactoring with certainty levels | `.claude/skill/refactor/SKILL.md` |
| frontend-design | Educational app design guidelines | `.claude/skill/frontend-design/SKILL.md` |
| notebooklm-guide | Query textbook notebooks (Ulaby, Nilsson) for physics content | `.claude/skill/notebooklm-guide/SKILL.md` |
| academic-research | Literature search across 12+ databases (Scopus, WoS, ERIC, etc.) | `.claude/skill/academic-research/SKILL.md` |
| stop-slop | Remove AI writing patterns from prose | `.claude/skill/stop-slop/SKILL.md` |
| citation-verification | Verify academic citations and references | `.claude/skill/citation-verification/SKILL.md` |

## Reference

| Topic | File |
|-------|------|
| Architecture, tech stack, constraints, simulations | `.claude/skill/context_evaluator/context.md` |
| Current session state, pending tasks, blockers | `SESSION.md` |
| Accumulated corrections and hard constraints | `PATTERNS.md` |
| All design decisions with rationale | `.claude/skill/context_evaluator/decisions-log.md` |
| Communication and coding preferences | `.claude/skill/context_evaluator/personal-preferences.md` |
| Cross-project rules (synced from my-claude-skills) | `.claude/skill/context_evaluator/shared-patterns.md` |
| Legacy architecture decisions (full 24 ADRs) | `context/decisions.md` |

## Session Boundary Protocol

At **session end**, run both protocols in order:
1. **context_evaluator** — writes `SESSION.md` + `PATTERNS.md` (local project state)
2. **handover** — saves structured handover to Notion (cross-chat continuity)

At **session start**, context_evaluator loads local files automatically. Use handover **FETCH** only when resuming in a brand-new chat that lacks prior context.

## Task Decomposition

Before starting any non-trivial task, assess scope:
- If a task has 3+ deliverables, 2+ files, or 2+ skills — decompose into subtasks with dependency map before starting.
- Present the subtask list and proposed execution order before starting work.
- Report at each boundary: what was completed, what comes next, any blockers.

## Self-Verification

Before returning any output:
1. **Goal analysis** — State explicit and implicit goals.
2. **Assumption audit** — List inferences not directly stated in input.
3. **Gap identification** — What is missing, ambiguous, or likely to fall short?
4. **End-to-end self-test** — Test against all stated goals. For physics simulations: verify math against textbook, check edge cases, run tests.
5. **Pattern check** — Check `PATTERNS.md`. If output would trigger a known pattern, apply the fix automatically.

## Do Not Modify

- `docs/em_compreenssive_viewer.html` — Original monolithic reference (preserved for comparison)
- `new-app-blueprint.md` — Blueprint template document
