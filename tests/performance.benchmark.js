/**
 * Performance Benchmark Suite
 * Target: <10ms total processing time
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { OptimizedSignalExtractor } from '../src/lib/optimized/signalExtractor.optimized.js';
import { OptimizedArchetypeDetector } from '../src/lib/optimized/archetypeDetector.optimized.js';
import { EmotionCongruenceService } from '../src/lib/emotionCongruenceService.js';
import { performanceMonitor } from '../src/lib/optimized/performanceMonitor.js';

// Test cases with varying complexity
const testCases = [
  {
    name: 'Short simple',
    text: "I'm fine.",
    target: 3
  },
  {
    name: 'Medium emotion',
    text: "I really need help with this urgent matter!",
    target: 5
  },
  {
    name: 'Complex uncertain',
    text: "I'm not sure... maybe we could try? I don't know what to do.",
    target: 7
  },
  {
    name: 'Long urgent',
    text: "This is ABSOLUTELY CRITICAL and needs immediate attention!!! I can't believe this is happening right now.",
    target: 8
  },
  {
    name: 'Very long complex',
    text: "Thank you so much for your help, I really appreciate it. I was feeling quite overwhelmed yesterday, but today I'm starting to see some clarity. Maybe we can work through this together?",
    target: 10
  }
];

describe('Performance Benchmarks', () => {
  let signalExtractor;
  let archetypeDetector;
  let congruenceService;

  beforeAll(() => {
    signalExtractor = new OptimizedSignalExtractor();
    archetypeDetector = new OptimizedArchetypeDetector();
    congruenceService = new EmotionCongruenceService();

    // Warm up (initialize caches)
    testCases.forEach(tc => {
      const signals = signalExtractor.extract(tc.text);
      archetypeDetector.detect(signals);
    });
  });

  describe('Signal Extraction Performance', () => {
    testCases.forEach(tc => {
      it(`should extract signals from "${tc.name}" in <${tc.target}ms`, () => {
        const iterations = 100;
        const durations = [];

        for (let i = 0; i < iterations; i++) {
          const start = performance.now();
          signalExtractor.extract(tc.text);
          durations.push(performance.now() - start);
        }

        const avg = durations.reduce((a, b) => a + b, 0) / iterations;
        const p95 = durations.sort((a, b) => a - b)[Math.floor(iterations * 0.95)];

        console.log(`  ${tc.name}: avg=${avg.toFixed(3)}ms, p95=${p95.toFixed(3)}ms`);

        expect(avg).toBeLessThan(tc.target);
      });
    });

    it('should have >80% cache hit rate after warmup', () => {
      const stats = signalExtractor.lexicons.getStats();
      console.log('  Cache stats:', stats);

      const hitRate = parseFloat(stats.hitRate);
      expect(hitRate).toBeGreaterThan(80);
    });
  });

  describe('Archetype Detection Performance', () => {
    const signalSets = testCases.map(tc => signalExtractor.extract(tc.text));

    it('should detect archetype in <3ms (average)', () => {
      const iterations = 100;
      const durations = [];

      for (let i = 0; i < iterations; i++) {
        signalSets.forEach(signals => {
          const start = performance.now();
          archetypeDetector.detect(signals);
          durations.push(performance.now() - start);
        });
      }

      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const p95 = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];

      console.log(`  Archetype detection: avg=${avg.toFixed(3)}ms, p95=${p95.toFixed(3)}ms`);

      expect(avg).toBeLessThan(3);
    });

    it('should benefit from early stopping', () => {
      const withEarlyStop = new OptimizedArchetypeDetector({ enableEarlyStopping: true });
      const withoutEarlyStop = new OptimizedArchetypeDetector({ enableEarlyStopping: false });

      const signals = signalSets[0];
      const iterations = 100;

      const withTime = measureAverage(() => withEarlyStop.detect(signals), iterations);
      const withoutTime = measureAverage(() => withoutEarlyStop.detect(signals), iterations);

      console.log(`  Early stopping: with=${withTime.toFixed(3)}ms, without=${withoutTime.toFixed(3)}ms`);
      console.log(`  Improvement: ${((withoutTime - withTime) / withoutTime * 100).toFixed(1)}%`);

      expect(withTime).toBeLessThan(withoutTime);
    });
  });

  describe('End-to-End Performance', () => {
    testCases.forEach(tc => {
      it(`should process "${tc.name}" in <10ms (target)`, () => {
        const iterations = 100;
        const durations = [];

        for (let i = 0; i < iterations; i++) {
          const start = performance.now();

          // Full pipeline
          const signals = signalExtractor.extract(tc.text);
          const archetype = archetypeDetector.detect(signals);
          const congruence = congruenceService.analyze(
            signals,
            { emotion: 'neutral', confidence: 0.5 },
            archetype
          );

          durations.push(performance.now() - start);
        }

        const avg = durations.reduce((a, b) => a + b, 0) / iterations;
        const p50 = durations.sort((a, b) => a - b)[Math.floor(iterations * 0.50)];
        const p95 = durations.sort((a, b) => a - b)[Math.floor(iterations * 0.95)];
        const p99 = durations.sort((a, b) => a - b)[Math.floor(iterations * 0.99)];

        console.log(`  ${tc.name}:`);
        console.log(`    avg=${avg.toFixed(3)}ms, p50=${p50.toFixed(3)}ms, p95=${p95.toFixed(3)}ms, p99=${p99.toFixed(3)}ms`);

        // P95 should be under 10ms
        expect(p95).toBeLessThan(10);
      });
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory over 1000 iterations', () => {
      const initialMemory = getMemoryUsage();

      for (let i = 0; i < 1000; i++) {
        testCases.forEach(tc => {
          const signals = signalExtractor.extract(tc.text);
          archetypeDetector.detect(signals);
        });
      }

      const finalMemory = getMemoryUsage();
      const increase = finalMemory - initialMemory;

      console.log(`  Memory increase: ${increase.toFixed(2)}MB`);

      // Should not increase by more than 10MB
      expect(increase).toBeLessThan(10);
    });

    it('should maintain cache size limits', () => {
      const stats = signalExtractor.lexicons.getStats();
      console.log('  Final cache stats:', stats);

      expect(signalExtractor.lexicons.cache.size).toBeLessThanOrEqual(1000);
    });
  });

  describe('Performance Monitor', () => {
    it('should track metrics correctly', () => {
      performanceMonitor.clear();

      for (let i = 0; i < 50; i++) {
        performanceMonitor.measure('test-operation', () => {
          const signals = signalExtractor.extract(testCases[0].text);
          archetypeDetector.detect(signals);
        });
      }

      const stats = performanceMonitor.getStats('test-operation');
      console.log('  Performance stats:', stats);

      expect(stats).toBeTruthy();
      expect(stats.count).toBe(50);
      expect(parseFloat(stats.average)).toBeLessThan(10);
    });
  });
});

// Helper functions
function measureAverage(fn, iterations) {
  const durations = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    durations.push(performance.now() - start);
  }
  return durations.reduce((a, b) => a + b, 0) / iterations;
}

function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed / 1024 / 1024; // MB
  }
  return 0;
}
