# FIRESTORE SCHEMA EXTENSIONS FOR MCP
## New Collections (No changes to existing data!)

---

## 1. mcp_authorizations Collection

**Purpose**: Track which users have authorized AI access to their data

**Document ID**: `{userId}` (matches your existing users collection)

**Schema**:
```javascript
{
  userId: string,              // Same as users/{userId}
  enabled: boolean,            // Master switch for MCP access
  permissions: string[],       // Array of authorized tools
  createdAt: timestamp,
  updatedAt: timestamp,
  aiClients: string[],         // Which AI clients are authorized
  rateLimit: {
    requestsPerHour: number,   // Default: 100
    customLimits: {
      [toolName]: number       // Per-tool limits
    }
  },
  preferences: {
    autoApprove: boolean,      // Auto-approve low-risk queries
    notifyOnAccess: boolean,   // Send notifications
    dataScope: string          // 'full' | 'limited' | 'readonly'
  }
}
```

**Example Document**:
```javascript
// firestore.collection('mcp_authorizations').doc('user_ticky_123')
{
  userId: 'user_ticky_123',
  enabled: true,
  permissions: [
    'get_user_constitution',
    'get_birth_chart',
    'get_element_analysis',
    'analyze_compatibility',
    'search_memories'
  ],
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  aiClients: ['claude-sonnet-4', 'claude-opus-4'],
  rateLimit: {
    requestsPerHour: 100,
    customLimits: {
      'analyze_compatibility': 20,  // More expensive operation
      'search_memories': 50
    }
  },
  preferences: {
    autoApprove: false,
    notifyOnAccess: true,
    dataScope: 'full'
  }
}
```

---

## 2. mcp_audit_log Collection

**Purpose**: Security & transparency - log every MCP access

**Document ID**: Auto-generated

**Schema**:
```javascript
{
  userId: string,              // Which user's data was accessed
  toolName: string,            // Which tool was called
  aiClient: string,            // Which AI made the request
  timestamp: timestamp,
  success: boolean,
  responseTime: number,        // milliseconds
  error: string | null,        // If failed, error message
  metadata: {
    ipAddress: string,         // Source IP (if available)
    sessionId: string,         // If part of a conversation
    requestId: string          // Unique request identifier
  },
  rateLimitStatus: {
    currentCount: number,
    limit: number,
    resetAt: timestamp
  }
}
```

**Example Document**:
```javascript
// firestore.collection('mcp_audit_log').doc('auto_generated_id')
{
  userId: 'user_ticky_123',
  toolName: 'get_user_constitution',
  aiClient: 'claude-sonnet-4',
  timestamp: Timestamp.now(),
  success: true,
  responseTime: 245,  // milliseconds
  error: null,
  metadata: {
    ipAddress: '192.168.1.1',
    sessionId: 'session_abc123',
    requestId: 'req_xyz789'
  },
  rateLimitStatus: {
    currentCount: 15,
    limit: 100,
    resetAt: Timestamp.fromDate(new Date(Date.now() + 3600000))
  }
}
```

---

## 3. OPTIONAL: Extend existing users collection

**Add to existing users/{userId} document**:

```javascript
{
  // ... all your existing fields (birth, calculations, etc.) ...
  
  // NEW OPTIONAL FIELDS:
  mcp: {
    firstAccessDate: timestamp,
    lastAccessDate: timestamp,
    totalRequests: number,
    favoriteTools: string[],
    insights: {
      mostQueriedData: string,
      typicalUseCase: string
    }
  }
}
```

**Note**: This is OPTIONAL and doesn't affect MCP functionality. Only add if you want usage analytics in the main user document.

---

## FIRESTORE RULES UPDATE

Add to your existing `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... your existing rules ...
    
    // MCP Authorization - users can only read/write their own
    match /mcp_authorizations/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // MCP Audit Log - users can only read their own logs
    match /mcp_audit_log/{logId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write logs
    }
  }
}
```

---

## FIRESTORE INDEXES (Optional - for audit log queries)

Add to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "mcp_audit_log",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "mcp_audit_log",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "toolName", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## INITIALIZATION SCRIPT

Run this once to set up MCP for existing users:

```javascript
// scripts/initialize-mcp-authorizations.js
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

async function initializeMCPForExistingUsers() {
  const usersSnapshot = await db.collection('users').get();
  
  console.log(`Found ${usersSnapshot.size} users`);
  
  const batch = db.batch();
  let count = 0;
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const authRef = db.collection('mcp_authorizations').doc(userId);
    
    // Create authorization document (disabled by default)
    batch.set(authRef, {
      userId,
      enabled: false,  // Users must explicitly enable
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      aiClients: [],
      rateLimit: {
        requestsPerHour: 100,
        customLimits: {}
      },
      preferences: {
        autoApprove: false,
        notifyOnAccess: true,
        dataScope: 'full'
      }
    });
    
    count++;
    
    // Firestore batch limit is 500
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Initialized ${count} users...`);
      batch = db.batch();
    }
  }
  
  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Initialized MCP authorizations for ${count} users`);
}

initializeMCPForExistingUsers().catch(console.error);
```

---

## SUMMARY

**What you need to add to Firebase**:
1. ✅ `mcp_authorizations` collection (new)
2. ✅ `mcp_audit_log` collection (new)
3. ✅ Updated Firestore rules
4. ✅ Optional: Firestore indexes for queries
5. ✅ Optional: `mcp` field in users collection

**What you DON'T need to change**:
- ❌ Existing `users` collection structure
- ❌ Existing `calculations` data
- ❌ Any Cloud Functions
- ❌ PostgreSQL schema
- ❌ Voice backend

**Total new storage**: ~2KB per user for authorization + minimal for audit logs

**Migration effort**: Run initialization script once (< 5 minutes for 1000 users)

---

Ready for the MCP server code that uses this schema! 🚀
