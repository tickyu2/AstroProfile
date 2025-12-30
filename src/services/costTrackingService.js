/**
 * Cost Tracking Service
 * Tracks and estimates costs across all AI providers in GENESIS
 *
 * Providers tracked:
 * - Anthropic (Claude Sonnet, Opus)
 * - Google (Gemini 3 Pro, Flash)
 * - xAI (Grok-4)
 * - DeepSeek (DeepSeek-R1)
 * - OpenAI (o1, o3-mini, GPT-4o)
 * - Stability.ai (SD3, SDXL)
 * - Leonardo.ai (Phoenix, Kino)
 * - ElevenLabs (TTS)
 * - Groq (Whisper STT)
 *
 * Part of GENESIS - Cost Control & Analytics
 * Created: December 28, 2024
 */

// Cost per 1K tokens (input/output) or per call
const COST_RATES = {
  // Anthropic
  'claude-sonnet-4': {
    input: 0.003,    // $3/1M tokens
    output: 0.015,   // $15/1M tokens
    name: 'Claude Sonnet 4'
  },
  'claude-opus-4.5': {
    input: 0.015,    // $15/1M tokens
    output: 0.075,   // $75/1M tokens
    name: 'Claude Opus 4.5'
  },

  // Google Gemini
  'gemini-2.5-pro': {
    input: 0.00125,  // $1.25/1M tokens
    output: 0.005,   // $5/1M tokens
    name: 'Gemini 2.5 Pro'
  },
  'gemini-2.0-flash': {
    input: 0.00015,  // $0.15/1M tokens
    output: 0.0006,  // $0.60/1M tokens
    name: 'Gemini 2.0 Flash'
  },

  // xAI Grok
  'grok-4': {
    input: 0.005,    // $5/1M tokens (estimated)
    output: 0.015,   // $15/1M tokens (estimated)
    name: 'Grok-4'
  },
  'grok-3': {
    input: 0.003,    // $3/1M tokens (estimated)
    output: 0.009,   // $9/1M tokens (estimated)
    name: 'Grok-3'
  },

  // DeepSeek
  'deepseek-reasoner': {
    input: 0.00055,  // $0.55/1M tokens
    output: 0.00219, // $2.19/1M tokens
    name: 'DeepSeek-R1'
  },
  'deepseek-chat': {
    input: 0.00014,  // $0.14/1M tokens
    output: 0.00028, // $0.28/1M tokens
    name: 'DeepSeek-V3'
  },

  // OpenAI
  'o1': {
    input: 0.015,    // $15/1M tokens
    output: 0.060,   // $60/1M tokens
    name: 'OpenAI o1'
  },
  'o3-mini': {
    input: 0.0011,   // $1.10/1M tokens
    output: 0.0044,  // $4.40/1M tokens
    name: 'OpenAI o3-mini'
  },
  'gpt-4o': {
    input: 0.0025,   // $2.50/1M tokens
    output: 0.010,   // $10/1M tokens
    name: 'GPT-4o'
  },

  // Image Generation (per image)
  'sd3-large': {
    perCall: 0.065,  // $0.065/image
    name: 'SD3 Large'
  },
  'sd3-medium': {
    perCall: 0.035,  // $0.035/image
    name: 'SD3 Medium'
  },
  'stable-image-core': {
    perCall: 0.030,  // $0.03/image
    name: 'Stable Image Core'
  },
  'sdxl-1.0': {
    perCall: 0.025,  // $0.025/image (estimated)
    name: 'SDXL 1.0'
  },
  'leonardo-phoenix': {
    perCall: 0.020,  // ~16 credits = ~$0.02
    name: 'Leonardo Phoenix'
  },
  'leonardo-kino': {
    perCall: 0.020,
    name: 'Leonardo Kino XL'
  },

  // Voice (TTS & STT)
  'elevenlabs-tts': {
    perCharacter: 0.00003, // ~$0.30/1K characters
    name: 'ElevenLabs TTS'
  },
  'groq-whisper': {
    perMinute: 0.006,  // $0.006/minute (estimated free tier)
    name: 'Groq Whisper'
  }
};

// In-memory cost tracking (can be persisted to Firestore)
let sessionCosts = {
  startTime: Date.now(),
  totalCost: 0,
  byProvider: {},
  byModel: {},
  calls: []
};

class CostTrackingService {
  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load persisted costs from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('genesis_costs');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only load if from today
        const today = new Date().toDateString();
        if (new Date(parsed.startTime).toDateString() === today) {
          sessionCosts = parsed;
        }
      }
    } catch (e) {
      console.warn('[CostTracking] Failed to load from storage:', e);
    }
  }

  /**
   * Save costs to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('genesis_costs', JSON.stringify(sessionCosts));
    } catch (e) {
      console.warn('[CostTracking] Failed to save to storage:', e);
    }
  }

  /**
   * Record a token-based API call
   */
  recordTokenUsage(model, inputTokens, outputTokens, metadata = {}) {
    const rate = COST_RATES[model];
    if (!rate) {
      console.warn(`[CostTracking] Unknown model: ${model}`);
      return null;
    }

    const inputCost = (inputTokens / 1000) * (rate.input || 0);
    const outputCost = (outputTokens / 1000) * (rate.output || 0);
    const totalCost = inputCost + outputCost;

    this.addCost(model, totalCost, {
      type: 'tokens',
      inputTokens,
      outputTokens,
      ...metadata
    });

    return {
      model,
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      totalCost
    };
  }

  /**
   * Record a per-call API usage (images, etc.)
   */
  recordCallUsage(model, numCalls = 1, metadata = {}) {
    const rate = COST_RATES[model];
    if (!rate?.perCall) {
      console.warn(`[CostTracking] Unknown per-call model: ${model}`);
      return null;
    }

    const totalCost = rate.perCall * numCalls;

    this.addCost(model, totalCost, {
      type: 'calls',
      numCalls,
      ...metadata
    });

    return {
      model,
      numCalls,
      totalCost
    };
  }

  /**
   * Record TTS usage (by character count)
   */
  recordTTSUsage(characters, metadata = {}) {
    const rate = COST_RATES['elevenlabs-tts'];
    const totalCost = characters * rate.perCharacter;

    this.addCost('elevenlabs-tts', totalCost, {
      type: 'tts',
      characters,
      ...metadata
    });

    return {
      model: 'elevenlabs-tts',
      characters,
      totalCost
    };
  }

  /**
   * Record STT usage (by minutes)
   */
  recordSTTUsage(minutes, metadata = {}) {
    const rate = COST_RATES['groq-whisper'];
    const totalCost = minutes * rate.perMinute;

    this.addCost('groq-whisper', totalCost, {
      type: 'stt',
      minutes,
      ...metadata
    });

    return {
      model: 'groq-whisper',
      minutes,
      totalCost
    };
  }

  /**
   * Internal: Add cost to tracking
   */
  addCost(model, cost, metadata) {
    const rate = COST_RATES[model] || { name: model };
    const provider = this.getProvider(model);

    // Update totals
    sessionCosts.totalCost += cost;

    // By provider
    if (!sessionCosts.byProvider[provider]) {
      sessionCosts.byProvider[provider] = { total: 0, calls: 0 };
    }
    sessionCosts.byProvider[provider].total += cost;
    sessionCosts.byProvider[provider].calls += 1;

    // By model
    if (!sessionCosts.byModel[model]) {
      sessionCosts.byModel[model] = { total: 0, calls: 0, name: rate.name };
    }
    sessionCosts.byModel[model].total += cost;
    sessionCosts.byModel[model].calls += 1;

    // Add to call log (keep last 100)
    sessionCosts.calls.push({
      timestamp: Date.now(),
      model,
      cost,
      ...metadata
    });
    if (sessionCosts.calls.length > 100) {
      sessionCosts.calls = sessionCosts.calls.slice(-100);
    }

    this.saveToStorage();

    console.log(`💰 [CostTracking] ${rate.name}: $${cost.toFixed(4)} | Session total: $${sessionCosts.totalCost.toFixed(4)}`);
  }

  /**
   * Get provider from model name
   */
  getProvider(model) {
    if (model.includes('claude') || model.includes('opus') || model.includes('sonnet')) {
      return 'Anthropic';
    }
    if (model.includes('gemini')) {
      return 'Google';
    }
    if (model.includes('grok')) {
      return 'xAI';
    }
    if (model.includes('deepseek')) {
      return 'DeepSeek';
    }
    if (model.includes('gpt') || model.includes('o1') || model.includes('o3')) {
      return 'OpenAI';
    }
    if (model.includes('sd') || model.includes('stable')) {
      return 'Stability.ai';
    }
    if (model.includes('leonardo')) {
      return 'Leonardo.ai';
    }
    if (model.includes('eleven')) {
      return 'ElevenLabs';
    }
    if (model.includes('whisper') || model.includes('groq')) {
      return 'Groq';
    }
    return 'Unknown';
  }

  /**
   * Get current session summary
   */
  getSessionSummary() {
    const duration = (Date.now() - sessionCosts.startTime) / 1000 / 60; // minutes

    return {
      totalCost: sessionCosts.totalCost,
      formattedTotal: `$${sessionCosts.totalCost.toFixed(4)}`,
      duration: `${Math.round(duration)} min`,
      byProvider: Object.entries(sessionCosts.byProvider).map(([name, data]) => ({
        name,
        total: data.total,
        calls: data.calls,
        formatted: `$${data.total.toFixed(4)}`
      })),
      byModel: Object.entries(sessionCosts.byModel).map(([id, data]) => ({
        id,
        name: data.name,
        total: data.total,
        calls: data.calls,
        formatted: `$${data.total.toFixed(4)}`
      })),
      recentCalls: sessionCosts.calls.slice(-10).reverse()
    };
  }

  /**
   * Get daily cost estimate
   */
  getDailyEstimate() {
    const duration = (Date.now() - sessionCosts.startTime) / 1000 / 60 / 60; // hours
    if (duration < 0.1) return 0;

    const hourlyRate = sessionCosts.totalCost / duration;
    return hourlyRate * 24;
  }

  /**
   * Get monthly cost estimate
   */
  getMonthlyEstimate() {
    return this.getDailyEstimate() * 30;
  }

  /**
   * Reset session costs
   */
  resetSession() {
    sessionCosts = {
      startTime: Date.now(),
      totalCost: 0,
      byProvider: {},
      byModel: {},
      calls: []
    };
    this.saveToStorage();
  }

  /**
   * Get cost rates for display
   */
  getCostRates() {
    return COST_RATES;
  }

  /**
   * Estimate cost for a given usage
   */
  estimateCost(model, inputTokens = 0, outputTokens = 0, numCalls = 0) {
    const rate = COST_RATES[model];
    if (!rate) return null;

    let cost = 0;
    if (rate.input && rate.output) {
      cost = (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output;
    }
    if (rate.perCall) {
      cost = rate.perCall * numCalls;
    }
    return cost;
  }
}

// Singleton instance
export const costTrackingService = new CostTrackingService();

// Export cost rates for reference
export { COST_RATES };

export default costTrackingService;
