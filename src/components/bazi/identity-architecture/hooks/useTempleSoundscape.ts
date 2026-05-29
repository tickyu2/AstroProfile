/**
 * useTempleSoundscape — Web Audio API layered ambient drone
 *
 * Synthesizes the Temple soundscape using oscillators and filtered noise.
 * No external audio files required.
 *
 * Each SoundLayerConfig becomes either:
 *   - An OscillatorNode (for drones / elemental tones)
 *   - A noise buffer through BiquadFilter (for wind / storm rumble)
 *
 * All layers have slow gain modulation (breathing) for organic feel.
 */

import { useEffect, useRef } from 'react';
import type { SoundLayerConfig } from '../engine/templeSoundscape';

interface ActiveLayer {
  source: AudioBufferSourceNode | OscillatorNode;
  gain: GainNode;
  lfo?: OscillatorNode;
  lfoGain?: GainNode;
}

/** Create a white noise AudioBuffer */
function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * 2; // 2 seconds of noise
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function useTempleSoundscape(
  layers: SoundLayerConfig[],
  enabled: boolean,
): void {
  const ctxRef = useRef<AudioContext | null>(null);
  const activeRef = useRef<ActiveLayer[]>([]);

  useEffect(() => {
    if (!enabled || layers.length === 0) {
      // Stop all active layers
      activeRef.current.forEach(l => {
        try { l.source.stop(); } catch { /* already stopped */ }
        try { l.lfo?.stop(); } catch { /* already stopped */ }
      });
      activeRef.current = [];
      return;
    }

    // Create or resume AudioContext
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const noiseBuffer = createNoiseBuffer(ctx);
    const actives: ActiveLayer[] = [];

    for (const layer of layers) {
      // Master gain for this layer
      const gain = ctx.createGain();
      gain.gain.value = layer.volume;
      gain.connect(ctx.destination);

      let source: OscillatorNode | AudioBufferSourceNode;

      if (layer.type === 'oscillator') {
        // Tonal drone
        const osc = ctx.createOscillator();
        osc.type = layer.waveform || 'sine';
        osc.frequency.value = layer.frequency || 55;
        osc.connect(gain);
        osc.start();
        source = osc;
      } else {
        // Noise layer with optional lowpass filter
        const bufSrc = ctx.createBufferSource();
        bufSrc.buffer = noiseBuffer;
        bufSrc.loop = true;

        if (layer.filterFreq) {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = layer.filterFreq;
          filter.Q.value = 0.7;
          bufSrc.connect(filter);
          filter.connect(gain);
        } else {
          bufSrc.connect(gain);
        }
        bufSrc.start();
        source = bufSrc;
      }

      // Slow volume modulation (breathing) via LFO
      const active: ActiveLayer = { source, gain };
      if (layer.breathePeriod) {
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 1 / layer.breathePeriod;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = layer.volume * 0.3; // modulate ±30%

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        active.lfo = lfo;
        active.lfoGain = lfoGain;
      }

      actives.push(active);
    }

    activeRef.current = actives;

    return () => {
      actives.forEach(l => {
        try { l.source.stop(); } catch { /* noop */ }
        try { l.lfo?.stop(); } catch { /* noop */ }
      });
    };
    // Re-create layers when config changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, layers.length]);
}
