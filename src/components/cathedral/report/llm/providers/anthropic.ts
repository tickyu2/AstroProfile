/**
 * Anthropic Claude Provider
 *
 * Routes through server-side llmProxy Cloud Function.
 * API key never leaves the server.
 */

import { ProviderArgs, ProviderResult } from '../types';
import { callLLMProxy } from '../../../../../services/llmProxyService';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Call Anthropic API via server proxy
 */
export async function callAnthropic(args: ProviderArgs): Promise<ProviderResult> {
  const model = args.model ?? DEFAULT_MODEL;

  const result = await callLLMProxy({
    provider: 'anthropic',
    model,
    system: args.system,
    messages: [{ role: 'user', content: args.prompt }],
    temperature: args.temperature,
    max_tokens: args.maxTokens
  });

  return {
    text: result.text,
    tokens: result.tokens || 0,
    finishReason: result.finishReason || 'stop'
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const anthropicProvider = {
  name: 'anthropic' as const,
  call: callAnthropic,
  defaultModel: DEFAULT_MODEL
};

export default callAnthropic;
