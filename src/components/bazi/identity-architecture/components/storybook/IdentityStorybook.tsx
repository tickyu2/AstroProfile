/**
 * IdentityStorybook — chapter sequencer that renders one chapter at a time
 */

import React, { useState, useMemo } from 'react';
import type { IdentityArchitecture, BaZiPillar, TensionItem } from '../../engine/identityTypes';
import { computeTensionVectors } from '../../engine/tensionVectors';
import { getDayMasterElement, destinyBeatFromElement } from '../../engine/destinyPulse';
import { getCurrentSeason, modulationFromSeason } from '../../engine/seasonalModulation';
import { ChapterNav, CHAPTERS } from './ChapterNav';
import { HeavenSelfChapter } from '../chapters/HeavenSelfChapter';
import { EarthSelfChapter } from '../chapters/EarthSelfChapter';
import { HumanSelfChapter } from '../chapters/HumanSelfChapter';
import { TensionMapChapter } from '../chapters/TensionMapChapter';
import { ContradictionStoryChapter } from '../chapters/ContradictionStoryChapter';
import { CathedralRing } from '../diagrams/CathedralRing';
import { ThreeRingCathedral } from '../diagrams/ThreeRingCathedral';
import { D3CathedralRing } from '../diagrams/D3CathedralRing';
import { D3TensionField } from '../diagrams/D3TensionField';
import { CoherenceTriangle } from '../diagrams/CoherenceTriangle';
import { DestinyPulse } from '../diagrams/DestinyPulse';
import { DestinyECG } from '../diagrams/DestinyECG';
import { TempleMode } from '../diagrams/TempleMode';
import { IdentityCodexPage } from '../codex/IdentityCodexPage';

import { ChapterShell } from '../chapters/ChapterShell';

interface Props {
  identity: IdentityArchitecture;
  pillars: BaZiPillar[];
}

export const IdentityStorybook: React.FC<Props> = ({ identity, pillars }) => {
  const [idx, setIdx] = useState(0);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [templeOpen, setTempleOpen] = useState(false);

  const allTensions: TensionItem[] = [
    ...identity.identityTension.elementalConflicts,
    ...identity.identityTension.roleConflicts,
    ...identity.identityTension.subconsciousConflicts,
  ];

  const tensionVectors = useMemo(() => computeTensionVectors(pillars), [pillars]);
  const dayMaster = getDayMasterElement(pillars);
  const season = getCurrentSeason();
  const mod = modulationFromSeason(season);
  const bpm = Math.round(destinyBeatFromElement(dayMaster) * mod.speedMultiplier);

  const go = (i: number) => {
    if (i >= 0 && i < CHAPTERS.length) setIdx(i);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ChapterNav currentIdx={idx} onNavigate={go} />

      {idx === 0 && <HeavenSelfChapter data={identity.heavenPersonality} />}
      {idx === 1 && <EarthSelfChapter data={identity.earthPersonality} />}
      {idx === 2 && <HumanSelfChapter data={identity.humanPersonality} />}

      {idx === 3 && (
        <TensionMapChapter
          data={identity.identityTension}
          alignmentScore={identity.alignmentScore}
          coherenceIndex={identity.internalCoherenceIndex}
          pillars={pillars}
          cathedralRing={
            <CathedralRing
              pillars={pillars}
              tensions={allTensions}
              coherenceIndex={identity.internalCoherenceIndex}
              selectedPillar={selectedPillar}
            />
          }
          coherenceTriangle={
            <CoherenceTriangle coherenceIndex={identity.internalCoherenceIndex} />
          }
        />
      )}

      {/* Chapter 4: Cathedral Map — 3-ring + interactive D3 + tension field */}
      {idx === 4 && (
        <ChapterShell
          title={'🏛️ Cathedral Map — The Three Rings'}
          subtitle={'Heaven (outer), Earth (middle), Human (inner) — four pillars at each layer.'}
          footer="The Cathedral Map reveals the sacred geometry of your three selves across all four pillars."
        >
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '20px',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                3-Ring Structure
              </div>
              <ThreeRingCathedral
                pillars={pillars}
                onSelectPillar={setSelectedPillar}
                selectedPillar={selectedPillar}
              />
              <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                Outer = Stem · Middle = Branch · Inner = Hidden Stem
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Interactive Ring (click · hover · drag)
              </div>
              <D3CathedralRing
                pillars={pillars}
                tensions={allTensions}
                coherenceIndex={identity.internalCoherenceIndex}
                severity={identity.tensionSeverity}
                onSelectPillar={setSelectedPillar}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Tension Vector Field
              </div>
              <D3TensionField
                vectors={tensionVectors}
                severity={identity.tensionSeverity}
              />
            </div>
          </div>
        </ChapterShell>
      )}

      {/* Chapter 5: Destiny Pulse — heartbeat + ECG + fog + audio */}
      {idx === 5 && (
        <ChapterShell
          title={`\u{1F49F} Destiny Pulse — ${dayMaster} Day Master`}
          subtitle={`Your chart beats at ${bpm} bpm. Severity drives amplitude, fog, and glow.`}
          footer="The Destiny Pulse is the heartbeat of your identity — a living rhythm synced to your Day Master element."
        >
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '24px',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <DestinyPulse
              pillars={pillars}
              severity={identity.tensionSeverity}
              selectedPillar={selectedPillar}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  How to read the pulse:
                </div>
                <div>{'•'} <b>Beat speed</b> reflects your Day Master element ({dayMaster})</div>
                <div>{'•'} <b>Amplitude</b> swells with internal conflict (severity: {Math.round(identity.tensionSeverity * 100)}%)</div>
                <div>{'•'} <b>Fog layers</b> breathe with the rhythm — inner (emotional) + outer (environmental)</div>
                <div>{'•'} <b>Color shift</b> oscillates around your element's base hue</div>
                <div>{'•'} <b>Season</b> modulates tempo ({mod.label}: {mod.speedMultiplier > 1 ? 'faster' : mod.speedMultiplier < 1 ? 'slower' : 'normal'})</div>
                <div>{'•'} Click a pillar in Cathedral Map to trigger <b>resonance surge</b></div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>
                Destiny ECG — Tension Waveform
              </div>
              <DestinyECG
                severity={identity.tensionSeverity}
                dayMaster={dayMaster}
                bpm={bpm}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button type="button" className="temple-enter-btn" onClick={() => setTempleOpen(true)}>
              🏛️ Enter Temple Mode
            </button>
          </div>
        </ChapterShell>
      )}

      {idx === 6 && <ContradictionStoryChapter narrative={identity.contradictionNarrative} />}

      {idx === 7 && (
        <IdentityCodexPage
          identity={identity}
          pillars={pillars}
        />
      )}

      {/* Temple Mode — full-screen ritual overlay */}
      {templeOpen && (
        <TempleMode
          identity={identity}
          pillars={pillars}
          onClose={() => setTempleOpen(false)}
        />
      )}
    </div>
  );
};
