/**
 * DestinyECG — scrolling tension waveform
 *
 * A living ECG that visualizes internal tension as a scrolling waveform.
 * Higher severity → wilder oscillation. Resets on scroll overflow.
 */

import React, { useEffect, useRef } from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';

interface Props {
  severity: number;   // 0-1
  dayMaster: string;  // element name for line color
  bpm: number;        // drives waveform speed
  /** Optional element override — pillar-sync mode shifts waveform color */
  activeElement?: string;
}

export const DestinyECG: React.FC<Props> = ({ severity, dayMaster, bpm, activeElement }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const xRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;
    const color = ELEMENT_COLORS[activeElement || dayMaster] || '#38bdf8';

    // ECG-like waveform params
    const baseAmp = 8 + severity * 28;    // 8px calm → 36px intense
    const spikeAmp = 12 + severity * 30;  // QRS spike height
    const speed = 1 + (bpm / 80);         // pixels per frame

    let x = xRef.current;
    let phase = 0;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 1)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.lineWidth = 0.5;
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Fade trail
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Draw a segment
      const segsPerFrame = Math.ceil(speed);
      for (let s = 0; s < segsPerFrame; s++) {
        phase += 0.08;

        // ECG waveform: baseline + P wave + QRS complex + T wave
        const cycle = phase % (Math.PI * 2);
        let y: number;

        if (cycle < 1.2) {
          // P wave (small bump)
          y = midY - Math.sin(cycle * 2.6) * baseAmp * 0.3;
        } else if (cycle < 1.8) {
          // QRS complex (sharp spike)
          const qrs = (cycle - 1.2) / 0.6;
          if (qrs < 0.3) {
            y = midY + spikeAmp * 0.3 * (qrs / 0.3);
          } else if (qrs < 0.5) {
            y = midY - spikeAmp * ((qrs - 0.3) / 0.2);
          } else {
            y = midY + spikeAmp * 0.4 * ((qrs - 0.5) / 0.5);
          }
        } else if (cycle < 3.5) {
          // T wave (rounded bump)
          const tw = (cycle - 1.8) / 1.7;
          y = midY - Math.sin(tw * Math.PI) * baseAmp * 0.5;
        } else {
          // Baseline with slight noise from severity
          y = midY + (Math.random() - 0.5) * severity * 4;
        }

        // Draw point
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x, y, 1.5, 1.5);
        ctx.globalAlpha = 1;

        // Glow trail
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x, y - 1, 2, 3);
        ctx.globalAlpha = 1;

        x += 1;
        if (x > width) {
          x = 0;
          ctx.fillStyle = 'rgba(15, 23, 42, 1)';
          ctx.fillRect(0, 0, width, height);
          // Redraw grid
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
          ctx.lineWidth = 0.5;
          for (let gy = 0; gy < height; gy += 20) {
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(width, gy);
            ctx.stroke();
          }
        }
      }

      xRef.current = x;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [severity, dayMaster, bpm, activeElement]);

  return (
    <div className="destiny-ecg" style={{ padding: '6px' }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        style={{ width: '100%', height: 80, borderRadius: '6px' }}
      />
    </div>
  );
};
