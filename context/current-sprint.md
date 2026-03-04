# Current Sprint: Physics Rigor + UX Improvements

## Status: In Progress

### Completed (this sprint)
- [x] Deep analysis: 11 shortcomings identified against app goals
- [x] S0: Fixed KaTeX dark mode visibility, EquationBox label truncation, EMWave B₀ formula, Faraday/Lenz live equation feedback
- [x] S1: Integrated all 27 quiz questions + 9 challenges into pages via ModuleAssessment component
- [x] S2: Added physical units (μC, N, mN, mT, μT) to all simulations — no more arbitrary pixels
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
- [x] Added lazyRetry wrapper for chunk load failure recovery (stale cache auto-reload)
- [x] Created ModuleLayout component with 3-tab structure (Simulation | Theory | Practice)
- [x] Refactored all 9 module pages to use ModuleLayout

### Previously Completed
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
- [ ] Fix pre-existing lint warnings (unused `_t` in MaxwellPage, missing hook deps in EMWavePage/LorentzPage)

## Branch
- Working branch: `claude/refactor-viewer-modular-8R1YF`
- All changes committed and pushed
