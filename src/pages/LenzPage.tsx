import { useState, useRef, useEffect, useCallback } from 'react';
import { useCanvasTouch } from '@/hooks/useCanvasTouch';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useThemeStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';
import { RealWorldHook } from '@/components/common/RealWorldHook';
import { PredictionGate } from '@/components/common/PredictionGate';
import { FigureImage } from '@/components/common/FigureImage';

export default function LenzPage() {
  const isDarkMode = useThemeStore((s) => s.theme === 'dark');
  const c = isDarkMode ? COLORS_DARK : COLORS;

  const [magnetPos, setMagnetPos] = useState(20);
  const [prevPos, setPrevPos] = useState(20);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed] = useState(1);
  const [showField, setShowField] = useState(true);
  const [numTurns, setNumTurns] = useState(6);
  const [liveFluxDir, setLiveFluxDir] = useState('');
  const [liveResponse, setLiveResponse] = useState('');

  const [draggingMagnet, setDraggingMagnet] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTouch(canvasRef);
  const timeRef = useRef(0);
  const animationRef = useRef(0);

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
    if (autoPlay) return;
    const pt = getCanvasPoint(e);
    const canvas = canvasRef.current;
    if (!pt || !canvas) return;
    const w = canvas.width, h = canvas.height, cy = h / 2;
    const mx = (magnetPos / 100) * w;
    // Hit test on magnet rectangle (mx-50 to mx+50, cy-20 to cy+20)
    if (pt.x >= mx - 50 && pt.x <= mx + 50 && pt.y >= cy - 20 && pt.y <= cy + 20) {
      setDraggingMagnet(true);
    }
  }, [autoPlay, getCanvasPoint, magnetPos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingMagnet) return;
    const pt = getCanvasPoint(e);
    const canvas = canvasRef.current;
    if (!pt || !canvas) return;
    const newPos = Math.max(0, Math.min(100, (pt.x / canvas.width) * 100));
    setPrevPos(magnetPos);
    setMagnetPos(newPos);
  }, [draggingMagnet, getCanvasPoint, magnetPos]);

  const handleMouseUp = useCallback(() => setDraggingMagnet(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (autoPlay) return;
    const step = 1.5;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPrevPos(magnetPos);
      setMagnetPos(p => Math.max(0, p - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPrevPos(magnetPos);
      setMagnetPos(p => Math.min(100, p + step));
    }
  }, [autoPlay, magnetPos]);


  // Auto-oscillation effect
  useEffect(() => {
    if (autoPlay) {
      const int = setInterval(() => {
        setPrevPos(magnetPos);
        timeRef.current += 0.05 * speed;
        setMagnetPos(50 + 35 * Math.sin(timeRef.current));
      }, 16);
      return () => clearInterval(int);
    }
  }, [autoPlay, speed, magnetPos]);

  // Custom drawArrow helper
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, len: number, angle: number, color: string, label?: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();
    if (Math.abs(len) > 5) {
      const headLen = 10, sign = len > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(len, 0);
      ctx.lineTo(len - sign * headLen, -5);
      ctx.lineTo(len - sign * headLen, 5);
      ctx.fill();
    }
    ctx.fillStyle = color;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    if (label) ctx.fillText(label, len / 2, -10);
    ctx.restore();
  };

  // Custom drawFieldArrow helper
  const drawFieldArrow = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, angle: number, color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-4, -3);
    ctx.lineTo(4, 0);
    ctx.lineTo(-4, 3);
    ctx.fill();
    ctx.restore();
  };

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
      const w = canvas.width, h = canvas.height, cy = h / 2, coilX = w / 2;
      ctx.clearRect(0, 0, w, h);

      // Draw coil turns
      ctx.fillStyle = '#64748b';
      const turnSpacing = Math.min(15, 200 / numTurns);
      const coilWidth = numTurns * turnSpacing;
      for (let i = 0; i < numTurns; i++) {
        const x = coilX - coilWidth / 2 + i * turnSpacing + turnSpacing / 2;
        ctx.beginPath();
        ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 4;
        ctx.arc(x, cy, 60, Math.PI * 0.5, Math.PI * 1.5, true);
        ctx.stroke();
      }

      // Draw magnet (S/N)
      const mx = (magnetPos / 100) * w;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(mx - 50, cy - 20, 50, 40);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(mx, cy - 20, 50, 40);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('S', mx - 25, cy + 5);
      ctx.fillText('N', mx + 25, cy + 5);
      // Drag hint
      if (!autoPlay) {
        ctx.fillStyle = isDarkMode ? '#64748b' : '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('↔ Drag magnet', mx, cy + 35);
      }

      // Draw field lines
      if (showField) {
        ctx.strokeStyle = `${c.B_FIELD}40`;
        ctx.lineWidth = 2;
        for (let i = 1; i <= 3; i++) {
          const s = i * 40;
          ctx.beginPath();
          ctx.moveTo(mx + 50, cy);
          ctx.bezierCurveTo(mx + 50 + s, cy - s, mx - 50 - s, cy - s, mx - 50, cy);
          ctx.stroke();
          drawFieldArrow(ctx, mx, cy - s * 0.75, Math.PI, c.B_FIELD);
          ctx.beginPath();
          ctx.moveTo(mx + 50, cy);
          ctx.bezierCurveTo(mx + 50 + s, cy + s, mx - 50 - s, cy + s, mx - 50, cy);
          ctx.stroke();
          drawFieldArrow(ctx, mx, cy + s * 0.75, Math.PI, c.B_FIELD);
        }
      }

      // Physical flux model: dipole on axis of circular coil
      // Φ ∝ a² / (a² + d²)^(3/2), so dΦ/dd ∝ -3ad² / (a² + d²)^(5/2) * v
      // We use normalized units with coil radius a = 60px as reference
      const v = magnetPos - prevPos; // velocity (slider units/frame)
      const coilCenterNorm = 50; // coil is at 50% of width
      const dNorm = (magnetPos - coilCenterNorm) / 100 * w; // distance in pixels
      const a = 60; // coil radius in pixels
      const a2 = a * a;
      const d2 = dNorm * dNorm;
      const denom = Math.pow(a2 + d2, 2.5); // (a² + d²)^(5/2)
      // dΦ/dd = -3 * a² * d / (a² + d²)^(5/2)  (derivative of dipole flux)
      const dPhiDd = denom > 0 ? -3 * a2 * dNorm / denom : 0;
      // EMF = -N * dΦ/dt = -N * (dΦ/dd) * (dd/dt)
      // velocity in slider units → pixel velocity
      const vPx = (v / 100) * w;
      const emfNorm = -numTurns * dPhiDd * vPx * 1e6; // scale for visibility

      const intensity = emfNorm;
      const currentDir = intensity > 0 ? 1 : -1;
      const alpha = Math.min(Math.abs(intensity) / 5, 1);

      // Update live equation feedback
      const fluxVal = a2 / Math.pow(a2 + d2, 1.5); // Φ ∝ this
      if (Math.abs(v) > 0.1 && Math.abs(fluxVal) > 0.001) {
        const approaching = (v * dNorm) < 0;
        setLiveFluxDir(approaching ? '\\nearrow \\text{ Increasing}' : '\\searrow \\text{ Decreasing}');
        setLiveResponse(approaching ? '\\text{Repulsion (opposes approach)}' : '\\text{Attraction (opposes removal)}');
      } else {
        setLiveFluxDir('\\text{Steady}');
        setLiveResponse('\\text{No induced EMF}');
      }

      for (let i = 0; i < numTurns; i++) {
        const x = coilX - coilWidth / 2 + i * turnSpacing + turnSpacing / 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(217, 119, 6, ${0.4 + alpha * 0.6})`;
        ctx.lineWidth = 4;
        ctx.arc(x, cy, 60, Math.PI * 1.5, Math.PI * 0.5, true);
        ctx.stroke();

        if (Math.abs(intensity) > 0.5 && (i === 0 || i === numTurns - 1)) {
          ctx.fillStyle = c.CURRENT;
          ctx.beginPath();
          ctx.arc(x, cy - 60, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = '10px sans';
          ctx.fillText(currentDir > 0 ? '\u2299' : '\u2297', x, cy - 60);

          ctx.fillStyle = c.CURRENT;
          ctx.beginPath();
          ctx.arc(x, cy + 60, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.fillText(currentDir > 0 ? '\u2297' : '\u2299', x, cy + 60);
        }
      }

      // Velocity/force arrows and REPULSION/ATTRACTION text
      if (Math.abs(v) > 0.1) {
        drawArrow(ctx, mx, cy - 40, v * 20, 0, '#10b981', 'v');
        if (Math.abs(intensity) > 0.3) {
          const isRepulsion = (v * dNorm) < 0;
          const fLen = Math.sign(-intensity) * Math.min(Math.abs(intensity) * 10, 150);
          drawArrow(ctx, mx, cy + 40, fLen, 0, '#ea580c', 'F_mag');
          ctx.font = 'bold 18px sans-serif';
          ctx.fillStyle = '#ea580c';
          ctx.textAlign = 'center';
          ctx.fillText(isRepulsion ? 'REPULSION' : 'ATTRACTION', w / 2, h - 50);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [magnetPos, prevPos, autoPlay, showField, numTurns, c, isDarkMode]);

  return (
    <ModuleLayout
      moduleId="lenz"
      simulation={
        <>
        <RealWorldHook text="Induction cooktops use a rapidly alternating magnetic field to induce eddy currents in the pan. Those currents dissipate energy as I²R heat. Lenz's Law tells us the eddy currents flow in the direction that opposes the changing flux." />
        <PredictionGate
          gateId="lenz-reverse-direction"
          question="If the magnet is pulled away from the coil instead of pushed toward it, how does the induced current direction change?"
          options={[
            { label: 'Reverses direction', correct: true, explanation: 'When the magnet is pulled away, the flux through the coil decreases. To oppose this decrease, the induced current reverses — it now flows in the direction that tries to maintain the original flux, attracting the magnet back.' },
            { label: 'Stays the same', correct: false, explanation: 'The current direction depends on whether flux is increasing or decreasing. Pulling the magnet away reverses the change in flux, so the current must reverse too.' },
            { label: 'Stops flowing', correct: false, explanation: 'Current flows whenever the flux is changing. Pulling the magnet away still changes the flux — just in the opposite direction — so current still flows.' },
          ]}
        >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px] outline-none"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ cursor: draggingMagnet ? 'grabbing' : autoPlay ? 'default' : 'grab' }}
                role="img"
                aria-label="Lenz's law simulation showing magnet and coil interaction"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>
          <ControlPanel title="Lenz's Law">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Auto-Oscillate</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={showField}
                onChange={(e) => setShowField(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Show Field Lines</span>
            </div>
            {!autoPlay && (
              <Slider
                label="Magnet Position"
                value={magnetPos}
                min={0}
                max={100}
                step={0.5}
                onChange={(v) => {
                  setPrevPos(magnetPos);
                  setMagnetPos(v);
                }}
                color="bg-slate-600"
              />
            )}
            <Slider label="Turns (N)" value={numTurns} min={1} max={20} onChange={setNumTurns} color="bg-slate-600" />
            <HintBox>Nature hates change! Move magnet closer -&gt; Coil repels. Move away -&gt; Coil attracts.</HintBox>
          </ControlPanel>
        </div>
        </PredictionGate>
        </>
      }
      theory={
        <div className="space-y-6">
          <FigureImage
            className="mb-6"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Eddy_currents_due_to_magnet.svg/440px-Eddy_currents_due_to_magnet.svg.png"
            alt="Eddy currents induced in a conductor by a moving magnet"
            caption="Eddy currents from Lenz's law: a moving magnet induces currents that create an opposing field, braking the motion."
            attribution="Wikimedia Commons, CC BY-SA 3.0"
            sourceUrl="https://commons.wikimedia.org/wiki/File:Eddy_currents_due_to_magnet.svg"
          />
          <EquationBox
            title="Lenz's Law"
            equations={[
              { label: 'Lenz\'s Law', math: '\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}', color: 'text-indigo-600' },
              { label: 'Flux', math: `\\Phi_B: ${liveFluxDir}` },
              { label: 'Response', math: liveResponse, color: 'text-orange-600 dark:text-orange-400' },
            ]}
          />
          <TheoryGuide>
            <p><strong>Lenz&apos;s Law:</strong> Nature hates change. If you try to increase flux, the coil creates a field to oppose you (Repulsion).</p>
            <p>If you try to remove flux, it tries to keep it (Attraction).</p>
          </TheoryGuide>
        </div>
      }
    />
  );
}
