/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CLUSTER INSPECTOR COMPONENT
 * Luna Management Console - User Cluster Visualization and Override
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Display current cluster assignment with confidence score
 * - Show criteria scores for all clusters
 * - Allow manual cluster override
 * - Real-time cluster behavior preview
 *
 * Created: December 21, 2025
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CLUSTER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const CLUSTERS = {
  FAST_TALKER: 'fast_talker',
  SLOW_THINKER: 'slow_thinker',
  EMOTIONAL: 'emotional',
  ANALYTICAL: 'analytical',
  STORYTELLER: 'storyteller',
  MINIMALIST: 'minimalist'
};

const CLUSTER_LABELS = {
  [CLUSTERS.FAST_TALKER]: { label: 'Fast Talker', color: '#ff6b6b', icon: '⚡' },
  [CLUSTERS.SLOW_THINKER]: { label: 'Slow Thinker', color: '#4ecdc4', icon: '🧘' },
  [CLUSTERS.EMOTIONAL]: { label: 'Emotional', color: '#f093fb', icon: '💜' },
  [CLUSTERS.ANALYTICAL]: { label: 'Analytical', color: '#667eea', icon: '🔬' },
  [CLUSTERS.STORYTELLER]: { label: 'Storyteller', color: '#f5a623', icon: '📖' },
  [CLUSTERS.MINIMALIST]: { label: 'Minimalist', color: '#95a5a6', icon: '🎯' }
};

const CLUSTER_DESCRIPTIONS = {
  [CLUSTERS.FAST_TALKER]: 'Quick responses, shorter pauses, comfortable with interruptions',
  [CLUSTERS.SLOW_THINKER]: 'Prefers thoughtful pauses, dislikes interruptions, reflective',
  [CLUSTERS.EMOTIONAL]: 'High emotional expression, values empathy and backchannels',
  [CLUSTERS.ANALYTICAL]: 'Data-focused, prefers facts over feelings, minimal backchannels',
  [CLUSTERS.STORYTELLER]: 'Long-form speaker, appreciates uninterrupted narrative flow',
  [CLUSTERS.MINIMALIST]: 'Brief, to-the-point, values concise responses'
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  currentCluster: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  clusterIcon: {
    fontSize: '32px'
  },
  clusterInfo: {
    flex: 1
  },
  clusterName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  clusterDesc: {
    fontSize: '13px',
    opacity: 0.7
  },
  confidence: {
    textAlign: 'right'
  },
  confidenceLabel: {
    fontSize: '11px',
    opacity: 0.6,
    marginBottom: '2px'
  },
  confidenceValue: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  overrideBadge: {
    display: 'inline-block',
    padding: '3px 8px',
    background: 'rgba(255,200,100,0.2)',
    border: '1px solid rgba(255,200,100,0.4)',
    borderRadius: '4px',
    fontSize: '10px',
    color: '#ffc864',
    marginLeft: '10px',
    textTransform: 'uppercase'
  },
  scoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px'
  },
  scoreCard: {
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  scoreCardActive: {
    border: '2px solid',
    transform: 'scale(1.02)'
  },
  scoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  scoreName: {
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  scoreValue: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  scoreBar: {
    height: '4px',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden'
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  dangerButton: {
    background: 'rgba(255,100,100,0.2)',
    color: '#ff6b6b',
    border: '1px solid rgba(255,100,100,0.3)'
  },
  behaviorPreview: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  previewTitle: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    opacity: 0.8
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  previewItem: {
    textAlign: 'center'
  },
  previewLabel: {
    fontSize: '10px',
    opacity: 0.5,
    marginBottom: '4px'
  },
  previewValue: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    opacity: 0.5
  },
  error: {
    background: 'rgba(255,100,100,0.1)',
    border: '1px solid rgba(255,100,100,0.3)',
    borderRadius: '8px',
    padding: '12px',
    color: '#ff6b6b',
    fontSize: '13px'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ClusterInspector({
  userId,
  consoleBaseUrl = 'http://localhost:8091',
  onClusterChange
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classification, setClassification] = useState(null);
  const [clusterBehavior, setClusterBehavior] = useState(null);
  const [allScores, setAllScores] = useState(null);
  const [selectedOverride, setSelectedOverride] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA LOADING
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (userId) {
      loadClusterData();
    }
  }, [userId]);

  async function loadClusterData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${consoleBaseUrl}/console/clusters/${userId}`);
      const data = await response.json();

      if (data.success) {
        setClassification(data.data.classification);
        setClusterBehavior(data.data.behavior);
        setAllScores(data.data.classification.scores);
      } else {
        setError(data.error || 'Failed to load cluster data');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to console server');
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // OVERRIDE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  async function handleOverrideCluster(clusterId) {
    setSelectedOverride(clusterId);

    try {
      const response = await fetch(`${consoleBaseUrl}/console/clusters/${userId}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clusterId })
      });

      const data = await response.json();

      if (data.success) {
        await loadClusterData();
        onClusterChange?.(clusterId);
      } else {
        setError(data.error || 'Failed to set override');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSelectedOverride(null);
    }
  }

  async function handleClearOverride() {
    try {
      const response = await fetch(`${consoleBaseUrl}/console/clusters/${userId}/override`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await loadClusterData();
        onClusterChange?.(data.data.autoClassified);
      } else {
        setError(data.error || 'Failed to clear override');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading cluster data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  if (!classification) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>No cluster data available</div>
      </div>
    );
  }

  const currentCluster = classification.cluster;
  const clusterMeta = CLUSTER_LABELS[currentCluster] || {
    label: currentCluster,
    color: '#667eea',
    icon: '❓'
  };
  const isOverridden = classification.isOverride;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🎯</span> Interaction Cluster
        </div>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={loadClusterData}
        >
          Refresh
        </button>
      </div>

      {/* Current Cluster */}
      <div
        style={{
          ...styles.currentCluster,
          background: `${clusterMeta.color}22`,
          border: `2px solid ${clusterMeta.color}`
        }}
      >
        <div style={styles.clusterIcon}>{clusterMeta.icon}</div>
        <div style={styles.clusterInfo}>
          <div style={{ ...styles.clusterName, color: clusterMeta.color }}>
            {clusterMeta.label}
            {isOverridden && <span style={styles.overrideBadge}>Override</span>}
          </div>
          <div style={styles.clusterDesc}>
            {CLUSTER_DESCRIPTIONS[currentCluster] || 'Unknown cluster type'}
          </div>
        </div>
        <div style={styles.confidence}>
          <div style={styles.confidenceLabel}>Confidence</div>
          <div style={{ ...styles.confidenceValue, color: clusterMeta.color }}>
            {Math.round(classification.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* All Cluster Scores */}
      {allScores && (
        <div style={styles.scoresGrid}>
          {Object.entries(allScores).map(([clusterId, score]) => {
            const meta = CLUSTER_LABELS[clusterId] || { label: clusterId, color: '#888', icon: '?' };
            const isActive = clusterId === currentCluster;
            const scorePercent = Math.max(0, Math.min(100, score * 100));

            return (
              <div
                key={clusterId}
                style={{
                  ...styles.scoreCard,
                  ...(isActive ? {
                    ...styles.scoreCardActive,
                    borderColor: meta.color
                  } : {})
                }}
                onClick={() => handleOverrideCluster(clusterId)}
                title={`Click to set as override`}
              >
                <div style={styles.scoreHeader}>
                  <div style={styles.scoreName}>
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </div>
                  <div style={{ ...styles.scoreValue, color: meta.color }}>
                    {scorePercent.toFixed(0)}%
                  </div>
                </div>
                <div style={styles.scoreBar}>
                  <div
                    style={{
                      ...styles.scoreBarFill,
                      width: `${scorePercent}%`,
                      background: meta.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {isOverridden && (
        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.dangerButton }}
            onClick={handleClearOverride}
          >
            Clear Override
          </button>
          <span style={{ fontSize: '12px', opacity: 0.5, marginLeft: '10px' }}>
            Override set at: {classification.overrideAt || 'Unknown'}
          </span>
        </div>
      )}

      {/* Behavior Preview */}
      {clusterBehavior && (
        <div style={styles.behaviorPreview}>
          <div style={styles.previewTitle}>Cluster Behavior Modifiers</div>
          <div style={styles.previewGrid}>
            <div style={styles.previewItem}>
              <div style={styles.previewLabel}>Backchannel</div>
              <div style={styles.previewValue}>
                {((clusterBehavior.backchannelFrequency || 0) * 100).toFixed(0)}%
              </div>
            </div>
            <div style={styles.previewItem}>
              <div style={styles.previewLabel}>Response Length</div>
              <div style={styles.previewValue}>
                {clusterBehavior.maxResponseTokens || 'Default'}
              </div>
            </div>
            <div style={styles.previewItem}>
              <div style={styles.previewLabel}>Advice Bias</div>
              <div style={styles.previewValue}>
                {((clusterBehavior.adviceBias || 0.5) * 100).toFixed(0)}%
              </div>
            </div>
            <div style={styles.previewItem}>
              <div style={styles.previewLabel}>Style</div>
              <div style={styles.previewValue}>
                {clusterBehavior.style || 'balanced'}
              </div>
            </div>
            <div style={styles.previewItem}>
              <div style={styles.previewLabel}>TTS Speed</div>
              <div style={styles.previewValue}>
                {clusterBehavior.ttsHints?.speakingRate || '1.0'}x
              </div>
            </div>
            <div style={styles.previewItem}>
              <div style={styles.previewLabel}>Warmth</div>
              <div style={styles.previewValue}>
                {((clusterBehavior.warmth || 0.5) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
