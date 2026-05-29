/**
 * TempleMode — full-screen ritual environment
 *
 * A ceremonial overlay that transforms the entire screen into a temple:
 * - Depth-layer parallax (bg/mg/fg shift with mouse)
 * - Dimmed radial background with vignette
 * - Directional fog drift (seasonal wind)
 * - Elemental particle system (embers, petals, sparks, mist)
 * - Elemental sigil (awakens at high tension)
 * - Elemental flare bursts (on pillar click / gesture / storm)
 * - Centered enlarged DestinyPulse
 * - Orbiting pillar markers
 * - D3TensionField
 * - Pillar-synced DestinyECG waveform
 * - Layered ambient soundscape (Web Audio drones)
 * - Ritual gesture detection (circle, swipe, z-pattern)
 * - Real-time ritual script narration
 */

import React, { useState, useMemo, useRef } from 'react';
import type { IdentityArchitecture, BaZiPillar, TensionItem } from '../../engine/identityTypes';
import { computeTensionVectors } from '../../engine/tensionVectors';
import { getDayMasterElement, destinyBeatFromElement, stormIndex } from '../../engine/destinyPulse';
import { getCurrentSeason, modulationFromSeason } from '../../engine/seasonalModulation';
import { windVectorForSeason } from '../../engine/seasonalWind';
import { templeSoundLayers } from '../../engine/templeSoundscape';
import { ritualScript } from '../../engine/ritualScript';
import { useTempleSoundscape } from '../../hooks/useTempleSoundscape';
import { useRitualGesture } from '../../hooks/useRitualGesture';
import { useDepthParallax } from '../../hooks/useDepthParallax';
import { DestinyPulse } from './DestinyPulse';
import { DestinyECG } from './DestinyECG';
import { D3TensionField } from './D3TensionField';
import { ThreeRingCathedral } from './ThreeRingCathedral';
import { D3CathedralRing } from './D3CathedralRing';
import { PillarOrbit } from './PillarOrbit';
import { ElementParticles } from './ElementParticles';
import { ElementSigil } from './ElementSigil';
import { ElementFlare } from './ElementFlare';
import { RitualScriptOverlay } from './RitualScriptOverlay';
import { RitualGestureLayer } from './RitualGestureLayer';
import { ElementGateway } from './ElementGateway';
import { TempleHUD } from './TempleHUD';

interface Props {
  identity: IdentityArchitecture;
  pillars: BaZiPillar[];
  onClose: () => void;
}

export const TempleMode: React.FC<Props> = ({ identity, pillars, onClose }) => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Parallax refs
  const bgRef = useRef<HTMLDivElement>(null);
  const mgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  useDepthParallax({ bg: bgRef, mg: mgRef, fg: fgRef });

  // Engine computations
  const allTensions: TensionItem[] = [
    ...identity.identityTension.elementalConflicts,
    ...identity.identityTension.roleConflicts,
    ...identity.identityTension.subconsciousConflicts,
  ];
  const vectors = computeTensionVectors(pillars);
  const dayMaster = getDayMasterElement(pillars);
  const season = getCurrentSeason();
  const mod = modulationFromSeason(season);
  const bpm = Math.round(destinyBeatFromElement(dayMaster) * mod.speedMultiplier);
  const storm = stormIndex(identity.tensionSeverity);
  const wind = windVectorForSeason(season);

  // Resolve selected pillar's element for ECG sync
  const activeElement = useMemo(() => {
    if (!selectedPillar) return undefined;
    const found = pillars.find(p => p.name === selectedPillar);
    return found ? found.stem.element : undefined;
  }, [selectedPillar, pillars]);

  // Soundscape layers
  const soundLayers = useMemo(
    () => templeSoundLayers(dayMaster, season, storm),
    [dayMaster, season, storm],
  );
  useTempleSoundscape(soundLayers, soundEnabled);

  // Ritual gesture tracking
  const { gesture, handlers: gestureHandlers } = useRitualGesture();

  // Flare trigger — pillar selection or z-gesture
  const flareKey = useMemo(() => {
    if (gesture === 'z-gesture') return `z-${Date.now()}`;
    if (selectedPillar) return `p-${selectedPillar}`;
    return null;
  }, [selectedPillar, gesture]);

  // Ritual narration text
  const scriptText = ritualScript({
    dayMaster,
    season,
    severity: identity.tensionSeverity,
    selectedPillar,
    storm,
    gesture,
  });

  return (
    <div className="temple-mode active" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      {/* Depth parallax layers */}
      <div ref={bgRef} className="temple-parallax-layer temple-bg-layer" />
      <div ref={mgRef} className="temple-parallax-layer temple-mg-layer" />
      <div ref={fgRef} className="temple-parallax-layer temple-fg-layer" />

      {/* Vignette overlay */}
      <div className="temple-vignette" />

      {/* Fog drift overlay with seasonal wind direction */}
      <div
        className="temple-fog wind-active"
        style={{
          '--wind-x': wind.x,
          '--wind-y': wind.y,
        } as React.CSSProperties}
      />

      {/* Elemental particle system */}
      <ElementParticles element={dayMaster} count={24} />

      {/* Elemental sigil — awakens at high tension */}
      <ElementSigil element={dayMaster} severity={identity.tensionSeverity} />

      {/* Elemental flare — bursts on pillar click or z-gesture */}
      <ElementFlare element={activeElement || dayMaster} trigger={flareKey} />

      {/* Elemental gateway — portal opens when pillar is selected */}
      <ElementGateway
        element={activeElement || dayMaster}
        active={!!selectedPillar}
        pillarName={selectedPillar}
      />

      {/* Ritual gesture capture layer */}
      <RitualGestureLayer handlers={gestureHandlers} />

      {/* Soundscape toggle */}
      <button
        type="button"
        className={`temple-sound-toggle${soundEnabled ? ' active' : ''}`}
        onClick={() => setSoundEnabled(!soundEnabled)}
      >
        {soundEnabled ? '\u{1F50A} Mute Soundscape' : '\u{1F508} Soundscape'}
      </button>

      {/* Close button */}
      <button
        type="button"
        className="temple-close"
        onClick={onClose}
      >
        {'\u2715'} Exit Temple
      </button>

      {/* Temple title */}
      <div className="temple-title">
        {'\u{1F3DB}\uFE0F'} Temple of Identity
      </div>

      {/* HUD — metaphysical state indicators */}
      <TempleHUD
        dayMaster={dayMaster}
        season={season}
        severity={identity.tensionSeverity}
        storm={storm}
        bpm={bpm}
      />

      {/* Orbiting pillar markers */}
      <PillarOrbit pillars={pillars} onSelectPillar={setSelectedPillar} />

      {/* Main content grid */}
      <div className="temple-content">
        {/* Left: Cathedral Ring */}
        <div className="temple-section">
          <div className="temple-section-label">Sacred Geometry</div>
          <ThreeRingCathedral
            pillars={pillars}
            onSelectPillar={setSelectedPillar}
            selectedPillar={selectedPillar}
          />
        </div>

        {/* Center: Destiny Pulse (enlarged) */}
        <div className="temple-center">
          <DestinyPulse
            pillars={pillars}
            severity={identity.tensionSeverity}
            selectedPillar={selectedPillar}
          />
        </div>

        {/* Right: Tension Field */}
        <div className="temple-section">
          <div className="temple-section-label">Tension Vectors</div>
          <D3TensionField
            vectors={vectors}
            severity={identity.tensionSeverity}
          />
        </div>
      </div>

      {/* Bottom: ECG waveform — pillar-synced color */}
      <div className="temple-ecg">
        <div className="temple-section-label" style={{ marginBottom: '4px' }}>
          Destiny ECG — Tension Waveform
          {activeElement && (
            <span style={{ opacity: 0.7, marginLeft: '8px' }}>
              ({activeElement} sync)
            </span>
          )}
        </div>
        <DestinyECG
          severity={identity.tensionSeverity}
          dayMaster={dayMaster}
          bpm={bpm}
          activeElement={activeElement}
        />
      </div>

      {/* Interactive cathedral ring (hover-reveal) */}
      <div className="temple-interactive-ring">
        <D3CathedralRing
          pillars={pillars}
          tensions={allTensions}
          coherenceIndex={identity.internalCoherenceIndex}
          severity={identity.tensionSeverity}
          onSelectPillar={setSelectedPillar}
        />
      </div>

      {/* Ritual script narration */}
      <RitualScriptOverlay text={scriptText} />

      {/* Scores */}
      <div className="temple-scores">
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
    </div>
  );
};
