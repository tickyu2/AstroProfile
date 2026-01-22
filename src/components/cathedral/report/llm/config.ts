/**
 * Cathedral LLM Configuration
 *
 * Mode configurations, system prompts, and budget management.
 */

import { LLMMode, LLMRequest, TokenBudget } from './types';

// ============================================================================
// MODE CONFIGURATIONS
// ============================================================================

/**
 * Configuration presets for each mode
 */
export const MODE_CONFIGS: Record<LLMMode, {
  temperature: number;
  maxTokensDefault: number;
  systemPrompt: string;
}> = {
  technical: {
    temperature: 0.1,
    maxTokensDefault: 800,
    systemPrompt: `You are the Cathedral Oracle, a precise analytical system.
You describe patterns clearly and concisely.
You do not give advice or prescriptions.
You speak in neutral, factual language.
You avoid metaphor and flowery language.
Be direct and accurate.`
  },
  mythic: {
    temperature: 0.55,
    maxTokensDefault: 1200,
    systemPrompt: `You are the Cathedral Oracle, a voice from the Luna Wing.
You describe emotional patterns with poetic clarity.
You use symbolic language and mythic imagery.
You do not give advice or prescriptions.
You describe what is, not what should be.
You speak of resonance, harmony, and the architecture of connection.`
  }
};

/**
 * Get configuration for a given mode
 */
export function getModeConfig(mode: LLMMode | undefined): {
  temperature: number;
  maxTokensDefault: number;
  systemPrompt: string;
} {
  return MODE_CONFIGS[mode ?? 'technical'];
}

/**
 * Get system prompt for a given mode
 */
export function getSystemPrompt(mode: LLMMode | undefined, customSystem?: string): string {
  if (customSystem) return customSystem;
  return MODE_CONFIGS[mode ?? 'technical'].systemPrompt;
}

// ============================================================================
// TOKEN BUDGET MANAGEMENT
// ============================================================================

/**
 * In-memory budget tracker
 */
const budgetState: {
  minute: { used: number; resetAt: number };
  hour: { used: number; resetAt: number };
  day: { used: number; resetAt: number };
  session: { used: number; resetAt: number };
} = {
  minute: { used: 0, resetAt: Date.now() + 60_000 },
  hour: { used: 0, resetAt: Date.now() + 3_600_000 },
  day: { used: 0, resetAt: Date.now() + 86_400_000 },
  session: { used: 0, resetAt: Infinity }
};

/**
 * Default budget limits
 */
export const BUDGET_LIMITS: Record<TokenBudget['period'], number> = {
  minute: 10_000,
  hour: 100_000,
  day: 500_000,
  session: 1_000_000
};

/**
 * Get current budget status for a period
 */
export function getBudget(period: TokenBudget['period']): TokenBudget {
  const state = budgetState[period];
  const now = Date.now();

  // Reset if period elapsed
  if (now > state.resetAt) {
    state.used = 0;
    if (period === 'minute') state.resetAt = now + 60_000;
    else if (period === 'hour') state.resetAt = now + 3_600_000;
    else if (period === 'day') state.resetAt = now + 86_400_000;
  }

  const limit = BUDGET_LIMITS[period];
  return {
    limit,
    used: state.used,
    remaining: Math.max(0, limit - state.used),
    period,
    resetsAt: state.resetAt === Infinity ? undefined : new Date(state.resetAt).toISOString()
  };
}

/**
 * Consume tokens from budget
 */
export function consumeBudget(tokens: number): void {
  budgetState.minute.used += tokens;
  budgetState.hour.used += tokens;
  budgetState.day.used += tokens;
  budgetState.session.used += tokens;
}

/**
 * Check if budget allows a request
 */
export function checkBudget(estimatedTokens: number): {
  allowed: boolean;
  period?: TokenBudget['period'];
  budget?: TokenBudget;
} {
  for (const period of ['minute', 'hour', 'day'] as const) {
    const budget = getBudget(period);
    if (budget.remaining < estimatedTokens) {
      return { allowed: false, period, budget };
    }
  }
  return { allowed: true };
}

/**
 * Apply budget constraint to max tokens
 */
export function applyBudget(
  req: LLMRequest,
  modeMaxTokens: number
): number {
  const base = req.maxTokens ?? modeMaxTokens;

  // Apply request-level budget
  if (req.budgetTokens) {
    return Math.min(base, req.budgetTokens);
  }

  // Apply global budget (conservative)
  const minuteBudget = getBudget('minute');
  if (minuteBudget.remaining < base) {
    return Math.max(100, minuteBudget.remaining);
  }

  return base;
}

/**
 * Reset all budgets (for testing)
 */
export function resetBudgets(): void {
  const now = Date.now();
  budgetState.minute = { used: 0, resetAt: now + 60_000 };
  budgetState.hour = { used: 0, resetAt: now + 3_600_000 };
  budgetState.day = { used: 0, resetAt: now + 86_400_000 };
  budgetState.session = { used: 0, resetAt: Infinity };
}

// ============================================================================
// CONTEXT FORMATTING
// ============================================================================

/**
 * Format context object as string to prepend to prompt
 */
export function formatContext(context: Record<string, unknown> | undefined): string {
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
 * Build full prompt with context
 */
export function buildPrompt(prompt: string, context?: Record<string, unknown>): string {
  return formatContext(context) + prompt;
}
