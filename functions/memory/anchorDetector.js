/**
 * ============================================================================
 * HAPPINESS ANCHOR DETECTOR
 * ============================================================================
 * Auto-detects significant joy moments worth storing for later recall.
 * Part of the bathtub healing algorithm.
 *
 * Detection criteria:
 * - Intensity >= 6
 * - Compound emotions present (love, optimism, delight)
 * - User explicitly sharing achievement/joy
 *
 * Week 4 Update: Constitutional Context Integration
 * - Full Five Elements tagging via ConstitutionalTagger
 * - Four Pillars detection
 * - Seasonal & organ clock context
 * - Healing recommendations for element balance
 *
 * Created: December 30, 2025
 * Week 2: Happiness Anchors
 * Week 4: Constitutional Tagging Integration
 * ============================================================================
 */

// Note: emotionDetector uses ES modules, so we need dynamic import
let PlutchikEmotionDetector = null;
const ConstitutionalTagger = require('./constitutionalTagger');

async function getEmotionDetector() {
  if (!PlutchikEmotionDetector) {
    const module = await import('../../src/services/emotionDetector.js');
    PlutchikEmotionDetector = module.default;
  }
  return new PlutchikEmotionDetector();
}

class HappinessAnchorDetector {
  constructor() {
    this.emotionDetector = null;
    this.constitutionalTagger = new ConstitutionalTagger();
  }

  async initialize() {
    if (!this.emotionDetector) {
      this.emotionDetector = await getEmotionDetector();
    }
  }

  /**
   * Should this moment be stored as a happiness anchor?
   * Criteria: intensity >= 6 OR compounds present OR user explicitly sharing
   */
  shouldStoreAsAnchor(emotionData, message) {
    // Check for joy-related primary emotion with high intensity
    const isJoyful = ['joy', 'anticipation', 'trust', 'surprise'].includes(emotionData.primary);
    const hasHighIntensity = emotionData.intensity >= 6;

    // Check for happiness-related compounds
    const happyCompounds = ['love', 'optimism', 'delight', 'hope', 'pride'];
    const hasCompounds = emotionData.compounds.some(c =>
      happyCompounds.includes(c.type)
    );

    // Check if user is explicitly sharing a happy moment
    const userExplicitlySharing = this.detectExplicitSharing(message);

    return (isJoyful && hasHighIntensity) || hasCompounds || userExplicitlySharing;
  }

  /**
   * Detect if user is explicitly sharing a happy moment
   */
  detectExplicitSharing(message) {
    const sharingKeywords = [
      'i just', 'i got', 'i achieved', 'i finished', 'i completed',
      'i won', 'i made it', 'i did it', 'succeeded', 'accomplished',
      'my first time', 'finally', 'at last', 'guess what',
      'amazing news', 'great news', 'best day', 'so proud'
    ];

    const lowerMessage = message.toLowerCase();
    return sharingKeywords.some(kw => lowerMessage.includes(kw));
  }

  /**
   * Calculate anchor significance (0-1 scale)
   * Higher = more important to recall later
   */
  calculateSignificance(emotionData, message, constitutionalContext = null) {
    let significance = 0;

    // Base intensity contribution (0-1)
    significance += (emotionData.intensity || 0) * 0.1;

    // Compound bonus
    if (emotionData.compounds && emotionData.compounds.length > 0) {
      significance += 0.2;

      // Special compounds worth more
      const specialCompounds = ['love', 'optimism', 'delight'];
      const hasSpecial = emotionData.compounds.some(c =>
        specialCompounds.includes(c.type)
      );
      if (hasSpecial) significance += 0.15;
    }

    // Authenticity score (voice-text congruence)
    if (emotionData.authenticity && emotionData.authenticity > 0.8) {
      significance += 0.15;
    }

    // Constitutional activation bonus
    if (constitutionalContext) {
      const fillsDeficiency = this.checkElementDeficiency(
        constitutionalContext.elementActivated,
        constitutionalContext.userConstitution
      );

      if (fillsDeficiency) {
        significance += 0.20;
      }
    }

    // Explicit sharing bonus
    if (this.detectExplicitSharing(message)) {
      significance += 0.1;
    }

    return Math.min(1.0, significance);
  }

  /**
   * Categorize anchor for stacking algorithm
   * achievement, connection, or delight
   */
  categorizeAnchor(emotionData, message) {
    const lowerMessage = message.toLowerCase();

    // Achievement keywords
    const achievementKeywords = [
      'achieved', 'accomplished', 'succeeded', 'finished', 'completed',
      'won', 'got promoted', 'earned', 'created', 'built', 'made',
      'passed', 'graduated', 'hired', 'accepted', 'approved'
    ];

    // Connection keywords
    const connectionKeywords = [
      'friend', 'love', 'family', 'together', 'connected', 'bonded',
      'shared', 'relationship', 'partner', 'daughter', 'son', 'wife',
      'husband', 'parent', 'mother', 'father', 'sibling', 'brother', 'sister'
    ];

    // Delight keywords
    const delightKeywords = [
      'surprised', 'unexpected', 'wow', 'amazing', 'first time',
      'never thought', 'suddenly', 'out of nowhere', 'incredible',
      'unbelievable', 'shocked', 'astonished'
    ];

    if (achievementKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'achievement';
    }

    if (connectionKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'connection';
    }

    if (delightKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'delight';
    }

    // Check compound emotions
    if (emotionData.compounds) {
      if (emotionData.compounds.some(c => c.type === 'love')) {
        return 'connection';
      }

      if (emotionData.compounds.some(c => c.type === 'optimism' || c.type === 'pride')) {
        return 'achievement';
      }

      if (emotionData.compounds.some(c => c.type === 'delight' || c.type === 'awe')) {
        return 'delight';
      }
    }

    return 'other';
  }

  /**
   * Check if this emotion fills a constitutional deficiency
   */
  checkElementDeficiency(elementActivated, userConstitution) {
    if (!userConstitution) return false;

    const elementPercentages = userConstitution.elements || {};

    // If element is below 15%, it's deficient
    return (elementPercentages[elementActivated] || 0) < 15;
  }

  /**
   * Store happiness anchor to database
   */
  async storeAnchor(userId, emotionData, message, constitutionalContext = null, embedding = null) {
    const db = require('../config/genesisDatabase');

    // Extract event from message
    const event = this.extractEvent(message);

    // Calculate significance
    const significance = this.calculateSignificance(
      emotionData,
      message,
      constitutionalContext
    );

    // Categorize
    const category = this.categorizeAnchor(emotionData, message);

    // Detect element and pillar
    const element = this.detectElement(emotionData);
    const pillar = this.detectPillar(message);

    // Calculate stacking metadata
    const waterContribution = this.calculateWaterContribution(category, significance);
    const stackingBonus = 1.0;

    // Format Plutchik vector
    const plutchikArray = [
      emotionData.plutchikVector?.joy || 0,
      emotionData.plutchikVector?.trust || 0,
      emotionData.plutchikVector?.fear || 0,
      emotionData.plutchikVector?.surprise || 0,
      emotionData.plutchikVector?.sadness || 0,
      emotionData.plutchikVector?.disgust || 0,
      emotionData.plutchikVector?.anger || 0,
      emotionData.plutchikVector?.anticipation || 0
    ];

    // Generate embedding if not provided (dummy for testing)
    const finalEmbedding = embedding || Array.from({ length: 768 }, () => Math.random() * 0.1);

    // Generate tags
    const tags = this.generateTags(emotionData, category, element);

    // Insert to database
    const result = await db.query(`
      INSERT INTO happiness_anchors (
        user_id, event, user_quote,
        primary_emotion, primary_intensity, compounds,
        plutchik_vector, category,
        element_activated, pillar_touched,
        water_contribution, stacking_bonus, effective_water,
        embedding, tags,
        user_value, intensity_score, authenticity_score
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::vector, $8, $9, $10,
        $11, $12, $13, $14::vector, $15, $16, $17, $18
      )
      RETURNING id
    `, [
      userId,
      event,
      message,
      emotionData.primary,
      emotionData.intensity,
      JSON.stringify(emotionData.compounds || []),
      `[${plutchikArray.join(',')}]`,
      category,
      element,
      pillar,
      waterContribution,
      stackingBonus,
      Math.round(waterContribution * stackingBonus),
      `[${finalEmbedding.join(',')}]`,
      tags,
      significance,
      (emotionData.intensity || 5) / 10,
      emotionData.authenticity || 0.8
    ]);

    console.log(`[HappinessAnchor] Stored anchor #${result.rows[0].id}: "${event}" (${category})`);

    return result.rows[0].id;
  }

  /**
   * Extract event description from message
   */
  extractEvent(message) {
    const firstSentence = message.split(/[.!?]/)[0];
    return firstSentence.slice(0, 100).trim();
  }

  /**
   * Detect element from emotion (Five Elements mapping)
   */
  detectElement(emotionData) {
    const emotionToElement = {
      'joy': 'Fire',
      'anger': 'Wood',
      'fear': 'Water',
      'sadness': 'Metal',
      'anticipation': 'Earth',
      'trust': 'Earth',
      'surprise': 'Fire',
      'disgust': 'Metal'
    };

    return emotionToElement[emotionData.primary] || null;
  }

  /**
   * Detect pillar from message content (Four Pillars)
   */
  detectPillar(message) {
    const lowerMessage = message.toLowerCase();

    // Year pillar: family, parents, ancestors
    if (/parent|father|mother|ancestor|family legacy|grandparent/.test(lowerMessage)) {
      return 'Year';
    }

    // Month pillar: career, work, profession
    if (/work|career|job|profession|boss|colleague|promoted|business/.test(lowerMessage)) {
      return 'Month';
    }

    // Day pillar: self, spouse, partner, relationship
    if (/spouse|partner|myself|self|identity|relationship|married|husband|wife/.test(lowerMessage)) {
      return 'Day';
    }

    // Hour pillar: children, creativity, social, friends
    if (/child|daughter|son|creative|friend|social|project|hobby/.test(lowerMessage)) {
      return 'Hour';
    }

    return null;
  }

  /**
   * Calculate water contribution based on category and significance
   * Used in bathtub healing algorithm
   */
  calculateWaterContribution(category, significance) {
    const baseWater = {
      'achievement': 10,
      'connection': 13,
      'delight': 16,
      'other': 8
    };

    const base = baseWater[category] || 10;

    // Multiply by significance (0.5-1.0 range)
    return Math.round(base * (0.5 + significance * 0.5));
  }

  /**
   * Generate searchable tags
   */
  generateTags(emotionData, category, element) {
    const tags = ['HAPPY_ANCHOR'];

    tags.push(category);

    if (element) {
      tags.push(`${element}_element`);
    }

    if ((emotionData.intensity || 0) >= 8) {
      tags.push('high_intensity');
    }

    if (emotionData.compounds) {
      emotionData.compounds.forEach(c => {
        tags.push(`compound_${c.type}`);
      });
    }

    return tags;
  }

  /**
   * Analyze message and return full anchor data
   * Convenience method that does detection + analysis in one call
   */
  async analyzeForAnchor(message, voiceProsody = null) {
    await this.initialize();

    const emotionData = this.emotionDetector.detectAllEmotions(message, voiceProsody);

    // Get full constitutional context from tagger
    const constitutionalContext = this.constitutionalTagger.tagMemory(
      emotionData,
      message,
      new Date()
    );

    return {
      emotionData,
      shouldStore: this.shouldStoreAsAnchor(emotionData, message),
      category: this.categorizeAnchor(emotionData, message),
      significance: this.calculateSignificance(emotionData, message, {
        elementActivated: constitutionalContext.element
      }),
      // Legacy fields for backwards compatibility
      element: constitutionalContext.element,
      pillar: constitutionalContext.pillar,
      // Full constitutional context (Week 4)
      constitutionalContext
    };
  }

  /**
   * Get full constitutional analysis for a user
   * Includes element balance, deficiencies, excesses, and healing recommendations
   */
  async getConstitutionalAnalysis(userId, currentEmotion = null) {
    // Get user's element balance from stored emotions
    const elementBalance = await this.constitutionalTagger.calculateElementBalance(userId);

    // Detect imbalances
    const deficiencies = this.constitutionalTagger.detectDeficiency(elementBalance);
    const excesses = this.constitutionalTagger.detectExcess(elementBalance);

    // Get healing recommendations
    const healingRecommendations = this.constitutionalTagger.getHealingRecommendation(
      elementBalance,
      currentEmotion
    );

    // Get current seasonal context
    const now = new Date();
    const season = this.constitutionalTagger.getSeason(now);
    const seasonalElement = this.constitutionalTagger.seasons[season];
    const timeOfDay = this.constitutionalTagger.getTimeOfDay(now);

    return {
      elementBalance,
      deficiencies,
      excesses,
      healingRecommendations,
      seasonalContext: {
        season,
        seasonalElement,
        timeOfDay,
        organActive: timeOfDay.period,
        currentElementEnergy: timeOfDay.element
      },
      isBalanced: deficiencies.length === 0 && excesses.length === 0
    };
  }

  /**
   * Get anchors that would help heal a specific element deficiency
   * Uses generating cycle: to strengthen Fire, recall Wood anchors
   */
  async getHealingAnchors(userId, deficientElement) {
    const db = require('../config/genesisDatabase');

    // Find which element generates the deficient element
    const generatingElement = this.constitutionalTagger.findGeneratingElement(deficientElement);

    // Query for anchors with that element
    const result = await db.query(`
      SELECT * FROM happiness_anchors
      WHERE user_id = $1
      AND element_activated = $2
      ORDER BY user_value DESC, created_at DESC
      LIMIT 5
    `, [userId, generatingElement]);

    return {
      deficientElement,
      healingElement: generatingElement,
      reason: `${generatingElement} generates ${deficientElement} (mother-child relationship)`,
      anchors: result.rows
    };
  }

  /**
   * Get anchors that would help control an element excess
   * Uses controlling cycle: to reduce excess Fire, recall Water anchors
   */
  async getControllingAnchors(userId, excessElement) {
    const db = require('../config/genesisDatabase');

    // Find which element controls the excess element
    const controllingElement = this.constitutionalTagger.findControllingElement(excessElement);

    // Query for anchors with that element
    const result = await db.query(`
      SELECT * FROM happiness_anchors
      WHERE user_id = $1
      AND element_activated = $2
      ORDER BY user_value DESC, created_at DESC
      LIMIT 5
    `, [userId, controllingElement]);

    return {
      excessElement,
      controllingElement,
      reason: `${controllingElement} controls ${excessElement} (grandmother-grandson relationship)`,
      anchors: result.rows
    };
  }

  /**
   * Select optimal anchors for healing based on constitutional state
   * Combines bathtub algorithm with Five Elements wisdom
   */
  async selectConstitutionalHealingAnchors(userId, currentEmotion = null) {
    const analysis = await this.getConstitutionalAnalysis(userId, currentEmotion);
    const healingAnchors = [];

    // Priority 1: Address excesses (more urgent)
    for (const excess of analysis.excesses) {
      const controlling = await this.getControllingAnchors(userId, excess);
      if (controlling.anchors.length > 0) {
        healingAnchors.push({
          priority: 1,
          type: 'control_excess',
          ...controlling
        });
      }
    }

    // Priority 2: Strengthen deficiencies
    for (const deficiency of analysis.deficiencies) {
      const healing = await this.getHealingAnchors(userId, deficiency);
      if (healing.anchors.length > 0) {
        healingAnchors.push({
          priority: 2,
          type: 'strengthen_deficiency',
          ...healing
        });
      }
    }

    return {
      analysis,
      healingAnchors,
      recommendation: this.formatHealingRecommendation(analysis, healingAnchors)
    };
  }

  /**
   * Format healing recommendation for Luna to speak
   */
  formatHealingRecommendation(analysis, healingAnchors) {
    const parts = [];

    if (analysis.excesses.length > 0) {
      const excessElement = analysis.excesses[0];
      const chars = this.constitutionalTagger.elementCharacteristics[excessElement];
      parts.push(`I notice you've been carrying a lot of ${chars.emotion} energy lately (${excessElement} element).`);
    }

    if (analysis.deficiencies.length > 0) {
      const defElement = analysis.deficiencies[0];
      const chars = this.constitutionalTagger.elementCharacteristics[defElement];
      parts.push(`Your ${defElement} element could use some nourishment - ${chars.healingFocus}.`);
    }

    if (healingAnchors.length > 0) {
      parts.push(`Let me help restore your balance with some memories...`);
    }

    return parts.join(' ');
  }
}

module.exports = HappinessAnchorDetector;
