import React from 'react';
import { Sparkles } from 'lucide-react';

interface IntroGateProps {
  onEnter: () => void;
}

export const IntroGate: React.FC<IntroGateProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 select-none animate-fadeIn">
      {/* Background Torii Gate Decorative Outline */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 400 400" fill="none" stroke="#f59e0b" strokeWidth="2">
          <path d="M 40 100 Q 200 70 360 100" />
          <path d="M 60 140 H 340" />
          <line x1="100" y1="140" x2="100" y2="380" strokeWidth="12" />
          <line x1="300" y1="140" x2="300" y2="380" strokeWidth="12" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg text-center">
        {/* Japanese Title */}
        <div className="mb-2 text-amber-400 font-serif text-sm tracking-[0.3em] uppercase">
          インタラクティブ音響庭園
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-50 tracking-widest mb-3 drop-shadow-lg">
          「音の社へようこそ」
        </h1>

        <p className="text-sm font-serif text-slate-300 tracking-wider mb-8">
          Welcome to the Shrine of Sound
        </p>

        <p className="text-xs font-sans text-slate-400 max-w-xs leading-relaxed mb-10">
          A tranquil digital sanctuary of Japanese temple bells, wind chimes, and ambient resonance.
        </p>

        {/* Enter Button */}
        <button
          onClick={onEnter}
          className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-serif font-bold text-base tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-300/40"
        >
          <Sparkles className="w-4 h-4 text-amber-950 group-hover:rotate-12 transition-transform" />
          <span>境内に入る</span>
          <span className="text-xs font-sans font-normal opacity-80">(Enter the Shrine)</span>
        </button>

        <span className="mt-6 text-[11px] font-sans text-slate-500">
          Clicking initializes ambient audio synthesis in your browser.
        </span>
      </div>
    </div>
  );
};
