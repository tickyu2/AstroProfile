/**
 * ============================================================================
 * TIMING CURVE CHART (运势曲线图)
 * ============================================================================
 *
 * Visualizes the destiny/timing trajectory:
 * - Area chart with favorable/unfavorable zones
 * - Peak windows highlighted
 * - Caution periods marked
 * - Trend indicators
 *
 * Created: January 2026
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsiveLine } from '@nivo/line';
import type { TrajectoryCurve, TimingCurvePoint, DashboardTheme } from '../storyDashboardTypes';
import { CATHEDRAL_THEME } from '../storyDashboardTypes';

// ============================================================================
// TYPES
// ============================================================================

interface TimingCurveChartProps {
  curve: TrajectoryCurve;
  onPointClick?: (point: TimingCurvePoint) => void;
  selectedTime?: string;
  theme?: DashboardTheme;
  height?: number;
  showNarrative?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TREND_ICONS: Record<string, string> = {
  improving: '📈',
  declining: '📉',
  steady: '➡️',
  cyclical: '🔄'
};

const TREND_LABELS: Record<string, { en: string; zh: string }> = {
  improving: { en: 'Improving trajectory', zh: '运势上升' },
  declining: { en: 'Declining trajectory', zh: '运势下降' },
  steady: { en: 'Steady trajectory', zh: '运势平稳' },
  cyclical: { en: 'Cyclical patterns', zh: '周期波动' }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TimingCurveChart: React.FC<TimingCurveChartProps> = ({
  curve,
  onPointClick,
  selectedTime,
  theme = CATHEDRAL_THEME,
  height = 300,
  showNarrative = true
}) => {
  // Transform data for Nivo line chart
  const chartData = useMemo(() => {
    return [{
      id: 'timing',
      data: curve.points.map(point => ({
        x: point.time.slice(0, 4),
        y: point.score,
        favorable: point.favorable,
        phase: point.phase,
        events: point.events,
        fullTime: point.time
      }))
    }];
  }, [curve.points]);

  // Determine color for each point
  const getPointColor = (score: number): string => {
    if (score >= 70) return theme.colors.excellent;
    if (score >= 55) return theme.colors.good;
    if (score >= 40) return theme.colors.mixed;
    if (score >= 25) return theme.colors.caution;
    return theme.colors.challenging_env;
  };

  // Custom tooltip
  const CustomTooltip = ({ point }: { point: { data: { x: string; y: number; favorable: boolean; phase?: string; events?: string[] } } }) => (
    <div
      style={{
        backgroundColor: '#1e1b4b',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '180px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getPointColor(point.data.y)
          }}
        />
        <span style={{ fontWeight: 'bold', color: theme.colors.text }}>
          {point.data.x}
        </span>
      </div>

      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: getPointColor(point.data.y) }}>
          {point.data.y}
        </div>
        <div style={{ fontSize: '11px', color: theme.colors.textMuted }}>
          {point.data.favorable ? '✓ Favorable Period' : '⚠ Caution Period'}
        </div>
      </div>

      {point.data.phase && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: theme.colors.textMuted }}>
          Phase: {point.data.phase}
        </div>
      )}

      {point.data.events && point.data.events.length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: theme.colors.textMuted }}>
          {point.data.events.slice(0, 2).map((event, i) => (
            <div key={i}>• {event}</div>
          ))}
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
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Favorable Zone Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '36px',
            bottom: '66px',
            left: '66px',
            right: '36px',
            background: `linear-gradient(to bottom,
              rgba(34, 197, 94, 0.1) 0%,
              rgba(34, 197, 94, 0.05) 30%,
              transparent 50%,
              rgba(239, 68, 68, 0.05) 70%,
              rgba(239, 68, 68, 0.1) 100%
            )`,
            pointerEvents: 'none',
            borderRadius: '4px'
          }}
        />

        {/* Threshold Lines */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(36px + 30%)',
            left: '66px',
            right: '36px',
            height: '1px',
            backgroundColor: theme.colors.excellent,
            opacity: 0.3
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 'calc(36px + 50%)',
            left: '66px',
            right: '36px',
            height: '1px',
            backgroundColor: theme.colors.textMuted,
            opacity: 0.2
          }}
        />

        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 100 }}
          curve="monotoneX"
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: -45,
            legend: '',
            legendOffset: 36
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [0, 25, 50, 75, 100],
            legend: 'Score',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          enableGridX={false}
          enableGridY={false}
          colors={[theme.colors.accent]}
          lineWidth={3}
          enablePoints={true}
          pointSize={14}
          pointColor={(point) => {
            const score = point.data.y as number;
            return getPointColor(score);
          }}
          pointBorderWidth={3}
          pointBorderColor={theme.colors.surface}
          enableArea={true}
          areaOpacity={0.15}
          areaBaselineValue={0}
          useMesh={true}
          tooltip={CustomTooltip}
          onClick={(point) => {
            const originalPoint = curve.points.find(p => p.time.startsWith(point.data.x as string));
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
              id: 'timing-gradient',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: theme.colors.gold, opacity: 0.3 },
                { offset: 50, color: theme.colors.accent, opacity: 0.2 },
                { offset: 100, color: theme.colors.accent, opacity: 0.05 }
              ]
            }
          ]}
          fill={[{ match: '*', id: 'timing-gradient' }]}
        />
      </div>

      {/* Narrative and Stats */}
      {showNarrative && (
        <div style={{ marginTop: '12px', padding: '0 8px' }}>
          {/* Trend and Average */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                backgroundColor: theme.colors.surface,
                color: theme.colors.gold,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              {TREND_ICONS[curve.trend]}
              {TREND_LABELS[curve.trend]?.en}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                backgroundColor: theme.colors.surface,
                color: getPointColor(curve.averageScore),
                border: `1px solid ${theme.colors.border}`
              }}
            >
              Avg: {Math.round(curve.averageScore)}
            </span>
          </div>

          {/* Narrative */}
          <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: 0, lineHeight: 1.5 }}>
            {curve.overallNarrative}
          </p>

          {/* Peak Window */}
          {curve.peakWindow && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                border: `1px solid rgba(34, 197, 94, 0.2)`
              }}
            >
              <div style={{ fontSize: '11px', color: theme.colors.excellent, fontWeight: 'bold' }}>
                ⭐ Peak Window
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.text, marginTop: '4px' }}>
                {curve.peakWindow.start.slice(0, 4)} → {curve.peakWindow.end.slice(0, 4)}
                <span style={{ color: theme.colors.gold, marginLeft: '8px' }}>
                  Score: {curve.peakWindow.score}
                </span>
              </div>
            </div>
          )}

          {/* Caution Periods */}
          {curve.cautionPeriods && curve.cautionPeriods.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {curve.cautionPeriods.slice(0, 2).map((period, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-block',
                    marginRight: '8px',
                    marginTop: '4px',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: theme.colors.caution
                  }}
                >
                  ⚠ {period.start.slice(0, 4)}-{period.end.slice(0, 4)}: {period.reason}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimingCurveChart;
