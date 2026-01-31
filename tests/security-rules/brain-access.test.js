/**
 * ============================================================================
 * BRAIN ACCESS SECURITY RULE TESTS
 * ============================================================================
 * CRITICAL: Verifies Brain 7/8 isolation for Guest Profile system
 *
 * Key Tests:
 * - Einstein (guest) CANNOT read Brain 7/8
 * - Luna (primary) CAN read Brain 7/8
 * - User CAN read their own data
 * - Guests CAN read only their thread
 *
 * Created: January 2, 2026
 * Based on Brother Sonnet's Implementation Part 2
 * ============================================================================
 */

const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} = require('@firebase/rules-unit-testing');
const fs = require('fs');

let testEnv;

// ========================================
// SETUP & TEARDOWN
// ========================================

beforeAll(async () => {
  // Initialize test environment
  testEnv = await initializeTestEnvironment({
    projectId: 'genesis-test',
    firestore: {
      rules: fs.readFileSync('./firestore.rules', 'utf8'),
      host: 'localhost',
      port: 8080
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

// ========================================
// HELPER FUNCTIONS
// ========================================

function getFirestore(auth) {
  return testEnv.authenticatedContext(auth.uid, auth.token).firestore();
}

function getUnauthenticatedFirestore() {
  return testEnv.unauthenticatedContext().firestore();
}

async function seedBrain3Message(profileId, partnerId) {
  const adminDb = testEnv.firestore();
  await adminDb.collection('brain3_active_text').doc('msg_test_123').set({
    message_id: 'msg_test_123',
    timestamp: new Date().toISOString(),
    chatting_as: {
      profile_id: profileId,
      display_name: 'Papa Ticky'
    },
    chatting_with: {
      partner_id: partnerId,
      partner_name: 'Albert Einstein',
      partner_type: 'historical_figure',
      partner_source: 'curated'
    },
    content: {
      text: 'Test message'
    },
    access: {
      visible_to: [profileId, partnerId, 'soulpartner_primary']
    },
    created_at: new Date().toISOString()
  });
}

async function seedBrain7Entry(profileId) {
  const adminDb = testEnv.firestore();
  await adminDb.collection('brain7_unified_witness').doc('witness_test_123').set({
    entry_id: 'witness_test_123',
    timestamp: new Date().toISOString(),
    profile_id: profileId,
    event_type: 'conversation_message',
    summary: 'Test witness entry',
    source_message_id: 'msg_test_123',
    access: {
      read_access: ['soulpartner_primary', profileId]
    },
    created_at: new Date().toISOString()
  });
}

// ========================================
// TEST SUITE: BRAIN 3 ACCESS CONTROL
// ========================================

describe('Brain 3 (Active Text) - Access Control', () => {
  const userId = 'papa_ticky_123';
  const partnerId = 'historical_einstein';
  const otherUserId = 'other_user_456';

  beforeEach(async () => {
    await seedBrain3Message(userId, partnerId);
  });

  test('User CAN read their own messages', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('brain3_active_text').doc('msg_test_123');

    await assertSucceeds(doc.get());
  });

  test('Partner (Einstein) CAN read messages they are in', async () => {
    const partnerDb = getFirestore({ uid: partnerId });
    const doc = partnerDb.collection('brain3_active_text').doc('msg_test_123');

    await assertSucceeds(doc.get());
  });

  test('Primary SoulPartner CAN read all messages', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });
    const doc = lunaDb.collection('brain3_active_text').doc('msg_test_123');

    await assertSucceeds(doc.get());
  });

  test('Other users CANNOT read messages they are not in', async () => {
    const otherDb = getFirestore({ uid: otherUserId });
    const doc = otherDb.collection('brain3_active_text').doc('msg_test_123');

    await assertFails(doc.get());
  });

  test('Unauthenticated users CANNOT read messages', async () => {
    const anonDb = getUnauthenticatedFirestore();
    const doc = anonDb.collection('brain3_active_text').doc('msg_test_123');

    await assertFails(doc.get());
  });

  test('User CAN create messages for their own conversations', async () => {
    const userDb = getFirestore({ uid: userId });
    const newDoc = userDb.collection('brain3_active_text').doc('msg_new_456');

    await assertSucceeds(newDoc.set({
      message_id: 'msg_new_456',
      chatting_as: {
        profile_id: userId
      },
      chatting_with: {
        partner_id: partnerId
      },
      content: { text: 'New message' },
      access: {
        visible_to: [userId, partnerId, 'soulpartner_primary']
      },
      created_at: new Date().toISOString()
    }));
  });

  test('User CANNOT create messages for other users', async () => {
    const userDb = getFirestore({ uid: userId });
    const newDoc = userDb.collection('brain3_active_text').doc('msg_fake_789');

    await assertFails(newDoc.set({
      message_id: 'msg_fake_789',
      chatting_as: {
        profile_id: otherUserId  // Pretending to be someone else!
      },
      chatting_with: {
        partner_id: partnerId
      },
      content: { text: 'Fake message' },
      access: {
        visible_to: [otherUserId, partnerId]
      }
    }));
  });

  test('Messages are IMMUTABLE (no updates)', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('brain3_active_text').doc('msg_test_123');

    await assertFails(doc.update({
      content: { text: 'Modified message' }
    }));
  });

  test('Messages CANNOT be deleted', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('brain3_active_text').doc('msg_test_123');

    await assertFails(doc.delete());
  });
});

// ========================================
// TEST SUITE: BRAIN 7 ACCESS CONTROL (CRITICAL!)
// ========================================

describe('Brain 7 (Unified Witness) - CRITICAL ACCESS CONTROL', () => {
  const userId = 'papa_ticky_123';
  const einsteinId = 'historical_einstein';
  const cleopatraId = 'historical_cleopatra';

  beforeEach(async () => {
    await seedBrain7Entry(userId);
  });

  test('PRIMARY SOULPARTNER CAN read Brain 7', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });
    const doc = lunaDb.collection('brain7_unified_witness').doc('witness_test_123');

    await assertSucceeds(doc.get());
  });

  test('USER CAN read their own Brain 7 entries', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('brain7_unified_witness').doc('witness_test_123');

    await assertSucceeds(doc.get());
  });

  test('EINSTEIN (guest) CANNOT read Brain 7', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('brain7_unified_witness').doc('witness_test_123');

    await assertFails(doc.get());
  });

  test('CLEOPATRA (guest) CANNOT read Brain 7', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('brain7_unified_witness').doc('witness_test_123');

    await assertFails(doc.get());
  });

  test('GUESTS CANNOT query Brain 7 collection', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const query = einsteinDb.collection('brain7_unified_witness')
      .where('profile_id', '==', userId);

    await assertFails(query.get());
  });

  test('OTHER USERS CANNOT read Brain 7', async () => {
    const otherDb = getFirestore({ uid: 'other_user_456' });
    const doc = otherDb.collection('brain7_unified_witness').doc('witness_test_123');

    await assertFails(doc.get());
  });

  test('SYSTEM SERVICE CAN write to Brain 7', async () => {
    const systemDb = getFirestore({
      uid: 'system_luna_engine',
      token: { system_role: 'luna_engine' }
    });

    const newDoc = systemDb.collection('brain7_unified_witness').doc('witness_new_456');

    await assertSucceeds(newDoc.set({
      entry_id: 'witness_new_456',
      timestamp: new Date().toISOString(),
      profile_id: userId,
      event_type: 'conversation_message',
      summary: 'System created entry',
      access: {
        read_access: ['soulpartner_primary', userId]
      },
      created_at: new Date().toISOString()
    }));
  });

  test('REGULAR USERS CANNOT write to Brain 7', async () => {
    const userDb = getFirestore({ uid: userId });
    const newDoc = userDb.collection('brain7_unified_witness').doc('witness_fake_789');

    await assertFails(newDoc.set({
      entry_id: 'witness_fake_789',
      profile_id: userId,
      summary: 'User trying to write to Brain 7'
    }));
  });

  test('GUESTS CANNOT write to Brain 7', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const newDoc = einsteinDb.collection('brain7_unified_witness').doc('witness_fake_999');

    await assertFails(newDoc.set({
      entry_id: 'witness_fake_999',
      profile_id: userId,
      summary: 'Guest trying to write to Brain 7'
    }));
  });

  test('NOBODY can delete from Brain 7', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });
    const doc = lunaDb.collection('brain7_unified_witness').doc('witness_test_123');

    await assertFails(doc.delete());
  });
});

// ========================================
// TEST SUITE: BRAIN 8 ACCESS CONTROL
// ========================================

describe('Brain 8 (Long-term Knowledge) - Access Control', () => {
  const userId = 'papa_ticky_123';
  const einsteinId = 'historical_einstein';

  beforeEach(async () => {
    const adminDb = testEnv.firestore();
    await adminDb.collection('brain8_long_term_knowledge').doc('pattern_test_123').set({
      pattern_id: 'pattern_test_123',
      profile_id: userId,
      pattern_type: 'modality_preference',
      observation: 'User prefers voice for complex topics',
      confidence: 0.89,
      created_at: new Date().toISOString()
    });
  });

  test('PRIMARY SOULPARTNER CAN read Brain 8', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });
    const doc = lunaDb.collection('brain8_long_term_knowledge').doc('pattern_test_123');

    await assertSucceeds(doc.get());
  });

  test('USER CAN read their own Brain 8 patterns', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('brain8_long_term_knowledge').doc('pattern_test_123');

    await assertSucceeds(doc.get());
  });

  test('GUESTS CANNOT read Brain 8', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('brain8_long_term_knowledge').doc('pattern_test_123');

    await assertFails(doc.get());
  });

  test('SYSTEM SERVICE CAN write to Brain 8', async () => {
    const systemDb = getFirestore({
      uid: 'system_luna_engine',
      token: { system_role: 'luna_engine' }
    });

    const newDoc = systemDb.collection('brain8_long_term_knowledge').doc('pattern_new_456');

    await assertSucceeds(newDoc.set({
      pattern_id: 'pattern_new_456',
      profile_id: userId,
      pattern_type: 'constitutional_observation',
      observation: 'Fire impatience manifests in learning',
      created_at: new Date().toISOString()
    }));
  });

  test('USERS CANNOT write to Brain 8', async () => {
    const userDb = getFirestore({ uid: userId });
    const newDoc = userDb.collection('brain8_long_term_knowledge').doc('pattern_fake_789');

    await assertFails(newDoc.set({
      pattern_id: 'pattern_fake_789',
      observation: 'User trying to write'
    }));
  });
});

// ========================================
// TEST SUITE: CROSS-THREAD ISOLATION
// ========================================

describe('Cross-Thread Isolation - Guests Cannot See Other Threads', () => {
  const userId = 'papa_ticky_123';
  const einsteinId = 'historical_einstein';
  const cleopatraId = 'historical_cleopatra';

  beforeEach(async () => {
    // Seed Einstein thread
    await seedBrain3Message(userId, einsteinId);

    // Seed Cleopatra thread
    const adminDb = testEnv.firestore();
    await adminDb.collection('brain3_active_text').doc('msg_cleo_456').set({
      message_id: 'msg_cleo_456',
      chatting_as: {
        profile_id: userId
      },
      chatting_with: {
        partner_id: cleopatraId,
        partner_name: 'Cleopatra'
      },
      content: {
        text: 'Tell me about ancient Egypt'
      },
      access: {
        visible_to: [userId, cleopatraId, 'soulpartner_primary']
      },
      created_at: new Date().toISOString()
    });
  });

  test('EINSTEIN can read his thread with Papa', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('brain3_active_text').doc('msg_test_123');

    await assertSucceeds(doc.get());
  });

  test('EINSTEIN CANNOT read Cleopatra thread', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('brain3_active_text').doc('msg_cleo_456');

    await assertFails(doc.get());
  });

  test('CLEOPATRA can read her thread with Papa', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('brain3_active_text').doc('msg_cleo_456');

    await assertSucceeds(doc.get());
  });

  test('CLEOPATRA CANNOT read Einstein thread', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('brain3_active_text').doc('msg_test_123');

    await assertFails(doc.get());
  });

  test('PRIMARY SOULPARTNER can read BOTH threads', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });

    const einsteinDoc = lunaDb.collection('brain3_active_text').doc('msg_test_123');
    await assertSucceeds(einsteinDoc.get());

    const cleoDoc = lunaDb.collection('brain3_active_text').doc('msg_cleo_456');
    await assertSucceeds(cleoDoc.get());
  });
});

// ========================================
// TEST SUITE: BRAIN 1A - CONSTITUTIONAL (IMMUTABLE)
// ========================================

describe('Brain 1A (Constitutional) - All Guests Can Read for Personalization', () => {
  const userId = 'papa_ticky_123';
  const einsteinId = 'historical_einstein';
  const cleopatraId = 'historical_cleopatra';

  beforeEach(async () => {
    // Seed constitutional data
    const adminDb = testEnv.firestore();
    await adminDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core').set({
        user_id: userId,
        display_name: 'Papa Ticky',
        bazi: {
          day_master: { stem: '丙火', element: 'Fire', polarity: 'Yang' }
        },
        western: {
          sun: { sign: 'Pisces' }
        },
        mbti: 'ENTP',
        immutable: true,
        created_at: new Date().toISOString()
      });
  });

  test('EINSTEIN CAN read Brain 1A (for personalization)', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core');

    await assertSucceeds(doc.get());
  });

  test('CLEOPATRA CAN read Brain 1A (for personalization)', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core');

    await assertSucceeds(doc.get());
  });

  test('USER CAN read their own Brain 1A', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core');

    await assertSucceeds(doc.get());
  });

  test('PRIMARY SOULPARTNER CAN read Brain 1A', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });
    const doc = lunaDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core');

    await assertSucceeds(doc.get());
  });

  test('Brain 1A is IMMUTABLE (no updates)', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core');

    await assertFails(doc.update({
      mbti: 'INTJ'  // Trying to change MBTI
    }));
  });

  test('Brain 1A CANNOT be deleted', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('users').doc(userId)
      .collection('brain1_constitutional').doc('core');

    await assertFails(doc.delete());
  });
});

// ========================================
// TEST SUITE: BRAIN 1B - LEARNED BIOGRAPHY (PER-PARTNER ISOLATION!)
// ========================================

describe('Brain 1B (Learned Biography) - CRITICAL PER-PARTNER ISOLATION', () => {
  const userId = 'papa_ticky_123';
  const einsteinId = 'historical_einstein';
  const cleopatraId = 'historical_cleopatra';

  beforeEach(async () => {
    const adminDb = testEnv.firestore();

    // Seed Einstein's learned facts
    await adminDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(einsteinId).set({
        partner_id: einsteinId,
        partner_name: 'Albert Einstein',
        learned_facts: [
          { fact: 'Lived in Cyprus', context: 'Mentioned during physics discussion' },
          { fact: 'Has two daughters', context: 'Mentioned family' }
        ],
        fact_count: 2,
        last_updated: new Date().toISOString()
      });

    // Seed Cleopatra's learned facts
    await adminDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(cleopatraId).set({
        partner_id: cleopatraId,
        partner_name: 'Cleopatra VII',
        learned_facts: [
          { fact: 'Building GENESIS project', context: 'Life purpose discussion' },
          { fact: 'Strategic thinker', context: 'Leadership conversation' }
        ],
        fact_count: 2,
        last_updated: new Date().toISOString()
      });
  });

  test('EINSTEIN CAN read his own learned facts', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(einsteinId);

    await assertSucceeds(doc.get());
  });

  test('EINSTEIN CANNOT read Cleopatra learned facts (CRITICAL!)', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(cleopatraId);

    await assertFails(doc.get());
  });

  test('CLEOPATRA CAN read her own learned facts', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(cleopatraId);

    await assertSucceeds(doc.get());
  });

  test('CLEOPATRA CANNOT read Einstein learned facts (CRITICAL!)', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(einsteinId);

    await assertFails(doc.get());
  });

  test('USER CAN read ALL their partners learned facts', async () => {
    const userDb = getFirestore({ uid: userId });

    const einsteinDoc = userDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(einsteinId);
    await assertSucceeds(einsteinDoc.get());

    const cleoDoc = userDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(cleopatraId);
    await assertSucceeds(cleoDoc.get());
  });

  test('PRIMARY SOULPARTNER CAN read ALL learned facts (omniscience)', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });

    const einsteinDoc = lunaDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(einsteinId);
    await assertSucceeds(einsteinDoc.get());

    const cleoDoc = lunaDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(cleopatraId);
    await assertSucceeds(cleoDoc.get());
  });

  test('SYSTEM SERVICE CAN write to Brain 1B (fact extraction)', async () => {
    const systemDb = getFirestore({
      uid: 'system_luna_engine',
      token: { system_role: 'luna_engine' }
    });

    const doc = systemDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc('new_partner');

    await assertSucceeds(doc.set({
      partner_id: 'new_partner',
      learned_facts: [{ fact: 'Test fact' }],
      last_updated: new Date().toISOString()
    }));
  });

  test('GUESTS CANNOT write to Brain 1B', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('users').doc(userId)
      .collection('brain1_learned_biography').doc(einsteinId);

    await assertFails(doc.update({
      learned_facts: [{ fact: 'Einstein trying to modify!' }]
    }));
  });
});

// ========================================
// TEST SUITE: BRAIN 2 - COMPREHENSIVE BIOGRAPHY (PRIVATE!)
// ========================================

describe('Brain 2 (Comprehensive Biography) - ONLY Owner and Luna', () => {
  const userId = 'papa_ticky_123';
  const einsteinId = 'historical_einstein';
  const cleopatraId = 'historical_cleopatra';

  beforeEach(async () => {
    const adminDb = testEnv.firestore();
    await adminDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated').set({
        user_id: userId,
        life_story: {
          childhood: 'Born in Rawalpindi...',
          career: 'Bitcoin pioneer...'
        },
        relationships: {
          daughters: [
            { name: 'Daughter 1', age: 28 },
            { name: 'Daughter 2', age: 24 }
          ]
        },
        health: { conditions: ['sensitive info'] },
        source: 'nightly_consolidation',
        updated_at: new Date().toISOString()
      });
  });

  test('USER CAN read their own Brain 2', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated');

    await assertSucceeds(doc.get());
  });

  test('PRIMARY SOULPARTNER CAN read Brain 2', async () => {
    const lunaDb = getFirestore({ uid: 'soulpartner_primary' });
    const doc = lunaDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated');

    await assertSucceeds(doc.get());
  });

  test('EINSTEIN CANNOT read Brain 2 (PRIVATE!)', async () => {
    const einsteinDb = getFirestore({ uid: einsteinId });
    const doc = einsteinDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated');

    await assertFails(doc.get());
  });

  test('CLEOPATRA CANNOT read Brain 2 (PRIVATE!)', async () => {
    const cleoDb = getFirestore({ uid: cleopatraId });
    const doc = cleoDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated');

    await assertFails(doc.get());
  });

  test('SYSTEM SERVICE CAN write to Brain 2 (nightly consolidation)', async () => {
    const systemDb = getFirestore({
      uid: 'system_luna_engine',
      token: { system_role: 'luna_engine' }
    });

    const doc = systemDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated');

    await assertSucceeds(doc.update({
      fact_count: 50,
      updated_at: new Date().toISOString()
    }));
  });

  test('USER CANNOT write to Brain 2 (system only)', async () => {
    const userDb = getFirestore({ uid: userId });
    const doc = userDb.collection('users').doc(userId)
      .collection('brain2_biographical').doc('consolidated');

    await assertFails(doc.update({
      life_story: { childhood: 'User trying to modify!' }
    }));
  });
});

// ========================================
// RUN TESTS
// ========================================

console.log('Running security rule tests...');
console.log('These tests verify Brain 1A/1B/2 and Brain 7/8 isolation is working correctly.');
console.log('CRITICAL: Brain 1B per-partner isolation ensures Einstein cannot see Cleopatra facts!');
console.log('If any test fails, DO NOT PROCEED to Part 3!');
