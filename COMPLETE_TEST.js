/**
 * COMPLETE TEST - Tests all Four Pillars with your birth data
 */

import { calculateFourPillars } from './FULL_fourPillarsCalculator.js';

console.log('\n' + '═'.repeat(70));
console.log('🎯 COMPLETE FOUR PILLARS TEST');
console.log('═'.repeat(70));

// Your birth data
const birthDate = new Date(1963, 3, 23, 9, 25, 0); // April 23, 1963, 9:25 AM
const latitude = 33.5651;  // Rawalpindi
const longitude = 73.0169;

console.log('\n📅 BIRTH DATA:');
console.log('Date:', birthDate.toLocaleDateString());
console.log('Time:', birthDate.toLocaleTimeString());
console.log('Location:', latitude.toFixed(4) + '°N,', longitude.toFixed(4) + '°E');

// Calculate
const result = calculateFourPillars(birthDate, latitude, longitude);

console.log('\n' + '─'.repeat(70));
console.log('📊 FOUR PILLARS RESULT:');
console.log('─'.repeat(70));

console.log('\n🐰 YEAR PILLAR (5% weight):');
console.log(`   ${result.pillars.year.stem.chinese}${result.pillars.year.branch.chinese} (${result.pillars.year.stem.pinyin} ${result.pillars.year.branch.pinyin})`);
console.log(`   ${result.pillars.year.stem.english} ${result.pillars.year.branch.english}`);

console.log('\n🐉 MONTH PILLAR (10% weight):');
console.log(`   ${result.pillars.month.stem.chinese}${result.pillars.month.branch.chinese} (${result.pillars.month.stem.pinyin} ${result.pillars.month.branch.pinyin})`);
console.log(`   ${result.pillars.month.stem.english} ${result.pillars.month.branch.english}`);

console.log('\n🐂 DAY PILLAR (70% weight):');
console.log(`   ${result.pillars.day.stem.chinese}${result.pillars.day.branch.chinese} (${result.pillars.day.stem.pinyin} ${result.pillars.day.branch.pinyin})`);
console.log(`   ${result.pillars.day.stem.english} ${result.pillars.day.branch.english}`);

console.log('\n🐍 HOUR PILLAR (15% weight):');
console.log(`   ${result.pillars.hour.stem.chinese}${result.pillars.hour.branch.chinese} (${result.pillars.hour.stem.pinyin} ${result.pillars.hour.branch.pinyin})`);
console.log(`   ${result.pillars.hour.stem.english} ${result.pillars.hour.branch.english}`);
console.log(`   Solar Time: ${result.solarTime.toLocaleTimeString()}`);

console.log('\n' + '─'.repeat(70));
console.log('⚖️  FIVE ELEMENTS BALANCE:');
console.log('─'.repeat(70));
console.log('Wood:  ' + '█'.repeat(result.fiveElements.elements.Wood) + ' ' + result.fiveElements.elements.Wood + '%');
console.log('Fire:  ' + '█'.repeat(result.fiveElements.elements.Fire) + ' ' + result.fiveElements.elements.Fire + '%');
console.log('Earth: ' + '█'.repeat(result.fiveElements.elements.Earth) + ' ' + result.fiveElements.elements.Earth + '%');
console.log('Metal: ' + '█'.repeat(result.fiveElements.elements.Metal) + ' ' + result.fiveElements.elements.Metal + '%');
console.log('Water: ' + '█'.repeat(result.fiveElements.elements.Water) + ' ' + result.fiveElements.elements.Water + '%');
console.log('\nStrongest: ' + result.fiveElements.strongestElement);
console.log('Weakest: ' + result.fiveElements.weakestElement);
console.log('Balance: ' + result.fiveElements.balance);

console.log('\n' + '─'.repeat(70));
console.log('📜 TRADITIONAL FORMAT:');
console.log('─'.repeat(70));
console.log(result.traditional.display);
console.log(result.traditional.english);

console.log('\n' + '─'.repeat(70));
console.log('✅ VERIFICATION:');
console.log('─'.repeat(70));

const expectedHour = {
  stem: { chinese: '癸', pinyin: 'Guǐ', index: 9 },
  branch: { chinese: '巳', pinyin: 'Sì', index: 5 }
};

if (result.pillars.hour.stem.index === expectedHour.stem.index && 
    result.pillars.hour.branch.index === expectedHour.branch.index) {
  console.log('✅ SUCCESS! Hour Pillar is CORRECT!');
  console.log(`   Expected: ${expectedHour.stem.chinese}${expectedHour.branch.chinese} (${expectedHour.stem.pinyin} ${expectedHour.branch.pinyin})`);
  console.log(`   Got:      ${result.pillars.hour.stem.chinese}${result.pillars.hour.branch.chinese} (${result.pillars.hour.stem.pinyin} ${result.pillars.hour.branch.pinyin})`);
} else {
  console.log('❌ WRONG! Hour Pillar does not match!');
  console.log(`   Expected: ${expectedHour.stem.chinese}${expectedHour.branch.chinese} (index ${expectedHour.stem.index}, ${expectedHour.branch.index})`);
  console.log(`   Got:      ${result.pillars.hour.stem.chinese}${result.pillars.hour.branch.chinese} (index ${result.pillars.hour.stem.index}, ${result.pillars.hour.branch.index})`);
}

console.log('\n' + '═'.repeat(70));
console.log('');
