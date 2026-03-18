// Core sound effects: tap, submit, correct, wrong
import type { SoundFn } from '../engine';
import { playNoiseBurst, playGuqinPluck, jitter, rand, randCents } from '../utils';

/** Tap — wooden block percussion (木鱼)
 *  Multi-layer with per-play randomization */
export const tap: SoundFn = (ctx, time, dest) => {
  const pitch = jitter(800, 40);  // ±40Hz variation
  const vol = rand(0.85, 1.0);

  // Body resonance
  const body = ctx.createOscillator();
  body.type = 'sine';
  body.frequency.value = pitch;
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0, time);
  bg.gain.linearRampToValueAtTime(0.1 * vol, time + 0.001);
  bg.gain.exponentialRampToValueAtTime(0.001, time + rand(0.04, 0.06));
  body.connect(bg).connect(dest);
  body.start(time);
  body.stop(time + 0.07);

  // Wood overtone (2x with slight inharmonicity)
  const wood = ctx.createOscillator();
  wood.type = 'sine';
  wood.frequency.value = pitch * rand(1.95, 2.05);
  const wg = ctx.createGain();
  wg.gain.setValueAtTime(0.055 * vol, time);
  wg.gain.exponentialRampToValueAtTime(0.001, time + 0.022);
  wood.connect(wg).connect(dest);
  wood.start(time);
  wood.stop(time + 0.03);

  // Hollow cavity resonance (bandpass noise)
  playNoiseBurst(ctx, dest, time, 0.018, jitter(1100, 150), 'bandpass', 0.05 * vol);
};

/** Submit — bowstring release (弓弦释放) */
export const submit: SoundFn = (ctx, time, dest) => {
  playNoiseBurst(ctx, dest, time, 0.008, 1500, 'bandpass', 0.08);
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, time);
  osc.frequency.exponentialRampToValueAtTime(600, time + 0.12);
  const h2 = ctx.createOscillator();
  h2.type = 'sine';
  h2.frequency.setValueAtTime(600, time);
  h2.frequency.exponentialRampToValueAtTime(1200, time + 0.12);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(0.1, time + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  osc.connect(g).connect(dest);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.04, time);
  g2.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
  h2.connect(g2).connect(dest);
  osc.start(time);
  osc.stop(time + 0.18);
  h2.start(time);
  h2.stop(time + 0.1);
};

/** Correct — guqin pluck arpeggio C5-E5-G5 (古琴三和弦上行) */
export const correct: SoundFn = (ctx, time, dest) => {
  const freqs = [523.25, 659.25, 783.99];
  freqs.forEach((freq, i) => {
    // Slight humanization: ±3ms timing jitter
    const t = time + i * 0.08 + (Math.random() - 0.5) * 0.006;
    playGuqinPluck(ctx, dest, t, freq, 0.3, 0.1);
  });
};

/** Wrong — 羽调 (minor) guqin descend: A3→G3→E3
 *  Sad and muffled, not harsh — conveys "try again" not "you're bad" */
export const wrong: SoundFn = (ctx, time, dest) => {
  // Yu-mode minor pentatonic descending: A3(220)→G3(196)→E3(164.81)
  const freqs = [220.0, 196.0, 164.81];
  freqs.forEach((freq, i) => {
    const t = time + i * 0.1;
    // Muffled guqin pluck (lower gain, shorter duration)
    playGuqinPluck(ctx, dest, t, freq, 0.2, 0.06);
  });

  // Subtle dissonance: quiet minor 2nd ghost note (Bb3) under first note
  const ghost = ctx.createOscillator();
  ghost.type = 'sine';
  ghost.frequency.value = 233.08; // Bb3 — half step above A3
  ghost.detune.value = randCents(15);
  const gg = ctx.createGain();
  gg.gain.setValueAtTime(0, time);
  gg.gain.linearRampToValueAtTime(0.015, time + 0.01);
  gg.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  ghost.connect(gg).connect(dest);
  ghost.start(time);
  ghost.stop(time + 0.16);
};
