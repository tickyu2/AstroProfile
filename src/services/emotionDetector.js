/**
 * ============================================================================
 * PLUTCHIK EMOTION DETECTOR
 * ============================================================================
 * Full 8-primary emotion detection with 24 compound emotions.
 * Integrates text analysis with voice prosody for multimodal detection.
 * Enhanced with voice-text congruence detection (Week 3).
 *
 * Plutchik's Wheel of Emotions:
 * - 8 Primary: Joy, Trust, Fear, Surprise, Sadness, Disgust, Anger, Anticipation
 * - 24 Compounds: Love (joy+trust), Optimism (joy+anticipation), etc.
 *
 * Week 3 Enhancements:
 * - Voice prosody to emotion mapping
 * - Voice-text congruence detection
 * - Hidden emotion identification
 * - Authenticity scoring
 *
 * Created: December 30, 2025
 * Updated: December 30, 2025 - Week 3 Voice Integration
 * Mission: Best AI Companion Award - Emotional Responsiveness
 * ============================================================================
 */

class PlutchikEmotionDetector {
  constructor() {
    // Congruence threshold - if difference > 0.3, emotions don't match
    this.congruenceThreshold = 0.3;

    // Masking patterns for hidden emotion detection
    this.maskingPatterns = {
      fine_masking: { keywords: ['fine', 'okay', 'alright', "i'm good"], voiceEmotion: 'sadness' },
      happy_masking: { keywords: ['happy', 'great', 'awesome'], voiceEmotion: 'fear' },
      calm_masking: { keywords: ['calm', 'no problem', 'whatever'], voiceEmotion: 'anger' }
    };
    // Keyword dictionaries for each primary emotion
    this.keywords = {
      joy: [
        'happy', 'joyful', 'delighted', 'pleased', 'cheerful', 'glad',
        'wonderful', 'amazing', 'fantastic', 'great', 'excellent', 'love it',
        'excited', 'thrilled', 'elated', 'ecstatic', 'overjoyed', 'blissful',
        'content', 'satisfied', 'grateful', 'blessed', 'fortunate', 'lucky',
        'laughing', 'smiling', 'beaming', 'glowing', 'radiant', 'bright',
        'yay', 'woohoo', 'awesome', 'brilliant', 'superb', 'magnificent'
      ],

      trust: [
        'trust', 'believe', 'faith', 'confident', 'safe', 'secure',
        'reliable', 'count on', 'depend', 'admire', 'respect', 'honest',
        'authentic', 'genuine', 'loyal', 'faithful', 'devoted', 'committed',
        'trustworthy', 'credible', 'sincere', 'true', 'real', 'valid',
        'accepting', 'open', 'vulnerable', 'intimate', 'close', 'connected'
      ],

      fear: [
        'afraid', 'scared', 'worried', 'anxious', 'nervous', 'frightened',
        'terrified', 'panicked', 'uneasy', 'concerned', 'fearful', 'stressed',
        'dread', 'horror', 'terror', 'alarm', 'shock', 'fright',
        'apprehensive', 'tense', 'edgy', 'jumpy', 'paranoid', 'phobic',
        'insecure', 'vulnerable', 'helpless', 'powerless', 'threatened', 'unsafe'
      ],

      surprise: [
        'surprised', 'shocked', 'unexpected', 'wow', 'no way', 'really',
        'oh my god', 'amazing', 'astonished', 'startled', 'caught off guard',
        'stunned', 'speechless', 'taken aback', 'bewildered', 'dumbfounded',
        'flabbergasted', 'gobsmacked', 'mind blown', 'whoa', 'holy',
        'incredible', 'unbelievable', 'inconceivable', "can't believe"
      ],

      sadness: [
        'sad', 'down', 'depressed', 'unhappy', 'miserable', 'heartbroken',
        'devastated', 'grief', 'sorrow', 'melancholy', 'lonely', 'hurt',
        'crying', 'tears', 'weeping', 'mourning', 'grieving', 'bereft',
        'dejected', 'despondent', 'hopeless', 'despair', 'anguish', 'pain',
        'empty', 'hollow', 'numb', 'lost', 'abandoned', 'rejected',
        'disappointed', 'let down', 'crushed', 'broken', 'shattered'
      ],

      disgust: [
        'disgusted', 'repulsed', 'revolted', 'gross', 'sick', 'nauseated',
        "can't stand", 'hate', 'despise', 'detest', 'loathe', 'abhor',
        'repugnant', 'vile', 'foul', 'nasty', 'horrible', 'awful',
        'appalling', 'repellent', 'offensive', 'distasteful', 'yuck', 'ew',
        'disgusting', 'sickening', 'revolting', 'hideous', 'grotesque'
      ],

      anger: [
        'angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated',
        'enraged', 'pissed', 'outraged', 'livid', 'seething', 'hostile',
        'irate', 'incensed', 'infuriated', 'fuming', 'raging', 'wrathful',
        'bitter', 'resentful', 'vengeful', 'hateful', 'spiteful', 'vindictive',
        'aggressive', 'violent', 'fierce', 'brutal', 'savage', 'vicious',
        'fed up', 'had enough', 'sick of', 'tired of'
      ],

      anticipation: [
        'excited for', 'looking forward', "can't wait", 'anticipating',
        'expecting', 'eager', 'ready for', 'watching for', 'preparing',
        'upcoming', 'soon', 'next', 'future', 'gonna', 'will', 'planning',
        'hoping', 'wishing', 'dreaming', 'longing', 'yearning', 'craving',
        'impatient', 'restless', 'antsy', 'on edge', 'waiting', 'pending',
        'about to', 'going to', 'tomorrow', 'later', 'eventually', 'someday'
      ]
    };

    // Compound emotion formulas (adjacent pairs on Plutchik's wheel)
    this.compoundFormulas = {
      // Primary dyads (adjacent emotions)
      love: { components: ['joy', 'trust'], threshold: 0.5 },
      optimism: { components: ['joy', 'anticipation'], threshold: 0.5 },
      aggressiveness: { components: ['anger', 'anticipation'], threshold: 0.5 },
      contempt: { components: ['anger', 'disgust'], threshold: 0.5 },
      remorse: { components: ['sadness', 'disgust'], threshold: 0.5 },
      disapproval: { components: ['sadness', 'surprise'], threshold: 0.5 },
      awe: { components: ['fear', 'surprise'], threshold: 0.5 },
      submission: { components: ['fear', 'trust'], threshold: 0.5 },

      // Secondary dyads (one emotion apart)
      delight: { components: ['joy', 'surprise'], threshold: 0.4 },
      hope: { components: ['anticipation', 'trust'], threshold: 0.4 },
      pride: { components: ['joy', 'anger'], threshold: 0.4 },
      anxiety: { components: ['fear', 'anticipation'], threshold: 0.4 },
      envy: { components: ['sadness', 'anger'], threshold: 0.4 },
      pessimism: { components: ['sadness', 'anticipation'], threshold: 0.4 },
      cynicism: { components: ['disgust', 'anticipation'], threshold: 0.4 },
      morbidness: { components: ['disgust', 'joy'], threshold: 0.4 },

      // Tertiary dyads (two emotions apart)
      curiosity: { components: ['trust', 'surprise'], threshold: 0.35 },
      unbelief: { components: ['disgust', 'surprise'], threshold: 0.35 },
      outrage: { components: ['anger', 'surprise'], threshold: 0.35 },
      guilt: { components: ['joy', 'fear'], threshold: 0.35 },
      bittersweetness: { components: ['joy', 'sadness'], threshold: 0.35 },
      sentimentality: { components: ['trust', 'sadness'], threshold: 0.35 },
      shame: { components: ['fear', 'disgust'], threshold: 0.35 },
      dominance: { components: ['anger', 'trust'], threshold: 0.35 }
    };
  }

  /**
   * Main detection function - analyzes text and optional voice prosody
   * @param {string} text - The text to analyze
   * @param {object} voiceProsody - Optional voice prosody data
   * @returns {object} Complete emotion analysis
   */
  detectAllEmotions(text, voiceProsody = null) {
    if (!text || typeof text !== 'string') {
      return this.createNeutralResult();
    }

    const normalizedText = text.toLowerCase();

    // Detect all 8 primary emotions
    const primaryEmotions = {
      joy: this.detectJoy(normalizedText, voiceProsody),
      trust: this.detectTrust(normalizedText, voiceProsody),
      fear: this.detectFear(normalizedText, voiceProsody),
      surprise: this.detectSurprise(normalizedText, voiceProsody),
      sadness: this.detectSadness(normalizedText, voiceProsody),
      disgust: this.detectDisgust(normalizedText, voiceProsody),
      anger: this.detectAnger(normalizedText, voiceProsody),
      anticipation: this.detectAnticipation(normalizedText, voiceProsody)
    };

    // Detect from voice only (for congruence analysis)
    let voiceEmotions = null;
    let congruenceAnalysis = null;
    let authenticity = 0.7; // Default without voice

    if (voiceProsody) {
      // Map voice to emotions
      voiceEmotions = this.mapVoiceToEmotions(voiceProsody);

      // Blend text + voice emotions (60% voice, 40% text)
      const blendedEmotions = this.blendEmotions(primaryEmotions, voiceEmotions);

      // Detect congruence
      congruenceAnalysis = this.detectCongruence(primaryEmotions, voiceEmotions, text);

      // Use blended for final analysis
      const dominant = this.findDominant(blendedEmotions);
      const compounds = this.detectCompounds(blendedEmotions);
      const confidence = this.calculateConfidence(blendedEmotions, compounds);

      return {
        primary: dominant.emotion,
        intensity: Math.round(dominant.score * 10),
        secondary: this.mapToSecondary(dominant.emotion, dominant.score),
        compounds,
        plutchikVector: blendedEmotions,
        confidence,
        timestamp: Date.now(),
        // Week 3: Voice analysis
        voiceAnalysis: {
          textEmotions: primaryEmotions,
          voiceEmotions: voiceEmotions,
          congruence: congruenceAnalysis
        },
        authenticity: congruenceAnalysis.authenticity
      };
    }

    // No voice - use text only
    const dominant = this.findDominant(primaryEmotions);
    const compounds = this.detectCompounds(primaryEmotions);
    const confidence = this.calculateConfidence(primaryEmotions, compounds);

    return {
      primary: dominant.emotion,
      intensity: Math.round(dominant.score * 10),
      secondary: this.mapToSecondary(dominant.emotion, dominant.score),
      compounds,
      plutchikVector: primaryEmotions,
      confidence,
      timestamp: Date.now(),
      authenticity: 0.7 // Lower without voice confirmation
    };
  }

  /**
   * Map voice prosody to all 8 Plutchik emotions
   */
  mapVoiceToEmotions(voice) {
    if (!voice) return this.getNeutralVector();

    return {
      joy: this.mapVoiceJoy(voice),
      trust: this.mapVoiceTrust(voice),
      fear: this.mapVoiceFear(voice),
      surprise: this.mapVoiceSurprise(voice),
      sadness: this.mapVoiceSadness(voice),
      disgust: this.mapVoiceDisgust(voice),
      anger: this.mapVoiceAnger(voice),
      anticipation: this.mapVoiceAnticipation(voice)
    };
  }

  mapVoiceJoy(v) {
    let s = 0;
    if (v.energy === 'high') s += 0.3;
    if (v.pitch === 'rising') s += 0.25;
    if (v.rate === 'fast') s += 0.2;
    if (v.quality === 'bright' || v.quality === 'clear') s += 0.15;
    if (v.laughter) s += 0.4;
    return Math.min(1, s);
  }

  mapVoiceTrust(v) {
    let s = 0;
    if (v.energy === 'medium') s += 0.25;
    if (v.pitch === 'stable') s += 0.3;
    if (v.rate === 'normal') s += 0.2;
    if (v.quality === 'warm' || v.quality === 'smooth') s += 0.25;
    return Math.min(1, s);
  }

  mapVoiceFear(v) {
    let s = 0;
    if (v.pitch === 'shaky' || v.pitch === 'unstable') s += 0.35;
    if (v.quality === 'tense' || v.quality === 'strained') s += 0.3;
    if (v.rate === 'fast' || v.rate === 'irregular') s += 0.2;
    if (v.pauses === 'hesitant') s += 0.2;
    return Math.min(1, s);
  }

  mapVoiceSurprise(v) {
    let s = 0;
    if (v.energySpike || v.pitchSpike) s += 0.4;
    if (v.energy === 'high') s += 0.15;
    if (v.pitch === 'rising') s += 0.15;
    return Math.min(1, s);
  }

  mapVoiceSadness(v) {
    let s = 0;
    if (v.energy === 'low' || v.energy === 'very_low') s += 0.35;
    if (v.pitch === 'falling' || v.pitch === 'low') s += 0.25;
    if (v.rate === 'slow') s += 0.25;
    if (v.quality === 'breathy' || v.quality === 'soft') s += 0.2;
    if (v.sighs) s += 0.3;
    if (v.pauses === 'long') s += 0.2;
    return Math.min(1, s);
  }

  mapVoiceDisgust(v) {
    let s = 0;
    if (v.pitch === 'flat') s += 0.25;
    if (v.quality === 'harsh' || v.quality === 'sharp') s += 0.3;
    return Math.min(1, s);
  }

  mapVoiceAnger(v) {
    let s = 0;
    if (v.energy === 'high' || v.energy === 'very_high') s += 0.3;
    if (v.pitch === 'sharp' || v.pitch === 'rising') s += 0.2;
    if (v.quality === 'harsh' || v.quality === 'strained') s += 0.3;
    if (v.volume === 'loud') s += 0.2;
    return Math.min(1, s);
  }

  mapVoiceAnticipation(v) {
    let s = 0;
    if (v.energy === 'high' || v.energyIncreasing) s += 0.25;
    if (v.pitch === 'rising') s += 0.3;
    if (v.rate === 'fast' || v.rate === 'increasing') s += 0.2;
    return Math.min(1, s);
  }

  getNeutralVector() {
    return { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0 };
  }

  /**
   * Blend text and voice emotions (60% voice, 40% text)
   */
  blendEmotions(textEmotions, voiceEmotions) {
    const blended = {};
    for (const emotion of Object.keys(textEmotions)) {
      blended[emotion] = textEmotions[emotion] * 0.4 + (voiceEmotions[emotion] || 0) * 0.6;
    }
    return blended;
  }

  /**
   * Detect voice-text congruence and hidden emotions
   */
  detectCongruence(textEmotions, voiceEmotions, originalText) {
    const textDominant = this.findDominant(textEmotions);
    const voiceDominant = this.findDominant(voiceEmotions);

    // Calculate congruence using cosine similarity
    const congruenceScore = this.calculateCosineSimilarity(textEmotions, voiceEmotions);
    const isCongruent = congruenceScore >= (1 - this.congruenceThreshold);

    // Detect hidden emotion
    let hiddenEmotion = null;
    if (!isCongruent && voiceDominant.score > textDominant.score + 0.2) {
      hiddenEmotion = voiceDominant.emotion;
    }

    // Detect masking pattern
    const maskingPattern = this.detectMaskingPattern(originalText, voiceDominant);

    // Calculate authenticity
    let authenticity = 0.9;
    if (!isCongruent) {
      const textNeutral = textDominant.emotion === 'neutral' || textDominant.score < 0.3;
      authenticity = (textNeutral && voiceDominant.score > 0.6) ? 0.85 : 0.5;
    }

    return {
      isCongruent,
      congruenceScore,
      hiddenEmotion,
      dominantSource: voiceDominant.score > textDominant.score ? 'voice' : 'text',
      authenticity,
      textEmotion: textDominant,
      voiceEmotion: voiceDominant,
      maskingPattern
    };
  }

  calculateCosineSimilarity(vec1, vec2) {
    const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];
    let dot = 0, mag1 = 0, mag2 = 0;
    emotions.forEach(e => {
      const v1 = vec1[e] || 0, v2 = vec2[e] || 0;
      dot += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    });
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    return (mag1 === 0 || mag2 === 0) ? 0.5 : dot / (mag1 * mag2);
  }

  detectMaskingPattern(text, voiceDominant) {
    const lowerText = text.toLowerCase();
    for (const [name, pattern] of Object.entries(this.maskingPatterns)) {
      const hasKeyword = pattern.keywords.some(kw => lowerText.includes(kw));
      const hasVoiceEmotion = voiceDominant.emotion === pattern.voiceEmotion && voiceDominant.score > 0.5;
      if (hasKeyword && hasVoiceEmotion) {
        return { pattern: name, voiceShows: pattern.voiceEmotion, confidence: voiceDominant.score };
      }
    }
    return null;
  }

  /**
   * Detect JOY
   */
  detectJoy(text, voice) {
    let score = 0;

    // Text analysis
    this.keywords.joy.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // Exclamation marks indicate excitement
    const exclamations = (text.match(/!/g) || []).length;
    score += Math.min(exclamations * 0.05, 0.2);

    // Positive emoji patterns
    if (/[:;][\-]?[)D]|:3|<3|\^[\-_]?\^|😊|😄|😃|🎉|💖/.test(text)) {
      score += 0.15;
    }

    // Voice prosody integration
    if (voice) {
      if (voice.energy === 'high') score += 0.2;
      if (voice.pitch === 'rising') score += 0.15;
      if (voice.rate === 'fast') score += 0.1;
      if (voice.quality === 'warm' || voice.quality === 'smooth') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect TRUST
   */
  detectTrust(text, voice) {
    let score = 0;

    this.keywords.trust.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // First-person vulnerability indicators
    if (/i feel|i think|honestly|to be honest|between us|secret|confide/.test(text)) {
      score += 0.15;
    }

    // Voice prosody
    if (voice) {
      if (voice.quality === 'warm' || voice.quality === 'smooth') score += 0.2;
      if (voice.pitch === 'stable') score += 0.15;
      if (voice.energy === 'medium') score += 0.1;
      if (voice.rate === 'slow' || voice.rate === 'normal') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect FEAR
   */
  detectFear(text, voice) {
    let score = 0;

    this.keywords.fear.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // Fear-related patterns
    if (/what if|might|could|maybe bad|something wrong/.test(text)) {
      score += 0.1;
    }

    // Questions indicate uncertainty/anxiety
    const questions = (text.match(/\?/g) || []).length;
    score += Math.min(questions * 0.03, 0.1);

    // Voice prosody
    if (voice) {
      if (voice.pitch === 'shaky' || voice.pitch === 'rising') score += 0.2;
      if (voice.quality === 'tense' || voice.quality === 'strained') score += 0.2;
      if (voice.rate === 'fast') score += 0.1;
      if (voice.pauses === 'hesitant') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect SURPRISE
   */
  detectSurprise(text, voice) {
    let score = 0;

    this.keywords.surprise.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // Surprise punctuation
    if (/\?!|!\?|!!!/.test(text)) score += 0.15;

    // Interjections
    if (/^(oh|wow|whoa|omg|wtf|what)\b/i.test(text)) score += 0.15;

    // Voice prosody
    if (voice) {
      if (voice.pitch === 'rising') score += 0.2;
      if (voice.energy === 'high') score += 0.15;
      if (voice.volume === 'loud') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect SADNESS
   */
  detectSadness(text, voice) {
    let score = 0;

    this.keywords.sadness.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // Sad emoji patterns
    if (/[:;][\-]?[\(\/]|😢|😭|💔|😞|😔/.test(text)) {
      score += 0.15;
    }

    // Ellipsis can indicate trailing off, sadness
    const ellipsis = (text.match(/\.\.\./g) || []).length;
    score += Math.min(ellipsis * 0.05, 0.1);

    // Voice prosody
    if (voice) {
      if (voice.energy === 'low') score += 0.2;
      if (voice.pitch === 'falling' || voice.pitch === 'flat') score += 0.15;
      if (voice.rate === 'slow') score += 0.15;
      if (voice.quality === 'breathy') score += 0.1;
      if (voice.pauses === 'long' || voice.pauses === 'frequent') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect DISGUST
   */
  detectDisgust(text, voice) {
    let score = 0;

    this.keywords.disgust.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // Disgust expressions
    if (/ugh|ew+|yuck|bleh|blegh|🤮|🤢/.test(text)) {
      score += 0.2;
    }

    // Voice prosody
    if (voice) {
      if (voice.quality === 'strained') score += 0.15;
      if (voice.pitch === 'falling') score += 0.1;
      if (voice.rate === 'slow') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect ANGER
   */
  detectAnger(text, voice) {
    let score = 0;

    this.keywords.anger.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // All caps indicates shouting/anger
    const capsWords = text.split(' ').filter(w => w === w.toUpperCase() && w.length > 2);
    score += Math.min(capsWords.length * 0.08, 0.2);

    // Profanity patterns (censored)
    if (/f[\*u]ck|sh[\*i]t|damn|hell|wtf|bs|crap/.test(text)) {
      score += 0.15;
    }

    // Angry emoji
    if (/😠|😡|🤬|💢/.test(text)) score += 0.15;

    // Voice prosody
    if (voice) {
      if (voice.energy === 'high') score += 0.15;
      if (voice.volume === 'loud') score += 0.2;
      if (voice.rate === 'fast') score += 0.1;
      if (voice.quality === 'tense' || voice.quality === 'strained') score += 0.15;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect ANTICIPATION
   */
  detectAnticipation(text, voice) {
    let score = 0;

    this.keywords.anticipation.forEach(keyword => {
      if (text.includes(keyword)) score += 0.12;
    });

    // Future tense indicators
    if (/will|gonna|going to|about to|plan to|hope to|want to/.test(text)) {
      score += 0.1;
    }

    // Time references
    if (/tomorrow|next week|soon|later|upcoming|eventually/.test(text)) {
      score += 0.1;
    }

    // Voice prosody
    if (voice) {
      if (voice.pitch === 'rising') score += 0.2;
      if (voice.energy === 'high') score += 0.15;
      if (voice.rate === 'fast') score += 0.1;
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Detect compound emotions based on primary emotion scores
   */
  detectCompounds(primaryEmotions) {
    const compounds = [];

    for (const [compoundName, formula] of Object.entries(this.compoundFormulas)) {
      const [emotion1, emotion2] = formula.components;
      const score1 = primaryEmotions[emotion1] || 0;
      const score2 = primaryEmotions[emotion2] || 0;

      // Both components must exceed threshold
      if (score1 >= formula.threshold && score2 >= formula.threshold) {
        const avgScore = (score1 + score2) / 2;
        const confidence = Math.min(score1, score2) / formula.threshold;

        compounds.push({
          type: compoundName,
          intensity: Math.round(avgScore * 10),
          confidence: Math.min(1, confidence * 0.85),
          formula: `${emotion1} + ${emotion2}`
        });
      }
    }

    // Sort by intensity descending
    return compounds.sort((a, b) => b.intensity - a.intensity);
  }

  /**
   * Find the dominant primary emotion
   */
  findDominant(emotions) {
    let maxEmotion = 'neutral';
    let maxScore = 0.2; // Threshold for non-neutral

    for (const [emotion, score] of Object.entries(emotions)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    }

    return {
      emotion: maxEmotion,
      score: maxEmotion === 'neutral' ? 0.5 : maxScore
    };
  }

  /**
   * Map primary emotion to secondary refinement
   */
  mapToSecondary(primary, intensity) {
    const secondaryMap = {
      joy: intensity > 0.7 ? 'excited' : intensity > 0.4 ? 'cheerful' : 'warm',
      trust: intensity > 0.7 ? 'confident' : 'relaxed',
      fear: intensity > 0.7 ? 'overwhelmed' : intensity > 0.4 ? 'worried' : 'nervous',
      surprise: intensity > 0.7 ? 'shocked' : 'startled',
      sadness: intensity > 0.7 ? 'hurt' : intensity > 0.4 ? 'disappointed' : 'tired',
      disgust: intensity > 0.7 ? 'skeptical' : 'unimpressed',
      anger: intensity > 0.7 ? 'hostile' : intensity > 0.4 ? 'frustrated' : 'annoyed',
      anticipation: intensity > 0.7 ? 'excited' : 'curious',
      neutral: 'calm'
    };

    return secondaryMap[primary] || 'calm';
  }

  /**
   * Calculate overall confidence based on emotion clarity
   */
  calculateConfidence(primaryEmotions, compounds) {
    const scores = Object.values(primaryEmotions);
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Higher confidence when one emotion dominates
    const dominanceRatio = maxScore / (avgScore + 0.001);

    // Compound detection adds confidence
    const compoundBonus = Math.min(compounds.length * 0.05, 0.15);

    return Math.min(1, (dominanceRatio * 0.3) + (maxScore * 0.5) + compoundBonus);
  }

  /**
   * Create neutral result for invalid input
   */
  createNeutralResult() {
    return {
      primary: 'neutral',
      intensity: 5,
      secondary: 'calm',
      compounds: [],
      plutchikVector: {
        joy: 0,
        trust: 0,
        fear: 0,
        surprise: 0,
        sadness: 0,
        disgust: 0,
        anger: 0,
        anticipation: 0
      },
      confidence: 0.5,
      timestamp: Date.now()
    };
  }

  /**
   * Convert plutchikVector to array format for PostgreSQL
   * Order: joy, trust, fear, surprise, sadness, disgust, anger, anticipation
   */
  vectorToArray(plutchikVector) {
    return [
      plutchikVector.joy,
      plutchikVector.trust,
      plutchikVector.fear,
      plutchikVector.surprise,
      plutchikVector.sadness,
      plutchikVector.disgust,
      plutchikVector.anger,
      plutchikVector.anticipation
    ];
  }

  /**
   * Format vector for PostgreSQL pgvector
   */
  formatVectorForDB(plutchikVector) {
    const arr = this.vectorToArray(plutchikVector);
    return `[${arr.join(',')}]`;
  }
}

export default PlutchikEmotionDetector;
