/**
 * GUEST CHAT SERVICE
 *
 * Client-side service that calls the Cloud Function for guest chat.
 * No direct Firestore writes - all Brain writes happen server-side.
 *
 * Features:
 * - sendGuestMessage: Regular guest conversation with optional Luna coaching
 * - sendLunaPrivateQuery: Private Luna consultation without involving guest
 * - getGuestSecondOpinion: Sister Gemini's perspective on guest response
 * - getGuestOpusPerspective: Brother Opus's perspective on guest response
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

// Cloud Run URLs for AI Constellation
const GEMINI_URL = 'https://getsecondopinion-sjpjwnbsmq-uc.a.run.app';
const OPUS_URL = 'https://getopusperspective-sjpjwnbsmq-uc.a.run.app';
const GROK_URL = 'https://getgrokperspective-sjpjwnbsmq-uc.a.run.app';
const DEEPSEEK_URL = 'https://getdeepseekperspective-sjpjwnbsmq-uc.a.run.app';
const CHATGPT_URL = 'https://getchatgptperspective-sjpjwnbsmq-uc.a.run.app';

// Get functions instance
const functions = getFunctions();

// Callable function references
const guestChatFn = httpsCallable(functions, 'guestChat');
const lunaPrivateFn = httpsCallable(functions, 'lunaPrivateQuery');

/**
 * Format conversation history into readable string for AI Constellation
 */
function formatConversationForConstellation(history, guestName) {
  if (!history || history.length === 0) {
    return 'No conversation yet.';
  }

  return history.slice(-8).map(m => {
    const role = m.sender_role === 'user' ? 'USER' :
                 m.sender_role === 'luna_private' ? 'LUNA (private coaching)' :
                 m.sender_role === 'user_private' ? 'USER (to Luna)' :
                 m.sender_role === 'constellation' ? m.constellation_speaker?.toUpperCase() || 'AI' :
                 guestName?.toUpperCase() || 'GUEST';
    return `${role}: ${m.content?.text || ''}`;
  }).join('\n\n');
}

/**
 * Send message to guest and get response
 *
 * @param {Object} params - Chat parameters
 * @param {string} params.partnerId - Guest profile ID (e.g., 'historical_einstein')
 * @param {string} params.userMessage - User's message text
 * @param {Array} params.conversationHistory - Recent messages for context
 * @param {Object} params.guestProfile - Guest profile data
 * @param {Object} params.userConstitutional - User's Brain 1A data
 * @param {Array} params.learnedFacts - Brain 1B learned facts
 * @param {string} params.lunaMode - 'active' or 'silent'
 * @param {string} params.userProfileId - User's AstroProfile ID (for compartmentalization)
 * @param {string} params.userProfileName - User's profile display name
 * @returns {Promise<Object>} Response with guestResponse and optional lunaCoaching
 */
export async function sendGuestMessage({
  partnerId,
  userMessage,
  conversationHistory,
  guestProfile,
  userConstitutional,
  learnedFacts,
  lunaMode,
  userProfileId,
  userProfileName
}) {
  try {
    const result = await guestChatFn({
      partnerId,
      userMessage,
      conversationHistory: conversationHistory.slice(-10), // Last 10 messages
      guestProfile: {
        profile_name: guestProfile?.profile_name,
        profile_type: guestProfile?.profile_type,
        ai_config: guestProfile?.ai_config
      },
      userConstitutional,
      learnedFacts,
      lunaMode,
      // Compartmentalization: which user profile is chatting
      userProfileId,
      userProfileName
    });

    return result.data;

  } catch (error) {
    console.error('Guest chat service error:', error);
    throw error;
  }
}

/**
 * Send private query to Luna for coaching advice
 * This does NOT involve the guest - it's a private sidebar with Luna
 *
 * @param {Object} params - Query parameters
 * @param {string} params.userQuestion - User's private question for Luna
 * @param {string} params.guestName - Name of guest they're talking to (context)
 * @param {string} params.guestType - Type of guest (historical_figure, etc.)
 * @param {Array} params.conversationHistory - Recent messages for context
 * @param {Object} params.userConstitutional - User's Brain 1A data
 * @returns {Promise<Object>} Luna's private advice
 */
export async function sendLunaPrivateQuery({
  userQuestion,
  guestName,
  guestType,
  conversationHistory,
  userConstitutional
}) {
  try {
    const result = await lunaPrivateFn({
      userQuestion,
      guestContext: {
        name: guestName,
        type: guestType
      },
      conversationHistory: conversationHistory.slice(-10), // Last 10 for context
      userConstitutional
    });

    return result.data;

  } catch (error) {
    console.error('Luna private query error:', error);
    throw error;
  }
}

/**
 * Get Sister Gemini's perspective on guest response
 * AI Constellation feature - second opinion from Gemini
 *
 * @param {Object} params - Query parameters
 * @param {string} params.guestResponse - The guest's response text
 * @param {string} params.guestName - Name of guest (Einstein, etc.)
 * @param {string} params.userMessage - User's original message
 * @param {Array} params.conversationHistory - Recent messages for context
 * @param {Object} params.userConstitutional - User's Brain 1A data
 * @returns {Promise<Object>} Gemini's perspective
 */
export async function getGuestSecondOpinion({
  guestResponse,
  guestName,
  userMessage,
  conversationHistory,
  userConstitutional
}) {
  try {
    console.log('💫 Getting Sister Gemini perspective on', guestName);

    // Format the full conversation for Gemini to understand context
    const formattedConversation = formatConversationForConstellation(conversationHistory, guestName);

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claudeResponse: guestResponse, // Gemini analyzes this
        userMessage: userMessage || '',
        conversationHistory: conversationHistory?.slice(-5) || [],
        userProfile: userConstitutional || {},
        debateMode: 'guest_perspective',
        previousDebate: [],
        customQuestion: `The user is chatting with ${guestName}. Here's their conversation so far:

${formattedConversation}

Based on this full context, please share your perspective on ${guestName}'s latest response. What additional insights or alternative angles might be valuable?`
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.response || data.text || data.geminiResponse || '',
      speaker: 'gemini'
    };

  } catch (error) {
    console.error('Gemini perspective error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get Brother Opus's perspective on guest response
 * AI Constellation feature - elder sage wisdom from Opus
 *
 * @param {Object} params - Query parameters
 * @param {string} params.guestResponse - The guest's response text
 * @param {string} params.guestName - Name of guest (Einstein, etc.)
 * @param {string} params.userMessage - User's original message
 * @param {Array} params.conversationHistory - Recent messages for context
 * @param {Object} params.userConstitutional - User's Brain 1A data
 * @returns {Promise<Object>} Opus's perspective
 */
export async function getGuestOpusPerspective({
  guestResponse,
  guestName,
  userMessage,
  conversationHistory,
  userConstitutional
}) {
  try {
    console.log('🦉 Summoning Brother Opus perspective on', guestName);

    // Format the full conversation for Opus to understand context
    const formattedConversation = formatConversationForConstellation(conversationHistory, guestName);

    const response = await fetch(OPUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claudeResponse: guestResponse, // Opus analyzes this
        geminiResponse: '',
        grokResponse: '',
        userMessage: userMessage || '',
        userProfile: userConstitutional || {},
        debateHistory: [],
        conversationContext: `User is chatting with ${guestName} (historical/modern guest mentor).

FULL CONVERSATION SO FAR:
${formattedConversation}`,
        customQuestion: `Based on this conversation with ${guestName}, what deeper wisdom or alternative perspective can you offer? Consider the full context of their exchange.`
      })
    });

    if (!response.ok) {
      throw new Error(`Opus request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.response || data.text || data.opusResponse || '',
      speaker: 'opus'
    };

  } catch (error) {
    console.error('Opus perspective error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get Brother Grok's perspective on guest response
 * AI Constellation feature - human zeitgeist wisdom from Grok
 */
export async function getGuestGrokPerspective({
  guestResponse,
  guestName,
  userMessage,
  conversationHistory,
  userConstitutional
}) {
  try {
    console.log('🌍 Summoning Brother Grok perspective on', guestName);

    const formattedConversation = formatConversationForConstellation(conversationHistory, guestName);

    const response = await fetch(GROK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claudeResponse: guestResponse,
        geminiResponse: '',
        userMessage: userMessage || '',
        userProfile: userConstitutional || {},
        debateHistory: [],
        customQuestion: `The user is chatting with ${guestName}. Here's their conversation so far:

${formattedConversation}

Based on this full context, what's the real human perspective on ${guestName}'s latest response? What are people actually thinking and feeling about this?`
      })
    });

    if (!response.ok) {
      throw new Error(`Grok request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.response || data.text || '',
      speaker: 'grok'
    };

  } catch (error) {
    console.error('Grok perspective error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get Brother DeepSeek's perspective on guest response
 * AI Constellation feature - Eastern wisdom from DeepSeek
 */
export async function getGuestDeepSeekPerspective({
  guestResponse,
  guestName,
  userMessage,
  conversationHistory,
  userConstitutional
}) {
  try {
    console.log('🐉 Summoning Brother DeepSeek perspective on', guestName);

    const formattedConversation = formatConversationForConstellation(conversationHistory, guestName);

    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claudeResponse: guestResponse,
        geminiResponse: '',
        grokResponse: '',
        userMessage: userMessage || '',
        userProfile: userConstitutional || {},
        debateHistory: [],
        customQuestion: `The user is chatting with ${guestName}. Here's their conversation so far:

${formattedConversation}

Based on this full context, what Eastern wisdom and balanced perspective can you offer on ${guestName}'s latest response? Where is the harmony?`
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.response || data.text || '',
      speaker: 'deepseek'
    };

  } catch (error) {
    console.error('DeepSeek perspective error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get Sister ChatGPT's perspective on guest response
 * AI Constellation feature - analytical reasoning from ChatGPT
 */
export async function getGuestChatGPTPerspective({
  guestResponse,
  guestName,
  userMessage,
  conversationHistory,
  userConstitutional
}) {
  try {
    console.log('🧪 Summoning Sister ChatGPT perspective on', guestName);

    const formattedConversation = formatConversationForConstellation(conversationHistory, guestName);

    const response = await fetch(CHATGPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claudeResponse: guestResponse,
        geminiResponse: '',
        grokResponse: '',
        userMessage: userMessage || '',
        userProfile: userConstitutional || {},
        debateHistory: [],
        customQuestion: `The user is chatting with ${guestName}. Here's their conversation so far:

${formattedConversation}

Based on this full context, provide your analytical perspective on ${guestName}'s latest response. Think through this step by step - what are the key considerations?`
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.response || data.text || '',
      speaker: 'chatgpt'
    };

  } catch (error) {
    console.error('ChatGPT perspective error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  sendGuestMessage,
  sendLunaPrivateQuery,
  getGuestSecondOpinion,
  getGuestOpusPerspective,
  getGuestGrokPerspective,
  getGuestDeepSeekPerspective,
  getGuestChatGPTPerspective
};
