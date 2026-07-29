import React, { useState } from 'react';
import { audioEngine } from '../audio/audioEngine';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface WaterSurfaceProps {
  lanternLit: boolean;
}

export const WaterSurface: React.FC<WaterSurfaceProps> = ({ lanternLit }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleWaterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: 1,
    };

    setRipples(prev => [...prev.slice(-8), newRipple]); // max 8 ripples
    audioEngine.playWaterSplash();
  };

  return (
    <div
      onClick={handleWaterClick}
      className="absolute bottom-0 left-0 right-0 h-36 md:h-48 cursor-pointer overflow-hidden z-0"
      style={{
        background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(3, 7, 18, 0.85) 100%)',
        backdropFilter: 'blur(3px)',
      }}
      aria-label="Interactive Water Pond — Click to create ripples"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          audioEngine.playWaterSplash();
        }
      }}
    >
      {/* Reflected lantern light glow on water surface */}
      {lanternLit && (
        <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-48 h-full bg-amber-500/10 rounded-full blur-2xl pointer-events-none transition-opacity duration-1000" />
      )}
      {lanternLit && (
        <div className="absolute top-0 right-1/4 transform translate-x-1/2 w-48 h-full bg-amber-500/10 rounded-full blur-2xl pointer-events-none transition-opacity duration-1000" />
      )}

      {/* Surface shore line accent */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />

      {/* Ripple Rings */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute rounded-full border border-amber-200/40 animate-ring-pulse pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: '120px',
            height: '40px',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px rgba(254, 215, 170, 0.25)',
          }}
          onAnimationEnd={() => {
            setRipples(prev => prev.filter(item => item.id !== r.id));
          }}
        />
      ))}
    </div>
  );
};
