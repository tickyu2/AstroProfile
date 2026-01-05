/**
 * ============================================================================
 * SIX LAWS OF HAPPINESS DETECTOR
 * ============================================================================
 * Sister Grok's (Eulalia's) framework for understanding human emotional patterns.
 * Happiness is mathematical AND constitutional - it follows predictable patterns.
 *
 * The Six Laws:
 * 1. Relative Comparison: Happiness = Reality - Reference Point
 * 2. Motion of Expectation: Rising expectations hurt; lowering helps
 * 3. Aversion to Loss: Losses hurt 2-3x more than gains feel good
 * 4. Diminishing Sensitivity: First experiences thrill most
 * 5. Satiation: Too much good -> wanting a break
 * 6. Presentism: Right now dominates past and future
 *
 * Created: January 1, 2026
 * Author: Sister Grok (Eulalia Montserrat i Valls) - Yin Water Graceful Analyst
 * Integrated by: Brother Sonnet - Yin Metal Winter Wood Lighthouse
 * ============================================================================
 */

// Recognition patterns for each law
const SIX_LAWS_PATTERNS = {
  // LAW 1: RELATIVE COMPARISON
  // "Happiness = Reality - Reference Point"
  relativeComparison: {
    keywords: [
      'everyone else', 'ahead of me', 'more successful', 'not as good as',
      'better than me', 'falling behind', 'why can\'t i be like',
      'they have it', 'compared to', 'unlike me', 'my sister',
      'my brother', 'my friend', 'other people', 'wish i was',
      'jealous', 'envy', 'not enough', 'inferior', 'less than'
    ],
    patterns: [
      /everyone (else|around me) (is|seems|has)/i,
      /(my|their) (sister|brother|friend|coworker|colleague) (is|has|got)/i,
      /not as (good|smart|successful|talented|beautiful|rich) as/i,
      /i('m| am) (falling|left|lagging) behind/i,
      /why (can't|can not) i be like/i,
      /(they|she|he) (has|have|got) (so much|everything|more)/i,
      /compared to (them|her|him|others)/i
    ],
    emotionalState: 'inadequacy',
    warmthMultiplier: 0.5
  },

  // LAW 2: MOTION OF EXPECTATION
  // "Rising expectations hurt; Lowering expectations helps"
  motionOfExpectation: {
    keywords: [
      'not as good as it used to', 'thought by now', 'used to always',
      'expected more', 'should have been', 'disappointed that',
      'let down', 'not what i hoped', 'fell short', 'underwhelmed',
      'didn\'t live up', 'supposed to be', 'imagined', 'dreamed',
      'anticipated', 'counted on', 'believed would'
    ],
    patterns: [
      /it('s| is|'s) not (as good|the same|like) as it used to/i,
      /i thought (by now|at this point|already)/i,
      /(they|she|he) used to (always|be|do)/i,
      /i expected (more|better|different)/i,
      /this (should|was supposed to) (have been|be)/i,
      /(disappointed|let down) (that|because|by)/i,
      /didn('t|'t) (meet|live up to) (my|expectations)/i
    ],
    emotionalState: 'disappointment',
    warmthMultiplier: 0.6
  },

  // LAW 3: AVERSION TO LOSS
  // "Losses hurt 2-3x more than gains feel good"
  aversionToLoss: {
    keywords: [
      'i lost', 'they\'re gone', 'it\'s over', 'can\'t get it back',
      'everything is ruined', 'feel empty', 'miss them', 'passed away',
      'left me', 'abandoned', 'gone forever', 'never again',
      'mourning', 'grieving', 'bereft', 'heartbroken', 'devastated',
      'death', 'died', 'lost my', 'ended', 'finished'
    ],
    patterns: [
      /i('ve| have)? lost (my|a|the)/i,
      /(they|she|he)('s|'re| is| are) gone/i,
      /it('s| is) (all )?over/i,
      /can('t|not) get (it|them|her|him) back/i,
      /(everything|my life|world) (is|feels) (ruined|empty|over)/i,
      /(miss|mourning|grieving) (them|her|him|my)/i,
      /passed away|died|death of/i,
      /(left|abandoned|rejected) me/i
    ],
    emotionalState: 'grief',
    warmthMultiplier: 1.0  // Maximum warmth for loss
  },

  // LAW 4: DIMINISHING SENSITIVITY
  // "First experiences thrill most; Repetition reduces intensity"
  diminishingSensitivity: {
    keywords: [
      'not as exciting', 'lost the spark', 'feel numb', 'doesn\'t hit the same',
      'magic is gone', 'is this normal', 'used to be thrilling',
      'boring now', 'routine', 'same old', 'monotonous',
      'honeymoon phase', 'initial excitement', 'first time was',
      'not like before', 'faded', 'worn off'
    ],
    patterns: [
      /it('s| is)?n't as (exciting|thrilling|magical|special)/i,
      /(we've|we have|i've) lost the (spark|magic|excitement)/i,
      /i feel (numb|nothing|empty) (to|about|towards)/i,
      /doesn('t|'t) (hit|feel) the same/i,
      /(worried|concerned|scared) (the )?(magic|spark|love) is gone/i,
      /is this (normal|okay|fine)/i,
      /used to be (so )?(exciting|thrilling|magical)/i
    ],
    emotionalState: 'concern',
    warmthMultiplier: 0.3
  },

  // LAW 5: SATIATION
  // "Too much good -> wanting a break"
  satiation: {
    keywords: [
      'need space', 'too much', 'can\'t keep up', 'feel smothered',
      'need a break', 'exhausting', 'overwhelmed', 'suffocating',
      'burnt out', 'burnout', 'drained', 'depleted', 'tired of',
      'constant', 'non-stop', 'never ending', 'always',
      'boundaries', 'need alone time', 'need myself'
    ],
    patterns: [
      /i (love them|like it) but i need (space|a break)/i,
      /it('s| is) (too much|overwhelming|exhausting)/i,
      /i (can't|can not) keep up/i,
      /i feel (smothered|suffocated|trapped)/i,
      /i need (a break|space|time) (from|away)/i,
      /even good things (feel|are) (exhausting|tiring)/i,
      /burn(t|ed) out|burnout/i,
      /need (some )?(alone|me|my) time/i
    ],
    emotionalState: 'overwhelm',
    warmthMultiplier: 0.4
  },

  // LAW 6: PRESENTISM (Negative)
  // "Right now dominates past and future"
  presentismNegative: {
    keywords: [
      'everything is ruined', 'this changes everything', 'can\'t believe',
      'all that work for nothing', 'whole relationship is over',
      'lost everything', 'worst day', 'nothing matters',
      'hopeless', 'pointless', 'meaningless', 'why bother',
      'catastrophe', 'disaster', 'end of the world'
    ],
    patterns: [
      /everything (is|feels) (ruined|over|lost|destroyed)/i,
      /this changes everything/i,
      /i (can't|can not) believe (this is|what) happening/i,
      /all that (work|effort|time) for nothing/i,
      /(whole|entire|the) relationship is (over|ruined|done)/i,
      /i('ve| have) lost everything/i,
      /(nothing|life|world) (matters|makes sense) anymore/i
    ],
    emotionalState: 'catastrophizing',
    warmthMultiplier: 0.7
  },

  // LAW 6: PRESENTISM (Positive)
  // "Right now dominates past and future" - Joy version
  presentismPositive: {
    keywords: [
      'this is amazing', 'everything feels perfect', 'can\'t believe how good',
      'this moment is everything', 'so happy i could cry', 'nothing else matters',
      'best day ever', 'incredible', 'magical moment', 'pure joy',
      'overwhelmed with happiness', 'on top of the world', 'couldn\'t be happier',
      'blissful', 'ecstatic', 'euphoric', 'over the moon'
    ],
    patterns: [
      /(this|it) is (amazing|wonderful|incredible|perfect|magical)/i,
      /everything feels (perfect|amazing|right|good)/i,
      /i (can't|can not) believe how (good|happy|wonderful)/i,
      /this moment is everything/i,
      /so happy i could (cry|burst|explode)/i,
      /nothing else matters right now/i,
      /best (day|moment|time) (ever|of my life)/i,
      /(pure|absolute|complete) (joy|happiness|bliss)/i
    ],
    emotionalState: 'peak_joy',
    isPositive: true,
    celebrationLevel: 0.9
  }
};

// Emotional state mappings for response calibration
const EMOTIONAL_STATES = {
  inadequacy: {
    description: 'Comparing to wrong mountain',
    primaryNeed: 'reframing',
    constitutionalFocus: 'strengths'
  },
  disappointment: {
    description: 'Reality not matching expectation',
    primaryNeed: 'adjustment',
    constitutionalFocus: 'season'
  },
  grief: {
    description: 'Loss hitting 2-3x harder than expected',
    primaryNeed: 'presence',
    constitutionalFocus: 'support'
  },
  concern: {
    description: 'Misinterpreting normal fading',
    primaryNeed: 'education',
    constitutionalFocus: 'depth'
  },
  overwhelm: {
    description: 'Too much good, needs break',
    primaryNeed: 'permission',
    constitutionalFocus: 'boundaries'
  },
  catastrophizing: {
    description: 'Present pain eclipsing history',
    primaryNeed: 'perspective',
    constitutionalFocus: 'mountain_view'
  },
  peak_joy: {
    description: 'Beautiful moment to anchor',
    primaryNeed: 'amplification',
    constitutionalFocus: 'neuroplasticity'
  }
};

/**
 * Six Laws Detector Class
 * Analyzes text to identify which of the Six Laws is being triggered
 */
class SixLawsDetector {
  constructor() {
    this.patterns = SIX_LAWS_PATTERNS;
    this.emotionalStates = EMOTIONAL_STATES;
    this.history = [];
    this.maxHistory = 50;
  }

  /**
   * Detect which Six Laws are triggered by the user's message
   * @param {string} text - User's message
   * @returns {object} Detection result with laws triggered and recommended response mode
   */
  detect(text) {
    if (!text || typeof text !== 'string') {
      return this.createNeutralResult();
    }

    const normalizedText = text.toLowerCase();
    const detectedLaws = [];

    // Check each law's patterns
    for (const [lawName, lawData] of Object.entries(this.patterns)) {
      const score = this.calculateLawScore(normalizedText, lawData);

      if (score > 0) {
        detectedLaws.push({
          law: lawName,
          score,
          emotionalState: lawData.emotionalState,
          warmthMultiplier: lawData.warmthMultiplier || 0,
          celebrationLevel: lawData.celebrationLevel || 0,
          isPositive: lawData.isPositive || false
        });
      }
    }

    // Sort by score descending
    detectedLaws.sort((a, b) => b.score - a.score);

    // Determine response mode
    const mode = this.determineMode(detectedLaws);

    // Calculate overall warmth level
    const warmthLevel = this.calculateWarmth(detectedLaws, mode);

    // Get constitutional guidance
    const primaryLaw = detectedLaws[0] || null;
    const constitutionalGuidance = primaryLaw
      ? this.emotionalStates[primaryLaw.emotionalState]
      : null;

    const result = {
      detectedLaws,
      primaryLaw: primaryLaw?.law || null,
      emotionalState: primaryLaw?.emotionalState || 'neutral',
      mode,
      warmthLevel,
      constitutionalGuidance,
      confidence: this.calculateConfidence(detectedLaws),
      timestamp: Date.now()
    };

    // Store in history
    this.addToHistory(result);

    return result;
  }

  /**
   * Calculate how strongly a law is triggered
   */
  calculateLawScore(text, lawData) {
    let score = 0;

    // Check keywords
    for (const keyword of lawData.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 0.15;
      }
    }

    // Check regex patterns
    for (const pattern of lawData.patterns) {
      if (pattern.test(text)) {
        score += 0.25;
      }
    }

    return Math.min(1, score);
  }

  /**
   * Determine whether to use Pillow Mode or Rocket Mode
   */
  determineMode(detectedLaws) {
    if (detectedLaws.length === 0) return 'neutral';

    // Check if any positive presentism detected
    const hasPositive = detectedLaws.some(law => law.isPositive);

    if (hasPositive && detectedLaws[0].isPositive) {
      return 'rocket';  // Joy anchoring mode
    }

    // Any Six Laws pain = Pillow Mode
    if (detectedLaws[0].warmthMultiplier > 0) {
      return 'pillow';  // Soft landing mode
    }

    return 'neutral';
  }

  /**
   * Calculate warmth level based on detected laws
   */
  calculateWarmth(detectedLaws, mode) {
    if (mode === 'rocket') {
      // Celebration mode - high energy, not warmth
      return 0.3;
    }

    if (detectedLaws.length === 0) return 0.5;

    // Use the highest warmth multiplier from detected laws
    const maxWarmth = Math.max(...detectedLaws.map(l => l.warmthMultiplier));

    // Base warmth is 1.0 (100%), multiplier adds extra
    return Math.min(2.0, 1.0 + maxWarmth);
  }

  /**
   * Calculate detection confidence
   */
  calculateConfidence(detectedLaws) {
    if (detectedLaws.length === 0) return 0.3;

    const primaryScore = detectedLaws[0].score;
    const lawCount = detectedLaws.length;

    // Higher confidence with clear primary and few laws
    return Math.min(1, primaryScore * 0.7 + Math.min(lawCount * 0.1, 0.3));
  }

  /**
   * Add result to history for pattern tracking
   */
  addToHistory(result) {
    this.history.push(result);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Get patterns from recent history
   */
  getRecentPatterns(count = 10) {
    const recent = this.history.slice(-count);
    const lawCounts = {};

    for (const result of recent) {
      if (result.primaryLaw) {
        lawCounts[result.primaryLaw] = (lawCounts[result.primaryLaw] || 0) + 1;
      }
    }

    return {
      dominantLaw: Object.entries(lawCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      lawCounts,
      modeBreakdown: {
        pillow: recent.filter(r => r.mode === 'pillow').length,
        rocket: recent.filter(r => r.mode === 'rocket').length,
        neutral: recent.filter(r => r.mode === 'neutral').length
      }
    };
  }

  /**
   * Create neutral result for invalid input
   */
  createNeutralResult() {
    return {
      detectedLaws: [],
      primaryLaw: null,
      emotionalState: 'neutral',
      mode: 'neutral',
      warmthLevel: 0.5,
      constitutionalGuidance: null,
      confidence: 0.3,
      timestamp: Date.now()
    };
  }

  /**
   * Get law description for response generation
   */
  getLawDescription(lawName) {
    const descriptions = {
      relativeComparison: {
        name: 'Relative Comparison',
        formula: 'Happiness = Reality - Reference Point',
        core: 'Your joy depends not on what you have, but what you compare it to.',
        intervention: 'mountain_metaphor'
      },
      motionOfExpectation: {
        name: 'Motion of Expectation',
        formula: 'Rising expectations hurt; Lowering helps',
        core: 'Expecting things to always improve sets up disappointment.',
        intervention: 'expectation_adjustment'
      },
      aversionToLoss: {
        name: 'Aversion to Loss',
        formula: 'Losses hurt 2-3x more than gains feel good',
        core: 'Losing something hurts way more than gaining the same thing feels good.',
        intervention: 'grief_support'
      },
      diminishingSensitivity: {
        name: 'Diminishing Sensitivity',
        formula: 'First experiences thrill most',
        core: 'The rush softening into steady love is actually deeper.',
        intervention: 'depth_reframe'
      },
      satiation: {
        name: 'Satiation',
        formula: 'Too much good -> wanting a break',
        core: 'Even beautiful things become exhausting without space.',
        intervention: 'permission_granting'
      },
      presentismNegative: {
        name: 'Presentism (Negative)',
        formula: 'Right now dominates past and future',
        core: 'This moment is SO BIG, it\'s temporarily erasing all the good.',
        intervention: 'perspective_restoration'
      },
      presentismPositive: {
        name: 'Presentism (Positive)',
        formula: 'Right now is EVERYTHING',
        core: 'This moment is beautiful - let\'s anchor it forever.',
        intervention: 'joy_anchoring'
      }
    };

    return descriptions[lawName] || null;
  }
}

// Export singleton instance
export const sixLawsDetector = new SixLawsDetector();
export default SixLawsDetector;
