/**
 * ElementDistributionChart - Five Elements Balance
 * Horizontal bar chart showing element distribution
 */

import React from 'react';
import { useBaziTheme, getElementColor, getElementIcon } from '../theme/BaziTheme';

const ELEMENTS_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const ElementDistributionChart = ({
  distribution,       // { Wood: number, Fire: number, Earth: number, Metal: number, Water: number }
  title = 'Element Balance',
  showPercentages = true,
  showIcons = true,
  showDominant = true,
  compact = false
}) => {
  const theme = useBaziTheme();

  // Handle different data formats
  let elementValues = {};
  if (distribution?.percentages) {
    // Format from BaZi calculator: { percentages: { Wood: 20, ... } }
    elementValues = distribution.percentages;
  } else if (distribution?.breakdown) {
    // Format with visible/hidden breakdown
    const visible = distribution.breakdown.visible || {};
    const hidden = distribution.breakdown.hidden || {};
    ELEMENTS_ORDER.forEach(el => {
      elementValues[el] = (visible[el] || 0) + (hidden[el] || 0);
    });
  } else {
    // Direct format: { Wood: 20, ... }
    elementValues = distribution || {};
  }

  // Calculate max for scaling
  const values = ELEMENTS_ORDER.map(el => elementValues[el] || 0);
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0) || 1;

  // Find dominant element
  const dominant = ELEMENTS_ORDER.reduce((max, el) =>
    (elementValues[el] || 0) > (elementValues[max] || 0) ? el : max
  , 'Wood');

  const styles = {
    container: {
      background: theme.colors.card,
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: compact ? 12 : 20
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: compact ? 12 : 16
    },
    title: {
      fontSize: compact ? '0.75rem' : '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: theme.colors.muted,
      fontWeight: 600
    },
    dominant: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: '0.75rem',
      color: getElementColor(dominant),
      fontWeight: 600
    },
    dominantIcon: {
      fontSize: '1rem'
    },
    bars: {
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 8 : 12
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 8 : 12
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      width: compact ? 60 : 80,
      fontSize: compact ? '0.7rem' : '0.8rem',
      color: theme.colors.textSecondary,
      fontWeight: 500
    },
    labelIcon: {
      fontSize: compact ? '0.85rem' : '1rem'
    },
    barContainer: {
      flex: 1,
      height: compact ? 8 : 12,
      background: theme.colors.cardLight,
      borderRadius: 999,
      overflow: 'hidden'
    },
    bar: {
      height: '100%',
      borderRadius: 999,
      transition: 'width 0.5s ease-out'
    },
    value: {
      width: compact ? 35 : 45,
      fontSize: compact ? '0.7rem' : '0.75rem',
      color: theme.colors.muted,
      textAlign: 'right',
      fontWeight: 500
    },
    legend: {
      display: 'flex',
      justifyContent: 'center',
      gap: compact ? 12 : 20,
      marginTop: compact ? 12 : 16,
      paddingTop: compact ? 12 : 16,
      borderTop: `1px solid ${theme.colors.border}`
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: '0.65rem',
      color: theme.colors.muted
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: '50%'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {showDominant && (
          <span style={styles.dominant}>
            <span style={styles.dominantIcon}>{getElementIcon(dominant)}</span>
            {dominant} Dominant
          </span>
        )}
      </div>

      {/* Bars */}
      <div style={styles.bars}>
        {ELEMENTS_ORDER.map(el => {
          const value = elementValues[el] || 0;
          const pct = (value / max) * 100;
          const color = getElementColor(el);

          return (
            <div key={el} style={styles.row}>
              {/* Label */}
              <div style={styles.label}>
                {showIcons && <span style={styles.labelIcon}>{getElementIcon(el)}</span>}
                {el}
              </div>

              {/* Bar */}
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
                }} />
              </div>

              {/* Value */}
              {showPercentages && (
                <span style={styles.value}>
                  {typeof value === 'number' ? value.toFixed(1) : value}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {!compact && (
        <div style={styles.legend}>
          {ELEMENTS_ORDER.map(el => (
            <div key={el} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: getElementColor(el) }} />
              {el}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElementDistributionChart;
