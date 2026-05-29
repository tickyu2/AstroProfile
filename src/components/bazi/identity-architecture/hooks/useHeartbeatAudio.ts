/**
 * useHeartbeatAudio — Web Audio API synthesized heartbeat
 *
 * Generates a soft, low-frequency "thump" synced to BPM.
 * Severity modulates frequency and volume.
 */

import { useEffect, useRef } from 'react';
import { heartbeatFrequency, heartbeatVolume } from '../engine/destinyPulse';

export function useHeartbeatAudio(bpm: number, severity: number, enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const beatMs = 60000 / bpm;
    const freq = heartbeatFrequency(severity);
    const vol = heartbeatVolume(severity);

    function thump() {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
      const ctx = audioCtxRef.current;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = freq;
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }

    intervalRef.current = setInterval(thump, beatMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [bpm, severity, enabled]);
}
