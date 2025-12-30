/**
 * ============================================================================
 * GENESIS SIGNAL EXTRACTOR
 * ============================================================================
 *
 * Extracts 50+ signals from user messages for archetype detection.
 * Part of the GENESIS Cathedral Emotional Architecture.
 *
 * Signal Categories:
 * - Basic metrics (length, words, sentences)
 * - Intensity markers (high/low intensity language)
 * - Emotional valence (positive/negative)
 * - Temporal focus (past/present/future)
 * - Primary emotions (joy, anger, fear, sadness)
 * - Emotional states (pain, growth, connection, boundary)
 * - Cognitive patterns (analytical, intuitive, binary, nuanced)
 * - Relational indicators (trust, vulnerability, defensiveness)
 * - Motivational patterns (approach, avoidance, urgency, purpose)
 * - Agency indicators (high/low agency)
 * - Self-reference patterns (critical/compassionate)
 * - Question analysis (types and counts)
 *
 * Part of: GENESIS Archetype Detection System
 * Created: December 29, 2024
 * ============================================================================
 */

import { LEXICONS } from './lexicons.js';

/**
 * Main SignalExtractor class
 * Processes text and extracts comprehensive signal profile
 */
export class SignalExtractor {
  constructor() {
    this.lexicons = LEXICONS;
  }

  /**
   * Extract all signals from a message
   * @param {string} message - User message to analyze
   * @returns {Object} Complete signal profile (50+ signals)
   */
  extractSignals(message) {
    if (!message || typeof message !== 'string') {
      return this.getEmptySignals();
    }

    const normalizedMessage = message.toLowerCase();
    const words = this.tokenize(message);
    const sentences = this.splitSentences(message);

    return {
      // Basic Metrics
      messageLength: message.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      averageWordLength: this.calculateAverageWordLength(words),
      averageSentenceLength: words.length / Math.max(sentences.length, 1),

      // Intensity Analysis
      intensity: this.calculateIntensity(normalizedMessage),
      intensityHigh: this.countMatches(normalizedMessage, 'intensity_high'),
      intensityLow: this.countMatches(normalizedMessage, 'intensity_low'),

      // Emotional Valence
      valence: this.calculateValence(normalizedMessage),
      positiveWords: this.countPositiveWords(normalizedMessage),
      negativeWords: this.countNegativeWords(normalizedMessage),

      // Temporal Focus
      temporalFocus: this.calculateTemporalFocus(normalizedMessage),
      pastFocus: this.countMatches(normalizedMessage, 'past_focus'),
      futureFocus: this.countMatches(normalizedMessage, 'future_focus'),
      presentFocus: this.calculatePresentFocus(normalizedMessage),

      // Primary Emotions
      joy: this.countMatches(normalizedMessage, 'joy'),
      anger: this.countMatches(normalizedMessage, 'anger'),
      fear: this.countMatches(normalizedMessage, 'fear'),
      sadness: this.countMatches(normalizedMessage, 'sadness'),
      dominantEmotion: this.getDominantEmotion(normalizedMessage),

      // Emotional States
      pain: this.countMatches(normalizedMessage, 'pain'),
      growth: this.countMatches(normalizedMessage, 'growth'),
      connection: this.countMatches(normalizedMessage, 'connection'),
      boundary: this.countMatches(normalizedMessage, 'boundary'),

      // Cognitive Patterns
      uncertainty: this.countMatches(normalizedMessage, 'uncertainty'),
      analytical: this.countMatches(normalizedMessage, 'analytical'),
      intuitive: this.countMatches(normalizedMessage, 'intuitive'),
      binary: this.countMatches(normalizedMessage, 'binary'),
      nuanced: this.countMatches(normalizedMessage, 'nuanced'),
      metaCognitive: this.countMatches(normalizedMessage, 'meta_cognitive'),
      patternSeeking: this.countMatches(normalizedMessage, 'pattern_seeking'),
      integration: this.countMatches(normalizedMessage, 'integration'),
      cognitiveStyle: this.determineCognitiveStyle(normalizedMessage),

      // Relational Indicators
      trust: this.countMatches(normalizedMessage, 'trust'),
      vulnerability: this.countMatches(normalizedMessage, 'vulnerability'),
      defensiveness: this.countMatches(normalizedMessage, 'defensiveness'),
      relationalMode: this.determineRelationalMode(normalizedMessage),

      // Motivational Patterns
      approach: this.countMatches(normalizedMessage, 'approach'),
      avoidance: this.countMatches(normalizedMessage, 'avoidance'),
      urgency: this.countMatches(normalizedMessage, 'urgency'),
      purpose: this.countMatches(normalizedMessage, 'purpose'),
      motivationalOrientation: this.determineMotivationalOrientation(normalizedMessage),

      // Agency Indicators
      highAgency: this.countMatches(normalizedMessage, 'high_agency'),
      lowAgency: this.countMatches(normalizedMessage, 'low_agency'),
      agencyLevel: this.calculateAgencyLevel(normalizedMessage),

      // Self-Reference Patterns
      selfCritical: this.countMatches(normalizedMessage, 'self_critical'),
      selfCompassion: this.countMatches(normalizedMessage, 'self_compassion'),
      selfReferenceStyle: this.determineSelfReferenceStyle(normalizedMessage),

      // Question Analysis
      questionCount: this.countQuestions(message),
      questionTypes: this.analyzeQuestionTypes(message),
      hasOpenQuestions: this.hasOpenQuestions(message),
      hasClosedQuestions: this.hasClosedQuestions(message),

      // Punctuation & Style
      exclamationCount: (message.match(/!/g) || []).length,
      ellipsisCount: (message.match(/\.\.\./g) || []).length,
      capsRatio: this.calculateCapsRatio(message),

      // Personal Pronouns
      firstPersonSingular: this.countFirstPersonSingular(normalizedMessage),
      firstPersonPlural: this.countFirstPersonPlural(normalizedMessage),
      secondPerson: this.countSecondPerson(normalizedMessage),
      thirdPerson: this.countThirdPerson(normalizedMessage),

      // Composite Scores
      emotionalIntensity: this.calculateEmotionalIntensity(normalizedMessage),
      cognitiveComplexity: this.calculateCognitiveComplexity(normalizedMessage),
      relationalOpenness: this.calculateRelationalOpenness(normalizedMessage),

      // Meta
      extractedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Tokenize message into words
   */
  tokenize(message) {
    return message
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Split message into sentences
   */
  splitSentences(message) {
    return message
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0);
  }

  /**
   * Calculate average word length
   */
  calculateAverageWordLength(words) {
    if (words.length === 0) return 0;
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return totalLength / words.length;
  }

  /**
   * Count matches for a lexicon category
   */
  countMatches(text, category) {
    const lexicon = this.lexicons[category];
    if (!lexicon) return 0;

    let count = 0;
    for (const pattern of lexicon) {
      const regex = new RegExp(`\\b${this.escapeRegex(pattern)}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
      }
    }
    return count;
  }

  /**
   * Escape special regex characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Calculate intensity score (-1 to 1)
   */
  calculateIntensity(text) {
    const highCount = this.countMatches(text, 'intensity_high');
    const lowCount = this.countMatches(text, 'intensity_low');
    const total = highCount + lowCount;

    if (total === 0) return 0;
    return (highCount - lowCount) / total;
  }

  /**
   * Calculate emotional valence (-1 to 1)
   */
  calculateValence(text) {
    const positive = this.countPositiveWords(text);
    const negative = this.countNegativeWords(text);
    const total = positive + negative;

    if (total === 0) return 0;
    return (positive - negative) / total;
  }

  /**
   * Count positive emotional words
   */
  countPositiveWords(text) {
    return this.countMatches(text, 'joy') +
           this.countMatches(text, 'growth') +
           this.countMatches(text, 'connection') +
           this.countMatches(text, 'trust') +
           this.countMatches(text, 'self_compassion');
  }

  /**
   * Count negative emotional words
   */
  countNegativeWords(text) {
    return this.countMatches(text, 'anger') +
           this.countMatches(text, 'fear') +
           this.countMatches(text, 'sadness') +
           this.countMatches(text, 'pain') +
           this.countMatches(text, 'self_critical');
  }

  /**
   * Calculate temporal focus (-1 = past, 0 = present, 1 = future)
   */
  calculateTemporalFocus(text) {
    const past = this.countMatches(text, 'past_focus');
    const future = this.countMatches(text, 'future_focus');
    const total = past + future;

    if (total === 0) return 0;
    return (future - past) / total;
  }

  /**
   * Calculate present focus (based on present tense verbs)
   */
  calculatePresentFocus(text) {
    const presentIndicators = [
      'am', 'is', 'are', 'feel', 'think', 'want', 'need',
      'right now', 'today', 'currently', 'at the moment'
    ];
    let count = 0;
    for (const indicator of presentIndicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
    return count;
  }

  /**
   * Get dominant emotion from primary emotions
   */
  getDominantEmotion(text) {
    const emotions = {
      joy: this.countMatches(text, 'joy'),
      anger: this.countMatches(text, 'anger'),
      fear: this.countMatches(text, 'fear'),
      sadness: this.countMatches(text, 'sadness')
    };

    let dominant = 'neutral';
    let maxCount = 0;

    for (const [emotion, count] of Object.entries(emotions)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = emotion;
      }
    }

    return maxCount > 0 ? dominant : 'neutral';
  }

  /**
   * Determine cognitive style
   */
  determineCognitiveStyle(text) {
    const analytical = this.countMatches(text, 'analytical');
    const intuitive = this.countMatches(text, 'intuitive');
    const binary = this.countMatches(text, 'binary');
    const nuanced = this.countMatches(text, 'nuanced');

    const scores = {
      analytical: analytical - intuitive,
      intuitive: intuitive - analytical,
      binary: binary - nuanced,
      nuanced: nuanced - binary,
      integrative: this.countMatches(text, 'integration'),
      metaCognitive: this.countMatches(text, 'meta_cognitive')
    };

    let dominant = 'balanced';
    let maxScore = 0;

    for (const [style, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        dominant = style;
      }
    }

    return dominant;
  }

  /**
   * Determine relational mode
   */
  determineRelationalMode(text) {
    const trust = this.countMatches(text, 'trust');
    const vulnerability = this.countMatches(text, 'vulnerability');
    const defensiveness = this.countMatches(text, 'defensiveness');
    const connection = this.countMatches(text, 'connection');
    const boundary = this.countMatches(text, 'boundary');

    if (defensiveness > trust + vulnerability) return 'defensive';
    if (vulnerability > trust) return 'vulnerable';
    if (boundary > connection) return 'boundaried';
    if (connection > 0 || trust > 0) return 'connected';
    return 'neutral';
  }

  /**
   * Determine motivational orientation
   */
  determineMotivationalOrientation(text) {
    const approach = this.countMatches(text, 'approach');
    const avoidance = this.countMatches(text, 'avoidance');
    const urgency = this.countMatches(text, 'urgency');
    const purpose = this.countMatches(text, 'purpose');

    if (urgency > 2) return 'urgent';
    if (purpose > 0) return 'purposeful';
    if (approach > avoidance) return 'approach';
    if (avoidance > approach) return 'avoidance';
    return 'balanced';
  }

  /**
   * Calculate agency level (-1 to 1)
   */
  calculateAgencyLevel(text) {
    const high = this.countMatches(text, 'high_agency');
    const low = this.countMatches(text, 'low_agency');
    const total = high + low;

    if (total === 0) return 0;
    return (high - low) / total;
  }

  /**
   * Determine self-reference style
   */
  determineSelfReferenceStyle(text) {
    const critical = this.countMatches(text, 'self_critical');
    const compassion = this.countMatches(text, 'self_compassion');

    if (critical > compassion + 1) return 'critical';
    if (compassion > critical + 1) return 'compassionate';
    return 'balanced';
  }

  /**
   * Count questions in message
   */
  countQuestions(text) {
    return (text.match(/\?/g) || []).length;
  }

  /**
   * Analyze question types
   */
  analyzeQuestionTypes(text) {
    const types = {
      what: 0,
      why: 0,
      how: 0,
      when: 0,
      where: 0,
      who: 0,
      which: 0,
      canShould: 0,
      doYou: 0
    };

    // Split into potential questions
    const sentences = text.split(/[.!]/);

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase().trim();
      if (!lower.includes('?') && !this.looksLikeQuestion(lower)) continue;

      if (lower.match(/\bwhat\b/)) types.what++;
      if (lower.match(/\bwhy\b/)) types.why++;
      if (lower.match(/\bhow\b/)) types.how++;
      if (lower.match(/\bwhen\b/)) types.when++;
      if (lower.match(/\bwhere\b/)) types.where++;
      if (lower.match(/\bwho\b/)) types.who++;
      if (lower.match(/\bwhich\b/)) types.which++;
      if (lower.match(/\b(can|should|could|would)\b/)) types.canShould++;
      if (lower.match(/\b(do you|are you|did you)\b/)) types.doYou++;
    }

    return types;
  }

  /**
   * Check if sentence looks like a question
   */
  looksLikeQuestion(text) {
    const questionStarters = [
      'what', 'why', 'how', 'when', 'where', 'who', 'which',
      'can', 'could', 'should', 'would', 'will', 'do', 'does',
      'did', 'is', 'are', 'was', 'were', 'have', 'has'
    ];
    return questionStarters.some(starter => text.startsWith(starter));
  }

  /**
   * Check for open-ended questions
   */
  hasOpenQuestions(text) {
    const types = this.analyzeQuestionTypes(text);
    return (types.what + types.why + types.how) > 0;
  }

  /**
   * Check for closed questions
   */
  hasClosedQuestions(text) {
    const types = this.analyzeQuestionTypes(text);
    return (types.canShould + types.doYou) > 0;
  }

  /**
   * Calculate caps ratio
   */
  calculateCapsRatio(text) {
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length === 0) return 0;
    const caps = letters.replace(/[^A-Z]/g, '').length;
    return caps / letters.length;
  }

  /**
   * Count first person singular pronouns
   */
  countFirstPersonSingular(text) {
    const pronouns = ['i', 'me', 'my', 'mine', 'myself'];
    let count = 0;
    for (const pronoun of pronouns) {
      const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
      count += (text.match(regex) || []).length;
    }
    return count;
  }

  /**
   * Count first person plural pronouns
   */
  countFirstPersonPlural(text) {
    const pronouns = ['we', 'us', 'our', 'ours', 'ourselves'];
    let count = 0;
    for (const pronoun of pronouns) {
      const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
      count += (text.match(regex) || []).length;
    }
    return count;
  }

  /**
   * Count second person pronouns
   */
  countSecondPerson(text) {
    const pronouns = ['you', 'your', 'yours', 'yourself', 'yourselves'];
    let count = 0;
    for (const pronoun of pronouns) {
      const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
      count += (text.match(regex) || []).length;
    }
    return count;
  }

  /**
   * Count third person pronouns
   */
  countThirdPerson(text) {
    const pronouns = ['he', 'she', 'him', 'her', 'his', 'hers', 'they', 'them', 'their', 'theirs'];
    let count = 0;
    for (const pronoun of pronouns) {
      const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
      count += (text.match(regex) || []).length;
    }
    return count;
  }

  /**
   * Calculate emotional intensity (composite score)
   */
  calculateEmotionalIntensity(text) {
    const intensity = Math.abs(this.calculateIntensity(text));
    const emotionWords = this.countMatches(text, 'joy') +
                         this.countMatches(text, 'anger') +
                         this.countMatches(text, 'fear') +
                         this.countMatches(text, 'sadness') +
                         this.countMatches(text, 'pain');

    const words = this.tokenize(text);
    const wordCount = words.length || 1;

    // Normalize by word count
    const emotionDensity = emotionWords / wordCount;

    return Math.min(1, (intensity + emotionDensity) / 2);
  }

  /**
   * Calculate cognitive complexity (composite score)
   */
  calculateCognitiveComplexity(text) {
    const nuanced = this.countMatches(text, 'nuanced');
    const metaCognitive = this.countMatches(text, 'meta_cognitive');
    const integration = this.countMatches(text, 'integration');
    const binary = this.countMatches(text, 'binary');

    const words = this.tokenize(text);
    const wordCount = words.length || 1;
    const avgWordLength = this.calculateAverageWordLength(words);

    // Complexity increases with nuance, meta-cognition, integration
    // Decreases with binary thinking
    const complexity = (nuanced + metaCognitive + integration - binary / 2) / wordCount;
    const lengthBonus = Math.min(0.2, avgWordLength / 30);

    return Math.max(0, Math.min(1, complexity + lengthBonus));
  }

  /**
   * Calculate relational openness (composite score)
   */
  calculateRelationalOpenness(text) {
    const trust = this.countMatches(text, 'trust');
    const vulnerability = this.countMatches(text, 'vulnerability');
    const connection = this.countMatches(text, 'connection');
    const defensiveness = this.countMatches(text, 'defensiveness');
    const boundary = this.countMatches(text, 'boundary');

    const words = this.tokenize(text);
    const wordCount = words.length || 1;

    const openness = (trust + vulnerability + connection - defensiveness - boundary / 2) / wordCount;
    return Math.max(-1, Math.min(1, openness));
  }

  /**
   * Return empty signals object
   */
  getEmptySignals() {
    return {
      messageLength: 0,
      wordCount: 0,
      sentenceCount: 0,
      averageWordLength: 0,
      averageSentenceLength: 0,
      intensity: 0,
      intensityHigh: 0,
      intensityLow: 0,
      valence: 0,
      positiveWords: 0,
      negativeWords: 0,
      temporalFocus: 0,
      pastFocus: 0,
      futureFocus: 0,
      presentFocus: 0,
      joy: 0,
      anger: 0,
      fear: 0,
      sadness: 0,
      dominantEmotion: 'neutral',
      pain: 0,
      growth: 0,
      connection: 0,
      boundary: 0,
      uncertainty: 0,
      analytical: 0,
      intuitive: 0,
      binary: 0,
      nuanced: 0,
      metaCognitive: 0,
      patternSeeking: 0,
      integration: 0,
      cognitiveStyle: 'balanced',
      trust: 0,
      vulnerability: 0,
      defensiveness: 0,
      relationalMode: 'neutral',
      approach: 0,
      avoidance: 0,
      urgency: 0,
      purpose: 0,
      motivationalOrientation: 'balanced',
      highAgency: 0,
      lowAgency: 0,
      agencyLevel: 0,
      selfCritical: 0,
      selfCompassion: 0,
      selfReferenceStyle: 'balanced',
      questionCount: 0,
      questionTypes: { what: 0, why: 0, how: 0, when: 0, where: 0, who: 0, which: 0, canShould: 0, doYou: 0 },
      hasOpenQuestions: false,
      hasClosedQuestions: false,
      exclamationCount: 0,
      ellipsisCount: 0,
      capsRatio: 0,
      firstPersonSingular: 0,
      firstPersonPlural: 0,
      secondPerson: 0,
      thirdPerson: 0,
      emotionalIntensity: 0,
      cognitiveComplexity: 0,
      relationalOpenness: 0,
      extractedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}

// Export singleton instance
export const signalExtractor = new SignalExtractor();

// Export helper function
export function extractSignals(message) {
  return signalExtractor.extractSignals(message);
}
