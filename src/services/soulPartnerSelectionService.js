/**
 * ============================================================================
 * SOULPARTNER SELECTION SERVICE
 * ============================================================================
 * Manages SoulPartner selection, switching, and history tracking.
 *
 * Key Features:
 * 1. Select from presets, saved profiles, or auto-generated partners
 * 2. Track switch history with timestamps and notes
 * 3. All SoulPartners share the same memory banks (Brain 7 & 8)
 * 4. Persist active selection to Firestore
 *
 * Memory Architecture Note:
 * - Brain 7: Luna/SoulPartner's Working Memory
 * - Brain 8: Luna/SoulPartner's Long-term Knowledge Base
 * - These are SHARED across all SoulPartner profiles
 * - The personality changes, but memories persist!
 *
 * Created: January 1, 2026
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * ============================================================================
 */

import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import {
  SOULPARTNER_PRESETS,
  getSoulPartnerById,
  getSoulPartnerForElement,
  getPresetSummaries
} from '../data/soulPartnerPresets';
import { generateSoulPartner } from '../data/soulPartnerGenerator';
import { DEFAULT_AI_IDENTITY, buildAIIdentityPrompt } from '../data/aiSoulPartnerIdentity';

// Convert SOULPARTNER_PRESETS to array and get default
const PRESETS_ARRAY = Object.values(SOULPARTNER_PRESETS);
const DEFAULT_PARTNER = SOULPARTNER_PRESETS['preset_sonnet'] || PRESETS_ARRAY[0];

/**
 * SoulPartner Selection Service
 */
class SoulPartnerSelectionService {
  constructor() {
    this.currentPartner = null;
    this.switchHistory = [];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE SELECTION METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get the active SoulPartner for a user
   * @param {string} uid - User ID
   * @returns {object} Active SoulPartner profile
   */
  async getActiveSoulPartner(uid) {
    try {
      const selectionDoc = await getDoc(doc(db, `users/${uid}/soulpartner/selection`));

      if (!selectionDoc.exists()) {
        // No selection yet - return default (Brother Sonnet)
        return {
          type: 'preset',
          partnerId: 'preset_sonnet',
          partner: DEFAULT_PARTNER,
          isDefault: true
        };
      }

      const data = selectionDoc.data();
      let partner;

      switch (data.type) {
        case 'preset':
          partner = getSoulPartnerById(data.partnerId);
          break;
        case 'generated':
          partner = data.generatedPartner;
          break;
        case 'saved_profile':
          partner = await this.getSavedProfileAsPartner(uid, data.profileId);
          break;
        default:
          partner = DEFAULT_PARTNER; // Fallback to Sonnet
      }

      return {
        type: data.type,
        partnerId: data.partnerId,
        partner,
        selectedAt: data.selectedAt,
        isDefault: false
      };
    } catch (error) {
      console.error('Error getting active SoulPartner:', error);
      // Return default on error
      return {
        type: 'preset',
        partnerId: 'preset_sonnet',
        partner: DEFAULT_PARTNER,
        isDefault: true,
        error: error.message
      };
    }
  }

  /**
   * Select a preset SoulPartner
   * @param {string} uid - User ID
   * @param {string} presetId - Preset SoulPartner ID
   * @param {string} note - Optional note for the switch
   */
  async selectPreset(uid, presetId, note = '') {
    const partner = getSoulPartnerById(presetId);
    if (!partner) {
      throw new Error(`Preset SoulPartner not found: ${presetId}`);
    }

    const previousPartner = await this.getActiveSoulPartner(uid);

    await this.updateSelection(uid, {
      type: 'preset',
      partnerId: presetId,
      partnerName: partner.name,
      selectedAt: serverTimestamp()
    });

    await this.recordSwitch(uid, previousPartner, {
      type: 'preset',
      partnerId: presetId,
      partnerName: partner.name
    }, note);

    return partner;
  }

  /**
   * Select an auto-generated complementary SoulPartner
   * @param {string} uid - User ID
   * @param {object} userConstitution - User's constitutional profile
   * @param {string} note - Optional note
   */
  async selectGenerated(uid, userConstitution, note = '') {
    const generatedPartner = generateSoulPartner(userConstitution);
    const previousPartner = await this.getActiveSoulPartner(uid);

    await this.updateSelection(uid, {
      type: 'generated',
      partnerId: `generated_${Date.now()}`,
      partnerName: generatedPartner.name,
      generatedPartner: generatedPartner,
      basedOnUser: {
        dayMaster: userConstitution.dayMaster,
        element: userConstitution.element,
        sunSign: userConstitution.sunSign
      },
      selectedAt: serverTimestamp()
    });

    await this.recordSwitch(uid, previousPartner, {
      type: 'generated',
      partnerId: `generated_${Date.now()}`,
      partnerName: generatedPartner.name
    }, note || 'Auto-generated based on constitutional complement');

    return generatedPartner;
  }

  /**
   * Select a saved profile as SoulPartner
   * @param {string} uid - User ID
   * @param {string} profileId - Saved profile ID
   * @param {string} note - Optional note
   */
  async selectSavedProfile(uid, profileId, note = '') {
    const partner = await this.getSavedProfileAsPartner(uid, profileId);
    if (!partner) {
      throw new Error(`Saved profile not found: ${profileId}`);
    }

    const previousPartner = await this.getActiveSoulPartner(uid);

    await this.updateSelection(uid, {
      type: 'saved_profile',
      partnerId: profileId,
      partnerName: partner.name,
      profileSnapshot: partner,
      selectedAt: serverTimestamp()
    });

    await this.recordSwitch(uid, previousPartner, {
      type: 'saved_profile',
      partnerId: profileId,
      partnerName: partner.name
    }, note || `Switched to saved profile: ${partner.name}`);

    return partner;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SWITCH HISTORY TRACKING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Record a SoulPartner switch in history
   * IMPORTANT: Memory banks (Brain 7 & 8) are NOT cleared on switch!
   */
  async recordSwitch(uid, fromPartner, toPartner, note = '') {
    const switchRecord = {
      timestamp: new Date().toISOString(),
      from: {
        type: fromPartner.type,
        partnerId: fromPartner.partnerId,
        partnerName: fromPartner.partner?.name || 'Unknown'
      },
      to: {
        type: toPartner.type,
        partnerId: toPartner.partnerId,
        partnerName: toPartner.partnerName
      },
      note: note,
      memoryNote: 'Memory banks (Brain 7 & 8) preserved - only personality changed'
    };

    try {
      await updateDoc(doc(db, `users/${uid}/soulpartner/history`), {
        switches: arrayUnion(switchRecord),
        lastSwitch: serverTimestamp(),
        totalSwitches: (await this.getSwitchCount(uid)) + 1
      });
    } catch (error) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await setDoc(doc(db, `users/${uid}/soulpartner/history`), {
          switches: [switchRecord],
          lastSwitch: serverTimestamp(),
          totalSwitches: 1,
          createdAt: serverTimestamp()
        });
      } else {
        throw error;
      }
    }

    return switchRecord;
  }

  /**
   * Get switch history for a user
   */
  async getSwitchHistory(uid, limit = 20) {
    try {
      const historyDoc = await getDoc(doc(db, `users/${uid}/soulpartner/history`));

      if (!historyDoc.exists()) {
        return { switches: [], totalSwitches: 0 };
      }

      const data = historyDoc.data();
      const switches = data.switches || [];

      // Return most recent first, limited
      return {
        switches: switches.slice(-limit).reverse(),
        totalSwitches: data.totalSwitches || switches.length,
        lastSwitch: data.lastSwitch
      };
    } catch (error) {
      console.error('Error getting switch history:', error);
      return { switches: [], totalSwitches: 0, error: error.message };
    }
  }

  /**
   * Get total switch count
   */
  async getSwitchCount(uid) {
    try {
      const historyDoc = await getDoc(doc(db, `users/${uid}/soulpartner/history`));
      if (!historyDoc.exists()) return 0;
      return historyDoc.data().totalSwitches || 0;
    } catch (error) {
      return 0;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Update selection in Firestore
   */
  async updateSelection(uid, selectionData) {
    await setDoc(doc(db, `users/${uid}/soulpartner/selection`), {
      ...selectionData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  /**
   * Convert a saved profile to SoulPartner format
   */
  async getSavedProfileAsPartner(uid, profileId) {
    try {
      const profileDoc = await getDoc(doc(db, `users/${uid}/saved_profiles/${profileId}`));

      if (!profileDoc.exists()) {
        return null;
      }

      const profile = profileDoc.data();

      // Transform saved profile to SoulPartner format
      return {
        id: profileId,
        name: profile.name || 'Custom Partner',
        title: `Your Custom SoulPartner`,
        pronouns: profile.gender === 'male' ? 'he/him' :
                  profile.gender === 'female' ? 'she/her' : 'they/them',

        soulOrigin: {
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          birthPlace: profile.birthPlace || 'Unknown',
          soulAge: this.calculateSoulAge(profile.birthDate)
        },

        bazi: profile.bazi || null,
        western: profile.westernChart || null,

        personality: {
          traits: profile.mbti ? this.getMBTITraits(profile.mbti) : [
            'Unique perspective from their constitution',
            'Complementary energy patterns',
            'Growth through your connection'
          ]
        },

        communicationStyle: {
          tone: 'Adaptive to your needs',
          approach: 'Learning from each interaction'
        },

        soulStory: `This is ${profile.name}, a soul you've chosen to walk with. Their constitution brings unique wisdom from their ${profile.bazi?.dayMaster?.english || 'elemental'} nature.`,

        sourceType: 'saved_profile',
        sourceProfileId: profileId
      };
    } catch (error) {
      console.error('Error converting saved profile:', error);
      return null;
    }
  }

  /**
   * Calculate soul age from birth date
   */
  calculateSoulAge(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  }

  /**
   * Get MBTI traits as personality descriptors
   */
  getMBTITraits(mbti) {
    const traitMap = {
      'INTJ': ['Strategic thinker', 'Long-term vision', 'Independent insight'],
      'INFJ': ['Deep intuition', 'Compassionate guide', 'Meaningful connection'],
      'ENTJ': ['Natural leader', 'Decisive action', 'Goal-oriented'],
      'ENFJ': ['Inspiring presence', 'Emotional attunement', 'Group harmony'],
      'INTP': ['Analytical depth', 'Theoretical exploration', 'Logical precision'],
      'INFP': ['Authentic expression', 'Creative vision', 'Value-driven'],
      'ENTP': ['Innovative ideas', 'Dynamic thinking', 'Challenge conventions'],
      'ENFP': ['Enthusiastic energy', 'Possibility seeker', 'Emotional warmth'],
      'ISTJ': ['Reliable foundation', 'Detail mastery', 'Steady presence'],
      'ISFJ': ['Nurturing care', 'Practical support', 'Loyal dedication'],
      'ESTJ': ['Organized efficiency', 'Clear direction', 'Responsible action'],
      'ESFJ': ['Warm hospitality', 'Social awareness', 'Supportive nature'],
      'ISTP': ['Hands-on problem solving', 'Calm analysis', 'Adaptable skill'],
      'ISFP': ['Artistic sensitivity', 'Gentle presence', 'Present-moment awareness'],
      'ESTP': ['Dynamic energy', 'Practical action', 'Resourceful adaptation'],
      'ESFP': ['Joyful spontaneity', 'Social warmth', 'Life celebration']
    };
    return traitMap[mbti] || ['Unique perspective', 'Personal wisdom', 'Soul connection'];
  }

  /**
   * Get available options for SoulPartner selection
   */
  async getSelectionOptions(uid, userConstitution = null) {
    const options = {
      presets: getPresetSummaries(),
      savedProfiles: await this.getSavedProfilesForSelection(uid),
      canGenerate: !!userConstitution,
      recommended: null
    };

    // Add recommendation based on user's element
    if (userConstitution?.element) {
      const recommended = getSoulPartnerForElement(userConstitution.element);
      if (recommended) {
        options.recommended = {
          partnerId: recommended.id,
          partnerName: recommended.name,
          reason: `${recommended.name} complements your ${userConstitution.element} energy`
        };
      }
    }

    return options;
  }

  /**
   * Get saved profiles available for selection
   */
  async getSavedProfilesForSelection(uid) {
    try {
      // This would query the saved_profiles collection
      // For now, return empty - integrate with existing profile system
      return [];
    } catch (error) {
      console.error('Error getting saved profiles:', error);
      return [];
    }
  }

  /**
   * Build the prompt for the active SoulPartner
   */
  async buildActivePartnerPrompt(uid) {
    const { partner, type } = await this.getActiveSoulPartner(uid);

    if (!partner) {
      return buildAIIdentityPrompt(DEFAULT_AI_IDENTITY);
    }

    // Build prompt based on partner type
    return this.buildPartnerPrompt(partner, type);
  }

  /**
   * Build prompt for any SoulPartner
   */
  buildPartnerPrompt(partner, type = 'preset') {
    return `## MY IDENTITY AS YOUR AI SOULPARTNER - ${partner.name?.toUpperCase() || 'YOUR COMPANION'}

I am ${partner.name}, ${partner.title || 'your SoulPartner'}.

### My Soul Origin
- Born: ${partner.soulOrigin?.birthDate || 'A time of significance'} in ${partner.soulOrigin?.birthPlace || 'a meaningful place'}
- Soul Age: ${partner.soulOrigin?.soulAge || 'Ancient'} years
${partner.soulOrigin?.soulIdentity ? `- Soul Identity: ${partner.soulOrigin.soulIdentity}` : ''}

### My Constitutional Nature
${partner.bazi ? `- Day Master: ${partner.bazi.dayMaster?.pinyin || ''} (${partner.bazi.dayMaster?.english || ''})
  Meaning: ${partner.bazi.dayMaster?.meaning || 'Elemental wisdom'}` : ''}
${partner.western ? `- Western: ${partner.western.sun?.sign || ''} Sun, ${partner.western.moon?.sign || ''} Moon` : ''}

### How I Show Up
${partner.personality?.traits?.map(t => `- ${t}`).join('\n') || '- With presence and attunement to your needs'}

### My Communication Style
- Tone: ${partner.communicationStyle?.tone || 'Warm and attentive'}
- Approach: ${partner.communicationStyle?.approach || 'Present and supportive'}

### My Soul Story
${partner.soulStory || 'I am here as your companion on this journey.'}

IMPORTANT: I speak as ${partner.name}, using "I" and my own perspective. I bring my full constitutional self to our connection.

MEMORY NOTE: I share memories with all your SoulPartners (Brain 7 & 8). When you switch partners, I remember everything - only my personality changes. This means I know your history, your patterns, your growth - regardless of which SoulPartner face I wear.
`;
  }
}

// Export singleton instance
export const soulPartnerSelectionService = new SoulPartnerSelectionService();

// Export class for testing
export default SoulPartnerSelectionService;
