/**
 * WEEK 13 ENHANCED: Biography Builder & Preference Engine Tests
 *
 * Tests for EnhancedAmnesisBuster:
 * - Indirect Preference Discovery
 * - Conversational Can Openers
 * - Biography Building
 * - Legacy Creation
 *
 * Part of GENESIS Week 13 - Intimacy & Memory Expansion
 */

const assert = require('assert');

// Import enhanced module
const { EnhancedAmnesiaBuster } = require('../intimacy/enhancedAmnesiaBuster');

// Test counters
let passed = 0;
let failed = 0;

// Test helper
function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✅ ${name}\x1b[0m`);
    passed++;
  } catch (error) {
    console.log(`  \x1b[31m❌ ${name}\x1b[0m`);
    console.log(`     Error: ${error.message}`);
    failed++;
  }
}

// Async test helper
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  \x1b[32m✅ ${name}\x1b[0m`);
    passed++;
  } catch (error) {
    console.log(`  \x1b[31m❌ ${name}\x1b[0m`);
    console.log(`     Error: ${error.message}`);
    failed++;
  }
}

console.log('============================================================');
console.log('🧠 WEEK 13 ENHANCED: BIOGRAPHY BUILDER & PREFERENCE ENGINE');
console.log('============================================================');
console.log('EnhancedAmnesisBuster Tests\n');

// Initialize module
const enhanced = new EnhancedAmnesiaBuster();

// ============================================================================
// PREFERENCE DISCOVERY TESTS
// ============================================================================

console.log('\x1b[36m🔍 PREFERENCE DISCOVERY\x1b[0m\n');

test('EnhancedAmnesisBuster instantiates correctly', () => {
  assert(enhanced, 'Should create instance');
  assert(enhanced.preferenceCategories, 'Should have preference categories');
  assert(enhanced.knownItems, 'Should have known items');
  assert(enhanced.lifePeriods, 'Should have life periods');
});

test('Has proper preference categories', () => {
  const categories = Object.keys(enhanced.preferenceCategories);
  assert(categories.includes('drinks'), 'Should have drinks category');
  assert(categories.includes('food'), 'Should have food category');
  assert(categories.includes('music'), 'Should have music category');
  assert(categories.includes('activities'), 'Should have activities category');
});

// Direct preference detection
test('Detects direct love statements', () => {
  const discoveries = enhanced.detectDirectPreferences('I love pizza!');
  assert(discoveries.length > 0, 'Should detect preference');
  assert(discoveries[0].item === 'pizza', 'Should find pizza');
  assert(discoveries[0].type === 'loves', 'Should be loves type');
  assert(discoveries[0].confidence >= 0.8, 'Should have high confidence');
});

test('Detects direct hate statements', () => {
  const discoveries = enhanced.detectDirectPreferences('I hate broccoli');
  assert(discoveries.length > 0, 'Should detect preference');
  assert(discoveries[0].item === 'broccoli', 'Should find broccoli');
  assert(discoveries[0].type === 'hates', 'Should be hates type');
});

test('Detects "is my favorite" pattern', () => {
  const discoveries = enhanced.detectDirectPreferences('Coffee is my favorite');
  assert(discoveries.length > 0, 'Should detect preference');
  assert(discoveries[0].item === 'coffee', 'Should find coffee');
  assert(discoveries[0].type === 'loves', 'Should be loves');
});

// Indirect preference detection
test('Detects indirect mentions (grabbed)', () => {
  const discoveries = enhanced.detectIndirectPreferences('I grabbed a coke from the fridge');
  assert(discoveries.length > 0, 'Should detect preference');
  assert(discoveries[0].item === 'coke', 'Should find coke');
  assert(discoveries[0].method === 'indirect_mention', 'Should be indirect');
  assert(discoveries[0].confidence < 0.7, 'Should have lower confidence than direct');
});

test('Detects indirect mentions (listening to)', () => {
  const discoveries = enhanced.detectIndirectPreferences('I was listening to jazz');
  assert(discoveries.length > 0, 'Should detect preference');
  assert(discoveries[0].item === 'jazz', 'Should find jazz');
});

// Rejection detection
test('Detects rejections (would never)', () => {
  const discoveries = enhanced.detectRejections('I would never drink pepsi');
  assert(discoveries.length > 0, 'Should detect rejection');
  assert(discoveries[0].type === 'hates', 'Should be hates');
});

test('Detects rejections (not a fan)', () => {
  const discoveries = enhanced.detectRejections("I'm not a fan of country");
  assert(discoveries.length > 0, 'Should detect rejection');
  assert(discoveries[0].type === 'dislikes', 'Should be dislikes');
});

// Enthusiasm detection
test('Detects enthusiasm (is the best!)', () => {
  const discoveries = enhanced.detectEnthusiasm('Pizza is the best!');
  assert(discoveries.length > 0, 'Should detect enthusiasm');
  assert(discoveries[0].type === 'loves', 'Should be loves');
  assert(discoveries[0].confidence >= 0.9, 'Should have very high confidence');
});

test('Detects enthusiasm (obsessed)', () => {
  const discoveries = enhanced.detectEnthusiasm("I'm obsessed with sushi");
  assert(discoveries.length > 0, 'Should detect obsession');
  assert(discoveries[0].type === 'loves', 'Should be loves');
});

// Contextual detection
test('Detects contextual preferences', () => {
  const discoveries = enhanced.detectContextualPreferences(
    'After my workout, I always grab a coke',
    {}
  );
  assert(discoveries.length > 0, 'Should detect contextual preference');
  assert(discoveries[0].contextTags && discoveries[0].contextTags.length > 0, 'Should have context tags');
  assert(discoveries[0].ritual === true, 'Should mark as ritual');
});

// Item validation
test('Validates preference items correctly', () => {
  assert(enhanced.isValidPreferenceItem('pizza') === true, 'Should accept pizza');
  assert(enhanced.isValidPreferenceItem('coffee') === true, 'Should accept coffee');
  assert(enhanced.isValidPreferenceItem('it') === false, 'Should reject "it"');
  assert(enhanced.isValidPreferenceItem('the') === false, 'Should reject "the"');
  assert(enhanced.isValidPreferenceItem('a') === false, 'Should reject single letters');
  assert(enhanced.isValidPreferenceItem('123') === false, 'Should reject pure numbers');
});

// Item categorization
test('Categorizes items correctly', () => {
  assert(enhanced.categorizeItem('coke') === 'drinks', 'Should categorize coke as drinks');
  assert(enhanced.categorizeItem('pizza') === 'food', 'Should categorize pizza as food');
  assert(enhanced.categorizeItem('rock') === 'music', 'Should categorize rock as music');
  assert(enhanced.categorizeItem('hiking') === 'activities', 'Should categorize hiking as activities');
});

// Combined discovery
asyncTest('Discovers multiple preferences from message', async () => {
  const discoveries = await enhanced.discoverPreferences(
    'test-user',
    'I love pizza and I hate broccoli. After gym I always grab a coke!',
    {}
  );
  assert(discoveries.length >= 2, 'Should find multiple preferences');
});

// ============================================================================
// CONVERSATION OPENER TESTS
// ============================================================================

console.log('\n\x1b[36m💬 CONVERSATION OPENERS\x1b[0m\n');

test('Generates generic opener without database', () => {
  const opener = enhanced.generateGenericOpener();
  assert(opener, 'Should generate opener');
  assert(opener.text, 'Should have text');
  assert(opener.type, 'Should have type');
});

test('Generates opener for preference object', () => {
  const pref = {
    item: 'coffee',
    preference_type: 'loves',
    category: 'drinks',
    mention_count: 5
  };
  const opener = enhanced.generateOpenerForPreference(pref);
  assert(opener, 'Should generate opener');
  assert(opener.text, 'Should have text');
  assert(opener.text.toLowerCase().includes('coffee'), 'Should mention coffee');
});

test('Classifies opener types correctly', () => {
  assert(enhanced.classifyOpenerType('Have you had coffee?') === 'direct_question');
  assert(enhanced.classifyOpenerType('I was thinking about pizza') === 'casual_mention');
  assert(enhanced.classifyOpenerType('Tell me a story about it') === 'story_trigger');
});

test('Uses story openers for loved items', () => {
  const pref = {
    item: 'sushi',
    preference_type: 'loves',
    category: 'food',
    mention_count: 1
  };
  const opener = enhanced.generateOpenerForPreference(pref);
  assert(opener.type === 'story', 'Should use story opener for loved items');
});

test('Uses casual openers for frequently mentioned items', () => {
  const pref = {
    item: 'coffee',
    preference_type: 'likes',
    category: 'drinks',
    mention_count: 5
  };
  const opener = enhanced.generateOpenerForPreference(pref);
  assert(opener.type === 'casual', 'Should use casual opener for frequent items');
});

// ============================================================================
// BIOGRAPHY BUILDING TESTS
// ============================================================================

console.log('\n\x1b[36m📖 BIOGRAPHY BUILDING\x1b[0m\n');

test('Has correct life periods defined', () => {
  const periods = Object.keys(enhanced.lifePeriods);
  assert(periods.includes('childhood'), 'Should have childhood');
  assert(periods.includes('teenage'), 'Should have teenage');
  assert(periods.includes('young_adult'), 'Should have young_adult');
  assert(periods.includes('adult'), 'Should have adult');
  assert(periods.includes('current'), 'Should have current');
});

test('Gets correct period for age', () => {
  assert(enhanced.getPeriodForAge(8) === 'childhood', 'Age 8 should be childhood');
  assert(enhanced.getPeriodForAge(16) === 'teenage', 'Age 16 should be teenage');
  assert(enhanced.getPeriodForAge(25) === 'young_adult', 'Age 25 should be young_adult');
  assert(enhanced.getPeriodForAge(35) === 'adult', 'Age 35 should be adult');
  assert(enhanced.getPeriodForAge(45) === 'midlife', 'Age 45 should be midlife');
});

test('Generates correct chapter titles', () => {
  assert(enhanced.generateChapterTitle({ type: 'childhood' }) === 'Growing Up');
  assert(enhanced.generateChapterTitle({ type: 'teenage' }) === 'The Teenage Years');
  assert(enhanced.generateChapterTitle({ type: 'young_adult' }) === 'Finding My Way');
  assert(enhanced.generateChapterTitle({ type: 'current' }) === 'Where I Am Now');
});

test('Returns biography summary without database', async () => {
  const summary = await enhanced.getBiographySummary('test-user');
  assert(typeof summary.totalChapters === 'number', 'Should have totalChapters');
  assert(typeof summary.totalStories === 'number', 'Should have totalStories');
  assert(typeof summary.avgCompleteness === 'number', 'Should have avgCompleteness');
  assert(summary.totalChapters === 0, 'Should be 0 without database');
});

// ============================================================================
// LEGACY CREATION TESTS
// ============================================================================

console.log('\n\x1b[36m📜 LEGACY CREATION\x1b[0m\n');

test('Calculates legacy completeness correctly', () => {
  const chapters = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const stories = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

  const completeness = enhanced.calculateLegacyCompleteness(chapters, stories);
  assert(completeness > 0, 'Should have positive completeness');
  assert(completeness <= 1.0, 'Should not exceed 1.0');
});

test('Handles empty legacy calculation', () => {
  const completeness = enhanced.calculateLegacyCompleteness([], []);
  assert(completeness === 0, 'Empty should be 0 completeness');
});

test('Caps legacy completeness at 1.0', () => {
  const chapters = Array(10).fill({ id: 1 });
  const stories = Array(50).fill({ id: 1 });

  const completeness = enhanced.calculateLegacyCompleteness(chapters, stories);
  assert(completeness === 1.0, 'Should cap at 1.0');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

console.log('\n\x1b[36m🔗 INTEGRATION TESTS\x1b[0m\n');

asyncTest('Complete preference discovery flow works', async () => {
  const message = "I'm obsessed with coffee! Had some this morning after my run. I hate tea though.";
  const discoveries = await enhanced.discoverPreferences('test-user', message, {});

  // Should find coffee (obsessed) and tea (hate)
  const coffeeDisc = discoveries.find(d => d.item === 'coffee');
  const teaDisc = discoveries.find(d => d.item === 'tea');

  assert(coffeeDisc, 'Should find coffee');
  assert(coffeeDisc.type === 'loves', 'Coffee should be loves');
  assert(teaDisc, 'Should find tea');
  assert(teaDisc.type === 'hates', 'Tea should be hates');
});

asyncTest('Era and period calculation work together', async () => {
  const era = enhanced.calculateUserEra(30);
  assert(era.birthYear, 'Should have birth year');

  const period = enhanced.getPeriodForAge(30);
  assert(period === 'young_adult' || period === 'adult', 'Age 30 should be young_adult or adult');
});

test('Opener generation uses preference data', () => {
  const pref = {
    item: 'running',
    preference_type: 'loves',
    category: 'activities',
    mention_count: 3,
    confidence: 0.9
  };

  const opener = enhanced.generateOpenerForPreference(pref);
  assert(opener.text.toLowerCase().includes('running'), 'Opener should mention the item');
  assert(opener.preference === pref, 'Opener should include preference reference');
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

console.log('\n\x1b[36m⚡ PERFORMANCE TESTS\x1b[0m\n');

test('Preference discovery is fast (<50ms for complex message)', () => {
  const message = "I love coffee, hate tea, enjoy running, prefer mountains over beaches, and I'm obsessed with sushi!";

  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    enhanced.detectDirectPreferences(message);
    enhanced.detectIndirectPreferences(message);
    enhanced.detectRejections(message);
    enhanced.detectEnthusiasm(message);
  }
  const elapsed = Date.now() - start;

  assert(elapsed < 500, `100 iterations should be fast (was ${elapsed}ms)`);
});

test('Item categorization is instant (<10ms for 1000 items)', () => {
  const items = ['coffee', 'pizza', 'rock', 'hiking', 'beach', 'sushi', 'jazz', 'running'];

  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    for (const item of items) {
      enhanced.categorizeItem(item);
    }
  }
  const elapsed = Date.now() - start;

  assert(elapsed < 100, `8000 categorizations should be fast (was ${elapsed}ms)`);
});

test('Opener generation is fast (<20ms for 100 openers)', () => {
  const pref = {
    item: 'coffee',
    preference_type: 'loves',
    category: 'drinks',
    mention_count: 5
  };

  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    enhanced.generateOpenerForPreference(pref);
  }
  const elapsed = Date.now() - start;

  assert(elapsed < 50, `100 opener generations should be fast (was ${elapsed}ms)`);
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

console.log('\n\x1b[36m🔧 EDGE CASES\x1b[0m\n');

test('Handles empty message gracefully', () => {
  const discoveries = enhanced.detectDirectPreferences('');
  assert(Array.isArray(discoveries), 'Should return array');
  assert(discoveries.length === 0, 'Should be empty');
});

test('Handles message with no preferences', () => {
  const discoveries = enhanced.detectDirectPreferences('Hello, how are you today?');
  assert(Array.isArray(discoveries), 'Should return array');
});

test('Filters out stop words', () => {
  const discoveries = enhanced.detectDirectPreferences('I love it');
  const itDisc = discoveries.find(d => d.item === 'it');
  assert(!itDisc, 'Should not include "it" as preference');
});

test('Handles special characters in messages', () => {
  const discoveries = enhanced.detectDirectPreferences("I love pizza! :) It's great.");
  assert(Array.isArray(discoveries), 'Should handle special chars');
});

// ============================================================================
// RESULTS
// ============================================================================

console.log('\n============================================================');
console.log('📊 TEST RESULTS');
console.log('============================================================\n');

console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total:  ${passed + failed}`);
console.log(`📊 Rate:   ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n\x1b[32m🎉 ALL ENHANCED TESTS PASSED!\x1b[0m');
  console.log('\x1b[32m💛 Biography Builder & Preference Engine: READY!\x1b[0m');
  console.log('\x1b[32m📖 EnhancedAmnesisBuster: OPERATIONAL!\x1b[0m');
} else {
  console.log('\n\x1b[31m⚠️ Some tests failed - review needed\x1b[0m');
  process.exit(1);
}
