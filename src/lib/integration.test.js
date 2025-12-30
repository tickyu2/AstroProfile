/**
 * ============================================================================
 * GENESIS ARCHETYPE INTEGRATION - TESTS
 * ============================================================================
 *
 * Tests for the integration components.
 * Run with: node --experimental-vm-modules integration.test.js
 *
 * Part of: GENESIS Archetype Integration
 * Created: December 29, 2024
 * ============================================================================
 */

import { RealtimeArchetypeDetector } from './realtimeArchetypeDetector.js';
import { EmotionCongruenceService } from './emotionCongruenceService.js';

// Test utilities
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// ============================================================================
// REALTIME ARCHETYPE DETECTOR TESTS
// ============================================================================

console.log('\n=== REALTIME ARCHETYPE DETECTOR ===\n');

const detector = new RealtimeArchetypeDetector();

test('analyzePartial returns null for short text', () => {
  const result = detector.analyzePartial('Hi');
  assertEquals(result, null);
});

test('analyzePartial detects archetype from partial text', () => {
  const result = detector.analyzePartial("I'm feeling really sad and broken today");
  assert(result !== null, 'Should return result');
  assert(result.partial === true, 'Should be marked as partial');
  assert(result.primary.name, 'Should have primary archetype');
});

test('analyzeComplete detects mender for pain text', () => {
  detector.reset();
  const result = detector.analyzeComplete("I feel so broken and hurt inside. Everything hurts.");
  assert(result !== null, 'Should return result');
  assertEquals(result.partial, false, 'Should not be partial');
  assertEquals(result.primary.name, 'mender', 'Should detect mender');
});

test('analyzeComplete tracks conversation context', () => {
  detector.reset();
  detector.analyzeComplete("I feel so sad");
  detector.analyzeComplete("Everything is painful");
  detector.analyzeComplete("I'm heartbroken");

  const context = detector.getConversationContext();
  assert(context !== null, 'Should have context');
  assertEquals(context.messageCount, 3, 'Should have 3 messages');
  assertEquals(context.dominantArchetype, 'mender', 'Dominant should be mender');
});

test('calculateStability returns high for same archetype', () => {
  detector.reset();
  detector.analyzeComplete("I feel sad");
  const result = detector.analyzePartial("I'm still feeling sad");
  assert(result.stability >= 0.9, 'Stability should be high');
});

test('reset clears all state', () => {
  detector.reset();
  const context = detector.getConversationContext();
  assertEquals(context, null, 'Context should be null after reset');
});

// ============================================================================
// EMOTION CONGRUENCE SERVICE TESTS
// ============================================================================

console.log('\n=== EMOTION CONGRUENCE SERVICE ===\n');

const congruenceService = new EmotionCongruenceService();

test('analyzeCongruence detects MATCHING pattern', () => {
  const textDetection = {
    primary: { name: 'mender', score: 0.8 },
    secondary: [],
    signals: { valence: -0.5, intensity: 0.6, uncertainty: 0.2 }
  };

  const result = congruenceService.analyzeCongruence(
    'sad',
    textDetection,
    "I feel so broken and sad"
  );

  assert(result.congruence === 'CONGRUENT', 'Should be congruent');
  assertEquals(result.pattern, 'MATCHING', 'Pattern should be MATCHING');
  assertEquals(result.confirmedEmotion, 'sad', 'Confirmed should be sad');
});

test('analyzeCongruence detects MASKING pattern', () => {
  const textDetection = {
    primary: { name: 'mender', score: 0.5 },
    secondary: [],
    signals: { valence: 0.1, intensity: 0.3, uncertainty: 0.2 }
  };

  const result = congruenceService.analyzeCongruence(
    'sad',
    textDetection,
    "I'm fine, don't worry about me"
  );

  assertEquals(result.pattern, 'MASKING', 'Pattern should be MASKING');
  assertEquals(result.confirmedEmotion, 'sad', 'Should trust voice');
});

test('analyzeCongruence detects SARCASM pattern', () => {
  const textDetection = {
    primary: { name: 'guardian', score: 0.7 },
    secondary: [],
    signals: { valence: 0.5, intensity: 0.8, uncertainty: 0.2 }
  };

  const result = congruenceService.analyzeCongruence(
    'angry',
    textDetection,
    "Oh wonderful, just great, amazing news!"
  );

  assertEquals(result.pattern, 'SARCASM', 'Pattern should be SARCASM');
});

test('analyzeCongruence detects AMPLIFICATION pattern', () => {
  const textDetection = {
    primary: { name: 'flamebearer', score: 0.9 },
    secondary: [],
    signals: { valence: 0.8, intensity: 0.9, uncertainty: 0.1 }
  };

  const result = congruenceService.analyzeCongruence(
    'happy',
    textDetection,
    "I'm so excited! This is amazing!"
  );

  assertEquals(result.pattern, 'AMPLIFICATION', 'Pattern should be AMPLIFICATION');
  assert(result.confidence > 0.9, 'Confidence should be high');
});

test('generateLunaGuidance returns guidance object', () => {
  const textDetection = {
    primary: { name: 'mender', score: 0.7 },
    secondary: [],
    signals: { valence: -0.5, intensity: 0.5, uncertainty: 0.2 }
  };

  const result = congruenceService.analyzeCongruence(
    'sad',
    textDetection,
    "I feel broken"
  );

  assert(result.lunaGuidance, 'Should have lunaGuidance');
  assert(result.lunaGuidance.approach, 'Should have approach');
  assert(result.lunaGuidance.tone, 'Should have tone');
  assert(result.lunaGuidance.example, 'Should have example');
});

test('getLLMModifier returns prompt modifier', () => {
  const analysis = {
    pattern: 'MASKING',
    textArchetype: 'mender',
    confirmedEmotion: 'sad',
    lunaGuidance: { message: 'Gently acknowledge' }
  };

  const modifier = congruenceService.getLLMModifier(analysis);
  assert(modifier.includes('masking'), 'Should mention masking');
  assert(modifier.includes('mender'), 'Should include archetype');
});

test('getVoiceModulation returns TTS parameters', () => {
  const analysis = { pattern: 'MASKING', confirmedEmotion: 'sad' };
  const params = congruenceService.getVoiceModulation(analysis);

  assert(typeof params.stability === 'number', 'Should have stability');
  assert(typeof params.similarity_boost === 'number', 'Should have similarity_boost');
  assert(typeof params.style === 'number', 'Should have style');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

console.log('\n=== INTEGRATION TESTS ===\n');

test('Full flow: text detection + voice congruence', () => {
  const rtDetector = new RealtimeArchetypeDetector();
  const congService = new EmotionCongruenceService();

  // Simulate complete flow
  const transcript = "I'm feeling really lost and uncertain about everything";
  const voiceEmotion = 'anxious';

  // Step 1: Detect archetype
  const detection = rtDetector.analyzeComplete(transcript);
  assert(detection, 'Should get detection');

  // Step 2: Analyze congruence
  const congruence = congService.analyzeCongruence(
    voiceEmotion,
    detection,
    transcript
  );

  assert(congruence, 'Should get congruence');
  assert(congruence.lunaGuidance, 'Should have guidance');

  // Step 3: Get LLM modifier
  const modifier = congService.getLLMModifier(congruence);
  assert(modifier, 'Should get modifier');

  // Step 4: Get voice params
  const voiceParams = congService.getVoiceModulation(congruence);
  assert(voiceParams, 'Should get voice params');
});

test('Conversation tracking across multiple messages', () => {
  const rtDetector = new RealtimeArchetypeDetector();
  rtDetector.reset();

  // Simulate conversation
  rtDetector.analyzeComplete("I'm confused about what to do");
  rtDetector.analyzeComplete("What direction should I take?");
  rtDetector.analyzeComplete("I don't know the answer");

  const context = rtDetector.getConversationContext();
  assert(context, 'Should have context');
  assertEquals(context.messageCount, 3, 'Should track all messages');
  assertEquals(context.dominantArchetype, 'seed', 'Should detect seed trend');
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n=== TEST SUMMARY ===\n');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);
console.log(`Result: ${failed === 0 ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);

process.exit(failed === 0 ? 0 : 1);
