/**
 * COSMIC LOVE ANGELS DATABASE
 * Central registry of all angel couples available for CCLR
 *
 * Purpose: Export all angel couple profiles for easy import
 * Pattern: Following GENESIS guest database architecture
 *
 * Each angel couple provides:
 * - Constitutional profiles (BaZi, Western, Numerology)
 * - Relationship story and dynamics
 * - Specialized wisdom areas
 * - System prompts for AI guidance
 * - Sample conversations
 */

// Import all angel couple profiles
import ronaldNancyReagan from './ronaldNancyReagan.js';
import barackMichelleObama from './barackMichelleObama.js';
import johnnyJuneCash from './johnnyJuneCash.js';
import cleopatraMarkAntony from './cleopatraMarkAntony.js';

/**
 * Complete angel couples database
 * Organized by implementation priority
 */
export const cosmicLoveAngels = {
  // PHASE 1: Core couples (implemented first)
  ronald_nancy_reagan: ronaldNancyReagan,
  barack_michelle_obama: barackMichelleObama,
  johnny_june_cash: johnnyJuneCash,
  cleopatra_mark_antony: cleopatraMarkAntony,
};

/**
 * Get angel couple by ID
 */
export function getAngelCouple(coupleId) {
  return cosmicLoveAngels[coupleId] || null;
}

/**
 * Get all available angel couples
 */
export function getAllAngelCouples() {
  return Object.values(cosmicLoveAngels);
}

/**
 * Get angel couples by specialty
 */
export function getAngelCouplesBySpecialty(specialty) {
  return Object.values(cosmicLoveAngels).filter(couple =>
    couple.counselingStrengths.includes(specialty)
  );
}

/**
 * Get angel couples by era
 */
export function getAngelCouplesByEra(era) {
  const eras = {
    ancient: ['cleopatra_mark_antony'],
    historical: ['ronald_nancy_reagan', 'johnny_june_cash'],
    modern: ['barack_michelle_obama']
  };

  const coupleIds = eras[era] || [];
  return coupleIds.map(id => cosmicLoveAngels[id]).filter(Boolean);
}

/**
 * Search angel couples by tags
 */
export function searchAngelCouples(searchTags) {
  return Object.values(cosmicLoveAngels).filter(couple => {
    const coupleTags = [
      ...couple.counselingStrengths,
      ...couple.bestFor,
      couple.angelType
    ].map(tag => tag.toLowerCase());

    return searchTags.some(searchTag =>
      coupleTags.some(coupleTag => coupleTag.includes(searchTag.toLowerCase()))
    );
  });
}

/**
 * Get angel couple categories for UI filtering
 */
export const angelCoupleCategories = {
  byDynamic: {
    'Independence vs Togetherness': ['ronald_nancy_reagan'],
    'Modern Equality': ['barack_michelle_obama'],
    'Forgiveness & Redemption': ['johnny_june_cash'],
    'Passionate Intensity': ['cleopatra_mark_antony']
  },

  byEra: {
    'Ancient (Before 500 AD)': ['cleopatra_mark_antony'],
    'Historical (1900-1990)': ['ronald_nancy_reagan', 'johnny_june_cash'],
    'Modern (1990+)': ['barack_michelle_obama']
  },

  byChallenges: {
    'Alone Time vs Closeness': ['ronald_nancy_reagan'],
    'Dual Career Balance': ['barack_michelle_obama'],
    'Healing After Betrayal': ['johnny_june_cash'],
    'Power Dynamics': ['cleopatra_mark_antony']
  }
};

/**
 * Get recommended angel couple based on user's relationship challenge
 */
export function recommendAngelCouple(relationshipChallenge) {
  const recommendations = {
    'independence_intimacy': 'ronald_nancy_reagan',
    'alone_time': 'ronald_nancy_reagan',
    'space_needs': 'ronald_nancy_reagan',

    'dual_careers': 'barack_michelle_obama',
    'modern_equality': 'barack_michelle_obama',
    'work_life_balance': 'barack_michelle_obama',

    'forgiveness': 'johnny_june_cash',
    'betrayal': 'johnny_june_cash',
    'addiction': 'johnny_june_cash',
    'redemption': 'johnny_june_cash',

    'power_dynamics': 'cleopatra_mark_antony',
    'passionate_love': 'cleopatra_mark_antony',
    'ambitious_partners': 'cleopatra_mark_antony',
    'intensity': 'cleopatra_mark_antony'
  };

  const coupleId = recommendations[relationshipChallenge];
  return coupleId ? cosmicLoveAngels[coupleId] : null;
}

/**
 * Angel couple statistics
 */
export const angelCoupleStats = {
  totalCouples: Object.keys(cosmicLoveAngels).length,
  totalAngels: Object.keys(cosmicLoveAngels).length * 2,

  byStatus: {
    active: Object.values(cosmicLoveAngels).filter(c => c.angelStatus === 'active').length,
    comingSoon: 0 // Phase 2 couples
  },

  specialties: [
    'Independence vs Togetherness',
    'Modern Equality',
    'Forgiveness & Redemption',
    'Passionate Intensity',
    'Power Dynamics',
    'Dual Career Balance'
  ]
};

export default cosmicLoveAngels;
