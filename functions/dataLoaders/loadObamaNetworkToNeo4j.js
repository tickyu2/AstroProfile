/**
 * Obama Network Data Loader for Neo4j
 *
 * Loads Barack Obama, Michelle Obama, and 6 World Leader relationships:
 * - Angela Merkel (TRUSTED_ALLY, 85%)
 * - Justin Trudeau (MENTORSHIP, 82%)
 * - Pope Francis (SPIRITUAL_ALIGNMENT, 88%)
 * - Benjamin Netanyahu (TENSE_ALLIANCE, 65%)
 * - Xi Jinping (STRATEGIC_RIVAL, 62%)
 * - Vladimir Putin (ADVERSARIAL_RESPECT, 58%)
 *
 * Run with: node functions/dataLoaders/loadObamaNetworkToNeo4j.js
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
// BARACK OBAMA - THE BRIDGE BUILDER
// ============================================================================

const barackObamaData = {
  guestProfile: {
    id: 'guest_barack_obama',
    name: 'Barack Obama',
    birthDate: '1961-08-04',
    birthTime: '19:24',
    birthLocation: 'Honolulu, Hawaii, USA',

    category: 'president',
    subcategory: 'us_president',

    // Constitutional elements (President era emphasis)
    fire: 25,
    wood: 35,
    water: 25,
    metal: 10,
    earth: 5,

    // Chinese Astrology
    chineseYear: 'Ox',
    chineseElement: 'Metal',
    chineseSign: 'Yin Metal Ox',
    dayMaster: 'Yin Wood',
    dayMasterChinese: '乙木',

    // Western Astrology
    sunSign: 'Leo',
    moonSign: 'Gemini',
    risingSign: 'Aquarius',

    // MBTI
    mbti: 'ENFJ',
    enneagram: '9w1',

    totalEras: 4,
    primaryEra: 'president',
    nickname: 'The Bridge Builder',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'obama_community',
      eraName: 'community_organizer',
      eraTitle: 'The Community Organizer',
      years: '1985-1991',
      ageRange: '24-30',
      startAge: 24,
      endAge: 30,
      sequence: 1,

      fire: 20,
      wood: 40,
      water: 25,
      metal: 10,
      earth: 5,

      primaryFocus: 'Grassroots organizing, South Side Chicago, finding purpose',
      historicalContext: 'Community organizing on South Side, Harvard Law School',
      keyEvents: ['South Side organizing', 'Harvard Law admission', 'Law Review president'],

      communicationPace: 'deliberate',
      communicationTone: 'empathetic_questioning',
      signaturePhrases: ['Change happens from the bottom up', 'Meet people where they are'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    },
    {
      id: 'obama_senator',
      eraName: 'senator',
      eraTitle: 'The Senator',
      years: '2005-2008',
      ageRange: '44-47',
      startAge: 44,
      endAge: 47,
      sequence: 2,

      fire: 25,
      wood: 35,
      water: 25,
      metal: 10,
      earth: 5,

      primaryFocus: '2004 DNC speech, rising star, presidential campaign',
      historicalContext: 'US Senator from Illinois, Audacity of Hope, 2008 campaign',
      keyEvents: ['2004 DNC keynote', 'Senate election', 'Audacity of Hope', '2008 campaign launch'],

      communicationPace: 'rhythmic',
      communicationTone: 'inspirational_bridge_building',
      signaturePhrases: ['There is not a liberal America and a conservative America', 'Yes we can'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    },
    {
      id: 'obama_president',
      eraName: 'president',
      eraTitle: 'The President',
      years: '2009-2017',
      ageRange: '47-55',
      startAge: 47,
      endAge: 55,
      sequence: 3,

      fire: 25,
      wood: 35,
      water: 25,
      metal: 10,
      earth: 5,

      primaryFocus: 'Hope and change, ACA, economic recovery, bin Laden, climate',
      historicalContext: '44th President, first Black President, Great Recession recovery, ACA',
      keyEvents: ['Inauguration 2009', 'ACA passage 2010', 'Bin Laden raid 2011', 'Re-election 2012', 'Marriage equality 2015', 'Paris Climate 2015'],

      communicationPace: 'measured',
      communicationTone: 'presidential_thoughtful',
      signaturePhrases: ['Yes we can', 'The arc of history bends toward justice', 'That\'s not who we are'],

      expertTopics: ['Leadership under pressure', 'Constitutional law', 'Economic policy', 'Foreign diplomacy', 'Climate action'],

      therapeuticValue: ['Those seeking hope in difficult times', 'Bridge-builders across divides', 'First-generation achievers'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    },
    {
      id: 'obama_elder',
      eraName: 'elder_statesman',
      eraTitle: 'Elder Statesman',
      years: '2017-present',
      ageRange: '55+',
      startAge: 55,
      endAge: 99,
      sequence: 4,

      fire: 20,
      wood: 35,
      water: 30,
      metal: 10,
      earth: 5,

      primaryFocus: 'Obama Foundation, memoirs, democracy advocacy',
      historicalContext: 'Post-presidency, A Promised Land memoir, Michelle\'s Becoming',
      keyEvents: ['A Promised Land publication', 'Obama Foundation launch', 'Democracy advocacy'],

      communicationPace: 'reflective',
      communicationTone: 'wise_elder',
      signaturePhrases: ['The work continues', 'Each generation must do their part'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    }
  ],

  events: [
    {
      id: 'obama_dnc_2004',
      name: '2004 DNC Keynote Speech',
      date: '2004-07-27',
      year: 2004,
      description: 'Breakthrough speech that launched national political career',
      significance: 'The speech that made America notice Barack Obama',
      category: 'political'
    },
    {
      id: 'obama_inauguration_2009',
      name: 'First Inauguration',
      date: '2009-01-20',
      year: 2009,
      description: 'Sworn in as 44th President, first Black President',
      significance: 'Historic moment - "Yes we did"',
      category: 'political'
    },
    {
      id: 'obama_aca_2010',
      name: 'Affordable Care Act Signed',
      date: '2010-03-23',
      year: 2010,
      description: 'Signed ACA into law after year-long battle',
      significance: 'Healthcare reform 100 years in the making',
      category: 'policy'
    },
    {
      id: 'obama_bin_laden_2011',
      name: 'Bin Laden Raid',
      date: '2011-05-02',
      year: 2011,
      description: 'Ordered raid that killed Osama bin Laden',
      significance: 'The most difficult decision, the most uncertain call',
      category: 'national_security'
    },
    {
      id: 'obama_paris_2015',
      name: 'Paris Climate Agreement',
      date: '2015-12-12',
      year: 2015,
      description: 'Led negotiations for global climate agreement',
      significance: 'Proof that global cooperation is possible',
      category: 'diplomacy'
    }
  ]
};

// ============================================================================
// MICHELLE OBAMA - THE AUTHENTIC VOICE
// ============================================================================

const michelleObamaData = {
  guestProfile: {
    id: 'guest_michelle_obama',
    name: 'Michelle Obama',
    birthDate: '1964-01-17',
    birthTime: '12:00',
    birthLocation: 'Chicago, Illinois, USA',

    category: 'first_lady',
    subcategory: 'us_first_lady',

    fire: 38,
    wood: 20,
    water: 18,
    metal: 18,
    earth: 6,

    chineseYear: 'Rabbit',
    chineseElement: 'Water',
    chineseSign: 'Yin Water Rabbit',
    dayMaster: 'Yang Fire',
    dayMasterChinese: '丙火',

    sunSign: 'Capricorn',
    moonSign: 'Cancer',
    risingSign: 'Unknown',

    mbti: 'ENFJ',
    enneagram: '2w1',

    totalEras: 4,
    primaryEra: 'first_lady',
    nickname: 'The Authentic Voice',
    calibrationVersion: '1.0.0'
  },

  guestEras: [
    {
      id: 'michelle_south_side',
      eraName: 'south_side_roots',
      eraTitle: 'South Side Roots',
      years: '1964-1985',
      ageRange: '0-21',
      startAge: 0,
      endAge: 21,
      sequence: 1,

      fire: 30,
      wood: 25,
      water: 20,
      metal: 20,
      earth: 5,

      primaryFocus: 'Robinson family values, working class roots, Princeton admission',
      historicalContext: 'South Side Chicago, Princeton University admission',
      keyEvents: ['Princeton admission', 'Proving herself in elite institutions'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    },
    {
      id: 'michelle_lawyer',
      eraName: 'lawyer',
      eraTitle: 'The Lawyer',
      years: '1988-2002',
      ageRange: '24-38',
      startAge: 24,
      endAge: 38,
      sequence: 2,

      fire: 35,
      wood: 20,
      water: 20,
      metal: 20,
      earth: 5,

      primaryFocus: 'Harvard Law, Sidley Austin, meeting Barack, public service choice',
      historicalContext: 'Corporate law career, transition to public service',
      keyEvents: ['Harvard Law', 'Meeting Barack 1989', 'Marriage 1992', 'Public Allies'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    },
    {
      id: 'michelle_first_lady',
      eraName: 'first_lady',
      eraTitle: 'First Lady',
      years: '2009-2017',
      ageRange: '45-53',
      startAge: 45,
      endAge: 53,
      sequence: 3,

      fire: 38,
      wood: 20,
      water: 18,
      metal: 18,
      earth: 6,

      primaryFocus: 'Let\'s Move!, Joining Forces, mom-in-chief, global icon',
      historicalContext: 'First Black First Lady, redefining the role',
      keyEvents: ['Let\'s Move! launch', 'Joining Forces', 'Girls education advocacy', 'When they go low speech'],

      expertTopics: ['Authenticity', 'Women\'s empowerment', 'Health and fitness', 'Family in public life'],

      therapeuticValue: ['Those facing imposter syndrome', 'Working mothers', 'Women in leadership'],

      communicationPace: 'direct',
      communicationTone: 'warm_authentic',
      signaturePhrases: ['When they go low, we go high', 'Am I good enough? Yes I am.'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    },
    {
      id: 'michelle_becoming',
      eraName: 'becoming',
      eraTitle: 'Becoming',
      years: '2017-present',
      ageRange: '53+',
      startAge: 53,
      endAge: 99,
      sequence: 4,

      fire: 40,
      wood: 20,
      water: 20,
      metal: 15,
      earth: 5,

      primaryFocus: 'Memoir, speaking tours, full voice, girls\' education',
      historicalContext: 'Becoming bestseller, arena tours, Obama Foundation',
      keyEvents: ['Becoming publication 2018', 'Arena tour', 'Full authentic voice'],

      calibrationFile: 'OBAMA_PRESIDENTIAL_LIBRARY_COMPLETE.md'
    }
  ],

  events: [
    {
      id: 'michelle_dnc_2008',
      name: '2008 DNC Speech',
      date: '2008-08-25',
      year: 2008,
      description: 'First major speech introducing herself to America',
      significance: 'Redefining herself against attacks',
      category: 'political'
    },
    {
      id: 'michelle_lets_move',
      name: 'Let\'s Move! Launch',
      date: '2010-02-09',
      year: 2010,
      description: 'Launched childhood obesity prevention campaign',
      significance: 'Defining her First Lady platform',
      category: 'advocacy'
    },
    {
      id: 'michelle_becoming_2018',
      name: 'Becoming Published',
      date: '2018-11-13',
      year: 2018,
      description: 'Memoir becomes instant bestseller',
      significance: 'Your story is your power',
      category: 'personal'
    }
  ]
};

// ============================================================================
// WORLD LEADERS - OBAMA'S NETWORK
// ============================================================================

const worldLeadersData = [
  {
    guestProfile: {
      id: 'guest_angela_merkel',
      name: 'Angela Merkel',
      birthDate: '1954-07-17',
      birthLocation: 'Hamburg, Germany',
      category: 'world_leader',
      subcategory: 'chancellor',

      fire: 15,
      wood: 25,
      water: 35,
      metal: 20,
      earth: 5,

      dayMaster: 'Yin Water',
      dayMasterChinese: '癸水',
      sunSign: 'Cancer',
      nickname: 'The Scientist Chancellor',
      calibrationVersion: '1.0.0'
    },
    eras: [{
      id: 'merkel_chancellor',
      eraName: 'chancellor',
      eraTitle: 'The Chancellor',
      years: '2005-2021',
      sequence: 1,
      fire: 15, wood: 25, water: 35, metal: 20, earth: 5
    }]
  },
  {
    guestProfile: {
      id: 'guest_justin_trudeau',
      name: 'Justin Trudeau',
      birthDate: '1971-12-25',
      birthLocation: 'Ottawa, Canada',
      category: 'world_leader',
      subcategory: 'prime_minister',

      fire: 35,
      wood: 25,
      water: 20,
      metal: 15,
      earth: 5,

      dayMaster: 'Yang Fire',
      dayMasterChinese: '丙火',
      sunSign: 'Capricorn',
      nickname: 'The Progressive Fire',
      calibrationVersion: '1.0.0'
    },
    eras: [{
      id: 'trudeau_pm',
      eraName: 'prime_minister',
      eraTitle: 'Prime Minister',
      years: '2015-present',
      sequence: 1,
      fire: 35, wood: 25, water: 20, metal: 15, earth: 5
    }]
  },
  {
    guestProfile: {
      id: 'guest_pope_francis',
      name: 'Pope Francis',
      birthDate: '1936-12-17',
      birthLocation: 'Buenos Aires, Argentina',
      category: 'world_leader',
      subcategory: 'religious_leader',

      fire: 20,
      wood: 25,
      water: 40,
      metal: 10,
      earth: 5,

      dayMaster: 'Yin Water',
      dayMasterChinese: '癸水',
      sunSign: 'Sagittarius',
      nickname: 'The People\'s Pope',
      calibrationVersion: '1.0.0'
    },
    eras: [{
      id: 'francis_pope',
      eraName: 'pope',
      eraTitle: 'The Pope',
      years: '2013-present',
      sequence: 1,
      fire: 20, wood: 25, water: 40, metal: 10, earth: 5
    }]
  },
  {
    guestProfile: {
      id: 'guest_benjamin_netanyahu',
      name: 'Benjamin Netanyahu',
      birthDate: '1949-10-21',
      birthLocation: 'Tel Aviv, Israel',
      category: 'world_leader',
      subcategory: 'prime_minister',

      fire: 25,
      wood: 15,
      water: 20,
      metal: 35,
      earth: 5,

      dayMaster: 'Yang Metal',
      dayMasterChinese: '庚金',
      sunSign: 'Libra',
      nickname: 'The Security Hawk',
      calibrationVersion: '1.0.0'
    },
    eras: [{
      id: 'netanyahu_pm',
      eraName: 'prime_minister',
      eraTitle: 'Prime Minister',
      years: '2009-2021',
      sequence: 1,
      fire: 25, wood: 15, water: 20, metal: 35, earth: 5
    }]
  },
  {
    guestProfile: {
      id: 'guest_xi_jinping',
      name: 'Xi Jinping',
      birthDate: '1953-06-15',
      birthLocation: 'Beijing, China',
      category: 'world_leader',
      subcategory: 'president',

      fire: 20,
      wood: 15,
      water: 25,
      metal: 35,
      earth: 5,

      dayMaster: 'Yang Metal',
      dayMasterChinese: '庚金',
      sunSign: 'Gemini',
      nickname: 'The Chinese Dream',
      calibrationVersion: '1.0.0'
    },
    eras: [{
      id: 'xi_president',
      eraName: 'president',
      eraTitle: 'President',
      years: '2013-present',
      sequence: 1,
      fire: 20, wood: 15, water: 25, metal: 35, earth: 5
    }]
  },
  {
    guestProfile: {
      id: 'guest_vladimir_putin',
      name: 'Vladimir Putin',
      birthDate: '1952-10-07',
      birthLocation: 'Leningrad, Russia',
      category: 'world_leader',
      subcategory: 'president',

      fire: 30,
      wood: 10,
      water: 20,
      metal: 35,
      earth: 5,

      dayMaster: 'Yang Metal',
      dayMasterChinese: '庚金',
      sunSign: 'Libra',
      nickname: 'The Strongman',
      calibrationVersion: '1.0.0'
    },
    eras: [{
      id: 'putin_president',
      eraName: 'president',
      eraTitle: 'President',
      years: '2000-present',
      sequence: 1,
      fire: 30, wood: 10, water: 20, metal: 35, earth: 5
    }]
  }
];

// ============================================================================
// RELATIONSHIPS - Obama's Constitutional Network
// ============================================================================

const obamaRelationships = [
  // Barack & Michelle
  {
    from: 'guest_barack_obama',
    to: 'guest_michelle_obama',
    type: 'MARRIED_TO',
    props: {
      since: '1992',
      compatibility: 87,
      constitutionalDynamic: 'Fire activates Wood, Wood sustains Fire - mutual growth partnership',
      chemistryNote: 'Different but complementary - she pushes action, he provides strategy',
      keyQuote: 'She\'s my rock, my partner, my love.',
      relationshipQuality: 'activating'
    }
  },
  // Barack & Merkel
  {
    from: 'guest_barack_obama',
    to: 'guest_angela_merkel',
    type: 'TRUSTED_ALLY',
    props: {
      context: 'G8/G20 partnership, transatlantic alliance',
      compatibility: 85,
      constitutionalDynamic: 'Water nourishes Wood - deep strategic alignment',
      chemistryNote: 'Both analytical, both patient, mutual respect',
      keyQuote: 'She\'s probably the leader I\'ve worked with most closely.',
      relationshipQuality: 'strategic_partnership'
    }
  },
  // Barack & Trudeau
  {
    from: 'guest_barack_obama',
    to: 'guest_justin_trudeau',
    type: 'MENTORSHIP',
    props: {
      context: 'North American partnership, progressive alliance',
      compatibility: 82,
      constitutionalDynamic: 'Wood channels Fire - elder activating younger',
      chemistryNote: 'Obama as elder statesman, Trudeau as protégé',
      keyQuote: 'Justin reminds me of my younger self.',
      relationshipQuality: 'mentor_protege'
    }
  },
  // Barack & Pope Francis
  {
    from: 'guest_barack_obama',
    to: 'guest_pope_francis',
    type: 'SPIRITUAL_ALIGNMENT',
    props: {
      context: 'Climate, inequality, marginalized',
      compatibility: 88,
      constitutionalDynamic: 'Water nourishes Wood - soul-level connection',
      chemistryNote: 'Both bridge-builders, both pragmatists with ideals',
      keyQuote: 'We speak the same language.',
      relationshipQuality: 'spiritual_connection'
    }
  },
  // Barack & Netanyahu
  {
    from: 'guest_barack_obama',
    to: 'guest_benjamin_netanyahu',
    type: 'TENSE_ALLIANCE',
    props: {
      context: 'US-Israel alliance despite personal friction',
      compatibility: 65,
      constitutionalDynamic: 'Metal cuts Wood - fundamental friction',
      chemistryNote: 'Policy disagreements on Iran, settlements; alliance obligations',
      keyQuote: 'We don\'t have chemistry.',
      relationshipQuality: 'obligated_partnership'
    }
  },
  // Barack & Xi
  {
    from: 'guest_barack_obama',
    to: 'guest_xi_jinping',
    type: 'STRATEGIC_RIVAL',
    props: {
      context: 'US-China great power competition',
      compatibility: 62,
      constitutionalDynamic: 'Metal shapes Wood - competitive tension',
      chemistryNote: 'Respectful but competitive; climate cooperation, trade friction',
      keyQuote: 'Constructive competition.',
      relationshipQuality: 'rival_respect'
    }
  },
  // Barack & Putin
  {
    from: 'guest_barack_obama',
    to: 'guest_vladimir_putin',
    type: 'ADVERSARIAL_RESPECT',
    props: {
      context: 'US-Russia reset attempt, then confrontation',
      compatibility: 58,
      constitutionalDynamic: 'Metal cuts Wood - ice cold tension',
      chemistryNote: 'Both strategic minds, fundamentally opposed values',
      keyQuote: 'We understood each other, but our values diverged fundamentally.',
      relationshipQuality: 'cold_strategic'
    }
  }
];

// ============================================================================
// LOADER FUNCTIONS
// ============================================================================

async function loadGuestProfile(session, data) {
  const { guestProfile, guestEras, events } = data;

  console.log(`Loading ${guestProfile.name}...`);

  // Create GuestProfile node
  await session.run(`
    MERGE (g:GuestProfile {id: $id})
    SET g += $props,
        g.updatedAt = datetime()
  `, {
    id: guestProfile.id,
    props: guestProfile
  });

  // Create eras
  for (const era of (guestEras || [])) {
    await session.run(`
      MATCH (g:GuestProfile {id: $guestId})
      MERGE (e:GuestEra {id: $eraId})
      SET e += $props,
          e.updatedAt = datetime()
      MERGE (g)-[:HAS_ERA]->(e)
    `, {
      guestId: guestProfile.id,
      eraId: era.id,
      props: era
    });
  }

  // Create events
  for (const event of (events || [])) {
    await session.run(`
      MATCH (g:GuestProfile {id: $guestId})
      MERGE (e:Event {id: $eventId})
      SET e += $props,
          e.updatedAt = datetime()
      MERGE (g)-[:PARTICIPATED_IN]->(e)
    `, {
      guestId: guestProfile.id,
      eventId: event.id,
      props: event
    });
  }

  console.log(`  ✓ Loaded ${guestProfile.name} with ${guestEras?.length || 0} eras and ${events?.length || 0} events`);
}

async function loadRelationship(session, rel) {
  await session.run(`
    MATCH (a:GuestProfile {id: $from})
    MATCH (b:GuestProfile {id: $to})
    MERGE (a)-[r:${rel.type}]->(b)
    SET r += $props,
        r.updatedAt = datetime()
  `, {
    from: rel.from,
    to: rel.to,
    props: rel.props
  });

  console.log(`  ✓ ${rel.from} -[${rel.type}]-> ${rel.to} (${rel.props.compatibility}%)`);
}

async function main() {
  const session = driver.session();

  try {
    console.log('\n========================================');
    console.log('OBAMA CONSTITUTIONAL WISDOM NETWORK');
    console.log('Loading to Neo4j...');
    console.log('========================================\n');

    // Load Barack Obama
    await loadGuestProfile(session, barackObamaData);

    // Load Michelle Obama
    await loadGuestProfile(session, michelleObamaData);

    // Load World Leaders
    console.log('\nLoading World Leaders...');
    for (const leader of worldLeadersData) {
      await loadGuestProfile(session, {
        guestProfile: leader.guestProfile,
        guestEras: leader.eras,
        events: []
      });
    }

    // Load Relationships
    console.log('\nCreating Relationships...');
    for (const rel of obamaRelationships) {
      await loadRelationship(session, rel);
    }

    // Summary query
    console.log('\n========================================');
    console.log('VERIFICATION');
    console.log('========================================\n');

    const countResult = await session.run(`
      MATCH (g:GuestProfile)
      WHERE g.id STARTS WITH 'guest_barack' OR g.id STARTS WITH 'guest_michelle'
         OR g.id IN ['guest_angela_merkel', 'guest_justin_trudeau', 'guest_pope_francis',
                     'guest_benjamin_netanyahu', 'guest_xi_jinping', 'guest_vladimir_putin']
      RETURN count(g) as profiles
    `);
    console.log(`Total Obama Network Profiles: ${countResult.records[0].get('profiles')}`);

    const relResult = await session.run(`
      MATCH (a:GuestProfile)-[r]->(b:GuestProfile)
      WHERE a.id = 'guest_barack_obama'
      RETURN count(r) as relationships
    `);
    console.log(`Barack Obama Relationships: ${relResult.records[0].get('relationships')}`);

    const eraResult = await session.run(`
      MATCH (g:GuestProfile)-[:HAS_ERA]->(e:GuestEra)
      WHERE g.id IN ['guest_barack_obama', 'guest_michelle_obama']
      RETURN count(e) as eras
    `);
    console.log(`Obama Eras: ${eraResult.records[0].get('eras')}`);

    console.log('\n✅ Obama Network loaded successfully!\n');

  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch(console.error);
