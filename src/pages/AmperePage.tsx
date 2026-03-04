import { useState, useRef, useEffect } from 'react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';

export default function AmperePage() {
  const { isDarkMode } = useProgressStore();
  const col = isDarkMode ? COLORS_DARK : COLORS;

  const [current, setCurrent] = useState(50);
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
      ctx.fillText(`I (${label})`, cx, cy - 35);

      // B-field circles with arrows
      if (Math.abs(current) > 2) {
        for (let i = 1; i <= 4; i++) {
          const r = 40 + (i * (Math.min(canvas.width, canvas.height) / 2 - 60)) / 4;
          ctx.beginPath();
          ctx.strokeStyle = `${col.B_FIELD}50`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          for (let j = 0; j < 3 + i * 2; j++) {
            const angle = ((j / (3 + i * 2)) * Math.PI * 2 + timeRef.current * (60 / r)) * 0.1;
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
    <div className="space-y-6">
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
          <EquationBox
            title="Ampère's Law"
            equations={[
              { label: 'Integral Form', math: '\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc}', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Field at r', math: 'B = \\frac{\\mu_0 I}{2\\pi r}' },
            ]}
          />
        </div>

        <ControlPanel title="Ampère's Law">
          <Slider label="Current Intensity (I)" value={current} min={-100} max={100} onChange={setCurrent} color={current >= 0 ? 'bg-amber-600' : 'bg-red-600'} />
          <HintBox>
            Reverse the current direction to see the field lines switch between Clockwise and Counter-Clockwise
            (Right-Hand Grip Rule).
          </HintBox>
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
        </ControlPanel>
      </div>
      <ModuleNavigation currentModuleId="ampere" />
    </div>
  );
}
