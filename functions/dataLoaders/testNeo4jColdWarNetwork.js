/**
 * Test Script: Verify Cold War Constitutional Wisdom Network in Neo4j
 *
 * Run with: node functions/dataLoaders/testNeo4jColdWarNetwork.js
 */

const neo4j = require('neo4j-driver');
require('dotenv').config({ path: 'functions/.env' });

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error('\n❌ Neo4j credentials not found!');
  console.error('Set NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD in functions/.env');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function testColdWarNetwork() {
  const session = driver.session();

  console.log('\n========================================');
  console.log('  COLD WAR NETWORK - NEO4J VERIFICATION');
  console.log('========================================\n');

  try {
    // Test 1: Connection
    console.log('1. Testing connection...');
    await session.run('RETURN 1');
    console.log('   ✅ Connected to Neo4j!\n');

    // Test 2: Count Guest Profiles
    console.log('2. Checking Cold War figures...');
    const guestCount = await session.run(`
      MATCH (g:GuestProfile)
      WHERE g.id IN ['guest_ronald_reagan', 'guest_nancy_reagan', 'guest_margaret_thatcher', 'guest_mikhail_gorbachev']
      RETURN g.id as id, g.name as name, g.nickname as nickname, g.dayMaster as dayMaster,
             g.fire as fire, g.wood as wood, g.water as water, g.metal as metal, g.earth as earth
    `);

    if (guestCount.records.length === 0) {
      console.log('   ❌ NO Cold War figures found in Neo4j!\n');
      console.log('   → Run: node functions/dataLoaders/loadReaganToNeo4j.js');
      console.log('   → Run: node functions/dataLoaders/loadRelationshipNetworkToNeo4j.js\n');
    } else {
      console.log(`   ✅ Found ${guestCount.records.length}/4 Cold War figures:\n`);
      guestCount.records.forEach(r => {
        const elements = `Fire:${r.get('fire')||'?'} Wood:${r.get('wood')||'?'} Water:${r.get('water')||'?'} Metal:${r.get('metal')||'?'} Earth:${r.get('earth')||'?'}`;
        console.log(`      - ${r.get('name')} (${r.get('nickname')}) - ${r.get('dayMaster') || 'N/A'}`);
        console.log(`        Elements: ${elements}`);
      });
      console.log('');
    }

    // Test 3: Check Eras
    console.log('3. Checking eras...');
    const eraCount = await session.run(`
      MATCH (g:GuestProfile)-[:HAS_ERA]->(e:GuestEra)
      WHERE g.id IN ['guest_ronald_reagan', 'guest_nancy_reagan', 'guest_margaret_thatcher', 'guest_mikhail_gorbachev']
      RETURN g.name as guest, count(e) as eraCount, collect(e.eraTitle) as eras
    `);

    if (eraCount.records.length === 0) {
      console.log('   ⚠️ No eras found.\n');
    } else {
      console.log('   ✅ Eras found:\n');
      eraCount.records.forEach(r => {
        console.log(`      - ${r.get('guest')}: ${r.get('eraCount')} eras`);
        r.get('eras').forEach(era => console.log(`          • ${era}`));
      });
      console.log('');
    }

    // Test 4: Check Relationships
    console.log('4. Checking relationships...');
    const relationships = await session.run(`
      MATCH (a:GuestProfile)-[r]->(b:GuestProfile)
      WHERE a.id IN ['guest_ronald_reagan', 'guest_nancy_reagan', 'guest_margaret_thatcher', 'guest_mikhail_gorbachev']
        AND b.id IN ['guest_ronald_reagan', 'guest_nancy_reagan', 'guest_margaret_thatcher', 'guest_mikhail_gorbachev']
      RETURN a.name as from, type(r) as type, b.name as to,
             r.compatibility as compat, r.constitutionalDynamic as dynamic
    `);

    if (relationships.records.length === 0) {
      console.log('   ❌ No relationships found between Cold War figures!\n');
    } else {
      console.log(`   ✅ Found ${relationships.records.length} relationships:\n`);
      relationships.records.forEach(r => {
        const compat = r.get('compat') ? ` (${r.get('compat')}%)` : '';
        console.log(`      - ${r.get('from')} → ${r.get('to')}: ${r.get('type')}${compat}`);
        if (r.get('dynamic')) {
          console.log(`        Dynamic: "${r.get('dynamic')}"`);
        }
      });
      console.log('');
    }

    // Test 5: Check Events
    console.log('5. Checking events...');
    const events = await session.run(`
      MATCH (g:GuestProfile)-[:PARTICIPATED_IN|:DELIVERED]->(e:Event)
      WHERE g.id IN ['guest_ronald_reagan', 'guest_nancy_reagan', 'guest_margaret_thatcher', 'guest_mikhail_gorbachev']
      RETURN g.name as guest, count(e) as eventCount, collect(e.name)[0..5] as sampleEvents
    `);

    if (events.records.length === 0) {
      console.log('   ⚠️ No events found.\n');
    } else {
      console.log('   ✅ Events found:\n');
      events.records.forEach(r => {
        console.log(`      - ${r.get('guest')}: ${r.get('eventCount')} events`);
        r.get('sampleEvents').forEach(e => console.log(`          • ${e}`));
      });
      console.log('');
    }

    // Summary
    console.log('========================================');
    console.log('  SUMMARY');
    console.log('========================================\n');

    const allFigures = ['guest_ronald_reagan', 'guest_nancy_reagan', 'guest_margaret_thatcher', 'guest_mikhail_gorbachev'];
    const foundIds = guestCount.records.map(r => r.get('id'));
    const missing = allFigures.filter(id => !foundIds.includes(id));

    if (missing.length === 0 && relationships.records.length >= 6) {
      console.log('✅ Cold War Constitutional Wisdom Network: COMPLETE\n');
      console.log('   All 4 figures loaded with relationships.\n');
    } else {
      console.log('⚠️ Cold War Network: INCOMPLETE\n');
      if (missing.length > 0) {
        console.log(`   Missing figures: ${missing.join(', ')}`);
      }
      if (relationships.records.length < 6) {
        console.log(`   Expected 6 relationships, found ${relationships.records.length}`);
      }
      console.log('\n   To fix, run:');
      console.log('   → node functions/dataLoaders/loadReaganToNeo4j.js');
      console.log('   → node functions/dataLoaders/loadRelationshipNetworkToNeo4j.js\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n   Check your Neo4j credentials in functions/.env');
    }
  } finally {
    await session.close();
    await driver.close();
  }
}

testColdWarNetwork();
