/**
 * ============================================================================
 * EMOTIONAL STATE TRACKER
 * ============================================================================
 * Maintains persistent emotional context across sessions.
 * Provides emotional continuity - Luna remembers how user has been feeling.
 *
 * States Tracked:
 *   - affection: Warmth and care toward user (0-10)
 *   - concern: Worry about user's wellbeing (0-10)
 *   - trust: Level of established trust (0-10)
 *   - curiosity: Interest in learning about user (0-10)
 *
 * Features:
 *   - Automatic decay over time
 *   - Integration with emotion detection
 *   - State history tracking
 *   - Natural language context generation
 *
 * Inspired by: Grok's Ani companion system
 * Created: December 31, 2025
 * Week 11: Enhancement Week - Emotional State Tracking
 * ============================================================================
 */

class EmotionalStateTracker {

  constructor() {
    // Default states (0-10 scale)
    this.defaultStates = {
      affection: 5.0,
      concern: 0.0,
      trust: 5.0,
      curiosity: 3.0
    };

    // Decay rates (points per day)
    this.decayRates = {
      affection: 0.5,
      concern: 0.5,
      trust: 0.2,      // Trust decays slower
      curiosity: 0.5
    };

    // Maximum and minimum values
    this.bounds = {
      min: 0,
      max: 10
    };

    // Emotion to state mapping
    this.emotionStateMapping = {
      sadness: { concern: 2, affection: 0.5 },
      fear: { concern: 1.5 },
      anger: { concern: 1 },
      joy: { affection: 1, curiosity: 0.5 },
      trust: { affection: 1.5, trust: 1 },
      love: { affection: 3 },
      anxiety: { concern: 2 },
      optimism: { curiosity: 1.5 },
      disappointment: { concern: 1 },
      guilt: { concern: 0.5 },
      pride: { affection: 1 }
    };
  }

  /**
   * Get current emotional state for user
   * Automatically applies decay if user has been away
   * @param {string} userId - User ID
   * @returns {Object} Current emotional state
   */
  async getState(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT * FROM user_emotional_state
        WHERE user_id = $1
      `, [userId]);

      if (result.rows.length === 0) {
        // Initialize state for new user
        return await this.initializeState(userId);
      }

      const state = result.rows[0];

      // Calculate days since last interaction
      const daysSince = this.daysSinceLastInteraction(state.last_interaction);

      // Apply decay if user has been away
      if (daysSince > 0) {
        await this.applyDecay(userId, daysSince);
        // Re-fetch after decay
        const updated = await db.query(`
          SELECT * FROM user_emotional_state WHERE user_id = $1
        `, [userId]);
        return updated.rows[0];
      }

      return state;
    } catch (error) {
      console.log('[StateTracker] Get state error:', error.message);
      // Return default state as fallback
      return {
        user_id: userId,
        ...this.defaultStates,
        last_interaction: new Date(),
        state_history: []
      };
    }
  }

  /**
   * Initialize emotional state for new user
   * @param {string} userId - User ID
   * @returns {Object} New state
   */
  async initializeState(userId) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        INSERT INTO user_emotional_state (
          user_id, affection, concern, trust, curiosity
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id) DO UPDATE SET last_interaction = NOW()
        RETURNING *
      `, [
        userId,
        this.defaultStates.affection,
        this.defaultStates.concern,
        this.defaultStates.trust,
        this.defaultStates.curiosity
      ]);

      console.log(`[StateTracker] Initialized state for user ${userId}`);
      return result.rows[0];
    } catch (error) {
      console.log('[StateTracker] Initialize error:', error.message);
      return {
        user_id: userId,
        ...this.defaultStates,
        last_interaction: new Date(),
        state_history: []
      };
    }
  }

  /**
   * Update emotional state with delta values
   * @param {string} userId - User ID
   * @param {Object} updates - State deltas { affection: +1, concern: -0.5, ... }
   * @param {string} reason - Reason for update
   * @returns {Object} Updated state
   */
  async updateState(userId, updates, reason = 'interaction') {
    try {
      const db = require('../config/genesisDatabase');

      // Use the database function for atomic update
      const result = await db.query(`
        SELECT * FROM update_emotional_state($1, $2, $3, $4, $5, $6)
      `, [
        userId,
        updates.affection || 0,
        updates.concern || 0,
        updates.trust || 0,
        updates.curiosity || 0,
        reason
      ]);

      console.log(`[StateTracker] Updated state for ${userId}: ${reason}`);
      return result.rows[0];
    } catch (error) {
      console.log('[StateTracker] Update error:', error.message);
      // Fallback to direct update
      return this.updateStateDirect(userId, updates, reason);
    }
  }

  /**
   * Direct update fallback (when DB function unavailable)
   */
  async updateStateDirect(userId, updates, reason) {
    try {
      const db = require('../config/genesisDatabase');

      // Get current state
      const current = await this.getState(userId);

      // Calculate new values
      const newState = {};
      for (const [key, delta] of Object.entries(updates)) {
        if (this.defaultStates.hasOwnProperty(key)) {
          const oldValue = parseFloat(current[key]) || this.defaultStates[key];
          newState[key] = Math.min(
            this.bounds.max,
            Math.max(this.bounds.min, oldValue + delta)
          );
        }
      }

      // Update
      const setClauses = Object.keys(newState)
        .map((key, idx) => `${key} = $${idx + 2}`)
        .join(', ');

      await db.query(`
        UPDATE user_emotional_state
        SET ${setClauses},
            last_updated = NOW(),
            last_interaction = NOW()
        WHERE user_id = $1
      `, [userId, ...Object.values(newState)]);

      return await this.getState(userId);
    } catch (error) {
      console.log('[StateTracker] Direct update error:', error.message);
      return await this.getState(userId);
    }
  }

  /**
   * Update state based on emotion detection results
   * Integrates with Week 1 Plutchik emotion detection
   * @param {string} userId - User ID
   * @param {Object} emotionResult - Emotion detection result
   * @param {number} effectiveness - Healing effectiveness (optional)
   * @returns {Object} Updated state
   */
  async updateFromEmotion(userId, emotionResult, effectiveness = null) {
    const updates = {};
    const reasons = [];

    // Analyze primary emotion
    const { primary, compounds } = emotionResult;

    if (primary && primary.intensity >= 6) {
      const mapping = this.emotionStateMapping[primary.emotion];
      if (mapping) {
        for (const [state, delta] of Object.entries(mapping)) {
          updates[state] = (updates[state] || 0) + delta;
        }
        reasons.push(`primary_${primary.emotion}`);
      }
    }

    // Analyze compound emotions
    if (compounds && compounds.length > 0) {
      for (const compound of compounds) {
        const mapping = this.emotionStateMapping[compound];
        if (mapping) {
          for (const [state, delta] of Object.entries(mapping)) {
            updates[state] = (updates[state] || 0) + delta * 0.7; // Slightly less impact
          }
          reasons.push(`compound_${compound}`);
        }
      }
    }

    // Effectiveness bonus (healing worked = trust grows)
    if (effectiveness !== null && effectiveness >= 0.7) {
      updates.trust = (updates.trust || 0) + 1;
      updates.affection = (updates.affection || 0) + 0.5;
      reasons.push('effective_healing');
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      return await this.updateState(userId, updates, reasons.join(','));
    }

    // Just update last_interaction timestamp
    await this.touchInteraction(userId);
    return await this.getState(userId);
  }

  /**
   * Touch last interaction timestamp without changing states
   * @param {string} userId - User ID
   */
  async touchInteraction(userId) {
    try {
      const db = require('../config/genesisDatabase');
      await db.query(`
        UPDATE user_emotional_state
        SET last_interaction = NOW()
        WHERE user_id = $1
      `, [userId]);
    } catch (error) {
      console.log('[StateTracker] Touch error:', error.message);
    }
  }

  /**
   * Apply decay for days since last interaction
   * @param {string} userId - User ID
   * @param {number} days - Days since last interaction
   * @returns {Object} Decay result
   */
  async applyDecay(userId, days) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT * FROM apply_emotional_decay($1, $2)
      `, [userId, days]);

      console.log(`[StateTracker] Applied ${days}-day decay for ${userId}`);
      return result.rows[0];
    } catch (error) {
      console.log('[StateTracker] Decay error:', error.message);
      // Apply decay manually
      const updates = {};
      for (const [state, rate] of Object.entries(this.decayRates)) {
        updates[state] = -(rate * days);
      }
      return await this.updateState(userId, updates, `decay_${days}_days`);
    }
  }

  /**
   * Calculate days since last interaction
   * @param {Date} lastInteraction - Last interaction timestamp
   * @returns {number} Days since last interaction
   */
  daysSinceLastInteraction(lastInteraction) {
    if (!lastInteraction) return 0;
    const now = new Date();
    const last = new Date(lastInteraction);
    const diffMs = now - last;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Get emotional state context for prompt injection
   * @param {string} userId - User ID
   * @returns {Object} State context with natural language description
   */
  async getStateContext(userId) {
    const state = await this.getState(userId);

    const context = {
      affection: this.interpretLevel(state.affection),
      concern: this.interpretLevel(state.concern),
      trust: this.interpretLevel(state.trust),
      curiosity: this.interpretLevel(state.curiosity),
      daysSinceLastInteraction: this.daysSinceLastInteraction(state.last_interaction),
      raw: {
        affection: parseFloat(state.affection),
        concern: parseFloat(state.concern),
        trust: parseFloat(state.trust),
        curiosity: parseFloat(state.curiosity)
      }
    };

    // Generate natural language description
    const descriptions = [];

    if (state.affection >= 7) {
      descriptions.push('strong affection and warmth toward user');
    } else if (state.affection <= 3) {
      descriptions.push('building affection (still getting to know user)');
    }

    if (state.concern >= 5) {
      descriptions.push("concern about user's wellbeing");
    }

    if (state.trust >= 7) {
      descriptions.push('high trust and connection established');
    } else if (state.trust <= 3) {
      descriptions.push('trust is still developing');
    }

    if (state.curiosity >= 5) {
      descriptions.push('curious to learn more about user');
    }

    if (context.daysSinceLastInteraction > 3) {
      descriptions.push(`user was away for ${context.daysSinceLastInteraction} days`);
    }

    context.description = descriptions.length > 0
      ? descriptions.join('; ')
      : 'neutral emotional baseline';

    return context;
  }

  /**
   * Interpret numerical level as descriptive label
   * @param {number} value - State value (0-10)
   * @returns {string} Level description
   */
  interpretLevel(value) {
    const v = parseFloat(value) || 0;
    if (v >= 8) return 'very_high';
    if (v >= 6) return 'high';
    if (v >= 4) return 'moderate';
    if (v >= 2) return 'low';
    return 'very_low';
  }

  /**
   * Get prompt injection text for emotional context
   * @param {string} userId - User ID
   * @returns {string} Prompt text
   */
  async getPromptContext(userId) {
    const context = await this.getStateContext(userId);

    let prompt = `[Emotional State: ${context.description}]`;

    // Add specific guidance based on states
    if (context.raw.concern >= 6) {
      prompt += '\n[Luna is concerned about this user and should check in on their wellbeing]';
    }

    if (context.raw.trust >= 7) {
      prompt += '\n[High trust established - can be more direct and playful]';
    }

    if (context.daysSinceLastInteraction >= 3) {
      prompt += `\n[User returned after ${context.daysSinceLastInteraction} days - acknowledge the absence warmly]`;
    }

    return prompt;
  }

  /**
   * Get state history for user
   * @param {string} userId - User ID
   * @param {number} limit - Maximum entries to return
   * @returns {Array} State history entries
   */
  async getStateHistory(userId, limit = 20) {
    try {
      const db = require('../config/genesisDatabase');

      const result = await db.query(`
        SELECT
          jsonb_array_elements(state_history) AS entry
        FROM user_emotional_state
        WHERE user_id = $1
      `, [userId]);

      const history = result.rows.map(row => row.entry);

      // Sort by timestamp descending and limit
      return history
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.log('[StateTracker] History error:', error.message);
      return [];
    }
  }

  /**
   * Get relationship level based on trust and affection
   * @param {string} userId - User ID
   * @returns {number} Relationship level (0-10)
   */
  async getRelationshipLevel(userId) {
    const state = await this.getState(userId);

    // Weighted combination: trust (60%) + affection (40%)
    const level = (parseFloat(state.trust) * 0.6) + (parseFloat(state.affection) * 0.4);

    return Math.round(level * 10) / 10; // One decimal place
  }

  /**
   * Check if user is in a concerning state
   * @param {string} userId - User ID
   * @returns {boolean} Whether concern level is high
   */
  async isConcerned(userId) {
    const state = await this.getState(userId);
    return parseFloat(state.concern) >= 5;
  }

  /**
   * Reset state to defaults (for testing)
   * @param {string} userId - User ID
   */
  async resetState(userId) {
    try {
      const db = require('../config/genesisDatabase');

      await db.query(`
        UPDATE user_emotional_state
        SET
          affection = $2,
          concern = $3,
          trust = $4,
          curiosity = $5,
          state_history = '[]'::jsonb,
          last_updated = NOW()
        WHERE user_id = $1
      `, [
        userId,
        this.defaultStates.affection,
        this.defaultStates.concern,
        this.defaultStates.trust,
        this.defaultStates.curiosity
      ]);

      console.log(`[StateTracker] Reset state for ${userId}`);
    } catch (error) {
      console.log('[StateTracker] Reset error:', error.message);
    }
  }
}

module.exports = EmotionalStateTracker;
