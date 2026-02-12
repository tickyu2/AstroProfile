/**
 * Cathedral LLM Router
 *
 * Automatic provider fallback, streaming support, and unified interface.
 */

import {
  LLMRequest,
  LLMResponse,
  LLMError,
  LLMErrorType,
  ProviderName,
  ProviderConfig,
  ProviderArgs,
  LLMStreamChunk
} from './types';
import { getModeConfig, getSystemPrompt, buildPrompt, checkBudget, consumeBudget, applyBudget } from './config';
import { logSuccess, logFailure } from './telemetry';
import { callOpenAI } from './providers/openai';
import { callAzureOpenAI } from './providers/azureOpenai';
import { callAnthropic } from './providers/anthropic';
import { callGroq } from './providers/groq';

// ============================================================================
// PROVIDER REGISTRY
// ============================================================================

/**
 * Provider configurations with fallback order
 */
const providers: ProviderConfig[] = [
  {
    name: 'azure-openai',
    fn: callAzureOpenAI,
    enabled: hasAzureConfig(),
    priority: 1,
    defaultModel: 'gpt-4o-mini',
    rateLimit: 60
  },
  {
    name: 'anthropic',
    fn: callAnthropic,
    enabled: hasAnthropicConfig(),
    priority: 2,
    defaultModel: 'claude-3-5-sonnet-20241022',
    rateLimit: 60
  },
  {
    name: 'openai',
    fn: callOpenAI,
    enabled: hasOpenAIConfig(),
    priority: 3,
    defaultModel: 'gpt-4o-mini',
    rateLimit: 60
  },
  {
    name: 'groq',
    fn: callGroq,
    enabled: hasGroqConfig(),
    priority: 4,
    defaultModel: 'llama-3.1-70b-versatile',
    rateLimit: 30
  }
];

// ============================================================================
// CONFIGURATION DETECTION
// All providers now route through the server-side llmProxy Cloud Function.
// Keys are managed server-side — providers are always "available" from the
// frontend's perspective. The server will error if a key is missing.
// Azure is disabled (no server-side secret configured).
// ============================================================================

function hasAzureConfig(): boolean {
  return false; // Azure secrets not in server proxy — disabled
}

function hasAnthropicConfig(): boolean {
  return true; // Server-side proxy handles key availability
}

function hasOpenAIConfig(): boolean {
  return true; // Server-side proxy handles key availability
}

function hasGroqConfig(): boolean {
  return true; // Server-side proxy handles key availability
}

// ============================================================================
// PROVIDER SELECTION
// ============================================================================

/**
 * Get available providers sorted by priority
 */
export function getAvailableProviders(): ProviderConfig[] {
  return providers
    .filter(p => p.enabled)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get provider by name
 */
export function getProvider(name: ProviderName): ProviderConfig | undefined {
  return providers.find(p => p.name === name && p.enabled);
}

/**
 * Check if any provider is available
 */
export function hasAvailableProvider(): boolean {
  return providers.some(p => p.enabled);
}

/**
 * Refresh provider availability (call after env changes)
 */
export function refreshProviders(): void {
  providers[0].enabled = hasAzureConfig();
  providers[1].enabled = hasAnthropicConfig();
  providers[2].enabled = hasOpenAIConfig();
  providers[3].enabled = hasGroqConfig();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Sleep helper for backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Classify error for retry decisions
 */
function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Retryable conditions
  if (message.includes('timeout') || message.includes('timed out')) return true;
  if (message.includes('rate') || message.includes('429') || message.includes('quota')) return true;
  if (message.includes('500') || message.includes('502') || message.includes('503')) return true;
  if (message.includes('network') || message.includes('connection')) return true;

  return false;
}

/**
 * Classify error type
 */
function classifyError(error: unknown, provider: ProviderName): LLMError {
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return new LLMError(message, LLMErrorType.TIMEOUT, true, provider);
  }
  if (lowerMessage.includes('rate') || lowerMessage.includes('429') || lowerMessage.includes('quota')) {
    return new LLMError(message, LLMErrorType.RATE_LIMIT, true, provider);
  }
  if (lowerMessage.includes('content') || lowerMessage.includes('filter') || lowerMessage.includes('refused')) {
    return new LLMError(message, LLMErrorType.MODEL_REFUSAL, false, provider);
  }
  if (lowerMessage.includes('invalid') || lowerMessage.includes('400')) {
    return new LLMError(message, LLMErrorType.INVALID_REQUEST, false, provider);
  }
  if (lowerMessage.includes('500') || lowerMessage.includes('502') || lowerMessage.includes('503')) {
    return new LLMError(message, LLMErrorType.PROVIDER_ERROR, true, provider);
  }

  return new LLMError(message, LLMErrorType.UNKNOWN, false, provider);
}

// ============================================================================
// MAIN ROUTER FUNCTION
// ============================================================================

/**
 * Route LLM request with automatic fallback
 */
export async function routeLLM(request: LLMRequest): Promise<LLMResponse> {
  const availableProviders = getAvailableProviders();

  if (availableProviders.length === 0) {
    throw new LLMError(
      'No LLM providers configured. Set at least one API key.',
      LLMErrorType.INVALID_REQUEST,
      false
    );
  }

  // Get mode configuration
  const mode = request.mode ?? 'technical';
  const modeConfig = getModeConfig(mode);

  // Build request args
  const system = getSystemPrompt(mode, request.system);
  const prompt = buildPrompt(request.prompt, request.context);
  const temperature = request.temperature ?? modeConfig.temperature;
  const maxTokens = applyBudget(request, modeConfig.maxTokensDefault);

  // Check budget
  const budgetCheck = checkBudget(maxTokens);
  if (!budgetCheck.allowed) {
    throw new LLMError(
      `Token budget exceeded for ${budgetCheck.period}: ${budgetCheck.budget?.used}/${budgetCheck.budget?.limit}`,
      LLMErrorType.BUDGET_EXCEEDED,
      false
    );
  }

  // Build provider args
  const providerArgs: ProviderArgs = {
    system,
    prompt,
    temperature,
    maxTokens,
    stream: request.stream,
    onStreamChunk: request.onStreamChunk,
    model: request.model
  };

  // If specific provider requested, try only that one
  if (request.provider) {
    const provider = getProvider(request.provider);
    if (!provider) {
      throw new LLMError(
        `Requested provider '${request.provider}' not available`,
        LLMErrorType.INVALID_REQUEST,
        false
      );
    }
    return callProviderWithRetry(provider, providerArgs, mode);
  }

  // Try providers in order with fallback
  const errors: LLMError[] = [];

  for (const provider of availableProviders) {
    try {
      return await callProviderWithRetry(provider, providerArgs, mode);
    } catch (error) {
      const llmError = error instanceof LLMError
        ? error
        : classifyError(error, provider.name);

      errors.push(llmError);

      console.warn(`[LLM Router] Provider ${provider.name} failed:`, llmError.message);

      // Non-retryable errors that shouldn't try other providers
      if (llmError.type === LLMErrorType.MODEL_REFUSAL ||
          llmError.type === LLMErrorType.INVALID_REQUEST) {
        throw llmError;
      }

      // Continue to next provider
    }
  }

  // All providers failed
  throw new LLMError(
    `All providers failed: ${errors.map(e => `${e.provider}: ${e.message}`).join('; ')}`,
    LLMErrorType.ALL_PROVIDERS_FAILED,
    false
  );
}

/**
 * Call a single provider with retry logic
 */
async function callProviderWithRetry(
  provider: ProviderConfig,
  args: ProviderArgs,
  mode: 'technical' | 'mythic',
  maxRetries: number = 2
): Promise<LLMResponse> {
  const baseDelay = 300;
  let lastError: LLMError | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const startTime = Date.now();

    try {
      const result = await provider.fn(args);
      const durationMs = Date.now() - startTime;

      // Validate response
      const text = (result.text ?? '').trim();
      if (!text) {
        throw new LLMError('Empty response from provider', LLMErrorType.EMPTY_RESPONSE, true, provider.name);
      }

      // Log success
      await logSuccess(provider.name, durationMs, result.tokens, mode, {
        model: args.model ?? provider.defaultModel,
        streamed: args.stream
      });

      // Consume budget
      consumeBudget(result.tokens);

      return {
        text,
        tokensUsed: result.tokens,
        finishReason: result.finishReason,
        raw: result.raw,
        latencyMs: durationMs,
        provider: provider.name,
        model: args.model ?? provider.defaultModel
      };

    } catch (error) {
      const durationMs = Date.now() - startTime;
      const llmError = error instanceof LLMError
        ? error
        : classifyError(error, provider.name);

      lastError = llmError;

      // Log failure
      await logFailure(provider.name, durationMs, mode, llmError.message, {
        model: args.model ?? provider.defaultModel,
        streamed: args.stream
      });

      // Don't retry non-retryable errors
      if (!llmError.retryable) {
        throw llmError;
      }

      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`[LLM Router] Retry ${attempt + 1}/${maxRetries} for ${provider.name} in ${delay}ms`);
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new LLMError(
    'Provider call failed after retries',
    LLMErrorType.UNKNOWN,
    false,
    provider.name
  );
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Call LLM in technical mode
 */
export async function callTechnical(
  prompt: string,
  context?: Record<string, unknown>
): Promise<string> {
  const response = await routeLLM({ prompt, context, mode: 'technical' });
  return response.text;
}

/**
 * Call LLM in mythic mode
 */
export async function callMythic(
  prompt: string,
  context?: Record<string, unknown>
): Promise<string> {
  const response = await routeLLM({ prompt, context, mode: 'mythic' });
  return response.text;
}

/**
 * Call LLM with streaming
 */
export async function callStream(
  prompt: string,
  onChunk: (chunk: LLMStreamChunk) => void,
  options?: Partial<LLMRequest>
): Promise<LLMResponse> {
  return routeLLM({
    prompt,
    stream: true,
    onStreamChunk: onChunk,
    ...options
  });
}

/**
 * Generate Omniphonic summary with fallback
 */
export async function generateOmniphonicSummary(
  score: number,
  dominantCluster: string,
  activeChambers: number,
  mode: 'technical' | 'mythic' = 'technical'
): Promise<string> {
  const prompt = `
Score: ${score.toFixed(1)} / 100
Dominant harmonic family: ${dominantCluster}
Active chambers: ${activeChambers} / 50

Write 2-3 concise sentences describing this emotional harmony field.
Do not give advice. Do not prescribe actions.
Focus on what the field shows, not what should be done.
`.trim();

  try {
    const response = await routeLLM({ prompt, mode });
    return response.text;
  } catch (error) {
    console.warn('[LLM Router] Summary generation failed, using fallback:', error);
    return getFallbackSummary(score, dominantCluster, activeChambers);
  }
}

/**
 * Fallback summary when LLM unavailable
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
// MOCK PROVIDER
// ============================================================================

/**
 * Mock provider for testing (always available)
 */
export async function callMock(args: ProviderArgs): Promise<{
  text: string;
  tokens: number;
  finishReason: string;
}> {
  await sleep(100); // Simulate latency

  const mockText = `[Mock LLM Response]

System: ${args.system.slice(0, 50)}...
Prompt length: ${args.prompt.length}
Temperature: ${args.temperature}
Max tokens: ${args.maxTokens}`;

  if (args.stream && args.onStreamChunk) {
    // Simulate streaming
    const words = mockText.split(' ');
    for (const word of words) {
      args.onStreamChunk({ textDelta: word + ' ', done: false });
      await sleep(20);
    }
    args.onStreamChunk({ textDelta: '', done: true });
  }

  return {
    text: mockText,
    tokens: args.prompt.length + 50,
    finishReason: 'stop'
  };
}

/**
 * Enable mock provider (for testing)
 */
export function enableMockProvider(): void {
  const mockConfig: ProviderConfig = {
    name: 'mock',
    fn: callMock,
    enabled: true,
    priority: 0, // Highest priority for testing
    defaultModel: 'mock-v1'
  };

  // Add to beginning of providers array
  const existingMock = providers.findIndex(p => p.name === 'mock');
  if (existingMock >= 0) {
    providers[existingMock] = mockConfig;
  } else {
    providers.unshift(mockConfig);
  }
}

/**
 * Disable mock provider
 */
export function disableMockProvider(): void {
  const mockIndex = providers.findIndex(p => p.name === 'mock');
  if (mockIndex >= 0) {
    providers.splice(mockIndex, 1);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default routeLLM;
