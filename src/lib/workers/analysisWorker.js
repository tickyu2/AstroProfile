/**
 * Worker Thread for Parallel Analysis
 * Runs in separate thread to avoid blocking main thread
 */

import { parentPort } from 'worker_threads';
import { OptimizedSignalExtractor } from '../optimized/signalExtractor.optimized.js';
import { OptimizedArchetypeDetector } from '../optimized/archetypeDetector.optimized.js';

// Initialize analyzers once
const signalExtractor = new OptimizedSignalExtractor();
const archetypeDetector = new OptimizedArchetypeDetector();

// Listen for messages from main thread
parentPort.on('message', (data) => {
  const { id, text, voiceEmotion } = data;

  try {
    // Perform analysis
    const signals = signalExtractor.extract(text);
    const archetype = archetypeDetector.detect(signals);

    // Send result back to main thread
    parentPort.postMessage({
      id,
      success: true,
      result: { signals, archetype }
    });
  } catch (error) {
    // Send error back to main thread
    parentPort.postMessage({
      id,
      success: false,
      error: error.message
    });
  }
});

console.log('[AnalysisWorker] Worker thread ready');
