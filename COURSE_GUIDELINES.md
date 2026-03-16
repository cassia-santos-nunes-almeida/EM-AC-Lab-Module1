# EM&AC Lab — Course Guidelines

Shared conventions, patterns, and lessons learned across all three modules of the Electromagnetic & Analog Circuit Analysis Lab.

## Course Architecture

| Module | Title | Repo | Live URL |
|--------|-------|------|----------|
| M1 | Electromagnetic Fundamentals | `EM-AC-Lab-Module1` | https://em-ac-lab-module1.vercel.app |
| M2 | Circuit Analysis | `EM-AC-Lab-Module2` | https://em-ac-lab-module2.vercel.app |
| M3 | Transmission Lines & Antennas | `EM-AC-Lab-Module3` | https://em-ac-lab-module3.vercel.app |

**Progression:** M1 → M2 → M3. Each module builds on concepts from the previous one. Content bridges connect related topics across modules.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19 |
| Build | Vite | 7 |
| Styling | Tailwind CSS | v4 (PostCSS) |
| State | Zustand | 5 (with persist middleware) |
| Routing | react-router-dom | v7 (lazy-loaded pages) |
| Icons | lucide-react | latest |
| Math | KaTeX via `MathWrapper` | 0.16+ |
| AI Tutor | Google Gemini API | client-side, optional |
| PWA | vite-plugin-pwa | 1.0 |
| Testing | Vitest + @testing-library/react | latest |
| Analytics | @vercel/analytics | latest |

## Shared Conventions

### Utilities
- **`cn()`** — Always use `cn()` (clsx + tailwind-merge) for Tailwind class merging. Located at `src/utils/cn.ts`.
- **`MathWrapper`** — Always use `<MathWrapper formula="..." />` for math rendering. Never use raw HTML or custom parsers.
- **Icons** — Import from `lucide-react`. Never use custom SVG icons.

### Dark Mode
- Class-based dark mode (`.dark` on `<html>`)
- Shared `emac-theme` localStorage key across all three modules — toggling in any module affects all three
- Every component MUST have `dark:` variants
- State managed by `useThemeStore` (Zustand, persisted to `emac-theme`)

### Error Handling
- **3-level ErrorBoundary**: `page`, `section`, and `inline` fallback variants
- **Per-route wrapping**: Each `<Route>` element is wrapped in its own `<ErrorBoundary><Suspense>...</Suspense></ErrorBoundary>` so one page crash doesn't take down the whole app
- **`lazyRetry()`**: All lazy-loaded routes use `lazyRetry()` for one-time page reload on stale service worker cache failures

### Cross-Module Integration
- **`src/constants/modules.ts`**: Provides `MODULE_URLS` object with URLs to all three modules. Reads `VITE_MODULE*_URL` env vars with `||` fallback to hardcoded Vercel URLs.
- **Sidebar navigation**: Each module's sidebar includes a "Course Modules" section linking to all three modules.
- **Content bridges**: Pages reference related content in other modules with explanatory context.

### PWA Configuration
All modules use `vite-plugin-pwa` with:
```
skipWaiting: true
clientsClaim: true
cleanupOutdatedCaches: true
registerType: 'autoUpdate'
```

## Pedagogical Patterns

The recommended flow for each content section:

1. **SectionHook** — Real-world motivating example ("Why should I care?")
2. **Theory** — Equations, derivations, explanations
3. **CollapsibleSection** — Advanced derivations or proofs (optional, collapsed by default)
4. **PredictionGate** — Student makes a prediction before seeing the simulation
5. **Simulation** — Interactive canvas or Recharts visualization
6. **ConceptCheck** — Multiple-choice or predict-reveal quiz (aim for 2-3 per content section)
7. **YourTurnPanel** — Modified scenario for the student to work through
8. **ModuleNavigation** — Links to previous/next sections

### ConceptCheck Density
Aim for 2-3 ConceptChecks per content page. One ConceptCheck per page is too sparse — students need multiple checkpoints to verify understanding. Use progressive hints (tier 1: nudge, tier 2: conceptual, tier 3: near-answer).

### PredictionGate
Always gate simulations behind a prediction question. Students learn more when they commit to an answer before seeing the result.

## Canvas Simulation Patterns

- Use `requestAnimationFrame` in `useEffect` with cleanup via `cancelAnimationFrame`
- Read state from refs (not closures) to satisfy React 19 `react-hooks/refs` rules
- Handle device pixel ratio (DPR) for crisp rendering on high-DPI displays
- Support both light and dark mode with theme-aware colors
- Pointer events (not mouse events) for built-in touch support on interactive canvases

## Path Alias

All modules support the `@/` path alias mapping to `src/`:
```ts
// Instead of: import { cn } from '../../../utils/cn'
import { cn } from '@/utils/cn'
```
Configured in both `tsconfig.app.json` (paths) and `vite.config.ts` (resolve.alias).

## Testing Strategy

- **Math utilities**: Edge-case tests for physics calculations (NaN, zero, infinity, boundary values)
- **Component tests**: React Testing Library for interactive components (ConceptCheck, PredictionGate)
- **Page integration tests**: Verify rendering of key page elements
- Run: `npm test` (Vitest)

## Accessibility Checklist

- ARIA labels on interactive canvas elements
- `role="status"` + `aria-label` on loading spinners
- Skip-to-content links in Layout
- Keyboard navigation for tabs and interactive elements
- `aria-live` regions for dynamic content updates

## Lessons Learned

1. **`as string ??` doesn't catch undefined env vars** — `import.meta.env.VITE_X as string` casts `undefined` to the string `"undefined"` (truthy), so `??` never triggers the fallback. Always use `||` for env var fallbacks.

2. **React 19 ref rules** — Never write to refs during render. Use `useEffect` for ref synchronization. The `react-hooks/refs` lint rule enforces this.

3. **React 19 self-referencing useCallback** — `requestAnimationFrame` loops must be structured in `useEffect`, not `useCallback`, to avoid self-referencing closure issues.

4. **Iron permeability is nonlinear** — When displaying magnetic circuit calculations with iron-core materials, always note when using a linearized `μᵣ` value and warn that real iron saturates.

5. **Ideal transformer equations mislead at k < 1** — Always show both the ideal (`V₂ = V₁·N₂/N₁`) and actual (`V₂ = kV₁·N₂/N₁`) secondary voltage when k < 1, with a warning about the discrepancy.

6. **Final Value Theorem requires stability check** — Before applying FVT to find steady-state values, verify that all poles of `sF(s)` are in the left half-plane. Note pole locations.

7. **PredictionGate resets need quantization** — When simulation parameters change continuously (sliders), use a log-bucket `resetKey` to prevent constant PredictionGate resets on every tiny slider movement.

8. **Service workers cache aggressively** — Always configure `skipWaiting: true` and use `lazyRetry()` for lazy-loaded chunks. Without these, users get stuck on stale versions.

9. **Progress ≠ page visits** — Track meaningful learning signals (concept check completions, prediction submissions) rather than just page visits for progress tracking.

10. **ConceptCheck density matters** — Aim for 2-3 per content section, not 1 per page. Sparse checks leave too much unverified understanding between checkpoints.

11. **LaTeX in JSX string attributes needs double backslashes** — `formula="\frac{a}{b}"` silently fails because `\f` becomes a form-feed in JS strings. Always use `\\frac`, `\\alpha`, `\\times`, etc. Detection regex: `formula="[^"]*[^\\]\\[a-zA-Z]`.

12. **Linters can corrupt LaTeX during edits** — ESLint auto-fix or string processing can turn `\\frac` into `\\\1rac`. After any automated edit to files with LaTeX, grep for `\\\1` or similar corruption. KaTeX failures are silent at build time — only visible at runtime.

13. **Wikimedia image URLs are fragile** — Thumbnail URLs require the correct MD5 hash prefix of the exact filename. A wrong hash = 404. Filenames are case-sensitive including extensions (`.JPG` ≠ `.jpg`). Use: `python3 -c "import hashlib; f='Filename.ext'; h=hashlib.md5(f.encode()).hexdigest(); print(f'thumb/{h[0]}/{h[:2]}/{f}/500px-{f}')"` to compute. Always verify the exact filename on the file's Wikimedia Commons page.

14. **FigureImage component pattern** — All 3 modules share a `FigureImage` component for educational images with click-to-enlarge modal, caption, attribution, source link, dark mode, and responsive sizing. Use `sm:max-w-md` or similar constraints.

15. **Dual deployment base paths** — When supporting both Vercel (`/`) and GitHub Pages (`/repo-name/`), use `process.env.GITHUB_ACTIONS ? '/repo-name/' : '/'` in `vite.config.ts`. PWA scope/start_url must also use the same `base`.

## File Structure Convention

Each module should maintain:
```
context/
├── current-sprint.md      — Current work in progress
├── decisions.md           — Architecture decision log
├── known-issues.md        — Known bugs and tech debt
└── project-reference.md   — Detailed technical reference
```
