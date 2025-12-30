/**
 * Multi-Speaker Transcript Panel
 * ===============================
 * Displays diarized transcripts with speaker identification and color coding.
 * Designed for group sessions: family biography, therapy, facilitation.
 *
 * Features:
 * - Color-coded speaker identification
 * - Timeline view with speaker segments
 * - Speaker statistics (speaking time, word count)
 * - Speaker label editing
 * - Unified or split view options
 *
 * Part of GENESIS OS - Speaker Diarization Enhancement
 * Created: December 27, 2024
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SPEAKER_COLORS, SESSION_TEMPLATES } from '../../services/speakerProfileService';

/**
 * Format timestamp for display
 */
function formatTimestamp(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * Format duration for stats
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

/**
 * Speaker Badge Component
 */
function SpeakerBadge({ speaker, isActive = false, onClick }) {
  const color = SPEAKER_COLORS[speaker.colorKey] || SPEAKER_COLORS.unknown;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        backgroundColor: isActive ? `${color.primary}30` : `${color.primary}15`,
        border: `2px solid ${isActive ? color.primary : `${color.primary}40`}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s'
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: color.primary,
          animation: isActive ? 'pulse 1.5s infinite' : 'none'
        }}
      />
      <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '500' }}>
        {speaker.label}
      </span>
      {speaker.profileId && (
        <span style={{ fontSize: '10px', color: '#64748b' }}>🔗</span>
      )}
    </div>
  );
}

/**
 * Speaker Stats Component
 */
function SpeakerStats({ stats, speakers }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div style={styles.statsContainer}>
      <div style={styles.statsHeader}>
        <span style={styles.statsIcon}>📊</span>
        <span style={styles.statsTitle}>Speaking Time</span>
      </div>
      <div style={styles.statsGrid}>
        {stats.map(stat => {
          const speaker = speakers.find(s => s.id === stat.speakerId);
          const color = SPEAKER_COLORS[speaker?.colorKey] || SPEAKER_COLORS.unknown;

          return (
            <div key={stat.speakerId} style={styles.statItem}>
              <div style={styles.statBar}>
                <div
                  style={{
                    ...styles.statBarFill,
                    width: `${stat.percentageOfTime}%`,
                    backgroundColor: color.primary
                  }}
                />
              </div>
              <div style={styles.statInfo}>
                <span style={{ color: color.primary, fontWeight: '500' }}>
                  {stat.label}
                </span>
                <span style={styles.statValue}>
                  {stat.percentageOfTime}% ({formatDuration(stat.totalDuration)})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Timeline Segment Component
 */
function TimelineSegment({ segment, speaker, onSpeakerClick }) {
  const color = SPEAKER_COLORS[speaker?.colorKey] || SPEAKER_COLORS.unknown;

  return (
    <div style={styles.segment}>
      {/* Timeline indicator */}
      <div style={styles.segmentTimeline}>
        <span style={styles.segmentTime}>{formatTimestamp(segment.startTime)}</span>
        <div
          style={{
            ...styles.segmentDot,
            backgroundColor: color.primary
          }}
        />
        <div
          style={{
            ...styles.segmentLine,
            backgroundColor: `${color.primary}40`
          }}
        />
      </div>

      {/* Segment content */}
      <div style={styles.segmentContent}>
        {/* Speaker label */}
        <div
          style={{
            ...styles.segmentSpeaker,
            color: color.primary
          }}
          onClick={() => onSpeakerClick?.(speaker)}
        >
          {speaker?.label || segment.speakerLabel}
        </div>

        {/* Transcript text */}
        <div
          style={{
            ...styles.segmentText,
            borderLeftColor: color.primary
          }}
        >
          {segment.text}
        </div>

        {/* Duration */}
        <div style={styles.segmentDuration}>
          {formatDuration(segment.duration)}
        </div>
      </div>
    </div>
  );
}

/**
 * Speaker Editor Modal
 */
function SpeakerEditor({ speaker, onSave, onClose }) {
  const [label, setLabel] = useState(speaker?.label || '');
  const [role, setRole] = useState(speaker?.role || '');

  if (!speaker) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span>Edit Speaker</span>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Name / Label</label>
            <input
              style={styles.formInput}
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g., Mom, Dr. Smith"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Role</label>
            <input
              style={styles.formInput}
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g., Parent, Therapist"
            />
          </div>

          <div style={styles.colorPreview}>
            <span style={styles.formLabel}>Color</span>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: (SPEAKER_COLORS[speaker.colorKey] || SPEAKER_COLORS.unknown).primary
              }}
            />
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button
            style={styles.saveButton}
            onClick={() => onSave({ label, role })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Multi-Speaker Transcript Panel
 */
export default function MultiSpeakerTranscriptPanel({
  isOpen,
  onClose,
  session,           // DiarizationSession
  segments = [],     // Diarized segments
  stats = [],        // Speaker statistics
  isLive = false,    // Live session indicator
  onUpdateSpeaker,   // Callback to update speaker label
  viewMode = 'timeline' // 'timeline' | 'split'
}) {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [currentView, setCurrentView] = useState(viewMode);
  const contentRef = useRef(null);

  const speakers = session?.speakers || [];
  const template = session?.template || SESSION_TEMPLATES.general;

  // Auto-scroll to bottom on new segments
  useEffect(() => {
    if (contentRef.current && isLive) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [segments.length, isLive]);

  // Get active speaker (last speaker in segments)
  const activeSpeakerId = segments.length > 0
    ? segments[segments.length - 1].speakerId
    : null;

  /**
   * Dragging handlers
   */
  const handleMouseDown = (e) => {
    if (e.target.closest('[data-no-drag]')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  /**
   * Handle speaker edit
   */
  const handleSpeakerSave = (updates) => {
    if (editingSpeaker && onUpdateSpeaker) {
      onUpdateSpeaker(editingSpeaker.id, updates);
    }
    setEditingSpeaker(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          ...styles.panel,
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerIcon}>{template.icon}</span>
            <span style={styles.headerTitle}>{template.name}</span>
            {isLive && (
              <span style={styles.liveBadge}>
                <span style={styles.liveIndicator} />
                LIVE
              </span>
            )}
          </div>

          <div style={styles.headerRight}>
            {/* View toggle */}
            <div data-no-drag style={styles.viewToggle}>
              <button
                style={{
                  ...styles.viewButton,
                  ...(currentView === 'timeline' && styles.viewButtonActive)
                }}
                onClick={() => setCurrentView('timeline')}
              >
                📋 Timeline
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  ...(currentView === 'split' && styles.viewButtonActive)
                }}
                onClick={() => setCurrentView('split')}
              >
                📊 Split
              </button>
            </div>

            <button
              data-no-drag
              style={styles.closeButton}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Speaker badges */}
        <div style={styles.speakersBar}>
          {speakers.map(speaker => (
            <SpeakerBadge
              key={speaker.id}
              speaker={speaker}
              isActive={speaker.id === activeSpeakerId}
              onClick={() => setEditingSpeaker(speaker)}
            />
          ))}
        </div>

        {/* Content area */}
        <div ref={contentRef} style={styles.content}>
          {currentView === 'timeline' ? (
            // Timeline view
            <div style={styles.timeline}>
              {segments.length === 0 ? (
                <div style={styles.emptyState}>
                  <span style={styles.emptyIcon}>🎙️</span>
                  <span>Waiting for speakers...</span>
                  <span style={styles.emptyHint}>
                    Start speaking to begin transcription
                  </span>
                </div>
              ) : (
                segments.map((segment, idx) => (
                  <TimelineSegment
                    key={idx}
                    segment={segment}
                    speaker={speakers.find(s => s.id === segment.speakerId)}
                    onSpeakerClick={setEditingSpeaker}
                  />
                ))
              )}
            </div>
          ) : (
            // Split view - one column per speaker
            <div style={styles.splitView}>
              {speakers.map(speaker => {
                const speakerSegments = segments.filter(s => s.speakerId === speaker.id);
                const color = SPEAKER_COLORS[speaker.colorKey] || SPEAKER_COLORS.unknown;

                return (
                  <div key={speaker.id} style={styles.splitColumn}>
                    <div
                      style={{
                        ...styles.splitColumnHeader,
                        borderBottomColor: color.primary
                      }}
                    >
                      <div
                        style={{
                          ...styles.splitColumnDot,
                          backgroundColor: color.primary
                        }}
                      />
                      <span style={{ color: color.primary }}>{speaker.label}</span>
                    </div>
                    <div style={styles.splitColumnContent}>
                      {speakerSegments.map((segment, idx) => (
                        <div key={idx} style={styles.splitMessage}>
                          <span style={styles.splitTime}>
                            {formatTimestamp(segment.startTime)}
                          </span>
                          <span>{segment.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Statistics footer */}
        <SpeakerStats stats={stats} speakers={speakers} />
      </div>

      {/* Speaker editor modal */}
      {editingSpeaker && (
        <SpeakerEditor
          speaker={editingSpeaker}
          onSave={handleSpeakerSave}
          onClose={() => setEditingSpeaker(null)}
        />
      )}

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}

/**
 * Styles
 */
const styles = {
  panel: {
    position: 'fixed',
    width: '700px',
    height: '550px',
    backgroundColor: 'rgba(17, 17, 27, 0.95)',
    borderRadius: '16px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 92, 246, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000,
    backdropFilter: 'blur(20px)'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(139, 92, 246, 0.1)'
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  headerIcon: {
    fontSize: '20px'
  },

  headerTitle: {
    color: '#e2e8f0',
    fontSize: '15px',
    fontWeight: '600'
  },

  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    borderRadius: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },

  liveIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    animation: 'pulse 1.5s infinite'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  viewToggle: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(30, 30, 46, 0.8)',
    borderRadius: '8px',
    padding: '2px'
  },

  viewButton: {
    padding: '4px 10px',
    borderRadius: '6px',
    border: 'none',
    background: 'none',
    color: '#64748b',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  viewButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    color: '#a5b4fc'
  },

  closeButton: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px'
  },

  speakersBar: {
    display: 'flex',
    gap: '8px',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    flexWrap: 'wrap'
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px'
  },

  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  segment: {
    display: 'flex',
    gap: '16px'
  },

  segmentTimeline: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50px',
    flexShrink: 0
  },

  segmentTime: {
    fontSize: '10px',
    color: '#64748b',
    marginBottom: '4px'
  },

  segmentDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0
  },

  segmentLine: {
    flex: 1,
    width: '2px',
    marginTop: '4px'
  },

  segmentContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  segmentSpeaker: {
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  segmentText: {
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: '1.5',
    paddingLeft: '12px',
    borderLeft: '2px solid',
    marginLeft: '4px'
  },

  segmentDuration: {
    fontSize: '10px',
    color: '#475569',
    marginLeft: '16px'
  },

  splitView: {
    display: 'flex',
    gap: '1px',
    height: '100%',
    backgroundColor: 'rgba(139, 92, 246, 0.1)'
  },

  splitColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(17, 17, 27, 0.95)',
    overflow: 'hidden'
  },

  splitColumnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderBottom: '2px solid',
    backgroundColor: 'rgba(30, 30, 46, 0.5)',
    fontSize: '12px',
    fontWeight: '600'
  },

  splitColumnDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },

  splitColumnContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px'
  },

  splitMessage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px',
    fontSize: '12px',
    color: '#cbd5e1',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
  },

  splitTime: {
    fontSize: '9px',
    color: '#475569'
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    gap: '8px',
    color: '#64748b'
  },

  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },

  emptyHint: {
    fontSize: '12px',
    color: '#475569'
  },

  statsContainer: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(30, 30, 46, 0.5)'
  },

  statsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '10px'
  },

  statsIcon: {
    fontSize: '12px'
  },

  statsTitle: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  statBar: {
    height: '4px',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden'
  },

  statBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease'
  },

  statInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px'
  },

  statValue: {
    color: '#64748b'
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100
  },

  modal: {
    backgroundColor: 'rgba(30, 30, 46, 0.98)',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    width: '320px',
    overflow: 'hidden'
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600'
  },

  modalClose: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '16px'
  },

  modalBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  formLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },

  formInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(17, 17, 27, 0.8)',
    color: '#e2e8f0',
    fontSize: '13px',
    outline: 'none'
  },

  colorPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  modalFooter: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    justifyContent: 'flex-end'
  },

  cancelButton: {
    padding: '6px 16px',
    borderRadius: '6px',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer'
  },

  saveButton: {
    padding: '6px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export { MultiSpeakerTranscriptPanel };
