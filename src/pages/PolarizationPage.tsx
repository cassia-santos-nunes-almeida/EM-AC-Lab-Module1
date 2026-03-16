import { useState, useRef, useEffect, useCallback } from 'react';
import { useCanvasTouch } from '@/hooks/useCanvasTouch';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useThemeStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { PlayControls } from '@/components/common/PlayControls';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';
import { RealWorldHook } from '@/components/common/RealWorldHook';
import { Layers } from 'lucide-react';
import type { Equation } from '@/types';

export default function PolarizationPage() {
  const isDarkMode = useThemeStore((s) => s.theme === 'dark');
  const c = isDarkMode ? COLORS_DARK : COLORS;

  const [ex, setEx] = useState(50);
  const [ey, setEy] = useState(50);
  const [phaseDelta, setPhaseDelta] = useState(90);
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef(0);
  const traceRef = useRef<Array<{ x: number; y: number }>>([]);

  useCanvasTouch(canvasRef);

  // Drag state for E-field vector tip
  const draggingVector = useRef(false);
  const lissajousCenter = useRef({ x: 0, y: 0, scale: 1 });

  // Clear trace on parameter change
  useEffect(() => {
    traceRef.current = [];
  }, [ex, ey, phaseDelta]);

  // Main render effect
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isPlaying) timeRef.current += 0.04;
      const t = timeRef.current;
      const rad = (phaseDelta * Math.PI) / 180;
      const midX = w * 0.35;

      // Divider line
      ctx.beginPath();
      ctx.strokeStyle = c.GRID;
      ctx.moveTo(midX, 20);
      ctx.lineTo(midX, h - 20);
      ctx.stroke();

      // Head-on view (Lissajous) - left half
      const cx = midX / 2, cy = h / 2;
      const maxR = Math.min(midX, h) * 0.35;
      const scale = maxR / 100;
      lissajousCenter.current = { x: cx, y: cy, scale };

      // Axes
      ctx.strokeStyle = c.AXIS;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR - 20);
      ctx.lineTo(cx, cy + maxR + 20);
      ctx.moveTo(cx - maxR - 20, cy);
      ctx.lineTo(cx + maxR + 20, cy);
      ctx.stroke();

      ctx.fillStyle = c.TEXT_MUTED;
      ctx.font = '12px sans-serif';
      ctx.fillText('Ex', cx + maxR + 25, cy);
      ctx.fillText('Ey', cx, cy - maxR - 25);

      // Compute current values and add to trace
      const valX = ex * Math.cos(t);
      const valY = ey * Math.cos(t + rad);
      traceRef.current.push({ x: valX, y: valY });
      if (traceRef.current.length > 200) traceRef.current.shift();

      // Draw trace (Lissajous pattern)
      ctx.beginPath();
      ctx.strokeStyle = `${c.POWER}60`;
      ctx.lineWidth = 2;
      traceRef.current.forEach((pt, i) => {
        const px = cx + pt.x * scale;
        const py = cy - pt.y * scale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Component dashed lines
      const tipX = cx + valX * scale;
      const tipY = cy - valY * scale;
      ctx.strokeStyle = c.E_FIELD;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tipX, cy);
      ctx.stroke();
      ctx.strokeStyle = c.B_FIELD;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, tipY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Net E-field vector
      ctx.strokeStyle = c.POWER;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      // Draggable handle at vector tip
      ctx.beginPath();
      ctx.arc(tipX, tipY, draggingVector.current ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = c.POWER;
      ctx.globalAlpha = draggingVector.current ? 0.6 : 0.35;
      ctx.fill();
      ctx.globalAlpha = 1;
      // Solid dot
      ctx.beginPath();
      ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
      ctx.fillStyle = c.POWER;
      ctx.fill();

      // Drag hint
      if (!draggingVector.current) {
        ctx.fillStyle = c.TEXT_MUTED;
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Drag vector tip to set Ex/Ey', cx, cy + maxR + 35);
      }

      // 3D propagation view - right half
      const start3D = midX + 50;
      const end3D = w - 50;
      const len3D = end3D - start3D;
      const cy3D = h / 2;
      ctx.strokeStyle = c.AXIS;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(start3D, cy3D);
      ctx.lineTo(end3D, cy3D);
      ctx.stroke();
      ctx.fillText('Propagation (z)', end3D + 10, cy3D);

      const points = 150;
      const k = 0.1;
      const depthScale = 0.5;

      // Combined 3D wave (purple)
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.strokeStyle = c.POWER;
      for (let i = 0; i < points; i++) {
        const z = (i / points) * len3D;
        const ph = t - z * k;
        const wX = ex * Math.cos(ph);
        const wY = ey * Math.cos(ph + rad);
        const px = start3D + z - wX * depthScale * 0.5;
        const py = cy3D - wY * scale - wX * depthScale * 0.5;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Ey component projection (blue)
      ctx.beginPath();
      ctx.strokeStyle = `${c.B_FIELD}50`;
      for (let i = 0; i < points; i++) {
        const z = (i / points) * len3D;
        const ph = t - z * k;
        const wY = ey * Math.cos(ph + rad);
        const px = start3D + z;
        const py = cy3D - wY * scale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Ex component projection (red)
      ctx.beginPath();
      ctx.strokeStyle = `${c.E_FIELD}50`;
      for (let i = 0; i < points; i++) {
        const z = (i / points) * len3D;
        const ph = t - z * k;
        const wX = ex * Math.cos(ph);
        const px = start3D + z - wX * depthScale * 0.5;
        const py = cy3D - wX * depthScale * 0.5;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [ex, ey, phaseDelta, isPlaying, c, isDarkMode]);

  // Vector drag handlers
  const getCanvasPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const handleVectorMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPos(e);
    const { x: cx, y: cy, scale } = lissajousCenter.current;
    const t = timeRef.current;
    const rad = (phaseDelta * Math.PI) / 180;
    const tipX = cx + ex * Math.cos(t) * scale;
    const tipY = cy - ey * Math.cos(t + rad) * scale;
    if (Math.hypot(x - tipX, y - tipY) < 20) {
      draggingVector.current = true;
    }
  }, [ex, ey, phaseDelta, getCanvasPos]);

  const handleVectorMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingVector.current) return;
    const { x, y } = getCanvasPos(e);
    const { x: cx, y: cy, scale } = lissajousCenter.current;
    const t = timeRef.current;
    const rad = (phaseDelta * Math.PI) / 180;

    // Mouse position in field units
    const mouseFieldX = (x - cx) / scale;
    const mouseFieldY = -(y - cy) / scale;

    // Solve for amplitudes: valX = ex*cos(t), valY = ey*cos(t+rad)
    const cosT = Math.cos(t);
    const cosTRad = Math.cos(t + rad);

    if (Math.abs(cosT) > 0.1) {
      const newEx = Math.round(Math.max(0, Math.min(100, Math.abs(mouseFieldX / cosT))));
      setEx(newEx);
    }
    if (Math.abs(cosTRad) > 0.1) {
      const newEy = Math.round(Math.max(0, Math.min(100, Math.abs(mouseFieldY / cosTRad))));
      setEy(newEy);
    }
  }, [phaseDelta, getCanvasPos]);

  const handleVectorMouseUp = useCallback(() => {
    draggingVector.current = false;
  }, []);

  // Polarization type detection
  let type = 'Elliptical';
  if (Math.abs(phaseDelta) % 180 === 0) type = 'Linear';
  else if (Math.abs(Math.abs(phaseDelta) - 90) < 5 && Math.abs(ex - ey) < 5) type = 'Circular';

  // Compute ellipticity parameters
  const deltaRad = phaseDelta * Math.PI / 180;
  // Orientation angle ψ: tan(2ψ) = (2·Ex·Ey)/(Ex²-Ey²) · cos(δ)
  const psi = ex === ey
    ? 45
    : (0.5 * Math.atan2(2 * ex * ey * Math.cos(deltaRad), ex * ex - ey * ey)) * 180 / Math.PI;
  // Ellipticity angle χ: sin(2χ) = (2·Ex·Ey)/(Ex²+Ey²) · sin(δ)
  const sin2chi = (2 * ex * ey * Math.sin(deltaRad)) / (ex * ex + ey * ey || 1);
  const chi = 0.5 * Math.asin(Math.max(-1, Math.min(1, sin2chi))) * 180 / Math.PI;
  // Axial ratio: AR = |tan(χ)|, ∞ for linear
  const axialRatio = type === 'Linear' ? Infinity : Math.abs(Math.tan(chi * Math.PI / 180));
  // Stokes parameters (normalized)
  const S0 = ex * ex + ey * ey;
  const S1 = ex * ex - ey * ey;
  const S2 = 2 * ex * ey * Math.cos(deltaRad);
  const S3 = 2 * ex * ey * Math.sin(deltaRad);
  // Handedness
  const handedness = Math.abs(phaseDelta) < 1 || Math.abs(Math.abs(phaseDelta) - 180) < 1
    ? '' : (phaseDelta > 0 ? 'Right' : 'Left');

  // Equations
  const equations: Equation[] = [
    { label: 'Net Vector', math: '\\vec{E}(z,t) = E_x \\hat{x} + E_y \\hat{y}', color: 'text-purple-600' },
    { label: 'x-Comp', math: `E_x = ${ex} \\cos(kz - \\omega t)` },
    { label: 'y-Comp', math: `E_y = ${ey} \\cos(kz - \\omega t + ${phaseDelta}^\\circ)` },
    { label: 'State', math: `\\text{${handedness ? handedness + '-' : ''}${type}}`, color: 'font-bold' },
  ];
  if (type === 'Circular') {
    equations.push({ label: 'Condition', math: '|E_x| = |E_y|, \\delta = \\pm 90^\\circ', color: 'text-emerald-600' });
  } else if (type === 'Linear') {
    equations.push({ label: 'Condition', math: `\\delta = n\\pi, \\text{Slope} = ${(ey / (ex || 1)).toFixed(2)}` });
  }
  // Always show ellipticity parameters
  equations.push(
    { label: 'Orientation', math: `\\psi = ${psi.toFixed(1)}^\\circ` },
    { label: 'Ellipticity', math: `\\chi = ${chi.toFixed(1)}^\\circ,\\quad \\text{AR} = ${axialRatio === Infinity ? '\\infty' : axialRatio.toFixed(2)}` },
    { label: 'Stokes', math: `[S_0,S_1,S_2,S_3] = [${S0},\\,${S1},\\,${S2.toFixed(0)},\\,${S3.toFixed(0)}]` },
  );

  return (
    <ModuleLayout
      moduleId="polarization"
      simulation={
        <>
        <RealWorldHook text="LCD screens work by rotating the polarization of light between two crossed polarizers. Without the physics in this section, there are no flat screens, no sunglasses, and no glare-reducing camera filters." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                role="img"
                aria-label="Polarization simulation showing Lissajous pattern and 3D wave propagation"
                onMouseDown={handleVectorMouseDown}
                onMouseMove={handleVectorMouseMove}
                onMouseUp={handleVectorMouseUp}
                onMouseLeave={handleVectorMouseUp}
                style={{ cursor: 'crosshair' }}
              />
              <div className="absolute top-4 left-4 flex gap-4 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-800/90 p-2 rounded border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Head-On View</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{type} Polarization</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm text-xs pointer-events-none">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Legend</h5>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0 border-b-2 border-red-600 border-dashed"></div>
                    <span className="text-slate-600 dark:text-slate-400">Ex</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0 border-b-2 border-blue-600 border-dashed"></div>
                    <span className="text-slate-600 dark:text-slate-400">Ey</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-1 bg-purple-600 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">Net E-Field</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ControlPanel title="Polarization Controls">
            <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
              <Slider label="Horizontal Amp (Ex)" value={ex} min={0} max={100} step={1} onChange={setEx} color="bg-red-600" />
              <Slider label="Vertical Amp (Ey)" value={ey} min={0} max={100} step={1} onChange={setEy} color="bg-blue-600" />
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500">
                <Layers size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Phase Relationship</span>
              </div>
              <Slider
                label="Phase Difference (\u03B4)"
                value={phaseDelta}
                min={-180}
                max={180}
                step={15}
                unit="\u00B0"
                onChange={setPhaseDelta}
                color="bg-purple-600"
              />
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 px-1 -mt-2">
                <span
                  className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                  onClick={() => setPhaseDelta(0)}
                >
                  Linear (0\u00B0)
                </span>
                <span
                  className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                  onClick={() => { setPhaseDelta(90); setEx(50); setEy(50); }}
                >
                  Circular (90\u00B0)
                </span>
                <span
                  className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                  onClick={() => setPhaseDelta(180)}
                >
                  Linear (180\u00B0)
                </span>
              </div>
            </div>
            <PlayControls
              isPlaying={isPlaying}
              onToggle={() => setIsPlaying(!isPlaying)}
              onReset={() => {
                timeRef.current = 0;
                setPhaseDelta(90);
                setEx(50);
                setEy(50);
              }}
            />
            <HintBox>For Circular polarization, magnitudes must be equal (Ex = Ey) and phase difference must be \u00B190\u00B0.</HintBox>
          </ControlPanel>
        </div>
        </>
      }
      theory={
        <div className="space-y-6">
          <EquationBox title="Instantaneous Field Equations" equations={equations} />
          <TheoryGuide>
            <p>
              <strong>Linear Polarization:</strong> Fields oscillate in a single plane (
              <MathWrapper formula="\delta = 0^\circ" />).
            </p>
            <p>
              <strong>Circular Polarization:</strong> Field vector rotates. Occurs when{' '}
              <MathWrapper formula="E_x = E_y" /> and phase shift is{' '}
              <MathWrapper formula="90^\circ" />.
            </p>
          </TheoryGuide>
        </div>
      }
    />
  );
}
