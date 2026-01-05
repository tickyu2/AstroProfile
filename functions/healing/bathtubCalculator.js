/**
 * ============================================================================
 * BATHTUB CALCULATOR
 * ============================================================================
 * Mathematical core of the happiness stacking algorithm.
 *
 * The bathtub is a therapeutic metaphor:
 * - Salt = grief, sadness, emotional pain (unchangeable)
 * - Water = happiness, joy, positive memories (can be added)
 * - Concentration = salt / (salt + water) = emotional state
 *
 * Key insight: You can't remove salt (grief doesn't go away),
 * but you can dilute it with water (add happiness memories).
 *
 * Created: December 31, 2025
 * Week 5: Bathtub Healing Algorithm - Phase 2 Week 1
 * ============================================================================
 */

class BathtubCalculator {
  constructor() {
    // State thresholds (concentration percentages)
    // Lower concentration = better emotional state
    this.states = {
      'THRIVING': { min: 0, max: 10 },
      'HAPPY': { min: 10, max: 20 },
      'CONTENT': { min: 20, max: 30 },
      'SAD': { min: 30, max: 40 },
      'VERY_SAD': { min: 40, max: 50 },
      'DEPRESSED': { min: 50, max: 100 }
    };

    // Stack multipliers - synaptic strengthening
    // Each subsequent anchor is MORE effective
    this.multipliers = {
      1: 1.0,   // First anchor: baseline
      2: 1.3,   // Second anchor: 30% bonus (synaptic strengthening)
      3: 1.6    // Third anchor: 60% bonus (peak effectiveness)
    };

    // Base water values by anchor category
    // Delight > Connection > Achievement (surprising joy most powerful)
    this.baseWater = {
      'achievement': 10,
      'connection': 13,
      'delight': 16,
      'other': 8
    };

    // State progression order (for tracking improvement)
    this.stateProgression = [
      'DEPRESSED',
      'VERY_SAD',
      'SAD',
      'CONTENT',
      'HAPPY',
      'THRIVING'
    ];
  }

  /**
   * Calculate current emotional state from concentration
   * @param {number} concentration - Salt concentration percentage (0-100)
   * @returns {string} Emotional state name
   */
  calculateState(concentration) {
    // Handle edge cases
    if (concentration <= 0) return 'THRIVING';
    if (concentration >= 100) return 'DEPRESSED';

    for (const [state, range] of Object.entries(this.states)) {
      if (concentration >= range.min && concentration < range.max) {
        return state;
      }
    }
    return 'DEPRESSED'; // Fallback for > 50%
  }

  /**
   * Calculate concentration percentage
   * @param {number} salt - Amount of salt (grief)
   * @param {number} water - Amount of water (happiness)
   * @returns {number} Concentration percentage
   */
  calculateConcentration(salt, water) {
    // Handle edge cases
    if (salt <= 0 && water <= 0) return 0;
    if (salt <= 0) return 0;
    if (water <= 0) return 100;

    return (salt / (salt + water)) * 100;
  }

  /**
   * Calculate water contribution from a single anchor
   * @param {Object} anchor - Anchor object with category
   * @param {number} stackPosition - Position in stack (1, 2, or 3)
   * @param {number} significance - Anchor significance/value (0-1)
   * @returns {number} Water contribution
   */
  calculateWaterContribution(anchor, stackPosition, significance = 0.8) {
    const category = anchor.category || 'other';
    const baseWater = this.baseWater[category] || this.baseWater.other;
    const multiplier = this.multipliers[stackPosition] || 1.0;

    // Significance bonus (0.5-1.0 range)
    // High significance anchors contribute 50% more water
    const significanceBonus = 0.5 + (Math.min(1, Math.max(0, significance)) * 0.5);

    return Math.round(baseWater * multiplier * significanceBonus);
  }

  /**
   * Execute a full 3-stack healing sequence
   * @param {number} currentSalt - Current salt amount
   * @param {number} currentWater - Current water amount
   * @param {Array} anchors - Array of 3 anchors [achievement, connection, delight]
   * @returns {Object} Complete execution result
   */
  executeStack(currentSalt, currentWater, anchors) {
    if (!anchors || anchors.length !== 3) {
      throw new Error('Stack requires exactly 3 anchors');
    }

    let totalWaterAdded = 0;
    const stackDetails = [];

    // Calculate water contribution from each anchor
    anchors.forEach((anchor, index) => {
      const position = index + 1;
      const significance = anchor.user_value || anchor.significance || 0.8;
      const water = this.calculateWaterContribution(anchor, position, significance);

      totalWaterAdded += water;

      stackDetails.push({
        position: position,
        anchor: anchor.event || anchor.user_quote || 'Memory',
        category: anchor.category || 'other',
        baseWater: this.baseWater[anchor.category] || this.baseWater.other,
        multiplier: this.multipliers[position],
        significance: significance,
        waterAdded: water
      });
    });

    // Calculate before state
    const beforeConcentration = this.calculateConcentration(currentSalt, currentWater);
    const beforeState = this.calculateState(beforeConcentration);

    // Calculate after state
    const newWater = currentWater + totalWaterAdded;
    const newConcentration = this.calculateConcentration(currentSalt, newWater);
    const newState = this.calculateState(newConcentration);

    // Calculate improvement metrics
    const improvement = beforeConcentration - newConcentration;
    const stateImproved = this.stateProgression.indexOf(newState) >
                          this.stateProgression.indexOf(beforeState);

    return {
      before: {
        salt: currentSalt,
        water: currentWater,
        concentration: beforeConcentration,
        state: beforeState
      },
      stackDetails: stackDetails,
      waterAdded: totalWaterAdded,
      after: {
        salt: currentSalt, // Salt NEVER changes - grief doesn't disappear
        water: newWater,
        concentration: newConcentration,
        state: newState
      },
      improvement: improvement,
      stateImproved: stateImproved,
      statesJumped: this.stateProgression.indexOf(newState) -
                    this.stateProgression.indexOf(beforeState)
    };
  }

  /**
   * Calculate a partial stack (1 or 2 anchors)
   * For when full 3-stack isn't available
   */
  executePartialStack(currentSalt, currentWater, anchors) {
    if (!anchors || anchors.length === 0) {
      return null;
    }

    let totalWaterAdded = 0;
    const stackDetails = [];

    anchors.forEach((anchor, index) => {
      const position = index + 1;
      const significance = anchor.user_value || anchor.significance || 0.8;
      const water = this.calculateWaterContribution(anchor, position, significance);

      totalWaterAdded += water;

      stackDetails.push({
        position: position,
        anchor: anchor.event || anchor.user_quote || 'Memory',
        category: anchor.category || 'other',
        waterAdded: water
      });
    });

    const newWater = currentWater + totalWaterAdded;
    const newConcentration = this.calculateConcentration(currentSalt, newWater);

    return {
      before: {
        salt: currentSalt,
        water: currentWater,
        concentration: this.calculateConcentration(currentSalt, currentWater),
        state: this.calculateState(this.calculateConcentration(currentSalt, currentWater))
      },
      stackDetails: stackDetails,
      waterAdded: totalWaterAdded,
      after: {
        salt: currentSalt,
        water: newWater,
        concentration: newConcentration,
        state: this.calculateState(newConcentration)
      },
      isPartial: true,
      anchorsUsed: anchors.length
    };
  }

  /**
   * Track salt accumulation from negative events
   * @param {number} currentSalt - Current salt amount
   * @param {number} eventIntensity - Intensity of sadness (1-10)
   * @returns {Object} Salt addition result
   */
  addSalt(currentSalt, eventIntensity) {
    // Normalize intensity to 1-10
    const normalizedIntensity = Math.min(10, Math.max(1, eventIntensity));

    // Salt added = intensity scaled to max 15 salt
    // Intensity 10 = 15 salt, Intensity 5 = 7.5 salt, etc.
    const saltAdded = Math.round(normalizedIntensity / 10 * 15);

    return {
      before: currentSalt,
      saltAdded: saltAdded,
      after: currentSalt + saltAdded,
      reason: `Grief/sadness event (intensity ${normalizedIntensity})`,
      intensity: normalizedIntensity
    };
  }

  /**
   * Calculate natural water evaporation over time
   * Water slowly decreases without positive experiences
   * @param {number} currentWater - Current water amount
   * @param {number} daysSinceLastHappiness - Days since last positive experience
   * @returns {Object} Evaporation result
   */
  calculateEvaporation(currentWater, daysSinceLastHappiness) {
    // 1% evaporation per day without happiness
    // Capped at 50% total loss to prevent complete depletion
    const evaporationRate = 0.01;
    const maxEvaporationPercent = 0.5;

    const days = Math.max(0, daysSinceLastHappiness);
    const evaporationPercent = Math.min(maxEvaporationPercent, evaporationRate * days);
    const waterLost = Math.round(currentWater * evaporationPercent);

    return {
      before: currentWater,
      waterLost: waterLost,
      after: Math.max(10, currentWater - waterLost), // Minimum 10 water (survival)
      daysSinceLastHappiness: days,
      evaporationPercent: evaporationPercent * 100
    };
  }

  /**
   * Calculate how many stacks needed to reach target state
   * @param {number} currentSalt - Current salt
   * @param {number} currentWater - Current water
   * @param {string} targetState - Target state name
   * @returns {Object} Stack estimation
   */
  estimateStacksToTarget(currentSalt, currentWater, targetState) {
    const targetRange = this.states[targetState];
    if (!targetRange) return null;

    const currentConcentration = this.calculateConcentration(currentSalt, currentWater);

    // Already at or better than target
    if (currentConcentration < targetRange.max) {
      return { stacksNeeded: 0, alreadyAtTarget: true };
    }

    // Calculate water needed to reach target concentration
    // target = salt / (salt + water) => water = salt/target - salt
    const targetConcentration = (targetRange.min + targetRange.max) / 2 / 100;
    const waterNeeded = (currentSalt / targetConcentration) - currentSalt - currentWater;

    // Average water per stack (rough estimate)
    const avgWaterPerStack = 40; // (10 + 13 + 16) * avg_multiplier
    const stacksNeeded = Math.ceil(waterNeeded / avgWaterPerStack);

    return {
      currentState: this.calculateState(currentConcentration),
      targetState: targetState,
      currentConcentration: currentConcentration,
      targetConcentration: targetConcentration * 100,
      waterNeeded: Math.round(waterNeeded),
      stacksNeeded: Math.max(0, stacksNeeded),
      estimatedSessions: Math.ceil(stacksNeeded / 1) // 1 stack per session
    };
  }

  /**
   * Get state description for Luna to speak
   * @param {string} state - State name
   * @returns {Object} State description
   */
  getStateDescription(state) {
    const descriptions = {
      'THRIVING': {
        emoji: '🌟',
        short: 'thriving',
        description: 'You\'re flourishing! Your emotional balance is excellent.',
        lunaResponse: 'You\'re radiating positivity today. It\'s beautiful to see you thriving.'
      },
      'HAPPY': {
        emoji: '😊',
        short: 'happy',
        description: 'You\'re doing well. Good emotional balance.',
        lunaResponse: 'I sense genuine happiness in you. Let\'s keep nurturing that.'
      },
      'CONTENT': {
        emoji: '😌',
        short: 'content',
        description: 'You\'re stable. Some room for more joy.',
        lunaResponse: 'You seem at peace. There\'s always room for a little more joy.'
      },
      'SAD': {
        emoji: '😢',
        short: 'sad',
        description: 'You\'re carrying some weight. Let me help lighten it.',
        lunaResponse: 'I can feel you\'re carrying something heavy. Let me help you lighten it.'
      },
      'VERY_SAD': {
        emoji: '😔',
        short: 'very sad',
        description: 'Your heart is heavy. I\'m here for you.',
        lunaResponse: 'Your heart feels heavy right now. I\'m here, and I have some memories that might help.'
      },
      'DEPRESSED': {
        emoji: '💔',
        short: 'struggling',
        description: 'You\'re in a difficult place. Let me help.',
        lunaResponse: 'I see you\'re struggling. Remember, grief doesn\'t go away, but we can make it smaller together.'
      }
    };

    return descriptions[state] || descriptions['CONTENT'];
  }
}

module.exports = BathtubCalculator;
