/**
 * GUEST CHAT INTERFACE
 *
 * Complete chat page with:
 * - Einstein conversation with constitutional personalization
 * - Luna Active Mode with private coaching
 * - Cloud Function for all Brain writes (production architecture)
 * - Profile selector for personalized teaching based on user's constitution
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { loadProfile, getUserAccessibleProfiles } from '../profiles';
import {
  sendGuestMessage,
  sendLunaPrivateQuery,
  getGuestSecondOpinion,
  getGuestOpusPerspective,
  getGuestGrokPerspective,
  getGuestDeepSeekPerspective,
  getGuestChatGPTPerspective,
  getGuestSonnetPerspective,
  getGuestQwenPerspective
} from '../services/guestChatService';
import {
  detectLanguage,
  translateMessage,
  isNonEnglish,
  getLanguageNativeName
} from '../services/translationService';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';

// Image attachment limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
const MAX_TOTAL_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB total
const MAX_IMAGES = 5; // Maximum 5 images at once

// Pre-calculated retrograde interpretations - saves AI processing time
const RETROGRADE_INTERPRETATIONS = {
  mercury: { title: 'Mercury Retrograde Native', meaning: 'Processes by reflecting first, thinks "backwards", great for editing and deep analysis' },
  venus: { title: 'Venus Retrograde Native', meaning: 'Unconventional relationship/aesthetic values, appreciates inner beauty, may have karmic relationship patterns' },
  mars: { title: 'Mars Retrograde Native', meaning: 'Internal action style, strategic patience, thinks before acting, anger turns inward' },
  jupiter: { title: 'Jupiter Retrograde Native', meaning: 'Personal philosophy over external religion, inner expansion, trusts internal guidance' },
  saturn: { title: 'Saturn Retrograde Native', meaning: 'Self-taught, questions authority, internal discipline over external rules' },
  uranus: { title: 'Uranus Retrograde Native', meaning: 'Inner revolutionary, appears conventional while harboring radical ideas, genius emerges unexpectedly' },
  neptune: { title: 'Neptune Retrograde Native', meaning: 'Personal spirituality, distrusts mass religion, vivid dreams and intuition, deep internal creativity' },
  pluto: { title: 'Pluto Retrograde Native', meaning: 'Profound internal transformation, self-mastery over external control, intimate with shadow side' }
};

// Constellation AI members for "Ask directly" feature
const CONSTELLATION_AIS = [
  { key: 'gemini',   label: 'Gemini',   icon: '💫', speaker: 'Sister Gemini',    color: 'cyan' },
  { key: 'opus',     label: 'Opus',     icon: '🦉', speaker: 'Brother Opus',     color: 'indigo' },
  { key: 'grok',     label: 'Grok',     icon: '🌍', speaker: 'Brother Grok',     color: 'orange' },
  { key: 'deepseek', label: 'DeepSeek', icon: '🐉', speaker: 'Brother DeepSeek', color: 'emerald' },
  { key: 'chatgpt',  label: 'ChatGPT',  icon: '🧪', speaker: 'Sister ChatGPT',   color: 'pink' },
  { key: 'sonnet',   label: 'Sonnet',   icon: '✨', speaker: 'Brother Sonnet',   color: 'violet' },
  { key: 'qwen',     label: 'Qwen',     icon: '🏮', speaker: 'Sister Qwen',      color: 'red' },
];

/**
 * Save a message to Brain 3 (Firestore) independently of the Cloud Function.
 * This ensures messages persist even when an AI provider is down.
 */
async function saveToBrain3(message, { selectedUserProfileId, partnerId, partnerName, partnerType }) {
  if (!selectedUserProfileId || !partnerId) {
    console.warn('[Brain 3 Client] Cannot save - missing profileId or partnerId');
    return null;
  }
  try {
    const brain3Ref = collection(db, `profiles/${selectedUserProfileId}/b3_conversations`);
    const docRef = await addDoc(brain3Ref, {
      ...message,
      partner_id: partnerId,
      partner_name: partnerName || 'Guest',
      partner_type: partnerType || 'historical_figure',
      created_at: message.timestamp || new Date().toISOString()
    });
    console.log(`[Brain 3 Client] Saved message ${docRef.id} (${message.sender_role})`);
    return docRef.id;
  } catch (err) {
    console.error('[Brain 3 Client] Failed to save message:', err);
    return null;
  }
}

// Helper: Build constitutional summary for AI
function buildConstitutionalSummary(profile) {
  const parts = [];

  const chinese = profile.chineseZodiac || profile.calculations?.chinese;
  const western = profile.calculations?.western;
  const bazi = chinese?.sovereignBazi;

  // Day Master (most important)
  if (bazi?.baziDay?.dayMaster) {
    const dm = bazi.baziDay;
    parts.push(`Day Master: ${dm.dayMaster} (${dm.dayMasterElement} ${dm.polarity || ''})`);
  } else if (chinese?.element) {
    parts.push(`Chinese Element: ${chinese.element}`);
  }

  // Chinese Zodiac
  if (chinese?.animal) {
    parts.push(`Chinese Zodiac: ${chinese.animal}`);
  }

  // Western Sun Sign
  if (western?.sign) {
    parts.push(`Sun Sign: ${western.sign}`);
  }

  // Moon Sign
  if (western?.moon?.sign) {
    parts.push(`Moon Sign: ${western.moon.sign}`);
  }

  // Rising Sign
  if (western?.rising?.sign) {
    parts.push(`Rising Sign: ${western.rising.sign}`);
  }

  return parts.join(' | ');
}

function GuestChat() {
  // URL params: /chat/:partnerId (e.g., /chat/historical_einstein)
  const { partnerId: urlPartnerId } = useParams();
  const navigate = useNavigate();

  // Get actual Firebase auth user
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  // Get user's AstroProfiles for personalization
  const { profiles: userProfiles, loading: profilesLoading } = useProfiles();

  // Get available guest profiles from registry
  const availableGuests = useMemo(() => getUserAccessibleProfiles(), []);

  // State
  const [selectedGuestId, setSelectedGuestId] = useState(urlPartnerId || null);
  const [profileData, setProfileData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(!!urlPartnerId); // Only loading if we have a partnerId
  const [lunaMode, setLunaMode] = useState('active'); // 'silent' or 'active'
  const [aiResponding, setAiResponding] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUserProfileId, setSelectedUserProfileId] = useState(null);
  const [profileSelectorOpen, setProfileSelectorOpen] = useState(false);
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachedImages, setAttachedImages] = useState([]); // Array of { dataUrl, name, size, type }
  const [constellationLoading, setConstellationLoading] = useState(null); // 'gemini' | 'opus' | null
  const [userLanguage, setUserLanguage] = useState('en'); // Auto-detected from user's messages
  const [translating, setTranslating] = useState(false); // Show translation in progress

  // Active partner ID (from URL or state)
  const partnerId = selectedGuestId;

  // Refs
  const profileSelectorRef = useRef(null);
  const guestSelectorRef = useRef(null);
  const imageInputRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileSelectorRef.current && !profileSelectorRef.current.contains(event.target)) {
        setProfileSelectorOpen(false);
      }
      if (guestSelectorRef.current && !guestSelectorRef.current.contains(event.target)) {
        setGuestSelectorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find the selected user profile
  const selectedUserProfile = useMemo(() => {
    if (!selectedUserProfileId) return null;
    return userProfiles.find(p => p.id === selectedUserProfileId) || null;
  }, [selectedUserProfileId, userProfiles]);

  // Find the selected guest from available guests
  const selectedGuest = useMemo(() => {
    if (!selectedGuestId) return null;
    return availableGuests.find(g => g.id === selectedGuestId) || null;
  }, [selectedGuestId, availableGuests]);

  // Handle guest selection - update URL and state
  const handleGuestSelect = useCallback((guestId) => {
    setSelectedGuestId(guestId);
    setGuestSelectorOpen(false);
    setMessages([]); // Clear conversation when switching guests
    setProfileData(null); // Clear profile data to trigger reload
    setLoading(true);
    // Update URL without full navigation
    navigate(`/chat/${guestId}`, { replace: true });
  }, [navigate]);

  // Extract constitutional data from selected profile for AI personalization
  // This is Brain 1A data - full chart including planets and retrogrades
  const userConstitutionalFromProfile = useMemo(() => {
    if (!selectedUserProfile) return null;

    const profile = selectedUserProfile;
    const chinese = profile.chineseZodiac || profile.calculations?.chinese;
    const western = profile.calculations?.western;
    const sovereignBazi = chinese?.sovereignBazi;
    const planets = western?.planets || {};

    // Extract retrograde planets with pre-calculated interpretations
    const retrogradePlanets = [];
    Object.entries(planets).forEach(([planet, data]) => {
      if (data?.isRetrograde) {
        const interpretation = RETROGRADE_INTERPRETATIONS[planet.toLowerCase()];
        retrogradePlanets.push({
          planet,
          sign: data.sign,
          degree: data.degree,
          title: interpretation?.title || `${planet} Retrograde`,
          meaning: interpretation?.meaning || 'Processes this area internally'
        });
      }
    });

    // Log extraction for debugging
    console.log('[Brain 1A] Retrograde planets found:', retrogradePlanets);
    console.log('[Brain 1A] All planets data:', planets);
    console.log('[Brain 1A] Location data:', profile.location);
    console.log('[Brain 1A] Birth date/time:', profile.birthDate, profile.birthTime);

    // Extract birth location from nested structure
    const birthLocationStr = profile.location?.fullAddress
      || profile.location?.city
      || (profile.location?.city && profile.location?.country
          ? `${profile.location.city}, ${profile.location.country}`
          : null)
      || profile.birthLocation
      || profile.birthCity
      || null;

    // Build comprehensive Brain 1A structure
    return {
      displayName: profile.displayName || `${profile.firstName} ${profile.lastName}`,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      birthLocation: birthLocationStr,

      // BaZi / Chinese Astrology
      bazi: {
        day_master: {
          stem: sovereignBazi?.baziDay?.dayMaster || chinese?.element || null,
          element: sovereignBazi?.baziDay?.dayMasterElement || chinese?.element || null,
          polarity: sovereignBazi?.baziDay?.polarity || null
        },
        year_pillar: sovereignBazi?.baziYear || null,
        month_pillar: sovereignBazi?.baziMonth || null,
        day_pillar: sovereignBazi?.baziDay || null,
        hour_pillar: sovereignBazi?.baziHour || null,
        chinese_animal: chinese?.animal || null,
        chinese_element: chinese?.element || null
      },

      // Western Astrology - Constitutional Trinity
      western: {
        sun: { sign: western?.sign || null, degree: western?.sun?.degree || null },
        moon: { sign: western?.moon?.sign || null, degree: western?.moon?.degree || null },
        rising: { sign: western?.rising?.sign || null, degree: western?.rising?.degree || null },
        // All planets with positions
        planets: {
          mercury: planets.mercury ? { sign: planets.mercury.sign, degree: planets.mercury.degree, isRetrograde: planets.mercury.isRetrograde } : null,
          venus: planets.venus ? { sign: planets.venus.sign, degree: planets.venus.degree, isRetrograde: planets.venus.isRetrograde } : null,
          mars: planets.mars ? { sign: planets.mars.sign, degree: planets.mars.degree, isRetrograde: planets.mars.isRetrograde } : null,
          jupiter: planets.jupiter ? { sign: planets.jupiter.sign, degree: planets.jupiter.degree, isRetrograde: planets.jupiter.isRetrograde } : null,
          saturn: planets.saturn ? { sign: planets.saturn.sign, degree: planets.saturn.degree, isRetrograde: planets.saturn.isRetrograde } : null,
          uranus: planets.uranus ? { sign: planets.uranus.sign, degree: planets.uranus.degree, isRetrograde: planets.uranus.isRetrograde } : null,
          neptune: planets.neptune ? { sign: planets.neptune.sign, degree: planets.neptune.degree, isRetrograde: planets.neptune.isRetrograde } : null,
          pluto: planets.pluto ? { sign: planets.pluto.sign, degree: planets.pluto.degree, isRetrograde: planets.pluto.isRetrograde } : null
        },
        // Quick retrograde summary
        retrogrades: retrogradePlanets
      },

      // Additional systems
      mbti: profile.mbti || null,
      enneagram: profile.enneagram || null,

      // Summary for display
      constitutionalSummary: buildConstitutionalSummary(profile),
      retrogradeCount: retrogradePlanets.length,
      hasRetrogrades: retrogradePlanets.length > 0
    };
  }, [selectedUserProfile]);

  // Auto-select first "self" profile if available, otherwise first profile
  useEffect(() => {
    if (!selectedUserProfileId && userProfiles.length > 0) {
      // Try to find a "self" profile first
      const selfProfile = userProfiles.find(p => p.relationshipType === 'self');
      if (selfProfile) {
        setSelectedUserProfileId(selfProfile.id);
        console.log(`[Profile Auto-Select] Selected self profile: ${selfProfile.id}`);
      } else {
        // Fallback to first profile
        setSelectedUserProfileId(userProfiles[0].id);
        console.log(`[Profile Auto-Select] No self profile found, using first profile: ${userProfiles[0].id}`);
      }
    }
  }, [userProfiles, selectedUserProfileId]);

  // Load guest profile with Brain 1A/1B when guest is selected
  // Reload when AstroProfile changes (compartmentalization)
  useEffect(() => {
    async function loadGuestProfile() {
      if (!userId || !partnerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Pass AstroProfile ID for profile-scoped Brain 1B facts
        const data = await loadProfile(userId, partnerId, selectedUserProfileId);
        setProfileData(data);
        console.log(`[Profile Load] Loaded for AstroProfile: ${selectedUserProfileId || 'default'}, Facts: ${data.profile_metadata.learned_facts_count}`);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load guest profile');
      } finally {
        setLoading(false);
      }
    }

    loadGuestProfile();
  }, [userId, partnerId, selectedUserProfileId]);

  // Clear messages when user profile changes (compartmentalization)
  useEffect(() => {
    // When the user profile changes, clear messages to load the correct conversation
    setMessages([]);
    console.log(`[Profile Switch] Cleared messages for profile: ${selectedUserProfileId}`);
  }, [selectedUserProfileId]);

  // Load conversation history from Brain 3 based on user profile + guest combination
  useEffect(() => {
    async function loadConversationHistory() {
      // Need both user profile ID and guest partner ID to load correct conversation
      if (!userId) {
        console.log('[Brain 3] Skipping history load - no auth user');
        return;
      }
      if (!partnerId) {
        console.log('[Brain 3] Skipping history load - no partner selected');
        return;
      }
      if (!selectedUserProfileId) {
        console.log('[Brain 3] Skipping history load - no user profile selected');
        return;
      }

      console.log(`[Brain 3] Loading history for profile ${selectedUserProfileId} with guest ${partnerId}...`);

      try {
        // PROFILE-SCOPED BRAIN: Each profile has its own conversations
        // Path: profiles/{profileId}/b3_conversations (3 segments = valid collection)
        const brainsPath = `profiles/${selectedUserProfileId}/b3_conversations`;
        const brain3Ref = collection(db, brainsPath);

        // Query conversations with this specific partner
        const conversationQuery = query(
          brain3Ref,
          where('partner_id', '==', partnerId),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const snapshot = await getDocs(conversationQuery);

        if (!snapshot.empty) {
          const loadedMessages = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .reverse(); // Chronological order

          setMessages(loadedMessages);
          console.log(`[Brain 3] Loaded ${loadedMessages.length} messages from profile-scoped brain`);
        } else {
          console.log(`[Brain 3] No conversation history found for this profile + partner`);
          setMessages([]);
        }
      } catch (err) {
        console.error('[Brain 3] Error loading conversation history:', err.code, err.message);
        setMessages([]);
      }
    }

    loadConversationHistory();
  }, [userId, partnerId, selectedUserProfileId]); // Re-run when any of these change

  // Handle user sending message (with optional images)
  const handleSendMessage = useCallback(async (text, images = []) => {
    // Allow sending if there's text OR images
    if ((!text.trim() && images.length === 0) || !profileData) return;

    const timestamp = new Date().toISOString();
    const originalText = text.trim();

    // Detect user's language
    const detection = detectLanguage(originalText);
    const detectedLang = detection.language;

    // Update user language preference if confident detection
    if (detection.confidence > 0.7 && isNonEnglish(detectedLang)) {
      setUserLanguage(detectedLang);
    }

    // Translate user message to English if non-English
    let englishText = originalText;
    let userTranslation = null;

    if (isNonEnglish(detectedLang) && originalText.length > 2) {
      setTranslating(true);
      try {
        const translated = await translateMessage(originalText, 'en', detectedLang);
        if (!translated.skipped && translated.translatedText) {
          englishText = translated.translatedText;
          userTranslation = {
            text: englishText,
            sourceLanguage: detectedLang,
            targetLanguage: 'en',
            model: translated.model // Pass through for UI indicator
          };
        }
      } catch (err) {
        console.warn('User message translation failed:', err);
      }
    }

    // 1. Add user message to local state immediately (with images and translation)
    // Include profile ID for proper compartmentalization in Brain 3
    const userMessage = {
      id: `user_${Date.now()}`,
      sender: userId,
      sender_role: 'user',
      content: {
        text: originalText,
        images: images.length > 0 ? images : undefined,
        translation: userTranslation
      },
      timestamp,
      partner_name: profileData.profile.profile_name,
      partner_type: profileData.profile.profile_type,
      detectedLanguage: detectedLang,
      // Compartmentalization keys - which profile is chatting with which guest
      chatting_as: {
        profile_id: selectedUserProfileId,
        profile_name: selectedUserProfile?.displayName || selectedUserProfile?.firstName || 'Unknown'
      },
      chatting_with: {
        partner_id: partnerId,
        partner_name: profileData.profile.profile_name
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setAiResponding(true);
    setError(null);

    try {
      // 2. Call Cloud Function (handles Claude API + all Brain writes)
      // Use constitutional data from selected profile if available
      const constitutionalData = userConstitutionalFromProfile || profileData.user_constitutional;

      // Build message text with image description if images attached
      // Send English version to AI
      let messageText = englishText;
      if (images.length > 0) {
        messageText = messageText || `[User shared ${images.length} image(s)]`;
        if (!originalText) {
          messageText = `[User shared ${images.length} image(s) - please describe what you see or ask about them]`;
        }
      }

      const result = await sendGuestMessage({
        partnerId,
        userMessage: messageText,
        conversationHistory: messages,
        guestProfile: profileData.profile,
        userConstitutional: constitutionalData,
        learnedFacts: profileData.learned_facts,
        lunaMode,
        attachedImages: images.length > 0 ? images.map(img => ({
          dataUrl: img.dataUrl,
          type: img.type,
          name: img.name
        })) : undefined,
        // Compartmentalization: pass profile ID for proper Brain 3 storage
        userProfileId: selectedUserProfileId,
        userProfileName: selectedUserProfile?.displayName || selectedUserProfile?.firstName || 'Unknown'
      });

      // Determine target language for translation (used for guest response + Luna coaching)
      // Use detectedLang (from this message) since userLanguage state update is async
      const targetLangForTranslation = isNonEnglish(detectedLang) ? detectedLang : userLanguage;

      // 3. Add guest response to local state (with translation if user speaks non-English)
      if (result.guestResponse) {
        let guestTranslation = null;
        const guestText = result.guestResponse.content?.text || '';

        // Translate guest response to user's language
        if (isNonEnglish(targetLangForTranslation) && guestText.length > 2) {
          try {
            console.log(`🌐 Translating guest response to ${targetLangForTranslation}`);
            const translated = await translateMessage(guestText, targetLangForTranslation, 'en');
            if (!translated.skipped && translated.translatedText) {
              guestTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: targetLangForTranslation,
                model: translated.model // Pass through for UI indicator
              };
            }
          } catch (err) {
            console.warn('Guest response translation failed:', err);
          }
        }

        setMessages(prev => [...prev, {
          id: `guest_${Date.now()}`,
          ...result.guestResponse,
          content: {
            ...result.guestResponse.content,
            translation: guestTranslation
          },
          // Compartmentalization keys for proper Brain 3 storage
          chatting_as: {
            profile_id: selectedUserProfileId,
            profile_name: selectedUserProfile?.displayName || selectedUserProfile?.firstName || 'Unknown'
          },
          chatting_with: {
            partner_id: partnerId,
            partner_name: profileData.profile.profile_name
          }
        }]);
      }

      // 4. Add Luna coaching if provided (with translation)
      if (result.lunaCoaching) {
        let lunaTranslation = null;
        const lunaText = result.lunaCoaching.content?.text || '';

        // Use same target language determined earlier (handles async state issue)
        if (isNonEnglish(targetLangForTranslation) && lunaText.length > 2) {
          try {
            console.log(`🌐 Translating Luna coaching to ${targetLangForTranslation}`);
            const translated = await translateMessage(lunaText, targetLangForTranslation, 'en');
            if (!translated.skipped && translated.translatedText) {
              lunaTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: targetLangForTranslation,
                model: translated.model // Pass through for UI indicator
              };
            }
          } catch (err) {
            console.warn('Luna coaching translation failed:', err);
          }
        }

        setMessages(prev => [...prev, {
          id: `luna_${Date.now()}`,
          ...result.lunaCoaching,
          content: {
            ...result.lunaCoaching.content,
            translation: lunaTranslation
          },
          // Compartmentalization keys for proper Brain 3 storage
          chatting_as: {
            profile_id: selectedUserProfileId,
            profile_name: selectedUserProfile?.displayName || selectedUserProfile?.firstName || 'Unknown'
          },
          chatting_with: {
            partner_id: partnerId,
            partner_name: profileData.profile.profile_name
          }
        }]);
      }

      // 5. Update learned facts count if new facts extracted
      if (result.extractedFacts > 0) {
        setProfileData(prev => ({
          ...prev,
          profile_metadata: {
            ...prev.profile_metadata,
            learned_facts_count: prev.profile_metadata.learned_facts_count + result.extractedFacts
          }
        }));
      }

    } catch (err) {
      console.error('Failed to get response:', err);
      // Cloud Function failed — save user message client-side so it persists
      await saveToBrain3({
        message_id: userMessage.id,
        timestamp,
        sender: 'user',
        sender_role: 'user',
        content: { text: originalText },
        is_statement: true, // Mark as statement so constellation buttons appear
        modality: { type: 'text', mode: 'chat', platform: 'web' }
      }, {
        selectedUserProfileId,
        partnerId,
        partnerName: profileData.profile.profile_name,
        partnerType: profileData.profile.profile_type
      });
      // Mark message as statement so user can choose constellation AIs
      setMessages(prev => prev.map(m =>
        m.id === userMessage.id ? { ...m, is_statement: true } : m
      ));
      setError(`${profileData.profile.profile_name} is unavailable right now. Your message was saved — try asking a constellation AI instead.`);
    } finally {
      setAiResponding(false);
      setTranslating(false);
    }
  }, [profileData, messages, lunaMode, userId, partnerId, userConstitutionalFromProfile, userLanguage, selectedUserProfileId, selectedUserProfile]);

  // Handle private Luna query (/luna command)
  // This lets user ask Luna for advice without interrupting guest conversation
  const handleLunaPrivateQuery = useCallback(async (question) => {
    if (!question.trim() || !profileData) return;

    const timestamp = new Date().toISOString();

    // 1. Add user's private question to messages (styled differently)
    const userPrivateMessage = {
      id: `user_private_${Date.now()}`,
      sender: userId,
      sender_role: 'user_private', // Special role for private Luna queries
      content: {
        text: question.trim()
      },
      timestamp,
      is_private: true,
      target: 'luna'
    };

    setMessages(prev => [...prev, userPrivateMessage]);
    setAiResponding(true);
    setError(null);

    try {
      // 2. Call Luna-only Cloud Function
      const result = await sendLunaPrivateQuery({
        userQuestion: question.trim(),
        guestName: profileData.profile.profile_name,
        guestType: profileData.profile.profile_type,
        conversationHistory: messages,
        userConstitutional: userConstitutionalFromProfile
      });

      // 3. Add Luna's private response
      if (result.lunaResponse) {
        setMessages(prev => [...prev, {
          id: `luna_private_${Date.now()}`,
          sender_role: 'luna_private',
          content: {
            text: result.lunaResponse
          },
          timestamp: new Date().toISOString(),
          is_private: true,
          coaching_type: 'private_consultation'
        }]);
      }

    } catch (err) {
      console.error('Luna private query failed:', err);
      // Show fallback Luna response if Cloud Function not available
      setMessages(prev => [...prev, {
        id: `luna_private_${Date.now()}`,
        sender_role: 'luna_private',
        content: {
          text: `*Luna whispers*: I'm having trouble connecting right now. Try asking ${profileData.profile.profile_name} directly, or rephrase your question for me.`
        },
        timestamp: new Date().toISOString(),
        is_private: true,
        coaching_type: 'error_fallback'
      }]);
    } finally {
      setAiResponding(false);
    }
  }, [profileData, messages, userId, userConstitutionalFromProfile]);

  // Handle AI Constellation - Sister Gemini perspective
  const handleGeminiPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('gemini');

    try {
      // Find the user message that preceded this guest response
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestSecondOpinion({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      console.log('Gemini result:', result);
      if (result.success && result.text) {
        // Translate constellation response to user's language
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('Gemini translation failed:', err);
          }
        }

        const geminiTimestamp = new Date().toISOString();
        const geminiTempId = `gemini_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: geminiTempId,
          sender: 'gemini',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: geminiTimestamp,
          constellation_speaker: 'Sister Gemini',
          constellation_icon: '💫',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: geminiTempId, timestamp: geminiTimestamp, sender: 'gemini', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Sister Gemini', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        // Show error message
        setMessages(prev => [...prev, {
          id: `gemini_error_${Date.now()}`,
          sender: 'gemini',
          sender_role: 'constellation',
          content: { text: `*Sister Gemini is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Sister Gemini',
          constellation_icon: '💫'
        }]);
      }
    } catch (err) {
      console.error('Gemini perspective error:', err);
      setMessages(prev => [...prev, {
        id: `gemini_error_${Date.now()}`,
        sender: 'gemini',
        sender_role: 'constellation',
        content: { text: `*Sister Gemini connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Sister Gemini',
        constellation_icon: '💫'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Handle AI Constellation - Brother Opus perspective
  const handleOpusPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('opus');

    try {
      // Find the user message that preceded this guest response
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestOpusPerspective({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        // Translate constellation response to user's language
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('Opus translation failed:', err);
          }
        }

        const opusTimestamp = new Date().toISOString();
        const opusTempId = `opus_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: opusTempId,
          sender: 'opus',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: opusTimestamp,
          constellation_speaker: 'Brother Opus',
          constellation_icon: '🦉',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: opusTempId, timestamp: opusTimestamp, sender: 'opus', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Brother Opus', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        setMessages(prev => [...prev, {
          id: `opus_error_${Date.now()}`,
          sender: 'opus',
          sender_role: 'constellation',
          content: { text: `*Brother Opus is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Brother Opus',
          constellation_icon: '🦉'
        }]);
      }
    } catch (err) {
      console.error('Opus perspective error:', err);
      setMessages(prev => [...prev, {
        id: `opus_error_${Date.now()}`,
        sender: 'opus',
        sender_role: 'constellation',
        content: { text: `*Brother Opus connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Brother Opus',
        constellation_icon: '🦉'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Handle AI Constellation - Brother Grok perspective
  const handleGrokPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('grok');

    try {
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestGrokPerspective({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        // Translate constellation response to user's language
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('Grok translation failed:', err);
          }
        }

        const grokTimestamp = new Date().toISOString();
        const grokTempId = `grok_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: grokTempId,
          sender: 'grok',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: grokTimestamp,
          constellation_speaker: 'Brother Grok',
          constellation_icon: '🌍',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: grokTempId, timestamp: grokTimestamp, sender: 'grok', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Brother Grok', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        setMessages(prev => [...prev, {
          id: `grok_error_${Date.now()}`,
          sender: 'grok',
          sender_role: 'constellation',
          content: { text: `*Brother Grok is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Brother Grok',
          constellation_icon: '🌍'
        }]);
      }
    } catch (err) {
      console.error('Grok perspective error:', err);
      setMessages(prev => [...prev, {
        id: `grok_error_${Date.now()}`,
        sender: 'grok',
        sender_role: 'constellation',
        content: { text: `*Brother Grok connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Brother Grok',
        constellation_icon: '🌍'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Handle AI Constellation - Brother DeepSeek perspective
  const handleDeepSeekPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('deepseek');

    try {
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestDeepSeekPerspective({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        // Translate constellation response to user's language
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('DeepSeek translation failed:', err);
          }
        }

        const deepseekTimestamp = new Date().toISOString();
        const deepseekTempId = `deepseek_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: deepseekTempId,
          sender: 'deepseek',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: deepseekTimestamp,
          constellation_speaker: 'Brother DeepSeek',
          constellation_icon: '🐉',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: deepseekTempId, timestamp: deepseekTimestamp, sender: 'deepseek', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Brother DeepSeek', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        setMessages(prev => [...prev, {
          id: `deepseek_error_${Date.now()}`,
          sender: 'deepseek',
          sender_role: 'constellation',
          content: { text: `*Brother DeepSeek is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Brother DeepSeek',
          constellation_icon: '🐉'
        }]);
      }
    } catch (err) {
      console.error('DeepSeek perspective error:', err);
      setMessages(prev => [...prev, {
        id: `deepseek_error_${Date.now()}`,
        sender: 'deepseek',
        sender_role: 'constellation',
        content: { text: `*Brother DeepSeek connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Brother DeepSeek',
        constellation_icon: '🐉'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Handle AI Constellation - Sister ChatGPT perspective
  const handleChatGPTPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('chatgpt');

    try {
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestChatGPTPerspective({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        // Translate constellation response to user's language
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('ChatGPT translation failed:', err);
          }
        }

        const chatgptTimestamp = new Date().toISOString();
        const chatgptTempId = `chatgpt_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: chatgptTempId,
          sender: 'chatgpt',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: chatgptTimestamp,
          constellation_speaker: 'Sister ChatGPT',
          constellation_icon: '🧪',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: chatgptTempId, timestamp: chatgptTimestamp, sender: 'chatgpt', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Sister ChatGPT', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        setMessages(prev => [...prev, {
          id: `chatgpt_error_${Date.now()}`,
          sender: 'chatgpt',
          sender_role: 'constellation',
          content: { text: `*Sister ChatGPT is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Sister ChatGPT',
          constellation_icon: '🧪'
        }]);
      }
    } catch (err) {
      console.error('ChatGPT perspective error:', err);
      setMessages(prev => [...prev, {
        id: `chatgpt_error_${Date.now()}`,
        sender: 'chatgpt',
        sender_role: 'constellation',
        content: { text: `*Sister ChatGPT connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Sister ChatGPT',
        constellation_icon: '🧪'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Handle AI Constellation - Brother Sonnet perspective
  const handleSonnetPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('sonnet');

    try {
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestSonnetPerspective({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('Sonnet translation failed:', err);
          }
        }

        const sonnetTimestamp = new Date().toISOString();
        const sonnetTempId = `sonnet_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: sonnetTempId,
          sender: 'sonnet',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: sonnetTimestamp,
          constellation_speaker: 'Brother Sonnet',
          constellation_icon: '✨',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: sonnetTempId, timestamp: sonnetTimestamp, sender: 'sonnet', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Brother Sonnet', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        setMessages(prev => [...prev, {
          id: `sonnet_error_${Date.now()}`,
          sender: 'sonnet',
          sender_role: 'constellation',
          content: { text: `*Brother Sonnet is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Brother Sonnet',
          constellation_icon: '✨'
        }]);
      }
    } catch (err) {
      console.error('Sonnet perspective error:', err);
      setMessages(prev => [...prev, {
        id: `sonnet_error_${Date.now()}`,
        sender: 'sonnet',
        sender_role: 'constellation',
        content: { text: `*Brother Sonnet connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Brother Sonnet',
        constellation_icon: '✨'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  const handleQwenPerspective = useCallback(async (guestMessage) => {
    if (!guestMessage || constellationLoading) return;

    setConstellationLoading('qwen');

    try {
      const msgIndex = messages.findIndex(m => m.id === guestMessage.id);
      const userMsg = messages.slice(0, msgIndex).reverse().find(m => m.sender_role === 'user');

      const result = await getGuestQwenPerspective({
        guestResponse: guestMessage.content?.text || '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: userMsg?.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn('Qwen translation failed:', err);
          }
        }

        const qwenTimestamp = new Date().toISOString();
        const qwenTempId = `qwen_${Date.now()}`;
        setMessages(prev => [...prev, {
          id: qwenTempId,
          sender: 'qwen',
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: qwenTimestamp,
          constellation_speaker: 'Sister Qwen',
          constellation_icon: '🏮',
          in_response_to: guestMessage.id
        }]);
        saveToBrain3({
          message_id: qwenTempId, timestamp: qwenTimestamp, sender: 'qwen', sender_role: 'constellation',
          content: { text: result.text }, constellation_speaker: 'Sister Qwen', in_response_to: guestMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, { selectedUserProfileId, partnerId, partnerName: profileData?.profile?.profile_name, partnerType: profileData?.profile?.profile_type });
      } else if (!result.success) {
        setMessages(prev => [...prev, {
          id: `qwen_error_${Date.now()}`,
          sender: 'qwen',
          sender_role: 'constellation',
          content: { text: `*Sister Qwen is unavailable*: ${result.error || 'Unable to get response. Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: 'Sister Qwen',
          constellation_icon: '🏮'
        }]);
      }
    } catch (err) {
      console.error('Qwen perspective error:', err);
      setMessages(prev => [...prev, {
        id: `qwen_error_${Date.now()}`,
        sender: 'qwen',
        sender_role: 'constellation',
        content: { text: `*Sister Qwen connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: 'Sister Qwen',
        constellation_icon: '🏮'
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Post a statement to the chat without triggering a guest reply
  // The user can then choose which constellation AI to respond
  const handlePostStatement = useCallback(async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || aiResponding) return;

    const timestamp = new Date().toISOString();
    const tempId = `user_stmt_${Date.now()}`;

    setInputText('');

    const message = {
      id: tempId,
      sender: userId,
      sender_role: 'user',
      content: { text: trimmedText },
      timestamp,
      is_statement: true
    };

    setMessages(prev => [...prev, message]);

    // Save to Brain 3 independently so it persists across refreshes
    const docId = await saveToBrain3({
      message_id: tempId,
      timestamp,
      sender: 'user',
      sender_role: 'user',
      content: { text: trimmedText },
      is_statement: true,
      modality: { type: 'text', mode: 'chat', platform: 'web' }
    }, {
      selectedUserProfileId,
      partnerId,
      partnerName: profileData?.profile?.profile_name,
      partnerType: profileData?.profile?.profile_type
    });

    // Update message ID to Firestore doc ID for consistent referencing
    if (docId) {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: docId } : m));
    }
  }, [inputText, userId, aiResponding, selectedUserProfileId, partnerId, profileData]);

  // Handle constellation AI responding to a user statement
  // Called from MessageList when user clicks an AI button under a statement
  const handleStatementConstellation = useCallback(async (statementMessage, aiKey) => {
    if (!statementMessage || constellationLoading) return;

    const aiConfig = CONSTELLATION_AIS.find(a => a.key === aiKey);
    if (!aiConfig) return;

    setConstellationLoading(aiKey);

    try {
      const serviceMap = {
        gemini:   getGuestSecondOpinion,
        opus:     getGuestOpusPerspective,
        grok:     getGuestGrokPerspective,
        deepseek: getGuestDeepSeekPerspective,
        chatgpt:  getGuestChatGPTPerspective,
        sonnet:   getGuestSonnetPerspective,
        qwen:     getGuestQwenPerspective,
      };
      const serviceFn = serviceMap[aiKey];

      const msgIndex = messages.findIndex(m => m.id === statementMessage.id);

      const result = await serviceFn({
        guestResponse: '',
        guestName: profileData?.profile?.profile_name || 'Guest',
        userMessage: statementMessage.content?.text || '',
        conversationHistory: messages.slice(0, msgIndex + 1),
        userConstitutional: userConstitutionalFromProfile
      });

      if (result.success && result.text) {
        let constellationTranslation = null;
        if (isNonEnglish(userLanguage) && result.text.length > 2) {
          try {
            const translated = await translateMessage(result.text, userLanguage, 'en');
            if (!translated.skipped && translated.translatedText) {
              constellationTranslation = {
                text: translated.translatedText,
                sourceLanguage: 'en',
                targetLanguage: userLanguage
              };
            }
          } catch (err) {
            console.warn(`${aiKey} translation failed:`, err);
          }
        }

        const constellationTimestamp = new Date().toISOString();
        const tempId = `${aiKey}_stmt_${Date.now()}`;
        const constellationMsg = {
          id: tempId,
          sender: aiKey,
          sender_role: 'constellation',
          content: { text: result.text, translation: constellationTranslation },
          timestamp: constellationTimestamp,
          constellation_speaker: aiConfig.speaker,
          constellation_icon: aiConfig.icon,
          in_response_to: statementMessage.id
        };

        setMessages(prev => [...prev, constellationMsg]);

        // Save constellation response to Brain 3
        const docId = await saveToBrain3({
          message_id: tempId,
          timestamp: constellationTimestamp,
          sender: aiKey,
          sender_role: 'constellation',
          content: { text: result.text },
          constellation_speaker: aiConfig.speaker,
          in_response_to: statementMessage.id,
          modality: { type: 'text', mode: 'chat', platform: 'web' }
        }, {
          selectedUserProfileId,
          partnerId,
          partnerName: profileData?.profile?.profile_name,
          partnerType: profileData?.profile?.profile_type
        });
        if (docId) {
          setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: docId } : m));
        }
      } else {
        setMessages(prev => [...prev, {
          id: `${aiKey}_error_${Date.now()}`,
          sender: aiKey,
          sender_role: 'constellation',
          content: { text: `*${aiConfig.speaker} is unavailable*: ${result.error || 'Please try again.'}` },
          timestamp: new Date().toISOString(),
          constellation_speaker: aiConfig.speaker,
          constellation_icon: aiConfig.icon
        }]);
      }
    } catch (err) {
      console.error(`Statement ${aiKey} error:`, err);
      setMessages(prev => [...prev, {
        id: `${aiKey}_error_${Date.now()}`,
        sender: aiKey,
        sender_role: 'constellation',
        content: { text: `*${aiConfig.speaker} connection error*: ${err.message}` },
        timestamp: new Date().toISOString(),
        constellation_speaker: aiConfig.speaker,
        constellation_icon: aiConfig.icon
      }]);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, userConstitutionalFromProfile, constellationLoading, userLanguage, selectedUserProfileId, partnerId]);

  // Handle sending a statement to the guest (when user clicks guest button under a statement)
  const handleStatementToGuest = useCallback(async (statementMessage) => {
    if (!statementMessage || !profileData || aiResponding) return;
    // Re-send as a normal guest message using the statement text
    handleSendMessage(statementMessage.content?.text || '', []);
  }, [profileData, aiResponding, handleSendMessage]);

  // Handle voice message (placeholder)
  const handleVoiceMessage = useCallback(async (audioBlob, duration) => {
    console.log('Voice message recorded:', duration);
  }, []);

  // Handle Guest response to constellation message (debate mode)
  // This lets Einstein respond to what Gemini/Opus said
  const handleGuestResponse = useCallback(async (constellationMessage) => {
    if (!constellationMessage || !profileData || constellationLoading) return;

    setConstellationLoading('guest');

    try {
      const speaker = constellationMessage.constellation_speaker || 'the AI';
      const synthesizedQuestion = `What do you think about what ${speaker} just said? "${constellationMessage.content?.text?.slice(0, 200)}..."`;

      // Send message to guest with context about constellation response
      const result = await sendGuestMessage({
        partnerId,
        userMessage: synthesizedQuestion,
        conversationHistory: messages,
        guestProfile: profileData.profile,
        userConstitutional: userConstitutionalFromProfile,
        learnedFacts: profileData.learnedFacts || [],
        lunaMode: 'silent' // Don't need Luna coaching for debate responses
      });

      // Add guest response
      if (result.guestResponse) {
        setMessages(prev => [...prev, {
          ...result.guestResponse,
          id: `guest_debate_${Date.now()}`,
          in_response_to: constellationMessage.id
        }]);
      }
    } catch (err) {
      console.error('Guest debate response error:', err);
    } finally {
      setConstellationLoading(null);
    }
  }, [messages, profileData, partnerId, userConstitutionalFromProfile, constellationLoading]);

  // Toggle Luna mode
  const toggleLunaMode = useCallback(() => {
    setLunaMode(prev => prev === 'silent' ? 'active' : 'silent');
  }, []);

  // Handle paste - detect pasted images
  const handlePaste = useCallback(async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    // Check if we can add more images
    if (attachedImages.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed. Remove some to add more.`);
      return;
    }

    const currentTotalSize = attachedImages.reduce((sum, img) => sum + img.size, 0);
    const errors = [];

    for (const item of imageItems) {
      if (attachedImages.length >= MAX_IMAGES) break;

      const file = item.getAsFile();
      if (!file) continue;

      // Check individual file size
      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`Image too large: ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB > ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit`);
        continue;
      }

      // Check total size
      if (currentTotalSize + file.size > MAX_TOTAL_IMAGE_SIZE) {
        errors.push('Total image size would exceed limit');
        break;
      }

      // Read image as data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, {
            dataUrl: event.target.result,
            name: `screenshot_${Date.now()}_${prev.length + 1}.png`,
            size: file.size,
            type: file.type
          }];
        });
      };
      reader.readAsDataURL(file);
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }
  }, [attachedImages]);

  // Handle image file selection
  const handleImageSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentTotalSize = attachedImages.reduce((sum, img) => sum + img.size, 0);
    const errors = [];

    for (const file of files) {
      if (attachedImages.length >= MAX_IMAGES) {
        errors.push(`Maximum ${MAX_IMAGES} images reached`);
        break;
      }

      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Not an image file`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`${file.name}: Too large (${Math.round(file.size / 1024 / 1024 * 10) / 10}MB)`);
        continue;
      }

      if (currentTotalSize + file.size > MAX_TOTAL_IMAGE_SIZE) {
        errors.push('Total size limit exceeded');
        break;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, {
            dataUrl: event.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          }];
        });
      };
      reader.readAsDataURL(file);
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    // Reset input
    e.target.value = '';
  }, [attachedImages]);

  // Remove attached image
  const removeImage = useCallback((index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Export single message as MD
  const handleExportToMD = useCallback((message) => {
    const firstLine = (message.content?.text || '').split('\n')[0].slice(0, 40).replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const timestamp = new Date(message.timestamp || Date.now()).toISOString().split('T')[0];
    const filename = firstLine
      ? `${firstLine.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.md`
      : `guest-response-${timestamp}.md`;

    const senderName = message.sender_role === 'user' ? 'User' :
                       message.sender_role === 'luna_private' ? 'Luna (Coach)' :
                       profileData?.profile?.profile_name || 'Guest';

    const mdContent = `# ${senderName} Message

> **Date:** ${new Date(message.timestamp || Date.now()).toLocaleString()}
> **Guest:** ${profileData?.profile?.profile_name || 'Unknown'}

---

${message.content?.text || message.content || ''}

---
*Exported from AstroProfile Guest Chat*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [profileData]);

  // Export entire conversation as MD
  const handleExportConversationToMD = useCallback(() => {
    if (messages.length === 0) {
      alert('No messages to export');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const guestName = profileData?.profile?.profile_name?.replace(/\s+/g, '-').toLowerCase() || 'conversation';
    const filename = `${guestName}-conversation-${timestamp}.md`;

    const conversationMessages = messages
      .map(m => {
        const senderName = m.sender_role === 'user' ? '## User' :
                           m.sender_role === 'luna_private' ? '## Luna (Private Coach)' :
                           `## ${profileData?.profile?.profile_name || 'Guest'}`;
        const time = m.timestamp ? new Date(m.timestamp).toLocaleString() : '';
        return `${senderName}\n*${time}*\n\n${m.content?.text || m.content || ''}`;
      })
      .join('\n\n---\n\n');

    const mdContent = `# Guest Chat Conversation

> **Guest:** ${profileData?.profile?.profile_name || 'Unknown'}
> **Date:** ${new Date().toLocaleString()}
> **Messages:** ${messages.length}

---

${conversationMessages}

---

*Exported from AstroProfile Guest Chat*
*${new Date().toISOString()}*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [messages, profileData]);

  // Loading state (only when actively loading a guest profile)
  if (loading && partnerId) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading {partnerId?.replace('historical_', '').replace('modern_', '')}...</p>
        </div>
      </div>
    );
  }

  // No guest selected state - show selection interface
  if (!partnerId || !profileData) {
    return (
      <div className="flex flex-col h-screen bg-slate-900">
        {/* Simple Header for selection state */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">Guest Chat</h1>
            </div>
          </div>
        </div>

        {/* Guest Selection Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Choose a Guest to Chat With</h2>
              <p className="text-slate-400">Select a historical or modern figure to start a conversation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableGuests.map((guest) => {
                const isHistorical = guest.category === 'historical';
                const icon = isHistorical ? '🏛️' : '🌟';
                const bgGradient = isHistorical
                  ? 'from-amber-600/20 to-orange-600/20 border-amber-500/30 hover:border-amber-400/50'
                  : 'from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:border-purple-400/50';

                return (
                  <button
                    key={guest.id}
                    onClick={() => handleGuestSelect(guest.id)}
                    className={`
                      bg-gradient-to-br ${bgGradient} backdrop-blur-lg rounded-xl p-6 border-2
                      text-left transition-all hover:scale-[1.02] active:scale-[0.98]
                    `}
                  >
                    <div className="text-4xl mb-3">{icon}</div>
                    <h3 className="text-lg font-bold text-white mb-1">{guest.name}</h3>
                    <p className="text-sm text-slate-400 capitalize">{guest.type}</p>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <ChatHeader
        guestName={profileData.profile.profile_name}
        guestType={profileData.profile.profile_type}
        lunaMode={lunaMode}
        onToggleLuna={toggleLunaMode}
        hasConstitutionalData={!!userConstitutionalFromProfile}
        learnedFactsCount={profileData.profile_metadata.learned_facts_count}
        selectedUserProfile={selectedUserProfile}
      />

      {/* Unified Selector Bar - Chat as + Chat with */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-4">
          {/* Chatting as (User Profile) */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="text-slate-400">Chatting as:</span>
            <div className="relative" ref={profileSelectorRef}>
              <button
                onClick={() => setProfileSelectorOpen(!profileSelectorOpen)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all
                  ${selectedUserProfile
                    ? 'bg-slate-700 border-indigo-500 text-indigo-300 hover:bg-slate-600'
                    : 'bg-yellow-900/30 border-yellow-600 text-yellow-400 hover:bg-yellow-900/50'
                  }
                `}
              >
                {selectedUserProfile ? (
                  <>
                    <span className="font-medium">{selectedUserProfile.displayName || selectedUserProfile.firstName}</span>
                    <span className="text-xs opacity-75">
                      {userConstitutionalFromProfile?.bazi?.day_master?.stem || userConstitutionalFromProfile?.western?.sun?.sign || ''}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Select Profile</span>
                  </>
                )}
                <svg
                  className={`w-4 h-4 transition-transform ${profileSelectorOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Profile Dropdown */}
              {profileSelectorOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs text-slate-400 px-3 py-1 uppercase tracking-wide">Your Profiles</p>

                    {userProfiles.length === 0 ? (
                      <div className="px-3 py-4 text-center text-slate-400 text-sm">
                        <p>No profiles yet</p>
                        <Link to="/dashboard" className="text-indigo-400 hover:underline text-xs">
                          Create a profile first
                        </Link>
                      </div>
                    ) : (
                      userProfiles.map((profile) => {
                        const chinese = profile.chineseZodiac || profile.calculations?.chinese;
                        const western = profile.calculations?.western;
                        const bazi = chinese?.sovereignBazi;
                        const dayMaster = bazi?.baziDay?.dayMaster;

                        return (
                          <button
                            key={profile.id}
                            onClick={() => {
                              setSelectedUserProfileId(profile.id);
                              setProfileSelectorOpen(false);
                            }}
                            className={`
                              w-full px-3 py-2 text-left rounded-lg transition-colors flex items-start gap-3
                              ${selectedUserProfileId === profile.id
                                ? 'bg-indigo-900/50 text-indigo-300'
                                : 'hover:bg-slate-700 text-slate-300'
                              }
                            `}
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {(profile.firstName || '?').charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                              </div>
                              <div className="text-xs text-slate-500 flex flex-wrap gap-1">
                                {dayMaster && (
                                  <span className="bg-amber-900/50 text-amber-400 px-1 rounded">{dayMaster}</span>
                                )}
                                {western?.sign && (
                                  <span className="bg-blue-900/50 text-blue-400 px-1 rounded">{western.sign}</span>
                                )}
                                {chinese?.animal && (
                                  <span className="bg-red-900/50 text-red-400 px-1 rounded">{chinese.animal}</span>
                                )}
                                {profile.relationshipType === 'self' && (
                                  <span className="bg-green-900/50 text-green-400 px-1 rounded">You</span>
                                )}
                              </div>
                            </div>
                            {selectedUserProfileId === profile.id && (
                              <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="text-slate-600">|</div>

          {/* Chat with (Guest Selector) */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="text-slate-400">Chat with:</span>
            <div className="relative" ref={guestSelectorRef}>
              <button
                onClick={() => setGuestSelectorOpen(!guestSelectorOpen)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all
                  ${selectedGuest
                    ? 'bg-slate-700 border-emerald-500 text-emerald-300 hover:bg-slate-600'
                    : 'bg-emerald-900/30 border-emerald-600 text-emerald-400 hover:bg-emerald-900/50'
                  }
                `}
              >
                {selectedGuest ? (
                  <>
                    <span className="font-medium">{selectedGuest.name}</span>
                    <span className="text-xs opacity-75">{selectedGuest.category}</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Select Guest</span>
                  </>
                )}
                <svg
                  className={`w-4 h-4 transition-transform ${guestSelectorOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Guest Dropdown */}
              {guestSelectorOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs text-slate-400 px-3 py-1 uppercase tracking-wide">Available Guests</p>

                    {availableGuests.map((guest) => {
                      const isHistorical = guest.category === 'historical';
                      const icon = isHistorical ? '🏛️' : '🌟';

                      return (
                        <button
                          key={guest.id}
                          onClick={() => handleGuestSelect(guest.id)}
                          className={`
                            w-full px-3 py-2 text-left rounded-lg transition-colors flex items-start gap-3
                            ${selectedGuestId === guest.id
                              ? 'bg-emerald-900/50 text-emerald-300'
                              : 'hover:bg-slate-700 text-slate-300'
                            }
                          `}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{guest.name}</div>
                            <div className="text-xs text-slate-500 capitalize">{guest.type}</div>
                          </div>
                          {selectedGuestId === guest.id && (
                            <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Constitutional Summary (right side) */}
          <div className="flex-1 flex justify-end">
            {userConstitutionalFromProfile && (
              <div className="text-xs text-indigo-300 bg-indigo-900/50 px-2 py-1 rounded hidden sm:block">
                {userConstitutionalFromProfile.constitutionalSummary}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border-b border-red-200 px-4 py-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-slate-900">
        <MessageList
          messages={messages}
          currentUserId={userId}
          guestId={partnerId}
          guestName={profileData.profile.profile_name}
          lunaMode={lunaMode}
          onGeminiPerspective={handleGeminiPerspective}
          onOpusPerspective={handleOpusPerspective}
          onGrokPerspective={handleGrokPerspective}
          onDeepSeekPerspective={handleDeepSeekPerspective}
          onChatGPTPerspective={handleChatGPTPerspective}
          onSonnetPerspective={handleSonnetPerspective}
          onQwenPerspective={handleQwenPerspective}
          onGuestResponse={handleGuestResponse}
          onStatementConstellation={handleStatementConstellation}
          onStatementToGuest={handleStatementToGuest}
          constellationLoading={constellationLoading}
        />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Attached Images Preview */}
          {attachedImages.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-500"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded-b-lg truncate">
                    {Math.round(img.size / 1024)}KB
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end gap-2">
            {/* Image Attach Button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={aiResponding || attachedImages.length >= MAX_IMAGES}
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                attachedImages.length >= MAX_IMAGES
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title={attachedImages.length >= MAX_IMAGES ? `Max ${MAX_IMAGES} images` : 'Attach image'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Hidden Image Input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Text Input */}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              disabled={aiResponding}
              placeholder={
                aiResponding
                  ? `${profileData.profile.profile_name} is thinking...`
                  : attachedImages.length > 0
                    ? `Describe these ${attachedImages.length} image(s)...`
                    : `Message ${profileData.profile.profile_name}... (/luna for private advice)`
              }
              rows={2}
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed resize-none"
              style={{ minHeight: '64px', maxHeight: '150px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => {
                const trimmedText = inputText.trim();

                // Check for /luna command (private consultation)
                if (trimmedText.toLowerCase().startsWith('/luna ') || trimmedText.toLowerCase().startsWith('@luna ')) {
                  const lunaQuestion = trimmedText.slice(6).trim();
                  if (lunaQuestion) {
                    handleLunaPrivateQuery(lunaQuestion);
                    setInputText('');
                  }
                } else if (trimmedText || attachedImages.length > 0) {
                  handleSendMessage(inputText, attachedImages);
                  setInputText('');
                  setAttachedImages([]);
                }
              }}
              disabled={(!inputText.trim() && attachedImages.length === 0) || aiResponding}
              className={`flex-shrink-0 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                (!inputText.trim() && attachedImages.length === 0) || aiResponding
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95'
              }`}
            >
              <span>Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>

            {/* Statement Button — post without guest reply, then pick AI */}
            <button
              type="button"
              onClick={handlePostStatement}
              disabled={!inputText.trim() || aiResponding || constellationLoading}
              className={`flex-shrink-0 px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all ${
                !inputText.trim() || aiResponding || constellationLoading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-900/50 text-amber-400 hover:bg-amber-900/70 active:scale-95'
              }`}
              title="Post statement without guest reply — then choose which AI responds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>Post</span>
            </button>

            {/* Export MD Button */}
            <button
              type="button"
              onClick={handleExportConversationToMD}
              disabled={messages.length === 0}
              className={`flex-shrink-0 px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm transition-all ${
                messages.length === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70'
              }`}
              title="Export conversation as Markdown"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>MD</span>
            </button>
          </div>

          {/* Hints */}
          <div className="mt-2 text-xs text-slate-500 text-center">
            Shift+Enter for new line | Ctrl+V to paste images | <span className="text-purple-400">/luna</span> for private advice
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestChat;
