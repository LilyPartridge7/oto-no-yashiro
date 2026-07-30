import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Pause, RefreshCw, Wind } from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface CascadeChimeSlideProps {
  reducedMotion: boolean;
}

export const CascadeChimeSlide: React.FC<CascadeChimeSlideProps> = ({ reducedMotion }) => {
  const TOTAL_COLS = 36;
  const BEADS_PER_COL = 9;

  // Angular displacement and wave state
  const [angles, setAngles] = useState<number[]>(Array(TOTAL_COLS).fill(0));
  const [activeColIndex, setActiveColIndex] = useState<number | null>(null);
  const [isAutoSweeping, setIsAutoSweeping] = useState<boolean>(false);

  const anglesRef = useRef<number[]>(Array(TOTAL_COLS).fill(0));
  const velsRef = useRef<number[]>(Array(TOTAL_COLS).fill(0));
  const lastAudioTimeRef = useRef<number[]>(Array(TOTAL_COLS).fill(0));
  const animFrameRef = useRef<number | null>(null);
  const waveTimeRef = useRef<number>(0);

  // Natural fluid wave physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = Math.min(0.032, (now - lastTime) / 1000);
      lastTime = now;
      waveTimeRef.current += dt;

      const nextAngles = [...anglesRef.current];
      let hasMotion = false;

      // Spring-mass wave equation with neighbor coupling for fluid motion
      for (let i = 0; i < TOTAL_COLS; i++) {
        // Restoring torque towards vertical
        const restoringForce = -0.08 * nextAngles[i];

        // Neighbor coupling force (creates fluid wave ripple across adjacent strings)
        const leftAngle = i > 0 ? nextAngles[i - 1] : 0;
        const rightAngle = i < TOTAL_COLS - 1 ? nextAngles[i + 1] : 0;
        const couplingForce = 0.025 * (leftAngle + rightAngle - 2 * nextAngles[i]);

        // Dampened velocity
        velsRef.current[i] = (velsRef.current[i] + (restoringForce + couplingForce)) * 0.94;
        nextAngles[i] += velsRef.current[i];

        if (Math.abs(nextAngles[i]) > 0.02 || Math.abs(velsRef.current[i]) > 0.02) {
          hasMotion = true;
        } else {
          nextAngles[i] = 0;
          velsRef.current[i] = 0;
        }
      }

      anglesRef.current = nextAngles;
      if (hasMotion || isAutoSweeping) {
        setAngles([...nextAngles]);
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSweeping]);

  // Trigger natural wave ripple across curtain
  const triggerColumnWave = (colIdx: number, force: number = 1.0) => {
    if (colIdx < 0 || colIdx >= TOTAL_COLS) return;

    const now = performance.now();
    // Throttle audio per column to avoid harsh stacking
    if (now - (lastAudioTimeRef.current[colIdx] || 0) > 120) {
      lastAudioTimeRef.current[colIdx] = now;
      audioEngine.playCascadeNote(colIdx, TOTAL_COLS, force);
      setActiveColIndex(colIdx);
      setTimeout(() => setActiveColIndex(null), 250);
    }

    // Distribute soft force wave across neighboring columns
    const radius = 4;
    for (let i = Math.max(0, colIdx - radius); i <= Math.min(TOTAL_COLS - 1, colIdx + radius); i++) {
      const dist = Math.abs(i - colIdx);
      const waveFactor = Math.cos((dist / radius) * (Math.PI / 2));
      const impulse = 12 * waveFactor * force * (i < colIdx ? -0.8 : 0.8);
      velsRef.current[i] += impulse;
    }
  };

  // Pointer move handler across curtain container
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colWidth = rect.width / TOTAL_COLS;
    const colIdx = Math.floor(x / colWidth);

    if (colIdx >= 0 && colIdx < TOTAL_COLS) {
      triggerColumnWave(colIdx, 1.0);
    }
  };

  // Continuous gentle wind wave loop for auto sweep
  useEffect(() => {
    if (!isAutoSweeping) return;
    let wavePos = 0;
    let dir = 1;

    const interval = setInterval(() => {
      triggerColumnWave(wavePos, 0.7);
      wavePos += dir;
      if (wavePos >= TOTAL_COLS - 1) dir = -1;
      if (wavePos <= 0) dir = 1;
    }, 120);

    return () => clearInterval(interval);
  }, [isAutoSweeping]);

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative w-full h-screen overflow-hidden select-none bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 animate-fadeIn"
    >
      {/* Soft Ambient Background Light Pulse */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Balanced Header Bar */}
      <div className="relative z-30 pt-16 max-w-xl mx-auto text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif tracking-widest mb-2">
          <Wind className="w-3.5 h-3.5" />
          <span>流動する風鈴の波 — Flowing Cascade Curtain</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-serif font-bold text-slate-50 tracking-wider mb-1 drop-shadow-md">
          「滝鈴の幕」
        </h1>
        <p className="text-xs font-serif text-slate-300/80 tracking-wide">
          Move your cursor softly across the curtain to create fluid waves of chime resonance.
        </p>
      </div>

      {/* Grand Shrine Roof Architecture Header */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none z-20">
        <svg width="100%" height="110" viewBox="0 0 1000 110" preserveAspectRatio="none" className="drop-shadow-2xl">
          <defs>
            <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>
          {/* Main Curved Roof Eaves */}
          <path
            d="M 15 95 Q 250 25 500 20 Q 750 25 985 95 L 965 110 Q 750 40 500 35 Q 250 40 35 110 Z"
            fill="url(#roofGrad)"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          {/* Vermilion Support Beam */}
          <rect x="40" y="92" width="920" height="12" rx="2" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="1" />
        </svg>
      </div>

      {/* Main Cascade Chime Curtain Matrix */}
      <div className="relative w-full max-w-5xl mx-auto h-[55vh] mt-16 flex justify-between items-start z-20 px-4">
        {Array.from({ length: TOTAL_COLS }).map((_, colIdx) => {
          const colAngle = angles[colIdx] || 0;
          const isActive = activeColIndex === colIdx;

          // Parabolic length curve (slightly longer towards center for elegant arch shape)
          const archOffset = Math.sin((colIdx / (TOTAL_COLS - 1)) * Math.PI) * 20;

          return (
            <div
              key={colIdx}
              className="relative flex flex-col items-center group cursor-pointer"
              style={{
                transform: `rotate(${colAngle}deg)`,
                transformOrigin: 'top center',
                transition: 'transform 0.04s linear',
              }}
            >
              {/* String Cord */}
              <div
                className="w-[1.5px] bg-gradient-to-b from-amber-500/70 via-amber-200/40 to-transparent flex flex-col items-center justify-between py-1 transition-all"
                style={{ height: `${44 + archOffset}vh` }}
              >
                {Array.from({ length: BEADS_PER_COL }).map((_, beadIdx) => {
                  const isGlass = beadIdx % 2 === 0;
                  return (
                    <div
                      key={beadIdx}
                      className={`w-2 h-2.5 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'scale-150 bg-amber-300 shadow-[0_0_10px_#fde047]'
                          : isGlass
                          ? 'bg-sky-100/70 border border-sky-200/60 shadow-sm'
                          : 'bg-amber-600/80 border border-amber-400/50'
                      }`}
                    />
                  );
                })}

                {/* Tanzaku Paper Strip */}
                <div
                  className={`w-3 h-14 bg-gradient-to-b from-rose-100/80 to-amber-200/80 text-[7px] font-serif text-amber-950 flex items-center justify-center tracking-widest shadow-md transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{
                    writingMode: 'vertical-rl',
                  }}
                >
                  音
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Controls */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-5xl mx-auto pb-4 pt-3 border-t border-slate-800/60 pointer-events-auto">
        <div className="flex items-center gap-2 text-xs font-serif text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Smooth Glissando Wave Engine</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoSweeping(!isAutoSweeping)}
            className={`px-4 py-1.5 rounded-full text-xs font-serif border flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              isAutoSweeping
                ? 'bg-amber-600 border-amber-300 text-amber-950 font-bold animate-pulse'
                : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-amber-500/50 hover:text-amber-300'
            }`}
          >
            {isAutoSweeping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSweeping ? 'Pause Wind Wave' : 'Auto Wind Wave'}</span>
          </button>

          <button
            onClick={() => {
              setAngles(Array(TOTAL_COLS).fill(0));
              anglesRef.current = Array(TOTAL_COLS).fill(0);
            }}
            className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
            title="Reset Waves"
            aria-label="Reset Waves"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
