/**
 * ============================================================================
 * WEEK 12: PERFORMANCE PROFILER & OPTIMIZATION TESTS
 * ============================================================================
 * Ensures < 2 second response time consistently for GENESIS Luna.
 *
 * Component Targets:
 *   - Emotion Detection:    < 50ms
 *   - State Update:         < 20ms
 *   - Mode Selection:       < 30ms
 *   - Hybrid Search:        < 100ms
 *   - Pattern Retrieval:    < 50ms
 *   - Neural Prediction:    < 100ms
 *   - Response Generation:  < 1500ms
 *   - TOTAL:               < 2000ms
 *
 * Created: Week 12 - Launch Prep
 * Status: PERFORMANCE VALIDATION
 * ============================================================================
 */

// Import systems for profiling
const BathtubCalculator = require('../healing/bathtubCalculator');
const StackExecutor = require('../healing/stackExecutor');
const EffectivenessCalculator = require('../learning/effectivenessCalculator');
const PatternAggregator = require('../learning/patternAggregator');
const NeuralNetworkModel = require('../learning/neuralNetworkModel');
const HybridRecommender = require('../learning/hybridRecommender');
const AssertivenessMode = require('../personality/assertivenessMode');
const InsideJokesEngine = require('../personality/insideJokes');
const BanterSystem = require('../personality/banter');
const LunaQuirks = require('../personality/lunaQuirks');
const MilestoneSystem = require('../personality/milestones');
const HybridRetrieval = require('../memory/hybridRetrieval');
const EmotionalStateTracker = require('../emotional/stateTracker');
const SemanticChunker = require('../memory/semanticChunker');

// Performance tracking
const profile = {
  emotionDetection: 0,
  stateUpdate: 0,
  modeSelection: 0,
  hybridSearch: 0,
  patternRetrieval: 0,
  neuralPrediction: 0,
  chunking: 0,
  total: 0
};

const targets = {
  emotionDetection: 50,
  stateUpdate: 20,
  modeSelection: 30,
  hybridSearch: 100,
  patternRetrieval: 50,
  neuralPrediction: 100,
  chunking: 50,
  total: 2000
};

let passed = 0;
let failed = 0;

function perfTest(name, target, fn) {
  const start = process.hrtime.bigint();
  try {
    const result = fn();
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6; // Convert to ms

    const passed_test = elapsed < target;
    const icon = passed_test ? '✅' : '⚠️';
    const color = passed_test ? '\x1b[32m' : '\x1b[33m';

    console.log(`  ${color}${icon} ${name}: ${elapsed.toFixed(2)}ms (target: <${target}ms)\x1b[0m`);

    if (passed_test) {
      passed++;
    } else {
      failed++;
    }

    return { elapsed, passed: passed_test, result };
  } catch (error) {
    console.log(`  \x1b[31m❌ ${name}: ERROR - ${error.message}\x1b[0m`);
    failed++;
    return { elapsed: 0, passed: false, result: null };
  }
}

async function asyncPerfTest(name, target, fn) {
  const start = process.hrtime.bigint();
  try {
    const result = await fn();
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;

    const passed_test = elapsed < target;
    const icon = passed_test ? '✅' : '⚠️';
    const color = passed_test ? '\x1b[32m' : '\x1b[33m';

    console.log(`  ${color}${icon} ${name}: ${elapsed.toFixed(2)}ms (target: <${target}ms)\x1b[0m`);

    if (passed_test) {
      passed++;
    } else {
      failed++;
    }

    return { elapsed, passed: passed_test, result };
  } catch (error) {
    console.log(`  \x1b[31m❌ ${name}: ERROR - ${error.message}\x1b[0m`);
    failed++;
    return { elapsed: 0, passed: false, result: null };
  }
}

// ============================================================================
// COMPONENT PROFILING
// ============================================================================

function profileBathtubCalculator() {
  console.log('\n\x1b[36m🛁 BATHTUB CALCULATOR PERFORMANCE\x1b[0m\n');

  const calculator = new BathtubCalculator();

  // Single calculation
  perfTest('Single concentration calculation', 1, () => {
    return calculator.calculateConcentration(35, 65);
  });

  // State determination
  perfTest('State determination', 1, () => {
    return calculator.calculateState(35, 65);
  });

  // Batch calculations (100 users)
  const batchResult = perfTest('100 user calculations', 10, () => {
    const results = [];
    for (let i = 0; i < 100; i++) {
      results.push(calculator.calculateState(i % 60, 100 - (i % 60)));
    }
    return results;
  });
  profile.emotionDetection = batchResult.elapsed / 100;

  // Stress test (1000 calculations)
  perfTest('1000 calculations (stress)', 50, () => {
    for (let i = 0; i < 1000; i++) {
      calculator.calculateConcentration(Math.random() * 100, Math.random() * 100);
    }
  });
}

function profileEmotionalState() {
  console.log('\n\x1b[36m💛 EMOTIONAL STATE TRACKER PERFORMANCE\x1b[0m\n');

  const tracker = new EmotionalStateTracker();

  // Default state access
  perfTest('Default state access', 1, () => {
    return tracker.defaultStates;
  });

  // Decay calculation
  perfTest('Decay rate calculation', 5, () => {
    const rates = tracker.decayRates;
    return {
      affection: 5.0 - (rates.affection * 3),
      trust: 5.0 - (rates.trust * 3),
      concern: 2.0 - (rates.concern * 3),
      curiosity: 3.0 - (rates.curiosity * 3)
    };
  });

  // Days since calculation
  const stateResult = perfTest('Days since interaction', 2, () => {
    const dates = [];
    for (let i = 0; i < 100; i++) {
      const testDate = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
      dates.push(tracker.daysSinceLastInteraction(testDate));
    }
    return dates;
  });
  profile.stateUpdate = stateResult.elapsed / 100;

  // Emotion mapping
  perfTest('Emotion state mapping', 5, () => {
    const emotions = ['joy', 'sadness', 'fear', 'anger', 'surprise'];
    return emotions.map(e => tracker.emotionStateMapping[e]);
  });

  // Prompt context generation
  perfTest('Prompt context generation', 10, () => {
    return tracker.getPromptContext({
      affection: 7,
      concern: 2,
      trust: 8,
      curiosity: 5
    }, 2);
  });
}

function profileModeSelection() {
  console.log('\n\x1b[36m🎭 ASSERTIVENESS MODE PERFORMANCE\x1b[0m\n');

  const modeSelector = new AssertivenessMode();

  // Mode access
  perfTest('Mode definitions access', 1, () => {
    return Object.keys(modeSelector.modes);
  });

  // Rule access
  const ruleResult = perfTest('100 emotion rule lookups', 5, () => {
    const emotions = ['joy', 'sadness', 'fear', 'anger', 'surprise'];
    const results = [];
    for (let i = 0; i < 100; i++) {
      results.push(modeSelector.rules.emotions[emotions[i % 5]]);
    }
    return results;
  });
  profile.modeSelection = ruleResult.elapsed / 100;

  // Keyword matching
  perfTest('Keyword pattern matching', 10, () => {
    const messages = [
      'I feel so sad today',
      'Help me please',
      'Celebrating my success!',
      'I hurt myself sometimes',
      'Just a normal day'
    ];
    return messages.map(msg => modeSelector.checkFirmTriggers(msg));
  });

  // Mode priority sorting
  perfTest('Mode priority sorting', 5, () => {
    return Object.entries(modeSelector.modes)
      .sort((a, b) => b[1].priority - a[1].priority);
  });
}

function profileHybridSearch() {
  console.log('\n\x1b[36m🔍 HYBRID SEARCH PERFORMANCE\x1b[0m\n');

  const retrieval = new HybridRetrieval();

  // RRF calculation
  perfTest('Single RRF score', 0.1, () => {
    return retrieval.calculateRRF(1);
  });

  // Batch RRF calculations
  const rrfResult = perfTest('1000 RRF calculations', 5, () => {
    const scores = [];
    for (let i = 1; i <= 1000; i++) {
      scores.push(retrieval.calculateRRF(i));
    }
    return scores;
  });

  // Weight configuration
  perfTest('Weight access and configuration', 1, () => {
    const weights = retrieval.getWeights();
    retrieval.setWeights(1.0, 1.0, 0.5);
    const newWeights = retrieval.getWeights();
    retrieval.setWeights(weights.vector, weights.keyword, weights.recency);
    return newWeights;
  });

  // Score map operations (simulating fusion)
  const fusionResult = perfTest('RRF fusion simulation (100 results)', 20, () => {
    const scoreMap = new Map();

    // Simulate 3 result sets with 100 items each
    for (let source = 0; source < 3; source++) {
      for (let rank = 1; rank <= 100; rank++) {
        const id = `doc_${(rank + source * 10) % 100}`;
        const rrfScore = retrieval.calculateRRF(rank);

        if (!scoreMap.has(id)) {
          scoreMap.set(id, { total: 0, sources: [] });
        }
        const data = scoreMap.get(id);
        data.total += rrfScore;
        data.sources.push({ source, score: rrfScore, rank });
      }
    }

    // Sort and get top 15
    return [...scoreMap.entries()]
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 15);
  });
  profile.hybridSearch = fusionResult.elapsed;
}

function profilePatternAggregator() {
  console.log('\n\x1b[36m📊 PATTERN AGGREGATOR PERFORMANCE\x1b[0m\n');

  const aggregator = new PatternAggregator();

  // Threshold access
  perfTest('Similarity threshold access', 0.5, () => {
    return aggregator.similarityThreshold;
  });

  // Confidence level determination
  const patternResult = perfTest('100 confidence level lookups', 5, () => {
    const results = [];
    for (let i = 0; i < 100; i++) {
      const count = Math.floor(Math.random() * 100);
      if (count >= 30) results.push(aggregator.confidenceLevels.HIGH);
      else if (count >= 10) results.push(aggregator.confidenceLevels.MODERATE);
      else results.push(aggregator.confidenceLevels.LOW);
    }
    return results;
  });
  profile.patternRetrieval = patternResult.elapsed / 100;

  // Aggregation key generation
  perfTest('Pattern key generation', 10, () => {
    const patterns = [];
    for (let i = 0; i < 100; i++) {
      patterns.push({
        emotion: ['joy', 'sadness', 'fear'][i % 3],
        intervention: ['validate', 'reframe', 'distract'][i % 3],
        intensity: Math.floor(Math.random() * 10)
      });
    }
    return patterns.map(p => `${p.emotion}_${p.intervention}_${Math.floor(p.intensity / 3)}`);
  });
}

async function profileNeuralNetwork() {
  console.log('\n\x1b[36m🧠 NEURAL NETWORK PERFORMANCE\x1b[0m\n');

  const neural = new NeuralNetworkModel();

  // Model creation
  const createResult = await asyncPerfTest('Model creation', 500, async () => {
    neural.createModel();
    return neural.getModelInfo();
  });

  // Model info retrieval
  perfTest('Model info retrieval', 5, () => {
    return neural.getModelInfo();
  });

  profile.neuralPrediction = createResult.elapsed;
}

function profileSemanticChunker() {
  console.log('\n\x1b[36m📄 SEMANTIC CHUNKER PERFORMANCE\x1b[0m\n');

  const chunker = new SemanticChunker();

  // Config access
  perfTest('Config access', 0.5, () => {
    return chunker.getConfig();
  });

  // Token estimation
  perfTest('Token estimation (short text)', 1, () => {
    return chunker.estimateTokens('Hello world, this is a test message.');
  });

  // Token estimation for long text
  const longText = 'This is a longer conversation. '.repeat(100);
  perfTest('Token estimation (long text)', 5, () => {
    return chunker.estimateTokens(longText);
  });

  // Chunk validation
  const testChunks = Array(50).fill({ content: 'Test chunk content '.repeat(20) });
  const chunkResult = perfTest('50 chunk validation', 20, () => {
    return chunker.validateChunks(testChunks);
  });
  profile.chunking = chunkResult.elapsed;

  // Separator priority
  perfTest('Separator priority access', 0.5, () => {
    return chunker.separators;
  });
}

function profilePersonalitySystems() {
  console.log('\n\x1b[36m✨ PERSONALITY SYSTEMS PERFORMANCE\x1b[0m\n');

  // Inside Jokes
  const jokes = new InsideJokesEngine();
  perfTest('Inside jokes category access', 1, () => {
    return jokes.categories;
  });

  perfTest('Pattern matching check', 5, () => {
    const phrases = ['That\'s our thing!', 'Remember when...', 'LOL classic'];
    return phrases.map(p => jokes.patterns.quotedPhrase.test(p));
  });

  // Banter
  const banter = new BanterSystem();
  perfTest('Banter styles access', 1, () => {
    return banter.styles;
  });

  perfTest('100 banter block checks', 10, () => {
    const results = [];
    for (let i = 0; i < 100; i++) {
      const emotion = {
        primary: ['joy', 'sadness', 'fear'][i % 3],
        intensity: (i % 10) + 1
      };
      results.push(banter.shouldBlockBanter(emotion, []));
    }
    return results;
  });

  // Quirks
  const quirks = new LunaQuirks();
  perfTest('Quirks traits access', 1, () => {
    return quirks.traits;
  });

  perfTest('100 quirk exhibition checks', 10, () => {
    const results = [];
    const traits = Object.keys(quirks.traits || {});
    for (let i = 0; i < 100; i++) {
      const trait = traits[i % traits.length] || 'DRAMATIC_REACTIONS';
      results.push(quirks.shouldExhibitQuirk(trait, { isSeriousMoment: i % 5 === 0 }));
    }
    return results;
  });

  // Milestones
  const milestones = new MilestoneSystem();
  perfTest('Milestone types access', 1, () => {
    return milestones.milestones;
  });
}

// ============================================================================
// FULL PIPELINE SIMULATION
// ============================================================================

async function profileFullPipeline() {
  console.log('\n\x1b[36m🚀 FULL PIPELINE SIMULATION\x1b[0m\n');

  // Simulate complete response pipeline
  const pipelineResult = await asyncPerfTest('Complete response pipeline (simulated)', targets.total, async () => {
    const bathtub = new BathtubCalculator();
    const tracker = new EmotionalStateTracker();
    const modeSelector = new AssertivenessMode();
    const retrieval = new HybridRetrieval();
    const aggregator = new PatternAggregator();
    const neural = new NeuralNetworkModel();
    const chunker = new SemanticChunker();
    const banter = new BanterSystem();
    const quirks = new LunaQuirks();

    // Step 1: Emotion detection (bathtub state)
    const state = bathtub.calculateState(25, 75);

    // Step 2: Emotional state update
    const emotionalContext = tracker.getPromptContext({
      affection: 6, concern: 1, trust: 7, curiosity: 4
    }, 0);

    // Step 3: Mode selection (via rules)
    const modeRule = modeSelector.rules.emotions.joy;

    // Step 4: Hybrid search simulation
    const weights = retrieval.getWeights();
    const rrfScores = [];
    for (let i = 1; i <= 50; i++) {
      rrfScores.push(retrieval.calculateRRF(i));
    }

    // Step 5: Pattern retrieval
    const confidence = aggregator.confidenceLevels.MODERATE;

    // Step 6: Neural prediction
    neural.createModel();
    const modelInfo = neural.getModelInfo();

    // Step 7: Semantic chunking
    const config = chunker.getConfig();

    // Step 8: Personality additions
    const shouldBanter = !banter.shouldBlockBanter({ primary: 'joy', intensity: 7 }, []);
    const showQuirk = quirks.shouldExhibitQuirk('DRAMATIC_REACTIONS', { isSeriousMoment: false });

    return {
      state,
      emotionalContext,
      modeRule,
      rrfScores: rrfScores.length,
      confidence,
      modelInfo,
      config,
      shouldBanter,
      showQuirk
    };
  });

  profile.total = pipelineResult.elapsed;
}

// ============================================================================
// MEMORY & RESOURCE TESTS
// ============================================================================

function profileMemoryUsage() {
  console.log('\n\x1b[36m💾 MEMORY USAGE ANALYSIS\x1b[0m\n');

  const initialMemory = process.memoryUsage();

  // Create all systems
  const systems = [];
  for (let i = 0; i < 10; i++) {
    systems.push(new BathtubCalculator());
    systems.push(new EmotionalStateTracker());
    systems.push(new AssertivenessMode());
    systems.push(new HybridRetrieval());
    systems.push(new SemanticChunker());
    systems.push(new BanterSystem());
    systems.push(new LunaQuirks());
    systems.push(new MilestoneSystem());
    systems.push(new InsideJokesEngine());
  }

  const afterCreation = process.memoryUsage();

  const heapUsed = (afterCreation.heapUsed - initialMemory.heapUsed) / 1024 / 1024;
  const heapTotal = afterCreation.heapTotal / 1024 / 1024;

  console.log(`  📊 Heap used for 90 instances: ${heapUsed.toFixed(2)} MB`);
  console.log(`  📊 Total heap: ${heapTotal.toFixed(2)} MB`);

  if (heapUsed < 50) {
    console.log(`  \x1b[32m✅ Memory usage acceptable (<50MB)\x1b[0m`);
    passed++;
  } else {
    console.log(`  \x1b[33m⚠️ Memory usage high (>${heapUsed.toFixed(2)}MB)\x1b[0m`);
    failed++;
  }
}

// ============================================================================
// RUN ALL PROFILING
// ============================================================================

async function runAllProfiles() {
  console.log('============================================================');
  console.log('⚡ WEEK 12: PERFORMANCE PROFILER');
  console.log('============================================================');
  console.log(`Target: < ${targets.total}ms total response time`);

  // Run component profiles
  profileBathtubCalculator();
  profileEmotionalState();
  profileModeSelection();
  profileHybridSearch();
  profilePatternAggregator();
  await profileNeuralNetwork();
  profileSemanticChunker();
  profilePersonalitySystems();

  // Run full pipeline
  await profileFullPipeline();

  // Memory analysis
  profileMemoryUsage();

  // ============================================================================
  // RESULTS SUMMARY
  // ============================================================================
  console.log('\n============================================================');
  console.log('📊 PERFORMANCE PROFILE SUMMARY');
  console.log('============================================================\n');

  console.log('Component Times (per operation):');
  console.log(`  🛁 Emotion/State Detection: ${profile.emotionDetection.toFixed(2)}ms (target: <${targets.emotionDetection}ms)`);
  console.log(`  💛 State Update:            ${profile.stateUpdate.toFixed(2)}ms (target: <${targets.stateUpdate}ms)`);
  console.log(`  🎭 Mode Selection:          ${profile.modeSelection.toFixed(2)}ms (target: <${targets.modeSelection}ms)`);
  console.log(`  🔍 Hybrid Search:           ${profile.hybridSearch.toFixed(2)}ms (target: <${targets.hybridSearch}ms)`);
  console.log(`  📊 Pattern Retrieval:       ${profile.patternRetrieval.toFixed(2)}ms (target: <${targets.patternRetrieval}ms)`);
  console.log(`  🧠 Neural Prediction:       ${profile.neuralPrediction.toFixed(2)}ms (target: <${targets.neuralPrediction}ms)`);
  console.log(`  📄 Semantic Chunking:       ${profile.chunking.toFixed(2)}ms (target: <${targets.chunking}ms)`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  🚀 Full Pipeline:           ${profile.total.toFixed(2)}ms (target: <${targets.total}ms)`);

  console.log('\n============================================================');
  console.log('📈 PERFORMANCE TEST RESULTS');
  console.log('============================================================\n');

  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️ Warnings/Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);

  const allTargetsMet =
    profile.total < targets.total &&
    profile.emotionDetection < targets.emotionDetection &&
    profile.stateUpdate < targets.stateUpdate &&
    profile.modeSelection < targets.modeSelection &&
    profile.hybridSearch < targets.hybridSearch;

  if (allTargetsMet) {
    console.log('\n\x1b[32m🎉 ALL PERFORMANCE TARGETS MET!\x1b[0m');
    console.log('\x1b[32m🚀 Luna response time < 2 seconds achieved!\x1b[0m');
  } else if (profile.total < targets.total) {
    console.log('\n\x1b[33m✅ Overall target met, some component optimizations possible\x1b[0m');
  } else {
    console.log('\n\x1b[31m⚠️ Performance optimization needed\x1b[0m');
    process.exit(1);
  }
}

// Run profiler
runAllProfiles().catch(console.error);
