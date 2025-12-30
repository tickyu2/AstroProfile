/**
 * Voice Transcript Panel
 * ======================
 * Floating side-by-side transcript view for voice conversations.
 *
 * Features:
 * - Side-by-side: User transcript | Luna transcript
 * - Timestamp markers every minute
 * - Momentum scroll control (seesaw-style time navigation)
 * - 5-day storage persistence
 * - Paralinguistic cue display (when using OpenAI Realtime)
 *
 * Part of GENESIS OS - Voice Mode Enhancement
 * Created: December 26, 2024
 * Updated: December 27, 2024 - Added paralinguistic cue display
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MomentumScrollControl from './MomentumScrollControl';

// Storage key for transcript history
const STORAGE_KEY = 'genesis_voice_transcripts';
const STORAGE_DAYS = 5;

// Paralinguistic cue display configuration
// (matches backend voiceProvider.js CUE_DISPLAY)
const CUE_DISPLAY = {
  happy: { emoji: '😊', label: 'happy', color: '#22c55e' },
  sad: { emoji: '😢', label: 'sad', color: '#6366f1' },
  frustrated: { emoji: '😤', label: 'frustrated', color: '#ef4444' },
  excited: { emoji: '🎉', label: 'excited', color: '#f59e0b' },
  anxious: { emoji: '😰', label: 'anxious', color: '#8b5cf6' },
  calm: { emoji: '😌', label: 'calm', color: '#06b6d4' },
  disappointed: { emoji: '😞', label: 'disappointed', color: '#64748b' },
  hopeful: { emoji: '🌟', label: 'hopeful', color: '#eab308' },
  sigh: { emoji: '😮‍💨', label: 'sigh', color: '#94a3b8' },
  laugh: { emoji: '😄', label: 'laugh', color: '#22c55e' },
  hesitation: { emoji: '🤔', label: 'hesitant', color: '#f97316' },
  whisper: { emoji: '🤫', label: 'whisper', color: '#a855f7' },
  emphasis: { emoji: '❗', label: 'emphasis', color: '#ef4444' },
  rushed: { emoji: '⚡', label: 'rushed', color: '#f59e0b' },
  slow: { emoji: '🐢', label: 'slow', color: '#06b6d4' },
  pause: { emoji: '⏸️', label: 'pause', color: '#64748b' }
};

/**
 * Get cue display info
 */
function getCueDisplay(cueType) {
  return CUE_DISPLAY[cueType] || { emoji: '❓', label: cueType, color: '#64748b' };
}

/**
 * Cue Badge Component - displays a single paralinguistic cue
 */
function CueBadge({ cue }) {
  const display = getCueDisplay(cue.type);
  const confidence = Math.round((cue.confidence || 0.5) * 100);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '2px 6px',
        borderRadius: '10px',
        backgroundColor: `${display.color}20`,
        border: `1px solid ${display.color}40`,
        fontSize: '10px',
        color: display.color,
        marginRight: '4px',
        marginBottom: '2px'
      }}
      title={`${display.label} (${confidence}% confidence)`}
    >
      <span>{display.emoji}</span>
      <span style={{ opacity: 0.8 }}>{display.label}</span>
    </span>
  );
}

/**
 * Format timestamp for display
 */
function formatTimestamp(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format date for section headers
 */
function formatDateHeader(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Group messages by minute for timestamp markers
 */
function groupByMinute(messages) {
  const groups = [];
  let currentMinute = null;
  let currentGroup = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.timestamp);
    const minuteKey = `${msgDate.getFullYear()}-${msgDate.getMonth()}-${msgDate.getDate()}-${msgDate.getHours()}-${msgDate.getMinutes()}`;

    if (minuteKey !== currentMinute) {
      currentMinute = minuteKey;
      currentGroup = {
        timestamp: msg.timestamp,
        minuteKey,
        messages: []
      };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(msg);
  });

  return groups;
}

/**
 * Transcript Column Component
 */
function TranscriptColumn({ title, messages, emptyText, isUser, showCues = true }) {
  const columnRef = useRef(null);
  const groupedMessages = groupByMinute(messages);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (columnRef.current) {
      columnRef.current.scrollTop = columnRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div style={styles.column}>
      <div style={styles.columnHeader}>
        <span style={styles.columnIcon}>{isUser ? '🎤' : '✨'}</span>
        <span style={styles.columnTitle}>{title}</span>
      </div>

      <div ref={columnRef} style={styles.columnContent}>
        {groupedMessages.length === 0 ? (
          <div style={styles.emptyState}>{emptyText}</div>
        ) : (
          groupedMessages.map((group, groupIdx) => (
            <div key={group.minuteKey} style={styles.messageGroup}>
              {/* Timestamp marker */}
              <div style={styles.timestampMarker}>
                {formatTimestamp(group.timestamp)}
              </div>

              {/* Messages in this minute */}
              {group.messages.map((msg, msgIdx) => (
                <div
                  key={`${groupIdx}-${msgIdx}`}
                  style={styles.messageWrapper}
                >
                  {/* Paralinguistic cues (if any) */}
                  {showCues && msg.cues && msg.cues.length > 0 && (
                    <div style={styles.cuesContainer}>
                      {msg.cues
                        .filter(c => (c.confidence || 0.5) >= 0.6)
                        .map((cue, cueIdx) => (
                          <CueBadge key={cueIdx} cue={cue} />
                        ))
                      }
                    </div>
                  )}

                  {/* Message text */}
                  <div
                    style={{
                      ...styles.message,
                      ...(isUser ? styles.userMessage : styles.lunaMessage)
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Main Voice Transcript Panel
 */
export default function VoiceTranscriptPanel({
  isOpen,
  onClose,
  userTranscripts = [],
  lunaTranscripts = [],
  sessionId,
  profileId,
  provider = 'groq_whisper', // 'groq_whisper' or 'openai_realtime'
  supportsCues = false, // Whether provider supports paralinguistic cues
  showCues = true // User preference for showing cues
}) {
  // Compute whether to actually display cues (need both provider support and user preference)
  const displayCues = supportsCues && showCues;
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [storedSessions, setStoredSessions] = useState([]);
  const [viewingSession, setViewingSession] = useState(null);
  const panelRef = useRef(null);

  // Load stored sessions on mount
  useEffect(() => {
    loadStoredSessions();
  }, []);

  // Save current session when messages change
  useEffect(() => {
    if (sessionId && (userTranscripts.length > 0 || lunaTranscripts.length > 0)) {
      saveCurrentSession();
    }
  }, [userTranscripts, lunaTranscripts, sessionId]);

  /**
   * Load sessions from localStorage (within 5 days)
   */
  const loadStoredSessions = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const sessions = JSON.parse(stored);
        const cutoff = Date.now() - (STORAGE_DAYS * 24 * 60 * 60 * 1000);

        // Filter to only sessions within 5 days
        const validSessions = sessions.filter(s => s.timestamp > cutoff);
        setStoredSessions(validSessions);

        // Clean up old sessions
        if (validSessions.length !== sessions.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validSessions));
        }
      }
    } catch (error) {
      console.error('[VoiceTranscript] Error loading sessions:', error);
    }
  }, []);

  /**
   * Save current session to localStorage
   */
  const saveCurrentSession = useCallback(() => {
    if (!sessionId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const sessions = stored ? JSON.parse(stored) : [];

      // Find existing session or create new
      const existingIdx = sessions.findIndex(s => s.sessionId === sessionId);
      const sessionData = {
        sessionId,
        profileId,
        timestamp: Date.now(),
        userTranscripts,
        lunaTranscripts
      };

      if (existingIdx >= 0) {
        sessions[existingIdx] = sessionData;
      } else {
        sessions.push(sessionData);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      setStoredSessions(sessions);
    } catch (error) {
      console.error('[VoiceTranscript] Error saving session:', error);
    }
  }, [sessionId, profileId, userTranscripts, lunaTranscripts]);

  /**
   * Handle momentum scroll time navigation
   */
  const handleTimeNavigate = useCallback((direction, magnitude) => {
    // magnitude: 1 = 1 minute, 5 = 5 minutes
    const delta = direction * magnitude * 60 * 1000; // Convert to ms
    setCurrentTime(prev => Math.min(Date.now(), Math.max(0, prev + delta)));
  }, []);

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

  // Filter messages to current time view
  const filteredUserTranscripts = (viewingSession?.userTranscripts || userTranscripts)
    .filter(m => new Date(m.timestamp).getTime() <= currentTime);
  const filteredLunaTranscripts = (viewingSession?.lunaTranscripts || lunaTranscripts)
    .filter(m => new Date(m.timestamp).getTime() <= currentTime);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
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
          <span style={styles.headerIcon}>🎙️</span>
          <span style={styles.headerTitle}>Voice Transcript</span>
          {/* Provider indicator */}
          <span style={{
            ...styles.providerBadge,
            backgroundColor: provider === 'openai_realtime'
              ? 'rgba(34, 197, 94, 0.2)'
              : 'rgba(99, 102, 241, 0.2)',
            color: provider === 'openai_realtime' ? '#22c55e' : '#a5b4fc'
          }}>
            {provider === 'openai_realtime' ? '⚡ Native' : '🎯 STT'}
          </span>
          {/* Cue capture indicator */}
          {supportsCues && (
            <span style={{
              ...styles.providerBadge,
              backgroundColor: displayCues
                ? 'rgba(249, 115, 22, 0.2)'
                : 'rgba(100, 116, 139, 0.2)',
              color: displayCues ? '#f97316' : '#64748b'
            }}>
              😊 {displayCues ? 'Cues On' : 'Cues Off'}
            </span>
          )}
        </div>

        <div style={styles.headerRight}>
          {/* Session selector for viewing past sessions */}
          {storedSessions.length > 1 && (
            <select
              data-no-drag
              style={styles.sessionSelect}
              value={viewingSession?.sessionId || 'current'}
              onChange={(e) => {
                if (e.target.value === 'current') {
                  setViewingSession(null);
                  setCurrentTime(Date.now());
                } else {
                  const session = storedSessions.find(s => s.sessionId === e.target.value);
                  setViewingSession(session);
                  setCurrentTime(session?.timestamp || Date.now());
                }
              }}
            >
              <option value="current">Current Session</option>
              {storedSessions.map(s => (
                <option key={s.sessionId} value={s.sessionId}>
                  {formatDateHeader(s.timestamp)} - {formatTimestamp(s.timestamp)}
                </option>
              ))}
            </select>
          )}

          <button
            data-no-drag
            style={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Side-by-side transcript columns */}
      <div style={styles.columnsContainer}>
        <TranscriptColumn
          title="You"
          messages={filteredUserTranscripts}
          emptyText="Your voice will appear here..."
          isUser={true}
          showCues={displayCues}
        />

        <div style={styles.columnDivider} />

        <TranscriptColumn
          title="Luna"
          messages={filteredLunaTranscripts}
          emptyText="Luna's responses will appear here..."
          isUser={false}
          showCues={displayCues}
        />
      </div>

      {/* Momentum Scroll Control */}
      <div data-no-drag style={styles.scrollControlContainer}>
        <MomentumScrollControl
          onNavigate={handleTimeNavigate}
          currentTime={currentTime}
          minTime={Math.min(
            ...filteredUserTranscripts.map(m => new Date(m.timestamp).getTime()),
            ...filteredLunaTranscripts.map(m => new Date(m.timestamp).getTime()),
            Date.now()
          )}
          maxTime={Date.now()}
        />
      </div>

      {/* Current time indicator */}
      <div style={styles.timeIndicator}>
        {formatTimestamp(currentTime)}
      </div>
    </div>
  );
}

/**
 * Styles
 */
const styles = {
  panel: {
    position: 'fixed',
    width: '600px',
    height: '450px',
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
    gap: '8px'
  },

  headerIcon: {
    fontSize: '18px'
  },

  headerTitle: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600'
  },

  providerBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '500',
    marginLeft: '8px'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  sessionSelect: {
    backgroundColor: 'rgba(30, 30, 46, 0.8)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '6px',
    color: '#a5b4fc',
    fontSize: '12px',
    padding: '4px 8px',
    cursor: 'pointer'
  },

  closeButton: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s'
  },

  columnsContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },

  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'rgba(30, 30, 46, 0.5)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
  },

  columnIcon: {
    fontSize: '14px'
  },

  columnTitle: {
    color: '#a5b4fc',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  columnContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  columnDivider: {
    width: '1px',
    backgroundColor: 'rgba(139, 92, 246, 0.2)'
  },

  messageGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },

  cuesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2px',
    marginBottom: '2px',
    paddingLeft: '4px'
  },

  timestampMarker: {
    fontSize: '10px',
    color: '#64748b',
    textAlign: 'center',
    padding: '4px 0',
    marginBottom: '4px'
  },

  message: {
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.4',
    maxWidth: '95%'
  },

  userMessage: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#c7d2fe',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },

  lunaMessage: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: '#ddd6fe',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },

  emptyState: {
    color: '#64748b',
    fontSize: '13px',
    textAlign: 'center',
    padding: '40px 20px',
    fontStyle: 'italic'
  },

  scrollControlContainer: {
    padding: '8px 16px',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(30, 30, 46, 0.5)'
  },

  timeIndicator: {
    position: 'absolute',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    color: '#fff',
    fontSize: '11px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: '500'
  }
};

export { VoiceTranscriptPanel };
