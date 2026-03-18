// Transition stingers: short musical bridges between game states
import type { SoundFn } from '../engine';
import { playWarDrum, playGong, playGuqinPluck, pentatonic, rand } from '../utils';

/** Battle Enter — war drum crescendo + gong (0.7s)
 *  Plays BEFORE battle BGM starts. Creates "here we go!" moment. */
export const battleEnter: SoundFn = (ctx, time, dest) => {
  // 3-hit drum crescendo (fast, building tension)
  [0, 0.12, 0.22].forEach((offset, i) => {
    playWarDrum(ctx, dest, time + offset, 0.06 + i * 0.04, 0.1);
  });
  // Gong strike at climax
  playGong(ctx, dest, time + 0.4, 0.05, 0.35);
};

/** Battle Exit Win — ascending guqin chord + soft gong (0.8s)
 *  Bridges from victory overlay back to map screen. */
export const battleExitWin: SoundFn = (ctx, time, dest) => {
  // Quick ascending pentatonic plucks (gong mode C-E-G)
  [261.63, 329.63, 392.0].forEach((freq, i) => {
    playGuqinPluck(ctx, dest, time + i * 0.08, freq, 0.5, 0.06);
  });
  // Soft gong sustain
  playGong(ctx, dest, time + 0.35, 0.025, 0.5);
};

/** Battle Exit Lose — single low drum + descending guqin (0.8s)
 *  Gentle transition, not punishing. */
export const battleExitLose: SoundFn = (ctx, time, dest) => {
  // Single muffled drum
  playWarDrum(ctx, dest, time, 0.07, 0.3);
  // Descending guqin: E4 → C4 (minor third down, melancholic)
  playGuqinPluck(ctx, dest, time + 0.2, 329.63, 0.5, 0.04);
  playGuqinPluck(ctx, dest, time + 0.4, 261.63, 0.5, 0.04);
};
