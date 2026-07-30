import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, HelpCircle, Wind, Sparkles, X, Heart, Home, Music, BookOpen } from 'lucide-react';
import { MOODS, MoodDef } from '../data/moods';

export type ViewMode = 'courtyard' | 'cascade' | 'knowledge';

interface AmbientControlsProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
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
  currentView,
  onSelectView,
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
      {/* Top Bar Navigation Container */}
      <div className="fixed top-5 left-0 right-0 z-40 px-4 md:px-8 flex items-center justify-between pointer-events-none">
        {/* Top-Left: Japanese Shrine Title */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="px-2.5 py-2 rounded-lg bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-200 font-serif font-bold text-sm tracking-widest flex items-center gap-2 shadow-2xl">
            <span className="text-amber-400">音の社</span>
          </div>
          <span className="hidden sm:inline text-xs font-serif text-slate-300 tracking-wider">
            Shrine of Sound
          </span>
        </div>

        {/* Top-Center: Balanced View Switcher */}
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/60 shadow-2xl pointer-events-auto">
          <button
            onClick={() => onSelectView('courtyard')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'courtyard'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 font-bold border border-amber-300/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>境内</span>
            <span className="text-[10px] opacity-70 font-sans hidden md:inline">(Courtyard)</span>
          </button>

          <button
            onClick={() => onSelectView('cascade')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'cascade'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 font-bold border border-amber-300/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>滝鈴</span>
            <span className="text-[10px] opacity-70 font-sans hidden md:inline">(Cascade Slide)</span>
          </button>

          <button
            onClick={() => onSelectView('knowledge')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'knowledge'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 font-bold border border-amber-300/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>知識</span>
            <span className="text-[10px] opacity-70 font-sans hidden md:inline">(Learn Chimes)</span>
          </button>
        </div>

        {/* Top-Right: Quick Action Icons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
            aria-label={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenEmaModal}
            className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
            title="Write Prayer Wish (Ema)"
            aria-label="Write Prayer Wish on Ema Plaque"
          >
            <Heart className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-lg cursor-pointer"
            title="Keyboard & Controls Help"
            aria-label="Keyboard & Controls Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom-Left: Environmental Mood Selector (Visible in Courtyard view) */}
      {currentView === 'courtyard' && (
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
      )}

      {/* Bottom-Center: Interaction Hint */}
      {currentView === 'courtyard' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none hidden lg:block">
          <div className="px-4 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800/60 text-xs font-serif text-slate-300/90 tracking-wider shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {interactionHint}
          </div>
        </div>
      )}

      {/* Bottom-Right: Melody of the Wind Player (Visible in Courtyard view) */}
      {currentView === 'courtyard' && (
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
      )}

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
