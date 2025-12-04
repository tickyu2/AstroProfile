/**
 * DEBUG SCRIPT - What's actually in your HOUR_STEM_TABLE?
 */

console.log('='.repeat(70));
console.log('🔍 DEBUGGING HOUR_STEM_TABLE');
console.log('='.repeat(70));

// Try to read the file directly
import fs from 'fs';
const fileContent = fs.readFileSync('./src/utils/fourPillarsCalculator.js', 'utf-8');

// Find the HOUR_STEM_TABLE
const tableMatch = fileContent.match(/const HOUR_STEM_TABLE = \{([^}]+)\}/s);

if (tableMatch) {
  console.log('\n📋 FOUND HOUR_STEM_TABLE IN YOUR FILE:\n');
  console.log('const HOUR_STEM_TABLE = {' + tableMatch[1] + '}');
  
  // Extract row 2 specifically
  const row2Match = fileContent.match(/2:\s*\[([^\]]+)\]/);
  if (row2Match) {
    console.log('\n🎯 ROW 2 (Xin day - YOUR ROW):');
    console.log('2: [' + row2Match[1] + ']');
    
    // Parse it
    const row2Array = row2Match[1].split(',').map(n => parseInt(n.trim()));
    console.log('\n📊 ROW 2 AS ARRAY:');
    console.log(row2Array);
    
    console.log('\n🔍 POSITION 5 (Snake hour):');
    console.log(`Value: ${row2Array[5]}`);
    
    if (row2Array[5] === 9) {
      console.log('✅ CORRECT! Position 5 = 9 (Gui)');
    } else {
      console.log(`❌ WRONG! Position 5 = ${row2Array[5]} (should be 9)`);
      console.log('\n🔧 YOUR ROW 2 IS CORRUPT!');
    }
    
    // Show what it SHOULD be
    console.log('\n✅ CORRECT ROW 2 SHOULD BE:');
    console.log('2: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5]');
    console.log('     0  1  2  3  4  5  6  7  8  9 10 11  ← positions');
    console.log('                    ↑');
    console.log('              position 5 = 9');
  }
} else {
  console.log('\n❌ COULD NOT FIND HOUR_STEM_TABLE IN FILE!');
  console.log('Are you sure the file is in src/utils/fourPillarsCalculator.js?');
}

console.log('\n' + '='.repeat(70));
