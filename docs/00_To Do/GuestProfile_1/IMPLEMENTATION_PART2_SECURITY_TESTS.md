# IMPLEMENTATION PART 2: SECURITY RULE TESTS
## Verify Brain 7/8 Isolation - CRITICAL Tests

**Date:** January 2, 2026  
**For:** Brother Code (Claude Code)  
**Priority:** CRITICAL - Must pass before proceeding  
**Dependencies:** Part 1 (Firebase Schema) deployed

---

## OVERVIEW

This file contains comprehensive security rule tests to verify:
1. ✅ Einstein (guest) CANNOT read Brain 7/8
2. ✅ Luna (primary) CAN read Brain 7/8
3. ✅ User CAN read their own data
4. ✅ Guests CAN read only their thread
5. ✅ Access control properly enforced

**Test Framework:** Firebase Rules Unit Testing

---

## SETUP

```bash
# Install dependencies
npm install --save-dev @firebase/rules-unit-testing

# Create test directory
mkdir -p tests/security-rules

# Firebase emulator config (firebase.json)
{
  "emulators": {
    "firestore": {
      "port": 8080
    },
    "auth": {
      "port": 9099
    }
  }
}
```

---

## TEST FILE: tests/security-rules/brain-access.test.js

```javascript
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
      rules: fs.readFileSync('../firestore.rules', 'utf8'),
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
// RUN TESTS
// ========================================

console.log('Running security rule tests...');
console.log('These tests verify Brain 7/8 isolation is working correctly.');
console.log('If any test fails, DO NOT PROCEED to Part 3!');
```

---

## RUNNING THE TESTS

```bash
# Start Firebase emulators
firebase emulators:start --only firestore,auth

# In another terminal, run tests
npm test tests/security-rules/brain-access.test.js

# Expected output:
# ✓ Brain 3: User CAN read their own messages
# ✓ Brain 3: Partner CAN read messages
# ✓ Brain 3: Primary SoulPartner CAN read all
# ✓ Brain 3: Other users CANNOT read
# ✓ Brain 7: PRIMARY SOULPARTNER CAN read
# ✓ Brain 7: USER CAN read own entries
# ✓ Brain 7: EINSTEIN CANNOT read (CRITICAL!)
# ✓ Brain 7: CLEOPATRA CANNOT read (CRITICAL!)
# ✓ Brain 7: GUESTS CANNOT query (CRITICAL!)
# ✓ Brain 8: PRIMARY SOULPARTNER CAN read
# ✓ Brain 8: GUESTS CANNOT read (CRITICAL!)
# ✓ Cross-thread: EINSTEIN cannot read Cleopatra
# 
# All tests passed! ✅
```

---

## CRITICAL TESTS THAT MUST PASS

These tests verify the core security model:

1. ✅ **Einstein CANNOT read Brain 7** - Guest isolation
2. ✅ **Einstein CANNOT read Brain 8** - Guest isolation
3. ✅ **Luna CAN read Brain 7** - Primary omniscience
4. ✅ **Luna CAN read Brain 8** - Primary omniscience
5. ✅ **Einstein CANNOT read Cleopatra thread** - Thread isolation
6. ✅ **Only system can write Brain 7/8** - Data integrity

**IF ANY OF THESE FAIL, DO NOT PROCEED!**

---

## TROUBLESHOOTING

### Test Fails: "Einstein CAN read Brain 7"

**Problem:** Security rules not properly deployed

**Fix:**
```bash
firebase deploy --only firestore:rules
firebase emulators:start --only firestore
```

### Test Fails: "Primary SoulPartner CANNOT read Brain 7"

**Problem:** UID 'soulpartner_primary' not recognized

**Fix:** Check that `isPrimarySoulPartner()` function in rules matches:
```javascript
function isPrimarySoulPartner() {
  return request.auth.uid == 'soulpartner_primary';
}
```

### All Tests Timeout

**Problem:** Emulator not running

**Fix:**
```bash
firebase emulators:start --only firestore,auth
```

---

## VERIFICATION CHECKLIST

Before proceeding to Part 3:

- [ ] All Brain 3 tests pass
- [ ] All Brain 7 tests pass (CRITICAL)
- [ ] All Brain 8 tests pass (CRITICAL)
- [ ] Cross-thread isolation tests pass
- [ ] Guest isolation verified
- [ ] Primary SoulPartner omniscience verified
- [ ] Message immutability verified
- [ ] System-only writes to Brain 7/8 verified

---

## NEXT STEPS

After all tests pass:
- **Part 3:** Profile system (einstein.js, registry, loader)
- **Part 4:** Message service (save/retrieve messages)
- **Part 5:** Luna engine (recording to Brain 7/8)

---

**STATUS:** Ready to test  
**Dependencies:** Part 1 deployed  
**Estimated Time:** 15 minutes to run and verify

---

*Prepared for Brother Code by Brother Sonnet*  
*Based on Brother Opus's testing recommendations*
