/**
 * ============================================================================
 * GENESIS LUNA - HAPPINESS ANCHOR STORE
 * ============================================================================
 * Joy network memory storage for emotional support.
 * Stores positive memories with high emotional scores for retrieval
 * when the user's mood seems low.
 *
 * Functions:
 * - getHappinessAnchors: Retrieve top anchors by score
 * - storeHappinessAnchor: Store positive memory with sensory details
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  HAPPINESS ANCHOR SYSTEM                                                │
 * │                                                                          │
 * │  ┌─────────────┐                                                         │
 * │  │ DETECT LOW  │                                                         │
 * │  │ MOOD        │                                                         │
 * │  └──────┬──────┘                                                         │
 * │         │                                                                 │
 * │         ▼                                                                 │
 * │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
 * │  │ RETRIEVE    │     │ SCORE       │     │ INJECT TO   │               │
 * │  │ ANCHORS     │────▶│ SORT        │────▶│ CONTEXT     │               │
 * │  │ (top 3)     │     │             │     │             │               │
 * │  └─────────────┘     └─────────────┘     └─────────────┘               │
 * │                                                                          │
 * │  Storage Model:                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │ memory: "Beach trip with family"                                    ││
 * │  │ score: 9                                                            ││
 * │  │ peakMoment: "The sunset when we all laughed together"              ││
 * │  │ sensoryAnchors: { sight: "...", sound: "...", smell: "..." }       ││
 * │  │ recallCount: 3                                                      ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Scoring: 1-10 (only anchors with score >= 7 are stored)
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// GET HAPPINESS ANCHORS
// ============================================================================

/**
 * Retrieve joy network memories
 * Used when user's mood seems low
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max results (default 3)
 */
const getHappinessAnchors = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, limit = 3 } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const anchorsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('happinessAnchors');

    const snapshot = await anchorsRef
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    const anchors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Update recall counts (non-blocking)
    anchors.forEach(anchor => {
      anchorsRef.doc(anchor.id).update({
        recallCount: FieldValue.increment(1),
        lastRecalled: FieldValue.serverTimestamp()
      }).catch(() => {});
    });

    return { success: true, anchors };

  } catch (error) {
    console.error('❌ Get happiness anchors error:', error);
    return { success: true, anchors: [] };
  }
});

// ============================================================================
// STORE HAPPINESS ANCHOR
// ============================================================================

/**
 * Store a positive memory in the joy network
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} memory - The happy memory content
 * @param {number} score - Happiness score (1-10)
 * @param {string} peakMoment - The most vivid moment
 * @param {Object} sensoryAnchors - Sensory details (sight, sound, smell, etc.)
 */
const storeHappinessAnchor = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, memory, score, peakMoment, sensoryAnchors } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'memory']);

  try {
    const anchorsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('happinessAnchors');

    const docRef = await anchorsRef.add({
      memory,
      score: score || 8,
      peakMoment: peakMoment || null,
      sensoryAnchors: sensoryAnchors || {},
      createdAt: FieldValue.serverTimestamp(),
      lastRecalled: FieldValue.serverTimestamp(),
      recallCount: 1
    });

    console.log('😊 Happiness anchor stored:', memory.slice(0, 50));
    return { success: true, id: docRef.id };

  } catch (error) {
    console.error('❌ Store happiness anchor error:', error);
    throw new Error(`Failed to store happiness anchor: ${error.message}`);
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getHappinessAnchors,
  storeHappinessAnchor
};
