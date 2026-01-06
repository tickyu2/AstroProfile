/**
 * Test Script: Brain 1B Fact Extraction
 *
 * Tests the fact extraction engine with various message types
 * to verify the Person-Tie Rule and Life Structure extraction.
 *
 * Run: node functions/test/testBrain1BExtraction.js
 */

const { extractFacts, isTransientContent } = require('../memory/factExtractor');

// Test messages
const testCases = [
  // Should extract (relationships)
  { text: 'I had lunch with Sarah today', expected: true, reason: 'Mentions a person (Sarah)' },
  { text: 'Susan gave me a shirt to change', expected: true, reason: 'Mentions person + action' },
  { text: 'I fought with Steve today', expected: true, reason: 'Mentions person + conflict' },
  { text: 'My mom called me yesterday', expected: true, reason: 'Family relationship' },
  { text: 'Emily is my coworker at the bank', expected: true, reason: 'Relationship + work' },

  // Should extract (life structure)
  { text: 'I went to Falcon School', expected: true, reason: 'Education institution' },
  { text: 'I work at Microsoft', expected: true, reason: 'Employment' },
  { text: 'I graduated from Harvard University', expected: true, reason: 'Education' },
  { text: 'I live in San Francisco', expected: true, reason: 'Residence' },
  { text: 'I have diabetes', expected: true, reason: 'Health condition' },
  { text: "I'm allergic to peanuts", expected: true, reason: 'Allergy' },
  { text: "I'm learning to play piano", expected: true, reason: 'Learning/hobby' },
  { text: 'My passion is photography', expected: true, reason: 'Passion/interest' },

  // Should NOT extract (transient)
  { text: 'It is hot today', expected: false, reason: 'Weather - transient' },
  { text: 'lol thats funny', expected: false, reason: 'Filler phrase' },
  { text: 'hmm let me think', expected: false, reason: 'Thinking out loud' },
  { text: 'ok', expected: false, reason: 'Single word acknowledgment' },
  { text: 'yes', expected: false, reason: 'Single word response' },
  { text: 'hello', expected: false, reason: 'Greeting' },
  { text: 'How are you?', expected: false, reason: 'Question without facts' },
  { text: 'What do you think?', expected: false, reason: 'Question only' }
];

console.log('='.repeat(60));
console.log('BRAIN 1B FACT EXTRACTION TEST');
console.log('='.repeat(60));
console.log('');

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const result = extractFacts(testCase.text, 'brain3', { timestamp: new Date().toISOString() });
  const extracted = result.extracted && result.facts.length > 0;

  const status = extracted === testCase.expected ? 'PASS' : 'FAIL';
  const icon = status === 'PASS' ? '✓' : '✗';

  if (status === 'PASS') {
    passed++;
  } else {
    failed++;
  }

  console.log(`${icon} ${status} | "${testCase.text}"`);
  console.log(`  Expected: ${testCase.expected ? 'Extract' : 'Skip'} | Got: ${extracted ? 'Extract' : 'Skip'}`);
  console.log(`  Reason: ${testCase.reason}`);

  if (extracted) {
    const factSummary = result.facts.map(f =>
      `${f.category}: ${f.name || f.value || f.type}`
    ).join(', ');
    console.log(`  Facts: ${factSummary}`);
  }
  console.log('');
}

console.log('='.repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log(`Success rate: ${Math.round(passed / (passed + failed) * 100)}%`);
console.log('='.repeat(60));

// Exit with error code if tests failed
process.exit(failed > 0 ? 1 : 0);
