/**
 * ============================================================================
 * RESPONSE DETECTOR
 * ============================================================================
 * Multi-modal detection of user response to interventions.
 * Analyzes text, voice, and behavior to determine how user responded.
 *
 * Response Types:
 * - positive: User engaged positively (thank you, wow, helps)
 * - neutral: User acknowledged but didn't engage (okay, I see)
 * - negative: User didn't find it helpful (doesn't help, whatever)
 *
 * Created: December 31, 2025
 * Week 6: Effectiveness Feedback Loop - Phase 2 Week 2
 * ============================================================================
 */

// Note: emotionDetector uses ES modules, so we need dynamic import
let PlutchikEmotionDetector = null;

async function getEmotionDetector() {
  if (!PlutchikEmotionDetector) {
    const module = await import('../../src/services/emotionDetector.js');
    PlutchikEmotionDetector = module.default;
  }
  return new PlutchikEmotionDetector();
}

class ResponseDetector {
  constructor() {
    this.emotionDetector = null;
    this.initialized = false;

    // Keywords for response classification
    this.positiveKeywords = [
      'thank you', 'thanks', 'wow', 'amazing', 'beautiful', 'love this',
      'exactly', 'yes', 'that helps', 'i remember', 'oh my god', 'omg',
      'this is good', 'i needed this', 'perfect', 'you\'re right',
      'that\'s true', 'i feel better', 'helps me', 'feeling better',
      'love that', 'so true', 'absolutely', 'really helps'
    ];

    this.neutralKeywords = [
      'okay', 'i see', 'alright', 'hmm', 'i guess', 'maybe',
      'not sure', 'ok', 'mm', 'uh huh', 'mhm', 'sure', 'fine'
    ];

    this.negativeKeywords = [
      "doesn't help", "not really", "i don't know", "whatever",
      "not working", "still sad", "doesn't matter", "don't care",
      "no", "not helpful", "makes it worse", "stop", "leave me alone"
    ];

    // Energy level mappings
    this.energyLevels = {
      'very_low': -0.5,
      'low': -0.3,
      'medium': 0,
      'high': 0.3,
      'very_high': 0.5
    };
  }

  async initialize() {
    if (!this.initialized) {
      this.emotionDetector = await getEmotionDetector();
      this.initialized = true;
    }
  }

  /**
   * Detect user response from text, voice, and behavior
   * @param {string} userMessage - User's text response
   * @param {Object} voiceProsody - Voice prosody data (optional)
   * @param {Object} behaviorData - Behavioral metrics (optional)
   * @returns {Object} Multi-modal response analysis
   */
  async detectResponse(userMessage, voiceProsody = null, behaviorData = null) {
    await this.initialize();

    // Text analysis
    const textResponse = await this.analyzeTextResponse(userMessage);

    // Voice analysis (if available)
    const voiceResponse = voiceProsody
      ? this.analyzeVoiceResponse(voiceProsody)
      : null;

    // Behavior analysis (if available)
    const behaviorResponse = behaviorData
      ? this.analyzeBehaviorResponse(behaviorData)
      : null;

    // Synthesize overall response
    const overall = this.synthesizeResponse(textResponse, voiceResponse, behaviorResponse);

    return {
      text: textResponse,
      voice: voiceResponse,
      behavior: behaviorResponse,
      overall: overall,
      timestamp: Date.now()
    };
  }

  /**
   * Analyze text response
   */
  async analyzeTextResponse(message) {
    // Get emotion analysis
    const emotionData = this.emotionDetector.detectAllEmotions(message);
    const lowerMessage = message.toLowerCase();

    // Detect response type from keywords
    let responseType = 'neutral';
    let keywordMatch = null;

    if (this.positiveKeywords.some(kw => {
      if (lowerMessage.includes(kw)) {
        keywordMatch = kw;
        return true;
      }
      return false;
    })) {
      responseType = 'positive';
    } else if (this.negativeKeywords.some(kw => {
      if (lowerMessage.includes(kw)) {
        keywordMatch = kw;
        return true;
      }
      return false;
    })) {
      responseType = 'negative';
    }

    // Check for question marks (indicates engagement)
    const hasQuestion = message.includes('?');

    // Check for exclamation marks (indicates emotion)
    const hasExclamation = message.includes('!');

    // Calculate engagement from message characteristics
    const engagement = this.calculateTextEngagement(message, hasQuestion, hasExclamation);

    return {
      emotion: emotionData.primary,
      intensity: emotionData.intensity,
      responseType: responseType,
      keywordMatch: keywordMatch,
      engagement: engagement,
      messageLength: message.length,
      hasQuestion: hasQuestion,
      hasExclamation: hasExclamation,
      emotionData: emotionData
    };
  }

  /**
   * Analyze voice response
   */
  analyzeVoiceResponse(voiceProsody) {
    // Map voice prosody to emotions using the emotion detector's logic
    const voiceEmotions = this.mapVoiceToEmotions(voiceProsody);

    // Find dominant voice emotion
    let maxEmotion = 'neutral';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(voiceEmotions)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    }

    // Detect energy shift (positive sign of engagement)
    const energyShift = this.detectEnergyShift(voiceProsody);

    // Detect pitch pattern
    const pitchPattern = this.analyzePitchPattern(voiceProsody);

    return {
      emotion: maxEmotion,
      intensity: Math.round(maxScore * 10),
      energyShift: energyShift,
      pitchPattern: pitchPattern,
      prosody: voiceProsody,
      voiceEmotions: voiceEmotions
    };
  }

  /**
   * Map voice prosody to emotion scores
   */
  mapVoiceToEmotions(voiceProsody) {
    const emotions = {
      joy: 0, trust: 0, fear: 0, surprise: 0,
      sadness: 0, disgust: 0, anger: 0, anticipation: 0
    };

    // Energy mapping
    if (voiceProsody.energy === 'high' || voiceProsody.energy === 'very_high') {
      emotions.joy += 0.3;
      emotions.anger += 0.2;
      emotions.anticipation += 0.2;
    } else if (voiceProsody.energy === 'low' || voiceProsody.energy === 'very_low') {
      emotions.sadness += 0.4;
      emotions.fear += 0.2;
    }

    // Pitch mapping
    if (voiceProsody.pitch === 'rising') {
      emotions.joy += 0.3;
      emotions.surprise += 0.3;
      emotions.anticipation += 0.2;
    } else if (voiceProsody.pitch === 'falling') {
      emotions.sadness += 0.3;
      emotions.disgust += 0.2;
    } else if (voiceProsody.pitch === 'unstable') {
      emotions.fear += 0.3;
      emotions.anger += 0.2;
    }

    // Quality mapping
    if (voiceProsody.quality === 'warm') {
      emotions.joy += 0.2;
      emotions.trust += 0.4;
    } else if (voiceProsody.quality === 'bright') {
      emotions.joy += 0.3;
      emotions.surprise += 0.2;
    } else if (voiceProsody.quality === 'harsh') {
      emotions.anger += 0.4;
      emotions.disgust += 0.2;
    } else if (voiceProsody.quality === 'breathy') {
      emotions.sadness += 0.2;
      emotions.fear += 0.2;
    } else if (voiceProsody.quality === 'flat') {
      emotions.sadness += 0.3;
    }

    // Special markers
    if (voiceProsody.laughter) {
      emotions.joy += 0.5;
    }
    if (voiceProsody.sighs) {
      emotions.sadness += 0.3;
    }

    return emotions;
  }

  /**
   * Analyze behavior response
   */
  analyzeBehaviorResponse(behaviorData) {
    // Response time (faster = more engaged)
    const responseTime = behaviorData.responseTime || null;
    const isQuickResponse = responseTime && responseTime < 5000; // < 5 seconds
    const isSlowResponse = responseTime && responseTime > 30000; // > 30 seconds

    // Message length (longer = more engaged, up to a point)
    const messageLength = behaviorData.messageLength || 0;
    const isDetailedResponse = messageLength > 50;
    const isMinimalResponse = messageLength < 10;

    // Follow-up questions (indicates interest)
    const hasFollowUp = behaviorData.hasFollowUp || false;

    // Session continuation (user keeps talking)
    const sessionContinued = behaviorData.sessionContinued !== false;

    // Engagement score (0-1)
    let engagement = 0.5; // baseline

    if (isQuickResponse) engagement += 0.15;
    if (isSlowResponse) engagement -= 0.1;
    if (isDetailedResponse) engagement += 0.2;
    if (isMinimalResponse) engagement -= 0.15;
    if (hasFollowUp) engagement += 0.15;
    if (!sessionContinued) engagement -= 0.2;

    return {
      responseTime: responseTime,
      messageLength: messageLength,
      hasFollowUp: hasFollowUp,
      sessionContinued: sessionContinued,
      isQuickResponse: isQuickResponse,
      isDetailedResponse: isDetailedResponse,
      engagement: Math.max(0, Math.min(1, engagement))
    };
  }

  /**
   * Synthesize overall response assessment
   */
  synthesizeResponse(textResponse, voiceResponse, behaviorResponse) {
    let confidence = 0.5;
    let responseType = 'neutral';

    // Weight factors
    const TEXT_WEIGHT = 0.5;
    const VOICE_WEIGHT = 0.35;
    const BEHAVIOR_WEIGHT = 0.15;

    // Text-based assessment (always available)
    if (textResponse.responseType === 'positive') {
      responseType = 'positive';
      confidence += 0.2;
    } else if (textResponse.responseType === 'negative') {
      responseType = 'negative';
      confidence += 0.2;
    }

    // Emotion confirmation from text
    const positiveTextEmotions = ['joy', 'trust', 'surprise', 'anticipation'];
    const negativeTextEmotions = ['sadness', 'fear', 'anger', 'disgust'];

    if (positiveTextEmotions.includes(textResponse.emotion)) {
      if (responseType === 'positive') confidence += 0.1;
      else if (responseType === 'neutral') {
        responseType = 'positive';
        confidence += 0.05;
      }
    } else if (negativeTextEmotions.includes(textResponse.emotion)) {
      if (responseType === 'negative') confidence += 0.1;
      else if (responseType === 'neutral') {
        responseType = 'negative';
        confidence += 0.05;
      }
    }

    // Voice confirmation (if available)
    if (voiceResponse) {
      const positiveVoiceEmotions = ['joy', 'trust', 'surprise'];
      const negativeVoiceEmotions = ['sadness', 'fear', 'anger'];

      if (positiveVoiceEmotions.includes(voiceResponse.emotion)) {
        if (responseType === 'positive') {
          confidence += 0.15; // Voice confirms text
        } else if (responseType === 'neutral') {
          responseType = 'positive'; // Voice overrides neutral text
          confidence += 0.1;
        }
      } else if (negativeVoiceEmotions.includes(voiceResponse.emotion)) {
        if (responseType === 'negative') {
          confidence += 0.15; // Voice confirms text
        } else if (responseType === 'neutral') {
          responseType = 'negative'; // Voice overrides neutral text
          confidence += 0.1;
        } else if (responseType === 'positive') {
          // Voice contradicts positive text - likely masking
          confidence -= 0.1;
        }
      }

      // Energy shift is strong positive signal
      if (voiceResponse.energyShift > 0.3) {
        if (responseType !== 'negative') {
          responseType = 'positive';
          confidence += 0.1;
        }
      } else if (voiceResponse.energyShift < -0.3) {
        if (responseType !== 'positive') {
          responseType = 'negative';
          confidence += 0.1;
        }
      }
    }

    // Behavior confirmation (if available)
    if (behaviorResponse) {
      if (behaviorResponse.engagement > 0.7) {
        if (responseType === 'positive') {
          confidence += 0.1; // Behavior confirms positive
        } else if (responseType === 'neutral') {
          confidence += 0.05;
        }
      } else if (behaviorResponse.engagement < 0.3) {
        if (responseType === 'negative') {
          confidence += 0.1; // Behavior confirms negative
        } else if (responseType === 'positive') {
          confidence -= 0.05; // Low engagement contradicts positive
        }
      }
    }

    return {
      responseType: responseType,
      confidence: Math.max(0, Math.min(1, confidence)),
      sources: {
        hasText: true,
        hasVoice: voiceResponse !== null,
        hasBehavior: behaviorResponse !== null
      }
    };
  }

  /**
   * Calculate text engagement score
   */
  calculateTextEngagement(message, hasQuestion, hasExclamation) {
    const length = message.length;
    let engagement = 0.5;

    // Length-based engagement
    if (length < 10) engagement = 0.2; // Very short
    else if (length < 30) engagement = 0.4; // Short
    else if (length < 100) engagement = 0.7; // Medium
    else if (length < 300) engagement = 0.9; // Long
    else engagement = 1.0; // Very long

    // Bonus for questions (shows interest)
    if (hasQuestion) engagement += 0.1;

    // Bonus for exclamations (shows emotion)
    if (hasExclamation) engagement += 0.05;

    return Math.min(1, engagement);
  }

  /**
   * Detect energy shift in voice
   */
  detectEnergyShift(voiceProsody) {
    return this.energyLevels[voiceProsody.energy] || 0;
  }

  /**
   * Analyze pitch pattern
   */
  analyzePitchPattern(voiceProsody) {
    const patterns = {
      'rising': 'engaged', // Interest, excitement
      'falling': 'disengaged', // Sadness, giving up
      'stable': 'neutral',
      'unstable': 'emotional', // Could be positive or negative
      'sharp': 'tense'
    };

    return patterns[voiceProsody.pitch] || 'neutral';
  }
}

module.exports = ResponseDetector;
