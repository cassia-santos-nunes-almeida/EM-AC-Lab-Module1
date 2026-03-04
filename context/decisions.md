# Architecture Decisions

## ADR-001: React 19 + Vite over CRA/Next.js
**Decision**: Use React 19 with Vite for fast HMR and minimal config.
**Rationale**: This is a client-side SPA with heavy canvas animations. No SSR needed. Vite provides the fastest dev experience for this use case.

## ADR-002: KaTeX over custom parseLatex
**Decision**: Replace the custom `parseLatex()` function with KaTeX library.
**Rationale**: The custom parser only handled ~20 LaTeX symbols and basic fractions/subscripts. KaTeX handles the full LaTeX math spec with proper rendering, accessibility, and error handling.

## ADR-003: lucide-react over custom SVG Icon component
**Decision**: Replace the custom `Icon` component (18 inline SVGs) with lucide-react.
**Rationale**: The original app already mapped to lucide icon names (Activity, BookOpen, Zap, etc.). Direct drop-in replacement eliminates ~50 lines of SVG code and provides 1000+ additional icons.

## ADR-004: Zustand over React Context
**Decision**: Use Zustand for global state (progress tracking, dark mode, sidebar).
**Rationale**: Simpler API than Context + useReducer, built-in localStorage persistence via middleware, no provider wrapping needed. Blueprint spec.

## ADR-005: react-router-dom over tab state
**Decision**: Use URL-based routing instead of a `useState` tab switcher.
**Rationale**: Proper URLs enable bookmarking, browser back/forward, lazy loading per route, and align with the blueprint's ModuleNavigation pattern.

## ADR-006: Tailwind CSS v4 with @theme tokens
**Decision**: Use Tailwind v4's new `@theme` directive for custom color tokens.
**Rationale**: Physics domain colors (E_FIELD red, B_FIELD blue, CURRENT orange, POWER purple) and engineering-blue brand color are defined as theme tokens, making them available as utility classes throughout the app.

## ADR-007: Client-side Gemini API for AI Tutor
**Decision**: Call Gemini API directly from the browser with a user-provided API key.
**Rationale**: No backend server needed. API key is stored in localStorage only. Students can get free API keys from AI Studio. This keeps the app fully static/deployable as a PWA.

## ADR-008: Canvas rendering preserved as-is
**Decision**: Keep all canvas drawing logic from the original app, converted to TypeScript but functionally identical.
**Rationale**: The physics simulations are the core value of the app. Rewriting them risks introducing errors. The canvas code works correctly and performs well.
