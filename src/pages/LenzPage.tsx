import { useState, useRef, useEffect } from 'react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { HintBox } from '@/components/common/HintBox';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';

export default function LenzPage() {
  const { isDarkMode } = useProgressStore();
  const c = isDarkMode ? COLORS_DARK : COLORS;

  const [magnetPos, setMagnetPos] = useState(20);
  const [prevPos, setPrevPos] = useState(20);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed] = useState(1);
  const [showField, setShowField] = useState(true);
  const [numTurns, setNumTurns] = useState(6);
  const [liveFluxDir, setLiveFluxDir] = useState('');
  const [liveResponse, setLiveResponse] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef(0);

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

      // Induced current indicators
      const v = magnetPos - prevPos;
      const dist = magnetPos - 50;
      const interactionStrength = Math.exp(-(dist * dist) / 200);
      const intensity = v * interactionStrength * (numTurns * 0.8 + 2);
      const currentDir = intensity > 0 ? 1 : -1;
      const alpha = Math.min(Math.abs(intensity) / 5, 1);

      // Update live equation feedback
      if (Math.abs(v) > 0.1 && Math.abs(interactionStrength) > 0.1) {
        const approaching = (v * dist) < 0;
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
        if (Math.abs(interactionStrength) > 0.1) {
          const isRepulsion = (v * dist) < 0;
          const fLen = -v * Math.abs(interactionStrength) * numTurns * 3;
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
          <EquationBox
            title="Lenz's Law"
            equations={[
              { label: 'Lenz\'s Law', math: '\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}', color: 'text-indigo-600' },
              { label: 'Flux', math: `\\Phi_B: ${liveFluxDir}` },
              { label: 'Response', math: liveResponse, color: 'text-orange-600 dark:text-orange-400' },
            ]}
          />
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
          <TheoryGuide>
            <p><strong>Lenz&apos;s Law:</strong> Nature hates change. If you try to increase flux, the coil creates a field to oppose you (Repulsion).</p>
            <p>If you try to remove flux, it tries to keep it (Attraction).</p>
          </TheoryGuide>
        </ControlPanel>
      </div>
      <ModuleNavigation currentModuleId="lenz" />
    </div>
  );
}
