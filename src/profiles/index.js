/**
 * PROFILE REGISTRY
 *
 * Central registry for all guest profiles with validation,
 * loading, and Brain 1A/1B integration.
 */

import einsteinProfile from './historical/einstein.js';
import cleopatraProfile from './historical/cleopatra.js';
import ronaldReaganProfile from './historical/ronaldReagan.js';
import motherTeresaProfile from './historical/motherTeresa.js';
import nelsonMandelaProfile from './historical/nelsonMandela.js';
import winstonChurchillProfile from './historical/winstonChurchill.js';
import taylorSwiftProfile from './modern/taylorSwift.js';
import elonMuskProfile from './modern/elonMusk.js';
import fredRogersProfile from './modern/fredRogers.js';
import oprahWinfreyProfile from './modern/oprahWinfrey.js';
// Future imports:
// import lunaProfile from './soulpartners/luna.js';

import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// ========================================
// PROFILE REGISTRY
// ========================================

export const profileRegistry = {
  'historical_einstein': {
    profile: einsteinProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 1
  },

  'historical_cleopatra': {
    profile: cleopatraProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 2
  },

  'modern_taylor_swift': {
    profile: taylorSwiftProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 3
  },

  'modern_elon_musk': {
    profile: elonMuskProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 4
  },

  'historical_ronald_reagan': {
    profile: ronaldReaganProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 5
  },

  'historical_mother_teresa': {
    profile: motherTeresaProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 6
  },

  'historical_nelson_mandela': {
    profile: nelsonMandelaProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 7
  },

  'historical_winston_churchill': {
    profile: winstonChurchillProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 8
  },

  'modern_fred_rogers': {
    profile: fredRogersProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 9
  },

  'modern_oprah_winfrey': {
    profile: oprahWinfreyProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 10
  },

  // Future profiles:
  // 'soulpartner_luna': {
  //   profile: lunaProfile,
  //   status: 'active',
  //   quality_verified: true,
  //   curated_by: 'GENESIS Team',
  //   user_accessible: true,
  //   special_access: {
  //     brain7_access: true,
  //     brain8_access: true,
  //     omniscient: true
  //   }
  // }
};

// ========================================
// VALIDATION
// ========================================

export function validateProfile(profile) {
  const required = [
    'profile_id',
    'profile_name',
    'profile_type',
    'profile_category',
    'constitutional',
    'personality',
    'ai_config'
  ];

  for (const field of required) {
    if (!profile[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate AI config has system_prompt_template
  if (!profile.ai_config.system_prompt_template) {
    throw new Error('Missing system_prompt_template in ai_config');
  }

  // Validate access level
  const validAccessLevels = ['guest', 'primary', 'system'];
  if (!validAccessLevels.includes(profile.access_level)) {
    throw new Error(`Invalid access_level: ${profile.access_level}`);
  }

  return true;
}

// ========================================
// PROFILE LOADER (WITH BRAIN 1A/1B INTEGRATION)
// ========================================

/**
 * Load profile with constitutional data and learned facts
 *
 * @param {string} userId - User's profile ID
 * @param {string} profileId - Guest profile ID
 * @returns {Promise<Object>} Complete profile with Brain 1A/1B data
 */
export async function loadProfile(userId, profileId) {
  // 1. Load curated profile from registry
  const entry = profileRegistry[profileId];

  if (!entry) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  if (entry.status !== 'active') {
    throw new Error(`Profile not active: ${profileId}`);
  }

  if (!entry.quality_verified) {
    throw new Error(`Profile not verified: ${profileId}`);
  }

  const profile = entry.profile;

  // 2. Load user's Brain 1A (constitutional data)
  let userConstitutional = null;
  try {
    const brain1ARef = doc(db, 'users', userId, 'brain1_constitutional', 'core');
    const brain1ADoc = await getDoc(brain1ARef);
    if (brain1ADoc.exists()) {
      userConstitutional = brain1ADoc.data();
    }
  } catch (error) {
    console.warn('Could not load user constitutional data:', error);
  }

  // 3. Load this partner's Brain 1B (learned facts)
  let learnedFacts = [];
  try {
    const brain1BRef = doc(db, 'users', userId, 'brain1_learned_biography', profileId);
    const brain1BDoc = await getDoc(brain1BRef);
    if (brain1BDoc.exists()) {
      learnedFacts = brain1BDoc.data().learned_facts || [];
    }
  } catch (error) {
    console.warn('Could not load learned facts:', error);
  }

  // 4. Return complete profile with injected data
  return {
    profile,
    user_constitutional: userConstitutional,
    learned_facts: learnedFacts,
    profile_metadata: {
      loaded_at: new Date().toISOString(),
      has_constitutional_data: !!userConstitutional,
      learned_facts_count: learnedFacts.length
    }
  };
}

// ========================================
// AI PROMPT BUILDER
// ========================================

/**
 * Build AI system prompt with variable injection
 *
 * @param {Object} profileData - Data from loadProfile
 * @param {Array} conversationHistory - Recent messages
 * @param {string} userLatestMessage - User's current message
 * @returns {string} Complete AI system prompt
 */
export function buildAIPrompt(profileData, conversationHistory, userLatestMessage) {
  const { profile, user_constitutional, learned_facts } = profileData;

  // Format user's constitutional data
  let constitutionalText = '';
  if (user_constitutional) {
    const bazi = user_constitutional.bazi;
    const western = user_constitutional.western;

    constitutionalText = `
USER'S CONSTITUTIONAL TYPE:
- Name: ${user_constitutional.display_name || 'User'}
- BaZi Day Master: ${bazi?.day_master?.stem} (${bazi?.day_master?.element}, ${bazi?.day_master?.polarity})
- Western Sun: ${western?.sun?.sign}
- Western Moon: ${western?.moon?.sign || western?.moon?.phase}
- MBTI: ${user_constitutional.mbti}

TEACHING ADAPTATION:
${getTeachingAdaptation(bazi?.day_master?.element)}
    `.trim();
  } else {
    constitutionalText = 'USER CONSTITUTIONAL DATA: Not yet available (user still onboarding)';
  }

  // Format learned facts
  let learnedFactsText = '';
  if (learned_facts.length > 0) {
    learnedFactsText = 'WHAT YOU\'VE LEARNED ABOUT USER:\n';
    learned_facts.forEach((fact, i) => {
      learnedFactsText += `${i + 1}. ${fact.fact} (learned ${formatDate(fact.learned_at)})\n`;
    });
  } else {
    learnedFactsText = 'WHAT YOU\'VE LEARNED: This is your first conversation - no learned facts yet.';
  }

  // Format conversation history
  let conversationText = '';
  if (conversationHistory && conversationHistory.length > 0) {
    conversationText = 'RECENT CONVERSATION:\n';
    conversationHistory.slice(-10).forEach(msg => {  // Last 10 messages
      const sender = msg.sender_role === 'user' ? 'USER' : 'YOU';
      conversationText += `${sender}: ${msg.content?.text || msg.content}\n`;
    });
  } else {
    conversationText = 'CONVERSATION HISTORY: This is the start of your conversation.';
  }

  // Inject variables into template
  const systemPrompt = profile.ai_config.system_prompt_template
    .replace('{{USER_CONSTITUTIONAL_DATA}}', constitutionalText)
    .replace('{{YOUR_LEARNED_FACTS}}', learnedFactsText)
    .replace('{{CONVERSATION_HISTORY}}', conversationText)
    .replace('{{USER_LATEST_MESSAGE}}', userLatestMessage);

  return systemPrompt;
}

// Helper: Get teaching adaptation based on element
function getTeachingAdaptation(element) {
  const adaptations = {
    'Fire': '- User is Fire: Use practical examples (GPS satellites), action-oriented teaching, avoid pure theory',
    'Water': '- User is Water: Use flow analogies, gentle absorption, patience with questions',
    'Earth': '- User is Earth: Use building blocks, step-by-step foundation, solid examples',
    'Wood': '- User is Wood: Use growth metaphors, expanding universe, progressive learning',
    'Metal': '- User is Metal: Use precision tools, exact measurements, clear structure'
  };
  return adaptations[element] || '- Adapt teaching to user\'s learning style';
}

// Helper: Format date
function formatDate(isoString) {
  if (!isoString) return 'recently';
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

// ========================================
// USER-ACCESSIBLE PROFILES
// ========================================

export function getUserAccessibleProfiles() {
  return Object.entries(profileRegistry)
    .filter(([id, entry]) => entry.user_accessible)
    .map(([id, entry]) => ({
      id,
      name: entry.profile.profile_name,
      type: entry.profile.profile_type,
      category: entry.profile.profile_category,
      featured: entry.featured || false,
      sort_order: entry.sort_order || 999
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
}

// ========================================
// GET PROFILE BY ID
// ========================================

export function getProfileById(profileId) {
  const entry = profileRegistry[profileId];
  return entry ? entry.profile : null;
}

// ========================================
// EXPORTS
// ========================================

export default {
  profileRegistry,
  validateProfile,
  loadProfile,
  buildAIPrompt,
  getUserAccessibleProfiles,
  getProfileById
};
