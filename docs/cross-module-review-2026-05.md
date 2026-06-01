# Module 1 (EM Fundamentals) -- Phase 2 Plan

Repo: C:\Users\cassi\Documents\GitHub\EM-AC-Lab-Module1

## Physics correctness

1. PolarizationPage simulation caption -- P2. File: src/pages/PolarizationPage.tsx (handedness at lines 290-291); related quiz src/constants/quizContent.ts (polarization Q3, lines 510-527). Change: add a visible caption on the Polarization simulation panel naming the convention, e.g. "Handedness uses the optics convention (observer faces the incoming wave; delta=+90deg = right-circular). Note: the Ulaby/IEEE antenna convention labels the opposite sense as RHC." No math change; do not flip the label, since that would break internal consistency with the correct optics-convention equations and Jones vector. Finding M1-PHYS-01. Citation: Ulaby 7e Sec 7-2, Eqs 7.56-7.57. Verification: apply-fix (original internally correct; fix is a caption only).

2. EMWavePage energy-density caption (optional) -- P3. File: src/pages/EMWavePage.tsx (energy density at line 1074; B/E relation at line 1071 is correct, no change). Change: optional one-line caption that the displayed energy density is the free-space form (eps0, mu0) and that in a medium it becomes u = (1/2) eps E^2 + B^2/(2 mu). No code or number change; the on-screen bar is normalized and labeled proportional. Finding M1-PHYS-05. Citation: Ulaby 7e Ch 7 (phase velocity, wave impedance) and Ch 6 (energy densities). Verification: keep-original (no physics error); caption is a documentation nice-to-have only.

### Verified correct, no change
- Maxwell quiz Q3 -- now asks how many equations explicitly contain B or Phi_B, answer Three; unambiguous (M1-PHYS-02, Ulaby 7e Ch 6).
- Lorentz force cross product -- x-hat x z-hat = -y-hat used consistently in quiz Q3 and the PredictionGate; Boris integrator conserves speed (M1-PHYS-03, Ulaby 7e Eq 6.42).
- Magnetic circuits -- reluctance series model, L=N^2/R, H continuity across the gap; simplifications now captioned (M1-PHYS-04, Ida 4e Ch 9, Ulaby 7e Eqs 5.93-5.94).
- Maxwell differential form -- point-form equations present and correct (M1-PHYS-06, Ulaby 7e Table 6-1).
- Cross-module URLs -- env-driven via MODULE_URLS (M1-PHYS-07).
- Ampere/Faraday/Lenz field-direction labels -- right-hand-rule consistent; on-axis dipole flux derivative correct (M1-PHYS-08, Ulaby 7e Eq 5.30, Ch 6).

## Consistency alignment

1. MathWrapper implementation -- P2. File: src/components/common/MathWrapper.tsx. Change: migrate from useMemo plus dangerouslySetInnerHTML to the M2/M3 ref-based katex.render. Prop surface (formula/block/className) unchanged, so call sites are untouched.
2. Progress localStorage key -- P2. File: src/store/progressStore.ts. Change: rename key em-lab-progress to emac-m1-progress with a one-time read-and-migrate from the old key.
3. ChallengeCard rename -- P2. File: src/components/common/ChallengeCard.tsx and call sites. Change: rename the guided multi-step component to GuidedChallenge, freeing the ChallengeCard name for the M2 auto-check variant.
4. CollapsibleSection -- P2. File: src/components/common/CollapsibleSection.tsx. Change: replace the simple version with the rich accessible variant (icon, variant, id, useId, aria-controls, role=region) to match M2/M3.
5. Tabs split -- P3. File: src/components/common/Tabs.tsx. Change: keep M1's controlled id-based Tabs as the canonical <Tabs> accessibility baseline (it is the source); coordinate with M2/M3 renaming their content-carrying variant to <TabSet>.
6. Brand accent -- P3. Files: src/components/common/Tabs.tsx, src/components/common/PredictionGate.tsx. Change: retire indigo, switch to engineering-blue.
7. LaTeX double-backslash normalization -- P2. Files: src/pages/MaxwellPage.tsx (243-340), MagneticCircuitsPage.tsx (308-354), FaradayPage.tsx (227, 267), EMWavePage.tsx (946, 1136-1143), GaussPage.tsx (348-353), CoulombPage.tsx (529), PolarizationPage.tsx (427-432). Change: convert single-backslash static JSX formula attributes to double backslashes (P-CODE-11); fix \t, \n, \f, \v tokens first; grep for the \\1 corruption pattern afterward (P-CODE-12).
8. Architecture (CONDITIONAL on owner decision) -- P3 to revisit. If the owner adopts section-based, restructure pages into sections, replace RealWorldHook with SectionHook, replace ModuleAssessment batching with distributed inline ConceptCheck, and port quizContent to inline call sites. Otherwise no change.

## Optimization

1. vite.config.ts base path -- P1. File: vite.config.ts (whole config; manifest icons lines 44-47). Change: add const base = process.env.GITHUB_ACTIONS ? '/EM-AC-Lab-Module1/' : '/', set base, set manifest scope: base and start_url: base, and make icon src paths relative (drop the leading slash on /pwa-icon.svg and /pwa-maskable.svg). M1 is the only config missing base (P-CODE-15).
2. vite.config.ts navigateFallback -- P2. File: vite.config.ts line 21. Change: derive from base, navigateFallback: base + 'index.html', once base is introduced; keep it consistent with P-CODE-15.
3. MagneticCircuitsPage residual rAF restart -- P3. File: src/pages/MagneticCircuitsPage.tsx (isDarkMode at 92, 116-119, 215-218; dep array line 232). Change: fold isDarkMode (and optionally current/turns/gapPercent/materialIndex) into the existing derivedRef so the render loop reads d.isDarkMode, then drop them from the effect deps to make the loop start-once (P-CODE-02). Low priority; theme changes are infrequent.
