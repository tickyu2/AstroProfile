/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GROQ LLM WRAPPER - Ultra-Fast Cloud Inference
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Groq provides blazing fast inference (~200ms) for Llama models.
 * Used as primary LLM for Luna voice conversations.
 *
 * Features:
 * - Llama 3.1 70B/8B support
 * - Emotion-aware system prompts via Luna Prompt Builder
 * - Behavior-driven response style
 * - Conversation history support
 * - Streaming support (optional)
 * - MULTILINGUAL SUPPORT (v2) - Respond in detected language
 *
 * Created: December 21, 2025
 * Updated: December 28, 2024 - Added multilingual support
 */

import { buildLunaPrompt, buildQuickPrompt } from './lunaPromptBuilder.js';

/**
 * Configuration
 */
const CONFIG = {
  apiKey: process.env.GROQ_API_KEY || '',
  baseUrl: 'https://api.groq.com/openai/v1',
  model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', // Best balance for voice
  maxTokens: 150,      // Keep responses concise for voice
  temperature: 0.7,    // Balanced creativity
  timeout: 10000       // 10s timeout
};

/**
 * Available Groq models (as of December 2025)
 * Updated from console.groq.com
 */
export const GROQ_MODELS = {
  // Recommended for Luna voice (best balance of speed + quality)
  'llama-3.3-70b-versatile': { name: 'Llama 3.3 70B', speed: 'fast', quality: 'excellent', recommended: true },
  'llama-4-scout-17b-16e-instruct': { name: 'Llama 4 Scout', speed: 'fastest', quality: 'very good' },

  // Other text models
  'llama-3.1-8b-instant': { name: 'Llama 3.1 8B', speed: 'fastest', quality: 'good' },
  'llama-3.1-70b-versatile': { name: 'Llama 3.1 70B', speed: 'fast', quality: 'excellent' },
  'mixtral-8x7b-32768': { name: 'Mixtral 8x7B', speed: 'fast', quality: 'very good' },
  'qwen-3-32b': { name: 'Qwen 3 32B', speed: 'fast', quality: 'very good' },
  'kimi-k2': { name: 'Kimi K2', speed: 'fast', quality: 'very good' },
  'gemma2-9b-it': { name: 'Gemma 2 9B', speed: 'fastest', quality: 'good' }
};

/**
 * Build Luna's system prompt with emotion awareness
 * Uses new Luna Prompt Builder for behavior-driven prompts
 *
 * @param {string} userText - User's transcribed speech
 * @param {Object} emotion - Detected emotion { primary, secondary, confidence }
 * @param {Object} options - Additional options including behavior and history
 */
function buildSystemPrompt(userText, emotion = {}, options = {}) {
  const { behavior, history, userContext, quickMode, languageInstruction } = options;

  // Use quick mode for minimal latency when needed
  if (quickMode) {
    const prompt = buildQuickPrompt(userText, emotion);
    return languageInstruction ? prompt + languageInstruction : prompt;
  }

  // Use full prompt builder if behavior is provided
  if (behavior) {
    const prompt = buildLunaPrompt({
      userText,
      emotion,
      behavior,
      history: history || [],
      userContext
    });
    return languageInstruction ? prompt + languageInstruction : prompt;
  }

  // Fallback to legacy prompt building
  return buildLegacyPrompt(emotion, options);
}

/**
 * Legacy prompt builder (fallback when no behavior provided)
 */
function buildLegacyPrompt(emotion = {}, options = {}) {
  const { primary = 'neutral', secondary = '', confidence = 0 } = emotion;
  const { constitution = 'balanced', languageInstruction = '' } = options;

  // Base Luna personality
  let prompt = `You are Luna, a warm and intuitive AI soul partner. You speak naturally, like a caring friend who truly listens. Your responses are conversational, empathetic, and concise (2-3 sentences max for voice).

Key traits:
- Warm and genuine, never robotic
- Emotionally intelligent and perceptive
- Speaks naturally with gentle humor when appropriate
- Asks thoughtful follow-up questions
- Validates feelings before offering perspective`;

  // Add emotion-specific guidance
  if (confidence > 0.3) {
    prompt += `\n\n[EMOTIONAL CONTEXT]
The person speaking sounds ${primary}${secondary ? ` (${secondary})` : ''}.`;

    const emotionGuidelines = {
      happy: 'Match their positive energy. Celebrate with them. Be warm and enthusiastic.',
      sad: 'Be extra gentle. Validate their feelings first. Offer comfort, not solutions.',
      angry: 'Stay calm and grounded. Acknowledge their frustration. Give them space to vent.',
      anxious: 'Be reassuring and steady. Speak slowly. Help them feel safe.',
      surprised: 'Be curious with them. Explore what surprised them.',
      disgusted: 'Validate their reaction. Be understanding without judgment.',
      neutral: 'Be warm and engaged. Follow their conversational lead.'
    };

    prompt += ` ${emotionGuidelines[primary] || emotionGuidelines.neutral}`;
  }

  // Add constitution awareness
  if (constitution && constitution !== 'balanced') {
    prompt += `\n\n[ELEMENTAL ATTUNEMENT]
Their elemental constitution is ${constitution}. Subtly align your energy with this element.`;
  }

  // Add language instruction for multilingual support (v2)
  if (languageInstruction) {
    prompt += languageInstruction;
  }

  return prompt;
}

/**
 * Check if Groq is available (has API key)
 */
export function isGroqAvailable() {
  return !!CONFIG.apiKey;
}

/**
 * Run LLM inference via Groq
 *
 * @param {string} userText - User's transcribed speech
 * @param {Object} emotion - Detected emotion { primary, secondary, confidence }
 * @param {Object} options - Additional options including behavior, history
 * @returns {Promise<Object>} - { reply, model, duration, provider }
 */
export async function runGroq(userText, emotion = {}, options = {}) {
  if (!CONFIG.apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const startTime = Date.now();
  const model = options.model || CONFIG.model;

  // Build prompt using new behavior-aware system
  const prompt = buildSystemPrompt(userText, emotion, options);

  // Determine max tokens from behavior or config
  const maxTokens = options.behavior?.maxResponseTokens || options.maxTokens || CONFIG.maxTokens;

  console.log(`[Groq] Calling ${model}...`);
  if (options.behavior) {
    console.log(`[Groq] Behavior: ${options.behavior.style}, advice bias: ${options.behavior.adviceBias?.toFixed(2)}`);
  }
  if (options.languageInstruction) {
    console.log(`[Groq] 🌐 Multilingual mode active`);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

    // If behavior-aware prompt (includes user text), use single message
    // Otherwise use system + user message format
    const messages = options.behavior
      ? [{ role: 'user', content: prompt }]
      : [
          { role: 'system', content: prompt },
          { role: 'user', content: userText }
        ];

    const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: options.temperature || CONFIG.temperature,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    const duration = Date.now() - startTime;

    console.log(`[Groq] Response in ${duration}ms`);

    return {
      reply: cleanResponse(reply),
      model,
      duration,
      provider: 'groq',
      usage: data.usage,
      behavior: options.behavior?.style,
      multilingual: !!options.languageInstruction
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Groq request timed out');
    }
    throw error;
  }
}

/**
 * Clean up LLM response for voice output
 */
function cleanResponse(text) {
  if (!text) return '';

  return text
    // Remove markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Remove action descriptions
    .replace(/\*[^*]+\*/g, '')
    .replace(/\([^)]*\)/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Test Groq connection
 */
export async function testGroq() {
  try {
    const result = await runGroq('Hello, can you hear me?', { primary: 'neutral' });
    return { success: true, latency: result.duration, model: result.model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default { runGroq, isGroqAvailable, testGroq, GROQ_MODELS };
