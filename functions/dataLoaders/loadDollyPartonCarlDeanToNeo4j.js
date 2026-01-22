/**
 * Dolly Parton & Carl Dean Neo4j Data Loader
 * Mountain Sunshine Network: Fire (48%) + Earth (40%) = 92% Compatibility
 * 58-Year Marriage, Invisible Partner Model
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

// ========================================
// DOLLY PARTON PROFILE DATA
// ========================================

const dollyPartonData = {
  profile_id: "guest_dolly_parton",
  profile_name: "Dolly Parton",
  profile_type: "individual",
  profile_category: "guest",
  display_name: "Dolly Parton",
  nickname: "Dolly, The Queen of Country",
  tagline: "The Radiant Star - Sunshine in Human Form",
  birth_date: "1946-01-19",
  birth_location: "Sevier County, Tennessee",
  day_master: "Yang Fire",
  day_master_chinese: "Bing Fire",
  element_symbol: "丙火",

  // Five Elements
  fire: 48,
  earth: 22,
  metal: 15,
  wood: 10,
  water: 5,

  // Western Astrology
  sun_sign: "Capricorn",
  rising_sign: "Cancer",
  moon_sign: "Virgo",

  // Personality
  mbti: "ENFP",
  enneagram: "2w3",

  // Metadata
  constitutional_network: "entertainment_couples",
  user_accessible: true,
  living: true
};

const dollyEras = [
  {
    era_id: "era_dolly_smoky_mountains",
    title: "Smoky Mountains Poverty",
    years: "1946-1964",
    age_range: "0-18",
    primary_focus: "Dirt poor childhood, music gift emerges, Carl Dean meeting",
    fire: 45, earth: 25, metal: 10, wood: 15, water: 5
  },
  {
    era_id: "era_dolly_porter_wagoner",
    title: "Porter Wagoner Era - Emerging Star",
    years: "1964-1974",
    age_range: "18-28",
    primary_focus: "Porter Wagoner Show, fame building, marriage to Carl (secret)",
    fire: 48, earth: 22, metal: 15, wood: 10, water: 5
  },
  {
    era_id: "era_dolly_solo_superstar",
    title: "Solo Superstar & Crossover Success",
    years: "1974-1986",
    age_range: "28-40",
    primary_focus: "Country queen, crossover pop success, movies (9 to 5)",
    fire: 48, earth: 20, metal: 17, wood: 10, water: 5
  },
  {
    era_id: "era_dolly_dollywood_empire",
    title: "Dollywood Empire & Business Mogul",
    years: "1986-2000",
    age_range: "40-54",
    primary_focus: "Dollywood theme park, business empire, philanthropy emerging",
    fire: 48, earth: 22, metal: 18, wood: 7, water: 5
  },
  {
    era_id: "era_dolly_legend_philanthropist",
    title: "Living Legend & Philanthropist",
    years: "2000-present",
    age_range: "54-78+",
    primary_focus: "Imagination Library, COVID vaccine funding, icon status",
    fire: 48, earth: 24, metal: 15, wood: 8, water: 5
  }
];

const dollyEvents = [
  {
    event_id: "event_dolly_birth",
    title: "Born Smoky Mountains",
    date: "1946-01-19",
    description: "Born one-room cabin, Sevier County, 4th of 12 children, dirt poor",
    significance: "Fire element began in poverty"
  },
  {
    event_id: "event_dolly_radio",
    title: "Local Radio Debut",
    date: "1956",
    description: "Sang on local radio at age 10",
    significance: "Fire 45% radiating publicly"
  },
  {
    event_id: "event_dolly_opry",
    title: "Grand Ole Opry Debut",
    date: "1959",
    description: "First Grand Ole Opry appearance at age 13",
    significance: "Fire reaching Nashville"
  },
  {
    event_id: "event_dolly_meets_carl",
    title: "Meets Carl Dean",
    date: "1964",
    description: "Met Carl at Wishy Washy Laundromat, her first day in Nashville",
    significance: "Fire meets Earth - 58-year journey begins"
  },
  {
    event_id: "event_dolly_marriage",
    title: "Secret Marriage to Carl",
    date: "1966-05-30",
    description: "Private ceremony, just them and preacher, no press",
    significance: "Earth sanctuary established"
  },
  {
    event_id: "event_dolly_i_will_always_love_you",
    title: "I Will Always Love You Written",
    date: "1974",
    description: "Written to leave Porter Wagoner, later Whitney Houston hit",
    significance: "Fire breaks free to solo"
  },
  {
    event_id: "event_dolly_nine_to_five",
    title: "9 to 5 Film & Song",
    date: "1980",
    description: "Movie with Jane Fonda, Lily Tomlin; song went #1",
    significance: "Fire crosses over to pop"
  },
  {
    event_id: "event_dolly_dollywood",
    title: "Dollywood Opens",
    date: "1986",
    description: "Theme park in Tennessee mountains near birthplace",
    significance: "Earth roots honored, Metal business empire"
  },
  {
    event_id: "event_dolly_imagination_library",
    title: "Imagination Library Launched",
    date: "1995",
    description: "Free books to children monthly, inspired by father's illiteracy",
    significance: "Fire generosity unlimited"
  },
  {
    event_id: "event_dolly_covid_vaccine",
    title: "COVID Vaccine Funding",
    date: "2020",
    description: "$1 million donation to Moderna research",
    significance: "Fire generosity saves lives"
  },
  {
    event_id: "event_dolly_rock_hall",
    title: "Rock & Roll Hall of Fame",
    date: "2022",
    description: "Initially declined, then accepted",
    significance: "Fire recognized beyond country"
  }
];

// ========================================
// CARL DEAN PROFILE DATA
// ========================================

const carlDeanData = {
  profile_id: "guest_carl_dean",
  profile_name: "Carl Dean",
  profile_type: "individual",
  profile_category: "guest",
  display_name: "Carl Dean",
  nickname: "Carl, The Invisible Man",
  tagline: "The Invisible Mountain - Earth That Refuses Spotlight",
  birth_date: "1942-07-20",
  birth_location: "Nashville, Tennessee",
  day_master: "Yang Earth",
  day_master_chinese: "Wu Earth",
  element_symbol: "戊土",

  // Five Elements
  fire: 10,
  earth: 40,
  metal: 25,
  wood: 10,
  water: 15,

  // Western Astrology
  sun_sign: "Cancer",
  rising_sign: "Unknown",
  moon_sign: "Unknown",

  // Personality
  mbti: "ISTJ",
  enneagram: "9w8",

  // Metadata
  constitutional_network: "entertainment_couples",
  user_accessible: true,
  living: true
};

const carlEras = [
  {
    era_id: "era_carl_nashville_roots",
    title: "Nashville Native & Asphalt Business",
    years: "1942-1964",
    age_range: "0-22",
    primary_focus: "Nashville upbringing, asphalt paving career, meeting Dolly",
    fire: 10, earth: 38, metal: 25, wood: 10, water: 17
  },
  {
    era_id: "era_carl_secret_marriage",
    title: "Secret Marriage & Privacy Foundation",
    years: "1964-1974",
    age_range: "22-32",
    primary_focus: "Private wedding, refusing fame, establishing sanctuary",
    fire: 10, earth: 40, metal: 26, wood: 9, water: 15
  },
  {
    era_id: "era_carl_invisible_partner",
    title: "The Invisible Partner - 50 Years of Earth",
    years: "1974-2020",
    age_range: "32-78",
    primary_focus: "Asphalt business, home sanctuary, zero public life",
    fire: 10, earth: 40, metal: 25, wood: 10, water: 15
  },
  {
    era_id: "era_carl_declining_health",
    title: "Declining Health & Role Reversal",
    years: "2020-present",
    age_range: "78-82",
    primary_focus: "Dementia, Dolly tending him, reciprocal Earth care",
    fire: 10, earth: 42, metal: 23, wood: 8, water: 17
  }
];

const carlEvents = [
  {
    event_id: "event_carl_birth",
    title: "Born Nashville",
    date: "1942-07-20",
    description: "Born Nashville, Tennessee, 4 years older than Dolly",
    significance: "Earth element rooted in Nashville"
  },
  {
    event_id: "event_carl_asphalt_business",
    title: "Takes Over Family Business",
    date: "1960s",
    description: "Took over father's asphalt paving business",
    significance: "Earth work - literal foundation laying"
  },
  {
    event_id: "event_carl_meets_dolly",
    title: "Meets Dolly at Laundromat",
    date: "1964",
    description: "Wishy Washy Laundromat, said 'You're gonna get sunburn'",
    significance: "Earth recognizes Fire"
  },
  {
    event_id: "event_carl_marriage",
    title: "Secret Marriage to Dolly",
    date: "1966-05-30",
    description: "Private ceremony, just them and preacher",
    significance: "Earth provides sanctuary from Day 1"
  },
  {
    event_id: "event_carl_no_wingdings",
    title: "No Wingdings Declaration",
    date: "1966",
    description: "Declared he would never attend industry events",
    significance: "Metal boundary absolute - never broken in 58 years"
  },
  {
    event_id: "event_carl_dementia",
    title: "Dementia Diagnosis",
    date: "2020s",
    description: "Declining health, Dolly becomes caretaker",
    significance: "Reciprocal Earth - she tends him now"
  }
];

// ========================================
// COUPLE PROFILE DATA
// ========================================

const coupleData = {
  couple_id: "couple_dolly_parton_carl_dean",
  couple_name: "Dolly Parton & Carl Dean",
  tagline: "Mountain Sunshine: When Fire Meets Immovable Earth",
  compatibility_score: 92,
  years_together: 60,
  years_married: 58,
  meeting_date: "1964",
  wedding_date: "1966-05-30",
  relationship_type: "MARRIED_TO",
  children: "None (by choice)",

  // Dynamic
  dynamic_primary: "Fire (48%) + Earth (40%) = Mountain Sunshine",
  dynamic_metaphor: "Mountain doesn't move. Sunshine does. Mountain provides peak for sunshine.",
  unique_factor: "Most invisible celebrity spouse - ZERO public appearances in 58 years",

  // Constitutional Network
  constitutional_network: "entertainment_couples"
};

// ========================================
// LOADER FUNCTIONS
// ========================================

async function loadDollyPartonProfile(session) {
  console.log('Loading Dolly Parton profile...');

  await session.run(`
    MERGE (p:GuestProfile {profile_id: $profile_id})
    SET p += $props,
        p.updated_at = datetime()
    RETURN p
  `, {
    profile_id: dollyPartonData.profile_id,
    props: dollyPartonData
  });

  console.log('✓ Dolly Parton profile loaded');
}

async function loadDollyEras(session) {
  console.log('Loading Dolly Parton eras...');

  for (const era of dollyEras) {
    await session.run(`
      MATCH (p:GuestProfile {profile_id: $profile_id})
      MERGE (e:GuestEra {era_id: $era_id})
      SET e += $props,
          e.updated_at = datetime()
      MERGE (p)-[:HAS_ERA]->(e)
      RETURN e
    `, {
      profile_id: dollyPartonData.profile_id,
      era_id: era.era_id,
      props: era
    });
  }

  console.log(`✓ ${dollyEras.length} Dolly eras loaded`);
}

async function loadDollyEvents(session) {
  console.log('Loading Dolly Parton events...');

  for (const event of dollyEvents) {
    await session.run(`
      MATCH (p:GuestProfile {profile_id: $profile_id})
      MERGE (e:Event {event_id: $event_id})
      SET e += $props,
          e.updated_at = datetime()
      MERGE (p)-[:EXPERIENCED]->(e)
      RETURN e
    `, {
      profile_id: dollyPartonData.profile_id,
      event_id: event.event_id,
      props: event
    });
  }

  console.log(`✓ ${dollyEvents.length} Dolly events loaded`);
}

async function loadCarlDeanProfile(session) {
  console.log('Loading Carl Dean profile...');

  await session.run(`
    MERGE (p:GuestProfile {profile_id: $profile_id})
    SET p += $props,
        p.updated_at = datetime()
    RETURN p
  `, {
    profile_id: carlDeanData.profile_id,
    props: carlDeanData
  });

  console.log('✓ Carl Dean profile loaded');
}

async function loadCarlEras(session) {
  console.log('Loading Carl Dean eras...');

  for (const era of carlEras) {
    await session.run(`
      MATCH (p:GuestProfile {profile_id: $profile_id})
      MERGE (e:GuestEra {era_id: $era_id})
      SET e += $props,
          e.updated_at = datetime()
      MERGE (p)-[:HAS_ERA]->(e)
      RETURN e
    `, {
      profile_id: carlDeanData.profile_id,
      era_id: era.era_id,
      props: era
    });
  }

  console.log(`✓ ${carlEras.length} Carl eras loaded`);
}

async function loadCarlEvents(session) {
  console.log('Loading Carl Dean events...');

  for (const event of carlEvents) {
    await session.run(`
      MATCH (p:GuestProfile {profile_id: $profile_id})
      MERGE (e:Event {event_id: $event_id})
      SET e += $props,
          e.updated_at = datetime()
      MERGE (p)-[:EXPERIENCED]->(e)
      RETURN e
    `, {
      profile_id: carlDeanData.profile_id,
      event_id: event.event_id,
      props: event
    });
  }

  console.log(`✓ ${carlEvents.length} Carl events loaded`);
}

async function loadCoupleProfile(session) {
  console.log('Loading Dolly-Carl couple profile...');

  await session.run(`
    MATCH (dolly:GuestProfile {profile_id: $dolly_id})
    MATCH (carl:GuestProfile {profile_id: $carl_id})
    MERGE (c:CoupleProfile {couple_id: $couple_id})
    SET c += $props,
        c.updated_at = datetime()
    MERGE (dolly)-[:MARRIED_TO {since: "1966-05-30", years: 58}]->(carl)
    MERGE (carl)-[:MARRIED_TO {since: "1966-05-30", years: 58}]->(dolly)
    MERGE (c)-[:PARTNER]->(dolly)
    MERGE (c)-[:PARTNER]->(carl)
    RETURN c
  `, {
    dolly_id: dollyPartonData.profile_id,
    carl_id: carlDeanData.profile_id,
    couple_id: coupleData.couple_id,
    props: coupleData
  });

  console.log('✓ Couple profile loaded');
}

async function loadSharedEvents(session) {
  console.log('Loading shared events...');

  // Link Carl to meeting and marriage events
  await session.run(`
    MATCH (carl:GuestProfile {profile_id: $carl_id})
    MATCH (e:Event {event_id: $event_id})
    MERGE (carl)-[:EXPERIENCED]->(e)
  `, {
    carl_id: carlDeanData.profile_id,
    event_id: "event_dolly_meets_carl"
  });

  await session.run(`
    MATCH (carl:GuestProfile {profile_id: $carl_id})
    MATCH (e:Event {event_id: $event_id})
    MERGE (carl)-[:EXPERIENCED]->(e)
  `, {
    carl_id: carlDeanData.profile_id,
    event_id: "event_dolly_marriage"
  });

  console.log('✓ Shared events linked');
}

// ========================================
// MAIN EXECUTION
// ========================================

async function main() {
  console.log('========================================');
  console.log('DOLLY PARTON & CARL DEAN NEO4J LOADER');
  console.log('Mountain Sunshine Network');
  console.log('========================================\n');

  const session = driver.session();

  try {
    // Load Dolly Parton
    await loadDollyPartonProfile(session);
    await loadDollyEras(session);
    await loadDollyEvents(session);

    // Load Carl Dean
    await loadCarlDeanProfile(session);
    await loadCarlEras(session);
    await loadCarlEvents(session);

    // Load Couple
    await loadCoupleProfile(session);
    await loadSharedEvents(session);

    console.log('\n========================================');
    console.log('✓ ALL DATA LOADED SUCCESSFULLY');
    console.log('========================================');
    console.log('\nSummary:');
    console.log('- Dolly Parton: 5 eras, 12 events');
    console.log('- Carl Dean: 4 eras, 6 events');
    console.log('- Couple: 92% compatibility, 58-year marriage');
    console.log('- Network: entertainment_couples');

  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
