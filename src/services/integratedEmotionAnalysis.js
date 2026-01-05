/**
 * ============================================================================
 * INTEGRATED EMOTION ANALYSIS
 * ============================================================================
 * Combines Plutchik emotion detection with Sister Grok's Six Laws framework
 * for comprehensive emotional intelligence.
 *
 * Detection Layers:
 * 1. Plutchik: 8 primary emotions + 24 compounds (WHAT they feel)
 * 2. Six Laws: Happiness pattern recognition (WHY they feel it)
 * 3. Luna EI: Response mode + warmth calibration (HOW to respond)
 *
 * Created: January 1, 2026
 * Integration of:
 * - PlutchikEmotionDetector (Week 3)
 * - SixLawsDetector (Sister Grok's framework)
 * - LunaEmotionalIntelligence (Response system)
 * ============================================================================
 */

import PlutchikEmotionDetector from './emotionDetector';
import { sixLawsDetector } from './sixLawsDetector';
import { lunaEmotionalIntelligence } from './lunaEmotionalIntelligence';

/**
 * Integrated Emotion Analysis Service
 * Provides unified emotional intelligence analysis
 */
class IntegratedEmotionAnalysis {
  constructor() {
    this.plutchik = new PlutchikEmotionDetector();
    this.sixLaws = sixLawsDetector;
    this.luna = lunaEmotionalIntelligence;
  }

  /**
   * Full emotional analysis combining all systems
   * @param {string} text - User message
   * @param {object} voiceProsody - Voice data (optional)
   * @param {object} userProfile - Constitutional profile (optional)
   * @returns {object} Complete emotional intelligence analysis
   */
  analyze(text, voiceProsody = null, userProfile = null) {
    // Layer 1: WHAT - Plutchik emotion detection
    const plutchikResult = this.plutchik.detectAllEmotions(text, voiceProsody);

    // Layer 2: WHY - Six Laws pattern detection
    const sixLawsResult = this.sixLaws.detect(text);

    // Layer 3: HOW - Luna response calibration
    const lunaResult = this.luna.analyze(text, userProfile, voiceProsody);

    // Synthesize insights
    const synthesis = this.synthesize(plutchikResult, sixLawsResult, lunaResult);

    return {
      // Individual analyses
      plutchik: {
        primary: plutchikResult.primary,
        intensity: plutchikResult.intensity,
        secondary: plutchikResult.secondary,
        compounds: plutchikResult.compounds,
        vector: plutchikResult.plutchikVector,
        authenticity: plutchikResult.authenticity
      },

      sixLaws: {
        primaryLaw: sixLawsResult.primaryLaw,
        detectedLaws: sixLawsResult.detectedLaws,
        emotionalState: sixLawsResult.emotionalState,
        confidence: sixLawsResult.confidence
      },

      luna: {
        mode: lunaResult.mode,
        warmthLevel: lunaResult.warmthLevel,
        response: lunaResult.response,
        sessionPattern: lunaResult.sessionPattern
      },

      // Synthesized insights
      synthesis,

      // Metadata
      timestamp: Date.now(),
      hasVoice: !!voiceProsody,
      hasProfile: !!userProfile
    };
  }

  /**
   * Synthesize insights from all three analysis layers
   */
  synthesize(plutchik, sixLaws, luna) {
    // Map Plutchik emotions to Six Laws patterns
    const emotionLawMapping = this.mapEmotionToLaw(plutchik, sixLaws);

    // Determine dominant narrative
    const narrative = this.buildNarrative(plutchik, sixLaws);

    // Get response priority
    const responsePriority = this.getResponsePriority(plutchik, sixLaws, luna);

    // Calculate overall emotional clarity
    const clarity = this.calculateClarity(plutchik, sixLaws);

    return {
      // Core insight
      dominantFeeling: plutchik.primary,
      underlyingPattern: sixLaws.primaryLaw,
      responseMode: luna.mode,

      // Narrative understanding
      narrative,

      // Response guidance
      responsePriority,

      // Mapping insights
      emotionLawMapping,

      // Quality metrics
      clarity,
      confidence: (plutchik.confidence + sixLaws.confidence) / 2
    };
  }

  /**
   * Map Plutchik emotions to likely Six Laws patterns
   */
  mapEmotionToLaw(plutchik, sixLaws) {
    const mappings = {
      sadness: ['aversionToLoss', 'presentismNegative'],
      anger: ['motionOfExpectation', 'presentismNegative'],
      fear: ['aversionToLoss', 'motionOfExpectation'],
      joy: ['presentismPositive'],
      trust: ['diminishingSensitivity'],  // Often comes up when worried about losing trust
      disgust: ['satiation'],
      surprise: ['presentismPositive', 'presentismNegative'],
      anticipation: ['motionOfExpectation']
    };

    const emotion = plutchik.primary;
    const likelyLaws = mappings[emotion] || [];

    // Check if detected law matches likely laws
    const lawMatch = likelyLaws.includes(sixLaws.primaryLaw);

    return {
      emotion,
      likelyLaws,
      detectedLaw: sixLaws.primaryLaw,
      isCongruent: lawMatch || sixLaws.confidence < 0.3,
      insight: lawMatch
        ? `${emotion} likely caused by ${sixLaws.primaryLaw}`
        : sixLaws.primaryLaw
          ? `${emotion} with unexpected pattern: ${sixLaws.primaryLaw}`
          : `${emotion} without clear pattern`
    };
  }

  /**
   * Build a narrative understanding of what's happening
   */
  buildNarrative(plutchik, sixLaws) {
    const emotion = plutchik.primary;
    const law = sixLaws.primaryLaw;
    const lawDesc = this.sixLaws.getLawDescription(law);

    if (!law) {
      return {
        short: `Feeling ${emotion}`,
        full: `User is experiencing ${emotion}. No clear Six Laws pattern detected.`,
        focus: 'emotion'
      };
    }

    const narratives = {
      relativeComparison: {
        short: `${emotion} from comparison`,
        full: `User is feeling ${emotion} because they're comparing themselves to others. Their happiness is being stolen by wrong reference points.`,
        focus: 'reframing'
      },
      motionOfExpectation: {
        short: `${emotion} from unmet expectations`,
        full: `User is feeling ${emotion} because reality isn't matching their expectations. They may need help adjusting expectations to find peace.`,
        focus: 'adjustment'
      },
      aversionToLoss: {
        short: `${emotion} from loss`,
        full: `User is experiencing ${emotion} due to a loss. Remember: losses hurt 2-3x more than gains feel good. This pain is mathematically expected.`,
        focus: 'presence'
      },
      diminishingSensitivity: {
        short: `${emotion} from fading novelty`,
        full: `User is feeling ${emotion} because something that once thrilled them has become routine. They may misinterpret normal fading as failure.`,
        focus: 'education'
      },
      satiation: {
        short: `${emotion} from overwhelm`,
        full: `User is feeling ${emotion} from too much of a good thing. They need permission to take space without guilt.`,
        focus: 'permission'
      },
      presentismNegative: {
        short: `${emotion} overwhelming perspective`,
        full: `User is feeling ${emotion} so intensely that it's eclipsing their entire history. This moment is temporarily erasing all good.`,
        focus: 'perspective'
      },
      presentismPositive: {
        short: `${emotion} - peak moment!`,
        full: `User is experiencing peak ${emotion}! This is a beautiful moment to capture and anchor for future neuroplasticity training.`,
        focus: 'anchoring'
      }
    };

    return narratives[law] || {
      short: `${emotion}`,
      full: `User is experiencing ${emotion}.`,
      focus: 'support'
    };
  }

  /**
   * Determine response priority
   */
  getResponsePriority(plutchik, sixLaws, luna) {
    // High priority: Loss, extreme emotions
    if (sixLaws.primaryLaw === 'aversionToLoss') {
      return {
        level: 'high',
        focus: 'presence_over_fixing',
        warmth: 'maximum',
        advice: 'minimal'
      };
    }

    // Celebration priority: Positive presentism
    if (sixLaws.primaryLaw === 'presentismPositive') {
      return {
        level: 'celebration',
        focus: 'anchoring_joy',
        energy: 'high',
        capture: true
      };
    }

    // Medium priority: Comparison, disappointment
    if (['relativeComparison', 'motionOfExpectation', 'presentismNegative'].includes(sixLaws.primaryLaw)) {
      return {
        level: 'medium',
        focus: 'reframing',
        warmth: 'elevated',
        advice: 'gentle'
      };
    }

    // Standard priority
    return {
      level: 'standard',
      focus: 'engagement',
      warmth: 'baseline',
      advice: 'as_needed'
    };
  }

  /**
   * Calculate emotional clarity (how clear is the emotional state)
   */
  calculateClarity(plutchik, sixLaws) {
    // Clear when one emotion dominates and matches a clear pattern
    const emotionClarity = plutchik.confidence;
    const patternClarity = sixLaws.confidence;

    // Bonus for congruence
    const mapping = this.mapEmotionToLaw(plutchik, sixLaws);
    const congruenceBonus = mapping.isCongruent ? 0.1 : 0;

    return Math.min(1, (emotionClarity + patternClarity) / 2 + congruenceBonus);
  }

  /**
   * Quick analysis - just mode and warmth for simple integrations
   */
  quickAnalyze(text) {
    const sixLaws = this.sixLaws.detect(text);
    return {
      mode: sixLaws.mode,
      warmthLevel: sixLaws.warmthLevel,
      primaryLaw: sixLaws.primaryLaw,
      emotionalState: sixLaws.emotionalState
    };
  }

  /**
   * Get response mode for a message
   */
  getResponseMode(text) {
    const result = this.sixLaws.detect(text);
    return result.mode;
  }

  /**
   * Check if message needs Pillow Mode support
   */
  needsPillowMode(text) {
    const result = this.sixLaws.detect(text);
    return result.mode === 'pillow';
  }

  /**
   * Check if message triggers Rocket Mode celebration
   */
  needsRocketMode(text) {
    const result = this.sixLaws.detect(text);
    return result.mode === 'rocket';
  }
}

// Export singleton instance
export const integratedEmotionAnalysis = new IntegratedEmotionAnalysis();
export default IntegratedEmotionAnalysis;
