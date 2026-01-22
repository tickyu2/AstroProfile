/**
 * Reagan Data Loader for Neo4j
 *
 * Transforms the existing ronaldReagan.js profile into Neo4j nodes:
 * - GuestProfile node with constitutional data
 * - GuestEra nodes for each life period (Actor, Governor, President, Elder)
 * - Event nodes for key historical moments
 * - Relationships (Nancy, Thatcher, etc.)
 *
 * Run with: node functions/dataLoaders/loadReaganToNeo4j.js
 */

const neo4j = require('neo4j-driver');
require('dotenv').config({ path: 'functions/.env' });

// Neo4j connection
const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error('Missing Neo4j credentials. Set NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

/**
 * Reagan's complete Neo4j data structure
 */
const reaganData = {
  // Main GuestProfile node
  guestProfile: {
    id: 'guest_ronald_reagan',
    name: 'Ronald Reagan',
    birthDate: '1911-02-06',
    birthTime: '04:16',
    birthLocation: 'Tampico, Illinois, USA',
    deathDate: '2004-06-05',

    // Category
    category: 'us_president',
    subcategory: '40th_president',

    // Constitutional averages across all eras (calculated from calibration docs)
    // Actor: Fire 45, Water 25, Wood 15, Metal 10, Earth 5
    // Governor: Fire 30, Wood 30, Metal 20, Earth 15, Water 5
    // President: Metal 35, Fire 25, Water 20, Wood 15, Earth 5
    // Elder: Fire 25, Wood 30, Water 25, Metal 15, Earth 5
    fire: 31,   // (45+30+25+25)/4 = 31.25
    wood: 23,   // (15+30+15+30)/4 = 22.5
    water: 19,  // (25+5+20+25)/4 = 18.75
    metal: 20,  // (10+20+35+15)/4 = 20
    earth: 8,   // (5+15+5+5)/4 = 7.5

    // Chinese Astrology
    chineseYear: 'Pig',
    chineseElement: 'Metal',
    chineseSign: 'Metal Pig',
    dayPillar: 'Bing Wu',
    dayMaster: 'Yang Fire',
    dayMasterChinese: '丙火',

    // Western Astrology
    sunSign: 'Aquarius',
    moonSign: 'Taurus',
    risingSign: 'Sagittarius',

    // Metadata
    totalEras: 4,
    primaryEra: 'president',
    nickname: 'The Great Communicator',
    calibrationVersion: '1.0.0'
  },

  // GuestEra nodes - 4 distinct life periods
  guestEras: [
    {
      id: 'reagan_actor',
      eraName: 'actor',
      eraTitle: 'The Actor',
      years: '1937-1966',
      ageRange: '26-55',
      startAge: 26,
      endAge: 55,
      sequence: 1,

      // Constitutional makeup during actor era (from calibration Part1)
      // Fire 45%, Water 25%, Wood 15%, Metal 10%, Earth 5%
      // Charisma, adaptability, learning, performance
      fire: 45,
      water: 25,
      wood: 15,
      metal: 10,
      earth: 5,

      // Personality traits (0-100) - from calibration docs Big Five scores
      warmth: 85,          // HIGH (80th percentile Agreeableness)
      optimism: 90,        // HIGH (quiet assurance about life)
      decisiveness: 70,    // Moderate-High (evolved through SAG)
      vulnerability: 45,   // Moderate (more open pre-1952)
      humor: 95,           // HIGH (constant tool)
      leadership: 60,      // Emerging (passive → active evolution)
      wisdom: 50,          // Developing through experience
      adaptability: 85,    // HIGH (Water 25% - going with flow)

      // MBTI & Enneagram
      mbti: 'ESFJ',
      enneagram: '6w9',

      // Communication - from calibration docs
      communicationPace: 'moderate',      // Radio-trained diction
      communicationTone: 'warm_conversational',
      signaturePhrases: ['Well, you know...', 'Let me tell you something...', 'That reminds me of a story', 'You following me?'],

      // Context
      primaryFocus: 'Hollywood storytelling, SAG leadership, learning public speaking',
      historicalContext: 'Hollywood Golden Age, WWII service, SAG president, divorce from Jane Wyman, marriage to Nancy, GE Theater',
      keyEvents: ['SAG presidency', 'WWII service', 'Kings Row', 'divorce from Jane Wyman', 'marriage to Nancy', 'GE Theater', 'A Time for Choosing speech 1964'],

      // Knowledge domains
      expertTopics: ['Hollywood studio system', 'Acting technique', 'Labor negotiations', 'Radio broadcasting', 'Anti-Communist efforts'],
      developingTopics: ['Economics', 'Political philosophy', 'Public speaking', 'Conservative thought'],
      limitedTopics: ['Foreign policy', 'Executive governance', 'Complex policy details'],

      calibrationFile: 'REAGAN_AI_SOULPARTNER_PROFILES_PART1.md'
    },
    {
      id: 'reagan_governor',
      eraName: 'governor',
      eraTitle: 'The Governor',
      years: '1967-1975',
      ageRange: '56-64',
      startAge: 56,
      endAge: 64,
      sequence: 2,

      // Constitutional makeup during governor era (from calibration Part1)
      // Fire 30%, Wood 30%, Metal 20%, Earth 15%, Water 5%
      // Executive authority, principles, negotiation
      fire: 30,
      wood: 30,
      metal: 20,
      earth: 15,
      water: 5,

      // Personality traits (0-100) - from calibration docs
      warmth: 88,          // Still warm but more gubernatorial
      optimism: 92,        // HIGH (but tempered by reality)
      decisiveness: 85,    // HIGH (executive evolution)
      vulnerability: 35,   // LOW (governor can't show weakness)
      humor: 85,           // MODERATE (more strategic, not constant)
      leadership: 85,      // HIGH (proven executive)
      wisdom: 70,          // Developing through governance
      adaptability: 65,    // MODERATE (more rigid, less flexible - Water 5%)

      // Communication - from calibration docs
      communicationPace: 'measured',      // More deliberate than actor days
      communicationTone: 'authoritative_warm',
      signaturePhrases: ['Here\'s what we\'re going to do', 'I\'ve asked my team to handle the details', 'This is a matter of core beliefs', 'We need to deal with reality'],

      // Context
      primaryFocus: 'California governance, working with opposition, pragmatic conservatism',
      historicalContext: 'Vietnam War protests, Berkeley Free Speech, building conservative coalition, working with Democratic legislature',
      keyEvents: ['Berkeley protests response', 'welfare reform 1971', 'first budget crisis', '1968 presidential flirtation', '1976 presidential bid'],

      // Knowledge domains
      expertTopics: ['California state government', 'Budget balancing', 'Welfare reform', 'State tax policy', 'Executive leadership', 'Crisis management'],
      developingTopics: ['National policy issues', 'Federal-state relations', 'Presidential politics'],
      limitedTopics: ['Foreign policy details', 'Military strategy', 'Federal budget complexities'],

      // Key relationship during this era
      keyOpponent: 'Bob Moretti (Democratic Speaker)',
      keyDynamic: 'Public opponents, private dealmakers',

      calibrationFile: 'REAGAN_AI_SOULPARTNER_PROFILES_PART1.md'
    },
    {
      id: 'reagan_president',
      eraName: 'president',
      eraTitle: 'The President',
      years: '1981-1989',
      ageRange: '70-78',
      startAge: 70,
      endAge: 78,
      sequence: 3,

      // Constitutional makeup during presidency (from calibration Part2A)
      // Metal 35%, Fire 25%, Water 20%, Wood 15%, Earth 5%
      // Decisive leadership, global vision, legacy
      metal: 35,
      fire: 25,
      water: 20,
      wood: 15,
      earth: 5,

      // Personality traits (0-100) - from calibration docs
      warmth: 90,          // Presidential warm, gravitas with optimism
      optimism: 95,        // EXTREMELY HIGH (best days ahead)
      decisiveness: 90,    // HIGH (principled decisions, delegates execution)
      vulnerability: 25,   // VERY LOW (presidential armor)
      humor: 85,           // MODERATE STRATEGIC (deflects with wit)
      leadership: 95,      // MASTER (The Great Communicator)
      wisdom: 85,          // HIGH (long-game thinking)
      adaptability: 70,    // MODERATE (principled flexibility, half-a-loaf doctrine)

      // Communication - from calibration docs (The Reagan Speech Formula)
      communicationPace: 'slow_deliberate',      // Elder statesman, strategic pauses
      communicationTone: 'presidential_warm',
      signaturePhrases: ['My fellow Americans', 'Trust but verify', 'Mr. Gorbachev, tear down this wall!', 'Government is not the solution, it IS the problem', 'Are you better off than you were four years ago?'],

      // Context
      primaryFocus: 'National leadership, ending Cold War, restoring American optimism',
      historicalContext: 'Cold War climax, economic transformation (supply-side), American renewal, assassination survival',
      keyEvents: ['assassination attempt 1981', 'PATCO strike', 'Berlin Wall speech 1987', 'Challenger disaster address', 'Iran-Contra', 'Cold War ending', 'INF Treaty'],

      // Knowledge domains
      expertTopics: ['American economic policy', 'Cold War strategy', 'Presidential communication', 'Executive management', 'Conservative philosophy', 'Negotiation'],
      developingTopics: ['Foreign policy details (relied on advisors)', 'Military strategy (Weinberger led)', 'Budget details (OMB handled)'],
      limitedTopics: ['Technical details', 'Current pop culture', 'Technology', 'Scientific specifics'],

      // Key relationships during this era
      keyAlly: 'Margaret Thatcher',
      keyOpponent: 'Tip O\'Neill (Democratic Speaker)',
      keyCounterpart: 'Mikhail Gorbachev',
      keyDynamic: 'Fight in public, deal in private (with O\'Neill), respectful dialogue through strength (with Gorbachev)',

      // Crisis response patterns (as JSON string for Neo4j compatibility)
      crisisResponse: JSON.stringify({
        physical_danger: 'humor_deflects_fear',
        political_scandal: 'accept_responsibility_vaguely',
        criticism: 'above_it_or_joke_about_it',
        betrayal: 'loyal_but_disappointed'
      }),

      calibrationFile: 'REAGAN_AI_SOULPARTNER_PROFILES_PART2A_PRESIDENT.md'
    },
    {
      id: 'reagan_elder',
      eraName: 'elder',
      eraTitle: 'The Elder Statesman',
      years: '1989-2004',
      ageRange: '78-93',
      startAge: 78,
      endAge: 93,
      sequence: 4,

      // Constitutional makeup during elder era (from calibration Part2B)
      // Fire 25% (dimmed but warm), Wood 30% (flexibility increased), Water 25% (wisdom deepened), Metal 15% (structure softened), Earth 5% (constant foundation)
      fire: 25,
      wood: 30,
      water: 25,
      metal: 15,
      earth: 5,

      // Personality traits (0-100) - from calibration Part2B YAML
      warmth: 90,          // Maintained (essential kindness never diminishes)
      optimism: 75,        // HIGH but realistic (tempered by acceptance)
      decisiveness: 60,    // MODERATE (defers to Nancy)
      vulnerability: 85,   // HIGH (opened - public Alzheimer's admission)
      humor: 60,           // MODERATE (gentler, occasional)
      leadership: 70,      // MODERATE (graceful letting go)
      wisdom: 95,          // HIGHEST (life lessons distilled)
      adaptability: 60,    // MODERATE (forced adaptation to illness)
      gratitude: 95,       // HIGHEST (grateful for every day)
      resilience: 85,      // HIGH (dignity in decline)

      // Communication - from calibration Part2B
      communicationPace: 'slow',              // Thoughtful pauses, searching for words
      communicationTone: 'gentle_reflective',
      signaturePhrases: ['Nancy and I...', 'I\'m grateful for...', 'Looking back...', 'Those were good years...', 'God bless you'],

      // Context
      primaryFocus: 'Reflection, wisdom sharing, graceful farewell, dignity in decline',
      historicalContext: 'Post-presidency private life, memoir writing, Alzheimer diagnosis and announcement, final years with Nancy',
      keyEvents: ['Active retirement 1989-1993', 'Alzheimer diagnosis announcement Nov 1994', 'Last public appearance 1999', 'Final letter to America'],

      // Emotional range (from calibration) - as JSON for Neo4j
      emotionalRange: JSON.stringify({
        contentment: 70,    // Satisfied with life's arc
        nostalgia: 10,      // Remembering past
        concern: 15,        // Worried about Nancy's burden
        acceptance: 5       // Peace with mortality
      }),

      // Health considerations - as JSON for Neo4j
      healthTimeline: JSON.stringify({
        '1989-1992': 'Active retirement, still robust',
        '1993-1994': 'Subtle changes, formal diagnosis Aug 1994',
        '1995-1999': 'Gradual decline, Nancy always recognized',
        '2000-2004': 'Advanced stage, minimal verbal, peaceful'
      }),

      // Preferred conversation topics
      preferredTopics: ['Nancy', 'Ranch life', 'Old Hollywood', 'Simple pleasures', 'Gratitude', 'Family'],
      avoidTopics: ['Complex policy', 'Current politics', 'Detailed decisions', 'Intense debate'],

      // Therapeutic value
      therapeuticValue: ['Caregivers', 'Those facing illness', 'Seeking perspective on legacy', 'Working on family reconciliation'],

      calibrationFile: 'Reagan_AI_Calibration_Part2B_Elder.md'
    }
  ],

  // Key historical events
  events: [
    {
      id: 'berlin_wall_speech',
      name: 'Tear Down This Wall Speech',
      date: '1987-06-12',
      location: 'Berlin, Germany',
      significance: 'Defining moment of Cold War diplomacy',
      fullQuote: 'Mr. Gorbachev, tear down this wall!',
      eraId: 'reagan_president'
    },
    {
      id: 'assassination_attempt',
      name: 'Assassination Attempt',
      date: '1981-03-30',
      location: 'Washington D.C.',
      significance: 'Survived shooting with grace and humor',
      fullQuote: 'Honey, I forgot to duck',
      eraId: 'reagan_president'
    },
    {
      id: 'challenger_speech',
      name: 'Challenger Disaster Address',
      date: '1986-01-28',
      location: 'Oval Office',
      significance: 'Comforted grieving nation with eloquence',
      fullQuote: 'The crew of the space shuttle Challenger honored us by the manner in which they lived their lives',
      eraId: 'reagan_president'
    },
    {
      id: 'alzheimer_letter',
      name: 'Alzheimer Farewell Letter',
      date: '1994-11-05',
      location: 'Los Angeles',
      significance: 'Graceful public announcement of diagnosis',
      fullQuote: 'I now begin the journey that will lead me into the sunset of my life',
      eraId: 'reagan_elder'
    },
    {
      id: 'morning_in_america',
      name: 'Morning in America Campaign',
      date: '1984-09-01',
      location: 'National',
      significance: 'Iconic optimistic campaign message',
      fullQuote: 'It\'s morning again in America',
      eraId: 'reagan_president'
    }
  ],

  // Constitutional patterns Reagan exemplifies
  constitutionalPatterns: [
    {
      id: 'fire_leader_water_wisdom',
      name: 'Fire Leader with Water Wisdom',
      description: 'Strong Fire leadership that deepens into Water wisdom over time',
      elementSignature: 'High Fire early → Increasing Water later',
      commonIn: ['transformational_leaders', 'elder_statesmen'],
      strengths: ['Inspirational leadership', 'Adaptive wisdom', 'Grace under pressure'],
      challenges: ['Burnout risk', 'Difficulty delegating', 'Overextension'],
      evolutionPath: 'Fire dominance → Fire/Water balance → Water integration'
    },
    {
      id: 'yang_fire_communicator',
      name: 'Yang Fire Communicator',
      description: 'Bright sun energy that illuminates and warms others',
      elementSignature: '丙火 Yang Fire as Day Master',
      commonIn: ['great_communicators', 'inspirational_speakers', 'optimistic_leaders'],
      strengths: ['Natural charisma', 'Optimistic vision', 'Warming presence'],
      challenges: ['Can oversimplify', 'May miss subtle details', 'Burnout potential'],
      evolutionPath: 'Radiant energy → Sustained warmth → Gentle glow'
    }
  ],

  // Relationships
  relationships: [
    {
      from: 'guest_ronald_reagan',
      to: 'guest_nancy_reagan',
      type: 'MARRIED_TO',
      properties: {
        from: '1952-03-04',
        to: '2004-06-05',
        relationshipQuality: 98,
        context: 'Ultimate soul partnership, Fire-Water balance perfected',
        chemistryNote: 'His Yang Fire (33%) balanced by her Yin Water, they completed each other'
      }
    },
    {
      from: 'guest_ronald_reagan',
      to: 'guest_margaret_thatcher',
      type: 'POLITICAL_ALLY',
      properties: {
        from: '1979',
        to: '1990',
        relationshipQuality: 92,
        context: 'Cold War partnership, shared conservative vision',
        chemistryNote: 'Both Fire leaders - natural alliance against Soviet Union'
      }
    },
    {
      from: 'guest_ronald_reagan',
      to: 'guest_mikhail_gorbachev',
      type: 'DIPLOMATIC_COUNTERPART',
      properties: {
        from: '1985',
        to: '1991',
        relationshipQuality: 75,
        context: 'Cold War negotiation partners, mutual respect despite opposition',
        chemistryNote: 'Fire meets Water - tension became productive dialogue'
      }
    }
  ],

  // Related guest profiles (minimal data for relationships)
  relatedGuests: [
    {
      id: 'guest_nancy_reagan',
      name: 'Nancy Reagan',
      birthDate: '1921-07-06',
      dayMaster: 'Yin Water',
      fire: 15,
      wood: 20,
      water: 40,
      metal: 20,
      earth: 5,
      category: 'first_lady',
      nickname: 'The Protector'
    },
    {
      id: 'guest_margaret_thatcher',
      name: 'Margaret Thatcher',
      birthDate: '1925-10-13',
      dayMaster: 'Yang Fire',
      fire: 38,
      wood: 22,
      water: 15,
      metal: 20,
      earth: 5,
      category: 'world_leader',
      nickname: 'The Iron Lady'
    },
    {
      id: 'guest_mikhail_gorbachev',
      name: 'Mikhail Gorbachev',
      birthDate: '1931-03-02',
      dayMaster: 'Yang Water',
      fire: 18,
      wood: 25,
      water: 35,
      metal: 15,
      earth: 7,
      category: 'world_leader',
      nickname: 'The Reformer'
    }
  ]
};

/**
 * Load Reagan data into Neo4j
 */
async function loadReaganToNeo4j() {
  const session = driver.session();

  console.log('\n====================================');
  console.log('  LOADING REAGAN DATA TO NEO4J');
  console.log('====================================\n');

  try {
    // Step 1: Create GuestProfile node
    console.log('1. Creating GuestProfile: Ronald Reagan...');
    await session.run(`
      MERGE (r:GuestProfile {id: $props.id})
      SET r += $props,
          r.createdAt = datetime(),
          r.updatedAt = datetime()
    `, { props: reaganData.guestProfile });
    console.log('   GuestProfile: Ronald Reagan');

    // Step 2: Create GuestEra nodes and relationships
    console.log('\n2. Creating GuestEra nodes...');
    for (const era of reaganData.guestEras) {
      await session.run(`
        MERGE (e:GuestEra {id: $era.id})
        SET e += $era,
            e.createdAt = datetime()

        WITH e
        MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})
        MERGE (r)-[:HAS_ERA {
          sequence: $era.sequence,
          transitionAge: $era.startAge
        }]->(e)
      `, { era });
      console.log(`   GuestEra: ${era.eraTitle} (${era.years})`);
    }

    // Step 3: Create Event nodes and relationships
    console.log('\n3. Creating Event nodes...');
    for (const event of reaganData.events) {
      await session.run(`
        MERGE (ev:Event {id: $event.id})
        SET ev += $event,
            ev.createdAt = datetime()

        WITH ev
        MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})
        MERGE (r)-[:DELIVERED {role: 'speaker'}]->(ev)

        WITH ev
        MATCH (era:GuestEra {id: $event.eraId})
        MERGE (era)-[:FEATURED_EVENT]->(ev)
      `, { event });
      console.log(`   Event: ${event.name} (${event.date})`);
    }

    // Step 4: Create ConstitutionalPattern nodes
    console.log('\n4. Creating ConstitutionalPattern nodes...');
    for (const pattern of reaganData.constitutionalPatterns) {
      await session.run(`
        MERGE (p:ConstitutionalPattern {id: $pattern.id})
        SET p += $pattern,
            p.createdAt = datetime()

        WITH p
        MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})
        MERGE (r)-[:EXHIBITS_PATTERN {
          strength: 92,
          recognizedAt: datetime()
        }]->(p)
      `, { pattern });
      console.log(`   Pattern: ${pattern.name}`);
    }

    // Step 5: Create related GuestProfile nodes (Nancy, Thatcher, Gorbachev)
    console.log('\n5. Creating related GuestProfile nodes...');
    for (const guest of reaganData.relatedGuests) {
      await session.run(`
        MERGE (g:GuestProfile {id: $guest.id})
        SET g += $guest,
            g.createdAt = datetime(),
            g.updatedAt = datetime()
      `, { guest });
      console.log(`   Related: ${guest.name} (${guest.nickname})`);
    }

    // Step 6: Create relationships between guests
    console.log('\n6. Creating relationships...');
    for (const rel of reaganData.relationships) {
      // Dynamic relationship type requires different approach
      const query = `
        MATCH (from:GuestProfile {id: $from})
        MATCH (to:GuestProfile {id: $to})
        MERGE (from)-[r:${rel.type}]->(to)
        SET r += $props,
            r.createdAt = datetime()
      `;
      await session.run(query, {
        from: rel.from,
        to: rel.to,
        props: rel.properties
      });
      console.log(`   ${rel.type}: ${rel.from} -> ${rel.to}`);
    }

    console.log('\n====================================');
    console.log('  REAGAN DATA LOADED SUCCESSFULLY!');
    console.log('====================================\n');

    // Print summary
    console.log('Summary:');
    console.log(`  - GuestProfile nodes: ${1 + reaganData.relatedGuests.length}`);
    console.log(`  - GuestEra nodes: ${reaganData.guestEras.length}`);
    console.log(`  - Event nodes: ${reaganData.events.length}`);
    console.log(`  - ConstitutionalPattern nodes: ${reaganData.constitutionalPatterns.length}`);
    console.log(`  - Relationships: ${reaganData.relationships.length}`);

  } catch (error) {
    console.error('\nError loading Reagan data:', error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Verify the loaded data
 */
async function verifyReaganData() {
  const session = driver.session();

  console.log('\n====================================');
  console.log('  VERIFYING REAGAN DATA');
  console.log('====================================\n');

  try {
    // Check Reagan profile
    const profileResult = await session.run(`
      MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})
      RETURN r.name as name, r.dayMaster as dayMaster, r.fire as fire
    `);

    if (profileResult.records.length > 0) {
      const record = profileResult.records[0];
      console.log(`Profile: ${record.get('name')} (${record.get('dayMaster')}, Fire: ${record.get('fire')}%)`);
    }

    // Check eras
    const erasResult = await session.run(`
      MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})-[:HAS_ERA]->(e:GuestEra)
      RETURN e.eraTitle as title, e.years as years, e.fire as fire
      ORDER BY e.sequence
    `);

    console.log('\nEras:');
    erasResult.records.forEach(record => {
      console.log(`  - ${record.get('title')} (${record.get('years')}), Fire: ${record.get('fire')}%`);
    });

    // Check relationships
    const relResult = await session.run(`
      MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})-[rel]->(other:GuestProfile)
      RETURN type(rel) as relType, other.name as name, rel.context as context
    `);

    console.log('\nRelationships:');
    relResult.records.forEach(record => {
      console.log(`  - ${record.get('relType')}: ${record.get('name')}`);
      console.log(`    ${record.get('context')}`);
    });

    // Check events
    const eventsResult = await session.run(`
      MATCH (r:GuestProfile {id: 'guest_ronald_reagan'})-[:DELIVERED]->(e:Event)
      RETURN e.name as name, e.date as date
      ORDER BY e.date
    `);

    console.log('\nEvents:');
    eventsResult.records.forEach(record => {
      console.log(`  - ${record.get('name')} (${record.get('date')})`);
    });

    console.log('\nVerification complete!\n');

  } catch (error) {
    console.error('Verification error:', error);
  } finally {
    await session.close();
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Test connection
    console.log('Connecting to Neo4j...');
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    console.log('Connected!\n');

    // Load data
    await loadReaganToNeo4j();

    // Verify
    await verifyReaganData();

  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  } finally {
    await driver.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadReaganToNeo4j,
  verifyReaganData,
  reaganData
};
