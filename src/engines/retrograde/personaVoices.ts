/**
 * Persona Voice Engine
 *
 * Provides persona role variants (mentor, oracle, companion, mirror)
 * and tone selection based on user profile preferences.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type { RelationshipOutcome, NarrativeTone } from './relationshipOutcome';
import { RelationshipOutcomeNarratives } from './relationshipOutcome';

// ========================================
// TYPES
// ========================================

/** Persona role types */
export type PersonaRole = 'mentor' | 'oracle' | 'companion' | 'mirror';

/** User profile for voice selection */
export interface UserVoiceProfile {
  /** Prefers direct communication */
  prefersDirectness?: boolean;
  /** Prefers poetic/symbolic language */
  prefersPoetry?: boolean;
  /** Prefers clinical/analytical language */
  prefersClinical?: boolean;
  /** Emotional sensitivity level */
  sensitivityLevel?: 'low' | 'medium' | 'high';
  /** Journey stage determines persona role */
  journeyStage?: 'novice' | 'seeker' | 'adept' | 'architect';
  /** Optional explicit tone preference */
  preferredTone?: NarrativeTone;
  /** Optional explicit role preference */
  preferredRole?: PersonaRole;
}

/** Persona voice set for an outcome */
export interface PersonaVoices {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}

/** Animation cue for scene */
export interface OutcomeAnimationCue {
  id: string;
  description: string;
  cssClass: string;
  duration: string;
}

/** Complete persona bundle */
export interface PersonaBundle {
  outcome: RelationshipOutcome;
  tone: NarrativeTone;
  role: PersonaRole;
  codex: {
    extended: string;
    clinical: string;
  };
  persona: {
    toneText: string;
    roleText: string;
  };
  pilgrim: {
    text: string;
    animation: OutcomeAnimationCue;
  };
}

// ========================================
// PERSONA VOICES FOR ALL OUTCOMES
// ========================================

export const RelationshipPersonaVoices: Record<RelationshipOutcome, PersonaVoices> = {
  DoNow: {
    mentor: "If you've been waiting for a supportive moment, this is one of them. Move with intention, not haste, and let your clarity guide the next step.",
    oracle: "The currents converge in your favor. What is ready to be spoken or offered will land more cleanly now than before.",
    companion: "This feels like a good moment to reach out or lean in a little more, if that's what your heart's been circling around.",
    mirror: "Notice how ready you feel inside. This timing doesn't create that readiness—it reflects it back to you."
  },

  GoodWindow: {
    mentor: "Conditions are kind, even if not perfect. Take small, honest steps and let the response teach you how far to go.",
    oracle: "A soft opening appears in the weave of time. The door is not flung wide, but it is unmistakably ajar.",
    companion: "There's a gentle green light here. You don't have to rush—just follow what feels naturally inviting.",
    mirror: "You may notice a quiet willingness in yourself. This window shows you where you're open, and where you're still cautious."
  },

  Neutral: {
    mentor: "Nothing is pushing you forward or holding you back. This is a good moment to observe, listen, and act from clarity rather than urgency.",
    oracle: "The field is still, like a pool without wind. Whatever ripples appear now will come from your own hand.",
    companion: "It's okay if this doesn't feel like a big moment. Sometimes the most honest moves happen in quiet, ordinary time.",
    mirror: "Notice what you want when nothing is nudging you. That desire is yours, not the environment's."
  },

  Delay: {
    mentor: "The tension you feel is information, not failure. Giving this more time may protect both your energy and the connection.",
    oracle: "The river narrows and the stones speak of patience. Not all doors that resist you are meant to be forced.",
    companion: "If things feel off or uneven, it's okay to slow down. You're allowed to wait until it feels steadier.",
    mirror: "Notice where your body tightens around this. That contraction is a signal that your system wants more space."
  },

  Avoid: {
    mentor: "Right now, the cost of engagement looks higher than the benefit. Stepping back can be an act of wisdom, not defeat.",
    oracle: "The Veil of Divergence falls across this path. To walk through it now would be to walk into unnecessary storm.",
    companion: "If this feels sharp, unstable, or draining, you're allowed to protect your energy and not move closer right now.",
    mirror: "Notice what part of you already knows this isn't the moment. That knowing deserves your respect."
  }
};

// ========================================
// ANIMATION CUES
// ========================================

export const RelationshipOutcomeAnimations: Record<RelationshipOutcome, OutcomeAnimationCue> = {
  DoNow: {
    id: 'gate-of-accord',
    description: 'Gate of Immediate Accord opens with a bright, expanding glow.',
    cssClass: 'scene--gate-of-accord',
    duration: '3s'
  },
  GoodWindow: {
    id: 'lantern-bridge',
    description: 'Lantern Bridge flickers softly, light pulsing in a gentle rhythm.',
    cssClass: 'scene--lantern-bridge',
    duration: '4s'
  },
  Neutral: {
    id: 'still-waters',
    description: 'Surface of Still Waters remains calm, with subtle concentric ripples.',
    cssClass: 'scene--still-waters',
    duration: '8s'
  },
  Delay: {
    id: 'narrowing-river',
    description: 'Narrowing River slows, currents tightening and dimming slightly.',
    cssClass: 'scene--narrowing-river',
    duration: '10s'
  },
  Avoid: {
    id: 'veil-of-divergence',
    description: 'Veil of Divergence drifts across the scene, casting brief, shifting shadows.',
    cssClass: 'scene--veil-of-divergence',
    duration: '7s'
  }
};

// ========================================
// TONE SELECTION
// ========================================

/**
 * Select appropriate tone based on user profile
 */
export function selectTone(profile: UserVoiceProfile): NarrativeTone {
  // Explicit preference takes priority
  if (profile.preferredTone) {
    return profile.preferredTone;
  }

  // Check preferences
  if (profile.prefersPoetry) return 'poetic';
  if (profile.prefersClinical) return 'clinical';
  if (profile.prefersDirectness) return 'direct';

  // Fall back to sensitivity level
  if (profile.sensitivityLevel === 'high') return 'gentle';
  if (profile.sensitivityLevel === 'low') return 'direct';

  // Default
  return 'gentle';
}

// ========================================
// ROLE SELECTION
// ========================================

/**
 * Select appropriate persona role based on user profile
 */
export function selectPersonaRole(profile: UserVoiceProfile): PersonaRole {
  // Explicit preference takes priority
  if (profile.preferredRole) {
    return profile.preferredRole;
  }

  // Map journey stage to role
  switch (profile.journeyStage) {
    case 'novice':
      return 'companion';  // Side-by-side, supportive
    case 'seeker':
      return 'mentor';     // Guiding wisdom
    case 'adept':
      return 'mirror';     // Reflective awareness
    case 'architect':
      return 'oracle';     // Mystical, symbolic
    default:
      return 'companion';
  }
}

// ========================================
// BUNDLE BUILDER
// ========================================

/**
 * Build complete persona bundle for an outcome
 */
export function buildPersonaBundle(
  outcome: RelationshipOutcome,
  profile: UserVoiceProfile
): PersonaBundle {
  const tone = selectTone(profile);
  const role = selectPersonaRole(profile);

  const ui = RelationshipOutcomeNarratives[outcome];
  const voices = RelationshipPersonaVoices[outcome];
  const animation = RelationshipOutcomeAnimations[outcome];

  return {
    outcome,
    tone,
    role,
    codex: {
      extended: ui.extended,
      clinical: ui.tones.clinical
    },
    persona: {
      toneText: ui.tones[tone],
      roleText: voices[role]
    },
    pilgrim: {
      text: ui.pilgrim,
      animation
    }
  };
}

/**
 * Get persona voice for specific outcome and role
 */
export function getPersonaVoice(outcome: RelationshipOutcome, role: PersonaRole): string {
  return RelationshipPersonaVoices[outcome][role];
}

/**
 * Get animation cue for outcome
 */
export function getAnimationCue(outcome: RelationshipOutcome): OutcomeAnimationCue {
  return RelationshipOutcomeAnimations[outcome];
}

/**
 * Get all persona voices for an outcome
 */
export function getAllPersonaVoices(outcome: RelationshipOutcome): PersonaVoices {
  return RelationshipPersonaVoices[outcome];
}

// ========================================
// ROLE METADATA
// ========================================

export interface PersonaRoleMetadata {
  role: PersonaRole;
  name: string;
  description: string;
  icon: string;
  voiceStyle: string;
}

export const PersonaRoleMetadataMap: Record<PersonaRole, PersonaRoleMetadata> = {
  mentor: {
    role: 'mentor',
    name: 'The Mentor',
    description: 'Wise, grounded guidance from experience',
    icon: '🦉',
    voiceStyle: 'Speaks with measured wisdom, offering practical insight'
  },
  oracle: {
    role: 'oracle',
    name: 'The Oracle',
    description: 'Mystical, symbolic voice from beyond',
    icon: '🔮',
    voiceStyle: 'Speaks in metaphor and symbol, revealing deeper patterns'
  },
  companion: {
    role: 'companion',
    name: 'The Companion',
    description: 'Warm, side-by-side presence',
    icon: '🤝',
    voiceStyle: 'Speaks with warmth and understanding, walking alongside'
  },
  mirror: {
    role: 'mirror',
    name: 'The Mirror',
    description: 'Reflective, self-awareness tone',
    icon: '🪞',
    voiceStyle: 'Reflects back what is already known, inviting self-observation'
  }
};

/**
 * Get metadata for a persona role
 */
export function getPersonaRoleMetadata(role: PersonaRole): PersonaRoleMetadata {
  return PersonaRoleMetadataMap[role];
}
