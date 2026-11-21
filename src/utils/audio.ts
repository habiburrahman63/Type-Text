/**
 * Premium Mechanical Keyboard Sound Engine (Web Audio API)
 * Ultra-low latency, zero external network requests, zero audio lag at 150+ WPM.
 * Accurately synthesizes the soft, smooth, tactile "thock" of premium lubed mechanical switches.
 */

export type KeySoundType = 'key' | 'space' | 'backspace' | 'enter';
export type SwitchProfile = 'thock' | 'tactile' | 'clicky';

class SoundController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public enabled: boolean = true;
  public volume: number = 0.35; // Soft, smooth, pleasant default volume
  public switchProfile: SwitchProfile = 'thock';

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSound = localStorage.getItem('typenex_sound');
      if (storedSound !== null) {
        this.enabled = storedSound !== 'false';
      }
      const storedVol = localStorage.getItem('typenex_sound_volume');
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }
      const storedProfile = localStorage.getItem('typenex_sound_profile');
      if (storedProfile === 'thock' || storedProfile === 'tactile' || storedProfile === 'clicky') {
        this.switchProfile = storedProfile;
      }
    }
  }

  private initCtx() {
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // Initialize master dynamics compressor to prevent clipping during fast typing bursts
      if (!this.compressor) {
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.001, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.04, this.ctx.currentTime);
      }

      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      } else {
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      }

      // Pre-generate noise buffer for tactile switch transients
      if (!this.noiseBuffer) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * 0.5; // 0.5 second pink/white noise
        this.noiseBuffer = this.ctx.createBuffer(1, length, sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          // Pink-ish filtered noise for softer acoustic impact
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.15;
        }
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('typenex_sound_volume', this.volume.toString());
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('typenex_sound', val.toString());
    }
  }

  public toggle(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    if (next) {
      // Play a quick test click to give feedback
      this.playKeyClick('key');
    }
    return next;
  }

  public setProfile(profile: SwitchProfile) {
    this.switchProfile = profile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('typenex_sound_profile', profile);
    }
  }

  /**
   * Play a realistic mechanical key click with natural pitch jitter and bottom-out resonance.
   * Zero latency, synchronized with typing speed.
   */
  public playKeyClick(type: KeySoundType = 'key') {
    if (!this.enabled || this.volume <= 0) return;

    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      // Realistic acoustic pitch variation (±6%) to simulate human physical typing
      const jitter = 1 + (Math.random() - 0.5) * 0.12;

      // Parameters depending on key type & profile
      let clickFreq = 2200;
      let clickQ = 2.4;
      let thockBaseFreq = 220;
      let thockEndFreq = 95;
      let thockDuration = 0.038;
      let transientGain = 0.14;
      let thockGain = 0.22;

      if (type === 'space') {
        // Spacebar has larger keycap mass and stabilizer bar -> deeper, softer thock
        clickFreq = 1400;
        clickQ = 1.8;
        thockBaseFreq = 145;
        thockEndFreq = 65;
        thockDuration = 0.046;
        transientGain = 0.16;
        thockGain = 0.28;
      } else if (type === 'backspace') {
        // Backspace has a slightly crisper tactile return
        clickFreq = 2600;
        clickQ = 3.0;
        thockBaseFreq = 245;
        thockEndFreq = 110;
        thockDuration = 0.034;
        transientGain = 0.15;
        thockGain = 0.20;
      } else if (type === 'enter') {
        // Enter key
        clickFreq = 1800;
        clickQ = 2.0;
        thockBaseFreq = 185;
        thockEndFreq = 80;
        thockDuration = 0.042;
        transientGain = 0.16;
        thockGain = 0.25;
      }

      // Adjust based on switch profile
      if (this.switchProfile === 'tactile') {
        clickFreq *= 1.25;
        transientGain *= 1.2;
      } else if (this.switchProfile === 'clicky') {
        clickFreq *= 1.5;
        clickQ = 4.0;
        transientGain *= 1.35;
      }

      // --- 1. Tactile Transient (Stem actuation & impact) ---
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;
        // Random offset into pre-cached noise buffer
        noiseSource.playbackRate.setValueAtTime(jitter, now);

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(clickFreq * jitter, now);
        bandpass.Q.setValueAtTime(clickQ, now);

        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(transientGain, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

        noiseSource.connect(bandpass);
        bandpass.connect(clickGain);
        clickGain.connect(this.masterGain);

        noiseSource.start(now);
        noiseSource.stop(now + 0.016);
      }

      // --- 2. Acoustic Housing Resonance (The "Thock" Thump) ---
      const osc = this.ctx.createOscillator();
      const bodyFilter = this.ctx.createBiquadFilter();
      const bodyGain = this.ctx.createGain();

      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(1200, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(thockBaseFreq * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(thockEndFreq * jitter, now + thockDuration);

      bodyGain.gain.setValueAtTime(thockGain, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + thockDuration);

      osc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + thockDuration + 0.005);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Soft, muted error tap (signals error gently without being harsh or annoying)
   */
  public playError() {
    if (!this.enabled || this.volume <= 0) return;

    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      // Dual-frequency muted thud
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Pleasant harmonic celebration chime (C5 - E5 - G5 - C6)
   */
  public playSuccess() {
    if (!this.enabled || this.volume <= 0) return;

    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.38);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const soundController = new SoundController();
