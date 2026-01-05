/**
 * ============================================================================
 * VOICE PROSODY TO PLUTCHIK EMOTION MAPPER
 * ============================================================================
 * Maps voice characteristics (energy, pitch, rate, quality) to all 8 Plutchik
 * primary emotions. Used for multimodal emotion detection.
 *
 * Voice signatures:
 * - JOY: High energy, rising pitch, fast tempo, clear/bright quality
 * - TRUST: Medium energy, stable pitch, moderate tempo, warm/smooth quality
 * - FEAR: Variable energy, shaky pitch, fast/irregular tempo, tense quality
 * - SURPRISE: Energy spike, pitch spike, rate change, sharp quality
 * - SADNESS: Low energy, falling pitch, slow tempo, breathy quality
 * - DISGUST: Variable energy, flat pitch, harsh quality
 * - ANGER: High energy, rising pitch, fast tempo, harsh quality
 * - ANTICIPATION: Rising energy, rising pitch, increasing tempo
 *
 * Created: December 30, 2025
 * Week 3: Voice Prosody Enhancement
 * ============================================================================
 */

class VoiceProsodyMapper {
  /**
   * Map voice prosody to all 8 Plutchik emotions
   * @param {object} voiceProsody - Voice characteristics
   * @returns {object} Plutchik emotion vector { joy, trust, fear, ... }
   */
  mapProsodyToEmotions(voiceProsody) {
    if (!voiceProsody) {
      return this.getNeutralVector();
    }

    return {
      joy: this.detectJoyFromVoice(voiceProsody),
      trust: this.detectTrustFromVoice(voiceProsody),
      fear: this.detectFearFromVoice(voiceProsody),
      surprise: this.detectSurpriseFromVoice(voiceProsody),
      sadness: this.detectSadnessFromVoice(voiceProsody),
      disgust: this.detectDisgustFromVoice(voiceProsody),
      anger: this.detectAngerFromVoice(voiceProsody),
      anticipation: this.detectAnticipationFromVoice(voiceProsody)
    };
  }

  /**
   * JOY voice signature:
   * - High energy
   * - Rising pitch
   * - Fast tempo
   * - Clear/bright quality
   * - Laughter
   */
  detectJoyFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'high') score += 0.3;
    else if (voice.energy === 'medium') score += 0.1;
    else if (voice.energy === 'very_high') score += 0.25;

    // Pitch
    if (voice.pitch === 'rising') score += 0.25;
    else if (voice.pitch === 'high') score += 0.15;
    else if (voice.pitch === 'varied') score += 0.1;

    // Rate
    if (voice.rate === 'fast') score += 0.2;
    else if (voice.rate === 'normal') score += 0.1;

    // Quality
    if (voice.quality === 'clear' || voice.quality === 'bright') score += 0.15;
    else if (voice.quality === 'warm') score += 0.1;

    // Laughter detection
    if (voice.laughter) score += 0.4;
    if (voice.smiling) score += 0.2;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * TRUST voice signature:
   * - Medium energy
   * - Stable pitch
   * - Moderate tempo
   * - Warm/smooth quality
   */
  detectTrustFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'medium') score += 0.25;
    else if (voice.energy === 'high') score += 0.1;

    // Pitch
    if (voice.pitch === 'stable') score += 0.3;
    else if (voice.pitch === 'normal') score += 0.15;

    // Rate
    if (voice.rate === 'normal') score += 0.2;
    else if (voice.rate === 'slow') score += 0.15;

    // Quality
    if (voice.quality === 'warm' || voice.quality === 'smooth') score += 0.25;
    else if (voice.quality === 'clear') score += 0.1;

    // Consistent delivery
    if (voice.consistency === 'high') score += 0.15;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * FEAR voice signature:
   * - Variable energy
   * - Unstable/shaky pitch
   * - Fast/irregular tempo
   * - Tense/strained quality
   * - Frequent pauses
   */
  detectFearFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'high') score += 0.15;
    else if (voice.energy === 'medium') score += 0.2;
    else if (voice.energy === 'variable') score += 0.25;

    // Pitch
    if (voice.pitch === 'unstable' || voice.pitch === 'shaky') score += 0.35;
    else if (voice.pitch === 'rising') score += 0.15;
    else if (voice.pitch === 'trembling') score += 0.4;

    // Rate
    if (voice.rate === 'fast') score += 0.2;
    else if (voice.rate === 'irregular') score += 0.25;

    // Quality
    if (voice.quality === 'tense' || voice.quality === 'strained') score += 0.3;
    else if (voice.quality === 'breathy') score += 0.15;
    else if (voice.quality === 'quivering') score += 0.35;

    // Pauses/hesitations
    if (voice.pauses === 'frequent' || voice.pauses === 'hesitant') score += 0.2;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * SURPRISE voice signature:
   * - Sudden energy spike
   * - Pitch spike
   * - Rate change
   * - Sharp/exclamatory quality
   */
  detectSurpriseFromVoice(voice) {
    let score = 0;

    // Energy spike
    if (voice.energySpike) score += 0.4;
    else if (voice.energy === 'high') score += 0.15;
    else if (voice.energy === 'sudden_high') score += 0.35;

    // Pitch spike
    if (voice.pitchSpike || voice.pitch === 'sudden_high') score += 0.4;
    else if (voice.pitch === 'rising') score += 0.15;
    else if (voice.pitch === 'high') score += 0.1;

    // Rate change
    if (voice.rateChange) score += 0.2;
    if (voice.rate === 'sudden_stop') score += 0.15;

    // Quality
    if (voice.quality === 'sharp') score += 0.15;
    if (voice.quality === 'exclamatory') score += 0.2;

    // Interjection sounds
    if (voice.interjection) score += 0.3;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * SADNESS voice signature:
   * - Low energy
   * - Falling/low pitch
   * - Slow tempo
   * - Breathy/soft quality
   * - Sighs, long pauses
   */
  detectSadnessFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'low') score += 0.35;
    else if (voice.energy === 'very_low') score += 0.4;

    // Pitch
    if (voice.pitch === 'falling') score += 0.25;
    else if (voice.pitch === 'low') score += 0.3;
    else if (voice.pitch === 'flat') score += 0.2;

    // Rate
    if (voice.rate === 'slow') score += 0.25;
    else if (voice.rate === 'very_slow') score += 0.3;

    // Quality
    if (voice.quality === 'breathy' || voice.quality === 'soft') score += 0.2;
    else if (voice.quality === 'monotone') score += 0.15;
    else if (voice.quality === 'weak') score += 0.25;

    // Sighs
    if (voice.sighs) score += 0.3;

    // Long pauses
    if (voice.pauses === 'long') score += 0.2;
    if (voice.pauses === 'frequent') score += 0.1;

    // Crying indicators
    if (voice.crying) score += 0.5;
    if (voice.cracking) score += 0.3;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * DISGUST voice signature:
   * - Variable energy
   * - Flat/descending pitch
   * - Sharp/harsh quality
   */
  detectDisgustFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'medium') score += 0.15;
    else if (voice.energy === 'low') score += 0.2;

    // Pitch
    if (voice.pitch === 'flat') score += 0.25;
    else if (voice.pitch === 'descending') score += 0.2;
    else if (voice.pitch === 'low') score += 0.1;

    // Quality
    if (voice.quality === 'sharp' || voice.quality === 'harsh') score += 0.3;
    else if (voice.quality === 'tense') score += 0.15;
    else if (voice.quality === 'sneering') score += 0.35;

    // Rate
    if (voice.rate === 'slow') score += 0.1;
    if (voice.rate === 'drawn_out') score += 0.15;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * ANGER voice signature:
   * - High energy
   * - Rising/sharp pitch
   * - Fast/forceful tempo
   * - Harsh/strained quality
   * - Loud volume
   */
  detectAngerFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'high') score += 0.3;
    else if (voice.energy === 'very_high') score += 0.4;

    // Pitch
    if (voice.pitch === 'rising') score += 0.2;
    else if (voice.pitch === 'sharp' || voice.pitch === 'high') score += 0.25;

    // Rate
    if (voice.rate === 'fast') score += 0.2;
    else if (voice.rate === 'forceful') score += 0.25;
    else if (voice.rate === 'clipped') score += 0.2;

    // Quality
    if (voice.quality === 'harsh' || voice.quality === 'strained') score += 0.3;
    else if (voice.quality === 'tense') score += 0.2;
    else if (voice.quality === 'growling') score += 0.35;

    // Volume
    if (voice.volume === 'loud') score += 0.2;
    if (voice.volume === 'shouting') score += 0.35;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * ANTICIPATION voice signature:
   * - Medium-high energy
   * - Rising pitch
   * - Increasing tempo
   * - Alert/eager quality
   */
  detectAnticipationFromVoice(voice) {
    let score = 0;

    // Energy
    if (voice.energy === 'high') score += 0.25;
    else if (voice.energy === 'medium') score += 0.2;
    if (voice.energyIncreasing) score += 0.2;

    // Pitch
    if (voice.pitch === 'rising') score += 0.3;
    else if (voice.pitch === 'high') score += 0.1;

    // Rate
    if (voice.rate === 'fast') score += 0.15;
    else if (voice.rate === 'increasing') score += 0.2;
    else if (voice.rate === 'eager') score += 0.2;

    // Quality
    if (voice.quality === 'alert' || voice.quality === 'eager') score += 0.2;
    else if (voice.quality === 'bright') score += 0.15;

    // Forward leaning indicators
    if (voice.breathlessness) score += 0.15;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Get neutral emotion vector
   */
  getNeutralVector() {
    return {
      joy: 0,
      trust: 0,
      fear: 0,
      surprise: 0,
      sadness: 0,
      disgust: 0,
      anger: 0,
      anticipation: 0
    };
  }

  /**
   * Get dominant emotion from voice prosody
   */
  getDominantFromVoice(voiceProsody) {
    const emotions = this.mapProsodyToEmotions(voiceProsody);

    let maxEmotion = 'neutral';
    let maxScore = 0.2; // Threshold

    for (const [emotion, score] of Object.entries(emotions)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    }

    return { emotion: maxEmotion, score: maxScore };
  }
}

module.exports = VoiceProsodyMapper;
