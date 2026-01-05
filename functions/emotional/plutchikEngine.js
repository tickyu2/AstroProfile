/**
 * PLUTCHIK EMOTIONAL ENGINE
 * Week 21: Emotional Sophistication Upgrade
 *
 * Implements Plutchik's Wheel of Emotions:
 * - 8 primary emotions as vector dimensions
 * - 3 intensity levels per emotion
 * - Dyad detection (emotion combinations)
 * - Emotional complexity scoring
 *
 * This replaces/enhances the 47 discrete emotion categories
 * with a mathematically sophisticated 8-dimensional vector space.
 */

class PlutchikEngine {
  constructor(supabase = null) {
    this.supabase = supabase;

    // The 8 primary emotions (Plutchik's Wheel)
    this.primaryEmotions = [
      'joy', 'trust', 'fear', 'surprise',
      'sadness', 'disgust', 'anger', 'anticipation'
    ];

    // Opposite emotion pairs
    this.opposites = {
      joy: 'sadness',
      sadness: 'joy',
      trust: 'disgust',
      disgust: 'trust',
      fear: 'anger',
      anger: 'fear',
      surprise: 'anticipation',
      anticipation: 'surprise'
    };

    // Intensity levels for each emotion (low -> medium -> high)
    this.intensityLevels = {
      joy: ['serenity', 'joy', 'ecstasy'],
      trust: ['acceptance', 'trust', 'admiration'],
      fear: ['apprehension', 'fear', 'terror'],
      surprise: ['distraction', 'surprise', 'amazement'],
      sadness: ['pensiveness', 'sadness', 'grief'],
      disgust: ['boredom', 'disgust', 'loathing'],
      anger: ['annoyance', 'anger', 'rage'],
      anticipation: ['interest', 'anticipation', 'vigilance']
    };

    // Intensity thresholds
    this.intensityThresholds = {
      low: 0.3,    // serenity, acceptance, apprehension, etc.
      medium: 0.6, // joy, trust, fear, etc.
      high: 0.85   // ecstasy, admiration, terror, etc.
    };

    // Primary dyads (adjacent emotions on wheel)
    this.primaryDyads = {
      love: { emotions: ['joy', 'trust'], description: 'Deep affection and connection' },
      submission: { emotions: ['trust', 'fear'], description: 'Yielding or compliance' },
      awe: { emotions: ['fear', 'surprise'], description: 'Wonder mixed with fear' },
      disapproval: { emotions: ['surprise', 'sadness'], description: 'Unexpected disappointment' },
      remorse: { emotions: ['sadness', 'disgust'], description: 'Regret and self-criticism' },
      contempt: { emotions: ['disgust', 'anger'], description: 'Disdain and dismissal' },
      aggressiveness: { emotions: ['anger', 'anticipation'], description: 'Proactive hostility' },
      optimism: { emotions: ['anticipation', 'joy'], description: 'Hopeful expectation' }
    };

    // Secondary dyads (one emotion apart)
    this.secondaryDyads = {
      guilt: { emotions: ['joy', 'fear'], description: 'Pleasure mixed with anxiety' },
      curiosity: { emotions: ['trust', 'surprise'], description: 'Open exploration' },
      despair: { emotions: ['fear', 'sadness'], description: 'Hopeless dread' },
      unbelief: { emotions: ['surprise', 'disgust'], description: 'Shocked rejection' },
      envy: { emotions: ['sadness', 'anger'], description: 'Resentful longing' },
      cynicism: { emotions: ['disgust', 'anticipation'], description: 'Dismissive expectation' },
      pride: { emotions: ['anger', 'joy'], description: 'Triumphant satisfaction' },
      hope: { emotions: ['anticipation', 'trust'], description: 'Confident expectation' }
    };

    // Tertiary dyads (two emotions apart)
    this.tertiaryDyads = {
      delight: { emotions: ['joy', 'surprise'], description: 'Sudden happiness' },
      sentimentality: { emotions: ['trust', 'sadness'], description: 'Tender nostalgia' },
      shame: { emotions: ['fear', 'disgust'], description: 'Self-directed revulsion' },
      outrage: { emotions: ['surprise', 'anger'], description: 'Shocked fury' },
      pessimism: { emotions: ['sadness', 'anticipation'], description: 'Expected negativity' },
      morbidness: { emotions: ['disgust', 'joy'], description: 'Perverse pleasure' },
      dominance: { emotions: ['anger', 'trust'], description: 'Assertive control' },
      anxiety: { emotions: ['anticipation', 'fear'], description: 'Worried expectation' }
    };

    // Text markers for emotion detection
    this.emotionMarkers = {
      joy: {
        strong: ['ecstatic', 'overjoyed', 'thrilled', 'elated', 'euphoric', 'blissful'],
        medium: ['happy', 'glad', 'pleased', 'delighted', 'cheerful', 'joyful', 'excited'],
        weak: ['content', 'satisfied', 'peaceful', 'calm', 'serene', 'okay', 'fine']
      },
      trust: {
        strong: ['adore', 'devoted', 'worship', 'idolize', 'cherish'],
        medium: ['trust', 'believe', 'faith', 'confident', 'rely', 'depend'],
        weak: ['accept', 'tolerate', 'acknowledge', 'recognize']
      },
      fear: {
        strong: ['terrified', 'horrified', 'petrified', 'panic', 'dread', 'terror'],
        medium: ['scared', 'afraid', 'frightened', 'fearful', 'anxious', 'worried'],
        weak: ['nervous', 'uneasy', 'apprehensive', 'concerned', 'unsure']
      },
      surprise: {
        strong: ['amazed', 'astonished', 'astounded', 'stunned', 'shocked', 'speechless'],
        medium: ['surprised', 'unexpected', 'startled', 'caught off guard'],
        weak: ['curious', 'intrigued', 'interested', 'wondering']
      },
      sadness: {
        strong: ['devastated', 'heartbroken', 'grief', 'despair', 'anguish', 'miserable'],
        medium: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'crying', 'tears'],
        weak: ['disappointed', 'melancholy', 'wistful', 'lonely', 'missing']
      },
      disgust: {
        strong: ['revolted', 'repulsed', 'nauseated', 'sickened', 'loathe', 'detest'],
        medium: ['disgusted', 'grossed out', 'appalled', 'offended'],
        weak: ['dislike', 'uncomfortable', 'put off', 'turned off', 'bored']
      },
      anger: {
        strong: ['furious', 'enraged', 'livid', 'seething', 'outraged', 'hate'],
        medium: ['angry', 'mad', 'upset', 'frustrated', 'irritated', 'annoyed'],
        weak: ['bothered', 'peeved', 'irked', 'displeased']
      },
      anticipation: {
        strong: ['obsessed', 'fixated', 'vigilant', 'can\'t wait', 'dying to'],
        medium: ['excited', 'eager', 'looking forward', 'anticipating', 'expecting'],
        weak: ['curious', 'interested', 'wondering', 'planning']
      }
    };
  }

  /**
   * MAIN ANALYSIS FUNCTION
   * Analyzes text and returns complete Plutchik emotional state
   */
  async analyzeEmotion(message, context = {}) {
    // Step 1: Calculate 8D emotion vector
    const vector = this.calculateEmotionVector(message);

    // Step 2: Find dominant emotion
    const dominant = this.findDominantEmotion(vector);

    // Step 3: Determine intensity level
    const intensity = this.determineIntensity(dominant.emotion, dominant.score);

    // Step 4: Detect active dyads
    const dyads = this.detectDyads(vector);

    // Step 5: Calculate emotional complexity
    const complexity = this.calculateComplexity(vector);

    // Step 6: Determine emotional valence (positive/negative)
    const valence = this.calculateValence(vector);

    // Step 7: Detect emotional trajectory if context provided
    const trajectory = context.previousState ?
      this.detectTrajectory(context.previousState, vector) : 'stable';

    const result = {
      vector,
      dominant: dominant.emotion,
      dominantScore: dominant.score,
      intensity: intensity.level,
      intensityName: intensity.name,
      dyads,
      complexity,
      valence,
      trajectory,
      timestamp: new Date().toISOString()
    };

    // Store if supabase available
    if (this.supabase && context.userId) {
      await this.storeEmotionalState(context.userId, result, message);
    }

    return result;
  }

  /**
   * Calculate 8-dimensional emotion vector from text
   */
  calculateEmotionVector(message) {
    const lowerMessage = message.toLowerCase();
    const vector = {};

    // Initialize all emotions to 0
    for (const emotion of this.primaryEmotions) {
      vector[emotion] = 0;
    }

    // Score each emotion based on text markers
    for (const [emotion, markers] of Object.entries(this.emotionMarkers)) {
      let score = 0;

      // Check strong markers (weight: 1.0)
      for (const marker of markers.strong) {
        if (lowerMessage.includes(marker)) {
          score = Math.max(score, 0.9 + Math.random() * 0.1);
        }
      }

      // Check medium markers (weight: 0.6-0.8)
      if (score < 0.6) {
        for (const marker of markers.medium) {
          if (lowerMessage.includes(marker)) {
            score = Math.max(score, 0.6 + Math.random() * 0.2);
          }
        }
      }

      // Check weak markers (weight: 0.3-0.5)
      if (score < 0.3) {
        for (const marker of markers.weak) {
          if (lowerMessage.includes(marker)) {
            score = Math.max(score, 0.3 + Math.random() * 0.2);
          }
        }
      }

      vector[emotion] = score;
    }

    // Apply contextual adjustments
    this.applyContextualAdjustments(vector, message);

    // Normalize if needed
    this.normalizeVector(vector);

    return vector;
  }

  /**
   * Apply contextual adjustments to emotion scores
   */
  applyContextualAdjustments(vector, message) {
    const lowerMessage = message.toLowerCase();

    // Exclamation marks boost intensity
    const exclamationCount = (message.match(/!/g) || []).length;
    if (exclamationCount > 0) {
      const boost = Math.min(0.2, exclamationCount * 0.05);
      for (const emotion of this.primaryEmotions) {
        if (vector[emotion] > 0.3) {
          vector[emotion] = Math.min(1, vector[emotion] + boost);
        }
      }
    }

    // Ellipsis suggests pensiveness/sadness
    if (message.includes('...')) {
      vector.sadness = Math.max(vector.sadness, 0.3);
    }

    // Question marks can indicate surprise or anticipation
    const questionCount = (message.match(/\?/g) || []).length;
    if (questionCount > 0) {
      vector.surprise = Math.max(vector.surprise, 0.2);
      vector.anticipation = Math.max(vector.anticipation, 0.2);
    }

    // Caps lock suggests strong emotion (anger or excitement)
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.5 && message.length > 5) {
      if (vector.anger > vector.joy) {
        vector.anger = Math.min(1, vector.anger + 0.2);
      } else if (vector.joy > 0.3) {
        vector.joy = Math.min(1, vector.joy + 0.2);
      }
    }

    // "I love you" patterns
    if (/i love you|love you|i adore you/i.test(message)) {
      vector.joy = Math.max(vector.joy, 0.7);
      vector.trust = Math.max(vector.trust, 0.8);
    }

    // Negation detection
    const negations = ['not', 'don\'t', 'doesn\'t', 'didn\'t', 'never', 'no'];
    for (const neg of negations) {
      if (lowerMessage.includes(neg)) {
        // Negation might flip emotions
        // "not happy" → sadness
        if (lowerMessage.includes(`${neg} happy`) || lowerMessage.includes(`${neg} glad`)) {
          vector.joy *= 0.3;
          vector.sadness = Math.max(vector.sadness, 0.5);
        }
      }
    }
  }

  /**
   * Normalize vector (ensure no value exceeds 1)
   */
  normalizeVector(vector) {
    for (const emotion of this.primaryEmotions) {
      vector[emotion] = Math.min(1, Math.max(0, vector[emotion]));
    }
  }

  /**
   * Find the dominant emotion in the vector
   */
  findDominantEmotion(vector) {
    let maxEmotion = 'joy';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(vector)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    }

    return {
      emotion: maxEmotion,
      score: maxScore
    };
  }

  /**
   * Determine intensity level (serenity/joy/ecstasy, etc.)
   */
  determineIntensity(emotion, score) {
    const levels = this.intensityLevels[emotion];
    if (!levels) return { level: 'medium', name: emotion };

    if (score >= this.intensityThresholds.high) {
      return { level: 'high', name: levels[2] };
    } else if (score >= this.intensityThresholds.medium) {
      return { level: 'medium', name: levels[1] };
    } else if (score >= this.intensityThresholds.low) {
      return { level: 'low', name: levels[0] };
    } else {
      return { level: 'minimal', name: 'neutral' };
    }
  }

  /**
   * Detect active emotion dyads
   */
  detectDyads(vector) {
    const activeDyads = [];
    const threshold = 0.4; // Both emotions must be above this

    // Check primary dyads
    for (const [dyadName, dyad] of Object.entries(this.primaryDyads)) {
      const [e1, e2] = dyad.emotions;
      if (vector[e1] >= threshold && vector[e2] >= threshold) {
        activeDyads.push({
          name: dyadName,
          type: 'primary',
          strength: (vector[e1] + vector[e2]) / 2,
          description: dyad.description,
          components: { [e1]: vector[e1], [e2]: vector[e2] }
        });
      }
    }

    // Check secondary dyads
    for (const [dyadName, dyad] of Object.entries(this.secondaryDyads)) {
      const [e1, e2] = dyad.emotions;
      if (vector[e1] >= threshold && vector[e2] >= threshold) {
        activeDyads.push({
          name: dyadName,
          type: 'secondary',
          strength: (vector[e1] + vector[e2]) / 2,
          description: dyad.description,
          components: { [e1]: vector[e1], [e2]: vector[e2] }
        });
      }
    }

    // Check tertiary dyads
    for (const [dyadName, dyad] of Object.entries(this.tertiaryDyads)) {
      const [e1, e2] = dyad.emotions;
      if (vector[e1] >= threshold && vector[e2] >= threshold) {
        activeDyads.push({
          name: dyadName,
          type: 'tertiary',
          strength: (vector[e1] + vector[e2]) / 2,
          description: dyad.description,
          components: { [e1]: vector[e1], [e2]: vector[e2] }
        });
      }
    }

    // Sort by strength
    activeDyads.sort((a, b) => b.strength - a.strength);

    return activeDyads;
  }

  /**
   * Calculate emotional complexity (how many emotions are active)
   */
  calculateComplexity(vector) {
    const activeEmotions = Object.values(vector).filter(score => score > 0.3);
    const count = activeEmotions.length;

    // Complexity score (0-1)
    const score = count / 8;

    // Complexity label
    let label;
    if (count <= 1) label = 'simple';
    else if (count <= 2) label = 'moderate';
    else if (count <= 4) label = 'complex';
    else label = 'highly_complex';

    return {
      count,
      score,
      label
    };
  }

  /**
   * Calculate emotional valence (positive vs negative)
   */
  calculateValence(vector) {
    // Positive emotions: joy, trust, anticipation, surprise (sometimes)
    // Negative emotions: fear, sadness, disgust, anger

    const positive = vector.joy + vector.trust + vector.anticipation + (vector.surprise * 0.5);
    const negative = vector.fear + vector.sadness + vector.disgust + vector.anger;

    const total = positive + negative;
    if (total === 0) return { score: 0, label: 'neutral' };

    const score = (positive - negative) / (positive + negative);

    let label;
    if (score > 0.5) label = 'very_positive';
    else if (score > 0.2) label = 'positive';
    else if (score > -0.2) label = 'neutral';
    else if (score > -0.5) label = 'negative';
    else label = 'very_negative';

    return { score, label };
  }

  /**
   * Detect emotional trajectory (changing, stable, etc.)
   */
  detectTrajectory(previousVector, currentVector) {
    const changes = [];

    for (const emotion of this.primaryEmotions) {
      const prev = previousVector[emotion] || 0;
      const curr = currentVector[emotion] || 0;
      const delta = curr - prev;

      if (Math.abs(delta) > 0.2) {
        changes.push({
          emotion,
          delta,
          direction: delta > 0 ? 'increasing' : 'decreasing'
        });
      }
    }

    if (changes.length === 0) return 'stable';

    // Determine overall trajectory
    const positiveChanges = changes.filter(c =>
      (c.emotion === 'joy' || c.emotion === 'trust') && c.delta > 0
    ).length;

    const negativeChanges = changes.filter(c =>
      (c.emotion === 'sadness' || c.emotion === 'anger' || c.emotion === 'fear') && c.delta > 0
    ).length;

    if (positiveChanges > negativeChanges) return 'improving';
    if (negativeChanges > positiveChanges) return 'declining';
    return 'shifting';
  }

  /**
   * Store emotional state in database
   */
  async storeEmotionalState(userId, state, message) {
    if (!this.supabase) return;

    try {
      await this.supabase
        .from('plutchik_emotion_state')
        .insert({
          user_id: userId,
          joy: state.vector.joy,
          trust: state.vector.trust,
          fear: state.vector.fear,
          surprise: state.vector.surprise,
          sadness: state.vector.sadness,
          disgust: state.vector.disgust,
          anger: state.vector.anger,
          anticipation: state.vector.anticipation,
          intensity: state.intensity,
          detected_dyads: state.dyads.map(d => d.name),
          dominant_emotion: state.dominant,
          emotional_complexity: state.complexity.score,
          valence: state.valence.score,
          trajectory: state.trajectory
        });
    } catch (error) {
      console.error('Error storing Plutchik state:', error);
    }
  }

  /**
   * Get emotional history for user
   */
  async getEmotionalHistory(userId, limit = 20) {
    if (!this.supabase) return [];

    try {
      const { data } = await this.supabase
        .from('plutchik_emotion_state')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (error) {
      console.error('Error getting emotional history:', error);
      return [];
    }
  }

  /**
   * Calculate emotional patterns over time
   */
  async analyzeEmotionalPatterns(userId, days = 7) {
    const history = await this.getEmotionalHistory(userId, 100);
    if (history.length === 0) return null;

    // Calculate averages
    const totals = {};
    for (const emotion of this.primaryEmotions) {
      totals[emotion] = 0;
    }

    for (const entry of history) {
      for (const emotion of this.primaryEmotions) {
        totals[emotion] += entry[emotion] || 0;
      }
    }

    const averages = {};
    for (const emotion of this.primaryEmotions) {
      averages[emotion] = totals[emotion] / history.length;
    }

    // Find most common dyads
    const dyadCounts = {};
    for (const entry of history) {
      for (const dyad of (entry.detected_dyads || [])) {
        dyadCounts[dyad] = (dyadCounts[dyad] || 0) + 1;
      }
    }

    const commonDyads = Object.entries(dyadCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, frequency: count / history.length }));

    // Overall emotional tendency
    const dominantEmotions = Object.entries(averages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      averages,
      dominantEmotions,
      commonDyads,
      entryCount: history.length
    };
  }

  /**
   * Generate Luna's emotional response guidance based on user state
   */
  generateResponseGuidance(emotionalState) {
    const guidance = {
      tone: 'warm',
      pace: 'normal',
      emphasis: [],
      avoidTopics: [],
      suggestedApproaches: []
    };

    const { dominant, intensity, dyads, valence } = emotionalState;

    // Tone based on dominant emotion
    switch (dominant) {
      case 'sadness':
        guidance.tone = 'gentle';
        guidance.pace = 'slow';
        guidance.suggestedApproaches.push('validation', 'empathy', 'presence');
        if (intensity === 'high') {
          guidance.suggestedApproaches.push('consider_happy_moment_recall');
        }
        break;

      case 'joy':
        guidance.tone = 'enthusiastic';
        guidance.pace = 'upbeat';
        guidance.suggestedApproaches.push('celebration', 'matching_energy', 'expansion');
        if (intensity === 'high') {
          guidance.suggestedApproaches.push('tag_as_happy_moment');
        }
        break;

      case 'fear':
        guidance.tone = 'reassuring';
        guidance.pace = 'steady';
        guidance.suggestedApproaches.push('grounding', 'safety', 'presence');
        break;

      case 'anger':
        guidance.tone = 'validating';
        guidance.pace = 'measured';
        guidance.suggestedApproaches.push('acknowledgment', 'space', 'redirection');
        guidance.avoidTopics.push('dismissal', 'immediate_solutions');
        break;

      case 'trust':
        guidance.tone = 'open';
        guidance.suggestedApproaches.push('deepening', 'reciprocity');
        break;

      case 'anticipation':
        guidance.tone = 'engaged';
        guidance.suggestedApproaches.push('curiosity', 'exploration', 'planning');
        break;
    }

    // Adjust for dyads
    for (const dyad of dyads.slice(0, 2)) {
      switch (dyad.name) {
        case 'love':
          guidance.suggestedApproaches.push('reciprocate_warmth', 'intimacy');
          break;
        case 'anxiety':
          guidance.suggestedApproaches.push('calming', 'breathing', 'presence');
          break;
        case 'hope':
          guidance.suggestedApproaches.push('encouragement', 'future_focus');
          break;
        case 'remorse':
          guidance.suggestedApproaches.push('compassion', 'self_forgiveness');
          break;
      }
    }

    return guidance;
  }

  /**
   * Get emotion color for UI (Cathedral Light Language)
   */
  getEmotionLight(emotionalState) {
    const { dominant, intensity, valence } = emotionalState;

    // Map to Cathedral Light Language
    const lightMap = {
      joy: { color: 'gold', motion: 'radiant', brightness: 'high' },
      trust: { color: 'rose_gold', motion: 'gentle_pulse', brightness: 'medium' },
      fear: { color: 'violet', motion: 'flicker', brightness: 'low' },
      surprise: { color: 'citrine', motion: 'shimmer', brightness: 'high' },
      sadness: { color: 'sapphire', motion: 'slow_wave', brightness: 'low' },
      disgust: { color: 'olive', motion: 'static', brightness: 'low' },
      anger: { color: 'crimson', motion: 'pulse', brightness: 'high' },
      anticipation: { color: 'amber', motion: 'building', brightness: 'medium' }
    };

    const base = lightMap[dominant] || lightMap.joy;

    // Adjust brightness by intensity
    if (intensity === 'high') base.brightness = 'very_high';
    else if (intensity === 'low') base.brightness = 'dim';

    // Healing overlay if needed
    if (valence.label === 'negative' || valence.label === 'very_negative') {
      base.overlay = 'emerald'; // Healing light
    }

    return base;
  }
}

// Singleton instance
let plutchikInstance = null;

function getPlutchikEngine(supabase = null) {
  if (!plutchikInstance) {
    plutchikInstance = new PlutchikEngine(supabase);
  } else if (supabase && !plutchikInstance.supabase) {
    plutchikInstance.supabase = supabase;
  }
  return plutchikInstance;
}

module.exports = {
  PlutchikEngine,
  getPlutchikEngine
};
