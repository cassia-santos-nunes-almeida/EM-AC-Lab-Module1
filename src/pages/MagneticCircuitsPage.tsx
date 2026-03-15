import { useState, useRef, useEffect } from 'react';
import { useCanvasTouch } from '@/hooks/useCanvasTouch';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useThemeStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { MODULE_URLS } from '@/constants/modules';
import { ModuleLayout } from '@/components/common/ModuleLayout';
import { RealWorldHook } from '@/components/common/RealWorldHook';
import { PredictionGate } from '@/components/common/PredictionGate';
import { ArrowRight } from 'lucide-react';

const MU_0 = 4 * Math.PI * 1e-7;

/** Core material presets with relative permeability. */
const CORE_MATERIALS = [
  { label: 'Air', muR: 1 },
  { label: 'Iron', muR: 5000 },
  { label: 'Ferrite', muR: 1000 },
] as const;

export default function MagneticCircuitsPage() {
  const isDarkMode = useThemeStore((s) => s.theme === 'dark');
  const col = isDarkMode ? COLORS_DARK : COLORS;

  // Toroid simulation controls
  const [materialIndex, setMaterialIndex] = useState(1); // default: Iron
  const [turns, setTurns] = useState(200);
  const [current, setCurrent] = useState(1);
  const [gapPercent, setGapPercent] = useState(0); // 0 to 20

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  useCanvasTouch(canvasRef);

  const material = CORE_MATERIALS[materialIndex];
  const muR = material.muR;

  // Toroid geometry (physical)
  const meanRadius = 0.05; // 5 cm
  const coreArea = 0.001;  // 10 cm² = 0.001 m²
  const pathLength = 2 * Math.PI * meanRadius;
  const gapLength = (gapPercent / 100) * pathLength;
  const coreLength = pathLength - gapLength;

  // Reluctances
  const reluctanceCore = coreLength / (MU_0 * muR * coreArea);
  const reluctanceGap = gapLength > 0 ? gapLength / (MU_0 * coreArea) : 0;
  const reluctanceTotal = reluctanceCore + reluctanceGap;

  // Computed outputs
  const mmf = turns * current;
  const flux = mmf / reluctanceTotal;
  const B = flux / coreArea;
  // H differs by section: B = μ₀μᵣH_core = μ₀H_gap
  const hCore = B / (MU_0 * muR);
  const hGap = gapLength > 0 ? B / MU_0 : 0;
  const inductance = (turns * turns) / reluctanceTotal;

  const formatSI = (val: number, unit: string): string => {
    if (Math.abs(val) >= 1) return `${val.toFixed(3)} ${unit}`;
    if (Math.abs(val) >= 1e-3) return `${(val * 1e3).toFixed(2)} m${unit}`;
    if (Math.abs(val) >= 1e-6) return `${(val * 1e6).toFixed(2)} μ${unit}`;
    return `${(val * 1e9).toFixed(1)} n${unit}`;
  };

  // Ref for derived values consumed in the canvas draw loop
  const derivedRef = useRef({ B, hCore, hGap, gapLength, flux, inductance, col, muR, material });
  derivedRef.current = { B, hCore, hGap, gapLength, flux, inductance, col, muR, material };

  // Canvas rendering — only restart on actual state changes
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
      const w = canvas.width, h = canvas.height;
      const d = derivedRef.current;
      ctx.clearRect(0, 0, w, h);
      if (isDarkMode) { ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h); }

      const cx = w / 2, cy = h / 2;
      const outerR = Math.min(w, h) * 0.35;
      const innerR = outerR * 0.65;
      const midR = (outerR + innerR) / 2;
      const coreWidth = outerR - innerR;

      // Gap angle in radians
      const gapAngleRad = (gapPercent / 100) * 2 * Math.PI;
      const gapStart = -gapAngleRad / 2;
      const gapEnd = gapAngleRad / 2;

      // Draw core (toroid cross-section as annular ring)
      ctx.beginPath();
      if (gapPercent > 0.5) {
        ctx.arc(cx, cy, outerR, gapEnd, 2 * Math.PI + gapStart);
        ctx.arc(cx, cy, innerR, 2 * Math.PI + gapStart, gapEnd, true);
      } else {
        ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
        ctx.arc(cx, cy, innerR, 2 * Math.PI, 0, true);
      }
      ctx.closePath();
      ctx.fillStyle = materialIndex === 0
        ? (isDarkMode ? '#1e293b' : '#f1f5f9')
        : materialIndex === 1
          ? (isDarkMode ? '#334155' : '#94a3b8')
          : (isDarkMode ? '#44403c' : '#a8a29e');
      ctx.fill();
      ctx.strokeStyle = d.col.TEXT_MAIN;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw gap lines
      if (gapPercent > 0.5) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        for (const angle of [gapStart, gapEnd]) {
          ctx.beginPath();
          ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
          ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
          ctx.stroke();
        }
        // Gap label
        ctx.fillStyle = '#f59e0b';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Gap', cx + (outerR + 15) * Math.cos(0), cy);
      }

      // Draw field lines inside core
      if (Math.abs(current) > 0.01) {
        const numLines = 5;
        const fieldAlpha = Math.min(1, Math.abs(d.B) / 0.5);
        ctx.globalAlpha = 0.3 + 0.5 * fieldAlpha;
        for (let i = 0; i < numLines; i++) {
          const r = innerR + ((i + 0.5) / numLines) * coreWidth;
          ctx.beginPath();
          ctx.strokeStyle = d.col.B_FIELD;
          ctx.lineWidth = 1 + fieldAlpha;
          ctx.setLineDash([4, 4]);
          if (gapPercent > 0.5) {
            ctx.arc(cx, cy, r, gapEnd + 0.05, 2 * Math.PI + gapStart - 0.05);
          } else {
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Arrows on field lines to show direction
        const arrowR = midR;
        const arrowAngles = [Math.PI * 0.5, Math.PI, Math.PI * 1.5];
        for (const a of arrowAngles) {
          if (gapPercent > 0.5 && Math.abs(a) < gapAngleRad / 2 + 0.1) continue;
          const ax = cx + arrowR * Math.cos(a);
          const ay = cy + arrowR * Math.sin(a);
          const dir = current >= 0 ? a + Math.PI / 2 : a - Math.PI / 2;
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(dir);
          ctx.fillStyle = d.col.B_FIELD;
          ctx.beginPath();
          ctx.moveTo(6, 0);
          ctx.lineTo(-4, -4);
          ctx.lineTo(-4, 4);
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw coil turns (small marks on outer ring)
      const turnCount = Math.min(turns, 40); // visual limit
      ctx.strokeStyle = d.col.CURRENT;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < turnCount; i++) {
        const angle = gapEnd + 0.1 + (i / turnCount) * (2 * Math.PI - gapAngleRad - 0.2);
        const x1 = cx + (outerR - 2) * Math.cos(angle);
        const y1 = cy + (outerR - 2) * Math.sin(angle);
        const x2 = cx + (outerR + 8) * Math.cos(angle);
        const y2 = cy + (outerR + 8) * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Labels
      ctx.fillStyle = d.col.TEXT_MAIN;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.material.label} core (μᵣ = ${d.muR.toLocaleString()})`, cx, cy - outerR - 20);

      // Output readouts
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      const readoutX = 15, readoutY = h - 110;
      const lines: { text: string; color: string }[] = [
        { text: `H_core = ${formatSI(d.hCore, 'A/m')}`, color: d.col.B_FIELD },
        ...(d.gapLength > 0 ? [{ text: `H_gap  = ${formatSI(d.hGap, 'A/m')}`, color: '#f59e0b' }] : []),
        { text: `B = ${formatSI(d.B, 'T')}`, color: d.col.B_FIELD },
        { text: `Φ = ${formatSI(d.flux, 'Wb')}`, color: isDarkMode ? '#94a3b8' : '#475569' },
        { text: `L = ${formatSI(d.inductance, 'H')}`, color: isDarkMode ? '#94a3b8' : '#475569' },
      ];
      ctx.fillStyle = isDarkMode ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)';
      ctx.fillRect(readoutX - 5, readoutY - 14, 200, lines.length * 18 + 10);
      ctx.strokeStyle = isDarkMode ? '#334155' : '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(readoutX - 5, readoutY - 14, 200, lines.length * 18 + 10);
      lines.forEach((line, i) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, readoutX, readoutY + i * 18);
      });

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [current, turns, gapPercent, materialIndex, isDarkMode]);

  return (
    <ModuleLayout
      moduleId="magnetic-circuits"
      simulation={
        <>
        <RealWorldHook text="Every transformer, motor, and inductor in your electronics relies on magnetic circuits. The same Kirchhoff-style analysis you use for electric circuits applies — just with flux instead of current and MMF instead of voltage." />
        <PredictionGate
          gateId="magnetic-circuits-air-gap"
          question="If you insert an air gap into an iron core toroid, does the inductance increase, decrease, or stay the same?"
          options={[
            { label: 'Increases', correct: false, explanation: 'An air gap actually increases total reluctance because air has μᵣ = 1, far lower than iron. Higher reluctance means lower inductance (L = N²/ℛ).' },
            { label: 'Decreases', correct: true, explanation: 'The air gap adds significant reluctance (ℛ_gap = l_gap/(μ₀A)) to the circuit. Since L = N²/ℛ_total and ℛ_total increases, inductance decreases. Even a small gap can dramatically reduce L.' },
            { label: 'Stays the same', correct: false, explanation: 'The gap changes the total reluctance of the magnetic circuit, which directly affects the inductance. L = N²/ℛ depends on the total path reluctance.' },
          ]}
        >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                role="img"
                aria-label="Toroid magnetic circuit simulation showing flux lines and air gap"
              />
            </div>
          </div>
          <ControlPanel title="Toroid Parameters">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Core Material</label>
              <div className="flex gap-2">
                {CORE_MATERIALS.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => setMaterialIndex(i)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      materialIndex === i
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">μᵣ = {muR.toLocaleString()}</p>
            </div>
            <Slider label="Turns N" value={turns} min={10} max={500} onChange={setTurns} />
            <Slider label="Current I (A)" value={current} min={0} max={10} step={0.1} onChange={setCurrent} />
            <Slider label={`Air Gap (${gapPercent}%)`} value={gapPercent} min={0} max={20} onChange={setGapPercent} />
            <HintBox>
              Even a tiny air gap drastically reduces inductance because μ₀ ≪ μ_iron.
            </HintBox>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
              <strong>Note:</strong> μᵣ = 5,000 (Iron) is a typical linearized value. Real iron is nonlinear — μᵣ varies from ~100 (near saturation) to ~10,000 (low flux density). This simulation neglects B-H curve nonlinearity and fringing at the air gap (flux is assumed confined to the core cross-section A).
            </p>
          </ControlPanel>
        </div>
        </PredictionGate>
        </>
      }
      theory={
        <div className="space-y-6">
          {/* Subsection 1: Flux and Reluctance */}
          <EquationBox
            title="Magnetic Flux & Reluctance"
            equations={[
              { label: 'Flux density', math: 'B = \\mu H = \\mu_0 \\mu_r H' },
              { label: 'Reluctance', math: '\\mathcal{R} = \\frac{l}{\\mu A}', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: "Hopkinson's Law", math: '\\text{MMF} = \\Phi \\cdot \\mathcal{R} \\quad (\\text{analog of } V = IR)' },
              { label: 'Inductance', math: 'L = \\frac{N^2}{\\mathcal{R}}' },
            ]}
          />
          <TheoryGuide>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <strong>Magnetic flux Φ</strong> is the total field through a cross-section: <MathWrapper formula="\Phi = BA" />.
                It is analogous to current in electric circuits.
              </li>
              <li>
                <strong>Field strength H</strong> is the magnetizing force: <MathWrapper formula="H = NI / l" />.
                It is analogous to voltage (EMF).
              </li>
              <li>
                <strong>Reluctance <MathWrapper formula="\mathcal{R}" /></strong> opposes flux just as resistance opposes current.
                For a uniform path: <MathWrapper formula="\mathcal{R} = l / (\mu A)" />.
              </li>
              <li>
                <strong>Hopkinson's law</strong> (<MathWrapper formula="\text{MMF} = \Phi \mathcal{R}" />) is the magnetic version of Ohm's law.
                Series reluctances add, just like series resistors.
              </li>
            </ul>
          </TheoryGuide>

          {/* Subsection 3: Mutual Inductance */}
          <EquationBox
            title="Mutual Inductance"
            equations={[
              { label: 'Coupling coefficient', math: 'k = \\frac{M}{\\sqrt{L_1 L_2}}, \\quad 0 \\le k \\le 1' },
              { label: 'Ideal transformer', math: '\\frac{V_2}{V_1} = \\frac{N_2}{N_1}', color: 'text-amber-600 dark:text-amber-400' },
            ]}
          />
          <TheoryGuide>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                Two coils sharing magnetic flux are <strong>mutually coupled</strong>.
                The coupling coefficient <MathWrapper formula="k" /> ranges from 0 (no coupling) to 1 (ideal, all flux shared).
              </li>
              <li>
                An <strong>ideal transformer</strong> has <MathWrapper formula="k = 1" /> and transforms voltage by the turns ratio: <MathWrapper formula="V_2/V_1 = N_2/N_1" />.
              </li>
              <li>
                <strong>Worked example:</strong> A transformer has <MathWrapper formula="N_1 = 100" /> and <MathWrapper formula="N_2 = 500" /> turns.
                If <MathWrapper formula="V_1 = 12\text{ V}" />, then <MathWrapper formula="V_2 = 12 \times 500/100 = 60\text{ V}" />.
              </li>
              <li className="text-xs text-slate-500 dark:text-slate-400 italic">
                Note: Full circuit treatment (reflected impedance, dot convention) is covered in Module 3.
              </li>
            </ul>
          </TheoryGuide>

          {/* Subsection 4: Bridge to Module 2 */}
          <div className="p-5 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20">
            <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
              Every inductor in Module 2 — every RL circuit, every RLC transient — has a physical origin in what you just learned.
              The <MathWrapper formula="L" /> in your circuit equations is the inductance of a real coil, determined by its geometry
              and core material. The math continues in Module 2. The physics started here.
            </p>
            <a
              href={MODULE_URLS.module2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Continue to Module 2 <ArrowRight size={16} />
            </a>
          </div>
        </div>
      }
    />
  );
}
