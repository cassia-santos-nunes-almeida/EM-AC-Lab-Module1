# EM&AC Lab — Interactive Electromagnetic & AC Circuit Analysis Lab

An interactive simulation suite designed for engineering students to visualize and experiment with the fundamental laws of Electromagnetism and AC Circuits.

> **Built for** LUT University — Module 1: Electromagnetics

## Features

- **10 Interactive Physics Modules** — Each with real-time canvas simulations, equations (KaTeX), and guided controls
- **AI Tutor** — Built-in chat powered by Google Gemini for on-demand physics help
- **Dark Mode** — Persisted theme toggle with full dark mode support
- **Progress Tracking** — Sidebar checkmarks track completed modules (persisted to localStorage)
- **Quiz & Challenges** — 27 concept-check questions + 9 guided challenges across all modules
- **PWA** — Installable as a Progressive Web App with offline support
- **Accessible** — ARIA-compliant tabs, keyboard navigation, skip-to-content link

## Modules

| Module | Topic | Visualization |
|---|---|---|
| Maxwell's Equations | Four fundamental laws | 4 animated equation cards |
| Gauss's Law | Electric flux & surfaces | Electric/Magnetic mode toggle |
| Coulomb's Law | Electrostatic force | Drag charges, field lines, force vectors |
| Ampère's Law | Magnetic fields from currents | Right-hand rule animation |
| Lorentz Force | Charged particle motion | Cyclotron simulation |
| Faraday's Law | Electromagnetic induction | Changing flux animation |
| Lenz's Law | Opposition to flux change | Magnet + coil interaction |
| EM Waves | Wave propagation & AC | 2D, 3D, and V-I Phasor views |
| Polarization | Polarization states | Lissajous + 3D propagation |

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

## Disclaimer

This educational application was architected and generated using AI models. While designed to align with rigorous engineering standards, it may contain errors or simplifications. **Always cross-reference** all formulas, diagrams, and explanations with your official course reference books.

## License

© 2026 [CA/EM&CA], LUT University. Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Provided for educational purposes within LUT University. Third-party materials used under Kopiosto License.
