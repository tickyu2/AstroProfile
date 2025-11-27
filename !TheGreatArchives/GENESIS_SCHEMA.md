# GENESIS SCHEMA - Complete Data Model

**Version:** 1.0.0
**Date:** 2025-01-20
**Purpose:** Complete data architecture for AstroProfile GENESIS platform - groups, matching, proximity search, AI conversations, messaging, and all 25 requirements.

---

## PHILOSOPHY

This schema is designed as the "Burj Khalifa foundation" - built to scale from individual profiles to a full social/matching/community platform with:
- Multi-user authentication
- Profile management with rich data
- AI-powered personality refinement
- Proximity-based search
- Compatibility matching
- Group management
- Real-time messaging
- Daily guidance & insights
- Profile comparison tools
- Token-based sharing

---

## FIRESTORE ARCHITECTURE

### Design Principles
1. **Flat Structure with Composite Indexes** - Easier queries, better performance
2. **User-Scoped Data** - All data tied to userId for security
3. **Subcollections for Related Data** - Notes, conversations, reminders under profiles
4. **Denormalization Where Needed** - Store computed values for fast reads
5. **Real-time Ready** - Schema optimized for Firestore real-time listeners

---

## COLLECTION: `users`

**Purpose:** User account data, authentication metadata, preferences, search settings

**Path:** `users/{userId}`

```javascript
{
  // Authentication & Identity
  uid: string,                              // Firebase Auth UID (document ID)
  email: string,                            // User's email
  displayName: string,                      // User's display name
  photoURL: string | null,                  // Profile photo URL
  authProvider: "email" | "google",         // How they signed up

  // Account Status
  createdAt: timestamp,                     // Account creation
  updatedAt: timestamp,                     // Last account update
  lastLoginAt: timestamp,                   // Last login time
  accountStatus: "active" | "suspended" | "deleted",

  // Subscription & Tokens
  subscriptionTier: "free" | "premium" | "enterprise",
  tokenUsage: {
    used: number,                           // Tokens used this period
    remaining: number,                      // Tokens remaining
    lastReset: timestamp,                   // When tokens reset
    resetPeriod: "monthly" | "weekly"       // Reset frequency
  },

  // Profile Management
  profileCount: number,                     // Quick count for UI
  favoriteProfileIds: string[],             // Array of favorite profile IDs
  defaultProfileId: string | null,          // User's primary/default profile

  // Privacy & Discoverability
  visibility: "active" | "invisible" | "off",
  discoverableBy: "everyone" | "friends" | "groups-only",
  privacySettings: {
    showLocation: boolean,
    allowMessaging: boolean,
    showInSearch: boolean,
    shareWithGroups: boolean
  },

  // Current Location (for proximity search)
  currentLocation: {
    coordinates: {
      lat: number,
      lng: number
    },
    city: string,
    state: string,
    country: string,
    lastUpdated: timestamp
  } | null,

  // Search Preferences
  searchPreferences: {
    defaultRadius: number,                  // Default search radius in meters
    regions: string[],                      // Preferred regions
    savedSearches: [{
      name: string,
      criteria: object,
      savedAt: timestamp
    }]
  },

  // Matching Preferences
  lookingFor: {
    relationshipTypes: string[],            // ["romantic-interest", "friend", etc.]
    sharedInterests: string[],              // Required shared interests
    personalityMatch: boolean,              // Use personality matching
    ageRange: {
      min: number,
      max: number
    } | null,
    locationPreference: {
      type: "proximity" | "region" | "anywhere",
      radius: number                        // In meters
    }
  } | null,

  // Group Memberships
  groupIds: string[],                       // Array of group IDs user belongs to

  // App Preferences
  preferences: {
    theme: "light" | "dark" | "cosmic",
    notifications: {
      email: boolean,
      push: boolean,
      messages: boolean,
      reminders: boolean,
      dailyGuidance: boolean
    },
    language: "en" | "es" | "zh",           // i18n support
    timezone: string                         // IANA timezone
  },

  // AI Conversation History (global)
  aiInteractionCount: number,               // Total AI interactions
  lastAiInteraction: timestamp | null
}
```

**Indexes Needed:**
```javascript
// Query users by visibility for discovery
users: [visibility, discoverableBy, lastLoginAt]

// Query users by location for proximity
users: [currentLocation.coordinates] // Geohash index
```

---

## COLLECTION: `profiles`

**Purpose:** Individual astrological profiles (can be user, family, friends, etc.)

**Path:** `profiles/{profileId}`

```javascript
{
  // Ownership & Metadata
  id: string,                               // Document ID
  userId: string,                           // Owner's Firebase Auth UID (INDEXED)
  relationshipType: "self" | "spouse" | "friend" | "coworker" | "family" | "romantic-interest" | "potential-partner",
  isFavorite: boolean,                      // Quick favorite toggle
  tags: string[],                           // Custom tags ["family", "close-friend"]

  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  lastViewedAt: timestamp | null,
  isArchived: boolean,                      // Soft delete

  // Basic Identity
  firstName: string,
  lastName: string,
  displayName: string,                      // Computed: firstName + lastName
  nickname: string | null,                  // Optional nickname
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say",
  pronouns: string | null,                  // "he/him", "she/her", "they/them"

  // Birth Information
  birthDate: string,                        // YYYY-MM-DD format
  birthTime: string | null,                 // HH:mm format (24-hour)
  timezone: string | null,                  // IANA timezone at birth

  // Birth Location - ENHANCED with Google Places
  location: {
    // Google Places Data
    fullAddress: string,                    // From Google Places API
    placeId: string | null,                 // Google Places ID

    // Parsed Components
    city: string,
    state: string | null,                   // State/province
    country: string,
    countryCode: string,                    // ISO 3166-1 alpha-2 (US, CN, etc.)

    // Coordinates
    coordinates: {
      lat: number,
      lng: number
    },

    // Precision & Context
    locationType: "hospital" | "city" | "home" | "region",
    hospitalName: string | null,
    hospitalAddress: string | null,
    precision: "±10m" | "±100m" | "±1km" | "±15km" | "±50km",
    distanceFromCityCenter: {
      meters: number,
      formatted: string                     // "5.2 km from city center"
    } | null
  },

  // Chinese Zodiac - ENHANCED with Year Range
  chineseZodiac: {
    westernYear: number,                    // 2011
    chineseYear: number,                    // 2010 (if before CNY)
    chineseNewYearDate: string,             // "Feb 3, 2011"
    yearRange: string,                      // "Feb 14, 2010 - Feb 2, 2011"
    animal: string,                         // "Tiger"
    element: string,                        // "Metal"
    fullSign: string,                       // "Metal Tiger"
    animalYinYang: "Yin" | "Yang",
    explanation: string                     // "Born before Chinese New Year, belongs to Metal Tiger"
  },

  // Optional Fields
  mbti: string | null,                      // MBTI type (INTJ, ENFP, etc.)
  enneagram: string | null,                 // Enneagram type (1w2, 5w4, etc.)
  bloodType: string | null,                 // A+, B-, O+, etc.

  // Self-Description - AI-ENHANCED
  selfDescription: {
    // User Input
    rawText: string | null,                 // Original user description

    // AI-Refined Output
    refinedText: string | null,             // AI-improved description

    // Extracted Structured Data
    hobbies: string[],                      // ["reading", "hiking", "cooking"]
    sports: string[],                       // ["basketball", "yoga"]
    interests: string[],                    // ["technology", "art", "travel"]
    values: string[],                       // ["honesty", "family", "growth"]

    // Personality Analysis
    personality: {
      socialStyle: "introvert" | "extrovert" | "ambivert" | null,
      energySource: "people" | "solitude" | "balanced" | null,
      communicationStyle: "direct" | "empathetic" | "analytical" | "collaborative" | null
    },

    // AI Metadata
    aiConversationId: string | null,        // Link to AI conversation
    questionsAsked: string[],               // Questions AI asked during refinement
    confidenceScore: number | null,         // AI confidence (0-1)
    userApproved: boolean,                  // Did user approve refinement?
    iterations: number,                     // How many refinement rounds
    lastRefinedAt: timestamp | null
  },

  // Calculated Astrological Data
  calculations: {
    // Age (recalculated on view)
    age: {
      years: number,
      months: number,
      days: number,
      calculatedAt: timestamp
    },

    // Chinese Zodiac
    chinese: {
      animal: string,
      element: string,
      year: number,
      animalYinYang: string,
      fullSign: string
    },

    // Western Zodiac
    western: {
      sign: string,                         // "Taurus"
      element: "Earth" | "Water" | "Fire" | "Air",
      yinYang: "Yin" | "Yang",
      dateRange: string,                    // "Apr 20 - May 20"
      rulingPlanet: string                  // "Venus"
    },

    // Day of Week
    dayOfWeek: {
      day: string,                          // "Tuesday"
      planet: string,                       // "Mars"
      traits: string                        // "Courage, passion, action"
    },

    // Yin/Yang Balance
    yinYang: {
      yinPercentage: number,
      yangPercentage: number,
      yinCount: number,
      yangCount: number,
      factors: string[],                    // Detailed breakdown
      interpretation: string                // Overall balance interpretation
    },

    // Numerology
    numerology: {
      lifePath: {
        number: number,
        meaning: string
      },
      expression: {
        number: number,
        meaning: string
      },
      soulUrge: {
        number: number,
        meaning: string
      },
      personalYear: {
        year: number,
        number: number,
        meaning: string
      }
    }
  },

  // Sharing & QR
  qrCode: string | null,                    // Data URI of QR code
  encryptedToken: string | null,            // For secure sharing
  shareableLink: string | null,             // Public share URL

  // Group Associations
  groups: string[],                         // ["family", "close-friends", "work"]

  // Statistics
  viewCount: number,                        // How many times viewed
  sharedCount: number,                      // How many times shared
  comparisonCount: number                   // How many times compared
}
```

**Indexes Needed:**
```javascript
// Get all profiles for a user, ordered by creation date
profiles: [userId, isArchived, createdAt DESC]

// Get favorites for a user
profiles: [userId, isFavorite, lastViewedAt DESC]

// Get profiles by relationship type
profiles: [userId, relationshipType, createdAt DESC]

// Proximity search by location
profiles: [location.coordinates, userId] // Geohash index

// Search by zodiac sign
profiles: [calculations.western.sign, userId]
profiles: [calculations.chinese.animal, userId]
```

---

## SUBCOLLECTION: `profiles/{profileId}/notes`

**Purpose:** Personal notes about this profile

**Path:** `profiles/{profileId}/notes/{noteId}`

```javascript
{
  id: string,                               // Document ID
  userId: string,                           // Author (for security rules)
  profileId: string,                        // Parent profile ID

  // Note Content
  type: "observation" | "self-reflection" | "memory" | "reminder" | "insight",
  content: string,                          // The actual note
  title: string | null,                     // Optional title

  // Organization
  tags: string[],                           // ["important", "funny", "pattern"]
  isPinned: boolean,                        // Pin to top

  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,

  // Linking
  relatedNoteIds: string[],                 // Link to other notes
  relatedProfileIds: string[]               // Link to other profiles
}
```

**Indexes Needed:**
```javascript
notes: [userId, profileId, createdAt DESC]
notes: [userId, profileId, isPinned, createdAt DESC]
notes: [userId, profileId, type, createdAt DESC]
```

---

## SUBCOLLECTION: `profiles/{profileId}/dailyGuidance`

**Purpose:** Daily astrological guidance and insights

**Path:** `profiles/{profileId}/dailyGuidance/{date}`

```javascript
{
  id: string,                               // Document ID (YYYY-MM-DD)
  profileId: string,                        // Parent profile ID
  date: string,                             // YYYY-MM-DD
  generatedAt: timestamp,

  // Guidance Content
  analysis: {
    overall: string,                        // General outlook
    love: string,                           // Love & relationships
    career: string,                         // Career & work
    health: string,                         // Health & wellness
    finance: string                         // Financial outlook
  },

  // Actionable Guidance
  guidance: {
    doList: string[],                       // Things to do today
    avoidList: string[],                    // Things to avoid
    opportunities: string[],                // Opportunities to watch for
    challenges: string[]                    // Potential challenges
  },

  // Lucky Elements
  luckyColors: string[],                    // ["gold", "blue"]
  luckyNumbers: number[],                   // [3, 7, 21]
  luckyDirection: string,                   // "North"
  luckyHours: string[],                     // ["9-11 AM", "7-9 PM"]

  // AI Metadata
  aiModel: string,                          // "claude-3-5-sonnet"
  aiConversationId: string | null,

  // User Interaction
  wasRead: boolean,
  userRating: number | null,                // 1-5 stars
  userFeedback: string | null
}
```

**Indexes Needed:**
```javascript
dailyGuidance: [profileId, date DESC]
dailyGuidance: [profileId, wasRead, date DESC]
```

---

## SUBCOLLECTION: `profiles/{profileId}/aiConversations`

**Purpose:** Store AI conversation history for personality refinement

**Path:** `profiles/{profileId}/aiConversations/{conversationId}`

```javascript
{
  id: string,                               // Document ID
  profileId: string,                        // Parent profile ID
  userId: string,                           // Conversation owner

  // Conversation Metadata
  purpose: "profile-refinement" | "daily-guidance" | "compatibility-analysis" | "question-answer",
  startedAt: timestamp,
  endedAt: timestamp | null,
  status: "in-progress" | "completed" | "abandoned",

  // Messages
  messages: [{
    id: string,
    role: "user" | "assistant",
    content: string,
    timestamp: timestamp,
    metadata: {
      model: string,                        // "claude-3-5-sonnet"
      tokens: number,
      confidence: number | null
    }
  }],

  // Results (for refinement conversations)
  results: {
    extractedData: object,                  // Structured data extracted
    confidence: number,
    needsReview: boolean
  } | null,

  // Usage Tracking
  totalTokens: number,
  totalMessages: number
}
```

**Indexes Needed:**
```javascript
aiConversations: [userId, profileId, startedAt DESC]
aiConversations: [userId, purpose, status, startedAt DESC]
```

---

## SUBCOLLECTION: `profiles/{profileId}/reminders`

**Purpose:** Reminders to keep in touch or take action

**Path:** `profiles/{profileId}/reminders/{reminderId}`

```javascript
{
  id: string,                               // Document ID
  profileId: string,                        // Profile to remind about
  userId: string,                           // Owner of reminder

  // Reminder Details
  type: "keep-in-touch" | "birthday" | "anniversary" | "check-in" | "custom",
  title: string,                            // "Check in with Mom"
  description: string | null,

  // Scheduling
  frequency: "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom",
  customInterval: number | null,            // Days between reminders

  // Timing
  nextReminderAt: timestamp,
  lastReminderAt: timestamp | null,
  lastContactAt: timestamp | null,          // When user last contacted

  // Action
  action: "message" | "call" | "visit" | "email" | "custom",
  actionDetails: string | null,

  // Status
  isActive: boolean,
  isPaused: boolean,
  pausedUntil: timestamp | null,

  // History
  completionHistory: [{
    completedAt: timestamp,
    action: string,
    notes: string | null
  }],

  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes Needed:**
```javascript
reminders: [userId, profileId, isActive, nextReminderAt ASC]
reminders: [userId, type, isActive, nextReminderAt ASC]
```

---

## COLLECTION: `groups`

**Purpose:** User-created groups for organizing profiles

**Path:** `groups/{groupId}`

```javascript
{
  id: string,                               // Document ID
  userId: string,                           // Group owner

  // Group Details
  name: string,                             // "Family", "Work Team", "Close Friends"
  description: string | null,
  icon: string | null,                      // Emoji or icon name
  color: string | null,                     // Hex color for UI

  // Members
  memberProfileIds: string[],               // Array of profile IDs in group
  memberCount: number,                      // Quick count

  // Settings
  isPrivate: boolean,
  allowSharing: boolean,

  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  lastAccessedAt: timestamp | null,

  // Statistics
  viewCount: number
}
```

**Indexes Needed:**
```javascript
groups: [userId, createdAt DESC]
groups: [userId, lastAccessedAt DESC]
```

---

## COLLECTION: `messages`

**Purpose:** Direct messages between users

**Path:** `messages/{messageId}`

```javascript
{
  id: string,                               // Document ID

  // Participants
  fromUserId: string,                       // Sender
  toUserId: string,                         // Recipient

  // Content
  content: string,                          // Message text
  type: "text" | "profile-share" | "comparison-request" | "system",

  // Attachments (for profile shares)
  attachedProfileId: string | null,
  attachedData: object | null,

  // Status
  read: boolean,
  readAt: timestamp | null,
  delivered: boolean,
  deliveredAt: timestamp | null,

  // Timestamps
  sentAt: timestamp,

  // Threading
  threadId: string | null,                  // Group messages together
  replyToMessageId: string | null,

  // Moderation
  isDeleted: boolean,
  deletedAt: timestamp | null,
  reportedBy: string[] | null
}
```

**Indexes Needed:**
```javascript
// Get all messages for a user
messages: [toUserId, sentAt DESC]
messages: [fromUserId, sentAt DESC]

// Get unread messages
messages: [toUserId, read, sentAt DESC]

// Get conversation thread
messages: [threadId, sentAt ASC]
```

---

## COLLECTION: `comparisons`

**Purpose:** Store profile comparison history

**Path:** `comparisons/{comparisonId}`

```javascript
{
  id: string,                               // Document ID
  userId: string,                           // User who made comparison

  // Profiles Being Compared
  profileIds: string[],                     // [profileId1, profileId2]
  profileNames: string[],                   // For quick display

  // Comparison Type
  type: "compatibility" | "decision-help" | "curiosity",
  context: string | null,                   // Why comparing

  // Results
  compatibilityScore: number | null,        // 0-100
  analysis: {
    strengths: string[],                    // Shared strengths
    challenges: string[],                   // Potential challenges
    zodiacMatch: string,                    // "Very compatible"
    personalityMatch: string,               // "Complementary"
    recommendation: string                  // AI recommendation
  },

  // AI Metadata
  aiConversationId: string | null,

  // User Action
  decision: "choose-profile-1" | "choose-profile-2" | "neither" | "pending",
  notes: string | null,

  // Timestamps
  createdAt: timestamp,
  lastViewedAt: timestamp | null
}
```

**Indexes Needed:**
```javascript
comparisons: [userId, createdAt DESC]
comparisons: [userId, type, createdAt DESC]
```

---

## COLLECTION: `sharedProfiles`

**Purpose:** Publicly shared profiles via encrypted tokens

**Path:** `sharedProfiles/{shareId}`

```javascript
{
  id: string,                               // Document ID (random ID)
  profileId: string,                        // Original profile ID
  userId: string,                           // Profile owner

  // Sharing Settings
  encryptedToken: string,                   // Secure token
  expiresAt: timestamp | null,              // Optional expiration
  maxViews: number | null,                  // Optional view limit
  viewCount: number,                        // Current view count

  // Privacy
  includesFullData: boolean,                // Full profile or limited view
  hiddenFields: string[],                   // Fields to hide

  // Access Control
  allowedUserIds: string[] | null,          // Null = public
  requiresAuth: boolean,

  // Metadata
  createdAt: timestamp,
  lastViewedAt: timestamp | null,
  isActive: boolean
}
```

**Indexes Needed:**
```javascript
sharedProfiles: [userId, createdAt DESC]
sharedProfiles: [encryptedToken, isActive]
```

---

## COMPOSITE INDEXES SUMMARY

**Critical Indexes for Performance:**

```javascript
// User discovery
users: [visibility, discoverableBy, lastLoginAt DESC]

// Profile queries
profiles: [userId, isArchived, createdAt DESC]
profiles: [userId, isFavorite, lastViewedAt DESC]
profiles: [userId, relationshipType, createdAt DESC]

// Messaging
messages: [toUserId, read, sentAt DESC]
messages: [fromUserId, sentAt DESC]
messages: [threadId, sentAt ASC]

// Notes
notes: [userId, profileId, createdAt DESC]
notes: [userId, profileId, type, createdAt DESC]

// Reminders
reminders: [userId, isActive, nextReminderAt ASC]

// Groups
groups: [userId, lastAccessedAt DESC]

// Comparisons
comparisons: [userId, createdAt DESC]

// Geospatial (requires special setup)
users: [currentLocation.coordinates] // GeoHash
profiles: [location.coordinates] // GeoHash
```

---

## DATA SIZE ESTIMATES

**Per Profile (Full):**
- Basic data: ~2 KB
- Calculations: ~3 KB
- Self-description: ~2 KB
- Location data: ~1 KB
- **Total:** ~8 KB per profile

**Per User:**
- Account data: ~2 KB
- Preferences: ~1 KB
- **Total:** ~3 KB per user

**Storage Estimates:**
- 1,000 users with 5 profiles each: ~43 MB
- 10,000 users with 5 profiles each: ~430 MB
- 100,000 users with 5 profiles each: ~4.3 GB

**Well within Firebase limits and affordable at scale.**

---

## SECURITY CONSIDERATIONS

1. **User Data Isolation:**
   - All queries MUST filter by userId
   - Security rules enforce ownership
   - No cross-user data access

2. **Profile Privacy:**
   - Visibility settings control discoverability
   - Shared profiles use encrypted tokens
   - Sensitive fields can be hidden

3. **Messaging:**
   - Only sender and recipient can read
   - No message forwarding without permission
   - Report/block functionality

4. **AI Conversations:**
   - Stored securely with user context
   - Can be deleted by user
   - Not used for training

5. **Location Data:**
   - Approximate locations for privacy
   - User controls location sharing
   - Encrypted in transit

---

## MIGRATION CONSIDERATIONS

**From localStorage (Legacy):**
1. Detect localStorage profiles on login
2. Show migration banner
3. Parse legacy format to new schema
4. Create Firestore documents
5. Backup and clear localStorage

**Future Schema Updates:**
- Use versioning in documents
- Gradual migration with background jobs
- Maintain backwards compatibility
- Test thoroughly before deployment

---

## FUTURE ENHANCEMENTS

**Phase 2 Features:**
- Voice notes as audio files in Cloud Storage
- Photo/avatar storage
- PDF report generation
- Calendar integration for reminders
- Push notifications

**Phase 3 Features:**
- Video calls integration
- Community forums
- Premium features (in-depth analysis)
- Affiliate matching (professional astrologers)
- API access for third-party integrations

---

## IMPLEMENTATION PRIORITY

**Phase 1 (MVP):**
1. ✅ Users collection
2. ✅ Profiles collection (basic fields)
3. ✅ Basic calculations
4. ✅ Security rules

**Phase 2 (Core Features):**
1. Enhanced profile fields (location, self-description)
2. Notes subcollection
3. Groups collection
4. Basic search

**Phase 3 (Social Features):**
1. Messages collection
2. Reminders subcollection
3. Daily guidance subcollection
4. Profile sharing

**Phase 4 (AI & Matching):**
1. AI conversations subcollection
2. Compatibility matching
3. Comparisons collection
4. Advanced search with filters

**Phase 5 (Advanced):**
1. Proximity search with geohashing
2. Real-time notifications
3. Token management
4. Analytics dashboard

---

## TESTING STRATEGY

**Unit Tests:**
- Calculation functions (pure)
- Data validation
- Schema migration

**Integration Tests:**
- Firestore security rules
- CRUD operations
- Real-time listeners

**End-to-End Tests:**
- User flows (signup → create profile → view → share)
- Messaging flows
- Search and filtering

**Performance Tests:**
- Query performance with 10K+ profiles
- Real-time listener load
- Concurrent user simulation

---

## CONCLUSION

This schema is designed to scale from:
- **Individual users** managing personal profiles
- **Small groups** organizing family/friends
- **Communities** discovering and connecting
- **Enterprise** features (matching, AI, analytics)

Built on Firebase for:
- ✅ Real-time updates
- ✅ Offline support
- ✅ Scalable infrastructure
- ✅ Built-in security
- ✅ Cost-effective at scale

**This is the foundation for GENESIS.**
