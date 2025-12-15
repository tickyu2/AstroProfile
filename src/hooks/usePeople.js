/**
 * usePeople.js - Hook for Data Manager to access profiles
 *
 * Single source of truth: Uses the existing 'profiles' collection
 * via ProfileContext - no separate 'people' collection needed.
 *
 * Part of GENESIS Dashboard 1 - Data Manager
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import { useProfiles } from '../contexts/ProfileContext';

/**
 * Hook for real-time people data from Firestore
 * Wraps useProfiles to provide Data Manager compatible interface
 * @returns {Object} { people, isLoading, error }
 */
export function usePeople() {
  const { profiles, loading, error } = useProfiles();

  // Map profiles to "people" format for Data Manager compatibility
  const people = profiles.map(profile => ({
    id: profile.id,
    profileId: profile.id, // Reference back to profile for navigation
    fullName: profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown',
    nickname: profile.nickname || '',
    birthDate: profile.birthDate || '',
    birthTime: profile.birthTime || '',
    birthPlace: profile.location?.fullAddress || '',
    birthLocation: profile.location?.fullAddress || '',
    gender: profile.gender || '',
    relationship: profile.relationshipType || 'Family',
    relationshipType: profile.relationshipType || 'Family',

    // Chinese Zodiac - extract just the animal name for emoji lookup
    chineseAnimal: profile.chineseZodiac?.animal || '',
    chineseElement: profile.chineseZodiac?.element || '',
    chineseFullSign: profile.chineseZodiac?.fullSign ||
      (profile.chineseZodiac?.element && profile.chineseZodiac?.animal
        ? `${profile.chineseZodiac.element} ${profile.chineseZodiac.animal}`
        : ''),
    dominantElement: profile.chineseZodiac?.element || '',

    // Western Zodiac
    westernSign: profile.calculations?.western?.sign || '',
    sunSign: profile.calculations?.western?.sign || '',
    sunElement: profile.calculations?.western?.element || '',

    // Psychology
    mbtiType: profile.mbti || '',

    // Numerology
    lifePathNumber: profile.calculations?.numerology?.lifePath || '',

    // Priority & Tags (Phase 1B)
    priority: profile.priority ?? 0, // 0=Normal, 1=Favorite 2, 2=Favorite 1
    tags: profile.tags || [],

    // Activity tracking
    isActive: profile.isActive ?? true,
    priorityTier: profile.priorityTier || null,

    // Notes
    notes: profile.notes || '',

    // Metadata
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,

    // Keep original profile reference for full data access
    _originalProfile: profile
  }));

  return {
    people,
    isLoading: loading,
    error
  };
}

/**
 * Add a new person - delegates to ProfileContext
 * @param {Object} personData - The person data to add
 */
export async function addPerson(personData) {
  // This will be handled by ProfileContext's addProfile
  // Import and use addProfile from ProfileContext where needed
  throw new Error('Use ProfileContext.addProfile() directly for adding profiles');
}

/**
 * Update an existing person - delegates to ProfileContext
 * @param {string} personId - The document ID to update
 * @param {Object} updates - The fields to update
 */
export async function updatePerson(personId, updates) {
  // This will be handled by ProfileContext's updateProfile
  throw new Error('Use ProfileContext.updateProfile() directly for updating profiles');
}

/**
 * Delete a person - delegates to ProfileContext
 * @param {string} personId - The document ID to delete
 */
export async function deletePerson(personId) {
  // This will be handled by ProfileContext's deleteProfile
  throw new Error('Use ProfileContext.deleteProfile() directly for deleting profiles');
}

export default usePeople;
