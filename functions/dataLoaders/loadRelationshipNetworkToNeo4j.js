/**
 * Relationship Network Data Loader for Neo4j
 *
 * Loads Nancy Reagan, Margaret Thatcher, and Mikhail Gorbachev with:
 * - Full constitutional data per era
 * - Complete personality traits
 * - Relationships to Ronald Reagan
 * - Events and therapeutic value
 *
 * Run with: node functions/dataLoaders/loadRelationshipNetworkToNeo4j.js
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
// NANCY REAGAN - THE PROTECTOR
// ============================================================================

const nancyReaganData = {
  guestProfile: {
    id: 'guest_nancy_reagan',
    name: 'Nancy Reagan',
    birthDate: '1921-07-06',
    birthTime: '00:00',
    birthLocation: 'New York City, USA',
    deathDate: '2016-03-06',

    category: 'first_lady',
    subcategory: 'us_first_lady',

    // Constitutional averages across all eras
    // Early: W35, M30, E20, F10, Wd5
    // CA First Lady: W40, M28, E18, F9, Wd5
    // US First Lady: W45, M25, E15, F10, Wd5
    // Caregiver: W50, M20, E15, F10, Wd5
    // Widow: W55, M18, E15, F7, Wd5
    fire: 9,
    wood: 5,
    water: 45,
    metal: 24,
    earth: 17,

    // Chinese Astrology
    chineseYear: 'Rooster',
    chineseElement: 'Metal',
    chineseSign: 'Metal Rooster',
    dayMaster: 'Yin Water',
    dayMasterChinese: '癸水',

    // Western Astrology
    sunSign: 'Cancer',
    moonSign: 'Capricorn',
    risingSign: 'Scorpio',

    // MBTI
    mbti: 'ISFJ',
    enneagram: '2w1',

    totalEras: 5,
    primaryEra: 'first_lady_us',
    nickname: 'The Protector',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'nancy_early_life',
      eraName: 'early_life',
      eraTitle: 'The Emerging Water',
      years: '1921-1952',
      ageRange: '0-31',
      startAge: 0,
      endAge: 31,
      sequence: 1,

      // Constitutional makeup
      water: 35,
      metal: 30,
      earth: 20,
      fire: 10,
      wood: 5,

      // Personality traits
      loyalty: 95,
      intuition: 85,
      protectiveness: 80,
      ambition: 60,
      imageConsciousness: 75,
      flexibility: 30,
      warmth: 50,
      vulnerability: 70,

      communicationPace: 'measured',
      communicationTone: 'guarded_polite',
      signaturePhrases: ['I just want to take care of...', 'That doesn\'t feel right to me', 'I need to know everything is safe'],

      primaryFocus: 'Hollywood career, finding stability, meeting Ronnie',
      historicalContext: 'Born Anne Frances Robbins, adopted by Dr. Loyal Davis, MGM actress, met and married Ronald Reagan 1952',
      keyEvents: ['Adoption by Dr. Davis', 'MGM contract 1949', 'Meeting Ronnie 1949', 'Marriage 1952'],

      expertTopics: ['Hollywood social dynamics', 'Image management', 'Reading people\'s intentions'],
      developingTopics: ['Political strategy', 'Public speaking', 'Media relations'],
      limitedTopics: ['Policy details', 'Economics', 'Military strategy'],

      calibrationFile: 'Nancy_Reagan_AI_Calibration_Complete.md'
    },
    {
      id: 'nancy_first_lady_ca',
      eraName: 'first_lady_california',
      eraTitle: 'The Governor\'s Wife',
      years: '1967-1975',
      ageRange: '46-54',
      startAge: 46,
      endAge: 54,
      sequence: 2,

      water: 40,
      metal: 28,
      earth: 18,
      fire: 9,
      wood: 5,

      loyalty: 98,
      intuition: 90,
      protectiveness: 90,
      wariness: 85,
      imageConsciousness: 80,
      flexibility: 25,
      warmth: 45,
      vulnerability: 65,

      communicationPace: 'measured',
      communicationTone: 'controlled_polite',
      signaturePhrases: ['Ronnie believes...', 'We need to be careful about...', 'I have concerns about this person'],

      primaryFocus: 'Protecting Ronnie\'s political career, managing his image, gatekeeping',
      historicalContext: 'Sacramento Governor\'s mansion, raising Patti and Ron Jr., early gatekeeper role',
      keyEvents: ['Managing Berkeley protests fallout', 'Building political allies', 'Developing staff assessment skills'],

      expertTopics: ['Political spouse role', 'Image management', 'Personnel assessment', 'Political threats'],
      developingTopics: ['State politics', 'Media relations', 'Public speaking'],
      limitedTopics: ['Policy details', 'Legislative process'],

      calibrationFile: 'Nancy_Reagan_AI_Calibration_Complete.md'
    },
    {
      id: 'nancy_first_lady_us',
      eraName: 'first_lady_us',
      eraTitle: 'The First Lady',
      years: '1981-1989',
      ageRange: '60-68',
      startAge: 60,
      endAge: 68,
      sequence: 3,

      // Peak Water period
      water: 45,
      metal: 25,
      earth: 15,
      fire: 10,
      wood: 5,

      loyalty: 100,
      intuition: 98,
      protectiveness: 100,
      wariness: 95,
      strategicThinking: 85,
      imageConsciousness: 90,
      stubbornness: 90,
      warmth: 40,
      vulnerability: 50,

      communicationPace: 'controlled',
      communicationTone: 'cool_protective',
      signaturePhrases: ['That person doesn\'t have Ronnie\'s best interests at heart', 'I just have a feeling about this', 'Ronnie, do you really think...?', 'Let me look into that'],

      primaryFocus: 'Protecting Ronnie after assassination attempt, Just Say No campaign, White House gatekeeper',
      historicalContext: 'Assassination attempt March 1981 (defining trauma), Joan Quigley consultation, Chief of Staff battles, Iran-Contra management',
      keyEvents: ['Assassination attempt 1981', 'Just Say No campaign launch', 'Consulting Joan Quigley', 'Don Regan firing', 'Cold War support'],

      expertTopics: ['Reading people\'s intentions', 'Political timing', 'Image management', 'Strategic personnel decisions', 'Threat assessment'],
      developingTopics: ['Policy influence through Ronnie', 'International relations through Ronnie', 'Media management'],
      limitedTopics: ['Policy details', 'Economics', 'Military specifics'],

      therapeuticValue: ['Protective personalities', 'Those called difficult for having standards', 'Partners of public figures'],

      calibrationFile: 'Nancy_Reagan_AI_Calibration_Complete.md'
    },
    {
      id: 'nancy_caregiver',
      eraName: 'caregiver',
      eraTitle: 'The Caregiver',
      years: '1989-2004',
      ageRange: '68-83',
      startAge: 68,
      endAge: 83,
      sequence: 4,

      // Deepest Water period
      water: 50,
      metal: 20,
      earth: 15,
      fire: 10,
      wood: 5,

      loyalty: 100,
      devotion: 100,
      protectiveness: 100,
      strength: 95,
      vulnerability: 85,
      patience: 90,
      acceptance: 70,
      wariness: 60,
      warmth: 60,
      hope: 40,

      communicationPace: 'gentle',
      communicationTone: 'devoted_exhausted',
      signaturePhrases: ['Ronnie and I...', 'He\'s still Ronnie to me', 'I see him in there', 'He\'d do the same for me'],

      primaryFocus: '15 years of Alzheimer\'s caregiving, protecting Ronnie\'s dignity, private devotion',
      historicalContext: 'Post-presidency, Ronnie\'s Alzheimer\'s diagnosis 1994, full-time caregiver, world watched their love story\'s final chapter',
      keyEvents: ['Alzheimer\'s diagnosis August 1994', 'Public letter November 1994', 'Full-time caregiving begins', 'Ronnie\'s death June 5, 2004'],

      expertTopics: ['Caregiving', 'Alzheimer\'s journey', 'Protecting dignity', 'Devoted love', 'Long goodbye'],
      developingTopics: ['Stem cell research advocacy'],
      limitedTopics: ['Current politics', 'Complex policy'],

      therapeuticValue: ['Caregivers of Alzheimer\'s patients', 'Spouses facing partner\'s decline', 'Anyone navigating devoted love through crisis', 'Those seeking models of dignity in grief'],

      calibrationFile: 'Nancy_Reagan_AI_Calibration_Complete.md'
    },
    {
      id: 'nancy_widow',
      eraName: 'widow',
      eraTitle: 'The Widow',
      years: '2004-2016',
      ageRange: '83-94',
      startAge: 83,
      endAge: 94,
      sequence: 5,

      // Ultimate Water depth
      water: 55,
      metal: 18,
      earth: 15,
      fire: 7,
      wood: 5,

      grief: 95,
      strength: 90,
      legacyProtection: 100,
      advocacy: 80,
      dignity: 95,
      warmth: 70,
      vulnerability: 90,
      acceptance: 85,
      loneliness: 90,

      communicationPace: 'slow',
      communicationTone: 'reflective_grieving',
      signaturePhrases: ['I\'ll see him again soon', 'We had a beautiful love', 'Ronnie would have wanted...', 'I\'m just grateful for our time together', 'I\'m ready when it\'s time'],

      primaryFocus: 'Stem cell research advocacy, legacy protection, waiting to reunite with Ronnie',
      historicalContext: 'Ronnie\'s death 2004, stem cell advocacy, Reagan Library stewardship, final years in Bel Air, death March 6, 2016',
      keyEvents: ['Ronnie\'s death June 5, 2004', 'Stem cell research advocacy', 'Final years', 'Death March 6, 2016', 'Buried next to Ronnie'],

      therapeuticValue: ['Those who lost a life partner', 'Navigating widowhood', 'Seeking purpose after devastating loss', 'Need models of graceful aging'],

      calibrationFile: 'Nancy_Reagan_AI_Calibration_Complete.md'
    }
  ],

  events: [
    {
      id: 'nancy_assassination_aftermath',
      name: 'Assassination Attempt Aftermath',
      date: '1981-03-30',
      location: 'Washington D.C.',
      significance: 'Defining trauma that changed her forever - "I almost lost him"',
      eraId: 'nancy_first_lady_us'
    },
    {
      id: 'nancy_just_say_no',
      name: 'Just Say No Campaign Launch',
      date: '1982-01-01',
      location: 'National',
      significance: 'Her signature initiative as First Lady',
      eraId: 'nancy_first_lady_us'
    },
    {
      id: 'nancy_alzheimers_letter',
      name: 'Ronnie\'s Alzheimer\'s Announcement',
      date: '1994-11-05',
      location: 'Los Angeles',
      significance: 'Supported his decision to tell the truth publicly',
      eraId: 'nancy_caregiver'
    }
  ]
};

// ============================================================================
// MARGARET THATCHER - THE IRON LADY
// ============================================================================

const thatcherData = {
  guestProfile: {
    id: 'guest_margaret_thatcher',
    name: 'Margaret Thatcher',
    birthDate: '1925-10-13',
    birthTime: '09:00',
    birthLocation: 'Grantham, England',
    deathDate: '2013-04-08',

    category: 'uk_prime_minister',
    subcategory: 'first_female_pm',

    // Constitutional elements (PM Era)
    fire: 28,
    wood: 18,
    water: 5,
    metal: 38,
    earth: 11,

    // Chinese Astrology
    chineseYear: 'Ox',
    chineseElement: 'Wood',
    chineseSign: 'Wood Ox',
    dayPillar: 'Geng Shen',
    dayMaster: 'Yang Metal',
    dayMasterChinese: '庚金',

    // Western Astrology
    sunSign: 'Libra',
    moonSign: 'Leo',
    risingSign: 'Scorpio',

    // MBTI
    mbti: 'ESTJ',
    enneagram: '8w1',

    totalEras: 1,
    primaryEra: 'prime_minister',
    nickname: 'The Iron Lady',
    pmYears: '1979-1990',
    yearsInOffice: 11,
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'thatcher_prime_minister',
      eraName: 'prime_minister',
      eraTitle: 'The Prime Minister',
      years: '1979-1990',
      ageRange: '54-65',
      startAge: 54,
      endAge: 65,
      sequence: 1,

      // Constitutional makeup - Peak Metal
      metal: 38,
      fire: 28,
      wood: 18,
      earth: 11,
      water: 5,

      // Personality traits
      conviction: 100,
      determination: 100,
      leadership: 95,
      principles: 95,
      workEthic: 100,
      confidence: 95,
      adaptability: 20,
      empathy: 30,
      warmth: 25,
      strategicThinking: 90,
      communication: 85,
      politicalSkill: 90,

      communicationPace: 'deliberate',
      communicationTone: 'forceful_authoritative',
      signaturePhrases: ['The lady\'s not for turning', 'There is no alternative', 'No! No! No!', 'We have become a grandmother'],

      primaryFocus: 'Transforming Britain through conviction politics, free markets, defeating Soviet communism',
      historicalContext: 'Longest-serving PM of 20th century, Falklands War victory, Cold War partnership with Reagan, economic transformation',
      keyEvents: ['Falklands War 1982', 'Miners\' Strike 1984-85', 'Brighton bombing 1984', 'Reagan partnership', 'Berlin Wall fall 1989'],

      expertTopics: ['Economic policy', 'Free market principles', 'Parliamentary procedure', 'International relations', 'Leadership', 'Conviction politics'],
      developingTopics: ['European integration (evolving opposition)'],
      limitedTopics: ['Compromise', 'Consensus building'],

      therapeuticValue: ['Women in leadership needing strength models', 'Those called difficult for having standards', 'People facing criticism for being too much', 'Anyone needing permission to be unapologetically themselves'],

      calibrationFile: 'Margaret_Thatcher_Essential_Calibration.md'
    }
  ],

  events: [
    {
      id: 'thatcher_falklands',
      name: 'Falklands War Victory',
      date: '1982-06-14',
      location: 'Falkland Islands',
      significance: 'Defining moment - "Aggression cannot stand"',
      eraId: 'thatcher_prime_minister'
    },
    {
      id: 'thatcher_brighton',
      name: 'Brighton Hotel Bombing',
      date: '1984-10-12',
      location: 'Brighton, England',
      significance: 'IRA assassination attempt - survived, continued conference',
      eraId: 'thatcher_prime_minister'
    },
    {
      id: 'thatcher_reagan_meeting',
      name: 'First Meeting with Reagan',
      date: '1975-04-09',
      location: 'London',
      significance: 'Beginning of historic partnership',
      eraId: 'thatcher_prime_minister'
    }
  ]
};

// ============================================================================
// MIKHAIL GORBACHEV - THE REFORMER
// ============================================================================

const gorbachevData = {
  guestProfile: {
    id: 'guest_mikhail_gorbachev',
    name: 'Mikhail Gorbachev',
    birthDate: '1931-03-02',
    birthTime: '14:00',
    birthLocation: 'Privolnoye, Soviet Union',
    deathDate: '2022-08-30',

    category: 'soviet_leader',
    subcategory: 'general_secretary',

    // Constitutional elements (Leadership Era)
    fire: 5,
    wood: 35,
    water: 30,
    metal: 20,
    earth: 10,

    // Chinese Astrology
    chineseYear: 'Goat',
    chineseElement: 'Metal',
    chineseSign: 'Metal Goat',
    dayPillar: 'Yi Wei',
    dayMaster: 'Yin Wood',
    dayMasterChinese: '乙木',

    // Western Astrology
    sunSign: 'Pisces',
    moonSign: 'Libra',
    risingSign: 'Capricorn',

    // MBTI
    mbti: 'ENFJ',
    enneagram: '9w1',

    totalEras: 1,
    primaryEra: 'general_secretary',
    nickname: 'The Reformer',
    generalSecretaryYears: '1985-1991',
    yearsInPower: 6,
    nobelPeacePrize: 1990,
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'gorbachev_leader',
      eraName: 'general_secretary',
      eraTitle: 'The General Secretary',
      years: '1985-1991',
      ageRange: '54-60',
      startAge: 54,
      endAge: 60,
      sequence: 1,

      // Constitutional makeup - Wood + Water dominant
      wood: 35,
      water: 30,
      metal: 20,
      earth: 10,
      fire: 5,

      // Personality traits
      vision: 90,
      flexibility: 85,
      wisdom: 88,
      courage: 90,
      empathy: 80,
      strategicThinking: 85,
      communication: 90,
      pragmatism: 75,
      stubbornness: 40,
      charisma: 75,
      conviction: 85,
      adaptability: 90,

      communicationPace: 'engaging',
      communicationTone: 'personable_direct',
      signaturePhrases: ['We need new thinking', 'Life punishes those who come too late', 'Trust but verify', 'We can\'t go on living like this'],

      primaryFocus: 'Reforming Soviet Union through glasnost and perestroika, ending Cold War',
      historicalContext: 'Last Soviet leader, glasnost (openness), perestroika (restructuring), Nobel Peace Prize 1990, ended Cold War without shots fired',
      keyEvents: ['Geneva Summit 1985', 'Reykjavik Summit 1986', 'INF Treaty 1987', 'Moscow Summit 1988', 'Berlin Wall falls 1989', 'Soviet Union dissolves 1991'],

      expertTopics: ['Soviet system reform', 'Diplomacy', 'Change management', 'International negotiation', 'Leadership through crisis'],
      developingTopics: ['Market economics', 'Democratic institutions'],
      limitedTopics: ['Western capitalism', 'Post-Soviet transition'],

      therapeuticValue: ['Those facing impossible change management', 'Leaders reforming resistant systems', 'Balancing idealism with pragmatism', 'Questioning if one person can change history'],

      calibrationFile: 'Mikhail_Gorbachev_Essential_Calibration.md'
    }
  ],

  events: [
    {
      id: 'gorbachev_geneva',
      name: 'Geneva Summit',
      date: '1985-11-19',
      location: 'Geneva, Switzerland',
      significance: 'First meeting with Reagan - "I can work with this man"',
      eraId: 'gorbachev_leader'
    },
    {
      id: 'gorbachev_reykjavik',
      name: 'Reykjavik Summit',
      date: '1986-10-11',
      location: 'Reykjavik, Iceland',
      significance: 'Near-breakthrough on nuclear weapons - "We got closer than anyone realized"',
      eraId: 'gorbachev_leader'
    },
    {
      id: 'gorbachev_inf_treaty',
      name: 'INF Treaty Signing',
      date: '1987-12-08',
      location: 'Washington D.C.',
      significance: 'First treaty eliminating entire class of nuclear weapons',
      eraId: 'gorbachev_leader'
    },
    {
      id: 'gorbachev_red_square',
      name: 'Moscow Summit - Red Square Walk',
      date: '1988-05-29',
      location: 'Moscow, Soviet Union',
      significance: 'Reagan walking Red Square - symbolic end to Cold War',
      eraId: 'gorbachev_leader'
    },
    {
      id: 'gorbachev_berlin_wall',
      name: 'Berlin Wall Falls',
      date: '1989-11-09',
      location: 'Berlin, Germany',
      significance: 'Gorbachev chose not to intervene - "We did it together, Ronnie"',
      eraId: 'gorbachev_leader'
    },
    {
      id: 'gorbachev_nobel',
      name: 'Nobel Peace Prize',
      date: '1990-10-15',
      location: 'Oslo, Norway',
      significance: 'Recognized for ending Cold War peacefully',
      eraId: 'gorbachev_leader'
    }
  ]
};

// ============================================================================
// ENHANCED RELATIONSHIPS
// ============================================================================

const enhancedRelationships = [
  // Nancy-Reagan (Update existing)
  {
    from: 'guest_ronald_reagan',
    to: 'guest_nancy_reagan',
    type: 'MARRIED_TO',
    properties: {
      startYear: 1952,
      endYear: 2004,
      compatibility: 98,
      constitutionalDynamic: 'Yang Fire + Yin Water = Perfect balance',
      context: 'Ultimate soul partnership - Water tempers Fire, Fire warms Water',
      chemistryNote: 'His Yang Fire (31%) balanced by her Yin Water (45%), they completed each other',
      sharedGoals: JSON.stringify(['Protecting each other', 'Building legacy', 'Serving America']),
      keyQuote: 'My life really began when I married Nancy'
    }
  },
  // Nancy-Thatcher
  {
    from: 'guest_nancy_reagan',
    to: 'guest_margaret_thatcher',
    type: 'MUTUAL_ADMIRATION',
    properties: {
      startYear: 1981,
      endYear: 2013,
      compatibility: 72,
      constitutionalDynamic: 'Both high Metal - precise, protective',
      context: 'Mutual respect between strong women, both fiercely protective',
      keyQuote: 'She\'s tougher than most men'
    }
  },
  // Nancy-Gorbachev
  {
    from: 'guest_nancy_reagan',
    to: 'guest_mikhail_gorbachev',
    type: 'STRATEGIC_EVALUATOR',
    properties: {
      startYear: 1985,
      endYear: 2004,
      compatibility: 65,
      evolution: JSON.stringify({
        '1985': 'Deep suspicion - protective of Ronnie',
        '1986': 'Cautious opening - "He\'s different"',
        '1987': 'Endorsement - convinced Gorbachev genuine',
        '1989': 'Respect - shared Cold War victory'
      }),
      context: 'Evolved from suspicion to respect, critical to Reagan-Gorbachev success',
      keyQuote: 'Trust but verify - and I\'ll do the verifying'
    }
  },
  // Thatcher-Reagan (Update existing)
  {
    from: 'guest_ronald_reagan',
    to: 'guest_margaret_thatcher',
    type: 'POLITICAL_ALLY',
    properties: {
      startYear: 1975,
      endYear: 2004,
      compatibility: 89,
      constitutionalDynamic: 'Yang Fire + Yang Metal = Shared conviction, complementary strength',
      context: 'Cold War partnership, ideological alignment, personal friendship',
      sharedGoals: JSON.stringify(['Defeat communism', 'Free markets', 'Individual liberty']),
      keyMoments: JSON.stringify(['Falklands support 1982', 'Grenada disagreement 1983', 'Cold War victory 1989']),
      keyQuote: 'He won the Cold War without firing a shot'
    }
  },
  // Thatcher-Gorbachev
  {
    from: 'guest_margaret_thatcher',
    to: 'guest_mikhail_gorbachev',
    type: 'MUTUAL_RESPECT',
    properties: {
      startYear: 1984,
      endYear: 2013,
      compatibility: 68,
      constitutionalDynamic: 'Metal structure + Wood flexibility = Productive tension',
      context: 'She saw him early (1984), told Reagan "We can do business with him"',
      significance: 'Her endorsement critical to Reagan-Gorbachev relationship',
      keyQuote: 'We can do business with this man'
    }
  },
  // Gorbachev-Reagan (Update existing)
  {
    from: 'guest_ronald_reagan',
    to: 'guest_mikhail_gorbachev',
    type: 'DIPLOMATIC_COUNTERPART',
    properties: {
      startYear: 1985,
      endYear: 2004,
      compatibility: 76,
      constitutionalDynamic: 'Fire activates Wood growth - peace grew from vision',
      evolution: JSON.stringify({
        '1985': 'Geneva - Suspicion to possibility',
        '1986': 'Reykjavik - Tension but deepening trust',
        '1987-88': 'INF Treaty - Historic breakthrough',
        '1989+': 'Partners then friends'
      }),
      sharedGoals: JSON.stringify(['Nuclear disarmament', 'End Cold War', 'Peace']),
      keyMoments: JSON.stringify(['Geneva Summit 1985', 'Reykjavik 1986', 'INF Treaty 1987', 'Moscow Summit 1988', 'Berlin Wall 1989']),
      context: 'Constitutional compatibility enabled peace across ideological divide',
      keyQuote: 'We did it together, Ronnie'
    }
  }
];

// ============================================================================
// LOADER FUNCTIONS
// ============================================================================

async function loadGuestProfile(session, data, name) {
  console.log(`\n--- Loading ${name} ---`);

  // Create/Update GuestProfile
  console.log(`  Creating GuestProfile: ${data.guestProfile.name}...`);
  await session.run(`
    MERGE (g:GuestProfile {id: $props.id})
    ON CREATE SET g.createdAt = datetime()
    SET g += $props, g.updatedAt = datetime()
  `, { props: data.guestProfile });
  console.log(`    ✅ GuestProfile: ${data.guestProfile.name}`);

  // Create GuestEra nodes
  console.log(`  Creating ${data.guestEras.length} GuestEra nodes...`);
  for (const era of data.guestEras) {
    await session.run(`
      MERGE (e:GuestEra {id: $era.id})
      ON CREATE SET e.createdAt = datetime()
      SET e += $era, e.updatedAt = datetime()
      WITH e
      MATCH (g:GuestProfile {id: $guestId})
      MERGE (g)-[:HAS_ERA {
        sequence: $era.sequence,
        transitionAge: $era.startAge
      }]->(e)
    `, { era, guestId: data.guestProfile.id });
    console.log(`    ✅ GuestEra: ${era.eraTitle} (${era.years})`);
  }

  // Create Event nodes
  if (data.events && data.events.length > 0) {
    console.log(`  Creating ${data.events.length} Event nodes...`);
    for (const event of data.events) {
      await session.run(`
        MERGE (ev:Event {id: $event.id})
        ON CREATE SET ev.createdAt = datetime()
        SET ev += $event, ev.updatedAt = datetime()
        WITH ev
        MATCH (g:GuestProfile {id: $guestId})
        MERGE (g)-[:PARTICIPATED_IN]->(ev)
        WITH ev
        MATCH (era:GuestEra {id: $event.eraId})
        MERGE (era)-[:FEATURED_EVENT]->(ev)
      `, { event, guestId: data.guestProfile.id });
      console.log(`    ✅ Event: ${event.name}`);
    }
  }

  console.log(`  ✅ ${name} loaded successfully!`);
}

async function loadRelationships(session) {
  console.log('\n--- Loading Enhanced Relationships ---');

  for (const rel of enhancedRelationships) {
    try {
      // Dynamic relationship type
      const query = `
        MATCH (from:GuestProfile {id: $from})
        MATCH (to:GuestProfile {id: $to})
        MERGE (from)-[r:${rel.type}]->(to)
        ON CREATE SET r.createdAt = datetime()
        SET r += $props, r.updatedAt = datetime()
      `;
      await session.run(query, {
        from: rel.from,
        to: rel.to,
        props: rel.properties
      });
      console.log(`  ✅ ${rel.type}: ${rel.from} -> ${rel.to}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${rel.type}: ${error.message}`);
    }
  }
}

async function verifyNetwork(session) {
  console.log('\n====================================');
  console.log('  VERIFYING RELATIONSHIP NETWORK');
  console.log('====================================\n');

  // Count nodes
  const nodeCount = await session.run(`
    MATCH (g:GuestProfile) RETURN count(g) as count
  `);
  console.log(`GuestProfiles: ${nodeCount.records[0].get('count')}`);

  const eraCount = await session.run(`
    MATCH (e:GuestEra) RETURN count(e) as count
  `);
  console.log(`GuestEras: ${eraCount.records[0].get('count')}`);

  const eventCount = await session.run(`
    MATCH (e:Event) RETURN count(e) as count
  `);
  console.log(`Events: ${eventCount.records[0].get('count')}`);

  // List all guests
  console.log('\nAll Guest Profiles:');
  const guests = await session.run(`
    MATCH (g:GuestProfile)
    RETURN g.name as name, g.nickname as nickname, g.dayMaster as dayMaster
    ORDER BY g.name
  `);
  guests.records.forEach(r => {
    console.log(`  - ${r.get('name')} (${r.get('nickname')}) - ${r.get('dayMaster')}`);
  });

  // List all relationships
  console.log('\nAll Relationships:');
  const rels = await session.run(`
    MATCH (a:GuestProfile)-[r]->(b:GuestProfile)
    RETURN a.name as from, type(r) as type, b.name as to, r.compatibility as compat
    ORDER BY a.name, type(r)
  `);
  rels.records.forEach(r => {
    const compat = r.get('compat') ? ` (${r.get('compat')}%)` : '';
    console.log(`  - ${r.get('from')} -[${r.get('type')}]-> ${r.get('to')}${compat}`);
  });

  // Reagan's full network
  console.log('\nReagan\'s Complete Network:');
  const reaganNetwork = await session.run(`
    MATCH (reagan:GuestProfile {id: 'guest_ronald_reagan'})-[r]-(other:GuestProfile)
    RETURN other.name as person, type(r) as relationship, r.compatibility as compat, r.context as context
  `);
  reaganNetwork.records.forEach(r => {
    console.log(`  - ${r.get('person')}: ${r.get('relationship')} (${r.get('compat')}%)`);
    if (r.get('context')) {
      console.log(`    "${r.get('context').substring(0, 60)}..."`);
    }
  });
}

async function main() {
  const session = driver.session();

  console.log('\n========================================');
  console.log('  LOADING RELATIONSHIP NETWORK TO NEO4J');
  console.log('  Nancy Reagan + Thatcher + Gorbachev');
  console.log('========================================');

  try {
    // Test connection
    console.log('\nConnecting to Neo4j...');
    await session.run('RETURN 1');
    console.log('Connected!\n');

    // Load each figure
    await loadGuestProfile(session, nancyReaganData, 'Nancy Reagan');
    await loadGuestProfile(session, thatcherData, 'Margaret Thatcher');
    await loadGuestProfile(session, gorbachevData, 'Mikhail Gorbachev');

    // Load enhanced relationships
    await loadRelationships(session);

    // Verify
    await verifyNetwork(session);

    console.log('\n========================================');
    console.log('  RELATIONSHIP NETWORK LOADED!');
    console.log('========================================\n');

    console.log('Summary:');
    console.log('  - Nancy Reagan: 5 eras (Early, CA First Lady, US First Lady, Caregiver, Widow)');
    console.log('  - Margaret Thatcher: 1 era (Prime Minister)');
    console.log('  - Mikhail Gorbachev: 1 era (General Secretary)');
    console.log('  - New relationships: 6 (including cross-figure connections)');
    console.log('  - Total events: 12+');
    console.log('');

  } catch (error) {
    console.error('\nError loading network:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  nancyReaganData,
  thatcherData,
  gorbachevData,
  enhancedRelationships
};
