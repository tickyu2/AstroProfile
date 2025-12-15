/**
 * AI SoulPartner Service
 *
 * Frontend service for calling the Claude API via Firebase Cloud Function.
 * Sends messages with Constitutional Intelligence guidance and receives responses.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

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
 * @returns {Promise<Object>} - AI response with metadata
 */
export async function sendMessage({ message, guidance, conversationHistory = [], userProfile = {}, knowledgePrompt = '', learnedContext = null, image = null }) {
  try {
    console.log('🚀 Sending to AI SoulPartner:', {
      message: message?.slice(0, 50) + '...',
      mode: guidance?.mode,
      historyLength: conversationHistory.length,
      hasKnowledge: !!knowledgePrompt,
      knowledgeLength: knowledgePrompt?.length || 0,
      hasLearnedContext: !!learnedContext,
      hasImage: !!image
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
          intensity: guidance?.intensity
        },
        conversationHistory: conversationHistory.map(msg => ({
          sender: msg.sender,
          text: msg.text,
          // Include reaction data so Brother can see what user liked/loved
          reactions: formatReactionsForContext(msg.reactions)
        })),
        userProfile: {
          displayName: userProfile?.displayName || userProfile?.firstName || 'Friend',
          constitutional: userProfile?.constitutional_identity,
          personality: userProfile?.personality,
          aiNotes: userProfile?.aiSoulPartner  // Notes from previous conversations
        },
        knowledgePrompt,  // Pre-built knowledge base prompt
        learnedContext,   // Session Intelligence learned patterns context
        image  // Optional image for vision { dataUrl, type }
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
      usage: data.usage
    });

    // If image was generated, include it in response
    if (data.generatedImage) {
      console.log('🎨 Image generated via Nano Banana');
    }

    return {
      success: true,
      text: data.response,
      mode: data.mode,
      usage: data.usage,
      generatedImage: data.generatedImage || null  // { mimeType, data, prompt }
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
      const errorData = await response.json().catch(() => ({}));
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

export default {
  sendMessage,
  checkServiceHealth,
  getSecondOpinion,
  getGrokPerspective,
  generateDebateVisual
};
