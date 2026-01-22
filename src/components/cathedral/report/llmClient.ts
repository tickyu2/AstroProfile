/**
 * Cathedral Oracle - LLM Client Contract
 *
 * A stable, provider-agnostic interface for LLM calls.
 * Supports two modes:
 * - TECHNICAL: Low temperature, concise, literal
 * - MYTHIC: Higher temperature, symbolic, narrative
 *
 * Features:
 * - Retry logic with exponential backoff
 * - Structured context injection
 * - Token tracking
 * - Error classification
 *
 * Usage:
 *   const response = await callLLM({
 *     mode: 'mythic',
 *     prompt: 'Describe this harmonic field...',
 *     context: { score: 78.5, activeChambers: 35 }
 *   });
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * LLM operation modes
 * - technical: Low temperature, concise, factual
 * - mythic: Higher temperature, narrative, symbolic
 */
export type LLMMode = 'technical' | 'mythic';

/**
 * LLM request configuration
 */
export interface LLMRequest {
  /** System prompt (role definition) */
  system?: string;

  /** User prompt (actual query) */
  prompt: string;

  /** Structured context to prepend to prompt */
  context?: Record<string, unknown>;

  /** Operating mode (affects temperature/style) */
  mode?: LLMMode;

  /** Maximum tokens to generate */
  maxTokens?: number;

  /** Override temperature (normally set by mode) */
  temperature?: number;

  /** Model identifier (provider-specific) */
  model?: string;
}

/**
 * LLM response structure
 */
export interface LLMResponse {
  /** Generated text content */
  text: string;

  /** Total tokens used (prompt + completion) */
  tokensUsed: number;

  /** Reason for completion */
  finishReason: 'stop' | 'length' | 'content_filter' | 'error' | string;

  /** Raw provider response (for debugging) */
  raw?: unknown;

  /** Response latency in milliseconds */
  latencyMs?: number;
}

/**
 * LLM error types for classification
 */
export enum LLMErrorType {
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  MODEL_REFUSAL = 'model_refusal',
  EMPTY_RESPONSE = 'empty_response',
  INVALID_REQUEST = 'invalid_request',
  PROVIDER_ERROR = 'provider_error',
  UNKNOWN = 'unknown'
}

/**
 * Structured LLM error
 */
export class LLMError extends Error {
  constructor(
    message: string,
    public type: LLMErrorType,
    public retryable: boolean = false,
    public raw?: unknown
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

/**
 * Provider call interface (implement for your provider)
 */
export interface LLMProvider {
  call(args: {
    system: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
    model?: string;
  }): Promise<{
    text: string;
    tokens: number;
    finishReason: string;
    raw?: unknown;
  }>;
}

// ============================================================================
// MODE CONFIGURATIONS
// ============================================================================

/**
 * Configuration presets for each mode
 */
export const MODE_CONFIGS: Record<LLMMode, { temperature: number; maxTokens: number }> = {
  technical: {
    temperature: 0.1,
    maxTokens: 800
  },
  mythic: {
    temperature: 0.55,
    maxTokens: 1200
  }
};

/**
 * Default system prompts for each mode
 */
export const DEFAULT_SYSTEM_PROMPTS: Record<LLMMode, string> = {
  technical: `You are the Cathedral Oracle, a precise analytical system.
You describe patterns clearly and concisely.
You do not give advice or prescriptions.
You speak in neutral, factual language.
You avoid metaphor and flowery language.
Be direct and accurate.`,

  mythic: `You are the Cathedral Oracle, a voice from the Luna Wing.
You describe emotional patterns with poetic clarity.
You use symbolic language and mythic imagery.
You do not give advice or prescriptions.
You describe what is, not what should be.
You speak of resonance, harmony, and the architecture of connection.`
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get configuration for a given mode
 */
function getModeConfig(mode: LLMMode | undefined): { temperature: number; maxTokens: number } {
  return MODE_CONFIGS[mode ?? 'technical'];
}

/**
 * Get default system prompt for a given mode
 */
function getDefaultSystemPrompt(mode: LLMMode | undefined): string {
  return DEFAULT_SYSTEM_PROMPTS[mode ?? 'technical'];
}

/**
 * Format context as structured string
 */
function formatContext(context: Record<string, unknown> | undefined): string {
  if (!context || Object.keys(context).length === 0) {
    return '';
  }

  const lines: string[] = [];
  for (const [key, value] of Object.entries(context)) {
    const formatted = typeof value === 'object'
      ? JSON.stringify(value)
      : String(value);
    lines.push(`${key}: ${formatted}`);
  }

  return `Context:\n${lines.join('\n')}\n\n---\n\n`;
}

/**
 * Classify error type from error object
 */
function classifyError(error: unknown): { type: LLMErrorType; retryable: boolean; message: string } {
  if (error instanceof LLMError) {
    return { type: error.type, retryable: error.retryable, message: error.message };
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Timeout
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return { type: LLMErrorType.TIMEOUT, retryable: true, message: errorMessage };
  }

  // Rate limit
  if (lowerMessage.includes('rate') || lowerMessage.includes('429') || lowerMessage.includes('quota')) {
    return { type: LLMErrorType.RATE_LIMIT, retryable: true, message: errorMessage };
  }

  // Content filter / refusal
  if (lowerMessage.includes('content') || lowerMessage.includes('filter') || lowerMessage.includes('refused')) {
    return { type: LLMErrorType.MODEL_REFUSAL, retryable: false, message: errorMessage };
  }

  // Invalid request
  if (lowerMessage.includes('invalid') || lowerMessage.includes('400')) {
    return { type: LLMErrorType.INVALID_REQUEST, retryable: false, message: errorMessage };
  }

  // Provider error (5xx)
  if (lowerMessage.includes('500') || lowerMessage.includes('502') || lowerMessage.includes('503')) {
    return { type: LLMErrorType.PROVIDER_ERROR, retryable: true, message: errorMessage };
  }

  return { type: LLMErrorType.UNKNOWN, retryable: false, message: errorMessage };
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Global provider instance (set via setLLMProvider)
 */
let globalProvider: LLMProvider | null = null;

/**
 * Set the LLM provider implementation
 */
export function setLLMProvider(provider: LLMProvider): void {
  globalProvider = provider;
}

/**
 * Get the current LLM provider
 */
export function getLLMProvider(): LLMProvider | null {
  return globalProvider;
}

/**
 * Call the LLM with retry logic and error handling
 *
 * @param request - LLM request configuration
 * @param provider - Optional provider override (uses global if not specified)
 * @returns LLM response
 * @throws LLMError on failure
 */
export async function callLLM(
  request: LLMRequest,
  provider?: LLMProvider
): Promise<LLMResponse> {
  const activeProvider = provider ?? globalProvider;

  if (!activeProvider) {
    throw new LLMError(
      'No LLM provider configured. Call setLLMProvider() first or pass a provider.',
      LLMErrorType.INVALID_REQUEST,
      false
    );
  }

  const mode = request.mode ?? 'technical';
  const config = getModeConfig(mode);

  const system = request.system ?? getDefaultSystemPrompt(mode);
  const contextStr = formatContext(request.context);
  const prompt = contextStr + request.prompt;

  const temperature = request.temperature ?? config.temperature;
  const maxTokens = request.maxTokens ?? config.maxTokens;

  // Retry configuration
  const MAX_RETRIES = 2;
  const BASE_DELAY_MS = 300;

  let lastError: LLMError | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const startTime = Date.now();

    try {
      const result = await activeProvider.call({
        system,
        prompt,
        temperature,
        maxTokens,
        model: request.model
      });

      const latencyMs = Date.now() - startTime;
      const text = (result.text ?? '').trim();

      // Check for empty response
      if (!text) {
        throw new LLMError(
          'LLM returned empty response',
          LLMErrorType.EMPTY_RESPONSE,
          true
        );
      }

      return {
        text,
        tokensUsed: result.tokens ?? 0,
        finishReason: result.finishReason ?? 'stop',
        raw: result.raw,
        latencyMs
      };

    } catch (error) {
      const classified = classifyError(error);

      lastError = new LLMError(
        classified.message,
        classified.type,
        classified.retryable,
        error
      );

      // If not retryable, throw immediately
      if (!classified.retryable) {
        throw lastError;
      }

      // Exponential backoff
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(`LLM call failed (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms:`, classified.message);
      await sleep(delay);
    }
  }

  // All retries exhausted
  throw lastError ?? new LLMError(
    'LLM call failed after retries',
    LLMErrorType.UNKNOWN,
    false
  );
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Call LLM in technical mode
 */
export async function callLLMTechnical(
  prompt: string,
  context?: Record<string, unknown>
): Promise<string> {
  const response = await callLLM({ prompt, context, mode: 'technical' });
  return response.text;
}

/**
 * Call LLM in mythic mode
 */
export async function callLLMMythic(
  prompt: string,
  context?: Record<string, unknown>
): Promise<string> {
  const response = await callLLM({ prompt, context, mode: 'mythic' });
  return response.text;
}

/**
 * Generate a summary for the Omniphonic Report
 */
export async function generateOmniphonicSummary(
  omniphonicScore: number,
  dominantCluster: string,
  activeChambers: number,
  mode: LLMMode = 'technical'
): Promise<string> {
  const prompt = `
Score: ${omniphonicScore.toFixed(1)} / 100
Dominant harmonic family: ${dominantCluster}
Active chambers: ${activeChambers} / 50

Write 2-3 concise sentences describing this emotional harmony field.
Do not give advice. Do not prescribe actions.
Focus on what the field shows, not what should be done.
`.trim();

  try {
    const response = await callLLM({ prompt, mode });
    return response.text;
  } catch (error) {
    console.warn('LLM summary generation failed, using fallback:', error);
    // Fallback to deterministic summary
    return getFallbackSummary(omniphonicScore, dominantCluster, activeChambers);
  }
}

/**
 * Fallback summary when LLM is unavailable
 */
function getFallbackSummary(
  score: number,
  dominantCluster: string,
  activeChambers: number
): string {
  if (score >= 80) {
    return `This exceptional harmonic field shows strong resonance across ${activeChambers} chambers, with particular depth in ${dominantCluster} patterns. The emotional architecture supports profound connection and resilient co-becoming.`;
  }
  if (score >= 60) {
    return `This strong harmonic field demonstrates meaningful alignment across ${activeChambers} chambers, anchored by ${dominantCluster} themes. The foundation supports sustained emotional coherence and mutual understanding.`;
  }
  if (score >= 40) {
    return `This developing harmonic field shows resonance in ${activeChambers} chambers, with emphasis on ${dominantCluster} patterns. The active dimensions provide meaningful anchors for continued growth.`;
  }
  if (score >= 20) {
    return `This emerging harmonic field has ${activeChambers} active chambers, centered on ${dominantCluster} themes. These areas offer starting points for deeper resonance cultivation.`;
  }
  return `This harmonic field is in early formation with ${activeChambers} active chambers. The ${dominantCluster} patterns show initial resonance, with potential for growth through conscious attention.`;
}

// ============================================================================
// MOCK PROVIDER (for testing)
// ============================================================================

/**
 * Mock LLM provider for testing
 */
export const mockLLMProvider: LLMProvider = {
  async call(args) {
    // Simulate latency
    await sleep(100);

    return {
      text: `[Mock LLM Response]\n\nSystem: ${args.system.slice(0, 50)}...\nPrompt length: ${args.prompt.length}\nTemp: ${args.temperature}\nMax tokens: ${args.maxTokens}`,
      tokens: args.prompt.length + 50,
      finishReason: 'stop'
    };
  }
};

export default callLLM;
