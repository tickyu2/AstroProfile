/**
 * PersonalityRadar - Enhanced Element Radar Chart using Nivo
 * Beautiful radar visualization with dynamic scaling and element colors
 */

import React, { useMemo } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { useBaziTheme, getElementIcon } from '../theme/BaziTheme';

// Element colors matching the Five Elements
const ELEMENT_COLORS = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#a1a1aa',
  Water: '#3b82f6'
};

const PersonalityRadar = ({
  data,               // Array of { trait: string, score: number }
  keys = ['score'],
  indexBy = 'trait',
  title = 'Five Elements Profile',
  showLegend = false,
  height = 450,
  compact = false
}) => {
  const theme = useBaziTheme();

  // Calculate dynamic max value (round up to nearest 5, minimum 40)
  const maxValue = useMemo(() => {
    const maxScore = Math.max(...data.map(d => Number(d.score) || 0));
    const rounded = Math.ceil(maxScore / 5) * 5;
    return Math.max(rounded + 5, 40); // Add padding, minimum 40%
  }, [data]);

  // Enhanced data with element colors
  const enhancedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      score: Number(d.score) || 0,
      color: ELEMENT_COLORS[d.trait] || '#8884d8'
    }));
  }, [data]);

  // Calculate stats
  const stats = useMemo(() => {
    const scores = enhancedData.map(d => d.score);
    const total = scores.reduce((a, b) => a + b, 0);
    const dominant = enhancedData.reduce((max, d) => d.score > max.score ? d : max, enhancedData[0]);
    const weakest = enhancedData.reduce((min, d) => d.score < min.score ? d : min, enhancedData[0]);
    return { total, dominant, weakest };
  }, [enhancedData]);

  const styles = {
    container: {
      background: `linear-gradient(135deg, ${theme.colors.card} 0%, ${theme.colors.cardLight}40 100%)`,
      borderRadius: theme.radius.xl,
      border: `1px solid ${theme.colors.border}`,
      padding: compact ? 16 : 24,
      position: 'relative',
      overflow: 'hidden'
    },
    glow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      height: '60%',
      background: `radial-gradient(circle, ${ELEMENT_COLORS[stats.dominant?.trait]}20 0%, transparent 70%)`,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 0
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: compact ? 8 : 16,
      position: 'relative',
      zIndex: 1
    },
    title: {
      fontSize: compact ? '0.8rem' : '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: theme.colors.text,
      fontWeight: 700
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 20,
      background: `${ELEMENT_COLORS[stats.dominant?.trait]}25`,
      border: `1px solid ${ELEMENT_COLORS[stats.dominant?.trait]}50`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: ELEMENT_COLORS[stats.dominant?.trait]
    },
    chartContainer: {
      height: compact ? height * 0.8 : height,
      position: 'relative',
      zIndex: 1
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: compact ? 16 : 32,
      marginTop: compact ? 12 : 20,
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 1
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    },
    statIcon: {
      fontSize: compact ? '1.2rem' : '1.5rem'
    },
    statValue: {
      fontSize: compact ? '1rem' : '1.2rem',
      fontWeight: 700,
      color: theme.colors.text
    },
    statLabel: {
      fontSize: '0.65rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: theme.colors.muted
    }
  };

  // Nivo theme
  const nivoTheme = {
    background: 'transparent',
    textColor: theme.colors.text,
    fontSize: compact ? 11 : 13,
    axis: {
      ticks: {
        text: {
          fill: theme.colors.textSecondary,
          fontSize: compact ? 10 : 12
        }
      }
    },
    grid: {
      line: {
        stroke: theme.colors.border,
        strokeWidth: 1,
        strokeOpacity: 0.5,
        strokeDasharray: '4 4'
      }
    },
    dots: {
      text: {
        fill: theme.colors.text,
        fontSize: compact ? 10 : 12,
        fontWeight: 600
      }
    },
    tooltip: {
      container: {
        background: theme.colors.card,
        color: theme.colors.text,
        fontSize: 13,
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: `1px solid ${theme.colors.border}`
      }
    }
  };

  // Custom colors - gradient effect
  const chartColors = [`${ELEMENT_COLORS[stats.dominant?.trait]}cc`];

  return (
    <div style={styles.container}>
      {/* Background glow */}
      <div style={styles.glow} />

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <div style={styles.badge}>
          <span>{getElementIcon(stats.dominant?.trait)}</span>
          <span>{stats.dominant?.trait} Dominant</span>
        </div>
      </div>

      {/* Nivo Radar Chart */}
      <div style={styles.chartContainer}>
        <ResponsiveRadar
          data={enhancedData}
          keys={keys}
          indexBy={indexBy}
          maxValue={maxValue}
          valueFormat={v => `${v.toFixed(1)}%`}
          margin={{
            top: compact ? 30 : 40,
            right: compact ? 50 : 70,
            bottom: compact ? 30 : 40,
            left: compact ? 50 : 70
          }}
          curve="linearClosed"
          borderWidth={3}
          borderColor={ELEMENT_COLORS[stats.dominant?.trait]}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={compact ? 20 : 28}
          enableDots={true}
          dotSize={compact ? 10 : 14}
          dotColor={theme.colors.card}
          dotBorderWidth={3}
          dotBorderColor={ELEMENT_COLORS[stats.dominant?.trait]}
          enableDotLabel={true}
          dotLabel={d => `${d.value.toFixed(0)}%`}
          dotLabelYOffset={-12}
          colors={chartColors}
          fillOpacity={0.35}
          blendMode="normal"
          animate={true}
          motionConfig="gentle"
          theme={nivoTheme}
          sliceTooltip={({ index, data: sliceData }) => {
            const item = enhancedData.find(d => d.trait === index);
            return (
              <div style={{
                padding: '12px 16px',
                background: theme.colors.card,
                border: `2px solid ${item?.color || theme.colors.border}`,
                borderRadius: 12,
                minWidth: 140
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{getElementIcon(index)}</span>
                  <strong style={{
                    color: item?.color || theme.colors.text,
                    fontSize: '1.1rem'
                  }}>
                    {index}
                  </strong>
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: theme.colors.text
                }}>
                  {item?.score.toFixed(1)}%
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: theme.colors.muted,
                  marginTop: 4,
                  textTransform: 'uppercase'
                }}>
                  of total composition
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        {enhancedData.map(item => (
          <div key={item.trait} style={styles.statItem}>
            <span style={{
              ...styles.statIcon,
              filter: item.trait === stats.dominant?.trait ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }}>
              {getElementIcon(item.trait)}
            </span>
            <span style={{
              ...styles.statValue,
              color: item.color,
              textShadow: item.trait === stats.dominant?.trait ? `0 0 12px ${item.color}` : 'none'
            }}>
              {item.score.toFixed(1)}%
            </span>
            <span style={styles.statLabel}>{item.trait}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityRadar;
