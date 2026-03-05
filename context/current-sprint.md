# Current Sprint: Phase 2 — Pedagogy & New Content

## Status: Complete

### Completed (Phase 2 — this sprint)
- [x] Task 1: Rewrote AI Tutor → "Think it Through" Socratic tutor (never gives direct answers, counter-questions only)
- [x] Task 2: Added RealWorldHook cards (2-3 sentence real-world context) at top of all 9 module pages
- [x] Task 3: Created PredictionGate component — hides simulation behind one-shot prediction; applied to Lorentz, Faraday, Lenz
- [x] Task 4: Extended ConceptCheck with 3-tier progressive hints (Conceptual → Procedural → Worked Example) after wrong answers
- [x] Task 5: Added "Phasor Sync" view mode to EMWavePage — dual synchronized canvases (time-domain + rotating phasor)
- [x] Task 6: Created entire Magnetic Circuits page — toroid simulation, reluctance, mutual inductance, bridge to Module 2
- [x] Deep review: Fixed double time increment in Phasor Sync, corrected H_core/H_gap calculation, fixed Module 2 bridge link
- [x] Updated em_compreenssive_viewer.html with all new features

### Completed (Phase 1 — canvas interaction improvements)
- [x] Draggable phasors, hover tooltips, touch support, keyboard nudge across all canvas pages
- [x] 9 interaction enhancements to physics simulations

### Completed (prior sprints — physics rigor + UX)
- [x] Deep analysis: 11 shortcomings identified against app goals
- [x] S0: Fixed KaTeX dark mode visibility, EquationBox label truncation, EMWave B₀ formula, Faraday/Lenz live equation feedback
- [x] S1: Integrated all 27 quiz questions + 9 challenges into pages via ModuleAssessment component
- [x] S2: Added physical units (μC, N, mN, mT, μT) to all simulations
- [x] S3: Connected ε₀, μ₀, k constants to canvas computations
- [x] S4: Fixed Ampere B-field ring spacing (1/r decay), Coulomb force arrow log-scale
- [x] S5: Replaced Lorentz forward Euler with Boris integrator (energy-conserving)
- [x] S6: Replaced Lenz empirical Gaussian with axial dipole flux model
- [x] S7: Added pedagogical bridge for AC V-I phasors in EM Waves
- [x] S8: Added energy density bar + Poynting vector visualization
- [x] S9: Added ψ, χ, axial ratio, Stokes parameters to Polarization
- [x] S10: Fixed Faraday current arrow speed ∝ |EMF|
- [x] Fixed CSS @import order (must precede @theme per CSS spec)
- [x] Added PWA service worker skipWaiting + clientsClaim + cleanupOutdatedCaches
- [x] Added lazyRetry wrapper for chunk load failure recovery
- [x] Created ModuleLayout component with 3-tab structure (Simulation | Theory | Practice)
- [x] Refactored all 9 module pages to use ModuleLayout

### Previously Completed (initial scaffold)
- [x] Scaffold Vite + React 19 + TypeScript project
- [x] Install all dependencies (Tailwind v4, Zustand, KaTeX, lucide-react, etc.)
- [x] Create shared component library (15+ components)
- [x] Create Layout + Sidebar with dark mode and responsive design
- [x] Migrate all 10 physics module pages with full canvas interactivity
- [x] Set up react-router-dom with lazy-loaded routes
- [x] Implement AI Tutor with Google Gemini integration
- [x] Create quiz content (27 questions + 9 challenges)

### Upcoming / Not Yet Done
- [ ] Add smoke tests for shared components
- [ ] Add render tests for each page
- [ ] Production deployment verification (post-Vercel deploy)
- [ ] Generate PWA icons (pwa-192x192.png, pwa-512x512.png)
- [ ] Consider using recharts for field strength vs distance graphs
- [ ] Add 3-tier hints to remaining module quiz questions (only Maxwell Q1 and Magnetic Circuits have them so far)

## New Components (Phase 2)
- `RealWorldHook` — amber card with lightbulb icon, shows real-world engineering context
- `PredictionGate` — commit-then-reveal pattern, one-shot prediction before simulation access
- `MagneticCircuitsPage` — toroid simulation with adjustable core material, turns, current, air gap

## Store Extensions
- `predictions` — tracks PredictionGate choices (gateId → {correct, chosenLabel})
- `hintUsage` — tracks highest hint tier revealed per question (key → tier 1-3)

## Test Status
- 60/60 tests passing
- Build: clean (no TypeScript or lint errors)

## Branch
- Working branch: `claude/review-codebase-ksI6g`
- All changes committed and pushed
