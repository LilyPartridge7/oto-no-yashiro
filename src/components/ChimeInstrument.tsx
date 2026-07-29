import React, { useEffect, useState, useRef } from 'react';
import { InstrumentDef } from '../data/instruments';
import { useChimePhysics } from '../hooks/useChimePhysics';
import { audioEngine } from '../audio/audioEngine';

interface ChimeInstrumentProps {
  instrument: InstrumentDef;
  isTriggeredExternally: boolean;
  windForce: number;
  onStrike?: (instId: string) => void;
}

export const ChimeInstrument: React.FC<ChimeInstrumentProps> = ({
  instrument,
  isTriggeredExternally,
  windForce,
  onStrike,
}) => {
  const { angle, isDragging, applyImpulse, startDrag, updateDrag, endDrag } = useChimePhysics({
    stiffness: instrument.type === 'temple_bonsho' ? 0.04 : 0.09,
    damping: instrument.type === 'temple_bonsho' ? 0.96 : 0.93,
    maxAngle: 30,
  });

  const [ripples, setRipples] = useState<{ id: number }[]>([]);
  const [showKeyHint, setShowKeyHint] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Apply wind sway
  useEffect(() => {
    if (Math.abs(windForce) > 0.05 && !isDragging) {
      applyImpulse(windForce * 0.4);
    }
  }, [windForce, applyImpulse, isDragging]);

  // Handle external trigger (Keyboard or Melody of the Wind)
  useEffect(() => {
    if (isTriggeredExternally) {
      triggerStrike(1.0);
    }
  }, [isTriggeredExternally]);

  const triggerStrike = (intensity = 1.0) => {
    audioEngine.playInstrument(instrument, intensity);
    applyImpulse((Math.random() > 0.5 ? 1 : -1) * (12 + intensity * 10));

    // Add sound wave visual ripple
    setRipples(prev => [...prev.slice(-3), { id: Date.now() + Math.random() }]);

    // Flash key label hint
    setShowKeyHint(true);
    setTimeout(() => setShowKeyHint(false), 1400);

    if (onStrike) onStrike(instrument.id);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startDrag(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateDrag(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      const intensity = endDrag();
      triggerStrike(Math.max(0.6, intensity * 1.5));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center group cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'top center',
        transition: isDragging ? 'none' : 'transform 0.05s linear',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="button"
      tabIndex={0}
      aria-label={`Play ${instrument.nameEn} — ${instrument.nameJa} (Key ${instrument.keyLabel})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          triggerStrike(1.0);
        }
      }}
    >
      {/* Hanging Cord / Rope */}
      <div
        className="w-[2px] bg-gradient-to-b from-amber-900 via-amber-700 to-amber-950 shadow-sm"
        style={{ height: `${instrument.yOffset}px` }}
      />

      {/* Visual Instrument Body */}
      <div className="relative flex flex-col items-center">
        {/* Glow Ring on strike */}
        {ripples.map(r => (
          <div
            key={r.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/60 animate-ring-pulse pointer-events-none z-20"
            style={{
              width: '140px',
              height: '140px',
              boxShadow: `0 0 25px ${instrument.accentGlow}`,
            }}
            onAnimationEnd={() => {
              setRipples(prev => prev.filter(item => item.id !== r.id));
            }}
          />
        ))}

        {/* Keybinding pill hint */}
        <div
          className={`absolute -top-7 px-2 py-0.5 rounded-full text-xs font-mono font-bold border border-amber-400/40 bg-slate-900/80 text-amber-200 shadow-lg transition-opacity duration-300 ${
            showKeyHint ? 'opacity-100 scale-110' : 'opacity-0 scale-90 group-hover:opacity-100'
          }`}
        >
          {instrument.keyLabel}
        </div>

        {/* SVG Instrument Visuals */}
        {instrument.type === 'glass_high' && (
          <div className="flex flex-col items-center">
            {/* Glass Dome */}
            <svg width="70" height="65" viewBox="0 0 70 65" className="drop-shadow-lg">
              <defs>
                <linearGradient id="glassGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#bae6fd" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path d="M 15 55 C 15 20, 20 8, 35 8 C 50 8, 55 20, 55 55 Z" fill="url(#glassGrad1)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              {/* Glass Rim highlight */}
              <ellipse cx="35" cy="55" rx="20" ry="4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
            </svg>
            {/* Tanzaku Paper Strip */}
            <div
              className="w-4 h-24 bg-gradient-to-b from-rose-100/90 via-pink-200/80 to-rose-300/90 shadow-md border-t border-amber-800/40 flex flex-col items-center justify-center text-[10px] text-amber-950 font-serif tracking-widest leading-none pt-1"
              style={{
                transform: `rotate(${angle * 0.4}deg)`,
                transformOrigin: 'top center',
              }}
            >
              清
              <br />
              風
            </div>
          </div>
        )}

        {instrument.type === 'bronze_medium' && (
          <svg width="90" height="95" viewBox="0 0 90 95" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="bronzeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="40%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>
            {/* Top Ring Handle */}
            <circle cx="45" cy="14" r="7" fill="none" stroke="#d97706" strokeWidth="3" />
            {/* Main Bell Body */}
            <path d="M 22 80 C 22 40, 26 22, 45 22 C 64 22, 68 40, 68 80 C 74 84, 16 84, 22 80 Z" fill="url(#bronzeGrad)" stroke="#78350f" strokeWidth="2" />
            {/* Decorative Engraving Lines */}
            <line x1="24" y1="42" x2="66" y2="42" stroke="#92400e" strokeWidth="2" />
            <line x1="23" y1="62" x2="67" y2="62" stroke="#92400e" strokeWidth="2" />
            {/* Bottom Rim */}
            <rect x="20" y="78" width="50" height="6" rx="2" fill="#78350f" stroke="#fbbf24" strokeWidth="0.8" />
          </svg>
        )}

        {instrument.type === 'wood_mokugyo' && (
          <svg width="85" height="75" viewBox="0 0 85 75" className="drop-shadow-xl">
            <defs>
              <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="60%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
            </defs>
            {/* Carved Fish-Shaped Woodblock */}
            <path d="M 12 38 C 12 18, 30 12, 42 12 C 65 12, 75 22, 75 38 C 75 56, 58 64, 42 64 C 24 64, 12 56, 12 38 Z" fill="url(#woodGrad)" stroke="#451a03" strokeWidth="2.5" />
            {/* Slit Hole */}
            <path d="M 28 38 Q 42 30 56 38" fill="none" stroke="#1c1917" strokeWidth="4.5" strokeLinecap="round" />
            {/* Carving Detailing */}
            <circle cx="26" cy="26" r="3.5" fill="#fef3c7" opacity="0.8" />
          </svg>
        )}

        {instrument.type === 'temple_bonsho' && (
          <svg width="120" height="135" viewBox="0 0 120 135" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="bonshoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="35%" stopColor="#92400e" />
                <stop offset="80%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
            </defs>
            {/* Dragon Ring Crown (Ryūzu) */}
            <path d="M 50 16 Q 60 4 70 16 Z" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Grand Bell Dome */}
            <path d="M 25 115 C 25 50, 32 25, 60 25 C 88 25, 95 50, 95 115 C 102 122, 18 122, 25 115 Z" fill="url(#bonshoGrad)" stroke="#292524" strokeWidth="3" />
            {/* Bronze Studs (Nyū) Grid */}
            <circle cx="44" cy="45" r="2.2" fill="#fbbf24" />
            <circle cx="52" cy="45" r="2.2" fill="#fbbf24" />
            <circle cx="60" cy="45" r="2.2" fill="#fbbf24" />
            <circle cx="68" cy="45" r="2.2" fill="#fbbf24" />
            <circle cx="76" cy="45" r="2.2" fill="#fbbf24" />
            <circle cx="44" cy="54" r="2.2" fill="#fbbf24" />
            <circle cx="52" cy="54" r="2.2" fill="#fbbf24" />
            <circle cx="60" cy="54" r="2.2" fill="#fbbf24" />
            <circle cx="68" cy="54" r="2.2" fill="#fbbf24" />
            <circle cx="76" cy="54" r="2.2" fill="#fbbf24" />
            {/* Striking Panel (Tsukiza) */}
            <circle cx="60" cy="85" r="9" fill="#78350f" stroke="#fef3c7" strokeWidth="1.5" />
            {/* Lower Lip Rim */}
            <rect x="22" y="114" width="76" height="8" rx="2" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        )}

        {instrument.type === 'glass_low' && (
          <div className="flex flex-col items-center">
            {/* Amber Glass Dome */}
            <svg width="75" height="70" viewBox="0 0 75 70" className="drop-shadow-lg">
              <defs>
                <linearGradient id="glassGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d="M 15 60 C 15 22, 22 10, 37.5 10 C 53 10, 60 22, 60 60 Z" fill="url(#glassGrad2)" stroke="rgba(254, 215, 170, 0.8)" strokeWidth="1.5" />
              <ellipse cx="37.5" cy="60" rx="22.5" ry="4" fill="none" stroke="rgba(254, 215, 170, 0.9)" strokeWidth="1.2" />
            </svg>
            {/* Amber Tanzaku Paper Strip */}
            <div
              className="w-4 h-28 bg-gradient-to-b from-amber-100/90 via-orange-200/80 to-amber-300/90 shadow-md border-t border-amber-800/40 flex flex-col items-center justify-center text-[10px] text-amber-950 font-serif tracking-widest leading-none pt-1"
              style={{
                transform: `rotate(${angle * 0.4}deg)`,
                transformOrigin: 'top center',
              }}
            >
              夕
              <br />
              霧
            </div>
          </div>
        )}
      </div>

      {/* Label Subtitle below */}
      <div className="mt-2 text-center pointer-events-none">
        <span className="text-[11px] font-serif text-amber-100/80 tracking-wider block drop-shadow-md">
          {instrument.nameJa}
        </span>
        <span className="text-[9px] font-sans text-slate-400 uppercase tracking-widest block opacity-75">
          {instrument.nameEn}
        </span>
      </div>
    </div>
  );
};
