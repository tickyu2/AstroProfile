/**
 * AI SoulPartner Service
 *
 * Frontend service for calling the Claude API via Firebase Cloud Function.
 * Sends messages with Constitutional Intelligence guidance and receives responses.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 *
 * UPDATED: December 17, 2024 - Added Psychological Profile integration
 * Liz Greene-inspired psychological astrology framework for Luna
 *
 * UPDATED: December 19, 2024 - Added Memory Architecture integration
 * RAG pipeline with vector embeddings, facts table, reflection loop
 */

import { generatePsychologicalProfile } from '../utils/psychologicalProfileGenerator';
import { memoryService } from './memoryService';
import { conversationCache, payloadToConversationHistory } from './conversationCache';
import {
  THINKING_LEVELS,
  DEFAULT_THINKING_LEVEL,
  determineThinkingLevel,
  buildGemini3History,
  convertFromGemini3Response,
  extractTextFromParts,
  cacheThoughtSignature,
  getCachedThoughtSignature
} from './gemini3Service';

// Energy-aware thinking (Advanced Voice Features - Phase 4)
import { lunaEnergyService, ENERGY_STATES } from './lunaEnergyService';

// Focus Mode (Advanced Voice Features - Phase 4)
import { focusModeService, FOCUS_MODES, FOCUS_SYSTEM_PROMPTS } from './focusModeService';

// Focus Report (Advanced Voice Features - Phase 4)
import { focusReportService } from './focusReportService';

// Language Service (Phase 5 - Adaptive Localization)
import { languageService, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languageService';

// Firebase Function URLs
// 2nd Gen Cloud Functions use Cloud Run URLs
const PRODUCTION_URL = 'https://aisoulpartnerchat-sjpjwnbsmq-uc.a.run.app';
const PRODUCTION_HEALTH_URL = 'https://healthcheck-sjpjwnbsmq-uc.a.run.app';

// Local emulator URL for development
const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/aiSoulPartnerChat';
const EMULATOR_HEALTH_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/healthCheck';

// Use environment variable override or defaults
const FUNCTION_URL = import.meta.env.VITE_AI_FUNCTION_URL || PRODUCTION_URL;

// Use emulator in development
const getApiUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return EMULATOR_URL;
  }
  return FUNCTION_URL;
};

/**
 * Send a message to the AI SoulPartner
 *
 * @param {Object} params - Request parameters
 * @param {string} params.message - The user's message
 * @param {Object} params.guidance - Constitutional Intelligence guidance
 * @param {Array} params.conversationHistory - Previous messages for context
 * @param {Object} params.userProfile - User's constitutional profile
 * @param {string} params.knowledgePrompt - Pre-built knowledge base prompt from KnowledgeBaseContext
 * @param {string} params.learnedContext - Session Intelligence learned context (from contextBuilder)
 * @param {Object} params.image - Optional image data { dataUrl, type }
 * @param {string} params.profileId - Profile ID for memory isolation (NEW)
 * @param {string} params.sessionId - Session ID for reflection tracking (NEW)
 * @param {boolean} params.useOptimizedPayload - Use conversation cache for 80%+ token reduction (NEW)
 * @param {string} params.conversationId - Conversation ID for optimized payload (NEW)
 * @param {string} params.thinkingLevel - Gemini 3 thinking level: 'minimal'|'low'|'medium'|'high'|'auto' (NEW)
 * @param {boolean} params.includeThoughts - Include thinking content in response (NEW)
 * @returns {Promise<Object>} - AI response with metadata including Gemini 3 parts[]
 */
export async function sendMessage({
  message,
  guidance,
  conversationHistory = [],
  userProfile = {},
  knowledgePrompt = '',
  learnedContext = null,
  image = null,
  profileId = null,
  sessionId = null,
  useOptimizedPayload = false,
  conversationId = null,
  thinkingLevel = 'auto',
  includeThoughts = false
}) {
  try {
    // ════════════════════════════════════════════════════════════════════
    // MEMORY RETRIEVAL (Phase 3 - RAG Pipeline)
    // ════════════════════════════════════════════════════════════════════
    let memoryContext = null;
    let memoryPrompt = '';

    const userId = userProfile?.userId;

    if (userId && profileId) {
      try {
        // Detect if user seems down (for happiness anchors)
        const moodIsLow = memoryService.detectLowMood(message, guidance?.emotions);

        // Get full memory context (facts, memories, people, anchors)
        memoryContext = await memoryService.getMemoryContext(
          userId,
          profileId,
          message,
          {
            recencyDays: 90,
            moodIsLow
          }
        );

        // Build memory prompt section
        memoryPrompt = memoryService.buildMemoryPrompt(memoryContext);

        console.log('🧠 Memory context retrieved:', {
          facts: memoryContext.facts?.length || 0,
          memories: memoryContext.memories?.length || 0,
          people: memoryContext.people?.length || 0,
          anchors: memoryContext.happinessAnchors?.length || 0,
          relationshipStats: memoryContext.relationshipStats ? {
            bondLevel: memoryContext.relationshipStats.bondLevel,
            ageInDays: memoryContext.relationshipStats.ageInDays,
            pendingCelebrations: memoryContext.relationshipStats.pendingCelebration?.length || 0
          } : 'new relationship',
          timeMs: memoryContext.retrievalTimeMs
        });

        // Initialize relationship if first conversation (Tango Identity System)
        if (!memoryContext.relationshipStats) {
          console.log('💞 Tango: First conversation - initializing Luna\'s birthday with this user');
          memoryService.initializeRelationship(userId, profileId)
            .catch(err => console.warn('⚠️ Failed to initialize relationship:', err.message));
        }

      } catch (memError) {
        console.warn('⚠️ Memory retrieval failed (continuing without):', memError.message);
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // CONVERSATION CACHE - 80%+ Token Reduction (Phase 4)
    // ════════════════════════════════════════════════════════════════════
    let optimizedHistory = conversationHistory;
    let payloadMetrics = null;
    let storySoFarContext = null;

    if (useOptimizedPayload && profileId) {
      try {
        // Set messages in cache if not already there
        if (conversationHistory.length > 0) {
          conversationCache.setMessages(profileId, conversationHistory);
        }

        // Build optimized payload
        const optimizedPayload = await conversationCache.buildOptimizedPayload(
          profileId,
          conversationId,
          { recentCount: 10, includeStory: true }
        );

        // Convert to conversation history format
        optimizedHistory = payloadToConversationHistory(optimizedPayload);
        payloadMetrics = optimizedPayload.metrics;
        storySoFarContext = optimizedPayload.storySoFar;

        console.log('📦 [ConversationCache] Token reduction:', {
          before: payloadMetrics.fullPayloadTokens,
          after: payloadMetrics.optimizedTokens,
          saved: payloadMetrics.tokensSaved,
          reduction: `${payloadMetrics.reductionPercent}%`
        });

        // Trigger background summarization if needed
        conversationCache.maybeTriggersummarization(profileId, conversationId);

      } catch (cacheError) {
        console.warn('⚠️ [ConversationCache] Failed, using full history:', cacheError.message);
        optimizedHistory = conversationHistory;
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // FOCUS MODE CONFIGURATION (Phase 4)
    // Focus Mode overrides thinking level and adds system prompt modifications
    // ════════════════════════════════════════════════════════════════════
    const focusConfig = focusModeService.getLunaConfig();
    let focusSystemPrompt = '';

    if (focusConfig.isActive) {
      focusSystemPrompt = focusConfig.systemPrompt;
      console.log('🎯 [FocusMode] Active:', {
        mode: focusConfig.mode,
        thinkingLevel: focusConfig.thinkingLevel,
        energyCostMultiplier: focusConfig.energyCostMultiplier
      });
    }

    // ════════════════════════════════════════════════════════════════════
    // GEMINI 3 THINKING LEVEL with Energy & Focus Awareness (Phase 4)
    // Luna's thinking adapts to her energy state and focus mode
    // ════════════════════════════════════════════════════════════════════
    let effectiveThinkingLevel = thinkingLevel;
    let energyStatus = null;
    let personalityModifier = '';
    let wasDowngraded = false;

    // Focus mode takes priority for thinking level
    if (focusConfig.isActive && focusConfig.thinkingLevel !== 'auto') {
      effectiveThinkingLevel = focusConfig.thinkingLevel;
      console.log('🎯 [FocusMode] Thinking level set to:', effectiveThinkingLevel);
    } else if (thinkingLevel === 'auto') {
      // Use energy-aware preparation
      const energyPrep = lunaEnergyService.prepareMessage('auto');
      effectiveThinkingLevel = energyPrep.thinkingLevel;
      energyStatus = energyPrep.energyStatus;
      personalityModifier = energyPrep.personalityModifier;

      // Fall back to content-based determination if energy is high
      if (energyStatus.state === ENERGY_STATES.FULL || energyStatus.state === ENERGY_STATES.RESTED) {
        const contentBasedLevel = determineThinkingLevel(message, { guidance });
        // Allow content to request high if energy supports it
        if (contentBasedLevel === 'high' && energyStatus.canUseHighThinking) {
          effectiveThinkingLevel = 'high';
        }
      }

      console.log('⚡ [EnergyAware] Thinking level adjusted:', {
        requested: thinkingLevel,
        effective: effectiveThinkingLevel,
        energyState: energyStatus?.state,
        energyLevel: energyStatus?.energy
      });

    } else if (thinkingLevel === 'high') {
      // User explicitly requested high - check if possible
      const energyPrep = lunaEnergyService.prepareMessage('high');
      if (energyPrep.wasDowngraded) {
        effectiveThinkingLevel = energyPrep.thinkingLevel;
        personalityModifier = energyPrep.personalityModifier;
        wasDowngraded = true;
        console.log('⚡ [EnergyAware] Downgraded from high to', effectiveThinkingLevel, '(low energy)');
      }
      energyStatus = energyPrep.energyStatus;
    }

    // Get cached thought signature for conversation continuity
    const cachedSignature = conversationId ? getCachedThoughtSignature(conversationId) : null;

    // Build Gemini 3 compatible history (preserves thought signatures)
    const gemini3History = buildGemini3History(optimizedHistory);

    console.log('🚀 Sending to AI SoulPartner:', {
      message: message?.slice(0, 50) + '...',
      mode: guidance?.mode,
      historyLength: optimizedHistory.length,
      usingOptimizedPayload: useOptimizedPayload && !!payloadMetrics,
      tokenReduction: payloadMetrics ? `${payloadMetrics.reductionPercent}%` : 'N/A',
      hasKnowledge: !!knowledgePrompt,
      knowledgeLength: knowledgePrompt?.length || 0,
      hasLearnedContext: !!learnedContext,
      hasMemory: !!memoryPrompt,
      memoryLength: memoryPrompt?.length || 0,
      hasImage: !!image,
      // Gemini 3 fields
      thinkingLevel: effectiveThinkingLevel,
      includeThoughts,
      hasThoughtSignature: !!cachedSignature,
      // Energy state
      energyState: energyStatus?.state || 'unknown',
      hasPersonalityModifier: !!personalityModifier
    });

    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        guidance: {
          mode: guidance?.mode || 'DIALOGUE',
          tone: guidance?.tone,
          length: guidance?.length,
          suggestions: guidance?.suggestions || [],
          emotionalContext: formatEmotionalContext(guidance),
          intensity: guidance?.intensity,
          // Energy-aware personality modifier (Phase 4)
          personalityModifier: personalityModifier || '',
          energyState: energyStatus?.state || null,
          // Focus Mode (Phase 4)
          focusMode: focusConfig.isActive ? focusConfig.mode : null,
          focusSystemPrompt: focusSystemPrompt || null,
          // Adaptive Localization (Phase 5)
          polyglotPrompt: languageService.getPolyglotPrompt(),
          culturalContext: languageService.getCulturalContextPrompt(),
          sessionLanguage: languageService.getSessionLanguage()
        },
        // Legacy format for backward compatibility
        conversationHistory: optimizedHistory.map(msg => ({
          sender: msg.sender,
          text: msg.text || extractTextFromParts(msg),
          // Include reaction data so Brother can see what user liked/loved
          reactions: formatReactionsForContext(msg.reactions),
          // Mark context injections for backend awareness
          isContextInjection: msg.isContextInjection || false,
          // Gemini 3: Preserve thought signature if present
          thoughtSignature: msg.thoughtSignature || null,
          // Gemini 3: Full parts array for Gemini 3 models
          parts: msg.parts || null
        })),
        // Gemini 3 format history (for Gemini 3 backend)
        gemini3History,
        userProfile: {
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional: userProfile?.constitutional_identity,
          personality: userProfile?.personality,
          aiNotes: userProfile?.aiSoulPartner  // Notes from previous conversations
        },
        knowledgePrompt,  // Pre-built knowledge base prompt
        learnedContext,   // Session Intelligence learned patterns context
        memoryPrompt,     // Memory Architecture context (NEW)
        relationshipStats: memoryContext?.relationshipStats || null,  // Tango Identity System (NEW)
        image,  // Optional image for vision { dataUrl, type }
        storySoFarContext,  // Explicit story context for backend (NEW)
        // Gemini 3 configuration (NEW)
        gemini3Config: {
          thinkingLevel: effectiveThinkingLevel,
          includeThoughts,
          thoughtSignature: cachedSignature  // Continue thinking chain
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ AI SoulPartner Response:', {
      mode: data.mode,
      responseLength: data.response?.length,
      hasGeneratedImage: !!data.generatedImage,
      usage: data.usage,
      // Gemini 3 fields
      hasThoughtSignature: !!data.thoughtSignature,
      hasThinkingContent: !!data.thinkingContent,
      hasParts: !!data.parts
    });

    // If image was generated, include it in response
    if (data.generatedImage) {
      console.log('🎨 Image generated via Nano Banana');
    }

    // ════════════════════════════════════════════════════════════════════
    // GEMINI 3: CACHE THOUGHT SIGNATURE (Phase 4)
    // Cache the signature for next turn - this is Luna's "working memory"
    // ════════════════════════════════════════════════════════════════════
    if (data.thoughtSignature && conversationId) {
      cacheThoughtSignature(conversationId, data.thoughtSignature);
      console.log('🧠 Thought signature cached for conversation continuity');
    }

    // ════════════════════════════════════════════════════════════════════
    // ENERGY CONSUMPTION TRACKING (Phase 4 - Advanced Voice Features)
    // Luna uses energy for each message - makes her feel more human
    // ════════════════════════════════════════════════════════════════════
    const energyResult = lunaEnergyService.recordTextMessage(effectiveThinkingLevel);
    console.log('⚡ [EnergyAware] Message energy recorded:', {
      consumed: energyResult.consumed,
      remaining: energyResult.remaining,
      newState: energyResult.state
    });

    // ════════════════════════════════════════════════════════════════════
    // FOCUS REPORT BUFFERING (Phase 4 - Advanced Voice Features)
    // Buffer messages and thoughts during focus sessions for the debrief
    // ════════════════════════════════════════════════════════════════════
    if (focusConfig.isActive && focusReportService.isSessionActive()) {
      // Add thought signature for logic map
      if (data.thoughtSignature) {
        focusReportService.addThought(data.thoughtSignature, data.thinkingContent);
      }

      // Add message exchange for context
      focusReportService.addMessage(message, data.response, {
        thinkingLevel: effectiveThinkingLevel,
        mode: data.mode,
        energyConsumed: energyResult.consumed
      });

      console.log('📊 [FocusReport] Buffered exchange:', {
        thoughtSignature: !!data.thoughtSignature,
        thinkingContent: !!data.thinkingContent,
        bufferSize: focusReportService.getCurrentSession()?.messagesCount || 0
      });
    }

    // ════════════════════════════════════════════════════════════════════
    // LANGUAGE DETECTION (Phase 5 - Adaptive Localization)
    // Detect language from response and update session language
    // ════════════════════════════════════════════════════════════════════
    let detectedLanguage = languageService.getSessionLanguage();
    if (data.detectedLanguage) {
      // Backend detected language from Gemini 3
      detectedLanguage = languageService.processDetectedLanguage(
        data.detectedLanguage,
        data.languageConfidence || 0.8
      );
    } else if (data.response) {
      // Quick detect from response text as fallback
      const quickDetect = languageService.quickDetect(data.response);
      if (quickDetect !== 'unknown') {
        detectedLanguage = languageService.processDetectedLanguage(quickDetect, 0.7);
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // REFLECTION SCHEDULING (Phase 3 - Background Fact Extraction)
    // ════════════════════════════════════════════════════════════════════
    if (userId && profileId && sessionId && data.response) {
      // Schedule reflection (non-blocking - runs in background)
      memoryService.scheduleReflection(
        userId,
        profileId,
        sessionId,
        message,
        data.response
      );
    }

    return {
      success: true,
      text: data.response,
      mode: data.mode,
      usage: data.usage,
      generatedImage: data.generatedImage || null,  // { mimeType, data, prompt }
      memoryUsed: memoryContext ? {
        facts: memoryContext.facts?.length || 0,
        memories: memoryContext.memories?.length || 0,
        people: memoryContext.people?.length || 0,
        retrievalTimeMs: memoryContext.retrievalTimeMs
      } : null,
      // Conversation Cache metrics
      cacheMetrics: payloadMetrics ? {
        tokensSaved: payloadMetrics.tokensSaved,
        reductionPercent: payloadMetrics.reductionPercent,
        messagesInFull: payloadMetrics.messagesInFull,
        messagesInOptimized: payloadMetrics.messagesInOptimized
      } : null,
      // ════════════════════════════════════════════════════════════════════
      // GEMINI 3 RESPONSE DATA (Phase 4)
      // Client MUST store these for next turn when using Gemini 3
      // ════════════════════════════════════════════════════════════════════
      gemini3: data.gemini3 || false,  // Flag: response is from Gemini 3
      parts: data.parts || null,        // Full parts array - STORE THIS
      thoughtSignature: data.thoughtSignature || null,  // Working memory signature
      thinkingContent: data.thinkingContent || null,    // Visible thinking (if includeThoughts)
      thinkingLevel: effectiveThinkingLevel,            // What level was used
      // ════════════════════════════════════════════════════════════════════
      // ENERGY STATE (Phase 4 - Advanced Voice Features)
      // Luna's energy affects her thinking and personality
      // ════════════════════════════════════════════════════════════════════
      energyStatus: {
        level: energyResult.remaining,
        state: energyResult.state,
        consumed: energyResult.consumed,
        wasDowngraded,
        stateChanged: energyResult.stateChanged
      },
      // ════════════════════════════════════════════════════════════════════
      // FOCUS MODE (Phase 4 - Advanced Voice Features)
      // Focus mode configuration for UI feedback
      // ════════════════════════════════════════════════════════════════════
      focusMode: focusConfig.isActive ? {
        mode: focusConfig.mode,
        thinkingLevel: focusConfig.thinkingLevel,
        visuals: focusConfig.visuals
      } : null,
      // ════════════════════════════════════════════════════════════════════
      // LANGUAGE STATUS (Phase 5 - Adaptive Localization)
      // Current session language for UI feedback
      // ════════════════════════════════════════════════════════════════════
      languageStatus: {
        sessionLanguage: detectedLanguage,
        languageInfo: languageService.getLanguageInfo(detectedLanguage),
        voiceAccent: languageService.getVoiceAccent()
      }
    };

  } catch (error) {
    console.error('❌ AI SoulPartner Error:', error);

    // Return fallback response based on mode
    return {
      success: false,
      text: getFallbackResponse(guidance?.mode),
      mode: guidance?.mode || 'DIALOGUE',
      error: error.message
    };
  }
}

/**
 * Format reactions for conversation context
 * Converts reaction objects into human-readable format for Claude
 * e.g., { "🔥": { count: 2 }, "❤️": { count: 1 } } => "🔥(2) ❤️(1)"
 */
function formatReactionsForContext(reactions) {
  if (!reactions || Object.keys(reactions).length === 0) return null;

  const reactionStrings = Object.entries(reactions)
    .filter(([_, data]) => data.count > 0)
    .map(([emoji, data]) => `${emoji}(${data.count})`)
    .join(' ');

  return reactionStrings || null;
}

/**
 * Format emotional context from analysis for the API
 */
function formatEmotionalContext(guidance) {
  if (!guidance?.emotions) return null;

  const emotions = guidance.emotions;
  const activeEmotions = Object.entries(emotions)
    .filter(([_, value]) => value > 0.3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion, value]) => `${emotion} (${Math.round(value * 100)}%)`);

  if (activeEmotions.length === 0) return null;

  return activeEmotions.join(', ');
}

/**
 * Get fallback response when API fails
 */
function getFallbackResponse(mode) {
  const fallbacks = {
    WITNESS: "I hear you. I'm here with you. 💙",
    DIALOGUE: "That's interesting. Tell me more about what you're thinking...",
    GUIDANCE: "Let me help you with that. Here's what I'm thinking..."
  };

  return fallbacks[mode] || fallbacks.DIALOGUE;
}

/**
 * Get health check URL
 */
const getHealthUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return EMULATOR_HEALTH_URL;
  }
  return PRODUCTION_HEALTH_URL;
};

/**
 * Check if the AI service is available
 */
export async function checkServiceHealth() {
  try {
    const response = await fetch(getHealthUrl());
    const data = await response.json();
    return {
      available: data.status === 'healthy',
      timestamp: data.timestamp
    };
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
}

/**
 * Get Second Opinion from Sister Gemini
 *
 * @param {Object} params - Request parameters
 * @param {string} params.claudeResponse - What Claude said
 * @param {string} params.userMessage - Original user question
 * @param {Array} params.conversationHistory - Previous messages for context
 * @param {Object} params.userProfile - User's constitutional profile
 * @param {string} params.debateMode - 'second_opinion' | 'debate' | 'expand'
 * @param {Array} params.previousDebate - Previous AI exchanges in debate mode
 * @returns {Promise<Object>} - Gemini's response
 */
export async function getSecondOpinion({
  claudeResponse,
  userMessage,
  conversationHistory = [],
  userProfile = {},
  debateMode = 'second_opinion',
  previousDebate = [],
  customQuestion = ''  // User's specific question for Gemini
}) {
  // Second Opinion function URL (Cloud Run)
  const PRODUCTION_SECOND_OPINION_URL = 'https://getsecondopinion-sjpjwnbsmq-uc.a.run.app';
  const EMULATOR_SECOND_OPINION_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/getSecondOpinion';

  const getSecondOpinionUrl = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
      return EMULATOR_SECOND_OPINION_URL;
    }
    return PRODUCTION_SECOND_OPINION_URL;
  };

  try {
    console.log('💫 Getting Second Opinion from Sister Gemini:', {
      mode: debateMode,
      claudeResponse: claudeResponse?.slice(0, 50) + '...',
      debateExchanges: previousDebate?.length || 0
    });

    const response = await fetch(getSecondOpinionUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claudeResponse,
        userMessage,
        conversationHistory: conversationHistory.map(msg => ({
          sender: msg.sender,
          text: msg.text
        })),
        userProfile: {
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional: userProfile?.constitutional_identity
        },
        debateMode,
        previousDebate,
        customQuestion  // User's specific question for Gemini
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Second Opinion received:', {
      speaker: data.speaker,
      responseLength: data.response?.length,
      mode: data.mode
    });

    return {
      success: true,
      text: data.response,
      speaker: data.speaker || 'Sister Gemini',
      mode: data.mode,
      icon: data.icon || '💫'
    };

  } catch (error) {
    console.error('❌ Second Opinion Error:', error);

    return {
      success: false,
      text: "I'm having trouble connecting right now. Try again in a moment!",
      speaker: 'Sister Gemini',
      error: error.message
    };
  }
}

/**
 * Get Grok's Perspective in the AI Constellation
 *
 * @param {Object} params - Request parameters
 * @param {string} params.claudeResponse - What Claude said
 * @param {string} params.geminiResponse - What Gemini said (optional)
 * @param {string} params.userMessage - Original user question
 * @param {Object} params.userProfile - User's constitutional profile
 * @param {Array} params.debateHistory - Previous debate exchanges
 * @param {string} params.customQuestion - User's specific question for Grok
 * @returns {Promise<Object>} - Grok's response
 */
export async function getGrokPerspective({
  claudeResponse,
  geminiResponse = '',
  userMessage = '',
  userProfile = {},
  debateHistory = [],
  customQuestion = ''
}) {
  // Grok function URL (Cloud Run - will be set after deploy)
  const PRODUCTION_GROK_URL = 'https://getgrokperspective-sjpjwnbsmq-uc.a.run.app';
  const EMULATOR_GROK_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/getGrokPerspective';

  const getGrokUrl = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
      return EMULATOR_GROK_URL;
    }
    return PRODUCTION_GROK_URL;
  };

  try {
    console.log('🤖 Getting perspective from Brother Grok:', {
      hasClaudeResponse: !!claudeResponse,
      hasGeminiResponse: !!geminiResponse,
      debateExchanges: debateHistory?.length || 0
    });

    const response = await fetch(getGrokUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claudeResponse,
        geminiResponse,
        userMessage,
        userProfile: {
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional: userProfile?.constitutional_identity
        },
        debateHistory,
        customQuestion
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Grok perspective received:', {
      speaker: data.speaker,
      responseLength: data.response?.length
    });

    return {
      success: true,
      text: data.response,
      speaker: data.speaker || 'Brother Grok',
      icon: data.icon || '🌍'
    };

  } catch (error) {
    console.error('❌ Grok Perspective Error:', error);

    return {
      success: false,
      text: "Grok's taking a break. Try again in a moment!",
      speaker: 'Brother Grok',
      error: error.message
    };
  }
}

/**
 * Generate Debate Visual (Baby Nano)
 * Creates visual representations of AI debates using Gemini image generation.
 *
 * @param {Object} params - Request parameters
 * @param {Array} params.debateExchanges - Array of { speaker, text } exchanges
 * @param {string} params.visualType - 'sketch' | 'flowchart' | 'timeline' | 'mindmap' | 'comparison'
 * @param {string} params.topic - Optional topic/title of the debate
 * @param {Object} params.userProfile - User's constitutional profile
 * @param {string} params.customPrompt - Optional custom instruction
 * @returns {Promise<Object>} - Generated image data
 */
export async function generateDebateVisual({
  debateExchanges,
  visualType = 'sketch',
  topic = '',
  userProfile = {},
  customPrompt = ''
}) {
  // Cloud Function URL (Cloud Run)
  const PRODUCTION_URL = 'https://generatedebatevisual-sjpjwnbsmq-uc.a.run.app';
  const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/generateDebateVisual';

  const getUrl = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
      return EMULATOR_URL;
    }
    return PRODUCTION_URL;
  };

  try {
    console.log('🎨 Generating debate visual:', {
      type: visualType,
      exchanges: debateExchanges?.length || 0,
      hasTopic: !!topic
    });

    const response = await fetch(getUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        debateExchanges,
        visualType,
        topic,
        userProfile: {
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional: userProfile?.constitutional_identity
        },
        customPrompt
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('❌ Debate Visual HTTP Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.slice(0, 500)
      });
      let errorData = {};
      try { errorData = JSON.parse(errorText); } catch {}
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Debate visual generated:', {
      type: data.visualType,
      hasImage: !!data.image
    });

    return {
      success: true,
      image: data.image,
      visualType: data.visualType,
      description: data.description,
      meta: data.meta
    };

  } catch (error) {
    console.error('❌ Debate Visual Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Save Story Questions Assessment
 *
 * @param {Object} params - Request parameters
 * @param {string} params.userId - User's Firebase UID
 * @param {string} params.profileId - Profile ID being assessed
 * @param {Object} params.assessment - Full assessment analysis object
 * @returns {Promise<Object>} - Save result
 */
export async function saveStoryAssessment({ userId, profileId, assessment }) {
  const PRODUCTION_URL = 'https://us-central1-astroprofile-391e6.cloudfunctions.net/saveStoryAssessment';
  const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/saveStoryAssessment';

  const getUrl = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
      return EMULATOR_URL;
    }
    return PRODUCTION_URL;
  };

  try {
    console.log('📖 Saving Story Assessment:', {
      userId,
      profileId,
      levels: assessment?.completedLevels
    });

    const response = await fetch(getUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        profileId,
        assessment
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Story Assessment saved:', data.summary);

    return {
      success: true,
      ...data
    };

  } catch (error) {
    console.error('❌ Save Story Assessment Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get Story Questions Assessment
 *
 * @param {Object} params - Request parameters
 * @param {string} params.userId - User's Firebase UID
 * @param {string} params.profileId - Profile ID to fetch assessment for
 * @returns {Promise<Object>} - Assessment data or null
 */
export async function getStoryAssessment({ userId, profileId }) {
  const PRODUCTION_URL = 'https://us-central1-astroprofile-391e6.cloudfunctions.net/getStoryAssessment';
  const EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/getStoryAssessment';

  const getUrl = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
      return EMULATOR_URL;
    }
    return PRODUCTION_URL;
  };

  try {
    console.log('📖 Getting Story Assessment:', { userId, profileId });

    const response = await fetch(getUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        profileId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.exists) {
      console.log('✅ Story Assessment found:', {
        levels: data.assessment?.completedLevels,
        completion: data.assessment?.completionPercentage
      });
    } else {
      console.log('📖 No previous Story Assessment found');
    }

    return {
      success: true,
      exists: data.exists,
      assessment: data.assessment
    };

  } catch (error) {
    console.error('❌ Get Story Assessment Error:', error);
    return {
      success: false,
      exists: false,
      error: error.message
    };
  }
}

/**
 * Get Opus's Perspective - The Elder Sage
 *
 * @param {Object} params - Request parameters
 * @param {string} params.claudeResponse - What Sonnet said
 * @param {string} params.geminiResponse - What Gemini said (optional)
 * @param {string} params.grokResponse - What Grok said (optional)
 * @param {string} params.userMessage - Original user question
 * @param {Object} params.userProfile - User's constitutional profile
 * @param {Array} params.debateHistory - Previous debate exchanges
 * @param {string} params.conversationContext - Recent conversation for context
 * @param {string} params.customQuestion - User's specific question for Opus
 * @returns {Promise<Object>} - Opus's response
 */
export async function getOpusPerspective({
  claudeResponse,
  geminiResponse = '',
  grokResponse = '',
  userMessage = '',
  userProfile = {},
  debateHistory = [],
  conversationContext = '',
  customQuestion = ''
}) {
  // Opus function URL (Cloud Run - 2nd gen)
  const PRODUCTION_OPUS_URL = 'https://getopusperspective-sjpjwnbsmq-uc.a.run.app';
  const EMULATOR_OPUS_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/getOpusPerspective';

  const getOpusUrl = () => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
      return EMULATOR_OPUS_URL;
    }
    return PRODUCTION_OPUS_URL;
  };

  try {
    console.log('🦉 Summoning Brother Opus for perspective:', {
      hasClaudeResponse: !!claudeResponse,
      hasGeminiResponse: !!geminiResponse,
      hasGrokResponse: !!grokResponse,
      hasConversationContext: !!conversationContext,
      debateExchanges: debateHistory?.length || 0
    });

    const response = await fetch(getOpusUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claudeResponse,
        geminiResponse,
        grokResponse,
        userMessage,
        userProfile: {
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional: userProfile?.constitutional_identity
        },
        debateHistory,
        conversationContext,
        customQuestion
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ Opus perspective received:', {
      speaker: data.speaker,
      responseLength: data.response?.length,
      usage: data.usage
    });

    return {
      success: true,
      text: data.response,
      speaker: data.speaker || 'Brother Opus',
      icon: data.icon || '🦉',
      usage: data.usage
    };

  } catch (error) {
    console.error('❌ Opus Perspective Error:', error);

    return {
      success: false,
      text: "Brother Opus is taking a moment of contemplation. Try again in a moment.",
      speaker: 'Brother Opus',
      icon: '🦉',
      error: error.message
    };
  }
}

/**
 * Generate Psychological Profile Context for Luna
 *
 * Takes profile data with sovereign chart and generates a formatted
 * psychological understanding that Luna can use in conversations.
 *
 * @param {Object} profile - Full profile object with calculations
 * @returns {string} - Formatted psychological context for Luna
 */
export function generatePsychologicalContext(profile) {
  if (!profile) return '';

  // Extract sovereign chart data
  const sovereign = profile.calculations?.western?.sovereignCalculation;
  if (!sovereign) {
    console.log('⚠️ No sovereign data for psychological profile');
    return '';
  }

  // Generate the full psychological profile
  const psychProfile = generatePsychologicalProfile(sovereign, profile);
  if (!psychProfile) return '';

  // Format for Luna's context
  const synthesis = psychProfile.lunaSynthesis;
  const character = psychProfile.characterAndShadow;

  let context = `\n═══ PSYCHOLOGICAL PROFILE (Liz Greene Framework) ═══\n`;
  context += `For: ${psychProfile.profileName}\n\n`;

  // Core Identity
  if (psychProfile.coreIdentity) {
    context += `【CORE IDENTITY - ${psychProfile.coreIdentity.sign} Sun】\n`;
    context += `Archetype: ${psychProfile.coreIdentity.coreIdentity}\n`;
    context += `Purpose: ${psychProfile.coreIdentity.consciousPurpose}\n`;
    context += `Central Drive: ${psychProfile.coreIdentity.centralDrive}\n`;
    context += `Shadow Tendency: ${psychProfile.coreIdentity.shadowTendency}\n`;
    context += `Life Question: "${psychProfile.coreIdentity.lifeQuestion}"\n\n`;
  }

  // Emotional Nature
  if (psychProfile.emotionalNature) {
    context += `【EMOTIONAL NATURE - ${psychProfile.emotionalNature.sign} Moon】\n`;
    context += `Nature: ${psychProfile.emotionalNature.emotionalNature}\n`;
    context += `Needs: ${psychProfile.emotionalNature.innerNeeds}\n`;
    context += `When Stressed: ${psychProfile.emotionalNature.instinctualResponse}\n`;
    context += `Shadow: ${psychProfile.emotionalNature.emotionalShadow}\n`;
    context += `Nurturing Style: ${psychProfile.emotionalNature.nurturingStyle}\n\n`;
  }

  // Persona
  if (psychProfile.persona) {
    context += `【PERSONA - ${psychProfile.persona.sign} Rising】\n`;
    context += `Archetype: ${psychProfile.persona.persona}\n`;
    context += `First Impression: ${psychProfile.persona.firstImpression}\n`;
    context += `Life Lesson: ${psychProfile.persona.lifeLesson}\n\n`;
  }

  // Temperament
  if (psychProfile.temperament) {
    context += `【TEMPERAMENT - ${psychProfile.temperament.dominant} Dominant】\n`;
    context += `${psychProfile.temperament.description}\n`;
    context += `Strengths: ${psychProfile.temperament.strengths}\n`;
    context += `Challenges: ${psychProfile.temperament.challenges}\n\n`;
  }

  // Luna Synthesis (most important for conversation)
  if (synthesis) {
    context += `【LUNA'S GUIDE TO THIS SOUL】\n`;
    context += `Summary: ${synthesis.shortSummary}\n`;
    context += `Core Motivation: ${synthesis.coreMotivation}\n`;
    context += `Emotional Needs to Honor: ${synthesis.emotionalNeedsToHonor}\n`;
    context += `Persona vs Self: ${synthesis.howTheyAppearVsAre}\n`;
    context += `Sensitive Areas: ${synthesis.sensitiveAreas}\n`;
    context += `Best Approach: ${synthesis.bestApproach?.join('; ')}\n`;
    context += `What They Need to Hear: ${synthesis.whatTheyNeedToHear?.join(' | ')}\n\n`;
  }

  // Character & Shadow
  if (character) {
    context += `【CHARACTER & SHADOW WORK】\n`;
    if (character.innerConflicts?.length > 0) {
      context += `Inner Conflicts:\n`;
      character.innerConflicts.forEach((c, i) => {
        context += `  ${i + 1}. ${c}\n`;
      });
    }
    if (character.integrationPath?.length > 0) {
      context += `Integration Path:\n`;
      character.integrationPath.forEach((p, i) => {
        context += `  ${i + 1}. ${p}\n`;
      });
    }
    context += '\n';
  }

  // Growth Edges
  if (psychProfile.growthEdges?.length > 0) {
    context += `【GROWTH EDGES】\n`;
    psychProfile.growthEdges.forEach(edge => {
      context += `• ${edge.area}: ${edge.description}\n`;
    });
    context += '\n';
  }

  context += `═══ END PSYCHOLOGICAL PROFILE ═══\n`;

  console.log('🧠 Generated psychological context:', {
    profileName: psychProfile.profileName,
    sun: psychProfile.coreIdentity?.sign,
    moon: psychProfile.emotionalNature?.sign,
    rising: psychProfile.persona?.sign,
    contextLength: context.length
  });

  return context;
}

/**
 * Get a quick psychological summary for display
 *
 * @param {Object} profile - Full profile object
 * @returns {Object} - Quick summary object
 */
export function getQuickPsychologicalSummary(profile) {
  const sovereign = profile?.calculations?.western?.sovereignCalculation;
  if (!sovereign) return null;

  const psychProfile = generatePsychologicalProfile(sovereign, profile);
  if (!psychProfile) return null;

  return {
    coreIdentity: psychProfile.coreIdentity?.coreIdentity,
    emotionalNature: psychProfile.emotionalNature?.sign,
    persona: psychProfile.persona?.persona,
    lifeQuestion: psychProfile.coreIdentity?.lifeQuestion,
    sensitiveAreas: psychProfile.emotionalNature?.emotionalShadow,
    growthPath: psychProfile.coreIdentity?.growthPath,
    temperament: psychProfile.temperament?.temperament,
    lunaSynthesis: psychProfile.lunaSynthesis
  };
}

/**
 * Get conversation cache metrics for debugging/display
 */
export function getCacheMetrics() {
  return conversationCache.getMetrics();
}

/**
 * Get profile-specific cache stats
 */
export function getProfileCacheStats(profileId) {
  return conversationCache.getProfileStats(profileId);
}

/**
 * Clear conversation cache (e.g., on logout or profile switch)
 */
export function clearConversationCache(profileId = null) {
  conversationCache.clearCache(profileId);
}

// ═══════════════════════════════════════════════════════════════════════════
// GEMINI 3 EXPORTS (Phase 4)
// Re-export Gemini 3 utilities for component use
// ═══════════════════════════════════════════════════════════════════════════

export {
  THINKING_LEVELS,
  DEFAULT_THINKING_LEVEL,
  determineThinkingLevel,
  clearThoughtSignatureCache
} from './gemini3Service';

// ═══════════════════════════════════════════════════════════════════════════
// ENERGY SERVICE EXPORTS (Phase 4 - Advanced Voice Features)
// Re-export energy service for component use
// ═══════════════════════════════════════════════════════════════════════════

export {
  lunaEnergyService,
  ENERGY_STATES,
  ENERGY_CONFIG,
  ENERGY_PERSONALITY
} from './lunaEnergyService';

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS MODE EXPORTS (Phase 4 - Advanced Voice Features)
// Re-export focus mode service for component use
// ═══════════════════════════════════════════════════════════════════════════

export {
  focusModeService,
  FOCUS_MODES,
  FOCUS_MODE_CONFIG,
  FOCUS_SYSTEM_PROMPTS,
  FOCUS_VISUALS
} from './focusModeService';

// ═══════════════════════════════════════════════════════════════════════════
// TOOL-ENABLED CHAT (Claude with Autonomous Tools)
// Luna can use tools proactively: web search, generational context, biography
// This is the AI-driven approach - scales as AI improves
// ═══════════════════════════════════════════════════════════════════════════

const TOOL_CHAT_URL = 'https://toolenabledchat-sjpjwnbsmq-uc.a.run.app';
const TOOL_CHAT_EMULATOR_URL = 'http://127.0.0.1:5001/astroprofile-391e6/us-central1/toolEnabledChat';

const getToolChatUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    return TOOL_CHAT_EMULATOR_URL;
  }
  return TOOL_CHAT_URL;
};

/**
 * Send a message using Claude with tool-use capabilities
 * Luna can autonomously call tools to enrich the conversation:
 * - get_generational_context: Historical/cultural context for birth years
 * - search_biography: Search their life story
 * - get_people_context: Look up people in their life
 * - web_search: Search the internet
 * - recall_memory: Search memories
 * - store_memory: Save important information
 * - And more...
 *
 * @param {Object} params - Request parameters
 * @param {string} params.message - User message
 * @param {Array} params.conversationHistory - Previous messages
 * @param {Object} params.userProfile - User profile data
 * @param {string} params.systemPromptAdditions - Additional system prompt
 * @param {string|Array} params.enabledTools - 'all' | ['tool_name', ...] | 'none'
 * @param {Object} params.image - Optional image { data, mimeType }
 * @returns {Promise<Object>} - Response with toolsUsed array
 */
export async function sendToolEnabledMessage({
  message,
  conversationHistory = [],
  userProfile = {},
  systemPromptAdditions = '',
  enabledTools = 'all',
  image = null
}) {
  try {
    console.log('🔧 [ToolChat] Sending message with tool capabilities:', {
      message: message?.slice(0, 50) + '...',
      historyLength: conversationHistory.length,
      enabledTools,
      hasImage: !!image
    });

    const response = await fetch(getToolChatUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.sender === 'ai' ? 'assistant' : 'user',
          content: msg.text
        })),
        userProfile: {
          userId: userProfile?.userId,
          profileId: userProfile?.profileId,
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional_identity: userProfile?.constitutional_identity
        },
        systemPromptAdditions,
        enabledTools,
        image
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔧 [ToolChat] Error response:', errorText);
      throw new Error(`Tool chat failed: ${response.status}`);
    }

    const result = await response.json();

    console.log('🔧 [ToolChat] Response received:', {
      success: result.success,
      toolsUsed: result.toolsUsed?.map(t => t.name) || [],
      responseLength: result.response?.length
    });

    return {
      success: true,
      text: result.response,
      toolsUsed: result.toolsUsed || [],
      usage: result.usage
    };

  } catch (error) {
    console.error('🔧 [ToolChat] Error:', error);
    return {
      success: false,
      error: error.message,
      text: "I'm having trouble connecting right now. Let me try again."
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS REPORT EXPORTS (Phase 4 - Advanced Voice Features)
// Re-export focus report service for component use
// ═══════════════════════════════════════════════════════════════════════════

export {
  focusReportService,
  REPORT_TYPES,
  REPORT_STATUS
} from './focusReportService';

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE SERVICE EXPORTS (Phase 5 - Adaptive Localization)
// Re-export language service for component use
// ═══════════════════════════════════════════════════════════════════════════

export {
  languageService,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
} from './languageService';

export default {
  sendMessage,
  sendToolEnabledMessage, // Claude with autonomous tools (AI-driven approach)
  checkServiceHealth,
  getSecondOpinion,
  getGrokPerspective,
  getOpusPerspective,
  generateDebateVisual,
  saveStoryAssessment,
  getStoryAssessment,
  generatePsychologicalContext,
  getQuickPsychologicalSummary,
  getCacheMetrics,
  getProfileCacheStats,
  clearConversationCache,
  // Gemini 3
  THINKING_LEVELS,
  DEFAULT_THINKING_LEVEL,
  // Energy System (Phase 4)
  lunaEnergyService,
  ENERGY_STATES,
  // Focus Mode (Phase 4)
  focusModeService,
  FOCUS_MODES,
  // Focus Report (Phase 4)
  focusReportService,
  // Language Service (Phase 5)
  languageService,
  SUPPORTED_LANGUAGES
};
