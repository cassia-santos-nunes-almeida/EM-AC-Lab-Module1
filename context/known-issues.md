# Known Issues & Tech Debt

## Issues

### Canvas Not Responsive on Window Resize
- **Severity**: Low
- **Description**: Canvas elements resize on initial render but don't auto-resize on window resize events. A ResizeObserver could be added to each canvas module.
- **Workaround**: Navigating away and back re-renders at correct size.

### AI Tutor API Key Storage
- **Severity**: Low
- **Description**: Gemini API key is stored in localStorage in plain text. Adequate for a local educational tool but not production-grade.
- **Mitigation**: Key never leaves the browser. Users are informed it's stored locally.

## Tech Debt

### Test Coverage
- No tests written yet. Vitest + testing-library are installed and configured.
- Priority: Add smoke tests for shared components, then page render tests.

### ConceptCheck/ChallengeCard Integration
- Quiz content exists in `src/constants/quizContent.ts` but is not yet rendered in each module page.
- Each page needs to import and render these at the bottom.

### recharts Not Yet Used
- recharts is installed but no charts are currently rendered. Could be used for:
  - Frequency response plots
  - Field strength vs distance graphs
  - Power factor visualization

### PWA Icons
- PWA manifest references `pwa-192x192.png` and `pwa-512x512.png` but these don't exist in `/public/`.
- Need to generate app icons.
