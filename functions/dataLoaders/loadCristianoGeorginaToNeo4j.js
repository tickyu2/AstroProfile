/**
 * Cristiano Ronaldo & Georgina Rodríguez Network Data Loader for Neo4j
 *
 * Loads Cristiano Ronaldo, Georgina Rodríguez, and their couple profile:
 * - Cristiano Ronaldo: Yang Fire (45%), The Relentless Sun
 * - Georgina Rodríguez: Yin Earth (40%), The Keeper of the Realm
 * - Couple: 92% constitutional compatibility, dynasty builders
 *
 * Run with: node functions/dataLoaders/loadCristianoGeorginaToNeo4j.js
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
// CRISTIANO RONALDO - THE RELENTLESS SUN
// ============================================================================

const cristianoRonaldoData = {
  guestProfile: {
    id: 'guest_cristiano_ronaldo',
    name: 'Cristiano Ronaldo',
    birthDate: '1985-02-05',
    birthTime: '05:25',
    birthLocation: 'Funchal, Madeira, Portugal',

    category: 'celebrity',
    subcategory: 'athlete',

    // Constitutional elements
    fire: 45,
    metal: 25,
    wood: 15,
    earth: 10,
    water: 5,

    // Chinese Astrology
    chineseYear: 'Ox',
    chineseElement: 'Wood',
    chineseSign: 'Wood Ox',
    dayMaster: 'Yang Fire',
    dayMasterChinese: '丙火',

    // Western Astrology
    sunSign: 'Aquarius',
    moonSign: 'Cancer',
    risingSign: 'Sagittarius',

    // MBTI
    mbti: 'ESTJ',
    enneagram: '3w4',

    totalEras: 6,
    primaryEra: 'saudi_dynasty',
    nickname: 'The Relentless Sun',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'cr7_madeira_poverty',
      eraName: 'madeira_poverty',
      eraTitle: 'Madeira & Poverty',
      years: '1985-2003',
      ageRange: '0-18',
      startAge: 0,
      endAge: 18,
      sequence: 1,

      fire: 35,
      wood: 25,
      metal: 20,
      earth: 15,
      water: 5,

      primaryFocus: 'Childhood poverty, early football, leaving family for Lisbon',
      historicalContext: 'Born in Funchal, Madeira. Father alcoholic. Family of 4 children. Discovered by Sporting Lisbon scouts at 12.',
      keyEvents: ['Born Funchal Madeira 1985', 'Father alcoholic struggled financially', 'Left home age 12 for Sporting Lisbon', 'Father died 2005', 'Signed Man United 2003 age 18'],

      communicationPace: 'hungry',
      communicationTone: 'never_forget_roots',
      signaturePhrases: ['I remember poverty', 'That hunger never leaves you'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'cr7_manchester_united_first',
      eraName: 'manchester_united_first',
      eraTitle: 'Manchester United - First Era',
      years: '2003-2009',
      ageRange: '18-24',
      startAge: 18,
      endAge: 24,
      sequence: 2,

      fire: 40,
      metal: 25,
      wood: 18,
      earth: 12,
      water: 5,

      primaryFocus: 'Becoming world class under Sir Alex Ferguson',
      historicalContext: 'Signed by Sir Alex Ferguson. Won 3 Premier League titles. First Ballon d Or 2008. Champions League 2008.',
      keyEvents: ['Signed Man United 2003', 'Premier League titles 2007 2008 2009', 'Champions League 2008', 'Ballon dOr 2008', 'Record transfer to Real Madrid 2009'],

      communicationPace: 'explosive',
      communicationTone: 'proving_everyone_wrong',
      signaturePhrases: ['Sir Alex made me the player I am', 'I was skinny kid from Portugal nobody believed'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'cr7_real_madrid_galactico',
      eraName: 'real_madrid_galactico',
      eraTitle: 'Real Madrid - Galáctico Era',
      years: '2009-2018',
      ageRange: '24-33',
      startAge: 24,
      endAge: 33,
      sequence: 3,

      fire: 45,
      metal: 25,
      wood: 15,
      earth: 10,
      water: 5,

      primaryFocus: 'Peak years, Champions League dominance, GOAT status',
      historicalContext: 'Record transfer 94M. 450 goals in 438 games. 4 Champions League titles in 5 years. 4 Ballon dOrs.',
      keyEvents: ['World record transfer 2009', 'La Liga 2012 2017', 'Champions League 2014 2016 2017 2018', 'Ballon dOr 2013 2014 2016 2017', 'Met Georgina 2016', 'Son born 2010 twins 2017'],

      communicationPace: 'dominant',
      communicationTone: 'absolute_confidence',
      signaturePhrases: ['I am the best player in history', 'Numbers dont lie', 'SIUUUU'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'cr7_juventus_italy',
      eraName: 'juventus_italy',
      eraTitle: 'Juventus - Italian Challenge',
      years: '2018-2021',
      ageRange: '33-36',
      startAge: 33,
      endAge: 36,
      sequence: 4,

      fire: 43,
      metal: 27,
      wood: 15,
      earth: 10,
      water: 5,

      primaryFocus: 'Conquering new league, defying age',
      historicalContext: 'Transferred to Juventus for new challenge. 101 goals in 134 games. 2 Serie A titles. Defied aging.',
      keyEvents: ['Juventus transfer 2018', 'Serie A 2019 2020', 'Continued goal scoring', 'COVID quarantine Italy', 'Champions League pursuit'],

      communicationPace: 'relentless',
      communicationTone: 'age_defying',
      signaturePhrases: ['Age is just number', 'I prove myself every day', 'New country new challenge same Ronaldo'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'cr7_manchester_return',
      eraName: 'manchester_return',
      eraTitle: 'Manchester United - Troubled Return',
      years: '2021-2022',
      ageRange: '36-37',
      startAge: 36,
      endAge: 37,
      sequence: 5,

      fire: 42,
      metal: 28,
      wood: 12,
      earth: 13,
      water: 5,

      primaryFocus: 'Difficult return, son death tragedy, conflict with Ten Hag',
      historicalContext: 'Emotional return to Old Trafford. 27 goals. Son Angel died at birth April 2022. Interview ended contract.',
      keyEvents: ['Man United return 2021', 'Top scorer', 'Son Angel death April 2022', 'Conflict with manager', 'Explosive interview November 2022', 'Contract terminated'],

      communicationPace: 'frustrated',
      communicationTone: 'burning_too_hot',
      signaturePhrases: ['They betrayed me', 'I will not be disrespected', 'My son is in heaven'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'cr7_saudi_dynasty',
      eraName: 'saudi_dynasty',
      eraTitle: 'Al Nassr - Saudi Dynasty Era',
      years: '2023-present',
      ageRange: '38-40+',
      startAge: 38,
      endAge: 40,
      sequence: 6,

      fire: 45,
      metal: 25,
      wood: 15,
      earth: 10,
      water: 5,

      primaryFocus: 'Dynasty building, legacy beyond football, family man',
      historicalContext: 'Al Nassr 200M per year. 60+ goals first season. 5 children thriving. Georgina established dynasty.',
      keyEvents: ['Al Nassr January 2023', 'Record salary 200M per year', 'Continued elite scoring', 'Family settled Saudi', 'Dynasty complete'],

      communicationPace: 'satisfied',
      communicationTone: 'dynasty_builder',
      signaturePhrases: ['I am building legacy', 'Georgina keeps our family together', 'My children will carry my name'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    }
  ],

  events: [
    {
      id: 'event_cr7_ballon_dor_first',
      eventType: 'award',
      title: 'First Ballon dOr',
      date: '2008-12-02',
      year: 2008,
      description: 'Cristiano wins first Ballon dOr after Manchester United treble season',
      impact: 'Established as world best player',
      emotionalSignificance: 95,
      historicalSignificance: 90,
      relatedEras: ['cr7_manchester_united_first']
    },
    {
      id: 'event_cr7_real_madrid_record',
      eventType: 'transfer',
      title: 'World Record Transfer to Real Madrid',
      date: '2009-07-01',
      year: 2009,
      description: 'Record 94M transfer to Real Madrid from Manchester United',
      impact: 'Beginning of Galactico era',
      emotionalSignificance: 88,
      historicalSignificance: 92,
      relatedEras: ['cr7_real_madrid_galactico']
    },
    {
      id: 'event_cr7_met_georgina',
      eventType: 'personal',
      title: 'Met Georgina at Gucci Store',
      date: '2016-06-01',
      year: 2016,
      description: 'Cristiano met Georgina Rodriguez at Gucci store in Madrid. Love at first sight.',
      impact: 'Found life partner who could ground his Fire',
      emotionalSignificance: 98,
      historicalSignificance: 75,
      relatedEras: ['cr7_real_madrid_galactico']
    },
    {
      id: 'event_cr7_son_angel_death',
      eventType: 'personal_loss',
      title: 'Son Angel Death at Birth',
      date: '2022-04-18',
      year: 2022,
      description: 'Twin son Angel died at birth. Twin daughter Bella Esmeralda survived.',
      impact: 'Profound grief, Georgina held family together',
      emotionalSignificance: 100,
      historicalSignificance: 60,
      relatedEras: ['cr7_manchester_return']
    }
  ]
};

// ============================================================================
// GEORGINA RODRIGUEZ - THE KEEPER OF THE REALM
// ============================================================================

const georginaRodriguezData = {
  guestProfile: {
    id: 'guest_georgina_rodriguez',
    name: 'Georgina Rodriguez',
    birthDate: '1994-01-27',
    birthTime: '12:00',
    birthLocation: 'Jaca, Aragon, Spain',

    category: 'celebrity',
    subcategory: 'influencer',

    // Constitutional elements
    earth: 40,
    water: 20,
    metal: 20,
    wood: 15,
    fire: 5,

    // Chinese Astrology
    chineseYear: 'Dog',
    chineseElement: 'Wood',
    chineseSign: 'Wood Dog',
    dayMaster: 'Yin Earth',
    dayMasterChinese: '己土',

    // Western Astrology
    sunSign: 'Aquarius',
    moonSign: 'Unknown',
    risingSign: 'Unknown',

    // MBTI
    mbti: 'ISFJ',
    enneagram: '2w3',

    totalEras: 5,
    primaryEra: 'saudi_dynasty',
    nickname: 'The Keeper of the Realm',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'geo_jaca_poverty',
      eraName: 'jaca_poverty',
      eraTitle: 'Jaca & Early Hardship',
      years: '1994-2016',
      ageRange: '0-22',
      startAge: 0,
      endAge: 22,
      sequence: 1,

      earth: 35,
      water: 25,
      metal: 15,
      wood: 20,
      fire: 5,

      primaryFocus: 'Poverty, father imprisonment, becoming independent',
      historicalContext: 'Born Jaca small town. Father imprisoned for financial crime. Au pair in UK. Gucci sales assistant Madrid.',
      keyEvents: ['Born Jaca Spain 1994', 'Father imprisoned', 'Au pair UK teenager', 'Gucci store Madrid 2016', 'Met Cristiano June 2016'],

      communicationPace: 'reserved',
      communicationTone: 'humble_strength',
      signaturePhrases: ['I was a girl from a small town', 'I worked for everything'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'geo_meeting_love',
      eraName: 'meeting_love',
      eraTitle: 'Meeting Cristiano - The Gucci Moment',
      years: '2016-2017',
      ageRange: '22-23',
      startAge: 22,
      endAge: 23,
      sequence: 2,

      earth: 38,
      water: 22,
      metal: 18,
      wood: 17,
      fire: 5,

      primaryFocus: 'Love at first sight, entering his world, instant motherhood',
      historicalContext: 'Met Cristiano June 2016. Love at first sight. Instant mother to 4 children. Pregnant with Alana Martina.',
      keyEvents: ['Met Cristiano June 2016', 'Love at first sight', 'Instant mother 4 children', 'Pregnant Alana Martina 2017', 'Real Madrid era'],

      communicationPace: 'adapting',
      communicationTone: 'fairy_tale_reality',
      signaturePhrases: ['Our eyes met time stopped', 'I fell in love with him and his children'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'geo_madrid_juventus',
      eraName: 'madrid_juventus',
      eraTitle: 'Madrid to Turin - Portable Home Strategy',
      years: '2017-2021',
      ageRange: '23-27',
      startAge: 23,
      endAge: 27,
      sequence: 3,

      earth: 40,
      water: 20,
      metal: 20,
      wood: 15,
      fire: 5,

      primaryFocus: 'First major move, proving adaptability, brand building',
      historicalContext: 'Move Madrid to Turin with 4 children. Learned Italian. Netflix show. Brand emergence.',
      keyEvents: ['Madrid to Turin 2018', 'Learned Italian', 'Social media exploding', 'First fashion campaigns', 'Portable home mastered'],

      communicationPace: 'confident',
      communicationTone: 'portable_home_creator',
      signaturePhrases: ['Home is wherever our family is together', 'I create stability anywhere'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'geo_manchester_tragedy',
      eraName: 'manchester_tragedy',
      eraTitle: 'Manchester United - Loss & Resilience',
      years: '2021-2022',
      ageRange: '27-28',
      startAge: 27,
      endAge: 28,
      sequence: 4,

      earth: 42,
      water: 22,
      metal: 18,
      wood: 13,
      fire: 5,

      primaryFocus: 'Return to Manchester, twin pregnancy, son death, family resilience',
      historicalContext: 'Move to Manchester. Pregnant with twins. Son Angel died at birth April 2022. Held family together.',
      keyEvents: ['Move Manchester 2021', 'Pregnant twins 2022', 'Son Angel died April 2022', 'Daughter Bella survived', 'Family grief processed'],

      communicationPace: 'resilient',
      communicationTone: 'earth_absorbing_pain',
      signaturePhrases: ['Angel is in heaven', 'I am mother to six children five here one there'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    },
    {
      id: 'geo_saudi_dynasty',
      eraName: 'saudi_dynasty',
      eraTitle: 'Saudi Arabia - Dynasty & Independence',
      years: '2023-present',
      ageRange: '28-30+',
      startAge: 28,
      endAge: 30,
      sequence: 5,

      earth: 40,
      water: 20,
      metal: 20,
      wood: 15,
      fire: 5,

      primaryFocus: 'Ultimate portable home test, Netflix show, independent brand',
      historicalContext: 'Fifth international move. I Am Georgina Netflix show. Fashion icon. Dynasty matriarch.',
      keyEvents: ['Saudi Arabia 2023', 'Netflix I Am Georgina', 'Fashion campaigns', 'Five children thriving', 'Dynasty complete'],

      communicationPace: 'established',
      communicationTone: 'dynasty_matriarch',
      signaturePhrases: ['I am Georgina not just Ronaldos girlfriend', 'I create home anywhere in the world'],

      calibrationFile: 'CristianoRonaldo_Georgina.zip'
    }
  ],

  events: [
    {
      id: 'event_geo_met_cristiano',
      eventType: 'personal',
      title: 'Met Cristiano at Gucci Store',
      date: '2016-06-01',
      year: 2016,
      description: 'Georgina met Cristiano Ronaldo while working at Gucci store in Madrid. Both describe it as love at first sight.',
      impact: 'Life changed from 10 euro per hour to billionaire dynasty',
      emotionalSignificance: 100,
      historicalSignificance: 70,
      relatedEras: ['geo_jaca_poverty', 'geo_meeting_love']
    },
    {
      id: 'event_geo_netflix_show',
      eventType: 'career',
      title: 'I Am Georgina Netflix Show',
      date: '2022-01-27',
      year: 2022,
      description: 'Netflix documentary series I Am Georgina premiered, establishing her independent brand',
      impact: 'Independent identity beyond Ronaldos girlfriend',
      emotionalSignificance: 88,
      historicalSignificance: 75,
      relatedEras: ['geo_manchester_tragedy', 'geo_saudi_dynasty']
    },
    {
      id: 'event_geo_son_angel_death',
      eventType: 'personal_loss',
      title: 'Son Angel Death at Birth',
      date: '2022-04-18',
      year: 2022,
      description: 'Twin son Angel died at birth. She held entire family together through unbearable grief.',
      impact: 'Earth absorbed pain for entire family',
      emotionalSignificance: 100,
      historicalSignificance: 60,
      relatedEras: ['geo_manchester_tragedy']
    }
  ]
};

// ============================================================================
// COUPLE RELATIONSHIP DATA
// ============================================================================

const cristianoGeorginaCoupleData = {
  coupleId: 'couple_cristiano_georgina',
  person1Id: 'guest_cristiano_ronaldo',
  person2Id: 'guest_georgina_rodriguez',

  relationshipType: 'PARTNERS_WITH',
  meetingDate: '2016-06-01',
  yearsTogether: 8,

  compatibilityScore: 92,

  dynamicType: 'Fire Builds on Earth',
  dynamicDescription: 'Yang Fire (45%) cannot burn Yin Earth (40%) - it builds dynasty instead. Kiln metaphor.',

  person1Element: 'Yang Fire',
  person2Element: 'Yin Earth',

  sharedValues: [
    'Family above everything',
    'Discipline and excellence',
    'Building legacy for children',
    'Brand control and image management',
    'Defying expectations',
    'Loyalty through all challenges',
    'Children privacy protection',
    'Wealth as security'
  ],

  children: [
    'Cristiano Jr 2010',
    'Eva and Mateo 2017 twins',
    'Alana Martina 2017',
    'Bella Esmeralda 2022',
    'Angel 2022 died at birth'
  ],

  portableHomeMoves: [
    'Madrid Spain 2016-2018',
    'Turin Italy 2018-2021',
    'Manchester UK 2021-2022',
    'Riyadh Saudi Arabia 2023-present'
  ],

  historicalSignificance: [
    'Most portable couple 5 countries 8 years',
    'First influencer dynasty Netflix Instagram',
    'Matriarch model 5 children no stepchildren distinction',
    'Grief resilience Angel death survived',
    'Fire plus Earth dynasty building',
    'Independent brands within partnership',
    'Most famous athlete plus rising star partner'
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
    MERGE (p1)-[r:PARTNERS_WITH]->(p2)
    SET r.coupleId = $coupleId,
        r.meetingDate = $meetingDate,
        r.yearsTogether = $yearsTogether,
        r.compatibilityScore = $compatibilityScore,
        r.dynamicType = $dynamicType,
        r.dynamicDescription = $dynamicDescription,
        r.person1Element = $person1Element,
        r.person2Element = $person2Element,
        r.sharedValues = $sharedValues,
        r.children = $children,
        r.portableHomeMoves = $portableHomeMoves,
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
    SET c.name = 'Cristiano Ronaldo & Georgina Rodriguez',
        c.displayName = 'Cristiano & Georgina',
        c.tagline = 'The Dynasty Builders: When Fire Meets Unburnable Earth',
        c.meetingDate = $meetingDate,
        c.yearsTogether = $yearsTogether,
        c.compatibilityScore = $compatibilityScore,
        c.dynamicType = $dynamicType,
        c.dynamicDescription = $dynamicDescription,
        c.sharedValues = $sharedValues,
        c.children = $children,
        c.portableHomeMoves = $portableHomeMoves,
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

async function loadCristianoGeorginaNetwork() {
  const session = driver.session();

  try {
    console.log('\n========================================');
    console.log('CRISTIANO & GEORGINA - Neo4j Loader');
    console.log('Dynasty Builders Network');
    console.log('========================================\n');

    // Load Cristiano Ronaldo
    console.log('Loading Cristiano Ronaldo - The Relentless Sun...');
    const cristiano = await loadGuestProfile(session, cristianoRonaldoData.guestProfile);
    console.log(`  ✓ Profile: ${cristiano.get('name')} (${cristiano.get('id')})`);

    for (const era of cristianoRonaldoData.guestEras) {
      const eraResult = await loadGuestEra(session, cristianoRonaldoData.guestProfile.id, era);
      console.log(`    ✓ Era: ${eraResult.get('title')}`);
    }

    for (const event of cristianoRonaldoData.events) {
      const eventResult = await loadEvent(session, cristianoRonaldoData.guestProfile.id, event);
      console.log(`    ✓ Event: ${eventResult.get('title')}`);
    }

    // Load Georgina Rodriguez
    console.log('\nLoading Georgina Rodriguez - The Keeper of the Realm...');
    const georgina = await loadGuestProfile(session, georginaRodriguezData.guestProfile);
    console.log(`  ✓ Profile: ${georgina.get('name')} (${georgina.get('id')})`);

    for (const era of georginaRodriguezData.guestEras) {
      const eraResult = await loadGuestEra(session, georginaRodriguezData.guestProfile.id, era);
      console.log(`    ✓ Era: ${eraResult.get('title')}`);
    }

    for (const event of georginaRodriguezData.events) {
      const eventResult = await loadEvent(session, georginaRodriguezData.guestProfile.id, event);
      console.log(`    ✓ Event: ${eventResult.get('title')}`);
    }

    // Load Couple Relationship
    console.log('\nLoading Cristiano-Georgina Couple Relationship...');
    const relationship = await loadCoupleRelationship(session, cristianoGeorginaCoupleData);
    console.log(`  ✓ Relationship: PARTNERS_WITH (${relationship.get('compatibility')}% compatibility)`);

    const couple = await createCoupleNode(session, cristianoGeorginaCoupleData);
    console.log(`  ✓ Couple Node: ${couple.get('id')}`);

    console.log('\n========================================');
    console.log('CRISTIANO & GEORGINA NETWORK LOADED');
    console.log('========================================');
    console.log('\nSummary:');
    console.log('  - Cristiano Ronaldo: 6 eras, 4 events');
    console.log('  - Georgina Rodriguez: 5 eras, 3 events');
    console.log('  - Couple: 92% compatibility, 8 years together');
    console.log('  - Dynamic: Fire Builds on Earth (Kiln)');
    console.log('  - Portable Home: 5 countries (Madrid, Turin, Manchester, Riyadh)');
    console.log('  - Children: 5 living + 1 in heaven (Angel)');
    console.log('\n');

  } catch (error) {
    console.error('Error loading Cristiano-Georgina network:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the loader
loadCristianoGeorginaNetwork()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
