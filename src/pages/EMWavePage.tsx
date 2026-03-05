import { useState, useRef, useEffect, useCallback } from 'react';
import { COLORS, COLORS_DARK, WaveViewMode, type WaveViewModeType } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { ControlPanel } from '@/components/common/ControlPanel';
import { Slider } from '@/components/common/Slider';
import { EquationBox } from '@/components/common/EquationBox';
import { PlayControls } from '@/components/common/PlayControls';
import { HintBox } from '@/components/common/HintBox';
import { MathWrapper } from '@/components/common/MathWrapper';
import { TheoryGuide } from '@/components/common/TheoryGuide';
import { ModuleLayout } from '@/components/common/ModuleLayout';
import type { EMWaveState } from '@/types';

const POINTS = 200;

export default function EMWavePage() {
  const { isDarkMode } = useProgressStore();
  const c = isDarkMode ? COLORS_DARK : COLORS;

  const [viewMode, setViewMode] = useState<WaveViewModeType>(WaveViewMode.VIEW_3D);
  const [state, setState] = useState<EMWaveState>({
    frequency: 1,
    amplitude: 40,
    speed: 1,
    vAmplitude: 80,
    iAmplitude: 60,
    vPhase: 0,
    iPhase: 0,
    isPlaying: true,
    refractiveIndex: 1.0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef(0);

  const formatPhase = (phase: number): string => {
    if (Math.abs(phase) < 0.1) return '';
    return phase > 0 ? `+ ${phase.toFixed(0)}\\degree` : `- ${Math.abs(phase).toFixed(0)}\\degree`;
  };

  const drawAxisSystemLocal = useCallback((
    ctx: CanvasRenderingContext2D,
    startX: number, endX: number, y: number,
    xLabel: string | null, yLabel: string | null
  ) => {
    ctx.strokeStyle = c.AXIS;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
    ctx.fillStyle = c.AXIS;
    ctx.beginPath();
    ctx.moveTo(endX, y);
    ctx.lineTo(endX - 8, y - 4);
    ctx.lineTo(endX - 8, y + 4);
    ctx.fill();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = c.TEXT_MAIN;
    ctx.textAlign = 'left';
    if (xLabel) ctx.fillText(xLabel, endX + 10, y + 4);
    if (yLabel) {
      ctx.strokeStyle = c.AXIS;
      ctx.beginPath();
      const axisH = 110;
      ctx.moveTo(startX, y + axisH);
      ctx.lineTo(startX, y - axisH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX, y - axisH);
      ctx.lineTo(startX - 4, y - axisH + 8);
      ctx.lineTo(startX + 4, y - axisH + 8);
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.fillText(yLabel, startX, y - axisH - 10);
    }
  }, [c]);

  const draw3DAxisArrows = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = c.AXIS;
    ctx.lineWidth = 1;
    const axisLen = 110;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - axisLen);
    ctx.stroke();
    ctx.fillStyle = c.E_FIELD;
    ctx.fillText('y (E)', x + 5, y - axisLen);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 50, y + 60);
    ctx.stroke();
    ctx.fillStyle = c.B_FIELD;
    ctx.fillText('z (B)', x - 60, y + 60);
  }, [c]);

  const drawVIView = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number, height: number,
    t: number, omega: number
  ) => {
    const centerY = height / 2;
    const startX = 250;
    const endX = width - 20;

    // Axes for waveform area
    ctx.strokeStyle = c.AXIS;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    ctx.lineTo(endX, centerY);
    const axisH = 110;
    ctx.moveTo(startX, centerY + axisH);
    ctx.lineTo(startX, centerY - axisH);
    ctx.stroke();

    ctx.fillStyle = c.TEXT_MAIN;
    ctx.font = '10px sans-serif';
    ctx.fillText('Time (t)', endX - 30, centerY + 15);
    ctx.fillText('Amplitude', startX + 5, centerY - axisH - 5);

    // Phasor diagram
    const phasorCX = 120, phasorCY = centerY, phasorRadius = 70;
    ctx.beginPath();
    ctx.strokeStyle = c.GRID;
    ctx.arc(phasorCX, phasorCY, phasorRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = c.TEXT_MUTED;
    ctx.textAlign = 'center';
    ctx.fillText('0 rad / 0\u00B0', phasorCX + phasorRadius + 30, phasorCY + 3);

    const radV = (state.vPhase * Math.PI) / 180;
    const radI = (state.iPhase * Math.PI) / 180;
    const timeAngle = omega * t * 0.02 * state.speed;

    // V phasor arrow
    const vAngle = timeAngle + radV;
    const vPx = phasorCX + state.vAmplitude * Math.cos(vAngle);
    const vPy = phasorCY - state.vAmplitude * Math.sin(vAngle);
    ctx.beginPath();
    ctx.strokeStyle = c.E_FIELD;
    ctx.lineWidth = 3;
    ctx.moveTo(phasorCX, phasorCY);
    ctx.lineTo(vPx, vPy);
    ctx.stroke();

    // I phasor arrow
    const iAngle = timeAngle + radI;
    const iPx = phasorCX + state.iAmplitude * Math.cos(iAngle);
    const iPy = phasorCY - state.iAmplitude * Math.sin(iAngle);
    ctx.beginPath();
    ctx.strokeStyle = c.CURRENT;
    ctx.lineWidth = 3;
    ctx.moveTo(phasorCX, phasorCY);
    ctx.lineTo(iPx, iPy);
    ctx.stroke();

    ctx.lineWidth = 2;

    // V(t) waveform
    ctx.beginPath();
    for (let x = 0; x < (endX - startX); x++) {
      const ct = t * state.speed + x * 0.05;
      const gx = startX + x;
      const vVal = state.vAmplitude * Math.sin(omega * 0.02 * ct + radV);
      const vY = centerY - vVal;
      if (x === 0) ctx.moveTo(gx, vY); else ctx.lineTo(gx, vY);
    }
    ctx.strokeStyle = c.E_FIELD;
    ctx.stroke();

    // I(t) waveform
    ctx.beginPath();
    for (let x = 0; x < (endX - startX); x++) {
      const ct = t * state.speed + x * 0.05;
      const gx = startX + x;
      const iVal = state.iAmplitude * Math.sin(omega * 0.02 * ct + radI);
      const iY = centerY - iVal;
      if (x === 0) ctx.moveTo(gx, iY); else ctx.lineTo(gx, iY);
    }
    ctx.strokeStyle = c.CURRENT;
    ctx.stroke();

    // Phase Lead/Lag Logic
    let diff = (state.vPhase - state.iPhase) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    let leadLagText = 'In Phase';
    if (diff > 0.1) leadLagText = 'V leads I';
    else if (diff < -0.1) leadLagText = 'V lags I';

    // Draw Phase Arc on Phasor Diagram
    if (Math.abs(diff) > 1) {
      ctx.beginPath();
      ctx.strokeStyle = c.TEXT_MAIN;
      ctx.lineWidth = 1;
      ctx.arc(phasorCX, phasorCY, 40, -iAngle, -vAngle, diff > 0);
      ctx.stroke();
    }
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = c.TEXT_MAIN;
    ctx.textAlign = 'center';
    ctx.fillText(leadLagText, phasorCX, phasorCY + phasorRadius + 20);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = c.TEXT_MUTED;
    ctx.fillText(`\u0394\u03C6 = ${Math.abs(diff).toFixed(0)}\u00B0`, phasorCX, phasorCY + phasorRadius + 35);

    // Power Curve Fill & Stroke
    let maxP = 0;
    let maxPx = 0;
    ctx.beginPath();
    ctx.fillStyle = `${c.POWER}20`;
    for (let x = 0; x < (endX - startX); x++) {
      const ct = t * state.speed + x * 0.05;
      const gx = startX + x;
      const vVal = state.vAmplitude * Math.sin(omega * 0.02 * ct + radV);
      const iVal = state.iAmplitude * Math.sin(omega * 0.02 * ct + radI);
      const pVal = (vVal * iVal) / 100;
      const pY = centerY - pVal;
      if (Math.abs(pVal) > maxP) { maxP = Math.abs(pVal); maxPx = gx; }
      if (x === 0) ctx.moveTo(gx, centerY);
      ctx.lineTo(gx, pY);
    }
    ctx.lineTo(endX, centerY);
    ctx.fill();

    // Draw Stroke for Power
    ctx.beginPath();
    ctx.strokeStyle = c.POWER;
    ctx.lineWidth = 1;
    for (let x = 0; x < (endX - startX); x++) {
      const ct = t * state.speed + x * 0.05;
      const gx = startX + x;
      const vVal = state.vAmplitude * Math.sin(omega * 0.02 * ct + radV);
      const iVal = state.iAmplitude * Math.sin(omega * 0.02 * ct + radI);
      const pVal = (vVal * iVal) / 100;
      const pY = centerY - pVal;
      if (x === 0) ctx.moveTo(gx, pY); else ctx.lineTo(gx, pY);
    }
    ctx.stroke();

    if (maxP > 10) {
      ctx.fillStyle = c.POWER;
      ctx.textAlign = 'center';
      ctx.fillText('P(t)', maxPx, centerY - maxP - 10);
    }

    // Phase Diff Dimension Line (Right Graph)
    const periodPx = 1000 / state.frequency;
    const periodY = centerY + 120;
    const pStart = startX;
    const pEnd = startX + periodPx;
    if (pEnd < endX) {
      ctx.strokeStyle = c.TEXT_MAIN;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pStart, periodY);
      ctx.lineTo(pEnd, periodY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pStart, periodY - 4);
      ctx.lineTo(pStart, periodY + 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pEnd, periodY - 4);
      ctx.lineTo(pEnd, periodY + 4);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = c.TEXT_MAIN;
      ctx.fillText('T (Period)', pStart + periodPx / 2, periodY + 15);
    }

    // Amplitude markers
    const vAmpX = startX + 50;
    ctx.strokeStyle = c.TEXT_MUTED;
    ctx.beginPath();
    ctx.moveTo(vAmpX, centerY);
    ctx.lineTo(vAmpX, centerY - state.vAmplitude);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(vAmpX - 3, centerY - state.vAmplitude);
    ctx.lineTo(vAmpX + 3, centerY - state.vAmplitude);
    ctx.stroke();
    ctx.fillStyle = c.TEXT_MAIN;
    ctx.textAlign = 'left';
    ctx.fillText(`V_peak=${state.vAmplitude}`, vAmpX + 5, centerY - state.vAmplitude / 2);

    // Visual Phase Difference Logic
    if (Math.abs(diff) > 1) {
      const pixelPhaseRate = omega * 0.001;
      const globalTime = t * state.speed;
      const currentPhaseAtStart = omega * 0.02 * globalTime + radV;
      let relativePhaseToPeak = (Math.PI / 2) - (currentPhaseAtStart % (2 * Math.PI));
      if (relativePhaseToPeak < 0) relativePhaseToPeak += 2 * Math.PI;
      const distToFirstPeak = relativePhaseToPeak / pixelPhaseRate;
      let vPeakX = startX + distToFirstPeak;
      if (vPeakX < startX + 50) vPeakX += periodPx;
      if (vPeakX > endX - 50) vPeakX -= periodPx;
      const iPeakX = vPeakX + (diff / 360) * periodPx;

      if (vPeakX > startX && vPeakX < endX) {
        const dimY = centerY - state.vAmplitude - 25;
        ctx.strokeStyle = c.TEXT_MAIN;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(vPeakX, dimY);
        ctx.lineTo(iPeakX, dimY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vPeakX, dimY - 3);
        ctx.lineTo(vPeakX, dimY + 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(iPeakX, dimY - 3);
        ctx.lineTo(iPeakX, dimY + 3);
        ctx.stroke();
        ctx.fillStyle = c.TEXT_MAIN;
        ctx.textAlign = 'center';
        ctx.fillText('\u0394\u03C6', (vPeakX + iPeakX) / 2, dimY - 5);
      }
    }
  }, [state, c]);

  const drawWave = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    const t = timeRef.current;
    const omega = 2 * Math.PI * state.frequency;
    const k = (2 * Math.PI * state.frequency * state.refractiveIndex) / 300;
    const bVisualAmplitude = state.amplitude * state.refractiveIndex;

    if (viewMode === WaveViewMode.VIEW_VI) {
      drawVIView(ctx, width, height, t, omega);
      return;
    }

    const startX = 60, endX = width - 40, drawWidth = endX - startX;

    if (viewMode === WaveViewMode.VIEW_2D) {
      const cyE = height * 0.25, cyB = height * 0.75;

      // Separator line
      ctx.strokeStyle = c.GRID;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, height / 2);
      ctx.lineTo(width - 20, height / 2);
      ctx.stroke();

      // E-field axis and wave
      drawAxisSystemLocal(ctx, startX, endX, cyE, 'x', 'E (y)');
      ctx.lineWidth = 3;
      ctx.strokeStyle = c.E_FIELD;
      ctx.beginPath();
      for (let i = 0; i <= POINTS; i++) {
        const x = startX + (i / POINTS) * drawWidth;
        const ph = k * ((i / POINTS) * drawWidth) - omega * t * 0.02 * state.speed;
        const val = state.amplitude * Math.sin(ph);
        const y = cyE - val;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Amplitude marker
      const ampX = startX + 40;
      ctx.strokeStyle = c.TEXT_MUTED;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ampX, cyE);
      ctx.lineTo(ampX, cyE - state.amplitude);
      ctx.stroke();
      ctx.fillStyle = c.TEXT_MAIN;
      ctx.textAlign = 'left';
      ctx.font = '10px sans-serif';
      ctx.fillText(`A=${state.amplitude}`, ampX + 2, cyE - state.amplitude / 2);
      ctx.beginPath();
      ctx.moveTo(ampX - 3, cyE - state.amplitude);
      ctx.lineTo(ampX + 3, cyE - state.amplitude);
      ctx.stroke();

      // Wavelength marker
      const lambdaPx = 300 / (state.frequency * state.refractiveIndex);
      const waveY = cyE + state.amplitude + 25;
      const waveStart = startX + 100;
      const waveEnd = waveStart + lambdaPx;
      if (waveEnd < endX) {
        ctx.strokeStyle = c.TEXT_MAIN;
        ctx.beginPath();
        ctx.moveTo(waveStart, waveY);
        ctx.lineTo(waveEnd, waveY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(waveStart, waveY - 4);
        ctx.lineTo(waveStart, waveY + 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(waveEnd, waveY - 4);
        ctx.lineTo(waveEnd, waveY + 4);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillStyle = c.TEXT_MAIN;
        ctx.fillText(`\u03BB \u2248 ${lambdaPx.toFixed(0)}px`, waveStart + lambdaPx / 2, waveY + 15);
      }

      // B-field axis and wave
      drawAxisSystemLocal(ctx, startX, endX, cyB, 'x', 'B (z)');
      ctx.lineWidth = 3;
      ctx.strokeStyle = c.B_FIELD;
      ctx.beginPath();
      for (let i = 0; i <= POINTS; i++) {
        const x = startX + (i / POINTS) * drawWidth;
        const ph = k * ((i / POINTS) * drawWidth) - omega * t * 0.02 * state.speed;
        const val = bVisualAmplitude * Math.sin(ph);
        const y = cyB - val;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // B-field symbols (dot/cross)
      ctx.fillStyle = c.B_FIELD;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i <= POINTS; i += 10) {
        const x = startX + (i / POINTS) * drawWidth;
        const ph = k * ((i / POINTS) * drawWidth) - omega * t * 0.02 * state.speed;
        const val = bVisualAmplitude * Math.sin(ph);
        if (Math.abs(val) > 5) {
          const symbol = val > 0 ? '\u2299' : '\u2297';
          ctx.fillText(symbol, x, cyB + (val > 0 ? 15 : -15));
        }
      }

      // Energy density bar: u ∝ E² + B² ∝ sin²(kx - ωt) at midpoint
      const midPh = k * (drawWidth / 2) - omega * t * 0.02 * state.speed;
      const sinVal = Math.sin(midPh);
      const uNorm = sinVal * sinVal; // u ∝ sin²
      const barY = height / 2 - 8;
      const barW = 120;
      ctx.fillStyle = isDarkMode ? '#1e293b' : '#f1f5f9';
      ctx.fillRect(endX - barW - 10, barY - 4, barW + 8, 24);
      ctx.fillStyle = '#9333ea';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(endX - barW - 6, barY, barW * uNorm, 8);
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.TEXT_MUTED;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`u(x₀) ∝ E²+B² = ${uNorm.toFixed(2)}`, endX - 6, barY + 20);

      // Poynting vector arrow: S = (1/μ₀)(E×B), always in +x for forward wave
      ctx.fillStyle = '#9333ea';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      const sArrowY = barY - 14;
      const sLen = 40 * uNorm;
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(endX - barW - 6, sArrowY);
      ctx.lineTo(endX - barW - 6 + sLen, sArrowY);
      ctx.stroke();
      if (sLen > 5) {
        ctx.beginPath();
        ctx.moveTo(endX - barW - 6 + sLen, sArrowY);
        ctx.lineTo(endX - barW - 6 + sLen - 5, sArrowY - 3);
        ctx.lineTo(endX - barW - 6 + sLen - 5, sArrowY + 3);
        ctx.fill();
      }
      ctx.fillText('S (Poynting)', endX - barW - 6 + sLen + 4, sArrowY + 3);
    } else {
      // 3D View
      const centerY = height / 2;
      drawAxisSystemLocal(ctx, startX, endX, centerY, 'x', '');
      draw3DAxisArrows(ctx, startX, centerY);

      // Medium visualization
      if (state.refractiveIndex > 1) {
        ctx.fillStyle = `rgba(37, 99, 235, ${0.05 * state.refractiveIndex})`;
        ctx.fillRect(startX, 0, drawWidth, height);
        ctx.fillStyle = c.TEXT_MUTED;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`Medium n=${state.refractiveIndex}`, endX - 10, height - 10);
      }

      // E-field (vertical component)
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.strokeStyle = c.E_FIELD;
      for (let i = 0; i <= POINTS; i++) {
        const x = startX + (i / POINTS) * drawWidth;
        const ph = k * ((i / POINTS) * drawWidth) - omega * t * 0.02 * state.speed;
        const val = state.amplitude * Math.sin(ph);
        const y = centerY - val;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        if (i % 8 === 0) {
          ctx.save();
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2;
          ctx.moveTo(x, centerY);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.restore();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();

      // B-field (perspective/depth component)
      ctx.beginPath();
      ctx.strokeStyle = c.B_FIELD;
      for (let i = 0; i <= POINTS; i++) {
        const x = startX + (i / POINTS) * drawWidth;
        const ph = k * ((i / POINTS) * drawWidth) - omega * t * 0.02 * state.speed;
        const val = bVisualAmplitude * Math.sin(ph);
        const drawX = x - val * 0.5;
        const drawY = centerY + val * 0.6;
        if (i === 0) ctx.moveTo(drawX, drawY); else ctx.lineTo(drawX, drawY);
        if (i % 8 === 0) {
          ctx.save();
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2;
          ctx.moveTo(x, centerY);
          ctx.lineTo(drawX, drawY);
          ctx.stroke();
          ctx.restore();
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
        }
      }
      ctx.stroke();
    }
  }, [state, viewMode, drawVIView, drawAxisSystemLocal, draw3DAxisArrows, c, isDarkMode]);

  // Animation loop
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const parent = canvas.parentElement;
          if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
          }
          drawWave(ctx, canvas.width, canvas.height);
        }
      }
      if (state.isPlaying) timeRef.current += 1;
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [drawWave, state.isPlaying]);

  // Computed values for equations
  const omega = (2 * Math.PI * state.frequency).toFixed(2);
  const lambda = (300 / (state.frequency * state.refractiveIndex)).toFixed(0);
  const kVal = ((2 * Math.PI) / parseFloat(lambda)).toFixed(3);
  const phaseDiff = state.vPhase - state.iPhase;
  const pAvg = (0.5 * state.vAmplitude * state.iAmplitude * Math.cos(phaseDiff * Math.PI / 180)).toFixed(0);

  return (
    <ModuleLayout
      moduleId="em-wave"
      simulation={
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex-grow relative min-h-[350px]">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {[WaveViewMode.VIEW_2D, WaveViewMode.VIEW_3D, WaveViewMode.VIEW_VI].map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-3 py-1 rounded text-xs font-bold border ${
                      viewMode === m
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <canvas ref={canvasRef} className="w-full h-full" role="img" aria-label="Electromagnetic wave simulation showing E and B field oscillations" />
            </div>
            {viewMode === WaveViewMode.VIEW_VI && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
                <strong>AC Circuits &amp; EM Waves:</strong> Maxwell&apos;s equations predict that time-varying fields propagate as waves.
                In circuits, the same sinusoidal solutions appear as voltage/current phasors. The power factor
                <MathWrapper latex="\cos(\Delta\phi)" /> determines energy transfer efficiency.
              </div>
            )}
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <ControlPanel title="Configuration">
              {viewMode !== WaveViewMode.VIEW_VI && (
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">
                    Propagation Medium (n)
                  </label>
                  <select
                    value={state.refractiveIndex}
                    onChange={(e) => setState((s) => ({ ...s, refractiveIndex: parseFloat(e.target.value) }))}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-sm"
                  >
                    <option value="1.0">Vacuum (n=1.00)</option>
                    <option value="1.33">Water (n=1.33)</option>
                    <option value="1.5">Glass (n=1.50)</option>
                  </select>
                </div>
              )}
              <Slider
                label="Frequency"
                value={state.frequency}
                min={0.5}
                max={3.0}
                step={0.1}
                onChange={(v) => setState((s) => ({ ...s, frequency: v }))}
                color="bg-purple-600"
              />
              {viewMode !== WaveViewMode.VIEW_VI && (
                <Slider
                  label="Amplitude"
                  value={state.amplitude}
                  min={10}
                  max={100}
                  onChange={(v) => setState((s) => ({ ...s, amplitude: v }))}
                  color="bg-pink-600"
                />
              )}
              {viewMode === WaveViewMode.VIEW_VI && (
                <>
                  <Slider
                    label="V Peak"
                    value={state.vAmplitude}
                    min={10}
                    max={100}
                    onChange={(v) => setState((s) => ({ ...s, vAmplitude: v }))}
                    color="bg-red-600"
                  />
                  <Slider
                    label="V Phase"
                    value={state.vPhase}
                    min={-180}
                    max={180}
                    onChange={(v) => setState((s) => ({ ...s, vPhase: v }))}
                    color="bg-red-600"
                  />
                  <Slider
                    label="I Peak"
                    value={state.iAmplitude}
                    min={10}
                    max={100}
                    onChange={(v) => setState((s) => ({ ...s, iAmplitude: v }))}
                    color="bg-amber-600"
                  />
                  <Slider
                    label="I Phase"
                    value={state.iPhase}
                    min={-180}
                    max={180}
                    onChange={(v) => setState((s) => ({ ...s, iPhase: v }))}
                    color="bg-amber-600"
                  />
                </>
              )}
              <Slider
                label="Speed"
                value={state.speed}
                min={0}
                max={3}
                step={0.1}
                onChange={(v) => setState((s) => ({ ...s, speed: v }))}
                color="bg-emerald-600"
              />
              <PlayControls
                isPlaying={state.isPlaying}
                onToggle={() => setState((s) => ({ ...s, isPlaying: !s.isPlaying }))}
                onReset={() => setState((s) => ({ ...s, vPhase: 0, iPhase: 0, speed: 1 }))}
              />
              <HintBox>
                {viewMode === WaveViewMode.VIEW_VI
                  ? 'Set V and I phase difference to 90\u00B0 to see power drop to zero (Pure Inductive/Capacitive Load).'
                  : 'Increase the Refractive Index (n) to see the wave slow down and the wavelength shorten.'}
              </HintBox>
            </ControlPanel>
          </div>
        </div>
      }
      theory={
        <div className="space-y-6">
          <EquationBox
            title={viewMode === WaveViewMode.VIEW_VI ? 'AC Circuit Analysis' : 'Wave Function'}
            equations={
              viewMode !== WaveViewMode.VIEW_VI
                ? [
                    { label: 'E(x,t)', math: `E_0 \\sin(kx - \\omega t),\\quad k=${kVal},\\; \\omega=${omega}`, color: 'text-red-600' },
                    { label: 'B(x,t)', math: `\\frac{E_0}{v} \\sin(kx - \\omega t) = \\frac{n E_0}{c} \\sin(kx - \\omega t)`, color: 'text-blue-600' },
                    { label: 'Velocity', math: `v = \\frac{c}{n} = \\frac{c}{${state.refractiveIndex}}` },
                    { label: 'Wavelength', math: `\\lambda = \\frac{\\lambda_0}{n} \\approx ${lambda} \\text{ (arb.)}` },
                    { label: 'Energy', math: 'u = \\frac{1}{2}\\epsilon_0 E^2 + \\frac{1}{2\\mu_0} B^2', color: 'text-purple-600 dark:text-purple-400' },
                    { label: 'Poynting', math: '\\vec{S} = \\frac{1}{\\mu_0}(\\vec{E} \\times \\vec{B})', color: 'text-purple-600 dark:text-purple-400' },
                  ]
                : [
                    { label: 'v(t)', math: `${state.vAmplitude}\\sin(\\omega t ${formatPhase(state.vPhase)})`, color: 'text-red-600' },
                    { label: 'i(t)', math: `${state.iAmplitude}\\sin(\\omega t ${formatPhase(state.iPhase)})`, color: 'text-amber-600' },
                    { label: 'p(t)', math: 'v(t) \\cdot i(t)', color: 'text-purple-600' },
                    { label: 'Power', math: `P_{avg} = \\frac{1}{2}V_0 I_0 \\cos(\\Delta\\phi) \\approx ${pAvg} \\text{ W}`, color: 'text-slate-700 dark:text-slate-300' },
                    { label: 'Phase Diff', math: `\\Delta\\phi = \\phi_v - \\phi_i = ${phaseDiff.toFixed(0)}^\\circ` },
                  ]
            }
          />
          <TheoryGuide>
            {viewMode === WaveViewMode.VIEW_VI ? (
              <>
                <p>
                  <strong>Instantaneous Power:</strong>{' '}
                  <MathWrapper latex="p(t) = v(t) \cdot i(t)" />. It oscillates at{' '}
                  <MathWrapper latex="2\omega" />.
                </p>
                <p>
                  <strong>Average Power:</strong> Depends on phase difference{' '}
                  <MathWrapper latex="\Delta\phi" />. Max when in phase (
                  <MathWrapper latex="\Delta\phi=0" />), zero when{' '}
                  <MathWrapper latex="90^\circ" /> out of phase.
                </p>
              </>
            ) : (
              <>
                <p>
                  An EM wave consists of oscillating{' '}
                  <strong className="text-red-600 dark:text-red-400">Electric (E)</strong> and{' '}
                  <strong className="text-blue-600 dark:text-blue-400">Magnetic (B)</strong> fields.
                  They are perpendicular to each other and to the direction of propagation.
                </p>
                <p>
                  In a vacuum, velocity <MathWrapper latex="v = c" />. In a medium with refractive
                  index <MathWrapper latex="n" />, velocity becomes <MathWrapper latex="v = c/n" />.
                </p>
              </>
            )}
          </TheoryGuide>
        </div>
      }
    />
  );
}
