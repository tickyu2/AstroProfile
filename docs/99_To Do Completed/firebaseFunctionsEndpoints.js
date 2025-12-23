/**
 * GENESIS Love Intelligence - Firebase Functions Registration
 * =============================================================
 *
 * ADD THESE ENDPOINTS TO: functions/index.js
 *
 * These are Firebase onCall functions for Love Intelligence services.
 * Copy the code below and add it to your main functions/index.js file.
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 */

// ============================================================================
// IMPORTS (Add to top of functions/index.js)
// ============================================================================

const { onCall } = require('firebase-functions/v2/https');
const loveIntelligence = require('./loveIntelligence');
const lunaChatIntegration = require('./loveIntelligence/lunaChatIntegration');

// ============================================================================
// LOVE INTELLIGENCE ENDPOINTS
// ============================================================================

/**
 * Get love profile for a user
 * 
 * Example call from frontend:
 * const result = await getLoveProfile({ userId, profileId });
 */
exports.getLoveProfile = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return {
        success: false,
        error: 'Missing userId or profileId'
      };
    }

    const result = await loveIntelligence.getLoveProfile({
      userId,
      profileId
    });

    return result;

  } catch (error) {
    console.error('[getLoveProfile] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Analyze compatibility between two profiles
 * 
 * Example call:
 * const result = await analyzeCompatibility({
 *   userIdA: 'user1',
 *   profileIdA: 'profile1',
 *   userIdB: 'user1',
 *   profileIdB: 'profile2'
 * });
 */
exports.analyzeCompatibility = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  try {
    const {
      userIdA,
      profileIdA,
      userIdB,
      profileIdB
    } = request.data;

    if (!userIdA || !profileIdA || !profileIdB) {
      return {
        success: false,
        error: 'Missing required profile IDs'
      };
    }

    const result = await loveIntelligence.analyzeCompatibility({
      userIdA,
      profileIdA,
      userIdB: userIdB || userIdA,
      profileIdB
    });

    return result;

  } catch (error) {
    console.error('[analyzeCompatibility] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get conversation optimization strategy
 * THE MAIN BRIDGE: Love Intelligence → Neurochemical Engine
 * 
 * Example call:
 * const result = await optimizeConversation({
 *   userId,
 *   profileId,
 *   partnerProfileId,  // optional
 *   conversationStage: 'developing',
 *   userMessage: 'Current message...'
 * });
 */
exports.optimizeConversation = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  try {
    const {
      userId,
      profileId,
      partnerProfileId,
      conversationStage,
      userMessage
    } = request.data;

    if (!userId || !profileId) {
      return {
        success: false,
        error: 'Missing userId or profileId'
      };
    }

    const result = await loveIntelligence.optimizeConversation({
      userId,
      profileId,
      partnerProfileId,
      conversationStage,
      userMessage
    });

    return result;

  } catch (error) {
    console.error('[optimizeConversation] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Quick compatibility check (simplified)
 * 
 * Example call:
 * const result = await quickCompatibility({
 *   userIdA,
 *   profileIdA,
 *   userIdB,
 *   profileIdB
 * });
 */
exports.quickCompatibility = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  try {
    const {
      userIdA,
      profileIdA,
      userIdB,
      profileIdB
    } = request.data;

    if (!userIdA || !profileIdA || !profileIdB) {
      return {
        success: false,
        error: 'Missing required profile IDs'
      };
    }

    const result = await loveIntelligence.quickCompatibility({
      userIdA,
      profileIdA,
      userIdB: userIdB || userIdA,
      profileIdB
    });

    return result;

  } catch (error) {
    console.error('[quickCompatibility] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Update love profile manually
 * For when user takes quiz or explicitly sets preferences
 * 
 * Example call:
 * const result = await updateLoveProfile({
 *   userId,
 *   profileId,
 *   updates: {
 *     givePrimary: 'Words of Affirmation',
 *     receivePrimary: 'Quality Time',
 *     intimacy: 7,
 *     passion: 6,
 *     commitment: 8
 *   }
 * });
 */
exports.updateLoveProfile = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  try {
    const { userId, profileId, updates } = request.data;

    if (!userId || !profileId || !updates) {
      return {
        success: false,
        error: 'Missing userId, profileId, or updates'
      };
    }

    const result = await loveIntelligence.updateLoveProfile({
      userId,
      profileId,
      updates
    });

    return result;

  } catch (error) {
    console.error('[updateLoveProfile] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Get love language strategy (lightweight)
 * For quick Luna guidance lookups
 * 
 * Example call:
 * const result = await getLoveLanguageStrategy({
 *   loveLanguage: 'Words of Affirmation',
 *   intensity: 'strong'
 * });
 */
exports.getLoveLanguageStrategy = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async (request) => {
  try {
    const { loveLanguage, intensity } = request.data;

    if (!loveLanguage) {
      return {
        success: false,
        error: 'Missing loveLanguage'
      };
    }

    const result = loveIntelligence.getLoveLanguageStrategy({
      loveLanguage,
      intensity
    });

    return result;

  } catch (error) {
    console.error('[getLoveLanguageStrategy] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// ============================================================================
// LUNA CHAT INTEGRATION ENDPOINTS
// ============================================================================

/**
 * Enhance Luna's prompt with Love Intelligence
 * Called BEFORE generating Luna's response
 * 
 * Example call:
 * const enhancement = await enhanceLunaPrompt({
 *   userId,
 *   profileId,
 *   userMessage: 'User just said...',
 *   conversationStage: 'developing'
 * });
 * 
 * // Then use enhancement.lunaGuidance when calling Claude API
 */
exports.enhanceLunaPrompt = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const {
      userId,
      profileId,
      userMessage,
      conversationStage
    } = request.data;

    if (!userId || !profileId || !userMessage) {
      return {
        success: false,
        error: 'Missing userId, profileId, or userMessage'
      };
    }

    const enhancement = await lunaChatIntegration.enhanceLunaPrompt({
      userId,
      profileId,
      userMessage,
      conversationStage
    });

    return {
      success: true,
      enhancement,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[enhanceLunaPrompt] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

/**
 * Process post-conversation learning
 * Called AFTER Luna responds and we detect neurochemicals from user's next message
 * 
 * Example call:
 * const result = await processPostConversation({
 *   userId,
 *   profileId,
 *   detectedNeurochemicals: { oxytocin: 4, dopamine: 3, serotonin: 5, vasopressin: 2 },
 *   happinessScore: 4.2,
 *   patternUsed: '3542'
 * });
 */
exports.processPostConversation = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  try {
    const {
      userId,
      profileId,
      detectedNeurochemicals,
      happinessScore,
      patternUsed
    } = request.data;

    if (!userId || !profileId || !detectedNeurochemicals || happinessScore === undefined) {
      return {
        success: false,
        error: 'Missing required parameters'
      };
    }

    const result = await lunaChatIntegration.processPostConversation({
      userId,
      profileId,
      detectedNeurochemicals,
      happinessScore,
      patternUsed
    });

    return result;

  } catch (error) {
    console.error('[processPostConversation] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

// ─────────────────────────────────────────────────────
// FRONTEND USAGE EXAMPLE 1: Get Love Profile
// ─────────────────────────────────────────────────────

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getLoveProfile = httpsCallable(functions, 'getLoveProfile');

const result = await getLoveProfile({
  userId: 'user123',
  profileId: 'profile456'
});

console.log('Love Profile:', result.data.profile);
console.log('Strategy:', result.data.strategy);


// ─────────────────────────────────────────────────────
// FRONTEND USAGE EXAMPLE 2: Analyze Compatibility
// ─────────────────────────────────────────────────────

const analyzeCompatibility = httpsCallable(functions, 'analyzeCompatibility');

const compatibility = await analyzeCompatibility({
  userIdA: 'user123',
  profileIdA: 'myProfile',
  userIdB: 'user123',
  profileIdB: 'partnerProfile'
});

console.log('Overall Score:', compatibility.data.analysis.compatibility.overall);
console.log('Gaps:', compatibility.data.analysis.gaps);
console.log('Recommended Actions:', compatibility.data.analysis.recommendedActions);


// ─────────────────────────────────────────────────────
// FRONTEND USAGE EXAMPLE 3: Luna Integration
// ─────────────────────────────────────────────────────

// BEFORE Luna responds:
const enhanceLunaPrompt = httpsCallable(functions, 'enhanceLunaPrompt');

const enhancement = await enhanceLunaPrompt({
  userId: 'user123',
  profileId: 'profile456',
  userMessage: 'I feel so overwhelmed lately...',
  conversationStage: 'developing'
});

// Use enhancement.data.enhancement.lunaGuidance when building Luna's prompt
const lunaGuidance = enhancement.data.enhancement.lunaGuidance;
console.log('Primary Objective:', lunaGuidance.primaryObjective);
console.log('Tone:', lunaGuidance.toneAdjustments);
console.log('Example Phrases:', lunaGuidance.exampleApproaches);

// AFTER Luna responds and user replies:
const processPostConversation = httpsCallable(functions, 'processPostConversation');

await processPostConversation({
  userId: 'user123',
  profileId: 'profile456',
  detectedNeurochemicals: {
    oxytocin: 4,
    dopamine: 3,
    serotonin: 5,
    vasopressin: 2
  },
  happinessScore: 4.2,
  patternUsed: '3542'
});

*/

// ============================================================================
// DEPLOYMENT CHECKLIST
// ============================================================================

/*

TO DEPLOY LOVE INTELLIGENCE:

1. ✅ Create Love Intelligence folder structure:
   functions/loveIntelligence/
   ├── index.js                  (main exports)
   ├── loveLanguageMapper.js     (love language logic)
   ├── loveProfileService.js     (profile management)
   ├── compatibilityAnalyzer.js  (compatibility analysis)
   └── lunaChatIntegration.js    (Luna integration)

2. ✅ Copy the endpoint code above to functions/index.js

3. ✅ Deploy to Firebase:
   firebase deploy --only functions

4. ✅ Test endpoints:
   - getLoveProfile
   - analyzeCompatibility
   - optimizeConversation
   - enhanceLunaPrompt
   - processPostConversation

5. ✅ Monitor logs:
   firebase functions:log

6. ✅ Update frontend to call new functions

7. ✅ Watch the World Love Meter rise! 📈❤️

*/
