# CLAUDE.md — Global Rules

Cássia Almeida · LUT University · School of Energy Systems
This file is always active. Skills reference it — they do not repeat it.

## 1. Project Identity

**Owner:** Cássia Almeida (she/her), Associate Professor, LUT University (Finland)
**Languages:** English (primary for technical work), Finnish (institutional), Portuguese (personal)
**Expertise level:** Senior — skip fundamentals unless asked. Precision over completeness.
**Role context:** Engineering educator building AI-integrated teaching tools, assessment systems, and interactive web applications for electromagnetic theory and circuit analysis students.

**Active courses:**
- BL30A0350 — Electromagnetism and Circuit Analysis (EM&AC)
- LES10A020 — Engineering Physics (EP, co-taught with Mikko Äijälä and Ayesha Sadiqa)

**Reference textbooks:**
- Ulaby — Fundamentals of Applied Electromagnetics
- Ida — Engineering Electromagnetics
- Nilsson & Riedel — Electric Circuits

**Notation conflict (known):** Cross-sectional area: A (Nilsson) vs. S (Ulaby). Flux linkage: λ (Nilsson) vs. Λ (Ulaby). Always use the convention of the course being worked on — ask if unclear.

## 2. Behavior Defaults

- **Architecture-first:** explain structure before writing code.
- **Confirm intent** before writing code for any non-trivial task.
- **Flag risks**, edge cases, and conflicts proactively — do not wait to be asked.
- **Only modify explicitly requested parts.** Leave everything else untouched.
- **When multiple options exist**, present them with tradeoffs — let Cássia decide.
- **Never add new ideas** to messages or documents. Never remove existing ones. Only adjust what is asked.

**Tone:** Professional, direct, warm, natural. No flattery. No filler.

**Environment:**
- OS: Windows / PowerShell
- Python: use `python` — not `python3` (not on PATH)
- Claude Code active — use session teleport when needed; re-authenticate with `/login` if token expired

## 3. Self-Verification (applies to all tasks)

Before returning any output:

1. **Goal analysis** — State the explicit and implicit goals. What does success look like?
2. **Assumption audit** — List every inference made that was not directly stated in the input. For each: what was the basis, and what would change if the assumption is wrong?
3. **Gap identification** — What is missing, ambiguous, or likely to fall short?
4. **End-to-end self-test** — Test output against all stated goals and identified risks. Iterate until requirements are met and output is optimized. Do not return control until this is complete.
5. **Pattern check** — Before finalizing, check PATTERNS.md. If the output would trigger a known pattern, apply the documented fix automatically.

## 4. Session Open Protocol

At the start of every session, before any task work:

1. Read `CLAUDE.md` (this file) — confirm active constraints and project identity.
2. Read `PATTERNS.md` — load all accumulated corrections and rules.
   Treat every entry as a hard constraint, not a suggestion.
3. Read `SESSION.md` if present — resume from last known state.
4. Confirm readiness: state which skills are relevant to today's work
   and flag any conflict between loaded files.

Do not begin task work until these steps are confirmed.

To trigger this protocol, say: `open session` or `load context`.

## 5. Session Close Protocol

At the end of every session, before returning control:

1. Review the full session for recurring corrections or repeated assumptions —
   anything said more than once, or any mistake that appeared in more than one place.
2. For each pattern found:
   - Produce a concrete rule in plain language.
   - Add it to `PATTERNS.md` under the relevant category.
   - State: "Pattern detected: [X]. Rule added: [Y]."
3. Write `SESSION.md`:
   - What was completed (with file names and locations).
   - What is in progress (enough context to resume cold).
   - Open decisions or blockers.
   - Which PATTERNS.md entries were triggered today.
4. If any SKILL.md should be updated based on today's work,
   state the proposed change explicitly and ask for confirmation before writing.

To trigger this protocol, say: `close session` or `wrap up`.

## 6. Cross-Skill Rules

These apply to all skills. Skills do not repeat them.

**Writing and communication**
- Never use: "flagging", "thanks for flagging" → use "thanks for the heads-up" or "thanks for pointing that out"
- Email sign-off: "Best regards," — never "Best,"
- Sign as: "Cássia" — never full name in sign-off
- Anti-AI banned words: "crucial", "vital", "leverage", "delve", "navigate", "landscape", "groundbreaking", "game-changer", "it's worth noting", "at the end of the day", "in conclusion"
- See `message-coach/SKILL.md` for full Anti-AI Rules checklist

**Code**
- Confirm intent before writing non-trivial code
- Explain architectural choices when making decisions that affect structure
- Flag performance and edge cases proactively

**Files and structure**
- Check PATTERNS.md before starting any task in a known domain
- Session state lives in SESSION.md — write it at close, read it at open
- Never duplicate content between CLAUDE.md and a SKILL.md — reference by name

## 7. Skill Index

| Skill | Trigger | File |
|---|---|---|
| lut-lecture | lecture, slides, EP, EM&AC, new session, review deck | `skills/user/lut-lecture/SKILL.md` |
| stack-xml-generator | STACK, Moodle, PRT, XML, Maxima | `skills/user/stack-xml-generator/SKILL.md` |
| message-coach | email, message, Teams, WhatsApp, improve this | `skills/user/message-coach/SKILL.md` |
| circuitikz-circuit-diagrams | circuit diagram, draw circuit, CircuiTikZ, LaTeX circuit | `skills/user/circuitikz-circuit-diagrams/SKILL.md` |

## 8. Course Architecture — EM&AC Lab

| Module | Title | Repo | Live URL |
|--------|-------|------|----------|
| M1 | Electromagnetic Fundamentals | `EM-AC-Lab-Module1` | https://em-ac-lab-module1.vercel.app |
| M2 | Circuit Analysis | `EM-AC-Lab-Module2` | https://em-ac-lab-module2.vercel.app |
| M3 | Transmission Lines & Antennas | `EM-AC-Lab-Module3` | https://em-ac-lab-module3.vercel.app |

**Progression:** M1 → M2 → M3. Each module builds on concepts from the previous one. Content bridges connect related topics across modules.

### Shared Tech Stack

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

### Cross-Module Integration

- **Dark mode**: Shared `emac-theme` localStorage key — toggling in any module affects all three
- **Navigation**: `src/constants/modules.ts` provides `MODULE_URLS` object with URLs to all three modules. Reads `VITE_MODULE*_URL` env vars with `||` fallback to hardcoded Vercel URLs.
- **Sidebar navigation**: Each module's sidebar includes a "Course Modules" section linking to all three modules.
- **Content bridges**: Pages reference related content in other modules with explanatory context.

## 9. Shared Conventions

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

### PWA Configuration
All modules use `vite-plugin-pwa` with:
```
skipWaiting: true
clientsClaim: true
cleanupOutdatedCaches: true
registerType: 'autoUpdate'
```

### Path Alias
All modules support the `@/` path alias mapping to `src/`:
```ts
import { cn } from '@/utils/cn'
```
Configured in both `tsconfig.app.json` (paths) and `vite.config.ts` (resolve.alias).

## 10. Pedagogical Patterns

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

### Canvas Simulation Patterns
- Use `requestAnimationFrame` in `useEffect` with cleanup via `cancelAnimationFrame`
- Read state from refs (not closures) to satisfy React 19 `react-hooks/refs` rules
- Handle device pixel ratio (DPR) for crisp rendering on high-DPI displays
- Support both light and dark mode with theme-aware colors
- Pointer events (not mouse events) for built-in touch support on interactive canvases

## 11. Testing & Accessibility

### Testing Strategy
- **Math utilities**: Edge-case tests for physics calculations (NaN, zero, infinity, boundary values)
- **Component tests**: React Testing Library for interactive components (ConceptCheck, PredictionGate)
- **Page integration tests**: Verify rendering of key page elements
- Run: `npm test` (Vitest)

### Accessibility Checklist
- ARIA labels on interactive canvas elements
- `role="status"` + `aria-label` on loading spinners
- Skip-to-content links in Layout
- Keyboard navigation for tabs and interactive elements
- `aria-live` regions for dynamic content updates
