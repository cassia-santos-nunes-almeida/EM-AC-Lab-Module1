import { useRef, useEffect, useCallback } from 'react';
import { COLORS, COLORS_DARK } from '@/constants/physics';
import { useProgressStore } from '@/store/progressStore';
import { MathWrapper } from '@/components/common/MathWrapper';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';

interface MaxwellCardProps {
  title: string;
  latex: string;
  description: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
}

function MaxwellCard({ title, latex, description, draw }: MaxwellCardProps) {
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

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <div className="text-center text-lg text-indigo-700 dark:text-indigo-400 mb-2 bg-indigo-50 dark:bg-indigo-900/30 rounded py-2 min-h-[50px] flex items-center justify-center">
        <MathWrapper latex={latex} />
      </div>
      <div className="flex-grow relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden min-h-[160px] mb-2 border border-slate-100 dark:border-slate-700">
        <canvas ref={cvsRef} className="w-full h-full absolute inset-0" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{description}</p>
    </div>
  );
}

export default function MaxwellPage() {
  const { isDarkMode } = useProgressStore();
  const c = isDarkMode ? COLORS_DARK : COLORS;

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

  const drawGaussB = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, _t: number) => {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        <MaxwellCard
          title="1. Gauss's Law (E)"
          latex="\oint \vec{E} \cdot d\vec{A} = \frac{Q}{\epsilon_0}"
          description="Electric charges produce electric fields. Field lines diverge from (+) charges."
          draw={drawGaussE}
        />
        <MaxwellCard
          title="2. Gauss's Law (B)"
          latex="\oint \vec{B} \cdot d\vec{A} = 0"
          description="No magnetic monopoles exist. Magnetic field lines always form closed loops."
          draw={drawGaussB}
        />
        <MaxwellCard
          title="3. Faraday's Law"
          latex="\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}"
          description="Changing B-field induces E-field (and Voltage)."
          draw={drawFaraday}
        />
        <MaxwellCard
          title="4. Ampère-Maxwell"
          latex="\oint \vec{B} \cdot d\vec{l} = \mu_0(I + \epsilon_0 \frac{d\Phi_E}{dt})"
          description="Magnetic fields are generated by currents OR changing E-fields."
          draw={drawAmpere}
        />
      </div>
      <ModuleNavigation currentModuleId="maxwell" />
    </div>
  );
}
