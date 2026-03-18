// BGM: battle (3-layer) and map (2-layer)
// Lookahead scheduling + stereo + chord progression + PeriodicWave suona + formant
import { pentatonic, createNoiseBuffer, getSuonaWave, addVibrato, createPan,
         playGuqinPluck, rand, jitter } from '../utils';

type ScheduleFn = (timer: number) => void;
type AddNodeFn = (node: AudioScheduledSourceNode) => void;

// Mobile-safe lookahead (tolerates 100ms+ setTimeout jitter)
const LOOKAHEAD = 0.1;
const SCHEDULER_INTERVAL = 50;

/** Battle BGM — 4 layers: drum (center), suona melody (left), hi-hat (right), bass (center)
 *  8 patterns + sinusoidal phrase dynamics + suona formant filtering + chord progression */
export function bgmBattle(
  ctx: AudioContext, musicDest: AudioNode, _sfxDest: AudioNode,
  schedule: ScheduleFn, addNode: AddNodeFn,
): void {
  const BPM = 120;
  const beatSec = 60 / BPM;
  let nextBeatTime = ctx.currentTime + 0.05;
  let beat = 0;

  // Persistent stereo panner nodes (created once, reused by all beats)
  const drumPan = createPan(ctx, 0);
  drumPan.connect(musicDest);
  const melodyPan = createPan(ctx, -0.3);
  melodyPan.connect(musicDest);
  const hihatPan = createPan(ctx, 0.25);
  hihatPan.connect(musicDest);

  const suonaWave = getSuonaWave(ctx);

  // Persistent formant filters for suona (reed/bore resonances)
  const formant1 = ctx.createBiquadFilter();
  formant1.type = 'peaking';
  formant1.frequency.value = 1200;
  formant1.gain.value = 6;
  formant1.Q.value = 3;
  const formant2 = ctx.createBiquadFilter();
  formant2.type = 'peaking';
  formant2.frequency.value = 2800;
  formant2.gain.value = 4;
  formant2.Q.value = 4;
  formant1.connect(formant2).connect(melodyPan);

  const melodyPatterns = [
    [0, 1, 2, 3, 4, 3, 2, 1],
    [4, 3, 2, 0, 1, 2, 3, 4],
    [0, 2, 4, 2, 0, 1, 3, 1],
    [3, 4, 3, 2, 1, 0, 1, 2],
    [0, 0, 2, 3, 4, 4, 3, 2],
    [4, 2, 0, 1, 3, 4, 2, 0],
    [1, 3, 2, 4, 0, 2, 1, 3],
    [0, -1, 0, 2, 4, 2, 0, -1],
  ];
  // Shuffled pattern order — avoids predictable cycling
  const patternOrder = melodyPatterns.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = patternOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [patternOrder[i], patternOrder[j]] = [patternOrder[j], patternOrder[i]];
  }
  let melodyIdx = 0;

  // Bass chord progression: I-V-IV-I
  const bassRoots = [196.0, 146.83, 130.81, 196.0];

  // Phrase-level sinusoidal dynamics (32-beat cycle: build → climax → pull-back)
  function getDynamics(): number {
    const phase = (beat % 32) / 32; // 0→1 over 32 beats
    return 0.55 + 0.45 * Math.sin(phase * Math.PI * 2 - Math.PI / 2);
    // range: 0.1 (trough at beat 24) → 1.0 (peak at beat 8)
  }

  function scheduleBeat(t: number) {
    const beatInBar = beat % 8;
    const dynamics = getDynamics();

    // --- Drum layer (center) ---
    if (beatInBar % 2 === 0) {
      const kick = ctx.createOscillator();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(jitter(65, 3), t);
      kick.frequency.exponentialRampToValueAtTime(50, t + 0.1);
      const kg = ctx.createGain();
      kg.gain.setValueAtTime(0.07 * dynamics, t);
      kg.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      kick.connect(kg).connect(drumPan);
      kick.start(t);
      kick.stop(t + 0.15);
      addNode(kick);

      const midK = ctx.createOscillator();
      midK.type = 'sine';
      midK.frequency.value = jitter(150, 8);
      const mkG = ctx.createGain();
      mkG.gain.setValueAtTime(0.04 * dynamics, t);
      mkG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      midK.connect(mkG).connect(drumPan);
      midK.start(t);
      midK.stop(t + 0.1);
      addNode(midK);
    }

    // Snare
    if (beatInBar === 2 || beatInBar === 6) {
      const src = ctx.createBufferSource();
      src.buffer = createNoiseBuffer(ctx);
      const nOff = Math.random() * 0.5;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = jitter(800, 80);
      bp.Q.value = rand(1.2, 1.8);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.05 * dynamics, t);
      sg.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      src.connect(bp).connect(sg).connect(drumPan);
      src.start(t, nOff);
      src.stop(t + 0.08);
      addNode(src);
    }

    // Hi-hat on off-beats with velocity variation
    if (beatInBar % 2 === 1) {
      const hhVel = dynamics * rand(0.6, 1.2); // ghost notes when quiet
      const hh = ctx.createBufferSource();
      hh.buffer = createNoiseBuffer(ctx);
      const hhOff = Math.random() * 0.5;
      const hhHP = ctx.createBiquadFilter();
      hhHP.type = 'highpass';
      hhHP.frequency.value = jitter(6000, 500);
      const hhG = ctx.createGain();
      hhG.gain.setValueAtTime(0.016 * hhVel, t);
      hhG.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      hh.connect(hhHP).connect(hhG).connect(hihatPan);
      hh.start(t, hhOff);
      hh.stop(t + 0.03);
      addNode(hh);
    }

    // --- Suona melody layer (left, through formant filters) ---
    // Use shuffled pattern order; every 5th pattern is a drum-only "breathing" measure
    const patIdx = patternOrder[melodyIdx % patternOrder.length];
    const isDrumOnly = (melodyIdx % 5 === 4); // every 5th pattern = drums breathe alone
    const pattern = melodyPatterns[patIdx];
    const noteIdx = beat % 8;
    const degree = isDrumOnly ? -1 : pattern[noteIdx]; // suppress melody during drum-only

    if (degree >= 0) {
      // Rhythmic variation: ~20% chance of holding note for 2 beats (skip next)
      // Implemented by occasionally doubling the gain envelope duration
      const octaveShift = (Math.random() < 0.15) ? 2 : 1;
      const freq = pentatonic(degree, octaveShift, 'zhi');
      const mel = ctx.createOscillator();
      mel.setPeriodicWave(suonaWave);
      mel.frequency.value = freq;
      addVibrato(ctx, mel.frequency, t, 0.4, freq, 28);

      // Track formant1 to note pitch (bore resonance shifts with register)
      formant1.frequency.setValueAtTime(1000 + freq * 0.5, t);

      const mg = ctx.createGain();
      const melVol = 0.035 * dynamics * rand(0.85, 1.15);
      mg.gain.setValueAtTime(0, t);
      mg.gain.linearRampToValueAtTime(melVol, t + 0.02);
      mg.gain.linearRampToValueAtTime(melVol * 0.4, t + 0.3);
      mg.gain.linearRampToValueAtTime(0, t + 0.4);
      mel.connect(mg).connect(formant1); // → formant2 → melodyPan → musicDest

      mel.start(t);
      mel.stop(t + 0.45);
      addNode(mel);
    }

    // --- Bass with chord progression (center) ---
    if (beat % 8 === 0) {
      const chordIdx = Math.floor((beat / 8) % 4);
      const bassFreq = bassRoots[chordIdx];

      const drone = ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = bassFreq;
      const dg = ctx.createGain();
      dg.gain.value = 0.03 * dynamics;
      drone.connect(dg).connect(drumPan);
      drone.start(t);
      drone.stop(t + 8 * beatSec);
      addNode(drone);

      const fifth = ctx.createOscillator();
      fifth.type = 'sine';
      fifth.frequency.value = bassFreq * 1.5;
      const fg = ctx.createGain();
      fg.gain.value = 0.012 * dynamics;
      fifth.connect(fg).connect(drumPan);
      fifth.start(t);
      fifth.stop(t + 8 * beatSec);
      addNode(fifth);
    }

    if (noteIdx === 7) {
      melodyIdx++;
      // Reshuffle when all patterns exhausted
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

/** Map BGM — 2 layers: stereo pad + guqin melody
 *  16-note phrase + chord progression + stereo sway */
export function bgmMap(
  ctx: AudioContext, musicDest: AudioNode, _sfxDest: AudioNode,
  schedule: ScheduleFn, addNode: AddNodeFn,
): void {
  const noteSec = 1.0;
  let nextNoteTime = ctx.currentTime + 0.05;
  let step = 0;

  const melodyDegrees = [0, 2, 4, 2, -1, 0, 1, 3, 1, 0, -1, 2, 4, 3, 1, 0];

  // Persistent stereo pad panners (created once)
  const padPanL = createPan(ctx, -0.2);
  padPanL.connect(musicDest);
  const padPanR = createPan(ctx, 0.2);
  padPanR.connect(musicDest);

  // Persistent melody panner (updated per note)
  const melPan = createPan(ctx, 0);
  melPan.connect(musicDest);

  const padRoots: [number, number][] = [
    [261.63, 392.0],   // C4+G4 (I)
    [196.0, 329.63],   // G3+E4 (V)
    [220.0, 329.63],   // A3+E4 (vi)
    [261.63, 392.0],   // C4+G4 (I)
  ];

  function scheduleNote(t: number) {
    // Pad layer: changes every 4 notes
    if (step % 4 === 0) {
      const chordIdx = Math.floor((step / 4) % 4);
      const [root, fifth] = padRoots[chordIdx];

      // Root pad → left: 3-voice unison chorus (sine + detuned triangles)
      const rootVoices: [OscillatorType, number][] = [
        ['sine', 0],             // center voice
        ['triangle', rand(4, 7)],  // +5 cents avg
        ['triangle', rand(-7, -4)], // -5 cents avg
      ];
      const gR = ctx.createGain();
      gR.gain.value = 0.015;
      // Slow filter sweep for movement
      const padLP = ctx.createBiquadFilter();
      padLP.type = 'lowpass';
      padLP.frequency.setValueAtTime(800, t);
      padLP.frequency.linearRampToValueAtTime(1400, t + 2);
      padLP.frequency.linearRampToValueAtTime(800, t + 4);
      padLP.Q.value = 0.5;
      gR.connect(padLP).connect(padPanL);
      const lfoR = ctx.createOscillator();
      lfoR.frequency.value = rand(0.2, 0.35);
      const lfoGR = ctx.createGain();
      lfoGR.gain.value = 0.004;
      lfoR.connect(lfoGR).connect(gR.gain);
      lfoR.start(t);
      lfoR.stop(t + 4);
      rootVoices.forEach(([type, detune]) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = root;
        o.detune.value = detune;
        o.connect(gR);
        o.start(t);
        o.stop(t + 4);
        addNode(o);
      });

      // Fifth pad → right: same 3-voice chorus
      const fifthVoices: [OscillatorType, number][] = [
        ['sine', 0],
        ['triangle', rand(4, 7)],
        ['triangle', rand(-7, -4)],
      ];
      const gF = ctx.createGain();
      gF.gain.value = 0.015;
      const padLP2 = ctx.createBiquadFilter();
      padLP2.type = 'lowpass';
      padLP2.frequency.setValueAtTime(900, t);
      padLP2.frequency.linearRampToValueAtTime(1500, t + 2.2);
      padLP2.frequency.linearRampToValueAtTime(900, t + 4);
      padLP2.Q.value = 0.5;
      gF.connect(padLP2).connect(padPanR);
      const lfoF = ctx.createOscillator();
      lfoF.frequency.value = rand(0.2, 0.35);
      const lfoGF = ctx.createGain();
      lfoGF.gain.value = 0.004;
      lfoF.connect(lfoGF).connect(gF.gain);
      lfoF.start(t);
      lfoF.stop(t + 4);
      fifthVoices.forEach(([type, detune]) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = fifth;
        o.detune.value = detune;
        o.connect(gF);
        o.start(t);
        o.stop(t + 4);
        addNode(o);
      });
    }

    const degree = melodyDegrees[step % melodyDegrees.length];

    if (degree >= 0) {
      const octave = (Math.random() < 0.12) ? 1 : 0;
      const freq = pentatonic(degree, octave, 'gong');

      // Update melody panner: gentle stereo sway
      melPan.pan.setValueAtTime(Math.sin(step * 0.4) * 0.15, t);

      // KS guqin pluck through the persistent melody panner
      playGuqinPluck(ctx, melPan, t, freq, 0.85, rand(0.04, 0.055));
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
