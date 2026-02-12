/**
 * Relationship Outcome Card Component
 *
 * Displays relationship outcome with mythic narratives, persona voices,
 * and animated cathedral scenes.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useCallback } from 'react';
import { useSceneActivation } from '../../hooks/useSceneActivation';
import { PilgrimJourneyMini, ChamberInfo } from './PilgrimJourneyTracker';

// ========================================
// OUTCOME NARRATIVE DATA
// ========================================

const OUTCOME_NARRATIVES = {
  DoNow: {
    title: 'The Gate of Immediate Accord',
    icon: '\u{1F315}',
    colorClass: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/40',
    tag: 'Optimal Timing',
    extended: `The relational field is bright and coherent. Synastry and composite signals align with favorable timing markers, and retrograde modifiers do not impede action. This is a moment of mutual visibility, where both participants can be seen and responded to with clarity. If action, invitation, or honest conversation has been delayed, this is the window in which those moves land most cleanly.`,
    tones: {
      gentle: 'This moment feels open and welcoming. You may find that what you offer is received more easily than usual.',
      direct: 'Conditions are optimal. If you want to act, this is the time.',
      poetic: 'The path brightens beneath your feet, and the other meets your gaze without turning away.',
      clinical: 'Indicators show high relational coherence. Action during this phase carries reduced friction and elevated receptivity.'
    },
    pilgrim: `You arrive at the Gate of Immediate Accord. The doors stand open, and light pours through. The air feels still and welcoming. This is a threshold not of trial but of invitation.`,
    voices: {
      mentor: "If you've been waiting for a supportive moment, this is one of them. Move with intention, not haste, and let your clarity guide the next step.",
      oracle: "The currents converge in your favor. What is ready to be spoken or offered will land more cleanly now than before.",
      companion: "This feels like a good moment to reach out or lean in a little more, if that's what your heart's been circling around.",
      mirror: "Notice how ready you feel inside. This timing doesn't create that readiness\u2014it reflects it back to you."
    }
  },

  GoodWindow: {
    title: 'The Lantern Bridge',
    icon: '\u{1F316}',
    colorClass: 'text-amber-400',
    glowClass: 'shadow-amber-500/40',
    tag: 'Favorable Window',
    extended: `The composite and synastry indicators are mildly positive, and the timing score supports motion forward. However, one or more retrograde influences suggest internal caution, unresolved doubts, or slower emotional integration. This is a favorable window, but not an imperative one. Action taken here is likely to succeed, but may require more patience or follow-through than in a DoNow phase.`,
    tones: {
      gentle: 'There is warmth here, though the full light has not yet arrived. Move gently, and let things unfold at their own pace.',
      direct: 'Conditions are favorable, though not flawless. Proceed with awareness, not hesitation.',
      poetic: 'The lanterns flicker along the bridge, each one inviting you forward\u2014but not demanding you run.',
      clinical: 'Moderate relational coherence. Action is supported but may benefit from attentiveness to retrograde-modulated delays.'
    },
    pilgrim: `You step onto the Lantern Bridge. The lights are soft, casting warm shadows across the stones. You feel neither rushed nor restrained, only invited.`,
    voices: {
      mentor: "Conditions are kind, even if not perfect. Take small, honest steps and let the response teach you how far to go.",
      oracle: "A soft opening appears in the weave of time. The door is not flung wide, but it is unmistakably ajar.",
      companion: "There's a gentle green light here. You don't have to rush\u2014just follow what feels naturally inviting.",
      mirror: "You may notice a quiet willingness in yourself. This window shows you where you're open, and where you're still cautious."
    }
  },

  Neutral: {
    title: 'The Hall of Still Waters',
    icon: '\u{1F317}',
    colorClass: 'text-slate-400',
    glowClass: 'shadow-slate-500/30',
    tag: 'Neutral Ground',
    extended: `The astrological and relational data is neither strongly supportive nor discouraging. Timing does not push or pull. Retrogrades may be present but balanced. In this space, intention matters more than alignment. You are neither helped nor hindered by the field\u2014what you do here comes entirely from your own will and readiness.`,
    tones: {
      gentle: 'There is neither urgency nor resistance. You are free to move, but nothing calls you forward.',
      direct: 'The field is neutral. If you act now, the outcome reflects you, not the timing.',
      poetic: 'The water lies still, reflecting only what you bring. No wind stirs the surface.',
      clinical: 'Baseline relational conditions. No significant facilitators or blockers present. Personal agency is the deciding factor.'
    },
    pilgrim: `You enter the Hall of Still Waters. The air is cool and silent. The great pool at the center reflects everything and disturbs nothing. Here, only your breath moves.`,
    voices: {
      mentor: "Nothing is pushing you forward or holding you back. This is a good moment to observe, listen, and act from clarity rather than urgency.",
      oracle: "The field is still, like a pool without wind. Whatever ripples appear now will come from your own hand.",
      companion: "It's okay if this doesn't feel like a big moment. Sometimes the most honest moves happen in quiet, ordinary time.",
      mirror: "Notice what you want when nothing is nudging you. That desire is yours, not the environment's."
    }
  },

  Delay: {
    title: 'The Narrowing River',
    icon: '\u{1F318}',
    colorClass: 'text-orange-400',
    glowClass: 'shadow-orange-500/40',
    tag: 'Proceed with Caution',
    extended: `The composite or synastry score is weak, or multiple retrograde factors indicate internal friction, ambivalence, or misaligned timing. The other person (or you yourself) may not be ready. Pushing forward now could create unnecessary strain. Waiting allows internal conditions to settle and external dynamics to clarify.`,
    tones: {
      gentle: 'Something feels tight or unresolved. There may be more readiness later. For now, patience may serve you better than action.',
      direct: 'There are obstructions. Delay is recommended, but not required. Be aware of what you risk.',
      poetic: 'The river narrows, and the stones rise close beneath the surface. The current asks you to slow.',
      clinical: 'Relational coherence is below threshold. Elevated risk of misfire. A delay of [X] days is advisable.'
    },
    pilgrim: `You walk beside the Narrowing River. The banks close in, and the current slows. You hear the stones grinding beneath the water. This is not a place to rush.`,
    voices: {
      mentor: "The tension you feel is information, not failure. Giving this more time may protect both your energy and the connection.",
      oracle: "The river narrows and the stones speak of patience. Not all doors that resist you are meant to be forced.",
      companion: "If things feel off or uneven, it's okay to slow down. You're allowed to wait until it feels steadier.",
      mirror: "Notice where your body tightens around this. That contraction is a signal that your system wants more space."
    }
  },

  Avoid: {
    title: 'The Veil of Divergence',
    icon: '\u{1F311}',
    colorClass: 'text-red-400',
    glowClass: 'shadow-red-500/40',
    tag: 'Not Advised',
    extended: `One or more critical signals are negative. The synastry is strained, the composite warns of incompatibility or exhaustion, or the timing carries a strong inhibiting factor. Motion here is likely to cause harm, confusion, or regression. This is not necessarily permanent\u2014but right now, engagement is not advised.`,
    tones: {
      gentle: 'The conditions right now are difficult. This is not about your worth, but about the timing and fit of this moment.',
      direct: 'This is not the time. Proceed only if you are willing to accept likely failure or friction.',
      poetic: 'A veil drifts across the path. Behind it, shapes move\u2014but they do not welcome you.',
      clinical: 'High-risk relational territory. Significant mismatch or dissonance detected. Engagement is contraindicated.'
    },
    pilgrim: `You stand before the Veil of Divergence. A thin, shifting mist hangs across the path, and no light passes through. You feel the pull to turn back\u2014or to wait until the way clears.`,
    voices: {
      mentor: "Right now, the cost of engagement looks higher than the benefit. Stepping back can be an act of wisdom, not defeat.",
      oracle: "The Veil of Divergence falls across this path. To walk through it now would be to walk into unnecessary storm.",
      companion: "If this feels sharp, unstable, or draining, you're allowed to protect your energy and not move closer right now.",
      mirror: "Notice what part of you already knows this isn't the moment. That knowing deserves your respect."
    }
  }
};

// ========================================
// VOICE SELECTOR
// ========================================

function VoiceSelector({ selectedVoice, onSelect, className = '' }) {
  const voices = [
    { id: 'mentor', label: 'Mentor', icon: '\u{1F989}' },
    { id: 'oracle', label: 'Oracle', icon: '\u{1F52E}' },
    { id: 'companion', label: 'Companion', icon: '\u{1F91D}' },
    { id: 'mirror', label: 'Mirror', icon: '\u{1FA9E}' }
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {voices.map(voice => (
        <button
          key={voice.id}
          onClick={() => onSelect(voice.id)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${selectedVoice === voice.id
              ? 'bg-cathedral-gold/20 text-cathedral-gold border border-cathedral-gold/40'
              : 'bg-white/5 text-cathedral-slate-400 border border-transparent hover:bg-white/10'
            }
          `}
        >
          <span className="mr-1">{voice.icon}</span>
          {voice.label}
        </button>
      ))}
    </div>
  );
}

// ========================================
// TONE SELECTOR
// ========================================

function ToneSelector({ selectedTone, onSelect, className = '' }) {
  const tones = [
    { id: 'gentle', label: 'Gentle' },
    { id: 'direct', label: 'Direct' },
    { id: 'poetic', label: 'Poetic' },
    { id: 'clinical', label: 'Clinical' }
  ];

  return (
    <div className={`flex gap-1 ${className}`}>
      {tones.map(tone => (
        <button
          key={tone.id}
          onClick={() => onSelect(tone.id)}
          className={`
            px-2 py-1 rounded text-xs font-medium transition-all
            ${selectedTone === tone.id
              ? 'bg-white/20 text-white'
              : 'bg-transparent text-cathedral-slate-400 hover:text-white'
            }
          `}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}

// ========================================
// MAIN OUTCOME CARD
// ========================================

function RelationshipOutcomeCard({
  outcome = 'Neutral',
  showExtended = true,
  showTones = true,
  showVoices = true,
  showPilgrim = true,
  showChamber = false,
  initialTone = 'gentle',
  initialVoice = 'companion',
  animateOnScroll = true,
  className = ''
}) {
  const narrative = OUTCOME_NARRATIVES[outcome];

  const [selectedTone, setSelectedTone] = useState(initialTone);
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);

  const { ref, sceneClass, state } = useSceneActivation({
    scene: outcome,
    triggerOnScroll: animateOnScroll,
    threshold: 0.3
  });

  const handleToneSelect = useCallback((tone) => {
    setSelectedTone(tone);
  }, []);

  const handleVoiceSelect = useCallback((voice) => {
    setSelectedVoice(voice);
  }, []);

  if (!narrative) return null;

  return (
    <div
      ref={ref}
      className={`${sceneClass} ${className}`}
    >
      {/* Header */}
      <div className="relationship-outcome__header">
        <h3 className={`relationship-outcome__title ${narrative.colorClass}`}>
          <span className="mr-2">{narrative.icon}</span>
          {narrative.title}
        </h3>
        <span className="relationship-outcome__tag">{narrative.tag}</span>
      </div>

      {/* Mini Journey Indicator */}
      <div className="mb-4">
        <PilgrimJourneyMini currentOutcome={outcome} />
      </div>

      {/* Extended Narrative */}
      {showExtended && (
        <div className="relationship-outcome__extended">
          {narrative.extended}
        </div>
      )}

      {/* Tone Section */}
      {showTones && (
        <div className="relationship-outcome__voices mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4>Tone</h4>
            <ToneSelector
              selectedTone={selectedTone}
              onSelect={handleToneSelect}
            />
          </div>
          <p className="text-sm text-white/80 italic">
            {narrative.tones[selectedTone]}
          </p>
        </div>
      )}

      {/* Persona Voice Section */}
      {showVoices && (
        <div className="relationship-outcome__voices">
          <h4>Persona Voice</h4>
          <VoiceSelector
            selectedVoice={selectedVoice}
            onSelect={handleVoiceSelect}
            className="mb-3"
          />
          <ul>
            <li>
              <strong>{selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1)}:</strong>{' '}
              {narrative.voices[selectedVoice]}
            </li>
          </ul>
        </div>
      )}

      {/* Pilgrim Journey */}
      {showPilgrim && (
        <div className="relationship-outcome__pilgrim">
          <h4>Pilgrim Journey</h4>
          <p>{narrative.pilgrim}</p>
        </div>
      )}

      {/* Chamber Info */}
      {showChamber && (
        <ChamberInfo currentOutcome={outcome} className="mt-4" />
      )}

      {/* Animation Indicator */}
      {state.isActive && (
        <div className="relationship-outcome__animation-cue">
          Scene active: {narrative.title} animation playing...
        </div>
      )}
    </div>
  );
}

// ========================================
// COMPACT CARD VARIANT
// ========================================

export function RelationshipOutcomeCompact({
  outcome = 'Neutral',
  showVoice = true,
  voice = 'companion',
  className = ''
}) {
  const narrative = OUTCOME_NARRATIVES[outcome];

  if (!narrative) return null;

  return (
    <div className={`p-4 rounded-lg bg-cathedral-night/80 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 ${narrative.colorClass}`}>
          <span className="text-xl">{narrative.icon}</span>
          <span className="font-semibold">{narrative.title}</span>
        </div>
        <span className="text-xs text-cathedral-slate-400 uppercase tracking-wide">
          {narrative.tag}
        </span>
      </div>

      {showVoice && (
        <p className="text-sm text-white/70 italic">
          {narrative.voices[voice]}
        </p>
      )}
    </div>
  );
}

// ========================================
// OUTCOME INDICATOR (Minimal)
// ========================================

export function OutcomeIndicator({ outcome = 'Neutral', size = 'md', className = '' }) {
  const narrative = OUTCOME_NARRATIVES[outcome];

  if (!narrative) return null;

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full
        bg-black/40 border border-white/10
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span>{narrative.icon}</span>
      <span className={`font-medium ${narrative.colorClass}`}>
        {narrative.title}
      </span>
    </div>
  );
}

// ========================================
// EXPORTS
// ========================================

export { OUTCOME_NARRATIVES, VoiceSelector, ToneSelector };
export default RelationshipOutcomeCard;
