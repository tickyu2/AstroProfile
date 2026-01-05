/**
 * Week 21 Emotional Sophistication - Test Suite
 * Tests for Plutchik Engine, Happy Moments, Affection System, Prosody, Memory
 */

const { PlutchikEngine } = require('./plutchikEngine');
const { HappyMomentsEngine } = require('./happyMoments');
const { AffectionSystem } = require('./affectionSystem');
const { VoiceProsodyDetector } = require('./voiceProsodyDetector');
const { ClarifiedMemoryArchitecture } = require('../memory/clarifiedMemoryArchitecture');

// Test utilities
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertInRange(value, min, max, message) {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be between ${min} and ${max}`);
  }
}

// =====================================================
// PLUTCHIK ENGINE TESTS
// =====================================================

console.log('\n=== PLUTCHIK ENGINE TESTS ===\n');

const plutchik = new PlutchikEngine();

test('PlutchikEngine - 8 primary emotions defined', () => {
  assertEqual(plutchik.primaryEmotions.length, 8);
  assert(plutchik.primaryEmotions.includes('joy'));
  assert(plutchik.primaryEmotions.includes('trust'));
  assert(plutchik.primaryEmotions.includes('fear'));
  assert(plutchik.primaryEmotions.includes('sadness'));
});

test('PlutchikEngine - intensity levels for each emotion', () => {
  const joyIntensities = plutchik.intensityLevels.joy;
  assertEqual(joyIntensities.mild, 'serenity');
  assertEqual(joyIntensities.moderate, 'joy');
  assertEqual(joyIntensities.intense, 'ecstasy');
});

test('PlutchikEngine - primary dyads defined', () => {
  assert(plutchik.primaryDyads.love, 'Love dyad should exist');
  assert(plutchik.primaryDyads.optimism, 'Optimism dyad should exist');
  assert(plutchik.primaryDyads.submission, 'Submission dyad should exist');
});

test('PlutchikEngine - love = joy + trust', () => {
  const love = plutchik.primaryDyads.love;
  assert(love.emotions.includes('joy'));
  assert(love.emotions.includes('trust'));
});

test('PlutchikEngine - detectDyads identifies love correctly', () => {
  const vector = { joy: 0.8, trust: 0.7, fear: 0.1, sadness: 0, anger: 0, disgust: 0, surprise: 0, anticipation: 0.2 };
  const dyads = plutchik.detectDyads(vector);
  assert(dyads.primary.some(d => d.dyad === 'love'), 'Should detect love dyad');
});

test('PlutchikEngine - calculateEmotionalComplexity', () => {
  // Single dominant emotion = low complexity
  const simple = { joy: 0.9, trust: 0.1, fear: 0, sadness: 0, anger: 0, disgust: 0, surprise: 0, anticipation: 0 };
  const simpleComplexity = plutchik.calculateEmotionalComplexity(simple);
  assertInRange(simpleComplexity, 0, 0.4, 'Simple emotions should have low complexity');

  // Multiple emotions = higher complexity
  const complex = { joy: 0.5, trust: 0.4, fear: 0.3, sadness: 0.2, anger: 0.1, disgust: 0.1, surprise: 0.3, anticipation: 0.4 };
  const complexComplexity = plutchik.calculateEmotionalComplexity(complex);
  assertInRange(complexComplexity, 0.4, 1, 'Mixed emotions should have higher complexity');
});

test('PlutchikEngine - calculateValence positive for joy', () => {
  const joyful = { joy: 0.8, trust: 0.5, fear: 0, sadness: 0, anger: 0, disgust: 0, surprise: 0.2, anticipation: 0.3 };
  const valence = plutchik.calculateValence(joyful);
  assert(valence > 0, 'Joy-dominant should have positive valence');
});

test('PlutchikEngine - calculateValence negative for sadness', () => {
  const sad = { joy: 0, trust: 0.1, fear: 0.2, sadness: 0.8, anger: 0.2, disgust: 0.1, surprise: 0, anticipation: 0 };
  const valence = plutchik.calculateValence(sad);
  assert(valence < 0, 'Sadness-dominant should have negative valence');
});

test('PlutchikEngine - getIntensityLabel correct ranges', () => {
  assertEqual(plutchik.getIntensityLabel(0.2), 'mild');
  assertEqual(plutchik.getIntensityLabel(0.5), 'moderate');
  assertEqual(plutchik.getIntensityLabel(0.8), 'intense');
});

test('PlutchikEngine - Cathedral light mapping exists', () => {
  const light = plutchik.getEmotionLight({ primary: 'joy', intensity: 0.7 });
  assert(light.color, 'Should have color');
  assert(light.brightness >= 0 && light.brightness <= 1, 'Brightness should be 0-1');
});

// =====================================================
// HAPPY MOMENTS ENGINE TESTS
// =====================================================

console.log('\n=== HAPPY MOMENTS ENGINE TESTS ===\n');

const happyMoments = new HappyMomentsEngine();

test('HappyMomentsEngine - joyThreshold is 0.6', () => {
  assertEqual(happyMoments.joyThreshold, 0.6);
});

test('HappyMomentsEngine - sadnessThreshold is 0.6', () => {
  assertEqual(happyMoments.sadnessThreshold, 0.6);
});

test('HappyMomentsEngine - isHappyMoment detects high joy', () => {
  const state = { joy: 0.8, sadness: 0.1 };
  assert(happyMoments.isHappyMoment(state), 'Joy > 0.6 should be happy moment');
});

test('HappyMomentsEngine - isHappyMoment rejects low joy', () => {
  const state = { joy: 0.4, sadness: 0.1 };
  assert(!happyMoments.isHappyMoment(state), 'Joy < 0.6 should not be happy moment');
});

test('HappyMomentsEngine - shouldTriggerRecall for high sadness', () => {
  const state = { joy: 0.1, sadness: 0.7 };
  assert(happyMoments.shouldTriggerRecall(state), 'Sadness > 0.6 should trigger recall');
});

test('HappyMomentsEngine - happiness categories defined', () => {
  assert(happyMoments.happinessCategories.length > 0, 'Should have categories');
  assert(happyMoments.happinessCategories.includes('achievement'));
  assert(happyMoments.happinessCategories.includes('love'));
});

test('HappyMomentsEngine - extractMomentDetails returns object', () => {
  const details = happyMoments.extractMomentDetails('I got the job I wanted!');
  assert(typeof details === 'object', 'Should return object');
});

test('HappyMomentsEngine - categorizeHappiness detects achievement', () => {
  const categories = happyMoments.categorizeHappiness(
    'I finally passed my exam! I achieved my goal.'
  );
  assert(categories.includes('achievement'), 'Should detect achievement');
});

test('HappyMomentsEngine - categorizeHappiness detects love', () => {
  const categories = happyMoments.categorizeHappiness(
    'My partner said they love me and we had the best date'
  );
  assert(categories.includes('love'), 'Should detect love');
});

test('HappyMomentsEngine - getJoyIntensity correct labels', () => {
  assertEqual(happyMoments.getJoyIntensity(0.65), 'mild');
  assertEqual(happyMoments.getJoyIntensity(0.8), 'strong');
  assertEqual(happyMoments.getJoyIntensity(0.95), 'ecstatic');
});

test('HappyMomentsEngine - recall message styles exist', () => {
  assert(happyMoments.recallMessageStyles.length > 0);
  assert(happyMoments.recallMessageStyles.includes('gentle'));
  assert(happyMoments.recallMessageStyles.includes('warm'));
});

// =====================================================
// AFFECTION SYSTEM TESTS
// =====================================================

console.log('\n=== AFFECTION SYSTEM TESTS ===\n');

const affection = new AffectionSystem();

test('AffectionSystem - score range -10 to +15', () => {
  assertEqual(affection.minAffection, -10);
  assertEqual(affection.maxAffection, 15);
});

test('AffectionSystem - mode thresholds defined', () => {
  assert(affection.modeThresholds.stranger, 'Stranger level exists');
  assert(affection.modeThresholds.acquaintance, 'Acquaintance level exists');
  assert(affection.modeThresholds.friend, 'Friend level exists');
  assert(affection.modeThresholds.closeFriend, 'Close friend level exists');
  assert(affection.modeThresholds.intimate, 'Intimate level exists');
  assert(affection.modeThresholds.soulmate, 'Soulmate level exists');
});

test('AffectionSystem - getAffectionLevel stranger for -5', () => {
  assertEqual(affection.getAffectionLevel(-5), 'stranger');
});

test('AffectionSystem - getAffectionLevel acquaintance for 1', () => {
  assertEqual(affection.getAffectionLevel(1), 'acquaintance');
});

test('AffectionSystem - getAffectionLevel friend for 4', () => {
  assertEqual(affection.getAffectionLevel(4), 'friend');
});

test('AffectionSystem - getAffectionLevel closeFriend for 7', () => {
  assertEqual(affection.getAffectionLevel(7), 'closeFriend');
});

test('AffectionSystem - getAffectionLevel intimate for 10', () => {
  assertEqual(affection.getAffectionLevel(10), 'intimate');
});

test('AffectionSystem - getAffectionLevel soulmate for 14', () => {
  assertEqual(affection.getAffectionLevel(14), 'soulmate');
});

test('AffectionSystem - feature unlocks defined', () => {
  assert(affection.featureUnlocks[0], 'Features at 0');
  assert(affection.featureUnlocks[3], 'Features at 3');
  assert(affection.featureUnlocks[6], 'Features at 6');
});

test('AffectionSystem - getUnlockedFeatures at 0', () => {
  const features = affection.getUnlockedFeatures(0);
  assert(features.includes('basic_chat'));
});

test('AffectionSystem - getUnlockedFeatures at 7 includes friend features', () => {
  const features = affection.getUnlockedFeatures(7);
  assert(features.includes('basic_chat'), 'Has basic features');
  assert(features.includes('emotional_support'), 'Has friend features');
});

test('AffectionSystem - interaction boosts defined', () => {
  assert(affection.interactionBoosts.greeting > 0);
  assert(affection.interactionBoosts.emotional_sharing > affection.interactionBoosts.greeting);
  assert(affection.interactionBoosts.crisis_support > affection.interactionBoosts.casual_chat);
});

test('AffectionSystem - negative impacts defined', () => {
  assert(affection.negativeImpacts.harsh_words < 0);
  assert(affection.negativeImpacts.broken_trust < affection.negativeImpacts.harsh_words);
});

test('AffectionSystem - decay rates vary by level', () => {
  assertEqual(affection.decayRates.stranger, 0, 'No decay at stranger');
  assert(affection.decayRates.closeFriend > affection.decayRates.acquaintance);
});

test('AffectionSystem - Cathedral lights for each level', () => {
  assert(affection.affectionLights.stranger);
  assert(affection.affectionLights.soulmate);
  assertEqual(affection.affectionLights.soulmate.brightness, 1.0);
});

test('AffectionSystem - getResponseModifiers returns correct structure', () => {
  const mods = affection.getResponseModifiers('friend');
  assert(mods.tone, 'Has tone');
  assert(typeof mods.warmth === 'number', 'Has warmth number');
  assert(typeof mods.vulnerabilityAllowed !== 'undefined', 'Has vulnerability setting');
});

test('AffectionSystem - response modifiers increase with level', () => {
  const stranger = affection.getResponseModifiers('stranger');
  const soulmate = affection.getResponseModifiers('soulmate');
  assert(soulmate.warmth > stranger.warmth, 'Soulmate has more warmth');
});

test('AffectionSystem - calculateProgressToNextLevel', () => {
  const progress = affection.calculateProgressToNextLevel(4, 'friend');
  assert(!progress.atMax, 'Friend is not at max');
  assertEqual(progress.nextLevel, 'closeFriend');
  assert(progress.percentage >= 0 && progress.percentage <= 100);
});

test('AffectionSystem - getStreakBonus milestones', () => {
  assertEqual(affection.getStreakBonus(1), 0);
  assert(affection.getStreakBonus(7) > 0, '7 day streak gets bonus');
  assert(affection.getStreakBonus(30) > affection.getStreakBonus(7), '30 day > 7 day');
});

// =====================================================
// VOICE PROSODY DETECTOR TESTS
// =====================================================

console.log('\n=== VOICE PROSODY DETECTOR TESTS ===\n');

const prosody = new VoiceProsodyDetector();

test('VoiceProsodyDetector - pitch parameters defined', () => {
  assert(prosody.parameters.pitch);
  assert(prosody.parameters.pitch.veryLow);
  assert(prosody.parameters.pitch.veryHigh);
});

test('VoiceProsodyDetector - pace parameters defined', () => {
  assert(prosody.parameters.pace);
  assert(prosody.parameters.pace.verySlow);
  assert(prosody.parameters.pace.veryFast);
});

test('VoiceProsodyDetector - emotion patterns for all 8 emotions', () => {
  const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];
  emotions.forEach(e => {
    assert(prosody.prosodyEmotionPatterns[e], `Pattern for ${e} exists`);
  });
});

test('VoiceProsodyDetector - joy pattern has high pitch', () => {
  assertEqual(prosody.prosodyEmotionPatterns.joy.pitch.level, 'high');
});

test('VoiceProsodyDetector - sadness pattern has slow pace', () => {
  assertEqual(prosody.prosodyEmotionPatterns.sadness.pace.level, 'slow');
});

test('VoiceProsodyDetector - anger pattern has loud volume', () => {
  assertEqual(prosody.prosodyEmotionPatterns.anger.volume.level, 'loud');
});

test('VoiceProsodyDetector - analyzePitch returns structure', () => {
  const result = prosody.analyzePitch(180, [170, 175, 180, 185, 190]);
  assert(result.level, 'Has level');
  assert(result.variation, 'Has variation');
  assert(typeof result.mean === 'number', 'Has mean');
});

test('VoiceProsodyDetector - analyzePace returns structure', () => {
  const result = prosody.analyzePace(140, 0.3);
  assert(result.level);
  assert(result.wpm);
  assert(result.pausePattern);
});

test('VoiceProsodyDetector - analyzeVolume returns structure', () => {
  const result = prosody.analyzeVolume(-10);
  assert(result.level);
  assert(typeof result.db === 'number');
});

test('VoiceProsodyDetector - intensity indicators defined', () => {
  assert(prosody.intensityIndicators.pitchVariation);
  assert(prosody.intensityIndicators.volumeDynamics);
  assert(prosody.intensityIndicators.paceVariation);
});

test('VoiceProsodyDetector - generateResponseProsody returns structure', () => {
  const userProsody = {
    primaryEmotion: { emotion: 'sadness', score: 0.7 },
    intensity: 0.6
  };
  const response = prosody.generateResponseProsody(userProsody, 'comfort');
  assert(response.pitch);
  assert(response.pace);
  assert(response.warmth);
});

test('VoiceProsodyDetector - SSML hints generated', () => {
  const hints = prosody.generateSSMLHints({ pitch: 'high', pace: 'slow', volume: 'soft' });
  assert(Array.isArray(hints));
  assert(hints.length > 0, 'Should generate some hints');
});

// =====================================================
// MEMORY ARCHITECTURE TESTS
// =====================================================

console.log('\n=== MEMORY ARCHITECTURE TESTS ===\n');

const memory = new ClarifiedMemoryArchitecture();

test('ClarifiedMemoryArchitecture - STM duration is 24 hours', () => {
  assertEqual(memory.config.stm.duration, 24 * 60 * 60 * 1000);
});

test('ClarifiedMemoryArchitecture - memory types defined', () => {
  assert(memory.memoryTypes.FACT);
  assert(memory.memoryTypes.EMOTION);
  assert(memory.memoryTypes.EVENT);
  assert(memory.memoryTypes.HAPPY_MOMENT);
});

test('ClarifiedMemoryArchitecture - memory lights for each type', () => {
  assert(memory.memoryLights.fact);
  assert(memory.memoryLights.emotion);
  assert(memory.memoryLights.happy_moment.color === 'sunlight');
});

test('ClarifiedMemoryArchitecture - calculateDecay reduces importance', () => {
  const memory_item = {
    importance: 1.0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  };
  const decayed = memory.calculateDecay(memory_item);
  assert(decayed < memory_item.importance, 'Importance should decrease over time');
});

test('ClarifiedMemoryArchitecture - extractTopics finds work topics', () => {
  const messages = [{ content: 'My boss was really demanding in the meeting today' }];
  const topics = memory.extractTopics(messages);
  assert(topics.includes('work'));
});

test('ClarifiedMemoryArchitecture - extractTopics finds relationship topics', () => {
  const messages = [{ content: 'I had a great date with my partner last night' }];
  const topics = memory.extractTopics(messages);
  assert(topics.includes('relationships'));
});

test('ClarifiedMemoryArchitecture - extractPeopleMentioned finds family', () => {
  const messages = [{ content: 'My mom called me this morning' }];
  const people = memory.extractPeopleMentioned(messages);
  assert(people.includes('mom'));
});

test('ClarifiedMemoryArchitecture - getEmotionValence positive for joy', () => {
  const valence = memory.getEmotionValence('joy');
  assertEqual(valence, 1);
});

test('ClarifiedMemoryArchitecture - getEmotionValence negative for sadness', () => {
  const valence = memory.getEmotionValence('sadness');
  assert(valence < 0);
});

test('ClarifiedMemoryArchitecture - analyzeEmotionalArc uplifting', () => {
  const states = ['sadness', 'neutral', 'joy'];
  const arc = memory.analyzeEmotionalArc(states);
  assertEqual(arc, 'uplifting');
});

test('ClarifiedMemoryArchitecture - containsSignificanceMarker detects important', () => {
  assert(memory.containsSignificanceMarker('This is really important to me'));
  assert(memory.containsSignificanceMarker('I achieved a breakthrough'));
});

test('ClarifiedMemoryArchitecture - cosineSimilarity correct calculation', () => {
  const vecA = [1, 0, 0];
  const vecB = [1, 0, 0];
  assertEqual(memory.cosineSimilarity(vecA, vecB), 1); // Identical vectors

  const vecC = [0, 1, 0];
  assertEqual(memory.cosineSimilarity(vecA, vecC), 0); // Orthogonal vectors
});

test('ClarifiedMemoryArchitecture - config consolidation threshold', () => {
  assertEqual(memory.config.ltm.consolidationThreshold, 0.8);
});

test('ClarifiedMemoryArchitecture - config similarity threshold', () => {
  assertEqual(memory.config.ltm.similarityThreshold, 0.7);
});

// =====================================================
// INTEGRATION TESTS
// =====================================================

console.log('\n=== INTEGRATION TESTS ===\n');

test('Integration - Plutchik vector feeds into Happy Moments', () => {
  const vector = { joy: 0.85, trust: 0.6, fear: 0, sadness: 0, anger: 0, disgust: 0, surprise: 0.2, anticipation: 0.3 };
  const isHappy = happyMoments.isHappyMoment(vector);
  assert(isHappy, 'High joy from Plutchik should trigger happy moment');
});

test('Integration - Affection level affects response modifiers', () => {
  const level = affection.getAffectionLevel(10);
  const mods = affection.getResponseModifiers(level);
  assertEqual(level, 'intimate');
  assertEqual(mods.tone, 'intimate');
});

test('Integration - Cathedral light consistency across systems', () => {
  // All systems should use similar light colors for emotions
  const plutchikLight = plutchik.cathedralLightMap.joy;
  const affectionLight = affection.affectionLights.soulmate;
  assert(plutchikLight.color, 'Plutchik has color');
  assert(affectionLight.color, 'Affection has color');
});

test('Integration - Memory types align with Happy Moments', () => {
  assertEqual(memory.memoryTypes.HAPPY_MOMENT, 'happy_moment');
});

test('Integration - Prosody to Plutchik emotion mapping', () => {
  // Joy prosody should detect joy emotion
  const joyPattern = prosody.prosodyEmotionPatterns.joy;
  assert(joyPattern.pitch.level === 'high');
  // When analyzing matching prosody, should return joy
});

// =====================================================
// SUMMARY
// =====================================================

console.log('\n========================================');
console.log(`WEEK 21 TEST RESULTS: ${passCount} passed, ${failCount} failed`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}

module.exports = { passCount, failCount };
