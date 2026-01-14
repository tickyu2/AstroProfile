/**
 * DmRootednessMeter - Stem-Branch Rootedness Visualization
 * Displays how well the stems are supported by their branches
 */

import React from 'react';
import { useBaziTheme } from '../theme/BaziTheme';

const DmRootednessMeter = ({
  rootednessNormalized,  // 0-1 scale
  rootednessLabel,       // e.g., "Well Rooted"
  dmHasStrongRoot,       // boolean
  rootedPillarCount,     // number 0-4
  compact = false
}) => {
  const theme = useBaziTheme();

  const pct = (rootednessNormalized * 100).toFixed(0);

  // Color based on rootedness level
  const getBarColor = (level) => {
    if (level >= 0.75) return '#34d399'; // Emerald
    if (level >= 0.55) return '#22c55e'; // Green
    if (level >= 0.35) return '#fbbf24'; // Amber
    if (level >= 0.15) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const barColor = getBarColor(rootednessNormalized);

  // Generate pillar indicators
  const pillarIndicators = Array.from({ length: 4 }, (_, i) => ({
    active: i < rootedPillarCount,
    label: ['Y', 'M', 'D', 'H'][i]
  }));

  const styles = {
    container: {
      background: theme.colors?.cardLight || '#1a1a2e',
      borderRadius: theme.radius?.md || 8,
      padding: compact ? 10 : 14,
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 6 : 10
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: compact ? '0.7rem' : '0.8rem',
      fontWeight: 600,
      color: theme.colors?.text || '#e0e0e0',
      margin: 0
    },
    labelBadge: {
      fontSize: compact ? '0.6rem' : '0.65rem',
      padding: '2px 6px',
      borderRadius: 4,
      background: `${barColor}20`,
      color: barColor,
      fontWeight: 500
    },
    meterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    meter: {
      flex: 1,
      height: compact ? 8 : 12,
      background: theme.colors?.card || '#0d0d1a',
      borderRadius: 6,
      overflow: 'hidden'
    },
    meterFill: {
      height: '100%',
      background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
      borderRadius: 6,
      transition: 'width 0.5s ease'
    },
    percentage: {
      fontSize: compact ? '0.7rem' : '0.8rem',
      fontWeight: 600,
      color: barColor,
      minWidth: 40,
      textAlign: 'right'
    },
    pillarsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 4
    },
    pillarsLabel: {
      fontSize: compact ? '0.6rem' : '0.7rem',
      color: theme.colors?.muted || '#888'
    },
    pillarsIndicators: {
      display: 'flex',
      gap: 4
    },
    pillarDot: {
      width: compact ? 16 : 20,
      height: compact ? 16 : 20,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: compact ? '0.5rem' : '0.6rem',
      fontWeight: 600,
      transition: 'all 0.3s ease'
    },
    pillarActive: {
      background: '#34d39930',
      color: '#34d399',
      border: '1px solid #34d39950'
    },
    pillarInactive: {
      background: theme.colors?.card || '#0d0d1a',
      color: theme.colors?.muted || '#666',
      border: `1px solid ${theme.colors?.border || '#333'}`
    },
    footer: {
      fontSize: compact ? '0.6rem' : '0.7rem',
      color: theme.colors?.textSecondary || '#999',
      lineHeight: 1.4
    },
    dmRoot: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    },
    dmDot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: dmHasStrongRoot ? '#34d399' : '#fbbf24'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h4 style={styles.title}>Stem-Branch Rootedness</h4>
        {rootednessLabel && (
          <span style={styles.labelBadge}>{rootednessLabel}</span>
        )}
      </div>

      {/* Meter Bar */}
      <div style={styles.meterContainer}>
        <div style={styles.meter}>
          <div style={{ ...styles.meterFill, width: `${pct}%` }} />
        </div>
        <span style={styles.percentage}>{pct}%</span>
      </div>

      {/* Pillars Row */}
      <div style={styles.pillarsRow}>
        <span style={styles.pillarsLabel}>Rooted Pillars:</span>
        <div style={styles.pillarsIndicators}>
          {pillarIndicators.map((pillar, idx) => (
            <div
              key={idx}
              style={{
                ...styles.pillarDot,
                ...(pillar.active ? styles.pillarActive : styles.pillarInactive)
              }}
            >
              {pillar.label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.dmRoot}>
          <span style={styles.dmDot} />
          Day Master: {dmHasStrongRoot ? 'Strong root' : 'Moderate/Light root'}
        </span>
      </div>
    </div>
  );
};

export default DmRootednessMeter;
