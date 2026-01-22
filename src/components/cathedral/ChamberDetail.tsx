/**
 * ChamberDetail Component
 *
 * Displays detailed information about a selected heatmap chamber.
 * Shows name, cluster, trigger status, boost/bonus values, and details.
 */

import React from 'react';
import { ChamberDetailProps } from './types';
import { cellIntensity, getClusterColor } from './heatmapUtils';

const ChamberDetail: React.FC<ChamberDetailProps> = ({ cell }) => {
  if (!cell) {
    return (
      <div
        style={{
          background: 'rgba(20, 20, 30, 0.8)',
          borderRadius: '8px',
          padding: '16px',
          color: 'rgba(200, 200, 210, 0.7)',
          textAlign: 'center',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <p>Select a chamber in the heatmap to view its harmonic signature.</p>
      </div>
    );
  }

  const intensity = cellIntensity(cell);
  const clusterColor = getClusterColor(cell.cluster);

  return (
    <div
      style={{
        background: 'rgba(20, 20, 30, 0.9)',
        borderRadius: '8px',
        padding: '16px',
        color: '#f5f5ff',
        border: `1px solid ${clusterColor}40`
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: cell.triggered ? clusterColor : 'rgba(60, 60, 70, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700
          }}
        >
          {cell.id}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
            {cell.cluster}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>
            {cell.name}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: cell.triggered
              ? 'rgba(52, 211, 153, 0.2)'
              : 'rgba(156, 163, 175, 0.2)',
            color: cell.triggered ? '#34d399' : '#9ca3af',
            fontSize: '11px',
            fontWeight: 500
          }}
        >
          <span style={{ fontSize: '10px' }}>
            {cell.triggered ? '●' : '○'}
          </span>
          {cell.triggered ? 'Chamber Active' : 'Chamber Dormant'}
        </div>
      </div>

      {/* Values */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            padding: '10px'
          }}
        >
          <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>
            Harmony Boost
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: cell.triggered ? '#a78bfa' : '#6b7280' }}>
            {cell.harmonyBoost.toFixed(3)}
          </div>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            padding: '10px'
          }}
        >
          <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>
            Bonus
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: cell.triggered ? '#60a5fa' : '#6b7280' }}>
            {cell.bonus.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Intensity bar */}
      {cell.triggered && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '6px' }}>
            Resonance Intensity
          </div>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px',
              height: '8px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${intensity * 100}%`,
                background: `linear-gradient(90deg, ${clusterColor}80, ${clusterColor})`,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px', textAlign: 'right' }}>
            {(intensity * 100).toFixed(0)}%
          </div>
        </div>
      )}

      {/* Details */}
      {cell.triggered && cell.details && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '11px',
            lineHeight: 1.5,
            fontStyle: 'italic',
            opacity: 0.8
          }}
        >
          {cell.details}
        </div>
      )}
    </div>
  );
};

export default ChamberDetail;
