import React, { useState } from 'react';
import { InstrumentDef, INSTRUMENTS } from '../data/instruments';
import { MoodDef } from '../data/moods';
import { ChimeInstrument } from './ChimeInstrument';
import { ParticleLayer } from './ParticleLayer';
import { WaterSurface } from './WaterSurface';

interface ShrineSceneProps {
  mood: MoodDef;
  reducedMotion: boolean;
  activeInstrumentId: string | null;
  windForce: number;
  onOpenEmaModal: () => void;
  emaWish: string;
}

export const ShrineScene: React.FC<ShrineSceneProps> = ({
  mood,
  reducedMotion,
  activeInstrumentId,
  windForce,
  onOpenEmaModal,
  emaWish,
}) => {
  const [lanternLit, setLanternLit] = useState<boolean>(true);

  const toggleLantern = () => {
    setLanternLit(prev => !prev);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none transition-all duration-1000"
      style={{ background: mood.skyGradient }}
    >
      {/* Background Mountain Silhouettes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <path
            d="M 0 550 Q 300 380 650 480 Q 950 360 1440 520 L 1440 900 L 0 900 Z"
            fill="#090d16"
          />
          <path
            d="M 0 620 Q 450 480 850 560 Q 1200 460 1440 600 L 1440 900 L 0 900 Z"
            fill="#030712"
          />
        </svg>
      </div>

      {/* Sun / Moon celestial body */}
      <div
        className="absolute top-16 right-24 w-32 h-32 rounded-full pointer-events-none transition-all duration-1000 opacity-80"
        style={{
          background: mood.id === 'moonlit_night'
            ? 'radial-gradient(circle, #f8fafc 0%, #cbd5e1 50%, rgba(203, 213, 225, 0) 100%)'
            : mood.id === 'morning_mist'
            ? 'radial-gradient(circle, #fef08a 0%, #fde047 40%, rgba(253, 224, 71, 0) 100%)'
            : 'radial-gradient(circle, #fdba74 0%, #f97316 50%, rgba(249, 115, 22, 0) 100%)',
          filter: 'blur(4px)',
          boxShadow: mood.id === 'moonlit_night'
            ? '0 0 60px rgba(248, 250, 252, 0.4)'
            : '0 0 70px rgba(251, 146, 60, 0.5)',
        }}
      />

      {/* Bamboo Grove Silhouettes on Edges */}
      <div className="absolute top-0 left-0 bottom-0 w-32 md:w-48 pointer-events-none opacity-60">
        <svg width="100%" height="100%" viewBox="0 0 160 800" preserveAspectRatio="none">
          <rect x="20" y="0" width="8" height="800" fill="#064e3b" opacity="0.6" />
          <rect x="55" y="0" width="12" height="800" fill="#022c22" opacity="0.8" />
          <rect x="105" y="0" width="6" height="800" fill="#065f46" opacity="0.5" />
          {/* Bamboo Leaves */}
          <path d="M 55 200 Q 20 180 10 210 Z" fill="#047857" />
          <path d="M 55 350 Q 90 330 110 360 Z" fill="#047857" />
          <path d="M 20 450 Q -10 430 -20 460 Z" fill="#065f46" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 bottom-0 w-32 md:w-48 pointer-events-none opacity-60">
        <svg width="100%" height="100%" viewBox="0 0 160 800" preserveAspectRatio="none">
          <rect x="30" y="0" width="10" height="800" fill="#022c22" opacity="0.8" />
          <rect x="90" y="0" width="7" height="800" fill="#064e3b" opacity="0.6" />
          <path d="M 30 180 Q 70 160 90 190 Z" fill="#047857" />
          <path d="M 90 320 Q 130 300 150 330 Z" fill="#065f46" />
        </svg>
      </div>

      {/* Stone Pathway leading upwards */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-80 pointer-events-none opacity-70">
        <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="none">
          <polygon points="120,0 180,0 260,400 40,400" fill="#1e293b" opacity="0.5" />
          <ellipse cx="150" cy="80" rx="35" ry="10" fill="#334155" />
          <ellipse cx="150" cy="180" rx="55" ry="16" fill="#334155" />
          <ellipse cx="150" cy="300" rx="85" ry="24" fill="#334155" />
        </svg>
      </div>

      {/* Stone Lantern Left */}
      <div
        onClick={toggleLantern}
        className="absolute bottom-28 left-6 md:left-24 z-20 cursor-pointer group flex flex-col items-center"
        title="Click stone lantern to toggle light"
        role="button"
        tabIndex={0}
        aria-label="Stone lantern left — click to toggle light"
      >
        <svg width="60" height="110" viewBox="0 0 60 110" className="drop-shadow-2xl">
          {/* Stone Roof */}
          <polygon points="30,10 5,28 55,28" fill="#334155" />
          {/* Light Chamber */}
          <rect x="15" y="28" width="30" height="28" fill={lanternLit ? '#f59e0b' : '#1e293b'} className="transition-colors duration-500" />
          {lanternLit && (
            <circle cx="30" cy="42" r="8" fill="#fef08a" className="animate-lantern-glow" />
          )}
          {/* Stone Pillar */}
          <rect x="22" y="56" width="16" height="40" fill="#1e293b" />
          <rect x="12" y="96" width="36" height="12" rx="2" fill="#0f172a" />
        </svg>
        {lanternLit && (
          <div className="absolute top-6 w-32 h-32 bg-amber-500/20 rounded-full blur-xl pointer-events-none animate-lantern-glow" />
        )}
      </div>

      {/* Stone Lantern Right */}
      <div
        onClick={toggleLantern}
        className="absolute bottom-28 right-6 md:right-24 z-20 cursor-pointer group flex flex-col items-center"
        title="Click stone lantern to toggle light"
        role="button"
        tabIndex={0}
        aria-label="Stone lantern right — click to toggle light"
      >
        <svg width="60" height="110" viewBox="0 0 60 110" className="drop-shadow-2xl">
          <polygon points="30,10 5,28 55,28" fill="#334155" />
          <rect x="15" y="28" width="30" height="28" fill={lanternLit ? '#f59e0b' : '#1e293b'} className="transition-colors duration-500" />
          {lanternLit && (
            <circle cx="30" cy="42" r="8" fill="#fef08a" className="animate-lantern-glow" />
          )}
          <rect x="22" y="56" width="16" height="40" fill="#1e293b" />
          <rect x="12" y="96" width="36" height="12" rx="2" fill="#0f172a" />
        </svg>
        {lanternLit && (
          <div className="absolute top-6 w-32 h-32 bg-amber-500/20 rounded-full blur-xl pointer-events-none animate-lantern-glow" />
        )}
      </div>

      {/* Hanging Ema Prayer Plaque Hanger */}
      <div
        onClick={onOpenEmaModal}
        className="absolute top-36 left-8 md:left-20 z-20 cursor-pointer group flex flex-col items-center transition-transform hover:scale-105"
        title="Click to write a wish on the Ema plaque"
        role="button"
        tabIndex={0}
        aria-label="Ema prayer plaque — click to write a wish"
      >
        {/* Cord */}
        <div className="w-[2px] h-12 bg-amber-800" />
        {/* Ema Wooden Plaque Body */}
        <div className="relative w-28 h-20 bg-gradient-to-b from-amber-200 via-amber-100 to-orange-200 rounded border border-amber-900/60 shadow-lg p-2 text-amber-950 flex flex-col justify-between">
          <div className="text-[10px] font-serif font-bold tracking-widest text-center text-amber-900 border-b border-amber-900/20 pb-0.5">
            奉納絵馬
          </div>
          <div className="text-[9px] font-serif italic text-amber-950/80 truncate px-1 text-center">
            {emaWish ? `「${emaWish}」` : '願いを書く...'}
          </div>
          <div className="text-[8px] font-sans text-amber-800 text-right opacity-60">
            Write Wish
          </div>
        </div>
      </div>

      {/* Main Shrine Architecture Structure & Beam */}
      <div className="relative w-full max-w-6xl mx-auto pt-4 md:pt-8 z-30">
        {/* Curved Roof Silhouette */}
        <div className="w-full flex justify-center drop-shadow-2xl">
          <svg width="100%" height="80" viewBox="0 0 1000 80" preserveAspectRatio="none">
            <path
              d="M 20 70 Q 250 20 500 15 Q 750 20 980 70 L 960 80 Q 750 35 500 30 Q 250 35 40 80 Z"
              fill="#1c1917"
            />
            {/* Vermilion Roof Trim Accent */}
            <path
              d="M 40 80 Q 250 35 500 30 Q 750 35 960 80 L 950 84 Q 750 40 500 35 Q 250 40 50 84 Z"
              fill="#991b1b"
            />
          </svg>
        </div>

        {/* Shrine Support Beam holding instruments */}
        <div className="relative w-full h-12 bg-gradient-to-r from-red-950 via-red-800 to-red-950 border-y-2 border-amber-600/70 shadow-2xl flex items-center justify-between px-4">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-400/40" />

          {/* Hanging Instruments Container */}
          <div className="relative w-full h-0">
            {INSTRUMENTS.map(inst => (
              <div
                key={inst.id}
                className="absolute top-0 transform -translate-x-1/2"
                style={{ left: `${inst.xRatio * 100}%` }}
              >
                <ChimeInstrument
                  instrument={inst}
                  isTriggeredExternally={activeInstrumentId === inst.id}
                  windForce={windForce}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Particle Mist & Momiji Layer */}
      <ParticleLayer mood={mood} reducedMotion={reducedMotion} windForce={windForce} />

      {/* Water Surface Pond */}
      <WaterSurface lanternLit={lanternLit} />
    </div>
  );
};
