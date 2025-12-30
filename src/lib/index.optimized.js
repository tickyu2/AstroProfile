/**
 * Optimized GENESIS Exports
 * Use these instead of the original exports for production
 */

// Optimized core components
export {
  OptimizedLexicons,
  optimizedLexicons,
  Lexicons
} from './optimized/lexicons.optimized.js';

export {
  OptimizedSignalExtractor,
  optimizedSignalExtractor
} from './optimized/signalExtractor.optimized.js';

export {
  OptimizedArchetypeDetector,
  optimizedArchetypeDetector
} from './optimized/archetypeDetector.optimized.js';

// Memory management
export {
  MemoryManager,
  LRUCache,
  memoryManager
} from './optimized/memoryManager.js';

// Performance monitoring
export {
  PerformanceMonitor,
  performanceMonitor
} from './optimized/performanceMonitor.js';

// Worker pool (optional)
export {
  WorkerPool,
  workerPool
} from './workers/workerPool.js';

// Keep original congruence service (no optimization needed - already fast)
export { EmotionCongruenceService } from './emotionCongruenceService.js';

/**
 * Convenience function: Analyze text with all optimizations
 */
export async function analyzeOptimized(text, voiceEmotion = null) {
  const { performanceMonitor } = await import('./optimized/performanceMonitor.js');
  const { optimizedSignalExtractor } = await import('./optimized/signalExtractor.optimized.js');
  const { optimizedArchetypeDetector } = await import('./optimized/archetypeDetector.optimized.js');

  return performanceMonitor.measure('analyzeOptimized', () => {
    const signals = optimizedSignalExtractor.extract(text);
    const archetype = optimizedArchetypeDetector.detect(signals);

    return {
      text,
      signals,
      archetype,
      voiceEmotion,
      timestamp: Date.now()
    };
  });
}
