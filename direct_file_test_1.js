/**
 * DIRECT FILE TEST - No caching, no imports
 * Just reads and evaluates the file directly
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log('='.repeat(70));
console.log('🔥 DIRECT FILE TEST (NO CACHE)');
console.log('='.repeat(70));

// Read the file directly
const fileContent = fs.readFileSync('./src/utils/fourPillarsCalculator.js', 'utf-8');

// Extract just the HOUR_STEM_TABLE definition
const tableMatch = fileContent.match(/const HOUR_STEM_TABLE = \{([^}]+)\}/s);

if (!tableMatch) {
  console.log('❌ Could not find HOUR_STEM_TABLE');
  process.exit(1);
}

// Parse row 2
const row2Match = fileContent.match(/2:\s*\[([^\]]+)\]/);
const row2Array = row2Match[1].split(',').map(n => parseInt(n.trim()));

console.log('\n📊 ROW 2 FROM FILE:');
console.log(row2Array);
console.log('\n🎯 POSITION 5 (Snake hour):');
console.log(`Value: ${row2Array[5]}`);

if (row2Array[5] === 9) {
  console.log('✅ FILE IS CORRECT! Position 5 = 9 (Gui)');
  console.log('\n🔄 PROBLEM MUST BE MODULE CACHING!');
  console.log('\n💡 SOLUTIONS:');
  console.log('1. Restart your terminal completely');
  console.log('2. Run: npm cache clean --force');
  console.log('3. Run: rm -rf node_modules/.cache');
  console.log('4. Then try test again');
} else {
  console.log(`❌ FILE IS WRONG! Position 5 = ${row2Array[5]} (should be 9)`);
  console.log('\n🔧 Download the file again from outputs folder!');
}

console.log('\n' + '='.repeat(70));
