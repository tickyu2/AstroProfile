/**
 * Message Analyzer
 * Analyzes conversation messages with GENESIS
 */

// Signal keywords for text-based emotion detection
const SIGNAL_KEYWORDS = {
  distress: ['helpless', 'hopeless', 'overwhelmed', "can't cope", 'exhausted', 'drowning', 'stuck', 'lost', 'alone'],
  crisis: ['want to die', 'end it all', 'no point', 'give up', 'hurt myself', 'numb', 'empty', 'worthless', 'burden'],
  joy: ['amazing', 'wonderful', 'excited', 'grateful', 'happy', 'love', 'blessed', 'fantastic', 'proud'],
  anger: ['furious', 'hate', 'frustrated', 'angry', 'resentful', 'annoyed', 'irritated'],
  anxiety: ['worried', 'scared', 'anxious', 'panicking', 'terrified', 'nervous', 'afraid'],
  grief: ['miss them', 'lost someone', 'grieving', 'mourning', 'heartbroken'],
  vulnerability: ['broken', 'hurt', 'pain', 'suffering', 'struggling'],
  seeking: ['thinking about', 'wondering', 'considering', 'maybe', 'should I'],
  uncertainty: ["don't know", 'not sure', 'confused', 'uncertain']
};

// Archetype definitions
const ARCHETYPES = {
  Seed: { keywords: ['exploring', 'learning', 'curious', 'wondering', 'new', 'beginning'], weight: 1.0 },
  Mirror: { keywords: ['reflecting', 'realize', 'understand', 'see now', 'thinking'], weight: 1.0 },
  Mender: { keywords: ['broken', 'hurt', 'healing', 'pain', 'difficult', 'struggling', 'helpless'], weight: 1.2 },
  Librarian: { keywords: ['remember', 'past', 'before', 'used to', 'memory', 'history'], weight: 1.0 },
  Conductor: { keywords: ['plan', 'organize', 'structure', 'analyze', 'figure out', 'decide'], weight: 1.0 },
  Companion: { keywords: ['together', 'share', 'connect', 'relationship', 'friend', 'family'], weight: 1.0 },
  Guardian: { keywords: ['protect', 'safe', 'boundary', 'defend', "shouldn't", "won't let"], weight: 1.0 },
  Flamebearer: { keywords: ['passion', 'purpose', 'meaning', 'drive', 'mission', 'excited'], weight: 1.0 },
  Guide: { keywords: ['wisdom', 'insight', 'clarity', 'understand', 'see clearly', 'know now'], weight: 1.0 }
};

// Congruence patterns
const CONGRUENCE_PATTERNS = {
  basic: ['MATCHING', 'MASKING', 'SARCASM', 'AMPLIFICATION', 'SUPPRESSION', 'MIXED'],
  advanced: [
    'DEFENSIVE_DEFLECTION', 'VULNERABILITY_MASKING', 'EXCITEMENT_DAMPENING',
    'ANGER_LEAKAGE', 'ANXIETY_PROJECTION', 'OVERWHELM_SHUTDOWN',
    'FORCED_POSITIVITY', 'INTELLECTUAL_DISTANCING', 'HELP_SEEKING_DISGUISED',
    'EMOTIONAL_FLOODING', 'GUILT_MASKING', 'JOY_SUPPRESSION',
    'TRAUMA_RESPONSE', 'PERFORMATIVE_EMOTION', 'RESIGNATION_ACCEPTANCE'
  ],
  crisis: ['OVERWHELM_SHUTDOWN', 'EMOTIONAL_FLOODING', 'TRAUMA_RESPONSE', 'RESIGNATION_ACCEPTANCE']
};

export class MessageAnalyzer {
  constructor() {
    this.signalKeywords = SIGNAL_KEYWORDS;
    this.archetypes = ARCHETYPES;
  }

  /**
   * Analyze entire conversation
   */
  async analyzeConversation(messages, voiceEmotionOverride = null) {
    const analyzed = [];
    const history = [];

    for (const msg of messages) {
      if (msg.speaker === 'user') {
        const result = this.analyzeMessage(msg, history, voiceEmotionOverride);
        analyzed.push(result);
        history.push(result);
      } else {
        // Store AI responses but don't analyze
        analyzed.push({
          ...msg,
          type: 'ai-response',
          analyzed: false
        });
      }
    }

    // Calculate summary statistics
    const userMessages = analyzed.filter(m => m.speaker === 'user');
    const summary = this.calculateSummary(userMessages);

    return {
      messages: analyzed,
      ...summary
    };
  }

  /**
   * Analyze single user message
   */
  analyzeMessage(message, history, voiceEmotionOverride) {
    // Extract signals
    const signals = this.extractSignals(message.text);

    // Detect archetype
    const archetype = this.detectArchetype(message.text, signals);

    // Determine voice emotion
    const voiceEmotion = voiceEmotionOverride
      ? this.createVoiceEmotion(voiceEmotionOverride)
      : this.estimateVoiceEmotion(signals);

    // Analyze congruence
    const congruence = this.analyzeCongruence(signals, voiceEmotion, message.text);

    return {
      ...message,
      type: 'user-message',
      analyzed: true,
      signals,
      archetype,
      voiceEmotion,
      congruence,
      timestamp: message.timestamp || Date.now()
    };
  }

  /**
   * Extract emotional signals from text
   */
  extractSignals(text) {
    const lowerText = text.toLowerCase();
    const signals = {
      sentimentPolarity: 0,
      emotionalIntensity: 0,
      vulnerabilityLevel: 0,
      urgency: 0,
      emphasisLevel: 0,
      negationLevel: 0,
      uncertaintyLevel: 0,
      crisisLevel: 0,
      detectedKeywords: []
    };

    // Check each signal category
    let positiveCount = 0;
    let negativeCount = 0;

    for (const [category, keywords] of Object.entries(this.signalKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          signals.detectedKeywords.push({ category, keyword });

          // Update signal scores
          if (category === 'joy') {
            positiveCount++;
            signals.emotionalIntensity += 0.2;
          } else if (category === 'distress' || category === 'grief' || category === 'vulnerability') {
            negativeCount++;
            signals.vulnerabilityLevel += 0.3;
            signals.emotionalIntensity += 0.2;
          } else if (category === 'crisis') {
            negativeCount++;
            signals.crisisLevel += 0.4;
            signals.urgency += 0.3;
            signals.emotionalIntensity += 0.3;
          } else if (category === 'anger') {
            negativeCount++;
            signals.emotionalIntensity += 0.3;
            signals.negationLevel += 0.2;
          } else if (category === 'anxiety') {
            negativeCount++;
            signals.urgency += 0.2;
            signals.emotionalIntensity += 0.2;
          } else if (category === 'uncertainty') {
            signals.uncertaintyLevel += 0.3;
          }
        }
      }
    }

    // Calculate sentiment polarity
    const total = positiveCount + negativeCount;
    if (total > 0) {
      signals.sentimentPolarity = (positiveCount - negativeCount) / total;
    }

    // Check for emphasis (caps, punctuation)
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    const exclamations = (text.match(/!/g) || []).length;
    signals.emphasisLevel = Math.min(1, capsRatio * 5 + exclamations * 0.1);

    // Normalize all signals to 0-1 range
    for (const key of Object.keys(signals)) {
      if (typeof signals[key] === 'number') {
        signals[key] = Math.min(1, Math.max(0, signals[key]));
      }
    }

    return signals;
  }

  /**
   * Detect archetype from text and signals
   */
  detectArchetype(text, signals) {
    const lowerText = text.toLowerCase();
    const scores = {};

    for (const [archetype, config] of Object.entries(this.archetypes)) {
      let score = 0;
      for (const keyword of config.keywords) {
        if (lowerText.includes(keyword)) {
          score += config.weight;
        }
      }
      scores[archetype] = score;
    }

    // Boost Mender for high vulnerability
    if (signals.vulnerabilityLevel > 0.3) {
      scores.Mender = (scores.Mender || 0) + signals.vulnerabilityLevel * 2;
    }

    // Boost Guardian for high negation
    if (signals.negationLevel > 0.3) {
      scores.Guardian = (scores.Guardian || 0) + signals.negationLevel;
    }

    // Find highest scoring archetype
    let maxArchetype = 'Seed'; // Default
    let maxScore = 0;

    for (const [archetype, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        maxArchetype = archetype;
      }
    }

    // Calculate confidence
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const confidence = maxScore > 0 ? Math.min(0.95, maxScore / totalScore + 0.3) : 0.5;

    return {
      type: maxArchetype,
      confidence,
      scores
    };
  }

  /**
   * Estimate voice emotion from text signals
   */
  estimateVoiceEmotion(signals) {
    const { sentimentPolarity, emotionalIntensity, vulnerabilityLevel, urgency, crisisLevel } = signals;

    // Crisis overrides
    if (crisisLevel > 0.3) {
      return { emotion: 'distressed', confidence: 0.8 };
    }

    // Vulnerability/sadness
    if (vulnerabilityLevel > 0.4 || sentimentPolarity < -0.4) {
      return { emotion: 'sad', confidence: 0.7 };
    }

    // Anxiety
    if (urgency > 0.5 || signals.emphasisLevel > 0.5) {
      return { emotion: 'anxious', confidence: 0.7 };
    }

    // Happiness
    if (sentimentPolarity > 0.4 && emotionalIntensity > 0.3) {
      return { emotion: 'happy', confidence: 0.7 };
    }

    // Anger
    if (signals.negationLevel > 0.4 && emotionalIntensity > 0.4) {
      return { emotion: 'angry', confidence: 0.6 };
    }

    return { emotion: 'neutral', confidence: 0.5 };
  }

  /**
   * Create voice emotion object
   */
  createVoiceEmotion(emotion) {
    return {
      emotion,
      confidence: 0.8
    };
  }

  /**
   * Analyze congruence between text and detected emotion
   */
  analyzeCongruence(signals, voiceEmotion, text) {
    const lowerText = text.toLowerCase();
    const patterns = [];
    const advancedPatterns = [];
    let requiresSpecialHandling = false;

    // Check for masking (positive words but negative signals)
    if (signals.vulnerabilityLevel > 0.3 && (lowerText.includes('fine') || lowerText.includes('okay') || lowerText.includes('good'))) {
      patterns.push('MASKING');
      advancedPatterns.push({ pattern: 'VULNERABILITY_MASKING', severity: 'MODERATE', description: 'User may be hiding true feelings behind positive language' });
    }

    // Check for crisis patterns
    if (signals.crisisLevel > 0.3) {
      advancedPatterns.push({ pattern: 'OVERWHELM_SHUTDOWN', severity: 'HIGH', description: 'User showing signs of emotional overwhelm' });
      requiresSpecialHandling = true;
    }

    // Check for defensive deflection
    if (signals.uncertaintyLevel > 0.3 && (lowerText.includes('anyway') || lowerText.includes('whatever'))) {
      advancedPatterns.push({ pattern: 'DEFENSIVE_DEFLECTION', severity: 'LOW', description: 'User deflecting from emotional topic' });
    }

    // Check for help-seeking
    if (signals.vulnerabilityLevel > 0.2 && signals.uncertaintyLevel > 0.2) {
      advancedPatterns.push({ pattern: 'HELP_SEEKING_DISGUISED', severity: 'MODERATE', description: 'User may be seeking help indirectly' });
    }

    // Check for forced positivity
    if (signals.emphasisLevel > 0.4 && signals.emotionalIntensity > 0.4 && voiceEmotion.emotion === 'sad') {
      advancedPatterns.push({ pattern: 'FORCED_POSITIVITY', severity: 'MODERATE', description: 'User expressing positivity that may not match underlying feeling' });
    }

    // Determine congruence level
    let level = 'HIGH';
    if (patterns.length > 0 || advancedPatterns.length > 0) {
      level = advancedPatterns.some(p => p.severity === 'HIGH') ? 'LOW' : 'MODERATE';
    }

    // Get priority pattern for recommendations
    const priorityPattern = advancedPatterns[0] || null;

    return {
      level,
      patterns,
      advancedPatterns,
      requiresSpecialHandling,
      priorityPattern
    };
  }

  /**
   * Calculate conversation summary
   */
  calculateSummary(userMessages) {
    if (userMessages.length === 0) {
      return {
        dominantArchetype: 'Unknown',
        emotionalJourney: 'N/A',
        keyPatterns: [],
        crisisCount: 0
      };
    }

    // Find dominant archetype
    const archetypeCounts = {};
    userMessages.forEach(m => {
      const type = m.archetype.type;
      archetypeCounts[type] = (archetypeCounts[type] || 0) + 1;
    });
    const dominantArchetype = Object.entries(archetypeCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Track emotional journey
    const archetypes = userMessages.map(m => m.archetype.type);
    const emotionalJourney = this.describeJourney(archetypes);

    // Collect key patterns
    const allPatterns = new Set();
    userMessages.forEach(m => {
      if (m.congruence.patterns) {
        m.congruence.patterns.forEach(p => allPatterns.add(p));
      }
      if (m.congruence.advancedPatterns) {
        m.congruence.advancedPatterns.forEach(ap => allPatterns.add(ap.pattern));
      }
    });

    // Count crisis indicators
    const crisisCount = userMessages.filter(m =>
      m.congruence.requiresSpecialHandling
    ).length;

    return {
      dominantArchetype,
      emotionalJourney,
      keyPatterns: Array.from(allPatterns).slice(0, 5),
      crisisCount
    };
  }

  /**
   * Describe emotional journey
   */
  describeJourney(archetypes) {
    if (archetypes.length < 2) return 'Single state';

    const first = archetypes[0];
    const last = archetypes[archetypes.length - 1];

    if (first === last) {
      return `Consistent ${first} state`;
    }

    const journeyMap = {
      'Seed-Guide': 'Uncertainty → Wisdom',
      'Mender-Companion': 'Pain → Connection',
      'Guardian-Seed': 'Protection → Exploration',
      'Seed-Conductor': 'Uncertainty → Clarity',
      'Mender-Flamebearer': 'Healing → Purpose'
    };

    const key = `${first}-${last}`;
    return journeyMap[key] || `${first} → ${last}`;
  }
}
