// UI sound effects: card_pick, countdown_warn
import type { SoundFn } from '../engine';
import { playNoiseBurst } from '../utils';

/** Card Pick — card flip: bamboo slap + resonant wood click + tail (牌翻转) */
export const cardPick: SoundFn = (ctx, time, dest) => {
  // Bamboo slap: short bandpass noise
  playNoiseBurst(ctx, dest, time, 0.006, 1500, 'bandpass', 0.06);

  // Wood click: body 700Hz + overtone 1400Hz
  const body = ctx.createOscillator();
  body.type = 'sine';
  body.frequency.value = 700;
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.09, time);
  bg.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
  body.connect(bg).connect(dest);
  body.start(time);
  body.stop(time + 0.02);

  const over = ctx.createOscillator();
  over.type = 'sine';
  over.frequency.value = 1400;
  const og = ctx.createGain();
  og.gain.setValueAtTime(0.04, time);
  og.gain.exponentialRampToValueAtTime(0.001, time + 0.008);
  over.connect(og).connect(dest);
  over.start(time);
  over.stop(time + 0.01);

  // Triangle tail 550Hz with natural decay
  const tail = ctx.createOscillator();
  tail.type = 'triangle';
  tail.frequency.value = 550;
  const tg = ctx.createGain();
  tg.gain.setValueAtTime(0.05, time + 0.01);
  tg.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
  tail.connect(tg).connect(dest);
  tail.start(time + 0.01);
  tail.stop(time + 0.13);
};

/** Countdown Warning — accelerating tick pulses with rising pitch.
 *  Returns a stop function. */
export function countdownWarn(
  ctx: AudioContext, dest: AudioNode,
  schedule: (t: number) => void,
): () => void {
  let active = true;
  let interval = 500;
  let gain = 0.05;
  let pitch = 800;

  function tick() {
    if (!active) return;
    const now = ctx.currentTime;
    // Tick body
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = pitch;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(g).connect(dest);
    osc.start(now);
    osc.stop(now + 0.03);
    // Click transient
    playNoiseBurst(ctx, dest, now, 0.004, 2000, 'bandpass', gain * 0.5);

    // Accelerate + escalate
    interval = Math.max(100, interval * 0.85);
    gain = Math.min(0.1, gain + 0.004);
    pitch = Math.min(1400, pitch + 30); // rising urgency
    const timer = window.setTimeout(tick, interval);
    schedule(timer);
  }

  tick();
  return () => { active = false; };
}
