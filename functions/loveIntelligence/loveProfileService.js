/**
 * GENESIS Love Profile Service
 * Manages Love Language Profiles using existing infrastructure
 * =============================================================
 *
 * Uses:
 * - Firestore for profile data (existing profiles)
 * - PostgreSQL for conversation patterns (existing 4-Brain)
 * - pgClient for database access
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

const admin = require('firebase-admin');
const pgClient = require('../database/pgClient');
const loveLanguageMapper = require('./loveLanguageMapper');

// ============================================================================
// LOVE PROFILE OPERATIONS
// ============================================================================

/**
 * Get or infer love profile for a user/profile
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @returns {Promise<Object>} - Love profile
 */
async function getLoveProfile(userId, profileId) {
  console.log(`[LoveProfileService] Getting love profile for user ${userId}, profile ${profileId}`);

  const db = admin.firestore();

  // Step 1: Try to get existing love profile from Firestore
  const loveProfileDoc = await db
    .collection('users')
    .doc(userId)
    .collection('profiles')
    .doc(profileId)
    .collection('loveIntelligence')
    .doc('profile')
    .get();

  if (loveProfileDoc.exists) {
    const existing = loveProfileDoc.data();
    console.log(`[LoveProfileService] Found existing love profile`);
    return {
      userId,
      profileId,
      ...existing,
      source: 'stored'
    };
  }

  // Step 2: If not found, infer from existing profile data
  console.log(`[LoveProfileService] Inferring love profile from profile data`);
  return await inferLoveProfile(userId, profileId);
}

/**
 * Infer love profile from existing profile data
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @returns {Promise<Object>} - Inferred love profile
 */
async function inferLoveProfile(userId, profileId) {
  const db = admin.firestore();

  // Get the main profile (which has BaZi data already!)
  const profileDoc = await db
    .collection('users')
    .doc(userId)
    .collection('profiles')
    .doc(profileId)
    .get();

  if (!profileDoc.exists) {
    console.warn(`[LoveProfileService] Profile not found, using defaults`);
    return createDefaultProfile(userId, profileId);
  }

  const profile = profileDoc.data();

  // Constitution is ALREADY calculated in existing profiles!
  const constitution = profile.baZi?.dayMaster?.element || 'Water';

  // Get defaults from constitution
  const constitutionDefaults = loveLanguageMapper.getConstitutionDefaults(constitution);

  // Get conversation patterns from PostgreSQL (if available)
  const conversationPatterns = await getConversationPatterns(userId, profileId);

  // Infer Sternberg dimensions from conversation patterns
  let intimacy = 5; // neutral default
  let passion = 5;
  let commitment = 5;

  if (conversationPatterns.hasData) {
    // Scale 0-5 neurochemical average → 0-9 Sternberg scale
    intimacy = Math.round(conversationPatterns.avgOxytocin * 1.8);
    passion = Math.round(conversationPatterns.avgDopamine * 1.8);
    commitment = Math.round(conversationPatterns.avgVasopressin * 1.8);
  }

  // Build the love profile
  const loveProfile = {
    userId,
    profileId,
    constitution,
    givePrimary: constitutionDefaults.givePrimary,
    giveSecondary: loveLanguageMapper.getSecondaryLoveLanguage(constitutionDefaults.givePrimary),
    receivePrimary: constitutionDefaults.receivePrimary,
    receiveSecondary: loveLanguageMapper.getSecondaryLoveLanguage(constitutionDefaults.receivePrimary),
    intimacy,
    passion,
    commitment,
    defaultIntensity: constitutionDefaults.defaultIntensity,
    inferredFrom: ['bazi_constitution', 'conversation_patterns'],
    confidence: conversationPatterns.hasData ? 0.7 : 0.5,
    createdAt: new Date().toISOString(),
    source: 'inferred'
  };

  // Store the inferred profile for future use
  await storeLoveProfile(userId, profileId, loveProfile);

  console.log(`[LoveProfileService] Inferred and stored love profile for ${constitution} constitution`);

  return loveProfile;
}

/**
 * Store love profile to Firestore
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} loveProfile - Love profile data
 */
async function storeLoveProfile(userId, profileId, loveProfile) {
  const db = admin.firestore();

  await db
    .collection('users')
    .doc(userId)
    .collection('profiles')
    .doc(profileId)
    .collection('loveIntelligence')
    .doc('profile')
    .set({
      ...loveProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });

  console.log(`[LoveProfileService] Stored love profile`);
}

/**
 * Update love profile with new learning
 * Called after conversations to refine understanding
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} update - Fields to update
 * @returns {Promise<Object>} - Updated profile
 */
async function updateLoveProfile(userId, profileId, update) {
  const db = admin.firestore();

  const profileRef = db
    .collection('users')
    .doc(userId)
    .collection('profiles')
    .doc(profileId)
    .collection('loveIntelligence')
    .doc('profile');

  await profileRef.set({
    ...update,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  const updated = await profileRef.get();
  return updated.data();
}

/**
 * Learn from conversation - updates Sternberg dimensions based on detected neurochemicals
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {Object} detectedNeurochemicals - { oxytocin, dopamine, serotonin, vasopressin }
 * @param {number} happinessScore - Happiness from this exchange (0-5)
 */
async function learnFromConversation(userId, profileId, detectedNeurochemicals, happinessScore) {
  const currentProfile = await getLoveProfile(userId, profileId);

  // Only learn from high-happiness interactions
  if (happinessScore < 3) {
    console.log(`[LoveProfileService] Happiness ${happinessScore} too low for learning`);
    return currentProfile;
  }

  // Weighted update to Sternberg dimensions
  // New value = (old * 0.9) + (new * 0.1) - slow learning rate
  const learningRate = 0.1;

  const newIntimacy = Math.round(
    (currentProfile.intimacy * (1 - learningRate)) +
    (detectedNeurochemicals.oxytocin * 1.8 * learningRate)
  );

  const newPassion = Math.round(
    (currentProfile.passion * (1 - learningRate)) +
    (detectedNeurochemicals.dopamine * 1.8 * learningRate)
  );

  const newCommitment = Math.round(
    (currentProfile.commitment * (1 - learningRate)) +
    (detectedNeurochemicals.vasopressin * 1.8 * learningRate)
  );

  // Increase confidence slightly with each learning
  const newConfidence = Math.min(0.95, currentProfile.confidence + 0.01);

  await updateLoveProfile(userId, profileId, {
    intimacy: Math.max(0, Math.min(9, newIntimacy)),
    passion: Math.max(0, Math.min(9, newPassion)),
    commitment: Math.max(0, Math.min(9, newCommitment)),
    confidence: newConfidence,
    lastLearned: new Date().toISOString()
  });

  console.log(`[LoveProfileService] Updated Sternberg: I=${newIntimacy} P=${newPassion} C=${newCommitment}`);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get conversation patterns from PostgreSQL
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @returns {Promise<Object>} - Aggregated patterns
 */
async function getConversationPatterns(userId, profileId) {
  try {
    const pool = await pgClient.getPool();

    // Query short-term memory for recent neurochemical patterns
    const result = await pool.query(`
      SELECT
        AVG(neurochemicals->>'oxytocin')::numeric as avg_oxytocin,
        AVG(neurochemicals->>'dopamine')::numeric as avg_dopamine,
        AVG(neurochemicals->>'serotonin')::numeric as avg_serotonin,
        AVG(neurochemicals->>'vasopressin')::numeric as avg_vasopressin,
        COUNT(*) as conversation_count
      FROM short_term_memory
      WHERE user_id = $1 AND profile_id = $2
      AND created_at > NOW() - INTERVAL '30 days'
    `, [userId, profileId]);

    if (result.rows.length === 0 || result.rows[0].conversation_count === 0) {
      return {
        hasData: false,
        avgOxytocin: 2.5,
        avgDopamine: 2.5,
        avgSerotonin: 2.5,
        avgVasopressin: 2.5
      };
    }

    const row = result.rows[0];
    return {
      hasData: true,
      avgOxytocin: parseFloat(row.avg_oxytocin) || 2.5,
      avgDopamine: parseFloat(row.avg_dopamine) || 2.5,
      avgSerotonin: parseFloat(row.avg_serotonin) || 2.5,
      avgVasopressin: parseFloat(row.avg_vasopressin) || 2.5,
      conversationCount: parseInt(row.conversation_count)
    };
  } catch (error) {
    console.error('[LoveProfileService] Error getting conversation patterns:', error);
    return {
      hasData: false,
      avgOxytocin: 2.5,
      avgDopamine: 2.5,
      avgSerotonin: 2.5,
      avgVasopressin: 2.5
    };
  }
}

/**
 * Create default profile when no data available
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @returns {Object} - Default love profile
 */
function createDefaultProfile(userId, profileId) {
  return {
    userId,
    profileId,
    constitution: 'Water',
    givePrimary: 'Quality Time',
    giveSecondary: 'Physical Touch',
    receivePrimary: 'Physical Touch',
    receiveSecondary: 'Acts of Service',
    intimacy: 5,
    passion: 5,
    commitment: 5,
    defaultIntensity: 'gentle',
    inferredFrom: ['default'],
    confidence: 0.3,
    createdAt: new Date().toISOString(),
    source: 'default'
  };
}

/**
 * Calculate Sternberg alignment between two profiles
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @returns {number} - Alignment score (0-1)
 */
function calculateSternbergAlignment(profileA, profileB) {
  // Calculate distance in 3D space (normalized 0-1)
  const intimacyDist = Math.abs((profileA.intimacy || 5) - (profileB.intimacy || 5)) / 9;
  const passionDist = Math.abs((profileA.passion || 5) - (profileB.passion || 5)) / 9;
  const commitmentDist = Math.abs((profileA.commitment || 5) - (profileB.commitment || 5)) / 9;

  const avgDistance = (intimacyDist + passionDist + commitmentDist) / 3;

  // Convert distance to similarity (1 = perfect match, 0 = opposite)
  return 1 - avgDistance;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getLoveProfile,
  inferLoveProfile,
  storeLoveProfile,
  updateLoveProfile,
  learnFromConversation,
  getConversationPatterns,
  calculateSternbergAlignment,
  createDefaultProfile
};
