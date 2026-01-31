/**
 * ============================================================================
 * EMOTIONAL ARC CHART (情绪弧线图)
 * ============================================================================
 *
 * Visualizes the emotional journey through the story:
 * - Line chart with gradient fill
 * - Color-coded by emotional tone
 * - Interactive hover states
 * - Synchronized with other dashboard components
 *
 * Created: January 2026
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { EmotionalArcData, EmotionalArcPoint, DashboardTheme } from '../storyDashboardTypes';
import { CATHEDRAL_THEME } from '../storyDashboardTypes';
import type { EmotionalTone } from '../storyTypes';

// ============================================================================
// TYPES
// ============================================================================

interface EmotionalArcChartProps {
  data: EmotionalArcData;
  onPointClick?: (point: EmotionalArcPoint) => void;
  selectedTime?: string;
  theme?: DashboardTheme;
  height?: number;
  showNarrative?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TONE_COLORS: Record<EmotionalTone, string> = {
  hopeful: '#60a5fa',
  joyful: '#fbbf24',
  passionate: '#f43f5e',
  tender: '#f9a8d4',
  reflective: '#94a3b8',
  challenging: '#ef4444',
  transformative: '#a855f7',
  peaceful: '#22d3ee',
  bittersweet: '#fb923c',
  triumphant: '#fbbf24'
};

const TRAJECTORY_DESCRIPTIONS: Record<string, { en: string; zh: string }> = {
  ascending: { en: 'Rising emotional energy', zh: '情绪能量上升' },
  descending: { en: 'Settling emotional energy', zh: '情绪能量沉淀' },
  stable: { en: 'Steady emotional energy', zh: '情绪能量稳定' },
  volatile: { en: 'Dynamic emotional shifts', zh: '情绪波动剧烈' }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EmotionalArcChart: React.FC<EmotionalArcChartProps> = ({
  data,
  onPointClick,
  selectedTime,
  theme = CATHEDRAL_THEME,
  height = 300,
  showNarrative = true
}) => {
  // Transform data for Nivo
  const chartData = useMemo(() => {
    return [{
      id: 'emotional-arc',
      data: data.points.map(point => ({
        x: point.time.slice(0, 4), // Year only for x-axis
        y: point.value,
        tone: point.tone,
        label: point.label,
        fullTime: point.time
      }))
    }];
  }, [data.points]);

  // Calculate gradient stops based on tones
  const gradientStops = useMemo(() => {
    if (data.points.length === 0) return [];

    return data.points.map((point, index) => ({
      offset: (index / (data.points.length - 1)) * 100,
      color: TONE_COLORS[point.tone]
    }));
  }, [data.points]);

  // Custom tooltip
  const CustomTooltip = ({ point }: { point: { data: { x: string; y: number; tone: EmotionalTone; label?: string } } }) => (
    <div
      style={{
        backgroundColor: '#1e1b4b',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '160px'
      }}
    >
      <div style={{ fontWeight: 'bold', color: theme.colors.text }}>
        {point.data.x}
      </div>
      <div style={{ color: TONE_COLORS[point.data.tone], fontSize: '12px', marginTop: '4px' }}>
        {point.data.tone.charAt(0).toUpperCase() + point.data.tone.slice(1)}
      </div>
      <div style={{ color: theme.colors.textMuted, fontSize: '12px', marginTop: '4px' }}>
        Intensity: {point.data.y}%
      </div>
      {point.data.label && (
        <div style={{ color: theme.colors.textMuted, fontSize: '11px', marginTop: '8px' }}>
          {point.data.label}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          height: `${height}px`,
          background: theme.colors.surface,
          borderRadius: '12px',
          padding: '16px',
          boxSizing: 'border-box'
        }}
      >
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 100 }}
          curve="natural"
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: -45,
            legend: '',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 25, 50, 75, 100],
            legend: 'Intensity',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          enableGridX={false}
          enableGridY={true}
          gridYValues={[25, 50, 75]}
          colors={[theme.colors.accent]}
          lineWidth={3}
          enablePoints={true}
          pointSize={12}
          pointColor={(point) => {
            const d = point.data as { tone?: EmotionalTone };
            return TONE_COLORS[d.tone || 'reflective'];
          }}
          pointBorderWidth={2}
          pointBorderColor={theme.colors.surface}
          enableArea={true}
          areaOpacity={0.15}
          areaBaselineValue={0}
          useMesh={true}
          tooltip={CustomTooltip}
          onClick={(point) => {
            const originalPoint = data.points.find(p => p.time.startsWith(point.data.x as string));
            if (originalPoint && onPointClick) {
              onPointClick(originalPoint);
            }
          }}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: theme.colors.textMuted,
                  fontSize: 10
                }
              },
              legend: {
                text: {
                  fill: theme.colors.textMuted,
                  fontSize: 11
                }
              }
            },
            grid: {
              line: {
                stroke: theme.colors.border,
                strokeWidth: 1
              }
            },
            crosshair: {
              line: {
                stroke: theme.colors.gold,
                strokeWidth: 1,
                strokeOpacity: 0.5
              }
            }
          }}
          defs={[
            {
              id: 'emotional-gradient',
              type: 'linearGradient',
              colors: gradientStops.length > 0
                ? gradientStops.map(stop => ({
                    offset: stop.offset,
                    color: stop.color,
                    opacity: 0.3
                  }))
                : [
                    { offset: 0, color: theme.colors.accent, opacity: 0.3 },
                    { offset: 100, color: theme.colors.accent, opacity: 0.1 }
                  ]
            }
          ]}
          fill={[{ match: '*', id: 'emotional-gradient' }]}
        />
      </div>

      {/* Narrative and Trajectory Info */}
      {showNarrative && (
        <div style={{ marginTop: '12px', padding: '0 8px' }}>
          {/* Trajectory Badge */}
          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                backgroundColor: theme.colors.surface,
                color: theme.colors.gold,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              {TRAJECTORY_DESCRIPTIONS[data.trajectory]?.en || data.trajectory}
              {' · '}
              {TRAJECTORY_DESCRIPTIONS[data.trajectory]?.zh}
            </span>
          </div>

          {/* Narrative */}
          <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: 0, lineHeight: 1.5 }}>
            {data.narrative}
          </p>

          {/* Peak and Nadir */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            {data.peak && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: theme.colors.gold, marginBottom: '2px' }}>
                  Peak Moment
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.text }}>
                  {data.peak.time.slice(0, 4)} · {data.peak.value}% {data.peak.tone}
                </div>
              </div>
            )}
            {data.nadir && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: '2px' }}>
                  Low Point
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.text }}>
                  {data.nadir.time.slice(0, 4)} · {data.nadir.value}% {data.nadir.tone}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalArcChart;
