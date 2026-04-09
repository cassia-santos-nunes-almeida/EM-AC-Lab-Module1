# PATTERNS — EM-AC-Lab-Module1

Accumulated corrections and hard rules for this project.
Every entry is a hard constraint, not a suggestion.

Cross-project rules are in `.claude/skill/context_evaluator/shared-patterns.md` —
when a rule here conflicts with shared-patterns, the project-specific rule wins.

---

## Code (P-CODE)

### P-CODE-01 — `as string ??` doesn't catch undefined env vars
**Pattern:** `import.meta.env.VITE_X as string` casts `undefined` to the string `"undefined"` (truthy), so `??` never triggers the fallback.
**Rule:** Always use `||` for env var fallbacks, never `??` with a type cast.
**Scope:** All Vite projects with env vars
**First seen:** Cross-module audit, 2026-03-15

### P-CODE-02 — Never write to refs during render (React 19)
**Pattern:** `derivedRef.current = {...}` was placed in the render body, violating React 19's `react-hooks/refs` rule.
**Rule:** Never write to refs during render. Use `useEffect` for ref synchronization.
**Scope:** All React 19 components with refs
**First seen:** MagneticCircuitsPage audit, 2026-03-15

### P-CODE-03 — rAF loops in useEffect, not useCallback
**Pattern:** `requestAnimationFrame` loops structured as self-referencing `useCallback` caused React 19 closure issues.
**Rule:** Structure `requestAnimationFrame` loops in `useEffect`, not `useCallback`. Read state from `stateRef` (updated via a separate `useEffect`).
**Scope:** All canvas simulations
**First seen:** SmithChartSim refactor, 2026-03-15

### P-CODE-04 — Note linearized iron permeability
**Pattern:** Iron permeability was displayed as a single constant without noting nonlinearity.
**Rule:** When displaying magnetic circuit calculations with iron-core materials, note when using a linearized value and warn that real iron saturates.
**Scope:** Magnetic circuit simulations
**First seen:** Cross-module audit, 2026-03-15

### P-CODE-05 — Show both ideal and actual V2 when k < 1
**Pattern:** Only ideal transformer equation was shown, ignoring coupling coefficient.
**Rule:** Always show both ideal and actual secondary voltage when k < 1, with a warning about the discrepancy.
**Scope:** Transformer/coupled coil simulations
**First seen:** CoupledCoilsSim audit, 2026-03-15

### P-CODE-06 — Check stability before applying Final Value Theorem
**Pattern:** FVT was applied without verifying pole locations.
**Rule:** Before applying FVT, verify that all poles of sF(s) are in the left half-plane.
**Scope:** S-domain analysis, circuit response calculations
**First seen:** Module 2 development

### P-CODE-07 — Log-bucket resetKey for PredictionGate with sliders
**Pattern:** PredictionGate reset on every tiny slider movement.
**Rule:** When parameters change continuously (sliders), use a log-bucket resetKey.
**Scope:** PredictionGate component usage
**First seen:** Phase 2 pedagogy sprint

### P-CODE-08 — skipWaiting + lazyRetry for service worker stale cache
**Pattern:** After deploys, users with cached old index.html got chunk load errors.
**Rule:** Configure `skipWaiting: true`, `clientsClaim: true`, `cleanupOutdatedCaches: true` in VitePWA config. Use `lazyRetry()` for all dynamic imports.
**Scope:** All PWA-enabled modules
**First seen:** Production cache issue, 2026-03-04

### P-CODE-09 — Track learning signals, not page visits
**Pattern:** Progress was tracked by page visits, giving a false sense of completion.
**Rule:** Track meaningful learning signals (concept check completions, prediction submissions) rather than page visits.
**Scope:** Progress store design
**First seen:** Module 2 progress store removal, 2026-03-15

### P-CODE-10 — 2-3 ConceptChecks per content section
**Pattern:** Sparse ConceptCheck placement left too much unverified understanding.
**Rule:** Aim for 2-3 ConceptChecks per content section, not 1 per page.
**Scope:** All content pages
**First seen:** Pedagogy sprint review

### P-CODE-11 — Double backslashes for LaTeX in JSX string attributes
**Pattern:** `formula="\frac{a}{b}"` silently fails because `\f` becomes a form-feed.
**Rule:** Always use `\\frac`, `\\alpha`, `\\times`, etc. in JSX string attributes.
**Scope:** All MathWrapper usage
**First seen:** Module 3 LaTeX fix sprint, 2026-03-16

### P-CODE-12 — Grep for `\\\1` after automated edits to LaTeX files
**Pattern:** ESLint auto-fix turned `\\frac` into `\\\1rac`.
**Rule:** After any automated edit to files with LaTeX, grep for `\\\1` or similar corruption.
**Scope:** All files with MathWrapper formulas
**First seen:** Transients.tsx linter corruption, 2026-03-16

### P-CODE-13 — Wikimedia image URLs need correct MD5 hash
**Pattern:** Thumbnail URLs had wrong MD5 hash prefix, causing 404s.
**Rule:** Compute hash with Python. Always verify exact filename on Wikimedia Commons page.
**Scope:** All FigureImage components with Wikimedia URLs
**First seen:** Image verification sprint, 2026-03-16

### P-CODE-14 — FigureImage component for all educational images
**Pattern:** Educational images were added without consistent UX.
**Rule:** Use the shared FigureImage component for all educational images: click-to-enlarge modal, caption, attribution, source link, dark mode, responsive sizing.
**Scope:** All module pages with images
**First seen:** Image sprint, 2026-03-16

### P-CODE-15 — Conditional Vite base path for dual deployment
**Pattern:** Hardcoded base paths broke one of the two deployment targets.
**Rule:** Use `process.env.GITHUB_ACTIONS ? '/repo-name/' : '/'` in vite.config.ts. PWA scope/start_url must also use the same base.
**Scope:** Vite config in all modules
**First seen:** Module 3 GH Pages deployment, 2026-03-16

---

## Environment (P-ENV)

### P-ENV-04 — `git init` fails in directories without a GitHub remote
**Pattern:** Running `git init` + commit in a directory not associated with a GitHub repo causes the signing server to reject.
**Rule:** Do not `git init` in directories that lack a GitHub remote.
**Scope:** All Claude Code sessions
**First seen:** Session management consolidation, 2026-03-20

---

## Template for New Entries

```markdown
### P-[CATEGORY]-[NN] — [Short descriptive title]
**Pattern:** What kept happening — describe concretely.
**Rule:** The concrete fix. Imperative, unambiguous.
**Scope:** Which simulation(s) or context(s).
**First seen:** Session date or task name.
```

To add a new entry:
1. Pick the correct category (CODE, ENV, UI, PHYS) or create a new one.
2. Use the next available number in that category.
3. Fill in all four fields. Be concrete — avoid vague language.
4. Never renumber existing entries. If an entry is retired, mark it `[RETIRED]`.
