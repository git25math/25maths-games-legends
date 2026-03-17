import { useState, useRef, useCallback, useEffect } from "react";

// Module-level singleton AudioContext
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Pentatonic scale frequencies (C4-D4-E4-G4-A4)
const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0];
const C3 = 130.81;

const LS_KEY = "gl_muted";

export function useAudio() {
  const [muted, setMuted] = useState(
    () => localStorage.getItem(LS_KEY) === "1",
  );
  // Ref mirror for stable callbacks — avoids [muted] dep on every play* function
  const mutedRef = useRef(muted);
  const bgmRef = useRef<number | null>(null);
  const bgmNodesRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(LS_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  // Stop BGM when muted
  useEffect(() => {
    if (muted && bgmRef.current !== null) {
      stopBGMInternal();
    }
  }, [muted]);

  function stopBGMInternal() {
    bgmNodesRef.current.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
    bgmNodesRef.current = [];
    if (bgmRef.current !== null) {
      clearTimeout(bgmRef.current);
      bgmRef.current = null;
    }
  }

  // All play* callbacks read mutedRef.current → stable [] deps → no re-renders on mute
  const playBGM = useCallback(() => {
    if (mutedRef.current) return;
    stopBGMInternal();

    const ac = getCtx();
    let step = 0;

    function scheduleNote() {
      if (mutedRef.current) { stopBGMInternal(); return; }
      if (bgmRef.current === null && step > 0) return;

      const now = ac.currentTime;
      const freq = PENTA[step % PENTA.length];

      // Melody: sine wave with attack/release envelope
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.connect(gain).connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.45);
      bgmNodesRef.current.push(osc);

      // Drum on even beats: low C3 sine thump
      if (step % 2 === 0) {
        const drum = ac.createOscillator();
        const dGain = ac.createGain();
        drum.type = "sine";
        drum.frequency.value = C3;
        dGain.gain.setValueAtTime(0.15, now);
        dGain.gain.linearRampToValueAtTime(0, now + 0.15);
        drum.connect(dGain).connect(ac.destination);
        drum.start(now);
        drum.stop(now + 0.2);
        bgmNodesRef.current.push(drum);
      }

      step++;

      // Keep only recent nodes to prevent unbounded growth
      if (bgmNodesRef.current.length > 10) {
        bgmNodesRef.current = bgmNodesRef.current.slice(-4);
      }

      bgmRef.current = window.setTimeout(scheduleNote, 450);
    }

    scheduleNote();
  }, []);

  const stopBGM = useCallback(() => {
    stopBGMInternal();
  }, []);

  const playSuccess = useCallback(() => {
    if (mutedRef.current) return;
    const ac = getCtx();
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5-E5-G5-C6
    const now = ac.currentTime;

    freqs.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = now + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + 0.1);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  }, []);

  const playFail = useCallback(() => {
    if (mutedRef.current) return;
    const ac = getCtx();
    const freqs = [329.63, 261.63]; // E4-C4
    const now = ac.currentTime;

    freqs.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const t = now + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + 0.15);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  }, []);

  const playClick = useCallback(() => {
    if (mutedRef.current) return;
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.05);
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }, []);

  return { playBGM, stopBGM, playSuccess, playFail, playClick, muted, toggleMute };
}
