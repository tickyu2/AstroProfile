/**
 * Swiss Ephemeris Test - GOLD STANDARD Verification
 *
 * Test case: May 18, 1900, 17:22, Paris
 * This date should match Astro.com calculations
 *
 * To run: node test/swissEphemerisTest.js
 */

const swissEphemeris = require('../ephemeris/swissEphemerisService');

async function testSwissEphemeris() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  GENESIS SOVEREIGN v3.0 - Swiss Ephemeris GOLD STANDARD Test');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Test case: May 18, 1900, 17:22, Paris, France
  const testCase = {
    year: 1900,
    month: 5,
    day: 18,
    hour: 17,
    minute: 22,
    latitude: 48.8566,   // Paris
    longitude: 2.3522,   // Paris
    timezone: 0          // Paris Mean Time (pre-timezone era)
  };

  console.log('Test Case:', testCase);
  console.log('\n─────────────────────────────────────────────────────────────────\n');

  try {
    // Initialize Swiss Ephemeris
    console.log('🌟 Initializing Swiss Ephemeris...');
    await swissEphemeris.initSwissEphemeris();
    console.log('✅ Swiss Ephemeris initialized!\n');

    // Calculate full chart
    console.log('📊 Calculating full birth chart...');
    const chart = await swissEphemeris.calculateFullChart(testCase);

    // Display results
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  CALCULATION RESULTS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📍 METADATA:');
    console.log(`   Engine: ${chart.meta.calculationEngine}`);
    console.log(`   Precision: ${chart.meta.precision}`);
    console.log(`   Julian Day: ${chart.meta.julianDay}`);
    console.log(`   House System: ${chart.meta.houseSystem}`);

    console.log('\n🌅 ANGLES:');
    console.log(`   Ascendant (Rising): ${chart.houses.angles.ascendant.formatted}`);
    console.log(`   Midheaven (MC): ${chart.houses.angles.midheaven.formatted}`);
    console.log(`   Descendant: ${chart.houses.angles.descendant.formatted}`);
    console.log(`   IC: ${chart.houses.angles.imumCoeli.formatted}`);

    console.log('\n☀️ PLANETARY POSITIONS:');
    for (const [key, planet] of Object.entries(chart.planets)) {
      if (planet && planet.formatted) {
        const retrograde = planet.isRetrograde ? ' (R)' : '';
        console.log(`   ${planet.planet.padEnd(12)}: ${planet.formatted}${retrograde}`);
      }
    }

    console.log('\n🏠 HOUSE CUSPS (Placidus):');
    for (const house of chart.houses.houses) {
      const planets = house.planets?.length > 0
        ? ` [${house.planets.map(p => p.name).join(', ')}]`
        : '';
      console.log(`   House ${house.house.toString().padStart(2)}: ${house.formatted}${planets}`);
    }

    console.log('\n🔮 ELEMENT DISTRIBUTION:');
    console.log(`   Fire: ${chart.elements.Fire} | Earth: ${chart.elements.Earth} | Air: ${chart.elements.Air} | Water: ${chart.elements.Water}`);

    console.log('\n⚡ MODALITY DISTRIBUTION:');
    console.log(`   Cardinal: ${chart.modalities.Cardinal} | Fixed: ${chart.modalities.Fixed} | Mutable: ${chart.modalities.Mutable}`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  EXPECTED VALUES (from Astro.com for May 18, 1900, 17:22, Paris)');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('   Sun: ~27° Taurus');
    console.log('   Moon: ~Cancer or Leo (depends on exact time)');
    console.log('   Ascendant: ~Libra (for late afternoon Paris)');
    console.log('\n   Please verify these against astro.com for exact values!');

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ SWISS EPHEMERIS TEST COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');

    return chart;

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test
testSwissEphemeris()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
