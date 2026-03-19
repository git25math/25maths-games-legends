// BGM: battle (ambient pulse) and map (meditation)
// Design principle: 柔和舒缓 — soft, soothing, never demanding attention
import { pentatonic, createPan, playGuqinPluck, rand } from '../utils';

type ScheduleFn = (timer: number) => void;
type AddNodeFn = (node: AudioScheduledSourceNode) => void;

const LOOKAHEAD = 0.1;
const SCHEDULER_INTERVAL = 50;

// --- Shared: pure sine "xiao" (箫) flute tone — soft, breathy, no harsh harmonics ---
function playXiaoNote(
  ctx: AudioContext, dest: AudioNode, t: number,
  freq: number, duration: number, gain: number,
): void {
  // Pure sine — the softest possible oscillator tone
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.003); // ±3 cents

  // Slow attack (80ms) + long sustain + gentle release — no sharp transients
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.08);
  g.gain.setValueAtTime(gain, t + duration * 0.6);
  g.gain.linearRampToValueAtTime(0, t + duration);

  // LP filter to keep it dark and warm
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = freq * 3;
  lp.Q.value = 0.3;

  osc.connect(lp).connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

/** Battle BGM — gentle ambient pulse (BPM 88)
 *  Soft kick pulse + sine pad + xiao melody with many rests
 *  Feels like: studying in a lantern-lit tent, distant sounds of camp */
export function bgmBattle(
  ctx: AudioContext, musicDest: AudioNode, _sfxDest: AudioNode,
  schedule: ScheduleFn, addNode: AddNodeFn,
): void {
  const BPM = 88;
  const beatSec = 60 / BPM;
  let nextBeatTime = ctx.currentTime + 0.05;
  let beat = 0;

  // Melody patterns: -1 = rest. Many rests for breathing space.
  const melodyPatterns = [
    [0, -1, 2, -1, 4, -1, 2, -1],     // sparse ascending
    [-1, 3, -1, 2, -1, 0, -1, -1],     // falling with silence
    [0, -1, -1, 2, -1, -1, 4, -1],     // very sparse
    [4, -1, 3, -1, 1, -1, 0, -1],      // gentle descend
    [-1, -1, 0, -1, 2, -1, -1, -1],    // minimal — almost silence
    [2, -1, 4, -1, -1, 3, -1, 1],      // floating
  ];
  const patternOrder = melodyPatterns.map((_, i) => i);
  for (let i = patternOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [patternOrder[i], patternOrder[j]] = [patternOrder[j], patternOrder[i]];
  }
  let melodyIdx = 0;

  // Bass root movement: gentle I → IV → V → I
  const bassRoots = [196.0, 261.63, 220.0, 196.0];

  // Phrase dynamics: very gentle breathing
  function getDynamics(): number {
    const phase = (beat % 32) / 32;
    return 0.7 + 0.3 * Math.sin(phase * Math.PI * 2 - Math.PI / 2);
  }

  function scheduleBeat(t: number) {
    const beatInBar = beat % 8;
    const dynamics = getDynamics();

    // --- Soft kick: only on beats 0 and 4 (half density) ---
    if (beatInBar === 0 || beatInBar === 4) {
      const kick = ctx.createOscillator();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(55, t);
      kick.frequency.exponentialRampToValueAtTime(42, t + 0.15);
      const kg = ctx.createGain();
      kg.gain.setValueAtTime(0.035 * dynamics, t);
      kg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      kick.connect(kg).connect(musicDest);
      kick.start(t);
      kick.stop(t + 0.25);
      addNode(kick);
    }

    // --- Xiao melody (pure sine, slow attack, many rests) ---
    const patIdx = patternOrder[melodyIdx % patternOrder.length];
    const pattern = melodyPatterns[patIdx];
    const noteIdx = beat % 8;
    const degree = pattern[noteIdx];

    if (degree >= 0) {
      const freq = pentatonic(degree, 1, 'gong'); // gong mode — peaceful, not martial
      const vol = 0.018 * dynamics * rand(0.85, 1.15);
      playXiaoNote(ctx, musicDest, t, freq, beatSec * 1.8, vol);
    }

    // --- Bass pad: recreate every 8 beats ---
    if (beatInBar === 0) {
      const chordIdx = Math.floor((beat / 8) % 4);
      const bassFreq = bassRoots[chordIdx];

      const drone = ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = bassFreq;
      const dg = ctx.createGain();
      dg.gain.setValueAtTime(0, t);
      dg.gain.linearRampToValueAtTime(0.02 * dynamics, t + 0.3); // slow fade in
      dg.gain.setValueAtTime(0.02 * dynamics, t + 7 * beatSec);
      dg.gain.linearRampToValueAtTime(0, t + 8 * beatSec); // slow fade out
      drone.connect(dg).connect(musicDest);
      drone.start(t);
      drone.stop(t + 8 * beatSec + 0.01);
      addNode(drone);
    }

    if (noteIdx === 7) {
      melodyIdx++;
      if (melodyIdx % patternOrder.length === 0) {
        for (let i = patternOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [patternOrder[i], patternOrder[j]] = [patternOrder[j], patternOrder[i]];
        }
      }
    }
    beat++;
  }

  function scheduler() {
    while (nextBeatTime < ctx.currentTime + LOOKAHEAD) {
      scheduleBeat(nextBeatTime);
      nextBeatTime += beatSec;
    }
    const timer = window.setTimeout(scheduler, SCHEDULER_INTERVAL);
    schedule(timer);
  }
  scheduler();
}

/** Map BGM — meditation ambient: warm sine pad + very gentle guqin
 *  Feels like: sitting by a moonlit lake, bamboo swaying */
export function bgmMap(
  ctx: AudioContext, musicDest: AudioNode, _sfxDest: AudioNode,
  schedule: ScheduleFn, addNode: AddNodeFn,
): void {
  const noteSec = 1.5; // slower than before (was 1.0s)
  let nextNoteTime = ctx.currentTime + 0.05;
  let step = 0;

  // Long melody with lots of rests
  const melodyDegrees = [0, -1, 2, -1, 4, -1, -1, 2, 0, -1, -1, 1, 3, -1, 1, -1];

  const padPanL = createPan(ctx, -0.15);
  padPanL.connect(musicDest);
  const padPanR = createPan(ctx, 0.15);
  padPanR.connect(musicDest);
  const melPan = createPan(ctx, 0);
  melPan.connect(musicDest);

  const padRoots: [number, number][] = [
    [261.63, 392.0],   // C4+G4
    [220.0, 329.63],   // A3+E4
    [261.63, 392.0],   // C4+G4
    [196.0, 293.66],   // G3+D4
  ];

  function scheduleNote(t: number) {
    // Pad: warm sine, very dark LP, changes every 4 notes
    if (step % 4 === 0) {
      const chordIdx = Math.floor((step / 4) % 4);
      const [root, fifth] = padRoots[chordIdx];

      // Root → left
      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.value = root;
      const gR = ctx.createGain();
      gR.gain.setValueAtTime(0, t);
      gR.gain.linearRampToValueAtTime(0.015, t + 0.5); // slow fade in
      gR.gain.setValueAtTime(0.015, t + 5);
      gR.gain.linearRampToValueAtTime(0, t + 6); // slow fade out
      const padLP = ctx.createBiquadFilter();
      padLP.type = 'lowpass';
      padLP.frequency.value = 500; // very dark — just warmth, no brightness
      padLP.Q.value = 0.3;
      oscR.connect(padLP).connect(gR).connect(padPanL);
      oscR.start(t);
      oscR.stop(t + 6.01);
      addNode(oscR);

      // Detuned layer for subtle chorus
      const oscR2 = ctx.createOscillator();
      oscR2.type = 'sine';
      oscR2.frequency.value = root;
      oscR2.detune.value = rand(5, 8);
      const gR2 = ctx.createGain();
      gR2.gain.setValueAtTime(0, t);
      gR2.gain.linearRampToValueAtTime(0.008, t + 0.5);
      gR2.gain.setValueAtTime(0.008, t + 5);
      gR2.gain.linearRampToValueAtTime(0, t + 6);
      oscR2.connect(padLP).connect(gR2).connect(padPanL);
      oscR2.start(t);
      oscR2.stop(t + 6.01);
      addNode(oscR2);

      // Fifth → right
      const oscF = ctx.createOscillator();
      oscF.type = 'sine';
      oscF.frequency.value = fifth;
      const gF = ctx.createGain();
      gF.gain.setValueAtTime(0, t);
      gF.gain.linearRampToValueAtTime(0.012, t + 0.5);
      gF.gain.setValueAtTime(0.012, t + 5);
      gF.gain.linearRampToValueAtTime(0, t + 6);
      const padLP2 = ctx.createBiquadFilter();
      padLP2.type = 'lowpass';
      padLP2.frequency.value = 550;
      padLP2.Q.value = 0.3;
      oscF.connect(padLP2).connect(gF).connect(padPanR);
      oscF.start(t);
      oscF.stop(t + 6.01);
      addNode(oscF);
    }

    // Guqin melody: very quiet, gentle plucks with rests
    const degree = melodyDegrees[step % melodyDegrees.length];

    if (degree >= 0) {
      const freq = pentatonic(degree, 0, 'gong');
      melPan.pan.setValueAtTime(Math.sin(step * 0.3) * 0.1, t);
      playGuqinPluck(ctx, melPan, t, freq, 1.2, rand(0.025, 0.035));
    }

    step++;
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
      scheduleNote(nextNoteTime);
      nextNoteTime += noteSec;
    }
    const timer = window.setTimeout(scheduler, SCHEDULER_INTERVAL);
    schedule(timer);
  }
  scheduler();
}
