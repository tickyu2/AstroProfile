/**
 * David & Victoria Beckham Network Data Loader for Neo4j
 *
 * Loads David Beckham, Victoria Beckham, and their couple profile:
 * - David Beckham: Yang Metal (35%), Golden Balls - The Brand Architect
 * - Victoria Beckham: Yin Metal (40%), Posh - The Steel Magnate
 * - Couple: 88% constitutional compatibility, Double Steel Empire
 *
 * Run with: node functions/dataLoaders/loadBeckhamToNeo4j.js
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

// ============================================================================
// DAVID BECKHAM - GOLDEN BALLS
// ============================================================================

const davidBeckhamData = {
  guestProfile: {
    id: 'guest_david_beckham',
    name: 'David Beckham',
    birthDate: '1975-05-02',
    birthTime: '06:17',
    birthLocation: 'Leytonstone, London, England',

    category: 'celebrity',
    subcategory: 'athlete',

    metal: 35,
    fire: 25,
    wood: 20,
    earth: 15,
    water: 5,

    chineseYear: 'Rabbit',
    chineseElement: 'Wood',
    chineseSign: 'Wood Rabbit',
    dayMaster: 'Yang Metal',
    dayMasterChinese: '庚金',

    sunSign: 'Taurus',
    moonSign: 'Capricorn',
    risingSign: 'Taurus',

    mbti: 'ISFJ',
    enneagram: '3w2',

    totalEras: 5,
    primaryEra: 'retirement_empire',
    nickname: 'Golden Balls - The Brand Architect',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'db_east_london',
      eraName: 'east_london_roots',
      eraTitle: 'East London Roots',
      years: '1975-1991',
      ageRange: '0-16',
      startAge: 0,
      endAge: 16,
      sequence: 1,

      metal: 30,
      fire: 20,
      wood: 25,
      earth: 20,
      water: 5,

      primaryFocus: 'Working-class childhood, Man United obsession, youth development',
      historicalContext: 'Born Leytonstone, East London. Father kitchen fitter. Man United fanatic from age 3.',
      keyEvents: ['Born Leytonstone 1975', 'Father Ted Man United fan', 'Hours practicing crosses', 'Joined Man United youth 1991'],

      communicationPace: 'humble',
      communicationTone: 'working_class_pride',
      signaturePhrases: ['I was the kid from East London', 'My dad was a kitchen fitter'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'db_manchester_united',
      eraName: 'manchester_united',
      eraTitle: 'Manchester United - Global Stardom',
      years: '1991-2003',
      ageRange: '16-28',
      startAge: 16,
      endAge: 28,
      sequence: 2,

      metal: 35,
      fire: 25,
      wood: 20,
      earth: 15,
      water: 5,

      primaryFocus: 'Treble winner, global icon, Victoria marriage, brand emergence',
      historicalContext: 'Class of 92. Treble 1999. Met Victoria 1997. England captain.',
      keyEvents: ['Class of 92', 'Premier League debut 1992', 'Treble 1999', 'Met Victoria 1997', 'Married 1999', 'England captain 2000'],

      communicationPace: 'confident',
      communicationTone: 'precision_discipline',
      signaturePhrases: ['The moment I met Victoria my life changed forever', 'Free kicks are thousands of hours practice'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'db_real_madrid',
      eraName: 'real_madrid',
      eraTitle: 'Real Madrid - Galactico Brand',
      years: '2003-2007',
      ageRange: '28-32',
      startAge: 28,
      endAge: 32,
      sequence: 3,

      metal: 35,
      fire: 28,
      wood: 18,
      earth: 14,
      water: 5,

      primaryFocus: 'Galactico era, global brand expansion, family Spain',
      historicalContext: 'Galacticos with Zidane Ronaldo Figo. La Liga 2007. Global marketing explosion.',
      keyEvents: ['Transfer 25M 2003', 'Galacticos era', 'La Liga 2007', 'Asia marketing gold'],

      communicationPace: 'calculated',
      communicationTone: 'global_brand',
      signaturePhrases: ['Real Madrid was about becoming a global brand', 'Not just a footballer anymore'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'db_la_galaxy',
      eraName: 'la_galaxy',
      eraTitle: 'LA Galaxy - American Dream',
      years: '2007-2013',
      ageRange: '32-38',
      startAge: 32,
      endAge: 38,
      sequence: 4,

      metal: 33,
      fire: 30,
      wood: 15,
      earth: 17,
      water: 5,

      primaryFocus: 'MLS revolution, Hollywood life, business empire building',
      historicalContext: 'Unprecedented 250M contract. MLS Cups 2011 2012. Harper born 2011.',
      keyEvents: ['LA Galaxy 2007', '250M contract', 'MLS Cups 2011 2012', 'Harper born 2011', 'Retired 2013'],

      communicationPace: 'hollywood',
      communicationTone: 'empire_building',
      signaturePhrases: ['America gave us the platform to build an empire'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'db_retirement_empire',
      eraName: 'retirement_empire',
      eraTitle: 'Retirement - Empire Building',
      years: '2013-present',
      ageRange: '38-49+',
      startAge: 38,
      endAge: 49,
      sequence: 5,

      metal: 35,
      fire: 28,
      wood: 12,
      earth: 20,
      water: 5,

      primaryFocus: 'Inter Miami ownership, brand empire, Messi signing, legacy',
      historicalContext: 'Inter Miami owner 2018. Signed Messi 2023. Netflix documentary. 450M brand worth.',
      keyEvents: ['Retired 2013', 'Inter Miami 2018', 'Signed Messi 2023', 'Netflix Beckham 2023', '25 year marriage'],

      communicationPace: 'legacy',
      communicationTone: 'dynasty_builder',
      signaturePhrases: ['Im still the kid from East London but Ive built something'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    }
  ],

  events: [
    {
      id: 'event_db_treble',
      eventType: 'sports_achievement',
      title: 'Manchester United Treble',
      date: '1999-05-26',
      year: 1999,
      description: 'Manchester United wins unprecedented Treble Premier League FA Cup Champions League',
      impact: 'Peak playing achievement, global icon status',
      emotionalSignificance: 95,
      historicalSignificance: 98,
      relatedEras: ['db_manchester_united']
    },
    {
      id: 'event_db_met_victoria',
      eventType: 'personal',
      title: 'Met Victoria at Charity Match',
      date: '1997-03-01',
      year: 1997,
      description: 'David met Victoria Adams Posh Spice at charity football match',
      impact: 'Metal recognized Metal, brand power couple begins',
      emotionalSignificance: 98,
      historicalSignificance: 85,
      relatedEras: ['db_manchester_united']
    },
    {
      id: 'event_db_messi_signing',
      eventType: 'business_achievement',
      title: 'Inter Miami Signs Messi',
      date: '2023-07-16',
      year: 2023,
      description: 'Inter Miami signs Lionel Messi, biggest coup in MLS history',
      impact: 'Legacy vindicated, Metal precision planning paid off',
      emotionalSignificance: 95,
      historicalSignificance: 92,
      relatedEras: ['db_retirement_empire']
    }
  ]
};

// ============================================================================
// VICTORIA BECKHAM - POSH
// ============================================================================

const victoriaBeckhamData = {
  guestProfile: {
    id: 'guest_victoria_beckham',
    name: 'Victoria Beckham',
    birthDate: '1974-04-17',
    birthTime: '12:00',
    birthLocation: 'Harlow, Essex, England',

    category: 'celebrity',
    subcategory: 'fashion',

    metal: 40,
    fire: 38,
    wood: 12,
    earth: 5,
    water: 5,

    chineseYear: 'Tiger',
    chineseElement: 'Wood',
    chineseSign: 'Wood Tiger',
    dayMaster: 'Yin Metal',
    dayMasterChinese: '辛金',

    sunSign: 'Aries',
    moonSign: 'Unknown',
    risingSign: 'Unknown',

    mbti: 'INTJ',
    enneagram: '3w4',

    totalEras: 5,
    primaryEra: 'empire_matriarch',
    nickname: 'Posh - The Steel Magnate',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'vb_goffs_oak',
      eraName: 'goffs_oak',
      eraTitle: 'Goffs Oak & Dance School',
      years: '1974-1994',
      ageRange: '0-20',
      startAge: 0,
      endAge: 20,
      sequence: 1,

      metal: 35,
      fire: 35,
      wood: 15,
      earth: 10,
      water: 5,

      primaryFocus: 'Middle-class ambition, dance training, fame hunger',
      historicalContext: 'Born Harlow, raised Goffs Oak. Theatre school training. Auditioned Spice Girls 1994.',
      keyEvents: ['Born Harlow 1974', 'Dance training', 'Theatre school', 'Spice Girls audition 1994'],

      communicationPace: 'ambitious',
      communicationTone: 'fame_hungry',
      signaturePhrases: ['I always knew I wanted to be famous'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'vb_spice_girls',
      eraName: 'spice_girls',
      eraTitle: 'Posh Spice - Global Phenomenon',
      years: '1994-2000',
      ageRange: '20-26',
      startAge: 20,
      endAge: 26,
      sequence: 2,

      metal: 38,
      fire: 40,
      wood: 12,
      earth: 5,
      water: 5,

      primaryFocus: 'Spice Girls domination, Posh Spice brand, meeting David',
      historicalContext: 'Wannabe 1 worldwide. Most successful girl group. Met David 1997.',
      keyEvents: ['Spice Girls formed 1994', 'Wannabe 1 1996', 'Met David 1997', 'Married 1999'],

      communicationPace: 'peak_fame',
      communicationTone: 'posh_precision',
      signaturePhrases: ['I understood branding before anyone else in that group'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'vb_footballer_wife',
      eraName: 'footballer_wife',
      eraTitle: 'Footballers Wife - Redefining Role',
      years: '2000-2008',
      ageRange: '26-34',
      startAge: 26,
      endAge: 34,
      sequence: 3,

      metal: 39,
      fire: 36,
      wood: 13,
      earth: 7,
      water: 5,

      primaryFocus: 'WAG stereotype hated, solo career failure, fashion awakening',
      historicalContext: 'Madrid loneliness. Solo music flopped. Rebecca Loos affair 2004. Fashion education.',
      keyEvents: ['Manchester 2000-2003', 'Madrid 2003-2007', 'Solo music failed', 'Rebecca Loos 2004', 'LA 2007'],

      communicationPace: 'struggling',
      communicationTone: 'reinvention_beginning',
      signaturePhrases: ['I was miserable as just the footballers wife'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'vb_fashion_launch',
      eraName: 'fashion_launch',
      eraTitle: 'Fashion Empire Launch',
      years: '2008-2016',
      ageRange: '34-42',
      startAge: 34,
      endAge: 42,
      sequence: 4,

      metal: 40,
      fire: 38,
      wood: 12,
      earth: 5,
      water: 5,

      primaryFocus: 'VB brand creation, NY Fashion Week, critical acclaim',
      historicalContext: 'VB Ltd 2008. NY Fashion Week debut. CFDA Award 2011. Proved critics wrong.',
      keyEvents: ['VB Ltd launched 2008', 'NY Fashion Week 2008', 'CFDA Award 2011', 'Vogue covers'],

      communicationPace: 'vindicated',
      communicationTone: 'fashion_authority',
      signaturePhrases: ['Ive worked my arse off for this', 'Im not a celebrity designer'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    },
    {
      id: 'vb_empire_matriarch',
      eraName: 'empire_matriarch',
      eraTitle: 'Empire Matriarch & Legacy',
      years: '2016-present',
      ageRange: '42-50+',
      startAge: 42,
      endAge: 50,
      sequence: 5,

      metal: 42,
      fire: 38,
      wood: 10,
      earth: 5,
      water: 5,

      primaryFocus: 'VB Beauty, global brand, children launching, 25-year marriage',
      historicalContext: 'VB Beauty 2019. 500M brand. 50 Vogue covers. Netflix documentary.',
      keyEvents: ['VB Beauty 2019', '500M brand', 'Netflix Beckham 2023', '25 years married 2024'],

      communicationPace: 'matriarch',
      communicationTone: 'unapologetic_empire',
      signaturePhrases: ['Im not just Posh Spice Im Victoria Beckham'],

      calibrationFile: 'DavidVictoriaBeckhams.zip'
    }
  ],

  events: [
    {
      id: 'event_vb_met_david',
      eventType: 'personal',
      title: 'Met David at Charity Match',
      date: '1997-03-01',
      year: 1997,
      description: 'Victoria met David Beckham at charity football match, Metal recognized Metal',
      impact: 'Brand power couple formed, life direction changed',
      emotionalSignificance: 98,
      historicalSignificance: 85,
      relatedEras: ['vb_spice_girls']
    },
    {
      id: 'event_vb_cfda_award',
      eventType: 'career_achievement',
      title: 'CFDA Fashion Icon Award',
      date: '2011-06-06',
      year: 2011,
      description: 'Victoria received CFDA Fashion Icon Award, fashion world validation',
      impact: 'Reinvention complete, serious designer recognition',
      emotionalSignificance: 95,
      historicalSignificance: 88,
      relatedEras: ['vb_fashion_launch']
    },
    {
      id: 'event_vb_fashion_launch',
      eventType: 'business_launch',
      title: 'Victoria Beckham Ltd Launched',
      date: '2008-09-01',
      year: 2008,
      description: 'Victoria launched her fashion label at New York Fashion Week',
      impact: 'Reinvention from pop star to fashion icon',
      emotionalSignificance: 92,
      historicalSignificance: 85,
      relatedEras: ['vb_fashion_launch']
    }
  ]
};

// ============================================================================
// COUPLE RELATIONSHIP DATA
// ============================================================================

const beckhamCoupleData = {
  coupleId: 'couple_david_victoria_beckham',
  person1Id: 'guest_david_beckham',
  person2Id: 'guest_victoria_beckham',

  relationshipType: 'MARRIED_TO',
  meetingDate: '1997-03-01',
  weddingDate: '1999-07-04',
  yearsTogether: 27,

  compatibilityScore: 88,

  dynamicType: 'Double Steel',
  dynamicDescription: 'Yang Metal (35%) + Yin Metal (40%) = Sword + Jewelry = Brand Empire Perfection',

  person1Element: 'Yang Metal',
  person2Element: 'Yin Metal',

  sharedValues: [
    'Brand control every detail',
    'Work ethic extreme 16 hour days',
    'Family privacy protection',
    'Discipline over talent Metal precision',
    'Separate empires no competition',
    'Loyalty Metal doesnt break',
    'Reinvention ability careers evolved',
    'Working class roots never forgotten'
  ],

  children: [
    'Brooklyn Beckham 1999',
    'Romeo Beckham 2002',
    'Cruz Beckham 2005',
    'Harper Beckham 2011'
  ],

  separateEmpires: {
    his: 'DB Ventures Inter Miami fragrances endorsements 450M',
    hers: 'VB Fashion VB Beauty Vogue 500M',
    combined: '900M plus'
  },

  historicalSignificance: [
    'Original brand power couple pre Instagram',
    'Separate empires model no competition',
    '25 plus years celebrity longest marriage',
    'Four children launched successfully',
    'Double Metal compatibility proven',
    'Reinvention mastery both careers evolved',
    'Working class to empire authenticity'
  ]
};

// ============================================================================
// LOADER FUNCTIONS
// ============================================================================

async function loadGuestProfile(session, data) {
  const query = `
    MERGE (g:GuestProfile {id: $id})
    SET g.name = $name,
        g.birthDate = $birthDate,
        g.birthTime = $birthTime,
        g.birthLocation = $birthLocation,
        g.category = $category,
        g.subcategory = $subcategory,
        g.fire = $fire,
        g.wood = $wood,
        g.water = $water,
        g.metal = $metal,
        g.earth = $earth,
        g.chineseYear = $chineseYear,
        g.chineseElement = $chineseElement,
        g.chineseSign = $chineseSign,
        g.dayMaster = $dayMaster,
        g.dayMasterChinese = $dayMasterChinese,
        g.sunSign = $sunSign,
        g.moonSign = $moonSign,
        g.risingSign = $risingSign,
        g.mbti = $mbti,
        g.enneagram = $enneagram,
        g.totalEras = $totalEras,
        g.primaryEra = $primaryEra,
        g.nickname = $nickname,
        g.calibrationVersion = $calibrationVersion,
        g.updatedAt = datetime()
    RETURN g.id as id, g.name as name
  `;

  const result = await session.run(query, data);
  return result.records[0];
}

async function loadGuestEra(session, guestId, era) {
  const query = `
    MATCH (g:GuestProfile {id: $guestId})
    MERGE (e:GuestEra {id: $id})
    SET e.eraName = $eraName,
        e.eraTitle = $eraTitle,
        e.years = $years,
        e.ageRange = $ageRange,
        e.startAge = $startAge,
        e.endAge = $endAge,
        e.sequence = $sequence,
        e.fire = $fire,
        e.wood = $wood,
        e.water = $water,
        e.metal = $metal,
        e.earth = $earth,
        e.primaryFocus = $primaryFocus,
        e.historicalContext = $historicalContext,
        e.keyEvents = $keyEvents,
        e.communicationPace = $communicationPace,
        e.communicationTone = $communicationTone,
        e.signaturePhrases = $signaturePhrases,
        e.calibrationFile = $calibrationFile,
        e.updatedAt = datetime()
    MERGE (g)-[:HAS_ERA]->(e)
    RETURN e.id as id, e.eraTitle as title
  `;

  const result = await session.run(query, { guestId, ...era });
  return result.records[0];
}

async function loadEvent(session, guestId, event) {
  const query = `
    MATCH (g:GuestProfile {id: $guestId})
    MERGE (ev:Event {id: $id})
    SET ev.eventType = $eventType,
        ev.title = $title,
        ev.date = $date,
        ev.year = $year,
        ev.description = $description,
        ev.impact = $impact,
        ev.emotionalSignificance = $emotionalSignificance,
        ev.historicalSignificance = $historicalSignificance,
        ev.relatedEras = $relatedEras,
        ev.updatedAt = datetime()
    MERGE (g)-[:EXPERIENCED]->(ev)
    RETURN ev.id as id, ev.title as title
  `;

  const result = await session.run(query, { guestId, ...event });
  return result.records[0];
}

async function loadCoupleRelationship(session, coupleData) {
  const query = `
    MATCH (p1:GuestProfile {id: $person1Id})
    MATCH (p2:GuestProfile {id: $person2Id})
    MERGE (p1)-[r:MARRIED_TO]->(p2)
    SET r.coupleId = $coupleId,
        r.meetingDate = $meetingDate,
        r.weddingDate = $weddingDate,
        r.yearsTogether = $yearsTogether,
        r.compatibilityScore = $compatibilityScore,
        r.dynamicType = $dynamicType,
        r.dynamicDescription = $dynamicDescription,
        r.person1Element = $person1Element,
        r.person2Element = $person2Element,
        r.sharedValues = $sharedValues,
        r.children = $children,
        r.historicalSignificance = $historicalSignificance,
        r.updatedAt = datetime()
    RETURN r.coupleId as id, r.compatibilityScore as compatibility
  `;

  const result = await session.run(query, coupleData);
  return result.records[0];
}

async function createCoupleNode(session, coupleData) {
  const query = `
    MATCH (p1:GuestProfile {id: $person1Id})
    MATCH (p2:GuestProfile {id: $person2Id})
    MERGE (c:CoupleProfile {id: $coupleId})
    SET c.name = 'David & Victoria Beckham',
        c.displayName = 'David & Victoria Beckham',
        c.tagline = 'Double Steel: When Metal Meets Metal',
        c.meetingDate = $meetingDate,
        c.weddingDate = $weddingDate,
        c.yearsTogether = $yearsTogether,
        c.compatibilityScore = $compatibilityScore,
        c.dynamicType = $dynamicType,
        c.dynamicDescription = $dynamicDescription,
        c.sharedValues = $sharedValues,
        c.children = $children,
        c.historicalSignificance = $historicalSignificance,
        c.updatedAt = datetime()
    MERGE (c)-[:INCLUDES]->(p1)
    MERGE (c)-[:INCLUDES]->(p2)
    RETURN c.id as id, c.compatibilityScore as compatibility
  `;

  const result = await session.run(query, coupleData);
  return result.records[0];
}

// ============================================================================
// MAIN LOADER
// ============================================================================

async function loadBeckhamNetwork() {
  const session = driver.session();

  try {
    console.log('\n========================================');
    console.log('BECKHAM NETWORK - Neo4j Loader');
    console.log('Double Steel Empire');
    console.log('========================================\n');

    // Load David Beckham
    console.log('Loading David Beckham - Golden Balls...');
    const david = await loadGuestProfile(session, davidBeckhamData.guestProfile);
    console.log(`  ✓ Profile: ${david.get('name')} (${david.get('id')})`);

    for (const era of davidBeckhamData.guestEras) {
      const eraResult = await loadGuestEra(session, davidBeckhamData.guestProfile.id, era);
      console.log(`    ✓ Era: ${eraResult.get('title')}`);
    }

    for (const event of davidBeckhamData.events) {
      const eventResult = await loadEvent(session, davidBeckhamData.guestProfile.id, event);
      console.log(`    ✓ Event: ${eventResult.get('title')}`);
    }

    // Load Victoria Beckham
    console.log('\nLoading Victoria Beckham - Posh...');
    const victoria = await loadGuestProfile(session, victoriaBeckhamData.guestProfile);
    console.log(`  ✓ Profile: ${victoria.get('name')} (${victoria.get('id')})`);

    for (const era of victoriaBeckhamData.guestEras) {
      const eraResult = await loadGuestEra(session, victoriaBeckhamData.guestProfile.id, era);
      console.log(`    ✓ Era: ${eraResult.get('title')}`);
    }

    for (const event of victoriaBeckhamData.events) {
      const eventResult = await loadEvent(session, victoriaBeckhamData.guestProfile.id, event);
      console.log(`    ✓ Event: ${eventResult.get('title')}`);
    }

    // Load Couple Relationship
    console.log('\nLoading Beckham Couple Relationship...');
    const relationship = await loadCoupleRelationship(session, beckhamCoupleData);
    console.log(`  ✓ Relationship: MARRIED_TO (${relationship.get('compatibility')}% compatibility)`);

    const couple = await createCoupleNode(session, beckhamCoupleData);
    console.log(`  ✓ Couple Node: ${couple.get('id')}`);

    console.log('\n========================================');
    console.log('BECKHAM NETWORK LOADED SUCCESSFULLY');
    console.log('========================================');
    console.log('\nSummary:');
    console.log('  - David Beckham: 5 eras, 3 events (Yang Metal 35%)');
    console.log('  - Victoria Beckham: 5 eras, 3 events (Yin Metal 40%)');
    console.log('  - Couple: 88% compatibility, 27 years together');
    console.log('  - Dynamic: Double Steel (Sword + Jewelry)');
    console.log('  - Separate Empires: DB Ventures + VB Fashion = $900M+');
    console.log('  - Children: Brooklyn, Romeo, Cruz, Harper');
    console.log('\n');

  } catch (error) {
    console.error('Error loading Beckham network:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the loader
loadBeckhamNetwork()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
