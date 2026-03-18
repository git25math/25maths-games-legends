// Audio utility functions: Karplus-Strong synthesis, noise, pentatonic, percussion

// --- Micro-randomization ---
export const rand = (min: number, max: number) => min + Math.random() * (max - min);
export const jitter = (center: number, range: number) => center + (Math.random() - 0.5) * 2 * range;
export const randCents = (cents: number) => (Math.random() - 0.5) * 2 * cents;

// --- Noise buffer pool (3 buffers to prevent correlation artifacts) ---
const NOISE_POOL_SIZE = 3;
const noisePoolCache = new WeakMap<AudioContext, AudioBuffer[]>();

export function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  let pool = noisePoolCache.get(ctx);
  if (!pool) {
    pool = [];
    const sr = ctx.sampleRate;
    for (let p = 0; p < NOISE_POOL_SIZE; p++) {
      const buf = ctx.createBuffer(1, sr, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < sr; i++) data[i] = Math.random() * 2 - 1;
      pool.push(buf);
    }
    noisePoolCache.set(ctx, pool);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Short excitation buffer (not cached — unique per pluck) ---
function createExcitationBuffer(ctx: AudioContext, samples: number): AudioBuffer {
  const buf = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < samples; i++) {
    // Shaped noise: fade out quickly for tight excitation
    data[i] = (Math.random() * 2 - 1) * (1 - i / samples);
  }
  return buf;
}

// --- Pentatonic scales ---
const GONG = [261.63, 293.66, 329.63, 392.0, 440.0];
const YU = [220.0, 261.63, 293.66, 329.63, 392.0];
const ZHI = [196.0, 220.0, 261.63, 293.66, 329.63];

export type ScaleMode = 'gong' | 'yu' | 'zhi';
const SCALES: Record<ScaleMode, number[]> = { gong: GONG, yu: YU, zhi: ZHI };

export function pentatonic(degree: number, octave = 0, mode: ScaleMode = 'gong'): number {
  const scale = SCALES[mode];
  const idx = ((degree % scale.length) + scale.length) % scale.length;
  return scale[idx] * Math.pow(2, octave);
}

// --- Percussion: filtered noise burst ---
export function playNoiseBurst(
  ctx: AudioContext, dest: AudioNode, time: number,
  duration: number, filterFreq: number, filterType: BiquadFilterType = 'lowpass',
  gain = 0.1,
): void {
  const src = ctx.createBufferSource();
  src.buffer = createNoiseBuffer(ctx);
  const maxOffset = Math.max(0, ctx.sampleRate - duration * ctx.sampleRate - 100);
  const offset = maxOffset > 0 ? Math.random() * maxOffset / ctx.sampleRate : 0;
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = jitter(filterFreq, filterFreq * 0.05);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + duration);
  src.connect(filter).connect(g).connect(dest);
  src.start(time, offset);
  src.stop(time + duration);
}

// =====================================================================
// KARPLUS-STRONG plucked string synthesis
// =====================================================================
// Feedback loop: excitation → delay → lowpass → gain(feedback) → delay
// The delay period = 1/freq sets the pitch.
// The lowpass filter removes high frequencies each cycle = natural decay.
// This produces physically-modeled plucked string timbres.
// =====================================================================
export function playGuqinPluck(
  ctx: AudioContext, dest: AudioNode, time: number,
  freq: number, duration: number, gain: number,
): void {
  // Micro-randomize
  const f = freq * Math.pow(2, randCents(8) / 1200);
  const g0 = gain * rand(0.88, 1.12);
  const period = 1 / f;

  // --- Karplus-Strong feedback loop ---
  const delay = ctx.createDelay(period + 0.001);
  delay.delayTime.value = period;

  // Loop filter: lowpass simulates energy loss per cycle
  // Higher cutoff = brighter, longer sustain (silk string ≈ freq * 4)
  // Lower cutoff = darker, faster decay (gut string)
  const loopLP = ctx.createBiquadFilter();
  loopLP.type = 'lowpass';
  loopLP.frequency.value = f * rand(3.5, 5.0); // silk string brightness
  loopLP.Q.value = 0.5;

  // Feedback gain: controls sustain length
  // 0.995 = long ring, 0.98 = moderate, 0.96 = short
  const feedbackTarget = Math.min(0.997, 0.975 + duration * 0.02);
  const feedback = ctx.createGain();
  feedback.gain.setValueAtTime(feedbackTarget, time);
  // Ramp feedback to 0 to ensure the loop dies
  feedback.gain.setValueAtTime(feedbackTarget, time + duration * 0.7);
  feedback.gain.exponentialRampToValueAtTime(0.001, time + duration);

  // Wire the loop: delay → LP → feedback → delay
  delay.connect(loopLP);
  loopLP.connect(feedback);
  feedback.connect(delay);

  // Output tap with envelope
  const outGain = ctx.createGain();
  outGain.gain.setValueAtTime(g0, time);
  outGain.gain.setValueAtTime(g0, time + duration * 0.8);
  outGain.gain.linearRampToValueAtTime(0, time + duration);
  delay.connect(outGain).connect(dest);

  // --- Excitation: short shaped noise burst (< 1 period) ---
  const excLen = Math.max(32, Math.floor(ctx.sampleRate * period * 1.5));
  const excBuf = createExcitationBuffer(ctx, excLen);
  const excSrc = ctx.createBufferSource();
  excSrc.buffer = excBuf;

  // Excitation filter: bandpass around string frequency for warm pluck
  const excBP = ctx.createBiquadFilter();
  excBP.type = 'bandpass';
  excBP.frequency.value = f * rand(1.5, 2.5);
  excBP.Q.value = rand(0.8, 2.0);

  const excGain = ctx.createGain();
  excGain.gain.value = rand(0.8, 1.2); // excitation strength variation

  excSrc.connect(excBP).connect(excGain).connect(delay);
  excSrc.start(time);
  excSrc.stop(time + excLen / ctx.sampleRate + 0.001);

  // --- Body resonance (sympathetic vibration) ---
  const bodyOsc = ctx.createOscillator();
  bodyOsc.type = 'sine';
  bodyOsc.frequency.value = Math.min(f, rand(220, 350));
  const bodyG = ctx.createGain();
  bodyG.gain.setValueAtTime(g0 * 0.08, time);
  bodyG.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
  bodyOsc.connect(bodyG).connect(dest);
  bodyOsc.start(time);
  bodyOsc.stop(time + 0.07);

  // --- Cleanup: break feedback loop to help GC ---
  // Use generous margin (500ms past audio end) to avoid severing mid-ring
  const cleanupMs = (duration + 0.5) * 1000;
  setTimeout(() => {
    try { feedback.disconnect(); } catch { /* */ }
  }, cleanupMs);
}

// --- Vibrato with authentic Chinese instrument width ---
export function addVibrato(
  ctx: AudioContext, target: AudioParam, time: number, duration: number,
  freq: number, depthCents = 30, rate = 5,
): void {
  const depthHz = freq * (Math.pow(2, depthCents / 1200) - 1);
  const actualRate = rate + (Math.random() - 0.5) * 2;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = actualRate;
  const lfoGain = ctx.createGain();
  lfo.connect(lfoGain).connect(target);
  const onsetTime = duration * rand(0.25, 0.35);
  lfoGain.gain.setValueAtTime(0, time);
  lfoGain.gain.linearRampToValueAtTime(depthHz, time + onsetTime);
  lfo.start(time);
  lfo.stop(time + duration);
}

// --- War drum with mobile-friendly mid harmonics ---
export function playWarDrum(
  ctx: AudioContext, dest: AudioNode, time: number,
  gain: number, duration = 0.25,
): void {
  const pitchMult = rand(0.95, 1.05);
  const g0 = gain * rand(0.9, 1.1);

  // Sub bass
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(65 * pitchMult, time);
  sub.frequency.exponentialRampToValueAtTime(50 * pitchMult, time + duration * 0.5);
  const subG = ctx.createGain();
  subG.gain.setValueAtTime(g0, time);
  subG.gain.exponentialRampToValueAtTime(0.001, time + duration);
  sub.connect(subG).connect(dest);
  sub.start(time);
  sub.stop(time + duration + 0.01);

  // Mid punch
  const mid = ctx.createOscillator();
  mid.type = 'sine';
  mid.frequency.value = 150 * pitchMult;
  const midG = ctx.createGain();
  midG.gain.setValueAtTime(g0 * 0.65, time);
  midG.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.55);
  mid.connect(midG).connect(dest);
  mid.start(time);
  mid.stop(time + duration * 0.55 + 0.01);

  // Skin slap
  const nSrc = ctx.createBufferSource();
  nSrc.buffer = createNoiseBuffer(ctx);
  const nOffset = Math.random() * 0.5;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = jitter(400, 60);
  bp.Q.value = rand(1.2, 2.0);
  const nG = ctx.createGain();
  nG.gain.setValueAtTime(g0 * 0.5, time);
  nG.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  nSrc.connect(bp).connect(nG).connect(dest);
  nSrc.start(time, nOffset);
  nSrc.stop(time + 0.05);
}

// --- Metallic percussion with inharmonic partials ---
export function playGong(
  ctx: AudioContext, dest: AudioNode, time: number,
  gain: number, duration: number,
): void {
  const baseFreq = jitter(180, 8);
  const ratios = [1, 1.47, 2.09, 2.56, 3.14];
  const amplitudes = [1, 0.7, 0.5, 0.3, 0.15];

  ratios.forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = baseFreq * ratio;
    osc.detune.value = randCents(6);
    const g = ctx.createGain();
    const amp = gain * amplitudes[i] * rand(0.85, 1.15);
    g.gain.setValueAtTime(amp, time);
    const partialDur = duration / (1 + i * 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, time + partialDur);
    osc.connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + partialDur + 0.01);
  });

  const nSrc = ctx.createBufferSource();
  nSrc.buffer = createNoiseBuffer(ctx);
  const nOffset = Math.random() * 0.5;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;
  const nG = ctx.createGain();
  nG.gain.setValueAtTime(gain * 0.15, time);
  nG.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.4);
  nSrc.connect(hp).connect(nG).connect(dest);
  nSrc.start(time, nOffset);
  nSrc.stop(time + duration * 0.4 + 0.01);
}

// --- Waveshaper: horn/wind soft saturation ---
// Adds odd harmonics (3rd, 5th, 7th) characteristic of tube/reed instruments
let hornCurveCache: Float32Array | null = null;

export function createHornShaper(ctx: AudioContext): WaveShaperNode {
  if (!hornCurveCache) {
    hornCurveCache = new Float32Array(257);
    for (let i = 0; i < 257; i++) {
      const x = (i - 128) / 128;
      // tanh soft clipping + slight asymmetry for even harmonics
      hornCurveCache[i] = Math.tanh(x * 2.5) * 0.9 + Math.tanh(x * 1.2) * 0.1;
    }
  }
  const shaper = ctx.createWaveShaper();
  shaper.curve = hornCurveCache;
  shaper.oversample = '2x';
  return shaper;
}

// --- Stereo panner helper ---
export function createPan(ctx: AudioContext, pan: number): StereoPannerNode {
  const p = ctx.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  return p;
}

// --- PeriodicWave: Suona (唢呐) harmonic series ---
// Strong odd harmonics (1,3,5,7) with weaker evens = bright, nasal, penetrating
const suonaWaveCache = new WeakMap<AudioContext, PeriodicWave>();

export function getSuonaWave(ctx: AudioContext): PeriodicWave {
  const cached = suonaWaveCache.get(ctx);
  if (cached) return cached;
  // 16 harmonics: fundamental + characteristic spectrum
  const real = new Float32Array(17); // cos components (all 0 for this timbre)
  const imag = new Float32Array(17); // sin components
  real[0] = 0; imag[0] = 0; // DC
  imag[1] = 1.0;    // fundamental
  imag[2] = 0.4;    // 2nd (moderate — gives warmth)
  imag[3] = 0.8;    // 3rd (strong — core of nasal quality)
  imag[4] = 0.2;    // 4th
  imag[5] = 0.6;    // 5th (strong — brightness)
  imag[6] = 0.1;    // 6th
  imag[7] = 0.4;    // 7th (strong — bite)
  imag[8] = 0.08;   // 8th
  imag[9] = 0.2;    // 9th
  imag[10] = 0.05;  // 10th
  imag[11] = 0.12;  // 11th
  imag[12] = 0.03;  // 12th
  imag[13] = 0.08;  // 13th
  imag[14] = 0.02;  // 14th
  imag[15] = 0.05;  // 15th
  imag[16] = 0.01;  // 16th
  const wave = ctx.createPeriodicWave(real, imag, { disableNormalization: false });
  suonaWaveCache.set(ctx, wave);
  return wave;
}
