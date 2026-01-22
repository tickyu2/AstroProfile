/**
 * Baby Step 4: Manual Ticky 1982 Fact Injection
 *
 * This script manually injects a test fact into Firestore to verify
 * that the handleGuestChat prompt injection is working correctly.
 *
 * Run this BEFORE chatting with Reagan to verify the AI uses learned facts.
 *
 * Expected AI Response:
 *   You: "Ronnie, was the economy really that bad?"
 *   Reagan: "Well Ticky, you saw it firsthand when you landed in Austin in '82..."
 *
 * If he doesn't reference Austin/1982, the Brain 1B injection logic is broken.
 *
 * Usage:
 *   node inject_ticky_1982_fact.js                    # List all users
 *   node inject_ticky_1982_fact.js <firebase_uid>    # Inject for specific user
 *
 * Prerequisites:
 *   - Firebase Admin SDK configured
 *   - GOOGLE_APPLICATION_CREDENTIALS set OR running from Firebase environment
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  // Try service account file first (local development)
  try {
    const serviceAccountPath = path.resolve(__dirname, '../../astroprofile-391e6-e3277f82db70.json');
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Initialized with service account file');
  } catch (e) {
    // Fall back to default credentials (Cloud Functions environment)
    admin.initializeApp();
    console.log('Initialized with default credentials');
  }
}

const db = admin.firestore();

// ==========================================
// CONFIGURATION
// ==========================================
const REAGAN_PARTNER_ID = 'historical_ronald_reagan';

// CORRECT PATH: Frontend reads from users/{userId}/brain1_learned_biography/{partnerId}
// This matches src/profiles/index.js line 628

// Convert to the format the frontend expects (array of {fact, learned_at} objects)
const MANUAL_FACTS_FOR_FRONTEND = [
  {
    fact: 'User arrived in Austin, Texas in Fall 1982 for engineering studies at University of Texas. Reference this when discussing the 1982 economy or Reagan era.',
    learned_at: new Date().toISOString(),
    source: 'manual_injection',
    confidence: 1.0,
    context_tags: ['1982', 'Recession', 'Austin', 'UT', 'Engineering', 'Immigration']
  },
  {
    fact: 'User visited the Ronald Reagan Presidential Library and resting place in Simi Valley in January 2026. Felt a deep soul connection. Treat as a friend who has visited your home.',
    learned_at: new Date().toISOString(),
    source: 'manual_injection',
    confidence: 1.0,
    context_tags: ['Simi Valley', 'Pilgrimage', 'Air Force One', 'Grave', 'Library', '2026']
  },
  {
    fact: 'User walked through Air Force One (SAM 27000) at the Reagan Library pavilion in January 2026. Reference shared experience when discussing Air Force One.',
    learned_at: new Date().toISOString(),
    source: 'manual_injection',
    confidence: 1.0,
    context_tags: ['Air Force One', 'SAM 27000', 'Pavilion', 'Simi Valley', 'Artifact']
  }
];

// List all AstroProfiles to help find the correct profile ID
async function listProfiles() {
  console.log('===============================================');
  console.log('FINDING YOUR ASTROPROFILE ID');
  console.log('===============================================\n');

  try {
    // Check profiles collection (AstroProfiles)
    const profilesSnapshot = await db.collection('profiles').limit(20).get();
    console.log(`Found ${profilesSnapshot.size} AstroProfiles:\n`);

    for (const doc of profilesSnapshot.docs) {
      const data = doc.data();
      console.log(`  Profile ID: ${doc.id}`);
      console.log(`  Name: ${data.displayName || data.firstName || data.profile_name || 'N/A'}`);
      console.log(`  Type: ${data.relationshipType || 'N/A'}`);
      console.log('  ---');
    }

    console.log('\n===============================================');
    console.log('TO INJECT FACTS, RUN:');
    console.log('  node inject_ticky_1982_fact.js <PROFILE_ID>');
    console.log('\nExample (Surachai Uthenpong):');
    console.log('  node inject_ticky_1982_fact.js O00Whu1pMYTXi4quPiLp');
    console.log('===============================================\n');
  } catch (error) {
    console.error('Error listing profiles:', error);
  }
}

async function injectFacts(profileId) {
  console.log('===============================================');
  console.log('BABY STEP 4: Injecting Ticky 1982 Facts');
  console.log(`Target AstroProfile: ${profileId}`);
  console.log('===============================================\n');

  try {
    // CORRECT PATH: profiles/{profileId}/b1b_learned/{partnerId}
    // This matches the backend handleGuestChat and frontend loadProfile
    // Profile-based compartmentalization: each AstroProfile has its own brain
    const factDocRef = db.doc(`profiles/${profileId}/b1b_learned/${REAGAN_PARTNER_ID}`);

    // Get existing facts (if any)
    const existingDoc = await factDocRef.get();
    const existingFacts = existingDoc.exists ? (existingDoc.data().learned_facts || []) : [];

    console.log(`Existing facts: ${existingFacts.length}`);

    // Check for duplicates by comparing fact text (first 50 chars)
    const existingFactTexts = new Set(existingFacts.map(f => (f.fact || '').substring(0, 50)));
    const newFacts = MANUAL_FACTS_FOR_FRONTEND.filter(f =>
      !existingFactTexts.has((f.fact || '').substring(0, 50))
    );

    if (newFacts.length === 0) {
      console.log('All facts already exist. No changes needed.');
      return;
    }

    // Write to Firestore in the format the frontend expects
    await factDocRef.set({
      learned_facts: [...existingFacts, ...newFacts],
      last_updated: new Date().toISOString()
    }, { merge: true });

    console.log(`\nInjected ${newFacts.length} new facts:`);
    newFacts.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.fact.substring(0, 70)}...`);
    });

    console.log('\n===============================================');
    console.log('VERIFICATION TEST');
    console.log('===============================================');
    console.log('\nNow REFRESH the page, then chat with Reagan and ask:');
    console.log('  "Ronnie, was the economy really that bad?"');
    console.log('\nExpected Response should include:');
    console.log('  "...you saw it firsthand when you landed in Austin in \'82..."');
    console.log('\nIf he doesn\'t reference Austin/1982, check:');
    console.log('  1. Did you refresh the browser? (facts are loaded on page load)');
    console.log('  2. Check ChatHeader - should show "3 facts"');
    console.log('===============================================\n');

  } catch (error) {
    console.error('Error injecting facts:', error);
    throw error;
  }
}

// Also create a function to read back the facts for verification
async function verifyFacts(profileId) {
  console.log('\nVerifying stored facts...\n');

  const factDocRef = db.doc(`profiles/${profileId}/b1b_learned/${REAGAN_PARTNER_ID}`);
  const doc = await factDocRef.get();

  if (!doc.exists) {
    console.log('No facts document found!');
    return;
  }

  const data = doc.data();
  console.log(`Last Updated: ${data.last_updated}`);
  console.log(`Total Facts: ${data.learned_facts?.length || 0}\n`);

  if (data.learned_facts) {
    data.learned_facts.forEach((fact, i) => {
      console.log(`[${i + 1}] ${fact.fact}`);
      console.log(`    Tags: ${fact.context_tags?.join(', ') || 'N/A'}`);
      console.log(`    Learned: ${fact.learned_at}`);
      console.log('');
    });
  }
}

// Main execution
async function main() {
  const profileId = process.argv[2];

  if (!profileId) {
    // No profile ID provided - list available AstroProfiles
    await listProfiles();
  } else {
    // Inject facts for specific AstroProfile
    await injectFacts(profileId);
    await verifyFacts(profileId);
  }
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
