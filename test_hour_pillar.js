/**
 * TEST FILE - Verify Hour Pillar Fix
 * Run this to make sure the fix works with your birth data
 */

import { calculateFourPillars, HEAVENLY_STEMS, EARTHLY_BRANCHES } from './src/utils/fourPillarsCalculator.js';

console.log('='.repeat(70));
console.log('🧪 TESTING HOUR PILLAR FIX');
console.log('='.repeat(70));

// Your birth data: April 23, 1963, 9:25 AM, Rawalpindi, Pakistan
const birthDate = new Date(1963, 3, 23, 9, 25, 0); // Month is 0-indexed (3 = April)
const latitude = 33.5651;
const longitude = 73.0169;

console.log('\n📅 INPUT DATA:');
console.log(`   Birth Date: April 23, 1963`);
console.log(`   Birth Time: 9:25 AM`);
console.log(`   Location: Rawalpindi, Pakistan`);
console.log(`   Coordinates: ${latitude}°N, ${longitude}°E`);

console.log('\n⏳ Calculating Four Pillars...\n');

const result = calculateFourPillars(birthDate, latitude, longitude);

console.log('📊 RESULTS:');
console.log('─'.repeat(70));

console.log(`\n   Year Pillar:  ${result.pillars.year.fullName} (${result.pillars.year.englishName})`);
console.log(`   Month Pillar: ${result.pillars.month.fullName} (${result.pillars.month.englishName})`);
console.log(`   Day Pillar:   ${result.pillars.day.fullName} (${result.pillars.day.englishName}) ⭐`);
console.log(`   Hour Pillar:  ${result.pillars.hour.fullName} (${result.pillars.hour.englishName})`);

console.log('\n🎯 HOUR PILLAR DETAILS:');
console.log('─'.repeat(70));
console.log(`   Clock Time: ${result.pillars.hour.clockTime.formatted}`);
console.log(`   Solar Time: ${result.pillars.hour.solarTime.formatted}`);
console.log(`   Longitude Correction: ${result.pillars.hour.solarTime.longitudeCorrection} min`);
console.log(`   EOT Correction: ${result.pillars.hour.solarTime.eotCorrection} min`);
console.log(`   Total Offset: ${result.pillars.hour.solarTime.offsetMinutes} min`);

console.log('\n🔍 VERIFICATION:');
console.log('─'.repeat(70));
console.log(`   Expected: 癸巳 (Gui Si - Yin Water Snake)`);
console.log(`   Got:      ${result.pillars.hour.fullName} (${result.pillars.hour.englishName})`);

const stemCorrect = result.pillars.hour.stem.pinyin === 'Guǐ';
const branchCorrect = result.pillars.hour.branch.animal === 'Snake';
const isCorrect = stemCorrect && branchCorrect;

if (isCorrect) {
  console.log('\n   ✅ SUCCESS! Hour Pillar is CORRECT!');
  console.log('   ✅ The fix is working properly!');
} else {
  console.log('\n   ❌ ERROR! Hour Pillar is still WRONG!');
  console.log(`   ❌ Stem: ${stemCorrect ? 'Correct ✓' : 'Wrong ✗'}`);
  console.log(`   ❌ Branch: ${branchCorrect ? 'Correct ✓' : 'Wrong ✗'}`);
}

console.log('\n📈 ELEMENT BALANCE:');
console.log('─'.repeat(70));
Object.entries(result.elementalBalance.elements).forEach(([element, count]) => {
  const percentage = Math.round((count / 12) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 5));
  console.log(`   ${element.padEnd(6)}: ${count.toString().padStart(2)} (${percentage.toString().padStart(2)}%) ${bar}`);
});

console.log('\n🎭 YIN/YANG BALANCE:');
console.log('─'.repeat(70));
console.log(`   Yin:  ${result.yinYangBalance.yin}  (${result.yinYangBalance.yinPercentage}%)`);
console.log(`   Yang: ${result.yinYangBalance.yang} (${result.yinYangBalance.yangPercentage}%)`);
console.log(`   Balance: ${result.yinYangBalance.balance}`);

console.log('\n' + '='.repeat(70));
console.log('✅ TEST COMPLETE');
console.log('='.repeat(70) + '\n');

// Exit with appropriate code
process.exit(isCorrect ? 0 : 1);
