# EM&AC Lab Suite — Full Audit Report

**Date:** 2026-03-15
**Scope:** Module 1 (EM Fundamentals), Module 2 (Circuit Analysis), Module 3 (Mutual Inductance, Transmission Lines & Antennas)
**Auditor:** Claude (Opus 4.6)
**Status:** Report only — no code modifications

---

## Section 1 — Learning Outcome Coverage Map

### Coverage Matrix

| LO | Description | M1 | M2 | M3 | Coverage | Cognitive Level |
|----|-------------|----|----|----|---------|----|
| **LO1** — EM radiation mechanisms & wave behavior | EM wave page (simulation, 2D/3D views, refractive index slider), Polarization page (Jones vectors, Lissajous figures) | — | — | **Complete** | Application (simulation) + Recall (theory) |
| **LO2** — Ampere's, Faraday's, Lenz's laws & Lorentz force | Ampere page (B-field sim, right-hand rule), Faraday page (induction anim), Lenz page (repulsion/attraction sim), Lorentz page (cyclotron sim) | — | — | **Complete** | Application (interactive sims) + Analysis (prediction gates) |
| **LO3** — Antenna functions & applications | — | — | Antennas section (radiation pattern sim, directivity calc, near/far field, practical antenna cards) | **Complete** | Application (sim) + Recall (cards) |
| **LO4** — Transmission lines & distributed parameters | — | — | LumpedDistributed (ladder anim, telegrapher's eqs), TransmissionLines (Z0, Gamma, VSWR sim, standing wave quiz) | **Complete** | Analysis (derivation sketch + inverse problem quiz) |
| **LO5** — DC circuit inductance & mutual inductance | MagneticCircuits page (toroid sim, L = N^2/R, air gap) | — | Transformers (coupling coeff, dot convention, coupled coils sim) | **Complete** | Application (both sims) + Analysis (worked examples) |
| **LO6** — EMF induction & forces on conductors | Faraday page (EMF = -NdPhi/dt), Lorentz page (F = qv x B) | — | — | **Complete** | Application (sims with live readouts) |
| **LO7** — Magnetic flux, field strength, flux density in magnetic circuits | MagneticCircuits page (B, H, Phi, reluctance, Hopkinson's law, interactive toroid) | — | — | **Complete** | Application (parameter exploration) + Analysis (air gap sensitivity) |
| **LO8** — Apply theory to resolve basic EM problems & evaluate plausibility | Challenges and quizzes across all M1 pages, PredictionGates | ConceptChecks, ChallengeCards | PredictionGates, YourTurnPanels, ConceptChecks | **Complete** | Analysis (prediction-before-reveal pedagogy) |
| **LO9** — Systematic circuit analysis methods | — | TimeDomain page (Heaviside vs identification method comparison), InteractiveLab (RC/RL/RLC solver) | — | **Partial** | Application (simulation). Gap: Heaviside method shown but not deeply interactive; identification method mentioned but not practiced. |
| **LO10** — Transmission network analysis methods | — | — | TransmissionLines (Gamma, VSWR, bounce diagram), Transients (step response, worked examples) | **Complete** | Analysis (bounce diagram builder + inverse problem) |
| **LO11** — Transient phenomena in electrical circuits | — | InteractiveLab (step + impulse response for RC/RL/RLC, damping classification) | Transients on TL (bounce diagram) | **Complete** | Application (real-time sim) + Analysis (prediction gates) |
| **LO12** — Voltage/current changes after step inputs | — | InteractiveLab (step response viz, time constant markers), CircuitEquations panel | Transients (step response on TL, steady-state derivation) | **Complete** | Application (interactive sliders + charts) |

### Summary

- **11 of 12 LOs** are covered at Complete level
- **LO9** (systematic circuit analysis) is Partial — the Heaviside method comparison table exists but lacks an interactive "solve this circuit step-by-step" exercise; node/mesh analysis methods are not explicitly covered

### Strengths
- Excellent cross-module coverage with minimal gaps
- Most LOs are addressed at Application or Analysis level, not just Recall
- PredictionGates enforce active learning before revealing simulations

### Gaps
- LO9: No interactive node-voltage or mesh-current analysis exercise
- No explicit Kirchhoff's law practice module (KVL/KCL as standalone topic) in M2 — it's assumed knowledge from prerequisites

### Recommendations
- **P2**: Add an interactive systematic circuit analysis exercise to M2 (step-by-step KVL/KCL with guided feedback) to fully cover LO9
- **P3**: Consider a "prerequisite check" quiz at M2 entry to verify KVL/KCL fluency

---

## Section 2 — Physics and Mathematics Accuracy

### Module 1 — EM Fundamentals

**Maxwell's Equations (MaxwellPage.tsx)**
- Gauss's Law (E): `\oint \vec{E} \cdot d\vec{A} = \frac{Q_{enc}}{\epsilon_0}` — Correct (integral form, Ulaby Ch. 4)
- Gauss's Law (B): `\oint \vec{B} \cdot d\vec{A} = 0` — Correct
- Faraday's Law: `\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}` — Correct (single-turn form; N-turn form used correctly on FaradayPage)
- Ampere-Maxwell: `\oint \vec{B} \cdot d\vec{l} = \mu_0(I_{enc} + \epsilon_0 \frac{d\Phi_E}{dt})` — Correct

**Quiz Content Verification (quizContent.ts)**
- Maxwell Q3 ("How many of Maxwell's equations involve magnetic fields?"): Answer = 4 (all four). **🟡 Warning**: The explanation claims Gauss's law for electricity "couples to B through the full set via the displacement-current link" — while technically true at the system level, the equation `\oint E \cdot dA = Q/epsilon_0` does not explicitly contain B. A student could reasonably argue "3" (Gauss B, Faraday, Ampere-Maxwell). The intended answer is defensible but the question is ambiguous.
- Lorentz Q3: Cross product `x hat x z hat = -y hat` for negative charge giving +y direction — Correct (F = q(v x B), with q < 0)
- Faraday Q1: EMF = 100 * (0.05/0.1) = 50V — Correct
- Coulomb Q2: Three charges at equilateral triangle vertices, net force radially outward — Correct
- Ampere Q1: B = mu_0*I/(2*pi*r) — Correct (Ulaby Eq. 5.30)
- All Lenz's law questions correctly apply the opposition principle

**Magnetic Circuits (MagneticCircuitsPage.tsx)**
- `MU_0 = 4 * Math.PI * 1e-7` — Correct
- Reluctance: `R_core = l_core / (mu_0 * mu_r * A)` — Correct
- Inductance: `L = N^2 / R_total` — Correct
- H_core = B / (mu_0 * mu_r), H_gap = B / mu_0 — Correct (continuity of B across gap assumed, fringing neglected)
- **🔵 Note**: Fringing effect neglected at air gap — acceptable simplification for educational purposes, but worth mentioning to students

**EM Wave and Polarization**
- Jones vector for RCP: `(1/sqrt(2))[1, -i]^T` — Correct (optics convention, observer facing incoming wave)
- Speed of light in medium: v = c/n — Correct

### Module 2 — Circuit Analysis

**Circuit Solver (circuitSolver.ts)**
- RC step response: `v(t) = Vs(1 - e^{-t/tau})`, `i(t) = (Vs/R) * e^{-t/tau}` with tau = RC — Correct (Nilsson & Riedel Ch. 7)
- RL step response: `v(t) = Vs * e^{-t/tau}`, `i(t) = (Vs/R)(1 - e^{-t/tau})` with tau = L/R — Correct
- RLC underdamped step: `v(t) = Vs(1 - e^{-alpha*t}(cos(omegaD*t) + (alpha/omegaD)*sin(omegaD*t)))` — Correct
- RLC critically damped step: `v(t) = Vs(1 - e^{-alpha*t}(1 + alpha*t))` — Correct
- RLC overdamped step: Uses natural modes with correct coefficients A1 = Vs*s2/(s2-s1), A2 = -Vs*s1/(s2-s1) — **Verified correct** (these ensure v(0)=0 and v(inf)=Vs)
- alpha = R/(2L), omega0 = 1/sqrt(LC), zeta = alpha/omega0 — Correct
- Impulse responses correctly derived as omega0^2 * (time-domain impulse response of second-order system)
- **🔴 Critical**: In `calculateRCImpulseResponse`, `iScale = -(Vs / (R * R * C))`. For an RC circuit with impulse voltage input, the impulse response of capacitor voltage is `h_v(t) = (1/RC)e^{-t/RC}` and current is `h_i(t) = C * dh_v/dt = -(1/(R*C^2)) * ... ` — wait, let me re-derive. For unit impulse `delta(t)` scaled by Vs: `v_C(t) = (Vs/RC) e^{-t/RC}` and `i(t) = C dv_C/dt = -(Vs/(R^2*C)) e^{-t/RC}`. The code has `iScale = -(Vs / (R * R * C))` — **actually correct**.
- Transfer function: H(s) = omega0^2 / (s^2 + 2*alpha*s + omega0^2) — Correct for V_C/V_s of series RLC

**Laplace Transform Tables (componentMath.ts)**
- All 10 transform pairs verified correct against standard tables (Nilsson & Riedel Appendix)
- All 8 properties correct including initial/final value theorems
- **🔵 Note**: Final value theorem shown without the caveat that it requires all poles of sF(s) to have negative real parts — could mislead students applying it to unstable systems

**Component Formulas (componentMath.ts)**
- R = rho * L / A — Correct
- C = epsilon * A / d — Correct (parallel-plate)
- L = mu * N^2 * A / l — Correct (solenoid)
- Z_C = 1/(j*omega*C), Z_L = j*omega*L — Correct

**Material Properties**
- Copper resistivity: 1.68e-8 Ohm*m — Correct
- Iron permeability: 6.3e-3 H/m — **🟡 Warning**: This implies mu_r ~= 5000 for iron, which is reasonable for soft iron but varies widely (100-10000). The value is not wrong but could create misconceptions about iron's permeability being a single number. Consider adding a note about B-H curve nonlinearity.

**SDomainAnalysis.tsx**
- Damping ratio formula shown as zeta = (R/2)*sqrt(C/L) — **🟡 Warning**: This is equivalent to R/(2*sqrt(L/C)) which equals alpha/omega0, so it's correct, but the presentation `(R/2)*sqrt(C/L)` is less standard than `R/(2)*sqrt(C/L)` as shown in Nilsson & Riedel. Actually both are algebraically identical: R/(2*sqrt(L/C)) = R*sqrt(C)/(2*sqrt(L)) = (R/2)*sqrt(C/L). Fine.

### Module 3 — Transmission Lines & Antennas

**Transmission Math (transmissionMath.ts)**
- M = k * sqrt(L1 * L2) — Correct (Neumann formula simplified)
- V2 = V1 * (N2/N1) — Correct (ideal transformer)
- I2 = I1 * (N1/N2) — Correct
- Z_reflected = (N1/N2)^2 * ZL — Correct
- Z0 = sqrt(L'/C') — Correct (lossless line, Ulaby Ch. 2)
- Gamma = (ZL - Z0) / (ZL + Z0) — Correct
- VSWR = (1 + |Gamma|) / (1 - |Gamma|) — Correct
- v = 1/sqrt(L'*C') — Correct
- **Open circuit handling**: Gamma = 1 for ZL = Infinity — Correct

**Bounce Diagram (calculateBounceVoltages)**
- Initial voltage V0 = Vs * Z0 / (Zs + Z0) — Correct
- Load voltage accumulation: vLoadAccum += currentAmplitude * (1 + gammaLoad) — Correct (total voltage = incident + reflected)
- Source voltage accumulation: vSourceAccum += currentAmplitude * (1 + gammaSource) — Correct
- Alternating load/source reflections — Correct
- Steady-state formula: Vss = Vs * ZL / (Zs + ZL) — Correct (DC voltage divider)

**Telegrapher's Equations (LumpedDistributed.tsx)**
- dV/dx = -L' * dI/dt (from KVL) — Correct
- dI/dx = -C' * dV/dt (from KCL) — Correct
- Wave equation: d^2V/dx^2 = L'C' * d^2V/dt^2 — Correct
- General solution with forward/backward waves — Correct

**Lossy Line (TransmissionLines.tsx)**
- Z0 = sqrt((R' + jwL')/(G' + jwC')) — Correct (Ulaby Eq. 2.22)

**Radiation Pattern (calculateRadiationPattern)**
- Pattern formula: |cos(kL*cos(theta)) - cos(kL)| / sin(theta) where kL = pi * dipoleLengthFraction — Correct for a center-fed thin dipole
- Directivity via numerical integration — Correct approach
- Radiation resistance via 60 * integral — **🔵 Note**: The factor 60 comes from the impedance of free space (120*pi) divided by 2*pi (integration over phi), yielding ~60. This is correct.
- Half-wave dipole R_rad ~ 73 ohms — Correct (standard textbook value)
- HPBW calculation by finding 3dB angles — Correct methodology

**Fraunhofer Distance**
- r_far = 2D^2 / lambda — Correct (standard far-field boundary)

**CoupledCoilsSim.tsx**
- **🟡 Warning**: The simulation computes V2 using `calculateSecondaryVoltage(VS, N1, N2)` which is the ideal transformer ratio V1*N2/N1, regardless of the k value. The note at the bottom says "V2, I2, and Z_ref assume ideal coupling (k = 1)" but this could confuse students who set k = 0.1 and still see full secondary voltage. The field-line animation correctly weakens with k, creating a visual/numerical contradiction.

### Error Summary

| Severity | Count | Details |
|----------|-------|---------|
| 🔴 Critical | 0 | No wrong results found |
| 🟡 Warning | 3 | Maxwell Q3 ambiguity; Iron permeability note; CoupledCoilsSim k-independence of V2 |
| 🔵 Note | 3 | Fringing neglected; Final value theorem caveat; Radiation resistance factor 60 |

---

## Section 3 — Pedagogical Quality

### Module 1 — EM Fundamentals

**Strengths**
- **Intuition before formalism**: RealWorldHook components open each page with a real-world scenario before any equation appears (e.g., "The 2003 Northeast blackout..." for Faraday's law)
- **PredictionGates**: Students must predict outcomes before seeing the simulation (e.g., "Which direction does the induced current flow?"), enforcing the predict-observe-explain cycle
- **Progressive disclosure**: Theory panels are separate from simulation panels, reducing cognitive overload
- **Multi-tiered hints**: Quiz questions offer 3 tiers (conceptual -> procedural -> worked step), scaffolding struggling students without giving away answers prematurely
- **Canvas interactions**: Direct manipulation (drag charges in Coulomb, adjust rate via canvas drag in Faraday) builds kinesthetic understanding

**Gaps**
- Maxwell's equations page lacks differential form — only integral form shown. For a 2nd-year course, both forms should be presented
- No explicit connection between Coulomb's law and Gauss's law (the Coulomb page doesn't reference how Gauss's law generalizes it)
- EM wave page mixes wave optics concepts (refractive index) with AC phasors in the same module — potential cognitive overload

**Mental Model Assessment**: Students leave M1 with strong visual mental models (field lines, flux, induction loops). The canvas visualizations are the standout feature.

### Module 2 — Circuit Analysis

**Strengths**
- **SectionHooks** provide historical and practical context (Oliver Heaviside anecdote for Laplace)
- **Interactive Lab** is exceptional — real-time parameter adjustment with live charts, damping classification, time constant markers
- **PredictionGate in InteractiveLab**: Before seeing the RLC step response, students predict the damping type from current parameters. The gate resets when parameters change significantly (bucket quantization)
- **SDomainAnalysis "Read the Plot"** exercises: Students interpret pole-zero plots — this tests analysis-level understanding, not just recall
- **Damped period marker** (purple T_d line) on underdamped response is a thoughtful touch for connecting oscillation frequency to the chart
- **ChallengeCards** in the interactive lab provide guided experimentation tasks

**Gaps**
- Laplace theory section jumps straight to the definition integral without building intuition for why exponential weighting (e^{-st}) is natural
- No "what happens physically when..." questions for component physics (e.g., "what happens to a capacitor's energy storage when you double the plate separation?")
- The TimeDomain comparison between Heaviside and identification methods exists but doesn't let students practice either method

**Mental Model Assessment**: Strong for transient behavior (the interactive lab builds excellent intuition). Weaker for Laplace transforms — students may memorize table entries without understanding the transform conceptually.

### Module 3 — Transmission Lines & Antennas

**Strengths**
- **Outstanding narrative arc**: Transformers -> Lumped-to-Distributed -> Transmission Lines -> Transients -> Antennas. Each section explicitly bridges to the next with "Looking Ahead" callouts
- **Ladder Animation** is pedagogically brilliant — watching discrete LC sections converge to a continuous wave builds the deepest intuition for distributed systems
- **Nested PredictionGates** in TransmissionLines force two predictions before the simulation unlocks
- **"Does this make sense?" callouts** encourage metacognition
- **YourTurnPanels** with worked examples + student practice problems with immediate feedback
- **Module Close section** explicitly connects all three modules into a unified narrative

**Gaps**
- No Smith chart introduction (standard tool for transmission line analysis at this level)
- Neumann formula for mutual inductance is referenced in the task description but not explicitly presented — only the simplified M = k*sqrt(L1*L2) form appears
- The antenna section doesn't cover antenna arrays or phased arrays (admittedly beyond a 6 ECTS intro course)

**Mental Model Assessment**: Excellent. The lumped-to-distributed progression is textbook-quality pedagogy. Students will leave with a clear picture of how circuit analysis becomes wave analysis.

### Quiz Quality Assessment

| Module | Quiz Type | Tests Understanding? | Tests Recall Only? |
|--------|-----------|---------------------|-------------------|
| M1 | Multiple choice (3 per topic) | Yes — most require reasoning (e.g., "what happens if radius doubles?") | 1-2 questions per topic are recall-level |
| M2 | ConceptChecks + Read-the-Plot | Yes — pole interpretation requires analysis | Transform table lookup is recall |
| M3 | PredictionGates + YourTurnPanels | Yes — all require quantitative reasoning | None are pure recall |

### Recommendations
- **P1**: Add differential form of Maxwell's equations to M1 Maxwell page alongside integral form
- **P2**: Add an intuitive "why Laplace?" section to M2 that builds from the concept of exponential weighting before showing the integral definition
- **P3**: Add a Smith chart introduction to M3 TransmissionLines section

---

## Section 4 — Cross-Module Coherence

### Notation Consistency

| Concept | M1 | M2 | M3 | Consistent? |
|---------|----|----|-----|------------|
| Electric field | \vec{E} | — | — | N/A (single module) |
| Magnetic field | \vec{B} | — | — | N/A |
| Impedance | — | Z_C, Z_L | Z_0, Z_L, Z_s | Yes |
| Time constant | — | \tau = RC, \tau = L/R | — | Yes |
| Damping ratio | — | \zeta = \alpha / \omega_0 | — | N/A |
| Coupling coeff | k (MagneticCircuits) | — | k (Transformers) | Yes |
| Inductance | L = N^2/R | L (component) | L', L1, L2, M | Yes |
| Reflection coeff | — | — | \Gamma | N/A |

No conflicting notation found between modules. The shared conventions (KaTeX rendering, symbol choices) are consistent with Ulaby and Nilsson & Riedel.

### Topic Ownership

| Topic | Primary Owner | Also Appears In | Conflict? |
|-------|--------------|----------------|-----------|
| Mutual inductance | M1 (MagneticCircuits theory) + M3 (Transformers sim) | — | No — M1 introduces concept, M3 goes deep. M1 explicitly says "Full circuit treatment covered in Module 3" |
| Inductance (physical) | M1 (MagneticCircuits) | M2 (ComponentPhysics) | **🟡 Potential overlap** — both derive L = mu*N^2*A/l. However M1 focuses on magnetic circuit context while M2 focuses on circuit component context. Acceptable. |
| Transient behavior | M2 (InteractiveLab) | M3 (Transients on TL) | No — different contexts (lumped vs. distributed). M3 explicitly bridges from M2's vocabulary. |

### Gap Topics (Not Clearly Owned)

- **Network theorems** (Thevenin, Norton, superposition): Not explicitly covered in any module. These are standard systematic analysis tools. Could be added to M2.
- **AC steady-state analysis** (phasors applied to circuits): M1 has a phasor view for EM waves, M2 has s-domain, but no dedicated AC circuit phasor section. The gap between "DC transients" (M2) and "wave propagation" (M3) could benefit from an AC phasor bridge.
- **Power factor and reactive power**: Not covered in any module.

### Narrative Flow (M1 -> M2 -> M3)

The intended flow works well:
1. **M1** establishes the physics (fields, forces, induction, waves)
2. **M2** teaches the math tools (circuit analysis, Laplace, s-domain)
3. **M3** combines both (distributed circuits produce waves, antennas radiate)

M1's MagneticCircuitsPage has a bridge callout linking to M2. M3's Module Close section explicitly ties all three together. The flow is logical and well-signposted.

**One issue**: The link from M1 to M2 (`href="https://em-ac-lab-module.vercel.app/"`) is a hardcoded external URL. If the deployment URL changes, this breaks. Similarly, M3's Antennas page links to `/module-2` which may not resolve correctly if the modules are separate deployments.

### UI/UX Consistency

| Pattern | M1 | M2 | M3 |
|---------|----|----|-----|
| **Layout** | Sidebar + main (Layout/Sidebar) | Sidebar + main (Layout/Sidebar) | Sidebar + main (Layout/Sidebar) |
| **Dark mode** | Class-based via Zustand (`isDarkMode`) | Class-based via Zustand (`theme`) | Class-based via Zustand (`theme`) |
| **Math rendering** | `<MathWrapper latex="..." />` | `<MathWrapper formula="..." />` | `<MathWrapper formula="..." />` |
| **Navigation** | ModuleNavigation (prev/next) | ModuleNavigation | ModuleNavigation |
| **AI Tutor** | AiTutor (Gemini) | AiTutor (Gemini) | AiTutor (Gemini) |
| **Progress tracking** | Zustand (`completedModules`, `quizScores`, `predictions`) | Zustand (`theme` only) | Zustand (`sections` with visit/prediction/check tracking) |
| **Color palette** | Custom COLORS/COLORS_DARK constants | Tailwind engineering-blue custom color | Tailwind engineering-blue custom color |
| **Canvas rendering** | Custom hooks (useCanvasSetup, useAnimationFrame) | No canvas (uses Recharts) | Inline canvas with requestAnimationFrame |
| **PWA** | vite-plugin-pwa | vite-plugin-pwa | Unknown |
| **Analytics** | None visible | Vercel Analytics | Vercel Analytics |

**Meaningful Inconsistencies**:
1. **🟡 MathWrapper prop name**: M1 uses `latex` prop, M2/M3 use `formula` prop. This creates confusion for developers working across modules.
2. **🟡 Progress store API**: M1 has rich progress tracking (quiz scores, predictions, hints), M2 has theme-only store, M3 has section-level progress. A student's progress is fragmented across three separate localStorage keys (`em-lab-progress`, `emac-theme`, `emac-m3-progress`).
3. **🟡 Canvas approach**: M1 uses custom hooks (useCanvasSetup, useCanvasTouch), M3 uses inline canvas logic with manual DPR handling. No shared canvas abstraction.

### Recommendations
- **P1**: Unify MathWrapper prop naming to `formula` across all modules (or `latex` — pick one)
- **P2**: Create a shared progress dashboard that aggregates progress across all three modules
- **P2**: Fix hardcoded cross-module URLs — use environment variables or relative paths
- **P3**: Consider adding AC steady-state phasor analysis as a bridge section between M2 and M3

---

## Section 5 — Code Quality and Optimization

### Module 1

**Re-render Concerns**
- `MaxwellPage`: Creates new `useCallback` functions for each draw function on every render when `c` (colors) changes. Since `c` is derived from `isDarkMode`, this is acceptable — color changes are infrequent.
- `FaradayPage`: The `useEffect` dependency array includes `[isPlaying, rate, loops, c, isDarkMode]`. This restarts the animation loop on every parameter change, which is correct but could cause a brief flicker. A `useRef` for parameters accessed in the render loop would be cleaner.
- `MagneticCircuitsPage`: The `useEffect` dependency array is massive — includes computed values like `B`, `hCore`, etc. These are recalculated every render, triggering the effect. **🟡 Should use refs** for values consumed in the canvas draw loop rather than recreating the animation on every state change.

**Canvas Lifecycle**
- All canvas animation loops properly call `cancelAnimationFrame` in cleanup — **Correct**
- `canvasRef.current.width = parent.clientWidth` is set every frame in M1 — causes canvas clear on every frame. This is intentional (clearing canvas) but slightly wasteful since `clearRect` would suffice.

**State Management**
- Zustand store is well-structured with `persist` middleware for localStorage
- `partialize` correctly excludes `sidebarOpen` from persistence — good practice
- `onRehydrateStorage` correctly applies dark mode class on load

**TypeScript**
- `// eslint-disable-next-line @typescript-eslint/no-explicit-any` in App.tsx for `lazyRetry` — acceptable for the dynamic import pattern
- All component props have proper TypeScript interfaces
- No loose `any` types found in physics/math code

**Over-engineering**
- The `lazyRetry` pattern (retry dynamic imports once on failure) is a nice production touch
- Canvas drawing code in each page is ~100-200 lines of imperative drawing — appropriate for the complexity level

### Module 2

**Re-render Concerns**
- `InteractiveLab` uses `useDeferredValue` for slider values — **Excellent practice** for preventing chart re-renders during drag
- `useMemo` used correctly for `response`, `chartData`, `transferFunction`, and `challenges`
- `CircuitEquations` is a plain function component that re-renders on every parent render — could benefit from `React.memo` but the render is lightweight

**Heavy Computations**
- `calculateCircuitResponse` runs synchronously and generates up to ~1000+ data points per call. For the default `timeStep = 0.0001` and `duration = 0.01`, this is ~101 points — fast enough. With auto-duration up to 100ms, this could reach ~1001 points — still acceptable.
- Transfer function pole calculation is O(1) — no concern

**State Management**
- M2 uses Zustand only for theme, not for progress. This means student progress in M2 (which challenges they completed, which quiz answers they got right) is **not persisted**. Refreshing the page loses all progress. **🟡 Gap compared to M1 and M3.**

**TypeScript**
- `circuit.ts` type definitions are clean with a shared `classifyDamping` function
- `CircuitResponse` uses optional fields (`dampingType?`, `alpha?`) — works but could use discriminated unions for stronger typing

**Code Organization**
- InteractiveLab is split into `index.tsx`, `CircuitDiagram.tsx`, `SDomainPanel.tsx`, `challenges.ts` — good separation
- `circuitSolver.ts` is well-commented and uses a unified RLC function to eliminate duplication

### Module 3

**Re-render Concerns**
- `CoupledCoilsSim`: The `render` callback depends on `[k, N1, N2, drawCoil, drawFieldLines]`. When any slider changes, a new render function is created, and the `useEffect` restarts the animation. This is correct but creates a brief interruption. Using refs for state values read in the animation loop would be smoother.
- `TransmissionLineSim`: Same pattern — render callback recreated on slider change

**Canvas Lifecycle**
- Both `CoupledCoilsSim` and `TransmissionLineSim` properly cancel animation frames on cleanup — **Correct**
- Both handle DPR scaling correctly (`window.devicePixelRatio`)
- `ResizeObserver` is set up but the callback body is empty (comment says "render loop handles canvas size on every frame") — the observer is unnecessary overhead since render already resizes. **🔵 Minor waste.**

**State Management**
- M3 has the most sophisticated progress tracking (section visits, prediction gates answered/correct, concept checks, hints used)
- Theme store is separate from progress store (two Zustand stores) — fine architecturally

**TypeScript**
- All types in `transmission.ts` are clean with JSDoc comments
- `transmissionMath.ts` has proper edge-case handling (division by zero, Infinity)

### Cross-Module Code Quality

**State Management Inconsistency**
- M1: Zustand with rich progress (quiz scores, predictions, hints) — key `em-lab-progress`
- M2: Zustand for theme only — key `emac-theme`. No progress persistence.
- M3: Zustand for theme + separate rich progress — keys `emac-theme`, `emac-m3-progress`

This means:
1. A student's M2 progress is lost on refresh
2. M1 and M3 dark mode preferences are stored in different keys and won't sync if a student switches between modules
3. No unified progress view is possible

**Shared Component Duplication**
- `MathWrapper` exists in all three modules with slightly different APIs (M1: `latex` prop; M2/M3: `formula` prop + `block` prop)
- `ConceptCheck` exists in all three with different prop structures
- `CollapsibleSection`, `Tabs`, `ModuleNavigation` — all duplicated

This is the natural consequence of three separate apps. It's not a bug, but it does create maintenance burden.

### Error Summary

| Severity | Issue | Module |
|----------|-------|--------|
| 🟡 Should fix | MagneticCircuitsPage useEffect has too many deps — use refs for canvas values | M1 |
| 🟡 Should fix | M2 has no progress persistence | M2 |
| 🟡 Should fix | Dark mode localStorage keys differ across modules | M1/M2/M3 |
| 🔵 Nice to have | Empty ResizeObserver callbacks in M3 simulations | M3 |
| 🔵 Nice to have | CoupledCoilsSim/TransmissionLineSim could use refs instead of recreating render callbacks | M3 |

### Recommendations
- **P1**: Add progress persistence to M2 (match M1/M3 capability)
- **P2**: Unify dark mode localStorage key across all three modules so switching between apps preserves theme preference
- **P2**: Refactor M1's MagneticCircuitsPage to use refs for canvas-consumed values, reducing unnecessary animation restarts
- **P3**: Extract shared components (MathWrapper, ConceptCheck, etc.) into a shared package if the three modules continue to be maintained together

---

## Section 6 — Senior Developer Recommendations

### Three Highest-Impact Improvements

**1. Unified Progress Dashboard (P1)**
*Impact: Student retention + instructor visibility*

Right now, a student's journey across M1->M2->M3 is fragmented. Progress in M1 doesn't carry over, M2 doesn't persist at all, and M3 tracks independently. Build a lightweight progress aggregation layer (even a simple landing page that reads all three localStorage keys) so students can see: "You've completed 8/10 M1 modules, 3/6 M2 sections, 2/5 M3 sections." This single view would dramatically reduce the feeling of "where was I?" that causes dropout in multi-module courses.

**2. Interactive Systematic Analysis Exercise for M2 (P1)**
*Impact: LO9 coverage + deepest pedagogical gap*

The single biggest gap in the suite is the absence of a guided step-by-step circuit analysis exercise. M2 has excellent *visualization* of circuit responses but no exercise where students *perform* the analysis themselves (write KVL/KCL equations, solve the system, check against simulation). A "solve this circuit" panel where students enter equations and get immediate feedback would transform M2 from "watch the simulation" to "do the analysis."

**3. Fix the CoupledCoilsSim k-independence Issue (P1)**
*Impact: Prevents active misconception*

The fact that V2 in the coupled coils simulation is independent of k (always shows ideal transformer ratio) while the field-line animation weakens with k is the most likely source of student confusion in the entire suite. A student who sets k = 0.1 and sees full secondary voltage will develop an incorrect mental model. Either: (a) scale V2 by k, or (b) show two readouts — "Ideal V2" and "Actual V2 (with k)" — or (c) make the note about k=1 assumption much more prominent (e.g., a yellow warning banner that appears when k < 0.9).

### Most Likely Disengagement Point

**The Laplace Theory section in M2.**

After the interactive, visual, hands-on experience of M1 and the first two M2 sections (ComponentPhysics, TimeDomain), the student hits a wall of mathematical formalism: the Laplace definition integral, transform tables, worked algebraic examples. The SectionHook (Heaviside anecdote) is nice but doesn't bridge the cognitive gap.

**Fix**: Add a "why does this matter?" interactive demo before the Laplace definition. Show a student: "Here's an RLC differential equation. Try to solve it by hand. Hard, right? Now watch: Laplace turns it into algebra." Make them feel the pain of the time-domain approach first, then show the Laplace shortcut as a relief. The current structure presents the solution before the student has felt the problem.

### Architecture Assessment: Is the Three-Module Split Correct?

**Verdict: Yes, with caveats.**

The split maps well to the course structure:
- M1 = EM fundamentals (weeks 2-6)
- M2 = Circuit analysis tools (weeks 7-10)
- M3 = Integration and applications (weeks 11-14)

The separate deployments allow independent development and reduce bundle sizes. The downsides (duplicated components, fragmented progress, inconsistent APIs) are manageable.

**However**, I would restructure the content boundaries slightly:

- **Move MagneticCircuits from M1 to M3** as Section 0 (before Transformers). It's the physical foundation for transformers and feels more natural as the opening of M3's "from devices to distributed systems" narrative. Currently it sits at the end of M1 as a "capstone" topic, but it's really the *beginning* of the M3 story.
- **Add an AC Steady-State section to M2** between TimeDomain and LaplaceTheory. This bridges DC transient analysis to s-domain analysis and fills the gap where AC phasor analysis (impedance, phasors, frequency response) should live.

Neither of these is critical — the current structure works and is well-signposted. These would be improvements for a v2.

---

## Confidence Scores

| Dimension | Score (0-10) | Rationale |
|-----------|-------------|-----------|
| **Physics accuracy** | **9.0** | All core formulas verified correct. No computational errors found in simulation engines. Three warnings (Maxwell Q3 ambiguity, iron permeability note, CoupledCoilsSim k-independence) are minor. No critical errors. |
| **LO coverage** | **8.5** | 11/12 LOs fully covered. LO9 (systematic analysis) is the only partial gap. The depth of coverage for other LOs is impressive — most go beyond recall to application/analysis level. |
| **Pedagogical quality** | **8.5** | Prediction-before-observation pedagogy is excellent. Real-world hooks and progressive disclosure are well-executed. The Laplace theory section is the weakest pedagogically. The M3 narrative arc is outstanding. |
| **Code quality** | **7.5** | Clean TypeScript, proper canvas lifecycle management, good use of React patterns (useMemo, useDeferredValue). Deducted for: M2 missing progress persistence, inconsistent APIs across modules, some unnecessary re-render patterns, duplicated components. |
| **Cross-module coherence** | **7.0** | Good narrative flow with explicit bridges. Deducted for: fragmented progress tracking, inconsistent MathWrapper API, hardcoded cross-module URLs, different localStorage keys for dark mode, duplicated component code. The three-app architecture inherently limits coherence. |

---

*End of audit report.*
