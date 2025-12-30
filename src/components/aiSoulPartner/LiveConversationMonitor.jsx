/**
 * ============================================================================
 * LIVE CONVERSATION MONITOR
 * ============================================================================
 *
 * Real-time monitoring of Luna conversation with archetype detection.
 * Shows conversation flow, archetype transitions, and emotional trajectory.
 *
 * Features:
 * - Live transcript display
 * - Archetype history timeline
 * - Emotional trajectory chart
 * - Congruence pattern tracking
 * - Conversation statistics
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ARCHETYPE_COLORS,
  ARCHETYPE_ICONS,
  ARCHETYPE_NAMES
} from '../../services/archetype/lexicons.js';
import RealtimeArchetypeDisplay from './RealtimeArchetypeDisplay.jsx';

/**
 * Main LiveConversationMonitor Component
 */
export default function LiveConversationMonitor({
  currentDetection,
  congruenceAnalysis,
  conversationContext,
  isRecording = false,
  transcript = '',
  messageHistory = [],
  onReset = () => {}
}) {
  const [selectedView, setSelectedView] = useState('overview');
  const historyEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageHistory]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              GENESIS Live Monitor
            </h2>
            {isRecording && (
              <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-400 font-medium">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* View Tabs */}
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              {['overview', 'history', 'stats'].map(view => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    selectedView === view
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={onReset}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {selectedView === 'overview' && (
          <OverviewView
            currentDetection={currentDetection}
            congruenceAnalysis={congruenceAnalysis}
            conversationContext={conversationContext}
            transcript={transcript}
            isRecording={isRecording}
          />
        )}

        {selectedView === 'history' && (
          <HistoryView
            messageHistory={messageHistory}
            historyEndRef={historyEndRef}
          />
        )}

        {selectedView === 'stats' && (
          <StatsView
            conversationContext={conversationContext}
            messageHistory={messageHistory}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Overview View - Current state
 */
function OverviewView({
  currentDetection,
  congruenceAnalysis,
  conversationContext,
  transcript,
  isRecording
}) {
  return (
    <div className="space-y-4">
      {/* Current Transcript */}
      {transcript && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-white/60">Current Transcript</span>
            {isRecording && (
              <span className="text-xs text-amber-400 animate-pulse">listening...</span>
            )}
          </div>
          <p className="text-white/90 text-sm">{transcript}</p>
        </div>
      )}

      {/* Archetype Display */}
      <RealtimeArchetypeDisplay
        currentDetection={currentDetection}
        congruenceAnalysis={congruenceAnalysis}
        isLive={isRecording}
      />

      {/* Conversation Context */}
      {conversationContext && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h4 className="text-sm font-medium text-white/80 mb-3">Conversation Context</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/60">Dominant Archetype</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">
                  {ARCHETYPE_ICONS[conversationContext.dominantArchetype]}
                </span>
                <span className="text-white font-medium capitalize">
                  {ARCHETYPE_NAMES[conversationContext.dominantArchetype] || conversationContext.dominantArchetype}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60">Messages</div>
              <div className="text-white font-medium text-lg mt-1">
                {conversationContext.messageCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60">Tone</div>
              <div className="text-white/80 capitalize mt-1">
                {conversationContext.conversationTone || 'neutral'}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60">Avg Intensity</div>
              <div className="text-white/80 mt-1">
                {((conversationContext.averageIntensity || 0) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * History View - Message timeline
 */
function HistoryView({ messageHistory, historyEndRef }) {
  if (!messageHistory || messageHistory.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        <span className="text-3xl block mb-2">📝</span>
        <p className="text-sm">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {messageHistory.map((msg, index) => {
        const archetype = msg.detection?.primary?.name || msg.archetype;
        const color = ARCHETYPE_COLORS[archetype] || '#6366f1';

        return (
          <div
            key={index}
            className="bg-slate-800/50 rounded-lg p-3 border-l-4"
            style={{ borderLeftColor: color }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {ARCHETYPE_ICONS[archetype] || '✨'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm">{msg.text || msg.transcript}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                  <span className="capitalize">{archetype}</span>
                  {msg.congruence && (
                    <span>• {msg.congruence.pattern}</span>
                  )}
                  {msg.timestamp && (
                    <span>• {new Date(msg.timestamp).toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
              {msg.detection?.confidence && (
                <span className="text-xs text-white/60">
                  {(msg.detection.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={historyEndRef} />
    </div>
  );
}

/**
 * Stats View - Conversation statistics
 */
function StatsView({ conversationContext, messageHistory }) {
  // Calculate statistics
  const stats = calculateStats(messageHistory, conversationContext);

  return (
    <div className="space-y-4">
      {/* Archetype Distribution */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-medium text-white/80 mb-3">Archetype Distribution</h4>
        {stats.archetypeDistribution.length > 0 ? (
          <div className="space-y-2">
            {stats.archetypeDistribution.map(({ archetype, count, percentage }) => (
              <div key={archetype} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80 flex items-center gap-2">
                    <span>{ARCHETYPE_ICONS[archetype]}</span>
                    <span className="capitalize">{ARCHETYPE_NAMES[archetype] || archetype}</span>
                  </span>
                  <span className="text-white/60">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: ARCHETYPE_COLORS[archetype]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No data yet</p>
        )}
      </div>

      {/* Pattern Distribution */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-medium text-white/80 mb-3">Congruence Patterns</h4>
        {stats.patternDistribution.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {stats.patternDistribution.map(({ pattern, count, percentage }) => (
              <div
                key={pattern}
                className="bg-slate-700/50 rounded-lg p-3 text-center"
              >
                <div className="text-2xl mb-1">
                  {getPatternIcon(pattern)}
                </div>
                <div className="text-xs text-white/60 capitalize">{pattern.toLowerCase()}</div>
                <div className="text-lg font-bold text-white">{percentage}%</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No patterns detected yet</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-medium text-white/80 mb-3">Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
            <div className="text-xs text-white/60">Messages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.congruenceRate}%</div>
            <div className="text-xs text-white/60">Congruent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.avgConfidence}%</div>
            <div className="text-xs text-white/60">Avg Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate statistics from message history
 */
function calculateStats(messageHistory, conversationContext) {
  const totalMessages = messageHistory?.length || 0;

  // Archetype distribution
  const archetypeCounts = {};
  let congruentCount = 0;
  let totalConfidence = 0;
  const patternCounts = {};

  messageHistory?.forEach(msg => {
    const archetype = msg.detection?.primary?.name || msg.archetype;
    if (archetype) {
      archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
    }

    if (msg.congruence?.congruence === 'CONGRUENT') {
      congruentCount++;
    }

    if (msg.congruence?.pattern) {
      patternCounts[msg.congruence.pattern] = (patternCounts[msg.congruence.pattern] || 0) + 1;
    }

    if (msg.detection?.confidence) {
      totalConfidence += msg.detection.confidence;
    }
  });

  // Sort and calculate percentages
  const archetypeDistribution = Object.entries(archetypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([archetype, count]) => ({
      archetype,
      count,
      percentage: totalMessages > 0 ? Math.round((count / totalMessages) * 100) : 0
    }));

  const patternDistribution = Object.entries(patternCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([pattern, count]) => ({
      pattern,
      count,
      percentage: totalMessages > 0 ? Math.round((count / totalMessages) * 100) : 0
    }));

  return {
    totalMessages,
    archetypeDistribution,
    patternDistribution,
    congruenceRate: totalMessages > 0 ? Math.round((congruentCount / totalMessages) * 100) : 0,
    avgConfidence: totalMessages > 0 ? Math.round((totalConfidence / totalMessages) * 100) : 0
  };
}

/**
 * Get icon for pattern
 */
function getPatternIcon(pattern) {
  const icons = {
    MATCHING: '🤝',
    MASKING: '🎭',
    SARCASM: '😏',
    AMPLIFICATION: '📢',
    SUPPRESSION: '🔇',
    MIXED: '🔀'
  };
  return icons[pattern] || '❓';
}

// Named exports
export { OverviewView, HistoryView, StatsView };
