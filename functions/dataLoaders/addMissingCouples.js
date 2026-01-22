/**
 * Add Missing Couple Nodes to Neo4j
 * - Reagan Couple (98% compatibility)
 * - Obama Couple (87% compatibility)
 *
 * Run with: node functions/dataLoaders/addMissingCouples.js
 */

const neo4j = require('neo4j-driver');
require('dotenv').config({ path: 'functions/.env' });

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function addMissingCouples() {
  const session = driver.session();
  try {
    console.log('========================================');
    console.log('ADDING MISSING COUPLE NODES');
    console.log('========================================\n');

    // 1. Create Reagan Couple Profile
    console.log('Creating Reagan Couple Profile...');
    await session.run(`
      MATCH (p1:GuestProfile {id: 'guest_ronald_reagan'})
      MATCH (p2:GuestProfile {id: 'guest_nancy_reagan'})
      MERGE (c:CoupleProfile {id: 'couple_ronald_nancy_reagan'})
      SET c.name = 'Ronald & Nancy Reagan',
          c.displayName = 'Ronald & Nancy Reagan',
          c.tagline = 'The Love Story That Shaped History',
          c.marriageDate = '1952-03-04',
          c.yearsMarried = 52,
          c.compatibilityScore = 98,
          c.dynamicType = 'Protective Harmony',
          c.dynamicDescription = 'Water protects Fire, Fire warms Water - smooth, protective, warm',
          c.sharedValues = ['Love above all', 'Political partnership', 'Unwavering devotion', 'Traditional values'],
          c.historicalSignificance = ['52-year legendary love story', 'She protected him fiercely', 'His letters to her are love poetry', 'Power couple that reshaped America'],
          c.updatedAt = datetime()
      MERGE (c)-[:INCLUDES]->(p1)
      MERGE (c)-[:INCLUDES]->(p2)
      RETURN c.id as id
    `);
    console.log('  ✓ Reagan Couple Profile created (98% compatibility)');

    // 2. Update Reagan MARRIED_TO relationship with compatibility
    console.log('Updating Reagan marriage relationship...');
    await session.run(`
      MATCH (p1:GuestProfile {id: 'guest_ronald_reagan'})-[r:MARRIED_TO]->(p2:GuestProfile {id: 'guest_nancy_reagan'})
      SET r.compatibilityScore = 98,
          r.yearsMarried = 52,
          r.dynamicType = 'Protective Harmony',
          r.updatedAt = datetime()
      RETURN r.compatibilityScore as score
    `);
    console.log('  ✓ Reagan marriage updated to 98%');

    // 3. Create Obama Couple Profile
    console.log('Creating Obama Couple Profile...');
    await session.run(`
      MATCH (p1:GuestProfile {id: 'guest_barack_obama'})
      MATCH (p2:GuestProfile {id: 'guest_michelle_obama'})
      MERGE (c:CoupleProfile {id: 'couple_barack_michelle_obama'})
      SET c.name = 'Barack & Michelle Obama',
          c.displayName = 'Barack & Michelle Obama',
          c.tagline = 'The Power Partnership',
          c.marriageDate = '1992-10-03',
          c.yearsMarried = 33,
          c.compatibilityScore = 87,
          c.dynamicType = 'Dynamic Growth',
          c.dynamicDescription = 'Fire activates Wood, Wood feeds Fire - passionate, growing, transformative',
          c.sharedValues = ['Family first', 'Service to community', 'Education', 'Hope and change'],
          c.historicalSignificance = ['First Black First Family', 'Modern power couple model', 'Becoming movement', 'Post-presidency influence'],
          c.updatedAt = datetime()
      MERGE (c)-[:INCLUDES]->(p1)
      MERGE (c)-[:INCLUDES]->(p2)
      RETURN c.id as id
    `);
    console.log('  ✓ Obama Couple Profile created (87% compatibility)');

    // 4. Update Obama MARRIED_TO relationship with compatibility
    console.log('Updating Obama marriage relationship...');
    await session.run(`
      MATCH (p1:GuestProfile {id: 'guest_barack_obama'})-[r:MARRIED_TO]->(p2:GuestProfile {id: 'guest_michelle_obama'})
      SET r.compatibilityScore = 87,
          r.yearsMarried = 33,
          r.dynamicType = 'Dynamic Growth',
          r.updatedAt = datetime()
      RETURN r.compatibilityScore as score
    `);
    console.log('  ✓ Obama marriage updated to 87%');

    // Verification
    console.log('\n========================================');
    console.log('VERIFICATION');
    console.log('========================================');

    const couples = await session.run('MATCH (c:CoupleProfile) RETURN c.name, c.compatibilityScore, c.yearsMarried ORDER BY c.compatibilityScore DESC');
    console.log('\nCouple Profiles:');
    couples.records.forEach(r => {
      console.log('  -', r.get('c.name'), '|', r.get('c.compatibilityScore') + '%', '|', r.get('c.yearsMarried'), 'years');
    });

    const marriages = await session.run('MATCH (p1)-[r:MARRIED_TO]->(p2) RETURN p1.name, p2.name, r.compatibilityScore ORDER BY r.compatibilityScore DESC');
    console.log('\nMarriages:');
    marriages.records.forEach(r => {
      console.log('  -', r.get('p1.name'), '<->', r.get('p2.name'), '|', r.get('r.compatibilityScore') + '%');
    });

    console.log('\n✅ All couple data complete!');

  } finally {
    await session.close();
    await driver.close();
  }
}

addMissingCouples().catch(console.error);
