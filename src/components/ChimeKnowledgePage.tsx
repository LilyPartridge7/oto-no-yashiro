import React, { useState } from 'react';
import { Volume2, BookOpen, Sparkles, Feather, ShieldCheck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { INSTRUMENTS, InstrumentDef } from '../data/instruments';
import { audioEngine } from '../audio/audioEngine';

interface Topic {
  id: string;
  nameJa: string;
  nameEn: string;
  category: string;
  history: string;
  spiritualMeaning: string;
  material: string;
  inst: InstrumentDef;
  svgIcon: React.ReactNode;
}

export const ChimeKnowledgePage: React.FC = () => {
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const topics: Topic[] = [
    {
      id: 'furin',
      nameJa: '風鈴',
      nameEn: 'Fūrin — Wind Chimes',
      category: 'Edo Glass & Cast Iron',
      history: 'Originating from ancient Chinese fengling (風鈴) divining bells, Japanese wind chimes were hung in Buddhist temples to ward off evil spirits and epidemics. During the Edo period, blown glass artisans created lightweight glass fūrin that became a beloved symbol of summer.',
      spiritualMeaning: 'Purifies sanctuary air and calms the heart with cooling resonance during hot summer months.',
      material: 'Hand-blown glass dome with internal glass clapper (zetsu) and tanzaku paper strip.',
      inst: INSTRUMENTS[0],
      svgIcon: (
        <svg width="60" height="60" viewBox="0 0 70 65" className="drop-shadow-lg">
          <path d="M 15 55 C 15 20, 20 8, 35 8 C 50 8, 55 20, 55 55 Z" fill="rgba(186, 230, 253, 0.7)" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="35" cy="55" rx="20" ry="4" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: 'tanzaku',
      nameJa: '短冊',
      nameEn: 'Tanzaku — Paper Wish Strips',
      category: 'Woven Silk & Rice Paper',
      history: 'The delicate paper strip hanging beneath a chime is called a tanzaku. Acting as a sail that catches subtle thermal air currents, it sways the internal clapper to produce sound. Traditionally, poets and temple visitors write seasonal haiku or prayers upon it.',
      spiritualMeaning: 'Transmits silent written prayers into acoustic vibrations as wind passes through.',
      material: 'Durable handmade Mulberry paper or silk ribbon tied to the clapper thread.',
      inst: INSTRUMENTS[4],
      svgIcon: (
        <div className="w-8 h-14 bg-gradient-to-b from-rose-200 via-pink-100 to-amber-200 rounded-sm border border-amber-900/40 shadow-md flex items-center justify-center font-serif font-bold text-amber-950 text-xs">
          短冊
        </div>
      ),
    },
    {
      id: 'bonsho',
      nameJa: '梵鐘',
      nameEn: 'Bonshō — Temple Bells',
      category: 'Heavy Cast Bronze',
      history: 'Sacred Buddhist temple bells struck from the outside with a suspended wooden beam (shumoku). On New Year’s Eve (Joya no Kane), temples ring the bonshō 108 times to cleanse the 108 worldly desires (kleshik) and mark a fresh spiritual rebirth.',
      spiritualMeaning: 'Low-frequency beat vibrations (in\'nei) reverberate across mountain valleys, awakening spiritual clarity.',
      material: 'Copper-tin bronze alloy (sawari) with Ryūzu dragon crown and raised bronze studs (nyū).',
      inst: INSTRUMENTS[3],
      svgIcon: (
        <svg width="60" height="65" viewBox="0 0 120 135" className="drop-shadow-lg">
          <path d="M 25 115 C 25 50, 32 25, 60 25 C 88 25, 95 50, 95 115 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="3" />
        </svg>
      ),
    },
    {
      id: 'mokugyo',
      nameJa: '木魚',
      nameEn: 'Mokugyo — Zen Wooden Fish Drum',
      category: 'Carved Camphor Wood',
      history: 'A hollow woodblock percussion instrument carved into the shape of a fish holding a sacred pearl. Struck during Zen chanting to maintain rhythmic pulse. Because fish never close their eyes even when sleeping, it symbolizes constant vigilance and mindfulness.',
      spiritualMeaning: 'Reminds practitioners to maintain unceasing mindfulness and non-distraction in daily life.',
      material: 'Single block of hollowed-out camphor or mulberry hardwood struck with a padded mallet.',
      inst: INSTRUMENTS[2],
      svgIcon: (
        <svg width="60" height="55" viewBox="0 0 85 75" className="drop-shadow-lg">
          <path d="M 12 38 C 12 18, 30 12, 42 12 C 65 12, 75 22, 75 38 C 75 56, 58 64, 42 64 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  const currentTopic = topics[activeTopicIndex];

  const handlePlaySound = (inst: InstrumentDef) => {
    audioEngine.playInstrument(inst, 1.2);
    setPlayingId(inst.id);
    setTimeout(() => setPlayingId(null), 1400);
  };

  const handleNext = () => {
    setActiveTopicIndex((prev) => (prev + 1) % topics.length);
  };

  const handlePrev = () => {
    setActiveTopicIndex((prev) => (prev - 1 + topics.length) % topics.length);
  };

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden select-none bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 pt-20 pb-6 animate-fadeIn z-30">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative max-w-xl mx-auto text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif tracking-widest mb-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>伝統音響の知識 — Sacred Heritage</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-50 tracking-wider">
          「風鈴と寺鐘の知識」
        </h1>
      </div>

      {/* Topic Switcher Bar */}
      <div className="relative z-30 flex items-center justify-center gap-2 max-w-xl mx-auto pointer-events-auto">
        {topics.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => setActiveTopicIndex(idx)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer ${
              activeTopicIndex === idx
                ? 'bg-amber-600 border border-amber-300 text-amber-950 font-bold shadow-lg scale-105'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-amber-500/40'
            }`}
          >
            {t.nameJa}
          </button>
        ))}
      </div>

      {/* Single-Frame Interactive Topic Showcase Card */}
      <div className="relative z-20 max-w-3xl mx-auto w-full bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 my-2 backdrop-blur-md">
        {/* Left Visual Icon Area */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <div className="mb-3">{currentTopic.svgIcon}</div>
          <h2 className="text-2xl font-serif font-bold text-amber-300 mb-1">
            {currentTopic.nameJa}
          </h2>
          <span className="text-xs font-sans text-slate-400 block mb-3">
            {currentTopic.nameEn}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-700/50">
            {currentTopic.category}
          </span>
        </div>

        {/* Right Information Details Area */}
        <div className="w-full md:w-2/3 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-serif font-semibold text-amber-400 tracking-wider uppercase mb-1">
              History & Origins
            </h4>
            <p className="text-xs font-serif text-slate-300 leading-relaxed opacity-95">
              {currentTopic.history}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div className="flex items-start gap-2 text-[11px] font-sans text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{currentTopic.spiritualMeaning}</span>
            </div>

            <div className="flex items-start gap-2 text-[11px] font-sans text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{currentTopic.material}</span>
            </div>
          </div>

          {/* Interactive Audio Demo Button */}
          <button
            onClick={() => handlePlaySound(currentTopic.inst)}
            className={`w-full py-2.5 rounded-xl border text-xs font-serif tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              playingId === currentTopic.inst.id
                ? 'bg-amber-600 border-amber-300 text-amber-950 font-bold shadow-lg'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-500/50 hover:text-amber-300'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${playingId === currentTopic.inst.id ? 'animate-bounce' : ''}`} />
            <span>Listen Audio Demo: {currentTopic.nameJa} ({currentTopic.inst.nameEn})</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Pagination Bar */}
      <div className="relative z-30 flex items-center justify-between max-w-3xl mx-auto w-full pt-2 border-t border-slate-800/60 pointer-events-auto">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-serif text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {topics.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTopicIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                activeTopicIndex === idx ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to topic ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-serif text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
