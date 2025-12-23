/**
 * GENESIS Compatibility Analyzer
 * Analyzes love compatibility between two profiles
 * ==================================================
 *
 * Integrates with:
 * - Existing compatibilityCalculations.js (frontend)
 * - loveLanguageMapper (love language logic)
 * - loveProfileService (profile data)
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

const loveLanguageMapper = require('./loveLanguageMapper');
const loveProfileService = require('./loveProfileService');

// ============================================================================
// COMPATIBILITY ANALYSIS
// ============================================================================

/**
 * Analyze complete compatibility between two profiles
 *
 * @param {string} userIdA - First user ID
 * @param {string} profileIdA - First profile ID
 * @param {string} userIdB - Second user ID (can be same as A)
 * @param {string} profileIdB - Second profile ID
 * @returns {Promise<Object>} - Complete compatibility analysis
 */
async function analyzeCompatibility(userIdA, profileIdA, userIdB, profileIdB) {
  console.log(`[CompatibilityAnalyzer] Analyzing ${userIdA}/${profileIdA} + ${userIdB}/${profileIdB}`);

  // ─────────────────────────────────────────────────────
  // STEP 1: GET BOTH LOVE PROFILES
  // ─────────────────────────────────────────────────────

  const [profileA, profileB] = await Promise.all([
    loveProfileService.getLoveProfile(userIdA, profileIdA),
    loveProfileService.getLoveProfile(userIdB, profileIdB)
  ]);

  // ─────────────────────────────────────────────────────
  // STEP 2: CALCULATE GIVE/RECEIVE MATCH SCORES
  // ─────────────────────────────────────────────────────

  // How well does A's give match B's receive?
  const aGivesToB = loveLanguageMapper.calculateLoveLanguageMatch(
    profileA.givePrimary,
    profileB.receivePrimary
  );

  // How well does B's give match A's receive?
  const bGivesToA = loveLanguageMapper.calculateLoveLanguageMatch(
    profileB.givePrimary,
    profileA.receivePrimary
  );

  // ─────────────────────────────────────────────────────
  // STEP 3: CALCULATE STERNBERG ALIGNMENT
  // ─────────────────────────────────────────────────────

  const sternbergAlignment = loveProfileService.calculateSternbergAlignment(
    profileA,
    profileB
  );

  // ─────────────────────────────────────────────────────
  // STEP 4: CALCULATE OVERALL COMPATIBILITY
  // ─────────────────────────────────────────────────────

  const overallScore = (
    aGivesToB * 0.35 +
    bGivesToA * 0.35 +
    sternbergAlignment * 0.30
  );

  // ─────────────────────────────────────────────────────
  // STEP 5: IDENTIFY GAPS AND GENERATE BRIDGES
  // ─────────────────────────────────────────────────────

  const gaps = [];

  // Gap 1: A gives → B receives
  if (aGivesToB < 0.7) {
    gaps.push({
      type: 'give_receive',
      severity: (1 - aGivesToB),
      from: 'A',
      to: 'B',
      description: `${profileA.givePrimary} → ${profileB.receivePrimary}`,
      bridgeAdvice: loveLanguageMapper.generateBridgeAdvice(
        profileA.givePrimary,
        profileB.receivePrimary
      ),
      neurochemicalTranslation: loveLanguageMapper.translateToNeurochemical({
        loveLanguage: profileB.receivePrimary,
        profile: profileB,
        conversationStage: 'developing'
      })
    });
  }

  // Gap 2: B gives → A receives
  if (bGivesToA < 0.7) {
    gaps.push({
      type: 'give_receive',
      severity: (1 - bGivesToA),
      from: 'B',
      to: 'A',
      description: `${profileB.givePrimary} → ${profileA.receivePrimary}`,
      bridgeAdvice: loveLanguageMapper.generateBridgeAdvice(
        profileB.givePrimary,
        profileA.receivePrimary
      ),
      neurochemicalTranslation: loveLanguageMapper.translateToNeurochemical({
        loveLanguage: profileA.receivePrimary,
        profile: profileA,
        conversationStage: 'developing'
      })
    });
  }

  // Gap 3: Intimacy mismatch
  const intimacyGap = Math.abs(profileA.intimacy - profileB.intimacy);
  if (intimacyGap > 3) {
    gaps.push({
      type: 'sternberg_intimacy',
      severity: intimacyGap / 9,
      dimension: 'intimacy',
      scoreA: profileA.intimacy,
      scoreB: profileB.intimacy,
      description: `Intimacy levels differ: ${profileA.intimacy} vs ${profileB.intimacy}`,
      bridgeAdvice: profileA.intimacy > profileB.intimacy
        ? "Person A: Give partner space to open up gradually. Person B: Share more when comfortable."
        : "Person B: Give partner space to open up gradually. Person A: Share more when comfortable."
    });
  }

  // Gap 4: Passion mismatch
  const passionGap = Math.abs(profileA.passion - profileB.passion);
  if (passionGap > 3) {
    gaps.push({
      type: 'sternberg_passion',
      severity: passionGap / 9,
      dimension: 'passion',
      scoreA: profileA.passion,
      scoreB: profileB.passion,
      description: `Passion levels differ: ${profileA.passion} vs ${profileB.passion}`,
      bridgeAdvice: profileA.passion > profileB.passion
        ? "Person A: Balance enthusiasm with patience. Person B: Open to adventure when ready."
        : "Person B: Balance enthusiasm with patience. Person A: Open to adventure when ready."
    });
  }

  // Gap 5: Commitment mismatch
  const commitmentGap = Math.abs(profileA.commitment - profileB.commitment);
  if (commitmentGap > 3) {
    gaps.push({
      type: 'sternberg_commitment',
      severity: commitmentGap / 9,
      dimension: 'commitment',
      scoreA: profileA.commitment,
      scoreB: profileB.commitment,
      description: `Commitment levels differ: ${profileA.commitment} vs ${profileB.commitment}`,
      bridgeAdvice: profileA.commitment > profileB.commitment
        ? "Person A: Allow relationship to develop naturally. Person B: Communicate needs and pace."
        : "Person B: Allow relationship to develop naturally. Person A: Communicate needs and pace."
    });
  }

  // ─────────────────────────────────────────────────────
  // STEP 6: GENERATE RELATIONSHIP INSIGHTS
  // ─────────────────────────────────────────────────────

  const insights = generateCompatibilityInsights(
    profileA,
    profileB,
    overallScore,
    gaps
  );

  // ─────────────────────────────────────────────────────
  // STEP 7: RETURN COMPLETE ANALYSIS
  // ─────────────────────────────────────────────────────

  return {
    compatibility: {
      overall: overallScore,
      aGivesToB,
      bGivesToA,
      sternbergAlignment,
      rating: getCompatibilityRating(overallScore)
    },
    profiles: {
      profileA: {
        constitution: profileA.constitution,
        gives: profileA.givePrimary,
        receives: profileA.receivePrimary,
        sternberg: {
          intimacy: profileA.intimacy,
          passion: profileA.passion,
          commitment: profileA.commitment
        }
      },
      profileB: {
        constitution: profileB.constitution,
        gives: profileB.givePrimary,
        receives: profileB.receivePrimary,
        sternberg: {
          intimacy: profileB.intimacy,
          passion: profileB.passion,
          commitment: profileB.commitment
        }
      }
    },
    gaps,
    insights,
    recommendedActions: generateRecommendedActions(gaps),
    createdAt: new Date().toISOString()
  };
}

/**
 * Get optimization strategy for a specific conversation context
 * This is the MAIN BRIDGE: Love Intelligence → Neurochemical Engine
 *
 * @param {string} userId - User ID
 * @param {string} profileId - User's profile ID
 * @param {string} partnerProfileId - Partner's profile ID (optional, defaults to self)
 * @param {Object} context - Conversation context
 * @returns {Promise<Object>} - Complete optimization strategy
 */
async function getOptimizationStrategy(userId, profileId, partnerProfileId, context = {}) {
  console.log(`[CompatibilityAnalyzer] Getting optimization strategy`);

  // If no partner specified, optimize for self
  const targetProfileId = partnerProfileId || profileId;

  // ─────────────────────────────────────────────────────
  // STEP 1: GET PROFILES
  // ─────────────────────────────────────────────────────

  const [userProfile, partnerProfile] = await Promise.all([
    loveProfileService.getLoveProfile(userId, profileId),
    loveProfileService.getLoveProfile(userId, targetProfileId)
  ]);

  // ─────────────────────────────────────────────────────
  // STEP 2: ANALYZE COMPATIBILITY (if different people)
  // ─────────────────────────────────────────────────────

  let compatibility = null;
  if (profileId !== targetProfileId) {
    compatibility = await analyzeCompatibility(
      userId,
      profileId,
      userId,
      targetProfileId
    );
  }

  // ─────────────────────────────────────────────────────
  // STEP 3: TRANSLATE PARTNER'S NEEDS TO NEUROCHEMICAL STRATEGY
  // ─────────────────────────────────────────────────────

  const conversationStage = context.conversationStage || 'developing';

  const neurochemicalStrategy = loveLanguageMapper.translateToNeurochemical({
    loveLanguage: partnerProfile.receivePrimary,
    profile: partnerProfile,
    conversationStage
  });

  // ─────────────────────────────────────────────────────
  // STEP 4: BUILD COMPLETE STRATEGY
  // ─────────────────────────────────────────────────────

  return {
    // Strategic layer (Love Intelligence)
    strategy: {
      userGives: userProfile.givePrimary,
      partnerNeeds: partnerProfile.receivePrimary,
      gap: compatibility?.gaps[0] || null,
      bridgeAdvice: compatibility?.gaps[0]?.bridgeAdvice || null
    },

    // Tactical layer (Neurochemical)
    tactics: {
      recommendedPattern: neurochemicalStrategy.recommendedPattern,
      primaryNeurochemical: neurochemicalStrategy.primaryNeurochemical,
      secondaryNeurochemical: neurochemicalStrategy.secondaryNeurochemical,
      effectiveBehaviors: neurochemicalStrategy.effectiveBehaviors,
      examplePhrases: neurochemicalStrategy.examplePhrases
    },

    // Compatibility context (if available)
    compatibility: compatibility ? {
      overall: compatibility.compatibility.overall,
      userToPartner: compatibility.compatibility.aGivesToB,
      partnerToUser: compatibility.compatibility.bGivesToA
    } : null,

    // Metadata
    confidence: Math.min(userProfile.confidence, partnerProfile.confidence),
    conversationStage,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate human-readable compatibility insights
 */
function generateCompatibilityInsights(profileA, profileB, overallScore, gaps) {
  const insights = [];

  // Overall compatibility insight
  if (overallScore >= 0.85) {
    insights.push({
      type: 'strength',
      message: 'Exceptional natural compatibility - you speak similar love languages'
    });
  } else if (overallScore >= 0.70) {
    insights.push({
      type: 'strength',
      message: 'Strong compatibility with minor adjustments needed'
    });
  } else if (overallScore >= 0.55) {
    insights.push({
      type: 'challenge',
      message: 'Moderate compatibility - conscious bridging will strengthen connection'
    });
  } else {
    insights.push({
      type: 'challenge',
      message: 'Different love styles - understanding and adaptation crucial'
    });
  }

  // Constitution pairing insight
  const constitutionPair = `${profileA.constitution}-${profileB.constitution}`;
  const pairingInsights = {
    'Fire-Fire': 'Both passionate and expressive - watch for competition',
    'Fire-Water': 'Fire warms Water, Water cools Fire - complementary balance',
    'Fire-Wood': 'Fire energizes Wood growth - supportive dynamic',
    'Fire-Metal': 'Fire melts Metal - requires conscious care',
    'Fire-Earth': 'Fire strengthens Earth - stable partnership',
    'Water-Water': 'Deep emotional understanding - ensure external stimulation',
    'Water-Wood': 'Water nourishes Wood - natural harmony',
    'Water-Metal': 'Water cleanses Metal - mutually beneficial',
    'Water-Earth': 'Earth contains Water - grounding partnership',
    'Wood-Wood': 'Mutual growth orientation - support each other\'s development',
    'Wood-Metal': 'Metal prunes Wood - creative tension',
    'Wood-Earth': 'Earth grounds Wood - balanced stability',
    'Metal-Metal': 'High standards together - appreciate precision',
    'Metal-Earth': 'Earth yields Metal - nurturing dynamic',
    'Earth-Earth': 'Stable and reliable - ensure adventure'
  };

  const pairingInsight = pairingInsights[constitutionPair] || 
    pairingInsights[`${profileB.constitution}-${profileA.constitution}`];

  if (pairingInsight) {
    insights.push({
      type: 'constitutional',
      message: pairingInsight
    });
  }

  // Gap-specific insights
  if (gaps.length === 0) {
    insights.push({
      type: 'strength',
      message: 'No significant gaps detected - natural flow likely'
    });
  } else {
    const topGap = gaps[0];
    insights.push({
      type: 'guidance',
      message: `Primary focus: ${topGap.description}`,
      action: topGap.bridgeAdvice
    });
  }

  return insights;
}

/**
 * Get compatibility rating
 */
function getCompatibilityRating(score) {
  if (score >= 0.90) return 'Exceptional';
  if (score >= 0.80) return 'Excellent';
  if (score >= 0.70) return 'Very Good';
  if (score >= 0.60) return 'Good';
  if (score >= 0.50) return 'Moderate';
  if (score >= 0.40) return 'Challenging';
  return 'Very Challenging';
}

/**
 * Generate recommended actions based on gaps
 */
function generateRecommendedActions(gaps) {
  if (gaps.length === 0) {
    return [
      {
        priority: 'low',
        action: 'Continue current approach',
        reasoning: 'Natural compatibility - maintain what works'
      }
    ];
  }

  return gaps
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map((gap, index) => ({
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
      gap: gap.description,
      action: gap.bridgeAdvice,
      severity: gap.severity.toFixed(2),
      neurochemicalGuidance: gap.neurochemicalTranslation ? 
        `Use ${gap.neurochemicalTranslation.primaryNeurochemical}-focused pattern ${gap.neurochemicalTranslation.recommendedPattern}` :
        null
    }));
}

/**
 * Quick compatibility check (simplified version)
 */
async function quickCompatibilityCheck(userIdA, profileIdA, userIdB, profileIdB) {
  const [profileA, profileB] = await Promise.all([
    loveProfileService.getLoveProfile(userIdA, profileIdA),
    loveProfileService.getLoveProfile(userIdB, profileIdB)
  ]);

  const aGivesToB = loveLanguageMapper.calculateLoveLanguageMatch(
    profileA.givePrimary,
    profileB.receivePrimary
  );

  const bGivesToA = loveLanguageMapper.calculateLoveLanguageMatch(
    profileB.givePrimary,
    profileA.receivePrimary
  );

  const overallScore = (aGivesToB + bGivesToA) / 2;

  return {
    score: overallScore,
    rating: getCompatibilityRating(overallScore),
    match: {
      aToB: aGivesToB,
      bToA: bGivesToA
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  analyzeCompatibility,
  getOptimizationStrategy,
  quickCompatibilityCheck,
  generateCompatibilityInsights,
  getCompatibilityRating
};
