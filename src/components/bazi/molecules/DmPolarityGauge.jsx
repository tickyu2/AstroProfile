/**
 * DmPolarityGauge - Yin/Yang Polarity Visualization
 * Displays the chart's Yin/Yang balance with a visual gauge
 */

import React from 'react';
import { useBaziTheme } from '../theme/BaziTheme';

const DmPolarityGauge = ({
  yinRatio,           // 0-1 (weighted Yin percentage)
  yangRatio,          // 0-1 (weighted Yang percentage)
  dominant,           // 'yin' | 'yang' | 'balanced'
  dmPolarity,         // 'yin' | 'yang'
  dmPolarityMatch,    // boolean - does DM align with chart?
  polarityLabel,      // e.g., "Yang-Leaning (Yin DM)"
  compact = false
}) => {
  const theme = useBaziTheme();

  const yinPct = (yinRatio * 100).toFixed(0);
  const yangPct = (yangRatio * 100).toFixed(0);

  // Colors
  const yinColor = '#60a5fa';    // Blue
  const yangColor = '#fbbf24';   // Amber
  const matchColor = dmPolarityMatch ? '#34d399' : '#f87171'; // Green/Red

  const styles = {
    container: {
      background: theme.colors.cardLight || '#1a1a2e',
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
      background: `${matchColor}20`,
      color: matchColor,
      fontWeight: 500
    },
    gaugeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    gauge: {
      flex: 1,
      height: compact ? 8 : 12,
      background: theme.colors?.card || '#0d0d1a',
      borderRadius: 6,
      overflow: 'hidden',
      display: 'flex'
    },
    yinBar: {
      height: '100%',
      background: `linear-gradient(90deg, ${yinColor}80, ${yinColor})`,
      transition: 'width 0.5s ease'
    },
    yangBar: {
      height: '100%',
      background: `linear-gradient(90deg, ${yangColor}, ${yangColor}80)`,
      transition: 'width 0.5s ease'
    },
    percentages: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: compact ? '0.6rem' : '0.7rem',
      color: theme.colors?.muted || '#888'
    },
    yinLabel: {
      color: yinColor,
      fontWeight: 500
    },
    yangLabel: {
      color: yangColor,
      fontWeight: 500
    },
    footer: {
      fontSize: compact ? '0.6rem' : '0.7rem',
      color: theme.colors?.textSecondary || '#999',
      lineHeight: 1.4
    },
    dmIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    },
    dmDot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: matchColor
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h4 style={styles.title}>Yin/Yang Profile</h4>
        {polarityLabel && (
          <span style={styles.labelBadge}>
            {dominant === 'balanced' ? 'Balanced' : dominant === 'yang' ? 'Yang' : 'Yin'}
          </span>
        )}
      </div>

      {/* Gauge Bar */}
      <div style={styles.gaugeContainer}>
        <div style={styles.gauge}>
          <div style={{ ...styles.yinBar, width: `${yinPct}%` }} />
          <div style={{ ...styles.yangBar, width: `${yangPct}%` }} />
        </div>
      </div>

      {/* Percentages */}
      <div style={styles.percentages}>
        <span style={styles.yinLabel}>Yin {yinPct}%</span>
        <span style={styles.yangLabel}>Yang {yangPct}%</span>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.dmIndicator}>
          <span style={styles.dmDot} />
          {dmPolarity === 'yang' ? 'Yang' : 'Yin'} Day Master
          {dmPolarityMatch ? ' (aligned)' : ' (counter-flow)'}
        </span>
      </div>
    </div>
  );
};

export default DmPolarityGauge;
