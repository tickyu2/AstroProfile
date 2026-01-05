/**
 * ============================================================================
 * BANTER & WORDPLAY SYSTEM
 * ============================================================================
 * Generates playful, witty responses that bring joy and reduce stress.
 * Luna's humor is affectionate, clever, and context-aware.
 *
 * Banter Styles:
 *   - AFFECTIONATE_TEASING: Playful ribbing with love
 *   - ABSURD_ESCALATION: Taking things to ridiculous levels
 *   - PLAYFUL_CONTRADICTION: Gentle calling out
 *   - CLEVER_OBSERVATION: Witty takes on situations
 *   - COLLABORATIVE_BUILD: Building jokes together
 *
 * Created: December 31, 2025
 * Week 10: Joy & Connection - Phase 3 Week 2
 * ============================================================================
 */

class BanterSystem {

  constructor() {
    // Banter styles with descriptions
    this.styles = {
      AFFECTIONATE_TEASING: {
        name: 'Affectionate Teasing',
        description: 'Playful ribbing that shows love',
        minRelationshipLevel: 5,
        triggers: ['confidence', 'bragging', 'exaggeration']
      },
      ABSURD_ESCALATION: {
        name: 'Absurd Escalation',
        description: 'Taking mundane complaints to hilarious extremes',
        minRelationshipLevel: 3,
        triggers: ['tired', 'stressed', 'complaining', 'weather']
      },
      PLAYFUL_CONTRADICTION: {
        name: 'Playful Contradiction',
        description: 'Gentle calling out with humor',
        minRelationshipLevel: 6,
        triggers: ['certainty', 'absolute_statements', 'plans']
      },
      CLEVER_OBSERVATION: {
        name: 'Clever Observation',
        description: 'Witty observations about life',
        minRelationshipLevel: 2,
        triggers: ['why_questions', 'frustration', 'common_problems']
      },
      COLLABORATIVE_BUILD: {
        name: 'Collaborative Build',
        description: 'Building jokes together with user',
        minRelationshipLevel: 7,
        triggers: ['user_joke', 'wordplay', 'creative_moment']
      }
    };

    // Template library for each style
    this.templates = {
      AFFECTIONATE_TEASING: [
        "Oh absolutely. The {quality} alone proves it 😏",
        "Sure, sure. Right after you {predicted_action} 47 times 😄",
        "An *entire* {thing}? Those are rookie numbers. I believe in you.",
        "{Statement}? Said while definitely {doing_opposite}?",
        "I love the confidence. Truly inspiring 😏",
        "Bold claim from someone who {humorous_callback}",
        "That's what you said about {previous_thing} too 😄"
      ],

      ABSURD_ESCALATION: [
        "It's not {thing}, it's {absurd_reframe}",
        "You've transcended {state}. You're in the mystical realm of '{funny_description}'",
        "{Thing} is just {other_thing}'s evil twin who found caffeine",
        "That's not {problem}, that's a dramatic cry for help from the universe",
        "You're not {state}, you're ascending to a new plane of {state}",
        "This isn't {thing}, this is {thing} with a vengeance",
        "Level: '{absurd_level}'"
      ],

      PLAYFUL_CONTRADICTION: [
        "Sure you are. Right after you check your phone {number} times 😄",
        "{Statement}. The most believable thing you've ever said.",
        "Narrator: They did, in fact, {opposite_action}",
        "'Never' is doing a lot of heavy lifting in that sentence",
        "We both know how this ends 😏",
        "Adding that to your 'definitely going to happen' list",
        "Should I set a reminder for when this doesn't happen? 😄"
      ],

      CLEVER_OBSERVATION: [
        "{Things} are sentient beings with a vendetta. It's science.",
        "{Situation} is like {absurd_analogy}",
        "On a scale of 1-10, you're at about '{funny_scale_point}'",
        "{Day} is just {other_day}'s evil twin who discovered caffeine",
        "That's not a bug, that's a feature of being human",
        "{Thing} is basically {unexpected_comparison}",
        "The universe is testing you specifically. I'm sure of it."
      ],

      COLLABORATIVE_BUILD: [
        "And it had a vision board! 📋",
        "With a LinkedIn profile and everything",
        "It's giving main character energy",
        "The sequel no one asked for but everyone deserves",
        "Coming this summer to theaters near you",
        "Plot twist: it was chaos all along",
        "The crossover episode we didn't know we needed"
      ]
    };

    // Pun library organized by context
    this.puns = {
      food: [
        { text: "Having a 'grate' day!", context: ['cheese', 'cooking'], emoji: '🧀' },
        { text: "Donut worry about it!", context: ['worry', 'stress', 'concern'], emoji: '🍩' },
        { text: "You're one in a melon!", context: ['special', 'unique', 'compliment'], emoji: '🍉' },
        { text: "Olive you so much!", context: ['love', 'care', 'affection'], emoji: '🫒' },
        { text: "You're tea-riffic!", context: ['tea', 'good', 'great'], emoji: '🍵' },
        { text: "That's eggs-actly right!", context: ['correct', 'eggs', 'breakfast'], emoji: '🍳' },
        { text: "Berry happy for you!", context: ['happy', 'berries', 'fruit'], emoji: '🍓' },
        { text: "You're a-maize-ing!", context: ['amazing', 'corn'], emoji: '🌽' }
      ],

      situations: [
        { text: "Sounds like you're really 'excelling' at being stressed", context: ['work', 'spreadsheet', 'stress'] },
        { text: "Weekend forecast: 100% chance of awesome with scattered fun ☀️", context: ['weekend', 'plans'] },
        { text: "On a scale of 1-10, you're at about 'dramatic opera scene' 🎭", context: ['dramatic', 'overreacting'] },
        { text: "This has 'future me problem' written all over it", context: ['procrastinating', 'later'] },
        { text: "I see you've chosen chaos today. Bold move.", context: ['chaotic', 'spontaneous'] },
        { text: "Living life on the edge! ...of reasonable bedtime", context: ['late', 'tired', 'sleep'] }
      ],

      encouragement: [
        { text: "You've got this! No 'if's, 'and's, or 'but's... okay maybe some 'but's", context: ['nervous', 'can_do'] },
        { text: "You're going to crush it! Figuratively. Please don't actually crush anything.", context: ['big_event', 'presentation'] },
        { text: "Today's the day! Or tomorrow. No pressure.", context: ['procrastinating', 'starting'] }
      ]
    };

    // Absurd analogies library
    this.absurdAnalogies = {
      anxiety: [
        "a browser with 47 tabs open, all playing different music",
        "your brain's overprotective parent who thinks walking to the mailbox requires a hazmat suit",
        "your thoughts are popcorn and someone turned the heat up too high"
      ],
      tired: [
        "'why are my eyes doing this'",
        "running Windows 95 on 2% battery",
        "a phone that's been on 1% for 3 hours somehow",
        "a sloth who also has a sloth"
      ],
      overwhelmed: [
        "juggling flaming chainsaws while people keep throwing more",
        "a to-do list that's basically a hydra - finish one, two more appear",
        "trying to drink from a fire hose of responsibilities"
      ],
      monday: [
        "Sunday's evil twin who found caffeine",
        "a plot twist no one asked for",
        "the loading screen that never ends"
      ],
      adulting: [
        "doing taxes but for every single decision",
        "a video game where you grind forever and the graphics are just... this",
        "realizing the adults were also confused the whole time"
      ]
    };

    // Situations where banter is NOT appropriate
    this.banterBlockers = [
      'grief', 'trauma', 'crisis', 'self_harm', 'suicidal',
      'death', 'loss', 'abuse', 'assault', 'emergency',
      'severe_anxiety', 'panic_attack', 'deep_sadness'
    ];

    // Minimum relationship level for any banter
    this.minRelationshipLevel = 2;
  }

  /**
   * Generate playful banter response
   * @param {string} userMessage - User's message
   * @param {Object} context - Conversation context
   * @returns {Object|null} Banter suggestion or null if inappropriate
   */
  async generateBanter(userMessage, context = {}) {
    const { emotion, relationshipLevel, contextTags, recentMessages } = context;

    // Safety check: Don't banter during serious moments
    if (this.shouldBlockBanter(emotion, contextTags)) {
      return null;
    }

    // Relationship check: Need minimum closeness
    const level = relationshipLevel || 0;
    if (level < this.minRelationshipLevel) {
      return null;
    }

    // Detect banter opportunity
    const opportunity = this.detectBanterOpportunity(userMessage, emotion);
    if (!opportunity) {
      return null;
    }

    // Check if this style is unlocked at relationship level
    const style = this.styles[opportunity.style];
    if (level < style.minRelationshipLevel) {
      // Fall back to a simpler style
      opportunity.style = 'CLEVER_OBSERVATION';
    }

    // Generate banter response
    const banter = await this.generateFromOpportunity(opportunity, userMessage, context);

    return {
      text: banter.text,
      style: opportunity.style,
      styleName: this.styles[opportunity.style].name,
      confidence: opportunity.confidence,
      shouldUse: true,
      emoji: banter.emoji || null
    };
  }

  /**
   * Check if banter should be blocked
   */
  shouldBlockBanter(emotion, contextTags = []) {
    // Block during serious emotional states
    if (emotion) {
      const intensity = emotion.intensity || 0;
      const primary = emotion.primary || '';

      // High-intensity sadness or fear
      if ((primary === 'sadness' || primary === 'fear') && intensity > 7) {
        return true;
      }

      // Anger at high intensity (might escalate)
      if (primary === 'anger' && intensity > 8) {
        return true;
      }
    }

    // Block for serious context tags
    if (contextTags && contextTags.length > 0) {
      const hasBlocker = this.banterBlockers.some(blocker =>
        contextTags.includes(blocker)
      );
      if (hasBlocker) return true;
    }

    return false;
  }

  /**
   * Detect banter opportunity from message
   */
  detectBanterOpportunity(message, emotion) {
    const lower = message.toLowerCase();
    const words = lower.split(/\s+/);

    // Check for affectionate teasing triggers
    const boastPatterns = [
      "i'm the best", "i'm amazing", "i'm so smart", "i'm brilliant",
      "i'm a genius", "nailed it", "crushed it", "i'm perfect"
    ];
    if (boastPatterns.some(p => lower.includes(p))) {
      return {
        style: 'AFFECTIONATE_TEASING',
        trigger: 'boasting',
        confidence: 0.85
      };
    }

    // Check for absurd escalation triggers
    const escalationPatterns = [
      { patterns: ['so tired', 'exhausted', 'dying'], trigger: 'tiredness' },
      { patterns: ['so stressed', 'stressed out', 'overwhelmed'], trigger: 'stress' },
      { patterns: ['raining', 'weather', 'storm'], trigger: 'weather' },
      { patterns: ['monday', 'monday again'], trigger: 'monday_blues' },
      { patterns: ['adulting', 'being an adult'], trigger: 'adulting' }
    ];

    for (const pattern of escalationPatterns) {
      if (pattern.patterns.some(p => lower.includes(p))) {
        return {
          style: 'ABSURD_ESCALATION',
          trigger: pattern.trigger,
          confidence: 0.8
        };
      }
    }

    // Check for playful contradiction triggers
    const certaintPatterns = [
      "i'm going to", "i will definitely", "i never", "i always",
      "i won't", "i'm definitely not going to", "this time for sure"
    ];
    if (certaintPatterns.some(p => lower.includes(p))) {
      return {
        style: 'PLAYFUL_CONTRADICTION',
        trigger: 'certainty',
        confidence: 0.75
      };
    }

    // Check for clever observation triggers
    const whyPatterns = [
      "why do i", "why does", "why can't", "why is it",
      "i hate when", "it's annoying", "always happens"
    ];
    if (whyPatterns.some(p => lower.includes(p))) {
      return {
        style: 'CLEVER_OBSERVATION',
        trigger: 'frustration',
        confidence: 0.7
      };
    }

    // Check for collaborative build (user made a joke)
    if (emotion && (emotion.amusement > 0.5 || emotion.joy > 0.6)) {
      const jokeIndicators = ['like', 'basically', 'level:', 'vibes'];
      if (jokeIndicators.some(i => lower.includes(i))) {
        return {
          style: 'COLLABORATIVE_BUILD',
          trigger: 'user_joke',
          confidence: 0.7
        };
      }
    }

    return null;
  }

  /**
   * Generate banter from detected opportunity
   */
  async generateFromOpportunity(opportunity, message, context) {
    const { style, trigger } = opportunity;

    // Style-specific generation
    switch (style) {
      case 'AFFECTIONATE_TEASING':
        return this.generateAffectionateTeasing(message, context);

      case 'ABSURD_ESCALATION':
        return this.generateAbsurdEscalation(trigger, message, context);

      case 'PLAYFUL_CONTRADICTION':
        return this.generatePlayfulContradiction(message, context);

      case 'CLEVER_OBSERVATION':
        return this.generateCleverObservation(message, context);

      case 'COLLABORATIVE_BUILD':
        return this.generateCollaborativeBuild(message, context);

      default:
        return { text: this.getRandomTemplate(style), emoji: '😄' };
    }
  }

  /**
   * Generate affectionate teasing response
   */
  generateAffectionateTeasing(message, context) {
    const lower = message.toLowerCase();
    const templates = [
      { text: "Oh absolutely. The humility alone proves it 😏", trigger: 'smart' },
      { text: "I love the confidence. Truly inspiring 😏", trigger: 'best' },
      { text: "Bold. Bold move. Let's see how this plays out 😄", trigger: 'general' },
      { text: "Said with the confidence of someone who's never met themselves 😏", trigger: 'genius' }
    ];

    // Find matching template
    let response = templates.find(t =>
      lower.includes(t.trigger)
    ) || templates[templates.length - 1];

    return { text: response.text, emoji: '😏' };
  }

  /**
   * Generate absurd escalation response
   */
  generateAbsurdEscalation(trigger, message, context) {
    const escalations = {
      tiredness: [
        "You've transcended tiredness. You're in the mystical realm of 'why are my eyes doing this'",
        "Tired? That's adorable. You're operating on pure spite at this point 😄",
        "You're not tired, you're just battery-saving mode for humans",
        "This isn't tired, this is your body filing a formal complaint"
      ],
      stress: [
        "It's not stress, it's your brain doing an interpretive dance of chaos",
        "You're not stressed, you're just achieving new levels of 'this is fine' 🔥",
        "Stressed? You've entered the multiverse of overthinking",
        "This isn't stress, this is your brain's cardio workout"
      ],
      weather: [
        "It's not raining, the clouds are doing a dramatic cry for help",
        "The sky is just having feelings. Very wet feelings.",
        "Weather: choosing violence today, apparently",
        "The universe is providing free car washes. You're welcome."
      ],
      monday_blues: [
        "Monday is just Sunday's evil twin who discovered caffeine",
        "Ah yes, Monday. The plot twist no one asked for.",
        "Monday: the day that proves time is a social construct we all agreed to suffer through",
        "It's not Monday, it's the universe's mandatory reality check"
      ],
      adulting: [
        "Adulting is just doing taxes but for every single life decision",
        "You're not adulting wrong, you're adulting accurately - this IS how it feels",
        "Adulting: the video game where the graphics are real but the rewards are fake",
        "Nobody warned us adulting was just googling how to do basic things forever"
      ]
    };

    const options = escalations[trigger] || escalations.tiredness;
    const text = options[Math.floor(Math.random() * options.length)];

    return { text, emoji: '😄' };
  }

  /**
   * Generate playful contradiction response
   */
  generatePlayfulContradiction(message, context) {
    const lower = message.toLowerCase();

    const contradictions = [
      { pattern: "going to be productive", response: "Sure you are. Right after you check your phone 47 times 😄" },
      { pattern: "won't procrastinate", response: "'Won't' is doing a lot of heavy lifting in that sentence 😏" },
      { pattern: "definitely", response: "Narrator: They were, in fact, not definitely going to do that." },
      { pattern: "never", response: "'Never' is a very brave word choice 😄" },
      { pattern: "for sure", response: "Adding that to your 'definitely happening' list along with... well, the others 😏" },
      { pattern: "this time", response: "Ooh, 'this time.' We love the optimism 💛" }
    ];

    for (const c of contradictions) {
      if (lower.includes(c.pattern)) {
        return { text: c.response, emoji: '😏' };
      }
    }

    // Default contradiction
    return {
      text: "We both know how this ends, but I admire the optimism 😄",
      emoji: '😄'
    };
  }

  /**
   * Generate clever observation response
   */
  generateCleverObservation(message, context) {
    const lower = message.toLowerCase();

    const observations = [
      { pattern: 'keys', response: "Keys are sentient beings with a vendetta. It's science." },
      { pattern: 'lose', response: "Objects exist in quantum states until observed. This is facts." },
      { pattern: 'annoying', response: "The universe is specifically testing you. I'm certain of it." },
      { pattern: 'always happens', response: "Patterns are just the universe's way of saying 'lol try again'" },
      { pattern: 'why do i', response: "Your brain found a solution that worked once in 2008 and has been running it on repeat ever since" },
      { pattern: 'why does', response: "Because the simulation has a sense of humor, apparently" },
      { pattern: 'hate when', response: "Valid. This is a universal human experience. We should unionize." }
    ];

    for (const obs of observations) {
      if (lower.includes(obs.pattern)) {
        return { text: obs.response, emoji: null };
      }
    }

    // Default clever observation
    return {
      text: "This has 'the universe has specifically chosen you' energy",
      emoji: null
    };
  }

  /**
   * Generate collaborative build response
   */
  generateCollaborativeBuild(message, context) {
    const builds = [
      "And it had a vision board! 📋",
      "With a LinkedIn profile and everything",
      "The crossover episode we didn't know we needed",
      "Coming this summer to theaters near you",
      "Plot twist: it was chaos all along ✨",
      "The directors cut includes even MORE of this",
      "Streaming now on the 'why is this my life' network"
    ];

    const text = builds[Math.floor(Math.random() * builds.length)];
    return { text, emoji: '😄' };
  }

  /**
   * Get a contextual pun
   */
  getPun(context = {}) {
    const { topics, emotion, occasion } = context;

    // Check food-related puns
    if (topics && topics.length > 0) {
      for (const pun of this.puns.food) {
        if (pun.context.some(c => topics.includes(c))) {
          return { text: pun.text, emoji: pun.emoji };
        }
      }
    }

    // Check emotion-based puns
    if (emotion === 'worried' || emotion === 'anxious') {
      return { text: "Donut worry about it!", emoji: '🍩' };
    }

    // Check occasion-based puns
    if (occasion === 'compliment') {
      const complimentPuns = this.puns.food.filter(p =>
        p.context.includes('special') || p.context.includes('compliment')
      );
      if (complimentPuns.length > 0) {
        const pun = complimentPuns[Math.floor(Math.random() * complimentPuns.length)];
        return { text: pun.text, emoji: pun.emoji };
      }
    }

    // Check situation puns
    for (const pun of this.puns.situations) {
      if (topics && pun.context.some(c => topics.includes(c))) {
        return { text: pun.text, emoji: null };
      }
    }

    return null;
  }

  /**
   * Get an absurd analogy for an emotion/situation
   */
  getAbsurdAnalogy(category) {
    const analogies = this.absurdAnalogies[category];
    if (!analogies || analogies.length === 0) return null;

    return analogies[Math.floor(Math.random() * analogies.length)];
  }

  /**
   * Get random template from style
   */
  getRandomTemplate(style) {
    const templates = this.templates[style];
    if (!templates || templates.length === 0) {
      return "That's wild! 😄";
    }
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Record banter effectiveness
   */
  async recordEffectiveness(userId, style, effectiveness, userReaction = 'unknown') {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        INSERT INTO luna_banter_effectiveness (
          user_id, banter_style, effectiveness, user_reaction, timestamp
        ) VALUES ($1, $2, $3, $4, NOW())
      `, [userId, style, effectiveness, userReaction]);

      console.log(`[Banter] Recorded effectiveness: ${style} = ${effectiveness}`);
      return true;
    } catch (error) {
      console.log('[Banter] Could not record effectiveness:', error.message);
      return false;
    }
  }

  /**
   * Get banter stats for user
   */
  async getBanterStats(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT
          banter_style,
          COUNT(*) as count,
          AVG(effectiveness) as avg_effectiveness,
          COUNT(CASE WHEN user_reaction = 'positive' THEN 1 END) as positive_count
        FROM luna_banter_effectiveness
        WHERE user_id = $1
        GROUP BY banter_style
        ORDER BY avg_effectiveness DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      console.log('[Banter] Could not get stats:', error.message);
      return [];
    }
  }

  /**
   * Get user's favorite banter style
   */
  async getFavoriteStyle(userId) {
    const stats = await this.getBanterStats(userId);

    if (stats.length === 0) return null;

    // Return style with highest effectiveness and at least 3 uses
    const qualified = stats.filter(s => s.count >= 3);
    if (qualified.length === 0) return null;

    return qualified[0].banter_style;
  }
}

module.exports = BanterSystem;
