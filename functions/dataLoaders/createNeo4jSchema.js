/**
 * Neo4j Schema Creation Script
 *
 * Creates constraints, indexes, and initial schema for the Guest Chat integration.
 *
 * Run with: node functions/dataLoaders/createNeo4jSchema.js
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
 * Schema definitions
 */
const schemaDefinitions = {
  constraints: [
    // GuestProfile - unique ID
    {
      name: 'guest_profile_id',
      query: 'CREATE CONSTRAINT guest_profile_id IF NOT EXISTS FOR (g:GuestProfile) REQUIRE g.id IS UNIQUE',
      description: 'Unique constraint on GuestProfile.id'
    },
    // GuestEra - unique ID
    {
      name: 'guest_era_id',
      query: 'CREATE CONSTRAINT guest_era_id IF NOT EXISTS FOR (e:GuestEra) REQUIRE e.id IS UNIQUE',
      description: 'Unique constraint on GuestEra.id'
    },
    // ConstitutionalPattern - unique ID
    {
      name: 'constitutional_pattern_id',
      query: 'CREATE CONSTRAINT constitutional_pattern_id IF NOT EXISTS FOR (p:ConstitutionalPattern) REQUIRE p.id IS UNIQUE',
      description: 'Unique constraint on ConstitutionalPattern.id'
    },
    // UserProfile - unique userId
    {
      name: 'user_profile_id',
      query: 'CREATE CONSTRAINT user_profile_id IF NOT EXISTS FOR (u:UserProfile) REQUIRE u.userId IS UNIQUE',
      description: 'Unique constraint on UserProfile.userId'
    },
    // Event - unique ID
    {
      name: 'event_id',
      query: 'CREATE CONSTRAINT event_id IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE',
      description: 'Unique constraint on Event.id'
    },
    // Era (time period) - unique name
    {
      name: 'era_name',
      query: 'CREATE CONSTRAINT era_name IF NOT EXISTS FOR (e:Era) REQUIRE e.name IS UNIQUE',
      description: 'Unique constraint on Era.name'
    }
  ],

  indexes: [
    // GuestProfile indexes
    {
      name: 'guest_profile_name',
      query: 'CREATE INDEX guest_profile_name IF NOT EXISTS FOR (g:GuestProfile) ON (g.name)',
      description: 'Index on GuestProfile.name for name searches'
    },
    {
      name: 'guest_profile_category',
      query: 'CREATE INDEX guest_profile_category IF NOT EXISTS FOR (g:GuestProfile) ON (g.category)',
      description: 'Index on GuestProfile.category for filtering'
    },
    {
      name: 'guest_profile_fire',
      query: 'CREATE INDEX guest_profile_fire IF NOT EXISTS FOR (g:GuestProfile) ON (g.fire)',
      description: 'Index on GuestProfile.fire for element queries'
    },
    {
      name: 'guest_profile_daymaster',
      query: 'CREATE INDEX guest_profile_daymaster IF NOT EXISTS FOR (g:GuestProfile) ON (g.dayMaster)',
      description: 'Index on GuestProfile.dayMaster for constitutional queries'
    },

    // GuestEra indexes
    {
      name: 'guest_era_name',
      query: 'CREATE INDEX guest_era_name IF NOT EXISTS FOR (e:GuestEra) ON (e.eraName)',
      description: 'Index on GuestEra.eraName'
    },
    {
      name: 'guest_era_fire',
      query: 'CREATE INDEX guest_era_fire IF NOT EXISTS FOR (e:GuestEra) ON (e.fire)',
      description: 'Index on GuestEra.fire for compatibility calculations'
    },

    // UserProfile indexes
    {
      name: 'user_profile_fire',
      query: 'CREATE INDEX user_profile_fire IF NOT EXISTS FOR (u:UserProfile) ON (u.fire)',
      description: 'Index on UserProfile.fire for compatibility'
    },
    {
      name: 'user_profile_elements',
      query: 'CREATE INDEX user_profile_elements IF NOT EXISTS FOR (u:UserProfile) ON (u.fire, u.wood, u.water)',
      description: 'Composite index for element-based queries'
    },

    // Event indexes
    {
      name: 'event_date',
      query: 'CREATE INDEX event_date IF NOT EXISTS FOR (e:Event) ON (e.date)',
      description: 'Index on Event.date for chronological queries'
    }
  ]
};

/**
 * Schema version tracking
 */
const schemaVersion = {
  version: '1.0.0',
  description: 'Initial GENESIS Guest Chat schema',
  features: [
    'GuestProfile nodes with constitutional data',
    'GuestEra nodes for life periods',
    'ConstitutionalPattern nodes for archetypal patterns',
    'UserProfile reference nodes (synced from Firebase)',
    'Event nodes for historical moments',
    'Relationship types: MARRIED_TO, POLITICAL_ALLY, HAS_ERA, DELIVERED, CONVERSED_WITH'
  ]
};

/**
 * Create all constraints
 */
async function createConstraints(session) {
  console.log('\n1. Creating Constraints...');

  for (const constraint of schemaDefinitions.constraints) {
    try {
      await session.run(constraint.query);
      console.log(`   ${constraint.name}: ${constraint.description}`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`   ${constraint.name}: Already exists (skipped)`);
      } else {
        console.error(`   ${constraint.name}: FAILED - ${error.message}`);
      }
    }
  }
}

/**
 * Create all indexes
 */
async function createIndexes(session) {
  console.log('\n2. Creating Indexes...');

  for (const index of schemaDefinitions.indexes) {
    try {
      await session.run(index.query);
      console.log(`   ${index.name}: ${index.description}`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`   ${index.name}: Already exists (skipped)`);
      } else {
        console.error(`   ${index.name}: FAILED - ${error.message}`);
      }
    }
  }
}

/**
 * Create schema version node
 */
async function createSchemaVersion(session) {
  console.log('\n3. Recording Schema Version...');

  try {
    await session.run(`
      MERGE (s:SchemaVersion {version: $version})
      ON CREATE SET
        s.description = $description,
        s.features = $features,
        s.createdAt = datetime()
      ON MATCH SET
        s.updatedAt = datetime()
    `, schemaVersion);

    console.log(`   Version ${schemaVersion.version}: ${schemaVersion.description}`);
  } catch (error) {
    console.error(`   Schema version: FAILED - ${error.message}`);
  }
}

/**
 * Verify schema
 */
async function verifySchema(session) {
  console.log('\n4. Verifying Schema...');

  // Check constraints
  const constraintsResult = await session.run('SHOW CONSTRAINTS');
  const constraintCount = constraintsResult.records.length;

  // Check indexes
  const indexesResult = await session.run('SHOW INDEXES');
  const indexCount = indexesResult.records.length;

  // Check schema version
  const versionResult = await session.run(`
    MATCH (s:SchemaVersion)
    RETURN s.version as version, s.createdAt as createdAt
    ORDER BY s.createdAt DESC
    LIMIT 1
  `);

  console.log(`   Constraints: ${constraintCount}`);
  console.log(`   Indexes: ${indexCount}`);

  if (versionResult.records.length > 0) {
    const record = versionResult.records[0];
    console.log(`   Schema Version: ${record.get('version')}`);
  }
}

/**
 * Print relationship type documentation
 */
function printRelationshipTypes() {
  console.log('\n5. Relationship Types Reference...');

  const relationshipTypes = [
    { type: 'HAS_ERA', from: 'GuestProfile', to: 'GuestEra', desc: 'Guest profile has life era' },
    { type: 'MARRIED_TO', from: 'GuestProfile', to: 'GuestProfile', desc: 'Marriage relationship' },
    { type: 'POLITICAL_ALLY', from: 'GuestProfile', to: 'GuestProfile', desc: 'Political alliance' },
    { type: 'DIPLOMATIC_COUNTERPART', from: 'GuestProfile', to: 'GuestProfile', desc: 'Diplomatic relationship' },
    { type: 'INFLUENCED', from: 'GuestProfile', to: 'GuestProfile', desc: 'Influenced another figure' },
    { type: 'CONTEMPORARY_OF', from: 'GuestProfile', to: 'GuestProfile', desc: 'Same time period' },
    { type: 'MENTORED', from: 'GuestProfile', to: 'GuestProfile', desc: 'Mentor relationship' },
    { type: 'DELIVERED', from: 'GuestProfile', to: 'Event', desc: 'Delivered speech/event' },
    { type: 'PARTICIPATED_IN', from: 'GuestProfile', to: 'Event', desc: 'Participated in event' },
    { type: 'FEATURED_EVENT', from: 'GuestEra', to: 'Event', desc: 'Event featured in era' },
    { type: 'EXHIBITS_PATTERN', from: 'GuestProfile', to: 'ConstitutionalPattern', desc: 'Shows constitutional pattern' },
    { type: 'CONVERSED_WITH', from: 'UserProfile', to: 'GuestProfile', desc: 'User conversation history' },
    { type: 'COMPATIBLE_WITH', from: 'UserProfile', to: 'GuestEra', desc: 'User-era compatibility' }
  ];

  relationshipTypes.forEach(rel => {
    console.log(`   (${rel.from})-[:${rel.type}]->(${rel.to})`);
    console.log(`      ${rel.desc}`);
  });
}

/**
 * Main schema creation function
 */
async function createSchema() {
  const session = driver.session();

  console.log('\n========================================');
  console.log('  NEO4J SCHEMA CREATION');
  console.log('  GENESIS Guest Chat Integration');
  console.log('========================================');

  try {
    await createConstraints(session);
    await createIndexes(session);
    await createSchemaVersion(session);
    await verifySchema(session);
    printRelationshipTypes();

    console.log('\n========================================');
    console.log('  SCHEMA CREATION COMPLETE!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\nSchema creation failed:', error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Drop all schema (use with caution!)
 */
async function dropSchema() {
  const session = driver.session();

  console.log('\nWARNING: Dropping all schema...');

  try {
    // Drop constraints
    const constraints = await session.run('SHOW CONSTRAINTS');
    for (const record of constraints.records) {
      const name = record.get('name');
      await session.run(`DROP CONSTRAINT ${name} IF EXISTS`);
      console.log(`   Dropped constraint: ${name}`);
    }

    // Drop indexes (except auto-generated ones)
    const indexes = await session.run('SHOW INDEXES');
    for (const record of indexes.records) {
      const name = record.get('name');
      const type = record.get('type');
      if (type !== 'LOOKUP') {  // Don't drop lookup indexes
        try {
          await session.run(`DROP INDEX ${name} IF EXISTS`);
          console.log(`   Dropped index: ${name}`);
        } catch (e) {
          // Some indexes can't be dropped
        }
      }
    }

    // Remove schema version
    await session.run('MATCH (s:SchemaVersion) DELETE s');
    console.log('   Removed schema version nodes');

    console.log('\nSchema dropped successfully');

  } catch (error) {
    console.error('Error dropping schema:', error);
  } finally {
    await session.close();
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  try {
    // Test connection
    console.log('Connecting to Neo4j...');
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    console.log('Connected!');

    if (args.includes('--drop')) {
      await dropSchema();
    }

    await createSchema();

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
  createSchema,
  dropSchema,
  schemaDefinitions,
  schemaVersion
};
