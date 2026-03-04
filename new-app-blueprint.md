# Blueprint: Setting Up a New STEM Student App with Claude Code

## Context

Replicate the EM-AC-Lab-Module's UI/UX style, Claude Code configuration (skills, hooks, context management), and MCP/plugin setup for a new STEM learning app using the same React 19 + Vite + Tailwind v4 stack.

A scaffolded template project is available at: `../stem-lab-template/`

---

## 1. Project Scaffolding

### 1.1 Initialize with Vite

```bash
npm create vite@latest <your-app-name> -- --template react-ts
cd <your-app-name>
```

### 1.2 Install Core Dependencies

```bash
# Styling
npm i tailwindcss @tailwindcss/postcss clsx tailwind-merge

# State management
npm i zustand

# Icons
npm i lucide-react

# Routing
npm i react-router-dom

# Math rendering (STEM apps)
npm i katex

# Data visualization
npm i recharts

# PWA support
npm i -D vite-plugin-pwa

# AI tutor (optional — Google Gemini)
npm i @google/generative-ai
```

### 1.3 Install Dev Dependencies

```bash
# Testing
npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Linting (including accessibility)
npm i -D eslint-plugin-jsx-a11y
```

---

## 2. Claude Code Configuration

### 2.1 `CLAUDE.md` (root of repo)

Adapt for your domain. Key sections: Build & Dev commands, Architecture map, Conventions, Skills references, Context Files references, Do Not Touch list.

### 2.2 `.claude/hooks.json`

SessionStart hook runs `npm install --silent` automatically.

### 2.3 Context Directory (`context/`)

- **`current-sprint.md`** — Checklist of what's being built now
- **`decisions.md`** — Chronological architecture decision log (newest at top)
- **`known-issues.md`** — Active bugs and tech debt

---

## 3. Skills

### 3.1 Refactor Skill — Domain-agnostic, copy as-is

- `skills/refactor/SKILL.md`
- `.claude/commands/refactor.md`
- `.claude/skills/refactor.md`

5-phase workflow: Discovery → Analysis → Impact Assessment → Proposals → Execution.

### 3.2 Frontend Design Skill — Copy and adapt

- `skills/frontend-design/SKILL.md`

Adapt "Purpose" line and color palette name for your domain.

### 3.3 New Skills to Consider

- **Content Review** (`skills/content-review/SKILL.md`) — STEM accuracy checking
- **Accessibility Audit** (`skills/a11y-audit/SKILL.md`) — WAI-ARIA verification
- **Test Coverage** (`.claude/commands/test-coverage.md`) — Find untested components

---

## 4. MCP Servers & Plugins

### Available MCP Servers

| MCP Server | Best for |
|---|---|
| **Scholar Gateway** | Validating STEM content against peer-reviewed papers |
| **Microsoft Learn** | Azure/Microsoft docs |
| **Google Calendar** | Student scheduling features |
| **Gmail** | Notification/communication features |

### Additional MCP Servers to Consider

| MCP Server | Why |
|---|---|
| **GitHub MCP** | PR reviews, issue management |
| **Brave Search** | Research STEM topics |

### Built-in Skills

| Skill | Purpose |
|---|---|
| `/simplify` | Review changed code for quality |
| `/refactor` | Safe refactoring (custom skill) |

---

## 5. Shared Component Library

### Copy As-Is (Domain-Agnostic)

| Component | Path | What it does |
|---|---|---|
| `cn()` | `src/utils/cn.ts` | Tailwind class merging |
| `Tabs` | `src/components/common/Tabs.tsx` | ARIA tablist + arrow key nav |
| `CollapsibleSection` | `src/components/common/CollapsibleSection.tsx` | Progressive disclosure |
| `ConceptCheck` | `src/components/common/ConceptCheck.tsx` | Multiple-choice + predict-reveal |
| `ChallengeCard` | `src/components/common/ChallengeCard.tsx` | Guided challenges with auto-check |
| `ModuleNavigation` | `src/components/common/ModuleNavigation.tsx` | Previous/Next page links |
| `TableOfContents` | `src/components/common/TableOfContents.tsx` | Jump-to-section pill links |
| `MathWrapper` | `src/components/common/MathWrapper.tsx` | KaTeX with error fallback |
| `ErrorBoundary` | `src/components/layout/ErrorBoundary.tsx` | 3-level error recovery |
| `Layout` | `src/components/layout/Layout.tsx` | Responsive + skip-to-content + offline banner |
| `Sidebar` | `src/components/layout/Sidebar.tsx` | Progress + dark mode + nav |
| `useOnlineStatus` | `src/hooks/useOnlineStatus.ts` | PWA offline detection |
| `progressStore` | `src/store/progressStore.ts` | Zustand progress + theme stores |

### Copy and Adapt

| Component | What to change |
|---|---|
| `AiTutor` | System prompt for your domain |
| `Sidebar` | Module names, icons, route paths |
| `ModuleNavigation` | Route list |
| `progressStore` | Module path list |

---

## 6. Design System

### Color Tokens

| Token | Value | Purpose |
|---|---|---|
| Primary | `engineering-blue-500` | Brand accent |
| Success | `green-500/600` | Correct answers |
| Warning | `amber-500/600` | Hints, pending |
| Error | `red-500/600` | Wrong answers |
| Light bg | `slate-50` | Page background |
| Dark bg | `slate-900` | Dark mode background |

### UX Patterns

1. Progress tracking — Sidebar checkmarks
2. Dark mode — Zustand-persisted, class-based
3. Progressive disclosure — CollapsibleSection
4. Active recall — ConceptCheck at section ends
5. Guided challenges — ChallengeCard with auto-check
6. Offline support — PWA + banners
7. Accessibility — ARIA roles, keyboard nav, skip-to-content
8. Smooth transitions — fade-in, scroll-to-top

---

## 7. Verification

After setup, confirm:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` passes (tsc + vite)
- [ ] `npm run lint` passes (including a11y)
- [ ] `npm test` runs
- [ ] Dark mode toggle works
- [ ] Mobile responsive (hamburger menu)
- [ ] PWA installs
- [ ] Offline banner appears when disconnected
- [ ] `/refactor` command works in Claude Code
- [ ] CLAUDE.md loads on session start
- [ ] Progress persists across refreshes
