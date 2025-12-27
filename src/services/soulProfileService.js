/**
 * SoulProfile Service
 *
 * Handles persistence of SoulProfiles to Firestore.
 * The SoulProfile grows over time as users:
 * - Chat with SoulPartner
 * - Build their Biography
 * - Enter the Sanctuary
 * - Answer Neural Pathway questions
 *
 * Storage Strategy:
 * - SoulProfiles are stored in /users/{userId}/soulProfile
 * - They are loaded when a user enters the Cathedral
 * - They are updated incrementally after each interaction
 *
 * Part of GENESIS OS - Cathedral Soul Architecture
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  createEmptySoulProfile,
  buildSoulProfileFromFirebase,
  addSoulPattern,
  logBreakthrough,
  saveSoulLetter,
  updateEmotionalState,
  updateMetrics,
  extractSoulContext,
  formatSoulNarrative,
  calculateSoulBurden
} from '../soul/soulProfile';

// ═══════════════════════════════════════════════════════════════════════════
// LOAD / SAVE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get or create a SoulProfile for a user
 * If no profile exists, creates one from their Firebase profile
 *
 * @param {string} userId - User ID
 * @param {Object|null} existingFirebaseProfile - Optional existing profile to build from
 * @returns {Promise<Object>} The SoulProfile
 */
export async function getOrCreateSoulProfile(userId, existingFirebaseProfile = null) {
  try {
    // Check for existing SoulProfile
    const soulProfileRef = doc(db, 'users', userId, 'cathedral', 'soulProfile');
    const soulProfileSnap = await getDoc(soulProfileRef);

    if (soulProfileSnap.exists()) {
      console.log('🔮 [SoulProfile] Loaded existing soul profile for:', userId);
      return soulProfileSnap.data();
    }

    // Create new profile
    let newProfile;

    if (existingFirebaseProfile) {
      // Build from existing Firebase profile
      console.log('🔮 [SoulProfile] Building new soul profile from Firebase data');
      newProfile = buildSoulProfileFromFirebase({
        id: userId,
        ...existingFirebaseProfile
      });
    } else {
      // Try to load Firebase profile
      const userProfileRef = doc(db, 'users', userId, 'profiles', 'default');
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        newProfile = buildSoulProfileFromFirebase({
          id: userId,
          ...userProfileSnap.data()
        });
      } else {
        // Create completely empty profile
        console.log('🔮 [SoulProfile] Creating empty soul profile');
        newProfile = createEmptySoulProfile(userId);
      }
    }

    // Save the new profile
    await setDoc(soulProfileRef, newProfile);
    console.log('🔮 [SoulProfile] Saved new soul profile');

    return newProfile;
  } catch (error) {
    console.error('Failed to get/create soul profile:', error);
    // Return empty profile as fallback
    return createEmptySoulProfile(userId);
  }
}

/**
 * Save updates to a SoulProfile
 *
 * @param {string} userId
 * @param {Object} updates - Partial profile updates
 * @returns {Promise<void>}
 */
export async function updateSoulProfile(userId, updates) {
  try {
    const soulProfileRef = doc(db, 'users', userId, 'cathedral', 'soulProfile');
    await updateDoc(soulProfileRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    });
    console.log('🔮 [SoulProfile] Updated soul profile');
  } catch (error) {
    console.error('Failed to update soul profile:', error);
    throw error;
  }
}

/**
 * Save a complete SoulProfile (full overwrite)
 *
 * @param {string} userId
 * @param {Object} profile - Complete SoulProfile
 * @returns {Promise<void>}
 */
export async function saveSoulProfile(userId, profile) {
  try {
    const soulProfileRef = doc(db, 'users', userId, 'cathedral', 'soulProfile');
    await setDoc(soulProfileRef, {
      ...profile,
      lastUpdated: new Date().toISOString()
    });
    console.log('🔮 [SoulProfile] Saved complete soul profile');
  } catch (error) {
    console.error('Failed to save soul profile:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN & BREAKTHROUGH OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Add a new soul pattern discovered during interaction
 *
 * @param {string} userId
 * @param {Object} pattern - Pattern data
 * @param {string} source - Where discovered (sanctuary, soulpartner, biography)
 * @returns {Promise<Object>} Updated profile
 */
export async function addPatternToProfile(userId, pattern, source) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const updatedProfile = addSoulPattern(profile, pattern, source);
    await saveSoulProfile(userId, updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to add pattern:', error);
    throw error;
  }
}

/**
 * Log a breakthrough moment
 *
 * @param {string} userId
 * @param {string} insight - The breakthrough text
 * @param {string} source - Where it happened
 * @param {number} depth - 1-5 significance
 * @returns {Promise<Object>} Updated profile
 */
export async function logBreakthroughToProfile(userId, insight, source, depth = 3) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const updatedProfile = logBreakthrough(profile, insight, source, depth);
    await saveSoulProfile(userId, updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to log breakthrough:', error);
    throw error;
  }
}

/**
 * Save a soul letter excerpt
 *
 * @param {string} userId
 * @param {string} excerpt - The meaningful text
 * @param {string} context - Where it came from
 * @param {string|null} theme
 * @returns {Promise<Object>} Updated profile
 */
export async function saveSoulLetterToProfile(userId, excerpt, context, theme = null) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const updatedProfile = saveSoulLetter(profile, excerpt, context, theme);
    await saveSoulProfile(userId, updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to save soul letter:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTRACTION FOR AI
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get soul context for AI consumption
 * This is the main function that SoulPartner, Sanctuary, etc. use
 * to get a deep understanding of who this person is.
 *
 * @param {string} userId
 * @param {Object} options - What to include
 * @returns {Promise<Object>} Soul context for AI
 */
export async function getSoulContextForAI(userId, options = {}) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    return extractSoulContext(profile, options);
  } catch (error) {
    console.error('Failed to get soul context:', error);
    // Return minimal context as fallback
    return {
      name: 'Dear Soul',
      identity: {},
      depth: {
        hasIdentity: false,
        hasBiography: false,
        hasPatterns: false,
        hasRelationships: false,
        hasBreakthroughs: false
      },
      metrics: {
        soulBurden: 0,
        emotionalCapacity: 3
      }
    };
  }
}

/**
 * Get soul context as narrative text for AI
 *
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<string>} Narrative soul portrait
 */
export async function getSoulNarrativeForAI(userId, options = {}) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const context = extractSoulContext(profile, options);
    return formatSoulNarrative(context);
  } catch (error) {
    console.error('Failed to get soul narrative:', error);
    return '=== SOUL PORTRAIT ===\n\nThis soul is just beginning their journey in the Cathedral.\nNo history yet, but full of potential.';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// METRICS UPDATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Update emotional state after interaction
 *
 * @param {string} userId
 * @param {string} emotionalState
 * @returns {Promise<Object>} Updated profile
 */
export async function updateEmotionalStateInProfile(userId, emotionalState) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const updatedProfile = updateEmotionalState(profile, emotionalState);
    await saveSoulProfile(userId, updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update emotional state:', error);
    throw error;
  }
}

/**
 * Recalculate and save soul burden
 *
 * @param {string} userId
 * @returns {Promise<number>} New soul burden value
 */
export async function recalculateSoulBurden(userId) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const newBurden = calculateSoulBurden(profile);
    const updatedProfile = updateMetrics(profile, { soulBurden: newBurden });
    await saveSoulProfile(userId, updatedProfile);
    return newBurden;
  } catch (error) {
    console.error('Failed to recalculate soul burden:', error);
    return 0;
  }
}

/**
 * Increment conversation count
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function incrementConversationCount(userId) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    const updatedProfile = updateMetrics(profile, {
      relationshipDepth: {
        ...profile.metrics.relationshipDepth,
        conversations: profile.metrics.relationshipDepth.conversations + 1
      }
    });
    await saveSoulProfile(userId, updatedProfile);
  } catch (error) {
    console.error('Failed to increment conversation count:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNC WITH EXISTING SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync SoulProfile with changes from Biography module
 * Called when user adds events to their timeline
 *
 * @param {string} userId
 * @param {Object[]} newEvents - New life events
 * @returns {Promise<Object>} Updated profile
 */
export async function syncBiographyEvents(userId, newEvents) {
  try {
    const profile = await getOrCreateSoulProfile(userId);

    // Convert new events to SoulProfile format
    const formattedEvents = newEvents.map((event, idx) => ({
      id: event.id || `event-${Date.now()}-${idx}`,
      year: event.year,
      type: event.type || event.category || 'general',
      description: event.description || event.event || '',
      emotionalImpact: event.emotionalSignificance || event.emotionalImpact || null,
      location: event.location || null,
      peopleInvolved: event.people || null,
      emotionalWeight: event.weight || null
    }));

    // Merge with existing events (avoid duplicates by ID)
    const existingIds = new Set(profile.biography.events.map(e => e.id));
    const newUniqueEvents = formattedEvents.filter(e => !existingIds.has(e.id));

    const allEvents = [...profile.biography.events, ...newUniqueEvents];

    // Recalculate years documented
    const years = allEvents.map(e => e.year).filter(y => y);
    let yearsDocumented = 0;
    if (years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      yearsDocumented = maxYear - minYear + 1;
    }

    // Update event types
    const eventTypes = [...new Set(allEvents.map(e => e.type).filter(t => t))];

    const updatedProfile = {
      ...profile,
      biography: {
        ...profile.biography,
        events: allEvents,
        yearsDocumented,
        eventTypes
      },
      lastUpdated: new Date().toISOString()
    };

    await saveSoulProfile(userId, updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to sync biography events:', error);
    throw error;
  }
}

/**
 * Sync SoulProfile with changes from Sanctuary
 * Called after Sanctuary recognition is complete
 *
 * @param {string} userId
 * @param {Object} sanctuaryResult - Result from Sanctuary
 * @returns {Promise<Object>} Updated profile
 */
export async function syncSanctuaryResult(userId, sanctuaryResult) {
  try {
    const profile = await getOrCreateSoulProfile(userId);
    let updatedProfile = profile;

    // Extract patterns from emotionalPatterns if present
    if (sanctuaryResult.emotionalPatterns) {
      const ep = sanctuaryResult.emotionalPatterns;

      if (ep.coreWound) {
        updatedProfile = addSoulPattern(updatedProfile, {
          label: 'Core Wound',
          intensity: 80,
          tone: 'heavy',
          center: 'Heart',
          origin: 'Sanctuary recognition',
          currentEffect: ep.coreWound
        }, 'sanctuary');
      }

      if (ep.sacredGift) {
        updatedProfile = addSoulPattern(updatedProfile, {
          label: 'Sacred Gift',
          intensity: 70,
          tone: 'hopeful',
          center: 'Heart',
          origin: 'Sanctuary recognition',
          currentEffect: ep.sacredGift
        }, 'sanctuary');
      }

      if (ep.hiddenLonging) {
        updatedProfile = addSoulPattern(updatedProfile, {
          label: 'Hidden Longing',
          intensity: 60,
          tone: 'tender',
          center: 'Heart',
          origin: 'Sanctuary recognition',
          currentEffect: ep.hiddenLonging
        }, 'sanctuary');
      }
    }

    // Save short mantra as a soul letter
    if (sanctuaryResult.shortMantra) {
      updatedProfile = saveSoulLetter(
        updatedProfile,
        sanctuaryResult.shortMantra,
        'Sanctuary Recognition',
        'mantra'
      );
    }

    await saveSoulProfile(userId, updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to sync sanctuary result:', error);
    throw error;
  }
}

export default {
  getOrCreateSoulProfile,
  updateSoulProfile,
  saveSoulProfile,
  addPatternToProfile,
  logBreakthroughToProfile,
  saveSoulLetterToProfile,
  getSoulContextForAI,
  getSoulNarrativeForAI,
  updateEmotionalStateInProfile,
  recalculateSoulBurden,
  incrementConversationCount,
  syncBiographyEvents,
  syncSanctuaryResult
};
