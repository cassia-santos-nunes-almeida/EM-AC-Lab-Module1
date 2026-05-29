# Guided Challenge Spec (cross-module: M1 / M2 / M3)

Date: 2026-05-29
Status: M1 = IMPLEMENTED (10 challenges). M2 / M3 = TO ADD per this spec.
Context: follow-on to the M1 page→section migration (`docs/m1-section-migration-spec.md`).
During that migration the legacy `moduleChallenges` were retired with `quizContent.ts`; they have
now been re-authored — corrected so every instruction references a control that actually exists —
and re-inlined as `GuidedChallenge` capstones. This spec captures the pattern so M2 and M3 can adopt
it consistently.

---

## 1. What a Guided Challenge is (and is not)

A **Guided Challenge** is an open-ended, multi-step *exploration* exercise placed at the end of a
section: the student is given a scenario and a numbered list of concrete actions to perform on the
section's live simulation, then draws a conclusion themselves. There is **no auto-grading** — the
student marks it complete.

It is rendered by the **`GuidedChallenge`** component and is **distinct from `ChallengeCard`**:

| | `GuidedChallenge` (this spec) | `ChallengeCard` (M2's auto-check variant) |
|---|---|---|
| Pedagogy | Multi-step manual exploration | Single goal auto-detected from sim state |
| Completion | Student clicks "Mark Complete" | `check()` reads live state → auto-success |
| Data | `{ title, description, instructions: string[], hint?, checkFn? }` | `{ id, title, description, hint, successMessage, check?: () => boolean }` |
| Used in | Every section, as a capstone | M2 `InteractiveLab` only |

Keeping the two names separate is the reason M1 renamed its multi-step component
`ChallengeCard → GuidedChallenge` (cross-module conventions spec §5). M2's `ChallengeCard` (auto-check)
stays as-is; both modules may use both primitives.

---

## 2. Component contract (`GuidedChallenge`)

Source of truth: `EM-AC-Lab-Module1/src/components/common/GuidedChallenge.tsx` (port verbatim to M2/M3;
it uses the shared `engineering-blue` palette + `cn`, and is self-contained — no store wiring).

```ts
interface Challenge {            // already in M1 src/types
  title: string;
  description: string;
  instructions: string[];        // the ordered steps — THIS is the guided part
  hint?: string;                 // single encouraging hint
  checkFn?: () => boolean;       // unused for exploration challenges; leave undefined
}

interface GuidedChallengeProps {
  challenge: Challenge;
  onComplete?: () => void;       // optional; M1 leaves it unwired (self-contained completion)
}
```

Behaviour: shows title + description, walks the student through `instructions` one highlighted step
at a time ("Next Step" → … → "Mark Complete"), offers the `hint` on demand, and shows a completed
state. No progress-store wiring (matches M2's pattern — completion is local UI state).

M2/M3 note: their `Challenge`/challenge types differ (M2's is the auto-check shape). Add a
`{ title, description, instructions: string[], hint? }` data shape (or reuse M1's `Challenge`) for the
guided variant; do **not** overload the auto-check `ChallengeCard` type.

---

## 3. THE CARDINAL RULE — instructions must match real affordances

**Every instruction step must reference only controls/affordances that actually exist in that
section's simulation, named exactly as the student sees them.** Before writing a challenge, open the
section component and inventory the real controls: each slider (with its label + range), every
toggle/checkbox/button (exact label), every dropdown (exact options), any canvas drag target, any
view selector / mode toggle, and the key live readouts. Then write 4–6 imperative steps, each tied to
one real control and one observation, keeping the physics correct and ending with a conclusion. No
auto-check.

This rule exists because the *original* M1 challenges silently instructed students to use buttons
that were never built. The M1 re-authoring corrected, among others:

| Section | Original step (impossible) | Corrected to (real control) |
|---------|----------------------------|------------------------------|
| gauss | "Switch the surface shape to a cube and then an irregular blob" | Vary the **Surface Radius** slider + **Electric (E)/Magnetic (B)** toggle; use the hover \|E\| tooltip; flip the **Enclosed Charge Q** sign |
| maxwell | "Disable the displacement-current term"; "toggle each equation on and off" | **Click each card to expand**; identify the ε₀dΦ_E/dt term and *mentally* remove it; open the **Differential Form** panel |
| faraday | "Move the bar magnet slowly toward the coil"; "100 turns" | There is no magnet — the **Rate (ω)** slider sets dΦ/dt; **Loops (N)** maxes at 10; watch the B/EMF labels flip for the sign reversal |
| lenz | "Replace the ring with a broken (non-conducting) ring" | No such toggle — sweep **Turns (N)** and enable **Auto-Oscillate** to show the same opposition/energy idea |
| lorentz | "B = 0.1 T", "proton at 1×10⁶ m/s" (absolute SI) | The sliders are **arbitrary units** — set values via the sliders and read the live `r_c` / "Computed r" readouts; show proportionality, not SI absolutes |
| ampere | "Use the field probe to measure B at r = 1,2,4,8 cm"; "plot it" | Drag the **amber radius marker** (tooltip shows r, B); compare against per-ring labels; no plotting tool exists |
| em-wave | "Increase the refractive-index slider 1.0→1.5" | It's a **dropdown** (Vacuum/Water/Glass), not a slider; the view button is labelled **"AC Phasors"** |
| polarization | "Change phase to −90° (or 270°)"; "identify the Jones vector displayed" | The δ slider range is −180…180 (270° unreachable); the sim shows **Stokes [S0,S1,S2,S3] + ψ/χ/AR**, not a Jones vector |
| coulomb | "Place +1 μC at (−0.5, 0)" (coordinate entry) | Positions are **drag-only**; use **Add Charge** + the per-charge **q slider**; read the hover \|E\| tooltip |
| magnetic-circuits | "at what gap *length* does L halve" | Gap is a **percentage** slider with no mm readout — find the gap *percentage* where the **L** readout halves |

---

## 4. Placement & sequencing

- Render the `<GuidedChallenge challenge={CHALLENGE} />` as the **last child** of the section layout
  (after the inline ConceptChecks / theory, before the bottom navigation) — a practice capstone.
- Define the `CHALLENGE: Challenge` as a module-level const in the section file (inlined, like the
  section's ConceptCheck data).
- One section smoke test should assert the challenge title renders (locks the wiring); `GuidedChallenge`
  itself keeps its own unit test.
- Keep the test suite green per section; physics in the challenge must be correct (it is teaching
  content — treat any equation/answer as reviewed).

---

## 5. Per-module application

- **M1** — DONE. 10 guided challenges (one per content section; overview has none), re-authored against
  the real sims and inlined; verified by an adversarial fidelity pass.
- **M2** — Has an auto-check `ChallengeCard` + `challenges.ts` in `InteractiveLab` (keep it). To adopt
  this spec: port `GuidedChallenge` from M1, then add one guided challenge to the sections that have a
  manipulable sim (e.g. ComponentPhysics, TimeDomain, S-Domain) grounded in each section's real
  sliders/toggles. Do not convert the existing auto-check challenge.
- **M3** — Has no challenge component. Port `GuidedChallenge` + the `Challenge` data shape from M1, then
  add one guided challenge per section (Transmission Lines, Antennas, Transformers, Transients,
  Lumped/Distributed) grounded in each simulation's actual controls (Smith chart, bounce diagram,
  standing-wave, radiation-pattern, coupled-coils, ladder, etc.).

For M2/M3, the authoring loop is the same as the M1 re-draft: **read the actual sim → inventory real
controls → write 4–6 steps each tied to a real control → keep physics correct → no auto-check**, then
adversarially verify that every instruction maps to a control that exists.

---

## Appendix — cross-references
- M1 component: `EM-AC-Lab-Module1/src/components/common/GuidedChallenge.tsx` (+ its test).
- M1 examples: the `CHALLENGE` const at the end of each `src/sections/<topic>/index.tsx`.
- Migration context: `docs/m1-section-migration-spec.md`.
- Conventions: `my-claude-skills/style/em-ac-lab-app-conventions.md` (§5 ChallengeCard↔GuidedChallenge rename).
