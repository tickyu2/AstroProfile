import React, { useState } from 'react';
import { ORGAN_SYSTEMS } from '../../../data/organSystems';

function compileAcupressurePoints(healthPatterns) {
  const points = [];
  const seen = new Set();

  healthPatterns.excess.forEach(({ element }) => {
    const org = ORGAN_SYSTEMS[element];
    if (!org) return;
    (org.excess.recommendations.acupoints || []).forEach(point => {
      if (!seen.has(point.code)) {
        points.push({
          ...point,
          pattern: 'excess',
          organName: org.organs[0],
          organEmoji: org.emoji,
          element,
          details: `For ${element} excess: ${point.action}`,
          frequency: 'Daily, 2-3 minutes'
        });
        seen.add(point.code);
      }
    });
  });

  healthPatterns.deficiency.forEach(({ element }) => {
    const org = ORGAN_SYSTEMS[element];
    if (!org) return;
    (org.deficiency.recommendations.acupoints || []).forEach(point => {
      if (!seen.has(point.code)) {
        points.push({
          ...point,
          pattern: 'deficiency',
          organName: org.organs[0],
          organEmoji: org.emoji,
          element,
          details: `For ${element} deficiency: ${point.action}`,
          frequency: 'Daily, 2-3 minutes, can use moxibustion'
        });
        seen.add(point.code);
      }
    });
  });

  return points;
}

function AcupointCard({ point, themeMode }) {
  const [showDetails, setShowDetails] = useState(false);
  const isDark = themeMode === 'dark';

  return (
    <div style={{
      border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`,
      borderRadius: '10px',
      padding: '14px',
      background: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(248, 250, 252, 0.9)',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: isDark ? '#f1f5f9' : '#0f172a' }}>
            {point.code}
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>{point.name}</div>
          <div style={{ fontSize: '10px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
            {point.organEmoji} {point.organName}
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#a78bfa',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '2px 6px',
          }}
        >
          {showDetails ? 'Less' : 'More'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
        <span style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '12px' }}>📍</span>
        <p style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', margin: 0 }}>
          <strong>Action:</strong> {point.action}
        </p>
      </div>

      {showDetails && (
        <div style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'}`,
        }}>
          <p style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '6px' }}>{point.details}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: isDark ? '#64748b' : '#94a3b8' }}>🕐</span>
            <span style={{ fontSize: '11px', color: isDark ? '#cbd5e1' : '#475569' }}>
              <strong>When:</strong> {point.frequency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AcupressurePanel({ healthPatterns, themeMode = 'dark' }) {
  const isDark = themeMode === 'dark';
  const points = compileAcupressurePoints(healthPatterns);

  if (points.length === 0) return null;

  return (
    <div style={{
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.4rem' }}>🔴</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          Acupressure Points
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '16px' }}>
        Key acupoints to support your constitutional balance. Apply gentle pressure for 2-3 minutes daily.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {points.map((point, idx) => (
          <AcupointCard key={idx} point={point} themeMode={themeMode} />
        ))}
      </div>

      {/* How to Apply */}
      <div style={{
        background: isDark ? 'rgba(139, 92, 246, 0.06)' : 'rgba(139, 92, 246, 0.04)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '12px',
      }}>
        <h3 style={{ fontWeight: 600, color: isDark ? '#c4b5fd' : '#7c3aed', marginBottom: '10px', fontSize: '13px' }}>
          How to Apply Acupressure
        </h3>
        <ol style={{ margin: 0, paddingLeft: '16px' }}>
          {[
            'Locate the point using the description',
            'Apply firm but gentle pressure with thumb or finger',
            'Hold for 2-3 minutes or until you feel a slight ache',
            'Breathe deeply and relax during treatment',
            'Repeat on both sides if applicable'
          ].map((step, i) => (
            <li key={i} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '4px' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: isDark ? 'rgba(234, 179, 8, 0.06)' : 'rgba(234, 179, 8, 0.04)',
        border: '1px solid rgba(234, 179, 8, 0.15)',
        borderRadius: '8px',
        padding: '12px',
      }}>
        <p style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
          <strong>Caution:</strong> Acupressure is generally safe but avoid during pregnancy,
          on open wounds, or if you have a serious medical condition. Consult a licensed
          acupuncturist for treatment of specific health issues.
        </p>
      </div>
    </div>
  );
}
