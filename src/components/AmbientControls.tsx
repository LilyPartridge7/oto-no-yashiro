import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, HelpCircle, Wind, Sparkles, X, Heart } from 'lucide-react';
import { MOODS, MoodDef } from '../data/moods';

interface AmbientControlsProps {
  currentMood: MoodDef;
  onSelectMood: (mood: MoodDef) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMelodyPlaying: boolean;
  onToggleMelody: () => void;
  onOpenEmaModal: () => void;
  interactionHint: string;
}

export const AmbientControls: React.FC<AmbientControlsProps> = ({
  currentMood,
  onSelectMood,
  isMuted,
  onToggleMute,
  isMelodyPlaying,
  onToggleMelody,
  onOpenEmaModal,
  interactionHint,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* Top-Left: Vertical Japanese Title */}
      <div className="fixed top-6 left-6 z-40 flex flex-col items-start pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Vertical Title Badge */}
          <div className="px-2.5 py-3 rounded bg-slate-950/60 backdrop-blur-md border border-amber-500/30 text-amber-200 font-serif font-bold text-lg tracking-widest leading-relaxed flex flex-col items-center shadow-2xl">
            <span>音</span>
            <span>の</span>
            <span>社</span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-serif font-semibold text-slate-100 tracking-wider drop-shadow-md">
              Oto no Yashiro
            </h1>
            <span className="text-xs font-serif text-amber-400/80 tracking-widest uppercase">
              Shrine of Sound
            </span>
          </div>
        </div>
      </div>

      {/* Top-Right: Interface Control Buttons */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
          title={isMuted ? 'Unmute Ambient Sound (M)' : 'Mute Ambient Sound (M)'}
          aria-label={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        <button
          onClick={onOpenEmaModal}
          className="p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
          title="Write Prayer Wish (Ema)"
          aria-label="Write Prayer Wish on Ema Plaque"
        >
          <Heart className="w-5 h-5 text-amber-400" />
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
          title="Keyboard & Controls Help"
          aria-label="Keyboard & Controls Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom-Left: Environmental Mood Selector */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/50 shadow-2xl">
        {MOODS.map(m => (
          <button
            key={m.id}
            onClick={() => onSelectMood(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer ${
              currentMood.id === m.id
                ? 'bg-amber-600/80 text-amber-100 font-bold border border-amber-300/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {m.kanji} <span className="text-[10px] opacity-75 font-sans">({m.nameEn})</span>
          </button>
        ))}
      </div>

      {/* Bottom-Center: Interaction Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none hidden md:block">
        <div className="px-4 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800/60 text-xs font-serif text-slate-300/90 tracking-wider shadow-lg flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {interactionHint}
        </div>
      </div>

      {/* Bottom-Right: Melody of the Wind (風の旋律) Player */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
        <button
          onClick={onToggleMelody}
          className={`px-4 py-2 rounded-full backdrop-blur-md border text-xs font-serif tracking-wider shadow-2xl flex items-center gap-2 transition-all cursor-pointer ${
            isMelodyPlaying
              ? 'bg-amber-600/90 border-amber-300 text-amber-950 font-bold animate-pulse'
              : 'bg-slate-950/70 border-slate-700/60 text-slate-200 hover:border-amber-500/50 hover:text-amber-300'
          }`}
        >
          <Wind className={`w-4 h-4 ${isMelodyPlaying ? 'animate-spin' : ''}`} />
          <span>風の旋律</span>
          <span className="text-[10px] opacity-75 font-sans">
            {isMelodyPlaying ? '(Playing)' : '(Melody of Wind)'}
          </span>
        </button>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-xl p-6 text-slate-200 shadow-2xl">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif font-bold text-amber-300 mb-1 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> 操作方法 — Keyboard & Controls
            </h3>
            <p className="text-xs font-sans text-slate-400 mb-4">
              Play instruments using mouse click, touch drag, or keyboard shortcuts.
            </p>

            <div className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-slate-950/50 border border-slate-800">
                <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">A</kbd> — 清風風鈴</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">S</kbd> — 青銅小鐘</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">D</kbd> — 木魚</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">F</kbd> — 大梵鐘</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">G</kbd> — 夕霧風鈴</div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center"><span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">Space</kbd> Play Arpeggio Phrase</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">M</kbd> Mute / Unmute Ambience</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">R</kbd> Generate Random Sequence</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
