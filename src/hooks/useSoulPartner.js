/**
 * useSoulPartner Hook
 *
 * Custom hook for managing the user's personalized AI SoulPartner.
 * Handles loading, generating, saving, and the companion's Knowledge Base.
 *
 * The SoulPartner is generated from the user's SoulDNA (constitutional identity)
 * and evolves over time as it learns about the user through conversations.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code
 * December 15, 2024
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { generateSoulPartner } from '../data/soulPartnerGenerator';

/**
 * Template for the SoulPartner's Knowledge Base (what they learn about the user)
 */
const KB_TEMPLATE = {
  // What the SoulPartner has observed about the user
  observations: {
    emotionalPatterns: [],
    communicationPreferences: [],
    passionTopics: [],
    sensitiveAreas: [],
    growthEdges: []
  },

  // SoulPartner's internal notes
  internalNotes: [],

  // Recurring conversation themes
  recurringThemes: [],

  // What works well in conversations
  whatWorks: [],

  // Questions the SoulPartner is curious about
  openQuestions: [],

  // Meta
  version: "1.0",
  conversationCount: 0
};

/**
 * Custom hook for managing the AI SoulPartner
 * Now stores data per-profile (not per-user) so each profile has its own relationship metrics
 */
export function useSoulPartner(userProfile) {
  const { user } = useAuth();
  const [soulPartner, setSoulPartner] = useState(null);
  const [soulPartnerKB, setSoulPartnerKB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get profile ID for per-profile storage
  const profileId = userProfile?.id;

  /**
   * Load existing SoulPartner or generate new one from user's SoulDNA
   */
  const loadOrGenerateSoulPartner = useCallback(async () => {
    if (!user?.uid || !profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to load existing SoulPartner identity (per-profile)
      const identityRef = doc(db, 'profiles', profileId, 'companion', 'identity');
      const identitySnap = await getDoc(identityRef);

      if (identitySnap.exists()) {
        // Existing SoulPartner found
        const existingIdentity = identitySnap.data();
        setSoulPartner(existingIdentity);
        console.log('💫 Loaded existing SoulPartner:', existingIdentity.name);
      } else if (userProfile) {
        // Generate new SoulPartner from user's SoulDNA
        console.log('🌟 Generating new SoulPartner from user SoulDNA...');

        // Build user's SoulDNA from profile
        const userSoulDNA = buildSoulDNA(userProfile);

        // Generate complementary SoulPartner
        const newSoulPartner = generateSoulPartner(userSoulDNA, 'Soul Companion');

        // Save to Firestore
        await setDoc(identityRef, {
          ...newSoulPartner,
          createdAt: serverTimestamp(),
          needsNaming: true // Flag that user should name their companion
        });

        setSoulPartner(newSoulPartner);
        console.log('✨ Generated new SoulPartner:', newSoulPartner.constitutional);
      }

      // Load or initialize the SoulPartner's KB
      const kbRef = doc(db, 'profiles', profileId, 'companion', 'knowledge_base');
      const kbSnap = await getDoc(kbRef);

      if (kbSnap.exists()) {
        setSoulPartnerKB(kbSnap.data());
      } else {
        // Initialize empty KB
        const newKB = {
          ...KB_TEMPLATE,
          matchedUser: {
            uid: user.uid,
            name: userProfile?.name || userProfile?.profile?.name || 'Friend'
          },
          createdAt: serverTimestamp()
        };
        await setDoc(kbRef, newKB);
        setSoulPartnerKB(newKB);
      }

    } catch (err) {
      console.error('Error loading SoulPartner:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, profileId, userProfile]);

  /**
   * Name or rename the SoulPartner
   */
  const nameSoulPartner = useCallback(async (newName, pronouns = 'they/them') => {
    if (!profileId || !soulPartner) return;

    try {
      const identityRef = doc(db, 'profiles', profileId, 'companion', 'identity');

      await updateDoc(identityRef, {
        name: newName,
        pronouns,
        needsNaming: false,
        updatedAt: serverTimestamp()
      });

      setSoulPartner(prev => ({
        ...prev,
        name: newName,
        pronouns,
        needsNaming: false
      }));

      console.log('💫 SoulPartner named:', newName);
      return { success: true };

    } catch (err) {
      console.error('Error naming SoulPartner:', err);
      return { success: false, error: err.message };
    }
  }, [profileId, soulPartner]);

  /**
   * Update SoulPartner's KB with new learning
   */
  const addToKB = useCallback(async (category, data) => {
    if (!profileId) return;

    try {
      const kbRef = doc(db, 'profiles', profileId, 'companion', 'knowledge_base');

      // Get current KB
      const currentKB = soulPartnerKB || KB_TEMPLATE;

      // Add to appropriate category
      let updates = {};

      switch (category) {
        case 'observation':
          const observations = { ...currentKB.observations };
          const subCategory = data.category || 'emotionalPatterns';
          observations[subCategory] = [
            ...(observations[subCategory] || []),
            { ...data, addedAt: new Date().toISOString() }
          ];
          updates = { observations };
          break;

        case 'note':
          updates = {
            internalNotes: [
              ...(currentKB.internalNotes || []),
              { note: data.note, addedAt: new Date().toISOString() }
            ]
          };
          break;

        case 'whatWorks':
          updates = {
            whatWorks: [
              ...(currentKB.whatWorks || []),
              { ...data, addedAt: new Date().toISOString() }
            ]
          };
          break;

        case 'theme':
          updates = {
            recurringThemes: [
              ...(currentKB.recurringThemes || []),
              { theme: data.theme, addedAt: new Date().toISOString() }
            ]
          };
          break;

        case 'question':
          updates = {
            openQuestions: [
              ...(currentKB.openQuestions || []),
              { question: data.question, addedAt: new Date().toISOString() }
            ]
          };
          break;

        default:
          console.warn('Unknown KB category:', category);
          return;
      }

      await updateDoc(kbRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });

      // Update local state
      setSoulPartnerKB(prev => ({
        ...prev,
        ...updates
      }));

      console.log('📚 Added to SoulPartner KB:', category);

    } catch (err) {
      console.error('Error updating SoulPartner KB:', err);
    }
  }, [profileId, soulPartnerKB]);

  /**
   * Increment conversation count
   */
  const incrementConversationCount = useCallback(async () => {
    if (!profileId) return;

    try {
      const kbRef = doc(db, 'profiles', profileId, 'companion', 'knowledge_base');
      const newCount = (soulPartnerKB?.conversationCount || 0) + 1;

      await updateDoc(kbRef, {
        conversationCount: newCount,
        lastUpdated: serverTimestamp()
      });

      setSoulPartnerKB(prev => ({
        ...prev,
        conversationCount: newCount
      }));

    } catch (err) {
      console.error('Error incrementing conversation count:', err);
    }
  }, [profileId, soulPartnerKB?.conversationCount]);

  /**
   * Get formatted identity for API calls
   * This is what gets passed to the Cloud Function
   */
  const getIdentityForAPI = useCallback(() => {
    if (!soulPartner) return null;

    return {
      name: soulPartner.name,
      title: soulPartner.title,
      constitutional: {
        chineseZodiac: soulPartner.constitutional?.chineseZodiac?.fullSign,
        westernZodiac: `${soulPartner.constitutional?.westernZodiac?.sign} (${soulPartner.constitutional?.westernZodiac?.element})`,
        traits: [
          ...(soulPartner.constitutional?.chineseZodiac?.traits || []),
          ...(soulPartner.constitutional?.westernZodiac?.traits || [])
        ].slice(0, 5)
      },
      personality: soulPartner.personality?.traits || [],
      communicationStyle: soulPartner.communicationStyle || {},
      values: soulPartner.values || [],
      complementaryDynamic: soulPartner.constitutional?.complementaryDynamic
    };
  }, [soulPartner]);

  // Load on mount or when user/profile changes
  useEffect(() => {
    loadOrGenerateSoulPartner();
  }, [loadOrGenerateSoulPartner]);

  return {
    // State
    soulPartner,
    soulPartnerKB,
    loading,
    error,

    // Actions
    nameSoulPartner,
    addToKB,
    incrementConversationCount,
    reload: loadOrGenerateSoulPartner,

    // For API
    getIdentityForAPI,

    // Computed
    needsNaming: soulPartner?.needsNaming === true,
    hasKB: soulPartnerKB !== null,
    connectionStrength: calculateConnectionStrength(soulPartnerKB)
  };
}

/**
 * Build user's SoulDNA from their profile
 */
function buildSoulDNA(userProfile) {
  return {
    name: userProfile?.name || userProfile?.profile?.name,

    // Chinese Zodiac
    chineseZodiac: {
      animal: userProfile?.constitutional?.chinese?.animal ||
              userProfile?.chineseZodiac?.animal,
      element: userProfile?.constitutional?.chinese?.element ||
               userProfile?.chineseZodiac?.element,
      fullSign: userProfile?.constitutional?.chinese?.fullSign ||
                userProfile?.chineseZodiac?.fullSign
    },

    // Western Zodiac
    westernZodiac: {
      sign: userProfile?.constitutional?.western?.sun ||
            userProfile?.westernZodiac?.sign,
      element: userProfile?.constitutional?.western?.element ||
               userProfile?.westernZodiac?.element
    },

    // Constitutional
    constitutional: userProfile?.constitutional || userProfile?.constitutional_identity,

    // Personality
    mbti: userProfile?.personality?.mbti ||
          userProfile?.mbti,

    // Profile reference
    profile: userProfile?.profile
  };
}

/**
 * Calculate connection strength from KB data
 */
function calculateConnectionStrength(kb) {
  if (!kb) return 0;

  const conversationPoints = Math.min((kb.conversationCount || 0) * 10, 40);

  const observationCount =
    (kb.observations?.emotionalPatterns?.length || 0) +
    (kb.observations?.communicationPreferences?.length || 0) +
    (kb.observations?.passionTopics?.length || 0);
  const observationPoints = Math.min(observationCount * 5, 30);

  const insightPoints = Math.min((kb.whatWorks?.length || 0) * 10, 30);

  return Math.min(100, conversationPoints + observationPoints + insightPoints);
}

export default useSoulPartner;
