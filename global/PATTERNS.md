# PATTERNS.md — Accumulated Corrections and Rules

Living memory. Updated at every session close. Read at every session open.
Every entry is a hard constraint — not a suggestion.

## How to Read This File

Each entry has:
- **Pattern:** What kept happening (the mistake or repeated correction)
- **Rule:** The concrete fix to apply automatically from now on
- **Scope:** Which skill(s) or contexts this applies to
- **First seen:** When this was first documented

---

## STACK / Moodle XML

### P-STACK-01 — Full `<name>` tag, never abbreviated
**Pattern:** XML name elements were generated with abbreviated or shortened forms.
**Rule:** Always use the full `<name>` tag for all name elements: question name, input name, PRT name, node name, testinput name, expected PRT name. No abbreviations, no shorthand.
**Scope:** stack-xml-generator
**First seen:** Week 10–12 question development

### P-STACK-02 — NumAbsolute for zero, NumRelative for nonzero
**Pattern:** NumRelative was used on answers with a reference value of zero, causing silent grading failure (division by zero).
**Rule:** When the model answer is zero or can be zero, use NumAbsolute with tolerance 0.01. Use NumRelative only when the reference value is guaranteed nonzero.
**Scope:** stack-xml-generator — all PRT grading nodes
**First seen:** XML debugging sprint (48 PRTs converted)

### P-STACK-03 — Never `{@ansN@}` in `<specificfeedback>`
**Pattern:** Student answer variables were used directly in `<specificfeedback>` tags.
**Rule:** Never use `{@ansN@}` in `<specificfeedback>`. Use `[[feedback:prtN]]` only. STACK renders `{@ansN@}` as a raw CAS symbol in this context.
**Scope:** stack-xml-generator
**First seen:** XML debugging sprint

### P-STACK-04 — CDATA wrapping for `<` in feedbackvariables
**Pattern:** Bare `<` operators inside `<feedbackvariables>` caused XML parse failures.
**Rule:** Any `<feedbackvariables>` block containing `<` comparison operators must be wrapped in `<![CDATA[...]]>`. Check every feedbackvariables block before finalizing.
**Scope:** stack-xml-generator
**First seen:** XML debugging sprint

### P-STACK-05 — NumSigFigs(3) not NumAbsolute for non-zero numerical answers
**Pattern:** NumAbsolute was used as the default for numerical answers, causing rounding tolerance mismatches.
**Rule:** Use NumSigFigs(3) as the default for non-zero numerical answers. Use the custom `sf3()` Maxima function for consistent 3-significant-figure rounding in model answers.
**Scope:** stack-xml-generator
**First seen:** XML debugging sprint (27 questions updated)

### P-STACK-06 — Exact arithmetic for symbolic constants
**Pattern:** Floats like `4*%pi*1e-7` were used for symbolic constants, causing AlgEquiv failures.
**Rule:** Write `4*%pi/10^7`, not `4*%pi*1e-7`. Never use `1e-N` notation in Maxima CAS expressions that may be compared symbolically.
**Scope:** stack-xml-generator
**First seen:** EM&AC Week 11–12 questions

---

## Lecture Production (lut-lecture)

### P-LEC-01 — All 4 figure annotation elements, every figure slide
**Pattern:** Figure slides were generated missing one or more of the four required annotation elements.
**Rule:** Every figure slide must have all four: (1) concept title, (2) one-sentence description, (3) relevant formula/law/constraint, (4) textbook pointer with chapter and section. If all four cause clutter, split the slide.
**Scope:** lut-lecture — all courses
**First seen:** Slide rebuild sprints

### P-LEC-02 — Equations must be OMML, not Unicode or images
**Pattern:** Equations were generated as Unicode characters or image placeholders instead of proper OMML objects.
**Rule:** All equations in .pptx files must use PPTX equation objects (OMML). Never use Unicode math characters. Never use images as equation substitutes.
**Scope:** lut-lecture — .pptx output
**First seen:** Week 11–12 rebuild specification

### P-LEC-03 — 3-slide worked example structure always
**Pattern:** Worked examples were collapsed into fewer slides or the structure was not followed.
**Rule:** Every worked example requires exactly 3 slides: (1) Problem statement, (2) Solution steps, (3) Result with units, order-of-magnitude check, and limiting case. No exceptions.
**Scope:** lut-lecture — all courses
**First seen:** PEDAGOGICAL_DNA encoding

### P-LEC-04 — Notation follows the active course, not the other textbook
**Pattern:** Notation from the wrong textbook was used (e.g., Ulaby notation in a Nilsson-based lecture, or vice versa).
**Rule:** Cross-sectional area: use A (Nilsson/EM&AC) or S (Ulaby) — follow the course config. Flux linkage: use λ (Nilsson) or Λ (Ulaby). When switching between courses in a session, confirm which is active.
**Scope:** lut-lecture — EM&AC and EP
**First seen:** Week 10 lecture, textbook cross-reference work

---

## Writing and Communication (message-coach)

### P-MSG-01 — "flagging" is banned
**Pattern:** "flagging", "thanks for flagging", "I'm flagging this" appeared in drafted messages.
**Rule:** Never use "flagging" in any form. Replace with: "thanks for the heads-up", "thanks for pointing that out", "thanks for checking".
**Scope:** message-coach, all communication output, CLAUDE.md itself
**First seen:** Recent corrections

### P-MSG-02 — Sign-off is "Best regards," never "Best,"
**Pattern:** Emails were signed off with "Best," instead of the correct form.
**Rule:** Email sign-off is "Best regards," (collegial/professional) or "Regards," (more formal). Never "Best," alone.
**Scope:** message-coach — English work emails
**First seen:** Email drafting sessions

### P-MSG-03 — Anti-AI rules apply before finalizing any written output
**Pattern:** Banned words and patterns appeared in message drafts without being caught.
**Rule:** Before finalizing any written output, run the Anti-AI Rules check from `message-coach/SKILL.md`. Banned words include: "crucial", "vital", "leverage", "delve", "navigate", "landscape", "groundbreaking", "game-changer", "it's worth noting". Banned patterns include: three parallel bullets of equal length, summary sentence repeating what was said, transition sentences with no content.
**Scope:** message-coach, all written output
**First seen:** Message drafting sessions

---

## Environment and Tooling

### P-ENV-01 — PowerShell: use `python`, not `python3`
**Pattern:** Commands using `python3` failed in PowerShell because it is not on PATH.
**Rule:** In PowerShell on Cássia's machine, always use `python` (or full path). Never use `python3`.
**Scope:** All bash/shell commands, Claude Code sessions
**First seen:** Claude Code setup

### P-ENV-02 — Google Drive search unreliable for .pptx files
**Pattern:** Google Drive search failed to locate .pptx files reliably.
**Rule:** For .pptx files, use direct upload rather than Drive search. Do not attempt to fetch .pptx via Drive search — ask Cássia to upload the file directly.
**Scope:** All sessions involving presentation files
**First seen:** Lecture production sessions

### P-ENV-03 — NotebookLM auth tokens expire frequently
**Pattern:** NotebookLM MCP calls failed silently due to expired auth tokens.
**Rule:** Before any NotebookLM query, run `notebooklm-mcp:refresh_auth`. Do not assume the token is valid between sessions.
**Scope:** Claude Desktop sessions using NotebookLM MCP
**First seen:** Textbook query sessions

**Key notebook IDs:**
- "Electric Circuits and Electromagnetism" (Nilsson & Riedel): `40a67046-002c-4d7f-887a-e2e39f88a19d`
- "Fundamentals of Applied Electromagnetics" (Ulaby): `e04a3c5a-645e-431f-a460-b55006d64506`

---

## Code (EM&AC Lab Web Apps)

### P-CODE-01 — `as string ??` doesn't catch undefined env vars
**Pattern:** `import.meta.env.VITE_X as string` casts `undefined` to the string `"undefined"` (truthy), so `??` never triggers the fallback.
**Rule:** Always use `||` for env var fallbacks, never `??` with a type cast.
**Scope:** All Vite projects with env vars
**First seen:** Cross-module audit, 2026-03-15

### P-CODE-02 — Never write to refs during render (React 19)
**Pattern:** `derivedRef.current = {...}` was placed in the render body, violating React 19's `react-hooks/refs` rule.
**Rule:** Never write to refs during render. Use `useEffect` for ref synchronization. The rule enforces this at lint time.
**Scope:** All React 19 components with refs
**First seen:** MagneticCircuitsPage audit, 2026-03-15

### P-CODE-03 — rAF loops in useEffect, not useCallback
**Pattern:** `requestAnimationFrame` loops structured as self-referencing `useCallback` caused React 19 closure issues.
**Rule:** Structure `requestAnimationFrame` loops in `useEffect`, not `useCallback`, to avoid self-referencing closure issues. Read state from `stateRef` (updated via a separate `useEffect`).
**Scope:** All canvas simulations
**First seen:** SmithChartSim refactor, 2026-03-15

### P-CODE-04 — Note linearized μᵣ for iron permeability
**Pattern:** Iron permeability was displayed as a single constant without noting nonlinearity.
**Rule:** When displaying magnetic circuit calculations with iron-core materials, always note when using a linearized μᵣ value and warn that real iron saturates (μᵣ ~ 100–10,000).
**Scope:** Magnetic circuit simulations
**First seen:** Cross-module audit, 2026-03-15

### P-CODE-05 — Show both ideal and actual V₂ when k < 1
**Pattern:** Only ideal transformer equation V₂ = V₁·N₂/N₁ was shown, ignoring coupling coefficient.
**Rule:** Always show both the ideal (`V₂ = V₁·N₂/N₁`) and actual (`V₂ = kV₁·N₂/N₁`) secondary voltage when k < 1, with a warning about the discrepancy.
**Scope:** Transformer/coupled coil simulations
**First seen:** CoupledCoilsSim audit, 2026-03-15

### P-CODE-06 — Check stability before applying Final Value Theorem
**Pattern:** FVT was applied without verifying pole locations.
**Rule:** Before applying FVT to find steady-state values, verify that all poles of `sF(s)` are in the left half-plane. Note pole locations.
**Scope:** S-domain analysis, circuit response calculations
**First seen:** Module 2 development

### P-CODE-07 — Log-bucket resetKey for PredictionGate with sliders
**Pattern:** PredictionGate reset on every tiny slider movement when simulation parameters changed continuously.
**Rule:** When simulation parameters change continuously (sliders), use a log-bucket `resetKey` to prevent constant PredictionGate resets on every tiny slider movement.
**Scope:** PredictionGate component usage
**First seen:** Phase 2 pedagogy sprint

### P-CODE-08 — skipWaiting + lazyRetry for service worker stale cache
**Pattern:** After deploys with new chunk hashes, users with cached old `index.html` got "Failed to fetch dynamically imported module" errors.
**Rule:** Always configure `skipWaiting: true`, `clientsClaim: true`, `cleanupOutdatedCaches: true` in VitePWA config. Use `lazyRetry()` wrapper for all dynamic imports.
**Scope:** All PWA-enabled modules
**First seen:** Production cache issue, 2026-03-04

### P-CODE-09 — Track learning signals, not page visits
**Pattern:** Progress was tracked by page visits, giving a false sense of completion.
**Rule:** Track meaningful learning signals (concept check completions, prediction submissions) rather than just page visits for progress tracking.
**Scope:** Progress store design
**First seen:** Module 2 progress store removal, 2026-03-15

### P-CODE-10 — 2-3 ConceptChecks per content section
**Pattern:** Sparse ConceptCheck placement (1 per page) left too much unverified understanding.
**Rule:** Aim for 2-3 ConceptChecks per content section, not 1 per page. Sparse checks leave too much unverified understanding between checkpoints.
**Scope:** All content pages
**First seen:** Pedagogy sprint review

### P-CODE-11 — Double backslashes for LaTeX in JSX string attributes
**Pattern:** `formula="\frac{a}{b}"` silently fails because `\f` becomes a form-feed in JS strings.
**Rule:** Always use `\\frac`, `\\alpha`, `\\times`, etc. in JSX string attributes. Detection regex: `formula="[^"]*[^\\]\\[a-zA-Z]`.
**Scope:** All MathWrapper usage
**First seen:** Module 3 LaTeX fix sprint, 2026-03-16

### P-CODE-12 — Grep for `\\\1` after automated edits to LaTeX files
**Pattern:** ESLint auto-fix or string processing turned `\\frac` into `\\\1rac`.
**Rule:** After any automated edit to files with LaTeX, grep for `\\\1` or similar corruption. KaTeX failures are silent at build time — only visible at runtime.
**Scope:** All files with MathWrapper formulas
**First seen:** Transients.tsx linter corruption, 2026-03-16

### P-CODE-13 — Wikimedia image URLs need correct MD5 hash
**Pattern:** Thumbnail URLs had wrong MD5 hash prefix, causing 404s. Filenames are case-sensitive (`.JPG` ≠ `.jpg`).
**Rule:** Compute hash with: `python -c "import hashlib; f='Filename.ext'; h=hashlib.md5(f.encode()).hexdigest(); print(f'thumb/{h[0]}/{h[:2]}/{f}/500px-{f}')"`. Always verify the exact filename on the file's Wikimedia Commons page.
**Scope:** All FigureImage components with Wikimedia URLs
**First seen:** Image verification sprint, 2026-03-16

### P-CODE-14 — FigureImage component for all educational images
**Pattern:** Educational images were added without consistent UX.
**Rule:** Use the shared `FigureImage` component for all educational images: click-to-enlarge modal, caption, attribution, source link, dark mode, responsive sizing with `sm:max-w-md` or similar constraints.
**Scope:** All module pages with images
**First seen:** Image sprint, 2026-03-16

### P-CODE-15 — Conditional Vite base path for dual deployment
**Pattern:** Hardcoded base paths broke one of the two deployment targets.
**Rule:** When supporting both Vercel (`/`) and GitHub Pages (`/repo-name/`), use `process.env.GITHUB_ACTIONS ? '/repo-name/' : '/'` in `vite.config.ts`. PWA scope/start_url must also use the same `base`.
**Scope:** Vite config in all modules
**First seen:** Module 3 GH Pages deployment, 2026-03-16

---

### P-ENV-04 — `git init` fails in directories without a GitHub remote
**Pattern:** Running `git init` + commit in a directory not associated with a GitHub repo (e.g., `/home/user/`) causes the signing server to reject the commit with status 400 "missing source".
**Rule:** Do not `git init` in directories that lack a GitHub remote. To version-control global files, place them in a subdirectory of an existing repo (e.g., `EM-AC-Lab-Module1/global/`) and commit there instead.
**Scope:** All Claude Code sessions on this environment
**First seen:** Session management consolidation, 2026-03-20

---

## Template for New Entries

Copy this when adding a new pattern at session close:

```
### P-[CATEGORY]-[NN] — [Short descriptive title]
**Pattern:** What kept happening — describe the recurring mistake concretely.
**Rule:** The concrete fix to apply automatically from now on. Imperative, unambiguous.
**Scope:** Which skill(s) or context(s) this applies to.
**First seen:** Session date or task name.
```

Categories: `STACK` · `LEC` · `MSG` · `ENV` · `CODE` · `RESEARCH`
