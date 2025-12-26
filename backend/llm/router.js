/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LLM ROUTER - Intelligent Provider Selection with Fallback
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Routes LLM requests to the best available provider:
 * 1. Groq (primary) - Ultra-fast cloud inference
 * 2. Ollama (fallback) - Local inference when offline
 *
 * Features:
 * - Automatic failover between providers
 * - Health checking and circuit breaker
 * - Unified interface for all providers
 * - Latency tracking and logging
 *
 * Created: December 21, 2025
 */

import { runGroq, isGroqAvailable, testGroq } from './groq.js';
import { runLLM as runOllama, testOllama } from './ollama.js';

/**
 * Provider status tracking
 */
const providerStatus = {
  groq: {
    available: false,
    lastCheck: 0,
    failCount: 0,
    avgLatency: 0
  },
  ollama: {
    available: false,
    lastCheck: 0,
    failCount: 0,
    avgLatency: 0
  }
};

/**
 * Configuration
 */
const CONFIG = {
  healthCheckInterval: 30000,  // 30s between health checks
  maxFailures: 3,              // Failures before circuit breaker opens
  circuitResetTime: 60000,     // 1 min before retrying failed provider
  preferredOrder: ['groq', 'ollama']
};

/**
 * Check provider health
 */
async function checkProviderHealth(provider) {
  const status = providerStatus[provider];
  const now = Date.now();

  // Skip if recently checked
  if (now - status.lastCheck < CONFIG.healthCheckInterval) {
    return status.available;
  }

  status.lastCheck = now;

  try {
    if (provider === 'groq') {
      if (!isGroqAvailable()) {
        status.available = false;
        return false;
      }
      const result = await testGroq();
      status.available = result.success;
      if (result.success) {
        status.avgLatency = result.latency;
        status.failCount = 0;
      }
    } else if (provider === 'ollama') {
      const result = await testOllama();
      status.available = result.success;
      if (result.success) {
        status.avgLatency = result.latency;
        status.failCount = 0;
      }
    }
  } catch (error) {
    console.error(`[LLMRouter] Health check failed for ${provider}:`, error.message);
    status.available = false;
    status.failCount++;
  }

  return status.available;
}

/**
 * Check if provider circuit breaker is open (too many failures)
 */
function isCircuitOpen(provider) {
  const status = providerStatus[provider];
  if (status.failCount >= CONFIG.maxFailures) {
    const timeSinceLastCheck = Date.now() - status.lastCheck;
    if (timeSinceLastCheck < CONFIG.circuitResetTime) {
      return true; // Circuit still open
    }
    // Reset for retry
    status.failCount = 0;
  }
  return false;
}

/**
 * Record provider failure
 */
function recordFailure(provider) {
  const status = providerStatus[provider];
  status.failCount++;
  status.lastCheck = Date.now();
  if (status.failCount >= CONFIG.maxFailures) {
    console.warn(`[LLMRouter] Circuit breaker OPEN for ${provider} after ${status.failCount} failures`);
  }
}

/**
 * Record provider success
 */
function recordSuccess(provider, latency) {
  const status = providerStatus[provider];
  status.failCount = 0;
  status.available = true;
  // Exponential moving average for latency
  status.avgLatency = status.avgLatency
    ? status.avgLatency * 0.8 + latency * 0.2
    : latency;
}

/**
 * Get ordered list of available providers
 */
async function getAvailableProviders() {
  const available = [];

  for (const provider of CONFIG.preferredOrder) {
    if (isCircuitOpen(provider)) {
      console.log(`[LLMRouter] Skipping ${provider} (circuit open)`);
      continue;
    }

    // Quick availability check
    if (provider === 'groq' && !isGroqAvailable()) {
      continue;
    }

    available.push(provider);
  }

  return available;
}

/**
 * Run LLM with automatic provider selection and fallback
 *
 * @param {string} userText - User's transcribed speech
 * @param {Object} emotion - Detected emotion
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - { reply, model, duration, provider }
 */
export async function runLLM(userText, emotion = {}, options = {}) {
  const providers = await getAvailableProviders();

  if (providers.length === 0) {
    console.error('[LLMRouter] No LLM providers available!');
    return {
      reply: getEmergencyFallback(emotion),
      model: 'fallback',
      duration: 0,
      provider: 'none'
    };
  }

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`[LLMRouter] Trying ${provider}...`);

      let result;
      if (provider === 'groq') {
        result = await runGroq(userText, emotion, options);
      } else if (provider === 'ollama') {
        result = await runOllama(userText, emotion, options);
      }

      if (result && result.reply) {
        recordSuccess(provider, result.duration);
        console.log(`[LLMRouter] Success with ${provider} in ${result.duration}ms`);
        return result;
      }

    } catch (error) {
      console.error(`[LLMRouter] ${provider} failed:`, error.message);
      recordFailure(provider);
      lastError = error;
    }
  }

  // All providers failed
  console.error('[LLMRouter] All providers failed, using emergency fallback');
  return {
    reply: getEmergencyFallback(emotion),
    model: 'fallback',
    duration: 0,
    provider: 'none',
    error: lastError?.message
  };
}

/**
 * Emergency fallback responses when all providers fail
 */
function getEmergencyFallback(emotion = {}) {
  const { primary = 'neutral' } = emotion;

  const fallbacks = {
    neutral: [
      "I'm here with you. Tell me more.",
      "I'm listening. Please continue.",
      "I hear you. What else is on your mind?"
    ],
    happy: [
      "That sounds wonderful! Tell me more about it.",
      "I love hearing that energy! What happened?",
      "That's great! I'd love to hear the details."
    ],
    sad: [
      "I'm here for you. Take your time.",
      "That sounds really hard. I'm listening.",
      "I hear you. It's okay to feel this way."
    ],
    angry: [
      "I understand. That sounds frustrating.",
      "I hear your frustration. Tell me what happened.",
      "That's completely valid. I'm here to listen."
    ],
    anxious: [
      "I'm right here with you. You're safe.",
      "Take a breath. I'm listening.",
      "It's okay. Let's work through this together."
    ],
    surprised: [
      "Wow, that sounds unexpected! Tell me more.",
      "I can hear the surprise in your voice. What happened?",
      "That's quite something! I'd love to hear about it."
    ],
    disgusted: [
      "I understand why you'd feel that way.",
      "That sounds really unpleasant. I'm sorry.",
      "I hear you. That would bother me too."
    ]
  };

  const options = fallbacks[primary] || fallbacks.neutral;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Get current provider status
 */
export function getProviderStatus() {
  return {
    groq: {
      ...providerStatus.groq,
      configured: isGroqAvailable()
    },
    ollama: { ...providerStatus.ollama }
  };
}

/**
 * Force health check on all providers
 */
export async function refreshProviderStatus() {
  // Reset last check times to force refresh
  providerStatus.groq.lastCheck = 0;
  providerStatus.ollama.lastCheck = 0;

  await Promise.all([
    checkProviderHealth('groq'),
    checkProviderHealth('ollama')
  ]);

  return getProviderStatus();
}

/**
 * Initialize router and check provider availability
 */
export async function initRouter() {
  console.log('[LLMRouter] Initializing...');

  const status = await refreshProviderStatus();

  console.log('[LLMRouter] Provider status:');
  console.log(`  - Groq: ${status.groq.configured ? (status.groq.available ? '✓ Available' : '✗ Unavailable') : '○ Not configured'}`);
  console.log(`  - Ollama: ${status.ollama.available ? '✓ Available' : '✗ Unavailable'}`);

  return status;
}

export default { runLLM, getProviderStatus, refreshProviderStatus, initRouter };
