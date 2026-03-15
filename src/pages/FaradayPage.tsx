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
import { PredictionGate } from '@/components/common/PredictionGate';

export default function FaradayPage() {
  const isDarkMode = useThemeStore((s) => s.theme === 'dark');
  const c = isDarkMode ? COLORS_DARK : COLORS;

  const [rate, setRate] = useState(1);
  const [loops, setLoops] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liveB, setLiveB] = useState(0);
  const [liveEmf, setLiveEmf] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasTouch(canvasRef);
  const timeRef = useRef(0);
  const animationRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const dragStartRate = useRef(1);

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
      const cx = canvas.width / 2, cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isPlaying) timeRef.current += 0.02 * rate;
      const t = timeRef.current;
      const B = Math.sin(t), dBdt = Math.cos(t);
      setLiveB(B);
      setLiveEmf(-dBdt * loops);

      // Draw conducting loops
      ctx.beginPath();
      ctx.strokeStyle = isDarkMode ? '#94a3b8' : '#94a3b8';
      ctx.lineWidth = 2;
      for (let i = 0; i < loops; i++) {
        ctx.beginPath();
        ctx.arc(cx + (i - (loops - 1) / 2) * 4, cy - (i - (loops - 1) / 2) * 4, 150, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw B-field symbols
      ctx.fillStyle = c.B_FIELD;
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let x = cx - 120; x <= cx + 120; x += 40) {
        for (let y = cy - 120; y <= cy + 120; y += 40) {
          if (Math.hypot(x - cx, y - cy) < 130) {
            ctx.globalAlpha = Math.abs(B);
            ctx.fillText(B > 0 ? '\u2299' : '\u2297', x, y);
          }
        }
      }
      ctx.globalAlpha = 1;

      // Induced current arrows — speed proportional to |EMF|
      const emf = -dBdt * loops;
      const isCW = emf < 0;
      const emfNorm = Math.abs(emf) / (loops || 1); // normalized to [0, 1]
      const arrowSpeed = emfNorm * 2; // proportional rotation speed
      ctx.fillStyle = c.CURRENT;
      ctx.globalAlpha = 0.3 + 0.7 * emfNorm; // fade arrows when EMF is small
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * arrowSpeed * (isCW ? 1 : -1);
        const ax = cx + 150 * Math.cos(angle), ay = cy + 150 * Math.sin(angle);
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle + Math.PI / 2 + (isCW ? 0 : Math.PI));
        ctx.beginPath();
        ctx.moveTo(-6, -3);
        ctx.lineTo(6, 0);
        ctx.lineTo(-6, 3);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // Status labels
      ctx.textAlign = 'left';
      ctx.fillStyle = c.B_FIELD;
      ctx.font = '14px sans-serif';
      ctx.fillText(`B Field: ${Math.abs(B) < 0.1 ? 'Zero' : (B > 0 ? 'Out \u2299' : 'In \u2297')}`, 20, 30);
      ctx.fillStyle = c.E_FIELD;
      ctx.fillText(`Induced EMF: ${Math.abs(emf) < 0.1 ? 'None' : (isCW ? 'CW \u21bb' : 'CCW \u21ba')}`, 20, 50);

      // Rate drag indicator at bottom
      const barW = 200, barH = 6;
      const barX = cx - barW / 2, barY = canvas.height - 30;
      ctx.fillStyle = isDarkMode ? '#1e293b' : '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(barX - 4, barY - 4, barW + 8, barH + 8, 4);
      ctx.fill();
      ctx.fillStyle = isDarkMode ? '#334155' : '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 3);
      ctx.fill();
      // Filled portion representing rate
      const fillW = ((rate - 0.1) / 2.9) * barW;
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, 3);
      ctx.fill();
      // Handle
      ctx.beginPath();
      ctx.arc(barX + fillW, barY + barH / 2, dragStartX.current !== null ? 8 : 6, 0, Math.PI * 2);
      ctx.fillStyle = '#8b5cf6';
      ctx.globalAlpha = dragStartX.current !== null ? 0.8 : 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;
      // Label
      ctx.fillStyle = isDarkMode ? '#94a3b8' : '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Drag to set \u03C9 = ${rate.toFixed(1)}`, cx, barY + 20);

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, rate, loops, c, isDarkMode]);

  // Canvas drag handlers for rate control
  const getCanvasPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const handleRateDragDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Check if click is near the rate bar area (bottom 60px)
    if (y > canvas.height - 50) {
      dragStartX.current = x;
      dragStartRate.current = rate;
    }
  }, [rate, getCanvasPos]);

  const handleRateDragMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragStartX.current === null) return;
    const { x } = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const barW = 200;
    const barX = cx - barW / 2;
    // Map mouse x to rate value
    const frac = Math.max(0, Math.min(1, (x - barX) / barW));
    const newRate = Math.round((0.1 + frac * 2.9) * 10) / 10;
    setRate(newRate);
  }, [getCanvasPos]);

  const handleRateDragUp = useCallback(() => {
    dragStartX.current = null;
  }, []);

  return (
    <ModuleLayout
      moduleId="faraday"
      simulation={
        <>
        <RealWorldHook text="The 2003 Northeast blackout cascaded across 55 million people partly because changing magnetic flux in transformers triggered protective relays faster than operators could respond. Faraday's Law was at the center of it." />
        <PredictionGate
          gateId="faraday-induced-current"
          question="A bar magnet's north pole approaches a coil from the left. In which direction does the induced current flow when viewed from the left?"
          options={[
            { label: 'Clockwise', correct: false, explanation: 'Clockwise current (viewed from the left) would create a magnetic field pointing right — the same direction as the approaching magnet. This would attract the magnet, violating Lenz\'s law.' },
            { label: 'Counterclockwise', correct: true, explanation: 'Counterclockwise current (viewed from the left) creates a field pointing left — opposing the increasing flux from the approaching north pole. This is exactly what Lenz\'s law predicts: the induced current opposes the change in flux.' },
          ]}
        >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex-grow min-h-[400px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                role="img"
                aria-label="Faraday's law simulation showing electromagnetic induction"
                onMouseDown={handleRateDragDown}
                onMouseMove={handleRateDragMove}
                onMouseUp={handleRateDragUp}
                onMouseLeave={handleRateDragUp}
                style={{ cursor: 'crosshair' }}
              />
            </div>
          </div>
          <ControlPanel title="Experiment Controls">
            <Slider label="Rate (\u03C9)" value={rate} min={0.1} max={3.0} step={0.1} onChange={setRate} />
            <Slider label="Loops (N)" value={loops} min={1} max={10} onChange={setLoops} color="bg-indigo-600" />
            <PlayControls
              isPlaying={isPlaying}
              onToggle={() => setIsPlaying(!isPlaying)}
              onReset={() => { timeRef.current = 0; }}
            />
            <HintBox>
              <span>
                Increase the Rate (<MathWrapper formula="\omega" />) or Loops (<MathWrapper formula="N" />) to generate a stronger induced voltage/current!
              </span>
            </HintBox>
          </ControlPanel>
        </div>
        </PredictionGate>
        </>
      }
      theory={
        <div className="space-y-6">
          <EquationBox
            title="Faraday's Law"
            equations={[
              { label: 'General', math: '\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}', color: 'text-indigo-600' },
              { label: 'Parameters', math: `N = ${loops},\\quad \\omega = ${rate.toFixed(1)}` },
              { label: 'B(t)', math: `B = \\sin(\\omega t) \\approx ${liveB.toFixed(2)}` },
              { label: 'EMF(t)', math: `\\mathcal{E} \\approx ${liveEmf.toFixed(2)}\\text{ (arb.)}`, color: Math.abs(liveEmf) > 0.5 ? 'text-amber-600 dark:text-amber-400 font-bold' : '' },
            ]}
          />
          <TheoryGuide>
            <p><strong>Induction:</strong> A changing magnetic field generates an Electric Field (EMF).</p>
            <p>
              <strong>Lenz&apos;s Law logic:</strong><br />
              1. B (Out) Increasing<br />
              2. Flux <MathWrapper formula="\Phi" /> increases Out<br />
              3. Nature opposes change -&gt; Needs Induced B (In)<br />
              4. RHR: Thumb In -&gt; Fingers <span className="font-bold text-amber-600">CW &#x21bb;</span>
            </p>
          </TheoryGuide>
        </div>
      }
    />
  );
}
