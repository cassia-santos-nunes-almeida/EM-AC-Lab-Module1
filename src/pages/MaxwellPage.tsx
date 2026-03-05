import { useRef, useEffect, useCallback, useState } from 'react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { MathWrapper } from '@/components/common/MathWrapper';
import { ModuleLayout } from '@/components/common/ModuleLayout';

interface MaxwellCardProps {
  title: string;
  latex: string;
  description: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

function MaxwellCard({ title, latex, description, draw, expanded, onToggleExpand }: MaxwellCardProps) {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);

  useEffect(() => {
    let req: number;
    const animate = () => {
      if (cvsRef.current) {
        const c = cvsRef.current;
        const ctx = c.getContext('2d');
        if (ctx) {
          c.width = c.clientWidth;
          c.height = c.clientHeight;
          draw(ctx, c.width, c.height, tRef.current++);
        }
      }
      req = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(req);
  }, [draw]);

  if (expanded) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onToggleExpand}
      >
        <div
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col shadow-xl w-[90vw] max-w-[700px] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            <button
              onClick={onToggleExpand}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none px-2"
              aria-label="Close expanded view"
            >
              &times;
            </button>
          </div>
          <div className="text-center text-xl text-indigo-700 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-indigo-900/30 rounded py-3">
            <MathWrapper latex={latex} />
          </div>
          <div className="flex-grow relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden min-h-[300px] mb-3 border border-slate-100 dark:border-slate-700">
            <canvas ref={cvsRef} className="w-full h-full absolute inset-0" role="img" aria-label={`${title} expanded visualization`} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{description}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">Click outside or &times; to close</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-400 dark:hover:ring-indigo-500 transition-shadow"
      onClick={onToggleExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleExpand?.(); }}
    >
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <div className="text-center text-lg text-indigo-700 dark:text-indigo-400 mb-2 bg-indigo-50 dark:bg-indigo-900/30 rounded py-2 min-h-[50px] flex items-center justify-center">
        <MathWrapper latex={latex} />
      </div>
      <div className="flex-grow relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden min-h-[160px] mb-2 border border-slate-100 dark:border-slate-700">
        <canvas ref={cvsRef} className="w-full h-full absolute inset-0" role="img" aria-label="Maxwell's equation animated visualization" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{description}</p>
      <p className="text-xs text-indigo-400 dark:text-indigo-500 text-center mt-1">Click to expand</p>
    </div>
  );
}

export default function MaxwellPage() {
  const { isDarkMode } = useProgressStore();
  const c = isDarkMode ? COLORS_DARK : COLORS;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const drawGaussE = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = c.E_FIELD;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px sans';
    ctx.fillText('+', cx, cy + 1);
    ctx.strokeStyle = c.E_FIELD;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const rEnd = 70 + (Math.sin(t * 0.05) + 1) * 5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20);
      const tipX = cx + Math.cos(angle) * rEnd;
      const tipY = cy + Math.sin(angle) * rEnd;
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      const headLen = 6;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - headLen * Math.cos(angle - Math.PI / 6), tipY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(tipX - headLen * Math.cos(angle + Math.PI / 6), tipY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.fillStyle = c.E_FIELD;
      ctx.fill();
    }
  }, [c]);

  const drawGaussB = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = c.B_FIELD;
    ctx.fillRect(cx - 30, cy - 12, 30, 24);
    ctx.fillStyle = c.E_FIELD;
    ctx.fillRect(cx, cy - 12, 30, 24);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', cx - 15, cy);
    ctx.fillText('N', cx + 15, cy);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1.5;
    const loops = 4;
    for (let i = 1; i <= loops; i++) {
      const scale = i * 25;
      ctx.beginPath();
      ctx.moveTo(cx + 30, cy);
      ctx.bezierCurveTo(cx + 30 + scale, cy - scale, cx - 30 - scale, cy - scale, cx - 30, cy);
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy - scale * 0.75);
      ctx.rotate(Math.PI);
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.moveTo(-3, -2);
      ctx.lineTo(3, 0);
      ctx.lineTo(-3, 2);
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(cx + 30, cy);
      ctx.bezierCurveTo(cx + 30 + scale, cy + scale, cx - 30 - scale, cy + scale, cx - 30, cy);
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy + scale * 0.75);
      ctx.rotate(Math.PI);
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.moveTo(-3, -2);
      ctx.lineTo(3, 0);
      ctx.lineTo(-3, 2);
      ctx.fill();
      ctx.restore();
    }
  }, [c]);

  const drawFaraday = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2, cy = h / 2;
    const flux = Math.sin(t * 0.05);
    ctx.fillStyle = c.B_FIELD;
    ctx.beginPath();
    ctx.arc(cx, cy, 30 * Math.abs(flux), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(flux > 0 ? '\u2299' : '\u2297', cx, cy);
    ctx.strokeStyle = c.E_FIELD;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.stroke();
    const dFlux = Math.cos(t * 0.05);
    const angle = t * 0.1 * (dFlux > 0 ? -1 : 1);
    ctx.fillStyle = c.E_FIELD;
    ctx.beginPath();
    ctx.arc(cx + 60 * Math.cos(angle), cy + 60 * Math.sin(angle), 4, 0, Math.PI * 2);
    ctx.fill();
  }, [c]);

  const drawAmpere = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = c.CURRENT;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u2297', cx, cy + 1);
    ctx.strokeStyle = c.B_FIELD;
    for (let r = 30; r <= 60; r += 15) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      const angle = t * 0.05 + r;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = c.B_FIELD;
      ctx.beginPath();
      ctx.moveTo(-3, -3);
      ctx.lineTo(3, 0);
      ctx.lineTo(-3, 3);
      ctx.fill();
      ctx.restore();
    }
  }, [c]);

  return (
    <ModuleLayout
      moduleId="maxwell"
      simulation={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          <MaxwellCard
            title="1. Gauss's Law (E)"
            latex="\oint \vec{E} \cdot d\vec{A} = \frac{Q}{\epsilon_0}"
            description="Electric charges produce electric fields. Field lines diverge from (+) charges."
            draw={drawGaussE}
            expanded={expandedCard === 0}
            onToggleExpand={() => setExpandedCard(expandedCard === 0 ? null : 0)}
          />
          <MaxwellCard
            title="2. Gauss's Law (B)"
            latex="\oint \vec{B} \cdot d\vec{A} = 0"
            description="No magnetic monopoles exist. Magnetic field lines always form closed loops."
            draw={drawGaussB}
            expanded={expandedCard === 1}
            onToggleExpand={() => setExpandedCard(expandedCard === 1 ? null : 1)}
          />
          <MaxwellCard
            title="3. Faraday's Law"
            latex="\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}"
            description="Changing B-field induces E-field (and Voltage)."
            draw={drawFaraday}
            expanded={expandedCard === 2}
            onToggleExpand={() => setExpandedCard(expandedCard === 2 ? null : 2)}
          />
          <MaxwellCard
            title="4. Ampère-Maxwell"
            latex="\oint \vec{B} \cdot d\vec{l} = \mu_0(I + \epsilon_0 \frac{d\Phi_E}{dt})"
            description="Magnetic fields are generated by currents OR changing E-fields."
            draw={drawAmpere}
            expanded={expandedCard === 3}
            onToggleExpand={() => setExpandedCard(expandedCard === 3 ? null : 3)}
          />
        </div>
      }
      theory={
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Maxwell's Equations — The Complete Framework</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              James Clerk Maxwell unified electricity, magnetism, and optics into four elegant equations.
              Together they describe how electric and magnetic fields are generated, interact, and propagate as electromagnetic waves.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">1. Gauss's Law (E)</h4>
                <div className="text-center py-2"><MathWrapper latex="\oint \vec{E} \cdot d\vec{A} = \frac{Q_{enc}}{\epsilon_0}" /></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Electric flux through a closed surface equals the enclosed charge divided by <MathWrapper latex="\epsilon_0" />. Charges are sources/sinks of electric fields.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">2. Gauss's Law (B)</h4>
                <div className="text-center py-2"><MathWrapper latex="\oint \vec{B} \cdot d\vec{A} = 0" /></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Magnetic flux through a closed surface is always zero. There are no magnetic monopoles — field lines always form closed loops.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">3. Faraday's Law</h4>
                <div className="text-center py-2"><MathWrapper latex="\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}" /></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">A changing magnetic flux induces an electric field (EMF). This is the basis for generators, transformers, and inductors.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">4. Ampère–Maxwell</h4>
                <div className="text-center py-2"><MathWrapper latex="\oint \vec{B} \cdot d\vec{l} = \mu_0\left(I_{enc} + \epsilon_0 \frac{d\Phi_E}{dt}\right)" /></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Magnetic fields are generated by currents AND changing electric fields. Maxwell's displacement current term (<MathWrapper latex="\epsilon_0 \frac{d\Phi_E}{dt}" />) predicts electromagnetic waves.</p>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
