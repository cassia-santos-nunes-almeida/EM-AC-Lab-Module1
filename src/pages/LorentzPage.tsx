import { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';

interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
}

export default function LorentzPage() {
  const { isDarkMode } = useProgressStore();
  const col = isDarkMode ? COLORS_DARK : COLORS;

  const [velocity, setVelocity] = useState(50);
  const [bField, setBField] = useState(50);
  const [charge, setCharge] = useState(1);
  const [mass, setMass] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsRef = useRef<ParticleState | null>(null);
  const animationRef = useRef(0);

  const handleReset = () => {
    if (canvasRef.current) {
      physicsRef.current = {
        x: velocity >= 0 ? 50 : canvasRef.current.width - 50,
        y: canvasRef.current.height / 2,
        vx: velocity * 2.5,
        vy: 0,
        trail: [],
      };
    }
  };

  useEffect(() => {
    if (!physicsRef.current) handleReset();
  }, []);

  const drawVec = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number,
    color: string,
    label: string
  ) => {
    const mag = Math.hypot(vx, vy);
    if (mag < 4) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + vx, y + vy);
    ctx.stroke();
    const angle = Math.atan2(vy, vx),
      headLen = 8;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x + vx, y + vy);
    ctx.lineTo(x + vx - headLen * Math.cos(angle - Math.PI / 6), y + vy - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x + vx - headLen * Math.cos(angle + Math.PI / 6), y + vy - headLen * Math.sin(angle + Math.PI / 6));
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(label, x + vx + 8, y + vy + 8);
  };

  useEffect(() => {
    const loop = () => {
      const cvs = canvasRef.current;
      if (cvs && physicsRef.current) {
        const ctx = cvs.getContext('2d')!;
        cvs.width = cvs.parentElement!.clientWidth;
        cvs.height = cvs.parentElement!.clientHeight;
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        if (isDarkMode) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, cvs.width, cvs.height);
        }

        // B-field symbols
        const symbol = bField > 0 ? '⊗' : bField < 0 ? '⊙' : '·';
        ctx.fillStyle = col.B_FIELD;
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.min(Math.abs(bField) / 30, 0.3);
        for (let x = 25; x < cvs.width; x += 50)
          for (let y = 25; y < cvs.height; y += 50) ctx.fillText(symbol, x, y);
        ctx.globalAlpha = 1;

        ctx.textAlign = 'right';
        ctx.fillStyle = col.B_FIELD;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(
          `External B: ${bField > 0 ? 'Into Page' : bField < 0 ? 'Out of Page' : 'Off'}`,
          cvs.width - 20,
          30
        );

        // Boris integrator — symplectic, conserves energy exactly for B-only fields
        // Reference: Birdsall & Langdon, "Plasma Physics via Computer Simulation"
        const p = physicsRef.current;
        const dt = 0.016;
        const Bz = bField / 20; // effective B-field (z-component, into screen when positive)
        const qOverM = charge / mass;

        // t-vector: t = (q*B*dt) / (2*m), only z-component for uniform B along z
        const t = qOverM * Bz * dt * 0.5;
        const s = (2 * t) / (1 + t * t);

        // v⁻ = v^n (no E-field, so no half-acceleration step)
        const vmx = p.vx;
        const vmy = p.vy;

        // v' = v⁻ + (v⁻ × t̂)  where t̂ = (0,0,t)
        // (vx, vy, 0) × (0, 0, t) = (vy*t, -vx*t, 0)
        const vpx = vmx + vmy * t;
        const vpy = vmy - vmx * t;

        // v⁺ = v⁻ + (v' × ŝ)  where ŝ = (0,0,s)
        // (vpx, vpy, 0) × (0, 0, s) = (vpy*s, -vpx*s, 0)
        p.vx = vmx + vpy * s;
        p.vy = vmy - vpx * s;

        // Position update
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (Math.random() > 0.5) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 150) p.trail.shift();
        }

        // Trail
        ctx.beginPath();
        ctx.strokeStyle = charge > 0 ? '#fca5a5' : '#93c5fd';
        ctx.lineWidth = 2;
        p.trail.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
        ctx.stroke();

        // Particle
        ctx.beginPath();
        ctx.fillStyle = charge > 0 ? col.E_FIELD : col.B_FIELD;
        ctx.arc(p.x, p.y, 6 + mass * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(charge > 0 ? `+${charge}` : `${charge}`, p.x, p.y + 1);

        // Vectors
        drawVec(ctx, p.x, p.y, p.vx * 0.3, p.vy * 0.3, '#10b981', 'v');
        const Fx = charge * p.vy * (bField / 20);
        const Fy = charge * -p.vx * (bField / 20);
        drawVec(ctx, p.x, p.y, Fx * 0.4, Fy * 0.4, col.CURRENT, 'F');
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationRef.current);
  }, [velocity, bField, charge, mass, isDarkMode, col]);

  return (
    <ModuleLayout
      moduleId="lorentz"
      simulation={
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>
          <ControlPanel title="Particle Controls">
            <Slider label={`Charge q = ${charge} (arb. units)`} value={charge} min={-5} max={5} onChange={setCharge} color="bg-red-600" />
            <Slider label={`Mass m = ${mass} (arb. units)`} value={mass} min={0.5} max={5} step={0.5} onChange={setMass} color="bg-slate-500" />
            <Slider label={`Velocity v = ${velocity} (arb.)`} value={velocity} min={-100} max={100} onChange={setVelocity} color="bg-emerald-600" />
            <Slider label={`B-field = ${(bField / 20).toFixed(1)} (arb.)`} value={bField} min={-100} max={100} onChange={setBField} color="bg-blue-600" />
            <button
              onClick={handleReset}
              className="w-full mt-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-bold text-slate-700 dark:text-slate-200 flex justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Move size={16} /> Respawn
            </button>
            <HintBox>
              Increase the Mass (<MathWrapper latex="m" />) to see the radius expand. Heavier particles are
              harder to deflect!
            </HintBox>
          </ControlPanel>
        </div>
      }
      theory={
        <div className="space-y-6">
          <EquationBox
            title="Lorentz Force"
            equations={[
              { label: 'Force', math: '\\vec{F} = q(\\vec{v} \\times \\vec{B})', color: 'text-amber-600 dark:text-amber-400' },
              { label: 'Radius', math: 'r = \\frac{mv}{|q|B}', color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Computed r', math: charge !== 0 && bField !== 0
                ? `r = \\frac{${mass} \\times ${Math.abs(velocity)}}{${Math.abs(charge)} \\times ${Math.abs(bField / 20).toFixed(1)}} = ${(mass * Math.abs(velocity) / (Math.abs(charge) * Math.abs(bField / 20 || 1))).toFixed(1)} \\text{ (arb.)}`
                : '\\text{—}' },
            ]}
          />
          <TheoryGuide>
            <p>
              <strong>Right Hand Rule:</strong> Force is perpendicular to both velocity and B-field.
            </p>
            <p>
              <strong>Cyclotron Radius:</strong> <MathWrapper latex="r = mv / qB" />. Faster/heavier particles
              orbit wider. Stronger fields tighten the orbit.
            </p>
          </TheoryGuide>
        </div>
      }
    />
  );
}
