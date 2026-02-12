/**
 * AncestralChamber.jsx
 *
 * Unified container orchestrating the entire ancestral journey:
 * Constellation -> Ritual -> Story Dashboard -> Initiation Ceremony -> Return
 *
 * Part of the Cathedral UI system for GENESIS OS Soul Discovery Engine.
 */

import React, { useState, useMemo, useCallback } from 'react';
// Chamber Components
import GenerationalConstellation from './GenerationalConstellation';
import AncestralHealingRitual from './AncestralHealingRitual';
import GenerationalStoryDashboard from './GenerationalStoryDashboard';
import PilgrimInitiationCeremony from './PilgrimInitiationCeremony';

// ============================================================================
// PERSONA VOICE ENGINE
// ============================================================================

const PERSONA_VOICES = {
  mentor: {
    constellation: "Let's look gently at how your lineage arranges itself around you.",
    ritual: "Stay with this pattern; you're not here to blame, but to understand and choose.",
    story: "Here is how the story has moved through generations to arrive at you.",
    initiation: "You're ready to stand at the threshold and receive what your lineage has been trying to say.",
    complete: "You've done meaningful work here. Carry this wisdom forward.",
  },
  oracle: {
    constellation: "The stars of your lineage gather in a familiar pattern.",
    ritual: "This is the knot in the thread; your presence is the hand that can loosen it.",
    story: "The myth of your family moves in cycles; you are the turning point.",
    initiation: "The gate opens when you agree to see and be seen by those who came before.",
    complete: "What was hidden is now revealed. The pattern shifts.",
  },
  companion: {
    constellation: "Let's walk through your lineage map together, one node at a time.",
    ritual: "You don't have to fix everything today—just meet this one pattern honestly.",
    story: "Here's how the story has unfolded so far, and where you're standing in it.",
    initiation: "I'll stay with you as you step into this ceremony; you're not doing this alone.",
    complete: "We've walked this path together. You did beautifully.",
  },
  mirror: {
    constellation: "Notice which nodes you feel drawn to, and which you avoid.",
    ritual: "Watch what arises in you as you sit with this pattern.",
    story: "See how your own choices echo or diverge from these generational arcs.",
    initiation: "This ceremony reflects back the way you already carry your lineage inside you.",
    complete: "Notice how you feel different now. That's the change you've made.",
  },
};

function getPersonaVoice(role, stage) {
  return PERSONA_VOICES[role]?.[stage] || PERSONA_VOICES.mentor[stage];
}

// ============================================================================
// ANCESTRAL PILGRIM MAP COMPONENT
// ============================================================================

const AncestralPilgrimMap = ({ currentStage }) => {
  const stages = [
    { id: 'constellation', label: 'Constellation' },
    { id: 'ritual', label: 'Ritual' },
    { id: 'story', label: 'Story' },
    { id: 'initiation', label: 'Initiation' },
    { id: 'complete', label: 'Return' },
  ];

  const mapStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    step: (isActive, isPast) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      opacity: isActive ? 1 : isPast ? 0.7 : 0.4,
      transition: 'opacity 0.3s ease',
    }),
    marker: (isActive, isPast) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: isActive
        ? '#ffd780'
        : isPast
          ? '#a78bfa'
          : 'rgba(255, 255, 255, 0.2)',
      boxShadow: isActive ? '0 0 12px rgba(255, 215, 128, 0.7)' : 'none',
      transition: 'all 0.3s ease',
    }),
    label: {
      fontSize: '12px',
      color: '#e2e8f0',
      fontWeight: '500',
    },
    connector: (isPast) => ({
      width: '24px',
      height: '2px',
      background: isPast
        ? 'linear-gradient(90deg, #a78bfa, #a78bfa80)'
        : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1px',
    }),
  };

  const stageIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <nav style={mapStyles.container}>
      {stages.map((stage, index) => {
        const isActive = stage.id === currentStage;
        const isPast = index < stageIndex;

        return (
          <React.Fragment key={stage.id}>
            <div style={mapStyles.step(isActive, isPast)}>
              <span style={mapStyles.marker(isActive, isPast)} />
              <span style={mapStyles.label}>{stage.label}</span>
            </div>
            {index < stages.length - 1 && (
              <div style={mapStyles.connector(isPast)} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// ============================================================================
// COMPLETION SCREEN
// ============================================================================

const ChamberComplete = ({ pilgrimName, onClose }) => {
  const completeStyles = {
    container: {
      textAlign: 'center',
      padding: '60px 20px',
      animation: 'chamberFadeSlide 300ms ease-out',
    },
    icon: {
      fontSize: '72px',
      marginBottom: '24px',
    },
    title: {
      color: '#fff',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '12px',
    },
    message: {
      color: '#cbd5e1',
      fontSize: '16px',
      lineHeight: '1.7',
      maxWidth: '500px',
      margin: '0 auto 32px',
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 40px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={completeStyles.container}>
      <div style={completeStyles.icon}>🌟</div>
      <h2 style={completeStyles.title}>Initiation Complete</h2>
      <p style={completeStyles.message}>
        {pilgrimName ? `${pilgrimName}, you` : 'You'} have returned from the ancestral temple
        with new clarity. The patterns of your lineage have been witnessed, honored, and integrated.
        Walk forward with the blessing of all who came before.
      </p>
      <button
        style={completeStyles.button}
        onClick={onClose}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        Continue Journey
      </button>
    </div>
  );
};

// ============================================================================
// MAIN ANCESTRAL CHAMBER COMPONENT
// ============================================================================

const AncestralChamber = ({
  // Overlay data
  overlays = {},
  // Pilgrim info
  pilgrimName = '',
  // Persona configuration
  personaRole = 'mentor',
  // Callbacks
  onComplete,
  onStageChange,
  // Optional: start at specific stage
  initialStage = 'constellation',
}) => {
  const [stage, setStage] = useState(initialStage);
  const [selectedNode, setSelectedNode] = useState(null);

  // Get persona voice for current stage
  const personaVoice = useMemo(() => {
    return getPersonaVoice(personaRole, stage);
  }, [personaRole, stage]);

  // Stage transition handler
  const goToStage = useCallback((nextStage) => {
    setStage(nextStage);
    onStageChange?.(nextStage);

    if (nextStage === 'complete') {
      onComplete?.({
        pilgrimName,
        completedAt: new Date().toISOString(),
        stagesCompleted: ['constellation', 'ritual', 'story', 'initiation'],
      });
    }
  }, [pilgrimName, onComplete, onStageChange]);

  // Handle node selection in constellation
  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
    goToStage('ritual');
  }, [goToStage]);

  // Extract overlay data with defaults
  const {
    constellationNodes = [],
    ritualPattern = null,
    storyData = {},
    initiationData = {},
  } = overlays;

  // Build ritual pattern from selected node if not provided
  const activeRitualPattern = ritualPattern || (selectedNode ? {
    id: selectedNode.id,
    sourceGeneration: selectedNode.generation || 'G2',
    description: selectedNode.description || 'A pattern carried through your lineage.',
    emotionalSignature: selectedNode.emotionalSignature || 'unresolved',
    patternType: selectedNode.patternType || 'wound',
  } : {
    id: 'default',
    sourceGeneration: 'G2',
    description: 'An ancestral pattern awaiting your attention.',
    emotionalSignature: 'uncertainty',
    patternType: 'unknown',
  });

  const chamberStyles = {
    container: {
      background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #0f172a 100%)',
      borderRadius: '20px',
      minHeight: '600px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundGlow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '600px',
      height: '600px',
      background: getStageGlow(stage),
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      transition: 'background 0.5s ease',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      padding: '24px',
    },
    header: {
      marginBottom: '8px',
    },
    title: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    personaVoice: {
      color: '#cbd5e1',
      fontSize: '15px',
      fontStyle: 'italic',
      lineHeight: '1.6',
      padding: '16px 20px',
      background: 'rgba(168, 85, 247, 0.1)',
      borderLeft: '3px solid #a78bfa',
      borderRadius: '0 8px 8px 0',
      marginBottom: '20px',
      animation: 'voiceFade 400ms ease-out',
    },
    stageContainer: {
      animation: 'chamberFadeSlide 260ms ease-out',
    },
  };

  function getStageGlow(currentStage) {
    const glows = {
      constellation: 'radial-gradient(circle, rgba(40, 48, 74, 0.4) 0%, transparent 70%)',
      ritual: 'radial-gradient(circle, rgba(59, 39, 48, 0.4) 0%, transparent 70%)',
      story: 'radial-gradient(circle, rgba(27, 38, 59, 0.4) 0%, transparent 70%)',
      initiation: 'radial-gradient(circle, rgba(75, 48, 64, 0.4) 0%, transparent 70%)',
      complete: 'radial-gradient(circle, rgba(42, 59, 75, 0.4) 0%, transparent 70%)',
    };
    return glows[currentStage] || glows.constellation;
  }

  return (
    <section style={chamberStyles.container} className={`ancestral-chamber ancestral-chamber--${stage}`}>
      {/* Ambient background glow */}
      <div style={chamberStyles.backgroundGlow} />

      <div style={chamberStyles.content}>
        {/* Header */}
        <header style={chamberStyles.header}>
          <div style={chamberStyles.title}>Ancestral Chamber</div>
        </header>

        {/* Pilgrim Map */}
        <AncestralPilgrimMap currentStage={stage} />

        {/* Persona Voice */}
        <div style={chamberStyles.personaVoice} key={stage}>
          {personaVoice}
        </div>

        {/* Stage Content */}
        <div style={chamberStyles.stageContainer} key={`stage-${stage}`}>
          {stage === 'constellation' && (
            <GenerationalConstellation
              nodes={constellationNodes}
              onNodeSelect={handleNodeSelect}
            />
          )}

          {stage === 'ritual' && (
            <AncestralHealingRitual
              pattern={activeRitualPattern}
              pilgrimName={pilgrimName}
              onComplete={() => goToStage('story')}
            />
          )}

          {stage === 'story' && (
            <>
              <GenerationalStoryDashboard
                generations={storyData.generations}
                patterns={storyData.patterns}
                storyBeats={storyData.storyBeats}
                emotionalArc={storyData.emotionalArc}
                timing={storyData.timing}
              />
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  onClick={() => goToStage('initiation')}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 40px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Begin Initiation Ceremony
                </button>
              </div>
            </>
          )}

          {stage === 'initiation' && (
            <PilgrimInitiationCeremony
              pilgrimName={pilgrimName}
              ancestralData={initiationData}
              onComplete={() => goToStage('complete')}
              onClose={() => goToStage('complete')}
            />
          )}

          {stage === 'complete' && (
            <ChamberComplete
              pilgrimName={pilgrimName}
              onClose={onComplete}
            />
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes chamberFadeSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes voiceFade {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .ancestral-chamber--constellation {
          --chamber-accent: #28304a;
        }

        .ancestral-chamber--ritual {
          --chamber-accent: #3b2730;
        }

        .ancestral-chamber--story {
          --chamber-accent: #1b263b;
        }

        .ancestral-chamber--initiation {
          --chamber-accent: #4b3040;
        }

        .ancestral-chamber--complete {
          --chamber-accent: #2a3b4b;
        }
      `}</style>
    </section>
  );
};

export default AncestralChamber;

// Named exports for sub-components
export { AncestralPilgrimMap, ChamberComplete, PERSONA_VOICES, getPersonaVoice };
