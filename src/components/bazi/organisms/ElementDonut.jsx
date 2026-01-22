/**
 * ElementDonut - Five Elements Donut Chart using Nivo
 * Beautiful pie/donut visualization with element colors
 */

import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useBaziTheme, getElementIcon } from '../theme/BaziTheme';

const ELEMENTS_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Element color mapping for Nivo
const ELEMENT_COLORS = {
  Wood: '#4CAF50',
  Fire: '#F44336',
  Earth: '#FFC107',
  Metal: '#9E9E9E',
  Water: '#2196F3'
};

const ElementDonut = ({
  distribution,       // { Wood: number, Fire: number, Earth: number, Metal: number, Water: number }
  title = 'Element Distribution',
  innerRadius = 0.6,  // 0 = pie, 0.6+ = donut
  showLabels = true,
  showLegend = true,
  height = 320,
  compact = false
}) => {
  const theme = useBaziTheme();

  // Handle different data formats
  let elementValues = {};
  if (distribution?.percentages) {
    elementValues = distribution.percentages;
  } else if (distribution?.breakdown) {
    const visible = distribution.breakdown.visible || {};
    const hidden = distribution.breakdown.hidden || {};
    ELEMENTS_ORDER.forEach(el => {
      elementValues[el] = (visible[el] || 0) + (hidden[el] || 0);
    });
  } else {
    elementValues = distribution || {};
  }

  // Transform data for Nivo Pie
  const data = ELEMENTS_ORDER
    .filter(element => (Number(elementValues[element]) || 0) > 0)
    .map(element => ({
      id: element,
      label: element,
      value: Number(elementValues[element]) || 0,
      color: ELEMENT_COLORS[element]
    }));

  // Find dominant element
  const dominant = ELEMENTS_ORDER.reduce((max, el) =>
    (Number(elementValues[el]) || 0) > (Number(elementValues[max]) || 0) ? el : max
  , 'Wood');
  const dominantValue = Number(elementValues[dominant]) || 0;

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
      marginBottom: compact ? 8 : 12
    },
    title: {
      fontSize: compact ? '0.75rem' : '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: theme.colors.muted,
      fontWeight: 600
    },
    chartContainer: {
      height: compact ? height * 0.75 : height,
      position: 'relative'
    },
    centerLabel: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      pointerEvents: 'none'
    },
    centerIcon: {
      fontSize: compact ? '1.5rem' : '2rem',
      marginBottom: 4
    },
    centerText: {
      fontSize: compact ? '0.75rem' : '0.85rem',
      color: ELEMENT_COLORS[dominant],
      fontWeight: 600
    },
    centerValue: {
      fontSize: compact ? '1.2rem' : '1.5rem',
      color: theme.colors.text,
      fontWeight: 700
    }
  };

  // Nivo theme for dark/light mode
  const nivoTheme = {
    background: 'transparent',
    textColor: theme.colors.text,
    fontSize: compact ? 10 : 12,
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
      </div>

      {/* Nivo Pie/Donut Chart */}
      <div style={styles.chartContainer}>
        <ResponsivePie
          data={data}
          margin={{
            top: 20,
            right: showLegend ? 100 : 40,
            bottom: 20,
            left: 40
          }}
          innerRadius={innerRadius}
          padAngle={2}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          enableArcLinkLabels={showLabels && !compact}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={theme.colors.text}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLinkLabelsDiagonalLength={compact ? 8 : 16}
          arcLinkLabelsStraightLength={compact ? 8 : 12}
          enableArcLabels={showLabels}
          arcLabelsSkipAngle={15}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          arcLabel={d => `${d.value.toFixed(0)}%`}
          theme={nivoTheme}
          legends={showLegend ? [
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: compact ? 60 : 80,
              translateY: 0,
              itemsSpacing: compact ? 4 : 8,
              itemWidth: 60,
              itemHeight: 20,
              itemTextColor: theme.colors.textSecondary,
              itemDirection: 'left-to-right',
              symbolSize: compact ? 12 : 16,
              symbolShape: 'circle'
            }
          ] : []}
          animate={true}
          motionConfig="gentle"
          tooltip={({ datum }) => (
            <div style={{
              padding: '8px 12px',
              background: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ fontSize: '1.2rem' }}>{getElementIcon(datum.id)}</span>
              <strong style={{ color: datum.color }}>{datum.id}</strong>
              <span style={{ color: theme.colors.text }}>
                {datum.value.toFixed(1)}%
              </span>
            </div>
          )}
        />

        {/* Center Label (for donut) */}
        {innerRadius > 0.3 && (
          <div style={styles.centerLabel}>
            <div style={styles.centerIcon}>{getElementIcon(dominant)}</div>
            <div style={styles.centerText}>{dominant}</div>
            <div style={styles.centerValue}>{dominantValue.toFixed(0)}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementDonut;
