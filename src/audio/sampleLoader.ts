/**
 * Sample loader: async fetch + decode of real instrument samples.
 * Loaded samples are cached in memory. Before samples are ready,
 * callers fall back to procedural synthesis (zero degradation).
 */

export type SampleId = 'guqin' | 'drum' | 'gong' | 'suona' | 'muyu';

const SAMPLE_URLS: Record<SampleId, string> = {
  guqin: './audio/guqin.mp3',
  drum:  './audio/drum.mp3',
  gong:  './audio/gong.mp3',
  suona: './audio/suona.mp3',
  muyu:  './audio/muyu.mp3',
};

const cache = new Map<SampleId, AudioBuffer>();
let loadPromise: Promise<void> | null = null;

/**
 * Check if a specific sample is loaded and ready to play.
 */
export function hasSample(id: SampleId): boolean {
  return cache.has(id);
}

/**
 * Get a loaded sample buffer. Returns undefined if not yet loaded.
 */
export function getSample(id: SampleId): AudioBuffer | undefined {
  return cache.get(id);
}

/**
 * Preload all samples. Call once after AudioContext is created.
 * Non-blocking: failures are silently ignored (synthesis fallback).
 */
export function preloadSamples(ctx: AudioContext): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = Promise.allSettled(
    (Object.entries(SAMPLE_URLS) as [SampleId, string][]).map(async ([id, url]) => {
      try {
        const resp = await fetch(url);
        if (!resp.ok) return; // 404 = no sample file yet, silently skip
        const arrayBuf = await resp.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        cache.set(id, audioBuf);
      } catch {
        // Network error or decode failure — silently fall back to synthesis
      }
    })
  ).then(() => {}); // void

  return loadPromise;
}

/**
 * Play a sample through the given destination node.
 * Returns true if sample was played, false if not available (caller should synthesize).
 */
export function playSample(
  ctx: AudioContext,
  id: SampleId,
  dest: AudioNode,
  options?: { rate?: number; gain?: number; time?: number }
): boolean {
  const buf = cache.get(id);
  if (!buf) return false;

  const source = ctx.createBufferSource();
  source.buffer = buf;
  if (options?.rate) source.playbackRate.value = options.rate;

  if (options?.gain !== undefined && options.gain !== 1) {
    const g = ctx.createGain();
    g.gain.value = options.gain;
    source.connect(g).connect(dest);
  } else {
    source.connect(dest);
  }

  source.start(options?.time ?? ctx.currentTime);
  return true;
}
