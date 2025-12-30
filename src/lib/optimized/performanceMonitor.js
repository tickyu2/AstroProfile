/**
 * Performance Monitor for Tracking Metrics
 */

export class PerformanceMonitor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.maxMetrics = options.maxMetrics || 1000;
    this.slowThreshold = options.slowThreshold || 10; // ms
    this.metrics = [];
    this.aggregates = new Map();
  }

  /**
   * Measure synchronous function execution
   */
  measure(name, fn) {
    if (!this.enabled) return fn();

    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.record(name, duration, 'success');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(name, duration, 'error');
      throw error;
    }
  }

  /**
   * Measure asynchronous function execution
   */
  async measureAsync(name, fn) {
    if (!this.enabled) return await fn();

    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(name, duration, 'success');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(name, duration, 'error');
      throw error;
    }
  }

  /**
   * Record a metric
   */
  record(name, duration, status = 'success') {
    const metric = {
      name,
      duration,
      status,
      timestamp: Date.now()
    };

    // Add to metrics array
    this.metrics.push(metric);

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Update aggregate stats
    this.updateAggregate(name, duration, status);

    // Log slow operations
    if (duration > this.slowThreshold) {
      console.warn(
        `[Performance] SLOW: ${name} took ${duration.toFixed(2)}ms (threshold: ${this.slowThreshold}ms)`
      );
    }
  }

  /**
   * Update aggregate statistics for a metric name
   */
  updateAggregate(name, duration, status) {
    if (!this.aggregates.has(name)) {
      this.aggregates.set(name, {
        count: 0,
        successCount: 0,
        errorCount: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: -Infinity,
        durations: []
      });
    }

    const agg = this.aggregates.get(name);
    agg.count++;
    agg.totalDuration += duration;
    agg.minDuration = Math.min(agg.minDuration, duration);
    agg.maxDuration = Math.max(agg.maxDuration, duration);
    agg.durations.push(duration);

    if (status === 'success') {
      agg.successCount++;
    } else {
      agg.errorCount++;
    }

    // Keep only last 100 durations for percentile calculations
    if (agg.durations.length > 100) {
      agg.durations.shift();
    }
  }

  /**
   * Get statistics for a specific metric
   */
  getStats(name) {
    const agg = this.aggregates.get(name);
    if (!agg || agg.count === 0) return null;

    const sorted = [...agg.durations].sort((a, b) => a - b);

    return {
      name,
      count: agg.count,
      successRate: (agg.successCount / agg.count * 100).toFixed(2) + '%',
      errorCount: agg.errorCount,
      average: (agg.totalDuration / agg.count).toFixed(3) + 'ms',
      min: agg.minDuration.toFixed(3) + 'ms',
      max: agg.maxDuration.toFixed(3) + 'ms',
      p50: sorted[Math.floor(sorted.length * 0.50)]?.toFixed(3) + 'ms' || 'N/A',
      p95: sorted[Math.floor(sorted.length * 0.95)]?.toFixed(3) + 'ms' || 'N/A',
      p99: sorted[Math.floor(sorted.length * 0.99)]?.toFixed(3) + 'ms' || 'N/A'
    };
  }

  /**
   * Get report of all metrics
   */
  getReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalMetrics: this.metrics.length,
      metrics: {}
    };

    for (const name of this.aggregates.keys()) {
      report.metrics[name] = this.getStats(name);
    }

    return report;
  }

  /**
   * Get recent slow operations
   */
  getSlowOperations(limit = 10) {
    return this.metrics
      .filter(m => m.duration > this.slowThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
      .map(m => ({
        name: m.name,
        duration: m.duration.toFixed(3) + 'ms',
        timestamp: new Date(m.timestamp).toISOString()
      }));
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
    this.aggregates.clear();
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Log current report to console
   */
  logReport() {
    console.log('=== Performance Report ===');
    const report = this.getReport();
    console.table(report.metrics);

    const slowOps = this.getSlowOperations(5);
    if (slowOps.length > 0) {
      console.log('\n=== Recent Slow Operations ===');
      console.table(slowOps);
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();
