/**
 * BaZi Chart Summary Bar
 *
 * Compact horizontal display of the user's BaZi chart at the top of the chat page.
 * Shows: profile name, Day Master, 4 pillars (compact), dominant element, Shen Sha stars.
 */

import React from 'react';
import { STEM_SEGMENTS, BRANCH_SEGMENTS, ELEMENT_COLORS } from '../../utils/baziWheels';
import type { ShenShaResult } from '../../utils/shensha/shenshaEngine';

interface Props {
  profileName: string;
  chart: any;
  shensha: ShenShaResult | null;
}

const BaZiChartSummaryBar: React.FC<Props> = ({ profileName, chart, shensha }) => {
  if (!chart?.pillars) return null;

  const dmIdx = chart.pillars[2]?.stem?.index ?? 0;
  const dmStem = STEM_SEGMENTS[dmIdx];
  const dmEl = chart.dayMaster?.element || 'Water';
  const dmColor = ELEMENT_COLORS[dmEl] || '#64748b';
  const dominant = chart.elements?.dominant || dmEl;
  const dominantColor = ELEMENT_COLORS[dominant] || '#64748b';

  // Compact 4 pillars: 甲子 乙丑 丙寅 丁卯
  const pillarPairs = chart.pillars.map((p: any) => {
    const s = STEM_SEGMENTS[p.stem?.index ?? 0];
    const b = BRANCH_SEGMENTS[p.branch?.index ?? 0];
    return { stem: s?.char || '?', branch: b?.char || '?', sEl: s?.element, bAnimal: b?.animal };
  });

  // Shen Sha relationship stars
  const relStars = shensha?.byCategory?.relationship || [];
  const otherStars = shensha ? shensha.hits.filter(h => h.category !== 'relationship').slice(0, 4) : [];

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      fontSize: '11px',
    }}>
      {/* Profile + Day Master */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '13px' }}>{profileName}</span>
        <span style={{
          background: `${dmColor}20`,
          border: `1px solid ${dmColor}50`,
          borderRadius: '6px',
          padding: '2px 8px',
          color: dmColor,
          fontWeight: 700,
          fontSize: '12px',
        }}>
          {dmStem?.char} {dmStem?.polarity} {dmEl}
        </span>
      </div>

      {/* Separator */}
      <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

      {/* Four Pillars compact */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {['Year', 'Month', 'Day', 'Hour'].map((label, i) => {
          const pp = pillarPairs[i];
          const sColor = ELEMENT_COLORS[pp.sEl] || '#94a3b8';
          return (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '1px' }}>{label}</div>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: sColor,
                background: `${sColor}10`,
                borderRadius: '4px',
                padding: '1px 4px',
              }}>
                {pp.stem}{pp.branch}
              </div>
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

      {/* Dominant element */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '9px', color: '#64748b' }}>Dominant</div>
        <div style={{ color: dominantColor, fontWeight: 700 }}>{dominant}</div>
      </div>

      {/* Shen Sha Stars */}
      {shensha && shensha.totalHits > 0 && (
        <>
          <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {relStars.map(h => (
              <span key={h.key + h.pillar} title={`${h.label} (${h.han}) — ${h.definition.description}`} style={{
                background: 'rgba(244, 114, 182, 0.12)',
                border: '1px solid rgba(244, 114, 182, 0.3)',
                borderRadius: '4px',
                padding: '1px 6px',
                color: '#f472b6',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'help',
              }}>
                {h.han}
              </span>
            ))}
            {otherStars.map(h => (
              <span key={h.key + h.pillar} title={`${h.label} (${h.han}) — ${h.definition.description}`} style={{
                background: 'rgba(148, 163, 184, 0.08)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '4px',
                padding: '1px 6px',
                color: '#94a3b8',
                fontSize: '10px',
                cursor: 'help',
              }}>
                {h.han}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BaZiChartSummaryBar;
