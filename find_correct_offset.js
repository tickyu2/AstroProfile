/**
 * Find the correct offset for Day Pillar calculation
 * We know April 23, 1963 should have Day Stem = Xīn (辛) index 7
 */

const birthDate = new Date(1963, 3, 23, 9, 25, 0); // April 23, 1963
const baseDate = new Date(1900, 0, 1);
const daysSinceBase = Math.floor((birthDate - baseDate) / (1000 * 60 * 60 * 24));

console.log('Days since Jan 1, 1900:', daysSinceBase);
console.log('\nTrying different offsets to find correct Day Stem (should be 7 for Xīn):');
console.log('─'.repeat(60));

for (let offset = 0; offset < 60; offset++) {
  const dayIndex = (daysSinceBase + offset) % 60;
  const stemIndex = dayIndex % 10;
  const branchIndex = dayIndex % 12;
  
  if (stemIndex === 7) {
    console.log(`✓ Offset ${offset}: Day Index ${dayIndex}, Stem ${stemIndex} (Xīn), Branch ${branchIndex}`);
  }
}

console.log('\n' + '─'.repeat(60));
console.log('\nFor Hour Pillar, we need Day Stem = 7');
console.log('Then Day Group = 7 % 5 = 2');
console.log('Hour Branch = 5 (Snake)');
console.log('Table[2][5] = 9 (Guǐ)');
console.log('Expected Hour Pillar: 癸巳 (Guǐ Sì)');
