/**
 * OmniphonicPanel Component
 *
 * Complete visualization panel for the Luna Wing harmonic analysis.
 * Includes:
 * - Omniphonic Score display
 * - Harmonic Heatmap (50 chambers)
 * - Chamber detail panel
 * - Harmonic Narrative
 * - Metrics breakdown
 */

import React, { useState } from 'react';
import { HarmonicHeatmapCell, OmniphonicPanelProps, OmniphonicMetrics } from './types';
import HarmonicHeatmap from './HarmonicHeatmap';
import ChamberDetail from './ChamberDetail';
import { getStrengthLabel, getScoreColor, getFamilyIcon } from './heatmapUtils';

const OmniphonicPanel: React.FC<OmniphonicPanelProps> = ({
  heatmap,
  omniphonicScore,
  narrative,
  metrics,
  showNarrative = true,
  showMetrics = true
}) => {
  const [selectedCell, setSelectedCell] = useState<HarmonicHeatmapCell | null>(null);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'narrative' | 'metrics'>('heatmap');

  const strengthLabel = getStrengthLabel(omniphonicScore);
  const scoreColor = getScoreColor(omniphonicScore);
  const activeChambers = heatmap.filter(c => c.triggered).length;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(15, 15, 25, 0.95) 0%, rgba(20, 20, 35, 0.95) 100%)',
        borderRadius: '12px',
        padding: '24px',
        color: '#f5f5ff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
            🌙 Harmonic Analysis
          </h2>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>
            Luna Wing — 50 Chamber Resonance Field
          </p>
        </div>

        {/* Omniphonic Score */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>
            Omniphonic Score
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: scoreColor }}>
              {omniphonicScore.toFixed(1)}
            </span>
            <span style={{ fontSize: '14px', opacity: 0.5 }}>/ 100</span>
          </div>
          <div style={{ fontSize: '11px', color: scoreColor, fontWeight: 500 }}>
            {strengthLabel} · {activeChambers}/50 chambers
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px'
        }}
      >
        {['heatmap', 'narrative', 'metrics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab ? '#a78bfa' : 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab === 'heatmap' && '🗺️ '}
            {tab === 'narrative' && '📜 '}
            {tab === 'metrics' && '📊 '}
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'heatmap' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Heatmap */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', opacity: 0.8 }}>
              Chamber Grid
            </h3>
            <HarmonicHeatmap
              heatmap={heatmap}
              onCellClick={setSelectedCell}
              columns={10}
              size="medium"
            />
          </div>

          {/* Chamber Detail */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', opacity: 0.8 }}>
              Chamber Detail
            </h3>
            <ChamberDetail cell={selectedCell} />
          </div>
        </div>
      )}

      {activeTab === 'narrative' && showNarrative && (
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', opacity: 0.8 }}>
            Harmonic Narrative
          </h3>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '20px',
              fontSize: '13px',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              maxHeight: '500px',
              overflowY: 'auto'
            }}
          >
            {narrative}
          </div>
        </div>
      )}

      {activeTab === 'metrics' && showMetrics && metrics && (
        <MetricsPanel metrics={metrics} />
      )}
    </div>
  );
};

/**
 * Metrics Panel sub-component
 */
const MetricsPanel: React.FC<{ metrics: OmniphonicMetrics }> = ({ metrics }) => {
  return (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', opacity: 0.8 }}>
        Detailed Metrics
      </h3>

      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <MetricCard label="Active Chambers" value={`${metrics.activeChambers}/${metrics.totalChambers}`} />
        <MetricCard label="Activation Rate" value={`${metrics.activationRate}%`} />
        <MetricCard label="Total Boost" value={metrics.totalHarmonyBoost.toFixed(2)} />
        <MetricCard label="Total Bonus" value={metrics.totalBonus.toFixed(2)} />
      </div>

      {/* Family Scores */}
      <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', opacity: 0.7 }}>
        Family Breakdown
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}
      >
        {Object.entries(metrics.familyScores).map(([family, data]) => (
          <div
            key={family}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{getFamilyIcon(data.activationRate)}</span>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>{family}</span>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              {data.activationRate}% ({data.activeChambers}/{data.totalChambers})
            </div>
          </div>
        ))}
      </div>

      {/* Interpretation */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(167, 139, 250, 0.1)',
          borderRadius: '8px',
          borderLeft: '3px solid #a78bfa'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px', opacity: 0.7 }}>
          Interpretation
        </div>
        <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
          {metrics.interpretation}
        </div>
      </div>
    </div>
  );
};

/**
 * Metric Card sub-component
 */
const MetricCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center'
    }}
  >
    <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>
      {label}
    </div>
    <div style={{ fontSize: '18px', fontWeight: 600, color: '#a78bfa' }}>
      {value}
    </div>
  </div>
);

export default OmniphonicPanel;
