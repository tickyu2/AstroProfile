/**
 * Azure OpenAI Provider
 *
 * DISABLED: Azure OpenAI secrets are not configured in the server-side proxy.
 * Use the standard OpenAI provider instead.
 * Re-enable by adding Azure secrets to functions/index.js defineSecret declarations.
 */

import { ProviderArgs, ProviderResult } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_DEPLOYMENT = 'gpt-4o-mini';

// ============================================================================
// PROVIDER IMPLEMENTATION (disabled — no server-side Azure secrets)
// ============================================================================

/**
 * Azure OpenAI is not available through the server proxy.
 * Falls through to next provider in the cathedral router.
 */
export async function callAzureOpenAI(_args: ProviderArgs): Promise<ProviderResult> {
  throw new Error('Azure OpenAI not configured in server proxy. Use openai or anthropic provider.');
}

// ============================================================================
// EXPORTS
// ============================================================================

export const azureOpenaiProvider = {
  name: 'azure-openai' as const,
  call: callAzureOpenAI,
  defaultModel: DEFAULT_DEPLOYMENT
};

export default callAzureOpenAI;
