# SESSION — EM-AC-Lab-Module1

## Last Updated
2026-04-09 (onboarding session)

## Completed This Session
- [x] Onboarded to my-claude-skills centralized skill system
- [x] Created `.claude/settings.json` with SessionStart sync hook (merged with existing npm install hook)
- [x] Deployed context-evaluator v2.0.0 + handover skills
- [x] Migrated refactor + frontend-design skills from `skills/` to `.claude/skill/`
- [x] Created `context.md` with stable project facts
- [x] Created `decisions-log.md` (condensed from 24 ADRs in `context/decisions.md`)
- [x] Migrated PATTERNS.md from `global/` to root (15 CODE entries + 1 ENV entry preserved)
- [x] Created root SESSION.md (was previously in `global/SESSION.md`)
- [x] Updated CLAUDE.md with Session Boundary Protocol + skill index
- [x] Made project self-contained (removed `../CLAUDE.md` references)

## Carried Over from Previous SESSION.md (2026-03-20)

### In Progress
- [ ] Add smoke tests for shared components
- [ ] Add render tests for each page
- [ ] Generate PWA icons (pwa-192x192.png, pwa-512x512.png)
- [ ] Consider using recharts for field strength vs distance graphs
- [ ] Manually verify all Wikimedia image URLs load correctly on live site

### Open Issues
- Canvas not responsive on window resize (low — navigate away/back as workaround)
- AI Tutor API key stored in localStorage plain text (acceptable for educational tool)
- KaTeX font warnings at build time (fonts work at runtime)
- Pre-existing lint warnings: MaxwellPage.tsx:85 `_t` unused, EMWavePage missing `isDarkMode` dep, LorentzPage:47 missing `handleReset` dep
- recharts installed but unused
- PWA icons missing (pwa-192x192.png, pwa-512x512.png)

## Next Session
1. Add Playwright E2E tests for critical user flows
2. Expand Vitest coverage (currently 71 tests)
3. Consider cleaning up old `skills/`, `global/` directories after confirming `.claude/skill/` works
4. Fix lint warnings in MaxwellPage, EMWavePage, LorentzPage

## Open Decisions
- When to remove legacy `skills/`, `global/`, and `.claude/hooks.json`
- Playwright test strategy: which simulations to prioritize

## Patterns Triggered
- None yet (first session with new system)
