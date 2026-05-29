import React, { useState } from 'react';

const STATUS_CONFIG = {
  excess: {
    badge: { bg: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171' },
    label: 'EXCESS',
    icon: '⚠️',
    desc: 'Above 30% threshold'
  },
  deficiency: {
    badge: { bg: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa' },
    label: 'DEFICIENCY',
    icon: '⚠️',
    desc: 'Below 10% threshold'
  },
  balanced: {
    badge: { bg: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80' },
    label: 'BALANCED',
    icon: '✅',
    desc: 'Healthy range (15-25%)'
  },
  moderate: {
    badge: { bg: 'rgba(148, 163, 184, 0.15)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#94a3b8' },
    label: 'MODERATE',
    icon: 'ℹ️',
    desc: 'Functional range'
  }
};

export default function OrganSystemCard({ element, percentage, pattern, organSystem, themeMode = 'dark' }) {
  const [isExpanded, setIsExpanded] = useState(pattern === 'excess' || pattern === 'deficiency');
  const isDark = themeMode === 'dark';
  const status = STATUS_CONFIG[pattern] || STATUS_CONFIG.moderate;
  const patternData = pattern === 'excess' ? organSystem.excess : organSystem.deficiency;

  return (
    <div style={{
      border: `2px solid ${status.badge.border.split(' ').pop()}`,
      borderRadius: '12px',
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '2rem' }}>{organSystem.emoji}</span>
          <div>
            <h3 style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              color: isDark ? '#f1f5f9' : '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              {organSystem.organs.join(' & ')}
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                background: status.badge.bg,
                border: status.badge.border,
                color: status.badge.color,
                letterSpacing: '0.05em',
              }}>
                {status.icon} {status.label}
              </span>
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8' }}>
              {organSystem.chineseName}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: '1.3rem', color: organSystem.color }}>
              {percentage.toFixed(1)}%
            </div>
            <div style={{ fontSize: '10px', color: isDark ? '#64748b' : '#94a3b8' }}>{status.desc}</div>
          </div>
          <span style={{ fontSize: '14px', color: isDark ? '#64748b' : '#94a3b8', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded: Excess or Deficiency */}
      {isExpanded && (pattern === 'excess' || pattern === 'deficiency') && patternData && (
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`,
          padding: '16px',
          background: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.9)',
        }}>
          {/* Pattern Name */}
          <div style={{
            background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.9)',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '14px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>
              Pattern Diagnosis
            </div>
            <div style={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '14px' }}>
              {patternData.name}
            </div>
          </div>

          {/* Physical Associations Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', fontSize: '12px' }}>
            <div>
              <span style={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Body Parts: </span>
              <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{organSystem.bodyParts.join(', ')}</span>
            </div>
            <div>
              <span style={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Peak Time: </span>
              <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{organSystem.time}</span>
            </div>
            <div>
              <span style={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Emotion: </span>
              <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {pattern === 'excess' ? organSystem.emotion.imbalanced : `Lack of ${organSystem.emotion.balanced.split(',')[0]}`}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Season: </span>
              <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{organSystem.season}</span>
            </div>
          </div>

          {/* Symptoms */}
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', marginBottom: '8px', fontSize: '13px' }}>
              ⚠️ Common Symptoms
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {patternData.symptoms.slice(0, 6).map((symptom, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: pattern === 'excess' ? '#f87171' : '#60a5fa', marginTop: '2px' }}>•</span>
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body Signals */}
          {patternData.bodySignals && (
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', marginBottom: '8px', fontSize: '13px' }}>
                Body Signals to Watch
              </h4>
              {patternData.bodySignals.map((signal, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#f59e0b' }}>▸</span>
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Recommendations Preview */}
          <div style={{
            background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.9)',
            border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`,
            borderRadius: '8px',
            padding: '14px',
          }}>
            <h4 style={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '8px', fontSize: '13px' }}>
              Quick Recommendations
            </h4>
            <div style={{ fontSize: '12px' }}>
              {pattern === 'excess' && patternData.recommendations.reduce && (
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#f87171' }}>Reduce: </span>
                  <span style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                    {patternData.recommendations.reduce.slice(0, 2).join(', ')}
                  </span>
                </div>
              )}
              {patternData.recommendations.increase && (
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#4ade80' }}>Increase: </span>
                  <span style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                    {patternData.recommendations.increase.slice(0, 3).join(', ')}
                  </span>
                </div>
              )}
              {pattern === 'deficiency' && patternData.recommendations.practices && (
                <div>
                  <span style={{ fontWeight: 600, color: '#60a5fa' }}>Practices: </span>
                  <span style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                    {patternData.recommendations.practices.slice(0, 2).join(', ')}
                  </span>
                </div>
              )}
            </div>
            <p style={{ fontSize: '10px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '8px', fontStyle: 'italic' }}>
              See detailed recommendations below
            </p>
          </div>
        </div>
      )}

      {/* Expanded: Balanced */}
      {isExpanded && pattern === 'balanced' && (
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`,
          padding: '16px',
          background: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.9)',
        }}>
          <div style={{
            background: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.05)',
            border: `1px solid rgba(34, 197, 94, 0.2)`,
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <div>
              <h4 style={{ fontWeight: 600, color: '#4ade80', marginBottom: '6px', fontSize: '14px' }}>
                Healthy {organSystem.organs[0]} Function
              </h4>
              <p style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '8px', lineHeight: '1.5' }}>
                Your {organSystem.organs.join(' and ')} system is in healthy balance.
                This supports {organSystem.bodyParts.slice(0, 2).join(', ')} health and
                promotes {organSystem.emotion.balanced.split(',')[0].toLowerCase().trim()}.
              </p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>
                Maintenance: Continue balanced lifestyle to preserve this healthy state.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded: Moderate (collapsed by default, brief info) */}
      {isExpanded && pattern === 'moderate' && (
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`,
          padding: '16px',
          background: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.9)',
        }}>
          <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6' }}>
            <p>Your {organSystem.organs.join(' & ')} system is in a functional range — not in excess or deficiency, but not perfectly balanced either.</p>
            <p style={{ marginTop: '6px' }}><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Body Parts:</strong> {organSystem.bodyParts.join(', ')}</p>
            <p><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Peak Time:</strong> {organSystem.time}</p>
            <p><strong style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Balanced Emotion:</strong> {organSystem.emotion.balanced}</p>
          </div>
        </div>
      )}
    </div>
  );
}
