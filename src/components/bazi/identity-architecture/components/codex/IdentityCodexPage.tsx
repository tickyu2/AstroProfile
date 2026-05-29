/**
 * IdentityCodexPage — print-friendly / PDF-style ceremonial document
 */

import React, { useCallback } from 'react';
import type { IdentityArchitecture, BaZiPillar } from '../../engine/identityTypes';
import { ELEMENT_ICONS } from '../../utils/elementTheme';
import { ThreeRingCathedral } from '../diagrams/ThreeRingCathedral';
import { CoherenceTriangle } from '../diagrams/CoherenceTriangle';
import { CodexSelfCard, CodexTensionList } from './CodexSection';

interface Props {
  identity: IdentityArchitecture;
  pillars: BaZiPillar[];
}

export const IdentityCodexPage: React.FC<Props> = ({ identity, pillars }) => {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="ia-codex">
      <div className="ia-codex-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.03em' }}>
              Identity Codex — Heaven · Earth · Human
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              A structural and narrative reading of your BaZi identity architecture.
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="ia-no-print"
            style={{
              padding: '6px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#a78bfa', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Print / PDF
          </button>
        </div>
      </div>

      <div className="ia-codex-body">
        {/* Left: narrative + three selves */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contradiction story */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
              Contradiction Story
            </div>
            <div style={{
              fontSize: '12px', lineHeight: 1.8, color: '#cbd5e1', whiteSpace: 'pre-line',
            }}>
              {identity.contradictionNarrative}
            </div>
          </div>

          {/* Three selves grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <CodexSelfCard
              title="Heaven Self"
              icon={ELEMENT_ICONS[identity.heavenPersonality.dominant]}
              element={identity.heavenPersonality.dominant}
              lines={[
                identity.heavenPersonality.cognitiveStyle,
                identity.heavenPersonality.worldview,
              ]}
            />
            <CodexSelfCard
              title="Earth Self"
              icon={ELEMENT_ICONS[identity.earthPersonality.dominant]}
              element={identity.earthPersonality.dominant}
              lines={[
                identity.earthPersonality.instincts,
                identity.earthPersonality.stressBehaviors,
              ]}
            />
            <CodexSelfCard
              title="Human Self"
              icon={ELEMENT_ICONS[identity.humanPersonality.dominant]}
              element={identity.humanPersonality.dominant}
              lines={[
                identity.humanPersonality.emotionalNeeds,
                identity.humanPersonality.shadowDesires,
              ]}
            />
          </div>

          {/* Tensions summary */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
              Key Tensions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <CodexTensionList title="Elemental" items={identity.identityTension.elementalConflicts} />
              <CodexTensionList title="Role" items={identity.identityTension.roleConflicts} />
              <CodexTensionList title="Subconscious" items={identity.identityTension.subconsciousConflicts} />
            </div>
          </div>
        </div>

        {/* Right sidebar: scores + 3-ring cathedral */}
        <div className="ia-codex-sidebar" style={{
          display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0' }}>
                {identity.alignmentScore}/12
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Alignment</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0' }}>
                {identity.internalCoherenceIndex}%
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Coherence</div>
            </div>
          </div>
          <ThreeRingCathedral pillars={pillars} />
          <CoherenceTriangle coherenceIndex={identity.internalCoherenceIndex} />
        </div>
      </div>

      <div className="ia-codex-footer">
        Identity Codex — Heaven–Earth–Human Architecture · Generated from BaZi Chart
      </div>
    </div>
  );
};
