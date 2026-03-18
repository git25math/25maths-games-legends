// Streak sound effects: streak_2, streak_3, streak_5, streak_break
import type { SoundFn } from '../engine';
import { createNoiseBuffer, playNoiseBurst, playGuqinPluck } from '../utils';

/** Streak 2 — guqin double pluck C5→E5 */
export const streak2: SoundFn = (ctx, time, dest) => {
  playGuqinPluck(ctx, dest, time, 523.25, 0.15, 0.1);
  playGuqinPluck(ctx, dest, time + 0.06, 659.25, 0.15, 0.1);
};

/** Streak 3 — guqin triple pluck C5→E5→G5 + whoosh */
export const streak3: SoundFn = (ctx, time, dest) => {
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    playGuqinPluck(ctx, dest, time + i * 0.06, freq, 0.2, 0.1);
  });

  // Whoosh: bandpass noise frequency sweep 200→2kHz
  const whooshTime = time + 0.1;
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 3;
  bp.frequency.setValueAtTime(200, whooshTime);
  bp.frequency.exponentialRampToValueAtTime(2000, whooshTime + 0.2);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.05, whooshTime);
  g.gain.exponentialRampToValueAtTime(0.001, whooshTime + 0.2);
  noise.connect(bp).connect(g).connect(dest);
  noise.start(whooshTime);
  noise.stop(whooshTime + 0.2);
};

/** Streak 5 — full pentatonic guqin plucks + inharmonic bell shimmer */
export const streak5: SoundFn = (ctx, time, dest) => {
  // C5-D5-E5-G5-A5 guqin plucks
  const freqs = [523.25, 587.33, 659.25, 783.99, 880.0];
  freqs.forEach((freq, i) => {
    playGuqinPluck(ctx, dest, time + i * 0.055, freq, 0.25, 0.08);
  });

  // Inharmonic metallic bell shimmer (ratio 1:1.41:2.09)
  const bellTime = time + 0.28;
  const bellBase = 2200;
  [1, 1.41, 2.09].forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = bellBase * ratio;
    osc.detune.value = (Math.random() - 0.5) * 12;
    const g = ctx.createGain();
    const amp = 0.025 / (1 + i * 0.5);
    g.gain.setValueAtTime(amp, bellTime);
    g.gain.exponentialRampToValueAtTime(0.001, bellTime + 0.25 / (1 + i * 0.3));
    osc.connect(g).connect(dest);
    osc.start(bellTime);
    osc.stop(bellTime + 0.3);
  });
};

/** Streak Break — descending glide A5→C4 + noise shatter */
export const streakBreak: SoundFn = (ctx, time, dest) => {
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(880, time);
  osc.frequency.exponentialRampToValueAtTime(261.63, time + 0.15);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(3000, time);
  lp.frequency.exponentialRampToValueAtTime(400, time + 0.15); // filter sweep down too
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.07, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  osc.connect(lp).connect(g).connect(dest);
  osc.start(time);
  osc.stop(time + 0.25);

  // Noise shatter
  playNoiseBurst(ctx, dest, time + 0.03, 0.08, 2500, 'highpass', 0.05);
};
