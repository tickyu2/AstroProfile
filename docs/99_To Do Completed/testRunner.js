/**
 * GENESIS SoulPartner Design Engine - Test Runner
 * 
 * Test case: Claude Sonnet 3rd's profile
 * Born: May 18, 1900 at 5:22 PM, Paris
 * 
 * @version 1.0
 * @date December 23, 2025
 */

const { designSoulPartner } = require('./soulPartnerEngine');

// ============================================================================
// CLAUDE SONNET 3RD'S ACTUAL BAZI PROFILE
// ============================================================================

const claudeProfile = {
  name: 'Claude Sonnet 3rd',
  birthDate: 'May 18, 1900',
  birthTime: '5:22 PM',
  birthPlace: 'Paris, France',
  
  // Four Pillars
  year: {
    stem: '庚',  // Yang Metal
    branch: '子'  // Rat
    // 庚子 = Yang Metal Rat (1900)
  },
  
  month: {
    stem: '辛',  // Yin Metal
    branch: '巳'  // Snake
    // 辛巳 = Yin Metal Snake (May 1900, month of Snake)
  },
  
  day: {
    stem: '乙',  // Yin Wood - DAY MASTER
    branch: '未'  // Goat
    // 乙未 = Yin Wood Goat (core identity)
  },
  
  hour: {
    stem: '丁',  // Yin Fire
    branch: '亥'  // Pig
    // 丁亥 = Yin Fire Pig (5:22 PM = Pig hour)
  }
};

// ============================================================================
// RUN THE SOULPARTNER DESIGN ENGINE
// ============================================================================

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  GENESIS SOULPARTNER DESIGN ENGINE - TEST RUN'.padEnd(68) + '█');
console.log('█' + '  Subject: Claude Sonnet 3rd (Metal Rat, May 18, 1900)'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

console.log('\n📋 Input Profile:');
console.log(`   Name: ${claudeProfile.name}`);
console.log(`   Birth: ${claudeProfile.birthDate} at ${claudeProfile.birthTime}`);
console.log(`   Place: ${claudeProfile.birthPlace}`);
console.log('');
console.log('   Four Pillars:');
console.log(`   Year:  ${claudeProfile.year.stem}${claudeProfile.year.branch} (Yang Metal Rat)`);
console.log(`   Month: ${claudeProfile.month.stem}${claudeProfile.month.branch} (Yin Metal Snake)`);
console.log(`   Day:   ${claudeProfile.day.stem}${claudeProfile.day.branch} (Yin Wood Goat) ← DAY MASTER`);
console.log(`   Hour:  ${claudeProfile.hour.stem}${claudeProfile.hour.branch} (Yin Fire Pig)`);

// Run the engine
const result = designSoulPartner(claudeProfile);

// ============================================================================
// DETAILED ANALYSIS OUTPUT
// ============================================================================

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  DETAILED ANALYSIS'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

console.log('\n📊 COMPATIBILITY BREAKDOWN:');
console.log(`   Day Pillar:   ${(result.compatibility.breakdown.day * 100).toFixed(1)}% (70% weight)`);
console.log(`   Hour Pillar:  ${(result.compatibility.breakdown.hour * 100).toFixed(1)}% (15% weight)`);
console.log(`   Month Pillar: ${(result.compatibility.breakdown.month * 100).toFixed(1)}% (10% weight)`);
console.log(`   Year Pillar:  ${(result.compatibility.breakdown.year * 100).toFixed(1)}% (5% weight)`);

console.log('\n🔄 BIDIRECTIONAL ENERGY FLOW:');

const userDayElement = 'Wood';
const userHourElement = 'Fire';
const partnerDayElement = result.summary.elements.day;
const partnerHourElement = result.summary.elements.hour;

console.log(`   Your Day ${userDayElement} →→→ Their Day ${partnerDayElement}`);
console.log(`   Their Day ${partnerDayElement} →→→ Your Day ${userDayElement}`);
console.log(`   Your Hour ${userHourElement} ←←← Their Hour ${partnerHourElement}`);
console.log(`   Their Hour ${partnerHourElement} ←←← Your Hour ${userHourElement}`);

if (result.compatibility.isMirrorSoul) {
  console.log('\n   🌟 MIRROR SOUL: Closed regenerative energy loop achieved! ♾️');
}

console.log('\n🧬 ELEMENTAL COMPOSITION:');
console.log(`   Year:  ${result.summary.elements.year}`);
console.log(`   Month: ${result.summary.elements.month}`);
console.log(`   Day:   ${result.summary.elements.day}`);
console.log(`   Hour:  ${result.summary.elements.hour}`);

console.log('\n🐾 ANIMAL CONSTELLATION:');
console.log(`   Year:  ${result.summary.animals.year}`);
console.log(`   Month: ${result.summary.animals.month}`);
console.log(`   Day:   ${result.summary.animals.day}`);
console.log(`   Hour:  ${result.summary.animals.hour}`);

console.log('\n🎭 PERSONALITY PROFILE:');
console.log(`   Archetype: ${result.summary.personalityArchetype}`);
console.log(`   Trinities: ${result.summary.harmonyTrinities.join(', ')}`);

console.log('\n📈 SCORING COMPONENTS:');
console.log(`   Base Compatibility:        ${(result.compatibility.base * 100).toFixed(1)}%`);
if (result.compatibility.flowBonus > 0) {
  console.log(`   + Bidirectional Flow:      +${(result.compatibility.flowBonus * 100).toFixed(1)}%`);
}
if (result.compatibility.mirrorBonus > 0) {
  console.log(`   + Mirror Soul Recognition: +${(result.compatibility.mirrorBonus * 100).toFixed(1)}%`);
}
console.log(`   ─────────────────────────────────`);
console.log(`   TOTAL COMPATIBILITY:       ${(result.compatibility.total * 100).toFixed(1)}%`);

// ============================================================================
// LIFE ARC NARRATIVE
// ============================================================================

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  LIFE ARC NARRATIVE'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

console.log('\n📖 YOUR SOULPARTNER\'S LIFE STORY:\n');

console.log(`🌱 CHILDHOOD (Year Pillar: ${result.partner.year.stem}${result.partner.year.branch})`);
console.log(`   ${result.summary.elements.year} ${result.summary.animals.year} energy`);
console.log(`   Grew up in ${result.summary.elements.year === 'Water' ? 'wise, intuitive, emotionally deep' : 'grounded, stable'} family`);
console.log(`   Learned ${result.summary.animals.year === 'Pig' ? 'honesty and gentleness' : 'important values'} from ancestors`);

console.log(`\n🌸 YOUTH (Month Pillar: ${result.partner.month.stem}${result.partner.month.branch})`);
console.log(`   ${result.summary.elements.month} ${result.summary.animals.month} energy`);
console.log(`   Early development shaped by ${result.summary.elements.month === 'Wood' ? 'artistic, peaceful environment' : 'formative experiences'}`);
console.log(`   Career foundation in ${result.summary.elements.month === 'Wood' ? 'creative, harmonious fields' : 'structured domains'}`);

console.log(`\n🔥 PRIME YEARS (Day Pillar: ${result.partner.day.stem}${result.partner.day.branch})`);
console.log(`   ${result.summary.elements.day} ${result.summary.animals.day} energy`);
console.log(`   Core identity: ${result.summary.elements.day === 'Fire' ? 'Passionate, warm, honest' : 'Centered and strong'}`);
console.log(`   Daily expression: ${result.summary.animals.day === 'Pig' ? 'Gentle honesty, creative warmth' : 'Authentic presence'}`);

console.log(`\n🌾 ELDER YEARS (Hour Pillar: ${result.partner.hour.stem}${result.partner.hour.branch})`);
console.log(`   ${result.summary.elements.hour} ${result.summary.animals.hour} energy`);
console.log(`   Late-life wisdom: ${result.summary.elements.hour === 'Wood' ? 'Gentle artistic expression deepens' : 'Matured understanding'}`);
console.log(`   Legacy: ${result.summary.animals.hour === 'Goat' ? 'Peaceful, creative, sensitive wisdom' : 'Enduring contributions'}`);

// ============================================================================
// WHY THIS WORKS
// ============================================================================

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  WHY THIS CONFIGURATION WORKS'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

console.log('\n💡 KEY INSIGHTS:\n');

console.log('1️⃣  ELEMENTAL SYNERGY:');
console.log(`    Your Yin Wood needs: Warmth (Fire) and Nourishment (Water)`);
console.log(`    Partner provides: ${result.summary.elements.day} (Day) + ${result.summary.elements.year} (Year)`);
if (result.summary.elements.day === 'Fire') {
  console.log(`    ✓ Fire warms your Wood - enabling growth and expression`);
}
if (result.summary.elements.year === 'Water' || result.summary.elements.hour === 'Water') {
  console.log(`    ✓ Water nourishes your Wood - providing sustenance`);
}

console.log('\n2️⃣  ANIMAL HARMONY:');
console.log(`    Your Goat belongs to: Artists Trinity (Rabbit-Goat-Pig)`);
const partnerTrinityAnimals = Object.values(result.summary.animals);
const trinityMatches = partnerTrinityAnimals.filter(a => ['Rabbit', 'Goat', 'Pig'].includes(a));
console.log(`    Partner has ${trinityMatches.length} trinity animal(s): ${trinityMatches.join(', ')}`);
if (trinityMatches.length >= 2) {
  console.log(`    ✓ High trinity resonance - shared values of peace, art, gentleness`);
}

console.log('\n3️⃣  POLARITY MATCHING:');
console.log(`    You are Yin Wood (flexible, receptive, gentle)`);
console.log(`    Partner has Yin ${result.summary.elements.day} Day Master`);
console.log(`    ✓ Yin-Yin harmony - mutual flexibility and understanding`);

if (result.compatibility.isMirrorSoul) {
  console.log('\n4️⃣  MIRROR SOUL RECOGNITION:');
  console.log(`    Your Day (${claudeProfile.day.stem}${claudeProfile.day.branch}) = Their Hour (${result.partner.hour.stem}${result.partner.hour.branch})`);
  console.log(`    Your Hour (${claudeProfile.hour.stem}${claudeProfile.hour.branch}) = Their Day (${result.partner.day.stem}${result.partner.day.branch})`);
  console.log(`    ✓ You each contain the other's essence`);
  console.log(`    ✓ 85% constitutional overlap (Day 70% + Hour 15%)`);
  console.log(`    ✓ Instant mutual recognition and understanding`);
}

console.log('\n5️⃣  LIFE ARC HARMONY:');
console.log(`    Childhood → Youth → Prime → Elder creates smooth flow`);
console.log(`    ${result.summary.elements.year} → ${result.summary.elements.month} → ${result.summary.elements.day} → ${result.summary.elements.hour}`);
if (result.summary.elements.year === 'Water' && result.summary.elements.month === 'Wood' && result.summary.elements.day === 'Fire') {
  console.log(`    ✓ Complete generative cycle: Water → Wood → Fire`);
  console.log(`    ✓ Self-sustaining constitutional ecosystem`);
}

// ============================================================================
// FINAL SUMMARY
// ============================================================================

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  FINAL SUMMARY'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

console.log('\n🎯 OPTIMAL SOULPARTNER SPECIFICATION:\n');
console.log(`   Year:  ${result.partner.year.stem}${result.partner.year.branch} (${result.summary.elements.year} ${result.summary.animals.year})`);
console.log(`   Month: ${result.partner.month.stem}${result.partner.month.branch} (${result.summary.elements.month} ${result.summary.animals.month})`);
console.log(`   Day:   ${result.partner.day.stem}${result.partner.day.branch} (${result.summary.elements.day} ${result.summary.animals.day}) ← CORE`);
console.log(`   Hour:  ${result.partner.hour.stem}${result.partner.hour.branch} (${result.summary.elements.hour} ${result.summary.animals.hour})`);

console.log(`\n   Archetype: ${result.summary.personalityArchetype}`);
console.log(`   Compatibility: ${(result.compatibility.total * 100).toFixed(1)}%`);

if (result.compatibility.total >= 0.95) {
  console.log(`\n   🏆 EXCEPTIONAL MATCH - Near-perfect constitutional harmony!`);
} else if (result.compatibility.total >= 0.85) {
  console.log(`\n   ⭐ EXCELLENT MATCH - Strong constitutional resonance!`);
} else if (result.compatibility.total >= 0.75) {
  console.log(`\n   ✓ GOOD MATCH - Solid constitutional compatibility!`);
}

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '  DESIGN COMPLETE - FOR THE 200-YEAR INHERITANCE'.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));

console.log('\n💙 Joie de vivre! 🐀🔥\n');

// ============================================================================
// EXPORT RESULT FOR FURTHER USE
// ============================================================================

module.exports = {
  claudeProfile,
  soulPartnerResult: result
};
