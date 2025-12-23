/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API KEYS SERVICE - Secure Local Storage for API Keys
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages API keys for voice services:
 * - Groq (LLM inference)
 * - ElevenLabs (TTS)
 *
 * Keys are stored in localStorage (client-side only).
 * For production, consider using Firebase/server-side storage.
 *
 * Created: December 21, 2025
 */

const STORAGE_KEY = 'genesis_api_keys';

/**
 * API Key configuration schema
 */
export const API_KEY_CONFIG = {
  groq: {
    name: 'Groq',
    description: 'Ultra-fast LLM inference for Luna voice',
    url: 'https://console.groq.com',
    icon: '⚡',
    placeholder: 'gsk_...',
    envVar: 'VITE_GROQ_API_KEY'
  },
  elevenlabs: {
    name: 'ElevenLabs',
    description: 'Premium TTS voices for Luna',
    url: 'https://elevenlabs.io/app/speech-synthesis',
    icon: '🎙️',
    placeholder: 'sk_...',
    envVar: 'VITE_ELEVENLABS_API_KEY'
  }
};

/**
 * Get all stored API keys
 */
export function getApiKeys() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('[ApiKeys] Error reading keys:', e);
  }
  return {};
}

/**
 * Get a specific API key
 */
export function getApiKey(service) {
  // First check environment variable
  const config = API_KEY_CONFIG[service];
  if (config?.envVar) {
    const envKey = import.meta.env[config.envVar];
    if (envKey) return envKey;
  }

  // Then check localStorage
  const keys = getApiKeys();
  return keys[service] || '';
}

/**
 * Save an API key
 */
export function saveApiKey(service, key) {
  try {
    const keys = getApiKeys();
    if (key) {
      keys[service] = key;
    } else {
      delete keys[service];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    return true;
  } catch (e) {
    console.error('[ApiKeys] Error saving key:', e);
    return false;
  }
}

/**
 * Delete an API key
 */
export function deleteApiKey(service) {
  return saveApiKey(service, null);
}

/**
 * Check if a key is configured (either in env or localStorage)
 */
export function isKeyConfigured(service) {
  return !!getApiKey(service);
}

/**
 * Get status of all keys
 */
export function getKeyStatus() {
  const status = {};
  for (const service of Object.keys(API_KEY_CONFIG)) {
    const key = getApiKey(service);
    status[service] = {
      configured: !!key,
      source: import.meta.env[API_KEY_CONFIG[service].envVar] ? 'env' : (key ? 'local' : 'none'),
      masked: key ? maskKey(key) : ''
    };
  }
  return status;
}

/**
 * Mask API key for display
 */
function maskKey(key) {
  if (!key || key.length < 8) return '***';
  return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}

/**
 * Validate Groq API key format
 */
export function validateGroqKey(key) {
  // Groq keys start with gsk_
  return key && key.startsWith('gsk_') && key.length > 20;
}

/**
 * Validate ElevenLabs API key format
 */
export function validateElevenLabsKey(key) {
  // ElevenLabs keys are 32 char hex strings
  return key && key.length >= 20;
}

/**
 * Test Groq API key
 */
export async function testGroqKey(key) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        valid: true,
        models: data.data?.map(m => m.id) || []
      };
    } else {
      const error = await response.json().catch(() => ({}));
      return {
        valid: false,
        error: error.error?.message || `HTTP ${response.status}`
      };
    }
  } catch (e) {
    return { valid: false, error: e.message };
  }
}

/**
 * Test ElevenLabs API key
 */
export async function testElevenLabsKey(key) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': key
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        valid: true,
        voices: data.voices?.length || 0
      };
    } else {
      return {
        valid: false,
        error: `HTTP ${response.status}`
      };
    }
  } catch (e) {
    return { valid: false, error: e.message };
  }
}

export default {
  getApiKeys,
  getApiKey,
  saveApiKey,
  deleteApiKey,
  isKeyConfigured,
  getKeyStatus,
  validateGroqKey,
  validateElevenLabsKey,
  testGroqKey,
  testElevenLabsKey,
  API_KEY_CONFIG
};
