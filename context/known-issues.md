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

### Pre-existing Lint Warnings (3 errors, 2 warnings)
- **Severity**: Low
- **Files affected**:
  - `MaxwellPage.tsx:85` — `_t` is defined but never used (`@typescript-eslint/no-unused-vars`)
  - `EMWavePage.tsx:536` — Missing `isDarkMode` in useCallback dependency array
  - `EMWavePage.tsx` — Could not preserve existing manual memoization warning
  - `LorentzPage.tsx:47` — Missing `handleReset` in useEffect dependency array
- **Note**: These are all pre-existing, not introduced by the tab refactoring.

### KaTeX Font Warnings at Build Time
- **Severity**: Low
- **Description**: Vite reports "fonts/KaTeX_*.woff2 didn't resolve at build time, will remain unchanged to be resolved at runtime" for all KaTeX font files. Fonts still work at runtime.
- **Root cause**: KaTeX CSS references relative font paths that Vite can't resolve during bundling.

## Tech Debt

### Test Coverage
- No tests written yet. Vitest + testing-library are installed and configured.
- Priority: Add smoke tests for shared components, then page render tests.

### recharts Not Yet Used
- recharts is installed but no charts are currently rendered. Could be used for:
  - Frequency response plots
  - Field strength vs distance graphs
  - Power factor visualization

### PWA Icons
- PWA manifest references `pwa-192x192.png` and `pwa-512x512.png` but these don't exist in `/public/`.
- Need to generate app icons.

## Resolved Issues (this sprint)

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
