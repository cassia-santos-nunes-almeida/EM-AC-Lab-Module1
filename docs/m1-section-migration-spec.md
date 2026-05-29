# Module 1 — Page → Section Migration Spec (Option A)

Date: 2026-05-29
Status: DRAFT for owner review. No code changes yet.
Decision context: Phase 3b of the cross-module review. The owner chose **Option A** from
`my-claude-skills/style/em-ac-lab-app-conventions.md` ("Open architecture decision"): converge M1
onto M2/M3's section-based architecture, adopting M2's section pedagogy contract as canonical.

This document defines (1) the canonical section contract, (2) the target M1 structure, (3) the
component/store/content API migrations, (4) a page-by-page conversion plan, (5) a sequencing that
keeps the Vitest suite green throughout, and (6) the test changes. It is a plan, not a rewrite.

---

## 0. What "section-based" actually means here

The split is **pedagogy + data model**, not merely route count. M2 has 6 routed sections; M1 has 11
routed pages. Converging does **not** require collapsing M1's 11 topics into 6 — each M1 topic page
becomes one **section** keeping its own route. The substantive changes are the eight contract
differences below. (Grouping topics by track — Electrostatics / Magnetostatics / Induction /
Capstone — is an *optional* later content reorg, explicitly out of scope here to protect the
verified physics content.)

| # | Concern | Page model (M1 today) | Section model (M2 canonical, target) |
|---|---------|-----------------------|--------------------------------------|
| 1 | Topic opener | `RealWorldHook` (amber "real-world" card) | `SectionHook` (slate "Why This Matters" card, optional icon) |
| 2 | Layout shell | `ModuleLayout` with **tabs**: Simulation / Theory / Practice | Linear top-to-bottom flow; `TableOfContents` scroll-spy; `ModuleNavigation` at bottom |
| 3 | Assessment placement | One end-of-page **batched** `ModuleAssessment` (Practice tab) | **Distributed inline** `ConceptCheck`s, 2–3 per logical subsection, in narrative flow |
| 4 | Quiz content location | Centralized `src/constants/quizContent.ts`, keyed by `moduleId` | Inlined `ConceptCheckData` at each call site |
| 5 | `ConceptCheck` API | `{ question: QuizQuestion; onCorrect; hintKey }` | `{ data: ConceptCheckData (discriminated union); onComplete; onHint }` |
| 6 | `PredictionGate` API | `{ gateId; question; options:{label,correct,explanation}[]; children }` (one-shot modal) | `{ question; options:{id,label,visual}[]; getCorrectAnswer; explanation; children; resetKey; allowSkip; onPredict }` |
| 7 | Worked-example primitive | none | `YourTurnPanel` (scenario → MCQ → `correctReveal`) |
| 8 | Progress store | `{ completedModules, quizScores, predictions, hintUsage }`, key `em-lab-progress` | `{ sections: Record<id, {visited, predictionGatesAnswered, predictionGatesCorrect, conceptChecksCompleted, hintsUsed}> }`, key `emac-m1-progress` |

Everything else (canvas sims, `FigureImage`, `EquationBox`, `Slider`, `ControlPanel`,
`getAdjacentModules`, theme store `emac-theme`) is already aligned or unchanged.

---

## 1. Canonical section contract (target component set)

Source of truth: M2's `src/components/common`. The target M1 contract:

### 1.1 `SectionHook`
```ts
interface SectionHookProps { text: string; icon?: ReactNode; className?: string; }
```
Pure presentational ("Why This Matters" slate card). Replaces `RealWorldHook`. No store wiring.

### 1.2 `ConceptCheck` (the crux of the migration)
```ts
interface ConceptCheckProps {
  data: ConceptCheckData;
  className?: string;
  onComplete?: () => void;
  onHint?: (tier: number) => void;   // 1-based tier
}
type ConceptCheckData = MultipleChoiceCheck | PredictRevealCheck;
interface MultipleChoiceCheck {
  mode: 'multiple-choice';
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  hints?: string[];                  // flat, index = tier (nudge / conceptual / near-answer)
}
interface PredictRevealCheck {
  mode: 'predict-reveal';
  question: string;
  answer: string;
  hints?: string[];
}
```
`onComplete()` fires when the correct option is chosen / answer revealed; `onHint(tier)` fires per
hint reveal. The section component passes these through to the store
(`incrementConceptChecks(sectionId)` / `incrementHints(sectionId)`).

> Hint shape change: M1 today uses `{ tier, label, content }[]`. Canonical is a flat `string[]`
> where the array index *is* the tier and the label is supplied by the component (semantic tiers:
> nudge → conceptual → near-answer). Porting hints = drop the per-item `label`, keep `content` text
> in order.

### 1.3 `YourTurnPanel`
```ts
interface YourTurnPanelProps {
  scenario: string; question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  correctReveal: ReactNode;          // e.g. updated equations
  hints?: string[]; className?: string;
}
```
Self-contained (no store wiring in M2). Use where a page currently has a worked example that should
become an active "your turn" practice item.

### 1.4 `PredictionGate`
```ts
interface PredictionGateProps {
  question: string;
  options: { id: string; label: string; visual?: ReactNode }[];
  getCorrectAnswer: () => string;    // returns option id; dynamic, parameter-aware
  explanation: ReactNode;
  children: ReactNode;               // revealed after the gate passes
  resetKey?: string;                 // remounts/clears state when params change
  allowSkip?: boolean;               // default true
  onPredict?: (correct: boolean) => void;
  className?: string;
}
```
Section passes `onPredict` → `markPredictionGate(sectionId, correct)`. The dynamic
`getCorrectAnswer` is a real upgrade for M1's interactive sims (correct answer can depend on current
slider state) versus M1's static `correct` flags.

### 1.5 Supporting layout (align as prerequisites, see §6 of the conventions spec)
- `CollapsibleSection`: adopt M2/M3 rich accessible variant (`icon`, `variant`, `id`, `useId`,
  `aria-controls`, `role=region`). M1's `MaxwellPage` already uses `CollapsibleSection`, so the
  richer variant is a drop-in with the same/expanded prop surface.
- `Tabs`: M1's controlled, id-based `<Tabs>` stays the canonical accessibility baseline; M2/M3 rename
  their content-carrying variant to `<TabSet>`. The section model uses **linear flow**, so most M1
  pages will *drop* the Simulation/Theory/Practice tab usage entirely (that lives in `ModuleLayout`,
  see §2.3), not adopt `TabSet`.
- `MathWrapper`: migrate M1 to the ref-based `katex.render` implementation (prop surface unchanged).
- `TableOfContents`: M1's `{ items, activeId }` contract + M2's smooth `scrollIntoView` is canonical.

---

## 2. Target M1 structure

### 2.1 Directory
Each `src/pages/XyzPage.tsx` becomes a section under `src/sections/<topic>/`:
```
src/sections/
  overview/        index.tsx          (OverviewSection)
  coulomb/         index.tsx          (+ canvas drawer extracted, see §2.2)
  gauss/           index.tsx
  ampere/          index.tsx
  lorentz/         index.tsx
  faraday/         index.tsx
  lenz/            index.tsx
  em-wave/         index.tsx          (multi-view; keep an internal view selector)
  polarization/    index.tsx
  maxwell/         index.tsx
  magnetic-circuits/ index.tsx
```
Larger sections (em-wave, maxwell) follow M2's `index.tsx` + sibling subsection files pattern
(cf. M2 `ComponentPhysics/`, `TimeDomain/`). Section components are named exports
(`export function GaussSection()`), unlike M1's current default-export pages.

### 2.2 Canvas code
Move per-page `drawX`/animation helpers out of the component into `src/canvas/<topic>.ts` (M1 already
has `src/canvas/` for arrows/fieldLines/grid). This is optional for correctness but strongly
recommended so the section file reads as narrative + sim mount, matching M2's slimmer sections.
**Do not change drawing math** — pure relocation, verify pixel output unchanged.

### 2.3 Routing & layout shell
- `App.tsx` keeps `lazyRetry` + per-route `<ErrorBoundary>` + `<Suspense>`; swap the lazy imports
  from `@/pages/*` to `@/sections/*`.
- Replace `ModuleLayout` (tabs) with a thin `SectionLayout` that renders, top to bottom:
  `SectionHook` → optional `TableOfContents` → section body (interleaved theory + sim + inline
  `ConceptCheck`s) → `ModuleNavigation`. Mirror M2: each section calls `markVisited(sectionId)` in a
  mount `useEffect`.
- `ModuleNavigation` + `getAdjacentModules(MODULES)` is already the canonical data-driven pattern;
  keep as-is (M2/M3 actually need to adopt *M1's* version per the conventions spec §6).

### 2.4 Section id convention
Reuse the existing `moduleId` strings (`overview`, `coulomb`, `gauss`, `ampere`, `lorentz`,
`faraday`, `lenz`, `em-wave`, `polarization`, `maxwell`, `magnetic-circuits`) as the section ids so
the store, nav, and `MODULES` constant stay in one vocabulary.

---

## 3. Progress store migration

Replace the page-model store in `src/store/progressStore.ts` with the section-model shape:
```ts
interface SectionProgress {
  visited: boolean;
  predictionGatesAnswered: number;
  predictionGatesCorrect: number;
  conceptChecksCompleted: number;
  hintsUsed: number;
}
interface ProgressState {
  sections: Record<string, SectionProgress>;
  markVisited: (id: string) => void;
  markPredictionGate: (id: string, correct: boolean) => void;
  incrementConceptChecks: (id: string) => void;
  incrementHints: (id: string) => void;
}
```
- localStorage key: `em-lab-progress` → **`emac-m1-progress`**.
- **One-time migration**: on store init, if `emac-m1-progress` is absent but `em-lab-progress`
  exists, derive `sections[id].visited = completedModules.includes(id)` (best-effort; the old shape
  has no per-section counters, so counters start at 0) and then ignore the legacy key. Keep the
  separate `emac-theme` theme store and its existing `em-lab-progress.isDarkMode` legacy read
  untouched.
- The sidebar UI flags (`sidebarOpen`/`toggleSidebar`) currently living in the progress store are
  unrelated to progress — relocate them to a small UI store or keep them, but do not persist them in
  the new progress key (M2 does not).
- Completion semantics change: "module complete" is no longer "all quiz indices correct"; adopt M2's
  implicit model (progress = visited + counters). If a visible "complete" badge is still desired in
  the sidebar, derive it (e.g. `visited && conceptChecksCompleted >= expectedChecks[id]`); define
  `expectedChecks` per section from the conversion plan in §5.

---

## 4. Quiz content migration

`src/constants/quizContent.ts` holds `moduleQuizzes` (30 questions, 3/module) and `moduleChallenges`
(10 guided challenges). Under the section model:
- Each `QuizQuestion { question, options[], correctIndex, explanation, hints[] }` becomes an inline
  `MultipleChoiceCheck { mode:'multiple-choice', question, options:[{text,correct,explanation}], hints:string[] }`
  placed at the relevant point in its section (§5 says where). `correctIndex` → per-option `correct`
  flag; `hints:[{tier,label,content}]` → `hints: string[]` (content in tier order).
- `moduleChallenges` (the guided multi-step `Challenge`) maps to M1's guided component. Per the
  conventions spec §5, **rename M1's guided `ChallengeCard` → `GuidedChallenge`** (freeing
  `ChallengeCard` for M2's auto-check variant) and keep these as an optional in-section practice
  block, or convert the simpler ones to `YourTurnPanel`. Guided challenges are not part of the
  section *contract*; keep them as a page-specific extra to avoid scope creep.
- Retire `quizContent.ts` and `ModuleAssessment` only after the last section is converted (§5
  sequencing), so nothing references the centralized data mid-migration.

---

## 5. Page-by-page conversion plan

For each topic: where the `SectionHook` text comes from (reuse the existing `RealWorldHook` copy),
how many inline `ConceptCheck`s (target 2–3 per the cadence rule P-CODE-10; M1 already authored 3
questions/topic in `quizContent.ts`, so distribute those), and notable sim/prediction opportunities.

| Section | Hook source | Inline ConceptChecks (from quizContent) | PredictionGate opportunity | Notes |
|---------|-------------|------------------------------------------|----------------------------|-------|
| overview | existing overview copy | 0 (landing) | — | Module cards + AI disclaimer + license; just SectionHook + nav. |
| coulomb | RealWorldHook text | 3 → after field-line intro / after force-vector demo / after superposition | gate the charge-drag sim on "which way does the force point?" | Extract `drawCoulomb` to `canvas/coulomb.ts`. |
| gauss | RealWorldHook text | 3 → split across Electric vs Magnetic mode toggle (2 E-mode, 1 B-mode) | gate flux question on radius slider (`getCorrectAnswer` reads enclosed charge) | Mode toggle stays as in-section state. |
| ampere | RealWorldHook text | 3 → after RHR animation / after enclosed-current / after solenoid | gate "which way does B circulate?" | — |
| lorentz | RealWorldHook text | 3 → after v×B intro / after cyclotron radius / after E+B drift | gate "which way does the particle curve?" (Boris sim) | Boris integrator unchanged. |
| faraday | RealWorldHook text | 3 → after flux-change intro / after EMF magnitude / after loop-count | gate induced-current direction | — |
| lenz | RealWorldHook text | 3 → after opposition principle / after magnet-coil / after energy | gate "attract or repel as magnet approaches?" | Axial dipole flux model unchanged. |
| em-wave | RealWorldHook text | 3 → distribute across the 2D/3D/VI/Phasor-Sync views | gate phase-difference → power question (VI view, dynamic) | Largest section: use `index.tsx` + subsection files; keep the internal **view selector** (it is genuine sim state, not page tabs). Energy-density caption from review M1-PHYS-05 optional. |
| polarization | RealWorldHook text | 3 → after linear / after circular (handedness) / after Stokes | gate "linear, circular, or elliptical?" from δ slider | Keep the new handedness caption + Jones LaTeX added in Phase 3a. |
| maxwell | RealWorldHook text | 3 → after the 4-card overview / after integral form / after differential form | gate "which equation gains displacement current?" | Already uses `CollapsibleSection` (differential form) — upgrade to rich variant. `MaxwellCard` stays page-local. |
| magnetic-circuits | RealWorldHook text | 3 → after reluctance / after L=N²/ℛ / after mutual inductance | gate series-reluctance question | Keep the "Continue to Module 2" bridge link. |

Cadence: 10 content sections × ~3 = ~30 inline checks, the same 30 questions, now distributed instead
of batched. Set `expectedChecks[id] = 3` (0 for overview) for the derived completion badge (§3).

---

## 6. Sequencing (keeps `npm test` green at every step)

The hard constraint is that M1's current `ConceptCheck`/`PredictionGate`/`ModuleAssessment` and their
tests all assume the page-model APIs. Big-bang is risky. Recommended order:

1. **Foundations (no page changes yet).**
   - Add the section-model store alongside or replacing the page store (§3) + its migration.
   - Add `SectionHook`, `YourTurnPanel`, the M2-style `ConceptCheck`, and the M2-style
     `PredictionGate` as the canonical components. Because the new `ConceptCheck`/`PredictionGate`
     APIs collide with the existing ones still used by `ModuleAssessment`, either (a) land the new
     ones and convert all pages in the same PR, or (b) temporarily host the new ones under
     `src/components/common/section/` and swap names at the end. Prefer (a) per topic if PR size
     allows; otherwise (b).
   - Adopt rich `CollapsibleSection`, ref-based `MathWrapper`, and rename guided `ChallengeCard` →
     `GuidedChallenge` (these are independent P2 items from the review and can land first).
   - Update/Add unit tests for the new components (§7). Suite stays green: old components/tests
     untouched until their pages migrate.

2. **Add `SectionLayout` + switch routing per section.** Convert one section at a time, lowest risk
   first (suggested order: `gauss` → `coulomb` → `ampere` → `lorentz` → `faraday` → `lenz` →
   `magnetic-circuits` → `polarization` → `maxwell` → `em-wave`, leaving the multi-view `em-wave`
   last). For each: extract canvas (§2.2), replace `RealWorldHook`→`SectionHook`, inline the 3
   `ConceptCheck`s from `quizContent`, wire store callbacks, drop the Practice tab, update that page's
   smoke-test expectation in `pages.test.tsx`. Run `npm test` + a `npm run dev` visual check
   (canvas + KaTeX render) per the M1 P-TEST-01 rule before moving on.

3. **Retire page-model leftovers.** Once all 10 content sections are converted: delete
   `ModuleAssessment`, `quizContent.ts`, the old `ConceptCheck`/`PredictionGate` (or finalize the §1
   rename if path (b) was used), `RealWorldHook`, and `ModuleLayout`. Grep for dangling imports.

4. **Final verification.** Full `npm test`, `npm run lint`, `GITHUB_ACTIONS=true npm run build`,
   manual `npm run dev` pass over all routes; confirm `emac-m1-progress` populates and the legacy
   `em-lab-progress` migration runs once.

---

## 7. Tests

- **New/updated unit tests** (mirror M2's): `SectionHook` (renders text/icon), `ConceptCheck` for the
  discriminated union (both `multiple-choice` and `predict-reveal` modes, hint tiers, `onComplete`/
  `onHint` fire), `PredictionGate` (`getCorrectAnswer`, `resetKey` remount, `onPredict`),
  `YourTurnPanel` (reveal logic). Keep M1's existing `MathWrapper`, `CollapsibleSection`, `Slider`,
  `Tabs`, `ErrorBoundary`, `PlayControls` tests.
- **Store test** (`src/store/__tests__/progressStore.test.ts`): rewrite for the section shape —
  `markVisited`, `incrementConceptChecks`, `incrementHints`, `markPredictionGate` (answered vs
  correct), and the one-time `em-lab-progress` → `emac-m1-progress` migration.
- **Smoke tests** (`src/pages/__tests__/pages.test.tsx`, move to `src/sections/__tests__/`): each
  section renders without crash; assert the `SectionHook` "Why This Matters" text and at least one
  `ConceptCheck` are present (the current assertion checks for the now-removed "Simulation" tab —
  update per section as it migrates).
- **Coverage to add that M1 lacks today**: a store-wiring integration test (mount a section, complete
  a `ConceptCheck`, assert `conceptChecksCompleted` incremented) — this is exactly the gap the
  conventions spec flags for M3 too, so author it once here as the reference.

---

## 8. Risks, constraints, open questions

- **Do Not Touch** (carried from the review): nothing in M1 is on the do-not-touch list, but treat the
  Phase 3a edits as locked (PolarizationPage handedness caption + Jones LaTeX, vite.config base).
  M2 `circuitSolver.ts` / M3 `transmissionMath.ts` are out of scope.
- **Physics content must not change** during migration — this is a structural/pedagogy refactor. Any
  equation, caption, or quiz answer edit is a separate, reviewed change. Re-verify canvas output after
  the §2.2 relocation.
- **Scope guard**: keep 11 routes; do **not** merge topics by track in this migration.
- **Coexistence**: the §6 path (a) vs (b) choice (same-PR swap vs temporary `section/` namespace) is
  the main implementation-style decision left to whoever executes; both keep the suite green.
- **Open question for owner**: should the guided multi-step challenges (`moduleChallenges`) survive as
  `GuidedChallenge` blocks, or be downgraded to `YourTurnPanel`s / dropped? The contract doesn't
  require them; M2 has no equivalent. Recommendation: keep as optional per-section extras initially,
  revisit after the core migration.
- **Effort**: touches all 11 routes, the store, ~10 new/changed components, ~30 inlined quiz items,
  and the full test suite. Largest single section is `em-wave` (multi-view canvases). This is the
  high-cost / high-consistency option the owner accepted by choosing Option A.

---

## Appendix — cross-references
- Conventions spec: `my-claude-skills/style/em-ac-lab-app-conventions.md` (§§1–6 + Open decision).
- M1 Phase 2 plan: `EM-AC-Lab-Module1/docs/cross-module-review-2026-05.md` (item "Architecture
  (CONDITIONAL on owner decision)" is this migration; the MathWrapper / store-key / ChallengeCard /
  CollapsibleSection / Tabs / brand-accent / LaTeX items are the independent prerequisites in §1.5/§6).
- Canonical section reference implementation: `EM-AC-Lab-Module2/src/components/common` and
  `src/components/modules/{ComponentPhysics,TimeDomain}`.
</content>
</invoke>
