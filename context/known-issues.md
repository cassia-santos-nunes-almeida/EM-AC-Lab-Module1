# Known Issues & Tech Debt

## Issues

### Canvas Not Responsive on Window Resize
- **Severity**: Low
- **Description**: Canvas elements resize on initial render but don't auto-resize on window resize events. A ResizeObserver could be added to each canvas module.
- **Workaround**: Navigating away and back re-renders at correct size.

### AI Tutor API Key Storage
- **Severity**: Low
- **Description**: Gemini API key is stored in localStorage in plain text. Adequate for a local educational tool but not production-grade.
- **Mitigation**: Key never leaves the browser. Users are informed it's stored locally.

### KaTeX Font Warnings at Build Time
- **Severity**: Low
- **Description**: Vite reports "fonts/KaTeX_*.woff2 didn't resolve at build time, will remain unchanged to be resolved at runtime" for all KaTeX font files. Fonts still work at runtime.
- **Root cause**: KaTeX CSS references relative font paths that Vite can't resolve during bundling.

### Partial 3-Tier Hint Coverage
- **Severity**: Low
- **Description**: Only Maxwell Q1 and Magnetic Circuits questions have 3-tier hints. The remaining 24+ quiz questions only have the standard explanation on correct answer.
- **Plan**: Progressively add hint tiers to all questions in future sprints.

## Tech Debt

### Test Coverage
- 60 tests passing (shared components + page render tests).
- Could expand: integration tests for PredictionGate flow, ConceptCheck hint progression, Phasor Sync animation.

### recharts Not Yet Used
- recharts is installed but no charts are currently rendered. Could be used for:
  - Frequency response plots
  - Field strength vs distance graphs
  - Power factor visualization

### PWA Icons
- PWA manifest references `pwa-192x192.png` and `pwa-512x512.png` but these don't exist in `/public/`.
- Need to generate app icons.

### Pre-existing Lint Warnings
- **Files affected**:
  - `MaxwellPage.tsx:85` — `_t` is defined but never used
  - `EMWavePage.tsx` — Missing `isDarkMode` in useCallback dependency array
  - `LorentzPage.tsx:47` — Missing `handleReset` in useEffect dependency array
- **Note**: Pre-existing from earlier sprints, not introduced by Phase 2 or audit work.

### Iron Permeability Linearization
- **Severity**: Low (documented)
- **Description**: μᵣ = 5000 for iron is a linearized value. Real iron is nonlinear (μᵣ ~ 100–10,000). A note is shown in the MagneticCircuitsPage UI.

### Fringing Effects Ignored
- **Severity**: Low (documented)
- **Description**: Air gap simulation assumes no fringing at the gap boundary. A note explains this in the UI.

## Resolved Issues

### ~~Double Time Increment in Phasor Sync~~ ✅ (2026-03-05)
- Both the main animation loop and the Phasor Sync loop were incrementing `timeRef.current`, causing 2x speed. Fixed by guarding main loop with `if (viewMode === VIEW_PHASOR_SYNC) return;`.

### ~~Averaged H in Magnetic Circuits~~ ✅ (2026-03-05)
- Was computing single H = MMF/l which is wrong for composite circuits. Fixed to show H_core = B/(μ₀μᵣ) and H_gap = B/μ₀ separately.

### ~~Misleading Module 2 Link~~ ✅ (2026-03-05)
- Button said "Continue to Module 2" but linked to `/` (Overview). Fixed to link to actual Module 2 at `https://em-ac-lab-module.vercel.app/`.

### ~~ConceptCheck/ChallengeCard Not Rendered~~ ✅
- Fixed: Created `ModuleAssessment` wrapper, integrated into all 9 pages via `ModuleLayout`.

### ~~No Physical Units in Simulations~~ ✅
- Fixed: Added μC, N, mN, mT, μT labels and scale references to all canvas simulations.

### ~~Lorentz Orbit Energy Drift~~ ✅
- Fixed: Replaced forward Euler with Boris integrator.

### ~~Lenz Empirical Flux Model~~ ✅
- Fixed: Replaced with axial dipole flux Φ ∝ a²/(a²+d²)^(3/2).

### ~~Stale Service Worker Cache Breaking Navigation~~ ✅
- Fixed: Added skipWaiting + clientsClaim + lazyRetry auto-reload.

### ~~CSS @import Order Warnings~~ ✅
- Fixed: Moved @import before @theme in index.css.

### ~~Everything Shown at Once on Module Pages~~ ✅
- Fixed: Created tabbed ModuleLayout (Simulation | Theory | Practice).
