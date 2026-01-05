/**
 * ============================================================================
 * TEST NEURAL NETWORK SYSTEM
 * ============================================================================
 * Tests Week 8 neural network system:
 * - Model architecture creation
 * - Training pipeline
 * - Prediction system
 * - Hybrid recommendations
 *
 * Created: December 31, 2025
 * Week 8: Neural Networks - Phase 2 Week 4
 * ============================================================================
 */

const NeuralNetworkModel = require('../learning/neuralNetworkModel');
const HybridRecommender = require('../learning/hybridRecommender');
const PatternRecorder = require('../learning/patternRecorder');

// Test counters
let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

async function testNeuralNetwork() {
  console.log('\n🧪 Testing Neural Network System...\n');

  const model = new NeuralNetworkModel();
  const hybrid = new HybridRecommender();
  const recorder = new PatternRecorder();

  // ============================================
  // TEST 1: Create Model Architecture
  // ============================================
  console.log('TEST 1: Create Neural Network Architecture');
  console.log('----------------------------------------');

  model.createModel();
  const modelInfo = model.getModelInfo();

  test('Model status is LOADED', modelInfo.status === 'LOADED');
  test('Input shape is [50]', JSON.stringify(modelInfo.inputShape) === '[50]');
  test('Output shape is [15]', JSON.stringify(modelInfo.outputShape) === '[15]');
  test('Has 15 approaches', modelInfo.approaches.length === 15);
  test('Total params > 0', modelInfo.totalParams > 0);

  console.log(`  Architecture: 50D → 128 → 64 → 32 → 15D`);
  console.log(`  Total parameters: ${modelInfo.totalParams}\n`);

  // ============================================
  // TEST 2: Approach Index Mapping
  // ============================================
  console.log('TEST 2: Approach Index Mapping');
  console.log('----------------------------------------');

  test('connection index is 2', model.getApproachIndex('connection') === 2);
  test('achievement index is 1', model.getApproachIndex('achievement') === 1);
  test('3-stack index is 0', model.getApproachIndex('3-stack') === 0);
  test('unknown returns -1', model.getApproachIndex('unknown') === -1);
  test('index 2 is connection', model.getApproachName(2) === 'connection');
  test('index 99 is unknown', model.getApproachName(99) === 'unknown');

  // ============================================
  // TEST 3: Prepare Mock Training Data
  // ============================================
  console.log('\nTEST 3: Prepare Training Data');
  console.log('----------------------------------------');

  const mockData = [];

  // Create 50 mock training samples
  for (let i = 0; i < 50; i++) {
    const stateVector = recorder.createStateVector({
      emotions: {
        joy: Math.random() * 0.5,
        sadness: Math.random() * 0.8,
        trust: Math.random() * 0.6,
        fear: Math.random() * 0.3,
        surprise: Math.random() * 0.2,
        disgust: Math.random() * 0.1,
        anger: Math.random() * 0.2,
        anticipation: Math.random() * 0.3
      },
      elementBalance: {
        Fire: Math.random() * 30,
        Wood: Math.random() * 40,
        Water: Math.random() * 30,
        Metal: Math.random() * 20,
        Earth: Math.random() * 20
      },
      bathtub: {
        salt: 20 + Math.random() * 30,
        water: 50 + Math.random() * 50,
        concentration: 20 + Math.random() * 30,
        state: 'SAD'
      }
    });

    // Random approach (biased toward connection for sad states)
    const approaches = ['connection', 'achievement', 'delight'];
    const approach = Math.random() < 0.7 ? 'connection' : approaches[Math.floor(Math.random() * approaches.length)];

    // Random effectiveness (connection tends to work better)
    const effectiveness = approach === 'connection'
      ? 0.6 + Math.random() * 0.4
      : 0.3 + Math.random() * 0.5;

    // One-hot encoding
    const approachIdx = model.approaches.indexOf(approach);
    const approachOneHot = new Array(15).fill(0);
    approachOneHot[approachIdx] = effectiveness;

    mockData.push({
      stateVector: stateVector,
      approachType: approach,
      approachOneHot: approachOneHot,
      effectiveness: effectiveness
    });
  }

  test('Created 50 samples', mockData.length === 50);
  test('State vector is 50D', mockData[0].stateVector.length === 50);
  test('One-hot is 15D', mockData[0].approachOneHot.length === 15);
  test('Effectiveness in range', mockData[0].effectiveness >= 0 && mockData[0].effectiveness <= 1);

  // ============================================
  // TEST 4: Split Data
  // ============================================
  console.log('\nTEST 4: Split Training/Validation Data');
  console.log('----------------------------------------');

  const split = model.splitData(mockData, 0.2);

  test('Training has 80%', split.training.length === 40);
  test('Validation has 20%', split.validation.length === 10);
  test('Total preserved', split.training.length + split.validation.length === 50);

  // ============================================
  // TEST 5: Train Neural Network
  // ============================================
  console.log('\nTEST 5: Train Neural Network (5 epochs)');
  console.log('----------------------------------------');

  const history = await model.trainModel(split.training, split.validation, 5);

  test('Training completed', history !== null);
  test('History recorded', model.trainingHistory.length === 5);
  test('Loss is number', typeof model.trainingHistory[0].loss === 'number');
  test('Accuracy is number', typeof model.trainingHistory[0].accuracy === 'number');

  // ============================================
  // TEST 6: Make Predictions
  // ============================================
  console.log('\nTEST 6: Make Predictions');
  console.log('----------------------------------------');

  const testState = recorder.createStateVector({
    emotions: { joy: 0.2, sadness: 0.7, trust: 0.3 },
    elementBalance: { Fire: 10, Wood: 45, Water: 20, Metal: 15, Earth: 10 },
    bathtub: { salt: 35, water: 65, concentration: 35, state: 'SAD' }
  });

  const predictions = await model.predict(testState);

  test('Got predictions object', typeof predictions === 'object');
  test('Has 15 approaches', Object.keys(predictions).length === 15);
  test('connection probability exists', typeof predictions['connection'] === 'number');
  test('Probabilities sum ~1', Math.abs(Object.values(predictions).reduce((a, b) => a + b, 0) - 1) < 0.01);

  console.log('\n  Top predictions for SAD state:');
  const sorted = Object.entries(predictions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  sorted.forEach(([approach, prob], idx) => {
    console.log(`    ${idx + 1}. ${approach}: ${(prob * 100).toFixed(1)}%`);
  });

  // ============================================
  // TEST 7: Top-K Predictions
  // ============================================
  console.log('\nTEST 7: Top-K Predictions with Confidence');
  console.log('----------------------------------------');

  const topK = await model.predictTopK(testState, 3);

  test('Got 3 predictions', topK.length === 3);
  test('First has approach', typeof topK[0].approach === 'string');
  test('First has probability', typeof topK[0].probability === 'number');
  test('First has confidence', ['LOW', 'MODERATE', 'HIGH'].includes(topK[0].confidence));
  test('Sorted descending', topK[0].probability >= topK[1].probability);

  // ============================================
  // TEST 8: Probability to Confidence
  // ============================================
  console.log('\nTEST 8: Probability to Confidence');
  console.log('----------------------------------------');

  test('0.8 → HIGH', model.probabilityToConfidence(0.8) === 'HIGH');
  test('0.7 → HIGH', model.probabilityToConfidence(0.7) === 'HIGH');
  test('0.5 → MODERATE', model.probabilityToConfidence(0.5) === 'MODERATE');
  test('0.4 → MODERATE', model.probabilityToConfidence(0.4) === 'MODERATE');
  test('0.3 → LOW', model.probabilityToConfidence(0.3) === 'LOW');
  test('0.1 → LOW', model.probabilityToConfidence(0.1) === 'LOW');

  // ============================================
  // TEST 9: Model Evaluation
  // ============================================
  console.log('\nTEST 9: Model Evaluation');
  console.log('----------------------------------------');

  const evaluation = await model.evaluate(split.validation);

  test('Got loss', typeof evaluation.loss === 'number');
  test('Got accuracy', typeof evaluation.accuracy === 'number');
  test('Loss is positive', evaluation.loss >= 0);
  test('Accuracy in range', evaluation.accuracy >= 0 && evaluation.accuracy <= 1);

  console.log(`  Loss: ${evaluation.loss.toFixed(4)}`);
  console.log(`  Accuracy: ${(evaluation.accuracy * 100).toFixed(1)}%`);

  // ============================================
  // TEST 10: Hybrid Recommender Initialization
  // ============================================
  console.log('\nTEST 10: Hybrid Recommender Initialization');
  console.log('----------------------------------------');

  await hybrid.initialize();

  test('Hybrid initialized', hybrid.initialized === true);

  const status = hybrid.getModelStatus();
  test('Status has neural', status.neural !== undefined);
  test('Status has hybrid', status.hybrid !== undefined);
  test('Pattern available', status.hybrid.patternAvailable === true);

  // ============================================
  // TEST 11: Hybrid Combination Logic
  // ============================================
  console.log('\nTEST 11: Hybrid Combination Logic');
  console.log('----------------------------------------');

  // Test case: Pattern only (no neural)
  const patternOnly = hybrid.combineRecommendations(
    { recommendation: 'connection', confidence: 'HIGH', reason: 'Pattern match' },
    null
  );

  test('Pattern only: source is pattern', patternOnly.primary.source === 'pattern');
  test('Pattern only: neural unavailable', patternOnly.neuralAvailable === false);

  // Test case: Both agree
  const bothAgree = hybrid.combineRecommendations(
    { recommendation: 'connection', confidence: 'MODERATE', reason: 'Pattern match' },
    [{ approach: 'connection', probability: 0.6, confidence: 'MODERATE' }]
  );

  test('Both agree: source is hybrid', bothAgree.primary.source === 'hybrid');
  test('Both agree: confidence HIGH', bothAgree.primary.confidence === 'HIGH');

  // Test case: Pattern high, neural disagrees
  const patternHigh = hybrid.combineRecommendations(
    { recommendation: 'connection', confidence: 'HIGH', reason: 'Proven' },
    [{ approach: 'achievement', probability: 0.5, confidence: 'MODERATE' }]
  );

  test('Pattern HIGH wins: approach is connection', patternHigh.primary.approach === 'connection');
  test('Pattern HIGH wins: source is pattern', patternHigh.primary.source === 'pattern');

  // Test case: Neural high probability
  const neuralHigh = hybrid.combineRecommendations(
    { recommendation: 'connection', confidence: 'LOW', reason: 'Weak match' },
    [{ approach: 'achievement', probability: 0.75, confidence: 'HIGH' }]
  );

  test('Neural HIGH wins: approach is achievement', neuralHigh.primary.approach === 'achievement');
  test('Neural HIGH wins: source is neural', neuralHigh.primary.source === 'neural');

  // ============================================
  // TEST 12: Full Hybrid Recommendation
  // ============================================
  console.log('\nTEST 12: Full Hybrid Recommendation');
  console.log('----------------------------------------');

  const hybridRec = await hybrid.getRecommendation('test_user', {
    emotions: { joy: 0.2, sadness: 0.7, trust: 0.3 },
    elementBalance: { Fire: 10, Wood: 45, Water: 20, Metal: 15, Earth: 10 },
    bathtub: { salt: 35, water: 65, concentration: 35, state: 'SAD' }
  });

  test('Has primary recommendation', hybridRec.primary !== undefined);
  test('Primary has approach', typeof hybridRec.primary.approach === 'string');
  test('Primary has source', ['pattern', 'neural', 'hybrid'].includes(hybridRec.primary.source));
  test('Has alternatives array', Array.isArray(hybridRec.alternatives));
  test('Has explanation', typeof hybridRec.explanation === 'string');

  console.log(`\n  Hybrid recommendation:`);
  console.log(`    Primary: ${hybridRec.primary.approach} (${hybridRec.primary.source})`);
  console.log(`    Confidence: ${hybridRec.primary.confidence}`);
  console.log(`    Alternatives: ${hybridRec.alternatives.length}`);

  // ============================================
  // TEST 13: Recommendation Breakdown
  // ============================================
  console.log('\nTEST 13: Recommendation Breakdown');
  console.log('----------------------------------------');

  const breakdown = await hybrid.getRecommendationBreakdown('test_user', {
    emotions: { joy: 0.2, sadness: 0.7, trust: 0.3 },
    elementBalance: { Fire: 10, Wood: 45, Water: 20, Metal: 15, Earth: 10 },
    bathtub: { salt: 35, water: 65, concentration: 35, state: 'SAD' }
  });

  test('Breakdown has recommendation', breakdown.recommendation !== undefined);
  test('Breakdown has stateVector', breakdown.stateVector !== undefined);
  test('State vector has 50 dimensions', breakdown.stateVector.dimensions === 50);
  test('Has emotions slice', breakdown.stateVector.emotions.length === 8);
  test('Has elements slice', breakdown.stateVector.elements.length === 5);

  // ============================================
  // TEST 14: Model Insufficient Data Handling
  // ============================================
  console.log('\nTEST 14: Insufficient Data Handling');
  console.log('----------------------------------------');

  // Create new hybrid without model
  const newHybrid = new HybridRecommender();
  const trainResult = await newHybrid.trainNeuralNetwork('nonexistent_user', 5);

  // Should fail due to no data from database
  test('Training handles no data gracefully', trainResult.success === false || trainResult.samples === 0 || trainResult.reason !== undefined);

  // ============================================
  // TEST 15: Approaches List Completeness
  // ============================================
  console.log('\nTEST 15: Approaches List');
  console.log('----------------------------------------');

  const approaches = model.approaches;

  test('Has 3-stack', approaches.includes('3-stack'));
  test('Has achievement', approaches.includes('achievement'));
  test('Has connection', approaches.includes('connection'));
  test('Has delight', approaches.includes('delight'));
  test('Has validation', approaches.includes('validation'));
  test('Has breathing', approaches.includes('breathing'));
  test('Has gratitude', approaches.includes('gratitude'));
  test('Total 15 approaches', approaches.length === 15);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed === 0) {
    console.log('🎉 All tests passed! Neural network system is operational.\n');
    console.log('NEURAL NETWORK SYSTEM: OPERATIONAL 🧠');
    console.log('----------------------------------------');
    console.log('✅ Architecture: 50D → 128 → 64 → 32 → 15D');
    console.log('✅ Training: Working with mock data');
    console.log('✅ Predictions: Probability distributions');
    console.log('✅ Top-K: Best approaches with confidence');
    console.log('✅ Hybrid: Neural + Pattern recommendations');
    console.log('✅ Evaluation: Loss and accuracy metrics');
    console.log('----------------------------------------');
    console.log('\n🧠 PHASE 2: INTELLIGENCE COMPLETE! 🧠\n');
  } else {
    console.log('⚠️  Some tests failed. Review the output above.\n');
  }

  return { passed, failed };
}

// Run tests
testNeuralNetwork().catch(console.error);
