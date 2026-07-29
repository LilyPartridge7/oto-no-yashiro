import { InstrumentDef } from '../data/instruments';
import { MoodDef } from '../data/moods';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;

  // Ambient synth nodes
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private waterGain: GainNode | null = null;
  private birdTimer: number | null = null;

  private isInitialized: boolean = false;

  public async init(): Promise<boolean> {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') {
      return true;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // Master limiting & chain setup
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Reverb routing
      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.wetGain = this.ctx.createGain();
      this.wetGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.createImpulseResponse(3.5, 2.0);

      // Routing: input -> dryGain -> compressor -> masterGain -> destination
      //        \-> reverbNode -> wetGain -> compressor
      this.dryGain.connect(this.compressor);
      this.reverbNode.connect(this.wetGain);
      this.wetGain.connect(this.compressor);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Ambient synth initialization
      this.setupAmbientSynth();

      this.isInitialized = true;
      return true;
    } catch (e) {
      console.error('Failed to initialize AudioContext', e);
      return false;
    }
  }

  // Create an artificial room impulse response for realistic sanctuary reverb
  private createImpulseResponse(duration: number, decay: number): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = length - i;
      const factor = Math.pow(n / length, decay);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }
    return impulse;
  }

  private setupAmbientSynth() {
    if (!this.ctx || !this.dryGain) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.ambientGain.connect(this.dryGain);

    // Wind Synth (Filtered Pink/White Noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.08;
      b6 = white * 0.115926;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.ambientGain);
    windSource.start();

    // LFO to slowly modulate wind frequency
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);
    lfo.start();

    // Water Stream Synth (Low-pass filtered rumbling stream noise)
    const waterBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const wData = waterBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      wData[i] = (Math.random() * 2 - 1) * 0.04;
    }
    const waterSource = this.ctx.createBufferSource();
    waterSource.buffer = waterBuffer;
    waterSource.loop = true;

    const waterFilter = this.ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.setValueAtTime(600, this.ctx.currentTime);
    waterFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    waterSource.connect(waterFilter);
    waterFilter.connect(this.waterGain);
    this.waterGain.connect(this.ambientGain);
    waterSource.start();

    // Bird chirps loop
    this.scheduleBirdChirp();
  }

  private scheduleBirdChirp = () => {
    if (this.ctx && !this.isMuted && this.ambientGain) {
      const delayMs = 6000 + Math.random() * 12000;
      this.birdTimer = window.setTimeout(() => {
        this.playBirdChirp();
        this.scheduleBirdChirp();
      }, delayMs);
    }
  };

  private playBirdChirp() {
    if (!this.ctx || !this.ambientGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 2200 + Math.random() * 800;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(startFreq - 200, now + 0.18);

    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public updateMood(mood: MoodDef) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.windGain) {
      this.windGain.gain.setTargetAtTime(mood.windVol * (this.isMuted ? 0 : 0.25), now, 1.2);
    }
    if (this.waterGain) {
      this.waterGain.gain.setTargetAtTime(mood.waterVol * (this.isMuted ? 0 : 0.2), now, 1.2);
    }
    if (this.ctx) {
      const freshReverb = this.ctx.createConvolver();
      freshReverb.buffer = this.createImpulseResponse(mood.reverbTime, 2.0);
      if (this.wetGain) {
        freshReverb.connect(this.wetGain);
      }
      this.reverbNode = freshReverb;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  public playInstrument(inst: InstrumentDef, intensity: number = 1.0) {
    if (!this.ctx || !this.dryGain || !this.reverbNode) return;
    const now = this.ctx.currentTime;

    // Spatial Panner based on xRatio (-1 to 1)
    const panner = this.ctx.createStereoPanner();
    const panVal = (inst.xRatio - 0.5) * 1.6; // -0.8 left to 0.8 right
    panner.pan.setValueAtTime(Math.max(-0.95, Math.min(0.95, panVal)), now);

    const instGain = this.ctx.createGain();
    const normalizedIntensity = Math.min(1.5, Math.max(0.4, intensity));
    instGain.gain.setValueAtTime(0.8 * normalizedIntensity, now);

    instGain.connect(panner);
    panner.connect(this.dryGain);
    panner.connect(this.reverbNode);

    switch (inst.type) {
      case 'glass_high':
        this.synthGlassFurin(inst.baseFreq, inst.decay, instGain, now);
        break;
      case 'bronze_medium':
        this.synthBronzeBell(inst.baseFreq, inst.decay, instGain, now);
        break;
      case 'wood_mokugyo':
        this.synthWoodMokugyo(inst.baseFreq, inst.decay, instGain, now);
        break;
      case 'temple_bonsho':
        this.synthTempleBonsho(inst.baseFreq, inst.decay, instGain, now);
        break;
      case 'glass_low':
        this.synthGlassFurin(inst.baseFreq, inst.decay, instGain, now, true);
        break;
    }
  }

  // Synthesis for Glass Wind Chime (Fūrin)
  private synthGlassFurin(freq: number, decay: number, destination: GainNode, now: number, isLowGlass = false) {
    if (!this.ctx) return;

    // Fundamental Sine
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // High shimmer partial
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, now);

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.0, now);
    gain1.gain.linearRampToValueAtTime(0.7, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.0, now);
    gain2.gain.linearRampToValueAtTime(isLowGlass ? 0.15 : 0.35, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (decay * 0.4));

    // Highpass filter for glass crispness
    const hpFilter = this.ctx.createBiquadFilter();
    hpFilter.type = isLowGlass ? 'bandpass' : 'highpass';
    hpFilter.frequency.setValueAtTime(isLowGlass ? freq * 1.2 : 600, now);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(hpFilter);
    gain2.connect(hpFilter);
    hpFilter.connect(destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + decay + 0.1);
    osc2.stop(now + decay + 0.1);
  }

  // Synthesis for Medium Bronze Bell
  private synthBronzeBell(freq: number, decay: number, destination: GainNode, now: number) {
    if (!this.ctx) return;

    const partials = [
      { ratio: 1.0, gain: 0.8, decayMult: 1.0 },
      { ratio: 2.02, gain: 0.45, decayMult: 0.7 },
      { ratio: 3.12, gain: 0.25, decayMult: 0.5 },
      { ratio: 4.75, gain: 0.12, decayMult: 0.3 }
    ];

    partials.forEach(p => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.ratio, now);

      const pGain = this.ctx.createGain();
      pGain.gain.setValueAtTime(0.0, now);
      pGain.gain.linearRampToValueAtTime(p.gain, now + 0.01);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + (decay * p.decayMult));

      osc.connect(pGain);
      pGain.connect(destination);

      osc.start(now);
      osc.stop(now + (decay * p.decayMult) + 0.1);
    });
  }

  // Synthesis for Muted Wooden Mokugyo
  private synthWoodMokugyo(freq: number, decay: number, destination: GainNode, now: number) {
    if (!this.ctx) return;

    // Pitch sweep sine
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.6, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.03);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.0, now);
    oscGain.gain.linearRampToValueAtTime(0.9, now + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    // Wooden strike noise click
    const bufferSize = this.ctx.sampleRate * 0.04; // 40ms noise burst
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bpFilter = this.ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(freq * 1.5, now);
    bpFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(destination);

    noiseSource.connect(bpFilter);
    bpFilter.connect(noiseGain);
    noiseGain.connect(destination);

    osc.start(now);
    noiseSource.start(now);
    osc.stop(now + decay + 0.1);
  }

  // Synthesis for Grand Temple Bonshō Bell (Deep resonant low hum & beating partials)
  private synthTempleBonsho(freq: number, decay: number, destination: GainNode, now: number) {
    if (!this.ctx) return;

    // Sub-harmonic hum
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, now); // 55Hz

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.0, now);
    subGain.gain.linearRampToValueAtTime(0.5, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    subOsc.connect(subGain);
    subGain.connect(destination);
    subOsc.start(now);
    subOsc.stop(now + decay + 0.1);

    // Beating partials (Inharmonic bronze bell profile)
    const partials = [
      { f: freq * 1.0, g: 0.9, d: 1.0 },
      { f: freq * 1.008, g: 0.85, d: 0.95 }, // Beats against 1.0 for slow pulsing hum
      { f: freq * 2.01, g: 0.6, d: 0.8 },
      { f: freq * 3.03, g: 0.4, d: 0.6 },
      { f: freq * 4.25, g: 0.25, d: 0.4 },
      { f: freq * 6.18, g: 0.15, d: 0.25 }
    ];

    partials.forEach(p => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now);

      const pGain = this.ctx.createGain();
      pGain.gain.setValueAtTime(0.0, now);
      pGain.gain.linearRampToValueAtTime(p.g, now + 0.02);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + (decay * p.d));

      osc.connect(pGain);
      pGain.connect(destination);

      osc.start(now);
      osc.stop(now + (decay * p.d) + 0.1);
    });
  }

  // Play water splash ripple sound when user taps the water surface
  public playWaterSplash() {
    if (!this.ctx || !this.dryGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const startFreq = 800 + Math.random() * 400;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, now + 0.18);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.dryGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const audioEngine = new AudioEngine();
