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
import { ModuleAssessment } from '@/components/common/ModuleAssessment';

export default function GaussPage() {
  const { isDarkMode } = useProgressStore();
  const col = isDarkMode ? COLORS_DARK : COLORS;

  const [mode, setMode] = useState<'ELECTRIC' | 'MAGNETIC'>('ELECTRIC');
  const [charge, setCharge] = useState(5);
  const [radius, setRadius] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);

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

      // Gaussian surface
      ctx.beginPath();
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = col.TEXT_MAIN;
      ctx.font = '12px sans-serif';
      ctx.fillText(`Surface A (r=${radius})`, cx + radius + 5, cy);

      if (mode === 'ELECTRIC') {
        ctx.fillStyle = charge > 0 ? col.E_FIELD : col.B_FIELD;
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(charge > 0 ? `+${charge}` : `${charge}`, cx, cy);

        const lines = Math.abs(charge) * 4;
        ctx.strokeStyle = charge > 0 ? `${col.E_FIELD}60` : `${col.B_FIELD}60`;
        ctx.lineWidth = 2;
        for (let i = 0; i < lines; i++) {
          const angle = (i / lines) * Math.PI * 2;
          ctx.beginPath();
          const rStart = 20,
            rEnd = 300;
          const sx = cx + Math.cos(angle) * rStart,
            sy = cy + Math.sin(angle) * rStart;
          const ex = cx + Math.cos(angle) * rEnd,
            ey = cy + Math.sin(angle) * rEnd;
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          const ix = cx + Math.cos(angle) * radius;
          const iy = cy + Math.sin(angle) * radius;
          const arrowAngle = charge > 0 ? angle : angle + Math.PI;
          const headLen = 8;
          ctx.beginPath();
          ctx.fillStyle = charge > 0 ? col.E_FIELD : col.B_FIELD;
          ctx.moveTo(ix, iy);
          ctx.lineTo(ix - headLen * Math.cos(arrowAngle - Math.PI / 6), iy - headLen * Math.sin(arrowAngle - Math.PI / 6));
          ctx.lineTo(ix - headLen * Math.cos(arrowAngle + Math.PI / 6), iy - headLen * Math.sin(arrowAngle + Math.PI / 6));
          ctx.fill();
        }
      } else {
        const mw = 60,
          mh = 24;
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(cx - mw / 2, cy - mh / 2, mw / 2, mh);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx, cy - mh / 2, mw / 2, mh);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S', cx - mw / 4, cy + 4);
        ctx.fillText('N', cx + mw / 4, cy + 4);
        ctx.strokeStyle = `${col.B_FIELD}60`;
        ctx.lineWidth = 2;
        const loops = 8;
        for (let i = 1; i <= loops; i++) {
          const scale = i * 25;
          ctx.beginPath();
          ctx.moveTo(cx + mw / 2, cy);
          ctx.bezierCurveTo(cx + mw / 2 + scale, cy - scale, cx - mw / 2 - scale, cy - scale, cx - mw / 2, cy);
          ctx.moveTo(cx + mw / 2, cy);
          ctx.bezierCurveTo(cx + mw / 2 + scale, cy + scale, cx - mw / 2 - scale, cy + scale, cx - mw / 2, cy);
          ctx.stroke();
        }
        ctx.fillStyle = col.B_FIELD;
        const dots = 12;
        for (let i = 0; i < dots; i++) {
          const angle = (i / dots) * Math.PI * 2;
          const ix = cx + Math.cos(angle) * radius,
            iy = cy + Math.sin(angle) * radius;
          if (radius > 40) {
            ctx.beginPath();
            ctx.arc(ix, iy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [mode, charge, radius, isDarkMode, col]);

  const equations =
    mode === 'ELECTRIC'
      ? [
          { label: 'Gauss Law (E)', math: '\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}', color: 'text-red-600 dark:text-red-400' },
          { label: 'Result', math: `\\Phi_E \\propto ${charge} \\text{ (Independent of } r\\text{)}` },
        ]
      : [
          { label: 'Gauss Law (B)', math: '\\Phi_B = \\oint \\vec{B} \\cdot d\\vec{A} = 0', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Result', math: '\\text{Flux In} = \\text{Flux Out}' },
        ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute top-4 left-4 pointer-events-none bg-white/90 dark:bg-slate-800/90 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
              <h5 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase mb-1">Visualization</h5>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {mode === 'ELECTRIC' ? 'Electric Monopole' : 'Magnetic Dipole'}
              </div>
            </div>
          </div>
          <EquationBox title={`Gauss's Law for ${mode === 'ELECTRIC' ? 'Electric Fields' : 'Magnetism'}`} equations={equations} />
        </div>

        <ControlPanel title="Gauss's Law Controls">
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <button
              onClick={() => setMode('ELECTRIC')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${mode === 'ELECTRIC' ? 'bg-white dark:bg-slate-600 shadow text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Electric (E)
            </button>
            <button
              onClick={() => setMode('MAGNETIC')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${mode === 'MAGNETIC' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Magnetic (B)
            </button>
          </div>
          <Slider label="Gaussian Surface Radius (r)" value={radius} min={50} max={200} onChange={setRadius} color="bg-purple-600" />
          {mode === 'ELECTRIC' && (
            <Slider label="Enclosed Charge (Q)" value={charge} min={-10} max={10} onChange={setCharge} color={charge > 0 ? 'bg-red-600' : 'bg-blue-600'} />
          )}
          <HintBox>
            {mode === 'ELECTRIC'
              ? 'Try changing the radius. Notice the number of field lines crossing the surface stays constant!'
              : 'No matter how big the surface, flux is zero because magnetic lines always loop back.'}
          </HintBox>
          <TheoryGuide>
            {mode === 'ELECTRIC' ? (
              <p>
                <strong>Electric Flux:</strong> Proportional to enclosed charge (<MathWrapper latex="Q" />).
                Independent of surface size (<MathWrapper latex="r" />). <MathWrapper latex="\Phi_E \neq 0" />.
              </p>
            ) : (
              <p>
                <strong>Magnetic Flux:</strong> Always zero for closed surfaces (
                <MathWrapper latex="\oint B \cdot dA = 0" />
                ). Field lines form loops; what goes in must come out.
              </p>
            )}
          </TheoryGuide>
        </ControlPanel>
      </div>
      <ModuleAssessment moduleId="gauss" />
      <ModuleNavigation currentModuleId="gauss" />
    </div>
  );
}
