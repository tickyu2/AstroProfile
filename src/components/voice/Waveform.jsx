/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WAVEFORM - Real-time Audio Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Oscilloscope-style waveform visualization using Web Audio API.
 * Draws microphone input in real-time on a canvas.
 *
 * Created: December 21, 2025
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { ELEMENTAL_PALETTES } from './SoulVisualizer';

/**
 * Get waveform color based on constitution
 */
function getWaveformColor(constitution) {
  const palette = ELEMENTAL_PALETTES[constitution] || ELEMENTAL_PALETTES.Water;
  return palette.primary;
}

/**
 * Waveform Component
 *
 * @param {Object} props
 * @param {MediaStream} props.audioStream - Microphone audio stream
 * @param {string} props.constitution - Elemental constitution for theming
 * @param {number} props.width - Canvas width
 * @param {number} props.height - Canvas height
 * @param {string} props.className - Additional CSS class
 */
const Waveform = ({
  audioStream,
  constitution = 'Water',
  width = 500,
  height = 100,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);

  // Get color based on constitution
  const strokeColor = useMemo(() => getWaveformColor(constitution), [constitution]);

  useEffect(() => {
    if (!audioStream) return;

    // Create audio context and analyser
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(audioStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function draw() {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      // Background with subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      gradient.addColorStop(1, 'rgba(30, 27, 75, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center line (subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream, strokeColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`waveform-canvas ${className}`}
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    />
  );
};

/**
 * Compact waveform for inline use
 */
export const WaveformMini = ({ audioStream, constitution }) => (
  <Waveform
    audioStream={audioStream}
    constitution={constitution}
    width={200}
    height={40}
  />
);

export default Waveform;
