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

## ADR-014: Socratic "Think it Through" tutor over direct-answer AI
**Decision**: Rewrite the AI Tutor system prompt to enforce Socratic method; rename "AI Tutor" → "Think it Through" throughout the app.
**Rationale**: An AI that simply answers physics questions undermines the learning process. The Socratic approach forces students to think: the tutor responds with counter-questions, acknowledges correct reasoning, and only gives small conceptual hints when stuck. The "Think it Through" name reinforces this philosophy and sets student expectations correctly.
**Date**: 2026-03-05

## ADR-015: PredictionGate commit-then-reveal pattern
**Decision**: Create a `PredictionGate` component that hides the simulation behind a one-shot prediction question. Applied to Lorentz, Faraday, and Lenz pages.
**Rationale**: Research on active learning shows that making predictions before observing outcomes significantly improves conceptual understanding. The gate forces a cognitive commitment — students must think about what will happen before they can explore. Predictions are stored in Zustand (one-shot, non-retractable) so students see their original prediction alongside the simulation. Applied only to pages where the outcome is non-obvious.
**Date**: 2026-03-05

## ADR-016: Three-tier progressive hints in ConceptCheck
**Decision**: Extend ConceptCheck with optional 3-tier hints revealed sequentially after wrong answers: Tier 1 (Conceptual nudge) → Tier 2 (Procedural guidance) → Tier 3 (Worked example).
**Rationale**: Immediate full solutions discourage effort. Tiered hints scaffold learning: a conceptual nudge may be enough for strong students, while struggling students can progressively access more specific help. Hint usage is tracked in Zustand (`hintUsage` map) to persist across sessions and potentially inform future analytics. Only revealed after at least one wrong attempt to reward initial effort.
**Date**: 2026-03-05

## ADR-017: RealWorldHook cards for engineering context
**Decision**: Add a `RealWorldHook` component (amber lightbulb card) at the top of every module page with 2-3 sentences connecting the physics to real engineering applications.
**Rationale**: Students often ask "why does this matter?" Showing immediate practical relevance (MRI machines, power grids, wireless charging, etc.) before the simulation motivates engagement. The amber styling differentiates it from theory content (blue) and quizzes (slate).
**Date**: 2026-03-05

## ADR-018: Phasor Sync dual-canvas view mode
**Decision**: Add a "Phasor Sync" view mode to EMWavePage with two synchronized canvases: a time-domain sinusoid and a rotating phasor diagram sharing the same animation clock.
**Rationale**: Students struggle to connect phasor rotation to sinusoidal waveforms. The synchronized dual view makes this relationship explicit: the phasor angle maps to the sinusoid's phase, and the projection line connects the phasor tip to the current value on the time plot. A "now" marker on the sinusoid moves in sync with the phasor rotation.
**Date**: 2026-03-05

## ADR-019: Magnetic Circuits capstone module
**Decision**: Create a new Magnetic Circuits page with a toroid simulation (adjustable core material, turns, current, air gap), full theory section, and bridge to Module 2.
**Rationale**: Magnetic circuits bridge the gap between electromagnetic field theory (Module 1) and AC machines (Module 2). The toroid is the canonical example: students can explore how material permeability, air gaps, and coil parameters affect flux, reluctance, and inductance. The page computes H_core and H_gap separately (physically correct for composite circuits) and includes mutual inductance theory with transformer ratios to motivate the next module.
**Date**: 2026-03-05

## ADR-020: Separate H_core and H_gap in magnetic circuit display
**Decision**: Display H_core = B/(μ₀μᵣ) and H_gap = B/μ₀ separately rather than a single averaged H = MMF/l.
**Rationale**: In a composite magnetic circuit, H differs by section. An averaged H misleads students into thinking the field is uniform. Showing both values — where H_gap ≫ H_core for ferromagnetic materials — teaches the key insight that air gaps dominate the magnetic field intensity even when they're a small fraction of the path.
**Date**: 2026-03-05
