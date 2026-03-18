// Progress sound effects: tier_up, tier_down, phase_advance, badge_unlock
import type { SoundFn } from '../engine';
import { playWarDrum, playNoiseBurst, playGuqinPluck, playGong, addVibrato,
         createHornShaper, rand, randCents } from '../utils';

/** Tier Up — waveshaped horn call: C4→G4 (号角短鸣) */
export const tierUp: SoundFn = (ctx, time, dest) => {
  const shaper = createHornShaper(ctx);
  shaper.connect(dest);

  [261.63, 392.0].forEach((freq, i) => {
    const t = time + i * 0.1;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    addVibrato(ctx, osc.frequency, t, 0.3, freq, 25);
    // Drive through waveshaper
    const driveG = ctx.createGain();
    driveG.gain.setValueAtTime(0, t);
    driveG.gain.linearRampToValueAtTime(0.16, t + 0.02);
    driveG.gain.linearRampToValueAtTime(0.06, t + 0.2);
    driveG.gain.linearRampToValueAtTime(0, t + 0.3);
    osc.connect(driveG).connect(shaper);
    // Clean parallel
    const cleanG = ctx.createGain();
    cleanG.gain.setValueAtTime(0, t);
    cleanG.gain.linearRampToValueAtTime(0.03, t + 0.02);
    cleanG.gain.linearRampToValueAtTime(0, t + 0.3);
    osc.connect(cleanG).connect(dest);
    osc.start(t);
    osc.stop(t + 0.3);
  });
};

/** Tier Down — gentle guqin descend G4→E4 */
export const tierDown: SoundFn = (ctx, time, dest) => {
  playGuqinPluck(ctx, dest, time, 392.0, 0.25, 0.05);
  playGuqinPluck(ctx, dest, time + 0.1, 329.63, 0.25, 0.05);
};

/** Phase Advance — war drum crescendo + gong */
export const phaseAdvance: SoundFn = (ctx, time, dest) => {
  const gains = [0.05, 0.08, 0.12];
  gains.forEach((peak, i) => {
    playWarDrum(ctx, dest, time + i * 0.15, peak, 0.12);
  });
  playGong(ctx, dest, time + 0.45, 0.05, 0.2);
};

/** Badge Unlock — seal stamp + golden shimmer + guqin chord */
export const badgeUnlock: SoundFn = (ctx, time, dest) => {
  // Wood stamp
  const stamp = ctx.createOscillator();
  stamp.type = 'sine';
  stamp.frequency.value = 900;
  const sg = ctx.createGain();
  sg.gain.setValueAtTime(0.12, time);
  sg.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  stamp.connect(sg).connect(dest);
  stamp.start(time);
  stamp.stop(time + 0.05);
  const body = ctx.createOscillator();
  body.type = 'sine';
  body.frequency.value = 450;
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.06, time);
  bg.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
  body.connect(bg).connect(dest);
  body.start(time);
  body.stop(time + 0.07);
  playNoiseBurst(ctx, dest, time, 0.008, 1500, 'bandpass', 0.07);

  // Golden shimmer
  const shimmerBase = 3000;
  for (let i = 0; i < 5; i++) {
    const t = time + 0.1 + i * rand(0.045, 0.065);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = shimmerBase * (1 + i * 0.17 + Math.random() * 0.1);
    osc.detune.value = randCents(12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.025, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Guqin chord
  playGuqinPluck(ctx, dest, time + 0.45, 523.25, 0.8, 0.05);
  playGuqinPluck(ctx, dest, time + 0.48, 783.99, 0.8, 0.05);
};
