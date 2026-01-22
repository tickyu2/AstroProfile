/**
 * Cathedral LLM Telemetry
 *
 * Logging, observability, and metrics for LLM calls.
 */

import { LLMEvent, LLMMode, ProviderName } from './types';

// ============================================================================
// TELEMETRY CONFIGURATION
// ============================================================================

export interface TelemetryConfig {
  /** Enable console logging */
  consoleLog: boolean;

  /** Log level */
  logLevel: 'debug' | 'info' | 'warn' | 'error';

  /** Custom log handler */
  customHandler?: (event: LLMEvent) => void | Promise<void>;

  /** Enable metrics collection */
  collectMetrics: boolean;

  /** Sample rate for detailed logs (0-1) */
  sampleRate: number;
}

const defaultConfig: TelemetryConfig = {
  consoleLog: true,
  logLevel: 'info',
  collectMetrics: true,
  sampleRate: 1.0
};

let config: TelemetryConfig = { ...defaultConfig };

/**
 * Configure telemetry settings
 */
export function configureTelemetry(newConfig: Partial<TelemetryConfig>): void {
  config = { ...config, ...newConfig };
}

// ============================================================================
// METRICS STORAGE
// ============================================================================

interface MetricsSummary {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalTokens: number;
  totalDurationMs: number;
  avgDurationMs: number;
  avgTokensPerCall: number;
  byProvider: Record<ProviderName, {
    calls: number;
    successes: number;
    failures: number;
    tokens: number;
    durationMs: number;
  }>;
  byMode: Record<LLMMode, {
    calls: number;
    tokens: number;
  }>;
}

const metrics: {
  events: LLMEvent[];
  maxEvents: number;
} = {
  events: [],
  maxEvents: 1000
};

/**
 * Get current metrics summary
 */
export function getMetricsSummary(): MetricsSummary {
  const events = metrics.events;

  const byProvider: MetricsSummary['byProvider'] = {} as MetricsSummary['byProvider'];
  const byMode: MetricsSummary['byMode'] = {
    technical: { calls: 0, tokens: 0 },
    mythic: { calls: 0, tokens: 0 }
  };

  let totalTokens = 0;
  let totalDurationMs = 0;
  let successfulCalls = 0;
  let failedCalls = 0;

  for (const event of events) {
    // By provider
    if (!byProvider[event.provider]) {
      byProvider[event.provider] = {
        calls: 0,
        successes: 0,
        failures: 0,
        tokens: 0,
        durationMs: 0
      };
    }
    byProvider[event.provider].calls++;
    byProvider[event.provider].tokens += event.tokensUsed;
    byProvider[event.provider].durationMs += event.durationMs;
    if (event.success) {
      byProvider[event.provider].successes++;
      successfulCalls++;
    } else {
      byProvider[event.provider].failures++;
      failedCalls++;
    }

    // By mode
    byMode[event.mode].calls++;
    byMode[event.mode].tokens += event.tokensUsed;

    // Totals
    totalTokens += event.tokensUsed;
    totalDurationMs += event.durationMs;
  }

  const totalCalls = events.length;

  return {
    totalCalls,
    successfulCalls,
    failedCalls,
    totalTokens,
    totalDurationMs,
    avgDurationMs: totalCalls > 0 ? totalDurationMs / totalCalls : 0,
    avgTokensPerCall: totalCalls > 0 ? totalTokens / totalCalls : 0,
    byProvider,
    byMode
  };
}

/**
 * Get recent events
 */
export function getRecentEvents(count: number = 10): LLMEvent[] {
  return metrics.events.slice(-count);
}

/**
 * Clear metrics
 */
export function clearMetrics(): void {
  metrics.events = [];
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log an LLM event
 */
export async function logLLMEvent(event: LLMEvent): Promise<void> {
  // Apply sample rate
  if (Math.random() > config.sampleRate) {
    return;
  }

  // Store event for metrics
  if (config.collectMetrics) {
    metrics.events.push(event);

    // Trim if over max
    if (metrics.events.length > metrics.maxEvents) {
      metrics.events = metrics.events.slice(-metrics.maxEvents);
    }
  }

  // Console logging
  if (config.consoleLog) {
    const level = event.success ? 'info' : 'warn';

    if (shouldLog(level)) {
      const emoji = event.success ? '✓' : '✗';
      const streamTag = event.streamed ? ' [stream]' : '';

      console.log(
        `[LLM] ${emoji} ${event.provider}${streamTag}`,
        `${event.durationMs}ms`,
        `${event.tokensUsed} tokens`,
        event.mode,
        event.error ? `| Error: ${event.error}` : ''
      );

      if (config.logLevel === 'debug') {
        console.log('[LLM] Details:', JSON.stringify(event, null, 2));
      }
    }
  }

  // Custom handler
  if (config.customHandler) {
    try {
      await config.customHandler(event);
    } catch (err) {
      console.warn('[LLM Telemetry] Custom handler error:', err);
    }
  }
}

/**
 * Check if log level allows logging
 */
function shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
  const levels = ['debug', 'info', 'warn', 'error'];
  return levels.indexOf(level) >= levels.indexOf(config.logLevel);
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create an LLM event object
 */
export function createLLMEvent(
  provider: ProviderName,
  success: boolean,
  durationMs: number,
  tokensUsed: number,
  mode: LLMMode,
  options?: {
    error?: string;
    model?: string;
    metadata?: Record<string, unknown>;
    streamed?: boolean;
  }
): LLMEvent {
  return {
    timestamp: new Date().toISOString(),
    provider,
    model: options?.model,
    success,
    durationMs,
    tokensUsed,
    mode,
    error: options?.error,
    metadata: options?.metadata,
    streamed: options?.streamed
  };
}

/**
 * Log a successful call
 */
export function logSuccess(
  provider: ProviderName,
  durationMs: number,
  tokensUsed: number,
  mode: LLMMode,
  options?: { model?: string; metadata?: Record<string, unknown>; streamed?: boolean }
): Promise<void> {
  return logLLMEvent(createLLMEvent(provider, true, durationMs, tokensUsed, mode, options));
}

/**
 * Log a failed call
 */
export function logFailure(
  provider: ProviderName,
  durationMs: number,
  mode: LLMMode,
  error: string,
  options?: { model?: string; metadata?: Record<string, unknown>; streamed?: boolean }
): Promise<void> {
  return logLLMEvent(createLLMEvent(provider, false, durationMs, 0, mode, { ...options, error }));
}

// ============================================================================
// EXPORTS
// ============================================================================

export { TelemetryConfig };
