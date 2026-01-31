/**
 * WEEK 12: PERFORMANCE MONITORING & OPTIMIZATION
 * Ensures < 2 second response time
 * 
 * Run with: node performance-monitor.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      responseTime: [],
      emotionDetection: [],
      stateUpdate: [],
      modeSelection: [],
      hybridSearch: [],
      patternRetrieval: [],
      neuralPrediction: [],
      responseGeneration: []
    };

    this.cacheStats = {
      hits: 0,
      misses: 0,
      size: 0
    };
  }

  /**
   * Start timing a component
   */
  startTimer(component) {
    return {
      component,
      startTime: process.hrtime.bigint()
    };
  }

  /**
   * End timing and record
   */
  endTimer(timer) {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - timer.startTime) / 1000000; // Convert to ms

    if (this.metrics[timer.component]) {
      this.metrics[timer.component].push(durationMs);
    }

    return durationMs;
  }

  /**
   * Get statistics for a component
   */
  getStats(component) {
    const times = this.metrics[component];
    if (!times || times.length === 0) {
      return null;
    }

    const sorted = [...times].sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);

    return {
      count: times.length,
      avg: sum / times.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  /**
   * Get full performance report
   */
  getReport() {
    const report = {
      timestamp: new Date().toISOString(),
      components: {},
      cache: this.cacheStats,
      recommendations: []
    };

    // Get stats for each component
    for (const component of Object.keys(this.metrics)) {
      const stats = this.getStats(component);
      if (stats) {
        report.components[component] = stats;

        // Add recommendations if slow
        if (stats.avg > 500) {
          report.recommendations.push({
            component,
            issue: 'High average response time',
            current: `${stats.avg.toFixed(2)}ms`,
            target: '< 500ms',
            severity: 'high'
          });
        } else if (stats.p95 > 1000) {
          report.recommendations.push({
            component,
            issue: '95th percentile too high',
            current: `${stats.p95.toFixed(2)}ms`,
            target: '< 1000ms',
            severity: 'medium'
          });
        }
      }
    }

    // Cache performance recommendations
    const cacheHitRate = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses);
    if (cacheHitRate < 0.5) {
      report.recommendations.push({
        component: 'cache',
        issue: 'Low cache hit rate',
        current: `${(cacheHitRate * 100).toFixed(1)}%`,
        target: '> 50%',
        severity: 'medium'
      });
    }

    return report;
  }

  /**
   * Save report to file
   */
  saveReport(filename = 'performance-report.json') {
    const report = this.getReport();
    const filepath = path.join(__dirname, '..', 'reports', filename);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(filepath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 Performance report saved to ${filepath}`);
    
    return report;
  }

  /**
   * Print report to console
   */
  printReport() {
    const report = this.getReport();

    console.log('\n📊 PERFORMANCE REPORT');
    console.log('====================\n');

    console.log('Component Performance:');
    console.log('---------------------');
    for (const [component, stats] of Object.entries(report.components)) {
      console.log(`\n${component}:`);
      console.log(`  Count: ${stats.count}`);
      console.log(`  Average: ${stats.avg.toFixed(2)}ms`);
      console.log(`  Min: ${stats.min.toFixed(2)}ms`);
      console.log(`  Max: ${stats.max.toFixed(2)}ms`);
      console.log(`  P50: ${stats.p50.toFixed(2)}ms`);
      console.log(`  P95: ${stats.p95.toFixed(2)}ms`);
      console.log(`  P99: ${stats.p99.toFixed(2)}ms`);
    }

    console.log('\n\nCache Performance:');
    console.log('-----------------');
    console.log(`  Hits: ${report.cache.hits}`);
    console.log(`  Misses: ${report.cache.misses}`);
    console.log(`  Hit Rate: ${((report.cache.hits / (report.cache.hits + report.cache.misses)) * 100).toFixed(1)}%`);
    console.log(`  Size: ${report.cache.size} entries`);

    if (report.recommendations.length > 0) {
      console.log('\n\n⚠️  Recommendations:');
      console.log('-------------------');
      for (const rec of report.recommendations) {
        console.log(`\n[${rec.severity.toUpperCase()}] ${rec.component}`);
        console.log(`  Issue: ${rec.issue}`);
        console.log(`  Current: ${rec.current}`);
        console.log(`  Target: ${rec.target}`);
      }
    } else {
      console.log('\n\n✅ All components performing within targets!');
    }
  }
}

/**
 * Cache Manager for optimization
 */
class CacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 300000; // 5 minutes default
    this.maxSize = options.maxSize || 1000;
    this.stats = {
      hits: 0,
      misses: 0
    };
  }

  /**
   * Get value from cache
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    entry.hits++;
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key, value) {
    // Check size limit
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0
    });
  }

  /**
   * Evict least recently used entries
   */
  evict() {
    // Remove oldest 10% of entries
    const entriesToRemove = Math.floor(this.maxSize * 0.1);
    const entries = Array.from(this.cache.entries());
    
    // Sort by last access time
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest
    for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }
}

/**
 * Database Query Optimizer
 */
class QueryOptimizer {
  constructor(supabase) {
    this.supabase = supabase;
    this.slowQueries = [];
  }

  /**
   * Execute query with timing
   */
  async executeWithTiming(queryFn, description) {
    const startTime = process.hrtime.bigint();
    
    try {
      const result = await queryFn();
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000;

      // Track slow queries (> 100ms)
      if (durationMs > 100) {
        this.slowQueries.push({
          description,
          duration: durationMs,
          timestamp: new Date().toISOString()
        });
      }

      return { result, duration: durationMs };
    } catch (error) {
      console.error(`Query error (${description}):`, error);
      throw error;
    }
  }

  /**
   * Analyze slow queries
   */
  analyzeSlowQueries() {
    if (this.slowQueries.length === 0) {
      console.log('✅ No slow queries detected');
      return;
    }

    console.log('\n⚠️  Slow Queries Detected:');
    console.log('------------------------');
    
    // Group by description
    const grouped = {};
    for (const query of this.slowQueries) {
      if (!grouped[query.description]) {
        grouped[query.description] = [];
      }
      grouped[query.description].push(query.duration);
    }

    // Print analysis
    for (const [description, durations] of Object.entries(grouped)) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      
      console.log(`\n${description}:`);
      console.log(`  Count: ${durations.length}`);
      console.log(`  Average: ${avg.toFixed(2)}ms`);
      console.log(`  Max: ${max.toFixed(2)}ms`);
      console.log(`  Recommendation: ${this.getRecommendation(description, avg)}`);
    }
  }

  /**
   * Get optimization recommendation
   */
  getRecommendation(description, avgDuration) {
    if (description.includes('search') || description.includes('retrieval')) {
      return 'Add/optimize indexes, consider caching frequent searches';
    } else if (description.includes('state') || description.includes('update')) {
      return 'Consider batching updates, add database connection pooling';
    } else if (description.includes('pattern') || description.includes('aggregate')) {
      return 'Add materialized views, cache aggregations';
    } else {
      return 'Profile query execution plan, add appropriate indexes';
    }
  }

  /**
   * Get slow queries report
   */
  getReport() {
    return {
      totalQueries: this.slowQueries.length,
      queries: this.slowQueries,
      recommendations: this.slowQueries.map(q => ({
        query: q.description,
        duration: q.duration,
        recommendation: this.getRecommendation(q.description, q.duration)
      }))
    };
  }
}

/**
 * Load Testing Utility
 */
class LoadTester {
  constructor() {
    this.results = [];
  }

  /**
   * Run load test
   */
  async runLoadTest(testFn, options = {}) {
    const {
      requests = 100,
      concurrency = 10,
      description = 'Load Test'
    } = options;

    console.log(`\n🔥 Running load test: ${description}`);
    console.log(`Requests: ${requests}, Concurrency: ${concurrency}`);

    const startTime = Date.now();
    const results = [];
    let completed = 0;
    let errors = 0;

    // Execute in batches
    for (let i = 0; i < requests; i += concurrency) {
      const batch = [];
      
      for (let j = 0; j < concurrency && (i + j) < requests; j++) {
        batch.push(
          testFn()
            .then(duration => {
              completed++;
              results.push(duration);
              process.stdout.write(`\rProgress: ${completed}/${requests} (${errors} errors)`);
            })
            .catch(err => {
              completed++;
              errors++;
              process.stdout.write(`\rProgress: ${completed}/${requests} (${errors} errors)`);
            })
        );
      }

      await Promise.all(batch);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log('\n\n📊 Load Test Results:');
    console.log('--------------------');
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Requests: ${requests}`);
    console.log(`Completed: ${completed}`);
    console.log(`Errors: ${errors}`);
    console.log(`Success Rate: ${((completed - errors) / completed * 100).toFixed(1)}%`);
    console.log(`Requests/sec: ${(requests / (totalTime / 1000)).toFixed(2)}`);

    if (results.length > 0) {
      const sorted = results.sort((a, b) => a - b);
      const avg = results.reduce((a, b) => a + b, 0) / results.length;
      
      console.log(`\nResponse Times:`);
      console.log(`  Average: ${avg.toFixed(2)}ms`);
      console.log(`  Min: ${sorted[0].toFixed(2)}ms`);
      console.log(`  Max: ${sorted[sorted.length - 1].toFixed(2)}ms`);
      console.log(`  P50: ${sorted[Math.floor(sorted.length * 0.5)].toFixed(2)}ms`);
      console.log(`  P95: ${sorted[Math.floor(sorted.length * 0.95)].toFixed(2)}ms`);
      console.log(`  P99: ${sorted[Math.floor(sorted.length * 0.99)].toFixed(2)}ms`);
    }

    return {
      totalTime,
      requests,
      completed,
      errors,
      results
    };
  }
}

/**
 * Example usage and testing
 */
async function runPerformanceTests() {
  console.log('🚀 WEEK 12: PERFORMANCE OPTIMIZATION');
  console.log('====================================\n');

  const monitor = new PerformanceMonitor();
  const cacheManager = new CacheManager({ ttl: 60000, maxSize: 500 });
  
  // Simulate component timings
  console.log('Running performance tests...\n');

  // Test 1: Response generation pipeline
  for (let i = 0; i < 100; i++) {
    const timer = monitor.startTimer('responseTime');
    
    // Simulate each component
    await new Promise(resolve => setTimeout(resolve, 50)); // Emotion detection
    monitor.endTimer({ component: 'emotionDetection', startTime: timer.startTime });
    
    await new Promise(resolve => setTimeout(resolve, 20)); // State update
    monitor.endTimer({ component: 'stateUpdate', startTime: timer.startTime });
    
    await new Promise(resolve => setTimeout(resolve, 30)); // Mode selection
    monitor.endTimer({ component: 'modeSelection', startTime: timer.startTime });
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Hybrid search
    monitor.endTimer({ component: 'hybridSearch', startTime: timer.startTime });
    
    await new Promise(resolve => setTimeout(resolve, 50)); // Pattern retrieval
    monitor.endTimer({ component: 'patternRetrieval', startTime: timer.startTime });
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Neural prediction
    monitor.endTimer({ component: 'neuralPrediction', startTime: timer.startTime });
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Response generation
    monitor.endTimer({ component: 'responseGeneration', startTime: timer.startTime });
    
    monitor.endTimer(timer);

    // Test cache
    const cacheKey = `test_${i % 10}`;
    if (cacheManager.get(cacheKey)) {
      monitor.cacheStats.hits++;
    } else {
      monitor.cacheStats.misses++;
      cacheManager.set(cacheKey, { data: `value_${i}` });
    }
  }

  monitor.cacheStats.size = cacheManager.cache.size;

  // Print and save report
  monitor.printReport();
  monitor.saveReport(`performance-report-${Date.now()}.json`);

  console.log('\n✅ Performance tests complete!');
}

// Export for use in other modules
module.exports = {
  PerformanceMonitor,
  CacheManager,
  QueryOptimizer,
  LoadTester
};

// Run if executed directly
if (require.main === module) {
  runPerformanceTests()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error running performance tests:', err);
      process.exit(1);
    });
}
