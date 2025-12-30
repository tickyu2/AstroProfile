/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOICE CONFIGURATION - Cloud Run + Fallback
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Configuration for Luna Voice WebSocket server.
 * Primary: Cloud Run (production)
 * Fallback: Direct API calls (current browser-based approach)
 *
 * Created: December 28, 2024
 * Part of: GENESIS Voice Mode - Production Deployment
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cloud Run WebSocket URL
 * Set this after deploying to Cloud Run in your .env file:
 * VITE_VOICE_WS_URL=wss://luna-voice-backend-xxxxx-uc.a.run.app
 */
const CLOUD_RUN_WS_URL = import.meta.env.VITE_VOICE_WS_URL || null;

/**
 * Check if we're in development mode (Vite-compatible)
 */
const IS_DEVELOPMENT = import.meta.env.DEV;

/**
 * Local development server
 */
const LOCAL_WS_URL = 'ws://localhost:8080';

/**
 * Fallback timeout before switching to browser-based approach
 */
const CONNECTION_TIMEOUT_MS = 5000;

/**
 * Health check endpoint path
 */
const HEALTH_CHECK_PATH = '/health';

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Voice mode strategies
 */
export const VOICE_MODE = {
  CLOUD_RUN: 'cloud_run',     // Use Cloud Run WebSocket
  LOCAL: 'local',             // Use local dev server
  BROWSER: 'browser',         // Browser-based (Web Speech API + direct API)
  AUTO: 'auto'                // Auto-detect best available
};

/**
 * Get the WebSocket URL based on environment
 */
export function getWebSocketUrl() {
  // Development mode
  if (IS_DEVELOPMENT) {
    return LOCAL_WS_URL;
  }

  // Production with Cloud Run
  if (CLOUD_RUN_WS_URL) {
    return CLOUD_RUN_WS_URL;
  }

  // Fallback to same-origin WebSocket
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/voice`;
}

/**
 * Get the health check URL
 */
export function getHealthCheckUrl() {
  const wsUrl = getWebSocketUrl();
  const httpUrl = wsUrl.replace('wss:', 'https:').replace('ws:', 'http:');
  return `${httpUrl}${HEALTH_CHECK_PATH}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if Cloud Run server is available
 * @returns {Promise<{available: boolean, latency: number, services: object}>}
 */
export async function checkCloudRunHealth() {
  try {
    const url = getHealthCheckUrl();
    const startTime = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT_MS);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { available: false, latency: 0, services: null, error: 'Server unhealthy' };
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      available: data.status === 'healthy',
      latency,
      services: data.services,
      connections: data.connections,
      uptime: data.uptime
    };
  } catch (error) {
    console.warn('[VoiceConfig] Cloud Run health check failed:', error.message);
    return { available: false, latency: 0, services: null, error: error.message };
  }
}

/**
 * Determine best voice mode based on availability
 * @returns {Promise<string>} VOICE_MODE value
 */
export async function detectBestVoiceMode() {
  // Check Cloud Run first
  const cloudRunHealth = await checkCloudRunHealth();

  if (cloudRunHealth.available) {
    console.log('[VoiceConfig] Using Cloud Run mode (latency:', cloudRunHealth.latency, 'ms)');
    return VOICE_MODE.CLOUD_RUN;
  }

  // Development fallback
  if (IS_DEVELOPMENT) {
    try {
      const localHealth = await fetch(`http://localhost:8080/health`, {
        signal: AbortSignal.timeout(2000)
      });
      if (localHealth.ok) {
        console.log('[VoiceConfig] Using local server mode');
        return VOICE_MODE.LOCAL;
      }
    } catch (e) {
      // Local server not running
    }
  }

  // Fallback to browser-based
  console.log('[VoiceConfig] Using browser mode (fallback)');
  return VOICE_MODE.BROWSER;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIO QUALITY PRESETS (mirror of backend)
// ═══════════════════════════════════════════════════════════════════════════════

export const AUDIO_PRESETS = {
  fast: {
    name: 'Fast',
    description: 'Optimized for quick responses',
    icon: '⚡',
    latency: '400-800ms'
  },
  balanced: {
    name: 'Balanced',
    description: 'Good quality with reasonable speed',
    icon: '⚖️',
    latency: '600-1200ms'
  },
  quality: {
    name: 'Quality',
    description: 'Best audio quality',
    icon: '🎵',
    latency: '900-2000ms'
  }
};

export const DEFAULT_PRESET = 'balanced';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION OBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const voiceConfig = {
  // URLs
  cloudRunUrl: CLOUD_RUN_WS_URL,
  localUrl: LOCAL_WS_URL,
  connectionTimeout: CONNECTION_TIMEOUT_MS,

  // Modes
  VOICE_MODE,

  // Presets
  AUDIO_PRESETS,
  DEFAULT_PRESET,

  // Functions
  getWebSocketUrl,
  getHealthCheckUrl,
  checkCloudRunHealth,
  detectBestVoiceMode
};

export default voiceConfig;
