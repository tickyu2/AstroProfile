/**
 * ============================================================================
 * PHASE 4: MIGRATE EXISTING PROFILES TO CANONICAL SCHEMA
 * ============================================================================
 *
 * This script migrates existing Firebase profiles to the Python-First canonical
 * schema by:
 *   1. Querying profiles that don't have profile.bazi (not yet migrated)
 *   2. Calling the Python compute_unified_profile endpoint
 *   3. Updating the profile with canonical data (bazi, western, vedic, unified)
 *
 * Run: node functions/scripts/migrateToCanonicalSchema.js
 *
 * Options:
 *   --dry-run          Preview without writing (default: false)
 *   --batch-size=N     Profiles per batch (default: 10)
 *   --delay-ms=N       Delay between batches (default: 2000)
 *   --user-id=UID      Migrate only profiles for specific user
 *   --profile-id=PID   Migrate only a specific profile
 *   --limit=N          Maximum profiles to migrate (default: unlimited)
 *   --force            Re-migrate even if bazi exists
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../../astroprofile-391e6-e3277f82db70.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// Cloud Run endpoint
const CLOUD_RUN_SUFFIX = '-sjpjwnbsmq-uc.a.run.app';
const getCloudRunUrl = (functionName) => {
  const urlName = functionName.replace(/_/g, '-');
  return `https://${urlName}${CLOUD_RUN_SUFFIX}`;
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    batchSize: 10,
    delayMs: 2000,
    userId: null,
    profileId: null,
    limit: null,
    force: false
  };

  args.forEach(arg => {
    if (arg === '--dry-run') options.dryRun = true;
    if (arg === '--force') options.force = true;
    if (arg.startsWith('--batch-size=')) options.batchSize = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--delay-ms=')) options.delayMs = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--user-id=')) options.userId = arg.split('=')[1];
    if (arg.startsWith('--profile-id=')) options.profileId = arg.split('=')[1];
    if (arg.startsWith('--limit=')) options.limit = parseInt(arg.split('=')[1]);
  });

  return options;
}

// Progress tracker
class MigrationProgress {
  constructor() {
    this.total = 0;
    this.processed = 0;
    this.succeeded = 0;
    this.failed = 0;
    this.skipped = 0;
    this.errors = [];
    this.startTime = Date.now();
  }

  log(message) {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    console.log(`[${elapsed}s] ${message}`);
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total profiles found: ${this.total}`);
    console.log(`Processed:            ${this.processed}`);
    console.log(`Succeeded:            ${this.succeeded}`);
    console.log(`Failed:               ${this.failed}`);
    console.log(`Skipped:              ${this.skipped}`);
    console.log(`Time elapsed:         ${elapsed}s`);

    if (this.errors.length > 0) {
      console.log('\nErrors:');
      this.errors.forEach(({ profileId, error }) => {
        console.log(`  - ${profileId}: ${error}`);
      });
    }
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Call Python bazi_joey_yap endpoint
 */
async function computeBazi(birthData) {
  const response = await fetch(getCloudRunUrl('bazi_joey_yap'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime || '12:00',
      isMale: birthData.gender !== 'female',
      includeDayun: true,
      dayunPillarCount: 8
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BaZi HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * Call Python calculate_natal_chart endpoint
 */
async function computeWestern(birthData) {
  const response = await fetch(getCloudRunUrl('calculate_natal_chart'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime || '12:00',
      latitude: birthData.latitude || 0,
      longitude: birthData.longitude || 0,
      timezone: birthData.timezone || 'UTC'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Western HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * Recursively remove undefined values from an object (Firestore doesn't allow undefined)
 */
function removeUndefined(obj) {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item));
  }
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanedValue = removeUndefined(value);
    if (cleanedValue !== undefined) {
      cleaned[key] = cleanedValue === undefined ? null : cleanedValue;
    }
  }
  return cleaned;
}

/**
 * Transform BaZi response to canonical schema
 */
function transformBaziToCanonical(baziRaw) {
  if (!baziRaw || !baziRaw.pillars) return null;

  // Extract element distribution
  const elemDist = baziRaw.element_distribution || {};
  const elements = {
    Wood: elemDist.Wood || 0,
    Fire: elemDist.Fire || 0,
    Earth: elemDist.Earth || 0,
    Metal: elemDist.Metal || 0,
    Water: elemDist.Water || 0
  };

  // Find dominant element
  const dominant = Object.entries(elements)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Wood';

  // Helper to safely extract pillar data
  const extractPillar = (pillar) => {
    if (!pillar) return { stem: null, branch: null, ganzhi: null };
    const stem = pillar.stem || null;
    const branch = pillar.branch || null;
    return {
      stem,
      branch,
      ganzhi: stem && branch ? `${stem}${branch}` : null
    };
  };

  const result = {
    pillars: {
      year: extractPillar(baziRaw.pillars.year),
      month: extractPillar(baziRaw.pillars.month),
      day: extractPillar(baziRaw.pillars.day),
      hour: extractPillar(baziRaw.pillars.hour)
    },
    dayMaster: baziRaw.day_master ? {
      stem: baziRaw.day_master.stem || null,
      element: baziRaw.day_master.element || null,
      polarity: baziRaw.day_master.polarity || null
    } : {
      stem: baziRaw.pillars.day?.stem || null,
      element: null,
      polarity: null
    },
    elements: {
      ...elements,
      dominant
    },
    tenGods: baziRaw.ten_gods || null,
    symbolicStars: baziRaw.symbolic_stars || null,
    dmStrength: baziRaw.dm_strength || null,
    dayun: baziRaw.dayun || null,
    metadata: baziRaw.metadata || {
      engine: 'bazi_engine',
      version: '1.0.0'
    }
  };

  // Clean undefined values for Firestore compatibility
  return removeUndefined(result);
}

/**
 * Transform Western response to canonical schema
 */
function transformWesternToCanonical(westernRaw) {
  if (!westernRaw || !westernRaw.planets) return null;

  // Extract sun/moon/ascendant
  const planets = westernRaw.planets || {};
  const sun = planets.sun || {};
  const moon = planets.moon || {};
  const ascendant = westernRaw.ascendant || {};

  // Extract element balance
  const elements = westernRaw.elements || westernRaw.elemental_balance || {
    fire: 25, earth: 25, air: 25, water: 25
  };

  return {
    sun: {
      sign: sun.sign,
      degree: sun.degree,
      element: sun.element,
      retrograde: sun.retrograde || false
    },
    moon: {
      sign: moon.sign,
      degree: moon.degree,
      element: moon.element,
      retrograde: moon.retrograde || false
    },
    ascendant: {
      sign: ascendant.sign,
      degree: ascendant.degree
    },
    planets: Object.entries(planets).reduce((acc, [name, data]) => {
      acc[name] = {
        sign: data.sign,
        degree: data.degree,
        retrograde: data.retrograde || false,
        element: data.element
      };
      return acc;
    }, {}),
    houses: westernRaw.houses || [],
    houseSystem: westernRaw.house_system || 'porphyry',
    elements: {
      fire: elements.fire || elements.Fire || 25,
      earth: elements.earth || elements.Earth || 25,
      air: elements.air || elements.Air || 25,
      water: elements.water || elements.Water || 25,
      dominant: elements.dominant?.element || null
    },
    aspects: westernRaw.aspects || [],
    moonPhase: westernRaw.moon_phase || null
  };

  // Clean undefined values for Firestore compatibility
  return removeUndefined(result);
}

/**
 * Compute canonical profile using individual endpoints
 */
async function computeCanonicalProfile(birthData) {
  const [baziRaw, westernRaw] = await Promise.all([
    computeBazi(birthData).catch(err => {
      console.warn('  BaZi computation failed:', err.message);
      return null;
    }),
    computeWestern(birthData).catch(err => {
      console.warn('  Western computation failed:', err.message);
      return null;
    })
  ]);

  return {
    bazi: transformBaziToCanonical(baziRaw),
    western: transformWesternToCanonical(westernRaw),
    vedic: null,  // Not yet implemented
    unified: null, // Not yet implemented
    computedAt: new Date().toISOString(),
    computeVersion: '2.0.0-migration'
  };
}

/**
 * Migrate a single profile
 */
async function migrateProfile(profile, options, progress) {
  const profileId = profile.id;
  const displayName = profile.displayName || 'Unknown';

  // Check if already migrated
  if (!options.force && profile.bazi && profile.bazi.elements) {
    progress.skipped++;
    progress.log(`  SKIP: ${displayName} (already has canonical bazi)`);
    return { status: 'skipped' };
  }

  // Check required birth data
  if (!profile.birthDate) {
    progress.skipped++;
    progress.log(`  SKIP: ${displayName} (no birthDate)`);
    return { status: 'skipped', reason: 'no birthDate' };
  }

  try {
    // Extract birth data
    const birthData = {
      birthDate: profile.birthDate,
      birthTime: profile.birthTime || '12:00',
      latitude: profile.latitude || profile.birthLocation?.latitude || 0,
      longitude: profile.longitude || profile.birthLocation?.longitude || 0,
      timezone: profile.timezone || 'UTC',
      gender: profile.gender || 'male'
    };

    progress.log(`  Migrating: ${displayName} (${birthData.birthDate})`);

    if (options.dryRun) {
      progress.succeeded++;
      progress.log(`  DRY-RUN: Would compute canonical data for ${displayName}`);
      return { status: 'dry-run' };
    }

    // Call Python endpoints (BaZi + Western in parallel)
    const canonical = await computeCanonicalProfile(birthData);

    // Update profile with canonical data (deep clean undefined values)
    const profileRef = db.collection('profiles').doc(profileId);
    const updateData = removeUndefined({
      // Canonical paths (Python-First)
      bazi: canonical.bazi || null,
      western: canonical.western || null,
      vedic: canonical.vedic || null,
      unified: canonical.unified || null,

      // Metadata
      computedAt: canonical.computedAt || new Date().toISOString(),
      computeVersion: canonical.computeVersion || '2.0.0-migration'
    });

    // Add serverTimestamp (can't be cleaned by removeUndefined)
    updateData.migratedAt = admin.firestore.FieldValue.serverTimestamp();

    await profileRef.update(updateData);

    progress.succeeded++;
    progress.log(`  SUCCESS: ${displayName} - bazi: ${!!canonical.bazi}, western: ${!!canonical.western}`);
    return { status: 'success', canonical };

  } catch (error) {
    progress.failed++;
    progress.errors.push({ profileId, displayName, error: error.message });
    progress.log(`  FAILED: ${displayName} - ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}

/**
 * Process profiles in batches
 */
async function processBatch(profiles, options, progress) {
  const results = [];

  for (const profile of profiles) {
    progress.processed++;
    const result = await migrateProfile(profile, options, progress);
    results.push({ profileId: profile.id, ...result });
  }

  return results;
}

/**
 * Main migration function
 */
async function migrate() {
  const options = parseArgs();
  const progress = new MigrationProgress();

  console.log('\n' + '='.repeat(60));
  console.log('GENESIS CANONICAL SCHEMA MIGRATION (Phase 4)');
  console.log('='.repeat(60));
  console.log('Options:', JSON.stringify(options, null, 2));
  console.log('');

  try {
    // Build query
    let query = db.collection('profiles');

    // Filter by user if specified
    if (options.userId) {
      query = query.where('userId', '==', options.userId);
      progress.log(`Filtering by userId: ${options.userId}`);
    }

    // Filter by specific profile
    if (options.profileId) {
      progress.log(`Migrating single profile: ${options.profileId}`);
      const doc = await db.collection('profiles').doc(options.profileId).get();
      if (!doc.exists) {
        console.error(`Profile not found: ${options.profileId}`);
        process.exit(1);
      }
      const profiles = [{ id: doc.id, ...doc.data() }];
      progress.total = 1;
      await processBatch(profiles, options, progress);
      progress.summary();
      process.exit(0);
    }

    // Get all matching profiles
    const snapshot = await query.get();
    let profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter out already migrated (unless --force)
    if (!options.force) {
      const beforeCount = profiles.length;
      profiles = profiles.filter(p => !p.bazi || !p.bazi.elements);
      progress.log(`Filtered: ${beforeCount} total -> ${profiles.length} need migration`);
    }

    // Apply limit
    if (options.limit) {
      profiles = profiles.slice(0, options.limit);
      progress.log(`Limited to: ${profiles.length} profiles`);
    }

    progress.total = profiles.length;
    progress.log(`Found ${profiles.length} profiles to migrate\n`);

    if (profiles.length === 0) {
      console.log('No profiles need migration. All done!');
      process.exit(0);
    }

    // Process in batches
    const batches = [];
    for (let i = 0; i < profiles.length; i += options.batchSize) {
      batches.push(profiles.slice(i, i + options.batchSize));
    }

    progress.log(`Processing ${batches.length} batches of up to ${options.batchSize} profiles each\n`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      progress.log(`--- Batch ${i + 1}/${batches.length} (${batch.length} profiles) ---`);

      await processBatch(batch, options, progress);

      // Delay between batches (rate limiting)
      if (i < batches.length - 1 && options.delayMs > 0) {
        progress.log(`  Waiting ${options.delayMs}ms before next batch...\n`);
        await new Promise(resolve => setTimeout(resolve, options.delayMs));
      }
    }

    progress.summary();
    process.exit(progress.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('Migration failed:', error);
    progress.summary();
    process.exit(1);
  }
}

// Run migration
migrate();
