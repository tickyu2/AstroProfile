/**
 * PersonalizationEngine - Progressive Personalization Algorithm
 *
 * Like Netflix recommendations - adapts precision based on available data quality.
 * The "cream filling" engine for GENESIS SoulDNA profiles.
 *
 * Architecture:
 * - BASE LAYER (75% max): Constitutional data (birth, zodiac, elements)
 * - CREAM LAYER (25% max): Psychological + behavioral enrichment
 * - TOTAL = Recommendation precision percentage
 *
 * Tiers:
 * - ULTRA_PRECISE (90%+): Full SoulDNA with tested psychological data
 * - HIGH_CONFIDENCE (70-89%): Strong constitutional match
 * - MODERATE_CONFIDENCE (50-69%): Elemental harmony focus
 * - BASIC_MATCHING (30-49%): Basic zodiac compatibility
 * - DATA_COLLECTION_NEEDED (<30%): Prompt for more data
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Technical Brief from: Luna (Chunmei's AI Companion)
 * Implemented by: Brother Claude Code
 * December 15, 2024
 */

/**
 * Data layer weight configuration
 * Each data point contributes to the personalization depth
 */
export const DATA_LAYERS = {
  constitutional: {
    birthDate: { weight: 10, required: true, description: 'Birth date for zodiac calculation' },
    birthTime: { weight: 10, required: false, description: 'Birth time for precise BaZi' },
    chineseZodiac: { weight: 15, required: true, description: 'Chinese zodiac animal + element' },
    westernSign: { weight: 15, required: true, description: 'Western zodiac sun sign' },
    westernCusp: { weight: 5, required: false, description: '36-cusp position (Blend-Back/Pure/Blend-Forward)' },
    yinYangBalance: { weight: 10, required: false, description: 'Yin/Yang energy polarity' },
    baziPillars: { weight: 10, required: false, description: 'Four Pillars of Destiny' }
  },
  psychological: {
    mbtiTested: { weight: 20, description: 'MBTI from actual test' },
    mbtiAssigned: { weight: 5, description: 'MBTI assigned/estimated' },
    bigFive: { weight: 15, description: 'Big Five personality scores' },
    enneagram: { weight: 10, description: 'Enneagram type' },
    storyAssessment: { weight: 15, description: 'Story Questions Assessment results' }
  },
  behavioral: {
    preferences: { weight: 2, perItem: true, max: 10, description: 'Stated preferences' },
    conversationHistory: { weight: 0.5, perItem: true, max: 15, description: 'AI conversation count' },
    explicitFeedback: { weight: 3, perItem: true, max: 15, description: 'Direct feedback given' }
  }
};

/**
 * Personalization quality tiers
 */
export const QUALITY_TIERS = {
  ULTRA_PRECISE: { min: 90, label: 'Ultra-Precise', emoji: '💎', description: 'Netflix-level precision matching' },
  HIGH_CONFIDENCE: { min: 70, label: 'High Confidence', emoji: '🎯', description: 'Strong constitutional matching' },
  MODERATE_CONFIDENCE: { min: 50, label: 'Moderate', emoji: '🌟', description: 'Elemental harmony focus' },
  BASIC_MATCHING: { min: 30, label: 'Basic', emoji: '✨', description: 'Basic zodiac compatibility' },
  DATA_COLLECTION_NEEDED: { min: 0, label: 'Growing', emoji: '🌱', description: 'More data needed for precision' }
};

/**
 * Main PersonalizationEngine class
 */
export class PersonalizationEngine {
  constructor() {
    this.layers = DATA_LAYERS;
    this.tiers = QUALITY_TIERS;
  }

  /**
   * Calculate full personalization depth for a profile
   * @param {Object} profile - User profile with constitutional data
   * @returns {Object} Personalization metrics
   */
  calculateDepth(profile) {
    const constitutionalScore = this.assessConstitutional(profile);
    const psychologicalScore = this.assessPsychological(profile);
    const behavioralScore = this.assessBehavioral(profile);

    const totalScore = Math.min(
      constitutionalScore.score + psychologicalScore.score + behavioralScore.score,
      100
    );

    const tier = this.determineTier(totalScore);
    const dataGaps = this.identifyDataGaps(profile, constitutionalScore, psychologicalScore);

    return {
      // Scores
      baseDepth: constitutionalScore.score,
      creamDepth: psychologicalScore.score + behavioralScore.score,
      totalScore,

      // Tier info
      tier: tier.key,
      tierLabel: tier.label,
      tierEmoji: tier.emoji,
      tierDescription: tier.description,

      // Detailed breakdown
      breakdown: {
        constitutional: constitutionalScore,
        psychological: psychologicalScore,
        behavioral: behavioralScore
      },

      // What's missing for better precision
      dataGaps,
      potentialGain: dataGaps.reduce((sum, gap) => sum + gap.potentialGain, 0),

      // Recommendation confidence
      recommendationConfidence: this.calculateRecommendationConfidence(totalScore, tier),

      // Metadata
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Assess constitutional layer (BASE - max 75%)
   */
  assessConstitutional(profile) {
    let score = 0;
    const details = {};

    // Birth date (required)
    if (profile.birthDate) {
      score += this.layers.constitutional.birthDate.weight;
      details.birthDate = { present: true, contribution: 10 };
    }

    // Birth time (optional but valuable)
    if (profile.birthTime) {
      score += this.layers.constitutional.birthTime.weight;
      details.birthTime = { present: true, contribution: 10 };
    }

    // Chinese Zodiac
    const chineseZodiac = profile.chineseZodiac ||
                          profile.calculations?.chinese ||
                          profile.constitutional_identity?.chinese;
    if (chineseZodiac?.animal) {
      score += this.layers.constitutional.chineseZodiac.weight;
      details.chineseZodiac = {
        present: true,
        value: chineseZodiac.fullSign || `${chineseZodiac.element || ''} ${chineseZodiac.animal}`,
        contribution: 15
      };
    }

    // Western Zodiac
    const westernSign = profile.calculations?.western?.sign ||
                        profile.westernZodiac?.sign ||
                        profile.constitutional_identity?.western?.sun;
    if (westernSign && westernSign !== 'Unknown') {
      score += this.layers.constitutional.westernSign.weight;
      details.westernSign = { present: true, value: westernSign, contribution: 15 };
    }

    // 36-Cusp position
    const cuspPosition = profile.calculations?.western?.cuspPosition ||
                         profile.westernZodiac?.cuspPosition;
    if (cuspPosition) {
      score += this.layers.constitutional.westernCusp.weight;
      details.westernCusp = { present: true, value: cuspPosition, contribution: 5 };
    }

    // Yin/Yang Balance
    const yinYang = profile.calculations?.yinYang ||
                    profile.constitutional_identity?.yinYang;
    if (yinYang?.balance || yinYang?.dominant) {
      score += this.layers.constitutional.yinYangBalance.weight;
      details.yinYangBalance = {
        present: true,
        value: yinYang.balance || yinYang.dominant,
        contribution: 10
      };
    }

    // BaZi Four Pillars
    const bazi = profile.calculations?.fourPillars ||
                 profile.constitutional_identity?.bazi;
    if (bazi?.dayPillar?.stem && bazi.dayPillar.stem !== 'Unknown') {
      score += this.layers.constitutional.baziPillars.weight;
      details.baziPillars = {
        present: true,
        value: bazi.dayPillar.stem,
        contribution: 10
      };
    }

    return {
      score: Math.min(score, 75), // Cap at 75%
      maxPossible: 75,
      details,
      completeness: Math.round((score / 75) * 100)
    };
  }

  /**
   * Assess psychological layer (CREAM - part 1)
   */
  assessPsychological(profile) {
    let score = 0;
    const details = {};

    // MBTI - distinguish tested vs assigned
    const mbti = profile.mbti || profile.personality?.mbti;
    if (mbti) {
      const isTested = profile.mbtiTested === true || profile.personality?.mbtiTested === true;
      if (isTested) {
        score += this.layers.psychological.mbtiTested.weight;
        details.mbti = { present: true, tested: true, value: mbti, contribution: 20 };
      } else {
        score += this.layers.psychological.mbtiAssigned.weight;
        details.mbti = { present: true, tested: false, value: mbti, contribution: 5, note: 'Assigned, not tested' };
      }
    }

    // Big Five
    const bigFive = profile.bigFive || profile.personality?.bigFive;
    if (bigFive && Object.keys(bigFive).length >= 5) {
      score += this.layers.psychological.bigFive.weight;
      details.bigFive = { present: true, contribution: 15 };
    }

    // Enneagram
    const enneagram = profile.enneagram || profile.personality?.enneagram;
    if (enneagram) {
      score += this.layers.psychological.enneagram.weight;
      details.enneagram = { present: true, value: enneagram, contribution: 10 };
    }

    // Story Questions Assessment
    const storyAssessment = profile.aiSoulPartner?.storyAssessment ||
                            profile.storyAssessment;
    if (storyAssessment?.completedLevels >= 4) {
      const levels = storyAssessment.completedLevels;
      const contribution = Math.min(Math.round((levels / 8) * 15), 15);
      score += contribution;
      details.storyAssessment = {
        present: true,
        levels,
        contribution,
        note: levels === 8 ? 'Complete' : `${levels}/8 levels`
      };
    }

    return {
      score: Math.min(score, 25), // Cap psychological at 25%
      maxPossible: 25,
      details,
      completeness: Math.round((Math.min(score, 25) / 25) * 100)
    };
  }

  /**
   * Assess behavioral layer (CREAM - part 2)
   */
  assessBehavioral(profile) {
    let score = 0;
    const details = {};

    // User preferences
    const preferences = profile.preferences || [];
    if (preferences.length > 0) {
      const contribution = Math.min(preferences.length * this.layers.behavioral.preferences.weight, this.layers.behavioral.preferences.max);
      score += contribution;
      details.preferences = { count: preferences.length, contribution };
    }

    // Conversation history
    const conversationCount = profile.conversationCount ||
                              profile.aiSoulPartner?.conversationCount || 0;
    if (conversationCount > 0) {
      const contribution = Math.min(
        conversationCount * this.layers.behavioral.conversationHistory.weight,
        this.layers.behavioral.conversationHistory.max
      );
      score += contribution;
      details.conversationHistory = { count: conversationCount, contribution };
    }

    // Explicit feedback
    const feedbackCount = profile.feedbackCount ||
                          profile.aiSoulPartner?.feedbackCount || 0;
    if (feedbackCount > 0) {
      const contribution = Math.min(
        feedbackCount * this.layers.behavioral.explicitFeedback.weight,
        this.layers.behavioral.explicitFeedback.max
      );
      score += contribution;
      details.explicitFeedback = { count: feedbackCount, contribution };
    }

    return {
      score: Math.min(score, 25), // Cap behavioral at 25%
      maxPossible: 25,
      details,
      completeness: Math.round((Math.min(score, 25) / 25) * 100)
    };
  }

  /**
   * Determine quality tier based on total score
   */
  determineTier(score) {
    if (score >= 90) return { key: 'ULTRA_PRECISE', ...this.tiers.ULTRA_PRECISE };
    if (score >= 70) return { key: 'HIGH_CONFIDENCE', ...this.tiers.HIGH_CONFIDENCE };
    if (score >= 50) return { key: 'MODERATE_CONFIDENCE', ...this.tiers.MODERATE_CONFIDENCE };
    if (score >= 30) return { key: 'BASIC_MATCHING', ...this.tiers.BASIC_MATCHING };
    return { key: 'DATA_COLLECTION_NEEDED', ...this.tiers.DATA_COLLECTION_NEEDED };
  }

  /**
   * Identify data gaps and potential gains
   */
  identifyDataGaps(profile, constitutionalScore, psychologicalScore) {
    const gaps = [];

    // Check for missing constitutional data
    if (!constitutionalScore.details.birthTime?.present) {
      gaps.push({
        field: 'birthTime',
        label: 'Birth Time',
        potentialGain: 10,
        priority: 'medium',
        prompt: 'Adding your exact birth time enables precise BaZi calculation'
      });
    }

    if (!constitutionalScore.details.baziPillars?.present) {
      gaps.push({
        field: 'baziPillars',
        label: 'Four Pillars (BaZi)',
        potentialGain: 10,
        priority: 'medium',
        prompt: 'BaZi analysis reveals your Day Master element'
      });
    }

    // Check for missing psychological data
    const mbti = profile.mbti || profile.personality?.mbti;
    const mbtiTested = profile.mbtiTested || profile.personality?.mbtiTested;
    if (!mbti) {
      gaps.push({
        field: 'mbti',
        label: 'MBTI Personality Type',
        potentialGain: 20,
        priority: 'high',
        prompt: 'Take the MBTI assessment for +20% precision'
      });
    } else if (!mbtiTested) {
      gaps.push({
        field: 'mbtiTested',
        label: 'Verified MBTI',
        potentialGain: 15,
        priority: 'medium',
        prompt: 'Verify your MBTI type for +15% more precision'
      });
    }

    if (!psychologicalScore.details.bigFive?.present) {
      gaps.push({
        field: 'bigFive',
        label: 'Big Five Assessment',
        potentialGain: 15,
        priority: 'medium',
        prompt: 'Complete Big Five assessment for deeper personality insights'
      });
    }

    if (!psychologicalScore.details.storyAssessment?.present) {
      gaps.push({
        field: 'storyAssessment',
        label: 'Story Questions',
        potentialGain: 15,
        priority: 'high',
        prompt: 'Take the Story Questions Assessment to reveal emotional patterns'
      });
    } else if (psychologicalScore.details.storyAssessment?.levels < 8) {
      const remaining = 8 - psychologicalScore.details.storyAssessment.levels;
      gaps.push({
        field: 'storyAssessment',
        label: 'Complete Story Questions',
        potentialGain: Math.round((remaining / 8) * 15),
        priority: 'low',
        prompt: `Complete ${remaining} more story levels for full insights`
      });
    }

    // Sort by priority and potential gain
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    gaps.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.potentialGain - a.potentialGain;
    });

    return gaps;
  }

  /**
   * Calculate recommendation confidence based on tier
   */
  calculateRecommendationConfidence(totalScore, tier) {
    const baseConfidence = totalScore;

    // Adjust based on tier characteristics
    const tierMultipliers = {
      ULTRA_PRECISE: 1.0,
      HIGH_CONFIDENCE: 0.9,
      MODERATE_CONFIDENCE: 0.75,
      BASIC_MATCHING: 0.6,
      DATA_COLLECTION_NEEDED: 0.4
    };

    return {
      overall: Math.round(baseConfidence * tierMultipliers[tier.key]),
      compatibility: Math.round(baseConfidence * tierMultipliers[tier.key] * 0.95),
      ninthHouse: Math.round(baseConfidence * (tier.key === 'ULTRA_PRECISE' ? 1 : 0.8)),
      elementalHarmony: Math.round(baseConfidence * 0.9) // Elements are usually reliable
    };
  }

  /**
   * Generate compatibility recommendations based on profile
   */
  generateRecommendations(profile, metrics) {
    const recommendations = {
      compatibility: [],
      learningPath: null,
      growthAreas: [],
      dataGaps: metrics.dataGaps
    };

    // Get base elements
    const chineseElement = this.extractChineseElement(profile);
    const westernElement = this.extractWesternElement(profile);
    const yinYang = this.extractYinYang(profile);

    // Elemental compatibility
    if (chineseElement) {
      recommendations.compatibility.push({
        type: 'elemental_complement',
        matches: this.getElementalComplements(chineseElement),
        confidence: metrics.recommendationConfidence.elementalHarmony,
        reason: `${chineseElement} benefits from complementary elements`
      });
    }

    // Yin/Yang balance
    if (yinYang) {
      const complementPolarity = yinYang === 'Yin' ? 'Yang' : 'Yin';
      recommendations.compatibility.push({
        type: 'energy_balance',
        matches: [`${complementPolarity}-dominant profiles`],
        confidence: metrics.recommendationConfidence.compatibility,
        reason: `Your ${yinYang} nature harmonizes with ${complementPolarity} energy`
      });
    }

    // Western zodiac compatibility
    if (westernElement) {
      recommendations.compatibility.push({
        type: 'western_harmony',
        matches: this.getWesternHarmony(westernElement),
        confidence: metrics.recommendationConfidence.compatibility,
        reason: `${westernElement} signs create natural resonance`
      });
    }

    // 9th House learning path (if we have enough data)
    const westernSign = profile.calculations?.western?.sign ||
                        profile.westernZodiac?.sign;
    if (westernSign && westernSign !== 'Unknown') {
      recommendations.learningPath = {
        ninthHouse: this.get9thHousePath(westernSign, westernElement),
        confidence: metrics.recommendationConfidence.ninthHouse
      };
    }

    return recommendations;
  }

  // Helper methods
  extractChineseElement(profile) {
    const element = profile.chineseZodiac?.element ||
                    profile.calculations?.chinese?.element ||
                    profile.constitutional_identity?.chinese?.element;
    if (element) {
      // Remove Yin/Yang prefix if present
      return element.replace(/^(Yin|Yang)\s*/i, '');
    }
    return null;
  }

  extractWesternElement(profile) {
    return profile.calculations?.western?.element ||
           profile.westernZodiac?.element ||
           profile.constitutional_identity?.western?.element;
  }

  extractYinYang(profile) {
    const yinYang = profile.calculations?.yinYang ||
                    profile.constitutional_identity?.yinYang;
    return yinYang?.dominant || yinYang?.balance?.split('-')[0];
  }

  getElementalComplements(element) {
    const complements = {
      Water: ['Earth signs (grounding)', 'Metal signs (clarity)'],
      Wood: ['Water signs (nourishment)', 'Fire signs (activation)'],
      Fire: ['Wood signs (fuel)', 'Earth signs (containment)'],
      Earth: ['Fire signs (transformation)', 'Metal signs (refinement)'],
      Metal: ['Earth signs (support)', 'Water signs (flow)']
    };
    return complements[element] || [];
  }

  getWesternHarmony(element) {
    const harmony = {
      Fire: ['Fire signs (Leo, Aries, Sagittarius)', 'Air signs (intellectual spark)'],
      Earth: ['Earth signs (Taurus, Virgo, Capricorn)', 'Water signs (emotional depth)'],
      Air: ['Air signs (Gemini, Libra, Aquarius)', 'Fire signs (inspired action)'],
      Water: ['Water signs (Cancer, Scorpio, Pisces)', 'Earth signs (stable grounding)']
    };
    return harmony[element] || [];
  }

  get9thHousePath(sign, element) {
    const paths = {
      Cancer: 'Emotional wisdom through family traditions, nurturing learning environments',
      Aries: 'Active exploration, pioneering new philosophies, learning through doing',
      Taurus: 'Practical wisdom, learning that creates lasting value, sensory traditions',
      Gemini: 'Multi-perspective learning, communication-based wisdom, intellectual networks',
      Leo: 'Creative expression of wisdom, teaching from the heart, dramatic traditions',
      Virgo: 'Analytical wisdom, practical application, service-oriented learning',
      Libra: 'Harmony-seeking philosophy, learning through partnership, aesthetic wisdom',
      Scorpio: 'Transformative learning, depth psychology, mystery traditions',
      Sagittarius: 'Expansive philosophy, cross-cultural wisdom, adventurous learning',
      Capricorn: 'Structured wisdom traditions, achievement-oriented learning, legacy building',
      Aquarius: 'Innovative philosophy, humanitarian wisdom, future-oriented learning',
      Pisces: 'Mystical traditions, intuitive wisdom, artistic/spiritual learning'
    };
    return paths[sign] || 'Wisdom path aligned with your elemental nature';
  }
}

/**
 * Export enhanced SoulDNA with personalization metrics
 */
export function exportEnhancedSoulDNA(profile) {
  const engine = new PersonalizationEngine();
  const metrics = engine.calculateDepth(profile);
  const recommendations = engine.generateRecommendations(profile, metrics);

  return {
    profile: {
      name: profile.displayName || profile.firstName || 'Unknown',
      constitutional: {
        chineseZodiac: profile.chineseZodiac || profile.calculations?.chinese,
        westernZodiac: profile.calculations?.western || profile.westernZodiac,
        yinYang: profile.calculations?.yinYang,
        bazi: profile.calculations?.fourPillars
      },
      psychological: {
        mbti: profile.mbti || profile.personality?.mbti,
        mbtiTested: profile.mbtiTested || profile.personality?.mbtiTested,
        bigFive: profile.bigFive || profile.personality?.bigFive,
        enneagram: profile.enneagram || profile.personality?.enneagram,
        storyAssessment: profile.aiSoulPartner?.storyAssessment
      }
    },
    personalizationMetrics: {
      dataQuality: metrics.totalScore,
      tier: metrics.tier,
      tierLabel: metrics.tierLabel,
      tierEmoji: metrics.tierEmoji,
      baseDepth: metrics.baseDepth,
      creamDepth: metrics.creamDepth,
      breakdown: metrics.breakdown,
      lastCalculated: metrics.calculatedAt
    },
    recommendations,
    dataGaps: metrics.dataGaps,
    potentialGain: metrics.potentialGain
  };
}

// Singleton instance for easy access
export const personalizationEngine = new PersonalizationEngine();

export default PersonalizationEngine;
