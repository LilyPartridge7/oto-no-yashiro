import React, { useState, useEffect, useCallback } from 'react';
import { MOODS, MoodDef } from './data/moods';
import { INSTRUMENTS } from './data/instruments';
import { audioEngine } from './audio/audioEngine';
import { sequenceGenerator } from './audio/sequenceGenerator';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ShrineScene } from './components/ShrineScene';
import { CascadeChimeSlide } from './components/CascadeChimeSlide';
import { ChimeKnowledgePage } from './components/ChimeKnowledgePage';
import { AmbientControls, ViewMode } from './components/AmbientControls';
import { EmaWishModal } from './components/EmaWishModal';
import { IntroGate } from './components/IntroGate';

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewMode>('courtyard');
  const [currentMood, setCurrentMood] = useState<MoodDef>(MOODS[1]); // Twilight default
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState<boolean>(false);
  const [activeInstrumentId, setActiveInstrumentId] = useState<string | null>(null);
  const [windForce, setWindForce] = useState<number>(0);
  const [isEmaModalOpen, setIsEmaModalOpen] = useState<boolean>(false);
  const [emaWish, setEmaWish] = useLocalStorage<string>('oto_no_yashiro_wish', '');

  const reducedMotion = useReducedMotion();

  // Initialize audio on enter
  const handleEnterShrine = async () => {
    const success = await audioEngine.init();
    if (success) {
      audioEngine.updateMood(currentMood);
      sequenceGenerator.setMood(currentMood);
      setHasEntered(true);
    }
  };

  // Switch environmental mood
  const handleSelectMood = (mood: MoodDef) => {
    setCurrentMood(mood);
    audioEngine.updateMood(mood);
    sequenceGenerator.setMood(mood);
  };

  // Toggle ambient mute
  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Toggle Melody of the Wind
  const handleToggleMelody = () => {
    if (isMelodyPlaying) {
      sequenceGenerator.stop();
      setIsMelodyPlaying(false);
    } else {
      sequenceGenerator.start();
      setIsMelodyPlaying(true);
    }
  };

  // Trigger instrument visually & audibly
  const triggerInstrumentById = useCallback((instId: string) => {
    setActiveInstrumentId(instId);
    setTimeout(() => setActiveInstrumentId(null), 300);
  }, []);

  // Connect sequence generator trigger callback to visual state
  useEffect(() => {
    sequenceGenerator.setOnTriggerCallback((instId) => {
      triggerInstrumentById(instId);
    });
  }, [triggerInstrumentById]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    if (!hasEntered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const matchInst = INSTRUMENTS.find(inst => inst.keyCode === e.code);
      if (matchInst && currentView === 'courtyard') {
        audioEngine.playInstrument(matchInst, 1.0);
        triggerInstrumentById(matchInst.id);
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        sequenceGenerator.triggerRandomSequence();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      } else if (e.code === 'KeyR') {
        sequenceGenerator.triggerRandomSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered, currentView, triggerInstrumentById]);

  // Calculate mouse velocity wind force
  useEffect(() => {
    let lastX = 0;
    let timer: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;

      if (Math.abs(deltaX) > 4) {
        const computedWind = Math.max(-1, Math.min(1, deltaX * 0.04));
        setWindForce(computedWind);

        if (timer !== null) window.clearTimeout(timer);
        timer = window.setTimeout(() => setWindForce(0), 400);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950">
      {!hasEntered ? (
        <IntroGate onEnter={handleEnterShrine} />
      ) : (
        <>
          {currentView === 'courtyard' && (
            <ShrineScene
              mood={currentMood}
              reducedMotion={reducedMotion}
              activeInstrumentId={activeInstrumentId}
              windForce={windForce}
              onOpenEmaModal={() => setIsEmaModalOpen(true)}
              emaWish={emaWish}
            />
          )}

          {currentView === 'cascade' && (
            <CascadeChimeSlide reducedMotion={reducedMotion} />
          )}

          {currentView === 'knowledge' && (
            <ChimeKnowledgePage />
          )}

          <AmbientControls
            currentView={currentView}
            onSelectView={(view) => setCurrentView(view)}
            currentMood={currentMood}
            onSelectMood={handleSelectMood}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isMelodyPlaying={isMelodyPlaying}
            onToggleMelody={handleToggleMelody}
            onOpenEmaModal={() => setIsEmaModalOpen(true)}
            interactionHint="Touch a chime or press [A, S, D, F, G] to play • Click water for ripples"
          />

          <EmaWishModal
            isOpen={isEmaModalOpen}
            onClose={() => setIsEmaModalOpen(false)}
            onSaveWish={(wish) => setEmaWish(wish)}
            currentWish={emaWish}
          />
        </>
      )}
    </main>
  );
};
