// BGM: Tactical Briefing (Map) and Operation Active (Battle)
// Style: Modern Tactical Cinematic (Delta Force inspired)
import { playNoiseBurst, playWarDrum, rand } from '../utils';

type ScheduleFn = (timer: number) => void;
type AddNodeFn = (node: AudioScheduledSourceNode) => void;

const LOOKAHEAD = 0.1;
const SCHEDULER_INTERVAL = 50;

/** Battle BGM — "Operation Active" (115 BPM)
 *  Atmospheric pulses + heartbeat percussion + submerged synths
 *  Optimized for deep concentration / math solving */
export function bgmBattle(
  ctx: AudioContext, musicDest: AudioNode, _sfxDest: AudioNode,
  schedule: ScheduleFn, addNode: AddNodeFn,
): void {
  const BPM = 115;
  const beatSec = 60 / BPM;
  let nextBeatTime = ctx.currentTime + 0.05;
  let beat = 0;

  // D Minor / Phrygian
  const bassRoots = [73.42, 73.42, 77.78, 65.41]; // D2, D2, Eb2, C2

  // Global "Breathing" Filter for the entire music bus (to be connected inside the loop)
  const masterLP = ctx.createBiquadFilter();
  masterLP.type = 'lowpass';
  masterLP.Q.value = 0.5;
  masterLP.connect(musicDest);

  function scheduleBeat(t: number) {
    const bar = Math.floor(beat / 16);
    const beatInBar = beat % 16;
    const barInPhrase = bar % 4;

    // --- Adaptive "Flow" Filter (Breathing LFO) ---
    // Slow modulation of the master LPF to create a sense of movement
    const breathingRate = 0.3 + (bar % 8) * 0.05; // Slightly speeds up/slows down
    const lfo = Math.sin(t * breathingRate) * 0.5 + 0.5;
    masterLP.frequency.setValueAtTime(350 + lfo * 1400, t);

    // --- Heartbeat Percussion ---
    if (beatInBar === 0 || beatInBar === 8) {
      playWarDrum(ctx, masterLP, t, 0.07, 0.5);
    }
    
    // --- Ghost Resonance (Cinematic Depth, every 4 bars) ---
    if (beat % 64 === 0) {
      const resonance = ctx.createOscillator();
      resonance.type = 'sine';
      resonance.frequency.setValueAtTime(220, t); // Deep A3
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.012, t + 1.0);
      g.gain.linearRampToValueAtTime(0, t + 3.0);
      resonance.connect(g).connect(masterLP);
      resonance.start(t);
      resonance.stop(t + 3.1);
      addNode(resonance);
    }

    // --- Sub-Pulse ---
    if (beat % 2 === 0) {
      const root = bassRoots[barInPhrase];
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(root, t);
      
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.04, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + beatSec * 0.9);

      osc.connect(g).connect(masterLP);
      osc.start(t);
      osc.stop(t + beatSec);
      addNode(osc);
    }

    beat++;
  }



  function scheduler() {
    while (nextBeatTime < ctx.currentTime + LOOKAHEAD) {
      scheduleBeat(nextBeatTime);
      nextBeatTime += beatSec / 2; // 8th note resolution
    }
    const timer = window.setTimeout(scheduler, SCHEDULER_INTERVAL);
    schedule(timer);
  }
  scheduler();
}

/** Map BGM — "Tactical Briefing" (Ambient Tension)
 *  Sub drones + rhythmic radar pulses + filtered pads */
export function bgmMap(
  ctx: AudioContext, musicDest: AudioNode, _sfxDest: AudioNode,
  schedule: ScheduleFn, addNode: AddNodeFn,
): void {
  let beat = 0;
  const pulseSec = 0.8;
  let nextPulseTime = ctx.currentTime + 0.05;

  function schedulePulse(t: number) {
    // --- Sub Drone (every 8 pulses) ---
    if (beat % 8 === 0) {
      const drone = ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(55, t); // A1
      
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03, t + 1.0);
      g.gain.setValueAtTime(0.03, t + 5.0);
      g.gain.linearRampToValueAtTime(0, t + 6.4);

      drone.connect(g).connect(musicDest);
      drone.start(t);
      drone.stop(t + 6.5);
      addNode(drone);
    }

    // --- Radar Pulse (every 2 pulses) ---
    if (beat % 2 === 0) {
      playNoiseBurst(ctx, musicDest, t, 0.05, 2500, 'bandpass', 0.01);
    }

    // --- Filtered Saw Pad (D Minor / Phrygian context) ---
    if (beat % 16 === 0) {
      [146.83, 174.61, 220.0].forEach(freq => { // D3, F3, A3
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq + rand(-1, 1), t);
        
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(100, t);
        lp.frequency.linearRampToValueAtTime(400, t + 4.0);
        lp.frequency.linearRampToValueAtTime(100, t + 8.0);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.015, t + 2.0);
        g.gain.setValueAtTime(0.015, t + 10.0);
        g.gain.linearRampToValueAtTime(0, t + 12.8);

        osc.connect(lp).connect(g).connect(musicDest);
        osc.start(t);
        osc.stop(t + 13);
        addNode(osc);
      });
    }

    beat++;
  }

  function scheduler() {
    while (nextPulseTime < ctx.currentTime + LOOKAHEAD) {
      schedulePulse(nextPulseTime);
      nextPulseTime += pulseSec;
    }
    const timer = window.setTimeout(scheduler, SCHEDULER_INTERVAL);
    schedule(timer);
  }
  scheduler();
}

