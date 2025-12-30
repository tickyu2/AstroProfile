import React, { useMemo } from 'react';
import './ConversationStats.css';

export function ConversationStats({ data }) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalMessages: 0,
        dominantArchetype: 'N/A',
        avgCongruence: 0,
        patternsDetected: 0,
        emotionalComplexity: 'LOW',
        conversationDuration: 0,
        avgProcessingTime: 0
      };
    }

    // Calculate stats
    const archetypeCounts = {};
    let congruenceSum = 0;
    const allPatterns = new Set();
    let totalProcessingTime = 0;

    data.forEach(d => {
      // Count archetypes
      const archetype = d.archetype?.type;
      if (archetype) {
        archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
      }

      // Sum congruence
      const congruenceValue = {
        'HIGH': 3,
        'MODERATE': 2,
        'LOW': 1,
        'UNKNOWN': 0
      }[d.congruence?.level] || 0;
      congruenceSum += congruenceValue;

      // Collect patterns
      if (d.congruence?.patterns) {
        d.congruence.patterns.forEach(p => allPatterns.add(p));
      }
      if (d.congruence?.advancedPatterns) {
        d.congruence.advancedPatterns.forEach(ap => allPatterns.add(ap.pattern));
      }

      // Track processing time if available
      if (d.performance?.duration) {
        totalProcessingTime += d.performance.duration;
      }
    });

    // Find dominant archetype
    const dominantArchetype = Object.entries(archetypeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    // Calculate average congruence
    const avgCongruence = (congruenceSum / data.length / 3) * 100;

    // Calculate duration
    const firstTimestamp = data[0]?.timestamp;
    const lastTimestamp = data[data.length - 1]?.timestamp;
    const durationMs = lastTimestamp - firstTimestamp;
    const durationMin = Math.round(durationMs / 60000);

    // Calculate complexity
    const complexity = allPatterns.size >= 8 ? 'HIGH' :
                      allPatterns.size >= 4 ? 'MODERATE' : 'LOW';

    // Average processing time
    const avgProcessingTime = totalProcessingTime > 0
      ? (totalProcessingTime / data.length).toFixed(2)
      : 'N/A';

    return {
      totalMessages: data.length,
      dominantArchetype,
      avgCongruence: avgCongruence.toFixed(1),
      patternsDetected: allPatterns.size,
      emotionalComplexity: complexity,
      conversationDuration: durationMin,
      avgProcessingTime
    };
  }, [data]);

  return (
    <div className="conversation-stats">
      <h3>Conversation Statistics</h3>

      <div className="stat-card">
        <span className="stat-label">Total Messages</span>
        <span className="stat-value">{stats.totalMessages}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Duration</span>
        <span className="stat-value">{stats.conversationDuration} min</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Dominant Archetype</span>
        <span className="stat-value archetype">{stats.dominantArchetype}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Avg Congruence</span>
        <span className={`stat-value congruence-${getCongruenceClass(stats.avgCongruence)}`}>
          {stats.avgCongruence}%
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Patterns Detected</span>
        <span className="stat-value">{stats.patternsDetected}/20</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Emotional Complexity</span>
        <span className={`stat-value complexity-${stats.emotionalComplexity.toLowerCase()}`}>
          {stats.emotionalComplexity}
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Avg Processing</span>
        <span className="stat-value performance">
          {stats.avgProcessingTime !== 'N/A' ? `${stats.avgProcessingTime}ms` : 'N/A'}
        </span>
      </div>
    </div>
  );
}

function getCongruenceClass(value) {
  const numValue = parseFloat(value);
  if (numValue >= 70) return 'high';
  if (numValue >= 40) return 'moderate';
  return 'low';
}
