import React, { useState } from 'react';
import { ORGAN_SYSTEMS } from '../../../data/organSystems';

function compileFoodRecommendations(healthPatterns) {
  const increase = [];
  const reduce = [];

  healthPatterns.excess.forEach(({ element }) => {
    const org = ORGAN_SYSTEMS[element];
    if (!org) return;
    const recs = org.excess.recommendations;
    if (recs.reduce) {
      reduce.push({
        emoji: org.emoji,
        title: `Control ${element.charAt(0).toUpperCase() + element.slice(1)} Excess`,
        reason: `Reduce ${org.organs.join(' & ')} burden`,
        foods: recs.reduce
      });
    }
    if (recs.increase) {
      increase.push({
        emoji: org.emoji,
        title: `Regulate ${element.charAt(0).toUpperCase() + element.slice(1)}`,
        reason: `Support ${org.organs.join(' & ')} balance`,
        foods: recs.increase
      });
    }
  });

  healthPatterns.deficiency.forEach(({ element }) => {
    const org = ORGAN_SYSTEMS[element];
    if (!org) return;
    const recs = org.deficiency.recommendations;
    if (recs.increase) {
      increase.push({
        emoji: org.emoji,
        title: `Tonify ${element.charAt(0).toUpperCase() + element.slice(1)}`,
        reason: `Strengthen ${org.organs.join(' & ')} system`,
        foods: recs.increase
      });
    }
  });

  return { increase, reduce };
}

export default function FoodRecommendations({ healthPatterns, themeMode = 'dark' }) {
  const [activeTab, setActiveTab] = useState('increase');
  const isDark = themeMode === 'dark';
  const foodRecs = compileFoodRecommendations(healthPatterns);

  if (foodRecs.increase.length === 0 && foodRecs.reduce.length === 0) return null;

  const tabStyle = (active) => ({
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    borderBottom: active ? '2px solid' : '2px solid transparent',
    borderBottomColor: active ? (activeTab === 'increase' ? '#4ade80' : '#f87171') : 'transparent',
    color: active
      ? (activeTab === 'increase' ? '#4ade80' : '#f87171')
      : (isDark ? '#64748b' : '#94a3b8'),
    background: 'transparent',
    border: 'none',
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.4rem' }}>🍲</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          Food as Medicine
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '16px' }}>
        Personalized dietary guidance based on your constitutional patterns
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)'}` }}>
        <button style={tabStyle(activeTab === 'increase')} onClick={() => setActiveTab('increase')}>
          + Foods to Increase
        </button>
        <button style={tabStyle(activeTab === 'reduce')} onClick={() => setActiveTab('reduce')}>
          - Foods to Reduce
        </button>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(activeTab === 'increase' ? foodRecs.increase : foodRecs.reduce).map((category, idx) => (
          <div key={idx} style={{
            background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.9)',
            borderRadius: '8px',
            padding: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{category.emoji}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a', margin: '0 0 4px', fontSize: '14px' }}>
                  {category.title}
                </h3>
                <p style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '10px' }}>
                  {category.reason}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {category.foods.map((food, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: activeTab === 'increase'
                        ? (isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)')
                        : (isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)'),
                      color: activeTab === 'increase' ? '#4ade80' : '#f87171',
                      border: `1px solid ${activeTab === 'increase' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}>
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '16px',
        background: isDark ? 'rgba(59, 130, 246, 0.06)' : 'rgba(59, 130, 246, 0.05)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: '8px',
        padding: '12px',
      }}>
        <p style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>
          <strong>Note:</strong> These are general TCM dietary guidelines. Individual responses vary.
          Consult a healthcare provider or licensed TCM practitioner for personalized advice,
          especially if you have existing health conditions or allergies.
        </p>
      </div>
    </div>
  );
}
