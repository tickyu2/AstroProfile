/**
 * YinYangPairPanel - Pairwise Yin/Yang Compatibility Visualization
 *
 * Displays Yin/Yang compatibility between two charts with:
 * - Side-by-side polarity gauges
 * - Combined rootedness comparison
 * - Dynamic classification badge
 * - Narrative sections
 *
 * Uses the baziYinYangPair.ts utility for calculations.
 */

import React, { useMemo } from 'react';
import { useBaziTheme } from '../theme/BaziTheme';
import {
  computeYinYangPairCompatibility,
  DYNAMIC_NARRATIVES
} from '../../../utils/baziYinYangPair';

// ============================================================================
// DYNAMIC COLOR MAPPINGS
// ============================================================================

const DYNAMIC_COLORS = {
  perfect_complement: '#34d399',    // Emerald
  strong_complement: '#22c55e',     // Green
  resonant_yang: '#fbbf24',         // Amber
  resonant_yin: '#60a5fa',          // Blue
  balanced_versatile: '#a78bfa',    // Purple
  creative_tension: '#f97316',      // Orange
  gentle_harmony: '#93c5fd'         // Light blue
};

const DYNAMIC_ICONS = {
  perfect_complement: '★',
  strong_complement: '◉',
  resonant_yang: '☀',
  resonant_yin: '☾',
  balanced_versatile: '⚖',
  creative_tension: '⚡',
  gentle_harmony: '~'
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const YinYangPairPanel = ({
  pillarsA,
  pillarsB,
  labelA = 'Person A',
  labelB = 'Person B',
  showNarrative = true,
  showBreakdown = true,
  compact = false
}) => {
  const theme = useBaziTheme();

  // Compute compatibility
  const result = useMemo(() => {
    if (!pillarsA || !pillarsB) return null;
    return computeYinYangPairCompatibility(pillarsA, pillarsB, labelA, labelB);
  }, [pillarsA, pillarsB, labelA, labelB]);

  if (!result) {
    return (
      <div style={styles.emptyState(theme)}>
        <p>Select two charts to compare Yin/Yang compatibility</p>
      </div>
    );
  }

  const {
    profileA,
    profileB,
    rootednessA,
    rootednessB,
    polarityCompatibility,
    rootednessCompatibility,
    combinedScore,
    dynamic,
    breakdown
  } = result;

  const narrative = DYNAMIC_NARRATIVES[dynamic];
  const dynamicColor = DYNAMIC_COLORS[dynamic];
  const dynamicIcon = DYNAMIC_ICONS[dynamic];

  return (
    <div style={styles.container(theme, compact)}>
      {/* Header */}
      <div style={styles.header(theme)}>
        <h3 style={styles.title(theme, compact)}>Yin/Yang Compatibility</h3>
        <div style={styles.dynamicBadge(dynamicColor)}>
          <span style={styles.dynamicIcon}>{dynamicIcon}</span>
          {narrative.title}
        </div>
      </div>

      {/* Metaphor */}
      <div style={styles.metaphor(theme, compact)}>
        {narrative.metaphor}
      </div>

      {/* Combined Score */}
      <div style={styles.scoreSection(theme)}>
        <div style={styles.scoreCircle(theme, combinedScore)}>
          <span style={styles.scoreValue}>{(combinedScore * 100).toFixed(0)}%</span>
          <span style={styles.scoreLabel}>Overall</span>
        </div>
      </div>

      {/* Side by Side Polarity Gauges */}
      <div style={styles.polarityRow(compact)}>
        <PolarityMiniGauge
          profile={profileA}
          label={labelA}
          theme={theme}
          compact={compact}
        />
        <div style={styles.vsIndicator(theme)}>vs</div>
        <PolarityMiniGauge
          profile={profileB}
          label={labelB}
          theme={theme}
          compact={compact}
        />
      </div>

      {/* Rootedness Comparison */}
      <div style={styles.rootednessRow(theme, compact)}>
        <RootednessBar
          score={rootednessA.overallRootedness}
          label={labelA}
          theme={theme}
          compact={compact}
        />
        <RootednessBar
          score={rootednessB.overallRootedness}
          label={labelB}
          theme={theme}
          compact={compact}
        />
      </div>

      {/* Breakdown Scores */}
      {showBreakdown && (
        <div style={styles.breakdownSection(theme)}>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel(theme)}>Polarity Match:</span>
            <span style={styles.breakdownValue(theme)}>{breakdown.polarityLabel}</span>
          </div>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel(theme)}>DM Attraction:</span>
            <span style={{
              ...styles.breakdownValue(theme),
              color: breakdown.dmPolarityMatch ? '#34d399' : '#fbbf24'
            }}>
              {breakdown.dmPolarityMatch ? 'Yes (opposite polarities)' : 'No (same polarity)'}
            </span>
          </div>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel(theme)}>Rootedness:</span>
            <span style={styles.breakdownValue(theme)}>{breakdown.rootednessLabel}</span>
          </div>
        </div>
      )}

      {/* Narrative Sections */}
      {showNarrative && !compact && (
        <div style={styles.narrativeSection(theme)}>
          <NarrativeBlock
            icon="+"
            title="Your Strength"
            content={narrative.strength}
            color="#34d399"
            theme={theme}
          />
          <NarrativeBlock
            icon="!"
            title="Your Challenge"
            content={narrative.challenge}
            color="#f97316"
            theme={theme}
          />
          <NarrativeBlock
            icon="♡"
            title="Practice"
            content={narrative.practice}
            color="#a78bfa"
            theme={theme}
          />
        </div>
      )}

      {/* Sub-scores */}
      <div style={styles.subScores(theme, compact)}>
        <div style={styles.subScore}>
          <span style={styles.subScoreLabel(theme)}>Polarity</span>
          <span style={styles.subScoreValue(theme)}>
            {(polarityCompatibility * 100).toFixed(0)}%
          </span>
        </div>
        <div style={styles.subScore}>
          <span style={styles.subScoreLabel(theme)}>Rootedness</span>
          <span style={styles.subScoreValue(theme)}>
            {(rootednessCompatibility * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const PolarityMiniGauge = ({ profile, label, theme, compact }) => {
  const yinPct = (profile.weightedYin * 100).toFixed(0);
  const yangPct = (profile.weightedYang * 100).toFixed(0);

  return (
    <div style={styles.miniGauge(theme, compact)}>
      <div style={styles.miniGaugeLabel(theme, compact)}>{label}</div>
      <div style={styles.miniGaugeBar(theme)}>
        <div style={{
          ...styles.miniGaugeYin,
          width: `${yinPct}%`
        }} />
        <div style={{
          ...styles.miniGaugeYang,
          width: `${yangPct}%`
        }} />
      </div>
      <div style={styles.miniGaugePcts(theme, compact)}>
        <span style={{ color: '#60a5fa' }}>{yinPct}% Yin</span>
        <span style={{ color: '#fbbf24' }}>{yangPct}% Yang</span>
      </div>
      <div style={styles.dmPolarityBadge(theme, profile.dmPolarity)}>
        {profile.dmPolarity === 'yang' ? '☀ Yang DM' : '☾ Yin DM'}
      </div>
    </div>
  );
};

const RootednessBar = ({ score, label, theme, compact }) => {
  const pct = (score * 100).toFixed(0);
  const getColor = (level) => {
    if (level >= 0.75) return '#34d399';
    if (level >= 0.55) return '#22c55e';
    if (level >= 0.35) return '#fbbf24';
    if (level >= 0.15) return '#f97316';
    return '#ef4444';
  };

  return (
    <div style={styles.rootednessBarContainer(compact)}>
      <div style={styles.rootednessBarLabel(theme, compact)}>
        {label}: {pct}%
      </div>
      <div style={styles.rootednessBarTrack(theme)}>
        <div style={{
          ...styles.rootednessBarFill,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${getColor(score)}80, ${getColor(score)})`
        }} />
      </div>
    </div>
  );
};

const NarrativeBlock = ({ icon, title, content, color, theme }) => (
  <div style={styles.narrativeBlock(theme)}>
    <div style={styles.narrativeHeader}>
      <span style={{ ...styles.narrativeIcon, color }}>{icon}</span>
      <span style={styles.narrativeTitle(theme)}>{title}</span>
    </div>
    <p style={styles.narrativeContent(theme)}>{content}</p>
  </div>
);

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: (theme, compact) => ({
    background: theme.colors?.cardLight || '#1a1a2e',
    borderRadius: theme.radius?.lg || 12,
    padding: compact ? 12 : 20,
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? 12 : 18
  }),

  emptyState: (theme) => ({
    background: theme.colors?.cardLight || '#1a1a2e',
    borderRadius: theme.radius?.lg || 12,
    padding: 20,
    textAlign: 'center',
    color: theme.colors?.muted || '#888'
  }),

  header: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  }),

  title: (theme, compact) => ({
    fontSize: compact ? '0.9rem' : '1.1rem',
    fontWeight: 600,
    color: theme.colors?.text || '#e0e0e0',
    margin: 0
  }),

  dynamicBadge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 16,
    background: `${color}20`,
    color: color,
    fontWeight: 600,
    fontSize: '0.75rem'
  }),

  dynamicIcon: {
    fontSize: '0.9rem'
  },

  metaphor: (theme, compact) => ({
    fontSize: compact ? '0.75rem' : '0.85rem',
    fontStyle: 'italic',
    color: theme.colors?.textSecondary || '#999',
    lineHeight: 1.5
  }),

  scoreSection: (theme) => ({
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0'
  }),

  scoreCircle: (theme, score) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: `conic-gradient(
      ${score >= 0.7 ? '#34d399' : score >= 0.5 ? '#fbbf24' : '#f97316'} ${score * 360}deg,
      ${theme.colors?.card || '#0d0d1a'} 0deg
    )`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }),

  scoreValue: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff'
  },

  scoreLabel: {
    fontSize: '0.6rem',
    color: '#aaa',
    textTransform: 'uppercase'
  },

  polarityRow: (compact) => ({
    display: 'grid',
    gridTemplateColumns: compact ? '1fr auto 1fr' : '1fr auto 1fr',
    gap: compact ? 8 : 16,
    alignItems: 'center'
  }),

  vsIndicator: (theme) => ({
    fontSize: '0.7rem',
    color: theme.colors?.muted || '#666',
    fontWeight: 600
  }),

  miniGauge: (theme, compact) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }),

  miniGaugeLabel: (theme, compact) => ({
    fontSize: compact ? '0.65rem' : '0.75rem',
    fontWeight: 600,
    color: theme.colors?.text || '#e0e0e0',
    textAlign: 'center'
  }),

  miniGaugeBar: (theme) => ({
    height: 8,
    background: theme.colors?.card || '#0d0d1a',
    borderRadius: 4,
    overflow: 'hidden',
    display: 'flex'
  }),

  miniGaugeYin: {
    height: '100%',
    background: 'linear-gradient(90deg, #60a5fa80, #60a5fa)',
    transition: 'width 0.5s ease'
  },

  miniGaugeYang: {
    height: '100%',
    background: 'linear-gradient(90deg, #fbbf24, #fbbf2480)',
    transition: 'width 0.5s ease'
  },

  miniGaugePcts: (theme, compact) => ({
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: compact ? '0.55rem' : '0.65rem',
    fontWeight: 500
  }),

  dmPolarityBadge: (theme, polarity) => ({
    textAlign: 'center',
    fontSize: '0.6rem',
    padding: '2px 6px',
    borderRadius: 4,
    background: polarity === 'yang' ? '#fbbf2420' : '#60a5fa20',
    color: polarity === 'yang' ? '#fbbf24' : '#60a5fa',
    marginTop: 4
  }),

  rootednessRow: (theme, compact) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: compact ? 8 : 16
  }),

  rootednessBarContainer: (compact) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }),

  rootednessBarLabel: (theme, compact) => ({
    fontSize: compact ? '0.6rem' : '0.7rem',
    color: theme.colors?.text || '#e0e0e0',
    fontWeight: 500
  }),

  rootednessBarTrack: (theme) => ({
    height: 6,
    background: theme.colors?.card || '#0d0d1a',
    borderRadius: 3,
    overflow: 'hidden'
  }),

  rootednessBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.5s ease'
  },

  breakdownSection: (theme) => ({
    background: theme.colors?.card || '#0d0d1a',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }),

  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4
  },

  breakdownLabel: (theme) => ({
    fontSize: '0.7rem',
    color: theme.colors?.muted || '#888'
  }),

  breakdownValue: (theme) => ({
    fontSize: '0.7rem',
    fontWeight: 500,
    color: theme.colors?.text || '#e0e0e0'
  }),

  narrativeSection: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }),

  narrativeBlock: (theme) => ({
    background: theme.colors?.card || '#0d0d1a',
    borderRadius: 8,
    padding: 12
  }),

  narrativeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },

  narrativeIcon: {
    fontSize: '1rem',
    fontWeight: 600
  },

  narrativeTitle: (theme) => ({
    fontSize: '0.8rem',
    fontWeight: 600,
    color: theme.colors?.text || '#e0e0e0'
  }),

  narrativeContent: (theme) => ({
    fontSize: '0.75rem',
    color: theme.colors?.textSecondary || '#999',
    lineHeight: 1.5,
    margin: 0
  }),

  subScores: (theme, compact) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: compact ? 16 : 32,
    paddingTop: 8,
    borderTop: `1px solid ${theme.colors?.border || '#333'}`
  }),

  subScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2
  },

  subScoreLabel: (theme) => ({
    fontSize: '0.6rem',
    color: theme.colors?.muted || '#888',
    textTransform: 'uppercase'
  }),

  subScoreValue: (theme) => ({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: theme.colors?.text || '#e0e0e0'
  })
};

export default YinYangPairPanel;
