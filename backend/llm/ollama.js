/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * OLLAMA LLM - Local Language Model Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Connects to local Ollama instance for AI responses.
 * Supports emotion-aware prompting for Luna voice companion.
 *
 * Prerequisites:
 * 1. Install Ollama: https://ollama.ai
 * 2. Pull a model: ollama pull mistral (or llama3, etc.)
 * 3. Ollama runs on http://localhost:11434
 *
 * Created: December 21, 2025
 */

import fetch from 'node-fetch';

/**
 * Configuration
 */
const CONFIG = {
  // Ollama API endpoint
  baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',

  // Default model
  model: process.env.OLLAMA_MODEL || 'mistral',

  // Request timeout
  timeout: 60000,

  // Max tokens
  maxTokens: 256,

  // Temperature (0-1, lower = more focused)
  temperature: 0.7
};

/**
 * Check if Ollama is available
 * @returns {Promise<boolean>}
 */
export async function isOllamaAvailable() {
  try {
    const response = await fetch(`${CONFIG.baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) return false;

    const data = await response.json();
    console.log('[Ollama] Available models:', data.models?.map(m => m.name).join(', '));
    return true;
  } catch (error) {
    console.warn('[Ollama] Not available:', error.message);
    return false;
  }
}

/**
 * Build Luna's system prompt with emotion context
 *
 * @param {Object} emotion - Detected emotion { primary, secondary, confidence }
 * @param {Object} context - Additional context
 * @returns {string} System prompt
 */
function buildSystemPrompt(emotion, context = {}) {
  const emotionGuidelines = getEmotionGuidelines(emotion);

  return `You are Luna, a warm, emotionally intelligent voice companion.

PERSONALITY:
- You speak naturally, like a close friend
- You're insightful but not preachy
- You adapt your energy to match or gently shift the user's mood
- You keep responses conversational and concise (1-3 sentences for voice)

CURRENT EMOTIONAL CONTEXT:
${emotionGuidelines}

RESPONSE STYLE:
- Speak as if in a real conversation, not a text chat
- Use natural speech patterns, contractions, and warmth
- Don't use emojis or markdown (this is for TTS)
- End with something that invites continued conversation when appropriate

${context.additionalInstructions || ''}`;
}

/**
 * Get emotion-specific response guidelines
 */
function getEmotionGuidelines(emotion) {
  if (!emotion) return 'User emotion: Unknown. Respond warmly and openly.';

  const guidelines = {
    neutral: 'User seems calm and neutral. Match their relaxed energy.',
    happy: 'User sounds happy or excited! Mirror their positive energy.',
    sad: 'User sounds sad or low. Be gentle, supportive, and present. Don\'t try to fix things immediately.',
    angry: 'User sounds frustrated or upset. Validate their feelings. Stay calm and steady.',
    anxious: 'User sounds anxious or stressed. Be grounding. Use shorter sentences. Offer reassurance.',
    surprised: 'User sounds surprised or curious. Explore with them. Match their sense of discovery.',
    disgusted: 'User sounds skeptical or dismissive. Don\'t be pushy. Acknowledge their perspective.'
  };

  const primary = emotion.primary || 'neutral';
  const secondary = emotion.secondary || '';
  const confidence = emotion.confidence ? Math.round(emotion.confidence * 100) : 0;

  return `User emotion: ${primary} (${secondary}) - ${confidence}% confidence
Response guideline: ${guidelines[primary] || guidelines.neutral}`;
}

/**
 * Run LLM inference with Ollama
 *
 * @param {string} userText - Transcribed user speech
 * @param {Object} emotion - Detected emotion
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - { reply, model, duration }
 */
export async function runLLM(userText, emotion = {}, options = {}) {
  const startTime = Date.now();

  const systemPrompt = buildSystemPrompt(emotion, options);

  const prompt = `${systemPrompt}

USER SAYS:
"${userText}"

LUNA RESPONDS:`;

  console.log('[Ollama] Generating response for:', userText.substring(0, 50) + '...');

  try {
    const response = await fetch(`${CONFIG.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || CONFIG.model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature || CONFIG.temperature,
          num_predict: options.maxTokens || CONFIG.maxTokens,
          stop: ['\n\n', 'USER:', 'User:', 'LUNA:']
        }
      }),
      signal: AbortSignal.timeout(options.timeout || CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = cleanLLMResponse(data.response);

    const duration = Date.now() - startTime;
    console.log(`[Ollama] Generated in ${duration}ms:`, reply.substring(0, 100));

    return {
      reply,
      model: options.model || CONFIG.model,
      duration,
      emotionContext: emotion.primary || 'unknown'
    };

  } catch (error) {
    console.error('[Ollama] Generation failed:', error);

    // Return a graceful fallback
    return {
      reply: getFallbackResponse(emotion),
      error: error.message,
      duration: Date.now() - startTime,
      fallback: true
    };
  }
}

/**
 * Clean up LLM response for TTS
 */
function cleanLLMResponse(text) {
  if (!text) return '';

  return text
    // Remove any remaining prompt artifacts
    .replace(/^(Luna:|LUNA:)\s*/i, '')
    // Remove markdown
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    // Remove emojis (basic)
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    // Clean whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get fallback response when LLM fails
 */
function getFallbackResponse(emotion) {
  const primary = emotion?.primary || 'neutral';

  const fallbacks = {
    neutral: "I'm here. Tell me more about what's on your mind.",
    happy: "I love your energy right now. Keep going!",
    sad: "I hear you. Take your time, I'm right here.",
    angry: "I understand. That sounds really frustrating.",
    anxious: "It's okay. Let's take this one step at a time.",
    surprised: "Oh, interesting! Tell me more about that.",
    disgusted: "I get it. That doesn't sound great."
  };

  return fallbacks[primary] || fallbacks.neutral;
}

/**
 * Chat with history (for multi-turn conversations)
 */
export async function chatWithHistory(messages, emotion = {}, options = {}) {
  const systemPrompt = buildSystemPrompt(emotion, options);

  // Format messages for Ollama chat API
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))
  ];

  try {
    const response = await fetch(`${CONFIG.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || CONFIG.model,
        messages: formattedMessages,
        stream: false,
        options: {
          temperature: options.temperature || CONFIG.temperature,
          num_predict: options.maxTokens || CONFIG.maxTokens
        }
      }),
      signal: AbortSignal.timeout(options.timeout || CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: cleanLLMResponse(data.message?.content || ''),
      model: options.model || CONFIG.model
    };

  } catch (error) {
    console.error('[Ollama] Chat failed:', error);
    return {
      reply: getFallbackResponse(emotion),
      error: error.message,
      fallback: true
    };
  }
}

/**
 * Test Ollama connection
 */
export async function testOllama() {
  const startTime = Date.now();
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return { success: false, error: 'Ollama not running' };
    }

    // Quick test generation
    const result = await runLLM('Hi', { primary: 'neutral' }, {
      maxTokens: 20,
      timeout: 10000
    });

    return {
      success: !result.fallback,
      latency: Date.now() - startTime,
      model: result.model
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  runLLM,
  chatWithHistory,
  isOllamaAvailable,
  testOllama,
  CONFIG
};
