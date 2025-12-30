/**
 * ============================================================================
 * GENESIS ARCHETYPE DETECTION SYSTEM - TESTS
 * ============================================================================
 *
 * Tests for Signal Extraction, Archetype Detection, and Congruence Analysis.
 * Run with: node --experimental-vm-modules archetype.test.js
 *
 * Part of: GENESIS Archetype Detection System
 * Created: December 29, 2024
 * ============================================================================
 */

import { SignalExtractor } from './signalExtractor.js';
import { ArchetypeDetector } from './archetypeDetector.js';
import { CongruenceService } from './congruenceService.js';
import { LEXICONS, ARCHETYPE_NAMES } from './lexicons.js';

// Test utilities
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertGreater(actual, threshold, message) {
  if (actual <= threshold) {
    throw new Error(message || `Expected ${actual} > ${threshold}`);
  }
}

// ============================================================================
// LEXICONS TESTS
// ============================================================================

console.log('\n=== LEXICONS TESTS ===\n');

test('Lexicons should contain all expected categories', () => {
  const expectedCategories = [
    'intensity_high', 'intensity_low',
    'joy', 'anger', 'fear', 'sadness',
    'pain', 'growth', 'connection', 'boundary',
    'past_focus', 'future_focus',
    'uncertainty', 'analytical', 'intuitive', 'binary', 'nuanced',
    'meta_cognitive', 'pattern_seeking', 'integration',
    'trust', 'vulnerability', 'defensiveness',
    'approach', 'avoidance', 'urgency', 'purpose',
    'high_agency', 'low_agency',
    'self_critical', 'self_compassion'
  ];

  for (const category of expectedCategories) {
    assert(LEXICONS[category], `Missing category: ${category}`);
    assert(Array.isArray(LEXICONS[category]), `${category} should be an array`);
    assertGreater(LEXICONS[category].length, 0, `${category} should have words`);
  }
});

test('ARCHETYPE_NAMES should contain all 9 archetypes', () => {
  const expectedArchetypes = [
    'seed', 'mirror', 'mender', 'librarian', 'conductor',
    'companion', 'guardian', 'flamebearer', 'guide'
  ];

  for (const archetype of expectedArchetypes) {
    assert(ARCHETYPE_NAMES[archetype], `Missing archetype: ${archetype}`);
  }
  assertEquals(Object.keys(ARCHETYPE_NAMES).length, 9);
});

// ============================================================================
// SIGNAL EXTRACTOR TESTS
// ============================================================================

console.log('\n=== SIGNAL EXTRACTOR TESTS ===\n');

const signalExtractor = new SignalExtractor();

test('SignalExtractor should extract basic metrics', () => {
  const signals = signalExtractor.extractSignals('Hello world. How are you?');

  assertGreater(signals.messageLength, 0, 'messageLength should be > 0');
  assertEquals(signals.wordCount, 5, 'wordCount should be 5');
  assertEquals(signals.sentenceCount, 2, 'sentenceCount should be 2');
  assertEquals(signals.questionCount, 1, 'questionCount should be 1');
});

test('SignalExtractor should detect joy emotion', () => {
  const signals = signalExtractor.extractSignals('I am so happy and excited about this wonderful news!');

  assertGreater(signals.joy, 0, 'Should detect joy');
  assertEquals(signals.dominantEmotion, 'joy', 'Dominant emotion should be joy');
});

test('SignalExtractor should detect sadness and pain', () => {
  const signals = signalExtractor.extractSignals('I feel so sad and heartbroken. This pain is overwhelming.');

  assertGreater(signals.sadness, 0, 'Should detect sadness');
  assertGreater(signals.pain, 0, 'Should detect pain');
  assertEquals(signals.dominantEmotion, 'sadness', 'Dominant emotion should be sadness');
});

test('SignalExtractor should detect anger', () => {
  const signals = signalExtractor.extractSignals('I am so angry and frustrated! I hate this situation.');

  assertGreater(signals.anger, 0, 'Should detect anger');
  assertEquals(signals.dominantEmotion, 'anger', 'Dominant emotion should be anger');
});

test('SignalExtractor should detect fear and anxiety', () => {
  const signals = signalExtractor.extractSignals('I am scared and anxious about the future. This makes me nervous.');

  assertGreater(signals.fear, 0, 'Should detect fear');
});

test('SignalExtractor should detect high intensity', () => {
  const signals = signalExtractor.extractSignals('I absolutely love this! It is extremely wonderful!');

  assertGreater(signals.intensityHigh, 0, 'Should detect high intensity');
  assertGreater(signals.intensity, 0, 'Intensity score should be positive');
});

test('SignalExtractor should detect uncertainty', () => {
  const signals = signalExtractor.extractSignals("I don't know what to do. Maybe I should try something different. I'm not sure.");

  assertGreater(signals.uncertainty, 0, 'Should detect uncertainty');
});

test('SignalExtractor should detect past focus', () => {
  const signals = signalExtractor.extractSignals('I remember when I was young. Back then, I used to play outside.');

  assertGreater(signals.pastFocus, 0, 'Should detect past focus');
});

test('SignalExtractor should detect future focus', () => {
  const signals = signalExtractor.extractSignals('I will achieve my goal. Tomorrow I am going to start my journey.');

  assertGreater(signals.futureFocus, 0, 'Should detect future focus');
});

test('SignalExtractor should detect agency levels', () => {
  const highAgency = signalExtractor.extractSignals('I will do this. I choose to change. I can make this happen.');
  assertGreater(highAgency.highAgency, 0, 'Should detect high agency');

  const lowAgency = signalExtractor.extractSignals("I can't do anything. I have no choice. I'm stuck and helpless.");
  assertGreater(lowAgency.lowAgency, 0, 'Should detect low agency');
});

test('SignalExtractor should count pronouns correctly', () => {
  const signals = signalExtractor.extractSignals('I think we should help you understand them.');

  assertGreater(signals.firstPersonSingular, 0, 'Should count I');
  assertGreater(signals.firstPersonPlural, 0, 'Should count we');
  assertGreater(signals.secondPerson, 0, 'Should count you');
  assertGreater(signals.thirdPerson, 0, 'Should count them');
});

test('SignalExtractor should handle empty input', () => {
  const signals = signalExtractor.extractSignals('');

  assertEquals(signals.messageLength, 0);
  assertEquals(signals.wordCount, 0);
  assertEquals(signals.dominantEmotion, 'neutral');
});

// ============================================================================
// ARCHETYPE DETECTOR TESTS
// ============================================================================

console.log('\n=== ARCHETYPE DETECTOR TESTS ===\n');

const archetypeDetector = new ArchetypeDetector();

test('ArchetypeDetector should detect Seed for uncertainty/exploration', () => {
  const result = archetypeDetector.detect("I don't know what to do. What direction should I take? I'm confused about my path.");

  assertEquals(result.archetype, 'seed', 'Should detect Seed archetype');
  assert(result.confidence > 0, 'Should have confidence score');
  assert(result.style, 'Should have style guidance');
});

test('ArchetypeDetector should detect Mender for pain/sadness', () => {
  const result = archetypeDetector.detect('I feel broken and hurt. My heart is in pain from this loss.');

  assertEquals(result.archetype, 'mender', 'Should detect Mender archetype');
});

test('ArchetypeDetector should detect Guardian for boundary setting', () => {
  const result = archetypeDetector.detect("No, I won't accept this. I need to protect my space. This is my limit.");

  assertEquals(result.archetype, 'guardian', 'Should detect Guardian archetype');
});

test('ArchetypeDetector should detect Companion for connection seeking', () => {
  const result = archetypeDetector.detect('I just want to share this with someone. We can get through this together. I need connection.');

  assertEquals(result.archetype, 'companion', 'Should detect Companion archetype');
});

test('ArchetypeDetector should detect Flamebearer for purpose/drive', () => {
  const result = archetypeDetector.detect('I know my calling. This is my purpose and mission. I must pursue this goal!');

  assertEquals(result.archetype, 'flamebearer', 'Should detect Flamebearer archetype');
});

test('ArchetypeDetector should detect Mirror for meta-cognition', () => {
  const result = archetypeDetector.detect("I notice that I keep doing the same pattern. I realize now that this is a recurring theme. Why do I always react this way?");

  assertEquals(result.archetype, 'mirror', 'Should detect Mirror archetype');
});

test('ArchetypeDetector should detect Librarian for past focus', () => {
  const result = archetypeDetector.detect('I remember when this happened before. Back then, I used to handle things differently. My history shows a pattern.');

  assertEquals(result.archetype, 'librarian', 'Should detect Librarian archetype');
});

test('ArchetypeDetector should detect Guide for integration', () => {
  const result = archetypeDetector.detect('I see how both perspectives fit together as a whole. This integrates my understanding into a complete synthesis.');

  assertEquals(result.archetype, 'guide', 'Should detect Guide archetype');
});

test('ArchetypeDetector should provide all required fields', () => {
  const result = archetypeDetector.detect('Test message');

  assert(result.archetype, 'Should have archetype');
  assert(typeof result.score === 'number', 'Should have score');
  assert(typeof result.confidence === 'number', 'Should have confidence');
  assert(result.style, 'Should have style');
  assert(result.visual, 'Should have visual config');
  assert(result.visual.color, 'Should have color');
  assert(result.visual.icon, 'Should have icon');
  assert(result.reasoning, 'Should have reasoning');
  assert(result.allScores, 'Should have all scores');
});

test('ArchetypeDetector should include secondary archetype', () => {
  const result = archetypeDetector.detect('I feel sad but I also want to understand why. Help me see the pattern.', {
    includeSecondary: true
  });

  assert(result.secondary, 'Should include secondary archetype');
  assert(result.secondary.archetype !== result.archetype, 'Secondary should differ from primary');
});

// ============================================================================
// CONGRUENCE SERVICE TESTS
// ============================================================================

console.log('\n=== CONGRUENCE SERVICE TESTS ===\n');

const congruenceService = new CongruenceService();

test('CongruenceService should detect congruent emotions', () => {
  const voiceEmotions = { sad: 0.8, neutral: 0.2 };
  const text = 'I feel so sad and heartbroken about this loss.';

  const result = congruenceService.analyzeCongruence(voiceEmotions, text);

  assert(result.isCongruent, 'Should be congruent');
  assertGreater(result.score, 0.5, 'Score should be > 0.5');
});

test('CongruenceService should detect incongruent emotions', () => {
  const voiceEmotions = { sad: 0.8, neutral: 0.2 };
  const text = "I'm fine! Everything is great and wonderful!";

  const result = congruenceService.analyzeCongruence(voiceEmotions, text);

  assert(!result.isCongruent, 'Should be incongruent');
  assert(result.insights.length > 0, 'Should have insights');
});

test('CongruenceService should provide insights for voice-only emotions', () => {
  const voiceEmotions = { anger: 0.7, neutral: 0.3 };
  const text = 'I think this is an interesting situation to consider.';

  const result = congruenceService.analyzeCongruence(voiceEmotions, text);

  const voiceUnexpressed = result.insights.find(i => i.type === 'voice_unexpressed');
  assert(voiceUnexpressed, 'Should have voice_unexpressed insight');
});

test('CongruenceService should provide recommendation', () => {
  const voiceEmotions = { fear: 0.6, neutral: 0.4 };
  const text = "I guess things are okay. It's fine.";

  const result = congruenceService.analyzeCongruence(voiceEmotions, text);

  assert(result.recommendation, 'Should have recommendation');
  assert(result.recommendation.approach, 'Should have approach');
});

test('CongruenceService should handle missing voice data', () => {
  const result = congruenceService.analyzeCongruence(null, 'Test message');

  assertEquals(result.score, 1, 'Should be fully congruent with no voice data');
  assert(result.isCongruent);
});

test('CongruenceService quickCheck should return simplified result', () => {
  const voiceEmotions = { happy: 0.8 };
  const text = 'I am so happy and excited!';

  const result = congruenceService.quickCheck(voiceEmotions, text);

  assert('isCongruent' in result, 'Should have isCongruent');
  assert('score' in result, 'Should have score');
  assert('level' in result, 'Should have level');
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
