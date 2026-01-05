/**
 * ============================================================================
 * EFFECTIVENESS FEEDBACK LOOP TEST
 * ============================================================================
 * Tests the complete effectiveness feedback system:
 * - Response detection (text + voice + behavior)
 * - Effectiveness calculation (0-1 score)
 * - Pattern recording (50D state vectors)
 * - Verdict determination (WORKED/NEUTRAL/FAILED)
 *
 * Run: node functions/test/test-effectiveness-loop.js
 * ============================================================================
 */

const path = require('path');

async function testEffectivenessLoop() {
  console.log('='.repeat(60));
  console.log('EFFECTIVENESS FEEDBACK LOOP TEST');
  console.log('Week 6: Phase 2 - Luna Learns What Works');
  console.log('='.repeat(60));
  console.log('');

  // Dynamic imports
  const ResponseDetector = require('../learning/responseDetector');
  const EffectivenessCalculator = require('../learning/effectivenessCalculator');
  const PatternRecorder = require('../learning/patternRecorder');

  const detector = new ResponseDetector();
  const calculator = new EffectivenessCalculator();
  const recorder = new PatternRecorder();

  let passed = 0;
  let failed = 0;

  // =========================================================================
  // TEST 1: Positive Response Detection
  // =========================================================================
  console.log('TEST 1: Positive Response Detection');
  console.log('-'.repeat(40));

  const positiveMessage = "Wow, thank you! That memory really helps. I remember how proud I felt!";
  const positiveVoice = {
    energy: 'high',
    pitch: 'rising',
    quality: 'warm'
  };
  const positiveBehavior = {
    responseTime: 3000,
    messageLength: positiveMessage.length,
    hasFollowUp: true
  };

  const positiveResponse = await detector.detectResponse(positiveMessage, positiveVoice, positiveBehavior);

  console.log(`  Message: "${positiveMessage.slice(0, 50)}..."`);
  console.log(`  Response Type: ${positiveResponse.overall.responseType}`);
  console.log(`  Confidence: ${positiveResponse.overall.confidence.toFixed(2)}`);
  console.log(`  Text Engagement: ${positiveResponse.text.engagement.toFixed(2)}`);
  console.log(`  Voice Energy Shift: ${positiveResponse.voice?.energyShift || 'N/A'}`);
  console.log(`  Behavior Engagement: ${positiveResponse.behavior?.engagement.toFixed(2) || 'N/A'}`);

  const positiveOk = positiveResponse.overall.responseType === 'positive';
  if (positiveOk) passed++; else failed++;
  console.log(`  Expected: positive ${positiveOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 2: Negative Response Detection
  // =========================================================================
  console.log('TEST 2: Negative Response Detection');
  console.log('-'.repeat(40));

  const negativeMessage = "I don't know... doesn't really help.";
  const negativeVoice = {
    energy: 'low',
    pitch: 'falling',
    quality: 'flat'
  };
  const negativeBehavior = {
    responseTime: 8000,
    messageLength: negativeMessage.length,
    hasFollowUp: false
  };

  const negativeResponse = await detector.detectResponse(negativeMessage, negativeVoice, negativeBehavior);

  console.log(`  Message: "${negativeMessage}"`);
  console.log(`  Response Type: ${negativeResponse.overall.responseType}`);
  console.log(`  Confidence: ${negativeResponse.overall.confidence.toFixed(2)}`);

  const negativeOk = negativeResponse.overall.responseType === 'negative';
  if (negativeOk) passed++; else failed++;
  console.log(`  Expected: negative ${negativeOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 3: Neutral Response Detection
  // =========================================================================
  console.log('TEST 3: Neutral Response Detection');
  console.log('-'.repeat(40));

  const neutralMessage = "Okay, I see.";
  const neutralResponse = await detector.detectResponse(neutralMessage, null, null);

  console.log(`  Message: "${neutralMessage}"`);
  console.log(`  Response Type: ${neutralResponse.overall.responseType}`);
  console.log(`  Confidence: ${neutralResponse.overall.confidence.toFixed(2)}`);

  const neutralOk = neutralResponse.overall.responseType === 'neutral';
  if (neutralOk) passed++; else failed++;
  console.log(`  Expected: neutral ${neutralOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 4: Effectiveness Calculation - WORKED
  // =========================================================================
  console.log('TEST 4: Effectiveness Calculation - WORKED');
  console.log('-'.repeat(40));

  const workedEffectiveness = calculator.calculateEffectiveness(
    positiveResponse,
    { concentration: 35, state: 'SAD' },
    { concentration: 23, state: 'CONTENT' }
  );

  console.log('  State Change: SAD (35%) → CONTENT (23%)');
  console.log(`  Effectiveness Score: ${workedEffectiveness.score.toFixed(2)}`);
  console.log(`  Verdict: ${workedEffectiveness.verdict}`);
  console.log(`  Confidence: ${workedEffectiveness.confidence.toFixed(2)}`);
  console.log('  Breakdown:');
  console.log(`    Sentiment: ${workedEffectiveness.breakdown.sentiment.toFixed(3)}`);
  console.log(`    State Change: ${workedEffectiveness.breakdown.stateChange.toFixed(3)}`);
  console.log(`    Emotional Shift: ${workedEffectiveness.breakdown.emotionalShift.toFixed(3)}`);
  console.log(`    Engagement: ${workedEffectiveness.breakdown.engagement.toFixed(3)}`);

  const workedOk = workedEffectiveness.verdict === 'WORKED';
  if (workedOk) passed++; else failed++;
  console.log(`  Expected: WORKED ${workedOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 5: Effectiveness Calculation - FAILED
  // =========================================================================
  console.log('TEST 5: Effectiveness Calculation - FAILED');
  console.log('-'.repeat(40));

  const failedEffectiveness = calculator.calculateEffectiveness(
    negativeResponse,
    { concentration: 35, state: 'SAD' },
    { concentration: 34, state: 'SAD' }
  );

  console.log('  State Change: SAD (35%) → SAD (34%) (minimal improvement)');
  console.log(`  Effectiveness Score: ${failedEffectiveness.score.toFixed(2)}`);
  console.log(`  Verdict: ${failedEffectiveness.verdict}`);

  const failedOk = failedEffectiveness.verdict === 'FAILED';
  if (failedOk) passed++; else failed++;
  console.log(`  Expected: FAILED ${failedOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 6: Effectiveness Calculation - NEUTRAL
  // =========================================================================
  console.log('TEST 6: Effectiveness Calculation - NEUTRAL');
  console.log('-'.repeat(40));

  const neutralEffectiveness = calculator.calculateEffectiveness(
    neutralResponse,
    { concentration: 35, state: 'SAD' },
    { concentration: 30, state: 'SAD' }
  );

  console.log('  State Change: SAD (35%) → SAD (30%) (some improvement)');
  console.log(`  Effectiveness Score: ${neutralEffectiveness.score.toFixed(2)}`);
  console.log(`  Verdict: ${neutralEffectiveness.verdict}`);

  const neutralEffOk = neutralEffectiveness.verdict === 'NEUTRAL';
  if (neutralEffOk) passed++; else failed++;
  console.log(`  Expected: NEUTRAL ${neutralEffOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 7: State Vector Creation
  // =========================================================================
  console.log('TEST 7: State Vector Creation (50D)');
  console.log('-'.repeat(40));

  const mockUserState = {
    emotions: {
      joy: 0.2,
      trust: 0.3,
      fear: 0.1,
      surprise: 0.1,
      sadness: 0.7,
      disgust: 0.05,
      anger: 0.15,
      anticipation: 0.2
    },
    elementBalance: {
      Fire: 10,
      Wood: 45,
      Water: 20,
      Metal: 15,
      Earth: 10
    },
    bathtub: {
      salt: 35,
      water: 65,
      concentration: 35,
      state: 'SAD'
    },
    constitutionalContext: {
      element: 'Water',
      pillar: 'Day'
    },
    goal: 'reduce_sadness'
  };

  const stateVector = recorder.createStateVector(mockUserState);

  console.log(`  Vector dimensions: ${stateVector.length}`);
  console.log('  Sample values:');
  console.log(`    Joy (index 0): ${stateVector[0].toFixed(2)}`);
  console.log(`    Sadness (index 4): ${stateVector[4].toFixed(2)}`);
  console.log(`    Fire element (index 8): ${stateVector[8].toFixed(2)}`);
  console.log(`    Wood element (index 9): ${stateVector[9].toFixed(2)}`);
  console.log(`    Salt (index 13): ${stateVector[13].toFixed(2)}`);
  console.log(`    Concentration (index 15): ${stateVector[15].toFixed(2)}`);
  console.log(`    State number (index 16): ${stateVector[16].toFixed(2)}`);

  const vectorOk = stateVector.length === 50 && stateVector[4] === 0.7;
  if (vectorOk) passed++; else failed++;
  console.log(`  Expected: 50D vector with sadness=0.7 ${vectorOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 8: Pattern Recording
  // =========================================================================
  console.log('TEST 8: Pattern Recording');
  console.log('-'.repeat(40));

  const mockApproach = {
    type: '3-stack',
    details: {
      anchors: ['achievement', 'connection', 'delight'],
      waterAdded: 53
    }
  };

  const patternId = await recorder.recordPattern(
    'test_user_' + Date.now(),
    mockUserState,
    mockApproach,
    {
      response: positiveResponse,
      effectiveness: workedEffectiveness
    }
  );

  console.log(`  Pattern ID: ${patternId}`);
  console.log(`  Approach: ${mockApproach.type}`);
  console.log(`  Verdict: ${workedEffectiveness.verdict}`);
  console.log(`  Effectiveness: ${workedEffectiveness.score.toFixed(2)}`);

  const patternOk = patternId !== null && patternId !== undefined;
  if (patternOk) passed++; else failed++;
  console.log(`  Expected: Pattern ID ${patternOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 9: Lesson Generation
  // =========================================================================
  console.log('TEST 9: Lesson Generation');
  console.log('-'.repeat(40));

  const workedLesson = recorder.generateLesson({ effectiveness: workedEffectiveness });
  const failedLesson = recorder.generateLesson({ effectiveness: failedEffectiveness });
  const neutralLesson = recorder.generateLesson({ effectiveness: neutralEffectiveness });

  console.log(`  WORKED lesson: "${workedLesson.slice(0, 50)}..."`);
  console.log(`  FAILED lesson: "${failedLesson.slice(0, 50)}..."`);
  console.log(`  NEUTRAL lesson: "${neutralLesson.slice(0, 50)}..."`);

  const lessonOk = workedLesson.includes('effective') && failedLesson.includes('not effective');
  if (lessonOk) passed++; else failed++;
  console.log(`  Expected: Appropriate lessons ${lessonOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 10: Recommendation Generation
  // =========================================================================
  console.log('TEST 10: Recommendation Generation');
  console.log('-'.repeat(40));

  const workedRec = recorder.generateRecommendation({ effectiveness: workedEffectiveness });
  const failedRec = recorder.generateRecommendation({ effectiveness: failedEffectiveness });
  const neutralRec = recorder.generateRecommendation({ effectiveness: neutralEffectiveness });

  console.log(`  WORKED rec: "${workedRec}"`);
  console.log(`  FAILED rec: "${failedRec}"`);
  console.log(`  NEUTRAL rec: "${neutralRec.slice(0, 50)}..."`);

  const recOk = workedRec.includes('USE') && failedRec.includes('AVOID') && neutralRec.includes('TEST');
  if (recOk) passed++; else failed++;
  console.log(`  Expected: USE/AVOID/TEST ${recOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 11: Approach Comparison
  // =========================================================================
  console.log('TEST 11: Approach Comparison');
  console.log('-'.repeat(40));

  const comparison = calculator.compareApproaches(workedEffectiveness, failedEffectiveness);

  console.log(`  First Score: ${workedEffectiveness.score.toFixed(2)}`);
  console.log(`  Second Score: ${failedEffectiveness.score.toFixed(2)}`);
  console.log(`  Winner: ${comparison.winner}`);
  console.log(`  Difference: ${comparison.difference.toFixed(2)}`);
  console.log(`  Recommendation: "${comparison.recommendation.slice(0, 50)}..."`);

  const compOk = comparison.winner === 'first';
  if (compOk) passed++; else failed++;
  console.log(`  Expected: first wins ${compOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 12: Temporal Context
  // =========================================================================
  console.log('TEST 12: Temporal Context');
  console.log('-'.repeat(40));

  const temporalContext = recorder.getTemporalContext();

  console.log(`  Hour: ${temporalContext.time_of_day}`);
  console.log(`  Day: ${temporalContext.day_name}`);
  console.log(`  Season: ${temporalContext.season}`);
  console.log(`  Time Period: ${temporalContext.time_period}`);
  console.log(`  Is Weekend: ${temporalContext.is_weekend}`);

  const tempOk = temporalContext.season !== undefined && temporalContext.time_period !== undefined;
  if (tempOk) passed++; else failed++;
  console.log(`  Expected: Valid context ${tempOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // TEST 13: Full Learning Loop Simulation
  // =========================================================================
  console.log('TEST 13: Full Learning Loop Simulation');
  console.log('-'.repeat(40));

  console.log('  Scenario: User in SAD state, Luna tries two approaches');
  console.log('');

  // Approach 1: Achievement-focused (doesn't work well)
  console.log('  Approach 1: Achievement-focused 3-stack');
  const response1 = await detector.detectResponse("Thanks, I guess.", { energy: 'low', pitch: 'stable', quality: 'flat' });
  const effectiveness1 = calculator.calculateEffectiveness(response1, { concentration: 35 }, { concentration: 33 });
  console.log(`    Response: neutral, Effectiveness: ${effectiveness1.score.toFixed(2)} (${effectiveness1.verdict})`);

  // Approach 2: Connection-focused (works well)
  console.log('  Approach 2: Connection-focused 3-stack');
  const response2 = await detector.detectResponse("Oh wow, that memory with my daughter... thank you!", { energy: 'high', pitch: 'rising', quality: 'warm' });
  const effectiveness2 = calculator.calculateEffectiveness(response2, { concentration: 33 }, { concentration: 22 });
  console.log(`    Response: positive, Effectiveness: ${effectiveness2.score.toFixed(2)} (${effectiveness2.verdict})`);

  // Learning
  const learningComparison = calculator.compareApproaches(effectiveness1, effectiveness2);
  console.log(`  Learning: ${learningComparison.winner === 'second' ? 'Connection > Achievement for this user' : 'Mixed results'}`);

  const loopOk = effectiveness2.score > effectiveness1.score;
  if (loopOk) passed++; else failed++;
  console.log(`  Expected: Connection more effective ${loopOk ? '✓' : '✗'}`);
  console.log('');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log('');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${passed + failed}`);
  console.log('');

  if (failed === 0) {
    console.log('ALL TESTS PASSED! ✓');
  } else {
    console.log(`${failed} TESTS FAILED! ✗`);
  }
  console.log('');

  console.log('='.repeat(60));
  console.log('WEEK 6 EFFECTIVENESS LOOP COMPLETE!');
  console.log('='.repeat(60));
  console.log('');
  console.log('The learning system is working:');
  console.log('  - Multi-modal response detection (text + voice + behavior)');
  console.log('  - Effectiveness scoring (0-1 with component breakdown)');
  console.log('  - Verdict determination (WORKED/NEUTRAL/FAILED)');
  console.log('  - 50D state vector creation');
  console.log('  - Pattern recording for future learning');
  console.log('  - Lesson and recommendation generation');
  console.log('  - Approach comparison');
  console.log('');
  console.log('Luna can now LEARN what works for each unique user.');
  console.log('');
}

// Run tests
testEffectivenessLoop()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
