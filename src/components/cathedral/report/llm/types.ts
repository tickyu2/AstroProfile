/**
 * Cathedral LLM Types
 *
 * Unified type definitions for the multi-provider LLM system.
 */

// ============================================================================
// CORE TYPES
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

  /** Enable streaming mode */
  stream?: boolean;

  /** Stream chunk handler */
  onStreamChunk?: LLMStreamHandler;

  /** Soft token budget cap */
  budgetTokens?: number;

  /** Override temperature (normally set by mode) */
  temperature?: number;

  /** Specific model to use (provider-specific) */
  model?: string;

  /** Specific provider to use (skips fallback) */
  provider?: ProviderName;

  /** Request metadata for logging */
  metadata?: Record<string, unknown>;
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
  finishReason: 'stop' | 'length' | 'content_filter' | 'error' | 'stream' | string;

  /** Raw provider response (for debugging) */
  raw?: unknown;

  /** Response latency in milliseconds */
  latencyMs?: number;

  /** Provider that served the request */
  provider?: ProviderName;

  /** Model that was used */
  model?: string;
}

/**
 * Streaming chunk structure
 */
export interface LLMStreamChunk {
  /** Text delta for this chunk */
  textDelta: string;

  /** Whether streaming is complete */
  done: boolean;

  /** Token count for this chunk (if available) */
  tokens?: number;
}

/**
 * Stream chunk handler function
 */
export type LLMStreamHandler = (chunk: LLMStreamChunk) => void;

// ============================================================================
// PROVIDER TYPES
// ============================================================================

/**
 * Supported provider names
 */
export type ProviderName =
  | 'openai'
  | 'azure-openai'
  | 'anthropic'
  | 'groq'
  | 'mock';

/**
 * Provider call arguments
 */
export interface ProviderArgs {
  /** System prompt */
  system: string;

  /** User prompt */
  prompt: string;

  /** Temperature (0-1) */
  temperature: number;

  /** Maximum tokens to generate */
  maxTokens: number;

  /** Enable streaming */
  stream?: boolean;

  /** Stream chunk handler */
  onStreamChunk?: LLMStreamHandler;

  /** Specific model (provider-specific) */
  model?: string;
}

/**
 * Provider call result
 */
export interface ProviderResult {
  /** Generated text */
  text: string;

  /** Total tokens used */
  tokens: number;

  /** Completion reason */
  finishReason: string;

  /** Raw response */
  raw?: unknown;
}

/**
 * Provider function type
 */
export type ProviderFunction = (args: ProviderArgs) => Promise<ProviderResult>;

/**
 * Provider configuration
 */
export interface ProviderConfig {
  /** Provider name */
  name: ProviderName;

  /** Provider function */
  fn: ProviderFunction;

  /** Whether provider is enabled */
  enabled: boolean;

  /** Priority (lower = higher priority) */
  priority: number;

  /** Default model for this provider */
  defaultModel?: string;

  /** Rate limit (requests per minute) */
  rateLimit?: number;
}

// ============================================================================
// TELEMETRY TYPES
// ============================================================================

/**
 * LLM event for logging/telemetry
 */
export interface LLMEvent {
  /** Event timestamp */
  timestamp: string;

  /** Provider used */
  provider: ProviderName;

  /** Model used */
  model?: string;

  /** Whether call succeeded */
  success: boolean;

  /** Duration in milliseconds */
  durationMs: number;

  /** Tokens used */
  tokensUsed: number;

  /** Operating mode */
  mode: LLMMode;

  /** Error message (if failed) */
  error?: string;

  /** Request metadata */
  metadata?: Record<string, unknown>;

  /** Was this a stream request */
  streamed?: boolean;
}

/**
 * Token budget tracking
 */
export interface TokenBudget {
  /** Maximum tokens allowed */
  limit: number;

  /** Tokens used so far */
  used: number;

  /** Remaining tokens */
  remaining: number;

  /** Budget period (e.g., 'hour', 'day') */
  period: 'minute' | 'hour' | 'day' | 'session';

  /** When budget resets */
  resetsAt?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * LLM error types
 */
export enum LLMErrorType {
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  MODEL_REFUSAL = 'model_refusal',
  EMPTY_RESPONSE = 'empty_response',
  INVALID_REQUEST = 'invalid_request',
  PROVIDER_ERROR = 'provider_error',
  BUDGET_EXCEEDED = 'budget_exceeded',
  ALL_PROVIDERS_FAILED = 'all_providers_failed',
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
    public provider?: ProviderName,
    public raw?: unknown
  ) {
    super(message);
    this.name = 'LLMError';
  }
}
