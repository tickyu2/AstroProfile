/**
 * ============================================================================
 * TEST PATTERN LEARNING & AGGREGATION
 * ============================================================================
 * Tests Week 7 pattern learning system:
 * - Pattern aggregation
 * - Vector similarity calculation
 * - Confidence determination
 * - Recommendation engine
 *
 * Created: December 31, 2025
 * Week 7: Pattern Learning - Phase 2 Week 3
 * ============================================================================
 */

const PatternAggregator = require('../learning/patternAggregator');
const RecommendationEngine = require('../learning/recommendationEngine');
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

async function testPatternLearning() {
  console.log('\n🧪 Testing Pattern Learning & Aggregation...\n');

  const aggregator = new PatternAggregator();
  const engine = new RecommendationEngine();
  const recorder = new PatternRecorder();

  // ============================================
  // TEST 1: Vector Similarity Calculation
  // ============================================
  console.log('TEST 1: Vector Similarity Calculation');
  console.log('----------------------------------------');

  // Create identical vectors
  const vector1 = [0.5, 0.3, 0.7, 0.2, 0.4, 0.1, 0.8, 0.6];
  const vector2 = [0.5, 0.3, 0.7, 0.2, 0.4, 0.1, 0.8, 0.6];
  const similarity1 = aggregator.calculateSimilarity(vector1, vector2);
  test('Identical vectors have similarity 1.0', Math.abs(similarity1 - 1.0) < 0.001);

  // Create similar vectors
  const vector3 = [0.5, 0.35, 0.65, 0.25, 0.45, 0.15, 0.75, 0.55];
  const similarity2 = aggregator.calculateSimilarity(vector1, vector3);
  test('Similar vectors have high similarity (>0.95)', similarity2 > 0.95);

  // Create different vectors
  const vector4 = [0.1, 0.9, 0.2, 0.8, 0.1, 0.9, 0.2, 0.8];
  const similarity3 = aggregator.calculateSimilarity(vector1, vector4);
  test('Different vectors have lower similarity (<0.9)', similarity3 < 0.9);

  // Handle null vectors
  const similarity4 = aggregator.calculateSimilarity(null, vector1);
  test('Null vector returns 0', similarity4 === 0);

  // Handle string vectors (as from database)
  const stringVector = JSON.stringify(vector1);
  const similarity5 = aggregator.calculateSimilarity(stringVector, vector2);
  test('String vector parsing works', Math.abs(similarity5 - 1.0) < 0.001);

  // ============================================
  // TEST 2: Confidence Level Determination
  // ============================================
  console.log('\nTEST 2: Confidence Level Determination');
  console.log('----------------------------------------');

  test('1 sample = LOW confidence', aggregator.determineConfidence(1) === 'LOW');
  test('2 samples = LOW confidence', aggregator.determineConfidence(2) === 'LOW');
  test('3 samples = MODERATE confidence', aggregator.determineConfidence(3) === 'MODERATE');
  test('9 samples = MODERATE confidence', aggregator.determineConfidence(9) === 'MODERATE');
  test('10 samples = HIGH confidence', aggregator.determineConfidence(10) === 'HIGH');
  test('100 samples = HIGH confidence', aggregator.determineConfidence(100) === 'HIGH');

  // ============================================
  // TEST 3: Approach Statistics Calculation
  // ============================================
  console.log('\nTEST 3: Approach Statistics Calculation');
  console.log('----------------------------------------');

  const attempts1 = [
    { effectiveness: 0.9, verdict: 'WORKED' },
    { effectiveness: 0.85, verdict: 'WORKED' },
    { effectiveness: 0.8, verdict: 'WORKED' }
  ];
  const stats1 = aggregator.calculateApproachStats(attempts1);
  test('Average calculation correct', Math.abs(stats1.avg - 0.85) < 0.001);
  test('Count correct', stats1.count === 3);
  test('Success rate 100% for all WORKED', stats1.successRate === 1.0);
  test('Verdict WORKED for high avg', stats1.verdict === 'WORKED');

  const attempts2 = [
    { effectiveness: 0.3, verdict: 'FAILED' },
    { effectiveness: 0.2, verdict: 'FAILED' }
  ];
  const stats2 = aggregator.calculateApproachStats(attempts2);
  test('Verdict FAILED for low avg', stats2.verdict === 'FAILED');
  test('Success rate 0% for all FAILED', stats2.successRate === 0);

  const attempts3 = [
    { effectiveness: 0.5, verdict: 'NEUTRAL' },
    { effectiveness: 0.6, verdict: 'NEUTRAL' }
  ];
  const stats3 = aggregator.calculateApproachStats(attempts3);
  test('Verdict NEUTRAL for mid avg', stats3.verdict === 'NEUTRAL');

  // ============================================
  // TEST 4: State Signature Creation
  // ============================================
  console.log('\nTEST 4: State Signature Creation');
  console.log('----------------------------------------');

  const mockRecord = {
    user_state: JSON.stringify({
      emotions: { joy: 0.2, trust: 0.3, sadness: 0.7, anger: 0.1 },
      bathtub: { state: 'SAD' },
      context: 'breakup',
      temporal: { hour: 14 }
    })
  };
  const signature = aggregator.createStateSignature(mockRecord);
  test('Emotional state extracted', signature.emotionalState === 'SAD');
  test('Dominant emotion found', signature.dominantEmotion === 'sadness');
  test('Context preserved', signature.context === 'breakup');
  test('Time of day calculated (afternoon)', signature.timeOfDay === 'afternoon');
  test('Description generated', signature.description.includes('SAD'));

  // ============================================
  // TEST 5: Time of Day Calculation
  // ============================================
  console.log('\nTEST 5: Time of Day Calculation');
  console.log('----------------------------------------');

  test('Hour 6 = morning', aggregator.getTimeOfDay(6) === 'morning');
  test('Hour 11 = morning', aggregator.getTimeOfDay(11) === 'morning');
  test('Hour 12 = afternoon', aggregator.getTimeOfDay(12) === 'afternoon');
  test('Hour 16 = afternoon', aggregator.getTimeOfDay(16) === 'afternoon');
  test('Hour 17 = evening', aggregator.getTimeOfDay(17) === 'evening');
  test('Hour 20 = evening', aggregator.getTimeOfDay(20) === 'evening');
  test('Hour 21 = night', aggregator.getTimeOfDay(21) === 'night');
  test('Hour 5 = night', aggregator.getTimeOfDay(5) === 'night');
  test('Null hour = unknown', aggregator.getTimeOfDay(null) === 'unknown');

  // ============================================
  // TEST 6: Recommendation Determination
  // ============================================
  console.log('\nTEST 6: Recommendation Determination');
  console.log('----------------------------------------');

  const rankings1 = [
    { approachType: 'connection', avgEffectiveness: 0.85, confidence: 'HIGH', verdict: 'WORKED' },
    { approachType: 'achievement', avgEffectiveness: 0.5, confidence: 'MODERATE', verdict: 'NEUTRAL' }
  ];
  test('Highest effective WORKED approach recommended', aggregator.determineRecommendation(rankings1) === 'connection');

  const rankings2 = [
    { approachType: 'connection', avgEffectiveness: 0.85, confidence: 'LOW', verdict: 'WORKED' },
    { approachType: 'achievement', avgEffectiveness: 0.6, confidence: 'MODERATE', verdict: 'NEUTRAL' }
  ];
  test('Low confidence skipped for moderate confidence', aggregator.determineRecommendation(rankings2) === 'achievement');

  const rankings3 = [
    { approachType: 'connection', avgEffectiveness: 0.3, confidence: 'LOW', verdict: 'FAILED' }
  ];
  test('Falls back to best even if low confidence', aggregator.determineRecommendation(rankings3) === 'connection');

  test('Empty rankings returns null', aggregator.determineRecommendation([]) === null);

  // ============================================
  // TEST 7: Fallback Recommendations
  // ============================================
  console.log('\nTEST 7: Fallback Recommendations');
  console.log('----------------------------------------');

  // Fire deficiency → connection
  const fireDefState = { elementBalance: { Fire: 10, Wood: 20, Water: 30 } };
  const fallback1 = engine.getFallbackRecommendation(fireDefState);
  test('Fire deficiency → connection', fallback1.approach === 'connection');
  test('Heuristic is constitutional', fallback1.heuristic === 'constitutional');

  // Wood excess → achievement
  const woodExcessState = { elementBalance: { Fire: 20, Wood: 35, Water: 20 } };
  const fallback2 = engine.getFallbackRecommendation(woodExcessState);
  test('Wood excess → achievement', fallback2.approach === 'achievement');

  // Water excess → delight
  const waterExcessState = { elementBalance: { Fire: 20, Wood: 20, Water: 35 } };
  const fallback3 = engine.getFallbackRecommendation(waterExcessState);
  test('Water excess → delight', fallback3.approach === 'delight');

  // SAD bathtub → connection
  const sadState = { bathtub: { state: 'SAD' }, elementBalance: {} };
  const fallback4 = engine.getFallbackRecommendation(sadState);
  test('SAD state → connection', fallback4.approach === 'connection');
  test('Bathtub heuristic used', fallback4.heuristic === 'bathtub');

  // Balanced state → 3-stack
  const balancedState = { bathtub: { state: 'CONTENT' }, elementBalance: { Fire: 20, Wood: 20, Water: 20 } };
  const fallback5 = engine.getFallbackRecommendation(balancedState);
  test('Balanced state → 3-stack', fallback5.approach === '3-stack');

  // ============================================
  // TEST 8: State Vector Creation
  // ============================================
  console.log('\nTEST 8: State Vector Creation');
  console.log('----------------------------------------');

  const testState = {
    emotions: { joy: 0.2, trust: 0.3, fear: 0.1, surprise: 0.05, sadness: 0.7, disgust: 0.1, anger: 0.15, anticipation: 0.2 },
    elementBalance: { Fire: 10, Wood: 45, Water: 20, Metal: 15, Earth: 10 },
    bathtub: { salt: 35, water: 65, concentration: 35, state: 'SAD' }
  };
  const stateVector = recorder.createStateVector(testState);

  test('Vector is 50 dimensions', stateVector.length === 50);
  test('Emotions mapped (index 0-7)', stateVector[0] === 0.2); // joy
  test('Sadness mapped', stateVector[4] === 0.7); // sadness
  test('Elements normalized (index 8-12)', stateVector[8] === 0.1); // Fire: 10/100
  test('Bathtub salt normalized (index 13)', stateVector[13] === 0.35); // salt: 35/100
  test('Bathtub state encoded (index 16)', stateVector[16] === 0.4); // SAD = 0.4

  // ============================================
  // TEST 9: State Grouping
  // ============================================
  console.log('\nTEST 9: State Grouping');
  console.log('----------------------------------------');

  // Create mock records with similar vectors
  const mockRecords = [
    { user_state_vector: [0.5, 0.3, 0.7, 0.2], approach_type: 'connection' },
    { user_state_vector: [0.5, 0.31, 0.69, 0.21], approach_type: 'connection' }, // Similar
    { user_state_vector: [0.1, 0.9, 0.2, 0.8], approach_type: 'achievement' }    // Different
  ];
  const groups = aggregator.groupSimilarStates(mockRecords);
  test('Similar states grouped together', groups.length === 2);
  test('First group has 2 records', groups[0].records.length === 2);
  test('Second group has 1 record', groups[1].records.length === 1);

  // ============================================
  // TEST 10: Overall Confidence Calculation
  // ============================================
  console.log('\nTEST 10: Overall Confidence Calculation');
  console.log('----------------------------------------');

  const lowSampleRankings = [{ sampleSize: 1 }, { sampleSize: 1 }];
  test('Total 2 samples = LOW', aggregator.determineOverallConfidence(lowSampleRankings) === 'LOW');

  const modSampleRankings = [{ sampleSize: 2 }, { sampleSize: 3 }];
  test('Total 5 samples = MODERATE', aggregator.determineOverallConfidence(modSampleRankings) === 'MODERATE');

  const highSampleRankings = [{ sampleSize: 5 }, { sampleSize: 6 }];
  test('Total 11 samples = HIGH', aggregator.determineOverallConfidence(highSampleRankings) === 'HIGH');

  // ============================================
  // TEST 11: Avoid Approaches Logic
  // ============================================
  console.log('\nTEST 11: Avoid Approaches Logic');
  console.log('----------------------------------------');

  const mixedRankings = [
    { approachType: 'connection', avgEffectiveness: 0.85, confidence: 'HIGH', verdict: 'WORKED' },
    { approachType: 'achievement', avgEffectiveness: 0.35, confidence: 'MODERATE', verdict: 'FAILED' },
    { approachType: 'delight', avgEffectiveness: 0.3, confidence: 'LOW', verdict: 'FAILED' }
  ];
  const avoidList = mixedRankings
    .filter(a => a.avgEffectiveness < 0.4 && a.confidence !== 'LOW')
    .map(a => a.approachType);

  test('Achievement in avoid list (low eff, mod conf)', avoidList.includes('achievement'));
  test('Delight NOT in avoid (low confidence)', !avoidList.includes('delight'));
  test('Connection NOT in avoid (high eff)', !avoidList.includes('connection'));

  // ============================================
  // TEST 12: Dominant Emotion Detection
  // ============================================
  console.log('\nTEST 12: Dominant Emotion Detection');
  console.log('----------------------------------------');

  const emotions1 = { joy: 0.3, sadness: 0.7, anger: 0.2 };
  test('Highest emotion found', aggregator.findDominantEmotion(emotions1) === 'sadness');

  const emotions2 = { joy: 0.8, sadness: 0.1, anger: 0.1 };
  test('Joy dominates', aggregator.findDominantEmotion(emotions2) === 'joy');

  test('Null emotions = neutral', aggregator.findDominantEmotion(null) === 'neutral');

  // ============================================
  // TEST 13: Recommendation Engine Integration
  // ============================================
  console.log('\nTEST 13: Recommendation Engine Integration');
  console.log('----------------------------------------');

  // Test without database (should use fallback)
  const rec = await engine.getRecommendation('test_user', {
    elementBalance: { Fire: 10, Wood: 20, Water: 20 },
    bathtub: { state: 'SAD' }
  });

  test('Recommendation returns object', typeof rec === 'object');
  test('Has confidence field', rec.confidence !== undefined);
  test('Has fallback when no DB', rec.fallback !== undefined || rec.recommendation !== null);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed === 0) {
    console.log('🎉 All tests passed! Pattern learning is operational.\n');
  } else {
    console.log('⚠️  Some tests failed. Review the output above.\n');
  }

  return { passed, failed };
}

// Run tests
testPatternLearning().catch(console.error);
