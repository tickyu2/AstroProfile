/**
 * Quick test script for MBTI + Enneagram Synthesis Engine
 * Run with: node --experimental-specifier-resolution=node scripts/test-synthesis.js
 */

import {
  getSynthesis,
  getLunaGuidance,
  getStrengths,
  getChallenges,
  getGrowthPath,
  getFamousExamples,
  isImplemented,
  getImplementedCombinations,
  getImplementationStats
} from '../src/data/mbtiEnneagramSynthesis.js';

console.log('=====================================');
console.log('MBTI + Enneagram Synthesis Engine');
console.log('Phase 1 Test Suite');
console.log('=====================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (error) {
    console.log(`  FAIL: ${name}`);
    console.log(`        ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - Expected ${expected}, got ${actual}`);
  }
}

function assertTruthy(value, message) {
  if (!value) {
    throw new Error(`${message} - Expected truthy value`);
  }
}

function assertArray(value, message) {
  if (!Array.isArray(value)) {
    throw new Error(`${message} - Expected array`);
  }
}

// Test getSynthesis
console.log('Testing getSynthesis():');
test('Returns null for invalid MBTI', () => {
  assertEqual(getSynthesis('INVALID', 4), null, 'Invalid MBTI');
});

test('Returns null for missing parameters', () => {
  assertEqual(getSynthesis(null, 4), null, 'Null MBTI');
  assertEqual(getSynthesis('INFP', null), null, 'Null enneagram');
});

test('Returns fallback for unimplemented combination', () => {
  const result = getSynthesis('INFP', 8);
  assertTruthy(result, 'Result exists');
  assertEqual(result.implemented, false, 'Not implemented');
  assertEqual(result.archetype, 'INFP + Type 8', 'Fallback archetype');
});

test('Returns full synthesis for INFP + Type 4', () => {
  const result = getSynthesis('INFP', 4);
  assertTruthy(result, 'Result exists');
  assertEqual(result.implemented, true, 'Is implemented');
  assertEqual(result.archetype, 'The Artistic Soul', 'Correct archetype');
  assertEqual(result.strengths.length, 6, 'Has 6 strengths');
});

test('Returns full synthesis for INTJ + Type 5', () => {
  const result = getSynthesis('INTJ', 5);
  assertTruthy(result, 'Result exists');
  assertEqual(result.implemented, true, 'Is implemented');
  assertEqual(result.archetype, 'The Strategic Observer', 'Correct archetype');
});

test('Handles lowercase MBTI', () => {
  const result = getSynthesis('infp', 4);
  assertTruthy(result, 'Result exists');
  assertEqual(result.implemented, true, 'Is implemented');
});

// Test getLunaGuidance
console.log('\nTesting getLunaGuidance():');
test('Returns guidance for implemented combination', () => {
  const guidance = getLunaGuidance('INFP', 4);
  assertTruthy(guidance, 'Guidance exists');
  assertEqual(guidance.communication_style, 'Deep, poetic, validating', 'Correct style');
  assertTruthy(guidance.what_to_do.length > 0, 'Has what_to_do');
});

test('Returns null for unimplemented combination', () => {
  assertEqual(getLunaGuidance('INFP', 8), null, 'No guidance for unimplemented');
});

// Test getStrengths
console.log('\nTesting getStrengths():');
test('Returns strengths array', () => {
  const strengths = getStrengths('INFP', 4);
  assertArray(strengths, 'Is array');
  assertEqual(strengths.length, 6, 'Has 6 strengths');
});

test('Returns empty array for unimplemented', () => {
  const strengths = getStrengths('ESTJ', 5);
  assertArray(strengths, 'Is array');
  assertEqual(strengths.length, 0, 'Empty array');
});

// Test getChallenges
console.log('\nTesting getChallenges():');
test('Returns challenges array', () => {
  const challenges = getChallenges('INTJ', 5);
  assertArray(challenges, 'Is array');
  assertEqual(challenges.length, 6, 'Has 6 challenges');
});

// Test getGrowthPath
console.log('\nTesting getGrowthPath():');
test('Returns growth path object', () => {
  const growth = getGrowthPath('INFP', 4);
  assertTruthy(growth, 'Growth exists');
  assertTruthy(growth.integration.includes('Type 1'), 'Has integration');
  assertTruthy(growth.avoid.includes('Type 2'), 'Has avoid');
});

// Test getFamousExamples
console.log('\nTesting getFamousExamples():');
test('Returns famous examples array', () => {
  const examples = getFamousExamples('INTJ', 5);
  assertArray(examples, 'Is array');
  assertEqual(examples.length, 4, 'Has 4 examples');
  assertEqual(examples[0].name, 'Elon Musk', 'First example correct');
});

// Test isImplemented
console.log('\nTesting isImplemented():');
test('Returns true for INFP + 4', () => {
  assertEqual(isImplemented('INFP', 4), true, 'INFP+4 implemented');
});

test('Returns true for INTJ + 5', () => {
  assertEqual(isImplemented('INTJ', 5), true, 'INTJ+5 implemented');
});

test('Returns false for unimplemented', () => {
  assertEqual(isImplemented('ESTJ', 5), false, 'ESTJ+5 not implemented');
});

// Test getImplementedCombinations
console.log('\nTesting getImplementedCombinations():');
test('Returns array of implemented combinations', () => {
  const combinations = getImplementedCombinations();
  assertArray(combinations, 'Is array');
  assertTruthy(combinations.length >= 2, 'Has at least 2 combinations');
});

// Test getImplementationStats
console.log('\nTesting getImplementationStats():');
test('Returns correct statistics', () => {
  const stats = getImplementationStats();
  assertTruthy(stats.implemented >= 2, 'Has at least 2 implemented');
  assertEqual(stats.priority1Total, 36, 'Priority 1 total is 36');
  assertEqual(stats.totalPossible, 144, 'Total possible is 144');
});

// Summary
console.log('\n=====================================');
console.log('TEST RESULTS');
console.log('=====================================');
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total:  ${passed + failed}`);
console.log('=====================================');

if (failed > 0) {
  console.log('\n*** SOME TESTS FAILED ***');
  process.exit(1);
} else {
  console.log('\n*** ALL TESTS PASSED ***');
  console.log('\nPhase 1 Setup Complete!');
  console.log('\nImplementation Progress:');
  const stats = getImplementationStats();
  console.log(`  - ${stats.priority1Progress} Priority 1 combinations done`);
  console.log(`  - ${stats.percentComplete}% of Priority 1 complete`);
  console.log('\nImplemented combinations:');
  stats.combinations.forEach(c => {
    console.log(`  - ${c.mbti} + Type ${c.enneagram}: "${c.archetype}"`);
  });
  process.exit(0);
}
