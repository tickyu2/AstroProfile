/**
 * ============================================================================
 * EMOTION CONGRUENCE DETECTOR
 * ============================================================================
 * Detects alignment between text emotion and voice emotion.
 * Identifies hidden emotions when voice contradicts text.
 *
 * Key capabilities:
 * - Congruence scoring (0-1) using cosine similarity
 * - Hidden emotion detection (voice shows what text hides)
 * - Masking pattern recognition ("fine" + sad voice)
 * - Authenticity scoring for anchor detection
 *
 * Created: December 30, 2025
 * Week 3: Voice Prosody Enhancement
 * ============================================================================
 */

class EmotionCongruenceDetector {
  constructor() {
    // If difference > threshold, emotions don't match
    this.congruenceThreshold = 0.3;

    // Common masking patterns
    this.maskingPatterns = {
      fine_masking: {
        textKeywords: ['fine', 'okay', 'alright', "i'm good", 'im good', 'not bad'],
        voiceEmotion: 'sadness',
        description: 'User says "fine" but voice shows sadness'
      },
      happy_masking: {
        textKeywords: ['happy', 'great', 'awesome', 'fantastic', 'wonderful'],
        voiceEmotion: 'fear',
        description: 'User says happy but voice shows anxiety'
      },
      calm_masking: {
        textKeywords: ['calm', 'no problem', 'whatever', "don't care", 'dont care'],
        voiceEmotion: 'anger',
        description: 'User says calm but voice shows anger'
      },
      strong_masking: {
        textKeywords: ['strong', "i'm ok", 'im ok', 'handling it', 'managing'],
        voiceEmotion: 'sadness',
        description: 'User says strong but voice shows sadness'
      },
      excited_masking: {
        textKeywords: ['excited', 'thrilled', "can't wait"],
        voiceEmotion: 'fear',
        description: 'User says excited but voice shows nervousness'
      }
    };
  }

  /**
   * Main congruence detection
   * @param {object} textEmotion - Emotion detected from text
   * @param {object} voiceEmotion - Emotion vector from voice
   * @returns {object} Congruence analysis
   */
  detectCongruence(textEmotion, voiceEmotion) {
    // No voice data - trust text only
    if (!voiceEmotion) {
      return {
        isCongruent: true,
        congruenceScore: 1.0,
        hiddenEmotion: null,
        dominantSource: 'text',
        authenticity: 0.7, // Lower authenticity without voice confirmation
        textEmotion: this.findDominantEmotion(textEmotion.plutchikVector || {}),
        voiceEmotion: null
      };
    }

    // Find dominant emotion in each modality
    const textDominant = this.findDominantEmotion(textEmotion.plutchikVector || {});
    const voiceDominant = this.findDominantEmotion(voiceEmotion);

    // Calculate congruence score
    const congruenceScore = this.calculateCongruenceScore(
      textEmotion.plutchikVector || {},
      voiceEmotion
    );

    // Determine if congruent
    const isCongruent = congruenceScore >= (1 - this.congruenceThreshold);

    // Detect hidden emotion
    let hiddenEmotion = null;
    if (!isCongruent) {
      // Voice emotion is stronger than text emotion
      if (voiceDominant.score > textDominant.score + 0.2) {
        hiddenEmotion = voiceDominant.emotion;
      }
    }

    // Determine dominant source
    const dominantSource = voiceDominant.score > textDominant.score ? 'voice' : 'text';

    // Calculate authenticity
    const authenticity = this.calculateAuthenticity(
      textEmotion,
      voiceEmotion,
      isCongruent,
      hiddenEmotion
    );

    return {
      isCongruent,
      congruenceScore,
      hiddenEmotion,
      dominantSource,
      authenticity,
      textEmotion: textDominant,
      voiceEmotion: voiceDominant
    };
  }

  /**
   * Find dominant emotion from plutchik vector
   */
  findDominantEmotion(plutchikVector) {
    let maxEmotion = 'neutral';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(plutchikVector)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    }

    return { emotion: maxEmotion, score: maxScore };
  }

  /**
   * Calculate congruence score using cosine similarity
   * 1.0 = perfect match, 0.0 = completely different
   */
  calculateCongruenceScore(textVector, voiceVector) {
    const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];

    let dotProduct = 0;
    let textMagnitude = 0;
    let voiceMagnitude = 0;

    emotions.forEach(emotion => {
      const textVal = textVector[emotion] || 0;
      const voiceVal = voiceVector[emotion] || 0;

      dotProduct += textVal * voiceVal;
      textMagnitude += textVal * textVal;
      voiceMagnitude += voiceVal * voiceVal;
    });

    textMagnitude = Math.sqrt(textMagnitude);
    voiceMagnitude = Math.sqrt(voiceMagnitude);

    if (textMagnitude === 0 || voiceMagnitude === 0) {
      // One or both are neutral
      return 0.5;
    }

    return dotProduct / (textMagnitude * voiceMagnitude);
  }

  /**
   * Calculate authenticity score
   * Higher when voice and text align
   * Still high when voice is stronger (text masking is common)
   */
  calculateAuthenticity(textEmotion, voiceEmotion, isCongruent, hiddenEmotion) {
    if (isCongruent) {
      return 0.9; // High authenticity when aligned
    }

    // Check if text is neutral but voice shows emotion
    const textPrimary = textEmotion.primary || 'neutral';
    const textIntensity = textEmotion.intensity || 0;
    const textNeutral = textPrimary === 'neutral' || textIntensity < 3;

    const voiceDominant = this.findDominantEmotion(voiceEmotion);
    const voiceStrong = voiceDominant.score > 0.6;

    if (textNeutral && voiceStrong) {
      // User is masking emotion - voice is more authentic
      return 0.85;
    }

    // Strong hidden emotion detected
    if (hiddenEmotion && voiceDominant.score > 0.7) {
      return 0.8; // Voice is showing true emotion
    }

    // Text and voice disagree - moderate authenticity
    return 0.5;
  }

  /**
   * Detect specific masking patterns
   */
  detectMaskingPattern(textMessage, textEmotion, voiceEmotion) {
    if (!voiceEmotion) return null;

    const lowerMessage = textMessage.toLowerCase();
    const voiceDominant = this.findDominantEmotion(voiceEmotion);

    for (const [patternName, pattern] of Object.entries(this.maskingPatterns)) {
      const hasTextKeyword = pattern.textKeywords.some(kw => lowerMessage.includes(kw));
      const hasVoiceEmotion = voiceDominant.emotion === pattern.voiceEmotion &&
                              voiceDominant.score > 0.5;

      if (hasTextKeyword && hasVoiceEmotion) {
        return {
          pattern: patternName,
          description: pattern.description,
          confidence: voiceDominant.score,
          textSays: pattern.textKeywords.find(kw => lowerMessage.includes(kw)),
          voiceShows: pattern.voiceEmotion
        };
      }
    }

    return null;
  }

  /**
   * Get emotion difference analysis
   */
  analyzeEmotionDifference(textVector, voiceVector) {
    const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];
    const differences = {};

    emotions.forEach(emotion => {
      const textVal = textVector[emotion] || 0;
      const voiceVal = voiceVector[emotion] || 0;
      const diff = voiceVal - textVal;

      if (Math.abs(diff) > 0.2) {
        differences[emotion] = {
          text: textVal,
          voice: voiceVal,
          difference: diff,
          direction: diff > 0 ? 'voice_higher' : 'text_higher'
        };
      }
    });

    return differences;
  }

  /**
   * Determine if intervention is needed
   * Returns true if hidden negative emotion detected
   */
  needsIntervention(congruenceResult) {
    if (!congruenceResult.hiddenEmotion) return false;

    // Negative emotions that need intervention
    const negativeEmotions = ['sadness', 'fear', 'anger', 'disgust'];

    return negativeEmotions.includes(congruenceResult.hiddenEmotion) &&
           congruenceResult.voiceEmotion.score > 0.6;
  }

  /**
   * Get suggested response approach based on congruence
   */
  getSuggestedApproach(congruenceResult) {
    if (congruenceResult.isCongruent) {
      return {
        approach: 'direct',
        reason: 'Text and voice align - respond directly to stated emotion'
      };
    }

    if (congruenceResult.hiddenEmotion) {
      return {
        approach: 'gentle_acknowledgment',
        reason: `Hidden ${congruenceResult.hiddenEmotion} detected - gently acknowledge what voice shows`,
        hiddenEmotion: congruenceResult.hiddenEmotion,
        example: this.getGentleAcknowledgmentExample(congruenceResult.hiddenEmotion)
      };
    }

    return {
      approach: 'exploration',
      reason: 'Incongruence detected but no clear hidden emotion - explore gently'
    };
  }

  /**
   * Get example of gentle acknowledgment for hidden emotion
   */
  getGentleAcknowledgmentExample(hiddenEmotion) {
    const examples = {
      sadness: "I hear you saying you're fine, but I sense there might be something weighing on you. I'm here if you want to talk about it.",
      fear: "You sound a bit uncertain. It's okay to feel nervous about things. Would you like to talk about what's on your mind?",
      anger: "I notice some tension. Sometimes it's hard to express frustration. I'm listening if you want to share.",
      disgust: "Something seems to be bothering you. It's okay to express how you really feel."
    };

    return examples[hiddenEmotion] || "I'm sensing there might be more going on. I'm here to listen.";
  }
}

module.exports = EmotionCongruenceDetector;
