# Architecture Decisions

## ADR-001: React 19 + Vite over CRA/Next.js
**Decision**: Use React 19 with Vite for fast HMR and minimal config.
**Rationale**: This is a client-side SPA with heavy canvas animations. No SSR needed. Vite provides the fastest dev experience for this use case.

## ADR-002: KaTeX over custom parseLatex
**Decision**: Replace the custom `parseLatex()` function with KaTeX library.
**Rationale**: The custom parser only handled ~20 LaTeX symbols and basic fractions/subscripts. KaTeX handles the full LaTeX math spec with proper rendering, accessibility, and error handling.

## ADR-003: lucide-react over custom SVG Icon component
**Decision**: Replace the custom `Icon` component (18 inline SVGs) with lucide-react.
**Rationale**: The original app already mapped to lucide icon names (Activity, BookOpen, Zap, etc.). Direct drop-in replacement eliminates ~50 lines of SVG code and provides 1000+ additional icons.

## ADR-004: Zustand over React Context
**Decision**: Use Zustand for global state (progress tracking, dark mode, sidebar).
**Rationale**: Simpler API than Context + useReducer, built-in localStorage persistence via middleware, no provider wrapping needed. Blueprint spec.

## ADR-005: react-router-dom over tab state
**Decision**: Use URL-based routing instead of a `useState` tab switcher.
**Rationale**: Proper URLs enable bookmarking, browser back/forward, lazy loading per route, and align with the blueprint's ModuleNavigation pattern.

## ADR-006: Tailwind CSS v4 with @theme tokens
**Decision**: Use Tailwind v4's new `@theme` directive for custom color tokens.
**Rationale**: Physics domain colors (E_FIELD red, B_FIELD blue, CURRENT orange, POWER purple) and engineering-blue brand color are defined as theme tokens, making them available as utility classes throughout the app.

## ADR-007: Client-side Gemini API for AI Tutor
**Decision**: Call Gemini API directly from the browser with a user-provided API key.
**Rationale**: No backend server needed. API key is stored in localStorage only. Students can get free API keys from AI Studio. This keeps the app fully static/deployable as a PWA.

## ADR-008: Canvas rendering preserved as-is
**Decision**: Keep all canvas drawing logic from the original app, converted to TypeScript but functionally identical.
**Rationale**: The physics simulations are the core value of the app. Rewriting them risks introducing errors. The canvas code works correctly and performs well.

## ADR-009: Boris integrator for Lorentz force simulation
**Decision**: Replace forward Euler with Boris (leapfrog) integrator for charged particle trajectories.
**Rationale**: Forward Euler is non-symplectic — particles spiral outward (gain energy) in B-only fields. Boris exactly conserves energy for magnetic-only fields, giving physically correct circular orbits.
**Date**: 2026-03-04

## ADR-010: Axial dipole flux model for Lenz's Law
**Decision**: Replace empirical Gaussian proximity `exp(-d²/200)` with physics-based axial dipole flux: Φ ∝ a²/(a²+d²)^(3/2).
**Rationale**: The Gaussian had no physical basis. The dipole model correctly captures how flux varies with magnet-coil distance and produces EMF via chain rule (dΦ/dt = dΦ/dd · dd/dt).
**Date**: 2026-03-04

## ADR-011: Tabbed ModuleLayout for all module pages
**Decision**: Create a shared `ModuleLayout` component with 3 tabs: Simulation | Theory | Practice.
**Rationale**: All 9 module pages were showing everything at once (canvas, controls, equations, theory, quizzes) — overwhelming for students. Tabs organize content into a natural learning flow: explore → understand → verify. Each page provides `simulation` and `theory` as props; `Practice` tab auto-loads from `moduleId`. Uses existing ARIA-compliant `Tabs` component.
**Date**: 2026-03-04

## ADR-012: CSS @import order fix
**Decision**: Move all `@import` statements before `@theme` in `index.css`.
**Rationale**: CSS spec requires `@import` to precede all other statements (except `@charset`). Having `@import "katex/..."` after `@theme` caused PostCSS warnings and could produce broken CSS chunks in production builds.
**Date**: 2026-03-04

## ADR-013: PWA service worker stale cache mitigation
**Decision**: Add `skipWaiting`, `clientsClaim`, `cleanupOutdatedCaches` to VitePWA config + `lazyRetry` wrapper for dynamic imports.
**Rationale**: After deploys with new chunk hashes, users with cached old `index.html` got "Failed to fetch dynamically imported module" errors. `skipWaiting` forces immediate SW activation; `lazyRetry` auto-reloads the page once if a chunk fails to load.
**Date**: 2026-03-04
