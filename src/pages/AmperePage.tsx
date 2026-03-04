import { useState, useRef, useEffect } from 'react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';

export default function AmperePage() {
  const { isDarkMode } = useProgressStore();
  const col = isDarkMode ? COLORS_DARK : COLORS;

  const [current, setCurrent] = useState(50); // Amperes
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef(0);

  const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.lineTo(5, 0);
    ctx.lineTo(-5, 3);
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight;
      const cx = canvas.width / 2,
        cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isDarkMode) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      timeRef.current += 0.5 * (current / 50);

      // Wire cross-section
      ctx.fillStyle = col.GRID;
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = col.CURRENT;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Current symbol
      ctx.fillStyle = col.CURRENT;
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = current > 0 ? 'In' : current < 0 ? 'Out' : '0';
      ctx.fillText(current > 0 ? '⊗' : current < 0 ? '⊙' : '○', cx, cy + 2);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = col.TEXT_MAIN;
      ctx.fillText(`I = ${current} A (${label})`, cx, cy - 35);

      // Scale: 1 cm per 40px
      const SCALE_M_PER_PX = 0.01 / 40;
      const MU_0 = 4 * Math.PI * 1e-7; // T·m/A

      // B-field circles with arrows — line width ∝ 1/r to show field decay
      if (Math.abs(current) > 2) {
        const maxR = Math.min(canvas.width, canvas.height) / 2 - 20;
        const radii = [40, 70, 110, 160, 220].filter(r => r < maxR);

        for (const r of radii) {
          // Line opacity and width proportional to 1/r (B ∝ 1/r)
          const relStrength = 40 / r; // relative to closest ring
          ctx.beginPath();
          ctx.strokeStyle = col.B_FIELD;
          ctx.globalAlpha = 0.15 + 0.45 * relStrength;
          ctx.lineWidth = 1 + 2 * relStrength;
          ctx.setLineDash([5, 5]);
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;

          // Show B-field magnitude at this radius
          const rMetres = r * SCALE_M_PER_PX;
          const Btesla = (MU_0 * Math.abs(current)) / (2 * Math.PI * rMetres);
          ctx.fillStyle = isDarkMode ? '#94a3b8' : '#64748b';
          ctx.font = '10px monospace';
          ctx.textAlign = 'left';
          const BLabel = Btesla >= 1e-3 ? `${(Btesla * 1e3).toFixed(1)} mT` : `${(Btesla * 1e6).toFixed(0)} μT`;
          ctx.fillText(`r=${(rMetres * 100).toFixed(1)}cm  B=${BLabel}`, cx + r + 5, cy + 4);

          // More arrows on inner rings (stronger field)
          const arrowCount = Math.max(3, Math.round(8 * relStrength));
          for (let j = 0; j < arrowCount; j++) {
            const angle = ((j / arrowCount) * Math.PI * 2 + timeRef.current * (60 / r)) * 0.1;
            const ax = cx + r * Math.cos(angle),
              ay = cy + r * Math.sin(angle);
            const tan = angle + Math.PI / 2 + (current < 0 ? Math.PI : 0);
            drawArrow(ctx, ax, ay, tan, col.B_FIELD);
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [current, isDarkMode, col]);

  return (
    <ModuleLayout
      moduleId="ampere"
      simulation={
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
              <canvas ref={canvasRef} className="w-full h-full" />
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 p-3 rounded border border-slate-200 dark:border-slate-700 text-xs max-w-[250px] shadow-sm">
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Rule of Thumb</h5>
                <p className="text-slate-600 dark:text-slate-400">
                  {current >= 0 ? (
                    <span>
                      Current <strong className="text-amber-600">IN</strong> → Field{' '}
                      <strong className="text-blue-600">CW</strong>
                    </span>
                  ) : (
                    <span>
                      Current <strong className="text-amber-600">OUT</strong> → Field{' '}
                      <strong className="text-blue-600">CCW</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <ControlPanel title="Ampère's Law">
            <Slider label="Current I (Amperes)" value={current} min={-100} max={100} onChange={setCurrent} color={current >= 0 ? 'bg-amber-600' : 'bg-red-600'} />
            <HintBox>
              Reverse the current direction to see the field lines switch between Clockwise and Counter-Clockwise
              (Right-Hand Grip Rule).
            </HintBox>
          </ControlPanel>
        </div>
      }
      theory={
        <div className="space-y-6">
          <EquationBox
            title="Ampère's Law"
            equations={[
              { label: 'Integral Form', math: '\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc}', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Field at r', math: 'B = \\frac{\\mu_0 I}{2\\pi r}' },
            ]}
          />
          <TheoryGuide>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Right-Hand Grip Rule:</strong> Point thumb in I direction. Fingers curl in B direction.
              </li>
              <li>
                <strong>Field Strength:</strong> B is proportional to Current (<MathWrapper latex="I" />) and
                inversely proportional to radius (<MathWrapper latex="r" />). Field strength drops as{' '}
                <MathWrapper latex="1/r" />.
              </li>
            </ul>
          </TheoryGuide>
        </div>
      }
    />
  );
}
