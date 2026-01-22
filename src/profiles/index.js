/**
 * PROFILE REGISTRY
 *
 * Central registry for all guest profiles with validation,
 * loading, and Brain 1A/1B integration.
 */

import einsteinProfile from './historical/einstein.js';
import cleopatraProfile from './historical/cleopatra.js';
import ronaldReaganProfile from './historical/ronaldReagan.js';
import nancyReaganProfile from './historical/nancyReagan.js';
import joanQuigleyProfile from './historical/joanQuigley.js';
import donaldTrumpProfile from './historical/donaldTrump.js';
import margaretThatcherProfile from './historical/margaretThatcher.js';
import mikhailGorbachevProfile from './historical/mikhailGorbachev.js';
import motherTeresaProfile from './historical/motherTeresa.js';
import nelsonMandelaProfile from './historical/nelsonMandela.js';
import winstonChurchillProfile from './historical/winstonChurchill.js';
import taylorSwiftProfile from './modern/taylorSwift.js';
import elonMuskProfile from './modern/elonMusk.js';
import fredRogersProfile from './modern/fredRogers.js';
import oprahWinfreyProfile from './modern/oprahWinfrey.js';
import reaganCoupleProfile from './couples/reaganCouple.js';

// Obama Network
import barackObamaProfile from './historical/barackObama.js';
import michelleObamaProfile from './historical/michelleObama.js';
import obamaCoupleProfile from './couples/obamaCouple.js';

// Obama World Leader Network
import angelaMerkelProfile from './historical/angelaMerkel.js';
import justinTrudeauProfile from './historical/justinTrudeau.js';
import popeFrancisProfile from './historical/popeFrancis.js';
import benjaminNetanyahuProfile from './historical/benjaminNetanyahu.js';
import xiJinpingProfile from './historical/xiJinping.js';
import vladimirPutinProfile from './historical/vladimirPutin.js';

// Carter Presidential Library
import jimmyCarterProfile from './historical/jimmyCarter.js';
import rosalynnCarterProfile from './historical/rosalynnCarter.js';
import carterCoupleProfile from './couples/carterCouple.js';

// Modern Celebrity Couples - Cristiano Ronaldo & Georgina Rodriguez
import cristianoRonaldoProfile from './modern/cristianoRonaldo.js';
import georginaRodriguezProfile from './modern/georginaRodriguez.js';
import cristianoGeorginaCoupleProfile from './couples/cristianoGeorginaCouple.js';

// Modern Celebrity Couples - David & Victoria Beckham
import davidBeckhamProfile from './modern/davidBeckham.js';
import victoriaBeckhamProfile from './modern/victoriaBeckham.js';
import beckhamCoupleProfile from './couples/beckhamCouple.js';

// Entertainment Couples - Dolly Parton & Carl Dean
import dollyPartonProfile from './modern/dollyParton.js';
import carlDeanProfile from './modern/carlDean.js';
import dollyPartonCarlDeanCoupleProfile from './couples/dollyPartonCarlDeanCouple.js';

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
    sort_order: 5,
    // For Reagan Presidential Library collaboration
    institution_partner: 'Reagan Presidential Library',
    allows_markdown_editing: true
  },

  'historical_nancy_reagan': {
    profile: nancyReaganProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 6,
    institution_partner: 'Reagan Presidential Library',
    allows_markdown_editing: true
  },

  'historical_joan_quigley': {
    profile: joanQuigleyProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 7,
    // Reagan White House Shadow Network
    constitutional_network: 'reagan_inner_circle',
    relationship_connections: ['historical_nancy_reagan', 'historical_ronald_reagan'],
    tags: ['white_house_astrologer', 'cold_war_influence', 'synastry_analysis', 'betrayal_story']
  },

  'historical_margaret_thatcher': {
    profile: margaretThatcherProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 8,
    // Cold War Constitutional Wisdom Network
    constitutional_network: 'cold_war_leaders',
    relationship_connections: ['historical_ronald_reagan', 'historical_mikhail_gorbachev']
  },

  'historical_mikhail_gorbachev': {
    profile: mikhailGorbachevProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 9,
    // Cold War Constitutional Wisdom Network
    constitutional_network: 'cold_war_leaders',
    relationship_connections: ['historical_ronald_reagan', 'historical_margaret_thatcher']
  },

  'couple_ronald_nancy_reagan': {
    profile: reaganCoupleProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 7,
    profile_type: 'couple',
    institution_partner: 'Reagan Presidential Library',
    allows_markdown_editing: true
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

  // ========================================
  // OBAMA PRESIDENTIAL LIBRARY NETWORK
  // ========================================

  'historical_barack_obama': {
    profile: barackObamaProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 11,
    institution_partner: 'Obama Presidential Library',
    constitutional_network: 'obama_world_leaders',
    relationship_connections: [
      'historical_michelle_obama',
      'guest_angela_merkel',
      'guest_justin_trudeau',
      'guest_pope_francis',
      'guest_benjamin_netanyahu',
      'guest_xi_jinping',
      'guest_vladimir_putin'
    ]
  },

  'historical_michelle_obama': {
    profile: michelleObamaProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 12,
    institution_partner: 'Obama Presidential Library',
    constitutional_network: 'obama_world_leaders'
  },

  'couple_barack_michelle_obama': {
    profile: obamaCoupleProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 13,
    profile_type: 'couple',
    institution_partner: 'Obama Presidential Library'
  },

  // Obama World Leader Network
  'guest_angela_merkel': {
    profile: angelaMerkelProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 20,
    constitutional_network: 'obama_world_leaders',
    relationship_type: 'TRUSTED_ALLY',
    compatibility_with_obama: 85
  },

  'guest_justin_trudeau': {
    profile: justinTrudeauProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 21,
    constitutional_network: 'obama_world_leaders',
    relationship_type: 'MENTORSHIP',
    compatibility_with_obama: 82
  },

  'guest_pope_francis': {
    profile: popeFrancisProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 22,
    constitutional_network: 'obama_world_leaders',
    relationship_type: 'SPIRITUAL_ALIGNMENT',
    compatibility_with_obama: 88
  },

  'guest_benjamin_netanyahu': {
    profile: benjaminNetanyahuProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 23,
    constitutional_network: 'obama_world_leaders',
    relationship_type: 'TENSE_ALLIANCE',
    compatibility_with_obama: 65
  },

  'guest_xi_jinping': {
    profile: xiJinpingProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 24,
    constitutional_network: 'obama_world_leaders',
    relationship_type: 'STRATEGIC_RIVAL',
    compatibility_with_obama: 62
  },

  'guest_vladimir_putin': {
    profile: vladimirPutinProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: false,
    sort_order: 25,
    constitutional_network: 'obama_world_leaders',
    relationship_type: 'ADVERSARIAL_RESPECT',
    compatibility_with_obama: 58
  },

  // ========================================
  // CARTER PRESIDENTIAL LIBRARY NETWORK
  // ========================================

  'historical_jimmy_carter': {
    profile: jimmyCarterProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 30,
    institution_partner: 'Carter Presidential Library',
    constitutional_network: 'presidential_couples',
    relationship_connections: [
      'historical_rosalynn_carter',
      'couple_jimmy_rosalynn_carter'
    ]
  },

  'historical_rosalynn_carter': {
    profile: rosalynnCarterProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 31,
    institution_partner: 'Carter Presidential Library',
    constitutional_network: 'presidential_couples'
  },

  'couple_jimmy_rosalynn_carter': {
    profile: carterCoupleProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 32,
    profile_type: 'couple',
    institution_partner: 'Carter Presidential Library',
    compatibility_score: 95,
    years_together: 77
  },

  // ========================================
  // TRUMP PRESIDENTIAL LIBRARY NETWORK
  // ========================================

  'historical_donald_trump': {
    profile: donaldTrumpProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 35,
    institution_partner: 'Trump Presidential Library',
    constitutional_network: 'presidential_fire_earth',
    // Early formation influences
    formation_influences: ['NYMA', 'Norman Vincent Peale', 'Fred Trump'],
    // Key constitutional data
    constitutional_dominant: 'Fire 47%, Earth 46%',
    constitutional_absent: 'Wood 1%, Water 3%, Metal 3%',
    tags: ['fire_earth_synergy', 'nyma_formation', 'peale_positive_thinking', '45th_president']
  },

  // ========================================
  // MODERN CELEBRITY COUPLES - DYNASTY BUILDERS
  // ========================================

  'modern_cristiano_ronaldo': {
    profile: cristianoRonaldoProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 40,
    constitutional_network: 'modern_celebrity_couples',
    relationship_connections: [
      'modern_georgina_rodriguez',
      'couple_cristiano_georgina'
    ]
  },

  'modern_georgina_rodriguez': {
    profile: georginaRodriguezProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 41,
    constitutional_network: 'modern_celebrity_couples',
    relationship_connections: [
      'modern_cristiano_ronaldo',
      'couple_cristiano_georgina'
    ]
  },

  'couple_cristiano_georgina': {
    profile: cristianoGeorginaCoupleProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 42,
    profile_type: 'couple',
    constitutional_network: 'modern_celebrity_couples',
    compatibility_score: 92,
    years_together: 8
  },

  // David & Victoria Beckham - Double Steel Empire
  'modern_david_beckham': {
    profile: davidBeckhamProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 43,
    constitutional_network: 'modern_celebrity_couples',
    relationship_connections: [
      'modern_victoria_beckham',
      'couple_david_victoria_beckham'
    ]
  },

  'modern_victoria_beckham': {
    profile: victoriaBeckhamProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 44,
    constitutional_network: 'modern_celebrity_couples',
    relationship_connections: [
      'modern_david_beckham',
      'couple_david_victoria_beckham'
    ]
  },

  'couple_david_victoria_beckham': {
    profile: beckhamCoupleProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 45,
    profile_type: 'couple',
    constitutional_network: 'modern_celebrity_couples',
    compatibility_score: 88,
    years_together: 27
  },

  // Dolly Parton & Carl Dean - Mountain Sunshine (58-Year Marriage)
  'modern_dolly_parton': {
    profile: dollyPartonProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 46,
    constitutional_network: 'entertainment_couples',
    relationship_connections: [
      'modern_carl_dean',
      'couple_dolly_parton_carl_dean'
    ]
  },

  'modern_carl_dean': {
    profile: carlDeanProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 47,
    constitutional_network: 'entertainment_couples',
    relationship_connections: [
      'modern_dolly_parton',
      'couple_dolly_parton_carl_dean'
    ]
  },

  'couple_dolly_parton_carl_dean': {
    profile: dollyPartonCarlDeanCoupleProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    featured: true,
    sort_order: 48,
    profile_type: 'couple',
    constitutional_network: 'entertainment_couples',
    compatibility_score: 92,
    years_together: 60,
    years_married: 58
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
 * @param {string} userId - Firebase Auth UID (fallback for storage)
 * @param {string} profileId - Guest profile ID (e.g., 'historical_ronald_reagan')
 * @param {string} userProfileId - Optional AstroProfile ID for compartmentalized storage
 * @returns {Promise<Object>} Complete profile with Brain 1A/1B data
 */
export async function loadProfile(userId, profileId, userProfileId = null) {
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

  // Determine storage path - profile-based compartmentalization
  // Use AstroProfile ID if provided, fallback to Firebase UID
  const profileIdForStorage = userProfileId || userId;

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

  // 3. Load this partner's Brain 1B (learned facts) - PROFILE SCOPED
  // Path matches backend: profiles/{profileId}/b1b_learned/{partnerId}
  let learnedFacts = [];
  try {
    const brain1BRef = doc(db, 'profiles', profileIdForStorage, 'b1b_learned', profileId);
    const brain1BDoc = await getDoc(brain1BRef);
    if (brain1BDoc.exists()) {
      learnedFacts = brain1BDoc.data().learned_facts || [];
      console.log(`[Brain 1B] Loaded ${learnedFacts.length} facts for profile ${profileIdForStorage} with partner ${profileId}`);
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
