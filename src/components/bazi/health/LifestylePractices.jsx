import React from 'react';
import { ORGAN_SYSTEMS } from '../../../data/organSystems';

function compileLifestylePractices(healthPatterns, primaryElement) {
  const practices = {
    exercise: [],
    sleep: [],
    mindSpirit: [],
    environment: []
  };

  // Exercise from deficiency practices
  healthPatterns.deficiency.forEach(({ element }) => {
    const org = ORGAN_SYSTEMS[element];
    if (!org) return;
    (org.deficiency.recommendations.practices || []).forEach(practice => {
      if (/exercise|yoga|stretch|tai chi|cardio|qigong/i.test(practice)) {
        practices.exercise.push(practice);
      }
    });
  });

  // Add general exercise if empty
  if (practices.exercise.length === 0) {
    practices.exercise.push(
      'Regular moderate exercise (30 min/day)',
      'Tai Chi or Qigong for Qi circulation',
      'Walking in nature'
    );
  }

  // Sleep
  practices.sleep.push(
    'Sleep before 11pm (Liver regenerates 1-3am)',
    'Avoid screens 1 hour before bed',
    'Keep bedroom cool and dark'
  );
  healthPatterns.deficiency.forEach(({ element }) => {
    if (element === 'wood') practices.sleep.push('Aim for 7-8 hours to nourish Liver Blood');
    if (element === 'water') practices.sleep.push('Rest deeply to rebuild Kidney essence');
  });

  // Mind/Spirit from excess
  healthPatterns.excess.forEach(({ element }) => {
    if (element === 'wood') {
      practices.mindSpirit.push('Practice forgiveness and letting go', 'Creative expression (art, music, writing)', 'Anger management techniques');
    }
    if (element === 'fire') {
      practices.mindSpirit.push('Meditation for calming the mind', 'Reduce overstimulation', 'Cultivate stillness and quiet');
    }
    if (element === 'earth') {
      practices.mindSpirit.push('Limit overthinking and worry', 'Simplify daily routine', 'Practice decision-making');
    }
  });

  // Mind/Spirit from deficiency
  healthPatterns.deficiency.forEach(({ element }) => {
    if (element === 'fire') {
      practices.mindSpirit.push('Gratitude journaling', 'Loving-kindness meditation', 'Pursue joyful activities');
    }
    if (element === 'metal') {
      practices.mindSpirit.push('Grief processing work', 'Boundary-setting practice', 'Letting go rituals');
    }
    if (element === 'water') {
      practices.mindSpirit.push('Face fears gradually', 'Build willpower through discipline', 'Courage-building exercises');
    }
  });

  if (practices.mindSpirit.length === 0) {
    practices.mindSpirit.push('Daily meditation or mindfulness (10 min)', 'Gratitude practice', 'Journaling for self-reflection');
  }

  // Environment
  const primaryOrgan = ORGAN_SYSTEMS[primaryElement];
  if (primaryOrgan?.climate) {
    practices.environment.push(`Protect from excess ${primaryOrgan.climate.toLowerCase()}`);
  }
  practices.environment.push(
    'Fresh air circulation daily',
    'Natural light exposure (morning sun)',
    'Minimize EMF exposure before sleep',
    'Optimal temperature: moderate, avoid extremes'
  );

  return practices;
}

const CATEGORY_CONFIG = {
  exercise: { emoji: '\u{1F3C3}', title: 'Exercise & Movement', accent: '#4ade80', bg: 'rgba(34, 197, 94, 0.06)', border: 'rgba(34, 197, 94, 0.15)' },
  sleep: { emoji: '\u{1F319}', title: 'Sleep & Rest', accent: '#818cf8', bg: 'rgba(129, 140, 248, 0.06)', border: 'rgba(129, 140, 248, 0.15)' },
  mindSpirit: { emoji: '\u{1F9E0}', title: 'Mind & Spirit', accent: '#c084fc', bg: 'rgba(192, 132, 252, 0.06)', border: 'rgba(192, 132, 252, 0.15)' },
  environment: { emoji: '\u2600\uFE0F', title: 'Environment', accent: '#fbbf24', bg: 'rgba(251, 191, 36, 0.06)', border: 'rgba(251, 191, 36, 0.15)' },
};

export default function LifestylePractices({ healthPatterns, primaryElement, themeMode = 'dark' }) {
  const isDark = themeMode === 'dark';
  const practices = compileLifestylePractices(healthPatterns, primaryElement);

  return (
    <div style={{
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.4rem' }}>{'\u{1F4AA}'}</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          Lifestyle & Qi Practices
        </h2>
      </div>
      <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '16px' }}>
        Daily practices to support your constitutional balance and overall wellness
      </p>

      {/* Practice Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {Object.entries(practices).map(([key, items]) => {
          if (items.length === 0) return null;
          const cfg = CATEGORY_CONFIG[key];
          return (
            <div key={key} style={{
              border: `1px solid ${cfg.border}`,
              borderRadius: '10px',
              padding: '14px',
              background: isDark ? cfg.bg : cfg.bg,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{cfg.emoji}</span>
                <h3 style={{ fontWeight: 600, color: cfg.accent, margin: 0, fontSize: '14px' }}>{cfg.title}</h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {items.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '5px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: cfg.accent, marginTop: '1px' }}>{'\u25B8'}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Universal Principles */}
      <div style={{
        background: isDark ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(139, 92, 246, 0.06))' : 'linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(139, 92, 246, 0.04))',
        borderRadius: '10px',
        padding: '16px',
        border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'}`,
      }}>
        <h3 style={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', marginBottom: '10px', fontSize: '13px' }}>
          Universal TCM Wellness Principles
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            'Eat regular meals at consistent times',
            'Chew food thoroughly, eat mindfully',
            'Avoid extreme temperatures in food/drink',
            'Balance work and rest throughout day',
            'Spend time in nature regularly',
            'Cultivate social connections'
          ].map((principle, i) => (
            <div key={i} style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: '#60a5fa', marginTop: '1px' }}>{'\u2022'}</span>
              <span>{principle}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
