/**
 * TABLE VERIFICATION SCRIPT
 * Run this FIRST to verify the HOUR_STEM_TABLE is correct
 */

import { HEAVENLY_STEMS } from './src/utils/fourPillarsCalculator.js';

// This is what the table SHOULD be:
const CORRECT_HOUR_STEM_TABLE = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
  1: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
  2: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
  3: [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
  4: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
};

console.log('='.repeat(70));
console.log('🔍 VERIFYING HOUR_STEM_TABLE');
console.log('='.repeat(70));

// Import the actual table from your file
import { calculateFourPillars } from './src/utils/fourPillarsCalculator.js';

// Test the specific case: Xin day, Snake hour
const testDate = new Date(1963, 3, 23, 9, 25, 0);
const result = calculateFourPillars(testDate, 33.5651, 73.0169);

console.log('\n📊 YOUR TABLE CHECK:');
console.log('─'.repeat(70));

// Check row 2, position 5 (Xin day, Snake hour)
const dayStemGroup = 2; // Xin (index 7) % 5
const hourBranchIndex = 5; // Snake
const expectedStemIndex = 9; // Gui (癸)
const actualStemIndex = result.pillars.hour.stem.index;

console.log(`Day Stem Group: ${dayStemGroup} (Xin day)`);
console.log(`Hour Branch Index: ${hourBranchIndex} (Snake)`);
console.log(`\nExpected Stem Index: ${expectedStemIndex} (Gui 癸)`);
console.log(`Actual Stem Index: ${actualStemIndex} (${result.pillars.hour.stem.name})`);

if (actualStemIndex === expectedStemIndex) {
  console.log('\n✅ TABLE IS CORRECT!');
  console.log('✅ Ready to run full test!');
  console.log('\nRun: node test_hour_pillar.js');
} else {
  console.log('\n❌ TABLE IS STILL WRONG!');
  console.log('\n🔧 WHAT TO DO:');
  console.log('1. DELETE your current fourPillarsCalculator.js');
  console.log('2. Download fourPillarsCalculator_FINAL_VERSION.js');
  console.log('3. Rename it to fourPillarsCalculator.js');
  console.log('4. Run this verification script again');
  
  console.log('\n📋 CORRECT TABLE ROW 2 SHOULD BE:');
  console.log('2: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5]');
  console.log('     0  1  2  3  4  5  6  7  8  9  10 11  ← positions');
  console.log('                    ↑');
  console.log('              position 5 = 9 (Gui)');
}

console.log('\n' + '='.repeat(70));
