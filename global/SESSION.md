# SESSION.md — Current State

Overwritten at every session close. Read at every session open.
Last updated: 2026-03-20 · Session focus: Consolidate session management system

## Completed This Session

- [x] Read all context files across all 3 EM-AC-Lab repos (session open protocol)
- [x] Designed and implemented consolidated session management system
- [x] Created global CLAUDE.md, PATTERNS.md, SESSION.md, PLAYBOOK.md at `/home/user/`
- [x] Migrated 15 lessons from COURSE_GUIDELINES.md → P-CODE-01 through P-CODE-15 in PATTERNS.md
- [x] Updated repo CLAUDE.md files in all 3 modules (added global reference, absorbed project-reference.md, removed duplicated conventions)
- [x] Removed redundant context/ files (current-sprint.md, known-issues.md, project-reference.md, session-handoff)
- [x] Kept `context/decisions.md` as ADR log per repo
- [x] Committed and pushed to `claude/review-docs-context-iYEO4` in all 3 repos
- [x] Added global files to `EM-AC-Lab-Module1/global/` for version control (committed + pushed)

## Module 1 — EM Fundamentals

### Status
- Branch: `claude/review-docs-context-iYEO4` (1 commit ahead of main — consolidation commit)
- Tests: 71/71 passing
- Build: clean

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
- Branch: `claude/review-docs-context-iYEO4` (1 commit ahead of main — consolidation commit)
- Tests: 92/92 passing
- Build: clean

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
- Branch: `claude/review-docs-context-iYEO4` (1 commit ahead of main — consolidation commit)
- Tests: 81/81 passing
- Build: clean

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
- [ ] Production deployment verification pending (all 3 branches have unpushed consolidation commits — need PRs to main)

### Notes for Next Session
- All 3 repos on branch `claude/review-docs-context-iYEO4`, 1 commit ahead of main
- Global session system is now in place — say `open session` at start
- Canonical global files: `EM-AC-Lab-Module1/global/` (version-controlled)
- Mirror at `/home/user/` for Claude Code auto-loading
- When SESSION.md or PATTERNS.md change: paste into both locations, commit `global/` copy

## Patterns Triggered This Session

| Pattern ID | Triggered? | Applied? |
|---|---|---|
| P-ENV-04 | First occurrence | Added to PATTERNS.md |

## PATTERNS.md Updates This Session

Added:
- **P-ENV-04** — `git init` fails in directories without a GitHub remote. Use a subdirectory of an existing repo instead.

## Skills Used This Session

- [x] other: session management system design and implementation (no domain skills needed)
