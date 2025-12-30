/**
 * Advanced Congruence Pattern Detection
 * 15 additional patterns beyond the basic 6
 */

export class AdvancedCongruenceDetector {
  constructor() {
    this.patterns = {
      DEFENSIVE_DEFLECTION: this.detectDefensiveDeflection,
      VULNERABILITY_MASKING: this.detectVulnerabilityMasking,
      EXCITEMENT_DAMPENING: this.detectExcitementDampening,
      ANGER_LEAKAGE: this.detectAngerLeakage,
      ANXIETY_PROJECTION: this.detectAnxietyProjection,
      OVERWHELM_SHUTDOWN: this.detectOverwhelmShutdown,
      FORCED_POSITIVITY: this.detectForcedPositivity,
      INTELLECTUAL_DISTANCING: this.detectIntellectualDistancing,
      HELP_SEEKING_DISGUISED: this.detectHelpSeekingDisguised,
      EMOTIONAL_FLOODING: this.detectEmotionalFlooding,
      GUILT_MASKING: this.detectGuiltMasking,
      JOY_SUPPRESSION: this.detectJoySuppression,
      TRAUMA_RESPONSE: this.detectTraumaResponse,
      PERFORMATIVE_EMOTION: this.detectPerformativeEmotion,
      RESIGNATION_ACCEPTANCE: this.detectResignationAcceptance
    };
  }

  /**
   * Detect all advanced patterns
   */
  detectAll(signals, voiceEmotion, textContent) {
    const detected = [];

    for (const [patternName, detectFn] of Object.entries(this.patterns)) {
      const confidence = detectFn.call(this, signals, voiceEmotion, textContent);

      if (confidence > 0.5) {
        detected.push({
          pattern: patternName,
          confidence: confidence,
          description: this.getDescription(patternName),
          severity: this.getSeverity(patternName, confidence)
        });
      }
    }

    // Sort by confidence
    detected.sort((a, b) => b.confidence - a.confidence);

    return detected;
  }

  // ============================================
  // PATTERN DETECTION METHODS
  // ============================================

  /**
   * 1. DEFENSIVE_DEFLECTION
   * User deflects emotional topics with humor, questions, or topic changes
   */
  detectDefensiveDeflection(signals, voiceEmotion, textContent) {
    const isAnxiousVoice = voiceEmotion.emotion === 'anxious' && voiceEmotion.confidence > 0.6;
    const hasHumor = /ha|haha|lol|funny|joke/i.test(textContent);
    const hasQuestions = signals.questioningLevel > 0.4;
    const hasTopicChange = /anyway|so|by the way|speaking of|oh|hey/i.test(textContent);
    const lowEmotionalText = signals.emotionalIntensity < 0.3;

    if (isAnxiousVoice && lowEmotionalText && (hasHumor || hasQuestions || hasTopicChange)) {
      let confidence = 0.65;
      if (hasHumor) confidence += 0.1;
      if (hasQuestions) confidence += 0.1;
      if (hasTopicChange) confidence += 0.1;
      return Math.min(confidence, 0.95);
    }
    return 0;
  }

  /**
   * 2. VULNERABILITY_MASKING
   * User expresses deep emotion in voice but minimizes it verbally
   */
  detectVulnerabilityMasking(signals, voiceEmotion, textContent) {
    const isSadVoice = voiceEmotion.emotion === 'sad' && voiceEmotion.confidence > 0.7;
    const hasMinimizing = /not a big deal|fine|okay|no worries|it's nothing|i'm good/i.test(textContent);
    const hasDismissal = /just|only|little|barely|hardly/i.test(textContent);
    const lowVulnerabilityText = signals.vulnerabilityLevel < 0.3;

    if (isSadVoice && (hasMinimizing || hasDismissal || lowVulnerabilityText)) {
      return 0.75 + (hasMinimizing ? 0.1 : 0) + (hasDismissal ? 0.05 : 0);
    }
    return 0;
  }

  /**
   * 3. EXCITEMENT_DAMPENING
   * User is genuinely excited but downplays it verbally
   */
  detectExcitementDampening(signals, voiceEmotion, textContent) {
    const isHappyVoice = voiceEmotion.emotion === 'happy' && voiceEmotion.confidence > 0.65;
    const hasUnderstated = /kind of|sort of|i guess|maybe|a bit|pretty|fairly/i.test(textContent);
    const lowPositiveSentiment = signals.sentimentPolarity < 0.3;
    const lowEmotionalIntensity = signals.emotionalIntensity < 0.4;

    if (isHappyVoice && (hasUnderstated || lowPositiveSentiment || lowEmotionalIntensity)) {
      return 0.70 + (hasUnderstated ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 4. ANGER_LEAKAGE
   * Suppressed anger shows through passive-aggressive or terse language
   */
  detectAngerLeakage(signals, voiceEmotion, textContent) {
    const isAngryVoice = voiceEmotion.emotion === 'angry' && voiceEmotion.confidence > 0.6;
    const hasPassiveAggressive = /fine|whatever|sure|if you say so|okay then/i.test(textContent);
    const isTerse = textContent.split(/\s+/).length < 8 && textContent.length < 40;
    const hasNegation = signals.negationLevel > 0.3;
    const lowEmotional = signals.emotionalIntensity < 0.4;

    if (isAngryVoice && (hasPassiveAggressive || (isTerse && lowEmotional))) {
      return 0.72 + (hasPassiveAggressive ? 0.1 : 0) + (hasNegation ? 0.05 : 0);
    }
    return 0;
  }

  /**
   * 5. ANXIETY_PROJECTION
   * User projects their own anxiety onto others
   */
  detectAnxietyProjection(signals, voiceEmotion, textContent) {
    const isAnxiousVoice = voiceEmotion.emotion === 'anxious' && voiceEmotion.confidence > 0.65;
    const hasProjection = /are you (okay|alright|sure|good)|is everything (okay|alright|fine)|you seem|you look/i.test(textContent);
    const lowSelfFocus = signals.selfFocus < 0.4;

    if (isAnxiousVoice && hasProjection) {
      return 0.75 + (lowSelfFocus ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 6. OVERWHELM_SHUTDOWN
   * User becomes emotionally flooded and shuts down
   */
  detectOverwhelmShutdown(signals, voiceEmotion, textContent) {
    const isFlatVoice = voiceEmotion.emotion === 'neutral' && voiceEmotion.confidence > 0.5;
    const isMonosyllabic = textContent.split(/\s+/).length <= 3;
    const isVeryBrief = textContent.length < 20;
    const lowEmotional = signals.emotionalIntensity < 0.2;
    const singleWord = /^(okay|ok|fine|yeah|no|yes|sure)\.?$/i.test(textContent.trim());

    if ((isFlatVoice || isMonosyllabic) && (isVeryBrief || singleWord)) {
      return 0.68 + (singleWord ? 0.15 : 0);
    }
    return 0;
  }

  /**
   * 7. FORCED_POSITIVITY
   * User forces cheerfulness to avoid negative emotions
   */
  detectForcedPositivity(signals, voiceEmotion, textContent) {
    const isSadOrAnxious = (voiceEmotion.emotion === 'sad' || voiceEmotion.emotion === 'anxious') &&
                           voiceEmotion.confidence > 0.6;
    const hasExcessivePositivity = (textContent.match(/!/g) || []).length >= 2;
    const hasPositiveWords = /amazing|great|wonderful|fantastic|perfect|awesome|excellent/i.test(textContent);
    const highPositiveSentiment = signals.sentimentPolarity > 0.5;

    if (isSadOrAnxious && (hasExcessivePositivity || (hasPositiveWords && highPositiveSentiment))) {
      return 0.73 + (hasExcessivePositivity ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 8. INTELLECTUAL_DISTANCING
   * User intellectualizes emotions to avoid feeling them
   */
  detectIntellectualDistancing(signals, voiceEmotion, textContent) {
    const isSadOrAnxious = (voiceEmotion.emotion === 'sad' || voiceEmotion.emotion === 'anxious') &&
                           voiceEmotion.confidence > 0.65;
    const hasIntellectual = /psychologically|theoretically|objectively|scientifically|rationally|logically|analysis|studies?|research/i.test(textContent);
    const hasAbstract = /concept|theory|idea|perspective|framework|paradigm/i.test(textContent);
    const lowSelfFocus = signals.selfFocus < 0.4;
    const highComplexity = signals.cognitiveComplexity > 0.6;

    if (isSadOrAnxious && (hasIntellectual || (hasAbstract && highComplexity))) {
      return 0.71 + (lowSelfFocus ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 9. HELP_SEEKING_DISGUISED
   * User needs help but doesn't ask directly
   */
  detectHelpSeekingDisguised(signals, voiceEmotion, textContent) {
    const isAnxiousVoice = voiceEmotion.emotion === 'anxious' && voiceEmotion.confidence > 0.65;
    const hasIndirect = /just wondering|if someone|hypothetically|what would you|what if|imagine if/i.test(textContent);
    const hasHesitation = signals.hesitationLevel > 0.3 || signals.uncertaintyLevel > 0.5;
    const hasQuestions = signals.questioningLevel > 0.5;

    if (isAnxiousVoice && hasIndirect) {
      return 0.74 + (hasHesitation ? 0.1 : 0);
    }

    // Alternative: high uncertainty + questions but indirect
    if (hasHesitation && hasQuestions && hasIndirect) {
      return 0.65;
    }

    return 0;
  }

  /**
   * 10. EMOTIONAL_FLOODING
   * Multiple intense emotions at once, creating incoherence
   */
  detectEmotionalFlooding(signals, voiceEmotion, textContent) {
    const highEmotionalIntensity = signals.emotionalIntensity > 0.7;
    const hasIncoherence = (textContent.match(/\.\.\.|\u2014|\u2026/g) || []).length >= 2;
    const hasRunOn = textContent.length > 100 && (textContent.match(/[.!?]/g) || []).length <= 1;
    const hasFillers = (textContent.match(/\bjust\b|\blike\b|\bi mean\b|\byou know\b/gi) || []).length >= 3;
    const highUncertainty = signals.uncertaintyLevel > 0.6;

    if ((highEmotionalIntensity || highUncertainty) && (hasIncoherence || hasRunOn || hasFillers)) {
      return 0.76 + (hasRunOn ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 11. GUILT_MASKING
   * User feels guilty but presents as angry or defensive
   */
  detectGuiltMasking(signals, voiceEmotion, textContent) {
    const isAnxiousOrAngry = (voiceEmotion.emotion === 'anxious' || voiceEmotion.emotion === 'angry') &&
                             voiceEmotion.confidence > 0.6;
    const hasJustification = /because|but you|you didn't|you should have|if you had/i.test(textContent);
    const hasBlameShift = /your fault|you never|you always|you should/i.test(textContent);
    const hasDefensiveness = /i had to|i didn't mean to|it's not my fault/i.test(textContent);

    if (isAnxiousOrAngry && (hasJustification || hasBlameShift || hasDefensiveness)) {
      return 0.69 + (hasBlameShift ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 12. JOY_SUPPRESSION
   * User hides positive emotions due to context or social norms
   */
  detectJoySuppression(signals, voiceEmotion, textContent) {
    const isHappyVoice = voiceEmotion.emotion === 'happy' && voiceEmotion.confidence > 0.6;
    const hasApology = /sorry|i mean|i guess|not to brag|don't want to|shouldn't be/i.test(textContent);
    const isNeutralText = signals.sentimentPolarity > -0.2 && signals.sentimentPolarity < 0.3;
    const hasMinimizing = /just|only|a little|somewhat|fairly/i.test(textContent);

    if (isHappyVoice && (hasApology || isNeutralText || hasMinimizing)) {
      return 0.70 + (hasApology ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 13. TRAUMA_RESPONSE
   * User dissociates or becomes hyper-vigilant
   */
  detectTraumaResponse(signals, voiceEmotion, textContent) {
    const isFlatVoice = voiceEmotion.emotion === 'neutral' && voiceEmotion.confidence > 0.7;
    const hasDetachment = /and then|the person|they|it happened|it was/i.test(textContent);
    const hasThirdPerson = /\b(he|she|they|the person|someone)\b/gi.test(textContent) &&
                           !/\b(i|me|my)\b/i.test(textContent);
    const lowSelfFocus = signals.selfFocus < 0.3;
    const pastFocus = signals.pastFocus > 0.6;

    if (isFlatVoice && (hasThirdPerson || (hasDetachment && lowSelfFocus))) {
      return 0.77 + (hasThirdPerson ? 0.1 : 0);
    }

    // Alternative: describing traumatic event in detached way
    if (pastFocus && hasDetachment && lowSelfFocus) {
      return 0.65;
    }

    return 0;
  }

  /**
   * 14. PERFORMATIVE_EMOTION
   * User performs emotion for effect, not genuinely felt
   */
  detectPerformativeEmotion(signals, voiceEmotion, textContent) {
    const isExaggeratedVoice = voiceEmotion.confidence > 0.85;
    const hasExcessiveCaps = (textContent.match(/\b[A-Z]{2,}\b/g) || []).length >= 2;
    const hasExcessivePunctuation = (textContent.match(/[!?]{2,}/g) || []).length >= 1;
    const veryHighEmphasis = signals.emphasisLevel > 0.7;
    const hasPerformative = /oh my god|i can't even|literally dying|so dramatic/i.test(textContent);

    if ((isExaggeratedVoice || hasExcessiveCaps || hasExcessivePunctuation) &&
        (veryHighEmphasis || hasPerformative)) {
      return 0.72 + (hasPerformative ? 0.1 : 0);
    }
    return 0;
  }

  /**
   * 15. RESIGNATION_ACCEPTANCE
   * User has given up, presenting as calm acceptance
   */
  detectResignationAcceptance(signals, voiceEmotion, textContent) {
    const isSadFlat = voiceEmotion.emotion === 'sad' && voiceEmotion.confidence > 0.5;
    const hasResignation = /doesn't matter|whatever|fine|i don't care|it is what it is|nothing i can do/i.test(textContent);
    const hasGivingUp = /give up|giving up|can't anymore|done trying|no point/i.test(textContent);
    const lowEmotionalIntensity = signals.emotionalIntensity < 0.3;

    if ((isSadFlat || lowEmotionalIntensity) && (hasResignation || hasGivingUp)) {
      return 0.75 + (hasGivingUp ? 0.15 : 0);
    }
    return 0;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get pattern description
   */
  getDescription(patternName) {
    const descriptions = {
      DEFENSIVE_DEFLECTION: 'Deflecting emotional topics with humor or questions',
      VULNERABILITY_MASKING: 'Minimizing deep emotional pain verbally',
      EXCITEMENT_DAMPENING: 'Downplaying genuine excitement',
      ANGER_LEAKAGE: 'Suppressed anger showing through passive-aggression',
      ANXIETY_PROJECTION: 'Projecting own anxiety onto others',
      OVERWHELM_SHUTDOWN: 'Emotional flooding causing withdrawal',
      FORCED_POSITIVITY: 'Forcing cheerfulness to mask distress',
      INTELLECTUAL_DISTANCING: 'Using intellect to avoid feeling emotions',
      HELP_SEEKING_DISGUISED: 'Indirect help requests',
      EMOTIONAL_FLOODING: 'Multiple intense emotions causing incoherence',
      GUILT_MASKING: 'Guilt expressed as anger or defensiveness',
      JOY_SUPPRESSION: 'Hiding positive emotions inappropriately',
      TRAUMA_RESPONSE: 'Dissociation or hyper-vigilance activation',
      PERFORMATIVE_EMOTION: 'Emotion performed for effect, not genuine',
      RESIGNATION_ACCEPTANCE: 'Hopelessness masked as calm acceptance'
    };
    return descriptions[patternName] || 'Unknown pattern';
  }

  /**
   * Get severity level
   */
  getSeverity(patternName, confidence) {
    const highSeverityPatterns = [
      'OVERWHELM_SHUTDOWN',
      'EMOTIONAL_FLOODING',
      'TRAUMA_RESPONSE',
      'RESIGNATION_ACCEPTANCE'
    ];

    if (highSeverityPatterns.includes(patternName) && confidence > 0.7) {
      return 'HIGH';
    }

    if (confidence > 0.8) {
      return 'MODERATE';
    }

    return 'LOW';
  }
}

// Singleton instance
export const advancedCongruenceDetector = new AdvancedCongruenceDetector();
