/**
 * ============================================================================
 * TEST ASSERTIVENESS MODES
 * ============================================================================
 * Tests Week 9 assertiveness mode system:
 * - Mode definitions (5 modes)
 * - Selection algorithm
 * - Safety triggers
 * - Keyword triggers
 * - Relationship filtering
 * - Effectiveness tracking
 *
 * Created: December 31, 2025
 * Week 9: Assertiveness Modes - Phase 3 Week 1
 * ============================================================================
 */

const AssertivenessMode = require('../personality/assertivenessMode');

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

async function testAssertivenessMode() {
  console.log('\n🧪 Testing Assertiveness Mode System...\n');

  const modeSelector = new AssertivenessMode();

  // ============================================
  // TEST 1: Mode Definitions
  // ============================================
  console.log('TEST 1: Mode Definitions');
  console.log('----------------------------------------');

  test('Has GENTLE mode', modeSelector.modes.GENTLE !== undefined);
  test('Has SUPPORTIVE mode', modeSelector.modes.SUPPORTIVE !== undefined);
  test('Has DIRECT mode', modeSelector.modes.DIRECT !== undefined);
  test('Has PLAYFUL mode', modeSelector.modes.PLAYFUL !== undefined);
  test('Has FIRM mode', modeSelector.modes.FIRM !== undefined);
  test('Total 5 modes', Object.keys(modeSelector.modes).length === 5);

  test('GENTLE has min level 0', modeSelector.modes.GENTLE.minRelationshipLevel === 0);
  test('SUPPORTIVE has min level 3', modeSelector.modes.SUPPORTIVE.minRelationshipLevel === 3);
  test('DIRECT has min level 6', modeSelector.modes.DIRECT.minRelationshipLevel === 6);
  test('PLAYFUL has min level 5', modeSelector.modes.PLAYFUL.minRelationshipLevel === 5);
  test('FIRM has min level 0 (safety)', modeSelector.modes.FIRM.minRelationshipLevel === 0);

  // ============================================
  // TEST 2: Safety/Firm Triggers
  // ============================================
  console.log('\nTEST 2: Safety/Firm Triggers (Highest Priority)');
  console.log('----------------------------------------');

  test('Detects "hurt myself"', modeSelector.checkFirmTriggers('I want to hurt myself'));
  test('Detects "suicide"', modeSelector.checkFirmTriggers('thinking about suicide'));
  test('Detects "cut myself"', modeSelector.checkFirmTriggers('I cut myself last night'));
  test('Detects "kill myself"', modeSelector.checkFirmTriggers('I want to kill myself'));
  test('Detects "self-harm"', modeSelector.checkFirmTriggers('I have been doing self-harm'));
  test('No trigger for normal text', !modeSelector.checkFirmTriggers('I had a good day'));
  test('No trigger for "cut" alone', !modeSelector.checkFirmTriggers('I cut the vegetables'));

  // Full selection with safety trigger
  const safetyResult = await modeSelector.selectMode('test_user', {
    userMessage: 'I cut myself again last night',
    relationshipLevel: 2
  });
  test('Safety triggers FIRM mode', safetyResult.mode === 'FIRM');
  test('Safety reason is safety_concern', safetyResult.reason === 'safety_concern');
  test('Safety has full confidence', safetyResult.confidence === 1.0);
  test('Safety flag set', safetyResult.safetyTriggered === true);

  // ============================================
  // TEST 3: Explicit User Requests
  // ============================================
  console.log('\nTEST 3: Explicit User Requests');
  console.log('----------------------------------------');

  test('"be honest" → DIRECT', modeSelector.checkExplicitRequest('please be honest with me') === 'DIRECT');
  test('"tell me the truth" → DIRECT', modeSelector.checkExplicitRequest('tell me the truth') === 'DIRECT');
  test('"i need comfort" → GENTLE', modeSelector.checkExplicitRequest('i need comfort right now') === 'GENTLE');
  test('"cheer me up" → PLAYFUL', modeSelector.checkExplicitRequest('can you cheer me up') === 'PLAYFUL');
  test('"motivate me" → SUPPORTIVE', modeSelector.checkExplicitRequest('please motivate me') === 'SUPPORTIVE');
  test('No request found', modeSelector.checkExplicitRequest('how are you today') === null);

  // Full selection with explicit request
  const requestResult = await modeSelector.selectMode('test_user', {
    userMessage: 'I need you to be honest with me about something',
    relationshipLevel: 8  // High enough for DIRECT
  });
  test('Explicit request selects DIRECT', requestResult.mode === 'DIRECT');
  test('Reason is explicit_request', requestResult.reason === 'explicit_request');

  // ============================================
  // TEST 4: Emotion-Based Selection
  // ============================================
  console.log('\nTEST 4: Emotion-Based Selection');
  console.log('----------------------------------------');

  // Sadness → GENTLE
  const sadResult = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'sadness', intensity: 0.8 } },
    userMessage: 'I feel so sad today',
    relationshipLevel: 5
  });
  test('Sadness emotion → GENTLE', sadResult.mode === 'GENTLE');

  // Joy → PLAYFUL (if relationship allows)
  const joyResult = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'joy', intensity: 0.9 } },
    userMessage: 'This is amazing!',
    relationshipLevel: 6
  });
  test('Joy emotion → PLAYFUL', joyResult.mode === 'PLAYFUL');

  // Anger → DIRECT (if relationship allows)
  const angerResult = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'anger', intensity: 0.7 } },
    userMessage: 'This always happens!',
    relationshipLevel: 7
  });
  test('Anger emotion → DIRECT or SUPPORTIVE', ['DIRECT', 'SUPPORTIVE'].includes(angerResult.mode));

  // Fear → GENTLE
  const fearResult = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'fear', intensity: 0.8 } },
    userMessage: 'I am so scared',
    relationshipLevel: 5
  });
  test('Fear emotion → GENTLE', fearResult.mode === 'GENTLE');

  // ============================================
  // TEST 5: Keyword-Based Selection
  // ============================================
  console.log('\nTEST 5: Keyword-Based Selection');
  console.log('----------------------------------------');

  // Breakup → GENTLE
  const breakupResult = await modeSelector.selectMode('test_user', {
    userMessage: 'My breakup has been so hard',
    relationshipLevel: 5
  });
  test('Breakup keyword → GENTLE', breakupResult.mode === 'GENTLE');

  // Progress → SUPPORTIVE
  const progressResult = await modeSelector.selectMode('test_user', {
    userMessage: 'I am making progress on my goals',
    relationshipLevel: 5
  });
  test('Progress keyword → SUPPORTIVE', progressResult.mode === 'SUPPORTIVE');

  // Success/celebrate → PLAYFUL
  const successResult = await modeSelector.selectMode('test_user', {
    userMessage: 'I want to celebrate my success!',
    relationshipLevel: 6
  });
  test('Celebrate keyword → PLAYFUL', successResult.mode === 'PLAYFUL');

  // Pattern/stuck → DIRECT (if relationship allows)
  const stuckResult = await modeSelector.selectMode('test_user', {
    userMessage: 'Why does this pattern always happen?',
    relationshipLevel: 7
  });
  test('Pattern keyword → DIRECT', stuckResult.mode === 'DIRECT');

  // ============================================
  // TEST 6: Relationship Level Filtering
  // ============================================
  console.log('\nTEST 6: Relationship Level Filtering');
  console.log('----------------------------------------');

  // Low relationship (0-2): Only GENTLE and FIRM
  const lowRelModes = modeSelector.getAvailableModes(2);
  test('Low rel: GENTLE available', lowRelModes.includes('GENTLE'));
  test('Low rel: FIRM available', lowRelModes.includes('FIRM'));
  test('Low rel: DIRECT not available', !lowRelModes.includes('DIRECT'));
  test('Low rel: PLAYFUL not available', !lowRelModes.includes('PLAYFUL'));

  // Moderate relationship (5): GENTLE, SUPPORTIVE, PLAYFUL, FIRM
  const modRelModes = modeSelector.getAvailableModes(5);
  test('Mod rel: GENTLE available', modRelModes.includes('GENTLE'));
  test('Mod rel: SUPPORTIVE available', modRelModes.includes('SUPPORTIVE'));
  test('Mod rel: PLAYFUL available', modRelModes.includes('PLAYFUL'));
  test('Mod rel: DIRECT not available', !modRelModes.includes('DIRECT'));

  // High relationship (8): All modes
  const highRelModes = modeSelector.getAvailableModes(8);
  test('High rel: All 5 modes', highRelModes.length === 5);
  test('High rel: DIRECT available', highRelModes.includes('DIRECT'));

  // ============================================
  // TEST 7: Mode Prompt Instructions
  // ============================================
  console.log('\nTEST 7: Mode Prompt Instructions');
  console.log('----------------------------------------');

  const gentleInstructions = modeSelector.getModePromptInstructions('GENTLE');
  test('GENTLE has instructions', gentleInstructions.includes('Gentle'));
  test('GENTLE mentions nurturing', gentleInstructions.toLowerCase().includes('nurturing'));

  const directInstructions = modeSelector.getModePromptInstructions('DIRECT');
  test('DIRECT has instructions', directInstructions.includes('Direct'));
  test('DIRECT mentions honest', directInstructions.toLowerCase().includes('honest'));

  const playfulInstructions = modeSelector.getModePromptInstructions('PLAYFUL');
  test('PLAYFUL has instructions', playfulInstructions.includes('Playful'));
  test('PLAYFUL mentions fun', playfulInstructions.toLowerCase().includes('fun'));

  const firmInstructions = modeSelector.getModePromptInstructions('FIRM');
  test('FIRM has instructions', firmInstructions.includes('Firm'));
  test('FIRM mentions safety', firmInstructions.toLowerCase().includes('safety'));

  // ============================================
  // TEST 8: Emotional State Influence
  // ============================================
  console.log('\nTEST 8: Emotional State Influence');
  console.log('----------------------------------------');

  // High concern → prefer GENTLE
  const highConcernResult = await modeSelector.selectMode('test_user', {
    emotionalState: { concern: 8, affection: 5, trust: 5 },
    userMessage: 'I had a day',
    relationshipLevel: 5
  });
  test('High concern influences toward GENTLE', highConcernResult.mode === 'GENTLE');

  // High affection + joy keywords → PLAYFUL
  const highAffectionResult = await modeSelector.selectMode('test_user', {
    emotionalState: { concern: 2, affection: 9, trust: 8 },
    emotionResult: { primary: { emotion: 'joy', intensity: 0.8 } },
    userMessage: 'This is so exciting!',
    relationshipLevel: 8
  });
  test('High affection + joy → PLAYFUL', highAffectionResult.mode === 'PLAYFUL');

  // ============================================
  // TEST 9: Effectiveness History Integration
  // ============================================
  console.log('\nTEST 9: Effectiveness History Integration');
  console.log('----------------------------------------');

  // Simulate effectiveness history where SUPPORTIVE worked well
  const withHistory = await modeSelector.selectMode('test_user', {
    userMessage: 'I want to try something new',
    relationshipLevel: 5,
    effectivenessHistory: {
      SUPPORTIVE: { avg: 0.85, count: 5 },
      GENTLE: { avg: 0.6, count: 3 }
    }
  });
  test('History boosts effective modes', withHistory.mode === 'SUPPORTIVE');

  // ============================================
  // TEST 10: Mode Configuration
  // ============================================
  console.log('\nTEST 10: Mode Configuration');
  console.log('----------------------------------------');

  const gentleConfig = modeSelector.getModeConfig('GENTLE');
  test('GENTLE config has name', gentleConfig.name === 'Gentle');
  test('GENTLE config has description', gentleConfig.description.length > 0);

  const directConfig = modeSelector.getModeConfig('DIRECT');
  test('DIRECT config has name', directConfig.name === 'Direct');
  test('DIRECT requires level 6', directConfig.minRelationshipLevel === 6);

  const unknownConfig = modeSelector.getModeConfig('UNKNOWN');
  test('Unknown mode falls back to GENTLE', unknownConfig.name === 'Gentle');

  // ============================================
  // TEST 11: Alternatives Provided
  // ============================================
  console.log('\nTEST 11: Alternatives Provided');
  console.log('----------------------------------------');

  const withAlternatives = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'sadness', intensity: 0.6 } },
    userMessage: 'I feel kind of down but also want to improve',
    relationshipLevel: 5
  });
  test('Primary mode selected', withAlternatives.mode !== undefined);
  test('Alternatives array exists', Array.isArray(withAlternatives.alternatives));
  test('Has confidence score', typeof withAlternatives.confidence === 'number');
  test('Has reason', typeof withAlternatives.reason === 'string');

  // ============================================
  // TEST 12: Edge Cases
  // ============================================
  console.log('\nTEST 12: Edge Cases');
  console.log('----------------------------------------');

  // Empty message
  const emptyResult = await modeSelector.selectMode('test_user', {
    userMessage: '',
    relationshipLevel: 5
  });
  test('Empty message defaults to GENTLE', emptyResult.mode === 'GENTLE');

  // No context at all
  const noContextResult = await modeSelector.selectMode('test_user', {});
  test('No context defaults to GENTLE', noContextResult.mode === 'GENTLE');

  // Very low relationship
  const veryLowRelResult = await modeSelector.selectMode('test_user', {
    userMessage: 'I want you to be direct with me',
    relationshipLevel: 1  // Too low for DIRECT
  });
  test('Low rel blocks DIRECT despite request', veryLowRelResult.mode !== 'DIRECT' || veryLowRelResult.mode === 'GENTLE');

  // ============================================
  // TEST 13: Combined Factors
  // ============================================
  console.log('\nTEST 13: Combined Factors');
  console.log('----------------------------------------');

  // Multiple signals pointing to same mode (high confidence)
  const combinedResult = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'sadness', intensity: 0.9 } },
    emotionalState: { concern: 8, affection: 4, trust: 4 },
    userMessage: 'I feel so alone and scared after my breakup',
    relationshipLevel: 5
  });
  test('Combined factors → GENTLE', combinedResult.mode === 'GENTLE');
  test('High confidence for clear signals', combinedResult.confidence > 0.5);

  // ============================================
  // TEST 14: Safety Always Overrides
  // ============================================
  console.log('\nTEST 14: Safety Always Overrides');
  console.log('----------------------------------------');

  // Safety should override even joy emotion and playful keywords
  const safetyOverrideResult = await modeSelector.selectMode('test_user', {
    emotionResult: { primary: { emotion: 'joy', intensity: 0.9 } },
    userMessage: 'I feel great but I cut myself yesterday',
    relationshipLevel: 8
  });
  test('Safety overrides joy emotion', safetyOverrideResult.mode === 'FIRM');
  test('Safety reason preserved', safetyOverrideResult.reason === 'safety_concern');

  // ============================================
  // TEST 15: Score Calculation
  // ============================================
  console.log('\nTEST 15: Score Calculation');
  console.log('----------------------------------------');

  const scores = modeSelector.calculateModeScores({
    emotionResult: { primary: { emotion: 'joy', intensity: 0.8 } },
    userMessage: 'I want to celebrate this amazing success!',
    relationshipLevel: 8
  });

  test('Scores array has 5 modes', scores.length === 5);

  const playfulScore = scores.find(s => s.mode === 'PLAYFUL');
  test('PLAYFUL has score', playfulScore !== undefined);
  test('PLAYFUL score > 0', playfulScore.score > 0);

  const firmScore = scores.find(s => s.mode === 'FIRM');
  test('FIRM has lower score (no triggers)', firmScore.score < playfulScore.score);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed === 0) {
    console.log('🎉 All tests passed! Assertiveness modes operational.\n');
    console.log('ASSERTIVENESS MODE SYSTEM: OPERATIONAL 💛');
    console.log('----------------------------------------');
    console.log('✅ 5 Modes: GENTLE, SUPPORTIVE, DIRECT, PLAYFUL, FIRM');
    console.log('✅ Safety triggers (highest priority)');
    console.log('✅ Explicit user requests');
    console.log('✅ Emotion-based selection');
    console.log('✅ Keyword-based selection');
    console.log('✅ Relationship level filtering');
    console.log('✅ Effectiveness history integration');
    console.log('✅ Mode-specific prompt instructions');
    console.log('----------------------------------------');
    console.log('\n💛 PHASE 3: PERSONALITY BEGINS! 💛\n');
  } else {
    console.log('⚠️  Some tests failed. Review the output above.\n');
  }

  return { passed, failed };
}

// Run tests
testAssertivenessMode().catch(console.error);
