/**
 * ============================================================================
 * CONSTITUTIONAL TAGGER
 * ============================================================================
 * Tags memories with Five Elements and Four Pillars wisdom from Chinese medicine.
 * Enables constitutional healing through element balance detection.
 *
 * Five Elements (Wu Xing):
 * - Fire (joy, summer, heart)
 * - Wood (anger, spring, liver)
 * - Water (fear, winter, kidney)
 * - Metal (sadness, autumn, lung)
 * - Earth (worry, late summer, spleen)
 *
 * Four Pillars (Ba Zi):
 * - Year: ancestors, parents, family legacy
 * - Month: career, work, profession
 * - Day: self, spouse, intimate relationships
 * - Hour: children, creativity, social life
 *
 * Created: December 30, 2025
 * Week 4: Constitutional Tagging - Phase 1 Complete
 * ============================================================================
 */

class ConstitutionalTagger {
  constructor() {
    // Generating cycle (Sheng): each element creates the next
    // Wood → Fire → Earth → Metal → Water → Wood
    this.generatingCycle = {
      'Wood': 'Fire',
      'Fire': 'Earth',
      'Earth': 'Metal',
      'Metal': 'Water',
      'Water': 'Wood'
    };

    // Controlling cycle (Ke): each element controls another
    // Wood → Earth, Earth → Water, Water → Fire, Fire → Metal, Metal → Wood
    this.controllingCycle = {
      'Wood': 'Earth',
      'Earth': 'Water',
      'Water': 'Fire',
      'Fire': 'Metal',
      'Metal': 'Wood'
    };

    // Seasonal qi associations
    this.seasons = {
      'Spring': 'Wood',
      'Summer': 'Fire',
      'Late_Summer': 'Earth',
      'Autumn': 'Metal',
      'Winter': 'Water'
    };

    // Emotion to element mapping (traditional Chinese medicine)
    this.emotionElementMap = {
      // Primary Plutchik emotions
      'joy': 'Fire',
      'anger': 'Wood',
      'fear': 'Water',
      'sadness': 'Metal',
      'trust': 'Earth',
      'surprise': 'Fire',
      'disgust': 'Metal',
      'anticipation': 'Wood',
      // Extended emotions
      'worry': 'Earth',
      'grief': 'Metal',
      'anxiety': 'Water',
      'frustration': 'Wood',
      'excitement': 'Fire'
    };

    // Element characteristics for healing
    this.elementCharacteristics = {
      'Fire': {
        emotion: 'joy',
        season: 'Summer',
        organ: 'Heart',
        color: 'Red',
        taste: 'Bitter',
        virtue: 'Propriety',
        healingFocus: 'Activate joy, connection, warmth'
      },
      'Wood': {
        emotion: 'anger',
        season: 'Spring',
        organ: 'Liver',
        color: 'Green',
        taste: 'Sour',
        virtue: 'Benevolence',
        healingFocus: 'Channel growth, vision, flexibility'
      },
      'Water': {
        emotion: 'fear',
        season: 'Winter',
        organ: 'Kidney',
        color: 'Black',
        taste: 'Salty',
        virtue: 'Wisdom',
        healingFocus: 'Cultivate stillness, depth, courage'
      },
      'Metal': {
        emotion: 'sadness',
        season: 'Autumn',
        organ: 'Lung',
        color: 'White',
        taste: 'Pungent',
        virtue: 'Righteousness',
        healingFocus: 'Release grief, find meaning, let go'
      },
      'Earth': {
        emotion: 'worry',
        season: 'Late_Summer',
        organ: 'Spleen',
        color: 'Yellow',
        taste: 'Sweet',
        virtue: 'Integrity',
        healingFocus: 'Ground, nourish, center'
      }
    };
  }

  /**
   * Main tagging function - returns complete constitutional context
   */
  tagMemory(emotionData, message, timestamp = new Date()) {
    const primaryEmotion = emotionData.primary || emotionData.primary?.emotion || 'neutral';
    const element = this.emotionToElement(primaryEmotion);
    const pillar = this.detectPillar(message);
    const season = this.getSeason(timestamp);
    const seasonalElement = this.seasons[season];
    const timeOfDay = this.getTimeOfDay(timestamp);

    return {
      // Core constitutional data
      element,
      pillar,
      season,
      seasonalElement,
      timeOfDay,
      timestamp,

      // Five Elements cycles
      generates: element ? this.generatingCycle[element] : null,
      controls: element ? this.controllingCycle[element] : null,
      generatedBy: element ? this.findGeneratingElement(element) : null,
      controlledBy: element ? this.findControllingElement(element) : null,

      // Element characteristics
      characteristics: element ? this.elementCharacteristics[element] : null,

      // Healing context
      healingContext: this.getHealingContext(element, seasonalElement, timeOfDay)
    };
  }

  /**
   * Map emotion to Five Elements
   */
  emotionToElement(emotion) {
    if (!emotion) return null;
    return this.emotionElementMap[emotion.toLowerCase()] || null;
  }

  /**
   * Detect which of Four Pillars is activated by message content
   */
  detectPillar(message) {
    const lowerMessage = message.toLowerCase();

    // Year pillar: ancestors, parents, family legacy
    const yearKeywords = [
      'parent', 'father', 'mother', 'dad', 'mom', 'ancestor',
      'grandfather', 'grandmother', 'grandpa', 'grandma',
      'family', 'heritage', 'legacy', 'tradition', 'upbringing',
      'childhood home', 'grew up', 'raised'
    ];

    // Month pillar: career, work, profession, society
    const monthKeywords = [
      'work', 'career', 'job', 'profession', 'boss', 'colleague',
      'coworker', 'client', 'business', 'office', 'company',
      'promoted', 'hired', 'fired', 'interview', 'salary',
      'project', 'deadline', 'meeting', 'presentation', 'manager'
    ];

    // Day pillar: self, spouse, partner, marriage, intimate relationships
    const dayKeywords = [
      'spouse', 'partner', 'husband', 'wife', 'marriage',
      'relationship', 'myself', 'me ', 'i am', 'self', 'identity',
      'who i am', 'my life', 'intimate', 'dating', 'engaged',
      'divorced', 'boyfriend', 'girlfriend', 'fiancé', 'fiance'
    ];

    // Hour pillar: children, creativity, social life, friends, hobbies
    const hourKeywords = [
      'child', 'daughter', 'son', 'kid', 'baby', 'children',
      'friend', 'friends', 'social', 'party', 'gathering',
      'hangout', 'creative', 'art', 'music', 'hobby', 'passion',
      'create', 'made', 'project', 'play', 'fun', 'weekend'
    ];

    // Check in priority order
    if (dayKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Day';
    }
    if (monthKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Month';
    }
    if (hourKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Hour';
    }
    if (yearKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Year';
    }

    return null;
  }

  /**
   * Get current season based on date
   */
  getSeason(date) {
    const month = date.getMonth() + 1; // 1-12

    if (month >= 2 && month <= 4) return 'Spring';        // Feb-Apr
    if (month >= 5 && month <= 7) return 'Summer';        // May-Jul
    if (month === 8) return 'Late_Summer';                // Aug
    if (month >= 9 && month <= 10) return 'Autumn';       // Sep-Oct
    return 'Winter';                                       // Nov-Jan
  }

  /**
   * Get time of day and associated element (Chinese organ clock)
   */
  getTimeOfDay(date) {
    const hour = date.getHours();

    // Chinese medicine organ clock (2-hour periods)
    const organClock = [
      { start: 23, end: 1, period: 'Gallbladder', element: 'Wood' },
      { start: 1, end: 3, period: 'Liver', element: 'Wood' },
      { start: 3, end: 5, period: 'Lung', element: 'Metal' },
      { start: 5, end: 7, period: 'Large_Intestine', element: 'Metal' },
      { start: 7, end: 9, period: 'Stomach', element: 'Earth' },
      { start: 9, end: 11, period: 'Spleen', element: 'Earth' },
      { start: 11, end: 13, period: 'Heart', element: 'Fire' },
      { start: 13, end: 15, period: 'Small_Intestine', element: 'Fire' },
      { start: 15, end: 17, period: 'Bladder', element: 'Water' },
      { start: 17, end: 19, period: 'Kidney', element: 'Water' },
      { start: 19, end: 21, period: 'Pericardium', element: 'Fire' },
      { start: 21, end: 23, period: 'Triple_Burner', element: 'Fire' }
    ];

    for (const slot of organClock) {
      if (slot.start > slot.end) {
        // Handle midnight crossing (23-1)
        if (hour >= slot.start || hour < slot.end) {
          return { period: slot.period, element: slot.element, hour };
        }
      } else if (hour >= slot.start && hour < slot.end) {
        return { period: slot.period, element: slot.element, hour };
      }
    }

    return { period: 'Unknown', element: null, hour };
  }

  /**
   * Find which element generates this one (mother element)
   */
  findGeneratingElement(element) {
    for (const [gen, produces] of Object.entries(this.generatingCycle)) {
      if (produces === element) return gen;
    }
    return null;
  }

  /**
   * Find which element controls this one
   */
  findControllingElement(element) {
    for (const [ctrl, controlled] of Object.entries(this.controllingCycle)) {
      if (controlled === element) return ctrl;
    }
    return null;
  }

  /**
   * Get healing context based on element, season, and time
   */
  getHealingContext(element, seasonalElement, timeOfDay) {
    const context = {
      elementAlign: element === seasonalElement,
      timeAlign: timeOfDay?.element === element,
      recommendations: []
    };

    if (element) {
      const chars = this.elementCharacteristics[element];
      context.recommendations.push(chars.healingFocus);

      // If seasonal element supports current element
      if (this.generatingCycle[seasonalElement] === element) {
        context.recommendations.push(`Season supports ${element} - good time for healing`);
      }
    }

    return context;
  }

  /**
   * Calculate user's constitutional element balance from stored emotions
   */
  async calculateElementBalance(userId) {
    const db = require('../config/genesisDatabase');

    try {
      const result = await db.query(`
        SELECT primary_emotion, primary_intensity, created_at
        FROM emotion_detections
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 100
      `, [userId]);

      if (result.rows.length === 0) {
        return this.getDefaultBalance();
      }

      // Count element occurrences weighted by intensity
      const elementCounts = { Fire: 0, Wood: 0, Water: 0, Metal: 0, Earth: 0 };
      let totalWeight = 0;

      result.rows.forEach(row => {
        const element = this.emotionToElement(row.primary_emotion);
        if (element) {
          const weight = row.primary_intensity || 5;
          elementCounts[element] += weight;
          totalWeight += weight;
        }
      });

      // Convert to percentages
      const balance = {};
      for (const [element, count] of Object.entries(elementCounts)) {
        balance[element] = totalWeight > 0
          ? Math.round((count / totalWeight) * 100)
          : 20;
      }

      return balance;
    } catch (error) {
      console.error('[ConstitutionalTagger] Error calculating balance:', error.message);
      return this.getDefaultBalance();
    }
  }

  /**
   * Get default element balance (all equal)
   */
  getDefaultBalance() {
    return { Fire: 20, Wood: 20, Water: 20, Metal: 20, Earth: 20 };
  }

  /**
   * Detect element deficiency (< 15%)
   */
  detectDeficiency(elementBalance) {
    return Object.entries(elementBalance)
      .filter(([_, pct]) => pct < 15)
      .map(([element]) => element);
  }

  /**
   * Detect element excess (> 30%)
   */
  detectExcess(elementBalance) {
    return Object.entries(elementBalance)
      .filter(([_, pct]) => pct > 30)
      .map(([element]) => element);
  }

  /**
   * Recommend healing element for deficiency
   * Use generating cycle: to strengthen X, activate element that generates X
   */
  recommendHealingElement(deficientElement) {
    const generator = this.findGeneratingElement(deficientElement);
    return {
      activate: generator,
      reason: `${generator} generates ${deficientElement} (mother-child relationship)`,
      method: this.elementCharacteristics[generator]?.healingFocus
    };
  }

  /**
   * Recommend controlling element for excess
   * Use controlling cycle: to reduce X, activate element that controls X
   */
  recommendControllingElement(excessElement) {
    const controller = this.findControllingElement(excessElement);
    return {
      activate: controller,
      reason: `${controller} controls ${excessElement} (grandmother-grandson relationship)`,
      method: this.elementCharacteristics[controller]?.healingFocus
    };
  }

  /**
   * Get complete healing recommendation for user's current state
   */
  getHealingRecommendation(elementBalance, currentEmotion) {
    const deficiencies = this.detectDeficiency(elementBalance);
    const excesses = this.detectExcess(elementBalance);
    const currentElement = this.emotionToElement(currentEmotion);

    const recommendations = [];

    // Priority 1: Address excesses (more urgent)
    excesses.forEach(exc => {
      const rec = this.recommendControllingElement(exc);
      recommendations.push({
        priority: 1,
        type: 'reduce_excess',
        element: exc,
        ...rec
      });
    });

    // Priority 2: Address deficiencies
    deficiencies.forEach(def => {
      const rec = this.recommendHealingElement(def);
      recommendations.push({
        priority: 2,
        type: 'strengthen_deficiency',
        element: def,
        ...rec
      });
    });

    // Priority 3: Current emotion support
    if (currentElement && !excesses.includes(currentElement)) {
      const controller = this.findControllingElement(currentElement);
      recommendations.push({
        priority: 3,
        type: 'balance_current',
        element: currentElement,
        activate: controller,
        reason: `Balance current ${currentElement} energy`
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }
}

module.exports = ConstitutionalTagger;
