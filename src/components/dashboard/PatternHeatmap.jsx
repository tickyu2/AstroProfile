import React, { useEffect, useRef } from 'react';
import './PatternHeatmap.css';

export function PatternHeatmap({ data }) {
  const canvasRef = useRef(null);

  // All 20 patterns
  const allPatterns = [
    // Basic (Row 1)
    'MATCHING', 'MASKING', 'SARCASM', 'AMPLIFICATION', 'SUPPRESSION', 'MIXED',
    // Advanced (Rows 2-4)
    'DEFENSIVE_DEFLECTION', 'VULNERABILITY_MASKING', 'EXCITEMENT_DAMPENING',
    'ANGER_LEAKAGE', 'ANXIETY_PROJECTION', 'OVERWHELM_SHUTDOWN',
    'FORCED_POSITIVITY', 'INTELLECTUAL_DISTANCING', 'HELP_SEEKING_DISGUISED',
    'EMOTIONAL_FLOODING', 'GUILT_MASKING', 'JOY_SUPPRESSION',
    'TRAUMA_RESPONSE', 'PERFORMATIVE_EMOTION', 'RESIGNATION_ACCEPTANCE'
  ];

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Count pattern occurrences
    const patternCounts = {};
    allPatterns.forEach(p => patternCounts[p] = 0);

    data.forEach(d => {
      // Count basic patterns
      if (d.congruence && d.congruence.patterns) {
        d.congruence.patterns.forEach(pattern => {
          if (patternCounts[pattern] !== undefined) {
            patternCounts[pattern]++;
          }
        });
      }
      // Count advanced patterns
      if (d.congruence && d.congruence.advancedPatterns) {
        d.congruence.advancedPatterns.forEach(ap => {
          if (patternCounts[ap.pattern] !== undefined) {
            patternCounts[ap.pattern]++;
          }
        });
      }
    });

    // Find max for normalization
    const maxCount = Math.max(...Object.values(patternCounts), 1);

    // Draw heatmap (7 columns x 3 rows)
    const cols = 7;
    const rows = 3;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    allPatterns.forEach((pattern, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = col * cellWidth;
      const y = row * cellHeight;

      const count = patternCounts[pattern];
      const intensity = count / maxCount;

      // Color based on intensity (blue to red gradient)
      const hue = 220 - (intensity * 220); // Blue (220) to Red (0)
      const saturation = 70 + (intensity * 20);
      const lightness = 50 - (intensity * 15);
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      // Draw cell
      ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

      // Draw border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

      // Draw label
      ctx.fillStyle = intensity > 0.5 ? 'white' : 'rgba(255, 255, 255, 0.9)';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Split pattern name
      const words = pattern.split('_');
      const textY = y + cellHeight / 2;

      if (words.length > 1) {
        ctx.fillText(words[0], x + cellWidth / 2, textY - 8);
        ctx.fillText(words[1], x + cellWidth / 2, textY + 8);
      } else {
        ctx.fillText(pattern, x + cellWidth / 2, textY);
      }

      // Draw count
      if (count > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(count.toString(), x + cellWidth / 2, y + cellHeight - 15);
      }
    });

  }, [data]);

  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="pattern-heatmap">
      <canvas
        ref={canvasRef}
        width={900}
        height={360}
        style={{ width: '100%', height: 'auto', maxHeight: '360px' }}
      />
      <div className="heatmap-legend">
        <span>Low Frequency</span>
        <div className="gradient-bar" />
        <span>High Frequency</span>
      </div>
    </div>
  );
}
