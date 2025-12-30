/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECRETS MANAGEMENT - Secure API Key Handling
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Centralized secrets management for Luna Voice Backend.
 * Supports multiple sources: environment variables, Secret Manager, Vault.
 *
 * Production Security:
 * - Never log or expose API keys
 * - Rotate keys periodically
 * - Use Secret Manager for cloud deployments
 * - Validate keys on startup
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode - Production Hardening
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Required secrets for voice functionality
  required: ['GROQ_API_KEY'],

  // Optional but recommended secrets
  optional: ['ELEVENLABS_API_KEY', 'OPENAI_API_KEY'],

  // Key validation patterns (prefix checks)
  validation: {
    GROQ_API_KEY: /^gsk_/,
    ELEVENLABS_API_KEY: /^[a-f0-9]{32}$/i,
    OPENAI_API_KEY: /^sk-/
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECRETS CACHE (in-memory, never logged)
// ═══════════════════════════════════════════════════════════════════════════════

const secretsCache = new Map();
let initialized = false;
let validationErrors = [];

// ═══════════════════════════════════════════════════════════════════════════════
// SECRET RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get a secret value
 * @param {string} name - Secret name
 * @returns {string|null} - Secret value or null if not found
 */
export function getSecret(name) {
  if (!initialized) {
    throw new Error('Secrets not initialized. Call initSecrets() first.');
  }
  return secretsCache.get(name) || null;
}

/**
 * Check if a secret is available
 * @param {string} name - Secret name
 * @returns {boolean}
 */
export function hasSecret(name) {
  return secretsCache.has(name) && secretsCache.get(name)?.length > 0;
}

/**
 * Get masked secret for logging (first 4 chars + ***)
 * @param {string} name - Secret name
 * @returns {string}
 */
export function getMaskedSecret(name) {
  const value = secretsCache.get(name);
  if (!value) return '(not set)';
  if (value.length <= 8) return '****';
  return value.substring(0, 4) + '***' + value.substring(value.length - 4);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize secrets from environment variables
 * In production, this can be extended to use Secret Manager
 */
export async function initSecrets() {
  console.log('[Secrets] Initializing...');
  validationErrors = [];

  // Load from environment
  const allSecrets = [...CONFIG.required, ...CONFIG.optional];

  for (const name of allSecrets) {
    const value = process.env[name];

    if (value) {
      // Validate format if pattern exists
      const pattern = CONFIG.validation[name];
      if (pattern && !pattern.test(value)) {
        validationErrors.push(`${name}: Invalid format`);
        console.warn(`[Secrets] ${name}: Invalid format (expected pattern: ${pattern})`);
      } else {
        secretsCache.set(name, value);
      }
    }
  }

  // Check required secrets
  const missingRequired = CONFIG.required.filter(name => !secretsCache.has(name));
  if (missingRequired.length > 0) {
    const error = `Missing required secrets: ${missingRequired.join(', ')}`;
    validationErrors.push(error);
    console.error(`[Secrets] ${error}`);
  }

  initialized = true;

  // Return status
  return {
    initialized: true,
    configured: {
      groq: hasSecret('GROQ_API_KEY'),
      elevenlabs: hasSecret('ELEVENLABS_API_KEY'),
      openai: hasSecret('OPENAI_API_KEY')
    },
    errors: validationErrors,
    hasErrors: validationErrors.length > 0
  };
}

/**
 * Validate all secrets are properly configured
 * @returns {Object} - Validation status
 */
export function validateSecrets() {
  return {
    valid: validationErrors.length === 0,
    errors: validationErrors,
    status: {
      GROQ_API_KEY: hasSecret('GROQ_API_KEY') ? 'configured' : 'missing',
      ELEVENLABS_API_KEY: hasSecret('ELEVENLABS_API_KEY') ? 'configured' : 'optional',
      OPENAI_API_KEY: hasSecret('OPENAI_API_KEY') ? 'configured' : 'optional'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUD SECRET MANAGER (Optional - for production)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Load secrets from Google Cloud Secret Manager
 * Requires: @google-cloud/secret-manager package
 *
 * @param {string} projectId - GCP project ID
 * @returns {Promise<void>}
 */
export async function loadFromSecretManager(projectId) {
  try {
    // Dynamic import to avoid requiring the package if not using Secret Manager
    const { SecretManagerServiceClient } = await import('@google-cloud/secret-manager');
    const client = new SecretManagerServiceClient();

    const secretNames = [...CONFIG.required, ...CONFIG.optional];

    for (const name of secretNames) {
      try {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${name}/versions/latest`
        });

        const payload = version.payload.data.toString('utf8');
        secretsCache.set(name, payload);
        console.log(`[Secrets] Loaded ${name} from Secret Manager`);
      } catch (e) {
        if (CONFIG.required.includes(name)) {
          console.error(`[Secrets] Failed to load required secret ${name}:`, e.message);
        }
        // Optional secrets are silently skipped
      }
    }

    initialized = true;
    console.log('[Secrets] Loaded from Secret Manager');
  } catch (e) {
    console.error('[Secrets] Secret Manager not available:', e.message);
    console.log('[Secrets] Falling back to environment variables');
    await initSecrets();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// API KEY ROTATION (Production Best Practice)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rotate an API key
 * This updates the in-memory cache - actual key rotation happens in Secret Manager
 *
 * @param {string} name - Secret name
 * @param {string} newValue - New secret value
 */
export function rotateSecret(name, newValue) {
  if (!CONFIG.required.includes(name) && !CONFIG.optional.includes(name)) {
    throw new Error(`Unknown secret: ${name}`);
  }

  const pattern = CONFIG.validation[name];
  if (pattern && !pattern.test(newValue)) {
    throw new Error(`Invalid format for ${name}`);
  }

  secretsCache.set(name, newValue);
  console.log(`[Secrets] Rotated ${name}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  initSecrets,
  getSecret,
  hasSecret,
  getMaskedSecret,
  validateSecrets,
  loadFromSecretManager,
  rotateSecret
};
