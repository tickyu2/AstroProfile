/**
 * HarmonicHeatmap Component
 *
 * Visualizes the 50-chamber Luna Wing as an interactive grid.
 * Each cell represents a harmonic detector with color intensity
 * based on harmonyBoost + bonus values.
 */

import React from 'react';
import { HarmonicHeatmapCell, HarmonicHeatmapProps } from './types';
import { cellColor, cellBorderColor, cellTextColor, getClusterColor } from './heatmapUtils';

const HarmonicHeatmap: React.FC<HarmonicHeatmapProps> = ({
  heatmap,
  onCellClick,
  columns = 10,
  showLabels = true,
  size = 'medium'
}) => {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleClick = (cell: HarmonicHeatmapCell) => {
    setSelectedId(cell.id);
    onCellClick?.(cell);
  };

  // Size configurations
  const sizeConfig = {
    small: { padding: '4px 2px', fontSize: '8px', gap: '2px' },
    medium: { padding: '8px 4px', fontSize: '10px', gap: '4px' },
    large: { padding: '12px 6px', fontSize: '12px', gap: '6px' }
  };

  const config = sizeConfig[size];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: config.gap,
        width: '100%'
      }}
    >
      {heatmap.map((cell) => {
        const isSelected = cell.id === selectedId;

        return (
          <button
            key={cell.id}
            onClick={() => handleClick(cell)}
            style={{
              border: `2px solid ${cellBorderColor(cell, isSelected)}`,
              borderRadius: '6px',
              padding: config.padding,
              backgroundColor: cellColor(cell),
              cursor: 'pointer',
              fontSize: config.fontSize,
              lineHeight: 1.3,
              color: cellTextColor(cell),
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              minHeight: size === 'small' ? '32px' : size === 'medium' ? '48px' : '60px'
            }}
            title={`#${cell.id} ${cell.name}\nCluster: ${cell.cluster}\nTriggered: ${cell.triggered ? 'Yes' : 'No'}\nBoost: ${cell.harmonyBoost.toFixed(2)}\nBonus: ${cell.bonus.toFixed(2)}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.zIndex = '10';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.zIndex = '1';
            }}
          >
            {/* Cluster indicator dot */}
            <div
              style={{
                position: 'absolute',
                top: '3px',
                right: '3px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: cell.triggered ? getClusterColor(cell.cluster) : 'transparent',
                opacity: 0.8
              }}
            />

            {/* Cell ID */}
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>
              {cell.id}
            </div>

            {/* Cluster label (optional) */}
            {showLabels && (
              <div
                style={{
                  fontSize: size === 'small' ? '6px' : '8px',
                  opacity: 0.8,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {cell.cluster}
              </div>
            )}

            {/* Triggered indicator */}
            {cell.triggered && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '8px'
                }}
              >
                ✦
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default HarmonicHeatmap;
