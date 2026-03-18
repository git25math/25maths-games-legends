// Combat sound effects: hp_loss, hp_critical, victory, defeat
import type { SoundFn } from '../engine';
import { playWarDrum, playGong, playGuqinPluck, pentatonic, addVibrato,
         createHornShaper, rand, jitter } from '../utils';

/** HP Loss — war drum impact (战鼓) */
export const hpLoss: SoundFn = (ctx, time, dest) => {
  playWarDrum(ctx, dest, time, 0.15, 0.4);
};

/** HP Critical — heartbeat loop */
export function hpCriticalLoop(
  ctx: AudioContext, dest: AudioNode,
  schedule: (t: number) => void, addNode: (n: AudioScheduledSourceNode) => void,
): () => void {
  let active = true;

  function thump(t: number) {
    const vol = rand(0.85, 1.0);
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = jitter(80, 5);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.06 * vol, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    sub.connect(sg).connect(dest);
    sub.start(t);
    sub.stop(t + 0.12);
    addNode(sub);
    const mid = ctx.createOscillator();
    mid.type = 'sine';
    mid.frequency.value = jitter(160, 8);
    const mg = ctx.createGain();
    mg.gain.setValueAtTime(0.04 * vol, t);
    mg.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    mid.connect(mg).connect(dest);
    mid.start(t);
    mid.stop(t + 0.08);
    addNode(mid);
  }

  function beat() {
    if (!active) return;
    const now = ctx.currentTime;
    thump(now);
    thump(now + rand(0.13, 0.17));
    const timer = window.setTimeout(beat, rand(750, 850));
    schedule(timer);
  }

  beat();
  return () => { active = false; };
}

/** Victory — waveshaped horn ascending + sustained chord + inharmonic gong
 *  Horn uses soft saturation for organic odd harmonics (唢呐/号角 quality) */
export const victory: SoundFn = (ctx, time, dest) => {
  // Waveshaper adds 3rd/5th/7th harmonics → sounds like blown instrument
  const shaper = createHornShaper(ctx);
  shaper.connect(dest);

  let noteTime = time;
  for (let i = 0; i < 5; i++) {
    const freq = pentatonic(i, 0, 'gong');
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    addVibrato(ctx, osc.frequency, noteTime, 0.3, freq, 30);

    // Pre-shaper gain drives the saturation amount
    const driveG = ctx.createGain();
    driveG.gain.setValueAtTime(0, noteTime);
    driveG.gain.linearRampToValueAtTime(0.18, noteTime + 0.025);
    driveG.gain.linearRampToValueAtTime(0.08, noteTime + 0.22);
    driveG.gain.linearRampToValueAtTime(0, noteTime + 0.3);
    osc.connect(driveG).connect(shaper);

    // Parallel clean path for clarity (blend shaped + clean)
    const cleanG = ctx.createGain();
    cleanG.gain.setValueAtTime(0, noteTime);
    cleanG.gain.linearRampToValueAtTime(0.04, noteTime + 0.025);
    cleanG.gain.linearRampToValueAtTime(0, noteTime + 0.3);
    osc.connect(cleanG).connect(dest);

    osc.start(noteTime);
    osc.stop(noteTime + 0.3);

    // Humanized spacing with slight accelerando
    noteTime += 0.15 - i * 0.005 + (Math.random() - 0.5) * 0.012;
  }

  // Sustained chord C5-E5-G5
  const chordTime = noteTime + 0.05;
  [523.25, 659.25, 783.99].forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, chordTime);
    g.gain.linearRampToValueAtTime(0.045, chordTime + 0.05);
    g.gain.linearRampToValueAtTime(0, chordTime + 1.5);
    osc.connect(g).connect(dest);
    osc.start(chordTime);
    osc.stop(chordTime + 1.6);
  });

  // Inharmonic gong
  playGong(ctx, dest, chordTime - 0.05, 0.04, 1.5);
};

/** Defeat — war drums fading + guqin pluck C3 */
export const defeat: SoundFn = (ctx, time, dest) => {
  const intervals = [0, 0.2, 0.45, 0.85];
  const gains = [0.12, 0.09, 0.06, 0.03];
  intervals.forEach((offset, i) => {
    playWarDrum(ctx, dest, time + offset + (Math.random() - 0.5) * 0.015, gains[i], 0.2);
  });
  playGuqinPluck(ctx, dest, time + 1.0, 130.81, 1.0, 0.06);
};
