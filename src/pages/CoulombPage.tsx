import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, MousePointer2 } from 'lucide-react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';
import type { Charge } from '@/types';

export default function CoulombPage() {
  const { isDarkMode } = useProgressStore();
  const col = isDarkMode ? COLORS_DARK : COLORS;

  const [charges, setCharges] = useState<Charge[]>([
    { id: 1, x: 0.35, y: 0.5, q: 4 },
    { id: 2, x: 0.65, y: 0.5, q: -4 },
  ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);

  const getNetField = useCallback(
    (x: number, y: number, excludeId: number | null, width: number, height: number) => {
      let Ex = 0,
        Ey = 0;
      charges.forEach((charge) => {
        if (charge.id === excludeId) return;
        const cx = charge.x * width,
          cy = charge.y * height;
        const dx = x - cx,
          dy = y - cy;
        const rSq = dx * dx + dy * dy;
        if (rSq < 100) return;
        const r = Math.sqrt(rSq);
        const E_mag = charge.q / rSq;
        Ex += E_mag * (dx / r);
        Ey += E_mag * (dy / r);
      });
      return { Ex, Ey };
    },
    [charges]
  );

  const drawFieldLine = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      startQ: number,
      width: number,
      height: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = startQ > 0 ? `${col.E_FIELD}50` : `${col.B_FIELD}50`;
      ctx.lineWidth = 1.5;
      ctx.moveTo(startX, startY);
      let cx = startX,
        cy = startY,
        active = true,
        steps = 0;
      const direction = startQ > 0 ? 1 : -1;
      const arrowLocs: { x: number; y: number; angle: number }[] = [];

      while (active && steps < 600) {
        steps++;
        const { Ex, Ey } = getNetField(cx, cy, null, width, height);
        const mag = Math.hypot(Ex, Ey);
        if (mag === 0) break;
        const stepLen = 5;
        const dx = (Ex / mag) * stepLen * direction;
        const dy = (Ey / mag) * stepLen * direction;
        cx += dx;
        cy += dy;
        ctx.lineTo(cx, cy);

        if (steps % 20 === 0) {
          arrowLocs.push({ x: cx, y: cy, angle: Math.atan2(dy, dx) });
        }

        if (cx < 0 || cx > width || cy < 0 || cy > height) active = false;
        for (const c of charges) {
          const cPx = c.x * width,
            cPy = c.y * height;
          if (Math.hypot(cx - cPx, cy - cPy) < 15) {
            active = false;
            ctx.lineTo(cPx - (cPx - cx) * 0.5, cPy - (cPy - cy) * 0.5);
          }
        }
      }
      ctx.stroke();

      ctx.fillStyle = startQ > 0 ? `${col.E_FIELD}90` : `${col.B_FIELD}90`;
      for (const loc of arrowLocs) {
        ctx.save();
        ctx.translate(loc.x, loc.y);
        ctx.rotate(loc.angle);
        ctx.beginPath();
        ctx.moveTo(-4, -3);
        ctx.lineTo(4, 0);
        ctx.lineTo(-4, 3);
        ctx.fill();
        ctx.restore();
      }
    },
    [charges, getNetField, col]
  );

  const drawArrow = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      vx: number,
      vy: number,
      color: string,
      label: string
    ) => {
      const mag = Math.hypot(vx, vy);
      // Log-scale arrow length to faithfully show 1/r² without clipping at large forces
      const maxLen = 150;
      const logMag = mag > 1 ? Math.min(maxLen, 30 * Math.log10(mag) + 20) : mag;
      const scale = mag > 0 ? logMag / mag : 0;
      const dx = vx * scale,
        dy = vy * scale;
      ctx.beginPath();
      ctx.strokeStyle = color;
      // Thicker arrows for stronger forces
      ctx.lineWidth = Math.min(6, 2 + logMag / 50);
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx, y + dy);
      ctx.stroke();
      const angle = Math.atan2(dy, dx),
        headLen = 10;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(x + dx, y + dy);
      ctx.lineTo(x + dx - headLen * Math.cos(angle - Math.PI / 6), y + dy - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x + dx - headLen * Math.cos(angle + Math.PI / 6), y + dy - headLen * Math.sin(angle + Math.PI / 6));
      ctx.fill();
      if (mag > 20) {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(label, x + dx + 15 * Math.cos(angle), y + dy + 15 * Math.sin(angle));
      }
    },
    []
  );

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (isDarkMode) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      }

      if (showGrid) {
        ctx.strokeStyle = col.GRID;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x += 40) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += 40) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      charges.forEach((charge) => {
        const cx = charge.x * width,
          cy = charge.y * height;
        if (Math.abs(charge.q) > 0) {
          const count = Math.abs(charge.q) * 3;
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            drawFieldLine(ctx, cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20, charge.q, width, height);
          }
        }
      });

      // Scale: 1 grid square (40px) = 0.1 m
      const SCALE_M_PER_PX = 0.1 / 40; // metres per pixel
      const K_COULOMB = 8.99e9; // N·m²/C²

      // Scale reference label
      ctx.fillStyle = isDarkMode ? '#94a3b8' : '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('1 square = 0.1 m  |  Charges in μC', 8, height - 8);

      charges.forEach((charge) => {
        const cx = charge.x * width,
          cy = charge.y * height;
        const { Ex, Ey } = getNetField(cx, cy, charge.id, width, height);
        const forceX = Ex * charge.q * 5000,
          forceY = Ey * charge.q * 5000;

        // Compute physical force magnitude for display
        let forceLabel = 'F';
        const otherCharges = charges.filter((c) => c.id !== charge.id);
        if (otherCharges.length === 1) {
          const other = otherCharges[0];
          const distPx = Math.hypot((charge.x - other.x) * width, (charge.y - other.y) * height);
          const distM = distPx * SCALE_M_PER_PX;
          const q1 = Math.abs(charge.q * 1e-6); // convert μC to C
          const q2 = Math.abs(other.q * 1e-6);
          if (distM > 0.001) {
            const Fphys = K_COULOMB * q1 * q2 / (distM * distM);
            forceLabel = Fphys >= 1 ? `F=${Fphys.toFixed(1)} N` : `F=${(Fphys * 1e3).toFixed(1)} mN`;
          }
        }
        if (Math.hypot(forceX, forceY) > 5) drawArrow(ctx, cx, cy, forceX, forceY, '#ea580c', forceLabel);

        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = charge.q > 0 ? col.E_FIELD : charge.q < 0 ? col.B_FIELD : '#94a3b8';
        ctx.fillStyle = charge.q > 0 ? col.E_FIELD : charge.q < 0 ? col.B_FIELD : '#94a3b8';
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${charge.q > 0 ? '+' : ''}${charge.q}μC`, cx, cy);

        if (draggingId === charge.id) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0,0,0,0.5)';
          ctx.lineWidth = 2;
          ctx.arc(cx, cy, 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [charges, draggingId, showGrid, isDarkMode, col, getNetField, drawFieldLine, drawArrow]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clicked = charges.find(
      (c) =>
        Math.hypot(e.clientX - rect.left - c.x * canvas.width, e.clientY - rect.top - c.y * canvas.height) < 30
    );
    if (clicked) setDraggingId(clicked.id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingId === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / canvas.width;
    const newY = (e.clientY - rect.top) / canvas.height;
    setCharges((prev) =>
      prev.map((c) =>
        c.id === draggingId
          ? { ...c, x: Math.max(0.05, Math.min(0.95, newX)), y: Math.max(0.05, Math.min(0.95, newY)) }
          : c
      )
    );
  };

  return (
    <ModuleLayout
      moduleId="coulomb"
      simulation={
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px] cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                role="img"
                aria-label="Coulomb's law simulation with draggable charges showing electric field lines and force vectors"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setDraggingId(null)}
                onMouseLeave={() => setDraggingId(null)}
              />
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 p-2 rounded backdrop-blur text-xs border border-slate-200 dark:border-slate-700 shadow-sm pointer-events-none flex items-center gap-2">
                <MousePointer2 size={14} className="text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Drag charges</span>
              </div>
            </div>
          </div>
          <ControlPanel title="Charge Configuration">
            {charges.map((charge, i) => (
              <div key={charge.id} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    Charge {i + 1}
                  </span>
                  <button
                    onClick={() => setCharges((p) => p.filter((c) => c.id !== charge.id))}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    disabled={charges.length <= 1}
                    aria-label={`Remove charge ${i + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  value={charge.q}
                  onChange={(e) =>
                    setCharges((p) =>
                      p.map((c) => (c.id === charge.id ? { ...c, q: parseFloat(e.target.value) } : c))
                    )
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-600"
                  style={{
                    accentColor: charge.q > 0 ? col.E_FIELD : charge.q < 0 ? col.B_FIELD : '#94a3b8',
                  }}
                  aria-label={`Charge ${i + 1} value`}
                />
                <div className="text-center text-xs font-mono mt-1 text-slate-500 dark:text-slate-400">
                  q = {charge.q > 0 ? '+' : ''}
                  {charge.q} &mu;C
                </div>
              </div>
            ))}
            {charges.length < 4 && (
              <button
                onClick={() =>
                  setCharges([
                    ...charges,
                    { id: Math.max(0, ...charges.map((c) => c.id)) + 1, x: 0.5, y: 0.5, q: 2 },
                  ])
                }
                className="w-full py-2 bg-engineering-blue-50 dark:bg-engineering-blue-900/20 text-engineering-blue-700 dark:text-engineering-blue-400 border border-engineering-blue-200 dark:border-engineering-blue-800 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={16} /> Add Charge
              </button>
            )}
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded text-engineering-blue-600"
              />{' '}
              Show Grid
            </label>
            <HintBox>
              Drag charges close to each other. Notice how the Force vector (F) grows rapidly (
              <MathWrapper latex="1/r^2" />
              )!
            </HintBox>
          </ControlPanel>
        </div>
      }
      theory={
        <div className="space-y-6">
          <EquationBox
            title="Superposition Principle"
            equations={[
              {
                label: 'Net Field',
                math: '\\vec{E}_{net} = \\sum k \\frac{q_i}{r_i^2} \\hat{r}_i',
                color: 'text-indigo-600 dark:text-indigo-400',
              },
              { label: 'Force', math: '\\vec{F}_{net} \\text{ on } q = q \\vec{E}_{other}' },
            ]}
          />
          <TheoryGuide>
            <p>
              <strong>Coulomb's Law:</strong> Force between charges is proportional to magnitude product,
              inversely proportional to distance squared:{' '}
              <MathWrapper latex="F = k \frac{q_1 q_2}{r^2}" />.
            </p>
            <p>
              <strong>Field Lines:</strong> Originate from (+) and terminate on (-). Density represents
              field strength.
            </p>
          </TheoryGuide>
        </div>
      }
    />
  );
}
