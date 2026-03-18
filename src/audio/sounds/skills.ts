// Skill sound effects: shield_on, shield_block, double_on, reveal
import type { SoundFn } from '../engine';
import { createNoiseBuffer, playNoiseBurst, playGong, playGuqinPluck, rand, randCents } from '../utils';

/** Shield On — inharmonic bronze gong strike (铜锣) */
export const shieldOn: SoundFn = (ctx, time, dest) => {
  playGong(ctx, dest, time, 0.06, 0.8);
};

/** Shield Block — metallic clash: high partials + low-freq body thump */
export const shieldBlock: SoundFn = (ctx, time, dest) => {
  // Low-frequency body impact (shield mass)
  const body = ctx.createOscillator();
  body.type = 'sine';
  body.frequency.value = rand(180, 220);
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.06, time);
  bg.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  body.connect(bg).connect(dest);
  body.start(time);
  body.stop(time + 0.1);

  // High inharmonic partials (metal-on-metal ring)
  [2000, 2940, 3780].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = randCents(8);
    const g = ctx.createGain();
    const amp = 0.07 / (1 + i * 0.5);
    g.gain.setValueAtTime(amp, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.12 / (1 + i * 0.4));
    osc.connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + 0.2);
  });

  // Click transient
  playNoiseBurst(ctx, dest, time, 0.012, 4000, 'highpass', 0.06);
};

/** Double On — coin chime (硬币音) */
export const doubleOn: SoundFn = (ctx, time, dest) => {
  // Beat frequency pair (40Hz shimmer)
  [1480, 1520].forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = randCents(4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    osc.connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + 0.4);
  });

  // Inharmonic sparkle (coin vibration modes)
  const sparkleBase = 3200;
  [1, 1.33, 1.78].forEach((ratio, i) => {
    const t = time + 0.08 + i * rand(0.06, 0.08);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = sparkleBase * ratio;
    osc.detune.value = randCents(10);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.03, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.06);
  });
};

/** Reveal — bamboo scroll unfurl (竹简展开) + guqin pluck */
export const reveal: SoundFn = (ctx, time, dest) => {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(200, time);
  hp.frequency.exponentialRampToValueAtTime(2000, time + 0.3);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(0.05, time + 0.15);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
  noise.connect(hp).connect(g).connect(dest);
  noise.start(time);
  noise.stop(time + 0.4);
  playGuqinPluck(ctx, dest, time + 0.28, 659.25, 0.3, 0.07);
};
