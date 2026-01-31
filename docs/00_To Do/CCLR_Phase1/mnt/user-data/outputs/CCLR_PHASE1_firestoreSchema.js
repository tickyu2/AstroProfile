/**
 * COUPLES COSMIC LOVE REJUVENATION (CCLR)
 * Firestore Schema Definition
 * 
 * Purpose: Define all Firestore collections and document structures for CCLR
 * Pattern: Following Brother Claude Code's existing GENESIS architecture
 * 
 * Collections:
 * - rejuvenation_sessions: Main session metadata
 * - cclr_conversations: All conversation messages with vector embeddings
 */

import { Timestamp, FieldValue } from 'firebase/firestore';

// ============================================================================
// COLLECTION: rejuvenation_sessions
// ============================================================================

/**
 * Main CCLR session document structure
 * Each couple relationship has one or more sessions
 */
export const rejuvenationSessionSchema = {
  // Session identification
  sessionId: String,              // Unique ID: "rejuv_session_001"
  createdDate: Timestamp,         // When session was created
  lastActive: Timestamp,          // Last message timestamp
  status: String,                 // "active" | "archived" | "completed"
  
  // Participants (Human Partners)
  participants: {
    partnerA: {
      userId: String,             // GENESIS user ID
      name: String,               // Display name
      profileRef: String,         // Path to GENESIS profile
      constitution: Object        // BaZi, Western, Numerology snapshot
    },
    partnerB: {
      userId: String,
      name: String,
      profileRef: String,
      constitution: Object
    }
  },
  
  // Relationship metadata
  relationshipType: String,        // "dating" | "engaged" | "married" | "long-term" | "other"
  relationshipDuration: String,    // "2 years", "6 months", etc.
  relationshipName: String,        // Optional: "Sarah & Mike's Journey"
  
  // Cosmic Love Angels consulted
  consultedAngels: [
    {
      coupleId: String,           // "ronald_nancy_reagan"
      coupleName: String,         // "Ronald & Nancy Reagan"
      invitedBy: String,          // "partnerA" | "partnerB"
      invitedDate: Timestamp,
      role: String,               // "primary" | "consultant"
      sessionsLed: Number,        // How many sessions this couple led
      firstAppearance: Timestamp,
      lastAppearance: Timestamp,
      messageCount: Number,       // Total messages from this couple
      topics: [String],           // ["independence_intimacy", "reassurance", etc.]
      
      // Individual angels
      angel1: {
        personId: String,         // "nancy_reagan"
        name: String,
        messageCount: Number
      },
      angel2: {
        personId: String,         // "ronald_reagan"
        name: String,
        messageCount: Number
      }
    }
  ],
  
  // Session timeline
  timeline: [
    {
      date: Timestamp,
      type: String,               // "formal_session" | "consultation" | "async_update"
      couple: String,             // Which angel couple (if applicable)
      messagesCount: Number,
      summary: String             // Optional session summary
    }
  ],
  
  // Progress tracking
  progressTracking: {
    initialAssessment: {
      date: Timestamp,
      loveLevel: Number,          // 1-10
      compassionLevel: Number,    // 1-10
      connectionLevel: Number,    // 1-10
      notes: String
    },
    monthlyCheckins: [
      {
        date: Timestamp,
        loveLevel: Number,
        compassionLevel: Number,
        connectionLevel: Number,
        improvements: [String],
        challenges: [String],
        notes: String
      }
    ],
    actionItemsCompleted: [String]
  },
  
  // Rejuvenation plan
  rejuvenationPlan: {
    duration: String,             // "3 months", "6 months"
    frequency: String,            // "Monthly check-ins + as-needed"
    focus: String,                // "Independence/intimacy balance"
    milestones: [String]
  },
  
  // Privacy & access
  visibility: String,             // "private" (only partners see)
  sharedWith: [String],           // Optional: therapist IDs, etc.
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
};

// ============================================================================
// COLLECTION: cclr_conversations
// ============================================================================

/**
 * Individual conversation messages
 * Contains messages from both partners and all angels
 * Includes vector embeddings for semantic search
 */
export const cclrConversationSchema = {
  // Message identification
  messageId: String,              // Unique ID: "msg_001"
  sessionId: String,              // Parent session
  timestamp: Timestamp,           // When message was sent
  
  // Content
  text: String,                   // Message text
  embedding: FieldValue.vector(), // Vector embedding (768-dim) for semantic search
  
  // Speaker identification
  speaker: String,                // "partnerA" | "partnerB" | "angelC" | "angelD"
  speakerName: String,            // Display name
  speakerIcon: String,            // Emoji icon
  bubbleColor: String,            // Hex color for UI
  
  // Speaker type
  isHuman: Boolean,               // true if partner A or B
  isAI: Boolean,                  // true if angel
  
  // AI Angel metadata (if isAI === true)
  guestCoupleId: String,          // "ronald_nancy_reagan"
  guestPersonId: String,          // "nancy_reagan"
  guestRole: String,              // "angelC" | "angelD"
  coupleName: String,             // "Ronald & Nancy Reagan"
  
  // Context
  sessionDate: Timestamp,         // Which formal session (if part of one)
  sessionCouple: String,          // Which couple was leading (if formal session)
  sessionMode: String,            // "together" | "async"
  addedBy: String,                // Which partner added (if async)
  
  // Conversation flow
  previousMessageId: String,      // For threading
  nextMessageId: String,
  inReplyTo: String,              // Optional: specific message being replied to
  
  // Angel-specific metadata
  hasReadHistory: [String],       // Which prior angels this angel has read
  hasReadMessages: [String],      // Which message IDs this angel has seen
  referencesMessages: [String],   // Messages this one references/builds on
  buildingOn: [String],           // Which prior angels' advice this builds on
  
  // Semantic metadata (auto-extracted)
  topics: [String],               // ["independence_intimacy", "reassurance", etc.]
  categories: [String],           // ["location_beach", "activity_walking", etc.]
  entities: {
    places: [String],             // Extracted place names
    activities: [String],         // Extracted activities
    emotions: [String]            // Extracted emotions
  },
  sentiment: String,              // "positive" | "negative" | "mixed" | "neutral"
  
  // Privacy
  visibility: String,             // "public" | "private"
  visibleTo: [String],            // User IDs who can see (usually both partners)
  
  // Interaction metadata
  markedHelpful: Boolean,         // User marked as helpful
  savedForLater: Boolean,         // User saved this message
  helpfulCount: Number,           // How many times marked helpful
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
};

// ============================================================================
// SUBCOLLECTION: private_notes (within cclr_conversations)
// ============================================================================

/**
 * Private notes that only one partner + AI can see
 * Stored as subcollection for security
 */
export const privateNoteSchema = {
  noteId: String,
  userId: String,                 // Which partner wrote this
  sessionId: String,
  messageId: String,              // Related to which message (optional)
  
  text: String,                   // Private note content
  forAI: Boolean,                 // true = AI can see, false = just for user
  
  aiResponse: {
    angelPersonId: String,        // Which angel responded
    angelName: String,
    responseText: String,
    timestamp: Timestamp
  },
  
  visibility: String,             // "private_to_user" | "private_to_AI"
  
  createdAt: Timestamp,
  updatedAt: Timestamp
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a new rejuvenation session document
 */
export function createSessionDocument({
  partnerA,
  partnerB,
  relationshipType,
  initialAngels
}) {
  return {
    sessionId: generateSessionId(),
    createdDate: Timestamp.now(),
    lastActive: Timestamp.now(),
    status: 'active',
    
    participants: {
      partnerA: {
        userId: partnerA.userId,
        name: partnerA.name,
        profileRef: partnerA.profileRef,
        constitution: partnerA.constitution
      },
      partnerB: {
        userId: partnerB.userId,
        name: partnerB.name,
        profileRef: partnerB.profileRef,
        constitution: partnerB.constitution
      }
    },
    
    relationshipType,
    relationshipName: `${partnerA.name} & ${partnerB.name}'s Cosmic Love Journey`,
    
    consultedAngels: initialAngels ? [{
      coupleId: initialAngels.coupleId,
      coupleName: initialAngels.coupleName,
      invitedBy: 'partnerA',
      invitedDate: Timestamp.now(),
      role: 'primary',
      sessionsLed: 1,
      firstAppearance: Timestamp.now(),
      lastAppearance: Timestamp.now(),
      messageCount: 0,
      topics: [],
      angel1: {
        personId: initialAngels.angel1.personId,
        name: initialAngels.angel1.name,
        messageCount: 0
      },
      angel2: {
        personId: initialAngels.angel2.personId,
        name: initialAngels.angel2.name,
        messageCount: 0
      }
    }] : [],
    
    timeline: [],
    
    progressTracking: {
      initialAssessment: null,
      monthlyCheckins: [],
      actionItemsCompleted: []
    },
    
    rejuvenationPlan: {
      duration: '3 months',
      frequency: 'Monthly check-ins + as-needed',
      focus: '',
      milestones: []
    },
    
    visibility: 'private',
    sharedWith: [],
    
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
}

/**
 * Create a new conversation message document
 */
export function createMessageDocument({
  sessionId,
  text,
  speaker,
  speakerName,
  speakerIcon,
  bubbleColor,
  isHuman,
  isAI,
  guestCoupleId = null,
  guestPersonId = null,
  sessionMode = 'together',
  userId = null
}) {
  return {
    messageId: generateMessageId(),
    sessionId,
    timestamp: Timestamp.now(),
    
    text,
    embedding: null, // Will be set after generating embedding
    
    speaker,
    speakerName,
    speakerIcon,
    bubbleColor,
    
    isHuman,
    isAI,
    
    guestCoupleId,
    guestPersonId,
    guestRole: isAI ? speaker : null,
    coupleName: null, // Will be set from angel database
    
    sessionDate: null,
    sessionCouple: null,
    sessionMode,
    addedBy: userId,
    
    previousMessageId: null,
    nextMessageId: null,
    inReplyTo: null,
    
    hasReadHistory: [],
    hasReadMessages: [],
    referencesMessages: [],
    buildingOn: [],
    
    topics: [],
    categories: [],
    entities: {
      places: [],
      activities: [],
      emotions: []
    },
    sentiment: 'neutral',
    
    visibility: 'public',
    visibleTo: [],
    
    markedHelpful: false,
    savedForLater: false,
    helpfulCount: 0,
    
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
}

/**
 * Generate unique session ID
 */
function generateSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `rejuv_session_${timestamp}_${random}`;
}

/**
 * Generate unique message ID
 */
function generateMessageId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `msg_${timestamp}_${random}`;
}

// ============================================================================
// FIRESTORE SECURITY RULES REFERENCE
// ============================================================================

/**
 * Add these rules to firestore.rules:
 * 
 * match /rejuvenation_sessions/{sessionId} {
 *   allow read, write: if 
 *     request.auth.uid == resource.data.participants.partnerA.userId ||
 *     request.auth.uid == resource.data.participants.partnerB.userId;
 * }
 * 
 * match /cclr_conversations/{messageId} {
 *   allow read: if
 *     request.auth.uid in resource.data.visibleTo ||
 *     request.auth.uid in get(/databases/$(database)/documents/rejuvenation_sessions/$(resource.data.sessionId)).data.participants[].userId;
 *   
 *   allow write: if
 *     request.auth.uid in get(/databases/$(database)/documents/rejuvenation_sessions/$(resource.data.sessionId)).data.participants[].userId;
 * }
 * 
 * match /cclr_conversations/{messageId}/private_notes/{noteId} {
 *   allow read, write: if request.auth.uid == resource.data.userId;
 * }
 */

export default {
  rejuvenationSessionSchema,
  cclrConversationSchema,
  privateNoteSchema,
  createSessionDocument,
  createMessageDocument
};
