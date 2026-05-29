import React from 'react';
import { getPrimaryConstitution, getConstitutionalStrengths, getConstitutionalVulnerabilities, getExcessWarnings } from '../../../utils/healthAnalysis';

function getSeasonalStrength(element, season) {
  const seasonMap = {
    spring: { wood: 'strengthened', fire: 'moderate', earth: 'weakened', metal: 'very weak', water: 'moderate' },
    summer: { wood: 'moderate', fire: 'strengthened', earth: 'moderate', metal: 'weakened', water: 'very weak' },
    autumn: { wood: 'very weak', fire: 'weakened', earth: 'moderate', metal: 'strengthened', water: 'moderate' },
    winter: { wood: 'moderate', fire: 'very weak', earth: 'weakened', metal: 'moderate', water: 'strengthened' },
    'late summer': { wood: 'weakened', fire: 'moderate', earth: 'strengthened', metal: 'moderate', water: 'weakened' }
  };
  return seasonMap[season?.toLowerCase()]?.[element?.toLowerCase()] || 'moderate';
}

export default function ConstitutionalHealthSummary({ adjustedElements, birthSeason, themeMode = 'dark' }) {
  const isDark = themeMode === 'dark';
  const primary = getPrimaryConstitution(adjustedElements);
  const strengths = getConstitutionalStrengths(adjustedElements);
  const vulnerabilities = getConstitutionalVulnerabilities(adjustedElements);
  const warnings = getExcessWarnings(adjustedElements);

  if (!primary?.organSystem) return null;

  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <div style={{
      background: isDark
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))'
        : 'linear-gradient(135deg, rgba(238, 242, 255, 0.9), rgba(243, 232, 255, 0.9))',
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.5rem' }}>🩺</span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          Your Constitutional Health Profile
        </h2>
      </div>

      {/* Primary Constitution */}
      <div style={{
        background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <span style={{ fontSize: '3rem' }}>{primary.organSystem.emoji}</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: '0 0 8px' }}>
              {cap(primary.element)}-Dominant Constitution
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.5rem', color: primary.organSystem.color }}>
                {primary.percentage.toFixed(1)}%
              </span>
              <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>
                {primary.organSystem.organs.join(' & ')} System
              </span>
            </div>
            {birthSeason && (
              <p style={{ fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569', margin: 0 }}>
                Born in <strong>{birthSeason}</strong> when {cap(primary.element)} is {getSeasonalStrength(primary.element, birthSeason)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div style={{
          background: isDark ? 'rgba(34, 197, 94, 0.06)' : 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>✅</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 600, color: '#4ade80', margin: '0 0 8px', fontSize: '14px' }}>
                Constitutional Strengths
              </h4>
              {strengths.map(({ element, percentage, organs, emoji }) => (
                <div key={element} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{emoji}</span>
                  <strong>{organs.join(' & ')}:</strong>
                  <span>Balanced ({percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Excess Warnings */}
      {warnings.length > 0 && (
        <div style={{
          background: isDark ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 600, color: '#f87171', margin: '0 0 8px', fontSize: '14px' }}>
                Excess Patterns (Monitor Closely)
              </h4>
              {warnings.map(({ element, percentage, organs, emoji, severity }) => (
                <div key={element} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>{emoji}</span>
                  <strong>{organs.join(' & ')}:</strong>
                  <span style={severity === 'critical' ? { color: '#f87171', fontWeight: 700 } : {}}>
                    Excess at {percentage.toFixed(1)}%
                  </span>
                  {severity === 'critical' && (
                    <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1px 6px', borderRadius: '4px' }}>
                      CRITICAL
                    </span>
                  )}
                </div>
              ))}
              <p style={{ fontSize: '10px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '8px', fontStyle: 'italic' }}>
                See organ cards below for symptoms and regulation strategies
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vulnerabilities */}
      {vulnerabilities.length > 0 && (
        <div style={{
          background: isDark ? 'rgba(59, 130, 246, 0.06)' : 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '10px',
          padding: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>📉</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 600, color: '#60a5fa', margin: '0 0 8px', fontSize: '14px' }}>
                Constitutional Vulnerabilities (Needs Support)
              </h4>
              {vulnerabilities.map(({ element, percentage, organs, emoji, severity }) => (
                <div key={element} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>{emoji}</span>
                  <strong>{organs.join(' & ')}:</strong>
                  <span style={severity === 'critical' ? { color: '#60a5fa', fontWeight: 700 } : {}}>
                    Deficient at {percentage.toFixed(1)}%
                  </span>
                  {severity === 'critical' && (
                    <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', padding: '1px 6px', borderRadius: '4px' }}>
                      CRITICAL
                    </span>
                  )}
                </div>
              ))}
              <p style={{ fontSize: '10px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '8px', fontStyle: 'italic' }}>
                See organ cards below for tonification strategies
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
