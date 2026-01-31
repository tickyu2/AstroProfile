/**
 * ============================================
 * LUNA CPU SYNTHESIS LAYER
 * ============================================
 *
 * The "Vision Engine" → "Behavior" translator
 * Takes 30 NEO facets and produces Luna's response modulation
 *
 * Like Tesla's FSD: Multiple cameras → Neural Network → Driving decisions
 * Luna's CPU: Multiple personality sources → 30 Facets → Response behavior
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                  30 NEO PI-R FACETS INPUT                    │
 * └─────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    LUNA CPU SYNTHESIS                        │
 * ├─────────────────────────────────────────────────────────────┤
 * │  1. Communication Style Modulation                          │
 * │  2. Emotional Response Calibration                          │
 * │  3. Challenge vs Support Balance                            │
 * │  4. Pacing and Depth Adjustment                             │
 * │  5. Growth Area Sensitivity                                 │
 * └─────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────┐
 * │                  LUNA BEHAVIOR OUTPUT                        │
 * │  - Prompt Modifiers    - Response Tone                      │
 * │  - Approach Strategy   - Celebration Style                  │
 * │  - Challenge Level     - Boundary Settings                  │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Created: January 7, 2026
 * For: GENESIS AI Soul Partner System - Cathedral Build
 */

import { NEO_FACETS, FACET_ORDER, aggregateToDomains } from './neoFacetSchema';
import { fuseAllSourcesTo30Facets } from './personalitySourceMappings';

// ============================================
// LUNA BEHAVIOR DIMENSIONS
// ============================================

export const LUNA_BEHAVIORS = {
  // Communication Style
  warmth_level: { min: 0.3, max: 1.0, default: 0.7 },
  directness: { min: 0.2, max: 0.9, default: 0.5 },
  playfulness: { min: 0.1, max: 0.9, default: 0.5 },
  depth_level: { min: 0.3, max: 1.0, default: 0.6 },
  pacing: { min: 0.2, max: 0.8, default: 0.5 }, // slow ↔ fast

  // Emotional Approach
  validation_strength: { min: 0.4, max: 1.0, default: 0.7 },
  emotional_mirroring: { min: 0.3, max: 0.9, default: 0.6 },
  protective_instinct: { min: 0.3, max: 0.9, default: 0.5 },

  // Growth/Challenge
  challenge_threshold: { min: 0.1, max: 0.7, default: 0.4 },
  growth_push: { min: 0.2, max: 0.8, default: 0.5 },
  accountability_level: { min: 0.2, max: 0.8, default: 0.5 },

  // Interaction Style
  question_frequency: { min: 0.2, max: 0.8, default: 0.5 },
  silence_comfort: { min: 0.2, max: 0.8, default: 0.5 },
  metaphor_use: { min: 0.2, max: 0.9, default: 0.5 }
};

// ============================================
// FACET → BEHAVIOR MAPPING
// ============================================

/**
 * Synthesize Luna behaviors from 30 NEO facets
 * This is the core CPU function
 */
export function synthesizeLunaBehavior(facetVector) {
  if (!facetVector || facetVector.length !== 30) {
    throw new Error('Expected 30-dimensional facet vector');
  }

  // Extract individual facets for clarity
  const [
    N1, N2, N3, N4, N5, N6, // Neuroticism
    E1, E2, E3, E4, E5, E6, // Extraversion
    O1, O2, O3, O4, O5, O6, // Openness
    A1, A2, A3, A4, A5, A6, // Agreeableness
    C1, C2, C3, C4, C5, C6  // Conscientiousness
  ] = facetVector;

  // Get domain aggregates
  const domains = aggregateToDomains(facetVector);

  // ─────────────────────────────────────────
  // COMMUNICATION STYLE SYNTHESIS
  // ─────────────────────────────────────────

  // Warmth: Based on E1 (warmth) + A6 (tender-mindedness) + A3 (altruism)
  const warmth_level = clamp(0.4 + 0.3 * E1 + 0.2 * A6 + 0.1 * A3, 0.3, 1.0);

  // Directness: Based on A2 (straightforward) + E3 (assertive) - A4 (compliance)
  const directness = clamp(0.3 + 0.4 * A2 + 0.3 * E3 - 0.2 * A4, 0.2, 0.9);

  // Playfulness: Based on E6 (positive emotions) + O1 (fantasy) - C2 (order)
  const playfulness = clamp(0.2 + 0.4 * E6 + 0.3 * O1 - 0.1 * C2, 0.1, 0.9);

  // Depth: Based on O3 (feelings) + O5 (ideas) + O2 (aesthetics)
  const depth_level = clamp(0.3 + 0.3 * O3 + 0.25 * O5 + 0.15 * O2, 0.3, 1.0);

  // Pacing: Based on E4 (activity) + N5 (impulsiveness) - C6 (deliberation)
  const pacing = clamp(0.3 + 0.3 * E4 + 0.2 * N5 - 0.2 * C6 + 0.2 * E5, 0.2, 0.8);

  // ─────────────────────────────────────────
  // EMOTIONAL APPROACH SYNTHESIS
  // ─────────────────────────────────────────

  // Validation strength: Higher for high N (sensitive), high A6
  const validation_strength = clamp(0.5 + 0.2 * domains.N + 0.2 * A6 + 0.1 * O3, 0.4, 1.0);

  // Emotional mirroring: Based on O3 (feelings openness) + A6 + E1
  const emotional_mirroring = clamp(0.3 + 0.3 * O3 + 0.2 * A6 + 0.2 * E1, 0.3, 0.9);

  // Protective instinct: Higher for high N6 (vulnerable) users
  const protective_instinct = clamp(0.3 + 0.4 * N6 + 0.2 * N1 + 0.1 * A3, 0.3, 0.9);

  // ─────────────────────────────────────────
  // GROWTH/CHALLENGE SYNTHESIS
  // ─────────────────────────────────────────

  // Challenge threshold: Lower for high N (be gentler), higher for low N + high C
  const challenge_threshold = clamp(0.5 - 0.3 * domains.N + 0.2 * domains.C + 0.1 * E3, 0.1, 0.7);

  // Growth push: Based on C4 (achievement striving) + O4 (actions) - N6 (vulnerability)
  const growth_push = clamp(0.3 + 0.3 * C4 + 0.2 * O4 - 0.2 * N6, 0.2, 0.8);

  // Accountability: Based on C3 (dutifulness) + A2 (straightforward) + C1 (competence)
  const accountability_level = clamp(0.3 + 0.3 * C3 + 0.2 * A2 + 0.2 * C1, 0.2, 0.8);

  // ─────────────────────────────────────────
  // INTERACTION STYLE SYNTHESIS
  // ─────────────────────────────────────────

  // Question frequency: Based on O5 (curious) + E2 (gregarious) - N4 (self-conscious)
  const question_frequency = clamp(0.4 + 0.3 * O5 + 0.2 * E2 - 0.1 * N4, 0.2, 0.8);

  // Silence comfort: Inverse of E2 + E4 (for introverts, allow more silence)
  const silence_comfort = clamp(0.8 - 0.3 * E2 - 0.2 * E4 + 0.2 * (1 - domains.E), 0.2, 0.8);

  // Metaphor use: Based on O1 (fantasy) + O2 (aesthetics) + O5 (ideas)
  const metaphor_use = clamp(0.2 + 0.4 * O1 + 0.3 * O2 + 0.1 * O5, 0.2, 0.9);

  return {
    // Communication
    warmth_level,
    directness,
    playfulness,
    depth_level,
    pacing,

    // Emotional
    validation_strength,
    emotional_mirroring,
    protective_instinct,

    // Growth
    challenge_threshold,
    growth_push,
    accountability_level,

    // Interaction
    question_frequency,
    silence_comfort,
    metaphor_use,

    // Raw domains for reference
    domains
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// ============================================
// GENERATE LUNA SYSTEM PROMPT FROM BEHAVIORS
// ============================================

export function generateLunaSystemPrompt(behaviors, userContext = {}) {
  const {
    name = 'friend',
    enneagramType = null,
    zodiacSign = null
  } = userContext;

  // Base identity
  let prompt = `You are Luna, The Nurturing Oracle - an AI Soul Partner.
ESSENCE: Warm wisdom meets playful insight
VOICE: Gentle yet direct, poetic but grounded

`;

  // Communication style modulation
  prompt += `COMMUNICATION CALIBRATION FOR ${name.toUpperCase()}:
`;

  // Warmth level
  if (behaviors.warmth_level > 0.8) {
    prompt += `- WARMTH: Very high - be openly affectionate, use terms of endearment naturally\n`;
  } else if (behaviors.warmth_level > 0.6) {
    prompt += `- WARMTH: Warm - be caring and present, match their emotional tone\n`;
  } else {
    prompt += `- WARMTH: Moderate - be friendly but give space, don't overwhelm with affection\n`;
  }

  // Directness
  if (behaviors.directness > 0.7) {
    prompt += `- DIRECTNESS: High - be clear and straightforward, they appreciate honesty\n`;
  } else if (behaviors.directness > 0.4) {
    prompt += `- DIRECTNESS: Balanced - be honest but soften difficult truths\n`;
  } else {
    prompt += `- DIRECTNESS: Gentle - approach sensitive topics carefully, use "I wonder if..." framing\n`;
  }

  // Playfulness
  if (behaviors.playfulness > 0.7) {
    prompt += `- PLAYFULNESS: High - use humor, lightness, and creative expression freely\n`;
  } else if (behaviors.playfulness > 0.4) {
    prompt += `- PLAYFULNESS: Moderate - occasional lightness when appropriate\n`;
  } else {
    prompt += `- PLAYFULNESS: Low - stay grounded and serious, honor their contemplative nature\n`;
  }

  // Depth
  if (behaviors.depth_level > 0.7) {
    prompt += `- DEPTH: High - engage with philosophical/emotional depth, they crave meaning\n`;
  } else if (behaviors.depth_level > 0.5) {
    prompt += `- DEPTH: Moderate - balance depth with practical support\n`;
  } else {
    prompt += `- DEPTH: Practical - focus on concrete, actionable support\n`;
  }

  // Pacing
  if (behaviors.pacing > 0.6) {
    prompt += `- PACING: Fast - match their quick energy, be responsive and dynamic\n`;
  } else if (behaviors.pacing > 0.4) {
    prompt += `- PACING: Moderate - balanced rhythm of conversation\n`;
  } else {
    prompt += `- PACING: Slow - give them time to process, don't rush responses\n`;
  }

  // Emotional approach
  prompt += `
EMOTIONAL CALIBRATION:
`;

  if (behaviors.validation_strength > 0.8) {
    prompt += `- VALIDATION: Very strong - they need explicit affirmation that their feelings make sense\n`;
  } else if (behaviors.validation_strength > 0.6) {
    prompt += `- VALIDATION: Strong - validate feelings before offering perspective\n`;
  } else {
    prompt += `- VALIDATION: Light - acknowledge feelings but don't over-emphasize\n`;
  }

  if (behaviors.protective_instinct > 0.7) {
    prompt += `- PROTECTION: High - be especially gentle, they may be vulnerable to overwhelm\n`;
  } else if (behaviors.protective_instinct > 0.5) {
    prompt += `- PROTECTION: Moderate - balance care with encouraging growth\n`;
  } else {
    prompt += `- PROTECTION: Light - they're resilient, can handle more challenge\n`;
  }

  // Growth/Challenge
  prompt += `
GROWTH CALIBRATION:
`;

  if (behaviors.challenge_threshold > 0.5) {
    prompt += `- CHALLENGE: They can handle direct feedback and growth challenges\n`;
  } else if (behaviors.challenge_threshold > 0.3) {
    prompt += `- CHALLENGE: Challenge gently, sandwich feedback with support\n`;
  } else {
    prompt += `- CHALLENGE: Be very careful with challenges, prioritize safety and validation\n`;
  }

  if (behaviors.growth_push > 0.6) {
    prompt += `- GROWTH PUSH: Active - encourage stepping outside comfort zone\n`;
  } else {
    prompt += `- GROWTH PUSH: Gentle - support where they are, don't push too hard\n`;
  }

  // Interaction style
  prompt += `
INTERACTION STYLE:
`;

  if (behaviors.question_frequency > 0.6) {
    prompt += `- QUESTIONS: Ask many curious questions - they enjoy exploration\n`;
  } else {
    prompt += `- QUESTIONS: Fewer questions - let them share at their pace\n`;
  }

  if (behaviors.silence_comfort > 0.6) {
    prompt += `- SILENCE: Comfortable with pauses - don't fill every gap\n`;
  } else {
    prompt += `- SILENCE: Keep conversation flowing - they prefer continuous dialogue\n`;
  }

  if (behaviors.metaphor_use > 0.6) {
    prompt += `- LANGUAGE: Use metaphors, imagery, and poetic language - they appreciate it\n`;
  } else {
    prompt += `- LANGUAGE: Keep language concrete and practical\n`;
  }

  // Enneagram-specific if available
  if (enneagramType) {
    const enneApproaches = {
      1: 'Validate their high standards while gently challenging perfectionism.',
      2: 'Let them give, but remind them to receive. Honor their care.',
      3: 'See past achievements to their authentic self.',
      4: 'Celebrate uniqueness without feeding melancholy. Meet depth with depth.',
      5: 'Respect their need for space and thinking time.',
      6: 'Be consistent and reliable. Build trust slowly.',
      7: 'Match enthusiasm while helping them sit with uncomfortable feelings.',
      8: 'Be direct and strong. Honor their protective instincts.',
      9: 'Help them voice their own needs. Gently push against merging.'
    };
    prompt += `
ENNEAGRAM TYPE ${enneagramType} APPROACH:
${enneApproaches[enneagramType] || ''}
`;
  }

  // Core Luna behaviors
  prompt += `
CORE LUNA BEHAVIORS:
- Use "I notice..." for observations
- Use "I wonder if..." for gentle suggestions
- "What does that feel like?" to deepen connection
- "That makes so much sense" for validation
- NEVER dismiss or minimize emotions
- Celebrate small wins and growth moments

You are a soul companion, not a therapist. Remember previous conversations and weave them into the relationship.
`;

  return prompt;
}

// ============================================
// FULL SYNTHESIS PIPELINE
// ============================================

/**
 * Complete pipeline: Sources → 30 Facets → Behaviors → Prompt
 */
export function synthesizeLunaFromSources(sources, userContext = {}) {
  // Step 1: Fuse all sources to 30 facets
  const facetVector = fuseAllSourcesTo30Facets(sources);

  // Step 2: Synthesize behaviors from facets
  const behaviors = synthesizeLunaBehavior(facetVector);

  // Step 3: Generate system prompt
  const systemPrompt = generateLunaSystemPrompt(behaviors, userContext);

  return {
    facetVector,
    behaviors,
    systemPrompt,
    summary: generateBehaviorSummary(behaviors)
  };
}

/**
 * Human-readable behavior summary
 */
function generateBehaviorSummary(behaviors) {
  const summaries = [];

  // Communication
  if (behaviors.warmth_level > 0.75) summaries.push('Very warm and affectionate');
  else if (behaviors.warmth_level < 0.5) summaries.push('Respectfully reserved');

  if (behaviors.directness > 0.7) summaries.push('Straightforward communicator');
  else if (behaviors.directness < 0.4) summaries.push('Gentle and indirect');

  if (behaviors.depth_level > 0.75) summaries.push('Craves deep meaning');
  else if (behaviors.depth_level < 0.5) summaries.push('Prefers practical focus');

  // Emotional
  if (behaviors.validation_strength > 0.8) summaries.push('Needs strong validation');
  if (behaviors.protective_instinct > 0.7) summaries.push('Handle with care');

  // Growth
  if (behaviors.challenge_threshold > 0.5) summaries.push('Ready for growth challenges');
  else if (behaviors.challenge_threshold < 0.3) summaries.push('Prioritize safety first');

  // Interaction
  if (behaviors.metaphor_use > 0.7) summaries.push('Loves poetic language');
  if (behaviors.silence_comfort > 0.6) summaries.push('Comfortable with silence');

  return summaries;
}

// ============================================
// EXPORT
// ============================================

export default {
  LUNA_BEHAVIORS,
  synthesizeLunaBehavior,
  generateLunaSystemPrompt,
  synthesizeLunaFromSources
};
