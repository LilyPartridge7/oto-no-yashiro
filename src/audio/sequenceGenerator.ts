import { INSTRUMENTS, InstrumentDef } from '../data/instruments';
import { MOODS, MoodDef } from '../data/moods';
import { audioEngine } from './audioEngine';

export class SequenceGenerator {
  private timer: number | null = null;
  private isPlaying: boolean = false;
  private currentMood: MoodDef = MOODS[1]; // Twilight by default
  private onTriggerCallback?: (instId: string) => void;

  public setMood(mood: MoodDef) {
    this.currentMood = mood;
  }

  public setOnTriggerCallback(cb: (instId: string) => void) {
    this.onTriggerCallback = cb;
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.scheduleNextStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleNextStep = () => {
    if (!this.isPlaying) return;

    // Pick instrument weighted by mood
    const inst = this.pickInstrumentForMood();
    const intensity = 0.6 + Math.random() * 0.5;

    audioEngine.playInstrument(inst, intensity);
    if (this.onTriggerCallback) {
      this.onTriggerCallback(inst.id);
    }

    // Determine interval based on mood tempo multiplier
    const baseIntervalMs = 2400 + Math.random() * 3200;
    const actualInterval = baseIntervalMs / this.currentMood.tempoMultiplier;

    this.timer = window.setTimeout(() => {
      this.scheduleNextStep();
    }, actualInterval);
  };

  private pickInstrumentForMood(): InstrumentDef {
    // Pentatonic feel: vary probability according to mood
    let weights = [0.25, 0.25, 0.15, 0.15, 0.2]; // default

    if (this.currentMood.id === 'morning_mist') {
      // Prefer high delicate glass & medium bronze bell
      weights = [0.35, 0.25, 0.1, 0.1, 0.2];
    } else if (this.currentMood.id === 'twilight') {
      // Balanced
      weights = [0.2, 0.3, 0.15, 0.15, 0.2];
    } else if (this.currentMood.id === 'moonlit_night') {
      // Prefer deep temple bonsho & low glass
      weights = [0.15, 0.2, 0.1, 0.3, 0.25];
    }

    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) {
        return INSTRUMENTS[i];
      }
    }
    return INSTRUMENTS[0];
  }

  public triggerRandomSequence() {
    // Play a gentle 3-note arpeggio phrase
    const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5).slice(0, 3);
    indices.forEach((idx, step) => {
      window.setTimeout(() => {
        const inst = INSTRUMENTS[idx];
        audioEngine.playInstrument(inst, 0.85);
        if (this.onTriggerCallback) {
          this.onTriggerCallback(inst.id);
        }
      }, step * 650);
    });
  }
}

export const sequenceGenerator = new SequenceGenerator();
