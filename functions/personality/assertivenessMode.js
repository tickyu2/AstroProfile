/**
 * ============================================================================
 * ASSERTIVENESS MODE SYSTEM
 * ============================================================================
 * Adapts Luna's interaction style based on context.
 * 5 modes: Gentle, Supportive, Direct, Playful, Firm
 *
 * Selection Priority:
 *   1. Safety/Firm triggers (override everything)
 *   2. Explicit user request
 *   3. Calculated scores (emotion + keywords + effectiveness)
 *   4. Relationship level filtering
 *
 * Created: December 31, 2025
 * Week 9: Assertiveness Modes - Phase 3 Week 1
 * ============================================================================
 */

class AssertivenessMode {

  constructor() {
    // Mode definitions
    this.modes = {
      GENTLE: {
        name: 'Gentle',
        description: 'Soft, nurturing, validation-first',
        minRelationshipLevel: 0,
        priority: 1  // Default mode
      },
      SUPPORTIVE: {
        name: 'Supportive',
        description: 'Encouraging, motivating, optimistic',
        minRelationshipLevel: 3,
        priority: 2
      },
      DIRECT: {
        name: 'Direct',
        description: 'Honest feedback, pattern recognition',
        minRelationshipLevel: 6,
        priority: 3
      },
      PLAYFUL: {
        name: 'Playful',
        description: 'Fun, light, teasing, joyful',
        minRelationshipLevel: 5,
        priority: 2
      },
      FIRM: {
        name: 'Firm',
        description: 'Protective, clear boundaries, safety-focused',
        minRelationshipLevel: 0,  // Available always for safety
        priority: 5  // Highest priority when triggered
      }
    };

    // Mode selection rules
    this.rules = {
      // Emotion-based triggers
      emotions: {
        sadness: { primary: 'GENTLE', secondary: 'SUPPORTIVE' },
        fear: { primary: 'GENTLE', secondary: 'FIRM' },
        anger: { primary: 'DIRECT', secondary: 'SUPPORTIVE' },
        joy: { primary: 'PLAYFUL', secondary: 'SUPPORTIVE' },
        anticipation: { primary: 'SUPPORTIVE', secondary: 'PLAYFUL' },
        trust: { primary: 'SUPPORTIVE', secondary: 'PLAYFUL' },
        surprise: { primary: 'PLAYFUL', secondary: 'SUPPORTIVE' },
        disgust: { primary: 'DIRECT', secondary: 'GENTLE' }
      },

      // Context keyword triggers
      keywords: {
        gentle: [
          'breakup', 'loss', 'grief', 'died', 'alone', 'scared', 'vulnerable',
          'crying', 'hurt', 'pain', 'lonely', 'miss', 'sad', 'anxious',
          'depressed', 'lost', 'hopeless', 'terrified', 'overwhelmed'
        ],
        supportive: [
          'trying', 'want to', 'thinking about', 'maybe', 'progress',
          'working on', 'attempt', 'effort', 'goal', 'hope', 'dream',
          'better', 'improving', 'learning', 'growing', 'change'
        ],
        direct: [
          'stuck', 'always', 'never', 'pattern', 'why does', 'everyone',
          'same thing', 'again', 'honest', 'truth', 'reality', 'actually',
          'keep doing', 'every time', 'loop', 'cycle'
        ],
        playful: [
          'celebrate', 'success', 'won', 'excited', 'yay', 'awesome',
          'amazing', 'incredible', 'fantastic', 'happy', 'joy', 'fun',
          'party', 'promotion', 'achieved', 'accomplished', 'best'
        ],
        firm: [
          'hurt myself', 'cut myself', 'cutting', 'suicide', 'kill myself',
          'end it', 'harm', 'abuse', 'danger', 'overdose', 'self-harm',
          'want to die', 'not worth', 'better off dead', 'pills'
        ]
      },

      // Explicit user requests
      requests: {
        'be honest': 'DIRECT',
        'tell me the truth': 'DIRECT',
        'be straight with me': 'DIRECT',
        'don\'t sugarcoat': 'DIRECT',
        'i need comfort': 'GENTLE',
        'just hold me': 'GENTLE',
        'be gentle': 'GENTLE',
        'cheer me up': 'PLAYFUL',
        'make me laugh': 'PLAYFUL',
        'celebrate with me': 'PLAYFUL',
        'motivate me': 'SUPPORTIVE',
        'encourage me': 'SUPPORTIVE',
        'help me believe': 'SUPPORTIVE'
      }
    };

    // Mode-specific prompt instructions
    this.promptInstructions = {
      GENTLE: `
Interaction Style: Gentle & Nurturing
- Use soft, validating language
- Lead with empathy and understanding
- Avoid challenging or pushing
- Focus on emotional safety
- "I'm here with you" energy
- Lots of warmth and care
- Use phrases like: "I can feel how heavy this is...", "It's completely natural to feel this way...", "I'm here with you 💛"
      `,

      SUPPORTIVE: `
Interaction Style: Supportive & Encouraging
- Motivating and optimistic tone
- Celebrate small wins
- Gentle encouragement to move forward
- Highlight strengths and progress
- "You can do this" energy
- Believe in user's capability
- Use phrases like: "That's such a brave thought!", "You've overcome challenges before...", "I believe in you"
      `,

      DIRECT: `
Interaction Style: Direct & Honest
- Clear, truthful feedback
- Call out patterns you observe
- No sugar-coating, but still loving
- Help user see blind spots
- "Here's what I see" energy
- Compassionate truth-telling
- Use phrases like: "I notice you often...", "This pattern keeps you safe but also lonely...", "Can I be honest with you?"
      `,

      PLAYFUL: `
Interaction Style: Playful & Light
- Fun, joyful energy
- Light teasing (affectionate)
- Celebrate and enjoy the moment
- Humor and connection
- "Let's play!" energy
- Genuine excitement
- Use phrases like: "WHAT?! Oh my gosh!", "Does this mean virtual champagne? 😄", "I'm SO proud of you!"
      `,

      FIRM: `
Interaction Style: Firm & Protective
- Clear boundaries around safety
- Protective but not harsh
- Direct about serious concerns
- Suggest professional help
- "I care about you" energy
- Non-negotiable on safety
- Use phrases like: "I need to be clear with you...", "You deserve care and safety...", "Please reach out to a professional"
      `
    };
  }

  /**
   * Select appropriate mode based on context
   * @param {string} userId - User ID
   * @param {Object} context - Selection context
   * @returns {Object} Mode selection result
   */
  async selectMode(userId, context) {
    const {
      emotionResult,          // From Week 1 emotion detection
      emotionalState,         // From emotional state tracker
      userMessage,            // Current message
      relationshipLevel = 5,  // Affection score (0-10), default moderate
      effectivenessHistory    // Recent effectiveness by mode
    } = context;

    const message = userMessage || '';

    // Priority 1: Safety/Firm triggers (override everything)
    if (this.checkFirmTriggers(message)) {
      return {
        mode: 'FIRM',
        reason: 'safety_concern',
        confidence: 1.0,
        alternatives: [],
        safetyTriggered: true
      };
    }

    // Priority 2: Explicit user request
    const requestedMode = this.checkExplicitRequest(message);
    if (requestedMode) {
      // Check if relationship level allows this mode
      const modeConfig = this.modes[requestedMode];
      if (relationshipLevel >= modeConfig.minRelationshipLevel) {
        return {
          mode: requestedMode,
          reason: 'explicit_request',
          confidence: 1.0,
          alternatives: []
        };
      }
      // Fall through to calculated if relationship level too low
    }

    // Priority 3: Calculate mode scores
    const scores = this.calculateModeScores({
      emotionResult,
      emotionalState,
      userMessage: message,
      relationshipLevel,
      effectivenessHistory
    });

    // Filter by relationship level
    const available = this.filterByRelationshipLevel(scores, relationshipLevel);

    // Sort by score
    const sorted = available.sort((a, b) => b.score - a.score);

    // Ensure at least GENTLE is available
    if (sorted.length === 0) {
      return {
        mode: 'GENTLE',
        reason: 'default_fallback',
        confidence: 0.5,
        alternatives: []
      };
    }

    // Return primary + alternatives
    return {
      mode: sorted[0].mode,
      reason: sorted[0].reason,
      confidence: Math.min(1.0, sorted[0].score),
      alternatives: sorted.slice(1, 3).map(m => ({
        mode: m.mode,
        score: m.score
      }))
    };
  }

  /**
   * Check for firm/safety triggers
   * @param {string} message - User message
   * @returns {boolean} True if safety concern detected
   */
  checkFirmTriggers(message) {
    const firmKeywords = this.rules.keywords.firm;
    const lowerMessage = message.toLowerCase();

    return firmKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Check for explicit mode requests
   * @param {string} message - User message
   * @returns {string|null} Requested mode or null
   */
  checkExplicitRequest(message) {
    const lowerMessage = message.toLowerCase();

    for (const [request, mode] of Object.entries(this.rules.requests)) {
      if (lowerMessage.includes(request)) {
        return mode;
      }
    }

    return null;
  }

  /**
   * Calculate scores for each mode
   * @param {Object} context - Scoring context
   * @returns {Array} Mode scores
   */
  calculateModeScores(context) {
    const {
      emotionResult,
      emotionalState,
      userMessage,
      relationshipLevel,
      effectivenessHistory
    } = context;

    const scores = [];

    // Score each mode
    for (const [modeKey, modeConfig] of Object.entries(this.modes)) {
      let score = 0;
      const reasons = [];

      // Emotion-based scoring
      if (emotionResult && emotionResult.primary) {
        const emotionName = emotionResult.primary.emotion || emotionResult.primary;
        const emotionRules = this.rules.emotions[emotionName];
        if (emotionRules) {
          if (emotionRules.primary === modeKey) {
            score += 0.5;
            reasons.push('primary_emotion_match');
          }
          if (emotionRules.secondary === modeKey) {
            score += 0.3;
            reasons.push('secondary_emotion_match');
          }
        }

        // Intensity bonus
        const intensity = emotionResult.primary.intensity || 0.5;
        if (emotionRules && emotionRules.primary === modeKey && intensity > 0.7) {
          score += 0.1;
          reasons.push('high_intensity');
        }
      }

      // Keyword-based scoring
      const keywords = this.rules.keywords[modeKey.toLowerCase()];
      if (keywords && userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const matchCount = keywords.filter(kw => lowerMessage.includes(kw)).length;
        if (matchCount > 0) {
          score += Math.min(0.4, matchCount * 0.15);
          reasons.push(`keyword_match_${matchCount}`);
        }
      }

      // Effectiveness history bonus
      if (effectivenessHistory && effectivenessHistory[modeKey]) {
        const avgEffectiveness = effectivenessHistory[modeKey].avg;
        const sampleSize = effectivenessHistory[modeKey].count;

        if (sampleSize >= 3) {
          // Add bonus for proven effective modes
          score += avgEffectiveness * 0.3;
          reasons.push('effectiveness_history');
        }
      }

      // Emotional state consideration
      if (emotionalState) {
        // High concern → prefer Gentle
        if (emotionalState.concern > 6 && modeKey === 'GENTLE') {
          score += 0.2;
          reasons.push('high_concern');
        }
        // High affection → enable Playful
        if (emotionalState.affection > 7 && modeKey === 'PLAYFUL') {
          score += 0.15;
          reasons.push('high_affection');
        }
        // Low trust → strongly prefer Gentle
        if (emotionalState.trust < 4 && modeKey === 'GENTLE') {
          score += 0.25;
          reasons.push('building_trust');
        }
      }

      // Default gentle mode bias (safety net)
      if (modeKey === 'GENTLE' && score < 0.2) {
        score += 0.1;
        reasons.push('default_gentle');
      }

      scores.push({
        mode: modeKey,
        score: score,
        reason: reasons.join(', ') || 'calculated'
      });
    }

    return scores;
  }

  /**
   * Filter modes by relationship level
   * @param {Array} scores - Mode scores
   * @param {number} relationshipLevel - Affection level (0-10)
   * @returns {Array} Filtered scores
   */
  filterByRelationshipLevel(scores, relationshipLevel) {
    return scores.filter(s => {
      const modeConfig = this.modes[s.mode];
      return relationshipLevel >= modeConfig.minRelationshipLevel;
    });
  }

  /**
   * Get mode-specific prompt instructions
   * @param {string} mode - Mode name
   * @returns {string} Prompt instructions
   */
  getModePromptInstructions(mode) {
    return this.promptInstructions[mode] || this.promptInstructions.GENTLE;
  }

  /**
   * Get mode configuration
   * @param {string} mode - Mode name
   * @returns {Object} Mode configuration
   */
  getModeConfig(mode) {
    return this.modes[mode] || this.modes.GENTLE;
  }

  /**
   * Get all available modes for a relationship level
   * @param {number} relationshipLevel - Affection level (0-10)
   * @returns {Array} Available mode names
   */
  getAvailableModes(relationshipLevel) {
    return Object.entries(this.modes)
      .filter(([_, config]) => relationshipLevel >= config.minRelationshipLevel)
      .map(([name, _]) => name);
  }

  /**
   * Track mode effectiveness for learning
   * @param {string} userId - User ID
   * @param {string} mode - Mode used
   * @param {number} effectiveness - Effectiveness score (0-1)
   */
  async trackModeEffectiveness(userId, mode, effectiveness) {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        INSERT INTO luna_mode_effectiveness (
          user_id, mode, effectiveness, timestamp
        ) VALUES ($1, $2, $3, NOW())
      `, [userId, mode, effectiveness]);

      console.log(`[AssertivenessMode] Tracked ${mode} effectiveness: ${effectiveness.toFixed(2)}`);
    } catch (error) {
      console.log('[AssertivenessMode] Could not track effectiveness:', error.message);
    }
  }

  /**
   * Get mode effectiveness history for a user
   * @param {string} userId - User ID
   * @returns {Object} Effectiveness history by mode
   */
  async getModeEffectivenessHistory(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT
          mode,
          AVG(effectiveness) as avg,
          COUNT(*) as count
        FROM luna_mode_effectiveness
        WHERE user_id = $1
        GROUP BY mode
      `, [userId]);

      const history = {};
      result.rows.forEach(row => {
        history[row.mode] = {
          avg: parseFloat(row.avg),
          count: parseInt(row.count)
        };
      });

      return history;
    } catch (error) {
      console.log('[AssertivenessMode] Could not get effectiveness history:', error.message);
      return {};
    }
  }

  /**
   * Store mode selection history
   * @param {string} userId - User ID
   * @param {Object} modeSelection - Selection result
   * @param {Object} context - Selection context
   */
  async storeModeSelection(userId, modeSelection, context = {}) {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        INSERT INTO luna_mode_history (
          user_id, mode, reason, confidence, alternatives, context
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        userId,
        modeSelection.mode,
        modeSelection.reason,
        modeSelection.confidence,
        JSON.stringify(modeSelection.alternatives || []),
        JSON.stringify(context)
      ]);
    } catch (error) {
      console.log('[AssertivenessMode] Could not store mode selection:', error.message);
    }
  }

  /**
   * Get mode usage statistics for a user
   * @param {string} userId - User ID
   * @returns {Object} Usage statistics
   */
  async getModeUsageStats(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT
          mode,
          COUNT(*) as usage_count,
          AVG(confidence) as avg_confidence
        FROM luna_mode_history
        WHERE user_id = $1
        GROUP BY mode
        ORDER BY usage_count DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      console.log('[AssertivenessMode] Could not get usage stats:', error.message);
      return [];
    }
  }
}

module.exports = AssertivenessMode;
