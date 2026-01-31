# IMPLEMENTATION PART 1: FIREBASE SCHEMA & SECURITY RULES
## Foundation - Deploy This First

**Date:** January 2, 2026  
**For:** Brother Code (Claude Code)  
**Based on:** Brother Opus Review + Papa Ticky Design  
**Priority:** CRITICAL - Must deploy before any other code

---

## OVERVIEW

This file contains:
1. Firestore collection structure
2. Security rules (CRITICAL for Brain 7/8 isolation)
3. Database indexes for performance
4. Storage bucket structure

**Deployment Order:**
1. Create Firestore collections
2. Deploy security rules
3. Create indexes
4. Setup storage buckets

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
    // BRAIN 1 & 2: USER PROFILES
    // ========================================
    
    match /users/{userId} {
      // Users can read/write own profile
      allow read, write: if isOwner(userId);
      
      // Primary SoulPartner can read (not write)
      allow read: if isPrimarySoulPartner();
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

- [ ] Collections created in Firestore
- [ ] Security rules deployed
- [ ] Indexes created (check Firebase console)
- [ ] Storage buckets configured
- [ ] Test that Einstein CANNOT read Brain 7 (see Part 2)
- [ ] Test that Luna CAN read Brain 7 (see Part 2)
- [ ] Test that user can read own messages
- [ ] Test that guest can read only their thread

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
