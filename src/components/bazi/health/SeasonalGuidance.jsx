import React, { useState } from 'react';

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const SEASON_CONFIG = {
  spring: { emoji: '🌱', color: '#4ade80', bgAccent: 'rgba(34, 197, 94, 0.06)', borderAccent: 'rgba(34, 197, 94, 0.2)' },
  summer: { emoji: '☀️', color: '#fb923c', bgAccent: 'rgba(251, 146, 60, 0.06)', borderAccent: 'rgba(251, 146, 60, 0.2)' },
  autumn: { emoji: '🍂', color: '#fbbf24', bgAccent: 'rgba(251, 191, 36, 0.06)', borderAccent: 'rgba(251, 191, 36, 0.2)' },
  winter: { emoji: '❄️', color: '#60a5fa', bgAccent: 'rgba(96, 165, 250, 0.06)', borderAccent: 'rgba(96, 165, 250, 0.2)' },
};

function getSeasonalGuidance(season, birthSeason, primaryElement, vulnerabilities) {
  const isBirthSeason = season === (birthSeason || '').toLowerCase();
  const fireDeficient = vulnerabilities.some(v => v.element === 'fire');

  const base = {
    spring: {
      status: isBirthSeason ? '🌱 Natural Strength Season' : 'Spring Transition',
      description: 'Wood element thrives. Time for growth and new beginnings.',
      protocol: [
        'Light, upward energy - start new projects',
        'Increase green vegetables, sprouts',
        'Gentle stretching, tai chi',
        'Wake earlier with sunrise'
      ],
      foods: {
        increase: ['Leafy greens', 'Sprouts', 'Light proteins', 'Sour flavors (moderation)'],
        reduce: ['Heavy foods', 'Excessive dairy', 'Late dinners']
      }
    },
    summer: {
      status: isBirthSeason ? '☀️ Natural Strength Season' : 'Summer Peak',
      description: 'Fire element at maximum. Time for joy and activity.',
      protocol: [
        'Peak activity and social time',
        'Stay hydrated, eat cooling foods',
        'Cardiovascular exercise',
        'Protect Heart from excess heat'
      ],
      foods: {
        increase: ['Watermelon', 'Cucumber', 'Bitter greens', 'Cooling herbs'],
        reduce: ['Excessive spicy foods', 'Alcohol', 'Heavy meats']
      }
    },
    autumn: {
      status: isBirthSeason ? '🍂 Natural Strength Season' : 'Autumn Harvest',
      description: 'Metal element dominant. Time for organization and release.',
      protocol: [
        'Lung care - deep breathing exercises',
        'Process grief, let go of old',
        'Moistening foods for dryness',
        'Prepare for winter storage'
      ],
      foods: {
        increase: ['Pears', 'White foods (lily bulb)', 'Root vegetables', 'Warming spices'],
        reduce: ['Iced drinks', 'Raw foods', 'Excess drying foods']
      }
    },
    winter: {
      status: isBirthSeason ? '❄️ Natural Strength Season' : 'Winter Storage',
      description: 'Water element peak. Time for rest and restoration.',
      protocol: [
        'Maximum rest and sleep (before 10pm)',
        'Kidney tonification practices',
        'Keep lower back and feet warm',
        'Conserve energy, reduce activity'
      ],
      foods: {
        increase: ['Warming soups', 'Root vegetables', 'Black beans', 'Bone broth'],
        reduce: ['Cold foods', 'Raw vegetables', 'Iced drinks']
      }
    }
  };

  const guidance = { ...base[season] };

  // Adjust intensity for Fire deficiency
  if (fireDeficient) {
    if (season === 'winter') {
      guidance.intensityLevel = 100;
      guidance.intensityColor = '#ef4444';
      guidance.intensityNote = 'CRITICAL: Winter severely weakens Fire. Maximum support needed.';
      guidance.protocol.unshift('🔥 PRIORITY: Warm all foods, use warming spices daily');
    } else if (season === 'summer') {
      guidance.intensityLevel = 30;
      guidance.intensityColor = '#4ade80';
      guidance.intensityNote = 'Summer naturally supports Fire. Minimal adjustment needed.';
    } else {
      guidance.intensityLevel = 70;
      guidance.intensityColor = '#fbbf24';
      guidance.intensityNote = 'Moderate Fire support recommended.';
    }
  } else {
    guidance.intensityLevel = isBirthSeason ? 50 : 70;
    guidance.intensityColor = '#60a5fa';
    guidance.intensityNote = 'Standard seasonal adjustment protocol.';
  }

  return guidance;
}

export default function SeasonalGuidance({ birthSeason, primaryElement, vulnerabilities = [], themeMode = 'dark' }) {
  const [activeSeason, setActiveSeason] = useState(getCurrentSeason());
  const isDark = themeMode === 'dark';

  const guidance = getSeasonalGuidance(activeSeason, birthSeason, primaryElement, vulnerabilities);
  const seasonCfg = SEASON_CONFIG[activeSeason];

  return (
    <div style={{
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.4rem' }}>📅</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          Seasonal Qi Adjustment Guide
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '16px' }}>
        Adapt your practices throughout the year to maintain balance
      </p>

      {/* Season Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(SEASON_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setActiveSeason(key)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              background: activeSeason === key
                ? cfg.bgAccent
                : (isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)'),
              border: activeSeason === key
                ? `2px solid ${cfg.borderAccent}`
                : `1px solid ${isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)'}`,
              color: activeSeason === key
                ? cfg.color
                : (isDark ? '#94a3b8' : '#64748b'),
            }}
          >
            <span>{cfg.emoji}</span>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{
        background: seasonCfg.bgAccent,
        border: `1px solid ${seasonCfg.borderAccent}`,
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        <span style={{ fontSize: '1.5rem' }}>{seasonCfg.emoji}</span>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '15px', color: isDark ? '#f1f5f9' : '#0f172a', margin: '0 0 4px' }}>
            {guidance.status}
          </h3>
          <p style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', margin: 0 }}>
            {guidance.description}
          </p>
        </div>
      </div>

      {/* Intensity Bar */}
      <div style={{
        background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.9)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px',
      }}>
        <h4 style={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', margin: '0 0 8px', fontSize: '13px' }}>
          Adjustment Intensity
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, background: isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${guidance.intensityLevel}%`,
              height: '100%',
              borderRadius: '6px',
              background: guidance.intensityColor,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ fontWeight: 700, color: isDark ? '#e2e8f0' : '#334155', fontSize: '13px', minWidth: '35px' }}>
            {guidance.intensityLevel}%
          </span>
        </div>
        <p style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', marginTop: '6px' }}>
          {guidance.intensityNote}
        </p>
      </div>

      {/* Daily Protocol */}
      <div style={{
        border: `1px solid ${isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.2)'}`,
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '12px',
      }}>
        <h4 style={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', margin: '0 0 10px', fontSize: '13px' }}>
          Daily Protocol for {activeSeason.charAt(0).toUpperCase() + activeSeason.slice(1)}
        </h4>
        {guidance.protocol.map((item, idx) => (
          <div key={idx} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '5px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ color: seasonCfg.color }}>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Foods Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{
          background: isDark ? 'rgba(34, 197, 94, 0.06)' : 'rgba(34, 197, 94, 0.04)',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          borderRadius: '8px',
          padding: '12px',
        }}>
          <h5 style={{ fontWeight: 600, color: '#4ade80', margin: '0 0 8px', fontSize: '12px' }}>
            Eat More
          </h5>
          {guidance.foods.increase.map((food, i) => (
            <div key={i} style={{ fontSize: '11px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '3px' }}>
              • {food}
            </div>
          ))}
        </div>
        <div style={{
          background: isDark ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.04)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          borderRadius: '8px',
          padding: '12px',
        }}>
          <h5 style={{ fontWeight: 600, color: '#f87171', margin: '0 0 8px', fontSize: '12px' }}>
            Reduce
          </h5>
          {guidance.foods.reduce.map((food, i) => (
            <div key={i} style={{ fontSize: '11px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '3px' }}>
              • {food}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
