/**
 * TEST SCRIPT WITH DEBUG OUTPUT
 * Shows every step of Hour Pillar calculation
 */

import { calculateSimple } from './fourPillars_DEBUG_V2.js';

console.log('');
console.log('╔' + '═'.repeat(68) + '╗');
console.log('║' + ' '.repeat(20) + 'TICKY\'S BIRTH DATA TEST' + ' '.repeat(25) + '║');
console.log('╚' + '═'.repeat(68) + '╝');
console.log('');

const result = calculateSimple(
  '1963-04-23',  // April 23, 1963
  '09:25',       // 9:25 AM
  33.5651,       // Rawalpindi latitude
  73.0169        // Rawalpindi longitude
);

console.log('\n📊 FINAL RESULT OBJECT:');
console.log(JSON.stringify(result, null, 2));

console.log('\n🎓 EXPECTED RESULT:');
console.log('Hour Pillar: 癸巳 (Guǐ Sì - Yin Water Snake)');
console.log('Hour Stem: 癸 (Guǐ) - index 9');
console.log('Hour Branch: 巳 (Sì) - index 5');

console.log('\n✅ VERIFICATION:');
if (result.stem.index === 9 && result.branch.index === 5) {
  console.log('SUCCESS! ✅ Hour Pillar is CORRECT!');
  console.log('Result:', result.stem.chinese + result.branch.chinese);
} else {
  console.log('WRONG! ❌');
  console.log('Expected: Stem index 9, Branch index 5');
  console.log('Got: Stem index ' + result.stem.index + ', Branch index ' + result.branch.index);
  console.log('Result:', result.stem.chinese + result.branch.chinese);
}

console.log('\n' + '─'.repeat(70));
console.log('');
