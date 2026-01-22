/**
 * compatibilityMatchService.js
 *
 * Service layer for computing compatibility scores with explainability
 * Bridges the UI to the matchScoreWithExplain TypeScript function
 *
 * Stone II: Canon of Screens - Screen 3 & 4 data provider
 * Stone III: Flap Cosmology - L0→L3 data source
 */

// Import from TypeScript match score utilities
import { matchScoreWithExplain, matchScore, getCompatibilityInsights } from '../utils/matchScore';

// Import the proper fusion engine - uses ALL personality sources
import { fuseAllSourcesTo30Facets, SOURCE_WEIGHTS } from '../data/personalitySourceMappings';

/**
 * Convert a Firestore profile to the Profile type expected by matchScore
 *
 * @param {Object} firestoreProfile - Profile from Firestore/ProfileContext
 * @returns {Object} Profile compatible with matchScore
 */
function convertToMatchProfile(firestoreProfile) {
  if (!firestoreProfile) return null;

  // Extract or generate neo30Facets
  let neo30Facets = firestoreProfile.neo30Facets;

  // If no pre-computed 30-facets, try to derive from available data
  if (!neo30Facets || !Array.isArray(neo30Facets) || neo30Facets.length !== 30) {
    neo30Facets = deriveNeo30FromProfile(firestoreProfile);
  }

  return {
    id: firestoreProfile.id,
    name: firestoreProfile.displayName || firestoreProfile.fullName || firestoreProfile.name,
    neo30Facets,
    bazi: firestoreProfile.bazi || firestoreProfile.baziProfile || {}
  };
}

/**
 * Derive a 30-facet NEO PI-R vector from available profile data
 * Uses the full personality fusion engine with ALL sources:
 * - BaZi (30% weight) - Chinese astrology elemental system
 * - Big5 (25% weight) - Ground truth personality scores
 * - Enneagram (18% weight) - Motivational depth
 * - MBTI (10% weight) - Cognitive preferences
 * - Western Zodiac (10% weight) - Element/modality
 * - Numerology (7% weight) - Life path patterns
 *
 * @param {Object} profile - Profile data from Firestore
 * @returns {number[]} 30-element array [0-1]
 */
function deriveNeo30FromProfile(profile) {
  // Build sources object for fusion engine
  const sources = {};
  const activeSources = [];

  // BaZi (highest weight - 30%)
  if (profile.bazi || profile.baziProfile) {
    sources.bazi = profile.bazi || profile.baziProfile;
    activeSources.push('bazi');
  }

  // Big Five (ground truth - 25%)
  if (profile.big5 || profile.bigFive || profile.personalityScores?.big5) {
    const rawBig5 = profile.big5 || profile.bigFive || profile.personalityScores?.big5;
    sources.big5 = {
      neuroticism: normalizeScore(rawBig5.neuroticism || rawBig5.N || 0.5),
      extraversion: normalizeScore(rawBig5.extraversion || rawBig5.E || 0.5),
      openness: normalizeScore(rawBig5.openness || rawBig5.O || 0.5),
      agreeableness: normalizeScore(rawBig5.agreeableness || rawBig5.A || 0.5),
      conscientiousness: normalizeScore(rawBig5.conscientiousness || rawBig5.C || 0.5)
    };
    activeSources.push('big5');
  }

  // Enneagram (motivational depth - 18%)
  if (profile.enneagram || profile.enneagramType) {
    const raw = profile.enneagram || profile.enneagramType;
    sources.enneagram = {
      core: typeof raw === 'object' ? (raw.core || raw.type) : raw,
      wing: typeof raw === 'object' ? raw.wing : null,
      tritype: typeof raw === 'object' ? raw.tritype : null,
      stacking: typeof raw === 'object' ? raw.stacking : null,
      level: typeof raw === 'object' ? raw.level : null
    };
    activeSources.push('enneagram');
  }

  // MBTI (cognitive preferences - 10%)
  if (profile.mbtiType || profile.mbti) {
    sources.mbti = profile.mbtiType || profile.mbti;
    activeSources.push('mbti');
  }

  // Western Zodiac / Natal Chart (10%)
  if (profile.natal || profile.sunSign || profile.westernZodiac) {
    const natal = profile.natal || profile.westernZodiac || {};
    sources.natal = {
      sunSign: natal.sunSign || profile.sunSign || null,
      moonSign: natal.moonSign || profile.moonSign || null,
      risingSign: natal.risingSign || natal.ascendant || profile.ascendant || null
    };
    if (sources.natal.sunSign) {
      activeSources.push('natal');
    }
  }

  // Numerology (life path - 7%)
  if (profile.numerology || profile.lifePath) {
    sources.numerology = typeof profile.numerology === 'object'
      ? profile.numerology.lifePath
      : (profile.numerology || profile.lifePath);
    if (sources.numerology) {
      activeSources.push('numerology');
    }
  }

  // Log sources used for debugging/transparency
  if (activeSources.length > 0) {
    console.debug(`[CompatibilityMatch] Fusing from ${activeSources.length} sources:`, activeSources.join(', '));
  } else {
    console.warn('[CompatibilityMatch] No personality sources available - using neutral vector');
  }

  // Use the full fusion engine
  return fuseAllSourcesTo30Facets(sources);
}

// Note: MBTI to facet mapping is now handled by the fusion engine
// via mbtiTo30Facets() in personalitySourceMappings.js

/**
 * Normalize various score formats to 0-1 range
 */
function normalizeScore(value) {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 50;
  }

  // Handle different scales
  if (value > 1) {
    // Assume 0-100 scale
    return value / 100;
  }
  return value;
}

/**
 * Compute compatibility with full explainability contract
 *
 * @param {Object} profileA - First profile from Firestore
 * @param {Object} profileB - Second profile from Firestore
 * @param {Object} options - Explainability options
 * @returns {Promise<Object>} MatchScoreResultExplained
 */
export async function computeCompatibilityWithExplain(profileA, profileB, options = {}) {
  // Convert to match-compatible format
  const matchProfileA = convertToMatchProfile(profileA);
  const matchProfileB = convertToMatchProfile(profileB);

  if (!matchProfileA || !matchProfileB) {
    throw new Error('Invalid profile data');
  }

  // neo30Facets should always exist now via deriveNeo30FromProfile fallback
  // Log warning if data quality is low
  if (!matchProfileA.neo30Facets?.length || !matchProfileB.neo30Facets?.length) {
    console.warn('Using derived NEO30 data - profile may not have complete personality assessments');
  }

  // Compute with explainability
  const result = matchScoreWithExplain(matchProfileA, matchProfileB, {
    alpha: options.alpha ?? 0.25,
    beta: options.beta ?? 0.30,
    explain: {
      includeL0: options.includeL0 ?? true,
      includeL1: options.includeL1 ?? true,
      includeL2: options.includeL2 ?? false,
      includeL3: options.includeL3 ?? false,
      profileA_id: profileA.id,
      profileB_id: profileB.id
    }
  });

  return result;
}

/**
 * Compute basic compatibility (without explainability)
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @param {Object} options - Scoring options
 * @returns {Object} MatchScoreResult
 */
export function computeBasicCompatibility(profileA, profileB, options = {}) {
  const matchProfileA = convertToMatchProfile(profileA);
  const matchProfileB = convertToMatchProfile(profileB);

  if (!matchProfileA || !matchProfileB) {
    throw new Error('Invalid profile data');
  }

  return matchScore(matchProfileA, matchProfileB, {
    alpha: options.alpha ?? 0.25,
    beta: options.beta ?? 0.30
  });
}

/**
 * Get human-readable insights from a match result
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @param {Object} matchResult - Result from matchScore
 * @returns {string[]} Array of insight strings
 */
export function getInsights(profileA, profileB, matchResult) {
  const matchProfileA = convertToMatchProfile(profileA);
  const matchProfileB = convertToMatchProfile(profileB);

  return getCompatibilityInsights(matchProfileA, matchProfileB, matchResult);
}

/**
 * Quick compatibility check for list views (returns only score and level)
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @returns {Object} { total, level }
 */
export function quickCompatibilityCheck(profileA, profileB) {
  try {
    const result = computeBasicCompatibility(profileA, profileB);
    return {
      total: result.total,
      level: result.level
    };
  } catch (error) {
    console.warn('Quick compatibility check failed:', error);
    return {
      total: 50,
      level: 'Unknown'
    };
  }
}

/**
 * Batch compute compatibility for a profile against multiple others
 *
 * @param {Object} mainProfile - Profile to compare from
 * @param {Object[]} otherProfiles - Array of profiles to compare against
 * @returns {Object[]} Array of { profileId, total, level }
 */
export function batchCompatibilityCheck(mainProfile, otherProfiles) {
  return otherProfiles.map(other => ({
    profileId: other.id,
    profileName: other.fullName || other.name,
    ...quickCompatibilityCheck(mainProfile, other)
  })).sort((a, b) => b.total - a.total);
}

export default {
  computeCompatibilityWithExplain,
  computeBasicCompatibility,
  getInsights,
  quickCompatibilityCheck,
  batchCompatibilityCheck
};
