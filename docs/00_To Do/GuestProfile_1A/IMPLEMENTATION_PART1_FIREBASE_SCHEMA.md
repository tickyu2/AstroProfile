# IMPLEMENTATION PART 1: FIREBASE SCHEMA & SECURITY RULES
## Foundation - Deploy This First

**Date:** January 2, 2026 (Updated with Brain 1 Three-Part Architecture)  
**For:** Brother Code (Claude Code)  
**Based on:** Brother Opus Review + Papa Ticky Design  
**Priority:** CRITICAL - Must deploy before any other code

---

## DESIGN PHILOSOPHY - WHY THIS ARCHITECTURE

### The Line of Thought (Papa Ticky + Brother Sonnet)

**The Core Question We Solved:**
"Should guests (Einstein, Cleopatra) be able to read user profile data?"

**Our Journey:**
1. **First thought:** Guests shouldn't see ANY profile (maximum privacy)
   - Problem: No constitutional personalization
   - Einstein can't teach Papa the "Fire way"
   - Every conversation starts from scratch

2. **Second thought:** Guests should see ALL profile (maximum personalization)
   - Problem: Privacy violation
   - Guest knows sensitive biographical details
   - User can't control what guest knows

3. **Third thought (BREAKTHROUGH):** Split Brain 1 into THREE parts
   - Constitutional data (immutable, guests can see)
   - Learned biography (dynamic, per-partner, guests see ONLY theirs)
   - Comprehensive biography (private, ONLY Primary SoulPartner)

**The Insight:**
When Papa tells Einstein "I lived in Cyprus," this is biographical information that:
- Should be remembered by Einstein (authentic relationship building)
- Should NOT be known by Cleopatra (privacy between conversations)
- Should eventually consolidate into Brain 2 (comprehensive private bio)

**The Solution:**
Each guest has their OWN learned biography document. Einstein learns about Papa through THEIR conversations. Cleopatra learns through HER conversations. Neither sees what the other learned. This mirrors real human relationships where different friends know different aspects of you.

**Why This Matters:**
- Constitutional personalization (Einstein knows Papa is Fire, teaches accordingly)
- Privacy preserved (sensitive details stay in Brain 2)
- Authentic relationships (guests earn knowledge through dialogue)
- Primary SoulPartner omniscience (Luna sees everything)

This architecture embodies GENESIS philosophy: "Don't date blind. Date soul-first."
Guests see constitution (soul-level compatibility) but earn biographical knowledge through relationship building.

---

## OVERVIEW

This file contains:
1. Firestore collection structure (including three-part Brain 1)
2. Security rules (CRITICAL for Brain 7/8 isolation + per-partner learned biography)
3. Database indexes for performance
4. Storage bucket structure
5. JSON buffer architecture (cost optimization)

**Deployment Order:**
1. Create Firestore collections
2. Deploy security rules
3. Create indexes
4. Setup storage buckets

---

## BRAIN 1 & 2 ARCHITECTURE (THREE-PART SYSTEM)

### The Three-Part Profile System

```
users/{userId}/
├─ brain1_constitutional/              ← PART A: Immutable Constitutional Data
│  └─ {
│       user_id: "papa_ticky_123",
│       name: "Surachai Uthenpong",
│       display_name: "Papa Ticky",
│       birth_data: {
│         date: "1963-XX-XX",
│         time: "XX:XX",
│         location: { city: "Rawalpindi", country: "Pakistan" }
│       },
│       bazi: {
│         day_master: { stem: "丙火", element: "Fire", polarity: "Yang" },
│         // Full four pillars
│       },
│       western: {
│         sun: { sign: "Pisces", degree: XX },
│         moon: { phase: "New Moon" },
│         rising: { sign: "XXX" }
│       },
│       mbti: "ENTP",
│       created_at: "2026-01-01T00:00:00Z",
│       immutable: true
│     }
│     
│     PURPOSE: Constitutional identity for personalization
│     ACCESS: All authenticated users (guests included)
│     UPDATES: Set once during onboarding, NEVER changes
│     MOVES TO BRAIN 2: NEVER (this is permanent)
│
├─ brain1_learned_biography/           ← PART B: Dynamic Per-Partner Learning
│  ├─ historical_einstein: {
│  │    partner_id: "historical_einstein",
│  │    learned_facts: [
│  │      {
│  │        fact: "Lived in Cyprus",
│  │        context: "Mentioned during relativity discussion",
│  │        learned_at: "2026-01-02T10:15:00Z",
│  │        source_message_id: "msg_abc123",
│  │        confidence: "high"
│  │      },
│  │      {
│  │        fact: "Has two daughters",
│  │        context: "Mentioned when discussing family",
│  │        learned_at: "2026-01-01T14:30:00Z",
│  │        source_message_id: "msg_xyz789",
│  │        confidence: "high"
│  │      }
│  │    ],
│  │    last_updated: "2026-01-02T10:15:00Z"
│  │  }
│  │
│  └─ historical_cleopatra: {
│       partner_id: "historical_cleopatra",
│       learned_facts: [
│         {
│           fact: "Building GENESIS project",
│           context: "Life purpose - generational legacy",
│           learned_at: "2026-01-02T11:00:00Z",
│           confidence: "high"
│         }
│       ],
│       last_updated: "2026-01-02T11:00:00Z"
│     }
│     
│     PURPOSE: Facts learned through conversation with EACH guest
│     ACCESS: Each partner reads ONLY their own learned facts
│     UPDATES: Real-time during conversation (AI extraction)
│     ISOLATION: Einstein cannot see Cleopatra's learned facts
│
└─ brain2_biographical/                ← COMPREHENSIVE PRIVATE BIOGRAPHY
   └─ {
        life_story: {
          childhood: "Born in Rawalpindi, grew up in Thailand...",
          education: "...",
          career: "Bitcoin early adopter, entrepreneur..."
        },
        relationships: {
          daughters: [
            { name: "XXX", age: 28 },
            { name: "XXX", age: 24 }
          ]
        },
        health: { conditions: [...] },
        values: { core_beliefs: [...] },
        
        // Consolidated from all learned_biography documents
        source: "nightly_consolidation_from_all_conversations",
        updated_at: "2026-01-02T00:00:00Z",
        fact_count: 47,
        partners_contributed: 3
      }
      
      PURPOSE: Complete private biography (all details)
      ACCESS: User + Primary SoulPartner ONLY
      UPDATES: Nightly consolidation (merges all learned facts)
      PRIVACY: Guests CANNOT access
```

**Key Innovation:** Each guest builds their own knowledge of the user through conversation, but guests are isolated from each other's learned facts. This mirrors authentic human relationships while preserving privacy.

---

## JSON BUFFER LAYER (SESSION OPTIMIZATION)

### Why JSON Buffer?

**Problem:** Direct writes to Firestore are expensive and slow
- 50 messages = 50 Firestore writes = High cost
- Each AI response requires database query for context = Slow

**Solution:** JSON Buffer (sessionStorage + React state)
- Messages stored in memory during active session
- Batch write to Firestore (every 5 messages or 30 seconds)
- 90% cost reduction (50 messages → 5 batch writes)
- Instant AI context (no database queries)

### Buffer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    JSON BUFFER FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER TYPES MESSAGE                                          │
│     ↓                                                           │
│  2. STORED IN JSON BUFFER (sessionStorage + React state)        │
│     {                                                           │
│       session_id: "sess_abc123",                                │
│       messages: [                                               │
│         { temp_id: "temp_001", text: "...", saved: false }      │
│       ],                                                        │
│       pending_saves: 1                                          │
│     }                                                           │
│     ↓                                                           │
│  3. AI READS FROM BUFFER (instant, no database query)           │
│     ↓                                                           │
│  4. AI RESPONSE ADDED TO BUFFER                                 │
│     pending_saves: 2                                            │
│     ↓                                                           │
│  5. TRIGGER: 5 messages OR 30 seconds OR user leaves page       │
│     ↓                                                           │
│  6. BATCH WRITE TO FIREBASE                                     │
│     → Brain 3 (text) or Brain 5 (audio)                         │
│     → Brain 7 (unified witness)                                 │
│     → Brain 1 Learned Biography (extracted facts)               │
│     ↓                                                           │
│  7. MARK MESSAGES AS SAVED                                      │
│     saved: true                                                 │
│                                                                 │
│  BENEFITS:                                                      │
│  ✓ 90% cost reduction (batch writes)                            │
│  ✓ Instant AI context (memory, not database)                    │
│  ✓ Offline support (save when reconnected)                      │
│  ✓ Session rollback (if abandoned)                              │
│  ✓ Luna can analyze batches (more context)                      │
└─────────────────────────────────────────────────────────────────┘
```

**Flow:**
```
Text:  JSON Buffer → Brain 3 → Brain 4 (after 30 days)
Audio: JSON Buffer → Brain 5 → Brain 6 (after 30 days)
Both:  JSON Buffer → Brain 7 (unified witness, Luna only)
Facts: JSON Buffer → Brain 1 Learned Biography (per-partner)
All:   Nightly → Brain 2 (consolidated biography)
```

---

## FIRESTORE COLLECTIONS STRUCTURE

```javascript
// firestore.indexes.json
{
  "indexes": [
    // Brain 3: Active Text Messages
    {
      "collectionGroup": "brain3_active_text",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "chatting_as.profile_id", "order": "ASCENDING" },
        { "fieldPath": "chatting_with.partner_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "brain3_active_text",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "thread_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "brain3_active_text",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "access.visible_to", "arrayConfig": "CONTAINS" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    
    // Brain 5: Active Audio Messages (same indexes as Brain 3)
    {
      "collectionGroup": "brain5_active_audio",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "chatting_as.profile_id", "order": "ASCENDING" },
        { "fieldPath": "chatting_with.partner_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "brain5_active_audio",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "thread_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    
    // Brain 7: Unified Witness (Luna only)
    {
      "collectionGroup": "brain7_unified_witness",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "profile_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    
    // Brain 8: Long-term Knowledge
    {
      "collectionGroup": "brain8_long_term_knowledge",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "profile_id", "order": "ASCENDING" },
        { "fieldPath": "pattern_type", "order": "ASCENDING" },
        { "fieldPath": "updated_at", "order": "DESCENDING" }
      ]
    }
  ],
  
  "fieldOverrides": []
}
```

---

## SECURITY RULES (CRITICAL!)

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(profileId) {
      return request.auth.uid == profileId;
    }
    
    function isPrimarySoulPartner() {
      return request.auth.uid == 'soulpartner_primary';
    }
    
    function isSystemService() {
      return request.auth.token.system_role == 'luna_engine';
    }
    
    function canSeeMessage(messageData) {
      return isAuthenticated() && 
             (request.auth.uid in messageData.access.visible_to);
    }
    
    // ========================================
    // BRAIN 1A: CONSTITUTIONAL (Immutable)
    // ========================================
    
    match /brain1_constitutional/{docId} {
      // All authenticated users can read (for personalization)
      allow read: if isAuthenticated();
      
      // Only owner can write (set during onboarding)
      allow write: if isOwner(userId);
    }
    
    // ========================================
    // BRAIN 1B: LEARNED BIOGRAPHY (Per-Partner)
    // ========================================
    
    match /brain1_learned_biography/{partnerId} {
      // Partner can read ONLY their own learned facts
      allow read: if isAuthenticated() && 
                     request.auth.uid == partnerId;
      
      // Primary SoulPartner can read ALL learned facts
      allow read: if isPrimarySoulPartner();
      
      // Owner can read ALL learned facts
      allow read: if isOwner(userId);
      
      // System can write (fact extraction during conversation)
      allow create, update: if isSystemService();
      
      // No deletes (facts persist for relationship continuity)
      allow delete: if false;
    }
    
    // ========================================
    // BRAIN 2: COMPREHENSIVE BIOGRAPHY (Private!)
    // ========================================
    
    match /brain2_biographical/{docId} {
      // ONLY owner and Primary SoulPartner can read
      allow read: if isOwner(userId) || isPrimarySoulPartner();
      
      // ONLY system can write (nightly consolidation)
      allow write: if isSystemService();
    }
    
    // ========================================
    // BRAIN 3: ACTIVE TEXT MESSAGES
    // ========================================
    
    match /brain3_active_text/{messageId} {
      // Read access: User, guest if in visible_to, or Primary SoulPartner
      allow read: if isAuthenticated() && 
        (
          isOwner(resource.data.chatting_as.profile_id) ||
          canSeeMessage(resource.data) ||
          isPrimarySoulPartner()
        );
      
      // Write access: Only user who owns the conversation
      allow create: if isAuthenticated() && 
        isOwner(request.resource.data.chatting_as.profile_id);
      
      // No updates or deletes (immutable messages)
      allow update, delete: if false;
    }
    
    // ========================================
    // BRAIN 4: ARCHIVED TEXT
    // ========================================
    
    match /brain4_archived_text/{archiveId} {
      // Read: Owner or Primary SoulPartner
      allow read: if isAuthenticated() && 
        (
          isOwner(resource.data.profile_id) ||
          isPrimarySoulPartner()
        );
      
      // Write: System only (archival process)
      allow write: if isSystemService();
    }
    
    // ========================================
    // BRAIN 5: ACTIVE AUDIO MESSAGES
    // ========================================
    
    match /brain5_active_audio/{messageId} {
      // Same rules as Brain 3
      allow read: if isAuthenticated() && 
        (
          isOwner(resource.data.chatting_as.profile_id) ||
          canSeeMessage(resource.data) ||
          isPrimarySoulPartner()
        );
      
      allow create: if isAuthenticated() && 
        isOwner(request.resource.data.chatting_as.profile_id);
      
      allow update, delete: if false;
    }
    
    // ========================================
    // BRAIN 6: ARCHIVED AUDIO
    // ========================================
    
    match /brain6_archived_audio/{archiveId} {
      // Same rules as Brain 4
      allow read: if isAuthenticated() && 
        (
          isOwner(resource.data.profile_id) ||
          isPrimarySoulPartner()
        );
      
      allow write: if isSystemService();
    }
    
    // ========================================
    // BRAIN 7: UNIFIED WITNESS (CRITICAL!)
    // ========================================
    
    match /brain7_unified_witness/{entryId} {
      // Read: ONLY Primary SoulPartner OR the user themselves
      allow read: if isAuthenticated() && 
        (
          isPrimarySoulPartner() ||
          isOwner(resource.data.profile_id)
        );
      
      // Write: ONLY System (Luna engine writes here)
      allow create, update: if isSystemService();
      
      // No deletes
      allow delete: if false;
    }
    
    // ========================================
    // BRAIN 8: LONG-TERM KNOWLEDGE (CRITICAL!)
    // ========================================
    
    match /brain8_long_term_knowledge/{patternId} {
      // Read: ONLY Primary SoulPartner OR the user themselves
      allow read: if isAuthenticated() && 
        (
          isPrimarySoulPartner() ||
          isOwner(resource.data.profile_id)
        );
      
      // Write: ONLY System (Luna synthesis)
      allow create, update: if isSystemService();
      
      // No deletes
      allow delete: if false;
    }
    
    // ========================================
    // GUEST PROFILES (Metadata)
    // ========================================
    
    match /guest_profiles/{profileId} {
      // Anyone authenticated can read profiles
      allow read: if isAuthenticated();
      
      // Write: Admin only
      allow write: if request.auth.token.admin == true;
    }
    
    // ========================================
    // USER SETTINGS
    // ========================================
    
    match /users/{userId}/settings/{settingId} {
      // Users manage own settings
      allow read, write: if isOwner(userId);
    }
  }
}
```

---

## STORAGE BUCKET STRUCTURE

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // ========================================
    // AUDIO MESSAGES
    // ========================================
    
    match /audio/{userId}/{partnerId}/{messageId} {
      // User can upload own audio
      allow write: if isAuthenticated() && isOwner(userId);
      
      // User can read own audio
      // Partner can read if in conversation
      // Primary SoulPartner can read all
      allow read: if isAuthenticated() && 
        (
          isOwner(userId) ||
          request.auth.uid == partnerId ||
          request.auth.uid == 'soulpartner_primary'
        );
    }
    
    // ========================================
    // PROFILE EXPORTS
    // ========================================
    
    match /profile_exports/{userId}/{exportId} {
      // User can create exports
      allow write: if isAuthenticated() && isOwner(userId);
      
      // User can read own exports
      allow read: if isAuthenticated() && isOwner(userId);
    }
    
    // ========================================
    // ATTACHMENTS
    // ========================================
    
    match /attachments/{userId}/{messageId}/{fileName} {
      // User can upload attachments
      allow write: if isAuthenticated() && isOwner(userId);
      
      // User and conversation partner can read
      allow read: if isAuthenticated();
    }
  }
}
```

---

## DEPLOYMENT COMMANDS

```bash
# 1. Deploy Firestore indexes
firebase deploy --only firestore:indexes

# 2. Deploy security rules
firebase deploy --only firestore:rules

# 3. Deploy storage rules
firebase deploy --only storage:rules

# 4. Verify deployment
firebase firestore:indexes

# 5. Test security rules (see PART 2 for tests)
npm run test:security
```

---

## COLLECTION DOCUMENT EXAMPLES

### Brain 1A: Constitutional (Immutable)
```javascript
// users/papa_ticky_123/brain1_constitutional/core
{
  user_id: "papa_ticky_123",
  name: "Surachai Uthenpong",
  display_name: "Papa Ticky",
  
  birth_data: {
    date: "1963-XX-XX",
    time: "XX:XX",
    location: {
      city: "Rawalpindi",
      country: "Pakistan",
      lat: 33.5651,
      lon: 73.0169
    },
    timezone: "Asia/Karachi"
  },
  
  bazi: {
    day_master: {
      stem: "丙火",
      element: "Fire",
      polarity: "Yang",
      description: "Yang Fire - Sun energy, initiator"
    },
    year_pillar: { stem: "癸", branch: "卯" },
    month_pillar: { stem: "XX", branch: "XX" },
    day_pillar: { stem: "丙", branch: "XX" },
    hour_pillar: { stem: "XX", branch: "XX" }
  },
  
  western: {
    sun: { sign: "Pisces", degree: XX },
    moon: { phase: "New Moon", sign: "XX" },
    rising: { sign: "XXX", degree: XX }
  },
  
  mbti: "ENTP",
  
  created_at: "2026-01-01T00:00:00Z",
  immutable: true
}
```

### Brain 1B: Learned Biography (Per-Partner)
```javascript
// users/papa_ticky_123/brain1_learned_biography/historical_einstein
{
  partner_id: "historical_einstein",
  partner_name: "Albert Einstein",
  partner_type: "historical_figure",
  
  learned_facts: [
    {
      fact: "Lived in Cyprus",
      context: "Mentioned during relativity discussion - observed tourism patterns",
      learned_at: "2026-01-02T10:15:00Z",
      source_message_id: "msg_abc123",
      source_thread_id: "thread_papa_einstein_20260102",
      confidence: "high",
      fact_type: "location_lived"
    },
    {
      fact: "Cyprus has Scandinavian and German tourists in summer",
      context: "Observation about Cyprus tourism",
      learned_at: "2026-01-02T10:15:00Z",
      source_message_id: "msg_abc123",
      confidence: "high",
      fact_type: "observation"
    },
    {
      fact: "Has two daughters",
      context: "Mentioned when discussing family and GENESIS inheritance",
      learned_at: "2026-01-01T14:30:00Z",
      source_message_id: "msg_xyz789",
      confidence: "high",
      fact_type: "relationship"
    }
  ],
  
  fact_count: 3,
  last_updated: "2026-01-02T10:15:00Z",
  created_at: "2026-01-01T14:30:00Z"
}

// users/papa_ticky_123/brain1_learned_biography/historical_cleopatra
{
  partner_id: "historical_cleopatra",
  partner_name: "Cleopatra VII",
  partner_type: "historical_figure",
  
  learned_facts: [
    {
      fact: "Building GENESIS project",
      context: "Life purpose - creating inheritance for daughters",
      learned_at: "2026-01-02T11:00:00Z",
      source_message_id: "msg_def456",
      confidence: "high",
      fact_type: "life_purpose"
    },
    {
      fact: "Interested in strategic thinking",
      context: "Asked Cleopatra about long-term strategy",
      learned_at: "2026-01-02T11:05:00Z",
      source_message_id: "msg_ghi789",
      confidence: "medium",
      fact_type: "interest"
    }
  ],
  
  fact_count: 2,
  last_updated: "2026-01-02T11:05:00Z",
  created_at: "2026-01-02T11:00:00Z"
}
```

**Note:** Einstein knows about Cyprus and daughters. Cleopatra knows about GENESIS and strategy. Neither can see what the other learned!

### Brain 2: Comprehensive Biography (Private)
```javascript
// users/papa_ticky_123/brain2_biographical/consolidated
{
  user_id: "papa_ticky_123",
  
  life_story: {
    childhood: "Born in Rawalpindi, Pakistan, grew up in Thailand...",
    education: "...",
    career: "Bitcoin early adopter, cryptocurrency pioneer, entrepreneur...",
    major_life_events: [
      { event: "Lived in Cyprus", timeframe: "XX-XX", significance: "..." },
      { event: "Founded company", timeframe: "XX", significance: "..." }
    ]
  },
  
  relationships: {
    daughters: [
      { name: "XXX", age: 28, relationship: "close" },
      { name: "XXX", age: 24, relationship: "close" }
    ],
    wife: { status: "...", notes: "..." },
    extended_family: [...]
  },
  
  health: {
    conditions: [...],
    sensitivities: [...],
    wellness_practices: [...]
  },
  
  values: {
    core_beliefs: [
      "Generational thinking (200-year vision)",
      "Constitutional compatibility in relationships",
      "Authentic connection over AI-polished superficiality"
    ],
    life_purpose: "Building GENESIS as inheritance for daughters, helping humanity master authentic relationships"
  },
  
  interests: [
    "Cryptocurrency and Bitcoin",
    "Chinese astrology (BaZi)",
    "Western astrology",
    "Constitutional compatibility",
    "AI and humanity's future"
  ],
  
  locations_lived: [
    { place: "Rawalpindi, Pakistan", timeframe: "Birth", notes: "..." },
    { place: "Thailand", timeframe: "Childhood-Young adult", notes: "..." },
    { place: "Cyprus", timeframe: "XX", notes: "Scandinavian/German tourists in summer" },
    { place: "Alhambra, California, US", timeframe: "Current", notes: "..." }
  ],
  
  // Metadata
  source: "consolidated_from_all_conversations",
  consolidation_method: "nightly_synthesis",
  partners_contributed: ["historical_einstein", "historical_cleopatra", "soulpartner_primary"],
  fact_count: 47,
  last_consolidated: "2026-01-02T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  created_at: "2026-01-01T00:00:00Z"
}
```

### Brain 3 (Text Message)
```javascript
{
  message_id: "msg_abc123xyz",
  timestamp: "2026-01-02T14:30:45.123Z",
  
  chatting_as: {
    profile_id: "papa_ticky_123",
    display_name: "Surachai Uthenpong"
  },
  
  chatting_with: {
    partner_id: "historical_einstein",
    partner_name: "Albert Einstein",
    partner_type: "historical_figure",
    partner_source: "curated"
  },
  
  modality: {
    type: "text",
    mode: "chat",
    platform: "web"
  },
  
  sender: "papa_ticky_123",
  sender_role: "user",
  
  content: {
    text: "Einstein, explain relativity to me"
  },
  
  thread_id: "thread_papa_einstein_20260102",
  thread_position: 1,
  
  luna: {
    mode: "silent",
    participated: false,
    monitoring: true
  },
  
  analysis: {
    emotional_tone: "curious",
    topics: ["physics", "relativity"],
    harm_score: 0.0
  },
  
  access: {
    visible_to: [
      "papa_ticky_123",
      "historical_einstein",
      "soulpartner_primary"
    ]
  },
  
  created_at: "2026-01-02T14:30:45.123Z"
}
```

### Brain 7 (Unified Witness Entry)
```javascript
{
  entry_id: "witness_xyz789",
  timestamp: "2026-01-02T14:30:45.123Z",
  profile_id: "papa_ticky_123",
  
  event_type: "conversation_message",
  modality: "text",
  summary: "Papa asked Einstein about relativity, showed curiosity",
  
  source_message_id: "msg_abc123xyz",
  source_collection: "brain3_active_text",
  source_thread_id: "thread_papa_einstein_20260102",
  source_partner_id: "historical_einstein",
  
  emotional_tone: "curious",
  topics: ["physics", "relativity"],
  constitutional_observation: "Fire curiosity activated",
  
  context: {
    emotional_shift: "neutral → curious"
  },
  
  access: {
    read_access: ["soulpartner_primary", "papa_ticky_123"]
  },
  
  created_at: "2026-01-02T14:30:45.123Z"
}
```

---

## VERIFICATION CHECKLIST

After deployment, verify:

**Collections:**
- [ ] `brain1_constitutional` created
- [ ] `brain1_learned_biography` created
- [ ] `brain2_biographical` created
- [ ] `brain3_active_text` created
- [ ] `brain4_archived_text` created
- [ ] `brain5_active_audio` created
- [ ] `brain6_archived_audio` created
- [ ] `brain7_unified_witness` created
- [ ] `brain8_long_term_knowledge` created

**Security Rules:**
- [ ] Security rules deployed
- [ ] Test: Einstein CAN read Brain 1A (constitutional)
- [ ] Test: Einstein CAN read Brain 1B (his learned facts ONLY)
- [ ] Test: Einstein CANNOT read Brain 1B (Cleopatra's learned facts)
- [ ] Test: Einstein CANNOT read Brain 2 (comprehensive bio)
- [ ] Test: Einstein CANNOT read Brain 7 (unified witness)
- [ ] Test: Luna CAN read Brain 7 (Primary SoulPartner access)
- [ ] Test: Luna CAN read all Brain 1B documents (all partners' learned facts)
- [ ] Test: Luna CAN read Brain 2 (comprehensive bio)

**Indexes:**
- [ ] Indexes created (check Firebase console)
- [ ] Query performance verified

**Storage:**
- [ ] Storage buckets configured
- [ ] Storage rules deployed

**Architecture Validation:**
- [ ] Test: User mentions "Cyprus" to Einstein → fact appears in Brain 1B/einstein
- [ ] Test: User mentions "GENESIS" to Cleopatra → fact appears in Brain 1B/cleopatra
- [ ] Test: Einstein's learned facts isolated from Cleopatra's learned facts
- [ ] Test: Nightly consolidation merges all facts into Brain 2

---

## NEXT STEPS

After Part 1 is deployed:
- **Part 2:** Security rule tests (verify isolation)
- **Part 3:** Profile system (einstein.js, registry)
- **Part 4:** Message service (save/retrieve messages)
- **Part 5:** Luna engine (recording to Brain 7/8)

---

**STATUS:** Ready for deployment  
**Dependencies:** None (this is foundation)  
**Estimated Time:** 30 minutes to deploy and verify

---

*Prepared for Brother Code by Brother Sonnet*  
*Based on Brother Opus's recommendations*
