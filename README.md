# EM&AC Lab — Module 1: Electromagnetic Fundamentals

An interactive simulation suite designed for engineering students to visualize and experiment with the fundamental laws of electromagnetism. This is the first module in the **EM&AC Lab** three-module course at LUT University.

> **Built for** LUT University — Electromagnetics & Analog Circuits course

## Course Structure

This app is part of a three-module progressive learning sequence:

| Module | Focus | Description |
|---|---|---|
| **Module 1 (this app)** | Electromagnetic Fundamentals | Maxwell's equations, field laws, EM waves, magnetic circuits |
| [Module 2](https://em-ac-lab-module2.vercel.app/) | Circuit Analysis | Component physics, time/s-domain analysis, Laplace transforms |
| [Module 3](https://em-ac-lab-module3.vercel.app/) | Transmission Lines & Antennas | Coupled coils, transmission line theory, Smith chart, antennas |

**Module 1 → Module 2 bridge:** The Magnetic Circuits module introduces reluctance, mutual inductance, and transformer ratios — concepts that carry directly into Module 2's circuit analysis. **Module 1 → Module 3 bridge:** EM wave propagation and phasor concepts lay the groundwork for transmission line theory in Module 3.

## Features

- **10 Interactive Physics Modules** — Each with real-time HTML5 Canvas simulations, KaTeX equations, and guided controls
- **"Think it Through" Socratic Tutor** — AI chat (Google Gemini) that guides via questions, never gives direct answers
- **PredictionGate** — Students commit a prediction before accessing simulations (applied to Lorentz, Faraday, Lenz)
- **3-Tier Progressive Hints** — Conceptual → Procedural → Worked Example, revealed after wrong answers
- **Dark Mode** — Persisted theme toggle (shared `emac-theme` key across all three modules)
- **Progress Tracking** — Section-level tracking with prediction gates, concept checks, and hint usage
- **Quiz & Challenges** — 27 concept-check questions + 9 guided challenges across all modules
- **PWA** — Installable as a Progressive Web App with offline support
- **Accessible** — WAI-ARIA tabs, roving tabIndex, skip-to-content, aria-live regions

## Modules

| Route | Module | Visualization |
|---|---|---|
| `/maxwell` | Maxwell's Equations (integral + differential) | 4 animated equation cards |
| `/gauss` | Gauss's Law | Electric/Magnetic mode toggle |
| `/coulomb` | Coulomb's Law | Drag charges, field lines, force vectors |
| `/ampere` | Ampère's Law | Right-hand rule animation |
| `/lorentz` | Lorentz Force | Boris integrator cyclotron simulation |
| `/faraday` | Faraday's Law | Electromagnetic induction animation |
| `/lenz` | Lenz's Law | Axial dipole flux model, magnet + coil |
| `/em-wave` | EM Waves | 2D, 3D, Phasor Sync dual-canvas views |
| `/polarization` | Polarization | Lissajous + 3D wave, Stokes parameters |
| `/magnetic-circuits` | Magnetic Circuits | Toroid simulation, reluctance, bridge to Module 2 |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted) |
| Routing | react-router-dom v7 |
| Icons | lucide-react |
| Math | KaTeX |
| AI Tutor | Google Gemini API |
| PWA | vite-plugin-pwa |
| Testing | Vitest + Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### AI Tutor Setup

The AI Tutor uses Google Gemini. To enable it:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com)
2. Click the chat bubble icon in the bottom-right corner of the app
3. Enter your API key when prompted (stored in localStorage only)

## Project Structure

```
src/
├── components/
│   ├── common/     — Reusable components (Slider, MathWrapper, ConceptCheck, AiTutor, etc.)
│   └── layout/     — Layout shell + Sidebar
├── pages/          — One page per physics module (lazy-loaded)
├── constants/      — Physics colors, module definitions, quiz content
├── canvas/         — Canvas drawing helpers (arrows, fieldLines, grid)
├── hooks/          — useAnimationFrame, useCanvasSetup, useOnlineStatus
├── store/          — Zustand store (progress tracking + dark mode)
├── types/          — Shared TypeScript interfaces
└── utils/          — cn() utility (clsx + tailwind-merge)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint with jsx-a11y accessibility rules |
| `npm test` | Run Vitest test suite |
| `npm run preview` | Serve production build locally |

## Cross-Module Features

- **Unified dark mode** — Theme preference syncs across all three modules via shared `emac-theme` localStorage key
- **Cross-module navigation** — Links between modules via configurable environment variables (see `.env.example`)
- **Consistent pedagogy** — All modules use PredictionGate, ConceptCheck, CollapsibleSection, and "Think it Through" Socratic tutor

## Disclaimer

This educational application was architected and generated using AI models. While designed to align with rigorous engineering standards, it may contain errors or simplifications. **Always cross-reference** all formulas, diagrams, and explanations with your official course reference books.

## License

© 2026 [CA/EM&CA], LUT University. Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Provided for educational purposes within LUT University. Third-party materials used under Kopiosto License.
