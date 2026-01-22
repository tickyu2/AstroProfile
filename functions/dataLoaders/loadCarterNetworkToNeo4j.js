/**
 * Carter Network Data Loader for Neo4j
 *
 * Loads Jimmy Carter, Rosalynn Carter, and their couple profile:
 * - Jimmy Carter: Yang Earth (40%), The Humble Servant
 * - Rosalynn Carter: Yin Water (35%), The Steel Magnolia
 * - Carter Couple: 95% constitutional compatibility, 77-year marriage
 *
 * Run with: node functions/dataLoaders/loadCarterNetworkToNeo4j.js
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
// JIMMY CARTER - THE HUMBLE SERVANT
// ============================================================================

const jimmyCarterData = {
  guestProfile: {
    id: 'guest_jimmy_carter',
    name: 'Jimmy Carter',
    birthDate: '1924-10-01',
    birthTime: '07:00',
    birthLocation: 'Plains, Georgia, USA',

    category: 'president',
    subcategory: 'us_president',

    // Constitutional elements (Presidential era emphasis)
    earth: 40,
    water: 25,
    wood: 20,
    metal: 10,
    fire: 5,

    // Chinese Astrology
    chineseYear: 'Rat',
    chineseElement: 'Wood',
    chineseSign: 'Wood Rat',
    dayMaster: 'Yang Earth',
    dayMasterChinese: '戊土',

    // Western Astrology
    sunSign: 'Libra',
    moonSign: 'Scorpio',
    risingSign: 'Scorpio',

    // MBTI
    mbti: 'ISFJ',
    enneagram: '1w2',

    totalEras: 5,
    primaryEra: 'post_presidency',
    nickname: 'The Humble Servant',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'carter_plains_navy',
      eraName: 'plains_naval_service',
      eraTitle: 'Plains & Naval Service',
      years: '1924-1953',
      ageRange: '0-29',
      startAge: 0,
      endAge: 29,
      sequence: 1,

      earth: 35,
      water: 20,
      wood: 15,
      metal: 20,
      fire: 10,

      primaryFocus: 'Foundation building, naval engineering, return to roots',
      historicalContext: 'Born in Plains, Georgia. US Naval Academy. Nuclear submarine program under Admiral Rickover.',
      keyEvents: ['Born Plains Georgia 1924', 'Met Rosalynn Smith 1945', 'Naval Academy 1946', 'Married Rosalynn 1946', 'Nuclear submarine program', 'Father death return to Plains 1953'],

      communicationPace: 'steady',
      communicationTone: 'humble_grounded',
      signaturePhrases: ['I promised Rosalynn we would never live in Plains again', 'Then my father died and I knew I had to go back'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'carter_georgia_politics',
      eraName: 'georgia_politics',
      eraTitle: 'Georgia State Politics',
      years: '1953-1976',
      ageRange: '29-52',
      startAge: 29,
      endAge: 52,
      sequence: 2,

      earth: 38,
      water: 23,
      wood: 22,
      metal: 12,
      fire: 5,

      primaryFocus: 'Peanut farmer, state senator, governor, presidential campaign',
      historicalContext: 'Peanut farm operator, Georgia State Senator, Governor of Georgia, 1976 presidential campaign',
      keyEvents: ['Peanut farm 1953-1977', 'Georgia State Senator 1963-1967', 'Governor 1971-1975', 'Integration advocate', 'Presidential campaign 1976', 'Defeated Ford'],

      communicationPace: 'deliberate',
      communicationTone: 'moral_clarity',
      signaturePhrases: ['I will never lie to you', 'I will never mislead you'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'carter_presidency',
      eraName: 'president',
      eraTitle: 'The Presidency',
      years: '1977-1981',
      ageRange: '52-56',
      startAge: 52,
      endAge: 56,
      sequence: 3,

      earth: 40,
      water: 25,
      wood: 20,
      metal: 10,
      fire: 5,

      primaryFocus: 'Human rights, Camp David Accords, energy crisis, Iran hostage crisis',
      historicalContext: '39th President. Camp David Accords. Energy crisis. Iran hostage crisis 444 days.',
      keyEvents: ['Camp David Accords 1978', 'Panama Canal Treaties 1977', 'Department of Education created', 'Department of Energy created', 'Iran hostage crisis 1979-1981', 'Lost to Reagan 1980'],

      communicationPace: 'measured',
      communicationTone: 'presidential_humble',
      signaturePhrases: ['We must face the truth and then we can change our course', 'Human rights are as important as any other part of foreign policy'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'carter_post_presidency',
      eraName: 'post_presidency',
      eraTitle: 'Post-Presidency Renaissance',
      years: '1981-2023',
      ageRange: '56-99',
      startAge: 56,
      endAge: 99,
      sequence: 4,

      earth: 42,
      water: 27,
      wood: 20,
      metal: 8,
      fire: 3,

      primaryFocus: 'Carter Center, Habitat for Humanity, human rights, global health',
      historicalContext: 'Best ex-president. Carter Center. Habitat for Humanity. Nobel Peace Prize 2002. Guinea worm eradication.',
      keyEvents: ['Carter Center 1982', 'Habitat for Humanity decades', 'Guinea worm 99.99% eliminated', 'Nobel Peace Prize 2002', 'Longest-lived president', '77-year marriage'],

      communicationPace: 'patient',
      communicationTone: 'wise_humble',
      signaturePhrases: ['I have one life and one chance to make it count for something', 'Faith demands that I do whatever I can'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'carter_final_chapter',
      eraName: 'final_chapter',
      eraTitle: 'Final Chapter & Legacy',
      years: '2023-present',
      ageRange: '99-100+',
      startAge: 99,
      endAge: 100,
      sequence: 5,

      earth: 45,
      water: 30,
      wood: 10,
      metal: 10,
      fire: 5,

      primaryFocus: 'Rosalynn death, hospice care, reflecting on partnership',
      historicalContext: 'Rosalynn died November 2023. Jimmy in hospice. 100th birthday October 2024. Last of Greatest Generation presidents.',
      keyEvents: ['Rosalynn dementia diagnosis 2023', 'Rosalynn death November 2023', 'Hospice care February 2023', '100th birthday October 2024'],

      communicationPace: 'reflective',
      communicationTone: 'grieving_stable',
      signaturePhrases: ['She was my equal partner in everything', 'I am waiting to reunite with her'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    }
  ],

  events: [
    {
      id: 'event_camp_david_accords',
      eventType: 'diplomatic_achievement',
      title: 'Camp David Accords',
      date: '1978-09-17',
      year: 1978,
      description: 'Historic peace agreement between Egypt and Israel brokered by President Carter at Camp David',
      impact: 'Major foreign policy achievement, first Arab-Israeli peace treaty',
      emotionalSignificance: 95,
      historicalSignificance: 98,
      relatedEras: ['carter_presidency']
    },
    {
      id: 'event_iran_hostage_crisis',
      eventType: 'crisis',
      title: 'Iran Hostage Crisis',
      date: '1979-11-04',
      year: 1979,
      description: '52 American diplomats and citizens held hostage in Iran for 444 days',
      impact: 'Defined end of presidency, contributed to 1980 election loss',
      emotionalSignificance: 90,
      historicalSignificance: 95,
      relatedEras: ['carter_presidency']
    },
    {
      id: 'event_carter_center_founding',
      eventType: 'institution_founding',
      title: 'Carter Center Founded',
      date: '1982-01-01',
      year: 1982,
      description: 'Jimmy and Rosalynn Carter co-founded the Carter Center for conflict resolution, democracy, and global health',
      impact: 'Transformed post-presidency model, 50/50 partnership with Rosalynn',
      emotionalSignificance: 95,
      historicalSignificance: 92,
      relatedEras: ['carter_post_presidency']
    },
    {
      id: 'event_nobel_peace_prize',
      eventType: 'award',
      title: 'Nobel Peace Prize',
      date: '2002-10-11',
      year: 2002,
      description: 'Jimmy Carter awarded Nobel Peace Prize for decades of work toward peace and human rights',
      impact: 'International recognition of post-presidency achievements',
      emotionalSignificance: 88,
      historicalSignificance: 90,
      relatedEras: ['carter_post_presidency']
    },
    {
      id: 'event_rosalynn_death',
      eventType: 'personal_loss',
      title: 'Rosalynn Carter Death',
      date: '2023-11-19',
      year: 2023,
      description: 'Rosalynn Carter died at age 96 after 77 years of marriage to Jimmy',
      impact: 'End of presidential record 77-year marriage, profound personal loss',
      emotionalSignificance: 100,
      historicalSignificance: 85,
      relatedEras: ['carter_final_chapter']
    }
  ]
};

// ============================================================================
// ROSALYNN CARTER - THE STEEL MAGNOLIA
// ============================================================================

const rosalynnCarterData = {
  guestProfile: {
    id: 'guest_rosalynn_carter',
    name: 'Rosalynn Carter',
    birthDate: '1927-08-18',
    birthTime: '12:00',
    birthLocation: 'Plains, Georgia, USA',

    category: 'first_lady',
    subcategory: 'us_first_lady',

    // Constitutional elements
    water: 35,
    earth: 30,
    wood: 20,
    metal: 10,
    fire: 5,

    // Chinese Astrology
    chineseYear: 'Rabbit',
    chineseElement: 'Fire',
    chineseSign: 'Fire Rabbit',
    dayMaster: 'Yin Water',
    dayMasterChinese: '癸水',

    // Western Astrology
    sunSign: 'Leo',
    moonSign: 'Unknown',
    risingSign: 'Unknown',

    // MBTI
    mbti: 'INFJ',
    enneagram: '2w1',

    totalEras: 6,
    primaryEra: 'carter_center',
    nickname: 'The Steel Magnolia',
    calibrationVersion: '1.0.0',

    // Life span
    deathDate: '2023-11-19',
    ageAtDeath: 96
  },

  guestEras: [
    {
      id: 'rosalynn_plains_girl',
      eraName: 'plains_childhood',
      eraTitle: 'Plains Childhood',
      years: '1927-1946',
      ageRange: '0-19',
      startAge: 0,
      endAge: 19,
      sequence: 1,

      water: 30,
      earth: 35,
      wood: 15,
      metal: 15,
      fire: 5,

      primaryFocus: 'Small-town Georgia, family loss, meeting Jimmy',
      historicalContext: 'Father died when she was 13. Best friend was Jimmy sister Ruth. First date with Jimmy age 17.',
      keyEvents: ['Born Plains Georgia 1927', 'Father died age 13', 'Best friend Ruth Carter', 'First date age 17 1945', 'Married age 19 1946'],

      communicationPace: 'reserved',
      communicationTone: 'shy_but_strong',
      signaturePhrases: ['I was terribly shy', 'Jimmy saw something in me I did not see in myself'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'rosalynn_navy_wife',
      eraName: 'navy_wife',
      eraTitle: 'Navy Wife & Finding Voice',
      years: '1946-1953',
      ageRange: '19-26',
      startAge: 19,
      endAge: 26,
      sequence: 2,

      water: 32,
      earth: 28,
      wood: 22,
      metal: 13,
      fire: 5,

      primaryFocus: 'Navy life, discovering independence, peanut farm decision',
      historicalContext: 'Lived in Virginia, Hawaii, Connecticut. Three sons born. Jimmy quit Navy against her wishes.',
      keyEvents: ['Navy life 1946-1953', 'Three sons born', 'Loved life outside Plains', 'Jimmy father died 1953', 'Return to Plains conflict'],

      communicationPace: 'emerging',
      communicationTone: 'finding_voice',
      signaturePhrases: ['I was devastated when Jimmy decided to leave the Navy', 'If I had to go back to Plains I would make it work on my terms'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'rosalynn_business_politics',
      eraName: 'business_politics',
      eraTitle: 'Business Partner & Political Partner',
      years: '1953-1977',
      ageRange: '26-50',
      startAge: 26,
      endAge: 50,
      sequence: 3,

      water: 34,
      earth: 30,
      wood: 20,
      metal: 11,
      fire: 5,

      primaryFocus: 'Peanut farm manager, political strategist, equal partnership emerging',
      historicalContext: 'Managed peanut farm finances. Became political strategist. Governor wife. 1976 presidential campaign.',
      keyEvents: ['Peanut farm management 1953-1977', 'Jimmy politics 1963', 'Governor wife 1971-1975', 'Campaign independently 41 states', 'Amy born 1967'],

      communicationPace: 'confident',
      communicationTone: 'business_political',
      signaturePhrases: ['I was not Jimmy helper I was his business partner', 'I had earned my place as Jimmy equal partner'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'rosalynn_first_lady',
      eraName: 'first_lady',
      eraTitle: 'First Lady - Breaking Precedent',
      years: '1977-1981',
      ageRange: '50-54',
      startAge: 50,
      endAge: 54,
      sequence: 4,

      water: 35,
      earth: 30,
      wood: 20,
      metal: 10,
      fire: 5,

      primaryFocus: 'Cabinet meetings, mental health advocacy, equal partnership demonstrated',
      historicalContext: 'First First Lady to attend Cabinet meetings. Mental Health Systems Act 1980. True policy advisor.',
      keyEvents: ['Cabinet meetings unprecedented', 'Mental Health Commission', 'Mental Health Systems Act 1980', 'Policy advisor role', 'Staff had to convince both'],

      communicationPace: 'authoritative',
      communicationTone: 'steel_magnolia',
      signaturePhrases: ['Jimmy and I are equal partners That is not a press release That is our marriage', 'You have to convince both of us'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'rosalynn_carter_center',
      eraName: 'carter_center',
      eraTitle: 'Carter Center & Legacy Building',
      years: '1981-2023',
      ageRange: '54-96',
      startAge: 54,
      endAge: 96,
      sequence: 5,

      water: 37,
      earth: 32,
      wood: 18,
      metal: 8,
      fire: 5,

      primaryFocus: 'Co-founding Carter Center, mental health advocacy, 50/50 partnership pinnacle',
      historicalContext: 'Carter Center co-founder. Mental health programs worldwide. Habitat for Humanity. 77-year partnership model.',
      keyEvents: ['Carter Center co-founder 1982', 'Mental health fellowships', 'Caregiving advocacy', 'Habitat building', '77 years marriage'],

      communicationPace: 'wise',
      communicationTone: 'legacy_advocate',
      signaturePhrases: ['We are not just partners in marriage We are partners in mission', 'Mental health is health period'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    },
    {
      id: 'rosalynn_final_years',
      eraName: 'final_years',
      eraTitle: 'Final Years & Dementia',
      years: '2022-2023',
      ageRange: '95-96',
      startAge: 95,
      endAge: 96,
      sequence: 6,

      water: 40,
      earth: 35,
      wood: 10,
      metal: 10,
      fire: 5,

      primaryFocus: 'Dementia diagnosis, Jimmy caregiving, death',
      historicalContext: 'Dementia diagnosis May 2023. Jimmy cared for her. Death November 19 2023 age 96.',
      keyEvents: ['Dementia diagnosis 2023', 'Jimmy caregiving', 'Death November 19 2023', 'Funeral Jimmy wheelchair'],

      communicationPace: 'peaceful',
      communicationTone: 'legacy_complete',
      signaturePhrases: ['I have had a wonderful life', 'I have no regrets'],

      calibrationFile: 'JimmyCarterPresidentialLibrary.zip'
    }
  ],

  events: [
    {
      id: 'event_cabinet_meetings',
      eventType: 'political_precedent',
      title: 'First Lady Attends Cabinet Meetings',
      date: '1977-01-20',
      year: 1977,
      description: 'Rosalynn became the first First Lady to regularly attend Cabinet meetings',
      impact: 'Redefined First Lady role, demonstrated equal partnership',
      emotionalSignificance: 90,
      historicalSignificance: 92,
      relatedEras: ['rosalynn_first_lady']
    },
    {
      id: 'event_mental_health_act',
      eventType: 'legislation',
      title: 'Mental Health Systems Act',
      date: '1980-10-07',
      year: 1980,
      description: 'Major mental health legislation championed by Rosalynn Carter',
      impact: 'Pioneer in mental health advocacy decades before mainstream',
      emotionalSignificance: 95,
      historicalSignificance: 88,
      relatedEras: ['rosalynn_first_lady']
    }
  ]
};

// ============================================================================
// COUPLE RELATIONSHIP DATA
// ============================================================================

const carterCoupleData = {
  coupleId: 'couple_jimmy_rosalynn_carter',
  person1Id: 'guest_jimmy_carter',
  person2Id: 'guest_rosalynn_carter',

  relationshipType: 'MARRIED_TO',
  marriageDate: '1946-07-07',
  yearsMarried: 77,

  compatibilityScore: 95,

  dynamicType: 'Mountain Spring',
  dynamicDescription: 'Earth holds Water, Water nourishes Earth - neither dominates',

  person1Element: 'Yang Earth',
  person2Element: 'Yin Water',

  sharedValues: [
    'Service above self-aggrandizement',
    'Human rights as moral imperative',
    'Faith-driven action',
    'Equal partnership',
    'Hands-on work',
    'Modest lifestyle',
    'Building solutions',
    'Global health and democracy'
  ],

  children: [
    'John (Jack) Carter 1947',
    'James (Chip) Carter 1950',
    'Donnel (Jeff) Carter 1952',
    'Amy Carter 1967'
  ],

  historicalSignificance: [
    'Longest presidential marriage 77 years',
    'First First Lady in Cabinet meetings',
    'True equal partnership model',
    'Best ex-president consensus',
    'Mental health advocacy pioneer',
    'Carter Center 50/50 co-founders',
    'Habitat for Humanity hands-on builders',
    'Nobel Peace Prize 2002'
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
        r.marriageDate = $marriageDate,
        r.yearsMarried = $yearsMarried,
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
    SET c.name = 'Jimmy & Rosalynn Carter',
        c.displayName = 'Jimmy & Rosalynn Carter',
        c.tagline = 'The Equal Partners: 77 Years of Enduring Service',
        c.marriageDate = $marriageDate,
        c.yearsMarried = $yearsMarried,
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

async function loadCarterNetwork() {
  const session = driver.session();

  try {
    console.log('\n========================================');
    console.log('CARTER PRESIDENTIAL LIBRARY - Neo4j Loader');
    console.log('========================================\n');

    // Load Jimmy Carter
    console.log('Loading Jimmy Carter...');
    const jimmy = await loadGuestProfile(session, jimmyCarterData.guestProfile);
    console.log(`  ✓ Profile: ${jimmy.get('name')} (${jimmy.get('id')})`);

    for (const era of jimmyCarterData.guestEras) {
      const eraResult = await loadGuestEra(session, jimmyCarterData.guestProfile.id, era);
      console.log(`    ✓ Era: ${eraResult.get('title')}`);
    }

    for (const event of jimmyCarterData.events) {
      const eventResult = await loadEvent(session, jimmyCarterData.guestProfile.id, event);
      console.log(`    ✓ Event: ${eventResult.get('title')}`);
    }

    // Load Rosalynn Carter
    console.log('\nLoading Rosalynn Carter...');
    const rosalynn = await loadGuestProfile(session, rosalynnCarterData.guestProfile);
    console.log(`  ✓ Profile: ${rosalynn.get('name')} (${rosalynn.get('id')})`);

    for (const era of rosalynnCarterData.guestEras) {
      const eraResult = await loadGuestEra(session, rosalynnCarterData.guestProfile.id, era);
      console.log(`    ✓ Era: ${eraResult.get('title')}`);
    }

    for (const event of rosalynnCarterData.events) {
      const eventResult = await loadEvent(session, rosalynnCarterData.guestProfile.id, event);
      console.log(`    ✓ Event: ${eventResult.get('title')}`);
    }

    // Load Couple Relationship
    console.log('\nLoading Carter Couple Relationship...');
    const relationship = await loadCoupleRelationship(session, carterCoupleData);
    console.log(`  ✓ Relationship: MARRIED_TO (${relationship.get('compatibility')}% compatibility)`);

    const couple = await createCoupleNode(session, carterCoupleData);
    console.log(`  ✓ Couple Node: ${couple.get('id')}`);

    console.log('\n========================================');
    console.log('CARTER NETWORK LOADED SUCCESSFULLY');
    console.log('========================================');
    console.log('\nSummary:');
    console.log('  - Jimmy Carter: 5 eras, 5 events');
    console.log('  - Rosalynn Carter: 6 eras, 2 events');
    console.log('  - Couple: 95% compatibility, 77 years married');
    console.log('  - Dynamic: Mountain Spring (Earth + Water)');
    console.log('\n');

  } catch (error) {
    console.error('Error loading Carter network:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the loader
loadCarterNetwork()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
