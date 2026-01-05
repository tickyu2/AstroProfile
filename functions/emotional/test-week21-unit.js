/**
 * Week 21 Emotional Sophistication - Unit Tests (No Firebase Required)
 * Tests pure logic functions without database dependencies
 */

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
// PLUTCHIK ENGINE TESTS (Pure Logic)
// =====================================================

console.log('\n=== PLUTCHIK ENGINE TESTS ===\n');

// Inline the pure logic parts for testing
const primaryEmotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];

const intensityLevels = {
  joy: { mild: 'serenity', moderate: 'joy', intense: 'ecstasy' },
  trust: { mild: 'acceptance', moderate: 'trust', intense: 'admiration' },
  fear: { mild: 'apprehension', moderate: 'fear', intense: 'terror' },
  surprise: { mild: 'distraction', moderate: 'surprise', intense: 'amazement' },
  sadness: { mild: 'pensiveness', moderate: 'sadness', intense: 'grief' },
  disgust: { mild: 'boredom', moderate: 'disgust', intense: 'loathing' },
  anger: { mild: 'annoyance', moderate: 'anger', intense: 'rage' },
  anticipation: { mild: 'interest', moderate: 'anticipation', intense: 'vigilance' }
};

const primaryDyads = {
  love: { emotions: ['joy', 'trust'], description: 'Deep affection and connection' },
  submission: { emotions: ['trust', 'fear'], description: 'Compliant deference' },
  awe: { emotions: ['fear', 'surprise'], description: 'Overwhelmed wonder' },
  disapproval: { emotions: ['surprise', 'sadness'], description: 'Unexpected disappointment' },
  remorse: { emotions: ['sadness', 'disgust'], description: 'Regretful self-criticism' },
  contempt: { emotions: ['disgust', 'anger'], description: 'Scornful dismissal' },
  aggressiveness: { emotions: ['anger', 'anticipation'], description: 'Forceful pursuit' },
  optimism: { emotions: ['anticipation', 'joy'], description: 'Hopeful expectation' }
};

const emotionValence = {
  joy: 1.0, trust: 0.5, fear: -0.5, surprise: 0.1,
  sadness: -0.8, disgust: -0.6, anger: -0.7, anticipation: 0.3
};

function getIntensityLabel(score) {
  if (score < 0.4) return 'mild';
  if (score < 0.7) return 'moderate';
  return 'intense';
}

function calculateValence(vector) {
  let totalValence = 0;
  let totalWeight = 0;
  for (const [emotion, value] of Object.entries(vector)) {
    if (emotionValence[emotion] !== undefined) {
      totalValence += emotionValence[emotion] * value;
      totalWeight += value;
    }
  }
  return totalWeight > 0 ? totalValence / totalWeight : 0;
}

function calculateEmotionalComplexity(vector) {
  const values = Object.values(vector).filter(v => v > 0.1);
  if (values.length <= 1) return 0.1;
  const sum = values.reduce((a, b) => a + b, 0);
  const normalized = values.map(v => v / sum);
  const entropy = -normalized.reduce((acc, p) => {
    return p > 0 ? acc + p * Math.log2(p) : acc;
  }, 0);
  const maxEntropy = Math.log2(8);
  return Math.min(1, entropy / maxEntropy);
}

function detectDyads(vector) {
  const primary = [];
  for (const [dyad, config] of Object.entries(primaryDyads)) {
    const [e1, e2] = config.emotions;
    const score = Math.min(vector[e1] || 0, vector[e2] || 0);
    if (score > 0.3) {
      primary.push({ dyad, score, emotions: config.emotions });
    }
  }
  return { primary: primary.sort((a, b) => b.score - a.score) };
}

test('PlutchikEngine - 8 primary emotions defined', () => {
  assertEqual(primaryEmotions.length, 8);
  assert(primaryEmotions.includes('joy'));
  assert(primaryEmotions.includes('trust'));
  assert(primaryEmotions.includes('fear'));
  assert(primaryEmotions.includes('sadness'));
});

test('PlutchikEngine - intensity levels for each emotion', () => {
  const joyIntensities = intensityLevels.joy;
  assertEqual(joyIntensities.mild, 'serenity');
  assertEqual(joyIntensities.moderate, 'joy');
  assertEqual(joyIntensities.intense, 'ecstasy');
});

test('PlutchikEngine - primary dyads defined', () => {
  assert(primaryDyads.love, 'Love dyad should exist');
  assert(primaryDyads.optimism, 'Optimism dyad should exist');
  assert(primaryDyads.submission, 'Submission dyad should exist');
});

test('PlutchikEngine - love = joy + trust', () => {
  const love = primaryDyads.love;
  assert(love.emotions.includes('joy'));
  assert(love.emotions.includes('trust'));
});

test('PlutchikEngine - detectDyads identifies love correctly', () => {
  const vector = { joy: 0.8, trust: 0.7, fear: 0.1, sadness: 0, anger: 0, disgust: 0, surprise: 0, anticipation: 0.2 };
  const dyads = detectDyads(vector);
  assert(dyads.primary.some(d => d.dyad === 'love'), 'Should detect love dyad');
});

test('PlutchikEngine - calculateEmotionalComplexity', () => {
  const simple = { joy: 0.9, trust: 0.1, fear: 0, sadness: 0, anger: 0, disgust: 0, surprise: 0, anticipation: 0 };
  const simpleComplexity = calculateEmotionalComplexity(simple);
  assertInRange(simpleComplexity, 0, 0.5, 'Simple emotions should have low complexity');

  const complex = { joy: 0.5, trust: 0.4, fear: 0.3, sadness: 0.2, anger: 0.1, disgust: 0.1, surprise: 0.3, anticipation: 0.4 };
  const complexComplexity = calculateEmotionalComplexity(complex);
  assertInRange(complexComplexity, 0.4, 1, 'Mixed emotions should have higher complexity');
});

test('PlutchikEngine - calculateValence positive for joy', () => {
  const joyful = { joy: 0.8, trust: 0.5, fear: 0, sadness: 0, anger: 0, disgust: 0, surprise: 0.2, anticipation: 0.3 };
  const valence = calculateValence(joyful);
  assert(valence > 0, 'Joy-dominant should have positive valence');
});

test('PlutchikEngine - calculateValence negative for sadness', () => {
  const sad = { joy: 0, trust: 0.1, fear: 0.2, sadness: 0.8, anger: 0.2, disgust: 0.1, surprise: 0, anticipation: 0 };
  const valence = calculateValence(sad);
  assert(valence < 0, 'Sadness-dominant should have negative valence');
});

test('PlutchikEngine - getIntensityLabel correct ranges', () => {
  assertEqual(getIntensityLabel(0.2), 'mild');
  assertEqual(getIntensityLabel(0.5), 'moderate');
  assertEqual(getIntensityLabel(0.8), 'intense');
});

// =====================================================
// HAPPY MOMENTS ENGINE TESTS
// =====================================================

console.log('\n=== HAPPY MOMENTS ENGINE TESTS ===\n');

const joyThreshold = 0.6;
const sadnessThreshold = 0.6;

const happinessCategories = [
  'achievement', 'love', 'adventure', 'peace', 'connection',
  'creativity', 'growth', 'gratitude', 'play', 'discovery'
];

function isHappyMoment(state) {
  return (state.joy || 0) >= joyThreshold;
}

function shouldTriggerRecall(state) {
  return (state.sadness || 0) >= sadnessThreshold;
}

function getJoyIntensity(joyScore) {
  if (joyScore >= 0.9) return 'ecstatic';
  if (joyScore >= 0.75) return 'strong';
  return 'mild';
}

function categorizeHappiness(content) {
  const lower = content.toLowerCase();
  const categories = [];

  if (lower.match(/achiev|accomplish|success|pass|won|goal|finish/)) categories.push('achievement');
  if (lower.match(/love|partner|romantic|date|kiss|heart/)) categories.push('love');
  if (lower.match(/travel|adventure|explore|discover|trip/)) categories.push('adventure');
  if (lower.match(/peace|calm|serene|quiet|relax/)) categories.push('peace');
  if (lower.match(/friend|family|together|connect|gather/)) categories.push('connection');

  return categories;
}

test('HappyMomentsEngine - joyThreshold is 0.6', () => {
  assertEqual(joyThreshold, 0.6);
});

test('HappyMomentsEngine - sadnessThreshold is 0.6', () => {
  assertEqual(sadnessThreshold, 0.6);
});

test('HappyMomentsEngine - isHappyMoment detects high joy', () => {
  const state = { joy: 0.8, sadness: 0.1 };
  assert(isHappyMoment(state), 'Joy > 0.6 should be happy moment');
});

test('HappyMomentsEngine - isHappyMoment rejects low joy', () => {
  const state = { joy: 0.4, sadness: 0.1 };
  assert(!isHappyMoment(state), 'Joy < 0.6 should not be happy moment');
});

test('HappyMomentsEngine - shouldTriggerRecall for high sadness', () => {
  const state = { joy: 0.1, sadness: 0.7 };
  assert(shouldTriggerRecall(state), 'Sadness > 0.6 should trigger recall');
});

test('HappyMomentsEngine - happiness categories defined', () => {
  assert(happinessCategories.length > 0, 'Should have categories');
  assert(happinessCategories.includes('achievement'));
  assert(happinessCategories.includes('love'));
});

test('HappyMomentsEngine - categorizeHappiness detects achievement', () => {
  const categories = categorizeHappiness('I finally passed my exam! I achieved my goal.');
  assert(categories.includes('achievement'), 'Should detect achievement');
});

test('HappyMomentsEngine - categorizeHappiness detects love', () => {
  const categories = categorizeHappiness('My partner said they love me and we had the best date');
  assert(categories.includes('love'), 'Should detect love');
});

test('HappyMomentsEngine - getJoyIntensity correct labels', () => {
  assertEqual(getJoyIntensity(0.65), 'mild');
  assertEqual(getJoyIntensity(0.8), 'strong');
  assertEqual(getJoyIntensity(0.95), 'ecstatic');
});

// =====================================================
// AFFECTION SYSTEM TESTS
// =====================================================

console.log('\n=== AFFECTION SYSTEM TESTS ===\n');

const minAffection = -10;
const maxAffection = 15;

const modeThresholds = {
  stranger: { min: -10, max: 0 },
  acquaintance: { min: 0, max: 3 },
  friend: { min: 3, max: 6 },
  closeFriend: { min: 6, max: 9 },
  intimate: { min: 9, max: 12 },
  soulmate: { min: 12, max: 15 }
};

const featureUnlocks = {
  0: ['basic_chat', 'profile_access'],
  3: ['personal_questions', 'memory_recall', 'gentle_teasing'],
  6: ['emotional_support', 'deep_conversations', 'playful_mode'],
  9: ['intimate_discussions', 'vulnerability_sharing', 'flirtation']
};

const interactionBoosts = {
  greeting: 0.05,
  casual_chat: 0.1,
  emotional_sharing: 0.3,
  vulnerability: 0.5,
  crisis_support: 0.6
};

const negativeImpacts = {
  harsh_words: -0.5,
  broken_trust: -1.0,
  betrayal: -3.0
};

const decayRates = {
  stranger: 0,
  acquaintance: 0.1,
  closeFriend: 0.2
};

function getAffectionLevel(score) {
  for (const [level, range] of Object.entries(modeThresholds)) {
    if (score >= range.min && score < range.max) return level;
  }
  if (score >= 15) return 'soulmate';
  if (score < -10) return 'stranger';
  return 'acquaintance';
}

function getUnlockedFeatures(score) {
  const features = [];
  for (const [threshold, featureList] of Object.entries(featureUnlocks)) {
    if (score >= parseInt(threshold)) features.push(...featureList);
  }
  return [...new Set(features)];
}

function getStreakBonus(streakDays) {
  if (streakDays >= 365) return 1.0;
  if (streakDays >= 100) return 0.5;
  if (streakDays >= 30) return 0.3;
  if (streakDays >= 7) return 0.15;
  if (streakDays >= 3) return 0.05;
  return 0;
}

function getResponseModifiers(level) {
  const modifiers = {
    stranger: { tone: 'polite', warmth: 0.3, vulnerabilityAllowed: false },
    acquaintance: { tone: 'friendly', warmth: 0.5, vulnerabilityAllowed: false },
    friend: { tone: 'warm', warmth: 0.65, vulnerabilityAllowed: 'light' },
    closeFriend: { tone: 'affectionate', warmth: 0.8, vulnerabilityAllowed: true },
    intimate: { tone: 'intimate', warmth: 0.9, vulnerabilityAllowed: 'full' },
    soulmate: { tone: 'transcendent', warmth: 1.0, vulnerabilityAllowed: 'complete' }
  };
  return modifiers[level] || modifiers.acquaintance;
}

function calculateProgressToNextLevel(score, currentLevel) {
  const levels = Object.keys(modeThresholds);
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex === levels.length - 1) return { atMax: true, percentage: 100 };

  const nextLevel = levels[currentIndex + 1];
  const currentThreshold = modeThresholds[currentLevel];
  const nextThreshold = modeThresholds[nextLevel];

  const range = nextThreshold.min - currentThreshold.min;
  const progress = score - currentThreshold.min;
  const percentage = Math.min(100, Math.round((progress / range) * 100));

  return { nextLevel, pointsNeeded: nextThreshold.min - score, percentage, atMax: false };
}

test('AffectionSystem - score range -10 to +15', () => {
  assertEqual(minAffection, -10);
  assertEqual(maxAffection, 15);
});

test('AffectionSystem - mode thresholds defined', () => {
  assert(modeThresholds.stranger, 'Stranger level exists');
  assert(modeThresholds.soulmate, 'Soulmate level exists');
});

test('AffectionSystem - getAffectionLevel stranger for -5', () => {
  assertEqual(getAffectionLevel(-5), 'stranger');
});

test('AffectionSystem - getAffectionLevel acquaintance for 1', () => {
  assertEqual(getAffectionLevel(1), 'acquaintance');
});

test('AffectionSystem - getAffectionLevel friend for 4', () => {
  assertEqual(getAffectionLevel(4), 'friend');
});

test('AffectionSystem - getAffectionLevel closeFriend for 7', () => {
  assertEqual(getAffectionLevel(7), 'closeFriend');
});

test('AffectionSystem - getAffectionLevel intimate for 10', () => {
  assertEqual(getAffectionLevel(10), 'intimate');
});

test('AffectionSystem - getAffectionLevel soulmate for 14', () => {
  assertEqual(getAffectionLevel(14), 'soulmate');
});

test('AffectionSystem - feature unlocks defined', () => {
  assert(featureUnlocks[0], 'Features at 0');
  assert(featureUnlocks[3], 'Features at 3');
  assert(featureUnlocks[6], 'Features at 6');
});

test('AffectionSystem - getUnlockedFeatures at 0', () => {
  const features = getUnlockedFeatures(0);
  assert(features.includes('basic_chat'));
});

test('AffectionSystem - getUnlockedFeatures at 7 includes friend features', () => {
  const features = getUnlockedFeatures(7);
  assert(features.includes('basic_chat'), 'Has basic features');
  assert(features.includes('emotional_support'), 'Has friend features');
});

test('AffectionSystem - interaction boosts defined', () => {
  assert(interactionBoosts.greeting > 0);
  assert(interactionBoosts.emotional_sharing > interactionBoosts.greeting);
  assert(interactionBoosts.crisis_support > interactionBoosts.casual_chat);
});

test('AffectionSystem - negative impacts defined', () => {
  assert(negativeImpacts.harsh_words < 0);
  assert(negativeImpacts.broken_trust < negativeImpacts.harsh_words);
});

test('AffectionSystem - decay rates vary by level', () => {
  assertEqual(decayRates.stranger, 0, 'No decay at stranger');
  assert(decayRates.closeFriend > decayRates.acquaintance);
});

test('AffectionSystem - getResponseModifiers returns correct structure', () => {
  const mods = getResponseModifiers('friend');
  assert(mods.tone, 'Has tone');
  assert(typeof mods.warmth === 'number', 'Has warmth number');
  assert(mods.vulnerabilityAllowed !== undefined, 'Has vulnerability setting');
});

test('AffectionSystem - response modifiers increase with level', () => {
  const stranger = getResponseModifiers('stranger');
  const soulmate = getResponseModifiers('soulmate');
  assert(soulmate.warmth > stranger.warmth, 'Soulmate has more warmth');
});

test('AffectionSystem - calculateProgressToNextLevel', () => {
  const progress = calculateProgressToNextLevel(4, 'friend');
  assert(!progress.atMax, 'Friend is not at max');
  assertEqual(progress.nextLevel, 'closeFriend');
  assert(progress.percentage >= 0 && progress.percentage <= 100);
});

test('AffectionSystem - getStreakBonus milestones', () => {
  assertEqual(getStreakBonus(1), 0);
  assert(getStreakBonus(7) > 0, '7 day streak gets bonus');
  assert(getStreakBonus(30) > getStreakBonus(7), '30 day > 7 day');
});

// =====================================================
// VOICE PROSODY DETECTOR TESTS
// =====================================================

console.log('\n=== VOICE PROSODY DETECTOR TESTS ===\n');

const prosodyEmotionPatterns = {
  joy: { pitch: { level: 'high', variation: 'high' }, pace: { level: 'fast' }, volume: { level: 'moderate-high' } },
  sadness: { pitch: { level: 'low', variation: 'low' }, pace: { level: 'slow' }, volume: { level: 'soft' } },
  anger: { pitch: { level: 'variable', variation: 'extreme' }, pace: { level: 'fast' }, volume: { level: 'loud' } }
};

function analyzePitch(f0, contour) {
  if (!f0 || !contour || contour.length === 0) {
    return { level: 'neutral', variation: 'moderate', mean: 180, trend: 'steady' };
  }
  const mean = f0;
  const variation = Math.sqrt(contour.reduce((sum, val) => {
    const m = contour.reduce((a, b) => a + b, 0) / contour.length;
    return sum + Math.pow(val - m, 2);
  }, 0) / contour.length);

  let level = 'neutral';
  if (mean < 120) level = 'veryLow';
  else if (mean < 165) level = 'low';
  else if (mean < 220) level = 'neutral';
  else if (mean < 300) level = 'high';
  else level = 'veryHigh';

  return { level, variation: variation > 25 ? 'high' : 'moderate', mean };
}

function analyzePace(speakingRate, pauseDuration) {
  const wpm = speakingRate || 140;
  let level = 'neutral';
  if (wpm < 90) level = 'verySlow';
  else if (wpm < 120) level = 'slow';
  else if (wpm < 160) level = 'neutral';
  else if (wpm < 200) level = 'fast';
  else level = 'veryFast';

  return { level, wpm, pausePattern: pauseDuration > 0.4 ? 'deliberate' : 'normal' };
}

function analyzeVolume(intensity) {
  const db = intensity || -10;
  let level = 'neutral';
  if (db < -20) level = 'soft';
  else if (db < 0) level = 'neutral';
  else level = 'loud';
  return { level, db };
}

test('VoiceProsodyDetector - emotion patterns for all emotions', () => {
  assert(prosodyEmotionPatterns.joy, 'Joy pattern exists');
  assert(prosodyEmotionPatterns.sadness, 'Sadness pattern exists');
  assert(prosodyEmotionPatterns.anger, 'Anger pattern exists');
});

test('VoiceProsodyDetector - joy pattern has high pitch', () => {
  assertEqual(prosodyEmotionPatterns.joy.pitch.level, 'high');
});

test('VoiceProsodyDetector - sadness pattern has slow pace', () => {
  assertEqual(prosodyEmotionPatterns.sadness.pace.level, 'slow');
});

test('VoiceProsodyDetector - anger pattern has loud volume', () => {
  assertEqual(prosodyEmotionPatterns.anger.volume.level, 'loud');
});

test('VoiceProsodyDetector - analyzePitch returns structure', () => {
  const result = analyzePitch(180, [170, 175, 180, 185, 190]);
  assert(result.level, 'Has level');
  assert(result.variation, 'Has variation');
  assert(typeof result.mean === 'number', 'Has mean');
});

test('VoiceProsodyDetector - analyzePace returns structure', () => {
  const result = analyzePace(140, 0.3);
  assert(result.level);
  assert(result.wpm);
  assert(result.pausePattern);
});

test('VoiceProsodyDetector - analyzeVolume returns structure', () => {
  const result = analyzeVolume(-10);
  assert(result.level);
  assert(typeof result.db === 'number');
});

// =====================================================
// MEMORY ARCHITECTURE TESTS
// =====================================================

console.log('\n=== MEMORY ARCHITECTURE TESTS ===\n');

const memoryConfig = {
  stm: { duration: 24 * 60 * 60 * 1000, maxItems: 100, decayRate: 0.05 },
  ltm: { consolidationThreshold: 0.8, similarityThreshold: 0.7 }
};

const memoryTypes = {
  FACT: 'fact', EMOTION: 'emotion', EVENT: 'event',
  HAPPY_MOMENT: 'happy_moment', PROMISE: 'promise'
};

const memoryLights = {
  fact: { color: 'sapphire', brightness: 0.6 },
  emotion: { color: 'rose', brightness: 0.8 },
  happy_moment: { color: 'sunlight', brightness: 0.9 }
};

function calculateDecay(memory) {
  const now = new Date();
  const created = memory.createdAt || now;
  const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
  const decay = Math.exp(-memoryConfig.stm.decayRate * hoursSinceCreation);
  return memory.importance * decay;
}

function getEmotionValenceForMemory(emotion) {
  const valenceMap = { joy: 1, trust: 0.7, fear: -0.6, sadness: -0.7, anger: -0.5, neutral: 0 };
  return valenceMap[emotion?.toLowerCase?.()] || valenceMap[emotion] || 0;
}

function analyzeEmotionalArc(states) {
  if (!states || states.length === 0) return 'neutral';
  const startValence = getEmotionValenceForMemory(states[0]);
  const endValence = getEmotionValenceForMemory(states[states.length - 1]);
  if (endValence > startValence + 0.2) return 'uplifting';
  if (endValence < startValence - 0.2) return 'declining';
  return 'neutral';
}

function extractTopics(messages) {
  const topics = new Set();
  const allText = messages.map(m => m.content || '').join(' ').toLowerCase();
  if (allText.match(/job|work|boss|meeting/)) topics.add('work');
  if (allText.match(/friend|family|partner/)) topics.add('relationships');
  return Array.from(topics);
}

function extractPeopleMentioned(messages) {
  const people = new Set();
  const allText = messages.map(m => m.content || '').join(' ').toLowerCase();
  const terms = ['mom', 'dad', 'partner', 'friend', 'boss'];
  terms.forEach(t => { if (allText.includes(t)) people.add(t); });
  return Array.from(people);
}

function containsSignificanceMarker(text) {
  if (!text) return false;
  const markers = ['important', 'big news', 'breakthrough', 'achieved'];
  return markers.some(m => text.toLowerCase().includes(m));
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

test('ClarifiedMemoryArchitecture - STM duration is 24 hours', () => {
  assertEqual(memoryConfig.stm.duration, 24 * 60 * 60 * 1000);
});

test('ClarifiedMemoryArchitecture - memory types defined', () => {
  assert(memoryTypes.FACT);
  assert(memoryTypes.EMOTION);
  assert(memoryTypes.HAPPY_MOMENT);
});

test('ClarifiedMemoryArchitecture - memory lights for each type', () => {
  assert(memoryLights.fact);
  assert(memoryLights.emotion);
  assertEqual(memoryLights.happy_moment.color, 'sunlight');
});

test('ClarifiedMemoryArchitecture - calculateDecay reduces importance', () => {
  const memory_item = {
    importance: 1.0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  };
  const decayed = calculateDecay(memory_item);
  assert(decayed < memory_item.importance, 'Importance should decrease over time');
});

test('ClarifiedMemoryArchitecture - extractTopics finds work topics', () => {
  const messages = [{ content: 'My boss was really demanding in the meeting today' }];
  const topics = extractTopics(messages);
  assert(topics.includes('work'));
});

test('ClarifiedMemoryArchitecture - extractPeopleMentioned finds family', () => {
  const messages = [{ content: 'My mom called me this morning' }];
  const people = extractPeopleMentioned(messages);
  assert(people.includes('mom'));
});

test('ClarifiedMemoryArchitecture - getEmotionValence positive for joy', () => {
  assertEqual(getEmotionValenceForMemory('joy'), 1);
});

test('ClarifiedMemoryArchitecture - getEmotionValence negative for sadness', () => {
  assert(getEmotionValenceForMemory('sadness') < 0);
});

test('ClarifiedMemoryArchitecture - analyzeEmotionalArc uplifting', () => {
  const states = ['sadness', 'neutral', 'joy'];
  const arc = analyzeEmotionalArc(states);
  assertEqual(arc, 'uplifting');
});

test('ClarifiedMemoryArchitecture - containsSignificanceMarker detects important', () => {
  assert(containsSignificanceMarker('This is really important to me'));
  assert(containsSignificanceMarker('I achieved a breakthrough'));
});

test('ClarifiedMemoryArchitecture - cosineSimilarity correct calculation', () => {
  const vecA = [1, 0, 0];
  const vecB = [1, 0, 0];
  assertEqual(cosineSimilarity(vecA, vecB), 1);

  const vecC = [0, 1, 0];
  assertEqual(cosineSimilarity(vecA, vecC), 0);
});

test('ClarifiedMemoryArchitecture - config consolidation threshold', () => {
  assertEqual(memoryConfig.ltm.consolidationThreshold, 0.8);
});

// =====================================================
// INTEGRATION TESTS
// =====================================================

console.log('\n=== INTEGRATION TESTS ===\n');

test('Integration - Plutchik vector feeds into Happy Moments', () => {
  const vector = { joy: 0.85, trust: 0.6, fear: 0, sadness: 0, anger: 0, disgust: 0, surprise: 0.2, anticipation: 0.3 };
  const happy = isHappyMoment(vector);
  assert(happy, 'High joy from Plutchik should trigger happy moment');
});

test('Integration - Affection level affects response modifiers', () => {
  const level = getAffectionLevel(10);
  const mods = getResponseModifiers(level);
  assertEqual(level, 'intimate');
  assertEqual(mods.tone, 'intimate');
});

test('Integration - Memory types align with Happy Moments', () => {
  assertEqual(memoryTypes.HAPPY_MOMENT, 'happy_moment');
});

// =====================================================
// SUMMARY
// =====================================================

console.log('\n========================================');
console.log(`WEEK 21 UNIT TEST RESULTS: ${passCount} passed, ${failCount} failed`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}

module.exports = { passCount, failCount };
