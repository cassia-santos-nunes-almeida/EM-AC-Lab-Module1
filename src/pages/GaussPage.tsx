import { useState, useRef, useEffect, useCallback } from 'react';
import { useCanvasTouch } from '@/hooks/useCanvasTouch';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useThemeStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';
import { RealWorldHook } from '@/components/common/RealWorldHook';
import { PhysicsChart } from '@/components/common/PhysicsChart';
import { FigureImage } from '@/components/common/FigureImage';

const EPSILON_0 = 8.854e-12;

export default function GaussPage() {
  const isDarkMode = useThemeStore((s) => s.theme === 'dark');
  const col = isDarkMode ? COLORS_DARK : COLORS;

  const [mode, setMode] = useState<'ELECTRIC' | 'MAGNETIC'>('ELECTRIC');
  const [charge, setCharge] = useState(5);
  const [radius, setRadius] = useState(100);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTouch(canvasRef);
  const animationRef = useRef(0);
  const hoverPos = useRef<{ x: number; y: number } | null>(null);

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);
    const canvas = canvasRef.current;
    if (!pt || !canvas) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const dist = Math.sqrt((pt.x - cx) ** 2 + (pt.y - cy) ** 2);
    // Click near the dashed circle edge (within 12px)
    if (Math.abs(dist - radius) < 12) {
      setDragging(true);
    }
  }, [getCanvasPoint, radius]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);
    hoverPos.current = pt;
    if (!dragging) return;
    const canvas = canvasRef.current;
    if (!pt || !canvas) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const dist = Math.sqrt((pt.x - cx) ** 2 + (pt.y - cy) ** 2);
    setRadius(Math.round(Math.max(50, Math.min(200, dist))));
  }, [dragging, getCanvasPoint]);

  const handleMouseUp = useCallback(() => setDragging(false), []);
  const handleMouseLeaveGauss = useCallback(() => {
    setDragging(false);
    hoverPos.current = null;
  }, []);


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
      ctx.fillText(`Gaussian Surface (r = ${(radius * 0.01).toFixed(2)} m)`, cx + radius + 5, cy);
      // Drag hint
      ctx.fillStyle = col.TEXT_MUTED;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('↔ Drag edge to resize', cx, cy - radius - 8);
      ctx.textAlign = 'start';

      if (mode === 'ELECTRIC') {
        ctx.fillStyle = charge > 0 ? col.E_FIELD : col.B_FIELD;
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(charge > 0 ? `+${charge}μC` : `${charge}μC`, cx, cy);

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
      // Hover tooltip: E-field at mouse position
      if (hoverPos.current && mode === 'ELECTRIC' && charge !== 0 && !dragging) {
        const hx = hoverPos.current.x, hy = hoverPos.current.y;
        const distPx = Math.hypot(hx - cx, hy - cy);
        if (distPx > 20) {
          const rM = distPx * 0.01; // 1px = 0.01m
          const Q = Math.abs(charge * 1e-6);
          const E = Q / (4 * Math.PI * EPSILON_0 * rM * rM);
          const eStr = E >= 1e6
            ? `${(E / 1e6).toFixed(1)} MV/m`
            : E >= 1e3
              ? `${(E / 1e3).toFixed(1)} kV/m`
              : `${E.toFixed(1)} V/m`;

          // Crosshair
          ctx.strokeStyle = isDarkMode ? '#94a3b8' : '#475569';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(hx - 5, hy); ctx.lineTo(hx + 5, hy);
          ctx.moveTo(hx, hy - 5); ctx.lineTo(hx, hy + 5);
          ctx.stroke();

          // Tooltip
          const line1 = `|E| = ${eStr}`;
          const line2 = `r = ${rM.toFixed(2)} m`;
          ctx.font = '11px sans-serif';
          const tw = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width) + 14;
          const th = 34;
          const tx = Math.min(hx + 12, canvas.width - tw - 4);
          const ty = Math.max(hy - 36, 4);
          ctx.fillStyle = isDarkMode ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.92)';
          ctx.beginPath();
          ctx.roundRect(tx, ty, tw, th, 4);
          ctx.fill();
          ctx.strokeStyle = isDarkMode ? '#475569' : '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = isDarkMode ? '#e2e8f0' : '#1e293b';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(line1, tx + 7, ty + 4);
          ctx.fillStyle = isDarkMode ? '#94a3b8' : '#64748b';
          ctx.fillText(line2, tx + 7, ty + 19);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [mode, charge, radius, isDarkMode, col, dragging]);

  const equations =
    mode === 'ELECTRIC'
      ? [
          { label: 'Gauss Law (E)', math: '\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}', color: 'text-red-600 dark:text-red-400' },
          { label: 'Result', math: `\\Phi_E = \\frac{${charge}\\,\\mu\\text{C}}{\\epsilon_0} = ${(charge * 1e-6 / 8.854e-12).toFixed(0)} \\text{ N}\\!\\cdot\\!\\text{m}^2\\text{/C (indep. of } r\\text{)}` },
        ]
      : [
          { label: 'Gauss Law (B)', math: '\\Phi_B = \\oint \\vec{B} \\cdot d\\vec{A} = 0', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Result', math: '\\text{Flux In} = \\text{Flux Out}' },
        ];

  return (
    <ModuleLayout
      moduleId="gauss"
      simulation={
        <>
        <RealWorldHook text="Electrostatic shielding in coaxial cables, Faraday cages in microwave ovens, and the uniform field inside a capacitor all follow directly from this single law applied to the right surface." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ cursor: dragging ? 'grabbing' : 'default' }}
                role="img"
                aria-label="Gauss's law simulation showing electric or magnetic flux through a surface"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeaveGauss}
              />
              <div className="absolute top-4 left-4 pointer-events-none bg-white/90 dark:bg-slate-800/90 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                <h5 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase mb-1">Visualization</h5>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {mode === 'ELECTRIC' ? 'Electric Monopole' : 'Magnetic Dipole'}
                </div>
              </div>
            </div>
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
            <Slider label={`Surface Radius r = ${(radius * 0.01).toFixed(2)} m`} value={radius} min={50} max={200} onChange={setRadius} color="bg-purple-600" />
            {mode === 'ELECTRIC' && (
              <Slider label={`Enclosed Charge Q = ${charge} μC`} value={charge} min={-10} max={10} onChange={setCharge} color={charge > 0 ? 'bg-red-600' : 'bg-blue-600'} />
            )}
            <HintBox>
              {mode === 'ELECTRIC'
                ? 'Try changing the radius. Notice the number of field lines crossing the surface stays constant!'
                : 'No matter how big the surface, flux is zero because magnetic lines always loop back.'}
            </HintBox>
          </ControlPanel>
        </div>
        </>
      }
      theory={
        <div className="space-y-6">
          <FigureImage
            className="mb-6"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Faraday_cage_-_FISL_14_-_2013-07-03.jpg/640px-Faraday_cage_-_FISL_14_-_2013-07-03.jpg"
            alt="Faraday cage demonstration showing electric field shielding"
            caption="A Faraday cage: Gauss's law explains why the electric field inside a closed conductor is zero."
            attribution="Rodrigo Ghiraldelli, CC BY-SA 3.0 — Wikimedia Commons"
            sourceUrl="https://commons.wikimedia.org/wiki/File:Faraday_cage_-_FISL_14_-_2013-07-03.jpg"
          />
          <EquationBox title={`Gauss's Law for ${mode === 'ELECTRIC' ? 'Electric Fields' : 'Magnetism'}`} equations={equations} />
          {(() => {
            const Q = charge * 1e-6;
            const flux = mode === 'ELECTRIC' ? Q / EPSILON_0 : 0;
            const data = Array.from({ length: 30 }, (_, i) => {
              const r = 0.2 + i * 0.06;
              const E = mode === 'ELECTRIC' && charge !== 0
                ? Math.abs(Q) / (4 * Math.PI * EPSILON_0 * r * r)
                : 0;
              return {
                r: r.toFixed(2),
                Flux: +flux.toExponential(2),
                E: +E.toExponential(2),
              };
            });
            return (
              <PhysicsChart
                title={mode === 'ELECTRIC' ? 'Flux & Field vs Radius' : 'Magnetic Flux (always zero)'}
                data={data}
                xKey="r"
                xLabel="Radius (m)"
                yLabel={mode === 'ELECTRIC' ? 'Value' : 'Flux (Wb)'}
                lines={
                  mode === 'ELECTRIC'
                    ? [
                        { dataKey: 'E', color: '#dc2626', name: 'E-field (N/C)' },
                        { dataKey: 'Flux', color: '#9333ea', name: 'Flux (N·m²/C)' },
                      ]
                    : [{ dataKey: 'Flux', color: '#2563eb', name: 'Magnetic Flux' }]
                }
              />
            );
          })()}
          <TheoryGuide>
            {mode === 'ELECTRIC' ? (
              <p>
                <strong>Electric Flux:</strong> Proportional to enclosed charge (<MathWrapper formula="Q" />).
                Independent of surface size (<MathWrapper formula="r" />). <MathWrapper formula="\Phi_E \neq 0" />.
              </p>
            ) : (
              <p>
                <strong>Magnetic Flux:</strong> Always zero for closed surfaces (
                <MathWrapper formula="\oint B \cdot dA = 0" />
                ). Field lines form loops; what goes in must come out.
              </p>
            )}
          </TheoryGuide>
        </div>
      }
    />
  );
}
