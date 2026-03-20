# SESSION.md — Current State

Overwritten at every session close. Read at every session open.
Last updated: 2026-03-20 · Session focus: Consolidate session management system

## Completed This Session

- [x] Consolidated session management system across all 3 EM-AC-Lab repos
- [x] Created global CLAUDE.md, PATTERNS.md, SESSION.md, PLAYBOOK.md at /home/user/
- [x] Migrated 15 lessons from COURSE_GUIDELINES.md → P-CODE patterns in PATTERNS.md
- [x] Updated repo CLAUDE.md files to reference global files
- [x] Removed redundant context/ files (current-sprint.md, known-issues.md, project-reference.md)
- [x] Kept context/decisions.md as ADR log per repo

## Module 1 — EM Fundamentals

### Status
- Branch: `claude/review-docs-context-iYEO4` (clean)
- Tests: 71/71 passing
- Build: clean

### Completed (all previous sprints)
- Phase 1: Canvas interaction improvements (draggable phasors, hover tooltips, touch, keyboard)
- Phase 2: Pedagogy (Socratic tutor, RealWorldHook, PredictionGate, 3-tier hints, Phasor Sync, Magnetic Circuits page)
- Cross-module audit: Maxwell Q3 fix, iron permeability note, differential forms, unified dark mode
- Image & Analytics sprint: 15 FigureImage components, Vercel Analytics, Wikimedia URL fixes
- 3-tier hints added to all 27 quiz questions

### In Progress
- [ ] Add smoke tests for shared components
- [ ] Add render tests for each page
- [ ] Generate PWA icons (pwa-192x192.png, pwa-512x512.png)
- [ ] Consider using recharts for field strength vs distance graphs
- [ ] Manually verify all Wikimedia image URLs load correctly on the live site

### Open Issues
- Canvas not responsive on window resize (low — navigate away/back as workaround)
- AI Tutor API key stored in localStorage plain text (acceptable for educational tool)
- KaTeX font warnings at build time (fonts work at runtime)
- Pre-existing lint warnings: MaxwellPage.tsx:85 `_t` unused, EMWavePage missing `isDarkMode` dep, LorentzPage:47 missing `handleReset` dep
- recharts installed but unused
- PWA icons missing (pwa-192x192.png, pwa-512x512.png)

## Module 2 — Circuit Analysis

### Status
- Branch: `claude/review-docs-context-iYEO4` (clean)
- Tests: 92/92 passing
- Build: clean

### Completed (all previous sprints)
- Initial build: Vite scaffold, 6 pages, circuitSolver, dark mode, responsive layout
- Component extraction: InteractiveLab/CircuitDiagram subdirectory, CircuitParameterSliders
- Pedagogy: ConceptCheck, ChallengeCard, CollapsibleSection, PredictionGate, ModuleNavigation
- S-Domain: SDomainPanel in InteractiveLab, SDomainAnalysis simplified to theory-only
- Accessibility audit: ARIA patterns, roving tabIndex, skip-to-content, aria-live
- Component + page tests: 92 total (circuitSolver, componentMath, components, pages, hooks)
- Shareable lab links (URL params) + chart export (SVG→PNG)
- Extracted useShareableParams and useChartExport hooks

### In Progress
- [ ] ComponentPhysics: shareable URLs for slider state
- [ ] TimeDomain: shareable URL for active circuit tab; chart export on response comparison
- [ ] SDomainAnalysis: chart export on pole-zero scatter plot
- [ ] Meaningful progress tracking (based on completed challenges/concept checks)
- [ ] SDomainAnalysis / LaplaceTheory / Overview page decomposition (if files grow)

### Open Issues
- API key in localStorage (acceptable for student tool)
- Chart PNG export uses SVG serialization (won't capture CSS-only styles)

## Module 3 — Transmission Lines & Antennas

### Status
- Branch: `claude/review-docs-context-iYEO4` (clean)
- Tests: 81/81 passing
- Build: clean

### Completed (all previous sprints)
- Initial build: 6 pages, 7 canvas simulations, transmissionMath.ts
- Audit: CoupledCoilsSim animated fields, dual V₂ readouts, SmithChartSim interactive
- LaTeX fix sprint: ~200+ formulas fixed across 6 pages
- Image fixes: 3 broken URLs replaced, linter-corrupted LaTeX repaired
- Component + page smoke tests added

### In Progress
- [ ] Add component-level tests (only math utils + smoke tests so far)
- [ ] Add page-level integration tests
- [ ] Generate PWA icons (pwa-192x192.png, pwa-512x512.png)

### Open Issues
- API key in localStorage (acceptable for student tool)
- Iron permeability linearized (μᵣ = 5000, documented in UI)
- Ideal transformer model for I₂ and Z_ref when k < 1 (documented in UI)
- Half-wave dipole approximation for non-λ/2 lengths
- PWA icons missing
- 5 unverified Wikimedia image URLs (proxy blocked during verification):
  - `Network_Analyzer_Agilent_8714ET.jpg` (TransmissionLines.tsx)
  - `Transformer_au_poste_electrique_de_Bondy.jpg` (Transformers.tsx)
  - `Toroidal_inductor.jpg` (Transformers.tsx — possibly missing)
  - `Ringing_on_unterminated_transmission_line.jpg` (Transients.tsx)
  - `Eye_diagram_of_a_4-level_signal.png` (TransmissionLines.tsx)
- GitHub Pages vs Vercel may differ (conditional base path)

## Cross-Module

### Open Decisions / Blockers
- [ ] PWA icon generation needed across all 3 modules
- [ ] Production deployment verification pending

### Notes for Next Session
- All 3 repos on branch `claude/review-docs-context-iYEO4`
- Session management system now consolidated — use `open session` / `close session` protocols
- Check PATTERNS.md at session open for all 21 active patterns

## Patterns Triggered This Session

| Pattern ID | Triggered? | Applied? |
|---|---|---|
| (none — this was a documentation restructuring session) | | |

## PATTERNS.md Updates This Session

- Added P-CODE-01 through P-CODE-15 (migrated from COURSE_GUIDELINES.md "Lessons Learned")

## Skills Used This Session

- [x] other: documentation restructuring (no code skills needed)
