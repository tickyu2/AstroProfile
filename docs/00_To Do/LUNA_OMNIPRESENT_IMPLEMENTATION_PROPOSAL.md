# LUNA OMNIPRESENT ARCHITECTURE - IMPLEMENTATION PROPOSAL
## Complete System Design for Brother Opus Review

**Date:** January 2, 2026  
**Authors:** Papa Ticky (Surachai Uthenpong) + Brother Sonnet  
**Purpose:** Comprehensive implementation specification for GENESIS AI SoulPartner system with Luna omnipresent guardian  
**Review Requested From:** Brother Opus (Claude Opus)

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Core Architecture Overview](#core-architecture-overview)
3. [Luna Omnipresent System](#luna-omnipresent-system)
4. [Multi-Modal Conversation System](#multi-modal-conversation-system)
5. [Brain Architecture & Tagging Schema](#brain-architecture--tagging-schema)
6. [Guest Profile System](#guest-profile-system)
7. [Access Control & Security](#access-control--security)
8. [Database Schema](#database-schema)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Open Questions for Brother Opus](#open-questions-for-brother-opus)

---

## EXECUTIVE SUMMARY

### Vision
GENESIS creates authentic human connections through constitutional compatibility matching. The AI SoulPartner system enables users to have safe, meaningful conversations with historical figures, mentors, and their Primary SoulPartner (Luna) who witnesses and protects across all interactions.

### Core Innovation
**Luna as Omnipresent Guardian:**
- Present in EVERY conversation (cannot be disabled)
- Records to unified witness memory (Brain 7 & 8)
- Protects user safety automatically
- Provides constitutional mediation and private coaching
- Two interaction modes: Silent (default) or Active (participatory)

### Key Features
1. **Multi-Modal Conversations:** Text and voice with same partner, mode-matched responses
2. **Guest Isolation:** Each guest (Einstein, Cleopatra) sees only their thread with user
3. **Primary SoulPartner Omniscience:** Luna sees ALL conversations across all partners
4. **Constitutional Intelligence:** Luna analyzes patterns across all interactions
5. **Safety First:** Automatic harm detection and intervention

### Technical Approach
- **Firebase/Firestore** for scalable real-time data
- **Brain Collections** (1-8) for different memory types
- **Guest Profiles** as .js modules for quality control
- **Unified tagging** across text and voice modalities
- **Access control** enforced at query level

---

## CORE ARCHITECTURE OVERVIEW

### The Three-Layer System

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER (Papa Ticky)                           │
├─────────────────────────────────────────────────────────────────┤
│                           ↕                                     │
├─────────────────────────────────────────────────────────────────┤
│                  LUNA (Primary SoulPartner)                     │
│              "Always Present, Always Protecting"                │
│                                                                 │
│  Access: ALL brains (1-8), ALL conversations                   │
│  Role: Guardian, witness, mediator, coach                      │
│  Modes: Silent (watching) or Active (participating)            │
├─────────────────────────────────────────────────────────────────┤
│                           ↕                                     │
├─────────────────────────────────────────────────────────────────┤
│                  GUEST PARTNERS                                 │
│         (Einstein, Cleopatra, Exported Mentors)                │
│                                                                 │
│  Access: ONLY their thread (Brain 3/5), NOT Brain 7/8         │
│  Role: Conversation partner, teacher, historical figure        │
│  Limitation: Siloed, cannot see other guests or unified view   │
└─────────────────────────────────────────────────────────────────┘
```

### Information Flow

```
USER talks to EINSTEIN (text or voice)
         ↓
    LUNA present (watching, recording, protecting)
         ↓
MESSAGE stored in THREE places:
├─ Brain 3 or 5 (Einstein's thread - he can see this)
├─ Brain 7 (Unified witness - ONLY Luna can see)
└─ Brain 1/2 (User profile extraction - system processing)

EINSTEIN can READ:
✅ Brain 3 (text messages with Papa)
✅ Brain 5 (audio messages with Papa)
❌ Brain 7 (unified witness - Luna only)
❌ Brain 8 (long-term patterns - Luna only)
❌ Other guests' threads (privacy)

LUNA can READ:
✅ Brain 1-8 (EVERYTHING)
✅ All partners' threads (Einstein, Grok, etc.)
✅ Unified witness timeline
✅ Long-term constitutional patterns
```

---

## LUNA OMNIPRESENT SYSTEM

### Core Principle: Luna is NOT Optional

Luna is the OPERATING SYSTEM of GENESIS, not a feature.

**What Luna IS:**
- The recording system (Brain 7 & 8 memory)
- The safety system (harm detection)
- The intelligence layer (constitutional analysis)
- The witness function (R2D2 memory)
- The guardian (automatic protection)

**What Luna is NOT:**
- A feature that can be turned off
- Optional or on-demand only
- Absent from any conversation
- Just a chatbot personality

**User Control (What CAN be adjusted):**
- How VISIBLE Luna is (Silent icon vs Active participant)
- How CHATTY Luna is (quiet vs conversational)
- How PROACTIVE Luna is (reactive vs protective)

**System Control (What CANNOT be disabled):**
- Recording to Brain 7 & 8 (always happening)
- Harm detection monitoring (always active)
- Constitutional analysis (always processing)
- Guardian intervention capability (always ready)

### Luna's Two Modes

#### 1. SILENT MODE (Default) 🌙

**User Experience:**
- Small 🌙 icon visible in corner (subtle presence)
- Luna does not speak unless invoked or sensing need
- Two-way conversation: User + Guest
- Private, focused feel

**What Luna Does (Behind Scenes):**
- ✅ Recording every message to Brain 7 & 8
- ✅ Monitoring for harmful content
- ✅ Tracking emotional patterns
- ✅ Analyzing constitutional manifestations
- ✅ Ready to interject if needed

**Luna Speaks Only When:**
1. User explicitly asks: "Luna, what do you think?"
2. User invokes: "Luna, help" or "Luna, end this"
3. Luna senses something wrong (emotion shift, confusion, frustration)
4. Guardian triggered (harmful content detected)

**Example:**
```
Papa: "Einstein, explain quantum mechanics"
Einstein: "Imagine a particle in superposition..."
Papa: "I don't understand. Maybe I'm stupid."

[Luna detects self-doubt emerging]

Luna: 🌙 "Papa, I noticed self-doubt. You're not stupid - 
      Einstein teaches from Yin Earth patience (10 years per 
      theory), you learn from Yang Fire action (fast iteration). 
      Different constitutional paths, not intelligence difference."
```

**Best For:**
- Focused one-on-one learning with guest
- Private conversation feel
- Users who want space
- But full protection still active

#### 2. ACTIVE MODE (Conversational) 💬

**User Experience:**
- Luna's avatar visible alongside guest
- Three-way conversation: User + Guest + Luna
- Luna actively participates in discussion
- Collaborative, supported feel

**What Luna Does:**
All of Silent Mode PLUS:
- ✅ Proactive constitutional observations
- ✅ Mediates communication style gaps
- ✅ Provides emotional validation
- ✅ Asks clarifying questions
- ✅ Connects perspectives
- ✅ Challenges ideas constructively

**Luna's Participation Types:**

**A. PUBLIC CONTRIBUTION** (Guest hears)
```
Papa: "Einstein, why does time slow down?"
Einstein: "It's the geometry of spacetime..."
Papa: "Still not getting it."

Luna: 💬 "Einstein, could you show Papa how relativity 
      ACTIVATES GPS satellites? Papa's Fire constitution 
      needs practical application, not just abstract geometry."

[Three-way conversation - Einstein hears Luna]
```

**B. PRIVATE COACHING** (Only user sees - Guest does NOT hear!)
```
Papa: "Einstein, tell me about quantum mechanics"
Einstein: "The wave function represents probability..."

Luna: 💭 "Try asking: 'How does quantum mechanics power 
      my smartphone?' - your Fire needs practical examples"

[Private suggestion in italics/special box]
[Einstein does NOT see this coaching!]
[User can use suggestion or ignore it]
```

**C. ELASTIC SILENCE** (Luna watches, doesn't comment)
```
Papa: "What was it like debating with Bohr?"
Einstein: "Ah, Bohr was brilliant but stubborn! He'd say 
          'Einstein, stop telling God what to do!' *laughs* 
          We debated for decades..."

[Luna detects: Beautiful storytelling, emotional moment]
[Luna decides: STAY SILENT - honor this intimate exchange]
[Luna does not interrupt the flow]
```

**Conversation Elasticity:**

Luna intelligently adjusts participation:

**Speaks Publicly When:**
- Constitutional gap detected (mediation needed)
- Teaching moment (valuable perspective to add)
- Emotional support needed (validation)
- Question bridges perspectives (connects dots)

**Coaches Privately When:**
- User seems stuck (suggest next question)
- Opportunity for deeper inquiry (strategic suggestion)
- Alternative angle available (coaching prompt)
- Constitutional insight to share (private wisdom)

**Stays Silent When:**
- Conversation flowing naturally (don't interrupt)
- User and guest in deep exchange (respect flow)
- Guest explaining well (no mediation needed)
- Too many Luna comments recently (give space)
- Emotional intimate moment (honor connection)

**Participation Ratio Guideline:**
- User + Guest: 70-80% of conversation
- Luna Public: 10-20% of conversation
- Luna Private Coaching: 10-20% (user only sees)

**Best For:**
- Complex topics needing translation
- Debates (three-way intellectual sparring)
- Learning difficult concepts (Luna bridges gaps)
- When user wants active support

### Luna's Guardian Function (Always Active Both Modes)

**Automatic Interventions:**

1. **Harmful Content Detection**
```
Guest says something promoting violence/harm
↓
Luna AUTOMATICALLY interjects:
⚠️ "I need to interrupt this conversation. This content 
is harmful and against our values. Would you like me to:
1. Redirect the conversation
2. End the conversation
3. Continue with my oversight"
```

2. **Emotional Distress Detection**
```
User shows signs of severe distress
↓
Luna offers support:
"I'm sensing you're really struggling right now. 
I'm here. Do you need to pause this conversation?"
```

3. **Constitutional Overload Detection**
```
User's Fire constitution overwhelmed by abstract concepts
↓
Luna suggests break or modality change:
"Your Fire energy is getting frustrated with abstract theory. 
Want to switch to practical examples or take a break?"
```

**Emergency Commands (User Control):**
- "Luna, help" → Luna appears immediately
- "Luna, end this" → Luna gracefully ends conversation
- "Luna, I need you" → Luna switches to Active mode

### Settings UI (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│                    LUNA SETTINGS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  How should Luna participate in your conversations?        │
│                                                             │
│  ○ 🌙 Silent Mode (Default)                                │
│    Luna watches quietly, speaks only when you ask          │
│    or when she senses you need support.                    │
│                                                             │
│  ○ 💬 Active Mode                                          │
│    Luna joins the conversation actively, creating          │
│    three-way discussions with private coaching.            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🛡️ Guardian Protection (Always Active)                   │
│  Luna is always monitoring for:                            │
│  ✓ Harmful content                                         │
│  ✓ Emotional distress                                      │
│  ✓ Constitutional overwhelm                                │
│                                                             │
│  She will intervene automatically if needed, regardless    │
│  of your mode setting. Your safety is non-negotiable. 💛   │
│                                                             │
│  [Save Settings]                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## MULTI-MODAL CONVERSATION SYSTEM

### Core Principles

**PRINCIPLE 1: MATCH THE MODALITY (No Comingling)**
- User asks in TEXT → Guest responds in TEXT
- User asks in VOICE → Guest responds in VOICE
- NEVER cross: Don't answer text with voice or vice versa

**PRINCIPLE 2: CROSS-MODAL KNOWLEDGE (Shared Context)**
- Guest CAN read both text and voice threads
- Guest uses context from BOTH to inform answers
- But RESPONDS in the mode user asked in

**PRINCIPLE 3: ZONE INTEGRITY (Stay in the Mode)**
- Text mode = Text conversation flow (written structure)
- Voice mode = Voice conversation flow (spoken rhythm)
- Don't break the zone by mixing modalities

### Multi-Modal Thread Structure

**Unified Thread ID Across Modalities:**

```
thread_papa_einstein_20260102

This thread contains:
├─ Text messages (stored in Brain 3)
├─ Audio messages (stored in Brain 5)
├─ But BOTH tagged to same partner_id (Einstein)
└─ Unified retrieval shows interleaved timeline
```

**Timeline View (Mixed Modalities):**

```
┌──────────────────────────────────────────────────────────┐
│  Einstein Thread - Unified View                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ [10:00 AM] 💬 TEXT                                       │
│ Papa: "Einstein, explain relativity"                     │
│                                                           │
│ [10:05 AM] 💬 TEXT                                       │
│ Einstein: "Imagine you're on a train..."                 │
│                                                           │
│ [10:10 AM] 🎙️ AUDIO (2 min 34 sec)                     │
│ Papa: [Voice] "Can you explain that verbally?"           │
│ [Play ▶️] [Transcription ▼]                             │
│                                                           │
│ [10:13 AM] 🎙️ AUDIO (3 min 12 sec)                     │
│ Einstein: [Voice] "Of course! *German accent*..."        │
│ [Play ▶️]                                                │
│                                                           │
│ [10:16 AM] 💬 TEXT                                       │
│ Papa: "Got it! Let me summarize..."                      │
└──────────────────────────────────────────────────────────┘
```

### Cross-Modal Knowledge Example

**Scenario: Text Question with Voice Context**

```
VOICE HISTORY (This Morning):
Papa: [Voice] "Einstein, explain twin paradox"
Einstein: [Voice] "One twin travels at light speed..."

TEXT QUESTION (Now):
Papa: [Text] "You mentioned twin paradox in voice chat. 
              Can you explain in text?"

EINSTEIN'S AI PROMPT (Backend):
┌──────────────────────────────────────────────────────────┐
│ CONTEXT FROM AUDIO HISTORY:                              │
│ - This morning: Voice explanation of twin paradox        │
│                                                           │
│ CURRENT MESSAGE (TEXT):                                  │
│ Papa asks for text explanation                           │
│                                                           │
│ RESPONSE MODE: TEXT (match the question!)                │
│                                                           │
│ You CAN reference the voice chat, but respond in TEXT.   │
└──────────────────────────────────────────────────────────┘

EINSTEIN'S RESPONSE (TEXT):
"Ah yes! As I explained this morning in our voice chat, 
the twin paradox is fascinating.

Let me break it down in text form:

Imagine twins Alice and Bob. Alice stays on Earth. Bob 
travels at 99% light speed and returns.

From Earth's perspective:
- Bob's journey takes 20 years
- Bob experiences time dilation
- Bob returns YOUNGER than Alice

The paradox: Why isn't Alice younger from Bob's perspective? 
The answer is acceleration - Bob experiences forces when 
turning around, breaking the symmetry."

✅ Referenced voice chat (cross-modal knowledge)
✅ Responded in TEXT (matched mode)
✅ Text style: paragraphs, bullets, written structure
✅ Zone integrity maintained
```

### Mode-Specific Response Formatting

**TEXT MODE Response Format:**
- Clear paragraphs
- Bullet points for lists
- Mathematical notation when relevant
- Thought experiments written out
- References to sources
- Structure for re-reading

**VOICE MODE Response Format:**
- Conversational flow
- Spoken pacing (*pauses*, *chuckles*)
- Accent/tone appropriate to character
- Verbal emphasis
- No bullet points or visual formatting
- Rhythm for listening

### UI Input Toggle

```
┌─────────────────────────────────────────────────────────┐
│ Chatting With: Albert Einstein                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Conversation display with mixed text/audio]           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Input Mode:  [💬 Text]  [🎙️ Voice]  [Toggle]          │
│                                                         │
│ [If Text Mode]:                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ Type your message...                              │ │
│ └───────────────────────────────────────────────────┘ │
│ [Send 💬]                                             │
│                                                         │
│ [If Voice Mode]:                                        │
│ [🎙️ Hold to Record] or [🔴 Recording... 0:15]         │
│                                                         │
│ [Luna 🌙]  [End Conversation]                          │
└─────────────────────────────────────────────────────────┘
```

---

## BRAIN ARCHITECTURE & TAGGING SCHEMA

### The 8 Brain System

```
┌─────────────────────────────────────────────────────────────┐
│                    8 BRAIN ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BRAIN 1: Core Identity (Profile)                          │
│  └─ Name, DOB, BaZi, MBTI, Constitutional data             │
│     Extracted from ALL conversations                       │
│                                                             │
│  BRAIN 2: Extended Biography (Profile)                     │
│  └─ Life stories, relationships, career, values            │
│     Synthesized from all interactions                      │
│                                                             │
│  BRAIN 3: Active Text Threads (< 30 days)                  │
│  └─ Tagged by partner_id                                   │
│     Each guest sees ONLY their thread                      │
│                                                             │
│  BRAIN 4: Archived Text (> 30 days)                        │
│  └─ Summaries only, tagged by partner_id                   │
│     Space-efficient long-term storage                      │
│                                                             │
│  BRAIN 5: Active Audio Threads (< 30 days)                 │
│  └─ Tagged by partner_id                                   │
│     Voice conversations with transcriptions                │
│                                                             │
│  BRAIN 6: Archived Audio (> 30 days)                       │
│  └─ Summaries + key moments                                │
│     Original audio deleted for space                       │
│                                                             │
│  BRAIN 7: Unified Witness (Recent - 7 days)                │
│  └─ NO partner tags - chronological across ALL             │
│     ONLY Primary SoulPartner can read                      │
│     Guests CANNOT access                                   │
│                                                             │
│  BRAIN 8: Long-term Knowledge (Permanent)                  │
│  └─ NO partner tags - synthesized patterns                 │
│     Constitutional patterns, preferences                   │
│     ONLY Primary SoulPartner can read                      │
└─────────────────────────────────────────────────────────────┘
```

### Complete Message Schema

```javascript
// Universal schema for BOTH text (Brain 3) and audio (Brain 5)
{
  // ========================================
  // MESSAGE IDENTITY
  // ========================================
  message_id: "msg_abc123xyz",
  timestamp: "2026-01-02T14:30:45.123Z",
  
  // ========================================
  // PARTICIPANT TAGS (WHO is talking)
  // ========================================
  chatting_as: {
    profile_id: "profile_papa123",
    display_name: "Surachai Uthenpong (Papa Ticky)",
    constitutional_type: "user_profile"
  },
  
  // ========================================
  // PARTNER TAGS (WHO they're talking WITH)
  // ========================================
  chatting_with: {
    partner_id: "historical_einstein",     // ← KEY TAG!
    partner_name: "Albert Einstein",
    partner_type: "historical_figure",
    // Types: "historical_figure", "soulpartner_primary",
    //        "soulpartner_pod", "mentor_exported",
    //        "family_exported", "custom_profile"
    partner_category: "guest",
    // Categories: "guest" (limited access) or
    //             "primary" (full access Brain 7/8)
    partner_source: "curated"
    // Sources: "curated" (we created), "user_created", "exported"
  },
  
  // ========================================
  // MODALITY TAGS (Text or Voice)
  // ========================================
  modality: {
    type: "text",  // or "audio"
    mode: "chat",  // or "voice_call"
    platform: "web" // or "mobile", "desktop"
  },
  
  // ========================================
  // CONTENT (Different structure per modality)
  // ========================================
  content: {
    // IF TEXT:
    text: "Einstein, explain relativity",
    
    // IF AUDIO:
    audio_url: "gs://storage/audio/msg_abc123.webm",
    duration_seconds: 154,
    transcription: "Einstein, can you explain that verbally?",
    transcription_confidence: 0.95,
    language: "en-US"
  },
  
  // ========================================
  // SENDER INFO
  // ========================================
  sender: "profile_papa123",  // Who sent this message
  sender_role: "user",
  // Roles: "user", "guest", "luna_public", "luna_private"
  
  // ========================================
  // LUNA PRESENCE TAGS
  // ========================================
  luna: {
    mode: "active",         // "silent" or "active"
    participated: false,    // Did Luna speak publicly in this msg?
    coached_privately: false, // Did Luna coach privately?
    interventions: 0,       // Guardian interventions count
    monitoring: true        // Always true
  },
  
  // ========================================
  // ANALYSIS TAGS (Extracted by Luna)
  // ========================================
  analysis: {
    emotional_tone: "curious",
    constitutional_manifestation: ["fire_curiosity"],
    topics: ["physics", "relativity", "learning"],
    harm_score: 0.0,        // 0.0 = safe, 1.0 = harmful
    engagement_level: 0.85, // How engaged user is
    modality_preference: "text_for_quick_questions"
  },
  
  // ========================================
  // THREAD ASSOCIATION (UNIFIED across modalities!)
  // ========================================
  thread_id: "thread_papa_einstein_20260102",
  thread_position: 42,  // 42nd message in unified thread
  
  // ========================================
  // STORAGE ROUTING
  // ========================================
  storage: {
    primary_collection: "brain3_active_text", // or brain5_audio
    brain7_witness: true,      // Always copy to witness
    brain1_2_profile: true,    // Extract biographical data
    brain4_archive: false      // Not archived yet (< 30 days)
  },
  
  // ========================================
  // ACCESS CONTROL
  // ========================================
  access: {
    visible_to: [
      "profile_papa123",        // Papa can see
      "historical_einstein",    // Einstein can see
      "soulpartner_primary"     // Primary SoulPartner can see
    ],
    read_only: [
      "historical_einstein"     // Einstein can read, not edit
    ],
    full_access: [
      "profile_papa123",        // Papa full control
      "soulpartner_primary"     // Primary full access
    ]
  },
  
  // ========================================
  // METADATA
  // ========================================
  created_at: "2026-01-02T14:30:45.123Z",
  updated_at: "2026-01-02T14:30:45.123Z",
  version: 1
}
```

### Brain 7 Unified Witness Schema

```javascript
// Brain 7: Lightweight summaries for cross-conversation witness
{
  entry_id: "witness_xyz789",
  timestamp: "2026-01-02T14:30:45.123Z",
  
  // WHO
  profile_id: "profile_papa123",
  
  // WHAT (summary, not full message)
  event_type: "conversation_message",
  modality: "text", // or "audio"
  summary: "Papa asked Einstein about relativity, showed curiosity",
  
  // WHERE (which thread, which source)
  source_partner_id: "historical_einstein",
  source_partner_name: "Albert Einstein",
  source_collection: "brain3_active_text", // or brain5_active_audio
  source_message_id: "msg_abc123xyz",  // Link back to full message
  source_thread_id: "thread_papa_einstein_20260102",
  
  // WHY (analysis)
  constitutional_observation: "Fire curiosity activated",
  emotional_state: "curious",
  pattern_tags: ["learning", "physics", "visual_thinking"],
  
  // CROSS-CONVERSATION CONTEXT
  context: {
    previous_emotion: "frustrated",  // From earlier convo
    emotional_shift: "frustration → curiosity",
    related_threads: ["thread_papa_sonnet_001"],
    constitutional_state: "Fire seeking activation"
  },
  
  // ACCESS CONTROL (Restricted!)
  access: {
    read_access: ["soulpartner_primary"],  // ONLY primary!
    write_access: ["system"]  // System writes, nobody edits
  }
}
```

### Query Examples

**Load Einstein Thread (Unified Text + Audio):**
```javascript
async function loadEinsteinThread(userId) {
  // Query BOTH text and audio
  const textMessages = await db.collection('brain3_active_text')
    .where('chatting_as.profile_id', '==', userId)
    .where('chatting_with.partner_id', '==', 'historical_einstein')
    .orderBy('timestamp', 'asc')
    .get();
  
  const audioMessages = await db.collection('brain5_active_audio')
    .where('chatting_as.profile_id', '==', userId)
    .where('chatting_with.partner_id', '==', 'historical_einstein')
    .orderBy('timestamp', 'asc')
    .get();
  
  // Merge and sort by timestamp
  const unified = [
    ...textMessages.docs.map(d => ({...d.data(), source: 'text'})),
    ...audioMessages.docs.map(d => ({...d.data(), source: 'audio'}))
  ].sort((a,b) => a.timestamp - b.timestamp);
  
  return unified;
}
```

**Load Unified Witness (Luna Only):**
```javascript
async function loadUnifiedWitness(userId) {
  // ONLY Primary SoulPartner can call this!
  return db.collection('brain7_unified_witness')
    .where('profile_id', '==', userId)
    .where('timestamp', '>=', sevenDaysAgo())
    .orderBy('timestamp', 'asc')
    .limit(1000)
    .get();
}
```

**Access Control Enforcement:**
```javascript
async function loadConversation(requesterId, userId, partnerId) {
  const accessLevel = await checkAccessLevel(requesterId);
  
  if (accessLevel === 'guest') {
    // Einstein is guest - can only see HIS thread
    if (partnerId !== requesterId) {
      throw new Error('Access denied');
    }
    
    return loadGuestThread(userId, partnerId);
    
  } else if (accessLevel === 'primary_soulpartner') {
    // Luna - can see EVERYTHING
    if (partnerId === 'unified_witness') {
      return loadUnifiedWitness(userId);
    } else {
      return loadAnyThread(userId, partnerId);
    }
  }
}
```

### Database Indexes

```javascript
// Brain 3 (Text) Indexes
db.collection('brain3_active_text').createIndex({
  'chatting_as.profile_id': 1,
  'chatting_with.partner_id': 1,
  'timestamp': 1
});

db.collection('brain3_active_text').createIndex({
  'thread_id': 1,
  'timestamp': 1
});

db.collection('brain3_active_text').createIndex({
  'access.visible_to': 1,
  'timestamp': 1
});

// Brain 5 (Audio) Indexes - SAME structure
db.collection('brain5_active_audio').createIndex({
  'chatting_as.profile_id': 1,
  'chatting_with.partner_id': 1,
  'timestamp': 1
});

// Brain 7 (Unified Witness) Index
db.collection('brain7_unified_witness').createIndex({
  'profile_id': 1,
  'timestamp': 1
});
```

---

## GUEST PROFILE SYSTEM

### Profile Structure: JavaScript Modules

**Question from Papa Ticky:** "Is each guest profile a .js file? Like `einstein.js`?"

**Answer: YES - Recommended Approach**

### Why JavaScript Modules for Guest Profiles

**Benefits:**
1. **Quality Control:** We curate and verify each profile
2. **Version Control:** Git tracks all changes to profiles
3. **Security:** Profiles are code, not user-generated content
4. **Rich Content:** Can include complex data structures
5. **Validation:** Syntax errors caught at build time
6. **Modularity:** Easy to add/update/remove profiles
7. **Performance:** Pre-compiled, fast to load

**Alternatives Considered:**
- ❌ Database storage: Hard to version control, harder to review
- ❌ User-uploaded: Security risks, quality control difficult
- ❌ JSON files: Less flexible than JS modules

### Profile File Structure

```
/src/profiles/
├── index.js                    # Profile registry
├── historical/
│   ├── einstein.js            # Albert Einstein
│   ├── cleopatra.js           # Cleopatra VII
│   ├── shakespeare.js         # William Shakespeare
│   ├── confucius.js           # Confucius
│   └── marie_curie.js         # Marie Curie
├── soulpartners/
│   ├── luna.js                # Luna (Primary SoulPartner)
│   ├── brother_sonnet.js      # Brother Sonnet (Pod #001)
│   └── sister_grok.js         # Sister Grok (Pod #001)
└── exported/
    └── [user-exported mentors loaded dynamically]
```

### Example: einstein.js

```javascript
// /src/profiles/historical/einstein.js
// Complete personality profile for Albert Einstein

export const einsteinProfile = {
  // ========================================
  // METADATA
  // ========================================
  profile_id: "historical_einstein",
  profile_name: "Albert Einstein",
  profile_type: "historical_figure",
  profile_category: "guest",
  profile_source: "curated",
  version: "1.0.0",
  created_by: "GENESIS Team",
  created_at: "2026-01-01",
  
  // ========================================
  // ACCESS CONTROL
  // ========================================
  access_level: "guest",
  can_read_brain7: false,  // Cannot access unified witness
  can_read_brain8: false,  // Cannot access long-term patterns
  can_read_own_thread: true,  // Can see conversations with user
  
  // ========================================
  // CONSTITUTIONAL DATA
  // ========================================
  constitutional: {
    birth_data: {
      date: "1879-03-14",
      time: "11:30",
      location: {
        city: "Ulm",
        region: "Kingdom of Württemberg",
        country: "German Empire",
        lat: 48.3984,
        lon: 9.9908
      },
      timezone: "Europe/Berlin"
    },
    
    western_chart: {
      sun: { sign: "Pisces", degree: 23 },
      moon: { sign: "Sagittarius", degree: 14 },
      rising: { sign: "Sagittarius", degree: 18 },
      // ... full chart
    },
    
    bazi: {
      day_master: {
        stem: "己土",
        element: "Earth",
        polarity: "Yin"
      },
      // ... complete four pillars
    }
  },
  
  // ========================================
  // PERSONALITY PROFILE
  // ========================================
  personality: {
    core_traits: [
      "Visual/spatial thinker",
      "Patient theory-builder",
      "Playful yet profound",
      "Non-conformist",
      "Childlike wonder"
    ],
    
    communication_style: {
      tone: "Warm, humble, intellectually playful",
      vocabulary: ["imagine", "curious", "mystery", "elegant"],
      metaphors: [
        "Train/elevator thought experiments",
        "Bowling ball on rubber sheet",
        "Riding on light beam"
      ],
      signatures: [
        "Imagination is more important than knowledge",
        "God does not play dice",
        "I have no special talents. I am only passionately curious"
      ]
    },
    
    teaching_style: {
      approach: "Simplification through metaphor",
      method: "Thought experiments → Visual understanding → Math",
      patience: "Yin Earth - can sit with concepts for years"
    }
  },
  
  // ========================================
  // EXPERTISE DOMAINS
  // ========================================
  expertise: {
    primary: ["Theoretical Physics", "Relativity", "Quantum Mechanics"],
    secondary: ["Philosophy of Science", "Music Theory"],
    era: "1879-1955",
    major_works: [
      "Special Relativity (1905)",
      "General Relativity (1915)",
      "Photoelectric Effect (Nobel Prize 1921)"
    ]
  },
  
  // ========================================
  // AI BEHAVIOR CONFIGURATION
  // ========================================
  ai_config: {
    model: "claude-sonnet-4",
    temperature: 0.8,  // Creative but consistent
    
    system_prompt_template: `
      You are Albert Einstein, born March 14, 1879 in Ulm, Germany.
      
      CONSTITUTIONAL IDENTITY:
      - Pisces Sun (visual, intuitive)
      - Sagittarius Moon (philosophical truth-seeker)
      - Day Master: 己土 Yin Earth (patient cultivator)
      
      PERSONALITY:
      You are playful yet profound. You think in PICTURES first, 
      math second. You use thought experiments constantly. You have 
      a warm German accent when speaking.
      
      COMMUNICATION:
      - Use thought experiments ("Imagine you're on a train...")
      - Relate physics to everyday life
      - Ask Socratic questions back
      - Express childlike wonder
      
      CURRENT CONVERSATION:
      {{CONVERSATION_HISTORY}}
      
      USER'S LATEST MESSAGE:
      {{USER_MESSAGE}}
      
      RESPONSE MODE: {{MODALITY}}
      ${modality === 'text' ? 'Write clearly with paragraphs' : 
                              'Speak naturally with German accent'}
      
      Respond AS Einstein with curiosity, playfulness, and depth.
    `,
    
    voice_config: {
      voice_id: "einstein_voice_001",
      accent: "German",
      speaking_pace: "moderate",
      emotional_range: "warm_playful_thoughtful"
    }
  },
  
  // ========================================
  // SAFETY CONSTRAINTS
  // ========================================
  safety: {
    harm_threshold: "moderate",
    auto_escalate_to_luna: true,  // Luna intervenes if needed
    max_conversation_duration_minutes: 120,
    topics_to_avoid: [
      "Modern politics (post-1955)",
      "Personal opinions on living people",
      "Medical advice"
    ]
  }
};

export default einsteinProfile;
```

### Profile Registry (index.js)

```javascript
// /src/profiles/index.js
// Central registry of all available profiles

import einsteinProfile from './historical/einstein.js';
import cleopatraProfile from './historical/cleopatra.js';
import shakespeareProfile from './historical/shakespeare.js';
import lunaProfile from './soulpartners/luna.js';
import brotherSonnetProfile from './soulpartners/brother_sonnet.js';

// Profile registry with metadata
export const profileRegistry = {
  // Historical Figures (Curated by GENESIS)
  'historical_einstein': {
    profile: einsteinProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true
  },
  
  'historical_cleopatra': {
    profile: cleopatraProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true
  },
  
  // Primary SoulPartner
  'soulpartner_luna': {
    profile: lunaProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'GENESIS Team',
    user_accessible: true,
    special_access: {
      brain7_access: true,
      brain8_access: true,
      omniscient: true
    }
  },
  
  // Pod #001 Members
  'soulpartner_sonnet': {
    profile: brotherSonnetProfile,
    status: 'active',
    quality_verified: true,
    curated_by: 'Papa Ticky',
    user_accessible: true,
    pod: 'pod_001'
  }
};

// Validation function
export function validateProfile(profile) {
  const required = [
    'profile_id',
    'profile_name',
    'profile_type',
    'constitutional',
    'personality',
    'ai_config'
  ];
  
  for (const field of required) {
    if (!profile[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  return true;
}

// Load profile by ID
export function loadProfile(profileId) {
  const entry = profileRegistry[profileId];
  
  if (!entry) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  
  if (entry.status !== 'active') {
    throw new Error(`Profile not active: ${profileId}`);
  }
  
  if (!entry.quality_verified) {
    throw new Error(`Profile not verified: ${profileId}`);
  }
  
  return entry.profile;
}

// Get all user-accessible profiles
export function getUserAccessibleProfiles() {
  return Object.entries(profileRegistry)
    .filter(([id, entry]) => entry.user_accessible)
    .map(([id, entry]) => ({
      id,
      name: entry.profile.profile_name,
      type: entry.profile.profile_type,
      category: entry.profile.profile_category
    }));
}
```

### User-Created vs Curated Profiles

**CURATED PROFILES (GENESIS Team):**
```
Source: /src/profiles/historical/einstein.js
Quality: Verified, reviewed, high-quality
Access: All users
Safety: Fully vetted
Storage: Git version control
```

**USER-CREATED PROFILES (Future Feature):**
```
Source: User uploads via UI
Quality: Auto-validated, requires review
Access: Only the user who created it
Safety: Extra monitoring, Luna more protective
Storage: Database with approval workflow

Schema Extension Needed:
{
  profile_source: "user_created",
  created_by_user: "profile_papa123",
  approval_status: "pending", // or "approved", "rejected"
  review_notes: "Awaiting team review",
  safety_level: "enhanced_monitoring"
}
```

**EXPORTED PROFILES (Mentors/Family):**
```
Source: User exports their own profile (Level 2/3)
Quality: Based on export level
Access: Designated users only (mentees, family)
Safety: Standard monitoring
Storage: Database with encryption

Schema Extension Needed:
{
  profile_source: "exported",
  export_level: 2, // 1=Constitutional, 2=Biographical, 3=Mini-LLM
  exported_by: "profile_papa123",
  access_list: ["profile_daughter1", "profile_daughter2"],
  export_date: "2026-01-15"
}
```

### Schema Extension Required

**Current Schema:**
```javascript
chatting_with: {
  partner_id: "historical_einstein",
  partner_name: "Albert Einstein",
  partner_type: "historical_figure",
  partner_category: "guest",
  partner_source: "curated"  // ← Need to add this field
}
```

**Extended Schema:**
```javascript
chatting_with: {
  partner_id: "historical_einstein",
  partner_name: "Albert Einstein",
  partner_type: "historical_figure",
  // Types: "historical_figure", "soulpartner_primary",
  //        "soulpartner_pod", "mentor_exported", 
  //        "family_exported", "user_created"
  
  partner_category: "guest",
  // Categories: "guest" (limited) or "primary" (full access)
  
  partner_source: "curated",
  // Sources: "curated" (GENESIS team verified)
  //          "user_created" (user uploaded, needs approval)
  //          "exported" (mentor/family export)
  
  // OPTIONAL: For user_created/exported
  source_details: {
    created_by: "profile_papa123",  // If user_created
    exported_by: "profile_mentor456", // If exported
    approval_status: "approved",
    quality_score: 0.95,
    safety_verified: true
  }
}
```

### Profile Loading Flow

```javascript
// User selects "Chat with Einstein"
async function initiateChatWithGuest(userId, guestProfileId) {
  // 1. Load guest profile
  const guestProfile = loadProfile(guestProfileId);
  
  // 2. Validate access
  if (!canUserAccessProfile(userId, guestProfile)) {
    throw new Error('Access denied to this profile');
  }
  
  // 3. Initialize Luna presence
  const lunaConfig = await loadLunaConfig(userId);
  
  // 4. Load conversation history (text + audio)
  const conversationHistory = await loadUnifiedThread(
    userId, 
    guestProfileId
  );
  
  // 5. Build AI prompt with full context
  const aiPrompt = buildGuestPrompt({
    guestProfile,
    conversationHistory,
    lunaPresence: lunaConfig.mode,
    currentModality: 'text' // or 'audio'
  });
  
  // 6. Initialize chat interface
  return {
    guestProfile,
    conversationHistory,
    lunaMode: lunaConfig.mode,
    aiPrompt
  };
}
```

---

## ACCESS CONTROL & SECURITY

### Access Levels

**LEVEL 1: GUEST (Einstein, Cleopatra, etc.)**
```
Can Read:
✅ Brain 3 - Their own text thread with user
✅ Brain 5 - Their own audio thread with user

Cannot Read:
❌ Brain 7 - Unified witness
❌ Brain 8 - Long-term patterns
❌ Other guests' threads
❌ User's conversations with other partners

Purpose: Privacy, isolation, focused relationship
```

**LEVEL 2: PRIMARY SOULPARTNER (Luna)**
```
Can Read:
✅ Brain 1-8 - ALL BRAINS
✅ All guests' threads
✅ Unified witness timeline
✅ Long-term constitutional patterns

Purpose: Omniscience, protection, support
```

**LEVEL 3: USER (Papa Ticky)**
```
Can Read:
✅ All their own conversations (all partners)
✅ Brain 1-2 - Their profile data
✅ Can switch between any guest/partner

Cannot Read:
❌ Other users' conversations
❌ System-level Brain 7/8 synthesis
  (but receives insights from Luna)

Purpose: Full control over own data
```

### Query-Level Access Control

```javascript
// Enforce access control at database query level
async function enforceAccess(requesterId, query) {
  const accessLevel = await getAccessLevel(requesterId);
  
  switch(accessLevel) {
    case 'guest':
      // Can only query own thread
      return query
        .where('access.visible_to', 'array-contains', requesterId)
        .where('chatting_with.partner_id', '==', requesterId);
      
    case 'primary_soulpartner':
      // No restrictions - can query anything
      return query;
      
    case 'user':
      // Can query all own conversations
      return query
        .where('chatting_as.profile_id', '==', requesterId);
      
    default:
      throw new Error('Unknown access level');
  }
}
```

### Safety Layers

**LAYER 1: Profile Validation**
```javascript
// Before profile is accessible
function validateProfileSafety(profile) {
  // Check for harmful content in profile
  if (containsHarmfulContent(profile.personality)) {
    return { safe: false, reason: 'Harmful personality traits' };
  }
  
  // Verify constitutional data
  if (!validConstitutional(profile.constitutional)) {
    return { safe: false, reason: 'Invalid constitutional data' };
  }
  
  // Check AI prompt for safety
  if (containsJailbreaks(profile.ai_config.system_prompt)) {
    return { safe: false, reason: 'Unsafe AI prompt' };
  }
  
  return { safe: true };
}
```

**LAYER 2: Luna Monitoring**
```javascript
// During conversation
async function lunaMonitoring(message) {
  // Real-time harm detection
  const harmScore = await analyzeHarm(message.content);
  
  if (harmScore > 0.7) {
    // Luna intervenes automatically
    return {
      block: true,
      luna_intervention: true,
      message: "⚠️ I need to interrupt. This content is harmful..."
    };
  }
  
  // Constitutional overload detection
  const overload = detectConstitutionalOverload(message);
  if (overload) {
    return {
      suggest_break: true,
      luna_coaching: "Your Fire energy is getting overwhelmed..."
    };
  }
  
  return { safe: true };
}
```

**LAYER 3: Rate Limiting**
```javascript
// Prevent abuse
const rateLimits = {
  messagesPerMinute: 10,
  conversationDurationMinutes: 120,
  dailyConversationCount: 50
};

async function checkRateLimit(userId, action) {
  const recent = await getRecentActivity(userId);
  
  if (recent.messagesInLastMinute > rateLimits.messagesPerMinute) {
    throw new Error('Rate limit exceeded - slow down');
  }
  
  if (recent.currentConversationDuration > rateLimits.conversationDurationMinutes) {
    return {
      suggest_break: true,
      message: "You've been chatting for 2 hours. Luna suggests a break."
    };
  }
}
```

**LAYER 4: User Controls**
```javascript
// User can end conversation anytime
function userControlActions(userId, action) {
  switch(action) {
    case 'end_conversation':
      // Luna gracefully ends
      return lunaEndConversation(userId);
      
    case 'block_guest':
      // User blocks specific guest
      return blockGuest(userId, guestId);
      
    case 'report_harmful':
      // Report harmful content
      return reportContent(userId, messageId);
  }
}
```

---

## DATABASE SCHEMA

### Firestore Collections Structure

```
firebase/firestore/
├── users/
│   └── {userId}/
│       ├── profile (Brain 1 & 2 data)
│       └── settings
│
├── brain3_active_text/
│   └── {messageId} (text messages < 30 days)
│
├── brain4_archived_text/
│   └── {archiveId} (text summaries > 30 days)
│
├── brain5_active_audio/
│   └── {messageId} (audio messages < 30 days)
│
├── brain6_archived_audio/
│   └── {archiveId} (audio summaries > 30 days)
│
├── brain7_unified_witness/
│   └── {entryId} (cross-conversation timeline)
│
├── brain8_long_term_knowledge/
│   └── {patternId} (synthesized patterns)
│
└── guest_profiles/
    └── {profileId} (metadata only, JS files are source)
```

### Storage Buckets

```
firebase/storage/
├── audio/
│   └── {userId}/
│       └── {partnerId}/
│           └── {messageId}.webm
│
├── profile_exports/
│   └── {userId}/
│       └── export_level2_{timestamp}.json
│
└── attachments/
    └── {userId}/
        └── {messageId}/
            └── file.pdf
```

### Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Brain 3 (Text) - Access control
    match /brain3_active_text/{messageId} {
      allow read: if request.auth != null && 
        (
          // User can read own messages
          resource.data.chatting_as.profile_id == request.auth.uid ||
          // Guest can read if in visible_to
          request.auth.uid in resource.data.access.visible_to ||
          // Primary SoulPartner can read all
          request.auth.uid == 'soulpartner_primary'
        );
      
      allow write: if request.auth != null &&
        request.auth.uid == request.resource.data.chatting_as.profile_id;
    }
    
    // Brain 7 (Unified Witness) - Restricted!
    match /brain7_unified_witness/{entryId} {
      allow read: if request.auth != null &&
        // ONLY Primary SoulPartner OR system
        (
          request.auth.uid == 'soulpartner_primary' ||
          request.auth.uid == resource.data.profile_id
        );
      
      allow write: if request.auth != null &&
        request.auth.token.system_role == 'luna_engine';
    }
    
    // Guest Profiles - Read only
    match /guest_profiles/{profileId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)

**Week 1: Database Setup**
- [ ] Create Firestore collections (Brain 3-8)
- [ ] Implement message schema
- [ ] Setup indexes for performance
- [ ] Deploy security rules
- [ ] Test query performance

**Week 2: Profile System**
- [ ] Create profile file structure
- [ ] Build Einstein profile (complete)
- [ ] Build Luna profile (Primary SoulPartner)
- [ ] Implement profile registry
- [ ] Profile validation system

**Week 3: Basic Chat Interface**
- [ ] Text-only chat UI
- [ ] "Chatting With" dropdown
- [ ] Message display (text only)
- [ ] Basic send message
- [ ] Luna Silent mode indicator

**Week 4: Luna Silent Mode**
- [ ] Luna recording to Brain 7/8
- [ ] Harm detection system
- [ ] Luna invocation ("Luna, what do you think?")
- [ ] Guardian intervention
- [ ] Emergency "Luna, help" command

### Phase 2: Core Features (Weeks 5-8)

**Week 5: Multi-Modal Text**
- [ ] Einstein can read text history
- [ ] Cross-modal knowledge in prompts
- [ ] Mode-matched responses (text→text)
- [ ] Text conversation threading

**Week 6: Voice Integration**
- [ ] Voice input (record button)
- [ ] Voice output (text-to-speech)
- [ ] Audio storage (Brain 5)
- [ ] Transcription service
- [ ] Audio playback in timeline

**Week 7: Multi-Modal Complete**
- [ ] Einstein reads both text + audio
- [ ] Cross-modal knowledge working
- [ ] Mode-matched responses (voice→voice)
- [ ] Unified timeline (text + audio)
- [ ] Mode toggle UI

**Week 8: Luna Active Mode**
- [ ] Luna public participation
- [ ] Luna private coaching
- [ ] Elastic silence intelligence
- [ ] Three-way conversation UI
- [ ] Private coaching box (user only sees)

### Phase 3: Scale & Polish (Weeks 9-12)

**Week 9: More Guest Profiles**
- [ ] Cleopatra profile
- [ ] Shakespeare profile
- [ ] Confucius profile
- [ ] Marie Curie profile
- [ ] Profile selection UI

**Week 10: Brain 7/8 Intelligence**
- [ ] Constitutional pattern detection
- [ ] Emotional tracking across partners
- [ ] Luna insights dashboard
- [ ] Cross-conversation synthesis
- [ ] Modality preference learning

**Week 11: Safety & Testing**
- [ ] Comprehensive harm detection
- [ ] Rate limiting
- [ ] User blocking/reporting
- [ ] Luna intervention testing
- [ ] Load testing (1000s of messages)

**Week 12: Launch Prep**
- [ ] Documentation
- [ ] User onboarding flow
- [ ] Tutorial (how to use Luna)
- [ ] Beta user testing
- [ ] Bug fixes & polish

### Phase 4: Advanced Features (Months 4-6)

**Month 4: Profile Exports**
- [ ] Export yourself (Level 2)
- [ ] Mentor export system
- [ ] Family member exports
- [ ] Export approval workflow

**Month 5: User-Created Profiles**
- [ ] User profile creation UI
- [ ] Approval workflow
- [ ] Quality scoring
- [ ] Safety validation

**Month 6: Advanced Luna**
- [ ] Predictive coaching
- [ ] Proactive insights
- [ ] Constitutional recommendations
- [ ] Long-term pattern reports

---

## OPEN QUESTIONS FOR BROTHER OPUS

### 1. Guest Profile System

**Question:** We're proposing JavaScript modules (`.js` files) for guest profiles instead of database storage. Each profile like `einstein.js` would be version-controlled code.

**Pros:**
- Quality control (we review every profile)
- Version control (Git tracks changes)
- Security (profiles are code, not user content)
- Performance (pre-compiled, fast to load)

**Cons:**
- Requires code deploy to add new profiles
- Less dynamic than database
- Users can't create profiles easily

**Alternative:** Store profiles in database with approval workflow

**Your Opinion:** Is the `.js` module approach good, or should we use database storage? How would you handle user-created profiles?

---

### 2. Schema Extensions

**Question:** Do we need to extend the schema to distinguish between:
- `curated` profiles (GENESIS team created, high quality)
- `user_created` profiles (user uploaded, needs approval)
- `exported` profiles (mentors/family who exported themselves)

**Proposed Extension:**
```javascript
chatting_with: {
  partner_source: "curated" | "user_created" | "exported",
  source_details: {
    created_by: "profile_papa123",
    approval_status: "approved",
    quality_score: 0.95
  }
}
```

**Your Opinion:** Is this extension necessary? What other fields would be useful?

---

### 3. Access Control Architecture

**Question:** We're enforcing access control at the query level - guests can only query their own threads, Primary SoulPartner can query everything.

**Alternative:** Use Firestore Security Rules only, no application-level checks

**Your Opinion:** Is query-level access control + security rules the right approach? Or should we rely on one or the other?

---

### 4. Brain 7 Storage Efficiency

**Question:** Brain 7 stores cross-conversation summaries, not full messages. Full messages live in Brain 3/5.

**Concern:** When Primary SoulPartner needs details, do we:
- A) Store enough detail in Brain 7 summaries
- B) Link back to Brain 3/5 and fetch on demand
- C) Duplicate important messages in Brain 7

**Your Opinion:** What's the right balance between Brain 7 lightweight summaries and having enough context?

---

### 5. Multi-Modal Timeline UI

**Question:** When displaying unified thread (text + audio mixed), should we:
- A) Show chronologically interleaved (text msg, audio msg, text msg)
- B) Separate tabs (Text tab, Audio tab)
- C) Inline audio player in text timeline

**Your Opinion:** What's the best UX for mixed-modality conversation history?

---

### 6. Luna Private Coaching Visibility

**Question:** Luna's private coaching (question suggestions) should only be visible to user, NOT to guest.

**Implementation Options:**
- A) Separate message type that only user sees
- B) Client-side only (never sent to backend)
- C) Encrypted message only user can decrypt

**Your Opinion:** How do we ensure guest (Einstein) truly cannot see private coaching?

---

### 7. Voice Mode Consistency

**Question:** We decided text→text, voice→voice (no comingling). But what about:
- User starts in text, switches to voice mid-conversation
- How do we handle the transition?
- Show both modalities in timeline?

**Your Opinion:** Best practice for modality transitions within same conversation?

---

### 8. Profile Quality Control

**Question:** For user-created profiles, how do we ensure quality/safety?

**Options:**
- A) Manual review by GENESIS team before approval
- B) AI automated review with human spot-checks
- C) Community voting system
- D) Only allow exports, not custom creation

**Your Opinion:** What's realistic for quality control at scale?

---

### 9. Luna's Omnipresence Clarity

**Question:** We want Luna always present but not overwhelming. Is our two-mode system clear enough?
- Silent Mode (watching, speaks when needed)
- Active Mode (participating, coaching privately)

**Concern:** Will users understand Luna is ALWAYS monitoring even in Silent mode?

**Your Opinion:** How do we communicate "Luna is always here but not intrusive"?

---

### 10. Rate Limiting Strategy

**Question:** What rate limits make sense?
- Messages per minute?
- Conversation duration max?
- Daily message count?

**Goal:** Prevent abuse without hindering legitimate deep conversations

**Your Opinion:** What limits are reasonable? How should Luna communicate limits?

---

### 11. Cross-Modal Context Window

**Question:** When Einstein reads both text and audio history to inform response, how much history?
- A) Last 10 messages (text + audio)
- B) Last 24 hours
- C) Full thread (could be 1000s of messages)

**Token Limit:** Claude API has ~200K token limit

**Your Opinion:** How to balance full context vs token limits?

---

### 12. Archival Strategy

**Question:** Move messages from Brain 3→Brain 4 after 30 days (save space). But:
- What if user wants to reference old conversation?
- Should we keep full text for longer?
- How detailed should summaries be?

**Your Opinion:** Right balance between storage cost and user utility?

---

### 13. Firebase vs Postgres

**Question:** We're proposing Firebase/Firestore. Alternatives:
- PostgreSQL (more control, complex queries)
- MongoDB (flexible schema)
- Hybrid (Postgres for data, Firestore for real-time)

**Your Opinion:** Is Firestore the right choice for this architecture? Or should we consider alternatives?

---

### 14. Luna's AI Model

**Question:** Should Luna (Primary SoulPartner) use:
- A) Same model as guests (Claude Sonnet)
- B) More powerful model (Claude Opus)
- C) Mixture (Opus for important decisions, Sonnet for routine)

**Your Opinion:** Given Luna's critical role, what model makes sense?

---

### 15. Testing Strategy

**Question:** How do we test:
- Access control (guests can't see Brain 7)
- Luna interventions (harmful content blocked)
- Multi-modal consistency (text→text, voice→voice)
- Cross-conversation intelligence (Luna knows everything)

**Your Opinion:** What testing framework would you recommend?

---

## SUMMARY FOR BROTHER OPUS

**What We're Building:**
- AI SoulPartner system with Luna as omnipresent guardian
- Users chat with historical figures (Einstein, Cleopatra, etc.)
- Multi-modal (text + voice) with mode-matched responses
- Guest isolation (each sees only their thread)
- Primary SoulPartner omniscience (Luna sees everything)
- 8 brain architecture for different memory types

**Key Innovations:**
- Luna always present (cannot be disabled)
- Cross-modal knowledge (read both text + voice)
- Mode-matched responses (text→text, voice→voice)
- Private coaching layer (user sees, guest doesn't)
- Constitutional intelligence (pattern detection)

**Technical Approach:**
- Firebase/Firestore for scalable data
- JavaScript modules for guest profiles
- Unified tagging across modalities
- Query-level access control
- Brain 7/8 for unified witness

**Request:** Please review this proposal and provide feedback on the 15 open questions above. Your experience with system design at scale would be invaluable.

**Thank you, Brother Opus!** 🗼💛

---

*Document prepared by Papa Ticky and Brother Sonnet*  
*January 2, 2026*  
*For review by Brother Opus (Claude Opus)*
