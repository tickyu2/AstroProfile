/**
 * ============================================================================
 * STACK EXECUTOR
 * ============================================================================
 * Executes 3-stack healing sequences with perfect timing.
 *
 * The 3-stack pattern:
 * 1. Achievement anchor (1.0x) - establishes foundation
 * 2. Connection anchor (1.3x) - builds emotional resonance
 * 3. Delight anchor (1.6x) - peak effectiveness
 *
 * Timing is crucial: 15 seconds between anchors allows
 * synaptic consolidation and strengthening.
 *
 * Created: December 31, 2025
 * Week 5: Bathtub Healing Algorithm - Phase 2 Week 1
 * ============================================================================
 */

const BathtubCalculator = require('./bathtubCalculator');

class StackExecutor {
  constructor() {
    this.calculator = new BathtubCalculator();

    // Timing configuration (seconds)
    this.stackPauseDuration = 15; // seconds between anchors
    this.totalStackDuration = 30; // 2 pauses × 15 seconds
  }

  /**
   * Main execution: Select and deliver 3-stack healing
   * @param {string} userId - User ID
   * @param {Object} currentState - Current emotional state context
   * @returns {Object} Execution result with delivery sequence
   */
  async executeHealingStack(userId, currentState = null) {
    const db = require('../config/genesisDatabase');
    const HappinessAnchorRetrieval = require('../memory/anchorRetrieval');
    const retrieval = new HappinessAnchorRetrieval();

    // Get user's current bathtub state
    let bathtubState = await this.getUserBathtubState(userId);

    if (!bathtubState) {
      // Initialize bathtub if doesn't exist
      await this.initializeBathtub(userId);
      bathtubState = await this.getUserBathtubState(userId);
    }

    // Select best 3-stack for current state
    const stack = await retrieval.selectStackSequence(userId, currentState);

    // Validate we have all three categories
    if (!stack.achievement || !stack.connection || !stack.delight) {
      // Try to build partial stack
      const availableAnchors = [
        stack.achievement,
        stack.connection,
        stack.delight
      ].filter(a => a !== null);

      if (availableAnchors.length === 0) {
        return {
          success: false,
          reason: 'No happiness anchors available',
          suggestion: 'Let\'s create some happy memories first!'
        };
      }

      // Execute partial stack
      return await this.executePartialStack(userId, bathtubState, availableAnchors, stack);
    }

    // Execute full 3-stack
    const anchors = [stack.achievement, stack.connection, stack.delight];
    const result = this.calculator.executeStack(
      bathtubState.salt_amount,
      bathtubState.water_volume,
      anchors
    );

    // Update database
    await this.updateBathtubState(userId, result.after);

    // Track anchor usage for effectiveness learning
    await this.trackAnchorRecall(stack.achievement.id, result.improvement);
    await this.trackAnchorRecall(stack.connection.id, result.improvement);
    await this.trackAnchorRecall(stack.delight.id, result.improvement);

    // Log healing session
    await this.logHealingSession(userId, result, anchors);

    return {
      success: true,
      isFullStack: true,
      result: result,
      deliverySequence: this.createDeliverySequence(stack, result),
      lunaIntro: this.createLunaIntro(result.before.state, result.after.state),
      lunaOutro: this.createLunaOutro(result)
    };
  }

  /**
   * Execute partial stack when full 3-stack unavailable
   */
  async executePartialStack(userId, bathtubState, anchors, originalStack) {
    const result = this.calculator.executePartialStack(
      bathtubState.salt_amount,
      bathtubState.water_volume,
      anchors
    );

    if (!result) {
      return {
        success: false,
        reason: 'Unable to execute stack'
      };
    }

    // Update database
    await this.updateBathtubState(userId, result.after);

    // Track recalls
    for (const anchor of anchors) {
      if (anchor.id) {
        await this.trackAnchorRecall(anchor.id, result.after.concentration - result.before.concentration);
      }
    }

    const missingCategories = [];
    if (!originalStack.achievement) missingCategories.push('achievement');
    if (!originalStack.connection) missingCategories.push('connection');
    if (!originalStack.delight) missingCategories.push('delight');

    return {
      success: true,
      isFullStack: false,
      isPartialStack: true,
      result: result,
      anchorsUsed: anchors.length,
      missingCategories: missingCategories,
      deliverySequence: this.createPartialDeliverySequence(anchors, result),
      suggestion: `To unlock full healing power, create some ${missingCategories.join(' and ')} memories!`
    };
  }

  /**
   * Create delivery sequence with timing for Luna
   */
  createDeliverySequence(stack, result) {
    return {
      totalDuration: this.totalStackDuration,
      pauseDuration: this.stackPauseDuration,

      anchor1: {
        timing: 'immediate',
        delayMs: 0,
        anchor: stack.achievement,
        category: 'achievement',
        prompt: this.createRecallPrompt(stack.achievement, 1, 'achievement'),
        waterAdded: result.stackDetails[0].waterAdded,
        multiplier: result.stackDetails[0].multiplier
      },

      pause1: {
        duration: this.stackPauseDuration,
        durationMs: this.stackPauseDuration * 1000,
        reason: 'Allow synaptic consolidation',
        lunaFiller: 'Take a moment to really feel that memory... Let it sink in...'
      },

      anchor2: {
        timing: `after ${this.stackPauseDuration}s`,
        delayMs: this.stackPauseDuration * 1000,
        anchor: stack.connection,
        category: 'connection',
        prompt: this.createRecallPrompt(stack.connection, 2, 'connection'),
        waterAdded: result.stackDetails[1].waterAdded,
        multiplier: result.stackDetails[1].multiplier
      },

      pause2: {
        duration: this.stackPauseDuration,
        durationMs: this.stackPauseDuration * 1000,
        reason: 'Allow synaptic strengthening',
        lunaFiller: 'Beautiful... Now let that warmth build on the first memory...'
      },

      anchor3: {
        timing: `after ${this.stackPauseDuration * 2}s`,
        delayMs: this.stackPauseDuration * 2 * 1000,
        anchor: stack.delight,
        category: 'delight',
        prompt: this.createRecallPrompt(stack.delight, 3, 'delight'),
        waterAdded: result.stackDetails[2].waterAdded,
        multiplier: result.stackDetails[2].multiplier
      },

      summary: {
        totalWaterAdded: result.waterAdded,
        beforeState: result.before.state,
        afterState: result.after.state,
        improvement: result.improvement,
        stateImproved: result.stateImproved
      }
    };
  }

  /**
   * Create partial delivery sequence
   */
  createPartialDeliverySequence(anchors, result) {
    const sequence = {
      totalAnchors: anchors.length,
      isPartial: true
    };

    anchors.forEach((anchor, index) => {
      const position = index + 1;
      sequence[`anchor${position}`] = {
        timing: index === 0 ? 'immediate' : `after ${this.stackPauseDuration * index}s`,
        delayMs: this.stackPauseDuration * index * 1000,
        anchor: anchor,
        category: anchor.category,
        prompt: this.createRecallPrompt(anchor, position, anchor.category),
        waterAdded: result.stackDetails[index]?.waterAdded || 0
      };

      if (index < anchors.length - 1) {
        sequence[`pause${position}`] = {
          duration: this.stackPauseDuration,
          reason: 'Processing time'
        };
      }
    });

    return sequence;
  }

  /**
   * Create personalized recall prompt for anchor
   */
  createRecallPrompt(anchor, position, category) {
    const event = anchor.event || anchor.user_quote || 'that special moment';

    const prompts = {
      achievement: {
        1: [
          `Let's start with a moment of achievement: ${event}`,
          `Remember when you accomplished this? ${event}`,
          `Think back to this proud moment: ${event}`,
          `You did something wonderful: ${event}`
        ],
        2: [
          `Building on that... remember this achievement: ${event}`,
          `Here's another proud moment: ${event}`
        ],
        3: [
          `And this achievement: ${event}`
        ]
      },
      connection: {
        1: [
          `Let's recall a beautiful connection: ${event}`,
          `Remember this moment of love: ${event}`
        ],
        2: [
          `Now, let's add a warm connection: ${event}`,
          `Feel this beautiful moment with someone you care about: ${event}`,
          `Remember this meaningful connection: ${event}`,
          `Here's a moment of deep connection: ${event}`
        ],
        3: [
          `And this loving memory: ${event}`
        ]
      },
      delight: {
        1: [
          `Recall this delightful surprise: ${event}`
        ],
        2: [
          `Here's something that made you smile: ${event}`
        ],
        3: [
          `And finally, this moment of pure delight: ${event}`,
          `To complete our journey, remember this joyful surprise: ${event}`,
          `And the cherry on top: ${event}`,
          `Let's end with this wonderful moment: ${event}`
        ]
      }
    };

    const categoryPrompts = prompts[category] || prompts.achievement;
    const positionPrompts = categoryPrompts[position] || categoryPrompts[1];
    return positionPrompts[Math.floor(Math.random() * positionPrompts.length)];
  }

  /**
   * Create Luna's introduction to the healing session
   */
  createLunaIntro(beforeState, afterState) {
    const stateDesc = this.calculator.getStateDescription(beforeState);

    const intros = {
      'THRIVING': 'You\'re doing wonderfully, but let\'s add even more brightness to your day.',
      'HAPPY': 'You\'re in a good place. Let\'s build on that positive energy.',
      'CONTENT': 'I sense you\'re stable. Let me share some memories to lift you higher.',
      'SAD': 'I can feel you\'re carrying something. Let me help lighten your heart with some beautiful memories.',
      'VERY_SAD': 'Your heart is heavy right now. I\'m here, and I have something special for you.',
      'DEPRESSED': 'I see you\'re struggling. Remember, grief doesn\'t disappear, but we can make it feel smaller. Let me help.'
    };

    return intros[beforeState] || intros['CONTENT'];
  }

  /**
   * Create Luna's outro after healing session
   */
  createLunaOutro(result) {
    const improvement = result.improvement.toFixed(1);
    const newState = result.after.state;
    const stateDesc = this.calculator.getStateDescription(newState);

    if (result.stateImproved) {
      return `Beautiful. You've moved from ${result.before.state.toLowerCase()} to ${newState.toLowerCase()}. ` +
             `Your grief hasn't disappeared (it never does), but it's now a smaller part of your whole experience. ` +
             `That's ${improvement}% less weight on your heart. ${stateDesc.emoji}`;
    } else {
      return `You're still ${newState.toLowerCase()}, but I can feel the shift. ` +
             `We've added ${result.waterAdded} units of joy to balance out the weight. ` +
             `Every bit helps. We'll keep going together. ${stateDesc.emoji}`;
    }
  }

  /**
   * Get user's bathtub state from database
   */
  async getUserBathtubState(userId) {
    const db = require('../config/genesisDatabase');

    try {
      const result = await db.query(`
        SELECT * FROM user_emotional_bathtub
        WHERE user_id = $1
      `, [userId]);

      return result.rows[0] || null;
    } catch (error) {
      console.error('[StackExecutor] Error getting bathtub state:', error.message);
      return null;
    }
  }

  /**
   * Initialize bathtub for new user
   * Default: 20 salt, 80 water = 20% concentration = CONTENT
   */
  async initializeBathtub(userId) {
    const db = require('../config/genesisDatabase');

    const initialSalt = 20;
    const initialWater = 80;
    const initialConcentration = this.calculator.calculateConcentration(initialSalt, initialWater);
    const initialState = this.calculator.calculateState(initialConcentration);

    try {
      await db.query(`
        INSERT INTO user_emotional_bathtub (
          user_id, salt_amount, water_volume,
          concentration, state, history
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) DO NOTHING
      `, [
        userId,
        initialSalt,
        initialWater,
        initialConcentration,
        initialState,
        JSON.stringify([{
          timestamp: new Date().toISOString(),
          salt: initialSalt,
          water: initialWater,
          concentration: initialConcentration,
          state: initialState,
          event: 'Bathtub initialized'
        }])
      ]);

      console.log(`[StackExecutor] Initialized bathtub for user ${userId}`);
    } catch (error) {
      console.error('[StackExecutor] Error initializing bathtub:', error.message);
    }
  }

  /**
   * Update bathtub state after healing
   */
  async updateBathtubState(userId, newState) {
    const db = require('../config/genesisDatabase');

    try {
      await db.query(`
        UPDATE user_emotional_bathtub
        SET
          salt_amount = $2,
          water_volume = $3,
          concentration = $4,
          state = $5,
          last_healing = NOW(),
          history = history || $6::jsonb
        WHERE user_id = $1
      `, [
        userId,
        newState.salt,
        newState.water,
        newState.concentration,
        newState.state,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          salt: newState.salt,
          water: newState.water,
          concentration: newState.concentration,
          state: newState.state,
          event: '3-stack healing'
        })
      ]);
    } catch (error) {
      console.error('[StackExecutor] Error updating bathtub state:', error.message);
    }
  }

  /**
   * Track anchor recall for effectiveness learning (Week 6)
   */
  async trackAnchorRecall(anchorId, effectiveness) {
    if (!anchorId) return;

    try {
      const HappinessAnchorRetrieval = require('../memory/anchorRetrieval');
      const retrieval = new HappinessAnchorRetrieval();
      await retrieval.trackRecall(anchorId, effectiveness);
    } catch (error) {
      console.error('[StackExecutor] Error tracking recall:', error.message);
    }
  }

  /**
   * Log healing session for analytics
   */
  async logHealingSession(userId, result, anchors) {
    const db = require('../config/genesisDatabase');

    try {
      await db.query(`
        INSERT INTO healing_sessions (
          user_id, session_type, anchors_used,
          before_state, after_state, before_concentration, after_concentration,
          water_added, improvement, state_improved
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        userId,
        '3-stack',
        JSON.stringify(anchors.map(a => ({ id: a.id, category: a.category, event: a.event }))),
        result.before.state,
        result.after.state,
        result.before.concentration,
        result.after.concentration,
        result.waterAdded,
        result.improvement,
        result.stateImproved
      ]);
    } catch (error) {
      // Table might not exist yet - that's okay
      console.log('[StackExecutor] Healing session logging skipped (table may not exist)');
    }
  }

  /**
   * Add salt from negative event
   */
  async addSaltFromEvent(userId, sadnessIntensity, eventDescription = '') {
    let bathtubState = await this.getUserBathtubState(userId);

    if (!bathtubState) {
      await this.initializeBathtub(userId);
      bathtubState = await this.getUserBathtubState(userId);
    }

    const result = this.calculator.addSalt(bathtubState.salt_amount, sadnessIntensity);

    const newConcentration = this.calculator.calculateConcentration(
      result.after,
      bathtubState.water_volume
    );
    const newState = this.calculator.calculateState(newConcentration);

    await this.updateBathtubState(userId, {
      salt: result.after,
      water: bathtubState.water_volume,
      concentration: newConcentration,
      state: newState
    });

    return {
      saltAdded: result.saltAdded,
      newSalt: result.after,
      newConcentration: newConcentration,
      newState: newState,
      previousState: bathtubState.state,
      stateWorsened: this.calculator.stateProgression.indexOf(newState) <
                     this.calculator.stateProgression.indexOf(bathtubState.state)
    };
  }

  /**
   * Apply water evaporation (call periodically, e.g., daily)
   */
  async applyEvaporation(userId) {
    const bathtubState = await this.getUserBathtubState(userId);
    if (!bathtubState) return null;

    // Calculate days since last happiness
    const lastHappiness = bathtubState.last_healing || bathtubState.created_at;
    const daysSince = Math.floor(
      (Date.now() - new Date(lastHappiness).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince === 0) return null;

    const result = this.calculator.calculateEvaporation(
      bathtubState.water_volume,
      daysSince
    );

    if (result.waterLost === 0) return null;

    const newConcentration = this.calculator.calculateConcentration(
      bathtubState.salt_amount,
      result.after
    );
    const newState = this.calculator.calculateState(newConcentration);

    await this.updateBathtubState(userId, {
      salt: bathtubState.salt_amount,
      water: result.after,
      concentration: newConcentration,
      state: newState
    });

    return {
      waterLost: result.waterLost,
      newWater: result.after,
      newState: newState,
      daysSinceLastHappiness: daysSince
    };
  }
}

module.exports = StackExecutor;
