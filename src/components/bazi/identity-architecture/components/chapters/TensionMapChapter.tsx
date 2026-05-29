import React from 'react';
import type { IdentityTension, TensionItem, BaZiPillar } from '../../engine/identityTypes';
import { ChapterShell } from './ChapterShell';

interface Props {
  data: IdentityTension;
  alignmentScore: number;
  coherenceIndex: number;
  pillars: BaZiPillar[];
  cathedralRing: React.ReactNode;
  coherenceTriangle: React.ReactNode;
}

const TensionColumn: React.FC<{ title: string; items: TensionItem[]; fallback: string }> = ({
  title, items, fallback,
}) => (
  <div>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>{title}</div>
    {items.length === 0 ? (
      <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>{fallback}</div>
    ) : (
      <ul style={{ margin: 0, paddingLeft: '14px', listStyleType: 'disc' }}>
        {items.map((t, i) => (
          <li key={i} style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '4px' }}>
            {t.text}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const TensionMapChapter: React.FC<Props> = ({
  data, alignmentScore, coherenceIndex, cathedralRing, coherenceTriangle,
}) => (
  <ChapterShell
    title={'⚡ Tension Map — Where the Selves Disagree'}
    subtitle="Elemental conflicts, role contradictions, subconscious friction."
    footer="The Tension Map shows the fault lines where your inner world reshapes itself."
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      {cathedralRing}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#e2e8f0' }}>{alignmentScore}/12</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Alignment Score</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#e2e8f0' }}>{coherenceIndex}%</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Internal Coherence</div>
          </div>
        </div>
        {coherenceTriangle}
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
      <TensionColumn title="Elemental Conflicts" items={data.elementalConflicts} fallback="No major elemental conflicts detected." />
      <TensionColumn title="Role Conflicts" items={data.roleConflicts} fallback="Roles are mostly aligned." />
      <TensionColumn title="Subconscious Conflicts" items={data.subconsciousConflicts} fallback="Conscious and subconscious largely in sync." />
    </div>
  </ChapterShell>
);
