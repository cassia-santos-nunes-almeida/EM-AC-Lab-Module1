/** Point charge for Coulomb's Law simulations */
export interface Charge {
  x: number;
  y: number;
  q: number;
  id: number;
}

/** Equation entry for EquationBox */
export interface Equation {
  label: string;
  math: string;
  color?: string;
}

/** Quiz question for ConceptCheck component */
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Challenge for ChallengeCard component */
export interface Challenge {
  title: string;
  description: string;
  instructions: string[];
  checkFn?: () => boolean;
  hint?: string;
}

/** EM Wave simulation state */
export interface EMWaveState {
  frequency: number;
  amplitude: number;
  speed: number;
  vAmplitude: number;
  iAmplitude: number;
  vPhase: number;
  iPhase: number;
  isPlaying: boolean;
  refractiveIndex: number;
}

/** Chat message for AI Tutor */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
