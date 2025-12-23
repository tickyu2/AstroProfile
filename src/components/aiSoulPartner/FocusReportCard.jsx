/**
 * Focus Report Card Component
 *
 * A glassmorphic "debrief" card that displays Focus Mode session results.
 * Designed to look distinct from normal chat messages - more like a
 * professional achievement card.
 *
 * Features:
 * - Glassmorphic blur effect
 * - Double-thin neon border
 * - Target/Shield icon (not Luna's avatar)
 * - "Save to Vault" / "Share" interactions
 *
 * Part of GENESIS Phase 4 - Advanced Voice Features
 * December 19, 2024
 */

import React, { useState, useMemo } from 'react';
import { REPORT_STATUS, REPORT_TYPES } from '../../services/focusReportService';
import { FOCUS_VISUALS } from '../../services/focusModeService';

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  // Main card container - glassmorphic
  card: {
    position: 'relative',
    padding: '20px',
    borderRadius: '16px',
    background: 'rgba(26, 26, 26, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '2px solid',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    maxWidth: '480px',
    margin: '16px auto'
  },

  // Header with icon and title
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },

  // Icon container
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    background: 'rgba(138, 43, 226, 0.2)',
    border: '1px solid rgba(138, 43, 226, 0.4)'
  },

  // Title and duration
  titleArea: {
    flex: 1
  },

  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    margin: 0
  },

  subtitle: {
    fontSize: '12px',
    color: '#888',
    margin: '4px 0 0 0'
  },

  // Accomplishment section
  accomplishment: {
    marginBottom: '16px'
  },

  accomplishmentTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '8px'
  },

  accomplishmentSummary: {
    fontSize: '14px',
    color: '#aaa',
    lineHeight: 1.5
  },

  // Topics pills
  topicsList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px'
  },

  topicPill: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    color: '#9370DB',
    border: '1px solid rgba(138, 43, 226, 0.3)'
  },

  // Logic Map section
  logicMap: {
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  logicMapTitle: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px'
  },

  logicStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px'
  },

  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    flexShrink: 0
  },

  stepContent: {
    fontSize: '13px',
    color: '#ccc',
    lineHeight: 1.4
  },

  // Energy Delta
  energyDelta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: '16px'
  },

  energyLabel: {
    fontSize: '12px',
    color: '#888'
  },

  energyValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  energyBar: {
    width: '80px',
    height: '6px',
    backgroundColor: '#333',
    borderRadius: '3px',
    overflow: 'hidden'
  },

  energyFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease'
  },

  energyText: {
    fontSize: '12px',
    fontWeight: 600
  },

  // Stats row
  statsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '16px'
  },

  stat: {
    textAlign: 'center'
  },

  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff'
  },

  statLabel: {
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  // Actions
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },

  actionButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },

  primaryButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    border: '1px solid rgba(138, 43, 226, 0.5)',
    color: '#fff'
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    border: '1px solid #444',
    color: '#888'
  },

  // Next steps
  nextSteps: {
    marginBottom: '16px'
  },

  nextStepsTitle: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px'
  },

  nextStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    fontSize: '13px',
    color: '#ccc'
  },

  nextStepIcon: {
    fontSize: '14px'
  },

  // Efficiency badge
  efficiencyBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const getEfficiencyStyle = (efficiency) => {
  const colors = {
    excellent: { bg: 'rgba(0, 255, 0, 0.2)', color: '#00FF00', border: 'rgba(0, 255, 0, 0.4)' },
    optimal: { bg: 'rgba(0, 255, 0, 0.2)', color: '#00FF00', border: 'rgba(0, 255, 0, 0.4)' },
    good: { bg: 'rgba(124, 252, 0, 0.2)', color: '#7CFC00', border: 'rgba(124, 252, 0, 0.4)' },
    moderate: { bg: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: 'rgba(255, 215, 0, 0.4)' },
    intensive: { bg: 'rgba(255, 165, 0, 0.2)', color: '#FFA500', border: 'rgba(255, 165, 0, 0.4)' }
  };
  return colors[efficiency] || colors.moderate;
};

const getEnergyColor = (level) => {
  if (level >= 60) return '#00FF00';
  if (level >= 40) return '#FFD700';
  if (level >= 20) return '#FFA500';
  return '#FF4500';
};

const getModeColor = (mode) => {
  return FOCUS_VISUALS[mode]?.color || '#8A2BE2';
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function FocusReportCard({
  report,
  onSave,
  onShare,
  onDismiss,
  showActions = true,
  compact = false,
  className = ''
}) {
  const [isSaved, setIsSaved] = useState(report?.status === REPORT_STATUS.SAVED);

  const modeColor = useMemo(() =>
    getModeColor(report?.focusMode),
    [report?.focusMode]
  );

  const efficiencyStyle = useMemo(() =>
    getEfficiencyStyle(report?.energyDelta?.efficiency),
    [report?.energyDelta?.efficiency]
  );

  if (!report) return null;

  const handleSave = async () => {
    if (onSave) {
      await onSave(report);
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(report);
    }
  };

  // Compact view
  if (compact) {
    return (
      <div
        className={className}
        style={{
          ...styles.card,
          padding: '12px 16px',
          borderColor: modeColor,
          boxShadow: `0 0 20px ${modeColor}40`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🎯</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#fff' }}>
              {report.accomplishment?.title}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {report.duration} | -{report.energyDelta?.consumed} energy
            </div>
          </div>
          {showActions && (
            <button
              onClick={handleSave}
              style={{
                ...styles.actionButton,
                ...styles.secondaryButton,
                padding: '6px 12px'
              }}
              disabled={isSaved}
            >
              {isSaved ? '✓' : '💾'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div
      className={className}
      style={{
        ...styles.card,
        borderColor: modeColor,
        boxShadow: `0 0 30px ${modeColor}30, inset 0 0 60px rgba(0,0,0,0.3)`
      }}
    >
      {/* Efficiency Badge */}
      {report.energyDelta?.efficiency && (
        <div
          style={{
            ...styles.efficiencyBadge,
            backgroundColor: efficiencyStyle.bg,
            color: efficiencyStyle.color,
            border: `1px solid ${efficiencyStyle.border}`
          }}
        >
          {report.energyDelta.efficiency}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.iconContainer, borderColor: modeColor }}>
          🎯
        </div>
        <div style={styles.titleArea}>
          <h3 style={styles.title}>Focus Report</h3>
          <p style={styles.subtitle}>
            {report.duration} session | {report.focusMode?.toUpperCase()} mode
          </p>
        </div>
      </div>

      {/* Accomplishment */}
      <div style={styles.accomplishment}>
        <div style={styles.accomplishmentTitle}>
          {report.accomplishment?.title}
        </div>
        {report.accomplishment?.summary && (
          <div style={styles.accomplishmentSummary}>
            {report.accomplishment.summary}
          </div>
        )}
        {report.accomplishment?.topics?.length > 0 && (
          <div style={styles.topicsList}>
            {report.accomplishment.topics.map((topic, i) => (
              <span key={i} style={styles.topicPill}>{topic}</span>
            ))}
          </div>
        )}
      </div>

      {/* Logic Map */}
      {report.logicMap?.steps?.length > 0 && (
        <div style={styles.logicMap}>
          <div style={styles.logicMapTitle}>Reasoning Path</div>
          {report.logicMap.steps.map((step, i) => (
            <div key={i} style={styles.logicStep}>
              <div
                style={{
                  ...styles.stepNumber,
                  backgroundColor: `${modeColor}30`,
                  color: modeColor,
                  border: `1px solid ${modeColor}50`
                }}
              >
                {step.step}
              </div>
              <div style={styles.stepContent}>{step.summary}</div>
            </div>
          ))}
        </div>
      )}

      {/* Energy Delta */}
      <div style={styles.energyDelta}>
        <span style={styles.energyLabel}>Energy Consumed</span>
        <div style={styles.energyValue}>
          <div style={styles.energyBar}>
            <div
              style={{
                ...styles.energyFill,
                width: `${Math.min(100, (report.energyDelta?.consumed || 0) * 2)}%`,
                backgroundColor: getEnergyColor(report.energyDelta?.end || 50)
              }}
            />
          </div>
          <span
            style={{
              ...styles.energyText,
              color: getEnergyColor(report.energyDelta?.end || 50)
            }}
          >
            -{report.energyDelta?.consumed || 0}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statValue}>{report.stats?.messagesExchanged || 0}</div>
          <div style={styles.statLabel}>Messages</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statValue}>{report.stats?.thoughtsProcessed || 0}</div>
          <div style={styles.statLabel}>Thoughts</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statValue}>{report.stats?.decisionsLogged || 0}</div>
          <div style={styles.statLabel}>Decisions</div>
        </div>
      </div>

      {/* Next Steps */}
      {report.nextSteps?.length > 0 && (
        <div style={styles.nextSteps}>
          <div style={styles.nextStepsTitle}>Suggested Next</div>
          {report.nextSteps.map((step, i) => (
            <div key={i} style={styles.nextStep}>
              <span style={styles.nextStepIcon}>→</span>
              <span><strong>{step.action}:</strong> {step.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div style={styles.actions}>
          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{ ...styles.actionButton, ...styles.secondaryButton }}
            >
              Dismiss
            </button>
          )}
          {onShare && (
            <button
              onClick={handleShare}
              style={{ ...styles.actionButton, ...styles.secondaryButton }}
            >
              <span>📤</span> Share
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaved}
            style={{
              ...styles.actionButton,
              ...styles.primaryButton,
              opacity: isSaved ? 0.6 : 1
            }}
          >
            <span>{isSaved ? '✓' : '💾'}</span>
            {isSaved ? 'Saved' : 'Save to Vault'}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL VERSION
// ═══════════════════════════════════════════════════════════════════════════

export function FocusReportModal({
  report,
  isOpen,
  onClose,
  onSave,
  onShare
}) {
  if (!isOpen || !report) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()}>
        <FocusReportCard
          report={report}
          onSave={onSave}
          onShare={onShare}
          onDismiss={onClose}
          showActions={true}
        />
      </div>
    </div>
  );
}

export default FocusReportCard;
