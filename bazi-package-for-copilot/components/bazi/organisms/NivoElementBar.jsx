/**
 * NivoElementBar - Five Elements Distribution using Nivo
 * Beautiful horizontal bar chart with element colors
 */

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useBaziTheme, getElementColor } from '../theme/BaziTheme';

const ELEMENTS_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Element color mapping for Nivo
const ELEMENT_COLORS = {
  Wood: '#4CAF50',
  Fire: '#F44336',
  Earth: '#FFC107',
  Metal: '#9E9E9E',
  Water: '#2196F3'
};

const NivoElementBar = ({
  distribution,       // { Wood: number, Fire: number, Earth: number, Metal: number, Water: number }
  title = 'Element Balance',
  layout = 'horizontal',  // 'horizontal' or 'vertical'
  showLegend = true,
  height = 300,
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

  // Transform data for Nivo
  const data = ELEMENTS_ORDER.map(element => ({
    element,
    value: Number(elementValues[element]) || 0,
    color: ELEMENT_COLORS[element]
  }));

  // Find dominant element
  const dominant = ELEMENTS_ORDER.reduce((max, el) =>
    (Number(elementValues[el]) || 0) > (Number(elementValues[max]) || 0) ? el : max
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
      color: ELEMENT_COLORS[dominant],
      fontWeight: 600
    },
    chartContainer: {
      height: compact ? height * 0.7 : height
    }
  };

  // Nivo theme for dark/light mode
  const nivoTheme = {
    background: 'transparent',
    textColor: theme.colors.text,
    fontSize: compact ? 10 : 12,
    axis: {
      domain: {
        line: {
          stroke: theme.colors.border,
          strokeWidth: 1
        }
      },
      ticks: {
        line: {
          stroke: theme.colors.border,
          strokeWidth: 1
        },
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
        strokeOpacity: 0.3
      }
    },
    legends: {
      text: {
        fill: theme.colors.textSecondary,
        fontSize: 11
      }
    },
    tooltip: {
      container: {
        background: theme.colors.card,
        color: theme.colors.text,
        fontSize: 12,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <span style={styles.dominant}>
          {dominant} Dominant
        </span>
      </div>

      {/* Nivo Bar Chart */}
      <div style={styles.chartContainer}>
        <ResponsiveBar
          data={data}
          keys={['value']}
          indexBy="element"
          layout={layout}
          margin={{
            top: 10,
            right: showLegend ? 80 : 40,
            bottom: layout === 'vertical' ? 50 : 30,
            left: layout === 'horizontal' ? 60 : 40
          }}
          padding={0.3}
          colors={({ data }) => data.color}
          borderRadius={4}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
          enableLabel={true}
          label={d => `${d.value.toFixed(1)}%`}
          labelSkipWidth={compact ? 30 : 20}
          labelSkipHeight={compact ? 12 : 8}
          labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={layout === 'vertical' ? {
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0
          } : {
            tickSize: 0,
            tickPadding: 10,
            tickValues: 5,
            format: v => `${v}%`
          }}
          axisLeft={layout === 'horizontal' ? {
            tickSize: 0,
            tickPadding: 10
          } : {
            tickSize: 0,
            tickPadding: 10,
            tickValues: 5,
            format: v => `${v}%`
          }}
          enableGridX={layout === 'horizontal'}
          enableGridY={layout === 'vertical'}
          theme={nivoTheme}
          animate={true}
          motionConfig="gentle"
          role="img"
          ariaLabel="Element distribution chart"
          tooltip={({ data, value }) => (
            <div style={{
              padding: '8px 12px',
              background: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 8
            }}>
              <strong style={{ color: data.color }}>{data.element}</strong>
              <span style={{ marginLeft: 8, color: theme.colors.text }}>
                {value.toFixed(1)}%
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default NivoElementBar;
