/**
 * Relationship Destiny Map
 * ========================
 *
 * The Cathedral Rosetta - A radial mandala of the bond's complete destiny
 *
 * Structure:
 * - OUTER RING: Timeline (Seasons + Fate Windows)
 * - MIDDLE RING: Evolution (Archetype shifts across Saturn cycles)
 * - INNER RING: Soul Map (Identity, Emotional Body, Shadow, Contract)
 * - CORE: Healing Engine (Luna-guided repair)
 *
 * Each ring rotates, pulses, or highlights when selected.
 */

import React, { useState, useEffect, useRef } from 'react';
import './RelationshipDestinyPanel.css';

// Ring configuration
const RING_CONFIG = {
  core: {
    key: 'healing',
    label: 'Healing',
    icon: '\u2661',
    color: 'var(--healing-color, #27ae60)',
    description: 'Luna-Guided Repair'
  },
  inner: {
    key: 'soul',
    label: 'Soul Map',
    icon: '\u2726',
    color: 'var(--soul-color, #9b59b6)',
    description: 'Identity & Shadow'
  },
  middle: {
    key: 'evolution',
    label: 'Evolution',
    icon: '\u221E',
    color: 'var(--evolution-color, #e67e22)',
    description: 'Saturn Cycle Journey'
  },
  outer: {
    key: 'timeline',
    label: 'Timeline',
    icon: '\u29D6',
    color: 'var(--timeline-color, #3498db)',
    description: 'Seasons & Transits'
  }
};

/**
 * Ring Segment Component
 */
function RingSegment({ segment, isActive, onClick }) {
  return (
    <div
      className={`ring-segment ${isActive ? 'segment-active' : ''}`}
      onClick={onClick}
      style={{ '--segment-color': segment.color }}
    >
      <span className="segment-label">{segment.label}</span>
    </div>
  );
}

/**
 * Core Content Panel - Healing
 */
function CoreContent({ healing }) {
  if (!healing) return <p className="empty-state">Healing data not available</p>;

  return (
    <div className="layer-content healing-content">
      <h3>Luna-Guided Healing</h3>

      {healing.woundAnalysis?.primaryWounds?.[0] && (
        <div className="content-section">
          <h4>Primary Wound</h4>
          <p className="wound-name">{healing.woundAnalysis.primaryWounds[0].wound}</p>
          <p className="wound-healing">{healing.woundAnalysis.primaryWounds[0].lunaHealing}</p>
        </div>
      )}

      {healing.emergencyToolkit?.inConflict && (
        <div className="content-section">
          <h4>Quick Help</h4>
          <ul className="quick-tips">
            {healing.emergencyToolkit.inConflict.slice(0, 3).map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {healing.healingPrescription?.dailyPractices && (
        <div className="content-section">
          <h4>Daily Practice</h4>
          <p>{healing.healingPrescription.dailyPractices[0]}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Inner Ring Content - Soul Map
 */
function InnerRingContent({ soulMap, sections }) {
  const identity = sections?.identity || soulMap?.identity;
  const shadow = soulMap?.shadow;

  return (
    <div className="layer-content soul-content">
      <h3>Soul Map</h3>

      {identity && (
        <div className="content-section">
          <h4>Relationship Identity</h4>
          {identity.compositeSun && (
            <p><strong>Sun:</strong> {identity.compositeSun.sign}</p>
          )}
          {identity.compositeMoon && (
            <p><strong>Moon:</strong> {identity.compositeMoon.sign}</p>
          )}
        </div>
      )}

      {shadow?.collectiveShadow && (
        <div className="content-section">
          <h4>Shadow</h4>
          <p>{shadow.collectiveShadow.description}</p>
        </div>
      )}

      {soulMap?.contract?.soulLessons && (
        <div className="content-section">
          <h4>Soul Lessons</h4>
          <ul>
            {soulMap.contract.soulLessons.slice(0, 2).map((lesson, i) => (
              <li key={i}>{lesson}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Middle Ring Content - Evolution
 */
function MiddleRingContent({ evolution }) {
  if (!evolution) return <p className="empty-state">Evolution data not available</p>;

  const { currentStage, mythicArc, crisisOpportunity } = evolution;

  return (
    <div className="layer-content evolution-content">
      <h3>Evolution Journey</h3>

      {currentStage && (
        <div className="content-section">
          <h4>Current Stage</h4>
          <p className="stage-name">{currentStage.title}</p>
          <p className="stage-archetype">{currentStage.archetype}</p>
          <p className="stage-task">{currentStage.psychologicalTask}</p>
        </div>
      )}

      {mythicArc && (
        <div className="content-section">
          <h4>Mythic Arc</h4>
          <p className="arc-name">{mythicArc.name}</p>
          {mythicArc.currentPhase && (
            <p className="arc-phase">Current: {mythicArc.currentPhase}</p>
          )}
        </div>
      )}

      {crisisOpportunity?.isActive && (
        <div className="content-section crisis">
          <h4>Crisis Point Active</h4>
          <p>{crisisOpportunity.crisis}</p>
          <p className="opportunity">{crisisOpportunity.opportunity}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Outer Ring Content - Timeline
 */
function OuterRingContent({ timeline }) {
  if (!timeline) return <p className="empty-state">Timeline data not available</p>;

  const { currentSeason, activeFateWindows, currentTransits } = timeline;

  return (
    <div className="layer-content timeline-content">
      <h3>Timeline</h3>

      {currentSeason && (
        <div className="content-section">
          <h4>Current Season</h4>
          <p className="season-type">{currentSeason.type} Season</p>
          <p className="season-theme">{currentSeason.theme}</p>
        </div>
      )}

      {activeFateWindows && activeFateWindows.length > 0 && (
        <div className="content-section">
          <h4>Active Fate Windows</h4>
          {activeFateWindows.slice(0, 2).map((window, i) => (
            <div key={i} className="fate-window">
              <span>{window.name}</span>
            </div>
          ))}
        </div>
      )}

      {currentTransits && currentTransits.length > 0 && (
        <div className="content-section">
          <h4>Active Transits</h4>
          {currentTransits.slice(0, 2).map((transit, i) => (
            <div key={i} className="transit">
              <span>{transit.transitPlanet} to {transit.natalPoint}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Main Map Component
 */
export function RelationshipDestinyMap({ report }) {
  const [activeLayer, setActiveLayer] = useState('soul');
  const [isAnimating, setIsAnimating] = useState(false);
  const mapRef = useRef(null);

  // Extract data from report
  const {
    executiveSummary,
    sections,
    rawAnalysis,
    quickAccess,
    lunaWisdom
  } = report || {};

  const soulMap = rawAnalysis?.soulMap;
  const timeline = rawAnalysis?.timeline;
  const evolution = rawAnalysis?.evolution;
  const healing = rawAnalysis?.healing;

  // Handle layer selection
  const handleLayerSelect = (layer) => {
    if (layer === activeLayer || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveLayer(layer);
      setIsAnimating(false);
    }, 400);
  };

  // Render active content
  const renderActiveContent = () => {
    switch (activeLayer) {
      case 'healing':
        return <CoreContent healing={healing} />;
      case 'soul':
        return <InnerRingContent soulMap={soulMap} sections={sections} />;
      case 'evolution':
        return <MiddleRingContent evolution={evolution} />;
      case 'timeline':
        return <OuterRingContent timeline={timeline} />;
      default:
        return null;
    }
  };

  return (
    <div className="destiny-map-container" ref={mapRef}>
      {/* MAP HEADER */}
      <header className="map-header">
        <h2 className="map-title">Relationship Destiny Map</h2>
        {executiveSummary?.coreIdentity && (
          <p className="map-archetype">{executiveSummary.coreIdentity.archetype}</p>
        )}
      </header>

      {/* RADIAL MAP */}
      <div className="destiny-map">
        {/* OUTER RING - TIMELINE */}
        <div
          className={`destiny-ring outer-ring ${activeLayer === 'timeline' ? 'ring-active' : ''}`}
          onClick={() => handleLayerSelect('timeline')}
          style={{ '--ring-color': RING_CONFIG.outer.color }}
        >
          <div className="ring-label">
            <span className="ring-icon">{RING_CONFIG.outer.icon}</span>
            <span className="ring-name">{RING_CONFIG.outer.label}</span>
          </div>

          {/* Timeline segments - fate windows and seasons */}
          <div className="ring-segments">
            {timeline?.activeFateWindows?.slice(0, 6).map((window, i) => (
              <div
                key={i}
                className="ring-segment"
                style={{ '--segment-angle': `${i * 60}deg` }}
              >
                <span className="segment-dot" />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE RING - EVOLUTION */}
        <div
          className={`destiny-ring middle-ring ${activeLayer === 'evolution' ? 'ring-active' : ''}`}
          onClick={() => handleLayerSelect('evolution')}
          style={{ '--ring-color': RING_CONFIG.middle.color }}
        >
          <div className="ring-label">
            <span className="ring-icon">{RING_CONFIG.middle.icon}</span>
            <span className="ring-name">{RING_CONFIG.middle.label}</span>
          </div>

          {/* Evolution stage markers */}
          <div className="ring-segments">
            {evolution?.evolutionTimeline?.map((stage, i) => (
              <div
                key={i}
                className={`ring-segment ${stage.isCurrent ? 'current' : ''} ${stage.isPast ? 'past' : ''}`}
                style={{ '--segment-angle': `${i * (360 / 7)}deg` }}
              >
                <span className="segment-dot" />
              </div>
            ))}
          </div>
        </div>

        {/* INNER RING - SOUL MAP */}
        <div
          className={`destiny-ring inner-ring ${activeLayer === 'soul' ? 'ring-active' : ''}`}
          onClick={() => handleLayerSelect('soul')}
          style={{ '--ring-color': RING_CONFIG.inner.color }}
        >
          <div className="ring-label">
            <span className="ring-icon">{RING_CONFIG.inner.icon}</span>
            <span className="ring-name">{RING_CONFIG.inner.label}</span>
          </div>

          {/* Soul map quadrants */}
          <div className="ring-segments quadrants">
            <div className="ring-segment" style={{ '--segment-angle': '0deg' }}>
              <span className="segment-label">Identity</span>
            </div>
            <div className="ring-segment" style={{ '--segment-angle': '90deg' }}>
              <span className="segment-label">Shadow</span>
            </div>
            <div className="ring-segment" style={{ '--segment-angle': '180deg' }}>
              <span className="segment-label">Contract</span>
            </div>
            <div className="ring-segment" style={{ '--segment-angle': '270deg' }}>
              <span className="segment-label">Fate</span>
            </div>
          </div>
        </div>

        {/* CORE - HEALING */}
        <div
          className={`destiny-core ${activeLayer === 'healing' ? 'active-core' : ''}`}
          onClick={() => handleLayerSelect('healing')}
          style={{ '--core-color': RING_CONFIG.core.color }}
        >
          <span className="core-icon">{RING_CONFIG.core.icon}</span>
          <span className="core-label">{RING_CONFIG.core.label}</span>
        </div>
      </div>

      {/* CONTENT PANEL */}
      <div className={`map-content-panel ${isAnimating ? 'animating' : ''}`}>
        <div className="content-header">
          <span className="content-icon">{RING_CONFIG[activeLayer === 'healing' ? 'core' : activeLayer === 'soul' ? 'inner' : activeLayer === 'evolution' ? 'middle' : 'outer']?.icon}</span>
          <h3>{RING_CONFIG[activeLayer === 'healing' ? 'core' : activeLayer === 'soul' ? 'inner' : activeLayer === 'evolution' ? 'middle' : 'outer']?.label}</h3>
          <p className="content-description">
            {RING_CONFIG[activeLayer === 'healing' ? 'core' : activeLayer === 'soul' ? 'inner' : activeLayer === 'evolution' ? 'middle' : 'outer']?.description}
          </p>
        </div>
        <div className="content-body">
          {renderActiveContent()}
        </div>
      </div>

      {/* LUNA WISDOM */}
      {lunaWisdom?.closingBlessing && (
        <div className="map-blessing">
          <span className="blessing-icon">\u263D</span>
          <p>{lunaWisdom.closingBlessing}</p>
        </div>
      )}

      {/* LEGEND */}
      <div className="map-legend">
        <div className="legend-item" onClick={() => handleLayerSelect('timeline')}>
          <span className="legend-color" style={{ background: RING_CONFIG.outer.color }} />
          <span>Timeline</span>
        </div>
        <div className="legend-item" onClick={() => handleLayerSelect('evolution')}>
          <span className="legend-color" style={{ background: RING_CONFIG.middle.color }} />
          <span>Evolution</span>
        </div>
        <div className="legend-item" onClick={() => handleLayerSelect('soul')}>
          <span className="legend-color" style={{ background: RING_CONFIG.inner.color }} />
          <span>Soul Map</span>
        </div>
        <div className="legend-item" onClick={() => handleLayerSelect('healing')}>
          <span className="legend-color" style={{ background: RING_CONFIG.core.color }} />
          <span>Healing</span>
        </div>
      </div>
    </div>
  );
}

export default RelationshipDestinyMap;
